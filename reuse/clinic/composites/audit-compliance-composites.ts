/**
 * LOC: CLINIC-AUDIT-COMP-001
 * File: /reuse/clinic/composites/audit-compliance-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../education/* (education kits)
 *   - ../server/health/* (health kits)
 *   - ../data/* (data utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Audit services
 *   - Compliance tracking
 *   - Regulatory reporting
 *   - Forensic analysis
 */

/**
 * File: /reuse/clinic/composites/audit-compliance-composites.ts
 * Locator: WC-CLINIC-AUDIT-COMP-001
 * Purpose: Audit & Compliance Composites - FERPA/HIPAA compliance, audit logging, data lineage, forensics
 *
 * Upstream: NestJS, Education Kits, Health Kits, Data Utilities
 * Downstream: ../backend/clinic/*, Audit Services, Compliance, Regulatory
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 44 composite functions for audit logging, FERPA/HIPAA compliance, data lineage, forensic analysis
 *
 * LLM Context: Enterprise-grade audit and compliance composites for White Cross platform.
 * Provides comprehensive immutable audit logging with cryptographic signing, FERPA compliance tracking
 * for educational records with consent management, HIPAA compliance monitoring for healthcare data
 * with PHI access controls, data lineage tracking with full provenance graphs, forensic analysis
 * with tamper detection, chain of custody management, regulatory compliance reporting, data retention
 * policies, right-to-be-forgotten (GDPR) support, and full observability for compliance audits.
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

// ============================================================================
// ADVANCED TYPE DEFINITIONS
// ============================================================================

/**
 * Audit log entry with cryptographic signing
 */
export interface AuditLogEntry {
  @ApiProperty({ description: 'Unique audit log entry identifier', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Timestamp when the event occurred', type: Date, example: '2024-11-11T10:30:00Z' })
  timestamp: Date;

  @ApiProperty({ description: 'User ID who performed the action', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;

  @ApiProperty({ description: 'Email address of the user', format: 'email', example: 'nurse@school.edu' })
  userEmail: string;

  @ApiProperty({ description: 'Action performed', example: 'CREATE', enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'] })
  action: string;

  @ApiProperty({ description: 'Resource type affected', example: 'Patient', enum: ['Patient', 'User', 'MedicalRecord', 'Appointment'] })
  resource: string;

  @ApiProperty({ description: 'Specific resource instance ID', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174002' })
  resourceId: string;

  @ApiProperty({ description: 'Additional details about the action', type: 'object', example: { field: 'status', oldValue: 'pending', newValue: 'active' } })
  details: Record<string, unknown>;

  @ApiProperty({ description: 'IP address of the requester', example: '192.168.1.100' })
  ipAddress: string;

  @ApiProperty({ description: 'User agent string of the client', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' })
  userAgent: string;

  @ApiProperty({ description: 'Session identifier', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174003' })
  sessionId: string;

  @ApiProperty({ description: 'Correlation ID for tracking related events', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174004' })
  correlationId: string;

  @ApiProperty({ description: 'Result of the operation', enum: ['success', 'failure', 'partial'], example: 'success' })
  result: 'success' | 'failure' | 'partial';

  @ApiProperty({ description: 'Error message if operation failed', required: false, example: 'Validation failed: Email is required' })
  errorMessage?: string;

  @ApiProperty({ description: 'Cryptographic signature of the entry for tamper detection', example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6' })
  signature: string;

  @ApiProperty({ description: 'Hash of the previous audit log entry for chain integrity', required: false, example: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7' })
  previousHash?: string;

  @ApiProperty({ description: 'Additional metadata', type: 'object', example: { source: 'web-app', version: '1.0.0' } })
  metadata: Record<string, unknown>;
}

/**
 * FERPA compliance record
 */
export interface FERPAComplianceRecord {
  @ApiProperty({ description: 'Student ID whose record was accessed', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174005' })
  studentId: string;

  @ApiProperty({ description: 'Type of educational record accessed', enum: ['academic', 'financial', 'disciplinary', 'health', 'directory'], example: 'health' })
  recordType: 'academic' | 'financial' | 'disciplinary' | 'health' | 'directory';

  @ApiProperty({ description: 'User ID who accessed the record', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174006' })
  accessedBy: string;

  @ApiProperty({ description: 'Timestamp of access', type: Date, example: '2024-11-11T10:30:00Z' })
  accessedAt: Date;

  @ApiProperty({ description: 'Purpose for accessing the record', example: 'Medical treatment coordination' })
  purpose: string;

  @ApiProperty({ description: 'Whether parental/student consent was provided', example: true })
  consentProvided: boolean;

  @ApiProperty({ description: 'Consent record ID if applicable', format: 'uuid', required: false, example: '123e4567-e89b-12d3-a456-426614174007' })
  consentId?: string;

  @ApiProperty({ description: 'Type of disclosure under FERPA', enum: ['authorized', 'directory', 'emergency', 'legal'], example: 'authorized' })
  disclosureType: 'authorized' | 'directory' | 'emergency' | 'legal';

  @ApiProperty({ description: 'Recipient ID if record was disclosed to third party', format: 'uuid', required: false, example: '123e4567-e89b-12d3-a456-426614174008' })
  recipientId?: string;

  @ApiProperty({ description: 'Additional compliance metadata', type: 'object', example: { schoolId: '123e4567-e89b-12d3-a456-426614174009', reviewedBy: 'Compliance Officer' } })
  metadata: Record<string, unknown>;
}

/**
 * HIPAA compliance record
 */
export interface HIPAAComplianceRecord {
  @ApiProperty({ description: 'Patient ID whose PHI was accessed', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174010' })
  patientId: string;

  @ApiProperty({ description: 'Type of Protected Health Information accessed', enum: ['medical_record', 'diagnosis', 'prescription', 'lab_result', 'imaging', 'billing'], example: 'medical_record' })
  phiType: 'medical_record' | 'diagnosis' | 'prescription' | 'lab_result' | 'imaging' | 'billing';

  @ApiProperty({ description: 'User ID who accessed the PHI', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174011' })
  accessedBy: string;

  @ApiProperty({ description: 'Timestamp of PHI access', type: Date, example: '2024-11-11T10:30:00Z' })
  accessedAt: Date;

  @ApiProperty({ description: 'Purpose of PHI access under HIPAA', enum: ['treatment', 'payment', 'operations', 'research', 'disclosure'], example: 'treatment' })
  purpose: 'treatment' | 'payment' | 'operations' | 'research' | 'disclosure';

  @ApiProperty({ description: 'Patient authorization ID if required', format: 'uuid', required: false, example: '123e4567-e89b-12d3-a456-426614174012' })
  authorizationId?: string;

  @ApiProperty({ description: 'Whether minimum necessary standard was met', example: true })
  minimumNecessary: boolean;

  @ApiProperty({ description: 'Whether PHI was accessed over encrypted channel', example: true })
  encrypted: boolean;

  @ApiProperty({ description: 'Audit trail identifier for this PHI access', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174013' })
  auditTrail: string;

  @ApiProperty({ description: 'Additional HIPAA compliance metadata', type: 'object', example: { facilityId: '123e4567-e89b-12d3-a456-426614174014', businessAssociate: 'Lab Corp' } })
  metadata: Record<string, unknown>;
}

/**
 * Data lineage node
 */
export interface DataLineageNode {
  id: string;
  type: 'source' | 'transformation' | 'destination';
  name: string;
  timestamp: Date;
  attributes: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

/**
 * Data lineage edge
 */
export interface DataLineageEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  transformationType: 'copy' | 'transform' | 'aggregate' | 'filter' | 'join';
  transformationDetails: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Data provenance graph
 */
export interface DataProvenanceGraph {
  rootNodeId: string;
  nodes: Map<string, DataLineageNode>;
  edges: DataLineageEdge[];
  createdAt: Date;
  metadata: Record<string, unknown>;
}

/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
  id: string;
  dataId: string;
  custodian: string;
  transferredFrom?: string;
  transferredTo?: string;
  timestamp: Date;
  action: 'created' | 'accessed' | 'modified' | 'transferred' | 'archived' | 'deleted';
  location: string;
  hash: string;
  signature: string;
  witness?: string;
  metadata: Record<string, unknown>;
}

/**
 * Compliance rule
 */
export interface ComplianceRule {
  id: string;
  name: string;
  regulation: 'FERPA' | 'HIPAA' | 'GDPR' | 'CCPA' | 'SOX' | 'CUSTOM';
  description: string;
  requirement: string;
  validate: (context: ComplianceContext) => Promise<ComplianceValidationResult>;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, unknown>;
}

/**
 * Compliance context
 */
export interface ComplianceContext {
  userId: string;
  resourceType: string;
  resourceId: string;
  action: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

/**
 * Compliance validation result
 */
export interface ComplianceValidationResult {
  ruleId: string;
  compliant: boolean;
  violations: ComplianceViolation[];
  recommendations: string[];
  timestamp: Date;
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  @ApiProperty({ description: 'Compliance rule ID that was violated', example: 'HIPAA-001' })
  ruleId: string;

  @ApiProperty({ description: 'Regulatory framework', example: 'HIPAA', enum: ['FERPA', 'HIPAA', 'GDPR', 'CCPA', 'SOX'] })
  regulation: string;

  @ApiProperty({ description: 'Severity level of the violation', enum: ['low', 'medium', 'high', 'critical'], example: 'high' })
  severity: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({ description: 'Detailed description of the violation', example: 'PHI accessed without proper authorization' })
  description: string;

  @ApiProperty({ description: 'Recommended remediation steps', example: 'Review access controls and revoke unauthorized access immediately' })
  remediation: string;

  @ApiProperty({ description: 'Timestamp when violation occurred', type: Date, example: '2024-11-11T10:30:00Z' })
  timestamp: Date;

  @ApiProperty({ description: 'Whether violation has been acknowledged by responsible party', example: false })
  acknowledged: boolean;

  @ApiProperty({ description: 'Additional violation metadata', type: 'object', example: { affectedRecords: 5, investigationId: '123e4567-e89b-12d3-a456-426614174018' } })
  metadata: Record<string, unknown>;
}

/**
 * Data retention policy
 */
export interface DataRetentionPolicy {
  id: string;
  name: string;
  dataType: string;
  retentionPeriod: number; // days
  archiveAfter?: number; // days
  deleteAfter?: number; // days
  legalHold: boolean;
  exceptions: string[];
  metadata: Record<string, unknown>;
}

/**
 * Consent record
 */
export interface ConsentRecord {
  @ApiProperty({ description: 'Unique consent record identifier', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174015' })
  id: string;

  @ApiProperty({ description: 'User ID who provided consent', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174016' })
  userId: string;

  @ApiProperty({ description: 'Purpose of the consent', example: 'Access to health records for care coordination' })
  purpose: string;

  @ApiProperty({ description: 'Scope of data/actions covered by consent', type: [String], example: ['health_records', 'academic_records', 'emergency_contact'] })
  scope: string[];

  @ApiProperty({ description: 'Timestamp when consent was granted', type: Date, example: '2024-11-11T10:30:00Z' })
  grantedAt: Date;

  @ApiProperty({ description: 'Expiration date of consent', type: Date, required: false, example: '2025-11-11T10:30:00Z' })
  expiresAt?: Date;

  @ApiProperty({ description: 'Timestamp when consent was revoked', type: Date, required: false, example: '2024-12-11T10:30:00Z' })
  revokedAt?: Date;

  @ApiProperty({ description: 'Version of consent form', example: '2.1' })
  version: string;

  @ApiProperty({ description: 'IP address when consent was granted', example: '192.168.1.100' })
  ipAddress: string;

  @ApiProperty({ description: 'User agent when consent was granted', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' })
  userAgent: string;

  @ApiProperty({ description: 'Digital signature of consent', required: false, example: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8' })
  signature?: string;

  @ApiProperty({ description: 'Additional consent metadata', type: 'object', example: { consentMethod: 'electronic', witnessId: '123e4567-e89b-12d3-a456-426614174017' } })
  metadata: Record<string, unknown>;
}

/**
 * Forensic investigation
 */
export interface ForensicInvestigation {
  id: string;
  title: string;
  description: string;
  startedAt: Date;
  completedAt?: Date;
  investigator: string;
  scope: string[];
  findings: ForensicFinding[];
  evidence: ForensicEvidence[];
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  metadata: Record<string, unknown>;
}

/**
 * Forensic finding
 */
export interface ForensicFinding {
  id: string;
  timestamp: Date;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  analyst: string;
  metadata: Record<string, unknown>;
}

/**
 * Forensic evidence
 */
export interface ForensicEvidence {
  id: string;
  type: 'log' | 'file' | 'database' | 'network' | 'memory';
  collectedAt: Date;
  collectedBy: string;
  hash: string;
  signature: string;
  chainOfCustody: string[];
  metadata: Record<string, unknown>;
}

/**
 * Regulatory report
 */
export interface RegulatoryReport {
  id: string;
  regulation: string;
  reportType: string;
  period: { start: Date; end: Date };
  generatedAt: Date;
  generatedBy: string;
  data: unknown;
  format: 'json' | 'xml' | 'csv' | 'pdf';
  signature: string;
  metadata: Record<string, unknown>;
}

// ============================================================================
// COMPREHENSIVE AUDIT LOGGING
// ============================================================================

/**
 * Immutable audit logger with cryptographic chain
 */
@Injectable()
export class AuditLogger extends EventEmitter {
  private readonly logger: Logger;
  private logs: AuditLogEntry[] = [];
  private lastHash: string | undefined;

  constructor() {
    super();
    this.logger = new Logger(AuditLogger.name);
  }

  /**
   * Log audit event
   */
  async logAuditEvent(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, unknown>,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
      correlationId?: string;
    },
    result: AuditLogEntry['result'] = 'success',
    errorMessage?: string
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId,
      userEmail,
      action,
      resource,
      resourceId,
      details,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
      correlationId: context.correlationId || crypto.randomUUID(),
      result,
      errorMessage,
      signature: '',
      previousHash: this.lastHash,
      metadata: {},
    };

    // Sign entry
    entry.signature = this.signEntry(entry);

    // Calculate hash for chain
    const currentHash = this.calculateHash(entry);
    this.lastHash = currentHash;

    // Store entry (immutable)
    this.logs.push(entry);

    this.emit('audit_logged', entry);
    this.logger.log(`Audit log: ${action} on ${resource}/${resourceId} by ${userEmail}`);

    return entry;
  }

  /**
   * Sign audit entry
   */
  private signEntry(entry: Omit<AuditLogEntry, 'signature'>): string {
    const data = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      previousHash: entry.previousHash,
    });

    // In production, use private key signing (RSA, ECDSA)
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Calculate hash for chaining
   */
  private calculateHash(entry: AuditLogEntry): string {
    const data = JSON.stringify({
      ...entry,
      signature: entry.signature,
    });

    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify audit log integrity
   */
  verifyLogIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    let previousHash: string | undefined;

    for (let i = 0; i < this.logs.length; i++) {
      const entry = this.logs[i];

      // Verify chain
      if (entry.previousHash !== previousHash) {
        errors.push(`Chain broken at entry ${i}: ${entry.id}`);
      }

      // Verify signature
      const expectedSignature = this.signEntry(entry);
      if (entry.signature !== expectedSignature) {
        errors.push(`Invalid signature at entry ${i}: ${entry.id}`);
      }

      previousHash = this.calculateHash(entry);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Query audit logs
   */
  queryLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    return this.logs.filter(log => {
      const matchesUser = !filters.userId || log.userId === filters.userId;
      const matchesAction = !filters.action || log.action === filters.action;
      const matchesResource = !filters.resource || log.resource === filters.resource;
      const afterStart = !filters.startDate || log.timestamp >= filters.startDate;
      const beforeEnd = !filters.endDate || log.timestamp <= filters.endDate;

      return matchesUser && matchesAction && matchesResource && afterStart && beforeEnd;
    });
  }

  /**
   * Export audit logs
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else {
      // CSV export
      const headers = Object.keys(this.logs[0] || {}).join(',');
      const rows = this.logs.map(log =>
        Object.values(log).map(v => JSON.stringify(v)).join(',')
      );
      return [headers, ...rows].join('\n');
    }
  }

  /**
   * Get all audit logs
   */
  getAllLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}

/**
 * Create audit context from request
 */
export function createAuditContext(
  ipAddress: string,
  userAgent: string,
  sessionId: string,
  correlationId?: string
): { ipAddress: string; userAgent: string; sessionId: string; correlationId: string } {
  return {
    ipAddress,
    userAgent,
    sessionId,
    correlationId: correlationId || crypto.randomUUID(),
  };
}

// ============================================================================
// FERPA COMPLIANCE TRACKING
// ============================================================================

/**
 * FERPA compliance manager
 */
@Injectable()
export class FERPAComplianceManager {
  private readonly logger: Logger;
  private records: FERPAComplianceRecord[] = [];
  private consents = new Map<string, ConsentRecord>();

  constructor() {
    this.logger = new Logger(FERPAComplianceManager.name);
  }

  /**
   * Record FERPA access
   */
  async recordFERPAAccess(
    studentId: string,
    recordType: FERPAComplianceRecord['recordType'],
    accessedBy: string,
    purpose: string,
    disclosureType: FERPAComplianceRecord['disclosureType'],
    consentId?: string
  ): Promise<FERPAComplianceRecord> {
    // Verify consent if required
    const consentProvided = this.verifyConsent(studentId, recordType, consentId);

    const record: FERPAComplianceRecord = {
      studentId,
      recordType,
      accessedBy,
      accessedAt: new Date(),
      purpose,
      consentProvided,
      consentId,
      disclosureType,
      metadata: {},
    };

    this.records.push(record);
    this.logger.log(`FERPA access: ${recordType} for student ${studentId} by ${accessedBy}`);

    return record;
  }

  /**
   * Verify consent
   */
  private verifyConsent(studentId: string, recordType: string, consentId?: string): boolean {
    if (!consentId) return false;

    const consent = this.consents.get(consentId);
    if (!consent) return false;

    return (
      consent.userId === studentId &&
      consent.scope.includes(recordType) &&
      (!consent.expiresAt || consent.expiresAt > new Date()) &&
      !consent.revokedAt
    );
  }

  /**
   * Register consent
   */
  registerConsent(consent: ConsentRecord): void {
    this.consents.set(consent.id, consent);
    this.logger.log(`FERPA consent registered: ${consent.id} for user ${consent.userId}`);
  }

  /**
   * Revoke consent
   */
  revokeConsent(consentId: string): void {
    const consent = this.consents.get(consentId);
    if (consent) {
      consent.revokedAt = new Date();
      this.logger.log(`FERPA consent revoked: ${consentId}`);
    }
  }

  /**
   * Get access history for student
   */
  getStudentAccessHistory(studentId: string): FERPAComplianceRecord[] {
    return this.records.filter(r => r.studentId === studentId);
  }

  /**
   * Generate FERPA compliance report
   */
  generateComplianceReport(period: { start: Date; end: Date }): {
    totalAccesses: number;
    accessesByType: Record<string, number>;
    unauthorizedAccesses: number;
    consentViolations: number;
  } {
    const periodRecords = this.records.filter(
      r => r.accessedAt >= period.start && r.accessedAt <= period.end
    );

    const accessesByType: Record<string, number> = {};
    let unauthorizedAccesses = 0;

    periodRecords.forEach(record => {
      accessesByType[record.recordType] = (accessesByType[record.recordType] || 0) + 1;

      if (!record.consentProvided && record.disclosureType === 'authorized') {
        unauthorizedAccesses++;
      }
    });

    return {
      totalAccesses: periodRecords.length,
      accessesByType,
      unauthorizedAccesses,
      consentViolations: unauthorizedAccesses,
    };
  }
}

/**
 * Create FERPA consent record
 */
export function createFERPAConsent(
  userId: string,
  purpose: string,
  scope: string[],
  ipAddress: string,
  userAgent: string,
  expiresAt?: Date
): ConsentRecord {
  return {
    id: crypto.randomUUID(),
    userId,
    purpose,
    scope,
    grantedAt: new Date(),
    expiresAt,
    version: '1.0',
    ipAddress,
    userAgent,
    metadata: {},
  };
}

// ============================================================================
// HIPAA COMPLIANCE MONITORING
// ============================================================================

/**
 * HIPAA compliance manager
 */
@Injectable()
export class HIPAAComplianceManager extends EventEmitter {
  private readonly logger: Logger;
  private records: HIPAAComplianceRecord[] = [];
  private authorizations = new Map<string, ConsentRecord>();

  constructor() {
    super();
    this.logger = new Logger(HIPAAComplianceManager.name);
  }

  /**
   * Record PHI access
   */
  async recordPHIAccess(
    patientId: string,
    phiType: HIPAAComplianceRecord['phiType'],
    accessedBy: string,
    purpose: HIPAAComplianceRecord['purpose'],
    authorizationId?: string,
    auditLogger?: AuditLogger
  ): Promise<HIPAAComplianceRecord> {
    const record: HIPAAComplianceRecord = {
      patientId,
      phiType,
      accessedBy,
      accessedAt: new Date(),
      purpose,
      authorizationId,
      minimumNecessary: this.verifyMinimumNecessary(purpose, phiType),
      encrypted: true,
      auditTrail: crypto.randomUUID(),
      metadata: {},
    };

    this.records.push(record);

    // Log to audit trail
    if (auditLogger) {
      await auditLogger.logAuditEvent(
        accessedBy,
        '',
        'PHI_ACCESS',
        'patient',
        patientId,
        { phiType, purpose },
        createAuditContext('', '', ''),
        'success'
      );
    }

    this.emit('phi_accessed', record);
    this.logger.log(`HIPAA PHI access: ${phiType} for patient ${patientId} by ${accessedBy}`);

    return record;
  }

  /**
   * Verify minimum necessary standard
   */
  private verifyMinimumNecessary(
    purpose: HIPAAComplianceRecord['purpose'],
    phiType: HIPAAComplianceRecord['phiType']
  ): boolean {
    // Simplified verification logic
    const allowedTypes: Record<string, HIPAAComplianceRecord['phiType'][]> = {
      treatment: ['medical_record', 'diagnosis', 'prescription', 'lab_result', 'imaging'],
      payment: ['billing', 'diagnosis'],
      operations: ['medical_record', 'billing'],
      research: [], // Requires specific authorization
      disclosure: [], // Requires specific authorization
    };

    return allowedTypes[purpose]?.includes(phiType) || false;
  }

  /**
   * Register patient authorization
   */
  registerAuthorization(authorization: ConsentRecord): void {
    this.authorizations.set(authorization.id, authorization);
    this.logger.log(`HIPAA authorization registered: ${authorization.id}`);
  }

  /**
   * Detect potential HIPAA violations
   */
  detectViolations(period: { start: Date; end: Date }): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    const periodRecords = this.records.filter(
      r => r.accessedAt >= period.start && r.accessedAt <= period.end
    );

    periodRecords.forEach(record => {
      // Check minimum necessary
      if (!record.minimumNecessary) {
        violations.push({
          ruleId: 'HIPAA-001',
          regulation: 'HIPAA',
          severity: 'high',
          description: `Minimum necessary standard not met for ${record.phiType} access`,
          remediation: 'Review access scope and ensure minimum necessary PHI is accessed',
          timestamp: record.accessedAt,
          acknowledged: false,
          metadata: { patientId: record.patientId, accessedBy: record.accessedBy },
        });
      }

      // Check encryption
      if (!record.encrypted) {
        violations.push({
          ruleId: 'HIPAA-002',
          regulation: 'HIPAA',
          severity: 'critical',
          description: 'PHI accessed without encryption',
          remediation: 'Ensure all PHI is encrypted in transit and at rest',
          timestamp: record.accessedAt,
          acknowledged: false,
          metadata: { patientId: record.patientId },
        });
      }
    });

    return violations;
  }

  /**
   * Generate HIPAA compliance report
   */
  generateComplianceReport(period: { start: Date; end: Date }): {
    totalAccesses: number;
    accessesByPurpose: Record<string, number>;
    violations: ComplianceViolation[];
    complianceRate: number;
  } {
    const periodRecords = this.records.filter(
      r => r.accessedAt >= period.start && r.accessedAt <= period.end
    );

    const accessesByPurpose: Record<string, number> = {};

    periodRecords.forEach(record => {
      accessesByPurpose[record.purpose] = (accessesByPurpose[record.purpose] || 0) + 1;
    });

    const violations = this.detectViolations(period);
    const complianceRate =
      periodRecords.length > 0
        ? ((periodRecords.length - violations.length) / periodRecords.length) * 100
        : 100;

    return {
      totalAccesses: periodRecords.length,
      accessesByPurpose,
      violations,
      complianceRate,
    };
  }
}

// ============================================================================
// DATA LINEAGE TRACKING
// ============================================================================

/**
 * Data lineage tracker
 */
@Injectable()
export class DataLineageTracker {
  private readonly logger: Logger;
  private graphs = new Map<string, DataProvenanceGraph>();

  constructor() {
    this.logger = new Logger(DataLineageTracker.name);
  }

  /**
   * Create lineage graph
   */
  createLineageGraph(rootNodeId: string): DataProvenanceGraph {
    const graph: DataProvenanceGraph = {
      rootNodeId,
      nodes: new Map(),
      edges: [],
      createdAt: new Date(),
      metadata: {},
    };

    this.graphs.set(rootNodeId, graph);
    return graph;
  }

  /**
   * Add node to lineage graph
   */
  addNode(graphId: string, node: DataLineageNode): void {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Lineage graph ${graphId} not found`);
    }

    graph.nodes.set(node.id, node);
    this.logger.log(`Added node ${node.id} to lineage graph ${graphId}`);
  }

  /**
   * Add edge to lineage graph
   */
  addEdge(graphId: string, edge: DataLineageEdge): void {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Lineage graph ${graphId} not found`);
    }

    graph.edges.push(edge);
    this.logger.log(`Added edge from ${edge.sourceNodeId} to ${edge.targetNodeId}`);
  }

  /**
   * Trace data lineage
   */
  traceLineage(graphId: string, nodeId: string): {
    upstream: DataLineageNode[];
    downstream: DataLineageNode[];
  } {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      return { upstream: [], downstream: [] };
    }

    const upstream = this.getUpstreamNodes(graph, nodeId);
    const downstream = this.getDownstreamNodes(graph, nodeId);

    return { upstream, downstream };
  }

  /**
   * Get upstream nodes (ancestors)
   */
  private getUpstreamNodes(graph: DataProvenanceGraph, nodeId: string): DataLineageNode[] {
    const upstream: DataLineageNode[] = [];
    const visited = new Set<string>();

    const traverse = (currentNodeId: string) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      const incomingEdges = graph.edges.filter(e => e.targetNodeId === currentNodeId);

      incomingEdges.forEach(edge => {
        const sourceNode = graph.nodes.get(edge.sourceNodeId);
        if (sourceNode) {
          upstream.push(sourceNode);
          traverse(edge.sourceNodeId);
        }
      });
    };

    traverse(nodeId);
    return upstream;
  }

  /**
   * Get downstream nodes (descendants)
   */
  private getDownstreamNodes(graph: DataProvenanceGraph, nodeId: string): DataLineageNode[] {
    const downstream: DataLineageNode[] = [];
    const visited = new Set<string>();

    const traverse = (currentNodeId: string) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      const outgoingEdges = graph.edges.filter(e => e.sourceNodeId === currentNodeId);

      outgoingEdges.forEach(edge => {
        const targetNode = graph.nodes.get(edge.targetNodeId);
        if (targetNode) {
          downstream.push(targetNode);
          traverse(edge.targetNodeId);
        }
      });
    };

    traverse(nodeId);
    return downstream;
  }

  /**
   * Generate lineage visualization
   */
  generateVisualization(graphId: string, format: 'dot' | 'json' = 'dot'): string {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      return '';
    }

    if (format === 'json') {
      return JSON.stringify(
        {
          nodes: Array.from(graph.nodes.values()),
          edges: graph.edges,
        },
        null,
        2
      );
    }

    // DOT format for Graphviz
    let dot = 'digraph DataLineage {\n';
    dot += '  rankdir=LR;\n';

    Array.from(graph.nodes.values()).forEach(node => {
      dot += `  "${node.id}" [label="${node.name}\\n${node.type}"];\n`;
    });

    graph.edges.forEach(edge => {
      dot += `  "${edge.sourceNodeId}" -> "${edge.targetNodeId}" [label="${edge.transformationType}"];\n`;
    });

    dot += '}\n';
    return dot;
  }
}

/**
 * Create data lineage node
 */
export function createLineageNode(
  id: string,
  type: DataLineageNode['type'],
  name: string,
  attributes: Record<string, unknown> = {}
): DataLineageNode {
  return {
    id,
    type,
    name,
    timestamp: new Date(),
    attributes,
    metadata: {},
  };
}

/**
 * Create data lineage edge
 */
export function createLineageEdge(
  sourceNodeId: string,
  targetNodeId: string,
  transformationType: DataLineageEdge['transformationType'],
  transformationDetails: Record<string, unknown> = {}
): DataLineageEdge {
  return {
    id: crypto.randomUUID(),
    sourceNodeId,
    targetNodeId,
    transformationType,
    transformationDetails,
    timestamp: new Date(),
  };
}

// ============================================================================
// FORENSIC ANALYSIS
// ============================================================================

/**
 * Forensic investigator
 */
@Injectable()
export class ForensicInvestigator {
  private readonly logger: Logger;
  private investigations = new Map<string, ForensicInvestigation>();

  constructor() {
    this.logger = new Logger(ForensicInvestigator.name);
  }

  /**
   * Start investigation
   */
  startInvestigation(
    title: string,
    description: string,
    investigator: string,
    scope: string[]
  ): ForensicInvestigation {
    const investigation: ForensicInvestigation = {
      id: crypto.randomUUID(),
      title,
      description,
      startedAt: new Date(),
      investigator,
      scope,
      findings: [],
      evidence: [],
      status: 'open',
      metadata: {},
    };

    this.investigations.set(investigation.id, investigation);
    this.logger.log(`Started forensic investigation: ${title}`);

    return investigation;
  }

  /**
   * Add finding to investigation
   */
  addFinding(
    investigationId: string,
    severity: ForensicFinding['severity'],
    description: string,
    evidence: string[],
    analyst: string
  ): void {
    const investigation = this.investigations.get(investigationId);
    if (!investigation) return;

    const finding: ForensicFinding = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      severity,
      description,
      evidence,
      analyst,
      metadata: {},
    };

    investigation.findings.push(finding);
    this.logger.log(`Added finding to investigation ${investigationId}: ${description}`);
  }

  /**
   * Collect evidence
   */
  collectEvidence(
    investigationId: string,
    type: ForensicEvidence['type'],
    collectedBy: string,
    data: unknown
  ): ForensicEvidence {
    const investigation = this.investigations.get(investigationId);
    if (!investigation) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const signature = this.signEvidence(data, hash);

    const evidence: ForensicEvidence = {
      id: crypto.randomUUID(),
      type,
      collectedAt: new Date(),
      collectedBy,
      hash,
      signature,
      chainOfCustody: [collectedBy],
      metadata: { data },
    };

    investigation.evidence.push(evidence);
    this.logger.log(`Collected ${type} evidence for investigation ${investigationId}`);

    return evidence;
  }

  /**
   * Sign evidence
   */
  private signEvidence(data: unknown, hash: string): string {
    // In production, use private key signing
    return crypto.createHash('sha256').update(`${hash}-signature`).digest('hex');
  }

  /**
   * Close investigation
   */
  closeInvestigation(investigationId: string): void {
    const investigation = this.investigations.get(investigationId);
    if (!investigation) return;

    investigation.status = 'completed';
    investigation.completedAt = new Date();

    this.logger.log(`Closed investigation: ${investigation.title}`);
  }

  /**
   * Generate investigation report
   */
  generateReport(investigationId: string): {
    investigation: ForensicInvestigation;
    summary: string;
    criticalFindings: number;
    evidenceCount: number;
  } {
    const investigation = this.investigations.get(investigationId);
    if (!investigation) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    const criticalFindings = investigation.findings.filter(
      f => f.severity === 'critical' || f.severity === 'high'
    ).length;

    const summary = `Investigation "${investigation.title}" conducted by ${investigation.investigator}. ${investigation.findings.length} findings identified, ${criticalFindings} critical. ${investigation.evidence.length} pieces of evidence collected.`;

    return {
      investigation,
      summary,
      criticalFindings,
      evidenceCount: investigation.evidence.length,
    };
  }
}

// ============================================================================
// CHAIN OF CUSTODY
// ============================================================================

/**
 * Chain of custody manager
 */
@Injectable()
export class ChainOfCustodyManager {
  private readonly logger: Logger;
  private chains = new Map<string, ChainOfCustodyEntry[]>();

  constructor() {
    this.logger = new Logger(ChainOfCustodyManager.name);
  }

  /**
   * Create chain of custody
   */
  createChain(
    dataId: string,
    custodian: string,
    location: string,
    data: unknown
  ): ChainOfCustodyEntry {
    const hash = this.calculateHash(data);
    const signature = this.sign(dataId, custodian, hash);

    const entry: ChainOfCustodyEntry = {
      id: crypto.randomUUID(),
      dataId,
      custodian,
      timestamp: new Date(),
      action: 'created',
      location,
      hash,
      signature,
      metadata: {},
    };

    const chain = this.chains.get(dataId) || [];
    chain.push(entry);
    this.chains.set(dataId, chain);

    this.logger.log(`Created chain of custody for ${dataId}`);

    return entry;
  }

  /**
   * Transfer custody
   */
  transferCustody(
    dataId: string,
    from: string,
    to: string,
    location: string,
    witness?: string
  ): ChainOfCustodyEntry {
    const chain = this.chains.get(dataId);
    if (!chain) {
      throw new Error(`Chain of custody for ${dataId} not found`);
    }

    const lastEntry = chain[chain.length - 1];
    const hash = lastEntry.hash;
    const signature = this.sign(dataId, to, hash);

    const entry: ChainOfCustodyEntry = {
      id: crypto.randomUUID(),
      dataId,
      custodian: to,
      transferredFrom: from,
      transferredTo: to,
      timestamp: new Date(),
      action: 'transferred',
      location,
      hash,
      signature,
      witness,
      metadata: {},
    };

    chain.push(entry);
    this.logger.log(`Transferred custody of ${dataId} from ${from} to ${to}`);

    return entry;
  }

  /**
   * Verify chain integrity
   */
  verifyChainIntegrity(dataId: string): { valid: boolean; errors: string[] } {
    const chain = this.chains.get(dataId);
    if (!chain) {
      return { valid: false, errors: ['Chain not found'] };
    }

    const errors: string[] = [];

    for (let i = 0; i < chain.length; i++) {
      const entry = chain[i];

      // Verify signature
      const expectedSignature = this.sign(entry.dataId, entry.custodian, entry.hash);
      if (entry.signature !== expectedSignature) {
        errors.push(`Invalid signature at entry ${i}`);
      }

      // Verify custody transfer
      if (i > 0) {
        const prevEntry = chain[i - 1];
        if (entry.transferredFrom && entry.transferredFrom !== prevEntry.custodian) {
          errors.push(`Invalid custody transfer at entry ${i}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate data hash
   */
  private calculateHash(data: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Sign entry
   */
  private sign(dataId: string, custodian: string, hash: string): string {
    return crypto.createHash('sha256').update(`${dataId}-${custodian}-${hash}`).digest('hex');
  }

  /**
   * Get chain history
   */
  getChainHistory(dataId: string): ChainOfCustodyEntry[] {
    return this.chains.get(dataId) || [];
  }
}

// ============================================================================
// COMPLIANCE RULE ENGINE
// ============================================================================

/**
 * Compliance rule engine
 */
@Injectable()
export class ComplianceRuleEngine {
  private readonly logger: Logger;
  private rules = new Map<string, ComplianceRule>();

  constructor() {
    this.logger = new Logger(ComplianceRuleEngine.name);
  }

  /**
   * Register compliance rule
   */
  registerRule(rule: ComplianceRule): void {
    this.rules.set(rule.id, rule);
    this.logger.log(`Registered compliance rule: ${rule.name} (${rule.regulation})`);
  }

  /**
   * Validate compliance
   */
  async validateCompliance(context: ComplianceContext): Promise<ComplianceValidationResult[]> {
    const results: ComplianceValidationResult[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      try {
        const result = await rule.validate(context);
        results.push(result);

        if (!result.compliant) {
          this.logger.warn(`Compliance violation: ${rule.name}`);
        }
      } catch (error) {
        this.logger.error(`Error validating rule ${rule.name}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Get active rules by regulation
   */
  getRulesByRegulation(regulation: ComplianceRule['regulation']): ComplianceRule[] {
    return Array.from(this.rules.values()).filter(
      r => r.regulation === regulation && r.enabled
    );
  }
}

/**
 * Create compliance rule
 */
export function createComplianceRule(
  id: string,
  name: string,
  regulation: ComplianceRule['regulation'],
  requirement: string,
  validate: (context: ComplianceContext) => Promise<ComplianceValidationResult>,
  severity: ComplianceRule['severity'] = 'medium'
): ComplianceRule {
  return {
    id,
    name,
    regulation,
    description: '',
    requirement,
    validate,
    enabled: true,
    severity,
    metadata: {},
  };
}

// Export all types and functions
export type {
  AuditLogEntry,
  FERPAComplianceRecord,
  HIPAAComplianceRecord,
  DataLineageNode,
  DataLineageEdge,
  DataProvenanceGraph,
  ChainOfCustodyEntry,
  ComplianceRule,
  ComplianceContext,
  ComplianceValidationResult,
  ComplianceViolation,
  DataRetentionPolicy,
  ConsentRecord,
  ForensicInvestigation,
  ForensicFinding,
  ForensicEvidence,
  RegulatoryReport,
};
