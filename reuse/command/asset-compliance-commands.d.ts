/**
 * ASSET COMPLIANCE MANAGEMENT COMMANDS
 *
 * Comprehensive regulatory compliance and certification tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Regulatory compliance tracking and management
 * - Certification management and renewals
 * - Audit trail generation and management
 * - Compliance reporting and dashboards
 * - Safety inspections and OSHA compliance
 * - Environmental compliance tracking
 * - Industry standards validation (ISO, FDA, CE, UL, etc.)
 * - Non-compliance workflow management
 * - Compliance documentation management
 * - Regulatory requirement tracking
 * - Compliance risk assessment
 * - Third-party audit management
 * - Compliance training tracking
 * - Violation and remediation tracking
 *
 * @module AssetComplianceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @compliance OSHA, FDA, ISO, CE, HIPAA, SOX, EPA standards supported
 * @audit Complete audit trail for all compliance activities
 *
 * @example
 * ```typescript
 * import {
 *   trackCompliance,
 *   createCertification,
 *   conductSafetyInspection,
 *   generateAuditTrail,
 *   ComplianceRecord,
 *   Certification
 * } from './asset-compliance-commands';
 *
 * // Track compliance
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910',
 *   status: 'compliant'
 * });
 *
 * // Create certification
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Compliance framework types
 */
export declare enum ComplianceFramework {
    OSHA = "osha",
    FDA = "fda",
    ISO_9001 = "iso_9001",
    ISO_14001 = "iso_14001",
    ISO_45001 = "iso_45001",
    ISO_27001 = "iso_27001",
    HIPAA = "hipaa",
    SOX = "sox",
    GDPR = "gdpr",
    EPA = "epa",
    CE = "ce",
    UL = "ul",
    ANSI = "ansi",
    NFPA = "nfpa",
    ASME = "asme",
    CUSTOM = "custom"
}
/**
 * Compliance status
 */
export declare enum ComplianceStatus {
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    PARTIALLY_COMPLIANT = "partially_compliant",
    PENDING_REVIEW = "pending_review",
    NOT_APPLICABLE = "not_applicable",
    WAIVED = "waived"
}
/**
 * Certification type
 */
export declare enum CertificationType {
    ISO_9001 = "iso_9001",
    ISO_14001 = "iso_14001",
    ISO_45001 = "iso_45001",
    ISO_27001 = "iso_27001",
    FDA_APPROVAL = "fda_approval",
    CE_MARK = "ce_mark",
    UL_LISTED = "ul_listed",
    ENERGY_STAR = "energy_star",
    LEED = "leed",
    CALIBRATION = "calibration",
    SAFETY_INSPECTION = "safety_inspection",
    ENVIRONMENTAL = "environmental",
    CUSTOM = "custom"
}
/**
 * Certification status
 */
export declare enum CertificationStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    PENDING_RENEWAL = "pending_renewal",
    SUSPENDED = "suspended",
    REVOKED = "revoked",
    NOT_REQUIRED = "not_required"
}
/**
 * Inspection type
 */
export declare enum InspectionType {
    SAFETY = "safety",
    ENVIRONMENTAL = "environmental",
    QUALITY = "quality",
    REGULATORY = "regulatory",
    PREVENTIVE = "preventive",
    INCIDENT_RESPONSE = "incident_response",
    THIRD_PARTY = "third_party",
    INTERNAL = "internal"
}
/**
 * Inspection status
 */
export declare enum InspectionStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PASSED = "passed",
    FAILED = "failed",
    CONDITIONAL_PASS = "conditional_pass",
    CANCELLED = "cancelled"
}
/**
 * Violation severity
 */
export declare enum ViolationSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    MINOR = "minor"
}
/**
 * Remediation status
 */
export declare enum RemediationStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    VERIFIED = "verified",
    CLOSED = "closed",
    ESCALATED = "escalated"
}
/**
 * Compliance record data
 */
export interface ComplianceRecordData {
    assetId: string;
    frameworkType: ComplianceFramework;
    requirementId: string;
    requirementDescription: string;
    status: ComplianceStatus;
    assessmentDate: Date;
    assessedBy: string;
    nextAssessmentDate?: Date;
    evidenceUrls?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Certification data
 */
export interface CertificationData {
    assetId: string;
    certificationType: CertificationType;
    certificationNumber?: string;
    issuingAuthority: string;
    issueDate: Date;
    expirationDate?: Date;
    scope?: string;
    documentUrls?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Inspection data
 */
export interface InspectionData {
    assetId: string;
    inspectionType: InspectionType;
    scheduledDate: Date;
    inspectorId?: string;
    inspectorName?: string;
    scope?: string;
    checklistId?: string;
    notes?: string;
}
/**
 * Inspection result data
 */
export interface InspectionResultData {
    inspectionId: string;
    status: InspectionStatus;
    completedDate: Date;
    findings: InspectionFinding[];
    overallScore?: number;
    passFailCriteria?: string;
    recommendations?: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    reportUrl?: string;
}
/**
 * Inspection finding
 */
export interface InspectionFinding {
    findingId: string;
    category: string;
    description: string;
    severity: ViolationSeverity;
    location?: string;
    photoUrls?: string[];
    requiresAction: boolean;
    actionRequired?: string;
    dueDate?: Date;
}
/**
 * Violation record data
 */
export interface ViolationRecordData {
    assetId: string;
    violationType: string;
    frameworkType: ComplianceFramework;
    severity: ViolationSeverity;
    description: string;
    discoveredDate: Date;
    discoveredBy: string;
    inspectionId?: string;
    evidenceUrls?: string[];
    potentialFine?: number;
    notes?: string;
}
/**
 * Remediation action data
 */
export interface RemediationActionData {
    violationId: string;
    actionDescription: string;
    assignedTo: string;
    dueDate: Date;
    estimatedCost?: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    notes?: string;
}
/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
    timestamp: Date;
    userId: string;
    userName?: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Compliance dashboard data
 */
export interface ComplianceDashboardData {
    assetId: string;
    overallComplianceRate: number;
    complianceByFramework: Record<ComplianceFramework, number>;
    activeCertifications: number;
    expiringCertifications: number;
    openViolations: number;
    criticalViolations: number;
    upcomingInspections: number;
    pastDueActions: number;
    recentAudits: AuditTrailEntry[];
}
/**
 * Compliance record database model
 */
export declare class ComplianceRecord extends Model {
    id: string;
    assetId: string;
    frameworkType: ComplianceFramework;
    requirementId: string;
    requirementDescription: string;
    status: ComplianceStatus;
    assessmentDate: Date;
    assessedBy: string;
    nextAssessmentDate: Date;
    evidenceUrls: string[];
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Certification database model
 */
export declare class Certification extends Model {
    id: string;
    assetId: string;
    certificationType: CertificationType;
    certificationNumber: string;
    issuingAuthority: string;
    issueDate: Date;
    expirationDate: Date;
    status: CertificationStatus;
    scope: string;
    documentUrls: string[];
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Inspection database model
 */
export declare class Inspection extends Model {
    id: string;
    assetId: string;
    inspectionType: InspectionType;
    scheduledDate: Date;
    completedDate: Date;
    inspectorId: string;
    inspectorName: string;
    status: InspectionStatus;
    scope: string;
    checklistId: string;
    findings: InspectionFinding[];
    overallScore: number;
    passFailCriteria: string;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate: Date;
    reportUrl: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Violation record database model
 */
export declare class ViolationRecord extends Model {
    id: string;
    assetId: string;
    violationType: string;
    frameworkType: ComplianceFramework;
    severity: ViolationSeverity;
    description: string;
    discoveredDate: Date;
    discoveredBy: string;
    inspectionId: string;
    inspection: Inspection;
    evidenceUrls: string[];
    potentialFine: number;
    remediationStatus: RemediationStatus;
    notes: string;
    remediationActions: RemediationAction[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Remediation action database model
 */
export declare class RemediationAction extends Model {
    id: string;
    violationId: string;
    violation: ViolationRecord;
    actionDescription: string;
    assignedTo: string;
    dueDate: Date;
    completedDate: Date;
    estimatedCost: number;
    actualCost: number;
    priority: string;
    status: RemediationStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Audit trail database model
 */
export declare class ComplianceAuditTrail extends Model {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Create compliance record DTO
 */
export declare class CreateComplianceRecordDto {
    assetId: string;
    frameworkType: ComplianceFramework;
    requirementId: string;
    requirementDescription: string;
    status: ComplianceStatus;
    assessmentDate: Date;
    assessedBy: string;
    nextAssessmentDate?: Date;
    evidenceUrls?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Create certification DTO
 */
export declare class CreateCertificationDto {
    assetId: string;
    certificationType: CertificationType;
    certificationNumber?: string;
    issuingAuthority: string;
    issueDate: Date;
    expirationDate?: Date;
    scope?: string;
    documentUrls?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Create inspection DTO
 */
export declare class CreateInspectionDto {
    assetId: string;
    inspectionType: InspectionType;
    scheduledDate: Date;
    inspectorId?: string;
    inspectorName?: string;
    scope?: string;
    checklistId?: string;
    notes?: string;
}
/**
 * Create violation record DTO
 */
export declare class CreateViolationRecordDto {
    assetId: string;
    violationType: string;
    frameworkType: ComplianceFramework;
    severity: ViolationSeverity;
    description: string;
    discoveredDate: Date;
    discoveredBy: string;
    inspectionId?: string;
    evidenceUrls?: string[];
    potentialFine?: number;
    notes?: string;
}
/**
 * Track compliance for an asset
 *
 * @param data - Compliance record data
 * @param transaction - Optional database transaction
 * @returns Created compliance record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910.147',
 *   requirementDescription: 'Lockout/Tagout procedures',
 *   status: 'compliant',
 *   assessmentDate: new Date(),
 *   assessedBy: 'user-001'
 * });
 * ```
 */
export declare function trackCompliance(data: ComplianceRecordData, transaction?: Transaction): Promise<ComplianceRecord>;
/**
 * Get compliance record by ID
 *
 * @param id - Compliance record ID
 * @returns Compliance record or null
 *
 * @example
 * ```typescript
 * const record = await getComplianceRecordById('compliance-001');
 * ```
 */
export declare function getComplianceRecordById(id: string): Promise<ComplianceRecord | null>;
/**
 * Get compliance records for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @param status - Optional status filter
 * @returns Array of compliance records
 *
 * @example
 * ```typescript
 * const records = await getAssetComplianceRecords('asset-001', 'osha');
 * ```
 */
export declare function getAssetComplianceRecords(assetId: string, frameworkType?: ComplianceFramework, status?: ComplianceStatus): Promise<ComplianceRecord[]>;
/**
 * Update compliance status
 *
 * @param id - Compliance record ID
 * @param status - New status
 * @param userId - User making the update
 * @param notes - Optional update notes
 * @param transaction - Optional database transaction
 * @returns Updated compliance record
 * @throws NotFoundException if record not found
 *
 * @example
 * ```typescript
 * const updated = await updateComplianceStatus(
 *   'compliance-001',
 *   'compliant',
 *   'user-001',
 *   'Verified compliance'
 * );
 * ```
 */
export declare function updateComplianceStatus(id: string, status: ComplianceStatus, userId: string, notes?: string, transaction?: Transaction): Promise<ComplianceRecord>;
/**
 * Calculate compliance rate for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @returns Compliance rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateComplianceRate('asset-001');
 * ```
 */
export declare function calculateComplianceRate(assetId: string, frameworkType?: ComplianceFramework): Promise<number>;
/**
 * Create a certification
 *
 * @param data - Certification data
 * @param transaction - Optional database transaction
 * @returns Created certification
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issuingAuthority: 'ISO Certification Body',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
export declare function createCertification(data: CertificationData, transaction?: Transaction): Promise<Certification>;
/**
 * Get certification by ID
 *
 * @param id - Certification ID
 * @returns Certification or null
 *
 * @example
 * ```typescript
 * const cert = await getCertificationById('cert-001');
 * ```
 */
export declare function getCertificationById(id: string): Promise<Certification | null>;
/**
 * Get certifications for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of certifications
 *
 * @example
 * ```typescript
 * const certs = await getAssetCertifications('asset-001', 'active');
 * ```
 */
export declare function getAssetCertifications(assetId: string, status?: CertificationStatus): Promise<Certification[]>;
/**
 * Get expiring certifications
 *
 * @param daysUntilExpiration - Number of days to look ahead
 * @returns Array of expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCertifications(30);
 * ```
 */
export declare function getExpiringCertifications(daysUntilExpiration?: number): Promise<Certification[]>;
/**
 * Renew a certification
 *
 * @param id - Certification ID
 * @param newExpirationDate - New expiration date
 * @param userId - User performing the renewal
 * @param transaction - Optional database transaction
 * @returns Updated certification
 * @throws NotFoundException if certification not found
 *
 * @example
 * ```typescript
 * const renewed = await renewCertification(
 *   'cert-001',
 *   new Date('2026-12-31'),
 *   'user-001'
 * );
 * ```
 */
export declare function renewCertification(id: string, newExpirationDate: Date, userId: string, transaction?: Transaction): Promise<Certification>;
/**
 * Update certification statuses based on expiration dates
 *
 * @param transaction - Optional database transaction
 * @returns Number of certifications updated
 *
 * @example
 * ```typescript
 * const updated = await updateCertificationStatuses();
 * ```
 */
export declare function updateCertificationStatuses(transaction?: Transaction): Promise<number>;
/**
 * Schedule an inspection
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   assetId: 'asset-001',
 *   inspectionType: 'safety',
 *   scheduledDate: new Date('2024-12-01'),
 *   inspectorId: 'user-001'
 * });
 * ```
 */
export declare function scheduleInspection(data: InspectionData, transaction?: Transaction): Promise<Inspection>;
/**
 * Get inspection by ID
 *
 * @param id - Inspection ID
 * @returns Inspection or null
 *
 * @example
 * ```typescript
 * const inspection = await getInspectionById('inspection-001');
 * ```
 */
export declare function getInspectionById(id: string): Promise<Inspection | null>;
/**
 * Get inspections for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of inspections
 *
 * @example
 * ```typescript
 * const inspections = await getAssetInspections('asset-001');
 * ```
 */
export declare function getAssetInspections(assetId: string, status?: InspectionStatus): Promise<Inspection[]>;
/**
 * Complete an inspection with results
 *
 * @param id - Inspection ID
 * @param resultData - Inspection result data
 * @param userId - User completing the inspection
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 * @throws NotFoundException if inspection not found
 *
 * @example
 * ```typescript
 * const completed = await completeInspection(
 *   'inspection-001',
 *   {
 *     status: 'passed',
 *     completedDate: new Date(),
 *     findings: [],
 *     followUpRequired: false
 *   },
 *   'user-001'
 * );
 * ```
 */
export declare function completeInspection(id: string, resultData: InspectionResultData, userId: string, transaction?: Transaction): Promise<Inspection>;
/**
 * Conduct a safety inspection
 *
 * @param assetId - Asset ID
 * @param inspectorId - Inspector user ID
 * @param checklistId - Checklist ID to use
 * @param transaction - Optional database transaction
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await conductSafetyInspection(
 *   'asset-001',
 *   'user-001',
 *   'checklist-001'
 * );
 * ```
 */
export declare function conductSafetyInspection(assetId: string, inspectorId: string, checklistId: string, transaction?: Transaction): Promise<Inspection>;
/**
 * Record a compliance violation
 *
 * @param data - Violation record data
 * @param transaction - Optional database transaction
 * @returns Created violation record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const violation = await recordViolation({
 *   assetId: 'asset-001',
 *   violationType: 'Safety Hazard',
 *   frameworkType: 'osha',
 *   severity: 'high',
 *   description: 'Missing safety guard',
 *   discoveredDate: new Date(),
 *   discoveredBy: 'user-001'
 * });
 * ```
 */
export declare function recordViolation(data: ViolationRecordData, transaction?: Transaction): Promise<ViolationRecord>;
/**
 * Get violations for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @param status - Optional remediation status filter
 * @returns Array of violation records
 *
 * @example
 * ```typescript
 * const violations = await getAssetViolations('asset-001', 'critical');
 * ```
 */
export declare function getAssetViolations(assetId: string, severity?: ViolationSeverity, status?: RemediationStatus): Promise<ViolationRecord[]>;
/**
 * Create a remediation action for a violation
 *
 * @param data - Remediation action data
 * @param transaction - Optional database transaction
 * @returns Created remediation action
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const action = await createRemediationAction({
 *   violationId: 'violation-001',
 *   actionDescription: 'Install safety guard',
 *   assignedTo: 'user-002',
 *   dueDate: new Date('2024-12-15'),
 *   priority: 'high'
 * });
 * ```
 */
export declare function createRemediationAction(data: RemediationActionData, transaction?: Transaction): Promise<RemediationAction>;
/**
 * Complete a remediation action
 *
 * @param id - Remediation action ID
 * @param actualCost - Actual cost incurred
 * @param userId - User completing the action
 * @param transaction - Optional database transaction
 * @returns Updated remediation action
 * @throws NotFoundException if action not found
 *
 * @example
 * ```typescript
 * const completed = await completeRemediationAction(
 *   'action-001',
 *   1200,
 *   'user-002'
 * );
 * ```
 */
export declare function completeRemediationAction(id: string, actualCost: number, userId: string, transaction?: Transaction): Promise<RemediationAction>;
/**
 * Create an audit trail entry
 *
 * @param userId - User ID
 * @param action - Action performed
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param changes - Changes made
 * @param transaction - Optional database transaction
 * @returns Created audit trail entry
 *
 * @example
 * ```typescript
 * await createAuditTrailEntry(
 *   'user-001',
 *   'update_compliance_status',
 *   'compliance_record',
 *   'compliance-001',
 *   { oldStatus: 'pending', newStatus: 'compliant' }
 * );
 * ```
 */
export declare function createAuditTrailEntry(userId: string, action: string, entityType: string, entityId: string, changes?: Record<string, any>, transaction?: Transaction): Promise<ComplianceAuditTrail>;
/**
 * Get audit trail for an entity
 *
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param limit - Maximum number of entries
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await getAuditTrail('compliance_record', 'compliance-001');
 * ```
 */
export declare function getAuditTrail(entityType: string, entityId: string, limit?: number): Promise<ComplianceAuditTrail[]>;
/**
 * Generate comprehensive audit trail for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await generateAuditTrail('asset-001');
 * ```
 */
export declare function generateAuditTrail(assetId: string, startDate?: Date, endDate?: Date): Promise<ComplianceAuditTrail[]>;
/**
 * Get compliance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @returns Compliance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getComplianceDashboard('asset-001');
 * ```
 */
export declare function getComplianceDashboard(assetId: string): Promise<ComplianceDashboardData>;
/**
 * Generate compliance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param frameworkType - Optional framework filter
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(['asset-001', 'asset-002'], 'osha');
 * ```
 */
export declare function generateComplianceReport(assetIds: string[], frameworkType?: ComplianceFramework): Promise<Record<string, any>>;
declare const _default: {
    trackCompliance: typeof trackCompliance;
    getComplianceRecordById: typeof getComplianceRecordById;
    getAssetComplianceRecords: typeof getAssetComplianceRecords;
    updateComplianceStatus: typeof updateComplianceStatus;
    calculateComplianceRate: typeof calculateComplianceRate;
    createCertification: typeof createCertification;
    getCertificationById: typeof getCertificationById;
    getAssetCertifications: typeof getAssetCertifications;
    getExpiringCertifications: typeof getExpiringCertifications;
    renewCertification: typeof renewCertification;
    updateCertificationStatuses: typeof updateCertificationStatuses;
    scheduleInspection: typeof scheduleInspection;
    getInspectionById: typeof getInspectionById;
    getAssetInspections: typeof getAssetInspections;
    completeInspection: typeof completeInspection;
    conductSafetyInspection: typeof conductSafetyInspection;
    recordViolation: typeof recordViolation;
    getAssetViolations: typeof getAssetViolations;
    createRemediationAction: typeof createRemediationAction;
    completeRemediationAction: typeof completeRemediationAction;
    createAuditTrailEntry: typeof createAuditTrailEntry;
    getAuditTrail: typeof getAuditTrail;
    generateAuditTrail: typeof generateAuditTrail;
    getComplianceDashboard: typeof getComplianceDashboard;
    generateComplianceReport: typeof generateComplianceReport;
    ComplianceRecord: typeof ComplianceRecord;
    Certification: typeof Certification;
    Inspection: typeof Inspection;
    ViolationRecord: typeof ViolationRecord;
    RemediationAction: typeof RemediationAction;
    ComplianceAuditTrail: typeof ComplianceAuditTrail;
    CreateComplianceRecordDto: typeof CreateComplianceRecordDto;
    CreateCertificationDto: typeof CreateCertificationDto;
    CreateInspectionDto: typeof CreateInspectionDto;
    CreateViolationRecordDto: typeof CreateViolationRecordDto;
    ComplianceFramework: typeof ComplianceFramework;
    ComplianceStatus: typeof ComplianceStatus;
    CertificationType: typeof CertificationType;
    CertificationStatus: typeof CertificationStatus;
    InspectionType: typeof InspectionType;
    InspectionStatus: typeof InspectionStatus;
    ViolationSeverity: typeof ViolationSeverity;
    RemediationStatus: typeof RemediationStatus;
};
export default _default;
//# sourceMappingURL=asset-compliance-commands.d.ts.map