/**
 * @fileoverview System settings and configuration query hooks
 * @module hooks/domains/administration/queries/useSystemSettingsQueries
 * @category Hooks
 *
 * Custom React Query hooks for system settings and configuration management.
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - 15 minute stale time (configuration data changes infrequently)
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * @example
 * ```typescript
 * // Fetch settings by category
 * function SystemSettings() {
 *   const { data: settings } = useSettings('email');
 *   return <SettingsForm settings={settings} />;
 * }
 *
 * // Fetch system configuration
 * function ConfigPanel() {
 *   const { data: config } = useSystemConfiguration('auth');
 *   return <ConfigDisplay config={config} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  SystemSetting,
  SystemConfiguration,
} from '../config';
import { administrationApi } from '@/services';

// ==========================================
// SETTINGS MANAGEMENT QUERIES
// ==========================================

/**
 * Hook to fetch system settings by category
 * @param category - Optional category filter
 * @param options - React Query options
 * @returns Query result with settings list
 */
export const useSettings = (
  category?: string,
  options?: UseQueryOptions<SystemSetting[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.settingsList(category),
    queryFn: async () => {
      const response = await administrationApi.getSettings();
      return Array.isArray(response) ? response : [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch setting details by key
 * @param key - Setting key
 * @param options - React Query options
 * @returns Query result with setting details
 */
export const useSettingDetails = (
  key: string,
  options?: UseQueryOptions<SystemSetting, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.settingsDetails(key),
    queryFn: async () => {
      const response = await administrationApi.getConfigurationByKey(key);
      return response as SystemSetting;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    enabled: !!key,
    ...options,
  });
};

// ==========================================
// SYSTEM CONFIGURATION QUERIES
// ==========================================

/**
 * Hook to fetch all system configurations
 * @param options - React Query options
 * @returns Query result with configurations list
 */
export const useSystemConfigurations = (
  options?: UseQueryOptions<SystemConfiguration[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigList(),
    queryFn: async () => {
      const response = await administrationApi.getConfigurations();
      return response;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch system configuration by module
 * @param module - Module name
 * @param options - React Query options
 * @returns Query result with configuration details
 */
export const useSystemConfiguration = (
  module: string,
  options?: UseQueryOptions<SystemConfiguration, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigDetails(module),
    queryFn: async () => {
      const response = await administrationApi.getConfigurationByKey(module);
      return response as SystemConfiguration;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    enabled: !!module,
    ...options,
  });
};
