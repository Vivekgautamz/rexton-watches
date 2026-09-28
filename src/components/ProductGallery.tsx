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

  // Filter out any invalid makeup/coffee URLs
  const validImages = images.filter(
    (img) =>
      img?.url &&
      !img.url.includes('1522335789203') &&
      !img.url.includes('1509042239860') &&
      !img.url.includes('1547996160')
  );

  const activeImage =
    validImages[selectedIdx]?.url ||
    validImages[0]?.url ||
    '/images/rexton-placeholder.svg';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector Column */}
      {validImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 flex-shrink-0 bg-[#F9F9F8] border transition-all p-1.5 ${
                selectedIdx === idx
                  ? 'border-black ring-1 ring-black'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Primary Zoomable Main Viewport */}
      <div
        className="relative flex-1 h-[450px] sm:h-[580px] bg-[#FAF9F7] border border-neutral-200 overflow-hidden cursor-crosshair flex items-center justify-center p-8"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className={`object-contain p-6 transition-transform duration-200 ${
            isZoomed ? 'scale-175' : 'scale-100'
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
          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-[10px] tracking-widest uppercase px-3 py-1 backdrop-blur-sm pointer-events-none">
            Hover to Inspect Calibre
          </div>
        )}
      </div>
    </div>
  );
}
