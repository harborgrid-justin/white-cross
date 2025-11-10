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
export declare const getTLPClassification: (level: TLPLevel) => TLPClassification;
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
export declare const validateTLPSharing: (level: TLPLevel, recipient: string, authorizedRecipients: string[]) => boolean;
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
export declare const determineTLPLevel: (sensitivityScore: number, containsPII: boolean, isOngoing: boolean) => TLPLevel;
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
export declare const upgradeTLPLevel: (currentLevel: TLPLevel) => TLPLevel;
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
export declare const downgradeTLPLevel: (currentLevel: TLPLevel) => TLPLevel;
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
export declare const createSharingAgreement: (agreementData: Partial<SharingAgreement>) => SharingAgreement;
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
export declare const validateAgreementCompliance: (agreement: SharingAgreement, sharePackage: ThreatSharePackage) => boolean;
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
export declare const signSharingAgreement: (agreement: SharingAgreement, partyId: string) => SharingAgreement;
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
export declare const isAgreementExpired: (agreement: SharingAgreement) => boolean;
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
export declare const anonymizeThreatData: (threatData: any, config: AnonymizationConfig) => any;
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
export declare const hashField: (value: string) => string;
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
export declare const generalizeLocation: (location: string) => string;
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
export declare const generalizeTimestamp: (timestamp: Date | string, precision?: "hour" | "day" | "week" | "month") => string;
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
export declare const removePII: (data: any) => any;
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
export declare const createThreatSharePackage: (threatData: unknown, tlpLevel: TLPLevel, source: string, metadata: Partial<ShareMetadata>) => ThreatSharePackage;
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
export declare const validateSharePackage: (sharePackage: ThreatSharePackage) => boolean;
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
export declare const anonymizeSharePackage: (sharePackage: ThreatSharePackage, config: AnonymizationConfig) => ThreatSharePackage;
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
export declare const createTrustGroup: (groupData: Partial<TrustGroup>) => TrustGroup;
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
export declare const addTrustGroupMember: (group: TrustGroup, member: TrustMember) => TrustGroup;
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
export declare const removeTrustGroupMember: (group: TrustGroup, organizationId: string) => TrustGroup;
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
export declare const calculateGroupTrustScore: (group: TrustGroup) => number;
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
export declare const createBidirectionalExchange: (exchangeData: Partial<BidirectionalExchange>) => BidirectionalExchange;
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
export declare const validateExchangeAuth: (auth: ExchangeAuth) => boolean;
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
export declare const applyExchangeFilters: (threats: any[], filters: ExchangeFilters) => any[];
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
export declare const createSharingAuditLog: (logData: Partial<SharingAuditLog>) => SharingAuditLog;
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
export declare const queryAuditLogs: (logs: SharingAuditLog[], filters: Partial<SharingAuditLog>) => SharingAuditLog[];
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
export declare const generateSharingMetrics: (logs: SharingAuditLog[], startDate: Date, endDate: Date) => SharingMetrics;
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
export declare const calculateSharingReputation: (metrics: SharingMetrics) => number;
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
export declare const validateSharingPermissions: (userId: string, organizationId: string, tlpLevel: TLPLevel, authorizedOrgs: string[]) => boolean;
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
export declare const formatThreatForSharing: (threatData: any, targetTLP: TLPLevel) => any;
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
export declare const normalizeThreatData: (threatData: any, sourceFormat: string) => any;
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
export declare const createSharingRequest: (sharePackage: ThreatSharePackage, requesterId: string, approvers: string[]) => object;
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
export declare const validateBulkSharing: (packages: ThreatSharePackage[], agreements: SharingAgreement[]) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
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
export declare const generateSharingReport: (logs: SharingAuditLog[], startDate: Date, endDate: Date) => object;
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
export declare const convertToSTIX: (threatData: any) => object;
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
export declare const parseSTIXBundle: (stixBundle: any) => any[];
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
export declare const validateSTIXBundle: (stixBundle: any) => boolean;
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
export declare const createTAXIICollection: (collectionId: string, title: string, description: string) => object;
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
export declare const generateSharingOpenAPISpec: (baseUrl: string) => object;
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
export declare const createSharingDTO: () => string;
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
export declare const generateSharingAgreementModel: () => string;
declare const _default: {
    getTLPClassification: (level: TLPLevel) => TLPClassification;
    validateTLPSharing: (level: TLPLevel, recipient: string, authorizedRecipients: string[]) => boolean;
    determineTLPLevel: (sensitivityScore: number, containsPII: boolean, isOngoing: boolean) => TLPLevel;
    upgradeTLPLevel: (currentLevel: TLPLevel) => TLPLevel;
    downgradeTLPLevel: (currentLevel: TLPLevel) => TLPLevel;
    createSharingAgreement: (agreementData: Partial<SharingAgreement>) => SharingAgreement;
    validateAgreementCompliance: (agreement: SharingAgreement, sharePackage: ThreatSharePackage) => boolean;
    signSharingAgreement: (agreement: SharingAgreement, partyId: string) => SharingAgreement;
    isAgreementExpired: (agreement: SharingAgreement) => boolean;
    anonymizeThreatData: (threatData: any, config: AnonymizationConfig) => any;
    hashField: (value: string) => string;
    generalizeLocation: (location: string) => string;
    generalizeTimestamp: (timestamp: Date | string, precision?: "hour" | "day" | "week" | "month") => string;
    removePII: (data: any) => any;
    createThreatSharePackage: (threatData: unknown, tlpLevel: TLPLevel, source: string, metadata: Partial<ShareMetadata>) => ThreatSharePackage;
    validateSharePackage: (sharePackage: ThreatSharePackage) => boolean;
    anonymizeSharePackage: (sharePackage: ThreatSharePackage, config: AnonymizationConfig) => ThreatSharePackage;
    createTrustGroup: (groupData: Partial<TrustGroup>) => TrustGroup;
    addTrustGroupMember: (group: TrustGroup, member: TrustMember) => TrustGroup;
    removeTrustGroupMember: (group: TrustGroup, organizationId: string) => TrustGroup;
    calculateGroupTrustScore: (group: TrustGroup) => number;
    createBidirectionalExchange: (exchangeData: Partial<BidirectionalExchange>) => BidirectionalExchange;
    validateExchangeAuth: (auth: ExchangeAuth) => boolean;
    applyExchangeFilters: (threats: any[], filters: ExchangeFilters) => any[];
    createSharingAuditLog: (logData: Partial<SharingAuditLog>) => SharingAuditLog;
    queryAuditLogs: (logs: SharingAuditLog[], filters: Partial<SharingAuditLog>) => SharingAuditLog[];
    generateSharingMetrics: (logs: SharingAuditLog[], startDate: Date, endDate: Date) => SharingMetrics;
    generateSharingOpenAPISpec: (baseUrl: string) => object;
    createSharingDTO: () => string;
    generateSharingAgreementModel: () => string;
    calculateSharingReputation: (metrics: SharingMetrics) => number;
    validateSharingPermissions: (userId: string, organizationId: string, tlpLevel: TLPLevel, authorizedOrgs: string[]) => boolean;
    formatThreatForSharing: (threatData: any, targetTLP: TLPLevel) => any;
    normalizeThreatData: (threatData: any, sourceFormat: string) => any;
    createSharingRequest: (sharePackage: ThreatSharePackage, requesterId: string, approvers: string[]) => object;
    validateBulkSharing: (packages: ThreatSharePackage[], agreements: SharingAgreement[]) => {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    generateSharingReport: (logs: SharingAuditLog[], startDate: Date, endDate: Date) => object;
    convertToSTIX: (threatData: any) => object;
    parseSTIXBundle: (stixBundle: any) => any[];
    validateSTIXBundle: (stixBundle: any) => boolean;
    createTAXIICollection: (collectionId: string, title: string, description: string) => object;
};
export default _default;
//# sourceMappingURL=threat-sharing-kit.d.ts.map