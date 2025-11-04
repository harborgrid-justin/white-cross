/**
 * WF-COMP-128 | useCommunicationOptions.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/config/apiConfig | Dependencies: @tanstack/react-query, ../services/config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: component, arrow component
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Communication Options Hook
 *
 * Provides access to communication channel configurations and notification types.
 * Data is cached for 24 hours as these are relatively static system configurations.
 *
 * @module useCommunicationOptions
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiInstance } from '../services/config/apiConfig';
import type {
  CommunicationChannel,
  NotificationType,
  PriorityLevel,
  CommunicationOptions,
} from './useCommunicationOptions.types';
import { CACHE_CONFIG, DEFAULT_OPTIONS } from './useCommunicationOptions.constants';

// Re-export types and constants for backward compatibility
export * from './useCommunicationOptions.types';
export * from './useCommunicationOptions.constants';

// ============================================================================
// Query Keys
// ============================================================================

export const communicationOptionsKeys = {
  all: ['communicationOptions'] as const,
  options: () => [...communicationOptionsKeys.all, 'options'] as const,
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch communication options from backend
 * Falls back to default options if endpoint is not available
 */
async function fetchCommunicationOptions(): Promise<CommunicationOptions> {
  try {
    const response = await apiInstance.get('/communication/options');

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }

    // If response format is unexpected, use defaults
    return DEFAULT_OPTIONS;
  } catch (error) {
    // If endpoint doesn't exist or fails, use defaults
    console.warn('Communication options endpoint not available, using defaults:', error);
    return DEFAULT_OPTIONS;
  }
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to fetch communication options (channels, notification types, etc.)
 *
 * This data is cached for 24 hours as it represents system configuration
 * that rarely changes. Falls back to default options if API is unavailable.
 *
 * @param options - Additional query options
 * @returns Communication options data
 *
 * @example
 * ```tsx
 * const { data: options, isLoading } = useCommunicationOptions();
 *
 * const channels = options?.channels || [];
 * const notificationTypes = options?.notificationTypes || [];
 *
 * return (
 *   <select>
 *     {channels.filter(c => c.enabled).map(channel => (
 *       <option key={channel.id} value={channel.value}>
 *         {channel.label}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useCommunicationOptions(
  options?: Omit<UseQueryOptions<CommunicationOptions, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<CommunicationOptions, Error>({
    queryKey: communicationOptionsKeys.options(),
    queryFn: fetchCommunicationOptions,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    // Always provide default data immediately while fetching
    placeholderData: DEFAULT_OPTIONS,
    // Don't retry on failure - just use defaults
    retry: false,
    ...options,
  });
}

/**
 * Hook to get communication channels only
 *
 * @example
 * ```tsx
 * const { data: channels } = useCommunicationChannels();
 *
 * return channels.map(channel => (
 *   <Checkbox key={channel.id} value={channel.value}>
 *     {channel.label}
 *   </Checkbox>
 * ));
 * ```
 */
export function useCommunicationChannels(
  options?: Omit<UseQueryOptions<CommunicationChannel[], Error>, 'queryKey' | 'queryFn'>
) {
  const { data, ...rest } = useCommunicationOptions();

  return {
    data: data?.channels.filter(c => c.enabled) || DEFAULT_OPTIONS.channels.filter(c => c.enabled),
    ...rest,
  };
}

/**
 * Hook to get notification types only
 *
 * @example
 * ```tsx
 * const { data: notificationTypes } = useNotificationTypes();
 *
 * return (
 *   <select>
 *     {notificationTypes.map(type => (
 *       <option key={type.id} value={type.value}>
 *         {type.label}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useNotificationTypes(
  options?: Omit<UseQueryOptions<NotificationType[], Error>, 'queryKey' | 'queryFn'>
) {
  const { data, ...rest } = useCommunicationOptions();

  return {
    data: data?.notificationTypes || DEFAULT_OPTIONS.notificationTypes,
    ...rest,
  };
}

/**
 * Hook to get priority levels only
 *
 * @example
 * ```tsx
 * const { data: priorities } = usePriorityLevels();
 *
 * return (
 *   <select>
 *     {priorities.map(priority => (
 *       <option key={priority.id} value={priority.value}>
 *         {priority.label}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function usePriorityLevels(
  options?: Omit<UseQueryOptions<PriorityLevel[], Error>, 'queryKey' | 'queryFn'>
) {
  const { data, ...rest } = useCommunicationOptions();

  return {
    data: data?.priorityLevels || DEFAULT_OPTIONS.priorityLevels,
    ...rest,
  };
}

/**
 * Hook to get verification methods only
 *
 * @example
 * ```tsx
 * const { data: methods } = useVerificationMethods();
 *
 * return methods.map(method => (
 *   <button onClick={() => verify(contactId, method.value)}>
 *     Verify via {method.label}
 *   </button>
 * ));
 * ```
 */
export function useVerificationMethods(
  options?: Omit<UseQueryOptions<{ id: string; label: string; value: string }[], Error>, 'queryKey' | 'queryFn'>
) {
  const { data, ...rest } = useCommunicationOptions();

  return {
    data: data?.verificationMethods || DEFAULT_OPTIONS.verificationMethods,
    ...rest,
  };
}
