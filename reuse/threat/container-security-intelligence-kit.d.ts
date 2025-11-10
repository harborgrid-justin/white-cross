/**
 * LOC: CONTAINERSEC001
 * File: /reuse/threat/container-security-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Container security services
 *   - Kubernetes security modules
 *   - Container registry intelligence services
 *   - Docker security monitoring
 *   - Container compliance services
 *   - Healthcare container orchestration security
 */
/**
 * Container runtime types
 */
export declare enum ContainerRuntime {
    DOCKER = "DOCKER",
    CONTAINERD = "CONTAINERD",
    CRI_O = "CRI_O",
    PODMAN = "PODMAN"
}
/**
 * Container orchestrator types
 */
export declare enum ContainerOrchestrator {
    KUBERNETES = "KUBERNETES",
    DOCKER_SWARM = "DOCKER_SWARM",
    ECS = "ECS",
    AKS = "AKS",
    GKE = "GKE",
    EKS = "EKS",
    OPENSHIFT = "OPENSHIFT"
}
/**
 * Container security severity levels
 */
export declare enum ContainerSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    NEGLIGIBLE = "NEGLIGIBLE"
}
/**
 * Container threat categories
 */
export declare enum ContainerThreatCategory {
    VULNERABILITY = "VULNERABILITY",
    MALWARE = "MALWARE",
    MISCONFIGURATION = "MISCONFIGURATION",
    RUNTIME_THREAT = "RUNTIME_THREAT",
    NETWORK_THREAT = "NETWORK_THREAT",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    SUPPLY_CHAIN = "SUPPLY_CHAIN",
    COMPLIANCE_VIOLATION = "COMPLIANCE_VIOLATION",
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY"
}
/**
 * Container image vulnerability
 */
export interface ContainerVulnerability {
    id: string;
    cveId?: string;
    imageId: string;
    imageName: string;
    imageTag: string;
    imageDigest: string;
    packageName: string;
    packageVersion: string;
    vulnerabilityType: string;
    severity: ContainerSeverity;
    description: string;
    fixedVersion?: string;
    publishedDate: Date;
    modifiedDate: Date;
    cvssScore?: number;
    cvssVector?: string;
    exploitAvailable: boolean;
    references: string[];
    affectedLayers: string[];
    remediation?: string;
    status: 'open' | 'patched' | 'mitigated' | 'false_positive';
    detectedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Container image scan result
 */
export interface ContainerImageScan {
    id: string;
    scanId: string;
    imageId: string;
    imageName: string;
    imageTag: string;
    imageDigest: string;
    registry: string;
    runtime: ContainerRuntime;
    scanType: 'full' | 'quick' | 'compliance' | 'malware';
    scanStatus: 'pending' | 'scanning' | 'completed' | 'failed';
    scannedAt: Date;
    completedAt?: Date;
    vulnerabilities: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        negligible: number;
    };
    complianceScore: number;
    malwareDetected: boolean;
    secretsFound: number;
    misconfigurations: number;
    totalLayers: number;
    imageSize: number;
    baseImage?: string;
    findings: ContainerVulnerability[];
    recommendations: string[];
    passedChecks: number;
    failedChecks: number;
    metadata?: Record<string, any>;
}
/**
 * Container runtime threat
 */
export interface ContainerRuntimeThreat {
    id: string;
    containerId: string;
    containerName: string;
    imageId: string;
    imageName: string;
    namespace?: string;
    podName?: string;
    nodeName?: string;
    threatCategory: ContainerThreatCategory;
    severity: ContainerSeverity;
    threatType: RuntimeThreatType;
    title: string;
    description: string;
    detectedAt: Date;
    firstSeen: Date;
    lastSeen: Date;
    status: 'active' | 'investigating' | 'resolved' | 'false_positive';
    confidence: number;
    evidence: RuntimeEvidence[];
    affectedProcesses: ProcessInfo[];
    networkConnections: NetworkConnection[];
    fileSystemChanges: FileSystemChange[];
    recommendation: string;
    mitreAttack?: {
        tactic: string;
        technique: string;
        techniqueId: string;
    }[];
    metadata?: Record<string, any>;
}
/**
 * Runtime threat types
 */
export declare enum RuntimeThreatType {
    PROCESS_INJECTION = "PROCESS_INJECTION",
    SUSPICIOUS_PROCESS = "SUSPICIOUS_PROCESS",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    ESCAPE_ATTEMPT = "ESCAPE_ATTEMPT",
    UNAUTHORIZED_FILE_ACCESS = "UNAUTHORIZED_FILE_ACCESS",
    SUSPICIOUS_NETWORK = "SUSPICIOUS_NETWORK",
    CRYPTO_MINING = "CRYPTO_MINING",
    REVERSE_SHELL = "REVERSE_SHELL",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    DATA_EXFILTRATION = "DATA_EXFILTRATION"
}
/**
 * Runtime evidence
 */
export interface RuntimeEvidence {
    type: string;
    timestamp: Date;
    source: string;
    data: Record<string, any>;
    severity: ContainerSeverity;
}
/**
 * Process information
 */
export interface ProcessInfo {
    pid: number;
    name: string;
    command: string;
    user: string;
    startTime: Date;
    cpuUsage: number;
    memoryUsage: number;
    suspicious: boolean;
}
/**
 * Network connection
 */
export interface NetworkConnection {
    protocol: string;
    localAddress: string;
    localPort: number;
    remoteAddress: string;
    remotePort: number;
    state: string;
    established: Date;
}
/**
 * File system change
 */
export interface FileSystemChange {
    path: string;
    operation: 'create' | 'modify' | 'delete' | 'execute';
    timestamp: Date;
    user: string;
    process: string;
    suspicious: boolean;
}
/**
 * Kubernetes security finding
 */
export interface KubernetesSecurity {
    id: string;
    clusterId: string;
    clusterName: string;
    namespace: string;
    resourceType: K8sResourceType;
    resourceName: string;
    securityFinding: K8sSecurityFinding;
    severity: ContainerSeverity;
    description: string;
    recommendation: string;
    detectedAt: Date;
    status: 'open' | 'remediated' | 'suppressed';
    complianceImpact: ComplianceImpact[];
    cis_benchmark?: {
        section: string;
        control: string;
        result: 'pass' | 'fail';
    };
    metadata?: Record<string, any>;
}
/**
 * Kubernetes resource types
 */
export declare enum K8sResourceType {
    POD = "POD",
    DEPLOYMENT = "DEPLOYMENT",
    DAEMONSET = "DAEMONSET",
    STATEFULSET = "STATEFULSET",
    SERVICE = "SERVICE",
    INGRESS = "INGRESS",
    NETWORK_POLICY = "NETWORK_POLICY",
    SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
    ROLE = "ROLE",
    CLUSTER_ROLE = "CLUSTER_ROLE",
    POD_SECURITY_POLICY = "POD_SECURITY_POLICY",
    SECRET = "SECRET",
    CONFIGMAP = "CONFIGMAP"
}
/**
 * Kubernetes security findings
 */
export declare enum K8sSecurityFinding {
    PRIVILEGED_CONTAINER = "PRIVILEGED_CONTAINER",
    HOST_NETWORK = "HOST_NETWORK",
    HOST_PID = "HOST_PID",
    HOST_IPC = "HOST_IPC",
    INSECURE_CAPABILITIES = "INSECURE_CAPABILITIES",
    NO_RESOURCE_LIMITS = "NO_RESOURCE_LIMITS",
    ROOT_USER = "ROOT_USER",
    WRITABLE_ROOT_FS = "WRITABLE_ROOT_FS",
    MISSING_NETWORK_POLICY = "MISSING_NETWORK_POLICY",
    EXCESSIVE_RBAC = "EXCESSIVE_RBAC",
    EXPOSED_SERVICE = "EXPOSED_SERVICE",
    SECRETS_IN_ENV = "SECRETS_IN_ENV",
    OUTDATED_IMAGE = "OUTDATED_IMAGE",
    NO_SECURITY_CONTEXT = "NO_SECURITY_CONTEXT"
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
 * Container registry intelligence
 */
export interface ContainerRegistry {
    id: string;
    registryType: RegistryType;
    registryUrl: string;
    registryName: string;
    totalImages: number;
    vulnerableImages: number;
    lastScanned: Date;
    accessControl: 'public' | 'private' | 'mixed';
    encryption: boolean;
    signing: boolean;
    scanningEnabled: boolean;
    complianceScore: number;
    repositories: RepositoryInfo[];
    metadata?: Record<string, any>;
}
/**
 * Registry types
 */
export declare enum RegistryType {
    DOCKER_HUB = "DOCKER_HUB",
    ECR = "ECR",
    ACR = "ACR",
    GCR = "GCR",
    HARBOR = "HARBOR",
    QUAY = "QUAY",
    ARTIFACTORY = "ARTIFACTORY",
    PRIVATE = "PRIVATE"
}
/**
 * Repository information
 */
export interface RepositoryInfo {
    name: string;
    imageCount: number;
    lastPushed: Date;
    vulnerabilitySummary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    tags: string[];
}
/**
 * Container network threat
 */
export interface ContainerNetworkThreat {
    id: string;
    containerId: string;
    containerName: string;
    namespace?: string;
    threatType: NetworkThreatType;
    severity: ContainerSeverity;
    sourceIP: string;
    destinationIP: string;
    port: number;
    protocol: string;
    detectedAt: Date;
    blocked: boolean;
    trafficPattern: string;
    anomalyScore: number;
    metadata?: Record<string, any>;
}
/**
 * Network threat types
 */
export declare enum NetworkThreatType {
    PORT_SCAN = "PORT_SCAN",
    DDOS = "DDOS",
    UNAUTHORIZED_CONNECTION = "UNAUTHORIZED_CONNECTION",
    DATA_EXFILTRATION = "DATA_EXFILTRATION",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    C2_COMMUNICATION = "C2_COMMUNICATION",
    DNS_TUNNELING = "DNS_TUNNELING",
    SUSPICIOUS_TRAFFIC = "SUSPICIOUS_TRAFFIC"
}
/**
 * Container compliance status
 */
export interface ContainerCompliance {
    id: string;
    framework: string;
    containerId?: string;
    imageId?: string;
    clusterId?: string;
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
    severity: ContainerSeverity;
    findings: string[];
    resources: string[];
}
/**
 * Container incident
 */
export interface ContainerIncident {
    id: string;
    incidentType: string;
    severity: ContainerSeverity;
    title: string;
    description: string;
    affectedContainers: string[];
    affectedImages: string[];
    detectedAt: Date;
    status: 'open' | 'investigating' | 'contained' | 'resolved';
    responseActions: ResponseAction[];
    timeline: IncidentEvent[];
    metadata?: Record<string, any>;
}
/**
 * Response action
 */
export interface ResponseAction {
    type: string;
    description: string;
    executedAt?: Date;
    executedBy?: string;
    result?: string;
}
/**
 * Incident event
 */
export interface IncidentEvent {
    timestamp: Date;
    event: string;
    actor?: string;
    details: Record<string, any>;
}
/**
 * Sequelize model attributes for ContainerVulnerability.
 *
 * @example
 * ```typescript
 * import { Table, Column, Model, DataType } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'container_vulnerabilities', timestamps: true })
 * export class ContainerVulnerabilityModel extends Model {
 *   @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: true })
 *   cveId: string;
 *
 *   @Column({ type: DataType.STRING })
 *   imageId: string;
 *
 *   @Column({ type: DataType.STRING })
 *   imageName: string;
 *
 *   @Column({ type: DataType.STRING })
 *   imageTag: string;
 *
 *   @Column({ type: DataType.STRING })
 *   imageDigest: string;
 *
 *   @Column({ type: DataType.STRING })
 *   packageName: string;
 *
 *   @Column({ type: DataType.STRING })
 *   packageVersion: string;
 *
 *   @Column({ type: DataType.STRING })
 *   vulnerabilityType: string;
 *
 *   @Column({ type: DataType.ENUM(...Object.values(ContainerSeverity)) })
 *   severity: ContainerSeverity;
 *
 *   @Column({ type: DataType.TEXT })
 *   description: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: true })
 *   fixedVersion: string;
 *
 *   @Column({ type: DataType.DATE })
 *   publishedDate: Date;
 *
 *   @Column({ type: DataType.DATE })
 *   modifiedDate: Date;
 *
 *   @Column({ type: DataType.FLOAT, allowNull: true })
 *   cvssScore: number;
 *
 *   @Column({ type: DataType.STRING, allowNull: true })
 *   cvssVector: string;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   exploitAvailable: boolean;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   references: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   affectedLayers: string[];
 *
 *   @Column({ type: DataType.TEXT, allowNull: true })
 *   remediation: string;
 *
 *   @Column({ type: DataType.ENUM('open', 'patched', 'mitigated', 'false_positive') })
 *   status: string;
 *
 *   @Column({ type: DataType.DATE })
 *   detectedAt: Date;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, any>;
 * }
 * ```
 */
export declare const getContainerVulnerabilityModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    cveId: {
        type: string;
        allowNull: boolean;
    };
    imageId: {
        type: string;
        allowNull: boolean;
    };
    imageName: {
        type: string;
        allowNull: boolean;
    };
    imageTag: {
        type: string;
        allowNull: boolean;
    };
    imageDigest: {
        type: string;
        allowNull: boolean;
    };
    packageName: {
        type: string;
        allowNull: boolean;
    };
    packageVersion: {
        type: string;
        allowNull: boolean;
    };
    vulnerabilityType: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: ContainerSeverity[];
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    fixedVersion: {
        type: string;
        allowNull: boolean;
    };
    publishedDate: {
        type: string;
        allowNull: boolean;
    };
    modifiedDate: {
        type: string;
        allowNull: boolean;
    };
    cvssScore: {
        type: string;
        allowNull: boolean;
    };
    cvssVector: {
        type: string;
        allowNull: boolean;
    };
    exploitAvailable: {
        type: string;
        defaultValue: boolean;
    };
    references: {
        type: string;
        defaultValue: never[];
    };
    affectedLayers: {
        type: string;
        defaultValue: never[];
    };
    remediation: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    detectedAt: {
        type: string;
        allowNull: boolean;
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
 * Sequelize model attributes for ContainerRuntimeThreat.
 */
export declare const getContainerRuntimeThreatModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    containerId: {
        type: string;
        allowNull: boolean;
    };
    containerName: {
        type: string;
        allowNull: boolean;
    };
    imageId: {
        type: string;
        allowNull: boolean;
    };
    imageName: {
        type: string;
        allowNull: boolean;
    };
    namespace: {
        type: string;
        allowNull: boolean;
    };
    podName: {
        type: string;
        allowNull: boolean;
    };
    nodeName: {
        type: string;
        allowNull: boolean;
    };
    threatCategory: {
        type: string;
        values: ContainerThreatCategory[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: ContainerSeverity[];
        allowNull: boolean;
    };
    threatType: {
        type: string;
        values: RuntimeThreatType[];
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
    affectedProcesses: {
        type: string;
        defaultValue: never[];
    };
    networkConnections: {
        type: string;
        defaultValue: never[];
    };
    fileSystemChanges: {
        type: string;
        defaultValue: never[];
    };
    recommendation: {
        type: string;
        allowNull: boolean;
    };
    mitreAttack: {
        type: string;
        allowNull: boolean;
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
 * Sequelize model attributes for KubernetesSecurity.
 */
export declare const getKubernetesSecurityModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    clusterId: {
        type: string;
        allowNull: boolean;
    };
    clusterName: {
        type: string;
        allowNull: boolean;
    };
    namespace: {
        type: string;
        allowNull: boolean;
    };
    resourceType: {
        type: string;
        values: K8sResourceType[];
        allowNull: boolean;
    };
    resourceName: {
        type: string;
        allowNull: boolean;
    };
    securityFinding: {
        type: string;
        values: K8sSecurityFinding[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: ContainerSeverity[];
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
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    complianceImpact: {
        type: string;
        defaultValue: never[];
    };
    cis_benchmark: {
        type: string;
        allowNull: boolean;
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
 * Scans container image for vulnerabilities.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageTag - Container image tag
 * @param {object} options - Scan options
 * @returns {Promise<ContainerImageScan>} Scan result
 *
 * @example
 * ```typescript
 * const scanResult = await scanContainerImage('nginx', 'latest', {
 *   scanType: 'full',
 *   includeSecrets: true
 * });
 * ```
 */
export declare const scanContainerImage: (imageName: string, imageTag: string, options?: {
    scanType?: "full" | "quick" | "compliance" | "malware";
    includeSecrets?: boolean;
    includeMisconfigurations?: boolean;
}) => Promise<ContainerImageScan>;
/**
 * Scans container image for secrets and credentials.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageTag - Container image tag
 * @returns {Promise<Array<{type: string; location: string; severity: ContainerSeverity}>>} Found secrets
 *
 * @example
 * ```typescript
 * const secrets = await scanContainerSecrets('myapp', 'v1.0');
 * ```
 */
export declare const scanContainerSecrets: (imageName: string, imageTag: string) => Promise<Array<{
    type: string;
    location: string;
    severity: ContainerSeverity;
}>>;
/**
 * Analyzes container image layers for security issues.
 *
 * @param {string} imageId - Container image ID
 * @returns {Promise<Array<{layer: string; issues: string[]; size: number}>>} Layer analysis
 *
 * @example
 * ```typescript
 * const layerAnalysis = await analyzeContainerLayers('sha256:abcd1234');
 * ```
 */
export declare const analyzeContainerLayers: (imageId: string) => Promise<Array<{
    layer: string;
    issues: string[];
    size: number;
}>>;
/**
 * Scans container for malware.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageTag - Container image tag
 * @returns {Promise<{detected: boolean; threats: Array<{name: string; type: string; severity: ContainerSeverity}>}>} Malware scan result
 *
 * @example
 * ```typescript
 * const malwareScan = await scanContainerMalware('suspicious-image', 'latest');
 * ```
 */
export declare const scanContainerMalware: (imageName: string, imageTag: string) => Promise<{
    detected: boolean;
    threats: Array<{
        name: string;
        type: string;
        severity: ContainerSeverity;
    }>;
}>;
/**
 * Generates SBOM (Software Bill of Materials) for container image.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageTag - Container image tag
 * @returns {Promise<{packages: Array<{name: string; version: string; license: string}>}>} SBOM
 *
 * @example
 * ```typescript
 * const sbom = await generateContainerSBOM('nginx', 'latest');
 * ```
 */
export declare const generateContainerSBOM: (imageName: string, imageTag: string) => Promise<{
    packages: Array<{
        name: string;
        version: string;
        license: string;
    }>;
}>;
/**
 * Monitors container runtime for threats.
 *
 * @param {string} containerId - Container ID
 * @param {object} options - Monitoring options
 * @returns {Promise<ContainerRuntimeThreat[]>} Detected runtime threats
 *
 * @example
 * ```typescript
 * const threats = await monitorContainerRuntime('container-abc123', {
 *   monitorProcesses: true,
 *   monitorNetwork: true
 * });
 * ```
 */
export declare const monitorContainerRuntime: (containerId: string, options?: {
    monitorProcesses?: boolean;
    monitorNetwork?: boolean;
    monitorFileSystem?: boolean;
}) => Promise<ContainerRuntimeThreat[]>;
/**
 * Detects container escape attempts.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerRuntimeThreat[]>} Escape attempt detections
 *
 * @example
 * ```typescript
 * const escapeAttempts = await detectContainerEscape('container-abc123');
 * ```
 */
export declare const detectContainerEscape: (containerId: string) => Promise<ContainerRuntimeThreat[]>;
/**
 * Monitors container file system for suspicious changes.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<FileSystemChange[]>} File system changes
 *
 * @example
 * ```typescript
 * const changes = await monitorContainerFileSystem('container-abc123');
 * ```
 */
export declare const monitorContainerFileSystem: (containerId: string) => Promise<FileSystemChange[]>;
/**
 * Detects crypto mining in containers.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerRuntimeThreat | null>} Crypto mining detection
 *
 * @example
 * ```typescript
 * const cryptoMining = await detectContainerCryptoMining('container-abc123');
 * ```
 */
export declare const detectContainerCryptoMining: (containerId: string) => Promise<ContainerRuntimeThreat | null>;
/**
 * Detects reverse shell connections in containers.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerRuntimeThreat | null>} Reverse shell detection
 *
 * @example
 * ```typescript
 * const reverseShell = await detectReverseShell('container-abc123');
 * ```
 */
export declare const detectReverseShell: (containerId: string) => Promise<ContainerRuntimeThreat | null>;
/**
 * Scans Kubernetes cluster for security issues.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @param {string} clusterName - Cluster name
 * @returns {Promise<KubernetesSecurity[]>} Security findings
 *
 * @example
 * ```typescript
 * const k8sFindings = await scanKubernetesCluster('cluster-123', 'prod-cluster');
 * ```
 */
export declare const scanKubernetesCluster: (clusterId: string, clusterName: string) => Promise<KubernetesSecurity[]>;
/**
 * Checks Kubernetes RBAC configuration.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @returns {Promise<KubernetesSecurity[]>} RBAC findings
 *
 * @example
 * ```typescript
 * const rbacFindings = await checkKubernetesRBAC('cluster-123');
 * ```
 */
export declare const checkKubernetesRBAC: (clusterId: string) => Promise<KubernetesSecurity[]>;
/**
 * Validates Kubernetes network policies.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @param {string} namespace - Namespace to check
 * @returns {Promise<KubernetesSecurity[]>} Network policy findings
 *
 * @example
 * ```typescript
 * const netpolFindings = await validateKubernetesNetworkPolicies('cluster-123', 'healthcare');
 * ```
 */
export declare const validateKubernetesNetworkPolicies: (clusterId: string, namespace: string) => Promise<KubernetesSecurity[]>;
/**
 * Scans Kubernetes pod security standards.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @param {string} namespace - Namespace to check
 * @returns {Promise<KubernetesSecurity[]>} Pod security findings
 *
 * @example
 * ```typescript
 * const podFindings = await scanKubernetesPodSecurity('cluster-123', 'healthcare');
 * ```
 */
export declare const scanKubernetesPodSecurity: (clusterId: string, namespace: string) => Promise<KubernetesSecurity[]>;
/**
 * Audits Kubernetes secrets management.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @returns {Promise<KubernetesSecurity[]>} Secrets findings
 *
 * @example
 * ```typescript
 * const secretFindings = await auditKubernetesSecrets('cluster-123');
 * ```
 */
export declare const auditKubernetesSecrets: (clusterId: string) => Promise<KubernetesSecurity[]>;
/**
 * Analyzes container registry for security issues.
 *
 * @param {string} registryUrl - Container registry URL
 * @param {RegistryType} registryType - Registry type
 * @returns {Promise<ContainerRegistry>} Registry analysis
 *
 * @example
 * ```typescript
 * const registryAnalysis = await analyzeContainerRegistry('registry.example.com', RegistryType.PRIVATE);
 * ```
 */
export declare const analyzeContainerRegistry: (registryUrl: string, registryType: RegistryType) => Promise<ContainerRegistry>;
/**
 * Scans container registry for vulnerable images.
 *
 * @param {string} registryUrl - Container registry URL
 * @returns {Promise<Array<{imageName: string; vulnerabilityCount: number; severity: ContainerSeverity}>>} Vulnerable images
 *
 * @example
 * ```typescript
 * const vulnerableImages = await scanRegistryVulnerabilities('registry.example.com');
 * ```
 */
export declare const scanRegistryVulnerabilities: (registryUrl: string) => Promise<Array<{
    imageName: string;
    vulnerabilityCount: number;
    severity: ContainerSeverity;
}>>;
/**
 * Validates container image signatures.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageDigest - Image digest
 * @returns {Promise<{signed: boolean; valid: boolean; signers: string[]}>} Signature validation
 *
 * @example
 * ```typescript
 * const validation = await validateImageSignature('nginx', 'sha256:abcd1234');
 * ```
 */
export declare const validateImageSignature: (imageName: string, imageDigest: string) => Promise<{
    signed: boolean;
    valid: boolean;
    signers: string[];
}>;
/**
 * Checks container image provenance.
 *
 * @param {string} imageName - Container image name
 * @param {string} imageDigest - Image digest
 * @returns {Promise<{verified: boolean; builder: string; buildTime: Date; sourceRepo: string}>} Provenance check
 *
 * @example
 * ```typescript
 * const provenance = await checkImageProvenance('myapp', 'sha256:abcd1234');
 * ```
 */
export declare const checkImageProvenance: (imageName: string, imageDigest: string) => Promise<{
    verified: boolean;
    builder: string;
    buildTime: Date;
    sourceRepo: string;
}>;
/**
 * Enforces container image policies.
 *
 * @param {string} imageName - Container image name
 * @param {object} policy - Image policy
 * @returns {Promise<{allowed: boolean; violations: string[]}>} Policy enforcement result
 *
 * @example
 * ```typescript
 * const result = await enforceImagePolicy('myapp:latest', {
 *   maxVulnerabilities: { critical: 0, high: 5 },
 *   requireSignature: true
 * });
 * ```
 */
export declare const enforceImagePolicy: (imageName: string, policy: {
    maxVulnerabilities?: {
        critical: number;
        high: number;
    };
    requireSignature?: boolean;
    allowedRegistries?: string[];
}) => Promise<{
    allowed: boolean;
    violations: string[];
}>;
/**
 * Monitors container network traffic for threats.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerNetworkThreat[]>} Network threats
 *
 * @example
 * ```typescript
 * const networkThreats = await monitorContainerNetwork('container-abc123');
 * ```
 */
export declare const monitorContainerNetwork: (containerId: string) => Promise<ContainerNetworkThreat[]>;
/**
 * Detects port scanning from containers.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerNetworkThreat[]>} Port scan detections
 *
 * @example
 * ```typescript
 * const portScans = await detectContainerPortScan('container-abc123');
 * ```
 */
export declare const detectContainerPortScan: (containerId: string) => Promise<ContainerNetworkThreat[]>;
/**
 * Monitors container lateral movement attempts.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @returns {Promise<ContainerNetworkThreat[]>} Lateral movement detections
 *
 * @example
 * ```typescript
 * const lateralMovement = await detectContainerLateralMovement('cluster-123');
 * ```
 */
export declare const detectContainerLateralMovement: (clusterId: string) => Promise<ContainerNetworkThreat[]>;
/**
 * Detects data exfiltration from containers.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerNetworkThreat | null>} Data exfiltration detection
 *
 * @example
 * ```typescript
 * const exfiltration = await detectDataExfiltration('container-abc123');
 * ```
 */
export declare const detectDataExfiltration: (containerId: string) => Promise<ContainerNetworkThreat | null>;
/**
 * Validates Kubernetes service mesh security.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @returns {Promise<{encrypted: boolean; mtlsEnabled: boolean; findings: string[]}>} Service mesh security
 *
 * @example
 * ```typescript
 * const serviceMesh = await validateServiceMeshSecurity('cluster-123');
 * ```
 */
export declare const validateServiceMeshSecurity: (clusterId: string) => Promise<{
    encrypted: boolean;
    mtlsEnabled: boolean;
    findings: string[];
}>;
/**
 * Assesses container compliance against frameworks.
 *
 * @param {string} containerId - Container ID
 * @param {string[]} frameworks - Compliance frameworks
 * @returns {Promise<ContainerCompliance>} Compliance assessment
 *
 * @example
 * ```typescript
 * const compliance = await assessContainerCompliance('container-abc123', ['CIS', 'HIPAA']);
 * ```
 */
export declare const assessContainerCompliance: (containerId: string, frameworks: string[]) => Promise<ContainerCompliance>;
/**
 * Validates container HIPAA compliance.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<ContainerCompliance>} HIPAA compliance status
 *
 * @example
 * ```typescript
 * const hipaaCompliance = await validateContainerHIPAACompliance('container-abc123');
 * ```
 */
export declare const validateContainerHIPAACompliance: (containerId: string) => Promise<ContainerCompliance>;
/**
 * Checks CIS Kubernetes Benchmark compliance.
 *
 * @param {string} clusterId - Kubernetes cluster ID
 * @returns {Promise<ContainerCompliance>} CIS benchmark results
 *
 * @example
 * ```typescript
 * const cisBenchmark = await checkCISKubernetesBenchmark('cluster-123');
 * ```
 */
export declare const checkCISKubernetesBenchmark: (clusterId: string) => Promise<ContainerCompliance>;
/**
 * Creates container security incident.
 *
 * @param {object} incidentData - Incident data
 * @returns {ContainerIncident} Created incident
 *
 * @example
 * ```typescript
 * const incident = createContainerIncident({
 *   incidentType: 'malware_detected',
 *   severity: ContainerSeverity.CRITICAL,
 *   title: 'Malware in Production Container',
 *   affectedContainers: ['container-123']
 * });
 * ```
 */
export declare const createContainerIncident: (incidentData: {
    incidentType: string;
    severity: ContainerSeverity;
    title: string;
    description: string;
    affectedContainers: string[];
    affectedImages: string[];
}) => ContainerIncident;
/**
 * Quarantines compromised container.
 *
 * @param {string} containerId - Container ID
 * @param {string} reason - Quarantine reason
 * @returns {Promise<{quarantined: boolean; actions: string[]}>} Quarantine result
 *
 * @example
 * ```typescript
 * const result = await quarantineContainer('container-abc123', 'Malware detected');
 * ```
 */
export declare const quarantineContainer: (containerId: string, reason: string) => Promise<{
    quarantined: boolean;
    actions: string[];
}>;
/**
 * Performs container forensics analysis.
 *
 * @param {string} containerId - Container ID
 * @returns {Promise<{processes: ProcessInfo[]; networkConnections: NetworkConnection[]; fileChanges: FileSystemChange[]}>} Forensics data
 *
 * @example
 * ```typescript
 * const forensics = await performContainerForensics('container-abc123');
 * ```
 */
export declare const performContainerForensics: (containerId: string) => Promise<{
    processes: ProcessInfo[];
    networkConnections: NetworkConnection[];
    fileChanges: FileSystemChange[];
}>;
/**
 * Generates container incident report.
 *
 * @param {string} incidentId - Incident ID
 * @returns {Promise<{summary: string; timeline: IncidentEvent[]; recommendations: string[]}>} Incident report
 *
 * @example
 * ```typescript
 * const report = await generateContainerIncidentReport('incident-123');
 * ```
 */
export declare const generateContainerIncidentReport: (incidentId: string) => Promise<{
    summary: string;
    timeline: IncidentEvent[];
    recommendations: string[];
}>;
/**
 * NestJS Controller for Container Security Intelligence API.
 *
 * @example
 * ```typescript
 * import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
 * import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 * import { RolesGuard } from '../auth/roles.guard';
 * import { Roles } from '../auth/roles.decorator';
 *
 * @ApiTags('Container Security Intelligence')
 * @Controller('api/v1/container-security')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @ApiBearerAuth()
 * export class ContainerSecurityController {
 *   constructor(private readonly containerSecurityService: ContainerSecurityService) {}
 *
 *   @Post('scan/image')
 *   @Roles('security_admin', 'devops')
 *   @ApiOperation({ summary: 'Scan container image for vulnerabilities' })
 *   @ApiResponse({ status: 200, description: 'Scan completed', type: ContainerImageScan })
 *   async scanImage(
 *     @Body() request: { imageName: string; imageTag: string; scanType?: string }
 *   ): Promise<ContainerImageScan> {
 *     return scanContainerImage(request.imageName, request.imageTag, {
 *       scanType: request.scanType as any,
 *       includeSecrets: true,
 *       includeMisconfigurations: true,
 *     });
 *   }
 *
 *   @Get('runtime/threats/:containerId')
 *   @Roles('security_admin', 'soc_analyst')
 *   @ApiOperation({ summary: 'Monitor container runtime threats' })
 *   @ApiResponse({ status: 200, type: [ContainerRuntimeThreat] })
 *   async getRuntimeThreats(
 *     @Param('containerId') containerId: string
 *   ): Promise<ContainerRuntimeThreat[]> {
 *     return monitorContainerRuntime(containerId, {
 *       monitorProcesses: true,
 *       monitorNetwork: true,
 *       monitorFileSystem: true,
 *     });
 *   }
 *
 *   @Get('kubernetes/scan/:clusterId')
 *   @Roles('security_admin', 'k8s_admin')
 *   @ApiOperation({ summary: 'Scan Kubernetes cluster' })
 *   @ApiResponse({ status: 200, type: [KubernetesSecurity] })
 *   async scanKubernetes(
 *     @Param('clusterId') clusterId: string,
 *     @Query('clusterName') clusterName: string
 *   ): Promise<KubernetesSecurity[]> {
 *     return scanKubernetesCluster(clusterId, clusterName);
 *   }
 *
 *   @Get('registry/analyze')
 *   @Roles('security_admin', 'devops')
 *   @ApiOperation({ summary: 'Analyze container registry' })
 *   @ApiResponse({ status: 200, type: ContainerRegistry })
 *   async analyzeRegistry(
 *     @Query('registryUrl') registryUrl: string,
 *     @Query('registryType') registryType: RegistryType
 *   ): Promise<ContainerRegistry> {
 *     return analyzeContainerRegistry(registryUrl, registryType);
 *   }
 *
 *   @Get('network/threats/:containerId')
 *   @Roles('security_admin', 'network_security')
 *   @ApiOperation({ summary: 'Monitor container network threats' })
 *   @ApiResponse({ status: 200, type: [ContainerNetworkThreat] })
 *   async getNetworkThreats(
 *     @Param('containerId') containerId: string
 *   ): Promise<ContainerNetworkThreat[]> {
 *     return monitorContainerNetwork(containerId);
 *   }
 *
 *   @Get('compliance/:containerId')
 *   @Roles('security_admin', 'compliance_officer')
 *   @ApiOperation({ summary: 'Assess container compliance' })
 *   @ApiResponse({ status: 200, type: ContainerCompliance })
 *   async assessCompliance(
 *     @Param('containerId') containerId: string,
 *     @Query('frameworks') frameworks: string
 *   ): Promise<ContainerCompliance> {
 *     const frameworkList = frameworks.split(',');
 *     return assessContainerCompliance(containerId, frameworkList);
 *   }
 *
 *   @Post('incident/create')
 *   @Roles('security_admin', 'soc_analyst')
 *   @ApiOperation({ summary: 'Create container incident' })
 *   @ApiResponse({ status: 201, type: ContainerIncident })
 *   async createIncident(
 *     @Body() incidentData: any
 *   ): Promise<ContainerIncident> {
 *     return createContainerIncident(incidentData);
 *   }
 *
 *   @Post('quarantine/:containerId')
 *   @Roles('security_admin', 'incident_responder')
 *   @ApiOperation({ summary: 'Quarantine compromised container' })
 *   @ApiResponse({ status: 200 })
 *   async quarantine(
 *     @Param('containerId') containerId: string,
 *     @Body('reason') reason: string
 *   ): Promise<{ quarantined: boolean; actions: string[] }> {
 *     return quarantineContainer(containerId, reason);
 *   }
 *
 *   @Get('forensics/:containerId')
 *   @Roles('security_admin', 'forensics_analyst')
 *   @ApiOperation({ summary: 'Perform container forensics' })
 *   @ApiResponse({ status: 200 })
 *   async getForensics(
 *     @Param('containerId') containerId: string
 *   ): Promise<any> {
 *     return performContainerForensics(containerId);
 *   }
 * }
 * ```
 */
export declare const defineContainerSecurityController: () => string;
declare const _default: {
    getContainerVulnerabilityModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        cveId: {
            type: string;
            allowNull: boolean;
        };
        imageId: {
            type: string;
            allowNull: boolean;
        };
        imageName: {
            type: string;
            allowNull: boolean;
        };
        imageTag: {
            type: string;
            allowNull: boolean;
        };
        imageDigest: {
            type: string;
            allowNull: boolean;
        };
        packageName: {
            type: string;
            allowNull: boolean;
        };
        packageVersion: {
            type: string;
            allowNull: boolean;
        };
        vulnerabilityType: {
            type: string;
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: ContainerSeverity[];
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        fixedVersion: {
            type: string;
            allowNull: boolean;
        };
        publishedDate: {
            type: string;
            allowNull: boolean;
        };
        modifiedDate: {
            type: string;
            allowNull: boolean;
        };
        cvssScore: {
            type: string;
            allowNull: boolean;
        };
        cvssVector: {
            type: string;
            allowNull: boolean;
        };
        exploitAvailable: {
            type: string;
            defaultValue: boolean;
        };
        references: {
            type: string;
            defaultValue: never[];
        };
        affectedLayers: {
            type: string;
            defaultValue: never[];
        };
        remediation: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        detectedAt: {
            type: string;
            allowNull: boolean;
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
    getContainerRuntimeThreatModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        containerId: {
            type: string;
            allowNull: boolean;
        };
        containerName: {
            type: string;
            allowNull: boolean;
        };
        imageId: {
            type: string;
            allowNull: boolean;
        };
        imageName: {
            type: string;
            allowNull: boolean;
        };
        namespace: {
            type: string;
            allowNull: boolean;
        };
        podName: {
            type: string;
            allowNull: boolean;
        };
        nodeName: {
            type: string;
            allowNull: boolean;
        };
        threatCategory: {
            type: string;
            values: ContainerThreatCategory[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: ContainerSeverity[];
            allowNull: boolean;
        };
        threatType: {
            type: string;
            values: RuntimeThreatType[];
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
        affectedProcesses: {
            type: string;
            defaultValue: never[];
        };
        networkConnections: {
            type: string;
            defaultValue: never[];
        };
        fileSystemChanges: {
            type: string;
            defaultValue: never[];
        };
        recommendation: {
            type: string;
            allowNull: boolean;
        };
        mitreAttack: {
            type: string;
            allowNull: boolean;
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
    getKubernetesSecurityModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        clusterId: {
            type: string;
            allowNull: boolean;
        };
        clusterName: {
            type: string;
            allowNull: boolean;
        };
        namespace: {
            type: string;
            allowNull: boolean;
        };
        resourceType: {
            type: string;
            values: K8sResourceType[];
            allowNull: boolean;
        };
        resourceName: {
            type: string;
            allowNull: boolean;
        };
        securityFinding: {
            type: string;
            values: K8sSecurityFinding[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: ContainerSeverity[];
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
        status: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        complianceImpact: {
            type: string;
            defaultValue: never[];
        };
        cis_benchmark: {
            type: string;
            allowNull: boolean;
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
    scanContainerImage: (imageName: string, imageTag: string, options?: {
        scanType?: "full" | "quick" | "compliance" | "malware";
        includeSecrets?: boolean;
        includeMisconfigurations?: boolean;
    }) => Promise<ContainerImageScan>;
    scanContainerSecrets: (imageName: string, imageTag: string) => Promise<Array<{
        type: string;
        location: string;
        severity: ContainerSeverity;
    }>>;
    analyzeContainerLayers: (imageId: string) => Promise<Array<{
        layer: string;
        issues: string[];
        size: number;
    }>>;
    scanContainerMalware: (imageName: string, imageTag: string) => Promise<{
        detected: boolean;
        threats: Array<{
            name: string;
            type: string;
            severity: ContainerSeverity;
        }>;
    }>;
    generateContainerSBOM: (imageName: string, imageTag: string) => Promise<{
        packages: Array<{
            name: string;
            version: string;
            license: string;
        }>;
    }>;
    monitorContainerRuntime: (containerId: string, options?: {
        monitorProcesses?: boolean;
        monitorNetwork?: boolean;
        monitorFileSystem?: boolean;
    }) => Promise<ContainerRuntimeThreat[]>;
    detectContainerEscape: (containerId: string) => Promise<ContainerRuntimeThreat[]>;
    monitorContainerFileSystem: (containerId: string) => Promise<FileSystemChange[]>;
    detectContainerCryptoMining: (containerId: string) => Promise<ContainerRuntimeThreat | null>;
    detectReverseShell: (containerId: string) => Promise<ContainerRuntimeThreat | null>;
    scanKubernetesCluster: (clusterId: string, clusterName: string) => Promise<KubernetesSecurity[]>;
    checkKubernetesRBAC: (clusterId: string) => Promise<KubernetesSecurity[]>;
    validateKubernetesNetworkPolicies: (clusterId: string, namespace: string) => Promise<KubernetesSecurity[]>;
    scanKubernetesPodSecurity: (clusterId: string, namespace: string) => Promise<KubernetesSecurity[]>;
    auditKubernetesSecrets: (clusterId: string) => Promise<KubernetesSecurity[]>;
    analyzeContainerRegistry: (registryUrl: string, registryType: RegistryType) => Promise<ContainerRegistry>;
    scanRegistryVulnerabilities: (registryUrl: string) => Promise<Array<{
        imageName: string;
        vulnerabilityCount: number;
        severity: ContainerSeverity;
    }>>;
    validateImageSignature: (imageName: string, imageDigest: string) => Promise<{
        signed: boolean;
        valid: boolean;
        signers: string[];
    }>;
    checkImageProvenance: (imageName: string, imageDigest: string) => Promise<{
        verified: boolean;
        builder: string;
        buildTime: Date;
        sourceRepo: string;
    }>;
    enforceImagePolicy: (imageName: string, policy: {
        maxVulnerabilities?: {
            critical: number;
            high: number;
        };
        requireSignature?: boolean;
        allowedRegistries?: string[];
    }) => Promise<{
        allowed: boolean;
        violations: string[];
    }>;
    monitorContainerNetwork: (containerId: string) => Promise<ContainerNetworkThreat[]>;
    detectContainerPortScan: (containerId: string) => Promise<ContainerNetworkThreat[]>;
    detectContainerLateralMovement: (clusterId: string) => Promise<ContainerNetworkThreat[]>;
    detectDataExfiltration: (containerId: string) => Promise<ContainerNetworkThreat | null>;
    validateServiceMeshSecurity: (clusterId: string) => Promise<{
        encrypted: boolean;
        mtlsEnabled: boolean;
        findings: string[];
    }>;
    assessContainerCompliance: (containerId: string, frameworks: string[]) => Promise<ContainerCompliance>;
    validateContainerHIPAACompliance: (containerId: string) => Promise<ContainerCompliance>;
    checkCISKubernetesBenchmark: (clusterId: string) => Promise<ContainerCompliance>;
    createContainerIncident: (incidentData: {
        incidentType: string;
        severity: ContainerSeverity;
        title: string;
        description: string;
        affectedContainers: string[];
        affectedImages: string[];
    }) => ContainerIncident;
    quarantineContainer: (containerId: string, reason: string) => Promise<{
        quarantined: boolean;
        actions: string[];
    }>;
    performContainerForensics: (containerId: string) => Promise<{
        processes: ProcessInfo[];
        networkConnections: NetworkConnection[];
        fileChanges: FileSystemChange[];
    }>;
    generateContainerIncidentReport: (incidentId: string) => Promise<{
        summary: string;
        timeline: IncidentEvent[];
        recommendations: string[];
    }>;
    defineContainerSecurityController: () => string;
};
export default _default;
//# sourceMappingURL=container-security-intelligence-kit.d.ts.map