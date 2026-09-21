import { isVideoUrl } from "@/lib/media";

// Renders admin-uploaded banner media (see app/admin/image-picker.tsx) as a
// video or image depending on what was uploaded, for use inside
// ParallaxMedia's `media` prop. className carries page-specific framing
// (object-position, entrance animations) that must apply to either tag.
export function BannerMedia({ src, alt, className, fetchPriority, loading }: { src: string; alt: string; className?: string; fetchPriority?: "high" | "low" | "auto"; loading?: "lazy" | "eager" }) {
  if (isVideoUrl(src)) {
    return <video src={src} className={className} autoPlay muted loop playsInline />;
  }
  return <img src={src} alt={alt} className={className} fetchPriority={fetchPriority} loading={loading} />;
}
