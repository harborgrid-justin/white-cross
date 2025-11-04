/**
 * @fileoverview Vendor Sidebar Components - Public Exports
 *
 * Centralized export point for all vendor sidebar components,
 * types, and hooks.
 *
 * @module app/(dashboard)/vendors/_components/sidebar
 * @category Components
 *
 * @since 2025-11-04
 */

// Component exports
export { default as VendorStats } from './VendorStats'
export { default as VendorQuickActions } from './VendorQuickActions'
export { default as VendorNavigation } from './VendorNavigation'
export { default as VendorActivity } from './VendorActivity'
export { default as VendorAlerts } from './VendorAlerts'

// Hook exports
export {
  useSidebarSections,
  useActiveNavigation,
  useBadgeStyling,
} from './hooks'

// Type exports
export type {
  VendorSection,
  VendorSubItem,
  VendorMetric,
  QuickAction,
  VendorActivity,
  VendorAlert,
  BadgeColor,
  ActionColor,
} from './types'
