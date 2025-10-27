import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { RouteAnnouncer } from "@/components/RouteAnnouncer";
import { PageTitle } from "@/components/PageTitle";

/**
 * Self-hosted Inter font for optimal performance
 * Benefits:
 * - No external font requests (faster load)
 * - HIPAA compliant (no third-party requests)
 * - Consistent across all environments
 * - Reduces CLS with font-display: swap
 */
const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap', // FOUT instead of FOIT for better perceived performance
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "White Cross Healthcare Platform",
  description: "Enterprise healthcare platform for school nurses managing student health records, medications, and emergency communications.",
  keywords: ["healthcare", "school nursing", "student health", "medication management", "HIPAA compliance"],
  authors: [{ name: "White Cross Healthcare" }],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Skip navigation link for keyboard users - WCAG 2.4.1 Level A */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {/* Dynamic page title updates - WCAG 2.4.2 Level A */}
        <PageTitle />

        {/* Route change announcements for screen readers - WCAG 4.1.3 Level AA */}
        <RouteAnnouncer />

        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "text-sm",
              success: {
                style: {
                  background: '#10B981',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
