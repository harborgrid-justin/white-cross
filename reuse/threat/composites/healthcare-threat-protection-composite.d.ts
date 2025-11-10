/**
 * LOC: HEALTHTHREAT001
 * File: /reuse/threat/composites/healthcare-threat-protection-composite.ts
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
 *   - Healthcare security operations
 *   - HIPAA compliance monitoring
 *   - Medical device security services
 *   - Healthcare threat intelligence platforms
 *   - Clinical system protection modules
 */
import { Sequelize } from 'sequelize';
import { defineComplianceFrameworkModel, defineComplianceControlModel, defineAuditModel, defineComplianceGapModel, defineCertificationModel, calculateFrameworkMaturity, calculateNextTestDate, getControlEffectivenessRate } from '../compliance-monitoring-kit';
import { generateAuditLog, getAuditLogs, searchAuditLogs, trackSecurityEvent, correlateSecurityEvents, recordAccessAudit, getUserAccessHistory, getResourceAccessHistory, detectUnusualAccessPatterns, trackPrivilegedAccess, recordDataChange, getEntityChangeHistory, createComplianceAudit, validateComplianceRequirements, generateComplianceAuditReport, mapAuditLogsToCompliance, trackComplianceEvidence, performForensicAnalysis } from '../security-audit-trail-kit';
import { validateAgainstPolicy, scheduleAutomatedCheck, validateSecurityBaseline, generateConfigurationHardeningGuide } from '../security-policy-enforcement-kit';
import { collectEndpointTelemetry, monitorEndpointHealth, detectTelemetryAnomalies, analyzeProcessBehavior, detectProcessInjection, monitorProcessCreation, monitorFileIntegrity, detectSuspiciousFileChanges, scanEndpointIOCs, executeThreatResponse, quarantineFile, isolateEndpoint } from '../endpoint-threat-detection-kit';
import { scanAWSThreats, detectAWSS3Misconfigurations, monitorAWSIAMThreats, scanAzureThreats, detectAzureStorageMisconfigurations, monitorAzureADThreats, scanGCPThreats, detectGCSMisconfigurations, monitorGCPIAMThreats, detectMultiCloudThreats, assessCloudCompliance, validateHIPAACompliance, generateCloudRemediation, executeCloudRemediation } from '../cloud-threat-detection-kit';
export { defineComplianceFrameworkModel, defineComplianceControlModel, defineAuditModel, defineComplianceGapModel, defineCertificationModel, calculateFrameworkMaturity, calculateNextTestDate, getControlEffectivenessRate, generateAuditLog, getAuditLogs, searchAuditLogs, trackSecurityEvent, correlateSecurityEvents, recordAccessAudit, getUserAccessHistory, getResourceAccessHistory, detectUnusualAccessPatterns, trackPrivilegedAccess, recordDataChange, getEntityChangeHistory, createComplianceAudit, validateComplianceRequirements, generateComplianceAuditReport, mapAuditLogsToCompliance, trackComplianceEvidence, performForensicAnalysis, validateAgainstPolicy, scheduleAutomatedCheck, validateSecurityBaseline, generateConfigurationHardeningGuide, collectEndpointTelemetry, monitorEndpointHealth, detectTelemetryAnomalies, analyzeProcessBehavior, detectProcessInjection, monitorProcessCreation, monitorFileIntegrity, detectSuspiciousFileChanges, scanEndpointIOCs, executeThreatResponse, quarantineFile, isolateEndpoint, scanAWSThreats, detectAWSS3Misconfigurations, monitorAWSIAMThreats, scanAzureThreats, detectAzureStorageMisconfigurations, monitorAzureADThreats, scanGCPThreats, detectGCSMisconfigurations, monitorGCPIAMThreats, detectMultiCloudThreats, assessCloudCompliance, validateHIPAACompliance, generateCloudRemediation, executeCloudRemediation, };
/**
 * Medical device security classification
 */
export declare enum MedicalDeviceClass {
    CLASS_I = "CLASS_I",// Low risk (e.g., tongue depressors)
    CLASS_II = "CLASS_II",// Moderate risk (e.g., infusion pumps)
    CLASS_III = "CLASS_III",// High risk (e.g., pacemakers)
    IVD = "IVD"
}
/**
 * Healthcare threat severity aligned with HIPAA risk levels
 */
export declare enum HealthcareThreatSeverity {
    CRITICAL = "CRITICAL",// Immediate threat to patient safety or PHI
    HIGH = "HIGH",// Significant risk to PHI or operations
    MEDIUM = "MEDIUM",// Moderate compliance or security risk
    LOW = "LOW",// Minor issues requiring attention
    INFO = "INFO"
}
/**
 * HIPAA compliance status
 */
export declare enum HIPAAComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    PARTIAL = "PARTIAL",
    PENDING_REVIEW = "PENDING_REVIEW",
    REMEDIATION_IN_PROGRESS = "REMEDIATION_IN_PROGRESS"
}
/**
 * Medical device threat types
 */
export declare enum MedicalDeviceThreatType {
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    FIRMWARE_TAMPERING = "FIRMWARE_TAMPERING",
    NETWORK_INTRUSION = "NETWORK_INTRUSION",
    DOSAGE_MANIPULATION = "DOSAGE_MANIPULATION",
    DATA_INTERCEPTION = "DATA_INTERCEPTION",
    DENIAL_OF_SERVICE = "DENIAL_OF_SERVICE",
    MALWARE_INFECTION = "MALWARE_INFECTION",
    CONFIGURATION_DRIFT = "CONFIGURATION_DRIFT"
}
/**
 * Clinical system types
 */
export declare enum ClinicalSystemType {
    EHR = "EHR",// Electronic Health Record
    EMR = "EMR",// Electronic Medical Record
    PACS = "PACS",// Picture Archiving and Communication System
    LIS = "LIS",// Laboratory Information System
    RIS = "RIS",// Radiology Information System
    PHARMACY = "PHARMACY",
    BILLING = "BILLING",
    TELEHEALTH = "TELEHEALTH"
}
/**
 * Medical device security profile
 */
export interface MedicalDeviceProfile {
    id: string;
    deviceName: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceClass: MedicalDeviceClass;
    fdaApprovalNumber?: string;
    ipAddress: string;
    macAddress: string;
    firmwareVersion: string;
    location: string;
    lastSecurityAssessment?: Date;
    knownVulnerabilities: string[];
    securityPatches: SecurityPatch[];
    complianceStatus: HIPAAComplianceStatus;
    riskScore: number;
    metadata?: Record<string, any>;
}
/**
 * Security patch information
 */
export interface SecurityPatch {
    patchId: string;
    description: string;
    severity: HealthcareThreatSeverity;
    releaseDate: Date;
    installDate?: Date;
    status: 'pending' | 'installed' | 'failed' | 'not_applicable';
}
/**
 * HIPAA breach incident
 */
export interface HIPAABreachIncident {
    id: string;
    incidentType: 'unauthorized_access' | 'theft' | 'loss' | 'hacking' | 'improper_disposal' | 'other';
    discoveredAt: Date;
    occurredAt?: Date;
    affectedIndividuals: number;
    affectedPHITypes: string[];
    breachLocation: string;
    reportedToOCR: boolean;
    ocrReportDate?: Date;
    notificationsSent: boolean;
    notificationDate?: Date;
    mitigationActions: MitigationAction[];
    rootCause?: string;
    status: 'investigating' | 'contained' | 'remediated' | 'closed';
    metadata?: Record<string, any>;
}
/**
 * Mitigation action for breach incidents
 */
export interface MitigationAction {
    actionId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    effectiveness?: 'effective' | 'partially_effective' | 'ineffective';
}
/**
 * Clinical system security assessment
 */
export interface ClinicalSystemAssessment {
    id: string;
    systemType: ClinicalSystemType;
    systemName: string;
    vendor: string;
    version: string;
    assessmentDate: Date;
    assessor: string;
    securityControls: SecurityControl[];
    vulnerabilities: Vulnerability[];
    complianceScore: number;
    hipaaCompliance: HIPAAComplianceStatus;
    recommendations: string[];
    nextAssessmentDate: Date;
}
/**
 * Security control implementation
 */
export interface SecurityControl {
    controlId: string;
    controlName: string;
    category: string;
    implemented: boolean;
    effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_tested';
    evidence?: string[];
    lastTested?: Date;
}
/**
 * Vulnerability information
 */
export interface Vulnerability {
    vulnerabilityId: string;
    cveId?: string;
    description: string;
    severity: HealthcareThreatSeverity;
    cvssScore?: number;
    exploitAvailable: boolean;
    patchAvailable: boolean;
    remediation?: string;
    discoveredDate: Date;
    remediationDate?: Date;
    status: 'open' | 'in_progress' | 'remediated' | 'accepted_risk';
}
export declare class CreateMedicalDeviceDto {
    deviceName: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceClass: MedicalDeviceClass;
    fdaApprovalNumber?: string;
    ipAddress: string;
    macAddress: string;
    firmwareVersion: string;
    location: string;
}
export declare class CreateBreachIncidentDto {
    incidentType: 'unauthorized_access' | 'theft' | 'loss' | 'hacking' | 'improper_disposal' | 'other';
    discoveredAt: Date;
    affectedIndividuals: number;
    affectedPHITypes: string[];
    breachLocation: string;
    rootCause?: string;
}
export declare class ClinicalSystemAssessmentDto {
    systemType: ClinicalSystemType;
    systemName: string;
    vendor: string;
    version: string;
    assessor: string;
}
export declare class HealthcareThreatProtectionController {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Monitor medical device security across all connected devices
     */
    getMedicalDeviceSecurityStatus(location?: string, deviceClass?: MedicalDeviceClass, riskThreshold?: number): Promise<{
        totalDevices: number;
        compliantDevices: number;
        nonCompliantDevices: number;
        criticalAlerts: number;
        devices: MedicalDeviceProfile[];
    }>;
    /**
     * Perform comprehensive HIPAA compliance assessment
     */
    performHIPAACompliance: any;
    Assessment(): Promise<{
        complianceScore: number;
        status: HIPAAComplianceStatus;
        frameworks: any[];
        controls: any[];
        gaps: any[];
        recommendations: string[];
    }>;
    /**
     * Monitor PHI access patterns and detect anomalies
     */
    monitorPHIAccess(userId?: string, resourceId?: string, startDate?: Date, endDate?: Date): Promise<{
        totalAccesses: number;
        unusualPatterns: number;
        privilegedAccesses: number;
        violations: number;
        accessHistory: any[];
        anomalies: any[];
    }>;
    /**
     * Create and track HIPAA breach incident
     */
    createBreachIncident(createDto: CreateBreachIncidentDto): Promise<HIPAABreachIncident>;
    /**
     * Assess clinical system security posture
     */
    assessClinicalSystem(assessmentDto: ClinicalSystemAssessmentDto): Promise<ClinicalSystemAssessment>;
    /**
     * Detect medical device threats in real-time
     */
    detectMedicalDeviceThreats(deviceId?: string, severity?: HealthcareThreatSeverity): Promise<{
        activeThreats: number;
        criticalThreats: number;
        threats: any[];
        recommendations: string[];
    }>;
    /**
     * Execute automated threat response for healthcare systems
     */
    executeThreatResponseAction(threatId: string, responseAction: {
        action: 'isolate' | 'quarantine' | 'block' | 'alert' | 'remediate';
        targetId: string;
        justification: string;
    }): Promise<{
        success: boolean;
        action: string;
        timestamp: Date;
        details: any;
    }>;
    /**
     * Generate comprehensive healthcare security report
     */
    generateSecurityPostureReport(startDate?: Date, endDate?: Date): Promise<{
        reportId: string;
        generatedAt: Date;
        period: {
            start: Date;
            end: Date;
        };
        hipaaCompliance: any;
        medicalDeviceSecurity: any;
        phiAccess: any;
        incidents: any;
        recommendations: string[];
    }>;
}
export declare class HealthcareThreatProtectionService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Monitor all healthcare security controls
     */
    monitorHealthcareSecurityControls(): Promise<any>;
    /**
     * Validate HIPAA compliance across all systems
     */
    private validateHIPAACompliance;
    /**
     * Monitor medical device security
     */
    private monitorMedicalDevices;
    /**
     * Track PHI access patterns
     */
    private trackPHIAccess;
    /**
     * Detect security threats
     */
    private detectSecurityThreats;
}
/**
 * Export NestJS module definition
 */
export declare const HealthcareThreatProtectionModule: {
    controllers: (typeof HealthcareThreatProtectionController)[];
    providers: (typeof HealthcareThreatProtectionService)[];
    exports: (typeof HealthcareThreatProtectionService)[];
};
//# sourceMappingURL=healthcare-threat-protection-composite.d.ts.map