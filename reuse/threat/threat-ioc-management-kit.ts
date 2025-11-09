/**
 * LOC: THMI1234567
 * File: /reuse/threat/threat-ioc-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/threat/threat-indicators-kit.ts (IOC types and validation)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC management controllers
 *   - Security analytics modules
 */

/**
 * File: /reuse/threat/threat-ioc-management-kit.ts
 * Locator: WC-UTL-THMI-001
 * Purpose: Comprehensive IOC Management Utilities - collection, search, tagging, relationships, analytics
 *
 * Upstream: /reuse/threat/threat-indicators-kit.ts for IOC types
 * Downstream: ../backend/*, threat services, security controllers, analytics engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI, Sequelize
 * Exports: 40 utility functions for IOC management, search, bulk operations, analytics
 *
 * LLM Context: Comprehensive IOC management utilities for collecting, organizing, and analyzing threat indicators in White Cross system.
 * Provides IOC collection, aggregation, advanced search, filtering, tagging, categorization, expiration management, relationship mapping,
 * import/export capabilities, bulk operations, and analytics. Essential for operational threat intelligence management with
 * HIPAA compliance for healthcare security operations.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Re-export core types from threat-indicators-kit
 */
type IocType =
  | 'ip'
  | 'domain'
  | 'hash'
  | 'url'
  | 'email'
  | 'file'
  | 'registry'
  | 'mutex'
  | 'user-agent'
  | 'certificate';

type ConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
type IocStatus = 'active' | 'inactive' | 'expired' | 'pending' | 'false-positive';
type ThreatSeverity = 'informational' | 'low' | 'medium' | 'high' | 'critical';

interface IocIndicator {
  id?: string;
  type: IocType;
  value: string;
  confidence: ConfidenceLevel;
  severity: ThreatSeverity;
  status: IocStatus;
  firstSeen?: Date;
  lastSeen?: Date;
  expiresAt?: Date;
  source?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * IOC collection configuration
 */
interface IocCollectionConfig {
  sources: string[];
  autoEnrich?: boolean;
  autoValidate?: boolean;
  deduplication?: boolean;
  defaultTtlDays?: number;
  confidenceThreshold?: ConfidenceLevel;
}

/**
 * IOC search query parameters
 */
interface IocSearchQuery {
  types?: IocType[];
  values?: string[];
  confidenceLevels?: ConfidenceLevel[];
  severities?: ThreatSeverity[];
  statuses?: IocStatus[];
  tags?: string[];
  sources?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof IocIndicator;
  sortOrder?: 'asc' | 'desc';
}

/**
 * IOC search result with pagination
 */
interface IocSearchResult {
  items: IocIndicator[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * IOC filter criteria for advanced filtering
 */
interface IocFilterCriteria {
  field: keyof IocIndicator | string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
  value: unknown;
}

/**
 * IOC tag structure for categorization
 */
interface IocTag {
  name: string;
  category?: string;
  color?: string;
  description?: string;
  createdAt?: Date;
}

/**
 * IOC category for hierarchical organization
 */
interface IocCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: IocCategory[];
  iocCount?: number;
}

/**
 * IOC expiration policy
 */
interface IocExpirationPolicy {
  defaultTtlDays: number;
  typeSpecificTtl?: Partial<Record<IocType, number>>;
  confidenceBasedTtl?: Partial<Record<ConfidenceLevel, number>>;
  autoExpire: boolean;
  gracePeriodDays?: number;
}

/**
 * IOC relationship types
 */
type IocRelationshipType =
  | 'resolves-to'
  | 'communicates-with'
  | 'drops'
  | 'downloads'
  | 'related-to'
  | 'part-of'
  | 'variant-of'
  | 'uses';

/**
 * IOC relationship structure
 */
interface IocRelationship {
  id?: string;
  sourceIocId: string;
  targetIocId: string;
  relationshipType: IocRelationshipType;
  confidence: number; // 0-1
  firstObserved?: Date;
  lastObserved?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * IOC relationship graph node
 */
interface IocGraphNode {
  ioc: IocIndicator;
  relationships: Array<{
    target: IocIndicator;
    type: IocRelationshipType;
    confidence: number;
  }>;
}

/**
 * IOC import/export format
 */
type IocExportFormat = 'json' | 'csv' | 'stix' | 'misp' | 'openIOC';

/**
 * IOC import result
 */
interface IocImportResult {
  successful: number;
  failed: number;
  duplicates: number;
  errors: Array<{
    line?: number;
    value: string;
    error: string;
  }>;
  imported: IocIndicator[];
}

/**
 * IOC export options
 */
interface IocExportOptions {
  format: IocExportFormat;
  includeExpired?: boolean;
  includeInactive?: boolean;
  includeFalsePositives?: boolean;
  includeMetadata?: boolean;
  includeRelationships?: boolean;
  filters?: IocSearchQuery;
}

/**
 * IOC bulk operation types
 */
type IocBulkOperation =
  | 'activate'
  | 'deactivate'
  | 'expire'
  | 'delete'
  | 'update-confidence'
  | 'update-severity'
  | 'add-tags'
  | 'remove-tags'
  | 'extend-ttl';

/**
 * IOC bulk operation request
 */
interface IocBulkOperationRequest {
  operation: IocBulkOperation;
  iocIds?: string[];
  filters?: IocSearchQuery;
  parameters?: Record<string, unknown>;
}

/**
 * IOC bulk operation result
 */
interface IocBulkOperationResult {
  operation: IocBulkOperation;
  successful: number;
  failed: number;
  errors: Array<{
    iocId: string;
    error: string;
  }>;
}

/**
 * IOC analytics summary
 */
interface IocAnalyticsSummary {
  totalIocs: number;
  activeIocs: number;
  expiredIocs: number;
  byType: Record<IocType, number>;
  byConfidence: Record<ConfidenceLevel, number>;
  bySeverity: Record<ThreatSeverity, number>;
  bySource: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{
    date: string;
    created: number;
    expired: number;
    updated: number;
  }>;
}

/**
 * IOC statistics time series
 */
interface IocTimeSeries {
  interval: 'hour' | 'day' | 'week' | 'month';
  dataPoints: Array<{
    timestamp: Date;
    count: number;
    breakdown?: Record<string, number>;
  }>;
}

/**
 * Sequelize query options for IOC retrieval
 */
interface SequelizeIocQueryOptions {
  where?: Record<string, unknown>;
  attributes?: string[];
  include?: unknown[];
  limit?: number;
  offset?: number;
  order?: Array<[string, 'ASC' | 'DESC']>;
}

/**
 * NestJS controller DTO for IOC creation
 */
interface CreateIocDto {
  type: IocType;
  value: string;
  confidence?: ConfidenceLevel;
  severity?: ThreatSeverity;
  source?: string;
  tags?: string[];
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * NestJS controller DTO for IOC update
 */
interface UpdateIocDto {
  confidence?: ConfidenceLevel;
  severity?: ThreatSeverity;
  status?: IocStatus;
  tags?: string[];
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * NestJS controller response DTO
 */
interface IocResponseDto extends IocIndicator {
  relationships?: IocRelationship[];
  enrichmentData?: Record<string, unknown>;
}

// ============================================================================
// IOC COLLECTION AND AGGREGATION
// ============================================================================

/**
 * Collects IOCs from multiple sources with configuration.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators to collect
 * @param {IocCollectionConfig} config - Collection configuration
 * @returns {Promise<IocIndicator[]>} Collected and processed IOCs
 *
 * @example
 * ```typescript
 * const iocs = [{ type: 'ip', value: '1.2.3.4', ... }, ...];
 * const config = {
 *   sources: ['osint', 'internal'],
 *   autoEnrich: true,
 *   deduplication: true,
 *   defaultTtlDays: 30
 * };
 * const collected = await collectIocs(iocs, config);
 * ```
 */
export const collectIocs = async (
  iocs: IocIndicator[],
  config: IocCollectionConfig,
): Promise<IocIndicator[]> => {
  const collected: IocIndicator[] = [];

  for (const ioc of iocs) {
    // Validate if enabled
    if (config.autoValidate) {
      // Validation would happen here - placeholder for actual implementation
      const isValid = ioc.value && ioc.type;
      if (!isValid) continue;
    }

    // Set default TTL if not present
    if (!ioc.expiresAt && config.defaultTtlDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + config.defaultTtlDays);
      ioc.expiresAt = expiresAt;
    }

    // Apply confidence threshold filter
    if (config.confidenceThreshold) {
      const confidenceOrder: ConfidenceLevel[] = ['low', 'medium', 'high', 'critical'];
      const iocConfidenceIndex = confidenceOrder.indexOf(ioc.confidence);
      const thresholdIndex = confidenceOrder.indexOf(config.confidenceThreshold);

      if (iocConfidenceIndex < thresholdIndex) continue;
    }

    collected.push(ioc);
  }

  // Deduplicate if enabled
  if (config.deduplication) {
    const seen = new Map<string, IocIndicator>();
    return collected.filter(ioc => {
      const key = `${ioc.type}:${ioc.value}`;
      if (seen.has(key)) return false;
      seen.set(key, ioc);
      return true;
    });
  }

  return collected;
};

/**
 * Aggregates IOCs by a specific field with counting.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {keyof IocIndicator} field - Field to aggregate by
 * @returns {Record<string, number>} Aggregation result
 *
 * @example
 * ```typescript
 * const iocs = [/* ... */];
 * const byType = aggregateIocs(iocs, 'type');
 * // Result: { ip: 100, domain: 50, hash: 25, ... }
 * ```
 */
export const aggregateIocs = (
  iocs: IocIndicator[],
  field: keyof IocIndicator,
): Record<string, number> => {
  const aggregation: Record<string, number> = {};

  iocs.forEach(ioc => {
    const value = String(ioc[field] || 'unknown');
    aggregation[value] = (aggregation[value] || 0) + 1;
  });

  return aggregation;
};

/**
 * Groups IOCs by multiple fields for hierarchical organization.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {Array<keyof IocIndicator>} fields - Fields to group by
 * @returns {Record<string, IocIndicator[]>} Grouped IOCs
 *
 * @example
 * ```typescript
 * const grouped = groupIocsBy(iocs, ['type', 'confidence']);
 * // Result: { 'ip:high': [...], 'domain:medium': [...], ... }
 * ```
 */
export const groupIocsBy = (
  iocs: IocIndicator[],
  fields: Array<keyof IocIndicator>,
): Record<string, IocIndicator[]> => {
  const groups: Record<string, IocIndicator[]> = {};

  iocs.forEach(ioc => {
    const key = fields.map(field => String(ioc[field] || 'unknown')).join(':');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ioc);
  });

  return groups;
};

// ============================================================================
// IOC SEARCH AND FILTERING
// ============================================================================

/**
 * Performs advanced search on IOC indicators with pagination.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators to search
 * @param {IocSearchQuery} query - Search query parameters
 * @returns {IocSearchResult} Search results with pagination
 *
 * @example
 * ```typescript
 * const query: IocSearchQuery = {
 *   types: ['ip', 'domain'],
 *   confidenceLevels: ['high', 'critical'],
 *   tags: ['malware'],
 *   limit: 20,
 *   offset: 0
 * };
 * const results = searchIocs(allIocs, query);
 * ```
 */
export const searchIocs = (
  iocs: IocIndicator[],
  query: IocSearchQuery,
): IocSearchResult => {
  let filtered = [...iocs];

  // Filter by types
  if (query.types && query.types.length > 0) {
    filtered = filtered.filter(ioc => query.types!.includes(ioc.type));
  }

  // Filter by values (exact match or partial)
  if (query.values && query.values.length > 0) {
    filtered = filtered.filter(ioc =>
      query.values!.some(v => ioc.value.includes(v)),
    );
  }

  // Filter by confidence levels
  if (query.confidenceLevels && query.confidenceLevels.length > 0) {
    filtered = filtered.filter(ioc => query.confidenceLevels!.includes(ioc.confidence));
  }

  // Filter by severities
  if (query.severities && query.severities.length > 0) {
    filtered = filtered.filter(ioc => query.severities!.includes(ioc.severity));
  }

  // Filter by statuses
  if (query.statuses && query.statuses.length > 0) {
    filtered = filtered.filter(ioc => query.statuses!.includes(ioc.status));
  }

  // Filter by tags
  if (query.tags && query.tags.length > 0) {
    filtered = filtered.filter(ioc =>
      query.tags!.some(tag => ioc.tags?.includes(tag)),
    );
  }

  // Filter by sources
  if (query.sources && query.sources.length > 0) {
    filtered = filtered.filter(ioc =>
      ioc.source && query.sources!.includes(ioc.source),
    );
  }

  // Filter by date range
  if (query.dateFrom) {
    filtered = filtered.filter(ioc =>
      ioc.firstSeen && ioc.firstSeen >= query.dateFrom!,
    );
  }

  if (query.dateTo) {
    filtered = filtered.filter(ioc =>
      ioc.firstSeen && ioc.firstSeen <= query.dateTo!,
    );
  }

  // Text search
  if (query.searchText) {
    const searchLower = query.searchText.toLowerCase();
    filtered = filtered.filter(ioc =>
      ioc.value.toLowerCase().includes(searchLower) ||
      ioc.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      ioc.source?.toLowerCase().includes(searchLower),
    );
  }

  // Sorting
  if (query.sortBy) {
    const sortOrder = query.sortOrder || 'asc';
    filtered.sort((a, b) => {
      const aValue = a[query.sortBy!];
      const bValue = b[query.sortBy!];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const total = filtered.length;
  const limit = query.limit || 50;
  const offset = query.offset || 0;
  const page = Math.floor(offset / limit) + 1;

  // Pagination
  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    total,
    page,
    pageSize: limit,
    hasMore: offset + limit < total,
  };
};

/**
 * Applies advanced filter criteria to IOC collection.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {IocFilterCriteria[]} criteria - Filter criteria
 * @returns {IocIndicator[]} Filtered IOCs
 *
 * @example
 * ```typescript
 * const criteria: IocFilterCriteria[] = [
 *   { field: 'confidence', operator: 'in', value: ['high', 'critical'] },
 *   { field: 'value', operator: 'like', value: 'malware' }
 * ];
 * const filtered = filterIocs(iocs, criteria);
 * ```
 */
export const filterIocs = (
  iocs: IocIndicator[],
  criteria: IocFilterCriteria[],
): IocIndicator[] => {
  return iocs.filter(ioc => {
    return criteria.every(criterion => {
      const fieldValue = ioc[criterion.field as keyof IocIndicator];

      switch (criterion.operator) {
        case 'eq':
          return fieldValue === criterion.value;
        case 'ne':
          return fieldValue !== criterion.value;
        case 'gt':
          return fieldValue !== undefined && fieldValue > criterion.value;
        case 'gte':
          return fieldValue !== undefined && fieldValue >= criterion.value;
        case 'lt':
          return fieldValue !== undefined && fieldValue < criterion.value;
        case 'lte':
          return fieldValue !== undefined && fieldValue <= criterion.value;
        case 'in':
          return Array.isArray(criterion.value) && criterion.value.includes(fieldValue);
        case 'nin':
          return Array.isArray(criterion.value) && !criterion.value.includes(fieldValue);
        case 'like':
          return String(fieldValue).toLowerCase().includes(String(criterion.value).toLowerCase());
        case 'regex':
          return new RegExp(String(criterion.value)).test(String(fieldValue));
        default:
          return true;
      }
    });
  });
};

/**
 * Builds Sequelize query options from IOC search query.
 *
 * @param {IocSearchQuery} query - Search query parameters
 * @returns {SequelizeIocQueryOptions} Sequelize query options
 *
 * @example
 * ```typescript
 * const query: IocSearchQuery = { types: ['ip'], confidenceLevels: ['high'], limit: 20 };
 * const sequelizeOptions = buildSequelizeQuery(query);
 * // Use with: Model.findAll(sequelizeOptions)
 * ```
 */
export const buildSequelizeQuery = (query: IocSearchQuery): SequelizeIocQueryOptions => {
  const options: SequelizeIocQueryOptions = {
    where: {},
  };

  // Build WHERE clause
  if (query.types && query.types.length > 0) {
    options.where!.type = { $in: query.types };
  }

  if (query.confidenceLevels && query.confidenceLevels.length > 0) {
    options.where!.confidence = { $in: query.confidenceLevels };
  }

  if (query.severities && query.severities.length > 0) {
    options.where!.severity = { $in: query.severities };
  }

  if (query.statuses && query.statuses.length > 0) {
    options.where!.status = { $in: query.statuses };
  }

  if (query.sources && query.sources.length > 0) {
    options.where!.source = { $in: query.sources };
  }

  if (query.dateFrom || query.dateTo) {
    options.where!.firstSeen = {};
    if (query.dateFrom) {
      (options.where!.firstSeen as Record<string, unknown>).$gte = query.dateFrom;
    }
    if (query.dateTo) {
      (options.where!.firstSeen as Record<string, unknown>).$lte = query.dateTo;
    }
  }

  // Pagination
  if (query.limit) {
    options.limit = query.limit;
  }

  if (query.offset) {
    options.offset = query.offset;
  }

  // Sorting
  if (query.sortBy) {
    options.order = [[query.sortBy, query.sortOrder?.toUpperCase() as 'ASC' | 'DESC' || 'ASC']];
  }

  return options;
};

// ============================================================================
// IOC TAGGING AND CATEGORIZATION
// ============================================================================

/**
 * Adds tags to an IOC indicator.
 *
 * @param {IocIndicator} ioc - IOC indicator
 * @param {string[]} tags - Tags to add
 * @returns {IocIndicator} Updated IOC with new tags
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = { type: 'ip', value: '1.2.3.4', tags: ['malware'], ... };
 * const updated = addTags(ioc, ['c2', 'apt']);
 * // Result: tags = ['malware', 'c2', 'apt']
 * ```
 */
export const addTags = (ioc: IocIndicator, tags: string[]): IocIndicator => {
  const currentTags = ioc.tags || [];
  const uniqueTags = [...new Set([...currentTags, ...tags])];

  return {
    ...ioc,
    tags: uniqueTags,
  };
};

/**
 * Removes tags from an IOC indicator.
 *
 * @param {IocIndicator} ioc - IOC indicator
 * @param {string[]} tags - Tags to remove
 * @returns {IocIndicator} Updated IOC without specified tags
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = { type: 'ip', value: '1.2.3.4', tags: ['malware', 'c2'], ... };
 * const updated = removeTags(ioc, ['c2']);
 * // Result: tags = ['malware']
 * ```
 */
export const removeTags = (ioc: IocIndicator, tags: string[]): IocIndicator => {
  const currentTags = ioc.tags || [];
  const filteredTags = currentTags.filter(tag => !tags.includes(tag));

  return {
    ...ioc,
    tags: filteredTags,
  };
};

/**
 * Creates a hierarchical category structure for IOCs.
 *
 * @param {string} id - Category ID
 * @param {string} name - Category name
 * @param {string} [parentId] - Parent category ID
 * @param {string} [description] - Category description
 * @returns {IocCategory} IOC category
 *
 * @example
 * ```typescript
 * const malwareCategory = createCategory('cat-1', 'Malware', undefined, 'Malicious software indicators');
 * const ransomwareCategory = createCategory('cat-2', 'Ransomware', 'cat-1', 'Ransomware-specific IOCs');
 * ```
 */
export const createCategory = (
  id: string,
  name: string,
  parentId?: string,
  description?: string,
): IocCategory => {
  return {
    id,
    name,
    description,
    parentId,
    children: [],
    iocCount: 0,
  };
};

/**
 * Organizes IOCs into categories based on tags.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {Record<string, string[]>} categoryTagMapping - Mapping of category names to tags
 * @returns {Record<string, IocIndicator[]>} IOCs organized by category
 *
 * @example
 * ```typescript
 * const mapping = {
 *   'Malware': ['malware', 'trojan', 'virus'],
 *   'Phishing': ['phishing', 'credential-theft'],
 *   'C2': ['c2', 'command-control']
 * };
 * const categorized = categorizeIocs(iocs, mapping);
 * ```
 */
export const categorizeIocs = (
  iocs: IocIndicator[],
  categoryTagMapping: Record<string, string[]>,
): Record<string, IocIndicator[]> => {
  const categorized: Record<string, IocIndicator[]> = {};

  // Initialize categories
  Object.keys(categoryTagMapping).forEach(category => {
    categorized[category] = [];
  });

  // Categorize IOCs
  iocs.forEach(ioc => {
    const iocTags = ioc.tags || [];

    Object.entries(categoryTagMapping).forEach(([category, categoryTags]) => {
      const hasMatchingTag = iocTags.some(tag => categoryTags.includes(tag));
      if (hasMatchingTag) {
        categorized[category].push(ioc);
      }
    });
  });

  return categorized;
};

/**
 * Gets the most frequently used tags across IOCs.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {number} [limit] - Maximum number of tags to return
 * @returns {Array<{ tag: string; count: number }>} Top tags with counts
 *
 * @example
 * ```typescript
 * const topTags = getTopTags(iocs, 10);
 * // Result: [{ tag: 'malware', count: 150 }, { tag: 'c2', count: 75 }, ...]
 * ```
 */
export const getTopTags = (
  iocs: IocIndicator[],
  limit: number = 10,
): Array<{ tag: string; count: number }> => {
  const tagCounts: Record<string, number> = {};

  iocs.forEach(ioc => {
    (ioc.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// ============================================================================
// IOC EXPIRATION AND TTL MANAGEMENT
// ============================================================================

/**
 * Creates an IOC expiration policy with configurable TTLs.
 *
 * @param {number} defaultTtlDays - Default TTL in days
 * @param {boolean} [autoExpire] - Auto-expire IOCs (default: true)
 * @returns {IocExpirationPolicy} Expiration policy
 *
 * @example
 * ```typescript
 * const policy = createExpirationPolicy(30, true);
 * policy.typeSpecificTtl = { ip: 7, domain: 30, hash: 365 };
 * ```
 */
export const createExpirationPolicy = (
  defaultTtlDays: number,
  autoExpire: boolean = true,
): IocExpirationPolicy => {
  return {
    defaultTtlDays,
    autoExpire,
    typeSpecificTtl: {},
    confidenceBasedTtl: {},
    gracePeriodDays: 7,
  };
};

/**
 * Calculates expiration date based on policy and IOC characteristics.
 *
 * @param {IocIndicator} ioc - IOC indicator
 * @param {IocExpirationPolicy} policy - Expiration policy
 * @returns {Date} Calculated expiration date
 *
 * @example
 * ```typescript
 * const ioc: IocIndicator = { type: 'ip', confidence: 'high', ... };
 * const policy: IocExpirationPolicy = { defaultTtlDays: 30, ... };
 * const expiresAt = calculateTtl(ioc, policy);
 * ```
 */
export const calculateTtl = (
  ioc: IocIndicator,
  policy: IocExpirationPolicy,
): Date => {
  let ttlDays = policy.defaultTtlDays;

  // Check type-specific TTL
  if (policy.typeSpecificTtl && policy.typeSpecificTtl[ioc.type]) {
    ttlDays = policy.typeSpecificTtl[ioc.type]!;
  }

  // Check confidence-based TTL (overrides type-specific)
  if (policy.confidenceBasedTtl && policy.confidenceBasedTtl[ioc.confidence]) {
    ttlDays = policy.confidenceBasedTtl[ioc.confidence]!;
  }

  const baseDate = ioc.firstSeen || new Date();
  const expirationDate = new Date(baseDate);
  expirationDate.setDate(expirationDate.getDate() + ttlDays);

  return expirationDate;
};

/**
 * Identifies expired IOCs based on current date.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @returns {IocIndicator[]} Expired IOCs
 *
 * @example
 * ```typescript
 * const expired = findExpiredIocs(allIocs);
 * // Process expired IOCs for archival or deletion
 * ```
 */
export const findExpiredIocs = (iocs: IocIndicator[]): IocIndicator[] => {
  const now = new Date();
  return iocs.filter(ioc => ioc.expiresAt && ioc.expiresAt < now);
};

/**
 * Extends TTL for IOCs by specified number of days.
 *
 * @param {IocIndicator} ioc - IOC indicator
 * @param {number} extensionDays - Number of days to extend
 * @returns {IocIndicator} Updated IOC with extended expiration
 *
 * @example
 * ```typescript
 * const extended = extendTtl(ioc, 30); // Extend by 30 days
 * ```
 */
export const extendTtl = (ioc: IocIndicator, extensionDays: number): IocIndicator => {
  const currentExpiration = ioc.expiresAt || new Date();
  const newExpiration = new Date(currentExpiration);
  newExpiration.setDate(newExpiration.getDate() + extensionDays);

  return {
    ...ioc,
    expiresAt: newExpiration,
  };
};

/**
 * Auto-expires IOCs based on policy and updates their status.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {IocExpirationPolicy} policy - Expiration policy
 * @returns {IocIndicator[]} Updated IOCs with expired status
 *
 * @example
 * ```typescript
 * const policy: IocExpirationPolicy = { defaultTtlDays: 30, autoExpire: true, ... };
 * const updated = autoExpireIocs(iocs, policy);
 * ```
 */
export const autoExpireIocs = (
  iocs: IocIndicator[],
  policy: IocExpirationPolicy,
): IocIndicator[] => {
  if (!policy.autoExpire) {
    return iocs;
  }

  const now = new Date();
  const gracePeriodMs = (policy.gracePeriodDays || 0) * 24 * 60 * 60 * 1000;

  return iocs.map(ioc => {
    if (!ioc.expiresAt) {
      return ioc;
    }

    const expirationTime = ioc.expiresAt.getTime();
    const currentTime = now.getTime();

    // Check if past grace period
    if (currentTime > expirationTime + gracePeriodMs && ioc.status === 'active') {
      return {
        ...ioc,
        status: 'expired' as IocStatus,
      };
    }

    return ioc;
  });
};

// ============================================================================
// IOC RELATIONSHIP MAPPING
// ============================================================================

/**
 * Creates a relationship between two IOCs.
 *
 * @param {string} sourceIocId - Source IOC ID
 * @param {string} targetIocId - Target IOC ID
 * @param {IocRelationshipType} type - Relationship type
 * @param {number} [confidence] - Relationship confidence (0-1)
 * @returns {IocRelationship} IOC relationship
 *
 * @example
 * ```typescript
 * const relationship = createRelationship('ioc-1', 'ioc-2', 'resolves-to', 0.9);
 * ```
 */
export const createRelationship = (
  sourceIocId: string,
  targetIocId: string,
  type: IocRelationshipType,
  confidence: number = 0.8,
): IocRelationship => {
  return {
    sourceIocId,
    targetIocId,
    relationshipType: type,
    confidence,
    firstObserved: new Date(),
    lastObserved: new Date(),
  };
};

/**
 * Builds a relationship graph from IOCs and their relationships.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {IocRelationship[]} relationships - Array of relationships
 * @returns {Map<string, IocGraphNode>} Relationship graph
 *
 * @example
 * ```typescript
 * const graph = buildRelationshipGraph(iocs, relationships);
 * const nodeData = graph.get('ioc-123');
 * ```
 */
export const buildRelationshipGraph = (
  iocs: IocIndicator[],
  relationships: IocRelationship[],
): Map<string, IocGraphNode> => {
  const graph = new Map<string, IocGraphNode>();
  const iocMap = new Map(iocs.map(ioc => [ioc.id!, ioc]));

  // Initialize nodes
  iocs.forEach(ioc => {
    if (ioc.id) {
      graph.set(ioc.id, {
        ioc,
        relationships: [],
      });
    }
  });

  // Add relationships
  relationships.forEach(rel => {
    const sourceNode = graph.get(rel.sourceIocId);
    const targetIoc = iocMap.get(rel.targetIocId);

    if (sourceNode && targetIoc) {
      sourceNode.relationships.push({
        target: targetIoc,
        type: rel.relationshipType,
        confidence: rel.confidence,
      });
    }
  });

  return graph;
};

/**
 * Finds all related IOCs for a given IOC (direct and indirect).
 *
 * @param {string} iocId - IOC ID to find relationships for
 * @param {Map<string, IocGraphNode>} graph - Relationship graph
 * @param {number} [maxDepth] - Maximum relationship depth (default: 2)
 * @returns {IocIndicator[]} Related IOCs
 *
 * @example
 * ```typescript
 * const graph = buildRelationshipGraph(iocs, relationships);
 * const related = findRelatedIocs('ioc-123', graph, 3);
 * ```
 */
export const findRelatedIocs = (
  iocId: string,
  graph: Map<string, IocGraphNode>,
  maxDepth: number = 2,
): IocIndicator[] => {
  const visited = new Set<string>();
  const related: IocIndicator[] = [];

  const traverse = (currentId: string, depth: number) => {
    if (depth > maxDepth || visited.has(currentId)) {
      return;
    }

    visited.add(currentId);
    const node = graph.get(currentId);

    if (!node) {
      return;
    }

    node.relationships.forEach(rel => {
      if (rel.target.id && !visited.has(rel.target.id)) {
        related.push(rel.target);
        traverse(rel.target.id, depth + 1);
      }
    });
  };

  traverse(iocId, 0);
  return related;
};

/**
 * Identifies IOC clusters based on relationship density.
 *
 * @param {Map<string, IocGraphNode>} graph - Relationship graph
 * @param {number} [minClusterSize] - Minimum cluster size (default: 3)
 * @returns {IocIndicator[][]} Array of IOC clusters
 *
 * @example
 * ```typescript
 * const graph = buildRelationshipGraph(iocs, relationships);
 * const clusters = identifyClusters(graph, 5);
 * // Each cluster represents a group of highly connected IOCs
 * ```
 */
export const identifyClusters = (
  graph: Map<string, IocGraphNode>,
  minClusterSize: number = 3,
): IocIndicator[][] => {
  const visited = new Set<string>();
  const clusters: IocIndicator[][] = [];

  graph.forEach((node, iocId) => {
    if (visited.has(iocId)) {
      return;
    }

    const cluster: IocIndicator[] = [];
    const toVisit = [iocId];

    while (toVisit.length > 0) {
      const currentId = toVisit.pop()!;

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      const currentNode = graph.get(currentId);

      if (currentNode) {
        cluster.push(currentNode.ioc);

        currentNode.relationships.forEach(rel => {
          if (rel.target.id && !visited.has(rel.target.id)) {
            toVisit.push(rel.target.id);
          }
        });
      }
    }

    if (cluster.length >= minClusterSize) {
      clusters.push(cluster);
    }
  });

  return clusters;
};

// ============================================================================
// IOC IMPORT/EXPORT FUNCTIONS
// ============================================================================

/**
 * Imports IOCs from JSON format.
 *
 * @param {string} jsonData - JSON string containing IOCs
 * @returns {IocImportResult} Import result with statistics
 * @throws {Error} If JSON is invalid
 *
 * @example
 * ```typescript
 * const jsonData = JSON.stringify([{ type: 'ip', value: '1.2.3.4', ... }, ...]);
 * const result = importFromJson(jsonData);
 * ```
 */
export const importFromJson = (jsonData: string): IocImportResult => {
  const result: IocImportResult = {
    successful: 0,
    failed: 0,
    duplicates: 0,
    errors: [],
    imported: [],
  };

  try {
    const data = JSON.parse(jsonData);
    const iocs = Array.isArray(data) ? data : [data];

    iocs.forEach((iocData, index) => {
      try {
        if (!iocData.type || !iocData.value) {
          result.failed++;
          result.errors.push({
            line: index + 1,
            value: JSON.stringify(iocData),
            error: 'Missing required fields: type and value',
          });
          return;
        }

        const ioc: IocIndicator = {
          type: iocData.type,
          value: iocData.value,
          confidence: iocData.confidence || 'medium',
          severity: iocData.severity || 'medium',
          status: iocData.status || 'active',
          firstSeen: iocData.firstSeen ? new Date(iocData.firstSeen) : new Date(),
          lastSeen: iocData.lastSeen ? new Date(iocData.lastSeen) : undefined,
          expiresAt: iocData.expiresAt ? new Date(iocData.expiresAt) : undefined,
          source: iocData.source,
          tags: iocData.tags || [],
          metadata: iocData.metadata || {},
        };

        result.imported.push(ioc);
        result.successful++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          line: index + 1,
          value: JSON.stringify(iocData),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'parse error'}`);
  }

  return result;
};

/**
 * Imports IOCs from CSV format.
 *
 * @param {string} csvData - CSV string containing IOCs
 * @returns {IocImportResult} Import result with statistics
 *
 * @example
 * ```typescript
 * const csvData = 'type,value,confidence,severity\nip,1.2.3.4,high,critical\ndomain,malware.com,medium,high';
 * const result = importFromCsv(csvData);
 * ```
 */
export const importFromCsv = (csvData: string): IocImportResult => {
  const result: IocImportResult = {
    successful: 0,
    failed: 0,
    duplicates: 0,
    errors: [],
    imported: [],
  };

  const lines = csvData.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const typeIndex = headers.indexOf('type');
  const valueIndex = headers.indexOf('value');

  if (typeIndex === -1 || valueIndex === -1) {
    throw new Error('CSV must contain "type" and "value" columns');
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());

    try {
      if (values.length !== headers.length) {
        result.failed++;
        result.errors.push({
          line: i + 1,
          value: lines[i],
          error: 'Column count mismatch',
        });
        continue;
      }

      const ioc: IocIndicator = {
        type: values[typeIndex] as IocType,
        value: values[valueIndex],
        confidence: (values[headers.indexOf('confidence')] as ConfidenceLevel) || 'medium',
        severity: (values[headers.indexOf('severity')] as ThreatSeverity) || 'medium',
        status: (values[headers.indexOf('status')] as IocStatus) || 'active',
        source: values[headers.indexOf('source')],
        tags: values[headers.indexOf('tags')]?.split(';').filter(t => t) || [],
      };

      result.imported.push(ioc);
      result.successful++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        line: i + 1,
        value: lines[i],
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return result;
};

/**
 * Exports IOCs to specified format.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators to export
 * @param {IocExportOptions} options - Export options
 * @returns {string} Exported data in specified format
 *
 * @example
 * ```typescript
 * const options: IocExportOptions = {
 *   format: 'json',
 *   includeMetadata: true,
 *   filters: { types: ['ip', 'domain'] }
 * };
 * const exported = exportIocs(iocs, options);
 * ```
 */
export const exportIocs = (
  iocs: IocIndicator[],
  options: IocExportOptions,
): string => {
  let filtered = [...iocs];

  // Apply filters
  if (!options.includeExpired) {
    filtered = filtered.filter(ioc => ioc.status !== 'expired');
  }

  if (!options.includeInactive) {
    filtered = filtered.filter(ioc => ioc.status !== 'inactive');
  }

  if (!options.includeFalsePositives) {
    filtered = filtered.filter(ioc => ioc.status !== 'false-positive');
  }

  // Apply search filters if provided
  if (options.filters) {
    const searchResult = searchIocs(filtered, { ...options.filters, limit: undefined, offset: undefined });
    filtered = searchResult.items;
  }

  // Format based on export format
  switch (options.format) {
    case 'json':
      return JSON.stringify(filtered, null, 2);

    case 'csv':
      const headers = ['type', 'value', 'confidence', 'severity', 'status', 'source', 'tags'];
      const csvLines = [headers.join(',')];

      filtered.forEach(ioc => {
        const row = [
          ioc.type,
          ioc.value,
          ioc.confidence,
          ioc.severity,
          ioc.status,
          ioc.source || '',
          (ioc.tags || []).join(';'),
        ];
        csvLines.push(row.join(','));
      });

      return csvLines.join('\n');

    case 'stix':
      // Simplified STIX export - would use convertToStix from threat-indicators-kit
      return JSON.stringify({ indicators: filtered }, null, 2);

    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

// ============================================================================
// IOC BULK OPERATIONS
// ============================================================================

/**
 * Performs bulk operation on multiple IOCs.
 *
 * @param {IocBulkOperationRequest} request - Bulk operation request
 * @param {IocIndicator[]} iocs - Array of all IOC indicators
 * @returns {Promise<IocBulkOperationResult>} Operation result
 *
 * @example
 * ```typescript
 * const request: IocBulkOperationRequest = {
 *   operation: 'add-tags',
 *   iocIds: ['ioc-1', 'ioc-2'],
 *   parameters: { tags: ['high-priority', 'reviewed'] }
 * };
 * const result = await bulkOperation(request, allIocs);
 * ```
 */
export const bulkOperation = async (
  request: IocBulkOperationRequest,
  iocs: IocIndicator[],
): Promise<IocBulkOperationResult> => {
  const result: IocBulkOperationResult = {
    operation: request.operation,
    successful: 0,
    failed: 0,
    errors: [],
  };

  // Get target IOCs
  let targetIocs: IocIndicator[] = [];
  if (request.iocIds && request.iocIds.length > 0) {
    targetIocs = iocs.filter(ioc => request.iocIds!.includes(ioc.id!));
  } else if (request.filters) {
    const searchResult = searchIocs(iocs, { ...request.filters, limit: undefined, offset: undefined });
    targetIocs = searchResult.items;
  }

  // Perform operation
  for (const ioc of targetIocs) {
    try {
      switch (request.operation) {
        case 'activate':
          ioc.status = 'active';
          break;

        case 'deactivate':
          ioc.status = 'inactive';
          break;

        case 'expire':
          ioc.status = 'expired';
          break;

        case 'update-confidence':
          if (request.parameters?.confidence) {
            ioc.confidence = request.parameters.confidence as ConfidenceLevel;
          }
          break;

        case 'update-severity':
          if (request.parameters?.severity) {
            ioc.severity = request.parameters.severity as ThreatSeverity;
          }
          break;

        case 'add-tags':
          if (request.parameters?.tags && Array.isArray(request.parameters.tags)) {
            const currentTags = ioc.tags || [];
            ioc.tags = [...new Set([...currentTags, ...request.parameters.tags])];
          }
          break;

        case 'remove-tags':
          if (request.parameters?.tags && Array.isArray(request.parameters.tags)) {
            const currentTags = ioc.tags || [];
            ioc.tags = currentTags.filter(tag => !request.parameters!.tags.includes(tag));
          }
          break;

        case 'extend-ttl':
          if (request.parameters?.days && ioc.expiresAt) {
            const days = Number(request.parameters.days);
            const newExpiration = new Date(ioc.expiresAt);
            newExpiration.setDate(newExpiration.getDate() + days);
            ioc.expiresAt = newExpiration;
          }
          break;
      }

      result.successful++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        iocId: ioc.id || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return result;
};

/**
 * Validates bulk operation request before execution.
 *
 * @param {IocBulkOperationRequest} request - Bulk operation request
 * @returns {boolean} True if request is valid
 * @throws {Error} If request is invalid
 *
 * @example
 * ```typescript
 * const request: IocBulkOperationRequest = { operation: 'add-tags', iocIds: ['ioc-1'], parameters: { tags: ['test'] } };
 * const isValid = validateBulkOperation(request); // true
 * ```
 */
export const validateBulkOperation = (request: IocBulkOperationRequest): boolean => {
  if (!request.operation) {
    throw new Error('Operation is required');
  }

  if (!request.iocIds && !request.filters) {
    throw new Error('Either iocIds or filters must be provided');
  }

  // Validate operation-specific parameters
  switch (request.operation) {
    case 'update-confidence':
      if (!request.parameters?.confidence) {
        throw new Error('Confidence level is required for update-confidence operation');
      }
      break;

    case 'update-severity':
      if (!request.parameters?.severity) {
        throw new Error('Severity level is required for update-severity operation');
      }
      break;

    case 'add-tags':
    case 'remove-tags':
      if (!request.parameters?.tags || !Array.isArray(request.parameters.tags)) {
        throw new Error('Tags array is required for tag operations');
      }
      break;

    case 'extend-ttl':
      if (!request.parameters?.days || Number(request.parameters.days) <= 0) {
        throw new Error('Valid number of days is required for extend-ttl operation');
      }
      break;
  }

  return true;
};

// ============================================================================
// IOC ANALYTICS AND STATISTICS
// ============================================================================

/**
 * Generates comprehensive analytics summary for IOC collection.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @returns {IocAnalyticsSummary} Analytics summary
 *
 * @example
 * ```typescript
 * const summary = generateAnalyticsSummary(allIocs);
 * console.log(`Total IOCs: ${summary.totalIocs}, Active: ${summary.activeIocs}`);
 * ```
 */
export const generateAnalyticsSummary = (iocs: IocIndicator[]): IocAnalyticsSummary => {
  const summary: IocAnalyticsSummary = {
    totalIocs: iocs.length,
    activeIocs: iocs.filter(ioc => ioc.status === 'active').length,
    expiredIocs: iocs.filter(ioc => ioc.status === 'expired').length,
    byType: {} as Record<IocType, number>,
    byConfidence: {} as Record<ConfidenceLevel, number>,
    bySeverity: {} as Record<ThreatSeverity, number>,
    bySource: {},
    topTags: [],
    recentActivity: [],
  };

  // Aggregate by type
  iocs.forEach(ioc => {
    summary.byType[ioc.type] = (summary.byType[ioc.type] || 0) + 1;
    summary.byConfidence[ioc.confidence] = (summary.byConfidence[ioc.confidence] || 0) + 1;
    summary.bySeverity[ioc.severity] = (summary.bySeverity[ioc.severity] || 0) + 1;

    if (ioc.source) {
      summary.bySource[ioc.source] = (summary.bySource[ioc.source] || 0) + 1;
    }
  });

  // Top tags
  summary.topTags = getTopTags(iocs, 10);

  return summary;
};

/**
 * Generates time series data for IOC trends.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {'hour' | 'day' | 'week' | 'month'} interval - Time interval
 * @param {number} [periods] - Number of periods (default: 30)
 * @returns {IocTimeSeries} Time series data
 *
 * @example
 * ```typescript
 * const timeSeries = generateTimeSeries(iocs, 'day', 30);
 * // Shows daily IOC counts for last 30 days
 * ```
 */
export const generateTimeSeries = (
  iocs: IocIndicator[],
  interval: 'hour' | 'day' | 'week' | 'month',
  periods: number = 30,
): IocTimeSeries => {
  const timeSeries: IocTimeSeries = {
    interval,
    dataPoints: [],
  };

  const now = new Date();
  const intervalMs: Record<typeof interval, number> = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };

  const bucketSize = intervalMs[interval];

  for (let i = periods - 1; i >= 0; i--) {
    const bucketStart = new Date(now.getTime() - (i + 1) * bucketSize);
    const bucketEnd = new Date(now.getTime() - i * bucketSize);

    const iocsInBucket = iocs.filter(ioc => {
      const date = ioc.firstSeen || ioc.lastSeen;
      return date && date >= bucketStart && date < bucketEnd;
    });

    timeSeries.dataPoints.push({
      timestamp: bucketStart,
      count: iocsInBucket.length,
      breakdown: aggregateIocs(iocsInBucket, 'type'),
    });
  }

  return timeSeries;
};

/**
 * Calculates IOC diversity score (variety of IOC types and sources).
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @returns {number} Diversity score (0-1)
 *
 * @example
 * ```typescript
 * const diversity = calculateDiversityScore(iocs);
 * // Higher score indicates more diverse IOC collection
 * ```
 */
export const calculateDiversityScore = (iocs: IocIndicator[]): number => {
  if (iocs.length === 0) return 0;

  const uniqueTypes = new Set(iocs.map(ioc => ioc.type)).size;
  const uniqueSources = new Set(iocs.map(ioc => ioc.source).filter(Boolean)).size;

  const maxTypes = 10; // Maximum possible IOC types
  const maxSources = 10; // Reasonable max for normalization

  const typeScore = uniqueTypes / maxTypes;
  const sourceScore = Math.min(uniqueSources / maxSources, 1);

  return (typeScore + sourceScore) / 2;
};

/**
 * Identifies trending IOCs based on observation frequency.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators
 * @param {number} [daysWindow] - Time window in days (default: 7)
 * @param {number} [limit] - Maximum number of trends (default: 10)
 * @returns {IocIndicator[]} Trending IOCs
 *
 * @example
 * ```typescript
 * const trending = getTrendingIocs(iocs, 7, 10);
 * // Returns top 10 IOCs observed most frequently in last 7 days
 * ```
 */
export const getTrendingIocs = (
  iocs: IocIndicator[],
  daysWindow: number = 7,
  limit: number = 10,
): IocIndicator[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysWindow);

  const recent = iocs.filter(ioc =>
    ioc.lastSeen && ioc.lastSeen >= cutoffDate,
  );

  // Sort by observation frequency (using metadata if available)
  return recent
    .sort((a, b) => {
      const aCount = (a.metadata?.observationCount as number) || 1;
      const bCount = (b.metadata?.observationCount as number) || 1;
      return bCount - aCount;
    })
    .slice(0, limit);
};

// ============================================================================
// NESTJS CONTROLLER HELPERS
// ============================================================================

/**
 * Transforms IOC indicator to response DTO for API.
 *
 * @param {IocIndicator} ioc - IOC indicator
 * @param {IocRelationship[]} [relationships] - Related relationships
 * @returns {IocResponseDto} Response DTO
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async getIoc(@Param('id') id: string): Promise<IocResponseDto> {
 *   const ioc = await this.iocService.findById(id);
 *   const relationships = await this.iocService.getRelationships(id);
 *   return toResponseDto(ioc, relationships);
 * }
 * ```
 */
export const toResponseDto = (
  ioc: IocIndicator,
  relationships?: IocRelationship[],
): IocResponseDto => {
  return {
    ...ioc,
    relationships,
  };
};

/**
 * Validates create IOC DTO from NestJS controller.
 *
 * @param {CreateIocDto} dto - Create IOC DTO
 * @returns {boolean} True if valid
 * @throws {Error} If DTO is invalid
 *
 * @example
 * ```typescript
 * @Post()
 * async createIoc(@Body() dto: CreateIocDto): Promise<IocResponseDto> {
 *   validateCreateDto(dto);
 *   const ioc = await this.iocService.create(dto);
 *   return toResponseDto(ioc);
 * }
 * ```
 */
export const validateCreateDto = (dto: CreateIocDto): boolean => {
  if (!dto.type || !dto.value) {
    throw new Error('Type and value are required');
  }

  const validTypes: IocType[] = ['ip', 'domain', 'hash', 'url', 'email', 'file', 'registry', 'mutex', 'user-agent', 'certificate'];
  if (!validTypes.includes(dto.type)) {
    throw new Error(`Invalid IOC type: ${dto.type}`);
  }

  return true;
};

/**
 * Validates update IOC DTO from NestJS controller.
 *
 * @param {UpdateIocDto} dto - Update IOC DTO
 * @returns {boolean} True if valid
 * @throws {Error} If DTO is invalid
 *
 * @example
 * ```typescript
 * @Patch(':id')
 * async updateIoc(@Param('id') id: string, @Body() dto: UpdateIocDto): Promise<IocResponseDto> {
 *   validateUpdateDto(dto);
 *   const ioc = await this.iocService.update(id, dto);
 *   return toResponseDto(ioc);
 * }
 * ```
 */
export const validateUpdateDto = (dto: UpdateIocDto): boolean => {
  if (Object.keys(dto).length === 0) {
    throw new Error('At least one field must be provided for update');
  }

  if (dto.confidence) {
    const validConfidence: ConfidenceLevel[] = ['low', 'medium', 'high', 'critical'];
    if (!validConfidence.includes(dto.confidence)) {
      throw new Error(`Invalid confidence level: ${dto.confidence}`);
    }
  }

  if (dto.severity) {
    const validSeverity: ThreatSeverity[] = ['informational', 'low', 'medium', 'high', 'critical'];
    if (!validSeverity.includes(dto.severity)) {
      throw new Error(`Invalid severity level: ${dto.severity}`);
    }
  }

  return true;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Collection & Aggregation
  collectIocs,
  aggregateIocs,
  groupIocsBy,

  // Search & Filtering
  searchIocs,
  filterIocs,
  buildSequelizeQuery,

  // Tagging & Categorization
  addTags,
  removeTags,
  createCategory,
  categorizeIocs,
  getTopTags,

  // Expiration & TTL
  createExpirationPolicy,
  calculateTtl,
  findExpiredIocs,
  extendTtl,
  autoExpireIocs,

  // Relationship Mapping
  createRelationship,
  buildRelationshipGraph,
  findRelatedIocs,
  identifyClusters,

  // Import/Export
  importFromJson,
  importFromCsv,
  exportIocs,

  // Bulk Operations
  bulkOperation,
  validateBulkOperation,

  // Analytics & Statistics
  generateAnalyticsSummary,
  generateTimeSeries,
  calculateDiversityScore,
  getTrendingIocs,

  // NestJS Helpers
  toResponseDto,
  validateCreateDto,
  validateUpdateDto,
};
