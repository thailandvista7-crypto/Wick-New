'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication via API since cookie is httpOnly
    fetch('/api/admin/stats')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
        } else {
          // If authenticated, redirect to dashboard
          router.push('/admin/dashboard');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
    </div>
  );
}
