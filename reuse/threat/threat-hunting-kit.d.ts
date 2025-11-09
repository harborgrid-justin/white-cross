/**
 * LOC: THTK1234567
 * File: /reuse/threat/threat-hunting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat hunting services
 *   - SIEM/EDR integrations
 *   - Security analytics platforms
 */
/**
 * File: /reuse/threat/threat-hunting-kit.ts
 * Locator: WC-UTL-THTK-001
 * Purpose: Comprehensive Threat Hunting Toolkit - Hypothesis-driven hunting, query builders, campaign management, anomaly detection
 *
 * Upstream: Independent utility module for proactive threat hunting
 * Downstream: ../backend/security/*, threat hunting services, SIEM integrations, analytics APIs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Swagger/OpenAPI
 * Exports: 45 utility functions for hunt queries, campaigns, anomaly detection, scoring, automation, pattern libraries
 *
 * LLM Context: Production-grade threat hunting utilities for White Cross security operations.
 * Provides hypothesis-driven hunting frameworks, advanced query builders, hunt campaign management,
 * behavioral anomaly detection, result scoring and prioritization, hunt automation, and integration
 * with SIEM/EDR platforms for proactive threat discovery.
 */
interface HuntHypothesis {
    id: string;
    name: string;
    description: string;
    category: 'apt' | 'insider_threat' | 'malware' | 'data_exfiltration' | 'lateral_movement' | 'persistence' | 'other';
    severity: 'critical' | 'high' | 'medium' | 'low';
    mitreTactics: string[];
    mitreTechniques: string[];
    indicators: string[];
    queries: HuntQuery[];
    expectedEvidence: string[];
    falsePositivePotential: 'high' | 'medium' | 'low';
    createdBy: string;
    createdAt: Date;
}
interface HuntQuery {
    id: string;
    name: string;
    platform: 'splunk' | 'elastic' | 'sentinel' | 'chronicle' | 'crowdstrike' | 'custom';
    queryLanguage: 'spl' | 'kql' | 'lucene' | 'sql' | 'yara' | 'sigma';
    queryText: string;
    timeRange: TimeRange;
    fields: string[];
    filters: Record<string, unknown>;
    thresholds?: QueryThreshold;
}
interface TimeRange {
    start: Date | string;
    end: Date | string;
    relativeTime?: string;
}
interface QueryThreshold {
    field: string;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne';
    value: number | string;
}
interface HuntCampaign {
    id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
    hypotheses: HuntHypothesis[];
    startDate: Date;
    endDate?: Date;
    hunters: string[];
    findings: HuntFinding[];
    metrics: CampaignMetrics;
    tags: string[];
}
interface HuntFinding {
    id: string;
    campaignId: string;
    hypothesisId: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    confidence: number;
    title: string;
    description: string;
    evidence: EvidenceData[];
    affectedAssets: string[];
    indicators: string[];
    mitreTactics: string[];
    mitreTechniques: string[];
    recommendedActions: string[];
    status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
    assignedTo?: string;
    discoveredAt: Date;
    updatedAt: Date;
}
interface EvidenceData {
    type: 'log' | 'alert' | 'network_flow' | 'file' | 'registry' | 'process' | 'other';
    source: string;
    timestamp: Date;
    data: Record<string, unknown>;
    relevanceScore: number;
}
interface CampaignMetrics {
    hypothesesTested: number;
    queriesExecuted: number;
    findingsDiscovered: number;
    truePositives: number;
    falsePositives: number;
    assetsAnalyzed: number;
    dataProcessed: number;
    huntingHours: number;
    efficiency: number;
}
interface AnomalyDetectionConfig {
    algorithm: 'statistical' | 'ml_based' | 'behavioral' | 'threshold';
    sensitivity: 'high' | 'medium' | 'low';
    baselinePeriod: number;
    detectionWindow: number;
    features: string[];
    thresholds: Record<string, number>;
}
interface Anomaly {
    id: string;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    score: number;
    entity: string;
    feature: string;
    baseline: number;
    observed: number;
    deviation: number;
    timestamp: Date;
    context: Record<string, unknown>;
}
interface HuntPattern {
    id: string;
    name: string;
    category: string;
    description: string;
    indicators: string[];
    queries: HuntQuery[];
    falsePositiveRate: number;
    detectionRate: number;
    lastUpdated: Date;
    author: string;
}
interface SIEMIntegration {
    platform: 'splunk' | 'elastic' | 'sentinel' | 'chronicle' | 'qradar';
    endpoint: string;
    apiKey: string;
    maxResults?: number;
    timeout?: number;
}
interface EDRIntegration {
    platform: 'crowdstrike' | 'sentinelone' | 'carbon_black' | 'defender_edr';
    endpoint: string;
    apiKey: string;
    features: string[];
}
/**
 * Creates a new hunt hypothesis.
 *
 * @param {Partial<HuntHypothesis>} hypothesisData - Hypothesis data
 * @returns {HuntHypothesis} Created hypothesis
 *
 * @example
 * ```typescript
 * const hypothesis = createHuntHypothesis({
 *   name: 'Unusual PowerShell Execution',
 *   category: 'malware',
 *   mitreTechniques: ['T1059.001'],
 *   indicators: ['powershell.exe', '-encodedcommand', 'base64']
 * });
 * ```
 */
export declare const createHuntHypothesis: (hypothesisData: Partial<HuntHypothesis>) => HuntHypothesis;
/**
 * Validates hunt hypothesis completeness.
 *
 * @param {HuntHypothesis} hypothesis - Hypothesis to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHypothesis(hypothesis);
 * // Result: { valid: true, errors: [] }
 * ```
 */
export declare const validateHypothesis: (hypothesis: HuntHypothesis) => {
    valid: boolean;
    errors: string[];
};
/**
 * Maps threat activity to MITRE ATT&CK framework.
 *
 * @param {string[]} indicators - Observed indicators
 * @param {string} category - Threat category
 * @returns {{ tactics: string[]; techniques: string[] }} MITRE mapping
 *
 * @example
 * ```typescript
 * const mapping = mapToMitreFramework(['powershell', 'encoded'], 'malware');
 * // Result: { tactics: ['TA0002'], techniques: ['T1059.001'] }
 * ```
 */
export declare const mapToMitreFramework: (indicators: string[], category: string) => {
    tactics: string[];
    techniques: string[];
};
/**
 * Generates hunt queries from hypothesis.
 *
 * @param {HuntHypothesis} hypothesis - Hunt hypothesis
 * @param {string} platform - Target SIEM/EDR platform
 * @returns {HuntQuery[]} Generated queries
 *
 * @example
 * ```typescript
 * const queries = generateQueriesFromHypothesis(hypothesis, 'splunk');
 * // Generates platform-specific hunt queries
 * ```
 */
export declare const generateQueriesFromHypothesis: (hypothesis: HuntHypothesis, platform: string) => HuntQuery[];
/**
 * Builds query from indicators based on platform.
 *
 * @param {string[]} indicators - Threat indicators
 * @param {string} platform - Target platform
 * @returns {string} Query string
 *
 * @example
 * ```typescript
 * const query = buildQueryFromIndicators(['powershell.exe', 'encoded'], 'splunk');
 * // Result: 'index=* sourcetype=windows (powershell.exe OR encoded) | stats count by host'
 * ```
 */
export declare const buildQueryFromIndicators: (indicators: string[], platform: string) => string;
/**
 * Gets query language for platform.
 *
 * @param {string} platform - SIEM/EDR platform
 * @returns {HuntQuery['queryLanguage']} Query language
 *
 * @example
 * ```typescript
 * const lang = getQueryLanguageForPlatform('splunk');
 * // Result: 'spl'
 * ```
 */
export declare const getQueryLanguageForPlatform: (platform: string) => HuntQuery["queryLanguage"];
/**
 * Builds advanced hunt query with filters and aggregations.
 *
 * @param {Partial<HuntQuery>} queryConfig - Query configuration
 * @returns {HuntQuery} Complete hunt query
 *
 * @example
 * ```typescript
 * const query = buildAdvancedHuntQuery({
 *   name: 'Suspicious Network Connections',
 *   platform: 'elastic',
 *   fields: ['src_ip', 'dst_ip', 'dst_port'],
 *   filters: { dst_port: [445, 3389, 22] }
 * });
 * ```
 */
export declare const buildAdvancedHuntQuery: (queryConfig: Partial<HuntQuery>) => HuntQuery;
/**
 * Adds filter to existing hunt query.
 *
 * @param {HuntQuery} query - Existing query
 * @param {string} field - Filter field
 * @param {unknown} value - Filter value
 * @returns {HuntQuery} Updated query
 *
 * @example
 * ```typescript
 * const filtered = addQueryFilter(query, 'event_type', 'process_creation');
 * // Adds event_type filter to query
 * ```
 */
export declare const addQueryFilter: (query: HuntQuery, field: string, value: unknown) => HuntQuery;
/**
 * Combines multiple hunt queries with OR logic.
 *
 * @param {HuntQuery[]} queries - Queries to combine
 * @param {string} platform - Target platform
 * @returns {HuntQuery} Combined query
 *
 * @example
 * ```typescript
 * const combined = combineHuntQueries([query1, query2], 'splunk');
 * // Merges queries with OR operator
 * ```
 */
export declare const combineHuntQueries: (queries: HuntQuery[], platform: string) => HuntQuery;
/**
 * Optimizes hunt query for performance.
 *
 * @param {HuntQuery} query - Query to optimize
 * @returns {HuntQuery} Optimized query
 *
 * @example
 * ```typescript
 * const optimized = optimizeHuntQuery(query);
 * // Adds index hints, limits result size, optimizes filters
 * ```
 */
export declare const optimizeHuntQuery: (query: HuntQuery) => HuntQuery;
/**
 * Converts query between different platform formats.
 *
 * @param {HuntQuery} query - Source query
 * @param {string} targetPlatform - Target platform
 * @returns {HuntQuery} Converted query
 *
 * @example
 * ```typescript
 * const converted = convertQueryFormat(splunkQuery, 'elastic');
 * // Converts SPL to Lucene syntax
 * ```
 */
export declare const convertQueryFormat: (query: HuntQuery, targetPlatform: string) => HuntQuery;
/**
 * Creates a new hunt campaign.
 *
 * @param {Partial<HuntCampaign>} campaignData - Campaign data
 * @returns {HuntCampaign} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = createHuntCampaign({
 *   name: 'APT29 Hunt - Q1 2024',
 *   hypotheses: [hypothesis1, hypothesis2],
 *   hunters: ['analyst1', 'analyst2']
 * });
 * ```
 */
export declare const createHuntCampaign: (campaignData: Partial<HuntCampaign>) => HuntCampaign;
/**
 * Updates hunt campaign status.
 *
 * @param {HuntCampaign} campaign - Campaign to update
 * @param {HuntCampaign['status']} status - New status
 * @returns {HuntCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = updateCampaignStatus(campaign, 'active');
 * // Changes campaign status to active
 * ```
 */
export declare const updateCampaignStatus: (campaign: HuntCampaign, status: HuntCampaign["status"]) => HuntCampaign;
/**
 * Adds finding to hunt campaign.
 *
 * @param {HuntCampaign} campaign - Campaign
 * @param {HuntFinding} finding - New finding
 * @returns {HuntCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = addFindingToCampaign(campaign, newFinding);
 * // Adds finding and updates metrics
 * ```
 */
export declare const addFindingToCampaign: (campaign: HuntCampaign, finding: HuntFinding) => HuntCampaign;
/**
 * Calculates campaign effectiveness metrics.
 *
 * @param {HuntCampaign} campaign - Hunt campaign
 * @returns {Record<string, number>} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCampaignEffectiveness(campaign);
 * // Result: { successRate: 0.75, efficiency: 2.5, precision: 0.8, ... }
 * ```
 */
export declare const calculateCampaignEffectiveness: (campaign: HuntCampaign) => Record<string, number>;
/**
 * Generates campaign summary report.
 *
 * @param {HuntCampaign} campaign - Hunt campaign
 * @returns {Record<string, unknown>} Summary report
 *
 * @example
 * ```typescript
 * const report = generateCampaignReport(campaign);
 * // Comprehensive campaign summary with metrics and findings
 * ```
 */
export declare const generateCampaignReport: (campaign: HuntCampaign) => Record<string, unknown>;
/**
 * Groups findings by severity.
 *
 * @param {HuntFinding[]} findings - Hunt findings
 * @returns {Record<string, number>} Findings grouped by severity
 *
 * @example
 * ```typescript
 * const grouped = groupFindingsBySeverity(findings);
 * // Result: { critical: 2, high: 5, medium: 10, low: 3 }
 * ```
 */
export declare const groupFindingsBySeverity: (findings: HuntFinding[]) => Record<string, number>;
/**
 * Groups findings by status.
 *
 * @param {HuntFinding[]} findings - Hunt findings
 * @returns {Record<string, number>} Findings grouped by status
 *
 * @example
 * ```typescript
 * const grouped = groupFindingsByStatus(findings);
 * // Result: { new: 5, investigating: 3, confirmed: 7, false_positive: 2 }
 * ```
 */
export declare const groupFindingsByStatus: (findings: HuntFinding[]) => Record<string, number>;
/**
 * Configures anomaly detection for hunt.
 *
 * @param {Partial<AnomalyDetectionConfig>} config - Detection configuration
 * @returns {AnomalyDetectionConfig} Complete configuration
 *
 * @example
 * ```typescript
 * const config = configureAnomalyDetection({
 *   algorithm: 'statistical',
 *   sensitivity: 'high',
 *   features: ['login_count', 'data_volume', 'connection_count']
 * });
 * ```
 */
export declare const configureAnomalyDetection: (config: Partial<AnomalyDetectionConfig>) => AnomalyDetectionConfig;
/**
 * Detects anomalies in behavioral data.
 *
 * @param {Record<string, number>[]} data - Behavioral data points
 * @param {AnomalyDetectionConfig} config - Detection configuration
 * @returns {Anomaly[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectBehavioralAnomalies(userLoginData, detectionConfig);
 * // Identifies unusual login patterns
 * ```
 */
export declare const detectBehavioralAnomalies: (data: Record<string, number>[], config: AnomalyDetectionConfig) => Anomaly[];
/**
 * Calculates statistical baseline from values.
 *
 * @param {number[]} values - Data values
 * @returns {number} Baseline value (mean)
 *
 * @example
 * ```typescript
 * const baseline = calculateBaseline([10, 12, 11, 10, 13]);
 * // Result: 11.2
 * ```
 */
export declare const calculateBaseline: (values: number[]) => number;
/**
 * Calculates anomaly detection threshold.
 *
 * @param {number} baseline - Baseline value
 * @param {AnomalyDetectionConfig['sensitivity']} sensitivity - Sensitivity level
 * @returns {number} Detection threshold
 *
 * @example
 * ```typescript
 * const threshold = calculateAnomalyThreshold(100, 'high');
 * // Result: 150 (1.5x baseline for high sensitivity)
 * ```
 */
export declare const calculateAnomalyThreshold: (baseline: number, sensitivity: AnomalyDetectionConfig["sensitivity"]) => number;
/**
 * Categorizes anomaly severity based on deviation.
 *
 * @param {number} deviation - Observed deviation
 * @param {number} threshold - Detection threshold
 * @returns {Anomaly['severity']} Severity level
 *
 * @example
 * ```typescript
 * const severity = categorizeSeverity(500, 100);
 * // Result: 'critical' (5x threshold)
 * ```
 */
export declare const categorizeSeverity: (deviation: number, threshold: number) => Anomaly["severity"];
/**
 * Filters anomalies by confidence score.
 *
 * @param {Anomaly[]} anomalies - Detected anomalies
 * @param {number} minScore - Minimum confidence score
 * @returns {Anomaly[]} Filtered anomalies
 *
 * @example
 * ```typescript
 * const highConfidence = filterAnomaliesByScore(anomalies, 75);
 * // Returns only anomalies with score >= 75
 * ```
 */
export declare const filterAnomaliesByScore: (anomalies: Anomaly[], minScore: number) => Anomaly[];
/**
 * Scores hunt finding based on multiple factors.
 *
 * @param {HuntFinding} finding - Hunt finding
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const score = scoreHuntFinding(finding);
 * // Result: 87 (high risk)
 * ```
 */
export declare const scoreHuntFinding: (finding: HuntFinding) => number;
/**
 * Prioritizes findings based on risk score and context.
 *
 * @param {HuntFinding[]} findings - Hunt findings
 * @returns {HuntFinding[]} Prioritized findings (sorted by priority)
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeFindings(findings);
 * // Sorted by risk score descending
 * ```
 */
export declare const prioritizeFindings: (findings: HuntFinding[]) => HuntFinding[];
/**
 * Calculates finding confidence score.
 *
 * @param {EvidenceData[]} evidence - Evidence items
 * @param {string[]} indicators - Matching indicators
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateFindingConfidence(evidence, indicators);
 * // Result: 85
 * ```
 */
export declare const calculateFindingConfidence: (evidence: EvidenceData[], indicators: string[]) => number;
/**
 * Correlates findings to identify attack campaigns.
 *
 * @param {HuntFinding[]} findings - Hunt findings
 * @param {number} [timeWindow] - Correlation time window in ms
 * @returns {HuntFinding[][]} Correlated finding groups
 *
 * @example
 * ```typescript
 * const campaigns = correlateFindingsToCampaigns(findings, 86400000);
 * // Groups findings within 24-hour windows
 * ```
 */
export declare const correlateFindingsToCampaigns: (findings: HuntFinding[], timeWindow?: number) => HuntFinding[][];
/**
 * Schedules automated hunt execution.
 *
 * @param {HuntQuery} query - Hunt query
 * @param {string} schedule - Cron schedule expression
 * @returns {Record<string, unknown>} Scheduled job details
 *
 * @example
 * ```typescript
 * const job = scheduleAutomatedHunt(query, '0 0 * * *');
 * // Schedules daily hunt execution at midnight
 * ```
 */
export declare const scheduleAutomatedHunt: (query: HuntQuery, schedule: string) => Record<string, unknown>;
/**
 * Calculates next run time from cron expression.
 *
 * @param {string} cronExpression - Cron schedule
 * @returns {Date} Next execution time
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun('0 0 * * *');
 * // Returns next midnight
 * ```
 */
export declare const calculateNextRun: (cronExpression: string) => Date;
/**
 * Executes automated hunt query.
 *
 * @param {HuntQuery} query - Query to execute
 * @param {SIEMIntegration} integration - SIEM integration config
 * @returns {Promise<Record<string, unknown>[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeAutomatedHunt(query, siemConfig);
 * // Executes query against SIEM
 * ```
 */
export declare const executeAutomatedHunt: (query: HuntQuery, integration: SIEMIntegration) => Promise<Record<string, unknown>[]>;
/**
 * Processes automated hunt results.
 *
 * @param {Record<string, unknown>[]} results - Hunt results
 * @param {HuntHypothesis} hypothesis - Related hypothesis
 * @returns {HuntFinding[]} Processed findings
 *
 * @example
 * ```typescript
 * const findings = processAutomatedResults(queryResults, hypothesis);
 * // Converts raw results to structured findings
 * ```
 */
export declare const processAutomatedResults: (results: Record<string, unknown>[], hypothesis: HuntHypothesis) => HuntFinding[];
/**
 * Creates reusable hunt pattern.
 *
 * @param {Partial<HuntPattern>} patternData - Pattern data
 * @returns {HuntPattern} Created pattern
 *
 * @example
 * ```typescript
 * const pattern = createHuntPattern({
 *   name: 'Mimikatz Detection',
 *   category: 'credential_access',
 *   indicators: ['lsass.exe', 'sekurlsa::logonpasswords']
 * });
 * ```
 */
export declare const createHuntPattern: (patternData: Partial<HuntPattern>) => HuntPattern;
/**
 * Searches pattern library by criteria.
 *
 * @param {HuntPattern[]} library - Pattern library
 * @param {Record<string, unknown>} criteria - Search criteria
 * @returns {HuntPattern[]} Matching patterns
 *
 * @example
 * ```typescript
 * const patterns = searchPatternLibrary(library, {
 *   category: 'lateral_movement',
 *   minDetectionRate: 0.7
 * });
 * ```
 */
export declare const searchPatternLibrary: (library: HuntPattern[], criteria: Record<string, unknown>) => HuntPattern[];
/**
 * Updates pattern effectiveness metrics.
 *
 * @param {HuntPattern} pattern - Hunt pattern
 * @param {boolean} truePositive - Whether detection was true positive
 * @returns {HuntPattern} Updated pattern
 *
 * @example
 * ```typescript
 * const updated = updatePatternMetrics(pattern, true);
 * // Adjusts detection and false positive rates
 * ```
 */
export declare const updatePatternMetrics: (pattern: HuntPattern, truePositive: boolean) => HuntPattern;
/**
 * Integrates with SIEM platform.
 *
 * @param {SIEMIntegration} config - SIEM configuration
 * @param {HuntQuery} query - Query to execute
 * @returns {Promise<Record<string, unknown>[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await queryS IEM(splunkConfig, huntQuery);
 * // Executes query against Splunk
 * ```
 */
export declare const querySIEM: (config: SIEMIntegration, query: HuntQuery) => Promise<Record<string, unknown>[]>;
/**
 * Integrates with EDR platform.
 *
 * @param {EDRIntegration} config - EDR configuration
 * @param {string} action - EDR action (isolate, contain, investigate)
 * @param {string[]} hosts - Target hosts
 * @returns {Promise<Record<string, unknown>>} Action result
 *
 * @example
 * ```typescript
 * const result = await performEDRAction(crowdstrikeConfig, 'isolate', ['host1', 'host2']);
 * // Isolates hosts via CrowdStrike
 * ```
 */
export declare const performEDRAction: (config: EDRIntegration, action: string, hosts: string[]) => Promise<Record<string, unknown>>;
/**
 * Enriches hunt findings with threat intelligence.
 *
 * @param {HuntFinding} finding - Hunt finding
 * @param {string[]} tiSources - Threat intel sources
 * @returns {Promise<HuntFinding>} Enriched finding
 *
 * @example
 * ```typescript
 * const enriched = await enrichWithThreatIntel(finding, ['virustotal', 'alienvault']);
 * // Adds threat intel context to finding
 * ```
 */
export declare const enrichWithThreatIntel: (finding: HuntFinding, tiSources: string[]) => Promise<HuntFinding>;
declare const _default: {
    createHuntHypothesis: (hypothesisData: Partial<HuntHypothesis>) => HuntHypothesis;
    validateHypothesis: (hypothesis: HuntHypothesis) => {
        valid: boolean;
        errors: string[];
    };
    mapToMitreFramework: (indicators: string[], category: string) => {
        tactics: string[];
        techniques: string[];
    };
    generateQueriesFromHypothesis: (hypothesis: HuntHypothesis, platform: string) => HuntQuery[];
    buildQueryFromIndicators: (indicators: string[], platform: string) => string;
    getQueryLanguageForPlatform: (platform: string) => HuntQuery["queryLanguage"];
    buildAdvancedHuntQuery: (queryConfig: Partial<HuntQuery>) => HuntQuery;
    addQueryFilter: (query: HuntQuery, field: string, value: unknown) => HuntQuery;
    combineHuntQueries: (queries: HuntQuery[], platform: string) => HuntQuery;
    optimizeHuntQuery: (query: HuntQuery) => HuntQuery;
    convertQueryFormat: (query: HuntQuery, targetPlatform: string) => HuntQuery;
    createHuntCampaign: (campaignData: Partial<HuntCampaign>) => HuntCampaign;
    updateCampaignStatus: (campaign: HuntCampaign, status: HuntCampaign["status"]) => HuntCampaign;
    addFindingToCampaign: (campaign: HuntCampaign, finding: HuntFinding) => HuntCampaign;
    calculateCampaignEffectiveness: (campaign: HuntCampaign) => Record<string, number>;
    generateCampaignReport: (campaign: HuntCampaign) => Record<string, unknown>;
    groupFindingsBySeverity: (findings: HuntFinding[]) => Record<string, number>;
    groupFindingsByStatus: (findings: HuntFinding[]) => Record<string, number>;
    configureAnomalyDetection: (config: Partial<AnomalyDetectionConfig>) => AnomalyDetectionConfig;
    detectBehavioralAnomalies: (data: Record<string, number>[], config: AnomalyDetectionConfig) => Anomaly[];
    calculateBaseline: (values: number[]) => number;
    calculateAnomalyThreshold: (baseline: number, sensitivity: AnomalyDetectionConfig["sensitivity"]) => number;
    categorizeSeverity: (deviation: number, threshold: number) => Anomaly["severity"];
    filterAnomaliesByScore: (anomalies: Anomaly[], minScore: number) => Anomaly[];
    scoreHuntFinding: (finding: HuntFinding) => number;
    prioritizeFindings: (findings: HuntFinding[]) => HuntFinding[];
    calculateFindingConfidence: (evidence: EvidenceData[], indicators: string[]) => number;
    correlateFindingsToCampaigns: (findings: HuntFinding[], timeWindow?: number) => HuntFinding[][];
    scheduleAutomatedHunt: (query: HuntQuery, schedule: string) => Record<string, unknown>;
    calculateNextRun: (cronExpression: string) => Date;
    executeAutomatedHunt: (query: HuntQuery, integration: SIEMIntegration) => Promise<Record<string, unknown>[]>;
    processAutomatedResults: (results: Record<string, unknown>[], hypothesis: HuntHypothesis) => HuntFinding[];
    createHuntPattern: (patternData: Partial<HuntPattern>) => HuntPattern;
    searchPatternLibrary: (library: HuntPattern[], criteria: Record<string, unknown>) => HuntPattern[];
    updatePatternMetrics: (pattern: HuntPattern, truePositive: boolean) => HuntPattern;
    querySIEM: (config: SIEMIntegration, query: HuntQuery) => Promise<Record<string, unknown>[]>;
    performEDRAction: (config: EDRIntegration, action: string, hosts: string[]) => Promise<Record<string, unknown>>;
    enrichWithThreatIntel: (finding: HuntFinding, tiSources: string[]) => Promise<HuntFinding>;
};
export default _default;
//# sourceMappingURL=threat-hunting-kit.d.ts.map