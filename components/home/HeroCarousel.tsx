'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const carouselSlides = [
  {
    id: 1,
    title: 'Luxury Handcrafted Soaps & Candles from Thailand',
    subtitle: 'Thai Craftsmanship, Global Quality',
    description: 'Premium wellness products made in Thailand, designed for international customers seeking authentic luxury',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1600',
    cta: 'Shop Collection',
    ctaLink: '/shop',
  },
  {
    id: 2,
    title: 'Handcrafted Soaps from Thailand',
    subtitle: 'Natural Ingredients, Export Quality',
    description: 'Traditional Thai soap-making meets modern wellness. Made with care for global customers',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1600',
    cta: 'Shop Soaps',
    ctaLink: '/shop?category=soap',
  },
  {
    id: 3,
    title: 'Luxury Scented Candles from Thailand',
    subtitle: 'Premium Fragrances, Artisan Made',
    description: 'Hand-poured candles crafted in Thailand with premium scents for your home',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1600',
    cta: 'Shop Candles',
    ctaLink: '/shop?category=candle',
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0"
      >
        <div className="relative w-full h-full">
          <Image
            src={carouselSlides[currentIndex].image}
            alt={carouselSlides[currentIndex].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-olive-900/70 via-olive-800/60 to-beige-900/70"></div>
        </div>
      </motion.div>

      <div className="relative z-10 min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
              {carouselSlides[currentIndex].title}
            </h1>
            <p className="text-xl md:text-2xl text-beige-100 mb-2 font-medium">
              {carouselSlides[currentIndex].subtitle}
            </p>
            <p className="text-lg md:text-xl text-beige-200 mb-8 max-w-3xl mx-auto">
              {carouselSlides[currentIndex].description}
            </p>
            <Link
              href={carouselSlides[currentIndex].ctaLink}
              className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-luxury font-medium text-lg group"
            >
              {carouselSlides[currentIndex].cta}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-amber-500'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
