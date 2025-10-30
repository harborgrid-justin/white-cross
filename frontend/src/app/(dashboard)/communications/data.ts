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
 * @since 1.0.0
 */

import { CommunicationsApi, type Message } from '@/services/modules/communicationsApi';
import { apiClient } from '@/services/core/ApiClient';

/**
 * Fetch communications/messages data with optional filtering
 *
 * @param filters - Filtering options for messages
 * @returns Promise resolving to messages data
 */
export async function fetchCommunications(filters: {
  search?: string;
  priority?: string;
  status?: string;
} = {}): Promise<Message[]> {
  try {
    const communicationsApi = new CommunicationsApi(apiClient);
    
    const apiFilters: Record<string, string | number> = {};
    
    if (filters.search?.trim()) {
      apiFilters.search = filters.search.trim();
    }
    
    if (filters.priority) {
      apiFilters.priority = filters.priority;
    }
    
    if (filters.status) {
      apiFilters.status = filters.status;
    }
    
    const response = await communicationsApi.getMessages(apiFilters);
    return response.data || [];
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
