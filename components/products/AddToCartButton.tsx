'use client';

import { useState } from 'react';
import { Product } from '@prisma/client';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { getProductImage } from '@/lib/product-utils';

interface AddToCartButtonProps {
  product: Product;
  variantPrice?: number;
  variantType?: string;
  isAvailable?: boolean;
}

export default function AddToCartButton({ 
  product, 
  variantPrice, 
  variantType,
  isAvailable = true 
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const currentPrice = variantPrice ?? product.price;
  const available = isAvailable && product.stock > 0;

  const handleAddToCart = () => {
    if (!available) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAdding(true);
    
    const displayName = variantType 
      ? `${product.name} (${variantType})`
      : product.name;
    
    const cartItem = {
      productId: product.id,
      name: displayName,
      price: currentPrice,
      quantity,
      image: getProductImage(product),
      slug: product.slug,
      variant: variantType,
    };

    addToCart(cartItem);
    toast.success(`${displayName} added to cart`);
    
    // Trigger cart update event
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-olive-700 font-medium">Quantity:</label>
        <div className="flex items-center border border-olive-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-olive-700 hover:bg-olive-50 transition-colors"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="px-6 py-2 text-olive-900 font-semibold min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock, quantity + 1))
            }
            className="px-4 py-2 text-olive-700 hover:bg-olive-50 transition-colors"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={!available || isAdding}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-5 h-5" />
        {isAdding
          ? 'Adding...'
          : !available
          ? 'Out of Stock'
          : 'Add to Cart'}
      </button>
    </div>
  );
}
