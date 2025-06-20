import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/react";
import ClientLoading from "@/components/ClientLoading";
import { AnimatePresence } from "framer-motion";
import TransitionWrapper from "@/components/TransitionWrapper";

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
          <ClientLoading>
            <Navbar />
            <main className="py-6 md:py-16">
              <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                <AnimatePresence mode="wait">
                  <TransitionWrapper>{children}</TransitionWrapper>
                </AnimatePresence>
              </div>
            </main>
          </ClientLoading>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
