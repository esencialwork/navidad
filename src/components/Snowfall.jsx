import React, { useMemo } from 'react';

const FLAKE_COUNT = 25;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Snowfall() {
  const flakes = useMemo(() => (
    Array.from({ length: FLAKE_COUNT }).map((_, index) => ({
      id: index,
      left: `${Math.floor(randomBetween(0, 100))}%`,
      delay: `${randomBetween(0, 5).toFixed(2)}s`,
      duration: `${randomBetween(8, 14).toFixed(2)}s`,
      size: `${randomBetween(8, 16).toFixed(2)}px`,
      opacity: randomBetween(0.4, 0.9).toFixed(2)
    }))
  ), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            fontSize: flake.size,
            opacity: flake.opacity
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
