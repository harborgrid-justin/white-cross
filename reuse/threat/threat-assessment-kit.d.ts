/**
 * @fileoverview Threat Assessment Kit - Enterprise Infor SCM competitor
 * @module reuse/threat/threat-assessment-kit
 * @description Comprehensive threat identification, classification, and analysis for supply chain
 * and enterprise security, competing with Infor SCM threat management module. Handles threat
 * detection, actor profiling, attack vector analysis, severity scoring, threat taxonomy,
 * correlation analysis, threat intelligence, landscape assessment, and mitigation planning.
 *
 * Key Features:
 * - Threat identification and categorization
 * - Advanced threat actor profiling and attribution
 * - Attack vector analysis and mapping
 * - Dynamic threat severity calculation
 * - Comprehensive threat taxonomy management
 * - Threat correlation and pattern detection
 * - Threat landscape analysis and visualization
 * - Threat intelligence integration and enrichment
 * - Attack surface analysis
 * - Threat hunting workflows
 * - Indicator of Compromise (IoC) management
 * - Threat model generation
 *
 * @target Infor SCM Threat Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for threat data
 * - Audit trails for all threat assessments
 * - Data encryption for sensitive threat intelligence
 * - SOC 2 Type II compliance
 * - Multi-tenant data isolation
 * - Threat data anonymization capabilities
 *
 * @example Threat identification
 * ```typescript
 * import { identifyThreat, classifyThreat } from './threat-assessment-kit';
 *
 * const threat = await identifyThreat({
 *   sourceType: 'SECURITY_ALERT',
 *   description: 'Suspicious network activity detected',
 *   severity: ThreatSeverity.HIGH,
 *   affectedAssets: ['server-001', 'database-prod'],
 * });
 *
 * const classification = await classifyThreat(threat.id);
 * ```
 *
 * @example Threat actor profiling
 * ```typescript
 * import { profileThreatActor, analyzeThreatActorMotivation } from './threat-assessment-kit';
 *
 * const actorProfile = await profileThreatActor({
 *   actorType: ThreatActorType.APT,
 *   capabilities: ['ADVANCED_MALWARE', 'ZERO_DAY_EXPLOITS'],
 *   targetSectors: ['FINANCIAL', 'GOVERNMENT'],
 * });
 *
 * const motivation = await analyzeThreatActorMotivation(actorProfile.id);
 * ```
 *
 * @example Attack vector analysis
 * ```typescript
 * import { analyzeAttackVector, mapAttackPath } from './threat-assessment-kit';
 *
 * const vector = await analyzeAttackVector({
 *   threatId: 'threat-123',
 *   entryPoint: 'EMAIL_PHISHING',
 *   exploitedVulnerabilities: ['CVE-2024-1234'],
 * });
 *
 * const attackPath = await mapAttackPath('threat-123');
 * ```
 *
 * LOC: THREAT-ASSESS-001
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns
 * DOWNSTREAM: security-operations, incident-response, risk-management, compliance
 *
 * @version 1.0.0
 * @since 2025-01-09
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * @enum ThreatSeverity
 * @description Threat severity levels
 */
export declare enum ThreatSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * @enum ThreatStatus
 * @description Current status of threat
 */
export declare enum ThreatStatus {
    IDENTIFIED = "IDENTIFIED",
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION",
    CONFIRMED = "CONFIRMED",
    MITIGATED = "MITIGATED",
    RESOLVED = "RESOLVED",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    ESCALATED = "ESCALATED"
}
/**
 * @enum ThreatCategory
 * @description Threat categorization
 */
export declare enum ThreatCategory {
    MALWARE = "MALWARE",
    PHISHING = "PHISHING",
    RANSOMWARE = "RANSOMWARE",
    DATA_BREACH = "DATA_BREACH",
    INSIDER_THREAT = "INSIDER_THREAT",
    DDoS = "DDoS",
    ZERO_DAY = "ZERO_DAY",
    SUPPLY_CHAIN = "SUPPLY_CHAIN",
    SOCIAL_ENGINEERING = "SOCIAL_ENGINEERING",
    APT = "APT"
}
/**
 * @enum ThreatActorType
 * @description Types of threat actors
 */
export declare enum ThreatActorType {
    APT = "APT",
    CYBERCRIMINAL = "CYBERCRIMINAL",
    HACKTIVIST = "HACKTIVIST",
    INSIDER = "INSIDER",
    NATION_STATE = "NATION_STATE",
    SCRIPT_KIDDIE = "SCRIPT_KIDDIE",
    TERRORIST = "TERRORIST",
    UNKNOWN = "UNKNOWN"
}
/**
 * @enum AttackVectorType
 * @description Attack vector categories
 */
export declare enum AttackVectorType {
    EMAIL_PHISHING = "EMAIL_PHISHING",
    NETWORK_INTRUSION = "NETWORK_INTRUSION",
    WEB_APPLICATION = "WEB_APPLICATION",
    PHYSICAL_ACCESS = "PHYSICAL_ACCESS",
    SOCIAL_ENGINEERING = "SOCIAL_ENGINEERING",
    SUPPLY_CHAIN = "SUPPLY_CHAIN",
    REMOVABLE_MEDIA = "REMOVABLE_MEDIA",
    CLOUD_SERVICE = "CLOUD_SERVICE",
    API_EXPLOIT = "API_EXPLOIT"
}
/**
 * @enum ThreatConfidence
 * @description Confidence level in threat assessment
 */
export declare enum ThreatConfidence {
    CONFIRMED = "CONFIRMED",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    UNCONFIRMED = "UNCONFIRMED"
}
/**
 * @interface ThreatData
 * @description Threat identification data
 */
export interface ThreatData {
    sourceType: string;
    sourceId?: string;
    description: string;
    category: ThreatCategory;
    severity: ThreatSeverity;
    confidence: ThreatConfidence;
    affectedAssets: string[];
    indicators?: string[];
    metadata?: Record<string, any>;
}
/**
 * @interface ThreatActorProfile
 * @description Threat actor profile data
 */
export interface ThreatActorProfile {
    actorId: string;
    actorType: ThreatActorType;
    actorName?: string;
    aliases?: string[];
    capabilities: string[];
    targetSectors: string[];
    targetGeographies?: string[];
    motivations: string[];
    sophisticationLevel: number;
    activityTimeline?: Array<{
        date: Date;
        activity: string;
    }>;
    associatedCampaigns?: string[];
    knownTTPs?: string[];
}
/**
 * @interface AttackVector
 * @description Attack vector analysis data
 */
export interface AttackVector {
    threatId: string;
    vectorType: AttackVectorType;
    entryPoint: string;
    exploitedVulnerabilities: string[];
    techniques: string[];
    tactics: string[];
    procedures: string[];
    killChainPhases: string[];
    mitreTactics?: string[];
}
/**
 * @interface ThreatSeverityScore
 * @description Calculated threat severity score
 */
export interface ThreatSeverityScore {
    threatId: string;
    baseScore: number;
    impactScore: number;
    exploitabilityScore: number;
    temporalScore: number;
    environmentalScore: number;
    finalScore: number;
    severity: ThreatSeverity;
    scoringMethod: string;
    calculatedAt: Date;
}
/**
 * @interface ThreatTaxonomy
 * @description Threat taxonomy classification
 */
export interface ThreatTaxonomy {
    taxonomyId: string;
    taxonomyName: string;
    version: string;
    categories: Array<{
        categoryId: string;
        categoryName: string;
        subcategories: string[];
    }>;
    mappings: Record<string, string>;
}
/**
 * @interface ThreatCorrelation
 * @description Correlated threat data
 */
export interface ThreatCorrelation {
    primaryThreatId: string;
    correlatedThreats: Array<{
        threatId: string;
        correlationScore: number;
        correlationType: string;
        sharedIndicators: string[];
    }>;
    patterns: string[];
    campaignId?: string;
}
/**
 * @interface ThreatLandscape
 * @description Threat landscape analysis
 */
export interface ThreatLandscape {
    period: string;
    totalThreats: number;
    threatsByCategory: Record<ThreatCategory, number>;
    threatsBySeverity: Record<ThreatSeverity, number>;
    topActorTypes: Array<{
        type: ThreatActorType;
        count: number;
    }>;
    topVectors: Array<{
        vector: AttackVectorType;
        count: number;
    }>;
    trendDirection: 'INCREASING' | 'STABLE' | 'DECREASING';
    emergingThreats: string[];
}
/**
 * @interface ThreatIntelligence
 * @description Threat intelligence enrichment data
 */
export interface ThreatIntelligence {
    threatId: string;
    sources: Array<{
        sourceName: string;
        sourceType: string;
        confidence: number;
        data: Record<string, any>;
    }>;
    iocs: Array<{
        type: string;
        value: string;
        firstSeen: Date;
        lastSeen: Date;
    }>;
    contextualData: Record<string, any>;
    enrichedAt: Date;
}
/**
 * @interface AttackSurface
 * @description Attack surface analysis
 */
export interface AttackSurface {
    assetId: string;
    assetType: string;
    exposureLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    vulnerabilities: Array<{
        cveId: string;
        severity: string;
        exploitAvailable: boolean;
    }>;
    accessPoints: string[];
    protectionMeasures: string[];
    riskScore: number;
}
/**
 * @interface ThreatHuntingQuery
 * @description Threat hunting query definition
 */
export interface ThreatHuntingQuery {
    queryId: string;
    queryName: string;
    hypothesis: string;
    dataSource: string;
    queryLogic: string;
    indicators: string[];
    expectedFindings: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}
/**
 * @interface IndicatorOfCompromise
 * @description IoC data structure
 */
export interface IndicatorOfCompromise {
    iocId: string;
    iocType: 'IP' | 'DOMAIN' | 'URL' | 'FILE_HASH' | 'EMAIL' | 'REGISTRY_KEY';
    iocValue: string;
    threatId?: string;
    confidence: ThreatConfidence;
    firstSeen: Date;
    lastSeen: Date;
    relatedCampaigns?: string[];
    tags?: string[];
}
/**
 * Identifies and registers a new threat in the system
 *
 * @param {ThreatData} data - Threat identification data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created threat record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const threat = await identifyThreat({
 *   sourceType: 'IDS_ALERT',
 *   description: 'Malware detected on endpoint',
 *   category: ThreatCategory.MALWARE,
 *   severity: ThreatSeverity.HIGH,
 *   confidence: ThreatConfidence.HIGH,
 *   affectedAssets: ['workstation-042'],
 * }, sequelize);
 * ```
 */
export declare const identifyThreat: (data: ThreatData, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Classifies a threat based on multiple attributes and intelligence
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Classification results
 *
 * @example
 * ```typescript
 * const classification = await classifyThreat('threat-123', sequelize);
 * console.log(classification.primaryCategory, classification.subcategories);
 * ```
 */
export declare const classifyThreat: (threatId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Categorizes threat by industry-standard frameworks (MITRE ATT&CK, Kill Chain)
 *
 * @param {string} threatId - Threat ID
 * @param {string} framework - Framework name ('MITRE_ATTACK' | 'CYBER_KILL_CHAIN')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Framework categorization
 *
 * @example
 * ```typescript
 * const mitreMapping = await categorizeThreatByFramework('threat-123', 'MITRE_ATTACK', sequelize);
 * ```
 */
export declare const categorizeThreatByFramework: (threatId: string, framework: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Updates threat classification based on new intelligence
 *
 * @param {string} threatId - Threat ID
 * @param {Partial<ThreatData>} updates - Classification updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated threat
 *
 * @example
 * ```typescript
 * await updateThreatClassification('threat-123', {
 *   category: ThreatCategory.RANSOMWARE,
 *   severity: ThreatSeverity.CRITICAL,
 * }, sequelize);
 * ```
 */
export declare const updateThreatClassification: (threatId: string, updates: Partial<ThreatData>, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Retrieves threat classification history
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{timestamp: Date, changes: Record<string, any>}>>} Classification history
 *
 * @example
 * ```typescript
 * const history = await getThreatClassificationHistory('threat-123', sequelize);
 * ```
 */
export declare const getThreatClassificationHistory: (threatId: string, sequelize: Sequelize) => Promise<Array<{
    timestamp: Date;
    changes: Record<string, any>;
}>>;
/**
 * Creates comprehensive threat actor profile
 *
 * @param {Partial<ThreatActorProfile>} profile - Actor profile data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ThreatActorProfile>} Created actor profile
 *
 * @example
 * ```typescript
 * const actor = await profileThreatActor({
 *   actorType: ThreatActorType.APT,
 *   actorName: 'APT29',
 *   capabilities: ['ADVANCED_MALWARE', 'SUPPLY_CHAIN_ATTACKS'],
 *   targetSectors: ['GOVERNMENT', 'DEFENSE'],
 * }, sequelize);
 * ```
 */
export declare const profileThreatActor: (profile: Partial<ThreatActorProfile>, sequelize: Sequelize, transaction?: Transaction) => Promise<ThreatActorProfile>;
/**
 * Analyzes threat actor motivations
 *
 * @param {string} actorId - Actor ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{motivation: string, probability: number, evidence: string[]}>>} Motivation analysis
 *
 * @example
 * ```typescript
 * const motivations = await analyzeThreatActorMotivation('actor-123', sequelize);
 * ```
 */
export declare const analyzeThreatActorMotivation: (actorId: string, sequelize: Sequelize) => Promise<Array<{
    motivation: string;
    probability: number;
    evidence: string[];
}>>;
/**
 * Links threat actor to specific threat campaigns
 *
 * @param {string} actorId - Actor ID
 * @param {string} threatId - Threat ID
 * @param {number} attributionConfidence - Confidence score (0-1)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Attribution record
 *
 * @example
 * ```typescript
 * await attributeThreatToActor('actor-123', 'threat-456', 0.9, sequelize);
 * ```
 */
export declare const attributeThreatToActor: (actorId: string, threatId: string, attributionConfidence: number, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Retrieves threat actor capabilities and tools
 *
 * @param {string} actorId - Actor ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Actor capabilities
 *
 * @example
 * ```typescript
 * const capabilities = await getThreatActorCapabilities('actor-123', sequelize);
 * ```
 */
export declare const getThreatActorCapabilities: (actorId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Compares threat actors for similarity analysis
 *
 * @param {string} actorId1 - First actor ID
 * @param {string} actorId2 - Second actor ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{similarity: number, sharedCharacteristics: string[]}>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareThreatActors('actor-123', 'actor-456', sequelize);
 * ```
 */
export declare const compareThreatActors: (actorId1: string, actorId2: string, sequelize: Sequelize) => Promise<{
    similarity: number;
    sharedCharacteristics: string[];
}>;
/**
 * Analyzes attack vector for a threat
 *
 * @param {Partial<AttackVector>} vectorData - Attack vector data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AttackVector>} Attack vector analysis
 *
 * @example
 * ```typescript
 * const vector = await analyzeAttackVector({
 *   threatId: 'threat-123',
 *   vectorType: AttackVectorType.EMAIL_PHISHING,
 *   entryPoint: 'Corporate email gateway',
 *   exploitedVulnerabilities: ['CVE-2024-1234'],
 * }, sequelize);
 * ```
 */
export declare const analyzeAttackVector: (vectorData: Partial<AttackVector>, sequelize: Sequelize, transaction?: Transaction) => Promise<AttackVector>;
/**
 * Maps complete attack path from entry to objective
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{step: number, phase: string, action: string, timestamp?: Date}>>} Attack path
 *
 * @example
 * ```typescript
 * const attackPath = await mapAttackPath('threat-123', sequelize);
 * ```
 */
export declare const mapAttackPath: (threatId: string, sequelize: Sequelize) => Promise<Array<{
    step: number;
    phase: string;
    action: string;
    timestamp?: Date;
}>>;
/**
 * Identifies vulnerable entry points in infrastructure
 *
 * @param {string} assetType - Asset type to analyze
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{entryPoint: string, vulnerability: string, severity: string}>>} Entry points
 *
 * @example
 * ```typescript
 * const entryPoints = await identifyEntryPoints('WEB_SERVER', sequelize);
 * ```
 */
export declare const identifyEntryPoints: (assetType: string, sequelize: Sequelize) => Promise<Array<{
    entryPoint: string;
    vulnerability: string;
    severity: string;
}>>;
/**
 * Analyzes attack techniques used (MITRE ATT&CK)
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{techniqueId: string, techniqueName: string, usage: string}>>} Techniques
 *
 * @example
 * ```typescript
 * const techniques = await analyzeAttackTechniques('threat-123', sequelize);
 * ```
 */
export declare const analyzeAttackTechniques: (threatId: string, sequelize: Sequelize) => Promise<Array<{
    techniqueId: string;
    techniqueName: string;
    usage: string;
}>>;
/**
 * Generates attack vector heat map
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<AttackVectorType, number>>} Vector frequency map
 *
 * @example
 * ```typescript
 * const heatMap = await generateAttackVectorHeatMap(new Date('2025-01-01'), new Date('2025-01-31'), sequelize);
 * ```
 */
export declare const generateAttackVectorHeatMap: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<AttackVectorType, number>>;
/**
 * Calculates comprehensive threat severity score
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ThreatSeverityScore>} Calculated severity score
 *
 * @example
 * ```typescript
 * const score = await calculateThreatSeverityScore('threat-123', sequelize);
 * console.log(`Final score: ${score.finalScore}, Severity: ${score.severity}`);
 * ```
 */
export declare const calculateThreatSeverityScore: (threatId: string, sequelize: Sequelize) => Promise<ThreatSeverityScore>;
/**
 * Evaluates business impact of threat
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{financialImpact: number, operationalImpact: string, reputationalImpact: string}>} Impact assessment
 *
 * @example
 * ```typescript
 * const impact = await evaluateThreatImpact('threat-123', sequelize);
 * ```
 */
export declare const evaluateThreatImpact: (threatId: string, sequelize: Sequelize) => Promise<{
    financialImpact: number;
    operationalImpact: string;
    reputationalImpact: string;
}>;
/**
 * Calculates exploitability score
 *
 * @param {string} threatId - Threat ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Exploitability score (0-10)
 *
 * @example
 * ```typescript
 * const exploitability = await calculateExploitabilityScore('threat-123', sequelize);
 * ```
 */
export declare const calculateExploitabilityScore: (threatId: string, sequelize: Sequelize) => Promise<number>;
/**
 * Prioritizes threats based on multiple factors
 *
 * @param {string[]} threatIds - Array of threat IDs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{threatId: string, priority: number, severity: ThreatSeverity}>>} Prioritized threats
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeThreats(['threat-123', 'threat-456', 'threat-789'], sequelize);
 * ```
 */
export declare const prioritizeThreats: (threatIds: string[], sequelize: Sequelize) => Promise<Array<{
    threatId: string;
    priority: number;
    severity: ThreatSeverity;
}>>;
/**
 * Re-evaluates threat severity based on new intelligence
 *
 * @param {string} threatId - Threat ID
 * @param {Record<string, any>} newIntelligence - New intelligence data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ThreatSeverityScore>} Updated severity score
 *
 * @example
 * ```typescript
 * const updatedScore = await reevaluateThreatSeverity('threat-123', {
 *   exploitAvailable: true,
 *   activeExploitation: true,
 * }, sequelize);
 * ```
 */
export declare const reevaluateThreatSeverity: (threatId: string, newIntelligence: Record<string, any>, sequelize: Sequelize) => Promise<ThreatSeverityScore>;
/**
 * Creates custom threat taxonomy
 *
 * @param {Partial<ThreatTaxonomy>} taxonomy - Taxonomy data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ThreatTaxonomy>} Created taxonomy
 *
 * @example
 * ```typescript
 * const taxonomy = await createThreatTaxonomy({
 *   taxonomyName: 'Financial Services Threats',
 *   version: '1.0',
 *   categories: [
 *     { categoryId: 'FIN-01', categoryName: 'Payment Fraud', subcategories: ['Card Fraud', 'Wire Fraud'] }
 *   ],
 * }, sequelize);
 * ```
 */
export declare const createThreatTaxonomy: (taxonomy: Partial<ThreatTaxonomy>, sequelize: Sequelize, transaction?: Transaction) => Promise<ThreatTaxonomy>;
/**
 * Maps threat to taxonomy categories
 *
 * @param {string} threatId - Threat ID
 * @param {string} taxonomyId - Taxonomy ID
 * @param {string[]} categoryIds - Category IDs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Mapping result
 *
 * @example
 * ```typescript
 * await mapThreatToTaxonomy('threat-123', 'taxonomy-456', ['CAT-01', 'CAT-02'], sequelize);
 * ```
 */
export declare const mapThreatToTaxonomy: (threatId: string, taxonomyId: string, categoryIds: string[], sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Retrieves taxonomy hierarchy
 *
 * @param {string} taxonomyId - Taxonomy ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ThreatTaxonomy>} Taxonomy hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = await getTaxonomyHierarchy('taxonomy-123', sequelize);
 * ```
 */
export declare const getTaxonomyHierarchy: (taxonomyId: string, sequelize: Sequelize) => Promise<ThreatTaxonomy>;
/**
 * Searches threats by taxonomy category
 *
 * @param {string} taxonomyId - Taxonomy ID
 * @param {string} categoryId - Category ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string[]>} Threat IDs
 *
 * @example
 * ```typescript
 * const threats = await searchThreatsByTaxonomy('taxonomy-123', 'CAT-01', sequelize);
 * ```
 */
export declare const searchThreatsByTaxonomy: (taxonomyId: string, categoryId: string, sequelize: Sequelize) => Promise<string[]>;
//# sourceMappingURL=threat-assessment-kit.d.ts.map