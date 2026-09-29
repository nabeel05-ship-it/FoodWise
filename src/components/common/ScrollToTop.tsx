"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser automatic scroll restoration to avoid starting from bottom
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      // Scroll window and document body to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      // Scroll any inner scrollable containers to top
      const scrollables = document.querySelectorAll(
        "main, #main-content, [data-scroll-container], .sidebar-content"
      );
      scrollables.forEach((el) => {
        el.scrollTop = 0;
      });
    };

    // Execute immediately and with timers to ensure post-render DOM changes don't displace scroll
    resetScroll();
    const rAF = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 30);
    const t2 = setTimeout(resetScroll, 120);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
