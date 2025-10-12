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
