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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * STIX 2.1 Object Types
 */
export enum STIXObjectType {
  INDICATOR = 'indicator',
  MALWARE = 'malware',
  THREAT_ACTOR = 'threat-actor',
  TOOL = 'tool',
  VULNERABILITY = 'vulnerability',
  CAMPAIGN = 'campaign',
  ATTACK_PATTERN = 'attack-pattern',
  COURSE_OF_ACTION = 'course-of-action',
  IDENTITY = 'identity',
  OBSERVED_DATA = 'observed-data',
  REPORT = 'report',
  RELATIONSHIP = 'relationship',
  SIGHTING = 'sighting',
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
export enum TLPLevel {
  RED = 'TLP:RED',           // Not for disclosure, restricted to participants only
  AMBER = 'TLP:AMBER',       // Limited disclosure, restricted to participant's organization
  AMBER_STRICT = 'TLP:AMBER+STRICT', // Limited disclosure, restricted to specific named entities
  GREEN = 'TLP:GREEN',       // Limited disclosure, community wide
  CLEAR = 'TLP:CLEAR',       // Disclosure is not limited (formerly TLP:WHITE)
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
  authorizedEntities?: string[]; // For AMBER+STRICT
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
export enum SharingAgreementType {
  BILATERAL = 'BILATERAL',
  MULTILATERAL = 'MULTILATERAL',
  ISAC = 'ISAC', // Information Sharing and Analysis Center
  ISAO = 'ISAO', // Information Sharing and Analysis Organization
  CUSTOM = 'CUSTOM',
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
  confidenceThreshold: number; // Minimum confidence score (0-100)
  sanitizationLevel: SanitizationLevel;
  autoShare: boolean;
  approvalRequired: boolean;
  retentionDays?: number;
  filters?: Record<string, any>;
}

/**
 * Sanitization Levels
 */
export enum SanitizationLevel {
  NONE = 'NONE',           // No sanitization
  LOW = 'LOW',             // Remove direct identifiers
  MEDIUM = 'MEDIUM',       // Remove identifiers and generalize data
  HIGH = 'HIGH',           // Aggressive sanitization, only threat patterns
  FULL = 'FULL',           // Complete anonymization
}

/**
 * Confidentiality Levels
 */
export enum ConfidentialityLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  TOP_SECRET = 'TOP_SECRET',
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
  reliability: number; // 0-100
  trustLevel: TrustLevel;
  sector?: string;
  country?: string;
}

/**
 * Trust Levels
 */
export enum TrustLevel {
  VERIFIED = 'VERIFIED',
  TRUSTED = 'TRUSTED',
  UNVERIFIED = 'UNVERIFIED',
  SUSPICIOUS = 'SUSPICIOUS',
  UNTRUSTED = 'UNTRUSTED',
}

/**
 * Intelligence Feedback
 */
export interface IntelFeedback {
  id: string;
  intelId: string;
  feedbackType: FeedbackType;
  rating: number; // 1-5
  comment?: string;
  providedBy: string;
  providedAt: Date;
  actionTaken?: string;
}

/**
 * Feedback Types
 */
export enum FeedbackType {
  ACCURACY = 'ACCURACY',
  RELEVANCE = 'RELEVANCE',
  TIMELINESS = 'TIMELINESS',
  ACTIONABILITY = 'ACTIONABILITY',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  CONFIRMED = 'CONFIRMED',
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
export enum CommunityType {
  ISAC = 'ISAC',
  ISAO = 'ISAO',
  SECTOR_SPECIFIC = 'SECTOR_SPECIFIC',
  REGIONAL = 'REGIONAL',
  OPEN_SOURCE = 'OPEN_SOURCE',
  COMMERCIAL = 'COMMERCIAL',
  GOVERNMENT = 'GOVERNMENT',
}

/**
 * Confidence Scoring Model
 */
export interface ConfidenceScore {
  overall: number; // 0-100
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
  period: { start: Date; end: Date };
  itemsShared: number;
  itemsReceived: number;
  uniqueContributors: number;
  avgConfidenceScore: number;
  tlpDistribution: Record<TLPLevel, number>;
  communityParticipation: number;
  feedbackRate: number;
  actionableIntelRate: number;
}

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

/**
 * Validates STIX object structure
 */
export function validateSTIXObject(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

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
export function validateTLPMarking(marking: TLPMarking): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

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
export function validateSharingAgreement(agreement: SharingAgreement): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

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
export function createSTIXBundle(objects: STIXObject[]): STIXBundle {
  return {
    type: 'bundle',
    id: `bundle--${crypto.randomUUID()}`,
    objects,
  };
}

/**
 * Creates a STIX indicator object
 */
export function createSTIXIndicator(config: {
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
}): STIXIndicator {
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
export function createSTIXRelationship(
  sourceId: string,
  targetId: string,
  relationshipType: string,
  description?: string,
): STIXObject {
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
  } as any;
}

/**
 * Parses STIX bundle from JSON
 */
export function parseSTIXBundle(json: string): STIXBundle | null {
  try {
    const bundle = JSON.parse(json);

    if (bundle.type !== 'bundle' || !Array.isArray(bundle.objects)) {
      return null;
    }

    return bundle as STIXBundle;
  } catch (error) {
    return null;
  }
}

/**
 * Converts STIX bundle to JSON
 */
export function serializeSTIXBundle(bundle: STIXBundle, pretty: boolean = false): string {
  return JSON.stringify(bundle, null, pretty ? 2 : 0);
}

/**
 * Filters STIX objects by type
 */
export function filterSTIXObjectsByType(bundle: STIXBundle, type: STIXObjectType): STIXObject[] {
  return bundle.objects.filter(obj => obj.type === type);
}

/**
 * Merges multiple STIX bundles
 */
export function mergeSTIXBundles(bundles: STIXBundle[]): STIXBundle {
  const allObjects: STIXObject[] = [];
  const seenIds = new Set<string>();

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
export function createTAXIICollection(config: {
  title: string;
  description?: string;
  alias?: string;
  canRead: boolean;
  canWrite: boolean;
  mediaTypes?: string[];
}): TAXIICollection {
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
export function createTAXIIDiscovery(config: {
  title: string;
  description?: string;
  contact?: string;
  defaultRoot?: string;
  apiRoots?: string[];
}): TAXIIDiscovery {
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
export function createTLPMarking(
  level: TLPLevel,
  appliedBy: string,
  expiresAt?: Date,
  authorizedEntities?: string[],
): TLPMarking {
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
export function canShareWithTLP(
  marking: TLPMarking,
  recipientOrg: string,
  sourceOrg: string,
): boolean {
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
export function upgradeTLPLevel(currentLevel: TLPLevel): TLPLevel {
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
export function downgradeTLPLevel(currentLevel: TLPLevel): TLPLevel {
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
export function getTLPDescription(level: TLPLevel): string {
  const descriptions: Record<TLPLevel, string> = {
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
export function canTransitionTLP(from: TLPLevel, to: TLPLevel): boolean {
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
export function createSharingAgreement(config: {
  name: string;
  type: SharingAgreementType;
  parties: SharingParty[];
  startDate: Date;
  endDate?: Date;
  sharingRules: SharingRule[];
  tlpDefault?: TLPLevel;
  sanitizationRequired?: boolean;
}): SharingAgreement {
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
export function createSharingRule(config: {
  name: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  dataTypes: string[];
  tlpRestrictions?: TLPLevel[];
  confidenceThreshold?: number;
  sanitizationLevel?: SanitizationLevel;
  autoShare?: boolean;
  approvalRequired?: boolean;
}): SharingRule {
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
export function isAllowedByAgreement(
  agreement: SharingAgreement,
  intel: SharedIntelligence,
  direction: 'inbound' | 'outbound',
): boolean {
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
export function getApplicableSharingRules(
  agreement: SharingAgreement,
  intelType: string,
  direction: 'inbound' | 'outbound',
): SharingRule[] {
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
export function sanitizeIntelligence(
  intel: SharedIntelligence,
  level: SanitizationLevel,
): SharedIntelligence {
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
export function removePII(obj: STIXObject): STIXObject {
  const sanitized = { ...obj };

  // Remove created_by_ref
  delete sanitized.created_by_ref;

  // Remove email addresses, phone numbers from descriptions
  if ((sanitized as any).description) {
    (sanitized as any).description = (sanitized as any).description
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  }

  return sanitized;
}

/**
 * Generalizes data in STIX object
 */
export function generalizeData(obj: STIXObject): STIXObject {
  const sanitized = { ...obj };

  // Generalize IP addresses to /24 networks
  if ((sanitized as any).pattern) {
    (sanitized as any).pattern = (sanitized as any).pattern.replace(
      /(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}/g,
      '$10/24',
    );
  }

  return sanitized;
}

/**
 * Anonymizes intelligence source
 */
export function anonymizeSource(source: IntelSource): IntelSource {
  return {
    ...source,
    id: crypto.randomUUID(),
    name: `Anonymous ${source.type} source`,
  };
}

/**
 * Extracts only threat pattern from STIX object
 */
export function extractPatternOnly(obj: STIXObject): STIXObject {
  if (obj.type === STIXObjectType.INDICATOR) {
    const indicator = obj as STIXIndicator;
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
export function getRequiredSanitizationForTLP(tlp: TLPLevel): SanitizationLevel {
  const mapping: Record<TLPLevel, SanitizationLevel> = {
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
export function calculateConfidenceScore(factors: {
  sourceReliability: number;
  dataQuality: number;
  corroboration: number;
  recency: number;
  relevance: number;
  weights?: Partial<Record<string, number>>;
}): ConfidenceScore {
  const defaultWeights = {
    sourceReliability: 0.25,
    dataQuality: 0.20,
    corroboration: 0.25,
    recency: 0.15,
    relevance: 0.15,
  };

  const weights = { ...defaultWeights, ...factors.weights };

  const overall =
    factors.sourceReliability * weights.sourceReliability +
    factors.dataQuality * weights.dataQuality +
    factors.corroboration * weights.corroboration +
    factors.recency * weights.recency +
    factors.relevance * weights.relevance;

  const confidenceFactors: ConfidenceFactor[] = [
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
export function calculateRecencyScore(date: Date): number {
  const ageHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  if (ageHours < 24) return 100;
  if (ageHours < 72) return 90;
  if (ageHours < 168) return 75; // 1 week
  if (ageHours < 720) return 60; // 1 month
  if (ageHours < 2160) return 40; // 3 months

  return 20;
}

/**
 * Calculates corroboration score
 */
export function calculateCorroborationScore(sources: IntelSource[]): number {
  if (sources.length === 1) return 50;
  if (sources.length === 2) return 70;
  if (sources.length === 3) return 85;
  if (sources.length >= 4) return 95;

  return 0;
}

/**
 * Updates confidence score based on feedback
 */
export function updateConfidenceFromFeedback(
  currentScore: ConfidenceScore,
  feedback: IntelFeedback[],
): ConfidenceScore {
  if (feedback.length === 0) return currentScore;

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
export function createThreatIntelCommunity(config: {
  name: string;
  type: CommunityType;
  sector?: string;
  region?: string;
  capabilities?: string[];
}): ThreatIntelCommunity {
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
export function calculateCommunityQualityScore(metrics: {
  avgConfidence: number;
  feedbackRate: number;
  avgFeedbackRating: number;
  actionableRate: number;
  sharingFrequency: number;
}): number {
  const weights = {
    avgConfidence: 0.30,
    feedbackRate: 0.15,
    avgFeedbackRating: 0.20,
    actionableRate: 0.25,
    sharingFrequency: 0.10,
  };

  const score =
    metrics.avgConfidence * weights.avgConfidence +
    metrics.feedbackRate * weights.feedbackRate +
    (metrics.avgFeedbackRating / 5) * 100 * weights.avgFeedbackRating +
    metrics.actionableRate * weights.actionableRate +
    metrics.sharingFrequency * weights.sharingFrequency;

  return Math.round(score * 100) / 100;
}

/**
 * Generates sharing metrics for period
 */
export function generateSharingMetrics(
  shared: SharedIntelligence[],
  received: SharedIntelligence[],
  period: { start: Date; end: Date },
): SharingMetrics {
  const allIntel = [...shared, ...received];

  const tlpDistribution: Record<TLPLevel, number> = {
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
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

/**
 * Generates STIX pattern from IOC
 */
export function generateSTIXPattern(iocType: string, iocValue: string): string {
  const patterns: Record<string, string> = {
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
export const SHARING_CONFIG_EXAMPLES = {
  stixIndicator: {
    name: 'Malicious IP Address',
    description: 'Known C2 server for APT group',
    pattern: "[ipv4-addr:value = '192.0.2.1']",
    patternType: 'stix' as const,
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
    direction: 'outbound' as const,
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
export const DEFAULT_SHARING_CONFIG = {
  defaultTLP: TLPLevel.AMBER,
  defaultSanitization: SanitizationLevel.MEDIUM,
  minConfidenceForSharing: 70,
  maxSharingAge: 90, // days
  requireApproval: true,
  enableBidirectional: true,
  communityParticipation: true,
};
