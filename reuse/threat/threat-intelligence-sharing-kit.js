"use strict";
/**
 * LOC: THREATSHARE123456
 * File: /reuse/threat/threat-intelligence-sharing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/config
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence sharing services
 *   - STIX/TAXII integration modules
 *   - TLP handling services
 *   - Information sharing agreement modules
 *   - Intel sanitization services
 *   - Security collaboration platforms
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SHARING_CONFIG = exports.SHARING_CONFIG_EXAMPLES = exports.CommunityType = exports.FeedbackType = exports.TrustLevel = exports.ConfidentialityLevel = exports.SanitizationLevel = exports.SharingAgreementType = exports.TLPLevel = exports.STIXObjectType = void 0;
exports.validateSTIXObject = validateSTIXObject;
exports.validateTLPMarking = validateTLPMarking;
exports.validateSharingAgreement = validateSharingAgreement;
exports.createSTIXBundle = createSTIXBundle;
exports.createSTIXIndicator = createSTIXIndicator;
exports.createSTIXRelationship = createSTIXRelationship;
exports.parseSTIXBundle = parseSTIXBundle;
exports.serializeSTIXBundle = serializeSTIXBundle;
exports.filterSTIXObjectsByType = filterSTIXObjectsByType;
exports.mergeSTIXBundles = mergeSTIXBundles;
exports.createTAXIICollection = createTAXIICollection;
exports.createTAXIIDiscovery = createTAXIIDiscovery;
exports.createTLPMarking = createTLPMarking;
exports.canShareWithTLP = canShareWithTLP;
exports.upgradeTLPLevel = upgradeTLPLevel;
exports.downgradeTLPLevel = downgradeTLPLevel;
exports.getTLPDescription = getTLPDescription;
exports.canTransitionTLP = canTransitionTLP;
exports.createSharingAgreement = createSharingAgreement;
exports.createSharingRule = createSharingRule;
exports.isAllowedByAgreement = isAllowedByAgreement;
exports.getApplicableSharingRules = getApplicableSharingRules;
exports.sanitizeIntelligence = sanitizeIntelligence;
exports.removePII = removePII;
exports.generalizeData = generalizeData;
exports.anonymizeSource = anonymizeSource;
exports.extractPatternOnly = extractPatternOnly;
exports.getRequiredSanitizationForTLP = getRequiredSanitizationForTLP;
exports.calculateConfidenceScore = calculateConfidenceScore;
exports.calculateRecencyScore = calculateRecencyScore;
exports.calculateCorroborationScore = calculateCorroborationScore;
exports.updateConfidenceFromFeedback = updateConfidenceFromFeedback;
exports.createThreatIntelCommunity = createThreatIntelCommunity;
exports.calculateCommunityQualityScore = calculateCommunityQualityScore;
exports.generateSharingMetrics = generateSharingMetrics;
exports.generateSTIXPattern = generateSTIXPattern;
/**
 * File: /reuse/threat/threat-intelligence-sharing-kit.ts
 * Locator: WC-THREAT-SHARE-001
 * Purpose: Comprehensive Threat Intelligence Sharing Toolkit - Production-ready threat intel sharing operations
 *
 * Upstream: Independent utility module for threat intelligence sharing
 * Downstream: ../backend/*, Security services, STIX/TAXII services, Community sharing platforms
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/config, @nestjs/swagger, sequelize, crypto
 * Exports: 46+ utility functions for STIX/TAXII, TLP, sharing agreements, intel sanitization, community integration
 *
 * LLM Context: Enterprise-grade threat intelligence sharing toolkit for White Cross healthcare platform.
 * Provides comprehensive STIX/TAXII protocol support, Traffic Light Protocol (TLP) handling, threat intel
 * community integration, information sharing agreements, intelligence sanitization, bi-directional sharing,
 * confidence scoring, and HIPAA-compliant security intelligence collaboration for healthcare systems.
 * Includes Sequelize models for shared intelligence, sharing agreements, and community memberships.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * STIX 2.1 Object Types
 */
var STIXObjectType;
(function (STIXObjectType) {
    STIXObjectType["INDICATOR"] = "indicator";
    STIXObjectType["MALWARE"] = "malware";
    STIXObjectType["THREAT_ACTOR"] = "threat-actor";
    STIXObjectType["TOOL"] = "tool";
    STIXObjectType["VULNERABILITY"] = "vulnerability";
    STIXObjectType["CAMPAIGN"] = "campaign";
    STIXObjectType["ATTACK_PATTERN"] = "attack-pattern";
    STIXObjectType["COURSE_OF_ACTION"] = "course-of-action";
    STIXObjectType["IDENTITY"] = "identity";
    STIXObjectType["OBSERVED_DATA"] = "observed-data";
    STIXObjectType["REPORT"] = "report";
    STIXObjectType["RELATIONSHIP"] = "relationship";
    STIXObjectType["SIGHTING"] = "sighting";
})(STIXObjectType || (exports.STIXObjectType = STIXObjectType = {}));
/**
 * Traffic Light Protocol (TLP) Levels
 */
var TLPLevel;
(function (TLPLevel) {
    TLPLevel["RED"] = "TLP:RED";
    TLPLevel["AMBER"] = "TLP:AMBER";
    TLPLevel["AMBER_STRICT"] = "TLP:AMBER+STRICT";
    TLPLevel["GREEN"] = "TLP:GREEN";
    TLPLevel["CLEAR"] = "TLP:CLEAR";
})(TLPLevel || (exports.TLPLevel = TLPLevel = {}));
/**
 * Sharing Agreement Types
 */
var SharingAgreementType;
(function (SharingAgreementType) {
    SharingAgreementType["BILATERAL"] = "BILATERAL";
    SharingAgreementType["MULTILATERAL"] = "MULTILATERAL";
    SharingAgreementType["ISAC"] = "ISAC";
    SharingAgreementType["ISAO"] = "ISAO";
    SharingAgreementType["CUSTOM"] = "CUSTOM";
})(SharingAgreementType || (exports.SharingAgreementType = SharingAgreementType = {}));
/**
 * Sanitization Levels
 */
var SanitizationLevel;
(function (SanitizationLevel) {
    SanitizationLevel["NONE"] = "NONE";
    SanitizationLevel["LOW"] = "LOW";
    SanitizationLevel["MEDIUM"] = "MEDIUM";
    SanitizationLevel["HIGH"] = "HIGH";
    SanitizationLevel["FULL"] = "FULL";
})(SanitizationLevel || (exports.SanitizationLevel = SanitizationLevel = {}));
/**
 * Confidentiality Levels
 */
var ConfidentialityLevel;
(function (ConfidentialityLevel) {
    ConfidentialityLevel["PUBLIC"] = "PUBLIC";
    ConfidentialityLevel["INTERNAL"] = "INTERNAL";
    ConfidentialityLevel["CONFIDENTIAL"] = "CONFIDENTIAL";
    ConfidentialityLevel["RESTRICTED"] = "RESTRICTED";
    ConfidentialityLevel["TOP_SECRET"] = "TOP_SECRET";
})(ConfidentialityLevel || (exports.ConfidentialityLevel = ConfidentialityLevel = {}));
/**
 * Trust Levels
 */
var TrustLevel;
(function (TrustLevel) {
    TrustLevel["VERIFIED"] = "VERIFIED";
    TrustLevel["TRUSTED"] = "TRUSTED";
    TrustLevel["UNVERIFIED"] = "UNVERIFIED";
    TrustLevel["SUSPICIOUS"] = "SUSPICIOUS";
    TrustLevel["UNTRUSTED"] = "UNTRUSTED";
})(TrustLevel || (exports.TrustLevel = TrustLevel = {}));
/**
 * Feedback Types
 */
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["ACCURACY"] = "ACCURACY";
    FeedbackType["RELEVANCE"] = "RELEVANCE";
    FeedbackType["TIMELINESS"] = "TIMELINESS";
    FeedbackType["ACTIONABILITY"] = "ACTIONABILITY";
    FeedbackType["FALSE_POSITIVE"] = "FALSE_POSITIVE";
    FeedbackType["CONFIRMED"] = "CONFIRMED";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
/**
 * Community Types
 */
var CommunityType;
(function (CommunityType) {
    CommunityType["ISAC"] = "ISAC";
    CommunityType["ISAO"] = "ISAO";
    CommunityType["SECTOR_SPECIFIC"] = "SECTOR_SPECIFIC";
    CommunityType["REGIONAL"] = "REGIONAL";
    CommunityType["OPEN_SOURCE"] = "OPEN_SOURCE";
    CommunityType["COMMERCIAL"] = "COMMERCIAL";
    CommunityType["GOVERNMENT"] = "GOVERNMENT";
})(CommunityType || (exports.CommunityType = CommunityType = {}));
// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================
/**
 * Validates STIX object structure
 */
function validateSTIXObject(obj) {
    const errors = [];
    if (!obj.type || !Object.values(STIXObjectType).includes(obj.type)) {
        errors.push('Invalid or missing STIX object type');
    }
    if (obj.spec_version !== '2.1') {
        errors.push('STIX spec_version must be 2.1');
    }
    if (!obj.id || !obj.id.match(/^[a-z-]+--[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        errors.push('Invalid STIX ID format');
    }
    if (!obj.created || !isValidISODate(obj.created)) {
        errors.push('Invalid or missing created timestamp');
    }
    if (!obj.modified || !isValidISODate(obj.modified)) {
        errors.push('Invalid or missing modified timestamp');
    }
    if (obj.confidence !== undefined && (obj.confidence < 0 || obj.confidence > 100)) {
        errors.push('Confidence must be between 0 and 100');
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Validates TLP marking
 */
function validateTLPMarking(marking) {
    const errors = [];
    if (!Object.values(TLPLevel).includes(marking.level)) {
        errors.push('Invalid TLP level');
    }
    if (marking.level === TLPLevel.AMBER_STRICT && (!marking.authorizedEntities || marking.authorizedEntities.length === 0)) {
        errors.push('TLP:AMBER+STRICT requires authorized entities');
    }
    if (marking.expiresAt && marking.expiresAt <= new Date()) {
        errors.push('TLP marking expiration date must be in the future');
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Validates sharing agreement configuration
 */
function validateSharingAgreement(agreement) {
    const errors = [];
    if (!agreement.name || agreement.name.trim().length === 0) {
        errors.push('Agreement name is required');
    }
    if (!agreement.parties || agreement.parties.length < 2) {
        errors.push('At least two parties are required for a sharing agreement');
    }
    if (agreement.type === SharingAgreementType.BILATERAL && agreement.parties.length !== 2) {
        errors.push('Bilateral agreement must have exactly two parties');
    }
    if (agreement.endDate && agreement.endDate <= agreement.startDate) {
        errors.push('End date must be after start date');
    }
    if (!agreement.sharingRules || agreement.sharingRules.length === 0) {
        errors.push('At least one sharing rule is required');
    }
    return { valid: errors.length === 0, errors };
}
// ============================================================================
// STIX/TAXII PROTOCOL FUNCTIONS
// ============================================================================
/**
 * Creates a STIX 2.1 bundle
 */
function createSTIXBundle(objects) {
    return {
        type: 'bundle',
        id: `bundle--${crypto.randomUUID()}`,
        objects,
    };
}
/**
 * Creates a STIX indicator object
 */
function createSTIXIndicator(config) {
    const now = new Date().toISOString();
    return {
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${crypto.randomUUID()}`,
        created: now,
        modified: now,
        created_by_ref: config.createdBy,
        name: config.name,
        description: config.description,
        indicator_types: config.indicatorTypes || ['malicious-activity'],
        pattern: config.pattern,
        pattern_type: config.patternType,
        valid_from: config.validFrom.toISOString(),
        valid_until: config.validUntil?.toISOString(),
        confidence: config.confidence,
        labels: config.labels,
        kill_chain_phases: config.killChainPhases,
    };
}
/**
 * Creates a STIX relationship object
 */
function createSTIXRelationship(sourceId, targetId, relationshipType, description) {
    const now = new Date().toISOString();
    return {
        type: STIXObjectType.RELATIONSHIP,
        spec_version: '2.1',
        id: `relationship--${crypto.randomUUID()}`,
        created: now,
        modified: now,
        relationship_type: relationshipType,
        source_ref: sourceId,
        target_ref: targetId,
        description,
    };
}
/**
 * Parses STIX bundle from JSON
 */
function parseSTIXBundle(json) {
    try {
        const bundle = JSON.parse(json);
        if (bundle.type !== 'bundle' || !Array.isArray(bundle.objects)) {
            return null;
        }
        return bundle;
    }
    catch (error) {
        return null;
    }
}
/**
 * Converts STIX bundle to JSON
 */
function serializeSTIXBundle(bundle, pretty = false) {
    return JSON.stringify(bundle, null, pretty ? 2 : 0);
}
/**
 * Filters STIX objects by type
 */
function filterSTIXObjectsByType(bundle, type) {
    return bundle.objects.filter(obj => obj.type === type);
}
/**
 * Merges multiple STIX bundles
 */
function mergeSTIXBundles(bundles) {
    const allObjects = [];
    const seenIds = new Set();
    for (const bundle of bundles) {
        for (const obj of bundle.objects) {
            if (!seenIds.has(obj.id)) {
                allObjects.push(obj);
                seenIds.add(obj.id);
            }
        }
    }
    return createSTIXBundle(allObjects);
}
/**
 * Creates TAXII collection configuration
 */
function createTAXIICollection(config) {
    return {
        id: crypto.randomUUID(),
        title: config.title,
        description: config.description,
        alias: config.alias,
        can_read: config.canRead,
        can_write: config.canWrite,
        media_types: config.mediaTypes || ['application/stix+json;version=2.1'],
    };
}
/**
 * Creates TAXII discovery response
 */
function createTAXIIDiscovery(config) {
    return {
        title: config.title,
        description: config.description,
        contact: config.contact,
        default: config.defaultRoot,
        api_roots: config.apiRoots || [],
    };
}
// ============================================================================
// TLP HANDLING FUNCTIONS
// ============================================================================
/**
 * Creates TLP marking
 */
function createTLPMarking(level, appliedBy, expiresAt, authorizedEntities) {
    return {
        level,
        appliedAt: new Date(),
        appliedBy,
        expiresAt,
        authorizedEntities,
    };
}
/**
 * Checks if TLP marking allows sharing with recipient
 */
function canShareWithTLP(marking, recipientOrg, sourceOrg) {
    // Check expiration
    if (marking.expiresAt && marking.expiresAt < new Date()) {
        return false;
    }
    switch (marking.level) {
        case TLPLevel.RED:
            // Only participants of the meeting/event
            return recipientOrg === sourceOrg;
        case TLPLevel.AMBER_STRICT:
            // Only specific named entities
            return marking.authorizedEntities?.includes(recipientOrg) || false;
        case TLPLevel.AMBER:
            // Recipient's organization
            return recipientOrg === sourceOrg;
        case TLPLevel.GREEN:
            // Community wide
            return true;
        case TLPLevel.CLEAR:
            // No restrictions
            return true;
        default:
            return false;
    }
}
/**
 * Upgrades TLP level (more restrictive)
 */
function upgradeTLPLevel(currentLevel) {
    const hierarchy = [TLPLevel.CLEAR, TLPLevel.GREEN, TLPLevel.AMBER, TLPLevel.AMBER_STRICT, TLPLevel.RED];
    const currentIndex = hierarchy.indexOf(currentLevel);
    if (currentIndex < hierarchy.length - 1) {
        return hierarchy[currentIndex + 1];
    }
    return currentLevel;
}
/**
 * Downgrades TLP level (less restrictive)
 */
function downgradeTLPLevel(currentLevel) {
    const hierarchy = [TLPLevel.CLEAR, TLPLevel.GREEN, TLPLevel.AMBER, TLPLevel.AMBER_STRICT, TLPLevel.RED];
    const currentIndex = hierarchy.indexOf(currentLevel);
    if (currentIndex > 0) {
        return hierarchy[currentIndex - 1];
    }
    return currentLevel;
}
/**
 * Gets TLP level restriction description
 */
function getTLPDescription(level) {
    const descriptions = {
        [TLPLevel.RED]: 'Not for disclosure, restricted to participants only',
        [TLPLevel.AMBER_STRICT]: 'Limited disclosure, restricted to specific named entities',
        [TLPLevel.AMBER]: 'Limited disclosure, restricted to participant\'s organization',
        [TLPLevel.GREEN]: 'Limited disclosure, community wide',
        [TLPLevel.CLEAR]: 'Disclosure is not limited',
    };
    return descriptions[level];
}
/**
 * Validates TLP transition
 */
function canTransitionTLP(from, to) {
    // Can always upgrade (make more restrictive)
    const hierarchy = [TLPLevel.CLEAR, TLPLevel.GREEN, TLPLevel.AMBER, TLPLevel.AMBER_STRICT, TLPLevel.RED];
    const fromIndex = hierarchy.indexOf(from);
    const toIndex = hierarchy.indexOf(to);
    // Allow upgrades or same level
    return toIndex >= fromIndex;
}
// ============================================================================
// SHARING AGREEMENT FUNCTIONS
// ============================================================================
/**
 * Creates information sharing agreement
 */
function createSharingAgreement(config) {
    return {
        id: crypto.randomUUID(),
        name: config.name,
        type: config.type,
        parties: config.parties,
        startDate: config.startDate,
        endDate: config.endDate,
        status: 'active',
        sharingRules: config.sharingRules,
        tlpDefault: config.tlpDefault || TLPLevel.AMBER,
        confidentialityLevel: ConfidentialityLevel.CONFIDENTIAL,
        sanitizationRequired: config.sanitizationRequired ?? true,
        bilateralSharing: config.type === SharingAgreementType.BILATERAL,
        multilateralSharing: config.type === SharingAgreementType.MULTILATERAL,
    };
}
/**
 * Creates sharing rule
 */
function createSharingRule(config) {
    return {
        id: crypto.randomUUID(),
        name: config.name,
        direction: config.direction,
        dataTypes: config.dataTypes,
        tlpRestrictions: config.tlpRestrictions || [TLPLevel.GREEN, TLPLevel.CLEAR],
        confidenceThreshold: config.confidenceThreshold ?? 70,
        sanitizationLevel: config.sanitizationLevel || SanitizationLevel.MEDIUM,
        autoShare: config.autoShare ?? false,
        approvalRequired: config.approvalRequired ?? true,
    };
}
/**
 * Checks if sharing is allowed by agreement
 */
function isAllowedByAgreement(agreement, intel, direction) {
    if (agreement.status !== 'active') {
        return false;
    }
    // Check agreement validity period
    const now = new Date();
    if (now < agreement.startDate || (agreement.endDate && now > agreement.endDate)) {
        return false;
    }
    // Check sharing rules
    for (const rule of agreement.sharingRules) {
        if (rule.direction === direction || rule.direction === 'bidirectional') {
            // Check TLP restrictions
            if (rule.tlpRestrictions.length > 0 && !rule.tlpRestrictions.includes(intel.tlpMarking.level)) {
                continue;
            }
            // Check confidence threshold
            if (intel.confidenceScore < rule.confidenceThreshold) {
                continue;
            }
            return true;
        }
    }
    return false;
}
/**
 * Gets applicable sharing rules for intel
 */
function getApplicableSharingRules(agreement, intelType, direction) {
    return agreement.sharingRules.filter(rule => {
        const directionMatch = rule.direction === direction || rule.direction === 'bidirectional';
        const typeMatch = rule.dataTypes.includes(intelType) || rule.dataTypes.includes('*');
        return directionMatch && typeMatch;
    });
}
// ============================================================================
// INTELLIGENCE SANITIZATION FUNCTIONS
// ============================================================================
/**
 * Sanitizes intelligence based on level
 */
function sanitizeIntelligence(intel, level) {
    const sanitized = { ...intel };
    switch (level) {
        case SanitizationLevel.NONE:
            // No sanitization
            break;
        case SanitizationLevel.LOW:
            // Remove direct identifiers
            sanitized.stixObject = removePII(sanitized.stixObject);
            break;
        case SanitizationLevel.MEDIUM:
            // Remove identifiers and generalize
            sanitized.stixObject = removePII(sanitized.stixObject);
            sanitized.stixObject = generalizeData(sanitized.stixObject);
            sanitized.source = anonymizeSource(sanitized.source);
            break;
        case SanitizationLevel.HIGH:
            // Aggressive sanitization
            sanitized.stixObject = extractPatternOnly(sanitized.stixObject);
            sanitized.source = {
                id: 'anonymous',
                name: 'Anonymous',
                type: 'external',
                reliability: 50,
                trustLevel: TrustLevel.UNVERIFIED,
            };
            break;
        case SanitizationLevel.FULL:
            // Complete anonymization
            sanitized.stixObject = extractPatternOnly(sanitized.stixObject);
            delete sanitized.sharedBy;
            sanitized.source = {
                id: 'anonymous',
                name: 'Anonymous',
                type: 'external',
                reliability: 50,
                trustLevel: TrustLevel.UNVERIFIED,
            };
            sanitized.metadata = {};
            break;
    }
    sanitized.sanitizationApplied = level;
    return sanitized;
}
/**
 * Removes PII from STIX object
 */
function removePII(obj) {
    const sanitized = { ...obj };
    // Remove created_by_ref
    delete sanitized.created_by_ref;
    // Remove email addresses, phone numbers from descriptions
    if (sanitized.description) {
        sanitized.description = sanitized.description
            .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
            .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
    }
    return sanitized;
}
/**
 * Generalizes data in STIX object
 */
function generalizeData(obj) {
    const sanitized = { ...obj };
    // Generalize IP addresses to /24 networks
    if (sanitized.pattern) {
        sanitized.pattern = sanitized.pattern.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}/g, '$10/24');
    }
    return sanitized;
}
/**
 * Anonymizes intelligence source
 */
function anonymizeSource(source) {
    return {
        ...source,
        id: crypto.randomUUID(),
        name: `Anonymous ${source.type} source`,
    };
}
/**
 * Extracts only threat pattern from STIX object
 */
function extractPatternOnly(obj) {
    if (obj.type === STIXObjectType.INDICATOR) {
        const indicator = obj;
        return {
            type: STIXObjectType.INDICATOR,
            spec_version: '2.1',
            id: `indicator--${crypto.randomUUID()}`,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            pattern: indicator.pattern,
            pattern_type: indicator.pattern_type,
            valid_from: indicator.valid_from,
        };
    }
    return obj;
}
/**
 * Determines required sanitization level for TLP
 */
function getRequiredSanitizationForTLP(tlp) {
    const mapping = {
        [TLPLevel.RED]: SanitizationLevel.NONE,
        [TLPLevel.AMBER_STRICT]: SanitizationLevel.LOW,
        [TLPLevel.AMBER]: SanitizationLevel.LOW,
        [TLPLevel.GREEN]: SanitizationLevel.MEDIUM,
        [TLPLevel.CLEAR]: SanitizationLevel.MEDIUM,
    };
    return mapping[tlp];
}
// ============================================================================
// CONFIDENCE SCORING FUNCTIONS
// ============================================================================
/**
 * Calculates intelligence confidence score
 */
function calculateConfidenceScore(factors) {
    const defaultWeights = {
        sourceReliability: 0.25,
        dataQuality: 0.20,
        corroboration: 0.25,
        recency: 0.15,
        relevance: 0.15,
    };
    const weights = { ...defaultWeights, ...factors.weights };
    const overall = factors.sourceReliability * weights.sourceReliability +
        factors.dataQuality * weights.dataQuality +
        factors.corroboration * weights.corroboration +
        factors.recency * weights.recency +
        factors.relevance * weights.relevance;
    const confidenceFactors = [
        {
            name: 'Source Reliability',
            weight: weights.sourceReliability,
            score: factors.sourceReliability,
            description: 'Trustworthiness and track record of the source',
        },
        {
            name: 'Data Quality',
            weight: weights.dataQuality,
            score: factors.dataQuality,
            description: 'Completeness and accuracy of the data',
        },
        {
            name: 'Corroboration',
            weight: weights.corroboration,
            score: factors.corroboration,
            description: 'Confirmation from multiple independent sources',
        },
        {
            name: 'Recency',
            weight: weights.recency,
            score: factors.recency,
            description: 'How current the intelligence is',
        },
        {
            name: 'Relevance',
            weight: weights.relevance,
            score: factors.relevance,
            description: 'Applicability to organization\'s threat landscape',
        },
    ];
    return {
        overall: Math.round(overall * 100) / 100,
        sourceReliability: factors.sourceReliability,
        dataQuality: factors.dataQuality,
        corroboration: factors.corroboration,
        recency: factors.recency,
        relevance: factors.relevance,
        calculatedAt: new Date(),
        factors: confidenceFactors,
    };
}
/**
 * Calculates recency score based on age
 */
function calculateRecencyScore(date) {
    const ageHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    if (ageHours < 24)
        return 100;
    if (ageHours < 72)
        return 90;
    if (ageHours < 168)
        return 75; // 1 week
    if (ageHours < 720)
        return 60; // 1 month
    if (ageHours < 2160)
        return 40; // 3 months
    return 20;
}
/**
 * Calculates corroboration score
 */
function calculateCorroborationScore(sources) {
    if (sources.length === 1)
        return 50;
    if (sources.length === 2)
        return 70;
    if (sources.length === 3)
        return 85;
    if (sources.length >= 4)
        return 95;
    return 0;
}
/**
 * Updates confidence score based on feedback
 */
function updateConfidenceFromFeedback(currentScore, feedback) {
    if (feedback.length === 0)
        return currentScore;
    const avgFeedbackRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
    const feedbackScore = (avgFeedbackRating / 5) * 100;
    // Adjust overall score by 10% based on feedback
    const adjustedOverall = currentScore.overall * 0.9 + feedbackScore * 0.1;
    return {
        ...currentScore,
        overall: Math.round(adjustedOverall * 100) / 100,
    };
}
// ============================================================================
// COMMUNITY INTEGRATION FUNCTIONS
// ============================================================================
/**
 * Creates threat intelligence community
 */
function createThreatIntelCommunity(config) {
    return {
        id: crypto.randomUUID(),
        name: config.name,
        type: config.type,
        sector: config.sector,
        region: config.region,
        memberCount: 0,
        sharingVolume: 0,
        qualityScore: 0,
        status: 'active',
        capabilities: config.capabilities || [],
    };
}
/**
 * Calculates community quality score
 */
function calculateCommunityQualityScore(metrics) {
    const weights = {
        avgConfidence: 0.30,
        feedbackRate: 0.15,
        avgFeedbackRating: 0.20,
        actionableRate: 0.25,
        sharingFrequency: 0.10,
    };
    const score = metrics.avgConfidence * weights.avgConfidence +
        metrics.feedbackRate * weights.feedbackRate +
        (metrics.avgFeedbackRating / 5) * 100 * weights.avgFeedbackRating +
        metrics.actionableRate * weights.actionableRate +
        metrics.sharingFrequency * weights.sharingFrequency;
    return Math.round(score * 100) / 100;
}
/**
 * Generates sharing metrics for period
 */
function generateSharingMetrics(shared, received, period) {
    const allIntel = [...shared, ...received];
    const tlpDistribution = {
        [TLPLevel.RED]: 0,
        [TLPLevel.AMBER_STRICT]: 0,
        [TLPLevel.AMBER]: 0,
        [TLPLevel.GREEN]: 0,
        [TLPLevel.CLEAR]: 0,
    };
    allIntel.forEach(intel => {
        tlpDistribution[intel.tlpMarking.level]++;
    });
    const contributors = new Set(allIntel.map(i => i.sharedBy)).size;
    const avgConfidence = allIntel.reduce((sum, i) => sum + i.confidenceScore, 0) / allIntel.length || 0;
    const totalFeedback = allIntel.reduce((sum, i) => sum + (i.feedback?.length || 0), 0);
    const feedbackRate = (totalFeedback / allIntel.length) * 100 || 0;
    return {
        period,
        itemsShared: shared.length,
        itemsReceived: received.length,
        uniqueContributors: contributors,
        avgConfidenceScore: Math.round(avgConfidence * 100) / 100,
        tlpDistribution,
        communityParticipation: 0, // Would be calculated from community data
        feedbackRate: Math.round(feedbackRate * 100) / 100,
        actionableIntelRate: 0, // Would be calculated from feedback
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Validates ISO date string
 */
function isValidISODate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
}
/**
 * Generates STIX pattern from IOC
 */
function generateSTIXPattern(iocType, iocValue) {
    const patterns = {
        'ipv4-addr': `[ipv4-addr:value = '${iocValue}']`,
        'ipv6-addr': `[ipv6-addr:value = '${iocValue}']`,
        'domain-name': `[domain-name:value = '${iocValue}']`,
        'url': `[url:value = '${iocValue}']`,
        'email-addr': `[email-addr:value = '${iocValue}']`,
        'file-hash-md5': `[file:hashes.MD5 = '${iocValue}']`,
        'file-hash-sha1': `[file:hashes.'SHA-1' = '${iocValue}']`,
        'file-hash-sha256': `[file:hashes.'SHA-256' = '${iocValue}']`,
    };
    return patterns[iocType] || `[x-custom:value = '${iocValue}']`;
}
/**
 * Exports configuration examples
 */
exports.SHARING_CONFIG_EXAMPLES = {
    stixIndicator: {
        name: 'Malicious IP Address',
        description: 'Known C2 server for APT group',
        pattern: "[ipv4-addr:value = '192.0.2.1']",
        patternType: 'stix',
        validFrom: new Date(),
        indicatorTypes: ['malicious-activity', 'anomalous-activity'],
        confidence: 85,
        labels: ['apt', 'c2-server'],
    },
    tlpMarking: {
        level: TLPLevel.AMBER,
        appliedBy: 'security-team@whitecross.healthcare',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    sharingAgreement: {
        name: 'Healthcare ISAC Agreement',
        type: SharingAgreementType.ISAC,
        startDate: new Date(),
        tlpDefault: TLPLevel.AMBER,
        sanitizationRequired: true,
    },
    sharingRule: {
        name: 'Outbound Malware IOCs',
        direction: 'outbound',
        dataTypes: ['indicator', 'malware'],
        tlpRestrictions: [TLPLevel.GREEN, TLPLevel.CLEAR],
        confidenceThreshold: 75,
        sanitizationLevel: SanitizationLevel.MEDIUM,
        autoShare: false,
        approvalRequired: true,
    },
};
/**
 * Default configuration for development
 */
exports.DEFAULT_SHARING_CONFIG = {
    defaultTLP: TLPLevel.AMBER,
    defaultSanitization: SanitizationLevel.MEDIUM,
    minConfidenceForSharing: 70,
    maxSharingAge: 90, // days
    requireApproval: true,
    enableBidirectional: true,
    communityParticipation: true,
};
//# sourceMappingURL=threat-intelligence-sharing-kit.js.map