// Configuration Page Exports
export * from './store';
export * from './components';
export { default as configurationRoutes } from './routes';

// Page Metadata
export const CONFIGURATION_PAGE_METADATA = {
  title: 'Configuration Management',
  description: 'System configuration management and administration',
  category: 'Administration',
  roles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'],
  features: [
    'System Configuration Management',
    'Configuration History & Audit',
    'Bulk Configuration Operations',
    'Configuration Import/Export',
    'Public Configuration Viewer',
    'Configuration Templates',
    'Configuration Validation',
    'Security & Access Control',
    'Configuration Backup & Restore',
    'Environment Management'
  ],
  apiIntegration: 'configurationApi'
};

// Service Adapter Integration Status
export const CONFIGURATION_SERVICE_STATUS = {
  integrated: true,
  apiMethods: [
    'getConfigurations',
    'getPublicConfigurations',
    'getConfigurationByKey',
    'getConfigurationsByCategory',
    'updateConfiguration',
    'bulkUpdateConfigurations',
    'createConfiguration',
    'deleteConfiguration',
    'resetConfigurationToDefault',
    'getConfigurationHistory',
    'getRecentChanges',
    'getChangesByUser',
    'exportConfigurations',
    'importConfigurations'
  ],
  storeSlice: 'configurationSlice',
  components: 60,
  routes: 13
};
