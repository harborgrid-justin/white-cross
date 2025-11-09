/**
 * LOC: THCP1234567
 * File: /reuse/threat/threat-campaigns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Campaign tracking modules
 *   - Security analysis engines
 */
/**
 * File: /reuse/threat/threat-campaigns-kit.ts
 * Locator: WC-UTL-THCP-001
 * Purpose: Comprehensive Threat Campaign Intelligence - detection, tracking, attribution, impact assessment
 *
 * Upstream: Independent utility module for threat campaign analysis
 * Downstream: ../backend/*, Threat intelligence services, Security modules, Campaign tracking systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 38 utility functions for campaign detection, timeline analysis, attribution, impact assessment
 *
 * LLM Context: Comprehensive threat campaign intelligence utilities for White Cross security platform.
 * Provides campaign detection, timeline analysis, target profiling, impact assessment, attribution,
 * lifecycle management, pattern recognition, and campaign correlation capabilities.
 */
interface ThreatCampaign {
    id: string;
    name: string;
    aliases: string[];
    description?: string;
    status: 'active' | 'dormant' | 'concluded' | 'suspected';
    sophistication: 'low' | 'medium' | 'high' | 'very-high';
    attributedActorId?: string;
    attributionConfidence: number;
    firstDetected: Date;
    lastActivity: Date;
    targetSectors: string[];
    targetGeographies: string[];
    victimCount: number;
    confidence: number;
    metadata?: Record<string, unknown>;
}
interface CampaignTimeline {
    campaignId: string;
    events: CampaignEvent[];
    phases: CampaignPhase[];
    duration: number;
    activityPattern: 'continuous' | 'periodic' | 'sporadic' | 'burst';
}
interface CampaignEvent {
    id: string;
    campaignId: string;
    timestamp: Date;
    eventType: 'initial-compromise' | 'lateral-movement' | 'data-exfiltration' | 'impact' | 'discovery' | 'infrastructure-change';
    description: string;
    affectedEntities: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    evidence: string[];
    confidence: number;
}
interface CampaignPhase {
    name: string;
    startDate: Date;
    endDate?: Date;
    status: 'ongoing' | 'completed';
    objectives: string[];
    ttps: string[];
    indicators: string[];
}
interface CampaignTarget {
    campaignId: string;
    entityId: string;
    entityType: 'organization' | 'individual' | 'infrastructure' | 'sector';
    entityName: string;
    targetingReason: string[];
    compromised: boolean;
    compromiseDate?: Date;
    impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    dataExfiltrated: boolean;
    systemsAffected: number;
}
interface CampaignImpact {
    campaignId: string;
    financialImpact?: {
        estimatedLoss: number;
        currency: string;
        confidence: number;
    };
    dataImpact?: {
        recordsCompromised: number;
        dataTypes: string[];
        sensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
    };
    operationalImpact?: {
        downtimeHours: number;
        systemsAffected: number;
        serviceDisruption: boolean;
    };
    reputationalImpact?: {
        severity: 'low' | 'medium' | 'high';
        publicExposure: boolean;
        mediaAttention: boolean;
    };
    overallSeverity: 'low' | 'medium' | 'high' | 'critical';
}
interface CampaignAttribution {
    campaignId: string;
    actorId: string;
    confidence: number;
    attributionDate: Date;
    evidenceTypes: string[];
    matchedTTPs: string[];
    matchedInfrastructure: string[];
    analyst?: string;
    notes?: string;
}
interface CampaignPattern {
    patternType: 'temporal' | 'geographic' | 'targeting' | 'technical' | 'behavioral';
    description: string;
    occurrences: number;
    confidence: number;
    relatedCampaigns: string[];
}
interface CampaignCorrelation {
    campaign1Id: string;
    campaign2Id: string;
    correlationType: 'shared-infrastructure' | 'shared-ttps' | 'shared-targets' | 'temporal-overlap' | 'attributed-same-actor';
    similarityScore: number;
    evidence: string[];
    confidence: number;
}
/**
 * Creates a new threat campaign with validation.
 *
 * @param {Partial<ThreatCampaign>} campaignData - Campaign data
 * @returns {ThreatCampaign} Validated threat campaign
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const campaign = createThreatCampaign({
 *   name: 'Operation Shadowstrike',
 *   status: 'active',
 *   sophistication: 'high',
 *   targetSectors: ['finance', 'healthcare'],
 *   targetGeographies: ['US', 'EU']
 * });
 * // Result: { id: 'uuid', name: 'Operation Shadowstrike', ... }
 * ```
 */
export declare const createThreatCampaign: (campaignData: Partial<ThreatCampaign>) => ThreatCampaign;
/**
 * Validates threat campaign data for completeness.
 *
 * @param {ThreatCampaign} campaign - Campaign to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateThreatCampaign(campaign);
 * // Result: true (or throws error)
 * ```
 */
export declare const validateThreatCampaign: (campaign: ThreatCampaign) => boolean;
/**
 * Detects potential new campaign from incident patterns.
 *
 * @param {CampaignEvent[]} incidents - Recent security incidents
 * @param {number} similarityThreshold - Minimum similarity to group (0-100)
 * @returns {ThreatCampaign[]} Detected potential campaigns
 *
 * @example
 * ```typescript
 * const campaigns = detectCampaignFromIncidents(incidents, 70);
 * // Clusters similar incidents into potential campaigns
 * ```
 */
export declare const detectCampaignFromIncidents: (incidents: CampaignEvent[], similarityThreshold: number) => ThreatCampaign[];
/**
 * Updates campaign activity with new event.
 *
 * @param {ThreatCampaign} campaign - Campaign to update
 * @param {CampaignEvent} event - New event to add
 * @returns {ThreatCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = updateCampaignActivity(campaign, newEvent);
 * // Updates lastActivity, victimCount, status
 * ```
 */
export declare const updateCampaignActivity: (campaign: ThreatCampaign, event: CampaignEvent) => ThreatCampaign;
/**
 * Marks campaign as dormant based on inactivity period.
 *
 * @param {ThreatCampaign} campaign - Campaign to check
 * @param {number} inactiveDays - Days of inactivity to mark dormant
 * @returns {ThreatCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = markCampaignDormant(campaign, 90);
 * // Marks campaign dormant if no activity in 90 days
 * ```
 */
export declare const markCampaignDormant: (campaign: ThreatCampaign, inactiveDays: number) => ThreatCampaign;
/**
 * Builds comprehensive campaign timeline from events.
 *
 * @param {CampaignEvent[]} events - Campaign events
 * @returns {CampaignTimeline} Structured timeline
 *
 * @example
 * ```typescript
 * const timeline = buildCampaignTimeline(events);
 * // Result: { events: [...], phases: [...], duration: 2592000000, activityPattern: 'periodic' }
 * ```
 */
export declare const buildCampaignTimeline: (events: CampaignEvent[]) => CampaignTimeline;
/**
 * Identifies distinct phases in campaign timeline.
 *
 * @param {CampaignEvent[]} events - Sorted campaign events
 * @returns {CampaignPhase[]} Identified phases
 *
 * @example
 * ```typescript
 * const phases = identifyCampaignPhases(events);
 * // Result: [{ name: 'Initial Access', startDate: ..., objectives: [...] }]
 * ```
 */
export declare const identifyCampaignPhases: (events: CampaignEvent[]) => CampaignPhase[];
/**
 * Determines campaign activity pattern from timeline.
 *
 * @param {CampaignEvent[]} events - Campaign events
 * @returns {CampaignTimeline['activityPattern']} Activity pattern
 *
 * @example
 * ```typescript
 * const pattern = determineActivityPattern(events);
 * // Result: 'periodic'
 * ```
 */
export declare const determineActivityPattern: (events: CampaignEvent[]) => CampaignTimeline["activityPattern"];
/**
 * Analyzes campaign tempo and intensity over time.
 *
 * @param {CampaignEvent[]} events - Campaign events
 * @param {number} windowDays - Analysis window in days
 * @returns {Array<{ period: string; eventCount: number; intensity: number }>} Tempo analysis
 *
 * @example
 * ```typescript
 * const tempo = analyzeCampaignTempo(events, 7);
 * // Result: [{ period: '2024-01-01', eventCount: 15, intensity: 75 }]
 * ```
 */
export declare const analyzeCampaignTempo: (events: CampaignEvent[], windowDays: number) => Array<{
    period: string;
    eventCount: number;
    intensity: number;
}>;
/**
 * Creates campaign target profile.
 *
 * @param {Omit<CampaignTarget, 'impactLevel'>} targetData - Target data
 * @returns {CampaignTarget} Complete target profile
 *
 * @example
 * ```typescript
 * const target = createCampaignTarget({
 *   campaignId: 'camp-123',
 *   entityId: 'org-456',
 *   entityType: 'organization',
 *   entityName: 'ACME Corp',
 *   targetingReason: ['financial-data', 'intellectual-property'],
 *   compromised: true,
 *   dataExfiltrated: true,
 *   systemsAffected: 15
 * });
 * ```
 */
export declare const createCampaignTarget: (targetData: Omit<CampaignTarget, "impactLevel">) => CampaignTarget;
/**
 * Analyzes targeting patterns across campaign targets.
 *
 * @param {CampaignTarget[]} targets - Campaign targets
 * @returns {{ sectorDistribution: Record<string, number>; geoDistribution: Record<string, number> }}
 *
 * @example
 * ```typescript
 * const patterns = analyzeTargetingPatterns(targets);
 * // Result: { sectorDistribution: { finance: 40, healthcare: 30 }, geoDistribution: { US: 60 } }
 * ```
 */
export declare const analyzeTargetingPatterns: (targets: CampaignTarget[]) => {
    sectorDistribution: Record<string, number>;
    geoDistribution: Record<string, number>;
};
/**
 * Identifies high-value targets in campaign.
 *
 * @param {CampaignTarget[]} targets - All targets
 * @returns {CampaignTarget[]} High-value targets
 *
 * @example
 * ```typescript
 * const hvts = identifyHighValueTargets(targets);
 * // Returns targets with critical impact or significant data exfiltration
 * ```
 */
export declare const identifyHighValueTargets: (targets: CampaignTarget[]) => CampaignTarget[];
/**
 * Calculates comprehensive campaign impact.
 *
 * @param {CampaignTarget[]} targets - Campaign targets
 * @param {CampaignEvent[]} events - Campaign events
 * @returns {CampaignImpact} Impact assessment
 *
 * @example
 * ```typescript
 * const impact = calculateCampaignImpact(targets, events);
 * // Result: { financialImpact: {...}, dataImpact: {...}, overallSeverity: 'high' }
 * ```
 */
export declare const calculateCampaignImpact: (targets: CampaignTarget[], events: CampaignEvent[]) => CampaignImpact;
/**
 * Estimates financial impact of campaign.
 *
 * @param {CampaignTarget[]} targets - Compromised targets
 * @param {number} avgCostPerIncident - Average cost per incident
 * @returns {number} Estimated financial loss
 *
 * @example
 * ```typescript
 * const loss = estimateFinancialImpact(targets, 150000);
 * // Result: 2250000 (15 targets * $150,000)
 * ```
 */
export declare const estimateFinancialImpact: (targets: CampaignTarget[], avgCostPerIncident: number) => number;
/**
 * Assesses data breach severity and scope.
 *
 * @param {CampaignTarget[]} targets - Campaign targets
 * @returns {{ severity: string; recordsAffected: number; dataTypes: string[] }}
 *
 * @example
 * ```typescript
 * const assessment = assessDataBreachSeverity(targets);
 * // Result: { severity: 'high', recordsAffected: 50000, dataTypes: ['PII', 'PHI'] }
 * ```
 */
export declare const assessDataBreachSeverity: (targets: CampaignTarget[]) => {
    severity: string;
    recordsAffected: number;
    dataTypes: string[];
};
/**
 * Attributes campaign to threat actor with confidence scoring.
 *
 * @param {string} campaignId - Campaign ID
 * @param {string} actorId - Actor ID
 * @param {string[]} matchedTTPs - Matched MITRE ATT&CK IDs
 * @param {string[]} matchedInfra - Matched infrastructure
 * @returns {CampaignAttribution} Attribution with confidence score
 *
 * @example
 * ```typescript
 * const attribution = attributeCampaignToActor(
 *   'camp-123',
 *   'apt28',
 *   ['T1566.001', 'T1071.001'],
 *   ['evil.example.com']
 * );
 * // Result: { campaignId: 'camp-123', actorId: 'apt28', confidence: 85, ... }
 * ```
 */
export declare const attributeCampaignToActor: (campaignId: string, actorId: string, matchedTTPs: string[], matchedInfra: string[]) => CampaignAttribution;
/**
 * Calculates attribution confidence from multiple evidence sources.
 *
 * @param {string[]} evidenceTypes - Types of evidence available
 * @param {number} ttpMatchCount - Number of matched TTPs
 * @param {number} infraMatchCount - Number of matched infrastructure
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence(['ttp', 'infrastructure'], 5, 3);
 * // Result: 85
 * ```
 */
export declare const calculateAttributionConfidence: (evidenceTypes: string[], ttpMatchCount: number, infraMatchCount: number) => number;
/**
 * Validates campaign attribution evidence.
 *
 * @param {CampaignAttribution} attribution - Attribution to validate
 * @returns {{ valid: boolean; issues: string[]; confidence: number }}
 *
 * @example
 * ```typescript
 * const validation = validateCampaignAttribution(attribution);
 * // Result: { valid: true, issues: [], confidence: 85 }
 * ```
 */
export declare const validateCampaignAttribution: (attribution: CampaignAttribution) => {
    valid: boolean;
    issues: string[];
    confidence: number;
};
/**
 * Transitions campaign through lifecycle stages.
 *
 * @param {ThreatCampaign} campaign - Campaign to transition
 * @param {ThreatCampaign['status']} newStatus - New status
 * @returns {ThreatCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = transitionCampaignStatus(campaign, 'concluded');
 * ```
 */
export declare const transitionCampaignStatus: (campaign: ThreatCampaign, newStatus: ThreatCampaign["status"]) => ThreatCampaign;
/**
 * Archives concluded campaigns with metadata preservation.
 *
 * @param {ThreatCampaign} campaign - Campaign to archive
 * @returns {ThreatCampaign} Archived campaign
 *
 * @example
 * ```typescript
 * const archived = archiveCampaign(campaign);
 * // Marks campaign as concluded and adds archive metadata
 * ```
 */
export declare const archiveCampaign: (campaign: ThreatCampaign) => ThreatCampaign;
/**
 * Merges related campaigns into single campaign.
 *
 * @param {ThreatCampaign[]} campaigns - Campaigns to merge
 * @returns {ThreatCampaign} Merged campaign
 *
 * @example
 * ```typescript
 * const merged = mergeCampaigns([campaign1, campaign2]);
 * // Combines campaigns, takes earliest detection, latest activity
 * ```
 */
export declare const mergeCampaigns: (campaigns: ThreatCampaign[]) => ThreatCampaign;
/**
 * Identifies temporal patterns in campaign activity.
 *
 * @param {CampaignEvent[]} events - Campaign events
 * @returns {CampaignPattern[]} Identified patterns
 *
 * @example
 * ```typescript
 * const patterns = identifyTemporalPatterns(events);
 * // Result: [{ patternType: 'temporal', description: 'Weekly activity spike', ... }]
 * ```
 */
export declare const identifyTemporalPatterns: (events: CampaignEvent[]) => CampaignPattern[];
/**
 * Identifies geographic patterns in campaign targeting.
 *
 * @param {CampaignTarget[]} targets - Campaign targets
 * @returns {CampaignPattern[]} Geographic patterns
 *
 * @example
 * ```typescript
 * const patterns = identifyGeographicPatterns(targets);
 * ```
 */
export declare const identifyGeographicPatterns: (targets: CampaignTarget[]) => CampaignPattern[];
/**
 * Detects technical patterns in campaign TTPs.
 *
 * @param {string[]} ttps - MITRE ATT&CK IDs
 * @returns {CampaignPattern[]} Technical patterns
 *
 * @example
 * ```typescript
 * const patterns = detectTechnicalPatterns(ttps);
 * ```
 */
export declare const detectTechnicalPatterns: (ttps: string[]) => CampaignPattern[];
/**
 * Correlates campaigns based on multiple factors.
 *
 * @param {ThreatCampaign} campaign1 - First campaign
 * @param {ThreatCampaign} campaign2 - Second campaign
 * @returns {CampaignCorrelation | null} Correlation if found
 *
 * @example
 * ```typescript
 * const correlation = correlateCampaigns(campaign1, campaign2);
 * // Result: { campaign1Id: '...', correlationType: 'shared-ttps', similarityScore: 75 }
 * ```
 */
export declare const correlateCampaigns: (campaign1: ThreatCampaign, campaign2: ThreatCampaign) => CampaignCorrelation | null;
/**
 * Finds related campaigns using correlation analysis.
 *
 * @param {ThreatCampaign} campaign - Source campaign
 * @param {ThreatCampaign[]} allCampaigns - All campaigns to check
 * @param {number} minSimilarity - Minimum similarity score
 * @returns {CampaignCorrelation[]} Related campaigns
 *
 * @example
 * ```typescript
 * const related = findRelatedCampaigns(campaign, allCampaigns, 60);
 * ```
 */
export declare const findRelatedCampaigns: (campaign: ThreatCampaign, allCampaigns: ThreatCampaign[], minSimilarity: number) => CampaignCorrelation[];
/**
 * NestJS provider for campaign management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CampaignManagementProvider {
 *   constructor(
 *     @InjectModel(ThreatCampaign) private campaignModel: typeof ThreatCampaign,
 *     private eventService: CampaignEventService
 *   ) {}
 *
 *   async createCampaign(dto: CreateCampaignDto): Promise<ThreatCampaign> {
 *     const campaign = createThreatCampaign(dto);
 *     validateThreatCampaign(campaign);
 *     return this.campaignModel.create(campaign);
 *   }
 *
 *   async analyzeCampaign(campaignId: string): Promise<CampaignAnalysisReport> {
 *     const campaign = await this.campaignModel.findByPk(campaignId);
 *     const events = await this.eventService.findByCampaign(campaignId);
 *     const timeline = buildCampaignTimeline(events);
 *     const impact = calculateCampaignImpact(campaign.targets, events);
 *
 *     return {
 *       campaign,
 *       timeline,
 *       impact,
 *       threatScore: calculateCampaignThreatScore(campaign, timeline, impact),
 *       generatedAt: new Date()
 *     };
 *   }
 * }
 * ```
 */
export declare const createCampaignManagementProvider: () => string;
/**
 * Sequelize model associations for campaigns.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'threat_campaigns' })
 * export class ThreatCampaignModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column(DataType.STRING)
 *   name: string;
 *
 *   @HasMany(() => CampaignEventModel)
 *   events: CampaignEventModel[];
 *
 *   @HasMany(() => CampaignTargetModel)
 *   targets: CampaignTargetModel[];
 *
 *   @HasMany(() => CampaignIndicatorModel)
 *   indicators: CampaignIndicatorModel[];
 *
 *   @BelongsTo(() => ThreatActorModel, 'attributedActorId')
 *   attributedActor: ThreatActorModel;
 * }
 * ```
 */
export declare const defineCampaignAssociations: () => string;
/**
 * Swagger API endpoints for campaign management.
 *
 * @example
 * ```typescript
 * @ApiTags('Threat Campaigns')
 * @Controller('campaigns')
 * export class CampaignsController {
 *   @Get(':id/timeline')
 *   @ApiOperation({ summary: 'Get campaign timeline analysis' })
 *   async getTimeline(@Param('id') id: string): Promise<CampaignTimeline> {
 *     const events = await this.eventService.findByCampaign(id);
 *     return buildCampaignTimeline(events);
 *   }
 *
 *   @Get(':id/impact')
 *   @ApiOperation({ summary: 'Assess campaign impact' })
 *   async assessImpact(@Param('id') id: string): Promise<CampaignImpact> {
 *     const campaign = await this.service.findById(id);
 *     return calculateCampaignImpact(campaign.targets, campaign.events);
 *   }
 * }
 * ```
 */
export declare const defineCampaignEndpoints: () => string;
/**
 * Generates unique campaign ID.
 *
 * @returns {string} Campaign identifier
 */
export declare const generateCampaignId: () => string;
/**
 * Calculates incident similarity score.
 *
 * @param {CampaignEvent} event1 - First event
 * @param {CampaignEvent} event2 - Second event
 * @returns {number} Similarity score (0-100)
 */
export declare const calculateIncidentSimilarity: (event1: CampaignEvent, event2: CampaignEvent) => number;
/**
 * Calculates campaign threat score.
 */
export declare const calculateCampaignThreatScore: (campaign: ThreatCampaign, timeline: CampaignTimeline, impact: CampaignImpact) => number;
declare const _default: {
    createThreatCampaign: (campaignData: Partial<ThreatCampaign>) => ThreatCampaign;
    validateThreatCampaign: (campaign: ThreatCampaign) => boolean;
    detectCampaignFromIncidents: (incidents: CampaignEvent[], similarityThreshold: number) => ThreatCampaign[];
    updateCampaignActivity: (campaign: ThreatCampaign, event: CampaignEvent) => ThreatCampaign;
    markCampaignDormant: (campaign: ThreatCampaign, inactiveDays: number) => ThreatCampaign;
    buildCampaignTimeline: (events: CampaignEvent[]) => CampaignTimeline;
    identifyCampaignPhases: (events: CampaignEvent[]) => CampaignPhase[];
    determineActivityPattern: (events: CampaignEvent[]) => CampaignTimeline["activityPattern"];
    analyzeCampaignTempo: (events: CampaignEvent[], windowDays: number) => Array<{
        period: string;
        eventCount: number;
        intensity: number;
    }>;
    createCampaignTarget: (targetData: Omit<CampaignTarget, "impactLevel">) => CampaignTarget;
    analyzeTargetingPatterns: (targets: CampaignTarget[]) => {
        sectorDistribution: Record<string, number>;
        geoDistribution: Record<string, number>;
    };
    identifyHighValueTargets: (targets: CampaignTarget[]) => CampaignTarget[];
    calculateCampaignImpact: (targets: CampaignTarget[], events: CampaignEvent[]) => CampaignImpact;
    estimateFinancialImpact: (targets: CampaignTarget[], avgCostPerIncident: number) => number;
    assessDataBreachSeverity: (targets: CampaignTarget[]) => {
        severity: string;
        recordsAffected: number;
        dataTypes: string[];
    };
    attributeCampaignToActor: (campaignId: string, actorId: string, matchedTTPs: string[], matchedInfra: string[]) => CampaignAttribution;
    calculateAttributionConfidence: (evidenceTypes: string[], ttpMatchCount: number, infraMatchCount: number) => number;
    validateCampaignAttribution: (attribution: CampaignAttribution) => {
        valid: boolean;
        issues: string[];
        confidence: number;
    };
    transitionCampaignStatus: (campaign: ThreatCampaign, newStatus: ThreatCampaign["status"]) => ThreatCampaign;
    archiveCampaign: (campaign: ThreatCampaign) => ThreatCampaign;
    mergeCampaigns: (campaigns: ThreatCampaign[]) => ThreatCampaign;
    identifyTemporalPatterns: (events: CampaignEvent[]) => CampaignPattern[];
    identifyGeographicPatterns: (targets: CampaignTarget[]) => CampaignPattern[];
    detectTechnicalPatterns: (ttps: string[]) => CampaignPattern[];
    correlateCampaigns: (campaign1: ThreatCampaign, campaign2: ThreatCampaign) => CampaignCorrelation | null;
    findRelatedCampaigns: (campaign: ThreatCampaign, allCampaigns: ThreatCampaign[], minSimilarity: number) => CampaignCorrelation[];
    createCampaignManagementProvider: () => string;
    defineCampaignAssociations: () => string;
    defineCampaignEndpoints: () => string;
    generateCampaignId: () => string;
    calculateCampaignThreatScore: (campaign: ThreatCampaign, timeline: CampaignTimeline, impact: CampaignImpact) => number;
};
export default _default;
//# sourceMappingURL=threat-campaigns-kit.d.ts.map