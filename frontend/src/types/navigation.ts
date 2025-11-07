/**
 * @fileoverview Navigation Type Definitions
 * @module types/navigation
 *
 * @description
 * TypeScript type definitions for navigation and routing.
 * Provides type safety for navigation data structures.
 *
 * @since 1.0.0
 */

import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon | React.ComponentType
  badge?: string | number
  children?: NavigationItem[]
  isExternal?: boolean
  requiredPermissions?: string[]
  isActive?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

export interface MenuItem {
  id: string
  label: string
  icon?: LucideIcon | React.ComponentType
  onClick?: () => void
  href?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean
}

export interface TabItem {
  id: string
  label: string
  href?: string
  icon?: LucideIcon | React.ComponentType
  count?: number
  disabled?: boolean
}

export interface RouteConfig {
  path: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  requiredPermissions?: string[]
  isPublic?: boolean
}

export interface NavigationSection {
  id: string
  title: string
  items: NavigationItem[]
}
