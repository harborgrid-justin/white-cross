/**
 * LOC: THACP1234567
 * File: /reuse/threat/threat-actor-profiling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Attribution analysis modules
 *   - Security operations centers
 */
/**
 * File: /reuse/threat/threat-actor-profiling-kit.ts
 * Locator: WC-UTL-THACP-001
 * Purpose: Advanced Threat Actor Profiling - actor attribution, capability assessment, motivation analysis,
 *          infrastructure mapping, historical tracking, relationship networks, TTP profiling, evolution tracking
 *
 * Upstream: Independent utility module for advanced threat actor profiling
 * Downstream: ../backend/*, Threat intelligence services, Attribution engines, SOC dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI, bcrypt, helmet
 * Exports: 40 utility functions for threat actor profiling, attribution, assessment, and intelligence
 *
 * LLM Context: Comprehensive threat actor profiling utilities for White Cross security platform.
 * Provides advanced actor attribution, capability assessment, motivation and intent analysis, infrastructure mapping,
 * historical activity tracking, actor relationship networks, TTP profiling, evolution tracking with NestJS security patterns.
 */
interface ThreatActorProfile {
    id: string;
    name: string;
    aliases: string[];
    type: 'nation-state' | 'criminal' | 'hacktivist' | 'insider' | 'terrorist' | 'unknown';
    sophistication: 'minimal' | 'low' | 'medium' | 'high' | 'advanced' | 'expert';
    motivation: ActorMotivation[];
    primaryObjectives: string[];
    targetSectors: string[];
    targetGeographies: string[];
    firstSeen: Date;
    lastSeen: Date;
    active: boolean;
    confidence: number;
    riskScore: number;
    attributionConfidence: number;
    description?: string;
    encryptedIntel?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    lastModifiedBy?: string;
}
interface ActorMotivation {
    type: 'financial' | 'espionage' | 'sabotage' | 'ideology' | 'revenge' | 'notoriety' | 'disruption' | 'unknown';
    description?: string;
    confidence: number;
    evidence: string[];
    analyzedAt: Date;
}
interface ActorCapabilityAssessment {
    actorId: string;
    category: 'malware' | 'exploit' | 'infrastructure' | 'social-engineering' | 'cryptography' | 'evasion' | 'persistence' | 'lateral-movement';
    name: string;
    description: string;
    proficiencyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
    evidence: CapabilityEvidence[];
    confidence: number;
    impactScore: number;
    lastObserved: Date;
    firstObserved: Date;
    observationCount: number;
    validated: boolean;
}
interface CapabilityEvidence {
    type: 'malware-sample' | 'technique-observation' | 'intelligence-report' | 'tool-identification';
    description: string;
    source: string;
    confidence: number;
    timestamp: Date;
    referenceId?: string;
}
interface ActorInfrastructureMapping {
    actorId: string;
    infrastructureType: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'registrar' | 'hosting-provider';
    value: string;
    role: 'c2' | 'phishing' | 'malware-distribution' | 'data-exfiltration' | 'staging' | 'reconnaissance' | 'vpn-exit';
    active: boolean;
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    country?: string;
    asn?: string;
    registrar?: string;
    relatedInfrastructure: string[];
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    encryptedDetails?: string;
    metadata?: Record<string, unknown>;
}
interface ActorTTPProfile {
    actorId: string;
    mitreAttackId: string;
    tactic: string;
    technique: string;
    subTechnique?: string;
    procedureDescription?: string;
    frequency: 'rare' | 'occasional' | 'common' | 'frequent' | 'signature';
    confidence: number;
    observationCount: number;
    firstObserved: Date;
    lastObserved: Date;
    successRate?: number;
    detectionDifficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
    mitigations: string[];
    relatedCVEs: string[];
}
interface ActorHistoricalActivity {
    actorId: string;
    activityType: 'campaign' | 'attack' | 'reconnaissance' | 'capability-acquisition' | 'infrastructure-change' | 'ttp-evolution';
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    targetSectors: string[];
    targetGeographies: string[];
    victims?: string[];
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    evidenceSources: string[];
    relatedCampaigns: string[];
    mitreAttackIds: string[];
}
interface ActorRelationshipNetwork {
    sourceActorId: string;
    targetActorId: string;
    relationshipType: 'parent' | 'subsidiary' | 'partner' | 'competitor' | 'shares-infrastructure' | 'shares-tools' | 'shares-targets' | 'collaborative';
    strength: number;
    confidence: number;
    evidence: RelationshipEvidence[];
    active: boolean;
    firstObserved: Date;
    lastObserved: Date;
    bidirectional: boolean;
}
interface RelationshipEvidence {
    type: 'infrastructure-overlap' | 'ttp-similarity' | 'malware-sharing' | 'target-overlap' | 'timing-correlation' | 'intelligence-report';
    description: string;
    weight: number;
    source?: string;
    timestamp: Date;
}
interface ActorEvolutionTracking {
    actorId: string;
    evolutionType: 'capability-upgrade' | 'ttp-change' | 'target-shift' | 'infrastructure-migration' | 'motivation-change' | 'sophistication-increase';
    fromState: string;
    toState: string;
    description: string;
    detectedAt: Date;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    indicators: string[];
}
interface ActorAttributionResult {
    actorId: string;
    campaignId?: string;
    incidentId?: string;
    attributionScore: number;
    confidence: number;
    attributionFactors: AttributionFactor[];
    analyst?: string;
    analysisDate: Date;
    validatedBy?: string;
    validationDate?: Date;
    notes?: string;
}
interface AttributionFactor {
    factorType: 'ttp-match' | 'infrastructure-overlap' | 'malware-similarity' | 'target-pattern' | 'timing-pattern' | 'linguistic-analysis' | 'tool-fingerprint';
    score: number;
    weight: number;
    description: string;
    evidence: string[];
    confidence: number;
}
interface ActorSearchCriteria {
    name?: string;
    type?: ThreatActorProfile['type'];
    sophistication?: ThreatActorProfile['sophistication'];
    motivations?: ActorMotivation['type'][];
    minConfidence?: number;
    minRiskScore?: number;
    active?: boolean;
    targetSector?: string;
    targetGeography?: string;
    hasInfrastructure?: boolean;
    dateRange?: {
        start: Date;
        end: Date;
    };
}
interface ActorProfileEnrichment {
    actorId: string;
    externalIntelligence: ExternalIntelSource[];
    osintFindings: OSINTFinding[];
    communityContributions: CommunityContribution[];
    enrichedAt: Date;
    enrichmentQuality: number;
}
interface ExternalIntelSource {
    source: string;
    type: 'commercial' | 'government' | 'research' | 'community';
    data: Record<string, unknown>;
    confidence: number;
    retrievedAt: Date;
}
interface OSINTFinding {
    source: string;
    findingType: 'social-media' | 'paste-site' | 'forum' | 'blog' | 'news' | 'technical-report';
    content: string;
    relevance: number;
    discoveredAt: Date;
    url?: string;
}
interface CommunityContribution {
    contributorId: string;
    contributionType: 'ttp' | 'infrastructure' | 'capability' | 'relationship' | 'historical-activity';
    data: Record<string, unknown>;
    confidence: number;
    verified: boolean;
    submittedAt: Date;
}
interface ActorThreatAssessment {
    actorId: string;
    overallThreatLevel: 'low' | 'medium' | 'high' | 'critical';
    threatScore: number;
    capabilityScore: number;
    intentScore: number;
    opportunityScore: number;
    targetRelevance: number;
    likelihood: number;
    potentialImpact: number;
    assessmentDate: Date;
    assessedBy?: string;
    recommendations: ThreatRecommendation[];
}
interface ThreatRecommendation {
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'detection' | 'prevention' | 'mitigation' | 'monitoring';
    title: string;
    description: string;
    actionItems: string[];
    estimatedEffort: 'low' | 'medium' | 'high';
    estimatedCost?: 'low' | 'medium' | 'high';
}
/**
 * Creates a new threat actor profile with security validation.
 *
 * @param {Partial<ThreatActorProfile>} data - Actor profile data
 * @returns {ThreatActorProfile} Created threat actor profile
 *
 * @example
 * ```typescript
 * const actor = createThreatActorProfile({
 *   name: 'APT28',
 *   type: 'nation-state',
 *   sophistication: 'advanced',
 *   motivation: [{ type: 'espionage', confidence: 95 }]
 * });
 * ```
 */
export declare const createThreatActorProfile: (data: Partial<ThreatActorProfile>) => ThreatActorProfile;
/**
 * Validates threat actor profile data integrity.
 *
 * @param {ThreatActorProfile} profile - Actor profile to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateActorProfile(actor);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateActorProfile: (profile: ThreatActorProfile) => {
    valid: boolean;
    errors: string[];
};
/**
 * Performs multi-factor attribution scoring for an actor.
 *
 * @param {string} actorId - Actor identifier
 * @param {AttributionFactor[]} factors - Attribution factors
 * @returns {ActorAttributionResult} Attribution result with score
 *
 * @example
 * ```typescript
 * const attribution = performActorAttribution('apt28', [
 *   { factorType: 'ttp-match', score: 85, weight: 90 },
 *   { factorType: 'infrastructure-overlap', score: 75, weight: 80 }
 * ]);
 * ```
 */
export declare const performActorAttribution: (actorId: string, factors: AttributionFactor[], options?: {
    campaignId?: string;
    incidentId?: string;
    analyst?: string;
}) => ActorAttributionResult;
/**
 * Assesses actor capabilities and proficiency levels.
 *
 * @param {ActorCapabilityAssessment[]} capabilities - Actor capabilities
 * @returns {{ overallLevel: string; score: number; strengths: string[]; weaknesses: string[] }} Capability assessment
 *
 * @example
 * ```typescript
 * const assessment = assessActorCapabilities(capabilities);
 * console.log(`Overall level: ${assessment.overallLevel}, Score: ${assessment.score}`);
 * ```
 */
export declare const assessActorCapabilities: (capabilities: ActorCapabilityAssessment[]) => {
    overallLevel: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
};
/**
 * Analyzes actor motivation and intent.
 *
 * @param {ActorMotivation[]} motivations - Actor motivations
 * @returns {{ primary: ActorMotivation; secondary: ActorMotivation[]; intentScore: number }} Motivation analysis
 *
 * @example
 * ```typescript
 * const intent = analyzeActorIntent(motivations);
 * console.log(`Primary motivation: ${intent.primary.type}`);
 * ```
 */
export declare const analyzeActorIntent: (motivations: ActorMotivation[]) => {
    primary: ActorMotivation | null;
    secondary: ActorMotivation[];
    intentScore: number;
};
/**
 * Maps actor infrastructure and relationships.
 *
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure data
 * @returns {{ active: number; retired: number; types: Record<string, number>; threatLevels: Record<string, number> }} Infrastructure map
 *
 * @example
 * ```typescript
 * const infraMap = mapActorInfrastructure(infrastructure);
 * console.log(`Active infrastructure: ${infraMap.active}`);
 * ```
 */
export declare const mapActorInfrastructure: (infrastructure: ActorInfrastructureMapping[]) => {
    active: number;
    retired: number;
    types: Record<string, number>;
    roles: Record<string, number>;
    threatLevels: Record<string, number>;
    countries: Record<string, number>;
};
/**
 * Tracks historical actor activity and campaigns.
 *
 * @param {ActorHistoricalActivity[]} activities - Historical activities
 * @returns {{ totalCampaigns: number; activeOperations: number; impactDistribution: Record<string, number>; timeline: any[] }} Activity tracking
 *
 * @example
 * ```typescript
 * const tracking = trackActorHistory(activities);
 * console.log(`Total campaigns: ${tracking.totalCampaigns}`);
 * ```
 */
export declare const trackActorHistory: (activities: ActorHistoricalActivity[]) => {
    totalCampaigns: number;
    activeOperations: number;
    impactDistribution: Record<string, number>;
    sectorDistribution: Record<string, number>;
    timeline: {
        date: Date;
        count: number;
    }[];
};
/**
 * Builds actor relationship network graph.
 *
 * @param {ActorRelationshipNetwork[]} relationships - Actor relationships
 * @returns {{ nodes: string[]; edges: any[]; clusters: Record<string, string[]> }} Relationship network
 *
 * @example
 * ```typescript
 * const network = buildRelationshipNetwork(relationships);
 * console.log(`Network has ${network.nodes.length} actors`);
 * ```
 */
export declare const buildRelationshipNetwork: (relationships: ActorRelationshipNetwork[]) => {
    nodes: string[];
    edges: Array<{
        source: string;
        target: string;
        type: string;
        strength: number;
    }>;
    clusters: Record<string, string[]>;
};
/**
 * Profiles actor TTPs (Tactics, Techniques, Procedures).
 *
 * @param {ActorTTPProfile[]} ttps - Actor TTPs
 * @returns {{ signature: string[]; common: string[]; evolving: string[]; mitreMatrix: Record<string, number> }} TTP profile
 *
 * @example
 * ```typescript
 * const ttpProfile = profileActorTTPs(ttps);
 * console.log(`Signature TTPs: ${ttpProfile.signature.length}`);
 * ```
 */
export declare const profileActorTTPs: (ttps: ActorTTPProfile[]) => {
    signature: string[];
    common: string[];
    evolving: string[];
    mitreMatrix: Record<string, number>;
    detectionChallenges: string[];
};
/**
 * Tracks actor evolution over time.
 *
 * @param {ActorEvolutionTracking[]} evolutions - Evolution events
 * @returns {{ recentChanges: ActorEvolutionTracking[]; trends: Record<string, number>; riskTrend: string }} Evolution tracking
 *
 * @example
 * ```typescript
 * const evolution = trackActorEvolution(evolutions);
 * console.log(`Risk trend: ${evolution.riskTrend}`);
 * ```
 */
export declare const trackActorEvolution: (evolutions: ActorEvolutionTracking[]) => {
    recentChanges: ActorEvolutionTracking[];
    trends: Record<string, number>;
    riskTrend: "increasing" | "stable" | "decreasing";
    significantChanges: ActorEvolutionTracking[];
};
/**
 * Creates capability assessment for an actor.
 *
 * @param {Partial<ActorCapabilityAssessment>} data - Capability data
 * @returns {ActorCapabilityAssessment} Capability assessment
 *
 * @example
 * ```typescript
 * const capability = createCapabilityAssessment({
 *   actorId: 'apt28',
 *   category: 'malware',
 *   name: 'X-Agent',
 *   proficiencyLevel: 'expert'
 * });
 * ```
 */
export declare const createCapabilityAssessment: (data: Partial<ActorCapabilityAssessment>) => ActorCapabilityAssessment;
/**
 * Validates capability evidence for authenticity.
 *
 * @param {CapabilityEvidence[]} evidence - Evidence to validate
 * @returns {{ valid: boolean; score: number; issues: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCapabilityEvidence(evidence);
 * console.log(`Evidence validation score: ${validation.score}`);
 * ```
 */
export declare const validateCapabilityEvidence: (evidence: CapabilityEvidence[]) => {
    valid: boolean;
    score: number;
    issues: string[];
};
/**
 * Compares capabilities between two actors.
 *
 * @param {ActorCapabilityAssessment[]} actor1Caps - First actor capabilities
 * @param {ActorCapabilityAssessment[]} actor2Caps - Second actor capabilities
 * @returns {{ similarity: number; commonCapabilities: string[]; uniqueTo1: string[]; uniqueTo2: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareActorCapabilities(apt28Caps, apt29Caps);
 * console.log(`Capability similarity: ${comparison.similarity}%`);
 * ```
 */
export declare const compareActorCapabilities: (actor1Caps: ActorCapabilityAssessment[], actor2Caps: ActorCapabilityAssessment[]) => {
    similarity: number;
    commonCapabilities: string[];
    uniqueTo1: string[];
    uniqueTo2: string[];
};
/**
 * Identifies capability gaps for an actor.
 *
 * @param {ActorCapabilityAssessment[]} capabilities - Actor capabilities
 * @param {string[]} requiredCategories - Required capability categories
 * @returns {{ gaps: string[]; coverage: number; recommendations: string[] }} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = identifyCapabilityGaps(capabilities, ['malware', 'exploit', 'infrastructure']);
 * console.log(`Coverage: ${gaps.coverage}%`);
 * ```
 */
export declare const identifyCapabilityGaps: (capabilities: ActorCapabilityAssessment[], requiredCategories: string[]) => {
    gaps: string[];
    coverage: number;
    recommendations: string[];
};
/**
 * Calculates capability impact score.
 *
 * @param {ActorCapabilityAssessment} capability - Capability to assess
 * @returns {number} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = calculateCapabilityImpact(capability);
 * console.log(`Impact score: ${impact}`);
 * ```
 */
export declare const calculateCapabilityImpact: (capability: ActorCapabilityAssessment) => number;
/**
 * Creates infrastructure mapping entry.
 *
 * @param {Partial<ActorInfrastructureMapping>} data - Infrastructure data
 * @returns {ActorInfrastructureMapping} Infrastructure mapping
 *
 * @example
 * ```typescript
 * const infra = createInfrastructureMapping({
 *   actorId: 'apt28',
 *   infrastructureType: 'domain',
 *   value: 'evil-c2.com',
 *   role: 'c2'
 * });
 * ```
 */
export declare const createInfrastructureMapping: (data: Partial<ActorInfrastructureMapping>) => ActorInfrastructureMapping;
/**
 * Identifies infrastructure pivot points for investigation.
 *
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure data
 * @returns {{ pivotPoints: string[]; relatedClusters: Record<string, string[]> }} Pivot points
 *
 * @example
 * ```typescript
 * const pivots = identifyInfrastructurePivots(infrastructure);
 * console.log(`Found ${pivots.pivotPoints.length} pivot points`);
 * ```
 */
export declare const identifyInfrastructurePivots: (infrastructure: ActorInfrastructureMapping[]) => {
    pivotPoints: string[];
    relatedClusters: Record<string, string[]>;
};
/**
 * Analyzes infrastructure lifecycle and patterns.
 *
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure data
 * @returns {{ avgLifespan: number; rotationRate: number; patterns: string[] }} Lifecycle analysis
 *
 * @example
 * ```typescript
 * const lifecycle = analyzeInfrastructureLifecycle(infrastructure);
 * console.log(`Average lifespan: ${lifecycle.avgLifespan} days`);
 * ```
 */
export declare const analyzeInfrastructureLifecycle: (infrastructure: ActorInfrastructureMapping[]) => {
    avgLifespan: number;
    rotationRate: number;
    patterns: string[];
};
/**
 * Correlates infrastructure with threat level.
 *
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure data
 * @returns {{ critical: number; high: number; medium: number; low: number }} Threat level distribution
 *
 * @example
 * ```typescript
 * const threatDist = correlateInfrastructureThreatLevel(infrastructure);
 * console.log(`Critical infrastructure: ${threatDist.critical}`);
 * ```
 */
export declare const correlateInfrastructureThreatLevel: (infrastructure: ActorInfrastructureMapping[]) => {
    critical: number;
    high: number;
    medium: number;
    low: number;
};
/**
 * Creates actor relationship entry.
 *
 * @param {Partial<ActorRelationshipNetwork>} data - Relationship data
 * @returns {ActorRelationshipNetwork} Actor relationship
 *
 * @example
 * ```typescript
 * const relationship = createActorRelationship({
 *   sourceActorId: 'apt28',
 *   targetActorId: 'apt29',
 *   relationshipType: 'shares-infrastructure',
 *   strength: 75
 * });
 * ```
 */
export declare const createActorRelationship: (data: Partial<ActorRelationshipNetwork>) => ActorRelationshipNetwork;
/**
 * Calculates relationship strength based on evidence.
 *
 * @param {RelationshipEvidence[]} evidence - Relationship evidence
 * @returns {number} Relationship strength (0-100)
 *
 * @example
 * ```typescript
 * const strength = calculateRelationshipStrength(evidence);
 * console.log(`Relationship strength: ${strength}`);
 * ```
 */
export declare const calculateRelationshipStrength: (evidence: RelationshipEvidence[]) => number;
/**
 * Identifies actor clusters in relationship network.
 *
 * @param {ActorRelationshipNetwork[]} relationships - Relationships
 * @returns {{ clusters: string[][]; isolatedActors: string[] }} Cluster analysis
 *
 * @example
 * ```typescript
 * const clusters = identifyActorClusters(relationships);
 * console.log(`Found ${clusters.clusters.length} clusters`);
 * ```
 */
export declare const identifyActorClusters: (relationships: ActorRelationshipNetwork[]) => {
    clusters: string[][];
    isolatedActors: string[];
};
/**
 * Analyzes relationship evolution over time.
 *
 * @param {ActorRelationshipNetwork[]} relationships - Relationships
 * @returns {{ new: number; strengthening: number; weakening: number; dormant: number }} Evolution analysis
 *
 * @example
 * ```typescript
 * const evolution = analyzeRelationshipEvolution(relationships);
 * console.log(`New relationships: ${evolution.new}`);
 * ```
 */
export declare const analyzeRelationshipEvolution: (relationships: ActorRelationshipNetwork[]) => {
    new: number;
    strengthening: number;
    weakening: number;
    dormant: number;
};
/**
 * Creates TTP profile entry.
 *
 * @param {Partial<ActorTTPProfile>} data - TTP data
 * @returns {ActorTTPProfile} TTP profile
 *
 * @example
 * ```typescript
 * const ttp = createTTPProfile({
 *   actorId: 'apt28',
 *   mitreAttackId: 'T1566.001',
 *   tactic: 'Initial Access',
 *   technique: 'Phishing: Spearphishing Attachment'
 * });
 * ```
 */
export declare const createTTPProfile: (data: Partial<ActorTTPProfile>) => ActorTTPProfile;
/**
 * Calculates TTP uniqueness score for attribution.
 *
 * @param {ActorTTPProfile} ttp - TTP to analyze
 * @param {ActorTTPProfile[]} allTTPs - All known TTPs across actors
 * @returns {number} Uniqueness score (0-100)
 *
 * @example
 * ```typescript
 * const uniqueness = calculateTTPUniqueness(ttp, allKnownTTPs);
 * console.log(`TTP uniqueness: ${uniqueness}`);
 * ```
 */
export declare const calculateTTPUniqueness: (ttp: ActorTTPProfile, allTTPs: ActorTTPProfile[]) => number;
/**
 * Identifies TTP kill chain coverage.
 *
 * @param {ActorTTPProfile[]} ttps - Actor TTPs
 * @returns {{ coverage: number; missingPhases: string[]; strengths: string[] }} Kill chain analysis
 *
 * @example
 * ```typescript
 * const killChain = identifyTTPKillChainCoverage(ttps);
 * console.log(`Kill chain coverage: ${killChain.coverage}%`);
 * ```
 */
export declare const identifyTTPKillChainCoverage: (ttps: ActorTTPProfile[]) => {
    coverage: number;
    missingPhases: string[];
    strengths: string[];
};
/**
 * Generates TTP-based detection rules.
 *
 * @param {ActorTTPProfile[]} ttps - Actor TTPs
 * @returns {{ rules: string[]; priority: Record<string, number> }} Detection rules
 *
 * @example
 * ```typescript
 * const detectionRules = generateTTPDetectionRules(ttps);
 * console.log(`Generated ${detectionRules.rules.length} detection rules`);
 * ```
 */
export declare const generateTTPDetectionRules: (ttps: ActorTTPProfile[]) => {
    rules: string[];
    priority: Record<string, number>;
};
/**
 * Performs comprehensive threat assessment for an actor.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {object} context - Assessment context (capabilities, TTPs, infrastructure)
 * @returns {ActorThreatAssessment} Threat assessment
 *
 * @example
 * ```typescript
 * const assessment = performThreatAssessment(actor, { capabilities, ttps, infrastructure });
 * console.log(`Threat level: ${assessment.overallThreatLevel}`);
 * ```
 */
export declare const performThreatAssessment: (actor: ThreatActorProfile, context: {
    capabilities: ActorCapabilityAssessment[];
    ttps: ActorTTPProfile[];
    infrastructure: ActorInfrastructureMapping[];
    targetRelevance?: number;
}) => ActorThreatAssessment;
/**
 * Calculates actor risk score based on multiple factors.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {object} factors - Risk factors
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const riskScore = calculateActorRiskScore(actor, { recentActivity: 8, campaigns: 12 });
 * console.log(`Risk score: ${riskScore}`);
 * ```
 */
export declare const calculateActorRiskScore: (actor: ThreatActorProfile, factors: {
    recentActivityCount?: number;
    campaignCount?: number;
    victimCount?: number;
    infrastructureCount?: number;
}) => number;
/**
 * Generates actor profile enrichment from external sources.
 *
 * @param {string} actorId - Actor identifier
 * @param {ExternalIntelSource[]} sources - External intelligence sources
 * @returns {ActorProfileEnrichment} Enrichment data
 *
 * @example
 * ```typescript
 * const enrichment = enrichActorProfile('apt28', externalSources);
 * console.log(`Enrichment quality: ${enrichment.enrichmentQuality}`);
 * ```
 */
export declare const enrichActorProfile: (actorId: string, sources: ExternalIntelSource[], osintFindings?: OSINTFinding[], communityContributions?: CommunityContribution[]) => ActorProfileEnrichment;
/**
 * Searches for actors matching criteria.
 *
 * @param {ThreatActorProfile[]} actors - All actors
 * @param {ActorSearchCriteria} criteria - Search criteria
 * @returns {ThreatActorProfile[]} Matching actors
 *
 * @example
 * ```typescript
 * const results = searchActors(allActors, { type: 'nation-state', minConfidence: 70 });
 * console.log(`Found ${results.length} matching actors`);
 * ```
 */
export declare const searchActors: (actors: ThreatActorProfile[], criteria: ActorSearchCriteria) => ThreatActorProfile[];
/**
 * NestJS service for threat actor profiling operations.
 *
 * @example
 * ```typescript
 * import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
 * import { InjectModel } from '@nestjs/sequelize';
 * import { JwtService } from '@nestjs/jwt';
 * import * as bcrypt from 'bcrypt';
 *
 * @Injectable()
 * export class ThreatActorProfilingService {
 *   private readonly logger = new Logger(ThreatActorProfilingService.name);
 *
 *   constructor(
 *     @InjectModel(ThreatActorModel) private actorModel: typeof ThreatActorModel,
 *     @InjectModel(ActorCapabilityModel) private capabilityModel: typeof ActorCapabilityModel,
 *     @InjectModel(ActorInfrastructureModel) private infraModel: typeof ActorInfrastructureModel,
 *     @InjectModel(ActorTTPModel) private ttpModel: typeof ActorTTPModel,
 *     private jwtService: JwtService,
 *     private encryptionService: EncryptionService,
 *     private auditService: AuditService,
 *   ) {}
 *
 *   async createActorProfile(
 *     dto: CreateActorProfileDto,
 *     user: AuthenticatedUser,
 *   ): Promise<ThreatActorProfile> {
 *     // Role-based access control
 *     if (!user.permissions.includes('threat-intel:write')) {
 *       throw new ForbiddenException('Insufficient permissions to create actor profiles');
 *     }
 *
 *     const profile = createThreatActorProfile({
 *       ...dto,
 *       createdBy: user.id,
 *       lastModifiedBy: user.id,
 *     });
 *
 *     const validation = validateActorProfile(profile);
 *     if (!validation.valid) {
 *       throw new BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
 *     }
 *
 *     // Encrypt sensitive intelligence data
 *     if (dto.sensitiveIntel) {
 *       profile.encryptedIntel = await this.encryptionService.encrypt(dto.sensitiveIntel);
 *     }
 *
 *     const created = await this.actorModel.create(profile);
 *
 *     // Audit log
 *     await this.auditService.log({
 *       userId: user.id,
 *       action: 'CREATE_ACTOR_PROFILE',
 *       resource: 'threat-actor',
 *       resourceId: created.id,
 *       details: { name: profile.name, type: profile.type },
 *       severity: 'medium',
 *     });
 *
 *     this.logger.log(`Actor profile created: ${created.id} by user ${user.id}`);
 *     return created;
 *   }
 *
 *   async performAttribution(
 *     campaignId: string,
 *     actorCandidates: string[],
 *     user: AuthenticatedUser,
 *   ): Promise<ActorAttributionResult[]> {
 *     if (!user.permissions.includes('threat-intel:read')) {
 *       throw new ForbiddenException('Insufficient permissions');
 *     }
 *
 *     const results: ActorAttributionResult[] = [];
 *
 *     for (const actorId of actorCandidates) {
 *       const actor = await this.actorModel.findByPk(actorId, {
 *         include: ['capabilities', 'ttps', 'infrastructure'],
 *       });
 *
 *       if (!actor) continue;
 *
 *       // Gather attribution factors
 *       const factors: AttributionFactor[] = [];
 *
 *       // TTP matching
 *       const ttpMatch = await this.calculateTTPMatchScore(campaignId, actor.ttps);
 *       factors.push({
 *         factorType: 'ttp-match',
 *         score: ttpMatch.score,
 *         weight: 90,
 *         description: `${ttpMatch.matches} TTP matches found`,
 *         evidence: ttpMatch.matchedTTPs,
 *         confidence: ttpMatch.confidence,
 *       });
 *
 *       // Infrastructure overlap
 *       const infraOverlap = await this.calculateInfrastructureOverlap(campaignId, actor.infrastructure);
 *       factors.push({
 *         factorType: 'infrastructure-overlap',
 *         score: infraOverlap.score,
 *         weight: 85,
 *         description: `${infraOverlap.overlaps} infrastructure overlaps`,
 *         evidence: infraOverlap.overlappingInfra,
 *         confidence: infraOverlap.confidence,
 *       });
 *
 *       const attribution = performActorAttribution(actorId, factors, {
 *         campaignId,
 *         analyst: user.id,
 *       });
 *
 *       results.push(attribution);
 *     }
 *
 *     // Audit log
 *     await this.auditService.log({
 *       userId: user.id,
 *       action: 'PERFORM_ATTRIBUTION',
 *       resource: 'campaign',
 *       resourceId: campaignId,
 *       details: { candidates: actorCandidates.length, results: results.length },
 *       severity: 'high',
 *     });
 *
 *     return results.sort((a, b) => b.attributionScore - a.attributionScore);
 *   }
 *
 *   async assessThreat(
 *     actorId: string,
 *     organizationContext: { sectors: string[]; geography: string },
 *     user: AuthenticatedUser,
 *   ): Promise<ActorThreatAssessment> {
 *     if (!user.permissions.includes('threat-intel:read')) {
 *       throw new ForbiddenException('Insufficient permissions');
 *     }
 *
 *     const actor = await this.actorModel.findByPk(actorId, {
 *       include: ['capabilities', 'ttps', 'infrastructure'],
 *     });
 *
 *     if (!actor) {
 *       throw new NotFoundException(`Actor ${actorId} not found`);
 *     }
 *
 *     // Calculate target relevance
 *     const sectorMatch = actor.targetSectors.some(s => organizationContext.sectors.includes(s));
 *     const geoMatch = actor.targetGeographies.includes(organizationContext.geography);
 *     const targetRelevance = (sectorMatch ? 50 : 0) + (geoMatch ? 50 : 0);
 *
 *     const assessment = performThreatAssessment(actor, {
 *       capabilities: actor.capabilities,
 *       ttps: actor.ttps,
 *       infrastructure: actor.infrastructure,
 *       targetRelevance,
 *     });
 *
 *     assessment.assessedBy = user.id;
 *
 *     // Audit log for critical threat assessments
 *     if (assessment.overallThreatLevel === 'critical' || assessment.overallThreatLevel === 'high') {
 *       await this.auditService.log({
 *         userId: user.id,
 *         action: 'HIGH_THREAT_ASSESSMENT',
 *         resource: 'threat-actor',
 *         resourceId: actorId,
 *         details: { threatLevel: assessment.overallThreatLevel, threatScore: assessment.threatScore },
 *         severity: 'critical',
 *       });
 *     }
 *
 *     return assessment;
 *   }
 *
 *   async trackEvolution(actorId: string): Promise<ActorEvolutionTracking[]> {
 *     const evolutions = await this.evolutionModel.findAll({
 *       where: { actorId },
 *       order: [['detectedAt', 'DESC']],
 *       limit: 50,
 *     });
 *
 *     return evolutions;
 *   }
 *
 *   private async calculateTTPMatchScore(
 *     campaignId: string,
 *     actorTTPs: ActorTTPProfile[],
 *   ): Promise<{ score: number; matches: number; matchedTTPs: string[]; confidence: number }> {
 *     // Implementation details...
 *     return { score: 0, matches: 0, matchedTTPs: [], confidence: 0 };
 *   }
 *
 *   private async calculateInfrastructureOverlap(
 *     campaignId: string,
 *     actorInfra: ActorInfrastructureMapping[],
 *   ): Promise<{ score: number; overlaps: number; overlappingInfra: string[]; confidence: number }> {
 *     // Implementation details...
 *     return { score: 0, overlaps: 0, overlappingInfra: [], confidence: 0 };
 *   }
 * }
 * ```
 */
export declare const createThreatActorProfilingService: () => string;
/**
 * Sequelize model for ThreatActorProfile.
 *
 * @example
 * ```typescript
 * import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'threat_actor_profiles', timestamps: true })
 * export class ThreatActorModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false, unique: true })
 *   name: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   aliases: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('nation-state', 'criminal', 'hacktivist', 'insider', 'terrorist', 'unknown'),
 *     defaultValue: 'unknown',
 *   })
 *   type: string;
 *
 *   @Column({
 *     type: DataType.ENUM('minimal', 'low', 'medium', 'high', 'advanced', 'expert'),
 *     defaultValue: 'medium',
 *   })
 *   sophistication: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   motivation: object[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   primaryObjectives: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetSectors: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetGeographies: string[];
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
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   riskScore: number;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   attributionConfidence: number;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column(DataType.TEXT)
 *   encryptedIntel: string; // Encrypted sensitive intelligence
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: object;
 *
 *   @Column(DataType.UUID)
 *   createdBy: string;
 *
 *   @Column(DataType.UUID)
 *   lastModifiedBy: string;
 *
 *   @HasMany(() => ActorCapabilityModel)
 *   capabilities: ActorCapabilityModel[];
 *
 *   @HasMany(() => ActorInfrastructureModel)
 *   infrastructure: ActorInfrastructureModel[];
 *
 *   @HasMany(() => ActorTTPModel)
 *   ttps: ActorTTPModel[];
 *
 *   @HasMany(() => ActorRelationshipModel, 'sourceActorId')
 *   outgoingRelationships: ActorRelationshipModel[];
 *
 *   @HasMany(() => ActorRelationshipModel, 'targetActorId')
 *   incomingRelationships: ActorRelationshipModel[];
 * }
 *
 * @Table({ tableName: 'actor_capabilities', timestamps: true })
 * export class ActorCapabilityModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   actorId: string;
 *
 *   @Column({
 *     type: DataType.ENUM('malware', 'exploit', 'infrastructure', 'social-engineering', 'cryptography', 'evasion', 'persistence', 'lateral-movement'),
 *     allowNull: false,
 *   })
 *   category: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   name: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({
 *     type: DataType.ENUM('basic', 'intermediate', 'advanced', 'expert'),
 *     defaultValue: 'intermediate',
 *   })
 *   proficiencyLevel: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   evidence: object[];
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   impactScore: number;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   lastObserved: Date;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   firstObserved: Date;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 1 })
 *   observationCount: number;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: false })
 *   validated: boolean;
 * }
 *
 * @Table({ tableName: 'actor_infrastructure', timestamps: true })
 * export class ActorInfrastructureModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   actorId: string;
 *
 *   @Column({
 *     type: DataType.ENUM('domain', 'ip', 'url', 'email', 'certificate', 'asn', 'registrar', 'hosting-provider'),
 *     allowNull: false,
 *   })
 *   infrastructureType: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   value: string;
 *
 *   @Column({
 *     type: DataType.ENUM('c2', 'phishing', 'malware-distribution', 'data-exfiltration', 'staging', 'reconnaissance', 'vpn-exit'),
 *     allowNull: false,
 *   })
 *   role: string;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   active: boolean;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   firstSeen: Date;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   lastSeen: Date;
 *
 *   @Column(DataType.STRING)
 *   country: string;
 *
 *   @Column(DataType.STRING)
 *   asn: string;
 *
 *   @Column(DataType.STRING)
 *   registrar: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   relatedInfrastructure: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('low', 'medium', 'high', 'critical'),
 *     defaultValue: 'medium',
 *   })
 *   threatLevel: string;
 *
 *   @Column(DataType.TEXT)
 *   encryptedDetails: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: object;
 * }
 * ```
 */
export declare const createThreatActorModels: () => string;
/**
 * Swagger API documentation for threat actor profiling endpoints.
 *
 * @example
 * ```typescript
 * import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
 * import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 * import { RolesGuard } from '../auth/guards/roles.guard';
 * import { Roles } from '../auth/decorators/roles.decorator';
 * import { CurrentUser } from '../auth/decorators/current-user.decorator';
 *
 * @ApiTags('Threat Actor Profiling')
 * @ApiBearerAuth()
 * @ApiSecurity('api-key')
 * @Controller('api/v1/threat-actors')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class ThreatActorProfilingController {
 *   constructor(private readonly profilingService: ThreatActorProfilingService) {}
 *
 *   @Post()
 *   @Roles('analyst', 'admin')
 *   @ApiOperation({ summary: 'Create new threat actor profile' })
 *   @ApiResponse({ status: 201, description: 'Actor profile created successfully' })
 *   @ApiResponse({ status: 400, description: 'Validation failed' })
 *   @ApiResponse({ status: 403, description: 'Insufficient permissions' })
 *   async createProfile(
 *     @Body() dto: CreateActorProfileDto,
 *     @CurrentUser() user: AuthenticatedUser,
 *   ): Promise<ThreatActorProfile> {
 *     return this.profilingService.createActorProfile(dto, user);
 *   }
 *
 *   @Post(':id/attribution')
 *   @Roles('analyst', 'admin')
 *   @ApiOperation({ summary: 'Perform actor attribution for campaign' })
 *   @ApiResponse({ status: 200, description: 'Attribution completed successfully' })
 *   @ApiResponse({ status: 404, description: 'Actor or campaign not found' })
 *   async performAttribution(
 *     @Param('id') actorId: string,
 *     @Body() dto: PerformAttributionDto,
 *     @CurrentUser() user: AuthenticatedUser,
 *   ): Promise<ActorAttributionResult[]> {
 *     return this.profilingService.performAttribution(dto.campaignId, [actorId], user);
 *   }
 *
 *   @Get(':id/assessment')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Get threat assessment for actor' })
 *   @ApiResponse({ status: 200, description: 'Assessment retrieved successfully' })
 *   @ApiResponse({ status: 404, description: 'Actor not found' })
 *   async getThreatAssessment(
 *     @Param('id') actorId: string,
 *     @Query() context: OrganizationContextDto,
 *     @CurrentUser() user: AuthenticatedUser,
 *   ): Promise<ActorThreatAssessment> {
 *     return this.profilingService.assessThreat(actorId, context, user);
 *   }
 *
 *   @Get(':id/capabilities')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Get actor capability assessment' })
 *   @ApiResponse({ status: 200, description: 'Capabilities retrieved successfully' })
 *   async getCapabilities(@Param('id') actorId: string): Promise<ActorCapabilityAssessment[]> {
 *     return this.profilingService.getCapabilities(actorId);
 *   }
 *
 *   @Get(':id/infrastructure')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Get actor infrastructure mapping' })
 *   @ApiResponse({ status: 200, description: 'Infrastructure retrieved successfully' })
 *   async getInfrastructure(@Param('id') actorId: string): Promise<ActorInfrastructureMapping[]> {
 *     return this.profilingService.getInfrastructure(actorId);
 *   }
 *
 *   @Get(':id/relationships')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Get actor relationship network' })
 *   @ApiResponse({ status: 200, description: 'Relationships retrieved successfully' })
 *   async getRelationships(@Param('id') actorId: string): Promise<ActorRelationshipNetwork[]> {
 *     return this.profilingService.getRelationships(actorId);
 *   }
 *
 *   @Get(':id/evolution')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Get actor evolution tracking' })
 *   @ApiResponse({ status: 200, description: 'Evolution data retrieved successfully' })
 *   async getEvolution(@Param('id') actorId: string): Promise<ActorEvolutionTracking[]> {
 *     return this.profilingService.trackEvolution(actorId);
 *   }
 *
 *   @Get('search')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Search threat actors' })
 *   @ApiResponse({ status: 200, description: 'Search completed successfully' })
 *   async searchActors(@Query() criteria: ActorSearchDto): Promise<ThreatActorProfile[]> {
 *     return this.profilingService.search(criteria);
 *   }
 * }
 * ```
 */
export declare const createThreatActorSwaggerDocs: () => string;
/**
 * Merges duplicate actor profiles.
 *
 * @param {ThreatActorProfile[]} profiles - Profiles to merge
 * @returns {ThreatActorProfile} Merged profile
 *
 * @example
 * ```typescript
 * const merged = mergeActorProfiles([profile1, profile2]);
 * console.log(`Merged profile: ${merged.name}`);
 * ```
 */
export declare const mergeActorProfiles: (profiles: ThreatActorProfile[]) => ThreatActorProfile;
/**
 * Detects actor dormancy based on activity.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {number} dormancyDays - Days of inactivity threshold
 * @returns {{ isDormant: boolean; daysSinceActivity: number }} Dormancy status
 *
 * @example
 * ```typescript
 * const status = detectActorDormancy(actor, 90);
 * console.log(`Is dormant: ${status.isDormant}`);
 * ```
 */
export declare const detectActorDormancy: (actor: ThreatActorProfile, dormancyDays?: number) => {
    isDormant: boolean;
    daysSinceActivity: number;
};
/**
 * Generates actor risk timeline.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {ActorHistoricalActivity[]} activities - Historical activities
 * @returns {{ timeline: Array<{ date: Date; riskScore: number }>; trend: string }} Risk timeline
 *
 * @example
 * ```typescript
 * const timeline = generateActorRiskTimeline(actor, activities);
 * console.log(`Risk trend: ${timeline.trend}`);
 * ```
 */
export declare const generateActorRiskTimeline: (actor: ThreatActorProfile, activities: ActorHistoricalActivity[]) => {
    timeline: Array<{
        date: Date;
        riskScore: number;
    }>;
    trend: "increasing" | "stable" | "decreasing";
};
/**
 * Calculates actor persistence score.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {ActorHistoricalActivity[]} activities - Historical activities
 * @returns {number} Persistence score (0-100)
 *
 * @example
 * ```typescript
 * const persistence = calculateActorPersistence(actor, activities);
 * console.log(`Persistence score: ${persistence}`);
 * ```
 */
export declare const calculateActorPersistence: (actor: ThreatActorProfile, activities: ActorHistoricalActivity[]) => number;
/**
 * Identifies actor operational security patterns.
 *
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure data
 * @param {ActorTTPProfile[]} ttps - TTP data
 * @returns {{ opsecLevel: string; indicators: string[]; score: number }} OpSec analysis
 *
 * @example
 * ```typescript
 * const opsec = identifyActorOpSec(infrastructure, ttps);
 * console.log(`OpSec level: ${opsec.opsecLevel}`);
 * ```
 */
export declare const identifyActorOpSec: (infrastructure: ActorInfrastructureMapping[], ttps: ActorTTPProfile[]) => {
    opsecLevel: "poor" | "basic" | "good" | "excellent";
    indicators: string[];
    score: number;
};
/**
 * Generates actor hunting queries.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {ActorTTPProfile[]} ttps - Actor TTPs
 * @param {ActorInfrastructureMapping[]} infrastructure - Infrastructure
 * @returns {{ queries: string[]; iocs: string[]; signatures: string[] }} Hunting package
 *
 * @example
 * ```typescript
 * const hunting = generateActorHuntingQueries(actor, ttps, infrastructure);
 * console.log(`Generated ${hunting.queries.length} hunting queries`);
 * ```
 */
export declare const generateActorHuntingQueries: (actor: ThreatActorProfile, ttps: ActorTTPProfile[], infrastructure: ActorInfrastructureMapping[]) => {
    queries: string[];
    iocs: string[];
    signatures: string[];
};
/**
 * Exports actor profile to STIX format.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {object} relatedData - Related data (capabilities, TTPs, infrastructure)
 * @returns {object} STIX-formatted actor profile
 *
 * @example
 * ```typescript
 * const stix = exportActorToSTIX(actor, { capabilities, ttps, infrastructure });
 * console.log(JSON.stringify(stix, null, 2));
 * ```
 */
export declare const exportActorToSTIX: (actor: ThreatActorProfile, relatedData: {
    capabilities?: ActorCapabilityAssessment[];
    ttps?: ActorTTPProfile[];
    infrastructure?: ActorInfrastructureMapping[];
}) => object;
/**
 * Validates actor profile completeness.
 *
 * @param {ThreatActorProfile} actor - Actor profile
 * @param {object} relatedData - Related data
 * @returns {{ completeness: number; missingFields: string[]; recommendations: string[] }} Completeness assessment
 *
 * @example
 * ```typescript
 * const assessment = validateActorCompleteness(actor, { capabilities, ttps });
 * console.log(`Profile completeness: ${assessment.completeness}%`);
 * ```
 */
export declare const validateActorCompleteness: (actor: ThreatActorProfile, relatedData: {
    capabilities?: ActorCapabilityAssessment[];
    ttps?: ActorTTPProfile[];
    infrastructure?: ActorInfrastructureMapping[];
    relationships?: ActorRelationshipNetwork[];
}) => {
    completeness: number;
    missingFields: string[];
    recommendations: string[];
};
export {};
//# sourceMappingURL=threat-actor-profiling-kit.d.ts.map