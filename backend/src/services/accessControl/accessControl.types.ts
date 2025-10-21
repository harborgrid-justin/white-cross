/**
 * LOC: 200354A2A0
 * WC-GEN-181 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - permissionOperations.ts (services/accessControl/permissionOperations.ts)
 *   - rbacOperations.ts (services/accessControl/rbacOperations.ts)
 */

/**
 * WC-GEN-181 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/models, ../../database/types/enums | Dependencies: ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Type definitions for Access Control Service
 *
 * This module contains all TypeScript interfaces and types used across
 * the access control system, including role management, permissions,
 * sessions, and security incidents.
 */

import {
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  Session,
  LoginAttempt,
  IpRestriction,
  SecurityIncident
} from '../../database/models';
import {
  SecurityIncidentType,
  IncidentSeverity,
  IpRestrictionType,
  SecurityIncidentStatus
} from '../../database/types/enums';

/**
 * Role Management Types
 */
export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

/**
 * Permission Management Types
 */
export interface CreatePermissionData {
  resource: string;
  action: string;
  description?: string;
}

export interface UserPermissionsResult {
  roles: Role[];
  permissions: Permission[];
}

/**
 * Session Management Types
 */
export interface CreateSessionData {
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface LogLoginAttemptData {
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
}

/**
 * Security Incident Types
 */
export interface CreateSecurityIncidentData {
  type: SecurityIncidentType;
  severity: IncidentSeverity;
  description: string;
  affectedResources?: string[];
  detectedBy?: string;
}

export interface UpdateSecurityIncidentData {
  status?: SecurityIncidentStatus;
  resolution?: string;
  resolvedBy?: string;
}

export interface SecurityIncidentFilters {
  type?: SecurityIncidentType;
  severity?: IncidentSeverity;
  status?: SecurityIncidentStatus;
}

/**
 * IP Restriction Types
 */
export interface AddIpRestrictionData {
  ipAddress: string;
  type: IpRestrictionType;
  reason?: string;
  createdBy: string;
}

export interface IpRestrictionCheckResult {
  isRestricted: boolean;
  type?: IpRestrictionType;
  reason?: string;
}

/**
 * Security Statistics Types
 */
export interface SecurityStatistics {
  incidents: {
    total: number;
    open: number;
    critical: number;
  };
  authentication: {
    recentFailedLogins: number;
    activeSessions: number;
  };
  ipRestrictions: number;
}

/**
 * Re-export database models for convenience
 */
export {
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  Session,
  LoginAttempt,
  IpRestriction,
  SecurityIncident
};
