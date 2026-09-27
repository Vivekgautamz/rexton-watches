'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number | any;
    compareAtPrice?: number | any | null;
    movement?: string | null;
    caseSize?: string | null;
    isNew?: boolean;
    isFeatured?: boolean;
    stock: number;
    category?: { name: string; slug: string } | null;
    images: Array<{ url: string; altText?: string | null; isPrimary?: boolean }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';

  const secondaryImage =
    product.images?.length > 1
      ? product.images[1]?.url
      : primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        price: Number(product.price),
        image: primaryImage,
        stock: product.stock,
      },
      1
    );
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group flex flex-col bg-white border border-[#EAEAEA] hover:border-[#C5A880] transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {product.isNew && (
          <span className="bg-black text-[#C5A880] text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1">
            New
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-[#C5A880] text-black text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1">
            Masterpiece
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="bg-amber-800 text-white text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-1">
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm text-neutral-600 hover:text-red-600 transition-colors shadow-sm"
        aria-label="Save to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
      </button>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative h-72 w-full bg-[#FBFBFA] overflow-hidden block">
        <Image
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Overlay Quick Add Action on Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="w-full py-2.5 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] hover:text-white transition-colors flex items-center justify-center space-x-2 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Quick Acquisition' : 'Sold Out'}</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {product.category && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold block mb-1">
              {product.category.name}
            </span>
          )}

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-serif font-medium uppercase tracking-wider text-black group-hover:text-[#C5A880] transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
            {product.movement || 'Swiss Mechanical Calibre'} {product.caseSize ? `• ${product.caseSize}` : ''}
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-semibold text-black">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            Ref: {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
