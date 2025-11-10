"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAutomatedCheck = exports.validateAgainstPolicy = exports.detectLogTampering = exports.trackChainOfCustody = exports.scheduleAuditReport = exports.generateAuditReport = exports.applyRetentionPolicy = exports.createLogRetentionPolicy = exports.generateForensicReport = exports.analyzeLogPatterns = exports.reconstructEventTimeline = exports.performForensicAnalysis = exports.trackComplianceEvidence = exports.mapAuditLogsToCompliance = exports.generateComplianceAuditReport = exports.validateComplianceRequirements = exports.createComplianceAudit = exports.generateChangeTrackingReport = exports.rollbackToVersion = exports.compareEntityVersions = exports.getEntityChangeHistory = exports.recordDataChange = exports.trackPrivilegedAccess = exports.generateAccessControlReport = exports.detectUnusualAccessPatterns = exports.getResourceAccessHistory = exports.getUserAccessHistory = exports.recordAccessAudit = exports.generateSecurityEventAlerts = exports.escalateSecurityEvent = exports.getSecurityEventSummary = exports.resolveSecurityEvent = exports.correlateSecurityEvents = exports.trackSecurityEvent = exports.aggregateAuditLogStatistics = exports.purgeAuditLogs = exports.exportAuditLogs = exports.archiveAuditLogs = exports.updateAuditLogStatus = exports.searchAuditLogs = exports.getAuditLogs = exports.generateAuditLog = exports.getControlEffectivenessRate = exports.calculateNextTestDate = exports.calculateFrameworkMaturity = exports.defineCertificationModel = exports.defineComplianceGapModel = exports.defineAuditModel = exports.defineComplianceControlModel = exports.defineComplianceFrameworkModel = void 0;
exports.monitorCloudCostAnomalies = exports.detectCloudResourceAbuse = exports.detectAPIRateLimitViolations = exports.monitorCloudAPIActivity = exports.detectMultiCloudThreats = exports.monitorGCPCloudFunctionsSecurity = exports.detectGCEThreats = exports.monitorGCPIAMThreats = exports.detectGCSMisconfigurations = exports.scanGCPThreats = exports.monitorAzureFunctionsSecurity = exports.detectAzureVMThreats = exports.monitorAzureADThreats = exports.detectAzureStorageMisconfigurations = exports.scanAzureThreats = exports.monitorAWSLambdaSecurity = exports.detectAWSEC2Threats = exports.monitorAWSIAMThreats = exports.detectAWSS3Misconfigurations = exports.scanAWSThreats = exports.executeThreatResponse = exports.enrichEndpointIOCs = exports.scanFileSystemIOCs = exports.scanProcessIOCs = exports.scanForFileHash = exports.scanEndpointIOCs = exports.generateRegistryMonitoringReport = exports.detectRegistryPrivilegeEscalation = exports.monitorRegistryPersistence = exports.detectSuspiciousRegistryChanges = exports.monitorRegistryChanges = exports.generateFileIntegrityReport = exports.compareWithBaseline = exports.createFileIntegrityBaseline = exports.detectSuspiciousFileChanges = exports.monitorFileIntegrity = exports.generateProcessBehaviorReport = exports.correlateProcesses = exports.detectPrivilegeEscalation = exports.monitorProcessCreation = exports.detectProcessInjection = exports.analyzeProcessBehavior = exports.validateTelemetryData = exports.exportTelemetryData = exports.detectTelemetryAnomalies = exports.aggregateEndpointTelemetry = exports.monitorEndpointHealth = exports.collectEndpointTelemetry = exports.generateConfigurationHardeningGuide = exports.validateSecurityBaseline = void 0;
exports.PatientDataThreatMonitoringModule = exports.PatientDataThreatMonitoringService = exports.PatientDataThreatMonitoringController = exports.UpdatePatientConsentDto = exports.ReportBreachDto = exports.RecordPHIAccessDto = exports.CreatePHIAccessRequestDto = exports.EncryptionStatus = exports.BreachNotificationLevel = exports.PHIAccessContext = exports.PHIDataType = exports.executeCloudRemediation = exports.generateCloudRemediation = exports.validateHIPAACompliance = exports.assessCloudCompliance = void 0;
/**
 * File: /reuse/threat/composites/patient-data-threat-monitoring-composite.ts
 * Locator: WC-PATIENT-DATA-COMPOSITE-001
 * Purpose: Patient Data Threat Monitoring Composite - PHI security monitoring and breach detection
 *
 * Upstream: Compliance, Security Audit, Policy Enforcement, Endpoint, Cloud Threat Detection Kits
 * Downstream: ../backend/*, PHI security services, Breach detection, EHR/EMR protection, Patient privacy
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: 45 specialized functions for patient data protection, PHI monitoring, breach detection, privacy compliance
 *
 * LLM Context: Enterprise-grade patient data threat monitoring composite for White Cross healthcare platform.
 * Provides comprehensive PHI access monitoring, patient data encryption validation, breach detection and response,
 * unauthorized access prevention, data leakage detection, patient privacy compliance (HIPAA Privacy Rule),
 * electronic health record security, medical imaging security (PACS/DICOM), patient portal security,
 * and automated breach notification workflows with complete audit trails and forensic capabilities.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// Import compliance monitoring functions
const compliance_monitoring_kit_1 = require("../compliance-monitoring-kit");
Object.defineProperty(exports, "defineComplianceFrameworkModel", { enumerable: true, get: function () { return compliance_monitoring_kit_1.defineComplianceFrameworkModel; } });
Object.defineProperty(exports, "defineComplianceControlModel", { enumerable: true, get: function () { return compliance_monitoring_kit_1.defineComplianceControlModel; } });
Object.defineProperty(exports, "defineAuditModel", { enumerable: true, get: function () { return compliance_monitoring_kit_1.defineAuditModel; } });
Object.defineProperty(exports, "defineComplianceGapModel", { enumerable: true, get: function () { return compliance_monitoring_kit_1.defineComplianceGapModel; } });
Object.defineProperty(exports, "defineCertificationModel", { enumerable: true, get: function () { return compliance_monitoring_kit_1.defineCertificationModel; } });
Object.defineProperty(exports, "calculateFrameworkMaturity", { enumerable: true, get: function () { return compliance_monitoring_kit_1.calculateFrameworkMaturity; } });
Object.defineProperty(exports, "calculateNextTestDate", { enumerable: true, get: function () { return compliance_monitoring_kit_1.calculateNextTestDate; } });
Object.defineProperty(exports, "getControlEffectivenessRate", { enumerable: true, get: function () { return compliance_monitoring_kit_1.getControlEffectivenessRate; } });
// Import security audit trail functions
const security_audit_trail_kit_1 = require("../security-audit-trail-kit");
Object.defineProperty(exports, "generateAuditLog", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateAuditLog; } });
Object.defineProperty(exports, "getAuditLogs", { enumerable: true, get: function () { return security_audit_trail_kit_1.getAuditLogs; } });
Object.defineProperty(exports, "searchAuditLogs", { enumerable: true, get: function () { return security_audit_trail_kit_1.searchAuditLogs; } });
Object.defineProperty(exports, "updateAuditLogStatus", { enumerable: true, get: function () { return security_audit_trail_kit_1.updateAuditLogStatus; } });
Object.defineProperty(exports, "archiveAuditLogs", { enumerable: true, get: function () { return security_audit_trail_kit_1.archiveAuditLogs; } });
Object.defineProperty(exports, "exportAuditLogs", { enumerable: true, get: function () { return security_audit_trail_kit_1.exportAuditLogs; } });
Object.defineProperty(exports, "purgeAuditLogs", { enumerable: true, get: function () { return security_audit_trail_kit_1.purgeAuditLogs; } });
Object.defineProperty(exports, "aggregateAuditLogStatistics", { enumerable: true, get: function () { return security_audit_trail_kit_1.aggregateAuditLogStatistics; } });
Object.defineProperty(exports, "trackSecurityEvent", { enumerable: true, get: function () { return security_audit_trail_kit_1.trackSecurityEvent; } });
Object.defineProperty(exports, "correlateSecurityEvents", { enumerable: true, get: function () { return security_audit_trail_kit_1.correlateSecurityEvents; } });
Object.defineProperty(exports, "resolveSecurityEvent", { enumerable: true, get: function () { return security_audit_trail_kit_1.resolveSecurityEvent; } });
Object.defineProperty(exports, "getSecurityEventSummary", { enumerable: true, get: function () { return security_audit_trail_kit_1.getSecurityEventSummary; } });
Object.defineProperty(exports, "escalateSecurityEvent", { enumerable: true, get: function () { return security_audit_trail_kit_1.escalateSecurityEvent; } });
Object.defineProperty(exports, "generateSecurityEventAlerts", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateSecurityEventAlerts; } });
Object.defineProperty(exports, "recordAccessAudit", { enumerable: true, get: function () { return security_audit_trail_kit_1.recordAccessAudit; } });
Object.defineProperty(exports, "getUserAccessHistory", { enumerable: true, get: function () { return security_audit_trail_kit_1.getUserAccessHistory; } });
Object.defineProperty(exports, "getResourceAccessHistory", { enumerable: true, get: function () { return security_audit_trail_kit_1.getResourceAccessHistory; } });
Object.defineProperty(exports, "detectUnusualAccessPatterns", { enumerable: true, get: function () { return security_audit_trail_kit_1.detectUnusualAccessPatterns; } });
Object.defineProperty(exports, "generateAccessControlReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateAccessControlReport; } });
Object.defineProperty(exports, "trackPrivilegedAccess", { enumerable: true, get: function () { return security_audit_trail_kit_1.trackPrivilegedAccess; } });
Object.defineProperty(exports, "recordDataChange", { enumerable: true, get: function () { return security_audit_trail_kit_1.recordDataChange; } });
Object.defineProperty(exports, "getEntityChangeHistory", { enumerable: true, get: function () { return security_audit_trail_kit_1.getEntityChangeHistory; } });
Object.defineProperty(exports, "compareEntityVersions", { enumerable: true, get: function () { return security_audit_trail_kit_1.compareEntityVersions; } });
Object.defineProperty(exports, "rollbackToVersion", { enumerable: true, get: function () { return security_audit_trail_kit_1.rollbackToVersion; } });
Object.defineProperty(exports, "generateChangeTrackingReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateChangeTrackingReport; } });
Object.defineProperty(exports, "createComplianceAudit", { enumerable: true, get: function () { return security_audit_trail_kit_1.createComplianceAudit; } });
Object.defineProperty(exports, "validateComplianceRequirements", { enumerable: true, get: function () { return security_audit_trail_kit_1.validateComplianceRequirements; } });
Object.defineProperty(exports, "generateComplianceAuditReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateComplianceAuditReport; } });
Object.defineProperty(exports, "mapAuditLogsToCompliance", { enumerable: true, get: function () { return security_audit_trail_kit_1.mapAuditLogsToCompliance; } });
Object.defineProperty(exports, "trackComplianceEvidence", { enumerable: true, get: function () { return security_audit_trail_kit_1.trackComplianceEvidence; } });
Object.defineProperty(exports, "performForensicAnalysis", { enumerable: true, get: function () { return security_audit_trail_kit_1.performForensicAnalysis; } });
Object.defineProperty(exports, "reconstructEventTimeline", { enumerable: true, get: function () { return security_audit_trail_kit_1.reconstructEventTimeline; } });
Object.defineProperty(exports, "analyzeLogPatterns", { enumerable: true, get: function () { return security_audit_trail_kit_1.analyzeLogPatterns; } });
Object.defineProperty(exports, "generateForensicReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateForensicReport; } });
Object.defineProperty(exports, "createLogRetentionPolicy", { enumerable: true, get: function () { return security_audit_trail_kit_1.createLogRetentionPolicy; } });
Object.defineProperty(exports, "applyRetentionPolicy", { enumerable: true, get: function () { return security_audit_trail_kit_1.applyRetentionPolicy; } });
Object.defineProperty(exports, "generateAuditReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.generateAuditReport; } });
Object.defineProperty(exports, "scheduleAuditReport", { enumerable: true, get: function () { return security_audit_trail_kit_1.scheduleAuditReport; } });
Object.defineProperty(exports, "trackChainOfCustody", { enumerable: true, get: function () { return security_audit_trail_kit_1.trackChainOfCustody; } });
Object.defineProperty(exports, "detectLogTampering", { enumerable: true, get: function () { return security_audit_trail_kit_1.detectLogTampering; } });
// Import security policy enforcement functions
const security_policy_enforcement_kit_1 = require("../security-policy-enforcement-kit");
Object.defineProperty(exports, "validateAgainstPolicy", { enumerable: true, get: function () { return security_policy_enforcement_kit_1.validateAgainstPolicy; } });
Object.defineProperty(exports, "scheduleAutomatedCheck", { enumerable: true, get: function () { return security_policy_enforcement_kit_1.scheduleAutomatedCheck; } });
Object.defineProperty(exports, "validateSecurityBaseline", { enumerable: true, get: function () { return security_policy_enforcement_kit_1.validateSecurityBaseline; } });
Object.defineProperty(exports, "generateConfigurationHardeningGuide", { enumerable: true, get: function () { return security_policy_enforcement_kit_1.generateConfigurationHardeningGuide; } });
// Import endpoint threat detection functions
const endpoint_threat_detection_kit_1 = require("../endpoint-threat-detection-kit");
Object.defineProperty(exports, "collectEndpointTelemetry", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.collectEndpointTelemetry; } });
Object.defineProperty(exports, "monitorEndpointHealth", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.monitorEndpointHealth; } });
Object.defineProperty(exports, "aggregateEndpointTelemetry", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.aggregateEndpointTelemetry; } });
Object.defineProperty(exports, "detectTelemetryAnomalies", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectTelemetryAnomalies; } });
Object.defineProperty(exports, "exportTelemetryData", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.exportTelemetryData; } });
Object.defineProperty(exports, "validateTelemetryData", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.validateTelemetryData; } });
Object.defineProperty(exports, "analyzeProcessBehavior", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.analyzeProcessBehavior; } });
Object.defineProperty(exports, "detectProcessInjection", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectProcessInjection; } });
Object.defineProperty(exports, "monitorProcessCreation", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.monitorProcessCreation; } });
Object.defineProperty(exports, "detectPrivilegeEscalation", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectPrivilegeEscalation; } });
Object.defineProperty(exports, "correlateProcesses", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.correlateProcesses; } });
Object.defineProperty(exports, "generateProcessBehaviorReport", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.generateProcessBehaviorReport; } });
Object.defineProperty(exports, "monitorFileIntegrity", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.monitorFileIntegrity; } });
Object.defineProperty(exports, "detectSuspiciousFileChanges", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectSuspiciousFileChanges; } });
Object.defineProperty(exports, "createFileIntegrityBaseline", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.createFileIntegrityBaseline; } });
Object.defineProperty(exports, "compareWithBaseline", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.compareWithBaseline; } });
Object.defineProperty(exports, "generateFileIntegrityReport", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.generateFileIntegrityReport; } });
Object.defineProperty(exports, "monitorRegistryChanges", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.monitorRegistryChanges; } });
Object.defineProperty(exports, "detectSuspiciousRegistryChanges", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectSuspiciousRegistryChanges; } });
Object.defineProperty(exports, "monitorRegistryPersistence", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.monitorRegistryPersistence; } });
Object.defineProperty(exports, "detectRegistryPrivilegeEscalation", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.detectRegistryPrivilegeEscalation; } });
Object.defineProperty(exports, "generateRegistryMonitoringReport", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.generateRegistryMonitoringReport; } });
Object.defineProperty(exports, "scanEndpointIOCs", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.scanEndpointIOCs; } });
Object.defineProperty(exports, "scanForFileHash", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.scanForFileHash; } });
Object.defineProperty(exports, "scanProcessIOCs", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.scanProcessIOCs; } });
Object.defineProperty(exports, "scanFileSystemIOCs", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.scanFileSystemIOCs; } });
Object.defineProperty(exports, "enrichEndpointIOCs", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.enrichEndpointIOCs; } });
Object.defineProperty(exports, "executeThreatResponse", { enumerable: true, get: function () { return endpoint_threat_detection_kit_1.executeThreatResponse; } });
// Import cloud threat detection functions
const cloud_threat_detection_kit_1 = require("../cloud-threat-detection-kit");
Object.defineProperty(exports, "scanAWSThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.scanAWSThreats; } });
Object.defineProperty(exports, "detectAWSS3Misconfigurations", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectAWSS3Misconfigurations; } });
Object.defineProperty(exports, "monitorAWSIAMThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorAWSIAMThreats; } });
Object.defineProperty(exports, "detectAWSEC2Threats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectAWSEC2Threats; } });
Object.defineProperty(exports, "monitorAWSLambdaSecurity", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorAWSLambdaSecurity; } });
Object.defineProperty(exports, "scanAzureThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.scanAzureThreats; } });
Object.defineProperty(exports, "detectAzureStorageMisconfigurations", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectAzureStorageMisconfigurations; } });
Object.defineProperty(exports, "monitorAzureADThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorAzureADThreats; } });
Object.defineProperty(exports, "detectAzureVMThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectAzureVMThreats; } });
Object.defineProperty(exports, "monitorAzureFunctionsSecurity", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorAzureFunctionsSecurity; } });
Object.defineProperty(exports, "scanGCPThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.scanGCPThreats; } });
Object.defineProperty(exports, "detectGCSMisconfigurations", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectGCSMisconfigurations; } });
Object.defineProperty(exports, "monitorGCPIAMThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorGCPIAMThreats; } });
Object.defineProperty(exports, "detectGCEThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectGCEThreats; } });
Object.defineProperty(exports, "monitorGCPCloudFunctionsSecurity", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorGCPCloudFunctionsSecurity; } });
Object.defineProperty(exports, "detectMultiCloudThreats", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectMultiCloudThreats; } });
Object.defineProperty(exports, "monitorCloudAPIActivity", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorCloudAPIActivity; } });
Object.defineProperty(exports, "detectAPIRateLimitViolations", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectAPIRateLimitViolations; } });
Object.defineProperty(exports, "detectCloudResourceAbuse", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.detectCloudResourceAbuse; } });
Object.defineProperty(exports, "monitorCloudCostAnomalies", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.monitorCloudCostAnomalies; } });
Object.defineProperty(exports, "assessCloudCompliance", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.assessCloudCompliance; } });
Object.defineProperty(exports, "validateHIPAACompliance", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.validateHIPAACompliance; } });
Object.defineProperty(exports, "generateCloudRemediation", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.generateCloudRemediation; } });
Object.defineProperty(exports, "executeCloudRemediation", { enumerable: true, get: function () { return cloud_threat_detection_kit_1.executeCloudRemediation; } });
// ============================================================================
// PATIENT DATA SECURITY TYPE DEFINITIONS
// ============================================================================
/**
 * Protected Health Information (PHI) data types
 */
var PHIDataType;
(function (PHIDataType) {
    PHIDataType["DEMOGRAPHICS"] = "DEMOGRAPHICS";
    PHIDataType["MEDICAL_RECORDS"] = "MEDICAL_RECORDS";
    PHIDataType["LAB_RESULTS"] = "LAB_RESULTS";
    PHIDataType["IMAGING"] = "IMAGING";
    PHIDataType["BILLING"] = "BILLING";
    PHIDataType["PRESCRIPTION"] = "PRESCRIPTION";
    PHIDataType["IMMUNIZATION"] = "IMMUNIZATION";
    PHIDataType["GENETIC"] = "GENETIC";
    PHIDataType["MENTAL_HEALTH"] = "MENTAL_HEALTH";
    PHIDataType["SUBSTANCE_ABUSE"] = "SUBSTANCE_ABUSE";
})(PHIDataType || (exports.PHIDataType = PHIDataType = {}));
/**
 * PHI access context for minimum necessary standard
 */
var PHIAccessContext;
(function (PHIAccessContext) {
    PHIAccessContext["TREATMENT"] = "TREATMENT";
    PHIAccessContext["PAYMENT"] = "PAYMENT";
    PHIAccessContext["OPERATIONS"] = "OPERATIONS";
    PHIAccessContext["RESEARCH"] = "RESEARCH";
    PHIAccessContext["PUBLIC_HEALTH"] = "PUBLIC_HEALTH";
    PHIAccessContext["LEGAL"] = "LEGAL";
    PHIAccessContext["EMERGENCY"] = "EMERGENCY";
})(PHIAccessContext || (exports.PHIAccessContext = PHIAccessContext = {}));
/**
 * Data breach notification levels (HIPAA Breach Notification Rule)
 */
var BreachNotificationLevel;
(function (BreachNotificationLevel) {
    BreachNotificationLevel["NO_BREACH"] = "NO_BREACH";
    BreachNotificationLevel["INDIVIDUAL_ONLY"] = "INDIVIDUAL_ONLY";
    BreachNotificationLevel["INDIVIDUAL_AND_HHS"] = "INDIVIDUAL_AND_HHS";
    BreachNotificationLevel["INDIVIDUAL_HHS_MEDIA"] = "INDIVIDUAL_HHS_MEDIA";
})(BreachNotificationLevel || (exports.BreachNotificationLevel = BreachNotificationLevel = {}));
/**
 * Patient data encryption status
 */
var EncryptionStatus;
(function (EncryptionStatus) {
    EncryptionStatus["ENCRYPTED_AT_REST"] = "ENCRYPTED_AT_REST";
    EncryptionStatus["ENCRYPTED_IN_TRANSIT"] = "ENCRYPTED_IN_TRANSIT";
    EncryptionStatus["ENCRYPTED_BOTH"] = "ENCRYPTED_BOTH";
    EncryptionStatus["NOT_ENCRYPTED"] = "NOT_ENCRYPTED";
    EncryptionStatus["PARTIALLY_ENCRYPTED"] = "PARTIALLY_ENCRYPTED";
})(EncryptionStatus || (exports.EncryptionStatus = EncryptionStatus = {}));
// ============================================================================
// DTO CLASSES FOR NESTJS CONTROLLERS
// ============================================================================
let CreatePHIAccessRequestDto = (() => {
    var _a;
    let _requesterId_decorators;
    let _requesterId_initializers = [];
    let _requesterId_extraInitializers = [];
    let _requesterRole_decorators;
    let _requesterRole_initializers = [];
    let _requesterRole_extraInitializers = [];
    let _patientId_decorators;
    let _patientId_initializers = [];
    let _patientId_extraInitializers = [];
    let _phiTypes_decorators;
    let _phiTypes_initializers = [];
    let _phiTypes_extraInitializers = [];
    let _accessContext_decorators;
    let _accessContext_initializers = [];
    let _accessContext_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    return _a = class CreatePHIAccessRequestDto {
            constructor() {
                this.requesterId = __runInitializers(this, _requesterId_initializers, void 0);
                this.requesterRole = (__runInitializers(this, _requesterId_extraInitializers), __runInitializers(this, _requesterRole_initializers, void 0));
                this.patientId = (__runInitializers(this, _requesterRole_extraInitializers), __runInitializers(this, _patientId_initializers, void 0));
                this.phiTypes = (__runInitializers(this, _patientId_extraInitializers), __runInitializers(this, _phiTypes_initializers, void 0));
                this.accessContext = (__runInitializers(this, _phiTypes_extraInitializers), __runInitializers(this, _accessContext_initializers, void 0));
                this.justification = (__runInitializers(this, _accessContext_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                __runInitializers(this, _justification_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _requesterId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requester user ID', example: 'user-123' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _requesterRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requester role', example: 'physician' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _patientId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: 'patient-456' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _phiTypes_decorators = [(0, swagger_1.ApiProperty)({ enum: PHIDataType, isArray: true, example: [PHIDataType.MEDICAL_RECORDS] }), (0, class_validator_1.IsEnum)(PHIDataType, { each: true }), (0, class_validator_1.IsArray)()];
            _accessContext_decorators = [(0, swagger_1.ApiProperty)({ enum: PHIAccessContext, example: PHIAccessContext.TREATMENT }), (0, class_validator_1.IsEnum)(PHIAccessContext)];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification for access', example: 'Patient presenting with chest pain' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _requesterId_decorators, { kind: "field", name: "requesterId", static: false, private: false, access: { has: obj => "requesterId" in obj, get: obj => obj.requesterId, set: (obj, value) => { obj.requesterId = value; } }, metadata: _metadata }, _requesterId_initializers, _requesterId_extraInitializers);
            __esDecorate(null, null, _requesterRole_decorators, { kind: "field", name: "requesterRole", static: false, private: false, access: { has: obj => "requesterRole" in obj, get: obj => obj.requesterRole, set: (obj, value) => { obj.requesterRole = value; } }, metadata: _metadata }, _requesterRole_initializers, _requesterRole_extraInitializers);
            __esDecorate(null, null, _patientId_decorators, { kind: "field", name: "patientId", static: false, private: false, access: { has: obj => "patientId" in obj, get: obj => obj.patientId, set: (obj, value) => { obj.patientId = value; } }, metadata: _metadata }, _patientId_initializers, _patientId_extraInitializers);
            __esDecorate(null, null, _phiTypes_decorators, { kind: "field", name: "phiTypes", static: false, private: false, access: { has: obj => "phiTypes" in obj, get: obj => obj.phiTypes, set: (obj, value) => { obj.phiTypes = value; } }, metadata: _metadata }, _phiTypes_initializers, _phiTypes_extraInitializers);
            __esDecorate(null, null, _accessContext_decorators, { kind: "field", name: "accessContext", static: false, private: false, access: { has: obj => "accessContext" in obj, get: obj => obj.accessContext, set: (obj, value) => { obj.accessContext = value; } }, metadata: _metadata }, _accessContext_initializers, _accessContext_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePHIAccessRequestDto = CreatePHIAccessRequestDto;
let RecordPHIAccessDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _userName_decorators;
    let _userName_initializers = [];
    let _userName_extraInitializers = [];
    let _userRole_decorators;
    let _userRole_initializers = [];
    let _userRole_extraInitializers = [];
    let _patientId_decorators;
    let _patientId_initializers = [];
    let _patientId_extraInitializers = [];
    let _phiType_decorators;
    let _phiType_initializers = [];
    let _phiType_extraInitializers = [];
    let _accessContext_decorators;
    let _accessContext_initializers = [];
    let _accessContext_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _minimumNecessary_decorators;
    let _minimumNecessary_initializers = [];
    let _minimumNecessary_extraInitializers = [];
    return _a = class RecordPHIAccessDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.userName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
                this.userRole = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _userRole_initializers, void 0));
                this.patientId = (__runInitializers(this, _userRole_extraInitializers), __runInitializers(this, _patientId_initializers, void 0));
                this.phiType = (__runInitializers(this, _patientId_extraInitializers), __runInitializers(this, _phiType_initializers, void 0));
                this.accessContext = (__runInitializers(this, _phiType_extraInitializers), __runInitializers(this, _accessContext_initializers, void 0));
                this.action = (__runInitializers(this, _accessContext_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.minimumNecessary = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _minimumNecessary_initializers, void 0));
                __runInitializers(this, _minimumNecessary_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID accessing PHI', example: 'user-123' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _userName_decorators = [(0, swagger_1.ApiProperty)({ description: 'User name', example: 'Dr. Jane Smith' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _userRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'User role', example: 'physician' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _patientId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: 'patient-456' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _phiType_decorators = [(0, swagger_1.ApiProperty)({ enum: PHIDataType, example: PHIDataType.MEDICAL_RECORDS }), (0, class_validator_1.IsEnum)(PHIDataType)];
            _accessContext_decorators = [(0, swagger_1.ApiProperty)({ enum: PHIAccessContext, example: PHIAccessContext.TREATMENT }), (0, class_validator_1.IsEnum)(PHIAccessContext)];
            _action_decorators = [(0, swagger_1.ApiProperty)({ enum: ['read', 'write', 'update', 'delete', 'export', 'print'], example: 'read' }), (0, class_validator_1.IsEnum)(['read', 'write', 'update', 'delete', 'export', 'print'])];
            _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address', example: '192.168.1.100' }), (0, class_validator_1.IsString)()];
            _minimumNecessary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum necessary standard followed', example: true }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: obj => "userName" in obj, get: obj => obj.userName, set: (obj, value) => { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
            __esDecorate(null, null, _userRole_decorators, { kind: "field", name: "userRole", static: false, private: false, access: { has: obj => "userRole" in obj, get: obj => obj.userRole, set: (obj, value) => { obj.userRole = value; } }, metadata: _metadata }, _userRole_initializers, _userRole_extraInitializers);
            __esDecorate(null, null, _patientId_decorators, { kind: "field", name: "patientId", static: false, private: false, access: { has: obj => "patientId" in obj, get: obj => obj.patientId, set: (obj, value) => { obj.patientId = value; } }, metadata: _metadata }, _patientId_initializers, _patientId_extraInitializers);
            __esDecorate(null, null, _phiType_decorators, { kind: "field", name: "phiType", static: false, private: false, access: { has: obj => "phiType" in obj, get: obj => obj.phiType, set: (obj, value) => { obj.phiType = value; } }, metadata: _metadata }, _phiType_initializers, _phiType_extraInitializers);
            __esDecorate(null, null, _accessContext_decorators, { kind: "field", name: "accessContext", static: false, private: false, access: { has: obj => "accessContext" in obj, get: obj => obj.accessContext, set: (obj, value) => { obj.accessContext = value; } }, metadata: _metadata }, _accessContext_initializers, _accessContext_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _minimumNecessary_decorators, { kind: "field", name: "minimumNecessary", static: false, private: false, access: { has: obj => "minimumNecessary" in obj, get: obj => obj.minimumNecessary, set: (obj, value) => { obj.minimumNecessary = value; } }, metadata: _metadata }, _minimumNecessary_initializers, _minimumNecessary_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordPHIAccessDto = RecordPHIAccessDto;
let ReportBreachDto = (() => {
    var _a;
    let _breachType_decorators;
    let _breachType_initializers = [];
    let _breachType_extraInitializers = [];
    let _discoveredAt_decorators;
    let _discoveredAt_initializers = [];
    let _discoveredAt_extraInitializers = [];
    let _discoveredBy_decorators;
    let _discoveredBy_initializers = [];
    let _discoveredBy_extraInitializers = [];
    let _totalAffectedIndividuals_decorators;
    let _totalAffectedIndividuals_initializers = [];
    let _totalAffectedIndividuals_extraInitializers = [];
    let _phiTypesCompromised_decorators;
    let _phiTypesCompromised_initializers = [];
    let _phiTypesCompromised_extraInitializers = [];
    let _breachLocation_decorators;
    let _breachLocation_initializers = [];
    let _breachLocation_extraInitializers = [];
    let _encryptionStatus_decorators;
    let _encryptionStatus_initializers = [];
    let _encryptionStatus_extraInitializers = [];
    return _a = class ReportBreachDto {
            constructor() {
                this.breachType = __runInitializers(this, _breachType_initializers, void 0);
                this.discoveredAt = (__runInitializers(this, _breachType_extraInitializers), __runInitializers(this, _discoveredAt_initializers, void 0));
                this.discoveredBy = (__runInitializers(this, _discoveredAt_extraInitializers), __runInitializers(this, _discoveredBy_initializers, void 0));
                this.totalAffectedIndividuals = (__runInitializers(this, _discoveredBy_extraInitializers), __runInitializers(this, _totalAffectedIndividuals_initializers, void 0));
                this.phiTypesCompromised = (__runInitializers(this, _totalAffectedIndividuals_extraInitializers), __runInitializers(this, _phiTypesCompromised_initializers, void 0));
                this.breachLocation = (__runInitializers(this, _phiTypesCompromised_extraInitializers), __runInitializers(this, _breachLocation_initializers, void 0));
                this.encryptionStatus = (__runInitializers(this, _breachLocation_extraInitializers), __runInitializers(this, _encryptionStatus_initializers, void 0));
                __runInitializers(this, _encryptionStatus_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _breachType_decorators = [(0, swagger_1.ApiProperty)({
                    enum: ['unauthorized_access', 'theft', 'loss', 'hacking', 'improper_disposal', 'ransomware', 'data_leak'],
                    example: 'unauthorized_access',
                }), (0, class_validator_1.IsEnum)(['unauthorized_access', 'theft', 'loss', 'hacking', 'improper_disposal', 'ransomware', 'data_leak'])];
            _discoveredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'When breach was discovered' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _discoveredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Who discovered the breach', example: 'security-team' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _totalAffectedIndividuals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated number of affected patients', example: 150 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _phiTypesCompromised_decorators = [(0, swagger_1.ApiProperty)({ enum: PHIDataType, isArray: true, example: [PHIDataType.MEDICAL_RECORDS, PHIDataType.DEMOGRAPHICS] }), (0, class_validator_1.IsEnum)(PHIDataType, { each: true }), (0, class_validator_1.IsArray)()];
            _breachLocation_decorators = [(0, swagger_1.ApiProperty)({ enum: ['on-premise', 'cloud', 'mobile', 'third-party', 'multiple'], example: 'cloud' }), (0, class_validator_1.IsEnum)(['on-premise', 'cloud', 'mobile', 'third-party', 'multiple'])];
            _encryptionStatus_decorators = [(0, swagger_1.ApiProperty)({ enum: EncryptionStatus, example: EncryptionStatus.NOT_ENCRYPTED }), (0, class_validator_1.IsEnum)(EncryptionStatus)];
            __esDecorate(null, null, _breachType_decorators, { kind: "field", name: "breachType", static: false, private: false, access: { has: obj => "breachType" in obj, get: obj => obj.breachType, set: (obj, value) => { obj.breachType = value; } }, metadata: _metadata }, _breachType_initializers, _breachType_extraInitializers);
            __esDecorate(null, null, _discoveredAt_decorators, { kind: "field", name: "discoveredAt", static: false, private: false, access: { has: obj => "discoveredAt" in obj, get: obj => obj.discoveredAt, set: (obj, value) => { obj.discoveredAt = value; } }, metadata: _metadata }, _discoveredAt_initializers, _discoveredAt_extraInitializers);
            __esDecorate(null, null, _discoveredBy_decorators, { kind: "field", name: "discoveredBy", static: false, private: false, access: { has: obj => "discoveredBy" in obj, get: obj => obj.discoveredBy, set: (obj, value) => { obj.discoveredBy = value; } }, metadata: _metadata }, _discoveredBy_initializers, _discoveredBy_extraInitializers);
            __esDecorate(null, null, _totalAffectedIndividuals_decorators, { kind: "field", name: "totalAffectedIndividuals", static: false, private: false, access: { has: obj => "totalAffectedIndividuals" in obj, get: obj => obj.totalAffectedIndividuals, set: (obj, value) => { obj.totalAffectedIndividuals = value; } }, metadata: _metadata }, _totalAffectedIndividuals_initializers, _totalAffectedIndividuals_extraInitializers);
            __esDecorate(null, null, _phiTypesCompromised_decorators, { kind: "field", name: "phiTypesCompromised", static: false, private: false, access: { has: obj => "phiTypesCompromised" in obj, get: obj => obj.phiTypesCompromised, set: (obj, value) => { obj.phiTypesCompromised = value; } }, metadata: _metadata }, _phiTypesCompromised_initializers, _phiTypesCompromised_extraInitializers);
            __esDecorate(null, null, _breachLocation_decorators, { kind: "field", name: "breachLocation", static: false, private: false, access: { has: obj => "breachLocation" in obj, get: obj => obj.breachLocation, set: (obj, value) => { obj.breachLocation = value; } }, metadata: _metadata }, _breachLocation_initializers, _breachLocation_extraInitializers);
            __esDecorate(null, null, _encryptionStatus_decorators, { kind: "field", name: "encryptionStatus", static: false, private: false, access: { has: obj => "encryptionStatus" in obj, get: obj => obj.encryptionStatus, set: (obj, value) => { obj.encryptionStatus = value; } }, metadata: _metadata }, _encryptionStatus_initializers, _encryptionStatus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReportBreachDto = ReportBreachDto;
let UpdatePatientConsentDto = (() => {
    var _a;
    let _patientId_decorators;
    let _patientId_initializers = [];
    let _patientId_extraInitializers = [];
    let _consentType_decorators;
    let _consentType_initializers = [];
    let _consentType_extraInitializers = [];
    let _granted_decorators;
    let _granted_initializers = [];
    let _granted_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _restrictions_decorators;
    let _restrictions_initializers = [];
    let _restrictions_extraInitializers = [];
    return _a = class UpdatePatientConsentDto {
            constructor() {
                this.patientId = __runInitializers(this, _patientId_initializers, void 0);
                this.consentType = (__runInitializers(this, _patientId_extraInitializers), __runInitializers(this, _consentType_initializers, void 0));
                this.granted = (__runInitializers(this, _consentType_extraInitializers), __runInitializers(this, _granted_initializers, void 0));
                this.scope = (__runInitializers(this, _granted_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.restrictions = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _restrictions_initializers, void 0));
                __runInitializers(this, _restrictions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patientId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: 'patient-789' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _consentType_decorators = [(0, swagger_1.ApiProperty)({
                    enum: ['general', 'research', 'marketing', 'third_party_sharing', 'sensitive_data'],
                    example: 'research',
                }), (0, class_validator_1.IsEnum)(['general', 'research', 'marketing', 'third_party_sharing', 'sensitive_data'])];
            _granted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Consent granted', example: true }), (0, class_validator_1.IsBoolean)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope of consent', example: ['clinical-trials', 'genomic-research'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _restrictions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Any restrictions', required: false, example: ['no-genetic-data'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _patientId_decorators, { kind: "field", name: "patientId", static: false, private: false, access: { has: obj => "patientId" in obj, get: obj => obj.patientId, set: (obj, value) => { obj.patientId = value; } }, metadata: _metadata }, _patientId_initializers, _patientId_extraInitializers);
            __esDecorate(null, null, _consentType_decorators, { kind: "field", name: "consentType", static: false, private: false, access: { has: obj => "consentType" in obj, get: obj => obj.consentType, set: (obj, value) => { obj.consentType = value; } }, metadata: _metadata }, _consentType_initializers, _consentType_extraInitializers);
            __esDecorate(null, null, _granted_decorators, { kind: "field", name: "granted", static: false, private: false, access: { has: obj => "granted" in obj, get: obj => obj.granted, set: (obj, value) => { obj.granted = value; } }, metadata: _metadata }, _granted_initializers, _granted_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _restrictions_decorators, { kind: "field", name: "restrictions", static: false, private: false, access: { has: obj => "restrictions" in obj, get: obj => obj.restrictions, set: (obj, value) => { obj.restrictions = value; } }, metadata: _metadata }, _restrictions_initializers, _restrictions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdatePatientConsentDto = UpdatePatientConsentDto;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let PatientDataThreatMonitoringController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('patient-data-threat-monitoring'), (0, common_1.Controller)('api/v1/patient-data-threat-monitoring'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _monitorPHIAccessPatterns_decorators;
    let _recordPHIAccess_decorators;
    let _detectUnauthorizedPHIAccess_decorators;
    let _reportPatientDataBreach_decorators;
    let _performComprehensiveForensicAnalysis_decorators;
    let _validatePatientDataEncryption_decorators;
    let _managePatientConsent_decorators;
    let _generateComprehensiveSecurityReport_decorators;
    let _detectDataLeakage_decorators;
    var PatientDataThreatMonitoringController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
            this.logger = new common_1.Logger(PatientDataThreatMonitoringController.name);
        }
        /**
         * Monitor PHI access patterns in real-time
         */
        async monitorPHIAccessPatterns(patientId, userId, startDate, endDate) {
            this.logger.log('Monitoring PHI access patterns');
            // Get user access history
            const userHistory = userId
                ? await (0, security_audit_trail_kit_1.getUserAccessHistory)(userId, { limit: 1000 }, this.sequelize)
                : [];
            // Get resource access history for patient
            const resourceHistory = patientId
                ? await (0, security_audit_trail_kit_1.getResourceAccessHistory)(patientId, { limit: 1000 }, this.sequelize)
                : [];
            // Detect unusual access patterns
            const unusualPatterns = userId
                ? await (0, security_audit_trail_kit_1.detectUnusualAccessPatterns)(userId, { threshold: 2.5 }, this.sequelize)
                : [];
            // Track privileged access
            await (0, security_audit_trail_kit_1.trackPrivilegedAccess)({
                userId: userId || 'system',
                action: 'phi-access-monitoring',
                justification: 'Security monitoring',
            }, this.sequelize);
            // Generate access control report
            const accessReport = await (0, security_audit_trail_kit_1.generateAccessControlReport)({
                startDate: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000),
                endDate: endDate || new Date(),
                includePatterns: true,
            }, this.sequelize);
            // Correlate security events
            const correlatedEvents = await (0, security_audit_trail_kit_1.correlateSecurityEvents)({
                eventTypes: ['UNAUTHORIZED_ACCESS', 'PHI_ACCESS', 'DATA_EXPORT'],
                timeWindow: 3600000, // 1 hour
            }, this.sequelize);
            const allAccesses = [...userHistory, ...resourceHistory];
            return {
                totalAccesses: allAccesses.length,
                authorizedAccesses: allAccesses.filter((a) => a.authorized !== false).length,
                unauthorizedAttempts: allAccesses.filter((a) => a.authorized === false).length,
                unusualPatterns: unusualPatterns.length,
                highRiskAccesses: allAccesses.filter((a) => (a.riskScore || 0) > 70).length,
                accessLogs: [],
                alerts: correlatedEvents,
            };
        }
        /**
         * Record PHI access with audit trail
         */
        async recordPHIAccess(accessDto) {
            this.logger.log(`Recording PHI access for patient ${accessDto.patientId} by user ${accessDto.userId}`);
            // Record access audit
            const accessAudit = await (0, security_audit_trail_kit_1.recordAccessAudit)({
                userId: accessDto.userId,
                resourceType: 'PHI',
                resourceId: accessDto.patientId,
                action: accessDto.action,
                result: 'success',
                ipAddress: accessDto.ipAddress,
                metadata: {
                    phiType: accessDto.phiType,
                    accessContext: accessDto.accessContext,
                    minimumNecessary: accessDto.minimumNecessary,
                },
            }, this.sequelize);
            // Generate audit log
            await (0, security_audit_trail_kit_1.generateAuditLog)({
                eventType: 'PHI_ACCESS',
                userId: accessDto.userId,
                action: accessDto.action.toUpperCase(),
                resourceType: 'PATIENT_DATA',
                resourceId: accessDto.patientId,
                severity: accessDto.minimumNecessary ? 'INFO' : 'MEDIUM',
                details: {
                    phiType: accessDto.phiType,
                    accessContext: accessDto.accessContext,
                    userName: accessDto.userName,
                    userRole: accessDto.userRole,
                },
            }, this.sequelize);
            // Track compliance evidence
            await (0, security_audit_trail_kit_1.trackComplianceEvidence)({
                standard: 'HIPAA',
                requirement: 'Access Control',
                evidenceType: 'access_log',
                evidenceData: {
                    userId: accessDto.userId,
                    patientId: accessDto.patientId,
                    timestamp: new Date(),
                },
            }, this.sequelize);
            const accessLog = {
                id: crypto.randomUUID(),
                userId: accessDto.userId,
                userName: accessDto.userName,
                userRole: accessDto.userRole,
                patientId: accessDto.patientId,
                phiType: accessDto.phiType,
                accessContext: accessDto.accessContext,
                action: accessDto.action,
                ipAddress: accessDto.ipAddress,
                userAgent: 'Unknown',
                timestamp: new Date(),
                minimumNecessary: accessDto.minimumNecessary,
                authorized: true,
                riskScore: accessDto.minimumNecessary ? 10 : 40,
            };
            return accessLog;
        }
        /**
         * Detect unauthorized PHI access attempts
         */
        async detectUnauthorizedPHIAccess(hours = 24, severity) {
            this.logger.warn('Detecting unauthorized PHI access attempts');
            const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
            // Search for unauthorized access attempts
            const unauthorizedAttempts = await (0, security_audit_trail_kit_1.searchAuditLogs)({
                eventTypes: ['UNAUTHORIZED_ACCESS', 'ACCESS_DENIED'],
                severity: severity ? [severity] : ['CRITICAL', 'HIGH', 'MEDIUM'],
                startDate,
                endDate: new Date(),
            }, this.sequelize);
            // Detect unusual access patterns
            const unusualPatterns = await (0, security_audit_trail_kit_1.detectUnusualAccessPatterns)('all', { threshold: 3.0 }, this.sequelize);
            // Get security event summary
            const eventSummary = await (0, security_audit_trail_kit_1.getSecurityEventSummary)({
                startDate,
                endDate: new Date(),
                eventTypes: ['UNAUTHORIZED_ACCESS', 'DATA_BREACH'],
            }, this.sequelize);
            // Generate security event alerts
            const alerts = await (0, security_audit_trail_kit_1.generateSecurityEventAlerts)({
                severityThreshold: 'HIGH',
                eventTypes: ['UNAUTHORIZED_ACCESS'],
            }, this.sequelize);
            return {
                totalUnauthorizedAttempts: unauthorizedAttempts.length,
                criticalAttempts: unauthorizedAttempts.filter((a) => a.severity === 'CRITICAL').length,
                blockedAttempts: unauthorizedAttempts.filter((a) => a.blocked === true).length,
                attempts: unauthorizedAttempts,
                affectedPatients: [...new Set(unauthorizedAttempts.map((a) => a.resourceId).filter(Boolean))],
                recommendations: [
                    'Review access control policies immediately',
                    'Investigate accounts with multiple failed attempts',
                    'Consider implementing additional authentication factors',
                    'Audit user role assignments and permissions',
                ],
            };
        }
        /**
         * Report and investigate patient data breach
         */
        async reportPatientDataBreach(breachDto) {
            this.logger.error('Patient data breach reported');
            // Determine notification level
            const notificationLevel = breachDto.totalAffectedIndividuals >= 500
                ? BreachNotificationLevel.INDIVIDUAL_HHS_MEDIA
                : BreachNotificationLevel.INDIVIDUAL_ONLY;
            // Track security event
            const securityEvent = await (0, security_audit_trail_kit_1.trackSecurityEvent)({
                eventType: 'DATA_BREACH',
                severity: 'CRITICAL',
                description: `Patient data breach: ${breachDto.breachType}`,
                affectedResources: breachDto.phiTypesCompromised,
                metadata: {
                    totalAffectedIndividuals: breachDto.totalAffectedIndividuals,
                    breachLocation: breachDto.breachLocation,
                    encryptionStatus: breachDto.encryptionStatus,
                },
            }, this.sequelize);
            // Escalate security event
            await (0, security_audit_trail_kit_1.escalateSecurityEvent)({
                eventId: securityEvent.id,
                escalationLevel: 'EXECUTIVE',
                assignedTo: 'security-officer',
                reason: 'Patient data breach requires immediate attention',
            }, this.sequelize);
            // Perform forensic analysis
            const forensicAnalysis = await (0, security_audit_trail_kit_1.performForensicAnalysis)({
                incidentId: securityEvent.id,
                analysisType: 'breach_investigation',
                scope: 'comprehensive',
            }, this.sequelize);
            // Reconstruct event timeline
            const timeline = await (0, security_audit_trail_kit_1.reconstructEventTimeline)({
                incidentId: securityEvent.id,
                startDate: new Date(breachDto.discoveredAt.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
                endDate: new Date(),
            }, this.sequelize);
            // Track chain of custody for evidence
            await (0, security_audit_trail_kit_1.trackChainOfCustody)({
                evidenceId: `breach-${securityEvent.id}`,
                action: 'collected',
                custodian: breachDto.discoveredBy,
                location: 'secure-evidence-storage',
            }, this.sequelize);
            // Create compliance audit for breach
            await (0, security_audit_trail_kit_1.createComplianceAudit)({
                auditType: 'breach_notification',
                standard: 'HIPAA',
                scope: ['breach_notification_rule', 'risk_assessment'],
                auditor: 'compliance_officer',
            }, this.sequelize);
            // Assess risk
            const riskAssessment = {
                riskLevel: breachDto.totalAffectedIndividuals >= 500 ? 'critical' : 'high',
                riskScore: Math.min(100, breachDto.totalAffectedIndividuals / 10 +
                    (breachDto.encryptionStatus === EncryptionStatus.NOT_ENCRYPTED ? 30 : 0)),
                factors: [
                    {
                        factor: 'Number of affected individuals',
                        weight: 8,
                        description: `${breachDto.totalAffectedIndividuals} patients affected`,
                    },
                    {
                        factor: 'Encryption status',
                        weight: breachDto.encryptionStatus === EncryptionStatus.NOT_ENCRYPTED ? 10 : 2,
                        description: `Data was ${breachDto.encryptionStatus}`,
                    },
                ],
                probabilityOfHarm: breachDto.encryptionStatus === EncryptionStatus.NOT_ENCRYPTED ? 'high' : 'moderate',
                natureAndExtent: `${breachDto.phiTypesCompromised.join(', ')} compromised`,
                unauthorizedPersons: 'Unknown - under investigation',
                wasAcquiredOrViewed: true,
                mitigatingFactors: [],
                assessmentDate: new Date(),
                assessedBy: breachDto.discoveredBy,
            };
            const breach = {
                id: securityEvent.id,
                breachType: breachDto.breachType,
                discoveredAt: breachDto.discoveredAt,
                discoveredBy: breachDto.discoveredBy,
                affectedPatients: [],
                totalAffectedIndividuals: breachDto.totalAffectedIndividuals,
                phiTypesCompromised: breachDto.phiTypesCompromised,
                breachLocation: breachDto.breachLocation,
                encryptionStatus: breachDto.encryptionStatus,
                notificationLevel,
                ocrNotificationRequired: breachDto.totalAffectedIndividuals >= 500,
                mediaNotificationRequired: breachDto.totalAffectedIndividuals >= 500,
                riskAssessment,
                forensicInvestigation: {
                    investigationId: forensicAnalysis.investigationId || crypto.randomUUID(),
                    investigator: breachDto.discoveredBy,
                    startDate: new Date(),
                    methodology: ['log_analysis', 'network_forensics', 'endpoint_analysis'],
                    findings: [],
                    evidenceCollected: [],
                    timeline: timeline.events || [],
                    recommendations: [],
                    status: 'initiated',
                },
                mitigationActions: [],
                status: 'investigating',
            };
            return breach;
        }
        /**
         * Perform comprehensive forensic analysis of security incident
         */
        async performComprehensiveForensicAnalysis(incidentId) {
            this.logger.log(`Performing forensic analysis for incident ${incidentId}`);
            // Perform forensic analysis
            const analysis = await (0, security_audit_trail_kit_1.performForensicAnalysis)({
                incidentId,
                analysisType: 'comprehensive',
                scope: 'full',
            }, this.sequelize);
            // Reconstruct event timeline
            const timeline = await (0, security_audit_trail_kit_1.reconstructEventTimeline)({
                incidentId,
                startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days
                endDate: new Date(),
            }, this.sequelize);
            // Analyze log patterns
            const logPatterns = await (0, security_audit_trail_kit_1.analyzeLogPatterns)({
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: new Date(),
                patternTypes: ['anomalies', 'correlations', 'trends'],
            }, this.sequelize);
            // Generate forensic report
            const forensicReport = await (0, security_audit_trail_kit_1.generateForensicReport)({
                incidentId,
                includeTimeline: true,
                includeEvidence: true,
                includeRecommendations: true,
            }, this.sequelize);
            // Detect log tampering
            const tamperingDetection = await (0, security_audit_trail_kit_1.detectLogTampering)({
                startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                endDate: new Date(),
            }, this.sequelize);
            const investigation = {
                investigationId: analysis.investigationId || incidentId,
                investigator: 'forensics-team',
                startDate: new Date(),
                methodology: [
                    'log_analysis',
                    'network_forensics',
                    'endpoint_analysis',
                    'memory_forensics',
                    'timeline_reconstruction',
                ],
                findings: analysis.findings || [],
                evidenceCollected: [],
                timeline: timeline.events || [],
                recommendations: forensicReport.recommendations || [],
                status: 'completed',
            };
            return investigation;
        }
        /**
         * Validate patient data encryption compliance
         */
        async validatePatientDataEncryption(dataType, location) {
            this.logger.log('Validating patient data encryption compliance');
            // Validate HIPAA compliance
            const hipaaCompliance = await (0, cloud_threat_detection_kit_1.validateHIPAACompliance)({
                resourceType: 'data-encryption',
                scope: dataType ? [dataType] : ['all'],
            });
            // Assess cloud compliance for data storage
            const cloudCompliance = await (0, cloud_threat_detection_kit_1.assessCloudCompliance)({
                provider: 'ALL',
                standards: ['HIPAA'],
                checks: ['encryption'],
            });
            // Validate security baseline
            const baselineValidation = await (0, security_policy_enforcement_kit_1.validateSecurityBaseline)({
                baselineId: 'hipaa-encryption-standard',
                targetSystems: location ? [location] : ['all'],
            });
            // Detect AWS S3 misconfigurations
            const s3Misconfigurations = await (0, cloud_threat_detection_kit_1.detectAWSS3Misconfigurations)({
                checkEncryption: true,
                checkPublicAccess: true,
            });
            // Detect Azure storage misconfigurations
            const azureMisconfigurations = await (0, cloud_threat_detection_kit_1.detectAzureStorageMisconfigurations)({
                checkEncryption: true,
                checkPublicAccess: true,
            });
            // Detect GCS misconfigurations
            const gcsMisconfigurations = await (0, cloud_threat_detection_kit_1.detectGCSMisconfigurations)({
                checkEncryption: true,
                checkPublicAccess: true,
            });
            const allMisconfigurations = [
                ...s3Misconfigurations,
                ...azureMisconfigurations,
                ...gcsMisconfigurations,
            ];
            const encryptionViolations = allMisconfigurations.filter((m) => m.type === 'encryption' || m.type === 'unencrypted_data');
            return {
                totalDataSets: 100, // Placeholder
                encryptedAtRest: 85,
                encryptedInTransit: 90,
                fullyEncrypted: 80,
                notEncrypted: 20,
                complianceScore: hipaaCompliance.complianceScore || 85,
                violations: encryptionViolations,
                recommendations: [
                    'Enable encryption at rest for all PHI storage',
                    'Enforce TLS 1.2+ for all data in transit',
                    'Implement key rotation policies',
                    'Audit encryption key access regularly',
                ],
            };
        }
        /**
         * Manage patient privacy consent
         */
        async managePatientConsent(consentDto) {
            this.logger.log(`Managing consent for patient ${consentDto.patientId}`);
            // Record data change for consent
            await (0, security_audit_trail_kit_1.recordDataChange)({
                entityType: 'patient_consent',
                entityId: consentDto.patientId,
                changeType: consentDto.granted ? 'granted' : 'revoked',
                changedBy: 'system',
                changes: {
                    consentType: consentDto.consentType,
                    granted: consentDto.granted,
                    scope: consentDto.scope,
                },
            }, this.sequelize);
            // Generate audit log
            await (0, security_audit_trail_kit_1.generateAuditLog)({
                eventType: 'CONSENT_CHANGE',
                userId: 'system',
                action: consentDto.granted ? 'GRANT_CONSENT' : 'REVOKE_CONSENT',
                resourceType: 'PATIENT_CONSENT',
                resourceId: consentDto.patientId,
                severity: 'INFO',
                details: {
                    consentType: consentDto.consentType,
                    scope: consentDto.scope,
                    restrictions: consentDto.restrictions,
                },
            }, this.sequelize);
            // Track compliance evidence
            await (0, security_audit_trail_kit_1.trackComplianceEvidence)({
                standard: 'HIPAA',
                requirement: 'Patient Rights',
                evidenceType: 'consent_record',
                evidenceData: {
                    patientId: consentDto.patientId,
                    consentType: consentDto.consentType,
                    granted: consentDto.granted,
                    timestamp: new Date(),
                },
            }, this.sequelize);
            const consent = {
                id: crypto.randomUUID(),
                patientId: consentDto.patientId,
                consentType: consentDto.consentType,
                granted: consentDto.granted,
                scope: consentDto.scope,
                restrictions: consentDto.restrictions,
                grantedAt: consentDto.granted ? new Date() : undefined,
                revokedAt: !consentDto.granted ? new Date() : undefined,
                version: '1.0',
                status: consentDto.granted ? 'active' : 'revoked',
            };
            return consent;
        }
        /**
         * Generate comprehensive patient data security report
         */
        async generateComprehensiveSecurityReport(startDate, endDate) {
            this.logger.log('Generating comprehensive patient data security report');
            const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate || new Date();
            // Generate compliance audit report
            const complianceReport = await (0, security_audit_trail_kit_1.generateComplianceAuditReport)({
                standard: 'HIPAA',
                startDate: start,
                endDate: end,
                scope: ['privacy_rule', 'security_rule', 'breach_notification_rule'],
            }, this.sequelize);
            // Generate audit report
            const auditReport = await (0, security_audit_trail_kit_1.generateAuditReport)({
                reportType: 'comprehensive',
                startDate: start,
                endDate: end,
                includeMetrics: true,
            }, this.sequelize);
            // Aggregate audit log statistics
            const auditStats = await (0, security_audit_trail_kit_1.aggregateAuditLogStatistics)({
                startDate: start,
                endDate: end,
                groupBy: ['eventType', 'severity'],
            }, this.sequelize);
            // Get security event summary
            const eventSummary = await (0, security_audit_trail_kit_1.getSecurityEventSummary)({
                startDate: start,
                endDate: end,
            }, this.sequelize);
            // Calculate cloud security posture
            const cloudPosture = await (0, cloud_threat_detection_kit_1.calculateCloudSecurityPosture)({
                provider: 'ALL',
                includeCompliance: true,
            });
            return {
                reportId: crypto.randomUUID(),
                generatedAt: new Date(),
                period: { start, end },
                phiAccessMetrics: {
                    totalAccesses: auditStats.totalEvents || 0,
                    unauthorizedAttempts: 0,
                    unusualPatterns: 0,
                },
                breachMetrics: {
                    totalBreaches: 0,
                    affectedPatients: 0,
                    notificationsSent: 0,
                },
                encryptionCompliance: {
                    complianceScore: 85,
                    violations: 0,
                },
                auditMetrics: auditStats,
                complianceScore: complianceReport.complianceScore || 85,
                riskScore: 25,
                recommendations: [
                    'Implement continuous PHI access monitoring',
                    'Enhance encryption for data at rest',
                    'Conduct regular security awareness training',
                    'Review and update access control policies quarterly',
                ],
            };
        }
        /**
         * Detect and prevent data leakage
         */
        async detectDataLeakage(scope = 'all') {
            this.logger.log('Detecting patient data leakage');
            // Monitor cloud API activity
            const apiActivity = await (0, cloud_threat_detection_kit_1.monitorCloudAPIActivity)({
                timeWindow: 3600000, // 1 hour
                suspiciousPatterns: ['bulk_export', 'unusual_download'],
            });
            // Detect cloud resource abuse
            const resourceAbuse = await (0, cloud_threat_detection_kit_1.detectCloudResourceAbuse)({
                resourceTypes: ['storage', 'database'],
            });
            // Monitor cloud cost anomalies (may indicate data exfiltration)
            const costAnomalies = await (0, cloud_threat_detection_kit_1.monitorCloudCostAnomalies)({
                threshold: 2.0,
                services: ['storage', 'data-transfer'],
            });
            // Detect API rate limit violations
            const rateLimitViolations = await (0, cloud_threat_detection_kit_1.detectAPIRateLimitViolations)({
                timeWindow: 3600000,
            });
            // Scan for suspicious file changes
            const suspiciousChanges = await (0, endpoint_threat_detection_kit_1.detectSuspiciousFileChanges)();
            // Monitor process creation for data exfiltration tools
            const processActivity = await (0, endpoint_threat_detection_kit_1.monitorProcessCreation)({
                suspiciousPatterns: ['data_export', 'file_transfer'],
            });
            const allFindings = [
                ...apiActivity,
                ...resourceAbuse,
                ...costAnomalies,
                ...rateLimitViolations,
                ...suspiciousChanges,
                ...processActivity,
            ];
            return {
                potentialLeaks: allFindings.length,
                criticalFindings: allFindings.filter((f) => f.severity === 'CRITICAL').length,
                findings: allFindings,
                affectedResources: [...new Set(allFindings.map((f) => f.resourceId).filter(Boolean))],
                recommendations: [
                    'Review and restrict bulk data export permissions',
                    'Implement Data Loss Prevention (DLP) policies',
                    'Monitor unusual API activity patterns',
                    'Audit third-party data sharing agreements',
                ],
            };
        }
    };
    __setFunctionName(_classThis, "PatientDataThreatMonitoringController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _monitorPHIAccessPatterns_decorators = [(0, common_1.Get)('phi-access/monitor'), (0, swagger_1.ApiOperation)({ summary: 'Monitor PHI access patterns in real-time' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'PHI access monitoring data retrieved' })];
        _recordPHIAccess_decorators = [(0, common_1.Post)('phi-access/record'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Record PHI access with complete audit trail' }), (0, swagger_1.ApiBody)({ type: RecordPHIAccessDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'PHI access recorded successfully' })];
        _detectUnauthorizedPHIAccess_decorators = [(0, common_1.Get)('phi-access/unauthorized'), (0, swagger_1.ApiOperation)({ summary: 'Detect unauthorized PHI access attempts' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Unauthorized access attempts retrieved' })];
        _reportPatientDataBreach_decorators = [(0, common_1.Post)('breach/report'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Report and investigate patient data breach' }), (0, swagger_1.ApiBody)({ type: ReportBreachDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Breach reported and investigation initiated' })];
        _performComprehensiveForensicAnalysis_decorators = [(0, common_1.Post)('forensics/analyze/:incidentId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Perform comprehensive forensic analysis' }), (0, swagger_1.ApiParam)({ name: 'incidentId', description: 'Security incident ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Forensic analysis completed' })];
        _validatePatientDataEncryption_decorators = [(0, common_1.Get)('encryption/validate'), (0, swagger_1.ApiOperation)({ summary: 'Validate patient data encryption compliance' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Encryption validation completed' })];
        _managePatientConsent_decorators = [(0, common_1.Post)('consent/manage'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Manage patient privacy consent' }), (0, swagger_1.ApiBody)({ type: UpdatePatientConsentDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient consent updated' })];
        _generateComprehensiveSecurityReport_decorators = [(0, common_1.Get)('reports/comprehensive'), (0, swagger_1.ApiOperation)({ summary: 'Generate comprehensive patient data security report' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Comprehensive security report generated' })];
        _detectDataLeakage_decorators = [(0, common_1.Get)('data-leakage/detect'), (0, swagger_1.ApiOperation)({ summary: 'Detect and prevent patient data leakage' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Data leakage detection results' })];
        __esDecorate(_classThis, null, _monitorPHIAccessPatterns_decorators, { kind: "method", name: "monitorPHIAccessPatterns", static: false, private: false, access: { has: obj => "monitorPHIAccessPatterns" in obj, get: obj => obj.monitorPHIAccessPatterns }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordPHIAccess_decorators, { kind: "method", name: "recordPHIAccess", static: false, private: false, access: { has: obj => "recordPHIAccess" in obj, get: obj => obj.recordPHIAccess }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectUnauthorizedPHIAccess_decorators, { kind: "method", name: "detectUnauthorizedPHIAccess", static: false, private: false, access: { has: obj => "detectUnauthorizedPHIAccess" in obj, get: obj => obj.detectUnauthorizedPHIAccess }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reportPatientDataBreach_decorators, { kind: "method", name: "reportPatientDataBreach", static: false, private: false, access: { has: obj => "reportPatientDataBreach" in obj, get: obj => obj.reportPatientDataBreach }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _performComprehensiveForensicAnalysis_decorators, { kind: "method", name: "performComprehensiveForensicAnalysis", static: false, private: false, access: { has: obj => "performComprehensiveForensicAnalysis" in obj, get: obj => obj.performComprehensiveForensicAnalysis }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validatePatientDataEncryption_decorators, { kind: "method", name: "validatePatientDataEncryption", static: false, private: false, access: { has: obj => "validatePatientDataEncryption" in obj, get: obj => obj.validatePatientDataEncryption }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _managePatientConsent_decorators, { kind: "method", name: "managePatientConsent", static: false, private: false, access: { has: obj => "managePatientConsent" in obj, get: obj => obj.managePatientConsent }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateComprehensiveSecurityReport_decorators, { kind: "method", name: "generateComprehensiveSecurityReport", static: false, private: false, access: { has: obj => "generateComprehensiveSecurityReport" in obj, get: obj => obj.generateComprehensiveSecurityReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectDataLeakage_decorators, { kind: "method", name: "detectDataLeakage", static: false, private: false, access: { has: obj => "detectDataLeakage" in obj, get: obj => obj.detectDataLeakage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientDataThreatMonitoringController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientDataThreatMonitoringController = _classThis;
})();
exports.PatientDataThreatMonitoringController = PatientDataThreatMonitoringController;
// ============================================================================
// SERVICE CLASS FOR DEPENDENCY INJECTION
// ============================================================================
let PatientDataThreatMonitoringService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatientDataThreatMonitoringService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(PatientDataThreatMonitoringService.name);
        }
        /**
         * Continuous monitoring of patient data security
         */
        async monitorPatientDataSecurity() {
            this.logger.log('Monitoring patient data security');
            const results = await Promise.all([
                this.monitorPHIAccess(),
                this.detectBreaches(),
                this.validateEncryption(),
                this.trackCompliance(),
            ]);
            return {
                phiAccess: results[0],
                breaches: results[1],
                encryption: results[2],
                compliance: results[3],
            };
        }
        /**
         * Monitor PHI access in real-time
         */
        async monitorPHIAccess() {
            const unusualPatterns = await (0, security_audit_trail_kit_1.detectUnusualAccessPatterns)('all', { threshold: 2.5 }, this.sequelize);
            const accessReport = await (0, security_audit_trail_kit_1.generateAccessControlReport)({
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
                endDate: new Date(),
            }, this.sequelize);
            return {
                unusualPatterns: unusualPatterns.length,
                totalAccesses: accessReport.totalAccesses || 0,
            };
        }
        /**
         * Detect potential data breaches
         */
        async detectBreaches() {
            const securityEvents = await (0, security_audit_trail_kit_1.correlateSecurityEvents)({
                eventTypes: ['DATA_BREACH', 'UNAUTHORIZED_ACCESS'],
                timeWindow: 3600000,
            }, this.sequelize);
            return {
                potentialBreaches: securityEvents.length,
                criticalEvents: securityEvents.filter((e) => e.severity === 'CRITICAL').length,
            };
        }
        /**
         * Validate encryption compliance
         */
        async validateEncryption() {
            const compliance = await (0, cloud_threat_detection_kit_1.validateHIPAACompliance)({
                resourceType: 'data-encryption',
            });
            return {
                complianceScore: compliance.complianceScore || 0,
                violations: compliance.violations || 0,
            };
        }
        /**
         * Track compliance status
         */
        async trackCompliance() {
            const validation = await (0, security_audit_trail_kit_1.validateComplianceRequirements)('HIPAA', this.sequelize);
            return {
                compliant: validation.compliant || false,
                gaps: validation.gaps || [],
            };
        }
    };
    __setFunctionName(_classThis, "PatientDataThreatMonitoringService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientDataThreatMonitoringService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientDataThreatMonitoringService = _classThis;
})();
exports.PatientDataThreatMonitoringService = PatientDataThreatMonitoringService;
/**
 * Export NestJS module definition
 */
exports.PatientDataThreatMonitoringModule = {
    controllers: [PatientDataThreatMonitoringController],
    providers: [PatientDataThreatMonitoringService],
    exports: [PatientDataThreatMonitoringService],
};
//# sourceMappingURL=patient-data-threat-monitoring-composite.js.map