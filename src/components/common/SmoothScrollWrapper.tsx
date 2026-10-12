"use client";

import React, { useEffect, useRef } from "react";
import { checkPrefersReducedMotion } from "@/lib/motion";

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

/**
 * Provides smooth, organic inertia scrolling using Lenis for public showcase pages.
 * Strictly checks prefers-reduced-motion: if enabled, Lenis is disabled and
 * native browser scrolling is maintained.
 */
export default function SmoothScrollWrapper({
  children,
  className,
  enabled = true,
}: SmoothScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || checkPrefersReducedMotion()) {
      return;
    }

    let isDestroyed = false;
    let lenisInstance: import("lenis").default | null = null;
    let rafId: number | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (isDestroyed) return;

      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      function onRaf(time: number) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(onRaf);
        }
      }

      rafId = requestAnimationFrame(onRaf);
    }).catch(() => {
      // Graceful fallback to native scrolling if Lenis fails to load
    });

    return () => {
      isDestroyed = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
