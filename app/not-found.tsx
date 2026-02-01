import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <h1 className="text-6xl font-serif font-bold text-olive-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-olive-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-olive-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-olive-700 rounded-lg hover:bg-beige-50 transition-all duration-300 shadow-soft font-medium border-2 border-olive-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
