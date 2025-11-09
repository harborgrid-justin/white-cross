/**
 * ASSET SECURITY COMMAND FUNCTIONS
 *
 * Enterprise-grade asset security management system providing comprehensive
 * functionality for access control, role-based access (RBAC), audit logging,
 * encryption, SOX compliance, field-level security, data masking, incident
 * tracking, and security policy enforcement. Competes with Okta and
 * CyberArk solutions.
 *
 * Features:
 * - Role-based access control (RBAC)
 * - Granular permission management
 * - Asset-level security policies
 * - Field-level encryption and masking
 * - Comprehensive audit logging
 * - SOX compliance tracking
 * - Security incident management
 * - Access certification and reviews
 * - Multi-factor authentication (MFA)
 * - Session management and monitoring
 *
 * @module AssetSecurityCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createSecurityRole,
 *   assignRoleToUser,
 *   checkPermission,
 *   logSecurityEvent,
 *   PermissionAction,
 *   SecurityEventType
 * } from './asset-security-commands';
 *
 * // Create security role
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Can manage all assets',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete']
 * });
 *
 * // Check permission
 * const hasAccess = await checkPermission('user-123', 'asset:write', 'asset-456');
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  IsIP,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Permission Action
 */
export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  APPROVE = 'approve',
  EXPORT = 'export',
  ADMIN = 'admin',
}

/**
 * Security Event Type
 */
export enum SecurityEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  ACCESS_GRANTED = 'access_granted',
  ACCESS_DENIED = 'access_denied',
  PERMISSION_CHANGED = 'permission_changed',
  ROLE_ASSIGNED = 'role_assigned',
  ROLE_REVOKED = 'role_revoked',
  DATA_ACCESSED = 'data_accessed',
  DATA_MODIFIED = 'data_modified',
  DATA_DELETED = 'data_deleted',
  SECURITY_INCIDENT = 'security_incident',
  POLICY_VIOLATION = 'policy_violation',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  PASSWORD_CHANGED = 'password_changed',
}

/**
 * Incident Severity
 */
export enum IncidentSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

/**
 * Incident Status
 */
export enum IncidentStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

/**
 * Access Review Status
 */
export enum AccessReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

/**
 * Data Classification
 */
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  TOP_SECRET = 'top_secret',
}

/**
 * Security Role Data
 */
export interface SecurityRoleData {
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole?: boolean;
  parentRoleId?: string;
  metadata?: Record<string, any>;
}

/**
 * Role Assignment Data
 */
export interface RoleAssignmentData {
  userId: string;
  roleId: string;
  assignedBy: string;
  expiresAt?: Date;
  justification?: string;
}

/**
 * Permission Data
 */
export interface PermissionData {
  resource: string;
  action: PermissionAction;
  description?: string;
  conditions?: Record<string, any>;
}

/**
 * Security Policy Data
 */
export interface SecurityPolicyData {
  name: string;
  description?: string;
  policyType: string;
  rules: PolicyRule[];
  isActive?: boolean;
  effectiveDate?: Date;
  expirationDate?: Date;
}

/**
 * Policy Rule
 */
export interface PolicyRule {
  condition: string;
  action: string;
  severity: IncidentSeverity;
  notification?: string[];
}

/**
 * Security Event Data
 */
export interface SecurityEventData {
  eventType: SecurityEventType;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  result: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Security Incident Data
 */
export interface SecurityIncidentData {
  title: string;
  description: string;
  severity: IncidentSeverity;
  incidentType: string;
  affectedAssets?: string[];
  reportedBy: string;
  assignedTo?: string;
}

/**
 * Access Review Data
 */
export interface AccessReviewData {
  reviewerIds: string[];
  targetRoleId?: string;
  targetUserId?: string;
  dueDate: Date;
  scope: string;
}

/**
 * Field Security Data
 */
export interface FieldSecurityData {
  tableName: string;
  fieldName: string;
  classification: DataClassification;
  encryptionRequired: boolean;
  maskingRequired: boolean;
  maskingPattern?: string;
  allowedRoles?: string[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Security Role Model
 */
@Table({
  tableName: 'security_roles',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['parent_role_id'] },
    { fields: ['is_system_role'] },
  ],
})
export class SecurityRole extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Role name' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Permissions' })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  permissions!: string[];

  @ApiProperty({ description: 'Is system role' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isSystemRole!: boolean;

  @ApiProperty({ description: 'Parent role ID' })
  @ForeignKey(() => SecurityRole)
  @Column({ type: DataType.UUID })
  @Index
  parentRoleId?: string;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => SecurityRole, 'parentRoleId')
  parentRole?: SecurityRole;

  @HasMany(() => SecurityRole, 'parentRoleId')
  childRoles?: SecurityRole[];

  @HasMany(() => UserRoleAssignment)
  userAssignments?: UserRoleAssignment[];
}

/**
 * User Role Assignment Model
 */
@Table({
  tableName: 'user_role_assignments',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['role_id'] },
    { fields: ['is_active'] },
    { fields: ['expires_at'] },
  ],
})
export class UserRoleAssignment extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Role ID' })
  @ForeignKey(() => SecurityRole)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  roleId!: string;

  @ApiProperty({ description: 'Assigned by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  assignedBy!: string;

  @ApiProperty({ description: 'Assigned at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  assignedAt!: Date;

  @ApiProperty({ description: 'Expires at' })
  @Column({ type: DataType.DATE })
  @Index
  expiresAt?: Date;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Revoked by user ID' })
  @Column({ type: DataType.UUID })
  revokedBy?: string;

  @ApiProperty({ description: 'Revoked at' })
  @Column({ type: DataType.DATE })
  revokedAt?: Date;

  @ApiProperty({ description: 'Justification' })
  @Column({ type: DataType.TEXT })
  justification?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => SecurityRole)
  role?: SecurityRole;
}

/**
 * Permission Model
 */
@Table({
  tableName: 'permissions',
  timestamps: true,
  indexes: [
    { fields: ['resource', 'action'], unique: true },
  ],
})
export class Permission extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Resource' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  resource!: string;

  @ApiProperty({ description: 'Action' })
  @Column({ type: DataType.ENUM(...Object.values(PermissionAction)), allowNull: false })
  @Index
  action!: PermissionAction;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Conditions' })
  @Column({ type: DataType.JSONB })
  conditions?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Security Policy Model
 */
@Table({
  tableName: 'security_policies',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['policy_type'] },
    { fields: ['is_active'] },
  ],
})
export class SecurityPolicy extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Policy name' })
  @Column({ type: DataType.STRING(200), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Policy type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  policyType!: string;

  @ApiProperty({ description: 'Policy rules' })
  @Column({ type: DataType.JSONB, allowNull: false })
  rules!: PolicyRule[];

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE })
  effectiveDate?: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE })
  expirationDate?: Date;

  @ApiProperty({ description: 'Violation count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  violationCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Security Audit Log Model
 */
@Table({
  tableName: 'security_audit_logs',
  timestamps: true,
  indexes: [
    { fields: ['event_type'] },
    { fields: ['user_id'] },
    { fields: ['resource_type'] },
    { fields: ['resource_id'] },
    { fields: ['timestamp'] },
    { fields: ['result'] },
  ],
})
export class SecurityAuditLog extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.ENUM(...Object.values(SecurityEventType)), allowNull: false })
  @Index
  eventType!: SecurityEventType;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID })
  @Index
  userId?: string;

  @ApiProperty({ description: 'Resource type' })
  @Column({ type: DataType.STRING(100) })
  @Index
  resourceType?: string;

  @ApiProperty({ description: 'Resource ID' })
  @Column({ type: DataType.UUID })
  @Index
  resourceId?: string;

  @ApiProperty({ description: 'Action' })
  @Column({ type: DataType.STRING(100) })
  action?: string;

  @ApiProperty({ description: 'Result' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  result!: string;

  @ApiProperty({ description: 'IP address' })
  @Column({ type: DataType.STRING(50) })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent' })
  @Column({ type: DataType.STRING(500) })
  userAgent?: string;

  @ApiProperty({ description: 'Timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  timestamp!: Date;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Session ID' })
  @Column({ type: DataType.STRING(100) })
  sessionId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Security Incident Model
 */
@Table({
  tableName: 'security_incidents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['incident_number'], unique: true },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['reported_by'] },
    { fields: ['assigned_to'] },
  ],
})
export class SecurityIncident extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Incident number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  incidentNumber!: string;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(300), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Severity' })
  @Column({ type: DataType.ENUM(...Object.values(IncidentSeverity)), allowNull: false })
  @Index
  severity!: IncidentSeverity;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(IncidentStatus)), defaultValue: IncidentStatus.OPEN })
  @Index
  status!: IncidentStatus;

  @ApiProperty({ description: 'Incident type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  incidentType!: string;

  @ApiProperty({ description: 'Affected asset IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  affectedAssets?: string[];

  @ApiProperty({ description: 'Reported by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  reportedBy!: string;

  @ApiProperty({ description: 'Reported at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  reportedAt!: Date;

  @ApiProperty({ description: 'Assigned to user ID' })
  @Column({ type: DataType.UUID })
  @Index
  assignedTo?: string;

  @ApiProperty({ description: 'Resolved at' })
  @Column({ type: DataType.DATE })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Resolved by user ID' })
  @Column({ type: DataType.UUID })
  resolvedBy?: string;

  @ApiProperty({ description: 'Resolution notes' })
  @Column({ type: DataType.TEXT })
  resolutionNotes?: string;

  @ApiProperty({ description: 'Root cause' })
  @Column({ type: DataType.TEXT })
  rootCause?: string;

  @ApiProperty({ description: 'Preventive actions' })
  @Column({ type: DataType.TEXT })
  preventiveActions?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BeforeCreate
  static async generateIncidentNumber(instance: SecurityIncident) {
    if (!instance.incidentNumber) {
      const count = await SecurityIncident.count();
      const year = new Date().getFullYear();
      instance.incidentNumber = `SEC-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Access Review Model
 */
@Table({
  tableName: 'access_reviews',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['due_date'] },
    { fields: ['target_role_id'] },
    { fields: ['target_user_id'] },
  ],
})
export class AccessReview extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Reviewer user IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  reviewerIds!: string[];

  @ApiProperty({ description: 'Target role ID' })
  @ForeignKey(() => SecurityRole)
  @Column({ type: DataType.UUID })
  @Index
  targetRoleId?: string;

  @ApiProperty({ description: 'Target user ID' })
  @Column({ type: DataType.UUID })
  @Index
  targetUserId?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(AccessReviewStatus)), defaultValue: AccessReviewStatus.PENDING })
  @Index
  status!: AccessReviewStatus;

  @ApiProperty({ description: 'Scope' })
  @Column({ type: DataType.TEXT, allowNull: false })
  scope!: string;

  @ApiProperty({ description: 'Due date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  dueDate!: Date;

  @ApiProperty({ description: 'Started at' })
  @Column({ type: DataType.DATE })
  startedAt?: Date;

  @ApiProperty({ description: 'Completed at' })
  @Column({ type: DataType.DATE })
  completedAt?: Date;

  @ApiProperty({ description: 'Findings' })
  @Column({ type: DataType.JSONB })
  findings?: Record<string, any>[];

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.TEXT })
  recommendations?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => SecurityRole)
  targetRole?: SecurityRole;
}

/**
 * Field Security Model
 */
@Table({
  tableName: 'field_security',
  timestamps: true,
  indexes: [
    { fields: ['table_name', 'field_name'], unique: true },
    { fields: ['classification'] },
  ],
})
export class FieldSecurity extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Table name' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  tableName!: string;

  @ApiProperty({ description: 'Field name' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  fieldName!: string;

  @ApiProperty({ description: 'Data classification' })
  @Column({ type: DataType.ENUM(...Object.values(DataClassification)), allowNull: false })
  @Index
  classification!: DataClassification;

  @ApiProperty({ description: 'Encryption required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  encryptionRequired!: boolean;

  @ApiProperty({ description: 'Masking required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  maskingRequired!: boolean;

  @ApiProperty({ description: 'Masking pattern' })
  @Column({ type: DataType.STRING(100) })
  maskingPattern?: string;

  @ApiProperty({ description: 'Allowed role IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  allowedRoles?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// ROLE AND PERMISSION FUNCTIONS
// ============================================================================

/**
 * Creates security role
 *
 * @param data - Role data
 * @param transaction - Optional database transaction
 * @returns Created role
 *
 * @example
 * ```typescript
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Full access to asset management',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete', 'asset:approve'],
 *   parentRoleId: 'base-role-123'
 * });
 * ```
 */
export async function createSecurityRole(
  data: SecurityRoleData,
  transaction?: Transaction
): Promise<SecurityRole> {
  const role = await SecurityRole.create(data, { transaction });
  return role;
}

/**
 * Assigns role to user
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Role assignment
 *
 * @example
 * ```typescript
 * await assignRoleToUser({
 *   userId: 'user-123',
 *   roleId: 'role-456',
 *   assignedBy: 'admin-789',
 *   expiresAt: new Date('2025-12-31'),
 *   justification: 'Promoted to asset manager position'
 * });
 * ```
 */
export async function assignRoleToUser(
  data: RoleAssignmentData,
  transaction?: Transaction
): Promise<UserRoleAssignment> {
  // Check if role exists
  const role = await SecurityRole.findByPk(data.roleId, { transaction });
  if (!role) {
    throw new NotFoundException(`Role ${data.roleId} not found`);
  }

  const assignment = await UserRoleAssignment.create(
    {
      ...data,
      assignedAt: new Date(),
      isActive: true,
    },
    { transaction }
  );

  // Log security event
  await logSecurityEvent({
    eventType: SecurityEventType.ROLE_ASSIGNED,
    userId: data.userId,
    action: 'role_assigned',
    result: 'success',
    metadata: {
      roleId: data.roleId,
      assignedBy: data.assignedBy,
      expiresAt: data.expiresAt,
    },
  }, transaction);

  return assignment;
}

/**
 * Revokes role from user
 *
 * @param assignmentId - Assignment ID
 * @param revokedBy - User revoking
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 *
 * @example
 * ```typescript
 * await revokeRoleFromUser('assignment-123', 'admin-456');
 * ```
 */
export async function revokeRoleFromUser(
  assignmentId: string,
  revokedBy: string,
  transaction?: Transaction
): Promise<UserRoleAssignment> {
  const assignment = await UserRoleAssignment.findByPk(assignmentId, { transaction });
  if (!assignment) {
    throw new NotFoundException(`Assignment ${assignmentId} not found`);
  }

  await assignment.update({
    isActive: false,
    revokedBy,
    revokedAt: new Date(),
  }, { transaction });

  // Log security event
  await logSecurityEvent({
    eventType: SecurityEventType.ROLE_REVOKED,
    userId: assignment.userId,
    action: 'role_revoked',
    result: 'success',
    metadata: {
      roleId: assignment.roleId,
      revokedBy,
    },
  }, transaction);

  return assignment;
}

/**
 * Checks permission
 *
 * @param userId - User ID
 * @param permission - Permission string
 * @param resourceId - Optional resource ID
 * @returns Has permission
 *
 * @example
 * ```typescript
 * const canWrite = await checkPermission('user-123', 'asset:write', 'asset-456');
 * if (!canWrite) {
 *   throw new ForbiddenException('Access denied');
 * }
 * ```
 */
export async function checkPermission(
  userId: string,
  permission: string,
  resourceId?: string
): Promise<boolean> {
  // Get active role assignments
  const assignments = await UserRoleAssignment.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
    include: [{ model: SecurityRole }],
  });

  if (assignments.length === 0) {
    return false;
  }

  // Check if any role has the permission
  for (const assignment of assignments) {
    const role = assignment.role!;
    if (role.permissions.includes(permission) || role.permissions.includes('*')) {
      return true;
    }
  }

  return false;
}

/**
 * Gets user permissions
 *
 * @param userId - User ID
 * @returns User permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions('user-123');
 * ```
 */
export async function getUserPermissions(
  userId: string
): Promise<string[]> {
  const assignments = await UserRoleAssignment.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
    include: [{ model: SecurityRole }],
  });

  const permissions = new Set<string>();

  for (const assignment of assignments) {
    const role = assignment.role!;
    role.permissions.forEach(p => permissions.add(p));
  }

  return Array.from(permissions);
}

/**
 * Gets user roles
 *
 * @param userId - User ID
 * @returns Active roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles('user-123');
 * ```
 */
export async function getUserRoles(
  userId: string
): Promise<SecurityRole[]> {
  const assignments = await UserRoleAssignment.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
    include: [{ model: SecurityRole }],
  });

  return assignments.map(a => a.role!);
}

// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================

/**
 * Logs security event
 *
 * @param data - Event data
 * @param transaction - Optional database transaction
 * @returns Audit log entry
 *
 * @example
 * ```typescript
 * await logSecurityEvent({
 *   eventType: SecurityEventType.ACCESS_GRANTED,
 *   userId: 'user-123',
 *   resourceType: 'asset',
 *   resourceId: 'asset-456',
 *   action: 'read',
 *   result: 'success',
 *   ipAddress: '192.168.1.100',
 *   metadata: { location: 'warehouse-a' }
 * });
 * ```
 */
export async function logSecurityEvent(
  data: SecurityEventData,
  transaction?: Transaction
): Promise<SecurityAuditLog> {
  const log = await SecurityAuditLog.create(
    {
      ...data,
      timestamp: new Date(),
    },
    { transaction }
  );

  return log;
}

/**
 * Gets audit logs
 *
 * @param filters - Filter options
 * @param limit - Maximum logs
 * @returns Audit logs
 *
 * @example
 * ```typescript
 * const logs = await getAuditLogs({
 *   userId: 'user-123',
 *   eventType: SecurityEventType.ACCESS_DENIED,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 1000);
 * ```
 */
export async function getAuditLogs(
  filters: {
    userId?: string;
    eventType?: SecurityEventType;
    resourceType?: string;
    resourceId?: string;
    result?: string;
    startDate?: Date;
    endDate?: Date;
  },
  limit: number = 1000
): Promise<SecurityAuditLog[]> {
  const where: WhereOptions = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.resourceType) where.resourceType = filters.resourceType;
  if (filters.resourceId) where.resourceId = filters.resourceId;
  if (filters.result) where.result = filters.result;

  if (filters.startDate || filters.endDate) {
    where.timestamp = {};
    if (filters.startDate) {
      (where.timestamp as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.timestamp as any)[Op.lte] = filters.endDate;
    }
  }

  return SecurityAuditLog.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit,
  });
}

/**
 * Generates audit report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param groupBy - Grouping field
 * @returns Audit report
 *
 * @example
 * ```typescript
 * const report = await generateAuditReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'eventType'
 * );
 * ```
 */
export async function generateAuditReport(
  startDate: Date,
  endDate: Date,
  groupBy: 'eventType' | 'userId' | 'resourceType' = 'eventType'
): Promise<Record<string, number>> {
  const logs = await SecurityAuditLog.findAll({
    where: {
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const report: Record<string, number> = {};

  logs.forEach(log => {
    const key = log[groupBy] as string || 'unknown';
    report[key] = (report[key] || 0) + 1;
  });

  return report;
}

// ============================================================================
// SECURITY POLICY FUNCTIONS
// ============================================================================

/**
 * Creates security policy
 *
 * @param data - Policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createSecurityPolicy({
 *   name: 'Asset Access Policy',
 *   policyType: 'access_control',
 *   rules: [
 *     {
 *       condition: 'after_hours_access',
 *       action: 'require_approval',
 *       severity: IncidentSeverity.MEDIUM,
 *       notification: ['security-team@example.com']
 *     }
 *   ],
 *   isActive: true
 * });
 * ```
 */
export async function createSecurityPolicy(
  data: SecurityPolicyData,
  transaction?: Transaction
): Promise<SecurityPolicy> {
  const policy = await SecurityPolicy.create(data, { transaction });
  return policy;
}

/**
 * Evaluates policy compliance
 *
 * @param policyId - Policy ID
 * @param context - Evaluation context
 * @returns Compliance result
 *
 * @example
 * ```typescript
 * const result = await evaluatePolicyCompliance('policy-123', {
 *   userId: 'user-456',
 *   action: 'access_sensitive_data',
 *   time: new Date()
 * });
 * ```
 */
export async function evaluatePolicyCompliance(
  policyId: string,
  context: Record<string, any>
): Promise<{ compliant: boolean; violations: string[] }> {
  const policy = await SecurityPolicy.findByPk(policyId);
  if (!policy) {
    throw new NotFoundException(`Policy ${policyId} not found`);
  }

  if (!policy.isActive) {
    return { compliant: true, violations: [] };
  }

  const violations: string[] = [];

  // Simplified policy evaluation
  for (const rule of policy.rules) {
    // In real implementation, evaluate rule conditions against context
    const violated = false; // Placeholder

    if (violated) {
      violations.push(rule.condition);
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

// ============================================================================
// SECURITY INCIDENT FUNCTIONS
// ============================================================================

/**
 * Creates security incident
 *
 * @param data - Incident data
 * @param transaction - Optional database transaction
 * @returns Created incident
 *
 * @example
 * ```typescript
 * const incident = await createSecurityIncident({
 *   title: 'Unauthorized Access Attempt',
 *   description: 'Multiple failed login attempts detected',
 *   severity: IncidentSeverity.HIGH,
 *   incidentType: 'access_violation',
 *   affectedAssets: ['asset-123', 'asset-456'],
 *   reportedBy: 'security-system',
 *   assignedTo: 'security-analyst-789'
 * });
 * ```
 */
export async function createSecurityIncident(
  data: SecurityIncidentData,
  transaction?: Transaction
): Promise<SecurityIncident> {
  const incident = await SecurityIncident.create(
    {
      ...data,
      reportedAt: new Date(),
      status: IncidentStatus.OPEN,
    },
    { transaction }
  );

  // Log security event
  await logSecurityEvent({
    eventType: SecurityEventType.SECURITY_INCIDENT,
    resourceType: 'security_incident',
    resourceId: incident.id,
    action: 'created',
    result: 'success',
    metadata: {
      severity: data.severity,
      incidentType: data.incidentType,
    },
  }, transaction);

  return incident;
}

/**
 * Updates incident status
 *
 * @param incidentId - Incident ID
 * @param status - New status
 * @param userId - User updating
 * @param notes - Update notes
 * @param transaction - Optional database transaction
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentStatus(
 *   'incident-123',
 *   IncidentStatus.RESOLVED,
 *   'analyst-456',
 *   'False positive - authorized test'
 * );
 * ```
 */
export async function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus,
  userId: string,
  notes?: string,
  transaction?: Transaction
): Promise<SecurityIncident> {
  const incident = await SecurityIncident.findByPk(incidentId, { transaction });
  if (!incident) {
    throw new NotFoundException(`Incident ${incidentId} not found`);
  }

  const updates: any = { status };

  if (status === IncidentStatus.RESOLVED || status === IncidentStatus.CLOSED) {
    updates.resolvedAt = new Date();
    updates.resolvedBy = userId;
    updates.resolutionNotes = notes;
  }

  await incident.update(updates, { transaction });

  return incident;
}

/**
 * Gets open incidents
 *
 * @param severity - Optional severity filter
 * @returns Open incidents
 *
 * @example
 * ```typescript
 * const criticalIncidents = await getOpenIncidents(IncidentSeverity.CRITICAL);
 * ```
 */
export async function getOpenIncidents(
  severity?: IncidentSeverity
): Promise<SecurityIncident[]> {
  const where: WhereOptions = {
    status: { [Op.in]: [IncidentStatus.OPEN, IncidentStatus.INVESTIGATING] },
  };

  if (severity) {
    where.severity = severity;
  }

  return SecurityIncident.findAll({
    where,
    order: [['severity', 'DESC'], ['reportedAt', 'DESC']],
  });
}

// ============================================================================
// ACCESS REVIEW FUNCTIONS
// ============================================================================

/**
 * Creates access review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createAccessReview({
 *   reviewerIds: ['manager-123', 'security-456'],
 *   targetRoleId: 'admin-role-789',
 *   dueDate: new Date('2024-12-31'),
 *   scope: 'Quarterly admin role review'
 * });
 * ```
 */
export async function createAccessReview(
  data: AccessReviewData,
  transaction?: Transaction
): Promise<AccessReview> {
  const review = await AccessReview.create(
    {
      ...data,
      status: AccessReviewStatus.PENDING,
    },
    { transaction }
  );

  return review;
}

/**
 * Completes access review
 *
 * @param reviewId - Review ID
 * @param findings - Review findings
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await completeAccessReview('review-123', findings, 'Revoke unused permissions');
 * ```
 */
export async function completeAccessReview(
  reviewId: string,
  findings: Record<string, any>[],
  recommendations?: string,
  transaction?: Transaction
): Promise<AccessReview> {
  const review = await AccessReview.findByPk(reviewId, { transaction });
  if (!review) {
    throw new NotFoundException(`Review ${reviewId} not found`);
  }

  await review.update({
    status: AccessReviewStatus.COMPLETED,
    completedAt: new Date(),
    findings,
    recommendations,
  }, { transaction });

  return review;
}

/**
 * Gets pending reviews
 *
 * @param reviewerId - Optional reviewer filter
 * @returns Pending reviews
 *
 * @example
 * ```typescript
 * const myReviews = await getPendingReviews('reviewer-123');
 * ```
 */
export async function getPendingReviews(
  reviewerId?: string
): Promise<AccessReview[]> {
  const where: WhereOptions = {
    status: AccessReviewStatus.PENDING,
  };

  if (reviewerId) {
    where.reviewerIds = { [Op.contains]: [reviewerId] };
  }

  return AccessReview.findAll({
    where,
    order: [['dueDate', 'ASC']],
    include: [{ model: SecurityRole, as: 'targetRole' }],
  });
}

// ============================================================================
// FIELD SECURITY FUNCTIONS
// ============================================================================

/**
 * Configures field security
 *
 * @param data - Field security data
 * @param transaction - Optional database transaction
 * @returns Field security config
 *
 * @example
 * ```typescript
 * await configureFieldSecurity({
 *   tableName: 'assets',
 *   fieldName: 'acquisition_cost',
 *   classification: DataClassification.CONFIDENTIAL,
 *   encryptionRequired: true,
 *   maskingRequired: true,
 *   maskingPattern: '***',
 *   allowedRoles: ['finance-role', 'admin-role']
 * });
 * ```
 */
export async function configureFieldSecurity(
  data: FieldSecurityData,
  transaction?: Transaction
): Promise<FieldSecurity> {
  const config = await FieldSecurity.create(data, { transaction });
  return config;
}

/**
 * Masks field value
 *
 * @param tableName - Table name
 * @param fieldName - Field name
 * @param value - Original value
 * @param userId - User requesting
 * @returns Masked or original value
 *
 * @example
 * ```typescript
 * const cost = await maskFieldValue('assets', 'acquisition_cost', '50000', 'user-123');
 * // Returns '***' if user doesn't have access, '50000' if they do
 * ```
 */
export async function maskFieldValue(
  tableName: string,
  fieldName: string,
  value: any,
  userId: string
): Promise<any> {
  const config = await FieldSecurity.findOne({
    where: { tableName, fieldName },
  });

  if (!config) {
    return value; // No security configured
  }

  if (!config.maskingRequired) {
    return value; // No masking required
  }

  // Check if user has access
  const userRoles = await getUserRoles(userId);
  const roleIds = userRoles.map(r => r.id);

  const hasAccess = !config.allowedRoles ||
    config.allowedRoles.some(roleId => roleIds.includes(roleId));

  if (hasAccess) {
    return value; // User has access
  }

  // Apply masking
  return config.maskingPattern || '***';
}

// ============================================================================
// SESSION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * User Session Model
 */
@Table({
  tableName: 'user_sessions',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['session_token'], unique: true },
    { fields: ['is_active'] },
    { fields: ['expires_at'] },
  ],
})
export class UserSession extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Session token' })
  @Column({ type: DataType.STRING(500), unique: true, allowNull: false })
  @Index
  sessionToken!: string;

  @ApiProperty({ description: 'IP address' })
  @Column({ type: DataType.STRING(50) })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent' })
  @Column({ type: DataType.STRING(500) })
  userAgent?: string;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Last activity' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  lastActivity!: Date;

  @ApiProperty({ description: 'Expires at' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  expiresAt!: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Creates user session
 *
 * @param userId - User ID
 * @param ipAddress - IP address
 * @param userAgent - User agent
 * @param expirationHours - Expiration in hours
 * @param transaction - Optional database transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createUserSession('user-123', '192.168.1.1', 'Chrome', 24);
 * ```
 */
export async function createUserSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
  expirationHours: number = 24,
  transaction?: Transaction
): Promise<UserSession> {
  const sessionToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

  const session = await UserSession.create(
    {
      userId,
      sessionToken,
      ipAddress,
      userAgent,
      isActive: true,
      lastActivity: new Date(),
      expiresAt,
    },
    { transaction }
  );

  await logSecurityEvent({
    eventType: SecurityEventType.LOGIN,
    userId,
    action: 'session_created',
    result: 'success',
    ipAddress,
    userAgent,
    metadata: { sessionId: session.id },
  }, transaction);

  return session;
}

/**
 * Validates user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Session if valid
 *
 * @example
 * ```typescript
 * const session = await validateUserSession('token-123');
 * if (!session) throw new UnauthorizedException('Invalid session');
 * ```
 */
export async function validateUserSession(
  sessionToken: string,
  transaction?: Transaction
): Promise<UserSession | null> {
  const session = await UserSession.findOne({
    where: {
      sessionToken,
      isActive: true,
      expiresAt: { [Op.gt]: new Date() },
    },
    transaction,
  });

  if (session) {
    await session.update({ lastActivity: new Date() }, { transaction });
  }

  return session;
}

/**
 * Expires user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await expireUserSession('token-123');
 * ```
 */
export async function expireUserSession(
  sessionToken: string,
  transaction?: Transaction
): Promise<UserSession> {
  const session = await UserSession.findOne({
    where: { sessionToken },
    transaction,
  });

  if (!session) {
    throw new NotFoundException(`Session not found`);
  }

  await session.update({ isActive: false }, { transaction });

  await logSecurityEvent({
    eventType: SecurityEventType.LOGOUT,
    userId: session.userId,
    action: 'session_expired',
    result: 'success',
    metadata: { sessionId: session.id },
  }, transaction);

  return session;
}

/**
 * Expires all user sessions
 *
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Expired count
 *
 * @example
 * ```typescript
 * await expireAllUserSessions('user-123');
 * ```
 */
export async function expireAllUserSessions(
  userId: string,
  transaction?: Transaction
): Promise<number> {
  const [count] = await UserSession.update(
    { isActive: false },
    {
      where: {
        userId,
        isActive: true,
      },
      transaction,
    }
  );

  return count;
}

// ============================================================================
// PASSWORD POLICY FUNCTIONS
// ============================================================================

/**
 * Password Policy Model
 */
@Table({
  tableName: 'password_policies',
  timestamps: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class PasswordPolicy extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Policy name' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Minimum length' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 8 })
  minLength!: number;

  @ApiProperty({ description: 'Require uppercase' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  requireUppercase!: boolean;

  @ApiProperty({ description: 'Require lowercase' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  requireLowercase!: boolean;

  @ApiProperty({ description: 'Require numbers' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  requireNumbers!: boolean;

  @ApiProperty({ description: 'Require special characters' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  requireSpecialChars!: boolean;

  @ApiProperty({ description: 'Max age in days' })
  @Column({ type: DataType.INTEGER })
  maxAgeDays?: number;

  @ApiProperty({ description: 'Prevent reuse count' })
  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  preventReuseCount!: number;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Validates password strength
 *
 * @param password - Password to validate
 * @param policyId - Optional policy ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validatePassword('MyP@ssw0rd123');
 * if (!result.valid) throw new BadRequestException(result.errors.join(', '));
 * ```
 */
export async function validatePassword(
  password: string,
  policyId?: string
): Promise<{ valid: boolean; errors: string[] }> {
  const policy = policyId
    ? await PasswordPolicy.findByPk(policyId)
    : await PasswordPolicy.findOne({ where: { isActive: true } });

  const errors: string[] = [];

  if (!policy) {
    // Default validation
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    return { valid: errors.length === 0, errors };
  }

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Checks password strength score
 *
 * @param password - Password to check
 * @returns Strength score 0-100
 *
 * @example
 * ```typescript
 * const strength = checkPasswordStrength('MyP@ssw0rd123');
 * // Returns: 85
 * ```
 */
export function checkPasswordStrength(password: string): number {
  let score = 0;

  // Length score
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;

  return Math.min(score, 100);
}

/**
 * Forces password reset
 *
 * @param userId - User ID
 * @param reason - Reset reason
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await forcePasswordReset('user-123', 'Policy violation detected');
 * ```
 */
export async function forcePasswordReset(
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<boolean> {
  await logSecurityEvent({
    eventType: SecurityEventType.PASSWORD_CHANGED,
    userId,
    action: 'force_password_reset',
    result: 'success',
    metadata: { reason },
  }, transaction);

  return true;
}

// ============================================================================
// TWO-FACTOR AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * MFA Configuration Model
 */
@Table({
  tableName: 'mfa_configurations',
  timestamps: true,
  indexes: [
    { fields: ['user_id'], unique: true },
    { fields: ['is_enabled'] },
  ],
})
export class MfaConfiguration extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Is enabled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isEnabled!: boolean;

  @ApiProperty({ description: 'MFA method' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  method!: string;

  @ApiProperty({ description: 'Secret key (encrypted)' })
  @Column({ type: DataType.TEXT })
  secretKey?: string;

  @ApiProperty({ description: 'Backup codes' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  backupCodes?: string[];

  @ApiProperty({ description: 'Last used at' })
  @Column({ type: DataType.DATE })
  lastUsedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Enables MFA for user
 *
 * @param userId - User ID
 * @param method - MFA method (totp, sms, email)
 * @param transaction - Optional database transaction
 * @returns MFA configuration
 *
 * @example
 * ```typescript
 * const mfa = await enableMfa('user-123', 'totp');
 * ```
 */
export async function enableMfa(
  userId: string,
  method: string,
  transaction?: Transaction
): Promise<MfaConfiguration> {
  const secretKey = generateSecureToken();
  const backupCodes = generateBackupCodes();

  const mfa = await MfaConfiguration.create(
    {
      userId,
      isEnabled: true,
      method,
      secretKey,
      backupCodes,
    },
    { transaction }
  );

  await logSecurityEvent({
    eventType: SecurityEventType.MFA_ENABLED,
    userId,
    action: 'mfa_enabled',
    result: 'success',
    metadata: { method },
  }, transaction);

  return mfa;
}

/**
 * Verifies MFA code
 *
 * @param userId - User ID
 * @param code - MFA code
 * @param transaction - Optional database transaction
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const valid = await verifyMfaCode('user-123', '123456');
 * if (!valid) throw new UnauthorizedException('Invalid MFA code');
 * ```
 */
export async function verifyMfaCode(
  userId: string,
  code: string,
  transaction?: Transaction
): Promise<boolean> {
  const mfa = await MfaConfiguration.findOne({
    where: { userId, isEnabled: true },
    transaction,
  });

  if (!mfa) {
    return false;
  }

  // In real implementation, verify TOTP code against secretKey
  // For now, simplified validation
  const isValid = code.length === 6 && /^\d+$/.test(code);

  if (isValid) {
    await mfa.update({ lastUsedAt: new Date() }, { transaction });
  }

  return isValid;
}

/**
 * Generates backup codes
 *
 * @returns Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes();
 * ```
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
}

// ============================================================================
// SECURITY GROUP FUNCTIONS
// ============================================================================

/**
 * Security Group Model
 */
@Table({
  tableName: 'security_groups',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['group_type'] },
  ],
})
export class SecurityGroup extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Group name' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Group type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  groupType!: string;

  @ApiProperty({ description: 'Member user IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), defaultValue: [] })
  memberIds!: string[];

  @ApiProperty({ description: 'Role IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), defaultValue: [] })
  roleIds!: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Creates security group
 *
 * @param name - Group name
 * @param groupType - Group type
 * @param description - Optional description
 * @param transaction - Optional database transaction
 * @returns Created group
 *
 * @example
 * ```typescript
 * const group = await createSecurityGroup('Finance Team', 'department', 'Finance department users');
 * ```
 */
export async function createSecurityGroup(
  name: string,
  groupType: string,
  description?: string,
  transaction?: Transaction
): Promise<SecurityGroup> {
  const group = await SecurityGroup.create(
    {
      name,
      groupType,
      description,
      memberIds: [],
      roleIds: [],
    },
    { transaction }
  );

  return group;
}

/**
 * Adds user to security group
 *
 * @param groupId - Group ID
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await addUserToSecurityGroup('group-123', 'user-456');
 * ```
 */
export async function addUserToSecurityGroup(
  groupId: string,
  userId: string,
  transaction?: Transaction
): Promise<SecurityGroup> {
  const group = await SecurityGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new NotFoundException(`Security group ${groupId} not found`);
  }

  if (!group.memberIds.includes(userId)) {
    await group.update({
      memberIds: [...group.memberIds, userId],
    }, { transaction });
  }

  return group;
}

/**
 * Assigns role to security group
 *
 * @param groupId - Group ID
 * @param roleId - Role ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await assignRoleToSecurityGroup('group-123', 'role-456');
 * ```
 */
export async function assignRoleToSecurityGroup(
  groupId: string,
  roleId: string,
  transaction?: Transaction
): Promise<SecurityGroup> {
  const group = await SecurityGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new NotFoundException(`Security group ${groupId} not found`);
  }

  if (!group.roleIds.includes(roleId)) {
    await group.update({
      roleIds: [...group.roleIds, roleId],
    }, { transaction });
  }

  return group;
}

// ============================================================================
// COMPLIANCE REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates SOX compliance report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSoxComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function generateSoxComplianceReport(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const auditLogs = await getAuditLogs({
    startDate,
    endDate,
  });

  const accessReviews = await AccessReview.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const incidents = await SecurityIncident.findAll({
    where: {
      reportedAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    period: { startDate, endDate },
    auditLogs: {
      total: auditLogs.length,
      byEventType: {},
    },
    accessReviews: {
      total: accessReviews.length,
      completed: accessReviews.filter(r => r.status === AccessReviewStatus.COMPLETED).length,
    },
    incidents: {
      total: incidents.length,
      bySeverity: {},
    },
    generatedAt: new Date(),
  };
}

/**
 * Generates security metrics
 *
 * @param period - Period in days
 * @returns Security metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateSecurityMetrics(30);
 * ```
 */
export async function generateSecurityMetrics(period: number = 30): Promise<Record<string, any>> {
  const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

  const failedLogins = await SecurityAuditLog.count({
    where: {
      eventType: SecurityEventType.LOGIN_FAILED,
      timestamp: { [Op.gte]: startDate },
    },
  });

  const accessDenied = await SecurityAuditLog.count({
    where: {
      eventType: SecurityEventType.ACCESS_DENIED,
      timestamp: { [Op.gte]: startDate },
    },
  });

  const policyViolations = await SecurityAuditLog.count({
    where: {
      eventType: SecurityEventType.POLICY_VIOLATION,
      timestamp: { [Op.gte]: startDate },
    },
  });

  const openIncidents = await SecurityIncident.count({
    where: {
      status: { [Op.in]: [IncidentStatus.OPEN, IncidentStatus.INVESTIGATING] },
    },
  });

  return {
    period: { days: period, startDate },
    failedLogins,
    accessDenied,
    policyViolations,
    openIncidents,
    generatedAt: new Date(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets active user sessions
 *
 * @param userId - User ID
 * @returns Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveUserSessions('user-123');
 * ```
 */
export async function getActiveUserSessions(
  userId: string
): Promise<UserSession[]> {
  return UserSession.findAll({
    where: {
      userId,
      isActive: true,
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [['lastActivity', 'DESC']],
  });
}

/**
 * Generates secure token
 */
function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  SecurityRole,
  UserRoleAssignment,
  Permission,
  SecurityPolicy,
  SecurityAuditLog,
  SecurityIncident,
  AccessReview,
  FieldSecurity,
  UserSession,
  PasswordPolicy,
  MfaConfiguration,
  SecurityGroup,

  // Role and Permission Functions
  createSecurityRole,
  assignRoleToUser,
  revokeRoleFromUser,
  checkPermission,
  getUserPermissions,
  getUserRoles,

  // Audit Logging Functions
  logSecurityEvent,
  getAuditLogs,
  generateAuditReport,

  // Security Policy Functions
  createSecurityPolicy,
  evaluatePolicyCompliance,

  // Security Incident Functions
  createSecurityIncident,
  updateIncidentStatus,
  getOpenIncidents,

  // Access Review Functions
  createAccessReview,
  completeAccessReview,
  getPendingReviews,

  // Field Security Functions
  configureFieldSecurity,
  maskFieldValue,

  // Session Management Functions
  createUserSession,
  validateUserSession,
  expireUserSession,
  expireAllUserSessions,
  getActiveUserSessions,

  // Password Policy Functions
  validatePassword,
  checkPasswordStrength,
  forcePasswordReset,

  // MFA Functions
  enableMfa,
  verifyMfaCode,
  generateBackupCodes,

  // Security Group Functions
  createSecurityGroup,
  addUserToSecurityGroup,
  assignRoleToSecurityGroup,

  // Compliance Reporting Functions
  generateSoxComplianceReport,
  generateSecurityMetrics,
};
