/**
 * LOC: THREATTIP1234567
 * File: /reuse/threat/threat-intelligence-platform-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence platform services
 *   - Intelligence aggregation modules
 *   - Threat data normalization services
 *   - Intelligence lifecycle management
 *   - Intelligence search and query services
 *   - STIX/TAXII integration modules
 */

/**
 * File: /reuse/threat/threat-intelligence-platform-kit.ts
 * Locator: WC-THREAT-INTEL-PLATFORM-001
 * Purpose: Core Threat Intelligence Platform - Production-ready TIP operations
 *
 * Upstream: Independent utility module for threat intelligence platform operations
 * Downstream: ../backend/*, TIP services, Intelligence aggregation, Data normalization, Lifecycle management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 45+ utility functions for intelligence aggregation, normalization, lifecycle, search, validation, enrichment
 *
 * LLM Context: Enterprise-grade threat intelligence platform for White Cross healthcare platform.
 * Provides comprehensive TIP architecture with intelligence aggregation from multiple sources, threat data
 * normalization, intelligence lifecycle management, advanced search and query capabilities, intelligence
 * aging and expiration, priority-based processing, validation and enrichment. Competes with Anomali and
 * Recorded Future with HIPAA-compliant implementations for healthcare security.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Threat Intelligence Platform configuration
 */
export interface TIPConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  sources: IntelligenceSource[];
  normalizationRules: NormalizationRule[];
  enrichmentServices: EnrichmentService[];
  retentionPolicy: RetentionPolicy;
  priorityRules: PriorityRule[];
  metadata?: Record<string, any>;
}

/**
 * Intelligence source configuration
 */
export interface IntelligenceSource {
  id: string;
  name: string;
  type: SourceType;
  provider: string;
  url?: string;
  apiKey?: string;
  enabled: boolean;
  priority: number;
  reliability: ReliabilityRating;
  updateInterval: number; // milliseconds
  lastSync?: Date;
  metadata?: Record<string, any>;
}

/**
 * Source types
 */
export enum SourceType {
  COMMERCIAL_FEED = 'COMMERCIAL_FEED',
  OPEN_SOURCE = 'OPEN_SOURCE',
  GOVERNMENT = 'GOVERNMENT',
  COMMUNITY = 'COMMUNITY',
  INTERNAL = 'INTERNAL',
  SHARING_COMMUNITY = 'SHARING_COMMUNITY',
  DARK_WEB = 'DARK_WEB',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
}

/**
 * Source reliability ratings
 */
export enum ReliabilityRating {
  A_COMPLETELY_RELIABLE = 'A_COMPLETELY_RELIABLE',
  B_USUALLY_RELIABLE = 'B_USUALLY_RELIABLE',
  C_FAIRLY_RELIABLE = 'C_FAIRLY_RELIABLE',
  D_NOT_USUALLY_RELIABLE = 'D_NOT_USUALLY_RELIABLE',
  E_UNRELIABLE = 'E_UNRELIABLE',
  F_RELIABILITY_UNKNOWN = 'F_RELIABILITY_UNKNOWN',
}

/**
 * Threat intelligence entry
 */
export interface ThreatIntelligence {
  id: string;
  type: IntelligenceType;
  title: string;
  description: string;
  severity: ThreatSeverity;
  confidence: number; // 0-100
  tlp: TLPLevel;
  sourceId: string;
  sourceReliability: ReliabilityRating;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  validFrom: Date;
  validUntil?: Date;
  indicators: Indicator[];
  tags: string[];
  mitreAttack?: string[];
  killChain?: string[];
  references: Reference[];
  relatedIntelligence: string[];
  enrichment?: IntelligenceEnrichment;
  priority: IntelligencePriority;
  status: IntelligenceStatus;
  metadata?: Record<string, any>;
}

/**
 * Intelligence types
 */
export enum IntelligenceType {
  STRATEGIC = 'STRATEGIC',
  TACTICAL = 'TACTICAL',
  OPERATIONAL = 'OPERATIONAL',
  TECHNICAL = 'TECHNICAL',
}

/**
 * Threat severity levels
 */
export enum ThreatSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Traffic Light Protocol (TLP) levels
 */
export enum TLPLevel {
  RED = 'RED',
  AMBER = 'AMBER',
  GREEN = 'GREEN',
  WHITE = 'WHITE',
}

/**
 * Intelligence priority
 */
export enum IntelligencePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Intelligence status
 */
export enum IntelligenceStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DEPRECATED = 'DEPRECATED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

/**
 * Indicator structure
 */
export interface Indicator {
  id: string;
  type: IndicatorType;
  value: string;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  metadata?: Record<string, any>;
}

/**
 * Indicator types
 */
export enum IndicatorType {
  IPV4 = 'IPV4',
  IPV6 = 'IPV6',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FILE_HASH = 'FILE_HASH',
  CVE = 'CVE',
  YARA_RULE = 'YARA_RULE',
  REGISTRY_KEY = 'REGISTRY_KEY',
  MUTEX = 'MUTEX',
}

/**
 * Reference information
 */
export interface Reference {
  type: ReferenceType;
  url: string;
  title?: string;
  description?: string;
}

/**
 * Reference types
 */
export enum ReferenceType {
  REPORT = 'REPORT',
  ARTICLE = 'ARTICLE',
  ADVISORY = 'ADVISORY',
  BLOG = 'BLOG',
  RESEARCH = 'RESEARCH',
  CVE = 'CVE',
}

/**
 * Intelligence enrichment data
 */
export interface IntelligenceEnrichment {
  geolocation?: GeolocationData;
  whois?: WhoisData;
  reputation?: ReputationData;
  malwareAnalysis?: MalwareAnalysisData;
  threatActors?: string[];
  campaigns?: string[];
  enrichedAt: Date;
  enrichmentSources: string[];
}

/**
 * Geolocation data
 */
export interface GeolocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  isp?: string;
}

/**
 * WHOIS data
 */
export interface WhoisData {
  registrar?: string;
  createdDate?: Date;
  expiresDate?: Date;
  updatedDate?: Date;
  nameServers?: string[];
  registrantOrg?: string;
}

/**
 * Reputation data
 */
export interface ReputationData {
  score: number; // 0-100
  category: string;
  threatTypes: string[];
  lastChecked: Date;
  sources: string[];
}

/**
 * Malware analysis data
 */
export interface MalwareAnalysisData {
  family?: string;
  variant?: string;
  capabilities?: string[];
  signatures?: string[];
  behavior?: string[];
}

/**
 * Normalization rule
 */
export interface NormalizationRule {
  id: string;
  name: string;
  description: string;
  sourceType: SourceType;
  fieldMappings: FieldMapping[];
  transformations: Transformation[];
  enabled: boolean;
}

/**
 * Field mapping
 */
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  required: boolean;
  defaultValue?: any;
}

/**
 * Data transformation
 */
export interface Transformation {
  field: string;
  type: TransformationType;
  parameters?: Record<string, any>;
}

/**
 * Transformation types
 */
export enum TransformationType {
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
  TRIM = 'TRIM',
  PARSE_DATE = 'PARSE_DATE',
  EXTRACT_DOMAIN = 'EXTRACT_DOMAIN',
  NORMALIZE_IP = 'NORMALIZE_IP',
  HASH = 'HASH',
  DEFANG = 'DEFANG',
}

/**
 * Enrichment service configuration
 */
export interface EnrichmentService {
  id: string;
  name: string;
  type: EnrichmentType;
  url: string;
  apiKey?: string;
  enabled: boolean;
  priority: number;
  rateLimit?: number;
  timeout?: number;
}

/**
 * Enrichment types
 */
export enum EnrichmentType {
  GEOLOCATION = 'GEOLOCATION',
  WHOIS = 'WHOIS',
  REPUTATION = 'REPUTATION',
  MALWARE_ANALYSIS = 'MALWARE_ANALYSIS',
  PASSIVE_DNS = 'PASSIVE_DNS',
  THREAT_ACTOR = 'THREAT_ACTOR',
}

/**
 * Retention policy
 */
export interface RetentionPolicy {
  defaultRetention: number; // milliseconds
  retentionBySeverity: Record<ThreatSeverity, number>;
  archiveExpired: boolean;
  purgeAfter?: number; // milliseconds after expiration
}

/**
 * Priority rule
 */
export interface PriorityRule {
  id: string;
  name: string;
  conditions: PriorityCondition[];
  priority: IntelligencePriority;
  enabled: boolean;
}

/**
 * Priority condition
 */
export interface PriorityCondition {
  field: string;
  operator: string;
  value: any;
}

/**
 * Intelligence query
 */
export interface IntelligenceQuery {
  keywords?: string[];
  indicatorTypes?: IndicatorType[];
  severities?: ThreatSeverity[];
  sources?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tlp?: TLPLevel[];
  status?: IntelligenceStatus[];
  limit?: number;
  offset?: number;
}

/**
 * Intelligence search result
 */
export interface IntelligenceSearchResult {
  total: number;
  results: ThreatIntelligence[];
  aggregations?: Record<string, any>;
  took: number; // milliseconds
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: ValidationIssue[];
  validatedAt: Date;
  validatedBy: string;
}

/**
 * Validation issue
 */
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize ThreatIntelligence model attributes.
 *
 * @example
 * ```typescript
 * class ThreatIntelligence extends Model {}
 * ThreatIntelligence.init(getThreatIntelligenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_intelligence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['type', 'severity'] },
 *     { fields: ['status'] },
 *     { fields: ['priority'] }
 *   ]
 * });
 * ```
 */
export const getThreatIntelligenceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  tlp: {
    type: 'STRING',
    allowNull: false,
  },
  sourceId: {
    type: 'UUID',
    allowNull: false,
  },
  sourceReliability: {
    type: 'STRING',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
  validFrom: {
    type: 'DATE',
    allowNull: false,
  },
  validUntil: {
    type: 'DATE',
    allowNull: true,
  },
  indicators: {
    type: 'JSONB',
    defaultValue: [],
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  killChain: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  references: {
    type: 'JSONB',
    defaultValue: [],
  },
  relatedIntelligence: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  enrichment: {
    type: 'JSONB',
    allowNull: true,
  },
  priority: {
    type: 'STRING',
    allowNull: false,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'PENDING_VALIDATION',
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize IntelligenceSource model attributes.
 *
 * @example
 * ```typescript
 * class IntelligenceSource extends Model {}
 * IntelligenceSource.init(getIntelligenceSourceModelAttributes(), {
 *   sequelize,
 *   tableName: 'intelligence_sources',
 *   timestamps: true
 * });
 * ```
 */
export const getIntelligenceSourceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  provider: {
    type: 'STRING',
    allowNull: false,
  },
  url: {
    type: 'STRING',
    allowNull: true,
  },
  apiKey: {
    type: 'STRING',
    allowNull: true,
  },
  enabled: {
    type: 'BOOLEAN',
    allowNull: false,
    defaultValue: true,
  },
  priority: {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 5,
  },
  reliability: {
    type: 'STRING',
    allowNull: false,
  },
  updateInterval: {
    type: 'INTEGER',
    allowNull: false,
  },
  lastSync: {
    type: 'DATE',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize EnrichmentCache model attributes.
 *
 * @example
 * ```typescript
 * class EnrichmentCache extends Model {}
 * EnrichmentCache.init(getEnrichmentCacheModelAttributes(), {
 *   sequelize,
 *   tableName: 'enrichment_cache',
 *   timestamps: true
 * });
 * ```
 */
export const getEnrichmentCacheModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  indicatorType: {
    type: 'STRING',
    allowNull: false,
  },
  indicatorValue: {
    type: 'STRING',
    allowNull: false,
  },
  enrichmentType: {
    type: 'STRING',
    allowNull: false,
  },
  enrichmentData: {
    type: 'JSONB',
    allowNull: false,
  },
  enrichedAt: {
    type: 'DATE',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: false,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize IntelligenceValidation model attributes.
 *
 * @example
 * ```typescript
 * class IntelligenceValidation extends Model {}
 * IntelligenceValidation.init(getIntelligenceValidationModelAttributes(), {
 *   sequelize,
 *   tableName: 'intelligence_validations',
 *   timestamps: true
 * });
 * ```
 */
export const getIntelligenceValidationModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  intelligenceId: {
    type: 'UUID',
    allowNull: false,
  },
  isValid: {
    type: 'BOOLEAN',
    allowNull: false,
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
  },
  issues: {
    type: 'JSONB',
    defaultValue: [],
  },
  validatedAt: {
    type: 'DATE',
    allowNull: false,
  },
  validatedBy: {
    type: 'STRING',
    allowNull: false,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// INTELLIGENCE AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregates intelligence from multiple sources.
 *
 * @param {IntelligenceSource[]} sources - Intelligence sources
 * @param {object} [options] - Aggregation options
 * @returns {Promise<ThreatIntelligence[]>} Aggregated intelligence
 *
 * @example
 * ```typescript
 * const sources = [commercialFeed, openSourceFeed, internalFeed];
 * const intelligence = await aggregateIntelligence(sources, { deduplication: true });
 * ```
 */
export const aggregateIntelligence = async (
  sources: IntelligenceSource[],
  options?: {
    deduplication?: boolean;
    minReliability?: ReliabilityRating;
    maxAge?: number; // milliseconds
  }
): Promise<ThreatIntelligence[]> => {
  const aggregated: ThreatIntelligence[] = [];
  const intelligenceMap = new Map<string, ThreatIntelligence>();

  const enabledSources = sources
    .filter(s => s.enabled)
    .sort((a, b) => a.priority - b.priority);

  for (const source of enabledSources) {
    try {
      // Fetch intelligence from source
      const sourceIntelligence = await fetchIntelligenceFromSource(source);

      for (const intel of sourceIntelligence) {
        // Apply reliability filter
        if (options?.minReliability) {
          const reliabilityOrder = [
            ReliabilityRating.A_COMPLETELY_RELIABLE,
            ReliabilityRating.B_USUALLY_RELIABLE,
            ReliabilityRating.C_FAIRLY_RELIABLE,
            ReliabilityRating.D_NOT_USUALLY_RELIABLE,
            ReliabilityRating.E_UNRELIABLE,
            ReliabilityRating.F_RELIABILITY_UNKNOWN,
          ];

          const sourceReliabilityIdx = reliabilityOrder.indexOf(source.reliability);
          const minReliabilityIdx = reliabilityOrder.indexOf(options.minReliability);

          if (sourceReliabilityIdx > minReliabilityIdx) continue;
        }

        // Apply age filter
        if (options?.maxAge) {
          const age = Date.now() - intel.createdAt.getTime();
          if (age > options.maxAge) continue;
        }

        // Deduplication
        const key = generateIntelligenceKey(intel);
        if (options?.deduplication && intelligenceMap.has(key)) {
          const existing = intelligenceMap.get(key)!;
          // Merge intelligence entries
          intelligenceMap.set(key, mergeIntelligence(existing, intel));
        } else {
          intelligenceMap.set(key, intel);
        }
      }
    } catch (error) {
      console.error(`Failed to aggregate from source ${source.name}:`, error);
    }
  }

  return Array.from(intelligenceMap.values());
};

/**
 * Fetches intelligence from a single source.
 *
 * @param {IntelligenceSource} source - Intelligence source
 * @returns {Promise<ThreatIntelligence[]>} Fetched intelligence
 *
 * @example
 * ```typescript
 * const intelligence = await fetchIntelligenceFromSource(commercialFeed);
 * ```
 */
export const fetchIntelligenceFromSource = async (
  source: IntelligenceSource
): Promise<ThreatIntelligence[]> => {
  if (!source.enabled) {
    throw new Error(`Source ${source.name} is disabled`);
  }

  // Simulate fetching (in production, implement actual API calls)
  const intelligence: ThreatIntelligence[] = [];

  // Placeholder implementation
  // In production, this would make HTTP requests to the source API

  return intelligence;
};

/**
 * Generates a unique key for intelligence entry.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @returns {string} Unique key
 */
const generateIntelligenceKey = (intel: ThreatIntelligence): string => {
  const indicatorValues = intel.indicators.map(i => i.value).sort().join('|');
  return crypto
    .createHash('sha256')
    .update(`${intel.title}|${indicatorValues}`)
    .digest('hex');
};

/**
 * Merges two intelligence entries.
 *
 * @param {ThreatIntelligence} existing - Existing intelligence
 * @param {ThreatIntelligence} newIntel - New intelligence
 * @returns {ThreatIntelligence} Merged intelligence
 */
const mergeIntelligence = (
  existing: ThreatIntelligence,
  newIntel: ThreatIntelligence
): ThreatIntelligence => {
  return {
    ...existing,
    confidence: Math.max(existing.confidence, newIntel.confidence),
    severity: getHigherSeverity(existing.severity, newIntel.severity),
    updatedAt: new Date(),
    indicators: mergeIndicators(existing.indicators, newIntel.indicators),
    tags: [...new Set([...existing.tags, ...newIntel.tags])],
    references: [...existing.references, ...newIntel.references],
    relatedIntelligence: [
      ...new Set([...existing.relatedIntelligence, newIntel.id]),
    ],
  };
};

/**
 * Returns higher severity level.
 *
 * @param {ThreatSeverity} s1 - First severity
 * @param {ThreatSeverity} s2 - Second severity
 * @returns {ThreatSeverity} Higher severity
 */
const getHigherSeverity = (
  s1: ThreatSeverity,
  s2: ThreatSeverity
): ThreatSeverity => {
  const order = [
    ThreatSeverity.INFO,
    ThreatSeverity.LOW,
    ThreatSeverity.MEDIUM,
    ThreatSeverity.HIGH,
    ThreatSeverity.CRITICAL,
  ];
  return order.indexOf(s1) > order.indexOf(s2) ? s1 : s2;
};

/**
 * Merges indicator arrays.
 *
 * @param {Indicator[]} existing - Existing indicators
 * @param {Indicator[]} newIndicators - New indicators
 * @returns {Indicator[]} Merged indicators
 */
const mergeIndicators = (
  existing: Indicator[],
  newIndicators: Indicator[]
): Indicator[] => {
  const indicatorMap = new Map<string, Indicator>();

  existing.forEach(ind => {
    const key = `${ind.type}:${ind.value}`;
    indicatorMap.set(key, ind);
  });

  newIndicators.forEach(ind => {
    const key = `${ind.type}:${ind.value}`;
    if (indicatorMap.has(key)) {
      const existingInd = indicatorMap.get(key)!;
      indicatorMap.set(key, {
        ...existingInd,
        confidence: Math.max(existingInd.confidence, ind.confidence),
        lastSeen: new Date(
          Math.max(existingInd.lastSeen.getTime(), ind.lastSeen.getTime())
        ),
      });
    } else {
      indicatorMap.set(key, ind);
    }
  });

  return Array.from(indicatorMap.values());
};

/**
 * Synchronizes intelligence from all configured sources.
 *
 * @param {IntelligenceSource[]} sources - Sources to synchronize
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const results = await synchronizeIntelligenceSources(allSources);
 * console.log(`Synced ${results.totalIntelligence} intelligence entries`);
 * ```
 */
export const synchronizeIntelligenceSources = async (
  sources: IntelligenceSource[]
): Promise<{
  totalIntelligence: number;
  bySource: Record<string, number>;
  errors: string[];
}> => {
  const results = {
    totalIntelligence: 0,
    bySource: {} as Record<string, number>,
    errors: [] as string[],
  };

  for (const source of sources.filter(s => s.enabled)) {
    try {
      const intelligence = await fetchIntelligenceFromSource(source);
      results.totalIntelligence += intelligence.length;
      results.bySource[source.name] = intelligence.length;

      // Update last sync time
      source.lastSync = new Date();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`${source.name}: ${errorMsg}`);
    }
  }

  return results;
};

/**
 * Filters intelligence based on criteria.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to filter
 * @param {object} criteria - Filter criteria
 * @returns {ThreatIntelligence[]} Filtered intelligence
 *
 * @example
 * ```typescript
 * const filtered = filterIntelligence(allIntelligence, {
 *   minSeverity: ThreatSeverity.HIGH,
 *   minConfidence: 80
 * });
 * ```
 */
export const filterIntelligence = (
  intelligence: ThreatIntelligence[],
  criteria: {
    minSeverity?: ThreatSeverity;
    minConfidence?: number;
    types?: IntelligenceType[];
    statuses?: IntelligenceStatus[];
    tlp?: TLPLevel[];
  }
): ThreatIntelligence[] => {
  return intelligence.filter(intel => {
    // Severity filter
    if (criteria.minSeverity) {
      const severityOrder = [
        ThreatSeverity.INFO,
        ThreatSeverity.LOW,
        ThreatSeverity.MEDIUM,
        ThreatSeverity.HIGH,
        ThreatSeverity.CRITICAL,
      ];
      const intelSeverityIdx = severityOrder.indexOf(intel.severity);
      const minSeverityIdx = severityOrder.indexOf(criteria.minSeverity);

      if (intelSeverityIdx < minSeverityIdx) return false;
    }

    // Confidence filter
    if (criteria.minConfidence && intel.confidence < criteria.minConfidence) {
      return false;
    }

    // Type filter
    if (criteria.types && !criteria.types.includes(intel.type)) {
      return false;
    }

    // Status filter
    if (criteria.statuses && !criteria.statuses.includes(intel.status)) {
      return false;
    }

    // TLP filter
    if (criteria.tlp && !criteria.tlp.includes(intel.tlp)) {
      return false;
    }

    return true;
  });
};

// ============================================================================
// DATA NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalizes threat data from different sources to common format.
 *
 * @param {any} rawData - Raw threat data
 * @param {NormalizationRule} rule - Normalization rule
 * @returns {ThreatIntelligence} Normalized intelligence
 *
 * @example
 * ```typescript
 * const normalized = normalizeThreatData(rawFeedData, normalizationRule);
 * ```
 */
export const normalizeThreatData = (
  rawData: any,
  rule: NormalizationRule
): ThreatIntelligence => {
  if (!rule.enabled) {
    throw new Error('Normalization rule is disabled');
  }

  // Apply field mappings
  const mappedData: any = {};
  rule.fieldMappings.forEach(mapping => {
    let value = rawData[mapping.sourceField];

    if (value === undefined || value === null) {
      if (mapping.required) {
        throw new Error(`Required field ${mapping.sourceField} is missing`);
      }
      value = mapping.defaultValue;
    }

    mappedData[mapping.targetField] = value;
  });

  // Apply transformations
  rule.transformations.forEach(transform => {
    if (mappedData[transform.field] !== undefined) {
      mappedData[transform.field] = applyTransformation(
        mappedData[transform.field],
        transform
      );
    }
  });

  // Create normalized intelligence entry
  return {
    id: mappedData.id || crypto.randomUUID(),
    type: mappedData.type || IntelligenceType.TECHNICAL,
    title: mappedData.title || 'Untitled Intelligence',
    description: mappedData.description || '',
    severity: mappedData.severity || ThreatSeverity.MEDIUM,
    confidence: mappedData.confidence || 50,
    tlp: mappedData.tlp || TLPLevel.WHITE,
    sourceId: mappedData.sourceId,
    sourceReliability: mappedData.sourceReliability || ReliabilityRating.F_RELIABILITY_UNKNOWN,
    createdAt: mappedData.createdAt || new Date(),
    updatedAt: new Date(),
    validFrom: mappedData.validFrom || new Date(),
    validUntil: mappedData.validUntil,
    expiresAt: mappedData.expiresAt,
    indicators: mappedData.indicators || [],
    tags: mappedData.tags || [],
    mitreAttack: mappedData.mitreAttack || [],
    killChain: mappedData.killChain || [],
    references: mappedData.references || [],
    relatedIntelligence: mappedData.relatedIntelligence || [],
    priority: mappedData.priority || IntelligencePriority.MEDIUM,
    status: mappedData.status || IntelligenceStatus.PENDING_VALIDATION,
    metadata: mappedData.metadata || {},
  };
};

/**
 * Applies a transformation to a value.
 *
 * @param {any} value - Value to transform
 * @param {Transformation} transform - Transformation to apply
 * @returns {any} Transformed value
 */
const applyTransformation = (value: any, transform: Transformation): any => {
  switch (transform.type) {
    case TransformationType.UPPERCASE:
      return String(value).toUpperCase();
    case TransformationType.LOWERCASE:
      return String(value).toLowerCase();
    case TransformationType.TRIM:
      return String(value).trim();
    case TransformationType.PARSE_DATE:
      return new Date(value);
    case TransformationType.EXTRACT_DOMAIN:
      return extractDomain(String(value));
    case TransformationType.NORMALIZE_IP:
      return normalizeIP(String(value));
    case TransformationType.HASH:
      return crypto.createHash('sha256').update(String(value)).digest('hex');
    case TransformationType.DEFANG:
      return defangIndicator(String(value));
    default:
      return value;
  }
};

/**
 * Extracts domain from URL or email.
 *
 * @param {string} value - URL or email
 * @returns {string} Extracted domain
 */
const extractDomain = (value: string): string => {
  if (value.includes('@')) {
    return value.split('@')[1];
  }
  try {
    const url = new URL(value.startsWith('http') ? value : `http://${value}`);
    return url.hostname;
  } catch {
    return value;
  }
};

/**
 * Normalizes IP address format.
 *
 * @param {string} ip - IP address
 * @returns {string} Normalized IP
 */
const normalizeIP = (ip: string): string => {
  return ip.trim().toLowerCase();
};

/**
 * Defangs indicators to prevent accidental clicks.
 *
 * @param {string} indicator - Indicator to defang
 * @returns {string} Defanged indicator
 */
const defangIndicator = (indicator: string): string => {
  return indicator
    .replace(/\./g, '[.]')
    .replace(/http:/g, 'hxxp:')
    .replace(/https:/g, 'hxxps:')
    .replace(/@/g, '[@]');
};

/**
 * Batch normalizes multiple threat data entries.
 *
 * @param {any[]} rawDataArray - Array of raw data
 * @param {NormalizationRule} rule - Normalization rule
 * @returns {ThreatIntelligence[]} Normalized intelligence array
 *
 * @example
 * ```typescript
 * const normalized = batchNormalizeThreatData(rawDataArray, rule);
 * ```
 */
export const batchNormalizeThreatData = (
  rawDataArray: any[],
  rule: NormalizationRule
): ThreatIntelligence[] => {
  const normalized: ThreatIntelligence[] = [];

  for (const rawData of rawDataArray) {
    try {
      const intel = normalizeThreatData(rawData, rule);
      normalized.push(intel);
    } catch (error) {
      console.error('Failed to normalize data:', error);
    }
  }

  return normalized;
};

/**
 * Creates normalization rule from source schema.
 *
 * @param {SourceType} sourceType - Type of source
 * @param {object} schema - Source data schema
 * @returns {NormalizationRule} Generated normalization rule
 *
 * @example
 * ```typescript
 * const rule = createNormalizationRule(SourceType.COMMERCIAL_FEED, feedSchema);
 * ```
 */
export const createNormalizationRule = (
  sourceType: SourceType,
  schema: Record<string, any>
): NormalizationRule => {
  const fieldMappings: FieldMapping[] = Object.entries(schema).map(
    ([sourceField, config]) => ({
      sourceField,
      targetField: config.targetField || sourceField,
      required: config.required || false,
      defaultValue: config.defaultValue,
    })
  );

  return {
    id: crypto.randomUUID(),
    name: `${sourceType} Normalization`,
    description: `Auto-generated normalization rule for ${sourceType}`,
    sourceType,
    fieldMappings,
    transformations: [],
    enabled: true,
  };
};

// ============================================================================
// INTELLIGENCE LIFECYCLE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Manages intelligence lifecycle based on retention policy.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence entries
 * @param {RetentionPolicy} policy - Retention policy
 * @returns {object} Lifecycle management results
 *
 * @example
 * ```typescript
 * const results = manageIntelligenceLifecycle(allIntelligence, retentionPolicy);
 * console.log(`Expired: ${results.expired.length}, Archived: ${results.archived.length}`);
 * ```
 */
export const manageIntelligenceLifecycle = (
  intelligence: ThreatIntelligence[],
  policy: RetentionPolicy
): {
  active: ThreatIntelligence[];
  expired: ThreatIntelligence[];
  archived: ThreatIntelligence[];
  purged: string[];
} => {
  const now = Date.now();
  const results = {
    active: [] as ThreatIntelligence[],
    expired: [] as ThreatIntelligence[],
    archived: [] as ThreatIntelligence[],
    purged: [] as string[],
  };

  for (const intel of intelligence) {
    // Calculate expiration time
    const retentionPeriod =
      policy.retentionBySeverity[intel.severity] || policy.defaultRetention;
    const expiresAt = intel.expiresAt || new Date(intel.createdAt.getTime() + retentionPeriod);

    if (now > expiresAt.getTime()) {
      // Intelligence has expired
      if (policy.archiveExpired) {
        // Check if should be purged
        if (policy.purgeAfter) {
          const purgeTime = expiresAt.getTime() + policy.purgeAfter;
          if (now > purgeTime) {
            results.purged.push(intel.id);
          } else {
            results.archived.push({ ...intel, status: IntelligenceStatus.EXPIRED });
          }
        } else {
          results.archived.push({ ...intel, status: IntelligenceStatus.EXPIRED });
        }
      } else {
        results.expired.push({ ...intel, status: IntelligenceStatus.EXPIRED });
      }
    } else {
      results.active.push(intel);
    }
  }

  return results;
};

/**
 * Updates intelligence status based on age and validity.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @returns {ThreatIntelligence} Updated intelligence
 *
 * @example
 * ```typescript
 * const updated = updateIntelligenceStatus(intelligence);
 * ```
 */
export const updateIntelligenceStatus = (
  intel: ThreatIntelligence
): ThreatIntelligence => {
  const now = new Date();

  // Check if expired
  if (intel.expiresAt && now > intel.expiresAt) {
    return { ...intel, status: IntelligenceStatus.EXPIRED };
  }

  // Check validity period
  if (intel.validUntil && now > intel.validUntil) {
    return { ...intel, status: IntelligenceStatus.DEPRECATED };
  }

  if (intel.validFrom && now < intel.validFrom) {
    return { ...intel, status: IntelligenceStatus.PENDING_VALIDATION };
  }

  // If currently pending validation and within valid period
  if (
    intel.status === IntelligenceStatus.PENDING_VALIDATION &&
    now >= intel.validFrom
  ) {
    return { ...intel, status: IntelligenceStatus.ACTIVE };
  }

  return intel;
};

/**
 * Extends intelligence expiration time.
 *
 * @param {ThreatIntelligence} intel - Intelligence to extend
 * @param {number} extensionPeriod - Extension period in milliseconds
 * @returns {ThreatIntelligence} Extended intelligence
 *
 * @example
 * ```typescript
 * const extended = extendIntelligenceExpiration(intel, 7 * 24 * 60 * 60 * 1000); // 7 days
 * ```
 */
export const extendIntelligenceExpiration = (
  intel: ThreatIntelligence,
  extensionPeriod: number
): ThreatIntelligence => {
  const currentExpiration = intel.expiresAt || new Date();
  const newExpiration = new Date(currentExpiration.getTime() + extensionPeriod);

  return {
    ...intel,
    expiresAt: newExpiration,
    updatedAt: new Date(),
    metadata: {
      ...intel.metadata,
      expirationExtended: true,
      extensionDate: new Date().toISOString(),
    },
  };
};

/**
 * Archives expired intelligence.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to archive
 * @returns {object} Archive results
 *
 * @example
 * ```typescript
 * const results = archiveExpiredIntelligence(expiredIntelligence);
 * ```
 */
export const archiveExpiredIntelligence = (
  intelligence: ThreatIntelligence[]
): {
  archived: number;
  errors: string[];
} => {
  const results = {
    archived: 0,
    errors: [] as string[],
  };

  for (const intel of intelligence) {
    try {
      // In production, this would move to archive storage
      // For now, just update status
      intel.status = IntelligenceStatus.EXPIRED;
      results.archived++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Failed to archive ${intel.id}: ${errorMsg}`);
    }
  }

  return results;
};

// ============================================================================
// INTELLIGENCE SEARCH AND QUERY FUNCTIONS
// ============================================================================

/**
 * Searches threat intelligence based on query.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to search
 * @param {IntelligenceQuery} query - Search query
 * @returns {IntelligenceSearchResult} Search results
 *
 * @example
 * ```typescript
 * const results = await searchThreatIntelligence(allIntelligence, {
 *   keywords: ['ransomware', 'healthcare'],
 *   severities: [ThreatSeverity.HIGH, ThreatSeverity.CRITICAL]
 * });
 * ```
 */
export const searchThreatIntelligence = async (
  intelligence: ThreatIntelligence[],
  query: IntelligenceQuery
): Promise<IntelligenceSearchResult> => {
  const startTime = Date.now();
  let filtered = [...intelligence];

  // Keyword search
  if (query.keywords && query.keywords.length > 0) {
    filtered = filtered.filter(intel => {
      const searchText = `${intel.title} ${intel.description} ${intel.tags.join(' ')}`.toLowerCase();
      return query.keywords!.some(keyword =>
        searchText.includes(keyword.toLowerCase())
      );
    });
  }

  // Indicator type filter
  if (query.indicatorTypes && query.indicatorTypes.length > 0) {
    filtered = filtered.filter(intel =>
      intel.indicators.some(ind =>
        query.indicatorTypes!.includes(ind.type as IndicatorType)
      )
    );
  }

  // Severity filter
  if (query.severities && query.severities.length > 0) {
    filtered = filtered.filter(intel => query.severities!.includes(intel.severity));
  }

  // Source filter
  if (query.sources && query.sources.length > 0) {
    filtered = filtered.filter(intel => query.sources!.includes(intel.sourceId));
  }

  // Tag filter
  if (query.tags && query.tags.length > 0) {
    filtered = filtered.filter(intel =>
      query.tags!.some(tag => intel.tags.includes(tag))
    );
  }

  // Date range filter
  if (query.dateRange) {
    filtered = filtered.filter(intel => {
      const createdTime = intel.createdAt.getTime();
      return (
        createdTime >= query.dateRange!.start.getTime() &&
        createdTime <= query.dateRange!.end.getTime()
      );
    });
  }

  // TLP filter
  if (query.tlp && query.tlp.length > 0) {
    filtered = filtered.filter(intel => query.tlp!.includes(intel.tlp));
  }

  // Status filter
  if (query.status && query.status.length > 0) {
    filtered = filtered.filter(intel => query.status!.includes(intel.status));
  }

  // Apply pagination
  const offset = query.offset || 0;
  const limit = query.limit || 100;
  const paginatedResults = filtered.slice(offset, offset + limit);

  // Calculate aggregations
  const aggregations = calculateSearchAggregations(filtered);

  return {
    total: filtered.length,
    results: paginatedResults,
    aggregations,
    took: Date.now() - startTime,
  };
};

/**
 * Calculates search result aggregations.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence results
 * @returns {Record<string, any>} Aggregations
 */
const calculateSearchAggregations = (
  intelligence: ThreatIntelligence[]
): Record<string, any> => {
  const aggregations: Record<string, any> = {
    bySeverity: {},
    byType: {},
    byStatus: {},
    byTLP: {},
  };

  intelligence.forEach(intel => {
    // Severity aggregation
    aggregations.bySeverity[intel.severity] =
      (aggregations.bySeverity[intel.severity] || 0) + 1;

    // Type aggregation
    aggregations.byType[intel.type] =
      (aggregations.byType[intel.type] || 0) + 1;

    // Status aggregation
    aggregations.byStatus[intel.status] =
      (aggregations.byStatus[intel.status] || 0) + 1;

    // TLP aggregation
    aggregations.byTLP[intel.tlp] =
      (aggregations.byTLP[intel.tlp] || 0) + 1;
  });

  return aggregations;
};

/**
 * Performs advanced intelligence query with complex filters.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence database
 * @param {object} advancedQuery - Advanced query criteria
 * @returns {Promise<ThreatIntelligence[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await advancedIntelligenceQuery(intelligence, {
 *   booleanQuery: {
 *     must: [{ field: 'severity', value: 'CRITICAL' }],
 *     should: [{ field: 'tags', value: 'ransomware' }],
 *     mustNot: [{ field: 'status', value: 'EXPIRED' }]
 *   }
 * });
 * ```
 */
export const advancedIntelligenceQuery = async (
  intelligence: ThreatIntelligence[],
  advancedQuery: {
    booleanQuery?: {
      must?: Array<{ field: string; value: any }>;
      should?: Array<{ field: string; value: any }>;
      mustNot?: Array<{ field: string; value: any }>;
    };
    fuzzySearch?: {
      field: string;
      value: string;
      fuzziness?: number;
    };
    rangeQuery?: {
      field: string;
      gte?: any;
      lte?: any;
    };
  }
): Promise<ThreatIntelligence[]> => {
  let results = [...intelligence];

  // Boolean query
  if (advancedQuery.booleanQuery) {
    const { must, should, mustNot } = advancedQuery.booleanQuery;

    // MUST clauses (all must match)
    if (must && must.length > 0) {
      results = results.filter(intel =>
        must.every(clause => {
          const fieldValue = (intel as any)[clause.field];
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(clause.value);
          }
          return fieldValue === clause.value;
        })
      );
    }

    // SHOULD clauses (at least one must match)
    if (should && should.length > 0) {
      results = results.filter(intel =>
        should.some(clause => {
          const fieldValue = (intel as any)[clause.field];
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(clause.value);
          }
          return fieldValue === clause.value;
        })
      );
    }

    // MUST NOT clauses (none must match)
    if (mustNot && mustNot.length > 0) {
      results = results.filter(intel =>
        mustNot.every(clause => {
          const fieldValue = (intel as any)[clause.field];
          if (Array.isArray(fieldValue)) {
            return !fieldValue.includes(clause.value);
          }
          return fieldValue !== clause.value;
        })
      );
    }
  }

  // Fuzzy search
  if (advancedQuery.fuzzySearch) {
    const { field, value } = advancedQuery.fuzzySearch;
    results = results.filter(intel => {
      const fieldValue = String((intel as any)[field] || '').toLowerCase();
      const searchValue = value.toLowerCase();
      return fieldValue.includes(searchValue);
    });
  }

  // Range query
  if (advancedQuery.rangeQuery) {
    const { field, gte, lte } = advancedQuery.rangeQuery;
    results = results.filter(intel => {
      const fieldValue = (intel as any)[field];
      let matches = true;

      if (gte !== undefined && fieldValue < gte) matches = false;
      if (lte !== undefined && fieldValue > lte) matches = false;

      return matches;
    });
  }

  return results;
};

/**
 * Finds related intelligence based on indicators.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @param {ThreatIntelligence[]} allIntelligence - All intelligence
 * @returns {ThreatIntelligence[]} Related intelligence
 *
 * @example
 * ```typescript
 * const related = findRelatedIntelligence(currentIntel, allIntelligence);
 * ```
 */
export const findRelatedIntelligence = (
  intel: ThreatIntelligence,
  allIntelligence: ThreatIntelligence[]
): ThreatIntelligence[] => {
  const related: ThreatIntelligence[] = [];
  const intelIndicators = new Set(intel.indicators.map(i => `${i.type}:${i.value}`));

  for (const other of allIntelligence) {
    if (other.id === intel.id) continue;

    // Check for indicator overlap
    const otherIndicators = new Set(other.indicators.map(i => `${i.type}:${i.value}`));
    const overlap = [...intelIndicators].filter(ind => otherIndicators.has(ind));

    if (overlap.length > 0) {
      related.push(other);
    }

    // Check for tag similarity
    const tagOverlap = intel.tags.filter(tag => other.tags.includes(tag));
    if (tagOverlap.length >= 2 && !related.includes(other)) {
      related.push(other);
    }

    // Check for MITRE ATT&CK overlap
    if (intel.mitreAttack && other.mitreAttack) {
      const mitreOverlap = intel.mitreAttack.filter(t =>
        other.mitreAttack?.includes(t)
      );
      if (mitreOverlap.length > 0 && !related.includes(other)) {
        related.push(other);
      }
    }
  }

  return related;
};

// ============================================================================
// PRIORITY-BASED PROCESSING FUNCTIONS
// ============================================================================

/**
 * Applies priority rules to intelligence.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to prioritize
 * @param {PriorityRule[]} rules - Priority rules
 * @returns {ThreatIntelligence[]} Prioritized intelligence
 *
 * @example
 * ```typescript
 * const prioritized = applyPriorityRules(intelligence, priorityRules);
 * ```
 */
export const applyPriorityRules = (
  intelligence: ThreatIntelligence[],
  rules: PriorityRule[]
): ThreatIntelligence[] => {
  return intelligence.map(intel => {
    let highestPriority = IntelligencePriority.LOW;

    for (const rule of rules.filter(r => r.enabled)) {
      const matches = rule.conditions.every(condition => {
        const fieldValue = (intel as any)[condition.field];

        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'contains':
            return Array.isArray(fieldValue)
              ? fieldValue.includes(condition.value)
              : String(fieldValue).includes(String(condition.value));
          case 'greater_than':
            return Number(fieldValue) > Number(condition.value);
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
          default:
            return false;
        }
      });

      if (matches) {
        // Use highest matching priority
        const priorityOrder = [
          IntelligencePriority.LOW,
          IntelligencePriority.MEDIUM,
          IntelligencePriority.HIGH,
          IntelligencePriority.CRITICAL,
        ];

        const currentIdx = priorityOrder.indexOf(highestPriority);
        const ruleIdx = priorityOrder.indexOf(rule.priority);

        if (ruleIdx > currentIdx) {
          highestPriority = rule.priority;
        }
      }
    }

    return { ...intel, priority: highestPriority };
  });
};

/**
 * Sorts intelligence by priority and other factors.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to sort
 * @param {object} [options] - Sort options
 * @returns {ThreatIntelligence[]} Sorted intelligence
 *
 * @example
 * ```typescript
 * const sorted = sortIntelligenceByPriority(intelligence, { tiebreaker: 'confidence' });
 * ```
 */
export const sortIntelligenceByPriority = (
  intelligence: ThreatIntelligence[],
  options?: {
    tiebreaker?: 'confidence' | 'severity' | 'createdAt';
  }
): ThreatIntelligence[] => {
  const priorityOrder = [
    IntelligencePriority.CRITICAL,
    IntelligencePriority.HIGH,
    IntelligencePriority.MEDIUM,
    IntelligencePriority.LOW,
  ];

  const severityOrder = [
    ThreatSeverity.CRITICAL,
    ThreatSeverity.HIGH,
    ThreatSeverity.MEDIUM,
    ThreatSeverity.LOW,
    ThreatSeverity.INFO,
  ];

  return [...intelligence].sort((a, b) => {
    // Primary sort by priority
    const aPriorityIdx = priorityOrder.indexOf(a.priority);
    const bPriorityIdx = priorityOrder.indexOf(b.priority);

    if (aPriorityIdx !== bPriorityIdx) {
      return aPriorityIdx - bPriorityIdx;
    }

    // Tiebreaker
    if (options?.tiebreaker === 'confidence') {
      return b.confidence - a.confidence;
    } else if (options?.tiebreaker === 'severity') {
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    } else if (options?.tiebreaker === 'createdAt') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return 0;
  });
};

/**
 * Calculates priority score for intelligence.
 *
 * @param {ThreatIntelligence} intel - Intelligence entry
 * @returns {number} Priority score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculatePriorityScore(intelligence);
 * ```
 */
export const calculatePriorityScore = (
  intel: ThreatIntelligence
): number => {
  let score = 0;

  // Severity contribution (40%)
  const severityScores: Record<ThreatSeverity, number> = {
    [ThreatSeverity.CRITICAL]: 40,
    [ThreatSeverity.HIGH]: 30,
    [ThreatSeverity.MEDIUM]: 20,
    [ThreatSeverity.LOW]: 10,
    [ThreatSeverity.INFO]: 5,
  };
  score += severityScores[intel.severity] || 0;

  // Confidence contribution (30%)
  score += (intel.confidence / 100) * 30;

  // Priority contribution (20%)
  const priorityScores: Record<IntelligencePriority, number> = {
    [IntelligencePriority.CRITICAL]: 20,
    [IntelligencePriority.HIGH]: 15,
    [IntelligencePriority.MEDIUM]: 10,
    [IntelligencePriority.LOW]: 5,
  };
  score += priorityScores[intel.priority] || 0;

  // Freshness contribution (10%)
  const age = Date.now() - intel.createdAt.getTime();
  const daysSinceCreation = age / (1000 * 60 * 60 * 24);
  const freshnessScore = Math.max(0, 10 - daysSinceCreation);
  score += freshnessScore;

  return Math.min(100, Math.max(0, score));
};

// ============================================================================
// INTELLIGENCE VALIDATION AND ENRICHMENT FUNCTIONS
// ============================================================================

/**
 * Validates threat intelligence entry.
 *
 * @param {ThreatIntelligence} intel - Intelligence to validate
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateThreatIntelligence(intelligence);
 * if (!validation.isValid) {
 *   console.error('Validation issues:', validation.issues);
 * }
 * ```
 */
export const validateThreatIntelligence = async (
  intel: ThreatIntelligence
): Promise<ValidationResult> => {
  const issues: ValidationIssue[] = [];
  let confidence = 100;

  // Required fields validation
  if (!intel.title || intel.title.trim() === '') {
    issues.push({
      severity: 'error',
      field: 'title',
      message: 'Title is required',
    });
    confidence -= 20;
  }

  if (!intel.sourceId) {
    issues.push({
      severity: 'error',
      field: 'sourceId',
      message: 'Source ID is required',
    });
    confidence -= 15;
  }

  // Confidence range validation
  if (intel.confidence < 0 || intel.confidence > 100) {
    issues.push({
      severity: 'error',
      field: 'confidence',
      message: 'Confidence must be between 0 and 100',
      suggestion: 'Adjust confidence to valid range',
    });
    confidence -= 10;
  }

  // Indicator validation
  if (!intel.indicators || intel.indicators.length === 0) {
    issues.push({
      severity: 'warning',
      field: 'indicators',
      message: 'No indicators provided',
      suggestion: 'Add at least one indicator for actionable intelligence',
    });
    confidence -= 10;
  } else {
    // Validate each indicator
    intel.indicators.forEach((ind, idx) => {
      if (!ind.type || !ind.value) {
        issues.push({
          severity: 'error',
          field: `indicators[${idx}]`,
          message: 'Indicator must have type and value',
        });
        confidence -= 5;
      }
    });
  }

  // Date validation
  if (intel.validUntil && intel.validFrom > intel.validUntil) {
    issues.push({
      severity: 'error',
      field: 'validUntil',
      message: 'Valid until date must be after valid from date',
    });
    confidence -= 10;
  }

  // TLP validation
  if (!Object.values(TLPLevel).includes(intel.tlp)) {
    issues.push({
      severity: 'warning',
      field: 'tlp',
      message: 'Invalid TLP level',
      suggestion: 'Use standard TLP levels (RED, AMBER, GREEN, WHITE)',
    });
    confidence -= 5;
  }

  // Reference validation
  if (intel.references && intel.references.length > 0) {
    intel.references.forEach((ref, idx) => {
      if (!ref.url) {
        issues.push({
          severity: 'info',
          field: `references[${idx}]`,
          message: 'Reference missing URL',
        });
      }
    });
  }

  const isValid = !issues.some(issue => issue.severity === 'error');

  return {
    isValid,
    confidence: Math.max(0, confidence),
    issues,
    validatedAt: new Date(),
    validatedBy: 'system',
  };
};

/**
 * Enriches intelligence with additional context.
 *
 * @param {ThreatIntelligence} intel - Intelligence to enrich
 * @param {EnrichmentService[]} services - Enrichment services
 * @returns {Promise<ThreatIntelligence>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await enrichThreatIntelligence(intelligence, enrichmentServices);
 * ```
 */
export const enrichThreatIntelligence = async (
  intel: ThreatIntelligence,
  services: EnrichmentService[]
): Promise<ThreatIntelligence> => {
  const enrichment: IntelligenceEnrichment = {
    enrichedAt: new Date(),
    enrichmentSources: [],
  };

  const enabledServices = services
    .filter(s => s.enabled)
    .sort((a, b) => a.priority - b.priority);

  for (const service of enabledServices) {
    try {
      const serviceEnrichment = await performEnrichment(intel, service);

      if (serviceEnrichment) {
        // Merge enrichment data
        Object.assign(enrichment, serviceEnrichment);
        enrichment.enrichmentSources.push(service.name);
      }
    } catch (error) {
      console.error(`Enrichment failed for ${service.name}:`, error);
    }
  }

  return {
    ...intel,
    enrichment,
    updatedAt: new Date(),
  };
};

/**
 * Performs enrichment using a specific service.
 *
 * @param {ThreatIntelligence} intel - Intelligence to enrich
 * @param {EnrichmentService} service - Enrichment service
 * @returns {Promise<Partial<IntelligenceEnrichment> | null>} Enrichment data
 */
const performEnrichment = async (
  intel: ThreatIntelligence,
  service: EnrichmentService
): Promise<Partial<IntelligenceEnrichment> | null> => {
  // Placeholder for actual enrichment API calls
  // In production, this would call external enrichment services

  switch (service.type) {
    case EnrichmentType.GEOLOCATION:
      // Enrich IP indicators with geolocation
      return { geolocation: {} as GeolocationData };

    case EnrichmentType.WHOIS:
      // Enrich domain indicators with WHOIS
      return { whois: {} as WhoisData };

    case EnrichmentType.REPUTATION:
      // Enrich with reputation data
      return { reputation: {} as ReputationData };

    case EnrichmentType.MALWARE_ANALYSIS:
      // Enrich with malware analysis
      return { malwareAnalysis: {} as MalwareAnalysisData };

    default:
      return null;
  }
};

/**
 * Batch enriches multiple intelligence entries.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to enrich
 * @param {EnrichmentService[]} services - Enrichment services
 * @returns {Promise<ThreatIntelligence[]>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await batchEnrichIntelligence(intelligenceArray, services);
 * ```
 */
export const batchEnrichIntelligence = async (
  intelligence: ThreatIntelligence[],
  services: EnrichmentService[]
): Promise<ThreatIntelligence[]> => {
  const enriched: ThreatIntelligence[] = [];

  for (const intel of intelligence) {
    try {
      const enrichedIntel = await enrichThreatIntelligence(intel, services);
      enriched.push(enrichedIntel);
    } catch (error) {
      console.error(`Failed to enrich intelligence ${intel.id}:`, error);
      enriched.push(intel); // Add original if enrichment fails
    }
  }

  return enriched;
};

/**
 * Caches enrichment data for reuse.
 *
 * @param {string} indicatorType - Type of indicator
 * @param {string} indicatorValue - Indicator value
 * @param {string} enrichmentType - Type of enrichment
 * @param {any} enrichmentData - Enrichment data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {object} Cache entry
 *
 * @example
 * ```typescript
 * const cached = cacheEnrichmentData('IPV4', '192.168.1.1', 'GEOLOCATION', geoData, 3600000);
 * ```
 */
export const cacheEnrichmentData = (
  indicatorType: string,
  indicatorValue: string,
  enrichmentType: string,
  enrichmentData: any,
  ttl: number = 3600000 // 1 hour default
): {
  id: string;
  indicatorType: string;
  indicatorValue: string;
  enrichmentType: string;
  enrichmentData: any;
  enrichedAt: Date;
  expiresAt: Date;
} => {
  return {
    id: crypto.randomUUID(),
    indicatorType,
    indicatorValue,
    enrichmentType,
    enrichmentData,
    enrichedAt: new Date(),
    expiresAt: new Date(Date.now() + ttl),
  };
};

/**
 * Retrieves cached enrichment data.
 *
 * @param {string} indicatorType - Type of indicator
 * @param {string} indicatorValue - Indicator value
 * @param {string} enrichmentType - Type of enrichment
 * @param {any[]} cache - Enrichment cache
 * @returns {any | null} Cached data or null
 *
 * @example
 * ```typescript
 * const cached = getCachedEnrichment('IPV4', '192.168.1.1', 'GEOLOCATION', enrichmentCache);
 * ```
 */
export const getCachedEnrichment = (
  indicatorType: string,
  indicatorValue: string,
  enrichmentType: string,
  cache: any[]
): any | null => {
  const entry = cache.find(
    c =>
      c.indicatorType === indicatorType &&
      c.indicatorValue === indicatorValue &&
      c.enrichmentType === enrichmentType &&
      new Date(c.expiresAt) > new Date()
  );

  return entry ? entry.enrichmentData : null;
};

/**
 * Exports threat intelligence in various formats.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const exported = exportThreatIntelligence(intelligence, 'stix');
 * ```
 */
export const exportThreatIntelligence = (
  intelligence: ThreatIntelligence[],
  format: 'json' | 'csv' | 'stix' | 'misp'
): string => {
  if (format === 'json') {
    return JSON.stringify(intelligence, null, 2);
  } else if (format === 'csv') {
    // Simplified CSV export
    const headers = ['ID', 'Title', 'Severity', 'Confidence', 'Type', 'Status', 'Created'];
    const rows = intelligence.map(intel => [
      intel.id,
      intel.title,
      intel.severity,
      intel.confidence.toString(),
      intel.type,
      intel.status,
      intel.createdAt.toISOString(),
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  } else if (format === 'stix') {
    // Simplified STIX 2.1 export
    const stixBundle = {
      type: 'bundle',
      id: `bundle--${crypto.randomUUID()}`,
      objects: intelligence.map(intel => ({
        type: 'indicator',
        id: `indicator--${intel.id}`,
        created: intel.createdAt.toISOString(),
        modified: intel.updatedAt.toISOString(),
        name: intel.title,
        description: intel.description,
        pattern: intel.indicators.map(i => `[${i.type}:value = '${i.value}']`).join(' OR '),
        valid_from: intel.validFrom.toISOString(),
        labels: intel.tags,
      })),
    };

    return JSON.stringify(stixBundle, null, 2);
  }

  return JSON.stringify(intelligence, null, 2);
};

/**
 * Imports threat intelligence from external formats.
 *
 * @param {string} data - Data to import
 * @param {string} format - Import format
 * @returns {ThreatIntelligence[]} Imported intelligence
 *
 * @example
 * ```typescript
 * const imported = importThreatIntelligence(stixData, 'stix');
 * ```
 */
export const importThreatIntelligence = (
  data: string,
  format: 'json' | 'csv' | 'stix' | 'misp'
): ThreatIntelligence[] => {
  if (format === 'json') {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  // For other formats, return placeholder
  // In production, implement proper parsing
  return [];
};

/**
 * Deduplicates intelligence entries based on similarity.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to deduplicate
 * @param {object} [options] - Deduplication options
 * @returns {ThreatIntelligence[]} Deduplicated intelligence
 *
 * @example
 * ```typescript
 * const deduplicated = deduplicateIntelligence(allIntelligence, { threshold: 0.8 });
 * ```
 */
export const deduplicateIntelligence = (
  intelligence: ThreatIntelligence[],
  options?: {
    threshold?: number; // Similarity threshold (0-1)
    mergeStrategy?: 'keep_first' | 'keep_latest' | 'merge';
  }
): ThreatIntelligence[] => {
  const threshold = options?.threshold || 0.8;
  const mergeStrategy = options?.mergeStrategy || 'merge';
  const deduped: ThreatIntelligence[] = [];
  const processedIds = new Set<string>();

  for (const intel of intelligence) {
    if (processedIds.has(intel.id)) continue;

    // Find similar intelligence
    const similar = intelligence.filter(
      other =>
        other.id !== intel.id &&
        !processedIds.has(other.id) &&
        calculateIntelligenceSimilarity(intel, other) >= threshold
    );

    if (similar.length > 0) {
      processedIds.add(intel.id);
      similar.forEach(s => processedIds.add(s.id));

      if (mergeStrategy === 'keep_first') {
        deduped.push(intel);
      } else if (mergeStrategy === 'keep_latest') {
        const latest = [intel, ...similar].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )[0];
        deduped.push(latest);
      } else {
        // Merge all similar entries
        let merged = intel;
        similar.forEach(s => {
          merged = mergeIntelligence(merged, s);
        });
        deduped.push(merged);
      }
    } else {
      processedIds.add(intel.id);
      deduped.push(intel);
    }
  }

  return deduped;
};

/**
 * Calculates similarity score between two intelligence entries.
 *
 * @param {ThreatIntelligence} intel1 - First intelligence
 * @param {ThreatIntelligence} intel2 - Second intelligence
 * @returns {number} Similarity score (0-1)
 */
const calculateIntelligenceSimilarity = (
  intel1: ThreatIntelligence,
  intel2: ThreatIntelligence
): number => {
  let score = 0;
  let factors = 0;

  // Title similarity
  if (intel1.title === intel2.title) {
    score += 0.3;
  }
  factors++;

  // Indicator overlap
  const indicators1 = new Set(intel1.indicators.map(i => `${i.type}:${i.value}`));
  const indicators2 = new Set(intel2.indicators.map(i => `${i.type}:${i.value}`));
  const overlap = [...indicators1].filter(i => indicators2.has(i));

  if (indicators1.size > 0 && indicators2.size > 0) {
    const jaccard = overlap.length / (indicators1.size + indicators2.size - overlap.length);
    score += jaccard * 0.5;
    factors++;
  }

  // Tag similarity
  const tags1 = new Set(intel1.tags);
  const tags2 = new Set(intel2.tags);
  const tagOverlap = [...tags1].filter(t => tags2.has(t));

  if (tags1.size > 0 && tags2.size > 0) {
    const tagJaccard = tagOverlap.length / (tags1.size + tags2.size - tagOverlap.length);
    score += tagJaccard * 0.2;
    factors++;
  }

  return score;
};

/**
 * Correlates intelligence across multiple sources.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to correlate
 * @param {object} [options] - Correlation options
 * @returns {Array<{group: ThreatIntelligence[], correlation: string}>} Correlated groups
 *
 * @example
 * ```typescript
 * const correlated = correlateIntelligenceAcrossSources(intelligence);
 * ```
 */
export const correlateIntelligenceAcrossSources = (
  intelligence: ThreatIntelligence[],
  options?: {
    minSources?: number;
    correlationFields?: string[];
  }
): Array<{ group: ThreatIntelligence[]; correlation: string }> => {
  const minSources = options?.minSources || 2;
  const correlationFields = options?.correlationFields || [
    'indicators',
    'tags',
    'mitreAttack',
  ];

  const correlatedGroups: Array<{ group: ThreatIntelligence[]; correlation: string }> = [];

  // Group by indicator values
  const indicatorGroups = new Map<string, ThreatIntelligence[]>();

  intelligence.forEach(intel => {
    intel.indicators.forEach(indicator => {
      const key = `${indicator.type}:${indicator.value}`;
      if (!indicatorGroups.has(key)) {
        indicatorGroups.set(key, []);
      }
      indicatorGroups.get(key)!.push(intel);
    });
  });

  // Find groups with multiple sources
  indicatorGroups.forEach((group, key) => {
    const uniqueSources = new Set(group.map(i => i.sourceId));
    if (uniqueSources.size >= minSources) {
      correlatedGroups.push({
        group,
        correlation: `Indicator: ${key}`,
      });
    }
  });

  return correlatedGroups;
};

/**
 * Generates intelligence summary report.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to summarize
 * @param {object} [timeRange] - Time range for report
 * @returns {object} Summary report
 *
 * @example
 * ```typescript
 * const report = generateIntelligenceSummaryReport(intelligence, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-01-31')
 * });
 * ```
 */
export const generateIntelligenceSummaryReport = (
  intelligence: ThreatIntelligence[],
  timeRange?: { start: Date; end: Date }
): {
  total: number;
  bySeverity: Record<ThreatSeverity, number>;
  byType: Record<IntelligenceType, number>;
  bySource: Record<string, number>;
  byStatus: Record<IntelligenceStatus, number>;
  topTags: Array<{ tag: string; count: number }>;
  topIndicatorTypes: Array<{ type: string; count: number }>;
  avgConfidence: number;
  timeframe: { start: Date; end: Date } | null;
} => {
  let filtered = intelligence;

  if (timeRange) {
    filtered = intelligence.filter(
      i => i.createdAt >= timeRange.start && i.createdAt <= timeRange.end
    );
  }

  const report: any = {
    total: filtered.length,
    bySeverity: {},
    byType: {},
    bySource: {},
    byStatus: {},
    topTags: [],
    topIndicatorTypes: [],
    avgConfidence: 0,
    timeframe: timeRange || null,
  };

  let totalConfidence = 0;
  const tagCounts = new Map<string, number>();
  const indicatorTypeCounts = new Map<string, number>();

  filtered.forEach(intel => {
    // Aggregations
    report.bySeverity[intel.severity] = (report.bySeverity[intel.severity] || 0) + 1;
    report.byType[intel.type] = (report.byType[intel.type] || 0) + 1;
    report.bySource[intel.sourceId] = (report.bySource[intel.sourceId] || 0) + 1;
    report.byStatus[intel.status] = (report.byStatus[intel.status] || 0) + 1;

    totalConfidence += intel.confidence;

    // Tag counting
    intel.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });

    // Indicator type counting
    intel.indicators.forEach(ind => {
      indicatorTypeCounts.set(
        ind.type,
        (indicatorTypeCounts.get(ind.type) || 0) + 1
      );
    });
  });

  if (filtered.length > 0) {
    report.avgConfidence = totalConfidence / filtered.length;
  }

  // Top tags
  report.topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top indicator types
  report.topIndicatorTypes = Array.from(indicatorTypeCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return report;
};

/**
 * Converts intelligence to STIX 2.1 format.
 *
 * @param {ThreatIntelligence} intel - Intelligence to convert
 * @returns {object} STIX 2.1 bundle
 *
 * @example
 * ```typescript
 * const stixBundle = convertToSTIX(intelligence);
 * ```
 */
export const convertToSTIX = (
  intel: ThreatIntelligence
): {
  type: string;
  id: string;
  spec_version: string;
  objects: any[];
} => {
  const objects: any[] = [];

  // Create indicator object
  objects.push({
    type: 'indicator',
    spec_version: '2.1',
    id: `indicator--${intel.id}`,
    created: intel.createdAt.toISOString(),
    modified: intel.updatedAt.toISOString(),
    name: intel.title,
    description: intel.description,
    pattern: intel.indicators
      .map(i => `[${i.type.toLowerCase()}:value = '${i.value}']`)
      .join(' OR '),
    pattern_type: 'stix',
    valid_from: intel.validFrom.toISOString(),
    valid_until: intel.validUntil?.toISOString(),
    labels: intel.tags,
    confidence: intel.confidence,
    external_references: intel.references.map(ref => ({
      source_name: ref.type,
      url: ref.url,
      description: ref.description,
    })),
  });

  return {
    type: 'bundle',
    id: `bundle--${crypto.randomUUID()}`,
    spec_version: '2.1',
    objects,
  };
};

/**
 * Converts STIX 2.1 bundle to internal intelligence format.
 *
 * @param {object} stixBundle - STIX bundle
 * @param {string} sourceId - Source identifier
 * @returns {ThreatIntelligence[]} Converted intelligence
 *
 * @example
 * ```typescript
 * const intelligence = convertFromSTIX(stixBundle, 'source-123');
 * ```
 */
export const convertFromSTIX = (
  stixBundle: any,
  sourceId: string
): ThreatIntelligence[] => {
  const intelligence: ThreatIntelligence[] = [];

  if (stixBundle.type !== 'bundle' || !stixBundle.objects) {
    return intelligence;
  }

  stixBundle.objects.forEach((obj: any) => {
    if (obj.type === 'indicator') {
      intelligence.push({
        id: obj.id.replace('indicator--', ''),
        type: IntelligenceType.TECHNICAL,
        title: obj.name || 'Untitled',
        description: obj.description || '',
        severity: ThreatSeverity.MEDIUM,
        confidence: obj.confidence || 50,
        tlp: TLPLevel.WHITE,
        sourceId,
        sourceReliability: ReliabilityRating.F_RELIABILITY_UNKNOWN,
        createdAt: new Date(obj.created),
        updatedAt: new Date(obj.modified || obj.created),
        validFrom: new Date(obj.valid_from),
        validUntil: obj.valid_until ? new Date(obj.valid_until) : undefined,
        indicators: [],
        tags: obj.labels || [],
        references: (obj.external_references || []).map((ref: any) => ({
          type: ReferenceType.REPORT,
          url: ref.url,
          description: ref.description,
        })),
        relatedIntelligence: [],
        priority: IntelligencePriority.MEDIUM,
        status: IntelligenceStatus.ACTIVE,
      });
    }
  });

  return intelligence;
};

/**
 * Scores intelligence quality based on multiple factors.
 *
 * @param {ThreatIntelligence} intel - Intelligence to score
 * @returns {object} Quality score and breakdown
 *
 * @example
 * ```typescript
 * const quality = scoreIntelligenceQuality(intelligence);
 * console.log(`Quality score: ${quality.overall}`);
 * ```
 */
export const scoreIntelligenceQuality = (
  intel: ThreatIntelligence
): {
  overall: number;
  breakdown: {
    completeness: number;
    reliability: number;
    freshness: number;
    actionability: number;
  };
} => {
  const breakdown = {
    completeness: 0,
    reliability: 0,
    freshness: 0,
    actionability: 0,
  };

  // Completeness score (0-25)
  let completenessScore = 0;
  if (intel.title && intel.title.length > 10) completenessScore += 5;
  if (intel.description && intel.description.length > 50) completenessScore += 5;
  if (intel.indicators && intel.indicators.length > 0) completenessScore += 10;
  if (intel.references && intel.references.length > 0) completenessScore += 5;
  breakdown.completeness = completenessScore;

  // Reliability score (0-25)
  const reliabilityScores: Record<ReliabilityRating, number> = {
    [ReliabilityRating.A_COMPLETELY_RELIABLE]: 25,
    [ReliabilityRating.B_USUALLY_RELIABLE]: 20,
    [ReliabilityRating.C_FAIRLY_RELIABLE]: 15,
    [ReliabilityRating.D_NOT_USUALLY_RELIABLE]: 10,
    [ReliabilityRating.E_UNRELIABLE]: 5,
    [ReliabilityRating.F_RELIABILITY_UNKNOWN]: 10,
  };
  breakdown.reliability = reliabilityScores[intel.sourceReliability] || 10;

  // Freshness score (0-25)
  const age = Date.now() - intel.createdAt.getTime();
  const daysSinceCreation = age / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 1) {
    breakdown.freshness = 25;
  } else if (daysSinceCreation < 7) {
    breakdown.freshness = 20;
  } else if (daysSinceCreation < 30) {
    breakdown.freshness = 15;
  } else if (daysSinceCreation < 90) {
    breakdown.freshness = 10;
  } else {
    breakdown.freshness = 5;
  }

  // Actionability score (0-25)
  let actionabilityScore = 0;
  if (intel.indicators && intel.indicators.length > 0) actionabilityScore += 10;
  if (intel.mitreAttack && intel.mitreAttack.length > 0) actionabilityScore += 5;
  if (intel.enrichment) actionabilityScore += 5;
  if (intel.recommendedActions) actionabilityScore += 5;
  breakdown.actionability = actionabilityScore;

  const overall = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    overall,
    breakdown,
  };
};

/**
 * Recommends intelligence based on context.
 *
 * @param {ThreatIntelligence[]} intelligence - Available intelligence
 * @param {object} context - Context for recommendations
 * @returns {ThreatIntelligence[]} Recommended intelligence
 *
 * @example
 * ```typescript
 * const recommended = recommendIntelligence(allIntelligence, {
 *   sector: 'healthcare',
 *   recentThreats: ['ransomware'],
 *   assets: ['windows', 'linux']
 * });
 * ```
 */
export const recommendIntelligence = (
  intelligence: ThreatIntelligence[],
  context: {
    sector?: string;
    recentThreats?: string[];
    assets?: string[];
    geolocation?: string;
  }
): ThreatIntelligence[] => {
  const scored = intelligence.map(intel => {
    let relevanceScore = 0;

    // Sector relevance
    if (context.sector) {
      const sectorTags = intel.tags.filter(t =>
        t.toLowerCase().includes(context.sector!.toLowerCase())
      );
      relevanceScore += sectorTags.length * 10;
    }

    // Recent threat relevance
    if (context.recentThreats) {
      const threatMatches = context.recentThreats.filter(threat =>
        intel.tags.some(tag => tag.toLowerCase().includes(threat.toLowerCase())) ||
        intel.title.toLowerCase().includes(threat.toLowerCase())
      );
      relevanceScore += threatMatches.length * 15;
    }

    // Asset relevance
    if (context.assets) {
      const assetMatches = context.assets.filter(asset =>
        intel.tags.some(tag => tag.toLowerCase().includes(asset.toLowerCase()))
      );
      relevanceScore += assetMatches.length * 8;
    }

    // Priority boost
    const priorityBoost = {
      [IntelligencePriority.CRITICAL]: 20,
      [IntelligencePriority.HIGH]: 15,
      [IntelligencePriority.MEDIUM]: 10,
      [IntelligencePriority.LOW]: 5,
    };
    relevanceScore += priorityBoost[intel.priority];

    // Freshness boost
    const age = Date.now() - intel.createdAt.getTime();
    const daysSinceCreation = age / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 7) relevanceScore += 10;

    return { intel, relevanceScore };
  });

  return scored
    .filter(s => s.relevanceScore > 10)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(s => s.intel)
    .slice(0, 20);
};

/**
 * Detects intelligence gaps based on coverage analysis.
 *
 * @param {ThreatIntelligence[]} intelligence - Current intelligence
 * @param {object} requirements - Coverage requirements
 * @returns {object} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = detectIntelligenceGaps(intelligence, {
 *   requiredMitreTactics: ['initial-access', 'execution', 'persistence'],
 *   requiredSectors: ['healthcare', 'finance']
 * });
 * ```
 */
export const detectIntelligenceGaps = (
  intelligence: ThreatIntelligence[],
  requirements: {
    requiredMitreTactics?: string[];
    requiredSectors?: string[];
    requiredIndicatorTypes?: IndicatorType[];
  }
): {
  gaps: string[];
  coverage: Record<string, number>;
  recommendations: string[];
} => {
  const gaps: string[] = [];
  const coverage: Record<string, number> = {};
  const recommendations: string[] = [];

  // MITRE tactic coverage
  if (requirements.requiredMitreTactics) {
    const coveredTactics = new Set<string>();
    intelligence.forEach(intel => {
      intel.mitreAttack?.forEach(tactic => coveredTactics.add(tactic));
    });

    requirements.requiredMitreTactics.forEach(tactic => {
      if (coveredTactics.has(tactic)) {
        coverage[`mitre_${tactic}`] = 1;
      } else {
        gaps.push(`Missing MITRE tactic: ${tactic}`);
        coverage[`mitre_${tactic}`] = 0;
        recommendations.push(
          `Acquire intelligence covering MITRE ATT&CK tactic: ${tactic}`
        );
      }
    });
  }

  // Sector coverage
  if (requirements.requiredSectors) {
    requirements.requiredSectors.forEach(sector => {
      const sectorIntel = intelligence.filter(intel =>
        intel.tags.some(tag => tag.toLowerCase().includes(sector.toLowerCase()))
      );

      coverage[`sector_${sector}`] = sectorIntel.length;

      if (sectorIntel.length === 0) {
        gaps.push(`Missing sector coverage: ${sector}`);
        recommendations.push(`Acquire threat intelligence specific to ${sector} sector`);
      }
    });
  }

  // Indicator type coverage
  if (requirements.requiredIndicatorTypes) {
    const coveredTypes = new Set<IndicatorType>();
    intelligence.forEach(intel => {
      intel.indicators.forEach(ind => coveredTypes.add(ind.type as IndicatorType));
    });

    requirements.requiredIndicatorTypes.forEach(type => {
      if (coveredTypes.has(type)) {
        coverage[`indicator_${type}`] = 1;
      } else {
        gaps.push(`Missing indicator type: ${type}`);
        coverage[`indicator_${type}`] = 0;
        recommendations.push(`Acquire intelligence with ${type} indicators`);
      }
    });
  }

  return { gaps, coverage, recommendations };
};

/**
 * Performs confidence adjustment based on source track record.
 *
 * @param {ThreatIntelligence} intel - Intelligence to adjust
 * @param {object} sourceTrackRecord - Historical accuracy of source
 * @returns {ThreatIntelligence} Adjusted intelligence
 *
 * @example
 * ```typescript
 * const adjusted = adjustIntelligenceConfidence(intelligence, {
 *   sourceId: 'source-123',
 *   accuracy: 0.85,
 *   falsePositiveRate: 0.10
 * });
 * ```
 */
export const adjustIntelligenceConfidence = (
  intel: ThreatIntelligence,
  sourceTrackRecord: {
    sourceId: string;
    accuracy: number;
    falsePositiveRate: number;
  }
): ThreatIntelligence => {
  if (intel.sourceId !== sourceTrackRecord.sourceId) {
    return intel;
  }

  const adjustmentFactor = sourceTrackRecord.accuracy * (1 - sourceTrackRecord.falsePositiveRate);
  const adjustedConfidence = Math.min(100, intel.confidence * adjustmentFactor);

  return {
    ...intel,
    confidence: adjustedConfidence,
    metadata: {
      ...intel.metadata,
      originalConfidence: intel.confidence,
      confidenceAdjusted: true,
      adjustmentFactor,
    },
  };
};

/**
 * Tracks intelligence provenance through the pipeline.
 *
 * @param {ThreatIntelligence} intel - Intelligence to track
 * @param {string} stage - Pipeline stage
 * @param {object} details - Stage details
 * @returns {ThreatIntelligence} Intelligence with provenance tracking
 *
 * @example
 * ```typescript
 * const tracked = trackIntelligenceProvenance(intelligence, 'enrichment', {
 *   service: 'geolocation',
 *   timestamp: new Date()
 * });
 * ```
 */
export const trackIntelligenceProvenance = (
  intel: ThreatIntelligence,
  stage: string,
  details: Record<string, any>
): ThreatIntelligence => {
  const provenance = intel.metadata?.provenance || [];

  provenance.push({
    stage,
    timestamp: new Date().toISOString(),
    ...details,
  });

  return {
    ...intel,
    metadata: {
      ...intel.metadata,
      provenance,
    },
  };
};

/**
 * Generates intelligence sharing package.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to share
 * @param {TLPLevel} maxTLP - Maximum TLP level to include
 * @returns {object} Sharing package
 *
 * @example
 * ```typescript
 * const package = generateIntelligenceSharingPackage(intelligence, TLPLevel.GREEN);
 * ```
 */
export const generateIntelligenceSharingPackage = (
  intelligence: ThreatIntelligence[],
  maxTLP: TLPLevel
): {
  packageId: string;
  createdAt: Date;
  tlp: TLPLevel;
  intelligence: ThreatIntelligence[];
  summary: object;
} => {
  const tlpOrder = [TLPLevel.WHITE, TLPLevel.GREEN, TLPLevel.AMBER, TLPLevel.RED];
  const maxTLPIndex = tlpOrder.indexOf(maxTLP);

  const shareable = intelligence.filter(intel => {
    const intelTLPIndex = tlpOrder.indexOf(intel.tlp);
    return intelTLPIndex <= maxTLPIndex;
  });

  return {
    packageId: crypto.randomUUID(),
    createdAt: new Date(),
    tlp: maxTLP,
    intelligence: shareable,
    summary: generateIntelligenceSummaryReport(shareable),
  };
};

/**
 * Performs intelligence fusion from multiple sources.
 *
 * @param {ThreatIntelligence[][]} intelligenceSets - Multiple intelligence sets
 * @param {object} [options] - Fusion options
 * @returns {ThreatIntelligence[]} Fused intelligence
 *
 * @example
 * ```typescript
 * const fused = fuseIntelligence([source1Intel, source2Intel, source3Intel], {
 *   weightByReliability: true
 * });
 * ```
 */
export const fuseIntelligence = (
  intelligenceSets: ThreatIntelligence[][],
  options?: {
    weightByReliability?: boolean;
    mergeThreshold?: number;
  }
): ThreatIntelligence[] => {
  const allIntelligence = intelligenceSets.flat();

  // First deduplicate
  const deduplicated = deduplicateIntelligence(allIntelligence, {
    threshold: options?.mergeThreshold || 0.8,
    mergeStrategy: 'merge',
  });

  // Adjust confidence based on multi-source validation
  const fused = deduplicated.map(intel => {
    // Count how many original sources contributed to this intelligence
    const contributingSources = new Set<string>();
    allIntelligence.forEach(original => {
      if (calculateIntelligenceSimilarity(intel, original) > 0.7) {
        contributingSources.add(original.sourceId);
      }
    });

    // Boost confidence if validated by multiple sources
    let confidenceBoost = 0;
    if (contributingSources.size >= 3) {
      confidenceBoost = 15;
    } else if (contributingSources.size === 2) {
      confidenceBoost = 10;
    }

    return {
      ...intel,
      confidence: Math.min(100, intel.confidence + confidenceBoost),
      metadata: {
        ...intel.metadata,
        fusedFromSources: contributingSources.size,
        contributingSources: Array.from(contributingSources),
      },
    };
  });

  return fused;
};

/**
 * Calculates intelligence ROI (Return on Investment).
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to evaluate
 * @param {object} outcomes - Operational outcomes
 * @returns {object} ROI metrics
 *
 * @example
 * ```typescript
 * const roi = calculateIntelligenceROI(intelligence, {
 *   threatsBlocked: 150,
 *   incidentsAvoided: 5,
 *   timeToDetection: 120
 * });
 * ```
 */
export const calculateIntelligenceROI = (
  intelligence: ThreatIntelligence[],
  outcomes: {
    threatsBlocked: number;
    incidentsAvoided: number;
    timeToDetection: number; // seconds
    falsePositives: number;
  }
): {
  utilizationRate: number;
  effectivenessScore: number;
  efficiency: number;
  roi: string;
} => {
  const totalIntelligence = intelligence.length;
  const actionableIntelligence = intelligence.filter(
    i => i.indicators.length > 0 && i.status === IntelligenceStatus.ACTIVE
  ).length;

  const utilizationRate = actionableIntelligence / totalIntelligence;

  // Calculate effectiveness (threats blocked vs total actionable)
  const effectivenessScore =
    actionableIntelligence > 0
      ? (outcomes.threatsBlocked / actionableIntelligence) * 100
      : 0;

  // Calculate efficiency (true positives vs false positives)
  const efficiency =
    outcomes.threatsBlocked + outcomes.falsePositives > 0
      ? outcomes.threatsBlocked / (outcomes.threatsBlocked + outcomes.falsePositives)
      : 0;

  // Simple ROI calculation
  const estimatedCostPerIncident = 50000; // $50k average
  const costSavings = outcomes.incidentsAvoided * estimatedCostPerIncident;
  const roi = `Estimated cost savings: $${costSavings.toLocaleString()}`;

  return {
    utilizationRate,
    effectivenessScore,
    efficiency,
    roi,
  };
};

/**
 * Performs automated intelligence triage.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to triage
 * @returns {object} Triage results
 *
 * @example
 * ```typescript
 * const triaged = performIntelligenceTriage(newIntelligence);
 * console.log(`Critical: ${triaged.critical.length}, Review: ${triaged.review.length}`);
 * ```
 */
export const performIntelligenceTriage = (
  intelligence: ThreatIntelligence[]
): {
  critical: ThreatIntelligence[];
  high: ThreatIntelligence[];
  medium: ThreatIntelligence[];
  low: ThreatIntelligence[];
  review: ThreatIntelligence[];
} => {
  const triage = {
    critical: [] as ThreatIntelligence[],
    high: [] as ThreatIntelligence[],
    medium: [] as ThreatIntelligence[],
    low: [] as ThreatIntelligence[],
    review: [] as ThreatIntelligence[],
  };

  intelligence.forEach(intel => {
    // Calculate triage score
    let score = 0;

    // Severity component
    const severityScores: Record<ThreatSeverity, number> = {
      [ThreatSeverity.CRITICAL]: 40,
      [ThreatSeverity.HIGH]: 30,
      [ThreatSeverity.MEDIUM]: 20,
      [ThreatSeverity.LOW]: 10,
      [ThreatSeverity.INFO]: 5,
    };
    score += severityScores[intel.severity];

    // Confidence component
    score += (intel.confidence / 100) * 30;

    // Actionability component
    if (intel.indicators.length > 0) score += 15;
    if (intel.mitreAttack && intel.mitreAttack.length > 0) score += 10;
    if (intel.enrichment) score += 5;

    // Quality check - low quality goes to review
    const quality = scoreIntelligenceQuality(intel);
    if (quality.overall < 40) {
      triage.review.push(intel);
      return;
    }

    // Assign to triage bucket
    if (score >= 80) {
      triage.critical.push(intel);
    } else if (score >= 60) {
      triage.high.push(intel);
    } else if (score >= 40) {
      triage.medium.push(intel);
    } else {
      triage.low.push(intel);
    }
  });

  return triage;
};

/**
 * Generates intelligence timeline visualization data.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to visualize
 * @param {object} [options] - Visualization options
 * @returns {object} Timeline data
 *
 * @example
 * ```typescript
 * const timeline = generateIntelligenceTimeline(intelligence, {
 *   groupBy: 'day',
 *   includeProjections: true
 * });
 * ```
 */
export const generateIntelligenceTimeline = (
  intelligence: ThreatIntelligence[],
  options?: {
    groupBy?: 'hour' | 'day' | 'week' | 'month';
    includeProjections?: boolean;
  }
): {
  timeline: Array<{ timestamp: Date; count: number; severity: Record<ThreatSeverity, number> }>;
  trends: { direction: 'increasing' | 'decreasing' | 'stable'; rate: number };
} => {
  const groupBy = options?.groupBy || 'day';
  const timelineMap = new Map<
    string,
    { count: number; severity: Record<ThreatSeverity, number> }
  >();

  intelligence.forEach(intel => {
    const timestamp = intel.createdAt;
    let key: string;

    if (groupBy === 'hour') {
      key = timestamp.toISOString().substring(0, 13);
    } else if (groupBy === 'day') {
      key = timestamp.toISOString().substring(0, 10);
    } else if (groupBy === 'week') {
      const weekNumber = getWeekNumber(timestamp);
      key = `${timestamp.getFullYear()}-W${weekNumber}`;
    } else {
      key = timestamp.toISOString().substring(0, 7);
    }

    if (!timelineMap.has(key)) {
      timelineMap.set(key, {
        count: 0,
        severity: {
          [ThreatSeverity.CRITICAL]: 0,
          [ThreatSeverity.HIGH]: 0,
          [ThreatSeverity.MEDIUM]: 0,
          [ThreatSeverity.LOW]: 0,
          [ThreatSeverity.INFO]: 0,
        },
      });
    }

    const entry = timelineMap.get(key)!;
    entry.count++;
    entry.severity[intel.severity]++;
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([key, data]) => ({
      timestamp: new Date(key),
      count: data.count,
      severity: data.severity,
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Calculate trend
  const counts = timeline.map(t => t.count);
  const trend = calculateTrend(counts);

  return {
    timeline,
    trends: trend,
  };
};

/**
 * Gets ISO week number for a date.
 *
 * @param {Date} date - Date to get week number for
 * @returns {number} Week number
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Calculates trend from time series data.
 *
 * @param {number[]} values - Time series values
 * @returns {object} Trend information
 */
const calculateTrend = (
  values: number[]
): { direction: 'increasing' | 'decreasing' | 'stable'; rate: number } => {
  if (values.length < 2) {
    return { direction: 'stable', rate: 0 };
  }

  const recentAvg = values.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, values.length);
  const historicalAvg =
    values.slice(0, -7).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 7);

  const change = ((recentAvg - historicalAvg) / historicalAvg) * 100;

  if (Math.abs(change) < 10) {
    return { direction: 'stable', rate: change };
  } else if (change > 0) {
    return { direction: 'increasing', rate: change };
  } else {
    return { direction: 'decreasing', rate: change };
  }
};

/**
 * Performs intelligence health check and quality assurance.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence to check
 * @returns {object} Health check results
 *
 * @example
 * ```typescript
 * const health = performIntelligenceHealthCheck(intelligence);
 * console.log(`Overall health: ${health.overallHealth}%`);
 * ```
 */
export const performIntelligenceHealthCheck = (
  intelligence: ThreatIntelligence[]
): {
  overallHealth: number;
  issues: Array<{ severity: string; issue: string; count: number }>;
  metrics: {
    totalIntelligence: number;
    activeIntelligence: number;
    expiredIntelligence: number;
    avgQuality: number;
    avgConfidence: number;
    sourceDiversity: number;
  };
  recommendations: string[];
} => {
  const issues: Array<{ severity: string; issue: string; count: number }> = [];
  const recommendations: string[] = [];

  const totalIntelligence = intelligence.length;
  const activeIntelligence = intelligence.filter(
    i => i.status === IntelligenceStatus.ACTIVE
  ).length;
  const expiredIntelligence = intelligence.filter(
    i => i.status === IntelligenceStatus.EXPIRED
  ).length;

  // Calculate average quality
  const qualityScores = intelligence.map(i => scoreIntelligenceQuality(i).overall);
  const avgQuality = qualityScores.reduce((sum, q) => sum + q, 0) / totalIntelligence || 0;

  // Calculate average confidence
  const avgConfidence =
    intelligence.reduce((sum, i) => sum + i.confidence, 0) / totalIntelligence || 0;

  // Check source diversity
  const uniqueSources = new Set(intelligence.map(i => i.sourceId));
  const sourceDiversity = uniqueSources.size;

  // Identify issues
  const lowQualityCount = intelligence.filter(
    i => scoreIntelligenceQuality(i).overall < 50
  ).length;
  if (lowQualityCount > totalIntelligence * 0.2) {
    issues.push({
      severity: 'warning',
      issue: 'High proportion of low-quality intelligence',
      count: lowQualityCount,
    });
    recommendations.push('Review and improve intelligence collection sources');
  }

  const lowConfidenceCount = intelligence.filter(i => i.confidence < 50).length;
  if (lowConfidenceCount > totalIntelligence * 0.3) {
    issues.push({
      severity: 'warning',
      issue: 'High proportion of low-confidence intelligence',
      count: lowConfidenceCount,
    });
    recommendations.push('Validate intelligence with additional sources');
  }

  const expiredRatio = expiredIntelligence / totalIntelligence;
  if (expiredRatio > 0.3) {
    issues.push({
      severity: 'error',
      issue: 'High proportion of expired intelligence',
      count: expiredIntelligence,
    });
    recommendations.push('Archive expired intelligence and update retention policies');
  }

  if (sourceDiversity < 3) {
    issues.push({
      severity: 'warning',
      issue: 'Low source diversity',
      count: sourceDiversity,
    });
    recommendations.push('Integrate additional threat intelligence sources');
  }

  const noIndicatorsCount = intelligence.filter(i => i.indicators.length === 0).length;
  if (noIndicatorsCount > totalIntelligence * 0.2) {
    issues.push({
      severity: 'warning',
      issue: 'Intelligence lacking actionable indicators',
      count: noIndicatorsCount,
    });
    recommendations.push('Enrich intelligence with IOCs and actionable indicators');
  }

  // Calculate overall health (0-100)
  let healthScore = 100;
  healthScore -= Math.min(30, (lowQualityCount / totalIntelligence) * 100);
  healthScore -= Math.min(20, (lowConfidenceCount / totalIntelligence) * 100);
  healthScore -= Math.min(30, expiredRatio * 100);
  healthScore -= Math.min(10, Math.max(0, 5 - sourceDiversity) * 2);
  healthScore -= Math.min(10, (noIndicatorsCount / totalIntelligence) * 100);

  return {
    overallHealth: Math.max(0, Math.round(healthScore)),
    issues,
    metrics: {
      totalIntelligence,
      activeIntelligence,
      expiredIntelligence,
      avgQuality,
      avgConfidence,
      sourceDiversity,
    },
    recommendations,
  };
};

/**
 * Automates intelligence enrichment pipeline.
 *
 * @param {ThreatIntelligence} intel - Intelligence to enrich
 * @param {EnrichmentService[]} services - Available enrichment services
 * @param {object} [options] - Pipeline options
 * @returns {Promise<ThreatIntelligence>} Fully enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await automateIntelligenceEnrichment(intelligence, allServices, {
 *   parallel: true,
 *   continueOnError: true
 * });
 * ```
 */
export const automateIntelligenceEnrichment = async (
  intel: ThreatIntelligence,
  services: EnrichmentService[],
  options?: {
    parallel?: boolean;
    continueOnError?: boolean;
    maxRetries?: number;
  }
): Promise<ThreatIntelligence> => {
  const parallel = options?.parallel ?? true;
  const continueOnError = options?.continueOnError ?? true;
  const maxRetries = options?.maxRetries ?? 3;

  let enrichedIntel = { ...intel };
  const enabledServices = services.filter(s => s.enabled);

  if (parallel) {
    // Enrich in parallel for better performance
    const enrichmentPromises = enabledServices.map(async service => {
      let attempts = 0;
      while (attempts < maxRetries) {
        try {
          return await performEnrichment(enrichedIntel, service);
        } catch (error) {
          attempts++;
          if (attempts >= maxRetries && !continueOnError) {
            throw error;
          }
        }
      }
      return null;
    });

    const results = await Promise.all(enrichmentPromises);

    // Merge all enrichment results
    const enrichment: IntelligenceEnrichment = {
      enrichedAt: new Date(),
      enrichmentSources: [],
    };

    results.forEach((result, idx) => {
      if (result) {
        Object.assign(enrichment, result);
        enrichment.enrichmentSources.push(enabledServices[idx].name);
      }
    });

    enrichedIntel = {
      ...enrichedIntel,
      enrichment,
      updatedAt: new Date(),
    };
  } else {
    // Sequential enrichment
    enrichedIntel = await enrichThreatIntelligence(enrichedIntel, enabledServices);
  }

  // Track provenance
  enrichedIntel = trackIntelligenceProvenance(enrichedIntel, 'automated_enrichment', {
    servicesUsed: enabledServices.map(s => s.name),
    parallel,
  });

  return enrichedIntel;
};
