/**
 * WF-IDX-012 | index.ts - Access Control Page Entry Point
 * Purpose: Main export for access control page module
 * Dependencies: store, components, routes
 */

// Store exports
export * from './store';
export { default as accessControlReducer } from './store';

// Component exports
export * from './components';

// Route exports
export { default as AccessControlRoutes, accessControlRouteConfig } from './routes';

// Export page metadata
export const accessControlPageConfig = {
  name: 'Access Control',
  path: '/access-control',
  description: 'Comprehensive access control and security management',
  features: [
    'Role-based access control (RBAC)',
    'Permission management',
    'User role assignments',
    'Session management',
    'Security incident tracking',
    'IP restrictions',
    'Audit logging',
    'Security analytics'
  ],
  requiredRoles: ['ADMIN', 'SECURITY_MANAGER'],
  apiEndpoints: [
    'accessControlApi.getRoles',
    'accessControlApi.getPermissions',
    'accessControlApi.getSecurityIncidents',
    'accessControlApi.getUserSessions',
    'accessControlApi.getIpRestrictions',
    'accessControlApi.getStatistics'
  ]
};

// Export default page component (placeholder)
const AccessControlPage = () => null; // To be implemented
export default AccessControlPage;
