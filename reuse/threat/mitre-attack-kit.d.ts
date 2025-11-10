/**
 * LOC: MATR1234567
 * File: /reuse/threat/mitre-attack-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence controllers and services
 *   - MITRE ATT&CK integration services
 *   - Attack pattern analysis engines
 */
/**
 * File: /reuse/threat/mitre-attack-kit.ts
 * Locator: WC-UTL-MATR-001
 * Purpose: Comprehensive MITRE ATT&CK Framework Utilities - Tactics, techniques, TTPs, kill chain analysis
 *
 * Upstream: Independent utility module for MITRE ATT&CK framework integration
 * Downstream: ../backend/*, Threat analysis services, detection engines, ATT&CK Navigator integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 44 utility functions for MITRE ATT&CK mapping, TTP extraction, technique detection, coverage analysis
 *
 * LLM Context: Comprehensive MITRE ATT&CK utilities for implementing production-ready threat analysis and
 * detection capabilities in White Cross system. Provides tactic/technique mapping, TTPs extraction, attack
 * pattern matching, kill chain analysis, ATT&CK Navigator integration, and technique coverage tracking.
 * Essential for building advanced threat detection and response capabilities aligned with industry standards.
 */
interface ATTACKTactic {
    id: string;
    name: string;
    description: string;
    shortName: string;
    externalId: string;
    url: string;
    platforms: string[];
}
interface ATTACKTechnique {
    id: string;
    techniqueId: string;
    name: string;
    description: string;
    tactics: string[];
    platforms: string[];
    dataSourcesRequired: string[];
    detectionDifficulty: 'low' | 'medium' | 'high';
    permissions: string[];
    subtechniques: string[];
    mitigations: string[];
    url: string;
}
interface TTPExtraction {
    tactics: string[];
    techniques: string[];
    procedures: string[];
    confidence: number;
    sources: string[];
    timestamp: Date;
}
interface AttackPattern {
    patternId: string;
    name: string;
    description: string;
    techniques: string[];
    indicators: AttackIndicator[];
    killChainPhases: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
interface AttackIndicator {
    type: 'process' | 'file' | 'network' | 'registry' | 'behavior';
    value: string;
    weight: number;
    context: string;
}
interface KillChainPhase {
    phase: string;
    order: number;
    techniques: string[];
    observed: boolean;
    timestamp?: Date;
}
interface DetectionRule {
    id: string;
    name: string;
    techniqueId: string;
    platform: string;
    dataSource: string;
    query: string;
    falsePositiveRate: number;
    severity: string;
    enabled: boolean;
}
interface TechniqueCoverage {
    techniqueId: string;
    techniqueName: string;
    covered: boolean;
    detectionRules: number;
    lastTested?: Date;
    effectiveness: number;
    gaps: string[];
}
interface NavigatorLayer {
    name: string;
    version: string;
    domain: 'enterprise-attack' | 'mobile-attack' | 'ics-attack';
    description: string;
    techniques: NavigatorTechnique[];
    gradient: NavigatorGradient;
    legendItems: NavigatorLegendItem[];
}
interface NavigatorTechnique {
    techniqueID: string;
    score: number;
    color?: string;
    comment?: string;
    enabled: boolean;
    metadata?: Record<string, unknown>;
}
interface NavigatorGradient {
    colors: string[];
    minValue: number;
    maxValue: number;
}
interface NavigatorLegendItem {
    label: string;
    color: string;
}
interface ThreatActorProfile {
    name: string;
    aliases: string[];
    description: string;
    sophistication: 'low' | 'medium' | 'high' | 'advanced';
    tactics: string[];
    techniques: string[];
    targetedSectors: string[];
    attribution: string;
}
/**
 * Gets all MITRE ATT&CK tactics in kill chain order.
 *
 * @returns {ATTACKTactic[]} Array of tactics
 *
 * @example
 * ```typescript
 * const tactics = getAllTactics();
 * // Result: [{ id: 'TA0001', name: 'Initial Access', ... }, ...]
 * ```
 */
export declare const getAllTactics: () => ATTACKTactic[];
/**
 * Gets tactic by ID or external ID.
 *
 * @param {string} tacticId - Tactic ID (e.g., 'TA0001')
 * @returns {ATTACKTactic | null} Tactic or null if not found
 *
 * @example
 * ```typescript
 * const tactic = getTacticById('TA0001');
 * // Result: { id: 'TA0001', name: 'Initial Access', ... }
 * ```
 */
export declare const getTacticById: (tacticId: string) => ATTACKTactic | null;
/**
 * Gets tactics by platform.
 *
 * @param {string} platform - Platform name (e.g., 'Windows', 'Linux')
 * @returns {ATTACKTactic[]} Array of tactics for platform
 *
 * @example
 * ```typescript
 * const windowsTactics = getTacticsByPlatform('Windows');
 * ```
 */
export declare const getTacticsByPlatform: (platform: string) => ATTACKTactic[];
/**
 * Maps tactic name to tactic ID.
 *
 * @param {string} tacticName - Tactic name
 * @returns {string | null} Tactic ID or null
 *
 * @example
 * ```typescript
 * const id = mapTacticNameToId('Initial Access');
 * // Result: 'TA0001'
 * ```
 */
export declare const mapTacticNameToId: (tacticName: string) => string | null;
/**
 * Creates a technique object with metadata.
 *
 * @param {Partial<ATTACKTechnique>} techniqueData - Technique data
 * @returns {ATTACKTechnique} Complete technique object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const technique = createTechnique({
 *   techniqueId: 'T1059',
 *   name: 'Command and Scripting Interpreter',
 *   tactics: ['TA0002'],
 *   platforms: ['Windows', 'Linux']
 * });
 * ```
 */
export declare const createTechnique: (techniqueData: Partial<ATTACKTechnique>) => ATTACKTechnique;
/**
 * Gets techniques by tactic ID.
 *
 * @param {string} tacticId - Tactic ID
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques for the tactic
 *
 * @example
 * ```typescript
 * const techniques = getTechniquesByTactic('TA0001', allTechniques);
 * ```
 */
export declare const getTechniquesByTactic: (tacticId: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
/**
 * Gets techniques by platform.
 *
 * @param {string} platform - Platform name
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques for the platform
 *
 * @example
 * ```typescript
 * const windowsTechniques = getTechniquesByPlatform('Windows', allTechniques);
 * ```
 */
export declare const getTechniquesByPlatform: (platform: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
/**
 * Gets techniques by detection difficulty.
 *
 * @param {string} difficulty - Detection difficulty level
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Techniques matching difficulty
 *
 * @example
 * ```typescript
 * const hardToDetect = getTechniquesByDifficulty('high', allTechniques);
 * ```
 */
export declare const getTechniquesByDifficulty: (difficulty: "low" | "medium" | "high", allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
/**
 * Searches techniques by keyword.
 *
 * @param {string} keyword - Search keyword
 * @param {ATTACKTechnique[]} allTechniques - All available techniques
 * @returns {ATTACKTechnique[]} Matching techniques
 *
 * @example
 * ```typescript
 * const found = searchTechniques('powershell', allTechniques);
 * ```
 */
export declare const searchTechniques: (keyword: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
/**
 * Validates technique ID format.
 *
 * @param {string} techniqueId - Technique ID to validate
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const valid = validateTechniqueId('T1059'); // true
 * const invalid = validateTechniqueId('X9999'); // false
 * ```
 */
export declare const validateTechniqueId: (techniqueId: string) => boolean;
/**
 * Checks if technique ID is a subtechnique.
 *
 * @param {string} techniqueId - Technique ID
 * @returns {boolean} True if subtechnique
 *
 * @example
 * ```typescript
 * const isSub = isSubtechnique('T1059.001'); // true
 * const isNot = isSubtechnique('T1059'); // false
 * ```
 */
export declare const isSubtechnique: (techniqueId: string) => boolean;
/**
 * Extracts parent technique ID from subtechnique.
 *
 * @param {string} subtechniqueId - Subtechnique ID
 * @returns {string | null} Parent technique ID or null
 *
 * @example
 * ```typescript
 * const parent = getParentTechnique('T1059.001');
 * // Result: 'T1059'
 * ```
 */
export declare const getParentTechnique: (subtechniqueId: string) => string | null;
/**
 * Extracts TTPs from threat intelligence text.
 *
 * @param {string} text - Threat intelligence text
 * @param {ATTACKTechnique[]} knownTechniques - Known techniques database
 * @returns {TTPExtraction} Extracted TTPs
 *
 * @example
 * ```typescript
 * const ttps = extractTTPsFromText(threatReport, techniques);
 * // Result: { tactics: ['TA0001'], techniques: ['T1059'], procedures: [...], confidence: 0.85 }
 * ```
 */
export declare const extractTTPsFromText: (text: string, knownTechniques: ATTACKTechnique[]) => TTPExtraction;
/**
 * Calculates confidence score for TTP extraction.
 *
 * @param {number} matchCount - Number of matches found
 * @param {number} textLength - Length of analyzed text
 * @returns {number} Confidence score (0-1)
 *
 * @example
 * ```typescript
 * const confidence = calculateExtractionConfidence(5, 1000);
 * // Result: 0.75
 * ```
 */
export declare const calculateExtractionConfidence: (matchCount: number, textLength: number) => number;
/**
 * Merges multiple TTP extractions into single result.
 *
 * @param {TTPExtraction[]} extractions - Multiple extractions
 * @returns {TTPExtraction} Merged extraction
 *
 * @example
 * ```typescript
 * const merged = mergeTTPExtractions([extraction1, extraction2, extraction3]);
 * ```
 */
export declare const mergeTTPExtractions: (extractions: TTPExtraction[]) => TTPExtraction;
/**
 * Creates an attack pattern from techniques and indicators.
 *
 * @param {Partial<AttackPattern>} patternData - Attack pattern data
 * @returns {AttackPattern} Created attack pattern
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const pattern = createAttackPattern({
 *   name: 'Ransomware Deployment',
 *   techniques: ['T1486', 'T1490'],
 *   indicators: [...]
 * });
 * ```
 */
export declare const createAttackPattern: (patternData: Partial<AttackPattern>) => AttackPattern;
/**
 * Matches observed behaviors to attack patterns.
 *
 * @param {AttackIndicator[]} observedIndicators - Observed indicators
 * @param {AttackPattern[]} knownPatterns - Known attack patterns
 * @returns {Array<{ pattern: AttackPattern; matchScore: number }>} Matched patterns with scores
 *
 * @example
 * ```typescript
 * const matches = matchAttackPattern(indicators, patterns);
 * // Result: [{ pattern: {...}, matchScore: 0.85 }, ...]
 * ```
 */
export declare const matchAttackPattern: (observedIndicators: AttackIndicator[], knownPatterns: AttackPattern[]) => Array<{
    pattern: AttackPattern;
    matchScore: number;
}>;
/**
 * Calculates match score between indicators and pattern.
 *
 * @param {AttackIndicator[]} observedIndicators - Observed indicators
 * @param {AttackPattern} pattern - Attack pattern
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculatePatternMatchScore(indicators, pattern);
 * // Result: 0.75
 * ```
 */
export declare const calculatePatternMatchScore: (observedIndicators: AttackIndicator[], pattern: AttackPattern) => number;
/**
 * Maps techniques to kill chain phases.
 *
 * @param {string[]} techniqueIds - Technique IDs
 * @param {ATTACKTechnique[]} allTechniques - All techniques
 * @returns {KillChainPhase[]} Kill chain phases
 *
 * @example
 * ```typescript
 * const phases = mapToKillChain(['T1059', 'T1003'], techniques);
 * ```
 */
export declare const mapToKillChain: (techniqueIds: string[], allTechniques: ATTACKTechnique[]) => KillChainPhase[];
/**
 * Analyzes kill chain completeness.
 *
 * @param {KillChainPhase[]} observedPhases - Observed kill chain phases
 * @returns {object} Kill chain analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeKillChainCompleteness(phases);
 * // Result: { completeness: 0.7, missingPhases: [...], criticalGaps: [...] }
 * ```
 */
export declare const analyzeKillChainCompleteness: (observedPhases: KillChainPhase[]) => {
    completeness: number;
    missingPhases: string[];
    criticalGaps: boolean;
};
/**
 * Predicts next likely kill chain phase.
 *
 * @param {KillChainPhase[]} observedPhases - Observed phases
 * @returns {string | null} Next likely phase name
 *
 * @example
 * ```typescript
 * const next = predictNextKillChainPhase(currentPhases);
 * // Result: 'Lateral Movement'
 * ```
 */
export declare const predictNextKillChainPhase: (observedPhases: KillChainPhase[]) => string | null;
/**
 * Creates a detection rule for a technique.
 *
 * @param {Partial<DetectionRule>} ruleData - Detection rule data
 * @returns {DetectionRule} Created detection rule
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const rule = createDetectionRule({
 *   name: 'PowerShell Execution',
 *   techniqueId: 'T1059.001',
 *   platform: 'Windows',
 *   dataSource: 'Process',
 *   query: 'ProcessName = "powershell.exe"'
 * });
 * ```
 */
export declare const createDetectionRule: (ruleData: Partial<DetectionRule>) => DetectionRule;
/**
 * Calculates technique coverage across all detection rules.
 *
 * @param {ATTACKTechnique[]} techniques - All techniques
 * @param {DetectionRule[]} rules - All detection rules
 * @returns {TechniqueCoverage[]} Coverage for each technique
 *
 * @example
 * ```typescript
 * const coverage = calculateTechniqueCoverage(techniques, detectionRules);
 * ```
 */
export declare const calculateTechniqueCoverage: (techniques: ATTACKTechnique[], rules: DetectionRule[]) => TechniqueCoverage[];
/**
 * Calculates effectiveness of detection coverage.
 *
 * @param {DetectionRule[]} rules - Detection rules
 * @returns {number} Effectiveness score (0-100)
 *
 * @example
 * ```typescript
 * const effectiveness = calculateCoverageEffectiveness(rules);
 * // Result: 85
 * ```
 */
export declare const calculateCoverageEffectiveness: (rules: DetectionRule[]) => number;
/**
 * Identifies coverage gaps for techniques.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {number} [minEffectiveness=50] - Minimum effectiveness threshold
 * @returns {TechniqueCoverage[]} Techniques with gaps
 *
 * @example
 * ```typescript
 * const gaps = identifyCoverageGaps(coverage, 70);
 * ```
 */
export declare const identifyCoverageGaps: (coverage: TechniqueCoverage[], minEffectiveness?: number) => TechniqueCoverage[];
/**
 * Creates ATT&CK Navigator layer.
 *
 * @param {Partial<NavigatorLayer>} layerData - Layer data
 * @returns {NavigatorLayer} Navigator layer
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const layer = createNavigatorLayer({
 *   name: 'Detection Coverage',
 *   description: 'Current detection coverage',
 *   techniques: [...]
 * });
 * ```
 */
export declare const createNavigatorLayer: (layerData: Partial<NavigatorLayer>) => NavigatorLayer;
/**
 * Adds technique to Navigator layer.
 *
 * @param {NavigatorLayer} layer - Navigator layer
 * @param {NavigatorTechnique} technique - Technique to add
 * @returns {NavigatorLayer} Updated layer
 *
 * @example
 * ```typescript
 * const updated = addTechniqueToLayer(layer, {
 *   techniqueID: 'T1059',
 *   score: 85,
 *   enabled: true
 * });
 * ```
 */
export declare const addTechniqueToLayer: (layer: NavigatorLayer, technique: NavigatorTechnique) => NavigatorLayer;
/**
 * Generates Navigator layer from coverage data.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {string} layerName - Layer name
 * @returns {NavigatorLayer} Navigator layer
 *
 * @example
 * ```typescript
 * const layer = generateLayerFromCoverage(coverage, 'Detection Coverage');
 * ```
 */
export declare const generateLayerFromCoverage: (coverage: TechniqueCoverage[], layerName: string) => NavigatorLayer;
/**
 * Exports Navigator layer to JSON.
 *
 * @param {NavigatorLayer} layer - Navigator layer
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportNavigatorLayer(layer);
 * ```
 */
export declare const exportNavigatorLayer: (layer: NavigatorLayer) => string;
/**
 * Creates a threat actor profile.
 *
 * @param {Partial<ThreatActorProfile>} profileData - Profile data
 * @returns {ThreatActorProfile} Threat actor profile
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const profile = createThreatActorProfile({
 *   name: 'APT29',
 *   aliases: ['Cozy Bear', 'The Dukes'],
 *   tactics: ['TA0001', 'TA0002'],
 *   techniques: ['T1566', 'T1059']
 * });
 * ```
 */
export declare const createThreatActorProfile: (profileData: Partial<ThreatActorProfile>) => ThreatActorProfile;
/**
 * Compares threat actor TTPs with observed activity.
 *
 * @param {ThreatActorProfile} profile - Threat actor profile
 * @param {TTPExtraction} observed - Observed TTPs
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = compareThreatActorTTPs(apt29Profile, observedTTPs);
 * // Result: 0.75
 * ```
 */
export declare const compareThreatActorTTPs: (profile: ThreatActorProfile, observed: TTPExtraction) => number;
/**
 * Suggests likely threat actors based on TTPs.
 *
 * @param {TTPExtraction} observed - Observed TTPs
 * @param {ThreatActorProfile[]} knownActors - Known threat actors
 * @param {number} [threshold=0.5] - Minimum similarity threshold
 * @returns {Array<{ actor: ThreatActorProfile; similarity: number }>} Matched actors
 *
 * @example
 * ```typescript
 * const suspects = suggestThreatActors(observedTTPs, allActors, 0.6);
 * ```
 */
export declare const suggestThreatActors: (observed: TTPExtraction, knownActors: ThreatActorProfile[], threshold?: number) => Array<{
    actor: ThreatActorProfile;
    similarity: number;
}>;
/**
 * Gets recommended mitigations for a technique.
 *
 * @param {string} techniqueId - Technique ID
 * @returns {string[]} Recommended mitigation IDs
 *
 * @example
 * ```typescript
 * const mitigations = getMitigationsForTechnique('T1059');
 * // Result: ['M1038', 'M1049', 'M1026']
 * ```
 */
export declare const getMitigationsForTechnique: (techniqueId: string) => string[];
/**
 * Prioritizes techniques by risk score.
 *
 * @param {ATTACKTechnique[]} techniques - Techniques to prioritize
 * @param {object} context - Prioritization context
 * @returns {Array<{ technique: ATTACKTechnique; riskScore: number }>} Prioritized techniques
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeTechniquesByRisk(techniques, { platform: 'Windows', criticality: 'high' });
 * ```
 */
export declare const prioritizeTechniquesByRisk: (techniques: ATTACKTechnique[], context: {
    platform?: string;
    criticality?: string;
}) => Array<{
    technique: ATTACKTechnique;
    riskScore: number;
}>;
/**
 * Gets required data sources for technique detection.
 *
 * @param {ATTACKTechnique} technique - Technique
 * @returns {string[]} Required data sources
 *
 * @example
 * ```typescript
 * const dataSources = getRequiredDataSources(technique);
 * // Result: ['Process', 'Command', 'Script']
 * ```
 */
export declare const getRequiredDataSources: (technique: ATTACKTechnique) => string[];
/**
 * Checks if data source coverage is sufficient for technique detection.
 *
 * @param {ATTACKTechnique} technique - Technique
 * @param {string[]} availableDataSources - Available data sources
 * @returns {boolean} True if coverage is sufficient
 *
 * @example
 * ```typescript
 * const sufficient = checkDataSourceCoverage(technique, ['Process', 'File', 'Network']);
 * ```
 */
export declare const checkDataSourceCoverage: (technique: ATTACKTechnique, availableDataSources: string[]) => boolean;
/**
 * Identifies missing data sources for comprehensive coverage.
 *
 * @param {ATTACKTechnique[]} techniques - Techniques to cover
 * @param {string[]} availableDataSources - Available data sources
 * @returns {string[]} Missing data sources
 *
 * @example
 * ```typescript
 * const missing = identifyMissingDataSources(techniques, ['Process', 'File']);
 * // Result: ['Network', 'Registry', 'Command']
 * ```
 */
export declare const identifyMissingDataSources: (techniques: ATTACKTechnique[], availableDataSources: string[]) => string[];
/**
 * Analyzes campaign tactics and techniques.
 *
 * @param {TTPExtraction[]} campaignActivity - Campaign activity TTPs
 * @returns {object} Campaign analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeCampaignTactics(activity);
 * // Result: { primaryTactics: [...], techniques: [...], sophistication: 'high', timeline: {...} }
 * ```
 */
export declare const analyzeCampaignTactics: (campaignActivity: TTPExtraction[]) => object;
/**
 * Compares two campaigns by TTPs similarity.
 *
 * @param {TTPExtraction} campaign1 - First campaign
 * @param {TTPExtraction} campaign2 - Second campaign
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = compareCampaigns(campaign1, campaign2);
 * // Result: 0.65
 * ```
 */
export declare const compareCampaigns: (campaign1: TTPExtraction, campaign2: TTPExtraction) => number;
/**
 * Enriches technique with additional context.
 *
 * @param {ATTACKTechnique} technique - Base technique
 * @param {object} enrichmentData - Additional data
 * @returns {ATTACKTechnique} Enriched technique
 *
 * @example
 * ```typescript
 * const enriched = enrichTechniqueWithContext(technique, {
 *   observedInWild: true,
 *   prevalence: 'high',
 *   recentCampaigns: ['campaign-1', 'campaign-2']
 * });
 * ```
 */
export declare const enrichTechniqueWithContext: (technique: ATTACKTechnique, enrichmentData: Record<string, unknown>) => ATTACKTechnique;
/**
 * Maps CVE to MITRE ATT&CK techniques.
 *
 * @param {string} cveId - CVE identifier
 * @returns {string[]} Related technique IDs
 *
 * @example
 * ```typescript
 * const techniques = mapCVEToTechniques('CVE-2021-44228');
 * // Result: ['T1190', 'T1059']
 * ```
 */
export declare const mapCVEToTechniques: (cveId: string) => string[];
/**
 * Generates technique heatmap data for visualization.
 *
 * @param {TechniqueCoverage[]} coverage - Technique coverage
 * @param {ATTACKTechnique[]} allTechniques - All techniques
 * @returns {object} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateTechniqueHeatmap(coverage, techniques);
 * ```
 */
export declare const generateTechniqueHeatmap: (coverage: TechniqueCoverage[], allTechniques: ATTACKTechnique[]) => object;
/**
 * Generates OpenAPI specification for MITRE ATT&CK endpoints.
 *
 * @param {string} baseUrl - Base URL for API
 * @returns {object} OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = generateMITREOpenAPISpec('/api/v1/attack');
 * ```
 */
export declare const generateMITREOpenAPISpec: (baseUrl: string) => object;
/**
 * Creates NestJS service for ATT&CK operations.
 *
 * @returns {string} NestJS service class definition
 *
 * @example
 * ```typescript
 * const service = createMITREService();
 * ```
 */
export declare const createMITREService: () => string;
/**
 * Generates Sequelize model for ATT&CK techniques.
 *
 * @returns {string} Sequelize model definition
 *
 * @example
 * ```typescript
 * const model = generateATTACKTechniqueModel();
 * ```
 */
export declare const generateATTACKTechniqueModel: () => string;
declare const _default: {
    getAllTactics: () => ATTACKTactic[];
    getTacticById: (tacticId: string) => ATTACKTactic | null;
    getTacticsByPlatform: (platform: string) => ATTACKTactic[];
    mapTacticNameToId: (tacticName: string) => string | null;
    createTechnique: (techniqueData: Partial<ATTACKTechnique>) => ATTACKTechnique;
    getTechniquesByTactic: (tacticId: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
    getTechniquesByPlatform: (platform: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
    getTechniquesByDifficulty: (difficulty: "low" | "medium" | "high", allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
    searchTechniques: (keyword: string, allTechniques: ATTACKTechnique[]) => ATTACKTechnique[];
    validateTechniqueId: (techniqueId: string) => boolean;
    isSubtechnique: (techniqueId: string) => boolean;
    getParentTechnique: (subtechniqueId: string) => string | null;
    extractTTPsFromText: (text: string, knownTechniques: ATTACKTechnique[]) => TTPExtraction;
    calculateExtractionConfidence: (matchCount: number, textLength: number) => number;
    mergeTTPExtractions: (extractions: TTPExtraction[]) => TTPExtraction;
    createAttackPattern: (patternData: Partial<AttackPattern>) => AttackPattern;
    matchAttackPattern: (observedIndicators: AttackIndicator[], knownPatterns: AttackPattern[]) => Array<{
        pattern: AttackPattern;
        matchScore: number;
    }>;
    calculatePatternMatchScore: (observedIndicators: AttackIndicator[], pattern: AttackPattern) => number;
    mapToKillChain: (techniqueIds: string[], allTechniques: ATTACKTechnique[]) => KillChainPhase[];
    analyzeKillChainCompleteness: (observedPhases: KillChainPhase[]) => {
        completeness: number;
        missingPhases: string[];
        criticalGaps: boolean;
    };
    predictNextKillChainPhase: (observedPhases: KillChainPhase[]) => string | null;
    createDetectionRule: (ruleData: Partial<DetectionRule>) => DetectionRule;
    calculateTechniqueCoverage: (techniques: ATTACKTechnique[], rules: DetectionRule[]) => TechniqueCoverage[];
    calculateCoverageEffectiveness: (rules: DetectionRule[]) => number;
    identifyCoverageGaps: (coverage: TechniqueCoverage[], minEffectiveness?: number) => TechniqueCoverage[];
    createNavigatorLayer: (layerData: Partial<NavigatorLayer>) => NavigatorLayer;
    addTechniqueToLayer: (layer: NavigatorLayer, technique: NavigatorTechnique) => NavigatorLayer;
    generateLayerFromCoverage: (coverage: TechniqueCoverage[], layerName: string) => NavigatorLayer;
    exportNavigatorLayer: (layer: NavigatorLayer) => string;
    createThreatActorProfile: (profileData: Partial<ThreatActorProfile>) => ThreatActorProfile;
    compareThreatActorTTPs: (profile: ThreatActorProfile, observed: TTPExtraction) => number;
    suggestThreatActors: (observed: TTPExtraction, knownActors: ThreatActorProfile[], threshold?: number) => Array<{
        actor: ThreatActorProfile;
        similarity: number;
    }>;
    generateMITREOpenAPISpec: (baseUrl: string) => object;
    createMITREService: () => string;
    generateATTACKTechniqueModel: () => string;
    getMitigationsForTechnique: (techniqueId: string) => string[];
    prioritizeTechniquesByRisk: (techniques: ATTACKTechnique[], context: {
        platform?: string;
        criticality?: string;
    }) => Array<{
        technique: ATTACKTechnique;
        riskScore: number;
    }>;
    getRequiredDataSources: (technique: ATTACKTechnique) => string[];
    checkDataSourceCoverage: (technique: ATTACKTechnique, availableDataSources: string[]) => boolean;
    identifyMissingDataSources: (techniques: ATTACKTechnique[], availableDataSources: string[]) => string[];
    analyzeCampaignTactics: (campaignActivity: TTPExtraction[]) => object;
    compareCampaigns: (campaign1: TTPExtraction, campaign2: TTPExtraction) => number;
    enrichTechniqueWithContext: (technique: ATTACKTechnique, enrichmentData: Record<string, unknown>) => ATTACKTechnique;
    mapCVEToTechniques: (cveId: string) => string[];
    generateTechniqueHeatmap: (coverage: TechniqueCoverage[], allTechniques: ATTACKTechnique[]) => object;
};
export default _default;
//# sourceMappingURL=mitre-attack-kit.d.ts.map