"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function FlyingPhoto({
  src,
  alt,
  heroSlotRef,
  aboutSlotRef,
}: {
  src: string;
  alt: string;
  heroSlotRef: RefObject<HTMLDivElement | null>;
  aboutSlotRef: RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    let frameId = 0;
    let active = media.matches;

    const tick = () => {
      const wrap = wrapRef.current;
      const hero = heroSlotRef.current;
      const about = aboutSlotRef.current;

      if (active && wrap && hero && about) {
        const heroRect = hero.getBoundingClientRect();
        const aboutRect = about.getBoundingClientRect();

        if (heroRect.width > 0 && aboutRect.width > 0) {
          const travelRange = window.innerHeight * 1.1;
          const arrivalY = 96;
          const travelStart = arrivalY + travelRange;
          const rawProgress = (travelStart - aboutRect.top) / travelRange;
          const progress = Math.min(Math.max(rawProgress, 0), 1);
          const eased = easeInOutCubic(progress);

          const top = lerp(heroRect.top, aboutRect.top, eased);
          const left = lerp(heroRect.left, aboutRect.left, eased);
          const width = lerp(heroRect.width, aboutRect.width, eased);
          const height = lerp(heroRect.height, aboutRect.height, eased);
          const radius = lerp(0, 24, eased);

          wrap.style.opacity = "1";
          wrap.style.top = `${top}px`;
          wrap.style.left = `${left}px`;
          wrap.style.width = `${width}px`;
          wrap.style.height = `${height}px`;
          wrap.style.borderRadius = `${radius}px`;
        }
      } else if (wrap) {
        wrap.style.opacity = "0";
      }

      frameId = requestAnimationFrame(tick);
    };

    const onMediaChange = () => {
      active = media.matches;
    };
    media.addEventListener("change", onMediaChange);

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      media.removeEventListener("change", onMediaChange);
    };
  }, [heroSlotRef, aboutSlotRef]);

  return (
    <div
      ref={wrapRef}
      className="fixed z-30 overflow-hidden pointer-events-none opacity-0 hidden md:block"
      style={{ top: 0, left: 0, width: 0, height: 0 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="50vw"
        className="object-cover object-top grayscale contrast-125 brightness-90 select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  );
}
