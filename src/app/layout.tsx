import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Navbar, ConditionalLayout } from "@/shared/layout";
import { ThemeProvider } from "@/shared/providers";
import { AnimatedWelcomeText, ClientLoading } from "@/shared/ui";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Ye Seo, LEE Portfolio",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-pretendard">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLoading loadingContent={<AnimatedWelcomeText />}>
            <Navbar />
            <main className="py-24 md:py-28">
              <ConditionalLayout>{children}</ConditionalLayout>
            </main>
          </ClientLoading>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
