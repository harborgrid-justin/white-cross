/**
 * Request Context Service
 *
 * REQUEST-scoped service that maintains user context throughout a request lifecycle.
 * Provides user information for audit logging, authorization, and business logic.
 */

import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { randomUUID } from 'crypto';

/**
 * User context interface
 */
export interface UserContext {
  userId?: string;
  username?: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

/**
 * Request-scoped context service
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private readonly _requestId: string;
  private readonly _ipAddress?: string;
  private readonly _userAgent?: string;
  private readonly _timestamp: Date;
  private _userId?: string;
  private _username?: string;
  private _email?: string;
  private _userRoles: string[] = [];
  private _permissions: string[] = [];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this._requestId = randomUUID();
    this._ipAddress = request.ip || request.socket.remoteAddress;
    this._userAgent = request.get('user-agent');
    this._timestamp = new Date();

    // Extract user context from request (assumes JWT/session middleware)
    if (request.user) {
      const user = request.user as any;
      this._userId = user.id || user.userId;
      this._username = user.username;
      this._email = user.email;
      this._userRoles = user.roles || [];
      this._permissions = user.permissions || [];
    }
  }

  // Getters
  get requestId(): string {
    return this._requestId;
  }

  get userId(): string | undefined {
    return this._userId;
  }

  get username(): string | undefined {
    return this._username;
  }

  get email(): string | undefined {
    return this._email;
  }

  get userRoles(): string[] {
    return [...this._userRoles];
  }

  get permissions(): string[] {
    return [...this._permissions];
  }

  get ipAddress(): string | undefined {
    return this._ipAddress;
  }

  get userAgent(): string | undefined {
    return this._userAgent;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  // Authorization helpers
  hasRole(role: string): boolean {
    return this._userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this._userRoles.includes(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this._userRoles.includes(role));
  }

  hasPermission(permission: string): boolean {
    return this._permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(perm => this._permissions.includes(perm));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(perm => this._permissions.includes(perm));
  }

  isAuthenticated(): boolean {
    return !!this._userId;
  }

  // Get full user context
  getUserContext(): UserContext {
    return {
      userId: this._userId,
      username: this._username,
      email: this._email,
      roles: [...this._userRoles],
      permissions: [...this._permissions]
    };
  }

  // Get audit metadata
  getAuditMetadata(): Record<string, any> {
    return {
      requestId: this._requestId,
      userId: this._userId,
      username: this._username,
      ipAddress: this._ipAddress,
      userAgent: this._userAgent,
      timestamp: this._timestamp
    };
  }

  // Create operation context for logging
  getOperationContext(operation: string, resource?: string): Record<string, any> {
    return {
      operation,
      resource,
      requestId: this._requestId,
      userId: this._userId,
      timestamp: this._timestamp
    };
  }
}
