import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-olive-900 text-beige-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-4">Wick & Lather</h3>
            <p className="text-beige-200 mb-4 max-w-md">
              Luxury handcrafted soaps and premium scented candles made in Thailand. Export-quality products crafted with natural ingredients, Thai heritage, and artisanal excellence. Designed for global customers seeking authentic luxury.
            </p>
            <p className="text-beige-300 text-sm mb-4">
              <strong>Crafted in Thailand</strong> | Designed for Global Customers | International Shipping Available
            </p>
            <p className="text-beige-300 text-xs mb-4">
              Our products are handcrafted in Thailand using traditional artisan techniques and premium natural ingredients. Each item meets international safety and quality standards, ensuring export-ready products for customers in the US, EU, GCC, Asia, and worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/wickandlather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige-300 hover:text-beige-50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/wickandlather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige-300 hover:text-beige-50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@wickandlather.com"
                className="text-beige-300 hover:text-beige-50 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=soap"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Soaps
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=candle"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Candles
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-beige-200 hover:text-beige-50 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-olive-800">
          <div className="max-w-md">
            <h4 className="font-semibold mb-2">Newsletter</h4>
            <p className="text-beige-200 text-sm mb-4">
              Subscribe to receive updates on new products and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-lg bg-olive-800 text-beige-50 placeholder-beige-400 border border-olive-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 pt-8 border-t border-olive-800">
          <div className="grid md:grid-cols-4 gap-6 text-center text-beige-300 text-sm">
            <div>
              <p className="font-semibold text-beige-200 mb-1">Export Quality</p>
              <p>Products meet international safety and quality standards for global customers</p>
            </div>
            <div>
              <p className="font-semibold text-beige-200 mb-1">Made in Thailand</p>
              <p>Handcrafted with traditional Thai artisan techniques and premium ingredients</p>
            </div>
            <div>
              <p className="font-semibold text-beige-200 mb-1">International Shipping</p>
              <p>Available for customers in US, EU, GCC, Asia, and worldwide</p>
            </div>
            <div>
              <p className="font-semibold text-beige-200 mb-1">Ethical Sourcing</p>
              <p>Responsible ingredient sourcing and sustainable production practices</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-olive-800 text-center text-beige-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Wick & Lather. All rights reserved.</p>
          <p className="mt-2">Handcrafted in Thailand | Export Quality Products | Designed for Global Customers</p>
          <p className="mt-1 text-xs text-beige-400">
            Premium handcrafted soaps and luxury scented candles exported from Thailand to customers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
