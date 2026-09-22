"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The media stays pinned via position: sticky (native, so it can never
// create a layout gap), but instead of a fixed top offset that holds it
// completely still, the top value itself drifts slowly as the user keeps
// scrolling. `lag` controls how much: 1 keeps it fully still (the old
// frozen pin); lower values let it keep moving in the same direction as
// scroll, just slower than the content scrolling over it.
export function ScrollScene({ media, children, lag = 0.4 }: { media: ReactNode; children: ReactNode; lag?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const visual = mediaRef.current;
    if (!scene || !visual) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTop = "";

    const update = () => {
      frame = 0;
      const height = visual.offsetHeight;
      // On short screens, reveal the bottom of the image before pinning it.
      const basePinTop = Math.min(0, window.innerHeight - height);
      const sceneTop = scene.getBoundingClientRect().top;
      // How far the page has scrolled past the scene's natural top (0 while
      // it hasn't reached that point yet, so normal flow is unaffected).
      const naturalOverflow = reducedMotion.matches ? 0 : Math.max(0, -sceneTop);
      const drift = naturalOverflow * (1 - lag);
      const top = `${(basePinTop - drift).toFixed(2)}px`;
      if (top !== lastTop) {
        scene.style.setProperty("--overlap-top", top);
        lastTop = top;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(visual);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [lag]);

  return <div className="overlap-scene" ref={sceneRef}>
    <div className="overlap-sticky">
      <div className="overlap-media" ref={mediaRef} onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible") && sceneRef.current && sceneRef.current.getBoundingClientRect().top < 0) {
          sceneRef.current.scrollIntoView({ block: "start", behavior: "auto" });
        }
      }}>{media}</div>
    </div>
    <div className="overlap-content">{children}</div>
  </div>;
}
