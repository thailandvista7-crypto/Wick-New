'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, Heart, Settings, LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    quantity: number;
    product: {
      name: string;
    };
  }>;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-olive-900 mb-2">
                My Dashboard
              </h1>
              <p className="text-olive-600">
                Welcome back, {session.user?.name || session.user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/shop"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <ShoppingBag className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">Continue Shopping</h3>
            <p className="text-olive-600">Browse our collection</p>
          </Link>
          <Link
            href="/cart"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <Package className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">View Cart</h3>
            <p className="text-olive-600">Review your items</p>
          </Link>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <Heart className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">Wishlist</h3>
            <p className="text-olive-600">Coming soon</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-semibold text-olive-900 mb-6">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-olive-300 mx-auto mb-4" />
              <p className="text-olive-600 mb-4">You haven't placed any orders yet</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-olive-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olive-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-beige-50">
                      <td className="px-6 py-4 text-sm text-olive-600 font-mono">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-olive-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-olive-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                        {order.items.reduce((sum, item) => sum + item.quantity, 0) !== 1
                          ? 's'
                          : ''}
                      </td>
                      <td className="px-6 py-4 text-olive-900 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/track-order?orderId=${order.id}`}
                          className="text-olive-700 hover:text-olive-900 text-sm font-medium"
                        >
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
