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
import { CanActivate, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { z } from 'zod';
/**
 * Command center user roles
 */
export declare enum CommandRole {
    DISPATCHER = "dispatcher",
    SUPERVISOR = "supervisor",
    COMMANDER = "commander",
    MEDICAL_DIRECTOR = "medical_director",
    ADMIN = "admin",
    PARAMEDIC = "paramedic",
    EMT = "emt",
    NURSE = "nurse",
    PHYSICIAN = "physician",
    SYSTEM_ADMIN = "system_admin"
}
/**
 * Incident clearance levels
 */
export declare enum ClearanceLevel {
    PUBLIC = 0,
    BASIC = 1,
    CONFIDENTIAL = 2,
    SENSITIVE = 3,
    CRITICAL = 4,
    TOP_SECRET = 5
}
/**
 * Emergency override types
 */
export declare enum EmergencyOverrideType {
    BREAK_GLASS = "break_glass",
    MEDICAL_EMERGENCY = "medical_emergency",
    MASS_CASUALTY = "mass_casualty",
    DISASTER_RESPONSE = "disaster_response",
    SUPERVISOR_OVERRIDE = "supervisor_override"
}
/**
 * Security zones for zone-based access control
 */
export declare enum SecurityZone {
    PUBLIC = "public",
    RESTRICTED = "restricted",
    COMMAND_CENTER = "command_center",
    MEDICAL_RESTRICTED = "medical_restricted",
    EXECUTIVE = "executive"
}
/**
 * MFA methods
 */
export declare enum MFAMethod {
    TOTP = "totp",
    SMS = "sms",
    EMAIL = "email",
    HARDWARE_TOKEN = "hardware_token",
    BIOMETRIC = "biometric",
    PUSH_NOTIFICATION = "push_notification"
}
/**
 * API key scopes
 */
export declare enum APIKeyScope {
    READ_INCIDENTS = "read:incidents",
    WRITE_INCIDENTS = "write:incidents",
    READ_UNITS = "read:units",
    WRITE_UNITS = "write:units",
    READ_RESOURCES = "read:resources",
    WRITE_RESOURCES = "write:resources",
    ADMIN = "admin"
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
    maxSessionDuration: number;
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
/**
 * Emergency override validation schema
 */
export declare const EmergencyOverrideSchema: any;
/**
 * API key creation schema
 */
export declare const APIKeyCreateSchema: any;
/**
 * MFA verification schema
 */
export declare const MFAVerificationSchema: any;
/**
 * 1. Generate secure incident access token
 */
export declare function generateIncidentAccessToken(incidentId: string, userId: string, clearanceLevel: ClearanceLevel, duration?: number): {
    token: string;
    expiresAt: Date;
};
/**
 * 2. Verify incident access token
 */
export declare function verifyIncidentAccessToken(token: string): {
    valid: boolean;
    payload?: any;
    error?: string;
};
/**
 * 3. Check role-based permissions
 */
export declare function checkRolePermissions(userRole: CommandRole, requiredPermissions: string[]): boolean;
/**
 * 4. Get role permissions mapping
 */
export declare function getRolePermissions(role: CommandRole): string[];
/**
 * 5. Calculate clearance level from role
 */
export declare function calculateClearanceLevel(role: CommandRole): ClearanceLevel;
/**
 * 6. Create emergency override
 */
export declare function createEmergencyOverride(request: z.infer<typeof EmergencyOverrideSchema>, userId: string, approvedBy?: string): Promise<IEmergencyOverride>;
/**
 * 7. Validate emergency override
 */
export declare function validateEmergencyOverride(override: IEmergencyOverride): {
    valid: boolean;
    error?: string;
};
/**
 * 8. Check incident-level permissions
 */
export declare function checkIncidentPermissions(incidentClearance: ClearanceLevel, userClearance: ClearanceLevel, override?: IEmergencyOverride): boolean;
/**
 * 9. Generate MFA TOTP secret
 */
export declare function generateMFASecret(): {
    secret: string;
    qrCode: string;
    backupCodes: string[];
};
/**
 * 10. Verify MFA code
 */
export declare function verifyMFACode(secret: string, code: string, window?: number): boolean;
/**
 * 12. Create session with security context
 */
export declare function createSecureSession(userId: string, role: CommandRole, request: Request): ISessionSecurity;
/**
 * 13. Generate device fingerprint
 */
export declare function generateDeviceFingerprint(request: Request): string;
/**
 * 14. Validate session security
 */
export declare function validateSessionSecurity(session: ISessionSecurity, request: Request): {
    valid: boolean;
    reason?: string;
};
/**
 * 16. Generate API key
 */
export declare function generateAPIKey(request: z.infer<typeof APIKeyCreateSchema>, createdBy: string): Promise<IAPIKey>;
/**
 * 17. Validate API key
 */
export declare function validateAPIKey(providedKey: string, storedKey: IAPIKey, requestIp: string): Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * 18. Check API key scopes
 */
export declare function checkAPIKeyScopes(keyScopes: APIKeyScope[], requiredScopes: APIKeyScope[]): boolean;
/**
 * 19. Encrypt sensitive incident data
 */
export declare function encryptIncidentData(data: string, encryptionKey: string): string;
/**
 * 20. Decrypt sensitive incident data
 */
export declare function decryptIncidentData(encryptedData: string, encryptionKey: string): string;
/**
 * 21. Encrypt field-level data
 */
export declare function encryptField(value: string, key: string): string;
/**
 * 22. Decrypt field-level data
 */
export declare function decryptField(encryptedValue: string, key: string): string;
/**
 * 23. Hash sensitive data for search
 */
export declare function hashForSearch(value: string, salt: string): string;
/**
 * 24. Generate encryption key
 */
export declare function generateEncryptionKey(): IEncryptionKey;
/**
 * 25. Rotate encryption key
 */
export declare function rotateEncryptionKey(currentKey: IEncryptionKey): IEncryptionKey;
/**
 * 26. Establish secure communication channel
 */
export declare function establishSecureChannel(senderId: string, receiverId: string): {
    channelId: string;
    sessionKey: string;
    expiresAt: Date;
};
/**
 * 27. Encrypt message for secure channel
 */
export declare function encryptChannelMessage(message: string, sessionKey: string): string;
/**
 * 28. Decrypt message from secure channel
 */
export declare function decryptChannelMessage(encryptedMessage: string, sessionKey: string): string;
/**
 * 29. Verify message integrity
 */
export declare function verifyMessageIntegrity(message: string, signature: string, publicKey: string): boolean;
/**
 * 30. Sign message
 */
export declare function signMessage(message: string, privateKey: string): string;
/**
 * 31. Check zone-based access
 */
export declare function checkZoneAccess(userRole: CommandRole, zone: SecurityZone): boolean;
/**
 * 32. Validate device authentication
 */
export declare function validateDeviceAuthentication(deviceId: string, deviceToken: string, storedTokenHash: string): boolean;
/**
 * 33. Generate device token
 */
export declare function generateDeviceToken(deviceId: string): {
    token: string;
    hash: string;
};
/**
 * 34. Check privilege escalation
 */
export declare function checkPrivilegeEscalation(currentRole: CommandRole, targetRole: CommandRole, authorizedBy?: string): {
    allowed: boolean;
    requiresApproval: boolean;
};
/**
 * 35. Verify biometric data
 */
export declare function verifyBiometric(providedBiometric: string, storedBiometricHash: string): {
    verified: boolean;
    confidence: number;
};
/**
 * 36. Create rate limit key
 */
export declare function createRateLimitKey(userId: string, action: string, resource?: string): string;
/**
 * 37. Check rate limit
 */
export declare function checkRateLimit(key: string, limit: number, window: number, currentCount: number): {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
};
/**
 * 38. Sanitize log data
 */
export declare function sanitizeLogData(data: any): any;
/**
 * 39. Generate security token
 */
export declare function generateSecurityToken(length?: number): {
    token: string;
    hash: string;
};
/**
 * 40. Verify security token
 */
export declare function verifySecurityToken(providedToken: string, storedHash: string): boolean;
/**
 * 41. Create password policy validator
 */
export declare function validatePasswordPolicy(password: string): {
    valid: boolean;
    errors: string[];
};
/**
 * 42. Hash password with salt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * 43. Verify password hash
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * 44. Generate session token
 */
export declare function generateSessionToken(): {
    sessionId: string;
    token: string;
    expiresAt: Date;
};
/**
 * 45. Validate IP whitelist
 */
export declare function validateIPWhitelist(ip: string, whitelist: string[]): boolean;
/**
 * 46. Check CIDR range
 */
export declare function isIPInCIDR(ip: string, cidr: string): boolean;
/**
 * 48. Generate CSRF token
 */
export declare function generateCSRFToken(sessionId: string): string;
/**
 * 49. Validate CSRF token
 */
export declare function validateCSRFToken(token: string, storedToken: string): boolean;
/**
 * 50. Create security context
 */
export declare function createSecurityContext(userId: string, role: CommandRole, clearanceLevel: ClearanceLevel, permissions: string[]): {
    userId: string;
    role: CommandRole;
    clearanceLevel: ClearanceLevel;
    permissions: string[];
    createdAt: Date;
};
/**
 * Role-based access control guard
 */
export declare class CommandRoleGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Clearance level guard
 */
export declare class ClearanceLevelGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Emergency override guard
 */
export declare class EmergencyOverrideGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
/**
 * API key guard
 */
export declare class APIKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * Zone access guard
 */
export declare class ZoneAccessGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Roles decorator
 */
export declare const Roles: (...roles: CommandRole[]) => any;
/**
 * Clearance decorator
 */
export declare const RequireClearance: (level: ClearanceLevel) => any;
/**
 * Zone decorator
 */
export declare const RequireZone: (zone: SecurityZone) => any;
/**
 * Emergency override decorator
 */
export declare const RequireEmergencyOverride: () => any;
/**
 * Current user decorator
 */
export declare const CurrentUser: any;
/**
 * Security logging interceptor
 */
export declare class SecurityLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * Data encryption interceptor
 */
export declare class DataEncryptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private encryptSensitiveFields;
}
//# sourceMappingURL=command-security-controls.d.ts.map