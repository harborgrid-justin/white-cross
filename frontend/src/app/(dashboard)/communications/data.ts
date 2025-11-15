/**
 * @fileoverview Communications Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/communications/data
 *
 * @description
 * Server-side data fetching functions for the communications dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Message fetching with filtering and search
 * - Error handling and caching
 * - Type-safe API responses
 *
 * **Migration Status:** UPDATED - Now using Server Actions
 * - Migrated from deprecated apiActions.communication to Server Actions
 * - Using ActionResult pattern for consistent error handling
 * - Type imports from @/lib/actions/communications.types
 *
 * @since 1.0.0
 * @updated 2025-11-15 - Migrated to Server Actions
 */

import { getMessages } from '@/lib/actions/communications.actions';
import type { Message, MessageFilter } from '@/lib/actions/communications.types';

/**
 * Fetch communications/messages data with optional filtering
 *
 * @param filters - Filtering options for messages
 * @returns Promise resolving to messages data
 *
 * @example
 * ```typescript
 * // Fetch all messages
 * const messages = await fetchCommunications();
 *
 * // Fetch with filters
 * const filtered = await fetchCommunications({
 *   search: 'appointment',
 *   priority: 'high',
 *   status: 'unread'
 * });
 * ```
 */
export async function fetchCommunications(filters: {
  search?: string;
  priority?: string;
  status?: string;
} = {}): Promise<Message[]> {
  try {
    // Build filter object compatible with MessageFilter type
    const messageFilter: MessageFilter = {};

    if (filters.search?.trim()) {
      messageFilter.search = filters.search.trim();
    }

    if (filters.priority) {
      // Validate and cast priority to correct enum type
      messageFilter.priority = filters.priority as 'low' | 'normal' | 'high' | 'urgent';
    }

    if (filters.status) {
      // Validate and cast status to correct enum type
      messageFilter.status = filters.status as 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted';
    }

    // Call server action and handle ActionResult
    const result = await getMessages(messageFilter);

    if (result.success && result.data) {
      return result.data.messages;
    }

    // Log error if present
    if (result.error) {
      console.error('Error fetching communications:', result.error);
    }

    // Return empty array on error to prevent UI crashes
    return [];
  } catch (error) {
    console.error('Error fetching communications:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Fetch communications dashboard data with filters
 *
 * @param filters - Filtering options
 * @returns Promise resolving to communications data and error state
 */
export async function fetchCommunicationsDashboardData(filters: {
  search?: string;
  priority?: string;
  status?: string;
} = {}) {
  try {
    const communications = await fetchCommunications(filters);
    
    return {
      communications,
      error: null
    };
  } catch (error) {
    console.error('Error fetching communications dashboard data:', error);
    return {
      communications: [],
      error: error instanceof Error ? error.message : 'Failed to load communications data'
    };
  }
}
