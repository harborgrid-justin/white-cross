/**
 * LOC: ZDIN1234567
 * File: /reuse/threat/zero-day-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Vulnerability management systems
 *   - Emergency response controllers
 */
/**
 * File: /reuse/threat/zero-day-intelligence-kit.ts
 * Locator: WC-THR-ZDIN-001
 * Purpose: Comprehensive Zero-Day Intelligence & Tracking - Discovery, exploit prediction, emergency response
 *
 * Upstream: Independent utility module for zero-day vulnerability intelligence and tracking
 * Downstream: ../backend/*, vulnerability controllers, emergency response services, patch management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 45 utility functions for zero-day discovery, exploit prediction, vulnerability lifecycle, emergency response
 *
 * LLM Context: Comprehensive zero-day vulnerability intelligence utilities for implementing advanced threat management.
 * Provides zero-day discovery tracking, exploit intelligence gathering, vulnerability prioritization, patch monitoring,
 * exploit prediction models, threat actor tracking, lifecycle management, and emergency response workflows.
 * Essential for building proactive, intelligence-driven healthcare security platforms with HIPAA compliance.
 */
interface ZeroDayVulnerability {
    id: string;
    internalId: string;
    cveId?: string;
    discoveryDate: Date;
    discoveryMethod: 'internal' | 'external-researcher' | 'threat-actor' | 'vendor' | 'exploit-in-wild';
    discoveredBy: string;
    vendorNotificationDate?: Date;
    publicDisclosureDate?: Date;
    cveAssignmentDate?: Date;
    status: 'discovered' | 'vendor-notified' | 'patch-development' | 'patch-available' | 'disclosed' | 'exploited';
    affectedProducts: Array<{
        vendor: string;
        product: string;
        versions: string[];
        cpe?: string;
    }>;
    severity: 'critical' | 'high' | 'medium' | 'low';
    cvssScore?: number;
    cvssVector?: string;
    exploitationStatus: 'theoretical' | 'poc-available' | 'in-the-wild' | 'mass-exploitation';
    exploitComplexity: 'low' | 'medium' | 'high';
    attackVector: 'network' | 'adjacent' | 'local' | 'physical';
    privilegesRequired: 'none' | 'low' | 'high';
    userInteraction: 'none' | 'required';
    impactType: Array<'confidentiality' | 'integrity' | 'availability'>;
    description: string;
    technicalDetails?: string;
    proofOfConcept?: string;
    mitigations: string[];
    workarounds: string[];
    metadata?: Record<string, unknown>;
}
interface ExploitIntelligence {
    id: string;
    zeroDayId: string;
    cveId?: string;
    exploitType: 'remote' | 'local' | 'client-side' | 'web-based';
    exploitTechnique: string[];
    exploitReliability: 'high' | 'medium' | 'low';
    exploitAvailability: 'public' | 'private' | 'commercial' | 'apt-only';
    exploitSources: Array<{
        source: string;
        url?: string;
        discoveryDate: Date;
        verified: boolean;
    }>;
    exploitCode?: string;
    exploitHash?: string;
    weaponized: boolean;
    exploitKits: string[];
    observedInWild: boolean;
    firstObservedDate?: Date;
    lastObservedDate?: Date;
    targetedSectors: string[];
    targetedRegions: string[];
    associatedThreatActors: string[];
    associatedCampaigns: string[];
    iocs: {
        ipAddresses: string[];
        domains: string[];
        fileHashes: string[];
        urls: string[];
    };
}
interface VulnerabilityPriority {
    zeroDayId: string;
    cveId?: string;
    priorityScore: number;
    priorityLevel: 'critical' | 'high' | 'medium' | 'low';
    factors: {
        severity: number;
        exploitability: number;
        assetExposure: number;
        businessImpact: number;
        threatIntelligence: number;
    };
    affectedAssets: number;
    criticalAssets: number;
    estimatedRisk: number;
    remediationDeadline: Date;
    justification: string;
    calculatedAt: Date;
}
interface PatchAvailability {
    zeroDayId: string;
    cveId?: string;
    vendor: string;
    product: string;
    patchStatus: 'none' | 'beta' | 'stable' | 'emergency' | 'workaround-only';
    patchAvailableDate?: Date;
    patchVersion?: string;
    patchUrl?: string;
    patchNotes?: string;
    installationComplexity: 'low' | 'medium' | 'high';
    requiresReboot: boolean;
    requiresDowntime: boolean;
    estimatedDowntime?: number;
    compatibility: {
        tested: boolean;
        issues: string[];
        compatibleVersions: string[];
    };
    deploymentPriority: 'immediate' | 'urgent' | 'scheduled' | 'optional';
    deploymentStatus: 'planned' | 'testing' | 'deploying' | 'deployed' | 'failed';
    deploymentProgress?: number;
}
interface ExploitPredictionModel {
    zeroDayId: string;
    cveId?: string;
    predictionDate: Date;
    exploitProbability: number;
    timeToExploit: number;
    confidence: number;
    features: {
        cvssScore: number;
        attackComplexity: number;
        publicDisclosure: boolean;
        patchAvailable: boolean;
        productPopularity: number;
        historicalExploitRate: number;
        darkWebChatter: number;
        securityResearchInterest: number;
    };
    riskFactors: Array<{
        factor: string;
        weight: number;
        contribution: number;
    }>;
    mitigatingFactors: Array<{
        factor: string;
        weight: number;
    }>;
    predictedExploitDate?: Date;
    actualExploitDate?: Date;
    predictionAccuracy?: number;
}
interface ZeroDayThreatActor {
    id: string;
    name: string;
    aliases: string[];
    type: 'nation-state' | 'criminal' | 'hacktivist' | 'researcher' | 'unknown';
    sophistication: 'low' | 'medium' | 'high' | 'advanced';
    zeroDaysDiscovered: string[];
    zeroDaysExploited: string[];
    preferredTargets: string[];
    preferredVectors: string[];
    attribution: {
        confidence: number;
        evidence: string[];
    };
    firstSeen: Date;
    lastSeen: Date;
    active: boolean;
}
interface VulnerabilityLifecycle {
    zeroDayId: string;
    cveId?: string;
    phases: Array<{
        phase: 'discovery' | 'vendor-notification' | 'analysis' | 'patch-development' | 'disclosure' | 'exploitation' | 'mass-exploitation' | 'patched' | 'remediated';
        startDate: Date;
        endDate?: Date;
        duration?: number;
        activities: string[];
        responsible?: string;
    }>;
    currentPhase: string;
    totalDuration?: number;
    vendorResponseTime?: number;
    disclosureTimeline: 'responsible' | 'coordinated' | 'full' | 'zero-day';
    milestones: Array<{
        milestone: string;
        date: Date;
        description: string;
    }>;
}
interface EmergencyResponse {
    id: string;
    zeroDayId: string;
    cveId?: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    initiatedAt: Date;
    initiatedBy: string;
    status: 'active' | 'monitoring' | 'contained' | 'resolved' | 'escalated';
    responseTeam: string[];
    actions: Array<{
        action: string;
        priority: 'immediate' | 'urgent' | 'high' | 'normal';
        status: 'pending' | 'in-progress' | 'completed' | 'blocked';
        assignedTo?: string;
        completedAt?: Date;
        notes?: string;
    }>;
    affectedSystems: string[];
    isolatedSystems: string[];
    containmentMeasures: string[];
    communicationLog: Array<{
        timestamp: Date;
        from: string;
        to: string[];
        message: string;
        channel: string;
    }>;
    estimatedImpact: {
        affectedUsers: number;
        affectedSystems: number;
        dataAtRisk: string;
        businessImpact: string;
    };
    resolutionDate?: Date;
    lessonsLearned?: string[];
}
interface ZeroDayIntelligenceReport {
    id: string;
    reportDate: Date;
    reportType: 'discovery' | 'alert' | 'analysis' | 'retrospective';
    zeroDayId: string;
    cveId?: string;
    title: string;
    executiveSummary: string;
    threatLevel: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    findings: Array<{
        category: string;
        finding: string;
        evidence: string[];
        impact: string;
    }>;
    technicalAnalysis: {
        vulnerability: string;
        exploitability: string;
        affectedComponents: string[];
        attackScenarios: string[];
    };
    threatIntelligence: {
        observedExploitation: boolean;
        threatActors: string[];
        campaigns: string[];
        indicators: string[];
    };
    recommendations: Array<{
        priority: 'immediate' | 'high' | 'medium' | 'low';
        recommendation: string;
        rationale: string;
        effort: 'low' | 'medium' | 'high';
        timeline: string;
    }>;
    mitigations: Array<{
        mitigation: string;
        effectiveness: 'high' | 'medium' | 'low';
        complexity: 'low' | 'medium' | 'high';
        implemented: boolean;
    }>;
    references: string[];
    classification: 'public' | 'tlp-white' | 'tlp-green' | 'tlp-amber' | 'tlp-red';
    distribution: string[];
}
/**
 * Registers a newly discovered zero-day vulnerability.
 *
 * @param {Partial<ZeroDayVulnerability>} vulnData - Vulnerability data
 * @returns {ZeroDayVulnerability} Registered zero-day
 *
 * @example
 * ```typescript
 * const zeroDay = registerZeroDayDiscovery({
 *   discoveryMethod: 'internal',
 *   discoveredBy: 'security-team',
 *   affectedProducts: [{ vendor: 'Microsoft', product: 'Exchange', versions: ['2019', '2016'] }],
 *   severity: 'critical',
 *   exploitationStatus: 'in-the-wild'
 * });
 * ```
 */
export declare const registerZeroDayDiscovery: (vulnData: Partial<ZeroDayVulnerability>) => ZeroDayVulnerability;
/**
 * Updates zero-day status as it progresses through lifecycle.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to update
 * @param {object} update - Update data
 * @returns {ZeroDayVulnerability} Updated zero-day
 *
 * @example
 * ```typescript
 * const updated = updateZeroDayStatus(zeroDay, {
 *   status: 'patch-available',
 *   cveId: 'CVE-2024-12345',
 *   cveAssignmentDate: new Date()
 * });
 * ```
 */
export declare const updateZeroDayStatus: (zeroDay: ZeroDayVulnerability, update: {
    status?: ZeroDayVulnerability["status"];
    cveId?: string;
    cveAssignmentDate?: Date;
    vendorNotificationDate?: Date;
    publicDisclosureDate?: Date;
    exploitationStatus?: ZeroDayVulnerability["exploitationStatus"];
}) => ZeroDayVulnerability;
/**
 * Validates zero-day vulnerability data completeness.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateZeroDayData(zeroDay);
 * // Result: { valid: true, warnings: [], errors: [] }
 * ```
 */
export declare const validateZeroDayData: (zeroDay: ZeroDayVulnerability) => {
    valid: boolean;
    warnings: string[];
    errors: string[];
};
/**
 * Identifies duplicate or related zero-day vulnerabilities.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to check
 * @param {ZeroDayVulnerability[]} existing - Existing zero-days
 * @returns {object} Duplicate detection result
 *
 * @example
 * ```typescript
 * const duplicates = identifyDuplicateZeroDays(newZeroDay, existingZeroDays);
 * // Result: { isDuplicate: false, similar: [...], confidence: 0.85 }
 * ```
 */
export declare const identifyDuplicateZeroDays: (zeroDay: ZeroDayVulnerability, existing: ZeroDayVulnerability[]) => {
    isDuplicate: boolean;
    similar: ZeroDayVulnerability[];
    confidence: number;
};
/**
 * Calculates time-to-disclosure for zero-day.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @returns {object} Disclosure timeline analysis
 *
 * @example
 * ```typescript
 * const timeline = calculateDisclosureTimeline(zeroDay);
 * // Result: { daysToVendor: 7, daysToPublic: 45, disclosureType: 'coordinated' }
 * ```
 */
export declare const calculateDisclosureTimeline: (zeroDay: ZeroDayVulnerability) => {
    daysToVendor?: number;
    daysToPublic?: number;
    daysToExploit?: number;
    disclosureType: "responsible" | "coordinated" | "full" | "zero-day";
    isResponsible: boolean;
};
/**
 * Tracks exploit intelligence for zero-day.
 *
 * @param {Partial<ExploitIntelligence>} exploitData - Exploit intelligence data
 * @returns {ExploitIntelligence} Tracked exploit intelligence
 *
 * @example
 * ```typescript
 * const exploit = trackExploitIntelligence({
 *   zeroDayId: 'zd-123',
 *   exploitType: 'remote',
 *   exploitReliability: 'high',
 *   exploitAvailability: 'public'
 * });
 * ```
 */
export declare const trackExploitIntelligence: (exploitData: Partial<ExploitIntelligence>) => ExploitIntelligence;
/**
 * Analyzes exploit sophistication and weaponization.
 *
 * @param {ExploitIntelligence} exploit - Exploit to analyze
 * @returns {object} Sophistication analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeExploitSophistication(exploit);
 * // Result: { sophistication: 'high', weaponizationPotential: 0.85, factors: [...] }
 * ```
 */
export declare const analyzeExploitSophistication: (exploit: ExploitIntelligence) => {
    sophistication: "low" | "medium" | "high" | "advanced";
    weaponizationPotential: number;
    factors: string[];
};
/**
 * Correlates exploit with threat actor activity.
 *
 * @param {ExploitIntelligence} exploit - Exploit intelligence
 * @param {ZeroDayThreatActor[]} threatActors - Known threat actors
 * @returns {object} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = correlateExploitWithActors(exploit, threatActors);
 * ```
 */
export declare const correlateExploitWithActors: (exploit: ExploitIntelligence, threatActors: ZeroDayThreatActor[]) => {
    likelyActors: ZeroDayThreatActor[];
    confidence: number;
};
/**
 * Monitors exploit code availability across sources.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {string[]} sources - Sources to monitor
 * @returns {Promise<object>} Monitoring results
 *
 * @example
 * ```typescript
 * const results = await monitorExploitAvailability('zd-123', ['github', 'exploit-db']);
 * ```
 */
export declare const monitorExploitAvailability: (zeroDayId: string, sources: string[]) => Promise<{
    found: boolean;
    sources: Array<{
        source: string;
        found: boolean;
        url?: string;
    }>;
}>;
/**
 * Calculates vulnerability priority score.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {object} context - Organizational context
 * @returns {VulnerabilityPriority} Priority assessment
 *
 * @example
 * ```typescript
 * const priority = calculateVulnerabilityPriority(zeroDay, {
 *   affectedAssets: 150,
 *   criticalAssets: 25,
 *   businessImpact: 'high'
 * });
 * ```
 */
export declare const calculateVulnerabilityPriority: (zeroDay: ZeroDayVulnerability, context: {
    affectedAssets: number;
    criticalAssets: number;
    businessImpact: "low" | "medium" | "high" | "critical";
}) => VulnerabilityPriority;
/**
 * Ranks multiple vulnerabilities by priority.
 *
 * @param {VulnerabilityPriority[]} priorities - Vulnerability priorities
 * @returns {VulnerabilityPriority[]} Ranked priorities
 *
 * @example
 * ```typescript
 * const ranked = rankVulnerabilitiesByPriority(priorities);
 * ```
 */
export declare const rankVulnerabilitiesByPriority: (priorities: VulnerabilityPriority[]) => VulnerabilityPriority[];
/**
 * Generates remediation strategy based on priority.
 *
 * @param {VulnerabilityPriority} priority - Vulnerability priority
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @returns {object} Remediation strategy
 *
 * @example
 * ```typescript
 * const strategy = generateRemediationStrategy(priority, zeroDay);
 * ```
 */
export declare const generateRemediationStrategy: (priority: VulnerabilityPriority, zeroDay: ZeroDayVulnerability) => {
    approach: string;
    steps: string[];
    timeline: string;
    resources: string[];
};
/**
 * Tracks patch availability for zero-day.
 *
 * @param {Partial<PatchAvailability>} patchData - Patch data
 * @returns {PatchAvailability} Patch availability record
 *
 * @example
 * ```typescript
 * const patch = trackPatchAvailability({
 *   zeroDayId: 'zd-123',
 *   vendor: 'Microsoft',
 *   product: 'Exchange',
 *   patchStatus: 'stable'
 * });
 * ```
 */
export declare const trackPatchAvailability: (patchData: Partial<PatchAvailability>) => PatchAvailability;
/**
 * Monitors vendor patch release timeline.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {Date} notificationDate - Vendor notification date
 * @returns {object} Timeline analysis
 *
 * @example
 * ```typescript
 * const timeline = monitorVendorPatchTimeline('zd-123', notificationDate);
 * // Result: { daysElapsed: 45, expectedPatch: Date, status: 'delayed' }
 * ```
 */
export declare const monitorVendorPatchTimeline: (zeroDayId: string, notificationDate: Date) => {
    daysElapsed: number;
    expectedPatchDate: Date;
    status: "on-track" | "delayed" | "overdue";
};
/**
 * Validates patch compatibility with environment.
 *
 * @param {PatchAvailability} patch - Patch to validate
 * @param {object} environment - Environment configuration
 * @returns {object} Compatibility assessment
 *
 * @example
 * ```typescript
 * const compat = validatePatchCompatibility(patch, { version: '2019', platform: 'windows' });
 * ```
 */
export declare const validatePatchCompatibility: (patch: PatchAvailability, environment: {
    version: string;
    platform: string;
    customizations?: string[];
}) => {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * Tracks patch deployment progress.
 *
 * @param {PatchAvailability} patch - Patch record
 * @param {number} progress - Deployment progress (0-100)
 * @returns {PatchAvailability} Updated patch record
 *
 * @example
 * ```typescript
 * const updated = updatePatchDeploymentProgress(patch, 75);
 * ```
 */
export declare const updatePatchDeploymentProgress: (patch: PatchAvailability, progress: number) => PatchAvailability;
/**
 * Predicts exploit likelihood using ML-like features.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to predict
 * @param {Partial<ExploitPredictionModel['features']>} features - Feature set
 * @returns {ExploitPredictionModel} Prediction model
 *
 * @example
 * ```typescript
 * const prediction = predictExploitLikelihood(zeroDay, {
 *   cvssScore: 9.8,
 *   publicDisclosure: false,
 *   patchAvailable: false,
 *   productPopularity: 0.95
 * });
 * ```
 */
export declare const predictExploitLikelihood: (zeroDay: ZeroDayVulnerability, features: Partial<ExploitPredictionModel["features"]>) => ExploitPredictionModel;
/**
 * Updates prediction with actual exploitation data.
 *
 * @param {ExploitPredictionModel} prediction - Original prediction
 * @param {Date} actualExploitDate - Actual exploitation date
 * @returns {ExploitPredictionModel} Updated prediction with accuracy
 *
 * @example
 * ```typescript
 * const updated = updatePredictionAccuracy(prediction, new Date());
 * // Result includes predictionAccuracy field
 * ```
 */
export declare const updatePredictionAccuracy: (prediction: ExploitPredictionModel, actualExploitDate: Date) => ExploitPredictionModel;
/**
 * Trains prediction model with historical data.
 *
 * @param {ExploitPredictionModel[]} historicalPredictions - Historical predictions
 * @returns {object} Model performance metrics
 *
 * @example
 * ```typescript
 * const metrics = trainPredictionModel(historicalPredictions);
 * // Result: { accuracy: 0.82, precision: 0.85, recall: 0.78 }
 * ```
 */
export declare const trainPredictionModel: (historicalPredictions: ExploitPredictionModel[]) => {
    accuracy: number;
    precision: number;
    recall: number;
    sampleSize: number;
};
/**
 * Profiles threat actor specializing in zero-days.
 *
 * @param {Partial<ZeroDayThreatActor>} actorData - Threat actor data
 * @returns {ZeroDayThreatActor} Threat actor profile
 *
 * @example
 * ```typescript
 * const actor = profileZeroDayThreatActor({
 *   name: 'Equation Group',
 *   type: 'nation-state',
 *   sophistication: 'advanced',
 *   zeroDaysExploited: ['zd-123', 'zd-456']
 * });
 * ```
 */
export declare const profileZeroDayThreatActor: (actorData: Partial<ZeroDayThreatActor>) => ZeroDayThreatActor;
/**
 * Links zero-day to threat actor based on TTPs.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {ZeroDayThreatActor[]} actors - Known actors
 * @returns {object} Attribution analysis
 *
 * @example
 * ```typescript
 * const attribution = attributeZeroDayToActor(zeroDay, knownActors);
 * ```
 */
export declare const attributeZeroDayToActor: (zeroDay: ZeroDayVulnerability, actors: ZeroDayThreatActor[]) => {
    likelyActors: ZeroDayThreatActor[];
    confidence: number;
    evidence: string[];
};
/**
 * Analyzes actor's zero-day exploitation patterns.
 *
 * @param {ZeroDayThreatActor} actor - Threat actor
 * @param {ZeroDayVulnerability[]} zeroDays - Zero-day vulnerabilities
 * @returns {object} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = analyzeActorZeroDayPatterns(actor, zeroDays);
 * ```
 */
export declare const analyzeActorZeroDayPatterns: (actor: ZeroDayThreatActor, zeroDays: ZeroDayVulnerability[]) => {
    patterns: string[];
    targetPreferences: string[];
    vectorPreferences: string[];
    timeline: any[];
};
/**
 * Tracks zero-day through its lifecycle phases.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {ZeroDayVulnerability} zeroDay - Zero-day data
 * @returns {VulnerabilityLifecycle} Lifecycle tracker
 *
 * @example
 * ```typescript
 * const lifecycle = trackVulnerabilityLifecycle('zd-123', zeroDay);
 * ```
 */
export declare const trackVulnerabilityLifecycle: (zeroDayId: string, zeroDay: ZeroDayVulnerability) => VulnerabilityLifecycle;
/**
 * Calculates lifecycle metrics (time-to-patch, etc.).
 *
 * @param {VulnerabilityLifecycle} lifecycle - Lifecycle data
 * @returns {object} Lifecycle metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateLifecycleMetrics(lifecycle);
 * ```
 */
export declare const calculateLifecycleMetrics: (lifecycle: VulnerabilityLifecycle) => {
    vendorResponseTime?: number;
    timeToPatch?: number;
    totalDuration?: number;
    phaseBreakdown: Record<string, number>;
};
/**
 * Initiates emergency response for zero-day.
 *
 * @param {Partial<EmergencyResponse>} responseData - Response data
 * @returns {EmergencyResponse} Emergency response record
 *
 * @example
 * ```typescript
 * const response = initiateEmergencyResponse({
 *   zeroDayId: 'zd-123',
 *   severity: 'critical',
 *   initiatedBy: 'security-team',
 *   affectedSystems: ['prod-server-01', 'prod-server-02']
 * });
 * ```
 */
export declare const initiateEmergencyResponse: (responseData: Partial<EmergencyResponse>) => EmergencyResponse;
/**
 * Updates emergency response status and actions.
 *
 * @param {EmergencyResponse} response - Emergency response
 * @param {object} update - Update data
 * @returns {EmergencyResponse} Updated response
 *
 * @example
 * ```typescript
 * const updated = updateEmergencyResponse(response, {
 *   status: 'contained',
 *   completedActions: ['Isolate critical systems'],
 *   newMeasures: ['Applied WAF rules']
 * });
 * ```
 */
export declare const updateEmergencyResponse: (response: EmergencyResponse, update: {
    status?: EmergencyResponse["status"];
    completedActions?: string[];
    newMeasures?: string[];
    isolatedSystems?: string[];
}) => EmergencyResponse;
/**
 * Generates emergency response report.
 *
 * @param {EmergencyResponse} response - Emergency response
 * @returns {string} Response report
 *
 * @example
 * ```typescript
 * const report = generateEmergencyResponseReport(response);
 * ```
 */
export declare const generateEmergencyResponseReport: (response: EmergencyResponse) => string;
/**
 * Generates comprehensive zero-day intelligence report.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {ExploitIntelligence} [exploit] - Exploit intelligence
 * @returns {ZeroDayIntelligenceReport} Intelligence report
 *
 * @example
 * ```typescript
 * const report = generateZeroDayIntelligenceReport(zeroDay, exploit);
 * ```
 */
export declare const generateZeroDayIntelligenceReport: (zeroDay: ZeroDayVulnerability, exploit?: ExploitIntelligence) => ZeroDayIntelligenceReport;
/**
 * Sequelize model definition for ZeroDayVulnerability.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'zero_day_vulnerabilities', timestamps: true, paranoid: true })
 * export class ZeroDayVulnerabilityModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false, unique: true })
 *   @Index
 *   internalId: string;
 *
 *   @Column({ type: DataType.STRING, unique: true })
 *   @Index
 *   cveId: string;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   discoveryDate: Date;
 *
 *   @Column({
 *     type: DataType.ENUM('internal', 'external-researcher', 'threat-actor', 'vendor', 'exploit-in-wild'),
 *     allowNull: false
 *   })
 *   discoveryMethod: string;
 *
 *   @Column(DataType.STRING)
 *   discoveredBy: string;
 *
 *   @Column(DataType.DATE)
 *   vendorNotificationDate: Date;
 *
 *   @Column(DataType.DATE)
 *   publicDisclosureDate: Date;
 *
 *   @Column(DataType.DATE)
 *   cveAssignmentDate: Date;
 *
 *   @Column({
 *     type: DataType.ENUM('discovered', 'vendor-notified', 'patch-development', 'patch-available', 'disclosed', 'exploited'),
 *     defaultValue: 'discovered'
 *   })
 *   status: string;
 *
 *   @Column({ type: DataType.JSONB, allowNull: false })
 *   affectedProducts: any[];
 *
 *   @Column({
 *     type: DataType.ENUM('critical', 'high', 'medium', 'low'),
 *     defaultValue: 'high'
 *   })
 *   severity: string;
 *
 *   @Column({ type: DataType.DECIMAL(3, 1), validate: { min: 0, max: 10 } })
 *   cvssScore: number;
 *
 *   @Column(DataType.STRING)
 *   cvssVector: string;
 *
 *   @Column({
 *     type: DataType.ENUM('theoretical', 'poc-available', 'in-the-wild', 'mass-exploitation'),
 *     defaultValue: 'theoretical'
 *   })
 *   exploitationStatus: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column(DataType.TEXT)
 *   technicalDetails: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   mitigations: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   workarounds: string[];
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => ExploitIntelligenceModel)
 *   exploitIntelligence: ExploitIntelligenceModel[];
 *
 *   @HasMany(() => PatchAvailabilityModel)
 *   patchAvailability: PatchAvailabilityModel[];
 *
 *   @HasOne(() => ExploitPredictionModel)
 *   exploitPrediction: ExploitPredictionModel;
 *
 *   @BeforeCreate
 *   static async generateInternalId(instance: ZeroDayVulnerabilityModel) {
 *     if (!instance.internalId) {
 *       instance.internalId = `INTERNAL-${Date.now()}`;
 *     }
 *   }
 *
 *   @AfterCreate
 *   static async logDiscovery(instance: ZeroDayVulnerabilityModel) {
 *     console.log(`Zero-day vulnerability discovered: ${instance.internalId}`);
 *     // Trigger emergency response workflow for critical vulnerabilities
 *     if (instance.severity === 'critical' && instance.exploitationStatus === 'in-the-wild') {
 *       // Initiate emergency response
 *     }
 *   }
 *
 *   @BeforeUpdate
 *   static async validateStatusTransition(instance: ZeroDayVulnerabilityModel) {
 *     // Validate status transitions follow proper workflow
 *     const validTransitions = {
 *       'discovered': ['vendor-notified', 'disclosed', 'exploited'],
 *       'vendor-notified': ['patch-development', 'disclosed', 'exploited'],
 *       'patch-development': ['patch-available', 'disclosed', 'exploited'],
 *       'patch-available': ['disclosed', 'exploited'],
 *     };
 *
 *     if (instance.changed('status')) {
 *       const oldStatus = instance.previous('status');
 *       const newStatus = instance.status;
 *       if (!validTransitions[oldStatus]?.includes(newStatus)) {
 *         throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
 *       }
 *     }
 *   }
 * }
 * ```
 */
export declare const defineZeroDayVulnerabilityModel: () => string;
/**
 * Sequelize associations for zero-day intelligence models.
 *
 * @example
 * ```typescript
 * // Zero-Day to Exploit Intelligence (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(ExploitIntelligenceModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitIntelligence'
 * });
 * ExploitIntelligenceModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Patch Availability (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(PatchAvailabilityModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'patchAvailability'
 * });
 * PatchAvailabilityModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Exploit Prediction (one-to-one)
 * ZeroDayVulnerabilityModel.hasOne(ExploitPredictionModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitPrediction'
 * });
 * ExploitPredictionModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Emergency Response (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(EmergencyResponseModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'emergencyResponses'
 * });
 * EmergencyResponseModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Threat Actors (many-to-many)
 * ZeroDayVulnerabilityModel.belongsToMany(ZeroDayThreatActorModel, {
 *   through: 'ZeroDayActorExploitation',
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitingActors'
 * });
 * ZeroDayThreatActorModel.belongsToMany(ZeroDayVulnerabilityModel, {
 *   through: 'ZeroDayActorExploitation',
 *   foreignKey: 'actorId',
 *   as: 'exploitedZeroDays'
 * });
 *
 * // Zero-Day to Intelligence Reports (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(ZeroDayIntelligenceReportModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'intelligenceReports'
 * });
 * ZeroDayIntelligenceReportModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 * ```
 */
export declare const defineZeroDayAssociations: () => string;
/**
 * NestJS service for zero-day intelligence management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ZeroDayIntelligenceService {
 *   constructor(
 *     @InjectModel(ZeroDayVulnerabilityModel) private zeroDayModel: typeof ZeroDayVulnerabilityModel,
 *     @InjectModel(ExploitIntelligenceModel) private exploitModel: typeof ExploitIntelligenceModel,
 *     @InjectModel(EmergencyResponseModel) private responseModel: typeof EmergencyResponseModel,
 *     private readonly logger: Logger
 *   ) {}
 *
 *   async registerZeroDay(dto: RegisterZeroDayDto): Promise<ZeroDayVulnerability> {
 *     const zeroDay = registerZeroDayDiscovery(dto);
 *     const validation = validateZeroDayData(zeroDay);
 *
 *     if (!validation.valid) {
 *       throw new BadRequestException(`Invalid zero-day data: ${validation.errors.join(', ')}`);
 *     }
 *
 *     const created = await this.zeroDayModel.create(zeroDay);
 *
 *     // Initiate emergency response for critical zero-days
 *     if (created.severity === 'critical' && created.exploitationStatus === 'in-the-wild') {
 *       await this.initiateEmergencyResponse(created.id);
 *     }
 *
 *     return created;
 *   }
 *
 *   async prioritizeZeroDay(zeroDayId: string, context: any): Promise<VulnerabilityPriority> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId);
 *     if (!zeroDay) {
 *       throw new NotFoundException(`Zero-day ${zeroDayId} not found`);
 *     }
 *
 *     return calculateVulnerabilityPriority(zeroDay, context);
 *   }
 *
 *   async predictExploit(zeroDayId: string): Promise<ExploitPredictionModel> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId);
 *     const features = await this.gatherPredictionFeatures(zeroDay);
 *     return predictExploitLikelihood(zeroDay, features);
 *   }
 *
 *   async trackPatchStatus(zeroDayId: string): Promise<PatchAvailability[]> {
 *     return this.patchModel.findAll({ where: { zeroDayId } });
 *   }
 *
 *   async generateIntelligenceReport(zeroDayId: string): Promise<ZeroDayIntelligenceReport> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId, {
 *       include: ['exploitIntelligence', 'patchAvailability']
 *     });
 *
 *     const exploit = zeroDay.exploitIntelligence?.[0];
 *     return generateZeroDayIntelligenceReport(zeroDay, exploit);
 *   }
 * }
 * ```
 */
export declare const createZeroDayIntelligenceService: () => string;
/**
 * Swagger API endpoint definitions for zero-day intelligence.
 *
 * @example
 * ```typescript
 * @ApiTags('Zero-Day Intelligence')
 * @Controller('zero-day')
 * export class ZeroDayController {
 *   @Post('register')
 *   @ApiOperation({ summary: 'Register new zero-day vulnerability' })
 *   @ApiBody({ type: RegisterZeroDayDto })
 *   @ApiResponse({ status: 201, description: 'Zero-day registered', type: ZeroDayDto })
 *   async register(@Body() dto: RegisterZeroDayDto): Promise<ZeroDayDto> {
 *     return this.zeroDayService.registerZeroDay(dto);
 *   }
 *
 *   @Get(':id/priority')
 *   @ApiOperation({ summary: 'Calculate vulnerability priority' })
 *   @ApiParam({ name: 'id', description: 'Zero-Day ID' })
 *   @ApiResponse({ status: 200, type: VulnerabilityPriorityDto })
 *   async getPriority(@Param('id') id: string, @Query() context: PriorityContextDto): Promise<VulnerabilityPriorityDto> {
 *     return this.zeroDayService.prioritizeZeroDay(id, context);
 *   }
 *
 *   @Get(':id/predict-exploit')
 *   @ApiOperation({ summary: 'Predict exploit likelihood' })
 *   @ApiResponse({ status: 200, type: ExploitPredictionDto })
 *   async predictExploit(@Param('id') id: string): Promise<ExploitPredictionDto> {
 *     return this.zeroDayService.predictExploit(id);
 *   }
 *
 *   @Post(':id/emergency-response')
 *   @ApiOperation({ summary: 'Initiate emergency response' })
 *   @ApiResponse({ status: 201, type: EmergencyResponseDto })
 *   async initiateResponse(@Param('id') id: string): Promise<EmergencyResponseDto> {
 *     return this.zeroDayService.initiateEmergencyResponse(id);
 *   }
 *
 *   @Get(':id/intelligence-report')
 *   @ApiOperation({ summary: 'Generate intelligence report' })
 *   @ApiResponse({ status: 200, type: ZeroDayIntelligenceReportDto })
 *   async getReport(@Param('id') id: string): Promise<ZeroDayIntelligenceReportDto> {
 *     return this.zeroDayService.generateIntelligenceReport(id);
 *   }
 * }
 * ```
 */
export declare const defineZeroDayAPI: () => string;
declare const _default: {
    registerZeroDayDiscovery: (vulnData: Partial<ZeroDayVulnerability>) => ZeroDayVulnerability;
    updateZeroDayStatus: (zeroDay: ZeroDayVulnerability, update: {
        status?: ZeroDayVulnerability["status"];
        cveId?: string;
        cveAssignmentDate?: Date;
        vendorNotificationDate?: Date;
        publicDisclosureDate?: Date;
        exploitationStatus?: ZeroDayVulnerability["exploitationStatus"];
    }) => ZeroDayVulnerability;
    validateZeroDayData: (zeroDay: ZeroDayVulnerability) => {
        valid: boolean;
        warnings: string[];
        errors: string[];
    };
    identifyDuplicateZeroDays: (zeroDay: ZeroDayVulnerability, existing: ZeroDayVulnerability[]) => {
        isDuplicate: boolean;
        similar: ZeroDayVulnerability[];
        confidence: number;
    };
    calculateDisclosureTimeline: (zeroDay: ZeroDayVulnerability) => {
        daysToVendor?: number;
        daysToPublic?: number;
        daysToExploit?: number;
        disclosureType: "responsible" | "coordinated" | "full" | "zero-day";
        isResponsible: boolean;
    };
    trackExploitIntelligence: (exploitData: Partial<ExploitIntelligence>) => ExploitIntelligence;
    analyzeExploitSophistication: (exploit: ExploitIntelligence) => {
        sophistication: "low" | "medium" | "high" | "advanced";
        weaponizationPotential: number;
        factors: string[];
    };
    correlateExploitWithActors: (exploit: ExploitIntelligence, threatActors: ZeroDayThreatActor[]) => {
        likelyActors: ZeroDayThreatActor[];
        confidence: number;
    };
    monitorExploitAvailability: (zeroDayId: string, sources: string[]) => Promise<{
        found: boolean;
        sources: Array<{
            source: string;
            found: boolean;
            url?: string;
        }>;
    }>;
    calculateVulnerabilityPriority: (zeroDay: ZeroDayVulnerability, context: {
        affectedAssets: number;
        criticalAssets: number;
        businessImpact: "low" | "medium" | "high" | "critical";
    }) => VulnerabilityPriority;
    rankVulnerabilitiesByPriority: (priorities: VulnerabilityPriority[]) => VulnerabilityPriority[];
    generateRemediationStrategy: (priority: VulnerabilityPriority, zeroDay: ZeroDayVulnerability) => {
        approach: string;
        steps: string[];
        timeline: string;
        resources: string[];
    };
    trackPatchAvailability: (patchData: Partial<PatchAvailability>) => PatchAvailability;
    monitorVendorPatchTimeline: (zeroDayId: string, notificationDate: Date) => {
        daysElapsed: number;
        expectedPatchDate: Date;
        status: "on-track" | "delayed" | "overdue";
    };
    validatePatchCompatibility: (patch: PatchAvailability, environment: {
        version: string;
        platform: string;
        customizations?: string[];
    }) => {
        compatible: boolean;
        issues: string[];
        recommendations: string[];
    };
    updatePatchDeploymentProgress: (patch: PatchAvailability, progress: number) => PatchAvailability;
    predictExploitLikelihood: (zeroDay: ZeroDayVulnerability, features: Partial<ExploitPredictionModel["features"]>) => ExploitPredictionModel;
    updatePredictionAccuracy: (prediction: ExploitPredictionModel, actualExploitDate: Date) => ExploitPredictionModel;
    trainPredictionModel: (historicalPredictions: ExploitPredictionModel[]) => {
        accuracy: number;
        precision: number;
        recall: number;
        sampleSize: number;
    };
    profileZeroDayThreatActor: (actorData: Partial<ZeroDayThreatActor>) => ZeroDayThreatActor;
    attributeZeroDayToActor: (zeroDay: ZeroDayVulnerability, actors: ZeroDayThreatActor[]) => {
        likelyActors: ZeroDayThreatActor[];
        confidence: number;
        evidence: string[];
    };
    analyzeActorZeroDayPatterns: (actor: ZeroDayThreatActor, zeroDays: ZeroDayVulnerability[]) => {
        patterns: string[];
        targetPreferences: string[];
        vectorPreferences: string[];
        timeline: any[];
    };
    trackVulnerabilityLifecycle: (zeroDayId: string, zeroDay: ZeroDayVulnerability) => VulnerabilityLifecycle;
    calculateLifecycleMetrics: (lifecycle: VulnerabilityLifecycle) => {
        vendorResponseTime?: number;
        timeToPatch?: number;
        totalDuration?: number;
        phaseBreakdown: Record<string, number>;
    };
    initiateEmergencyResponse: (responseData: Partial<EmergencyResponse>) => EmergencyResponse;
    updateEmergencyResponse: (response: EmergencyResponse, update: {
        status?: EmergencyResponse["status"];
        completedActions?: string[];
        newMeasures?: string[];
        isolatedSystems?: string[];
    }) => EmergencyResponse;
    generateEmergencyResponseReport: (response: EmergencyResponse) => string;
    generateZeroDayIntelligenceReport: (zeroDay: ZeroDayVulnerability, exploit?: ExploitIntelligence) => ZeroDayIntelligenceReport;
    defineZeroDayVulnerabilityModel: () => string;
    defineZeroDayAssociations: () => string;
    createZeroDayIntelligenceService: () => string;
    defineZeroDayAPI: () => string;
};
export default _default;
//# sourceMappingURL=zero-day-intelligence-kit.d.ts.map