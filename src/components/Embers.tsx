"use client";

import { useEffect, useState } from "react";

type Ember = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

export default function Embers() {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // One-time client-only randomized decoration data (particle positions), not app
    // state that needs to sync with an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmbers(
      Array.from({ length: 44 }).map(() => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3.2,
        duration: 11 + Math.random() * 16,
        delay: -Math.random() * 26,
        color: Math.random() > 0.5 ? "#ff8a2b" : "#ff4d2e",
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
      {embers.map((ember, i) => (
        <span
          key={i}
          className="animate-ember-rise absolute bottom-0 rounded-full"
          style={{
            left: `${ember.left}%`,
            width: ember.size,
            height: ember.size,
            background: ember.color,
            boxShadow: `0 0 ${ember.size * 3}px ${ember.color}`,
            animationDuration: `${ember.duration}s`,
            animationDelay: `${ember.delay}s`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}
