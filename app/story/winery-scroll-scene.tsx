"use client";

import { useEffect, useRef, type ReactNode } from "react";

const wineryAlt = "Badagoni winery in Zemo Khodasheni, with its illuminated sign and glass facade at dusk";

export function WineryScrollScene({ intro, children }: { intro: ReactNode; children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const imageWindow = windowRef.current;
    if (!scene || !imageWindow) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastOffset = "";

    const update = () => {
      frame = 0;
      const bounds = imageWindow.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - bounds.top) / (viewport + bounds.height)));
      // Scroll position drives the same gentle movement forwards and backwards.
      const offset = reducedMotion.matches ? "0px" : `${((0.5 - progress) * viewport * 0.12).toFixed(2)}px`;
      if (offset !== lastOffset) {
        scene.style.setProperty("--winery-drift", offset);
        lastOffset = offset;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(scene);
    resizeObserver.observe(imageWindow);
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

  return <div className="story-winery-sequence" ref={sceneRef}>
    <div className="story-winery-content">
      <div className="story-winery-overlay">{intro}</div>
      <figure className="story-winery-window" ref={windowRef} role="img" aria-label={wineryAlt}>
        <img className="story-winery-static-photo" src="/images/winery.jpg" alt="" width={2560} height={1595} loading="lazy" />
        <figcaption><span>Badagoni winery</span><span>Zemo Khodasheni / Kakheti, Georgia</span></figcaption>
      </figure>
      <div className="story-winery-overlay">{children}</div>
    </div>
    <div className="story-winery-track" aria-hidden="true">
      <div className="story-winery-stage">
        <div className="story-winery-parallax"><img src="/images/winery.jpg" alt="" width={2560} height={1595} loading="lazy" /></div>
      </div>
    </div>
  </div>;
}
