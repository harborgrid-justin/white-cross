/**
 * Settings Slice
 * 
 * Redux slice for managing system configuration and settings.
 * Handles CRUD operations for system-wide configuration values.
 */

import { createEntitySlice, EntityApiService } from '@/stores/sliceFactory';
import { SystemConfiguration, ConfigurationData, ConfigCategory } from '@/types/administration';
import { apiActions } from '@/lib/api';

// Create API service adapter for settings
const settingsApiService: EntityApiService<SystemConfiguration, ConfigurationData, ConfigurationData> = {
  async getAll() {
    const response = await apiActions.administration.getSettings();
    // Convert settings object to array of configuration items
    const configurations: SystemConfiguration[] = [];
    
    if (response.data) {
      Object.entries(response.data).forEach(([category, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            configurations.push({
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
export const settingsSelectors = settingsSliceFactory.adapter.getSelectors((state: any) => state.settings);
export const settingsThunks = settingsSliceFactory.thunks;

// Export custom selectors
export const selectSettingsByCategory = (state: any, category: ConfigCategory): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.category === category);
};

export const selectPublicSettings = (state: any): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.isPublic);
};

export const selectEditableSettings = (state: any): SystemConfiguration[] => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.filter(setting => setting.isEditable);
};

export const selectSettingByKey = (state: any, key: string): SystemConfiguration | undefined => {
  const allSettings = settingsSelectors.selectAll(state) as SystemConfiguration[];
  return allSettings.find(setting => setting.key === key);
};

export const selectSettingValue = (state: any, key: string): string | undefined => {
  const setting = selectSettingByKey(state, key);
  return setting?.value;
};
