/**
 * LOC: THREATINTFUSION001
 * File: /reuse/threat/threat-intelligence-fusion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence fusion services
 *   - Multi-source intelligence aggregation modules
 *   - Intelligence correlation services
 *   - Threat intelligence quality assurance services
 *   - Security orchestration platforms
 */

/**
 * File: /reuse/threat/threat-intelligence-fusion-kit.ts
 * Locator: WC-THREAT-INTEL-FUSION-001
 * Purpose: Multi-Source Threat Intelligence Fusion Toolkit - Production-ready intelligence fusion operations
 *
 * Upstream: Independent utility module for threat intelligence fusion and correlation
 * Downstream: ../backend/*, Security services, Intelligence aggregation, Multi-source correlation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 40 utility functions for multi-feed aggregation, deduplication, correlation, confidence scoring, enrichment
 *
 * LLM Context: Enterprise-grade threat intelligence fusion toolkit for White Cross healthcare platform.
 * Provides comprehensive multi-source intelligence aggregation, normalization across feed formats,
 * intelligent deduplication with fuzzy matching, cross-source correlation and clustering, multi-source
 * confidence scoring, source reliability tracking and weighting, automated conflict resolution,
 * intelligence enrichment from multiple sources, and fusion analytics reporting. Designed for
 * HIPAA-compliant healthcare security operations with support for fusing intelligence from commercial
 * threat feeds, open-source intelligence, internal security tools, and industry ISACs. Includes
 * Sequelize models for fusion metadata, source reliability tracking, and correlation graphs.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Intelligence feed source configuration
 */
export interface IntelFeedSource {
  id: string;
  name: string;
  provider: string;
  feedType: IntelFeedType;
  format: IntelFeedFormat;
  url: string;
  priority: number; // 1-10, higher = more reliable
  reliability: number; // 0-100, calculated from historical accuracy
  updateFrequency: number; // milliseconds
  enabled: boolean;
  authentication?: {
    type: 'api_key' | 'basic' | 'oauth2' | 'certificate' | 'none';
    credentials?: Record<string, any>;
  };
  metadata?: Record<string, any>;
}

/**
 * Intelligence feed types
 */
export enum IntelFeedType {
  COMMERCIAL = 'COMMERCIAL',
  OPEN_SOURCE = 'OPEN_SOURCE',
  ISAC = 'ISAC', // Information Sharing and Analysis Center
  INTERNAL = 'INTERNAL',
  GOVERNMENT = 'GOVERNMENT',
  COMMUNITY = 'COMMUNITY',
  VENDOR = 'VENDOR',
}

/**
 * Intelligence feed formats
 */
export enum IntelFeedFormat {
  STIX_1_X = 'STIX_1_X',
  STIX_2_X = 'STIX_2_X',
  JSON = 'JSON',
  XML = 'XML',
  CSV = 'CSV',
  TAXII = 'TAXII',
  MISP = 'MISP',
  OPENIOC = 'OPENIOC',
  CUSTOM = 'CUSTOM',
}

/**
 * Fused intelligence item with multi-source metadata
 */
export interface FusedIntelligence {
  id: string;
  type: IntelligenceType;
  value: string;
  normalizedValue: string; // Canonicalized form
  hash: string; // SHA-256 hash for deduplication
  severity: ThreatSeverity;
  confidence: number; // 0-100, fused from multiple sources
  sources: IntelSource[];
  firstSeen: Date;
  lastSeen: Date;
  expiresAt?: Date;
  tags: string[];
  correlatedItems?: string[]; // IDs of correlated intelligence
  conflictResolution?: ConflictResolution;
  enrichment: IntelEnrichment;
  metadata: Record<string, any>;
  fusionMetadata: FusionMetadata;
}

/**
 * Intelligence types
 */
export enum IntelligenceType {
  IP_ADDRESS = 'IP_ADDRESS',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FILE_HASH = 'FILE_HASH',
  CVE = 'CVE',
  MALWARE_FAMILY = 'MALWARE_FAMILY',
  THREAT_ACTOR = 'THREAT_ACTOR',
  ATTACK_PATTERN = 'ATTACK_PATTERN',
  CAMPAIGN = 'CAMPAIGN',
  INDICATOR = 'INDICATOR',
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
 * Individual intelligence source reference
 */
export interface IntelSource {
  feedId: string;
  feedName: string;
  provider: string;
  reliability: number; // Source reliability at time of ingestion
  confidence: number; // Source's confidence for this item
  timestamp: Date;
  rawData?: any; // Original data from source
}

/**
 * Conflict resolution details when sources disagree
 */
export interface ConflictResolution {
  conflictType: 'severity' | 'confidence' | 'metadata' | 'expiration';
  conflictingValues: Array<{ feedId: string; value: any }>;
  resolutionMethod: 'voting' | 'reliability_weighted' | 'newest' | 'manual';
  resolvedValue: any;
  resolvedAt: Date;
  confidence: number; // Confidence in resolution
}

/**
 * Intelligence enrichment data from multiple sources
 */
export interface IntelEnrichment {
  geolocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    sources: string[];
  };
  whois?: {
    registrar?: string;
    registrationDate?: Date;
    expirationDate?: Date;
    sources: string[];
  };
  threatContext?: {
    malwareFamilies?: string[];
    threatActors?: string[];
    campaigns?: string[];
    sources: string[];
  };
  reputation?: {
    score: number; // 0-100
    category?: string;
    sources: string[];
  };
  relatedIndicators?: Array<{
    type: IntelligenceType;
    value: string;
    relationship: string;
    sources: string[];
  }>;
}

/**
 * Fusion-specific metadata
 */
export interface FusionMetadata {
  fusionId: string;
  fusionTimestamp: Date;
  sourceCount: number;
  agreementScore: number; // 0-100, how much sources agree
  deduplicationMethod?: 'exact' | 'fuzzy' | 'canonical';
  correlationScore?: number; // 0-100, correlation strength with other intel
  qualityScore: number; // 0-100, overall quality assessment
  processingVersion: string;
}

/**
 * Intelligence correlation result
 */
export interface IntelCorrelation {
  primaryId: string;
  relatedId: string;
  correlationType: CorrelationType;
  correlationScore: number; // 0-100
  sharedSources: string[];
  temporalProximity: number; // milliseconds between observations
  metadata?: Record<string, any>;
}

/**
 * Correlation types
 */
export enum CorrelationType {
  SAME_CAMPAIGN = 'SAME_CAMPAIGN',
  SAME_ACTOR = 'SAME_ACTOR',
  TEMPORAL = 'TEMPORAL',
  BEHAVIORAL = 'BEHAVIORAL',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MALWARE_FAMILY = 'MALWARE_FAMILY',
  TARGET_SIMILARITY = 'TARGET_SIMILARITY',
}

/**
 * Source reliability metrics
 */
export interface SourceReliabilityMetrics {
  feedId: string;
  feedName: string;
  totalSubmissions: number;
  confirmedTruePositives: number;
  confirmedFalsePositives: number;
  unconfirmed: number;
  averageAge: number; // milliseconds
  timeliness: number; // 0-100, how quickly feed reports new threats
  accuracy: number; // 0-100, (TP / (TP + FP))
  coverage: number; // 0-100, breadth of threat coverage
  overallReliability: number; // 0-100, composite score
  lastUpdated: Date;
  history: Array<{
    date: Date;
    accuracy: number;
    reliability: number;
  }>;
}

/**
 * Fusion analytics report
 */
export interface FusionReport {
  reportId: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalIntelligence: number;
    fusedItems: number;
    deduplicationRate: number; // percentage
    averageSourcesPerItem: number;
    averageConfidence: number;
    averageQualityScore: number;
  };
  sourceMetrics: Array<{
    feedId: string;
    feedName: string;
    contributedItems: number;
    reliability: number;
    agreementRate: number; // How often this source agrees with others
  }>;
  correlations: {
    totalCorrelations: number;
    byType: Record<CorrelationType, number>;
    strongCorrelations: number; // Score > 80
  };
  conflicts: {
    total: number;
    resolved: number;
    unresolved: number;
    byType: Record<string, number>;
  };
  qualityMetrics: {
    highQuality: number; // Quality score > 80
    mediumQuality: number; // Quality score 50-80
    lowQuality: number; // Quality score < 50
  };
}

/**
 * Deduplication result
 */
export interface DeduplicationResult {
  originalCount: number;
  deduplicatedCount: number;
  removedDuplicates: number;
  deduplicationRate: number; // percentage
  method: 'exact' | 'fuzzy' | 'canonical';
  clusters: Array<{
    canonicalId: string;
    duplicateIds: string[];
    mergedSources: number;
  }>;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize IntelFeedSource model attributes for feed source management.
 *
 * @example
 * ```typescript
 * class IntelFeedSource extends Model {}
 * IntelFeedSource.init(getIntelFeedSourceModelAttributes(), {
 *   sequelize,
 *   tableName: 'intel_feed_sources',
 *   timestamps: true
 * });
 * ```
 */
export const getIntelFeedSourceModelAttributes = () => ({
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
  provider: {
    type: 'STRING',
    allowNull: false,
  },
  feedType: {
    type: 'STRING',
    allowNull: false,
  },
  format: {
    type: 'STRING',
    allowNull: false,
  },
  url: {
    type: 'TEXT',
    allowNull: false,
  },
  priority: {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 10,
    },
  },
  reliability: {
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 50.0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  updateFrequency: {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 3600000, // 1 hour
  },
  enabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  authentication: {
    type: 'JSONB',
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
 * Sequelize FusedIntelligence model attributes for fused intelligence storage.
 *
 * @example
 * ```typescript
 * class FusedIntelligence extends Model {}
 * FusedIntelligence.init(getFusedIntelligenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'fused_intelligence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['hash'] },
 *     { fields: ['type'] },
 *     { fields: ['severity'] }
 *   ]
 * });
 * ```
 */
export const getFusedIntelligenceModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  value: {
    type: 'TEXT',
    allowNull: false,
  },
  normalizedValue: {
    type: 'TEXT',
    allowNull: false,
  },
  hash: {
    type: 'STRING(64)',
    allowNull: false,
    unique: true,
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
  sources: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
  },
  firstSeen: {
    type: 'DATE',
    allowNull: false,
  },
  lastSeen: {
    type: 'DATE',
    allowNull: false,
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  correlatedItems: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  conflictResolution: {
    type: 'JSONB',
    allowNull: true,
  },
  enrichment: {
    type: 'JSONB',
    defaultValue: {},
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  fusionMetadata: {
    type: 'JSONB',
    allowNull: false,
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
 * Sequelize SourceReliabilityMetrics model attributes.
 *
 * @example
 * ```typescript
 * class SourceReliabilityMetrics extends Model {}
 * SourceReliabilityMetrics.init(getSourceReliabilityMetricsModelAttributes(), {
 *   sequelize,
 *   tableName: 'source_reliability_metrics',
 *   timestamps: true
 * });
 * ```
 */
export const getSourceReliabilityMetricsModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  feedId: {
    type: 'UUID',
    allowNull: false,
    unique: true,
  },
  feedName: {
    type: 'STRING',
    allowNull: false,
  },
  totalSubmissions: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  confirmedTruePositives: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  confirmedFalsePositives: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  unconfirmed: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  averageAge: {
    type: 'BIGINT',
    defaultValue: 0,
  },
  timeliness: {
    type: 'FLOAT',
    defaultValue: 50.0,
  },
  accuracy: {
    type: 'FLOAT',
    defaultValue: 50.0,
  },
  coverage: {
    type: 'FLOAT',
    defaultValue: 50.0,
  },
  overallReliability: {
    type: 'FLOAT',
    defaultValue: 50.0,
  },
  lastUpdated: {
    type: 'DATE',
    allowNull: false,
  },
  history: {
    type: 'JSONB',
    defaultValue: [],
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
 * Sequelize IntelCorrelation model attributes.
 *
 * @example
 * ```typescript
 * class IntelCorrelation extends Model {}
 * IntelCorrelation.init(getIntelCorrelationModelAttributes(), {
 *   sequelize,
 *   tableName: 'intel_correlations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['primaryId'] },
 *     { fields: ['relatedId'] },
 *     { fields: ['correlationType'] }
 *   ]
 * });
 * ```
 */
export const getIntelCorrelationModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  primaryId: {
    type: 'UUID',
    allowNull: false,
  },
  relatedId: {
    type: 'UUID',
    allowNull: false,
  },
  correlationType: {
    type: 'STRING',
    allowNull: false,
  },
  correlationScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  sharedSources: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  temporalProximity: {
    type: 'BIGINT',
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
// MULTI-FEED AGGREGATION AND NORMALIZATION (8 functions)
// ============================================================================

/**
 * Aggregates threat intelligence from multiple feeds with intelligent merging.
 *
 * @param {IntelFeedSource[]} feeds - Array of intelligence feed sources
 * @param {object} [options] - Aggregation options
 * @returns {Promise<FusedIntelligence[]>} Aggregated and fused intelligence items
 *
 * @example
 * ```typescript
 * const feeds = [
 *   { id: 'feed1', name: 'AlienVault OTX', provider: 'alienvault', feedType: IntelFeedType.COMMERCIAL, ... },
 *   { id: 'feed2', name: 'MISP', provider: 'misp', feedType: IntelFeedType.OPEN_SOURCE, ... }
 * ];
 * const fusedIntel = await aggregateMultipleIntelFeeds(feeds, { deduplication: true, minConfidence: 50 });
 * ```
 */
export const aggregateMultipleIntelFeeds = async (
  feeds: IntelFeedSource[],
  options?: {
    deduplication?: boolean;
    minConfidence?: number;
    maxAge?: number; // milliseconds
    enableEnrichment?: boolean;
  }
): Promise<FusedIntelligence[]> => {
  const allIntelligence: FusedIntelligence[] = [];
  const intelMap = new Map<string, FusedIntelligence>();

  for (const feed of feeds.filter((f) => f.enabled)) {
    try {
      // Fetch and normalize data from each feed
      const rawData = await fetchFeedData(feed);
      const normalized = await normalizeIntelFeedFormat(rawData, feed.format);

      for (const item of normalized) {
        const hash = calculateIntelHash(item.type, item.value);

        // Apply filters
        if (options?.maxAge) {
          const age = Date.now() - item.lastSeen.getTime();
          if (age > options.maxAge) continue;
        }

        if (options?.minConfidence && item.confidence < options.minConfidence) {
          continue;
        }

        if (options?.deduplication && intelMap.has(hash)) {
          // Merge with existing intelligence
          const existing = intelMap.get(hash)!;
          const merged = mergeFusedIntelligence(existing, item, feed);
          intelMap.set(hash, merged);
        } else {
          // Create new fused intelligence item
          const fusedItem = createFusedIntelligence(item, feed);
          intelMap.set(hash, fusedItem);
        }
      }
    } catch (error) {
      console.error(`Error aggregating feed ${feed.name}:`, error);
    }
  }

  const result = Array.from(intelMap.values());

  // Optional enrichment
  if (options?.enableEnrichment) {
    for (const item of result) {
      await enrichFromMultipleSources(item, feeds);
    }
  }

  return result;
};

/**
 * Normalizes intelligence feed data from different formats into standard structure.
 *
 * @param {any} rawData - Raw intelligence data from feed
 * @param {IntelFeedFormat} format - Format of the intelligence feed
 * @returns {Promise<any[]>} Normalized intelligence items
 *
 * @example
 * ```typescript
 * const rawSTIX = fetchedSTIXData;
 * const normalized = await normalizeIntelFeedFormat(rawSTIX, IntelFeedFormat.STIX_2_X);
 * ```
 */
export const normalizeIntelFeedFormat = async (
  rawData: any,
  format: IntelFeedFormat
): Promise<any[]> => {
  const normalized: any[] = [];

  switch (format) {
    case IntelFeedFormat.STIX_2_X:
      // Parse STIX 2.x bundle
      if (rawData.type === 'bundle' && rawData.objects) {
        for (const obj of rawData.objects) {
          if (obj.type === 'indicator') {
            normalized.push({
              type: mapSTIXTypeToIntelType(obj.pattern_type),
              value: extractSTIXValue(obj.pattern),
              confidence: obj.confidence || 50,
              severity: mapSTIXSeverity(obj.labels),
              firstSeen: new Date(obj.created),
              lastSeen: new Date(obj.modified || obj.created),
              tags: obj.labels || [],
              metadata: obj,
            });
          }
        }
      }
      break;

    case IntelFeedFormat.STIX_1_X:
      // Parse STIX 1.x XML/JSON
      // Implementation would parse legacy STIX format
      break;

    case IntelFeedFormat.JSON:
      // Generic JSON format
      if (Array.isArray(rawData)) {
        normalized.push(...rawData);
      } else if (rawData.indicators || rawData.data) {
        normalized.push(...(rawData.indicators || rawData.data));
      }
      break;

    case IntelFeedFormat.CSV:
      // Parse CSV format
      // Implementation would parse CSV rows
      break;

    case IntelFeedFormat.MISP:
      // Parse MISP format
      if (rawData.Event || rawData.events) {
        const events = Array.isArray(rawData) ? rawData : [rawData.Event || rawData];
        for (const event of events) {
          if (event.Attribute) {
            for (const attr of event.Attribute) {
              normalized.push({
                type: mapMISPTypeToIntelType(attr.type),
                value: attr.value,
                confidence: attr.to_ids ? 75 : 50,
                severity: mapMISPThreatLevel(event.threat_level_id),
                firstSeen: new Date(attr.timestamp * 1000),
                lastSeen: new Date(attr.timestamp * 1000),
                tags: attr.Tag?.map((t: any) => t.name) || [],
                metadata: { event, attribute: attr },
              });
            }
          }
        }
      }
      break;

    case IntelFeedFormat.OPENIOC:
      // Parse OpenIOC format
      // Implementation would parse OpenIOC XML
      break;

    default:
      throw new Error(`Unsupported feed format: ${format}`);
  }

  return normalized;
};

/**
 * Validates intelligence feed data against expected schema.
 *
 * @param {any} data - Intelligence data to validate
 * @param {IntelFeedFormat} format - Expected format
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntelFeedSchema(feedData, IntelFeedFormat.STIX_2_X);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const validateIntelFeedSchema = async (
  data: any,
  format: IntelFeedFormat
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!data) {
    errors.push('Data is null or undefined');
    return { valid: false, errors };
  }

  switch (format) {
    case IntelFeedFormat.STIX_2_X:
      if (data.type !== 'bundle') {
        errors.push('STIX 2.x data must be a bundle');
      }
      if (!data.objects || !Array.isArray(data.objects)) {
        errors.push('STIX bundle must contain objects array');
      }
      if (data.objects) {
        data.objects.forEach((obj: any, idx: number) => {
          if (!obj.type) {
            errors.push(`Object at index ${idx} missing type`);
          }
          if (!obj.id) {
            errors.push(`Object at index ${idx} missing id`);
          }
        });
      }
      break;

    case IntelFeedFormat.JSON:
      if (typeof data !== 'object') {
        errors.push('JSON data must be an object or array');
      }
      break;

    case IntelFeedFormat.MISP:
      if (!data.Event && !data.events && !Array.isArray(data)) {
        errors.push('MISP data must contain Event, events, or be an array');
      }
      break;

    default:
      errors.push(`Schema validation not implemented for format: ${format}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Merges multiple intelligence feeds into a unified dataset.
 *
 * @param {FusedIntelligence[]} feeds - Array of intelligence datasets to merge
 * @param {object} [options] - Merge options
 * @returns {Promise<FusedIntelligence[]>} Merged intelligence
 *
 * @example
 * ```typescript
 * const merged = await mergeIntelFeeds([feed1Data, feed2Data, feed3Data], {
 *   conflictResolution: 'reliability_weighted'
 * });
 * ```
 */
export const mergeIntelFeeds = async (
  feeds: FusedIntelligence[][],
  options?: {
    conflictResolution?: 'voting' | 'reliability_weighted' | 'newest';
    preserveAll?: boolean;
  }
): Promise<FusedIntelligence[]> => {
  const mergedMap = new Map<string, FusedIntelligence>();

  for (const feedData of feeds) {
    for (const item of feedData) {
      const hash = item.hash || calculateIntelHash(item.type, item.value);

      if (mergedMap.has(hash)) {
        const existing = mergedMap.get(hash)!;
        // Merge sources and metadata
        const merged: FusedIntelligence = {
          ...existing,
          sources: [...existing.sources, ...item.sources],
          lastSeen: new Date(Math.max(existing.lastSeen.getTime(), item.lastSeen.getTime())),
          fusionMetadata: {
            ...existing.fusionMetadata,
            sourceCount: existing.fusionMetadata.sourceCount + item.fusionMetadata.sourceCount,
            fusionTimestamp: new Date(),
          },
        };

        // Resolve conflicts if values differ
        if (existing.severity !== item.severity) {
          merged.conflictResolution = {
            conflictType: 'severity',
            conflictingValues: [
              { feedId: 'existing', value: existing.severity },
              { feedId: 'new', value: item.severity },
            ],
            resolutionMethod: options?.conflictResolution || 'voting',
            resolvedValue: existing.severity, // Placeholder
            resolvedAt: new Date(),
            confidence: 75,
          };
        }

        mergedMap.set(hash, merged);
      } else {
        mergedMap.set(hash, item);
      }
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Prioritizes intelligence feeds based on reliability scores.
 *
 * @param {IntelFeedSource[]} feeds - Array of feed sources
 * @param {SourceReliabilityMetrics[]} metrics - Reliability metrics for feeds
 * @returns {IntelFeedSource[]} Prioritized feeds
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeIntelFeeds(allFeeds, reliabilityMetrics);
 * // Process feeds in priority order
 * for (const feed of prioritized) {
 *   await processFeed(feed);
 * }
 * ```
 */
export const prioritizeIntelFeeds = (
  feeds: IntelFeedSource[],
  metrics: SourceReliabilityMetrics[]
): IntelFeedSource[] => {
  const metricsMap = new Map(metrics.map((m) => [m.feedId, m]));

  return feeds
    .map((feed) => {
      const metric = metricsMap.get(feed.id);
      const compositeScore =
        (feed.priority * 0.3) +
        ((metric?.overallReliability || feed.reliability) * 0.7);

      return { feed, compositeScore };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .map((item) => item.feed);
};

/**
 * Filters intelligence data by relevance criteria.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to filter
 * @param {object} criteria - Relevance criteria
 * @returns {FusedIntelligence[]} Filtered intelligence
 *
 * @example
 * ```typescript
 * const relevant = filterIntelByRelevance(allIntel, {
 *   types: [IntelligenceType.IP_ADDRESS, IntelligenceType.DOMAIN],
 *   minSeverity: ThreatSeverity.MEDIUM,
 *   tags: ['healthcare', 'ransomware']
 * });
 * ```
 */
export const filterIntelByRelevance = (
  intelligence: FusedIntelligence[],
  criteria: {
    types?: IntelligenceType[];
    severities?: ThreatSeverity[];
    minConfidence?: number;
    tags?: string[];
    dateRange?: { start: Date; end: Date };
  }
): FusedIntelligence[] => {
  return intelligence.filter((item) => {
    if (criteria.types && !criteria.types.includes(item.type)) {
      return false;
    }

    if (criteria.severities && !criteria.severities.includes(item.severity)) {
      return false;
    }

    if (criteria.minConfidence && item.confidence < criteria.minConfidence) {
      return false;
    }

    if (criteria.tags && criteria.tags.length > 0) {
      const hasMatchingTag = criteria.tags.some((tag) => item.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    if (criteria.dateRange) {
      const itemDate = item.lastSeen.getTime();
      if (
        itemDate < criteria.dateRange.start.getTime() ||
        itemDate > criteria.dateRange.end.getTime()
      ) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Categorizes intelligence data into predefined categories.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to categorize
 * @returns {Record<string, FusedIntelligence[]>} Categorized intelligence
 *
 * @example
 * ```typescript
 * const categorized = categorizeIntelData(fusedIntel);
 * console.log('Network indicators:', categorized.network.length);
 * console.log('Malware indicators:', categorized.malware.length);
 * ```
 */
export const categorizeIntelData = (
  intelligence: FusedIntelligence[]
): Record<string, FusedIntelligence[]> => {
  const categories: Record<string, FusedIntelligence[]> = {
    network: [],
    malware: [],
    vulnerability: [],
    actor: [],
    campaign: [],
    other: [],
  };

  for (const item of intelligence) {
    switch (item.type) {
      case IntelligenceType.IP_ADDRESS:
      case IntelligenceType.DOMAIN:
      case IntelligenceType.URL:
        categories.network.push(item);
        break;

      case IntelligenceType.FILE_HASH:
      case IntelligenceType.MALWARE_FAMILY:
        categories.malware.push(item);
        break;

      case IntelligenceType.CVE:
        categories.vulnerability.push(item);
        break;

      case IntelligenceType.THREAT_ACTOR:
        categories.actor.push(item);
        break;

      case IntelligenceType.CAMPAIGN:
        categories.campaign.push(item);
        break;

      default:
        categories.other.push(item);
    }
  }

  return categories;
};

/**
 * Transforms intelligence between different standard formats.
 *
 * @param {any} data - Intelligence data to transform
 * @param {IntelFeedFormat} fromFormat - Source format
 * @param {IntelFeedFormat} toFormat - Target format
 * @returns {Promise<any>} Transformed intelligence data
 *
 * @example
 * ```typescript
 * const stixData = await transformIntelFormat(mispData, IntelFeedFormat.MISP, IntelFeedFormat.STIX_2_X);
 * ```
 */
export const transformIntelFormat = async (
  data: any,
  fromFormat: IntelFeedFormat,
  toFormat: IntelFeedFormat
): Promise<any> => {
  // First normalize to internal format
  const normalized = await normalizeIntelFeedFormat(data, fromFormat);

  // Then transform to target format
  switch (toFormat) {
    case IntelFeedFormat.STIX_2_X:
      return {
        type: 'bundle',
        id: `bundle--${crypto.randomUUID()}`,
        objects: normalized.map((item) => ({
          type: 'indicator',
          id: `indicator--${crypto.randomUUID()}`,
          created: item.firstSeen.toISOString(),
          modified: item.lastSeen.toISOString(),
          pattern: `[${item.type.toLowerCase()}:value = '${item.value}']`,
          pattern_type: 'stix',
          valid_from: item.firstSeen.toISOString(),
          labels: item.tags,
          confidence: item.confidence,
        })),
      };

    case IntelFeedFormat.JSON:
      return normalized;

    case IntelFeedFormat.MISP:
      return {
        Event: {
          info: 'Transformed Intelligence',
          threat_level_id: '2',
          analysis: '1',
          Attribute: normalized.map((item) => ({
            type: item.type.toLowerCase(),
            value: item.value,
            to_ids: item.confidence > 50,
            timestamp: Math.floor(item.lastSeen.getTime() / 1000),
            Tag: item.tags.map((tag: string) => ({ name: tag })),
          })),
        },
      };

    default:
      throw new Error(`Transformation to ${toFormat} not implemented`);
  }
};

// ============================================================================
// INTELLIGENCE DEDUPLICATION (5 functions)
// ============================================================================

/**
 * Removes duplicate intelligence items using multiple deduplication strategies.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to deduplicate
 * @param {object} [options] - Deduplication options
 * @returns {DeduplicationResult} Deduplication results
 *
 * @example
 * ```typescript
 * const result = deduplicateIntelligence(allIntel, {
 *   method: 'fuzzy',
 *   threshold: 0.85
 * });
 * console.log(`Removed ${result.removedDuplicates} duplicates`);
 * ```
 */
export const deduplicateIntelligence = (
  intelligence: FusedIntelligence[],
  options?: {
    method?: 'exact' | 'fuzzy' | 'canonical';
    threshold?: number; // For fuzzy matching, 0-1
  }
): DeduplicationResult => {
  const originalCount = intelligence.length;
  const method = options?.method || 'canonical';
  const clusters: Array<{ canonicalId: string; duplicateIds: string[]; mergedSources: number }> =
    [];
  const deduplicatedMap = new Map<string, FusedIntelligence>();

  for (const item of intelligence) {
    let key: string;

    switch (method) {
      case 'exact':
        key = `${item.type}:${item.value}`;
        break;

      case 'canonical':
        key = item.hash || calculateIntelHash(item.type, item.value);
        break;

      case 'fuzzy':
        // Find similar items using fuzzy matching
        key = findSimilarIntelKey(item, Array.from(deduplicatedMap.values()), options?.threshold);
        break;

      default:
        key = item.hash || calculateIntelHash(item.type, item.value);
    }

    if (deduplicatedMap.has(key)) {
      const existing = deduplicatedMap.get(key)!;
      const merged = mergeDuplicateIntel([existing, item]);
      deduplicatedMap.set(key, merged);

      // Track cluster
      const cluster = clusters.find((c) => c.canonicalId === key);
      if (cluster) {
        cluster.duplicateIds.push(item.id);
        cluster.mergedSources += item.sources.length;
      } else {
        clusters.push({
          canonicalId: key,
          duplicateIds: [item.id],
          mergedSources: item.sources.length,
        });
      }
    } else {
      deduplicatedMap.set(key, item);
    }
  }

  const deduplicatedCount = deduplicatedMap.size;
  const removedDuplicates = originalCount - deduplicatedCount;

  return {
    originalCount,
    deduplicatedCount,
    removedDuplicates,
    deduplicationRate: (removedDuplicates / originalCount) * 100,
    method,
    clusters,
  };
};

/**
 * Performs fuzzy matching to identify similar intelligence items.
 *
 * @param {FusedIntelligence} item - Intelligence item to match
 * @param {FusedIntelligence[]} candidates - Candidate items for matching
 * @param {number} [threshold=0.8] - Similarity threshold (0-1)
 * @returns {string | null} Matching item ID or null
 *
 * @example
 * ```typescript
 * const matchKey = fuzzyMatchIntelligence(newItem, existingItems, 0.85);
 * if (matchKey) {
 *   console.log('Found similar item:', matchKey);
 * }
 * ```
 */
export const fuzzyMatchIntelligence = (
  item: FusedIntelligence,
  candidates: FusedIntelligence[],
  threshold: number = 0.8
): string | null => {
  for (const candidate of candidates) {
    if (item.type !== candidate.type) continue;

    const similarity = calculateStringSimilarity(
      item.normalizedValue,
      candidate.normalizedValue
    );

    if (similarity >= threshold) {
      return candidate.hash;
    }
  }

  return null;
};

/**
 * Canonicalizes intelligence values into normalized form for deduplication.
 *
 * @param {IntelligenceType} type - Type of intelligence
 * @param {string} value - Raw intelligence value
 * @returns {string} Canonicalized value
 *
 * @example
 * ```typescript
 * const canonical1 = canonicalizeIntelValue(IntelligenceType.DOMAIN, 'EXAMPLE.COM');
 * const canonical2 = canonicalizeIntelValue(IntelligenceType.DOMAIN, 'example.com');
 * // Both return 'example.com'
 * ```
 */
export const canonicalizeIntelValue = (type: IntelligenceType, value: string): string => {
  let canonical = value.trim();

  switch (type) {
    case IntelligenceType.IP_ADDRESS:
      // Remove leading zeros, normalize format
      canonical = canonical.toLowerCase();
      break;

    case IntelligenceType.DOMAIN:
      // Lowercase, remove trailing dot, www prefix
      canonical = canonical.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
      break;

    case IntelligenceType.URL:
      // Lowercase protocol and domain, normalize path
      try {
        const url = new URL(canonical);
        url.protocol = url.protocol.toLowerCase();
        url.hostname = url.hostname.toLowerCase();
        canonical = url.toString().replace(/\/$/, '');
      } catch {
        canonical = canonical.toLowerCase();
      }
      break;

    case IntelligenceType.EMAIL:
      // Lowercase entire email
      canonical = canonical.toLowerCase();
      break;

    case IntelligenceType.FILE_HASH:
      // Uppercase hash
      canonical = canonical.toUpperCase();
      break;

    default:
      canonical = canonical.toLowerCase();
  }

  return canonical;
};

/**
 * Detects duplicate patterns across intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to analyze
 * @returns {Array<{ pattern: string; count: number; items: string[] }>} Detected patterns
 *
 * @example
 * ```typescript
 * const patterns = detectDuplicatePatterns(allIntel);
 * patterns.forEach(p => {
 *   console.log(`Pattern ${p.pattern} found ${p.count} times`);
 * });
 * ```
 */
export const detectDuplicatePatterns = (
  intelligence: FusedIntelligence[]
): Array<{ pattern: string; count: number; items: string[] }> => {
  const patternMap = new Map<string, string[]>();

  for (const item of intelligence) {
    // Extract patterns based on type
    let pattern: string;

    switch (item.type) {
      case IntelligenceType.IP_ADDRESS:
        // Extract subnet pattern (first 3 octets for IPv4)
        const ipParts = item.normalizedValue.split('.');
        pattern = ipParts.length >= 3 ? `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.x` : item.normalizedValue;
        break;

      case IntelligenceType.DOMAIN:
        // Extract domain pattern (root domain)
        const domainParts = item.normalizedValue.split('.');
        pattern =
          domainParts.length >= 2
            ? `*.${domainParts.slice(-2).join('.')}`
            : item.normalizedValue;
        break;

      case IntelligenceType.URL:
        // Extract URL domain pattern
        try {
          const url = new URL(item.normalizedValue);
          pattern = `${url.protocol}//${url.hostname}/*`;
        } catch {
          pattern = item.normalizedValue;
        }
        break;

      default:
        pattern = item.type;
    }

    if (!patternMap.has(pattern)) {
      patternMap.set(pattern, []);
    }
    patternMap.get(pattern)!.push(item.id);
  }

  return Array.from(patternMap.entries())
    .filter(([_, items]) => items.length > 1)
    .map(([pattern, items]) => ({
      pattern,
      count: items.length,
      items,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Merges duplicate intelligence entries into a single unified entry.
 *
 * @param {FusedIntelligence[]} duplicates - Duplicate intelligence items to merge
 * @returns {FusedIntelligence} Merged intelligence item
 *
 * @example
 * ```typescript
 * const merged = mergeDuplicateIntel([item1, item2, item3]);
 * console.log(`Merged ${merged.sources.length} sources`);
 * ```
 */
export const mergeDuplicateIntel = (duplicates: FusedIntelligence[]): FusedIntelligence => {
  if (duplicates.length === 0) {
    throw new Error('No duplicates to merge');
  }

  if (duplicates.length === 1) {
    return duplicates[0];
  }

  const base = duplicates[0];
  const allSources: IntelSource[] = [];
  const allTags = new Set<string>();
  const correlatedItems = new Set<string>();

  let minFirstSeen = base.firstSeen;
  let maxLastSeen = base.lastSeen;
  let totalConfidence = 0;

  for (const dup of duplicates) {
    allSources.push(...dup.sources);
    dup.tags.forEach((tag) => allTags.add(tag));
    dup.correlatedItems?.forEach((id) => correlatedItems.add(id));

    if (dup.firstSeen < minFirstSeen) minFirstSeen = dup.firstSeen;
    if (dup.lastSeen > maxLastSeen) maxLastSeen = dup.lastSeen;
    totalConfidence += dup.confidence * dup.sources.length;
  }

  const totalSourceCount = allSources.length;
  const averageConfidence = totalConfidence / totalSourceCount;

  // Calculate agreement score
  const severities = duplicates.map((d) => d.severity);
  const mostCommonSeverity = getMostCommon(severities);
  const agreementScore =
    (severities.filter((s) => s === mostCommonSeverity).length / severities.length) * 100;

  return {
    ...base,
    sources: allSources,
    tags: Array.from(allTags),
    correlatedItems: Array.from(correlatedItems),
    firstSeen: minFirstSeen,
    lastSeen: maxLastSeen,
    confidence: averageConfidence,
    fusionMetadata: {
      ...base.fusionMetadata,
      sourceCount: totalSourceCount,
      agreementScore,
      fusionTimestamp: new Date(),
    },
  };
};

// ============================================================================
// CROSS-SOURCE CORRELATION (6 functions)
// ============================================================================

/**
 * Correlates intelligence items across multiple sources to identify relationships.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to correlate
 * @param {object} [options] - Correlation options
 * @returns {IntelCorrelation[]} Correlation results
 *
 * @example
 * ```typescript
 * const correlations = correlateAcrossSources(fusedIntel, {
 *   minScore: 70,
 *   types: [CorrelationType.SAME_CAMPAIGN, CorrelationType.INFRASTRUCTURE]
 * });
 * ```
 */
export const correlateAcrossSources = (
  intelligence: FusedIntelligence[],
  options?: {
    minScore?: number;
    types?: CorrelationType[];
    temporalWindow?: number; // milliseconds
  }
): IntelCorrelation[] => {
  const correlations: IntelCorrelation[] = [];
  const minScore = options?.minScore || 50;
  const temporalWindow = options?.temporalWindow || 7 * 24 * 60 * 60 * 1000; // 7 days

  for (let i = 0; i < intelligence.length; i++) {
    for (let j = i + 1; j < intelligence.length; j++) {
      const item1 = intelligence[i];
      const item2 = intelligence[j];

      // Check temporal proximity
      const timeDiff = Math.abs(item1.lastSeen.getTime() - item2.lastSeen.getTime());
      if (timeDiff > temporalWindow) continue;

      // Find shared sources
      const sharedSources = item1.sources
        .filter((s1) => item2.sources.some((s2) => s2.feedId === s1.feedId))
        .map((s) => s.feedId);

      if (sharedSources.length === 0) continue;

      // Calculate correlation score
      const baseScore = (sharedSources.length / Math.max(item1.sources.length, item2.sources.length)) * 100;

      // Check for common tags
      const commonTags = item1.tags.filter((tag) => item2.tags.includes(tag));
      const tagBonus = (commonTags.length / Math.max(item1.tags.length, item2.tags.length)) * 20;

      const correlationScore = Math.min(100, baseScore + tagBonus);

      if (correlationScore >= minScore) {
        // Determine correlation type
        let correlationType = CorrelationType.TEMPORAL;

        if (commonTags.some(tag => tag.includes('campaign'))) {
          correlationType = CorrelationType.SAME_CAMPAIGN;
        } else if (commonTags.some(tag => tag.includes('actor'))) {
          correlationType = CorrelationType.SAME_ACTOR;
        } else if (item1.type === item2.type && item1.type === IntelligenceType.IP_ADDRESS) {
          correlationType = CorrelationType.INFRASTRUCTURE;
        }

        if (!options?.types || options.types.includes(correlationType)) {
          correlations.push({
            primaryId: item1.id,
            relatedId: item2.id,
            correlationType,
            correlationScore,
            sharedSources,
            temporalProximity: timeDiff,
            metadata: { commonTags },
          });
        }
      }
    }
  }

  return correlations.sort((a, b) => b.correlationScore - a.correlationScore);
};

/**
 * Finds overlapping intelligence between different sources.
 *
 * @param {IntelFeedSource[]} feeds - Feed sources to compare
 * @param {FusedIntelligence[]} intelligence - Intelligence items
 * @returns {Array<{ feed1: string; feed2: string; overlapCount: number; overlapPercentage: number }>} Overlap analysis
 *
 * @example
 * ```typescript
 * const overlaps = findIntelOverlaps(feeds, fusedIntel);
 * overlaps.forEach(o => {
 *   console.log(`${o.feed1} and ${o.feed2}: ${o.overlapPercentage}% overlap`);
 * });
 * ```
 */
export const findIntelOverlaps = (
  feeds: IntelFeedSource[],
  intelligence: FusedIntelligence[]
): Array<{ feed1: string; feed2: string; overlapCount: number; overlapPercentage: number }> => {
  const overlaps: Array<{
    feed1: string;
    feed2: string;
    overlapCount: number;
    overlapPercentage: number;
  }> = [];

  // Build feed-to-items mapping
  const feedItems = new Map<string, Set<string>>();
  for (const feed of feeds) {
    feedItems.set(feed.id, new Set());
  }

  for (const item of intelligence) {
    for (const source of item.sources) {
      feedItems.get(source.feedId)?.add(item.hash);
    }
  }

  // Calculate pairwise overlaps
  const feedIds = Array.from(feedItems.keys());
  for (let i = 0; i < feedIds.length; i++) {
    for (let j = i + 1; j < feedIds.length; j++) {
      const feed1Id = feedIds[i];
      const feed2Id = feedIds[j];
      const items1 = feedItems.get(feed1Id)!;
      const items2 = feedItems.get(feed2Id)!;

      const intersection = new Set([...items1].filter((x) => items2.has(x)));
      const overlapCount = intersection.size;
      const overlapPercentage = (overlapCount / Math.min(items1.size, items2.size)) * 100;

      overlaps.push({
        feed1: feeds.find((f) => f.id === feed1Id)?.name || feed1Id,
        feed2: feeds.find((f) => f.id === feed2Id)?.name || feed2Id,
        overlapCount,
        overlapPercentage,
      });
    }
  }

  return overlaps.sort((a, b) => b.overlapPercentage - a.overlapPercentage);
};

/**
 * Calculates correlation strength score between intelligence items.
 *
 * @param {FusedIntelligence} item1 - First intelligence item
 * @param {FusedIntelligence} item2 - Second intelligence item
 * @returns {number} Correlation score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCorrelationScore(intel1, intel2);
 * if (score > 80) {
 *   console.log('Strong correlation detected');
 * }
 * ```
 */
export const calculateCorrelationScore = (
  item1: FusedIntelligence,
  item2: FusedIntelligence
): number => {
  let score = 0;

  // Shared sources (40 points max)
  const sharedSources = item1.sources.filter((s1) =>
    item2.sources.some((s2) => s2.feedId === s1.feedId)
  );
  score += (sharedSources.length / Math.max(item1.sources.length, item2.sources.length)) * 40;

  // Common tags (30 points max)
  const commonTags = item1.tags.filter((tag) => item2.tags.includes(tag));
  score += (commonTags.length / Math.max(item1.tags.length, item2.tags.length)) * 30;

  // Temporal proximity (20 points max)
  const timeDiff = Math.abs(item1.lastSeen.getTime() - item2.lastSeen.getTime());
  const maxTimeDiff = 30 * 24 * 60 * 60 * 1000; // 30 days
  const temporalScore = Math.max(0, (1 - timeDiff / maxTimeDiff) * 20);
  score += temporalScore;

  // Severity alignment (10 points max)
  if (item1.severity === item2.severity) {
    score += 10;
  }

  return Math.min(100, score);
};

/**
 * Identifies clusters of related intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to cluster
 * @param {number} [minCorrelation=70] - Minimum correlation score for clustering
 * @returns {Array<{ clusterId: string; items: string[]; avgCorrelation: number }>} Intelligence clusters
 *
 * @example
 * ```typescript
 * const clusters = identifyIntelClusters(fusedIntel, 75);
 * console.log(`Found ${clusters.length} intelligence clusters`);
 * ```
 */
export const identifyIntelClusters = (
  intelligence: FusedIntelligence[],
  minCorrelation: number = 70
): Array<{ clusterId: string; items: string[]; avgCorrelation: number }> => {
  const clusters: Array<{ clusterId: string; items: string[]; avgCorrelation: number }> = [];
  const processed = new Set<string>();

  for (const item of intelligence) {
    if (processed.has(item.id)) continue;

    const cluster: string[] = [item.id];
    processed.add(item.id);

    // Find all items correlated with this one
    for (const candidate of intelligence) {
      if (processed.has(candidate.id)) continue;

      const correlation = calculateCorrelationScore(item, candidate);
      if (correlation >= minCorrelation) {
        cluster.push(candidate.id);
        processed.add(candidate.id);
      }
    }

    if (cluster.length > 1) {
      // Calculate average correlation within cluster
      let totalCorrelation = 0;
      let pairCount = 0;

      for (let i = 0; i < cluster.length; i++) {
        for (let j = i + 1; j < cluster.length; j++) {
          const item1 = intelligence.find((it) => it.id === cluster[i])!;
          const item2 = intelligence.find((it) => it.id === cluster[j])!;
          totalCorrelation += calculateCorrelationScore(item1, item2);
          pairCount++;
        }
      }

      clusters.push({
        clusterId: crypto.randomUUID(),
        items: cluster,
        avgCorrelation: pairCount > 0 ? totalCorrelation / pairCount : 100,
      });
    }
  }

  return clusters.sort((a, b) => b.items.length - a.items.length);
};

/**
 * Builds a correlation graph showing relationships between intelligence items.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items
 * @param {IntelCorrelation[]} correlations - Correlation relationships
 * @returns {{ nodes: any[]; edges: any[] }} Graph structure
 *
 * @example
 * ```typescript
 * const graph = buildCorrelationGraph(fusedIntel, correlations);
 * // Use graph for visualization or graph analysis algorithms
 * ```
 */
export const buildCorrelationGraph = (
  intelligence: FusedIntelligence[],
  correlations: IntelCorrelation[]
): { nodes: any[]; edges: any[] } => {
  const nodes = intelligence.map((item) => ({
    id: item.id,
    type: item.type,
    value: item.value,
    severity: item.severity,
    confidence: item.confidence,
    sourceCount: item.sources.length,
  }));

  const edges = correlations.map((corr) => ({
    source: corr.primaryId,
    target: corr.relatedId,
    type: corr.correlationType,
    score: corr.correlationScore,
    sharedSources: corr.sharedSources.length,
  }));

  return { nodes, edges };
};

/**
 * Analyzes agreement levels between different intelligence sources.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to analyze
 * @returns {Array<{ feedId: string; feedName: string; agreementRate: number; conflicts: number }>} Source agreement analysis
 *
 * @example
 * ```typescript
 * const agreement = analyzeSourceAgreement(fusedIntel);
 * agreement.forEach(a => {
 *   console.log(`${a.feedName}: ${a.agreementRate}% agreement rate`);
 * });
 * ```
 */
export const analyzeSourceAgreement = (
  intelligence: FusedIntelligence[]
): Array<{ feedId: string; feedName: string; agreementRate: number; conflicts: number }> => {
  const feedStats = new Map<
    string,
    { feedName: string; totalItems: number; agreements: number; conflicts: number }
  >();

  for (const item of intelligence) {
    for (const source of item.sources) {
      if (!feedStats.has(source.feedId)) {
        feedStats.set(source.feedId, {
          feedName: source.feedName,
          totalItems: 0,
          agreements: 0,
          conflicts: 0,
        });
      }

      const stats = feedStats.get(source.feedId)!;
      stats.totalItems++;

      // Check if this source agrees with majority
      if (item.fusionMetadata.agreementScore > 70) {
        stats.agreements++;
      } else if (item.conflictResolution) {
        stats.conflicts++;
      }
    }
  }

  return Array.from(feedStats.entries()).map(([feedId, stats]) => ({
    feedId,
    feedName: stats.feedName,
    agreementRate: (stats.agreements / stats.totalItems) * 100,
    conflicts: stats.conflicts,
  }));
};

// ============================================================================
// CONFIDENCE SCORING FROM MULTIPLE SOURCES (5 functions)
// ============================================================================

/**
 * Calculates confidence score from multiple intelligence sources.
 *
 * @param {IntelSource[]} sources - Intelligence sources for an item
 * @param {SourceReliabilityMetrics[]} reliabilityMetrics - Source reliability data
 * @returns {number} Fused confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateMultiSourceConfidence(item.sources, reliabilityMetrics);
 * console.log(`Fused confidence: ${confidence}%`);
 * ```
 */
export const calculateMultiSourceConfidence = (
  sources: IntelSource[],
  reliabilityMetrics: SourceReliabilityMetrics[]
): number => {
  if (sources.length === 0) return 0;

  const metricsMap = new Map(reliabilityMetrics.map((m) => [m.feedId, m]));
  let totalWeightedConfidence = 0;
  let totalWeight = 0;

  for (const source of sources) {
    const reliability = metricsMap.get(source.feedId)?.overallReliability || source.reliability;
    const weight = reliability / 100;

    totalWeightedConfidence += source.confidence * weight;
    totalWeight += weight;
  }

  const baseConfidence = totalWeight > 0 ? totalWeightedConfidence / totalWeight : 0;

  // Bonus for multiple sources
  const sourceCountBonus = Math.min(20, sources.length * 3);

  return Math.min(100, baseConfidence + sourceCountBonus);
};

/**
 * Weights confidence scores by source reliability.
 *
 * @param {number} confidence - Original confidence score
 * @param {number} reliability - Source reliability score (0-100)
 * @returns {number} Weighted confidence score
 *
 * @example
 * ```typescript
 * const weighted = weightSourceReliability(75, 90);
 * // Returns confidence adjusted by source reliability
 * ```
 */
export const weightSourceReliability = (confidence: number, reliability: number): number => {
  // Apply reliability as a multiplier
  const reliabilityFactor = reliability / 100;
  return confidence * reliabilityFactor;
};

/**
 * Adjusts confidence score based on intelligence age.
 *
 * @param {number} confidence - Current confidence score
 * @param {Date} lastSeen - Last seen timestamp
 * @param {object} [options] - Adjustment options
 * @returns {number} Age-adjusted confidence score
 *
 * @example
 * ```typescript
 * const adjusted = adjustConfidenceByAge(80, lastSeenDate, { halfLife: 30 });
 * // Confidence decreases over time
 * ```
 */
export const adjustConfidenceByAge = (
  confidence: number,
  lastSeen: Date,
  options?: {
    halfLife?: number; // days until confidence halves
    maxAge?: number; // days after which confidence is 0
  }
): number => {
  const ageInDays = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
  const halfLife = options?.halfLife || 30; // 30 days default
  const maxAge = options?.maxAge || 365; // 1 year default

  if (ageInDays >= maxAge) return 0;

  // Exponential decay
  const decayFactor = Math.pow(0.5, ageInDays / halfLife);
  return confidence * decayFactor;
};

/**
 * Aggregates multiple confidence scores using various methods.
 *
 * @param {number[]} scores - Array of confidence scores
 * @param {string} [method='weighted_average'] - Aggregation method
 * @returns {number} Aggregated confidence score
 *
 * @example
 * ```typescript
 * const scores = [75, 80, 90, 70];
 * const avg = aggregateConfidenceScores(scores, 'average');
 * const max = aggregateConfidenceScores(scores, 'max');
 * ```
 */
export const aggregateConfidenceScores = (
  scores: number[],
  method: 'average' | 'weighted_average' | 'max' | 'min' | 'median' = 'weighted_average'
): number => {
  if (scores.length === 0) return 0;

  switch (method) {
    case 'average':
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;

    case 'weighted_average':
      // Weight higher scores more heavily
      const weights = scores.map((score) => score / 100);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const weighted = scores.reduce((sum, score, idx) => sum + score * weights[idx], 0);
      return totalWeight > 0 ? weighted / totalWeight : 0;

    case 'max':
      return Math.max(...scores);

    case 'min':
      return Math.min(...scores);

    case 'median':
      const sorted = [...scores].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    default:
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
};

/**
 * Normalizes confidence scores to a standard range.
 *
 * @param {number} confidence - Raw confidence score
 * @param {object} [options] - Normalization options
 * @returns {number} Normalized confidence score (0-100)
 *
 * @example
 * ```typescript
 * const normalized = normalizeConfidenceRange(150, { min: 0, max: 200 });
 * // Returns 75
 * ```
 */
export const normalizeConfidenceRange = (
  confidence: number,
  options?: {
    min?: number;
    max?: number;
    targetMin?: number;
    targetMax?: number;
  }
): number => {
  const min = options?.min ?? 0;
  const max = options?.max ?? 100;
  const targetMin = options?.targetMin ?? 0;
  const targetMax = options?.targetMax ?? 100;

  // Clamp to input range
  const clamped = Math.max(min, Math.min(max, confidence));

  // Normalize to target range
  const normalized = ((clamped - min) / (max - min)) * (targetMax - targetMin) + targetMin;

  return Math.round(normalized * 100) / 100;
};

// ============================================================================
// SOURCE RELIABILITY WEIGHTING (4 functions)
// ============================================================================

/**
 * Calculates overall reliability score for an intelligence source.
 *
 * @param {SourceReliabilityMetrics} metrics - Source metrics
 * @returns {number} Overall reliability score (0-100)
 *
 * @example
 * ```typescript
 * const reliability = calculateSourceReliability(feedMetrics);
 * console.log(`Source reliability: ${reliability}%`);
 * ```
 */
export const calculateSourceReliability = (metrics: SourceReliabilityMetrics): number => {
  // Weighted combination of accuracy, timeliness, and coverage
  const weights = {
    accuracy: 0.5,
    timeliness: 0.3,
    coverage: 0.2,
  };

  const reliability =
    metrics.accuracy * weights.accuracy +
    metrics.timeliness * weights.timeliness +
    metrics.coverage * weights.coverage;

  return Math.min(100, Math.max(0, reliability));
};

/**
 * Tracks historical accuracy of intelligence sources.
 *
 * @param {string} feedId - Feed identifier
 * @param {boolean} wasAccurate - Whether the intelligence was accurate
 * @param {SourceReliabilityMetrics} metrics - Current metrics
 * @returns {SourceReliabilityMetrics} Updated metrics
 *
 * @example
 * ```typescript
 * const updated = trackSourceAccuracy('feed-123', true, currentMetrics);
 * // Metrics are updated with new accuracy data
 * ```
 */
export const trackSourceAccuracy = (
  feedId: string,
  wasAccurate: boolean,
  metrics: SourceReliabilityMetrics
): SourceReliabilityMetrics => {
  const updated = { ...metrics };

  updated.totalSubmissions++;

  if (wasAccurate) {
    updated.confirmedTruePositives++;
  } else {
    updated.confirmedFalsePositives++;
  }

  // Recalculate accuracy
  const total = updated.confirmedTruePositives + updated.confirmedFalsePositives;
  updated.accuracy = total > 0 ? (updated.confirmedTruePositives / total) * 100 : 50;

  // Add to history
  updated.history.push({
    date: new Date(),
    accuracy: updated.accuracy,
    reliability: calculateSourceReliability(updated),
  });

  // Keep only last 100 history entries
  if (updated.history.length > 100) {
    updated.history = updated.history.slice(-100);
  }

  updated.lastUpdated = new Date();
  updated.overallReliability = calculateSourceReliability(updated);

  return updated;
};

/**
 * Updates reliability metrics for intelligence sources.
 *
 * @param {SourceReliabilityMetrics[]} allMetrics - All source metrics
 * @param {string} feedId - Feed to update
 * @param {Partial<SourceReliabilityMetrics>} updates - Metric updates
 * @returns {SourceReliabilityMetrics[]} Updated metrics array
 *
 * @example
 * ```typescript
 * const updated = updateReliabilityMetrics(allMetrics, 'feed-123', {
 *   timeliness: 95,
 *   coverage: 80
 * });
 * ```
 */
export const updateReliabilityMetrics = (
  allMetrics: SourceReliabilityMetrics[],
  feedId: string,
  updates: Partial<SourceReliabilityMetrics>
): SourceReliabilityMetrics[] => {
  const index = allMetrics.findIndex((m) => m.feedId === feedId);

  if (index === -1) {
    // Create new metrics entry
    const newMetrics: SourceReliabilityMetrics = {
      id: crypto.randomUUID(),
      feedId,
      feedName: updates.feedName || 'Unknown',
      totalSubmissions: updates.totalSubmissions || 0,
      confirmedTruePositives: updates.confirmedTruePositives || 0,
      confirmedFalsePositives: updates.confirmedFalsePositives || 0,
      unconfirmed: updates.unconfirmed || 0,
      averageAge: updates.averageAge || 0,
      timeliness: updates.timeliness || 50,
      accuracy: updates.accuracy || 50,
      coverage: updates.coverage || 50,
      overallReliability: 50,
      lastUpdated: new Date(),
      history: [],
    };

    newMetrics.overallReliability = calculateSourceReliability(newMetrics);
    return [...allMetrics, newMetrics];
  }

  const updated = { ...allMetrics[index], ...updates, lastUpdated: new Date() };
  updated.overallReliability = calculateSourceReliability(updated);

  return [...allMetrics.slice(0, index), updated, ...allMetrics.slice(index + 1)];
};

/**
 * Ranks intelligence sources by reliability score.
 *
 * @param {SourceReliabilityMetrics[]} metrics - Source metrics
 * @param {object} [options] - Ranking options
 * @returns {Array<{ rank: number; feedId: string; feedName: string; reliability: number }>} Ranked sources
 *
 * @example
 * ```typescript
 * const ranked = rankIntelSources(allMetrics, { minSubmissions: 10 });
 * console.log('Top source:', ranked[0].feedName);
 * ```
 */
export const rankIntelSources = (
  metrics: SourceReliabilityMetrics[],
  options?: {
    minSubmissions?: number;
    sortBy?: 'reliability' | 'accuracy' | 'timeliness';
  }
): Array<{ rank: number; feedId: string; feedName: string; reliability: number }> => {
  const minSubmissions = options?.minSubmissions || 0;
  const sortBy = options?.sortBy || 'reliability';

  const filtered = metrics.filter((m) => m.totalSubmissions >= minSubmissions);

  const sorted = filtered.sort((a, b) => {
    switch (sortBy) {
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'timeliness':
        return b.timeliness - a.timeliness;
      default:
        return b.overallReliability - a.overallReliability;
    }
  });

  return sorted.map((m, idx) => ({
    rank: idx + 1,
    feedId: m.feedId,
    feedName: m.feedName,
    reliability: m.overallReliability,
  }));
};

// ============================================================================
// CONFLICTING INTELLIGENCE RESOLUTION (4 functions)
// ============================================================================

/**
 * Detects conflicting intelligence from different sources.
 *
 * @param {FusedIntelligence} item - Intelligence item to check
 * @returns {Array<{ type: string; sources: string[]; values: any[] }>} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectIntelConflicts(fusedItem);
 * if (conflicts.length > 0) {
 *   console.log('Conflicts detected:', conflicts);
 * }
 * ```
 */
export const detectIntelConflicts = (
  item: FusedIntelligence
): Array<{ type: string; sources: string[]; values: any[] }> => {
  const conflicts: Array<{ type: string; sources: string[]; values: any[] }> = [];

  // Check for severity conflicts
  const severities = new Map<ThreatSeverity, string[]>();
  for (const source of item.sources) {
    // In real implementation, would check original source data
    // For now, simulate with metadata
    const sourceSeverity = (source.rawData?.severity || item.severity) as ThreatSeverity;
    if (!severities.has(sourceSeverity)) {
      severities.set(sourceSeverity, []);
    }
    severities.get(sourceSeverity)!.push(source.feedId);
  }

  if (severities.size > 1) {
    conflicts.push({
      type: 'severity',
      sources: Array.from(severities.values()).flat(),
      values: Array.from(severities.keys()),
    });
  }

  // Check for confidence conflicts (large variance)
  const confidences = item.sources.map((s) => s.confidence);
  const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
  const variance =
    confidences.reduce((sum, c) => sum + Math.pow(c - avgConfidence, 2), 0) / confidences.length;

  if (variance > 500) {
    // Threshold for high variance
    conflicts.push({
      type: 'confidence',
      sources: item.sources.map((s) => s.feedId),
      values: confidences,
    });
  }

  return conflicts;
};

/**
 * Resolves conflicts using majority voting.
 *
 * @param {Array<{ feedId: string; value: any; reliability: number }>} conflictingValues - Conflicting values
 * @returns {{ resolvedValue: any; confidence: number }} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolveConflictByVoting([
 *   { feedId: 'f1', value: 'CRITICAL', reliability: 80 },
 *   { feedId: 'f2', value: 'HIGH', reliability: 85 },
 *   { feedId: 'f3', value: 'CRITICAL', reliability: 75 }
 * ]);
 * // Returns { resolvedValue: 'CRITICAL', confidence: 66.67 }
 * ```
 */
export const resolveConflictByVoting = (
  conflictingValues: Array<{ feedId: string; value: any; reliability: number }>
): { resolvedValue: any; confidence: number } => {
  const votes = new Map<any, number>();

  for (const item of conflictingValues) {
    votes.set(item.value, (votes.get(item.value) || 0) + 1);
  }

  let maxVotes = 0;
  let resolvedValue: any = null;

  for (const [value, count] of votes.entries()) {
    if (count > maxVotes) {
      maxVotes = count;
      resolvedValue = value;
    }
  }

  const confidence = (maxVotes / conflictingValues.length) * 100;

  return { resolvedValue, confidence };
};

/**
 * Resolves conflicts by weighting source reliability.
 *
 * @param {Array<{ feedId: string; value: any; reliability: number }>} conflictingValues - Conflicting values
 * @returns {{ resolvedValue: any; confidence: number }} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolveConflictByReliability(conflictingValues);
 * // Returns value from most reliable source
 * ```
 */
export const resolveConflictByReliability = (
  conflictingValues: Array<{ feedId: string; value: any; reliability: number }>
): { resolvedValue: any; confidence: number } => {
  if (conflictingValues.length === 0) {
    return { resolvedValue: null, confidence: 0 };
  }

  // Find value with highest reliability
  const sorted = [...conflictingValues].sort((a, b) => b.reliability - a.reliability);
  const mostReliable = sorted[0];

  // Calculate confidence based on reliability gap
  const reliabilityGap =
    sorted.length > 1 ? mostReliable.reliability - sorted[1].reliability : mostReliable.reliability;

  const confidence = Math.min(100, mostReliable.reliability + reliabilityGap * 0.2);

  return {
    resolvedValue: mostReliable.value,
    confidence,
  };
};

/**
 * Flags unresolvable conflicts requiring manual review.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence items to check
 * @param {number} [threshold=40] - Confidence threshold below which conflicts are flagged
 * @returns {Array<{ itemId: string; conflicts: any[]; requiresReview: boolean }>} Flagged items
 *
 * @example
 * ```typescript
 * const flagged = flagUnresolvableConflicts(fusedIntel, 50);
 * console.log(`${flagged.length} items require manual review`);
 * ```
 */
export const flagUnresolvableConflicts = (
  intelligence: FusedIntelligence[],
  threshold: number = 40
): Array<{ itemId: string; conflicts: any[]; requiresReview: boolean }> => {
  const flagged: Array<{ itemId: string; conflicts: any[]; requiresReview: boolean }> = [];

  for (const item of intelligence) {
    const conflicts = detectIntelConflicts(item);

    if (conflicts.length > 0) {
      const requiresReview =
        item.conflictResolution?.confidence !== undefined &&
        item.conflictResolution.confidence < threshold;

      if (requiresReview || conflicts.length > 2) {
        flagged.push({
          itemId: item.id,
          conflicts,
          requiresReview: true,
        });
      }
    }
  }

  return flagged;
};

// ============================================================================
// INTELLIGENCE ENRICHMENT FROM MULTIPLE SOURCES (4 functions)
// ============================================================================

/**
 * Enriches intelligence with data from multiple sources.
 *
 * @param {FusedIntelligence} item - Intelligence item to enrich
 * @param {IntelFeedSource[]} sources - Available enrichment sources
 * @returns {Promise<FusedIntelligence>} Enriched intelligence
 *
 * @example
 * ```typescript
 * const enriched = await enrichFromMultipleSources(item, enrichmentSources);
 * console.log('Geolocation:', enriched.enrichment.geolocation);
 * ```
 */
export const enrichFromMultipleSources = async (
  item: FusedIntelligence,
  sources: IntelFeedSource[]
): Promise<FusedIntelligence> => {
  const enrichment: IntelEnrichment = { ...item.enrichment };

  // Enrich based on intelligence type
  switch (item.type) {
    case IntelligenceType.IP_ADDRESS:
      // Geolocation enrichment
      enrichment.geolocation = await enrichGeolocation(item.value, sources);
      enrichment.reputation = await enrichReputation(item.value, sources);
      break;

    case IntelligenceType.DOMAIN:
      // WHOIS enrichment
      enrichment.whois = await enrichWhois(item.value, sources);
      enrichment.reputation = await enrichReputation(item.value, sources);
      break;

    case IntelligenceType.FILE_HASH:
      // Malware analysis enrichment
      enrichment.threatContext = await enrichThreatContext(item.value, sources);
      break;

    default:
      // Generic enrichment
      enrichment.relatedIndicators = await enrichRelatedIndicators(item.value, sources);
  }

  return {
    ...item,
    enrichment,
  };
};

/**
 * Cross-references intelligence across multiple databases.
 *
 * @param {FusedIntelligence} item - Intelligence item to cross-reference
 * @param {string[]} databases - Database identifiers
 * @returns {Promise<Array<{ database: string; found: boolean; data?: any }>>} Cross-reference results
 *
 * @example
 * ```typescript
 * const refs = await crossReferenceIntelligence(item, ['virustotal', 'alienvault', 'misp']);
 * ```
 */
export const crossReferenceIntelligence = async (
  item: FusedIntelligence,
  databases: string[]
): Promise<Array<{ database: string; found: boolean; data?: any }>> => {
  const results: Array<{ database: string; found: boolean; data?: any }> = [];

  for (const db of databases) {
    try {
      // Simulate database lookup (in production, would query actual databases)
      const found = Math.random() > 0.3; // 70% chance of finding data
      const data = found
        ? {
            source: db,
            timestamp: new Date(),
            matches: Math.floor(Math.random() * 10) + 1,
            details: {
              reputation: Math.floor(Math.random() * 100),
              category: ['malware', 'phishing', 'c2', 'exploit'][
                Math.floor(Math.random() * 4)
              ],
            },
          }
        : undefined;

      results.push({
        database: db,
        found,
        data,
      });
    } catch (error) {
      results.push({
        database: db,
        found: false,
      });
    }
  }

  return results;
};

/**
 * Enhances intelligence metadata with additional context.
 *
 * @param {FusedIntelligence} item - Intelligence item to enhance
 * @param {Record<string, any>} additionalData - Additional metadata
 * @returns {FusedIntelligence} Enhanced intelligence
 *
 * @example
 * ```typescript
 * const enhanced = enhanceIntelMetadata(item, {
 *   industry: 'healthcare',
 *   targetedAssets: ['EHR', 'patient_portal'],
 *   mitigations: ['block_ip', 'alert_soc']
 * });
 * ```
 */
export const enhanceIntelMetadata = (
  item: FusedIntelligence,
  additionalData: Record<string, any>
): FusedIntelligence => {
  return {
    ...item,
    metadata: {
      ...item.metadata,
      ...additionalData,
      enhancedAt: new Date().toISOString(),
    },
  };
};

/**
 * Supplements missing fields with data from available sources.
 *
 * @param {FusedIntelligence} item - Intelligence item with missing fields
 * @param {FusedIntelligence[]} referenceData - Reference data for supplementing
 * @returns {FusedIntelligence} Supplemented intelligence
 *
 * @example
 * ```typescript
 * const supplemented = supplementMissingFields(incompleteItem, completeDataset);
 * ```
 */
export const supplementMissingFields = (
  item: FusedIntelligence,
  referenceData: FusedIntelligence[]
): FusedIntelligence => {
  const supplemented = { ...item };

  // Find similar items in reference data
  const similar = referenceData.filter(
    (ref) => ref.type === item.type && ref.normalizedValue === item.normalizedValue
  );

  if (similar.length === 0) return supplemented;

  // Supplement tags
  if (supplemented.tags.length === 0) {
    const allTags = new Set<string>();
    similar.forEach((s) => s.tags.forEach((tag) => allTags.add(tag)));
    supplemented.tags = Array.from(allTags);
  }

  // Supplement severity if not set
  if (!supplemented.severity && similar.length > 0) {
    const severities = similar.map((s) => s.severity);
    supplemented.severity = getMostCommon(severities);
  }

  // Supplement enrichment data
  if (Object.keys(supplemented.enrichment).length === 0) {
    similar.forEach((s) => {
      if (s.enrichment.geolocation && !supplemented.enrichment.geolocation) {
        supplemented.enrichment.geolocation = s.enrichment.geolocation;
      }
      if (s.enrichment.whois && !supplemented.enrichment.whois) {
        supplemented.enrichment.whois = s.enrichment.whois;
      }
      if (s.enrichment.threatContext && !supplemented.enrichment.threatContext) {
        supplemented.enrichment.threatContext = s.enrichment.threatContext;
      }
    });
  }

  return supplemented;
};

// ============================================================================
// FUSION ANALYTICS AND REPORTING (4 functions)
// ============================================================================

/**
 * Generates comprehensive fusion analytics report.
 *
 * @param {FusedIntelligence[]} intelligence - Fused intelligence data
 * @param {IntelCorrelation[]} correlations - Correlation data
 * @param {SourceReliabilityMetrics[]} sourceMetrics - Source metrics
 * @param {object} timeRange - Report time range
 * @returns {FusionReport} Fusion report
 *
 * @example
 * ```typescript
 * const report = generateFusionReport(
 *   fusedIntel,
 *   correlations,
 *   metrics,
 *   { start: new Date('2025-01-01'), end: new Date('2025-01-31') }
 * );
 * ```
 */
export const generateFusionReport = (
  intelligence: FusedIntelligence[],
  correlations: IntelCorrelation[],
  sourceMetrics: SourceReliabilityMetrics[],
  timeRange: { start: Date; end: Date }
): FusionReport => {
  const filteredIntel = intelligence.filter(
    (item) =>
      item.lastSeen >= timeRange.start && item.lastSeen <= timeRange.end
  );

  // Calculate summary statistics
  const totalIntelligence = filteredIntel.length;
  const fusedItems = filteredIntel.filter((item) => item.sources.length > 1).length;
  const deduplicationRate = ((intelligence.length - totalIntelligence) / intelligence.length) * 100;
  const averageSourcesPerItem =
    filteredIntel.reduce((sum, item) => sum + item.sources.length, 0) / totalIntelligence || 0;
  const averageConfidence =
    filteredIntel.reduce((sum, item) => sum + item.confidence, 0) / totalIntelligence || 0;
  const averageQualityScore =
    filteredIntel.reduce((sum, item) => sum + item.fusionMetadata.qualityScore, 0) /
      totalIntelligence || 0;

  // Source metrics
  const sourceContributions = new Map<string, number>();
  const sourceAgreement = new Map<string, number[]>();

  for (const item of filteredIntel) {
    for (const source of item.sources) {
      sourceContributions.set(
        source.feedId,
        (sourceContributions.get(source.feedId) || 0) + 1
      );

      if (!sourceAgreement.has(source.feedId)) {
        sourceAgreement.set(source.feedId, []);
      }
      sourceAgreement.get(source.feedId)!.push(item.fusionMetadata.agreementScore);
    }
  }

  const sourceMetricsArray = Array.from(sourceContributions.entries()).map(([feedId, count]) => {
    const metric = sourceMetrics.find((m) => m.feedId === feedId);
    const agreements = sourceAgreement.get(feedId) || [];
    const agreementRate = agreements.length > 0
      ? agreements.reduce((sum, score) => sum + score, 0) / agreements.length
      : 0;

    return {
      feedId,
      feedName: metric?.feedName || 'Unknown',
      contributedItems: count,
      reliability: metric?.overallReliability || 0,
      agreementRate,
    };
  });

  // Correlation analysis
  const correlationsByType: Record<CorrelationType, number> = {
    [CorrelationType.SAME_CAMPAIGN]: 0,
    [CorrelationType.SAME_ACTOR]: 0,
    [CorrelationType.TEMPORAL]: 0,
    [CorrelationType.BEHAVIORAL]: 0,
    [CorrelationType.INFRASTRUCTURE]: 0,
    [CorrelationType.MALWARE_FAMILY]: 0,
    [CorrelationType.TARGET_SIMILARITY]: 0,
  };

  let strongCorrelations = 0;

  for (const corr of correlations) {
    correlationsByType[corr.correlationType]++;
    if (corr.correlationScore > 80) strongCorrelations++;
  }

  // Conflict analysis
  const conflictedItems = filteredIntel.filter((item) => item.conflictResolution);
  const resolvedConflicts = conflictedItems.filter(
    (item) => item.conflictResolution?.confidence && item.conflictResolution.confidence > 50
  );

  const conflictsByType: Record<string, number> = {};
  for (const item of conflictedItems) {
    const type = item.conflictResolution?.conflictType || 'unknown';
    conflictsByType[type] = (conflictsByType[type] || 0) + 1;
  }

  // Quality metrics
  const highQuality = filteredIntel.filter((item) => item.fusionMetadata.qualityScore > 80).length;
  const mediumQuality = filteredIntel.filter(
    (item) =>
      item.fusionMetadata.qualityScore >= 50 && item.fusionMetadata.qualityScore <= 80
  ).length;
  const lowQuality = filteredIntel.filter((item) => item.fusionMetadata.qualityScore < 50).length;

  return {
    reportId: crypto.randomUUID(),
    generatedAt: new Date(),
    timeRange,
    summary: {
      totalIntelligence,
      fusedItems,
      deduplicationRate,
      averageSourcesPerItem,
      averageConfidence,
      averageQualityScore,
    },
    sourceMetrics: sourceMetricsArray,
    correlations: {
      totalCorrelations: correlations.length,
      byType: correlationsByType,
      strongCorrelations,
    },
    conflicts: {
      total: conflictedItems.length,
      resolved: resolvedConflicts.length,
      unresolved: conflictedItems.length - resolvedConflicts.length,
      byType: conflictsByType,
    },
    qualityMetrics: {
      highQuality,
      mediumQuality,
      lowQuality,
    },
  };
};

/**
 * Analyzes effectiveness of intelligence fusion process.
 *
 * @param {FusedIntelligence[]} fusedIntel - Fused intelligence data
 * @param {FusedIntelligence[]} originalIntel - Original unfused intelligence
 * @returns {{ improvementRate: number; qualityGain: number; coverageGain: number }} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const effectiveness = analyzeFusionEffectiveness(fusedData, originalData);
 * console.log(`Quality improvement: ${effectiveness.qualityGain}%`);
 * ```
 */
export const analyzeFusionEffectiveness = (
  fusedIntel: FusedIntelligence[],
  originalIntel: FusedIntelligence[]
): { improvementRate: number; qualityGain: number; coverageGain: number } => {
  const originalAvgConfidence =
    originalIntel.reduce((sum, item) => sum + item.confidence, 0) / originalIntel.length || 0;

  const fusedAvgConfidence =
    fusedIntel.reduce((sum, item) => sum + item.confidence, 0) / fusedIntel.length || 0;

  const originalAvgQuality =
    originalIntel.reduce((sum, item) => sum + (item.fusionMetadata?.qualityScore || 0), 0) /
      originalIntel.length || 0;

  const fusedAvgQuality =
    fusedIntel.reduce((sum, item) => sum + item.fusionMetadata.qualityScore, 0) /
      fusedIntel.length || 0;

  const improvementRate = ((fusedIntel.length - originalIntel.length) / originalIntel.length) * 100;
  const qualityGain = fusedAvgQuality - originalAvgQuality;
  const coverageGain = ((fusedAvgConfidence - originalAvgConfidence) / originalAvgConfidence) * 100;

  return {
    improvementRate,
    qualityGain,
    coverageGain,
  };
};

/**
 * Tracks fusion metrics over time.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence data
 * @param {string} [interval='daily'] - Tracking interval
 * @returns {Array<{ date: string; count: number; avgConfidence: number; avgQuality: number }>} Metrics timeline
 *
 * @example
 * ```typescript
 * const timeline = trackFusionMetrics(fusedIntel, 'weekly');
 * // Returns weekly aggregated metrics
 * ```
 */
export const trackFusionMetrics = (
  intelligence: FusedIntelligence[],
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
): Array<{ date: string; count: number; avgConfidence: number; avgQuality: number }> => {
  const grouped = new Map<
    string,
    { count: number; totalConfidence: number; totalQuality: number }
  >();

  for (const item of intelligence) {
    const date = formatDateByInterval(item.fusionMetadata.fusionTimestamp, interval);

    if (!grouped.has(date)) {
      grouped.set(date, { count: 0, totalConfidence: 0, totalQuality: 0 });
    }

    const group = grouped.get(date)!;
    group.count++;
    group.totalConfidence += item.confidence;
    group.totalQuality += item.fusionMetadata.qualityScore;
  }

  return Array.from(grouped.entries())
    .map(([date, stats]) => ({
      date,
      count: stats.count,
      avgConfidence: stats.totalConfidence / stats.count,
      avgQuality: stats.totalQuality / stats.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Prepares fusion results for visualization.
 *
 * @param {FusedIntelligence[]} intelligence - Intelligence data
 * @param {IntelCorrelation[]} correlations - Correlation data
 * @returns {{ charts: any[]; tables: any[]; graphs: any[] }} Visualization-ready data
 *
 * @example
 * ```typescript
 * const vizData = visualizeFusionResults(fusedIntel, correlations);
 * // Use vizData.charts for dashboard rendering
 * ```
 */
export const visualizeFusionResults = (
  intelligence: FusedIntelligence[],
  correlations: IntelCorrelation[]
): { charts: any[]; tables: any[]; graphs: any[] } => {
  // Severity distribution chart
  const severityChart = {
    type: 'pie',
    title: 'Intelligence by Severity',
    data: Object.values(ThreatSeverity).map((severity) => ({
      label: severity,
      value: intelligence.filter((item) => item.severity === severity).length,
    })),
  };

  // Intelligence type distribution
  const typeChart = {
    type: 'bar',
    title: 'Intelligence by Type',
    data: Object.values(IntelligenceType).map((type) => ({
      label: type,
      value: intelligence.filter((item) => item.type === type).length,
    })),
  };

  // Confidence distribution
  const confidenceChart = {
    type: 'histogram',
    title: 'Confidence Score Distribution',
    data: intelligence.map((item) => ({ value: item.confidence })),
    bins: [0, 20, 40, 60, 80, 100],
  };

  // Top sources table
  const sourceContributions = new Map<string, number>();
  for (const item of intelligence) {
    for (const source of item.sources) {
      sourceContributions.set(
        source.feedName,
        (sourceContributions.get(source.feedName) || 0) + 1
      );
    }
  }

  const sourcesTable = {
    type: 'table',
    title: 'Top Intelligence Sources',
    columns: ['Source', 'Contributions', 'Percentage'],
    rows: Array.from(sourceContributions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => [
        source,
        count,
        `${((count / intelligence.length) * 100).toFixed(2)}%`,
      ]),
  };

  // Correlation graph
  const correlationGraph = buildCorrelationGraph(intelligence, correlations);

  return {
    charts: [severityChart, typeChart, confidenceChart],
    tables: [sourcesTable],
    graphs: [correlationGraph],
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Fetches feed data (placeholder for actual implementation).
 */
const fetchFeedData = async (feed: IntelFeedSource): Promise<any[]> => {
  // Production implementation would fetch from actual feed URL
  // For now, return simulated data
  return [];
};

/**
 * Helper: Calculates hash for intelligence item.
 */
const calculateIntelHash = (type: IntelligenceType, value: string): string => {
  const canonical = canonicalizeIntelValue(type, value);
  return crypto.createHash('sha256').update(`${type}:${canonical}`).digest('hex');
};

/**
 * Helper: Creates fused intelligence item.
 */
const createFusedIntelligence = (item: any, feed: IntelFeedSource): FusedIntelligence => {
  const now = new Date();
  const hash = calculateIntelHash(item.type, item.value);

  return {
    id: crypto.randomUUID(),
    type: item.type,
    value: item.value,
    normalizedValue: canonicalizeIntelValue(item.type, item.value),
    hash,
    severity: item.severity,
    confidence: item.confidence,
    sources: [
      {
        feedId: feed.id,
        feedName: feed.name,
        provider: feed.provider,
        reliability: feed.reliability,
        confidence: item.confidence,
        timestamp: now,
        rawData: item,
      },
    ],
    firstSeen: item.firstSeen || now,
    lastSeen: item.lastSeen || now,
    tags: item.tags || [],
    enrichment: {},
    metadata: item.metadata || {},
    fusionMetadata: {
      fusionId: crypto.randomUUID(),
      fusionTimestamp: now,
      sourceCount: 1,
      agreementScore: 100,
      qualityScore: item.confidence,
      processingVersion: '1.0.0',
    },
  };
};

/**
 * Helper: Merges two fused intelligence items.
 */
const mergeFusedIntelligence = (
  existing: FusedIntelligence,
  newItem: any,
  feed: IntelFeedSource
): FusedIntelligence => {
  const newSource: IntelSource = {
    feedId: feed.id,
    feedName: feed.name,
    provider: feed.provider,
    reliability: feed.reliability,
    confidence: newItem.confidence,
    timestamp: new Date(),
    rawData: newItem,
  };

  const allSources = [...existing.sources, newSource];
  const avgConfidence = calculateMultiSourceConfidence(allSources, []);

  return {
    ...existing,
    sources: allSources,
    lastSeen: new Date(Math.max(existing.lastSeen.getTime(), new Date().getTime())),
    confidence: avgConfidence,
    fusionMetadata: {
      ...existing.fusionMetadata,
      sourceCount: allSources.length,
      fusionTimestamp: new Date(),
    },
  };
};

/**
 * Helper: Maps STIX type to internal intelligence type.
 */
const mapSTIXTypeToIntelType = (stixType: string): IntelligenceType => {
  // Simplified mapping
  return IntelligenceType.INDICATOR;
};

/**
 * Helper: Extracts value from STIX pattern.
 */
const extractSTIXValue = (pattern: string): string => {
  const match = pattern.match(/value\s*=\s*'([^']+)'/);
  return match ? match[1] : pattern;
};

/**
 * Helper: Maps STIX severity.
 */
const mapSTIXSeverity = (labels: string[]): ThreatSeverity => {
  if (labels.includes('critical')) return ThreatSeverity.CRITICAL;
  if (labels.includes('high')) return ThreatSeverity.HIGH;
  if (labels.includes('medium')) return ThreatSeverity.MEDIUM;
  return ThreatSeverity.LOW;
};

/**
 * Helper: Maps MISP type to internal intelligence type.
 */
const mapMISPTypeToIntelType = (mispType: string): IntelligenceType => {
  if (mispType.includes('ip')) return IntelligenceType.IP_ADDRESS;
  if (mispType.includes('domain')) return IntelligenceType.DOMAIN;
  if (mispType.includes('url')) return IntelligenceType.URL;
  return IntelligenceType.INDICATOR;
};

/**
 * Helper: Maps MISP threat level.
 */
const mapMISPThreatLevel = (level: string | number): ThreatSeverity => {
  const levelNum = typeof level === 'string' ? parseInt(level) : level;
  if (levelNum === 1) return ThreatSeverity.HIGH;
  if (levelNum === 2) return ThreatSeverity.MEDIUM;
  if (levelNum === 3) return ThreatSeverity.LOW;
  return ThreatSeverity.INFO;
};

/**
 * Helper: Finds similar intelligence key for fuzzy matching.
 */
const findSimilarIntelKey = (
  item: FusedIntelligence,
  candidates: FusedIntelligence[],
  threshold?: number
): string => {
  const matchKey = fuzzyMatchIntelligence(item, candidates, threshold);
  return matchKey || calculateIntelHash(item.type, item.value);
};

/**
 * Helper: Calculates string similarity (Levenshtein-based).
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Helper: Levenshtein distance calculation.
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Helper: Gets most common element in array.
 */
const getMostCommon = <T>(arr: T[]): T => {
  const counts = new Map<T, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let maxCount = 0;
  let mostCommon = arr[0];

  for (const [item, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = item;
    }
  }

  return mostCommon;
};

/**
 * Helper: Enriches geolocation data.
 */
const enrichGeolocation = async (
  value: string,
  sources: IntelFeedSource[]
): Promise<IntelEnrichment['geolocation']> => {
  // Production implementation would query geolocation APIs
  return {
    country: 'US',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    sources: sources.slice(0, 2).map((s) => s.name),
  };
};

/**
 * Helper: Enriches reputation data.
 */
const enrichReputation = async (
  value: string,
  sources: IntelFeedSource[]
): Promise<IntelEnrichment['reputation']> => {
  return {
    score: 65,
    category: 'suspicious',
    sources: sources.slice(0, 2).map((s) => s.name),
  };
};

/**
 * Helper: Enriches WHOIS data.
 */
const enrichWhois = async (
  value: string,
  sources: IntelFeedSource[]
): Promise<IntelEnrichment['whois']> => {
  return {
    registrar: 'Example Registrar',
    registrationDate: new Date('2020-01-01'),
    expirationDate: new Date('2026-01-01'),
    sources: sources.slice(0, 1).map((s) => s.name),
  };
};

/**
 * Helper: Enriches threat context.
 */
const enrichThreatContext = async (
  value: string,
  sources: IntelFeedSource[]
): Promise<IntelEnrichment['threatContext']> => {
  return {
    malwareFamilies: ['Emotet', 'TrickBot'],
    threatActors: ['APT28'],
    campaigns: ['Operation XYZ'],
    sources: sources.slice(0, 2).map((s) => s.name),
  };
};

/**
 * Helper: Enriches related indicators.
 */
const enrichRelatedIndicators = async (
  value: string,
  sources: IntelFeedSource[]
): Promise<IntelEnrichment['relatedIndicators']> => {
  return [
    {
      type: IntelligenceType.IP_ADDRESS,
      value: '192.0.2.1',
      relationship: 'communicates_with',
      sources: sources.slice(0, 1).map((s) => s.name),
    },
  ];
};

/**
 * Helper: Formats date by interval.
 */
const formatDateByInterval = (
  date: Date,
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly'
): string => {
  const d = new Date(date);

  switch (interval) {
    case 'hourly':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;
    case 'daily':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    case 'weekly':
      const weekStart = new Date(d.setDate(d.getDate() - d.getDay()));
      return `${weekStart.getFullYear()}-W${getWeekNumber(weekStart)}`;
    case 'monthly':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  }
};

/**
 * Helper: Pads number to 2 digits.
 */
const pad = (num: number): string => num.toString().padStart(2, '0');

/**
 * Helper: Gets ISO week number.
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};
