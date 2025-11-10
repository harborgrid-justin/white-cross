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
/**
 * STIX 2.1 Object Types
 */
export declare enum STIXObjectType {
    INDICATOR = "indicator",
    MALWARE = "malware",
    THREAT_ACTOR = "threat-actor",
    TOOL = "tool",
    VULNERABILITY = "vulnerability",
    CAMPAIGN = "campaign",
    ATTACK_PATTERN = "attack-pattern",
    COURSE_OF_ACTION = "course-of-action",
    IDENTITY = "identity",
    OBSERVED_DATA = "observed-data",
    REPORT = "report",
    RELATIONSHIP = "relationship",
    SIGHTING = "sighting"
}
/**
 * STIX 2.1 Domain Object
 */
export interface STIXObject {
    type: STIXObjectType;
    spec_version: '2.1';
    id: string;
    created_by_ref?: string;
    created: string;
    modified: string;
    revoked?: boolean;
    labels?: string[];
    confidence?: number;
    lang?: string;
    external_references?: STIXExternalReference[];
    object_marking_refs?: string[];
    granular_markings?: STIXGranularMarking[];
    extensions?: Record<string, any>;
}
/**
 * STIX Indicator Object
 */
export interface STIXIndicator extends STIXObject {
    type: 'indicator';
    name?: string;
    description?: string;
    indicator_types?: string[];
    pattern: string;
    pattern_type: 'stix' | 'pcre' | 'sigma' | 'snort' | 'suricata' | 'yara';
    pattern_version?: string;
    valid_from: string;
    valid_until?: string;
    kill_chain_phases?: STIXKillChainPhase[];
}
/**
 * STIX Kill Chain Phase
 */
export interface STIXKillChainPhase {
    kill_chain_name: string;
    phase_name: string;
}
/**
 * STIX External Reference
 */
export interface STIXExternalReference {
    source_name: string;
    description?: string;
    url?: string;
    hashes?: Record<string, string>;
    external_id?: string;
}
/**
 * STIX Granular Marking
 */
export interface STIXGranularMarking {
    lang?: string;
    marking_ref?: string;
    selectors: string[];
}
/**
 * STIX Bundle
 */
export interface STIXBundle {
    type: 'bundle';
    id: string;
    objects: STIXObject[];
}
/**
 * TAXII 2.1 Collection
 */
export interface TAXIICollection {
    id: string;
    title: string;
    description?: string;
    alias?: string;
    can_read: boolean;
    can_write: boolean;
    media_types?: string[];
}
/**
 * TAXII 2.1 Server Discovery
 */
export interface TAXIIDiscovery {
    title: string;
    description?: string;
    contact?: string;
    default?: string;
    api_roots?: string[];
}
/**
 * Traffic Light Protocol (TLP) Levels
 */
export declare enum TLPLevel {
    RED = "TLP:RED",// Not for disclosure, restricted to participants only
    AMBER = "TLP:AMBER",// Limited disclosure, restricted to participant's organization
    AMBER_STRICT = "TLP:AMBER+STRICT",// Limited disclosure, restricted to specific named entities
    GREEN = "TLP:GREEN",// Limited disclosure, community wide
    CLEAR = "TLP:CLEAR"
}
/**
 * TLP Marking Configuration
 */
export interface TLPMarking {
    level: TLPLevel;
    appliedAt: Date;
    appliedBy: string;
    expiresAt?: Date;
    restrictions?: string[];
    authorizedEntities?: string[];
}
/**
 * Information Sharing Agreement
 */
export interface SharingAgreement {
    id: string;
    name: string;
    type: SharingAgreementType;
    parties: SharingParty[];
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'suspended' | 'terminated';
    sharingRules: SharingRule[];
    tlpDefault: TLPLevel;
    confidentialityLevel: ConfidentialityLevel;
    sanitizationRequired: boolean;
    bilateralSharing: boolean;
    multilateralSharing: boolean;
    metadata?: Record<string, any>;
}
/**
 * Sharing Agreement Types
 */
export declare enum SharingAgreementType {
    BILATERAL = "BILATERAL",
    MULTILATERAL = "MULTILATERAL",
    ISAC = "ISAC",// Information Sharing and Analysis Center
    ISAO = "ISAO",// Information Sharing and Analysis Organization
    CUSTOM = "CUSTOM"
}
/**
 * Sharing Party
 */
export interface SharingParty {
    id: string;
    name: string;
    organizationType: string;
    sector: string;
    contactEmail: string;
    contactPhone?: string;
    tlpCapabilities: TLPLevel[];
    certificationLevel?: string;
    joinedAt: Date;
    role: 'provider' | 'consumer' | 'both';
}
/**
 * Sharing Rule
 */
export interface SharingRule {
    id: string;
    name: string;
    direction: 'inbound' | 'outbound' | 'bidirectional';
    dataTypes: string[];
    tlpRestrictions: TLPLevel[];
    confidenceThreshold: number;
    sanitizationLevel: SanitizationLevel;
    autoShare: boolean;
    approvalRequired: boolean;
    retentionDays?: number;
    filters?: Record<string, any>;
}
/**
 * Sanitization Levels
 */
export declare enum SanitizationLevel {
    NONE = "NONE",// No sanitization
    LOW = "LOW",// Remove direct identifiers
    MEDIUM = "MEDIUM",// Remove identifiers and generalize data
    HIGH = "HIGH",// Aggressive sanitization, only threat patterns
    FULL = "FULL"
}
/**
 * Confidentiality Levels
 */
export declare enum ConfidentialityLevel {
    PUBLIC = "PUBLIC",
    INTERNAL = "INTERNAL",
    CONFIDENTIAL = "CONFIDENTIAL",
    RESTRICTED = "RESTRICTED",
    TOP_SECRET = "TOP_SECRET"
}
/**
 * Shared Intelligence Item
 */
export interface SharedIntelligence {
    id: string;
    stixObject: STIXObject;
    tlpMarking: TLPMarking;
    confidenceScore: number;
    source: IntelSource;
    sharingAgreementId?: string;
    sanitizationApplied: SanitizationLevel;
    sharedAt: Date;
    sharedBy: string;
    recipients: string[];
    expiresAt?: Date;
    feedback?: IntelFeedback[];
    metadata?: Record<string, any>;
}
/**
 * Intelligence Source
 */
export interface IntelSource {
    id: string;
    name: string;
    type: 'internal' | 'external' | 'community' | 'commercial';
    reliability: number;
    trustLevel: TrustLevel;
    sector?: string;
    country?: string;
}
/**
 * Trust Levels
 */
export declare enum TrustLevel {
    VERIFIED = "VERIFIED",
    TRUSTED = "TRUSTED",
    UNVERIFIED = "UNVERIFIED",
    SUSPICIOUS = "SUSPICIOUS",
    UNTRUSTED = "UNTRUSTED"
}
/**
 * Intelligence Feedback
 */
export interface IntelFeedback {
    id: string;
    intelId: string;
    feedbackType: FeedbackType;
    rating: number;
    comment?: string;
    providedBy: string;
    providedAt: Date;
    actionTaken?: string;
}
/**
 * Feedback Types
 */
export declare enum FeedbackType {
    ACCURACY = "ACCURACY",
    RELEVANCE = "RELEVANCE",
    TIMELINESS = "TIMELINESS",
    ACTIONABILITY = "ACTIONABILITY",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    CONFIRMED = "CONFIRMED"
}
/**
 * Threat Intelligence Community
 */
export interface ThreatIntelCommunity {
    id: string;
    name: string;
    type: CommunityType;
    sector?: string;
    region?: string;
    memberCount: number;
    sharingVolume: number;
    qualityScore: number;
    joinDate?: Date;
    status: 'active' | 'inactive' | 'pending';
    capabilities: string[];
    metadata?: Record<string, any>;
}
/**
 * Community Types
 */
export declare enum CommunityType {
    ISAC = "ISAC",
    ISAO = "ISAO",
    SECTOR_SPECIFIC = "SECTOR_SPECIFIC",
    REGIONAL = "REGIONAL",
    OPEN_SOURCE = "OPEN_SOURCE",
    COMMERCIAL = "COMMERCIAL",
    GOVERNMENT = "GOVERNMENT"
}
/**
 * Confidence Scoring Model
 */
export interface ConfidenceScore {
    overall: number;
    sourceReliability: number;
    dataQuality: number;
    corroboration: number;
    recency: number;
    relevance: number;
    calculatedAt: Date;
    factors: ConfidenceFactor[];
}
/**
 * Confidence Factor
 */
export interface ConfidenceFactor {
    name: string;
    weight: number;
    score: number;
    description?: string;
}
/**
 * Sharing Metrics
 */
export interface SharingMetrics {
    period: {
        start: Date;
        end: Date;
    };
    itemsShared: number;
    itemsReceived: number;
    uniqueContributors: number;
    avgConfidenceScore: number;
    tlpDistribution: Record<TLPLevel, number>;
    communityParticipation: number;
    feedbackRate: number;
    actionableIntelRate: number;
}
/**
 * Validates STIX object structure
 */
export declare function validateSTIXObject(obj: any): {
    valid: boolean;
    errors: string[];
};
/**
 * Validates TLP marking
 */
export declare function validateTLPMarking(marking: TLPMarking): {
    valid: boolean;
    errors: string[];
};
/**
 * Validates sharing agreement configuration
 */
export declare function validateSharingAgreement(agreement: SharingAgreement): {
    valid: boolean;
    errors: string[];
};
/**
 * Creates a STIX 2.1 bundle
 */
export declare function createSTIXBundle(objects: STIXObject[]): STIXBundle;
/**
 * Creates a STIX indicator object
 */
export declare function createSTIXIndicator(config: {
    name: string;
    description?: string;
    pattern: string;
    patternType: 'stix' | 'pcre' | 'sigma' | 'snort' | 'suricata' | 'yara';
    validFrom: Date;
    validUntil?: Date;
    indicatorTypes?: string[];
    confidence?: number;
    labels?: string[];
    killChainPhases?: STIXKillChainPhase[];
    createdBy?: string;
}): STIXIndicator;
/**
 * Creates a STIX relationship object
 */
export declare function createSTIXRelationship(sourceId: string, targetId: string, relationshipType: string, description?: string): STIXObject;
/**
 * Parses STIX bundle from JSON
 */
export declare function parseSTIXBundle(json: string): STIXBundle | null;
/**
 * Converts STIX bundle to JSON
 */
export declare function serializeSTIXBundle(bundle: STIXBundle, pretty?: boolean): string;
/**
 * Filters STIX objects by type
 */
export declare function filterSTIXObjectsByType(bundle: STIXBundle, type: STIXObjectType): STIXObject[];
/**
 * Merges multiple STIX bundles
 */
export declare function mergeSTIXBundles(bundles: STIXBundle[]): STIXBundle;
/**
 * Creates TAXII collection configuration
 */
export declare function createTAXIICollection(config: {
    title: string;
    description?: string;
    alias?: string;
    canRead: boolean;
    canWrite: boolean;
    mediaTypes?: string[];
}): TAXIICollection;
/**
 * Creates TAXII discovery response
 */
export declare function createTAXIIDiscovery(config: {
    title: string;
    description?: string;
    contact?: string;
    defaultRoot?: string;
    apiRoots?: string[];
}): TAXIIDiscovery;
/**
 * Creates TLP marking
 */
export declare function createTLPMarking(level: TLPLevel, appliedBy: string, expiresAt?: Date, authorizedEntities?: string[]): TLPMarking;
/**
 * Checks if TLP marking allows sharing with recipient
 */
export declare function canShareWithTLP(marking: TLPMarking, recipientOrg: string, sourceOrg: string): boolean;
/**
 * Upgrades TLP level (more restrictive)
 */
export declare function upgradeTLPLevel(currentLevel: TLPLevel): TLPLevel;
/**
 * Downgrades TLP level (less restrictive)
 */
export declare function downgradeTLPLevel(currentLevel: TLPLevel): TLPLevel;
/**
 * Gets TLP level restriction description
 */
export declare function getTLPDescription(level: TLPLevel): string;
/**
 * Validates TLP transition
 */
export declare function canTransitionTLP(from: TLPLevel, to: TLPLevel): boolean;
/**
 * Creates information sharing agreement
 */
export declare function createSharingAgreement(config: {
    name: string;
    type: SharingAgreementType;
    parties: SharingParty[];
    startDate: Date;
    endDate?: Date;
    sharingRules: SharingRule[];
    tlpDefault?: TLPLevel;
    sanitizationRequired?: boolean;
}): SharingAgreement;
/**
 * Creates sharing rule
 */
export declare function createSharingRule(config: {
    name: string;
    direction: 'inbound' | 'outbound' | 'bidirectional';
    dataTypes: string[];
    tlpRestrictions?: TLPLevel[];
    confidenceThreshold?: number;
    sanitizationLevel?: SanitizationLevel;
    autoShare?: boolean;
    approvalRequired?: boolean;
}): SharingRule;
/**
 * Checks if sharing is allowed by agreement
 */
export declare function isAllowedByAgreement(agreement: SharingAgreement, intel: SharedIntelligence, direction: 'inbound' | 'outbound'): boolean;
/**
 * Gets applicable sharing rules for intel
 */
export declare function getApplicableSharingRules(agreement: SharingAgreement, intelType: string, direction: 'inbound' | 'outbound'): SharingRule[];
/**
 * Sanitizes intelligence based on level
 */
export declare function sanitizeIntelligence(intel: SharedIntelligence, level: SanitizationLevel): SharedIntelligence;
/**
 * Removes PII from STIX object
 */
export declare function removePII(obj: STIXObject): STIXObject;
/**
 * Generalizes data in STIX object
 */
export declare function generalizeData(obj: STIXObject): STIXObject;
/**
 * Anonymizes intelligence source
 */
export declare function anonymizeSource(source: IntelSource): IntelSource;
/**
 * Extracts only threat pattern from STIX object
 */
export declare function extractPatternOnly(obj: STIXObject): STIXObject;
/**
 * Determines required sanitization level for TLP
 */
export declare function getRequiredSanitizationForTLP(tlp: TLPLevel): SanitizationLevel;
/**
 * Calculates intelligence confidence score
 */
export declare function calculateConfidenceScore(factors: {
    sourceReliability: number;
    dataQuality: number;
    corroboration: number;
    recency: number;
    relevance: number;
    weights?: Partial<Record<string, number>>;
}): ConfidenceScore;
/**
 * Calculates recency score based on age
 */
export declare function calculateRecencyScore(date: Date): number;
/**
 * Calculates corroboration score
 */
export declare function calculateCorroborationScore(sources: IntelSource[]): number;
/**
 * Updates confidence score based on feedback
 */
export declare function updateConfidenceFromFeedback(currentScore: ConfidenceScore, feedback: IntelFeedback[]): ConfidenceScore;
/**
 * Creates threat intelligence community
 */
export declare function createThreatIntelCommunity(config: {
    name: string;
    type: CommunityType;
    sector?: string;
    region?: string;
    capabilities?: string[];
}): ThreatIntelCommunity;
/**
 * Calculates community quality score
 */
export declare function calculateCommunityQualityScore(metrics: {
    avgConfidence: number;
    feedbackRate: number;
    avgFeedbackRating: number;
    actionableRate: number;
    sharingFrequency: number;
}): number;
/**
 * Generates sharing metrics for period
 */
export declare function generateSharingMetrics(shared: SharedIntelligence[], received: SharedIntelligence[], period: {
    start: Date;
    end: Date;
}): SharingMetrics;
/**
 * Generates STIX pattern from IOC
 */
export declare function generateSTIXPattern(iocType: string, iocValue: string): string;
/**
 * Exports configuration examples
 */
export declare const SHARING_CONFIG_EXAMPLES: {
    stixIndicator: {
        name: string;
        description: string;
        pattern: string;
        patternType: "stix";
        validFrom: Date;
        indicatorTypes: string[];
        confidence: number;
        labels: string[];
    };
    tlpMarking: {
        level: TLPLevel;
        appliedBy: string;
        expiresAt: Date;
    };
    sharingAgreement: {
        name: string;
        type: SharingAgreementType;
        startDate: Date;
        tlpDefault: TLPLevel;
        sanitizationRequired: boolean;
    };
    sharingRule: {
        name: string;
        direction: "outbound";
        dataTypes: string[];
        tlpRestrictions: TLPLevel[];
        confidenceThreshold: number;
        sanitizationLevel: SanitizationLevel;
        autoShare: boolean;
        approvalRequired: boolean;
    };
};
/**
 * Default configuration for development
 */
export declare const DEFAULT_SHARING_CONFIG: {
    defaultTLP: TLPLevel;
    defaultSanitization: SanitizationLevel;
    minConfidenceForSharing: number;
    maxSharingAge: number;
    requireApproval: boolean;
    enableBidirectional: boolean;
    communityParticipation: boolean;
};
//# sourceMappingURL=threat-intelligence-sharing-kit.d.ts.map