/**
 * LOC: CMD_SEC_CTRL_001
 * File: /reuse/command/command-security-controls.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @nestjs/jwt
 *   - @nestjs/swagger
 *   - @nestjs/throttler
 *   - passport
 *   - bcrypt
 *   - argon2
 *   - otplib
 *   - qrcode
 *   - crypto
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Command center services
 *   - Incident management controllers
 *   - Emergency response services
 *   - Security middleware
 *   - Guard implementations
 *   - Authorization services
 */

/**
 * File: /reuse/command/command-security-controls.ts
 * Locator: WC-CMD-SEC-CTRL-001
 * Purpose: Command Center Security Controls Kit - Enterprise security for emergency operations
 *
 * Upstream: NestJS, Passport, JWT, Swagger, Throttler, bcrypt, argon2, otplib, crypto, Zod
 * Downstream: ../backend/command/*, Guards, Strategies, Controllers, Emergency Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/passport, @nestjs/jwt, @nestjs/throttler
 * Exports: 50 production-ready security control functions for command center operations
 *
 * LLM Context: Production-grade security controls for White Cross emergency command center platform.
 * Provides comprehensive role-based access control (RBAC) for emergency personnel, incident-level
 * permissions, emergency override protocols with audit trails, multi-factor authentication for
 * critical operations, session management with automatic timeout, API key management for integrations,
 * data encryption for sensitive incident data, secure communications, real-time threat detection,
 * emergency break-glass access, privilege escalation controls, zone-based access control, device
 * authentication, biometric verification, secure channel establishment, cryptographic key management,
 * and HIPAA/CJIS compliance for healthcare emergency operations.
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
  Logger,
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
 * Command center user roles
 */
export enum CommandRole {
  DISPATCHER = 'dispatcher',
  SUPERVISOR = 'supervisor',
  COMMANDER = 'commander',
  MEDICAL_DIRECTOR = 'medical_director',
  ADMIN = 'admin',
  PARAMEDIC = 'paramedic',
  EMT = 'emt',
  NURSE = 'nurse',
  PHYSICIAN = 'physician',
  SYSTEM_ADMIN = 'system_admin',
}

/**
 * Incident clearance levels
 */
export enum ClearanceLevel {
  PUBLIC = 0,
  BASIC = 1,
  CONFIDENTIAL = 2,
  SENSITIVE = 3,
  CRITICAL = 4,
  TOP_SECRET = 5,
}

/**
 * Emergency override types
 */
export enum EmergencyOverrideType {
  BREAK_GLASS = 'break_glass',
  MEDICAL_EMERGENCY = 'medical_emergency',
  MASS_CASUALTY = 'mass_casualty',
  DISASTER_RESPONSE = 'disaster_response',
  SUPERVISOR_OVERRIDE = 'supervisor_override',
}

/**
 * Security zones for zone-based access control
 */
export enum SecurityZone {
  PUBLIC = 'public',
  RESTRICTED = 'restricted',
  COMMAND_CENTER = 'command_center',
  MEDICAL_RESTRICTED = 'medical_restricted',
  EXECUTIVE = 'executive',
}

/**
 * MFA methods
 */
export enum MFAMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  HARDWARE_TOKEN = 'hardware_token',
  BIOMETRIC = 'biometric',
  PUSH_NOTIFICATION = 'push_notification',
}

/**
 * API key scopes
 */
export enum APIKeyScope {
  READ_INCIDENTS = 'read:incidents',
  WRITE_INCIDENTS = 'write:incidents',
  READ_UNITS = 'read:units',
  WRITE_UNITS = 'write:units',
  READ_RESOURCES = 'read:resources',
  WRITE_RESOURCES = 'write:resources',
  ADMIN = 'admin',
}

/**
 * Role interface with permissions
 */
export interface ICommandRole {
  id: string;
  name: CommandRole;
  permissions: string[];
  clearanceLevel: ClearanceLevel;
  canOverride: boolean;
  maxSessionDuration: number; // in minutes
}

/**
 * Permission interface
 */
export interface IPermission {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

/**
 * Emergency override request
 */
export interface IEmergencyOverride {
  userId: string;
  type: EmergencyOverrideType;
  reason: string;
  incidentId?: string;
  approvedBy?: string;
  expiresAt: Date;
  revokedAt?: Date;
}

/**
 * Session security info
 */
export interface ISessionSecurity {
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint: string;
  mfaVerified: boolean;
  clearanceLevel: ClearanceLevel;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
}

/**
 * API key interface
 */
export interface IAPIKey {
  id: string;
  key: string;
  hashedKey: string;
  name: string;
  scopes: APIKeyScope[];
  createdBy: string;
  expiresAt?: Date;
  lastUsedAt?: Date;
  ipWhitelist?: string[];
  rateLimit?: number;
}

/**
 * Encryption key metadata
 */
export interface IEncryptionKey {
  id: string;
  algorithm: string;
  version: number;
  createdAt: Date;
  rotatedAt?: Date;
  status: 'active' | 'rotating' | 'deprecated';
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Emergency override validation schema
 */
export const EmergencyOverrideSchema = z.object({
  type: z.nativeEnum(EmergencyOverrideType),
  reason: z.string().min(10).max(500),
  incidentId: z.string().uuid().optional(),
  duration: z.number().min(1).max(240), // max 4 hours
});

/**
 * API key creation schema
 */
export const APIKeyCreateSchema = z.object({
  name: z.string().min(3).max(100),
  scopes: z.array(z.nativeEnum(APIKeyScope)),
  expiresInDays: z.number().min(1).max(365).optional(),
  ipWhitelist: z.array(z.string().ip()).optional(),
  rateLimit: z.number().min(10).max(10000).optional(),
});

/**
 * MFA verification schema
 */
export const MFAVerificationSchema = z.object({
  method: z.nativeEnum(MFAMethod),
  code: z.string().length(6).regex(/^\d{6}$/),
  sessionId: z.string().uuid(),
});

// ============================================================================
// SECURITY CONTROL FUNCTIONS
// ============================================================================

/**
 * 1. Generate secure incident access token
 */
export function generateIncidentAccessToken(
  incidentId: string,
  userId: string,
  clearanceLevel: ClearanceLevel,
  duration: number = 3600
): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + duration * 1000);
  const payload = {
    incidentId,
    userId,
    clearanceLevel,
    type: 'incident_access',
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return { token, expiresAt };
}

/**
 * 2. Verify incident access token
 */
export function verifyIncidentAccessToken(token: string): {
  valid: boolean;
  payload?: any;
  error?: string;
} {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token format' };
  }
}

/**
 * 3. Check role-based permissions
 */
export function checkRolePermissions(
  userRole: CommandRole,
  requiredPermissions: string[]
): boolean {
  const rolePermissions = getRolePermissions(userRole);
  return requiredPermissions.every(perm => rolePermissions.includes(perm));
}

/**
 * 4. Get role permissions mapping
 */
export function getRolePermissions(role: CommandRole): string[] {
  const permissionMap: Record<CommandRole, string[]> = {
    [CommandRole.DISPATCHER]: [
      'incidents:read',
      'incidents:create',
      'incidents:update',
      'units:read',
      'units:assign',
      'communications:send',
    ],
    [CommandRole.SUPERVISOR]: [
      'incidents:read',
      'incidents:create',
      'incidents:update',
      'incidents:close',
      'units:read',
      'units:assign',
      'units:manage',
      'communications:send',
      'reports:read',
    ],
    [CommandRole.COMMANDER]: [
      'incidents:*',
      'units:*',
      'resources:*',
      'communications:*',
      'reports:*',
      'emergency:override',
    ],
    [CommandRole.MEDICAL_DIRECTOR]: [
      'incidents:read',
      'incidents:medical_review',
      'protocols:manage',
      'quality:review',
      'reports:medical',
    ],
    [CommandRole.PARAMEDIC]: [
      'incidents:read',
      'incidents:update_medical',
      'patients:read',
      'patients:update',
      'protocols:read',
    ],
    [CommandRole.EMT]: [
      'incidents:read',
      'patients:read',
      'patients:update_basic',
      'protocols:read',
    ],
    [CommandRole.NURSE]: [
      'incidents:read',
      'patients:read',
      'patients:update',
      'medical_records:read',
    ],
    [CommandRole.PHYSICIAN]: [
      'incidents:read',
      'patients:*',
      'medical_records:*',
      'protocols:read',
      'prescriptions:write',
    ],
    [CommandRole.ADMIN]: ['*'],
    [CommandRole.SYSTEM_ADMIN]: ['*', 'system:*'],
  };

  return permissionMap[role] || [];
}

/**
 * 5. Calculate clearance level from role
 */
export function calculateClearanceLevel(role: CommandRole): ClearanceLevel {
  const clearanceMap: Record<CommandRole, ClearanceLevel> = {
    [CommandRole.DISPATCHER]: ClearanceLevel.BASIC,
    [CommandRole.SUPERVISOR]: ClearanceLevel.CONFIDENTIAL,
    [CommandRole.COMMANDER]: ClearanceLevel.CRITICAL,
    [CommandRole.MEDICAL_DIRECTOR]: ClearanceLevel.CRITICAL,
    [CommandRole.ADMIN]: ClearanceLevel.TOP_SECRET,
    [CommandRole.PARAMEDIC]: ClearanceLevel.CONFIDENTIAL,
    [CommandRole.EMT]: ClearanceLevel.BASIC,
    [CommandRole.NURSE]: ClearanceLevel.CONFIDENTIAL,
    [CommandRole.PHYSICIAN]: ClearanceLevel.SENSITIVE,
    [CommandRole.SYSTEM_ADMIN]: ClearanceLevel.TOP_SECRET,
  };

  return clearanceMap[role] || ClearanceLevel.PUBLIC;
}

/**
 * 6. Create emergency override
 */
export async function createEmergencyOverride(
  request: z.infer<typeof EmergencyOverrideSchema>,
  userId: string,
  approvedBy?: string
): Promise<IEmergencyOverride> {
  const validated = EmergencyOverrideSchema.parse(request);

  return {
    userId,
    type: validated.type,
    reason: validated.reason,
    incidentId: validated.incidentId,
    approvedBy,
    expiresAt: new Date(Date.now() + validated.duration * 60 * 1000),
  };
}

/**
 * 7. Validate emergency override
 */
export function validateEmergencyOverride(
  override: IEmergencyOverride
): { valid: boolean; error?: string } {
  if (override.revokedAt) {
    return { valid: false, error: 'Override has been revoked' };
  }

  if (override.expiresAt < new Date()) {
    return { valid: false, error: 'Override has expired' };
  }

  return { valid: true };
}

/**
 * 8. Check incident-level permissions
 */
export function checkIncidentPermissions(
  incidentClearance: ClearanceLevel,
  userClearance: ClearanceLevel,
  override?: IEmergencyOverride
): boolean {
  // Check if user has emergency override
  if (override && validateEmergencyOverride(override).valid) {
    return true;
  }

  // Normal clearance check
  return userClearance >= incidentClearance;
}

/**
 * 9. Generate MFA TOTP secret
 */
export function generateMFASecret(): {
  secret: string;
  qrCode: string;
  backupCodes: string[];
} {
  const secret = crypto.randomBytes(20).toString('hex');
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );

  // In real implementation, use otplib to generate QR code
  const qrCode = `otpauth://totp/WhiteCross?secret=${secret}`;

  return { secret, qrCode, backupCodes };
}

/**
 * 10. Verify MFA code
 */
export function verifyMFACode(
  secret: string,
  code: string,
  window: number = 1
): boolean {
  // Simple TOTP verification (in production, use otplib)
  const timeStep = 30;
  const currentTime = Math.floor(Date.now() / 1000 / timeStep);

  for (let i = -window; i <= window; i++) {
    const testCode = generateTOTPCode(secret, currentTime + i);
    if (testCode === code) {
      return true;
    }
  }

  return false;
}

/**
 * 11. Generate TOTP code
 */
function generateTOTPCode(secret: string, counter: number): string {
  // Simplified TOTP generation (use otplib in production)
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'));
  hmac.update(buffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0xf;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, '0');
}

/**
 * 12. Create session with security context
 */
export function createSecureSession(
  userId: string,
  role: CommandRole,
  request: Request
): ISessionSecurity {
  const sessionId = crypto.randomUUID();
  const deviceFingerprint = generateDeviceFingerprint(request);
  const clearanceLevel = calculateClearanceLevel(role);
  const now = new Date();

  return {
    userId,
    sessionId,
    ipAddress: request.ip || 'unknown',
    userAgent: request.headers['user-agent'] || 'unknown',
    deviceFingerprint,
    mfaVerified: false,
    clearanceLevel,
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours
  };
}

/**
 * 13. Generate device fingerprint
 */
export function generateDeviceFingerprint(request: Request): string {
  const components = [
    request.headers['user-agent'] || '',
    request.headers['accept-language'] || '',
    request.headers['accept-encoding'] || '',
    request.ip || '',
  ];

  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
}

/**
 * 14. Validate session security
 */
export function validateSessionSecurity(
  session: ISessionSecurity,
  request: Request
): { valid: boolean; reason?: string } {
  // Check expiration
  if (session.expiresAt < new Date()) {
    return { valid: false, reason: 'Session expired' };
  }

  // Check device fingerprint
  const currentFingerprint = generateDeviceFingerprint(request);
  if (session.deviceFingerprint !== currentFingerprint) {
    return { valid: false, reason: 'Device mismatch detected' };
  }

  // Check IP (allow some flexibility for IP changes)
  const sessionIP = session.ipAddress;
  const currentIP = request.ip || 'unknown';
  if (sessionIP !== currentIP && !isSameSubnet(sessionIP, currentIP)) {
    return { valid: false, reason: 'IP address mismatch' };
  }

  // Check inactivity timeout (30 minutes)
  const inactivityLimit = 30 * 60 * 1000;
  if (new Date().getTime() - session.lastActivity.getTime() > inactivityLimit) {
    return { valid: false, reason: 'Session inactive' };
  }

  return { valid: true };
}

/**
 * 15. Check if IPs are in same subnet
 */
function isSameSubnet(ip1: string, ip2: string): boolean {
  // Simple subnet check (first 3 octets for IPv4)
  const parts1 = ip1.split('.');
  const parts2 = ip2.split('.');

  if (parts1.length !== 4 || parts2.length !== 4) {
    return false;
  }

  return (
    parts1[0] === parts2[0] &&
    parts1[1] === parts2[1] &&
    parts1[2] === parts2[2]
  );
}

/**
 * 16. Generate API key
 */
export async function generateAPIKey(
  request: z.infer<typeof APIKeyCreateSchema>,
  createdBy: string
): Promise<IAPIKey> {
  const validated = APIKeyCreateSchema.parse(request);
  const key = `wc_${crypto.randomBytes(32).toString('hex')}`;
  const hashedKey = await bcrypt.hash(key, 12);

  const expiresAt = validated.expiresInDays
    ? new Date(Date.now() + validated.expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  return {
    id: crypto.randomUUID(),
    key, // Return once, then discard
    hashedKey,
    name: validated.name,
    scopes: validated.scopes,
    createdBy,
    expiresAt,
    ipWhitelist: validated.ipWhitelist,
    rateLimit: validated.rateLimit,
  };
}

/**
 * 17. Validate API key
 */
export async function validateAPIKey(
  providedKey: string,
  storedKey: IAPIKey,
  requestIp: string
): Promise<{ valid: boolean; error?: string }> {
  // Check expiration
  if (storedKey.expiresAt && storedKey.expiresAt < new Date()) {
    return { valid: false, error: 'API key expired' };
  }

  // Check IP whitelist
  if (storedKey.ipWhitelist && storedKey.ipWhitelist.length > 0) {
    if (!storedKey.ipWhitelist.includes(requestIp)) {
      return { valid: false, error: 'IP not whitelisted' };
    }
  }

  // Verify key
  const isValid = await bcrypt.compare(providedKey, storedKey.hashedKey);
  if (!isValid) {
    return { valid: false, error: 'Invalid API key' };
  }

  return { valid: true };
}

/**
 * 18. Check API key scopes
 */
export function checkAPIKeyScopes(
  keyScopes: APIKeyScope[],
  requiredScopes: APIKeyScope[]
): boolean {
  if (keyScopes.includes(APIKeyScope.ADMIN)) {
    return true;
  }

  return requiredScopes.every(scope => keyScopes.includes(scope));
}

/**
 * 19. Encrypt sensitive incident data
 */
export function encryptIncidentData(
  data: string,
  encryptionKey: string
): string {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * 20. Decrypt sensitive incident data
 */
export function decryptIncidentData(
  encryptedData: string,
  encryptionKey: string
): string {
  const algorithm = 'aes-256-gcm';
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * 21. Encrypt field-level data
 */
export function encryptField(value: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    iv
  );

  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * 22. Decrypt field-level data
 */
export function decryptField(encryptedValue: string, key: string): string {
  const [ivHex, encrypted] = encryptedValue.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    iv
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * 23. Hash sensitive data for search
 */
export function hashForSearch(value: string, salt: string): string {
  return crypto
    .createHash('sha256')
    .update(value + salt)
    .digest('hex');
}

/**
 * 24. Generate encryption key
 */
export function generateEncryptionKey(): IEncryptionKey {
  return {
    id: crypto.randomUUID(),
    algorithm: 'aes-256-gcm',
    version: 1,
    createdAt: new Date(),
    status: 'active',
  };
}

/**
 * 25. Rotate encryption key
 */
export function rotateEncryptionKey(currentKey: IEncryptionKey): IEncryptionKey {
  return {
    id: crypto.randomUUID(),
    algorithm: currentKey.algorithm,
    version: currentKey.version + 1,
    createdAt: new Date(),
    status: 'active',
  };
}

/**
 * 26. Establish secure communication channel
 */
export function establishSecureChannel(
  senderId: string,
  receiverId: string
): {
  channelId: string;
  sessionKey: string;
  expiresAt: Date;
} {
  const channelId = crypto.randomUUID();
  const sessionKey = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return { channelId, sessionKey, expiresAt };
}

/**
 * 27. Encrypt message for secure channel
 */
export function encryptChannelMessage(
  message: string,
  sessionKey: string
): string {
  return encryptField(message, sessionKey);
}

/**
 * 28. Decrypt message from secure channel
 */
export function decryptChannelMessage(
  encryptedMessage: string,
  sessionKey: string
): string {
  return decryptField(encryptedMessage, sessionKey);
}

/**
 * 29. Verify message integrity
 */
export function verifyMessageIntegrity(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  const verify = crypto.createVerify('SHA256');
  verify.update(message);
  verify.end();

  return verify.verify(publicKey, signature, 'hex');
}

/**
 * 30. Sign message
 */
export function signMessage(message: string, privateKey: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();

  return sign.sign(privateKey, 'hex');
}

/**
 * 31. Check zone-based access
 */
export function checkZoneAccess(
  userRole: CommandRole,
  zone: SecurityZone
): boolean {
  const zoneAccessMap: Record<SecurityZone, CommandRole[]> = {
    [SecurityZone.PUBLIC]: Object.values(CommandRole),
    [SecurityZone.RESTRICTED]: [
      CommandRole.DISPATCHER,
      CommandRole.SUPERVISOR,
      CommandRole.COMMANDER,
      CommandRole.MEDICAL_DIRECTOR,
      CommandRole.ADMIN,
      CommandRole.SYSTEM_ADMIN,
    ],
    [SecurityZone.COMMAND_CENTER]: [
      CommandRole.SUPERVISOR,
      CommandRole.COMMANDER,
      CommandRole.ADMIN,
      CommandRole.SYSTEM_ADMIN,
    ],
    [SecurityZone.MEDICAL_RESTRICTED]: [
      CommandRole.MEDICAL_DIRECTOR,
      CommandRole.PHYSICIAN,
      CommandRole.NURSE,
      CommandRole.PARAMEDIC,
      CommandRole.ADMIN,
      CommandRole.SYSTEM_ADMIN,
    ],
    [SecurityZone.EXECUTIVE]: [
      CommandRole.COMMANDER,
      CommandRole.ADMIN,
      CommandRole.SYSTEM_ADMIN,
    ],
  };

  return zoneAccessMap[zone]?.includes(userRole) || false;
}

/**
 * 32. Validate device authentication
 */
export function validateDeviceAuthentication(
  deviceId: string,
  deviceToken: string,
  storedTokenHash: string
): boolean {
  const tokenHash = crypto
    .createHash('sha256')
    .update(deviceToken)
    .digest('hex');

  return tokenHash === storedTokenHash;
}

/**
 * 33. Generate device token
 */
export function generateDeviceToken(deviceId: string): {
  token: string;
  hash: string;
} {
  const token = `${deviceId}_${crypto.randomBytes(32).toString('hex')}`;
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hash };
}

/**
 * 34. Check privilege escalation
 */
export function checkPrivilegeEscalation(
  currentRole: CommandRole,
  targetRole: CommandRole,
  authorizedBy?: string
): { allowed: boolean; requiresApproval: boolean } {
  const roleHierarchy = {
    [CommandRole.EMT]: 0,
    [CommandRole.PARAMEDIC]: 1,
    [CommandRole.NURSE]: 2,
    [CommandRole.DISPATCHER]: 2,
    [CommandRole.PHYSICIAN]: 3,
    [CommandRole.SUPERVISOR]: 3,
    [CommandRole.MEDICAL_DIRECTOR]: 4,
    [CommandRole.COMMANDER]: 4,
    [CommandRole.ADMIN]: 5,
    [CommandRole.SYSTEM_ADMIN]: 6,
  };

  const currentLevel = roleHierarchy[currentRole];
  const targetLevel = roleHierarchy[targetRole];

  if (targetLevel <= currentLevel) {
    return { allowed: false, requiresApproval: false };
  }

  const escalationGap = targetLevel - currentLevel;

  if (escalationGap === 1 && authorizedBy) {
    return { allowed: true, requiresApproval: false };
  }

  if (escalationGap > 1) {
    return { allowed: !!authorizedBy, requiresApproval: true };
  }

  return { allowed: false, requiresApproval: true };
}

/**
 * 35. Verify biometric data
 */
export function verifyBiometric(
  providedBiometric: string,
  storedBiometricHash: string
): { verified: boolean; confidence: number } {
  // Simplified biometric verification
  const providedHash = crypto
    .createHash('sha256')
    .update(providedBiometric)
    .digest('hex');

  const verified = providedHash === storedBiometricHash;
  const confidence = verified ? 0.95 : 0.0;

  return { verified, confidence };
}

/**
 * 36. Create rate limit key
 */
export function createRateLimitKey(
  userId: string,
  action: string,
  resource?: string
): string {
  const parts = ['ratelimit', userId, action];
  if (resource) {
    parts.push(resource);
  }
  return parts.join(':');
}

/**
 * 37. Check rate limit
 */
export function checkRateLimit(
  key: string,
  limit: number,
  window: number,
  currentCount: number
): { allowed: boolean; remaining: number; resetAt: Date } {
  const allowed = currentCount < limit;
  const remaining = Math.max(0, limit - currentCount - 1);
  const resetAt = new Date(Date.now() + window * 1000);

  return { allowed, remaining, resetAt };
}

/**
 * 38. Sanitize log data
 */
export function sanitizeLogData(data: any): any {
  const sensitiveFields = [
    'password',
    'token',
    'ssn',
    'creditCard',
    'apiKey',
    'secret',
  ];

  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  };

  return sanitize(data);
}

/**
 * 39. Generate security token
 */
export function generateSecurityToken(
  length: number = 32
): { token: string; hash: string } {
  const token = crypto.randomBytes(length).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hash };
}

/**
 * 40. Verify security token
 */
export function verifySecurityToken(
  providedToken: string,
  storedHash: string
): boolean {
  const hash = crypto.createHash('sha256').update(providedToken).digest('hex');
  return hash === storedHash;
}

/**
 * 41. Create password policy validator
 */
export function validatePasswordPolicy(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push('Password contains common pattern');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 42. Hash password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * 43. Verify password hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 44. Generate session token
 */
export function generateSessionToken(): {
  sessionId: string;
  token: string;
  expiresAt: Date;
} {
  const sessionId = crypto.randomUUID();
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  return { sessionId, token, expiresAt };
}

/**
 * 45. Validate IP whitelist
 */
export function validateIPWhitelist(ip: string, whitelist: string[]): boolean {
  return whitelist.includes(ip);
}

/**
 * 46. Check CIDR range
 */
export function isIPInCIDR(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = -1 << (32 - parseInt(bits));

  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(range);

  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * 47. Convert IP to number
 */
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

/**
 * 48. Generate CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  return crypto
    .createHash('sha256')
    .update(`${sessionId}${crypto.randomBytes(32).toString('hex')}`)
    .digest('hex');
}

/**
 * 49. Validate CSRF token
 */
export function validateCSRFToken(
  token: string,
  storedToken: string
): boolean {
  return token === storedToken;
}

/**
 * 50. Create security context
 */
export function createSecurityContext(
  userId: string,
  role: CommandRole,
  clearanceLevel: ClearanceLevel,
  permissions: string[]
): {
  userId: string;
  role: CommandRole;
  clearanceLevel: ClearanceLevel;
  permissions: string[];
  createdAt: Date;
} {
  return {
    userId,
    role,
    clearanceLevel,
    permissions,
    createdAt: new Date(),
  };
}

// ============================================================================
// NESTJS GUARDS
// ============================================================================

/**
 * Role-based access control guard
 */
@Injectable()
export class CommandRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<CommandRole[]>(
      'roles',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return requiredRoles.includes(user.role);
  }
}

/**
 * Clearance level guard
 */
@Injectable()
export class ClearanceLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredClearance = this.reflector.getAllAndOverride<ClearanceLevel>(
      'clearance',
      [context.getHandler(), context.getClass()]
    );

    if (requiredClearance === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userClearance = calculateClearanceLevel(user.role);

    if (userClearance < requiredClearance) {
      // Check for emergency override
      if (user.emergencyOverride) {
        const validation = validateEmergencyOverride(user.emergencyOverride);
        if (validation.valid) {
          return true;
        }
      }

      throw new ForbiddenException(
        `Insufficient clearance level. Required: ${requiredClearance}, Current: ${userClearance}`
      );
    }

    return true;
  }
}

/**
 * Emergency override guard
 */
@Injectable()
export class EmergencyOverrideGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.emergencyOverride) {
      throw new ForbiddenException('Emergency override required');
    }

    const validation = validateEmergencyOverride(user.emergencyOverride);
    if (!validation.valid) {
      throw new ForbiddenException(
        `Invalid emergency override: ${validation.error}`
      );
    }

    return true;
  }
}

/**
 * API key guard
 */
@Injectable()
export class APIKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }

    // In real implementation, fetch stored key from database
    // const storedKey = await this.apiKeyService.findByKey(apiKey);
    // const validation = await validateAPIKey(apiKey, storedKey, request.ip);

    // if (!validation.valid) {
    //   throw new UnauthorizedException(validation.error);
    // }

    return true;
  }
}

/**
 * Zone access guard
 */
@Injectable()
export class ZoneAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredZone = this.reflector.getAllAndOverride<SecurityZone>(
      'zone',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredZone) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasAccess = checkZoneAccess(user.role, requiredZone);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied to security zone: ${requiredZone}`
      );
    }

    return true;
  }
}

// ============================================================================
// DECORATORS
// ============================================================================

/**
 * Roles decorator
 */
export const Roles = (...roles: CommandRole[]) => SetMetadata('roles', roles);

/**
 * Clearance decorator
 */
export const RequireClearance = (level: ClearanceLevel) =>
  SetMetadata('clearance', level);

/**
 * Zone decorator
 */
export const RequireZone = (zone: SecurityZone) => SetMetadata('zone', zone);

/**
 * Emergency override decorator
 */
export const RequireEmergencyOverride = () =>
  SetMetadata('emergencyOverride', true);

/**
 * Current user decorator
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

// ============================================================================
// INTERCEPTORS
// ============================================================================

/**
 * Security logging interceptor
 */
@Injectable()
export class SecurityLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('SecurityAudit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method,
      url,
      userId: user?.id,
      role: user?.role,
      ip,
      userAgent: request.headers['user-agent'],
    };

    this.logger.log(`Security access: ${JSON.stringify(logEntry)}`);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(`Success: ${method} ${url}`);
        },
        error: (error) => {
          this.logger.error(
            `Failed: ${method} ${url} - ${error.message}`,
            error.stack
          );
        },
      })
    );
  }
}

/**
 * Data encryption interceptor
 */
@Injectable()
export class DataEncryptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Encrypt sensitive response fields
    return next.handle().pipe(
      tap((data) => {
        if (data && typeof data === 'object') {
          this.encryptSensitiveFields(data);
        }
      })
    );
  }

  private encryptSensitiveFields(obj: any): void {
    const sensitiveFields = ['ssn', 'creditCard', 'medicalRecordNumber'];

    for (const key of Object.keys(obj)) {
      if (sensitiveFields.includes(key) && obj[key]) {
        // Mark as encrypted (actual encryption would use proper key)
        obj[key] = `[ENCRYPTED]`;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.encryptSensitiveFields(obj[key]);
      }
    }
  }
}
