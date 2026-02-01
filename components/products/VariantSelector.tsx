'use client';

import { useState, useEffect } from 'react';

interface VariantSelectorProps {
  category: 'soap' | 'candle';
  basePrice: number;
  stock: number;
  onVariantChange: (price: number, available: boolean, variantType: string) => void;
}

interface SoapVariant {
  type: 'Normal' | 'Sensitive' | 'Dry' | 'Oily';
  priceModifier: number;
  description: string;
}

interface CandleVariant {
  type: 'Light' | 'Medium' | 'Strong';
  priceModifier: number;
  description: string;
}

const SOAP_VARIANTS: SoapVariant[] = [
  { type: 'Normal', priceModifier: 0, description: 'Balanced formula for all skin types' },
  { type: 'Sensitive', priceModifier: 2.00, description: 'Extra gentle, fragrance-free option' },
  { type: 'Dry', priceModifier: 1.50, description: 'Enhanced moisturizing formula' },
  { type: 'Oily', priceModifier: 0.50, description: 'Deep cleansing, oil-balancing formula' },
];

const CANDLE_VARIANTS: CandleVariant[] = [
  { type: 'Light', priceModifier: 0, description: 'Subtle fragrance, perfect for small spaces' },
  { type: 'Medium', priceModifier: 3.00, description: 'Balanced scent throw for medium rooms' },
  { type: 'Strong', priceModifier: 5.00, description: 'Intense fragrance for large spaces' },
];

export default function VariantSelector({
  category,
  basePrice,
  stock,
  onVariantChange,
}: VariantSelectorProps) {
  const variants = category === 'soap' ? SOAP_VARIANTS : CANDLE_VARIANTS;
  const [selectedVariant, setSelectedVariant] = useState(variants[0].type);

  const currentVariant = variants.find((v) => v.type === selectedVariant)!;
  const currentPrice = basePrice + currentVariant.priceModifier;
  const isAvailable = stock > 0;

  useEffect(() => {
    onVariantChange(currentPrice, isAvailable, selectedVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant, basePrice, stock]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-olive-700 font-medium mb-3">
          {category === 'soap' ? 'Skin Sensitivity' : 'Scent Strength'}
        </label>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => {
            const variantPrice = basePrice + variant.priceModifier;
            const isSelected = selectedVariant === variant.type;
            return (
              <button
                key={variant.type}
                type="button"
                onClick={() => setSelectedVariant(variant.type)}
                className={`px-6 py-3 rounded-lg border-2 transition-all text-left min-w-[140px] ${
                  isSelected
                    ? 'border-olive-700 bg-olive-50 text-olive-900'
                    : 'border-olive-200 bg-white text-olive-700 hover:border-olive-400'
                }`}
              >
                <div className="font-semibold mb-1">{variant.type}</div>
                <div className="text-xs text-olive-600 mb-2">{variant.description}</div>
                {variant.priceModifier > 0 && (
                  <div className="text-sm font-medium text-olive-900">
                    +${variant.priceModifier.toFixed(2)}
                  </div>
                )}
                {variant.priceModifier === 0 && (
                  <div className="text-sm font-medium text-olive-600">Base price</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-olive-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-olive-700 font-medium">
            {category === 'soap' ? 'Selected Formula' : 'Selected Strength'}:
          </span>
          <span className="text-2xl font-bold text-olive-900">
            ${currentPrice.toFixed(2)}
          </span>
        </div>
        {currentVariant.priceModifier > 0 && (
          <p className="text-sm text-olive-600 mt-1">
            Base price ${basePrice.toFixed(2)} + ${currentVariant.priceModifier.toFixed(2)} variant
          </p>
        )}
      </div>
    </div>
  );
}
