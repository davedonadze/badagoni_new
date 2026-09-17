"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollScene({ media, children, earlyReveal = false, intensity = 0.12 }: { media: ReactNode; children: ReactNode; earlyReveal?: boolean; intensity?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const visual = mediaRef.current;
    if (!scene || !visual) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastOffset = "";
    let lastPinTop = "";

    const update = () => {
      frame = 0;
      const height = visual.offsetHeight;
      // On short screens, reveal the bottom of the image before pinning it.
      const pinTop = Math.min(0, window.innerHeight - height);
      // earlyReveal starts the drift as soon as the scene begins entering the
      // viewport from below, instead of waiting until it reaches its pinned
      // position at the top.
      const reference = earlyReveal ? window.innerHeight : pinTop;
      const distance = reducedMotion.matches ? 0 : Math.max(0, reference - scene.getBoundingClientRect().top);
      // The content covers the image at full scroll speed; the image drifts at `intensity`.
      const offset = `${(-Math.min(distance, height + pinTop) * intensity).toFixed(2)}px`;
      const top = `${pinTop}px`;
      if (top !== lastPinTop) {
        scene.style.setProperty("--overlap-top", top);
        lastPinTop = top;
      }
      if (offset !== lastOffset) {
        visual.style.setProperty("--overlap-offset", offset);
        lastOffset = offset;
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
  }, []);

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
