/**
 * @fileoverview Custom hook for admin sidebar state management
 * @module app/(dashboard)/admin/_components/sidebar/useAdminSidebar
 * @category Admin - Hooks
 */

'use client';

import { useState, useCallback } from 'react';

export interface UseAdminSidebarReturn {
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
  isExpanded: (sectionId: string) => boolean;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const DEFAULT_EXPANDED_SECTIONS = ['modules', 'actions', 'metrics', 'alerts'];

/**
 * Hook for managing admin sidebar section expansion state
 *
 * @param initialExpanded - Array of section IDs to expand initially
 * @returns Sidebar state management functions
 */
export function useAdminSidebar(
  initialExpanded: string[] = DEFAULT_EXPANDED_SECTIONS
): UseAdminSidebarReturn {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(initialExpanded)
  );

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback((sectionId: string) => {
    return expandedSections.has(sectionId);
  }, [expandedSections]);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSections(new Set([
      'modules',
      'actions',
      'metrics',
      'alerts',
      'activity',
      'tools'
    ]));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  return {
    expandedSections,
    toggleSection,
    isExpanded,
    expandSection,
    collapseSection,
    expandAll,
    collapseAll,
  };
}
