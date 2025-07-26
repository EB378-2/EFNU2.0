"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider, useNotificationProvider } from "@refinedev/mui";
import { ColorModeContextProvider } from "@/contexts/color-mode";

import routerProvider from "@refinedev/nextjs-router";
import { authProviderClient } from "@/providers/auth-provider/auth-provider.client";
import { dataProvider } from "@/providers/data-provider";
import { accessControlProvider } from "@providers/access-provider/access-control.client";
import resources from "@resources";
import SplashScreen from "@components/Layout/splashScreen";
import { Refine } from "@refinedev/core";
import { RefineKbar } from "@refinedev/kbar";
import { APP_DEFAULT_TITLE } from "@/constants";

export function Providers({
  children,
  defaultMode,
  locale,
}: {
  children: React.ReactNode;
  defaultMode: "light" | "dark";
  locale: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              authProvider={authProviderClient}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              accessControlProvider={accessControlProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "lexx72-WST3Re-ljtrGz",
                title: {
                  text: APP_DEFAULT_TITLE,
                  icon: "/Logo.png",
                },
              }}
            >
              <SplashScreen loading={false} />
              {children}
              <RefineKbar />
            </Refine>
            <ReactQueryDevtools initialIsOpen={false} />
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </QueryClientProvider>
  );
}
