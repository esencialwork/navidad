import React from 'react';
import * as Icons from 'lucide-react';

/**
 * Generic section that displays a grid of feature cards.
 * Props:
 * - title: section heading
 * - features: array of objects { icon, title, text }
 * - columns: number of columns on desktop
 */
export default function FeatureCards({ title, features, columns = 3 }) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns] || 'md:grid-cols-3';

  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-800" id={title.toLowerCase().replace(/\s+/g, '-') }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-heading text-center mb-8">{title}</h2>
        <div className={`grid gap-8 sm:grid-cols-2 ${gridCols}`}>
          {features.map((feat, idx) => {
            const Icon = Icons[feat.icon] || Icons['Circle'];
            return (
              <div key={idx} className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm flex flex-col items-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mb-4">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium mb-2">{feat.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{feat.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}