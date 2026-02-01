'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedCard } from '@/components/ui/Animations';
import { getProductImage } from '@/lib/product-utils';
import { Product } from '@prisma/client';

interface AnimatedFeaturedProductsProps {
  products: Product[];
}

export default function AnimatedFeaturedProducts({ products }: AnimatedFeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-olive-900 mb-4">
                Featured Collection
              </h2>
              <p className="text-lg text-olive-700 max-w-2xl mx-auto">
                Discover our most beloved products, carefully selected for their
                exceptional quality and customer favorites
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <AnimatedCard key={product.id} delay={index * 0.1}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-300 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    {(() => {
                      const imageUrl = getProductImage(product);
                      const isDataUrl = imageUrl.startsWith('data:');
                      return isDataUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      );
                    })()}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-olive-900 mb-2 group-hover:text-olive-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-olive-600 text-sm mb-4 line-clamp-2">
                      {product.shortDesc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-olive-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-olive-500 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
