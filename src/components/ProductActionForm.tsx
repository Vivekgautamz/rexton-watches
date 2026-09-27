'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductActionFormProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number | any;
    stock: number;
    images: Array<{ url: string }>;
  };
}

export default function ProductActionForm({ product }: ProductActionFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();
  const router = useRouter();

  const isOutOfStock = product.stock <= 0;
  const primaryImg = product.images?.[0]?.url || '';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        price: Number(product.price),
        image: primaryImg,
        stock: product.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        price: Number(product.price),
        image: primaryImg,
        stock: product.stock,
      },
      quantity
    );
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Stock Status Indicator */}
      <div className="flex items-center space-x-2 text-xs">
        {isOutOfStock ? (
          <span className="text-red-600 font-semibold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-600 mr-2" />
            Currently Unavailable (Atelier Allocation Exhausted)
          </span>
        ) : product.stock <= 3 ? (
          <span className="text-amber-800 font-semibold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-600 mr-2 animate-pulse" />
            Strict Atelier Allocation: Only {product.stock} Timepieces Available
          </span>
        ) : (
          <span className="text-emerald-700 font-medium uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
            In Stock &bull; Ready for Insured Dispatch
          </span>
        )}
      </div>

      {/* Quantity Selector & Action Buttons */}
      {!isOutOfStock && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Quantity:
            </span>
            <div className="flex items-center border border-neutral-300 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-neutral-100 text-neutral-600 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 py-2 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-neutral-100 text-neutral-600 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-white border border-black text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Acquisition Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center space-x-2 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>Acquire Instantly</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
