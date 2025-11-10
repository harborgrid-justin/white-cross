/**
 * TypeScript type definitions for Sequelize models used in Access Control
 *
 * These types define the structure of database models loaded dynamically
 * through Sequelize's model registry.
 */

import { CreateOptions, DestroyOptions, FindOptions, Model, UpdateOptions } from 'sequelize';

/**
 * Base Sequelize Model interface with common properties
 */
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role model from database/models/security/Role.ts
 */
export interface RoleModel extends BaseModel {
  name: string;
  description: string | null;
  isSystem: boolean;

  // Associations
  permissions?: RolePermissionModel[];
  userRoles?: UserRoleAssignmentModel[];
}

/**
 * Permission model from database/models/security/Permission.ts
 */
export interface PermissionModel extends BaseModel {
  resource: string;
  action: string;
  description: string | null;
}

/**
 * RolePermission junction model
 */
export interface RolePermissionModel extends BaseModel {
  roleId: string;
  permissionId: string;

  // Associations
  role?: RoleModel;
  permission?: PermissionModel;
}

/**
 * UserRoleAssignment junction model
 */
export interface UserRoleAssignmentModel extends BaseModel {
  userId: string;
  roleId: string;

  // Associations
  role?: RoleModel;
  user?: UserModel;
}

/**
 * User model (minimal definition for access control)
 */
export interface UserModel extends BaseModel {
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
}

/**
 * Session model from database/models/security/Session.ts
 */
export interface SessionModel extends BaseModel {
  userId: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  lastActivity: Date;
}

/**
 * LoginAttempt model from database/models/security/LoginAttempt.ts
 */
export interface LoginAttemptModel extends BaseModel {
  email: string;
  success: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  failureReason: string | null;
}

/**
 * IpRestriction model from database/models/security/IpRestriction.ts
 */
export interface IpRestrictionModel extends BaseModel {
  ipAddress: string;
  type: 'WHITELIST' | 'BLACKLIST';
  reason: string | null;
  isActive: boolean;
  createdBy: string | null;
}

/**
 * SecurityIncident model from database/models/security/SecurityIncident.ts
 */
export interface SecurityIncidentModel extends BaseModel {
  type: 'BRUTE_FORCE' | 'UNAUTHORIZED_ACCESS' | 'POLICY_VIOLATION' | 'SUSPICIOUS_ACTIVITY' | 'DATA_BREACH' | 'ACCOUNT_TAKEOVER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  description: string;
  affectedResources: string[];
  detectedBy: string | null;
  resolvedBy: string | null;
  resolution: string | null;
  resolvedAt: Date | null;
}

/**
 * Sequelize Model class type with common methods
 */
export interface SequelizeModelClass<T> {
  findAll(options?: FindOptions): Promise<Array<Model<T> & T>>;
  findOne(options?: FindOptions): Promise<(Model<T> & T) | null>;
  findByPk(id: string | number, options?: FindOptions): Promise<(Model<T> & T) | null>;
  findAndCountAll(options?: FindOptions): Promise<{ rows: Array<Model<T> & T>; count: number }>;
  create(values: Partial<T>, options?: CreateOptions): Promise<Model<T> & T>;
  update(values: Partial<T>, options: UpdateOptions): Promise<[number, Array<Model<T> & T>]>;
  destroy(options: DestroyOptions): Promise<number>;
  count(options?: FindOptions): Promise<number>;
}

/**
 * Type for Sequelize instance with model access methods
 */
export interface SequelizeModelInstance<T> extends Model<T> {
  update(values: Partial<T>, options?: UpdateOptions): Promise<this>;
  reload(options?: FindOptions): Promise<this>;
  destroy(options?: DestroyOptions): Promise<void>;
  save(options?: any): Promise<this>;
}

/**
 * Type for role with associations loaded
 */
export type RoleWithPermissions = SequelizeModelInstance<RoleModel>;

/**
 * Type for permission with associations loaded
 */
export type PermissionInstance = SequelizeModelInstance<PermissionModel>;

/**
 * Type for session instance
 */
export type SessionInstance = SequelizeModelInstance<SessionModel>;

/**
 * Type for login attempt instance
 */
export type LoginAttemptInstance = SequelizeModelInstance<LoginAttemptModel>;

/**
 * Type for IP restriction instance
 */
export type IpRestrictionInstance = SequelizeModelInstance<IpRestrictionModel>;

/**
 * Type for security incident instance
 */
export type SecurityIncidentInstance = SequelizeModelInstance<SecurityIncidentModel>;

/**
 * Type for user role assignment instance
 */
export type UserRoleInstance = SequelizeModelInstance<UserRoleAssignmentModel>;

/**
 * Type for role permission assignment instance
 */
export type RolePermissionInstance = SequelizeModelInstance<RolePermissionModel>;

/**
 * Pagination result interface
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Update data for roles
 */
export interface RoleUpdateData {
  name?: string;
  description?: string | null;
}

/**
 * Update data for security incidents
 */
export interface SecurityIncidentUpdateData {
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Filters for security incidents query
 */
export interface SecurityIncidentFilters {
  type?: string;
  severity?: string;
  status?: string;
}

/**
 * Security incident query where clause
 */
export interface SecurityIncidentWhereClause {
  type?: string;
  severity?: string;
  status?: string;
}
