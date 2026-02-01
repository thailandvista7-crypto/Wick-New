'use client';

import { AnimatedSection } from '@/components/ui/Animations';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function AnimatedStorySection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-olive-900 mb-6">
                Thai Craftsmanship, Global Quality
              </h2>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                At Wick & Lather, we bring you luxury handcrafted soaps and premium scented candles made in Thailand. Our journey combines traditional Thai artisan techniques with modern wellness needs, creating export-quality products designed for international customers who appreciate authentic craftsmanship.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Each bar of soap and every candle is handcrafted in Thailand using time-honored techniques passed down through generations. We source only the finest natural ingredients—from premium coconut oil and shea butter to essential oils extracted from plants grown in their native regions. Our small-batch production ensures attention to detail and exceptional quality.
              </p>
              <p className="text-lg text-olive-700 mb-6 leading-relaxed">
                Our commitment to export-quality standards means every product is carefully formulated, meticulously crafted, and securely packaged for international shipping. We believe that true luxury lies in the details—the way a soap lathers, the way a candle burns, the way Thai craftsmanship elevates your daily wellness ritual.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-olive-700 font-semibold hover:text-olive-600 transition-colors"
              >
                Learn More About Our Thai Craftsmanship
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-luxury">
              <Image
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"
                alt="Thai artisan handcrafting luxury soaps and candles in Thailand"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
