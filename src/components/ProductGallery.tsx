'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: Array<{
    id?: string;
    url: string;
    altText?: string | null;
  }>;
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeImage = images[selectedIdx]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector Column */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 flex-shrink-0 bg-neutral-50 border transition-all ${
                selectedIdx === idx
                  ? 'border-black ring-1 ring-black'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Primary Zoomable Main Viewport */}
      <div
        className="relative flex-1 h-[450px] sm:h-[550px] bg-[#FAF9F6] border border-neutral-200 overflow-hidden cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {!isZoomed && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] tracking-wider uppercase px-2.5 py-1 backdrop-blur-sm pointer-events-none">
            Hover to Magnify
          </div>
        )}
      </div>
    </div>
  );
}
