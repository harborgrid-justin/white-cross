import api from './api';

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  valueType: string;
  category: string;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues?: string[];
  minValue?: number;
  maxValue?: number;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  scope: string;
  scopeId?: string;
  tags: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationHistory {
  id: string;
  configKey: string;
  oldValue: string | null;
  newValue: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  configuration?: {
    key: string;
    category: string;
    description?: string;
  };
}

export interface ConfigurationFilter {
  category?: string;
  subCategory?: string;
  scope?: string;
  scopeId?: string;
  tags?: string | string[];
  isPublic?: boolean;
  isEditable?: boolean;
}

export interface ConfigurationUpdate {
  value: string;
  changeReason?: string;
  scopeId?: string;
}

export interface BulkUpdateItem {
  key: string;
  value: string;
  scopeId?: string;
}

export interface BulkUpdatePayload {
  updates: BulkUpdateItem[];
  changeReason?: string;
}

export interface CreateConfigurationPayload {
  key: string;
  value: string;
  valueType: string;
  category: string;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues?: string[];
  minValue?: number;
  maxValue?: number;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: string;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

export interface ImportConfigurationsPayload {
  configurations: string;
  overwrite?: boolean;
}

export const configurationApi = {
  /**
   * Get all configurations with optional filtering
   */
  getAll: async (filter?: ConfigurationFilter) => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const queryString = params.toString();
    const response = await api.get(`/api/configurations${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  /**
   * Get public configurations (no auth required)
   */
  getPublic: async () => {
    const response = await api.get('/api/configurations/public');
    return response.data;
  },

  /**
   * Get a specific configuration by key
   */
  getByKey: async (key: string, scopeId?: string) => {
    const params = scopeId ? `?scopeId=${scopeId}` : '';
    const response = await api.get(`/api/configurations/${key}${params}`);
    return response.data;
  },

  /**
   * Get configurations by category
   */
  getByCategory: async (category: string, scopeId?: string) => {
    const params = scopeId ? `?scopeId=${scopeId}` : '';
    const response = await api.get(`/api/configurations/category/${category}${params}`);
    return response.data;
  },

  /**
   * Update a configuration value
   */
  update: async (key: string, data: ConfigurationUpdate) => {
    const response = await api.put(`/api/configurations/${key}`, data);
    return response.data;
  },

  /**
   * Bulk update configurations
   */
  bulkUpdate: async (data: BulkUpdatePayload) => {
    const response = await api.put('/api/configurations/bulk', data);
    return response.data;
  },

  /**
   * Create a new configuration
   */
  create: async (data: CreateConfigurationPayload) => {
    const response = await api.post('/api/configurations', data);
    return response.data;
  },

  /**
   * Delete a configuration
   */
  delete: async (key: string, scopeId?: string) => {
    const params = scopeId ? `?scopeId=${scopeId}` : '';
    const response = await api.delete(`/api/configurations/${key}${params}`);
    return response.data;
  },

  /**
   * Reset configuration to default value
   */
  resetToDefault: async (key: string, scopeId?: string) => {
    const params = scopeId ? `?scopeId=${scopeId}` : '';
    const response = await api.post(`/api/configurations/${key}/reset${params}`);
    return response.data;
  },

  /**
   * Get configuration change history
   */
  getHistory: async (key: string, limit: number = 50) => {
    const response = await api.get(`/api/configurations/${key}/history?limit=${limit}`);
    return response.data;
  },

  /**
   * Get recent configuration changes
   */
  getRecentChanges: async (limit: number = 100) => {
    const response = await api.get(`/api/configurations/history/recent?limit=${limit}`);
    return response.data;
  },

  /**
   * Get configuration changes by user
   */
  getChangesByUser: async (userId: string, limit: number = 50) => {
    const response = await api.get(`/api/configurations/history/user/${userId}?limit=${limit}`);
    return response.data;
  },

  /**
   * Export configurations as JSON
   */
  export: async (filter?: { category?: string; scope?: string }) => {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.scope) params.append('scope', filter.scope);
    const queryString = params.toString();
    const response = await api.get(`/api/configurations/export${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Import configurations from JSON
   */
  import: async (data: ImportConfigurationsPayload) => {
    const response = await api.post('/api/configurations/import', data);
    return response.data;
  }
};
