"use client";
import { useEffect, useRef } from "react";
import { isVideoUrl } from "@/lib/media";

// Renders admin-uploaded banner media (see app/admin/image-picker.tsx) as a
// video or image depending on what was uploaded, for use inside
// ParallaxMedia's `media` prop. className carries page-specific framing
// (object-position, entrance animations) that must apply to either tag.
export function BannerMedia({ src, alt, className, fetchPriority, loading }: { src: string; alt: string; className?: string; fetchPriority?: "high" | "low" | "auto"; loading?: "lazy" | "eager" }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // The `muted` JSX/HTML attribute only sets the element's `defaultMuted`
    // - Safari (unlike Chrome) doesn't treat that as enough to permit
    // autoplay once the element has gone through React hydration, so it
    // falls back to showing a tap-to-play state. Setting the live `.muted`
    // property directly satisfies Safari's autoplay check.
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  if (isVideoUrl(src)) {
    return <video ref={videoRef} src={src} className={className} autoPlay muted loop playsInline />;
  }
  return <img src={src} alt={alt} className={className} fetchPriority={fetchPriority} loading={loading} />;
}
