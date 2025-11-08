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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User role enumeration for RBAC
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  RECEPTIONIST = 'receptionist',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  BILLING_STAFF = 'billing_staff',
  AUDITOR = 'auditor',
  GUEST = 'guest',
}

/**
 * Permission enumeration for fine-grained access control
 */
export enum Permission {
  // Patient data permissions
  PATIENT_READ = 'patient:read',
  PATIENT_WRITE = 'patient:write',
  PATIENT_DELETE = 'patient:delete',
  PATIENT_PHI_READ = 'patient:phi:read',
  PATIENT_PHI_WRITE = 'patient:phi:write',

  // Medical record permissions
  MEDICAL_RECORD_READ = 'medical_record:read',
  MEDICAL_RECORD_WRITE = 'medical_record:write',
  MEDICAL_RECORD_DELETE = 'medical_record:delete',

  // Prescription permissions
  PRESCRIPTION_READ = 'prescription:read',
  PRESCRIPTION_WRITE = 'prescription:write',
  PRESCRIPTION_APPROVE = 'prescription:approve',

  // Administrative permissions
  USER_MANAGE = 'user:manage',
  ROLE_MANAGE = 'role:manage',
  AUDIT_VIEW = 'audit:view',
  SYSTEM_CONFIGURE = 'system:configure',

  // Emergency access
  EMERGENCY_ACCESS = 'emergency:access',
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
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  PHI = 'phi', // Protected Health Information
  PII = 'pii', // Personally Identifiable Information
  RESTRICTED = 'restricted',
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

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) FUNCTIONS
// ============================================================================

/**
 * 1. Check if user has specific role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
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
export function hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * 3. Get role permissions mapping
 */
export function getRolePermissions(role: UserRole): Permission[] {
  const rolePermissionsMap: Record<UserRole, Permission[]> = {
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
export function hasPermission(
  userRole: UserRole,
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  const rolePermissions = getRolePermissions(userRole);
  const allPermissions = [...rolePermissions, ...userPermissions];
  return allPermissions.includes(requiredPermission);
}

/**
 * 5. Check if user has all required permissions
 */
export function hasAllPermissions(
  userRole: UserRole,
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(permission =>
    hasPermission(userRole, userPermissions, permission)
  );
}

// ============================================================================
// ACCESS CONTROL LIST (ACL) MANAGEMENT
// ============================================================================

/**
 * 6. Create access control entry
 */
export function createAccessControlEntry(params: {
  resourceType: string;
  resourceId: string;
  principalType: 'user' | 'role' | 'group';
  principalId: string;
  permissions: Permission[];
  grantedBy: string;
  expiresAt?: Date;
  conditions?: AccessCondition[];
}): AccessControlEntry {
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
export function checkAclAccess(
  acl: AccessControlEntry[],
  principalId: string,
  principalType: 'user' | 'role' | 'group',
  requiredPermission: Permission
): boolean {
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
export function evaluateAccessConditions(
  conditions: AccessCondition[],
  context: Record<string, any>
): boolean {
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
export function filterAclByResource(
  acl: AccessControlEntry[],
  resourceType: string,
  resourceId?: string
): AccessControlEntry[] {
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
export function revokeAclEntry(
  acl: AccessControlEntry[],
  entryId: string
): AccessControlEntry[] {
  return acl.filter(entry => entry.id !== entryId);
}

// ============================================================================
// ENCRYPTION FUNCTIONS
// ============================================================================

/**
 * 11. Generate encryption key
 */
export function generateEncryptionKey(
  length: number = 32,
  encoding: BufferEncoding = 'base64'
): string {
  return crypto.randomBytes(length).toString(encoding);
}

/**
 * 12. Derive key from password
 */
export function deriveKeyFromPassword(
  password: string,
  salt: string,
  keyLength: number = 32
): Buffer {
  return crypto.scryptSync(password, salt, keyLength);
}

/**
 * 13. Encrypt data with AES-256-GCM
 */
export function encryptData(
  plaintext: string,
  key: string,
  keyVersion: string = 'v1'
): EncryptedData {
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
export function decryptData(encryptedData: EncryptedData, key: string): string {
  const derivedKey = deriveKeyFromPassword(
    key,
    encryptedData.salt,
    32
  );

  const decipher = crypto.createDecipheriv(
    encryptedData.algorithm as crypto.CipherGCMTypes,
    derivedKey,
    Buffer.from(encryptedData.iv, 'hex')
  );

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
export function hashSensitiveData(
  data: string,
  algorithm: string = 'sha256'
): string {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

/**
 * 16. Encrypt field-level data
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fieldsToEncrypt: string[],
  encryptionKey: string
): T {
  const result = { ...obj };

  fieldsToEncrypt.forEach(field => {
    if (result[field] !== undefined && result[field] !== null) {
      const encrypted = encryptData(
        typeof result[field] === 'string' ? result[field] : JSON.stringify(result[field]),
        encryptionKey
      );
      result[field] = JSON.stringify(encrypted) as any;
    }
  });

  return result;
}

/**
 * 17. Decrypt field-level data
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fieldsToDecrypt: string[],
  encryptionKey: string
): T {
  const result = { ...obj };

  fieldsToDecrypt.forEach(field => {
    if (result[field] !== undefined && result[field] !== null) {
      try {
        const encryptedData: EncryptedData = JSON.parse(result[field] as string);
        const decrypted = decryptData(encryptedData, encryptionKey);

        // Try to parse as JSON, otherwise keep as string
        try {
          result[field] = JSON.parse(decrypted);
        } catch {
          result[field] = decrypted as any;
        }
      } catch (error) {
        console.error(`Failed to decrypt field ${field}:`, error);
      }
    }
  });

  return result;
}

/**
 * 18. Generate secure token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

// ============================================================================
// MULTI-TENANCY ISOLATION
// ============================================================================

/**
 * 19. Create tenant context
 */
export function createTenantContext(params: {
  tenantId: string;
  tenantName: string;
  isolationLevel: 'shared' | 'dedicated' | 'hybrid';
  complianceLevel: 'basic' | 'hipaa' | 'gdpr' | 'pci_dss';
  securityPolicies?: string[];
}): TenantContext {
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
export function validateTenantIsolation(
  requestTenantId: string,
  resourceTenantId: string
): boolean {
  return requestTenantId === resourceTenantId;
}

/**
 * 21. Get tenant-specific encryption key
 */
export function getTenantEncryptionKey(
  tenantContext: TenantContext,
  keyPurpose: string,
  masterKey: string
): string {
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

  return tenantContext.encryptionKeys.get(cacheKey)!;
}

/**
 * 22. Filter data by tenant
 */
export function filterByTenant<T extends { tenantId: string }>(
  data: T[],
  tenantId: string
): T[] {
  return data.filter(item => item.tenantId === tenantId);
}

/**
 * 23. Validate cross-tenant access
 */
export function validateCrossTenantAccess(
  userTenantId: string,
  resourceTenantId: string,
  userRole: UserRole
): boolean {
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
export function createAuditLog(params: {
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
}): AuditLogEntry {
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
export function filterAuditLogs(
  logs: AuditLogEntry[],
  filters: {
    userId?: string;
    tenantId?: string;
    action?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
    phiAccessed?: boolean;
  }
): AuditLogEntry[] {
  return logs.filter(log => {
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.tenantId && log.tenantId !== filters.tenantId) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.resourceType && log.resourceType !== filters.resourceType) return false;
    if (filters.startDate && log.timestamp < filters.startDate) return false;
    if (filters.endDate && log.timestamp > filters.endDate) return false;
    if (filters.severity && log.severity !== filters.severity) return false;
    if (filters.phiAccessed !== undefined && log.phiAccessed !== filters.phiAccessed) return false;
    return true;
  });
}

/**
 * 26. Detect suspicious audit patterns
 */
export function detectSuspiciousPatterns(logs: AuditLogEntry[]): {
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  logs: AuditLogEntry[];
}[] {
  const patterns: {
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    logs: AuditLogEntry[];
  }[] = [];

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
  const ipMap = new Map<string, AuditLogEntry[]>();
  logs.forEach(log => {
    if (log.ipAddress) {
      if (!ipMap.has(log.userId || 'unknown')) {
        ipMap.set(log.userId || 'unknown', []);
      }
      ipMap.get(log.userId || 'unknown')!.push(log);
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
export function generateComplianceReport(
  logs: AuditLogEntry[],
  framework: 'HIPAA' | 'GDPR' | 'SOC2'
): {
  framework: string;
  period: { start: Date; end: Date };
  totalEvents: number;
  phiAccessEvents: number;
  securityIncidents: number;
  complianceScore: number;
  findings: string[];
} {
  const sortedLogs = logs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const start = sortedLogs[0]?.timestamp || new Date();
  const end = sortedLogs[sortedLogs.length - 1]?.timestamp || new Date();

  const phiAccessEvents = logs.filter(log => log.phiAccessed === true).length;
  const securityIncidents = logs.filter(
    log => log.severity === 'high' || log.severity === 'critical'
  ).length;

  const findings: string[] = [];

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
export function createSecurityPolicy(params: {
  name: string;
  description: string;
  rules: SecurityRule[];
  priority?: number;
  createdBy: string;
}): SecurityPolicy {
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
export function evaluateSecurityPolicy(
  policy: SecurityPolicy,
  context: Record<string, any>
): {
  matched: boolean;
  rule?: SecurityRule;
  actions: SecurityAction[];
} {
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
export function applySecurityPolicies(
  policies: SecurityPolicy[],
  context: Record<string, any>
): {
  allowed: boolean;
  appliedPolicies: SecurityPolicy[];
  actions: SecurityAction[];
} {
  const sortedPolicies = policies
    .filter(p => p.enabled)
    .sort((a, b) => b.priority - a.priority);

  const appliedPolicies: SecurityPolicy[] = [];
  const actions: SecurityAction[] = [];
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
export function validatePasswordStrength(
  password: string,
  policy: PasswordPolicy
): { valid: boolean; errors: string[]; score: number } {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  } else if (password.length >= policy.minLength) {
    score += 20;
  }

  if (password.length > policy.maxLength) {
    errors.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Uppercase check
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 20;
  }

  // Lowercase check
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 20;
  }

  // Number check
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/[0-9]/.test(password)) {
    score += 20;
  }

  // Special character check
  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
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
export async function hashPassword(password: string): Promise<{
  hash: string;
  salt: string;
  algorithm: string;
}> {
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
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
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
export function createSecureSession(params: {
  userId: string;
  tenantId: string;
  ipAddress: string;
  userAgent: string;
  mfaVerified: boolean;
  duration?: number;
}): SessionSecurity {
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
export function validateSession(
  session: SessionSecurity,
  currentIp: string,
  currentUserAgent: string
): { valid: boolean; reason?: string } {
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
export function refreshSessionActivity(session: SessionSecurity): SessionSecurity {
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
export function scanForVulnerabilities(
  dependencies: { name: string; version: string }[]
): SecurityScanResult {
  const findings: SecurityFinding[] = [];

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
export function scanConfiguration(config: Record<string, any>): SecurityScanResult {
  const findings: SecurityFinding[] = [];

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
export function validateHipaaCompliance(params: {
  encryptionEnabled: boolean;
  auditLoggingEnabled: boolean;
  accessControlsEnabled: boolean;
  backupEnabled: boolean;
  mfaEnabled: boolean;
}): SecurityScanResult {
  const findings: SecurityFinding[] = [];

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
export function classifyDataSensitivity(
  data: Record<string, any>
): DataClassification {
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
export function maskSensitiveData(
  value: string,
  maskChar: string = '*',
  visibleChars: number = 4
): string {
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
export function sanitizeForLogging<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[] = [
    'password', 'token', 'secret', 'ssn', 'credit_card',
    'api_key', 'private_key', 'auth_token'
  ]
): T {
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();

    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]' as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
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
function generateSecureId(): string {
  return `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
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
