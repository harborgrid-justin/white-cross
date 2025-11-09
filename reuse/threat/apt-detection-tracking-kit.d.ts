/**
 * LOC: APTD1234567
 * File: /reuse/threat/apt-detection-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - APT detection engines
 *   - Security analytics platforms
 */
/**
 * File: /reuse/threat/apt-detection-tracking-kit.ts
 * Locator: WC-THR-APTD-001
 * Purpose: Comprehensive APT Detection & Tracking - Behavior analysis, campaign tracking, attribution, TTPs mapping
 *
 * Upstream: Independent utility module for Advanced Persistent Threat detection and tracking
 * Downstream: ../backend/*, threat intelligence controllers, APT analytics services, attribution engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 45 utility functions for APT detection, tracking, campaign identification, attribution, intelligence sharing
 *
 * LLM Context: Comprehensive APT detection and tracking utilities for implementing advanced threat intelligence systems.
 * Provides APT behavior pattern detection, long-term tracking, campaign identification, attribution to known groups,
 * TTPs mapping to MITRE ATT&CK, infrastructure tracking, dwell time analysis, and intelligence sharing capabilities.
 * Essential for building proactive, intelligence-driven healthcare security platforms with HIPAA compliance.
 */
interface APTGroup {
    id: string;
    name: string;
    aliases: string[];
    type: 'nation-state' | 'criminal' | 'hacktivist' | 'unknown';
    attribution: {
        country?: string;
        sponsor?: string;
        confidence: number;
    };
    firstSeen: Date;
    lastSeen: Date;
    active: boolean;
    sophistication: 'minimal' | 'low' | 'medium' | 'high' | 'advanced' | 'expert';
    targets: {
        sectors: string[];
        regions: string[];
        organizationTypes: string[];
    };
    motivation: Array<'espionage' | 'sabotage' | 'financial' | 'ideological' | 'unknown'>;
    metadata?: Record<string, unknown>;
}
interface APTCampaign {
    id: string;
    name: string;
    aptGroupId: string;
    startDate: Date;
    endDate?: Date;
    active: boolean;
    objectives: string[];
    targetedSectors: string[];
    targetedRegions: string[];
    affectedOrganizations: number;
    detectionConfidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    ttps: string[];
    iocs: {
        ipAddresses: string[];
        domains: string[];
        fileHashes: string[];
        emailAddresses: string[];
    };
    victimCount: number;
    estimatedDamage?: number;
    description?: string;
}
interface APTBehaviorPattern {
    id: string;
    aptGroupId: string;
    patternType: 'reconnaissance' | 'initial-access' | 'persistence' | 'lateral-movement' | 'data-exfiltration' | 'c2-communication';
    signature: string;
    description: string;
    mitreAttackIds: string[];
    frequency: 'rare' | 'occasional' | 'common' | 'frequent';
    observationCount: number;
    firstObserved: Date;
    lastObserved: Date;
    confidence: number;
    falsePositiveRate: number;
    detectionRules: string[];
}
interface APTInfrastructure {
    id: string;
    aptGroupId: string;
    type: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'nameserver';
    value: string;
    role: 'c2' | 'phishing' | 'malware-distribution' | 'data-exfiltration' | 'staging' | 'reconnaissance';
    active: boolean;
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    registrationDate?: Date;
    expirationDate?: Date;
    registrar?: string;
    associatedMalware?: string[];
    geolocation?: {
        country: string;
        city?: string;
        isp?: string;
    };
}
interface DwellTimeAnalysis {
    campaignId: string;
    organizationId: string;
    initialCompromise: Date;
    detectionDate: Date;
    dwellTimeDays: number;
    attackPhases: Array<{
        phase: string;
        startDate: Date;
        endDate?: Date;
        activities: string[];
    }>;
    dataExfiltrated: boolean;
    estimatedDataVolume?: number;
    lateralMovementExtent: 'none' | 'limited' | 'moderate' | 'extensive';
    persistenceMechanisms: string[];
    detectionMethod: string;
}
interface APTAttribution {
    campaignId: string;
    aptGroupId: string;
    confidence: number;
    attributionMethod: 'ttp-match' | 'infrastructure-overlap' | 'malware-similarity' | 'target-profile' | 'combined';
    evidence: Array<{
        type: 'ttp' | 'infrastructure' | 'malware' | 'targeting' | 'timing' | 'linguistic' | 'tooling';
        description: string;
        weight: number;
        source?: string;
    }>;
    analystNotes?: string;
    timestamp: Date;
    reviewStatus: 'preliminary' | 'reviewed' | 'confirmed' | 'disputed';
}
interface APTTTPMapping {
    aptGroupId: string;
    campaignId?: string;
    mitreAttackId: string;
    tactic: string;
    technique: string;
    subTechnique?: string;
    procedureDescription: string;
    toolsUsed: string[];
    observationCount: number;
    firstObserved: Date;
    lastObserved: Date;
    effectiveness: 'low' | 'medium' | 'high';
    detectionDifficulty: 'easy' | 'moderate' | 'hard' | 'very-hard';
    mitigations: string[];
}
interface APTIntelligenceReport {
    id: string;
    reportType: 'tactical' | 'operational' | 'strategic';
    aptGroupId?: string;
    campaignId?: string;
    title: string;
    summary: string;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    findings: Array<{
        category: string;
        description: string;
        evidence: string[];
        impact: string;
    }>;
    recommendations: Array<{
        priority: 'immediate' | 'high' | 'medium' | 'low';
        action: string;
        rationale: string;
        resources?: string[];
    }>;
    iocs: {
        ipAddresses: string[];
        domains: string[];
        fileHashes: string[];
        urls: string[];
    };
    targetAudience: string[];
    classification: 'public' | 'tlp-white' | 'tlp-green' | 'tlp-amber' | 'tlp-red';
    generatedDate: Date;
    expirationDate?: Date;
    author: string;
    references: string[];
}
interface APTDetectionAlert {
    id: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    aptGroupId?: string;
    campaignId?: string;
    detectionType: 'behavior-match' | 'infrastructure-match' | 'ttp-match' | 'ioc-match' | 'anomaly';
    confidence: number;
    affectedAssets: string[];
    indicators: string[];
    description: string;
    recommendedActions: string[];
    status: 'new' | 'investigating' | 'confirmed' | 'false-positive' | 'resolved';
    assignedTo?: string;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
}
interface APTIntelligenceSharing {
    id: string;
    sharingFormat: 'stix' | 'taxii' | 'misp' | 'json' | 'custom';
    aptGroupId?: string;
    campaignId?: string;
    data: Record<string, unknown>;
    classification: 'public' | 'tlp-white' | 'tlp-green' | 'tlp-amber' | 'tlp-red';
    sharedWith: string[];
    sharedAt: Date;
    expiresAt?: Date;
    revoked: boolean;
}
/**
 * Creates a new APT group profile with validation.
 *
 * @param {Partial<APTGroup>} groupData - APT group data
 * @returns {APTGroup} Validated APT group
 * @throws {Error} If required fields are missing or invalid
 *
 * @example
 * ```typescript
 * const aptGroup = createAPTGroup({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy', 'Strontium'],
 *   type: 'nation-state',
 *   attribution: { country: 'RU', confidence: 95 },
 *   sophistication: 'advanced'
 * });
 * // Result: { id: 'apt-uuid', name: 'APT28', ... }
 * ```
 */
export declare const createAPTGroup: (groupData: Partial<APTGroup>) => APTGroup;
/**
 * Validates APT group profile for completeness.
 *
 * @param {APTGroup} group - APT group to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateAPTGroup(aptGroup);
 * // Result: true (or throws error)
 * ```
 */
export declare const validateAPTGroup: (group: APTGroup) => boolean;
/**
 * Updates APT group activity status based on recent observations.
 *
 * @param {APTGroup} group - APT group to update
 * @param {Date} lastActivityDate - Most recent activity date
 * @returns {APTGroup} Updated APT group
 *
 * @example
 * ```typescript
 * const updated = updateAPTGroupActivity(aptGroup, new Date());
 * // Updates lastSeen and active status
 * ```
 */
export declare const updateAPTGroupActivity: (group: APTGroup, lastActivityDate: Date) => APTGroup;
/**
 * Merges duplicate APT group profiles.
 *
 * @param {APTGroup[]} groups - APT groups to merge
 * @returns {APTGroup} Merged APT group
 *
 * @example
 * ```typescript
 * const merged = mergeAPTGroups([group1, group2]);
 * // Combines aliases, takes highest confidence, most recent dates
 * ```
 */
export declare const mergeAPTGroups: (groups: APTGroup[]) => APTGroup;
/**
 * Creates a new APT campaign with tracking metadata.
 *
 * @param {Partial<APTCampaign>} campaignData - Campaign data
 * @returns {APTCampaign} Created APT campaign
 *
 * @example
 * ```typescript
 * const campaign = createAPTCampaign({
 *   name: 'Operation Ghost',
 *   aptGroupId: 'apt-28',
 *   objectives: ['credential theft', 'data exfiltration'],
 *   targetedSectors: ['healthcare', 'government']
 * });
 * ```
 */
export declare const createAPTCampaign: (campaignData: Partial<APTCampaign>) => APTCampaign;
/**
 * Tracks campaign progression and updates metadata.
 *
 * @param {APTCampaign} campaign - Campaign to track
 * @param {object} update - Update data
 * @returns {APTCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = trackCampaignProgression(campaign, {
 *   newVictims: 5,
 *   newIOCs: { domains: ['evil.com'] },
 *   severity: 'high'
 * });
 * ```
 */
export declare const trackCampaignProgression: (campaign: APTCampaign, update: {
    newVictims?: number;
    newIOCs?: Partial<APTCampaign["iocs"]>;
    severity?: APTCampaign["severity"];
    endDate?: Date;
}) => APTCampaign;
/**
 * Identifies related campaigns based on TTPs and IOCs.
 *
 * @param {APTCampaign} campaign - Campaign to analyze
 * @param {APTCampaign[]} allCampaigns - All known campaigns
 * @returns {Array<{ campaign: APTCampaign; similarity: number }>} Related campaigns
 *
 * @example
 * ```typescript
 * const related = identifyRelatedCampaigns(currentCampaign, historicalCampaigns);
 * // Result: [{ campaign: {...}, similarity: 0.85 }, ...]
 * ```
 */
export declare const identifyRelatedCampaigns: (campaign: APTCampaign, allCampaigns: APTCampaign[]) => Array<{
    campaign: APTCampaign;
    similarity: number;
}>;
/**
 * Calculates campaign impact score.
 *
 * @param {APTCampaign} campaign - Campaign to assess
 * @returns {number} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = calculateCampaignImpact(campaign);
 * // Result: 87
 * ```
 */
export declare const calculateCampaignImpact: (campaign: APTCampaign) => number;
/**
 * Registers APT behavior pattern for detection.
 *
 * @param {Partial<APTBehaviorPattern>} patternData - Pattern data
 * @returns {APTBehaviorPattern} Registered pattern
 *
 * @example
 * ```typescript
 * const pattern = registerBehaviorPattern({
 *   aptGroupId: 'apt-28',
 *   patternType: 'lateral-movement',
 *   signature: 'PsExec + Mimikatz combo',
 *   mitreAttackIds: ['T1021.002', 'T1003.001']
 * });
 * ```
 */
export declare const registerBehaviorPattern: (patternData: Partial<APTBehaviorPattern>) => APTBehaviorPattern;
/**
 * Detects APT behavior patterns in activity logs.
 *
 * @param {any[]} activityLogs - Security event logs
 * @param {APTBehaviorPattern[]} knownPatterns - Known APT patterns
 * @returns {Array<{ pattern: APTBehaviorPattern; matches: any[] }>} Detected patterns
 *
 * @example
 * ```typescript
 * const detections = detectBehaviorPatterns(securityLogs, aptPatterns);
 * // Result: [{ pattern: {...}, matches: [...] }, ...]
 * ```
 */
export declare const detectBehaviorPatterns: (activityLogs: any[], knownPatterns: APTBehaviorPattern[]) => Array<{
    pattern: APTBehaviorPattern;
    matches: any[];
    confidence: number;
}>;
/**
 * Updates pattern observation statistics.
 *
 * @param {APTBehaviorPattern} pattern - Pattern to update
 * @param {number} newObservations - Number of new observations
 * @returns {APTBehaviorPattern} Updated pattern
 *
 * @example
 * ```typescript
 * const updated = updatePatternObservations(pattern, 5);
 * // Increments observation count and updates frequency
 * ```
 */
export declare const updatePatternObservations: (pattern: APTBehaviorPattern, newObservations: number) => APTBehaviorPattern;
/**
 * Analyzes pattern evolution over time.
 *
 * @param {APTBehaviorPattern[]} patterns - Historical patterns
 * @param {string} aptGroupId - APT group ID
 * @returns {object} Evolution analysis
 *
 * @example
 * ```typescript
 * const evolution = analyzePatternEvolution(patterns, 'apt-28');
 * // Result: { trending: [...], deprecated: [...], emerging: [...] }
 * ```
 */
export declare const analyzePatternEvolution: (patterns: APTBehaviorPattern[], aptGroupId: string) => {
    trending: APTBehaviorPattern[];
    deprecated: APTBehaviorPattern[];
    emerging: APTBehaviorPattern[];
};
/**
 * Tracks APT infrastructure with lifecycle management.
 *
 * @param {Partial<APTInfrastructure>} infraData - Infrastructure data
 * @returns {APTInfrastructure} Tracked infrastructure
 *
 * @example
 * ```typescript
 * const infra = trackAPTInfrastructure({
 *   aptGroupId: 'apt-28',
 *   type: 'domain',
 *   value: 'malicious-c2.com',
 *   role: 'c2',
 *   active: true
 * });
 * ```
 */
export declare const trackAPTInfrastructure: (infraData: Partial<APTInfrastructure>) => APTInfrastructure;
/**
 * Identifies infrastructure overlaps between APT groups.
 *
 * @param {APTInfrastructure[]} group1Infra - First group's infrastructure
 * @param {APTInfrastructure[]} group2Infra - Second group's infrastructure
 * @returns {APTInfrastructure[]} Overlapping infrastructure
 *
 * @example
 * ```typescript
 * const overlaps = findInfrastructureOverlaps(apt28Infra, apt29Infra);
 * // Result: [{ type: 'domain', value: 'shared-c2.com', ... }]
 * ```
 */
export declare const findInfrastructureOverlaps: (group1Infra: APTInfrastructure[], group2Infra: APTInfrastructure[]) => APTInfrastructure[];
/**
 * Monitors infrastructure lifecycle and expiration.
 *
 * @param {APTInfrastructure[]} infrastructure - Infrastructure to monitor
 * @returns {object} Lifecycle status
 *
 * @example
 * ```typescript
 * const status = monitorInfrastructureLifecycle(infrastructure);
 * // Result: { expiring: [...], expired: [...], active: [...] }
 * ```
 */
export declare const monitorInfrastructureLifecycle: (infrastructure: APTInfrastructure[]) => {
    expiring: APTInfrastructure[];
    expired: APTInfrastructure[];
    active: APTInfrastructure[];
};
/**
 * Correlates infrastructure with malware families.
 *
 * @param {APTInfrastructure} infrastructure - Infrastructure to analyze
 * @param {string[]} malwareFamilies - Known malware families
 * @returns {object} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = correlateInfrastructureWithMalware(infra, ['Cobalt Strike', 'Emotet']);
 * ```
 */
export declare const correlateInfrastructureWithMalware: (infrastructure: APTInfrastructure, malwareFamilies: string[]) => {
    correlated: string[];
    confidence: number;
};
/**
 * Analyzes dwell time for APT campaign.
 *
 * @param {Partial<DwellTimeAnalysis>} analysisData - Dwell time data
 * @returns {DwellTimeAnalysis} Dwell time analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeDwellTime({
 *   campaignId: 'camp-123',
 *   organizationId: 'org-456',
 *   initialCompromise: new Date('2024-01-01'),
 *   detectionDate: new Date('2024-03-15')
 * });
 * // Result: { dwellTimeDays: 74, ... }
 * ```
 */
export declare const analyzeDwellTime: (analysisData: Partial<DwellTimeAnalysis>) => DwellTimeAnalysis;
/**
 * Calculates average dwell time across campaigns.
 *
 * @param {DwellTimeAnalysis[]} analyses - Dwell time analyses
 * @returns {object} Statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDwellTimeStatistics(analyses);
 * // Result: { average: 65, median: 58, min: 7, max: 180 }
 * ```
 */
export declare const calculateDwellTimeStatistics: (analyses: DwellTimeAnalysis[]) => {
    average: number;
    median: number;
    min: number;
    max: number;
    distribution: Record<string, number>;
};
/**
 * Identifies factors contributing to extended dwell time.
 *
 * @param {DwellTimeAnalysis} analysis - Dwell time analysis
 * @returns {object} Contributing factors
 *
 * @example
 * ```typescript
 * const factors = identifyDwellTimeFactors(analysis);
 * // Result: { factors: ['...'], recommendations: ['...'] }
 * ```
 */
export declare const identifyDwellTimeFactors: (analysis: DwellTimeAnalysis) => {
    factors: string[];
    recommendations: string[];
};
/**
 * Maps APT TTPs to MITRE ATT&CK framework.
 *
 * @param {Partial<APTTTPMapping>} ttpData - TTP data
 * @returns {APTTTPMapping} Mapped TTP
 *
 * @example
 * ```typescript
 * const ttp = mapAPTTTPToMITRE({
 *   aptGroupId: 'apt-28',
 *   mitreAttackId: 'T1566.001',
 *   tactic: 'Initial Access',
 *   technique: 'Phishing: Spearphishing Attachment'
 * });
 * ```
 */
export declare const mapAPTTTPToMITRE: (ttpData: Partial<APTTTPMapping>) => APTTTPMapping;
/**
 * Analyzes TTP coverage across MITRE ATT&CK matrix.
 *
 * @param {APTTTPMapping[]} ttps - APT TTPs
 * @returns {object} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = analyzeTTPCoverage(aptTTPs);
 * // Result: { tactics: {...}, techniques: {...}, coverage: 0.65 }
 * ```
 */
export declare const analyzeTTPCoverage: (ttps: APTTTPMapping[]) => {
    tactics: Record<string, number>;
    techniques: number;
    coverage: number;
};
/**
 * Generates TTP-based detection rules.
 *
 * @param {APTTTPMapping} ttp - TTP to generate rules for
 * @returns {string[]} Detection rules
 *
 * @example
 * ```typescript
 * const rules = generateTTPDetectionRules(ttp);
 * // Result: ['Sigma rule...', 'YARA rule...']
 * ```
 */
export declare const generateTTPDetectionRules: (ttp: APTTTPMapping) => string[];
/**
 * Creates APT attribution with evidence scoring.
 *
 * @param {Partial<APTAttribution>} attributionData - Attribution data
 * @returns {APTAttribution} Complete attribution
 *
 * @example
 * ```typescript
 * const attribution = createAPTAttribution({
 *   campaignId: 'camp-123',
 *   aptGroupId: 'apt-28',
 *   attributionMethod: 'ttp-match',
 *   evidence: [{ type: 'ttp', description: '...', weight: 85 }]
 * });
 * ```
 */
export declare const createAPTAttribution: (attributionData: Partial<APTAttribution>) => APTAttribution;
/**
 * Calculates attribution confidence based on evidence.
 *
 * @param {APTAttribution['evidence']} evidence - Evidence for attribution
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence(evidence);
 * // Result: 87
 * ```
 */
export declare const calculateAttributionConfidence: (evidence: APTAttribution["evidence"]) => number;
/**
 * Validates attribution evidence quality.
 *
 * @param {APTAttribution['evidence']} evidence - Evidence to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAttributionEvidence(evidence);
 * // Result: { valid: true, issues: [], score: 95 }
 * ```
 */
export declare const validateAttributionEvidence: (evidence: APTAttribution["evidence"]) => {
    valid: boolean;
    issues: string[];
    score: number;
};
/**
 * Compares attribution confidence across multiple APT groups.
 *
 * @param {APTAttribution[]} attributions - Attributions to compare
 * @returns {APTAttribution[]} Sorted by confidence (highest first)
 *
 * @example
 * ```typescript
 * const ranked = rankAttributionsByConfidence(attributions);
 * ```
 */
export declare const rankAttributionsByConfidence: (attributions: APTAttribution[]) => APTAttribution[];
/**
 * Generates STIX 2.1 format intelligence package.
 *
 * @param {APTCampaign} campaign - Campaign to share
 * @param {APTGroup} aptGroup - Associated APT group
 * @returns {APTIntelligenceSharing} STIX package
 *
 * @example
 * ```typescript
 * const stix = generateSTIXIntelligence(campaign, aptGroup);
 * ```
 */
export declare const generateSTIXIntelligence: (campaign: APTCampaign, aptGroup: APTGroup) => APTIntelligenceSharing;
/**
 * Generates TAXII 2.1 compatible feed.
 *
 * @param {APTIntelligenceSharing[]} sharingRecords - Intelligence to share
 * @returns {object} TAXII feed
 *
 * @example
 * ```typescript
 * const taxiiFeed = generateTAXIIFeed(intelligenceRecords);
 * ```
 */
export declare const generateTAXIIFeed: (sharingRecords: APTIntelligenceSharing[]) => object;
/**
 * Validates intelligence sharing compliance with TLP.
 *
 * @param {APTIntelligenceSharing} sharing - Sharing record to validate
 * @param {string[]} recipients - Intended recipients
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSharingCompliance(sharing, ['partner1', 'partner2']);
 * ```
 */
export declare const validateSharingCompliance: (sharing: APTIntelligenceSharing, recipients: string[]) => {
    compliant: boolean;
    issues: string[];
};
/**
 * Generates comprehensive APT intelligence report.
 *
 * @param {Partial<APTIntelligenceReport>} reportData - Report data
 * @returns {APTIntelligenceReport} Complete report
 *
 * @example
 * ```typescript
 * const report = generateAPTIntelligenceReport({
 *   reportType: 'operational',
 *   aptGroupId: 'apt-28',
 *   title: 'APT28 Q4 2024 Activity Summary'
 * });
 * ```
 */
export declare const generateAPTIntelligenceReport: (reportData: Partial<APTIntelligenceReport>) => APTIntelligenceReport;
/**
 * Generates executive summary from technical findings.
 *
 * @param {APTIntelligenceReport} report - Intelligence report
 * @returns {string} Executive summary
 *
 * @example
 * ```typescript
 * const summary = generateExecutiveSummary(report);
 * ```
 */
export declare const generateExecutiveSummary: (report: APTIntelligenceReport) => string;
/**
 * Exports report in multiple formats (JSON, PDF, HTML).
 *
 * @param {APTIntelligenceReport} report - Report to export
 * @param {string} format - Export format
 * @returns {string} Exported report
 *
 * @example
 * ```typescript
 * const json = exportReport(report, 'json');
 * const html = exportReport(report, 'html');
 * ```
 */
export declare const exportReport: (report: APTIntelligenceReport, format: "json" | "html" | "pdf") => string;
/**
 * Creates APT detection alert with triage information.
 *
 * @param {Partial<APTDetectionAlert>} alertData - Alert data
 * @returns {APTDetectionAlert} Created alert
 *
 * @example
 * ```typescript
 * const alert = createAPTDetectionAlert({
 *   severity: 'high',
 *   detectionType: 'ttp-match',
 *   aptGroupId: 'apt-28',
 *   indicators: ['T1566.001', 'suspicious-domain.com']
 * });
 * ```
 */
export declare const createAPTDetectionAlert: (alertData: Partial<APTDetectionAlert>) => APTDetectionAlert;
/**
 * Prioritizes APT alerts based on severity and context.
 *
 * @param {APTDetectionAlert[]} alerts - Alerts to prioritize
 * @returns {APTDetectionAlert[]} Prioritized alerts
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAPTAlerts(alerts);
 * ```
 */
export declare const prioritizeAPTAlerts: (alerts: APTDetectionAlert[]) => APTDetectionAlert[];
/**
 * Correlates multiple alerts to identify campaign patterns.
 *
 * @param {APTDetectionAlert[]} alerts - Alerts to correlate
 * @returns {object} Correlation analysis
 *
 * @example
 * ```typescript
 * const correlation = correlateAlerts(alerts);
 * // Result: { relatedAlerts: [...], likelyCampaign: true }
 * ```
 */
export declare const correlateAlerts: (alerts: APTDetectionAlert[]) => {
    relatedAlerts: APTDetectionAlert[][];
    likelyCampaign: boolean;
    confidence: number;
};
/**
 * Sequelize model definition for APTGroup.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'apt_groups', timestamps: true, paranoid: true })
 * export class APTGroupModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false, unique: true })
 *   @Index
 *   name: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   aliases: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('nation-state', 'criminal', 'hacktivist', 'unknown'),
 *     defaultValue: 'unknown'
 *   })
 *   type: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: { confidence: 0 } })
 *   attribution: { country?: string; sponsor?: string; confidence: number };
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   firstSeen: Date;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   lastSeen: Date;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   active: boolean;
 *
 *   @Column({
 *     type: DataType.ENUM('minimal', 'low', 'medium', 'high', 'advanced', 'expert'),
 *     defaultValue: 'medium'
 *   })
 *   sophistication: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: { sectors: [], regions: [], organizationTypes: [] } })
 *   targets: { sectors: string[]; regions: string[]; organizationTypes: string[] };
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: ['unknown'] })
 *   motivation: string[];
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => APTCampaignModel)
 *   campaigns: APTCampaignModel[];
 *
 *   @HasMany(() => APTBehaviorPatternModel)
 *   behaviorPatterns: APTBehaviorPatternModel[];
 *
 *   @HasMany(() => APTInfrastructureModel)
 *   infrastructure: APTInfrastructureModel[];
 *
 *   @BeforeValidate
 *   static validateConfidence(instance: APTGroupModel) {
 *     if (instance.attribution.confidence < 0 || instance.attribution.confidence > 100) {
 *       throw new Error('Attribution confidence must be between 0 and 100');
 *     }
 *   }
 *
 *   @BeforeUpdate
 *   static updateLastSeen(instance: APTGroupModel) {
 *     instance.lastSeen = new Date();
 *   }
 * }
 * ```
 */
export declare const defineAPTGroupModel: () => string;
/**
 * Sequelize model definition for APTCampaign.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'apt_campaigns', timestamps: true, paranoid: true })
 * export class APTCampaignModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   @Index
 *   name: string;
 *
 *   @ForeignKey(() => APTGroupModel)
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   aptGroupId: string;
 *
 *   @BelongsTo(() => APTGroupModel)
 *   aptGroup: APTGroupModel;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   startDate: Date;
 *
 *   @Column(DataType.DATE)
 *   endDate: Date;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   active: boolean;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   objectives: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetedSectors: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetedRegions: string[];
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0 })
 *   affectedOrganizations: number;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   detectionConfidence: number;
 *
 *   @Column({
 *     type: DataType.ENUM('low', 'medium', 'high', 'critical'),
 *     defaultValue: 'medium'
 *   })
 *   severity: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   ttps: string[];
 *
 *   @Column({
 *     type: DataType.JSONB,
 *     defaultValue: { ipAddresses: [], domains: [], fileHashes: [], emailAddresses: [] }
 *   })
 *   iocs: { ipAddresses: string[]; domains: string[]; fileHashes: string[]; emailAddresses: string[] };
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0 })
 *   victimCount: number;
 *
 *   @Column(DataType.DECIMAL(15, 2))
 *   estimatedDamage: number;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @HasMany(() => DwellTimeAnalysisModel)
 *   dwellTimeAnalyses: DwellTimeAnalysisModel[];
 *
 *   @HasMany(() => APTAttributionModel)
 *   attributions: APTAttributionModel[];
 *
 *   @AfterCreate
 *   static async logCampaignCreation(instance: APTCampaignModel) {
 *     // Log to audit trail (HIPAA compliance)
 *     console.log(`APT Campaign created: ${instance.name} (${instance.id})`);
 *   }
 * }
 * ```
 */
export declare const defineAPTCampaignModel: () => string;
/**
 * Sequelize associations for APT tracking models.
 *
 * @example
 * ```typescript
 * // APT Group to Campaign (one-to-many)
 * APTGroupModel.hasMany(APTCampaignModel, { foreignKey: 'aptGroupId', as: 'campaigns' });
 * APTCampaignModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId', as: 'aptGroup' });
 *
 * // APT Group to Behavior Patterns (one-to-many)
 * APTGroupModel.hasMany(APTBehaviorPatternModel, { foreignKey: 'aptGroupId', as: 'behaviorPatterns' });
 * APTBehaviorPatternModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 *
 * // APT Group to Infrastructure (one-to-many)
 * APTGroupModel.hasMany(APTInfrastructureModel, { foreignKey: 'aptGroupId', as: 'infrastructure' });
 * APTInfrastructureModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 *
 * // Campaign to TTP Mappings (one-to-many)
 * APTCampaignModel.hasMany(APTTTPMappingModel, { foreignKey: 'campaignId', as: 'ttpMappings' });
 * APTTTPMappingModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // Campaign to Attributions (one-to-many)
 * APTCampaignModel.hasMany(APTAttributionModel, { foreignKey: 'campaignId', as: 'attributions' });
 * APTAttributionModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // Campaign to Dwell Time Analyses (one-to-many)
 * APTCampaignModel.hasMany(DwellTimeAnalysisModel, { foreignKey: 'campaignId', as: 'dwellTimeAnalyses' });
 * DwellTimeAnalysisModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // APT Group to Detection Alerts (one-to-many)
 * APTGroupModel.hasMany(APTDetectionAlertModel, { foreignKey: 'aptGroupId', as: 'detectionAlerts' });
 * APTDetectionAlertModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 * ```
 */
export declare const defineAPTAssociations: () => string;
/**
 * NestJS service for APT detection and tracking.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class APTDetectionService {
 *   constructor(
 *     @InjectModel(APTGroupModel) private aptGroupModel: typeof APTGroupModel,
 *     @InjectModel(APTCampaignModel) private campaignModel: typeof APTCampaignModel,
 *     @InjectModel(APTBehaviorPatternModel) private patternModel: typeof APTBehaviorPatternModel,
 *     private logger: Logger
 *   ) {}
 *
 *   async detectAPTActivity(activityLogs: any[]): Promise<APTDetectionAlert[]> {
 *     const knownPatterns = await this.patternModel.findAll();
 *     const detections = detectBehaviorPatterns(activityLogs, knownPatterns);
 *
 *     const alerts = await Promise.all(
 *       detections.map(d => this.createDetectionAlert(d))
 *     );
 *
 *     return prioritizeAPTAlerts(alerts);
 *   }
 *
 *   async trackCampaign(campaignId: string): Promise<APTCampaign> {
 *     const campaign = await this.campaignModel.findByPk(campaignId, {
 *       include: ['aptGroup', 'ttpMappings', 'attributions']
 *     });
 *
 *     if (!campaign) {
 *       throw new NotFoundException(`Campaign ${campaignId} not found`);
 *     }
 *
 *     return campaign;
 *   }
 *
 *   async analyzeDwellTime(campaignId: string, orgId: string): Promise<DwellTimeAnalysis> {
 *     // Retrieve incident timeline
 *     const timeline = await this.getIncidentTimeline(campaignId, orgId);
 *
 *     return analyzeDwellTime({
 *       campaignId,
 *       organizationId: orgId,
 *       initialCompromise: timeline.initialCompromise,
 *       detectionDate: timeline.detectionDate,
 *       attackPhases: timeline.phases
 *     });
 *   }
 *
 *   async generateIntelligenceReport(
 *     aptGroupId: string,
 *     reportType: 'tactical' | 'operational' | 'strategic'
 *   ): Promise<APTIntelligenceReport> {
 *     const aptGroup = await this.aptGroupModel.findByPk(aptGroupId, {
 *       include: ['campaigns', 'behaviorPatterns', 'infrastructure']
 *     });
 *
 *     const findings = this.analyzeAPTActivity(aptGroup);
 *     const recommendations = this.generateRecommendations(aptGroup, findings);
 *
 *     return generateAPTIntelligenceReport({
 *       reportType,
 *       aptGroupId,
 *       title: `${aptGroup.name} Intelligence Report`,
 *       findings,
 *       recommendations
 *     });
 *   }
 * }
 * ```
 */
export declare const createAPTDetectionService: () => string;
/**
 * Swagger API endpoint definitions for APT detection.
 *
 * @example
 * ```typescript
 * @ApiTags('APT Detection')
 * @Controller('apt')
 * export class APTController {
 *   @Post('detect')
 *   @ApiOperation({ summary: 'Detect APT activity in logs' })
 *   @ApiBody({ type: DetectAPTDto })
 *   @ApiResponse({ status: 200, description: 'Detection results', type: [APTDetectionAlertDto] })
 *   async detectActivity(@Body() dto: DetectAPTDto): Promise<APTDetectionAlertDto[]> {
 *     return this.aptService.detectAPTActivity(dto.activityLogs);
 *   }
 *
 *   @Get('groups/:id')
 *   @ApiOperation({ summary: 'Get APT group profile' })
 *   @ApiParam({ name: 'id', description: 'APT Group ID' })
 *   @ApiResponse({ status: 200, type: APTGroupDto })
 *   async getGroup(@Param('id') id: string): Promise<APTGroupDto> {
 *     return this.aptService.getAPTGroup(id);
 *   }
 *
 *   @Get('campaigns/:id/dwell-time')
 *   @ApiOperation({ summary: 'Analyze campaign dwell time' })
 *   @ApiResponse({ status: 200, type: DwellTimeAnalysisDto })
 *   async analyzeDwellTime(
 *     @Param('id') id: string,
 *     @Query('orgId') orgId: string
 *   ): Promise<DwellTimeAnalysisDto> {
 *     return this.aptService.analyzeDwellTime(id, orgId);
 *   }
 *
 *   @Post('campaigns/:id/attribute')
 *   @ApiOperation({ summary: 'Attribute campaign to APT group' })
 *   @ApiBody({ type: AttributeCampaignDto })
 *   @ApiResponse({ status: 201, type: APTAttributionDto })
 *   async attributeCampaign(
 *     @Param('id') id: string,
 *     @Body() dto: AttributeCampaignDto
 *   ): Promise<APTAttributionDto> {
 *     return this.aptService.createAttribution(id, dto);
 *   }
 *
 *   @Get('intelligence/report/:id')
 *   @ApiOperation({ summary: 'Generate APT intelligence report' })
 *   @ApiResponse({ status: 200, type: APTIntelligenceReportDto })
 *   async generateReport(@Param('id') id: string): Promise<APTIntelligenceReportDto> {
 *     return this.aptService.generateIntelligenceReport(id, 'operational');
 *   }
 * }
 * ```
 */
export declare const defineAPTAPI: () => string;
declare const _default: {
    createAPTGroup: (groupData: Partial<APTGroup>) => APTGroup;
    validateAPTGroup: (group: APTGroup) => boolean;
    updateAPTGroupActivity: (group: APTGroup, lastActivityDate: Date) => APTGroup;
    mergeAPTGroups: (groups: APTGroup[]) => APTGroup;
    createAPTCampaign: (campaignData: Partial<APTCampaign>) => APTCampaign;
    trackCampaignProgression: (campaign: APTCampaign, update: {
        newVictims?: number;
        newIOCs?: Partial<APTCampaign["iocs"]>;
        severity?: APTCampaign["severity"];
        endDate?: Date;
    }) => APTCampaign;
    identifyRelatedCampaigns: (campaign: APTCampaign, allCampaigns: APTCampaign[]) => Array<{
        campaign: APTCampaign;
        similarity: number;
    }>;
    calculateCampaignImpact: (campaign: APTCampaign) => number;
    registerBehaviorPattern: (patternData: Partial<APTBehaviorPattern>) => APTBehaviorPattern;
    detectBehaviorPatterns: (activityLogs: any[], knownPatterns: APTBehaviorPattern[]) => Array<{
        pattern: APTBehaviorPattern;
        matches: any[];
        confidence: number;
    }>;
    updatePatternObservations: (pattern: APTBehaviorPattern, newObservations: number) => APTBehaviorPattern;
    analyzePatternEvolution: (patterns: APTBehaviorPattern[], aptGroupId: string) => {
        trending: APTBehaviorPattern[];
        deprecated: APTBehaviorPattern[];
        emerging: APTBehaviorPattern[];
    };
    trackAPTInfrastructure: (infraData: Partial<APTInfrastructure>) => APTInfrastructure;
    findInfrastructureOverlaps: (group1Infra: APTInfrastructure[], group2Infra: APTInfrastructure[]) => APTInfrastructure[];
    monitorInfrastructureLifecycle: (infrastructure: APTInfrastructure[]) => {
        expiring: APTInfrastructure[];
        expired: APTInfrastructure[];
        active: APTInfrastructure[];
    };
    correlateInfrastructureWithMalware: (infrastructure: APTInfrastructure, malwareFamilies: string[]) => {
        correlated: string[];
        confidence: number;
    };
    analyzeDwellTime: (analysisData: Partial<DwellTimeAnalysis>) => DwellTimeAnalysis;
    calculateDwellTimeStatistics: (analyses: DwellTimeAnalysis[]) => {
        average: number;
        median: number;
        min: number;
        max: number;
        distribution: Record<string, number>;
    };
    identifyDwellTimeFactors: (analysis: DwellTimeAnalysis) => {
        factors: string[];
        recommendations: string[];
    };
    mapAPTTTPToMITRE: (ttpData: Partial<APTTTPMapping>) => APTTTPMapping;
    analyzeTTPCoverage: (ttps: APTTTPMapping[]) => {
        tactics: Record<string, number>;
        techniques: number;
        coverage: number;
    };
    generateTTPDetectionRules: (ttp: APTTTPMapping) => string[];
    createAPTAttribution: (attributionData: Partial<APTAttribution>) => APTAttribution;
    calculateAttributionConfidence: (evidence: APTAttribution["evidence"]) => number;
    validateAttributionEvidence: (evidence: APTAttribution["evidence"]) => {
        valid: boolean;
        issues: string[];
        score: number;
    };
    rankAttributionsByConfidence: (attributions: APTAttribution[]) => APTAttribution[];
    generateSTIXIntelligence: (campaign: APTCampaign, aptGroup: APTGroup) => APTIntelligenceSharing;
    generateTAXIIFeed: (sharingRecords: APTIntelligenceSharing[]) => object;
    validateSharingCompliance: (sharing: APTIntelligenceSharing, recipients: string[]) => {
        compliant: boolean;
        issues: string[];
    };
    generateAPTIntelligenceReport: (reportData: Partial<APTIntelligenceReport>) => APTIntelligenceReport;
    generateExecutiveSummary: (report: APTIntelligenceReport) => string;
    exportReport: (report: APTIntelligenceReport, format: "json" | "html" | "pdf") => string;
    createAPTDetectionAlert: (alertData: Partial<APTDetectionAlert>) => APTDetectionAlert;
    prioritizeAPTAlerts: (alerts: APTDetectionAlert[]) => APTDetectionAlert[];
    correlateAlerts: (alerts: APTDetectionAlert[]) => {
        relatedAlerts: APTDetectionAlert[][];
        likelyCampaign: boolean;
        confidence: number;
    };
    defineAPTGroupModel: () => string;
    defineAPTCampaignModel: () => string;
    defineAPTAssociations: () => string;
    createAPTDetectionService: () => string;
    defineAPTAPI: () => string;
};
export default _default;
//# sourceMappingURL=apt-detection-tracking-kit.d.ts.map