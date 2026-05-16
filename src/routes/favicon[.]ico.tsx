import { createFileRoute } from "@tanstack/react-router";

import { ICON_URLS } from "@/lib/icon-urls";

/**
 * Legacy favicon fallback.
 *
 * Browsers, RSS readers, scrapers, and link-preview bots routinely request
 * `/favicon.ico` at the site root regardless of what's declared in <head>.
 * Instead of returning a 404 (which some clients then cache as "no icon"),
 * we 302 to the fingerprinted Apple-style rounded PNG so the canonical
 * icon shows up everywhere.
 *
 * A 302 (not 301) keeps the redirect itself short-cached — when the icon's
 * hash changes, the next request follows to the fresh URL.
 */
export const Route = createFileRoute("/favicon.ico")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 302,
          headers: {
            Location: ICON_URLS.appleTouch,
            "Cache-Control": "public, max-age=300, must-revalidate",
          },
        }),
    },
  },
});