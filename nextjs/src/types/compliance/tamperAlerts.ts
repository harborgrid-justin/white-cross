/**
 * Tamper Alert Types
 *
 * Types for audit log tamper detection and notification system.
 * Critical for HIPAA compliance and security monitoring.
 *
 * @module types/compliance/tamperAlerts
 * @category Compliance
 */

import { z } from 'zod';
import type { BaseAuditEntity, ApiResponse, PaginatedResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Type of tamper detection
 */
export enum TamperType {
  /** Checksum mismatch */
  CHECKSUM_MISMATCH = 'CHECKSUM_MISMATCH',
  /** Missing log entries */
  MISSING_ENTRIES = 'MISSING_ENTRIES',
  /** Sequence number gap */
  SEQUENCE_GAP = 'SEQUENCE_GAP',
  /** Timestamp anomaly */
  TIMESTAMP_ANOMALY = 'TIMESTAMP_ANOMALY',
  /** Unauthorized modification */
  UNAUTHORIZED_MODIFICATION = 'UNAUTHORIZED_MODIFICATION',
  /** Deleted entries detected */
  DELETED_ENTRIES = 'DELETED_ENTRIES',
  /** Hash chain broken */
  HASH_CHAIN_BROKEN = 'HASH_CHAIN_BROKEN',
  /** Suspicious access pattern */
  SUSPICIOUS_ACCESS = 'SUSPICIOUS_ACCESS',
}

/**
 * Severity of tamper detection
 */
export enum TamperSeverity {
  /** Low severity - informational */
  LOW = 'LOW',
  /** Medium severity - investigate */
  MEDIUM = 'MEDIUM',
  /** High severity - immediate attention */
  HIGH = 'HIGH',
  /** Critical severity - security incident */
  CRITICAL = 'CRITICAL',
}

/**
 * Status of tamper alert
 */
export enum TamperAlertStatus {
  /** Alert created, needs review */
  NEW = 'NEW',
  /** Under investigation */
  INVESTIGATING = 'INVESTIGATING',
  /** Confirmed as tampering */
  CONFIRMED = 'CONFIRMED',
  /** False positive */
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  /** Resolved */
  RESOLVED = 'RESOLVED',
  /** Escalated to security team */
  ESCALATED = 'ESCALATED',
}

/**
 * Type of entity being monitored
 */
export enum MonitoredEntityType {
  /** Audit log entries */
  AUDIT_LOG = 'AUDIT_LOG',
  /** Health records */
  HEALTH_RECORD = 'HEALTH_RECORD',
  /** Medication logs */
  MEDICATION_LOG = 'MEDICATION_LOG',
  /** PHI disclosure records */
  PHI_DISCLOSURE = 'PHI_DISCLOSURE',
  /** Student records */
  STUDENT_RECORD = 'STUDENT_RECORD',
  /** System configuration */
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  /** User accounts */
  USER_ACCOUNT = 'USER_ACCOUNT',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Tamper Alert Record
 *
 * Represents detected tampering attempt or anomaly in audit logs.
 *
 * @property {TamperType} tamperType - Type of tampering detected
 * @property {TamperSeverity} severity - Severity of the alert
 * @property {TamperAlertStatus} status - Current status of the alert
 * @property {MonitoredEntityType} entityType - Type of entity that was tampered
 * @property {string} entityId - ID of affected entity
 * @property {string} detectedAt - ISO timestamp of detection
 * @property {string} [detectedBy] - User or system that detected tampering
 * @property {string} description - Description of tampering detected
 * @property {Record<string, any>} evidence - Evidence data (checksums, logs, etc.)
 * @property {string} [suspectedUser] - User suspected of tampering
 * @property {string} [suspectedIp] - IP address of suspected tampering
 * @property {string} [affectedRecords] - Count or list of affected records
 * @property {string} [investigatedBy] - User investigating the alert
 * @property {string} [investigationNotes] - Notes from investigation
 * @property {string} [resolvedAt] - ISO timestamp of resolution
 * @property {string} [resolvedBy] - User who resolved the alert
 * @property {string} [resolution] - Description of resolution
 * @property {boolean} isSecurityIncident - Whether this is a security incident
 * @property {string} [incidentTicketId] - Related security incident ticket
 */
export interface TamperAlert extends BaseAuditEntity {
  tamperType: TamperType;
  severity: TamperSeverity;
  status: TamperAlertStatus;
  entityType: MonitoredEntityType;
  entityId: string;
  detectedAt: string;
  detectedBy?: string | null;
  description: string;
  evidence: Record<string, any>;
  suspectedUser?: string | null;
  suspectedIp?: string | null;
  affectedRecords?: string | null;
  investigatedBy?: string | null;
  investigationNotes?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  resolution?: string | null;
  isSecurityIncident: boolean;
  incidentTicketId?: string | null;
}

/**
 * Audit checksum record
 *
 * Cryptographic checksum for audit log integrity verification.
 *
 * @property {string} entityId - ID of entity being checksummed
 * @property {MonitoredEntityType} entityType - Type of entity
 * @property {string} checksum - Cryptographic hash (SHA-256)
 * @property {string} algorithm - Hashing algorithm used
 * @property {number} sequenceNumber - Sequence number in audit chain
 * @property {string} previousChecksum - Checksum of previous entry
 * @property {string} checksumAt - ISO timestamp of checksum creation
 */
export interface AuditChecksum extends BaseAuditEntity {
  entityId: string;
  entityType: MonitoredEntityType;
  checksum: string;
  algorithm: string;
  sequenceNumber: number;
  previousChecksum?: string | null;
  checksumAt: string;
}

/**
 * Tamper detection rule
 *
 * Configuration for automated tamper detection.
 */
export interface TamperDetectionRule extends BaseAuditEntity {
  name: string;
  description: string;
  entityType: MonitoredEntityType;
  tamperType: TamperType;
  enabled: boolean;
  severity: TamperSeverity;
  checkIntervalMinutes: number;
  conditions: Record<string, any>;
  actions: ('ALERT' | 'EMAIL' | 'SMS' | 'LOCK_ENTITY' | 'ESCALATE')[];
}

/**
 * Tamper event
 *
 * Individual tampering event within an alert.
 */
export interface TamperEvent {
  id: string;
  alertId: string;
  eventType: TamperType;
  occurredAt: string;
  affectedEntityId: string;
  details: Record<string, any>;
}

/**
 * Tamper statistics
 *
 * Aggregated tamper detection metrics.
 */
export interface TamperStatistics {
  totalAlerts: number;
  alertsBySeverity: Record<TamperSeverity, number>;
  alertsByType: Record<TamperType, number>;
  alertsByStatus: Record<TamperAlertStatus, number>;
  newAlertsLast24h: number;
  criticalUnresolved: number;
  averageResolutionTimeHours: number;
  falsePositiveRate: number;
  securityIncidents: number;
  affectedEntities: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to create tamper alert (usually automated)
 */
export interface CreateTamperAlertRequest {
  tamperType: TamperType;
  severity: TamperSeverity;
  entityType: MonitoredEntityType;
  entityId: string;
  description: string;
  evidence: Record<string, any>;
  suspectedUser?: string;
  suspectedIp?: string;
  affectedRecords?: string;
  isSecurityIncident: boolean;
}

/**
 * Request to update tamper alert
 */
export interface UpdateTamperAlertRequest {
  status?: TamperAlertStatus;
  investigatedBy?: string;
  investigationNotes?: string;
  resolution?: string;
  isSecurityIncident?: boolean;
  incidentTicketId?: string;
}

/**
 * Filters for querying tamper alerts
 */
export interface TamperAlertFilters {
  tamperType?: TamperType;
  severity?: TamperSeverity;
  status?: TamperAlertStatus;
  entityType?: MonitoredEntityType;
  startDate?: string;
  endDate?: string;
  isSecurityIncident?: boolean;
  suspectedUser?: string;
  page?: number;
  limit?: number;
  sortBy?: 'detectedAt' | 'severity' | 'status';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Request to verify checksum
 */
export interface VerifyChecksumRequest {
  entityId: string;
  entityType: MonitoredEntityType;
}

/**
 * Response types
 */
export type TamperAlertResponse = ApiResponse<TamperAlert>;
export type TamperAlertsResponse = PaginatedResponse<TamperAlert>;
export type TamperStatisticsResponse = ApiResponse<TamperStatistics>;
export type ChecksumVerificationResponse = ApiResponse<{
  isValid: boolean;
  expectedChecksum: string;
  actualChecksum: string;
  message: string;
}>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

/**
 * Zod schema for creating tamper alert
 */
export const CreateTamperAlertSchema = z.object({
  tamperType: z.nativeEnum(TamperType),
  severity: z.nativeEnum(TamperSeverity),
  entityType: z.nativeEnum(MonitoredEntityType),
  entityId: z.string().uuid(),
  description: z.string().min(1).max(1000),
  evidence: z.record(z.any()),
  suspectedUser: z.string().uuid().optional(),
  suspectedIp: z.string().ip().optional(),
  affectedRecords: z.string().optional(),
  isSecurityIncident: z.boolean(),
});

/**
 * Zod schema for updating tamper alert
 */
export const UpdateTamperAlertSchema = z.object({
  status: z.nativeEnum(TamperAlertStatus).optional(),
  investigatedBy: z.string().uuid().optional(),
  investigationNotes: z.string().max(2000).optional(),
  resolution: z.string().max(1000).optional(),
  isSecurityIncident: z.boolean().optional(),
  incidentTicketId: z.string().optional(),
});

/**
 * Zod schema for tamper alert filters
 */
export const TamperAlertFiltersSchema = z.object({
  tamperType: z.nativeEnum(TamperType).optional(),
  severity: z.nativeEnum(TamperSeverity).optional(),
  status: z.nativeEnum(TamperAlertStatus).optional(),
  entityType: z.nativeEnum(MonitoredEntityType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isSecurityIncident: z.boolean().optional(),
  suspectedUser: z.string().uuid().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['detectedAt', 'severity', 'status']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

/**
 * Tamper Alerts Redux slice state
 */
export interface TamperAlertsState {
  alerts: TamperAlert[];
  selectedAlert: TamperAlert | null;
  statistics: TamperStatistics | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  filters: TamperAlertFilters;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for Tamper Alert List component
 */
export interface TamperAlertListProps {
  onSelectAlert?: (alert: TamperAlert) => void;
  onInvestigate?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  showFilters?: boolean;
  autoRefresh?: boolean;
}

/**
 * Props for Tamper Alert Detail component
 */
export interface TamperAlertDetailProps {
  alert: TamperAlert;
  onInvestigate?: () => void;
  onResolve?: () => void;
  onEscalate?: () => void;
  onMarkFalsePositive?: () => void;
  showActions?: boolean;
}

/**
 * Props for Tamper Alert Badge/Indicator
 */
export interface TamperAlertBadgeProps {
  count: number;
  severity?: TamperSeverity;
  onClick?: () => void;
  showZero?: boolean;
}

/**
 * Props for Tamper Statistics Dashboard
 */
export interface TamperStatisticsDashboardProps {
  statistics: TamperStatistics;
  onViewAlerts?: (filter: Partial<TamperAlertFilters>) => void;
  onExport?: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Alert with severity classification
 */
export type CriticalTamperAlert = TamperAlert & {
  severity: TamperSeverity.CRITICAL;
};

/**
 * Unresolved alert
 */
export type UnresolvedTamperAlert = TamperAlert & {
  status: TamperAlertStatus.NEW | TamperAlertStatus.INVESTIGATING | TamperAlertStatus.ESCALATED;
};

/**
 * Alert summary for notifications
 */
export type TamperAlertSummary = Pick<
  TamperAlert,
  'id' | 'tamperType' | 'severity' | 'status' | 'detectedAt' | 'description'
> & {
  affectedEntityCount: number;
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if alert is critical
 */
export function isCriticalAlert(alert: TamperAlert): alert is CriticalTamperAlert {
  return alert.severity === TamperSeverity.CRITICAL;
}

/**
 * Check if alert is unresolved
 */
export function isUnresolvedAlert(alert: TamperAlert): alert is UnresolvedTamperAlert {
  return [
    TamperAlertStatus.NEW,
    TamperAlertStatus.INVESTIGATING,
    TamperAlertStatus.ESCALATED,
  ].includes(alert.status);
}

/**
 * Check if alert is a security incident
 */
export function isSecurityIncident(alert: TamperAlert): boolean {
  return alert.isSecurityIncident;
}

/**
 * Check if alert requires immediate action
 */
export function requiresImmediateAction(alert: TamperAlert): boolean {
  return (
    (alert.severity === TamperSeverity.CRITICAL || alert.severity === TamperSeverity.HIGH) &&
    isUnresolvedAlert(alert)
  );
}

/**
 * Calculate alert priority score (0-100)
 */
export function calculateAlertPriority(alert: TamperAlert): number {
  const severityScores: Record<TamperSeverity, number> = {
    [TamperSeverity.CRITICAL]: 40,
    [TamperSeverity.HIGH]: 30,
    [TamperSeverity.MEDIUM]: 20,
    [TamperSeverity.LOW]: 10,
  };

  const statusScores: Record<TamperAlertStatus, number> = {
    [TamperAlertStatus.NEW]: 30,
    [TamperAlertStatus.ESCALATED]: 25,
    [TamperAlertStatus.INVESTIGATING]: 15,
    [TamperAlertStatus.CONFIRMED]: 10,
    [TamperAlertStatus.FALSE_POSITIVE]: 0,
    [TamperAlertStatus.RESOLVED]: 0,
  };

  const incidentBonus = alert.isSecurityIncident ? 30 : 0;

  return severityScores[alert.severity] + statusScores[alert.status] + incidentBonus;
}
