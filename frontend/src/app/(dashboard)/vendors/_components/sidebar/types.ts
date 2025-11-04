/**
 * @fileoverview Shared Type Definitions for Vendor Sidebar Components
 *
 * Centralized type definitions used across all vendor sidebar components
 * to ensure type consistency and reduce duplication.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/types
 * @category Types
 *
 * @since 2025-11-04
 */

import { ComponentType } from 'react'

/**
 * Badge color variants for UI elements
 */
export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray'

/**
 * Quick action color variants
 */
export type ActionColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red'

/**
 * Vendor sidebar section interface
 */
export interface VendorSection {
  id: string
  title: string
  icon: ComponentType<{ className?: string }>
  href?: string
  badge?: string | number
  badgeColor?: BadgeColor
  items?: VendorSubItem[]
  isExpandable?: boolean
}

/**
 * Vendor sidebar sub-item interface
 */
export interface VendorSubItem {
  id: string
  title: string
  href: string
  icon?: ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: BadgeColor
  description?: string
}

/**
 * Vendor metric interface for analytics display
 */
export interface VendorMetric {
  id: string
  label: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: ComponentType<{ className?: string }>
}

/**
 * Quick action interface for vendor operations
 */
export interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: ComponentType<{ className?: string }>
  color: ActionColor
}

/**
 * Recent activity interface for vendor tracking
 */
export interface VendorActivity {
  id: string
  type: 'order' | 'payment' | 'certification' | 'performance' | 'contact'
  vendor: string
  action: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

/**
 * Alert notification interface
 */
export interface VendorAlert {
  id: string
  type: 'warning' | 'success' | 'error' | 'info'
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}
