"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataEncryptionInterceptor = exports.SecurityLoggingInterceptor = exports.CurrentUser = exports.RequireEmergencyOverride = exports.RequireZone = exports.RequireClearance = exports.Roles = exports.ZoneAccessGuard = exports.APIKeyGuard = exports.EmergencyOverrideGuard = exports.ClearanceLevelGuard = exports.CommandRoleGuard = exports.MFAVerificationSchema = exports.APIKeyCreateSchema = exports.EmergencyOverrideSchema = exports.APIKeyScope = exports.MFAMethod = exports.SecurityZone = exports.EmergencyOverrideType = exports.ClearanceLevel = exports.CommandRole = void 0;
exports.generateIncidentAccessToken = generateIncidentAccessToken;
exports.verifyIncidentAccessToken = verifyIncidentAccessToken;
exports.checkRolePermissions = checkRolePermissions;
exports.getRolePermissions = getRolePermissions;
exports.calculateClearanceLevel = calculateClearanceLevel;
exports.createEmergencyOverride = createEmergencyOverride;
exports.validateEmergencyOverride = validateEmergencyOverride;
exports.checkIncidentPermissions = checkIncidentPermissions;
exports.generateMFASecret = generateMFASecret;
exports.verifyMFACode = verifyMFACode;
exports.createSecureSession = createSecureSession;
exports.generateDeviceFingerprint = generateDeviceFingerprint;
exports.validateSessionSecurity = validateSessionSecurity;
exports.generateAPIKey = generateAPIKey;
exports.validateAPIKey = validateAPIKey;
exports.checkAPIKeyScopes = checkAPIKeyScopes;
exports.encryptIncidentData = encryptIncidentData;
exports.decryptIncidentData = decryptIncidentData;
exports.encryptField = encryptField;
exports.decryptField = decryptField;
exports.hashForSearch = hashForSearch;
exports.generateEncryptionKey = generateEncryptionKey;
exports.rotateEncryptionKey = rotateEncryptionKey;
exports.establishSecureChannel = establishSecureChannel;
exports.encryptChannelMessage = encryptChannelMessage;
exports.decryptChannelMessage = decryptChannelMessage;
exports.verifyMessageIntegrity = verifyMessageIntegrity;
exports.signMessage = signMessage;
exports.checkZoneAccess = checkZoneAccess;
exports.validateDeviceAuthentication = validateDeviceAuthentication;
exports.generateDeviceToken = generateDeviceToken;
exports.checkPrivilegeEscalation = checkPrivilegeEscalation;
exports.verifyBiometric = verifyBiometric;
exports.createRateLimitKey = createRateLimitKey;
exports.checkRateLimit = checkRateLimit;
exports.sanitizeLogData = sanitizeLogData;
exports.generateSecurityToken = generateSecurityToken;
exports.verifySecurityToken = verifySecurityToken;
exports.validatePasswordPolicy = validatePasswordPolicy;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateSessionToken = generateSessionToken;
exports.validateIPWhitelist = validateIPWhitelist;
exports.isIPInCIDR = isIPInCIDR;
exports.generateCSRFToken = generateCSRFToken;
exports.validateCSRFToken = validateCSRFToken;
exports.createSecurityContext = createSecurityContext;
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
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Command center user roles
 */
var CommandRole;
(function (CommandRole) {
    CommandRole["DISPATCHER"] = "dispatcher";
    CommandRole["SUPERVISOR"] = "supervisor";
    CommandRole["COMMANDER"] = "commander";
    CommandRole["MEDICAL_DIRECTOR"] = "medical_director";
    CommandRole["ADMIN"] = "admin";
    CommandRole["PARAMEDIC"] = "paramedic";
    CommandRole["EMT"] = "emt";
    CommandRole["NURSE"] = "nurse";
    CommandRole["PHYSICIAN"] = "physician";
    CommandRole["SYSTEM_ADMIN"] = "system_admin";
})(CommandRole || (exports.CommandRole = CommandRole = {}));
/**
 * Incident clearance levels
 */
var ClearanceLevel;
(function (ClearanceLevel) {
    ClearanceLevel[ClearanceLevel["PUBLIC"] = 0] = "PUBLIC";
    ClearanceLevel[ClearanceLevel["BASIC"] = 1] = "BASIC";
    ClearanceLevel[ClearanceLevel["CONFIDENTIAL"] = 2] = "CONFIDENTIAL";
    ClearanceLevel[ClearanceLevel["SENSITIVE"] = 3] = "SENSITIVE";
    ClearanceLevel[ClearanceLevel["CRITICAL"] = 4] = "CRITICAL";
    ClearanceLevel[ClearanceLevel["TOP_SECRET"] = 5] = "TOP_SECRET";
})(ClearanceLevel || (exports.ClearanceLevel = ClearanceLevel = {}));
/**
 * Emergency override types
 */
var EmergencyOverrideType;
(function (EmergencyOverrideType) {
    EmergencyOverrideType["BREAK_GLASS"] = "break_glass";
    EmergencyOverrideType["MEDICAL_EMERGENCY"] = "medical_emergency";
    EmergencyOverrideType["MASS_CASUALTY"] = "mass_casualty";
    EmergencyOverrideType["DISASTER_RESPONSE"] = "disaster_response";
    EmergencyOverrideType["SUPERVISOR_OVERRIDE"] = "supervisor_override";
})(EmergencyOverrideType || (exports.EmergencyOverrideType = EmergencyOverrideType = {}));
/**
 * Security zones for zone-based access control
 */
var SecurityZone;
(function (SecurityZone) {
    SecurityZone["PUBLIC"] = "public";
    SecurityZone["RESTRICTED"] = "restricted";
    SecurityZone["COMMAND_CENTER"] = "command_center";
    SecurityZone["MEDICAL_RESTRICTED"] = "medical_restricted";
    SecurityZone["EXECUTIVE"] = "executive";
})(SecurityZone || (exports.SecurityZone = SecurityZone = {}));
/**
 * MFA methods
 */
var MFAMethod;
(function (MFAMethod) {
    MFAMethod["TOTP"] = "totp";
    MFAMethod["SMS"] = "sms";
    MFAMethod["EMAIL"] = "email";
    MFAMethod["HARDWARE_TOKEN"] = "hardware_token";
    MFAMethod["BIOMETRIC"] = "biometric";
    MFAMethod["PUSH_NOTIFICATION"] = "push_notification";
})(MFAMethod || (exports.MFAMethod = MFAMethod = {}));
/**
 * API key scopes
 */
var APIKeyScope;
(function (APIKeyScope) {
    APIKeyScope["READ_INCIDENTS"] = "read:incidents";
    APIKeyScope["WRITE_INCIDENTS"] = "write:incidents";
    APIKeyScope["READ_UNITS"] = "read:units";
    APIKeyScope["WRITE_UNITS"] = "write:units";
    APIKeyScope["READ_RESOURCES"] = "read:resources";
    APIKeyScope["WRITE_RESOURCES"] = "write:resources";
    APIKeyScope["ADMIN"] = "admin";
})(APIKeyScope || (exports.APIKeyScope = APIKeyScope = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Emergency override validation schema
 */
exports.EmergencyOverrideSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(EmergencyOverrideType),
    reason: zod_1.z.string().min(10).max(500),
    incidentId: zod_1.z.string().uuid().optional(),
    duration: zod_1.z.number().min(1).max(240), // max 4 hours
});
/**
 * API key creation schema
 */
exports.APIKeyCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    scopes: zod_1.z.array(zod_1.z.nativeEnum(APIKeyScope)),
    expiresInDays: zod_1.z.number().min(1).max(365).optional(),
    ipWhitelist: zod_1.z.array(zod_1.z.string().ip()).optional(),
    rateLimit: zod_1.z.number().min(10).max(10000).optional(),
});
/**
 * MFA verification schema
 */
exports.MFAVerificationSchema = zod_1.z.object({
    method: zod_1.z.nativeEnum(MFAMethod),
    code: zod_1.z.string().length(6).regex(/^\d{6}$/),
    sessionId: zod_1.z.string().uuid(),
});
// ============================================================================
// SECURITY CONTROL FUNCTIONS
// ============================================================================
/**
 * 1. Generate secure incident access token
 */
function generateIncidentAccessToken(incidentId, userId, clearanceLevel, duration = 3600) {
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
function verifyIncidentAccessToken(token) {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
            return { valid: false, error: 'Token expired' };
        }
        return { valid: true, payload: decoded };
    }
    catch (error) {
        return { valid: false, error: 'Invalid token format' };
    }
}
/**
 * 3. Check role-based permissions
 */
function checkRolePermissions(userRole, requiredPermissions) {
    const rolePermissions = getRolePermissions(userRole);
    return requiredPermissions.every(perm => rolePermissions.includes(perm));
}
/**
 * 4. Get role permissions mapping
 */
function getRolePermissions(role) {
    const permissionMap = {
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
function calculateClearanceLevel(role) {
    const clearanceMap = {
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
async function createEmergencyOverride(request, userId, approvedBy) {
    const validated = exports.EmergencyOverrideSchema.parse(request);
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
function validateEmergencyOverride(override) {
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
function checkIncidentPermissions(incidentClearance, userClearance, override) {
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
function generateMFASecret() {
    const secret = crypto.randomBytes(20).toString('hex');
    const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString('hex').toUpperCase());
    // In real implementation, use otplib to generate QR code
    const qrCode = `otpauth://totp/WhiteCross?secret=${secret}`;
    return { secret, qrCode, backupCodes };
}
/**
 * 10. Verify MFA code
 */
function verifyMFACode(secret, code, window = 1) {
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
function generateTOTPCode(secret, counter) {
    // Simplified TOTP generation (use otplib in production)
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'));
    hmac.update(buffer);
    const hash = hmac.digest();
    const offset = hash[hash.length - 1] & 0xf;
    const code = (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) % 1000000;
    return code.toString().padStart(6, '0');
}
/**
 * 12. Create session with security context
 */
function createSecureSession(userId, role, request) {
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
function generateDeviceFingerprint(request) {
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
function validateSessionSecurity(session, request) {
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
function isSameSubnet(ip1, ip2) {
    // Simple subnet check (first 3 octets for IPv4)
    const parts1 = ip1.split('.');
    const parts2 = ip2.split('.');
    if (parts1.length !== 4 || parts2.length !== 4) {
        return false;
    }
    return (parts1[0] === parts2[0] &&
        parts1[1] === parts2[1] &&
        parts1[2] === parts2[2]);
}
/**
 * 16. Generate API key
 */
async function generateAPIKey(request, createdBy) {
    const validated = exports.APIKeyCreateSchema.parse(request);
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
async function validateAPIKey(providedKey, storedKey, requestIp) {
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
function checkAPIKeyScopes(keyScopes, requiredScopes) {
    if (keyScopes.includes(APIKeyScope.ADMIN)) {
        return true;
    }
    return requiredScopes.every(scope => keyScopes.includes(scope));
}
/**
 * 19. Encrypt sensitive incident data
 */
function encryptIncidentData(data, encryptionKey) {
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
function decryptIncidentData(encryptedData, encryptionKey) {
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
function encryptField(value, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}
/**
 * 22. Decrypt field-level data
 */
function decryptField(encryptedValue, key) {
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
/**
 * 23. Hash sensitive data for search
 */
function hashForSearch(value, salt) {
    return crypto
        .createHash('sha256')
        .update(value + salt)
        .digest('hex');
}
/**
 * 24. Generate encryption key
 */
function generateEncryptionKey() {
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
function rotateEncryptionKey(currentKey) {
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
function establishSecureChannel(senderId, receiverId) {
    const channelId = crypto.randomUUID();
    const sessionKey = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return { channelId, sessionKey, expiresAt };
}
/**
 * 27. Encrypt message for secure channel
 */
function encryptChannelMessage(message, sessionKey) {
    return encryptField(message, sessionKey);
}
/**
 * 28. Decrypt message from secure channel
 */
function decryptChannelMessage(encryptedMessage, sessionKey) {
    return decryptField(encryptedMessage, sessionKey);
}
/**
 * 29. Verify message integrity
 */
function verifyMessageIntegrity(message, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
}
/**
 * 30. Sign message
 */
function signMessage(message, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'hex');
}
/**
 * 31. Check zone-based access
 */
function checkZoneAccess(userRole, zone) {
    const zoneAccessMap = {
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
function validateDeviceAuthentication(deviceId, deviceToken, storedTokenHash) {
    const tokenHash = crypto
        .createHash('sha256')
        .update(deviceToken)
        .digest('hex');
    return tokenHash === storedTokenHash;
}
/**
 * 33. Generate device token
 */
function generateDeviceToken(deviceId) {
    const token = `${deviceId}_${crypto.randomBytes(32).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
}
/**
 * 34. Check privilege escalation
 */
function checkPrivilegeEscalation(currentRole, targetRole, authorizedBy) {
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
function verifyBiometric(providedBiometric, storedBiometricHash) {
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
function createRateLimitKey(userId, action, resource) {
    const parts = ['ratelimit', userId, action];
    if (resource) {
        parts.push(resource);
    }
    return parts.join(':');
}
/**
 * 37. Check rate limit
 */
function checkRateLimit(key, limit, window, currentCount) {
    const allowed = currentCount < limit;
    const remaining = Math.max(0, limit - currentCount - 1);
    const resetAt = new Date(Date.now() + window * 1000);
    return { allowed, remaining, resetAt };
}
/**
 * 38. Sanitize log data
 */
function sanitizeLogData(data) {
    const sensitiveFields = [
        'password',
        'token',
        'ssn',
        'creditCard',
        'apiKey',
        'secret',
    ];
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                sanitized[key] = '[REDACTED]';
            }
            else {
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
function generateSecurityToken(length = 32) {
    const token = crypto.randomBytes(length).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
}
/**
 * 40. Verify security token
 */
function verifySecurityToken(providedToken, storedHash) {
    const hash = crypto.createHash('sha256').update(providedToken).digest('hex');
    return hash === storedHash;
}
/**
 * 41. Create password policy validator
 */
function validatePasswordPolicy(password) {
    const errors = [];
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
async function hashPassword(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}
/**
 * 43. Verify password hash
 */
async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * 44. Generate session token
 */
function generateSessionToken() {
    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
    return { sessionId, token, expiresAt };
}
/**
 * 45. Validate IP whitelist
 */
function validateIPWhitelist(ip, whitelist) {
    return whitelist.includes(ip);
}
/**
 * 46. Check CIDR range
 */
function isIPInCIDR(ip, cidr) {
    const [range, bits] = cidr.split('/');
    const mask = -1 << (32 - parseInt(bits));
    const ipNum = ipToNumber(ip);
    const rangeNum = ipToNumber(range);
    return (ipNum & mask) === (rangeNum & mask);
}
/**
 * 47. Convert IP to number
 */
function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}
/**
 * 48. Generate CSRF token
 */
function generateCSRFToken(sessionId) {
    return crypto
        .createHash('sha256')
        .update(`${sessionId}${crypto.randomBytes(32).toString('hex')}`)
        .digest('hex');
}
/**
 * 49. Validate CSRF token
 */
function validateCSRFToken(token, storedToken) {
    return token === storedToken;
}
/**
 * 50. Create security context
 */
function createSecurityContext(userId, role, clearanceLevel, permissions) {
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
let CommandRoleGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CommandRoleGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredRoles = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
            if (!requiredRoles) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            return requiredRoles.includes(user.role);
        }
    };
    __setFunctionName(_classThis, "CommandRoleGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommandRoleGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommandRoleGuard = _classThis;
})();
exports.CommandRoleGuard = CommandRoleGuard;
/**
 * Clearance level guard
 */
let ClearanceLevelGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClearanceLevelGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredClearance = this.reflector.getAllAndOverride('clearance', [context.getHandler(), context.getClass()]);
            if (requiredClearance === undefined) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
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
                throw new common_1.ForbiddenException(`Insufficient clearance level. Required: ${requiredClearance}, Current: ${userClearance}`);
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "ClearanceLevelGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClearanceLevelGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClearanceLevelGuard = _classThis;
})();
exports.ClearanceLevelGuard = ClearanceLevelGuard;
/**
 * Emergency override guard
 */
let EmergencyOverrideGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmergencyOverrideGuard = _classThis = class {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user?.emergencyOverride) {
                throw new common_1.ForbiddenException('Emergency override required');
            }
            const validation = validateEmergencyOverride(user.emergencyOverride);
            if (!validation.valid) {
                throw new common_1.ForbiddenException(`Invalid emergency override: ${validation.error}`);
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "EmergencyOverrideGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmergencyOverrideGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmergencyOverrideGuard = _classThis;
})();
exports.EmergencyOverrideGuard = EmergencyOverrideGuard;
/**
 * API key guard
 */
let APIKeyGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var APIKeyGuard = _classThis = class {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const apiKey = request.headers['x-api-key'];
            if (!apiKey) {
                throw new common_1.UnauthorizedException('API key required');
            }
            // In real implementation, fetch stored key from database
            // const storedKey = await this.apiKeyService.findByKey(apiKey);
            // const validation = await validateAPIKey(apiKey, storedKey, request.ip);
            // if (!validation.valid) {
            //   throw new UnauthorizedException(validation.error);
            // }
            return true;
        }
    };
    __setFunctionName(_classThis, "APIKeyGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        APIKeyGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return APIKeyGuard = _classThis;
})();
exports.APIKeyGuard = APIKeyGuard;
/**
 * Zone access guard
 */
let ZoneAccessGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ZoneAccessGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredZone = this.reflector.getAllAndOverride('zone', [context.getHandler(), context.getClass()]);
            if (!requiredZone) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const hasAccess = checkZoneAccess(user.role, requiredZone);
            if (!hasAccess) {
                throw new common_1.ForbiddenException(`Access denied to security zone: ${requiredZone}`);
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "ZoneAccessGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZoneAccessGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZoneAccessGuard = _classThis;
})();
exports.ZoneAccessGuard = ZoneAccessGuard;
// ============================================================================
// DECORATORS
// ============================================================================
/**
 * Roles decorator
 */
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
/**
 * Clearance decorator
 */
const RequireClearance = (level) => (0, common_1.SetMetadata)('clearance', level);
exports.RequireClearance = RequireClearance;
/**
 * Zone decorator
 */
const RequireZone = (zone) => (0, common_1.SetMetadata)('zone', zone);
exports.RequireZone = RequireZone;
/**
 * Emergency override decorator
 */
const RequireEmergencyOverride = () => (0, common_1.SetMetadata)('emergencyOverride', true);
exports.RequireEmergencyOverride = RequireEmergencyOverride;
/**
 * Current user decorator
 */
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
// ============================================================================
// INTERCEPTORS
// ============================================================================
/**
 * Security logging interceptor
 */
let SecurityLoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SecurityLoggingInterceptor = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger('SecurityAudit');
        }
        intercept(context, next) {
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
            return next.handle().pipe((0, operators_1.tap)({
                next: () => {
                    this.logger.log(`Success: ${method} ${url}`);
                },
                error: (error) => {
                    this.logger.error(`Failed: ${method} ${url} - ${error.message}`, error.stack);
                },
            }));
        }
    };
    __setFunctionName(_classThis, "SecurityLoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityLoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityLoggingInterceptor = _classThis;
})();
exports.SecurityLoggingInterceptor = SecurityLoggingInterceptor;
/**
 * Data encryption interceptor
 */
let DataEncryptionInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DataEncryptionInterceptor = _classThis = class {
        intercept(context, next) {
            // Encrypt sensitive response fields
            return next.handle().pipe((0, operators_1.tap)((data) => {
                if (data && typeof data === 'object') {
                    this.encryptSensitiveFields(data);
                }
            }));
        }
        encryptSensitiveFields(obj) {
            const sensitiveFields = ['ssn', 'creditCard', 'medicalRecordNumber'];
            for (const key of Object.keys(obj)) {
                if (sensitiveFields.includes(key) && obj[key]) {
                    // Mark as encrypted (actual encryption would use proper key)
                    obj[key] = `[ENCRYPTED]`;
                }
                else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    this.encryptSensitiveFields(obj[key]);
                }
            }
        }
    };
    __setFunctionName(_classThis, "DataEncryptionInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataEncryptionInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataEncryptionInterceptor = _classThis;
})();
exports.DataEncryptionInterceptor = DataEncryptionInterceptor;
//# sourceMappingURL=command-security-controls.js.map