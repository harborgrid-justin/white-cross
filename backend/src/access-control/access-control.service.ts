import { Injectable, Logger } from '@nestjs/common';
import { RoleManagementService } from './services/role-management.service';
import { PermissionManagementService } from './services/permission-management.service';
import { UserRoleAssignmentService } from './services/user-role-assignment.service';
import { SessionManagementService } from './services/session-management.service';
import { SecurityMonitoringService } from './services/security-monitoring.service';
import { IpRestrictionManagementService } from './services/ip-restriction-management.service';
import { SystemInitializationService } from './services/system-initialization.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { LogLoginAttemptDto } from './dto/log-login-attempt.dto';
import { AccessControlCreateIpRestrictionDto } from './dto/create-ip-restriction.dto';
import { AccessControlCreateIncidentDto } from './dto/create-security-incident.dto';
import { IpRestrictionCheckResult } from './interfaces/ip-restriction-check.interface';
import { SecurityStatistics } from './interfaces/security-statistics.interface';
import { UserPermissionsResult } from './interfaces/user-permissions-result.interface';
import { BaseService } from '../../common/base';
import {
  IpRestrictionInstance,
  LoginAttemptInstance,
  PaginationResult,
  PermissionInstance,
  RolePermissionInstance,
  RoleWithPermissions,
  SecurityIncidentFilters,
  SecurityIncidentInstance,
  SecurityIncidentUpdateData,
  SessionInstance,
} from './types/sequelize-models.types';

/**
 * Access Control Service
 *
 * Comprehensive RBAC implementation with:
 * - Role management
 * - Permission management
 * - User role assignments with privilege escalation prevention
 * - Session management
 * - Login attempt tracking
 * - IP restriction management
 * - Security incident management
 *
 * This service acts as a facade, delegating to specialized services for each concern.
 * All methods maintain the same public API for backward compatibility.
 */
@Injectable()
export class AccessControlService extends BaseService {
  constructor(
    private readonly roleManagementService: RoleManagementService,
    private readonly permissionManagementService: PermissionManagementService,
    private readonly userRoleAssignmentService: UserRoleAssignmentService,
    private readonly sessionManagementService: SessionManagementService,
    private readonly securityMonitoringService: SecurityMonitoringService,
    private readonly ipRestrictionManagementService: IpRestrictionManagementService,
    private readonly systemInitializationService: SystemInitializationService,
  ) {}

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  /**
   * Get all roles with their permissions and user assignments
   */
  async getRoles(): Promise<RoleWithPermissions[]> {
    return this.roleManagementService.getRoles();
  }

  /**
   * Get role by ID with permissions and user assignments
   */
  async getRoleById(id: string): Promise<RoleWithPermissions> {
    return this.roleManagementService.getRoleById(id);
  }

  /**
   * Create a new role with validation and audit logging
   */
  async createRole(data: CreateRoleDto, auditUserId?: string): Promise<RoleWithPermissions> {
    return this.roleManagementService.createRole(data, auditUserId);
  }

  /**
   * Update role with validation and audit logging
   */
  async updateRole(
    id: string,
    data: UpdateRoleDto,
    auditUserId?: string,
  ): Promise<any> {
    return this.roleManagementService.updateRole(id, data, auditUserId);
  }

  /**
   * Delete role with validation and audit logging
   */
  async deleteRole(
    id: string,
    auditUserId?: string,
  ): Promise<{ success: boolean }> {
    return this.roleManagementService.deleteRole(id, auditUserId);
  }

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  /**
   * Get all permissions ordered by resource and action
   */
  async getPermissions(): Promise<PermissionInstance[]> {
    return this.permissionManagementService.getPermissions();
  }

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionDto): Promise<PermissionInstance> {
    return this.permissionManagementService.createPermission(data);
  }

  /**
   * Assign permission to role with validation and audit logging
   */
  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
    auditUserId?: string,
  ): Promise<RolePermissionInstance> {
    return this.permissionManagementService.assignPermissionToRole(
      roleId,
      permissionId,
      auditUserId,
    );
  }

  /**
   * Remove permission from role with audit logging
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
    auditUserId?: string,
  ): Promise<{ success: boolean }> {
    return this.permissionManagementService.removePermissionFromRole(
      roleId,
      permissionId,
      auditUserId,
    );
  }

  // ============================================================================
  // RBAC OPERATIONS (User Role Assignments)
  // ============================================================================

  /**
   * Assign role to user with privilege escalation prevention and audit logging
   */
  async assignRoleToUser(
    userId: string,
    roleId: string,
    auditUserId?: string,
    bypassPrivilegeCheck: boolean = false,
  ): Promise<any> {
    return this.userRoleAssignmentService.assignRoleToUser(
      userId,
      roleId,
      auditUserId,
      bypassPrivilegeCheck,
    );
  }

  /**
   * Remove role from user with cache invalidation
   */
  async removeRoleFromUser(
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> {
    return this.userRoleAssignmentService.removeRoleFromUser(userId, roleId);
  }

  /**
   * Get user roles and permissions with caching and audit logging
   */
  async getUserPermissions(
    userId: string,
    bypassCache: boolean = false,
  ): Promise<UserPermissionsResult> {
    return this.userRoleAssignmentService.getUserPermissions(userId, bypassCache);
  }

  /**
   * Check if user has a specific permission with audit logging
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    return this.userRoleAssignmentService.checkPermission(userId, resource, action);
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Create a new session
   */
  async createSession(data: CreateSessionDto): Promise<SessionInstance> {
    return this.sessionManagementService.createSession(data);
  }

  /**
   * Get user sessions (only active ones)
   */
  async getUserSessions(userId: string): Promise<SessionInstance[]> {
    return this.sessionManagementService.getUserSessions(userId);
  }

  /**
   * Update session activity timestamp with audit logging
   */
  async updateSessionActivity(
    token: string,
    ipAddress?: string,
  ): Promise<void> {
    return this.sessionManagementService.updateSessionActivity(token, ipAddress);
  }

  /**
   * Delete session
   */
  async deleteSession(token: string): Promise<{ success: boolean }> {
    return this.sessionManagementService.deleteSession(token);
  }

  /**
   * Delete all user sessions
   */
  async deleteAllUserSessions(userId: string): Promise<{ deleted: number }> {
    return this.sessionManagementService.deleteAllUserSessions(userId);
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    return this.sessionManagementService.cleanupExpiredSessions();
  }

  // ============================================================================
  // LOGIN ATTEMPT TRACKING
  // ============================================================================

  /**
   * Log a login attempt
   */
  async logLoginAttempt(data: LogLoginAttemptDto): Promise<LoginAttemptInstance | undefined> {
    return this.securityMonitoringService.logLoginAttempt(data);
  }

  /**
   * Get failed login attempts within a time window
   */
  async getFailedLoginAttempts(
    email: string,
    minutes: number = 15,
  ): Promise<any[]> {
    return this.securityMonitoringService.getFailedLoginAttempts(email, minutes);
  }

  // ============================================================================
  // IP RESTRICTION MANAGEMENT
  // ============================================================================

  /**
   * Get all active IP restrictions
   */
  async getIpRestrictions(): Promise<IpRestrictionInstance[]> {
    return this.ipRestrictionManagementService.getIpRestrictions();
  }

  /**
   * Add IP restriction
   */
  async addIpRestriction(
    data: AccessControlCreateIpRestrictionDto,
  ): Promise<any> {
    return this.ipRestrictionManagementService.addIpRestriction(data);
  }

  /**
   * Remove IP restriction (soft delete)
   */
  async removeIpRestriction(id: string): Promise<{ success: boolean }> {
    return this.ipRestrictionManagementService.removeIpRestriction(id);
  }

  /**
   * Check if IP is restricted with audit logging
   */
  async checkIpRestriction(
    ipAddress: string,
    userId?: string,
  ): Promise<IpRestrictionCheckResult> {
    return this.ipRestrictionManagementService.checkIpRestriction(ipAddress, userId);
  }

  // ============================================================================
  // SECURITY INCIDENT MANAGEMENT
  // ============================================================================

  /**
   * Create a security incident
   */
  async createSecurityIncident(
    data: AccessControlCreateIncidentDto,
  ): Promise<any> {
    return this.securityMonitoringService.createSecurityIncident(data);
  }

  /**
   * Update security incident
   */
  async updateSecurityIncident(id: string, data: SecurityIncidentUpdateData): Promise<SecurityIncidentInstance> {
    return this.securityMonitoringService.updateSecurityIncident(id, data);
  }

  /**
   * Get security incidents with pagination and filters
   */
  async getSecurityIncidents(
    page: number = 1,
    limit: number = 20,
    filters: SecurityIncidentFilters = {},
  ): Promise<{ incidents: SecurityIncidentInstance[]; pagination: PaginationResult }> {
    return this.securityMonitoringService.getSecurityIncidents(page, limit, filters);
  }

  /**
   * Get security statistics
   */
  async getSecurityStatistics(): Promise<SecurityStatistics> {
    return this.securityMonitoringService.getSecurityStatistics();
  }

  // ============================================================================
  // SYSTEM INITIALIZATION
  // ============================================================================

  /**
   * Initialize default roles and permissions
   * This should be run once during system setup
   */
  async initializeDefaultRoles(): Promise<void> {
    return this.systemInitializationService.initializeDefaultRoles();
  }
}
