/**
 * Centralized fingerprinted icon URL exports.
 *
 * Both `src/routes/__root.tsx` (client + SSR) and the server-only manifest
 * route at `src/routes/manifest[.]webmanifest.tsx` import from here. Because
 * `__root.tsx` is part of the client bundle, importing this module from
 * there forces Vite to emit every referenced PNG into `dist/client/assets/`
 * with a content hash — otherwise icons referenced only from server-only
 * routes would land in the SSR bundle and 404 from the browser.
 */
import favicon16Url from "../assets/icons/favicon-16.png?url";
import favicon32Url from "../assets/icons/favicon-32.png?url";
import appleTouchIconUrl from "../assets/icons/apple-touch-icon.png?url";
import icon192Url from "../assets/icons/icon-192.png?url";
import icon512Url from "../assets/icons/icon-512.png?url";
import iconMaskable192Url from "../assets/icons/icon-maskable-192.png?url";
import iconMaskable512Url from "../assets/icons/icon-maskable-512.png?url";

export const ICON_URLS = {
  favicon16: favicon16Url,
  favicon32: favicon32Url,
  appleTouch: appleTouchIconUrl,
  icon192: icon192Url,
  icon512: icon512Url,
  iconMaskable192: iconMaskable192Url,
  iconMaskable512: iconMaskable512Url,
} as const;