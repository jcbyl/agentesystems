import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Agente — Bilingual AI Agents for Real Estate, Construction, Solar & Medical" },
      { name: "description", content: "The bilingual alternative to Lindy. Industry-expert AI agents for Latino-owned businesses. WhatsApp-native. EN/ES. Flat pricing. Start free." },
      { name: "author", content: "JCB Industries LLC" },
      { property: "og:title", content: "Agente — Bilingual AI Agents for Real Estate, Construction, Solar & Medical" },
      { property: "og:description", content: "The bilingual alternative to Lindy. WhatsApp-native. EN/ES. Flat pricing. Live in 24 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700;1,800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M4 14C4 9.582 7.582 6 12 6H68C72.418 6 76 9.582 76 14V52C76 56.418 72.418 60 68 60H30L16 72V60H12C7.582 60 4 56.418 4 52V14Z' fill='%23E84118'/%3E%3Cline x1='40' y1='15' x2='40' y2='20' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='40' cy='12' r='3.5' fill='white'/%3E%3Ccircle cx='40' cy='12' r='1.5' fill='%23E84118'/%3E%3Ccircle cx='40' cy='35' r='14' fill='white'/%3E%3Ccircle cx='33' cy='34' r='5.5' fill='%2318303C'/%3E%3Ccircle cx='47' cy='34' r='5.5' fill='%2318303C'/%3E%3Ccircle cx='35' cy='32' r='2' fill='white'/%3E%3Ccircle cx='49' cy='32' r='2' fill='white'/%3E%3Cpath d='M20 35C20 24.507 29.059 16 40 16C50.941 16 60 24.507 60 35' stroke='white' stroke-width='2.5' stroke-linecap='round' fill='none'/%3E%3Crect x='14' y='31' width='7' height='11' rx='3.5' fill='white'/%3E%3Crect x='59' y='31' width='7' height='11' rx='3.5' fill='white'/%3E%3Cpath d='M64 41C64 41 65 47 61 49' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='60.5' cy='50' r='2' fill='white'/%3E%3Cpath d='M28 58C28 52 33 48 40 48C47 48 52 52 52 58' fill='white' opacity='0.85'/%3E%3C/svg%3E",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
    ],
    meta: [
      ...(undefined as never),
    ].length === 0
      ? undefined
      : undefined,
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
      </I18nProvider>
    </QueryClientProvider>
  );
}
