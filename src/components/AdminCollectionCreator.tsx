'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Layers } from 'lucide-react';

export default function AdminCollectionCreator() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tagline, description, bannerImage, isFeatured }),
      });

      if (res.ok) {
        setName('');
        setTagline('');
        setDescription('');
        setBannerImage('');
        router.refresh();
      } else {
        alert('Failed to create collection');
      }
    } catch {
      alert('Error creating collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="bg-[#141414] border border-[#242424] p-6 space-y-4 text-xs">
      <h3 className="text-sm font-serif uppercase tracking-wider text-white font-medium border-b border-[#242424] pb-2 flex items-center space-x-2">
        <Layers className="w-4 h-4 text-[#C5A880]" />
        <span>Add Curated Collection</span>
      </h3>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Collection Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Celestial Tourbillon"
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Tagline
        </label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Cosmic Horology in 18k White Gold"
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Banner Image URL
        </label>
        <input
          type="url"
          value={bannerImage}
          onChange={(e) => setBannerImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <div>
        <label className="block text-neutral-400 uppercase tracking-wider mb-1">
          Narrative Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-[#1C1C1C] border border-neutral-700 text-white focus:border-[#C5A880] outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#C5A880] text-black uppercase tracking-widest font-semibold hover:bg-white transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{isSubmitting ? 'Creating...' : 'Register Collection'}</span>
      </button>
    </form>
  );
}
