/**
 * LOC: THOK1234567
 * File: /reuse/threat/threat-hunting-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x ORM
 *   - NestJS 10.x framework
 *   - TypeScript 5.x type definitions
 *
 * DOWNSTREAM (imported by):
 *   - Threat hunting service modules
 *   - Security operations controllers
 *   - Hunt campaign orchestration
 *   - IOC detection services
 */
/**
 * File: /reuse/threat/threat-hunting-operations-kit.ts
 * Locator: WC-SEC-THOK-001
 * Purpose: Comprehensive Threat Hunting Operations - Proactive threat detection, hypothesis testing, IOC hunting, behavioral analytics
 *
 * Upstream: Sequelize models for hunt campaigns, IOC detections, behavioral analytics, threat discoveries
 * Downstream: ../backend/security/*, threat hunting modules, SOC operations, incident response
 * Dependencies: TypeScript 5.x, Sequelize 6.x, NestJS 10.x, Swagger/OpenAPI
 * Exports: 48 utility functions for threat hunting campaigns, IOC detection, hypothesis validation, behavioral analysis
 *
 * LLM Context: Production-ready threat hunting operations toolkit for White Cross healthcare platform.
 * Provides comprehensive proactive threat detection, hypothesis-driven hunting, IOC tracking, behavioral anomaly
 * detection, threat discovery workflows, and hunt reporting for advanced security operations and HIPAA compliance.
 */
import { WhereOptions, Transaction } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
interface HuntCampaign {
    id: string;
    name: string;
    description: string;
    hypothesis: string;
    huntType: 'proactive' | 'reactive' | 'intelligence_driven' | 'compliance';
    status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    scope: string[];
    startDate: Date;
    endDate?: Date;
    hunterId: string;
    teamMembers: string[];
    dataSource: string[];
    createdAt: Date;
    updatedAt: Date;
}
interface HuntHypothesis {
    id: string;
    campaignId: string;
    statement: string;
    rationale: string;
    confidence: 'low' | 'medium' | 'high';
    status: 'untested' | 'testing' | 'confirmed' | 'refuted' | 'inconclusive';
    evidenceRequired: string[];
    testCriteria: Record<string, any>;
    createdBy: string;
    validatedBy?: string;
    validatedAt?: Date;
}
interface IOCIndicator {
    id: string;
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'user_agent' | 'registry_key' | 'file_path';
    value: string;
    source: 'threat_intel' | 'internal' | 'hunt_discovery' | 'partner_sharing';
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    tags: string[];
    tlp: 'white' | 'green' | 'amber' | 'red';
    context: Record<string, any>;
}
interface ThreatDiscovery {
    id: string;
    campaignId: string;
    hunterId: string;
    discoveryType: 'anomaly' | 'ioc_match' | 'pattern' | 'behavior' | 'correlation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    title: string;
    description: string;
    affectedAssets: string[];
    indicators: string[];
    timeline: Date[];
    mitreTactics: string[];
    mitreTechniques: string[];
    discoveredAt: Date;
    escalatedToIncident: boolean;
    incidentId?: string;
}
interface HuntActivity {
    id: string;
    campaignId: string;
    hunterId: string;
    activityType: 'query' | 'analysis' | 'correlation' | 'validation' | 'documentation';
    description: string;
    dataSource: string;
    queryExecuted?: string;
    resultsCount?: number;
    findings: Record<string, any>;
    timestamp: Date;
}
interface BehavioralAnomaly {
    id: string;
    entityType: 'user' | 'device' | 'application' | 'network';
    entityId: string;
    anomalyType: 'statistical' | 'ml_detected' | 'rule_based' | 'peer_deviation';
    metric: string;
    baselineValue: number;
    observedValue: number;
    deviationScore: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: Date;
    context: Record<string, any>;
}
interface HuntMetrics {
    campaignId: string;
    duration: number;
    queriesExecuted: number;
    dataSources: number;
    discoveryCount: number;
    falsePositiveRate: number;
    incidentsGenerated: number;
    timeToDiscovery: number;
    hunterEfficiency: number;
}
interface IOCHuntResult {
    iocId: string;
    matchCount: number;
    firstMatch: Date;
    lastMatch: Date;
    affectedSystems: string[];
    matchDetails: Array<{
        timestamp: Date;
        source: string;
        context: Record<string, any>;
    }>;
}
/**
 * 1. Creates a new threat hunting campaign with hypothesis.
 *
 * @param {ModelCtor<Model>} CampaignModel - Hunt campaign model
 * @param {Partial<HuntCampaign>} campaignData - Campaign configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = await createHuntCampaign(HuntCampaign, {
 *   name: 'Lateral Movement Detection - Q2 2024',
 *   hypothesis: 'Adversaries using compromised credentials for lateral movement',
 *   huntType: 'proactive',
 *   priority: 'high',
 *   scope: ['windows_logs', 'network_traffic', 'authentication'],
 *   hunterId: 'hunter-123',
 *   dataSource: ['siem', 'edr', 'ad_logs']
 * });
 * ```
 */
export declare const createHuntCampaign: (CampaignModel: ModelCtor<Model>, campaignData: Partial<HuntCampaign>, transaction?: Transaction) => Promise<any>;
/**
 * 2. Retrieves active hunt campaigns with progress metrics.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active campaigns with metrics
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveHuntCampaigns(
 *   HuntCampaign,
 *   HuntActivity,
 *   ThreatDiscovery,
 *   { priority: 'high' }
 * );
 * ```
 */
export declare const getActiveHuntCampaigns: (CampaignModel: ModelCtor<Model>, ActivityModel: ModelCtor<Model>, DiscoveryModel: ModelCtor<Model>, filters?: WhereOptions) => Promise<any[]>;
/**
 * 3. Updates hunt campaign status with validation.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string} newStatus - New status
 * @param {string} [notes] - Status change notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Update success
 *
 * @example
 * ```typescript
 * await updateCampaignStatus(
 *   HuntCampaign,
 *   'campaign-123',
 *   'active',
 *   'Hypothesis validated, beginning active hunting'
 * );
 * ```
 */
export declare const updateCampaignStatus: (CampaignModel: ModelCtor<Model>, campaignId: string, newStatus: HuntCampaign["status"], notes?: string, transaction?: Transaction) => Promise<boolean>;
/**
 * 4. Assigns hunters to a campaign with role specification.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} hunterIds - Array of hunter user IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Assignment success
 *
 * @example
 * ```typescript
 * await assignHuntersToCampaign(
 *   HuntCampaign,
 *   'campaign-123',
 *   ['hunter-1', 'hunter-2', 'hunter-3']
 * );
 * ```
 */
export declare const assignHuntersToCampaign: (CampaignModel: ModelCtor<Model>, campaignId: string, hunterIds: string[], transaction?: Transaction) => Promise<boolean>;
/**
 * 5. Retrieves hunt campaign timeline and activity history.
 *
 * @param {ModelCtor<Model>} ActivityModel - Hunt activity model
 * @param {string} campaignId - Campaign identifier
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<any[]>} Campaign timeline
 *
 * @example
 * ```typescript
 * const timeline = await getCampaignTimeline(
 *   HuntActivity,
 *   'campaign-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const getCampaignTimeline: (ActivityModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, campaignId: string, startDate?: Date, endDate?: Date) => Promise<any[]>;
/**
 * 6. Creates a threat hunting hypothesis for testing.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @param {Partial<HuntHypothesis>} hypothesisData - Hypothesis details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created hypothesis
 *
 * @example
 * ```typescript
 * const hypothesis = await createHuntHypothesis(HuntHypothesis, 'campaign-123', {
 *   statement: 'Attackers using living-off-the-land binaries for persistence',
 *   rationale: 'Recent intel suggests APT group using LOLBins in healthcare sector',
 *   confidence: 'medium',
 *   evidenceRequired: ['process_execution', 'command_line', 'parent_process'],
 *   testCriteria: { binaries: ['certutil', 'bitsadmin', 'mshta'] }
 * });
 * ```
 */
export declare const createHuntHypothesis: (HypothesisModel: ModelCtor<Model>, campaignId: string, hypothesisData: Partial<HuntHypothesis>, transaction?: Transaction) => Promise<any>;
/**
 * 7. Validates and updates hypothesis status based on evidence.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} hypothesisId - Hypothesis identifier
 * @param {string} newStatus - Validation result status
 * @param {string} validatorId - User ID of validator
 * @param {string} [notes] - Validation notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated hypothesis
 *
 * @example
 * ```typescript
 * await validateHypothesis(
 *   HuntHypothesis,
 *   'hyp-123',
 *   'confirmed',
 *   'analyst-456',
 *   'Evidence found in 15 endpoints matching hypothesis criteria'
 * );
 * ```
 */
export declare const validateHypothesis: (HypothesisModel: ModelCtor<Model>, hypothesisId: string, newStatus: HuntHypothesis["status"], validatorId: string, notes?: string, transaction?: Transaction) => Promise<any>;
/**
 * 8. Retrieves all hypotheses for a campaign with validation status.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Campaign hypotheses
 *
 * @example
 * ```typescript
 * const hypotheses = await getCampaignHypotheses(HuntHypothesis, 'campaign-123');
 * ```
 */
export declare const getCampaignHypotheses: (HypothesisModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 9. Generates hypothesis test plan with required queries.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} hypothesisId - Hypothesis identifier
 * @returns {Promise<any>} Test plan with queries
 *
 * @example
 * ```typescript
 * const testPlan = await generateHypothesisTestPlan(HuntHypothesis, 'hyp-123');
 * // Returns structured test plan with data sources and queries
 * ```
 */
export declare const generateHypothesisTestPlan: (HypothesisModel: ModelCtor<Model>, hypothesisId: string) => Promise<any>;
/**
 * 10. Tracks hypothesis confidence evolution over time.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Confidence trends
 *
 * @example
 * ```typescript
 * const trends = await trackHypothesisConfidence(HuntHypothesis, 'campaign-123');
 * ```
 */
export declare const trackHypothesisConfidence: (HypothesisModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 11. Creates or updates an IOC indicator.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {Partial<IOCIndicator>} iocData - IOC details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created or updated IOC
 *
 * @example
 * ```typescript
 * const ioc = await upsertIOCIndicator(IOCIndicator, {
 *   type: 'ip',
 *   value: '192.168.100.50',
 *   source: 'threat_intel',
 *   severity: 'high',
 *   confidence: 85,
 *   tags: ['malware', 'c2', 'apt28'],
 *   tlp: 'amber'
 * });
 * ```
 */
export declare const upsertIOCIndicator: (IOCModel: ModelCtor<Model>, iocData: Partial<IOCIndicator>, transaction?: Transaction) => Promise<any>;
/**
 * 12. Executes IOC sweep across specified data sources.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} iocIds - IOC identifiers to hunt
 * @param {string[]} dataSources - Data sources to search
 * @param {Date} startTime - Search start time
 * @param {Date} endTime - Search end time
 * @returns {Promise<IOCHuntResult[]>} Hunt results
 *
 * @example
 * ```typescript
 * const results = await executeIOCSweep(
 *   sequelize,
 *   ['ioc-1', 'ioc-2'],
 *   ['network_logs', 'proxy_logs', 'dns_logs'],
 *   new Date('2024-01-01'),
 *   new Date()
 * );
 * ```
 */
export declare const executeIOCSweep: (sequelize: any, iocIds: string[], dataSources: string[], startTime: Date, endTime: Date) => Promise<IOCHuntResult[]>;
/**
 * 13. Enriches IOCs with threat intelligence context.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - IOC identifier
 * @param {Record<string, any>} enrichmentData - Enrichment information
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Enriched IOC
 *
 * @example
 * ```typescript
 * await enrichIOCWithIntelligence(IOCIndicator, 'ioc-123', {
 *   threatActor: 'APT28',
 *   campaigns: ['Operation XYZ'],
 *   malwareFamily: 'Emotet',
 *   firstSeenWild: '2023-11-15',
 *   geolocation: { country: 'RU', city: 'Moscow' }
 * });
 * ```
 */
export declare const enrichIOCWithIntelligence: (IOCModel: ModelCtor<Model>, iocId: string, enrichmentData: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * 14. Correlates multiple IOCs to identify related indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - Source IOC identifier
 * @param {number} [confidenceThreshold=60] - Minimum confidence for correlation
 * @returns {Promise<any[]>} Related IOCs
 *
 * @example
 * ```typescript
 * const relatedIOCs = await correlateRelatedIOCs(IOCIndicator, 'ioc-123', 70);
 * // Returns IOCs likely related to the same threat
 * ```
 */
export declare const correlateRelatedIOCs: (IOCModel: ModelCtor<Model>, iocId: string, confidenceThreshold?: number) => Promise<any[]>;
/**
 * 15. Tracks IOC aging and deprecates stale indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {number} staleDays - Days since last seen to consider stale
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of deprecated IOCs
 *
 * @example
 * ```typescript
 * const deprecated = await deprecateStaleIOCs(IOCIndicator, 90);
 * // Deprecates IOCs not seen in 90 days
 * ```
 */
export declare const deprecateStaleIOCs: (IOCModel: ModelCtor<Model>, staleDays: number, transaction?: Transaction) => Promise<number>;
/**
 * 16. Detects statistical anomalies in entity behavior.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity identifier
 * @param {string} metric - Metric to analyze
 * @param {number} daysLookback - Historical period for baseline
 * @returns {Promise<BehavioralAnomaly[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectBehavioralAnomalies(
 *   sequelize,
 *   'user',
 *   'user-123',
 *   'login_count',
 *   30
 * );
 * ```
 */
export declare const detectBehavioralAnomalies: (sequelize: any, entityType: string, entityId: string, metric: string, daysLookback: number) => Promise<BehavioralAnomaly[]>;
/**
 * 17. Identifies peer group deviations in behavior patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {string} peerGroupAttribute - Attribute defining peer group
 * @param {string} metric - Metric to compare
 * @returns {Promise<any>} Peer deviation analysis
 *
 * @example
 * ```typescript
 * const deviation = await analyzePeerGroupDeviation(
 *   sequelize,
 *   'user-123',
 *   'department',
 *   'data_access_volume'
 * );
 * ```
 */
export declare const analyzePeerGroupDeviation: (sequelize: any, entityId: string, peerGroupAttribute: string, metric: string) => Promise<any>;
/**
 * 18. Builds behavioral baseline profile for an entity.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity identifier
 * @param {number} baselineDays - Days to use for baseline
 * @returns {Promise<any>} Behavioral baseline profile
 *
 * @example
 * ```typescript
 * const baseline = await buildBehavioralBaseline(
 *   sequelize,
 *   'user',
 *   'user-123',
 *   90
 * );
 * ```
 */
export declare const buildBehavioralBaseline: (sequelize: any, entityType: string, entityId: string, baselineDays: number) => Promise<any>;
/**
 * 19. Detects unusual time-based access patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any[]>} Unusual time patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectUnusualTimingPatterns(sequelize, 'user-123', 30);
 * // Detects access at unusual hours
 * ```
 */
export declare const detectUnusualTimingPatterns: (sequelize: any, entityId: string, daysLookback: number) => Promise<any[]>;
/**
 * 20. Identifies anomalous data exfiltration patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {number} thresholdGB - Data volume threshold in GB
 * @returns {Promise<any[]>} Potential exfiltration events
 *
 * @example
 * ```typescript
 * const exfiltration = await detectDataExfiltrationPatterns(
 *   sequelize,
 *   'user-123',
 *   5 // Alert if >5GB transferred
 * );
 * ```
 */
export declare const detectDataExfiltrationPatterns: (sequelize: any, entityId: string, thresholdGB: number) => Promise<any[]>;
/**
 * 21. Creates a threat discovery record.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Threat discovery model
 * @param {string} campaignId - Campaign identifier
 * @param {Partial<ThreatDiscovery>} discoveryData - Discovery details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created discovery
 *
 * @example
 * ```typescript
 * const discovery = await createThreatDiscovery(ThreatDiscovery, 'campaign-123', {
 *   hunterId: 'hunter-456',
 *   discoveryType: 'ioc_match',
 *   severity: 'high',
 *   confidence: 85,
 *   title: 'Suspicious PowerShell execution with encoded commands',
 *   description: 'Detected Base64 encoded PowerShell commands matching APT pattern',
 *   affectedAssets: ['WS-001', 'WS-045', 'WS-089'],
 *   mitreTactics: ['TA0002'],
 *   mitreTechniques: ['T1059.001', 'T1027']
 * });
 * ```
 */
export declare const createThreatDiscovery: (DiscoveryModel: ModelCtor<Model>, campaignId: string, discoveryData: Partial<ThreatDiscovery>, transaction?: Transaction) => Promise<any>;
/**
 * 22. Escalates threat discovery to security incident.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {ModelCtor<Model>} IncidentModel - Incident model
 * @param {string} discoveryId - Discovery identifier
 * @param {string} analystId - Analyst escalating
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created incident
 *
 * @example
 * ```typescript
 * const incident = await escalateDiscoveryToIncident(
 *   ThreatDiscovery,
 *   SecurityIncident,
 *   'discovery-123',
 *   'analyst-456'
 * );
 * ```
 */
export declare const escalateDiscoveryToIncident: (DiscoveryModel: ModelCtor<Model>, IncidentModel: ModelCtor<Model>, discoveryId: string, analystId: string, transaction?: Transaction) => Promise<any>;
/**
 * 23. Retrieves all discoveries for a campaign with filtering.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {string} campaignId - Campaign identifier
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Campaign discoveries
 *
 * @example
 * ```typescript
 * const discoveries = await getCampaignDiscoveries(
 *   ThreatDiscovery,
 *   'campaign-123',
 *   { severity: { [Op.in]: ['high', 'critical'] } }
 * );
 * ```
 */
export declare const getCampaignDiscoveries: (DiscoveryModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, campaignId: string, filters?: WhereOptions) => Promise<any[]>;
/**
 * 24. Analyzes discovery patterns to identify trends.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any[]>} Discovery trends
 *
 * @example
 * ```typescript
 * const trends = await analyzeDiscoveryTrends(
 *   ThreatDiscovery,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const analyzeDiscoveryTrends: (DiscoveryModel: ModelCtor<Model>, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * 25. Links related discoveries for correlation analysis.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {string} discoveryId - Source discovery ID
 * @param {number} [correlationThreshold=70] - Minimum correlation score
 * @returns {Promise<any[]>} Related discoveries
 *
 * @example
 * ```typescript
 * const related = await correlateRelatedDiscoveries(
 *   ThreatDiscovery,
 *   'discovery-123',
 *   75
 * );
 * ```
 */
export declare const correlateRelatedDiscoveries: (DiscoveryModel: ModelCtor<Model>, discoveryId: string, correlationThreshold?: number) => Promise<any[]>;
/**
 * 26. Logs hunt activity with query and results.
 *
 * @param {ModelCtor<Model>} ActivityModel - Hunt activity model
 * @param {string} campaignId - Campaign identifier
 * @param {string} hunterId - Hunter user ID
 * @param {Partial<HuntActivity>} activityData - Activity details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Logged activity
 *
 * @example
 * ```typescript
 * await logHuntActivity(HuntActivity, 'campaign-123', 'hunter-456', {
 *   activityType: 'query',
 *   description: 'Searching for suspicious PowerShell execution',
 *   dataSource: 'siem',
 *   queryExecuted: 'index=endpoint EventCode=4688 | search process="powershell.exe"',
 *   resultsCount: 247
 * });
 * ```
 */
export declare const logHuntActivity: (ActivityModel: ModelCtor<Model>, campaignId: string, hunterId: string, activityData: Partial<HuntActivity>, transaction?: Transaction) => Promise<any>;
/**
 * 27. Retrieves hunter productivity metrics.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} hunterId - Hunter user ID
 * @param {Date} startDate - Metrics start date
 * @param {Date} endDate - Metrics end date
 * @returns {Promise<any>} Productivity metrics
 *
 * @example
 * ```typescript
 * const metrics = await getHunterProductivityMetrics(
 *   HuntActivity,
 *   'hunter-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const getHunterProductivityMetrics: (ActivityModel: ModelCtor<Model>, DiscoveryModel: ModelCtor<Model>, hunterId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 28. Analyzes query effectiveness across data sources.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Data source effectiveness
 *
 * @example
 * ```typescript
 * const effectiveness = await analyzeQueryEffectiveness(
 *   HuntActivity,
 *   'campaign-123'
 * );
 * ```
 */
export declare const analyzeQueryEffectiveness: (ActivityModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 29. Generates hunt activity summary report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Activity summary
 *
 * @example
 * ```typescript
 * const summary = await generateActivitySummary(sequelize, 'campaign-123');
 * ```
 */
export declare const generateActivitySummary: (sequelize: any, campaignId: string) => Promise<any>;
/**
 * 30. Tracks temporal patterns in hunt activities.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Temporal activity patterns
 *
 * @example
 * ```typescript
 * const patterns = await trackActivityTemporalPatterns(
 *   HuntActivity,
 *   'campaign-123'
 * );
 * ```
 */
export declare const trackActivityTemporalPatterns: (ActivityModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 31. Calculates comprehensive hunt campaign metrics.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<HuntMetrics>} Campaign metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateHuntCampaignMetrics(sequelize, 'campaign-123');
 * ```
 */
export declare const calculateHuntCampaignMetrics: (sequelize: any, campaignId: string) => Promise<HuntMetrics>;
/**
 * 32. Generates executive summary report for hunt campaign.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateHuntExecutiveSummary(sequelize, 'campaign-123');
 * ```
 */
export declare const generateHuntExecutiveSummary: (sequelize: any, campaignId: string) => Promise<any>;
/**
 * 33. Compares hunt campaigns for benchmarking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} campaignIds - Campaign identifiers to compare
 * @returns {Promise<any[]>} Comparative metrics
 *
 * @example
 * ```typescript
 * const comparison = await compareHuntCampaigns(
 *   sequelize,
 *   ['campaign-1', 'campaign-2', 'campaign-3']
 * );
 * ```
 */
export declare const compareHuntCampaigns: (sequelize: any, campaignIds: string[]) => Promise<any[]>;
/**
 * 34. Generates MITRE ATT&CK coverage report from discoveries.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} MITRE coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await generateMITRECoverageReport(
 *   ThreatDiscovery,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const generateMITRECoverageReport: (DiscoveryModel: ModelCtor<Model>, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 35. Tracks hunt campaign ROI based on threat prevention.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {number} campaignCost - Campaign operational cost
 * @returns {Promise<any>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateHuntCampaignROI(sequelize, 'campaign-123', 25000);
 * ```
 */
export declare const calculateHuntCampaignROI: (sequelize: any, campaignId: string, campaignCost: number) => Promise<any>;
/**
 * 36. Initiates automated IOC enrichment workflow.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - IOC identifier
 * @param {string[]} enrichmentSources - Enrichment APIs/sources
 * @returns {Promise<any>} Enrichment results
 *
 * @example
 * ```typescript
 * const enriched = await initiateIOCEnrichment(
 *   IOCIndicator,
 *   'ioc-123',
 *   ['virustotal', 'abuseipdb', 'threatfox']
 * );
 * ```
 */
export declare const initiateIOCEnrichment: (IOCModel: ModelCtor<Model>, iocId: string, enrichmentSources: string[]) => Promise<any>;
/**
 * 37. Orchestrates multi-phase hunt workflow.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} phases - Hunt phases to execute
 * @returns {Promise<any>} Workflow execution status
 *
 * @example
 * ```typescript
 * const workflow = await orchestrateHuntWorkflow(
 *   sequelize,
 *   'campaign-123',
 *   ['reconnaissance', 'hypothesis_testing', 'validation', 'documentation']
 * );
 * ```
 */
export declare const orchestrateHuntWorkflow: (sequelize: any, campaignId: string, phases: string[]) => Promise<any>;
/**
 * 38. Generates automated hunt playbook from template.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} playbookTemplate - Template identifier
 * @param {Record<string, any>} parameters - Playbook parameters
 * @returns {Promise<any>} Generated playbook
 *
 * @example
 * ```typescript
 * const playbook = await generateHuntPlaybook(
 *   sequelize,
 *   'lateral_movement_detection',
 *   { scope: 'windows_domain', sensitivity: 'high' }
 * );
 * ```
 */
export declare const generateHuntPlaybook: (sequelize: any, playbookTemplate: string, parameters: Record<string, any>) => Promise<any>;
/**
 * 39. Schedules recurring hunt campaigns.
 *
 * @param {ModelCtor<Model>} ScheduleModel - Hunt schedule model
 * @param {string} playbookId - Playbook identifier
 * @param {string} cronExpression - Cron schedule
 * @param {Record<string, any>} config - Schedule configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleRecurringHunt(
 *   HuntSchedule,
 *   'playbook-123',
 *   '0 0 * * 1', // Every Monday at midnight
 *   { autoStart: true, notifyOnCompletion: true }
 * );
 * ```
 */
export declare const scheduleRecurringHunt: (ScheduleModel: ModelCtor<Model>, playbookId: string, cronExpression: string, config: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * 40. Performs automated triage of hunt discoveries.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} discoveryId - Discovery identifier
 * @returns {Promise<any>} Triage assessment
 *
 * @example
 * ```typescript
 * const triage = await automatedDiscoveryTriage(sequelize, 'discovery-123');
 * ```
 */
export declare const automatedDiscoveryTriage: (sequelize: any, discoveryId: string) => Promise<any>;
/**
 * 41. Correlates hunt findings with threat intelligence feeds.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} discoveryId - Discovery identifier
 * @returns {Promise<any[]>} Intelligence correlations
 *
 * @example
 * ```typescript
 * const intel = await correlateWithThreatIntel(sequelize, 'discovery-123');
 * ```
 */
export declare const correlateWithThreatIntel: (sequelize: any, discoveryId: string) => Promise<any[]>;
/**
 * 42. Generates threat actor attribution analysis.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Attribution analysis
 *
 * @example
 * ```typescript
 * const attribution = await generateThreatActorAttribution(
 *   sequelize,
 *   'campaign-123'
 * );
 * ```
 */
export declare const generateThreatActorAttribution: (sequelize: any, campaignId: string) => Promise<any[]>;
/**
 * 43. Tracks emerging threat patterns across campaigns.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {number} daysLookback - Period to analyze
 * @param {number} threshold - Minimum occurrences to flag
 * @returns {Promise<any[]>} Emerging patterns
 *
 * @example
 * ```typescript
 * const patterns = await identifyEmergingThreats(
 *   ThreatDiscovery,
 *   30,
 *   5
 * );
 * ```
 */
export declare const identifyEmergingThreats: (DiscoveryModel: ModelCtor<Model>, daysLookback: number, threshold: number) => Promise<any[]>;
/**
 * 44. Generates threat landscape summary report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Threat landscape overview
 *
 * @example
 * ```typescript
 * const landscape = await generateThreatLandscapeSummary(
 *   sequelize,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const generateThreatLandscapeSummary: (sequelize: any, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 45. Validates IOC freshness and updates staleness indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {number} freshnessThresholdDays - Days to consider IOC fresh
 * @returns {Promise<any>} Freshness validation results
 *
 * @example
 * ```typescript
 * const validation = await validateIOCFreshness(IOCIndicator, 30);
 * ```
 */
export declare const validateIOCFreshness: (IOCModel: ModelCtor<Model>, freshnessThresholdDays: number) => Promise<any>;
/**
 * 46. Generates hunt coverage gap analysis.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} expectedTactics - Expected MITRE tactics coverage
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any>} Coverage gaps
 *
 * @example
 * ```typescript
 * const gaps = await analyzeHuntCoverageGaps(
 *   sequelize,
 *   ['TA0001', 'TA0002', 'TA0003', 'TA0004', 'TA0005'],
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const analyzeHuntCoverageGaps: (sequelize: any, expectedTactics: string[], startDate: Date, endDate: Date) => Promise<any>;
/**
 * 47. Identifies hunt efficiency optimization opportunities.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimizations = await identifyHuntOptimizations(sequelize, 'campaign-123');
 * ```
 */
export declare const identifyHuntOptimizations: (sequelize: any, campaignId: string) => Promise<any>;
/**
 * 48. Generates comprehensive hunt after-action report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} After-action report
 *
 * @example
 * ```typescript
 * const aar = await generateHuntAfterActionReport(sequelize, 'campaign-123');
 * ```
 */
export declare const generateHuntAfterActionReport: (sequelize: any, campaignId: string) => Promise<any>;
export {};
//# sourceMappingURL=threat-hunting-operations-kit.d.ts.map