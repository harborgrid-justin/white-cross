import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
