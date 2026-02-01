'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { getCartItemCount } from '@/lib/cart';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemCount());
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 500);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-beige-50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo showTagline={false} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/shop?category=soap"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Soaps
            </Link>
            <Link
              href="/shop?category=candle"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Candles
            </Link>
            <Link
              href="/about"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/faqs"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/track-order"
              className="text-olive-700 hover:text-olive-600 font-medium transition-colors"
            >
              Track My Order
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="hidden md:flex items-center text-olive-700 hover:text-olive-600 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center text-olive-700 hover:text-olive-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-olive-700 hover:text-olive-600 transition-colors p-2 -mr-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-olive-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop?category=soap"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Soaps
              </Link>
              <Link
                href="/shop?category=candle"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Candles
              </Link>
              <Link
                href="/about"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/faqs"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/track-order"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Track My Order
              </Link>
              <Link
                href="/admin"
                className="text-olive-700 hover:text-olive-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
