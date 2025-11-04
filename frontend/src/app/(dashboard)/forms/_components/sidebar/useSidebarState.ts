/**
 * Custom hook for managing sidebar state and sections
 */

import { useState, useCallback } from 'react';
import type { SidebarSection } from './sidebar.types';

export interface UseSidebarStateReturn {
  expandedSection: SidebarSection;
  toggleSection: (section: SidebarSection) => void;
  setExpandedSection: (section: SidebarSection) => void;
}

/**
 * Hook to manage collapsible sidebar sections
 * @param initialSection - The initially expanded section (default: 'templates')
 */
export function useSidebarState(
  initialSection: SidebarSection = 'templates'
): UseSidebarStateReturn {
  const [expandedSection, setExpandedSection] = useState<SidebarSection>(initialSection);

  const toggleSection = useCallback((section: SidebarSection) => {
    setExpandedSection((current) => (current === section ? null : section));
  }, []);

  return {
    expandedSection,
    toggleSection,
    setExpandedSection,
  };
}
