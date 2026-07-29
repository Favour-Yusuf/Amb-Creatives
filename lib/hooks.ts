"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a media query without a setState-in-effect round trip. The server
 * snapshot keeps hydration stable; React re-renders once on the client with
 * the real value.
 */
export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/** Non-reactive sources still need a subscribe function; this one never fires. */
const neverChanges = () => () => {};

export const INTRO_SEEN_KEY = "amb:intro-seen";

/** True once the opening title card has played in this browser session. */
export function useIntroSeen() {
  return useSyncExternalStore(
    neverChanges,
    () => sessionStorage.getItem(INTRO_SEEN_KEY) === "1",
    () => false,
  );
}
