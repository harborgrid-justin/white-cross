/**
 * Auth Layout - Centered authentication pages layout
 *
 * Purpose: Provides a clean, centered layout for authentication pages
 * Features:
 * - Full-screen centered design
 * - Healthcare branding
 * - Accessibility features
 * - Responsive on all devices
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'Authentication | White Cross Healthcare',
  },
  description: 'Secure authentication for White Cross Healthcare Platform',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Accessibility: Skip to main content */}
      <a
        href="#auth-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to content
      </a>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Main Content */}
      <main
        id="auth-content"
        className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        role="main"
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} White Cross Healthcare. HIPAA Compliant.
        </p>
      </footer>
    </div>
  );
}
