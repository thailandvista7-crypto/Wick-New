import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { getProductImage } from '@/lib/product-utils';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const filteredProducts = products.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-serif font-bold text-olive-900 mb-8">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const imageUrl = getProductImage(product);
          const isDataUrl = imageUrl.startsWith('data:');
          
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                {isDataUrl ? (
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
                    unoptimized={imageUrl.startsWith('data:')}
                  />
                )}
                {product.comparePrice && product.comparePrice > product.price && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-olive-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-olive-900 mb-2 group-hover:text-olive-700 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-olive-600 text-sm mb-4 line-clamp-2">
                  {product.shortDesc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-olive-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-olive-400 line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
