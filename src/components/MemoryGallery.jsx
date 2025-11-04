import React from 'react';

import memoriaUno from '../assets/memorias_1.jpg';
import memoriaDos from '../assets/memorias_2.jpg';
import memoriaTres from '../assets/memorias_3.jpg';

const images = [
  { src: memoriaUno, alt: 'Sesión navideña 1' },
  { src: memoriaDos, alt: 'Sesión navideña 2' },
  { src: memoriaTres, alt: 'Sesión navideña 3' }
];

export default function MemoryGallery() {
  return (
    <section className="bg-white dark:bg-neutral-900 px-4 sm:px-6 md:px-8 py-10">
      <div className="max-w-6xl mx-auto grid gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <figure key={image.src} className="overflow-hidden rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
