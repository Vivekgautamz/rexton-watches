'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Private Concierge Appointment',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0C0C0C] text-white py-16 px-4 border-b border-[#222222]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Dedicated Client Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            Concierge & Boutique Appointments
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
          <p className="text-xs text-neutral-400 max-w-lg mx-auto font-light leading-relaxed pt-2">
            Schedule a private consultation, inquire about limited edition allocations, or request bespoke strap adaptations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-serif uppercase tracking-wider text-black font-medium">
              Direct Atelier Inquiry
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#FAF9F6] border border-neutral-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-serif uppercase tracking-wider text-black font-semibold">
                  Inquiry Transmitted to Master Concierge
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto font-light">
                  Thank you, <strong>{formData.name}</strong>. A dedicated REXTON horology specialist will contact you via {formData.email} within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Lord Julian Sterling"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="collector@domain.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+41 22 700 8900"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                      Subject Matter
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                    >
                      <option value="Private Concierge Appointment">Private Concierge Appointment</option>
                      <option value="Limited Edition Allocation">Limited Edition Allocation</option>
                      <option value="Warranty & Service Inquiry">Warranty & Service Inquiry</option>
                      <option value="Corporate & VIP Acquisition">Corporate & VIP Acquisition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Your Message / Desired Model Reference *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide any specific timepieces, complications, or bespoke requests..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 focus:border-[#C5A880] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A880] transition"
                >
                  Send Concierge Request
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Boutique & Atelier Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#FAF9F6] border border-neutral-200 space-y-6">
              <h3 className="text-xs font-serif uppercase tracking-widest text-black font-semibold pb-4 border-b border-neutral-200">
                Maison Ateliers & Headquarters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-black">Geneva Atelier & Flagship Salon</strong>
                    <span className="text-neutral-500 leading-relaxed block">
                      Rue du Rhône 42, 1204 Genève, Switzerland
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-black">Direct Concierge Telephone</strong>
                    <span className="text-neutral-500 block">+41 22 700 8900</span>
                    <span className="text-[10px] text-neutral-400">Mon &ndash; Fri: 09:00 &ndash; 18:00 CET</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-black">Email Communications</strong>
                    <span className="text-neutral-500 block">concierge@rexton.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-2">
                <div className="flex items-center space-x-2 text-black font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Insured Global Logistics & Hand-Delivery</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Complimentary worldwide express courier dispatch for all acquired timepieces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
