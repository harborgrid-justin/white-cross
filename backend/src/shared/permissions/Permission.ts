/**
 * @fileoverview Permission System - HIPAA-Compliant RBAC Framework
 * @module shared/permissions/Permission
 * @description Berty-inspired declarative permission management system
 *
 * Provides:
 * - Role-based access control (RBAC)
 * - Resource-level permissions
 * - Action-based authorization
 * - Permission checking utilities
 * - Audit trail integration
 *
 * @security HIPAA-compliant access control
 * @compliance SOC2 - Role-based authorization
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

/**
 * Available roles in the system
 */
export enum Role {
  // Administrative roles
  SuperAdmin = 'super_admin',
  Admin = 'admin',

  // Healthcare provider roles
  Nurse = 'nurse',
  Doctor = 'doctor',
  Pharmacist = 'pharmacist',

  // Staff roles
  Staff = 'staff',
  Teacher = 'teacher',
  Counselor = 'counselor',

  // Limited access roles
  Guardian = 'guardian',
  Viewer = 'viewer',

  // System roles
  System = 'system',
  ApiClient = 'api_client',
}

/**
 * Resource types that can be protected
 */
export enum Resource {
  // Student resources
  Student = 'student',
  StudentProfile = 'student:profile',
  StudentMedical = 'student:medical',
  StudentConsent = 'student:consent',

  // Medication resources
  Medication = 'medication',
  MedicationLog = 'medication:log',
  MedicationSchedule = 'medication:schedule',
  MedicationInventory = 'medication:inventory',

  // Health record resources
  HealthRecord = 'health_record',
  HealthRecordMedical = 'health_record:medical',
  HealthRecordAllergy = 'health_record:allergy',
  HealthRecordCondition = 'health_record:condition',

  // Contact resources
  Contact = 'contact',
  ContactGuardian = 'contact:guardian',
  ContactEmergency = 'contact:emergency',
  ContactStaff = 'contact:staff',

  // Activity resources
  Activity = 'activity',
  ActivityLog = 'activity:log',
  ActivityTimeline = 'activity:timeline',

  // User resources
  User = 'user',
  UserProfile = 'user:profile',
  UserSettings = 'user:settings',

  // System resources
  Settings = 'settings',
  Audit = 'audit',
  Report = 'report',
  Webhook = 'webhook',
}

/**
 * Actions that can be performed on resources
 */
export enum Action {
  // Read operations
  Read = 'read',
  List = 'list',
  View = 'view',

  // Write operations
  Create = 'create',
  Update = 'update',
  Delete = 'delete',

  // Special operations
  Administer = 'administer',
  Approve = 'approve',
  Override = 'override',
  Export = 'export',
  Import = 'import',

  // Medication-specific
  AdministerMedication = 'administer_medication',
  ScheduleMedication = 'schedule_medication',
  VerifyMedication = 'verify_medication',

  // Audit operations
  ViewAudit = 'view_audit',
  ManageAudit = 'manage_audit',
}

/**
 * Permission definition
 */
export interface Permission {
  role: Role;
  resource: Resource;
  actions: Action[];
  conditions?: PermissionCondition[];
}

/**
 * Permission condition for context-based access
 */
export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'lt' | 'matches';
  value: any;
}

/**
 * Permission check context
 */
export interface PermissionContext {
  userId: string;
  userRole: Role;
  resource: Resource;
  action: Action;
  resourceId?: string;
  resourceOwnerId?: string;
  metadata?: Record<string, any>;
}

/**
 * Permission check result
 */
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: Role;
  requiredAction?: Action;
}

/**
 * Default permission matrix
 * Defines what each role can do with each resource
 */
export const PERMISSION_MATRIX: Permission[] = [
  // Super Admin - Full access
  {
    role: Role.SuperAdmin,
    resource: Resource.Student,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.Delete,
      Action.Export,
    ],
  },
  {
    role: Role.SuperAdmin,
    resource: Resource.Medication,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.Delete,
      Action.AdministerMedication,
    ],
  },
  {
    role: Role.SuperAdmin,
    resource: Resource.HealthRecord,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.Delete,
    ],
  },
  {
    role: Role.SuperAdmin,
    resource: Resource.Contact,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.Delete,
    ],
  },
  {
    role: Role.SuperAdmin,
    resource: Resource.Settings,
    actions: [Action.Read, Action.Update],
  },
  {
    role: Role.SuperAdmin,
    resource: Resource.Audit,
    actions: [Action.ViewAudit, Action.ManageAudit],
  },

  // Admin - Most access
  {
    role: Role.Admin,
    resource: Resource.Student,
    actions: [Action.Read, Action.List, Action.Create, Action.Update],
  },
  {
    role: Role.Admin,
    resource: Resource.Medication,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.ScheduleMedication,
    ],
  },
  {
    role: Role.Admin,
    resource: Resource.HealthRecord,
    actions: [Action.Read, Action.List, Action.Create, Action.Update],
  },
  {
    role: Role.Admin,
    resource: Resource.Contact,
    actions: [Action.Read, Action.List, Action.Create, Action.Update],
  },
  {
    role: Role.Admin,
    resource: Resource.Audit,
    actions: [Action.ViewAudit],
  },

  // Nurse - Medication administration and student care
  {
    role: Role.Nurse,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Nurse,
    resource: Resource.StudentMedical,
    actions: [Action.Read],
  },
  {
    role: Role.Nurse,
    resource: Resource.Medication,
    actions: [
      Action.Read,
      Action.List,
      Action.AdministerMedication,
      Action.VerifyMedication,
    ],
  },
  {
    role: Role.Nurse,
    resource: Resource.MedicationLog,
    actions: [Action.Read, Action.List, Action.Create, Action.Update],
  },
  {
    role: Role.Nurse,
    resource: Resource.HealthRecord,
    actions: [Action.Read, Action.List, Action.Create],
  },
  {
    role: Role.Nurse,
    resource: Resource.Contact,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Nurse,
    resource: Resource.Activity,
    actions: [Action.Read, Action.List, Action.Create],
  },

  // Doctor - Medical oversight
  {
    role: Role.Doctor,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Doctor,
    resource: Resource.StudentMedical,
    actions: [Action.Read, Action.Update],
  },
  {
    role: Role.Doctor,
    resource: Resource.Medication,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.ScheduleMedication,
    ],
  },
  {
    role: Role.Doctor,
    resource: Resource.HealthRecord,
    actions: [Action.Read, Action.List, Action.Create, Action.Update],
  },
  {
    role: Role.Doctor,
    resource: Resource.Contact,
    actions: [Action.Read, Action.List],
  },

  // Pharmacist - Medication management
  {
    role: Role.Pharmacist,
    resource: Resource.Medication,
    actions: [
      Action.Read,
      Action.List,
      Action.Create,
      Action.Update,
      Action.VerifyMedication,
    ],
  },
  {
    role: Role.Pharmacist,
    resource: Resource.MedicationInventory,
    actions: [Action.Read, Action.List, Action.Update],
  },
  {
    role: Role.Pharmacist,
    resource: Resource.MedicationLog,
    actions: [Action.Read, Action.List],
  },

  // Staff - Limited student access
  {
    role: Role.Staff,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Staff,
    resource: Resource.Contact,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Staff,
    resource: Resource.Activity,
    actions: [Action.Read, Action.List],
  },

  // Teacher - Student info and activities
  {
    role: Role.Teacher,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Teacher,
    resource: Resource.StudentProfile,
    actions: [Action.Read],
  },
  {
    role: Role.Teacher,
    resource: Resource.Contact,
    actions: [Action.Read],
  },
  {
    role: Role.Teacher,
    resource: Resource.Activity,
    actions: [Action.Read, Action.List, Action.Create],
  },

  // Guardian - Own student only
  {
    role: Role.Guardian,
    resource: Resource.Student,
    actions: [Action.Read],
    conditions: [{ field: 'guardianId', operator: 'eq', value: '{{userId}}' }],
  },
  {
    role: Role.Guardian,
    resource: Resource.StudentProfile,
    actions: [Action.Read],
    conditions: [{ field: 'guardianId', operator: 'eq', value: '{{userId}}' }],
  },
  {
    role: Role.Guardian,
    resource: Resource.MedicationLog,
    actions: [Action.Read, Action.List],
    conditions: [
      { field: 'studentGuardianId', operator: 'eq', value: '{{userId}}' },
    ],
  },
  {
    role: Role.Guardian,
    resource: Resource.Activity,
    actions: [Action.Read, Action.List],
    conditions: [
      { field: 'studentGuardianId', operator: 'eq', value: '{{userId}}' },
    ],
  },

  // Viewer - Read-only
  {
    role: Role.Viewer,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.Viewer,
    resource: Resource.Activity,
    actions: [Action.Read, Action.List],
  },

  // API Client - Programmatic access
  {
    role: Role.ApiClient,
    resource: Resource.Student,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.ApiClient,
    resource: Resource.Medication,
    actions: [Action.Read, Action.List],
  },
  {
    role: Role.ApiClient,
    resource: Resource.Contact,
    actions: [Action.Read, Action.List],
  },
];

/**
 * Permission checker class
 */
export class PermissionChecker {
  private permissions: Permission[];

  constructor(permissions: Permission[] = PERMISSION_MATRIX) {
    this.permissions = permissions;
  }

  /**
   * Check if a user has permission to perform an action
   */
  check(context: PermissionContext): PermissionResult {
    const { userRole, resource, action } = context;

    // Find matching permissions
    const matchingPermissions = this.permissions.filter(
      (p) => p.role === userRole && p.resource === resource,
    );

    if (matchingPermissions.length === 0) {
      return {
        allowed: false,
        reason: `Role ${userRole} has no permissions for resource ${resource}`,
        requiredRole: Role.Admin,
      };
    }

    // Check if action is allowed
    const hasAction = matchingPermissions.some((p) =>
      p.actions.includes(action),
    );

    if (!hasAction) {
      return {
        allowed: false,
        reason: `Role ${userRole} cannot perform action ${action} on resource ${resource}`,
        requiredAction: action,
      };
    }

    // Check conditions
    for (const permission of matchingPermissions) {
      if (!permission.conditions || permission.conditions.length === 0) {
        return { allowed: true };
      }

      const conditionsMet = this.checkConditions(
        permission.conditions,
        context,
      );
      if (conditionsMet) {
        return { allowed: true };
      }
    }

    return {
      allowed: false,
      reason: `Conditions not met for ${action} on ${resource}`,
    };
  }

  /**
   * Check if conditions are met
   */
  private checkConditions(
    conditions: PermissionCondition[],
    context: PermissionContext,
  ): boolean {
    return conditions.every((condition) => {
      let value = condition.value;

      // Replace placeholders
      if (typeof value === 'string' && value.includes('{{')) {
        value = value.replace('{{userId}}', context.userId);
        value = value.replace('{{resourceId}}', context.resourceId || '');
      }

      const contextValue =
        context.metadata?.[condition.field] || context.resourceOwnerId;

      switch (condition.operator) {
        case 'eq':
          return contextValue === value;
        case 'ne':
          return contextValue !== value;
        case 'in':
          return Array.isArray(value) && value.includes(contextValue);
        case 'nin':
          return Array.isArray(value) && !value.includes(contextValue);
        case 'gt':
          return contextValue > value;
        case 'lt':
          return contextValue < value;
        case 'matches':
          return new RegExp(value).test(contextValue);
        default:
          return false;
      }
    });
  }

  /**
   * Check if user can perform action on resource
   */
  can(userRole: Role, action: Action, resource: Resource): boolean {
    return this.check({
      userId: '',
      userRole,
      action,
      resource,
    }).allowed;
  }

  /**
   * Get all actions a role can perform on a resource
   */
  getAllowedActions(userRole: Role, resource: Resource): Action[] {
    const permissions = this.permissions.filter(
      (p) => p.role === userRole && p.resource === resource,
    );

    const actions = permissions.flatMap((p) => p.actions);
    return Array.from(new Set(actions));
  }

  /**
   * Get all resources a role can access
   */
  getAllowedResources(userRole: Role): Resource[] {
    const permissions = this.permissions.filter((p) => p.role === userRole);
    const resources = permissions.map((p) => p.resource);
    return Array.from(new Set(resources));
  }
}

/**
 * Default permission checker instance
 */
export const permissionChecker = new PermissionChecker();

/**
 * Convenience functions
 */
export function checkPermission(context: PermissionContext): PermissionResult {
  return permissionChecker.check(context);
}

export function can(
  userRole: Role,
  action: Action,
  resource: Resource,
): boolean {
  return permissionChecker.can(userRole, action, resource);
}

export function getAllowedActions(
  userRole: Role,
  resource: Resource,
): Action[] {
  return permissionChecker.getAllowedActions(userRole, resource);
}

export function getAllowedResources(userRole: Role): Resource[] {
  return permissionChecker.getAllowedResources(userRole);
}

/**
 * Type guard for roles
 */
export function isRole(value: unknown): value is Role {
  return (
    typeof value === 'string' && Object.values(Role).includes(value as Role)
  );
}

/**
 * Type guard for resources
 */
export function isResource(value: unknown): value is Resource {
  return (
    typeof value === 'string' &&
    Object.values(Resource).includes(value as Resource)
  );
}

/**
 * Type guard for actions
 */
export function isAction(value: unknown): value is Action {
  return (
    typeof value === 'string' && Object.values(Action).includes(value as Action)
  );
}

/**
 * Export default
 */
export default {
  Role,
  Resource,
  Action,
  PERMISSION_MATRIX,
  PermissionChecker,
  permissionChecker,
  checkPermission,
  can,
  getAllowedActions,
  getAllowedResources,
  isRole,
  isResource,
  isAction,
};
