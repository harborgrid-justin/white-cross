/**
 * @fileoverview Custom Hooks for Vendor Sidebar State Management
 *
 * Reusable custom hooks for managing sidebar state, navigation active states,
 * and expandable section behavior.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/hooks
 * @category Hooks
 *
 * @since 2025-11-04
 */

'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Hook for managing expandable sidebar sections
 *
 * @param {string[]} defaultExpanded - Array of section IDs that should be expanded by default
 * @returns {Object} Section expansion state and toggle function
 *
 * @example
 * ```tsx
 * const { expandedSections, toggleSection, isExpanded } = useSidebarSections(['management'])
 * ```
 */
export function useSidebarSections(defaultExpanded: string[] = ['management']) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  /**
   * Toggle expansion state of a sidebar section
   */
  const toggleSection = useCallback((sectionId: string): void => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  /**
   * Check if a section is expanded
   */
  const isExpanded = useCallback(
    (sectionId: string): boolean => {
      return expandedSections.has(sectionId)
    },
    [expandedSections]
  )

  /**
   * Expand a section
   */
  const expandSection = useCallback((sectionId: string): void => {
    setExpandedSections(prev => new Set(prev).add(sectionId))
  }, [])

  /**
   * Collapse a section
   */
  const collapseSection = useCallback((sectionId: string): void => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      newSet.delete(sectionId)
      return newSet
    })
  }, [])

  /**
   * Collapse all sections
   */
  const collapseAll = useCallback((): void => {
    setExpandedSections(new Set())
  }, [])

  /**
   * Expand all sections
   */
  const expandAll = useCallback((sectionIds: string[]): void => {
    setExpandedSections(new Set(sectionIds))
  }, [])

  return {
    expandedSections,
    toggleSection,
    isExpanded,
    expandSection,
    collapseSection,
    collapseAll,
    expandAll,
  }
}

/**
 * Hook for checking active navigation states
 *
 * @returns {Object} Functions to check if navigation items are active
 *
 * @example
 * ```tsx
 * const { isActive, isActiveStrict } = useActiveNavigation()
 * const active = isActive('/vendors')
 * ```
 */
export function useActiveNavigation() {
  const pathname = usePathname()

  /**
   * Check if a navigation item is currently active (includes sub-paths)
   */
  const isActive = useCallback(
    (href: string): boolean => {
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  /**
   * Check if a navigation item is exactly active (strict match)
   */
  const isActiveStrict = useCallback(
    (href: string): boolean => {
      return pathname === href
    },
    [pathname]
  )

  /**
   * Check if any of multiple paths are active
   */
  const isAnyActive = useCallback(
    (hrefs: string[]): boolean => {
      return hrefs.some(href => isActive(href))
    },
    [isActive]
  )

  return {
    isActive,
    isActiveStrict,
    isAnyActive,
    pathname,
  }
}

/**
 * Hook for badge styling utilities
 *
 * @returns {Function} Function to get badge CSS classes
 *
 * @example
 * ```tsx
 * const getBadgeClasses = useBadgeStyling()
 * const classes = getBadgeClasses('blue')
 * ```
 */
export function useBadgeStyling() {
  /**
   * Get badge styling classes based on color
   */
  const getBadgeClasses = useCallback((color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      red: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700',
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700'
  }, [])

  return getBadgeClasses
}
