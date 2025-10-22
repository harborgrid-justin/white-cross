/**
 * WF-PAG-017 | index.ts - Compliance Page Module
 * Purpose: Main entry point for compliance management page
 * Dependencies: ComplianceRoutes, store, components
 * Features: Page exports and metadata for compliance functionality
 */

// Export the main routes component
export { default as ComplianceRoutes } from './routes';

// Export store components
export * from './store';

// Export all components
export * from './components';

// Page metadata for routing and navigation
export const compliancePageMetadata = {
  name: 'Compliance',
  path: '/compliance',
  icon: 'Shield',
  description: 'HIPAA/FERPA compliance tracking and reporting',
  category: 'Administration',
  requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR'],
  features: [
    'Compliance Reports',
    'Consent Forms Management',
    'Policy Documents',
    'Audit Logs',
    'HIPAA Compliance Tracking',
    'FERPA Compliance',
    'Security Incident Reporting',
    'Consent Tracking',
    'Policy Acknowledgments',
    'Audit Trail Management'
  ],
  subModules: [
    {
      name: 'Reports',
      path: '/compliance/reports',
      description: 'Compliance reports and generation',
      requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR']
    },
    {
      name: 'Consent Forms',
      path: '/compliance/consent/forms',
      description: 'Consent form templates and management',
      requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR']
    },
    {
      name: 'Policies',
      path: '/compliance/policies',
      description: 'Policy documents and acknowledgments',
      requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER']
    },
    {
      name: 'Audit Logs',
      path: '/compliance/audit',
      description: 'System audit logs and trails',
      requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']
    },
    {
      name: 'Statistics',
      path: '/compliance/statistics',
      description: 'Compliance metrics and analytics',
      requiredRoles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']
    }
  ]
};

// Route configuration for external integration
export const complianceRouteConfig = {
  basePath: '/compliance',
  routes: [
    { path: '/', component: 'ComplianceDashboard', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR'] },
    { path: '/statistics', component: 'ComplianceStatistics', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'] },
    
    // Reports
    { path: '/reports', component: 'ComplianceReportsList', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR'] },
    { path: '/reports/new', component: 'ComplianceReportForm', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE'] },
    { path: '/reports/:id/edit', component: 'ComplianceReportForm', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE'] },
    { path: '/reports/:id', component: 'ComplianceReportDetails', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR'] },
    { path: '/reports/generate', component: 'ReportGeneratorModal', roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
    
    // Consent Forms
    { path: '/consent/forms', component: 'ConsentFormsList', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR'] },
    { path: '/consent/forms/new', component: 'ConsentFormBuilder', roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
    { path: '/consent/forms/:id/edit', component: 'ConsentFormBuilder', roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
    { path: '/consent/forms/:id', component: 'ConsentFormDetails', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR'] },
    { path: '/consent/sign/:formId', component: 'ConsentSigningInterface', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR'] },
    { path: '/consent/student/:studentId', component: 'StudentConsentHistory', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR'] },
    
    // Policies
    { path: '/policies', component: 'PoliciesList', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER'] },
    { path: '/policies/new', component: 'PolicyForm', roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
    { path: '/policies/:id/edit', component: 'PolicyForm', roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
    { path: '/policies/:id', component: 'PolicyDetails', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER'] },
    { path: '/policies/:id/acknowledge', component: 'PolicyAcknowledgmentInterface', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER'] },
    { path: '/policies/:id/acknowledgments', component: 'PolicyAcknowledgmentHistory', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'] },
    
    // Audit
    { path: '/audit', component: 'AuditLogsList', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'] },
    { path: '/audit/:id', component: 'AuditLogDetails', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'] },
    { path: '/audit/trail/:entityType/:entityId', component: 'AuditTrail', roles: ['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'] }
  ]
};

// Default export for easy importing
export default {
  ComplianceRoutes,
  compliancePageMetadata,
  complianceRouteConfig
};
