'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Check } from 'lucide-react';
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
    collection?: { name: string; slug: string } | null;
    images: Array<{ url: string; altText?: string | null; isPrimary?: boolean }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Validate images: ensure it starts with /images or https:// and NEVER contains makeup/coffee/broken URLs
  const filterValidImage = (url?: string | null) => {
    if (!url) return null;
    if (url.includes('1522335789203') || url.includes('1509042239860') || url.includes('1547996160')) {
      return null;
    }
    return url;
  };

  const primaryImage =
    filterValidImage(product.images?.find((img) => img.isPrimary)?.url) ||
    filterValidImage(product.images?.[0]?.url) ||
    '/images/rexton-placeholder.svg';

  const secondaryImage =
    filterValidImage(product.images?.length > 1 ? product.images[1]?.url : null) ||
    primaryImage;

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

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group flex flex-col bg-white border border-[#EDEDED] hover:border-[#C5A880] transition-colors duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 items-center pointer-events-none">
        {product.isNew && (
          <span className="bg-black text-[#C5A880] text-[9px] uppercase tracking-[0.22em] font-semibold px-2 py-1">
            New
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-[#C5A880] text-black text-[9px] uppercase tracking-[0.22em] font-semibold px-2 py-1">
            Signature
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="bg-[#2A2A2A] text-white text-[9px] uppercase tracking-[0.15em] font-medium px-2 py-1">
            {product.stock} Left
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3.5 right-3.5 z-10 p-2 bg-white/90 backdrop-blur-sm text-neutral-400 hover:text-red-600 transition-colors shadow-sm"
        aria-label="Save to Wishlist"
      >
        <Heart className={`w-4 h-4 transition-transform group-hover:scale-105 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
      </button>

      {/* Large Image Container - Watch Visually Dominates the Card */}
      <Link
        href={`/product/${product.slug}`}
        className="relative h-80 sm:h-96 w-full bg-[#FAFAFA] overflow-hidden flex items-center justify-center p-6"
      >
        <Image
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.title}
          fill
          unoptimized
          className="object-contain object-center p-4 transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="w-full py-3 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A880] hover:text-white transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {/* Collection / Category Header */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            <span>{product.collection?.name || product.category?.name || 'Swiss Line'}</span>
            <span className="text-neutral-400 font-normal">Ref: {product.sku}</span>
          </div>

          {/* Full Product Name without Truncation */}
          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="text-[15px] font-serif font-medium tracking-wide text-black group-hover/title:text-[#C5A880] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Technical Specifications preview */}
          <p className="text-[12px] text-neutral-500 font-light leading-normal">
            {product.movement || 'Mechanical Calibre'} {product.caseSize ? `• ${product.caseSize}` : ''}
          </p>
        </div>

        {/* Price & Availability Bar */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2.5">
            <span className="text-[15px] font-semibold text-black tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] tracking-wider uppercase font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            {product.stock > 0 ? 'Available' : 'Order on Request'}
          </span>
        </div>
      </div>
    </div>
  );
}
