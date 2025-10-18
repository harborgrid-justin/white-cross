/**
 * WF-COMP-183 | useContactFilters.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useMemo
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * useContactFilters Hook
 *
 * Manages filtering logic for emergency contacts
 *
 * @module hooks/useContactFilters
 */

import { useMemo } from 'react';
import type { Contact, EmergencyContactFilters } from '../types';

interface UseContactFiltersParams {
  contacts: Contact[];
  filters: EmergencyContactFilters;
}

/**
 * Custom hook for filtering emergency contacts
 */
export function useContactFilters({
  contacts,
  filters,
}: UseContactFiltersParams) {
  /**
   * Filter contacts based on current filters
   */
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      const matchesSearch =
        `${contact.firstName} ${contact.lastName}`
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        contact.relationship.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority =
        filters.priority === 'all' || contact.priority === filters.priority;

      // Verified filter
      const matchesVerified =
        filters.verified === 'all' ||
        (filters.verified === 'verified' && contact.verified) ||
        (filters.verified === 'unverified' && !contact.verified);

      return matchesSearch && matchesPriority && matchesVerified;
    });
  }, [contacts, filters]);

  return {
    filteredContacts,
  };
}
