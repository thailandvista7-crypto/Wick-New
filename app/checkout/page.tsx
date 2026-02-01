'use client';

import { useState, useEffect } from 'react';
import { getCart, getCartTotal, clearCart, getShippingCost, getRemainingForFreeShipping } from '@/lib/cart';
import { CartItem } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(items);
  }, [router]);

  const subtotal = getCartTotal();
  const shipping = getShippingCost(subtotal);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const remainingForFreeShipping = getRemainingForFreeShipping(subtotal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: formData,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-2xl font-semibold text-olive-900 mb-6">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-2xl font-semibold text-olive-900 mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-olive-700 font-medium mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) =>
                          setFormData({ ...formData, zip: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                      />
                    </div>
                    <div>
                      <label className="block text-olive-700 font-medium mb-2">
                        Country *
                      </label>
                      <select
                        required
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
                <h2 className="text-2xl font-semibold text-olive-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm text-olive-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6 pt-4 border-t border-olive-200">
                  <div className="flex justify-between text-olive-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-olive-700">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {remainingForFreeShipping > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                      <p className="text-amber-800 font-medium">
                        Add ${remainingForFreeShipping.toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}
                  {shipping === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                      <p className="text-green-800 font-medium">
                        🎉 You qualify for free shipping!
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between text-olive-700">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-olive-900 pt-4 border-t border-olive-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </button>
                <p className="text-xs text-olive-500 mt-4 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
