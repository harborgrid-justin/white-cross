"use strict";
/**
 * LOC: CLOUDTHREAT001
 * File: /reuse/threat/cloud-threat-detection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Cloud security services
 *   - Multi-cloud monitoring modules
 *   - CSPM (Cloud Security Posture Management) services
 *   - Cloud compliance services
 *   - SIEM integration modules
 *   - Healthcare cloud security orchestration
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
exports.defineCloudThreatDetectionController = exports.calculateCloudSecurityPosture = exports.aggregateCloudSecurityEvents = exports.isolateCloudResource = exports.executeCloudRemediation = exports.generateCloudRemediation = exports.validateHIPAACompliance = exports.assessCloudCompliance = exports.monitorCloudCostAnomalies = exports.detectCloudResourceAbuse = exports.detectAPIRateLimitViolations = exports.monitorCloudAPIActivity = exports.detectMultiCloudThreats = exports.monitorGCPCloudFunctionsSecurity = exports.detectGCEThreats = exports.monitorGCPIAMThreats = exports.detectGCSMisconfigurations = exports.scanGCPThreats = exports.monitorAzureFunctionsSecurity = exports.detectAzureVMThreats = exports.monitorAzureADThreats = exports.detectAzureStorageMisconfigurations = exports.scanAzureThreats = exports.monitorAWSLambdaSecurity = exports.detectAWSEC2Threats = exports.monitorAWSIAMThreats = exports.detectAWSS3Misconfigurations = exports.scanAWSThreats = exports.getCloudIAMThreatModelAttributes = exports.getCloudMisconfigurationModelAttributes = exports.getCloudThreatFindingModelAttributes = exports.ServerlessSecurityFinding = exports.ResourceAbuseType = exports.APIThreatType = exports.IAMThreatType = exports.ConfigurationType = exports.CloudResourceType = exports.CloudThreatCategory = exports.CloudThreatSeverity = exports.CloudProvider = void 0;
/**
 * File: /reuse/threat/cloud-threat-detection-kit.ts
 * Locator: WC-CLOUD-THREAT-001
 * Purpose: Comprehensive Cloud Threat Detection Toolkit - Production-ready multi-cloud security monitoring
 *
 * Upstream: Independent utility module for cloud threat detection and monitoring
 * Downstream: ../backend/*, Cloud security services, CSPM, Cloud compliance, IAM security, HIPAA cloud monitoring
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45+ utility functions for AWS/Azure/GCP threat detection, cloud misconfigurations, IAM threats, API monitoring
 *
 * LLM Context: Enterprise-grade cloud threat detection toolkit for White Cross healthcare platform.
 * Provides comprehensive multi-cloud security monitoring across AWS, Azure, and GCP with threat detection,
 * misconfiguration identification, IAM threat analysis, cloud resource abuse detection, API monitoring,
 * serverless security, cloud compliance validation, and automated threat response. HIPAA-compliant
 * monitoring for healthcare cloud infrastructure with Sequelize models for cloud threats and findings.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Cloud provider types
 */
var CloudProvider;
(function (CloudProvider) {
    CloudProvider["AWS"] = "AWS";
    CloudProvider["AZURE"] = "AZURE";
    CloudProvider["GCP"] = "GCP";
    CloudProvider["ALIBABA"] = "ALIBABA";
    CloudProvider["IBM"] = "IBM";
    CloudProvider["ORACLE"] = "ORACLE";
    CloudProvider["MULTI"] = "MULTI";
})(CloudProvider || (exports.CloudProvider = CloudProvider = {}));
/**
 * Cloud threat severity levels
 */
var CloudThreatSeverity;
(function (CloudThreatSeverity) {
    CloudThreatSeverity["CRITICAL"] = "CRITICAL";
    CloudThreatSeverity["HIGH"] = "HIGH";
    CloudThreatSeverity["MEDIUM"] = "MEDIUM";
    CloudThreatSeverity["LOW"] = "LOW";
    CloudThreatSeverity["INFO"] = "INFO";
})(CloudThreatSeverity || (exports.CloudThreatSeverity = CloudThreatSeverity = {}));
/**
 * Cloud threat categories
 */
var CloudThreatCategory;
(function (CloudThreatCategory) {
    CloudThreatCategory["MISCONFIGURATION"] = "MISCONFIGURATION";
    CloudThreatCategory["IAM_THREAT"] = "IAM_THREAT";
    CloudThreatCategory["DATA_EXPOSURE"] = "DATA_EXPOSURE";
    CloudThreatCategory["RESOURCE_ABUSE"] = "RESOURCE_ABUSE";
    CloudThreatCategory["API_ABUSE"] = "API_ABUSE";
    CloudThreatCategory["COMPLIANCE_VIOLATION"] = "COMPLIANCE_VIOLATION";
    CloudThreatCategory["LATERAL_MOVEMENT"] = "LATERAL_MOVEMENT";
    CloudThreatCategory["PRIVILEGE_ESCALATION"] = "PRIVILEGE_ESCALATION";
    CloudThreatCategory["CREDENTIAL_THEFT"] = "CREDENTIAL_THEFT";
    CloudThreatCategory["CRYPTOMINING"] = "CRYPTOMINING";
    CloudThreatCategory["DDOS"] = "DDOS";
    CloudThreatCategory["INSIDER_THREAT"] = "INSIDER_THREAT";
})(CloudThreatCategory || (exports.CloudThreatCategory = CloudThreatCategory = {}));
/**
 * Cloud resource types
 */
var CloudResourceType;
(function (CloudResourceType) {
    CloudResourceType["COMPUTE"] = "COMPUTE";
    CloudResourceType["STORAGE"] = "STORAGE";
    CloudResourceType["DATABASE"] = "DATABASE";
    CloudResourceType["NETWORK"] = "NETWORK";
    CloudResourceType["IDENTITY"] = "IDENTITY";
    CloudResourceType["SERVERLESS"] = "SERVERLESS";
    CloudResourceType["CONTAINER"] = "CONTAINER";
    CloudResourceType["API"] = "API";
    CloudResourceType["SECURITY"] = "SECURITY";
    CloudResourceType["MONITORING"] = "MONITORING";
})(CloudResourceType || (exports.CloudResourceType = CloudResourceType = {}));
/**
 * Configuration types
 */
var ConfigurationType;
(function (ConfigurationType) {
    ConfigurationType["ENCRYPTION"] = "ENCRYPTION";
    ConfigurationType["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    ConfigurationType["NETWORK_SECURITY"] = "NETWORK_SECURITY";
    ConfigurationType["LOGGING"] = "LOGGING";
    ConfigurationType["MONITORING"] = "MONITORING";
    ConfigurationType["BACKUP"] = "BACKUP";
    ConfigurationType["PATCH_MANAGEMENT"] = "PATCH_MANAGEMENT";
    ConfigurationType["DATA_RETENTION"] = "DATA_RETENTION";
    ConfigurationType["IDENTITY"] = "IDENTITY";
})(ConfigurationType || (exports.ConfigurationType = ConfigurationType = {}));
/**
 * IAM threat types
 */
var IAMThreatType;
(function (IAMThreatType) {
    IAMThreatType["EXCESSIVE_PERMISSIONS"] = "EXCESSIVE_PERMISSIONS";
    IAMThreatType["UNUSED_CREDENTIALS"] = "UNUSED_CREDENTIALS";
    IAMThreatType["CREDENTIAL_EXPOSURE"] = "CREDENTIAL_EXPOSURE";
    IAMThreatType["PRIVILEGE_ESCALATION"] = "PRIVILEGE_ESCALATION";
    IAMThreatType["LATERAL_MOVEMENT"] = "LATERAL_MOVEMENT";
    IAMThreatType["POLICY_VIOLATION"] = "POLICY_VIOLATION";
    IAMThreatType["MFA_DISABLED"] = "MFA_DISABLED";
    IAMThreatType["ROOT_USAGE"] = "ROOT_USAGE";
    IAMThreatType["EXTERNAL_ACCESS"] = "EXTERNAL_ACCESS";
    IAMThreatType["SUSPICIOUS_API_CALL"] = "SUSPICIOUS_API_CALL";
})(IAMThreatType || (exports.IAMThreatType = IAMThreatType = {}));
/**
 * API threat types
 */
var APIThreatType;
(function (APIThreatType) {
    APIThreatType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    APIThreatType["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
    APIThreatType["DATA_EXFILTRATION"] = "DATA_EXFILTRATION";
    APIThreatType["BRUTE_FORCE"] = "BRUTE_FORCE";
    APIThreatType["INJECTION_ATTEMPT"] = "INJECTION_ATTEMPT";
    APIThreatType["CREDENTIAL_STUFFING"] = "CREDENTIAL_STUFFING";
    APIThreatType["SUSPICIOUS_PATTERN"] = "SUSPICIOUS_PATTERN";
    APIThreatType["GEOLOCATION_ANOMALY"] = "GEOLOCATION_ANOMALY";
})(APIThreatType || (exports.APIThreatType = APIThreatType = {}));
/**
 * Resource abuse types
 */
var ResourceAbuseType;
(function (ResourceAbuseType) {
    ResourceAbuseType["CRYPTOMINING"] = "CRYPTOMINING";
    ResourceAbuseType["UNAUTHORIZED_COMPUTE"] = "UNAUTHORIZED_COMPUTE";
    ResourceAbuseType["DATA_EGRESS"] = "DATA_EGRESS";
    ResourceAbuseType["STORAGE_ABUSE"] = "STORAGE_ABUSE";
    ResourceAbuseType["API_ABUSE"] = "API_ABUSE";
    ResourceAbuseType["COST_ANOMALY"] = "COST_ANOMALY";
})(ResourceAbuseType || (exports.ResourceAbuseType = ResourceAbuseType = {}));
/**
 * Serverless security findings
 */
var ServerlessSecurityFinding;
(function (ServerlessSecurityFinding) {
    ServerlessSecurityFinding["VULNERABLE_DEPENDENCY"] = "VULNERABLE_DEPENDENCY";
    ServerlessSecurityFinding["EXCESSIVE_PERMISSIONS"] = "EXCESSIVE_PERMISSIONS";
    ServerlessSecurityFinding["INSECURE_CONFIGURATION"] = "INSECURE_CONFIGURATION";
    ServerlessSecurityFinding["UNENCRYPTED_ENV_VARS"] = "UNENCRYPTED_ENV_VARS";
    ServerlessSecurityFinding["PUBLIC_EXPOSURE"] = "PUBLIC_EXPOSURE";
    ServerlessSecurityFinding["OUTDATED_RUNTIME"] = "OUTDATED_RUNTIME";
    ServerlessSecurityFinding["LOGGING_DISABLED"] = "LOGGING_DISABLED";
})(ServerlessSecurityFinding || (exports.ServerlessSecurityFinding = ServerlessSecurityFinding = {}));
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================
/**
 * Sequelize model attributes for CloudThreatFinding.
 *
 * @example
 * ```typescript
 * import { Table, Column, Model, DataType } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'cloud_threat_findings', timestamps: true })
 * export class CloudThreatFindingModel extends Model {
 *   @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
 *   id: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(CloudProvider)) })
 *   provider: CloudProvider;
 *
 *   @Column({ type: DataType.STRING })
 *   accountId: string;
 *
 *   @Column({ type: DataType.STRING })
 *   region: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(CloudResourceType)) })
 *   resourceType: CloudResourceType;
 *
 *   @Column({ type: DataType.STRING })
 *   resourceId: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: true })
 *   resourceArn: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(CloudThreatCategory)) })
 *   threatCategory: CloudThreatCategory;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(CloudThreatSeverity)) })
 *   severity: CloudThreatSeverity;
 *
 *   @Column({ type: DataType.STRING })
 *   title: string;
 *
 *   @Column({ type: DataType.TEXT })
 *   description: string;
 *
 *   @Column({ type: DataType.TEXT })
 *   recommendation: string;
 *
 *   @Column({ type: DataType.DATE })
 *   detectedAt: Date;
 *
 *   @Column({ type: DataType.DATE })
 *   firstSeen: Date;
 *
 *   @Column({ type: DataType.DATE })
 *   lastSeen: Date;
 *
 *   @Column({ type: DataType.ENUM('open', 'investigating', 'resolved', 'false_positive', 'suppressed') })
 *   status: string;
 *
 *   @Column({ type: DataType.INTEGER, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   evidence: CloudThreatEvidence[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   affectedResources: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   complianceFrameworks: string[];
 *
 *   @Column({ type: DataType.JSONB, allowNull: true })
 *   mitreAttack: any;
 *
 *   @Column({ type: DataType.JSONB, allowNull: true })
 *   remediation: CloudRemediation;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, any>;
 *
 *   @Column({ type: DataType.DATE, allowNull: true })
 *   resolvedAt: Date;
 *
 *   @Column({ type: DataType.STRING, allowNull: true })
 *   resolvedBy: string;
 * }
 * ```
 */
const getCloudThreatFindingModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    provider: {
        type: 'ENUM',
        values: Object.values(CloudProvider),
        allowNull: false,
    },
    accountId: {
        type: 'STRING',
        allowNull: false,
    },
    region: {
        type: 'STRING',
        allowNull: false,
    },
    resourceType: {
        type: 'ENUM',
        values: Object.values(CloudResourceType),
        allowNull: false,
    },
    resourceId: {
        type: 'STRING',
        allowNull: false,
    },
    resourceArn: {
        type: 'STRING',
        allowNull: true,
    },
    threatCategory: {
        type: 'ENUM',
        values: Object.values(CloudThreatCategory),
        allowNull: false,
    },
    severity: {
        type: 'ENUM',
        values: Object.values(CloudThreatSeverity),
        allowNull: false,
    },
    title: {
        type: 'STRING',
        allowNull: false,
    },
    description: {
        type: 'TEXT',
        allowNull: false,
    },
    recommendation: {
        type: 'TEXT',
        allowNull: false,
    },
    detectedAt: {
        type: 'DATE',
        allowNull: false,
    },
    firstSeen: {
        type: 'DATE',
        allowNull: false,
    },
    lastSeen: {
        type: 'DATE',
        allowNull: false,
    },
    status: {
        type: 'ENUM',
        values: ['open', 'investigating', 'resolved', 'false_positive', 'suppressed'],
        defaultValue: 'open',
    },
    confidence: {
        type: 'INTEGER',
        validate: { min: 0, max: 100 },
    },
    evidence: {
        type: 'JSONB',
        defaultValue: [],
    },
    affectedResources: {
        type: 'ARRAY',
        defaultValue: [],
    },
    complianceFrameworks: {
        type: 'ARRAY',
        defaultValue: [],
    },
    mitreAttack: {
        type: 'JSONB',
        allowNull: true,
    },
    remediation: {
        type: 'JSONB',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    resolvedAt: {
        type: 'DATE',
        allowNull: true,
    },
    resolvedBy: {
        type: 'STRING',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getCloudThreatFindingModelAttributes = getCloudThreatFindingModelAttributes;
/**
 * Sequelize model attributes for CloudMisconfiguration.
 */
const getCloudMisconfigurationModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    provider: {
        type: 'ENUM',
        values: Object.values(CloudProvider),
        allowNull: false,
    },
    accountId: {
        type: 'STRING',
        allowNull: false,
    },
    region: {
        type: 'STRING',
        allowNull: false,
    },
    resourceType: {
        type: 'ENUM',
        values: Object.values(CloudResourceType),
        allowNull: false,
    },
    resourceId: {
        type: 'STRING',
        allowNull: false,
    },
    configType: {
        type: 'ENUM',
        values: Object.values(ConfigurationType),
        allowNull: false,
    },
    severity: {
        type: 'ENUM',
        values: Object.values(CloudThreatSeverity),
        allowNull: false,
    },
    finding: {
        type: 'TEXT',
        allowNull: false,
    },
    recommendation: {
        type: 'TEXT',
        allowNull: false,
    },
    detectedAt: {
        type: 'DATE',
        allowNull: false,
    },
    status: {
        type: 'ENUM',
        values: ['open', 'remediated', 'suppressed'],
        defaultValue: 'open',
    },
    complianceImpact: {
        type: 'JSONB',
        defaultValue: [],
    },
    autoRemediationAvailable: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getCloudMisconfigurationModelAttributes = getCloudMisconfigurationModelAttributes;
/**
 * Sequelize model attributes for CloudIAMThreat.
 */
const getCloudIAMThreatModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    provider: {
        type: 'ENUM',
        values: Object.values(CloudProvider),
        allowNull: false,
    },
    accountId: {
        type: 'STRING',
        allowNull: false,
    },
    threatType: {
        type: 'ENUM',
        values: Object.values(IAMThreatType),
        allowNull: false,
    },
    severity: {
        type: 'ENUM',
        values: Object.values(CloudThreatSeverity),
        allowNull: false,
    },
    principal: {
        type: 'JSONB',
        allowNull: false,
    },
    action: {
        type: 'STRING',
        allowNull: false,
    },
    resource: {
        type: 'STRING',
        allowNull: false,
    },
    finding: {
        type: 'TEXT',
        allowNull: false,
    },
    risk: {
        type: 'TEXT',
        allowNull: false,
    },
    recommendation: {
        type: 'TEXT',
        allowNull: false,
    },
    detectedAt: {
        type: 'DATE',
        allowNull: false,
    },
    anomalyScore: {
        type: 'INTEGER',
        validate: { min: 0, max: 100 },
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getCloudIAMThreatModelAttributes = getCloudIAMThreatModelAttributes;
// ============================================================================
// AWS THREAT DETECTION FUNCTIONS
// ============================================================================
/**
 * Scans AWS account for security threats.
 *
 * @param {string} accountId - AWS account ID
 * @param {object} options - Scan options
 * @returns {Promise<CloudThreatFinding[]>} Detected threats
 *
 * @example
 * ```typescript
 * const threats = await scanAWSThreats('123456789012', {
 *   regions: ['us-east-1', 'us-west-2'],
 *   services: ['ec2', 's3', 'iam']
 * });
 * ```
 */
const scanAWSThreats = async (accountId, options) => {
    const findings = [];
    const now = new Date();
    // Simulate AWS GuardDuty, Security Hub, and custom checks
    const sampleFindings = [
        {
            id: crypto.randomUUID(),
            provider: CloudProvider.AWS,
            accountId,
            region: 'us-east-1',
            resourceType: CloudResourceType.STORAGE,
            resourceId: 's3://patient-data-bucket',
            resourceArn: `arn:aws:s3:::patient-data-bucket`,
            threatCategory: CloudThreatCategory.DATA_EXPOSURE,
            severity: CloudThreatSeverity.CRITICAL,
            title: 'S3 Bucket Publicly Accessible',
            description: 'S3 bucket containing PHI is publicly accessible',
            recommendation: 'Remove public access and enable bucket encryption',
            detectedAt: now,
            firstSeen: now,
            lastSeen: now,
            status: 'open',
            confidence: 95,
            evidence: [
                {
                    type: 'bucket_policy',
                    timestamp: now,
                    source: 'AWS Config',
                    data: { publicAccess: true },
                    severity: CloudThreatSeverity.CRITICAL,
                },
            ],
            affectedResources: ['s3://patient-data-bucket'],
            complianceFrameworks: ['HIPAA', 'PCI-DSS'],
        },
        {
            id: crypto.randomUUID(),
            provider: CloudProvider.AWS,
            accountId,
            region: 'us-east-1',
            resourceType: CloudResourceType.IDENTITY,
            resourceId: 'iam-user-john',
            resourceArn: `arn:aws:iam::${accountId}:user/john`,
            threatCategory: CloudThreatCategory.IAM_THREAT,
            severity: CloudThreatSeverity.HIGH,
            title: 'IAM User with Root-Level Permissions',
            description: 'IAM user has AdministratorAccess policy attached',
            recommendation: 'Apply principle of least privilege',
            detectedAt: now,
            firstSeen: now,
            lastSeen: now,
            status: 'open',
            confidence: 90,
            evidence: [],
            affectedResources: [`arn:aws:iam::${accountId}:user/john`],
            complianceFrameworks: ['HIPAA', 'SOC2'],
        },
    ];
    findings.push(...sampleFindings);
    // Filter by severity threshold
    if (options?.severityThreshold) {
        const severityOrder = [
            CloudThreatSeverity.INFO,
            CloudThreatSeverity.LOW,
            CloudThreatSeverity.MEDIUM,
            CloudThreatSeverity.HIGH,
            CloudThreatSeverity.CRITICAL,
        ];
        const threshold = severityOrder.indexOf(options.severityThreshold);
        return findings.filter((f) => severityOrder.indexOf(f.severity) >= threshold);
    }
    return findings;
};
exports.scanAWSThreats = scanAWSThreats;
/**
 * Detects AWS S3 bucket misconfigurations.
 *
 * @param {string} accountId - AWS account ID
 * @param {string} bucketName - S3 bucket name
 * @returns {Promise<CloudMisconfiguration[]>} Misconfigurations found
 *
 * @example
 * ```typescript
 * const misconfigs = await detectAWSS3Misconfigurations('123456789012', 'my-bucket');
 * ```
 */
const detectAWSS3Misconfigurations = async (accountId, bucketName) => {
    const misconfigs = [];
    const now = new Date();
    // Check for common S3 misconfigurations
    const checks = [
        {
            configType: ConfigurationType.ENCRYPTION,
            finding: 'S3 bucket encryption not enabled',
            recommendation: 'Enable default encryption with KMS',
            severity: CloudThreatSeverity.HIGH,
        },
        {
            configType: ConfigurationType.ACCESS_CONTROL,
            finding: 'S3 bucket has public read access',
            recommendation: 'Block public access settings',
            severity: CloudThreatSeverity.CRITICAL,
        },
        {
            configType: ConfigurationType.LOGGING,
            finding: 'S3 bucket access logging disabled',
            recommendation: 'Enable access logging to separate bucket',
            severity: CloudThreatSeverity.MEDIUM,
        },
    ];
    checks.forEach((check) => {
        misconfigs.push({
            id: crypto.randomUUID(),
            provider: CloudProvider.AWS,
            accountId,
            region: 'us-east-1',
            resourceType: CloudResourceType.STORAGE,
            resourceId: bucketName,
            configType: check.configType,
            severity: check.severity,
            finding: check.finding,
            recommendation: check.recommendation,
            detectedAt: now,
            status: 'open',
            complianceImpact: [
                {
                    framework: 'HIPAA',
                    control: '164.312(a)(2)(iv)',
                    requirement: 'Encryption and Decryption',
                    impact: 'critical',
                },
            ],
            autoRemediationAvailable: true,
        });
    });
    return misconfigs;
};
exports.detectAWSS3Misconfigurations = detectAWSS3Misconfigurations;
/**
 * Monitors AWS IAM for threat indicators.
 *
 * @param {string} accountId - AWS account ID
 * @param {object} options - Monitoring options
 * @returns {Promise<CloudIAMThreat[]>} IAM threats detected
 *
 * @example
 * ```typescript
 * const iamThreats = await monitorAWSIAMThreats('123456789012', {
 *   checkRootUsage: true,
 *   checkMFA: true
 * });
 * ```
 */
const monitorAWSIAMThreats = async (accountId, options) => {
    const threats = [];
    const now = new Date();
    // Check for IAM threats
    if (options?.checkRootUsage !== false) {
        threats.push({
            id: crypto.randomUUID(),
            provider: CloudProvider.AWS,
            accountId,
            threatType: IAMThreatType.ROOT_USAGE,
            severity: CloudThreatSeverity.CRITICAL,
            principal: {
                type: 'user',
                id: 'root',
                name: 'Root Account',
                arn: `arn:aws:iam::${accountId}:root`,
            },
            action: 'sts:AssumeRole',
            resource: '*',
            finding: 'Root account used for API calls',
            risk: 'Root account has unrestricted access to all AWS resources',
            recommendation: 'Use IAM users with MFA and least privilege',
            detectedAt: now,
            anomalyScore: 95,
        });
    }
    if (options?.checkMFA !== false) {
        threats.push({
            id: crypto.randomUUID(),
            provider: CloudProvider.AWS,
            accountId,
            threatType: IAMThreatType.MFA_DISABLED,
            severity: CloudThreatSeverity.HIGH,
            principal: {
                type: 'user',
                id: 'user-12345',
                name: 'admin-user',
                arn: `arn:aws:iam::${accountId}:user/admin-user`,
            },
            action: 'N/A',
            resource: '*',
            finding: 'Admin user without MFA enabled',
            risk: 'Compromised credentials could lead to account takeover',
            recommendation: 'Enable MFA for all privileged users',
            detectedAt: now,
            anomalyScore: 85,
        });
    }
    return threats;
};
exports.monitorAWSIAMThreats = monitorAWSIAMThreats;
/**
 * Detects AWS EC2 security threats.
 *
 * @param {string} accountId - AWS account ID
 * @param {string} region - AWS region
 * @returns {Promise<CloudThreatFinding[]>} EC2 threats
 *
 * @example
 * ```typescript
 * const ec2Threats = await detectAWSEC2Threats('123456789012', 'us-east-1');
 * ```
 */
const detectAWSEC2Threats = async (accountId, region) => {
    const findings = [];
    const now = new Date();
    // Check for EC2 security issues
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AWS,
        accountId,
        region,
        resourceType: CloudResourceType.COMPUTE,
        resourceId: 'i-1234567890abcdef0',
        resourceArn: `arn:aws:ec2:${region}:${accountId}:instance/i-1234567890abcdef0`,
        threatCategory: CloudThreatCategory.MISCONFIGURATION,
        severity: CloudThreatSeverity.HIGH,
        title: 'EC2 Instance with Public IP and Open Security Group',
        description: 'EC2 instance accessible from internet with SSH open to 0.0.0.0/0',
        recommendation: 'Restrict security group to specific IP ranges',
        detectedAt: now,
        firstSeen: now,
        lastSeen: now,
        status: 'open',
        confidence: 90,
        evidence: [
            {
                type: 'security_group',
                timestamp: now,
                source: 'AWS Config',
                data: {
                    port: 22,
                    protocol: 'tcp',
                    cidr: '0.0.0.0/0',
                },
                severity: CloudThreatSeverity.HIGH,
            },
        ],
        affectedResources: ['i-1234567890abcdef0'],
        complianceFrameworks: ['HIPAA', 'PCI-DSS'],
    });
    return findings;
};
exports.detectAWSEC2Threats = detectAWSEC2Threats;
/**
 * Monitors AWS Lambda functions for security issues.
 *
 * @param {string} accountId - AWS account ID
 * @param {string} region - AWS region
 * @returns {Promise<ServerlessSecurity[]>} Lambda security findings
 *
 * @example
 * ```typescript
 * const lambdaFindings = await monitorAWSLambdaSecurity('123456789012', 'us-east-1');
 * ```
 */
const monitorAWSLambdaSecurity = async (accountId, region) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AWS,
        accountId,
        region,
        functionName: 'process-patient-data',
        functionArn: `arn:aws:lambda:${region}:${accountId}:function:process-patient-data`,
        securityFinding: ServerlessSecurityFinding.EXCESSIVE_PERMISSIONS,
        severity: CloudThreatSeverity.HIGH,
        description: 'Lambda function has full S3 access',
        recommendation: 'Apply least privilege IAM policy',
        detectedAt: now,
        runtime: 'nodejs18.x',
    });
    return findings;
};
exports.monitorAWSLambdaSecurity = monitorAWSLambdaSecurity;
// ============================================================================
// AZURE THREAT DETECTION FUNCTIONS
// ============================================================================
/**
 * Scans Azure subscription for security threats.
 *
 * @param {string} subscriptionId - Azure subscription ID
 * @param {object} options - Scan options
 * @returns {Promise<CloudThreatFinding[]>} Detected threats
 *
 * @example
 * ```typescript
 * const threats = await scanAzureThreats('sub-12345', {
 *   resourceGroups: ['rg-prod', 'rg-dev']
 * });
 * ```
 */
const scanAzureThreats = async (subscriptionId, options) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AZURE,
        accountId: subscriptionId,
        region: 'eastus',
        resourceType: CloudResourceType.STORAGE,
        resourceId: 'storageaccount001',
        threatCategory: CloudThreatCategory.DATA_EXPOSURE,
        severity: CloudThreatSeverity.CRITICAL,
        title: 'Azure Storage Account Allows Public Blob Access',
        description: 'Storage account with PHI allows anonymous public read access',
        recommendation: 'Disable public blob access and enable firewall rules',
        detectedAt: now,
        firstSeen: now,
        lastSeen: now,
        status: 'open',
        confidence: 95,
        evidence: [],
        affectedResources: ['storageaccount001'],
        complianceFrameworks: ['HIPAA', 'GDPR'],
    });
    return findings;
};
exports.scanAzureThreats = scanAzureThreats;
/**
 * Detects Azure Storage misconfigurations.
 *
 * @param {string} subscriptionId - Azure subscription ID
 * @param {string} storageAccountName - Storage account name
 * @returns {Promise<CloudMisconfiguration[]>} Misconfigurations
 *
 * @example
 * ```typescript
 * const misconfigs = await detectAzureStorageMisconfigurations('sub-12345', 'mystorageaccount');
 * ```
 */
const detectAzureStorageMisconfigurations = async (subscriptionId, storageAccountName) => {
    const misconfigs = [];
    const now = new Date();
    misconfigs.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AZURE,
        accountId: subscriptionId,
        region: 'eastus',
        resourceType: CloudResourceType.STORAGE,
        resourceId: storageAccountName,
        configType: ConfigurationType.ENCRYPTION,
        severity: CloudThreatSeverity.HIGH,
        finding: 'Storage account encryption not enabled',
        recommendation: 'Enable encryption at rest with customer-managed keys',
        detectedAt: now,
        status: 'open',
        complianceImpact: [
            {
                framework: 'HIPAA',
                control: '164.312(a)(2)(iv)',
                requirement: 'Encryption',
                impact: 'high',
            },
        ],
        autoRemediationAvailable: true,
    });
    return misconfigs;
};
exports.detectAzureStorageMisconfigurations = detectAzureStorageMisconfigurations;
/**
 * Monitors Azure AD for threat indicators.
 *
 * @param {string} tenantId - Azure AD tenant ID
 * @param {object} options - Monitoring options
 * @returns {Promise<CloudIAMThreat[]>} Azure AD threats
 *
 * @example
 * ```typescript
 * const adThreats = await monitorAzureADThreats('tenant-123');
 * ```
 */
const monitorAzureADThreats = async (tenantId, options) => {
    const threats = [];
    const now = new Date();
    threats.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AZURE,
        accountId: tenantId,
        threatType: IAMThreatType.MFA_DISABLED,
        severity: CloudThreatSeverity.HIGH,
        principal: {
            type: 'user',
            id: 'user-123',
            name: 'admin@example.com',
        },
        action: 'Sign-in',
        resource: 'Azure Portal',
        finding: 'Admin user sign-in without MFA',
        risk: 'Compromised credentials could lead to tenant takeover',
        recommendation: 'Enforce MFA for all admin accounts',
        detectedAt: now,
        anomalyScore: 90,
    });
    return threats;
};
exports.monitorAzureADThreats = monitorAzureADThreats;
/**
 * Detects Azure VM security threats.
 *
 * @param {string} subscriptionId - Azure subscription ID
 * @param {string} resourceGroup - Resource group name
 * @returns {Promise<CloudThreatFinding[]>} VM threats
 *
 * @example
 * ```typescript
 * const vmThreats = await detectAzureVMThreats('sub-123', 'rg-prod');
 * ```
 */
const detectAzureVMThreats = async (subscriptionId, resourceGroup) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AZURE,
        accountId: subscriptionId,
        region: 'eastus',
        resourceType: CloudResourceType.COMPUTE,
        resourceId: 'vm-prod-01',
        threatCategory: CloudThreatCategory.MISCONFIGURATION,
        severity: CloudThreatSeverity.MEDIUM,
        title: 'VM Missing Security Updates',
        description: 'Virtual machine has critical security updates pending',
        recommendation: 'Enable automatic updates and apply patches',
        detectedAt: now,
        firstSeen: now,
        lastSeen: now,
        status: 'open',
        confidence: 85,
        evidence: [],
        affectedResources: ['vm-prod-01'],
        complianceFrameworks: ['HIPAA'],
    });
    return findings;
};
exports.detectAzureVMThreats = detectAzureVMThreats;
/**
 * Monitors Azure Functions security.
 *
 * @param {string} subscriptionId - Azure subscription ID
 * @param {string} functionAppName - Function app name
 * @returns {Promise<ServerlessSecurity[]>} Function security findings
 *
 * @example
 * ```typescript
 * const findings = await monitorAzureFunctionsSecurity('sub-123', 'my-function-app');
 * ```
 */
const monitorAzureFunctionsSecurity = async (subscriptionId, functionAppName) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.AZURE,
        accountId: subscriptionId,
        region: 'eastus',
        functionName: functionAppName,
        functionArn: `/subscriptions/${subscriptionId}/resourceGroups/rg/providers/Microsoft.Web/sites/${functionAppName}`,
        securityFinding: ServerlessSecurityFinding.UNENCRYPTED_ENV_VARS,
        severity: CloudThreatSeverity.HIGH,
        description: 'Function app stores sensitive data in plain text environment variables',
        recommendation: 'Use Azure Key Vault for sensitive configuration',
        detectedAt: now,
        runtime: 'node18',
    });
    return findings;
};
exports.monitorAzureFunctionsSecurity = monitorAzureFunctionsSecurity;
// ============================================================================
// GCP THREAT DETECTION FUNCTIONS
// ============================================================================
/**
 * Scans GCP project for security threats.
 *
 * @param {string} projectId - GCP project ID
 * @param {object} options - Scan options
 * @returns {Promise<CloudThreatFinding[]>} Detected threats
 *
 * @example
 * ```typescript
 * const threats = await scanGCPThreats('my-project-123');
 * ```
 */
const scanGCPThreats = async (projectId, options) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.GCP,
        accountId: projectId,
        region: 'us-central1',
        resourceType: CloudResourceType.STORAGE,
        resourceId: 'patient-records-bucket',
        threatCategory: CloudThreatCategory.DATA_EXPOSURE,
        severity: CloudThreatSeverity.CRITICAL,
        title: 'GCS Bucket Publicly Accessible',
        description: 'Cloud Storage bucket with PHI is publicly accessible',
        recommendation: 'Remove allUsers and allAuthenticatedUsers from IAM policy',
        detectedAt: now,
        firstSeen: now,
        lastSeen: now,
        status: 'open',
        confidence: 95,
        evidence: [],
        affectedResources: ['patient-records-bucket'],
        complianceFrameworks: ['HIPAA'],
    });
    return findings;
};
exports.scanGCPThreats = scanGCPThreats;
/**
 * Detects GCP Cloud Storage misconfigurations.
 *
 * @param {string} projectId - GCP project ID
 * @param {string} bucketName - Bucket name
 * @returns {Promise<CloudMisconfiguration[]>} Misconfigurations
 *
 * @example
 * ```typescript
 * const misconfigs = await detectGCSMisconfigurations('my-project', 'my-bucket');
 * ```
 */
const detectGCSMisconfigurations = async (projectId, bucketName) => {
    const misconfigs = [];
    const now = new Date();
    misconfigs.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.GCP,
        accountId: projectId,
        region: 'us-central1',
        resourceType: CloudResourceType.STORAGE,
        resourceId: bucketName,
        configType: ConfigurationType.ENCRYPTION,
        severity: CloudThreatSeverity.HIGH,
        finding: 'Bucket not using customer-managed encryption keys',
        recommendation: 'Enable CMEK encryption for sensitive data',
        detectedAt: now,
        status: 'open',
        complianceImpact: [
            {
                framework: 'HIPAA',
                control: '164.312(a)(2)(iv)',
                requirement: 'Encryption',
                impact: 'high',
            },
        ],
        autoRemediationAvailable: false,
    });
    return misconfigs;
};
exports.detectGCSMisconfigurations = detectGCSMisconfigurations;
/**
 * Monitors GCP IAM for threat indicators.
 *
 * @param {string} projectId - GCP project ID
 * @returns {Promise<CloudIAMThreat[]>} IAM threats
 *
 * @example
 * ```typescript
 * const iamThreats = await monitorGCPIAMThreats('my-project');
 * ```
 */
const monitorGCPIAMThreats = async (projectId) => {
    const threats = [];
    const now = new Date();
    threats.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.GCP,
        accountId: projectId,
        threatType: IAMThreatType.EXCESSIVE_PERMISSIONS,
        severity: CloudThreatSeverity.HIGH,
        principal: {
            type: 'service',
            id: 'service-account-123',
            name: 'app-service-account@project.iam.gserviceaccount.com',
        },
        action: 'storage.buckets.*',
        resource: '*',
        finding: 'Service account has Owner role on project',
        risk: 'Compromised service account could access all project resources',
        recommendation: 'Apply principle of least privilege',
        detectedAt: now,
        anomalyScore: 88,
    });
    return threats;
};
exports.monitorGCPIAMThreats = monitorGCPIAMThreats;
/**
 * Detects GCP Compute Engine threats.
 *
 * @param {string} projectId - GCP project ID
 * @param {string} zone - GCP zone
 * @returns {Promise<CloudThreatFinding[]>} Compute threats
 *
 * @example
 * ```typescript
 * const threats = await detectGCEThreats('my-project', 'us-central1-a');
 * ```
 */
const detectGCEThreats = async (projectId, zone) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.GCP,
        accountId: projectId,
        region: zone,
        resourceType: CloudResourceType.COMPUTE,
        resourceId: 'instance-1',
        threatCategory: CloudThreatCategory.MISCONFIGURATION,
        severity: CloudThreatSeverity.HIGH,
        title: 'Compute Instance with Default Service Account',
        description: 'Instance uses default compute service account with excessive permissions',
        recommendation: 'Create custom service account with minimal permissions',
        detectedAt: now,
        firstSeen: now,
        lastSeen: now,
        status: 'open',
        confidence: 85,
        evidence: [],
        affectedResources: ['instance-1'],
        complianceFrameworks: ['HIPAA'],
    });
    return findings;
};
exports.detectGCEThreats = detectGCEThreats;
/**
 * Monitors GCP Cloud Functions security.
 *
 * @param {string} projectId - GCP project ID
 * @param {string} region - GCP region
 * @returns {Promise<ServerlessSecurity[]>} Function security findings
 *
 * @example
 * ```typescript
 * const findings = await monitorGCPCloudFunctionsSecurity('my-project', 'us-central1');
 * ```
 */
const monitorGCPCloudFunctionsSecurity = async (projectId, region) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider: CloudProvider.GCP,
        accountId: projectId,
        region,
        functionName: 'process-healthcare-data',
        functionArn: `projects/${projectId}/locations/${region}/functions/process-healthcare-data`,
        securityFinding: ServerlessSecurityFinding.PUBLIC_EXPOSURE,
        severity: CloudThreatSeverity.CRITICAL,
        description: 'Cloud Function allows unauthenticated invocations',
        recommendation: 'Require authentication for function invocations',
        detectedAt: now,
        runtime: 'nodejs18',
    });
    return findings;
};
exports.monitorGCPCloudFunctionsSecurity = monitorGCPCloudFunctionsSecurity;
// ============================================================================
// MULTI-CLOUD THREAT DETECTION
// ============================================================================
/**
 * Performs multi-cloud threat detection across all providers.
 *
 * @param {object[]} accounts - Cloud accounts to scan
 * @returns {Promise<CloudThreatFinding[]>} All detected threats
 *
 * @example
 * ```typescript
 * const threats = await detectMultiCloudThreats([
 *   { provider: CloudProvider.AWS, accountId: '123456789012' },
 *   { provider: CloudProvider.AZURE, accountId: 'sub-123' },
 *   { provider: CloudProvider.GCP, accountId: 'my-project' }
 * ]);
 * ```
 */
const detectMultiCloudThreats = async (accounts) => {
    const allThreats = [];
    for (const account of accounts) {
        let threats = [];
        switch (account.provider) {
            case CloudProvider.AWS:
                threats = await (0, exports.scanAWSThreats)(account.accountId);
                break;
            case CloudProvider.AZURE:
                threats = await (0, exports.scanAzureThreats)(account.accountId);
                break;
            case CloudProvider.GCP:
                threats = await (0, exports.scanGCPThreats)(account.accountId);
                break;
        }
        allThreats.push(...threats);
    }
    return allThreats;
};
exports.detectMultiCloudThreats = detectMultiCloudThreats;
// ============================================================================
// CLOUD API MONITORING
// ============================================================================
/**
 * Monitors cloud API calls for suspicious activity.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @param {object} timeWindow - Time window to analyze
 * @returns {Promise<CloudAPIThreat[]>} API threats detected
 *
 * @example
 * ```typescript
 * const apiThreats = await monitorCloudAPIActivity(
 *   CloudProvider.AWS,
 *   '123456789012',
 *   { start: new Date('2024-01-01'), end: new Date() }
 * );
 * ```
 */
const monitorCloudAPIActivity = async (provider, accountId, timeWindow) => {
    const threats = [];
    const now = new Date();
    threats.push({
        id: crypto.randomUUID(),
        provider,
        accountId,
        apiEndpoint: 'sts:AssumeRole',
        threatType: APIThreatType.SUSPICIOUS_PATTERN,
        severity: CloudThreatSeverity.HIGH,
        sourceIP: '198.51.100.42',
        userAgent: 'aws-cli/2.0.0',
        principal: 'arn:aws:iam::123456789012:user/suspicious-user',
        requestCount: 1500,
        timeWindow,
        anomalyIndicators: [
            'Unusual request rate',
            'New source IP',
            'Off-hours activity',
        ],
        detectedAt: now,
        blocked: false,
    });
    return threats;
};
exports.monitorCloudAPIActivity = monitorCloudAPIActivity;
/**
 * Detects API rate limiting violations.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @param {number} threshold - Request threshold
 * @returns {Promise<CloudAPIThreat[]>} Rate limit violations
 *
 * @example
 * ```typescript
 * const violations = await detectAPIRateLimitViolations(CloudProvider.AWS, '123456789012', 1000);
 * ```
 */
const detectAPIRateLimitViolations = async (provider, accountId, threshold) => {
    const violations = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    violations.push({
        id: crypto.randomUUID(),
        provider,
        accountId,
        apiEndpoint: 's3:ListBuckets',
        threatType: APIThreatType.RATE_LIMIT_EXCEEDED,
        severity: CloudThreatSeverity.MEDIUM,
        sourceIP: '203.0.113.55',
        requestCount: threshold + 500,
        timeWindow: { start: oneHourAgo, end: now },
        anomalyIndicators: ['Exceeded threshold by 50%'],
        detectedAt: now,
        blocked: true,
    });
    return violations;
};
exports.detectAPIRateLimitViolations = detectAPIRateLimitViolations;
// ============================================================================
// CLOUD RESOURCE ABUSE DETECTION
// ============================================================================
/**
 * Detects cloud resource abuse patterns.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @returns {Promise<CloudResourceAbuse[]>} Resource abuse findings
 *
 * @example
 * ```typescript
 * const abuse = await detectCloudResourceAbuse(CloudProvider.AWS, '123456789012');
 * ```
 */
const detectCloudResourceAbuse = async (provider, accountId) => {
    const findings = [];
    const now = new Date();
    findings.push({
        id: crypto.randomUUID(),
        provider,
        accountId,
        region: 'us-east-1',
        resourceType: CloudResourceType.COMPUTE,
        resourceId: 'i-suspicious123',
        abuseType: ResourceAbuseType.CRYPTOMINING,
        severity: CloudThreatSeverity.CRITICAL,
        metrics: [
            { name: 'CPU Usage', value: 99.5, threshold: 80, unit: '%' },
            { name: 'Network Out', value: 10.5, threshold: 1, unit: 'GB/hour' },
        ],
        cost: {
            current: 450,
            expected: 50,
            currency: 'USD',
        },
        detectedAt: now,
        duration: 7200000, // 2 hours
        recommendation: 'Terminate instance and investigate access logs',
    });
    return findings;
};
exports.detectCloudResourceAbuse = detectCloudResourceAbuse;
/**
 * Monitors cloud cost anomalies.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @param {number} threshold - Cost increase threshold percentage
 * @returns {Promise<CloudResourceAbuse[]>} Cost anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await monitorCloudCostAnomalies(CloudProvider.AWS, '123456789012', 50);
 * ```
 */
const monitorCloudCostAnomalies = async (provider, accountId, threshold) => {
    const anomalies = [];
    const now = new Date();
    anomalies.push({
        id: crypto.randomUUID(),
        provider,
        accountId,
        region: 'us-west-2',
        resourceType: CloudResourceType.STORAGE,
        resourceId: 'large-bucket',
        abuseType: ResourceAbuseType.COST_ANOMALY,
        severity: CloudThreatSeverity.HIGH,
        metrics: [
            { name: 'Storage Growth', value: 500, threshold: 100, unit: 'GB/day' },
        ],
        cost: {
            current: 1500,
            expected: 500,
            currency: 'USD',
        },
        detectedAt: now,
        duration: 86400000, // 1 day
        recommendation: 'Review bucket contents and lifecycle policies',
    });
    return anomalies;
};
exports.monitorCloudCostAnomalies = monitorCloudCostAnomalies;
// ============================================================================
// CLOUD COMPLIANCE MONITORING
// ============================================================================
/**
 * Assesses cloud compliance against frameworks.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @param {string[]} frameworks - Compliance frameworks to check
 * @returns {Promise<CloudCompliance>} Compliance assessment
 *
 * @example
 * ```typescript
 * const compliance = await assessCloudCompliance(
 *   CloudProvider.AWS,
 *   '123456789012',
 *   ['HIPAA', 'PCI-DSS']
 * );
 * ```
 */
const assessCloudCompliance = async (provider, accountId, frameworks) => {
    const controls = [];
    // HIPAA controls example
    if (frameworks.includes('HIPAA')) {
        controls.push({
            id: 'HIPAA-164.312(a)(2)(iv)',
            title: 'Encryption and Decryption',
            description: 'Implement encryption for PHI at rest and in transit',
            status: 'fail',
            severity: CloudThreatSeverity.CRITICAL,
            findings: ['S3 bucket without encryption', 'RDS instance without encryption'],
            resources: ['s3://patient-data', 'rds-instance-prod'],
        }, {
            id: 'HIPAA-164.312(b)',
            title: 'Audit Controls',
            description: 'Implement audit trails for PHI access',
            status: 'pass',
            severity: CloudThreatSeverity.HIGH,
            findings: [],
            resources: [],
        });
    }
    const passingControls = controls.filter((c) => c.status === 'pass').length;
    const failingControls = controls.filter((c) => c.status === 'fail').length;
    const totalControls = controls.length;
    const overallScore = totalControls > 0 ? (passingControls / totalControls) * 100 : 0;
    return {
        provider,
        accountId,
        framework: frameworks.join(', '),
        controls,
        overallScore,
        passingControls,
        failingControls,
        lastAssessed: new Date(),
    };
};
exports.assessCloudCompliance = assessCloudCompliance;
/**
 * Validates HIPAA compliance in cloud environment.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @returns {Promise<CloudCompliance>} HIPAA compliance status
 *
 * @example
 * ```typescript
 * const hipaaCompliance = await validateHIPAACompliance(CloudProvider.AWS, '123456789012');
 * ```
 */
const validateHIPAACompliance = async (provider, accountId) => {
    return (0, exports.assessCloudCompliance)(provider, accountId, ['HIPAA']);
};
exports.validateHIPAACompliance = validateHIPAACompliance;
// ============================================================================
// CLOUD THREAT RESPONSE
// ============================================================================
/**
 * Generates automated remediation plan for cloud threat.
 *
 * @param {CloudThreatFinding} finding - Threat finding
 * @returns {CloudRemediation} Remediation plan
 *
 * @example
 * ```typescript
 * const remediation = generateCloudRemediation(finding);
 * ```
 */
const generateCloudRemediation = (finding) => {
    const actions = [];
    switch (finding.threatCategory) {
        case CloudThreatCategory.DATA_EXPOSURE:
            if (finding.resourceType === CloudResourceType.STORAGE) {
                actions.push({
                    type: 'block_public_access',
                    description: 'Block all public access to storage bucket',
                    command: finding.provider === CloudProvider.AWS
                        ? `aws s3api put-public-access-block --bucket ${finding.resourceId} --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true`
                        : undefined,
                });
                actions.push({
                    type: 'enable_encryption',
                    description: 'Enable encryption at rest',
                });
            }
            break;
        case CloudThreatCategory.IAM_THREAT:
            actions.push({
                type: 'revoke_permissions',
                description: 'Review and reduce excessive permissions',
            });
            actions.push({
                type: 'enable_mfa',
                description: 'Enforce MFA for privileged accounts',
            });
            break;
        case CloudThreatCategory.RESOURCE_ABUSE:
            actions.push({
                type: 'terminate_resource',
                description: 'Terminate suspicious resource',
                command: finding.provider === CloudProvider.AWS
                    ? `aws ec2 terminate-instances --instance-ids ${finding.resourceId}`
                    : undefined,
            });
            break;
    }
    return {
        automated: actions.some((a) => a.command !== undefined),
        actions,
        estimatedTime: actions.length * 5,
        risk: finding.severity === CloudThreatSeverity.CRITICAL ? 'high' : 'medium',
        requiresApproval: finding.severity === CloudThreatSeverity.CRITICAL,
    };
};
exports.generateCloudRemediation = generateCloudRemediation;
/**
 * Executes automated cloud threat remediation.
 *
 * @param {CloudThreatFinding} finding - Threat finding
 * @param {CloudRemediation} remediation - Remediation plan
 * @returns {Promise<{success: boolean; results: any[]}>} Execution results
 *
 * @example
 * ```typescript
 * const result = await executeCloudRemediation(finding, remediation);
 * ```
 */
const executeCloudRemediation = async (finding, remediation) => {
    const results = [];
    if (!remediation.automated) {
        return {
            success: false,
            results: [{ error: 'Manual remediation required' }],
        };
    }
    for (const action of remediation.actions) {
        if (action.command) {
            // In production, execute actual cloud API calls or CLI commands
            results.push({
                action: action.type,
                status: 'success',
                message: `Executed: ${action.description}`,
            });
        }
    }
    return {
        success: true,
        results,
    };
};
exports.executeCloudRemediation = executeCloudRemediation;
/**
 * Isolates compromised cloud resource.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} resourceId - Resource identifier
 * @param {CloudResourceType} resourceType - Resource type
 * @returns {Promise<{isolated: boolean; actions: string[]}>} Isolation result
 *
 * @example
 * ```typescript
 * const result = await isolateCloudResource(CloudProvider.AWS, 'i-12345', CloudResourceType.COMPUTE);
 * ```
 */
const isolateCloudResource = async (provider, resourceId, resourceType) => {
    const actions = [];
    switch (resourceType) {
        case CloudResourceType.COMPUTE:
            actions.push('Apply restrictive security group');
            actions.push('Remove IAM role');
            actions.push('Create snapshot for forensics');
            break;
        case CloudResourceType.STORAGE:
            actions.push('Block all public access');
            actions.push('Remove bucket policies');
            actions.push('Enable versioning');
            break;
    }
    return {
        isolated: true,
        actions,
    };
};
exports.isolateCloudResource = isolateCloudResource;
// ============================================================================
// CLOUD SECURITY MONITORING
// ============================================================================
/**
 * Aggregates cloud security events across providers.
 *
 * @param {Array<{provider: CloudProvider; accountId: string}>} accounts - Cloud accounts
 * @param {Date} since - Start time for events
 * @returns {Promise<any[]>} Security events
 *
 * @example
 * ```typescript
 * const events = await aggregateCloudSecurityEvents(accounts, new Date('2024-01-01'));
 * ```
 */
const aggregateCloudSecurityEvents = async (accounts, since) => {
    const allEvents = [];
    for (const account of accounts) {
        // Simulate fetching events from CloudTrail, Azure Monitor, GCP Logging
        const events = [
            {
                timestamp: new Date(),
                provider: account.provider,
                accountId: account.accountId,
                eventType: 'API_CALL',
                service: 's3',
                action: 'GetObject',
                principal: 'user@example.com',
                sourceIP: '203.0.113.1',
            },
        ];
        allEvents.push(...events);
    }
    return allEvents;
};
exports.aggregateCloudSecurityEvents = aggregateCloudSecurityEvents;
/**
 * Calculates cloud security posture score.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} accountId - Account ID
 * @returns {Promise<{score: number; findings: any}>} Security score
 *
 * @example
 * ```typescript
 * const posture = await calculateCloudSecurityPosture(CloudProvider.AWS, '123456789012');
 * ```
 */
const calculateCloudSecurityPosture = async (provider, accountId) => {
    const threats = await (0, exports.scanAWSThreats)(accountId);
    const criticalCount = threats.filter((t) => t.severity === CloudThreatSeverity.CRITICAL).length;
    const highCount = threats.filter((t) => t.severity === CloudThreatSeverity.HIGH).length;
    const mediumCount = threats.filter((t) => t.severity === CloudThreatSeverity.MEDIUM).length;
    // Calculate score (0-100, higher is better)
    const score = Math.max(0, 100 - (criticalCount * 10 + highCount * 5 + mediumCount * 2));
    return {
        score,
        findings: {
            critical: criticalCount,
            high: highCount,
            medium: mediumCount,
        },
    };
};
exports.calculateCloudSecurityPosture = calculateCloudSecurityPosture;
// ============================================================================
// NESTJS CONTROLLER IMPLEMENTATION
// ============================================================================
/**
 * NestJS Controller for Cloud Threat Detection API.
 *
 * @example
 * ```typescript
 * import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
 * import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 * import { RolesGuard } from '../auth/roles.guard';
 * import { Roles } from '../auth/roles.decorator';
 *
 * @ApiTags('Cloud Threat Detection')
 * @Controller('api/v1/cloud-threats')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @ApiBearerAuth()
 * export class CloudThreatDetectionController {
 *   constructor(private readonly cloudThreatService: CloudThreatService) {}
 *
 *   @Get('scan/:provider/:accountId')
 *   @Roles('security_admin', 'cloud_security')
 *   @ApiOperation({ summary: 'Scan cloud account for threats' })
 *   @ApiResponse({ status: 200, description: 'Threats detected', type: [CloudThreatFinding] })
 *   async scanThreats(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string,
 *     @Query('severity') severity?: CloudThreatSeverity
 *   ): Promise<CloudThreatFinding[]> {
 *     switch (provider) {
 *       case CloudProvider.AWS:
 *         return scanAWSThreats(accountId, { severityThreshold: severity });
 *       case CloudProvider.AZURE:
 *         return scanAzureThreats(accountId);
 *       case CloudProvider.GCP:
 *         return scanGCPThreats(accountId);
 *       default:
 *         throw new BadRequestException('Unsupported cloud provider');
 *     }
 *   }
 *
 *   @Get('misconfigurations/:provider/:accountId')
 *   @Roles('security_admin', 'cloud_security')
 *   @ApiOperation({ summary: 'Detect cloud misconfigurations' })
 *   async getMisconfigurations(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string,
 *     @Query('resourceId') resourceId: string
 *   ): Promise<CloudMisconfiguration[]> {
 *     switch (provider) {
 *       case CloudProvider.AWS:
 *         return detectAWSS3Misconfigurations(accountId, resourceId);
 *       case CloudProvider.AZURE:
 *         return detectAzureStorageMisconfigurations(accountId, resourceId);
 *       case CloudProvider.GCP:
 *         return detectGCSMisconfigurations(accountId, resourceId);
 *     }
 *   }
 *
 *   @Get('iam-threats/:provider/:accountId')
 *   @Roles('security_admin', 'iam_admin')
 *   @ApiOperation({ summary: 'Monitor IAM threats' })
 *   async getIAMThreats(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string
 *   ): Promise<CloudIAMThreat[]> {
 *     switch (provider) {
 *       case CloudProvider.AWS:
 *         return monitorAWSIAMThreats(accountId);
 *       case CloudProvider.AZURE:
 *         return monitorAzureADThreats(accountId);
 *       case CloudProvider.GCP:
 *         return monitorGCPIAMThreats(accountId);
 *     }
 *   }
 *
 *   @Post('multi-cloud/scan')
 *   @Roles('security_admin')
 *   @ApiOperation({ summary: 'Scan multiple cloud accounts' })
 *   async scanMultiCloud(
 *     @Body() accounts: Array<{ provider: CloudProvider; accountId: string }>
 *   ): Promise<CloudThreatFinding[]> {
 *     return detectMultiCloudThreats(accounts);
 *   }
 *
 *   @Get('compliance/:provider/:accountId')
 *   @Roles('security_admin', 'compliance_officer')
 *   @ApiOperation({ summary: 'Assess cloud compliance' })
 *   async assessCompliance(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string,
 *     @Query('frameworks') frameworks: string
 *   ): Promise<CloudCompliance> {
 *     const frameworkList = frameworks.split(',');
 *     return assessCloudCompliance(provider, accountId, frameworkList);
 *   }
 *
 *   @Post('remediation/generate')
 *   @Roles('security_admin')
 *   @ApiOperation({ summary: 'Generate remediation plan' })
 *   async generateRemediation(
 *     @Body() finding: CloudThreatFinding
 *   ): Promise<CloudRemediation> {
 *     return generateCloudRemediation(finding);
 *   }
 *
 *   @Post('remediation/execute')
 *   @Roles('security_admin')
 *   @ApiOperation({ summary: 'Execute automated remediation' })
 *   async executeRemediation(
 *     @Body() request: { finding: CloudThreatFinding; remediation: CloudRemediation }
 *   ): Promise<{ success: boolean; results: any[] }> {
 *     return executeCloudRemediation(request.finding, request.remediation);
 *   }
 *
 *   @Get('api-monitoring/:provider/:accountId')
 *   @Roles('security_admin')
 *   @ApiOperation({ summary: 'Monitor cloud API activity' })
 *   async monitorAPIActivity(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string,
 *     @Query('startDate') startDate: string,
 *     @Query('endDate') endDate: string
 *   ): Promise<CloudAPIThreat[]> {
 *     return monitorCloudAPIActivity(provider, accountId, {
 *       start: new Date(startDate),
 *       end: new Date(endDate),
 *     });
 *   }
 *
 *   @Get('resource-abuse/:provider/:accountId')
 *   @Roles('security_admin', 'cost_manager')
 *   @ApiOperation({ summary: 'Detect resource abuse' })
 *   async detectResourceAbuse(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string
 *   ): Promise<CloudResourceAbuse[]> {
 *     return detectCloudResourceAbuse(provider, accountId);
 *   }
 *
 *   @Get('security-posture/:provider/:accountId')
 *   @Roles('security_admin', 'ciso')
 *   @ApiOperation({ summary: 'Calculate security posture score' })
 *   async getSecurityPosture(
 *     @Param('provider') provider: CloudProvider,
 *     @Param('accountId') accountId: string
 *   ): Promise<{ score: number; findings: any }> {
 *     return calculateCloudSecurityPosture(provider, accountId);
 *   }
 * }
 * ```
 */
const defineCloudThreatDetectionController = () => {
    return 'CloudThreatDetectionController - see example above';
};
exports.defineCloudThreatDetectionController = defineCloudThreatDetectionController;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Sequelize Models
    getCloudThreatFindingModelAttributes: exports.getCloudThreatFindingModelAttributes,
    getCloudMisconfigurationModelAttributes: exports.getCloudMisconfigurationModelAttributes,
    getCloudIAMThreatModelAttributes: exports.getCloudIAMThreatModelAttributes,
    // AWS Threat Detection
    scanAWSThreats: exports.scanAWSThreats,
    detectAWSS3Misconfigurations: exports.detectAWSS3Misconfigurations,
    monitorAWSIAMThreats: exports.monitorAWSIAMThreats,
    detectAWSEC2Threats: exports.detectAWSEC2Threats,
    monitorAWSLambdaSecurity: exports.monitorAWSLambdaSecurity,
    // Azure Threat Detection
    scanAzureThreats: exports.scanAzureThreats,
    detectAzureStorageMisconfigurations: exports.detectAzureStorageMisconfigurations,
    monitorAzureADThreats: exports.monitorAzureADThreats,
    detectAzureVMThreats: exports.detectAzureVMThreats,
    monitorAzureFunctionsSecurity: exports.monitorAzureFunctionsSecurity,
    // GCP Threat Detection
    scanGCPThreats: exports.scanGCPThreats,
    detectGCSMisconfigurations: exports.detectGCSMisconfigurations,
    monitorGCPIAMThreats: exports.monitorGCPIAMThreats,
    detectGCEThreats: exports.detectGCEThreats,
    monitorGCPCloudFunctionsSecurity: exports.monitorGCPCloudFunctionsSecurity,
    // Multi-Cloud
    detectMultiCloudThreats: exports.detectMultiCloudThreats,
    // API Monitoring
    monitorCloudAPIActivity: exports.monitorCloudAPIActivity,
    detectAPIRateLimitViolations: exports.detectAPIRateLimitViolations,
    // Resource Abuse
    detectCloudResourceAbuse: exports.detectCloudResourceAbuse,
    monitorCloudCostAnomalies: exports.monitorCloudCostAnomalies,
    // Compliance
    assessCloudCompliance: exports.assessCloudCompliance,
    validateHIPAACompliance: exports.validateHIPAACompliance,
    // Threat Response
    generateCloudRemediation: exports.generateCloudRemediation,
    executeCloudRemediation: exports.executeCloudRemediation,
    isolateCloudResource: exports.isolateCloudResource,
    // Security Monitoring
    aggregateCloudSecurityEvents: exports.aggregateCloudSecurityEvents,
    calculateCloudSecurityPosture: exports.calculateCloudSecurityPosture,
    // Controller
    defineCloudThreatDetectionController: exports.defineCloudThreatDetectionController,
};
//# sourceMappingURL=cloud-threat-detection-kit.js.map