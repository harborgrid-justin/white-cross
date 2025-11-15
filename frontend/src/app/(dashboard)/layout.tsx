/**
 * @fileoverview Dashboard Layout - White Cross Healthcare Platform
 *
 * Main dashboard layout that provides consistent structure, navigation, and styling
 * for all authenticated pages in the White Cross Healthcare Platform. This layout
 * wraps all dashboard pages and provides the primary navigation, header, and content area.
 *
 * @module app/(dashboard)/layout
 * @category Layouts
 * @subcategory Dashboard
 */

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import DashboardLayoutClient from './layout-client';

/**
 * Metadata configuration for dashboard pages.
 *
 * @constant
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'Dashboard | White Cross Healthcare',
  },
  description: 'White Cross Healthcare Platform - Comprehensive school health management with real-time monitoring, medical records, and healthcare analytics.',
  openGraph: {
    type: 'website',
    siteName: 'White Cross Healthcare',
    title: 'Dashboard | White Cross Healthcare',
    description: 'Comprehensive school health management platform with real-time monitoring and analytics.',
  },
};

/**
 * Props interface for the Dashboard Layout component.
 *
 * @interface DashboardLayoutProps
 * @property {React.ReactNode} children - Dashboard page components to render
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard Layout Component
 *
 * Server component that provides metadata and delegates to client component.
 * Authentication is handled by Next.js middleware.
 *
 * @param {DashboardLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child dashboard pages
 *
 * @returns {JSX.Element} Complete dashboard layout structure
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
