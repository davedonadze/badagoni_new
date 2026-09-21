// Media uploaded through the admin panel is identified as image or video by
// its file extension (set at upload time from the file's mime type) - no
// separate "type" field is stored alongside the URL.
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)$/i.test(url);
}
