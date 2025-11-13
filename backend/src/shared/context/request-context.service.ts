/**
 * @fileoverview Request Context Service
 * @module shared/context/request-context.service
 * @description Request-scoped service for tracking user context and audit information
 *
 * This service provides automatic HIPAA-compliant context tracking for every request:
 * - User ID and roles
 * - Request ID for distributed tracing
 * - IP address for audit trails
 * - Timestamp for temporal tracking
 *
 * Scope: REQUEST - Each request gets its own instance
 * Lifecycle: Created at request start, destroyed at request end
 */

import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { randomUUID } from 'crypto';

import { BaseService } from '@/common/base';
/**
 * User context interface
 * Represents the authenticated user making the request
 */
export interface UserContext {
  id: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * Request Context Service
 *
 * Request-scoped service that provides consistent access to user context
 * and request metadata across all services in the application.
 *
 * Usage:
 * ```typescript
 * @Injectable()
 * export class MyService extends BaseService {
 *   constructor(private readonly context: RequestContextService) {}
 *
 *   async doSomething() {
 *     const userId = this.context.userId;
 *     const requestId = this.context.requestId;
 *     // Use context for audit logging
 *   }
 * }
 * ```
 *
 * Benefits:
 * - Automatic user context propagation
 * - Consistent audit trail generation
 * - No need to pass user info through method parameters
 * - HIPAA-compliant access tracking
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private readonly _requestId: string;
  private readonly _timestamp: Date;
  private _userId?: string;
  private _userEmail?: string;
  private _userRole?: string;
  private _userRoles: string[] = [];
  private _userPermissions: string[] = [];
  private _ipAddress?: string;
  private _userAgent?: string;
  private _path?: string;
  private _method?: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    // Generate unique request ID for distributed tracing
    this._requestId = randomUUID();
    this._timestamp = new Date();

    // Extract request metadata
    this._ipAddress = this.extractIpAddress();
    this._userAgent = this.request.get('user-agent');
    this._path = this.request.path;
    this._method = this.request.method;

    // Extract user context from authenticated request
    this.extractUserContext();
  }

  /**
   * Extract user context from request
   * Supports multiple authentication strategies
   */
  private extractUserContext(): void {
    // Check for user in request (set by authentication middleware)
    const user = (this.request as any).user;

    if (user) {
      this._userId = user.id || user.userId || user.sub;
      this._userEmail = user.email;
      this._userRole = user.role;
      this._userRoles = user.roles || (user.role ? [user.role] : []);
      this._userPermissions = user.permissions || [];
    }
  }

  /**
   * Extract IP address from request
   * Handles proxy headers (X-Forwarded-For, X-Real-IP)
   */
  private extractIpAddress(): string | undefined {
    return (
      (this.request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (this.request.headers['x-real-ip'] as string) ||
      this.request.ip ||
      this.request.socket?.remoteAddress
    );
  }

  // ==================== Public Accessors ====================

  /**
   * Unique identifier for this request
   * Used for distributed tracing and log correlation
   */
  get requestId(): string {
    return this._requestId;
  }

  /**
   * Timestamp when the request was initiated
   */
  get timestamp(): Date {
    return this._timestamp;
  }

  /**
   * ID of the authenticated user making the request
   * Returns undefined for unauthenticated requests
   */
  get userId(): string | undefined {
    return this._userId;
  }

  /**
   * Email of the authenticated user
   */
  get userEmail(): string | undefined {
    return this._userEmail;
  }

  /**
   * Primary role of the authenticated user
   */
  get userRole(): string | undefined {
    return this._userRole;
  }

  /**
   * All roles assigned to the authenticated user
   */
  get userRoles(): string[] {
    return this._userRoles;
  }

  /**
   * All permissions granted to the authenticated user
   */
  get userPermissions(): string[] {
    return this._userPermissions;
  }

  /**
   * IP address of the client making the request
   * Extracted from headers or socket
   */
  get ipAddress(): string | undefined {
    return this._ipAddress;
  }

  /**
   * User agent string from the request
   */
  get userAgent(): string | undefined {
    return this._userAgent;
  }

  /**
   * Request path (e.g., /api/students/123)
   */
  get path(): string | undefined {
    return this._path;
  }

  /**
   * HTTP method (GET, POST, PUT, DELETE, etc.)
   */
  get method(): string | undefined {
    return this._method;
  }

  // ==================== Helper Methods ====================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this._userId;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this._userRoles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this._userRoles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this._userRoles.includes(role));
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    return this._userPermissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) =>
      this._userPermissions.includes(permission),
    );
  }

  /**
   * Get audit context for logging
   * Returns all context information in a structured format
   */
  getAuditContext(): AuditContext {
    return {
      requestId: this._requestId,
      timestamp: this._timestamp,
      userId: this._userId,
      userEmail: this._userEmail,
      userRole: this._userRole,
      userRoles: this._userRoles,
      ipAddress: this._ipAddress,
      userAgent: this._userAgent,
      path: this._path,
      method: this._method,
    };
  }

  /**
   * Create a log context object for structured logging
   */
  getLogContext(): Record<string, any> {
    return {
      requestId: this._requestId,
      userId: this._userId,
      userRole: this._userRole,
      path: this._path,
      method: this._method,
    };
  }
}

/**
 * Audit context interface
 * Complete context information for audit logging
 */
export interface AuditContext {
  requestId: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  userRoles: string[];
  ipAddress?: string;
  userAgent?: string;
  path?: string;
  method?: string;
}
