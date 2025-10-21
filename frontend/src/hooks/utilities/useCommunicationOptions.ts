/**
 * WF-COMP-128 | useCommunicationOptions.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/config/apiConfig | Dependencies: @tanstack/react-query, ../services/config/apiConfig
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
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

// ============================================================================
// Type Definitions
// ============================================================================

export interface CommunicationChannel {
  id: string;
  label: string;
  value: string;
  description?: string;
  enabled: boolean;
  icon?: string;
}

export interface NotificationType {
  id: string;
  label: string;
  value: string;
  description?: string;
  defaultPriority?: string;
  requiresApproval?: boolean;
}

export interface PriorityLevel {
  id: string;
  label: string;
  value: string;
  description?: string;
  color?: string;
}

export interface CommunicationOptions {
  channels: CommunicationChannel[];
  notificationTypes: NotificationType[];
  priorityLevels: PriorityLevel[];
  verificationMethods: {
    id: string;
    label: string;
    value: string;
  }[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Cache configuration for communication options
 * These are static configurations that change infrequently
 */
const CACHE_CONFIG = {
  STALE_TIME: 24 * 60 * 60 * 1000, // 24 hours
  CACHE_TIME: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Default fallback options if API fails
 * Ensures the application remains functional even if config endpoint is unavailable
 */
const DEFAULT_OPTIONS: CommunicationOptions = {
  channels: [
    {
      id: 'sms',
      label: 'SMS',
      value: 'sms',
      description: 'Send text message notifications',
      enabled: true,
      icon: 'message-circle',
    },
    {
      id: 'email',
      label: 'Email',
      value: 'email',
      description: 'Send email notifications',
      enabled: true,
      icon: 'mail',
    },
    {
      id: 'voice',
      label: 'Voice Call',
      value: 'voice',
      description: 'Automated voice call',
      enabled: true,
      icon: 'phone',
    },
  ],
  notificationTypes: [
    {
      id: 'emergency',
      label: 'Emergency',
      value: 'emergency',
      description: 'Critical emergency notifications',
      defaultPriority: 'critical',
      requiresApproval: false,
    },
    {
      id: 'health',
      label: 'Health Update',
      value: 'health',
      description: 'General health updates and alerts',
      defaultPriority: 'high',
      requiresApproval: false,
    },
    {
      id: 'medication',
      label: 'Medication',
      value: 'medication',
      description: 'Medication-related notifications',
      defaultPriority: 'medium',
      requiresApproval: false,
    },
    {
      id: 'general',
      label: 'General',
      value: 'general',
      description: 'General information and updates',
      defaultPriority: 'low',
      requiresApproval: false,
    },
  ],
  priorityLevels: [
    {
      id: 'low',
      label: 'Low',
      value: 'low',
      description: 'Non-urgent information',
      color: 'gray',
    },
    {
      id: 'medium',
      label: 'Medium',
      value: 'medium',
      description: 'Standard priority',
      color: 'blue',
    },
    {
      id: 'high',
      label: 'High',
      value: 'high',
      description: 'Important, requires attention',
      color: 'orange',
    },
    {
      id: 'critical',
      label: 'Critical',
      value: 'critical',
      description: 'Urgent, immediate action required',
      color: 'red',
    },
  ],
  verificationMethods: [
    {
      id: 'sms',
      label: 'SMS',
      value: 'sms',
    },
    {
      id: 'email',
      label: 'Email',
      value: 'email',
    },
    {
      id: 'voice',
      label: 'Voice Call',
      value: 'voice',
    },
  ],
};

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
