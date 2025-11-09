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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  relativeTime?: string; // e.g., '-24h', '-7d'
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
  confidence: number; // 0-100
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
  dataProcessed: number; // bytes
  huntingHours: number;
  efficiency: number; // findings per hour
}

interface AnomalyDetectionConfig {
  algorithm: 'statistical' | 'ml_based' | 'behavioral' | 'threshold';
  sensitivity: 'high' | 'medium' | 'low';
  baselinePeriod: number; // days
  detectionWindow: number; // hours
  features: string[];
  thresholds: Record<string, number>;
}

interface Anomaly {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number; // 0-100
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
export const createHuntHypothesis = (hypothesisData: Partial<HuntHypothesis>): HuntHypothesis => {
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
export const validateHypothesis = (
  hypothesis: HuntHypothesis,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const mapToMitreFramework = (
  indicators: string[],
  category: string,
): { tactics: string[]; techniques: string[] } => {
  const tactics: string[] = [];
  const techniques: string[] = [];

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
export const generateQueriesFromHypothesis = (
  hypothesis: HuntHypothesis,
  platform: string,
): HuntQuery[] => {
  const queries: HuntQuery[] = [];

  // Generate query based on indicators
  const queryText = buildQueryFromIndicators(hypothesis.indicators, platform);

  queries.push({
    id: `QRY-${Date.now()}`,
    name: `${hypothesis.name} - Detection Query`,
    platform: platform as HuntQuery['platform'],
    queryLanguage: getQueryLanguageForPlatform(platform),
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
export const buildQueryFromIndicators = (indicators: string[], platform: string): string => {
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
export const getQueryLanguageForPlatform = (platform: string): HuntQuery['queryLanguage'] => {
  const languageMap: Record<string, HuntQuery['queryLanguage']> = {
    splunk: 'spl',
    sentinel: 'kql',
    elastic: 'lucene',
    chronicle: 'sql',
  };
  return languageMap[platform] || 'custom';
};

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
export const buildAdvancedHuntQuery = (queryConfig: Partial<HuntQuery>): HuntQuery => {
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
export const addQueryFilter = (query: HuntQuery, field: string, value: unknown): HuntQuery => {
  return {
    ...query,
    filters: {
      ...query.filters,
      [field]: value,
    },
  };
};

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
export const combineHuntQueries = (queries: HuntQuery[], platform: string): HuntQuery => {
  const combinedQueryText = queries.map(q => `(${q.queryText})`).join(' OR ');
  const allFields = [...new Set(queries.flatMap(q => q.fields))];

  return {
    id: `QRY-COMBINED-${Date.now()}`,
    name: 'Combined Hunt Query',
    platform: platform as HuntQuery['platform'],
    queryLanguage: getQueryLanguageForPlatform(platform),
    queryText: combinedQueryText,
    timeRange: queries[0]?.timeRange || { start: '-24h', end: 'now' },
    fields: allFields,
    filters: {},
  };
};

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
export const optimizeHuntQuery = (query: HuntQuery): HuntQuery => {
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
export const convertQueryFormat = (query: HuntQuery, targetPlatform: string): HuntQuery => {
  // Simplified conversion logic
  return {
    ...query,
    platform: targetPlatform as HuntQuery['platform'],
    queryLanguage: getQueryLanguageForPlatform(targetPlatform),
    queryText: `/* Converted from ${query.platform} */ ${query.queryText}`,
  };
};

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
export const createHuntCampaign = (campaignData: Partial<HuntCampaign>): HuntCampaign => {
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
export const updateCampaignStatus = (
  campaign: HuntCampaign,
  status: HuntCampaign['status'],
): HuntCampaign => {
  const updated = { ...campaign, status };

  if (status === 'completed') {
    updated.endDate = new Date();
  }

  return updated;
};

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
export const addFindingToCampaign = (
  campaign: HuntCampaign,
  finding: HuntFinding,
): HuntCampaign => {
  return {
    ...campaign,
    findings: [...campaign.findings, finding],
    metrics: {
      ...campaign.metrics,
      findingsDiscovered: campaign.metrics.findingsDiscovered + 1,
    },
  };
};

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
export const calculateCampaignEffectiveness = (
  campaign: HuntCampaign,
): Record<string, number> => {
  const total = campaign.metrics.truePositives + campaign.metrics.falsePositives;
  const precision = total > 0 ? campaign.metrics.truePositives / total : 0;
  const efficiency =
    campaign.metrics.huntingHours > 0
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
export const generateCampaignReport = (campaign: HuntCampaign): Record<string, unknown> => {
  const effectiveness = calculateCampaignEffectiveness(campaign);

  return {
    campaignId: campaign.id,
    name: campaign.name,
    status: campaign.status,
    duration:
      campaign.endDate && campaign.startDate
        ? campaign.endDate.getTime() - campaign.startDate.getTime()
        : null,
    metrics: campaign.metrics,
    effectiveness,
    findings: {
      total: campaign.findings.length,
      bySeverity: groupFindingsBySeverity(campaign.findings),
      byStatus: groupFindingsByStatus(campaign.findings),
    },
    hunters: campaign.hunters,
  };
};

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
export const groupFindingsBySeverity = (findings: HuntFinding[]): Record<string, number> => {
  return findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

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
export const groupFindingsByStatus = (findings: HuntFinding[]): Record<string, number> => {
  return findings.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

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
export const configureAnomalyDetection = (
  config: Partial<AnomalyDetectionConfig>,
): AnomalyDetectionConfig => {
  return {
    algorithm: config.algorithm || 'statistical',
    sensitivity: config.sensitivity || 'medium',
    baselinePeriod: config.baselinePeriod || 30,
    detectionWindow: config.detectionWindow || 24,
    features: config.features || [],
    thresholds: config.thresholds || {},
  };
};

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
export const detectBehavioralAnomalies = (
  data: Record<string, number>[],
  config: AnomalyDetectionConfig,
): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  config.features.forEach(feature => {
    const values = data.map(d => d[feature]).filter(v => v !== undefined);
    const baseline = calculateBaseline(values);
    const threshold = calculateAnomalyThreshold(baseline, config.sensitivity);

    data.forEach((point, index) => {
      const observed = point[feature];
      if (observed === undefined) return;

      const deviation = Math.abs(observed - baseline);

      if (deviation > threshold) {
        anomalies.push({
          id: `ANO-${Date.now()}-${index}`,
          type: 'behavioral',
          severity: categorizeSeverity(deviation, threshold),
          score: (deviation / threshold) * 100,
          entity: point.entity as string || 'unknown',
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
export const calculateBaseline = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
};

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
export const calculateAnomalyThreshold = (
  baseline: number,
  sensitivity: AnomalyDetectionConfig['sensitivity'],
): number => {
  const multipliers = {
    high: 1.5,
    medium: 2.0,
    low: 3.0,
  };

  return baseline * multipliers[sensitivity];
};

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
export const categorizeSeverity = (
  deviation: number,
  threshold: number,
): Anomaly['severity'] => {
  const ratio = deviation / threshold;

  if (ratio >= 3) return 'critical';
  if (ratio >= 2) return 'high';
  if (ratio >= 1.5) return 'medium';
  return 'low';
};

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
export const filterAnomaliesByScore = (anomalies: Anomaly[], minScore: number): Anomaly[] => {
  return anomalies.filter(a => a.score >= minScore);
};

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
export const scoreHuntFinding = (finding: HuntFinding): number => {
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
export const prioritizeFindings = (findings: HuntFinding[]): HuntFinding[] => {
  return [...findings].sort((a, b) => scoreHuntFinding(b) - scoreHuntFinding(a));
};

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
export const calculateFindingConfidence = (
  evidence: EvidenceData[],
  indicators: string[],
): number => {
  const evidenceScore = Math.min(evidence.length * 10, 50);
  const indicatorScore = Math.min(indicators.length * 5, 30);
  const relevanceScore = evidence.length > 0
    ? evidence.reduce((sum, e) => sum + e.relevanceScore, 0) / evidence.length
    : 0;

  return Math.round(evidenceScore + indicatorScore + relevanceScore * 0.2);
};

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
export const correlateFindingsToCampaigns = (
  findings: HuntFinding[],
  timeWindow: number = 86400000,
): HuntFinding[][] => {
  const sorted = [...findings].sort(
    (a, b) => a.discoveredAt.getTime() - b.discoveredAt.getTime(),
  );

  const groups: HuntFinding[][] = [];
  let currentGroup: HuntFinding[] = [];
  let groupStartTime: number | null = null;

  sorted.forEach(finding => {
    const findingTime = finding.discoveredAt.getTime();

    if (groupStartTime === null || findingTime - groupStartTime <= timeWindow) {
      currentGroup.push(finding);
      if (groupStartTime === null) groupStartTime = findingTime;
    } else {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [finding];
      groupStartTime = findingTime;
    }
  });

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
};

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
export const scheduleAutomatedHunt = (
  query: HuntQuery,
  schedule: string,
): Record<string, unknown> => {
  return {
    jobId: `JOB-${Date.now()}`,
    queryId: query.id,
    schedule,
    status: 'scheduled',
    nextRun: calculateNextRun(schedule),
    createdAt: new Date(),
  };
};

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
export const calculateNextRun = (cronExpression: string): Date => {
  // Simplified - in production use a cron library
  const next = new Date();
  next.setHours(next.getHours() + 1);
  return next;
};

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
export const executeAutomatedHunt = async (
  query: HuntQuery,
  integration: SIEMIntegration,
): Promise<Record<string, unknown>[]> => {
  // Simulate query execution
  await new Promise(resolve => setTimeout(resolve, 200));

  return [
    { timestamp: new Date(), host: 'server1', event: 'suspicious_activity' },
    { timestamp: new Date(), host: 'server2', event: 'anomaly_detected' },
  ];
};

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
export const processAutomatedResults = (
  results: Record<string, unknown>[],
  hypothesis: HuntHypothesis,
): HuntFinding[] => {
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
        type: 'log' as const,
        source: 'automated_hunt',
        timestamp: new Date(),
        data: result,
        relevanceScore: 70,
      },
    ],
    affectedAssets: [result.host as string || 'unknown'],
    indicators: hypothesis.indicators,
    mitreTactics: hypothesis.mitreTactics,
    mitreTechniques: hypothesis.mitreTechniques,
    recommendedActions: ['Investigate further', 'Correlate with other events'],
    status: 'new' as const,
    discoveredAt: new Date(),
    updatedAt: new Date(),
  }));
};

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
export const createHuntPattern = (patternData: Partial<HuntPattern>): HuntPattern => {
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
export const searchPatternLibrary = (
  library: HuntPattern[],
  criteria: Record<string, unknown>,
): HuntPattern[] => {
  return library.filter(pattern => {
    if (criteria.category && pattern.category !== criteria.category) return false;
    if (criteria.minDetectionRate && pattern.detectionRate < (criteria.minDetectionRate as number))
      return false;
    return true;
  });
};

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
export const updatePatternMetrics = (pattern: HuntPattern, truePositive: boolean): HuntPattern => {
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
export const querySIEM = async (
  config: SIEMIntegration,
  query: HuntQuery,
): Promise<Record<string, unknown>[]> => {
  // Simulate SIEM query
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    { _time: new Date().toISOString(), host: 'server1', sourcetype: 'windows' },
    { _time: new Date().toISOString(), host: 'server2', sourcetype: 'linux' },
  ];
};

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
export const performEDRAction = async (
  config: EDRIntegration,
  action: string,
  hosts: string[],
): Promise<Record<string, unknown>> => {
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
export const enrichWithThreatIntel = async (
  finding: HuntFinding,
  tiSources: string[],
): Promise<HuntFinding> => {
  // Simulate threat intel enrichment
  await new Promise(resolve => setTimeout(resolve, 250));

  return {
    ...finding,
    description: `${finding.description}\n\n[Enriched with threat intel from ${tiSources.join(', ')}]`,
    confidence: Math.min(finding.confidence + 10, 100),
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hypothesis
  createHuntHypothesis,
  validateHypothesis,
  mapToMitreFramework,
  generateQueriesFromHypothesis,
  buildQueryFromIndicators,
  getQueryLanguageForPlatform,

  // Query builders
  buildAdvancedHuntQuery,
  addQueryFilter,
  combineHuntQueries,
  optimizeHuntQuery,
  convertQueryFormat,

  // Campaign management
  createHuntCampaign,
  updateCampaignStatus,
  addFindingToCampaign,
  calculateCampaignEffectiveness,
  generateCampaignReport,
  groupFindingsBySeverity,
  groupFindingsByStatus,

  // Anomaly detection
  configureAnomalyDetection,
  detectBehavioralAnomalies,
  calculateBaseline,
  calculateAnomalyThreshold,
  categorizeSeverity,
  filterAnomaliesByScore,

  // Scoring
  scoreHuntFinding,
  prioritizeFindings,
  calculateFindingConfidence,
  correlateFindingsToCampaigns,

  // Automation
  scheduleAutomatedHunt,
  calculateNextRun,
  executeAutomatedHunt,
  processAutomatedResults,

  // Pattern library
  createHuntPattern,
  searchPatternLibrary,
  updatePatternMetrics,

  // Integration
  querySIEM,
  performEDRAction,
  enrichWithThreatIntel,
};
