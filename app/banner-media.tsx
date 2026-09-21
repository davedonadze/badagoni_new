import { isVideoUrl } from "@/lib/media";

// Renders admin-uploaded banner media (see app/admin/image-picker.tsx) as a
// video or image depending on what was uploaded, for use inside
// ParallaxMedia's `media` prop.
export function BannerMedia({ src, alt, fetchPriority, loading }: { src: string; alt: string; fetchPriority?: "high" | "low" | "auto"; loading?: "lazy" | "eager" }) {
  if (isVideoUrl(src)) {
    return <video src={src} autoPlay muted loop playsInline />;
  }
  return <img src={src} alt={alt} fetchPriority={fetchPriority} loading={loading} />;
}
