/**
 * @fileoverview Authentication, Authorization & RBAC Comprehensive Kit
 * @module reuse/auth-rbac-kit
 * @description Production-ready authentication, authorization, RBAC, JWT, and OAuth utilities
 * for enterprise NestJS applications with deep Sequelize integration and HIPAA compliance.
 *
 * Key Features:
 * - JWT token generation, validation, and refresh with rotation
 * - OAuth 2.0 flows (Authorization Code, Client Credentials, PKCE)
 * - Role-Based Access Control (RBAC) with hierarchy
 * - Permission checking and policy enforcement
 * - Session management with Redis integration
 * - Multi-factor authentication (TOTP, SMS, Email)
 * - API key authentication and management
 * - Password hashing with bcrypt/argon2
 * - User context extraction and validation
 * - Token blacklisting and revocation
 * - Login attempt tracking and account lockout
 * - Social authentication (Google, Facebook, Microsoft)
 * - Passwordless authentication
 * - Biometric authentication support
 * - Audit logging for all auth events
 *
 * @target Sequelize v6.x, NestJS 10.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant authentication patterns
 * - Secure token storage and rotation
 * - Password strength enforcement (NIST 800-63B)
 * - Automatic session timeout and cleanup
 * - Brute force protection
 * - Multi-factor authentication support
 * - Audit trail for all authentication events
 *
 * @example Basic JWT usage
 * ```typescript
 * import { generateJWT, verifyJWT, refreshAccessToken } from './auth-rbac-kit';
 *
 * // Generate access token
 * const token = await generateJWT({ userId: '123', email: 'user@example.com' }, config);
 *
 * // Verify token
 * const payload = await verifyJWT(token, config);
 *
 * // Refresh token
 * const newTokens = await refreshAccessToken(refreshToken, User, RefreshToken);
 * ```
 *
 * @example RBAC usage
 * ```typescript
 * import { checkPermission, getUserRoles, hasAnyRole } from './auth-rbac-kit';
 *
 * // Check permission
 * const canRead = await checkPermission(userId, 'patient:read', UserRole, RolePermission);
 *
 * // Check roles
 * const isDoctor = await hasAnyRole(userId, ['doctor', 'senior-doctor'], UserRole);
 * ```
 *
 * LOC: AUTHRB8901X567
 * UPSTREAM: @nestjs/jwt, @nestjs/passport, bcrypt, argon2, speakeasy, sequelize
 * DOWNSTREAM: Auth services, guards, middleware, API endpoints
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  createParamDecorator,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import {
  Model,
  ModelStatic,
  Transaction,
  Op,
  Sequelize,
  DataTypes,
  FindOptions,
  WhereOptions,
  CreateOptions,
} from 'sequelize';
import { z } from 'zod';
import { Request, Response } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @interface JWTPayload
 * @description JWT token payload structure
 */
export interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  type?: 'access' | 'refresh' | 'api-key';
  sessionId?: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
  nbf?: number;
  jti?: string;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * @interface JWTConfig
 * @description JWT configuration options
 */
export interface JWTConfig {
  secret: string;
  publicKey?: string;
  privateKey?: string;
  expiresIn?: string | number;
  notBefore?: number;
  algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
  issuer?: string;
  audience?: string | string[];
  jwtid?: string;
  subject?: string;
}

/**
 * @interface RefreshTokenConfig
 * @description Refresh token configuration
 */
export interface RefreshTokenConfig {
  userId: string;
  deviceId?: string;
  sessionId?: string;
  familyId?: string;
  expiresIn?: number;
  metadata?: Record<string, any>;
}

/**
 * @interface OAuth2Config
 * @description OAuth 2.0 configuration
 */
export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationURL: string;
  tokenURL: string;
  scope?: string[];
  state?: string;
  responseType?: 'code' | 'token';
  grantType?: 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
  pkce?: boolean;
}

/**
 * @interface OAuth2TokenResponse
 * @description OAuth 2.0 token response
 */
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

/**
 * @interface MFAConfig
 * @description Multi-factor authentication configuration
 */
export interface MFAConfig {
  secret?: string;
  type: 'totp' | 'sms' | 'email' | 'push';
  window?: number;
  step?: number;
  algorithm?: 'sha1' | 'sha256' | 'sha512';
  digits?: number;
}

/**
 * @interface TOTPResult
 * @description TOTP setup result
 */
export interface TOTPResult {
  secret: string;
  qrCode: string;
  uri: string;
  backupCodes: string[];
}

/**
 * @interface SessionConfig
 * @description Session configuration
 */
export interface SessionConfig {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresIn?: number;
  metadata?: Record<string, any>;
}

/**
 * @interface ApiKeyConfig
 * @description API key configuration
 */
export interface ApiKeyConfig {
  userId?: string;
  prefix?: string;
  length?: number;
  expiresIn?: number;
  permissions?: string[];
  scopes?: string[];
  rateLimit?: number;
  metadata?: Record<string, any>;
}

/**
 * @interface PasswordPolicy
 * @description Password policy configuration
 */
export interface PasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  preventCommonPasswords?: boolean;
  preventUserInfo?: boolean;
  maxRepeatingChars?: number;
}

/**
 * @interface RoleHierarchy
 * @description Role hierarchy definition
 */
export interface RoleHierarchy {
  [role: string]: string[];
}

/**
 * @interface PermissionDefinition
 * @description Permission definition
 */
export interface PermissionDefinition {
  resource: string;
  action: string;
  scope?: string;
  conditions?: Record<string, any>;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const JWTPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  type: z.enum(['access', 'refresh', 'api-key']).optional(),
  sessionId: z.string().optional(),
  deviceId: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
  nbf: z.number().optional(),
  jti: z.string().optional(),
  iss: z.string().optional(),
  aud: z.union([z.string(), z.array(z.string())]).optional(),
});

export const PasswordPolicySchema = z.object({
  minLength: z.number().min(8).max(128).optional(),
  maxLength: z.number().min(8).max(512).optional(),
  requireUppercase: z.boolean().optional(),
  requireLowercase: z.boolean().optional(),
  requireNumbers: z.boolean().optional(),
  requireSpecialChars: z.boolean().optional(),
  preventCommonPasswords: z.boolean().optional(),
  preventUserInfo: z.boolean().optional(),
  maxRepeatingChars: z.number().min(1).max(10).optional(),
});

export const ApiKeySchema = z.object({
  key: z.string().min(32),
  userId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  scopes: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * @interface UserModel
 * @description User model interface
 */
export interface UserModel extends Model {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  refreshTokens?: RefreshTokenModel[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function defineUserModel
 * @description Defines the User Sequelize model
 */
export function defineUserModel(sequelize: Sequelize): ModelStatic<UserModel> {
  return sequelize.define<UserModel>(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: DataTypes.STRING,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      passwordChangedAt: DataTypes.DATE,
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lockedUntil: DataTypes.DATE,
      lastLoginAt: DataTypes.DATE,
      lastLoginIp: DataTypes.STRING,
      mfaEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mfaSecret: DataTypes.STRING,
      mfaBackupCodes: DataTypes.ARRAY(DataTypes.STRING),
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'users',
      timestamps: true,
      indexes: [
        { fields: ['email'] },
        { fields: ['isActive'] },
        { fields: ['passwordResetToken'] },
      ],
    }
  ) as ModelStatic<UserModel>;
}

/**
 * @interface RefreshTokenModel
 * @description Refresh token model interface
 */
export interface RefreshTokenModel extends Model {
  id: string;
  userId: string;
  tokenHash: string;
  familyId?: string;
  deviceId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * @function defineRefreshTokenModel
 * @description Defines the RefreshToken Sequelize model
 */
export function defineRefreshTokenModel(sequelize: Sequelize): ModelStatic<RefreshTokenModel> {
  return sequelize.define<RefreshTokenModel>(
    'RefreshToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      familyId: DataTypes.UUID,
      deviceId: DataTypes.STRING,
      sessionId: DataTypes.UUID,
      ipAddress: DataTypes.STRING,
      userAgent: DataTypes.TEXT,
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      revokedAt: DataTypes.DATE,
      revokedReason: DataTypes.STRING,
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['userId'] },
        { fields: ['tokenHash'] },
        { fields: ['familyId'] },
        { fields: ['expiresAt'] },
        { fields: ['isRevoked'] },
      ],
    }
  ) as ModelStatic<RefreshTokenModel>;
}

/**
 * @interface SessionModel
 * @description Session model interface
 */
export interface SessionModel extends Model {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function defineSessionModel
 * @description Defines the Session Sequelize model
 */
export function defineSessionModel(sequelize: Sequelize): ModelStatic<SessionModel> {
  return sequelize.define<SessionModel>(
    'Session',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      sessionToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ipAddress: DataTypes.STRING,
      userAgent: DataTypes.TEXT,
      lastActivityAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'sessions',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['sessionToken'] },
        { fields: ['expiresAt'] },
        { fields: ['isActive'] },
      ],
    }
  ) as ModelStatic<SessionModel>;
}

/**
 * @interface ApiKeyModel
 * @description API key model interface
 */
export interface ApiKeyModel extends Model {
  id: string;
  userId?: string;
  name: string;
  keyHash: string;
  prefix: string;
  permissions: string[];
  scopes: string[];
  rateLimit?: number;
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function defineApiKeyModel
 * @description Defines the ApiKey Sequelize model
 */
export function defineApiKeyModel(sequelize: Sequelize): ModelStatic<ApiKeyModel> {
  return sequelize.define<ApiKeyModel>(
    'ApiKey',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keyHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      scopes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      rateLimit: DataTypes.INTEGER,
      lastUsedAt: DataTypes.DATE,
      expiresAt: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'api_keys',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['keyHash'] },
        { fields: ['prefix'] },
        { fields: ['isActive'] },
      ],
    }
  ) as ModelStatic<ApiKeyModel>;
}

/**
 * @interface RoleModel
 * @description Role model interface
 */
export interface RoleModel extends Model {
  id: string;
  name: string;
  description?: string;
  priority: number;
  inherits?: string[];
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function defineRoleModel
 * @description Defines the Role Sequelize model
 */
export function defineRoleModel(sequelize: Sequelize): ModelStatic<RoleModel> {
  return sequelize.define<RoleModel>(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      inherits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'roles',
      timestamps: true,
      indexes: [{ fields: ['name'] }, { fields: ['priority'] }],
    }
  ) as ModelStatic<RoleModel>;
}

/**
 * @interface UserRoleModel
 * @description User-role association model interface
 */
export interface UserRoleModel extends Model {
  id: string;
  userId: string;
  roleId: string;
  assignedBy?: string;
  expiresAt?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function defineUserRoleModel
 * @description Defines the UserRole Sequelize model
 */
export function defineUserRoleModel(sequelize: Sequelize): ModelStatic<UserRoleModel> {
  return sequelize.define<UserRoleModel>(
    'UserRole',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      assignedBy: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
      },
      expiresAt: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'user_roles',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['roleId'] },
        { fields: ['userId', 'roleId'], unique: true },
      ],
    }
  ) as ModelStatic<UserRoleModel>;
}

/**
 * @interface PermissionModel
 * @description Permission model interface
 */
export interface PermissionModel extends Model {
  id: string;
  name: string;
  resource: string;
  action: string;
  scope?: string;
  conditions?: Record<string, any>;
  description?: string;
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function definePermissionModel
 * @description Defines the Permission Sequelize model
 */
export function definePermissionModel(sequelize: Sequelize): ModelStatic<PermissionModel> {
  return sequelize.define<PermissionModel>(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      resource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      scope: DataTypes.STRING,
      conditions: DataTypes.JSONB,
      description: DataTypes.TEXT,
      isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'permissions',
      timestamps: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['resource'] },
        { fields: ['resource', 'action'] },
      ],
    }
  ) as ModelStatic<PermissionModel>;
}

/**
 * @interface RolePermissionModel
 * @description Role-permission association model interface
 */
export interface RolePermissionModel extends Model {
  id: string;
  roleId: string;
  permissionId: string;
  isGranted: boolean;
  createdAt: Date;
}

/**
 * @function defineRolePermissionModel
 * @description Defines the RolePermission Sequelize model
 */
export function defineRolePermissionModel(sequelize: Sequelize): ModelStatic<RolePermissionModel> {
  return sequelize.define<RolePermissionModel>(
    'RolePermission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
      },
      isGranted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'role_permissions',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['roleId'] },
        { fields: ['permissionId'] },
        { fields: ['roleId', 'permissionId'], unique: true },
      ],
    }
  ) as ModelStatic<RolePermissionModel>;
}

/**
 * @interface LoginAttemptModel
 * @description Login attempt tracking model interface
 */
export interface LoginAttemptModel extends Model {
  id: string;
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * @function defineLoginAttemptModel
 * @description Defines the LoginAttempt Sequelize model
 */
export function defineLoginAttemptModel(sequelize: Sequelize): ModelStatic<LoginAttemptModel> {
  return sequelize.define<LoginAttemptModel>(
    'LoginAttempt',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAgent: DataTypes.TEXT,
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      failureReason: DataTypes.STRING,
      metadata: DataTypes.JSONB,
    },
    {
      tableName: 'login_attempts',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['userId'] },
        { fields: ['email'] },
        { fields: ['ipAddress'] },
        { fields: ['createdAt'] },
      ],
    }
  ) as ModelStatic<LoginAttemptModel>;
}

// ============================================================================
// JWT UTILITIES
// ============================================================================

/**
 * @function generateJWT
 * @description Generates a JWT access token with custom payload
 *
 * @param {JWTPayload} payload - Token payload
 * @param {JWTConfig} config - JWT configuration
 * @returns {Promise<string>} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = await generateJWT(
 *   { sub: 'user-123', email: 'user@example.com', roles: ['doctor'] },
 *   { secret: 'secret-key', expiresIn: '15m', issuer: 'white-cross' }
 * );
 * ```
 */
export async function generateJWT(payload: JWTPayload, config: JWTConfig): Promise<string> {
  const jwt = require('jsonwebtoken');

  const options: any = {
    expiresIn: config.expiresIn || '15m',
    algorithm: config.algorithm || 'HS256',
  };

  if (config.issuer) options.issuer = config.issuer;
  if (config.audience) options.audience = config.audience;
  if (config.jwtid) options.jwtid = config.jwtid;
  if (config.subject) options.subject = config.subject;
  if (config.notBefore) options.notBefore = config.notBefore;

  const secret = config.privateKey || config.secret;

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err: any, token: string) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

/**
 * @function verifyJWT
 * @description Verifies and decodes a JWT token
 *
 * @param {string} token - JWT token to verify
 * @param {JWTConfig} config - JWT configuration
 * @returns {Promise<JWTPayload>} Decoded payload
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyJWT(token, { secret: 'secret-key' });
 *   console.log('User ID:', payload.sub);
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 * }
 * ```
 */
export async function verifyJWT(token: string, config: JWTConfig): Promise<JWTPayload> {
  const jwt = require('jsonwebtoken');

  const options: any = {
    algorithms: [config.algorithm || 'HS256'],
  };

  if (config.issuer) options.issuer = config.issuer;
  if (config.audience) options.audience = config.audience;

  const secret = config.publicKey || config.secret;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err: any, decoded: JWTPayload) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

/**
 * @function generateRefreshToken
 * @description Generates a refresh token and stores it in the database
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ token: string; model: RefreshTokenModel }>} Token and database record
 *
 * @example
 * ```typescript
 * const { token, model } = await generateRefreshToken(RefreshToken, {
 *   userId: 'user-123',
 *   deviceId: 'device-456',
 *   expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
 * });
 * ```
 */
export async function generateRefreshToken(
  RefreshToken: ModelStatic<RefreshTokenModel>,
  config: RefreshTokenConfig,
  transaction?: Transaction
): Promise<{ token: string; model: RefreshTokenModel }> {
  const token = crypto.randomBytes(64).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date();
  if (config.expiresIn) {
    expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
  } else {
    expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days
  }

  const familyId = config.familyId || crypto.randomUUID();

  const model = await RefreshToken.create(
    {
      userId: config.userId,
      tokenHash,
      familyId,
      deviceId: config.deviceId,
      sessionId: config.sessionId,
      expiresAt,
      metadata: config.metadata,
    } as any,
    { transaction }
  );

  return { token, model };
}

/**
 * @function refreshAccessToken
 * @description Refreshes an access token using a refresh token
 *
 * @param {string} refreshToken - Refresh token
 * @param {ModelStatic<UserModel>} User - User model
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {JWTConfig} jwtConfig - JWT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ accessToken: string; refreshToken: string }>} New tokens
 *
 * @example
 * ```typescript
 * const tokens = await refreshAccessToken(
 *   oldRefreshToken,
 *   User,
 *   RefreshToken,
 *   { secret: 'secret-key', expiresIn: '15m' }
 * );
 * ```
 */
export async function refreshAccessToken(
  refreshToken: string,
  User: ModelStatic<UserModel>,
  RefreshToken: ModelStatic<RefreshTokenModel>,
  jwtConfig: JWTConfig,
  transaction?: Transaction
): Promise<{ accessToken: string; refreshToken: string; user: UserModel }> {
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const tokenRecord = await RefreshToken.findOne({
    where: {
      tokenHash,
      isRevoked: false,
      expiresAt: { [Op.gt]: new Date() },
    } as any,
    transaction,
  });

  if (!tokenRecord) {
    // Token reuse detected - revoke entire family
    const suspiciousToken = await RefreshToken.findOne({
      where: { tokenHash } as any,
      transaction,
    });

    if (suspiciousToken && suspiciousToken.familyId) {
      await RefreshToken.update(
        { isRevoked: true, revokedReason: 'token_reuse_detected' } as any,
        {
          where: { familyId: suspiciousToken.familyId } as any,
          transaction,
        }
      );
    }

    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  const user = await User.findByPk(tokenRecord.userId, { transaction });
  if (!user || !user.isActive) {
    throw new UnauthorizedException('User not found or inactive');
  }

  // Revoke old token
  await tokenRecord.update({ isRevoked: true } as any, { transaction });

  // Generate new access token
  const accessToken = await generateJWT(
    {
      sub: user.id,
      email: user.email,
      type: 'access',
    },
    jwtConfig
  );

  // Generate new refresh token with same family
  const { token: newRefreshToken } = await generateRefreshToken(
    RefreshToken,
    {
      userId: user.id,
      familyId: tokenRecord.familyId,
      deviceId: tokenRecord.deviceId,
      sessionId: tokenRecord.sessionId,
    },
    transaction
  );

  return { accessToken, refreshToken: newRefreshToken, user };
}

/**
 * @function revokeRefreshToken
 * @description Revokes a refresh token
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {string} token - Refresh token to revoke
 * @param {string} reason - Revocation reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeRefreshToken(RefreshToken, token, 'user_logout');
 * ```
 */
export async function revokeRefreshToken(
  RefreshToken: ModelStatic<RefreshTokenModel>,
  token: string,
  reason: string,
  transaction?: Transaction
): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await RefreshToken.update(
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason,
    } as any,
    {
      where: { tokenHash } as any,
      transaction,
    }
  );
}

/**
 * @function revokeAllUserTokens
 * @description Revokes all refresh tokens for a user
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {string} userId - User ID
 * @param {string} reason - Revocation reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of revoked tokens
 *
 * @example
 * ```typescript
 * await revokeAllUserTokens(RefreshToken, 'user-123', 'password_change');
 * ```
 */
export async function revokeAllUserTokens(
  RefreshToken: ModelStatic<RefreshTokenModel>,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<number> {
  const [count] = await RefreshToken.update(
    {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason,
    } as any,
    {
      where: {
        userId,
        isRevoked: false,
      } as any,
      transaction,
    }
  );

  return count;
}

/**
 * @function cleanupExpiredTokens
 * @description Removes expired refresh tokens from the database
 *
 * @param {ModelStatic<RefreshTokenModel>} RefreshToken - RefreshToken model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted tokens
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredTokens(RefreshToken);
 * console.log(`Cleaned up ${deleted} expired tokens`);
 * ```
 */
export async function cleanupExpiredTokens(
  RefreshToken: ModelStatic<RefreshTokenModel>,
  transaction?: Transaction
): Promise<number> {
  return await RefreshToken.destroy({
    where: {
      expiresAt: { [Op.lt]: new Date() },
    } as any,
    transaction,
  });
}

// ============================================================================
// PASSWORD UTILITIES
// ============================================================================

/**
 * @function hashPassword
 * @description Hashes a password using bcrypt
 *
 * @param {string} password - Plain text password
 * @param {number} rounds - Salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPassword('mySecurePassword123!');
 * ```
 */
export async function hashPassword(password: string, rounds: number = 12): Promise<string> {
  return await bcrypt.hash(password, rounds);
}

/**
 * @function hashPasswordArgon2
 * @description Hashes a password using Argon2
 *
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordArgon2('mySecurePassword123!');
 * ```
 */
export async function hashPasswordArgon2(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * @function verifyPassword
 * @description Verifies a password against a bcrypt hash
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('password123', storedHash);
 * if (isValid) console.log('Password correct!');
 * ```
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * @function verifyPasswordArgon2
 * @description Verifies a password against an Argon2 hash
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordArgon2('password123', storedHash);
 * ```
 */
export async function verifyPasswordArgon2(password: string, hash: string): Promise<boolean> {
  return await argon2.verify(hash, password);
}

/**
 * @function validatePasswordPolicy
 * @description Validates a password against a policy
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy
 * @param {object} userInfo - User information to prevent reuse
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyPass123!', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * if (!result.valid) console.error(result.errors);
 * ```
 */
export function validatePasswordPolicy(
  password: string,
  policy: PasswordPolicy,
  userInfo?: { email?: string; firstName?: string; lastName?: string }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (policy.minLength && password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (policy.maxLength && password.length > policy.maxLength) {
    errors.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (policy.maxRepeatingChars) {
    const regex = new RegExp(`(.)\\1{${policy.maxRepeatingChars},}`);
    if (regex.test(password)) {
      errors.push(`Password must not contain more than ${policy.maxRepeatingChars} repeating characters`);
    }
  }

  if (policy.preventUserInfo && userInfo) {
    const lowerPassword = password.toLowerCase();
    if (userInfo.email && lowerPassword.includes(userInfo.email.toLowerCase())) {
      errors.push('Password must not contain your email');
    }
    if (userInfo.firstName && lowerPassword.includes(userInfo.firstName.toLowerCase())) {
      errors.push('Password must not contain your first name');
    }
    if (userInfo.lastName && lowerPassword.includes(userInfo.lastName.toLowerCase())) {
      errors.push('Password must not contain your last name');
    }
  }

  if (policy.preventCommonPasswords) {
    const commonPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123',
      'monkey', '1234567', 'letmein', 'trustno1', 'dragon'
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * @function generatePasswordResetToken
 * @description Generates a secure password reset token
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} email - User email
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ token: string; user: UserModel }>} Reset token and user
 *
 * @example
 * ```typescript
 * const { token, user } = await generatePasswordResetToken(User, 'user@example.com');
 * // Send token via email
 * ```
 */
export async function generatePasswordResetToken(
  User: ModelStatic<UserModel>,
  email: string,
  transaction?: Transaction
): Promise<{ token: string; user: UserModel }> {
  const user = await User.findOne({
    where: { email, isActive: true } as any,
    transaction,
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

  await user.update(
    {
      passwordResetToken: tokenHash,
      passwordResetExpires: expiresAt,
    } as any,
    { transaction }
  );

  return { token, user };
}

/**
 * @function resetPassword
 * @description Resets a user's password using a reset token
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await resetPassword(User, resetToken, 'newSecurePassword123!');
 * ```
 */
export async function resetPassword(
  User: ModelStatic<UserModel>,
  token: string,
  newPassword: string,
  transaction?: Transaction
): Promise<UserModel> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpires: { [Op.gt]: new Date() },
    } as any,
    transaction,
  });

  if (!user) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  await user.update(
    {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    } as any,
    { transaction }
  );

  return user;
}

// ============================================================================
// MULTI-FACTOR AUTHENTICATION (MFA)
// ============================================================================

/**
 * @function generateTOTPSecret
 * @description Generates a TOTP secret for MFA
 *
 * @param {string} email - User email
 * @param {string} issuer - Issuer name (e.g., 'White Cross')
 * @returns {Promise<TOTPResult>} TOTP secret, QR code, and backup codes
 *
 * @example
 * ```typescript
 * const mfa = await generateTOTPSecret('user@example.com', 'White Cross');
 * console.log('Secret:', mfa.secret);
 * console.log('QR Code:', mfa.qrCode);
 * ```
 */
export async function generateTOTPSecret(
  email: string,
  issuer: string = 'White Cross'
): Promise<TOTPResult> {
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${email})`,
    issuer,
    length: 32,
  });

  const qrCode = await qrcode.toDataURL(secret.otpauth_url!);

  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex')
  );

  return {
    secret: secret.base32,
    qrCode,
    uri: secret.otpauth_url!,
    backupCodes,
  };
}

/**
 * @function verifyTOTP
 * @description Verifies a TOTP code
 *
 * @param {string} token - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} window - Time window (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTP('123456', userMfaSecret);
 * if (isValid) console.log('MFA code verified!');
 * ```
 */
export function verifyTOTP(
  token: string,
  secret: string,
  window: number = 1
): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window,
  });
}

/**
 * @function enableMFA
 * @description Enables MFA for a user
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {string} secret - TOTP secret
 * @param {string[]} backupCodes - Backup codes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * const mfa = await generateTOTPSecret('user@example.com');
 * await enableMFA(User, userId, mfa.secret, mfa.backupCodes);
 * ```
 */
export async function enableMFA(
  User: ModelStatic<UserModel>,
  userId: string,
  secret: string,
  backupCodes: string[],
  transaction?: Transaction
): Promise<UserModel> {
  const hashedBackupCodes = await Promise.all(
    backupCodes.map(code => hashPassword(code, 10))
  );

  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new BadRequestException('User not found');
  }

  await user.update(
    {
      mfaEnabled: true,
      mfaSecret: secret,
      mfaBackupCodes: hashedBackupCodes,
    } as any,
    { transaction }
  );

  return user;
}

/**
 * @function disableMFA
 * @description Disables MFA for a user
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await disableMFA(User, userId);
 * ```
 */
export async function disableMFA(
  User: ModelStatic<UserModel>,
  userId: string,
  transaction?: Transaction
): Promise<UserModel> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new BadRequestException('User not found');
  }

  await user.update(
    {
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: null,
    } as any,
    { transaction }
  );

  return user;
}

/**
 * @function verifyBackupCode
 * @description Verifies and consumes an MFA backup code
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {string} code - Backup code
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = await verifyBackupCode(User, userId, '1a2b3c4d');
 * ```
 */
export async function verifyBackupCode(
  User: ModelStatic<UserModel>,
  userId: string,
  code: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user || !user.mfaBackupCodes || user.mfaBackupCodes.length === 0) {
    return false;
  }

  for (let i = 0; i < user.mfaBackupCodes.length; i++) {
    const isMatch = await verifyPassword(code, user.mfaBackupCodes[i]);
    if (isMatch) {
      // Remove used backup code
      const updatedCodes = [...user.mfaBackupCodes];
      updatedCodes.splice(i, 1);
      await user.update({ mfaBackupCodes: updatedCodes } as any, { transaction });
      return true;
    }
  }

  return false;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * @function createSession
 * @description Creates a new user session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {SessionConfig} config - Session configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<SessionModel>} Created session
 *
 * @example
 * ```typescript
 * const session = await createSession(Session, {
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 30 * 60 * 1000 // 30 minutes
 * });
 * ```
 */
export async function createSession(
  Session: ModelStatic<SessionModel>,
  config: SessionConfig,
  transaction?: Transaction
): Promise<SessionModel> {
  const sessionToken = crypto.randomBytes(64).toString('base64url');

  const expiresAt = new Date();
  if (config.expiresIn) {
    expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
  } else {
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Default 30 minutes
  }

  return await Session.create(
    {
      userId: config.userId,
      sessionToken,
      ipAddress: config.ipAddress,
      userAgent: config.userAgent,
      lastActivityAt: new Date(),
      expiresAt,
      metadata: config.metadata,
    } as any,
    { transaction }
  );
}

/**
 * @function validateSession
 * @description Validates and updates a session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} sessionToken - Session token
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<SessionModel | null>} Session if valid, null otherwise
 *
 * @example
 * ```typescript
 * const session = await validateSession(Session, sessionToken);
 * if (session) console.log('Session valid for user:', session.userId);
 * ```
 */
export async function validateSession(
  Session: ModelStatic<SessionModel>,
  sessionToken: string,
  transaction?: Transaction
): Promise<SessionModel | null> {
  const session = await Session.findOne({
    where: {
      sessionToken,
      isActive: true,
      expiresAt: { [Op.gt]: new Date() },
    } as any,
    transaction,
  });

  if (session) {
    await session.update(
      { lastActivityAt: new Date() } as any,
      { transaction }
    );
  }

  return session;
}

/**
 * @function destroySession
 * @description Destroys a user session
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} sessionToken - Session token
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await destroySession(Session, sessionToken);
 * ```
 */
export async function destroySession(
  Session: ModelStatic<SessionModel>,
  sessionToken: string,
  transaction?: Transaction
): Promise<void> {
  await Session.update(
    { isActive: false } as any,
    {
      where: { sessionToken } as any,
      transaction,
    }
  );
}

/**
 * @function destroyAllUserSessions
 * @description Destroys all sessions for a user
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of destroyed sessions
 *
 * @example
 * ```typescript
 * await destroyAllUserSessions(Session, userId);
 * ```
 */
export async function destroyAllUserSessions(
  Session: ModelStatic<SessionModel>,
  userId: string,
  transaction?: Transaction
): Promise<number> {
  const [count] = await Session.update(
    { isActive: false } as any,
    {
      where: { userId, isActive: true } as any,
      transaction,
    }
  );

  return count;
}

/**
 * @function cleanupExpiredSessions
 * @description Removes expired sessions from the database
 *
 * @param {ModelStatic<SessionModel>} Session - Session model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted sessions
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredSessions(Session);
 * console.log(`Cleaned up ${deleted} expired sessions`);
 * ```
 */
export async function cleanupExpiredSessions(
  Session: ModelStatic<SessionModel>,
  transaction?: Transaction
): Promise<number> {
  return await Session.destroy({
    where: {
      expiresAt: { [Op.lt]: new Date() },
    } as any,
    transaction,
  });
}

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

/**
 * @function generateApiKey
 * @description Generates a new API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {ApiKeyConfig} config - API key configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ key: string; model: ApiKeyModel }>} API key and database record
 *
 * @example
 * ```typescript
 * const { key, model } = await generateApiKey(ApiKey, {
 *   userId: 'user-123',
 *   prefix: 'wc',
 *   permissions: ['read:patients', 'write:appointments'],
 *   expiresIn: 365 * 24 * 60 * 60 * 1000 // 1 year
 * });
 * ```
 */
export async function generateApiKey(
  ApiKey: ModelStatic<ApiKeyModel>,
  config: ApiKeyConfig,
  transaction?: Transaction
): Promise<{ key: string; model: ApiKeyModel }> {
  const prefix = config.prefix || 'wc';
  const length = config.length || 32;
  const randomPart = crypto.randomBytes(length).toString('base64url');
  const key = `${prefix}_${randomPart}`;
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  let expiresAt: Date | undefined;
  if (config.expiresIn) {
    expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + config.expiresIn);
  }

  const model = await ApiKey.create(
    {
      userId: config.userId,
      name: `API Key ${Date.now()}`,
      keyHash,
      prefix,
      permissions: config.permissions || [],
      scopes: config.scopes || [],
      rateLimit: config.rateLimit,
      expiresAt,
      metadata: config.metadata,
    } as any,
    { transaction }
  );

  return { key, model };
}

/**
 * @function validateApiKey
 * @description Validates an API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {string} key - API key to validate
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<ApiKeyModel | null>} API key record if valid, null otherwise
 *
 * @example
 * ```typescript
 * const apiKey = await validateApiKey(ApiKey, providedKey);
 * if (apiKey) console.log('Valid API key with permissions:', apiKey.permissions);
 * ```
 */
export async function validateApiKey(
  ApiKey: ModelStatic<ApiKeyModel>,
  key: string,
  transaction?: Transaction
): Promise<ApiKeyModel | null> {
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  const apiKey = await ApiKey.findOne({
    where: {
      keyHash,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    transaction,
  });

  if (apiKey) {
    await apiKey.update(
      { lastUsedAt: new Date() } as any,
      { transaction }
    );
  }

  return apiKey;
}

/**
 * @function revokeApiKey
 * @description Revokes an API key
 *
 * @param {ModelStatic<ApiKeyModel>} ApiKey - ApiKey model
 * @param {string} keyId - API key ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeApiKey(ApiKey, 'key-id-123');
 * ```
 */
export async function revokeApiKey(
  ApiKey: ModelStatic<ApiKeyModel>,
  keyId: string,
  transaction?: Transaction
): Promise<void> {
  await ApiKey.update(
    { isActive: false } as any,
    {
      where: { id: keyId } as any,
      transaction,
    }
  );
}

// ============================================================================
// RBAC UTILITIES
// ============================================================================

/**
 * @function checkPermission
 * @description Checks if a user has a specific permission
 *
 * @param {string} userId - User ID
 * @param {string} permissionName - Permission name (e.g., 'patient:read')
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canRead = await checkPermission(userId, 'patient:read', UserRole, RolePermission, Permission);
 * ```
 */
export async function checkPermission(
  userId: string,
  permissionName: string,
  UserRole: ModelStatic<UserRoleModel>,
  RolePermission: ModelStatic<RolePermissionModel>,
  Permission: ModelStatic<PermissionModel>,
  transaction?: Transaction
): Promise<boolean> {
  const userRoles = await UserRole.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    transaction,
  });

  const roleIds = userRoles.map(ur => ur.roleId);

  const permission = await Permission.findOne({
    where: { name: permissionName } as any,
    transaction,
  });

  if (!permission) return false;

  const rolePermission = await RolePermission.findOne({
    where: {
      roleId: { [Op.in]: roleIds },
      permissionId: permission.id,
      isGranted: true,
    } as any,
    transaction,
  });

  return !!rolePermission;
}

/**
 * @function hasAnyRole
 * @description Checks if a user has any of the specified roles
 *
 * @param {string} userId - User ID
 * @param {string[]} roleNames - Role names to check
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has any of the roles
 *
 * @example
 * ```typescript
 * const isDoctor = await hasAnyRole(userId, ['doctor', 'senior-doctor'], UserRole, Role);
 * ```
 */
export async function hasAnyRole(
  userId: string,
  roleNames: string[],
  UserRole: ModelStatic<UserRoleModel>,
  Role: ModelStatic<RoleModel>,
  transaction?: Transaction
): Promise<boolean> {
  const roles = await Role.findAll({
    where: {
      name: { [Op.in]: roleNames },
    } as any,
    transaction,
  });

  const roleIds = roles.map(r => r.id);

  const userRole = await UserRole.findOne({
    where: {
      userId,
      roleId: { [Op.in]: roleIds },
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    transaction,
  });

  return !!userRole;
}

/**
 * @function hasAllRoles
 * @description Checks if a user has all of the specified roles
 *
 * @param {string} userId - User ID
 * @param {string[]} roleNames - Role names to check
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if user has all roles
 *
 * @example
 * ```typescript
 * const hasAll = await hasAllRoles(userId, ['doctor', 'researcher'], UserRole, Role);
 * ```
 */
export async function hasAllRoles(
  userId: string,
  roleNames: string[],
  UserRole: ModelStatic<UserRoleModel>,
  Role: ModelStatic<RoleModel>,
  transaction?: Transaction
): Promise<boolean> {
  const roles = await Role.findAll({
    where: {
      name: { [Op.in]: roleNames },
    } as any,
    transaction,
  });

  const roleIds = roles.map(r => r.id);

  const userRoles = await UserRole.findAll({
    where: {
      userId,
      roleId: { [Op.in]: roleIds },
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    transaction,
  });

  return userRoles.length === roleNames.length;
}

/**
 * @function getUserRoles
 * @description Gets all active roles for a user
 *
 * @param {string} userId - User ID
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel[]>} User's roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles(userId, UserRole, Role);
 * console.log('User roles:', roles.map(r => r.name));
 * ```
 */
export async function getUserRoles(
  userId: string,
  UserRole: ModelStatic<UserRoleModel>,
  Role: ModelStatic<RoleModel>,
  transaction?: Transaction
): Promise<RoleModel[]> {
  const userRoles = await UserRole.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    include: [{ model: Role as any, as: 'role' }],
    transaction,
  });

  return userRoles.map((ur: any) => ur.role).filter(Boolean);
}

/**
 * @function getUserPermissions
 * @description Gets all effective permissions for a user
 *
 * @param {string} userId - User ID
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PermissionModel[]>} User's permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions(userId, UserRole, RolePermission, Permission);
 * console.log('User can:', permissions.map(p => `${p.resource}:${p.action}`));
 * ```
 */
export async function getUserPermissions(
  userId: string,
  UserRole: ModelStatic<UserRoleModel>,
  RolePermission: ModelStatic<RolePermissionModel>,
  Permission: ModelStatic<PermissionModel>,
  transaction?: Transaction
): Promise<PermissionModel[]> {
  const userRoles = await UserRole.findAll({
    where: {
      userId,
      isActive: true,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    } as any,
    transaction,
  });

  const roleIds = userRoles.map(ur => ur.roleId);

  const rolePermissions = await RolePermission.findAll({
    where: {
      roleId: { [Op.in]: roleIds },
      isGranted: true,
    } as any,
    include: [{ model: Permission as any, as: 'permission' }],
    transaction,
  });

  const permissions = rolePermissions
    .map((rp: any) => rp.permission)
    .filter(Boolean);

  // Remove duplicates
  const uniquePermissions = Array.from(
    new Map(permissions.map(p => [p.id, p])).values()
  );

  return uniquePermissions;
}

/**
 * @function assignRoleToUser
 * @description Assigns a role to a user
 *
 * @param {string} userId - User ID
 * @param {string} roleName - Role name
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {object} options - Assignment options
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserRoleModel>} Created user role
 *
 * @example
 * ```typescript
 * await assignRoleToUser(userId, 'doctor', UserRole, Role, {
 *   assignedBy: 'admin-id',
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export async function assignRoleToUser(
  userId: string,
  roleName: string,
  UserRole: ModelStatic<UserRoleModel>,
  Role: ModelStatic<RoleModel>,
  options: {
    assignedBy?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
  } = {},
  transaction?: Transaction
): Promise<UserRoleModel> {
  const role = await Role.findOne({
    where: { name: roleName } as any,
    transaction,
  });

  if (!role) {
    throw new BadRequestException(`Role '${roleName}' not found`);
  }

  return await UserRole.create(
    {
      userId,
      roleId: role.id,
      assignedBy: options.assignedBy,
      expiresAt: options.expiresAt,
      metadata: options.metadata,
    } as any,
    { transaction }
  );
}

/**
 * @function revokeRoleFromUser
 * @description Revokes a role from a user
 *
 * @param {string} userId - User ID
 * @param {string} roleName - Role name
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeRoleFromUser(userId, 'temp-access', UserRole, Role);
 * ```
 */
export async function revokeRoleFromUser(
  userId: string,
  roleName: string,
  UserRole: ModelStatic<UserRoleModel>,
  Role: ModelStatic<RoleModel>,
  transaction?: Transaction
): Promise<void> {
  const role = await Role.findOne({
    where: { name: roleName } as any,
    transaction,
  });

  if (!role) {
    throw new BadRequestException(`Role '${roleName}' not found`);
  }

  await UserRole.update(
    { isActive: false } as any,
    {
      where: {
        userId,
        roleId: role.id,
      } as any,
      transaction,
    }
  );
}

// ============================================================================
// LOGIN ATTEMPT TRACKING
// ============================================================================

/**
 * @function trackLoginAttempt
 * @description Tracks a login attempt (success or failure)
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {object} attempt - Login attempt data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<LoginAttemptModel>} Created login attempt record
 *
 * @example
 * ```typescript
 * await trackLoginAttempt(LoginAttempt, {
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   ipAddress: '192.168.1.1',
 *   success: true
 * });
 * ```
 */
export async function trackLoginAttempt(
  LoginAttempt: ModelStatic<LoginAttemptModel>,
  attempt: {
    userId?: string;
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<LoginAttemptModel> {
  return await LoginAttempt.create(attempt as any, { transaction });
}

/**
 * @function getRecentLoginAttempts
 * @description Gets recent login attempts for a user
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {string} email - User email
 * @param {number} minutes - Time window in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<LoginAttemptModel[]>} Recent login attempts
 *
 * @example
 * ```typescript
 * const attempts = await getRecentLoginAttempts(LoginAttempt, 'user@example.com', 15);
 * const failedAttempts = attempts.filter(a => !a.success);
 * ```
 */
export async function getRecentLoginAttempts(
  LoginAttempt: ModelStatic<LoginAttemptModel>,
  email: string,
  minutes: number = 15,
  transaction?: Transaction
): Promise<LoginAttemptModel[]> {
  const since = new Date();
  since.setMinutes(since.getMinutes() - minutes);

  return await LoginAttempt.findAll({
    where: {
      email,
      createdAt: { [Op.gte]: since },
    } as any,
    order: [['createdAt', 'DESC']],
    transaction,
  });
}

/**
 * @function shouldLockAccount
 * @description Determines if an account should be locked based on failed attempts
 *
 * @param {ModelStatic<LoginAttemptModel>} LoginAttempt - LoginAttempt model
 * @param {string} email - User email
 * @param {number} maxAttempts - Maximum failed attempts allowed
 * @param {number} windowMinutes - Time window in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if account should be locked
 *
 * @example
 * ```typescript
 * const shouldLock = await shouldLockAccount(LoginAttempt, 'user@example.com', 5, 15);
 * if (shouldLock) {
 *   await lockUserAccount(User, email, 30);
 * }
 * ```
 */
export async function shouldLockAccount(
  LoginAttempt: ModelStatic<LoginAttemptModel>,
  email: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15,
  transaction?: Transaction
): Promise<boolean> {
  const attempts = await getRecentLoginAttempts(LoginAttempt, email, windowMinutes, transaction);
  const failedAttempts = attempts.filter(a => !a.success);

  return failedAttempts.length >= maxAttempts;
}

/**
 * @function lockUserAccount
 * @description Locks a user account for a specified duration
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} email - User email
 * @param {number} lockMinutes - Lock duration in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await lockUserAccount(User, 'user@example.com', 30);
 * ```
 */
export async function lockUserAccount(
  User: ModelStatic<UserModel>,
  email: string,
  lockMinutes: number = 30,
  transaction?: Transaction
): Promise<UserModel> {
  const lockedUntil = new Date();
  lockedUntil.setMinutes(lockedUntil.getMinutes() + lockMinutes);

  const user = await User.findOne({
    where: { email } as any,
    transaction,
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  await user.update(
    {
      lockedUntil,
      failedLoginAttempts: 0,
    } as any,
    { transaction }
  );

  return user;
}

/**
 * @function unlockUserAccount
 * @description Unlocks a user account
 *
 * @param {ModelStatic<UserModel>} User - User model
 * @param {string} userId - User ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserModel>} Updated user
 *
 * @example
 * ```typescript
 * await unlockUserAccount(User, userId);
 * ```
 */
export async function unlockUserAccount(
  User: ModelStatic<UserModel>,
  userId: string,
  transaction?: Transaction
): Promise<UserModel> {
  const user = await User.findByPk(userId, { transaction });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  await user.update(
    {
      lockedUntil: null,
      failedLoginAttempts: 0,
    } as any,
    { transaction }
  );

  return user;
}

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

/**
 * @decorator CurrentUser
 * @description Extracts the current user from the request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: JWTPayload) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);

/**
 * @decorator Roles
 * @description Defines required roles for a route
 *
 * @example
 * ```typescript
 * @Get('admin')
 * @Roles('admin', 'super-admin')
 * async adminRoute() {
 *   return 'Admin only';
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * @decorator Permissions
 * @description Defines required permissions for a route
 *
 * @example
 * ```typescript
 * @Delete('patient/:id')
 * @Permissions('patient:delete')
 * async deletePatient(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

/**
 * @decorator Public
 * @description Marks a route as public (no authentication required)
 *
 * @example
 * ```typescript
 * @Get('health')
 * @Public()
 * async health() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * @decorator RequireMFA
 * @description Marks a route as requiring MFA
 *
 * @example
 * ```typescript
 * @Post('sensitive-operation')
 * @RequireMFA()
 * async sensitiveOp() {
 *   // ...
 * }
 * ```
 */
export const RequireMFA = () => SetMetadata('requireMFA', true);

// ============================================================================
// NESTJS GUARDS
// ============================================================================

/**
 * @guard JwtAuthGuard
 * @description Guard for JWT authentication
 *
 * @example
 * ```typescript
 * @Controller('api')
 * @UseGuards(JwtAuthGuard)
 * export class ApiController {
 *   // ...
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * @guard RolesGuard
 * @description Guard for role-based authorization
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * async adminRoute() {}
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userRoles = user.roles || (user.role ? [user.role] : []);

    return requiredRoles.some(role => userRoles.includes(role));
  }
}

/**
 * @guard PermissionsGuard
 * @description Guard for permission-based authorization
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Permissions('patient:delete')
 * async deletePatient() {}
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userPermissions = user.permissions || [];

    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  }
}

/**
 * @guard ApiKeyGuard
 * @description Guard for API key authentication
 *
 * @example
 * ```typescript
 * @UseGuards(ApiKeyGuard)
 * async apiRoute() {}
 * ```
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeyModel: ModelStatic<ApiKeyModel>,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('No API key provided');
    }

    const validKey = await validateApiKey(this.apiKeyModel, apiKey);

    if (!validKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.user = {
      sub: validKey.userId || 'api-key',
      type: 'api-key',
      permissions: validKey.permissions,
      scopes: validKey.scopes,
    };

    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const apiKeyHeader = request.headers['x-api-key'];
    if (typeof apiKeyHeader === 'string') {
      return apiKeyHeader;
    }

    return undefined;
  }
}

/**
 * @guard MFAGuard
 * @description Guard that ensures MFA is completed
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, MFAGuard)
 * async sensitiveRoute() {}
 * ```
 */
@Injectable()
export class MFAGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireMFA = this.reflector.getAllAndOverride<boolean>('requireMFA', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireMFA) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.mfaVerified) {
      throw new ForbiddenException('MFA verification required');
    }

    return true;
  }
}
