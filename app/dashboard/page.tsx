'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Heart } from 'lucide-react';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', {
        credentials: 'include',
      });

      if (response.status === 401) {
        // Not logged in → send to home for now
        window.location.href = '/';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-olive-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-olive-600">
            Your recent orders and account activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/shop"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <ShoppingBag className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              Continue Shopping
            </h3>
            <p className="text-olive-600">Browse our collection</p>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-luxury transition-all"
          >
            <Package className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              View Cart
            </h3>
            <p className="text-olive-600">Review your items</p>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <Heart className="w-8 h-8 text-olive-600 mb-3" />
            <h3 className="text-xl font-semibold text-olive-900 mb-2">
              Wishlist
            </h3>
            <p className="text-olive-600">Coming soon</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-semibold text-olive-900 mb-6">
            Recent Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-olive-600">You have no orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-olive-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olive-100">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 font-mono text-olive-700">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-olive-700">
                        {new Date(order.createdAt).toLocaleDateString()}
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
                      <td className="px-6 py-4 font-semibold text-olive-900">
                        ${order.total.toFixed(2)}
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