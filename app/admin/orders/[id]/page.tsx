'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, User, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string;
  };
}

interface Order {
  id: string;
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number | null;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load order');
      }

      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      setStatus(newStatus);
      if (order) {
        setOrder({ ...order, status: newStatus });
      }
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      processing: 'bg-blue-100 text-blue-700 border-blue-300',
      shipped: 'bg-purple-100 text-purple-700 border-purple-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-olive-900 mb-4">Order not found</h2>
          <Link href="/admin/orders" className="text-olive-700 hover:text-olive-600">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-olive-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-olive-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-lg border-2 font-semibold capitalize ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-semibold text-olive-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-olive-100 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-olive-900">{item.product.name}</h3>
                      <p className="text-sm text-olive-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-olive-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-olive-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-semibold text-olive-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-olive-700">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-olive-700">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                {order.tax && (
                  <div className="flex justify-between text-olive-700">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-olive-200 pt-3 mt-3">
                  <div className="flex justify-between text-olive-900 font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-olive-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-olive-700">
                  <Mail className="w-4 h-4" />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-center gap-2 text-olive-700">
                  <User className="w-4 h-4" />
                  <span>{order.name}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-olive-700">
                    <Phone className="w-4 h-4" />
                    <span>{order.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-olive-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="text-olive-700 space-y-1">
                <p>{order.name}</p>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state} {order.zip}
                </p>
                <p>{order.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            {order.stripePaymentId && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-olive-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h2>
                <div className="space-y-2 text-olive-700">
                  <p className="text-sm">
                    <span className="font-medium">Payment ID:</span>{' '}
                    {order.stripePaymentId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Session ID:</span>{' '}
                    {order.stripeSessionId || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Update Status */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-olive-900 mb-4">Update Status</h2>
              <div className="space-y-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                  (statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => updateStatus(statusOption)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        status === statusOption
                          ? 'bg-olive-700 text-white'
                          : 'bg-olive-50 text-olive-700 hover:bg-olive-100'
                      }`}
                    >
                      {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
