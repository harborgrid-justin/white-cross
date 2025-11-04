/**
 * Type definitions for the ReportPermissions component system
 * Extracted from ReportPermissions.tsx for better organization and reusability
 */

/**
 * Permission levels define the access rights for entities
 * - none: No access to the resource
 * - read: Can view but not modify
 * - write: Can view and edit
 * - admin: Full management capabilities
 * - owner: Complete control including permission management
 */
export type PermissionLevel = 'none' | 'read' | 'write' | 'admin' | 'owner';

/**
 * Permission scope defines the breadth of access
 * - report: Access to specific report
 * - category: Access to all reports in a category
 * - global: Access to all reports system-wide
 */
export type PermissionScope = 'report' | 'category' | 'global';

/**
 * Entity types that can be assigned permissions
 * - user: Individual user account
 * - group: Collection of users
 * - role: Permission role template
 * - department: Organizational unit
 */
export type EntityType = 'user' | 'group' | 'role' | 'department';

/**
 * Granular permission actions
 * Each action represents a specific capability
 */
export type PermissionAction = 'view' | 'edit' | 'delete' | 'export' | 'share' | 'schedule' | 'manage';

/**
 * Entity that can receive permissions
 * Represents users, groups, roles, or departments
 */
export interface PermissionEntity {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Entity type classification */
  type: EntityType;
  /** Email address (for users) */
  email?: string;
  /** Department affiliation */
  department?: string;
  /** Avatar/profile image URL */
  avatar?: string;
  /** Whether entity is currently active */
  isActive: boolean;
  /** Last access timestamp */
  lastAccess?: string;
}

/**
 * Permission rule definition
 * Defines what access an entity has to resources
 */
export interface PermissionRule {
  /** Unique rule identifier */
  id: string;
  /** Entity receiving the permission */
  entityId: string;
  /** Entity display name */
  entityName: string;
  /** Entity type */
  entityType: EntityType;
  /** Scope of the permission */
  scope: PermissionScope;
  /** Resource identifier (if scope is not global) */
  resourceId?: string;
  /** Resource display name */
  resourceName?: string;
  /** Permission level granted */
  level: PermissionLevel;
  /** Specific actions allowed */
  actions: PermissionAction[];
  /** Optional conditional restrictions */
  conditions?: {
    /** Time-based access restriction */
    timeRestriction?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    /** IP address whitelist */
    ipRestriction?: string[];
    /** Expiration date for temporary access */
    expiresAt?: string;
  };
  /** Source of inherited permission */
  inheritedFrom?: string;
  /** Creation timestamp */
  createdAt: string;
  /** Creator identifier */
  createdBy: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Permission template for reusable configurations
 * Templates allow quick application of common permission patterns
 */
export interface PermissionTemplate {
  /** Unique template identifier */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Default permission level */
  level: PermissionLevel;
  /** Default actions */
  actions: PermissionAction[];
  /** Default scope */
  scope: PermissionScope;
  /** Whether this is a system default template */
  isDefault: boolean;
  /** Number of times template has been applied */
  usageCount: number;
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Access log entry for audit trail
 * Tracks all access attempts to resources
 */
export interface AccessLogEntry {
  /** Unique log entry identifier */
  id: string;
  /** Entity that attempted access */
  entityId: string;
  /** Entity display name */
  entityName: string;
  /** Entity type */
  entityType: EntityType;
  /** Resource accessed */
  resourceId: string;
  /** Resource display name */
  resourceName: string;
  /** Action attempted */
  action: string;
  /** Access timestamp */
  timestamp: string;
  /** Originating IP address */
  ipAddress: string;
  /** User agent string */
  userAgent: string;
  /** Whether access was granted */
  success: boolean;
  /** Additional details or error message */
  details?: string;
}

/**
 * Report reference for scope selection
 */
export interface ReportReference {
  /** Report identifier */
  id: string;
  /** Report name */
  name: string;
  /** Report category */
  category: string;
}

/**
 * Filter state for permission rules
 */
export interface PermissionFilters {
  /** Filter by entity type */
  entityType: EntityType | 'all';
  /** Filter by permission level */
  level: PermissionLevel | 'all';
  /** Filter by scope */
  scope: PermissionScope | 'all';
}

/**
 * Props for the main ReportPermissions component
 */
export interface ReportPermissionsProps {
  /** Available entities (users, groups, etc.) */
  entities?: PermissionEntity[];
  /** Permission rules */
  rules?: PermissionRule[];
  /** Permission templates */
  templates?: PermissionTemplate[];
  /** Access logs */
  accessLogs?: AccessLogEntry[];
  /** Available reports */
  reports?: ReportReference[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create permission rule handler */
  onCreateRule?: (rule: Partial<PermissionRule>) => void;
  /** Update permission rule handler */
  onUpdateRule?: (id: string, rule: Partial<PermissionRule>) => void;
  /** Delete permission rule handler */
  onDeleteRule?: (id: string) => void;
  /** Create template handler */
  onCreateTemplate?: (template: Partial<PermissionTemplate>) => void;
  /** Apply template handler */
  onApplyTemplate?: (templateId: string, entityIds: string[]) => void;
  /** Bulk permission change handler */
  onBulkPermissionChange?: (entityIds: string[], changes: Partial<PermissionRule>) => void;
}
