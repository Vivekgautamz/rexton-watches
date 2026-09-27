'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase?: boolean;
  createdAt: string | Date;
}

interface ProductReviewSectionProps {
  productId: string;
  reviews: ReviewItem[];
}

export default function ProductReviewSection({ productId, reviews: initialReviews }: ProductReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          authorName,
          rating,
          title,
          comment,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Thank you. Your collector impression has been registered.');
        if (data.review) {
          setReviews([data.review, ...reviews]);
        }
        setAuthorName('');
        setTitle('');
        setComment('');
        setShowForm(false);
      } else {
        setErrorMessage(data.error || 'Failed to submit review');
      }
    } catch {
      setErrorMessage('Network error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header / Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="text-xl font-serif uppercase tracking-widest text-black font-normal">
            Collector Testimonials & Reviews
          </h2>
          <div className="flex items-center space-x-3 mt-2 text-xs text-neutral-500">
            <div className="flex text-[#C5A880]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(averageRating)) ? 'fill-[#C5A880]' : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-black">{averageRating} out of 5</span>
            <span>&bull;</span>
            <span>{reviews.length} {reviews.length === 1 ? 'Appraisal' : 'Appraisals'}</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors self-start sm:self-auto"
        >
          {showForm ? 'Cancel Appraisal' : 'Write Collector Appraisal'}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-4 max-w-2xl">
          <h3 className="text-sm font-serif uppercase tracking-wider text-black font-medium">
            Share Your Ownership Experience
          </h3>

          {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Overall Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-neutral-400 hover:text-[#C5A880]"
                >
                  <Star
                    className={`w-5 h-5 ${star <= rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-neutral-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Lord Sterling"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flawless finishing & accurate calibre"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
              Testimonial / Appraisal *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the tactile winding experience, wrist comfort, finishing, and accuracy..."
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Appraisal'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-neutral-100 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6">
            Be the first collector to register an appraisal for this reference.
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="pt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex text-[#C5A880]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#C5A880]' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.title && (
                    <span className="text-xs font-semibold text-black uppercase tracking-wide">
                      {rev.title}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {rev.comment}
              </p>

              <div className="flex items-center space-x-2 text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-800">{rev.authorName}</span>
                {rev.isVerifiedPurchase && (
                  <span className="flex items-center text-emerald-700 space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Owner</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
