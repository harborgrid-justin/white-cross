"use strict";
/**
 * SAN Security & Access Control Kit
 *
 * Comprehensive security, access control, and compliance utilities for
 * healthcare platforms with HIPAA compliance, multi-tenancy isolation,
 * encryption, audit logging, and vulnerability detection.
 *
 * @module san-security-access-kit
 * @version 1.0.0
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataClassification = exports.Permission = exports.UserRole = void 0;
exports.hasRole = hasRole;
exports.hasAnyRole = hasAnyRole;
exports.getRolePermissions = getRolePermissions;
exports.hasPermission = hasPermission;
exports.hasAllPermissions = hasAllPermissions;
exports.createAccessControlEntry = createAccessControlEntry;
exports.checkAclAccess = checkAclAccess;
exports.evaluateAccessConditions = evaluateAccessConditions;
exports.filterAclByResource = filterAclByResource;
exports.revokeAclEntry = revokeAclEntry;
exports.generateEncryptionKey = generateEncryptionKey;
exports.deriveKeyFromPassword = deriveKeyFromPassword;
exports.encryptData = encryptData;
exports.decryptData = decryptData;
exports.hashSensitiveData = hashSensitiveData;
exports.encryptFields = encryptFields;
exports.decryptFields = decryptFields;
exports.generateSecureToken = generateSecureToken;
exports.createTenantContext = createTenantContext;
exports.validateTenantIsolation = validateTenantIsolation;
exports.getTenantEncryptionKey = getTenantEncryptionKey;
exports.filterByTenant = filterByTenant;
exports.validateCrossTenantAccess = validateCrossTenantAccess;
exports.createAuditLog = createAuditLog;
exports.filterAuditLogs = filterAuditLogs;
exports.detectSuspiciousPatterns = detectSuspiciousPatterns;
exports.generateComplianceReport = generateComplianceReport;
exports.createSecurityPolicy = createSecurityPolicy;
exports.evaluateSecurityPolicy = evaluateSecurityPolicy;
exports.applySecurityPolicies = applySecurityPolicies;
exports.validatePasswordStrength = validatePasswordStrength;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createSecureSession = createSecureSession;
exports.validateSession = validateSession;
exports.refreshSessionActivity = refreshSessionActivity;
exports.scanForVulnerabilities = scanForVulnerabilities;
exports.scanConfiguration = scanConfiguration;
exports.validateHipaaCompliance = validateHipaaCompliance;
exports.classifyDataSensitivity = classifyDataSensitivity;
exports.maskSensitiveData = maskSensitiveData;
exports.sanitizeForLogging = sanitizeForLogging;
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * User role enumeration for RBAC
 */
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["DOCTOR"] = "doctor";
    UserRole["NURSE"] = "nurse";
    UserRole["PATIENT"] = "patient";
    UserRole["RECEPTIONIST"] = "receptionist";
    UserRole["PHARMACIST"] = "pharmacist";
    UserRole["LAB_TECHNICIAN"] = "lab_technician";
    UserRole["BILLING_STAFF"] = "billing_staff";
    UserRole["AUDITOR"] = "auditor";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Permission enumeration for fine-grained access control
 */
var Permission;
(function (Permission) {
    // Patient data permissions
    Permission["PATIENT_READ"] = "patient:read";
    Permission["PATIENT_WRITE"] = "patient:write";
    Permission["PATIENT_DELETE"] = "patient:delete";
    Permission["PATIENT_PHI_READ"] = "patient:phi:read";
    Permission["PATIENT_PHI_WRITE"] = "patient:phi:write";
    // Medical record permissions
    Permission["MEDICAL_RECORD_READ"] = "medical_record:read";
    Permission["MEDICAL_RECORD_WRITE"] = "medical_record:write";
    Permission["MEDICAL_RECORD_DELETE"] = "medical_record:delete";
    // Prescription permissions
    Permission["PRESCRIPTION_READ"] = "prescription:read";
    Permission["PRESCRIPTION_WRITE"] = "prescription:write";
    Permission["PRESCRIPTION_APPROVE"] = "prescription:approve";
    // Administrative permissions
    Permission["USER_MANAGE"] = "user:manage";
    Permission["ROLE_MANAGE"] = "role:manage";
    Permission["AUDIT_VIEW"] = "audit:view";
    Permission["SYSTEM_CONFIGURE"] = "system:configure";
    // Emergency access
    Permission["EMERGENCY_ACCESS"] = "emergency:access";
})(Permission || (exports.Permission = Permission = {}));
/**
 * Data classification levels
 */
var DataClassification;
(function (DataClassification) {
    DataClassification["PUBLIC"] = "public";
    DataClassification["INTERNAL"] = "internal";
    DataClassification["CONFIDENTIAL"] = "confidential";
    DataClassification["PHI"] = "phi";
    DataClassification["PII"] = "pii";
    DataClassification["RESTRICTED"] = "restricted";
})(DataClassification || (exports.DataClassification = DataClassification = {}));
// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) FUNCTIONS
// ============================================================================
/**
 * 1. Check if user has specific role
 */
function hasRole(userRole, requiredRole) {
    const roleHierarchy = {
        [UserRole.SUPER_ADMIN]: 100,
        [UserRole.ADMIN]: 90,
        [UserRole.DOCTOR]: 80,
        [UserRole.NURSE]: 70,
        [UserRole.PHARMACIST]: 65,
        [UserRole.LAB_TECHNICIAN]: 60,
        [UserRole.RECEPTIONIST]: 50,
        [UserRole.BILLING_STAFF]: 45,
        [UserRole.PATIENT]: 30,
        [UserRole.AUDITOR]: 20,
        [UserRole.GUEST]: 10,
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
/**
 * 2. Check if user has any of the required roles
 */
function hasAnyRole(userRole, requiredRoles) {
    return requiredRoles.some(role => hasRole(userRole, role));
}
/**
 * 3. Get role permissions mapping
 */
function getRolePermissions(role) {
    const rolePermissionsMap = {
        [UserRole.SUPER_ADMIN]: Object.values(Permission),
        [UserRole.ADMIN]: [
            Permission.PATIENT_READ,
            Permission.PATIENT_WRITE,
            Permission.MEDICAL_RECORD_READ,
            Permission.MEDICAL_RECORD_WRITE,
            Permission.USER_MANAGE,
            Permission.AUDIT_VIEW,
        ],
        [UserRole.DOCTOR]: [
            Permission.PATIENT_READ,
            Permission.PATIENT_WRITE,
            Permission.PATIENT_PHI_READ,
            Permission.PATIENT_PHI_WRITE,
            Permission.MEDICAL_RECORD_READ,
            Permission.MEDICAL_RECORD_WRITE,
            Permission.PRESCRIPTION_READ,
            Permission.PRESCRIPTION_WRITE,
            Permission.PRESCRIPTION_APPROVE,
            Permission.EMERGENCY_ACCESS,
        ],
        [UserRole.NURSE]: [
            Permission.PATIENT_READ,
            Permission.PATIENT_PHI_READ,
            Permission.MEDICAL_RECORD_READ,
            Permission.MEDICAL_RECORD_WRITE,
            Permission.PRESCRIPTION_READ,
        ],
        [UserRole.PHARMACIST]: [
            Permission.PATIENT_READ,
            Permission.PRESCRIPTION_READ,
            Permission.PRESCRIPTION_WRITE,
        ],
        [UserRole.LAB_TECHNICIAN]: [
            Permission.PATIENT_READ,
            Permission.MEDICAL_RECORD_READ,
            Permission.MEDICAL_RECORD_WRITE,
        ],
        [UserRole.RECEPTIONIST]: [
            Permission.PATIENT_READ,
            Permission.PATIENT_WRITE,
        ],
        [UserRole.BILLING_STAFF]: [
            Permission.PATIENT_READ,
        ],
        [UserRole.PATIENT]: [],
        [UserRole.AUDITOR]: [
            Permission.AUDIT_VIEW,
        ],
        [UserRole.GUEST]: [],
    };
    return rolePermissionsMap[role] || [];
}
/**
 * 4. Check if user has specific permission
 */
function hasPermission(userRole, userPermissions, requiredPermission) {
    const rolePermissions = getRolePermissions(userRole);
    const allPermissions = [...rolePermissions, ...userPermissions];
    return allPermissions.includes(requiredPermission);
}
/**
 * 5. Check if user has all required permissions
 */
function hasAllPermissions(userRole, userPermissions, requiredPermissions) {
    return requiredPermissions.every(permission => hasPermission(userRole, userPermissions, permission));
}
// ============================================================================
// ACCESS CONTROL LIST (ACL) MANAGEMENT
// ============================================================================
/**
 * 6. Create access control entry
 */
function createAccessControlEntry(params) {
    return {
        id: generateSecureId(),
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        principalType: params.principalType,
        principalId: params.principalId,
        permissions: params.permissions,
        grantedBy: params.grantedBy,
        grantedAt: new Date(),
        expiresAt: params.expiresAt,
        conditions: params.conditions,
    };
}
/**
 * 7. Check ACL access
 */
function checkAclAccess(acl, principalId, principalType, requiredPermission) {
    const now = new Date();
    return acl.some(entry => {
        // Check if entry matches principal
        if (entry.principalId !== principalId || entry.principalType !== principalType) {
            return false;
        }
        // Check if entry has expired
        if (entry.expiresAt && entry.expiresAt < now) {
            return false;
        }
        // Check if permission is granted
        return entry.permissions.includes(requiredPermission);
    });
}
/**
 * 8. Evaluate access conditions
 */
function evaluateAccessConditions(conditions, context) {
    return conditions.every(condition => {
        const contextValue = context[condition.type];
        switch (condition.operator) {
            case 'equals':
                return contextValue === condition.value;
            case 'not_equals':
                return contextValue !== condition.value;
            case 'in':
                return Array.isArray(condition.value) && condition.value.includes(contextValue);
            case 'not_in':
                return Array.isArray(condition.value) && !condition.value.includes(contextValue);
            case 'before':
                return new Date(contextValue) < new Date(condition.value);
            case 'after':
                return new Date(contextValue) > new Date(condition.value);
            default:
                return false;
        }
    });
}
/**
 * 9. Filter ACL by resource
 */
function filterAclByResource(acl, resourceType, resourceId) {
    return acl.filter(entry => {
        if (entry.resourceType !== resourceType) {
            return false;
        }
        if (resourceId && entry.resourceId !== resourceId) {
            return false;
        }
        return true;
    });
}
/**
 * 10. Revoke ACL entry
 */
function revokeAclEntry(acl, entryId) {
    return acl.filter(entry => entry.id !== entryId);
}
// ============================================================================
// ENCRYPTION FUNCTIONS
// ============================================================================
/**
 * 11. Generate encryption key
 */
function generateEncryptionKey(length = 32, encoding = 'base64') {
    return crypto.randomBytes(length).toString(encoding);
}
/**
 * 12. Derive key from password
 */
function deriveKeyFromPassword(password, salt, keyLength = 32) {
    return crypto.scryptSync(password, salt, keyLength);
}
/**
 * 13. Encrypt data with AES-256-GCM
 */
function encryptData(plaintext, key, keyVersion = 'v1') {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(32);
    const derivedKey = deriveKeyFromPassword(key, salt.toString('hex'), 32);
    const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
        ciphertext,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm,
        keyVersion,
    };
}
/**
 * 14. Decrypt data with AES-256-GCM
 */
function decryptData(encryptedData, key) {
    const derivedKey = deriveKeyFromPassword(key, encryptedData.salt, 32);
    const decipher = crypto.createDecipheriv(encryptedData.algorithm, derivedKey, Buffer.from(encryptedData.iv, 'hex'));
    if (encryptedData.authTag) {
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    }
    let plaintext = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
}
/**
 * 15. Hash sensitive data (one-way)
 */
function hashSensitiveData(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
}
/**
 * 16. Encrypt field-level data
 */
function encryptFields(obj, fieldsToEncrypt, encryptionKey) {
    const result = { ...obj };
    fieldsToEncrypt.forEach(field => {
        if (result[field] !== undefined && result[field] !== null) {
            const encrypted = encryptData(typeof result[field] === 'string' ? result[field] : JSON.stringify(result[field]), encryptionKey);
            result[field] = JSON.stringify(encrypted);
        }
    });
    return result;
}
/**
 * 17. Decrypt field-level data
 */
function decryptFields(obj, fieldsToDecrypt, encryptionKey) {
    const result = { ...obj };
    fieldsToDecrypt.forEach(field => {
        if (result[field] !== undefined && result[field] !== null) {
            try {
                const encryptedData = JSON.parse(result[field]);
                const decrypted = decryptData(encryptedData, encryptionKey);
                // Try to parse as JSON, otherwise keep as string
                try {
                    result[field] = JSON.parse(decrypted);
                }
                catch {
                    result[field] = decrypted;
                }
            }
            catch (error) {
                console.error(`Failed to decrypt field ${field}:`, error);
            }
        }
    });
    return result;
}
/**
 * 18. Generate secure token
 */
function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('base64url');
}
// ============================================================================
// MULTI-TENANCY ISOLATION
// ============================================================================
/**
 * 19. Create tenant context
 */
function createTenantContext(params) {
    return {
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        isolationLevel: params.isolationLevel,
        encryptionKeys: new Map(),
        securityPolicies: params.securityPolicies || [],
        complianceLevel: params.complianceLevel,
    };
}
/**
 * 20. Validate tenant isolation
 */
function validateTenantIsolation(requestTenantId, resourceTenantId) {
    return requestTenantId === resourceTenantId;
}
/**
 * 21. Get tenant-specific encryption key
 */
function getTenantEncryptionKey(tenantContext, keyPurpose, masterKey) {
    const cacheKey = `${tenantContext.tenantId}:${keyPurpose}`;
    if (!tenantContext.encryptionKeys) {
        tenantContext.encryptionKeys = new Map();
    }
    if (!tenantContext.encryptionKeys.has(cacheKey)) {
        // Derive tenant-specific key from master key
        const derivedKey = crypto
            .createHmac('sha256', masterKey)
            .update(`${tenantContext.tenantId}:${keyPurpose}`)
            .digest('hex');
        tenantContext.encryptionKeys.set(cacheKey, derivedKey);
    }
    return tenantContext.encryptionKeys.get(cacheKey);
}
/**
 * 22. Filter data by tenant
 */
function filterByTenant(data, tenantId) {
    return data.filter(item => item.tenantId === tenantId);
}
/**
 * 23. Validate cross-tenant access
 */
function validateCrossTenantAccess(userTenantId, resourceTenantId, userRole) {
    // Only super admins can access cross-tenant resources
    if (userTenantId !== resourceTenantId) {
        return userRole === UserRole.SUPER_ADMIN;
    }
    return true;
}
// ============================================================================
// AUDIT LOGGING
// ============================================================================
/**
 * 24. Create audit log entry
 */
function createAuditLog(params) {
    return {
        id: generateSecureId(),
        timestamp: new Date(),
        userId: params.userId,
        userRole: params.userRole,
        tenantId: params.tenantId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        details: params.details,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        sessionId: params.sessionId,
        outcome: params.outcome,
        severity: params.severity || 'low',
        phiAccessed: params.phiAccessed || false,
        emergencyAccess: params.emergencyAccess || false,
    };
}
/**
 * 25. Filter audit logs by criteria
 */
function filterAuditLogs(logs, filters) {
    return logs.filter(log => {
        if (filters.userId && log.userId !== filters.userId)
            return false;
        if (filters.tenantId && log.tenantId !== filters.tenantId)
            return false;
        if (filters.action && log.action !== filters.action)
            return false;
        if (filters.resourceType && log.resourceType !== filters.resourceType)
            return false;
        if (filters.startDate && log.timestamp < filters.startDate)
            return false;
        if (filters.endDate && log.timestamp > filters.endDate)
            return false;
        if (filters.severity && log.severity !== filters.severity)
            return false;
        if (filters.phiAccessed !== undefined && log.phiAccessed !== filters.phiAccessed)
            return false;
        return true;
    });
}
/**
 * 26. Detect suspicious audit patterns
 */
function detectSuspiciousPatterns(logs) {
    const patterns = [];
    // Pattern 1: Multiple failed access attempts
    const failedAttempts = logs.filter(log => log.outcome === 'failure');
    if (failedAttempts.length >= 5) {
        patterns.push({
            pattern: 'Multiple failed access attempts detected',
            severity: 'high',
            logs: failedAttempts,
        });
    }
    // Pattern 2: Emergency access usage
    const emergencyAccess = logs.filter(log => log.emergencyAccess === true);
    if (emergencyAccess.length > 0) {
        patterns.push({
            pattern: 'Emergency access used',
            severity: 'critical',
            logs: emergencyAccess,
        });
    }
    // Pattern 3: Unusual PHI access volume
    const phiAccess = logs.filter(log => log.phiAccessed === true);
    if (phiAccess.length >= 50) {
        patterns.push({
            pattern: 'High volume of PHI access detected',
            severity: 'medium',
            logs: phiAccess,
        });
    }
    // Pattern 4: Access from multiple IPs in short time
    const ipMap = new Map();
    logs.forEach(log => {
        if (log.ipAddress) {
            if (!ipMap.has(log.userId || 'unknown')) {
                ipMap.set(log.userId || 'unknown', []);
            }
            ipMap.get(log.userId || 'unknown').push(log);
        }
    });
    ipMap.forEach((userLogs, userId) => {
        const uniqueIps = new Set(userLogs.map(l => l.ipAddress));
        if (uniqueIps.size >= 3) {
            patterns.push({
                pattern: `User ${userId} accessed from ${uniqueIps.size} different IPs`,
                severity: 'medium',
                logs: userLogs,
            });
        }
    });
    return patterns;
}
/**
 * 27. Generate compliance audit report
 */
function generateComplianceReport(logs, framework) {
    const sortedLogs = logs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const start = sortedLogs[0]?.timestamp || new Date();
    const end = sortedLogs[sortedLogs.length - 1]?.timestamp || new Date();
    const phiAccessEvents = logs.filter(log => log.phiAccessed === true).length;
    const securityIncidents = logs.filter(log => log.severity === 'high' || log.severity === 'critical').length;
    const findings = [];
    // HIPAA-specific checks
    if (framework === 'HIPAA') {
        const emergencyAccess = logs.filter(log => log.emergencyAccess === true);
        if (emergencyAccess.length > 0) {
            findings.push(`${emergencyAccess.length} emergency access events require review`);
        }
        const failedAccess = logs.filter(log => log.outcome === 'failure');
        if (failedAccess.length > logs.length * 0.1) {
            findings.push('High failure rate detected - review access controls');
        }
    }
    // Calculate compliance score (0-100)
    let score = 100;
    score -= securityIncidents * 5;
    score -= findings.length * 10;
    score = Math.max(0, Math.min(100, score));
    return {
        framework,
        period: { start, end },
        totalEvents: logs.length,
        phiAccessEvents,
        securityIncidents,
        complianceScore: score,
        findings,
    };
}
// ============================================================================
// SECURITY POLICY MANAGEMENT
// ============================================================================
/**
 * 28. Create security policy
 */
function createSecurityPolicy(params) {
    return {
        id: generateSecureId(),
        name: params.name,
        description: params.description,
        enabled: true,
        priority: params.priority || 100,
        rules: params.rules,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: params.createdBy,
    };
}
/**
 * 29. Evaluate security policy
 */
function evaluateSecurityPolicy(policy, context) {
    if (!policy.enabled) {
        return { matched: false, actions: [] };
    }
    for (const rule of policy.rules) {
        const conditionsMet = rule.conditions.every(condition => {
            const value = context[condition.field];
            switch (condition.operator) {
                case 'equals':
                    return value === condition.value;
                case 'not_equals':
                    return value !== condition.value;
                case 'contains':
                    return String(value).includes(String(condition.value));
                case 'matches':
                    return new RegExp(condition.value).test(String(value));
                case 'greater_than':
                    return value > condition.value;
                case 'less_than':
                    return value < condition.value;
                default:
                    return false;
            }
        });
        if (conditionsMet) {
            return {
                matched: true,
                rule,
                actions: rule.actions,
            };
        }
    }
    return { matched: false, actions: [] };
}
/**
 * 30. Apply security policies
 */
function applySecurityPolicies(policies, context) {
    const sortedPolicies = policies
        .filter(p => p.enabled)
        .sort((a, b) => b.priority - a.priority);
    const appliedPolicies = [];
    const actions = [];
    let allowed = true;
    for (const policy of sortedPolicies) {
        const result = evaluateSecurityPolicy(policy, context);
        if (result.matched && result.rule) {
            appliedPolicies.push(policy);
            actions.push(...result.actions);
            if (result.rule.type === 'deny') {
                allowed = false;
                break; // Deny takes precedence
            }
        }
    }
    return { allowed, appliedPolicies, actions };
}
// ============================================================================
// PASSWORD SECURITY
// ============================================================================
/**
 * 31. Validate password strength
 */
function validatePasswordStrength(password, policy) {
    const errors = [];
    let score = 0;
    // Length check
    if (password.length < policy.minLength) {
        errors.push(`Password must be at least ${policy.minLength} characters`);
    }
    else if (password.length >= policy.minLength) {
        score += 20;
    }
    if (password.length > policy.maxLength) {
        errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }
    // Uppercase check
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    else if (/[A-Z]/.test(password)) {
        score += 20;
    }
    // Lowercase check
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    else if (/[a-z]/.test(password)) {
        score += 20;
    }
    // Number check
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    else if (/[0-9]/.test(password)) {
        score += 20;
    }
    // Special character check
    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 20;
    }
    // Common passwords check
    if (policy.preventCommonPasswords) {
        const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
        if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
            errors.push('Password is too common');
            score -= 30;
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        score: Math.max(0, Math.min(100, score)),
    };
}
/**
 * 32. Hash password with salt
 */
async function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
        .toString('hex');
    return {
        hash,
        salt,
        algorithm: 'pbkdf2-sha512',
    };
}
/**
 * 33. Verify password
 */
async function verifyPassword(password, hash, salt) {
    const verifyHash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
        .toString('hex');
    return hash === verifyHash;
}
// ============================================================================
// SESSION SECURITY
// ============================================================================
/**
 * 34. Create secure session
 */
function createSecureSession(params) {
    const now = new Date();
    const duration = params.duration || 3600000; // 1 hour default
    return {
        sessionId: generateSecureToken(32),
        userId: params.userId,
        tenantId: params.tenantId,
        createdAt: now,
        expiresAt: new Date(now.getTime() + duration),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        mfaVerified: params.mfaVerified,
        securityLevel: params.mfaVerified ? 'high' : 'medium',
        lastActivity: now,
    };
}
/**
 * 35. Validate session
 */
function validateSession(session, currentIp, currentUserAgent) {
    const now = new Date();
    // Check expiration
    if (session.expiresAt < now) {
        return { valid: false, reason: 'Session expired' };
    }
    // Check IP address (optional - can be configured)
    // Commented out as IP can change legitimately
    // if (session.ipAddress !== currentIp) {
    //   return { valid: false, reason: 'IP address mismatch' };
    // }
    // Check user agent
    if (session.userAgent !== currentUserAgent) {
        return { valid: false, reason: 'User agent mismatch' };
    }
    // Check idle timeout (30 minutes)
    const idleTimeout = 30 * 60 * 1000;
    if (now.getTime() - session.lastActivity.getTime() > idleTimeout) {
        return { valid: false, reason: 'Session idle timeout' };
    }
    return { valid: true };
}
/**
 * 36. Refresh session activity
 */
function refreshSessionActivity(session) {
    return {
        ...session,
        lastActivity: new Date(),
    };
}
// ============================================================================
// SECURITY SCANNING
// ============================================================================
/**
 * 37. Scan for security vulnerabilities
 */
function scanForVulnerabilities(dependencies) {
    const findings = [];
    // Example vulnerability checks
    dependencies.forEach(dep => {
        // Check for known vulnerable versions (simplified example)
        if (dep.name === 'lodash' && dep.version < '4.17.21') {
            findings.push({
                id: generateSecureId(),
                severity: 'high',
                category: 'dependency',
                title: 'Vulnerable lodash version',
                description: `lodash ${dep.version} has known security vulnerabilities`,
                affectedResources: [dep.name],
                remediation: 'Update to lodash 4.17.21 or higher',
                cveId: 'CVE-2021-23337',
                cvssScore: 7.4,
            });
        }
    });
    const score = Math.max(0, 100 - (findings.length * 10));
    return {
        scanId: generateSecureId(),
        timestamp: new Date(),
        scanType: 'vulnerability',
        status: findings.length === 0 ? 'passed' : 'failed',
        findings,
        score,
        recommendations: findings.map(f => f.remediation),
    };
}
/**
 * 38. Scan configuration for security issues
 */
function scanConfiguration(config) {
    const findings = [];
    // Check for exposed secrets
    const sensitiveKeys = ['password', 'secret', 'key', 'token', 'apikey'];
    Object.keys(config).forEach(key => {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            const value = String(config[key]);
            if (value && value.length < 20) {
                findings.push({
                    id: generateSecureId(),
                    severity: 'critical',
                    category: 'configuration',
                    title: 'Potentially weak secret detected',
                    description: `Configuration key '${key}' may contain a weak secret`,
                    affectedResources: [key],
                    remediation: 'Use strong, randomly generated secrets and store in secure vault',
                });
            }
        }
    });
    // Check for debug mode
    if (config.debug === true || config.DEBUG === 'true') {
        findings.push({
            id: generateSecureId(),
            severity: 'medium',
            category: 'configuration',
            title: 'Debug mode enabled',
            description: 'Debug mode should not be enabled in production',
            affectedResources: ['debug'],
            remediation: 'Disable debug mode in production environments',
        });
    }
    const score = Math.max(0, 100 - (findings.length * 15));
    return {
        scanId: generateSecureId(),
        timestamp: new Date(),
        scanType: 'configuration',
        status: findings.length === 0 ? 'passed' : 'failed',
        findings,
        score,
        recommendations: findings.map(f => f.remediation),
    };
}
/**
 * 39. Validate HIPAA compliance
 */
function validateHipaaCompliance(params) {
    const findings = [];
    if (!params.encryptionEnabled) {
        findings.push({
            id: generateSecureId(),
            severity: 'critical',
            category: 'compliance',
            title: 'Encryption not enabled',
            description: 'HIPAA requires encryption of PHI at rest and in transit',
            affectedResources: ['encryption'],
            remediation: 'Enable encryption for all PHI data',
        });
    }
    if (!params.auditLoggingEnabled) {
        findings.push({
            id: generateSecureId(),
            severity: 'critical',
            category: 'compliance',
            title: 'Audit logging not enabled',
            description: 'HIPAA requires comprehensive audit logging',
            affectedResources: ['audit'],
            remediation: 'Enable audit logging for all PHI access',
        });
    }
    if (!params.accessControlsEnabled) {
        findings.push({
            id: generateSecureId(),
            severity: 'critical',
            category: 'compliance',
            title: 'Access controls not properly configured',
            description: 'HIPAA requires strict access controls',
            affectedResources: ['access_control'],
            remediation: 'Implement role-based access control',
        });
    }
    if (!params.backupEnabled) {
        findings.push({
            id: generateSecureId(),
            severity: 'high',
            category: 'compliance',
            title: 'Backup not enabled',
            description: 'HIPAA requires regular backups',
            affectedResources: ['backup'],
            remediation: 'Enable automated backups',
        });
    }
    if (!params.mfaEnabled) {
        findings.push({
            id: generateSecureId(),
            severity: 'high',
            category: 'compliance',
            title: 'MFA not enabled',
            description: 'Multi-factor authentication recommended for HIPAA',
            affectedResources: ['mfa'],
            remediation: 'Enable MFA for all users',
        });
    }
    const score = Math.max(0, 100 - (findings.length * 20));
    return {
        scanId: generateSecureId(),
        timestamp: new Date(),
        scanType: 'compliance',
        status: findings.length === 0 ? 'passed' : 'failed',
        findings,
        score,
        recommendations: findings.map(f => f.remediation),
    };
}
// ============================================================================
// DATA CLASSIFICATION & PROTECTION
// ============================================================================
/**
 * 40. Classify data sensitivity
 */
function classifyDataSensitivity(data) {
    const phiFields = [
        'ssn', 'medical_record_number', 'diagnosis', 'prescription',
        'lab_result', 'treatment', 'insurance_id', 'patient_id'
    ];
    const piiFields = [
        'email', 'phone', 'address', 'date_of_birth', 'name',
        'drivers_license', 'passport'
    ];
    const dataKeys = Object.keys(data).map(k => k.toLowerCase());
    // Check for PHI
    if (phiFields.some(field => dataKeys.includes(field))) {
        return DataClassification.PHI;
    }
    // Check for PII
    if (piiFields.some(field => dataKeys.includes(field))) {
        return DataClassification.PII;
    }
    // Check for confidential indicators
    if (dataKeys.includes('confidential') || dataKeys.includes('internal')) {
        return DataClassification.CONFIDENTIAL;
    }
    return DataClassification.PUBLIC;
}
/**
 * 41. Mask sensitive data for display
 */
function maskSensitiveData(value, maskChar = '*', visibleChars = 4) {
    if (!value || value.length <= visibleChars) {
        return maskChar.repeat(4);
    }
    const masked = maskChar.repeat(Math.max(0, value.length - visibleChars));
    const visible = value.slice(-visibleChars);
    return masked + visible;
}
/**
 * 42. Sanitize data for logging
 */
function sanitizeForLogging(data, sensitiveFields = [
    'password', 'token', 'secret', 'ssn', 'credit_card',
    'api_key', 'private_key', 'auth_token'
]) {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
            sanitized[key] = '[REDACTED]';
        }
        else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeForLogging(sanitized[key], sensitiveFields);
        }
    });
    return sanitized;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generate secure unique identifier
 */
function generateSecureId() {
    return `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // RBAC
    hasRole,
    hasAnyRole,
    getRolePermissions,
    hasPermission,
    hasAllPermissions,
    // ACL
    createAccessControlEntry,
    checkAclAccess,
    evaluateAccessConditions,
    filterAclByResource,
    revokeAclEntry,
    // Encryption
    generateEncryptionKey,
    deriveKeyFromPassword,
    encryptData,
    decryptData,
    hashSensitiveData,
    encryptFields,
    decryptFields,
    generateSecureToken,
    // Multi-tenancy
    createTenantContext,
    validateTenantIsolation,
    getTenantEncryptionKey,
    filterByTenant,
    validateCrossTenantAccess,
    // Audit
    createAuditLog,
    filterAuditLogs,
    detectSuspiciousPatterns,
    generateComplianceReport,
    // Security Policy
    createSecurityPolicy,
    evaluateSecurityPolicy,
    applySecurityPolicies,
    // Password
    validatePasswordStrength,
    hashPassword,
    verifyPassword,
    // Session
    createSecureSession,
    validateSession,
    refreshSessionActivity,
    // Security Scanning
    scanForVulnerabilities,
    scanConfiguration,
    validateHipaaCompliance,
    // Data Protection
    classifyDataSensitivity,
    maskSensitiveData,
    sanitizeForLogging,
};
//# sourceMappingURL=san-security-access-kit.js.map