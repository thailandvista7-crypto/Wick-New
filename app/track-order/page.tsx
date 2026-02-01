'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) {
      toast.error('Please enter both order ID and email');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate with a mock response
      const response = await fetch(`/api/orders/track?orderId=${orderId}&email=${email}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        toast.success('Order found!');
      } else {
        toast.error('Order not found. Please check your order ID and email.');
        setOrder(null);
      }
    } catch (error) {
      toast.error('Failed to track order. Please try again.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'processing':
        return <Package className="w-6 h-6 text-amber-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="bg-white border-b border-olive-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-olive-700">
            Enter your order ID and email address to track your shipment
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-soft mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                  required
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-soft"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-olive-900">
                  Order #{order.id.slice(0, 8)}
                </h2>
                <div className={`px-4 py-2 rounded-full border font-medium capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              <p className="text-olive-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-olive-900 mb-2">Shipping Address</h3>
                <p className="text-olive-700">
                  {order.name}
                  <br />
                  {order.address}
                  <br />
                  {order.city}, {order.state} {order.zip}
                  <br />
                  {order.country}
                </p>
              </div>
            </div>

            <div className="border-t border-olive-200 pt-6">
              <h3 className="font-semibold text-olive-900 mb-4">Order Items</h3>
              <div className="space-y-2">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-olive-700">
                    <span>
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-olive-200 space-y-2">
                <div className="flex justify-between text-olive-700">
                  <span>Subtotal</span>
                  <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-olive-700">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `$${order.shipping?.toFixed(2) || '0.00'}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-olive-700">
                  <span>Tax</span>
                  <span>${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-olive-900 pt-2 border-t border-olive-200">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!order && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-24 h-24 text-olive-300 mx-auto mb-4" />
            <p className="text-olive-600">
              Enter your order details above to track your shipment
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
