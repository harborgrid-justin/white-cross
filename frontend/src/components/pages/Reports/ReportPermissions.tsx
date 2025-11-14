/**
 * @fileoverview Report Permissions Management Component
 * @module components/pages/Reports/ReportPermissions
 * @category Report Components
 *
 * A comprehensive permissions management component that handles user and group
 * access control for reports with role-based permissions, templates, and audit logs.
 *
 * This file provides backward compatibility while using the new modular architecture.
 * For new implementations, prefer importing directly from './ReportPermissions' or using
 * the named exports.
 *
 * Key Features:
 * - **Role-Based Access Control**: Fine-grained permissions for users and groups
 * - **Permission Templates**: Reusable permission configurations
 * - **Audit Logging**: Complete access tracking for compliance
 * - **Bulk Operations**: Efficient management of multiple permissions
 * - **Inheritance**: Group and role-based permission inheritance
 * - **Time-Based Restrictions**: Temporal access controls
 *
 * Healthcare Compliance:
 * - HIPAA audit trail support
 * - Role-based access appropriate for healthcare settings
 * - Time-based access controls for sensitive data
 * - Complete permission history tracking
 * - IP-based access restrictions
 *
 * Component Architecture:
 * ```
 * ReportPermissions (Main Container)
 *     ├── PermissionsTable (Permission rules management)
 *     ├── TemplatesGrid (Permission templates)
 *     ├── AccessLogsTable (Audit logs display)
 *     ├── PermissionModal (Create/edit permissions)
 *     └── TemplateModal (Create/edit templates)
 * ```
 *
 * Performance Features:
 * - Virtualized tables for large datasets
 * - Efficient filtering and search
 * - Optimistic updates for better UX
 * - Bulk operations support
 * - Lazy loading of audit logs
 *
 * @example
 * ```tsx
 * // Basic usage
 * import ReportPermissions from './ReportPermissions';
 * 
 * <ReportPermissions
 *   entities={users}
 *   rules={permissionRules}
 *   templates={permissionTemplates}
 *   accessLogs={auditLogs}
 *   reports={availableReports}
 *   onCreateRule={handleCreateRule}
 *   onUpdateRule={handleUpdateRule}
 *   onDeleteRule={handleDeleteRule}
 *   onCreateTemplate={handleCreateTemplate}
 *   onApplyTemplate={handleApplyTemplate}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with healthcare-specific settings
 * <ReportPermissions
 *   entities={healthcareUsers}
 *   rules={hipaaCompliantRules}
 *   templates={standardTemplates}
 *   accessLogs={auditTrail}
 *   reports={medicalReports}
 *   loading={isLoading}
 *   onCreateRule={(rule) => {
 *     // Validate HIPAA compliance
 *     if (validateHIPAA(rule)) {
 *       createPermissionRule(rule);
 *       logSecurityEvent('permission_created', rule);
 *     }
 *   }}
 *   onBulkPermissionChange={(entities, changes) => {
 *     // Bulk permission updates with audit trail
 *     updateBulkPermissions(entities, changes);
 *     logBulkSecurityEvent('bulk_permission_update', entities, changes);
 *   }}
 * />
 * ```
 *
 * @see {@link PermissionsTable} for permission rules management
 * @see {@link TemplatesGrid} for permission templates
 * @see {@link AccessLogsTable} for audit log display
 */

// ==========================================
// IMPORTS FROM MODULAR ARCHITECTURE
// ==========================================

// Import the main component and re-export it as default
import ReportPermissionsComponent from './ReportPermissions/index';

// Import and re-export types
export type {
  PermissionLevel,
  PermissionScope,
  EntityType,
  PermissionAction,
  PermissionEntity,
  PermissionRule,
  PermissionTemplate,
  AccessLogEntry,
  ReportReference,
  PermissionFilters,
  ReportPermissionsProps
} from './ReportPermissions/types';

// ==========================================
// COMPONENT EXPORTS
// ==========================================

/**
 * Main ReportPermissions component
 * 
 * Re-exported from the modular implementation for backward compatibility
 */
export const ReportPermissions = ReportPermissionsComponent;

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * Default ReportPermissions component export
 *
 * @description
 * Main permissions management component ready for immediate use. This is the recommended
 * way to import and use the ReportPermissions component.
 *
 * @example
 * ```tsx
 * import ReportPermissions from './ReportPermissions';
 * 
 * function App() {
 *   return (
 *     <ReportPermissions
 *       entities={entities}
 *       rules={rules}
 *       onCreateRule={handleCreateRule}
 *     />
 *   );
 * }
 * ```
 */
export default ReportPermissionsComponent;

// ==========================================
// BACKWARD COMPATIBILITY NOTE
// ==========================================

/**
 * MIGRATION GUIDE
 * 
 * This ReportPermissions component has been refactored into a modular architecture
 * for better maintainability and performance. The public API remains the same
 * to ensure backward compatibility.
 * 
 * For new code, consider importing sub-components directly:
 * 
 * ```tsx
 * // New recommended approach for custom layouts
 * import { PermissionsTable } from './ReportPermissions/PermissionsTable';
 * import { TemplatesGrid } from './ReportPermissions/TemplatesGrid';
 * 
 * // Or for custom hooks
 * import { usePermissionFilters, useBulkSelection } from './ReportPermissions/hooks';
 * 
 * // Legacy approach (still works)
 * import ReportPermissions from './ReportPermissions';
 * ```
 * 
 * Benefits of the modular architecture:
 * - Better code organization and maintainability
 * - Improved performance with smaller component bundles
 * - Enhanced reusability of sub-components
 * - Better testability with isolated components
 * - Easier customization and theming
 * - TypeScript intellisense improvements
 * 
 * Sub-components available for direct use:
 * - PermissionsTable: Manage permission rules with filtering and bulk operations
 * - TemplatesGrid: Display and manage permission templates
 * - AccessLogsTable: Show audit logs with search and filtering
 * - PermissionModal: Create and edit permission rules
 * - TemplateModal: Create and edit permission templates
 * 
 * Custom hooks available:
 * - usePermissionFilters: Handle permission filtering logic
 * - useAccessLogFilters: Handle access log filtering
 * - useBulkSelection: Manage bulk selection state
 * - usePermissionForm: Handle permission form state
 * - useTemplateForm: Handle template form state
 * 
 * Utility functions available:
 * - getPermissionLevelDisplay: Get display info for permission levels
 * - getEntityTypeIcon: Get icons for entity types
 * - validatePermissionRule: Validate permission rule data
 * 
 * All existing code will continue to work without changes.
 * The component maintains 100% backward compatibility.
 * 
 * File size reduction:
 * - Original: 1066 lines (monolithic)
 * - New main file: ~200 lines (interface only)
 * - Sub-components: Each under 500 lines
 * - Total improvement: Better maintainability and performance
 */
