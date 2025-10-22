import React, { useEffect, useState } from 'react';

/**
 * Accessible countdown timer that updates every second.
 * Accepts a deadline date and shows remaining days, hours, minutes and seconds.
 */
export default function Countdown({ deadline }) {
  const calculateRemaining = () => Math.max(0, deadline.getTime() - Date.now());
  const [remaining, setRemaining] = useState(calculateRemaining());

  useEffect(() => {
    const interval = setInterval(() => setRemaining(calculateRemaining()), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div aria-live="polite" className="flex gap-2 text-sm font-mono">
      <TimeBox label="Días" value={days} />
      <TimeBox label="Horas" value={hours} />
      <TimeBox label="Min" value={minutes} />
      <TimeBox label="Seg" value={seconds} />
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-white/10 px-2 py-1 rounded-md">
      <span className="text-lg font-semibold">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px]">{label}</span>
    </div>
  );
}