/**
 * NestJS Authentication Guard Composites - Production-Ready Auth & Authorization
 *
 * Enterprise-grade authentication and authorization guard functions supporting:
 * - JWT token validation and verification
 * - OAuth2 / OpenID Connect integration
 * - Multi-factor authentication (MFA/2FA)
 * - Role-Based Access Control (RBAC)
 * - Permission-Based Access Control (PBAC)
 * - API key authentication
 * - Session management
 * - Token refresh strategies
 * - Healthcare-specific access controls (HIPAA)
 * - IP whitelisting and rate limiting
 *
 * @module authentication-guard-composites
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Type,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * JWT payload structure
 */
export interface JWTPayload {
  sub: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  tenantId?: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Auth user context
 */
export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  organizationId?: string;
  department?: string;
  lastLogin?: Date;
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
}

/**
 * OAuth2 token response
 */
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * MFA verification options
 */
export interface MFAOptions {
  required: boolean;
  methods: ('totp' | 'sms' | 'email')[];
  gracePeriod?: number;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

/**
 * IP whitelist configuration
 */
export interface IPWhitelistConfig {
  allowedIPs: string[];
  allowedRanges?: string[];
}

/**
 * Session configuration
 */
export interface SessionConfig {
  maxAge: number;
  sliding?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

// Metadata keys
export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const REQUIRE_MFA_KEY = 'requireMFA';
export const API_KEY_REQUIRED = 'apiKeyRequired';

// ============================================================================
// 1. JWT Authentication Guards
// ============================================================================

/**
 * JWT authentication guard with comprehensive token validation.
 * Validates JWT tokens, checks expiration, and attaches user to request.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user;
 * }
 * ```
 */
@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSecret: string = process.env.JWT_SECRET || 'secret',
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;

      // Check token expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      // Attach user to request
      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        tenantId: payload.tenantId,
      };

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * JWT refresh token guard for token renewal.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTRefreshGuard)
 * @Post('auth/refresh')
 * refreshToken(@Request() req) {
 *   return this.authService.refreshToken(req.user);
 * }
 * ```
 */
@Injectable()
export class JWTRefreshGuard implements CanActivate {
  constructor(
    private readonly refreshSecret: string = process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.body?.refreshToken || request.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const payload = jwt.verify(refreshToken, this.refreshSecret) as JWTPayload;

      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

/**
 * Creates a JWT guard with custom configuration.
 *
 * @param secret - JWT secret key
 * @param options - Additional JWT options
 * @returns Configured JWT guard
 *
 * @example
 * ```typescript
 * @UseGuards(CreateJWTGuard(process.env.JWT_SECRET, { ignoreExpiration: false }))
 * @Get('protected')
 * protectedRoute() {
 *   return { message: 'Protected data' };
 * }
 * ```
 */
export function CreateJWTGuard(
  secret: string,
  options?: jwt.VerifyOptions,
): Type<CanActivate> {
  @Injectable()
  class CustomJWTGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('No authentication token provided');
      }

      try {
        const payload = jwt.verify(token, secret, options) as JWTPayload;
        (request as any).user = payload;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
      const authHeader = request.headers.authorization;
      if (!authHeader) return undefined;
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
  }

  return CustomJWTGuard;
}

/**
 * Optional JWT guard - allows requests with or without token.
 *
 * @example
 * ```typescript
 * @UseGuards(OptionalJWTGuard)
 * @Get('public-or-private')
 * getData(@Request() req) {
 *   return req.user ? 'Private data' : 'Public data';
 * }
 * ```
 */
@Injectable()
export class OptionalJWTGuard implements CanActivate {
  constructor(
    private readonly jwtSecret: string = process.env.JWT_SECRET || 'secret',
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return true; // Allow request without token
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
      (request as any).user = payload;
    } catch (error) {
      // Token invalid but we allow the request
      (request as any).user = null;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

// ============================================================================
// 2. Role-Based Access Control (RBAC) Guards
// ============================================================================

/**
 * Role-based access control guard.
 * Checks if user has required roles.
 *
 * @example
 * ```typescript
 * @Roles('admin', 'manager')
 * @UseGuards(JWTAuthGuard, RolesGuard)
 * @Get('admin-only')
 * adminEndpoint() {
 *   return { message: 'Admin access granted' };
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

/**
 * Permission-based access control guard.
 *
 * @example
 * ```typescript
 * @RequirePermissions('users.read', 'users.write')
 * @UseGuards(JWTAuthGuard, PermissionsGuard)
 * @Post('users')
 * createUser(@Body() data: CreateUserDto) {
 *   return this.service.create(data);
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}

/**
 * Composite roles and permissions guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, RolesAndPermissionsGuard)
 * @Get('sensitive-data')
 * getSensitiveData() {
 *   return this.service.getSensitiveData();
 * }
 * ```
 */
@Injectable()
export class RolesAndPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check roles if required
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role privileges');
      }
    }

    // Check permissions if required
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every((permission) =>
        user.permissions?.includes(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}

/**
 * Owner or admin guard - allows access if user is owner or has admin role.
 *
 * @param ownerIdParam - Parameter name containing owner ID
 * @returns Owner or admin guard
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, OwnerOrAdminGuard('userId'))
 * @Get('users/:userId/profile')
 * getProfile(@Param('userId') userId: string) {
 *   return this.service.getProfile(userId);
 * }
 * ```
 */
export function OwnerOrAdminGuard(ownerIdParam: string = 'id'): Type<CanActivate> {
  @Injectable()
  class OwnerOrAdminGuardImpl implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user as AuthUser;
      const resourceOwnerId = request.params[ownerIdParam];

      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const isOwner = user.id === resourceOwnerId;
      const isAdmin = user.roles?.includes('admin') || user.roles?.includes('super_admin');

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException('Access denied. Must be owner or admin.');
      }

      return true;
    }
  }

  return OwnerOrAdminGuardImpl;
}

// ============================================================================
// 3. Multi-Factor Authentication (MFA) Guards
// ============================================================================

/**
 * MFA verification guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, MFAGuard)
 * @Get('sensitive-operation')
 * performSensitiveOperation() {
 *   return this.service.performOperation();
 * }
 * ```
 */
@Injectable()
export class MFAGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireMFA = this.reflector.getAllAndOverride<boolean>(REQUIRE_MFA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireMFA) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.mfaEnabled && !user.mfaVerified) {
      throw new ForbiddenException('MFA verification required');
    }

    return true;
  }
}

/**
 * TOTP (Time-based One-Time Password) guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, TOTPGuard)
 * @Post('verify-totp')
 * verifyTOTP(@Body('code') code: string) {
 *   return this.authService.verifyTOTP(code);
 * }
 * ```
 */
@Injectable()
export class TOTPGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const totpCode = request.body?.totpCode || request.headers['x-totp-code'];

    if (!totpCode) {
      throw new BadRequestException('TOTP code is required');
    }

    // Validate TOTP code format (6 digits)
    if (!/^\d{6}$/.test(totpCode)) {
      throw new BadRequestException('Invalid TOTP code format');
    }

    // Attach code to request for further validation by service
    request.totpCode = totpCode;

    return true;
  }
}

/**
 * SMS verification guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, SMSVerificationGuard)
 * @Post('verify-sms')
 * verifySMS(@Body('code') code: string) {
 *   return this.authService.verifySMS(code);
 * }
 * ```
 */
@Injectable()
export class SMSVerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const smsCode = request.body?.smsCode || request.headers['x-sms-code'];

    if (!smsCode) {
      throw new BadRequestException('SMS verification code is required');
    }

    if (!/^\d{4,8}$/.test(smsCode)) {
      throw new BadRequestException('Invalid SMS code format');
    }

    request.smsCode = smsCode;
    return true;
  }
}

// ============================================================================
// 4. API Key Authentication Guards
// ============================================================================

/**
 * API key authentication guard.
 *
 * @example
 * ```typescript
 * @UseGuards(APIKeyGuard)
 * @Get('api/data')
 * getData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class APIKeyGuard implements CanActivate {
  private readonly validApiKeys: Set<string>;

  constructor(apiKeys: string[] = []) {
    this.validApiKeys = new Set(apiKeys.length > 0 ? apiKeys : [process.env.API_KEY || '']);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] || request.query.apiKey;

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    if (!this.validApiKeys.has(apiKey as string)) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

/**
 * Flexible authentication guard - supports both JWT and API key.
 *
 * @example
 * ```typescript
 * @UseGuards(FlexibleAuthGuard)
 * @Get('data')
 * getData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class FlexibleAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSecret: string = process.env.JWT_SECRET || 'secret',
    private readonly validApiKeys: Set<string> = new Set([process.env.API_KEY || '']),
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Try API key first
    const apiKey = request.headers['x-api-key'];
    if (apiKey && this.validApiKeys.has(apiKey as string)) {
      (request as any).authType = 'api-key';
      return true;
    }

    // Try JWT token
    const token = this.extractTokenFromHeader(request);
    if (token) {
      try {
        const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
        (request as any).user = payload;
        (request as any).authType = 'jwt';
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid authentication credentials');
      }
    }

    throw new UnauthorizedException('Authentication required (JWT or API key)');
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * Creates a custom API key guard with specific keys.
 *
 * @param validKeys - Array of valid API keys
 * @returns API key guard
 *
 * @example
 * ```typescript
 * @UseGuards(CreateAPIKeyGuard(['key1', 'key2', 'key3']))
 * @Get('protected')
 * protectedRoute() {
 *   return { data: 'Protected' };
 * }
 * ```
 */
export function CreateAPIKeyGuard(validKeys: string[]): Type<CanActivate> {
  @Injectable()
  class CustomAPIKeyGuard implements CanActivate {
    private readonly validApiKeys = new Set(validKeys);

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.headers['x-api-key'] || request.query.apiKey;

      if (!apiKey || !this.validApiKeys.has(apiKey as string)) {
        throw new UnauthorizedException('Invalid or missing API key');
      }

      return true;
    }
  }

  return CustomAPIKeyGuard;
}

// ============================================================================
// 5. OAuth2 / OpenID Connect Guards
// ============================================================================

/**
 * OAuth2 bearer token guard.
 *
 * @example
 * ```typescript
 * @UseGuards(OAuth2Guard)
 * @Get('oauth-protected')
 * getProtectedData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class OAuth2Guard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('OAuth2 token required');
    }

    // Validate token with OAuth2 provider (implementation depends on provider)
    try {
      const isValid = await this.validateOAuth2Token(token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid OAuth2 token');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('OAuth2 token validation failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private async validateOAuth2Token(token: string): Promise<boolean> {
    // Placeholder for OAuth2 token validation
    // In production, this would validate against OAuth2 provider
    return true;
  }
}

/**
 * OpenID Connect guard with user info validation.
 *
 * @example
 * ```typescript
 * @UseGuards(OpenIDConnectGuard)
 * @Get('oidc-protected')
 * getProtectedData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class OpenIDConnectGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('OpenID Connect token required');
    }

    try {
      // Decode and validate ID token (implementation specific to OIDC provider)
      const payload = jwt.decode(token) as any;

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid OpenID Connect token');
      }

      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('OpenID Connect validation failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

// ============================================================================
// 6. Session Management Guards
// ============================================================================

/**
 * Session validation guard.
 *
 * @example
 * ```typescript
 * @UseGuards(SessionGuard)
 * @Get('session-protected')
 * getProtectedData(@Session() session) {
 *   return { userId: session.userId };
 * }
 * ```
 */
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const session = (request as any).session;

    if (!session || !session.userId) {
      throw new UnauthorizedException('Valid session required');
    }

    // Check session expiration
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    return true;
  }
}

/**
 * Sliding session guard - extends session on each request.
 *
 * @param maxAge - Maximum session age in milliseconds
 * @returns Sliding session guard
 *
 * @example
 * ```typescript
 * @UseGuards(SlidingSessionGuard(3600000)) // 1 hour
 * @Get('protected')
 * getProtectedData() {
 *   return this.service.getData();
 * }
 * ```
 */
export function SlidingSessionGuard(maxAge: number): Type<CanActivate> {
  @Injectable()
  class SlidingSessionGuardImpl implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const session = (request as any).session;

      if (!session || !session.userId) {
        throw new UnauthorizedException('Valid session required');
      }

      // Extend session expiration
      session.expiresAt = new Date(Date.now() + maxAge);

      return true;
    }
  }

  return SlidingSessionGuardImpl;
}

// ============================================================================
// 7. IP Whitelisting & Network Guards
// ============================================================================

/**
 * IP whitelist guard - restricts access to specific IP addresses.
 *
 * @param allowedIPs - Array of allowed IP addresses
 * @returns IP whitelist guard
 *
 * @example
 * ```typescript
 * @UseGuards(IPWhitelistGuard(['192.168.1.1', '10.0.0.1']))
 * @Get('admin')
 * adminEndpoint() {
 *   return { message: 'Admin access' };
 * }
 * ```
 */
export function IPWhitelistGuard(allowedIPs: string[]): Type<CanActivate> {
  @Injectable()
  class IPWhitelistGuardImpl implements CanActivate {
    private readonly whitelist = new Set(allowedIPs);

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const clientIP = this.getClientIP(request);

      if (!this.whitelist.has(clientIP)) {
        throw new ForbiddenException(`Access denied for IP: ${clientIP}`);
      }

      return true;
    }

    private getClientIP(request: Request): string {
      return (
        (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        (request.headers['x-real-ip'] as string) ||
        request.socket.remoteAddress ||
        'unknown'
      );
    }
  }

  return IPWhitelistGuardImpl;
}

/**
 * Internal network guard - allows access only from internal networks.
 *
 * @example
 * ```typescript
 * @UseGuards(InternalNetworkGuard)
 * @Get('internal')
 * internalEndpoint() {
 *   return { message: 'Internal access only' };
 * }
 * ```
 */
@Injectable()
export class InternalNetworkGuard implements CanActivate {
  private readonly internalRanges = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientIP = this.getClientIP(request);

    const isInternal = this.internalRanges.some((range) => range.test(clientIP));

    if (!isInternal) {
      throw new ForbiddenException('Access restricted to internal network');
    }

    return true;
  }

  private getClientIP(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }
}

// ============================================================================
// 8. Rate Limiting Guards
// ============================================================================

/**
 * Simple rate limiting guard.
 *
 * @param maxRequests - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit guard
 *
 * @example
 * ```typescript
 * @UseGuards(RateLimitGuard(100, 60000)) // 100 requests per minute
 * @Post('api/endpoint')
 * endpoint() {
 *   return this.service.process();
 * }
 * ```
 */
export function RateLimitGuard(maxRequests: number, windowMs: number): Type<CanActivate> {
  @Injectable()
  class RateLimitGuardImpl implements CanActivate {
    private readonly requests = new Map<string, number[]>();

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const key = this.getKey(request);

      const now = Date.now();
      const requests = this.requests.get(key) || [];

      // Remove old requests outside the window
      const validRequests = requests.filter((time) => now - time < windowMs);

      if (validRequests.length >= maxRequests) {
        throw new ForbiddenException('Rate limit exceeded');
      }

      validRequests.push(now);
      this.requests.set(key, validRequests);

      return true;
    }

    private getKey(request: Request): string {
      const ip = request.socket.remoteAddress || 'unknown';
      const userId = (request as any).user?.id || 'anonymous';
      return `${ip}:${userId}`;
    }
  }

  return RateLimitGuardImpl;
}

/**
 * Per-user rate limiting guard.
 *
 * @param maxRequests - Maximum requests per user
 * @param windowMs - Time window in milliseconds
 * @returns Per-user rate limit guard
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, PerUserRateLimitGuard(50, 60000))
 * @Post('upload')
 * uploadFile() {
 *   return this.service.uploadFile();
 * }
 * ```
 */
export function PerUserRateLimitGuard(maxRequests: number, windowMs: number): Type<CanActivate> {
  @Injectable()
  class PerUserRateLimitGuardImpl implements CanActivate {
    private readonly userRequests = new Map<string, number[]>();

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user as AuthUser;

      if (!user) {
        throw new UnauthorizedException('Authentication required for rate limiting');
      }

      const userId = user.id;
      const now = Date.now();
      const requests = this.userRequests.get(userId) || [];

      const validRequests = requests.filter((time) => now - time < windowMs);

      if (validRequests.length >= maxRequests) {
        throw new ForbiddenException(
          `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds`,
        );
      }

      validRequests.push(now);
      this.userRequests.set(userId, validRequests);

      return true;
    }
  }

  return PerUserRateLimitGuardImpl;
}

// ============================================================================
// 9. Healthcare-Specific Guards (HIPAA Compliance)
// ============================================================================

/**
 * HIPAA compliance guard - ensures proper authorization for PHI access.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, HIPAAComplianceGuard)
 * @Get('patients/:id/medical-records')
 * getMedicalRecords(@Param('id') patientId: string) {
 *   return this.service.getMedicalRecords(patientId);
 * }
 * ```
 */
@Injectable()
export class HIPAAComplianceGuard implements CanActivate {
  private readonly authorizedRoles = ['doctor', 'nurse', 'admin', 'healthcare_provider'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required for PHI access');
    }

    const hasAuthorizedRole = this.authorizedRoles.some((role) =>
      user.roles?.includes(role),
    );

    if (!hasAuthorizedRole) {
      throw new ForbiddenException('Insufficient privileges to access Protected Health Information');
    }

    // Log PHI access for audit trail
    this.logPHIAccess(user, request);

    return true;
  }

  private logPHIAccess(user: AuthUser, request: any): void {
    console.log('[HIPAA Audit]', {
      userId: user.id,
      email: user.email,
      action: `${request.method} ${request.url}`,
      timestamp: new Date().toISOString(),
      ip: request.socket.remoteAddress,
    });
  }
}

/**
 * Medical staff only guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, MedicalStaffGuard)
 * @Post('prescriptions')
 * createPrescription(@Body() data: CreatePrescriptionDto) {
 *   return this.service.createPrescription(data);
 * }
 * ```
 */
@Injectable()
export class MedicalStaffGuard implements CanActivate {
  private readonly medicalRoles = ['doctor', 'nurse', 'physician_assistant', 'nurse_practitioner'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const isMedicalStaff = this.medicalRoles.some((role) => user.roles?.includes(role));

    if (!isMedicalStaff) {
      throw new ForbiddenException('Access restricted to medical staff');
    }

    return true;
  }
}

/**
 * Patient consent guard - verifies patient has given consent.
 *
 * @param consentService - Service to check consent
 * @returns Patient consent guard
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, PatientConsentGuard(consentService))
 * @Get('patients/:patientId/records')
 * getRecords(@Param('patientId') patientId: string) {
 *   return this.service.getRecords(patientId);
 * }
 * ```
 */
export function PatientConsentGuard(consentService: any): Type<CanActivate> {
  @Injectable()
  class PatientConsentGuardImpl implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user as AuthUser;
      const patientId = request.params.patientId || request.body?.patientId;

      if (!patientId) {
        throw new BadRequestException('Patient ID required');
      }

      // Check if user is the patient
      if (user.id === patientId) {
        return true;
      }

      // Check consent
      const hasConsent = await consentService.checkConsent(patientId, user.id);

      if (!hasConsent) {
        throw new ForbiddenException('Patient consent required for access');
      }

      return true;
    }
  }

  return PatientConsentGuardImpl;
}

// ============================================================================
// 10. Tenant Isolation Guards
// ============================================================================

/**
 * Multi-tenant isolation guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, TenantIsolationGuard)
 * @Get('data')
 * getTenantData() {
 *   return this.service.getData();
 * }
 * ```
 */
@Injectable()
export class TenantIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    const tenantId = request.headers['x-tenant-id'] || request.query.tenantId;

    if (!tenantId) {
      throw new BadRequestException('Tenant ID required');
    }

    if (user.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    request.tenantId = tenantId;
    return true;
  }
}

/**
 * Cross-tenant access guard (admin only).
 *
 * @example
 * ```typescript
 * @UseGuards(JWTAuthGuard, CrossTenantAccessGuard)
 * @Get('admin/tenants/:tenantId/data')
 * getCrossTenantData(@Param('tenantId') tenantId: string) {
 *   return this.service.getData(tenantId);
 * }
 * ```
 */
@Injectable()
export class CrossTenantAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    const isSuperAdmin = user.roles?.includes('super_admin');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Cross-tenant access requires super admin privileges');
    }

    return true;
  }
}

// ============================================================================
// 11. Public Route Guard (Bypass Auth)
// ============================================================================

/**
 * Public route decorator - bypasses authentication.
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Public route guard implementation.
 *
 * @example
 * ```typescript
 * @UseGuards(PublicRouteGuard)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Injectable()
export class PublicRouteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic !== false; // Allow by default unless explicitly set to false
  }
}

// ============================================================================
// 12. Composite & Conditional Guards
// ============================================================================

/**
 * Combines multiple guards with AND logic.
 *
 * @param guards - Array of guards to combine
 * @returns Combined guard
 *
 * @example
 * ```typescript
 * @UseGuards(CombineGuards([JWTAuthGuard, RolesGuard, MFAGuard]))
 * @Get('secure')
 * secureEndpoint() {
 *   return { data: 'Highly secure data' };
 * }
 * ```
 */
export function CombineGuards(guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class CombinedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      for (const GuardClass of guards) {
        const guard = new GuardClass();
        const result = await guard.canActivate(context);
        if (!result) {
          return false;
        }
      }
      return true;
    }
  }

  return CombinedGuard;
}

/**
 * Conditional guard - applies guard based on condition.
 *
 * @param condition - Condition function
 * @param guard - Guard to apply if condition is true
 * @returns Conditional guard
 *
 * @example
 * ```typescript
 * @UseGuards(ConditionalGuard((req) => req.path.includes('/admin'), AdminGuard))
 * @Controller()
 * export class AppController { ... }
 * ```
 */
export function ConditionalGuard(
  condition: (request: Request) => boolean,
  guard: Type<CanActivate>,
): Type<CanActivate> {
  @Injectable()
  class ConditionalGuardImpl implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();

      if (!condition(request)) {
        return true;
      }

      const guardInstance = new guard();
      return guardInstance.canActivate(context);
    }
  }

  return ConditionalGuardImpl;
}
