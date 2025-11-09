"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichWithThreatIntel = exports.performEDRAction = exports.querySIEM = exports.updatePatternMetrics = exports.searchPatternLibrary = exports.createHuntPattern = exports.processAutomatedResults = exports.executeAutomatedHunt = exports.calculateNextRun = exports.scheduleAutomatedHunt = exports.correlateFindingsToCampaigns = exports.calculateFindingConfidence = exports.prioritizeFindings = exports.scoreHuntFinding = exports.filterAnomaliesByScore = exports.categorizeSeverity = exports.calculateAnomalyThreshold = exports.calculateBaseline = exports.detectBehavioralAnomalies = exports.configureAnomalyDetection = exports.groupFindingsByStatus = exports.groupFindingsBySeverity = exports.generateCampaignReport = exports.calculateCampaignEffectiveness = exports.addFindingToCampaign = exports.updateCampaignStatus = exports.createHuntCampaign = exports.convertQueryFormat = exports.optimizeHuntQuery = exports.combineHuntQueries = exports.addQueryFilter = exports.buildAdvancedHuntQuery = exports.getQueryLanguageForPlatform = exports.buildQueryFromIndicators = exports.generateQueriesFromHypothesis = exports.mapToMitreFramework = exports.validateHypothesis = exports.createHuntHypothesis = void 0;
// ============================================================================
// HYPOTHESIS-DRIVEN HUNTING
// ============================================================================
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
const createHuntHypothesis = (hypothesisData) => {
    return {
        id: `HYP-${Date.now()}`,
        name: hypothesisData.name || 'Unnamed Hypothesis',
        description: hypothesisData.description || '',
        category: hypothesisData.category || 'other',
        severity: hypothesisData.severity || 'medium',
        mitreTactics: hypothesisData.mitreTactics || [],
        mitreTechniques: hypothesisData.mitreTechniques || [],
        indicators: hypothesisData.indicators || [],
        queries: hypothesisData.queries || [],
        expectedEvidence: hypothesisData.expectedEvidence || [],
        falsePositivePotential: hypothesisData.falsePositivePotential || 'medium',
        createdBy: hypothesisData.createdBy || 'system',
        createdAt: new Date(),
    };
};
exports.createHuntHypothesis = createHuntHypothesis;
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
const validateHypothesis = (hypothesis) => {
    const errors = [];
    if (!hypothesis.name || hypothesis.name.length < 3) {
        errors.push('Hypothesis name must be at least 3 characters');
    }
    if (hypothesis.indicators.length === 0) {
        errors.push('At least one indicator is required');
    }
    if (hypothesis.queries.length === 0) {
        errors.push('At least one query is required');
    }
    if (hypothesis.mitreTechniques.length === 0) {
        errors.push('At least one MITRE technique should be mapped');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateHypothesis = validateHypothesis;
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
const mapToMitreFramework = (indicators, category) => {
    const tactics = [];
    const techniques = [];
    // Simplified MITRE mapping logic
    if (indicators.some(i => i.includes('powershell'))) {
        tactics.push('TA0002'); // Execution
        techniques.push('T1059.001'); // PowerShell
    }
    if (category === 'lateral_movement') {
        tactics.push('TA0008'); // Lateral Movement
    }
    return { tactics: [...new Set(tactics)], techniques: [...new Set(techniques)] };
};
exports.mapToMitreFramework = mapToMitreFramework;
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
const generateQueriesFromHypothesis = (hypothesis, platform) => {
    const queries = [];
    // Generate query based on indicators
    const queryText = (0, exports.buildQueryFromIndicators)(hypothesis.indicators, platform);
    queries.push({
        id: `QRY-${Date.now()}`,
        name: `${hypothesis.name} - Detection Query`,
        platform: platform,
        queryLanguage: (0, exports.getQueryLanguageForPlatform)(platform),
        queryText,
        timeRange: {
            start: '-7d',
            end: 'now',
        },
        fields: ['timestamp', 'host', 'user', 'process', 'command'],
        filters: {},
    });
    return queries;
};
exports.generateQueriesFromHypothesis = generateQueriesFromHypothesis;
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
const buildQueryFromIndicators = (indicators, platform) => {
    switch (platform) {
        case 'splunk':
            return `index=* (${indicators.join(' OR ')}) | stats count by host, user`;
        case 'elastic':
        case 'sentinel':
            return indicators.map(i => `process.name:"${i}" OR command_line:*${i}*`).join(' OR ');
        default:
            return indicators.join(' OR ');
    }
};
exports.buildQueryFromIndicators = buildQueryFromIndicators;
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
const getQueryLanguageForPlatform = (platform) => {
    const languageMap = {
        splunk: 'spl',
        sentinel: 'kql',
        elastic: 'lucene',
        chronicle: 'sql',
    };
    return languageMap[platform] || 'custom';
};
exports.getQueryLanguageForPlatform = getQueryLanguageForPlatform;
// ============================================================================
// HUNT QUERY BUILDERS
// ============================================================================
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
const buildAdvancedHuntQuery = (queryConfig) => {
    return {
        id: queryConfig.id || `QRY-${Date.now()}`,
        name: queryConfig.name || 'Unnamed Query',
        platform: queryConfig.platform || 'custom',
        queryLanguage: queryConfig.queryLanguage || 'custom',
        queryText: queryConfig.queryText || '',
        timeRange: queryConfig.timeRange || { start: '-24h', end: 'now' },
        fields: queryConfig.fields || ['*'],
        filters: queryConfig.filters || {},
        thresholds: queryConfig.thresholds,
    };
};
exports.buildAdvancedHuntQuery = buildAdvancedHuntQuery;
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
const addQueryFilter = (query, field, value) => {
    return {
        ...query,
        filters: {
            ...query.filters,
            [field]: value,
        },
    };
};
exports.addQueryFilter = addQueryFilter;
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
const combineHuntQueries = (queries, platform) => {
    const combinedQueryText = queries.map(q => `(${q.queryText})`).join(' OR ');
    const allFields = [...new Set(queries.flatMap(q => q.fields))];
    return {
        id: `QRY-COMBINED-${Date.now()}`,
        name: 'Combined Hunt Query',
        platform: platform,
        queryLanguage: (0, exports.getQueryLanguageForPlatform)(platform),
        queryText: combinedQueryText,
        timeRange: queries[0]?.timeRange || { start: '-24h', end: 'now' },
        fields: allFields,
        filters: {},
    };
};
exports.combineHuntQueries = combineHuntQueries;
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
const optimizeHuntQuery = (query) => {
    let optimizedQuery = query.queryText;
    // Platform-specific optimizations
    if (query.platform === 'splunk') {
        if (!optimizedQuery.includes('index=')) {
            optimizedQuery = `index=* ${optimizedQuery}`;
        }
        if (!optimizedQuery.includes('| head')) {
            optimizedQuery = `${optimizedQuery} | head 10000`;
        }
    }
    return {
        ...query,
        queryText: optimizedQuery,
    };
};
exports.optimizeHuntQuery = optimizeHuntQuery;
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
const convertQueryFormat = (query, targetPlatform) => {
    // Simplified conversion logic
    return {
        ...query,
        platform: targetPlatform,
        queryLanguage: (0, exports.getQueryLanguageForPlatform)(targetPlatform),
        queryText: `/* Converted from ${query.platform} */ ${query.queryText}`,
    };
};
exports.convertQueryFormat = convertQueryFormat;
// ============================================================================
// HUNT CAMPAIGN MANAGEMENT
// ============================================================================
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
const createHuntCampaign = (campaignData) => {
    return {
        id: `CAMP-${Date.now()}`,
        name: campaignData.name || 'Unnamed Campaign',
        description: campaignData.description || '',
        status: 'planning',
        hypotheses: campaignData.hypotheses || [],
        startDate: campaignData.startDate || new Date(),
        hunters: campaignData.hunters || [],
        findings: [],
        metrics: {
            hypothesesTested: 0,
            queriesExecuted: 0,
            findingsDiscovered: 0,
            truePositives: 0,
            falsePositives: 0,
            assetsAnalyzed: 0,
            dataProcessed: 0,
            huntingHours: 0,
            efficiency: 0,
        },
        tags: campaignData.tags || [],
    };
};
exports.createHuntCampaign = createHuntCampaign;
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
const updateCampaignStatus = (campaign, status) => {
    const updated = { ...campaign, status };
    if (status === 'completed') {
        updated.endDate = new Date();
    }
    return updated;
};
exports.updateCampaignStatus = updateCampaignStatus;
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
const addFindingToCampaign = (campaign, finding) => {
    return {
        ...campaign,
        findings: [...campaign.findings, finding],
        metrics: {
            ...campaign.metrics,
            findingsDiscovered: campaign.metrics.findingsDiscovered + 1,
        },
    };
};
exports.addFindingToCampaign = addFindingToCampaign;
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
const calculateCampaignEffectiveness = (campaign) => {
    const total = campaign.metrics.truePositives + campaign.metrics.falsePositives;
    const precision = total > 0 ? campaign.metrics.truePositives / total : 0;
    const efficiency = campaign.metrics.huntingHours > 0
        ? campaign.metrics.findingsDiscovered / campaign.metrics.huntingHours
        : 0;
    return {
        precision,
        efficiency,
        successRate: campaign.metrics.hypothesesTested > 0
            ? campaign.metrics.truePositives / campaign.metrics.hypothesesTested
            : 0,
        coverage: campaign.metrics.assetsAnalyzed,
    };
};
exports.calculateCampaignEffectiveness = calculateCampaignEffectiveness;
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
const generateCampaignReport = (campaign) => {
    const effectiveness = (0, exports.calculateCampaignEffectiveness)(campaign);
    return {
        campaignId: campaign.id,
        name: campaign.name,
        status: campaign.status,
        duration: campaign.endDate && campaign.startDate
            ? campaign.endDate.getTime() - campaign.startDate.getTime()
            : null,
        metrics: campaign.metrics,
        effectiveness,
        findings: {
            total: campaign.findings.length,
            bySeverity: (0, exports.groupFindingsBySeverity)(campaign.findings),
            byStatus: (0, exports.groupFindingsByStatus)(campaign.findings),
        },
        hunters: campaign.hunters,
    };
};
exports.generateCampaignReport = generateCampaignReport;
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
const groupFindingsBySeverity = (findings) => {
    return findings.reduce((acc, f) => {
        acc[f.severity] = (acc[f.severity] || 0) + 1;
        return acc;
    }, {});
};
exports.groupFindingsBySeverity = groupFindingsBySeverity;
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
const groupFindingsByStatus = (findings) => {
    return findings.reduce((acc, f) => {
        acc[f.status] = (acc[f.status] || 0) + 1;
        return acc;
    }, {});
};
exports.groupFindingsByStatus = groupFindingsByStatus;
// ============================================================================
// ANOMALY DETECTION
// ============================================================================
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
const configureAnomalyDetection = (config) => {
    return {
        algorithm: config.algorithm || 'statistical',
        sensitivity: config.sensitivity || 'medium',
        baselinePeriod: config.baselinePeriod || 30,
        detectionWindow: config.detectionWindow || 24,
        features: config.features || [],
        thresholds: config.thresholds || {},
    };
};
exports.configureAnomalyDetection = configureAnomalyDetection;
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
const detectBehavioralAnomalies = (data, config) => {
    const anomalies = [];
    config.features.forEach(feature => {
        const values = data.map(d => d[feature]).filter(v => v !== undefined);
        const baseline = (0, exports.calculateBaseline)(values);
        const threshold = (0, exports.calculateAnomalyThreshold)(baseline, config.sensitivity);
        data.forEach((point, index) => {
            const observed = point[feature];
            if (observed === undefined)
                return;
            const deviation = Math.abs(observed - baseline);
            if (deviation > threshold) {
                anomalies.push({
                    id: `ANO-${Date.now()}-${index}`,
                    type: 'behavioral',
                    severity: (0, exports.categorizeSeverity)(deviation, threshold),
                    score: (deviation / threshold) * 100,
                    entity: point.entity || 'unknown',
                    feature,
                    baseline,
                    observed,
                    deviation,
                    timestamp: new Date(),
                    context: point,
                });
            }
        });
    });
    return anomalies;
};
exports.detectBehavioralAnomalies = detectBehavioralAnomalies;
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
const calculateBaseline = (values) => {
    if (values.length === 0)
        return 0;
    const sum = values.reduce((acc, v) => acc + v, 0);
    return sum / values.length;
};
exports.calculateBaseline = calculateBaseline;
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
const calculateAnomalyThreshold = (baseline, sensitivity) => {
    const multipliers = {
        high: 1.5,
        medium: 2.0,
        low: 3.0,
    };
    return baseline * multipliers[sensitivity];
};
exports.calculateAnomalyThreshold = calculateAnomalyThreshold;
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
const categorizeSeverity = (deviation, threshold) => {
    const ratio = deviation / threshold;
    if (ratio >= 3)
        return 'critical';
    if (ratio >= 2)
        return 'high';
    if (ratio >= 1.5)
        return 'medium';
    return 'low';
};
exports.categorizeSeverity = categorizeSeverity;
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
const filterAnomaliesByScore = (anomalies, minScore) => {
    return anomalies.filter(a => a.score >= minScore);
};
exports.filterAnomaliesByScore = filterAnomaliesByScore;
// ============================================================================
// HUNT RESULT SCORING
// ============================================================================
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
const scoreHuntFinding = (finding) => {
    let score = 0;
    // Severity contribution
    const severityScores = { critical: 40, high: 30, medium: 20, low: 10, informational: 5 };
    score += severityScores[finding.severity];
    // Confidence contribution
    score += finding.confidence * 0.3;
    // MITRE technique count contribution
    score += Math.min(finding.mitreTechniques.length * 5, 20);
    // Affected assets contribution
    score += Math.min(finding.affectedAssets.length * 2, 10);
    return Math.min(Math.round(score), 100);
};
exports.scoreHuntFinding = scoreHuntFinding;
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
const prioritizeFindings = (findings) => {
    return [...findings].sort((a, b) => (0, exports.scoreHuntFinding)(b) - (0, exports.scoreHuntFinding)(a));
};
exports.prioritizeFindings = prioritizeFindings;
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
const calculateFindingConfidence = (evidence, indicators) => {
    const evidenceScore = Math.min(evidence.length * 10, 50);
    const indicatorScore = Math.min(indicators.length * 5, 30);
    const relevanceScore = evidence.length > 0
        ? evidence.reduce((sum, e) => sum + e.relevanceScore, 0) / evidence.length
        : 0;
    return Math.round(evidenceScore + indicatorScore + relevanceScore * 0.2);
};
exports.calculateFindingConfidence = calculateFindingConfidence;
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
const correlateFindingsToCampaigns = (findings, timeWindow = 86400000) => {
    const sorted = [...findings].sort((a, b) => a.discoveredAt.getTime() - b.discoveredAt.getTime());
    const groups = [];
    let currentGroup = [];
    let groupStartTime = null;
    sorted.forEach(finding => {
        const findingTime = finding.discoveredAt.getTime();
        if (groupStartTime === null || findingTime - groupStartTime <= timeWindow) {
            currentGroup.push(finding);
            if (groupStartTime === null)
                groupStartTime = findingTime;
        }
        else {
            if (currentGroup.length > 0)
                groups.push(currentGroup);
            currentGroup = [finding];
            groupStartTime = findingTime;
        }
    });
    if (currentGroup.length > 0)
        groups.push(currentGroup);
    return groups;
};
exports.correlateFindingsToCampaigns = correlateFindingsToCampaigns;
// ============================================================================
// HUNT AUTOMATION
// ============================================================================
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
const scheduleAutomatedHunt = (query, schedule) => {
    return {
        jobId: `JOB-${Date.now()}`,
        queryId: query.id,
        schedule,
        status: 'scheduled',
        nextRun: (0, exports.calculateNextRun)(schedule),
        createdAt: new Date(),
    };
};
exports.scheduleAutomatedHunt = scheduleAutomatedHunt;
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
const calculateNextRun = (cronExpression) => {
    // Simplified - in production use a cron library
    const next = new Date();
    next.setHours(next.getHours() + 1);
    return next;
};
exports.calculateNextRun = calculateNextRun;
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
const executeAutomatedHunt = async (query, integration) => {
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { timestamp: new Date(), host: 'server1', event: 'suspicious_activity' },
        { timestamp: new Date(), host: 'server2', event: 'anomaly_detected' },
    ];
};
exports.executeAutomatedHunt = executeAutomatedHunt;
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
const processAutomatedResults = (results, hypothesis) => {
    return results.map((result, index) => ({
        id: `FIND-${Date.now()}-${index}`,
        campaignId: 'AUTO',
        hypothesisId: hypothesis.id,
        severity: hypothesis.severity,
        confidence: 70,
        title: `Automated Detection: ${hypothesis.name}`,
        description: `Match found for hypothesis: ${hypothesis.description}`,
        evidence: [
            {
                type: 'log',
                source: 'automated_hunt',
                timestamp: new Date(),
                data: result,
                relevanceScore: 70,
            },
        ],
        affectedAssets: [result.host || 'unknown'],
        indicators: hypothesis.indicators,
        mitreTactics: hypothesis.mitreTactics,
        mitreTechniques: hypothesis.mitreTechniques,
        recommendedActions: ['Investigate further', 'Correlate with other events'],
        status: 'new',
        discoveredAt: new Date(),
        updatedAt: new Date(),
    }));
};
exports.processAutomatedResults = processAutomatedResults;
// ============================================================================
// HUNT PATTERN LIBRARIES
// ============================================================================
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
const createHuntPattern = (patternData) => {
    return {
        id: `PAT-${Date.now()}`,
        name: patternData.name || 'Unnamed Pattern',
        category: patternData.category || 'other',
        description: patternData.description || '',
        indicators: patternData.indicators || [],
        queries: patternData.queries || [],
        falsePositiveRate: patternData.falsePositiveRate || 0.1,
        detectionRate: patternData.detectionRate || 0.8,
        lastUpdated: new Date(),
        author: patternData.author || 'system',
    };
};
exports.createHuntPattern = createHuntPattern;
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
const searchPatternLibrary = (library, criteria) => {
    return library.filter(pattern => {
        if (criteria.category && pattern.category !== criteria.category)
            return false;
        if (criteria.minDetectionRate && pattern.detectionRate < criteria.minDetectionRate)
            return false;
        return true;
    });
};
exports.searchPatternLibrary = searchPatternLibrary;
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
const updatePatternMetrics = (pattern, truePositive) => {
    // Simplified metric update
    const detectionRate = truePositive
        ? Math.min(pattern.detectionRate + 0.01, 1.0)
        : Math.max(pattern.detectionRate - 0.01, 0);
    const falsePositiveRate = !truePositive
        ? Math.min(pattern.falsePositiveRate + 0.01, 1.0)
        : Math.max(pattern.falsePositiveRate - 0.01, 0);
    return {
        ...pattern,
        detectionRate,
        falsePositiveRate,
        lastUpdated: new Date(),
    };
};
exports.updatePatternMetrics = updatePatternMetrics;
// ============================================================================
// SIEM/EDR INTEGRATION
// ============================================================================
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
const querySIEM = async (config, query) => {
    // Simulate SIEM query
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        { _time: new Date().toISOString(), host: 'server1', sourcetype: 'windows' },
        { _time: new Date().toISOString(), host: 'server2', sourcetype: 'linux' },
    ];
};
exports.querySIEM = querySIEM;
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
const performEDRAction = async (config, action, hosts) => {
    // Simulate EDR action
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
        platform: config.platform,
        action,
        hosts,
        status: 'completed',
        timestamp: new Date(),
    };
};
exports.performEDRAction = performEDRAction;
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
const enrichWithThreatIntel = async (finding, tiSources) => {
    // Simulate threat intel enrichment
    await new Promise(resolve => setTimeout(resolve, 250));
    return {
        ...finding,
        description: `${finding.description}\n\n[Enriched with threat intel from ${tiSources.join(', ')}]`,
        confidence: Math.min(finding.confidence + 10, 100),
    };
};
exports.enrichWithThreatIntel = enrichWithThreatIntel;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Hypothesis
    createHuntHypothesis: exports.createHuntHypothesis,
    validateHypothesis: exports.validateHypothesis,
    mapToMitreFramework: exports.mapToMitreFramework,
    generateQueriesFromHypothesis: exports.generateQueriesFromHypothesis,
    buildQueryFromIndicators: exports.buildQueryFromIndicators,
    getQueryLanguageForPlatform: exports.getQueryLanguageForPlatform,
    // Query builders
    buildAdvancedHuntQuery: exports.buildAdvancedHuntQuery,
    addQueryFilter: exports.addQueryFilter,
    combineHuntQueries: exports.combineHuntQueries,
    optimizeHuntQuery: exports.optimizeHuntQuery,
    convertQueryFormat: exports.convertQueryFormat,
    // Campaign management
    createHuntCampaign: exports.createHuntCampaign,
    updateCampaignStatus: exports.updateCampaignStatus,
    addFindingToCampaign: exports.addFindingToCampaign,
    calculateCampaignEffectiveness: exports.calculateCampaignEffectiveness,
    generateCampaignReport: exports.generateCampaignReport,
    groupFindingsBySeverity: exports.groupFindingsBySeverity,
    groupFindingsByStatus: exports.groupFindingsByStatus,
    // Anomaly detection
    configureAnomalyDetection: exports.configureAnomalyDetection,
    detectBehavioralAnomalies: exports.detectBehavioralAnomalies,
    calculateBaseline: exports.calculateBaseline,
    calculateAnomalyThreshold: exports.calculateAnomalyThreshold,
    categorizeSeverity: exports.categorizeSeverity,
    filterAnomaliesByScore: exports.filterAnomaliesByScore,
    // Scoring
    scoreHuntFinding: exports.scoreHuntFinding,
    prioritizeFindings: exports.prioritizeFindings,
    calculateFindingConfidence: exports.calculateFindingConfidence,
    correlateFindingsToCampaigns: exports.correlateFindingsToCampaigns,
    // Automation
    scheduleAutomatedHunt: exports.scheduleAutomatedHunt,
    calculateNextRun: exports.calculateNextRun,
    executeAutomatedHunt: exports.executeAutomatedHunt,
    processAutomatedResults: exports.processAutomatedResults,
    // Pattern library
    createHuntPattern: exports.createHuntPattern,
    searchPatternLibrary: exports.searchPatternLibrary,
    updatePatternMetrics: exports.updatePatternMetrics,
    // Integration
    querySIEM: exports.querySIEM,
    performEDRAction: exports.performEDRAction,
    enrichWithThreatIntel: exports.enrichWithThreatIntel,
};
//# sourceMappingURL=threat-hunting-kit.js.map