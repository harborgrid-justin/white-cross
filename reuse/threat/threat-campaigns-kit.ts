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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ThreatCampaign {
  id: string;
  name: string;
  aliases: string[];
  description?: string;
  status: 'active' | 'dormant' | 'concluded' | 'suspected';
  sophistication: 'low' | 'medium' | 'high' | 'very-high';
  attributedActorId?: string;
  attributionConfidence: number; // 0-100
  firstDetected: Date;
  lastActivity: Date;
  targetSectors: string[];
  targetGeographies: string[];
  victimCount: number;
  confidence: number; // 0-100
  metadata?: Record<string, unknown>;
}

interface CampaignTimeline {
  campaignId: string;
  events: CampaignEvent[];
  phases: CampaignPhase[];
  duration: number; // milliseconds
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
  ttps: string[]; // MITRE ATT&CK IDs
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
  confidence: number; // 0-100
  attributionDate: Date;
  evidenceTypes: string[];
  matchedTTPs: string[];
  matchedInfrastructure: string[];
  analyst?: string;
  notes?: string;
}

interface CampaignIndicator {
  campaignId: string;
  type: 'ip' | 'domain' | 'url' | 'file-hash' | 'email' | 'malware-family' | 'tool' | 'certificate';
  value: string;
  firstSeen: Date;
  lastSeen: Date;
  confidence: number;
  active: boolean;
  context?: string;
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
  similarityScore: number; // 0-100
  evidence: string[];
  confidence: number;
}

interface CampaignSearchCriteria {
  name?: string;
  status?: ThreatCampaign['status'];
  attributedActorId?: string;
  minConfidence?: number;
  targetSector?: string;
  targetGeography?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minVictimCount?: number;
}

interface CampaignAnalysisReport {
  campaign: ThreatCampaign;
  timeline: CampaignTimeline;
  targets: CampaignTarget[];
  impact: CampaignImpact;
  attribution: CampaignAttribution | null;
  indicators: CampaignIndicator[];
  patterns: CampaignPattern[];
  recommendations: string[];
  threatScore: number; // 0-100
  generatedAt: Date;
}

// ============================================================================
// CAMPAIGN DETECTION AND TRACKING
// ============================================================================

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
export const createThreatCampaign = (campaignData: Partial<ThreatCampaign>): ThreatCampaign => {
  if (!campaignData.name) {
    throw new Error('Campaign name is required');
  }

  const now = new Date();
  return {
    id: campaignData.id || generateCampaignId(),
    name: campaignData.name,
    aliases: campaignData.aliases || [],
    description: campaignData.description,
    status: campaignData.status || 'suspected',
    sophistication: campaignData.sophistication || 'medium',
    attributedActorId: campaignData.attributedActorId,
    attributionConfidence: campaignData.attributionConfidence || 0,
    firstDetected: campaignData.firstDetected || now,
    lastActivity: campaignData.lastActivity || now,
    targetSectors: campaignData.targetSectors || [],
    targetGeographies: campaignData.targetGeographies || [],
    victimCount: campaignData.victimCount || 0,
    confidence: campaignData.confidence || 50,
    metadata: campaignData.metadata || {},
  };
};

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
export const validateThreatCampaign = (campaign: ThreatCampaign): boolean => {
  if (!campaign.id || !campaign.name) {
    throw new Error('Campaign must have id and name');
  }

  if (campaign.confidence < 0 || campaign.confidence > 100) {
    throw new Error('Confidence must be between 0 and 100');
  }

  if (campaign.firstDetected > campaign.lastActivity) {
    throw new Error('First detected date cannot be after last activity');
  }

  if (campaign.attributionConfidence < 0 || campaign.attributionConfidence > 100) {
    throw new Error('Attribution confidence must be between 0 and 100');
  }

  return true;
};

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
export const detectCampaignFromIncidents = (
  incidents: CampaignEvent[],
  similarityThreshold: number,
): ThreatCampaign[] => {
  const campaigns: ThreatCampaign[] = [];
  const clustered = new Set<string>();

  incidents.forEach((incident, idx) => {
    if (clustered.has(incident.id)) return;

    const similar = incidents.filter((other, otherIdx) => {
      if (idx === otherIdx || clustered.has(other.id)) return false;

      const similarity = calculateIncidentSimilarity(incident, other);
      return similarity >= similarityThreshold;
    });

    if (similar.length >= 2) {
      // Potential campaign detected
      const allIncidents = [incident, ...similar];
      allIncidents.forEach(i => clustered.add(i.id));

      campaigns.push({
        id: generateCampaignId(),
        name: `Suspected Campaign ${campaigns.length + 1}`,
        aliases: [],
        status: 'suspected',
        sophistication: 'medium',
        attributionConfidence: 0,
        firstDetected: new Date(Math.min(...allIncidents.map(i => i.timestamp.getTime()))),
        lastActivity: new Date(Math.max(...allIncidents.map(i => i.timestamp.getTime()))),
        targetSectors: [],
        targetGeographies: [],
        victimCount: allIncidents.length,
        confidence: 60,
        metadata: {
          detectionMethod: 'incident-clustering',
          incidentIds: allIncidents.map(i => i.id),
        },
      });
    }
  });

  return campaigns;
};

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
export const updateCampaignActivity = (
  campaign: ThreatCampaign,
  event: CampaignEvent,
): ThreatCampaign => {
  return {
    ...campaign,
    lastActivity: event.timestamp > campaign.lastActivity ? event.timestamp : campaign.lastActivity,
    victimCount: campaign.victimCount + event.affectedEntities.length,
    status: campaign.status === 'dormant' || campaign.status === 'suspected' ? 'active' : campaign.status,
  };
};

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
export const markCampaignDormant = (
  campaign: ThreatCampaign,
  inactiveDays: number,
): ThreatCampaign => {
  const daysSinceActivity = Math.floor(
    (Date.now() - campaign.lastActivity.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceActivity >= inactiveDays && campaign.status === 'active') {
    return { ...campaign, status: 'dormant' };
  }

  return campaign;
};

// ============================================================================
// TIMELINE ANALYSIS UTILITIES
// ============================================================================

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
export const buildCampaignTimeline = (events: CampaignEvent[]): CampaignTimeline => {
  if (events.length === 0) {
    throw new Error('Cannot build timeline from empty events');
  }

  const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstEvent = sorted[0];
  const lastEvent = sorted[sorted.length - 1];

  const campaignId = firstEvent.campaignId;
  const duration = lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime();
  const phases = identifyCampaignPhases(sorted);
  const activityPattern = determineActivityPattern(sorted);

  return {
    campaignId,
    events: sorted,
    phases,
    duration,
    activityPattern,
  };
};

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
export const identifyCampaignPhases = (events: CampaignEvent[]): CampaignPhase[] => {
  const phases: CampaignPhase[] = [];

  const phaseMap: Record<CampaignEvent['eventType'], string> = {
    'initial-compromise': 'Initial Access',
    'lateral-movement': 'Lateral Movement',
    'data-exfiltration': 'Data Exfiltration',
    impact: 'Impact',
    discovery: 'Discovery',
    'infrastructure-change': 'Infrastructure Evolution',
  };

  const phaseGroups = new Map<string, CampaignEvent[]>();

  events.forEach((event) => {
    const phaseName = phaseMap[event.eventType];
    if (!phaseGroups.has(phaseName)) {
      phaseGroups.set(phaseName, []);
    }
    phaseGroups.get(phaseName)!.push(event);
  });

  phaseGroups.forEach((phaseEvents, phaseName) => {
    const sortedEvents = phaseEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    phases.push({
      name: phaseName,
      startDate: sortedEvents[0].timestamp,
      endDate: sortedEvents[sortedEvents.length - 1].timestamp,
      status: 'completed',
      objectives: [...new Set(phaseEvents.flatMap(e => e.affectedEntities))],
      ttps: [],
      indicators: [...new Set(phaseEvents.flatMap(e => e.evidence))],
    });
  });

  return phases.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

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
export const determineActivityPattern = (
  events: CampaignEvent[],
): CampaignTimeline['activityPattern'] => {
  if (events.length < 3) return 'sporadic';

  const intervals: number[] = [];
  for (let i = 1; i < events.length; i++) {
    const interval = events[i].timestamp.getTime() - events[i - 1].timestamp.getTime();
    intervals.push(interval);
  }

  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
  const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  const coefficientOfVariation = stdDev / avgInterval;

  if (coefficientOfVariation < 0.3) return 'continuous';
  if (coefficientOfVariation < 0.7) return 'periodic';
  if (avgInterval < 86400000) return 'burst'; // < 1 day
  return 'sporadic';
};

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
export const analyzeCampaignTempo = (
  events: CampaignEvent[],
  windowDays: number,
): Array<{ period: string; eventCount: number; intensity: number }> => {
  if (events.length === 0) return [];

  const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstDate = new Date(sorted[0].timestamp);
  const lastDate = new Date(sorted[sorted.length - 1].timestamp);

  const windows: Array<{ period: string; eventCount: number; intensity: number }> = [];
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  let currentWindowStart = new Date(firstDate);
  while (currentWindowStart <= lastDate) {
    const windowEnd = new Date(currentWindowStart.getTime() + windowMs);

    const windowEvents = sorted.filter(
      e => e.timestamp >= currentWindowStart && e.timestamp < windowEnd,
    );

    const intensity = Math.min(100, (windowEvents.length / windowDays) * 10);

    windows.push({
      period: currentWindowStart.toISOString().split('T')[0],
      eventCount: windowEvents.length,
      intensity: Math.round(intensity),
    });

    currentWindowStart = windowEnd;
  }

  return windows;
};

// ============================================================================
// TARGET PROFILING UTILITIES
// ============================================================================

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
export const createCampaignTarget = (
  targetData: Omit<CampaignTarget, 'impactLevel'>,
): CampaignTarget => {
  const impactLevel = calculateTargetImpact(
    targetData.compromised,
    targetData.dataExfiltrated,
    targetData.systemsAffected,
  );

  return {
    ...targetData,
    impactLevel,
  };
};

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
export const analyzeTargetingPatterns = (
  targets: CampaignTarget[],
): {
  sectorDistribution: Record<string, number>;
  geoDistribution: Record<string, number>;
} => {
  const sectorDistribution: Record<string, number> = {};
  const geoDistribution: Record<string, number> = {};

  // This is a simplified version - in production, would map entities to sectors/geo
  targets.forEach((target) => {
    // Sector distribution (would be enriched from entity metadata)
    const sector = 'unknown';
    sectorDistribution[sector] = (sectorDistribution[sector] || 0) + 1;
  });

  const total = targets.length;
  Object.keys(sectorDistribution).forEach((key) => {
    sectorDistribution[key] = Math.round((sectorDistribution[key] / total) * 100);
  });

  return { sectorDistribution, geoDistribution };
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
export const identifyHighValueTargets = (targets: CampaignTarget[]): CampaignTarget[] => {
  return targets.filter(
    t =>
      t.impactLevel === 'critical' ||
      t.impactLevel === 'high' ||
      (t.dataExfiltrated && t.systemsAffected > 10),
  );
};

// ============================================================================
// IMPACT ASSESSMENT UTILITIES
// ============================================================================

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
export const calculateCampaignImpact = (
  targets: CampaignTarget[],
  events: CampaignEvent[],
): CampaignImpact => {
  const compromisedTargets = targets.filter(t => t.compromised);
  const dataExfilTargets = targets.filter(t => t.dataExfiltrated);

  const financialImpact = {
    estimatedLoss: compromisedTargets.length * 100000, // Simplified calculation
    currency: 'USD',
    confidence: 60,
  };

  const dataImpact = {
    recordsCompromised: dataExfilTargets.length * 10000, // Simplified
    dataTypes: ['PII', 'Financial', 'Credentials'],
    sensitivityLevel: 'confidential' as const,
  };

  const systemsAffected = targets.reduce((sum, t) => sum + t.systemsAffected, 0);
  const operationalImpact = {
    downtimeHours: Math.floor(systemsAffected * 0.5),
    systemsAffected,
    serviceDisruption: systemsAffected > 20,
  };

  const criticalEvents = events.filter(e => e.severity === 'critical').length;
  const reputationalImpact = {
    severity: (criticalEvents > 5 ? 'high' : criticalEvents > 2 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
    publicExposure: compromisedTargets.length > 10,
    mediaAttention: compromisedTargets.length > 50,
  };

  const overallSeverity = determineOverallSeverity(targets, events);

  return {
    campaignId: targets[0]?.campaignId || '',
    financialImpact,
    dataImpact,
    operationalImpact,
    reputationalImpact,
    overallSeverity,
  };
};

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
export const estimateFinancialImpact = (
  targets: CampaignTarget[],
  avgCostPerIncident: number,
): number => {
  const compromised = targets.filter(t => t.compromised);
  let totalCost = 0;

  compromised.forEach((target) => {
    let multiplier = 1;

    // Increase cost based on impact
    if (target.impactLevel === 'critical') multiplier = 3;
    else if (target.impactLevel === 'high') multiplier = 2;
    else if (target.impactLevel === 'medium') multiplier = 1.5;

    // Add data exfiltration cost
    if (target.dataExfiltrated) multiplier += 0.5;

    totalCost += avgCostPerIncident * multiplier;
  });

  return Math.round(totalCost);
};

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
export const assessDataBreachSeverity = (
  targets: CampaignTarget[],
): { severity: string; recordsAffected: number; dataTypes: string[] } => {
  const exfilTargets = targets.filter(t => t.dataExfiltrated);
  const recordsAffected = exfilTargets.length * 10000; // Simplified

  let severity = 'low';
  if (recordsAffected > 100000) severity = 'critical';
  else if (recordsAffected > 50000) severity = 'high';
  else if (recordsAffected > 10000) severity = 'medium';

  return {
    severity,
    recordsAffected,
    dataTypes: ['PII', 'Credentials', 'Financial'],
  };
};

// ============================================================================
// CAMPAIGN ATTRIBUTION UTILITIES
// ============================================================================

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
export const attributeCampaignToActor = (
  campaignId: string,
  actorId: string,
  matchedTTPs: string[],
  matchedInfra: string[],
): CampaignAttribution => {
  const ttpWeight = matchedTTPs.length * 15; // Up to 15 points per TTP
  const infraWeight = matchedInfra.length * 20; // Up to 20 points per infrastructure
  const baseConfidence = 20; // Baseline confidence

  const confidence = Math.min(100, baseConfidence + ttpWeight + infraWeight);

  const evidenceTypes: string[] = [];
  if (matchedTTPs.length > 0) evidenceTypes.push('ttp-matching');
  if (matchedInfra.length > 0) evidenceTypes.push('infrastructure-overlap');

  return {
    campaignId,
    actorId,
    confidence,
    attributionDate: new Date(),
    evidenceTypes,
    matchedTTPs,
    matchedInfrastructure: matchedInfra,
  };
};

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
export const calculateAttributionConfidence = (
  evidenceTypes: string[],
  ttpMatchCount: number,
  infraMatchCount: number,
): number => {
  let confidence = 0;

  // Base confidence from evidence type diversity
  confidence += evidenceTypes.length * 10;

  // TTP matching confidence
  confidence += Math.min(40, ttpMatchCount * 8);

  // Infrastructure matching confidence
  confidence += Math.min(30, infraMatchCount * 10);

  return Math.min(100, confidence);
};

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
export const validateCampaignAttribution = (
  attribution: CampaignAttribution,
): { valid: boolean; issues: string[]; confidence: number } => {
  const issues: string[] = [];

  if (attribution.confidence < 50) {
    issues.push('Low confidence attribution (< 50%)');
  }

  if (attribution.matchedTTPs.length === 0 && attribution.matchedInfrastructure.length === 0) {
    issues.push('No TTP or infrastructure matches - attribution not supported');
  }

  if (attribution.evidenceTypes.length < 2) {
    issues.push('Single evidence type - recommend multiple evidence sources');
  }

  return {
    valid: issues.length === 0 || attribution.confidence >= 70,
    issues,
    confidence: attribution.confidence,
  };
};

// ============================================================================
// CAMPAIGN LIFECYCLE MANAGEMENT
// ============================================================================

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
export const transitionCampaignStatus = (
  campaign: ThreatCampaign,
  newStatus: ThreatCampaign['status'],
): ThreatCampaign => {
  const validTransitions: Record<ThreatCampaign['status'], ThreatCampaign['status'][]> = {
    suspected: ['active', 'concluded'],
    active: ['dormant', 'concluded'],
    dormant: ['active', 'concluded'],
    concluded: [],
  };

  if (!validTransitions[campaign.status].includes(newStatus)) {
    throw new Error(`Invalid status transition: ${campaign.status} -> ${newStatus}`);
  }

  return { ...campaign, status: newStatus };
};

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
export const archiveCampaign = (campaign: ThreatCampaign): ThreatCampaign => {
  return {
    ...campaign,
    status: 'concluded',
    metadata: {
      ...campaign.metadata,
      archivedAt: new Date().toISOString(),
      finalVictimCount: campaign.victimCount,
      campaignDuration: campaign.lastActivity.getTime() - campaign.firstDetected.getTime(),
    },
  };
};

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
export const mergeCampaigns = (campaigns: ThreatCampaign[]): ThreatCampaign => {
  if (campaigns.length === 0) {
    throw new Error('No campaigns to merge');
  }

  const primary = campaigns[0];
  const allAliases = new Set(primary.aliases);
  let totalVictims = 0;
  let earliestDetection = primary.firstDetected;
  let latestActivity = primary.lastActivity;

  campaigns.forEach((campaign) => {
    campaign.aliases.forEach(alias => allAliases.add(alias));
    allAliases.add(campaign.name);
    totalVictims += campaign.victimCount;

    if (campaign.firstDetected < earliestDetection) {
      earliestDetection = campaign.firstDetected;
    }
    if (campaign.lastActivity > latestActivity) {
      latestActivity = campaign.lastActivity;
    }
  });

  return {
    ...primary,
    aliases: Array.from(allAliases).filter(a => a !== primary.name),
    firstDetected: earliestDetection,
    lastActivity: latestActivity,
    victimCount: totalVictims,
    metadata: {
      ...primary.metadata,
      mergedFrom: campaigns.map(c => c.id),
      mergedAt: new Date().toISOString(),
    },
  };
};

// ============================================================================
// PATTERN RECOGNITION UTILITIES
// ============================================================================

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
export const identifyTemporalPatterns = (events: CampaignEvent[]): CampaignPattern[] => {
  const patterns: CampaignPattern[] = [];

  // Group by day of week
  const dayOfWeekCounts: Record<number, number> = {};
  events.forEach((event) => {
    const day = event.timestamp.getDay();
    dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1;
  });

  // Check for weekend/weekday patterns
  const weekendCount = (dayOfWeekCounts[0] || 0) + (dayOfWeekCounts[6] || 0);
  const weekdayCount = events.length - weekendCount;

  if (weekendCount > weekdayCount * 1.5) {
    patterns.push({
      patternType: 'temporal',
      description: 'Primary activity on weekends',
      occurrences: weekendCount,
      confidence: 80,
      relatedCampaigns: [],
    });
  }

  // Check for business hours pattern
  const businessHours = events.filter((e) => {
    const hour = e.timestamp.getHours();
    return hour >= 9 && hour <= 17;
  }).length;

  if (businessHours < events.length * 0.3) {
    patterns.push({
      patternType: 'temporal',
      description: 'Activity primarily outside business hours',
      occurrences: events.length - businessHours,
      confidence: 75,
      relatedCampaigns: [],
    });
  }

  return patterns;
};

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
export const identifyGeographicPatterns = (targets: CampaignTarget[]): CampaignPattern[] => {
  const patterns: CampaignPattern[] = [];

  // Simplified geographic analysis
  const orgTargets = targets.filter(t => t.entityType === 'organization');

  if (orgTargets.length > targets.length * 0.8) {
    patterns.push({
      patternType: 'targeting',
      description: 'Primarily targets organizations',
      occurrences: orgTargets.length,
      confidence: 85,
      relatedCampaigns: [],
    });
  }

  return patterns;
};

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
export const detectTechnicalPatterns = (ttps: string[]): CampaignPattern[] => {
  const patterns: CampaignPattern[] = [];

  // Analyze TTP categories
  const initialAccessTTPs = ttps.filter(t => t.startsWith('T1566')); // Phishing
  const persistenceTTPs = ttps.filter(t => t.startsWith('T1053')); // Scheduled tasks

  if (initialAccessTTPs.length > 0) {
    patterns.push({
      patternType: 'technical',
      description: 'Uses phishing for initial access',
      occurrences: initialAccessTTPs.length,
      confidence: 90,
      relatedCampaigns: [],
    });
  }

  return patterns;
};

// ============================================================================
// CAMPAIGN CORRELATION UTILITIES
// ============================================================================

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
export const correlateCampaigns = (
  campaign1: ThreatCampaign,
  campaign2: ThreatCampaign,
): CampaignCorrelation | null => {
  const evidence: string[] = [];
  let similarityScore = 0;
  let correlationType: CampaignCorrelation['correlationType'] | null = null;

  // Check actor attribution
  if (campaign1.attributedActorId && campaign1.attributedActorId === campaign2.attributedActorId) {
    similarityScore += 40;
    correlationType = 'attributed-same-actor';
    evidence.push('Same threat actor attribution');
  }

  // Check target overlap
  const targetOverlap = campaign1.targetSectors.filter(s => campaign2.targetSectors.includes(s));
  if (targetOverlap.length > 0) {
    similarityScore += targetOverlap.length * 10;
    evidence.push(`${targetOverlap.length} shared target sectors`);
  }

  // Check temporal overlap
  const overlap = checkTemporalOverlap(
    campaign1.firstDetected,
    campaign1.lastActivity,
    campaign2.firstDetected,
    campaign2.lastActivity,
  );

  if (overlap) {
    similarityScore += 20;
    evidence.push('Temporal overlap detected');
  }

  if (similarityScore < 30) return null;

  return {
    campaign1Id: campaign1.id,
    campaign2Id: campaign2.id,
    correlationType: correlationType || 'shared-targets',
    similarityScore: Math.min(100, similarityScore),
    evidence,
    confidence: Math.min(100, similarityScore),
  };
};

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
export const findRelatedCampaigns = (
  campaign: ThreatCampaign,
  allCampaigns: ThreatCampaign[],
  minSimilarity: number,
): CampaignCorrelation[] => {
  const correlations: CampaignCorrelation[] = [];

  allCampaigns.forEach((other) => {
    if (other.id === campaign.id) return;

    const correlation = correlateCampaigns(campaign, other);
    if (correlation && correlation.similarityScore >= minSimilarity) {
      correlations.push(correlation);
    }
  });

  return correlations.sort((a, b) => b.similarityScore - a.similarityScore);
};

// ============================================================================
// NESTJS PROVIDER PATTERNS
// ============================================================================

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
export const createCampaignManagementProvider = (): string => {
  return 'CampaignManagementProvider template - see example above';
};

// ============================================================================
// SEQUELIZE ASSOCIATIONS
// ============================================================================

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
export const defineCampaignAssociations = (): string => {
  return 'Campaign model associations - see example above';
};

// ============================================================================
// API ENDPOINT DEFINITIONS
// ============================================================================

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
export const defineCampaignEndpoints = (): string => {
  return 'Campaign API endpoints - see example above';
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Generates unique campaign ID.
 *
 * @returns {string} Campaign identifier
 */
export const generateCampaignId = (): string => {
  return `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates incident similarity score.
 *
 * @param {CampaignEvent} event1 - First event
 * @param {CampaignEvent} event2 - Second event
 * @returns {number} Similarity score (0-100)
 */
export const calculateIncidentSimilarity = (
  event1: CampaignEvent,
  event2: CampaignEvent,
): number => {
  let score = 0;

  if (event1.eventType === event2.eventType) score += 40;
  if (event1.severity === event2.severity) score += 20;

  const timeDiff = Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime());
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) score += 20;
  else if (daysDiff < 30) score += 10;

  return score;
};

/**
 * Calculates target impact level.
 */
const calculateTargetImpact = (
  compromised: boolean,
  dataExfiltrated: boolean,
  systemsAffected: number,
): CampaignTarget['impactLevel'] => {
  if (!compromised) return 'none';

  if (dataExfiltrated && systemsAffected > 50) return 'critical';
  if (dataExfiltrated && systemsAffected > 20) return 'high';
  if (systemsAffected > 10) return 'medium';
  return 'low';
};

/**
 * Determines overall campaign severity.
 */
const determineOverallSeverity = (
  targets: CampaignTarget[],
  events: CampaignEvent[],
): CampaignImpact['overallSeverity'] => {
  const criticalTargets = targets.filter(t => t.impactLevel === 'critical').length;
  const criticalEvents = events.filter(e => e.severity === 'critical').length;

  if (criticalTargets > 5 || criticalEvents > 10) return 'critical';
  if (criticalTargets > 2 || criticalEvents > 5) return 'high';
  if (targets.filter(t => t.compromised).length > 10) return 'medium';
  return 'low';
};

/**
 * Checks temporal overlap between two time periods.
 */
const checkTemporalOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean => {
  return start1 <= end2 && start2 <= end1;
};

/**
 * Calculates campaign threat score.
 */
export const calculateCampaignThreatScore = (
  campaign: ThreatCampaign,
  timeline: CampaignTimeline,
  impact: CampaignImpact,
): number => {
  const sophisticationWeight = {
    low: 20,
    medium: 40,
    high: 70,
    'very-high': 90,
  };

  let score = sophisticationWeight[campaign.sophistication];

  if (campaign.status === 'active') score += 20;
  if (campaign.victimCount > 50) score += 15;
  if (impact.overallSeverity === 'critical') score += 25;
  if (impact.overallSeverity === 'high') score += 15;

  return Math.min(100, score);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Campaign detection
  createThreatCampaign,
  validateThreatCampaign,
  detectCampaignFromIncidents,
  updateCampaignActivity,
  markCampaignDormant,

  // Timeline analysis
  buildCampaignTimeline,
  identifyCampaignPhases,
  determineActivityPattern,
  analyzeCampaignTempo,

  // Target profiling
  createCampaignTarget,
  analyzeTargetingPatterns,
  identifyHighValueTargets,

  // Impact assessment
  calculateCampaignImpact,
  estimateFinancialImpact,
  assessDataBreachSeverity,

  // Attribution
  attributeCampaignToActor,
  calculateAttributionConfidence,
  validateCampaignAttribution,

  // Lifecycle management
  transitionCampaignStatus,
  archiveCampaign,
  mergeCampaigns,

  // Pattern recognition
  identifyTemporalPatterns,
  identifyGeographicPatterns,
  detectTechnicalPatterns,

  // Correlation
  correlateCampaigns,
  findRelatedCampaigns,

  // NestJS patterns
  createCampaignManagementProvider,

  // Sequelize
  defineCampaignAssociations,

  // API
  defineCampaignEndpoints,

  // Utilities
  generateCampaignId,
  calculateCampaignThreatScore,
};
