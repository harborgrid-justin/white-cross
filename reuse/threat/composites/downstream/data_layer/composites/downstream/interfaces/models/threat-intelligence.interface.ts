/**
 * @fileoverview Threat Intelligence Interface
 * @module interfaces/models/threat-intelligence
 * @description Comprehensive threat intelligence data model
 */

import { IBaseEntity, ITaggableEntity, ISearchableEntity } from './base-entity.interface';
import { ThreatType, ThreatSeverity, ThreatStatus, ThreatActorType, MitreTactic } from '../enums/threat-types.enum';

/**
 * Main threat intelligence interface
 */
export interface IThreatIntelligence extends IBaseEntity, ITaggableEntity, ISearchableEntity {
  /** Threat title/name */
  title: string;

  /** Detailed description */
  description: string;

  /** Threat type classification */
  type: ThreatType;

  /** Threat severity level */
  severity: ThreatSeverity;

  /** Current status */
  status: ThreatStatus;

  /** Confidence score (0-100) */
  confidence: number;

  /** Indicators of Compromise (IoCs) */
  indicators: IIndicatorOfCompromise[];

  /** Affected systems/assets */
  affectedSystems: string[];

  /** Affected technologies/platforms */
  affectedTechnologies?: string[];

  /** Mitigation recommendations */
  mitigation: string;

  /** Remediation steps */
  remediation?: string[];

  /** MITRE ATT&CK techniques */
  mitreTechniques: string[];

  /** MITRE ATT&CK tactics */
  mitreTactics?: MitreTactic[];

  /** Associated CVE IDs */
  cveIds: string[];

  /** Threat actor information */
  threatActor?: IThreatActor;

  /** Campaign ID (if part of larger campaign) */
  campaignId?: string;

  /** First seen timestamp */
  firstSeen?: Date;

  /** Last seen timestamp */
  lastSeen?: Date;

  /** Detection timestamp */
  detectedAt: Date;

  /** Publication timestamp */
  publishedAt?: Date;

  /** External references/links */
  externalReferences?: IExternalReference[];

  /** Source of intelligence */
  source: string;

  /** Source reliability (A-F scale) */
  sourceReliability?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

  /** Information reliability (1-6 scale) */
  informationReliability?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Kill chain phase */
  killChainPhase?: string[];

  /** TLP (Traffic Light Protocol) marking */
  tlpMarking?: 'WHITE' | 'GREEN' | 'AMBER' | 'RED';

  /** Is false positive */
  isFalsePositive?: boolean;

  /** Related threat IDs */
  relatedThreats?: string[];

  /** Related incident IDs */
  relatedIncidents?: string[];

  /** Related vulnerability IDs */
  relatedVulnerabilities?: string[];

  /** Risk score (calculated) */
  riskScore?: number;

  /** Impact assessment */
  impact?: IThreatImpact;

  /** Custom attributes */
  customAttributes?: Record<string, any>;
}

/**
 * Indicator of Compromise
 */
export interface IIndicatorOfCompromise {
  /** IoC ID */
  id: string;

  /** IoC type */
  type: IoC_Type;

  /** IoC value */
  value: string;

  /** Description */
  description?: string;

  /** First seen */
  firstSeen?: Date;

  /** Last seen */
  lastSeen?: Date;

  /** Confidence (0-100) */
  confidence: number;

  /** Is active */
  active: boolean;

  /** Tags */
  tags?: string[];
}

/**
 * IoC types
 */
export type IoC_Type =
  | 'IP_ADDRESS'
  | 'DOMAIN'
  | 'URL'
  | 'EMAIL'
  | 'FILE_HASH_MD5'
  | 'FILE_HASH_SHA1'
  | 'FILE_HASH_SHA256'
  | 'FILE_NAME'
  | 'FILE_PATH'
  | 'REGISTRY_KEY'
  | 'MUTEX'
  | 'USER_AGENT'
  | 'CERTIFICATE'
  | 'CVE'
  | 'YARA_RULE'
  | 'OTHER';

/**
 * Threat actor information
 */
export interface IThreatActor {
  /** Actor ID */
  id?: string;

  /** Actor name/alias */
  name: string;

  /** Actor type */
  type: ThreatActorType;

  /** Aliases */
  aliases?: string[];

  /** Country of origin */
  country?: string;

  /** Motivation */
  motivation?: string[];

  /** Sophistication level */
  sophistication?: 'NONE' | 'MINIMAL' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'INNOVATOR' | 'STRATEGIC';

  /** Resource level */
  resourceLevel?: 'INDIVIDUAL' | 'CLUB' | 'CONTEST' | 'TEAM' | 'ORGANIZATION' | 'GOVERNMENT';

  /** Primary motivation */
  primaryMotivation?: 'ACCIDENTAL' | 'COERCION' | 'DOMINANCE' | 'IDEOLOGY' | 'NOTORIETY' | 'ORGANIZATIONAL_GAIN' | 'PERSONAL_GAIN' | 'PERSONAL_SATISFACTION' | 'REVENGE' | 'UNPREDICTABLE';

  /** Known tools/malware */
  tools?: string[];

  /** TTPs (Tactics, Techniques, Procedures) */
  ttps?: string[];

  /** First observed */
  firstObserved?: Date;

  /** Last observed */
  lastObserved?: Date;
}

/**
 * External reference
 */
export interface IExternalReference {
  /** Source name */
  source: string;

  /** Reference URL */
  url?: string;

  /** Description */
  description?: string;

  /** External ID */
  externalId?: string;

  /** Publication date */
  publishedDate?: Date;
}

/**
 * Threat impact assessment
 */
export interface IThreatImpact {
  /** Business impact (0-100) */
  businessImpact: number;

  /** Technical impact (0-100) */
  technicalImpact: number;

  /** Data sensitivity impact */
  dataSensitivity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Estimated financial impact */
  estimatedFinancialImpact?: number;

  /** Currency */
  currency?: string;

  /** Affected business units */
  affectedBusinessUnits?: string[];

  /** Estimated recovery time */
  estimatedRecoveryTime?: string;

  /** Impact notes */
  notes?: string;
}

/**
 * Threat intelligence feed source
 */
export interface IThreatFeed {
  /** Feed ID */
  id: string;

  /** Feed name */
  name: string;

  /** Feed URL */
  url: string;

  /** Feed type */
  type: 'COMMERCIAL' | 'OPEN_SOURCE' | 'ISAC' | 'GOVERNMENT' | 'COMMUNITY' | 'PROPRIETARY';

  /** Feed format */
  format: 'STIX' | 'TAXII' | 'JSON' | 'XML' | 'CSV' | 'RSS' | 'CUSTOM';

  /** Update frequency (minutes) */
  updateFrequency: number;

  /** Last updated */
  lastUpdated?: Date;

  /** Is active */
  active: boolean;

  /** Reliability score */
  reliabilityScore?: number;

  /** API key (encrypted) */
  apiKey?: string;

  /** Authentication config */
  authConfig?: Record<string, any>;
}
