/**
 * @fileoverview Root Homepage Component
 *
 * Landing page for the White Cross Healthcare Platform. Displays a marketing homepage
 * with platform features, authentication status, and navigation to key sections. Adapts
 * content based on whether the user is authenticated or not.
 *
 * @module app/page
 * @category Pages
 * @subcategory Public
 *
 * **Page Features:**
 * - Responsive header with conditional navigation
 * - Hero section with platform overview
 * - Feature grid highlighting key capabilities
 * - Platform status indicators
 * - Footer with copyright and compliance info
 * - Conditional CTAs based on auth state
 *
 * **Authentication States:**
 * - Authenticated: Shows Dashboard link, user greeting
 * - Unauthenticated: Shows Sign In and Get Started buttons
 *
 * **Feature Highlights:**
 * 1. Health Records Management - HIPAA-compliant record access
 * 2. Medication Management - Prescriptions, schedules, reminders
 * 3. Emergency Communications - Instant notifications, crisis management
 *
 * **Status Indicators:**
 * - Backend API status
 * - Database connection
 * - Real-time features availability
 * - HIPAA compliance verification
 *
 * @requires Client Component - Uses Redux hooks and authentication state
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages}
 *
 * @example
 * ```tsx
 * // This page is automatically rendered at the root route:
 * // URL: https://app.whitecross.healthcare/
 * // Renders: <Home />
 * ```
 *
 * @returns {JSX.Element} Complete homepage with header, hero, features, and footer
 *
 * @since 1.0.0
 */

'use client';

import { useMemo } from 'react';
import { 
  HomeHeader, 
  HeroSection, 
  FeaturesGrid, 
  PlatformStatus, 
  HomeFooter 
} from '@/components/pages/HomePage';

/**
 * Homepage Component
 *
 * Client Component that renders the landing page for the White Cross Healthcare Platform.
 * Now refactored into smaller, focused components for better maintainability and reusability.
 *
 * **Component Structure:**
 * - HomeHeader: Authentication-aware navigation header
 * - HeroSection: Main value proposition and CTA
 * - FeaturesGrid: Platform features showcase
 * - PlatformStatus: System health indicators
 * - HomeFooter: Copyright and platform information
 *
 * **Responsive Design:**
 * - Mobile: Single column, stacked navigation
 * - Tablet: sm breakpoints, 2-column features
 * - Desktop: lg breakpoints, 3-column features grid
 *
 * **Accessibility:**
 * - Semantic HTML (header, main, footer)
 * - Proper heading hierarchy (h1 → h2 → h3)
 * - WCAG 2.1 AA compliance
 *
 * @returns {JSX.Element} Full homepage layout with modular components
 */
export default function Home() {
  // Check if we're running on the client to prevent hydration mismatch
  const mounted = useMemo(() => typeof window !== 'undefined', []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader mounted={mounted} />
      
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesGrid />
          <PlatformStatus />
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
