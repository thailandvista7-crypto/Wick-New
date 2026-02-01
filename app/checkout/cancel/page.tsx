import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-luxury">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-olive-900 mb-4">
            Order Cancelled
          </h1>
          <p className="text-lg text-olive-700 mb-6">
            Your checkout was cancelled. No charges were made. Your items are
            still in your cart if you'd like to complete your purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-olive-700 rounded-lg hover:bg-beige-50 transition-all duration-300 shadow-soft font-medium border-2 border-olive-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
