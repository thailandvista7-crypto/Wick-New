'use client';

import { useState } from 'react';
import { Product } from '@prisma/client';
import VariantSelector from './VariantSelector';
import AddToCartButton from './AddToCartButton';

interface ProductInfoClientProps {
  product: Product;
  averageRating: number;
  totalReviews: number;
}

export default function ProductInfoClient({
  product,
  averageRating,
  totalReviews,
}: ProductInfoClientProps) {
  const [variantPrice, setVariantPrice] = useState(product.price);
  const [variantType, setVariantType] = useState<string | undefined>(undefined);
  const [isAvailable, setIsAvailable] = useState(product.stock > 0);

  const handleVariantChange = (price: number, available: boolean, variantType: string) => {
    setVariantPrice(price);
    setIsAvailable(available);
    setVariantType(variantType);
  };

  const isSoap = product.category === 'soap';
  const isCandle = product.category === 'candle';

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-center gap-4">
        <span className="text-3xl lg:text-4xl font-bold text-olive-900">
          ${variantPrice.toFixed(2)}
        </span>
        {product.comparePrice && product.comparePrice > product.price && (
          <>
            <span className="text-xl text-olive-400 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Save{' '}
              {(
                ((product.comparePrice - product.price) / product.comparePrice) *
                100
              ).toFixed(0)}
              %
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {isAvailable ? (
          <p className="text-green-600 font-medium flex items-center gap-2">
            <span>✓</span>
            <span>In Stock ({product.stock} available)</span>
          </p>
        ) : (
          <p className="text-red-600 font-medium flex items-center gap-2">
            <span>✗</span>
            <span>Out of Stock</span>
          </p>
        )}
      </div>

      {/* Variant Selector */}
      {(isSoap || isCandle) && (
        <VariantSelector
          category={product.category as 'soap' | 'candle'}
          basePrice={product.price}
          stock={product.stock}
          onVariantChange={handleVariantChange}
        />
      )}

      {/* Add to Cart */}
      <AddToCartButton
        product={product}
        variantPrice={variantPrice}
        variantType={variantType}
        isAvailable={isAvailable}
      />

      {/* Rating Summary (Quick View) */}
      {totalReviews > 0 && (
        <div className="pt-6 border-t border-olive-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-400'
                      : 'text-olive-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div>
              <p className="text-olive-900 font-semibold">
                {averageRating.toFixed(1)} out of 5
              </p>
              <p className="text-sm text-olive-600">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
