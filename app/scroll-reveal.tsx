"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Toggles (not just adds) the in-view class on every intersection change, so
// the reveal plays the same way scrolling down into the section or back up
// into it, and reverses when the section leaves the viewport either way.
export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      el.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle("in-view", entry.isIntersecting),
      { rootMargin: "-10% 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div className={`scroll-reveal ${className}`} ref={ref}>{children}</div>;
}
