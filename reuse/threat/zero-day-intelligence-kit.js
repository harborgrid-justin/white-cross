"use strict";
/**
 * LOC: ZDIN1234567
 * File: /reuse/threat/zero-day-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Vulnerability management systems
 *   - Emergency response controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineZeroDayAPI = exports.createZeroDayIntelligenceService = exports.defineZeroDayAssociations = exports.defineZeroDayVulnerabilityModel = exports.generateZeroDayIntelligenceReport = exports.generateEmergencyResponseReport = exports.updateEmergencyResponse = exports.initiateEmergencyResponse = exports.calculateLifecycleMetrics = exports.trackVulnerabilityLifecycle = exports.analyzeActorZeroDayPatterns = exports.attributeZeroDayToActor = exports.profileZeroDayThreatActor = exports.trainPredictionModel = exports.updatePredictionAccuracy = exports.predictExploitLikelihood = exports.updatePatchDeploymentProgress = exports.validatePatchCompatibility = exports.monitorVendorPatchTimeline = exports.trackPatchAvailability = exports.generateRemediationStrategy = exports.rankVulnerabilitiesByPriority = exports.calculateVulnerabilityPriority = exports.monitorExploitAvailability = exports.correlateExploitWithActors = exports.analyzeExploitSophistication = exports.trackExploitIntelligence = exports.calculateDisclosureTimeline = exports.identifyDuplicateZeroDays = exports.validateZeroDayData = exports.updateZeroDayStatus = exports.registerZeroDayDiscovery = void 0;
// ============================================================================
// ZERO-DAY DISCOVERY & TRACKING
// ============================================================================
/**
 * Registers a newly discovered zero-day vulnerability.
 *
 * @param {Partial<ZeroDayVulnerability>} vulnData - Vulnerability data
 * @returns {ZeroDayVulnerability} Registered zero-day
 *
 * @example
 * ```typescript
 * const zeroDay = registerZeroDayDiscovery({
 *   discoveryMethod: 'internal',
 *   discoveredBy: 'security-team',
 *   affectedProducts: [{ vendor: 'Microsoft', product: 'Exchange', versions: ['2019', '2016'] }],
 *   severity: 'critical',
 *   exploitationStatus: 'in-the-wild'
 * });
 * ```
 */
const registerZeroDayDiscovery = (vulnData) => {
    if (!vulnData.discoveryMethod || !vulnData.affectedProducts) {
        throw new Error('Discovery method and affected products are required');
    }
    return {
        id: vulnData.id || generateZeroDayId(),
        internalId: vulnData.internalId || generateInternalId(),
        cveId: vulnData.cveId,
        discoveryDate: vulnData.discoveryDate || new Date(),
        discoveryMethod: vulnData.discoveryMethod,
        discoveredBy: vulnData.discoveredBy || 'unknown',
        vendorNotificationDate: vulnData.vendorNotificationDate,
        publicDisclosureDate: vulnData.publicDisclosureDate,
        cveAssignmentDate: vulnData.cveAssignmentDate,
        status: vulnData.status || 'discovered',
        affectedProducts: vulnData.affectedProducts,
        severity: vulnData.severity || 'high',
        cvssScore: vulnData.cvssScore,
        cvssVector: vulnData.cvssVector,
        exploitationStatus: vulnData.exploitationStatus || 'theoretical',
        exploitComplexity: vulnData.exploitComplexity || 'medium',
        attackVector: vulnData.attackVector || 'network',
        privilegesRequired: vulnData.privilegesRequired || 'low',
        userInteraction: vulnData.userInteraction || 'none',
        impactType: vulnData.impactType || ['confidentiality', 'integrity', 'availability'],
        description: vulnData.description || '',
        technicalDetails: vulnData.technicalDetails,
        proofOfConcept: vulnData.proofOfConcept,
        mitigations: vulnData.mitigations || [],
        workarounds: vulnData.workarounds || [],
        metadata: vulnData.metadata || {},
    };
};
exports.registerZeroDayDiscovery = registerZeroDayDiscovery;
/**
 * Updates zero-day status as it progresses through lifecycle.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to update
 * @param {object} update - Update data
 * @returns {ZeroDayVulnerability} Updated zero-day
 *
 * @example
 * ```typescript
 * const updated = updateZeroDayStatus(zeroDay, {
 *   status: 'patch-available',
 *   cveId: 'CVE-2024-12345',
 *   cveAssignmentDate: new Date()
 * });
 * ```
 */
const updateZeroDayStatus = (zeroDay, update) => {
    return {
        ...zeroDay,
        status: update.status || zeroDay.status,
        cveId: update.cveId || zeroDay.cveId,
        cveAssignmentDate: update.cveAssignmentDate || zeroDay.cveAssignmentDate,
        vendorNotificationDate: update.vendorNotificationDate || zeroDay.vendorNotificationDate,
        publicDisclosureDate: update.publicDisclosureDate || zeroDay.publicDisclosureDate,
        exploitationStatus: update.exploitationStatus || zeroDay.exploitationStatus,
    };
};
exports.updateZeroDayStatus = updateZeroDayStatus;
/**
 * Validates zero-day vulnerability data completeness.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateZeroDayData(zeroDay);
 * // Result: { valid: true, warnings: [], errors: [] }
 * ```
 */
const validateZeroDayData = (zeroDay) => {
    const errors = [];
    const warnings = [];
    if (!zeroDay.id || !zeroDay.internalId) {
        errors.push('Missing required identifiers');
    }
    if (zeroDay.affectedProducts.length === 0) {
        errors.push('No affected products specified');
    }
    if (!zeroDay.description || zeroDay.description.trim().length < 20) {
        warnings.push('Description is too brief or missing');
    }
    if (zeroDay.severity === 'critical' && !zeroDay.cvssScore) {
        warnings.push('Critical severity should have CVSS score');
    }
    if (zeroDay.exploitationStatus === 'in-the-wild' && zeroDay.mitigations.length === 0) {
        warnings.push('Active exploitation detected but no mitigations provided');
    }
    if (zeroDay.vendorNotificationDate && zeroDay.vendorNotificationDate > new Date()) {
        errors.push('Vendor notification date cannot be in the future');
    }
    return {
        valid: errors.length === 0,
        warnings,
        errors,
    };
};
exports.validateZeroDayData = validateZeroDayData;
/**
 * Identifies duplicate or related zero-day vulnerabilities.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to check
 * @param {ZeroDayVulnerability[]} existing - Existing zero-days
 * @returns {object} Duplicate detection result
 *
 * @example
 * ```typescript
 * const duplicates = identifyDuplicateZeroDays(newZeroDay, existingZeroDays);
 * // Result: { isDuplicate: false, similar: [...], confidence: 0.85 }
 * ```
 */
const identifyDuplicateZeroDays = (zeroDay, existing) => {
    const similar = [];
    existing.forEach((existingVuln) => {
        let similarity = 0;
        // Check for same CVE
        if (zeroDay.cveId && existingVuln.cveId === zeroDay.cveId) {
            return { isDuplicate: true, similar: [existingVuln], confidence: 1.0 };
        }
        // Check affected products overlap
        const productOverlap = calculateProductOverlap(zeroDay.affectedProducts, existingVuln.affectedProducts);
        similarity += productOverlap * 0.4;
        // Check description similarity (simplified)
        const descSimilarity = calculateDescriptionSimilarity(zeroDay.description, existingVuln.description);
        similarity += descSimilarity * 0.3;
        // Check temporal proximity
        const daysDiff = Math.abs((zeroDay.discoveryDate.getTime() - existingVuln.discoveryDate.getTime()) / (1000 * 60 * 60 * 24));
        const temporalSimilarity = daysDiff < 30 ? 1 - (daysDiff / 30) : 0;
        similarity += temporalSimilarity * 0.3;
        if (similarity > 0.5) {
            similar.push({ vuln: existingVuln, similarity });
        }
    });
    similar.sort((a, b) => b.similarity - a.similarity);
    const isDuplicate = similar.length > 0 && similar[0].similarity > 0.8;
    const confidence = similar.length > 0 ? similar[0].similarity : 0;
    return {
        isDuplicate,
        similar: similar.map(s => s.vuln),
        confidence,
    };
};
exports.identifyDuplicateZeroDays = identifyDuplicateZeroDays;
/**
 * Calculates time-to-disclosure for zero-day.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @returns {object} Disclosure timeline analysis
 *
 * @example
 * ```typescript
 * const timeline = calculateDisclosureTimeline(zeroDay);
 * // Result: { daysToVendor: 7, daysToPublic: 45, disclosureType: 'coordinated' }
 * ```
 */
const calculateDisclosureTimeline = (zeroDay) => {
    const daysToVendor = zeroDay.vendorNotificationDate
        ? Math.floor((zeroDay.vendorNotificationDate.getTime() - zeroDay.discoveryDate.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
    const daysToPublic = zeroDay.publicDisclosureDate
        ? Math.floor((zeroDay.publicDisclosureDate.getTime() - zeroDay.discoveryDate.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
    const daysToExploit = zeroDay.exploitationStatus === 'in-the-wild'
        ? Math.floor((new Date().getTime() - zeroDay.discoveryDate.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
    let disclosureType;
    let isResponsible = false;
    if (!zeroDay.publicDisclosureDate) {
        disclosureType = 'zero-day';
    }
    else if (daysToVendor && daysToVendor < 7 && daysToPublic && daysToPublic > 90) {
        disclosureType = 'responsible';
        isResponsible = true;
    }
    else if (daysToPublic && daysToPublic > 30) {
        disclosureType = 'coordinated';
        isResponsible = true;
    }
    else {
        disclosureType = 'full';
    }
    return {
        daysToVendor,
        daysToPublic,
        daysToExploit,
        disclosureType,
        isResponsible,
    };
};
exports.calculateDisclosureTimeline = calculateDisclosureTimeline;
// ============================================================================
// EXPLOIT INTELLIGENCE GATHERING
// ============================================================================
/**
 * Tracks exploit intelligence for zero-day.
 *
 * @param {Partial<ExploitIntelligence>} exploitData - Exploit intelligence data
 * @returns {ExploitIntelligence} Tracked exploit intelligence
 *
 * @example
 * ```typescript
 * const exploit = trackExploitIntelligence({
 *   zeroDayId: 'zd-123',
 *   exploitType: 'remote',
 *   exploitReliability: 'high',
 *   exploitAvailability: 'public'
 * });
 * ```
 */
const trackExploitIntelligence = (exploitData) => {
    if (!exploitData.zeroDayId) {
        throw new Error('Zero-day ID is required');
    }
    return {
        id: exploitData.id || generateExploitId(),
        zeroDayId: exploitData.zeroDayId,
        cveId: exploitData.cveId,
        exploitType: exploitData.exploitType || 'remote',
        exploitTechnique: exploitData.exploitTechnique || [],
        exploitReliability: exploitData.exploitReliability || 'medium',
        exploitAvailability: exploitData.exploitAvailability || 'private',
        exploitSources: exploitData.exploitSources || [],
        exploitCode: exploitData.exploitCode,
        exploitHash: exploitData.exploitHash,
        weaponized: exploitData.weaponized || false,
        exploitKits: exploitData.exploitKits || [],
        observedInWild: exploitData.observedInWild || false,
        firstObservedDate: exploitData.firstObservedDate,
        lastObservedDate: exploitData.lastObservedDate,
        targetedSectors: exploitData.targetedSectors || [],
        targetedRegions: exploitData.targetedRegions || [],
        associatedThreatActors: exploitData.associatedThreatActors || [],
        associatedCampaigns: exploitData.associatedCampaigns || [],
        iocs: exploitData.iocs || { ipAddresses: [], domains: [], fileHashes: [], urls: [] },
    };
};
exports.trackExploitIntelligence = trackExploitIntelligence;
/**
 * Analyzes exploit sophistication and weaponization.
 *
 * @param {ExploitIntelligence} exploit - Exploit to analyze
 * @returns {object} Sophistication analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeExploitSophistication(exploit);
 * // Result: { sophistication: 'high', weaponizationPotential: 0.85, factors: [...] }
 * ```
 */
const analyzeExploitSophistication = (exploit) => {
    const factors = [];
    let score = 0;
    // Reliability factor
    if (exploit.exploitReliability === 'high') {
        score += 30;
        factors.push('High reliability exploit');
    }
    else if (exploit.exploitReliability === 'medium') {
        score += 15;
    }
    // Complexity factor
    if (exploit.exploitType === 'remote') {
        score += 25;
        factors.push('Remote exploitation capability');
    }
    // Weaponization factor
    if (exploit.weaponized) {
        score += 25;
        factors.push('Already weaponized');
    }
    // Observed in wild
    if (exploit.observedInWild) {
        score += 20;
        factors.push('Active exploitation observed');
    }
    // Exploit kit integration
    if (exploit.exploitKits.length > 0) {
        score += 15;
        factors.push(`Integrated into ${exploit.exploitKits.length} exploit kit(s)`);
    }
    let sophistication;
    if (score >= 80)
        sophistication = 'advanced';
    else if (score >= 60)
        sophistication = 'high';
    else if (score >= 40)
        sophistication = 'medium';
    else
        sophistication = 'low';
    return {
        sophistication,
        weaponizationPotential: Math.min(score / 100, 1),
        factors,
    };
};
exports.analyzeExploitSophistication = analyzeExploitSophistication;
/**
 * Correlates exploit with threat actor activity.
 *
 * @param {ExploitIntelligence} exploit - Exploit intelligence
 * @param {ZeroDayThreatActor[]} threatActors - Known threat actors
 * @returns {object} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = correlateExploitWithActors(exploit, threatActors);
 * ```
 */
const correlateExploitWithActors = (exploit, threatActors) => {
    const likelyActors = threatActors.filter(actor => actor.zeroDaysExploited.includes(exploit.zeroDayId) ||
        exploit.associatedThreatActors.includes(actor.id) ||
        actor.preferredTargets.some(t => exploit.targetedSectors.includes(t)));
    const confidence = likelyActors.length > 0
        ? Math.min(100, likelyActors.length * 30) / 100
        : 0;
    return { likelyActors, confidence };
};
exports.correlateExploitWithActors = correlateExploitWithActors;
/**
 * Monitors exploit code availability across sources.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {string[]} sources - Sources to monitor
 * @returns {Promise<object>} Monitoring results
 *
 * @example
 * ```typescript
 * const results = await monitorExploitAvailability('zd-123', ['github', 'exploit-db']);
 * ```
 */
const monitorExploitAvailability = async (zeroDayId, sources) => {
    // Mock implementation - production would integrate with actual monitoring
    const results = sources.map(source => ({
        source,
        found: Math.random() > 0.7,
        url: Math.random() > 0.7 ? `https://${source}/exploit/${zeroDayId}` : undefined,
    }));
    return {
        found: results.some(r => r.found),
        sources: results,
    };
};
exports.monitorExploitAvailability = monitorExploitAvailability;
// ============================================================================
// VULNERABILITY PRIORITIZATION
// ============================================================================
/**
 * Calculates vulnerability priority score.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {object} context - Organizational context
 * @returns {VulnerabilityPriority} Priority assessment
 *
 * @example
 * ```typescript
 * const priority = calculateVulnerabilityPriority(zeroDay, {
 *   affectedAssets: 150,
 *   criticalAssets: 25,
 *   businessImpact: 'high'
 * });
 * ```
 */
const calculateVulnerabilityPriority = (zeroDay, context) => {
    const severityScore = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25,
    }[zeroDay.severity];
    const exploitabilityScore = {
        'in-the-wild': 100,
        'mass-exploitation': 100,
        'poc-available': 70,
        'theoretical': 30,
    }[zeroDay.exploitationStatus];
    const assetExposureScore = Math.min(100, (context.affectedAssets / 500) * 100);
    const criticalAssetScore = Math.min(100, (context.criticalAssets / 50) * 100);
    const businessImpactScore = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25,
    }[context.businessImpact];
    const threatIntelScore = zeroDay.exploitationStatus === 'in-the-wild' ? 100 : 50;
    const priorityScore = Math.round(severityScore * 0.25 +
        exploitabilityScore * 0.25 +
        assetExposureScore * 0.15 +
        criticalAssetScore * 0.15 +
        businessImpactScore * 0.1 +
        threatIntelScore * 0.1);
    let priorityLevel;
    if (priorityScore >= 85)
        priorityLevel = 'critical';
    else if (priorityScore >= 70)
        priorityLevel = 'high';
    else if (priorityScore >= 50)
        priorityLevel = 'medium';
    else
        priorityLevel = 'low';
    const remediationDeadline = new Date();
    if (priorityLevel === 'critical')
        remediationDeadline.setHours(remediationDeadline.getHours() + 24);
    else if (priorityLevel === 'high')
        remediationDeadline.setDate(remediationDeadline.getDate() + 7);
    else if (priorityLevel === 'medium')
        remediationDeadline.setDate(remediationDeadline.getDate() + 30);
    else
        remediationDeadline.setDate(remediationDeadline.getDate() + 90);
    return {
        zeroDayId: zeroDay.id,
        cveId: zeroDay.cveId,
        priorityScore,
        priorityLevel,
        factors: {
            severity: severityScore,
            exploitability: exploitabilityScore,
            assetExposure: assetExposureScore,
            businessImpact: businessImpactScore,
            threatIntelligence: threatIntelScore,
        },
        affectedAssets: context.affectedAssets,
        criticalAssets: context.criticalAssets,
        estimatedRisk: priorityScore,
        remediationDeadline,
        justification: `Priority: ${priorityLevel.toUpperCase()} - ${generateJustification(priorityLevel, zeroDay)}`,
        calculatedAt: new Date(),
    };
};
exports.calculateVulnerabilityPriority = calculateVulnerabilityPriority;
/**
 * Ranks multiple vulnerabilities by priority.
 *
 * @param {VulnerabilityPriority[]} priorities - Vulnerability priorities
 * @returns {VulnerabilityPriority[]} Ranked priorities
 *
 * @example
 * ```typescript
 * const ranked = rankVulnerabilitiesByPriority(priorities);
 * ```
 */
const rankVulnerabilitiesByPriority = (priorities) => {
    return [...priorities].sort((a, b) => {
        // Sort by priority level first, then by score
        const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const levelDiff = levelOrder[b.priorityLevel] - levelOrder[a.priorityLevel];
        if (levelDiff !== 0)
            return levelDiff;
        return b.priorityScore - a.priorityScore;
    });
};
exports.rankVulnerabilitiesByPriority = rankVulnerabilitiesByPriority;
/**
 * Generates remediation strategy based on priority.
 *
 * @param {VulnerabilityPriority} priority - Vulnerability priority
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @returns {object} Remediation strategy
 *
 * @example
 * ```typescript
 * const strategy = generateRemediationStrategy(priority, zeroDay);
 * ```
 */
const generateRemediationStrategy = (priority, zeroDay) => {
    let approach;
    let steps;
    let timeline;
    let resources = [];
    if (priority.priorityLevel === 'critical') {
        approach = 'Emergency Response';
        steps = [
            'Activate incident response team',
            'Isolate affected systems immediately',
            'Apply emergency workarounds',
            'Monitor for exploitation attempts',
            'Deploy patch/mitigation within 24 hours',
            'Validate remediation effectiveness',
        ];
        timeline = '24 hours';
        resources = ['IR team', 'Security engineers', 'System administrators', 'Executive approval'];
    }
    else if (priority.priorityLevel === 'high') {
        approach = 'Accelerated Patching';
        steps = [
            'Assess affected systems',
            'Test patch in staging environment',
            'Schedule emergency maintenance window',
            'Deploy patch to critical systems',
            'Monitor for issues',
            'Complete rollout within 7 days',
        ];
        timeline = '7 days';
        resources = ['Security team', 'System administrators', 'Change management'];
    }
    else if (priority.priorityLevel === 'medium') {
        approach = 'Standard Patch Cycle';
        steps = [
            'Add to patch management queue',
            'Conduct thorough testing',
            'Schedule in next maintenance window',
            'Deploy in phases',
            'Monitor and validate',
        ];
        timeline = '30 days';
        resources = ['Patch management team', 'QA team'];
    }
    else {
        approach = 'Routine Remediation';
        steps = [
            'Include in regular patch cycle',
            'Test with other updates',
            'Deploy in standard window',
        ];
        timeline = '90 days';
        resources = ['Standard patch team'];
    }
    return { approach, steps, timeline, resources };
};
exports.generateRemediationStrategy = generateRemediationStrategy;
// ============================================================================
// PATCH AVAILABILITY MONITORING
// ============================================================================
/**
 * Tracks patch availability for zero-day.
 *
 * @param {Partial<PatchAvailability>} patchData - Patch data
 * @returns {PatchAvailability} Patch availability record
 *
 * @example
 * ```typescript
 * const patch = trackPatchAvailability({
 *   zeroDayId: 'zd-123',
 *   vendor: 'Microsoft',
 *   product: 'Exchange',
 *   patchStatus: 'stable'
 * });
 * ```
 */
const trackPatchAvailability = (patchData) => {
    if (!patchData.zeroDayId || !patchData.vendor || !patchData.product) {
        throw new Error('Zero-day ID, vendor, and product are required');
    }
    return {
        zeroDayId: patchData.zeroDayId,
        cveId: patchData.cveId,
        vendor: patchData.vendor,
        product: patchData.product,
        patchStatus: patchData.patchStatus || 'none',
        patchAvailableDate: patchData.patchAvailableDate,
        patchVersion: patchData.patchVersion,
        patchUrl: patchData.patchUrl,
        patchNotes: patchData.patchNotes,
        installationComplexity: patchData.installationComplexity || 'medium',
        requiresReboot: patchData.requiresReboot ?? false,
        requiresDowntime: patchData.requiresDowntime ?? false,
        estimatedDowntime: patchData.estimatedDowntime,
        compatibility: patchData.compatibility || { tested: false, issues: [], compatibleVersions: [] },
        deploymentPriority: patchData.deploymentPriority || 'urgent',
        deploymentStatus: patchData.deploymentStatus || 'planned',
        deploymentProgress: patchData.deploymentProgress || 0,
    };
};
exports.trackPatchAvailability = trackPatchAvailability;
/**
 * Monitors vendor patch release timeline.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {Date} notificationDate - Vendor notification date
 * @returns {object} Timeline analysis
 *
 * @example
 * ```typescript
 * const timeline = monitorVendorPatchTimeline('zd-123', notificationDate);
 * // Result: { daysElapsed: 45, expectedPatch: Date, status: 'delayed' }
 * ```
 */
const monitorVendorPatchTimeline = (zeroDayId, notificationDate) => {
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24));
    // Industry standard: 90 days for patch release
    const expectedPatchDate = new Date(notificationDate);
    expectedPatchDate.setDate(expectedPatchDate.getDate() + 90);
    let status;
    if (daysElapsed <= 60)
        status = 'on-track';
    else if (daysElapsed <= 90)
        status = 'delayed';
    else
        status = 'overdue';
    return { daysElapsed, expectedPatchDate, status };
};
exports.monitorVendorPatchTimeline = monitorVendorPatchTimeline;
/**
 * Validates patch compatibility with environment.
 *
 * @param {PatchAvailability} patch - Patch to validate
 * @param {object} environment - Environment configuration
 * @returns {object} Compatibility assessment
 *
 * @example
 * ```typescript
 * const compat = validatePatchCompatibility(patch, { version: '2019', platform: 'windows' });
 * ```
 */
const validatePatchCompatibility = (patch, environment) => {
    const issues = [];
    const recommendations = [];
    if (!patch.compatibility.tested) {
        issues.push('Patch has not been tested in similar environments');
        recommendations.push('Conduct testing in staging environment before deployment');
    }
    if (patch.compatibility.issues.length > 0) {
        issues.push(...patch.compatibility.issues);
        recommendations.push('Review known issues and assess impact');
    }
    if (!patch.compatibility.compatibleVersions.includes(environment.version)) {
        issues.push(`Version ${environment.version} may not be compatible`);
        recommendations.push('Verify compatibility with vendor documentation');
    }
    if (patch.requiresDowntime && environment.customizations) {
        recommendations.push('Plan for extended downtime due to customizations');
    }
    return {
        compatible: issues.length === 0 || !issues.some(i => i.includes('not compatible')),
        issues,
        recommendations,
    };
};
exports.validatePatchCompatibility = validatePatchCompatibility;
/**
 * Tracks patch deployment progress.
 *
 * @param {PatchAvailability} patch - Patch record
 * @param {number} progress - Deployment progress (0-100)
 * @returns {PatchAvailability} Updated patch record
 *
 * @example
 * ```typescript
 * const updated = updatePatchDeploymentProgress(patch, 75);
 * ```
 */
const updatePatchDeploymentProgress = (patch, progress) => {
    let deploymentStatus = 'planned';
    if (progress === 0)
        deploymentStatus = 'planned';
    else if (progress < 25)
        deploymentStatus = 'testing';
    else if (progress < 100)
        deploymentStatus = 'deploying';
    else
        deploymentStatus = 'deployed';
    return {
        ...patch,
        deploymentProgress: Math.min(100, Math.max(0, progress)),
        deploymentStatus,
    };
};
exports.updatePatchDeploymentProgress = updatePatchDeploymentProgress;
// ============================================================================
// EXPLOIT PREDICTION MODELS
// ============================================================================
/**
 * Predicts exploit likelihood using ML-like features.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day to predict
 * @param {Partial<ExploitPredictionModel['features']>} features - Feature set
 * @returns {ExploitPredictionModel} Prediction model
 *
 * @example
 * ```typescript
 * const prediction = predictExploitLikelihood(zeroDay, {
 *   cvssScore: 9.8,
 *   publicDisclosure: false,
 *   patchAvailable: false,
 *   productPopularity: 0.95
 * });
 * ```
 */
const predictExploitLikelihood = (zeroDay, features) => {
    const featureSet = {
        cvssScore: features.cvssScore || zeroDay.cvssScore || 5.0,
        attackComplexity: features.attackComplexity || (zeroDay.exploitComplexity === 'low' ? 1.0 : 0.5),
        publicDisclosure: features.publicDisclosure ?? (!!zeroDay.publicDisclosureDate),
        patchAvailable: features.patchAvailable ?? (zeroDay.status === 'patch-available'),
        productPopularity: features.productPopularity || 0.5,
        historicalExploitRate: features.historicalExploitRate || 0.3,
        darkWebChatter: features.darkWebChatter || 0.0,
        securityResearchInterest: features.securityResearchInterest || 0.2,
    };
    // Weighted probability calculation
    const exploitProbability = Math.min((featureSet.cvssScore / 10) * 0.25 +
        featureSet.attackComplexity * 0.2 +
        (featureSet.publicDisclosure ? 0.15 : 0.05) +
        (!featureSet.patchAvailable ? 0.2 : 0.05) +
        featureSet.productPopularity * 0.15 +
        featureSet.darkWebChatter * 0.1 +
        featureSet.securityResearchInterest * 0.05, 1.0);
    // Time to exploit estimation (days)
    const baseTime = 30;
    const complexityFactor = zeroDay.exploitComplexity === 'low' ? 0.5 : zeroDay.exploitComplexity === 'high' ? 1.5 : 1.0;
    const disclosureFactor = featureSet.publicDisclosure ? 0.6 : 1.2;
    const timeToExploit = Math.round(baseTime * complexityFactor * disclosureFactor * (1 - exploitProbability));
    const riskFactors = [
        { factor: 'CVSS Score', weight: 0.25, contribution: (featureSet.cvssScore / 10) * 0.25 },
        { factor: 'Attack Complexity', weight: 0.2, contribution: featureSet.attackComplexity * 0.2 },
        { factor: 'Product Popularity', weight: 0.15, contribution: featureSet.productPopularity * 0.15 },
        { factor: 'Dark Web Activity', weight: 0.1, contribution: featureSet.darkWebChatter * 0.1 },
    ];
    const mitigatingFactors = [];
    if (featureSet.patchAvailable) {
        mitigatingFactors.push({ factor: 'Patch Available', weight: 0.15 });
    }
    if (!featureSet.publicDisclosure) {
        mitigatingFactors.push({ factor: 'No Public Disclosure', weight: 0.1 });
    }
    return {
        zeroDayId: zeroDay.id,
        cveId: zeroDay.cveId,
        predictionDate: new Date(),
        exploitProbability: Math.round(exploitProbability * 100) / 100,
        timeToExploit,
        confidence: 75,
        features: featureSet,
        riskFactors,
        mitigatingFactors,
        predictedExploitDate: new Date(Date.now() + timeToExploit * 24 * 60 * 60 * 1000),
    };
};
exports.predictExploitLikelihood = predictExploitLikelihood;
/**
 * Updates prediction with actual exploitation data.
 *
 * @param {ExploitPredictionModel} prediction - Original prediction
 * @param {Date} actualExploitDate - Actual exploitation date
 * @returns {ExploitPredictionModel} Updated prediction with accuracy
 *
 * @example
 * ```typescript
 * const updated = updatePredictionAccuracy(prediction, new Date());
 * // Result includes predictionAccuracy field
 * ```
 */
const updatePredictionAccuracy = (prediction, actualExploitDate) => {
    const predictedDays = prediction.timeToExploit;
    const actualDays = Math.floor((actualExploitDate.getTime() - prediction.predictionDate.getTime()) / (1000 * 60 * 60 * 24));
    const error = Math.abs(predictedDays - actualDays);
    const accuracy = Math.max(0, 100 - (error / predictedDays) * 100);
    return {
        ...prediction,
        actualExploitDate,
        predictionAccuracy: Math.round(accuracy),
    };
};
exports.updatePredictionAccuracy = updatePredictionAccuracy;
/**
 * Trains prediction model with historical data.
 *
 * @param {ExploitPredictionModel[]} historicalPredictions - Historical predictions
 * @returns {object} Model performance metrics
 *
 * @example
 * ```typescript
 * const metrics = trainPredictionModel(historicalPredictions);
 * // Result: { accuracy: 0.82, precision: 0.85, recall: 0.78 }
 * ```
 */
const trainPredictionModel = (historicalPredictions) => {
    const withActual = historicalPredictions.filter(p => p.actualExploitDate && p.predictionAccuracy !== undefined);
    if (withActual.length === 0) {
        return { accuracy: 0, precision: 0, recall: 0, sampleSize: 0 };
    }
    const accuracy = withActual.reduce((sum, p) => sum + (p.predictionAccuracy || 0), 0) / withActual.length / 100;
    // Calculate precision (true positives / predicted positives)
    const predictedPositives = withActual.filter(p => p.exploitProbability > 0.5);
    const truePositives = predictedPositives.filter(p => p.actualExploitDate !== undefined);
    const precision = predictedPositives.length > 0 ? truePositives.length / predictedPositives.length : 0;
    // Calculate recall (true positives / actual positives)
    const actualPositives = withActual.filter(p => p.actualExploitDate !== undefined);
    const recall = actualPositives.length > 0 ? truePositives.length / actualPositives.length : 0;
    return {
        accuracy: Math.round(accuracy * 100) / 100,
        precision: Math.round(precision * 100) / 100,
        recall: Math.round(recall * 100) / 100,
        sampleSize: withActual.length,
    };
};
exports.trainPredictionModel = trainPredictionModel;
// ============================================================================
// ZERO-DAY THREAT ACTOR TRACKING
// ============================================================================
/**
 * Profiles threat actor specializing in zero-days.
 *
 * @param {Partial<ZeroDayThreatActor>} actorData - Threat actor data
 * @returns {ZeroDayThreatActor} Threat actor profile
 *
 * @example
 * ```typescript
 * const actor = profileZeroDayThreatActor({
 *   name: 'Equation Group',
 *   type: 'nation-state',
 *   sophistication: 'advanced',
 *   zeroDaysExploited: ['zd-123', 'zd-456']
 * });
 * ```
 */
const profileZeroDayThreatActor = (actorData) => {
    return {
        id: actorData.id || generateActorId(),
        name: actorData.name || 'Unknown Actor',
        aliases: actorData.aliases || [],
        type: actorData.type || 'unknown',
        sophistication: actorData.sophistication || 'medium',
        zeroDaysDiscovered: actorData.zeroDaysDiscovered || [],
        zeroDaysExploited: actorData.zeroDaysExploited || [],
        preferredTargets: actorData.preferredTargets || [],
        preferredVectors: actorData.preferredVectors || [],
        attribution: actorData.attribution || { confidence: 0, evidence: [] },
        firstSeen: actorData.firstSeen || new Date(),
        lastSeen: actorData.lastSeen || new Date(),
        active: actorData.active ?? true,
    };
};
exports.profileZeroDayThreatActor = profileZeroDayThreatActor;
/**
 * Links zero-day to threat actor based on TTPs.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {ZeroDayThreatActor[]} actors - Known actors
 * @returns {object} Attribution analysis
 *
 * @example
 * ```typescript
 * const attribution = attributeZeroDayToActor(zeroDay, knownActors);
 * ```
 */
const attributeZeroDayToActor = (zeroDay, actors) => {
    const evidence = [];
    const scored = actors.map((actor) => {
        let score = 0;
        if (actor.zeroDaysExploited.includes(zeroDay.id)) {
            score += 50;
            evidence.push(`${actor.name} previously exploited this zero-day`);
        }
        const targetMatch = zeroDay.affectedProducts.some(p => actor.preferredTargets.some(t => t.toLowerCase().includes(p.vendor.toLowerCase())));
        if (targetMatch) {
            score += 20;
            evidence.push(`Target profile matches ${actor.name}'s preferences`);
        }
        if (actor.sophistication === 'advanced' && zeroDay.exploitComplexity === 'high') {
            score += 15;
            evidence.push(`Sophistication level matches exploit complexity`);
        }
        return { actor, score };
    });
    const likelyActors = scored.filter(s => s.score > 20).map(s => s.actor);
    const maxScore = scored.length > 0 ? Math.max(...scored.map(s => s.score)) : 0;
    const confidence = Math.min(100, maxScore);
    return { likelyActors, confidence, evidence };
};
exports.attributeZeroDayToActor = attributeZeroDayToActor;
/**
 * Analyzes actor's zero-day exploitation patterns.
 *
 * @param {ZeroDayThreatActor} actor - Threat actor
 * @param {ZeroDayVulnerability[]} zeroDays - Zero-day vulnerabilities
 * @returns {object} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = analyzeActorZeroDayPatterns(actor, zeroDays);
 * ```
 */
const analyzeActorZeroDayPatterns = (actor, zeroDays) => {
    const actorZeroDays = zeroDays.filter(zd => actor.zeroDaysExploited.includes(zd.id));
    const vendors = actorZeroDays.flatMap(zd => zd.affectedProducts.map(p => p.vendor));
    const targetPreferences = [...new Set(vendors)];
    const vectors = actorZeroDays.map(zd => zd.attackVector);
    const vectorPreferences = [...new Set(vectors)];
    const patterns = [
        `Exploited ${actorZeroDays.length} zero-day vulnerabilities`,
        `Primary targets: ${targetPreferences.slice(0, 3).join(', ')}`,
        `Preferred attack vectors: ${vectorPreferences.join(', ')}`,
    ];
    const timeline = actorZeroDays.map(zd => ({
        id: zd.id,
        cveId: zd.cveId,
        discoveryDate: zd.discoveryDate,
        severity: zd.severity,
    }));
    return { patterns, targetPreferences, vectorPreferences, timeline };
};
exports.analyzeActorZeroDayPatterns = analyzeActorZeroDayPatterns;
// ============================================================================
// VULNERABILITY LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * Tracks zero-day through its lifecycle phases.
 *
 * @param {string} zeroDayId - Zero-day ID
 * @param {ZeroDayVulnerability} zeroDay - Zero-day data
 * @returns {VulnerabilityLifecycle} Lifecycle tracker
 *
 * @example
 * ```typescript
 * const lifecycle = trackVulnerabilityLifecycle('zd-123', zeroDay);
 * ```
 */
const trackVulnerabilityLifecycle = (zeroDayId, zeroDay) => {
    const phases = [
        {
            phase: 'discovery',
            startDate: zeroDay.discoveryDate,
            endDate: zeroDay.vendorNotificationDate,
            activities: [`Discovered by ${zeroDay.discoveredBy}`, `Discovery method: ${zeroDay.discoveryMethod}`],
        },
    ];
    if (zeroDay.vendorNotificationDate) {
        phases.push({
            phase: 'vendor-notification',
            startDate: zeroDay.vendorNotificationDate,
            endDate: zeroDay.status === 'patch-development' ? new Date() : undefined,
            activities: ['Vendor notified', 'Coordinated disclosure process initiated'],
        });
    }
    if (zeroDay.status === 'patch-available' || zeroDay.status === 'disclosed') {
        phases.push({
            phase: 'patch-development',
            startDate: zeroDay.vendorNotificationDate || zeroDay.discoveryDate,
            endDate: zeroDay.publicDisclosureDate,
            activities: ['Patch developed', 'Testing completed'],
        });
    }
    const currentPhase = phases[phases.length - 1].phase;
    const disclosureTimeline = !zeroDay.publicDisclosureDate ? 'zero-day' :
        zeroDay.vendorNotificationDate ? 'coordinated' :
            'full';
    return {
        zeroDayId,
        cveId: zeroDay.cveId,
        phases,
        currentPhase,
        disclosureTimeline,
        milestones: [],
    };
};
exports.trackVulnerabilityLifecycle = trackVulnerabilityLifecycle;
/**
 * Calculates lifecycle metrics (time-to-patch, etc.).
 *
 * @param {VulnerabilityLifecycle} lifecycle - Lifecycle data
 * @returns {object} Lifecycle metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateLifecycleMetrics(lifecycle);
 * ```
 */
const calculateLifecycleMetrics = (lifecycle) => {
    const phaseBreakdown = {};
    lifecycle.phases.forEach((phase) => {
        if (phase.endDate) {
            const duration = Math.floor((phase.endDate.getTime() - phase.startDate.getTime()) / (1000 * 60 * 60 * 24));
            phaseBreakdown[phase.phase] = duration;
        }
    });
    const vendorNotifPhase = lifecycle.phases.find(p => p.phase === 'vendor-notification');
    const vendorResponseTime = vendorNotifPhase?.endDate
        ? Math.floor((vendorNotifPhase.endDate.getTime() - vendorNotifPhase.startDate.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
    return {
        vendorResponseTime,
        timeToPatch: phaseBreakdown['patch-development'],
        totalDuration: lifecycle.totalDuration,
        phaseBreakdown,
    };
};
exports.calculateLifecycleMetrics = calculateLifecycleMetrics;
// ============================================================================
// EMERGENCY RESPONSE WORKFLOWS
// ============================================================================
/**
 * Initiates emergency response for zero-day.
 *
 * @param {Partial<EmergencyResponse>} responseData - Response data
 * @returns {EmergencyResponse} Emergency response record
 *
 * @example
 * ```typescript
 * const response = initiateEmergencyResponse({
 *   zeroDayId: 'zd-123',
 *   severity: 'critical',
 *   initiatedBy: 'security-team',
 *   affectedSystems: ['prod-server-01', 'prod-server-02']
 * });
 * ```
 */
const initiateEmergencyResponse = (responseData) => {
    if (!responseData.zeroDayId) {
        throw new Error('Zero-day ID is required');
    }
    const defaultActions = [
        { action: 'Assess impact and affected systems', priority: 'immediate', status: 'in-progress' },
        { action: 'Isolate critical affected systems', priority: 'immediate', status: 'pending' },
        { action: 'Implement workarounds/mitigations', priority: 'urgent', status: 'pending' },
        { action: 'Monitor for exploitation attempts', priority: 'urgent', status: 'pending' },
        { action: 'Coordinate with vendors', priority: 'high', status: 'pending' },
    ];
    return {
        id: responseData.id || generateResponseId(),
        zeroDayId: responseData.zeroDayId,
        cveId: responseData.cveId,
        severity: responseData.severity || 'high',
        initiatedAt: new Date(),
        initiatedBy: responseData.initiatedBy || 'system',
        status: 'active',
        responseTeam: responseData.responseTeam || [],
        actions: responseData.actions || defaultActions,
        affectedSystems: responseData.affectedSystems || [],
        isolatedSystems: responseData.isolatedSystems || [],
        containmentMeasures: responseData.containmentMeasures || [],
        communicationLog: responseData.communicationLog || [],
        estimatedImpact: responseData.estimatedImpact || {
            affectedUsers: 0,
            affectedSystems: 0,
            dataAtRisk: 'Unknown',
            businessImpact: 'Assessing',
        },
    };
};
exports.initiateEmergencyResponse = initiateEmergencyResponse;
/**
 * Updates emergency response status and actions.
 *
 * @param {EmergencyResponse} response - Emergency response
 * @param {object} update - Update data
 * @returns {EmergencyResponse} Updated response
 *
 * @example
 * ```typescript
 * const updated = updateEmergencyResponse(response, {
 *   status: 'contained',
 *   completedActions: ['Isolate critical systems'],
 *   newMeasures: ['Applied WAF rules']
 * });
 * ```
 */
const updateEmergencyResponse = (response, update) => {
    const updatedActions = response.actions.map((action) => {
        if (update.completedActions?.includes(action.action)) {
            return { ...action, status: 'completed', completedAt: new Date() };
        }
        return action;
    });
    return {
        ...response,
        status: update.status || response.status,
        actions: updatedActions,
        isolatedSystems: [...response.isolatedSystems, ...(update.isolatedSystems || [])],
        containmentMeasures: [...response.containmentMeasures, ...(update.newMeasures || [])],
    };
};
exports.updateEmergencyResponse = updateEmergencyResponse;
/**
 * Generates emergency response report.
 *
 * @param {EmergencyResponse} response - Emergency response
 * @returns {string} Response report
 *
 * @example
 * ```typescript
 * const report = generateEmergencyResponseReport(response);
 * ```
 */
const generateEmergencyResponseReport = (response) => {
    const duration = response.resolutionDate
        ? Math.floor((response.resolutionDate.getTime() - response.initiatedAt.getTime()) / (1000 * 60 * 60))
        : Math.floor((new Date().getTime() - response.initiatedAt.getTime()) / (1000 * 60 * 60));
    const completedActions = response.actions.filter(a => a.status === 'completed').length;
    const totalActions = response.actions.length;
    return `
EMERGENCY RESPONSE REPORT
=======================

Zero-Day ID: ${response.zeroDayId}
CVE ID: ${response.cveId || 'Pending'}
Severity: ${response.severity.toUpperCase()}
Status: ${response.status.toUpperCase()}

Timeline:
- Initiated: ${response.initiatedAt.toISOString()}
- Duration: ${duration} hours
- Status: ${response.status}

Impact Assessment:
- Affected Systems: ${response.affectedSystems.length}
- Isolated Systems: ${response.isolatedSystems.length}
- Affected Users: ${response.estimatedImpact.affectedUsers}
- Business Impact: ${response.estimatedImpact.businessImpact}

Response Actions:
- Total Actions: ${totalActions}
- Completed: ${completedActions}
- In Progress: ${response.actions.filter(a => a.status === 'in-progress').length}
- Pending: ${response.actions.filter(a => a.status === 'pending').length}

Containment Measures:
${response.containmentMeasures.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Response Team:
${response.responseTeam.join(', ')}

${response.lessonsLearned ? `\nLessons Learned:\n${response.lessonsLearned.map((l, i) => `${i + 1}. ${l}`).join('\n')}` : ''}
  `.trim();
};
exports.generateEmergencyResponseReport = generateEmergencyResponseReport;
// ============================================================================
// INTELLIGENCE REPORTING
// ============================================================================
/**
 * Generates comprehensive zero-day intelligence report.
 *
 * @param {ZeroDayVulnerability} zeroDay - Zero-day vulnerability
 * @param {ExploitIntelligence} [exploit] - Exploit intelligence
 * @returns {ZeroDayIntelligenceReport} Intelligence report
 *
 * @example
 * ```typescript
 * const report = generateZeroDayIntelligenceReport(zeroDay, exploit);
 * ```
 */
const generateZeroDayIntelligenceReport = (zeroDay, exploit) => {
    const reportType = zeroDay.exploitationStatus === 'in-the-wild' ? 'alert' :
        zeroDay.status === 'discovered' ? 'discovery' :
            'analysis';
    const threatLevel = zeroDay.severity;
    const confidence = zeroDay.exploitationStatus === 'in-the-wild' ? 95 : 70;
    return {
        id: generateReportId(),
        reportDate: new Date(),
        reportType,
        zeroDayId: zeroDay.id,
        cveId: zeroDay.cveId,
        title: `Zero-Day Intelligence: ${zeroDay.cveId || zeroDay.internalId}`,
        executiveSummary: generateExecutiveSummary(zeroDay, exploit),
        threatLevel,
        confidence,
        findings: [],
        technicalAnalysis: {
            vulnerability: zeroDay.description,
            exploitability: zeroDay.exploitComplexity,
            affectedComponents: zeroDay.affectedProducts.map(p => `${p.vendor} ${p.product}`),
            attackScenarios: [],
        },
        threatIntelligence: {
            observedExploitation: zeroDay.exploitationStatus === 'in-the-wild',
            threatActors: exploit?.associatedThreatActors || [],
            campaigns: exploit?.associatedCampaigns || [],
            indicators: Object.values(exploit?.iocs || {}).flat(),
        },
        recommendations: [],
        mitigations: zeroDay.mitigations.map(m => ({
            mitigation: m,
            effectiveness: 'medium',
            complexity: 'medium',
            implemented: false,
        })),
        references: [],
        classification: 'tlp-amber',
        distribution: [],
    };
};
exports.generateZeroDayIntelligenceReport = generateZeroDayIntelligenceReport;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateZeroDayId = () => `zd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateInternalId = () => `INTERNAL-${Date.now()}`;
const generateExploitId = () => `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateActorId = () => `actor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateResponseId = () => `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateReportId = () => `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const calculateProductOverlap = (products1, products2) => {
    const set1 = new Set(products1.map(p => `${p.vendor}:${p.product}`));
    const set2 = new Set(products2.map(p => `${p.vendor}:${p.product}`));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
};
const calculateDescriptionSimilarity = (desc1, desc2) => {
    // Simplified similarity - production would use advanced NLP
    const words1 = new Set(desc1.toLowerCase().split(/\s+/));
    const words2 = new Set(desc2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return union.size > 0 ? intersection.size / union.size : 0;
};
const generateJustification = (level, zeroDay) => {
    if (level === 'critical') {
        return `Active exploitation detected for ${zeroDay.severity} severity vulnerability. Immediate action required.`;
    }
    else if (level === 'high') {
        return `High severity vulnerability with significant exploit potential. Urgent remediation recommended.`;
    }
    else if (level === 'medium') {
        return `Moderate risk vulnerability. Standard remediation timeline applies.`;
    }
    return `Low risk vulnerability. Include in routine patch cycle.`;
};
const generateExecutiveSummary = (zeroDay, exploit) => {
    return `A ${zeroDay.severity} severity zero-day vulnerability has been identified affecting ${zeroDay.affectedProducts.map(p => p.vendor).join(', ')}. ` +
        `Exploitation status: ${zeroDay.exploitationStatus}. ` +
        (exploit?.observedInWild ? 'Active exploitation has been observed in the wild. ' : '') +
        `Immediate assessment and ${zeroDay.status === 'patch-available' ? 'patching' : 'mitigation'} recommended.`;
};
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model definition for ZeroDayVulnerability.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'zero_day_vulnerabilities', timestamps: true, paranoid: true })
 * export class ZeroDayVulnerabilityModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false, unique: true })
 *   @Index
 *   internalId: string;
 *
 *   @Column({ type: DataType.STRING, unique: true })
 *   @Index
 *   cveId: string;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   discoveryDate: Date;
 *
 *   @Column({
 *     type: DataType.ENUM('internal', 'external-researcher', 'threat-actor', 'vendor', 'exploit-in-wild'),
 *     allowNull: false
 *   })
 *   discoveryMethod: string;
 *
 *   @Column(DataType.STRING)
 *   discoveredBy: string;
 *
 *   @Column(DataType.DATE)
 *   vendorNotificationDate: Date;
 *
 *   @Column(DataType.DATE)
 *   publicDisclosureDate: Date;
 *
 *   @Column(DataType.DATE)
 *   cveAssignmentDate: Date;
 *
 *   @Column({
 *     type: DataType.ENUM('discovered', 'vendor-notified', 'patch-development', 'patch-available', 'disclosed', 'exploited'),
 *     defaultValue: 'discovered'
 *   })
 *   status: string;
 *
 *   @Column({ type: DataType.JSONB, allowNull: false })
 *   affectedProducts: any[];
 *
 *   @Column({
 *     type: DataType.ENUM('critical', 'high', 'medium', 'low'),
 *     defaultValue: 'high'
 *   })
 *   severity: string;
 *
 *   @Column({ type: DataType.DECIMAL(3, 1), validate: { min: 0, max: 10 } })
 *   cvssScore: number;
 *
 *   @Column(DataType.STRING)
 *   cvssVector: string;
 *
 *   @Column({
 *     type: DataType.ENUM('theoretical', 'poc-available', 'in-the-wild', 'mass-exploitation'),
 *     defaultValue: 'theoretical'
 *   })
 *   exploitationStatus: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column(DataType.TEXT)
 *   technicalDetails: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   mitigations: string[];
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   workarounds: string[];
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => ExploitIntelligenceModel)
 *   exploitIntelligence: ExploitIntelligenceModel[];
 *
 *   @HasMany(() => PatchAvailabilityModel)
 *   patchAvailability: PatchAvailabilityModel[];
 *
 *   @HasOne(() => ExploitPredictionModel)
 *   exploitPrediction: ExploitPredictionModel;
 *
 *   @BeforeCreate
 *   static async generateInternalId(instance: ZeroDayVulnerabilityModel) {
 *     if (!instance.internalId) {
 *       instance.internalId = `INTERNAL-${Date.now()}`;
 *     }
 *   }
 *
 *   @AfterCreate
 *   static async logDiscovery(instance: ZeroDayVulnerabilityModel) {
 *     console.log(`Zero-day vulnerability discovered: ${instance.internalId}`);
 *     // Trigger emergency response workflow for critical vulnerabilities
 *     if (instance.severity === 'critical' && instance.exploitationStatus === 'in-the-wild') {
 *       // Initiate emergency response
 *     }
 *   }
 *
 *   @BeforeUpdate
 *   static async validateStatusTransition(instance: ZeroDayVulnerabilityModel) {
 *     // Validate status transitions follow proper workflow
 *     const validTransitions = {
 *       'discovered': ['vendor-notified', 'disclosed', 'exploited'],
 *       'vendor-notified': ['patch-development', 'disclosed', 'exploited'],
 *       'patch-development': ['patch-available', 'disclosed', 'exploited'],
 *       'patch-available': ['disclosed', 'exploited'],
 *     };
 *
 *     if (instance.changed('status')) {
 *       const oldStatus = instance.previous('status');
 *       const newStatus = instance.status;
 *       if (!validTransitions[oldStatus]?.includes(newStatus)) {
 *         throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
 *       }
 *     }
 *   }
 * }
 * ```
 */
const defineZeroDayVulnerabilityModel = () => 'ZeroDayVulnerabilityModel definition - see example above';
exports.defineZeroDayVulnerabilityModel = defineZeroDayVulnerabilityModel;
/**
 * Sequelize associations for zero-day intelligence models.
 *
 * @example
 * ```typescript
 * // Zero-Day to Exploit Intelligence (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(ExploitIntelligenceModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitIntelligence'
 * });
 * ExploitIntelligenceModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Patch Availability (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(PatchAvailabilityModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'patchAvailability'
 * });
 * PatchAvailabilityModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Exploit Prediction (one-to-one)
 * ZeroDayVulnerabilityModel.hasOne(ExploitPredictionModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitPrediction'
 * });
 * ExploitPredictionModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Emergency Response (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(EmergencyResponseModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'emergencyResponses'
 * });
 * EmergencyResponseModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 *
 * // Zero-Day to Threat Actors (many-to-many)
 * ZeroDayVulnerabilityModel.belongsToMany(ZeroDayThreatActorModel, {
 *   through: 'ZeroDayActorExploitation',
 *   foreignKey: 'zeroDayId',
 *   as: 'exploitingActors'
 * });
 * ZeroDayThreatActorModel.belongsToMany(ZeroDayVulnerabilityModel, {
 *   through: 'ZeroDayActorExploitation',
 *   foreignKey: 'actorId',
 *   as: 'exploitedZeroDays'
 * });
 *
 * // Zero-Day to Intelligence Reports (one-to-many)
 * ZeroDayVulnerabilityModel.hasMany(ZeroDayIntelligenceReportModel, {
 *   foreignKey: 'zeroDayId',
 *   as: 'intelligenceReports'
 * });
 * ZeroDayIntelligenceReportModel.belongsTo(ZeroDayVulnerabilityModel, { foreignKey: 'zeroDayId' });
 * ```
 */
const defineZeroDayAssociations = () => 'Zero-Day Model Associations - see example above';
exports.defineZeroDayAssociations = defineZeroDayAssociations;
// ============================================================================
// NESTJS SERVICE PATTERNS
// ============================================================================
/**
 * NestJS service for zero-day intelligence management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ZeroDayIntelligenceService {
 *   constructor(
 *     @InjectModel(ZeroDayVulnerabilityModel) private zeroDayModel: typeof ZeroDayVulnerabilityModel,
 *     @InjectModel(ExploitIntelligenceModel) private exploitModel: typeof ExploitIntelligenceModel,
 *     @InjectModel(EmergencyResponseModel) private responseModel: typeof EmergencyResponseModel,
 *     private readonly logger: Logger
 *   ) {}
 *
 *   async registerZeroDay(dto: RegisterZeroDayDto): Promise<ZeroDayVulnerability> {
 *     const zeroDay = registerZeroDayDiscovery(dto);
 *     const validation = validateZeroDayData(zeroDay);
 *
 *     if (!validation.valid) {
 *       throw new BadRequestException(`Invalid zero-day data: ${validation.errors.join(', ')}`);
 *     }
 *
 *     const created = await this.zeroDayModel.create(zeroDay);
 *
 *     // Initiate emergency response for critical zero-days
 *     if (created.severity === 'critical' && created.exploitationStatus === 'in-the-wild') {
 *       await this.initiateEmergencyResponse(created.id);
 *     }
 *
 *     return created;
 *   }
 *
 *   async prioritizeZeroDay(zeroDayId: string, context: any): Promise<VulnerabilityPriority> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId);
 *     if (!zeroDay) {
 *       throw new NotFoundException(`Zero-day ${zeroDayId} not found`);
 *     }
 *
 *     return calculateVulnerabilityPriority(zeroDay, context);
 *   }
 *
 *   async predictExploit(zeroDayId: string): Promise<ExploitPredictionModel> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId);
 *     const features = await this.gatherPredictionFeatures(zeroDay);
 *     return predictExploitLikelihood(zeroDay, features);
 *   }
 *
 *   async trackPatchStatus(zeroDayId: string): Promise<PatchAvailability[]> {
 *     return this.patchModel.findAll({ where: { zeroDayId } });
 *   }
 *
 *   async generateIntelligenceReport(zeroDayId: string): Promise<ZeroDayIntelligenceReport> {
 *     const zeroDay = await this.zeroDayModel.findByPk(zeroDayId, {
 *       include: ['exploitIntelligence', 'patchAvailability']
 *     });
 *
 *     const exploit = zeroDay.exploitIntelligence?.[0];
 *     return generateZeroDayIntelligenceReport(zeroDay, exploit);
 *   }
 * }
 * ```
 */
const createZeroDayIntelligenceService = () => 'ZeroDayIntelligenceService template - see example above';
exports.createZeroDayIntelligenceService = createZeroDayIntelligenceService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Swagger API endpoint definitions for zero-day intelligence.
 *
 * @example
 * ```typescript
 * @ApiTags('Zero-Day Intelligence')
 * @Controller('zero-day')
 * export class ZeroDayController {
 *   @Post('register')
 *   @ApiOperation({ summary: 'Register new zero-day vulnerability' })
 *   @ApiBody({ type: RegisterZeroDayDto })
 *   @ApiResponse({ status: 201, description: 'Zero-day registered', type: ZeroDayDto })
 *   async register(@Body() dto: RegisterZeroDayDto): Promise<ZeroDayDto> {
 *     return this.zeroDayService.registerZeroDay(dto);
 *   }
 *
 *   @Get(':id/priority')
 *   @ApiOperation({ summary: 'Calculate vulnerability priority' })
 *   @ApiParam({ name: 'id', description: 'Zero-Day ID' })
 *   @ApiResponse({ status: 200, type: VulnerabilityPriorityDto })
 *   async getPriority(@Param('id') id: string, @Query() context: PriorityContextDto): Promise<VulnerabilityPriorityDto> {
 *     return this.zeroDayService.prioritizeZeroDay(id, context);
 *   }
 *
 *   @Get(':id/predict-exploit')
 *   @ApiOperation({ summary: 'Predict exploit likelihood' })
 *   @ApiResponse({ status: 200, type: ExploitPredictionDto })
 *   async predictExploit(@Param('id') id: string): Promise<ExploitPredictionDto> {
 *     return this.zeroDayService.predictExploit(id);
 *   }
 *
 *   @Post(':id/emergency-response')
 *   @ApiOperation({ summary: 'Initiate emergency response' })
 *   @ApiResponse({ status: 201, type: EmergencyResponseDto })
 *   async initiateResponse(@Param('id') id: string): Promise<EmergencyResponseDto> {
 *     return this.zeroDayService.initiateEmergencyResponse(id);
 *   }
 *
 *   @Get(':id/intelligence-report')
 *   @ApiOperation({ summary: 'Generate intelligence report' })
 *   @ApiResponse({ status: 200, type: ZeroDayIntelligenceReportDto })
 *   async getReport(@Param('id') id: string): Promise<ZeroDayIntelligenceReportDto> {
 *     return this.zeroDayService.generateIntelligenceReport(id);
 *   }
 * }
 * ```
 */
const defineZeroDayAPI = () => 'Zero-Day Controller API - see example above';
exports.defineZeroDayAPI = defineZeroDayAPI;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Discovery & Tracking
    registerZeroDayDiscovery: exports.registerZeroDayDiscovery,
    updateZeroDayStatus: exports.updateZeroDayStatus,
    validateZeroDayData: exports.validateZeroDayData,
    identifyDuplicateZeroDays: exports.identifyDuplicateZeroDays,
    calculateDisclosureTimeline: exports.calculateDisclosureTimeline,
    // Exploit Intelligence
    trackExploitIntelligence: exports.trackExploitIntelligence,
    analyzeExploitSophistication: exports.analyzeExploitSophistication,
    correlateExploitWithActors: exports.correlateExploitWithActors,
    monitorExploitAvailability: exports.monitorExploitAvailability,
    // Prioritization
    calculateVulnerabilityPriority: exports.calculateVulnerabilityPriority,
    rankVulnerabilitiesByPriority: exports.rankVulnerabilitiesByPriority,
    generateRemediationStrategy: exports.generateRemediationStrategy,
    // Patch Monitoring
    trackPatchAvailability: exports.trackPatchAvailability,
    monitorVendorPatchTimeline: exports.monitorVendorPatchTimeline,
    validatePatchCompatibility: exports.validatePatchCompatibility,
    updatePatchDeploymentProgress: exports.updatePatchDeploymentProgress,
    // Exploit Prediction
    predictExploitLikelihood: exports.predictExploitLikelihood,
    updatePredictionAccuracy: exports.updatePredictionAccuracy,
    trainPredictionModel: exports.trainPredictionModel,
    // Threat Actor Tracking
    profileZeroDayThreatActor: exports.profileZeroDayThreatActor,
    attributeZeroDayToActor: exports.attributeZeroDayToActor,
    analyzeActorZeroDayPatterns: exports.analyzeActorZeroDayPatterns,
    // Lifecycle Management
    trackVulnerabilityLifecycle: exports.trackVulnerabilityLifecycle,
    calculateLifecycleMetrics: exports.calculateLifecycleMetrics,
    // Emergency Response
    initiateEmergencyResponse: exports.initiateEmergencyResponse,
    updateEmergencyResponse: exports.updateEmergencyResponse,
    generateEmergencyResponseReport: exports.generateEmergencyResponseReport,
    // Intelligence Reporting
    generateZeroDayIntelligenceReport: exports.generateZeroDayIntelligenceReport,
    // Model Definitions
    defineZeroDayVulnerabilityModel: exports.defineZeroDayVulnerabilityModel,
    defineZeroDayAssociations: exports.defineZeroDayAssociations,
    // Service Patterns
    createZeroDayIntelligenceService: exports.createZeroDayIntelligenceService,
    // API Documentation
    defineZeroDayAPI: exports.defineZeroDayAPI,
};
//# sourceMappingURL=zero-day-intelligence-kit.js.map