"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// <html lang> is set server-side from the initial request, but (like the
// header/footer locale, see site-shell.tsx) the root layout that renders it
// stays mounted across client-side navigations, so it would otherwise go
// stale after clicking the language switcher without a hard reload.
export function LocaleSync() {
  const path = usePathname();

  useEffect(() => {
    document.documentElement.lang = path === "/ka" || path.startsWith("/ka/") ? "ka" : "en";
  }, [path]);

  return null;
}
