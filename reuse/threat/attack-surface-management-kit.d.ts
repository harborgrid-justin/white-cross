/**
 * LOC: THREAT-ASM-001
 * File: /reuse/threat/attack-surface-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS threat management services
 *   - Security scanning modules
 *   - Attack surface controllers
 *   - Asset inventory services
 *   - Shadow IT detection services
 */
interface AssetInventoryItem {
    assetId: string;
    assetType: 'server' | 'workstation' | 'mobile' | 'iot' | 'cloud' | 'network_device' | 'application' | 'database';
    hostname?: string;
    ipAddress?: string;
    macAddress?: string;
    owner?: string;
    department?: string;
    location?: string;
    operatingSystem?: string;
    criticality: 'critical' | 'high' | 'medium' | 'low';
    discoveryMethod: 'automated_scan' | 'manual_entry' | 'integration' | 'passive_discovery';
    firstDiscovered: Date;
    lastSeen: Date;
    status: 'active' | 'inactive' | 'decommissioned' | 'unknown';
    metadata?: Record<string, any>;
}
interface AttackSurfaceMap {
    surfaceId: string;
    organizationId: string;
    scanDate: Date;
    externalAssets: ExternalAsset[];
    exposedServices: ExposedService[];
    openPorts: PortInfo[];
    subdomains: string[];
    sslCertificates: SSLCertInfo[];
    dnsRecords: DNSRecord[];
    riskScore: number;
    totalExposure: number;
}
interface ExternalAsset {
    assetId: string;
    ipAddress: string;
    hostname?: string;
    assetType: string;
    isPubliclyAccessible: boolean;
    cloudProvider?: string;
    region?: string;
    exposureLevel: 'critical' | 'high' | 'medium' | 'low';
}
interface ExposedService {
    serviceId: string;
    serviceName: string;
    port: number;
    protocol: 'tcp' | 'udp';
    version?: string;
    banner?: string;
    vulnerabilities: string[];
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    authentication: 'required' | 'optional' | 'none';
}
interface PortInfo {
    port: number;
    protocol: 'tcp' | 'udp';
    state: 'open' | 'closed' | 'filtered';
    service?: string;
    version?: string;
    lastScanned: Date;
}
interface SSLCertInfo {
    domain: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    isExpired: boolean;
    daysUntilExpiry: number;
    algorithm: string;
    keySize: number;
    hasWeakCipher: boolean;
    vulnerabilities: string[];
}
interface DNSRecord {
    domain: string;
    recordType: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA';
    value: string;
    ttl: number;
    isSecure: boolean;
}
interface EndpointExposure {
    endpointId: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    requiresAuth: boolean;
    authType?: 'bearer' | 'basic' | 'api_key' | 'oauth2';
    isPublic: boolean;
    hasRateLimit: boolean;
    sensitiveDataExposed: boolean;
    riskScore: number;
    lastTested: Date;
}
interface ShadowITAsset {
    assetId: string;
    assetName: string;
    assetType: 'cloud_service' | 'saas_application' | 'rogue_device' | 'unauthorized_software';
    discoveryDate: Date;
    users: string[];
    department?: string;
    dataSensitivity: 'high' | 'medium' | 'low';
    complianceRisk: 'critical' | 'high' | 'medium' | 'low';
    isApproved: boolean;
    recommendations: string[];
}
interface CloudAsset {
    assetId: string;
    provider: 'aws' | 'azure' | 'gcp' | 'other';
    resourceType: string;
    region: string;
    isPubliclyAccessible: boolean;
    hasEncryption: boolean;
    hasLogging: boolean;
    misconfigurations: string[];
    securityScore: number;
    cost: number;
    tags: Record<string, string>;
}
interface AttackVector {
    vectorId: string;
    vectorType: 'network' | 'web' | 'email' | 'physical' | 'social' | 'supply_chain';
    targetAsset: string;
    exploitPath: string[];
    likelihood: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    impact: 'critical' | 'high' | 'medium' | 'low';
    riskScore: number;
    mitigations: string[];
    cvssScore?: number;
}
interface ScanConfig {
    scanType: 'full' | 'quick' | 'targeted';
    targets: string[];
    portRange?: {
        start: number;
        end: number;
    };
    timeout?: number;
    maxConcurrency?: number;
    includeVersionDetection?: boolean;
    includeVulnerabilityCheck?: boolean;
}
interface ServiceVulnerability {
    cveId?: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    affectedService: string;
    affectedVersion: string;
    cvssScore: number;
    exploitAvailable: boolean;
    patchAvailable: boolean;
    recommendation: string;
}
/**
 * Generate comprehensive asset inventory across entire infrastructure
 * @param config - Inventory configuration with scope and discovery methods
 * @returns Complete asset inventory with categorization and metadata
 *
 * @example
 * ```typescript
 * const inventory = await generateAssetInventory({
 *   scope: 'organization',
 *   discoveryMethods: ['automated_scan', 'integration'],
 *   includeCloud: true,
 *   includeNetwork: true
 * });
 * // Returns: { assets: [...], totalCount: 1234, categories: {...} }
 * ```
 *
 * @swagger
 * /api/attack-surface/inventory/generate:
 *   post:
 *     summary: Generate comprehensive asset inventory
 *     tags: [Asset Discovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: string
 *                 enum: [organization, department, location]
 *               discoveryMethods:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Asset inventory generated successfully
 */
export declare function generateAssetInventory(config: {
    scope: 'organization' | 'department' | 'location';
    scopeId?: string;
    discoveryMethods: ('automated_scan' | 'manual_entry' | 'integration' | 'passive_discovery')[];
    includeCloud?: boolean;
    includeNetwork?: boolean;
    includeApplications?: boolean;
}): Promise<{
    inventoryId: string;
    generatedAt: Date;
    assets: AssetInventoryItem[];
    totalCount: number;
    categories: Record<string, number>;
    criticalAssets: number;
    summary: {
        byType: Record<string, number>;
        byStatus: Record<string, number>;
        byCriticality: Record<string, number>;
    };
}>;
/**
 * Discover network assets using active and passive scanning
 */
export declare function discoverNetworkAssets(config: {
    networkRanges: string[];
    scanType: 'active' | 'passive' | 'both';
    includeVulnerabilityAssessment?: boolean;
}): Promise<{
    discovered: AssetInventoryItem[];
    scanDuration: number;
    coverage: number;
}>;
/**
 * Scan and catalog all domains and subdomains
 */
export declare function scanDomainAssets(config: {
    domains: string[];
    includeSubdomains?: boolean;
    maxDepth?: number;
}): Promise<{
    domains: Array<{
        domain: string;
        subdomains: string[];
        dnsRecords: DNSRecord[];
        sslCertificates: SSLCertInfo[];
    }>;
    totalSubdomains: number;
}>;
/**
 * Identify and catalog cloud resources across providers
 */
export declare function identifyCloudResources(config: {
    providers: ('aws' | 'azure' | 'gcp')[];
    regions?: string[];
    includeMetadata?: boolean;
}): Promise<{
    resources: CloudAsset[];
    totalCost: number;
    byProvider: Record<string, number>;
}>;
/**
 * Catalog all API endpoints across applications
 */
export declare function catalogAPIEndpoints(config: {
    applications: string[];
    includeDocumentation?: boolean;
    includeSecurityAnalysis?: boolean;
}): Promise<{
    endpoints: EndpointExposure[];
    totalEndpoints: number;
    publicEndpoints: number;
    unauthenticatedEndpoints: number;
}>;
/**
 * Inventory and classify web applications
 */
export declare function inventoryWebApplications(config: {
    domains: string[];
    includeTechnologyStack?: boolean;
    includeSecurityHeaders?: boolean;
}): Promise<{
    applications: Array<{
        appId: string;
        url: string;
        technologies: string[];
        securityHeaders: Record<string, boolean>;
        riskScore: number;
    }>;
    totalApplications: number;
}>;
/**
 * Track and monitor asset changes over time
 */
export declare function trackAssetChanges(config: {
    assetId?: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    changeTypes?: ('added' | 'modified' | 'removed')[];
}): Promise<{
    changes: Array<{
        changeId: string;
        assetId: string;
        changeType: 'added' | 'modified' | 'removed';
        timestamp: Date;
        changes: Record<string, {
            old: any;
            new: any;
        }>;
        detectedBy: string;
    }>;
    totalChanges: number;
}>;
/**
 * Export asset inventory in various formats
 */
export declare function exportAssetInventory(config: {
    inventoryId?: string;
    format: 'json' | 'csv' | 'xml' | 'excel';
    includeMetadata?: boolean;
    filters?: Record<string, any>;
}): Promise<{
    exportId: string;
    format: string;
    data: string | Buffer;
    recordCount: number;
    generatedAt: Date;
}>;
/**
 * Map complete external attack surface
 */
export declare function mapExternalAttackSurface(config: {
    organizationId: string;
    domains: string[];
    ipRanges: string[];
    includeCloudAssets?: boolean;
}): Promise<AttackSurfaceMap>;
/**
 * Identify all exposed services on external assets
 */
export declare function identifyExposedServices(config: {
    targets: string[];
    portRange?: {
        start: number;
        end: number;
    };
    includeVersionDetection?: boolean;
}): Promise<{
    services: ExposedService[];
    totalExposed: number;
    criticalServices: number;
}>;
/**
 * Discover and catalog public IP addresses
 */
export declare function discoverPublicIPs(config: {
    organizationId: string;
    includeGeolocation?: boolean;
    includeReputationCheck?: boolean;
}): Promise<{
    publicIPs: Array<{
        ipAddress: string;
        location?: {
            country: string;
            city: string;
        };
        reputation: 'clean' | 'suspicious' | 'malicious';
        associatedAssets: string[];
    }>;
    totalIPs: number;
}>;
/**
 * Enumerate all subdomains for given domains
 */
export declare function enumerateSubdomains(config: {
    domains: string[];
    methods: ('dns' | 'certificate_transparency' | 'brute_force')[];
    maxDepth?: number;
}): Promise<{
    subdomains: Array<{
        subdomain: string;
        parentDomain: string;
        discoveryMethod: string;
        ipAddresses: string[];
        isActive: boolean;
    }>;
    totalSubdomains: number;
}>;
/**
 * Detect all open ports on target systems
 */
export declare function detectOpenPorts(config: ScanConfig): Promise<{
    ports: PortInfo[];
    openPorts: number;
    filteredPorts: number;
    scanDuration: number;
}>;
/**
 * Scan and analyze SSL/TLS certificates
 */
export declare function scanSSLCertificates(config: {
    domains: string[];
    checkExpiry?: boolean;
    checkVulnerabilities?: boolean;
}): Promise<{
    certificates: SSLCertInfo[];
    expiringSoon: number;
    hasVulnerabilities: number;
}>;
/**
 * Analyze external DNS records for security issues
 */
export declare function analyzeExternalDNS(config: {
    domains: string[];
    recordTypes?: ('A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA')[];
    checkDNSSEC?: boolean;
}): Promise<{
    records: DNSRecord[];
    issues: Array<{
        domain: string;
        issue: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        recommendation: string;
    }>;
    totalRecords: number;
}>;
/**
 * Visualize attack surface with risk scoring
 */
export declare function visualizeAttackSurface(config: {
    surfaceId: string;
    groupBy?: 'asset_type' | 'risk_level' | 'location';
    includeMetrics?: boolean;
}): Promise<{
    visualization: {
        nodes: Array<{
            id: string;
            type: string;
            label: string;
            riskScore: number;
        }>;
        edges: Array<{
            source: string;
            target: string;
            relationship: string;
        }>;
    };
    metrics: {
        totalAssets: number;
        highRiskAssets: number;
        exposureScore: number;
    };
}>;
/**
 * Scan port ranges on target systems
 */
export declare function scanPortRange(config: ScanConfig): Promise<{
    scanId: string;
    results: PortInfo[];
    summary: {
        totalScanned: number;
        openPorts: number;
        closedPorts: number;
        filteredPorts: number;
    };
    duration: number;
}>;
/**
 * Identify active services on discovered ports
 */
export declare function identifyActiveServices(config: {
    targets: string[];
    ports?: number[];
    timeout?: number;
}): Promise<{
    services: ExposedService[];
    activeServices: number;
    unknownServices: number;
}>;
/**
 * Detect service versions and fingerprints
 */
export declare function detectServiceVersions(config: {
    services: ExposedService[];
    deepScan?: boolean;
}): Promise<{
    versioned: Array<ExposedService & {
        fingerprint: string;
    }>;
    detectionRate: number;
}>;
/**
 * Analyze services for known vulnerabilities
 */
export declare function analyzeServiceVulnerabilities(config: {
    services: ExposedService[];
    includeExploits?: boolean;
    severityThreshold?: 'critical' | 'high' | 'medium' | 'low';
}): Promise<{
    vulnerabilities: ServiceVulnerability[];
    criticalVulns: number;
    exploitableVulns: number;
}>;
/**
 * Check for default or weak credentials
 */
export declare function checkDefaultCredentials(config: {
    services: ExposedService[];
    credentialDatabase?: string;
}): Promise<{
    vulnerableServices: Array<{
        service: ExposedService;
        credentialFound: string;
        severity: 'critical' | 'high';
    }>;
    totalVulnerable: number;
}>;
/**
 * Assess overall security posture of services
 */
export declare function assessServiceSecurity(config: {
    services: ExposedService[];
    includeCompliance?: boolean;
}): Promise<{
    assessment: {
        serviceId: string;
        securityScore: number;
        findings: string[];
        recommendations: string[];
    }[];
    overallScore: number;
}>;
/**
 * Export scan results in various formats
 */
export declare function exportScanResults(config: {
    scanId: string;
    format: 'json' | 'xml' | 'csv' | 'html';
    includeRawData?: boolean;
}): Promise<{
    exportId: string;
    data: string | Buffer;
    size: number;
}>;
/**
 * Detect all exposed endpoints across applications
 */
export declare function detectExposedEndpoints(config: {
    applications: string[];
    scanDepth?: 'shallow' | 'deep';
    includeAPIs?: boolean;
}): Promise<{
    endpoints: EndpointExposure[];
    totalEndpoints: number;
    riskDistribution: Record<string, number>;
}>;
/**
 * Scan for API exposure and documentation leaks
 */
export declare function scanAPIExposure(config: {
    baseUrls: string[];
    checkDocumentation?: boolean;
    checkSwaggerFiles?: boolean;
}): Promise<{
    exposedAPIs: Array<{
        url: string;
        hasDocumentation: boolean;
        swaggerEndpoint?: string;
        sensitiveInfoLeaked: string[];
        riskLevel: 'critical' | 'high' | 'medium' | 'low';
    }>;
    totalExposed: number;
}>;
/**
 * Identify endpoints without authentication
 */
export declare function identifyUnauthenticatedEndpoints(config: {
    endpoints: EndpointExposure[];
    testAuthentication?: boolean;
}): Promise<{
    unauthenticated: EndpointExposure[];
    totalUnauthenticated: number;
    highRiskEndpoints: EndpointExposure[];
}>;
/**
 * Check security of endpoint implementations
 */
export declare function checkEndpointSecurity(config: {
    endpoints: EndpointExposure[];
    checks: ('rate_limit' | 'input_validation' | 'output_encoding' | 'csrf_protection')[];
}): Promise<{
    results: Array<{
        endpoint: EndpointExposure;
        securityChecks: Record<string, boolean>;
        securityScore: number;
        issues: string[];
    }>;
    averageScore: number;
}>;
/**
 * Analyze risk level of exposed endpoints
 */
export declare function analyzeEndpointRisk(config: {
    endpoints: EndpointExposure[];
    riskFactors?: string[];
}): Promise<{
    riskAnalysis: Array<{
        endpoint: EndpointExposure;
        riskFactors: Array<{
            factor: string;
            weight: number;
            present: boolean;
        }>;
        aggregatedRisk: number;
        priorityLevel: 'critical' | 'high' | 'medium' | 'low';
    }>;
    criticalEndpoints: number;
}>;
/**
 * Monitor endpoint changes over time
 */
export declare function monitorEndpointChanges(config: {
    applicationId: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    changeTypes?: ('added' | 'removed' | 'modified')[];
}): Promise<{
    changes: Array<{
        changeId: string;
        endpointId: string;
        changeType: 'added' | 'removed' | 'modified';
        timestamp: Date;
        details: Record<string, any>;
    }>;
    totalChanges: number;
}>;
/**
 * Generate comprehensive endpoint security report
 */
export declare function generateEndpointReport(config: {
    applicationId: string;
    includeRecommendations?: boolean;
    format?: 'json' | 'pdf' | 'html';
}): Promise<{
    reportId: string;
    summary: {
        totalEndpoints: number;
        unauthenticatedEndpoints: number;
        highRiskEndpoints: number;
        averageSecurityScore: number;
    };
    recommendations: string[];
    generatedAt: Date;
}>;
/**
 * Detect shadow IT across organization
 */
export declare function detectShadowIT(config: {
    organizationId: string;
    detectionMethods: ('network_traffic' | 'cloud_access' | 'expense_reports' | 'user_surveys')[];
    sensitivity?: 'high' | 'medium' | 'low';
}): Promise<{
    shadowAssets: ShadowITAsset[];
    totalShadowIT: number;
    criticalRisk: number;
    byCategory: Record<string, number>;
}>;
/**
 * Scan for unauthorized services and applications
 */
export declare function scanUnauthorizedServices(config: {
    scope: 'network' | 'cloud' | 'endpoints' | 'all';
    approvedList?: string[];
}): Promise<{
    unauthorizedServices: Array<{
        serviceName: string;
        serviceType: string;
        firstDetected: Date;
        usage: number;
        risk: 'critical' | 'high' | 'medium' | 'low';
    }>;
    totalUnauthorized: number;
}>;
/**
 * Identify rogue devices on network
 */
export declare function identifyRogueDevices(config: {
    networkSegments: string[];
    knownDevices?: string[];
    scanInterval?: number;
}): Promise<{
    rogueDevices: Array<{
        deviceId: string;
        macAddress: string;
        ipAddress: string;
        firstSeen: Date;
        deviceType: string;
    }>;
}>;
/**
 * Track unapproved cloud service usage
 */
export declare function trackUnapprovedCloud(config: {
    organizationId: string;
    approvedProviders?: string[];
    includeUsageMetrics?: boolean;
}): Promise<{
    unapprovedServices: Array<{
        serviceName: string;
        provider: string;
        users: string[];
        dataVolume: number;
        costEstimate: number;
        riskLevel: 'critical' | 'high' | 'medium' | 'low';
    }>;
    totalServices: number;
    totalCost: number;
}>;
/**
 * Assess risk of shadow IT assets
 */
export declare function assessShadowITRisk(config: {
    assets: ShadowITAsset[];
    riskFramework?: 'nist' | 'iso27001' | 'custom';
}): Promise<{
    assessments: Array<{
        asset: ShadowITAsset;
        riskScore: number;
        threatVectors: string[];
        complianceImpact: string[];
        businessImpact: string;
    }>;
    overallRisk: number;
}>;
/**
 * Generate shadow IT findings report
 */
export declare function reportShadowITFindings(config: {
    organizationId: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    includeRecommendations?: boolean;
}): Promise<{
    reportId: string;
    findings: {
        totalShadowIT: number;
        criticalAssets: number;
        estimatedCost: number;
        complianceRisks: number;
    };
    topRisks: ShadowITAsset[];
    recommendations: string[];
    generatedAt: Date;
}>;
/**
 * Monitor cloud assets across providers
 */
export declare function monitorCloudAssets(config: {
    providers: ('aws' | 'azure' | 'gcp')[];
    regions?: string[];
    includeRealtime?: boolean;
}): Promise<{
    assets: CloudAsset[];
    totalAssets: number;
    byProvider: Record<string, number>;
    alerts: Array<{
        severity: 'critical' | 'high' | 'medium' | 'low';
        message: string;
        assetId: string;
    }>;
}>;
/**
 * Scan for cloud misconfigurations
 */
export declare function scanCloudMisconfigurations(config: {
    providers: ('aws' | 'azure' | 'gcp')[];
    checkTypes?: ('security_groups' | 'iam_policies' | 'encryption' | 'logging' | 'public_access')[];
}): Promise<{
    misconfigurations: Array<{
        assetId: string;
        provider: string;
        misconfigType: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        description: string;
        remediation: string;
    }>;
    totalMisconfigs: number;
    criticalMisconfigs: number;
}>;
/**
 * Track cloud asset exposure and accessibility
 */
export declare function trackCloudExposure(config: {
    assets: CloudAsset[];
    includeNetworkPaths?: boolean;
}): Promise<{
    exposureMap: Array<{
        assetId: string;
        exposureLevel: 'internet' | 'vpc' | 'private';
        accessibleFrom: string[];
        exposureScore: number;
    }>;
    publiclyAccessible: number;
}>;
/**
 * Assess cloud security posture
 */
export declare function assessCloudSecurity(config: {
    provider: 'aws' | 'azure' | 'gcp';
    frameworks?: ('cis' | 'nist' | 'pci_dss')[];
}): Promise<{
    assessment: {
        provider: string;
        overallScore: number;
        frameworkScores: Record<string, number>;
        findings: Array<{
            category: string;
            passed: number;
            failed: number;
            notApplicable: number;
        }>;
    };
    recommendations: string[];
}>;
/**
 * Alert on high-risk cloud configurations
 */
export declare function alertCloudRisks(config: {
    assets: CloudAsset[];
    thresholds?: {
        securityScore?: number;
        publicAccess?: boolean;
        encryption?: boolean;
    };
    notificationChannels?: ('email' | 'slack' | 'pagerduty')[];
}): Promise<{
    alerts: Array<{
        alertId: string;
        assetId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        reason: string;
        timestamp: Date;
    }>;
    totalAlerts: number;
    criticalAlerts: number;
}>;
/**
 * Enumerate all possible attack vectors
 */
export declare function enumerateAttackVectors(config: {
    assets: AssetInventoryItem[];
    attackSurface: AttackSurfaceMap;
    includeChainedAttacks?: boolean;
}): Promise<{
    vectors: AttackVector[];
    totalVectors: number;
    byType: Record<string, number>;
}>;
/**
 * Prioritize attack vectors by risk
 */
export declare function prioritizeVectors(config: {
    vectors: AttackVector[];
    prioritizationMethod?: 'risk_score' | 'likelihood' | 'impact' | 'exploitability';
}): Promise<{
    prioritized: AttackVector[];
    topVectors: AttackVector[];
    recommendations: Array<{
        vector: AttackVector;
        priority: number;
        actionItems: string[];
    }>;
}>;
/**
 * Assess likelihood of vector exploitation
 */
export declare function assessVectorLikelihood(config: {
    vectors: AttackVector[];
    environmentFactors?: Record<string, any>;
}): Promise<{
    assessments: Array<{
        vector: AttackVector;
        likelihood: number;
        factors: Array<{
            factor: string;
            contribution: number;
        }>;
    }>;
}>;
/**
 * Map attack vectors to specific assets
 */
export declare function mapVectorToAsset(config: {
    vectors: AttackVector[];
    assets: AssetInventoryItem[];
}): Promise<{
    mapping: Array<{
        assetId: string;
        assetType: string;
        vectors: AttackVector[];
        totalRisk: number;
    }>;
}>;
/**
 * Generate attack vector analysis report
 */
export declare function generateVectorReport(config: {
    vectors: AttackVector[];
    includeVisualization?: boolean;
    format?: 'json' | 'pdf' | 'html';
}): Promise<{
    reportId: string;
    summary: {
        totalVectors: number;
        criticalVectors: number;
        averageRiskScore: number;
        topVectorTypes: string[];
    };
    detailedAnalysis: Array<{
        vectorType: string;
        count: number;
        averageRisk: number;
        examples: AttackVector[];
    }>;
    generatedAt: Date;
}>;
/**
 * Sequelize model for Asset Inventory
 */
export declare const AssetInventoryModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        assetId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        assetType: {
            type: string;
            values: string[];
        };
        hostname: {
            type: string;
        };
        ipAddress: {
            type: string;
        };
        macAddress: {
            type: string;
        };
        owner: {
            type: string;
        };
        department: {
            type: string;
        };
        location: {
            type: string;
        };
        operatingSystem: {
            type: string;
        };
        criticality: {
            type: string;
            values: string[];
        };
        discoveryMethod: {
            type: string;
            values: string[];
        };
        firstDiscovered: {
            type: string;
        };
        lastSeen: {
            type: string;
        };
        status: {
            type: string;
            values: string[];
        };
        metadata: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Attack Surface
 */
export declare const AttackSurfaceModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        surfaceId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
        };
        scanDate: {
            type: string;
        };
        externalAssets: {
            type: string;
        };
        exposedServices: {
            type: string;
        };
        openPorts: {
            type: string;
        };
        subdomains: {
            type: string;
        };
        sslCertificates: {
            type: string;
        };
        dnsRecords: {
            type: string;
        };
        riskScore: {
            type: string;
        };
        totalExposure: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Exposed Endpoints
 */
export declare const ExposedEndpointModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        endpointId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        url: {
            type: string;
            allowNull: boolean;
        };
        method: {
            type: string;
            values: string[];
        };
        requiresAuth: {
            type: string;
            defaultValue: boolean;
        };
        authType: {
            type: string;
            values: string[];
        };
        isPublic: {
            type: string;
            defaultValue: boolean;
        };
        hasRateLimit: {
            type: string;
            defaultValue: boolean;
        };
        sensitiveDataExposed: {
            type: string;
            defaultValue: boolean;
        };
        riskScore: {
            type: string;
        };
        lastTested: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Service Discovery
 */
export declare const ServiceDiscoveryModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        serviceId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        serviceName: {
            type: string;
            allowNull: boolean;
        };
        port: {
            type: string;
        };
        protocol: {
            type: string;
            values: string[];
        };
        version: {
            type: string;
        };
        banner: {
            type: string;
        };
        vulnerabilities: {
            type: string;
        };
        riskLevel: {
            type: string;
            values: string[];
        };
        authentication: {
            type: string;
            values: string[];
        };
        lastScanned: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Shadow IT
 */
export declare const ShadowITModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        assetId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        assetName: {
            type: string;
            allowNull: boolean;
        };
        assetType: {
            type: string;
            values: string[];
        };
        discoveryDate: {
            type: string;
        };
        users: {
            type: string;
        };
        department: {
            type: string;
        };
        dataSensitivity: {
            type: string;
            values: string[];
        };
        complianceRisk: {
            type: string;
            values: string[];
        };
        isApproved: {
            type: string;
            defaultValue: boolean;
        };
        recommendations: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Cloud Assets
 */
export declare const CloudAssetModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        assetId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        provider: {
            type: string;
            values: string[];
        };
        resourceType: {
            type: string;
        };
        region: {
            type: string;
        };
        isPubliclyAccessible: {
            type: string;
            defaultValue: boolean;
        };
        hasEncryption: {
            type: string;
            defaultValue: boolean;
        };
        hasLogging: {
            type: string;
            defaultValue: boolean;
        };
        misconfigurations: {
            type: string;
        };
        securityScore: {
            type: string;
        };
        cost: {
            type: string;
        };
        tags: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
declare const _default: {
    generateAssetInventory: typeof generateAssetInventory;
    discoverNetworkAssets: typeof discoverNetworkAssets;
    scanDomainAssets: typeof scanDomainAssets;
    identifyCloudResources: typeof identifyCloudResources;
    catalogAPIEndpoints: typeof catalogAPIEndpoints;
    inventoryWebApplications: typeof inventoryWebApplications;
    trackAssetChanges: typeof trackAssetChanges;
    exportAssetInventory: typeof exportAssetInventory;
    mapExternalAttackSurface: typeof mapExternalAttackSurface;
    identifyExposedServices: typeof identifyExposedServices;
    discoverPublicIPs: typeof discoverPublicIPs;
    enumerateSubdomains: typeof enumerateSubdomains;
    detectOpenPorts: typeof detectOpenPorts;
    scanSSLCertificates: typeof scanSSLCertificates;
    analyzeExternalDNS: typeof analyzeExternalDNS;
    visualizeAttackSurface: typeof visualizeAttackSurface;
    scanPortRange: typeof scanPortRange;
    identifyActiveServices: typeof identifyActiveServices;
    detectServiceVersions: typeof detectServiceVersions;
    analyzeServiceVulnerabilities: typeof analyzeServiceVulnerabilities;
    checkDefaultCredentials: typeof checkDefaultCredentials;
    assessServiceSecurity: typeof assessServiceSecurity;
    exportScanResults: typeof exportScanResults;
    detectExposedEndpoints: typeof detectExposedEndpoints;
    scanAPIExposure: typeof scanAPIExposure;
    identifyUnauthenticatedEndpoints: typeof identifyUnauthenticatedEndpoints;
    checkEndpointSecurity: typeof checkEndpointSecurity;
    analyzeEndpointRisk: typeof analyzeEndpointRisk;
    monitorEndpointChanges: typeof monitorEndpointChanges;
    generateEndpointReport: typeof generateEndpointReport;
    detectShadowIT: typeof detectShadowIT;
    scanUnauthorizedServices: typeof scanUnauthorizedServices;
    identifyRogueDevices: typeof identifyRogueDevices;
    trackUnapprovedCloud: typeof trackUnapprovedCloud;
    assessShadowITRisk: typeof assessShadowITRisk;
    reportShadowITFindings: typeof reportShadowITFindings;
    monitorCloudAssets: typeof monitorCloudAssets;
    scanCloudMisconfigurations: typeof scanCloudMisconfigurations;
    trackCloudExposure: typeof trackCloudExposure;
    assessCloudSecurity: typeof assessCloudSecurity;
    alertCloudRisks: typeof alertCloudRisks;
    enumerateAttackVectors: typeof enumerateAttackVectors;
    prioritizeVectors: typeof prioritizeVectors;
    assessVectorLikelihood: typeof assessVectorLikelihood;
    mapVectorToAsset: typeof mapVectorToAsset;
    generateVectorReport: typeof generateVectorReport;
    AssetInventoryModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            assetId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            assetType: {
                type: string;
                values: string[];
            };
            hostname: {
                type: string;
            };
            ipAddress: {
                type: string;
            };
            macAddress: {
                type: string;
            };
            owner: {
                type: string;
            };
            department: {
                type: string;
            };
            location: {
                type: string;
            };
            operatingSystem: {
                type: string;
            };
            criticality: {
                type: string;
                values: string[];
            };
            discoveryMethod: {
                type: string;
                values: string[];
            };
            firstDiscovered: {
                type: string;
            };
            lastSeen: {
                type: string;
            };
            status: {
                type: string;
                values: string[];
            };
            metadata: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    AttackSurfaceModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            surfaceId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            organizationId: {
                type: string;
                allowNull: boolean;
            };
            scanDate: {
                type: string;
            };
            externalAssets: {
                type: string;
            };
            exposedServices: {
                type: string;
            };
            openPorts: {
                type: string;
            };
            subdomains: {
                type: string;
            };
            sslCertificates: {
                type: string;
            };
            dnsRecords: {
                type: string;
            };
            riskScore: {
                type: string;
            };
            totalExposure: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    ExposedEndpointModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            endpointId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            url: {
                type: string;
                allowNull: boolean;
            };
            method: {
                type: string;
                values: string[];
            };
            requiresAuth: {
                type: string;
                defaultValue: boolean;
            };
            authType: {
                type: string;
                values: string[];
            };
            isPublic: {
                type: string;
                defaultValue: boolean;
            };
            hasRateLimit: {
                type: string;
                defaultValue: boolean;
            };
            sensitiveDataExposed: {
                type: string;
                defaultValue: boolean;
            };
            riskScore: {
                type: string;
            };
            lastTested: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    ServiceDiscoveryModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            serviceId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            serviceName: {
                type: string;
                allowNull: boolean;
            };
            port: {
                type: string;
            };
            protocol: {
                type: string;
                values: string[];
            };
            version: {
                type: string;
            };
            banner: {
                type: string;
            };
            vulnerabilities: {
                type: string;
            };
            riskLevel: {
                type: string;
                values: string[];
            };
            authentication: {
                type: string;
                values: string[];
            };
            lastScanned: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    ShadowITModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            assetId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            assetName: {
                type: string;
                allowNull: boolean;
            };
            assetType: {
                type: string;
                values: string[];
            };
            discoveryDate: {
                type: string;
            };
            users: {
                type: string;
            };
            department: {
                type: string;
            };
            dataSensitivity: {
                type: string;
                values: string[];
            };
            complianceRisk: {
                type: string;
                values: string[];
            };
            isApproved: {
                type: string;
                defaultValue: boolean;
            };
            recommendations: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    CloudAssetModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            assetId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            provider: {
                type: string;
                values: string[];
            };
            resourceType: {
                type: string;
            };
            region: {
                type: string;
            };
            isPubliclyAccessible: {
                type: string;
                defaultValue: boolean;
            };
            hasEncryption: {
                type: string;
                defaultValue: boolean;
            };
            hasLogging: {
                type: string;
                defaultValue: boolean;
            };
            misconfigurations: {
                type: string;
            };
            securityScore: {
                type: string;
            };
            cost: {
                type: string;
            };
            tags: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
};
export default _default;
//# sourceMappingURL=attack-surface-management-kit.d.ts.map