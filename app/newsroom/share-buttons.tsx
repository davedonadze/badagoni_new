// Plain anchor-based share links (no client JS needed) to each network's
// own share-intent URL, which handles pulling in the page's og:title/
// og:image itself - see lib/seo.ts's pageMetadata.
export function ShareButtons({ url, title, label }: { url: string; title: string; label: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return <div className="news-article-share">
    <span className="eyebrow">{label}</span>
    <div className="news-article-share-links">
      <a className="news-article-share-link news-article-share-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" /></svg>
      </a>
      <a className="news-article-share-link news-article-share-linkedin" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" /></svg>
      </a>
      <a className="news-article-share-link news-article-share-x" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" aria-label="Share on X">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M13.6 10.6 20.1 3h-1.6l-5.6 6.6L8.4 3H3l6.8 9.9L3 21h1.6l5.9-7 4.7 7H21l-7.4-10.4Zm-2.1 2.5-.7-1L5.4 4.2h2.5l4.4 6.3.7 1 5.7 8.2h-2.5l-4.7-6.7Z" /></svg>
      </a>
    </div>
  </div>;
}
