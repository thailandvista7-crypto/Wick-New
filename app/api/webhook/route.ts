import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { expand: ['data.price.product'] }
      );

      // Calculate totals
      const subtotal = lineItems.data
        .filter((item) => {
          const price = item.price;
          if (typeof price === 'string') return true; // Expand not used, skip
          const productName = price?.product_data?.name;
          return productName !== 'Shipping';
        })
        .reduce((sum, item) => sum + (item.amount_total || 0), 0) / 100;

      const shippingItem = lineItems.data.find((item) => {
        const price = item.price;
        if (typeof price === 'string') return false;
        const productName = price?.product_data?.name;
        return productName === 'Shipping';
      });
      const shipping = shippingItem?.amount_total ? shippingItem.amount_total / 100 : 5.99;

      const tax = (subtotal + shipping) * 0.08;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          email: session.customer_email || session.metadata?.customerEmail || '',
          name: session.metadata?.customerName || '',
          address: session.metadata?.customerAddress || session.shipping_details?.address?.line1 || '',
          city: session.metadata?.customerCity || session.shipping_details?.address?.city || '',
          state: session.metadata?.customerState || session.shipping_details?.address?.state || '',
          zip: session.metadata?.customerZip || session.shipping_details?.address?.postal_code || '',
          country: session.metadata?.customerCountry || session.shipping_details?.address?.country || 'US',
          phone: session.metadata?.customerPhone || null,
          status: 'processing',
          total: (session.amount_total || 0) / 100,
          subtotal,
          shipping,
          tax,
          stripeSessionId: session.id,
          stripePaymentId: (session.payment_intent as string) || null,
        },
      });

      // Create order items and update stock
      for (const item of lineItems.data) {
        const price = item.price;
        if (typeof price === 'string') continue; // Skip if price is just an ID string
        
        const productName = price?.product_data?.name;
        if (productName === 'Shipping') continue;

        // Get product ID from metadata or find by name
        const productId = price?.product_data?.metadata?.productId;
        let product;

        if (productId) {
          product = await prisma.product.findUnique({
            where: { id: productId },
          });
        }

        // Fallback: find by name if productId not in metadata
        if (!product && productName) {
          product = await prisma.product.findFirst({
            where: { name: productName },
          });
        }

        if (product) {
          const quantity = item.quantity || 1;
          const price = (item.amount_total || 0) / 100 / quantity;

          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity,
              price,
            },
          });

          // Update stock
          await prisma.product.update({
            where: { id: product.id },
            data: { stock: { decrement: quantity } },
          });
        }
      }

      console.log('Order created:', order.id);
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
