import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ThemeProvider from "@/shared/providers/ThemeProvider";
import {
  Navbar,
  ClientLoading,
  AnimatedLayout,
  AnimatedWelcomeText,
} from "@/layout";
import "./globals.css";

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
            <main className="py-6 md:py-16">
              <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                <AnimatedLayout>{children}</AnimatedLayout>
              </div>
            </main>
          </ClientLoading>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
