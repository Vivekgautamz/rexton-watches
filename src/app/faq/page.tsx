import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Warranty, Servicing & Shipping FAQ | REXTON WATCHES',
  description: 'Frequently asked questions regarding REXTON 5-Year international warranty, water resistance, movement servicing, and insured delivery.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is included in the REXTON 5-Year International Movement Warranty?',
      a: 'Every REXTON timepiece is backed by a comprehensive 5-Year International Warranty covering all mechanical movement defects, escapement regulation, power reserve calibration, and manufacturing faults. It also includes one complimentary ultrasonic cleaning and synthetic lubrication service at our Geneva atelier within the warranty term.',
    },
    {
      q: 'How is payment securely processed on REXTON?',
      a: 'We utilize Razorpay’s banking-grade payment infrastructure with 256-bit SSL encryption. We support all major Credit & Debit cards (Visa, Mastercard, American Express, RuPay), NetBanking, UPI, and zero-cost EMIs. For high-value collectors, we also accommodate private bank wire transfers and insured Cash on Delivery.',
    },
    {
      q: 'How are timepieces packaged and dispatched?',
      a: 'All timepieces are dispatched in tamper-evident, temperature-controlled armored presentation boxes. Shipments are 100% insured by REXTON from our atelier to your doorstep and require an adult physical signature upon handover.',
    },
    {
      q: 'What are the recommended care guidelines for water resistance?',
      a: 'Prior to any contact with water, ensure that the crown is securely screwed down against the case. Do not operate chronograph pushers or adjust the time/date while submerged. We recommend having your gaskets pressure-tested annually at an authorized REXTON service center.',
    },
    {
      q: 'Can I purchase additional bespoke straps for my timepiece?',
      a: 'Yes. Our collection includes hand-stitched Mississippi alligator straps, French saddle calfskin, and FKM vulcanized rubber straps equipped with quick-release spring bars. Contact our concierge to order bespoke straps tailored to your wrist dimensions.',
    },
    {
      q: 'What is the return and inspection policy?',
      a: 'We provide a 14-day private inspection period from the date of receipt. Timepieces must remain unworn with all original security tags, factory protective films, international warranty cards, and presentation boxes intact.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#0C0C0C] text-white py-16 px-4 border-b border-[#222222]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            Knowledge & Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.2em] uppercase font-normal text-white">
            Frequently Asked Questions
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="divide-y divide-neutral-200 space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pt-8 first:pt-0 space-y-3">
              <h3 className="text-base font-serif uppercase tracking-wider text-black font-semibold">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[#FAF9F6] border border-neutral-200 text-center space-y-3">
          <h4 className="text-sm font-serif uppercase tracking-wider text-black font-semibold">
            Have an Unanswered Technical Query?
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Our master watchmakers and concierge are on standby to assist you directly.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#C5A880] transition"
            >
              Contact Atelier Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
