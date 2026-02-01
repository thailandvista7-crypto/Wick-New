'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { clearCart } from '@/lib/cart';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    window.dispatchEvent(new Event('storage'));

    if (!sessionId) return;

    fetch('/api/orders/session/${sessionId}')
      .then((res) => res.json())
      .then((data) => {
        if (data?.orderId) {
          setOrderId(data.orderId);
        }
      })
      .catch(console.error);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center bg-white p-12 rounded-2xl shadow-luxury">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-serif font-bold text-olive-900 mb-4">
          Order Confirmed!
        </h1>

        {orderId && (
          <p className="text-olive-600 mb-6">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="px-6 py-3 border border-olive-300 rounded-lg hover:bg-beige-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}