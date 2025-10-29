/**
 * @fileoverview Authentication Layout Component for White Cross Healthcare Platform
 *
 * This layout component provides the visual container and structure for all authentication-related
 * pages including login, access denied, and session expired pages. It implements healthcare-specific
 * design patterns, accessibility requirements, and HIPAA-compliant security messaging.
 *
 * @module app/(auth)/layout
 * @category Authentication
 * @subcategory Layouts
 *
 * @route /login - User authentication page
 * @route /access-denied - Unauthorized access notification
 * @route /session-expired - Session timeout notification
 *
 * @security
 * - All authentication pages use this layout for consistent security messaging
 * - HIPAA compliance notice displayed in footer
 * - No PHI (Protected Health Information) data rendered at layout level
 * - Accessibility features for WCAG 2.1 AA compliance
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Layouts}
 * @see {@link https://www.w3.org/WAI/WCAG21/quickref/ | WCAG 2.1 Guidelines}
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in app/(auth)/ directory
 * // File structure:
 * // app/(auth)/
 * //   layout.tsx (this file)
 * //   login/page.tsx
 * //   access-denied/page.tsx
 * //   session-expired/page.tsx
 * ```
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';

/**
 * Metadata configuration for authentication pages
 *
 * Provides SEO-optimized metadata with dynamic title templating for all authentication
 * pages in the route group. The template pattern allows child pages to define their
 * specific titles while maintaining consistent branding.
 *
 * @type {Metadata}
 *
 * @property {Object} title - Title configuration with template pattern
 * @property {string} title.template - Template string for child page titles
 * @property {string} title.default - Default title when child pages don't specify one
 * @property {string} description - Meta description for SEO and social sharing
 */
export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'Authentication | White Cross Healthcare',
  },
  description: 'Secure authentication for White Cross Healthcare Platform',
};

/**
 * Props interface for the AuthLayout component
 *
 * @interface AuthLayoutProps
 * @property {React.ReactNode} children - Child page components rendered within the layout
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Authentication Layout Component
 *
 * Provides a consistent, accessible layout for all authentication pages. Implements
 * healthcare-specific design patterns with centered content, subtle gradient backgrounds,
 * and clear HIPAA compliance messaging.
 *
 * **Design Features:**
 * - Full-screen gradient background with healthcare-themed colors (blue/indigo)
 * - Decorative blur effects for visual depth without distraction
 * - Centered content area with max-width constraint (max-w-md)
 * - Responsive padding that adapts to screen sizes
 * - Fixed footer with HIPAA compliance notice
 *
 * **Accessibility Features:**
 * - Skip-to-content link for keyboard navigation (WCAG 2.1 Level A)
 * - Semantic HTML5 elements (main, footer) for screen readers
 * - ARIA role attributes for improved accessibility tree
 * - Focus-visible styles for keyboard users
 * - High contrast text for readability
 *
 * **Security Considerations:**
 * - Layout does not access authentication state or tokens
 * - No sensitive data rendered at layout level
 * - HIPAA compliance messaging visible on all auth pages
 * - All auth operations handled by child page components
 *
 * @param {AuthLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child page components to render
 *
 * @returns {JSX.Element} The authentication layout structure with children
 *
 * @example
 * ```tsx
 * // Next.js automatically uses this layout for all pages in (auth) directory
 * // The layout wraps the page content like this:
 * <AuthLayout>
 *   <LoginPage /> // or <AccessDeniedPage /> or <SessionExpiredPage />
 * </AuthLayout>
 * ```
 *
 * @example
 * ```tsx
 * // The rendered HTML structure:
 * <div className="min-h-screen bg-gradient...">
 *   <a href="#auth-content">Skip to content</a>
 *   <div>Background decorative elements</div>
 *   <main id="auth-content">
 *     <div className="w-full max-w-md">
 *       {children} // Login form, error messages, etc.
 *     </div>
 *   </main>
 *   <footer>HIPAA Compliant notice</footer>
 * </div>
 * ```
 *
 * @remarks
 * This is a Next.js Server Component by default. It does not use client-side state
 * or effects. All interactive features are delegated to client components rendered
 * as children.
 *
 * @see {@link LoginPage} for the main authentication form
 * @see {@link AccessDeniedPage} for authorization error handling
 * @see {@link SessionExpiredPage} for session timeout handling
 */
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
