"use client";

import { useEffect } from "react";

/**
 * Stops the browser from re-entering the app after sign-out via the Back
 * button. Next.js controls the page `Cache-Control` header (it emits
 * `no-cache`, not `no-store`), so on a back/forward navigation the browser can
 * show a protected page from its cache without hitting the server — skipping
 * the proxy's auth check.
 *
 * Whenever the page is reached via back/forward we re-verify the session and
 * send the user to /login if it's gone. Two paths are covered:
 *  - a fresh document served from the HTTP cache: `pageshow` already fired
 *    before hydration, so we check the navigation type on mount;
 *  - a true back/forward-cache (bfcache) resume: the mount effect does not
 *    re-run, but `pageshow` fires with `persisted === true`.
 *
 * A signed-in user is left alone, so normal back-navigation stays instant.
 */
export function BfcacheGuard() {
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await res.json();
        if (!session?.user) {
          window.location.replace("/login");
        }
      } catch {
        // Network hiccup — the next server navigation still enforces auth.
      }
    }

    function isBackForward() {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      return nav?.type === "back_forward";
    }

    // Fresh document restored from the HTTP cache on a back/forward navigation.
    if (isBackForward()) {
      void verifySession();
    }

    // Frozen document resumed from the bfcache.
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        void verifySession();
      }
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
