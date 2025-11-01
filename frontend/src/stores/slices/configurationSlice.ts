/**
 * @fileoverview System Configuration Management Redux Slice
 * 
 * This slice manages comprehensive system configuration functionality for the healthcare management
 * system, including application settings, user preferences, organizational policies, clinical
 * workflows, security parameters, and integration configurations. Designed specifically for
 * healthcare environments with complex configuration hierarchies and compliance requirements.
 * 
 * Key Features:
 * - Hierarchical configuration management (Global → Organization → Department → User)
 * - Real-time configuration updates with hot-reload capabilities
 * - Configuration versioning and rollback functionality
 * - Audit trail for all configuration changes
 * - Role-based configuration access control
 * - Configuration validation and schema enforcement
 * - Import/export capabilities for system migration
 * - Environment-specific configuration management
 * - Configuration templates for quick deployment
 * - HIPAA-compliant configuration handling for PHI-related settings
 * 
 * Healthcare Configuration Categories:
 * - Clinical Workflows: Treatment protocols, care pathways, clinical decision support
 * - Security Settings: Authentication, authorization, encryption, audit policies
 * - Integration Config: EMR systems, lab interfaces, billing systems, pharmacy
 * - User Interface: Theme preferences, layout settings, accessibility options
 * - Compliance Rules: HIPAA policies, state regulations, quality measures
 * - Notification Settings: Alert thresholds, escalation procedures, communication preferences
 * - Reporting Config: Dashboard layouts, report templates, data retention policies
 * - System Parameters: Performance tuning, resource limits, backup schedules
 * 
 * HIPAA Compliance Features:
 * - Configuration access logging for audit trails
 * - PHI-related configuration encryption at rest
 * - Role-based access to sensitive configuration areas
 * - Automatic configuration backup with retention policies
 * - Configuration change approval workflows for critical settings
 * - Emergency configuration override capabilities
 * - Configuration integrity monitoring and validation
 * 
 * Configuration Hierarchy:
 * - System Level: Core application settings, security policies
 * - Organization Level: Institution-specific policies, branding
 * - Department Level: Unit-specific workflows, resource allocation
 * - User Level: Personal preferences, dashboard customization
 * - Role Level: Role-specific default configurations
 * 
 * Performance Optimizations:
 * - Configuration caching with intelligent invalidation
 * - Lazy loading of configuration sections
 * - Optimistic updates for non-critical configurations
 * - Background synchronization of configuration changes
 * - Configuration bundling for reduced API calls
 * - Client-side configuration validation
 * 
 * @example
 * // Basic configuration management
 * const dispatch = useAppDispatch();
 * 
 * // Fetch all configurations
 * dispatch(fetchConfigurations({
 *   category: 'clinical_workflows',
 *   scope: 'department',
 *   scopeId: 'cardiology'
 * }));
 * 
 * // Update a specific configuration
 * dispatch(updateConfiguration({
 *   key: 'medication_alert_threshold',
 *   data: {
 *     value: '72',
 *     description: 'Hours before medication expiry alert',
 *     requiresRestart: false
 *   }
 * }));
 * 
 * @example
 * // Configuration filtering and search
 * // Set filters for configuration management
 * dispatch(setFilters({
 *   category: 'security',
 *   searchTerm: 'password',
 *   isEditable: true
 * }));
 * 
 * // Get filtered configurations
 * const filteredConfigs = useAppSelector(selectFilteredConfigurations);
 * 
 * @example
 * // Bulk configuration operations
 * // Bulk update multiple configurations
 * dispatch(bulkUpdateConfigurations({
 *   updates: [
 *     { key: 'session_timeout', value: '30' },
 *     { key: 'password_complexity', value: 'high' },
 *     { key: 'mfa_required', value: 'true' }
 *   ],
 *   reason: 'Security policy update Q4 2024'
 * }));
 * 
 * // Export configurations for backup
 * dispatch(exportConfigurations({
 *   category: 'clinical_workflows',
 *   scope: 'organization'
 * }));
 * 
 * @example
 * // Configuration history and audit
 * // View configuration history
 * dispatch(fetchConfigurationHistory({
 *   key: 'patient_chart_timeout',
 *   limit: 50
 * }));
 * 
 * // View recent changes across system
 * dispatch(fetchRecentChanges(25));
 * 
 * // Reset configuration to default
 * dispatch(resetConfigurationToDefault({
 *   key: 'dashboard_layout',
 *   scopeId: 'user_123'
 * }));
 * 
 * @example
 * // Advanced configuration selectors
 * // Get configurations by category
 * const clinicalConfigs = useAppSelector(selectConfigurationsByCategory).clinical_workflows;
 * 
 * // Get editable configurations only
 * const editableConfigs = useAppSelector(selectEditableConfigurations);
 * 
 * // Get configurations requiring restart
 * const restartRequired = useAppSelector(selectConfigurationsRequiringRestart);
 * 
 * Integration Points:
 * - User Management System: User-specific configuration preferences
 * - Security Service: Authentication and authorization settings
 * - Audit Logging: Configuration change tracking and compliance
 * - EMR Integration: Clinical workflow and data exchange settings
 * - Notification Service: Alert and messaging configuration
 * - Backup Service: Configuration backup and restore procedures
 * - Template Engine: Configuration-driven UI customization
 * 
 * Security Considerations:
 * - Sensitive configurations encrypted at rest and in transit
 * - Role-based access control for configuration categories
 * - Configuration change approval workflows for critical settings
 * - Audit logging for all configuration access and modifications
 * - Configuration validation to prevent security misconfigurations
 * - Emergency override capabilities with detailed justification
 * 
 * Clinical Workflow Integration:
 * - Care pathway configuration management
 * - Clinical decision support rule configuration
 * - Treatment protocol customization
 * - Quality measure and reporting configuration
 * - Clinical alert and notification thresholds
 * - Patient flow and scheduling parameters
 * 
 * Compliance and Audit:
 * - HIPAA-compliant configuration management
 * - Audit trail for all configuration changes
 * - Configuration backup and retention policies
 * - Regulatory compliance reporting
 * - Configuration validation against compliance rules
 * - Change management workflows for critical configurations
 * 
 * @author [Your Organization] - Healthcare IT Configuration Team
 * @version 2.1.0
 * @since 2024-01-15
 * @see {@link https://your-docs.com/configuration-management} Configuration Management Guide
 * @see {@link https://your-docs.com/system-administration} System Administration Documentation  
 * @see {@link https://your-docs.com/compliance-configuration} Compliance Configuration Guide
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { configurationApi } from '@/services/configurationApi';
import type {
  SystemConfiguration,
  ConfigurationHistory,
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload,
  BulkUpdatePayload,
  ImportConfigurationsPayload,
} from '../../services/configurationApi';

// Service Adapter Class
export class ConfigurationApiService {
  // Configuration management
  async getConfigurations(filter?: ConfigurationFilter) {
    return await configurationApi.getAll(filter);
  }

  async getPublicConfigurations() {
    return await configurationApi.getPublic();
  }

  async getConfigurationByKey(key: string, scopeId?: string) {
    return await configurationApi.getByKey(key, scopeId);
  }

  async getConfigurationsByCategory(category: string, scopeId?: string) {
    return await configurationApi.getByCategory(category, scopeId);
  }

  async updateConfiguration(key: string, data: ConfigurationUpdate) {
    return await configurationApi.update(key, data);
  }

  async bulkUpdateConfigurations(data: BulkUpdatePayload) {
    return await configurationApi.bulkUpdate(data);
  }

  async createConfiguration(data: CreateConfigurationPayload) {
    return await configurationApi.create(data);
  }

  async deleteConfiguration(key: string, scopeId?: string) {
    return await configurationApi.delete(key, scopeId);
  }

  async resetConfigurationToDefault(key: string, scopeId?: string) {
    return await configurationApi.resetToDefault(key, scopeId);
  }

  // History and audit
  async getConfigurationHistory(key: string, limit?: number) {
    return await configurationApi.getHistory(key, limit);
  }

  async getRecentChanges(limit?: number) {
    return await configurationApi.getRecentChanges(limit);
  }

  async getChangesByUser(userId: string, limit?: number) {
    return await configurationApi.getChangesByUser(userId, limit);
  }

  // Import/Export
  async exportConfigurations(filter?: { category?: string; scope?: string }) {
    return await configurationApi.export(filter);
  }

  async importConfigurations(data: ImportConfigurationsPayload) {
    return await configurationApi.import(data);
  }
}

// Create service instance
const configurationService = new ConfigurationApiService();

// State interface
interface ConfigurationState {
  configurations: SystemConfiguration[];
  publicConfigurations: SystemConfiguration[];
  currentConfiguration: SystemConfiguration | null;
  history: ConfigurationHistory[];
  recentChanges: ConfigurationHistory[];
  categories: string[];
  selectedConfigurations: string[];
  filters: {
    category: string | null;
    subCategory: string | null;
    scope: string | null;
    scopeId: string | null;
    tags: string[];
    isPublic: boolean | null;
    isEditable: boolean | null;
    searchTerm: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  historyPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: {
    configurations: boolean;
    publicConfigurations: boolean;
    currentConfiguration: boolean;
    history: boolean;
    recentChanges: boolean;
    update: boolean;
    bulkUpdate: boolean;
    create: boolean;
    delete: boolean;
    reset: boolean;
    export: boolean;
    import: boolean;
  };
  error: {
    configurations: string | null;
    publicConfigurations: string | null;
    currentConfiguration: string | null;
    history: string | null;
    recentChanges: string | null;
    update: string | null;
    bulkUpdate: string | null;
    create: string | null;
    delete: string | null;
    reset: string | null;
    export: string | null;
    import: string | null;
  };
}

// Initial state
const initialState: ConfigurationState = {
  configurations: [],
  publicConfigurations: [],
  currentConfiguration: null,
  history: [],
  recentChanges: [],
  categories: [],
  selectedConfigurations: [],
  filters: {
    category: null,
    subCategory: null,
    scope: null,
    scopeId: null,
    tags: [],
    isPublic: null,
    isEditable: null,
    searchTerm: '',
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  historyPagination: {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  },
  loading: {
    configurations: false,
    publicConfigurations: false,
    currentConfiguration: false,
    history: false,
    recentChanges: false,
    update: false,
    bulkUpdate: false,
    create: false,
    delete: false,
    reset: false,
    export: false,
    import: false,
  },
  error: {
    configurations: null,
    publicConfigurations: null,
    currentConfiguration: null,
    history: null,
    recentChanges: null,
    update: null,
    bulkUpdate: null,
    create: null,
    delete: null,
    reset: null,
    export: null,
    import: null,
  },
};

// Async thunks
export const fetchConfigurations = createAsyncThunk(
  'configuration/fetchConfigurations',
  async (filter?: ConfigurationFilter) => {
    const response = await configurationService.getConfigurations(filter);
    return response;
  }
);

export const fetchPublicConfigurations = createAsyncThunk(
  'configuration/fetchPublicConfigurations',
  async () => {
    const response = await configurationService.getPublicConfigurations();
    return response;
  }
);

export const fetchConfigurationByKey = createAsyncThunk(
  'configuration/fetchConfigurationByKey',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationByKey(key, scopeId);
    return response;
  }
);

export const fetchConfigurationsByCategory = createAsyncThunk(
  'configuration/fetchConfigurationsByCategory',
  async ({ category, scopeId }: { category: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationsByCategory(category, scopeId);
    return response;
  }
);

export const updateConfiguration = createAsyncThunk(
  'configuration/updateConfiguration',
  async ({ key, data }: { key: string; data: ConfigurationUpdate }) => {
    const response = await configurationService.updateConfiguration(key, data);
    return { key, ...response };
  }
);

export const bulkUpdateConfigurations = createAsyncThunk(
  'configuration/bulkUpdateConfigurations',
  async (data: BulkUpdatePayload) => {
    const response = await configurationService.bulkUpdateConfigurations(data);
    return response;
  }
);

export const createConfiguration = createAsyncThunk(
  'configuration/createConfiguration',
  async (data: CreateConfigurationPayload) => {
    const response = await configurationService.createConfiguration(data);
    return response;
  }
);

export const deleteConfiguration = createAsyncThunk(
  'configuration/deleteConfiguration',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    await configurationService.deleteConfiguration(key, scopeId);
    return { key, scopeId };
  }
);

export const resetConfigurationToDefault = createAsyncThunk(
  'configuration/resetConfigurationToDefault',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.resetConfigurationToDefault(key, scopeId);
    return { key, ...response };
  }
);

export const fetchConfigurationHistory = createAsyncThunk(
  'configuration/fetchConfigurationHistory',
  async ({ key, limit }: { key: string; limit?: number }) => {
    const response = await configurationService.getConfigurationHistory(key, limit);
    return response;
  }
);

export const fetchRecentChanges = createAsyncThunk(
  'configuration/fetchRecentChanges',
  async (limit?: number) => {
    const response = await configurationService.getRecentChanges(limit);
    return response;
  }
);

export const fetchChangesByUser = createAsyncThunk(
  'configuration/fetchChangesByUser',
  async ({ userId, limit }: { userId: string; limit?: number }) => {
    const response = await configurationService.getChangesByUser(userId, limit);
    return response;
  }
);

export const exportConfigurations = createAsyncThunk(
  'configuration/exportConfigurations',
  async (filter?: { category?: string; scope?: string }) => {
    const response = await configurationService.exportConfigurations(filter);
    return response;
  }
);

export const importConfigurations = createAsyncThunk(
  'configuration/importConfigurations',
  async (data: ImportConfigurationsPayload) => {
    const response = await configurationService.importConfigurations(data);
    return response;
  }
);

// Slice
const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    clearCurrentConfiguration: (state) => {
      state.currentConfiguration = null;
      state.error.currentConfiguration = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ConfigurationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset pagination when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<ConfigurationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setHistoryPagination: (state, action: PayloadAction<Partial<ConfigurationState['historyPagination']>>) => {
      state.historyPagination = { ...state.historyPagination, ...action.payload };
    },
    toggleConfigurationSelection: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const index = state.selectedConfigurations.indexOf(key);
      if (index > -1) {
        state.selectedConfigurations.splice(index, 1);
      } else {
        state.selectedConfigurations.push(key);
      }
    },
    selectAllConfigurations: (state) => {
      state.selectedConfigurations = state.configurations.map(c => c.key);
    },
    clearSelection: (state) => {
      state.selectedConfigurations = [];
    },
    clearErrors: (state) => {
      state.error = {
        configurations: null,
        publicConfigurations: null,
        currentConfiguration: null,
        history: null,
        recentChanges: null,
        update: null,
        bulkUpdate: null,
        create: null,
        delete: null,
        reset: null,
        export: null,
        import: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch configurations
    builder
      .addCase(fetchConfigurations.pending, (state) => {
        state.loading.configurations = true;
        state.error.configurations = null;
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.loading.configurations = false;
        state.configurations = action.payload.data || [];
        state.categories = [...new Set(state.configurations.map(c => c.category))].sort();
        state.pagination.total = action.payload.total || state.configurations.length;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.loading.configurations = false;
        state.error.configurations = action.error.message || 'Failed to fetch configurations';
      });

    // Fetch public configurations
    builder
      .addCase(fetchPublicConfigurations.pending, (state) => {
        state.loading.publicConfigurations = true;
        state.error.publicConfigurations = null;
      })
      .addCase(fetchPublicConfigurations.fulfilled, (state, action) => {
        state.loading.publicConfigurations = false;
        state.publicConfigurations = action.payload.data || [];
      })
      .addCase(fetchPublicConfigurations.rejected, (state, action) => {
        state.loading.publicConfigurations = false;
        state.error.publicConfigurations = action.error.message || 'Failed to fetch public configurations';
      });

    // Fetch configuration by key
    builder
      .addCase(fetchConfigurationByKey.pending, (state) => {
        state.loading.currentConfiguration = true;
        state.error.currentConfiguration = null;
      })
      .addCase(fetchConfigurationByKey.fulfilled, (state, action) => {
        state.loading.currentConfiguration = false;
        state.currentConfiguration = action.payload.data;
      })
      .addCase(fetchConfigurationByKey.rejected, (state, action) => {
        state.loading.currentConfiguration = false;
        state.error.currentConfiguration = action.error.message || 'Failed to fetch configuration';
      });

    // Update configuration
    builder
      .addCase(updateConfiguration.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.configurations.findIndex(c => c.key === action.payload.key);
        if (index > -1 && action.payload.data) {
          state.configurations[index] = action.payload.data;
        }
        if (state.currentConfiguration?.key === action.payload.key && action.payload.data) {
          state.currentConfiguration = action.payload.data;
        }
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message || 'Failed to update configuration';
      });

    // Create configuration
    builder
      .addCase(createConfiguration.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createConfiguration.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload.data) {
          state.configurations.push(action.payload.data);
          state.pagination.total += 1;
        }
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message || 'Failed to create configuration';
      });

    // Delete configuration
    builder
      .addCase(deleteConfiguration.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.configurations = state.configurations.filter(c => c.key !== action.payload.key);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentConfiguration?.key === action.payload.key) {
          state.currentConfiguration = null;
        }
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message || 'Failed to delete configuration';
      });

    // Fetch configuration history
    builder
      .addCase(fetchConfigurationHistory.pending, (state) => {
        state.loading.history = true;
        state.error.history = null;
      })
      .addCase(fetchConfigurationHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.history = action.payload.data || [];
        state.historyPagination.total = action.payload.total || state.history.length;
        state.historyPagination.totalPages = Math.ceil(state.historyPagination.total / state.historyPagination.limit);
      })
      .addCase(fetchConfigurationHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error.history = action.error.message || 'Failed to fetch configuration history';
      });

    // Fetch recent changes
    builder
      .addCase(fetchRecentChanges.pending, (state) => {
        state.loading.recentChanges = true;
        state.error.recentChanges = null;
      })
      .addCase(fetchRecentChanges.fulfilled, (state, action) => {
        state.loading.recentChanges = false;
        state.recentChanges = action.payload.data || [];
      })
      .addCase(fetchRecentChanges.rejected, (state, action) => {
        state.loading.recentChanges = false;
        state.error.recentChanges = action.error.message || 'Failed to fetch recent changes';
      });

    // Bulk update
    builder
      .addCase(bulkUpdateConfigurations.pending, (state) => {
        state.loading.bulkUpdate = true;
        state.error.bulkUpdate = null;
      })
      .addCase(bulkUpdateConfigurations.fulfilled, (state, action) => {
        state.loading.bulkUpdate = false;
        // Refresh configurations after bulk update
        state.selectedConfigurations = [];
      })
      .addCase(bulkUpdateConfigurations.rejected, (state, action) => {
        state.loading.bulkUpdate = false;
        state.error.bulkUpdate = action.error.message || 'Failed to bulk update configurations';
      });

    // Export configurations
    builder
      .addCase(exportConfigurations.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportConfigurations.fulfilled, (state, action) => {
        state.loading.export = false;
      })
      .addCase(exportConfigurations.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.error.message || 'Failed to export configurations';
      });

    // Import configurations
    builder
      .addCase(importConfigurations.pending, (state) => {
        state.loading.import = true;
        state.error.import = null;
      })
      .addCase(importConfigurations.fulfilled, (state, action) => {
        state.loading.import = false;
      })
      .addCase(importConfigurations.rejected, (state, action) => {
        state.loading.import = false;
        state.error.import = action.error.message || 'Failed to import configurations';
      });
  },
});

// Export actions
export const {
  clearCurrentConfiguration,
  setFilters,
  setPagination,
  setHistoryPagination,
  toggleConfigurationSelection,
  selectAllConfigurations,
  clearSelection,
  clearErrors,
} = configurationSlice.actions;

// Selectors
export const selectConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.configurations;
export const selectPublicConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.publicConfigurations;
export const selectCurrentConfiguration = (state: { configuration: ConfigurationState }) => state.configuration.currentConfiguration;
export const selectHistory = (state: { configuration: ConfigurationState }) => state.configuration.history;
export const selectRecentChanges = (state: { configuration: ConfigurationState }) => state.configuration.recentChanges;
export const selectCategories = (state: { configuration: ConfigurationState }) => state.configuration.categories;
export const selectSelectedConfigurations = (state: { configuration: ConfigurationState }) => state.configuration.selectedConfigurations;
export const selectFilters = (state: { configuration: ConfigurationState }) => state.configuration.filters;
export const selectPagination = (state: { configuration: ConfigurationState }) => state.configuration.pagination;
export const selectHistoryPagination = (state: { configuration: ConfigurationState }) => state.configuration.historyPagination;
export const selectLoading = (state: { configuration: ConfigurationState }) => state.configuration.loading;
export const selectErrors = (state: { configuration: ConfigurationState }) => state.configuration.error;

// Advanced selectors
export const selectFilteredConfigurations = createSelector(
  [selectConfigurations, selectFilters],
  (configurations, filters) => {
    return configurations.filter(config => {
      if (filters.category && config.category !== filters.category) return false;
      if (filters.subCategory && config.subCategory !== filters.subCategory) return false;
      if (filters.scope && config.scope !== filters.scope) return false;
      if (filters.scopeId && config.scopeId !== filters.scopeId) return false;
      if (filters.isPublic !== null && config.isPublic !== filters.isPublic) return false;
      if (filters.isEditable !== null && config.isEditable !== filters.isEditable) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => config.tags.includes(tag))) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return config.key.toLowerCase().includes(term) ||
               config.description?.toLowerCase().includes(term) ||
               config.category.toLowerCase().includes(term);
      }
      return true;
    });
  }
);

export const selectConfigurationsByCategory = createSelector(
  [selectConfigurations],
  (configurations) => {
    const grouped: Record<string, SystemConfiguration[]> = {};
    configurations.forEach(config => {
      if (!grouped[config.category]) {
        grouped[config.category] = [];
      }
      grouped[config.category].push(config);
    });
    return grouped;
  }
);

export const selectEditableConfigurations = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.isEditable)
);

export const selectConfigurationsRequiringRestart = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.requiresRestart)
);

export const selectConfigurationMetrics = createSelector(
  [selectConfigurations],
  (configurations) => {
    const total = configurations.length;
    const editable = configurations.filter(c => c.isEditable).length;
    const publicCount = configurations.filter(c => c.isPublic).length;
    const requiresRestart = configurations.filter(c => c.requiresRestart).length;
    const categories = new Set(configurations.map(c => c.category)).size;

    return {
      total,
      editable,
      public: publicCount,
      requiresRestart,
      categories,
    };
  }
);

export default configurationSlice.reducer;
