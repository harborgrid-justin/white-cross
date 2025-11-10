/**
 * Role-Based Access Control (RBAC) Service
 *
 * HIPAA Requirement: Access Control (§164.312(a)(1))
 *
 * Features:
 * - Hierarchical role system
 * - Fine-grained permissions
 * - Dynamic role assignment
 * - Permission inheritance
 * - Resource-based access control
 * - Temporal permissions (time-limited access)
 *
 * @module rbac.service
 * @hipaa-requirement §164.312(a)(1) - Access Control
 */

import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

export enum UserRole {
  // Administrative Roles
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SECURITY_OFFICER = 'security_officer',
  COMPLIANCE_OFFICER = 'compliance_officer',

  // Clinical Roles
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  MEDICAL_ASSISTANT = 'medical_assistant',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  RADIOLOGIST = 'radiologist',

  // Administrative Staff
  BILLING = 'billing',
  RECEPTIONIST = 'receptionist',
  MEDICAL_RECORDS = 'medical_records',

  // System Roles
  SYSTEM_INTEGRATION = 'system_integration',
  API_USER = 'api_user',
  READONLY = 'readonly',

  // Patient Role
  PATIENT = 'patient',
}

export enum Permission {
  // PHI Permissions
  PHI_READ = 'phi:read',
  PHI_WRITE = 'phi:write',
  PHI_DELETE = 'phi:delete',
  PHI_EXPORT = 'phi:export',
  PHI_PRINT = 'phi:print',

  // User Management
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  USERS_ADMIN = 'users:admin',

  // Medical Records
  MEDICAL_RECORDS_READ = 'medical_records:read',
  MEDICAL_RECORDS_WRITE = 'medical_records:write',
  MEDICAL_RECORDS_DELETE = 'medical_records:delete',

  // Prescriptions
  PRESCRIPTIONS_READ = 'prescriptions:read',
  PRESCRIPTIONS_WRITE = 'prescriptions:write',
  PRESCRIPTIONS_APPROVE = 'prescriptions:approve',

  // Lab Results
  LAB_RESULTS_READ = 'lab_results:read',
  LAB_RESULTS_WRITE = 'lab_results:write',
  LAB_RESULTS_APPROVE = 'lab_results:approve',

  // Billing
  BILLING_READ = 'billing:read',
  BILLING_WRITE = 'billing:write',

  // Audit & Compliance
  AUDIT_READ = 'audit:read',
  COMPLIANCE_READ = 'compliance:read',
  COMPLIANCE_WRITE = 'compliance:write',

  // System Administration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_ADMIN = 'system:admin',

  // Emergency Access
  EMERGENCY_ACCESS = 'emergency:access',
}

export interface RoleDefinition {
  role: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: UserRole[];
  constraints?: RoleConstraints;
}

export interface RoleConstraints {
  requiresMFA: boolean;
  requiresEmergencyAccess: boolean;
  maxSessionDuration?: number; // seconds
  allowedIPs?: string[];
  allowedTimeRanges?: TimeRange[];
}

export interface TimeRange {
  startHour: number;
  endHour: number;
  days: number[]; // 0-6 (Sunday-Saturday)
}

export interface UserRoleAssignment {
  userId: string;
  roles: UserRole[];
  customPermissions: Permission[];
  temporaryPermissions: TemporaryPermission[];
  assignedAt: Date;
  assignedBy: string;
  expiresAt?: Date;
}

export interface TemporaryPermission {
  permission: Permission;
  grantedAt: Date;
  expiresAt: Date;
  grantedBy: string;
  reason: string;
}

@Injectable()
export class RBACService {
  private readonly logger = new Logger(RBACService.name);

  private roleDefinitions: Map<UserRole, RoleDefinition> = new Map();

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.initializeRoleDefinitions();
  }

  /**
   * Initialize role definitions with permissions
   */
  private initializeRoleDefinitions(): void {
    // Super Admin - Full system access
    this.roleDefinitions.set(UserRole.SUPER_ADMIN, {
      role: UserRole.SUPER_ADMIN,
      displayName: 'Super Administrator',
      description: 'Full system access with no restrictions',
      permissions: Object.values(Permission),
      constraints: {
        requiresMFA: true,
        requiresEmergencyAccess: false,
      },
    });

    // Admin - Administrative access
    this.roleDefinitions.set(UserRole.ADMIN, {
      role: UserRole.ADMIN,
      displayName: 'Administrator',
      description: 'Administrative access to system configuration',
      permissions: [
        Permission.USERS_READ,
        Permission.USERS_WRITE,
        Permission.AUDIT_READ,
        Permission.SYSTEM_CONFIG,
      ],
      constraints: {
        requiresMFA: true,
        requiresEmergencyAccess: false,
      },
    });

    // Physician - Full clinical access
    this.roleDefinitions.set(UserRole.PHYSICIAN, {
      role: UserRole.PHYSICIAN,
      displayName: 'Physician',
      description: 'Full access to patient medical records',
      permissions: [
        Permission.PHI_READ,
        Permission.PHI_WRITE,
        Permission.MEDICAL_RECORDS_READ,
        Permission.MEDICAL_RECORDS_WRITE,
        Permission.PRESCRIPTIONS_READ,
        Permission.PRESCRIPTIONS_WRITE,
        Permission.PRESCRIPTIONS_APPROVE,
        Permission.LAB_RESULTS_READ,
      ],
      constraints: {
        requiresMFA: true,
        requiresEmergencyAccess: false,
      },
    });

    // Nurse - Clinical support access
    this.roleDefinitions.set(UserRole.NURSE, {
      role: UserRole.NURSE,
      displayName: 'Nurse',
      description: 'Clinical support and patient care access',
      permissions: [
        Permission.PHI_READ,
        Permission.PHI_WRITE,
        Permission.MEDICAL_RECORDS_READ,
        Permission.MEDICAL_RECORDS_WRITE,
        Permission.PRESCRIPTIONS_READ,
        Permission.LAB_RESULTS_READ,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    // Pharmacist
    this.roleDefinitions.set(UserRole.PHARMACIST, {
      role: UserRole.PHARMACIST,
      displayName: 'Pharmacist',
      description: 'Prescription and medication access',
      permissions: [
        Permission.PRESCRIPTIONS_READ,
        Permission.PRESCRIPTIONS_WRITE,
        Permission.PHI_READ,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    // Lab Technician
    this.roleDefinitions.set(UserRole.LAB_TECHNICIAN, {
      role: UserRole.LAB_TECHNICIAN,
      displayName: 'Lab Technician',
      description: 'Lab results and testing access',
      permissions: [
        Permission.LAB_RESULTS_READ,
        Permission.LAB_RESULTS_WRITE,
        Permission.PHI_READ,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    // Billing
    this.roleDefinitions.set(UserRole.BILLING, {
      role: UserRole.BILLING,
      displayName: 'Billing Staff',
      description: 'Billing and financial records access',
      permissions: [
        Permission.BILLING_READ,
        Permission.BILLING_WRITE,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    // Read-Only
    this.roleDefinitions.set(UserRole.READONLY, {
      role: UserRole.READONLY,
      displayName: 'Read-Only User',
      description: 'Limited read-only access',
      permissions: [
        Permission.MEDICAL_RECORDS_READ,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    // Patient
    this.roleDefinitions.set(UserRole.PATIENT, {
      role: UserRole.PATIENT,
      displayName: 'Patient',
      description: 'Patient portal access (own records only)',
      permissions: [
        Permission.MEDICAL_RECORDS_READ,
        Permission.PRESCRIPTIONS_READ,
        Permission.LAB_RESULTS_READ,
      ],
      constraints: {
        requiresMFA: false,
        requiresEmergencyAccess: false,
      },
    });

    this.logger.log(`RBAC initialized with ${this.roleDefinitions.size} role definitions`);
  }

  /**
   * Assign role to user
   * HIPAA: Track role assignments for audit
   */
  async assignRole(
    userId: string,
    role: UserRole,
    assignedBy: string,
    expiresAt?: Date,
  ): Promise<void> {
    const assignment = await this.getUserRoleAssignment(userId);

    if (!assignment.roles.includes(role)) {
      assignment.roles.push(role);
    }

    assignment.assignedBy = assignedBy;
    assignment.assignedAt = new Date();

    if (expiresAt) {
      assignment.expiresAt = expiresAt;
    }

    await this.saveUserRoleAssignment(userId, assignment);

    this.logger.log(`Role ${role} assigned to user ${userId} by ${assignedBy}`);
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, role: UserRole): Promise<void> {
    const assignment = await this.getUserRoleAssignment(userId);

    assignment.roles = assignment.roles.filter(r => r !== role);

    await this.saveUserRoleAssignment(userId, assignment);

    this.logger.log(`Role ${role} removed from user ${userId}`);
  }

  /**
   * Grant custom permission to user
   */
  async grantPermission(
    userId: string,
    permission: Permission,
    grantedBy: string,
  ): Promise<void> {
    const assignment = await this.getUserRoleAssignment(userId);

    if (!assignment.customPermissions.includes(permission)) {
      assignment.customPermissions.push(permission);
    }

    assignment.assignedBy = grantedBy;
    assignment.assignedAt = new Date();

    await this.saveUserRoleAssignment(userId, assignment);

    this.logger.log(`Permission ${permission} granted to user ${userId}`);
  }

  /**
   * Revoke custom permission from user
   */
  async revokePermission(userId: string, permission: Permission): Promise<void> {
    const assignment = await this.getUserRoleAssignment(userId);

    assignment.customPermissions = assignment.customPermissions.filter(p => p !== permission);

    await this.saveUserRoleAssignment(userId, assignment);

    this.logger.log(`Permission ${permission} revoked from user ${userId}`);
  }

  /**
   * Grant temporary permission (time-limited)
   * HIPAA: Support temporary access for specific tasks
   */
  async grantTemporaryPermission(
    userId: string,
    permission: Permission,
    durationSeconds: number,
    grantedBy: string,
    reason: string,
  ): Promise<void> {
    const assignment = await this.getUserRoleAssignment(userId);

    const temporaryPermission: TemporaryPermission = {
      permission,
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + durationSeconds * 1000),
      grantedBy,
      reason,
    };

    assignment.temporaryPermissions.push(temporaryPermission);

    await this.saveUserRoleAssignment(userId, assignment);

    this.logger.log(
      `Temporary permission ${permission} granted to user ${userId} for ${durationSeconds}s`,
    );
  }

  /**
   * Check if user has permission
   * HIPAA: Enforce permission-based access control
   */
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the required permissions
   */
  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.some(p => userPermissions.includes(p));
  }

  /**
   * Check if user has all required permissions
   */
  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.every(p => userPermissions.includes(p));
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const assignment = await this.getUserRoleAssignment(userId);

    const permissions: Set<Permission> = new Set();

    // Add role-based permissions
    for (const role of assignment.roles) {
      const roleDef = this.roleDefinitions.get(role);

      if (roleDef) {
        roleDef.permissions.forEach(p => permissions.add(p));

        // Add inherited permissions
        if (roleDef.inheritsFrom) {
          for (const inheritedRole of roleDef.inheritsFrom) {
            const inheritedRoleDef = this.roleDefinitions.get(inheritedRole);
            if (inheritedRoleDef) {
              inheritedRoleDef.permissions.forEach(p => permissions.add(p));
            }
          }
        }
      }
    }

    // Add custom permissions
    assignment.customPermissions.forEach(p => permissions.add(p));

    // Add valid temporary permissions
    const now = new Date();
    assignment.temporaryPermissions
      .filter(tp => new Date(tp.expiresAt) > now)
      .forEach(tp => permissions.add(tp.permission));

    return Array.from(permissions);
  }

  /**
   * Get role definition
   */
  getRoleDefinition(role: UserRole): RoleDefinition | undefined {
    return this.roleDefinitions.get(role);
  }

  /**
   * Get all role definitions
   */
  getAllRoleDefinitions(): RoleDefinition[] {
    return Array.from(this.roleDefinitions.values());
  }

  /**
   * Get user role assignment
   */
  private async getUserRoleAssignment(userId: string): Promise<UserRoleAssignment> {
    const data = await this.redis.get(`rbac:user:${userId}`);

    if (data) {
      return JSON.parse(data);
    }

    // Default assignment
    return {
      userId,
      roles: [],
      customPermissions: [],
      temporaryPermissions: [],
      assignedAt: new Date(),
      assignedBy: 'system',
    };
  }

  /**
   * Save user role assignment
   */
  private async saveUserRoleAssignment(
    userId: string,
    assignment: UserRoleAssignment,
  ): Promise<void> {
    // Clean up expired temporary permissions
    const now = new Date();
    assignment.temporaryPermissions = assignment.temporaryPermissions.filter(
      tp => new Date(tp.expiresAt) > now,
    );

    await this.redis.set(`rbac:user:${userId}`, JSON.stringify(assignment));
  }

  /**
   * Get role constraints
   */
  async getRoleConstraints(userId: string): Promise<RoleConstraints | null> {
    const assignment = await this.getUserRoleAssignment(userId);

    // Merge constraints from all roles (most restrictive wins)
    let requiresMFA = false;
    let requiresEmergencyAccess = false;

    for (const role of assignment.roles) {
      const roleDef = this.roleDefinitions.get(role);

      if (roleDef?.constraints) {
        requiresMFA = requiresMFA || roleDef.constraints.requiresMFA;
        requiresEmergencyAccess = requiresEmergencyAccess || roleDef.constraints.requiresEmergencyAccess;
      }
    }

    return {
      requiresMFA,
      requiresEmergencyAccess,
    };
  }
}

export default RBACService;
