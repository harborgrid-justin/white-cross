"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCampaignThreatScore = exports.calculateIncidentSimilarity = exports.generateCampaignId = exports.defineCampaignEndpoints = exports.defineCampaignAssociations = exports.createCampaignManagementProvider = exports.findRelatedCampaigns = exports.correlateCampaigns = exports.detectTechnicalPatterns = exports.identifyGeographicPatterns = exports.identifyTemporalPatterns = exports.mergeCampaigns = exports.archiveCampaign = exports.transitionCampaignStatus = exports.validateCampaignAttribution = exports.calculateAttributionConfidence = exports.attributeCampaignToActor = exports.assessDataBreachSeverity = exports.estimateFinancialImpact = exports.calculateCampaignImpact = exports.identifyHighValueTargets = exports.analyzeTargetingPatterns = exports.createCampaignTarget = exports.analyzeCampaignTempo = exports.determineActivityPattern = exports.identifyCampaignPhases = exports.buildCampaignTimeline = exports.markCampaignDormant = exports.updateCampaignActivity = exports.detectCampaignFromIncidents = exports.validateThreatCampaign = exports.createThreatCampaign = void 0;
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
const createThreatCampaign = (campaignData) => {
    if (!campaignData.name) {
        throw new Error('Campaign name is required');
    }
    const now = new Date();
    return {
        id: campaignData.id || (0, exports.generateCampaignId)(),
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
exports.createThreatCampaign = createThreatCampaign;
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
const validateThreatCampaign = (campaign) => {
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
exports.validateThreatCampaign = validateThreatCampaign;
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
const detectCampaignFromIncidents = (incidents, similarityThreshold) => {
    const campaigns = [];
    const clustered = new Set();
    incidents.forEach((incident, idx) => {
        if (clustered.has(incident.id))
            return;
        const similar = incidents.filter((other, otherIdx) => {
            if (idx === otherIdx || clustered.has(other.id))
                return false;
            const similarity = (0, exports.calculateIncidentSimilarity)(incident, other);
            return similarity >= similarityThreshold;
        });
        if (similar.length >= 2) {
            // Potential campaign detected
            const allIncidents = [incident, ...similar];
            allIncidents.forEach(i => clustered.add(i.id));
            campaigns.push({
                id: (0, exports.generateCampaignId)(),
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
exports.detectCampaignFromIncidents = detectCampaignFromIncidents;
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
const updateCampaignActivity = (campaign, event) => {
    return {
        ...campaign,
        lastActivity: event.timestamp > campaign.lastActivity ? event.timestamp : campaign.lastActivity,
        victimCount: campaign.victimCount + event.affectedEntities.length,
        status: campaign.status === 'dormant' || campaign.status === 'suspected' ? 'active' : campaign.status,
    };
};
exports.updateCampaignActivity = updateCampaignActivity;
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
const markCampaignDormant = (campaign, inactiveDays) => {
    const daysSinceActivity = Math.floor((Date.now() - campaign.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceActivity >= inactiveDays && campaign.status === 'active') {
        return { ...campaign, status: 'dormant' };
    }
    return campaign;
};
exports.markCampaignDormant = markCampaignDormant;
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
const buildCampaignTimeline = (events) => {
    if (events.length === 0) {
        throw new Error('Cannot build timeline from empty events');
    }
    const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const firstEvent = sorted[0];
    const lastEvent = sorted[sorted.length - 1];
    const campaignId = firstEvent.campaignId;
    const duration = lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime();
    const phases = (0, exports.identifyCampaignPhases)(sorted);
    const activityPattern = (0, exports.determineActivityPattern)(sorted);
    return {
        campaignId,
        events: sorted,
        phases,
        duration,
        activityPattern,
    };
};
exports.buildCampaignTimeline = buildCampaignTimeline;
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
const identifyCampaignPhases = (events) => {
    const phases = [];
    const phaseMap = {
        'initial-compromise': 'Initial Access',
        'lateral-movement': 'Lateral Movement',
        'data-exfiltration': 'Data Exfiltration',
        impact: 'Impact',
        discovery: 'Discovery',
        'infrastructure-change': 'Infrastructure Evolution',
    };
    const phaseGroups = new Map();
    events.forEach((event) => {
        const phaseName = phaseMap[event.eventType];
        if (!phaseGroups.has(phaseName)) {
            phaseGroups.set(phaseName, []);
        }
        phaseGroups.get(phaseName).push(event);
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
exports.identifyCampaignPhases = identifyCampaignPhases;
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
const determineActivityPattern = (events) => {
    if (events.length < 3)
        return 'sporadic';
    const intervals = [];
    for (let i = 1; i < events.length; i++) {
        const interval = events[i].timestamp.getTime() - events[i - 1].timestamp.getTime();
        intervals.push(interval);
    }
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgInterval;
    if (coefficientOfVariation < 0.3)
        return 'continuous';
    if (coefficientOfVariation < 0.7)
        return 'periodic';
    if (avgInterval < 86400000)
        return 'burst'; // < 1 day
    return 'sporadic';
};
exports.determineActivityPattern = determineActivityPattern;
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
const analyzeCampaignTempo = (events, windowDays) => {
    if (events.length === 0)
        return [];
    const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const firstDate = new Date(sorted[0].timestamp);
    const lastDate = new Date(sorted[sorted.length - 1].timestamp);
    const windows = [];
    const windowMs = windowDays * 24 * 60 * 60 * 1000;
    let currentWindowStart = new Date(firstDate);
    while (currentWindowStart <= lastDate) {
        const windowEnd = new Date(currentWindowStart.getTime() + windowMs);
        const windowEvents = sorted.filter(e => e.timestamp >= currentWindowStart && e.timestamp < windowEnd);
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
exports.analyzeCampaignTempo = analyzeCampaignTempo;
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
const createCampaignTarget = (targetData) => {
    const impactLevel = calculateTargetImpact(targetData.compromised, targetData.dataExfiltrated, targetData.systemsAffected);
    return {
        ...targetData,
        impactLevel,
    };
};
exports.createCampaignTarget = createCampaignTarget;
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
const analyzeTargetingPatterns = (targets) => {
    const sectorDistribution = {};
    const geoDistribution = {};
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
exports.analyzeTargetingPatterns = analyzeTargetingPatterns;
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
const identifyHighValueTargets = (targets) => {
    return targets.filter(t => t.impactLevel === 'critical' ||
        t.impactLevel === 'high' ||
        (t.dataExfiltrated && t.systemsAffected > 10));
};
exports.identifyHighValueTargets = identifyHighValueTargets;
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
const calculateCampaignImpact = (targets, events) => {
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
        sensitivityLevel: 'confidential',
    };
    const systemsAffected = targets.reduce((sum, t) => sum + t.systemsAffected, 0);
    const operationalImpact = {
        downtimeHours: Math.floor(systemsAffected * 0.5),
        systemsAffected,
        serviceDisruption: systemsAffected > 20,
    };
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const reputationalImpact = {
        severity: (criticalEvents > 5 ? 'high' : criticalEvents > 2 ? 'medium' : 'low'),
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
exports.calculateCampaignImpact = calculateCampaignImpact;
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
const estimateFinancialImpact = (targets, avgCostPerIncident) => {
    const compromised = targets.filter(t => t.compromised);
    let totalCost = 0;
    compromised.forEach((target) => {
        let multiplier = 1;
        // Increase cost based on impact
        if (target.impactLevel === 'critical')
            multiplier = 3;
        else if (target.impactLevel === 'high')
            multiplier = 2;
        else if (target.impactLevel === 'medium')
            multiplier = 1.5;
        // Add data exfiltration cost
        if (target.dataExfiltrated)
            multiplier += 0.5;
        totalCost += avgCostPerIncident * multiplier;
    });
    return Math.round(totalCost);
};
exports.estimateFinancialImpact = estimateFinancialImpact;
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
const assessDataBreachSeverity = (targets) => {
    const exfilTargets = targets.filter(t => t.dataExfiltrated);
    const recordsAffected = exfilTargets.length * 10000; // Simplified
    let severity = 'low';
    if (recordsAffected > 100000)
        severity = 'critical';
    else if (recordsAffected > 50000)
        severity = 'high';
    else if (recordsAffected > 10000)
        severity = 'medium';
    return {
        severity,
        recordsAffected,
        dataTypes: ['PII', 'Credentials', 'Financial'],
    };
};
exports.assessDataBreachSeverity = assessDataBreachSeverity;
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
const attributeCampaignToActor = (campaignId, actorId, matchedTTPs, matchedInfra) => {
    const ttpWeight = matchedTTPs.length * 15; // Up to 15 points per TTP
    const infraWeight = matchedInfra.length * 20; // Up to 20 points per infrastructure
    const baseConfidence = 20; // Baseline confidence
    const confidence = Math.min(100, baseConfidence + ttpWeight + infraWeight);
    const evidenceTypes = [];
    if (matchedTTPs.length > 0)
        evidenceTypes.push('ttp-matching');
    if (matchedInfra.length > 0)
        evidenceTypes.push('infrastructure-overlap');
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
exports.attributeCampaignToActor = attributeCampaignToActor;
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
const calculateAttributionConfidence = (evidenceTypes, ttpMatchCount, infraMatchCount) => {
    let confidence = 0;
    // Base confidence from evidence type diversity
    confidence += evidenceTypes.length * 10;
    // TTP matching confidence
    confidence += Math.min(40, ttpMatchCount * 8);
    // Infrastructure matching confidence
    confidence += Math.min(30, infraMatchCount * 10);
    return Math.min(100, confidence);
};
exports.calculateAttributionConfidence = calculateAttributionConfidence;
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
const validateCampaignAttribution = (attribution) => {
    const issues = [];
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
exports.validateCampaignAttribution = validateCampaignAttribution;
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
const transitionCampaignStatus = (campaign, newStatus) => {
    const validTransitions = {
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
exports.transitionCampaignStatus = transitionCampaignStatus;
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
const archiveCampaign = (campaign) => {
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
exports.archiveCampaign = archiveCampaign;
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
const mergeCampaigns = (campaigns) => {
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
exports.mergeCampaigns = mergeCampaigns;
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
const identifyTemporalPatterns = (events) => {
    const patterns = [];
    // Group by day of week
    const dayOfWeekCounts = {};
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
exports.identifyTemporalPatterns = identifyTemporalPatterns;
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
const identifyGeographicPatterns = (targets) => {
    const patterns = [];
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
exports.identifyGeographicPatterns = identifyGeographicPatterns;
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
const detectTechnicalPatterns = (ttps) => {
    const patterns = [];
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
exports.detectTechnicalPatterns = detectTechnicalPatterns;
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
const correlateCampaigns = (campaign1, campaign2) => {
    const evidence = [];
    let similarityScore = 0;
    let correlationType = null;
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
    const overlap = checkTemporalOverlap(campaign1.firstDetected, campaign1.lastActivity, campaign2.firstDetected, campaign2.lastActivity);
    if (overlap) {
        similarityScore += 20;
        evidence.push('Temporal overlap detected');
    }
    if (similarityScore < 30)
        return null;
    return {
        campaign1Id: campaign1.id,
        campaign2Id: campaign2.id,
        correlationType: correlationType || 'shared-targets',
        similarityScore: Math.min(100, similarityScore),
        evidence,
        confidence: Math.min(100, similarityScore),
    };
};
exports.correlateCampaigns = correlateCampaigns;
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
const findRelatedCampaigns = (campaign, allCampaigns, minSimilarity) => {
    const correlations = [];
    allCampaigns.forEach((other) => {
        if (other.id === campaign.id)
            return;
        const correlation = (0, exports.correlateCampaigns)(campaign, other);
        if (correlation && correlation.similarityScore >= minSimilarity) {
            correlations.push(correlation);
        }
    });
    return correlations.sort((a, b) => b.similarityScore - a.similarityScore);
};
exports.findRelatedCampaigns = findRelatedCampaigns;
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
const createCampaignManagementProvider = () => {
    return 'CampaignManagementProvider template - see example above';
};
exports.createCampaignManagementProvider = createCampaignManagementProvider;
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
const defineCampaignAssociations = () => {
    return 'Campaign model associations - see example above';
};
exports.defineCampaignAssociations = defineCampaignAssociations;
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
const defineCampaignEndpoints = () => {
    return 'Campaign API endpoints - see example above';
};
exports.defineCampaignEndpoints = defineCampaignEndpoints;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Generates unique campaign ID.
 *
 * @returns {string} Campaign identifier
 */
const generateCampaignId = () => {
    return `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
exports.generateCampaignId = generateCampaignId;
/**
 * Calculates incident similarity score.
 *
 * @param {CampaignEvent} event1 - First event
 * @param {CampaignEvent} event2 - Second event
 * @returns {number} Similarity score (0-100)
 */
const calculateIncidentSimilarity = (event1, event2) => {
    let score = 0;
    if (event1.eventType === event2.eventType)
        score += 40;
    if (event1.severity === event2.severity)
        score += 20;
    const timeDiff = Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime());
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    if (daysDiff < 7)
        score += 20;
    else if (daysDiff < 30)
        score += 10;
    return score;
};
exports.calculateIncidentSimilarity = calculateIncidentSimilarity;
/**
 * Calculates target impact level.
 */
const calculateTargetImpact = (compromised, dataExfiltrated, systemsAffected) => {
    if (!compromised)
        return 'none';
    if (dataExfiltrated && systemsAffected > 50)
        return 'critical';
    if (dataExfiltrated && systemsAffected > 20)
        return 'high';
    if (systemsAffected > 10)
        return 'medium';
    return 'low';
};
/**
 * Determines overall campaign severity.
 */
const determineOverallSeverity = (targets, events) => {
    const criticalTargets = targets.filter(t => t.impactLevel === 'critical').length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    if (criticalTargets > 5 || criticalEvents > 10)
        return 'critical';
    if (criticalTargets > 2 || criticalEvents > 5)
        return 'high';
    if (targets.filter(t => t.compromised).length > 10)
        return 'medium';
    return 'low';
};
/**
 * Checks temporal overlap between two time periods.
 */
const checkTemporalOverlap = (start1, end1, start2, end2) => {
    return start1 <= end2 && start2 <= end1;
};
/**
 * Calculates campaign threat score.
 */
const calculateCampaignThreatScore = (campaign, timeline, impact) => {
    const sophisticationWeight = {
        low: 20,
        medium: 40,
        high: 70,
        'very-high': 90,
    };
    let score = sophisticationWeight[campaign.sophistication];
    if (campaign.status === 'active')
        score += 20;
    if (campaign.victimCount > 50)
        score += 15;
    if (impact.overallSeverity === 'critical')
        score += 25;
    if (impact.overallSeverity === 'high')
        score += 15;
    return Math.min(100, score);
};
exports.calculateCampaignThreatScore = calculateCampaignThreatScore;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Campaign detection
    createThreatCampaign: exports.createThreatCampaign,
    validateThreatCampaign: exports.validateThreatCampaign,
    detectCampaignFromIncidents: exports.detectCampaignFromIncidents,
    updateCampaignActivity: exports.updateCampaignActivity,
    markCampaignDormant: exports.markCampaignDormant,
    // Timeline analysis
    buildCampaignTimeline: exports.buildCampaignTimeline,
    identifyCampaignPhases: exports.identifyCampaignPhases,
    determineActivityPattern: exports.determineActivityPattern,
    analyzeCampaignTempo: exports.analyzeCampaignTempo,
    // Target profiling
    createCampaignTarget: exports.createCampaignTarget,
    analyzeTargetingPatterns: exports.analyzeTargetingPatterns,
    identifyHighValueTargets: exports.identifyHighValueTargets,
    // Impact assessment
    calculateCampaignImpact: exports.calculateCampaignImpact,
    estimateFinancialImpact: exports.estimateFinancialImpact,
    assessDataBreachSeverity: exports.assessDataBreachSeverity,
    // Attribution
    attributeCampaignToActor: exports.attributeCampaignToActor,
    calculateAttributionConfidence: exports.calculateAttributionConfidence,
    validateCampaignAttribution: exports.validateCampaignAttribution,
    // Lifecycle management
    transitionCampaignStatus: exports.transitionCampaignStatus,
    archiveCampaign: exports.archiveCampaign,
    mergeCampaigns: exports.mergeCampaigns,
    // Pattern recognition
    identifyTemporalPatterns: exports.identifyTemporalPatterns,
    identifyGeographicPatterns: exports.identifyGeographicPatterns,
    detectTechnicalPatterns: exports.detectTechnicalPatterns,
    // Correlation
    correlateCampaigns: exports.correlateCampaigns,
    findRelatedCampaigns: exports.findRelatedCampaigns,
    // NestJS patterns
    createCampaignManagementProvider: exports.createCampaignManagementProvider,
    // Sequelize
    defineCampaignAssociations: exports.defineCampaignAssociations,
    // API
    defineCampaignEndpoints: exports.defineCampaignEndpoints,
    // Utilities
    generateCampaignId: exports.generateCampaignId,
    calculateCampaignThreatScore: exports.calculateCampaignThreatScore,
};
//# sourceMappingURL=threat-campaigns-kit.js.map