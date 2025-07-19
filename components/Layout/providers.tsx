"use client";

import React, { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";


export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);


  useEffect(() => {
    import(`@/i18n/messages/${locale}.json`)
      .then((mod) => setMessages(mod.default || mod))
      .catch(() => setMessages({}));
  }, [locale]);

  if (!messages) return null; // or <LoadingScreen />

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
        {children}        
    </NextIntlClientProvider>
  );
}