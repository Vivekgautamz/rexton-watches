import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import ProductGallery from '@/components/ProductGallery';
import ProductActionForm from '@/components/ProductActionForm';
import ProductCard from '@/components/ProductCard';
import ProductReviewSection from '@/components/ProductReviewSection';
import { ShieldCheck, Award, Clock, RefreshCw } from 'lucide-react';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  });

  if (!product) return { title: 'Timepiece Not Found | REXTON' };

  return {
    title: `${product.title} | REXTON WATCHES`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | REXTON WATCHES`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      collection: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) notFound();

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        { collectionId: product.collectionId },
      ],
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
      category: true,
    },
    take: 4,
  });

  // Parse specifications JSON
  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch {
      specsObj = {};
    }
  }

  // Schema.org Product Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'REXTON WATCHES',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price.toString(),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://rexton.com/product/${product.slug}`,
    },
  };

  return (
    <div className="bg-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-200 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-neutral-500 uppercase tracking-widest flex items-center space-x-2">
          <Link href="/" className="hover:text-black transition-colors">
            Maison
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            Timepieces
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-black transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right Column: Details & Action */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-neutral-200">
              {product.collection && (
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                  {product.collection.name} Series
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-black font-normal leading-snug">
                {product.title}
              </h1>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Reference SKU: <strong className="text-neutral-700">{product.sku}</strong>
              </p>

              {/* Price Display */}
              <div className="pt-4 flex items-baseline space-x-3">
                <span className="text-2xl font-semibold text-black">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  (Incl. all Swiss import duties & GST)
                </span>
              </div>
            </div>

            {/* Key Horological Attributes */}
            <div className="grid grid-cols-2 gap-4 py-2 text-xs">
              <div className="bg-neutral-50 p-3 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Movement</span>
                <span className="font-medium text-black mt-0.5 block">{product.movement || 'Swiss Automatic Calibre'}</span>
              </div>
              <div className="bg-neutral-50 p-3 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Case Dimension</span>
                <span className="font-medium text-black mt-0.5 block">{product.caseSize || '42mm'} &bull; {product.caseMaterial || '316L Steel'}</span>
              </div>
              <div className="bg-neutral-50 p-3 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Water Resistance</span>
                <span className="font-medium text-black mt-0.5 block">{product.waterResistance || '10 ATM (100M)'}</span>
              </div>
              <div className="bg-neutral-50 p-3 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Power Reserve</span>
                <span className="font-medium text-black mt-0.5 block">{product.powerReserve || '70 Hours'}</span>
              </div>
            </div>

            {/* Add to Cart / Buy Now Action Form */}
            <ProductActionForm
              product={{
                ...product,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              } as any}
            />

            {/* Trust Badges */}
            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <div className="flex items-center space-x-3 text-xs text-neutral-700">
                <Award className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>5-Year Official Swiss Atelier Movement Warranty</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>Complimentary Armored & Insured Express Dispatch</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-neutral-700">
                <RefreshCw className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>14-Day Private Inspection & Return Privilege</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Narrative & Technical Specifications */}
        <div className="mt-20 pt-16 border-t border-neutral-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Description Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-serif uppercase tracking-widest text-black font-normal">
                Horological Narrative & Architecture
              </h2>
              <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-4 font-light">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-sm font-serif uppercase tracking-widest text-black font-semibold">
                Technical Specifications
              </h3>
              <div className="border border-neutral-200 divide-y divide-neutral-100 text-xs">
                <div className="flex justify-between p-3 bg-neutral-50/50">
                  <span className="text-neutral-500 uppercase tracking-wider">Glass Crystal</span>
                  <span className="font-medium text-black text-right">{product.glassType}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-500 uppercase tracking-wider">Dial Color</span>
                  <span className="font-medium text-black text-right">{product.dialColor || 'Sunburst Black'}</span>
                </div>
                <div className="flex justify-between p-3 bg-neutral-50/50">
                  <span className="text-neutral-500 uppercase tracking-wider">Strap / Bracelet</span>
                  <span className="font-medium text-black text-right">{product.strapMaterial || 'Handmade Leather'}</span>
                </div>
                {Object.entries(specsObj).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3">
                    <span className="text-neutral-500 uppercase tracking-wider">{key}</span>
                    <span className="font-medium text-black text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-16 border-t border-neutral-200">
          <ProductReviewSection
            productId={product.id}
            reviews={product.reviews}
          />
        </div>

        {/* Related Timepieces */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-200 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                Complementary Selections
              </span>
              <h2 className="text-2xl font-serif tracking-widest uppercase text-black font-normal">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={{
                    ...rel,
                    price: Number(rel.price),
                    compareAtPrice: rel.compareAtPrice ? Number(rel.compareAtPrice) : null,
                  } as any}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
