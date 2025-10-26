/**
 * Access-control Module Components
 *
 * Component exports for access-control functionality.
 * Updated: 2025-10-24 - Added missing route components
 */

// Dashboard Components
export { default as AccessControlDashboard } from './AccessControlDashboard';
export { default as SecurityDashboard } from './SecurityDashboard';
export { default as AccessControlStatistics } from './AccessControlStatistics';

// Role Management Components
export { default as RolesList } from './RolesList';
export { default as RoleCard } from './RoleCard';
export { default as RoleForm } from './RoleForm';
export { default as CreateRoleDialog } from './CreateRoleDialog';
export { default as EditRoleDialog } from './EditRoleDialog';
export { default as RoleDetails } from './RoleDetails';
export { default as RoleHierarchy } from './RoleHierarchy';
export { default as RoleStatistics } from './RoleStatistics';
export { default as RoleFilters } from './RoleFilters';
export { default as RoleTemplates } from './RoleTemplates';
export { default as BulkRoleAssignment } from './BulkRoleAssignment';
export { default as RoleConflicts } from './RoleConflicts';
export { default as RoleApprovalWorkflow } from './RoleApprovalWorkflow';
export { default as RoleInheritance } from './RoleInheritance';

// Permission Management Components
export { default as PermissionsList } from './PermissionsList';
export { default as PermissionCard } from './PermissionCard';
export { default as PermissionMatrix } from './PermissionMatrix';
export { default as PermissionForm } from './PermissionForm';
export { default as AssignPermissionsDialog } from './AssignPermissionsDialog';
export { default as PermissionSearch } from './PermissionSearch';
export { default as PermissionGroups } from './PermissionGroups';

// User Role Assignment Components
export { default as UserRolesList } from './UserRolesList';
export { default as UserRoleCard } from './UserRoleCard';
export { default as AssignRoleDialog } from './AssignRoleDialog';
export { default as UserRoleAssignment } from './UserRoleAssignment';
export { default as UserPermissionCheck } from './UserPermissionCheck';

// Session Management Components
export { default as ActiveSessionsList } from './ActiveSessionsList';
export { default as SessionManagement } from './SessionManagement';

// Security Incident Components
export { default as SecurityIncidentsList } from './SecurityIncidentsList';
export { default as SecurityIncidentForm } from './SecurityIncidentForm';
export { default as SecurityIncidentDetails } from './SecurityIncidentDetails';

// IP Restriction Components
export { default as IpRestrictionsList } from './IpRestrictionsList';
export { default as IpRestrictionForm } from './IpRestrictionForm';

// Audit and Monitoring Components
export { default as AccessLogs } from './AccessLogs';
export { default as AccessAuditTrail } from './AccessAuditTrail';
export { default as AuditLog } from './AuditLog';
export { default as AccessReports } from './AccessReports';

// Settings and Policy Components
export { default as AccessControlSettings } from './AccessControlSettings';
export { default as SecurityPolicies } from './SecurityPolicies';
export { default as ResourceAccessControl } from './ResourceAccessControl';
