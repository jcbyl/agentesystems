import { createFileRoute } from "@tanstack/react-router";

import { ICON_URLS } from "@/lib/icon-urls";

/**
 * Catch-all for legacy icon filenames.
 *
 * Old deploys / bookmarks / cached HTML may still point at unhashed paths
 * like `/apple-touch-icon.png`, `/apple-touch-icon-precomposed.png`,
 * `/favicon.png`, `/favicon-16.png`, `/favicon-32.png`, `/icon-192.png`,
 * `/icon-512.png`. Rather than hand-rolling a route file per name (and
 * shipping a 404 for any we forgot), we route them all through this splat
 * handler and redirect to the canonical Apple-style rounded icon.
 *
 * The actual remapping lives in `src/server.ts` (icon-fallback URL rewriter)
 * which forwards legacy root-level icon paths to /api/icon-fallback/<name>
 * so this single handler can serve them all.
 */
export const Route = createFileRoute("/api/icon-fallback/$")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const name = (params._splat ?? "").toLowerCase();

        // Pick the closest-sized canonical asset for each legacy name so the
        // redirected file roughly matches what the caller expected. When no
        // size is encoded, fall back to the Apple-style 1024px icon.
        const target =
          /(^|-)16(\.|$)/.test(name)
            ? ICON_URLS.favicon16
            : /(^|-)32(\.|$)/.test(name)
              ? ICON_URLS.favicon32
              : /(^|-)192(\.|$)/.test(name)
                ? ICON_URLS.icon192
                : /(^|-)512(\.|$)/.test(name)
                  ? ICON_URLS.icon512
                  : ICON_URLS.appleTouch;

        return new Response(null, {
          status: 302,
          headers: {
            Location: target,
            "Cache-Control": "public, max-age=300, must-revalidate",
          },
        });
      },
    },
  },
});