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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  confidence: number; // 0-100
  riskScore: number; // 0-100
  attributionConfidence: number; // 0-100
  description?: string;
  encryptedIntel?: string; // Encrypted sensitive intelligence
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // User ID
  lastModifiedBy?: string; // User ID
}

interface ActorMotivation {
  type: 'financial' | 'espionage' | 'sabotage' | 'ideology' | 'revenge' | 'notoriety' | 'disruption' | 'unknown';
  description?: string;
  confidence: number; // 0-100
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
  confidence: number; // 0-100
  impactScore: number; // 0-100
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
  confidence: number; // 0-100
  firstSeen: Date;
  lastSeen: Date;
  country?: string;
  asn?: string;
  registrar?: string;
  relatedInfrastructure: string[]; // IDs of related infrastructure
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  encryptedDetails?: string; // Encrypted sensitive infrastructure data
  metadata?: Record<string, unknown>;
}

interface ActorTTPProfile {
  actorId: string;
  mitreAttackId: string; // e.g., "T1566.001"
  tactic: string; // e.g., "Initial Access"
  technique: string; // e.g., "Phishing: Spearphishing Attachment"
  subTechnique?: string;
  procedureDescription?: string;
  frequency: 'rare' | 'occasional' | 'common' | 'frequent' | 'signature';
  confidence: number; // 0-100
  observationCount: number;
  firstObserved: Date;
  lastObserved: Date;
  successRate?: number; // 0-100
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
  strength: number; // 0-100, strength of relationship
  confidence: number; // 0-100
  evidence: RelationshipEvidence[];
  active: boolean;
  firstObserved: Date;
  lastObserved: Date;
  bidirectional: boolean;
}

interface RelationshipEvidence {
  type: 'infrastructure-overlap' | 'ttp-similarity' | 'malware-sharing' | 'target-overlap' | 'timing-correlation' | 'intelligence-report';
  description: string;
  weight: number; // 0-100
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
  attributionScore: number; // 0-100
  confidence: number; // 0-100
  attributionFactors: AttributionFactor[];
  analyst?: string;
  analysisDate: Date;
  validatedBy?: string;
  validationDate?: Date;
  notes?: string;
}

interface AttributionFactor {
  factorType: 'ttp-match' | 'infrastructure-overlap' | 'malware-similarity' | 'target-pattern' | 'timing-pattern' | 'linguistic-analysis' | 'tool-fingerprint';
  score: number; // 0-100
  weight: number; // 0-100, importance in overall attribution
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
  dateRange?: { start: Date; end: Date };
}

interface ActorProfileEnrichment {
  actorId: string;
  externalIntelligence: ExternalIntelSource[];
  osintFindings: OSINTFinding[];
  communityContributions: CommunityContribution[];
  enrichedAt: Date;
  enrichmentQuality: number; // 0-100
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
  relevance: number; // 0-100
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
  threatScore: number; // 0-100
  capabilityScore: number; // 0-100
  intentScore: number; // 0-100
  opportunityScore: number; // 0-100
  targetRelevance: number; // 0-100, relevance to organization
  likelihood: number; // 0-100, likelihood of targeting organization
  potentialImpact: number; // 0-100
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

// ============================================================================
// ACTOR ATTRIBUTION FUNCTIONS
// ============================================================================

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
export const createThreatActorProfile = (data: Partial<ThreatActorProfile>): ThreatActorProfile => {
  const now = new Date();
  return {
    id: data.id || `actor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name || 'Unknown Actor',
    aliases: data.aliases || [],
    type: data.type || 'unknown',
    sophistication: data.sophistication || 'medium',
    motivation: data.motivation || [],
    primaryObjectives: data.primaryObjectives || [],
    targetSectors: data.targetSectors || [],
    targetGeographies: data.targetGeographies || [],
    firstSeen: data.firstSeen || now,
    lastSeen: data.lastSeen || now,
    active: data.active ?? true,
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    riskScore: Math.min(100, Math.max(0, data.riskScore || 50)),
    attributionConfidence: Math.min(100, Math.max(0, data.attributionConfidence || 50)),
    description: data.description,
    encryptedIntel: data.encryptedIntel,
    metadata: data.metadata || {},
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    createdBy: data.createdBy,
    lastModifiedBy: data.lastModifiedBy,
  };
};

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
export const validateActorProfile = (profile: ThreatActorProfile): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!profile.name || profile.name.trim().length === 0) {
    errors.push('Actor name is required');
  }

  if (profile.confidence < 0 || profile.confidence > 100) {
    errors.push('Confidence must be between 0 and 100');
  }

  if (profile.riskScore < 0 || profile.riskScore > 100) {
    errors.push('Risk score must be between 0 and 100');
  }

  if (profile.firstSeen > profile.lastSeen) {
    errors.push('First seen date cannot be after last seen date');
  }

  if (profile.motivation.length === 0) {
    errors.push('At least one motivation should be specified');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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
export const performActorAttribution = (
  actorId: string,
  factors: AttributionFactor[],
  options?: { campaignId?: string; incidentId?: string; analyst?: string },
): ActorAttributionResult => {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  factors.forEach(factor => {
    totalWeightedScore += factor.score * factor.weight;
    totalWeight += factor.weight;
  });

  const attributionScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  // Calculate confidence based on number of factors and their individual confidence
  const avgFactorConfidence = factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length;
  const factorCountBonus = Math.min(20, factors.length * 5); // Bonus for multiple factors
  const confidence = Math.min(100, Math.round(avgFactorConfidence + factorCountBonus));

  return {
    actorId,
    campaignId: options?.campaignId,
    incidentId: options?.incidentId,
    attributionScore,
    confidence,
    attributionFactors: factors,
    analyst: options?.analyst,
    analysisDate: new Date(),
  };
};

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
export const assessActorCapabilities = (
  capabilities: ActorCapabilityAssessment[],
): { overallLevel: string; score: number; strengths: string[]; weaknesses: string[] } => {
  if (capabilities.length === 0) {
    return { overallLevel: 'minimal', score: 0, strengths: [], weaknesses: ['No capabilities identified'] };
  }

  const levelScores = { basic: 25, intermediate: 50, advanced: 75, expert: 100 };
  const avgScore = capabilities.reduce((sum, cap) => {
    const levelScore = levelScores[cap.proficiencyLevel];
    const weightedScore = levelScore * (cap.confidence / 100);
    return sum + weightedScore;
  }, 0) / capabilities.length;

  let overallLevel = 'minimal';
  if (avgScore >= 80) overallLevel = 'expert';
  else if (avgScore >= 65) overallLevel = 'advanced';
  else if (avgScore >= 40) overallLevel = 'intermediate';
  else if (avgScore >= 20) overallLevel = 'basic';

  const expertCaps = capabilities.filter(c => c.proficiencyLevel === 'expert' || c.proficiencyLevel === 'advanced');
  const basicCaps = capabilities.filter(c => c.proficiencyLevel === 'basic');

  const strengths = expertCaps.map(c => `${c.category}: ${c.name}`);
  const weaknesses = basicCaps.map(c => `Limited ${c.category} capabilities`);

  return {
    overallLevel,
    score: Math.round(avgScore),
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 3),
  };
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
export const analyzeActorIntent = (
  motivations: ActorMotivation[],
): { primary: ActorMotivation | null; secondary: ActorMotivation[]; intentScore: number } => {
  if (motivations.length === 0) {
    return { primary: null, secondary: [], intentScore: 0 };
  }

  const sorted = [...motivations].sort((a, b) => b.confidence - a.confidence);
  const primary = sorted[0];
  const secondary = sorted.slice(1, 3);

  const intentScore = Math.round(
    motivations.reduce((sum, m) => sum + m.confidence, 0) / motivations.length,
  );

  return { primary, secondary, intentScore };
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
export const mapActorInfrastructure = (
  infrastructure: ActorInfrastructureMapping[],
): {
  active: number;
  retired: number;
  types: Record<string, number>;
  roles: Record<string, number>;
  threatLevels: Record<string, number>;
  countries: Record<string, number>;
} => {
  const active = infrastructure.filter(i => i.active).length;
  const retired = infrastructure.length - active;

  const types: Record<string, number> = {};
  const roles: Record<string, number> = {};
  const threatLevels: Record<string, number> = {};
  const countries: Record<string, number> = {};

  infrastructure.forEach(infra => {
    types[infra.infrastructureType] = (types[infra.infrastructureType] || 0) + 1;
    roles[infra.role] = (roles[infra.role] || 0) + 1;
    threatLevels[infra.threatLevel] = (threatLevels[infra.threatLevel] || 0) + 1;
    if (infra.country) {
      countries[infra.country] = (countries[infra.country] || 0) + 1;
    }
  });

  return { active, retired, types, roles, threatLevels, countries };
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
export const trackActorHistory = (
  activities: ActorHistoricalActivity[],
): {
  totalCampaigns: number;
  activeOperations: number;
  impactDistribution: Record<string, number>;
  sectorDistribution: Record<string, number>;
  timeline: { date: Date; count: number }[];
} => {
  const totalCampaigns = activities.filter(a => a.activityType === 'campaign').length;
  const activeOperations = activities.filter(a => !a.endDate || a.endDate > new Date()).length;

  const impactDistribution: Record<string, number> = {};
  const sectorDistribution: Record<string, number> = {};

  activities.forEach(activity => {
    impactDistribution[activity.impactLevel] = (impactDistribution[activity.impactLevel] || 0) + 1;
    activity.targetSectors.forEach(sector => {
      sectorDistribution[sector] = (sectorDistribution[sector] || 0) + 1;
    });
  });

  // Create timeline
  const sortedActivities = [...activities].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const timeline = sortedActivities.map(a => ({
    date: a.startDate,
    count: 1,
  }));

  return {
    totalCampaigns,
    activeOperations,
    impactDistribution,
    sectorDistribution,
    timeline,
  };
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
export const buildRelationshipNetwork = (
  relationships: ActorRelationshipNetwork[],
): {
  nodes: string[];
  edges: Array<{ source: string; target: string; type: string; strength: number }>;
  clusters: Record<string, string[]>;
} => {
  const nodesSet = new Set<string>();
  const edges: Array<{ source: string; target: string; type: string; strength: number }> = [];
  const clusters: Record<string, string[]> = {};

  relationships.forEach(rel => {
    nodesSet.add(rel.sourceActorId);
    nodesSet.add(rel.targetActorId);

    edges.push({
      source: rel.sourceActorId,
      target: rel.targetActorId,
      type: rel.relationshipType,
      strength: rel.strength,
    });

    // Cluster by relationship type
    if (!clusters[rel.relationshipType]) {
      clusters[rel.relationshipType] = [];
    }
    if (!clusters[rel.relationshipType].includes(rel.sourceActorId)) {
      clusters[rel.relationshipType].push(rel.sourceActorId);
    }
    if (!clusters[rel.relationshipType].includes(rel.targetActorId)) {
      clusters[rel.relationshipType].push(rel.targetActorId);
    }
  });

  return {
    nodes: Array.from(nodesSet),
    edges,
    clusters,
  };
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
export const profileActorTTPs = (
  ttps: ActorTTPProfile[],
): {
  signature: string[];
  common: string[];
  evolving: string[];
  mitreMatrix: Record<string, number>;
  detectionChallenges: string[];
} => {
  const signature = ttps.filter(t => t.frequency === 'signature').map(t => t.mitreAttackId);
  const common = ttps.filter(t => t.frequency === 'frequent' || t.frequency === 'common').map(t => t.mitreAttackId);

  // Evolving TTPs are those observed recently with increasing frequency
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const evolving = ttps
    .filter(t => t.lastObserved > thirtyDaysAgo && t.observationCount > 3)
    .map(t => t.mitreAttackId);

  // MITRE ATT&CK matrix by tactic
  const mitreMatrix: Record<string, number> = {};
  ttps.forEach(t => {
    mitreMatrix[t.tactic] = (mitreMatrix[t.tactic] || 0) + 1;
  });

  // Identify detection challenges
  const hardToDetect = ttps.filter(t => t.detectionDifficulty === 'hard' || t.detectionDifficulty === 'very-hard');
  const detectionChallenges = hardToDetect.map(t => `${t.technique} (${t.detectionDifficulty})`);

  return {
    signature,
    common,
    evolving,
    mitreMatrix,
    detectionChallenges: detectionChallenges.slice(0, 5),
  };
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
export const trackActorEvolution = (
  evolutions: ActorEvolutionTracking[],
): {
  recentChanges: ActorEvolutionTracking[];
  trends: Record<string, number>;
  riskTrend: 'increasing' | 'stable' | 'decreasing';
  significantChanges: ActorEvolutionTracking[];
} => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentChanges = evolutions.filter(e => e.detectedAt > thirtyDaysAgo);

  const trends: Record<string, number> = {};
  evolutions.forEach(e => {
    trends[e.evolutionType] = (trends[e.evolutionType] || 0) + 1;
  });

  // Determine risk trend
  const sophisticationIncreases = evolutions.filter(e => e.evolutionType === 'sophistication-increase').length;
  const capabilityUpgrades = evolutions.filter(e => e.evolutionType === 'capability-upgrade').length;
  const highImpactChanges = evolutions.filter(e => e.impact === 'high').length;

  let riskTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (sophisticationIncreases > 2 || capabilityUpgrades > 3 || highImpactChanges > 2) {
    riskTrend = 'increasing';
  } else if (evolutions.length > 0 && recentChanges.length === 0) {
    riskTrend = 'decreasing';
  }

  const significantChanges = evolutions.filter(e => e.impact === 'high' && e.confidence > 70);

  return {
    recentChanges,
    trends,
    riskTrend,
    significantChanges,
  };
};

// ============================================================================
// ACTOR CAPABILITY ASSESSMENT FUNCTIONS
// ============================================================================

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
export const createCapabilityAssessment = (data: Partial<ActorCapabilityAssessment>): ActorCapabilityAssessment => {
  const now = new Date();
  return {
    actorId: data.actorId || '',
    category: data.category || 'malware',
    name: data.name || '',
    description: data.description || '',
    proficiencyLevel: data.proficiencyLevel || 'intermediate',
    evidence: data.evidence || [],
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    impactScore: Math.min(100, Math.max(0, data.impactScore || 50)),
    lastObserved: data.lastObserved || now,
    firstObserved: data.firstObserved || now,
    observationCount: data.observationCount || 1,
    validated: data.validated ?? false,
  };
};

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
export const validateCapabilityEvidence = (
  evidence: CapabilityEvidence[],
): { valid: boolean; score: number; issues: string[] } => {
  const issues: string[] = [];

  if (evidence.length === 0) {
    issues.push('No evidence provided');
    return { valid: false, score: 0, issues };
  }

  let totalScore = 0;
  evidence.forEach((e, idx) => {
    if (!e.source || e.source.trim().length === 0) {
      issues.push(`Evidence ${idx + 1}: Missing source`);
    }
    if (e.confidence < 30) {
      issues.push(`Evidence ${idx + 1}: Low confidence (${e.confidence}%)`);
    }
    totalScore += e.confidence;
  });

  const avgScore = totalScore / evidence.length;
  const valid = issues.length === 0 && avgScore >= 50;

  return {
    valid,
    score: Math.round(avgScore),
    issues,
  };
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
export const compareActorCapabilities = (
  actor1Caps: ActorCapabilityAssessment[],
  actor2Caps: ActorCapabilityAssessment[],
): {
  similarity: number;
  commonCapabilities: string[];
  uniqueTo1: string[];
  uniqueTo2: string[];
} => {
  const caps1 = new Set(actor1Caps.map(c => `${c.category}:${c.name}`));
  const caps2 = new Set(actor2Caps.map(c => `${c.category}:${c.name}`));

  const common = new Set([...caps1].filter(x => caps2.has(x)));
  const uniqueTo1 = [...caps1].filter(x => !caps2.has(x));
  const uniqueTo2 = [...caps2].filter(x => !caps1.has(x));

  const union = new Set([...caps1, ...caps2]);
  const similarity = union.size > 0 ? Math.round((common.size / union.size) * 100) : 0;

  return {
    similarity,
    commonCapabilities: Array.from(common),
    uniqueTo1,
    uniqueTo2,
  };
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
export const identifyCapabilityGaps = (
  capabilities: ActorCapabilityAssessment[],
  requiredCategories: string[],
): { gaps: string[]; coverage: number; recommendations: string[] } => {
  const presentCategories = new Set(capabilities.map(c => c.category));
  const gaps = requiredCategories.filter(cat => !presentCategories.has(cat));
  const coverage = Math.round(((requiredCategories.length - gaps.length) / requiredCategories.length) * 100);

  const recommendations: string[] = [];
  gaps.forEach(gap => {
    recommendations.push(`Monitor for ${gap} capability development`);
  });

  return { gaps, coverage, recommendations };
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
export const calculateCapabilityImpact = (capability: ActorCapabilityAssessment): number => {
  const proficiencyScores = { basic: 25, intermediate: 50, advanced: 75, expert: 100 };
  const proficiencyScore = proficiencyScores[capability.proficiencyLevel];

  // Weight by confidence and observation count
  const confidenceWeight = capability.confidence / 100;
  const observationWeight = Math.min(1, capability.observationCount / 10);

  const impact = proficiencyScore * confidenceWeight * (0.7 + 0.3 * observationWeight);

  return Math.round(impact);
};

// ============================================================================
// INFRASTRUCTURE MAPPING FUNCTIONS
// ============================================================================

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
export const createInfrastructureMapping = (data: Partial<ActorInfrastructureMapping>): ActorInfrastructureMapping => {
  const now = new Date();
  return {
    actorId: data.actorId || '',
    infrastructureType: data.infrastructureType || 'domain',
    value: data.value || '',
    role: data.role || 'reconnaissance',
    active: data.active ?? true,
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    firstSeen: data.firstSeen || now,
    lastSeen: data.lastSeen || now,
    country: data.country,
    asn: data.asn,
    registrar: data.registrar,
    relatedInfrastructure: data.relatedInfrastructure || [],
    threatLevel: data.threatLevel || 'medium',
    encryptedDetails: data.encryptedDetails,
    metadata: data.metadata || {},
  };
};

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
export const identifyInfrastructurePivots = (
  infrastructure: ActorInfrastructureMapping[],
): {
  pivotPoints: string[];
  relatedClusters: Record<string, string[]>;
} => {
  const pivotPoints: string[] = [];
  const relatedClusters: Record<string, string[]> = {};

  infrastructure.forEach(infra => {
    if (infra.relatedInfrastructure.length > 2) {
      pivotPoints.push(infra.value);
      relatedClusters[infra.value] = infra.relatedInfrastructure;
    }

    // ASN and registrar are good pivots
    if (infra.asn) {
      const asnKey = `ASN:${infra.asn}`;
      if (!relatedClusters[asnKey]) relatedClusters[asnKey] = [];
      relatedClusters[asnKey].push(infra.value);
    }

    if (infra.registrar) {
      const regKey = `REGISTRAR:${infra.registrar}`;
      if (!relatedClusters[regKey]) relatedClusters[regKey] = [];
      relatedClusters[regKey].push(infra.value);
    }
  });

  return { pivotPoints, relatedClusters };
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
export const analyzeInfrastructureLifecycle = (
  infrastructure: ActorInfrastructureMapping[],
): {
  avgLifespan: number;
  rotationRate: number;
  patterns: string[];
} => {
  if (infrastructure.length === 0) {
    return { avgLifespan: 0, rotationRate: 0, patterns: [] };
  }

  let totalLifespan = 0;
  infrastructure.forEach(infra => {
    const lifespan = (infra.lastSeen.getTime() - infra.firstSeen.getTime()) / (1000 * 60 * 60 * 24);
    totalLifespan += lifespan;
  });

  const avgLifespan = Math.round(totalLifespan / infrastructure.length);

  // Calculate rotation rate (new infrastructure per month)
  const sortedInfra = [...infrastructure].sort((a, b) => a.firstSeen.getTime() - b.firstSeen.getTime());
  const firstDate = sortedInfra[0]?.firstSeen;
  const lastDate = sortedInfra[sortedInfra.length - 1]?.firstSeen;
  const months = firstDate && lastDate ? (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30) : 1;
  const rotationRate = Math.round(infrastructure.length / Math.max(1, months));

  const patterns: string[] = [];
  if (avgLifespan < 30) patterns.push('Short-lived infrastructure (burn and churn)');
  if (rotationRate > 5) patterns.push('High rotation rate');
  if (avgLifespan > 180) patterns.push('Long-term persistent infrastructure');

  return { avgLifespan, rotationRate, patterns };
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
export const correlateInfrastructureThreatLevel = (
  infrastructure: ActorInfrastructureMapping[],
): { critical: number; high: number; medium: number; low: number } => {
  const distribution = { critical: 0, high: 0, medium: 0, low: 0 };

  infrastructure.forEach(infra => {
    distribution[infra.threatLevel] += 1;
  });

  return distribution;
};

// ============================================================================
// RELATIONSHIP NETWORK FUNCTIONS
// ============================================================================

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
export const createActorRelationship = (data: Partial<ActorRelationshipNetwork>): ActorRelationshipNetwork => {
  const now = new Date();
  return {
    sourceActorId: data.sourceActorId || '',
    targetActorId: data.targetActorId || '',
    relationshipType: data.relationshipType || 'partner',
    strength: Math.min(100, Math.max(0, data.strength || 50)),
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    evidence: data.evidence || [],
    active: data.active ?? true,
    firstObserved: data.firstObserved || now,
    lastObserved: data.lastObserved || now,
    bidirectional: data.bidirectional ?? false,
  };
};

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
export const calculateRelationshipStrength = (evidence: RelationshipEvidence[]): number => {
  if (evidence.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  evidence.forEach(e => {
    totalWeightedScore += e.weight;
    totalWeight += e.weight;
  });

  // Bonus for multiple evidence types
  const uniqueTypes = new Set(evidence.map(e => e.type));
  const diversityBonus = Math.min(20, uniqueTypes.size * 5);

  const baseStrength = totalWeight > 0 ? (totalWeightedScore / evidence.length) : 0;
  return Math.min(100, Math.round(baseStrength + diversityBonus));
};

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
export const identifyActorClusters = (
  relationships: ActorRelationshipNetwork[],
): {
  clusters: string[][];
  isolatedActors: string[];
} => {
  const adjacencyMap: Record<string, Set<string>> = {};

  // Build adjacency map
  relationships.forEach(rel => {
    if (!adjacencyMap[rel.sourceActorId]) adjacencyMap[rel.sourceActorId] = new Set();
    if (!adjacencyMap[rel.targetActorId]) adjacencyMap[rel.targetActorId] = new Set();

    adjacencyMap[rel.sourceActorId].add(rel.targetActorId);
    if (rel.bidirectional) {
      adjacencyMap[rel.targetActorId].add(rel.sourceActorId);
    }
  });

  const visited = new Set<string>();
  const clusters: string[][] = [];

  const dfs = (actorId: string, cluster: string[]) => {
    if (visited.has(actorId)) return;
    visited.add(actorId);
    cluster.push(actorId);

    const neighbors = adjacencyMap[actorId] || new Set();
    neighbors.forEach(neighbor => {
      dfs(neighbor, cluster);
    });
  };

  Object.keys(adjacencyMap).forEach(actorId => {
    if (!visited.has(actorId)) {
      const cluster: string[] = [];
      dfs(actorId, cluster);
      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    }
  });

  const allActorsInClusters = new Set(clusters.flat());
  const isolatedActors = Object.keys(adjacencyMap).filter(a => !allActorsInClusters.has(a));

  return { clusters, isolatedActors };
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
export const analyzeRelationshipEvolution = (
  relationships: ActorRelationshipNetwork[],
): {
  new: number;
  strengthening: number;
  weakening: number;
  dormant: number;
} => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newRels = relationships.filter(r => r.firstObserved > thirtyDaysAgo).length;
  const dormant = relationships.filter(r => r.lastObserved < thirtyDaysAgo && r.active).length;

  // Strengthening/weakening would require historical data comparison
  // For now, we'll use strength as a proxy
  const strengthening = relationships.filter(r => r.strength > 70 && r.lastObserved > thirtyDaysAgo).length;
  const weakening = relationships.filter(r => r.strength < 30 && r.lastObserved > thirtyDaysAgo).length;

  return { new: newRels, strengthening, weakening, dormant };
};

// ============================================================================
// TTP PROFILING FUNCTIONS
// ============================================================================

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
export const createTTPProfile = (data: Partial<ActorTTPProfile>): ActorTTPProfile => {
  const now = new Date();
  return {
    actorId: data.actorId || '',
    mitreAttackId: data.mitreAttackId || '',
    tactic: data.tactic || '',
    technique: data.technique || '',
    subTechnique: data.subTechnique,
    procedureDescription: data.procedureDescription,
    frequency: data.frequency || 'occasional',
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    observationCount: data.observationCount || 1,
    firstObserved: data.firstObserved || now,
    lastObserved: data.lastObserved || now,
    successRate: data.successRate,
    detectionDifficulty: data.detectionDifficulty || 'medium',
    mitigations: data.mitigations || [],
    relatedCVEs: data.relatedCVEs || [],
  };
};

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
export const calculateTTPUniqueness = (ttp: ActorTTPProfile, allTTPs: ActorTTPProfile[]): number => {
  const sameActorTTPs = allTTPs.filter(t => t.actorId === ttp.actorId);
  const otherActorTTPs = allTTPs.filter(t => t.actorId !== ttp.actorId);

  const othersUsingTTP = otherActorTTPs.filter(t => t.mitreAttackId === ttp.mitreAttackId).length;
  const totalOtherActors = new Set(otherActorTTPs.map(t => t.actorId)).size;

  if (totalOtherActors === 0) return 100;

  const usageRate = othersUsingTTP / totalOtherActors;
  const uniqueness = Math.round((1 - usageRate) * 100);

  return uniqueness;
};

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
export const identifyTTPKillChainCoverage = (
  ttps: ActorTTPProfile[],
): {
  coverage: number;
  missingPhases: string[];
  strengths: string[];
} => {
  const killChainPhases = [
    'Reconnaissance',
    'Resource Development',
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command and Control',
    'Exfiltration',
    'Impact',
  ];

  const observedPhases = new Set(ttps.map(t => t.tactic));
  const missingPhases = killChainPhases.filter(phase => !observedPhases.has(phase));
  const coverage = Math.round((observedPhases.size / killChainPhases.length) * 100);

  // Identify strength phases (multiple TTPs with high frequency)
  const phaseCounts: Record<string, number> = {};
  ttps.forEach(t => {
    if (t.frequency === 'frequent' || t.frequency === 'signature') {
      phaseCounts[t.tactic] = (phaseCounts[t.tactic] || 0) + 1;
    }
  });

  const strengths = Object.entries(phaseCounts)
    .filter(([_, count]) => count >= 2)
    .map(([phase, _]) => phase);

  return { coverage, missingPhases, strengths };
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
export const generateTTPDetectionRules = (
  ttps: ActorTTPProfile[],
): {
  rules: string[];
  priority: Record<string, number>;
} => {
  const rules: string[] = [];
  const priority: Record<string, number> = {};

  ttps.forEach(ttp => {
    const ruleName = `detect_${ttp.mitreAttackId.replace(/\./g, '_')}`;
    rules.push(ruleName);

    // Priority based on frequency and detection difficulty
    const frequencyScores = { rare: 20, occasional: 40, common: 60, frequent: 80, signature: 100 };
    const difficultyScores = { easy: 20, medium: 50, hard: 80, 'very-hard': 100 };

    const freqScore = frequencyScores[ttp.frequency] || 40;
    const diffScore = difficultyScores[ttp.detectionDifficulty] || 50;

    priority[ruleName] = Math.round((freqScore + diffScore) / 2);
  });

  return { rules, priority };
};

// ============================================================================
// ACTOR THREAT ASSESSMENT FUNCTIONS
// ============================================================================

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
export const performThreatAssessment = (
  actor: ThreatActorProfile,
  context: {
    capabilities: ActorCapabilityAssessment[];
    ttps: ActorTTPProfile[];
    infrastructure: ActorInfrastructureMapping[];
    targetRelevance?: number;
  },
): ActorThreatAssessment => {
  // Calculate capability score
  const capabilityAssessment = assessActorCapabilities(context.capabilities);
  const capabilityScore = capabilityAssessment.score;

  // Calculate intent score
  const intentAnalysis = analyzeActorIntent(actor.motivation);
  const intentScore = intentAnalysis.intentScore;

  // Calculate opportunity score
  const opportunityScore = Math.min(100, context.infrastructure.filter(i => i.active).length * 10);

  // Calculate target relevance (provided or default)
  const targetRelevance = context.targetRelevance || 50;

  // Calculate overall threat score
  const threatScore = Math.round((capabilityScore * 0.3 + intentScore * 0.25 + opportunityScore * 0.25 + targetRelevance * 0.2));

  // Calculate likelihood
  const likelihood = Math.round((intentScore + targetRelevance) / 2);

  // Calculate potential impact
  const potentialImpact = Math.round((capabilityScore + actor.riskScore) / 2);

  // Determine overall threat level
  let overallThreatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (threatScore >= 80) overallThreatLevel = 'critical';
  else if (threatScore >= 60) overallThreatLevel = 'high';
  else if (threatScore >= 40) overallThreatLevel = 'medium';

  // Generate recommendations
  const recommendations: ThreatRecommendation[] = [];

  if (capabilityScore > 70) {
    recommendations.push({
      priority: 'high',
      category: 'detection',
      title: 'Enhance Detection Capabilities',
      description: 'Actor demonstrates advanced capabilities requiring enhanced detection',
      actionItems: ['Deploy advanced EDR', 'Enable behavioral analytics', 'Implement deception technology'],
      estimatedEffort: 'high',
      estimatedCost: 'high',
    });
  }

  if (context.infrastructure.filter(i => i.active).length > 10) {
    recommendations.push({
      priority: 'medium',
      category: 'prevention',
      title: 'Block Known Infrastructure',
      description: 'Actor maintains extensive active infrastructure',
      actionItems: ['Update firewall rules', 'Configure DNS filtering', 'Deploy threat intelligence feeds'],
      estimatedEffort: 'medium',
      estimatedCost: 'low',
    });
  }

  if (intentScore > 75 && targetRelevance > 60) {
    recommendations.push({
      priority: 'critical',
      category: 'monitoring',
      title: 'Increase Monitoring for Actor Activity',
      description: 'High intent and target relevance indicate elevated risk',
      actionItems: ['Deploy targeted threat hunting', 'Enable 24/7 SOC monitoring', 'Conduct tabletop exercises'],
      estimatedEffort: 'high',
      estimatedCost: 'medium',
    });
  }

  return {
    actorId: actor.id,
    overallThreatLevel,
    threatScore,
    capabilityScore,
    intentScore,
    opportunityScore,
    targetRelevance,
    likelihood,
    potentialImpact,
    assessmentDate: new Date(),
    recommendations,
  };
};

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
export const calculateActorRiskScore = (
  actor: ThreatActorProfile,
  factors: {
    recentActivityCount?: number;
    campaignCount?: number;
    victimCount?: number;
    infrastructureCount?: number;
  },
): number => {
  const sophisticationScores = { minimal: 10, low: 25, medium: 50, high: 75, advanced: 90, expert: 100 };
  const sophisticationScore = sophisticationScores[actor.sophistication];

  const activityScore = Math.min(100, (factors.recentActivityCount || 0) * 5);
  const campaignScore = Math.min(100, (factors.campaignCount || 0) * 3);
  const victimScore = Math.min(100, (factors.victimCount || 0) * 2);
  const infraScore = Math.min(100, (factors.infrastructureCount || 0) * 2);

  const riskScore = Math.round(
    sophisticationScore * 0.3 +
    activityScore * 0.25 +
    campaignScore * 0.2 +
    victimScore * 0.15 +
    infraScore * 0.1,
  );

  return Math.min(100, Math.max(0, riskScore));
};

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
export const enrichActorProfile = (
  actorId: string,
  sources: ExternalIntelSource[],
  osintFindings?: OSINTFinding[],
  communityContributions?: CommunityContribution[],
): ActorProfileEnrichment => {
  const qualityScores = sources.map(s => s.confidence);
  const enrichmentQuality = qualityScores.length > 0
    ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
    : 0;

  return {
    actorId,
    externalIntelligence: sources,
    osintFindings: osintFindings || [],
    communityContributions: communityContributions || [],
    enrichedAt: new Date(),
    enrichmentQuality,
  };
};

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
export const searchActors = (
  actors: ThreatActorProfile[],
  criteria: ActorSearchCriteria,
): ThreatActorProfile[] => {
  return actors.filter(actor => {
    if (criteria.name && !actor.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false;
    }

    if (criteria.type && actor.type !== criteria.type) {
      return false;
    }

    if (criteria.sophistication && actor.sophistication !== criteria.sophistication) {
      return false;
    }

    if (criteria.minConfidence && actor.confidence < criteria.minConfidence) {
      return false;
    }

    if (criteria.minRiskScore && actor.riskScore < criteria.minRiskScore) {
      return false;
    }

    if (criteria.active !== undefined && actor.active !== criteria.active) {
      return false;
    }

    if (criteria.targetSector && !actor.targetSectors.includes(criteria.targetSector)) {
      return false;
    }

    if (criteria.targetGeography && !actor.targetGeographies.includes(criteria.targetGeography)) {
      return false;
    }

    if (criteria.motivations && criteria.motivations.length > 0) {
      const hasMotivation = actor.motivation.some(m => criteria.motivations!.includes(m.type));
      if (!hasMotivation) return false;
    }

    if (criteria.dateRange) {
      if (actor.lastSeen < criteria.dateRange.start || actor.firstSeen > criteria.dateRange.end) {
        return false;
      }
    }

    return true;
  });
};

// ============================================================================
// NESTJS SERVICE EXAMPLES
// ============================================================================

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
export const createThreatActorProfilingService = (): string => {
  return 'ThreatActorProfilingService template - see example above';
};

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createThreatActorModels = (): string => {
  return 'ThreatActor Sequelize models - see example above';
};

// ============================================================================
// SWAGGER/OPENAPI DOCUMENTATION
// ============================================================================

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
export const createThreatActorSwaggerDocs = (): string => {
  return 'Swagger API documentation - see example above';
};

// ============================================================================
// ADDITIONAL PROFILING FUNCTIONS
// ============================================================================

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
export const mergeActorProfiles = (profiles: ThreatActorProfile[]): ThreatActorProfile => {
  if (profiles.length === 0) {
    throw new Error('No profiles to merge');
  }

  const primary = profiles[0];
  const allAliases = new Set<string>();
  const allMotivations: ActorMotivation[] = [];
  const allSectors = new Set<string>();
  const allGeographies = new Set<string>();

  profiles.forEach(profile => {
    profile.aliases.forEach(alias => allAliases.add(alias));
    allMotivations.push(...profile.motivation);
    profile.targetSectors.forEach(sector => allSectors.add(sector));
    profile.targetGeographies.forEach(geo => allGeographies.add(geo));
  });

  return {
    ...primary,
    aliases: Array.from(allAliases),
    motivation: allMotivations,
    targetSectors: Array.from(allSectors),
    targetGeographies: Array.from(allGeographies),
    confidence: Math.round(profiles.reduce((sum, p) => sum + p.confidence, 0) / profiles.length),
  };
};

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
export const detectActorDormancy = (
  actor: ThreatActorProfile,
  dormancyDays: number = 90,
): { isDormant: boolean; daysSinceActivity: number } => {
  const now = new Date();
  const daysSinceActivity = Math.floor((now.getTime() - actor.lastSeen.getTime()) / (1000 * 60 * 60 * 24));
  const isDormant = daysSinceActivity >= dormancyDays;

  return { isDormant, daysSinceActivity };
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
export const generateActorRiskTimeline = (
  actor: ThreatActorProfile,
  activities: ActorHistoricalActivity[],
): { timeline: Array<{ date: Date; riskScore: number }>; trend: 'increasing' | 'stable' | 'decreasing' } => {
  const sortedActivities = [...activities].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const impactScores = { low: 25, medium: 50, high: 75, critical: 100 };
  const timeline = sortedActivities.map(activity => ({
    date: activity.startDate,
    riskScore: impactScores[activity.impactLevel],
  }));

  // Determine trend
  if (timeline.length < 2) {
    return { timeline, trend: 'stable' };
  }

  const recentScore = timeline[timeline.length - 1].riskScore;
  const previousScore = timeline[timeline.length - 2].riskScore;

  let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (recentScore > previousScore + 10) trend = 'increasing';
  else if (recentScore < previousScore - 10) trend = 'decreasing';

  return { timeline, trend };
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
export const calculateActorPersistence = (
  actor: ThreatActorProfile,
  activities: ActorHistoricalActivity[],
): number => {
  const actorAgeDays = (actor.lastSeen.getTime() - actor.firstSeen.getTime()) / (1000 * 60 * 60 * 24);
  const activityCount = activities.length;

  // Persistence based on longevity and consistent activity
  const longevityScore = Math.min(50, (actorAgeDays / 365) * 10); // Max 50 points for 5+ years
  const activityScore = Math.min(50, activityCount * 2); // Max 50 points for 25+ activities

  return Math.round(longevityScore + activityScore);
};

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
export const identifyActorOpSec = (
  infrastructure: ActorInfrastructureMapping[],
  ttps: ActorTTPProfile[],
): { opsecLevel: 'poor' | 'basic' | 'good' | 'excellent'; indicators: string[]; score: number } => {
  const indicators: string[] = [];
  let score = 50; // Base score

  // Infrastructure privacy
  const privacyProtected = infrastructure.filter(i => i.metadata?.privacyProtected).length;
  if (privacyProtected > infrastructure.length * 0.5) {
    score += 15;
    indicators.push('Uses privacy protection on domains');
  }

  // Evasion techniques
  const evasionTTPs = ttps.filter(t => t.tactic === 'Defense Evasion').length;
  if (evasionTTPs > 5) {
    score += 20;
    indicators.push('Multiple evasion techniques employed');
  }

  // Detection difficulty
  const hardToDetect = ttps.filter(t => t.detectionDifficulty === 'hard' || t.detectionDifficulty === 'very-hard').length;
  if (hardToDetect > ttps.length * 0.3) {
    score += 15;
    indicators.push('Favors hard-to-detect techniques');
  }

  let opsecLevel: 'poor' | 'basic' | 'good' | 'excellent' = 'basic';
  if (score >= 85) opsecLevel = 'excellent';
  else if (score >= 70) opsecLevel = 'good';
  else if (score < 40) opsecLevel = 'poor';

  return { opsecLevel, indicators, score: Math.min(100, score) };
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
export const generateActorHuntingQueries = (
  actor: ThreatActorProfile,
  ttps: ActorTTPProfile[],
  infrastructure: ActorInfrastructureMapping[],
): { queries: string[]; iocs: string[]; signatures: string[] } => {
  const queries: string[] = [];
  const iocs: string[] = [];
  const signatures: string[] = [];

  // TTP-based queries
  ttps.slice(0, 5).forEach(ttp => {
    queries.push(`event.category:process AND process.name:* AND mitre.technique.id:"${ttp.mitreAttackId}"`);
  });

  // Infrastructure IOCs
  infrastructure.filter(i => i.active).forEach(infra => {
    iocs.push(infra.value);
    if (infra.infrastructureType === 'domain') {
      queries.push(`dns.question.name:"${infra.value}" OR destination.domain:"${infra.value}"`);
    }
  });

  // Actor signatures
  signatures.push(`actor_name:"${actor.name}"`);
  actor.aliases.forEach(alias => {
    signatures.push(`actor_alias:"${alias}"`);
  });

  return { queries: queries.slice(0, 10), iocs: iocs.slice(0, 20), signatures };
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
export const exportActorToSTIX = (
  actor: ThreatActorProfile,
  relatedData: {
    capabilities?: ActorCapabilityAssessment[];
    ttps?: ActorTTPProfile[];
    infrastructure?: ActorInfrastructureMapping[];
  },
): object => {
  return {
    type: 'bundle',
    id: `bundle--${actor.id}`,
    objects: [
      {
        type: 'threat-actor',
        id: `threat-actor--${actor.id}`,
        name: actor.name,
        aliases: actor.aliases,
        labels: [actor.type],
        sophistication: actor.sophistication,
        resource_level: actor.sophistication,
        primary_motivation: actor.motivation[0]?.type || 'unknown',
        goals: actor.primaryObjectives,
        threat_actor_types: [actor.type],
        first_seen: actor.firstSeen.toISOString(),
        last_seen: actor.lastSeen.toISOString(),
      },
    ],
  };
};

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
export const validateActorCompleteness = (
  actor: ThreatActorProfile,
  relatedData: {
    capabilities?: ActorCapabilityAssessment[];
    ttps?: ActorTTPProfile[];
    infrastructure?: ActorInfrastructureMapping[];
    relationships?: ActorRelationshipNetwork[];
  },
): { completeness: number; missingFields: string[]; recommendations: string[] } => {
  const missingFields: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Core fields (40 points)
  if (actor.name && actor.name !== 'Unknown Actor') score += 10;
  else missingFields.push('name');

  if (actor.type !== 'unknown') score += 10;
  else missingFields.push('type');

  if (actor.motivation.length > 0) score += 10;
  else missingFields.push('motivation');

  if (actor.description && actor.description.length > 50) score += 10;
  else missingFields.push('detailed description');

  // Related data (60 points)
  if (relatedData.capabilities && relatedData.capabilities.length > 0) score += 15;
  else {
    missingFields.push('capabilities');
    recommendations.push('Add capability assessments');
  }

  if (relatedData.ttps && relatedData.ttps.length >= 5) score += 15;
  else {
    missingFields.push('sufficient TTPs');
    recommendations.push('Document at least 5 TTPs');
  }

  if (relatedData.infrastructure && relatedData.infrastructure.length > 0) score += 15;
  else {
    missingFields.push('infrastructure');
    recommendations.push('Map actor infrastructure');
  }

  if (relatedData.relationships && relatedData.relationships.length > 0) score += 15;
  else {
    missingFields.push('relationships');
    recommendations.push('Identify actor relationships');
  }

  return { completeness: score, missingFields, recommendations };
};
