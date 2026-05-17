import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import * as React from "react";
import { RouteLoader } from "@/components/shared/RouteLoader";
import { TransitionProvider } from "@/components/providers/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GoalsOS | Enterprise Goal Governance",
  description: "Enterprise-grade goal tracking and governance platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TransitionProvider>
          <React.Suspense fallback={null}>
            <RouteLoader />
          </React.Suspense>
          {children}
        </TransitionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
