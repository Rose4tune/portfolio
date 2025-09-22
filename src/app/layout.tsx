import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
<<<<<<< HEAD
import { Navbar, ConditionalLayout } from "@/shared/layout";
import { ThemeProvider } from "@/shared/providers";
import { AnimatedWelcomeText, ClientLoading } from "@/shared/ui";
import "@/styles/globals.css";
=======
import ThemeProvider from "@/shared/providers/ThemeProvider";
import {
  Navbar,
  ClientLoading,
  AnimatedLayout,
  AnimatedWelcomeText,
} from "@/layout";
import "./globals.css";
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))

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
