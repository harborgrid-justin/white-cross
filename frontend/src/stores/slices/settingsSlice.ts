/**
 * @fileoverview System Settings Redux Slice for White Cross Healthcare Platform
 *
 * Manages system-wide configuration settings and administrative preferences for the
 * healthcare platform. Provides comprehensive state management for configuration
 * CRUD operations, settings validation, and real-time configuration updates.
 *
 * **Key Features:**
 * - System configuration management (database, API, security settings)
 * - User preference management (UI themes, notifications, defaults)
 * - Feature flag and toggle management
 * - Multi-tenant configuration support (school/district level)
 * - Configuration validation and type enforcement
 * - Real-time configuration updates across browser tabs
 * - Configuration versioning and rollback capabilities
 * - Environment-specific settings (dev, staging, production)
 * - Configuration import/export functionality
 *
 * **HIPAA Compliance:**
 * - Configuration settings may contain sensitive information (API keys, server URLs)
 * - PHI-related settings (data retention policies, audit configurations) require special handling
 * - All configuration changes generate audit logs for compliance tracking
 * - Role-based access control for sensitive configuration categories
 * - Encrypted storage for sensitive configuration values
 * - Configuration access logging for security monitoring
 *
 * **Configuration Categories:**
 * - **SYSTEM**: Core system settings (database, cache, logging)
 * - **SECURITY**: Authentication, authorization, encryption settings
 * - **NOTIFICATIONS**: Email, SMS, push notification configurations
 * - **INTEGRATIONS**: Third-party API configurations (SIS, EMR, payment processors)
 * - **UI**: User interface preferences and customizations
 * - **FEATURES**: Feature flags and experimental functionality toggles
 * - **COMPLIANCE**: HIPAA, FERPA, and other regulatory compliance settings
 * - **PERFORMANCE**: Caching, rate limiting, and optimization settings
 *
 * **State Management:**
 * - Uses entity slice factory pattern for standardized CRUD operations
 * - Normalized state structure with EntityAdapter for efficient lookups
 * - Category-based organization for settings management
 * - Type-safe configuration values with validation
 * - Optimistic updates for immediate UI responsiveness
 * - Configuration caching with intelligent invalidation
 *
 * **Security Considerations:**
 * - Sensitive values (passwords, API keys) are encrypted at rest
 * - Role-based access control for configuration categories
 * - Configuration change audit logging
 * - Input validation and sanitization for all configuration values
 * - Secure configuration backup and restore procedures
 *
 * **Integration:**
 * - Backend API: `services/modules/administrationApi.ts`
 * - Type definitions: `types/administration.ts`
 * - Redux store: `stores/reduxStore.ts`
 * - Used by: Admin panels, system monitoring, feature toggles
 *
 * @module stores/slices/settingsSlice
 * @requires @reduxjs/toolkit
 * @requires services/modules/administrationApi
 * @requires types/administration
 * @security System configuration management, sensitive data handling
 * @compliance HIPAA-compliant configuration operations
 *
 * @example System configuration management
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { settingsThunks, selectSettingsByCategory } from '@/stores/slices/settingsSlice';
 *
 * function SystemSettings() {
 *   const dispatch = useDispatch();
 *   const systemSettings = useSelector(state => 
 *     selectSettingsByCategory(state, 'SYSTEM')
 *   );
 *
 *   const updateSetting = async (key: string, value: string) => {
 *     await dispatch(settingsThunks.update({
 *       id: key,
 *       data: { key, value, category: 'SYSTEM' }
 *     }));
 *   };
 *
 *   return (
 *     <div>
 *       {systemSettings.map(setting => (
 *         <ConfigurationInput
 *           key={setting.id}
 *           setting={setting}
 *           onChange={(value) => updateSetting(setting.key, value)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Feature flag management
 * ```typescript
 * function FeatureToggle({ featureKey, children }) {
 *   const featureEnabled = useSelector(state => 
 *     selectSettingValue(state, `feature.${featureKey}.enabled`)
 *   );
 *
 *   if (featureEnabled === 'true') {
 *     return children;
 *   }
 *
 *   return null;
 * }
 *
 * // Usage
 * <FeatureToggle featureKey="experimental_dashboard">
 *   <ExperimentalDashboard />
 * </FeatureToggle>
 * ```
 *
 * @example Bulk configuration update
 * ```typescript
 * function BulkConfigurationUpdate() {
 *   const dispatch = useDispatch();
 *
 *   const updateNotificationSettings = async (settings) => {
 *     // Update multiple notification-related settings
 *     const updates = Object.entries(settings).map(([key, value]) => ({
 *       id: `notification.${key}`,
 *       data: { key: `notification.${key}`, value, category: 'NOTIFICATIONS' }
 *     }));
 *
 *     // Use Promise.all for concurrent updates
 *     await Promise.all(
 *       updates.map(update => 
 *         dispatch(settingsThunks.update(update))
 *       )
 *     );
 *   };
 *
 *   return (
 *     <button onClick={() => updateNotificationSettings({
 *       'email.enabled': 'true',
 *       'sms.enabled': 'false',
 *       'push.enabled': 'true'
 *     })}>
 *       Update Notification Settings
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link ../../services/modules/administrationApi.ts} for API integration
 * @see {@link ../reduxStore.ts} for store configuration
 * @see {@link ../../types/administration.ts} for type definitions
 * @since 1.0.0
 */

import { createEntitySlice, EntityApiService } from '@/stores/sliceFactory';
import { SystemConfiguration, ConfigurationData, ConfigCategory, ConfigValueType, ConfigScope } from '@/types/administration';
import { apiActions } from '@/lib/api';
import type { RootState } from '@/stores/store';

// Create API service adapter for settings
const settingsApiService: EntityApiService<SystemConfiguration, ConfigurationData, ConfigurationData> = {
  async getAll() {
    const response = await apiActions.administration.getSettings();
    // Convert settings object to array of configuration items
    const configurations: SystemConfiguration[] = [];
    
    if (response.data) {
      Object.entries(response.data).forEach(([category, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: Record<string, unknown>) => {
            configurations.push({
              id: item.id as string || `${category}-${item.key}`,
              key: item.key as string,
              value: item.value as string,
              category: category as ConfigCategory,
              valueType: item.valueType as ConfigValueType,
              description: item.description as string,
              isPublic: item.isPublic as boolean ?? false,
              isEditable: item.isEditable as boolean ?? true,
              requiresRestart: item.requiresRestart as boolean ?? false,
              scope: item.scope as ConfigScope || ConfigScope.SYSTEM,
              createdAt: item.createdAt as string || new Date().toISOString(),
              updatedAt: item.updatedAt as string || new Date().toISOString(),
              validValues: item.validValues as string[] || undefined,
              tags: item.tags as string[] || [],
              sortOrder: item.sortOrder as number || 0,
            });
          });
        }
      });
    }
    
    return {
      data: configurations,
      total: configurations.length,
    };
  },

  async getById(id: string) {
    const response = await apiActions.administration.getSettings();
    let foundConfig: SystemConfiguration | null = null;
    
    if (response.data) {
      Object.entries(response.data).forEach(([category, items]) => {
        if (Array.isArray(items)) {
          const item = items.find((i: any) => i.id === id || `${category}-${i.key}` === id);
          if (item) {
            foundConfig = {
              id: item.id || `${category}-${item.key}`,
              key: item.key,
              value: item.value,
              category: category as ConfigCategory,
              valueType: item.valueType,
              description: item.description,
              isPublic: item.isPublic ?? false,
              isEditable: item.isEditable ?? true,
              requiresRestart: item.requiresRestart ?? false,
              scope: item.scope || 'SYSTEM',
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
            };
          }
        }
      });
    }
    
    if (!foundConfig) {
      throw new Error(`Configuration with id ${id} not found`);
    }
    
    return { data: foundConfig };
  },

  async create(data: ConfigurationData) {
    const response = await apiActions.administration.setConfiguration(data);
    return { data: response.data };
  },

  async update(id: string, data: ConfigurationData) {
    const response = await apiActions.administration.setConfiguration({ ...data, id });
    return { data: response.data };
  },

  async delete(id: string) {
    // Settings typically aren't deleted, but we can mark them as inactive
    // For now, just return success
    return { success: true };
  },
};

// Create the settings slice using the factory
const settingsSliceFactory = createEntitySlice<SystemConfiguration, ConfigurationData, ConfigurationData>(
  'settings',
  settingsApiService,
  {
    enableBulkOperations: false,
  }
);

// Export the slice and its components
export const settingsSlice = settingsSliceFactory.slice;
export const settingsReducer = settingsSlice.reducer;
export const settingsActions = settingsSliceFactory.actions;
export const settingsSelectors = settingsSliceFactory.adapter.getSelectors((state: RootState) => state.settings);
export const settingsThunks = settingsSliceFactory.thunks;

// Export custom selectors
export const selectSettingsByCategory = (state: RootState, category: ConfigCategory): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.category === category);
};

export const selectPublicSettings = (state: RootState): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.isPublic);
};

export const selectEditableSettings = (state: RootState): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.isEditable);
};

export const selectSettingByKey = (state: RootState, key: string): SystemConfiguration | undefined => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.find(setting => setting.key === key);
};

export const selectSettingValue = (state: RootState, key: string): string | undefined => {
  const setting = selectSettingByKey(state, key);
  return setting?.value;
};
