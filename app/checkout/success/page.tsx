'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { clearCart } from '@/lib/cart';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    window.dispatchEvent(new Event('storage'));

    if (!sessionId) return;

    fetch(/api/orders/session/${sessionId})
      .then((res) => res.json())
      .then((data) => {
        if (data?.orderId) {
          setOrderId(data.orderId);
        }
      })
      .catch(console.error);
  }, [sessionId]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Order Confirmed</h1>

      {orderId && <p>Order ID: {orderId}</p>}

      <Link href="/">Back to Home</Link>
    </div>
  );
}