

import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { Spinner } from "@components/ui/Spinner";
import Nav from "@components/Layout/navbar";
import RightTabModal from "@components/Layout/AlertTabComponent";
import { BackgroundProvider } from "@components/Layout/BackgroundProvider";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();



  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
      <>
        <BackgroundProvider>
          <Suspense>
            <RightTabModal />
          </Suspense>
          <Suspense fallback={<Spinner/>}>
            { children }
          </Suspense>
        </BackgroundProvider>
        <Nav/>
      </>
  );
}