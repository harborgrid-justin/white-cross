/**
 * Integration Page Module Entry Point
 * Comprehensive integration management for healthcare platform
 */

// Export the main routes component
export { default as IntegrationRoutes } from './routes';

// Export store and components for external usage
export * from './store';
export * from './components';

// Page metadata for navigation and routing
export const integrationPageMeta = {
  title: 'Integration Management',
  description: 'Comprehensive integration hub for managing external system connections including SIS, EHR, Pharmacy, Laboratory, Insurance, and Government systems',
  path: '/integration',
  icon: 'Link',
  category: 'System Administration',
  priority: 8,
  requiredPermissions: ['integration.read'],
  subModules: [
    {
      name: 'Dashboard',
      path: '/',
      description: 'Integration overview dashboard with health metrics and statistics',
      icon: 'BarChart3',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']
    },
    {
      name: 'Integrations List',
      path: '/list',
      description: 'View and manage all configured integrations',
      icon: 'List',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Create Integration',
      path: '/create',
      description: 'Configure new external system integration',
      icon: 'Plus',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN']
    },
    {
      name: 'Setup Wizard',
      path: '/wizard',
      description: 'Guided setup for new integrations with validation and testing',
      icon: 'Wand2',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN']
    },
    {
      name: 'Statistics',
      path: '/statistics',
      description: 'Integration performance analytics and success metrics',
      icon: 'TrendingUp',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Health Status',
      path: '/health',
      description: 'System health monitoring and integration status overview',
      icon: 'Activity',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Integration Logs',
      path: '/logs/all',
      description: 'Comprehensive logging and audit trail for all integrations',
      icon: 'FileText',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']
    },
    {
      name: 'Batch Operations',
      path: '/batch',
      description: 'Bulk management operations for multiple integrations',
      icon: 'Layers',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN']
    },
    {
      name: 'Diagnostics',
      path: '/diagnostics',
      description: 'Troubleshooting tools and system diagnostics',
      icon: 'Stethoscope',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']
    },
    {
      name: 'SIS Setup',
      path: '/setup/sis',
      description: 'Student Information System integration configuration',
      icon: 'GraduationCap',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN']
    },
    {
      name: 'EHR Setup',
      path: '/setup/ehr',
      description: 'Electronic Health Records integration configuration',
      icon: 'Heart',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'NURSE']
    },
    {
      name: 'Pharmacy Setup',
      path: '/setup/pharmacy',
      description: 'Pharmacy Management System integration configuration',
      icon: 'Pill',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'NURSE']
    },
    {
      name: 'Laboratory Setup',
      path: '/setup/laboratory',
      description: 'Laboratory Information System integration configuration',
      icon: 'TestTube',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN', 'NURSE']
    },
    {
      name: 'Insurance Setup',
      path: '/setup/insurance',
      description: 'Insurance Verification System integration configuration',
      icon: 'Shield',
      requiredRoles: ['ADMIN', 'DISTRICT_ADMIN']
    }
  ],
  features: [
    'Multi-protocol integration support (REST, SOAP, HL7, FHIR)',
    'Real-time connection monitoring and health checks',
    'Automated synchronization with scheduling',
    'Field mapping and data transformation',
    'OAuth2, API Key, and certificate-based authentication',
    'Comprehensive logging and audit trails',
    'Webhook configuration and event handling',
    'Batch operations and bulk management',
    'Performance analytics and success metrics',
    'Integration testing and diagnostics',
    'Role-based access control',
    'Configuration import/export',
    'Error analysis and troubleshooting tools'
  ],
  integrationTypes: [
    {
      type: 'SIS',
      name: 'Student Information System',
      description: 'Sync student demographics, enrollment, and academic data',
      vendors: ['PowerSchool', 'Skyward', 'Infinite Campus', 'Schoology']
    },
    {
      type: 'EHR',
      name: 'Electronic Health Records',
      description: 'Integrate clinical data, vaccinations, and health history',
      vendors: ['Epic', 'Cerner', 'Allscripts', 'NextGen'],
      standards: ['FHIR R4', 'HL7 v2.x', 'CDA']
    },
    {
      type: 'PHARMACY',
      name: 'Pharmacy Management',
      description: 'Connect with pharmacy systems for medication management',
      features: ['Prescription processing', 'Inventory sync', 'Auto-refill']
    },
    {
      type: 'LABORATORY',
      name: 'Laboratory Information System',
      description: 'Import lab results and critical value notifications',
      features: ['Result automation', 'Critical alerts', 'Quality control']
    },
    {
      type: 'INSURANCE',
      name: 'Insurance Verification',
      description: 'Real-time eligibility checking and claims processing',
      features: ['Eligibility verification', 'Prior authorization', 'Claims submission']
    },
    {
      type: 'PARENT_PORTAL',
      name: 'Parent Portal',
      description: 'Connect with parent communication platforms',
      features: ['Health record sharing', 'Appointment scheduling', 'Notifications']
    },
    {
      type: 'HEALTH_APP',
      name: 'Health Applications',
      description: 'Integrate with mobile health and wellness apps',
      features: ['Fitness tracking', 'Mental health', 'Medication reminders']
    },
    {
      type: 'GOVERNMENT_REPORTING',
      name: 'Government Reporting',
      description: 'Automated compliance reporting to regulatory agencies',
      features: ['State reporting', 'Federal compliance', 'Audit trails']
    }
  ]
};

// Export metadata for navigation system
export default integrationPageMeta;
