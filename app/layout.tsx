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

import { SearchProvider } from "@/lib/search-context";
import { ChatProvider } from "@/lib/chat-context";
import { FavoritesProvider } from "@/lib/favorites-context";

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
                <FavoritesProvider>
                  <ChatProvider>
                    <SearchProvider>
                      <div className="flex min-h-screen w-full flex-col items-center bg-slate-950 overflow-y-auto p-4 py-8 sm:p-12">
                        <div className="phone-frame my-auto">
                          <div className="phone-notch">
                            <div className="phone-camera" />
                          </div>
                          
                          <div className="phone-inner">
                            {/* Status Bar */}
                            <div className="phone-status-bar">
                              <span>9:41</span>
                              <div className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></svg>
                              </div>
                            </div>
                            
                            {/* App Content */}
                            <div className="flex-1 relative overflow-hidden flex flex-col">
                              {children}
                            </div>
                            
                            <div className="phone-footer-bar" />
                          </div>
                        </div>
                      </div>
                    </SearchProvider>
                  </ChatProvider>
                </FavoritesProvider>
              </ReviewProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
