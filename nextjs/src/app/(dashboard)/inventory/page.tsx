/**
 * @fileoverview Inventory Dashboard Page - Main Entry Point
 *
 * Primary inventory management dashboard providing comprehensive overview of stock levels,
 * alerts, and key operational metrics for healthcare supply tracking. This page serves as
 * the central hub for school nurses to monitor medical supplies, medications, and general
 * inventory items across all facility locations.
 *
 * **Features:**
 * - Real-time inventory statistics (total items, valuation, locations)
 * - Critical alert monitoring (low stock, expiring items)
 * - Category-based inventory breakdown
 * - Quick action links for common stock operations
 * - Integration with medications module for controlled substances
 *
 * **Healthcare Compliance:**
 * - HIPAA-compliant data handling for medical supply tracking
 * - Audit logging for inventory access and modifications
 * - Emergency medication tracking and expiration monitoring
 *
 * **Stock Management Integration:**
 * - Links to receive, issue, adjust, and transfer stock operations
 * - Real-time alert prioritization (critical, high, normal)
 * - Multi-location inventory visibility
 *
 * @module app/(dashboard)/inventory
 * @requires InventoryDashboardContent - Server component with data fetching
 * @see {@link module:app/(dashboard)/inventory/stock} Stock management operations
 * @see {@link module:app/(dashboard)/inventory/low-stock} Low stock alert system
 * @see {@link module:app/(dashboard)/inventory/expiring} Expiration tracking
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryDashboardContent } from './InventoryDashboardContent';

/**
 * Metadata configuration for inventory dashboard page.
 * Optimized for SEO and browser tab display.
 */
export const metadata: Metadata = {
  title: 'Inventory Dashboard | White Cross',
  description: 'Inventory management overview and statistics',
};

/**
 * Force dynamic rendering to ensure fresh authentication and real-time inventory data.
 * Required for accurate stock levels and alert counts.
 */
export const dynamic = "force-dynamic";

/**
 * Inventory Dashboard Page Component
 *
 * Next.js page component that renders the main inventory management dashboard.
 * Implements dynamic rendering to ensure authentication checks and real-time
 * data accuracy for healthcare inventory tracking.
 *
 * **Rendering Strategy:**
 * - Server-side rendering with dynamic data fetching
 * - No static generation due to real-time inventory requirements
 * - Authentication verified on each request
 *
 * @returns {JSX.Element} Server-rendered inventory dashboard
 *
 * @example
 * ```tsx
 * // Accessed via route: /inventory
 * // Next.js automatically calls this component for the inventory route
 * ```
 */
export default function InventoryDashboardPage() {
  return <InventoryDashboardContent />;
}
