/**
 * WC-IDX-177 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ./roleOperations, ./permissionOperations, ./rbacOperations | Dependencies: ./roleOperations, ./permissionOperations, ./rbacOperations
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * Access Control Service - Main Entry Point
 *
 * This service provides enterprise-grade access control functionality including:
 * - Role-Based Access Control (RBAC)
 * - Permission management
 * - Session management
 * - Security incident tracking
 * - Audit logging
 * - IP restrictions
 *
 * The service is modularized for maintainability and follows SOLID principles.
 */

// Export all types
export * from './types';

// Import all operations
import * as roleOps from './roleOperations';
import * as permissionOps from './permissionOperations';
import * as rbacOps from './rbacOperations';
import * as authzOps from './authorizationOperations';
import * as auditOps from './auditOperations';

/**
 * Main Access Control Service Class
 *
 * This class serves as a facade that delegates to specialized operation modules.
 * Each module focuses on a specific domain within access control.
 */
export class AccessControlService {
  /**
   * Role Management Operations
   */
  static async getRoles() {
    return roleOps.getRoles();
  }

  static async getRoleById(id: string) {
    return roleOps.getRoleById(id);
  }

  static async createRole(data: any, auditUserId?: string) {
    return roleOps.createRole(data, auditUserId);
  }

  static async updateRole(id: string, data: any, auditUserId?: string) {
    return roleOps.updateRole(id, data, auditUserId);
  }

  static async deleteRole(id: string, auditUserId?: string) {
    return roleOps.deleteRole(id, auditUserId);
  }

  /**
   * Permission Management Operations
   */
  static async getPermissions() {
    return permissionOps.getPermissions();
  }

  static async createPermission(data: any) {
    return permissionOps.createPermission(data);
  }

  static async assignPermissionToRole(roleId: string, permissionId: string, auditUserId?: string) {
    return permissionOps.assignPermissionToRole(roleId, permissionId, auditUserId);
  }

  static async removePermissionFromRole(roleId: string, permissionId: string) {
    return permissionOps.removePermissionFromRole(roleId, permissionId);
  }

  /**
   * RBAC Operations (User Role Assignments)
   */
  static async assignRoleToUser(userId: string, roleId: string, auditUserId?: string, bypassPrivilegeCheck: boolean = false) {
    return rbacOps.assignRoleToUser(userId, roleId, auditUserId, bypassPrivilegeCheck);
  }

  static async removeRoleFromUser(userId: string, roleId: string) {
    return rbacOps.removeRoleFromUser(userId, roleId);
  }

  static async getUserPermissions(userId: string) {
    return rbacOps.getUserPermissions(userId);
  }

  static async checkPermission(userId: string, resource: string, action: string) {
    return rbacOps.checkPermission(userId, resource, action);
  }

  /**
   * Session Management Operations
   */
  static async createSession(data: any) {
    return authzOps.createSession(data);
  }

  static async getUserSessions(userId: string) {
    return authzOps.getUserSessions(userId);
  }

  static async updateSessionActivity(token: string) {
    return authzOps.updateSessionActivity(token);
  }

  static async deleteSession(token: string) {
    return authzOps.deleteSession(token);
  }

  static async deleteAllUserSessions(userId: string) {
    return authzOps.deleteAllUserSessions(userId);
  }

  static async cleanupExpiredSessions() {
    return authzOps.cleanupExpiredSessions();
  }

  /**
   * Login Attempt Tracking Operations
   */
  static async logLoginAttempt(data: any) {
    return authzOps.logLoginAttempt(data);
  }

  static async getFailedLoginAttempts(email: string, minutes?: number) {
    return authzOps.getFailedLoginAttempts(email, minutes);
  }

  /**
   * IP Restriction Operations
   */
  static async getIpRestrictions() {
    return authzOps.getIpRestrictions();
  }

  static async addIpRestriction(data: any) {
    return authzOps.addIpRestriction(data);
  }

  static async removeIpRestriction(id: string) {
    return authzOps.removeIpRestriction(id);
  }

  static async checkIpRestriction(ipAddress: string) {
    return authzOps.checkIpRestriction(ipAddress);
  }

  /**
   * Security Incident Operations
   */
  static async createSecurityIncident(data: any) {
    return auditOps.createSecurityIncident(data);
  }

  static async updateSecurityIncident(id: string, data: any) {
    return auditOps.updateSecurityIncident(id, data);
  }

  static async getSecurityIncidents(page?: number, limit?: number, filters?: any) {
    return auditOps.getSecurityIncidents(page, limit, filters);
  }

  /**
   * Security Statistics Operations
   */
  static async getSecurityStatistics() {
    return auditOps.getSecurityStatistics();
  }

  /**
   * System Initialization Operations
   */
  static async initializeDefaultRoles() {
    return auditOps.initializeDefaultRoles();
  }
}

/**
 * Export individual operation modules for direct access if needed
 */
export const RoleOperations = roleOps;
export const PermissionOperations = permissionOps;
export const RBACOperations = rbacOps;
export const AuthorizationOperations = authzOps;
export const AuditOperations = auditOps;
