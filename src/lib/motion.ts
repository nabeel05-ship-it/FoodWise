/**
 * FoodWise Reusable Motion Design System
 * 
 * Provides Apple-inspired spring physics, timing tokens, easing curves,
 * and accessible animation variants that strictly respect user reduced-motion preferences.
 * 
 * Built for FoodWise using Motion for React ("motion/react").
 */

import { type Variants } from "motion/react";

// ============================================================
// 1. TIMING & EASING TOKENS
// ============================================================

export const MOTION_DURATIONS = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.28,
  smooth: 0.38,
  deliberate: 0.5,
  staggerInterval: 0.045,
} as const;

/**
 * Apple-inspired cubic-bezier easing curves:
 * - standard: refined, responsive curve for interface transitions
 * - decelerate: gentle entry curve
 * - accelerate: exit curve
 */
export const MOTION_EASINGS = {
  apple: [0.16, 1, 0.3, 1] as const,
  appleDecelerate: [0.0, 0.0, 0.2, 1] as const,
  appleAccelerate: [0.3, 0.0, 0.8, 0.15] as const,
  springy: [0.34, 1.56, 0.64, 1] as const,
};

// ============================================================
// 2. SPRING PHYSICS PRESETS
// ============================================================

export const MOTION_SPRINGS = {
  /** Responsive, snappy spring for buttons, tabs, micro-interactions */
  micro: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.8,
  },
  /** Balanced, natural spring for cards, dialogs, drawers */
  natural: {
    type: "spring" as const,
    stiffness: 380,
    damping: 30,
    mass: 1,
  },
  /** Gentle, smooth spring for page entrances & larger content blocks */
  gentle: {
    type: "spring" as const,
    stiffness: 260,
    damping: 26,
    mass: 1,
  },
  /** Subtle overshoot spring for notifications and badges */
  playful: {
    type: "spring" as const,
    stiffness: 420,
    damping: 24,
    mass: 0.9,
  },
} as const;

// ============================================================
// 3. REUSABLE ANIMATION VARIANTS
// ============================================================

/** Fade In */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATIONS.normal, ease: MOTION_EASINGS.apple },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Slide Up (Page / Section / Card entrance) */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION_SPRINGS.natural,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Scale In (Modal / Popover / Badge) */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: MOTION_SPRINGS.natural,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Drawer Slide from Right (Notification Drawer / Action Drawers) */
export const drawerRightVariants: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: MOTION_SPRINGS.natural,
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: MOTION_DURATIONS.normal, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Drawer Slide from Left (Mobile Navigation Sidebar) */
export const drawerLeftVariants: Variants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: MOTION_SPRINGS.natural,
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: { duration: MOTION_DURATIONS.normal, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Modal Backdrop (Dimmed + Blurred) */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATIONS.normal, ease: MOTION_EASINGS.apple },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.appleAccelerate },
  },
};

/** Stagger Container for Card Grids / Lists */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_DURATIONS.staggerInterval,
      delayChildren: 0.02,
    },
  },
};

/** Stagger Item for Child Elements */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION_SPRINGS.natural,
  },
};

/** Accordion / Expandable Section */
export const accordionVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.apple },
  },
  expanded: {
    opacity: 1,
    height: "auto",
    overflow: "visible",
    transition: { duration: MOTION_DURATIONS.normal, ease: MOTION_EASINGS.apple },
  },
};

/** Interactive Card Hover / Press feedback */
export const cardInteractiveProps = {
  whileHover: {
    y: -3,
    boxShadow: "0 10px 25px -4px rgba(7, 43, 30, 0.08), 0 4px 10px -2px rgba(7, 43, 30, 0.04)",
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.apple },
  },
  whileTap: {
    scale: 0.985,
    transition: { duration: MOTION_DURATIONS.instant },
  },
};

/** Button Hover / Press feedback */
export const buttonPressProps = {
  whileHover: {
    scale: 1.015,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.apple },
  },
  whileTap: {
    scale: 0.965,
    transition: { duration: MOTION_DURATIONS.instant },
  },
};

// ============================================================
// 4. ACCESSIBILITY & REDUCED-MOTION HELPERS
// ============================================================

/**
 * Checks whether user prefers reduced motion in browser runtime.
 */
export function checkPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Sanitizes animation variants for reduced motion.
 * Strips transform properties (x, y, scale, rotate) and replaces them with pure opacity fades.
 */
export function getReducedMotionVariants(variants: Variants, shouldReduce: boolean | null): Variants {
  if (!shouldReduce) return variants;

  const reduced: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(variants)) {
    if (typeof val === "object" && val !== null) {
      const { ...rest } = val as Record<string, unknown>;
      delete rest.x;
      delete rest.y;
      delete rest.scale;
      delete rest.rotate;
      reduced[key] = {
        ...rest,
        opacity: (val as Record<string, unknown>).opacity ?? 1,
        transition: { duration: MOTION_DURATIONS.fast },
      };
    } else {
      reduced[key] = val;
    }
  }
  return reduced as unknown as Variants;
}

/**
 * Fires milestone confetti strictly when reduced motion is NOT requested.
 */
export async function fireMilestoneConfetti(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
}): Promise<void> {
  if (checkPrefersReducedMotion()) return;

  try {
    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default;
    confetti({
      particleCount: options?.particleCount ?? 60,
      spread: options?.spread ?? 55,
      origin: options?.origin ?? { y: 0.65 },
      colors: ["#10B981", "#059669", "#34D399", "#F59E0B", "#3B82F6"],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore if canvas-confetti is unavailable
  }
}
