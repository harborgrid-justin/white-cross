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
/**
 * User role enumeration for RBAC
 */
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    PATIENT = "patient",
    RECEPTIONIST = "receptionist",
    PHARMACIST = "pharmacist",
    LAB_TECHNICIAN = "lab_technician",
    BILLING_STAFF = "billing_staff",
    AUDITOR = "auditor",
    GUEST = "guest"
}
/**
 * Permission enumeration for fine-grained access control
 */
export declare enum Permission {
    PATIENT_READ = "patient:read",
    PATIENT_WRITE = "patient:write",
    PATIENT_DELETE = "patient:delete",
    PATIENT_PHI_READ = "patient:phi:read",
    PATIENT_PHI_WRITE = "patient:phi:write",
    MEDICAL_RECORD_READ = "medical_record:read",
    MEDICAL_RECORD_WRITE = "medical_record:write",
    MEDICAL_RECORD_DELETE = "medical_record:delete",
    PRESCRIPTION_READ = "prescription:read",
    PRESCRIPTION_WRITE = "prescription:write",
    PRESCRIPTION_APPROVE = "prescription:approve",
    USER_MANAGE = "user:manage",
    ROLE_MANAGE = "role:manage",
    AUDIT_VIEW = "audit:view",
    SYSTEM_CONFIGURE = "system:configure",
    EMERGENCY_ACCESS = "emergency:access"
}
/**
 * Access control entry for ACL management
 */
export interface AccessControlEntry {
    id: string;
    resourceType: string;
    resourceId: string;
    principalType: 'user' | 'role' | 'group';
    principalId: string;
    permissions: Permission[];
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    conditions?: AccessCondition[];
}
/**
 * Access condition for conditional access control
 */
export interface AccessCondition {
    type: 'time' | 'ip' | 'location' | 'device' | 'mfa' | 'consent';
    operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'before' | 'after';
    value: any;
}
/**
 * Security policy definition
 */
export interface SecurityPolicy {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    priority: number;
    rules: SecurityRule[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Security rule within a policy
 */
export interface SecurityRule {
    id: string;
    type: 'allow' | 'deny';
    conditions: RuleCondition[];
    actions: SecurityAction[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Rule condition for security policies
 */
export interface RuleCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'matches' | 'greater_than' | 'less_than';
    value: any;
}
/**
 * Security action to take when rule matches
 */
export interface SecurityAction {
    type: 'block' | 'alert' | 'log' | 'quarantine' | 'notify';
    target?: string;
    metadata?: Record<string, any>;
}
/**
 * Encryption configuration
 */
export interface EncryptionConfig {
    algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
    keyDerivation: 'scrypt' | 'pbkdf2' | 'argon2';
    keyLength: number;
    ivLength: number;
    saltLength: number;
    tagLength?: number;
}
/**
 * Encrypted data structure
 */
export interface EncryptedData {
    ciphertext: string;
    iv: string;
    salt: string;
    authTag?: string;
    algorithm: string;
    keyVersion: string;
}
/**
 * Audit log entry for compliance tracking
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    userId?: string;
    userRole?: UserRole;
    tenantId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    outcome: 'success' | 'failure' | 'blocked';
    severity: 'low' | 'medium' | 'high' | 'critical';
    phiAccessed?: boolean;
    emergencyAccess?: boolean;
}
/**
 * Multi-tenancy context
 */
export interface TenantContext {
    tenantId: string;
    tenantName: string;
    isolationLevel: 'shared' | 'dedicated' | 'hybrid';
    encryptionKeys?: Map<string, string>;
    securityPolicies: string[];
    complianceLevel: 'basic' | 'hipaa' | 'gdpr' | 'pci_dss';
}
/**
 * Security scan result
 */
export interface SecurityScanResult {
    scanId: string;
    timestamp: Date;
    scanType: 'vulnerability' | 'compliance' | 'configuration' | 'penetration';
    status: 'passed' | 'failed' | 'warning';
    findings: SecurityFinding[];
    score: number;
    recommendations: string[];
}
/**
 * Security finding from scans
 */
export interface SecurityFinding {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    title: string;
    description: string;
    affectedResources: string[];
    remediation: string;
    cveId?: string;
    cvssScore?: number;
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
    preventCommonPasswords: boolean;
    preventUserInfo: boolean;
    expiryDays?: number;
    historyCount?: number;
    maxAttempts: number;
    lockoutDuration: number;
}
/**
 * Session security configuration
 */
export interface SessionSecurity {
    sessionId: string;
    userId: string;
    tenantId: string;
    createdAt: Date;
    expiresAt: Date;
    ipAddress: string;
    userAgent: string;
    mfaVerified: boolean;
    securityLevel: 'low' | 'medium' | 'high';
    lastActivity: Date;
}
/**
 * Data classification levels
 */
export declare enum DataClassification {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    PHI = "phi",// Protected Health Information
    PII = "pii",// Personally Identifiable Information
    RESTRICTED = "restricted"
}
/**
 * Compliance framework
 */
export interface ComplianceFramework {
    name: 'HIPAA' | 'GDPR' | 'PCI_DSS' | 'SOC2' | 'ISO27001';
    requirements: ComplianceRequirement[];
    auditFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
}
/**
 * Compliance requirement
 */
export interface ComplianceRequirement {
    id: string;
    name: string;
    description: string;
    controls: string[];
    validated: boolean;
    lastCheck?: Date;
}
/**
 * 1. Check if user has specific role
 */
export declare function hasRole(userRole: UserRole, requiredRole: UserRole): boolean;
/**
 * 2. Check if user has any of the required roles
 */
export declare function hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean;
/**
 * 3. Get role permissions mapping
 */
export declare function getRolePermissions(role: UserRole): Permission[];
/**
 * 4. Check if user has specific permission
 */
export declare function hasPermission(userRole: UserRole, userPermissions: Permission[], requiredPermission: Permission): boolean;
/**
 * 5. Check if user has all required permissions
 */
export declare function hasAllPermissions(userRole: UserRole, userPermissions: Permission[], requiredPermissions: Permission[]): boolean;
/**
 * 6. Create access control entry
 */
export declare function createAccessControlEntry(params: {
    resourceType: string;
    resourceId: string;
    principalType: 'user' | 'role' | 'group';
    principalId: string;
    permissions: Permission[];
    grantedBy: string;
    expiresAt?: Date;
    conditions?: AccessCondition[];
}): AccessControlEntry;
/**
 * 7. Check ACL access
 */
export declare function checkAclAccess(acl: AccessControlEntry[], principalId: string, principalType: 'user' | 'role' | 'group', requiredPermission: Permission): boolean;
/**
 * 8. Evaluate access conditions
 */
export declare function evaluateAccessConditions(conditions: AccessCondition[], context: Record<string, any>): boolean;
/**
 * 9. Filter ACL by resource
 */
export declare function filterAclByResource(acl: AccessControlEntry[], resourceType: string, resourceId?: string): AccessControlEntry[];
/**
 * 10. Revoke ACL entry
 */
export declare function revokeAclEntry(acl: AccessControlEntry[], entryId: string): AccessControlEntry[];
/**
 * 11. Generate encryption key
 */
export declare function generateEncryptionKey(length?: number, encoding?: BufferEncoding): string;
/**
 * 12. Derive key from password
 */
export declare function deriveKeyFromPassword(password: string, salt: string, keyLength?: number): Buffer;
/**
 * 13. Encrypt data with AES-256-GCM
 */
export declare function encryptData(plaintext: string, key: string, keyVersion?: string): EncryptedData;
/**
 * 14. Decrypt data with AES-256-GCM
 */
export declare function decryptData(encryptedData: EncryptedData, key: string): string;
/**
 * 15. Hash sensitive data (one-way)
 */
export declare function hashSensitiveData(data: string, algorithm?: string): string;
/**
 * 16. Encrypt field-level data
 */
export declare function encryptFields<T extends Record<string, any>>(obj: T, fieldsToEncrypt: string[], encryptionKey: string): T;
/**
 * 17. Decrypt field-level data
 */
export declare function decryptFields<T extends Record<string, any>>(obj: T, fieldsToDecrypt: string[], encryptionKey: string): T;
/**
 * 18. Generate secure token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * 19. Create tenant context
 */
export declare function createTenantContext(params: {
    tenantId: string;
    tenantName: string;
    isolationLevel: 'shared' | 'dedicated' | 'hybrid';
    complianceLevel: 'basic' | 'hipaa' | 'gdpr' | 'pci_dss';
    securityPolicies?: string[];
}): TenantContext;
/**
 * 20. Validate tenant isolation
 */
export declare function validateTenantIsolation(requestTenantId: string, resourceTenantId: string): boolean;
/**
 * 21. Get tenant-specific encryption key
 */
export declare function getTenantEncryptionKey(tenantContext: TenantContext, keyPurpose: string, masterKey: string): string;
/**
 * 22. Filter data by tenant
 */
export declare function filterByTenant<T extends {
    tenantId: string;
}>(data: T[], tenantId: string): T[];
/**
 * 23. Validate cross-tenant access
 */
export declare function validateCrossTenantAccess(userTenantId: string, resourceTenantId: string, userRole: UserRole): boolean;
/**
 * 24. Create audit log entry
 */
export declare function createAuditLog(params: {
    userId?: string;
    userRole?: UserRole;
    tenantId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    outcome: 'success' | 'failure' | 'blocked';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    phiAccessed?: boolean;
    emergencyAccess?: boolean;
}): AuditLogEntry;
/**
 * 25. Filter audit logs by criteria
 */
export declare function filterAuditLogs(logs: AuditLogEntry[], filters: {
    userId?: string;
    tenantId?: string;
    action?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
    phiAccessed?: boolean;
}): AuditLogEntry[];
/**
 * 26. Detect suspicious audit patterns
 */
export declare function detectSuspiciousPatterns(logs: AuditLogEntry[]): {
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    logs: AuditLogEntry[];
}[];
/**
 * 27. Generate compliance audit report
 */
export declare function generateComplianceReport(logs: AuditLogEntry[], framework: 'HIPAA' | 'GDPR' | 'SOC2'): {
    framework: string;
    period: {
        start: Date;
        end: Date;
    };
    totalEvents: number;
    phiAccessEvents: number;
    securityIncidents: number;
    complianceScore: number;
    findings: string[];
};
/**
 * 28. Create security policy
 */
export declare function createSecurityPolicy(params: {
    name: string;
    description: string;
    rules: SecurityRule[];
    priority?: number;
    createdBy: string;
}): SecurityPolicy;
/**
 * 29. Evaluate security policy
 */
export declare function evaluateSecurityPolicy(policy: SecurityPolicy, context: Record<string, any>): {
    matched: boolean;
    rule?: SecurityRule;
    actions: SecurityAction[];
};
/**
 * 30. Apply security policies
 */
export declare function applySecurityPolicies(policies: SecurityPolicy[], context: Record<string, any>): {
    allowed: boolean;
    appliedPolicies: SecurityPolicy[];
    actions: SecurityAction[];
};
/**
 * 31. Validate password strength
 */
export declare function validatePasswordStrength(password: string, policy: PasswordPolicy): {
    valid: boolean;
    errors: string[];
    score: number;
};
/**
 * 32. Hash password with salt
 */
export declare function hashPassword(password: string): Promise<{
    hash: string;
    salt: string;
    algorithm: string;
}>;
/**
 * 33. Verify password
 */
export declare function verifyPassword(password: string, hash: string, salt: string): Promise<boolean>;
/**
 * 34. Create secure session
 */
export declare function createSecureSession(params: {
    userId: string;
    tenantId: string;
    ipAddress: string;
    userAgent: string;
    mfaVerified: boolean;
    duration?: number;
}): SessionSecurity;
/**
 * 35. Validate session
 */
export declare function validateSession(session: SessionSecurity, currentIp: string, currentUserAgent: string): {
    valid: boolean;
    reason?: string;
};
/**
 * 36. Refresh session activity
 */
export declare function refreshSessionActivity(session: SessionSecurity): SessionSecurity;
/**
 * 37. Scan for security vulnerabilities
 */
export declare function scanForVulnerabilities(dependencies: {
    name: string;
    version: string;
}[]): SecurityScanResult;
/**
 * 38. Scan configuration for security issues
 */
export declare function scanConfiguration(config: Record<string, any>): SecurityScanResult;
/**
 * 39. Validate HIPAA compliance
 */
export declare function validateHipaaCompliance(params: {
    encryptionEnabled: boolean;
    auditLoggingEnabled: boolean;
    accessControlsEnabled: boolean;
    backupEnabled: boolean;
    mfaEnabled: boolean;
}): SecurityScanResult;
/**
 * 40. Classify data sensitivity
 */
export declare function classifyDataSensitivity(data: Record<string, any>): DataClassification;
/**
 * 41. Mask sensitive data for display
 */
export declare function maskSensitiveData(value: string, maskChar?: string, visibleChars?: number): string;
/**
 * 42. Sanitize data for logging
 */
export declare function sanitizeForLogging<T extends Record<string, any>>(data: T, sensitiveFields?: string[]): T;
declare const _default: {
    hasRole: typeof hasRole;
    hasAnyRole: typeof hasAnyRole;
    getRolePermissions: typeof getRolePermissions;
    hasPermission: typeof hasPermission;
    hasAllPermissions: typeof hasAllPermissions;
    createAccessControlEntry: typeof createAccessControlEntry;
    checkAclAccess: typeof checkAclAccess;
    evaluateAccessConditions: typeof evaluateAccessConditions;
    filterAclByResource: typeof filterAclByResource;
    revokeAclEntry: typeof revokeAclEntry;
    generateEncryptionKey: typeof generateEncryptionKey;
    deriveKeyFromPassword: typeof deriveKeyFromPassword;
    encryptData: typeof encryptData;
    decryptData: typeof decryptData;
    hashSensitiveData: typeof hashSensitiveData;
    encryptFields: typeof encryptFields;
    decryptFields: typeof decryptFields;
    generateSecureToken: typeof generateSecureToken;
    createTenantContext: typeof createTenantContext;
    validateTenantIsolation: typeof validateTenantIsolation;
    getTenantEncryptionKey: typeof getTenantEncryptionKey;
    filterByTenant: typeof filterByTenant;
    validateCrossTenantAccess: typeof validateCrossTenantAccess;
    createAuditLog: typeof createAuditLog;
    filterAuditLogs: typeof filterAuditLogs;
    detectSuspiciousPatterns: typeof detectSuspiciousPatterns;
    generateComplianceReport: typeof generateComplianceReport;
    createSecurityPolicy: typeof createSecurityPolicy;
    evaluateSecurityPolicy: typeof evaluateSecurityPolicy;
    applySecurityPolicies: typeof applySecurityPolicies;
    validatePasswordStrength: typeof validatePasswordStrength;
    hashPassword: typeof hashPassword;
    verifyPassword: typeof verifyPassword;
    createSecureSession: typeof createSecureSession;
    validateSession: typeof validateSession;
    refreshSessionActivity: typeof refreshSessionActivity;
    scanForVulnerabilities: typeof scanForVulnerabilities;
    scanConfiguration: typeof scanConfiguration;
    validateHipaaCompliance: typeof validateHipaaCompliance;
    classifyDataSensitivity: typeof classifyDataSensitivity;
    maskSensitiveData: typeof maskSensitiveData;
    sanitizeForLogging: typeof sanitizeForLogging;
};
export default _default;
//# sourceMappingURL=san-security-access-kit.d.ts.map