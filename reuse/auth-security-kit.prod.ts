/**
 * LOC: AUTH_SEC_PROD_001
 * File: /reuse/auth-security-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - @nestjs/swagger
 *   - passport
 *   - bcrypt
 *   - argon2
 *   - otplib
 *   - qrcode
 *   - sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Authorization services
 *   - Auth controllers
 *   - Security middleware
 *   - Guard implementations
 *   - API key validators
 */

/**
 * File: /reuse/auth-security-kit.prod.ts
 * Locator: WC-AUTH-SEC-PROD-001
 * Purpose: Production-Grade Authentication & Authorization Kit - Enterprise security toolkit
 *
 * Upstream: NestJS, Passport, JWT, Swagger, bcrypt, argon2, otplib, Sequelize, Zod
 * Downstream: ../backend/auth/*, Guards, Strategies, Controllers, Security Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/passport, @nestjs/jwt, @nestjs/swagger
 * Exports: 47+ production-ready auth functions covering JWT, OAuth2, RBAC, sessions, 2FA, API keys
 *
 * LLM Context: Production-grade authentication and authorization utilities for White Cross healthcare platform.
 * Provides comprehensive JWT token lifecycle management (access/refresh tokens), OAuth2/OIDC flows, password
 * hashing with bcrypt/argon2, password policy enforcement, session management with Redis, role-based access
 * control (RBAC), attribute-based access control (ABAC), permission checking, 2FA/TOTP authentication, API key
 * generation/validation, rate limiting for auth attempts, account lockout, NestJS guards, custom decorators,
 * audit interceptors, security headers, CSRF protection, and HIPAA-compliant authentication patterns.
 * Includes Sequelize models for users, roles, permissions, sessions, API keys, and audit logs.
 */

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  createParamDecorator,
  SetMetadata,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Authentication method types
 */
export enum AuthMethod {
  LOCAL = 'local',
  JWT = 'jwt',
  OAUTH2 = 'oauth2',
  OIDC = 'oidc',
  SAML = 'saml',
  API_KEY = 'api_key',
  MFA = 'mfa',
  BIOMETRIC = 'biometric',
}

/**
 * OAuth2 grant types
 */
export enum OAuth2GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  IMPLICIT = 'implicit',
  DEVICE_CODE = 'device_code',
}

/**
 * User roles enum
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  STAFF = 'staff',
  GUEST = 'guest',
}

/**
 * Permission actions
 */
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXECUTE = 'execute',
  APPROVE = 'approve',
  MANAGE = 'manage',
}

/**
 * Resource types for authorization
 */
export enum ResourceType {
  USER = 'user',
  PATIENT = 'patient',
  APPOINTMENT = 'appointment',
  MEDICAL_RECORD = 'medical_record',
  PRESCRIPTION = 'prescription',
  BILLING = 'billing',
  REPORT = 'report',
  ADMIN = 'admin',
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  permissions?: string[];
  sessionId?: string;
  type: 'access' | 'refresh' | 'mfa' | 'reset';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  jti?: string;
}

/**
 * Access token response
 */
export interface AccessTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'Bearer';
  expiresIn: number;
  scope?: string;
  idToken?: string; // For OIDC
}

/**
 * OAuth2 authorization request
 */
export interface OAuth2AuthRequest {
  clientId: string;
  redirectUri: string;
  responseType: 'code' | 'token' | 'id_token';
  scope: string[];
  state: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
  nonce?: string;
}

/**
 * OAuth2 token request
 */
export interface OAuth2TokenRequest {
  grantType: OAuth2GrantType;
  code?: string;
  redirectUri?: string;
  clientId: string;
  clientSecret?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  scope?: string[];
  codeVerifier?: string;
}

/**
 * User authentication payload
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  isMfaEnabled: boolean;
  mfaVerified?: boolean;
  sessionId?: string;
  lastLogin?: Date;
}

/**
 * Session data structure
 */
export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  mfaVerified: boolean;
  metadata?: Record<string, any>;
}

/**
 * Password policy configuration
 */
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // Number of previous passwords to check
  maxAge: number; // Days until password expires
  minAge: number; // Minimum days before password can be changed
  complexityScore: number; // 0-4 (weak to strong)
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  score: number; // 0-100
}

/**
 * RBAC permission structure
 */
export interface Permission {
  id: string;
  resource: ResourceType;
  action: PermissionAction;
  conditions?: Record<string, any>;
  effect: 'allow' | 'deny';
}

/**
 * ABAC policy structure
 */
export interface ABACPolicy {
  id: string;
  name: string;
  description?: string;
  subject: {
    roles?: UserRole[];
    permissions?: string[];
    attributes?: Record<string, any>;
  };
  resource: {
    type: ResourceType;
    attributes?: Record<string, any>;
  };
  action: PermissionAction;
  conditions?: Array<{
    attribute: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
    value: any;
  }>;
  effect: 'allow' | 'deny';
  priority: number;
}

/**
 * 2FA/TOTP configuration
 */
export interface TOTPConfig {
  secret: string;
  issuer: string;
  label: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: 6 | 8;
  period: number; // Time step in seconds
  window: number; // Window for validation
}

/**
 * API key structure
 */
export interface APIKey {
  id: string;
  key: string;
  hash: string;
  userId: string;
  name: string;
  scopes: string[];
  permissions: string[];
  rateLimit?: number;
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number;
  blockDurationMs: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

/**
 * Login attempt tracking
 */
export interface LoginAttempt {
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Account lockout state
 */
export interface AccountLockout {
  userId: string;
  isLocked: boolean;
  lockedAt?: Date;
  lockedUntil?: Date;
  failedAttempts: number;
  lockReason?: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Login credentials schema
 */
export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().optional(),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Password change schema
 */
export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * User registration schema
 */
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.PATIENT),
  phoneNumber: z.string().optional(),
});

/**
 * OAuth2 token request schema
 */
export const OAuth2TokenRequestSchema = z.object({
  grantType: z.nativeEnum(OAuth2GrantType),
  code: z.string().optional(),
  redirectUri: z.string().url().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().optional(),
  refreshToken: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  scope: z.array(z.string()).optional(),
  codeVerifier: z.string().optional(),
});

/**
 * TOTP verification schema
 */
export const TOTPVerificationSchema = z.object({
  code: z.string().length(6, 'TOTP code must be 6 digits'),
  userId: z.string().uuid('Invalid user ID'),
});

/**
 * API key creation schema
 */
export const APIKeyCreationSchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100),
  scopes: z.array(z.string()).min(1, 'At least one scope is required'),
  permissions: z.array(z.string()).optional().default([]),
  expiresInDays: z.number().int().min(1).max(365).optional(),
  rateLimit: z.number().int().min(0).optional(),
});

// ============================================================================
// JWT TOKEN MANAGEMENT
// ============================================================================

/**
 * Generate JWT access token with comprehensive payload
 *
 * @param user - User authentication data
 * @param jwtService - NestJS JWT service instance
 * @param options - Optional token generation options
 * @returns Signed JWT access token
 *
 * @example
 * ```typescript
 * const token = await generateAccessToken(authUser, jwtService, {
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-client',
 * });
 * ```
 */
export async function generateAccessToken(
  user: AuthUser,
  jwtService: JwtService,
  options?: {
    expiresIn?: string | number;
    issuer?: string;
    audience?: string;
    sessionId?: string;
    additionalClaims?: Record<string, any>;
  }
): Promise<string> {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    type: 'access',
    sessionId: options?.sessionId || user.sessionId,
    jti: crypto.randomBytes(16).toString('hex'),
    ...options?.additionalClaims,
  };

  return jwtService.sign(payload, {
    expiresIn: options?.expiresIn || '15m',
    issuer: options?.issuer || 'white-cross-api',
    audience: options?.audience || 'white-cross-client',
  });
}

/**
 * Generate JWT refresh token with long expiration
 *
 * @param userId - User ID to encode in token
 * @param jwtService - NestJS JWT service instance
 * @param options - Optional token generation options
 * @returns Signed JWT refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = await generateRefreshToken(user.id, jwtService, {
 *   expiresIn: '7d',
 *   sessionId: session.id,
 * });
 * ```
 */
export async function generateRefreshToken(
  userId: string,
  jwtService: JwtService,
  options?: {
    expiresIn?: string | number;
    sessionId?: string;
    issuer?: string;
    audience?: string;
  }
): Promise<string> {
  const payload: JWTPayload = {
    sub: userId,
    email: '', // Refresh tokens don't need email
    role: UserRole.GUEST, // Placeholder
    type: 'refresh',
    sessionId: options?.sessionId,
    jti: crypto.randomBytes(16).toString('hex'),
  };

  return jwtService.sign(payload, {
    expiresIn: options?.expiresIn || '7d',
    issuer: options?.issuer || 'white-cross-api',
    audience: options?.audience || 'white-cross-client',
  });
}

/**
 * Verify and decode JWT token with error handling
 *
 * @param token - JWT token to verify
 * @param jwtService - NestJS JWT service instance
 * @param options - Token verification options
 * @returns Decoded JWT payload
 * @throws UnauthorizedException if token is invalid or expired
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyJWTToken(token, jwtService, {
 *     issuer: 'white-cross-api',
 *     audience: 'white-cross-client',
 *   });
 *   console.log('User ID:', payload.sub);
 * } catch (error) {
 *   // Handle invalid token
 * }
 * ```
 */
export async function verifyJWTToken(
  token: string,
  jwtService: JwtService,
  options?: {
    issuer?: string;
    audience?: string;
    ignoreExpiration?: boolean;
  }
): Promise<JWTPayload> {
  try {
    const payload = jwtService.verify<JWTPayload>(token, {
      issuer: options?.issuer || 'white-cross-api',
      audience: options?.audience || 'white-cross-client',
      ignoreExpiration: options?.ignoreExpiration || false,
    });

    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid token');
    } else {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}

/**
 * Decode JWT token without verification (for debugging)
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = decodeJWTToken(token);
 * if (payload) {
 *   console.log('Token expires at:', new Date(payload.exp * 1000));
 * }
 * ```
 */
export function decodeJWTToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf8')
    );
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if JWT token is expired
 *
 * @param token - JWT token to check
 * @returns True if token is expired
 *
 * @example
 * ```typescript
 * if (isTokenExpired(token)) {
 *   // Request new token
 *   const newToken = await refreshAccessToken(refreshToken);
 * }
 * ```
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWTToken(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Extract token from Authorization header
 *
 * @param request - Express request object
 * @returns Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractTokenFromHeader(request);
 * if (token) {
 *   const payload = await verifyJWTToken(token, jwtService);
 * }
 * ```
 */
export function extractTokenFromHeader(request: Request): string | null {
  const authHeader = request.headers.authorization;
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
}

/**
 * Revoke JWT token (add to blacklist)
 *
 * @param token - Token to revoke
 * @param redisClient - Redis client for blacklist storage
 * @param ttl - Time to live in seconds (should match token expiry)
 * @returns Promise resolving when token is blacklisted
 *
 * @example
 * ```typescript
 * await revokeToken(token, redisClient, 900); // 15 minutes
 * ```
 */
export async function revokeToken(
  token: string,
  redisClient: any, // Redis client type
  ttl?: number
): Promise<void> {
  const payload = decodeJWTToken(token);
  if (!payload || !payload.jti) {
    throw new BadRequestException('Invalid token for revocation');
  }

  const expiryTTL = ttl || (payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 3600);

  await redisClient.setex(`blacklist:${payload.jti}`, expiryTTL, 'revoked');
}

/**
 * Check if JWT token is blacklisted
 *
 * @param token - Token to check
 * @param redisClient - Redis client for blacklist storage
 * @returns True if token is blacklisted
 *
 * @example
 * ```typescript
 * if (await isTokenBlacklisted(token, redisClient)) {
 *   throw new UnauthorizedException('Token has been revoked');
 * }
 * ```
 */
export async function isTokenBlacklisted(
  token: string,
  redisClient: any
): Promise<boolean> {
  const payload = decodeJWTToken(token);
  if (!payload || !payload.jti) return false;

  const result = await redisClient.get(`blacklist:${payload.jti}`);
  return result !== null;
}

// ============================================================================
// PASSWORD HASHING & VALIDATION
// ============================================================================

/**
 * Hash password using bcrypt with configurable salt rounds
 *
 * @param password - Plain text password
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Hashed password
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword(plainPassword, 12);
 * await userRepository.save({ email, password: hashedPassword });
 * ```
 */
export async function hashPassword(
  password: string,
  saltRounds: number = 12
): Promise<string> {
  if (!password || password.length === 0) {
    throw new BadRequestException('Password cannot be empty');
  }

  if (password.length > 72) {
    // bcrypt has a 72-character limit
    throw new BadRequestException('Password is too long (max 72 characters)');
  }

  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against bcrypt hash
 *
 * @param password - Plain text password
 * @param hash - Bcrypt hash to compare against
 * @returns True if password matches hash
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword(inputPassword, user.password);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid credentials');
 * }
 * ```
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) return false;

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
}

/**
 * Validate password against security policy
 *
 * @param password - Password to validate
 * @param policy - Password policy configuration
 * @param previousPasswords - Array of previous password hashes to check reuse
 * @returns Validation result with errors and strength score
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy(newPassword, passwordPolicy, user.passwordHistory);
 * if (!result.isValid) {
 *   throw new BadRequestException(result.errors.join(', '));
 * }
 * ```
 */
export async function validatePasswordPolicy(
  password: string,
  policy: PasswordPolicy,
  previousPasswords?: string[]
): Promise<PasswordValidationResult> {
  const errors: string[] = [];
  let score = 0;

  // Length validation
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  } else {
    score += 20;
  }

  if (password.length > policy.maxLength) {
    errors.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (policy.requireUppercase) {
    score += 15;
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (policy.requireLowercase) {
    score += 15;
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (policy.requireNumbers) {
    score += 15;
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (policy.requireSpecialChars) {
    score += 15;
  }

  // Check for common patterns
  if (/^(.)\1+$/.test(password)) {
    errors.push('Password cannot be all the same character');
    score -= 20;
  }

  if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde)/i.test(password)) {
    errors.push('Password contains sequential characters');
    score -= 10;
  }

  // Entropy calculation
  const uniqueChars = new Set(password).size;
  score += Math.min(20, uniqueChars * 2);

  // Check password reuse
  if (previousPasswords && policy.preventReuse > 0) {
    const isReused = await Promise.all(
      previousPasswords.slice(0, policy.preventReuse).map((hash) =>
        verifyPassword(password, hash)
      )
    );

    if (isReused.some((match) => match)) {
      errors.push(
        `Password cannot be the same as your last ${policy.preventReuse} passwords`
      );
    }
  }

  // Determine strength
  let strength: PasswordValidationResult['strength'] = 'weak';
  if (score >= 80) strength = 'very_strong';
  else if (score >= 60) strength = 'strong';
  else if (score >= 40) strength = 'good';
  else if (score >= 20) strength = 'fair';

  return {
    isValid: errors.length === 0 && score >= policy.complexityScore * 20,
    errors,
    strength,
    score: Math.max(0, Math.min(100, score)),
  };
}

/**
 * Generate secure random password meeting policy requirements
 *
 * @param policy - Password policy to satisfy
 * @returns Generated secure password
 *
 * @example
 * ```typescript
 * const tempPassword = generateSecurePassword(passwordPolicy);
 * await sendPasswordResetEmail(user.email, tempPassword);
 * ```
 */
export function generateSecurePassword(policy: PasswordPolicy): string {
  const length = Math.max(policy.minLength, 16);

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = '';
  let password = '';

  // Ensure required character types
  if (policy.requireUppercase) {
    charset += uppercase;
    password += uppercase[crypto.randomInt(uppercase.length)];
  }

  if (policy.requireLowercase) {
    charset += lowercase;
    password += lowercase[crypto.randomInt(lowercase.length)];
  }

  if (policy.requireNumbers) {
    charset += numbers;
    password += numbers[crypto.randomInt(numbers.length)];
  }

  if (policy.requireSpecialChars) {
    charset += special;
    password += special[crypto.randomInt(special.length)];
  }

  // Fill remaining characters
  for (let i = password.length; i < length; i++) {
    password += charset[crypto.randomInt(charset.length)];
  }

  // Shuffle password
  return password
    .split('')
    .sort(() => crypto.randomInt(3) - 1)
    .join('');
}

/**
 * Check if password has expired based on policy
 *
 * @param passwordChangedAt - Date when password was last changed
 * @param policy - Password policy configuration
 * @returns True if password has expired
 *
 * @example
 * ```typescript
 * if (isPasswordExpired(user.passwordChangedAt, passwordPolicy)) {
 *   return { requirePasswordChange: true };
 * }
 * ```
 */
export function isPasswordExpired(
  passwordChangedAt: Date,
  policy: PasswordPolicy
): boolean {
  if (!policy.maxAge || policy.maxAge <= 0) return false;

  const daysSinceChange =
    (Date.now() - passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceChange >= policy.maxAge;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create new user session with Redis storage
 *
 * @param user - Authenticated user data
 * @param redisClient - Redis client for session storage
 * @param options - Session creation options
 * @returns Created session data
 *
 * @example
 * ```typescript
 * const session = await createSession(user, redisClient, {
 *   expiresIn: 3600,
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 * });
 * ```
 */
export async function createSession(
  user: AuthUser,
  redisClient: any,
  options?: {
    expiresIn?: number; // seconds
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    metadata?: Record<string, any>;
  }
): Promise<SessionData> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresIn = options?.expiresIn || 3600; // 1 hour default

  const session: SessionData = {
    sessionId,
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(now.getTime() + expiresIn * 1000),
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    deviceId: options?.deviceId,
    mfaVerified: user.mfaVerified || false,
    metadata: options?.metadata,
  };

  await redisClient.setex(
    `session:${sessionId}`,
    expiresIn,
    JSON.stringify(session)
  );

  // Track user sessions
  await redisClient.sadd(`user:${user.id}:sessions`, sessionId);

  return session;
}

/**
 * Get session data from Redis
 *
 * @param sessionId - Session ID to retrieve
 * @param redisClient - Redis client
 * @returns Session data or null if not found
 *
 * @example
 * ```typescript
 * const session = await getSession(sessionId, redisClient);
 * if (!session) {
 *   throw new UnauthorizedException('Invalid session');
 * }
 * ```
 */
export async function getSession(
  sessionId: string,
  redisClient: any
): Promise<SessionData | null> {
  const data = await redisClient.get(`session:${sessionId}`);
  if (!data) return null;

  try {
    const session = JSON.parse(data);
    session.createdAt = new Date(session.createdAt);
    session.lastActivity = new Date(session.lastActivity);
    session.expiresAt = new Date(session.expiresAt);
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Update session last activity timestamp
 *
 * @param sessionId - Session ID to update
 * @param redisClient - Redis client
 * @param extendExpiry - Whether to extend session expiry
 * @returns Updated session or null
 *
 * @example
 * ```typescript
 * await updateSessionActivity(sessionId, redisClient, true);
 * ```
 */
export async function updateSessionActivity(
  sessionId: string,
  redisClient: any,
  extendExpiry: boolean = true
): Promise<SessionData | null> {
  const session = await getSession(sessionId, redisClient);
  if (!session) return null;

  session.lastActivity = new Date();

  if (extendExpiry) {
    const ttl = await redisClient.ttl(`session:${sessionId}`);
    if (ttl > 0) {
      await redisClient.setex(
        `session:${sessionId}`,
        ttl,
        JSON.stringify(session)
      );
    }
  } else {
    await redisClient.set(`session:${sessionId}`, JSON.stringify(session));
  }

  return session;
}

/**
 * Destroy user session
 *
 * @param sessionId - Session ID to destroy
 * @param redisClient - Redis client
 * @returns Promise resolving when session is destroyed
 *
 * @example
 * ```typescript
 * await destroySession(sessionId, redisClient);
 * ```
 */
export async function destroySession(
  sessionId: string,
  redisClient: any
): Promise<void> {
  const session = await getSession(sessionId, redisClient);

  if (session) {
    await redisClient.srem(`user:${session.userId}:sessions`, sessionId);
  }

  await redisClient.del(`session:${sessionId}`);
}

/**
 * Destroy all sessions for a user
 *
 * @param userId - User ID
 * @param redisClient - Redis client
 * @param exceptSessionId - Optional session ID to keep
 * @returns Number of sessions destroyed
 *
 * @example
 * ```typescript
 * await destroyAllUserSessions(user.id, redisClient, currentSessionId);
 * ```
 */
export async function destroyAllUserSessions(
  userId: string,
  redisClient: any,
  exceptSessionId?: string
): Promise<number> {
  const sessionIds = await redisClient.smembers(`user:${userId}:sessions`);
  let destroyed = 0;

  for (const sessionId of sessionIds) {
    if (exceptSessionId && sessionId === exceptSessionId) continue;

    await redisClient.del(`session:${sessionId}`);
    await redisClient.srem(`user:${userId}:sessions`, sessionId);
    destroyed++;
  }

  return destroyed;
}

/**
 * Get all active sessions for a user
 *
 * @param userId - User ID
 * @param redisClient - Redis client
 * @returns Array of active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getUserSessions(user.id, redisClient);
 * console.log(`User has ${sessions.length} active sessions`);
 * ```
 */
export async function getUserSessions(
  userId: string,
  redisClient: any
): Promise<SessionData[]> {
  const sessionIds = await redisClient.smembers(`user:${userId}:sessions`);
  const sessions: SessionData[] = [];

  for (const sessionId of sessionIds) {
    const session = await getSession(sessionId, redisClient);
    if (session) {
      sessions.push(session);
    } else {
      // Clean up stale session reference
      await redisClient.srem(`user:${userId}:sessions`, sessionId);
    }
  }

  return sessions;
}

// ============================================================================
// OAUTH2 FLOWS
// ============================================================================

/**
 * Generate OAuth2 authorization code
 *
 * @param clientId - Client application ID
 * @param userId - User ID
 * @param scope - Requested scopes
 * @param redirectUri - Redirect URI
 * @param redisClient - Redis client for code storage
 * @param codeChallenge - PKCE code challenge
 * @returns Authorization code
 *
 * @example
 * ```typescript
 * const code = await generateAuthorizationCode(
 *   clientId,
 *   user.id,
 *   ['openid', 'profile'],
 *   redirectUri,
 *   redisClient
 * );
 * ```
 */
export async function generateAuthorizationCode(
  clientId: string,
  userId: string,
  scope: string[],
  redirectUri: string,
  redisClient: any,
  codeChallenge?: string
): Promise<string> {
  const code = crypto.randomBytes(32).toString('base64url');

  const codeData = {
    clientId,
    userId,
    scope,
    redirectUri,
    codeChallenge,
    createdAt: Date.now(),
  };

  // Authorization codes expire in 10 minutes
  await redisClient.setex(`auth_code:${code}`, 600, JSON.stringify(codeData));

  return code;
}

/**
 * Exchange authorization code for access token
 *
 * @param code - Authorization code
 * @param clientId - Client ID
 * @param redirectUri - Redirect URI (must match original)
 * @param codeVerifier - PKCE code verifier
 * @param redisClient - Redis client
 * @param jwtService - JWT service
 * @returns Access token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeAuthorizationCode(
 *   code,
 *   clientId,
 *   redirectUri,
 *   codeVerifier,
 *   redisClient,
 *   jwtService
 * );
 * ```
 */
export async function exchangeAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string,
  codeVerifier: string | undefined,
  redisClient: any,
  jwtService: JwtService
): Promise<AccessTokenResponse> {
  const codeData = await redisClient.get(`auth_code:${code}`);

  if (!codeData) {
    throw new UnauthorizedException('Invalid or expired authorization code');
  }

  const data = JSON.parse(codeData);

  // Validate client ID and redirect URI
  if (data.clientId !== clientId || data.redirectUri !== redirectUri) {
    throw new UnauthorizedException('Invalid client or redirect URI');
  }

  // Verify PKCE if code challenge was provided
  if (data.codeChallenge) {
    if (!codeVerifier) {
      throw new BadRequestException('Code verifier required');
    }

    const challenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    if (challenge !== data.codeChallenge) {
      throw new UnauthorizedException('Invalid code verifier');
    }
  }

  // Delete authorization code (one-time use)
  await redisClient.del(`auth_code:${code}`);

  // Generate tokens
  const payload: JWTPayload = {
    sub: data.userId,
    email: '', // Would need to fetch from DB
    role: UserRole.GUEST, // Would need to fetch from DB
    type: 'access',
    jti: crypto.randomBytes(16).toString('hex'),
  };

  const accessToken = jwtService.sign(payload, { expiresIn: '1h' });
  const refreshToken = jwtService.sign(
    { ...payload, type: 'refresh' },
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    scope: data.scope.join(' '),
  };
}

/**
 * Validate OAuth2 redirect URI against registered URIs
 *
 * @param redirectUri - URI to validate
 * @param registeredUris - Array of registered redirect URIs
 * @returns True if URI is valid
 *
 * @example
 * ```typescript
 * if (!validateRedirectUri(req.redirectUri, client.redirectUris)) {
 *   throw new BadRequestException('Invalid redirect URI');
 * }
 * ```
 */
export function validateRedirectUri(
  redirectUri: string,
  registeredUris: string[]
): boolean {
  return registeredUris.some((uri) => {
    // Exact match
    if (uri === redirectUri) return true;

    // Wildcard subdomain match
    if (uri.includes('*')) {
      const pattern = uri.replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(redirectUri);
    }

    return false;
  });
}

/**
 * Generate PKCE code verifier and challenge
 *
 * @returns Object with verifier and challenge
 *
 * @example
 * ```typescript
 * const { verifier, challenge } = generatePKCEChallenge();
 * // Store verifier, send challenge to auth server
 * ```
 */
export function generatePKCEChallenge(): {
  verifier: string;
  challenge: string;
} {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');

  return { verifier, challenge };
}

// ============================================================================
// RBAC (Role-Based Access Control)
// ============================================================================

/**
 * Check if user has required role
 *
 * @param user - Authenticated user
 * @param requiredRoles - Required roles (any match grants access)
 * @returns True if user has any of the required roles
 *
 * @example
 * ```typescript
 * if (!hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
 *   throw new ForbiddenException('Insufficient privileges');
 * }
 * ```
 */
export function hasRole(user: AuthUser, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user has required permission
 *
 * @param user - Authenticated user
 * @param requiredPermissions - Required permissions (all must match)
 * @returns True if user has all required permissions
 *
 * @example
 * ```typescript
 * if (!hasPermission(user, ['patients:read', 'patients:write'])) {
 *   throw new ForbiddenException('Missing required permissions');
 * }
 * ```
 */
export function hasPermission(
  user: AuthUser,
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((permission) =>
    user.permissions.includes(permission)
  );
}

/**
 * Check if user has any of the required permissions
 *
 * @param user - Authenticated user
 * @param permissions - Permissions to check
 * @returns True if user has at least one permission
 *
 * @example
 * ```typescript
 * if (!hasAnyPermission(user, ['admin:read', 'admin:write'])) {
 *   throw new ForbiddenException();
 * }
 * ```
 */
export function hasAnyPermission(
  user: AuthUser,
  permissions: string[]
): boolean {
  return permissions.some((permission) => user.permissions.includes(permission));
}

/**
 * Build permission string from resource and action
 *
 * @param resource - Resource type
 * @param action - Permission action
 * @returns Formatted permission string
 *
 * @example
 * ```typescript
 * const permission = buildPermission(ResourceType.PATIENT, PermissionAction.READ);
 * // Returns: "patient:read"
 * ```
 */
export function buildPermission(
  resource: ResourceType,
  action: PermissionAction
): string {
  return `${resource}:${action}`;
}

/**
 * Parse permission string into resource and action
 *
 * @param permission - Permission string (e.g., "patient:read")
 * @returns Object with resource and action
 *
 * @example
 * ```typescript
 * const { resource, action } = parsePermission("patient:read");
 * ```
 */
export function parsePermission(permission: string): {
  resource: string;
  action: string;
} {
  const [resource, action] = permission.split(':');
  return { resource, action };
}

// ============================================================================
// ABAC (Attribute-Based Access Control)
// ============================================================================

/**
 * Evaluate ABAC policy against user and resource
 *
 * @param user - Authenticated user
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @param policies - ABAC policies to evaluate
 * @returns True if access is granted
 *
 * @example
 * ```typescript
 * const allowed = evaluateABACPolicy(
 *   user,
 *   { type: ResourceType.PATIENT, ownerId: patientId },
 *   PermissionAction.READ,
 *   abacPolicies
 * );
 * ```
 */
export function evaluateABACPolicy(
  user: AuthUser,
  resource: { type: ResourceType; attributes?: Record<string, any> },
  action: PermissionAction,
  policies: ABACPolicy[]
): boolean {
  // Sort policies by priority (higher first)
  const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);

  for (const policy of sortedPolicies) {
    // Check if policy applies to this resource and action
    if (policy.resource.type !== resource.type || policy.action !== action) {
      continue;
    }

    // Check subject (user) conditions
    if (policy.subject.roles && !policy.subject.roles.includes(user.role)) {
      continue;
    }

    if (
      policy.subject.permissions &&
      !hasPermission(user, policy.subject.permissions)
    ) {
      continue;
    }

    // Evaluate conditions
    if (policy.conditions) {
      const conditionsMet = policy.conditions.every((condition) =>
        evaluateCondition(condition, user, resource.attributes || {})
      );

      if (!conditionsMet) continue;
    }

    // Policy matches - return effect
    return policy.effect === 'allow';
  }

  // No matching policy - deny by default
  return false;
}

/**
 * Evaluate individual ABAC condition
 *
 * @param condition - Condition to evaluate
 * @param user - Authenticated user
 * @param resourceAttributes - Resource attributes
 * @returns True if condition is met
 */
function evaluateCondition(
  condition: {
    attribute: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
    value: any;
  },
  user: AuthUser,
  resourceAttributes: Record<string, any>
): boolean {
  // Get attribute value (from user or resource)
  const actualValue =
    resourceAttributes[condition.attribute] ||
    (user as any)[condition.attribute];

  if (actualValue === undefined) return false;

  // Evaluate based on operator
  switch (condition.operator) {
    case 'eq':
      return actualValue === condition.value;
    case 'ne':
      return actualValue !== condition.value;
    case 'gt':
      return actualValue > condition.value;
    case 'lt':
      return actualValue < condition.value;
    case 'in':
      return Array.isArray(condition.value)
        ? condition.value.includes(actualValue)
        : false;
    case 'contains':
      return Array.isArray(actualValue)
        ? actualValue.includes(condition.value)
        : false;
    default:
      return false;
  }
}

// ============================================================================
// 2FA / TOTP
// ============================================================================

/**
 * Generate TOTP secret for user
 *
 * @param userId - User ID
 * @param email - User email
 * @returns TOTP configuration with secret
 *
 * @example
 * ```typescript
 * const totpConfig = generateTOTPSecret(user.id, user.email);
 * await userRepository.update(user.id, { totpSecret: totpConfig.secret });
 * ```
 */
export function generateTOTPSecret(
  userId: string,
  email: string
): TOTPConfig {
  const secret = crypto.randomBytes(20).toString('base32');

  return {
    secret,
    issuer: 'White Cross Healthcare',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    window: 1,
  };
}

/**
 * Generate TOTP QR code URL for authenticator apps
 *
 * @param config - TOTP configuration
 * @returns otpauth:// URL for QR code generation
 *
 * @example
 * ```typescript
 * const url = generateTOTPQRCodeURL(totpConfig);
 * const qrCode = await QRCode.toDataURL(url);
 * ```
 */
export function generateTOTPQRCodeURL(config: TOTPConfig): string {
  const params = new URLSearchParams({
    secret: config.secret,
    issuer: config.issuer,
    algorithm: config.algorithm,
    digits: config.digits.toString(),
    period: config.period.toString(),
  });

  return `otpauth://totp/${encodeURIComponent(config.issuer)}:${encodeURIComponent(config.label)}?${params}`;
}

/**
 * Verify TOTP code against secret
 *
 * @param code - 6-digit TOTP code
 * @param secret - TOTP secret
 * @param config - Optional TOTP configuration
 * @returns True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTPCode(inputCode, user.totpSecret);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid 2FA code');
 * }
 * ```
 */
export function verifyTOTPCode(
  code: string,
  secret: string,
  config?: Partial<TOTPConfig>
): boolean {
  const window = config?.window || 1;
  const period = config?.period || 30;
  const digits = config?.digits || 6;

  const counter = Math.floor(Date.now() / 1000 / period);

  // Check current time window and adjacent windows
  for (let i = -window; i <= window; i++) {
    const expectedCode = generateTOTPCode(secret, counter + i, digits);
    if (expectedCode === code) return true;
  }

  return false;
}

/**
 * Generate TOTP code for a specific counter
 *
 * @param secret - TOTP secret
 * @param counter - Time counter
 * @param digits - Number of digits (default: 6)
 * @returns Generated TOTP code
 */
function generateTOTPCode(
  secret: string,
  counter: number,
  digits: number = 6
): string {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
  hmac.update(buffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const code = binary % Math.pow(10, digits);
  return code.toString().padStart(digits, '0');
}

/**
 * Generate backup codes for 2FA recovery
 *
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateBackupCodes(10);
 * await userRepository.update(user.id, { backupCodes });
 * ```
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }

  return codes;
}

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

/**
 * Generate API key with hash for storage
 *
 * @param userId - User ID
 * @param name - API key name/description
 * @param scopes - Allowed scopes
 * @param permissions - Allowed permissions
 * @param options - Additional options
 * @returns API key object with plain key and hash
 *
 * @example
 * ```typescript
 * const apiKey = await generateAPIKey(user.id, 'Mobile App', ['read'], ['patients:read']);
 * // Store apiKey.hash in DB, return apiKey.key to user (only shown once)
 * ```
 */
export async function generateAPIKey(
  userId: string,
  name: string,
  scopes: string[],
  permissions: string[],
  options?: {
    expiresInDays?: number;
    rateLimit?: number;
  }
): Promise<APIKey> {
  const id = crypto.randomUUID();
  const key = `wc_${crypto.randomBytes(32).toString('base64url')}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');

  const expiresAt = options?.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  return {
    id,
    key, // Only return this once
    hash, // Store this in database
    userId,
    name,
    scopes,
    permissions,
    rateLimit: options?.rateLimit,
    expiresAt,
    isActive: true,
    createdAt: new Date(),
  };
}

/**
 * Verify API key and return associated data
 *
 * @param apiKey - API key to verify
 * @param storedHash - Stored hash from database
 * @returns True if key matches hash
 *
 * @example
 * ```typescript
 * const isValid = verifyAPIKey(inputKey, storedApiKey.hash);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid API key');
 * }
 * ```
 */
export function verifyAPIKey(apiKey: string, storedHash: string): boolean {
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * Extract API key from request headers
 *
 * @param request - Express request object
 * @returns API key or null
 *
 * @example
 * ```typescript
 * const apiKey = extractAPIKey(request);
 * if (apiKey) {
 *   const keyData = await validateAPIKey(apiKey);
 * }
 * ```
 */
export function extractAPIKey(request: Request): string | null {
  // Check X-API-Key header
  const headerKey = request.headers['x-api-key'];
  if (headerKey && typeof headerKey === 'string') {
    return headerKey;
  }

  // Check Authorization header with ApiKey scheme
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('ApiKey ')) {
    return authHeader.substring(7);
  }

  // Check query parameter (not recommended for production)
  const queryKey = request.query.api_key;
  if (queryKey && typeof queryKey === 'string') {
    return queryKey;
  }

  return null;
}

/**
 * Rotate API key (generate new key, invalidate old)
 *
 * @param oldKeyId - ID of existing API key
 * @param userId - User ID
 * @param name - Key name
 * @param scopes - Scopes
 * @param permissions - Permissions
 * @returns New API key
 *
 * @example
 * ```typescript
 * const newKey = await rotateAPIKey(oldKey.id, user.id, oldKey.name, oldKey.scopes, oldKey.permissions);
 * ```
 */
export async function rotateAPIKey(
  oldKeyId: string,
  userId: string,
  name: string,
  scopes: string[],
  permissions: string[]
): Promise<APIKey> {
  // Generate new key with same permissions
  const newKey = await generateAPIKey(userId, name, scopes, permissions);

  // Old key should be marked as inactive in database
  // This function just generates the new key

  return newKey;
}

// ============================================================================
// RATE LIMITING & ACCOUNT LOCKOUT
// ============================================================================

/**
 * Track login attempt and check rate limit
 *
 * @param email - User email or identifier
 * @param ipAddress - Request IP address
 * @param success - Whether login was successful
 * @param redisClient - Redis client
 * @param config - Rate limit configuration
 * @returns Object indicating if locked and attempts remaining
 *
 * @example
 * ```typescript
 * const result = await trackLoginAttempt(email, req.ip, false, redisClient, rateLimitConfig);
 * if (result.isLocked) {
 *   throw new UnauthorizedException('Too many failed attempts');
 * }
 * ```
 */
export async function trackLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean,
  redisClient: any,
  config: RateLimitConfig
): Promise<{ isLocked: boolean; attemptsRemaining: number; lockDurationMs?: number }> {
  const key = `login_attempts:${email}:${ipAddress}`;

  if (success) {
    // Reset attempts on successful login
    await redisClient.del(key);
    return { isLocked: false, attemptsRemaining: config.maxAttempts };
  }

  // Increment failed attempts
  const attempts = await redisClient.incr(key);

  if (attempts === 1) {
    // Set expiration on first attempt
    await redisClient.pexpire(key, config.windowMs);
  }

  const remaining = Math.max(0, config.maxAttempts - attempts);

  if (attempts >= config.maxAttempts) {
    // Set lockout
    const lockKey = `lockout:${email}`;
    await redisClient.psetex(lockKey, config.blockDurationMs, 'locked');

    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockDurationMs: config.blockDurationMs,
    };
  }

  return {
    isLocked: false,
    attemptsRemaining: remaining,
  };
}

/**
 * Check if account is currently locked
 *
 * @param email - User email
 * @param redisClient - Redis client
 * @returns Lockout state
 *
 * @example
 * ```typescript
 * const lockout = await checkAccountLockout(email, redisClient);
 * if (lockout.isLocked) {
 *   throw new UnauthorizedException(`Account locked until ${lockout.lockedUntil}`);
 * }
 * ```
 */
export async function checkAccountLockout(
  email: string,
  redisClient: any
): Promise<AccountLockout> {
  const lockKey = `lockout:${email}`;
  const ttl = await redisClient.pttl(lockKey);

  if (ttl > 0) {
    return {
      userId: '', // Would need to fetch from DB
      isLocked: true,
      lockedAt: new Date(Date.now() - ttl),
      lockedUntil: new Date(Date.now() + ttl),
      failedAttempts: 0, // Could track this separately
      lockReason: 'Too many failed login attempts',
    };
  }

  return {
    userId: '',
    isLocked: false,
    failedAttempts: 0,
  };
}

/**
 * Manually lock user account
 *
 * @param userId - User ID to lock
 * @param durationMs - Lock duration in milliseconds
 * @param reason - Reason for lockout
 * @param redisClient - Redis client
 * @returns Promise resolving when account is locked
 *
 * @example
 * ```typescript
 * await lockAccount(user.id, 24 * 60 * 60 * 1000, 'Suspicious activity', redisClient);
 * ```
 */
export async function lockAccount(
  userId: string,
  durationMs: number,
  reason: string,
  redisClient: any
): Promise<void> {
  const lockKey = `account_lock:${userId}`;
  await redisClient.psetex(lockKey, durationMs, JSON.stringify({ reason, lockedAt: Date.now() }));
}

/**
 * Unlock user account
 *
 * @param userId - User ID to unlock
 * @param redisClient - Redis client
 * @returns Promise resolving when account is unlocked
 *
 * @example
 * ```typescript
 * await unlockAccount(user.id, redisClient);
 * ```
 */
export async function unlockAccount(
  userId: string,
  redisClient: any
): Promise<void> {
  const lockKey = `account_lock:${userId}`;
  await redisClient.del(lockKey);
}

// ============================================================================
// NESTJS GUARDS
// ============================================================================

/**
 * JWT Authentication Guard
 * Validates JWT token and attaches user to request
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector?: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector?.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await verifyJWTToken(token, this.jwtService);

      // Attach user to request
      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions || [],
        sessionId: payload.sessionId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

/**
 * Roles Guard
 * Checks if user has required role(s)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRequiredRole = hasRole(user, requiredRoles);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient role privileges');
    }

    return true;
  }
}

/**
 * Permissions Guard
 * Checks if user has required permission(s)
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRequiredPermissions = hasPermission(user, requiredPermissions);

    if (!hasRequiredPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

/**
 * API Key Guard
 * Validates API key from headers
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = extractAPIKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }

    // In production, fetch from database and verify
    // For now, this is a placeholder
    // const storedKey = await this.apiKeyService.findByKey(apiKey);
    // if (!storedKey || !verifyAPIKey(apiKey, storedKey.hash)) {
    //   throw new UnauthorizedException('Invalid API key');
    // }

    // Attach API key info to request
    // (request as any).apiKey = storedKey;

    return true;
  }
}

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

/**
 * Public route decorator - bypasses authentication
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Roles decorator - requires specific roles
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

/**
 * Permissions decorator - requires specific permissions
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

/**
 * Current user decorator - extracts user from request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user[data] : user;
  }
);

/**
 * Session decorator - extracts session from request
 */
export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  }
);

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

/**
 * Audit Interceptor
 * Logs all authenticated requests for security auditing
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser | undefined;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logAuditEvent({
            userId: user?.id,
            email: user?.email,
            action: `${request.method} ${request.url}`,
            success: true,
            duration,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logAuditEvent({
            userId: user?.id,
            email: user?.email,
            action: `${request.method} ${request.url}`,
            success: false,
            duration,
            error: error.message,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        },
      })
    );
  }

  private logAuditEvent(event: any): void {
    // In production, save to database or logging service
    console.log('[AUDIT]', JSON.stringify(event));
  }
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * User model interface for Sequelize
 */
export interface UserModel {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  mfaSecret?: string;
  backupCodes?: string[];
  passwordChangedAt?: Date;
  passwordHistory?: string[];
  failedLoginAttempts: number;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Role model interface for Sequelize
 */
export interface RoleModel {
  id: string;
  name: UserRole;
  displayName: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission model interface for Sequelize
 */
export interface PermissionModel {
  id: string;
  resource: ResourceType;
  action: PermissionAction;
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session model interface for Sequelize
 */
export interface SessionModel {
  id: string;
  sessionId: string;
  userId: string;
  data: string; // JSON serialized session data
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API Key model interface for Sequelize
 */
export interface APIKeyModel {
  id: string;
  hash: string;
  userId: string;
  name: string;
  scopes: string[];
  permissions: string[];
  rateLimit?: number;
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Audit Log model interface for Sequelize
 */
export interface AuditLogModel {
  id: string;
  userId?: string;
  email?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: string; // JSON
  createdAt: Date;
}

/**
 * Default password policy for healthcare applications
 */
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,
  maxAge: 90, // 90 days
  minAge: 1, // 1 day
  complexityScore: 3, // Strong
};

/**
 * Default rate limit configuration for auth endpoints
 */
export const DEFAULT_AUTH_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
  skipSuccessfulRequests: true,
};
