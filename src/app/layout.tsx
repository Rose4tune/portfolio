import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/react";

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
          <Navbar />
          <main className="h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] py-6 md:py-16">
            <div className="container max-w-4xl h-full mx-auto px-4 sm:px-6">
              {children}
            </div>
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
