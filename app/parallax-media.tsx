"use client";

import { useEffect, useRef, type ReactNode } from "react";

// An isolated, self-contained media section: the image is scaled up
// slightly and drifted within its own clipped box as it transits the
// viewport. Because the offset is always mathematically bounded by the
// slack the scale-up provides, the image can never separate from its
// container and reveal an edge, regardless of scroll speed or position.
export function ParallaxMedia({
  media,
  overlay,
  className = "",
  scale = 1.3,
  ariaLabel,
}: {
  media: ReactNode;
  overlay?: ReactNode;
  className?: string;
  scale?: number;
  ariaLabel?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTransform = "";

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        if (lastTransform !== "none") {
          media.style.transform = "none";
          lastTransform = "none";
        }
        return;
      }
      const rect = section.getBoundingClientRect();
      // Progress across the section's full transit: 0 as it first touches
      // the bottom of the viewport, 1 once it has fully exited the top.
      const start = window.innerHeight;
      const end = -rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const slack = (rect.height * (scale - 1)) / 2;
      const offset = (progress - 0.5) * 2 * slack;
      // translate3d must come first: CSS composes transform functions
      // right-to-left, so `scale() translate3d()` would render the
      // translate scaled up by `scale`, exceeding the slack budget below
      // and reintroducing the exact gap this component exists to prevent.
      const transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(${scale})`;
      if (transform !== lastTransform) {
        media.style.transform = transform;
        lastTransform = transform;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [scale]);

  return <div className={`parallax-section ${className}`} ref={sectionRef} aria-label={ariaLabel}>
    <div className="parallax-clip">
      <div className="parallax-media" ref={mediaRef}>{media}</div>
    </div>
    {overlay ? <div className="parallax-overlay">{overlay}</div> : null}
  </div>;
}
