// middleware.ts
import NextIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from "next/server";

const intlMiddleware = NextIntlMiddleware({
  locales: ['en', 'fi', 'se', 'de'],
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  // 1. Process i18n first
  const intlResponse = await intlMiddleware(request);
  if (intlResponse) return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|OneSignalSDKWorker.js|manifest.webmanifest|.*\\.(?:svg|png|jpg|js|jpeg|gif|webp|json|ico)$).*)"
  ],
};
