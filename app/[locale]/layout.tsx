"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Spinner } from "@components/ui/Spinner";
import { NextIntlClientProvider } from "next-intl";

export default function Layout({ 
    children, 
    params: { locale } 
}: { 
    children: React.ReactNode;
    params: { locale: string };
}) {
  
    const [messages, setMessages] = useState<any | null>(null);
  
    useEffect(() => {
      import(`@/i18n/messages/${locale}.json`)
        .then((mod) => setMessages(mod.default || mod))
        .catch(() => setMessages({}));
    }, [locale]);
  
    if (!messages) return null; // or <LoadingScreen />

    return (
        <>
            <Suspense fallback={<Spinner/>}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    {children}
                </NextIntlClientProvider>
            </Suspense>
        </>
    );
}