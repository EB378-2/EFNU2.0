import { ReactNode } from "react";
import { Providers } from "../../components/Layout/providers";

type Params = { locale: string };

interface Props {
  children: ReactNode;
  params: Promise<Params>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params; // <-- Await the Promise here

  return (
    <html lang={resolvedParams.locale}>
      <body>
        <Providers locale={resolvedParams.locale}>{children}</Providers>
      </body>
    </html>
  );
}
