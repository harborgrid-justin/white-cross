/**
 * LOC: THRS1234567
 * File: /reuse/threat/threat-sharing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence controllers and services
 *   - Sharing platform implementations
 *   - TLP handlers and middleware
 */

/**
 * File: /reuse/threat/threat-sharing-kit.ts
 * Locator: WC-UTL-THRS-001
 * Purpose: Comprehensive Threat Sharing Utilities - TLP handling, community sharing, agreements, anonymization
 *
 * Upstream: Independent utility module for threat intelligence sharing
 * Downstream: ../backend/*, Threat controllers, sharing middleware, TLP handlers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 41 utility functions for TLP handling, threat sharing, data anonymization, trust groups, audit trails
 *
 * LLM Context: Comprehensive threat sharing utilities for implementing production-ready threat intelligence
 * sharing platforms in White Cross system. Provides TLP classification, bidirectional sharing, trust groups,
 * anonymization, audit trails, and sharing agreement management. Essential for building collaborative
 * threat intelligence ecosystems with security and privacy controls.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type TLPLevel = 'TLP:RED' | 'TLP:AMBER' | 'TLP:AMBER+STRICT' | 'TLP:GREEN' | 'TLP:CLEAR' | 'TLP:WHITE';

interface TLPClassification {
  level: TLPLevel;
  description: string;
  canShare: boolean;
  restrictions: string[];
  audience: string;
}

interface SharingAgreement {
  id: string;
  name: string;
  version: string;
  parties: string[];
  startDate: Date;
  endDate?: Date;
  terms: SharingTerms;
  status: 'draft' | 'active' | 'suspended' | 'terminated';
  signedBy: string[];
}

interface SharingTerms {
  allowedTLPLevels: TLPLevel[];
  dataRetentionDays: number;
  allowRedistribution: boolean;
  requireAttribution: boolean;
  anonymizationRequired: boolean;
  allowedUseCase: string[];
}

interface ThreatSharePackage {
  id: string;
  threatData: unknown;
  tlpLevel: TLPLevel;
  source: string;
  timestamp: Date;
  shareMetadata: ShareMetadata;
  anonymized: boolean;
  agreementId?: string;
}

interface ShareMetadata {
  sharedWith: string[];
  sharedBy: string;
  shareReason: string;
  expirationDate?: Date;
  redistributionAllowed: boolean;
  feedbackRequested: boolean;
}

interface TrustGroup {
  id: string;
  name: string;
  description: string;
  members: TrustMember[];
  trustLevel: 'high' | 'medium' | 'low';
  sharingPolicy: SharingPolicy;
  createdAt: Date;
}

interface TrustMember {
  organizationId: string;
  organizationName: string;
  role: 'admin' | 'contributor' | 'consumer';
  joinedAt: Date;
  reputation: number;
}

interface SharingPolicy {
  defaultTLP: TLPLevel;
  autoShare: boolean;
  requireApproval: boolean;
  allowedDataTypes: string[];
  excludedIndicators: string[];
}

interface AnonymizationConfig {
  removeSourceIdentifiers: boolean;
  hashSensitiveFields: boolean;
  generalizeLocations: boolean;
  generalizeTimestamps: boolean;
  removePersonalInfo: boolean;
  preserveContext: boolean;
}

interface SharingAuditLog {
  id: string;
  timestamp: Date;
  action: 'shared' | 'received' | 'accessed' | 'modified' | 'deleted';
  threatId: string;
  actor: string;
  recipientOrSource: string;
  tlpLevel: TLPLevel;
  agreementId?: string;
  ipAddress: string;
  userAgent: string;
}

interface BidirectionalExchange {
  partnerId: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  protocol: 'TAXII' | 'STIX' | 'OpenIOC' | 'MISP';
  endpoint: string;
  authentication: ExchangeAuth;
  filters: ExchangeFilters;
  schedule: string;
}

interface ExchangeAuth {
  type: 'api-key' | 'oauth2' | 'certificate' | 'basic';
  credentials: Record<string, string>;
}

interface ExchangeFilters {
  tlpLevels: TLPLevel[];
  threatTypes: string[];
  confidenceThreshold: number;
  ageLimit: number;
}

interface SharingMetrics {
  totalShared: number;
  totalReceived: number;
  sharingPartners: number;
  averageResponseTime: number;
  feedbackRate: number;
  qualityScore: number;
}

// ============================================================================
// TLP CLASSIFICATION UTILITIES
// ============================================================================

/**
 * Gets TLP classification details for a given level.
 *
 * @param {TLPLevel} level - TLP level
 * @returns {TLPClassification} TLP classification details
 *
 * @example
 * ```typescript
 * const classification = getTLPClassification('TLP:AMBER');
 * // Result: { level: 'TLP:AMBER', description: '...', canShare: true, restrictions: [...], audience: '...' }
 * ```
 */
export const getTLPClassification = (level: TLPLevel): TLPClassification => {
  const classifications: Record<TLPLevel, TLPClassification> = {
    'TLP:RED': {
      level: 'TLP:RED',
      description: 'Not for disclosure, restricted to specific individuals only',
      canShare: false,
      restrictions: ['No disclosure beyond named recipients', 'In-person or secure channel only'],
      audience: 'Named recipients only',
    },
    'TLP:AMBER': {
      level: 'TLP:AMBER',
      description: 'Limited disclosure, restricted to organization and clients',
      canShare: true,
      restrictions: ['Organization and clients only', 'No public disclosure', 'Need to know basis'],
      audience: 'Organization and trusted partners',
    },
    'TLP:AMBER+STRICT': {
      level: 'TLP:AMBER+STRICT',
      description: 'Limited disclosure, restricted to organization only',
      canShare: true,
      restrictions: ['Organization only', 'No external sharing', 'Internal use only'],
      audience: 'Organization members only',
    },
    'TLP:GREEN': {
      level: 'TLP:GREEN',
      description: 'Limited disclosure, community wide',
      canShare: true,
      restrictions: ['Community sharing allowed', 'No public disclosure'],
      audience: 'Community and peer organizations',
    },
    'TLP:CLEAR': {
      level: 'TLP:CLEAR',
      description: 'Disclosure is not limited',
      canShare: true,
      restrictions: [],
      audience: 'Public',
    },
    'TLP:WHITE': {
      level: 'TLP:WHITE',
      description: 'Disclosure is not limited (legacy)',
      canShare: true,
      restrictions: [],
      audience: 'Public',
    },
  };

  return classifications[level];
};

/**
 * Validates if sharing is allowed based on TLP level.
 *
 * @param {TLPLevel} level - TLP level to validate
 * @param {string} recipient - Recipient organization identifier
 * @param {string[]} authorizedRecipients - List of authorized recipients
 * @returns {boolean} True if sharing is allowed
 *
 * @example
 * ```typescript
 * const allowed = validateTLPSharing('TLP:AMBER', 'org-123', ['org-123', 'org-456']);
 * // Result: true
 * ```
 */
export const validateTLPSharing = (
  level: TLPLevel,
  recipient: string,
  authorizedRecipients: string[],
): boolean => {
  const classification = getTLPClassification(level);

  if (!classification.canShare) {
    return authorizedRecipients.includes(recipient);
  }

  if (level === 'TLP:AMBER+STRICT') {
    return false; // Only internal sharing
  }

  return true;
};

/**
 * Determines appropriate TLP level based on threat sensitivity.
 *
 * @param {number} sensitivityScore - Sensitivity score (0-100)
 * @param {boolean} containsPII - Contains personally identifiable information
 * @param {boolean} isOngoing - Threat is ongoing/active
 * @returns {TLPLevel} Recommended TLP level
 *
 * @example
 * ```typescript
 * const tlp = determineTLPLevel(85, true, true);
 * // Result: 'TLP:RED'
 * ```
 */
export const determineTLPLevel = (
  sensitivityScore: number,
  containsPII: boolean,
  isOngoing: boolean,
): TLPLevel => {
  if (sensitivityScore >= 90 || (containsPII && isOngoing)) {
    return 'TLP:RED';
  }
  if (sensitivityScore >= 70 || containsPII) {
    return 'TLP:AMBER+STRICT';
  }
  if (sensitivityScore >= 50 || isOngoing) {
    return 'TLP:AMBER';
  }
  if (sensitivityScore >= 30) {
    return 'TLP:GREEN';
  }
  return 'TLP:CLEAR';
};

/**
 * Upgrades TLP level to more restrictive classification.
 *
 * @param {TLPLevel} currentLevel - Current TLP level
 * @returns {TLPLevel} Upgraded TLP level
 *
 * @example
 * ```typescript
 * const upgraded = upgradeTLPLevel('TLP:GREEN');
 * // Result: 'TLP:AMBER'
 * ```
 */
export const upgradeTLPLevel = (currentLevel: TLPLevel): TLPLevel => {
  const hierarchy: TLPLevel[] = ['TLP:CLEAR', 'TLP:GREEN', 'TLP:AMBER', 'TLP:AMBER+STRICT', 'TLP:RED'];
  const currentIndex = hierarchy.indexOf(currentLevel);

  if (currentIndex === -1 || currentIndex === hierarchy.length - 1) {
    return currentLevel;
  }

  return hierarchy[currentIndex + 1];
};

/**
 * Downgrades TLP level to less restrictive classification.
 *
 * @param {TLPLevel} currentLevel - Current TLP level
 * @returns {TLPLevel} Downgraded TLP level
 *
 * @example
 * ```typescript
 * const downgraded = downgradeTLPLevel('TLP:AMBER');
 * // Result: 'TLP:GREEN'
 * ```
 */
export const downgradeTLPLevel = (currentLevel: TLPLevel): TLPLevel => {
  const hierarchy: TLPLevel[] = ['TLP:CLEAR', 'TLP:GREEN', 'TLP:AMBER', 'TLP:AMBER+STRICT', 'TLP:RED'];
  const currentIndex = hierarchy.indexOf(currentLevel);

  if (currentIndex <= 0) {
    return currentLevel;
  }

  return hierarchy[currentIndex - 1];
};

// ============================================================================
// SHARING AGREEMENT UTILITIES
// ============================================================================

/**
 * Creates a new sharing agreement between parties.
 *
 * @param {Partial<SharingAgreement>} agreementData - Agreement data
 * @returns {SharingAgreement} Created sharing agreement
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const agreement = createSharingAgreement({
 *   name: 'SOC Collaboration Agreement',
 *   parties: ['org-1', 'org-2'],
 *   terms: { allowedTLPLevels: ['TLP:GREEN', 'TLP:AMBER'], ... }
 * });
 * ```
 */
export const createSharingAgreement = (
  agreementData: Partial<SharingAgreement>,
): SharingAgreement => {
  if (!agreementData.name || !agreementData.parties || !agreementData.terms) {
    throw new Error('Missing required fields: name, parties, and terms are required');
  }

  return {
    id: agreementData.id || `agr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: agreementData.name,
    version: agreementData.version || '1.0',
    parties: agreementData.parties,
    startDate: agreementData.startDate || new Date(),
    endDate: agreementData.endDate,
    terms: agreementData.terms,
    status: agreementData.status || 'draft',
    signedBy: agreementData.signedBy || [],
  };
};

/**
 * Validates sharing agreement terms compliance.
 *
 * @param {SharingAgreement} agreement - Sharing agreement
 * @param {ThreatSharePackage} sharePackage - Threat share package to validate
 * @returns {boolean} True if compliant with agreement
 *
 * @example
 * ```typescript
 * const compliant = validateAgreementCompliance(agreement, sharePackage);
 * // Result: true or false
 * ```
 */
export const validateAgreementCompliance = (
  agreement: SharingAgreement,
  sharePackage: ThreatSharePackage,
): boolean => {
  if (agreement.status !== 'active') {
    return false;
  }

  if (!agreement.terms.allowedTLPLevels.includes(sharePackage.tlpLevel)) {
    return false;
  }

  if (agreement.terms.anonymizationRequired && !sharePackage.anonymized) {
    return false;
  }

  if (agreement.endDate && new Date() > agreement.endDate) {
    return false;
  }

  return true;
};

/**
 * Signs a sharing agreement by a party.
 *
 * @param {SharingAgreement} agreement - Sharing agreement
 * @param {string} partyId - Party identifier signing the agreement
 * @returns {SharingAgreement} Updated agreement with signature
 * @throws {Error} If party is not authorized to sign
 *
 * @example
 * ```typescript
 * const signed = signSharingAgreement(agreement, 'org-1');
 * ```
 */
export const signSharingAgreement = (
  agreement: SharingAgreement,
  partyId: string,
): SharingAgreement => {
  if (!agreement.parties.includes(partyId)) {
    throw new Error(`Party ${partyId} is not authorized to sign this agreement`);
  }

  if (agreement.signedBy.includes(partyId)) {
    return agreement;
  }

  const updated = { ...agreement };
  updated.signedBy = [...updated.signedBy, partyId];

  // Activate agreement if all parties have signed
  if (updated.signedBy.length === updated.parties.length && updated.status === 'draft') {
    updated.status = 'active';
  }

  return updated;
};

/**
 * Checks if sharing agreement is expired.
 *
 * @param {SharingAgreement} agreement - Sharing agreement
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * const expired = isAgreementExpired(agreement);
 * // Result: true or false
 * ```
 */
export const isAgreementExpired = (agreement: SharingAgreement): boolean => {
  if (!agreement.endDate) {
    return false;
  }

  return new Date() > agreement.endDate;
};

// ============================================================================
// DATA ANONYMIZATION UTILITIES
// ============================================================================

/**
 * Anonymizes threat data according to configuration.
 *
 * @param {unknown} threatData - Raw threat data
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {unknown} Anonymized threat data
 *
 * @example
 * ```typescript
 * const anonymized = anonymizeThreatData(threatData, {
 *   removeSourceIdentifiers: true,
 *   hashSensitiveFields: true,
 *   generalizeLocations: true
 * });
 * ```
 */
export const anonymizeThreatData = (
  threatData: any,
  config: AnonymizationConfig,
): any => {
  let anonymized = JSON.parse(JSON.stringify(threatData));

  if (config.removeSourceIdentifiers) {
    delete anonymized.sourceOrganization;
    delete anonymized.reporter;
    delete anonymized.contactInfo;
  }

  if (config.hashSensitiveFields) {
    const sensitiveFields = ['victimName', 'victimEmail', 'victimIP'];
    sensitiveFields.forEach(field => {
      if (anonymized[field]) {
        anonymized[field] = hashField(anonymized[field]);
      }
    });
  }

  if (config.generalizeLocations) {
    if (anonymized.location) {
      anonymized.location = generalizeLocation(anonymized.location);
    }
  }

  if (config.generalizeTimestamps) {
    if (anonymized.timestamp) {
      anonymized.timestamp = generalizeTimestamp(anonymized.timestamp);
    }
  }

  if (config.removePersonalInfo) {
    anonymized = removePII(anonymized);
  }

  return anonymized;
};

/**
 * Hashes a sensitive field for anonymization.
 *
 * @param {string} value - Value to hash
 * @returns {string} Hashed value
 *
 * @example
 * ```typescript
 * const hashed = hashField('sensitive-data');
 * // Result: 'sha256:a1b2c3d4...'
 * ```
 */
export const hashField = (value: string): string => {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(value).digest('hex');
  return `sha256:${hash}`;
};

/**
 * Generalizes location to country or region level.
 *
 * @param {string} location - Specific location
 * @returns {string} Generalized location
 *
 * @example
 * ```typescript
 * const generalized = generalizeLocation('New York, NY, USA');
 * // Result: 'USA, North America'
 * ```
 */
export const generalizeLocation = (location: string): string => {
  // Simple implementation - in production, use geolocation library
  const parts = location.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return parts[parts.length - 1]; // Return country only
  }
  return location;
};

/**
 * Generalizes timestamp to reduce precision.
 *
 * @param {Date | string} timestamp - Specific timestamp
 * @param {string} [precision='day'] - Precision level (hour, day, week, month)
 * @returns {string} Generalized timestamp
 *
 * @example
 * ```typescript
 * const generalized = generalizeTimestamp(new Date(), 'day');
 * // Result: '2024-01-15T00:00:00.000Z' (time component removed)
 * ```
 */
export const generalizeTimestamp = (
  timestamp: Date | string,
  precision: 'hour' | 'day' | 'week' | 'month' = 'day',
): string => {
  const date = new Date(timestamp);

  switch (precision) {
    case 'hour':
      date.setMinutes(0, 0, 0);
      break;
    case 'day':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const day = date.getDay();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);
      break;
    case 'month':
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      break;
  }

  return date.toISOString();
};

/**
 * Removes personally identifiable information from data.
 *
 * @param {any} data - Data to sanitize
 * @returns {any} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = removePII({ name: 'John Doe', email: 'john@example.com', ip: '1.2.3.4' });
 * // Result: { ip: '1.2.3.4' } (name and email removed)
 * ```
 */
export const removePII = (data: any): any => {
  const piiFields = ['name', 'email', 'phone', 'ssn', 'address', 'creditCard'];
  const sanitized = { ...data };

  piiFields.forEach(field => {
    delete sanitized[field];
  });

  return sanitized;
};

// ============================================================================
// THREAT SHARE PACKAGE UTILITIES
// ============================================================================

/**
 * Creates a threat share package for distribution.
 *
 * @param {unknown} threatData - Threat data to share
 * @param {TLPLevel} tlpLevel - TLP classification level
 * @param {string} source - Source organization
 * @param {Partial<ShareMetadata>} metadata - Share metadata
 * @returns {ThreatSharePackage} Threat share package
 *
 * @example
 * ```typescript
 * const package = createThreatSharePackage(
 *   threatData,
 *   'TLP:AMBER',
 *   'org-123',
 *   { sharedWith: ['org-456'], shareReason: 'Active threat' }
 * );
 * ```
 */
export const createThreatSharePackage = (
  threatData: unknown,
  tlpLevel: TLPLevel,
  source: string,
  metadata: Partial<ShareMetadata>,
): ThreatSharePackage => {
  return {
    id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    threatData,
    tlpLevel,
    source,
    timestamp: new Date(),
    shareMetadata: {
      sharedWith: metadata.sharedWith || [],
      sharedBy: metadata.sharedBy || source,
      shareReason: metadata.shareReason || '',
      expirationDate: metadata.expirationDate,
      redistributionAllowed: metadata.redistributionAllowed || false,
      feedbackRequested: metadata.feedbackRequested || false,
    },
    anonymized: false,
    agreementId: metadata.agreementId,
  };
};

/**
 * Validates threat share package before distribution.
 *
 * @param {ThreatSharePackage} sharePackage - Share package to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateSharePackage(sharePackage);
 * // Result: true or false
 * ```
 */
export const validateSharePackage = (sharePackage: ThreatSharePackage): boolean => {
  if (!sharePackage.threatData || !sharePackage.tlpLevel || !sharePackage.source) {
    return false;
  }

  if (sharePackage.shareMetadata.expirationDate) {
    if (new Date() > sharePackage.shareMetadata.expirationDate) {
      return false;
    }
  }

  return true;
};

/**
 * Applies anonymization to threat share package.
 *
 * @param {ThreatSharePackage} sharePackage - Share package to anonymize
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {ThreatSharePackage} Anonymized share package
 *
 * @example
 * ```typescript
 * const anonymized = anonymizeSharePackage(sharePackage, config);
 * ```
 */
export const anonymizeSharePackage = (
  sharePackage: ThreatSharePackage,
  config: AnonymizationConfig,
): ThreatSharePackage => {
  return {
    ...sharePackage,
    threatData: anonymizeThreatData(sharePackage.threatData, config),
    anonymized: true,
  };
};

// ============================================================================
// TRUST GROUP UTILITIES
// ============================================================================

/**
 * Creates a new trust group for collaborative sharing.
 *
 * @param {Partial<TrustGroup>} groupData - Trust group data
 * @returns {TrustGroup} Created trust group
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const group = createTrustGroup({
 *   name: 'Financial Sector ISAC',
 *   description: 'Financial sector threat sharing',
 *   trustLevel: 'high'
 * });
 * ```
 */
export const createTrustGroup = (groupData: Partial<TrustGroup>): TrustGroup => {
  if (!groupData.name || !groupData.description) {
    throw new Error('Name and description are required');
  }

  return {
    id: groupData.id || `grp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: groupData.name,
    description: groupData.description,
    members: groupData.members || [],
    trustLevel: groupData.trustLevel || 'medium',
    sharingPolicy: groupData.sharingPolicy || {
      defaultTLP: 'TLP:AMBER',
      autoShare: false,
      requireApproval: true,
      allowedDataTypes: [],
      excludedIndicators: [],
    },
    createdAt: groupData.createdAt || new Date(),
  };
};

/**
 * Adds a member to a trust group.
 *
 * @param {TrustGroup} group - Trust group
 * @param {TrustMember} member - Member to add
 * @returns {TrustGroup} Updated trust group
 *
 * @example
 * ```typescript
 * const updated = addTrustGroupMember(group, {
 *   organizationId: 'org-123',
 *   organizationName: 'ACME Corp',
 *   role: 'contributor',
 *   reputation: 85
 * });
 * ```
 */
export const addTrustGroupMember = (group: TrustGroup, member: TrustMember): TrustGroup => {
  const exists = group.members.some(m => m.organizationId === member.organizationId);

  if (exists) {
    return group;
  }

  return {
    ...group,
    members: [
      ...group.members,
      {
        ...member,
        joinedAt: member.joinedAt || new Date(),
      },
    ],
  };
};

/**
 * Removes a member from a trust group.
 *
 * @param {TrustGroup} group - Trust group
 * @param {string} organizationId - Organization ID to remove
 * @returns {TrustGroup} Updated trust group
 *
 * @example
 * ```typescript
 * const updated = removeTrustGroupMember(group, 'org-123');
 * ```
 */
export const removeTrustGroupMember = (group: TrustGroup, organizationId: string): TrustGroup => {
  return {
    ...group,
    members: group.members.filter(m => m.organizationId !== organizationId),
  };
};

/**
 * Calculates average trust score for a group.
 *
 * @param {TrustGroup} group - Trust group
 * @returns {number} Average trust score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateGroupTrustScore(group);
 * // Result: 82.5
 * ```
 */
export const calculateGroupTrustScore = (group: TrustGroup): number => {
  if (group.members.length === 0) {
    return 0;
  }

  const totalReputation = group.members.reduce((sum, member) => sum + member.reputation, 0);
  return totalReputation / group.members.length;
};

// ============================================================================
// BIDIRECTIONAL EXCHANGE UTILITIES
// ============================================================================

/**
 * Creates bidirectional exchange configuration.
 *
 * @param {Partial<BidirectionalExchange>} exchangeData - Exchange configuration
 * @returns {BidirectionalExchange} Exchange configuration
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const exchange = createBidirectionalExchange({
 *   partnerId: 'partner-123',
 *   protocol: 'TAXII',
 *   endpoint: 'https://partner.com/taxii',
 *   direction: 'bidirectional'
 * });
 * ```
 */
export const createBidirectionalExchange = (
  exchangeData: Partial<BidirectionalExchange>,
): BidirectionalExchange => {
  if (!exchangeData.partnerId || !exchangeData.protocol || !exchangeData.endpoint) {
    throw new Error('partnerId, protocol, and endpoint are required');
  }

  return {
    partnerId: exchangeData.partnerId,
    direction: exchangeData.direction || 'bidirectional',
    protocol: exchangeData.protocol,
    endpoint: exchangeData.endpoint,
    authentication: exchangeData.authentication || {
      type: 'api-key',
      credentials: {},
    },
    filters: exchangeData.filters || {
      tlpLevels: ['TLP:GREEN', 'TLP:AMBER'],
      threatTypes: [],
      confidenceThreshold: 50,
      ageLimit: 90,
    },
    schedule: exchangeData.schedule || '0 */6 * * *', // Every 6 hours
  };
};

/**
 * Validates exchange authentication credentials.
 *
 * @param {ExchangeAuth} auth - Authentication configuration
 * @returns {boolean} True if credentials are valid
 *
 * @example
 * ```typescript
 * const valid = validateExchangeAuth(auth);
 * // Result: true or false
 * ```
 */
export const validateExchangeAuth = (auth: ExchangeAuth): boolean => {
  switch (auth.type) {
    case 'api-key':
      return !!auth.credentials.apiKey;
    case 'oauth2':
      return !!auth.credentials.clientId && !!auth.credentials.clientSecret;
    case 'certificate':
      return !!auth.credentials.cert && !!auth.credentials.key;
    case 'basic':
      return !!auth.credentials.username && !!auth.credentials.password;
    default:
      return false;
  }
};

/**
 * Applies filters to threat data for exchange.
 *
 * @param {any[]} threats - Threat data array
 * @param {ExchangeFilters} filters - Exchange filters
 * @returns {any[]} Filtered threat data
 *
 * @example
 * ```typescript
 * const filtered = applyExchangeFilters(threats, exchangeFilters);
 * ```
 */
export const applyExchangeFilters = (threats: any[], filters: ExchangeFilters): any[] => {
  return threats.filter(threat => {
    // TLP level filter
    if (threat.tlpLevel && !filters.tlpLevels.includes(threat.tlpLevel)) {
      return false;
    }

    // Threat type filter
    if (filters.threatTypes.length > 0 && !filters.threatTypes.includes(threat.type)) {
      return false;
    }

    // Confidence threshold filter
    if (threat.confidence < filters.confidenceThreshold) {
      return false;
    }

    // Age limit filter
    if (threat.timestamp) {
      const ageInDays = (Date.now() - new Date(threat.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays > filters.ageLimit) {
        return false;
      }
    }

    return true;
  });
};

// ============================================================================
// AUDIT TRAIL UTILITIES
// ============================================================================

/**
 * Creates a sharing audit log entry.
 *
 * @param {Partial<SharingAuditLog>} logData - Audit log data
 * @returns {SharingAuditLog} Audit log entry
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const log = createSharingAuditLog({
 *   action: 'shared',
 *   threatId: 'threat-123',
 *   actor: 'user-456',
 *   recipientOrSource: 'org-789',
 *   tlpLevel: 'TLP:AMBER'
 * });
 * ```
 */
export const createSharingAuditLog = (logData: Partial<SharingAuditLog>): SharingAuditLog => {
  if (!logData.action || !logData.threatId || !logData.actor || !logData.recipientOrSource) {
    throw new Error('action, threatId, actor, and recipientOrSource are required');
  }

  return {
    id: logData.id || `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: logData.timestamp || new Date(),
    action: logData.action,
    threatId: logData.threatId,
    actor: logData.actor,
    recipientOrSource: logData.recipientOrSource,
    tlpLevel: logData.tlpLevel || 'TLP:GREEN',
    agreementId: logData.agreementId,
    ipAddress: logData.ipAddress || '',
    userAgent: logData.userAgent || '',
  };
};

/**
 * Queries audit logs with filters.
 *
 * @param {SharingAuditLog[]} logs - All audit logs
 * @param {Partial<SharingAuditLog>} filters - Filter criteria
 * @returns {SharingAuditLog[]} Filtered audit logs
 *
 * @example
 * ```typescript
 * const filtered = queryAuditLogs(allLogs, {
 *   action: 'shared',
 *   tlpLevel: 'TLP:AMBER'
 * });
 * ```
 */
export const queryAuditLogs = (
  logs: SharingAuditLog[],
  filters: Partial<SharingAuditLog>,
): SharingAuditLog[] => {
  return logs.filter(log => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.threatId && log.threatId !== filters.threatId) return false;
    if (filters.actor && log.actor !== filters.actor) return false;
    if (filters.tlpLevel && log.tlpLevel !== filters.tlpLevel) return false;
    if (filters.agreementId && log.agreementId !== filters.agreementId) return false;
    return true;
  });
};

/**
 * Generates sharing metrics from audit logs.
 *
 * @param {SharingAuditLog[]} logs - Audit logs
 * @param {Date} startDate - Start date for metrics
 * @param {Date} endDate - End date for metrics
 * @returns {SharingMetrics} Sharing metrics
 *
 * @example
 * ```typescript
 * const metrics = generateSharingMetrics(logs, startDate, endDate);
 * // Result: { totalShared: 150, totalReceived: 200, ... }
 * ```
 */
export const generateSharingMetrics = (
  logs: SharingAuditLog[],
  startDate: Date,
  endDate: Date,
): SharingMetrics => {
  const periodLogs = logs.filter(
    log => log.timestamp >= startDate && log.timestamp <= endDate,
  );

  const totalShared = periodLogs.filter(log => log.action === 'shared').length;
  const totalReceived = periodLogs.filter(log => log.action === 'received').length;

  const partners = new Set(periodLogs.map(log => log.recipientOrSource));
  const sharingPartners = partners.size;

  return {
    totalShared,
    totalReceived,
    sharingPartners,
    averageResponseTime: 0, // Calculated separately based on feedback timestamps
    feedbackRate: 0, // Calculated separately
    qualityScore: 0, // Calculated separately based on feedback
  };
};

// ============================================================================
// COMMUNITY SHARING UTILITIES
// ============================================================================

/**
 * Calculates organization sharing reputation score.
 *
 * @param {SharingMetrics} metrics - Sharing metrics
 * @returns {number} Reputation score (0-100)
 *
 * @example
 * ```typescript
 * const reputation = calculateSharingReputation(metrics);
 * // Result: 85
 * ```
 */
export const calculateSharingReputation = (metrics: SharingMetrics): number => {
  const shareScore = Math.min(metrics.totalShared / 100, 1.0) * 30;
  const feedbackScore = metrics.feedbackRate * 20;
  const qualityScore = metrics.qualityScore * 0.3;
  const partnerScore = Math.min(metrics.sharingPartners / 20, 1.0) * 20;

  return shareScore + feedbackScore + qualityScore + partnerScore;
};

/**
 * Validates sharing permissions for user/organization.
 *
 * @param {string} userId - User identifier
 * @param {string} organizationId - Organization identifier
 * @param {TLPLevel} tlpLevel - TLP level to share
 * @param {string[]} authorizedOrgs - Authorized organizations
 * @returns {boolean} True if sharing is permitted
 *
 * @example
 * ```typescript
 * const canShare = validateSharingPermissions('user-123', 'org-456', 'TLP:AMBER', authorizedOrgs);
 * ```
 */
export const validateSharingPermissions = (
  userId: string,
  organizationId: string,
  tlpLevel: TLPLevel,
  authorizedOrgs: string[],
): boolean => {
  if (!userId || !organizationId) return false;

  const classification = getTLPClassification(tlpLevel);

  if (tlpLevel === 'TLP:RED') {
    return authorizedOrgs.includes(organizationId);
  }

  if (tlpLevel === 'TLP:AMBER+STRICT') {
    return false; // Internal only
  }

  return true;
};

/**
 * Formats threat data for community sharing.
 *
 * @param {unknown} threatData - Raw threat data
 * @param {TLPLevel} targetTLP - Target TLP level
 * @returns {unknown} Formatted threat data
 *
 * @example
 * ```typescript
 * const formatted = formatThreatForSharing(rawData, 'TLP:GREEN');
 * ```
 */
export const formatThreatForSharing = (threatData: any, targetTLP: TLPLevel): any => {
  const formatted = { ...threatData };

  // Add TLP marking
  formatted.tlp = targetTLP;

  // Add sharing metadata
  formatted.sharedAt = new Date().toISOString();
  formatted.sharingRestrictions = getTLPClassification(targetTLP).restrictions;

  // Ensure required fields
  if (!formatted.id) {
    formatted.id = `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return formatted;
};

/**
 * Normalizes threat data format across different sources.
 *
 * @param {unknown} threatData - Raw threat data
 * @param {string} sourceFormat - Source format (STIX, OpenIOC, MISP, etc.)
 * @returns {unknown} Normalized threat data
 *
 * @example
 * ```typescript
 * const normalized = normalizeThreatData(rawData, 'STIX');
 * ```
 */
export const normalizeThreatData = (threatData: any, sourceFormat: string): any => {
  const normalized: any = {
    id: threatData.id,
    type: threatData.type,
    indicators: [],
    timestamp: new Date(),
    source: sourceFormat,
  };

  // Map based on source format
  switch (sourceFormat.toUpperCase()) {
    case 'STIX':
      normalized.indicators = threatData.objects || [];
      normalized.confidence = threatData.confidence || 50;
      break;
    case 'MISP':
      normalized.indicators = threatData.Event?.Attribute || [];
      normalized.confidence = threatData.Event?.threat_level_id ? (4 - threatData.Event.threat_level_id) * 25 : 50;
      break;
    case 'OPENIOC':
      normalized.indicators = threatData.indicators || [];
      normalized.confidence = 70;
      break;
    default:
      normalized.indicators = threatData.indicators || [];
      normalized.confidence = 50;
  }

  return normalized;
};

// ============================================================================
// SHARING WORKFLOW UTILITIES
// ============================================================================

/**
 * Creates a sharing request for approval workflow.
 *
 * @param {ThreatSharePackage} sharePackage - Share package
 * @param {string} requesterId - Requester user ID
 * @param {string[]} approvers - List of approver IDs
 * @returns {object} Sharing request
 *
 * @example
 * ```typescript
 * const request = createSharingRequest(sharePackage, 'user-123', ['approver-1', 'approver-2']);
 * ```
 */
export const createSharingRequest = (
  sharePackage: ThreatSharePackage,
  requesterId: string,
  approvers: string[],
): object => {
  return {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sharePackage,
    requesterId,
    approvers,
    status: 'pending',
    createdAt: new Date(),
    approvals: [],
    rejections: [],
  };
};

/**
 * Validates bulk sharing operation.
 *
 * @param {ThreatSharePackage[]} packages - Share packages
 * @param {SharingAgreement[]} agreements - Active sharing agreements
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBulkSharing(packages, agreements);
 * // Result: { valid: true, errors: [], warnings: [] }
 * ```
 */
export const validateBulkSharing = (
  packages: ThreatSharePackage[],
  agreements: SharingAgreement[],
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  packages.forEach((pkg, index) => {
    if (!validateSharePackage(pkg)) {
      errors.push(`Package ${index}: Invalid share package`);
    }

    if (pkg.agreementId) {
      const agreement = agreements.find(a => a.id === pkg.agreementId);
      if (!agreement) {
        errors.push(`Package ${index}: Agreement ${pkg.agreementId} not found`);
      } else if (!validateAgreementCompliance(agreement, pkg)) {
        errors.push(`Package ${index}: Does not comply with agreement terms`);
      }
    }

    if (pkg.tlpLevel === 'TLP:RED') {
      warnings.push(`Package ${index}: TLP:RED requires explicit recipient authorization`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Generates sharing report for audit purposes.
 *
 * @param {SharingAuditLog[]} logs - Audit logs
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Sharing report
 *
 * @example
 * ```typescript
 * const report = generateSharingReport(logs, startDate, endDate);
 * ```
 */
export const generateSharingReport = (
  logs: SharingAuditLog[],
  startDate: Date,
  endDate: Date,
): object => {
  const periodLogs = logs.filter(log => log.timestamp >= startDate && log.timestamp <= endDate);

  const byAction = periodLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byTLP = periodLogs.reduce((acc, log) => {
    acc[log.tlpLevel] = (acc[log.tlpLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniquePartners = new Set(periodLogs.map(log => log.recipientOrSource)).size;

  return {
    period: { startDate, endDate },
    totalEvents: periodLogs.length,
    byAction,
    byTLP,
    uniquePartners,
    topActors: getTopActors(periodLogs, 10),
    complianceScore: calculateComplianceScore(periodLogs),
  };
};

const getTopActors = (logs: SharingAuditLog[], limit: number): object[] => {
  const actorCounts = logs.reduce((acc, log) => {
    acc[log.actor] = (acc[log.actor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(actorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([actor, count]) => ({ actor, count }));
};

const calculateComplianceScore = (logs: SharingAuditLog[]): number => {
  // Simple compliance: all logs with agreements are compliant
  const withAgreements = logs.filter(log => log.agreementId).length;
  return logs.length > 0 ? (withAgreements / logs.length) * 100 : 100;
};

// ============================================================================
// STIX/TAXII INTEGRATION UTILITIES
// ============================================================================

/**
 * Converts threat data to STIX 2.1 format.
 *
 * @param {unknown} threatData - Threat data
 * @returns {object} STIX bundle
 *
 * @example
 * ```typescript
 * const stix = convertToSTIX(threatData);
 * ```
 */
export const convertToSTIX = (threatData: any): object => {
  return {
    type: 'bundle',
    id: `bundle--${Date.now()}`,
    objects: [
      {
        type: 'indicator',
        id: `indicator--${threatData.id}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: threatData.name || 'Unknown Threat',
        pattern: threatData.pattern || '',
        pattern_type: 'stix',
        valid_from: new Date().toISOString(),
      },
    ],
  };
};

/**
 * Parses STIX bundle into internal format.
 *
 * @param {object} stixBundle - STIX bundle
 * @returns {unknown[]} Parsed threats
 *
 * @example
 * ```typescript
 * const threats = parseSTIXBundle(bundle);
 * ```
 */
export const parseSTIXBundle = (stixBundle: any): any[] => {
  if (!stixBundle.objects || !Array.isArray(stixBundle.objects)) {
    return [];
  }

  return stixBundle.objects.map((obj: any) => ({
    id: obj.id,
    type: obj.type,
    name: obj.name,
    created: obj.created,
    modified: obj.modified,
    confidence: obj.confidence || 50,
    raw: obj,
  }));
};

/**
 * Validates STIX bundle structure.
 *
 * @param {object} stixBundle - STIX bundle to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateSTIXBundle(bundle);
 * ```
 */
export const validateSTIXBundle = (stixBundle: any): boolean => {
  if (!stixBundle || typeof stixBundle !== 'object') return false;
  if (stixBundle.type !== 'bundle') return false;
  if (!Array.isArray(stixBundle.objects)) return false;

  return stixBundle.objects.every((obj: any) => {
    return obj.type && obj.id && obj.created && obj.modified;
  });
};

/**
 * Creates TAXII collection for threat sharing.
 *
 * @param {string} collectionId - Collection identifier
 * @param {string} title - Collection title
 * @param {string} description - Collection description
 * @returns {object} TAXII collection
 *
 * @example
 * ```typescript
 * const collection = createTAXIICollection('coll-123', 'Malware Indicators', 'Collection of malware IOCs');
 * ```
 */
export const createTAXIICollection = (
  collectionId: string,
  title: string,
  description: string,
): object => {
  return {
    id: collectionId,
    title,
    description,
    can_read: true,
    can_write: true,
    media_types: ['application/stix+json;version=2.1'],
  };
};

// ============================================================================
// SHARING API DESIGN UTILITIES
// ============================================================================

/**
 * Generates OpenAPI specification for sharing endpoints.
 *
 * @param {string} baseUrl - Base URL for API
 * @returns {object} OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = generateSharingOpenAPISpec('/api/v1/threat-sharing');
 * ```
 */
export const generateSharingOpenAPISpec = (baseUrl: string): object => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Threat Intelligence Sharing API',
      version: '1.0.0',
      description: 'API for sharing threat intelligence with TLP compliance',
    },
    servers: [{ url: baseUrl }],
    paths: {
      '/share': {
        post: {
          summary: 'Share threat intelligence',
          tags: ['Sharing'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ThreatSharePackage' },
              },
            },
          },
          responses: {
            '200': { description: 'Successfully shared' },
            '400': { description: 'Invalid request' },
            '403': { description: 'TLP restrictions violated' },
          },
        },
      },
      '/receive': {
        get: {
          summary: 'Receive shared threat intelligence',
          tags: ['Sharing'],
          parameters: [
            {
              name: 'tlpLevel',
              in: 'query',
              schema: { type: 'string', enum: ['TLP:RED', 'TLP:AMBER', 'TLP:GREEN', 'TLP:CLEAR'] },
            },
          ],
          responses: {
            '200': { description: 'Threat data retrieved' },
          },
        },
      },
    },
    components: {
      schemas: {
        ThreatSharePackage: {
          type: 'object',
          properties: {
            threatData: { type: 'object' },
            tlpLevel: { type: 'string' },
            source: { type: 'string' },
          },
        },
      },
    },
  };
};

/**
 * Creates NestJS DTO for threat sharing.
 *
 * @returns {string} NestJS DTO class definition
 *
 * @example
 * ```typescript
 * const dto = createSharingDTO();
 * // Returns class definition string
 * ```
 */
export const createSharingDTO = (): string => {
  return `
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareThreatDto {
  @ApiProperty({ description: 'Threat data to share' })
  threatData: object;

  @ApiProperty({ enum: ['TLP:RED', 'TLP:AMBER', 'TLP:GREEN', 'TLP:CLEAR'] })
  @IsEnum(['TLP:RED', 'TLP:AMBER', 'TLP:GREEN', 'TLP:CLEAR'])
  tlpLevel: string;

  @ApiProperty({ description: 'Recipients organization IDs' })
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ description: 'Sharing reason', required: false })
  @IsOptional()
  @IsString()
  shareReason?: string;

  @ApiProperty({ description: 'Request anonymization', required: false })
  @IsOptional()
  @IsBoolean()
  anonymize?: boolean;
}
  `.trim();
};

/**
 * Generates Sequelize model for sharing agreements.
 *
 * @returns {string} Sequelize model definition
 *
 * @example
 * ```typescript
 * const model = generateSharingAgreementModel();
 * ```
 */
export const generateSharingAgreementModel = (): string => {
  return `
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sharing_agreements', timestamps: true })
export class SharingAgreement extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, defaultValue: '1.0' })
  version: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  parties: string[];

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endDate: Date;

  @Column({ type: DataType.JSONB, allowNull: false })
  terms: object;

  @Column({ type: DataType.ENUM('draft', 'active', 'suspended', 'terminated'), defaultValue: 'draft' })
  status: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  signedBy: string[];
}
  `.trim();
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // TLP Classification
  getTLPClassification,
  validateTLPSharing,
  determineTLPLevel,
  upgradeTLPLevel,
  downgradeTLPLevel,

  // Sharing Agreements
  createSharingAgreement,
  validateAgreementCompliance,
  signSharingAgreement,
  isAgreementExpired,

  // Data Anonymization
  anonymizeThreatData,
  hashField,
  generalizeLocation,
  generalizeTimestamp,
  removePII,

  // Threat Share Packages
  createThreatSharePackage,
  validateSharePackage,
  anonymizeSharePackage,

  // Trust Groups
  createTrustGroup,
  addTrustGroupMember,
  removeTrustGroupMember,
  calculateGroupTrustScore,

  // Bidirectional Exchange
  createBidirectionalExchange,
  validateExchangeAuth,
  applyExchangeFilters,

  // Audit Trail
  createSharingAuditLog,
  queryAuditLogs,
  generateSharingMetrics,

  // API Design
  generateSharingOpenAPISpec,
  createSharingDTO,
  generateSharingAgreementModel,

  // Community Sharing
  calculateSharingReputation,
  validateSharingPermissions,
  formatThreatForSharing,
  normalizeThreatData,

  // Sharing Workflow
  createSharingRequest,
  validateBulkSharing,
  generateSharingReport,

  // STIX/TAXII Integration
  convertToSTIX,
  parseSTIXBundle,
  validateSTIXBundle,
  createTAXIICollection,
};
