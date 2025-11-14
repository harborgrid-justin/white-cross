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
 * @author [Your Organization] - Healthcare IT Configuration Team
 * @version 2.1.0
 * @since 2024-01-15
 * @module stores/slices/configuration
 */

// Export main reducer
export { default as configurationReducer } from './slice';
export { default } from './slice';

// Export all actions
export {
  // UI state actions
  clearCurrentConfiguration,
  setFilters,
  setPagination,
  setHistoryPagination,
  
  // Selection actions
  toggleConfigurationSelection,
  selectAllConfigurations,
  clearSelection,
  
  // Error management
  clearErrors,
} from './slice';

// Export all async thunks
export {
  // Configuration CRUD operations
  fetchConfigurations,
  fetchPublicConfigurations,
  fetchConfigurationByKey,
  fetchConfigurationsByCategory,
  updateConfiguration,
  bulkUpdateConfigurations,
  createConfiguration,
  deleteConfiguration,
  resetConfigurationToDefault,
  
  // History and audit operations
  fetchConfigurationHistory,
  fetchRecentChanges,
  fetchChangesByUser,
  
  // Import/export operations
  exportConfigurations,
  importConfigurations,
} from './thunks';

// Export all selectors
export {
  // Basic selectors
  selectConfigurations,
  selectPublicConfigurations,
  selectCurrentConfiguration,
  selectHistory,
  selectRecentChanges,
  selectCategories,
  selectSelectedConfigurations,
  selectFilters,
  selectPagination,
  selectHistoryPagination,
  selectLoading,
  selectErrors,
  
  // Derived selectors
  selectFilteredConfigurations,
  selectConfigurationsByCategory,
  selectEditableConfigurations,
  selectConfigurationsRequiringRestart,
  selectConfigurationMetrics,
} from './selectors';

// Export type definitions
export type {
  ConfigurationState,
  LoadingStates,
  ErrorStates,
  ConfigurationFilters,
  PaginationMeta,
} from './types';

// Re-export API types for convenience
export type {
  SystemConfiguration,
  ConfigurationHistory,
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload,
  BulkUpdatePayload,
  ImportConfigurationsPayload,
} from '../../../services/configurationApi';

/**
 * Pre-configured configuration slice for Redux store integration
 * 
 * @example
 * ```typescript
 * import { configureStore } from '@reduxjs/toolkit';
 * import { configurationReducer } from '@/stores/slices/configuration';
 * 
 * const store = configureStore({
 *   reducer: {
 *     configuration: configurationReducer,
 *     // other reducers...
 *   },
 * });
 * ```
 */

/**
 * Usage examples for common operations
 * 
 * @example
 * ```typescript
 * import { useSelector, useDispatch } from 'react-redux';
 * import {
 *   fetchConfigurations,
 *   selectConfigurations,
 *   selectLoading,
 *   setFilters
 * } from '@/stores/slices/configuration';
 * 
 * function ConfigurationsList() {
 *   const dispatch = useDispatch();
 *   const configurations = useSelector(selectConfigurations);
 *   const loading = useSelector(selectLoading);
 * 
 *   // Fetch configurations on component mount
 *   useEffect(() => {
 *     dispatch(fetchConfigurations());
 *   }, [dispatch]);
 * 
 *   // Filter by security category
 *   const handleFilterBySecurity = () => {
 *     dispatch(setFilters({ category: 'security' }));
 *     dispatch(fetchConfigurations({ category: 'security' }));
 *   };
 * 
 *   if (loading.configurations) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   return (
 *     <div>
 *       <button onClick={handleFilterBySecurity}>
 *         Show Security Settings
 *       </button>
 *       {configurations.map(config => (
 *         <ConfigCard key={config.key} configuration={config} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
