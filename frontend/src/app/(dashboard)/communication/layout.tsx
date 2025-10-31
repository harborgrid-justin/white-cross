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

import type { Metadata } from 'next';

import React from 'react'

/**
 * Props interface for the Communication Layout component.
 *
 * @interface CommunicationLayoutProps
 * @property {React.ReactNode} children - Communication page components to render
 */
/**
 * Metadata configuration for Communications layout
 */
export const metadata: Metadata = {
  title: 'Communications | White Cross Healthcare',
  description: 'Manage messages, notifications, and broadcasts to students and families.',
};

interface CommunicationLayoutProps {
  children: React.ReactNode
}

/**
 * Communication Layout Component
 *
 * Simple container layout for communication pages. Since the main dashboard layout
 * already provides container styling and background, this layout focuses on
 * communication-specific structure if needed.
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
    <div className="space-y-6">
      {children}
    </div>
  )
}
