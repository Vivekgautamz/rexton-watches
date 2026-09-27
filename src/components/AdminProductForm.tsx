'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { slugify } from '@/lib/utils';
import Link from 'next/link';

interface CategoryOption {
  id: string;
  name: string;
}

interface CollectionOption {
  id: string;
  name: string;
}

interface AdminProductFormProps {
  initialData?: any;
  categories: CategoryOption[];
  collections: CollectionOption[];
  isEdit?: boolean;
}

export default function AdminProductForm({
  initialData,
  categories,
  collections,
  isEdit = false,
}: AdminProductFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    movement: initialData?.movement || 'Swiss Automatic Calibre R-902',
    caseSize: initialData?.caseSize || '42mm',
    caseMaterial: initialData?.caseMaterial || '316L Surgical Grade Stainless Steel',
    waterResistance: initialData?.waterResistance || '10 ATM (100m / 330ft)',
    dialColor: initialData?.dialColor || 'Sunburst Midnight Blue',
    strapMaterial: initialData?.strapMaterial || 'Hand-stitched Alligator Leather',
    glassType: initialData?.glassType || 'Scratch-resistant Sapphire Crystal with Dual AR Coating',
    powerReserve: initialData?.powerReserve || '70 Hours',
    price: initialData?.price ? Number(initialData.price) : 185000,
    compareAtPrice: initialData?.compareAtPrice ? Number(initialData.compareAtPrice) : 215000,
    costPrice: initialData?.costPrice ? Number(initialData.costPrice) : 95000,
    stock: initialData?.stock !== undefined ? initialData.stock : 10,
    lowStockThreshold: initialData?.lowStockThreshold || 3,
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew !== undefined ? initialData.isNew : true,
    status: initialData?.status || 'PUBLISHED',
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    collectionId: initialData?.collectionId || (collections[0]?.id || ''),
  });

  // Images state
  const [images, setImages] = useState<Array<{ url: string; altText: string; isPrimary: boolean }>>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((img: any) => ({
          url: img.url,
          altText: img.altText || '',
          isPrimary: img.isPrimary || false,
        }))
      : [
          {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
            altText: 'Front View',
            isPrimary: true,
          },
        ]
  );

  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : slugify(val),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      { url: newImageUrl.trim(), altText: formData.title, isPrimary: prev.length === 0 },
    ]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setErrorMsg('At least one product image is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        categoryId: formData.categoryId || null,
        collectionId: formData.collectionId || null,
        images,
      };

      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save timepiece');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving timepiece');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Catalog</span>
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#C5A880] text-black text-xs uppercase tracking-wider font-semibold hover:bg-white transition flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Reference' : 'Publish Reference'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core & Horological Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. General Identification */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Timepiece Nomenclature
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Model Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Sovereign Chronograph 42mm"
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Reference SKU *
                </label>
                <input
                  type="text"
                  required
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. REX-SOV-4201"
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none font-mono text-neutral-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Short Excerpt / Subtitle
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Swiss automatic column-wheel chronograph with exhibition caseback."
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Detailed Horological Narrative *
              </label>
              <textarea
                required
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>
          </div>

          {/* 2. Technical Calibre & Casing Specifications */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Calibre & Technical Architecture
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Movement / Calibre
                </label>
                <input
                  type="text"
                  name="movement"
                  value={formData.movement}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Case Dimension
                </label>
                <input
                  type="text"
                  name="caseSize"
                  value={formData.caseSize}
                  onChange={handleInputChange}
                  placeholder="e.g. 42mm"
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Case Material
                </label>
                <input
                  type="text"
                  name="caseMaterial"
                  value={formData.caseMaterial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Water Resistance
                </label>
                <input
                  type="text"
                  name="waterResistance"
                  value={formData.waterResistance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Dial Color & Pattern
                </label>
                <input
                  type="text"
                  name="dialColor"
                  value={formData.dialColor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Strap / Bracelet
                </label>
                <input
                  type="text"
                  name="strapMaterial"
                  value={formData.strapMaterial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Power Reserve
                </label>
                <input
                  type="text"
                  name="powerReserve"
                  value={formData.powerReserve}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Glass Crystal
                </label>
                <input
                  type="text"
                  name="glassType"
                  value={formData.glassType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Image URLs Manager */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              High-Resolution Visual Assets
            </h3>

            <div className="flex space-x-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Cloudinary / Unsplash / Web image URL..."
                className="flex-1 px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#262626] text-white hover:bg-neutral-700 uppercase tracking-wider"
              >
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative bg-black border border-[#2A2A2A] p-2 space-y-2">
                  <div className="relative h-28 w-full bg-neutral-900">
                    <Image src={img.url} alt={`Preview ${idx}`} fill className="object-cover" sizes="120px" />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className={`px-2 py-0.5 uppercase tracking-wider ${
                        img.isPrimary ? 'bg-[#C5A880] text-black font-semibold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {img.isPrimary ? 'Primary' : 'Set Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Inventory, Categorization */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          {/* Pricing & Stock */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Financials & Inventory
            </h3>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Selling Price (INR) *
              </label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Compare At / Retail Price (INR)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Available Atelier Stock *
              </label>
              <input
                type="number"
                required
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Low Stock Warning Level
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              />
            </div>
          </div>

          {/* Classification & Visibility */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2">
              Classification & Status
            </h3>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              >
                <option value="PUBLISHED">PUBLISHED (Active on Store)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                Curated Collection
              </label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
              >
                <option value="">None</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="rounded-none text-[#C5A880]"
                />
                <span className="text-neutral-300">Feature on Homepage / Focus</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="rounded-none text-[#C5A880]"
                />
                <span className="text-neutral-300">Mark as New Novelty</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
