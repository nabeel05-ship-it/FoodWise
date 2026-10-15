import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards.
 * Use it to defer clock-dependent UI (countdowns, expiry states) to the client
 * so statically prerendered HTML never disagrees with the first client render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/**
 * Hydration-safe reduced-motion preference: null until hydrated (matching the
 * server render), then the user's actual OS setting.
 */
export function useSafeReducedMotion(): boolean | null {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  return hydrated ? reduced : null;
}
