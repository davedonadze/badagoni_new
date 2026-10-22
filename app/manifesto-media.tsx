"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ParallaxMedia } from "./parallax-media";
import { BannerMedia } from "./banner-media";
import { isVideoUrl } from "@/lib/media";

// The manifesto section's media is admin-uploaded and may be an image or a
// video (see BannerMedia) - only a video gets play/pause and sound controls.
// Default: playing, muted (same as every other autoplaying banner video on
// the site), with a bottom-center control bar to let a visitor pause it or
// turn the sound on.
export function ManifestoMedia({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const isVideo = isVideoUrl(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncPlaying = () => setPlaying(!video.paused);
    const syncMuted = () => setMuted(video.muted);
    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);
    video.addEventListener("volumechange", syncMuted);
    return () => {
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
      video.removeEventListener("volumechange", syncMuted);
    };
  }, [src]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }

  return <ParallaxMedia
    className="manifesto-image"
    media={<BannerMedia src={src} alt={alt} loading="lazy" onVideoReady={el => { videoRef.current = el; }} />}
    overlay={<>
      <span>{caption}</span>
      {isVideo && <div className="manifesto-video-controls">
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>
          {playing ? "Pause" : "Play"}{playing ? <Pause size={14} strokeWidth={1.3} /> : <Play size={14} fill="currentColor" />}
        </button>
        <button type="button" onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
          {muted ? "Sound off" : "Sound on"}
        </button>
      </div>}
    </>}
  />;
}
