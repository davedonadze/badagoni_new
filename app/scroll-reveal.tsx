"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Drives --reveal-progress continuously from the element's own scroll
// position every frame, the same way ScrollScene drives its parallax offset,
// instead of an IntersectionObserver threshold crossing. IntersectionObserver
// samples intersection state periodically and can skip the transient
// "now intersecting" moment during a fast scroll, so a quick flick (common
// scrolling back up) can leave the reveal never triggered; a per-frame
// position read can't miss it.
export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      el.style.setProperty("--reveal-progress", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      // Fully hidden while the element's top is still near the bottom of the
      // viewport; fully revealed once it has risen past the upper-middle.
      const start = window.innerHeight * 0.92;
      const end = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
      el.style.setProperty("--reveal-progress", progress.toFixed(3));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div className={`scroll-reveal ${className}`} ref={ref}>{children}</div>;
}
