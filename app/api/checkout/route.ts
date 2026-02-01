import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CheckoutRequestBody {
  items: CartItem[];
  customerInfo: CustomerInfo;
  total?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CheckoutRequestBody;
    const { items, customerInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify products exist and get current prices
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product?.name || item.name,
            images: product?.images || [item.image],
            metadata: {
              productId: item.productId, // Store product ID in metadata
            },
          },
          unit_amount: Math.round((product?.price || item.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Calculate shipping (free if subtotal >= $60)
    const subtotal = items.reduce((sum: number, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || item.price) * item.quantity;
    }, 0);
    
    const FREE_SHIPPING_THRESHOLD = 60;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
    
    // Add shipping as a line item only if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || '',
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerState: customerInfo.state,
        customerZip: customerInfo.zip,
        customerCountry: customerInfo.country,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
