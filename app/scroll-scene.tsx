"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The media drifts continuously at a fraction of the page's natural scroll
// speed instead of pinning in place, so it never stops moving. The
// overlaid content still scrolls at full speed, so it catches up and
// visually covers the media once their viewport positions overlap — the
// same reveal, produced by a speed difference rather than a freeze.
export function ScrollScene({ media, children, speed = 0.6 }: { media: ReactNode; children: ReactNode; speed?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const visual = mediaRef.current;
    if (!scene || !visual) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastOffset = "";
    // The scene's absolute position in the document, captured once so the
    // lag is measured from where it naturally enters the viewport rather
    // than from the top of the page (which would make sections far down
    // the page drift by an enormous, unbounded amount).
    const documentTop = scene.getBoundingClientRect().top + window.scrollY;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        if (lastOffset !== "0.00px") {
          visual.style.setProperty("--overlap-offset", "0.00px");
          lastOffset = "0.00px";
        }
        return;
      }
      const entryScrollY = Math.max(0, documentTop - window.innerHeight);
      const localScroll = Math.max(0, window.scrollY - entryScrollY);
      const offset = `${(localScroll * (1 - speed)).toFixed(2)}px`;
      if (offset !== lastOffset) {
        visual.style.setProperty("--overlap-offset", offset);
        lastOffset = offset;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [speed]);

  return <div className="overlap-scene" ref={sceneRef}>
    <div className="overlap-sticky">
      <div className="overlap-media" ref={mediaRef}>{media}</div>
    </div>
    <div className="overlap-content">{children}</div>
  </div>;
}
