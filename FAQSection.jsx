import React, { useState } from 'react';

/**
 * FAQ section with collapsible items.
 */
export default function FAQSection({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="py-12 bg-white dark:bg-neutral-900" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-heading text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => toggle(idx)}
                aria-expanded={openIndex === idx}
              >
                <span>{item.q}</span>
                <svg className="h-4 w-4 transform transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d={openIndex === idx ? 'M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z' : 'M5.23 7.21a.75.75 0 011.06 0L10 12.92l3.71-5.71a.75.75 0 111.06 1.06L10 14.06 5.23 8.27a.75.75 0 010-1.06z'}
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="px-4 py-3 text-sm border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}