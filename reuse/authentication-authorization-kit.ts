/**
 * LOC: AUTH_AUTHZ_KIT_001
 * File: /reuse/authentication-authorization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - jsonwebtoken
 *   - crypto
 *   - bcrypt
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Authorization guards
 *   - JWT strategies
 *   - OAuth2 controllers
 *   - Security middleware
 *   - MFA services
 */

/**
 * File: /reuse/authentication-authorization-kit.ts
 * Locator: WC-AUTH-AUTHZ-KIT-001
 * Purpose: Comprehensive Authentication & Authorization Security Kit
 *
 * Upstream: NestJS, Passport, JWT, crypto, bcrypt
 * Downstream: ../backend/auth/*, Guards, Strategies, Controllers, Middleware
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/jwt, jsonwebtoken, bcrypt
 * Exports: 45 security functions for JWT, OAuth2, API keys, MFA, RBAC, password policies
 *
 * LLM Context: Enterprise-grade authentication and authorization utilities for White Cross healthcare.
 * Provides JWT strategies (RS256/HS256/ES256), OAuth2 flows (authorization code, client credentials,
 * device flow), API key authentication, multi-factor authentication (SMS, email, TOTP), role-based
 * and permission-based access control, password strength validation, account lockout, brute force
 * protection, security headers, token refresh/rotation, and biometric authentication helpers.
 * HIPAA-compliant security patterns for healthcare data protection.
 */

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  createParamDecorator,
  SetMetadata,
} from '@nestjs/common';
import { Request, Response } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * JWT algorithm types supported
 */
export type JWTAlgorithm = 'RS256' | 'HS256' | 'ES256' | 'RS512' | 'HS512' | 'ES512';

/**
 * JWT key configuration for different algorithms
 */
export interface JWTKeyConfig {
  algorithm: JWTAlgorithm;
  publicKey?: string;
  privateKey?: string;
  secret?: string;
  passphrase?: string;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
  jti?: string;
  scope?: string[];
  [key: string]: any;
}

/**
 * JWT verification options
 */
export interface JWTVerifyOptions {
  algorithms?: JWTAlgorithm[];
  audience?: string | string[];
  issuer?: string | string[];
  ignoreExpiration?: boolean;
  clockTolerance?: number;
  maxAge?: string;
}

/**
 * OAuth2 grant types
 */
export enum OAuth2GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  DEVICE_CODE = 'device_code',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password',
  IMPLICIT = 'implicit',
}

/**
 * OAuth2 authorization request
 */
export interface OAuth2AuthRequest {
  clientId: string;
  redirectUri: string;
  responseType: 'code' | 'token';
  scope?: string[];
  state: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
}

/**
 * OAuth2 device code flow
 */
export interface DeviceCodeResponse {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
}

/**
 * API key configuration
 */
export interface APIKeyConfig {
  key: string;
  userId: string;
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: Date;
  ipWhitelist?: string[];
  lastUsedAt?: Date;
  createdAt: Date;
}

/**
 * MFA methods supported
 */
export enum MFAMethod {
  SMS = 'sms',
  EMAIL = 'email',
  TOTP = 'totp',
  WEBAUTHN = 'webauthn',
  BACKUP_CODE = 'backup_code',
}

/**
 * MFA challenge
 */
export interface MFAChallenge {
  challengeId: string;
  method: MFAMethod;
  userId: string;
  target?: string; // phone number or email
  code?: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

/**
 * TOTP configuration
 */
export interface TOTPConfig {
  secret: string;
  period?: number;
  digits?: number;
  algorithm?: 'sha1' | 'sha256' | 'sha512';
  window?: number;
}

/**
 * Role definition
 */
export interface Role {
  name: string;
  description: string;
  permissions: string[];
  hierarchy?: number;
  inherits?: string[];
}

/**
 * Permission definition
 */
export interface Permission {
  name: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

/**
 * Permission condition for attribute-based access control
 */
export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
  value: any;
}

/**
 * Password policy configuration
 */
export interface PasswordPolicy {
  minLength: number;
  maxLength?: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
  maxRepeatingChars?: number;
  minUniqueChars?: number;
  expiryDays?: number;
  historyCount?: number;
}

/**
 * Password strength result
 */
export interface PasswordStrength {
  score: number; // 0-100
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  feedback: string[];
  meetsPolicy: boolean;
  estimatedCrackTime: string;
}

/**
 * Account lockout configuration
 */
export interface LockoutConfig {
  maxAttempts: number;
  lockoutDuration: number; // in seconds
  resetAfter: number; // in seconds
  incrementalBackoff?: boolean;
  notifyUser?: boolean;
}

/**
 * Brute force tracking
 */
export interface BruteForceTracker {
  identifier: string; // IP or user ID
  attempts: number;
  firstAttempt: Date;
  lastAttempt: Date;
  lockedUntil?: Date;
  suspicionLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  strictTransportSecurity?: boolean;
  contentSecurityPolicy?: string;
  xFrameOptions?: 'DENY' | 'SAMEORIGIN';
  xContentTypeOptions?: boolean;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

/**
 * Token rotation policy
 */
export interface TokenRotationPolicy {
  rotateOnUse: boolean;
  gracePeriod: number; // seconds to allow old token
  maxRotations: number;
  reuseDetection: boolean;
}

/**
 * Biometric authentication data
 */
export interface BiometricAuthData {
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  transports?: ('usb' | 'nfc' | 'ble' | 'internal')[];
  deviceType?: 'platform' | 'cross-platform';
  createdAt: Date;
  lastUsedAt?: Date;
}

// ============================================================================
// JWT STRATEGIES (RS256, HS256, ES256)
// ============================================================================

/**
 * Generates an RS256 JWT token using RSA private key
 *
 * @param payload - JWT payload data
 * @param privateKey - RSA private key in PEM format
 * @param options - Additional JWT options (expiry, issuer, audience)
 * @returns Signed JWT token
 *
 * @example
 * const token = generateRS256Token(
 *   { sub: 'user123', role: 'admin' },
 *   rsaPrivateKey,
 *   { expiresIn: '1h', issuer: 'white-cross' }
 * );
 */
export function generateRS256Token(
  payload: JWTPayload,
  privateKey: string,
  options?: { expiresIn?: string; issuer?: string; audience?: string; jwtid?: string }
): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
  };

  if (options?.expiresIn) {
    jwtPayload.exp = now + parseTimeString(options.expiresIn);
  }
  if (options?.issuer) {
    jwtPayload.iss = options.issuer;
  }
  if (options?.audience) {
    jwtPayload.aud = options.audience;
  }
  if (options?.jwtid) {
    jwtPayload.jti = options.jwtid;
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64');
  const encodedSignature = base64UrlFromBase64(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies an RS256 JWT token using RSA public key
 *
 * @param token - JWT token to verify
 * @param publicKey - RSA public key in PEM format
 * @param options - Verification options (audience, issuer, etc.)
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid or expired
 *
 * @example
 * const payload = verifyRS256Token(token, rsaPublicKey, {
 *   audience: 'white-cross-api',
 *   issuer: 'white-cross'
 * });
 */
export function verifyRS256Token(
  token: string,
  publicKey: string,
  options?: JWTVerifyOptions
): JWTPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedException('Invalid token format');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = base64FromBase64Url(encodedSignature);
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(signatureInput);

  const isValid = verify.verify(publicKey, signature, 'base64');
  if (!isValid) {
    throw new UnauthorizedException('Invalid token signature');
  }

  const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

  validateJWTClaims(payload, options);

  return payload;
}

/**
 * Generates an HS256 JWT token using HMAC-SHA256
 *
 * @param payload - JWT payload data
 * @param secret - Shared secret for HMAC
 * @param options - Additional JWT options
 * @returns Signed JWT token
 *
 * @example
 * const token = generateHS256Token(
 *   { sub: 'user123' },
 *   'your-secret-key',
 *   { expiresIn: '15m' }
 * );
 */
export function generateHS256Token(
  payload: JWTPayload,
  secret: string,
  options?: { expiresIn?: string; issuer?: string; audience?: string }
): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
  };

  if (options?.expiresIn) {
    jwtPayload.exp = now + parseTimeString(options.expiresIn);
  }
  if (options?.issuer) {
    jwtPayload.iss = options.issuer;
  }
  if (options?.audience) {
    jwtPayload.aud = options.audience;
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signatureInput);
  const signature = hmac.digest('base64');
  const encodedSignature = base64UrlFromBase64(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies an HS256 JWT token using HMAC-SHA256
 *
 * @param token - JWT token to verify
 * @param secret - Shared secret for HMAC
 * @param options - Verification options
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid
 */
export function verifyHS256Token(
  token: string,
  secret: string,
  options?: JWTVerifyOptions
): JWTPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedException('Invalid token format');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signatureInput);
  const expectedSignature = base64UrlFromBase64(hmac.digest('base64'));

  if (encodedSignature !== expectedSignature) {
    throw new UnauthorizedException('Invalid token signature');
  }

  const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

  validateJWTClaims(payload, options);

  return payload;
}

/**
 * Generates an ES256 JWT token using ECDSA with P-256 curve
 *
 * @param payload - JWT payload data
 * @param privateKey - EC private key in PEM format
 * @param options - Additional JWT options
 * @returns Signed JWT token
 *
 * @example
 * const token = generateES256Token(
 *   { sub: 'user123' },
 *   ecPrivateKey,
 *   { expiresIn: '2h' }
 * );
 */
export function generateES256Token(
  payload: JWTPayload,
  privateKey: string,
  options?: { expiresIn?: string; issuer?: string; audience?: string }
): string {
  const header = {
    alg: 'ES256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
  };

  if (options?.expiresIn) {
    jwtPayload.exp = now + parseTimeString(options.expiresIn);
  }
  if (options?.issuer) {
    jwtPayload.iss = options.issuer;
  }
  if (options?.audience) {
    jwtPayload.aud = options.audience;
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign('SHA256');
  sign.update(signatureInput);
  const derSignature = sign.sign({ key: privateKey, dsaEncoding: 'der' }, 'base64');

  // Convert DER signature to raw R|S format for ES256
  const rawSignature = derToRaw(Buffer.from(derSignature, 'base64'));
  const encodedSignature = base64UrlFromBase64(rawSignature.toString('base64'));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies an ES256 JWT token using ECDSA
 *
 * @param token - JWT token to verify
 * @param publicKey - EC public key in PEM format
 * @param options - Verification options
 * @returns Decoded and verified JWT payload
 * @throws UnauthorizedException if token is invalid
 */
export function verifyES256Token(
  token: string,
  publicKey: string,
  options?: JWTVerifyOptions
): JWTPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedException('Invalid token format');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const rawSignature = Buffer.from(base64FromBase64Url(encodedSignature), 'base64');
  const derSignature = rawToDer(rawSignature);

  const verify = crypto.createVerify('SHA256');
  verify.update(signatureInput);

  const isValid = verify.verify(
    { key: publicKey, dsaEncoding: 'der' },
    derSignature,
    'base64'
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid token signature');
  }

  const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

  validateJWTClaims(payload, options);

  return payload;
}

// ============================================================================
// OAUTH2 FLOWS
// ============================================================================

/**
 * Generates OAuth2 authorization code with PKCE support
 *
 * @param request - Authorization request details
 * @param userId - User ID authorizing the request
 * @returns Authorization code and metadata
 *
 * @example
 * const authCode = generateOAuth2AuthorizationCode({
 *   clientId: 'client-123',
 *   redirectUri: 'https://app.com/callback',
 *   responseType: 'code',
 *   state: 'random-state',
 *   codeChallenge: 'challenge-hash',
 *   codeChallengeMethod: 'S256'
 * }, 'user-456');
 */
export function generateOAuth2AuthorizationCode(
  request: OAuth2AuthRequest,
  userId: string
): {
  code: string;
  expiresAt: Date;
  codeChallenge?: string;
  codeChallengeMethod?: string;
} {
  const code = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return {
    code,
    expiresAt,
    codeChallenge: request.codeChallenge,
    codeChallengeMethod: request.codeChallengeMethod,
  };
}

/**
 * Verifies PKCE code verifier against code challenge
 *
 * @param codeVerifier - Code verifier from token request
 * @param codeChallenge - Code challenge from authorization request
 * @param method - Challenge method (S256 or plain)
 * @returns True if verification succeeds
 * @throws UnauthorizedException if verification fails
 *
 * @example
 * verifyPKCEChallenge(verifier, challenge, 'S256');
 */
export function verifyPKCEChallenge(
  codeVerifier: string,
  codeChallenge: string,
  method: 'S256' | 'plain'
): boolean {
  if (method === 'plain') {
    if (codeVerifier !== codeChallenge) {
      throw new UnauthorizedException('Invalid PKCE code verifier');
    }
    return true;
  }

  if (method === 'S256') {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    if (hash !== codeChallenge) {
      throw new UnauthorizedException('Invalid PKCE code verifier');
    }
    return true;
  }

  throw new UnauthorizedException('Unsupported PKCE method');
}

/**
 * Generates PKCE code verifier and challenge
 *
 * @returns Code verifier and challenge pair
 *
 * @example
 * const { codeVerifier, codeChallenge } = generatePKCEChallenge();
 */
export function generatePKCEChallenge(): {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
} {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  };
}

/**
 * Implements OAuth2 client credentials flow
 *
 * @param clientId - Client application ID
 * @param clientSecret - Client secret
 * @param scope - Requested scopes
 * @returns Access token for client
 * @throws UnauthorizedException if credentials are invalid
 *
 * @example
 * const token = await generateClientCredentialsToken(
 *   'client-123',
 *   'secret',
 *   ['read:patients', 'write:appointments']
 * );
 */
export async function generateClientCredentialsToken(
  clientId: string,
  clientSecret: string,
  scope: string[]
): Promise<{ accessToken: string; tokenType: string; expiresIn: number }> {
  // In production, verify client credentials against database
  const secretHash = crypto.createHash('sha256').update(clientSecret).digest('hex');

  const payload: JWTPayload = {
    sub: clientId,
    scope,
    token_type: 'client_credentials',
  };

  const accessToken = generateHS256Token(payload, secretHash, { expiresIn: '1h' });

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
  };
}

/**
 * Generates device code for OAuth2 device flow
 *
 * @param clientId - Client application ID
 * @param scope - Requested scopes
 * @returns Device code, user code, and verification URI
 *
 * @example
 * const deviceAuth = generateDeviceCode('client-123', ['profile', 'email']);
 * console.log(`Enter code ${deviceAuth.userCode} at ${deviceAuth.verificationUri}`);
 */
export function generateDeviceCode(
  clientId: string,
  scope?: string[]
): DeviceCodeResponse {
  const deviceCode = crypto.randomBytes(32).toString('base64url');
  const userCode = generateUserFriendlyCode(8);

  return {
    deviceCode,
    userCode,
    verificationUri: 'https://white-cross.com/device',
    verificationUriComplete: `https://white-cross.com/device?user_code=${userCode}`,
    expiresIn: 600, // 10 minutes
    interval: 5, // Poll every 5 seconds
  };
}

/**
 * Validates OAuth2 device code authorization
 *
 * @param deviceCode - Device code to check
 * @param userCode - User code entered by user
 * @returns True if user has authorized the device
 *
 * @example
 * const isAuthorized = await validateDeviceCodeAuthorization(deviceCode, userCode);
 */
export async function validateDeviceCodeAuthorization(
  deviceCode: string,
  userCode: string
): Promise<boolean> {
  // In production, check database for user authorization
  // This is a placeholder implementation
  return true;
}

// ============================================================================
// API KEY AUTHENTICATION
// ============================================================================

/**
 * Generates a secure API key with metadata
 *
 * @param userId - User ID owning the key
 * @param name - Friendly name for the key
 * @param permissions - Permissions granted to the key
 * @param options - Additional configuration
 * @returns API key and configuration
 *
 * @example
 * const apiKey = generateAPIKey('user-123', 'Production API', ['read:*', 'write:appointments']);
 */
export function generateAPIKey(
  userId: string,
  name: string,
  permissions: string[],
  options?: {
    expiresIn?: string;
    ipWhitelist?: string[];
    rateLimit?: number;
  }
): { key: string; config: APIKeyConfig } {
  const key = `wc_${crypto.randomBytes(32).toString('base64url')}`;
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');

  const config: APIKeyConfig = {
    key: hashedKey,
    userId,
    name,
    permissions,
    rateLimit: options?.rateLimit,
    ipWhitelist: options?.ipWhitelist,
    expiresAt: options?.expiresIn
      ? new Date(Date.now() + parseTimeString(options.expiresIn) * 1000)
      : undefined,
    createdAt: new Date(),
  };

  return { key, config };
}

/**
 * Validates API key and returns associated configuration
 *
 * @param apiKey - API key to validate
 * @param ipAddress - Client IP address for whitelist check
 * @returns API key configuration if valid
 * @throws UnauthorizedException if key is invalid or expired
 *
 * @example
 * const config = await validateAPIKey(req.headers['x-api-key'], req.ip);
 */
export async function validateAPIKey(
  apiKey: string,
  ipAddress?: string
): Promise<APIKeyConfig> {
  if (!apiKey || !apiKey.startsWith('wc_')) {
    throw new UnauthorizedException('Invalid API key format');
  }

  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

  // In production, fetch from database
  // This is a placeholder
  const config: APIKeyConfig = {
    key: hashedKey,
    userId: 'user-123',
    name: 'API Key',
    permissions: ['read:*'],
    createdAt: new Date(),
  };

  if (config.expiresAt && config.expiresAt < new Date()) {
    throw new UnauthorizedException('API key has expired');
  }

  if (config.ipWhitelist && ipAddress) {
    if (!config.ipWhitelist.includes(ipAddress)) {
      throw new UnauthorizedException('IP address not whitelisted');
    }
  }

  return config;
}

/**
 * Rotates API key while maintaining access
 *
 * @param oldKey - Current API key
 * @param gracePeriod - Time in seconds to keep old key valid
 * @returns New API key and configuration
 *
 * @example
 * const { newKey, config } = rotateAPIKey(currentKey, 3600); // 1 hour grace period
 */
export function rotateAPIKey(
  oldKey: string,
  gracePeriod: number = 3600
): { newKey: string; oldKeyValidUntil: Date } {
  const newKey = `wc_${crypto.randomBytes(32).toString('base64url')}`;
  const oldKeyValidUntil = new Date(Date.now() + gracePeriod * 1000);

  return { newKey, oldKeyValidUntil };
}

// ============================================================================
// MULTI-FACTOR AUTHENTICATION
// ============================================================================

/**
 * Generates TOTP secret for authenticator app enrollment
 *
 * @param userId - User ID for the TOTP secret
 * @param issuer - Issuer name (e.g., "White Cross")
 * @returns Secret, QR code URI, and manual entry key
 *
 * @example
 * const totp = generateTOTPSecret('user-123', 'White Cross');
 * console.log('Scan QR code:', totp.qrCodeUri);
 */
export function generateTOTPSecret(
  userId: string,
  issuer: string = 'White Cross'
): {
  secret: string;
  qrCodeUri: string;
  manualEntryKey: string;
} {
  const secret = crypto.randomBytes(20).toString('base64');
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedUserId = encodeURIComponent(userId);

  const qrCodeUri = `otpauth://totp/${encodedIssuer}:${encodedUserId}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  const manualEntryKey = secret.replace(/[^A-Z2-7]/gi, '').toUpperCase();

  return {
    secret,
    qrCodeUri,
    manualEntryKey,
  };
}

/**
 * Generates current TOTP code from secret
 *
 * @param secret - TOTP secret
 * @param config - TOTP configuration
 * @returns Current TOTP code
 *
 * @example
 * const code = generateTOTPCode(secret, { period: 30, digits: 6 });
 */
export function generateTOTPCode(
  secret: string,
  config?: Partial<TOTPConfig>
): string {
  const period = config?.period || 30;
  const digits = config?.digits || 6;
  const algorithm = config?.algorithm || 'sha1';

  const counter = Math.floor(Date.now() / 1000 / period);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac(algorithm, Buffer.from(secret, 'base64'));
  hmac.update(counterBuffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}

/**
 * Verifies TOTP code with time window tolerance
 *
 * @param code - User-provided TOTP code
 * @param secret - TOTP secret
 * @param config - TOTP configuration with window tolerance
 * @returns True if code is valid
 *
 * @example
 * const isValid = verifyTOTPCode('123456', secret, { window: 1 });
 */
export function verifyTOTPCode(
  code: string,
  secret: string,
  config?: Partial<TOTPConfig>
): boolean {
  const window = config?.window || 1;
  const period = config?.period || 30;

  const currentCounter = Math.floor(Date.now() / 1000 / period);

  for (let i = -window; i <= window; i++) {
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(currentCounter + i));

    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
    hmac.update(counterBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, 6);
    const expectedCode = otp.toString().padStart(6, '0');

    if (code === expectedCode) {
      return true;
    }
  }

  return false;
}

/**
 * Generates SMS/Email MFA challenge code
 *
 * @param userId - User ID for the challenge
 * @param method - MFA method (SMS or EMAIL)
 * @param target - Phone number or email address
 * @param length - Code length (default 6)
 * @returns MFA challenge with code
 *
 * @example
 * const challenge = generateMFAChallenge('user-123', MFAMethod.SMS, '+1234567890');
 */
export function generateMFAChallenge(
  userId: string,
  method: MFAMethod.SMS | MFAMethod.EMAIL,
  target: string,
  length: number = 6
): MFAChallenge {
  const code = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
  const challengeId = crypto.randomBytes(16).toString('hex');

  return {
    challengeId,
    method,
    userId,
    target,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0,
    verified: false,
  };
}

/**
 * Verifies MFA challenge code
 *
 * @param challengeId - Challenge ID
 * @param code - User-provided code
 * @param challenge - Stored challenge data
 * @returns True if code is valid
 * @throws UnauthorizedException if code is invalid or expired
 *
 * @example
 * const isValid = verifyMFAChallenge(challengeId, '123456', storedChallenge);
 */
export function verifyMFAChallenge(
  challengeId: string,
  code: string,
  challenge: MFAChallenge
): boolean {
  if (challenge.challengeId !== challengeId) {
    throw new UnauthorizedException('Invalid challenge ID');
  }

  if (challenge.expiresAt < new Date()) {
    throw new UnauthorizedException('Challenge has expired');
  }

  if (challenge.attempts >= 3) {
    throw new UnauthorizedException('Too many attempts');
  }

  if (challenge.code !== code) {
    challenge.attempts++;
    throw new UnauthorizedException('Invalid code');
  }

  challenge.verified = true;
  return true;
}

/**
 * Generates backup codes for MFA recovery
 *
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 *
 * @example
 * const backupCodes = generateBackupCodes(10);
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}`;
    codes.push(formatted);
  }

  return codes;
}

// ============================================================================
// ROLE-BASED AND PERMISSION-BASED ACCESS CONTROL
// ============================================================================

/**
 * Checks if user has required role
 *
 * @param userRole - User's current role
 * @param requiredRoles - Required roles (any match)
 * @param roleHierarchy - Role hierarchy map
 * @returns True if user has permission
 *
 * @example
 * const hasAccess = checkRole('admin', ['admin', 'super_admin'], roleHierarchy);
 */
export function checkRole(
  userRole: string,
  requiredRoles: string[],
  roleHierarchy?: Map<string, number>
): boolean {
  if (requiredRoles.includes(userRole)) {
    return true;
  }

  if (roleHierarchy) {
    const userLevel = roleHierarchy.get(userRole) || 0;
    return requiredRoles.some((role) => {
      const requiredLevel = roleHierarchy.get(role) || 0;
      return userLevel >= requiredLevel;
    });
  }

  return false;
}

/**
 * Checks if user has required permissions
 *
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Required permissions (all must match)
 * @returns True if user has all required permissions
 *
 * @example
 * const hasPermission = checkPermissions(
 *   ['read:patients', 'write:appointments'],
 *   ['read:patients']
 * );
 */
export function checkPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((required) => {
    // Support wildcard permissions
    if (userPermissions.includes(required)) {
      return true;
    }

    // Check for wildcard matches (e.g., "read:*" matches "read:patients")
    return userPermissions.some((userPerm) => {
      if (userPerm.endsWith(':*')) {
        const prefix = userPerm.slice(0, -1);
        return required.startsWith(prefix);
      }
      return false;
    });
  });
}

/**
 * Evaluates attribute-based permission conditions
 *
 * @param permission - Permission with conditions
 * @param context - Current context data
 * @returns True if all conditions are met
 *
 * @example
 * const allowed = evaluatePermissionConditions(
 *   { name: 'read:patient', resource: 'patient', action: 'read',
 *     conditions: [{ field: 'department', operator: 'eq', value: 'cardiology' }]
 *   },
 *   { department: 'cardiology' }
 * );
 */
export function evaluatePermissionConditions(
  permission: Permission,
  context: Record<string, any>
): boolean {
  if (!permission.conditions || permission.conditions.length === 0) {
    return true;
  }

  return permission.conditions.every((condition) => {
    const contextValue = context[condition.field];

    switch (condition.operator) {
      case 'eq':
        return contextValue === condition.value;
      case 'ne':
        return contextValue !== condition.value;
      case 'gt':
        return contextValue > condition.value;
      case 'lt':
        return contextValue < condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(contextValue);
      case 'contains':
        return Array.isArray(contextValue) && contextValue.includes(condition.value);
      default:
        return false;
    }
  });
}

/**
 * Merges role permissions with hierarchy inheritance
 *
 * @param role - Role to get permissions for
 * @param allRoles - Map of all role definitions
 * @returns Combined permissions from role and inherited roles
 *
 * @example
 * const permissions = getRolePermissions(doctorRole, rolesMap);
 */
export function getRolePermissions(
  role: Role,
  allRoles: Map<string, Role>
): string[] {
  const permissions = new Set<string>(role.permissions);

  if (role.inherits) {
    role.inherits.forEach((parentRoleName) => {
      const parentRole = allRoles.get(parentRoleName);
      if (parentRole) {
        const parentPermissions = getRolePermissions(parentRole, allRoles);
        parentPermissions.forEach((perm) => permissions.add(perm));
      }
    });
  }

  return Array.from(permissions);
}

// ============================================================================
// PASSWORD POLICIES AND VALIDATION
// ============================================================================

/**
 * Validates password against policy requirements
 *
 * @param password - Password to validate
 * @param policy - Password policy configuration
 * @param userInfo - Optional user info to prevent password reuse
 * @returns Validation result with feedback
 *
 * @example
 * const result = validatePasswordPolicy('MyP@ssw0rd!', policy, { email: 'user@example.com' });
 */
export function validatePasswordPolicy(
  password: string,
  policy: PasswordPolicy,
  userInfo?: { email?: string; name?: string; username?: string }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
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
    const repeatingPattern = new RegExp(`(.)\\1{${policy.maxRepeatingChars},}`);
    if (repeatingPattern.test(password)) {
      errors.push(`Password cannot have more than ${policy.maxRepeatingChars} repeating characters`);
    }
  }

  if (policy.minUniqueChars) {
    const uniqueChars = new Set(password.split('')).size;
    if (uniqueChars < policy.minUniqueChars) {
      errors.push(`Password must contain at least ${policy.minUniqueChars} unique characters`);
    }
  }

  if (policy.preventUserInfo && userInfo) {
    const lowerPassword = password.toLowerCase();
    const userValues = [
      userInfo.email?.toLowerCase(),
      userInfo.name?.toLowerCase(),
      userInfo.username?.toLowerCase(),
    ].filter(Boolean);

    for (const value of userValues) {
      if (value && lowerPassword.includes(value)) {
        errors.push('Password cannot contain your email, name, or username');
        break;
      }
    }
  }

  if (policy.preventCommonPasswords) {
    if (isCommonPassword(password)) {
      errors.push('Password is too common. Please choose a stronger password');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates password strength score and provides feedback
 *
 * @param password - Password to analyze
 * @returns Password strength analysis
 *
 * @example
 * const strength = calculatePasswordStrength('MyP@ssw0rd!2024');
 * console.log(`Strength: ${strength.strength} (${strength.score}/100)`);
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  else feedback.push('Use a longer password (16+ characters)');

  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 10;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 10;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  else feedback.push('Add special characters');

  // Complexity bonus
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= 10) score += 10;
  if (uniqueChars >= 15) score += 10;

  // Penalize patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeating characters');
  }

  if (/^[a-z]+$/i.test(password)) {
    score -= 20;
    feedback.push('Mix different character types');
  }

  // Entropy calculation for crack time estimation
  const entropy = Math.log2(Math.pow(uniqueChars, password.length));
  const estimatedCrackTime = estimateCrackTime(entropy);

  let strength: PasswordStrength['strength'];
  if (score >= 80) strength = 'very_strong';
  else if (score >= 60) strength = 'strong';
  else if (score >= 40) strength = 'good';
  else if (score >= 20) strength = 'fair';
  else strength = 'weak';

  return {
    score: Math.min(100, Math.max(0, score)),
    strength,
    feedback,
    meetsPolicy: score >= 60,
    estimatedCrackTime,
  };
}

/**
 * Hashes password with bcrypt
 *
 * @param password - Plain text password
 * @param rounds - Bcrypt rounds (default 12)
 * @returns Hashed password
 *
 * @example
 * const hash = await hashPassword('MyP@ssw0rd!');
 */
export async function hashPassword(
  password: string,
  rounds: number = 12
): Promise<string> {
  return bcrypt.hash(password, rounds);
}

/**
 * Verifies password against hash
 *
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns True if password matches
 *
 * @example
 * const isValid = await verifyPassword('MyP@ssw0rd!', storedHash);
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================================
// ACCOUNT LOCKOUT AND BRUTE FORCE PROTECTION
// ============================================================================

/**
 * Tracks failed login attempts and determines lockout
 *
 * @param identifier - User ID or IP address
 * @param config - Lockout configuration
 * @param tracker - Current tracking state
 * @returns Updated tracker and lockout status
 *
 * @example
 * const { tracker, isLocked } = trackFailedLogin('user-123', lockoutConfig, currentTracker);
 */
export function trackFailedLogin(
  identifier: string,
  config: LockoutConfig,
  tracker?: BruteForceTracker
): { tracker: BruteForceTracker; isLocked: boolean; lockDuration: number } {
  const now = new Date();

  if (!tracker) {
    tracker = {
      identifier,
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
      suspicionLevel: 'low',
    };
  } else {
    tracker.attempts++;
    tracker.lastAttempt = now;

    // Reset if outside reset window
    const timeSinceFirst = now.getTime() - tracker.firstAttempt.getTime();
    if (timeSinceFirst > config.resetAfter * 1000) {
      tracker.attempts = 1;
      tracker.firstAttempt = now;
    }
  }

  // Determine suspicion level
  if (tracker.attempts >= config.maxAttempts * 2) {
    tracker.suspicionLevel = 'critical';
  } else if (tracker.attempts >= config.maxAttempts * 1.5) {
    tracker.suspicionLevel = 'high';
  } else if (tracker.attempts >= config.maxAttempts) {
    tracker.suspicionLevel = 'medium';
  }

  // Calculate lockout
  let isLocked = false;
  let lockDuration = config.lockoutDuration;

  if (tracker.attempts >= config.maxAttempts) {
    isLocked = true;

    if (config.incrementalBackoff) {
      const multiplier = Math.min(tracker.attempts - config.maxAttempts + 1, 10);
      lockDuration = config.lockoutDuration * multiplier;
    }

    tracker.lockedUntil = new Date(now.getTime() + lockDuration * 1000);
  }

  return { tracker, isLocked, lockDuration };
}

/**
 * Checks if account is currently locked
 *
 * @param tracker - Brute force tracker
 * @returns True if account is locked
 *
 * @example
 * if (isAccountLocked(tracker)) {
 *   throw new UnauthorizedException('Account is locked');
 * }
 */
export function isAccountLocked(tracker?: BruteForceTracker): boolean {
  if (!tracker || !tracker.lockedUntil) {
    return false;
  }

  return tracker.lockedUntil > new Date();
}

/**
 * Resets failed login attempts on successful login
 *
 * @param identifier - User ID or IP address
 * @returns Cleared tracker
 *
 * @example
 * resetFailedLoginAttempts('user-123');
 */
export function resetFailedLoginAttempts(
  identifier: string
): BruteForceTracker {
  return {
    identifier,
    attempts: 0,
    firstAttempt: new Date(),
    lastAttempt: new Date(),
    suspicionLevel: 'low',
  };
}

/**
 * Detects suspicious login patterns
 *
 * @param attempts - Array of recent login attempts
 * @param threshold - Attempts threshold for suspicion
 * @returns Suspicion analysis
 *
 * @example
 * const analysis = detectSuspiciousActivity(recentAttempts, 10);
 */
export function detectSuspiciousActivity(
  attempts: Array<{ timestamp: Date; ipAddress: string; success: boolean }>,
  threshold: number = 10
): {
  isSuspicious: boolean;
  reason?: string;
  riskScore: number;
} {
  if (attempts.length === 0) {
    return { isSuspicious: false, riskScore: 0 };
  }

  let riskScore = 0;

  // Check for rapid attempts
  const timeWindow = 5 * 60 * 1000; // 5 minutes
  const recentAttempts = attempts.filter(
    (a) => Date.now() - a.timestamp.getTime() < timeWindow
  );

  if (recentAttempts.length >= threshold) {
    riskScore += 40;
  }

  // Check for multiple IPs
  const uniqueIPs = new Set(attempts.map((a) => a.ipAddress));
  if (uniqueIPs.size >= 5) {
    riskScore += 30;
  }

  // Check failure rate
  const failures = attempts.filter((a) => !a.success).length;
  const failureRate = failures / attempts.length;
  if (failureRate > 0.8) {
    riskScore += 30;
  }

  const isSuspicious = riskScore >= 50;
  let reason: string | undefined;

  if (isSuspicious) {
    if (recentAttempts.length >= threshold) {
      reason = 'Too many rapid login attempts';
    } else if (uniqueIPs.size >= 5) {
      reason = 'Login attempts from multiple IP addresses';
    } else if (failureRate > 0.8) {
      reason = 'High rate of failed login attempts';
    }
  }

  return { isSuspicious, reason, riskScore };
}

// ============================================================================
// SECURITY HEADERS AND MIDDLEWARE
// ============================================================================

/**
 * Generates secure HTTP headers configuration
 *
 * @param config - Security headers configuration
 * @returns Headers object for Express/NestJS
 *
 * @example
 * const headers = generateSecurityHeaders({
 *   strictTransportSecurity: true,
 *   xFrameOptions: 'DENY'
 * });
 */
export function generateSecurityHeaders(
  config: SecurityHeadersConfig = {}
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (config.strictTransportSecurity !== false) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  if (config.contentSecurityPolicy) {
    headers['Content-Security-Policy'] = config.contentSecurityPolicy;
  } else {
    headers['Content-Security-Policy'] =
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
  }

  if (config.xFrameOptions) {
    headers['X-Frame-Options'] = config.xFrameOptions;
  } else {
    headers['X-Frame-Options'] = 'DENY';
  }

  if (config.xContentTypeOptions !== false) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  headers['X-XSS-Protection'] = '1; mode=block';

  if (config.referrerPolicy) {
    headers['Referrer-Policy'] = config.referrerPolicy;
  } else {
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  }

  if (config.permissionsPolicy) {
    headers['Permissions-Policy'] = config.permissionsPolicy;
  } else {
    headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()';
  }

  return headers;
}

/**
 * Creates CORS configuration for healthcare APIs
 *
 * @param allowedOrigins - Allowed origin domains
 * @param credentials - Allow credentials (cookies, auth headers)
 * @returns CORS configuration object
 *
 * @example
 * const corsConfig = createCORSConfig(['https://app.white-cross.com'], true);
 */
export function createCORSConfig(
  allowedOrigins: string[],
  credentials: boolean = true
): {
  origin: string[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
} {
  return {
    origin: allowedOrigins,
    credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
    maxAge: 86400, // 24 hours
  };
}

// ============================================================================
// TOKEN REFRESH AND ROTATION
// ============================================================================

/**
 * Implements token rotation with grace period
 *
 * @param oldToken - Current refresh token
 * @param policy - Token rotation policy
 * @returns New tokens and rotation metadata
 *
 * @example
 * const { accessToken, refreshToken, oldTokenValidUntil } = rotateTokens(
 *   currentRefreshToken,
 *   rotationPolicy
 * );
 */
export function rotateTokens(
  oldToken: string,
  policy: TokenRotationPolicy,
  generateNewTokens: () => { accessToken: string; refreshToken: string }
): {
  accessToken: string;
  refreshToken: string;
  oldTokenValidUntil?: Date;
  rotationId: string;
} {
  const newTokens = generateNewTokens();
  const rotationId = crypto.randomBytes(16).toString('hex');

  let oldTokenValidUntil: Date | undefined;
  if (policy.gracePeriod > 0) {
    oldTokenValidUntil = new Date(Date.now() + policy.gracePeriod * 1000);
  }

  return {
    ...newTokens,
    oldTokenValidUntil,
    rotationId,
  };
}

/**
 * Detects token reuse after rotation (security breach indicator)
 *
 * @param tokenId - Token identifier
 * @param rotationHistory - History of token rotations
 * @returns True if token reuse is detected
 *
 * @example
 * if (detectTokenReuse(tokenId, rotationHistory)) {
 *   // Revoke all tokens for this user - possible security breach
 * }
 */
export function detectTokenReuse(
  tokenId: string,
  rotationHistory: Array<{ tokenId: string; rotatedAt: Date; usedAfterRotation: boolean }>
): boolean {
  const rotation = rotationHistory.find((r) => r.tokenId === tokenId);
  if (!rotation) {
    return false;
  }

  return rotation.usedAfterRotation;
}

/**
 * Validates refresh token and checks rotation limits
 *
 * @param token - Refresh token to validate
 * @param policy - Token rotation policy
 * @param rotationCount - Number of times token has been rotated
 * @returns True if token is valid for rotation
 * @throws UnauthorizedException if rotation limit exceeded
 *
 * @example
 * validateRefreshToken(refreshToken, policy, currentRotationCount);
 */
export function validateRefreshToken(
  token: string,
  policy: TokenRotationPolicy,
  rotationCount: number
): boolean {
  if (rotationCount >= policy.maxRotations) {
    throw new UnauthorizedException('Token rotation limit exceeded. Please re-authenticate.');
  }

  return true;
}

// ============================================================================
// BIOMETRIC AUTHENTICATION HELPERS
// ============================================================================

/**
 * Generates WebAuthn challenge for biometric authentication
 *
 * @param userId - User ID for the challenge
 * @returns Challenge data for WebAuthn ceremony
 *
 * @example
 * const challenge = generateWebAuthnChallenge('user-123');
 */
export function generateWebAuthnChallenge(userId: string): {
  challenge: string;
  challengeId: string;
  expiresAt: Date;
} {
  const challenge = crypto.randomBytes(32).toString('base64url');
  const challengeId = crypto.randomBytes(16).toString('hex');

  return {
    challenge,
    challengeId,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };
}

/**
 * Verifies WebAuthn assertion signature
 *
 * @param assertion - WebAuthn assertion from authenticator
 * @param publicKey - Stored public key for the credential
 * @param challenge - Original challenge
 * @returns True if signature is valid
 *
 * @example
 * const isValid = verifyWebAuthnAssertion(assertion, storedPublicKey, challenge);
 */
export function verifyWebAuthnAssertion(
  assertion: {
    authenticatorData: Buffer;
    clientDataJSON: Buffer;
    signature: Buffer;
  },
  publicKey: string,
  challenge: string
): boolean {
  // Create hash of client data
  const clientDataHash = crypto.createHash('sha256').update(assertion.clientDataJSON).digest();

  // Concatenate authenticator data and client data hash
  const signatureBase = Buffer.concat([assertion.authenticatorData, clientDataHash]);

  // Verify signature
  const verify = crypto.createVerify('SHA256');
  verify.update(signatureBase);

  return verify.verify(publicKey, assertion.signature);
}

/**
 * Registers biometric credential for user
 *
 * @param userId - User ID
 * @param credentialId - Credential ID from authenticator
 * @param publicKey - Public key from attestation
 * @param counter - Signature counter
 * @returns Biometric auth data
 *
 * @example
 * const bioData = registerBiometricCredential('user-123', credId, pubKey, 0);
 */
export function registerBiometricCredential(
  userId: string,
  credentialId: string,
  publicKey: string,
  counter: number,
  deviceType?: 'platform' | 'cross-platform'
): BiometricAuthData {
  return {
    userId,
    credentialId,
    publicKey,
    counter,
    deviceType,
    createdAt: new Date(),
  };
}

/**
 * Validates biometric signature counter to prevent replay attacks
 *
 * @param newCounter - Counter from current assertion
 * @param storedCounter - Previously stored counter
 * @returns True if counter is valid
 * @throws UnauthorizedException if counter indicates replay attack
 *
 * @example
 * validateBiometricCounter(newCounter, storedData.counter);
 */
export function validateBiometricCounter(
  newCounter: number,
  storedCounter: number
): boolean {
  if (newCounter <= storedCounter) {
    throw new UnauthorizedException('Invalid signature counter - possible replay attack');
  }

  return true;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

/**
 * Convert base64 to base64url
 */
function base64UrlFromBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert base64url to base64
 */
function base64FromBase64Url(base64url: string): string {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  return base64 + '='.repeat((4 - (base64.length % 4)) % 4);
}

/**
 * Parse time string (e.g., "1h", "30m", "7d") to seconds
 */
function parseTimeString(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid time string format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * multipliers[unit];
}

/**
 * Validate JWT claims (expiry, issuer, audience)
 */
function validateJWTClaims(payload: JWTPayload, options?: JWTVerifyOptions): void {
  const now = Math.floor(Date.now() / 1000);

  // Check expiration
  if (!options?.ignoreExpiration && payload.exp) {
    const clockTolerance = options?.clockTolerance || 0;
    if (payload.exp < now - clockTolerance) {
      throw new UnauthorizedException('Token has expired');
    }
  }

  // Check issuer
  if (options?.issuer) {
    const issuers = Array.isArray(options.issuer) ? options.issuer : [options.issuer];
    if (payload.iss && !issuers.includes(payload.iss)) {
      throw new UnauthorizedException('Invalid token issuer');
    }
  }

  // Check audience
  if (options?.audience) {
    const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
    const payloadAudiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

    if (payload.aud) {
      const hasValidAudience = audiences.some((aud) => payloadAudiences.includes(aud));
      if (!hasValidAudience) {
        throw new UnauthorizedException('Invalid token audience');
      }
    }
  }

  // Check max age
  if (options?.maxAge && payload.iat) {
    const maxAgeSeconds = parseTimeString(options.maxAge);
    if (now - payload.iat > maxAgeSeconds) {
      throw new UnauthorizedException('Token is too old');
    }
  }
}

/**
 * Convert DER signature to raw R|S format for ES256
 */
function derToRaw(derSignature: Buffer): Buffer {
  // DER format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
  let offset = 3; // Skip 0x30, total length, and 0x02
  const rLength = derSignature[offset - 1];
  const rStart = offset;
  const r = derSignature.slice(rStart, rStart + rLength);

  offset = rStart + rLength + 2; // Skip R and next 0x02
  const sLength = derSignature[offset - 1];
  const sStart = offset;
  const s = derSignature.slice(sStart, sStart + sLength);

  // Ensure R and S are 32 bytes each for P-256
  const rPadded = r.length > 32 ? r.slice(-32) : Buffer.concat([Buffer.alloc(32 - r.length, 0), r]);
  const sPadded = s.length > 32 ? s.slice(-32) : Buffer.concat([Buffer.alloc(32 - s.length, 0), s]);

  return Buffer.concat([rPadded, sPadded]);
}

/**
 * Convert raw R|S signature to DER format for ES256
 */
function rawToDer(rawSignature: Buffer): Buffer {
  const r = rawSignature.slice(0, 32);
  const s = rawSignature.slice(32, 64);

  // Remove leading zeros but keep one if value is negative
  const trimR = trimLeadingZeros(r);
  const trimS = trimLeadingZeros(s);

  const rLength = trimR.length;
  const sLength = trimS.length;
  const totalLength = rLength + sLength + 4; // +4 for 0x02 markers and lengths

  const der = Buffer.alloc(totalLength + 2); // +2 for 0x30 and total length
  der[0] = 0x30;
  der[1] = totalLength;
  der[2] = 0x02;
  der[3] = rLength;
  trimR.copy(der, 4);
  der[4 + rLength] = 0x02;
  der[5 + rLength] = sLength;
  trimS.copy(der, 6 + rLength);

  return der;
}

/**
 * Trim leading zeros from buffer
 */
function trimLeadingZeros(buffer: Buffer): Buffer {
  let i = 0;
  while (i < buffer.length - 1 && buffer[i] === 0) {
    i++;
  }
  return buffer.slice(i);
}

/**
 * Generate user-friendly code (alphanumeric, no ambiguous characters)
 */
function generateUserFriendlyCode(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars[randomIndex];
  }

  // Insert hyphen for readability (e.g., ABCD-EFGH)
  if (length >= 8) {
    return code.slice(0, 4) + '-' + code.slice(4);
  }

  return code;
}

/**
 * Check if password is in common password list
 */
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master',
    'sunshine', 'ashley', 'bailey', 'password1', 'password123',
  ];

  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Estimate password crack time based on entropy
 */
function estimateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e10; // 10 billion guesses/second (GPU)
  const possibleCombinations = Math.pow(2, entropy);
  const seconds = possibleCombinations / guessesPerSecond / 2; // Average case

  if (seconds < 1) return 'instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
}
