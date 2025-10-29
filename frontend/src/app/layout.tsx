/**
 * @fileoverview Root Layout Component for White Cross Healthcare Platform
 *
 * This is the top-level layout for the entire Next.js application, providing the HTML
 * document structure, global fonts, CSS, providers, and accessibility features. This layout
 * wraps ALL pages in the application and establishes foundational patterns for healthcare
 * compliance, performance optimization, and accessibility.
 *
 * @module app/layout
 * @category Core
 * @subcategory Layouts
 *
 * **Layout Hierarchy:**
 * ```
 * RootLayout (this file)
 * ├── AuthLayout (app/(auth)/layout.tsx) - Authentication pages
 * ├── DashboardLayout (app/(dashboard)/layout.tsx) - Main application
 * │   ├── MedicationsLayout (medications/layout.tsx)
 * │   └── [Feature Layouts...]
 * ├── AdminSettingsLayout (admin/settings/layout.tsx)
 * ├── AdminMonitoringLayout (admin/monitoring/layout.tsx)
 * ├── CommunicationLayout (communication/layout.tsx)
 * └── ReportsLayout (reports/layout.tsx)
 * ```
 *
 * **Key Features:**
 * - Self-hosted Inter font (HIPAA compliant, no external requests)
 * - Global CSS and Tailwind styles
 * - React Query provider for server state management
 * - Redux store provider for client state
 * - React Hot Toast for notifications
 * - Skip-to-content link for keyboard navigation (WCAG 2.1 Level A)
 * - Dynamic page title updates for screen readers
 * - Route change announcements (WCAG 4.1.3 Level AA)
 * - Dark mode support via suppressHydrationWarning
 *
 * **HIPAA Compliance:**
 * - All fonts self-hosted (no external requests)
 * - No third-party analytics in base layout
 * - Providers handle secure authentication and data management
 *
 * **Performance Optimizations:**
 * - Font preloading with font-display: swap (reduces CLS)
 * - System font fallback chain
 * - CSS bundling and optimization
 * - Optimized toast notification rendering
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Layouts}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/layout | Layout Convention}
 * @see {@link https://www.w3.org/WAI/WCAG21/quickref/ | WCAG 2.1 Guidelines}
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in the application
 * // File structure:
 * // app/
 * //   layout.tsx (this file - root layout)
 * //   page.tsx (wrapped by this layout)
 * //   (auth)/
 * //     layout.tsx (nested within root layout)
 * //     login/page.tsx
 * //   (dashboard)/
 * //     layout.tsx (nested within root layout)
 * //     dashboard/page.tsx
 * ```
 *
 * @since 1.0.0
 */

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { RouteAnnouncer } from "@/components/RouteAnnouncer";
import { PageTitle } from "@/components/PageTitle";

/**
 * Self-hosted Inter font configuration for optimal performance and HIPAA compliance.
 *
 * The Inter font family is loaded locally instead of from Google Fonts to:
 * - Eliminate external network requests (faster load times)
 * - Maintain HIPAA compliance (no third-party data sharing)
 * - Ensure consistent rendering across all environments
 * - Reduce Cumulative Layout Shift (CLS) with font-display: swap
 * - Support font subsetting for reduced file sizes
 *
 * **Font Weights:**
 * - 400 (Regular): Body text and standard UI elements
 * - 500 (Medium): Emphasized text and secondary headings
 * - 700 (Bold): Primary headings and strong emphasis
 *
 * **Performance:**
 * - `font-display: swap` - Shows fallback font immediately, swaps when Inter loads (FOUT pattern)
 * - `preload: true` - Prioritizes font loading for faster render
 * - Comprehensive fallback chain for unsupported browsers
 *
 * @constant
 * @type {LocalFont}
 *
 * @example
 * ```tsx
 * // The font is automatically applied via CSS variable:
 * <html className={inter.variable}>
 *   <body className="font-sans"> // Uses var(--font-inter)
 * ```
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

/**
 * Application-wide metadata configuration for SEO and social sharing.
 *
 * Defines the default metadata for all pages in the application. Child layouts
 * and pages can override these values using Next.js metadata merging.
 *
 * **SEO Configuration:**
 * - Title: Primary branding for search engines
 * - Description: Clear value proposition for search results
 * - Keywords: Healthcare-specific terms for discoverability
 * - Robots: Prevents indexing (PHI protection for authenticated app)
 *
 * **Security:**
 * - `robots: { index: false }` - Prevents search engine indexing (HIPAA PHI protection)
 * - No social sharing metadata at root (added per-page basis)
 *
 * @constant
 * @type {Metadata}
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata}
 */
export const metadata: Metadata = {
  title: "White Cross Healthcare Platform",
  description: "Enterprise healthcare platform for school nurses managing student health records, medications, and emergency communications.",
  keywords: ["healthcare", "school nursing", "student health", "medication management", "HIPAA compliance"],
  authors: [{ name: "White Cross Healthcare" }],
  robots: {
    index: false, // Prevent search engine indexing of authenticated healthcare app
    follow: false, // Prevent following links
  },
};

/**
 * Viewport configuration for responsive design and mobile optimization.
 *
 * Configures the viewport meta tag for optimal display across devices.
 *
 * **Settings:**
 * - `width: device-width` - Responsive layout matches device width
 * - `initialScale: 1` - No zoom on page load
 * - `maximumScale: 1` - Prevents user zoom (intentional for healthcare UI consistency)
 *
 * @constant
 * @type {Viewport}
 *
 * @remarks
 * The `maximumScale: 1` setting is intentional for healthcare applications to maintain
 * UI consistency and prevent accidental zoom during critical workflows. This may impact
 * accessibility for users who need zoom functionality. Consider allowing zoom if needed.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-viewport | Next.js Viewport}
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale removed for WCAG 2.1 AA compliance (2.5.5 - Zoom support)
};

/**
 * Root Layout Component
 *
 * The top-level layout component that wraps all pages in the application. Provides
 * the HTML document structure, global styles, fonts, providers, and core accessibility
 * features required by WCAG 2.1 AA standards.
 *
 * **Responsibilities:**
 * - Render HTML document structure (<html>, <body>)
 * - Load global CSS and fonts
 * - Initialize application providers (React Query, Redux, Auth)
 * - Render global UI components (toasts, accessibility features)
 * - Establish dark mode support
 * - Provide skip navigation for keyboard users
 *
 * **Accessibility Features:**
 * 1. Skip-to-content link (WCAG 2.4.1 Level A)
 *    - Hidden by default, visible on focus
 *    - Allows keyboard users to bypass repeated navigation
 *    - Targets #main-content ID in child layouts
 *
 * 2. Dynamic page title updates (WCAG 2.4.2 Level A)
 *    - <PageTitle /> component updates document.title on route changes
 *    - Announces page context to screen readers
 *
 * 3. Route change announcements (WCAG 4.1.3 Level AA)
 *    - <RouteAnnouncer /> announces navigation to screen readers
 *    - Uses ARIA live region for non-intrusive updates
 *
 * **Provider Hierarchy:**
 * ```tsx
 * <Providers> // app/providers.tsx
 *   ├── QueryClientProvider (TanStack Query)
 *   ├── ReduxProvider (Redux Toolkit)
 *   └── AuthProvider (Authentication context)
 * ```
 *
 * **Toast Notifications:**
 * - Position: top-right corner
 * - Duration: 4 seconds default
 * - Success: Green background (#10B981)
 * - Error: Red background (#EF4444)
 * - Accessible color contrast ratios
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child page and layout components
 *
 * @returns {JSX.Element} The root HTML structure with all global features
 *
 * @example
 * ```tsx
 * // Next.js automatically calls this layout for all pages:
 * <RootLayout>
 *   <AuthLayout>
 *     <LoginPage />
 *   </AuthLayout>
 * </RootLayout>
 * ```
 *
 * @example
 * ```tsx
 * // The rendered HTML structure:
 * <html lang="en" className="font-inter" suppressHydrationWarning>
 *   <body className="font-sans antialiased">
 *     <a href="#main-content">Skip to main content</a>
 *     <PageTitle />
 *     <RouteAnnouncer />
 *     <Providers>
 *       {children} // Your page content here
 *       <Toaster /> // Global toast notifications
 *     </Providers>
 *   </body>
 * </html>
 * ```
 *
 * @remarks
 * This is a Server Component by default. It renders on the server and does not
 * include client-side state or effects. Interactive features are handled by:
 * - Client components rendered as children
 * - Providers that wrap the application
 * - Toast notification library
 *
 * @see {@link Providers} for application provider configuration
 * @see {@link PageTitle} for dynamic title updates
 * @see {@link RouteAnnouncer} for navigation announcements
 */
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
