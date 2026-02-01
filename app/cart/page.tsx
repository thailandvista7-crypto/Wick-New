'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, getShippingCost, getRemainingForFreeShipping } from '@/lib/cart';
import { CartItem } from '@/lib/cart';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCartItems(getCart());
    setIsLoading(false);

    const handleStorageChange = () => {
      setCartItems(getCart());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
    setCartItems(getCart());
    toast.success('Cart updated');
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCartItems(getCart());
    toast.success('Item removed from cart');
  };

  const subtotal = getCartTotal();
  const shipping = getShippingCost(subtotal);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  const remainingForFreeShipping = getRemainingForFreeShipping(subtotal);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700 mx-auto mb-4"></div>
          <p className="text-olive-700">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-olive-300 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-olive-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-olive-700 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl p-6 shadow-soft flex gap-6"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex-grow">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-xl font-semibold text-olive-900 hover:text-olive-700 transition-colors mb-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-olive-600 mb-4">
                    ${item.price.toFixed(2)} each
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-olive-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="px-3 py-1 text-olive-700 hover:bg-olive-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-olive-900 font-semibold min-w-[50px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="px-3 py-1 text-olive-700 hover:bg-olive-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-olive-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="text-2xl font-semibold text-olive-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
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
                <div className="border-t border-olive-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-olive-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-center px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium text-lg"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/shop"
                className="block w-full text-center mt-4 text-olive-700 hover:text-olive-600 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
