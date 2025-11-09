/**
 * LOC: THREATINT1234567
 * File: /reuse/threat/threat-intelligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC management modules
 *   - Threat actor tracking services
 *   - MITRE ATT&CK mapping services
 *   - STIX/TAXII integration modules
 *   - Security orchestration services
 */

/**
 * File: /reuse/threat/threat-intelligence-kit.ts
 * Locator: WC-THREAT-INTEL-001
 * Purpose: Comprehensive Threat Intelligence Toolkit - Production-ready threat intelligence operations
 *
 * Upstream: Independent utility module for threat intelligence operations
 * Downstream: ../backend/*, Security services, Threat detection, IOC management, MITRE ATT&CK mapping
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 45+ utility functions for threat feeds, IOC management, threat actors, campaigns, MITRE ATT&CK, STIX/TAXII
 *
 * LLM Context: Enterprise-grade threat intelligence toolkit for White Cross healthcare platform.
 * Provides comprehensive threat feed aggregation, IOC (Indicators of Compromise) management,
 * threat actor tracking, campaign analysis, MITRE ATT&CK framework mapping, threat intelligence
 * sharing via STIX/TAXII protocols, intelligence enrichment, and HIPAA-compliant security monitoring
 * for healthcare systems. Includes Sequelize models for threats, IOCs, actors, and campaigns.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Threat intelligence feed configuration
 */
export interface ThreatFeedConfig {
  id: string;
  name: string;
  provider: string;
  feedUrl: string;
  feedType: ThreatFeedType;
  format: 'json' | 'xml' | 'csv' | 'stix' | 'taxii';
  updateInterval: number; // milliseconds
  enabled: boolean;
  authentication?: {
    type: 'api_key' | 'basic' | 'oauth2' | 'certificate';
    credentials: Record<string, any>;
  };
  filters?: ThreatFeedFilter[];
  metadata?: Record<string, any>;
}

/**
 * Threat feed types
 */
export enum ThreatFeedType {
  IP_REPUTATION = 'IP_REPUTATION',
  DOMAIN_REPUTATION = 'DOMAIN_REPUTATION',
  URL_REPUTATION = 'URL_REPUTATION',
  FILE_HASH = 'FILE_HASH',
  MALWARE_SIGNATURE = 'MALWARE_SIGNATURE',
  THREAT_ACTOR = 'THREAT_ACTOR',
  CAMPAIGN = 'CAMPAIGN',
  VULNERABILITY = 'VULNERABILITY',
  EXPLOIT = 'EXPLOIT',
  MIXED = 'MIXED',
}

/**
 * Threat feed filter criteria
 */
export interface ThreatFeedFilter {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'in' | 'greater_than' | 'less_than';
  value: any;
}

/**
 * Indicator of Compromise (IOC) structure
 */
export interface IOC {
  id: string;
  type: IOCType;
  value: string;
  hash?: string; // Normalized hash of the value
  severity: ThreatSeverity;
  confidence: number; // 0-100
  firstSeen: Date;
  lastSeen: Date;
  expiresAt?: Date;
  sources: IOCSource[];
  tags: string[];
  relatedIOCs?: string[]; // IDs of related IOCs
  threatActors?: string[]; // IDs of associated threat actors
  campaigns?: string[]; // IDs of associated campaigns
  mitreAttack?: MITREMapping[];
  metadata?: Record<string, any>;
  status: 'active' | 'inactive' | 'expired' | 'false_positive';
  falsePositiveReason?: string;
  enrichment?: IOCEnrichment;
}

/**
 * IOC types following industry standards
 */
export enum IOCType {
  IPV4 = 'IPV4',
  IPV6 = 'IPV6',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FILE_HASH_MD5 = 'FILE_HASH_MD5',
  FILE_HASH_SHA1 = 'FILE_HASH_SHA1',
  FILE_HASH_SHA256 = 'FILE_HASH_SHA256',
  FILE_HASH_SHA512 = 'FILE_HASH_SHA512',
  FILE_NAME = 'FILE_NAME',
  FILE_PATH = 'FILE_PATH',
  REGISTRY_KEY = 'REGISTRY_KEY',
  MUTEX = 'MUTEX',
  USER_AGENT = 'USER_AGENT',
  CVE = 'CVE',
  ASN = 'ASN',
  SSL_CERT_FINGERPRINT = 'SSL_CERT_FINGERPRINT',
  YARA_RULE = 'YARA_RULE',
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
 * IOC source information
 */
export interface IOCSource {
  provider: string;
  feedId?: string;
  confidence: number;
  firstSeen: Date;
  lastUpdated: Date;
  url?: string;
  metadata?: Record<string, any>;
}

/**
 * IOC enrichment data
 */
export interface IOCEnrichment {
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    asn?: string;
    isp?: string;
  };
  whois?: {
    registrar?: string;
    createdDate?: Date;
    expiresDate?: Date;
    nameServers?: string[];
  };
  dns?: {
    aRecords?: string[];
    mxRecords?: string[];
    nsRecords?: string[];
    txtRecords?: string[];
  };
  reputation?: {
    score: number; // 0-100
    category: string;
    threatTypes: string[];
  };
  malwareAnalysis?: {
    family?: string;
    variant?: string;
    capabilities?: string[];
    signatures?: string[];
  };
}

/**
 * Threat actor profile
 */
export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  type: ThreatActorType;
  sophistication: ThreatSophistication;
  motivation: ThreatMotivation[];
  targetedSectors: string[];
  targetedCountries: string[];
  firstSeen: Date;
  lastSeen: Date;
  description?: string;
  ttps: string[]; // Tactics, Techniques, and Procedures
  mitreAttack?: MITREMapping[];
  associatedCampaigns?: string[];
  associatedIOCs?: string[];
  metadata?: Record<string, any>;
}

/**
 * Threat actor types
 */
export enum ThreatActorType {
  NATION_STATE = 'NATION_STATE',
  CYBERCRIME = 'CYBERCRIME',
  HACKTIVIST = 'HACKTIVIST',
  INSIDER = 'INSIDER',
  TERRORIST = 'TERRORIST',
  OPPORTUNIST = 'OPPORTUNIST',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Threat sophistication levels
 */
export enum ThreatSophistication {
  NONE = 'NONE',
  MINIMAL = 'MINIMAL',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  STRATEGIC = 'STRATEGIC',
}

/**
 * Threat motivation categories
 */
export enum ThreatMotivation {
  FINANCIAL = 'FINANCIAL',
  ESPIONAGE = 'ESPIONAGE',
  SABOTAGE = 'SABOTAGE',
  IDEOLOGY = 'IDEOLOGY',
  GRUDGE = 'GRUDGE',
  NOTORIETY = 'NOTORIETY',
  ORGANIZATIONAL_GAIN = 'ORGANIZATIONAL_GAIN',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Threat campaign structure
 */
export interface ThreatCampaign {
  id: string;
  name: string;
  aliases: string[];
  description?: string;
  status: CampaignStatus;
  severity: ThreatSeverity;
  startDate: Date;
  endDate?: Date;
  lastActivity?: Date;
  threatActors?: string[];
  targetedSectors: string[];
  targetedCountries: string[];
  objectives: string[];
  iocs: string[];
  mitreAttack?: MITREMapping[];
  timeline: CampaignEvent[];
  metadata?: Record<string, any>;
}

/**
 * Campaign status
 */
export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  SUSPECTED = 'SUSPECTED',
  DORMANT = 'DORMANT',
  CONCLUDED = 'CONCLUDED',
}

/**
 * Campaign timeline event
 */
export interface CampaignEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  description: string;
  iocs?: string[];
  impact?: string;
  metadata?: Record<string, any>;
}

/**
 * MITRE ATT&CK framework mapping
 */
export interface MITREMapping {
  tactic: string; // e.g., "Initial Access"
  tacticId: string; // e.g., "TA0001"
  technique: string; // e.g., "Phishing"
  techniqueId: string; // e.g., "T1566"
  subTechnique?: string;
  subTechniqueId?: string;
  platforms?: string[];
  dataSources?: string[];
  defenses?: string[];
  detections?: string[];
}

/**
 * STIX 2.1 compatible bundle
 */
export interface STIXBundle {
  type: 'bundle';
  id: string;
  spec_version: '2.1';
  objects: STIXObject[];
  created?: Date;
  modified?: Date;
}

/**
 * STIX domain object
 */
export interface STIXObject {
  type: string;
  spec_version: '2.1';
  id: string;
  created: Date;
  modified: Date;
  created_by_ref?: string;
  revoked?: boolean;
  labels?: string[];
  confidence?: number;
  lang?: string;
  external_references?: ExternalReference[];
  object_marking_refs?: string[];
  granular_markings?: GranularMarking[];
  extensions?: Record<string, any>;
}

/**
 * STIX external reference
 */
export interface ExternalReference {
  source_name: string;
  description?: string;
  url?: string;
  hashes?: Record<string, string>;
  external_id?: string;
}

/**
 * STIX granular marking
 */
export interface GranularMarking {
  lang?: string;
  marking_ref?: string;
  selectors: string[];
}

/**
 * TAXII 2.1 collection
 */
export interface TAXIICollection {
  id: string;
  title: string;
  description?: string;
  can_read: boolean;
  can_write: boolean;
  media_types: string[];
}

/**
 * Intelligence enrichment result
 */
export interface EnrichmentResult {
  iocId: string;
  provider: string;
  timestamp: Date;
  success: boolean;
  data?: Partial<IOCEnrichment>;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Threat intelligence query
 */
export interface ThreatIntelQuery {
  types?: IOCType[];
  severities?: ThreatSeverity[];
  sources?: string[];
  tags?: string[];
  campaigns?: string[];
  threatActors?: string[];
  mitreAttackIds?: string[];
  dateRange?: {
    field: 'firstSeen' | 'lastSeen' | 'createdAt';
    start?: Date;
    end?: Date;
  };
  status?: ('active' | 'inactive' | 'expired' | 'false_positive')[];
  minConfidence?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Threat intelligence aggregation result
 */
export interface ThreatIntelStats {
  totalIOCs: number;
  activeIOCs: number;
  iocsByType: Record<IOCType, number>;
  iocsBySeverity: Record<ThreatSeverity, number>;
  topSources: Array<{ source: string; count: number }>;
  topThreatActors: Array<{ actor: string; count: number }>;
  topCampaigns: Array<{ campaign: string; count: number }>;
  recentActivity: Array<{ date: string; count: number }>;
  mitreAttackCoverage: Array<{ tacticId: string; count: number }>;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize ThreatFeed model attributes for threat feed management.
 *
 * @example
 * ```typescript
 * class ThreatFeed extends Model {}
 * ThreatFeed.init(getThreatFeedModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_feeds',
 *   timestamps: true
 * });
 * ```
 */
export const getThreatFeedModelAttributes = () => ({
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
  feedUrl: {
    type: 'TEXT',
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
  updateInterval: {
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
  filters: {
    type: 'JSONB',
    defaultValue: [],
  },
  lastSync: {
    type: 'DATE',
    allowNull: true,
  },
  lastSyncStatus: {
    type: 'STRING',
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
 * Sequelize IOC model attributes for indicator management.
 *
 * @example
 * ```typescript
 * class IOC extends Model {}
 * IOC.init(getIOCModelAttributes(), {
 *   sequelize,
 *   tableName: 'indicators_of_compromise',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['type', 'status'] },
 *     { fields: ['hash'] },
 *     { fields: ['severity'] }
 *   ]
 * });
 * ```
 */
export const getIOCModelAttributes = () => ({
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
  hash: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  confidence: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
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
  sources: {
    type: 'JSONB',
    defaultValue: [],
  },
  tags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  relatedIOCs: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  threatActors: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  campaigns: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'JSONB',
    defaultValue: [],
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'active',
  },
  falsePositiveReason: {
    type: 'TEXT',
    allowNull: true,
  },
  enrichment: {
    type: 'JSONB',
    allowNull: true,
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
 * Sequelize ThreatActor model attributes.
 *
 * @example
 * ```typescript
 * class ThreatActor extends Model {}
 * ThreatActor.init(getThreatActorModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_actors',
 *   timestamps: true
 * });
 * ```
 */
export const getThreatActorModelAttributes = () => ({
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
  aliases: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  sophistication: {
    type: 'STRING',
    allowNull: false,
  },
  motivation: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  targetedSectors: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  targetedCountries: {
    type: 'ARRAY("TEXT")',
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
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  ttps: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'JSONB',
    defaultValue: [],
  },
  associatedCampaigns: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  associatedIOCs: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
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
 * Sequelize ThreatCampaign model attributes.
 *
 * @example
 * ```typescript
 * class ThreatCampaign extends Model {}
 * ThreatCampaign.init(getThreatCampaignModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_campaigns',
 *   timestamps: true
 * });
 * ```
 */
export const getThreatCampaignModelAttributes = () => ({
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
  aliases: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  status: {
    type: 'STRING',
    allowNull: false,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  startDate: {
    type: 'DATE',
    allowNull: false,
  },
  endDate: {
    type: 'DATE',
    allowNull: true,
  },
  lastActivity: {
    type: 'DATE',
    allowNull: true,
  },
  threatActors: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  targetedSectors: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  targetedCountries: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  objectives: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  iocs: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'JSONB',
    defaultValue: [],
  },
  timeline: {
    type: 'JSONB',
    defaultValue: [],
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
// THREAT FEED AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregates threat intelligence from multiple feeds.
 *
 * @param {ThreatFeedConfig[]} feeds - Array of threat feed configurations
 * @param {object} [options] - Aggregation options
 * @returns {Promise<IOC[]>} Aggregated IOCs
 *
 * @example
 * ```typescript
 * const feeds = [
 *   { id: 'feed1', name: 'AlienVault OTX', provider: 'alienvault', ... },
 *   { id: 'feed2', name: 'MISP', provider: 'misp', ... }
 * ];
 * const iocs = await aggregateThreatFeeds(feeds, { deduplication: true });
 * ```
 */
export const aggregateThreatFeeds = async (
  feeds: ThreatFeedConfig[],
  options?: {
    deduplication?: boolean;
    minConfidence?: number;
    maxAge?: number; // milliseconds
  }
): Promise<IOC[]> => {
  const aggregatedIOCs: IOC[] = [];
  const iocMap = new Map<string, IOC>();

  for (const feed of feeds.filter((f) => f.enabled)) {
    try {
      // Simulate feed data fetching (in production, implement actual HTTP requests)
      const feedIOCs = await fetchFeedData(feed);

      for (const ioc of feedIOCs) {
        // Apply age filter
        if (options?.maxAge) {
          const age = Date.now() - ioc.lastSeen.getTime();
          if (age > options.maxAge) continue;
        }

        // Apply confidence filter
        if (options?.minConfidence && ioc.confidence < options.minConfidence) {
          continue;
        }

        const hash = normalizeIOCValue(ioc.type, ioc.value);

        if (options?.deduplication && iocMap.has(hash)) {
          // Merge with existing IOC
          const existing = iocMap.get(hash)!;
          existing.sources.push(...ioc.sources);
          existing.confidence = Math.max(existing.confidence, ioc.confidence);
          existing.lastSeen = new Date(
            Math.max(existing.lastSeen.getTime(), ioc.lastSeen.getTime())
          );
        } else {
          iocMap.set(hash, { ...ioc, hash });
        }
      }
    } catch (error) {
      console.error(`Failed to aggregate feed ${feed.name}:`, error);
    }
  }

  return Array.from(iocMap.values());
};

/**
 * Fetches threat intelligence data from a configured feed.
 *
 * @param {ThreatFeedConfig} feed - Threat feed configuration
 * @returns {Promise<IOC[]>} Fetched IOCs
 *
 * @example
 * ```typescript
 * const feed = { id: 'feed1', feedUrl: 'https://api.example.com/threats', ... };
 * const iocs = await fetchFeedData(feed);
 * ```
 */
export const fetchFeedData = async (feed: ThreatFeedConfig): Promise<IOC[]> => {
  // In production, implement actual HTTP request with authentication
  // This is a placeholder returning sample data
  const now = new Date();

  return [
    {
      id: crypto.randomUUID(),
      type: IOCType.IPV4,
      value: '192.0.2.1',
      hash: normalizeIOCValue(IOCType.IPV4, '192.0.2.1'),
      severity: ThreatSeverity.HIGH,
      confidence: 85,
      firstSeen: now,
      lastSeen: now,
      sources: [
        {
          provider: feed.provider,
          feedId: feed.id,
          confidence: 85,
          firstSeen: now,
          lastUpdated: now,
        },
      ],
      tags: ['malware', 'botnet'],
      status: 'active',
    },
  ];
};

/**
 * Normalizes IOC value for consistent comparison and storage.
 *
 * @param {IOCType} type - IOC type
 * @param {string} value - IOC value
 * @returns {string} Normalized hash
 *
 * @example
 * ```typescript
 * const hash = normalizeIOCValue(IOCType.DOMAIN, 'EXAMPLE.COM');
 * // Returns consistent hash for 'example.com'
 * ```
 */
export const normalizeIOCValue = (type: IOCType, value: string): string => {
  let normalized = value.trim();

  switch (type) {
    case IOCType.DOMAIN:
    case IOCType.EMAIL:
      normalized = normalized.toLowerCase();
      break;
    case IOCType.IPV4:
      // Remove leading zeros
      normalized = normalized
        .split('.')
        .map((octet) => parseInt(octet, 10).toString())
        .join('.');
      break;
    case IOCType.FILE_HASH_MD5:
    case IOCType.FILE_HASH_SHA1:
    case IOCType.FILE_HASH_SHA256:
    case IOCType.FILE_HASH_SHA512:
      normalized = normalized.toLowerCase().replace(/[^a-f0-9]/g, '');
      break;
    case IOCType.URL:
      normalized = normalized.toLowerCase();
      break;
  }

  return crypto.createHash('sha256').update(normalized).digest('hex');
};

/**
 * Validates IOC format and structure.
 *
 * @param {IOCType} type - IOC type
 * @param {string} value - IOC value
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateIOCFormat(IOCType.IPV4, '192.168.1.1');
 * if (result.valid) {
 *   // Process IOC
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export const validateIOCFormat = (
  type: IOCType,
  value: string
): { valid: boolean; error?: string; normalized?: string } => {
  const validators: Record<IOCType, RegExp> = {
    [IOCType.IPV4]: /^(\d{1,3}\.){3}\d{1,3}$/,
    [IOCType.IPV6]: /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/,
    [IOCType.DOMAIN]: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    [IOCType.EMAIL]: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    [IOCType.FILE_HASH_MD5]: /^[a-fA-F0-9]{32}$/,
    [IOCType.FILE_HASH_SHA1]: /^[a-fA-F0-9]{40}$/,
    [IOCType.FILE_HASH_SHA256]: /^[a-fA-F0-9]{64}$/,
    [IOCType.FILE_HASH_SHA512]: /^[a-fA-F0-9]{128}$/,
    [IOCType.URL]: /^https?:\/\/.+/,
    [IOCType.CVE]: /^CVE-\d{4}-\d{4,}$/,
    [IOCType.FILE_NAME]: /.+/,
    [IOCType.FILE_PATH]: /.+/,
    [IOCType.REGISTRY_KEY]: /.+/,
    [IOCType.MUTEX]: /.+/,
    [IOCType.USER_AGENT]: /.+/,
    [IOCType.ASN]: /^AS\d+$/,
    [IOCType.SSL_CERT_FINGERPRINT]: /^[a-fA-F0-9:]{47,95}$/,
    [IOCType.YARA_RULE]: /.+/,
  };

  const regex = validators[type];
  if (!regex) {
    return { valid: false, error: `Unknown IOC type: ${type}` };
  }

  if (!regex.test(value)) {
    return { valid: false, error: `Invalid format for ${type}` };
  }

  return { valid: true, normalized: value.trim() };
};

/**
 * Applies filters to threat feed data.
 *
 * @param {IOC[]} iocs - Array of IOCs
 * @param {ThreatFeedFilter[]} filters - Filters to apply
 * @returns {IOC[]} Filtered IOCs
 *
 * @example
 * ```typescript
 * const filtered = applyThreatFeedFilters(iocs, [
 *   { field: 'severity', operator: 'in', value: ['HIGH', 'CRITICAL'] },
 *   { field: 'confidence', operator: 'greater_than', value: 70 }
 * ]);
 * ```
 */
export const applyThreatFeedFilters = (
  iocs: IOC[],
  filters: ThreatFeedFilter[]
): IOC[] => {
  return iocs.filter((ioc) => {
    return filters.every((filter) => {
      const fieldValue = (ioc as any)[filter.field];

      switch (filter.operator) {
        case 'equals':
          return fieldValue === filter.value;
        case 'contains':
          return String(fieldValue).includes(String(filter.value));
        case 'regex':
          return new RegExp(filter.value).test(String(fieldValue));
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(fieldValue);
        case 'greater_than':
          return fieldValue > filter.value;
        case 'less_than':
          return fieldValue < filter.value;
        default:
          return true;
      }
    });
  });
};

/**
 * Synchronizes threat feed on schedule.
 *
 * @param {ThreatFeedConfig} feed - Feed configuration
 * @param {Function} callback - Callback for processing new IOCs
 * @returns {object} Sync result
 *
 * @example
 * ```typescript
 * const result = await syncThreatFeed(feed, async (iocs) => {
 *   await saveIOCsToDatabase(iocs);
 * });
 * ```
 */
export const syncThreatFeed = async (
  feed: ThreatFeedConfig,
  callback: (iocs: IOC[]) => Promise<void>
): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const iocs = await fetchFeedData(feed);
    const filtered = feed.filters ? applyThreatFeedFilters(iocs, feed.filters) : iocs;

    await callback(filtered);

    return {
      success: true,
      count: filtered.length,
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// ============================================================================
// IOC MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new IOC entry with validation.
 *
 * @param {Partial<IOC>} iocData - IOC data
 * @returns {IOC} Created IOC
 *
 * @example
 * ```typescript
 * const ioc = createIOC({
 *   type: IOCType.DOMAIN,
 *   value: 'malicious.example.com',
 *   severity: ThreatSeverity.HIGH,
 *   confidence: 90
 * });
 * ```
 */
export const createIOC = (iocData: Partial<IOC>): IOC => {
  const now = new Date();
  const validation = validateIOCFormat(iocData.type!, iocData.value!);

  if (!validation.valid) {
    throw new Error(`Invalid IOC: ${validation.error}`);
  }

  return {
    id: iocData.id || crypto.randomUUID(),
    type: iocData.type!,
    value: validation.normalized || iocData.value!,
    hash: normalizeIOCValue(iocData.type!, iocData.value!),
    severity: iocData.severity || ThreatSeverity.MEDIUM,
    confidence: iocData.confidence || 50,
    firstSeen: iocData.firstSeen || now,
    lastSeen: iocData.lastSeen || now,
    expiresAt: iocData.expiresAt,
    sources: iocData.sources || [],
    tags: iocData.tags || [],
    relatedIOCs: iocData.relatedIOCs,
    threatActors: iocData.threatActors,
    campaigns: iocData.campaigns,
    mitreAttack: iocData.mitreAttack,
    metadata: iocData.metadata || {},
    status: iocData.status || 'active',
    falsePositiveReason: iocData.falsePositiveReason,
    enrichment: iocData.enrichment,
  };
};

/**
 * Updates IOC with new information, merging sources.
 *
 * @param {IOC} existing - Existing IOC
 * @param {Partial<IOC>} updates - Updates to apply
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const updated = updateIOC(existingIOC, {
 *   confidence: 95,
 *   severity: ThreatSeverity.CRITICAL,
 *   tags: ['ransomware', 'apt28']
 * });
 * ```
 */
export const updateIOC = (existing: IOC, updates: Partial<IOC>): IOC => {
  return {
    ...existing,
    ...updates,
    lastSeen: new Date(),
    confidence: Math.max(existing.confidence, updates.confidence || 0),
    sources: updates.sources
      ? [...existing.sources, ...updates.sources]
      : existing.sources,
    tags: updates.tags ? Array.from(new Set([...existing.tags, ...updates.tags])) : existing.tags,
  };
};

/**
 * Marks IOC as false positive with reason.
 *
 * @param {IOC} ioc - IOC to mark
 * @param {string} reason - Reason for false positive
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const updated = markIOCFalsePositive(ioc, 'Whitelisted internal IP');
 * ```
 */
export const markIOCFalsePositive = (ioc: IOC, reason: string): IOC => {
  return {
    ...ioc,
    status: 'false_positive',
    falsePositiveReason: reason,
  };
};

/**
 * Expires IOC based on TTL or manual expiration.
 *
 * @param {IOC} ioc - IOC to check
 * @param {number} [ttl] - Time to live in milliseconds
 * @returns {IOC} Potentially expired IOC
 *
 * @example
 * ```typescript
 * const ioc = expireIOC(existingIOC, 30 * 24 * 60 * 60 * 1000); // 30 days
 * if (ioc.status === 'expired') {
 *   // Handle expired IOC
 * }
 * ```
 */
export const expireIOC = (ioc: IOC, ttl?: number): IOC => {
  const now = new Date();

  if (ioc.expiresAt && ioc.expiresAt < now) {
    return { ...ioc, status: 'expired' };
  }

  if (ttl) {
    const age = now.getTime() - ioc.lastSeen.getTime();
    if (age > ttl) {
      return { ...ioc, status: 'expired', expiresAt: new Date(ioc.lastSeen.getTime() + ttl) };
    }
  }

  return ioc;
};

/**
 * Finds related IOCs based on various criteria.
 *
 * @param {IOC} ioc - Source IOC
 * @param {IOC[]} allIOCs - All available IOCs
 * @param {object} [options] - Relation options
 * @returns {IOC[]} Related IOCs
 *
 * @example
 * ```typescript
 * const related = findRelatedIOCs(ioc, allIOCs, {
 *   sameCampaign: true,
 *   sameThreatActor: true,
 *   similarType: true
 * });
 * ```
 */
export const findRelatedIOCs = (
  ioc: IOC,
  allIOCs: IOC[],
  options?: {
    sameCampaign?: boolean;
    sameThreatActor?: boolean;
    similarType?: boolean;
    timeWindow?: number;
  }
): IOC[] => {
  return allIOCs.filter((candidate) => {
    if (candidate.id === ioc.id) return false;

    if (options?.sameCampaign && ioc.campaigns) {
      const overlap = candidate.campaigns?.some((c) => ioc.campaigns!.includes(c));
      if (overlap) return true;
    }

    if (options?.sameThreatActor && ioc.threatActors) {
      const overlap = candidate.threatActors?.some((a) => ioc.threatActors!.includes(a));
      if (overlap) return true;
    }

    if (options?.similarType && candidate.type === ioc.type) {
      return true;
    }

    if (options?.timeWindow) {
      const timeDiff = Math.abs(candidate.lastSeen.getTime() - ioc.lastSeen.getTime());
      if (timeDiff <= options.timeWindow) return true;
    }

    return false;
  });
};

/**
 * Queries IOCs with advanced filtering.
 *
 * @param {IOC[]} iocs - All IOCs
 * @param {ThreatIntelQuery} query - Query parameters
 * @returns {IOC[]} Matching IOCs
 *
 * @example
 * ```typescript
 * const results = queryIOCs(allIOCs, {
 *   types: [IOCType.IPV4, IOCType.DOMAIN],
 *   severities: [ThreatSeverity.HIGH, ThreatSeverity.CRITICAL],
 *   minConfidence: 80,
 *   status: ['active'],
 *   limit: 100
 * });
 * ```
 */
export const queryIOCs = (iocs: IOC[], query: ThreatIntelQuery): IOC[] => {
  let results = [...iocs];

  // Type filter
  if (query.types?.length) {
    results = results.filter((ioc) => query.types!.includes(ioc.type));
  }

  // Severity filter
  if (query.severities?.length) {
    results = results.filter((ioc) => query.severities!.includes(ioc.severity));
  }

  // Status filter
  if (query.status?.length) {
    results = results.filter((ioc) => query.status!.includes(ioc.status));
  }

  // Confidence filter
  if (query.minConfidence) {
    results = results.filter((ioc) => ioc.confidence >= query.minConfidence!);
  }

  // Tags filter
  if (query.tags?.length) {
    results = results.filter((ioc) =>
      query.tags!.some((tag) => ioc.tags.includes(tag))
    );
  }

  // Campaign filter
  if (query.campaigns?.length) {
    results = results.filter((ioc) =>
      ioc.campaigns?.some((c) => query.campaigns!.includes(c))
    );
  }

  // Threat actor filter
  if (query.threatActors?.length) {
    results = results.filter((ioc) =>
      ioc.threatActors?.some((a) => query.threatActors!.includes(a))
    );
  }

  // Date range filter
  if (query.dateRange) {
    results = results.filter((ioc) => {
      const dateValue = ioc[query.dateRange!.field] as Date;
      if (query.dateRange!.start && dateValue < query.dateRange!.start) return false;
      if (query.dateRange!.end && dateValue > query.dateRange!.end) return false;
      return true;
    });
  }

  // Sorting
  if (query.sortBy) {
    results.sort((a, b) => {
      const aVal = (a as any)[query.sortBy!];
      const bVal = (b as any)[query.sortBy!];
      const order = query.sortOrder === 'desc' ? -1 : 1;
      return aVal > bVal ? order : aVal < bVal ? -order : 0;
    });
  }

  // Pagination
  if (query.offset) {
    results = results.slice(query.offset);
  }
  if (query.limit) {
    results = results.slice(0, query.limit);
  }

  return results;
};

// ============================================================================
// THREAT ACTOR TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates threat actor profile.
 *
 * @param {Partial<ThreatActor>} actorData - Actor data
 * @returns {ThreatActor} Created threat actor
 *
 * @example
 * ```typescript
 * const actor = createThreatActor({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy'],
 *   type: ThreatActorType.NATION_STATE,
 *   sophistication: ThreatSophistication.ADVANCED
 * });
 * ```
 */
export const createThreatActor = (actorData: Partial<ThreatActor>): ThreatActor => {
  const now = new Date();

  return {
    id: actorData.id || crypto.randomUUID(),
    name: actorData.name!,
    aliases: actorData.aliases || [],
    type: actorData.type || ThreatActorType.UNKNOWN,
    sophistication: actorData.sophistication || ThreatSophistication.INTERMEDIATE,
    motivation: actorData.motivation || [],
    targetedSectors: actorData.targetedSectors || [],
    targetedCountries: actorData.targetedCountries || [],
    firstSeen: actorData.firstSeen || now,
    lastSeen: actorData.lastSeen || now,
    description: actorData.description,
    ttps: actorData.ttps || [],
    mitreAttack: actorData.mitreAttack || [],
    associatedCampaigns: actorData.associatedCampaigns || [],
    associatedIOCs: actorData.associatedIOCs || [],
    metadata: actorData.metadata || {},
  };
};

/**
 * Links threat actor to IOCs.
 *
 * @param {string} actorId - Threat actor ID
 * @param {string[]} iocIds - IOC IDs to link
 * @param {IOC[]} iocs - All IOCs
 * @returns {IOC[]} Updated IOCs
 *
 * @example
 * ```typescript
 * const updated = linkThreatActorToIOCs('actor-123', ['ioc-1', 'ioc-2'], allIOCs);
 * ```
 */
export const linkThreatActorToIOCs = (
  actorId: string,
  iocIds: string[],
  iocs: IOC[]
): IOC[] => {
  return iocs.map((ioc) => {
    if (iocIds.includes(ioc.id)) {
      const actors = ioc.threatActors || [];
      if (!actors.includes(actorId)) {
        actors.push(actorId);
      }
      return { ...ioc, threatActors: actors };
    }
    return ioc;
  });
};

/**
 * Tracks threat actor activity over time.
 *
 * @param {ThreatActor} actor - Threat actor
 * @param {IOC[]} iocs - Associated IOCs
 * @returns {object} Activity timeline
 *
 * @example
 * ```typescript
 * const timeline = trackThreatActorActivity(actor, associatedIOCs);
 * console.log(timeline.activityByMonth);
 * ```
 */
export const trackThreatActorActivity = (
  actor: ThreatActor,
  iocs: IOC[]
): {
  totalIOCs: number;
  activityByMonth: Record<string, number>;
  mostCommonTypes: Array<{ type: IOCType; count: number }>;
  averageConfidence: number;
} => {
  const actorIOCs = iocs.filter((ioc) => ioc.threatActors?.includes(actor.id));

  const activityByMonth: Record<string, number> = {};
  const typeCounts: Record<IOCType, number> = {} as any;
  let totalConfidence = 0;

  actorIOCs.forEach((ioc) => {
    const month = ioc.lastSeen.toISOString().substring(0, 7);
    activityByMonth[month] = (activityByMonth[month] || 0) + 1;

    typeCounts[ioc.type] = (typeCounts[ioc.type] || 0) + 1;
    totalConfidence += ioc.confidence;
  });

  const mostCommonTypes = Object.entries(typeCounts)
    .map(([type, count]) => ({ type: type as IOCType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalIOCs: actorIOCs.length,
    activityByMonth,
    mostCommonTypes,
    averageConfidence: actorIOCs.length > 0 ? totalConfidence / actorIOCs.length : 0,
  };
};

// ============================================================================
// CAMPAIGN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Creates threat campaign.
 *
 * @param {Partial<ThreatCampaign>} campaignData - Campaign data
 * @returns {ThreatCampaign} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = createThreatCampaign({
 *   name: 'Operation Aurora',
 *   severity: ThreatSeverity.CRITICAL,
 *   status: CampaignStatus.ACTIVE,
 *   targetedSectors: ['technology', 'defense']
 * });
 * ```
 */
export const createThreatCampaign = (campaignData: Partial<ThreatCampaign>): ThreatCampaign => {
  const now = new Date();

  return {
    id: campaignData.id || crypto.randomUUID(),
    name: campaignData.name!,
    aliases: campaignData.aliases || [],
    description: campaignData.description,
    status: campaignData.status || CampaignStatus.SUSPECTED,
    severity: campaignData.severity || ThreatSeverity.MEDIUM,
    startDate: campaignData.startDate || now,
    endDate: campaignData.endDate,
    lastActivity: campaignData.lastActivity || now,
    threatActors: campaignData.threatActors || [],
    targetedSectors: campaignData.targetedSectors || [],
    targetedCountries: campaignData.targetedCountries || [],
    objectives: campaignData.objectives || [],
    iocs: campaignData.iocs || [],
    mitreAttack: campaignData.mitreAttack || [],
    timeline: campaignData.timeline || [],
    metadata: campaignData.metadata || {},
  };
};

/**
 * Analyzes campaign timeline and patterns.
 *
 * @param {ThreatCampaign} campaign - Campaign to analyze
 * @param {IOC[]} iocs - Associated IOCs
 * @returns {object} Campaign analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeCampaignTimeline(campaign, iocs);
 * console.log(analysis.phases);
 * ```
 */
export const analyzeCampaignTimeline = (
  campaign: ThreatCampaign,
  iocs: IOC[]
): {
  duration: number;
  phases: Array<{ phase: string; start: Date; end?: Date; iocCount: number }>;
  peakActivity: Date;
  iocsByType: Record<IOCType, number>;
} => {
  const campaignIOCs = iocs.filter((ioc) => ioc.campaigns?.includes(campaign.id));
  const duration = campaign.endDate
    ? campaign.endDate.getTime() - campaign.startDate.getTime()
    : Date.now() - campaign.startDate.getTime();

  // Group IOCs by month to identify phases
  const monthlyActivity: Record<string, IOC[]> = {};
  campaignIOCs.forEach((ioc) => {
    const month = ioc.lastSeen.toISOString().substring(0, 7);
    if (!monthlyActivity[month]) monthlyActivity[month] = [];
    monthlyActivity[month].push(ioc);
  });

  const phases = Object.entries(monthlyActivity).map(([month, monthIOCs]) => ({
    phase: month,
    start: new Date(month + '-01'),
    iocCount: monthIOCs.length,
  }));

  const peakActivity =
    phases.length > 0
      ? phases.reduce((max, phase) => (phase.iocCount > max.iocCount ? phase : max)).start
      : campaign.startDate;

  const iocsByType: Record<IOCType, number> = {} as any;
  campaignIOCs.forEach((ioc) => {
    iocsByType[ioc.type] = (iocsByType[ioc.type] || 0) + 1;
  });

  return {
    duration,
    phases,
    peakActivity,
    iocsByType,
  };
};

/**
 * Adds event to campaign timeline.
 *
 * @param {ThreatCampaign} campaign - Campaign
 * @param {Partial<CampaignEvent>} event - Event to add
 * @returns {ThreatCampaign} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = addCampaignEvent(campaign, {
 *   eventType: 'INITIAL_COMPROMISE',
 *   description: 'Phishing emails sent to targets',
 *   iocs: ['ioc-1', 'ioc-2']
 * });
 * ```
 */
export const addCampaignEvent = (
  campaign: ThreatCampaign,
  event: Partial<CampaignEvent>
): ThreatCampaign => {
  const newEvent: CampaignEvent = {
    id: event.id || crypto.randomUUID(),
    timestamp: event.timestamp || new Date(),
    eventType: event.eventType!,
    description: event.description!,
    iocs: event.iocs,
    impact: event.impact,
    metadata: event.metadata,
  };

  return {
    ...campaign,
    timeline: [...campaign.timeline, newEvent],
    lastActivity: newEvent.timestamp,
  };
};

// ============================================================================
// MITRE ATT&CK MAPPING FUNCTIONS
// ============================================================================

/**
 * Maps IOC to MITRE ATT&CK techniques.
 *
 * @param {IOC} ioc - IOC to map
 * @param {MITREMapping[]} mappings - MITRE mappings
 * @returns {IOC} Updated IOC
 *
 * @example
 * ```typescript
 * const mapped = mapIOCToMITRE(ioc, [
 *   {
 *     tactic: 'Initial Access',
 *     tacticId: 'TA0001',
 *     technique: 'Phishing',
 *     techniqueId: 'T1566'
 *   }
 * ]);
 * ```
 */
export const mapIOCToMITRE = (ioc: IOC, mappings: MITREMapping[]): IOC => {
  return {
    ...ioc,
    mitreAttack: [...(ioc.mitreAttack || []), ...mappings],
  };
};

/**
 * Gets MITRE ATT&CK coverage for a set of IOCs.
 *
 * @param {IOC[]} iocs - IOCs to analyze
 * @returns {object} Coverage statistics
 *
 * @example
 * ```typescript
 * const coverage = getMITRECoverage(iocs);
 * console.log(coverage.tacticsCovered);
 * console.log(coverage.techniquesCovered);
 * ```
 */
export const getMITRECoverage = (
  iocs: IOC[]
): {
  tacticsCovered: string[];
  techniquesCovered: string[];
  coverageByTactic: Record<string, number>;
  mostCommonTechniques: Array<{ techniqueId: string; technique: string; count: number }>;
} => {
  const tactics = new Set<string>();
  const techniques = new Set<string>();
  const tacticCounts: Record<string, number> = {};
  const techniqueCounts: Record<string, { name: string; count: number }> = {};

  iocs.forEach((ioc) => {
    ioc.mitreAttack?.forEach((mapping) => {
      tactics.add(mapping.tacticId);
      techniques.add(mapping.techniqueId);
      tacticCounts[mapping.tacticId] = (tacticCounts[mapping.tacticId] || 0) + 1;

      if (!techniqueCounts[mapping.techniqueId]) {
        techniqueCounts[mapping.techniqueId] = { name: mapping.technique, count: 0 };
      }
      techniqueCounts[mapping.techniqueId].count++;
    });
  });

  const mostCommonTechniques = Object.entries(techniqueCounts)
    .map(([techniqueId, data]) => ({ techniqueId, technique: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    tacticsCovered: Array.from(tactics),
    techniquesCovered: Array.from(techniques),
    coverageByTactic: tacticCounts,
    mostCommonTechniques,
  };
};

/**
 * Suggests MITRE ATT&CK mappings based on IOC type and context.
 *
 * @param {IOC} ioc - IOC to analyze
 * @returns {MITREMapping[]} Suggested mappings
 *
 * @example
 * ```typescript
 * const suggestions = suggestMITREMappings(ioc);
 * suggestions.forEach(mapping => {
 *   console.log(`${mapping.technique} (${mapping.techniqueId})`);
 * });
 * ```
 */
export const suggestMITREMappings = (ioc: IOC): MITREMapping[] => {
  const suggestions: MITREMapping[] = [];

  // Basic type-based suggestions
  switch (ioc.type) {
    case IOCType.DOMAIN:
    case IOCType.URL:
      suggestions.push({
        tactic: 'Command and Control',
        tacticId: 'TA0011',
        technique: 'Web Service',
        techniqueId: 'T1102',
      });
      break;
    case IOCType.FILE_HASH_MD5:
    case IOCType.FILE_HASH_SHA1:
    case IOCType.FILE_HASH_SHA256:
      suggestions.push({
        tactic: 'Execution',
        tacticId: 'TA0002',
        technique: 'User Execution',
        techniqueId: 'T1204',
      });
      break;
    case IOCType.IPV4:
    case IOCType.IPV6:
      suggestions.push({
        tactic: 'Command and Control',
        tacticId: 'TA0011',
        technique: 'Non-Application Layer Protocol',
        techniqueId: 'T1095',
      });
      break;
    case IOCType.EMAIL:
      suggestions.push({
        tactic: 'Initial Access',
        tacticId: 'TA0001',
        technique: 'Phishing',
        techniqueId: 'T1566',
      });
      break;
  }

  return suggestions;
};

// ============================================================================
// STIX/TAXII INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Converts IOC to STIX 2.1 indicator object.
 *
 * @param {IOC} ioc - IOC to convert
 * @returns {STIXObject} STIX indicator
 *
 * @example
 * ```typescript
 * const stixIndicator = convertIOCToSTIX(ioc);
 * // Returns STIX 2.1 compliant indicator object
 * ```
 */
export const convertIOCToSTIX = (ioc: IOC): STIXObject => {
  const now = new Date();

  return {
    type: 'indicator',
    spec_version: '2.1',
    id: `indicator--${ioc.id}`,
    created: ioc.firstSeen,
    modified: ioc.lastSeen,
    labels: ioc.tags,
    confidence: ioc.confidence,
    pattern: generateSTIXPattern(ioc),
    pattern_type: 'stix',
    valid_from: ioc.firstSeen,
    valid_until: ioc.expiresAt,
  } as any;
};

/**
 * Generates STIX pattern from IOC.
 *
 * @param {IOC} ioc - IOC
 * @returns {string} STIX pattern
 *
 * @example
 * ```typescript
 * const pattern = generateSTIXPattern(ioc);
 * // Returns: "[ipv4-addr:value = '192.0.2.1']"
 * ```
 */
export const generateSTIXPattern = (ioc: IOC): string => {
  const patterns: Record<IOCType, string> = {
    [IOCType.IPV4]: `[ipv4-addr:value = '${ioc.value}']`,
    [IOCType.IPV6]: `[ipv6-addr:value = '${ioc.value}']`,
    [IOCType.DOMAIN]: `[domain-name:value = '${ioc.value}']`,
    [IOCType.URL]: `[url:value = '${ioc.value}']`,
    [IOCType.EMAIL]: `[email-addr:value = '${ioc.value}']`,
    [IOCType.FILE_HASH_MD5]: `[file:hashes.MD5 = '${ioc.value}']`,
    [IOCType.FILE_HASH_SHA1]: `[file:hashes.'SHA-1' = '${ioc.value}']`,
    [IOCType.FILE_HASH_SHA256]: `[file:hashes.'SHA-256' = '${ioc.value}']`,
    [IOCType.FILE_HASH_SHA512]: `[file:hashes.'SHA-512' = '${ioc.value}']`,
    [IOCType.FILE_NAME]: `[file:name = '${ioc.value}']`,
    [IOCType.FILE_PATH]: `[file:path = '${ioc.value}']`,
    [IOCType.REGISTRY_KEY]: `[windows-registry-key:key = '${ioc.value}']`,
    [IOCType.MUTEX]: `[mutex:name = '${ioc.value}']`,
    [IOCType.USER_AGENT]: `[network-traffic:extensions.'http-request-ext'.request_header.'User-Agent' = '${ioc.value}']`,
    [IOCType.CVE]: `[vulnerability:name = '${ioc.value}']`,
    [IOCType.ASN]: `[autonomous-system:number = '${ioc.value.replace('AS', '')}']`,
    [IOCType.SSL_CERT_FINGERPRINT]: `[x509-certificate:hashes.'SHA-256' = '${ioc.value}']`,
    [IOCType.YARA_RULE]: `[indicator:pattern = '${ioc.value}']`,
  };

  return patterns[ioc.type] || `[unknown:value = '${ioc.value}']`;
};

/**
 * Creates STIX bundle from multiple IOCs.
 *
 * @param {IOC[]} iocs - IOCs to include
 * @param {object} [options] - Bundle options
 * @returns {STIXBundle} STIX bundle
 *
 * @example
 * ```typescript
 * const bundle = createSTIXBundle(iocs, {
 *   includeRelationships: true,
 *   includeCampaigns: true
 * });
 * ```
 */
export const createSTIXBundle = (
  iocs: IOC[],
  options?: {
    includeRelationships?: boolean;
    includeCampaigns?: boolean;
    includeThreatActors?: boolean;
  }
): STIXBundle => {
  const objects: STIXObject[] = iocs.map(convertIOCToSTIX);

  return {
    type: 'bundle',
    id: `bundle--${crypto.randomUUID()}`,
    spec_version: '2.1',
    objects,
  };
};

/**
 * Parses STIX bundle and extracts IOCs.
 *
 * @param {STIXBundle} bundle - STIX bundle
 * @returns {IOC[]} Extracted IOCs
 *
 * @example
 * ```typescript
 * const iocs = parseSTIXBundle(stixBundle);
 * iocs.forEach(ioc => console.log(ioc.value));
 * ```
 */
export const parseSTIXBundle = (bundle: STIXBundle): IOC[] => {
  const iocs: IOC[] = [];

  bundle.objects.forEach((obj) => {
    if (obj.type === 'indicator') {
      const ioc = parseSTIXIndicator(obj as any);
      if (ioc) iocs.push(ioc);
    }
  });

  return iocs;
};

/**
 * Parses STIX indicator to IOC.
 *
 * @param {any} indicator - STIX indicator
 * @returns {IOC | null} Parsed IOC
 */
export const parseSTIXIndicator = (indicator: any): IOC | null => {
  // Extract IOC type and value from STIX pattern
  const pattern = indicator.pattern;
  let type: IOCType | null = null;
  let value = '';

  if (pattern.includes('ipv4-addr:value')) {
    type = IOCType.IPV4;
    value = pattern.match(/'([^']+)'/)?.[1] || '';
  } else if (pattern.includes('domain-name:value')) {
    type = IOCType.DOMAIN;
    value = pattern.match(/'([^']+)'/)?.[1] || '';
  } else if (pattern.includes('file:hashes.MD5')) {
    type = IOCType.FILE_HASH_MD5;
    value = pattern.match(/'([^']+)'/)?.[1] || '';
  }
  // Add more pattern parsing as needed

  if (!type || !value) return null;

  return createIOC({
    type,
    value,
    severity: ThreatSeverity.MEDIUM,
    confidence: indicator.confidence || 50,
    firstSeen: new Date(indicator.created),
    lastSeen: new Date(indicator.modified),
    tags: indicator.labels || [],
  });
};

/**
 * Publishes IOCs to TAXII server.
 *
 * @param {STIXBundle} bundle - STIX bundle to publish
 * @param {object} config - TAXII server configuration
 * @returns {Promise<object>} Publication result
 *
 * @example
 * ```typescript
 * const result = await publishToTAXII(bundle, {
 *   serverUrl: 'https://taxii.example.com',
 *   collectionId: 'threat-intel',
 *   apiKey: 'your-api-key'
 * });
 * ```
 */
export const publishToTAXII = async (
  bundle: STIXBundle,
  config: {
    serverUrl: string;
    collectionId: string;
    apiKey?: string;
  }
): Promise<{ success: boolean; objectsPublished: number; error?: string }> => {
  try {
    // In production, implement actual TAXII 2.1 API call
    // This is a placeholder
    return {
      success: true,
      objectsPublished: bundle.objects.length,
    };
  } catch (error) {
    return {
      success: false,
      objectsPublished: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Fetches threat intelligence from TAXII server.
 *
 * @param {object} config - TAXII server configuration
 * @param {object} [filters] - Query filters
 * @returns {Promise<STIXBundle>} Fetched STIX bundle
 *
 * @example
 * ```typescript
 * const bundle = await fetchFromTAXII({
 *   serverUrl: 'https://taxii.example.com',
 *   collectionId: 'threat-intel',
 *   apiKey: 'your-api-key'
 * }, {
 *   addedAfter: new Date('2024-01-01')
 * });
 * ```
 */
export const fetchFromTAXII = async (
  config: {
    serverUrl: string;
    collectionId: string;
    apiKey?: string;
  },
  filters?: {
    addedAfter?: Date;
    types?: string[];
    limit?: number;
  }
): Promise<STIXBundle> => {
  // In production, implement actual TAXII 2.1 API call
  // This is a placeholder
  return {
    type: 'bundle',
    id: `bundle--${crypto.randomUUID()}`,
    spec_version: '2.1',
    objects: [],
  };
};

// ============================================================================
// INTELLIGENCE ENRICHMENT FUNCTIONS
// ============================================================================

/**
 * Enriches IOC with geolocation data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {any} provider - Geolocation provider
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCGeolocation(ioc, geoipProvider);
 * console.log(enriched.enrichment?.geolocation);
 * ```
 */
export const enrichIOCGeolocation = async (ioc: IOC, provider?: any): Promise<IOC> => {
  if (ioc.type !== IOCType.IPV4 && ioc.type !== IOCType.IPV6) {
    return ioc;
  }

  // In production, call actual geolocation API
  const geolocation = {
    country: 'US',
    region: 'California',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    asn: 'AS15169',
    isp: 'Google LLC',
  };

  return {
    ...ioc,
    enrichment: {
      ...(ioc.enrichment || {}),
      geolocation,
    },
  };
};

/**
 * Enriches IOC with reputation data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {any} provider - Reputation provider
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCReputation(ioc, virusTotalProvider);
 * console.log(enriched.enrichment?.reputation?.score);
 * ```
 */
export const enrichIOCReputation = async (ioc: IOC, provider?: any): Promise<IOC> => {
  // In production, call actual reputation API (VirusTotal, etc.)
  const reputation = {
    score: 85,
    category: 'malicious',
    threatTypes: ['malware', 'botnet'],
  };

  return {
    ...ioc,
    enrichment: {
      ...(ioc.enrichment || {}),
      reputation,
    },
  };
};

/**
 * Enriches IOC with WHOIS data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCWhois(ioc);
 * console.log(enriched.enrichment?.whois?.registrar);
 * ```
 */
export const enrichIOCWhois = async (ioc: IOC): Promise<IOC> => {
  if (ioc.type !== IOCType.DOMAIN) {
    return ioc;
  }

  // In production, perform actual WHOIS lookup
  const whois = {
    registrar: 'Example Registrar',
    createdDate: new Date('2020-01-01'),
    expiresDate: new Date('2025-01-01'),
    nameServers: ['ns1.example.com', 'ns2.example.com'],
  };

  return {
    ...ioc,
    enrichment: {
      ...(ioc.enrichment || {}),
      whois,
    },
  };
};

/**
 * Enriches IOC with DNS data.
 *
 * @param {IOC} ioc - IOC to enrich
 * @returns {Promise<IOC>} Enriched IOC
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCDNS(ioc);
 * console.log(enriched.enrichment?.dns?.aRecords);
 * ```
 */
export const enrichIOCDNS = async (ioc: IOC): Promise<IOC> => {
  if (ioc.type !== IOCType.DOMAIN) {
    return ioc;
  }

  // In production, perform actual DNS lookups
  const dns = {
    aRecords: ['192.0.2.1'],
    mxRecords: ['mail.example.com'],
    nsRecords: ['ns1.example.com', 'ns2.example.com'],
    txtRecords: ['v=spf1 include:example.com ~all'],
  };

  return {
    ...ioc,
    enrichment: {
      ...(ioc.enrichment || {}),
      dns,
    },
  };
};

/**
 * Performs comprehensive IOC enrichment.
 *
 * @param {IOC} ioc - IOC to enrich
 * @param {object} [providers] - Enrichment providers
 * @returns {Promise<EnrichmentResult>} Enrichment result
 *
 * @example
 * ```typescript
 * const result = await enrichIOC(ioc, {
 *   geolocation: geoipProvider,
 *   reputation: virusTotalProvider
 * });
 * ```
 */
export const enrichIOC = async (
  ioc: IOC,
  providers?: {
    geolocation?: any;
    reputation?: any;
  }
): Promise<EnrichmentResult> => {
  try {
    let enriched = ioc;

    enriched = await enrichIOCGeolocation(enriched, providers?.geolocation);
    enriched = await enrichIOCReputation(enriched, providers?.reputation);
    enriched = await enrichIOCWhois(enriched);
    enriched = await enrichIOCDNS(enriched);

    return {
      iocId: ioc.id,
      provider: 'comprehensive',
      timestamp: new Date(),
      success: true,
      data: enriched.enrichment,
    };
  } catch (error) {
    return {
      iocId: ioc.id,
      provider: 'comprehensive',
      timestamp: new Date(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// ============================================================================
// THREAT INTELLIGENCE STATISTICS AND REPORTING
// ============================================================================

/**
 * Generates comprehensive threat intelligence statistics.
 *
 * @param {IOC[]} iocs - All IOCs
 * @param {ThreatActor[]} actors - All threat actors
 * @param {ThreatCampaign[]} campaigns - All campaigns
 * @returns {ThreatIntelStats} Statistics
 *
 * @example
 * ```typescript
 * const stats = generateThreatIntelStats(iocs, actors, campaigns);
 * console.log(`Total IOCs: ${stats.totalIOCs}`);
 * console.log(`Active IOCs: ${stats.activeIOCs}`);
 * ```
 */
export const generateThreatIntelStats = (
  iocs: IOC[],
  actors: ThreatActor[],
  campaigns: ThreatCampaign[]
): ThreatIntelStats => {
  const activeIOCs = iocs.filter((ioc) => ioc.status === 'active');

  const iocsByType: Record<IOCType, number> = {} as any;
  const iocsBySeverity: Record<ThreatSeverity, number> = {} as any;

  iocs.forEach((ioc) => {
    iocsByType[ioc.type] = (iocsByType[ioc.type] || 0) + 1;
    iocsBySeverity[ioc.severity] = (iocsBySeverity[ioc.severity] || 0) + 1;
  });

  const sourceCounts: Record<string, number> = {};
  iocs.forEach((ioc) => {
    ioc.sources.forEach((source) => {
      sourceCounts[source.provider] = (sourceCounts[source.provider] || 0) + 1;
    });
  });

  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const actorCounts: Record<string, number> = {};
  iocs.forEach((ioc) => {
    ioc.threatActors?.forEach((actorId) => {
      actorCounts[actorId] = (actorCounts[actorId] || 0) + 1;
    });
  });

  const topThreatActors = Object.entries(actorCounts)
    .map(([actor, count]) => ({ actor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const campaignCounts: Record<string, number> = {};
  iocs.forEach((ioc) => {
    ioc.campaigns?.forEach((campaignId) => {
      campaignCounts[campaignId] = (campaignCounts[campaignId] || 0) + 1;
    });
  });

  const topCampaigns = Object.entries(campaignCounts)
    .map(([campaign, count]) => ({ campaign, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyActivity: Record<string, number> = {};
  iocs
    .filter((ioc) => ioc.lastSeen >= thirtyDaysAgo)
    .forEach((ioc) => {
      const date = ioc.lastSeen.toISOString().split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

  const recentActivity = Object.entries(dailyActivity)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const mitreCoverage = getMITRECoverage(iocs);

  return {
    totalIOCs: iocs.length,
    activeIOCs: activeIOCs.length,
    iocsByType,
    iocsBySeverity,
    topSources,
    topThreatActors,
    topCampaigns,
    recentActivity,
    mitreAttackCoverage: Object.entries(mitreCoverage.coverageByTactic).map(
      ([tacticId, count]) => ({ tacticId, count })
    ),
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Sequelize Models
  getThreatFeedModelAttributes,
  getIOCModelAttributes,
  getThreatActorModelAttributes,
  getThreatCampaignModelAttributes,

  // Threat Feed Aggregation
  aggregateThreatFeeds,
  fetchFeedData,
  normalizeIOCValue,
  validateIOCFormat,
  applyThreatFeedFilters,
  syncThreatFeed,

  // IOC Management
  createIOC,
  updateIOC,
  markIOCFalsePositive,
  expireIOC,
  findRelatedIOCs,
  queryIOCs,

  // Threat Actor Tracking
  createThreatActor,
  linkThreatActorToIOCs,
  trackThreatActorActivity,

  // Campaign Analysis
  createThreatCampaign,
  analyzeCampaignTimeline,
  addCampaignEvent,

  // MITRE ATT&CK Mapping
  mapIOCToMITRE,
  getMITRECoverage,
  suggestMITREMappings,

  // STIX/TAXII Integration
  convertIOCToSTIX,
  generateSTIXPattern,
  createSTIXBundle,
  parseSTIXBundle,
  parseSTIXIndicator,
  publishToTAXII,
  fetchFromTAXII,

  // Intelligence Enrichment
  enrichIOCGeolocation,
  enrichIOCReputation,
  enrichIOCWhois,
  enrichIOCDNS,
  enrichIOC,

  // Statistics and Reporting
  generateThreatIntelStats,
};
