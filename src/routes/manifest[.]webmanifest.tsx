import { createFileRoute } from "@tanstack/react-router";

import icon192Url from "../assets/icons/icon-192.png?url";
import icon512Url from "../assets/icons/icon-512.png?url";
import iconMaskable192Url from "../assets/icons/icon-maskable-192.png?url";
import iconMaskable512Url from "../assets/icons/icon-maskable-512.png?url";
import appleTouchIconUrl from "../assets/icons/apple-touch-icon.png?url";

/**
 * Web app manifest served at /manifest.webmanifest.
 *
 * Icon URLs are Vite-fingerprinted (e.g. `/assets/icon-512-abc123.png`), so
 * any change to a source PNG produces a new manifest payload pointing at a
 * new asset URL. Browsers re-fetch the manifest on the next page load and
 * pick up the new icon without manual cache-busting.
 *
 * Note: iOS/Android pin manifest fields at install time, so already-installed
 * PWAs keep their old icons until reinstalled — fingerprinting helps fresh
 * installs and tab/home-screen icons in browsers that re-read it.
 */
export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: () => {
        const manifest = {
          name: "Agente — Bilingual AI Agents",
          short_name: "Agente",
          description:
            "Bilingual AI agents for Real Estate, Construction, Solar & Medical. WhatsApp-native. EN/ES.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#18303C",
          theme_color: "#E84118",
          icons: [
            { src: icon192Url, sizes: "192x192", type: "image/png", purpose: "any" },
            { src: icon512Url, sizes: "512x512", type: "image/png", purpose: "any" },
            {
              src: iconMaskable192Url,
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: iconMaskable512Url,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: appleTouchIconUrl,
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
          ],
        };

        return new Response(JSON.stringify(manifest), {
          status: 200,
          headers: {
            "Content-Type": "application/manifest+json",
            // Manifest itself stays short-cached; the hashed asset URLs inside
            // are immutable, so a fresh manifest fetch always resolves to the
            // newest icons.
            "Cache-Control": "public, max-age=300, must-revalidate",
          },
        });
      },
    },
  },
});