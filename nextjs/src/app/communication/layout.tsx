/**
 * @fileoverview Communication Section Layout
 *
 * Minimal layout wrapper for the communication section of the White Cross Healthcare Platform.
 * Provides consistent container styling and spacing for all communication-related pages including
 * messages, broadcasts, notifications, and emergency communications.
 *
 * @module app/communication/layout
 * @category Features
 * @subcategory Communication
 *
 * **Layout Hierarchy:**
 * ```
 * RootLayout
 * └── CommunicationLayout (this file)
 *     ├── /communication (Communication Dashboard)
 *     ├── /communication/messages
 *     ├── /communication/broadcasts
 *     └── /communication/notifications
 * ```
 *
 * **Purpose:**
 * - Provides consistent max-width container (max-w-7xl)
 * - Establishes uniform padding for communication pages
 * - Maintains responsive spacing across breakpoints
 * - Sets light background for visual hierarchy
 *
 * **HIPAA Compliance:**
 * - Communication data may contain PHI
 * - Secure messaging required for parent/guardian communications
 * - Audit logging enforced at component level
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in app/communication/
 * // File structure:
 * // app/communication/
 * //   layout.tsx (this file)
 * //   page.tsx (Communication Dashboard)
 * //   messages/page.tsx
 * //   broadcasts/page.tsx
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

/**
 * Props interface for the Communication Layout component.
 *
 * @interface CommunicationLayoutProps
 * @property {React.ReactNode} children - Communication page components to render
 */
interface CommunicationLayoutProps {
  children: React.ReactNode
}

/**
 * Communication Layout Component
 *
 * Simple container layout that provides consistent spacing and max-width constraints
 * for all communication pages. Uses a minimal approach to allow communication features
 * flexibility in their own layouts.
 *
 * @param {CommunicationLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child communication pages
 *
 * @returns {JSX.Element} Container layout with responsive padding
 *
 * @example
 * ```tsx
 * // Next.js automatically applies this layout:
 * <CommunicationLayout>
 *   <MessagesPage />
 * </CommunicationLayout>
 * ```
 */
export default function CommunicationLayout({ children }: CommunicationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
