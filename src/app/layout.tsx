import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Preloader } from "@/components/Preloader";
import { PageTransition } from "@/components/PageTransition";
import { TransitionOverlay } from "@/components/TransitionOverlay";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ADDA Architecture",
  description: "邸岸空间建筑设计 — Elevating Spaces, Defining Aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Preloader />
        <TransitionOverlay />
        <Suspense fallback={null}><Navigation /></Suspense>
        <main className="flex-1"><PageTransition><Suspense fallback={null}>{children}</Suspense></PageTransition></main>
        <Footer />
      </body>
    </html>
  );
}
