'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { clearCart } from '@/lib/cart';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();
    window.dispatchEvent(new Event('storage'));

    if (sessionId) {
      // Fetch order details (optional)
      fetch(`/api/orders/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orderId) {
            setOrderId(data.orderId);
          }
        })
        .catch(console.error);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-luxury">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-olive-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-olive-700 mb-6">
            Thank you for your purchase. We've received your order and will send
            you a confirmation email shortly.
          </p>
          {orderId && (
            <p className="text-sm text-olive-600 mb-6">
              Order ID: {orderId}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-olive-700 rounded-lg hover:bg-beige-50 transition-all duration-300 shadow-soft font-medium border-2 border-olive-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
