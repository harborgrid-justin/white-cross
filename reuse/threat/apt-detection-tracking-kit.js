"use strict";
/**
 * LOC: APTD1234567
 * File: /reuse/threat/apt-detection-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - APT detection engines
 *   - Security analytics platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAPTAPI = exports.createAPTDetectionService = exports.defineAPTAssociations = exports.defineAPTCampaignModel = exports.defineAPTGroupModel = exports.correlateAlerts = exports.prioritizeAPTAlerts = exports.createAPTDetectionAlert = exports.exportReport = exports.generateExecutiveSummary = exports.generateAPTIntelligenceReport = exports.validateSharingCompliance = exports.generateTAXIIFeed = exports.generateSTIXIntelligence = exports.rankAttributionsByConfidence = exports.validateAttributionEvidence = exports.calculateAttributionConfidence = exports.createAPTAttribution = exports.generateTTPDetectionRules = exports.analyzeTTPCoverage = exports.mapAPTTTPToMITRE = exports.identifyDwellTimeFactors = exports.calculateDwellTimeStatistics = exports.analyzeDwellTime = exports.correlateInfrastructureWithMalware = exports.monitorInfrastructureLifecycle = exports.findInfrastructureOverlaps = exports.trackAPTInfrastructure = exports.analyzePatternEvolution = exports.updatePatternObservations = exports.detectBehaviorPatterns = exports.registerBehaviorPattern = exports.calculateCampaignImpact = exports.identifyRelatedCampaigns = exports.trackCampaignProgression = exports.createAPTCampaign = exports.mergeAPTGroups = exports.updateAPTGroupActivity = exports.validateAPTGroup = exports.createAPTGroup = void 0;
// ============================================================================
// APT GROUP MANAGEMENT
// ============================================================================
/**
 * Creates a new APT group profile with validation.
 *
 * @param {Partial<APTGroup>} groupData - APT group data
 * @returns {APTGroup} Validated APT group
 * @throws {Error} If required fields are missing or invalid
 *
 * @example
 * ```typescript
 * const aptGroup = createAPTGroup({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy', 'Strontium'],
 *   type: 'nation-state',
 *   attribution: { country: 'RU', confidence: 95 },
 *   sophistication: 'advanced'
 * });
 * // Result: { id: 'apt-uuid', name: 'APT28', ... }
 * ```
 */
const createAPTGroup = (groupData) => {
    if (!groupData.name) {
        throw new Error('APT group name is required');
    }
    const now = new Date();
    return {
        id: groupData.id || generateAPTGroupId(),
        name: groupData.name,
        aliases: groupData.aliases || [],
        type: groupData.type || 'unknown',
        attribution: groupData.attribution || { confidence: 0 },
        firstSeen: groupData.firstSeen || now,
        lastSeen: groupData.lastSeen || now,
        active: groupData.active ?? true,
        sophistication: groupData.sophistication || 'medium',
        targets: groupData.targets || { sectors: [], regions: [], organizationTypes: [] },
        motivation: groupData.motivation || ['unknown'],
        metadata: groupData.metadata || {},
    };
};
exports.createAPTGroup = createAPTGroup;
/**
 * Validates APT group profile for completeness.
 *
 * @param {APTGroup} group - APT group to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateAPTGroup(aptGroup);
 * // Result: true (or throws error)
 * ```
 */
const validateAPTGroup = (group) => {
    if (!group.id || !group.name) {
        throw new Error('APT group must have id and name');
    }
    if (group.attribution.confidence < 0 || group.attribution.confidence > 100) {
        throw new Error('Attribution confidence must be between 0 and 100');
    }
    if (group.firstSeen > group.lastSeen) {
        throw new Error('First seen date cannot be after last seen date');
    }
    return true;
};
exports.validateAPTGroup = validateAPTGroup;
/**
 * Updates APT group activity status based on recent observations.
 *
 * @param {APTGroup} group - APT group to update
 * @param {Date} lastActivityDate - Most recent activity date
 * @returns {APTGroup} Updated APT group
 *
 * @example
 * ```typescript
 * const updated = updateAPTGroupActivity(aptGroup, new Date());
 * // Updates lastSeen and active status
 * ```
 */
const updateAPTGroupActivity = (group, lastActivityDate) => {
    const daysSinceActivity = Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
        ...group,
        lastSeen: lastActivityDate > group.lastSeen ? lastActivityDate : group.lastSeen,
        active: daysSinceActivity < 180, // Consider inactive after 180 days
    };
};
exports.updateAPTGroupActivity = updateAPTGroupActivity;
/**
 * Merges duplicate APT group profiles.
 *
 * @param {APTGroup[]} groups - APT groups to merge
 * @returns {APTGroup} Merged APT group
 *
 * @example
 * ```typescript
 * const merged = mergeAPTGroups([group1, group2]);
 * // Combines aliases, takes highest confidence, most recent dates
 * ```
 */
const mergeAPTGroups = (groups) => {
    if (groups.length === 0) {
        throw new Error('No APT groups to merge');
    }
    const primary = groups[0];
    const allAliases = new Set(primary.aliases);
    let maxConfidence = primary.attribution.confidence;
    let latestSeen = primary.lastSeen;
    let earliestSeen = primary.firstSeen;
    groups.slice(1).forEach((group) => {
        group.aliases.forEach(alias => allAliases.add(alias));
        allAliases.add(group.name);
        maxConfidence = Math.max(maxConfidence, group.attribution.confidence);
        latestSeen = group.lastSeen > latestSeen ? group.lastSeen : latestSeen;
        earliestSeen = group.firstSeen < earliestSeen ? group.firstSeen : earliestSeen;
    });
    return {
        ...primary,
        aliases: Array.from(allAliases).filter(a => a !== primary.name),
        attribution: { ...primary.attribution, confidence: maxConfidence },
        firstSeen: earliestSeen,
        lastSeen: latestSeen,
    };
};
exports.mergeAPTGroups = mergeAPTGroups;
// ============================================================================
// APT CAMPAIGN TRACKING
// ============================================================================
/**
 * Creates a new APT campaign with tracking metadata.
 *
 * @param {Partial<APTCampaign>} campaignData - Campaign data
 * @returns {APTCampaign} Created APT campaign
 *
 * @example
 * ```typescript
 * const campaign = createAPTCampaign({
 *   name: 'Operation Ghost',
 *   aptGroupId: 'apt-28',
 *   objectives: ['credential theft', 'data exfiltration'],
 *   targetedSectors: ['healthcare', 'government']
 * });
 * ```
 */
const createAPTCampaign = (campaignData) => {
    if (!campaignData.name || !campaignData.aptGroupId) {
        throw new Error('Campaign name and APT group ID are required');
    }
    return {
        id: campaignData.id || generateCampaignId(),
        name: campaignData.name,
        aptGroupId: campaignData.aptGroupId,
        startDate: campaignData.startDate || new Date(),
        endDate: campaignData.endDate,
        active: campaignData.active ?? true,
        objectives: campaignData.objectives || [],
        targetedSectors: campaignData.targetedSectors || [],
        targetedRegions: campaignData.targetedRegions || [],
        affectedOrganizations: campaignData.affectedOrganizations || 0,
        detectionConfidence: campaignData.detectionConfidence || 50,
        severity: campaignData.severity || 'medium',
        ttps: campaignData.ttps || [],
        iocs: campaignData.iocs || { ipAddresses: [], domains: [], fileHashes: [], emailAddresses: [] },
        victimCount: campaignData.victimCount || 0,
        estimatedDamage: campaignData.estimatedDamage,
        description: campaignData.description,
    };
};
exports.createAPTCampaign = createAPTCampaign;
/**
 * Tracks campaign progression and updates metadata.
 *
 * @param {APTCampaign} campaign - Campaign to track
 * @param {object} update - Update data
 * @returns {APTCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = trackCampaignProgression(campaign, {
 *   newVictims: 5,
 *   newIOCs: { domains: ['evil.com'] },
 *   severity: 'high'
 * });
 * ```
 */
const trackCampaignProgression = (campaign, update) => {
    return {
        ...campaign,
        victimCount: campaign.victimCount + (update.newVictims || 0),
        affectedOrganizations: campaign.affectedOrganizations + (update.newVictims || 0),
        iocs: {
            ipAddresses: [...campaign.iocs.ipAddresses, ...(update.newIOCs?.ipAddresses || [])],
            domains: [...campaign.iocs.domains, ...(update.newIOCs?.domains || [])],
            fileHashes: [...campaign.iocs.fileHashes, ...(update.newIOCs?.fileHashes || [])],
            emailAddresses: [...campaign.iocs.emailAddresses, ...(update.newIOCs?.emailAddresses || [])],
        },
        severity: update.severity || campaign.severity,
        endDate: update.endDate || campaign.endDate,
        active: !update.endDate,
    };
};
exports.trackCampaignProgression = trackCampaignProgression;
/**
 * Identifies related campaigns based on TTPs and IOCs.
 *
 * @param {APTCampaign} campaign - Campaign to analyze
 * @param {APTCampaign[]} allCampaigns - All known campaigns
 * @returns {Array<{ campaign: APTCampaign; similarity: number }>} Related campaigns
 *
 * @example
 * ```typescript
 * const related = identifyRelatedCampaigns(currentCampaign, historicalCampaigns);
 * // Result: [{ campaign: {...}, similarity: 0.85 }, ...]
 * ```
 */
const identifyRelatedCampaigns = (campaign, allCampaigns) => {
    return allCampaigns
        .filter(c => c.id !== campaign.id)
        .map((c) => {
        const ttpOverlap = calculateTTPOverlap(campaign.ttps, c.ttps);
        const iocOverlap = calculateIOCOverlap(campaign.iocs, c.iocs);
        const targetOverlap = calculateTargetOverlap(campaign.targetedSectors, c.targetedSectors);
        const similarity = (ttpOverlap * 0.4 + iocOverlap * 0.4 + targetOverlap * 0.2);
        return { campaign: c, similarity };
    })
        .filter(({ similarity }) => similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity);
};
exports.identifyRelatedCampaigns = identifyRelatedCampaigns;
/**
 * Calculates campaign impact score.
 *
 * @param {APTCampaign} campaign - Campaign to assess
 * @returns {number} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = calculateCampaignImpact(campaign);
 * // Result: 87
 * ```
 */
const calculateCampaignImpact = (campaign) => {
    const severityScore = { low: 10, medium: 30, high: 60, critical: 100 }[campaign.severity];
    const victimScore = Math.min(campaign.victimCount * 2, 40);
    const durationDays = campaign.endDate
        ? Math.floor((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((Date.now() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationScore = Math.min(durationDays / 10, 30);
    return Math.min(100, Math.round(severityScore * 0.5 + victimScore + durationScore * 0.5));
};
exports.calculateCampaignImpact = calculateCampaignImpact;
// ============================================================================
// BEHAVIOR PATTERN DETECTION
// ============================================================================
/**
 * Registers APT behavior pattern for detection.
 *
 * @param {Partial<APTBehaviorPattern>} patternData - Pattern data
 * @returns {APTBehaviorPattern} Registered pattern
 *
 * @example
 * ```typescript
 * const pattern = registerBehaviorPattern({
 *   aptGroupId: 'apt-28',
 *   patternType: 'lateral-movement',
 *   signature: 'PsExec + Mimikatz combo',
 *   mitreAttackIds: ['T1021.002', 'T1003.001']
 * });
 * ```
 */
const registerBehaviorPattern = (patternData) => {
    if (!patternData.aptGroupId || !patternData.signature) {
        throw new Error('APT group ID and signature are required');
    }
    const now = new Date();
    return {
        id: patternData.id || generatePatternId(),
        aptGroupId: patternData.aptGroupId,
        patternType: patternData.patternType || 'reconnaissance',
        signature: patternData.signature,
        description: patternData.description || '',
        mitreAttackIds: patternData.mitreAttackIds || [],
        frequency: patternData.frequency || 'rare',
        observationCount: patternData.observationCount || 1,
        firstObserved: patternData.firstObserved || now,
        lastObserved: patternData.lastObserved || now,
        confidence: patternData.confidence || 50,
        falsePositiveRate: patternData.falsePositiveRate || 0.1,
        detectionRules: patternData.detectionRules || [],
    };
};
exports.registerBehaviorPattern = registerBehaviorPattern;
/**
 * Detects APT behavior patterns in activity logs.
 *
 * @param {any[]} activityLogs - Security event logs
 * @param {APTBehaviorPattern[]} knownPatterns - Known APT patterns
 * @returns {Array<{ pattern: APTBehaviorPattern; matches: any[] }>} Detected patterns
 *
 * @example
 * ```typescript
 * const detections = detectBehaviorPatterns(securityLogs, aptPatterns);
 * // Result: [{ pattern: {...}, matches: [...] }, ...]
 * ```
 */
const detectBehaviorPatterns = (activityLogs, knownPatterns) => {
    const detections = [];
    knownPatterns.forEach((pattern) => {
        const matches = activityLogs.filter(log => matchesPattern(log, pattern.signature, pattern.mitreAttackIds));
        if (matches.length > 0) {
            const confidence = calculateDetectionConfidence(pattern.confidence, matches.length, pattern.falsePositiveRate);
            detections.push({ pattern, matches, confidence });
        }
    });
    return detections.sort((a, b) => b.confidence - a.confidence);
};
exports.detectBehaviorPatterns = detectBehaviorPatterns;
/**
 * Updates pattern observation statistics.
 *
 * @param {APTBehaviorPattern} pattern - Pattern to update
 * @param {number} newObservations - Number of new observations
 * @returns {APTBehaviorPattern} Updated pattern
 *
 * @example
 * ```typescript
 * const updated = updatePatternObservations(pattern, 5);
 * // Increments observation count and updates frequency
 * ```
 */
const updatePatternObservations = (pattern, newObservations) => {
    const newCount = pattern.observationCount + newObservations;
    let frequency = 'rare';
    if (newCount >= 50)
        frequency = 'frequent';
    else if (newCount >= 20)
        frequency = 'common';
    else if (newCount >= 5)
        frequency = 'occasional';
    return {
        ...pattern,
        observationCount: newCount,
        lastObserved: new Date(),
        frequency,
    };
};
exports.updatePatternObservations = updatePatternObservations;
/**
 * Analyzes pattern evolution over time.
 *
 * @param {APTBehaviorPattern[]} patterns - Historical patterns
 * @param {string} aptGroupId - APT group ID
 * @returns {object} Evolution analysis
 *
 * @example
 * ```typescript
 * const evolution = analyzePatternEvolution(patterns, 'apt-28');
 * // Result: { trending: [...], deprecated: [...], emerging: [...] }
 * ```
 */
const analyzePatternEvolution = (patterns, aptGroupId) => {
    const groupPatterns = patterns.filter(p => p.aptGroupId === aptGroupId);
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
    const trending = groupPatterns.filter(p => p.lastObserved.getTime() > thirtyDaysAgo && p.frequency === 'frequent');
    const deprecated = groupPatterns.filter(p => p.lastObserved.getTime() < ninetyDaysAgo && p.frequency === 'rare');
    const emerging = groupPatterns.filter(p => p.firstObserved.getTime() > thirtyDaysAgo && p.observationCount >= 3);
    return { trending, deprecated, emerging };
};
exports.analyzePatternEvolution = analyzePatternEvolution;
// ============================================================================
// INFRASTRUCTURE TRACKING
// ============================================================================
/**
 * Tracks APT infrastructure with lifecycle management.
 *
 * @param {Partial<APTInfrastructure>} infraData - Infrastructure data
 * @returns {APTInfrastructure} Tracked infrastructure
 *
 * @example
 * ```typescript
 * const infra = trackAPTInfrastructure({
 *   aptGroupId: 'apt-28',
 *   type: 'domain',
 *   value: 'malicious-c2.com',
 *   role: 'c2',
 *   active: true
 * });
 * ```
 */
const trackAPTInfrastructure = (infraData) => {
    if (!infraData.aptGroupId || !infraData.type || !infraData.value) {
        throw new Error('APT group ID, type, and value are required');
    }
    const now = new Date();
    return {
        id: infraData.id || generateInfrastructureId(),
        aptGroupId: infraData.aptGroupId,
        type: infraData.type,
        value: infraData.value,
        role: infraData.role || 'c2',
        active: infraData.active ?? true,
        confidence: infraData.confidence || 50,
        firstSeen: infraData.firstSeen || now,
        lastSeen: infraData.lastSeen || now,
        registrationDate: infraData.registrationDate,
        expirationDate: infraData.expirationDate,
        registrar: infraData.registrar,
        associatedMalware: infraData.associatedMalware || [],
        geolocation: infraData.geolocation,
    };
};
exports.trackAPTInfrastructure = trackAPTInfrastructure;
/**
 * Identifies infrastructure overlaps between APT groups.
 *
 * @param {APTInfrastructure[]} group1Infra - First group's infrastructure
 * @param {APTInfrastructure[]} group2Infra - Second group's infrastructure
 * @returns {APTInfrastructure[]} Overlapping infrastructure
 *
 * @example
 * ```typescript
 * const overlaps = findInfrastructureOverlaps(apt28Infra, apt29Infra);
 * // Result: [{ type: 'domain', value: 'shared-c2.com', ... }]
 * ```
 */
const findInfrastructureOverlaps = (group1Infra, group2Infra) => {
    const overlaps = [];
    group1Infra.forEach((infra1) => {
        const match = group2Infra.find(infra2 => infra2.type === infra1.type && infra2.value === infra1.value);
        if (match) {
            overlaps.push(infra1);
        }
    });
    return overlaps;
};
exports.findInfrastructureOverlaps = findInfrastructureOverlaps;
/**
 * Monitors infrastructure lifecycle and expiration.
 *
 * @param {APTInfrastructure[]} infrastructure - Infrastructure to monitor
 * @returns {object} Lifecycle status
 *
 * @example
 * ```typescript
 * const status = monitorInfrastructureLifecycle(infrastructure);
 * // Result: { expiring: [...], expired: [...], active: [...] }
 * ```
 */
const monitorInfrastructureLifecycle = (infrastructure) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expiring = infrastructure.filter(i => i.expirationDate && i.expirationDate > now && i.expirationDate < thirtyDaysFromNow);
    const expired = infrastructure.filter(i => i.expirationDate && i.expirationDate < now);
    const active = infrastructure.filter(i => i.active && (!i.expirationDate || i.expirationDate > now));
    return { expiring, expired, active };
};
exports.monitorInfrastructureLifecycle = monitorInfrastructureLifecycle;
/**
 * Correlates infrastructure with malware families.
 *
 * @param {APTInfrastructure} infrastructure - Infrastructure to analyze
 * @param {string[]} malwareFamilies - Known malware families
 * @returns {object} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = correlateInfrastructureWithMalware(infra, ['Cobalt Strike', 'Emotet']);
 * ```
 */
const correlateInfrastructureWithMalware = (infrastructure, malwareFamilies) => {
    const correlated = infrastructure.associatedMalware?.filter(m => malwareFamilies.includes(m)) || [];
    const confidence = correlated.length > 0
        ? Math.min(100, (correlated.length / malwareFamilies.length) * 100)
        : 0;
    return { correlated, confidence };
};
exports.correlateInfrastructureWithMalware = correlateInfrastructureWithMalware;
// ============================================================================
// DWELL TIME ANALYSIS
// ============================================================================
/**
 * Analyzes dwell time for APT campaign.
 *
 * @param {Partial<DwellTimeAnalysis>} analysisData - Dwell time data
 * @returns {DwellTimeAnalysis} Dwell time analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeDwellTime({
 *   campaignId: 'camp-123',
 *   organizationId: 'org-456',
 *   initialCompromise: new Date('2024-01-01'),
 *   detectionDate: new Date('2024-03-15')
 * });
 * // Result: { dwellTimeDays: 74, ... }
 * ```
 */
const analyzeDwellTime = (analysisData) => {
    if (!analysisData.initialCompromise || !analysisData.detectionDate) {
        throw new Error('Initial compromise and detection dates are required');
    }
    const dwellTimeDays = Math.floor((analysisData.detectionDate.getTime() - analysisData.initialCompromise.getTime()) / (1000 * 60 * 60 * 24));
    return {
        campaignId: analysisData.campaignId || '',
        organizationId: analysisData.organizationId || '',
        initialCompromise: analysisData.initialCompromise,
        detectionDate: analysisData.detectionDate,
        dwellTimeDays,
        attackPhases: analysisData.attackPhases || [],
        dataExfiltrated: analysisData.dataExfiltrated || false,
        estimatedDataVolume: analysisData.estimatedDataVolume,
        lateralMovementExtent: analysisData.lateralMovementExtent || 'none',
        persistenceMechanisms: analysisData.persistenceMechanisms || [],
        detectionMethod: analysisData.detectionMethod || 'unknown',
    };
};
exports.analyzeDwellTime = analyzeDwellTime;
/**
 * Calculates average dwell time across campaigns.
 *
 * @param {DwellTimeAnalysis[]} analyses - Dwell time analyses
 * @returns {object} Statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDwellTimeStatistics(analyses);
 * // Result: { average: 65, median: 58, min: 7, max: 180 }
 * ```
 */
const calculateDwellTimeStatistics = (analyses) => {
    if (analyses.length === 0) {
        return { average: 0, median: 0, min: 0, max: 0, distribution: {} };
    }
    const dwellTimes = analyses.map(a => a.dwellTimeDays).sort((a, b) => a - b);
    const average = Math.round(dwellTimes.reduce((sum, t) => sum + t, 0) / dwellTimes.length);
    const median = dwellTimes[Math.floor(dwellTimes.length / 2)];
    const min = dwellTimes[0];
    const max = dwellTimes[dwellTimes.length - 1];
    const distribution = {
        '0-30 days': dwellTimes.filter(t => t <= 30).length,
        '31-90 days': dwellTimes.filter(t => t > 30 && t <= 90).length,
        '91-180 days': dwellTimes.filter(t => t > 90 && t <= 180).length,
        '180+ days': dwellTimes.filter(t => t > 180).length,
    };
    return { average, median, min, max, distribution };
};
exports.calculateDwellTimeStatistics = calculateDwellTimeStatistics;
/**
 * Identifies factors contributing to extended dwell time.
 *
 * @param {DwellTimeAnalysis} analysis - Dwell time analysis
 * @returns {object} Contributing factors
 *
 * @example
 * ```typescript
 * const factors = identifyDwellTimeFactors(analysis);
 * // Result: { factors: ['...'], recommendations: ['...'] }
 * ```
 */
const identifyDwellTimeFactors = (analysis) => {
    const factors = [];
    const recommendations = [];
    if (analysis.dwellTimeDays > 90) {
        factors.push('Extended dwell time exceeds 90 days');
        recommendations.push('Implement continuous monitoring and anomaly detection');
    }
    if (analysis.lateralMovementExtent === 'extensive') {
        factors.push('Extensive lateral movement indicates detection gaps');
        recommendations.push('Enhance network segmentation and lateral movement detection');
    }
    if (analysis.persistenceMechanisms.length > 3) {
        factors.push('Multiple persistence mechanisms suggest sophisticated adversary');
        recommendations.push('Conduct thorough endpoint forensics and hardening');
    }
    if (analysis.dataExfiltrated) {
        factors.push('Data exfiltration occurred during dwell period');
        recommendations.push('Implement DLP and egress monitoring');
    }
    return { factors, recommendations };
};
exports.identifyDwellTimeFactors = identifyDwellTimeFactors;
// ============================================================================
// TTP MAPPING & ANALYSIS
// ============================================================================
/**
 * Maps APT TTPs to MITRE ATT&CK framework.
 *
 * @param {Partial<APTTTPMapping>} ttpData - TTP data
 * @returns {APTTTPMapping} Mapped TTP
 *
 * @example
 * ```typescript
 * const ttp = mapAPTTTPToMITRE({
 *   aptGroupId: 'apt-28',
 *   mitreAttackId: 'T1566.001',
 *   tactic: 'Initial Access',
 *   technique: 'Phishing: Spearphishing Attachment'
 * });
 * ```
 */
const mapAPTTTPToMITRE = (ttpData) => {
    if (!ttpData.aptGroupId || !ttpData.mitreAttackId) {
        throw new Error('APT group ID and MITRE ATT&CK ID are required');
    }
    const now = new Date();
    return {
        aptGroupId: ttpData.aptGroupId,
        campaignId: ttpData.campaignId,
        mitreAttackId: ttpData.mitreAttackId,
        tactic: ttpData.tactic || '',
        technique: ttpData.technique || '',
        subTechnique: ttpData.subTechnique,
        procedureDescription: ttpData.procedureDescription || '',
        toolsUsed: ttpData.toolsUsed || [],
        observationCount: ttpData.observationCount || 1,
        firstObserved: ttpData.firstObserved || now,
        lastObserved: ttpData.lastObserved || now,
        effectiveness: ttpData.effectiveness || 'medium',
        detectionDifficulty: ttpData.detectionDifficulty || 'moderate',
        mitigations: ttpData.mitigations || [],
    };
};
exports.mapAPTTTPToMITRE = mapAPTTTPToMITRE;
/**
 * Analyzes TTP coverage across MITRE ATT&CK matrix.
 *
 * @param {APTTTPMapping[]} ttps - APT TTPs
 * @returns {object} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = analyzeTTPCoverage(aptTTPs);
 * // Result: { tactics: {...}, techniques: {...}, coverage: 0.65 }
 * ```
 */
const analyzeTTPCoverage = (ttps) => {
    const tacticCounts = {};
    const uniqueTechniques = new Set();
    ttps.forEach((ttp) => {
        tacticCounts[ttp.tactic] = (tacticCounts[ttp.tactic] || 0) + 1;
        uniqueTechniques.add(ttp.mitreAttackId);
    });
    const totalTactics = 14; // MITRE ATT&CK has 14 tactics
    const totalTechniques = 200; // Approximate total techniques
    const coverage = Math.min(1, uniqueTechniques.size / totalTechniques);
    return {
        tactics: tacticCounts,
        techniques: uniqueTechniques.size,
        coverage: Math.round(coverage * 100) / 100,
    };
};
exports.analyzeTTPCoverage = analyzeTTPCoverage;
/**
 * Generates TTP-based detection rules.
 *
 * @param {APTTTPMapping} ttp - TTP to generate rules for
 * @returns {string[]} Detection rules
 *
 * @example
 * ```typescript
 * const rules = generateTTPDetectionRules(ttp);
 * // Result: ['Sigma rule...', 'YARA rule...']
 * ```
 */
const generateTTPDetectionRules = (ttp) => {
    const rules = [];
    // Sigma rule template
    rules.push(`
title: Detect ${ttp.technique}
description: ${ttp.procedureDescription}
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4688
    CommandLine|contains: '${ttp.toolsUsed.join("' OR '")}'
  condition: selection
falsepositives:
  - Legitimate administrative activity
level: ${ttp.effectiveness === 'high' ? 'high' : 'medium'}
tags:
  - attack.${ttp.tactic.toLowerCase().replace(' ', '_')}
  - attack.${ttp.mitreAttackId.toLowerCase()}
`.trim());
    return rules;
};
exports.generateTTPDetectionRules = generateTTPDetectionRules;
// ============================================================================
// ATTRIBUTION & CONFIDENCE SCORING
// ============================================================================
/**
 * Creates APT attribution with evidence scoring.
 *
 * @param {Partial<APTAttribution>} attributionData - Attribution data
 * @returns {APTAttribution} Complete attribution
 *
 * @example
 * ```typescript
 * const attribution = createAPTAttribution({
 *   campaignId: 'camp-123',
 *   aptGroupId: 'apt-28',
 *   attributionMethod: 'ttp-match',
 *   evidence: [{ type: 'ttp', description: '...', weight: 85 }]
 * });
 * ```
 */
const createAPTAttribution = (attributionData) => {
    if (!attributionData.campaignId || !attributionData.aptGroupId) {
        throw new Error('Campaign ID and APT group ID are required');
    }
    const confidence = (0, exports.calculateAttributionConfidence)(attributionData.evidence || []);
    return {
        campaignId: attributionData.campaignId,
        aptGroupId: attributionData.aptGroupId,
        confidence,
        attributionMethod: attributionData.attributionMethod || 'combined',
        evidence: attributionData.evidence || [],
        analystNotes: attributionData.analystNotes,
        timestamp: new Date(),
        reviewStatus: attributionData.reviewStatus || 'preliminary',
    };
};
exports.createAPTAttribution = createAPTAttribution;
/**
 * Calculates attribution confidence based on evidence.
 *
 * @param {APTAttribution['evidence']} evidence - Evidence for attribution
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence(evidence);
 * // Result: 87
 * ```
 */
const calculateAttributionConfidence = (evidence) => {
    if (evidence.length === 0)
        return 0;
    const weightedSum = evidence.reduce((sum, e) => sum + e.weight, 0);
    const maxWeight = evidence.length * 100;
    // Apply diminishing returns for overlapping evidence
    const diversityBonus = new Set(evidence.map(e => e.type)).size / 7; // 7 evidence types
    const confidence = (weightedSum / maxWeight) * 100 * (0.8 + diversityBonus * 0.2);
    return Math.min(100, Math.round(confidence));
};
exports.calculateAttributionConfidence = calculateAttributionConfidence;
/**
 * Validates attribution evidence quality.
 *
 * @param {APTAttribution['evidence']} evidence - Evidence to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAttributionEvidence(evidence);
 * // Result: { valid: true, issues: [], score: 95 }
 * ```
 */
const validateAttributionEvidence = (evidence) => {
    const issues = [];
    let score = 100;
    if (evidence.length === 0) {
        issues.push('No evidence provided');
        score = 0;
    }
    if (evidence.length < 3) {
        issues.push('Insufficient evidence (minimum 3 pieces recommended)');
        score -= 20;
    }
    const evidenceTypes = new Set(evidence.map(e => e.type));
    if (evidenceTypes.size < 2) {
        issues.push('Evidence lacks diversity (multiple types recommended)');
        score -= 15;
    }
    evidence.forEach((e, idx) => {
        if (e.weight < 0 || e.weight > 100) {
            issues.push(`Evidence ${idx}: weight must be 0-100`);
            score -= 10;
        }
        if (!e.description || e.description.trim().length === 0) {
            issues.push(`Evidence ${idx}: description required`);
            score -= 5;
        }
    });
    return {
        valid: issues.length === 0 && score >= 60,
        issues,
        score: Math.max(0, score),
    };
};
exports.validateAttributionEvidence = validateAttributionEvidence;
/**
 * Compares attribution confidence across multiple APT groups.
 *
 * @param {APTAttribution[]} attributions - Attributions to compare
 * @returns {APTAttribution[]} Sorted by confidence (highest first)
 *
 * @example
 * ```typescript
 * const ranked = rankAttributionsByConfidence(attributions);
 * ```
 */
const rankAttributionsByConfidence = (attributions) => {
    return [...attributions].sort((a, b) => b.confidence - a.confidence);
};
exports.rankAttributionsByConfidence = rankAttributionsByConfidence;
// ============================================================================
// INTELLIGENCE SHARING
// ============================================================================
/**
 * Generates STIX 2.1 format intelligence package.
 *
 * @param {APTCampaign} campaign - Campaign to share
 * @param {APTGroup} aptGroup - Associated APT group
 * @returns {APTIntelligenceSharing} STIX package
 *
 * @example
 * ```typescript
 * const stix = generateSTIXIntelligence(campaign, aptGroup);
 * ```
 */
const generateSTIXIntelligence = (campaign, aptGroup) => {
    const stixData = {
        type: 'bundle',
        id: `bundle--${generateUUID()}`,
        objects: [
            {
                type: 'intrusion-set',
                id: `intrusion-set--${aptGroup.id}`,
                name: aptGroup.name,
                aliases: aptGroup.aliases,
                first_seen: aptGroup.firstSeen.toISOString(),
                last_seen: aptGroup.lastSeen.toISOString(),
            },
            {
                type: 'campaign',
                id: `campaign--${campaign.id}`,
                name: campaign.name,
                first_seen: campaign.startDate.toISOString(),
                last_seen: campaign.endDate?.toISOString(),
                objective: campaign.objectives.join(', '),
            },
        ],
    };
    return {
        id: generateSharingId(),
        sharingFormat: 'stix',
        aptGroupId: aptGroup.id,
        campaignId: campaign.id,
        data: stixData,
        classification: 'tlp-amber',
        sharedWith: [],
        sharedAt: new Date(),
        revoked: false,
    };
};
exports.generateSTIXIntelligence = generateSTIXIntelligence;
/**
 * Generates TAXII 2.1 compatible feed.
 *
 * @param {APTIntelligenceSharing[]} sharingRecords - Intelligence to share
 * @returns {object} TAXII feed
 *
 * @example
 * ```typescript
 * const taxiiFeed = generateTAXIIFeed(intelligenceRecords);
 * ```
 */
const generateTAXIIFeed = (sharingRecords) => {
    return {
        type: 'collection',
        id: `collection--${generateUUID()}`,
        title: 'APT Intelligence Feed',
        description: 'Curated APT intelligence for sharing',
        can_read: true,
        can_write: false,
        media_types: ['application/stix+json;version=2.1'],
        objects: sharingRecords.map(r => r.data),
    };
};
exports.generateTAXIIFeed = generateTAXIIFeed;
/**
 * Validates intelligence sharing compliance with TLP.
 *
 * @param {APTIntelligenceSharing} sharing - Sharing record to validate
 * @param {string[]} recipients - Intended recipients
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSharingCompliance(sharing, ['partner1', 'partner2']);
 * ```
 */
const validateSharingCompliance = (sharing, recipients) => {
    const issues = [];
    if (sharing.classification === 'tlp-red' && recipients.length > 0) {
        issues.push('TLP:RED intelligence cannot be shared beyond original recipient');
    }
    if (sharing.revoked) {
        issues.push('Intelligence has been revoked and should not be shared');
    }
    if (sharing.expiresAt && sharing.expiresAt < new Date()) {
        issues.push('Intelligence has expired');
    }
    return {
        compliant: issues.length === 0,
        issues,
    };
};
exports.validateSharingCompliance = validateSharingCompliance;
// ============================================================================
// INTELLIGENCE REPORTING
// ============================================================================
/**
 * Generates comprehensive APT intelligence report.
 *
 * @param {Partial<APTIntelligenceReport>} reportData - Report data
 * @returns {APTIntelligenceReport} Complete report
 *
 * @example
 * ```typescript
 * const report = generateAPTIntelligenceReport({
 *   reportType: 'operational',
 *   aptGroupId: 'apt-28',
 *   title: 'APT28 Q4 2024 Activity Summary'
 * });
 * ```
 */
const generateAPTIntelligenceReport = (reportData) => {
    return {
        id: reportData.id || generateReportId(),
        reportType: reportData.reportType || 'tactical',
        aptGroupId: reportData.aptGroupId,
        campaignId: reportData.campaignId,
        title: reportData.title || 'APT Intelligence Report',
        summary: reportData.summary || '',
        threatLevel: reportData.threatLevel || 'medium',
        confidence: reportData.confidence || 50,
        findings: reportData.findings || [],
        recommendations: reportData.recommendations || [],
        iocs: reportData.iocs || { ipAddresses: [], domains: [], fileHashes: [], urls: [] },
        targetAudience: reportData.targetAudience || ['security-team'],
        classification: reportData.classification || 'tlp-amber',
        generatedDate: new Date(),
        expirationDate: reportData.expirationDate,
        author: reportData.author || 'system',
        references: reportData.references || [],
    };
};
exports.generateAPTIntelligenceReport = generateAPTIntelligenceReport;
/**
 * Generates executive summary from technical findings.
 *
 * @param {APTIntelligenceReport} report - Intelligence report
 * @returns {string} Executive summary
 *
 * @example
 * ```typescript
 * const summary = generateExecutiveSummary(report);
 * ```
 */
const generateExecutiveSummary = (report) => {
    const threatLevelText = {
        low: 'Low',
        medium: 'Moderate',
        high: 'High',
        critical: 'Critical',
    }[report.threatLevel];
    const summary = `
EXECUTIVE SUMMARY

Threat Level: ${threatLevelText} (Confidence: ${report.confidence}%)
Report Type: ${report.reportType.toUpperCase()}
Generated: ${report.generatedDate.toISOString().split('T')[0]}

${report.summary}

Key Findings: ${report.findings.length} critical observations identified
Recommendations: ${report.recommendations.filter(r => r.priority === 'immediate' || r.priority === 'high').length} high-priority actions required
IOCs Identified: ${Object.values(report.iocs).flat().length} indicators of compromise

Immediate Actions Required:
${report.recommendations
        .filter(r => r.priority === 'immediate')
        .map((r, i) => `${i + 1}. ${r.action}`)
        .join('\n')}
  `.trim();
    return summary;
};
exports.generateExecutiveSummary = generateExecutiveSummary;
/**
 * Exports report in multiple formats (JSON, PDF, HTML).
 *
 * @param {APTIntelligenceReport} report - Report to export
 * @param {string} format - Export format
 * @returns {string} Exported report
 *
 * @example
 * ```typescript
 * const json = exportReport(report, 'json');
 * const html = exportReport(report, 'html');
 * ```
 */
const exportReport = (report, format) => {
    if (format === 'json') {
        return JSON.stringify(report, null, 2);
    }
    if (format === 'html') {
        return `
<!DOCTYPE html>
<html>
<head>
  <title>${report.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
    .section { margin-top: 30px; }
    .classification { color: red; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.title}</h1>
    <p class="classification">Classification: ${report.classification.toUpperCase()}</p>
    <p>Generated: ${report.generatedDate.toISOString()}</p>
    <p>Threat Level: ${report.threatLevel.toUpperCase()}</p>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${report.summary}</p>
  </div>

  <div class="section">
    <h2>Key Findings</h2>
    <ul>
      ${report.findings.map(f => `<li><strong>${f.category}:</strong> ${f.description}</li>`).join('\n')}
    </ul>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <ol>
      ${report.recommendations.map(r => `<li><strong>[${r.priority.toUpperCase()}]</strong> ${r.action} - ${r.rationale}</li>`).join('\n')}
    </ol>
  </div>
</body>
</html>
    `.trim();
    }
    return `PDF export not implemented - use external PDF generation library`;
};
exports.exportReport = exportReport;
// ============================================================================
// DETECTION & ALERTING
// ============================================================================
/**
 * Creates APT detection alert with triage information.
 *
 * @param {Partial<APTDetectionAlert>} alertData - Alert data
 * @returns {APTDetectionAlert} Created alert
 *
 * @example
 * ```typescript
 * const alert = createAPTDetectionAlert({
 *   severity: 'high',
 *   detectionType: 'ttp-match',
 *   aptGroupId: 'apt-28',
 *   indicators: ['T1566.001', 'suspicious-domain.com']
 * });
 * ```
 */
const createAPTDetectionAlert = (alertData) => {
    return {
        id: alertData.id || generateAlertId(),
        timestamp: new Date(),
        severity: alertData.severity || 'medium',
        aptGroupId: alertData.aptGroupId,
        campaignId: alertData.campaignId,
        detectionType: alertData.detectionType || 'anomaly',
        confidence: alertData.confidence || 50,
        affectedAssets: alertData.affectedAssets || [],
        indicators: alertData.indicators || [],
        description: alertData.description || '',
        recommendedActions: alertData.recommendedActions || [],
        status: alertData.status || 'new',
        assignedTo: alertData.assignedTo,
        acknowledgedAt: alertData.acknowledgedAt,
        resolvedAt: alertData.resolvedAt,
    };
};
exports.createAPTDetectionAlert = createAPTDetectionAlert;
/**
 * Prioritizes APT alerts based on severity and context.
 *
 * @param {APTDetectionAlert[]} alerts - Alerts to prioritize
 * @returns {APTDetectionAlert[]} Prioritized alerts
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAPTAlerts(alerts);
 * ```
 */
const prioritizeAPTAlerts = (alerts) => {
    const severityWeight = { critical: 100, high: 75, medium: 50, low: 25 };
    return [...alerts].sort((a, b) => {
        const aScore = severityWeight[a.severity] + a.confidence * 0.3;
        const bScore = severityWeight[b.severity] + b.confidence * 0.3;
        return bScore - aScore;
    });
};
exports.prioritizeAPTAlerts = prioritizeAPTAlerts;
/**
 * Correlates multiple alerts to identify campaign patterns.
 *
 * @param {APTDetectionAlert[]} alerts - Alerts to correlate
 * @returns {object} Correlation analysis
 *
 * @example
 * ```typescript
 * const correlation = correlateAlerts(alerts);
 * // Result: { relatedAlerts: [...], likelyCampaign: true }
 * ```
 */
const correlateAlerts = (alerts) => {
    const groups = [];
    const processed = new Set();
    alerts.forEach((alert) => {
        if (processed.has(alert.id))
            return;
        const related = alerts.filter(a => !processed.has(a.id) &&
            (a.aptGroupId === alert.aptGroupId ||
                a.campaignId === alert.campaignId ||
                a.indicators.some(i => alert.indicators.includes(i))));
        if (related.length > 1) {
            groups.push(related);
            related.forEach(a => processed.add(a.id));
        }
    });
    const likelyCampaign = groups.some(g => g.length >= 3);
    const confidence = groups.length > 0
        ? Math.min(100, (groups.reduce((sum, g) => sum + g.length, 0) / alerts.length) * 100)
        : 0;
    return { relatedAlerts: groups, likelyCampaign, confidence };
};
exports.correlateAlerts = correlateAlerts;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateAPTGroupId = () => `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateCampaignId = () => `camp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generatePatternId = () => `patt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateInfrastructureId = () => `infra-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateReportId = () => `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateAlertId = () => `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateSharingId = () => `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateUUID = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const calculateTTPOverlap = (ttps1, ttps2) => {
    const set1 = new Set(ttps1);
    const set2 = new Set(ttps2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
};
const calculateIOCOverlap = (iocs1, iocs2) => {
    const all1 = [...iocs1.ipAddresses, ...iocs1.domains, ...iocs1.fileHashes];
    const all2 = [...iocs2.ipAddresses, ...iocs2.domains, ...iocs2.fileHashes];
    const set1 = new Set(all1);
    const set2 = new Set(all2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
};
const calculateTargetOverlap = (targets1, targets2) => {
    const set1 = new Set(targets1);
    const set2 = new Set(targets2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
};
const matchesPattern = (log, signature, mitreIds) => {
    // Simplified pattern matching - production would use advanced correlation
    const logStr = JSON.stringify(log).toLowerCase();
    return logStr.includes(signature.toLowerCase()) ||
        mitreIds.some(id => logStr.includes(id.toLowerCase()));
};
const calculateDetectionConfidence = (patternConfidence, matchCount, falsePositiveRate) => {
    const matchScore = Math.min(matchCount * 10, 50);
    const fpPenalty = falsePositiveRate * 30;
    return Math.max(0, Math.min(100, patternConfidence + matchScore - fpPenalty));
};
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model definition for APTGroup.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'apt_groups', timestamps: true, paranoid: true })
 * export class APTGroupModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false, unique: true })
 *   @Index
 *   name: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   aliases: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('nation-state', 'criminal', 'hacktivist', 'unknown'),
 *     defaultValue: 'unknown'
 *   })
 *   type: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: { confidence: 0 } })
 *   attribution: { country?: string; sponsor?: string; confidence: number };
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
 *   @Column({
 *     type: DataType.ENUM('minimal', 'low', 'medium', 'high', 'advanced', 'expert'),
 *     defaultValue: 'medium'
 *   })
 *   sophistication: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: { sectors: [], regions: [], organizationTypes: [] } })
 *   targets: { sectors: string[]; regions: string[]; organizationTypes: string[] };
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: ['unknown'] })
 *   motivation: string[];
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => APTCampaignModel)
 *   campaigns: APTCampaignModel[];
 *
 *   @HasMany(() => APTBehaviorPatternModel)
 *   behaviorPatterns: APTBehaviorPatternModel[];
 *
 *   @HasMany(() => APTInfrastructureModel)
 *   infrastructure: APTInfrastructureModel[];
 *
 *   @BeforeValidate
 *   static validateConfidence(instance: APTGroupModel) {
 *     if (instance.attribution.confidence < 0 || instance.attribution.confidence > 100) {
 *       throw new Error('Attribution confidence must be between 0 and 100');
 *     }
 *   }
 *
 *   @BeforeUpdate
 *   static updateLastSeen(instance: APTGroupModel) {
 *     instance.lastSeen = new Date();
 *   }
 * }
 * ```
 */
const defineAPTGroupModel = () => 'APTGroupModel definition - see example above';
exports.defineAPTGroupModel = defineAPTGroupModel;
/**
 * Sequelize model definition for APTCampaign.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'apt_campaigns', timestamps: true, paranoid: true })
 * export class APTCampaignModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   @Index
 *   name: string;
 *
 *   @ForeignKey(() => APTGroupModel)
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   aptGroupId: string;
 *
 *   @BelongsTo(() => APTGroupModel)
 *   aptGroup: APTGroupModel;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   startDate: Date;
 *
 *   @Column(DataType.DATE)
 *   endDate: Date;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   active: boolean;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   objectives: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetedSectors: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   targetedRegions: string[];
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0 })
 *   affectedOrganizations: number;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   detectionConfidence: number;
 *
 *   @Column({
 *     type: DataType.ENUM('low', 'medium', 'high', 'critical'),
 *     defaultValue: 'medium'
 *   })
 *   severity: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   ttps: string[];
 *
 *   @Column({
 *     type: DataType.JSONB,
 *     defaultValue: { ipAddresses: [], domains: [], fileHashes: [], emailAddresses: [] }
 *   })
 *   iocs: { ipAddresses: string[]; domains: string[]; fileHashes: string[]; emailAddresses: string[] };
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0 })
 *   victimCount: number;
 *
 *   @Column(DataType.DECIMAL(15, 2))
 *   estimatedDamage: number;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @HasMany(() => DwellTimeAnalysisModel)
 *   dwellTimeAnalyses: DwellTimeAnalysisModel[];
 *
 *   @HasMany(() => APTAttributionModel)
 *   attributions: APTAttributionModel[];
 *
 *   @AfterCreate
 *   static async logCampaignCreation(instance: APTCampaignModel) {
 *     // Log to audit trail (HIPAA compliance)
 *     console.log(`APT Campaign created: ${instance.name} (${instance.id})`);
 *   }
 * }
 * ```
 */
const defineAPTCampaignModel = () => 'APTCampaignModel definition - see example above';
exports.defineAPTCampaignModel = defineAPTCampaignModel;
/**
 * Sequelize associations for APT tracking models.
 *
 * @example
 * ```typescript
 * // APT Group to Campaign (one-to-many)
 * APTGroupModel.hasMany(APTCampaignModel, { foreignKey: 'aptGroupId', as: 'campaigns' });
 * APTCampaignModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId', as: 'aptGroup' });
 *
 * // APT Group to Behavior Patterns (one-to-many)
 * APTGroupModel.hasMany(APTBehaviorPatternModel, { foreignKey: 'aptGroupId', as: 'behaviorPatterns' });
 * APTBehaviorPatternModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 *
 * // APT Group to Infrastructure (one-to-many)
 * APTGroupModel.hasMany(APTInfrastructureModel, { foreignKey: 'aptGroupId', as: 'infrastructure' });
 * APTInfrastructureModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 *
 * // Campaign to TTP Mappings (one-to-many)
 * APTCampaignModel.hasMany(APTTTPMappingModel, { foreignKey: 'campaignId', as: 'ttpMappings' });
 * APTTTPMappingModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // Campaign to Attributions (one-to-many)
 * APTCampaignModel.hasMany(APTAttributionModel, { foreignKey: 'campaignId', as: 'attributions' });
 * APTAttributionModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // Campaign to Dwell Time Analyses (one-to-many)
 * APTCampaignModel.hasMany(DwellTimeAnalysisModel, { foreignKey: 'campaignId', as: 'dwellTimeAnalyses' });
 * DwellTimeAnalysisModel.belongsTo(APTCampaignModel, { foreignKey: 'campaignId' });
 *
 * // APT Group to Detection Alerts (one-to-many)
 * APTGroupModel.hasMany(APTDetectionAlertModel, { foreignKey: 'aptGroupId', as: 'detectionAlerts' });
 * APTDetectionAlertModel.belongsTo(APTGroupModel, { foreignKey: 'aptGroupId' });
 * ```
 */
const defineAPTAssociations = () => 'APT Model Associations - see example above';
exports.defineAPTAssociations = defineAPTAssociations;
// ============================================================================
// NESTJS SERVICE PATTERNS
// ============================================================================
/**
 * NestJS service for APT detection and tracking.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class APTDetectionService {
 *   constructor(
 *     @InjectModel(APTGroupModel) private aptGroupModel: typeof APTGroupModel,
 *     @InjectModel(APTCampaignModel) private campaignModel: typeof APTCampaignModel,
 *     @InjectModel(APTBehaviorPatternModel) private patternModel: typeof APTBehaviorPatternModel,
 *     private logger: Logger
 *   ) {}
 *
 *   async detectAPTActivity(activityLogs: any[]): Promise<APTDetectionAlert[]> {
 *     const knownPatterns = await this.patternModel.findAll();
 *     const detections = detectBehaviorPatterns(activityLogs, knownPatterns);
 *
 *     const alerts = await Promise.all(
 *       detections.map(d => this.createDetectionAlert(d))
 *     );
 *
 *     return prioritizeAPTAlerts(alerts);
 *   }
 *
 *   async trackCampaign(campaignId: string): Promise<APTCampaign> {
 *     const campaign = await this.campaignModel.findByPk(campaignId, {
 *       include: ['aptGroup', 'ttpMappings', 'attributions']
 *     });
 *
 *     if (!campaign) {
 *       throw new NotFoundException(`Campaign ${campaignId} not found`);
 *     }
 *
 *     return campaign;
 *   }
 *
 *   async analyzeDwellTime(campaignId: string, orgId: string): Promise<DwellTimeAnalysis> {
 *     // Retrieve incident timeline
 *     const timeline = await this.getIncidentTimeline(campaignId, orgId);
 *
 *     return analyzeDwellTime({
 *       campaignId,
 *       organizationId: orgId,
 *       initialCompromise: timeline.initialCompromise,
 *       detectionDate: timeline.detectionDate,
 *       attackPhases: timeline.phases
 *     });
 *   }
 *
 *   async generateIntelligenceReport(
 *     aptGroupId: string,
 *     reportType: 'tactical' | 'operational' | 'strategic'
 *   ): Promise<APTIntelligenceReport> {
 *     const aptGroup = await this.aptGroupModel.findByPk(aptGroupId, {
 *       include: ['campaigns', 'behaviorPatterns', 'infrastructure']
 *     });
 *
 *     const findings = this.analyzeAPTActivity(aptGroup);
 *     const recommendations = this.generateRecommendations(aptGroup, findings);
 *
 *     return generateAPTIntelligenceReport({
 *       reportType,
 *       aptGroupId,
 *       title: `${aptGroup.name} Intelligence Report`,
 *       findings,
 *       recommendations
 *     });
 *   }
 * }
 * ```
 */
const createAPTDetectionService = () => 'APTDetectionService template - see example above';
exports.createAPTDetectionService = createAPTDetectionService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Swagger API endpoint definitions for APT detection.
 *
 * @example
 * ```typescript
 * @ApiTags('APT Detection')
 * @Controller('apt')
 * export class APTController {
 *   @Post('detect')
 *   @ApiOperation({ summary: 'Detect APT activity in logs' })
 *   @ApiBody({ type: DetectAPTDto })
 *   @ApiResponse({ status: 200, description: 'Detection results', type: [APTDetectionAlertDto] })
 *   async detectActivity(@Body() dto: DetectAPTDto): Promise<APTDetectionAlertDto[]> {
 *     return this.aptService.detectAPTActivity(dto.activityLogs);
 *   }
 *
 *   @Get('groups/:id')
 *   @ApiOperation({ summary: 'Get APT group profile' })
 *   @ApiParam({ name: 'id', description: 'APT Group ID' })
 *   @ApiResponse({ status: 200, type: APTGroupDto })
 *   async getGroup(@Param('id') id: string): Promise<APTGroupDto> {
 *     return this.aptService.getAPTGroup(id);
 *   }
 *
 *   @Get('campaigns/:id/dwell-time')
 *   @ApiOperation({ summary: 'Analyze campaign dwell time' })
 *   @ApiResponse({ status: 200, type: DwellTimeAnalysisDto })
 *   async analyzeDwellTime(
 *     @Param('id') id: string,
 *     @Query('orgId') orgId: string
 *   ): Promise<DwellTimeAnalysisDto> {
 *     return this.aptService.analyzeDwellTime(id, orgId);
 *   }
 *
 *   @Post('campaigns/:id/attribute')
 *   @ApiOperation({ summary: 'Attribute campaign to APT group' })
 *   @ApiBody({ type: AttributeCampaignDto })
 *   @ApiResponse({ status: 201, type: APTAttributionDto })
 *   async attributeCampaign(
 *     @Param('id') id: string,
 *     @Body() dto: AttributeCampaignDto
 *   ): Promise<APTAttributionDto> {
 *     return this.aptService.createAttribution(id, dto);
 *   }
 *
 *   @Get('intelligence/report/:id')
 *   @ApiOperation({ summary: 'Generate APT intelligence report' })
 *   @ApiResponse({ status: 200, type: APTIntelligenceReportDto })
 *   async generateReport(@Param('id') id: string): Promise<APTIntelligenceReportDto> {
 *     return this.aptService.generateIntelligenceReport(id, 'operational');
 *   }
 * }
 * ```
 */
const defineAPTAPI = () => 'APT Controller API - see example above';
exports.defineAPTAPI = defineAPTAPI;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // APT Group Management
    createAPTGroup: exports.createAPTGroup,
    validateAPTGroup: exports.validateAPTGroup,
    updateAPTGroupActivity: exports.updateAPTGroupActivity,
    mergeAPTGroups: exports.mergeAPTGroups,
    // Campaign Tracking
    createAPTCampaign: exports.createAPTCampaign,
    trackCampaignProgression: exports.trackCampaignProgression,
    identifyRelatedCampaigns: exports.identifyRelatedCampaigns,
    calculateCampaignImpact: exports.calculateCampaignImpact,
    // Behavior Pattern Detection
    registerBehaviorPattern: exports.registerBehaviorPattern,
    detectBehaviorPatterns: exports.detectBehaviorPatterns,
    updatePatternObservations: exports.updatePatternObservations,
    analyzePatternEvolution: exports.analyzePatternEvolution,
    // Infrastructure Tracking
    trackAPTInfrastructure: exports.trackAPTInfrastructure,
    findInfrastructureOverlaps: exports.findInfrastructureOverlaps,
    monitorInfrastructureLifecycle: exports.monitorInfrastructureLifecycle,
    correlateInfrastructureWithMalware: exports.correlateInfrastructureWithMalware,
    // Dwell Time Analysis
    analyzeDwellTime: exports.analyzeDwellTime,
    calculateDwellTimeStatistics: exports.calculateDwellTimeStatistics,
    identifyDwellTimeFactors: exports.identifyDwellTimeFactors,
    // TTP Mapping
    mapAPTTTPToMITRE: exports.mapAPTTTPToMITRE,
    analyzeTTPCoverage: exports.analyzeTTPCoverage,
    generateTTPDetectionRules: exports.generateTTPDetectionRules,
    // Attribution
    createAPTAttribution: exports.createAPTAttribution,
    calculateAttributionConfidence: exports.calculateAttributionConfidence,
    validateAttributionEvidence: exports.validateAttributionEvidence,
    rankAttributionsByConfidence: exports.rankAttributionsByConfidence,
    // Intelligence Sharing
    generateSTIXIntelligence: exports.generateSTIXIntelligence,
    generateTAXIIFeed: exports.generateTAXIIFeed,
    validateSharingCompliance: exports.validateSharingCompliance,
    // Reporting
    generateAPTIntelligenceReport: exports.generateAPTIntelligenceReport,
    generateExecutiveSummary: exports.generateExecutiveSummary,
    exportReport: exports.exportReport,
    // Detection & Alerting
    createAPTDetectionAlert: exports.createAPTDetectionAlert,
    prioritizeAPTAlerts: exports.prioritizeAPTAlerts,
    correlateAlerts: exports.correlateAlerts,
    // Model Definitions
    defineAPTGroupModel: exports.defineAPTGroupModel,
    defineAPTCampaignModel: exports.defineAPTCampaignModel,
    defineAPTAssociations: exports.defineAPTAssociations,
    // Service Patterns
    createAPTDetectionService: exports.createAPTDetectionService,
    // API Documentation
    defineAPTAPI: exports.defineAPTAPI,
};
//# sourceMappingURL=apt-detection-tracking-kit.js.map