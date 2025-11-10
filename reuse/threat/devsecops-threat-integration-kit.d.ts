/**
 * LOC: DEVSECOPS001
 * File: /reuse/threat/devsecops-threat-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/graphql
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - DevSecOps pipeline services
 *   - CI/CD security modules
 *   - Source code scanning services
 *   - IaC security services
 *   - Secret detection services
 *   - Healthcare DevOps security orchestration
 */
/**
 * DevSecOps security severity levels
 */
export declare enum DevSecOpsSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * DevSecOps threat categories
 */
export declare enum DevSecOpsThreatCategory {
    CODE_VULNERABILITY = "CODE_VULNERABILITY",
    DEPENDENCY_VULNERABILITY = "DEPENDENCY_VULNERABILITY",
    SECRET_EXPOSURE = "SECRET_EXPOSURE",
    IAC_MISCONFIGURATION = "IAC_MISCONFIGURATION",
    CONTAINER_VULNERABILITY = "CONTAINER_VULNERABILITY",
    BUILD_SECURITY = "BUILD_SECURITY",
    DEPLOYMENT_RISK = "DEPLOYMENT_RISK",
    COMPLIANCE_VIOLATION = "COMPLIANCE_VIOLATION",
    LICENSE_VIOLATION = "LICENSE_VIOLATION",
    SUPPLY_CHAIN_RISK = "SUPPLY_CHAIN_RISK"
}
/**
 * Pipeline stages
 */
export declare enum PipelineStage {
    SOURCE = "SOURCE",
    BUILD = "BUILD",
    TEST = "TEST",
    SECURITY_SCAN = "SECURITY_SCAN",
    ARTIFACT = "ARTIFACT",
    DEPLOY = "DEPLOY",
    RUNTIME = "RUNTIME"
}
/**
 * Code scanning tools
 */
export declare enum CodeScanningTool {
    SONARQUBE = "SONARQUBE",
    CHECKMARX = "CHECKMARX",
    VERACODE = "VERACODE",
    FORTIFY = "FORTIFY",
    SEMGREP = "SEMGREP",
    SNYK_CODE = "SNYK_CODE",
    CODEQL = "CODEQL",
    CUSTOM = "CUSTOM"
}
/**
 * Dependency scanning tools
 */
export declare enum DependencyScanningTool {
    SNYK = "SNYK",
    DEPENDABOT = "DEPENDABOT",
    WHITESOURCE = "WHITESOURCE",
    BLACKDUCK = "BLACKDUCK",
    OWASP_DEPENDENCY_CHECK = "OWASP_DEPENDENCY_CHECK",
    TRIVY = "TRIVY",
    GRYPE = "GRYPE"
}
/**
 * Secret detection tools
 */
export declare enum SecretDetectionTool {
    TRUFFLEHOG = "TRUFFLEHOG",
    GITLEAKS = "GITLEAKS",
    DETECT_SECRETS = "DETECT_SECRETS",
    GITROB = "GITROB",
    GIT_SECRETS = "GIT_SECRETS",
    TALISMAN = "TALISMAN"
}
/**
 * IaC scanning tools
 */
export declare enum IaCScanningTool {
    TERRAFORM_SCAN = "TERRAFORM_SCAN",
    CHECKOV = "CHECKOV",
    TFSEC = "TFSEC",
    TERRASCAN = "TERRASCAN",
    KICS = "KICS",
    CLOUDFORMATION_GUARD = "CLOUDFORMATION_GUARD"
}
/**
 * DevSecOps pipeline security finding
 */
export interface DevSecOpsFinding {
    id: string;
    pipelineId: string;
    pipelineName: string;
    buildId: string;
    stage: PipelineStage;
    category: DevSecOpsThreatCategory;
    severity: DevSecOpsSeverity;
    title: string;
    description: string;
    recommendation: string;
    tool: string;
    toolVersion?: string;
    detectedAt: Date;
    file?: string;
    lineNumber?: number;
    codeSnippet?: string;
    cwe?: string[];
    cve?: string[];
    cvssScore?: number;
    owasp?: string[];
    status: 'open' | 'investigating' | 'resolved' | 'false_positive' | 'suppressed' | 'accepted';
    assignedTo?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    falsePositiveReason?: string;
    suppressionReason?: string;
    acceptanceReason?: string;
    acceptanceExpiry?: Date;
    metadata?: Record<string, any>;
}
/**
 * Source code vulnerability
 */
export interface CodeVulnerability {
    id: string;
    repository: string;
    branch: string;
    commit: string;
    file: string;
    lineNumber: number;
    columnNumber?: number;
    language: string;
    severity: DevSecOpsSeverity;
    category: string;
    title: string;
    description: string;
    cwe?: string[];
    owasp?: string[];
    recommendation: string;
    codeSnippet: string;
    context: {
        before: string[];
        after: string[];
    };
    tool: CodeScanningTool;
    ruleId: string;
    confidence: number;
    detectedAt: Date;
    status: 'new' | 'triaged' | 'in_progress' | 'resolved' | 'false_positive';
    metadata?: Record<string, any>;
}
/**
 * Dependency vulnerability
 */
export interface DependencyVulnerability {
    id: string;
    packageName: string;
    packageVersion: string;
    packageManager: 'npm' | 'pip' | 'maven' | 'gradle' | 'nuget' | 'gem' | 'composer' | 'go';
    ecosystem: string;
    severity: DevSecOpsSeverity;
    cve?: string[];
    cwe?: string[];
    cvssScore?: number;
    cvssVector?: string;
    title: string;
    description: string;
    publishedDate?: Date;
    modifiedDate?: Date;
    fixedVersion?: string;
    patchAvailable: boolean;
    exploitAvailable: boolean;
    exploitMaturity?: 'unproven' | 'proof_of_concept' | 'functional' | 'high';
    affectedProjects: string[];
    tool: DependencyScanningTool;
    detectedAt: Date;
    status: 'identified' | 'under_review' | 'upgrading' | 'patched' | 'mitigated' | 'accepted';
    remediationPriority: number;
    metadata?: Record<string, any>;
}
/**
 * Secret exposure finding
 */
export interface SecretExposure {
    id: string;
    repository: string;
    branch: string;
    commit: string;
    file: string;
    lineNumber: number;
    secretType: 'api_key' | 'password' | 'token' | 'certificate' | 'ssh_key' | 'aws_key' | 'database_url' | 'generic';
    severity: DevSecOpsSeverity;
    description: string;
    secretHash: string;
    entropy: number;
    tool: SecretDetectionTool;
    ruleId: string;
    detectedAt: Date;
    exposedSince?: Date;
    commitCount?: number;
    rotated: boolean;
    rotatedAt?: Date;
    status: 'active' | 'rotating' | 'rotated' | 'false_positive';
    remediationSteps: string[];
    metadata?: Record<string, any>;
}
/**
 * IaC security finding
 */
export interface IaCSecurityFinding {
    id: string;
    repository: string;
    branch: string;
    commit: string;
    file: string;
    lineNumber: number;
    iacType: 'terraform' | 'cloudformation' | 'arm_template' | 'kubernetes' | 'helm' | 'ansible' | 'pulumi';
    resourceType: string;
    resourceName: string;
    severity: DevSecOpsSeverity;
    category: string;
    title: string;
    description: string;
    recommendation: string;
    tool: IaCScanningTool;
    ruleId: string;
    cloudProvider?: 'aws' | 'azure' | 'gcp' | 'multi';
    complianceFrameworks: string[];
    codeSnippet: string;
    suggestedFix?: string;
    detectedAt: Date;
    status: 'open' | 'remediated' | 'false_positive' | 'suppressed';
    metadata?: Record<string, any>;
}
/**
 * Container vulnerability
 */
export interface ContainerVulnerability {
    id: string;
    imageName: string;
    imageTag: string;
    imageDigest: string;
    registry: string;
    severity: DevSecOpsSeverity;
    vulnerabilityId: string;
    packageName: string;
    packageVersion: string;
    installedVersion: string;
    fixedVersion?: string;
    layer: string;
    title: string;
    description: string;
    cvssScore?: number;
    exploitAvailable: boolean;
    detectedAt: Date;
    tool: 'trivy' | 'clair' | 'grype' | 'snyk_container' | 'aqua' | 'twistlock';
    status: 'detected' | 'patching' | 'patched' | 'accepted';
    metadata?: Record<string, any>;
}
/**
 * Build artifact scan result
 */
export interface BuildArtifactScanResult {
    id: string;
    buildId: string;
    artifactType: 'jar' | 'war' | 'zip' | 'tar' | 'docker_image' | 'binary' | 'package';
    artifactName: string;
    artifactHash: string;
    scanDate: Date;
    scanner: string;
    findings: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
    vulnerabilities: string[];
    malwareDetected: boolean;
    signatureValid: boolean;
    sbomGenerated: boolean;
    sbomUrl?: string;
    passed: boolean;
    blockers: string[];
    metadata?: Record<string, any>;
}
/**
 * Deployment security gate
 */
export interface DeploymentSecurityGate {
    id: string;
    gateName: string;
    pipelineId: string;
    buildId: string;
    environment: 'dev' | 'staging' | 'uat' | 'production';
    gateType: 'vulnerability_threshold' | 'compliance_check' | 'approval_required' | 'security_scan' | 'custom';
    status: 'pending' | 'passed' | 'failed' | 'bypassed';
    evaluatedAt: Date;
    criteria: {
        name: string;
        required: boolean;
        met: boolean;
        details: string;
    }[];
    blockers: string[];
    bypassedBy?: string;
    bypassReason?: string;
    approvedBy?: string;
    approvalReason?: string;
    metadata?: Record<string, any>;
}
/**
 * DevSecOps threat intelligence
 */
export interface DevSecOpsThreatIntel {
    id: string;
    threatType: 'vulnerability' | 'exploit' | 'malware' | 'attack_technique';
    name: string;
    description: string;
    severity: DevSecOpsSeverity;
    cve?: string[];
    cwe?: string[];
    affectedPackages: {
        packageManager: string;
        packageName: string;
        affectedVersions: string[];
        fixedVersions: string[];
    }[];
    exploitAvailable: boolean;
    exploitPubliclyAvailable: boolean;
    attackVector: 'network' | 'adjacent' | 'local' | 'physical';
    attackComplexity: 'low' | 'high';
    privilegesRequired: 'none' | 'low' | 'high';
    userInteraction: 'none' | 'required';
    mitigation: string;
    references: string[];
    publishedDate: Date;
    lastModified: Date;
    metadata?: Record<string, any>;
}
/**
 * Pipeline security metrics
 */
export interface PipelineSecurityMetrics {
    pipelineId: string;
    pipelineName: string;
    period: {
        start: Date;
        end: Date;
    };
    totalBuilds: number;
    securityScans: number;
    findingsBySeverity: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
    findingsByCategory: Record<DevSecOpsThreatCategory, number>;
    meanTimeToRemediate: number;
    remediationRate: number;
    securityGateFailures: number;
    securityGateBypasses: number;
    vulnerabilitiesIntroduced: number;
    vulnerabilitiesFixed: number;
    secretsDetected: number;
    secretsRotated: number;
    complianceScore: number;
    trendData: {
        date: Date;
        findings: number;
        severity: DevSecOpsSeverity;
    }[];
}
/**
 * Software Bill of Materials (SBOM)
 */
export interface SBOM {
    id: string;
    format: 'spdx' | 'cyclonedx';
    version: string;
    buildId: string;
    artifactName: string;
    generatedAt: Date;
    components: {
        name: string;
        version: string;
        type: 'library' | 'framework' | 'application' | 'operating-system' | 'device' | 'file';
        supplier?: string;
        licenses: string[];
        purl?: string;
        cpe?: string;
        hashes: {
            algorithm: string;
            value: string;
        }[];
        vulnerabilities?: string[];
    }[];
    dependencies: {
        ref: string;
        dependsOn: string[];
    }[];
    metadata?: Record<string, any>;
}
/**
 * Compliance validation result
 */
export interface ComplianceValidationResult {
    id: string;
    framework: 'HIPAA' | 'PCI_DSS' | 'SOC2' | 'GDPR' | 'ISO27001' | 'NIST';
    pipelineId: string;
    buildId: string;
    validatedAt: Date;
    passed: boolean;
    controls: {
        controlId: string;
        controlName: string;
        required: boolean;
        implemented: boolean;
        evidence: string;
        notes?: string;
    }[];
    violations: {
        controlId: string;
        severity: DevSecOpsSeverity;
        description: string;
        remediation: string;
    }[];
    score: number;
    metadata?: Record<string, any>;
}
/**
 * Scans a CI/CD pipeline for security threats.
 *
 * @param {string} pipelineId - Pipeline identifier
 * @param {string} buildId - Build identifier
 * @param {object} options - Scan options
 * @returns {Promise<DevSecOpsFinding[]>} Security findings
 */
export declare function scanPipelineSecurity(pipelineId: string, buildId: string, options?: {
    stages?: PipelineStage[];
    severityThreshold?: DevSecOpsSeverity;
}): Promise<DevSecOpsFinding[]>;
/**
 * Monitors security across multiple pipelines.
 *
 * @param {string[]} pipelineIds - Pipeline identifiers
 * @param {object} timeWindow - Time window for monitoring
 * @returns {Promise<PipelineSecurityMetrics[]>} Security metrics per pipeline
 */
export declare function monitorPipelinesSecurity(pipelineIds: string[], timeWindow: {
    start: Date;
    end: Date;
}): Promise<PipelineSecurityMetrics[]>;
/**
 * Analyzes pipeline security trends over time.
 *
 * @param {string} pipelineId - Pipeline identifier
 * @param {number} days - Number of days to analyze
 * @returns {Promise<PipelineSecurityMetrics>} Trend analysis
 */
export declare function analyzePipelineSecurityTrends(pipelineId: string, days?: number): Promise<PipelineSecurityMetrics>;
/**
 * Scans source code for security vulnerabilities.
 *
 * @param {string} repository - Repository URL or path
 * @param {string} branch - Branch name
 * @param {CodeScanningTool} tool - Scanning tool to use
 * @returns {Promise<CodeVulnerability[]>} Code vulnerabilities found
 */
export declare function scanSourceCodeVulnerabilities(repository: string, branch?: string, tool?: CodeScanningTool): Promise<CodeVulnerability[]>;
/**
 * Performs static analysis on code for security issues.
 *
 * @param {string} codeSnippet - Code to analyze
 * @param {string} language - Programming language
 * @returns {Promise<CodeVulnerability[]>} Vulnerabilities found
 */
export declare function performStaticCodeAnalysis(codeSnippet: string, language: string): Promise<CodeVulnerability[]>;
/**
 * Integrates with SAST (Static Application Security Testing) tools.
 *
 * @param {string} repository - Repository to scan
 * @param {CodeScanningTool} tool - SAST tool to use
 * @param {object} config - Tool configuration
 * @returns {Promise<object>} Scan results
 */
export declare function integrateSASTTool(repository: string, tool: CodeScanningTool, config?: Record<string, any>): Promise<{
    scanId: string;
    tool: CodeScanningTool;
    status: 'completed' | 'failed' | 'in_progress';
    vulnerabilities: CodeVulnerability[];
    summary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}>;
/**
 * Analyzes code quality metrics with security implications.
 *
 * @param {string} repository - Repository to analyze
 * @returns {Promise<object>} Code quality metrics
 */
export declare function analyzeCodeQualityMetrics(repository: string): Promise<{
    repository: string;
    metrics: {
        complexity: number;
        maintainability: number;
        securityScore: number;
        technicalDebt: number;
    };
    hotspots: {
        file: string;
        complexity: number;
        vulnerabilities: number;
    }[];
}>;
/**
 * Scans project dependencies for known vulnerabilities.
 *
 * @param {string} projectPath - Path to project
 * @param {'npm'|'pip'|'maven'|'gradle'} packageManager - Package manager type
 * @returns {Promise<DependencyVulnerability[]>} Dependency vulnerabilities
 */
export declare function scanDependencyVulnerabilities(projectPath: string, packageManager?: 'npm' | 'pip' | 'maven' | 'gradle' | 'nuget' | 'gem' | 'composer' | 'go'): Promise<DependencyVulnerability[]>;
/**
 * Monitors dependency updates and security advisories.
 *
 * @param {string[]} packages - Package names to monitor
 * @param {'npm'|'pip'|'maven'} ecosystem - Package ecosystem
 * @returns {Promise<object[]>} Security advisories
 */
export declare function monitorDependencyAdvisories(packages: string[], ecosystem?: string): Promise<{
    packageName: string;
    currentVersion: string;
    latestVersion: string;
    securityAdvisories: number;
    updateAvailable: boolean;
    breakingChanges: boolean;
}[]>;
/**
 * Generates dependency update recommendations.
 *
 * @param {DependencyVulnerability[]} vulnerabilities - Known vulnerabilities
 * @returns {Promise<object[]>} Update recommendations
 */
export declare function generateDependencyUpdateRecommendations(vulnerabilities: DependencyVulnerability[]): Promise<{
    packageName: string;
    currentVersion: string;
    recommendedVersion: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    autoUpgradeSafe: boolean;
    breakingChanges: string[];
    migrationGuide?: string;
}[]>;
/**
 * Tracks license compliance for dependencies.
 *
 * @param {string} projectPath - Project path
 * @returns {Promise<object>} License compliance report
 */
export declare function trackDependencyLicenseCompliance(projectPath: string): Promise<{
    compliant: boolean;
    dependencies: {
        name: string;
        version: string;
        license: string;
        compliant: boolean;
        risk: 'low' | 'medium' | 'high';
    }[];
    violations: {
        dependency: string;
        license: string;
        reason: string;
    }[];
}>;
/**
 * Scans IaC files for security misconfigurations.
 *
 * @param {string} iacPath - Path to IaC files
 * @param {'terraform'|'cloudformation'|'kubernetes'} iacType - IaC type
 * @returns {Promise<IaCSecurityFinding[]>} Security findings
 */
export declare function scanIaCSecurityFindings(iacPath: string, iacType?: 'terraform' | 'cloudformation' | 'arm_template' | 'kubernetes' | 'helm' | 'ansible' | 'pulumi'): Promise<IaCSecurityFinding[]>;
/**
 * Validates Terraform configurations for security.
 *
 * @param {string} terraformPath - Path to Terraform files
 * @returns {Promise<IaCSecurityFinding[]>} Terraform security findings
 */
export declare function validateTerraformSecurity(terraformPath: string): Promise<IaCSecurityFinding[]>;
/**
 * Validates Kubernetes manifests for security.
 *
 * @param {string} manifestPath - Path to K8s manifests
 * @returns {Promise<IaCSecurityFinding[]>} Kubernetes security findings
 */
export declare function validateKubernetesManifests(manifestPath: string): Promise<IaCSecurityFinding[]>;
/**
 * Performs policy-as-code validation.
 *
 * @param {string} iacPath - Path to IaC files
 * @param {string[]} policies - Policy rules to validate
 * @returns {Promise<object>} Policy validation results
 */
export declare function validateIaCPolicies(iacPath: string, policies: string[]): Promise<{
    compliant: boolean;
    policyResults: {
        policy: string;
        passed: boolean;
        violations: string[];
    }[];
}>;
/**
 * Scans repository for exposed secrets.
 *
 * @param {string} repository - Repository to scan
 * @param {SecretDetectionTool} tool - Secret detection tool
 * @returns {Promise<SecretExposure[]>} Exposed secrets
 */
export declare function detectExposedSecrets(repository: string, tool?: SecretDetectionTool): Promise<SecretExposure[]>;
/**
 * Scans git history for historical secret exposure.
 *
 * @param {string} repository - Repository to scan
 * @param {number} depth - Number of commits to scan
 * @returns {Promise<SecretExposure[]>} Historical secret exposures
 */
export declare function scanGitHistoryForSecrets(repository: string, depth?: number): Promise<SecretExposure[]>;
/**
 * Validates secret rotation compliance.
 *
 * @param {string} secretId - Secret identifier
 * @param {number} maxAgeDays - Maximum age in days
 * @returns {Promise<object>} Rotation compliance status
 */
export declare function validateSecretRotation(secretId: string, maxAgeDays?: number): Promise<{
    secretId: string;
    lastRotated: Date;
    ageDays: number;
    compliant: boolean;
    nextRotationDue: Date;
}>;
/**
 * Integrates with secret management systems.
 *
 * @param {string} secretPath - Path to secret
 * @param {'vault'|'aws_secrets'|'azure_keyvault'} provider - Secret provider
 * @returns {Promise<object>} Secret metadata
 */
export declare function integrateSecretManagement(secretPath: string, provider: 'vault' | 'aws_secrets' | 'azure_keyvault' | 'gcp_secret_manager'): Promise<{
    provider: string;
    secretPath: string;
    exists: boolean;
    version: number;
    lastModified: Date;
    accessPolicy: string[];
}>;
/**
 * Scans build artifacts for vulnerabilities.
 *
 * @param {string} artifactPath - Path to artifact
 * @param {string} artifactType - Type of artifact
 * @returns {Promise<BuildArtifactScanResult>} Scan results
 */
export declare function scanBuildArtifact(artifactPath: string, artifactType: BuildArtifactScanResult['artifactType']): Promise<BuildArtifactScanResult>;
/**
 * Validates artifact signatures.
 *
 * @param {string} artifactPath - Path to artifact
 * @param {string} signaturePath - Path to signature file
 * @returns {Promise<object>} Signature validation result
 */
export declare function validateArtifactSignature(artifactPath: string, signaturePath: string): Promise<{
    valid: boolean;
    signer: string;
    signedAt: Date;
    algorithm: string;
    trustChainValid: boolean;
}>;
/**
 * Generates Software Bill of Materials (SBOM).
 *
 * @param {string} artifactPath - Path to artifact
 * @param {'spdx'|'cyclonedx'} format - SBOM format
 * @returns {Promise<SBOM>} Generated SBOM
 */
export declare function generateSBOM(artifactPath: string, format?: 'spdx' | 'cyclonedx'): Promise<SBOM>;
/**
 * Scans container images for vulnerabilities.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageTag - Container image tag
 * @returns {Promise<ContainerVulnerability[]>} Container vulnerabilities
 */
export declare function scanContainerImage(imageName: string, imageTag?: string): Promise<ContainerVulnerability[]>;
/**
 * Evaluates security gate before deployment.
 *
 * @param {string} buildId - Build identifier
 * @param {string} environment - Target environment
 * @param {object} criteria - Security criteria
 * @returns {Promise<DeploymentSecurityGate>} Gate evaluation result
 */
export declare function evaluateDeploymentSecurityGate(buildId: string, environment: 'dev' | 'staging' | 'uat' | 'production', criteria?: {
    maxCriticalVulnerabilities?: number;
    maxHighVulnerabilities?: number;
    requiresApproval?: boolean;
    complianceRequired?: boolean;
}): Promise<DeploymentSecurityGate>;
/**
 * Implements automated security controls for deployments.
 *
 * @param {string} deploymentId - Deployment identifier
 * @param {string} environment - Target environment
 * @returns {Promise<object>} Security controls applied
 */
export declare function implementDeploymentSecurityControls(deploymentId: string, environment: string): Promise<{
    deploymentId: string;
    environment: string;
    controlsApplied: {
        name: string;
        status: 'applied' | 'failed' | 'skipped';
        details: string;
    }[];
}>;
/**
 * Validates production deployment readiness.
 *
 * @param {string} buildId - Build identifier
 * @returns {Promise<object>} Deployment readiness assessment
 */
export declare function validateProductionReadiness(buildId: string): Promise<{
    ready: boolean;
    checks: {
        name: string;
        passed: boolean;
        severity: DevSecOpsSeverity;
        details: string;
    }[];
    blockers: string[];
    warnings: string[];
}>;
/**
 * Retrieves DevSecOps threat intelligence feeds.
 *
 * @param {object} filters - Intelligence filters
 * @returns {Promise<DevSecOpsThreatIntel[]>} Threat intelligence data
 */
export declare function getDevSecOpsThreatIntelligence(filters?: {
    threatType?: DevSecOpsThreatIntel['threatType'];
    severity?: DevSecOpsSeverity;
    affectedPackages?: string[];
}): Promise<DevSecOpsThreatIntel[]>;
/**
 * Correlates threats with deployed systems.
 *
 * @param {string} systemId - System identifier
 * @param {DevSecOpsThreatIntel[]} threats - Threat intelligence
 * @returns {Promise<object[]>} Correlated threats
 */
export declare function correlateThreatIntelligence(systemId: string, threats: DevSecOpsThreatIntel[]): Promise<{
    threat: DevSecOpsThreatIntel;
    affected: boolean;
    components: string[];
    risk: 'critical' | 'high' | 'medium' | 'low';
    actionRequired: string;
}[]>;
/**
 * Analyzes supply chain security risks.
 *
 * @param {string} projectPath - Project path
 * @returns {Promise<object>} Supply chain risk analysis
 */
export declare function analyzeSupplyChainRisks(projectPath: string): Promise<{
    riskScore: number;
    risks: {
        category: string;
        severity: DevSecOpsSeverity;
        description: string;
        mitigation: string;
    }[];
    dependencies: {
        name: string;
        trustScore: number;
        maintainers: number;
        lastUpdate: Date;
        downloads: number;
    }[];
}>;
/**
 * Validates HIPAA compliance in DevSecOps pipeline.
 *
 * @param {string} pipelineId - Pipeline identifier
 * @param {string} buildId - Build identifier
 * @returns {Promise<ComplianceValidationResult>} Compliance validation result
 */
export declare function validateHIPAACompliance(pipelineId: string, buildId: string): Promise<ComplianceValidationResult>;
/**
 * Validates PCI-DSS compliance.
 *
 * @param {string} pipelineId - Pipeline identifier
 * @param {string} buildId - Build identifier
 * @returns {Promise<ComplianceValidationResult>} PCI-DSS compliance result
 */
export declare function validatePCIDSSCompliance(pipelineId: string, buildId: string): Promise<ComplianceValidationResult>;
/**
 * Generates compliance audit reports.
 *
 * @param {ComplianceValidationResult[]} validations - Compliance validations
 * @returns {Promise<object>} Audit report
 */
export declare function generateComplianceAuditReport(validations: ComplianceValidationResult[]): Promise<{
    reportId: string;
    generatedAt: Date;
    period: {
        start: Date;
        end: Date;
    };
    frameworks: string[];
    overallCompliance: number;
    validations: ComplianceValidationResult[];
    recommendations: string[];
}>;
/**
 * Sequelize model attributes for DevSecOpsFinding.
 *
 * @returns {object} Model attributes for Sequelize
 *
 * @example
 * ```typescript
 * import { Table, Column, Model, DataType } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'devsecops_findings', timestamps: true })
 * export class DevSecOpsFindingModel extends Model {
 *   @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
 *   id: string;
 *
 *   @Column({ type: DataType.STRING })
 *   pipelineId: string;
 *
 *   @Column({ type: DataType.STRING })
 *   buildId: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(PipelineStage)) })
 *   stage: PipelineStage;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(DevSecOpsThreatCategory)) })
 *   category: DevSecOpsThreatCategory;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(DevSecOpsSeverity)) })
 *   severity: DevSecOpsSeverity;
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
 *   @Column({ type: DataType.STRING })
 *   tool: string;
 *
 *   @Column({ type: DataType.DATE })
 *   detectedAt: Date;
 *
 *   @Column({ type: DataType.ENUM('open', 'investigating', 'resolved', 'false_positive', 'suppressed', 'accepted') })
 *   status: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, any>;
 * }
 * ```
 */
export declare function getDevSecOpsFindingModelAttributes(): Record<string, any>;
/**
 * Sequelize model attributes for DependencyVulnerability.
 */
export declare function getDependencyVulnerabilityModelAttributes(): Record<string, any>;
/**
 * Sequelize model attributes for SecretExposure.
 */
export declare function getSecretExposureModelAttributes(): Record<string, any>;
/**
 * GraphQL schema for DevSecOps threat integration.
 *
 * @returns {string} GraphQL schema definition
 */
export declare function getDevSecOpsGraphQLSchema(): string;
/**
 * NestJS GraphQL resolver example for DevSecOps queries.
 *
 * @returns {string} Resolver implementation template
 *
 * @example
 * ```typescript
 * import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
 * import { UseGuards } from '@nestjs/common';
 * import { GqlAuthGuard } from '../auth/gql-auth.guard';
 *
 * @Resolver('DevSecOps')
 * @UseGuards(GqlAuthGuard)
 * export class DevSecOpsResolver {
 *   @Query('scanPipelineSecurity')
 *   async scanPipeline(
 *     @Args('input') input: PipelineSecurityScanInput
 *   ): Promise<DevSecOpsFinding[]> {
 *     return scanPipelineSecurity(input.pipelineId, input.buildId, {
 *       stages: input.stages,
 *       severityThreshold: input.severityThreshold,
 *     });
 *   }
 *
 *   @Query('scanSourceCode')
 *   async scanCode(
 *     @Args('repository') repository: string,
 *     @Args('branch') branch?: string,
 *     @Args('tool') tool?: string
 *   ): Promise<CodeVulnerability[]> {
 *     return scanSourceCodeVulnerabilities(repository, branch, tool as CodeScanningTool);
 *   }
 *
 *   @Mutation('resolveFinding')
 *   async resolveFinding(
 *     @Args('id') id: string,
 *     @Args('resolution') resolution: string
 *   ): Promise<DevSecOpsFinding> {
 *     // Implement finding resolution logic
 *     return {} as DevSecOpsFinding;
 *   }
 * }
 * ```
 */
export declare function getDevSecOpsGraphQLResolverTemplate(): string;
/**
 * NestJS Controller for DevSecOps Threat Integration API.
 *
 * @example
 * ```typescript
 * import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
 * import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 *
 * @ApiTags('DevSecOps Security')
 * @Controller('api/v1/devsecops')
 * @UseGuards(JwtAuthGuard)
 * @ApiBearerAuth()
 * export class DevSecOpsController {
 *   @Post('pipeline/scan')
 *   @ApiOperation({ summary: 'Scan CI/CD pipeline for security threats' })
 *   @ApiResponse({ status: 200, description: 'Security findings', type: [DevSecOpsFinding] })
 *   async scanPipeline(
 *     @Body() body: { pipelineId: string; buildId: string }
 *   ): Promise<DevSecOpsFinding[]> {
 *     return scanPipelineSecurity(body.pipelineId, body.buildId);
 *   }
 *
 *   @Post('code/scan')
 *   @ApiOperation({ summary: 'Scan source code for vulnerabilities' })
 *   async scanCode(
 *     @Body() body: { repository: string; branch?: string; tool?: CodeScanningTool }
 *   ): Promise<CodeVulnerability[]> {
 *     return scanSourceCodeVulnerabilities(body.repository, body.branch, body.tool);
 *   }
 *
 *   @Post('dependencies/scan')
 *   @ApiOperation({ summary: 'Scan dependencies for vulnerabilities' })
 *   async scanDependencies(
 *     @Body() body: { projectPath: string; packageManager: string }
 *   ): Promise<DependencyVulnerability[]> {
 *     return scanDependencyVulnerabilities(body.projectPath, body.packageManager as any);
 *   }
 *
 *   @Post('secrets/detect')
 *   @ApiOperation({ summary: 'Detect exposed secrets in code' })
 *   async detectSecrets(
 *     @Body() body: { repository: string; tool?: SecretDetectionTool }
 *   ): Promise<SecretExposure[]> {
 *     return detectExposedSecrets(body.repository, body.tool);
 *   }
 *
 *   @Post('iac/scan')
 *   @ApiOperation({ summary: 'Scan IaC for security misconfigurations' })
 *   async scanIaC(
 *     @Body() body: { iacPath: string; iacType: string }
 *   ): Promise<IaCSecurityFinding[]> {
 *     return scanIaCSecurityFindings(body.iacPath, body.iacType as any);
 *   }
 *
 *   @Post('container/scan')
 *   @ApiOperation({ summary: 'Scan container image for vulnerabilities' })
 *   async scanContainer(
 *     @Body() body: { imageName: string; imageTag?: string }
 *   ): Promise<ContainerVulnerability[]> {
 *     return scanContainerImage(body.imageName, body.imageTag);
 *   }
 *
 *   @Post('artifact/scan')
 *   @ApiOperation({ summary: 'Scan build artifact' })
 *   async scanArtifact(
 *     @Body() body: { artifactPath: string; artifactType: string }
 *   ): Promise<BuildArtifactScanResult> {
 *     return scanBuildArtifact(body.artifactPath, body.artifactType as any);
 *   }
 *
 *   @Post('sbom/generate')
 *   @ApiOperation({ summary: 'Generate Software Bill of Materials' })
 *   async generateSBOM(
 *     @Body() body: { artifactPath: string; format?: 'spdx' | 'cyclonedx' }
 *   ): Promise<SBOM> {
 *     return generateSBOM(body.artifactPath, body.format);
 *   }
 *
 *   @Post('deployment/gate/evaluate')
 *   @ApiOperation({ summary: 'Evaluate deployment security gate' })
 *   async evaluateGate(
 *     @Body() body: { buildId: string; environment: string }
 *   ): Promise<DeploymentSecurityGate> {
 *     return evaluateDeploymentSecurityGate(body.buildId, body.environment as any);
 *   }
 *
 *   @Get('pipeline/:pipelineId/metrics')
 *   @ApiOperation({ summary: 'Get pipeline security metrics' })
 *   async getPipelineMetrics(
 *     @Param('pipelineId') pipelineId: string,
 *     @Query('startDate') startDate: string,
 *     @Query('endDate') endDate: string
 *   ): Promise<PipelineSecurityMetrics[]> {
 *     return monitorPipelinesSecurity([pipelineId], {
 *       start: new Date(startDate),
 *       end: new Date(endDate),
 *     });
 *   }
 *
 *   @Post('compliance/validate/hipaa')
 *   @ApiOperation({ summary: 'Validate HIPAA compliance' })
 *   async validateHIPAA(
 *     @Body() body: { pipelineId: string; buildId: string }
 *   ): Promise<ComplianceValidationResult> {
 *     return validateHIPAACompliance(body.pipelineId, body.buildId);
 *   }
 *
 *   @Get('threat-intel')
 *   @ApiOperation({ summary: 'Get DevSecOps threat intelligence' })
 *   async getThreatIntel(): Promise<DevSecOpsThreatIntel[]> {
 *     return getDevSecOpsThreatIntelligence();
 *   }
 * }
 * ```
 */
export declare function defineDevSecOpsController(): string;
declare const _default: {
    scanPipelineSecurity: typeof scanPipelineSecurity;
    monitorPipelinesSecurity: typeof monitorPipelinesSecurity;
    analyzePipelineSecurityTrends: typeof analyzePipelineSecurityTrends;
    scanSourceCodeVulnerabilities: typeof scanSourceCodeVulnerabilities;
    performStaticCodeAnalysis: typeof performStaticCodeAnalysis;
    integrateSASTTool: typeof integrateSASTTool;
    analyzeCodeQualityMetrics: typeof analyzeCodeQualityMetrics;
    scanDependencyVulnerabilities: typeof scanDependencyVulnerabilities;
    monitorDependencyAdvisories: typeof monitorDependencyAdvisories;
    generateDependencyUpdateRecommendations: typeof generateDependencyUpdateRecommendations;
    trackDependencyLicenseCompliance: typeof trackDependencyLicenseCompliance;
    scanIaCSecurityFindings: typeof scanIaCSecurityFindings;
    validateTerraformSecurity: typeof validateTerraformSecurity;
    validateKubernetesManifests: typeof validateKubernetesManifests;
    validateIaCPolicies: typeof validateIaCPolicies;
    detectExposedSecrets: typeof detectExposedSecrets;
    scanGitHistoryForSecrets: typeof scanGitHistoryForSecrets;
    validateSecretRotation: typeof validateSecretRotation;
    integrateSecretManagement: typeof integrateSecretManagement;
    scanBuildArtifact: typeof scanBuildArtifact;
    validateArtifactSignature: typeof validateArtifactSignature;
    generateSBOM: typeof generateSBOM;
    scanContainerImage: typeof scanContainerImage;
    evaluateDeploymentSecurityGate: typeof evaluateDeploymentSecurityGate;
    implementDeploymentSecurityControls: typeof implementDeploymentSecurityControls;
    validateProductionReadiness: typeof validateProductionReadiness;
    getDevSecOpsThreatIntelligence: typeof getDevSecOpsThreatIntelligence;
    correlateThreatIntelligence: typeof correlateThreatIntelligence;
    analyzeSupplyChainRisks: typeof analyzeSupplyChainRisks;
    validateHIPAACompliance: typeof validateHIPAACompliance;
    validatePCIDSSCompliance: typeof validatePCIDSSCompliance;
    generateComplianceAuditReport: typeof generateComplianceAuditReport;
    getDevSecOpsFindingModelAttributes: typeof getDevSecOpsFindingModelAttributes;
    getDependencyVulnerabilityModelAttributes: typeof getDependencyVulnerabilityModelAttributes;
    getSecretExposureModelAttributes: typeof getSecretExposureModelAttributes;
    getDevSecOpsGraphQLSchema: typeof getDevSecOpsGraphQLSchema;
    getDevSecOpsGraphQLResolverTemplate: typeof getDevSecOpsGraphQLResolverTemplate;
    defineDevSecOpsController: typeof defineDevSecOpsController;
};
export default _default;
//# sourceMappingURL=devsecops-threat-integration-kit.d.ts.map