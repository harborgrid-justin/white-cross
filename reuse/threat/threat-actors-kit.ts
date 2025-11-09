/**
 * LOC: THAC1234567
 * File: /reuse/threat/threat-actors-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Security analysis modules
 *   - Attribution engines
 */

/**
 * File: /reuse/threat/threat-actors-kit.ts
 * Locator: WC-UTL-THAC-001
 * Purpose: Comprehensive Threat Actor Intelligence - profiling, attribution, TTP mapping, capability assessment
 *
 * Upstream: Independent utility module for threat actor analysis
 * Downstream: ../backend/*, Threat intelligence services, Security modules, Attribution engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 42 utility functions for threat actor profiling, capability assessment, TTP mapping, attribution
 *
 * LLM Context: Comprehensive threat actor intelligence utilities for White Cross security platform.
 * Provides actor profiling, capability assessment, motivation analysis, infrastructure tracking, TTP mapping,
 * attribution confidence scoring, relationship graphs, and actor intelligence management.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  type: 'nation-state' | 'criminal' | 'hacktivist' | 'insider' | 'terrorist' | 'unknown';
  sophistication: 'minimal' | 'low' | 'medium' | 'high' | 'advanced' | 'expert';
  motivation: ActorMotivation[];
  firstSeen: Date;
  lastSeen: Date;
  active: boolean;
  confidence: number; // 0-100
  description?: string;
  metadata?: Record<string, unknown>;
}

interface ActorMotivation {
  type: 'financial' | 'espionage' | 'sabotage' | 'ideology' | 'revenge' | 'notoriety' | 'unknown';
  description?: string;
  confidence: number; // 0-100
}

interface ActorCapability {
  actorId: string;
  category: 'malware' | 'exploit' | 'infrastructure' | 'social-engineering' | 'cryptography' | 'evasion';
  name: string;
  description: string;
  proficiencyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  evidence: string[];
  confidence: number;
  lastObserved: Date;
}

interface ActorTTP {
  actorId: string;
  mitreAttackId: string; // e.g., "T1566.001"
  tactic: string; // e.g., "Initial Access"
  technique: string; // e.g., "Phishing: Spearphishing Attachment"
  procedureDescription?: string;
  frequency: 'rare' | 'occasional' | 'common' | 'frequent';
  confidence: number;
  observationCount: number;
  firstObserved: Date;
  lastObserved: Date;
}

interface ActorInfrastructure {
  actorId: string;
  type: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'registrar';
  value: string;
  role: 'c2' | 'phishing' | 'malware-distribution' | 'data-exfiltration' | 'staging' | 'reconnaissance';
  active: boolean;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  metadata?: Record<string, unknown>;
}

interface ActorAttribution {
  actorId: string;
  campaignId?: string;
  incidentId?: string;
  confidence: number; // 0-100
  evidenceScore: number; // 0-100
  attributionMethod: 'ttp-match' | 'infrastructure-overlap' | 'malware-analysis' | 'intelligence-report' | 'collaborative';
  evidence: AttributionEvidence[];
  analyst?: string;
  timestamp: Date;
  notes?: string;
}

interface AttributionEvidence {
  type: 'ttp' | 'infrastructure' | 'malware' | 'target' | 'timing' | 'linguistic' | 'tooling';
  description: string;
  weight: number; // 0-100
  source?: string;
}

interface ActorRelationship {
  sourceActorId: string;
  targetActorId: string;
  relationshipType: 'parent' | 'subsidiary' | 'partner' | 'competitor' | 'shares-infrastructure' | 'shares-tools';
  confidence: number;
  evidence: string[];
  active: boolean;
  firstObserved: Date;
  lastObserved: Date;
}

interface ActorProfile {
  actor: ThreatActor;
  capabilities: ActorCapability[];
  ttps: ActorTTP[];
  infrastructure: ActorInfrastructure[];
  relationships: ActorRelationship[];
  attributions: ActorAttribution[];
  targetSectors: string[];
  targetGeographies: string[];
  timeline: ActorTimelineEvent[];
}

interface ActorTimelineEvent {
  timestamp: Date;
  eventType: 'campaign' | 'capability-acquisition' | 'infrastructure-change' | 'ttp-evolution' | 'attribution';
  description: string;
  confidence: number;
  references?: string[];
}

interface ActorSearchCriteria {
  name?: string;
  type?: ThreatActor['type'];
  sophistication?: ThreatActor['sophistication'];
  motivations?: ActorMotivation['type'][];
  minConfidence?: number;
  active?: boolean;
  hasInfrastructure?: boolean;
  targetSector?: string;
  targetGeography?: string;
}

interface ActorAnalysisReport {
  actor: ThreatActor;
  riskScore: number; // 0-100
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  capabilityAssessment: {
    overallLevel: 'minimal' | 'low' | 'medium' | 'high' | 'advanced';
    strengths: string[];
    weaknesses: string[];
  };
  activityTrend: 'increasing' | 'stable' | 'decreasing' | 'sporadic';
  recommendations: string[];
  generatedAt: Date;
}

// ============================================================================
// ACTOR PROFILE UTILITIES
// ============================================================================

/**
 * Creates a new threat actor profile with validation.
 *
 * @param {Partial<ThreatActor>} actorData - Actor data
 * @returns {ThreatActor} Validated threat actor
 * @throws {Error} If required fields are missing or invalid
 *
 * @example
 * ```typescript
 * const actor = createThreatActor({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy', 'Strontium'],
 *   type: 'nation-state',
 *   sophistication: 'advanced',
 *   motivation: [{ type: 'espionage', confidence: 95 }]
 * });
 * // Result: { id: 'uuid', name: 'APT28', ... }
 * ```
 */
export const createThreatActor = (actorData: Partial<ThreatActor>): ThreatActor => {
  if (!actorData.name) {
    throw new Error('Actor name is required');
  }

  const now = new Date();
  return {
    id: actorData.id || generateActorId(),
    name: actorData.name,
    aliases: actorData.aliases || [],
    type: actorData.type || 'unknown',
    sophistication: actorData.sophistication || 'medium',
    motivation: actorData.motivation || [],
    firstSeen: actorData.firstSeen || now,
    lastSeen: actorData.lastSeen || now,
    active: actorData.active ?? true,
    confidence: actorData.confidence ?? 50,
    description: actorData.description,
    metadata: actorData.metadata || {},
  };
};

/**
 * Validates threat actor profile for completeness and consistency.
 *
 * @param {ThreatActor} actor - Actor to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateThreatActor(actor);
 * // Result: true (or throws error)
 * ```
 */
export const validateThreatActor = (actor: ThreatActor): boolean => {
  if (!actor.id || !actor.name) {
    throw new Error('Actor must have id and name');
  }

  if (actor.confidence < 0 || actor.confidence > 100) {
    throw new Error('Confidence must be between 0 and 100');
  }

  if (actor.firstSeen > actor.lastSeen) {
    throw new Error('First seen date cannot be after last seen date');
  }

  return true;
};

/**
 * Enriches actor profile with additional intelligence data.
 *
 * @param {ThreatActor} actor - Base actor profile
 * @param {Partial<ActorProfile>} enrichmentData - Additional data to merge
 * @returns {ActorProfile} Enriched actor profile
 *
 * @example
 * ```typescript
 * const enriched = enrichActorProfile(actor, {
 *   capabilities: newCapabilities,
 *   infrastructure: discoveredInfrastructure
 * });
 * ```
 */
export const enrichActorProfile = (
  actor: ThreatActor,
  enrichmentData: Partial<ActorProfile>,
): ActorProfile => {
  return {
    actor,
    capabilities: enrichmentData.capabilities || [],
    ttps: enrichmentData.ttps || [],
    infrastructure: enrichmentData.infrastructure || [],
    relationships: enrichmentData.relationships || [],
    attributions: enrichmentData.attributions || [],
    targetSectors: enrichmentData.targetSectors || [],
    targetGeographies: enrichmentData.targetGeographies || [],
    timeline: enrichmentData.timeline || [],
  };
};

/**
 * Merges multiple actor profiles (deduplication for aliases).
 *
 * @param {ThreatActor[]} actors - Actors to merge
 * @returns {ThreatActor} Merged actor profile
 *
 * @example
 * ```typescript
 * const merged = mergeActorProfiles([actor1, actor2]);
 * // Combines aliases, takes highest confidence, most recent dates
 * ```
 */
export const mergeActorProfiles = (actors: ThreatActor[]): ThreatActor => {
  if (actors.length === 0) {
    throw new Error('No actors to merge');
  }

  const primary = actors[0];
  const allAliases = new Set(primary.aliases);
  let maxConfidence = primary.confidence;
  let latestSeen = primary.lastSeen;
  let earliestSeen = primary.firstSeen;

  actors.slice(1).forEach((actor) => {
    actor.aliases.forEach(alias => allAliases.add(alias));
    allAliases.add(actor.name);
    maxConfidence = Math.max(maxConfidence, actor.confidence);
    latestSeen = actor.lastSeen > latestSeen ? actor.lastSeen : latestSeen;
    earliestSeen = actor.firstSeen < earliestSeen ? actor.firstSeen : earliestSeen;
  });

  return {
    ...primary,
    aliases: Array.from(allAliases).filter(a => a !== primary.name),
    confidence: maxConfidence,
    firstSeen: earliestSeen,
    lastSeen: latestSeen,
  };
};

// ============================================================================
// CAPABILITY ASSESSMENT UTILITIES
// ============================================================================

/**
 * Assesses actor capability level based on observed capabilities.
 *
 * @param {ActorCapability[]} capabilities - Actor's capabilities
 * @returns {ThreatActor['sophistication']} Assessed sophistication level
 *
 * @example
 * ```typescript
 * const level = assessActorCapabilities(capabilities);
 * // Result: 'advanced'
 * ```
 */
export const assessActorCapabilities = (
  capabilities: ActorCapability[],
): ThreatActor['sophistication'] => {
  if (capabilities.length === 0) return 'minimal';

  const expertCount = capabilities.filter(c => c.proficiencyLevel === 'expert').length;
  const advancedCount = capabilities.filter(c => c.proficiencyLevel === 'advanced').length;

  if (expertCount >= 3 || (expertCount >= 1 && advancedCount >= 3)) return 'expert';
  if (expertCount >= 1 || advancedCount >= 2) return 'advanced';
  if (advancedCount >= 1 || capabilities.length >= 5) return 'high';
  if (capabilities.length >= 3) return 'medium';
  return 'low';
};

/**
 * Adds capability to actor profile with evidence.
 *
 * @param {ActorCapability[]} capabilities - Existing capabilities
 * @param {Omit<ActorCapability, 'lastObserved'>} newCapability - New capability to add
 * @returns {ActorCapability[]} Updated capabilities list
 *
 * @example
 * ```typescript
 * const updated = addActorCapability(capabilities, {
 *   actorId: 'apt28',
 *   category: 'malware',
 *   name: 'Custom RAT Development',
 *   proficiencyLevel: 'advanced',
 *   evidence: ['incident-123', 'malware-sample-456'],
 *   confidence: 85
 * });
 * ```
 */
export const addActorCapability = (
  capabilities: ActorCapability[],
  newCapability: Omit<ActorCapability, 'lastObserved'>,
): ActorCapability[] => {
  const existing = capabilities.find(
    c => c.actorId === newCapability.actorId && c.name === newCapability.name,
  );

  const capability: ActorCapability = {
    ...newCapability,
    lastObserved: new Date(),
  };

  if (existing) {
    // Update existing capability
    return capabilities.map(c =>
      c.actorId === newCapability.actorId && c.name === newCapability.name
        ? {
            ...c,
            ...capability,
            evidence: [...new Set([...c.evidence, ...capability.evidence])],
            confidence: Math.max(c.confidence, capability.confidence),
          }
        : c,
    );
  }

  return [...capabilities, capability];
};

/**
 * Calculates capability coverage across categories.
 *
 * @param {ActorCapability[]} capabilities - Actor's capabilities
 * @returns {Record<ActorCapability['category'], number>} Coverage percentage by category
 *
 * @example
 * ```typescript
 * const coverage = calculateCapabilityCoverage(capabilities);
 * // Result: { malware: 80, exploit: 60, infrastructure: 40, ... }
 * ```
 */
export const calculateCapabilityCoverage = (
  capabilities: ActorCapability[],
): Record<ActorCapability['category'], number> => {
  const categories: ActorCapability['category'][] = [
    'malware',
    'exploit',
    'infrastructure',
    'social-engineering',
    'cryptography',
    'evasion',
  ];

  const maxPerCategory = 5; // Arbitrary max for percentage calculation

  return categories.reduce((acc, category) => {
    const count = capabilities.filter(c => c.category === category).length;
    acc[category] = Math.min(100, (count / maxPerCategory) * 100);
    return acc;
  }, {} as Record<ActorCapability['category'], number>);
};

// ============================================================================
// MOTIVATION AND INTENT ANALYSIS
// ============================================================================

/**
 * Analyzes actor motivations and determines primary intent.
 *
 * @param {ActorMotivation[]} motivations - Actor's motivations
 * @returns {{ primary: ActorMotivation['type']; secondary: ActorMotivation['type'][]; confidence: number }}
 *
 * @example
 * ```typescript
 * const intent = analyzeActorIntent(motivations);
 * // Result: { primary: 'espionage', secondary: ['financial'], confidence: 85 }
 * ```
 */
export const analyzeActorIntent = (motivations: ActorMotivation[]): {
  primary: ActorMotivation['type'];
  secondary: ActorMotivation['type'][];
  confidence: number;
} => {
  if (motivations.length === 0) {
    return { primary: 'unknown', secondary: [], confidence: 0 };
  }

  const sorted = [...motivations].sort((a, b) => b.confidence - a.confidence);
  const primary = sorted[0];
  const secondary = sorted.slice(1, 3).map(m => m.type);

  return {
    primary: primary.type,
    secondary,
    confidence: primary.confidence,
  };
};

/**
 * Infers actor motivation from observed behavior patterns.
 *
 * @param {ActorTTP[]} ttps - Actor's TTPs
 * @param {string[]} targetSectors - Targeted sectors
 * @returns {ActorMotivation[]} Inferred motivations
 *
 * @example
 * ```typescript
 * const motivations = inferActorMotivation(ttps, ['finance', 'government']);
 * // Result: [{ type: 'financial', confidence: 70 }, { type: 'espionage', confidence: 80 }]
 * ```
 */
export const inferActorMotivation = (
  ttps: ActorTTP[],
  targetSectors: string[],
): ActorMotivation[] => {
  const motivations: ActorMotivation[] = [];

  // Financial indicators
  const hasFinancialTTPs = ttps.some(t =>
    t.technique.toLowerCase().includes('credential') ||
    t.technique.toLowerCase().includes('payment'),
  );
  const targetsFinance = targetSectors.some(s => s.toLowerCase().includes('finance'));

  if (hasFinancialTTPs || targetsFinance) {
    motivations.push({
      type: 'financial',
      confidence: (hasFinancialTTPs ? 30 : 0) + (targetsFinance ? 40 : 0),
    });
  }

  // Espionage indicators
  const hasEspionageTTPs = ttps.some(t =>
    t.technique.toLowerCase().includes('collection') ||
    t.technique.toLowerCase().includes('exfiltration'),
  );
  const targetsGov = targetSectors.some(s =>
    s.toLowerCase().includes('government') || s.toLowerCase().includes('defense'),
  );

  if (hasEspionageTTPs || targetsGov) {
    motivations.push({
      type: 'espionage',
      confidence: (hasEspionageTTPs ? 40 : 0) + (targetsGov ? 50 : 0),
    });
  }

  return motivations.filter(m => m.confidence > 0);
};

/**
 * Updates actor motivation based on new evidence.
 *
 * @param {ActorMotivation[]} current - Current motivations
 * @param {ActorMotivation} newMotivation - New motivation evidence
 * @returns {ActorMotivation[]} Updated motivations
 *
 * @example
 * ```typescript
 * const updated = updateActorMotivation(motivations, {
 *   type: 'financial',
 *   confidence: 90,
 *   description: 'Observed ransomware deployment'
 * });
 * ```
 */
export const updateActorMotivation = (
  current: ActorMotivation[],
  newMotivation: ActorMotivation,
): ActorMotivation[] => {
  const existing = current.find(m => m.type === newMotivation.type);

  if (existing) {
    return current.map(m =>
      m.type === newMotivation.type
        ? {
            ...m,
            confidence: Math.max(m.confidence, newMotivation.confidence),
            description: newMotivation.description || m.description,
          }
        : m,
    );
  }

  return [...current, newMotivation];
};

// ============================================================================
// INFRASTRUCTURE TRACKING
// ============================================================================

/**
 * Tracks actor infrastructure with lifecycle management.
 *
 * @param {ActorInfrastructure} infrastructure - Infrastructure to track
 * @returns {ActorInfrastructure} Tracked infrastructure with metadata
 *
 * @example
 * ```typescript
 * const tracked = trackActorInfrastructure({
 *   actorId: 'apt28',
 *   type: 'domain',
 *   value: 'evil.example.com',
 *   role: 'c2',
 *   active: true,
 *   confidence: 85
 * });
 * ```
 */
export const trackActorInfrastructure = (
  infrastructure: Omit<ActorInfrastructure, 'firstSeen' | 'lastSeen'>,
): ActorInfrastructure => {
  const now = new Date();
  return {
    ...infrastructure,
    firstSeen: now,
    lastSeen: now,
    metadata: {
      ...infrastructure.metadata,
      trackingStarted: now.toISOString(),
    },
  };
};

/**
 * Identifies infrastructure overlaps between actors.
 *
 * @param {ActorInfrastructure[]} actor1Infra - First actor's infrastructure
 * @param {ActorInfrastructure[]} actor2Infra - Second actor's infrastructure
 * @returns {ActorInfrastructure[]} Overlapping infrastructure
 *
 * @example
 * ```typescript
 * const overlaps = findInfrastructureOverlap(apt28Infra, apt29Infra);
 * // Result: [{ type: 'domain', value: 'shared-c2.com', ... }]
 * ```
 */
export const findInfrastructureOverlap = (
  actor1Infra: ActorInfrastructure[],
  actor2Infra: ActorInfrastructure[],
): ActorInfrastructure[] => {
  const overlaps: ActorInfrastructure[] = [];

  actor1Infra.forEach((infra1) => {
    const match = actor2Infra.find(
      infra2 => infra2.type === infra1.type && infra2.value === infra1.value,
    );
    if (match) {
      overlaps.push(infra1);
    }
  });

  return overlaps;
};

/**
 * Marks infrastructure as inactive based on age or intelligence.
 *
 * @param {ActorInfrastructure[]} infrastructure - Infrastructure list
 * @param {number} inactiveDays - Days to consider infrastructure inactive
 * @returns {ActorInfrastructure[]} Updated infrastructure list
 *
 * @example
 * ```typescript
 * const updated = markInactiveInfrastructure(infrastructure, 90);
 * // Marks infrastructure not seen in 90 days as inactive
 * ```
 */
export const markInactiveInfrastructure = (
  infrastructure: ActorInfrastructure[],
  inactiveDays: number,
): ActorInfrastructure[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

  return infrastructure.map(infra => ({
    ...infra,
    active: infra.lastSeen > cutoffDate && infra.active,
  }));
};

// ============================================================================
// TTP MAPPING UTILITIES
// ============================================================================

/**
 * Maps actor TTPs to MITRE ATT&CK framework.
 *
 * @param {ActorTTP} ttp - TTP to map
 * @returns {ActorTTP} TTP with MITRE ATT&CK mapping
 *
 * @example
 * ```typescript
 * const mapped = mapTTPToMITRE({
 *   actorId: 'apt28',
 *   tactic: 'Initial Access',
 *   technique: 'Phishing: Spearphishing Attachment',
 *   mitreAttackId: 'T1566.001'
 * });
 * ```
 */
export const mapTTPToMITRE = (ttp: Omit<ActorTTP, 'observationCount' | 'firstObserved' | 'lastObserved'>): ActorTTP => {
  const now = new Date();
  return {
    ...ttp,
    observationCount: 1,
    firstObserved: now,
    lastObserved: now,
  };
};

/**
 * Calculates TTP similarity between two actors.
 *
 * @param {ActorTTP[]} actor1TTPs - First actor's TTPs
 * @param {ActorTTP[]} actor2TTPs - Second actor's TTPs
 * @returns {number} Similarity score (0-100)
 *
 * @example
 * ```typescript
 * const similarity = calculateTTPSimilarity(apt28TTPs, apt29TTPs);
 * // Result: 65 (65% similar)
 * ```
 */
export const calculateTTPSimilarity = (
  actor1TTPs: ActorTTP[],
  actor2TTPs: ActorTTP[],
): number => {
  if (actor1TTPs.length === 0 || actor2TTPs.length === 0) return 0;

  const ttps1 = new Set(actor1TTPs.map(t => t.mitreAttackId));
  const ttps2 = new Set(actor2TTPs.map(t => t.mitreAttackId));

  const intersection = new Set([...ttps1].filter(x => ttps2.has(x)));
  const union = new Set([...ttps1, ...ttps2]);

  return Math.round((intersection.size / union.size) * 100);
};

/**
 * Identifies most common TTPs for an actor.
 *
 * @param {ActorTTP[]} ttps - Actor's TTPs
 * @param {number} topN - Number of top TTPs to return
 * @returns {ActorTTP[]} Most frequently observed TTPs
 *
 * @example
 * ```typescript
 * const commonTTPs = getCommonTTPs(ttps, 5);
 * // Returns top 5 most frequently used TTPs
 * ```
 */
export const getCommonTTPs = (ttps: ActorTTP[], topN: number = 5): ActorTTP[] => {
  return [...ttps]
    .sort((a, b) => {
      // Sort by frequency first, then observation count
      const freqWeight = { frequent: 4, common: 3, occasional: 2, rare: 1 };
      const freqDiff = freqWeight[b.frequency] - freqWeight[a.frequency];
      if (freqDiff !== 0) return freqDiff;
      return b.observationCount - a.observationCount;
    })
    .slice(0, topN);
};

/**
 * Updates TTP observation with new incident data.
 *
 * @param {ActorTTP[]} ttps - Current TTPs
 * @param {string} mitreAttackId - MITRE ATT&CK ID
 * @returns {ActorTTP[]} Updated TTPs
 *
 * @example
 * ```typescript
 * const updated = updateTTPObservation(ttps, 'T1566.001');
 * // Increments observation count and updates lastObserved
 * ```
 */
export const updateTTPObservation = (ttps: ActorTTP[], mitreAttackId: string): ActorTTP[] => {
  return ttps.map(ttp => {
    if (ttp.mitreAttackId === mitreAttackId) {
      const newCount = ttp.observationCount + 1;
      let frequency: ActorTTP['frequency'] = 'rare';
      if (newCount >= 20) frequency = 'frequent';
      else if (newCount >= 10) frequency = 'common';
      else if (newCount >= 5) frequency = 'occasional';

      return {
        ...ttp,
        observationCount: newCount,
        lastObserved: new Date(),
        frequency,
      };
    }
    return ttp;
  });
};

// ============================================================================
// ATTRIBUTION AND CONFIDENCE SCORING
// ============================================================================

/**
 * Calculates attribution confidence based on evidence.
 *
 * @param {AttributionEvidence[]} evidence - Evidence for attribution
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence(evidence);
 * // Result: 85
 * ```
 */
export const calculateAttributionConfidence = (evidence: AttributionEvidence[]): number => {
  if (evidence.length === 0) return 0;

  const weightedSum = evidence.reduce((sum, e) => sum + e.weight, 0);
  const maxWeight = evidence.length * 100;

  return Math.min(100, Math.round((weightedSum / maxWeight) * 100));
};

/**
 * Creates actor attribution with evidence and scoring.
 *
 * @param {Omit<ActorAttribution, 'confidence' | 'evidenceScore' | 'timestamp'>} attribution - Attribution data
 * @returns {ActorAttribution} Complete attribution
 *
 * @example
 * ```typescript
 * const attribution = createActorAttribution({
 *   actorId: 'apt28',
 *   campaignId: 'camp-123',
 *   attributionMethod: 'ttp-match',
 *   evidence: [{ type: 'ttp', description: 'Matches known APT28 TTPs', weight: 85 }]
 * });
 * ```
 */
export const createActorAttribution = (
  attribution: Omit<ActorAttribution, 'confidence' | 'evidenceScore' | 'timestamp'>,
): ActorAttribution => {
  const confidence = calculateAttributionConfidence(attribution.evidence);

  return {
    ...attribution,
    confidence,
    evidenceScore: confidence,
    timestamp: new Date(),
  };
};

/**
 * Validates attribution evidence quality.
 *
 * @param {AttributionEvidence[]} evidence - Evidence to validate
 * @returns {{ valid: boolean; issues: string[] }}
 *
 * @example
 * ```typescript
 * const validation = validateAttributionEvidence(evidence);
 * // Result: { valid: true, issues: [] }
 * ```
 */
export const validateAttributionEvidence = (
  evidence: AttributionEvidence[],
): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (evidence.length === 0) {
    issues.push('No evidence provided');
  }

  if (evidence.length < 3) {
    issues.push('Insufficient evidence (minimum 3 pieces recommended)');
  }

  evidence.forEach((e, idx) => {
    if (e.weight < 0 || e.weight > 100) {
      issues.push(`Evidence ${idx}: weight must be 0-100`);
    }
    if (!e.description || e.description.trim().length === 0) {
      issues.push(`Evidence ${idx}: description required`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Compares attribution confidence across multiple actors.
 *
 * @param {ActorAttribution[]} attributions - Attributions to compare
 * @returns {ActorAttribution[]} Sorted by confidence (highest first)
 *
 * @example
 * ```typescript
 * const ranked = rankAttributionConfidence(attributions);
 * // Result: [{ actorId: 'apt28', confidence: 95 }, { actorId: 'apt29', confidence: 70 }]
 * ```
 */
export const rankAttributionConfidence = (
  attributions: ActorAttribution[],
): ActorAttribution[] => {
  return [...attributions].sort((a, b) => b.confidence - a.confidence);
};

// ============================================================================
// ACTOR RELATIONSHIP GRAPHS
// ============================================================================

/**
 * Creates relationship between two actors.
 *
 * @param {Omit<ActorRelationship, 'firstObserved' | 'lastObserved'>} relationship - Relationship data
 * @returns {ActorRelationship} Complete relationship
 *
 * @example
 * ```typescript
 * const relationship = createActorRelationship({
 *   sourceActorId: 'apt28',
 *   targetActorId: 'apt29',
 *   relationshipType: 'shares-infrastructure',
 *   confidence: 80,
 *   evidence: ['domain-overlap-report.pdf'],
 *   active: true
 * });
 * ```
 */
export const createActorRelationship = (
  relationship: Omit<ActorRelationship, 'firstObserved' | 'lastObserved'>,
): ActorRelationship => {
  const now = new Date();
  return {
    ...relationship,
    firstObserved: now,
    lastObserved: now,
  };
};

/**
 * Builds actor relationship graph.
 *
 * @param {ActorRelationship[]} relationships - All relationships
 * @param {string} rootActorId - Root actor to build graph from
 * @returns {Record<string, string[]>} Adjacency list representation
 *
 * @example
 * ```typescript
 * const graph = buildActorRelationshipGraph(relationships, 'apt28');
 * // Result: { 'apt28': ['apt29', 'apt32'], 'apt29': ['apt28'] }
 * ```
 */
export const buildActorRelationshipGraph = (
  relationships: ActorRelationship[],
  rootActorId: string,
): Record<string, string[]> => {
  const graph: Record<string, string[]> = {};

  relationships.forEach((rel) => {
    if (!graph[rel.sourceActorId]) {
      graph[rel.sourceActorId] = [];
    }
    graph[rel.sourceActorId].push(rel.targetActorId);

    // Add reverse relationship for undirected graph
    if (!graph[rel.targetActorId]) {
      graph[rel.targetActorId] = [];
    }
    graph[rel.targetActorId].push(rel.sourceActorId);
  });

  return graph;
};

/**
 * Finds related actors within N degrees of separation.
 *
 * @param {ActorRelationship[]} relationships - All relationships
 * @param {string} actorId - Starting actor
 * @param {number} degrees - Degrees of separation
 * @returns {string[]} Related actor IDs
 *
 * @example
 * ```typescript
 * const related = findRelatedActors(relationships, 'apt28', 2);
 * // Returns actors within 2 degrees of separation from APT28
 * ```
 */
export const findRelatedActors = (
  relationships: ActorRelationship[],
  actorId: string,
  degrees: number,
): string[] => {
  const graph = buildActorRelationshipGraph(relationships, actorId);
  const visited = new Set<string>([actorId]);
  const queue: Array<{ id: string; degree: number }> = [{ id: actorId, degree: 0 }];
  const related: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.degree >= degrees) continue;

    const neighbors = graph[current.id] || [];
    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        related.push(neighborId);
        queue.push({ id: neighborId, degree: current.degree + 1 });
      }
    });
  }

  return related;
};

// ============================================================================
// NESTJS SERVICE PATTERNS
// ============================================================================

/**
 * NestJS service for threat actor management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ThreatActorService {
 *   constructor(
 *     @InjectModel(ThreatActor) private actorModel: typeof ThreatActor,
 *     private logger: Logger
 *   ) {}
 *
 *   async createActor(dto: CreateActorDto): Promise<ThreatActor> {
 *     const actor = createThreatActor(dto);
 *     validateThreatActor(actor);
 *     return this.actorModel.create(actor);
 *   }
 *
 *   async getActorProfile(actorId: string): Promise<ActorProfile> {
 *     const actor = await this.actorModel.findByPk(actorId, {
 *       include: ['capabilities', 'ttps', 'infrastructure']
 *     });
 *     return enrichActorProfile(actor, {
 *       capabilities: actor.capabilities,
 *       ttps: actor.ttps,
 *       infrastructure: actor.infrastructure
 *     });
 *   }
 *
 *   async analyzeActor(actorId: string): Promise<ActorAnalysisReport> {
 *     const profile = await this.getActorProfile(actorId);
 *     const sophistication = assessActorCapabilities(profile.capabilities);
 *     const intent = analyzeActorIntent(profile.actor.motivation);
 *
 *     return {
 *       actor: profile.actor,
 *       riskScore: calculateActorRiskScore(profile),
 *       threatLevel: determineThreatLevel(sophistication, intent.confidence),
 *       capabilityAssessment: {
 *         overallLevel: sophistication,
 *         strengths: identifyStrengths(profile.capabilities),
 *         weaknesses: identifyWeaknesses(profile.capabilities)
 *       },
 *       activityTrend: analyzeActivityTrend(profile.timeline),
 *       recommendations: generateRecommendations(profile),
 *       generatedAt: new Date()
 *     };
 *   }
 * }
 * ```
 */
export const createThreatActorService = (): string => {
  return 'ThreatActorService template - see example above';
};

/**
 * NestJS provider for actor attribution analysis.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ActorAttributionProvider {
 *   async attributeCampaign(
 *     campaignId: string,
 *     potentialActors: string[]
 *   ): Promise<ActorAttribution[]> {
 *     const attributions: ActorAttribution[] = [];
 *
 *     for (const actorId of potentialActors) {
 *       const evidence = await this.gatherEvidence(campaignId, actorId);
 *       const attribution = createActorAttribution({
 *         actorId,
 *         campaignId,
 *         attributionMethod: 'ttp-match',
 *         evidence,
 *         analyst: 'system'
 *       });
 *
 *       const validation = validateAttributionEvidence(attribution.evidence);
 *       if (validation.valid && attribution.confidence > 50) {
 *         attributions.push(attribution);
 *       }
 *     }
 *
 *     return rankAttributionConfidence(attributions);
 *   }
 * }
 * ```
 */
export const createAttributionProvider = (): string => {
  return 'ActorAttributionProvider template - see example above';
};

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model definition for ThreatActor.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'threat_actors', timestamps: true })
 * export class ThreatActorModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   name: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   aliases: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('nation-state', 'criminal', 'hacktivist', 'insider', 'terrorist', 'unknown'),
 *     defaultValue: 'unknown'
 *   })
 *   type: string;
 *
 *   @Column({
 *     type: DataType.ENUM('minimal', 'low', 'medium', 'high', 'advanced', 'expert'),
 *     defaultValue: 'medium'
 *   })
 *   sophistication: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   motivation: ActorMotivation[];
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
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => ActorCapabilityModel)
 *   capabilities: ActorCapabilityModel[];
 *
 *   @HasMany(() => ActorTTPModel)
 *   ttps: ActorTTPModel[];
 *
 *   @HasMany(() => ActorInfrastructureModel)
 *   infrastructure: ActorInfrastructureModel[];
 * }
 * ```
 */
export const defineThreatActorModel = (): string => {
  return 'ThreatActorModel definition - see example above';
};

/**
 * Sequelize model for ActorCapability.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'actor_capabilities', timestamps: true })
 * export class ActorCapabilityModel extends Model {
 *   @ForeignKey(() => ThreatActorModel)
 *   @Column(DataType.UUID)
 *   actorId: string;
 *
 *   @BelongsTo(() => ThreatActorModel)
 *   actor: ThreatActorModel;
 *
 *   @Column({
 *     type: DataType.ENUM('malware', 'exploit', 'infrastructure', 'social-engineering', 'cryptography', 'evasion')
 *   })
 *   category: string;
 *
 *   @Column(DataType.STRING)
 *   name: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({
 *     type: DataType.ENUM('basic', 'intermediate', 'advanced', 'expert')
 *   })
 *   proficiencyLevel: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   evidence: string[];
 *
 *   @Column({ type: DataType.INTEGER, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column(DataType.DATE)
 *   lastObserved: Date;
 * }
 * ```
 */
export const defineActorCapabilityModel = (): string => {
  return 'ActorCapabilityModel definition - see example above';
};

// ============================================================================
// SWAGGER API DEFINITIONS
// ============================================================================

/**
 * Swagger API endpoint for creating threat actor.
 *
 * @example
 * ```typescript
 * @ApiTags('Threat Actors')
 * @Controller('threat-actors')
 * export class ThreatActorsController {
 *   @Post()
 *   @ApiOperation({ summary: 'Create new threat actor profile' })
 *   @ApiBody({ type: CreateActorDto })
 *   @ApiResponse({ status: 201, description: 'Actor created', type: ThreatActorDto })
 *   @ApiResponse({ status: 400, description: 'Invalid input' })
 *   async create(@Body() dto: CreateActorDto): Promise<ThreatActorDto> {
 *     const actor = createThreatActor(dto);
 *     validateThreatActor(actor);
 *     return this.actorService.create(actor);
 *   }
 *
 *   @Get(':id/profile')
 *   @ApiOperation({ summary: 'Get comprehensive actor profile' })
 *   @ApiParam({ name: 'id', description: 'Actor ID' })
 *   @ApiResponse({ status: 200, type: ActorProfileDto })
 *   async getProfile(@Param('id') id: string): Promise<ActorProfileDto> {
 *     return this.actorService.getActorProfile(id);
 *   }
 *
 *   @Post(':id/capabilities')
 *   @ApiOperation({ summary: 'Add capability to actor' })
 *   async addCapability(
 *     @Param('id') id: string,
 *     @Body() dto: AddCapabilityDto
 *   ): Promise<void> {
 *     const actor = await this.actorService.findById(id);
 *     const updated = addActorCapability(actor.capabilities, dto);
 *     await this.actorService.updateCapabilities(id, updated);
 *   }
 * }
 * ```
 */
export const defineActorAPI = (): string => {
  return 'ThreatActorsController API - see example above';
};

// ============================================================================
// TYPESCRIPT UTILITIES
// ============================================================================

/**
 * Generates unique actor ID.
 *
 * @returns {string} Unique actor identifier
 *
 * @example
 * ```typescript
 * const id = generateActorId();
 * // Result: 'actor-uuid-v4'
 * ```
 */
export const generateActorId = (): string => {
  // In production, use crypto.randomUUID() or similar
  return `actor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates actor risk score based on profile.
 *
 * @param {ActorProfile} profile - Actor profile
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateActorRiskScore(profile);
 * // Result: 85
 * ```
 */
export const calculateActorRiskScore = (profile: ActorProfile): number => {
  const sophisticationWeight = {
    minimal: 10,
    low: 20,
    medium: 40,
    high: 60,
    advanced: 80,
    expert: 100,
  };

  const sophisticationScore = sophisticationWeight[profile.actor.sophistication];
  const activityScore = profile.actor.active ? 20 : 5;
  const capabilityScore = Math.min(30, profile.capabilities.length * 3);
  const ttpScore = Math.min(25, profile.ttps.length * 2);
  const infraScore = Math.min(25, profile.infrastructure.filter(i => i.active).length * 5);

  const total = sophisticationScore * 0.3 + activityScore + capabilityScore + ttpScore * 0.5 + infraScore * 0.5;

  return Math.min(100, Math.round(total));
};

/**
 * Searches actors by criteria with filtering.
 *
 * @param {ThreatActor[]} actors - Actor list
 * @param {ActorSearchCriteria} criteria - Search criteria
 * @returns {ThreatActor[]} Matching actors
 *
 * @example
 * ```typescript
 * const results = searchActors(allActors, {
 *   type: 'nation-state',
 *   minConfidence: 70,
 *   active: true
 * });
 * ```
 */
export const searchActors = (
  actors: ThreatActor[],
  criteria: ActorSearchCriteria,
): ThreatActor[] => {
  return actors.filter((actor) => {
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
    if (criteria.active !== undefined && actor.active !== criteria.active) {
      return false;
    }
    return true;
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Actor profile utilities
  createThreatActor,
  validateThreatActor,
  enrichActorProfile,
  mergeActorProfiles,

  // Capability assessment
  assessActorCapabilities,
  addActorCapability,
  calculateCapabilityCoverage,

  // Motivation analysis
  analyzeActorIntent,
  inferActorMotivation,
  updateActorMotivation,

  // Infrastructure tracking
  trackActorInfrastructure,
  findInfrastructureOverlap,
  markInactiveInfrastructure,

  // TTP mapping
  mapTTPToMITRE,
  calculateTTPSimilarity,
  getCommonTTPs,
  updateTTPObservation,

  // Attribution
  calculateAttributionConfidence,
  createActorAttribution,
  validateAttributionEvidence,
  rankAttributionConfidence,

  // Relationship graphs
  createActorRelationship,
  buildActorRelationshipGraph,
  findRelatedActors,

  // NestJS patterns
  createThreatActorService,
  createAttributionProvider,

  // Sequelize models
  defineThreatActorModel,
  defineActorCapabilityModel,

  // Swagger API
  defineActorAPI,

  // TypeScript utilities
  generateActorId,
  calculateActorRiskScore,
  searchActors,
};
