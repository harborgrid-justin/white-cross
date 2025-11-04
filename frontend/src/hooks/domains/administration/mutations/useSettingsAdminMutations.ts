/**
 * @fileoverview System settings and configuration mutation hooks
 * @module hooks/domains/administration/mutations/useSettingsAdminMutations
 * @category Hooks - Administration - Settings Management
 *
 * Mutation hooks for system settings and configuration management.
 *
 * Features:
 * - System setting CRUD operations
 * - System configuration updates
 * - Runtime configuration changes
 * - Automatic cache invalidation
 * - Toast notifications
 * - Type-safe with TypeScript
 * - Validation for setting values
 *
 * @example
 * ```typescript
 * import {
 *   useUpdateSetting,
 *   useCreateSetting,
 *   useDeleteSetting,
 *   useUpdateSystemConfiguration
 * } from './useSettingsAdminMutations';
 *
 * function SettingsManager() {
 *   const { mutate: updateSetting } = useUpdateSetting();
 *   const { mutate: updateConfig } = useUpdateSystemConfiguration();
 *
 *   return <SettingsPanel onUpdate={updateSetting} />;
 * }
 * ```
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADMINISTRATION_QUERY_KEYS,
  SystemSetting,
  SystemConfiguration,
  invalidateSettingsQueries,
} from '../config';
import { administrationApi } from '@/services';

/**
 * Updates a system setting value.
 *
 * Mutation hook for modifying system configuration settings. Used for
 * runtime configuration changes without code deployment.
 *
 * @param {UseMutationOptions<SystemSetting, Error, {key: string; value: any}>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result for setting update
 *
 * @remarks
 * **Validation:**
 * Setting updates are validated against defined rules (min/max, pattern, etc.)
 * Invalid values are rejected with error messages.
 *
 * **Cache Behavior:**
 * Immediately updates the setting cache with `setQueryData` for instant UI reflection.
 * All settings queries are invalidated to ensure consistency.
 *
 * **RBAC:**
 * Requires admin permissions. Non-admin users cannot modify system settings.
 *
 * @example
 * ```typescript
 * function SettingsEditor({ settingKey }) {
 *   const { mutate: updateSetting, isPending } = useUpdateSetting();
 *
 *   const handleChange = (newValue) => {
 *     updateSetting({ key: settingKey, value: newValue }, {
 *       onSuccess: () => {
 *         // Settings are automatically applied
 *         console.log('Setting updated successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Validation failed:', error.message);
 *       }
 *     });
 *   };
 *
 *   return <SettingControl onChange={handleChange} isLoading={isPending} />;
 * }
 * ```
 *
 * @see {@link SystemSetting} for setting structure
 * @see {@link useSettings} for querying settings
 */
export const useUpdateSetting = (
  options?: UseMutationOptions<SystemSetting, Error, { key: string; value: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }) => {
      const response = await administrationApi.setConfiguration({ key, value });
      return response as SystemSetting;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.settingsDetails(variables.key), data);
      invalidateSettingsQueries(queryClient);
      toast.success('Setting updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update setting');
    },
    ...options,
  });
};

/**
 * Creates a new system setting.
 *
 * Mutation hook for adding new configuration settings to the system.
 *
 * @param {UseMutationOptions<SystemSetting, Error, Partial<SystemSetting>>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with created setting data
 *
 * @remarks
 * **Required Fields:**
 * - key: Unique setting identifier
 * - value: Initial setting value
 *
 * **Optional Fields:**
 * - description: Setting description for documentation
 * - dataType: Value data type (string, number, boolean, json)
 * - validation: Validation rules (min, max, pattern, enum)
 * - isPublic: Whether setting is exposed to frontend
 *
 * @example
 * ```typescript
 * function CreateSettingForm() {
 *   const { mutate: createSetting } = useCreateSetting();
 *
 *   const handleSubmit = (data) => {
 *     createSetting({
 *       key: data.key,
 *       value: data.value,
 *       description: data.description,
 *       dataType: 'string'
 *     });
 *   };
 *
 *   return <SettingForm onSubmit={handleSubmit} />;
 * }
 * ```
 */
export const useCreateSetting = (
  options?: UseMutationOptions<SystemSetting, Error, Partial<SystemSetting>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SystemSetting>) => {
      const response = await administrationApi.setConfiguration(data);
      return response as SystemSetting;
    },
    onSuccess: (data) => {
      invalidateSettingsQueries(queryClient);
      toast.success('Setting created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create setting');
    },
    ...options,
  });
};

/**
 * Deletes a system setting.
 *
 * Mutation hook for removing configuration settings from the system.
 *
 * @param {UseMutationOptions<void, Error, string>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result for setting deletion
 *
 * @remarks
 * **Permanent Deletion:**
 * Deleting a setting removes it permanently. Application code relying on
 * this setting may fail or use default values.
 *
 * **Impact Assessment:**
 * Verify no code depends on the setting before deletion.
 *
 * @example
 * ```typescript
 * function DeleteSettingButton({ settingKey }) {
 *   const { mutate: deleteSetting, isPending } = useDeleteSetting();
 *
 *   const handleDelete = () => {
 *     if (confirm(`Delete setting ${settingKey}?`)) {
 *       deleteSetting(settingKey);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleDelete} disabled={isPending}>
 *       Delete Setting
 *     </button>
 *   );
 * }
 * ```
 */
export const useDeleteSetting = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      await administrationApi.deleteConfiguration(key);
    },
    onSuccess: (_, key) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.settingsDetails(key) });
      invalidateSettingsQueries(queryClient);
      toast.success('Setting deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete setting');
    },
    ...options,
  });
};

/**
 * Updates system configuration for a specific module.
 *
 * Mutation hook for updating module-specific configuration.
 *
 * @param {UseMutationOptions<SystemConfiguration, Error, {module: string; settings: Partial<SystemConfiguration>}>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with updated configuration
 *
 * @remarks
 * **Module Configuration:**
 * Each module (authentication, notifications, medication, etc.) has
 * its own configuration object with module-specific settings.
 *
 * **Partial Updates:**
 * Only provided settings are updated; others remain unchanged.
 *
 * @example
 * ```typescript
 * function ModuleConfigEditor({ moduleName }) {
 *   const { mutate: updateConfig } = useUpdateSystemConfiguration();
 *
 *   const handleSave = (configData) => {
 *     updateConfig({
 *       module: moduleName,
 *       settings: configData
 *     });
 *   };
 *
 *   return <ConfigForm onSave={handleSave} />;
 * }
 * ```
 */
export const useUpdateSystemConfiguration = (
  options?: UseMutationOptions<SystemConfiguration, Error, { module: string; settings: Partial<SystemConfiguration> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ module, settings }) => {
      const response = await administrationApi.setConfiguration({ key: module, value: settings });
      return response as SystemConfiguration;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.systemConfigDetails(variables.module), data);
      queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigList() });
      toast.success('System configuration updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update system configuration');
    },
    ...options,
  });
};
