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
/**
 * Cloud provider types
 */
export declare enum CloudProvider {
    AWS = "AWS",
    AZURE = "AZURE",
    GCP = "GCP",
    ALIBABA = "ALIBABA",
    IBM = "IBM",
    ORACLE = "ORACLE",
    MULTI = "MULTI"
}
/**
 * Cloud threat severity levels
 */
export declare enum CloudThreatSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Cloud threat categories
 */
export declare enum CloudThreatCategory {
    MISCONFIGURATION = "MISCONFIGURATION",
    IAM_THREAT = "IAM_THREAT",
    DATA_EXPOSURE = "DATA_EXPOSURE",
    RESOURCE_ABUSE = "RESOURCE_ABUSE",
    API_ABUSE = "API_ABUSE",
    COMPLIANCE_VIOLATION = "COMPLIANCE_VIOLATION",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    CREDENTIAL_THEFT = "CREDENTIAL_THEFT",
    CRYPTOMINING = "CRYPTOMINING",
    DDOS = "DDOS",
    INSIDER_THREAT = "INSIDER_THREAT"
}
/**
 * Cloud resource types
 */
export declare enum CloudResourceType {
    COMPUTE = "COMPUTE",// EC2, VM, Compute Engine
    STORAGE = "STORAGE",// S3, Blob Storage, Cloud Storage
    DATABASE = "DATABASE",// RDS, SQL Database, Cloud SQL
    NETWORK = "NETWORK",// VPC, VNet, VPC Network
    IDENTITY = "IDENTITY",// IAM, Azure AD, Cloud IAM
    SERVERLESS = "SERVERLESS",// Lambda, Functions, Cloud Functions
    CONTAINER = "CONTAINER",// ECS, AKS, GKE
    API = "API",// API Gateway, API Management
    SECURITY = "SECURITY",// Security Hub, Security Center, Security Command Center
    MONITORING = "MONITORING"
}
/**
 * Cloud threat detection finding
 */
export interface CloudThreatFinding {
    id: string;
    provider: CloudProvider;
    accountId: string;
    region: string;
    resourceType: CloudResourceType;
    resourceId: string;
    resourceArn?: string;
    threatCategory: CloudThreatCategory;
    severity: CloudThreatSeverity;
    title: string;
    description: string;
    recommendation: string;
    detectedAt: Date;
    firstSeen: Date;
    lastSeen: Date;
    status: 'open' | 'investigating' | 'resolved' | 'false_positive' | 'suppressed';
    confidence: number;
    evidence: CloudThreatEvidence[];
    affectedResources: string[];
    complianceFrameworks: string[];
    mitreAttack?: {
        tactic: string;
        technique: string;
        techniqueId: string;
    }[];
    remediation?: CloudRemediation;
    metadata?: Record<string, any>;
    resolvedAt?: Date;
    resolvedBy?: string;
    falsePositiveReason?: string;
}
/**
 * Cloud threat evidence
 */
export interface CloudThreatEvidence {
    type: string;
    timestamp: Date;
    source: string;
    data: Record<string, any>;
    severity: CloudThreatSeverity;
}
/**
 * Cloud misconfiguration finding
 */
export interface CloudMisconfiguration {
    id: string;
    provider: CloudProvider;
    accountId: string;
    region: string;
    resourceType: CloudResourceType;
    resourceId: string;
    configType: ConfigurationType;
    severity: CloudThreatSeverity;
    finding: string;
    recommendation: string;
    detectedAt: Date;
    status: 'open' | 'remediated' | 'suppressed';
    complianceImpact: ComplianceImpact[];
    autoRemediationAvailable: boolean;
    metadata?: Record<string, any>;
}
/**
 * Configuration types
 */
export declare enum ConfigurationType {
    ENCRYPTION = "ENCRYPTION",
    ACCESS_CONTROL = "ACCESS_CONTROL",
    NETWORK_SECURITY = "NETWORK_SECURITY",
    LOGGING = "LOGGING",
    MONITORING = "MONITORING",
    BACKUP = "BACKUP",
    PATCH_MANAGEMENT = "PATCH_MANAGEMENT",
    DATA_RETENTION = "DATA_RETENTION",
    IDENTITY = "IDENTITY"
}
/**
 * Compliance impact
 */
export interface ComplianceImpact {
    framework: string;
    control: string;
    requirement: string;
    impact: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Cloud IAM threat
 */
export interface CloudIAMThreat {
    id: string;
    provider: CloudProvider;
    accountId: string;
    threatType: IAMThreatType;
    severity: CloudThreatSeverity;
    principal: {
        type: 'user' | 'role' | 'service' | 'group';
        id: string;
        name: string;
        arn?: string;
    };
    action: string;
    resource: string;
    finding: string;
    risk: string;
    recommendation: string;
    detectedAt: Date;
    anomalyScore: number;
    metadata?: Record<string, any>;
}
/**
 * IAM threat types
 */
export declare enum IAMThreatType {
    EXCESSIVE_PERMISSIONS = "EXCESSIVE_PERMISSIONS",
    UNUSED_CREDENTIALS = "UNUSED_CREDENTIALS",
    CREDENTIAL_EXPOSURE = "CREDENTIAL_EXPOSURE",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    POLICY_VIOLATION = "POLICY_VIOLATION",
    MFA_DISABLED = "MFA_DISABLED",
    ROOT_USAGE = "ROOT_USAGE",
    EXTERNAL_ACCESS = "EXTERNAL_ACCESS",
    SUSPICIOUS_API_CALL = "SUSPICIOUS_API_CALL"
}
/**
 * Cloud API threat
 */
export interface CloudAPIThreat {
    id: string;
    provider: CloudProvider;
    accountId: string;
    apiEndpoint: string;
    threatType: APIThreatType;
    severity: CloudThreatSeverity;
    sourceIP: string;
    userAgent?: string;
    principal?: string;
    requestCount: number;
    timeWindow: {
        start: Date;
        end: Date;
    };
    anomalyIndicators: string[];
    detectedAt: Date;
    blocked: boolean;
    metadata?: Record<string, any>;
}
/**
 * API threat types
 */
export declare enum APIThreatType {
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    DATA_EXFILTRATION = "DATA_EXFILTRATION",
    BRUTE_FORCE = "BRUTE_FORCE",
    INJECTION_ATTEMPT = "INJECTION_ATTEMPT",
    CREDENTIAL_STUFFING = "CREDENTIAL_STUFFING",
    SUSPICIOUS_PATTERN = "SUSPICIOUS_PATTERN",
    GEOLOCATION_ANOMALY = "GEOLOCATION_ANOMALY"
}
/**
 * Cloud resource abuse
 */
export interface CloudResourceAbuse {
    id: string;
    provider: CloudProvider;
    accountId: string;
    region: string;
    resourceType: CloudResourceType;
    resourceId: string;
    abuseType: ResourceAbuseType;
    severity: CloudThreatSeverity;
    metrics: {
        name: string;
        value: number;
        threshold: number;
        unit: string;
    }[];
    cost: {
        current: number;
        expected: number;
        currency: string;
    };
    detectedAt: Date;
    duration: number;
    recommendation: string;
    metadata?: Record<string, any>;
}
/**
 * Resource abuse types
 */
export declare enum ResourceAbuseType {
    CRYPTOMINING = "CRYPTOMINING",
    UNAUTHORIZED_COMPUTE = "UNAUTHORIZED_COMPUTE",
    DATA_EGRESS = "DATA_EGRESS",
    STORAGE_ABUSE = "STORAGE_ABUSE",
    API_ABUSE = "API_ABUSE",
    COST_ANOMALY = "COST_ANOMALY"
}
/**
 * Serverless security finding
 */
export interface ServerlessSecurity {
    id: string;
    provider: CloudProvider;
    accountId: string;
    region: string;
    functionName: string;
    functionArn: string;
    securityFinding: ServerlessSecurityFinding;
    severity: CloudThreatSeverity;
    description: string;
    recommendation: string;
    detectedAt: Date;
    runtime: string;
    metadata?: Record<string, any>;
}
/**
 * Serverless security findings
 */
export declare enum ServerlessSecurityFinding {
    VULNERABLE_DEPENDENCY = "VULNERABLE_DEPENDENCY",
    EXCESSIVE_PERMISSIONS = "EXCESSIVE_PERMISSIONS",
    INSECURE_CONFIGURATION = "INSECURE_CONFIGURATION",
    UNENCRYPTED_ENV_VARS = "UNENCRYPTED_ENV_VARS",
    PUBLIC_EXPOSURE = "PUBLIC_EXPOSURE",
    OUTDATED_RUNTIME = "OUTDATED_RUNTIME",
    LOGGING_DISABLED = "LOGGING_DISABLED"
}
/**
 * Cloud remediation action
 */
export interface CloudRemediation {
    automated: boolean;
    actions: RemediationAction[];
    estimatedTime: number;
    risk: 'low' | 'medium' | 'high';
    requiresApproval: boolean;
}
/**
 * Remediation action
 */
export interface RemediationAction {
    type: string;
    description: string;
    command?: string;
    apiCall?: {
        service: string;
        action: string;
        parameters: Record<string, any>;
    };
}
/**
 * Cloud compliance status
 */
export interface CloudCompliance {
    provider: CloudProvider;
    accountId: string;
    framework: string;
    controls: ComplianceControl[];
    overallScore: number;
    passingControls: number;
    failingControls: number;
    lastAssessed: Date;
}
/**
 * Compliance control
 */
export interface ComplianceControl {
    id: string;
    title: string;
    description: string;
    status: 'pass' | 'fail' | 'not_applicable' | 'manual_review';
    severity: CloudThreatSeverity;
    findings: string[];
    resources: string[];
}
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
export declare const getCloudThreatFindingModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    provider: {
        type: string;
        values: CloudProvider[];
        allowNull: boolean;
    };
    accountId: {
        type: string;
        allowNull: boolean;
    };
    region: {
        type: string;
        allowNull: boolean;
    };
    resourceType: {
        type: string;
        values: CloudResourceType[];
        allowNull: boolean;
    };
    resourceId: {
        type: string;
        allowNull: boolean;
    };
    resourceArn: {
        type: string;
        allowNull: boolean;
    };
    threatCategory: {
        type: string;
        values: CloudThreatCategory[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: CloudThreatSeverity[];
        allowNull: boolean;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    recommendation: {
        type: string;
        allowNull: boolean;
    };
    detectedAt: {
        type: string;
        allowNull: boolean;
    };
    firstSeen: {
        type: string;
        allowNull: boolean;
    };
    lastSeen: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    confidence: {
        type: string;
        validate: {
            min: number;
            max: number;
        };
    };
    evidence: {
        type: string;
        defaultValue: never[];
    };
    affectedResources: {
        type: string;
        defaultValue: never[];
    };
    complianceFrameworks: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        allowNull: boolean;
    };
    remediation: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    resolvedAt: {
        type: string;
        allowNull: boolean;
    };
    resolvedBy: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize model attributes for CloudMisconfiguration.
 */
export declare const getCloudMisconfigurationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    provider: {
        type: string;
        values: CloudProvider[];
        allowNull: boolean;
    };
    accountId: {
        type: string;
        allowNull: boolean;
    };
    region: {
        type: string;
        allowNull: boolean;
    };
    resourceType: {
        type: string;
        values: CloudResourceType[];
        allowNull: boolean;
    };
    resourceId: {
        type: string;
        allowNull: boolean;
    };
    configType: {
        type: string;
        values: ConfigurationType[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: CloudThreatSeverity[];
        allowNull: boolean;
    };
    finding: {
        type: string;
        allowNull: boolean;
    };
    recommendation: {
        type: string;
        allowNull: boolean;
    };
    detectedAt: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    complianceImpact: {
        type: string;
        defaultValue: never[];
    };
    autoRemediationAvailable: {
        type: string;
        defaultValue: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize model attributes for CloudIAMThreat.
 */
export declare const getCloudIAMThreatModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    provider: {
        type: string;
        values: CloudProvider[];
        allowNull: boolean;
    };
    accountId: {
        type: string;
        allowNull: boolean;
    };
    threatType: {
        type: string;
        values: IAMThreatType[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: CloudThreatSeverity[];
        allowNull: boolean;
    };
    principal: {
        type: string;
        allowNull: boolean;
    };
    action: {
        type: string;
        allowNull: boolean;
    };
    resource: {
        type: string;
        allowNull: boolean;
    };
    finding: {
        type: string;
        allowNull: boolean;
    };
    risk: {
        type: string;
        allowNull: boolean;
    };
    recommendation: {
        type: string;
        allowNull: boolean;
    };
    detectedAt: {
        type: string;
        allowNull: boolean;
    };
    anomalyScore: {
        type: string;
        validate: {
            min: number;
            max: number;
        };
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const scanAWSThreats: (accountId: string, options?: {
    regions?: string[];
    services?: string[];
    severityThreshold?: CloudThreatSeverity;
}) => Promise<CloudThreatFinding[]>;
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
export declare const detectAWSS3Misconfigurations: (accountId: string, bucketName: string) => Promise<CloudMisconfiguration[]>;
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
export declare const monitorAWSIAMThreats: (accountId: string, options?: {
    checkRootUsage?: boolean;
    checkMFA?: boolean;
    checkUnusedCredentials?: boolean;
}) => Promise<CloudIAMThreat[]>;
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
export declare const detectAWSEC2Threats: (accountId: string, region: string) => Promise<CloudThreatFinding[]>;
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
export declare const monitorAWSLambdaSecurity: (accountId: string, region: string) => Promise<ServerlessSecurity[]>;
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
export declare const scanAzureThreats: (subscriptionId: string, options?: {
    resourceGroups?: string[];
    services?: string[];
}) => Promise<CloudThreatFinding[]>;
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
export declare const detectAzureStorageMisconfigurations: (subscriptionId: string, storageAccountName: string) => Promise<CloudMisconfiguration[]>;
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
export declare const monitorAzureADThreats: (tenantId: string, options?: {
    checkConditionalAccess?: boolean;
    checkMFA?: boolean;
}) => Promise<CloudIAMThreat[]>;
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
export declare const detectAzureVMThreats: (subscriptionId: string, resourceGroup: string) => Promise<CloudThreatFinding[]>;
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
export declare const monitorAzureFunctionsSecurity: (subscriptionId: string, functionAppName: string) => Promise<ServerlessSecurity[]>;
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
export declare const scanGCPThreats: (projectId: string, options?: {
    regions?: string[];
    services?: string[];
}) => Promise<CloudThreatFinding[]>;
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
export declare const detectGCSMisconfigurations: (projectId: string, bucketName: string) => Promise<CloudMisconfiguration[]>;
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
export declare const monitorGCPIAMThreats: (projectId: string) => Promise<CloudIAMThreat[]>;
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
export declare const detectGCEThreats: (projectId: string, zone: string) => Promise<CloudThreatFinding[]>;
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
export declare const monitorGCPCloudFunctionsSecurity: (projectId: string, region: string) => Promise<ServerlessSecurity[]>;
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
export declare const detectMultiCloudThreats: (accounts: Array<{
    provider: CloudProvider;
    accountId: string;
}>) => Promise<CloudThreatFinding[]>;
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
export declare const monitorCloudAPIActivity: (provider: CloudProvider, accountId: string, timeWindow: {
    start: Date;
    end: Date;
}) => Promise<CloudAPIThreat[]>;
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
export declare const detectAPIRateLimitViolations: (provider: CloudProvider, accountId: string, threshold: number) => Promise<CloudAPIThreat[]>;
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
export declare const detectCloudResourceAbuse: (provider: CloudProvider, accountId: string) => Promise<CloudResourceAbuse[]>;
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
export declare const monitorCloudCostAnomalies: (provider: CloudProvider, accountId: string, threshold: number) => Promise<CloudResourceAbuse[]>;
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
export declare const assessCloudCompliance: (provider: CloudProvider, accountId: string, frameworks: string[]) => Promise<CloudCompliance>;
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
export declare const validateHIPAACompliance: (provider: CloudProvider, accountId: string) => Promise<CloudCompliance>;
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
export declare const generateCloudRemediation: (finding: CloudThreatFinding) => CloudRemediation;
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
export declare const executeCloudRemediation: (finding: CloudThreatFinding, remediation: CloudRemediation) => Promise<{
    success: boolean;
    results: any[];
}>;
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
export declare const isolateCloudResource: (provider: CloudProvider, resourceId: string, resourceType: CloudResourceType) => Promise<{
    isolated: boolean;
    actions: string[];
}>;
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
export declare const aggregateCloudSecurityEvents: (accounts: Array<{
    provider: CloudProvider;
    accountId: string;
}>, since: Date) => Promise<any[]>;
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
export declare const calculateCloudSecurityPosture: (provider: CloudProvider, accountId: string) => Promise<{
    score: number;
    findings: any;
}>;
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
export declare const defineCloudThreatDetectionController: () => string;
declare const _default: {
    getCloudThreatFindingModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        provider: {
            type: string;
            values: CloudProvider[];
            allowNull: boolean;
        };
        accountId: {
            type: string;
            allowNull: boolean;
        };
        region: {
            type: string;
            allowNull: boolean;
        };
        resourceType: {
            type: string;
            values: CloudResourceType[];
            allowNull: boolean;
        };
        resourceId: {
            type: string;
            allowNull: boolean;
        };
        resourceArn: {
            type: string;
            allowNull: boolean;
        };
        threatCategory: {
            type: string;
            values: CloudThreatCategory[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: CloudThreatSeverity[];
            allowNull: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        recommendation: {
            type: string;
            allowNull: boolean;
        };
        detectedAt: {
            type: string;
            allowNull: boolean;
        };
        firstSeen: {
            type: string;
            allowNull: boolean;
        };
        lastSeen: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        confidence: {
            type: string;
            validate: {
                min: number;
                max: number;
            };
        };
        evidence: {
            type: string;
            defaultValue: never[];
        };
        affectedResources: {
            type: string;
            defaultValue: never[];
        };
        complianceFrameworks: {
            type: string;
            defaultValue: never[];
        };
        mitreAttack: {
            type: string;
            allowNull: boolean;
        };
        remediation: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        resolvedAt: {
            type: string;
            allowNull: boolean;
        };
        resolvedBy: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getCloudMisconfigurationModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        provider: {
            type: string;
            values: CloudProvider[];
            allowNull: boolean;
        };
        accountId: {
            type: string;
            allowNull: boolean;
        };
        region: {
            type: string;
            allowNull: boolean;
        };
        resourceType: {
            type: string;
            values: CloudResourceType[];
            allowNull: boolean;
        };
        resourceId: {
            type: string;
            allowNull: boolean;
        };
        configType: {
            type: string;
            values: ConfigurationType[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: CloudThreatSeverity[];
            allowNull: boolean;
        };
        finding: {
            type: string;
            allowNull: boolean;
        };
        recommendation: {
            type: string;
            allowNull: boolean;
        };
        detectedAt: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        complianceImpact: {
            type: string;
            defaultValue: never[];
        };
        autoRemediationAvailable: {
            type: string;
            defaultValue: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getCloudIAMThreatModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        provider: {
            type: string;
            values: CloudProvider[];
            allowNull: boolean;
        };
        accountId: {
            type: string;
            allowNull: boolean;
        };
        threatType: {
            type: string;
            values: IAMThreatType[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: CloudThreatSeverity[];
            allowNull: boolean;
        };
        principal: {
            type: string;
            allowNull: boolean;
        };
        action: {
            type: string;
            allowNull: boolean;
        };
        resource: {
            type: string;
            allowNull: boolean;
        };
        finding: {
            type: string;
            allowNull: boolean;
        };
        risk: {
            type: string;
            allowNull: boolean;
        };
        recommendation: {
            type: string;
            allowNull: boolean;
        };
        detectedAt: {
            type: string;
            allowNull: boolean;
        };
        anomalyScore: {
            type: string;
            validate: {
                min: number;
                max: number;
            };
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    scanAWSThreats: (accountId: string, options?: {
        regions?: string[];
        services?: string[];
        severityThreshold?: CloudThreatSeverity;
    }) => Promise<CloudThreatFinding[]>;
    detectAWSS3Misconfigurations: (accountId: string, bucketName: string) => Promise<CloudMisconfiguration[]>;
    monitorAWSIAMThreats: (accountId: string, options?: {
        checkRootUsage?: boolean;
        checkMFA?: boolean;
        checkUnusedCredentials?: boolean;
    }) => Promise<CloudIAMThreat[]>;
    detectAWSEC2Threats: (accountId: string, region: string) => Promise<CloudThreatFinding[]>;
    monitorAWSLambdaSecurity: (accountId: string, region: string) => Promise<ServerlessSecurity[]>;
    scanAzureThreats: (subscriptionId: string, options?: {
        resourceGroups?: string[];
        services?: string[];
    }) => Promise<CloudThreatFinding[]>;
    detectAzureStorageMisconfigurations: (subscriptionId: string, storageAccountName: string) => Promise<CloudMisconfiguration[]>;
    monitorAzureADThreats: (tenantId: string, options?: {
        checkConditionalAccess?: boolean;
        checkMFA?: boolean;
    }) => Promise<CloudIAMThreat[]>;
    detectAzureVMThreats: (subscriptionId: string, resourceGroup: string) => Promise<CloudThreatFinding[]>;
    monitorAzureFunctionsSecurity: (subscriptionId: string, functionAppName: string) => Promise<ServerlessSecurity[]>;
    scanGCPThreats: (projectId: string, options?: {
        regions?: string[];
        services?: string[];
    }) => Promise<CloudThreatFinding[]>;
    detectGCSMisconfigurations: (projectId: string, bucketName: string) => Promise<CloudMisconfiguration[]>;
    monitorGCPIAMThreats: (projectId: string) => Promise<CloudIAMThreat[]>;
    detectGCEThreats: (projectId: string, zone: string) => Promise<CloudThreatFinding[]>;
    monitorGCPCloudFunctionsSecurity: (projectId: string, region: string) => Promise<ServerlessSecurity[]>;
    detectMultiCloudThreats: (accounts: Array<{
        provider: CloudProvider;
        accountId: string;
    }>) => Promise<CloudThreatFinding[]>;
    monitorCloudAPIActivity: (provider: CloudProvider, accountId: string, timeWindow: {
        start: Date;
        end: Date;
    }) => Promise<CloudAPIThreat[]>;
    detectAPIRateLimitViolations: (provider: CloudProvider, accountId: string, threshold: number) => Promise<CloudAPIThreat[]>;
    detectCloudResourceAbuse: (provider: CloudProvider, accountId: string) => Promise<CloudResourceAbuse[]>;
    monitorCloudCostAnomalies: (provider: CloudProvider, accountId: string, threshold: number) => Promise<CloudResourceAbuse[]>;
    assessCloudCompliance: (provider: CloudProvider, accountId: string, frameworks: string[]) => Promise<CloudCompliance>;
    validateHIPAACompliance: (provider: CloudProvider, accountId: string) => Promise<CloudCompliance>;
    generateCloudRemediation: (finding: CloudThreatFinding) => CloudRemediation;
    executeCloudRemediation: (finding: CloudThreatFinding, remediation: CloudRemediation) => Promise<{
        success: boolean;
        results: any[];
    }>;
    isolateCloudResource: (provider: CloudProvider, resourceId: string, resourceType: CloudResourceType) => Promise<{
        isolated: boolean;
        actions: string[];
    }>;
    aggregateCloudSecurityEvents: (accounts: Array<{
        provider: CloudProvider;
        accountId: string;
    }>, since: Date) => Promise<any[]>;
    calculateCloudSecurityPosture: (provider: CloudProvider, accountId: string) => Promise<{
        score: number;
        findings: any;
    }>;
    defineCloudThreatDetectionController: () => string;
};
export default _default;
//# sourceMappingURL=cloud-threat-detection-kit.d.ts.map