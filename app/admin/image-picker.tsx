"use client";
import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isVideoUrl } from "@/lib/media";

const IMAGE_ACCEPT = "image/webp,image/png,image/jpeg,image/avif";
const VIDEO_ACCEPT = "video/mp4,video/webm";

export function ImagePicker({
  id,
  label,
  value,
  onChange,
  previewClassName,
  allowVideo,
  recommendedResolution,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  previewClassName?: string;
  allowVideo?: boolean;
  recommendedResolution?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isVideo = isVideoUrl(value);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return <div className="grid gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    <div className="flex items-center gap-4">
      <div className={previewClassName ?? "flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40"}>
        {value
          ? isVideo
            ? <video src={value} className="h-full w-full object-contain" muted playsInline preload="metadata" />
            : <img src={value} alt="" className="h-full w-full object-contain" />
          : <ImageUp className="size-5 text-muted-foreground" />}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={allowVideo ? `${IMAGE_ACCEPT},${VIDEO_ACCEPT}` : IMAGE_ACCEPT}
          className="hidden"
          onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {allowVideo
            ? "Photo: WEBP, PNG, JPEG, or AVIF, up to 8 MB. Video: MP4 or WEBM, up to 50 MB."
            : "WEBP, PNG, JPEG, or AVIF — up to 8 MB."}
        </p>
        {recommendedResolution && <p className="text-xs text-muted-foreground">Recommended: {recommendedResolution}</p>}
      </div>
    </div>
    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
  </div>;
}
