import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { ReviewProvider } from "@/lib/review-context";
import { ThemeProvider } from "@/lib/theme-context";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "ServiceHub - Your Service Platform",
  description:
    "Book services, manage your team, and grow your business with ServiceHub.",
};

export const viewport: Viewport = {
  themeColor: "#1a365d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-950">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <ReviewProvider>
                <div className="flex min-h-screen flex-col items-center justify-center">
                  <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-background shadow-2xl">
                    {children}
                  </div>
                </div>
              </ReviewProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
