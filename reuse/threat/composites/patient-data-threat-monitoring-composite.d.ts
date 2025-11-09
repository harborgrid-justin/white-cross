/**
 * LOC: PATIENTDATA001
 * File: /reuse/threat/composites/patient-data-threat-monitoring-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../compliance-monitoring-kit
 *   - ../security-audit-trail-kit
 *   - ../security-policy-enforcement-kit
 *   - ../endpoint-threat-detection-kit
 *   - ../cloud-threat-detection-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Patient data security services
 *   - PHI monitoring systems
 *   - Healthcare breach detection platforms
 *   - Electronic health record protection
 *   - Patient privacy compliance modules
 */
import { Sequelize } from 'sequelize';
import { defineComplianceFrameworkModel, defineComplianceControlModel, defineAuditModel, defineComplianceGapModel, defineCertificationModel, calculateFrameworkMaturity, calculateNextTestDate, getControlEffectivenessRate } from '../compliance-monitoring-kit';
import { generateAuditLog, getAuditLogs, searchAuditLogs, updateAuditLogStatus, archiveAuditLogs, exportAuditLogs, purgeAuditLogs, aggregateAuditLogStatistics, trackSecurityEvent, correlateSecurityEvents, resolveSecurityEvent, getSecurityEventSummary, escalateSecurityEvent, generateSecurityEventAlerts, recordAccessAudit, getUserAccessHistory, getResourceAccessHistory, detectUnusualAccessPatterns, generateAccessControlReport, trackPrivilegedAccess, recordDataChange, getEntityChangeHistory, compareEntityVersions, rollbackToVersion, generateChangeTrackingReport, createComplianceAudit, validateComplianceRequirements, generateComplianceAuditReport, mapAuditLogsToCompliance, trackComplianceEvidence, performForensicAnalysis, reconstructEventTimeline, analyzeLogPatterns, generateForensicReport, createLogRetentionPolicy, applyRetentionPolicy, generateAuditReport, scheduleAuditReport, trackChainOfCustody, detectLogTampering } from '../security-audit-trail-kit';
import { validateAgainstPolicy, scheduleAutomatedCheck, validateSecurityBaseline, generateConfigurationHardeningGuide } from '../security-policy-enforcement-kit';
import { collectEndpointTelemetry, monitorEndpointHealth, aggregateEndpointTelemetry, detectTelemetryAnomalies, exportTelemetryData, validateTelemetryData, analyzeProcessBehavior, detectProcessInjection, monitorProcessCreation, detectPrivilegeEscalation, correlateProcesses, generateProcessBehaviorReport, monitorFileIntegrity, detectSuspiciousFileChanges, createFileIntegrityBaseline, compareWithBaseline, generateFileIntegrityReport, monitorRegistryChanges, detectSuspiciousRegistryChanges, monitorRegistryPersistence, detectRegistryPrivilegeEscalation, generateRegistryMonitoringReport, scanEndpointIOCs, scanForFileHash, scanProcessIOCs, scanFileSystemIOCs, enrichEndpointIOCs, executeThreatResponse } from '../endpoint-threat-detection-kit';
import { scanAWSThreats, detectAWSS3Misconfigurations, monitorAWSIAMThreats, detectAWSEC2Threats, monitorAWSLambdaSecurity, scanAzureThreats, detectAzureStorageMisconfigurations, monitorAzureADThreats, detectAzureVMThreats, monitorAzureFunctionsSecurity, scanGCPThreats, detectGCSMisconfigurations, monitorGCPIAMThreats, detectGCEThreats, monitorGCPCloudFunctionsSecurity, detectMultiCloudThreats, monitorCloudAPIActivity, detectAPIRateLimitViolations, detectCloudResourceAbuse, monitorCloudCostAnomalies, assessCloudCompliance, validateHIPAACompliance, generateCloudRemediation, executeCloudRemediation } from '../cloud-threat-detection-kit';
export { defineComplianceFrameworkModel, defineComplianceControlModel, defineAuditModel, defineComplianceGapModel, defineCertificationModel, calculateFrameworkMaturity, calculateNextTestDate, getControlEffectivenessRate, generateAuditLog, getAuditLogs, searchAuditLogs, updateAuditLogStatus, archiveAuditLogs, exportAuditLogs, purgeAuditLogs, aggregateAuditLogStatistics, trackSecurityEvent, correlateSecurityEvents, resolveSecurityEvent, getSecurityEventSummary, escalateSecurityEvent, generateSecurityEventAlerts, recordAccessAudit, getUserAccessHistory, getResourceAccessHistory, detectUnusualAccessPatterns, generateAccessControlReport, trackPrivilegedAccess, recordDataChange, getEntityChangeHistory, compareEntityVersions, rollbackToVersion, generateChangeTrackingReport, createComplianceAudit, validateComplianceRequirements, generateComplianceAuditReport, mapAuditLogsToCompliance, trackComplianceEvidence, performForensicAnalysis, reconstructEventTimeline, analyzeLogPatterns, generateForensicReport, createLogRetentionPolicy, applyRetentionPolicy, generateAuditReport, scheduleAuditReport, trackChainOfCustody, detectLogTampering, validateAgainstPolicy, scheduleAutomatedCheck, validateSecurityBaseline, generateConfigurationHardeningGuide, collectEndpointTelemetry, monitorEndpointHealth, aggregateEndpointTelemetry, detectTelemetryAnomalies, exportTelemetryData, validateTelemetryData, analyzeProcessBehavior, detectProcessInjection, monitorProcessCreation, detectPrivilegeEscalation, correlateProcesses, generateProcessBehaviorReport, monitorFileIntegrity, detectSuspiciousFileChanges, createFileIntegrityBaseline, compareWithBaseline, generateFileIntegrityReport, monitorRegistryChanges, detectSuspiciousRegistryChanges, monitorRegistryPersistence, detectRegistryPrivilegeEscalation, generateRegistryMonitoringReport, scanEndpointIOCs, scanForFileHash, scanProcessIOCs, scanFileSystemIOCs, enrichEndpointIOCs, executeThreatResponse, scanAWSThreats, detectAWSS3Misconfigurations, monitorAWSIAMThreats, detectAWSEC2Threats, monitorAWSLambdaSecurity, scanAzureThreats, detectAzureStorageMisconfigurations, monitorAzureADThreats, detectAzureVMThreats, monitorAzureFunctionsSecurity, scanGCPThreats, detectGCSMisconfigurations, monitorGCPIAMThreats, detectGCEThreats, monitorGCPCloudFunctionsSecurity, detectMultiCloudThreats, monitorCloudAPIActivity, detectAPIRateLimitViolations, detectCloudResourceAbuse, monitorCloudCostAnomalies, assessCloudCompliance, validateHIPAACompliance, generateCloudRemediation, executeCloudRemediation, };
/**
 * Protected Health Information (PHI) data types
 */
export declare enum PHIDataType {
    DEMOGRAPHICS = "DEMOGRAPHICS",// Name, address, DOB, SSN
    MEDICAL_RECORDS = "MEDICAL_RECORDS",// Diagnoses, treatments, medications
    LAB_RESULTS = "LAB_RESULTS",// Laboratory test results
    IMAGING = "IMAGING",// X-rays, MRIs, CT scans
    BILLING = "BILLING",// Insurance, payment information
    PRESCRIPTION = "PRESCRIPTION",// Medication orders
    IMMUNIZATION = "IMMUNIZATION",// Vaccination records
    GENETIC = "GENETIC",// Genetic test results
    MENTAL_HEALTH = "MENTAL_HEALTH",// Mental health records
    SUBSTANCE_ABUSE = "SUBSTANCE_ABUSE"
}
/**
 * PHI access context for minimum necessary standard
 */
export declare enum PHIAccessContext {
    TREATMENT = "TREATMENT",// Direct patient care
    PAYMENT = "PAYMENT",// Billing and insurance
    OPERATIONS = "OPERATIONS",// Healthcare operations
    RESEARCH = "RESEARCH",// Research with authorization
    PUBLIC_HEALTH = "PUBLIC_HEALTH",// Public health reporting
    LEGAL = "LEGAL",// Legal proceedings
    EMERGENCY = "EMERGENCY"
}
/**
 * Data breach notification levels (HIPAA Breach Notification Rule)
 */
export declare enum BreachNotificationLevel {
    NO_BREACH = "NO_BREACH",// No notification required
    INDIVIDUAL_ONLY = "INDIVIDUAL_ONLY",// <500 individuals
    INDIVIDUAL_AND_HHS = "INDIVIDUAL_AND_HHS",// >=500 individuals
    INDIVIDUAL_HHS_MEDIA = "INDIVIDUAL_HHS_MEDIA"
}
/**
 * Patient data encryption status
 */
export declare enum EncryptionStatus {
    ENCRYPTED_AT_REST = "ENCRYPTED_AT_REST",
    ENCRYPTED_IN_TRANSIT = "ENCRYPTED_IN_TRANSIT",
    ENCRYPTED_BOTH = "ENCRYPTED_BOTH",
    NOT_ENCRYPTED = "NOT_ENCRYPTED",
    PARTIALLY_ENCRYPTED = "PARTIALLY_ENCRYPTED"
}
/**
 * PHI access request
 */
export interface PHIAccessRequest {
    id: string;
    requesterId: string;
    requesterRole: string;
    patientId: string;
    phiTypes: PHIDataType[];
    accessContext: PHIAccessContext;
    justification: string;
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    expiresAt?: Date;
    status: 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
    accessLog: PHIAccessLog[];
}
/**
 * PHI access log entry
 */
export interface PHIAccessLog {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    patientId: string;
    patientName?: string;
    phiType: PHIDataType;
    accessContext: PHIAccessContext;
    action: 'read' | 'write' | 'update' | 'delete' | 'export' | 'print';
    ipAddress: string;
    userAgent: string;
    location?: string;
    timestamp: Date;
    duration?: number;
    dataVolume?: number;
    minimumNecessary: boolean;
    authorized: boolean;
    riskScore: number;
    metadata?: Record<string, any>;
}
/**
 * Patient data breach incident
 */
export interface PatientDataBreach {
    id: string;
    breachType: 'unauthorized_access' | 'theft' | 'loss' | 'hacking' | 'improper_disposal' | 'ransomware' | 'data_leak';
    discoveredAt: Date;
    occurredAt?: Date;
    discoveredBy: string;
    affectedPatients: AffectedPatient[];
    totalAffectedIndividuals: number;
    phiTypesCompromised: PHIDataType[];
    breachLocation: 'on-premise' | 'cloud' | 'mobile' | 'third-party' | 'multiple';
    encryptionStatus: EncryptionStatus;
    notificationLevel: BreachNotificationLevel;
    ocrNotificationRequired: boolean;
    ocrNotificationDate?: Date;
    mediaNotificationRequired: boolean;
    riskAssessment: BreachRiskAssessment;
    forensicInvestigation?: ForensicInvestigation;
    mitigationActions: BreachMitigationAction[];
    status: 'detected' | 'investigating' | 'contained' | 'notifying' | 'remediated' | 'closed';
    metadata?: Record<string, any>;
}
/**
 * Affected patient information
 */
export interface AffectedPatient {
    patientId: string;
    phiTypesCompromised: PHIDataType[];
    notificationSent: boolean;
    notificationDate?: Date;
    notificationMethod?: 'mail' | 'email' | 'phone' | 'in-person';
}
/**
 * Breach risk assessment
 */
export interface BreachRiskAssessment {
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskScore: number;
    factors: RiskFactor[];
    probabilityOfHarm: 'low' | 'moderate' | 'high';
    natureAndExtent: string;
    unauthorizedPersons: string;
    wasAcquiredOrViewed: boolean;
    mitigatingFactors: string[];
    assessmentDate: Date;
    assessedBy: string;
}
/**
 * Risk factor for breach assessment
 */
export interface RiskFactor {
    factor: string;
    weight: number;
    description: string;
}
/**
 * Forensic investigation details
 */
export interface ForensicInvestigation {
    investigationId: string;
    investigator: string;
    startDate: Date;
    completionDate?: Date;
    methodology: string[];
    findings: ForensicFinding[];
    evidenceCollected: Evidence[];
    rootCause?: string;
    timeline: TimelineEvent[];
    recommendations: string[];
    status: 'initiated' | 'in_progress' | 'completed' | 'on_hold';
}
/**
 * Forensic finding
 */
export interface ForensicFinding {
    findingId: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    description: string;
    evidence: string[];
    discoveredAt: Date;
}
/**
 * Digital evidence
 */
export interface Evidence {
    evidenceId: string;
    type: 'log' | 'file' | 'network_capture' | 'memory_dump' | 'screenshot' | 'database_record';
    description: string;
    collectedAt: Date;
    collectedBy: string;
    hash: string;
    chainOfCustody: CustodyEvent[];
    location: string;
    size?: number;
}
/**
 * Chain of custody event
 */
export interface CustodyEvent {
    timestamp: Date;
    action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'destroyed';
    person: string;
    notes?: string;
}
/**
 * Timeline event for breach reconstruction
 */
export interface TimelineEvent {
    timestamp: Date;
    event: string;
    source: string;
    confidence: 'confirmed' | 'likely' | 'possible' | 'speculative';
    evidence?: string[];
}
/**
 * Breach mitigation action
 */
export interface BreachMitigationAction {
    actionId: string;
    actionType: 'technical' | 'administrative' | 'physical';
    description: string;
    assignedTo: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
    effectiveness?: 'effective' | 'partially_effective' | 'ineffective' | 'not_evaluated';
    verifiedBy?: string;
    verificationDate?: Date;
}
/**
 * Patient privacy consent
 */
export interface PatientPrivacyConsent {
    id: string;
    patientId: string;
    consentType: 'general' | 'research' | 'marketing' | 'third_party_sharing' | 'sensitive_data';
    granted: boolean;
    scope: string[];
    restrictions?: string[];
    grantedAt?: Date;
    revokedAt?: Date;
    expiresAt?: Date;
    version: string;
    status: 'active' | 'revoked' | 'expired' | 'pending';
}
export declare class CreatePHIAccessRequestDto {
    requesterId: string;
    requesterRole: string;
    patientId: string;
    phiTypes: PHIDataType[];
    accessContext: PHIAccessContext;
    justification: string;
}
export declare class RecordPHIAccessDto {
    userId: string;
    userName: string;
    userRole: string;
    patientId: string;
    phiType: PHIDataType;
    accessContext: PHIAccessContext;
    action: 'read' | 'write' | 'update' | 'delete' | 'export' | 'print';
    ipAddress: string;
    minimumNecessary: boolean;
}
export declare class ReportBreachDto {
    breachType: 'unauthorized_access' | 'theft' | 'loss' | 'hacking' | 'improper_disposal' | 'ransomware' | 'data_leak';
    discoveredAt: Date;
    discoveredBy: string;
    totalAffectedIndividuals: number;
    phiTypesCompromised: PHIDataType[];
    breachLocation: 'on-premise' | 'cloud' | 'mobile' | 'third-party' | 'multiple';
    encryptionStatus: EncryptionStatus;
}
export declare class UpdatePatientConsentDto {
    patientId: string;
    consentType: 'general' | 'research' | 'marketing' | 'third_party_sharing' | 'sensitive_data';
    granted: boolean;
    scope: string[];
    restrictions?: string[];
}
export declare class PatientDataThreatMonitoringController {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Monitor PHI access patterns in real-time
     */
    monitorPHIAccessPatterns(patientId?: string, userId?: string, startDate?: Date, endDate?: Date): Promise<{
        totalAccesses: number;
        authorizedAccesses: number;
        unauthorizedAttempts: number;
        unusualPatterns: number;
        highRiskAccesses: number;
        accessLogs: PHIAccessLog[];
        alerts: any[];
    }>;
    /**
     * Record PHI access with audit trail
     */
    recordPHIAccess(accessDto: RecordPHIAccessDto): Promise<PHIAccessLog>;
    /**
     * Detect unauthorized PHI access attempts
     */
    detectUnauthorizedPHIAccess(hours?: number, severity?: string): Promise<{
        totalUnauthorizedAttempts: number;
        criticalAttempts: number;
        blockedAttempts: number;
        attempts: any[];
        affectedPatients: string[];
        recommendations: string[];
    }>;
    /**
     * Report and investigate patient data breach
     */
    reportPatientDataBreach(breachDto: ReportBreachDto): Promise<PatientDataBreach>;
    /**
     * Perform comprehensive forensic analysis of security incident
     */
    performComprehensiveForensicAnalysis(incidentId: string): Promise<ForensicInvestigation>;
    /**
     * Validate patient data encryption compliance
     */
    validatePatientDataEncryption(dataType?: PHIDataType, location?: string): Promise<{
        totalDataSets: number;
        encryptedAtRest: number;
        encryptedInTransit: number;
        fullyEncrypted: number;
        notEncrypted: number;
        complianceScore: number;
        violations: any[];
        recommendations: string[];
    }>;
    /**
     * Manage patient privacy consent
     */
    managePatientConsent(consentDto: UpdatePatientConsentDto): Promise<PatientPrivacyConsent>;
    /**
     * Generate comprehensive patient data security report
     */
    generateComprehensiveSecurityReport(startDate?: Date, endDate?: Date): Promise<{
        reportId: string;
        generatedAt: Date;
        period: {
            start: Date;
            end: Date;
        };
        phiAccessMetrics: any;
        breachMetrics: any;
        encryptionCompliance: any;
        auditMetrics: any;
        complianceScore: number;
        riskScore: number;
        recommendations: string[];
    }>;
    /**
     * Detect and prevent data leakage
     */
    detectDataLeakage(scope?: string): Promise<{
        potentialLeaks: number;
        criticalFindings: number;
        findings: any[];
        affectedResources: string[];
        recommendations: string[];
    }>;
}
export declare class PatientDataThreatMonitoringService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Continuous monitoring of patient data security
     */
    monitorPatientDataSecurity(): Promise<any>;
    /**
     * Monitor PHI access in real-time
     */
    private monitorPHIAccess;
    /**
     * Detect potential data breaches
     */
    private detectBreaches;
    /**
     * Validate encryption compliance
     */
    private validateEncryption;
    /**
     * Track compliance status
     */
    private trackCompliance;
}
/**
 * Export NestJS module definition
 */
export declare const PatientDataThreatMonitoringModule: {
    controllers: (typeof PatientDataThreatMonitoringController)[];
    providers: (typeof PatientDataThreatMonitoringService)[];
    exports: (typeof PatientDataThreatMonitoringService)[];
};
//# sourceMappingURL=patient-data-threat-monitoring-composite.d.ts.map