/**
 * @fileoverview Security Interfaces and Types
 * @module security/interfaces
 * @description Common interfaces, enums, and types for security services
 *
 * @version 2.0.0
 */

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  audit: {
    enabled: boolean;
    retentionDays: number;
    sensitiveFields: string[];
  };
  threatDetection: {
    enabled: boolean;
    maxFailedAttempts: number;
    lockoutDuration: number;
    suspiciousPatterns: string[];
  };
  dataProtection: {
    enablePiiDetection: boolean;
    enableDataMasking: boolean;
    maskingCharacter: string;
  };
}

export interface EncryptionOptions {
  algorithm?: string;
  keyDerivation?: 'pbkdf2' | 'scrypt' | 'argon2';
  iterations?: number;
  salt?: Buffer;
}

// ============================================================================
// AUDIT INTERFACES
// ============================================================================

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE';
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: AuditCategory;
}

export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  SECURITY_EVENT = 'security_event',
  SYSTEM_ADMINISTRATION = 'system_administration',
  CONFIGURATION_CHANGE = 'configuration_change',
}

// ============================================================================
// THREAT DETECTION INTERFACES
// ============================================================================

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: ThreatType;
  severity: ThreatSeverity;
  source: string;
  target: string;
  description: string;
  metadata?: Record<string, unknown>;
  mitigated: boolean;
  mitigationActions: string[];
}

export enum ThreatType {
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_EXFILTRATION = 'data_exfiltration',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  SUSPICIOUS_PATTERN = 'suspicious_pattern',
}

export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ============================================================================
// PII DETECTION INTERFACES
// ============================================================================

export interface PIIDetectionResult {
  detected: boolean;
  fields: Array<{
    field: string;
    type: PIIType;
    confidence: number;
    value: string;
    maskedValue: string;
  }>;
}

export enum PIIType {
  SSN = 'ssn',
  EMAIL = 'email',
  PHONE = 'phone',
  CREDIT_CARD = 'credit_card',
  ADDRESS = 'address',
  NAME = 'name',
  DATE_OF_BIRTH = 'date_of_birth',
  MEDICAL_ID = 'medical_id',
}
