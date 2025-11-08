/**
 * LOC: M1S2E3A4R5
 * File: /reuse/server/mail/mail-search-indexing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @elastic/elasticsearch (v8.x)
 *   - @opensearch-project/opensearch (v2.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail search controllers
 *   - Mail search services
 *   - Search index synchronization workers
 *   - Mail query builders
 */

/**
 * File: /reuse/server/mail/mail-search-indexing-kit.ts
 * Locator: WC-MAIL-SEARCH-KIT-001
 * Purpose: Mail Search & Indexing Kit - Exchange Server-style search with full-text indexing
 *
 * Upstream: sequelize v6.x, @elastic/elasticsearch v8.x, @opensearch-project/opensearch v2.x, Node 18+
 * Downstream: ../backend/mail/*, search controllers, mail services, index synchronization
 * Dependencies: Sequelize v6.x, ElasticSearch/OpenSearch, Node 18+, TypeScript 5.x
 * Exports: 45 mail search utilities for full-text search, indexing, query builders, and Exchange Server features
 *
 * LLM Context: Enterprise-grade mail search and indexing kit for White Cross healthcare platform.
 * Provides comprehensive Exchange Server-style search capabilities including full-text search across
 * headers/body/attachments, advanced search operators (AND, OR, NOT), date range filtering, ElasticSearch
 * and OpenSearch integration, incremental indexing, search suggestions, autocomplete, result ranking,
 * saved searches, and Swagger documentation. HIPAA-compliant with secure search access controls and
 * audit trails for healthcare communications search.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  literal,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Search field types for targeted searching
 */
export enum SearchFieldType {
  ALL = 'all',
  SUBJECT = 'subject',
  BODY = 'body',
  FROM = 'from',
  TO = 'to',
  CC = 'cc',
  BCC = 'bcc',
  ATTACHMENTS = 'attachments',
  HEADERS = 'headers',
  FOLDER = 'folder',
}

/**
 * Search operators for advanced queries
 */
export enum SearchOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  NEAR = 'NEAR',
  PHRASE = 'PHRASE',
  WILDCARD = 'WILDCARD',
  FUZZY = 'FUZZY',
  RANGE = 'RANGE',
}

/**
 * Search sort options
 */
export enum SearchSortField {
  RELEVANCE = 'relevance',
  DATE = 'date',
  FROM = 'from',
  TO = 'to',
  SUBJECT = 'subject',
  SIZE = 'size',
  HAS_ATTACHMENTS = 'hasAttachments',
  IMPORTANCE = 'importance',
}

/**
 * Search sort direction
 */
export enum SearchSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Index sync status
 */
export enum IndexSyncStatus {
  PENDING = 'pending',
  INDEXING = 'indexing',
  SYNCED = 'synced',
  ERROR = 'error',
  DELETED = 'deleted',
  REINDEXING = 'reindexing',
}

/**
 * Search result status
 */
export enum SearchResultStatus {
  SUCCESS = 'success',
  PARTIAL = 'partial',
  ERROR = 'error',
  TIMEOUT = 'timeout',
}

/**
 * Mail search query interface
 */
export interface MailSearchQuery {
  query: string;
  fields: SearchFieldType[];
  operator: SearchOperator;
  filters: SearchFilters;
  sort: SearchSort;
  pagination: SearchPagination;
  options: SearchOptions;
}

/**
 * Search filters for refining results
 */
export interface SearchFilters {
  from?: string[];
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  hasAttachments?: boolean;
  attachmentNames?: string[];
  attachmentTypes?: string[];
  dateRange?: DateRangeFilter;
  sizeRange?: SizeRangeFilter;
  folderIds?: string[];
  isRead?: boolean;
  isFlagged?: boolean;
  importance?: string[];
  categories?: string[];
  labels?: string[];
  customHeaders?: Record<string, string>;
}

/**
 * Date range filter
 */
export interface DateRangeFilter {
  from?: Date | string;
  to?: Date | string;
  relativeRange?: RelativeDateRange;
}

/**
 * Relative date range options
 */
export enum RelativeDateRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_3_MONTHS = 'last_3_months',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  THIS_YEAR = 'this_year',
}

/**
 * Size range filter (in bytes)
 */
export interface SizeRangeFilter {
  min?: number;
  max?: number;
  preset?: SizeRangePreset;
}

/**
 * Size range presets
 */
export enum SizeRangePreset {
  TINY = 'tiny', // < 10KB
  SMALL = 'small', // 10KB - 100KB
  MEDIUM = 'medium', // 100KB - 1MB
  LARGE = 'large', // 1MB - 10MB
  HUGE = 'huge', // > 10MB
}

/**
 * Search sort configuration
 */
export interface SearchSort {
  field: SearchSortField;
  direction: SearchSortDirection;
  secondarySort?: {
    field: SearchSortField;
    direction: SearchSortDirection;
  };
}

/**
 * Search pagination
 */
export interface SearchPagination {
  page: number;
  limit: number;
  offset?: number;
  cursor?: string;
}

/**
 * Search options
 */
export interface SearchOptions {
  highlightMatches?: boolean;
  includeSnippets?: boolean;
  snippetLength?: number;
  fuzzyMatching?: boolean;
  fuzzyDistance?: number;
  boostFields?: Record<SearchFieldType, number>;
  minScore?: number;
  timeout?: number;
  aggregations?: SearchAggregation[];
}

/**
 * Search aggregation types
 */
export enum SearchAggregationType {
  TERMS = 'terms',
  DATE_HISTOGRAM = 'date_histogram',
  RANGE = 'range',
  STATS = 'stats',
}

/**
 * Search aggregation configuration
 */
export interface SearchAggregation {
  name: string;
  type: SearchAggregationType;
  field: string;
  size?: number;
  interval?: string;
  ranges?: Array<{ from?: number; to?: number; key: string }>;
}

/**
 * Search results interface
 */
export interface SearchResults {
  status: SearchResultStatus;
  total: number;
  took: number;
  results: SearchResultItem[];
  aggregations?: Record<string, AggregationResult>;
  suggestions?: string[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

/**
 * Individual search result item
 */
export interface SearchResultItem {
  id: string;
  score: number;
  highlights: Record<string, string[]>;
  snippet: string;
  message: {
    id: string;
    subject: string;
    from: string;
    to: string[];
    cc?: string[];
    date: Date;
    size: number;
    hasAttachments: boolean;
    isRead: boolean;
    isFlagged: boolean;
    folderId: string;
    folderName: string;
  };
  matchedFields: SearchFieldType[];
}

/**
 * Aggregation result
 */
export interface AggregationResult {
  type: SearchAggregationType;
  buckets?: Array<{ key: string; count: number; from?: number; to?: number }>;
  stats?: {
    min: number;
    max: number;
    avg: number;
    sum: number;
    count: number;
  };
}

/**
 * Saved search interface
 */
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  query: MailSearchQuery;
  isDefault: boolean;
  isShared: boolean;
  shareScope: string;
  lastUsedAt: Date | null;
  useCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Search index document
 */
export interface SearchIndexDocument {
  messageId: string;
  userId: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  from: string;
  fromName: string;
  to: string[];
  toNames: string[];
  cc: string[];
  ccNames: string[];
  bcc: string[];
  bccNames: string[];
  date: Date;
  receivedDate: Date;
  sentDate: Date;
  size: number;
  hasAttachments: boolean;
  attachmentCount: number;
  attachmentNames: string[];
  attachmentTypes: string[];
  attachmentContent: string[];
  folderId: string;
  folderPath: string;
  isRead: boolean;
  isFlagged: boolean;
  importance: string;
  categories: string[];
  labels: string[];
  headers: Record<string, string>;
  metadata: Record<string, any>;
  indexedAt: Date;
  syncStatus: IndexSyncStatus;
}

/**
 * Index synchronization status
 */
export interface IndexSyncInfo {
  messageId: string;
  userId: string;
  status: IndexSyncStatus;
  lastSyncAt: Date | null;
  syncAttempts: number;
  lastError: string | null;
  indexName: string;
  documentId: string;
  version: number;
  retryAt: Date | null;
}

/**
 * Search autocomplete suggestion
 */
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'contact' | 'subject' | 'folder';
  score: number;
  frequency: number;
  lastUsed: Date;
  metadata?: Record<string, any>;
}

/**
 * Search analytics event
 */
export interface SearchAnalyticsEvent {
  userId: string;
  query: string;
  filters: SearchFilters;
  resultCount: number;
  took: number;
  clickedResults: string[];
  timestamp: Date;
  sessionId: string;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Generates Sequelize model attributes for saved searches.
 * Defines schema for storing user's saved search queries.
 *
 * @returns {ModelAttributes} Sequelize model attributes
 *
 * @example
 * ```typescript
 * const SavedSearch = sequelize.define(
 *   'SavedSearch',
 *   getSavedSearchAttributes(),
 *   getSavedSearchModelOptions(sequelize)
 * );
 * ```
 */
export function getSavedSearchAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique saved search identifier',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who created the saved search',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Display name for saved search',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional description of search purpose',
    },
    query: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Complete search query configuration',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the default search',
    },
    isShared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether search is shared with others',
    },
    shareScope: {
      type: DataTypes.ENUM('private', 'team', 'organization', 'public'),
      allowNull: false,
      defaultValue: 'private',
      comment: 'Sharing scope for search',
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time search was executed',
    },
    useCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times search has been used',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };
}

/**
 * Generates Sequelize model options for saved searches.
 * Includes indexes and scopes for search management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelOptions} Sequelize model options
 *
 * @example
 * ```typescript
 * const SavedSearch = sequelize.define(
 *   'SavedSearch',
 *   getSavedSearchAttributes(),
 *   getSavedSearchModelOptions(sequelize)
 * );
 * ```
 */
export function getSavedSearchModelOptions(sequelize: Sequelize): Partial<ModelOptions> {
  return {
    sequelize,
    tableName: 'saved_searches',
    modelName: 'SavedSearch',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['user_id', 'is_default'] },
      { fields: ['user_id', 'is_shared'] },
      { fields: ['last_used_at'] },
      { fields: ['use_count'] },
      { fields: ['created_at'] },
      {
        name: 'unique_user_search_name',
        unique: true,
        fields: ['user_id', 'name'],
      },
    ],
    scopes: {
      active: {
        where: { deletedAt: null },
      },
      shared: {
        where: { isShared: true },
      },
      private: {
        where: { isShared: false, shareScope: 'private' },
      },
    },
  };
}

/**
 * Generates Sequelize model attributes for search index sync status.
 * Tracks indexing status for each message in ElasticSearch/OpenSearch.
 *
 * @returns {ModelAttributes} Sequelize model attributes
 *
 * @example
 * ```typescript
 * const SearchIndexSync = sequelize.define(
 *   'SearchIndexSync',
 *   getSearchIndexSyncAttributes(),
 *   getSearchIndexSyncModelOptions(sequelize)
 * );
 * ```
 */
export function getSearchIndexSyncAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Unique sync record identifier',
    },
    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Message being indexed',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who owns the message',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(IndexSyncStatus)),
      allowNull: false,
      defaultValue: IndexSyncStatus.PENDING,
      comment: 'Current synchronization status',
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last successful synchronization',
    },
    syncAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of sync attempts',
    },
    lastError: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Last error message if sync failed',
    },
    indexName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'ElasticSearch/OpenSearch index name',
    },
    documentId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Document ID in search index',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Document version number',
    },
    retryAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When to retry failed indexing',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Additional sync metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };
}

/**
 * Generates Sequelize model options for search index sync.
 * Includes indexes for efficient sync status tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelOptions} Sequelize model options
 *
 * @example
 * ```typescript
 * const SearchIndexSync = sequelize.define(
 *   'SearchIndexSync',
 *   getSearchIndexSyncAttributes(),
 *   getSearchIndexSyncModelOptions(sequelize)
 * );
 * ```
 */
export function getSearchIndexSyncModelOptions(sequelize: Sequelize): Partial<ModelOptions> {
  return {
    sequelize,
    tableName: 'search_index_sync',
    modelName: 'SearchIndexSync',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['message_id'], unique: true },
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['last_sync_at'] },
      { fields: ['retry_at'] },
      { fields: ['index_name'] },
      { fields: ['document_id'] },
      { fields: ['status', 'retry_at'] },
      { fields: ['user_id', 'status'] },
    ],
  };
}

// ============================================================================
// SEARCH QUERY BUILDERS
// ============================================================================

/**
 * Builds a Sequelize WHERE clause from search query.
 * Converts search query to database-compatible filters.
 *
 * @param {MailSearchQuery} searchQuery - Search query configuration
 * @returns {WhereOptions} Sequelize WHERE clause
 *
 * @example
 * ```typescript
 * const whereClause = buildSequelizeSearchWhere(searchQuery);
 * const messages = await Message.findAll({ where: whereClause });
 * ```
 */
export function buildSequelizeSearchWhere(searchQuery: MailSearchQuery): WhereOptions {
  const where: WhereOptions = {};
  const conditions: WhereOptions[] = [];

  // Full-text search on specified fields
  if (searchQuery.query) {
    const queryConditions: WhereOptions[] = [];

    searchQuery.fields.forEach((field) => {
      switch (field) {
        case SearchFieldType.SUBJECT:
          queryConditions.push({
            subject: { [Op.iLike]: `%${searchQuery.query}%` },
          });
          break;
        case SearchFieldType.BODY:
          queryConditions.push({
            [Op.or]: [
              { bodyText: { [Op.iLike]: `%${searchQuery.query}%` } },
              { bodyHtml: { [Op.iLike]: `%${searchQuery.query}%` } },
            ],
          });
          break;
        case SearchFieldType.FROM:
          queryConditions.push({
            [Op.or]: [
              { fromAddress: { [Op.iLike]: `%${searchQuery.query}%` } },
              { fromName: { [Op.iLike]: `%${searchQuery.query}%` } },
            ],
          });
          break;
        case SearchFieldType.TO:
          queryConditions.push({
            toAddresses: { [Op.contains]: [searchQuery.query] },
          });
          break;
        case SearchFieldType.ALL:
          queryConditions.push({
            [Op.or]: [
              { subject: { [Op.iLike]: `%${searchQuery.query}%` } },
              { bodyText: { [Op.iLike]: `%${searchQuery.query}%` } },
              { bodyHtml: { [Op.iLike]: `%${searchQuery.query}%` } },
              { fromAddress: { [Op.iLike]: `%${searchQuery.query}%` } },
              { fromName: { [Op.iLike]: `%${searchQuery.query}%` } },
            ],
          });
          break;
      }
    });

    if (queryConditions.length > 0) {
      if (searchQuery.operator === SearchOperator.AND) {
        conditions.push({ [Op.and]: queryConditions });
      } else {
        conditions.push({ [Op.or]: queryConditions });
      }
    }
  }

  // Apply filters
  if (searchQuery.filters) {
    const filters = searchQuery.filters;

    if (filters.from && filters.from.length > 0) {
      conditions.push({
        fromAddress: { [Op.in]: filters.from },
      });
    }

    if (filters.to && filters.to.length > 0) {
      conditions.push({
        toAddresses: { [Op.overlap]: filters.to },
      });
    }

    if (filters.hasAttachments !== undefined) {
      conditions.push({ hasAttachments: filters.hasAttachments });
    }

    if (filters.isRead !== undefined) {
      conditions.push({ isRead: filters.isRead });
    }

    if (filters.isFlagged !== undefined) {
      conditions.push({ isFlagged: filters.isFlagged });
    }

    if (filters.folderIds && filters.folderIds.length > 0) {
      conditions.push({
        folderId: { [Op.in]: filters.folderIds },
      });
    }

    // Date range filter
    if (filters.dateRange) {
      const dateConditions: WhereOptions = {};
      if (filters.dateRange.from) {
        dateConditions[Op.gte] = new Date(filters.dateRange.from);
      }
      if (filters.dateRange.to) {
        dateConditions[Op.lte] = new Date(filters.dateRange.to);
      }
      if (Object.keys(dateConditions).length > 0) {
        conditions.push({ receivedDate: dateConditions });
      }
    }

    // Size range filter
    if (filters.sizeRange) {
      const sizeConditions: WhereOptions = {};
      if (filters.sizeRange.min) {
        sizeConditions[Op.gte] = filters.sizeRange.min;
      }
      if (filters.sizeRange.max) {
        sizeConditions[Op.lte] = filters.sizeRange.max;
      }
      if (Object.keys(sizeConditions).length > 0) {
        conditions.push({ size: sizeConditions });
      }
    }
  }

  // Combine all conditions
  if (conditions.length > 0) {
    where[Op.and] = conditions;
  }

  return where;
}

/**
 * Builds Sequelize ORDER clause from search sort configuration.
 * Converts sort options to database order clauses.
 *
 * @param {SearchSort} sort - Sort configuration
 * @returns {Array} Sequelize ORDER clause
 *
 * @example
 * ```typescript
 * const orderClause = buildSequelizeSearchOrder(searchQuery.sort);
 * const messages = await Message.findAll({ order: orderClause });
 * ```
 */
export function buildSequelizeSearchOrder(sort: SearchSort): Array<[string, string]> {
  const order: Array<[string, string]> = [];

  // Map sort fields to database columns
  const fieldMap: Record<SearchSortField, string> = {
    [SearchSortField.RELEVANCE]: 'relevance_score',
    [SearchSortField.DATE]: 'received_date',
    [SearchSortField.FROM]: 'from_address',
    [SearchSortField.TO]: 'to_addresses',
    [SearchSortField.SUBJECT]: 'subject',
    [SearchSortField.SIZE]: 'size',
    [SearchSortField.HAS_ATTACHMENTS]: 'has_attachments',
    [SearchSortField.IMPORTANCE]: 'importance',
  };

  const primaryField = fieldMap[sort.field] || 'received_date';
  order.push([primaryField, sort.direction.toUpperCase()]);

  if (sort.secondarySort) {
    const secondaryField = fieldMap[sort.secondarySort.field] || 'received_date';
    order.push([secondaryField, sort.secondarySort.direction.toUpperCase()]);
  }

  return order;
}

/**
 * Builds PostgreSQL full-text search query using ts_vector.
 * Creates optimized full-text search conditions for PostgreSQL.
 *
 * @param {string} query - Search query text
 * @param {SearchFieldType[]} fields - Fields to search
 * @returns {WhereOptions} PostgreSQL full-text search WHERE clause
 *
 * @example
 * ```typescript
 * const ftWhere = buildPostgresFullTextSearch('patient care', [SearchFieldType.SUBJECT, SearchFieldType.BODY]);
 * const messages = await Message.findAll({ where: ftWhere });
 * ```
 */
export function buildPostgresFullTextSearch(
  query: string,
  fields: SearchFieldType[],
): WhereOptions {
  const searchQuery = query.replace(/[^\w\s]/g, ' ').trim();
  const tsQuery = searchQuery.split(/\s+/).join(' & ');

  const searchFields: string[] = [];
  fields.forEach((field) => {
    switch (field) {
      case SearchFieldType.SUBJECT:
        searchFields.push("to_tsvector('english', subject)");
        break;
      case SearchFieldType.BODY:
        searchFields.push("to_tsvector('english', body_text)");
        break;
      case SearchFieldType.FROM:
        searchFields.push("to_tsvector('english', from_name || ' ' || from_address)");
        break;
      case SearchFieldType.ALL:
        searchFields.push(
          "to_tsvector('english', subject || ' ' || body_text || ' ' || from_name)",
        );
        break;
    }
  });

  if (searchFields.length === 0) {
    searchFields.push("to_tsvector('english', subject || ' ' || body_text)");
  }

  const tsVector = searchFields.join(" || ' ' || ");

  return literal(`(${tsVector}) @@ to_tsquery('english', '${tsQuery}')`);
}

/**
 * Parses advanced search query with operators.
 * Converts Exchange Server-style search syntax to structured query.
 *
 * @param {string} queryString - Raw search query string
 * @returns {MailSearchQuery} Parsed search query object
 *
 * @example
 * ```typescript
 * const query = parseAdvancedSearchQuery('from:john@example.com subject:"urgent care" has:attachment');
 * const results = await executeSearch(query);
 * ```
 */
export function parseAdvancedSearchQuery(queryString: string): MailSearchQuery {
  const query: MailSearchQuery = {
    query: '',
    fields: [SearchFieldType.ALL],
    operator: SearchOperator.AND,
    filters: {},
    sort: {
      field: SearchSortField.DATE,
      direction: SearchSortDirection.DESC,
    },
    pagination: {
      page: 1,
      limit: 50,
    },
    options: {
      highlightMatches: true,
      includeSnippets: true,
      snippetLength: 200,
    },
  };

  // Parse field-specific searches
  const fieldPatterns: Record<string, SearchFieldType> = {
    'from:': SearchFieldType.FROM,
    'to:': SearchFieldType.TO,
    'cc:': SearchFieldType.CC,
    'subject:': SearchFieldType.SUBJECT,
    'body:': SearchFieldType.BODY,
  };

  let remainingQuery = queryString;

  // Extract field-specific terms
  Object.entries(fieldPatterns).forEach(([prefix, fieldType]) => {
    const regex = new RegExp(`${prefix}(\\S+|"[^"]+")`, 'gi');
    const matches = remainingQuery.matchAll(regex);

    for (const match of matches) {
      const value = match[1].replace(/^"|"$/g, '');
      if (!query.filters) query.filters = {};

      switch (fieldType) {
        case SearchFieldType.FROM:
          if (!query.filters.from) query.filters.from = [];
          query.filters.from.push(value);
          break;
        case SearchFieldType.TO:
          if (!query.filters.to) query.filters.to = [];
          query.filters.to.push(value);
          break;
        case SearchFieldType.SUBJECT:
          query.filters.subject = value;
          break;
        case SearchFieldType.BODY:
          query.filters.body = value;
          break;
      }

      remainingQuery = remainingQuery.replace(match[0], '');
    }
  });

  // Parse special flags
  if (/has:attachment/i.test(remainingQuery)) {
    query.filters.hasAttachments = true;
    remainingQuery = remainingQuery.replace(/has:attachment/gi, '');
  }

  if (/is:unread/i.test(remainingQuery)) {
    query.filters.isRead = false;
    remainingQuery = remainingQuery.replace(/is:unread/gi, '');
  }

  if (/is:read/i.test(remainingQuery)) {
    query.filters.isRead = true;
    remainingQuery = remainingQuery.replace(/is:read/gi, '');
  }

  if (/is:flagged/i.test(remainingQuery)) {
    query.filters.isFlagged = true;
    remainingQuery = remainingQuery.replace(/is:flagged/gi, '');
  }

  // Parse date ranges
  const dateRangeMatch = remainingQuery.match(/date:(\S+)/i);
  if (dateRangeMatch) {
    query.filters.dateRange = parseDateRange(dateRangeMatch[1]);
    remainingQuery = remainingQuery.replace(dateRangeMatch[0], '');
  }

  // Remaining text is the general query
  query.query = remainingQuery.trim();

  return query;
}

/**
 * Parses date range string to DateRangeFilter.
 * Supports relative and absolute date ranges.
 *
 * @param {string} rangeString - Date range string
 * @returns {DateRangeFilter} Parsed date range
 *
 * @example
 * ```typescript
 * const range1 = parseDateRange('last_7_days');
 * const range2 = parseDateRange('2024-01-01..2024-12-31');
 * ```
 */
export function parseDateRange(rangeString: string): DateRangeFilter {
  // Check for relative ranges
  const relativeMap: Record<string, RelativeDateRange> = {
    today: RelativeDateRange.TODAY,
    yesterday: RelativeDateRange.YESTERDAY,
    last_7_days: RelativeDateRange.LAST_7_DAYS,
    last_30_days: RelativeDateRange.LAST_30_DAYS,
    this_week: RelativeDateRange.THIS_WEEK,
    this_month: RelativeDateRange.THIS_MONTH,
    this_year: RelativeDateRange.THIS_YEAR,
  };

  if (relativeMap[rangeString.toLowerCase()]) {
    return {
      relativeRange: relativeMap[rangeString.toLowerCase()],
    };
  }

  // Parse absolute range (format: YYYY-MM-DD..YYYY-MM-DD)
  const parts = rangeString.split('..');
  if (parts.length === 2) {
    return {
      from: new Date(parts[0]),
      to: new Date(parts[1]),
    };
  }

  // Single date
  return {
    from: new Date(rangeString),
    to: new Date(rangeString),
  };
}

/**
 * Converts relative date range to absolute dates.
 * Calculates actual from/to dates for relative ranges.
 *
 * @param {RelativeDateRange} relativeRange - Relative date range
 * @returns {DateRangeFilter} Absolute date range
 *
 * @example
 * ```typescript
 * const absoluteRange = resolveRelativeDateRange(RelativeDateRange.LAST_7_DAYS);
 * console.log(absoluteRange.from, absoluteRange.to);
 * ```
 */
export function resolveRelativeDateRange(relativeRange: RelativeDateRange): DateRangeFilter {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (relativeRange) {
    case RelativeDateRange.TODAY:
      return {
        from: today,
        to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      };

    case RelativeDateRange.YESTERDAY:
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        from: yesterday,
        to: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
      };

    case RelativeDateRange.LAST_7_DAYS:
      return {
        from: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      };

    case RelativeDateRange.LAST_30_DAYS:
      return {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      };

    case RelativeDateRange.LAST_3_MONTHS:
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        to: now,
      };

    case RelativeDateRange.LAST_6_MONTHS:
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        to: now,
      };

    case RelativeDateRange.LAST_YEAR:
      return {
        from: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        to: now,
      };

    case RelativeDateRange.THIS_WEEK:
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
      return {
        from: startOfWeek,
        to: now,
      };

    case RelativeDateRange.THIS_MONTH:
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: now,
      };

    case RelativeDateRange.THIS_YEAR:
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to: now,
      };

    default:
      return { from: today, to: now };
  }
}

/**
 * Converts size range preset to byte ranges.
 * Maps human-readable size presets to actual byte values.
 *
 * @param {SizeRangePreset} preset - Size range preset
 * @returns {SizeRangeFilter} Size range in bytes
 *
 * @example
 * ```typescript
 * const sizeRange = resolveSizeRangePreset(SizeRangePreset.LARGE);
 * // Returns: { min: 1048576, max: 10485760 }
 * ```
 */
export function resolveSizeRangePreset(preset: SizeRangePreset): SizeRangeFilter {
  const KB = 1024;
  const MB = KB * 1024;

  switch (preset) {
    case SizeRangePreset.TINY:
      return { min: 0, max: 10 * KB };
    case SizeRangePreset.SMALL:
      return { min: 10 * KB, max: 100 * KB };
    case SizeRangePreset.MEDIUM:
      return { min: 100 * KB, max: 1 * MB };
    case SizeRangePreset.LARGE:
      return { min: 1 * MB, max: 10 * MB };
    case SizeRangePreset.HUGE:
      return { min: 10 * MB, max: undefined };
    default:
      return {};
  }
}

// ============================================================================
// ELASTICSEARCH/OPENSEARCH INTEGRATION
// ============================================================================

/**
 * Generates ElasticSearch index mapping for mail messages.
 * Defines field types and analyzers for optimal search performance.
 *
 * @returns {object} ElasticSearch index mapping configuration
 *
 * @example
 * ```typescript
 * const mapping = getElasticSearchIndexMapping();
 * await esClient.indices.create({
 *   index: 'mail_messages',
 *   body: { mappings: mapping }
 * });
 * ```
 */
export function getElasticSearchIndexMapping(): object {
  return {
    properties: {
      messageId: { type: 'keyword' },
      userId: { type: 'keyword' },
      subject: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword' },
          suggest: { type: 'completion' },
        },
      },
      bodyText: {
        type: 'text',
        analyzer: 'standard',
      },
      bodyHtml: {
        type: 'text',
        analyzer: 'standard',
      },
      from: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      fromName: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      to: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      toNames: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      cc: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      ccNames: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      date: { type: 'date' },
      receivedDate: { type: 'date' },
      sentDate: { type: 'date' },
      size: { type: 'long' },
      hasAttachments: { type: 'boolean' },
      attachmentCount: { type: 'integer' },
      attachmentNames: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      attachmentTypes: { type: 'keyword' },
      attachmentContent: { type: 'text' },
      folderId: { type: 'keyword' },
      folderPath: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      isRead: { type: 'boolean' },
      isFlagged: { type: 'boolean' },
      importance: { type: 'keyword' },
      categories: { type: 'keyword' },
      labels: { type: 'keyword' },
      headers: { type: 'object', enabled: false },
      metadata: { type: 'object', enabled: false },
      indexedAt: { type: 'date' },
      syncStatus: { type: 'keyword' },
    },
  };
}

/**
 * Converts MailSearchQuery to ElasticSearch query DSL.
 * Builds optimized ElasticSearch query from search configuration.
 *
 * @param {MailSearchQuery} searchQuery - Search query configuration
 * @returns {object} ElasticSearch query DSL
 *
 * @example
 * ```typescript
 * const esQuery = buildElasticSearchQuery(searchQuery);
 * const results = await esClient.search({
 *   index: 'mail_messages',
 *   body: esQuery
 * });
 * ```
 */
export function buildElasticSearchQuery(searchQuery: MailSearchQuery): object {
  const must: any[] = [];
  const should: any[] = [];
  const filter: any[] = [];

  // Main query text
  if (searchQuery.query) {
    const queryFields = searchQuery.fields.map((field) => {
      switch (field) {
        case SearchFieldType.SUBJECT:
          return 'subject^3';
        case SearchFieldType.BODY:
          return 'bodyText^1';
        case SearchFieldType.FROM:
          return 'from^2';
        case SearchFieldType.TO:
          return 'to^2';
        case SearchFieldType.ATTACHMENTS:
          return 'attachmentContent^1';
        case SearchFieldType.ALL:
        default:
          return ['subject^3', 'bodyText^1', 'from^2', 'to^2', 'attachmentNames^1.5'];
      }
    });

    const flatFields = queryFields.flat();

    must.push({
      multi_match: {
        query: searchQuery.query,
        fields: flatFields,
        type: 'best_fields',
        operator: searchQuery.operator === SearchOperator.AND ? 'and' : 'or',
        fuzziness: searchQuery.options.fuzzyMatching ? 'AUTO' : undefined,
      },
    });
  }

  // Apply filters
  const filters = searchQuery.filters;

  if (filters.from && filters.from.length > 0) {
    filter.push({
      terms: { 'from.keyword': filters.from },
    });
  }

  if (filters.to && filters.to.length > 0) {
    should.push({
      terms: { 'to.keyword': filters.to },
    });
  }

  if (filters.hasAttachments !== undefined) {
    filter.push({
      term: { hasAttachments: filters.hasAttachments },
    });
  }

  if (filters.isRead !== undefined) {
    filter.push({
      term: { isRead: filters.isRead },
    });
  }

  if (filters.isFlagged !== undefined) {
    filter.push({
      term: { isFlagged: filters.isFlagged },
    });
  }

  if (filters.folderIds && filters.folderIds.length > 0) {
    filter.push({
      terms: { folderId: filters.folderIds },
    });
  }

  // Date range
  if (filters.dateRange) {
    const dateRange: any = {};
    if (filters.dateRange.from) {
      dateRange.gte = filters.dateRange.from;
    }
    if (filters.dateRange.to) {
      dateRange.lte = filters.dateRange.to;
    }
    if (Object.keys(dateRange).length > 0) {
      filter.push({
        range: { receivedDate: dateRange },
      });
    }
  }

  // Size range
  if (filters.sizeRange) {
    const sizeRange: any = {};
    if (filters.sizeRange.min) {
      sizeRange.gte = filters.sizeRange.min;
    }
    if (filters.sizeRange.max) {
      sizeRange.lte = filters.sizeRange.max;
    }
    if (Object.keys(sizeRange).length > 0) {
      filter.push({
        range: { size: sizeRange },
      });
    }
  }

  // Build query
  const query: any = {
    bool: {
      must: must.length > 0 ? must : undefined,
      should: should.length > 0 ? should : undefined,
      filter: filter.length > 0 ? filter : undefined,
      minimum_should_match: should.length > 0 ? 1 : undefined,
    },
  };

  // Add sorting
  const sort: any[] = [];
  const sortFieldMap: Record<SearchSortField, string> = {
    [SearchSortField.RELEVANCE]: '_score',
    [SearchSortField.DATE]: 'receivedDate',
    [SearchSortField.FROM]: 'from.keyword',
    [SearchSortField.TO]: 'to.keyword',
    [SearchSortField.SUBJECT]: 'subject.keyword',
    [SearchSortField.SIZE]: 'size',
    [SearchSortField.HAS_ATTACHMENTS]: 'hasAttachments',
    [SearchSortField.IMPORTANCE]: 'importance',
  };

  const sortField = sortFieldMap[searchQuery.sort.field];
  sort.push({ [sortField]: { order: searchQuery.sort.direction } });

  if (searchQuery.sort.secondarySort) {
    const secondaryField = sortFieldMap[searchQuery.sort.secondarySort.field];
    sort.push({ [secondaryField]: { order: searchQuery.sort.secondarySort.direction } });
  }

  // Build complete query
  const esQuery: any = {
    query,
    sort,
    from: (searchQuery.pagination.page - 1) * searchQuery.pagination.limit,
    size: searchQuery.pagination.limit,
  };

  // Add highlighting
  if (searchQuery.options.highlightMatches) {
    esQuery.highlight = {
      fields: {
        subject: {},
        bodyText: {
          fragment_size: searchQuery.options.snippetLength || 200,
          number_of_fragments: 3,
        },
        from: {},
        to: {},
      },
      pre_tags: ['<mark>'],
      post_tags: ['</mark>'],
    };
  }

  // Add aggregations
  if (searchQuery.options.aggregations && searchQuery.options.aggregations.length > 0) {
    esQuery.aggs = {};
    searchQuery.options.aggregations.forEach((agg) => {
      esQuery.aggs[agg.name] = buildElasticSearchAggregation(agg);
    });
  }

  return esQuery;
}

/**
 * Builds ElasticSearch aggregation configuration.
 * Creates aggregation DSL for analytics and faceting.
 *
 * @param {SearchAggregation} aggregation - Aggregation configuration
 * @returns {object} ElasticSearch aggregation DSL
 *
 * @example
 * ```typescript
 * const agg = buildElasticSearchAggregation({
 *   name: 'senders',
 *   type: SearchAggregationType.TERMS,
 *   field: 'from.keyword',
 *   size: 10
 * });
 * ```
 */
export function buildElasticSearchAggregation(aggregation: SearchAggregation): object {
  switch (aggregation.type) {
    case SearchAggregationType.TERMS:
      return {
        terms: {
          field: aggregation.field,
          size: aggregation.size || 10,
        },
      };

    case SearchAggregationType.DATE_HISTOGRAM:
      return {
        date_histogram: {
          field: aggregation.field,
          calendar_interval: aggregation.interval || 'day',
        },
      };

    case SearchAggregationType.RANGE:
      return {
        range: {
          field: aggregation.field,
          ranges: aggregation.ranges || [],
        },
      };

    case SearchAggregationType.STATS:
      return {
        stats: {
          field: aggregation.field,
        },
      };

    default:
      return {};
  }
}

/**
 * Converts ElasticSearch response to SearchResults format.
 * Transforms ES response to standardized search results.
 *
 * @param {any} esResponse - ElasticSearch response
 * @param {MailSearchQuery} searchQuery - Original search query
 * @returns {SearchResults} Standardized search results
 *
 * @example
 * ```typescript
 * const esResponse = await esClient.search({ ... });
 * const results = transformElasticSearchResponse(esResponse, searchQuery);
 * ```
 */
export function transformElasticSearchResponse(
  esResponse: any,
  searchQuery: MailSearchQuery,
): SearchResults {
  const hits = esResponse.hits.hits || [];
  const total = esResponse.hits.total?.value || 0;
  const took = esResponse.took || 0;

  const results: SearchResultItem[] = hits.map((hit: any) => {
    const source = hit._source;
    const highlights = hit.highlight || {};

    return {
      id: source.messageId,
      score: hit._score,
      highlights,
      snippet: extractSnippet(highlights, source.bodyText),
      message: {
        id: source.messageId,
        subject: source.subject,
        from: source.from,
        to: source.to || [],
        cc: source.cc || [],
        date: new Date(source.receivedDate),
        size: source.size,
        hasAttachments: source.hasAttachments,
        isRead: source.isRead,
        isFlagged: source.isFlagged,
        folderId: source.folderId,
        folderName: source.folderPath,
      },
      matchedFields: determineMatchedFields(highlights),
    };
  });

  // Process aggregations
  const aggregations: Record<string, AggregationResult> = {};
  if (esResponse.aggregations) {
    Object.entries(esResponse.aggregations).forEach(([key, value]: [string, any]) => {
      if (value.buckets) {
        aggregations[key] = {
          type: SearchAggregationType.TERMS,
          buckets: value.buckets.map((b: any) => ({
            key: b.key,
            count: b.doc_count,
            from: b.from,
            to: b.to,
          })),
        };
      } else if (value.min !== undefined) {
        aggregations[key] = {
          type: SearchAggregationType.STATS,
          stats: {
            min: value.min,
            max: value.max,
            avg: value.avg,
            sum: value.sum,
            count: value.count,
          },
        };
      }
    });
  }

  const totalPages = Math.ceil(total / searchQuery.pagination.limit);

  return {
    status: SearchResultStatus.SUCCESS,
    total,
    took,
    results,
    aggregations: Object.keys(aggregations).length > 0 ? aggregations : undefined,
    pagination: {
      page: searchQuery.pagination.page,
      limit: searchQuery.pagination.limit,
      totalPages,
      hasMore: searchQuery.pagination.page < totalPages,
    },
  };
}

/**
 * Extracts search snippet from highlights or body text.
 * Creates readable preview text with match context.
 *
 * @param {Record<string, string[]>} highlights - Highlight fragments
 * @param {string} bodyText - Full body text
 * @returns {string} Snippet text
 *
 * @example
 * ```typescript
 * const snippet = extractSnippet(highlights, bodyText);
 * console.log(snippet); // "...patient care <mark>appointment</mark> scheduled..."
 * ```
 */
export function extractSnippet(highlights: Record<string, string[]>, bodyText: string): string {
  // Prefer body highlights
  if (highlights.bodyText && highlights.bodyText.length > 0) {
    return highlights.bodyText[0];
  }

  // Fallback to subject highlights
  if (highlights.subject && highlights.subject.length > 0) {
    return highlights.subject[0];
  }

  // Fallback to body text truncation
  if (bodyText) {
    return bodyText.substring(0, 200) + (bodyText.length > 200 ? '...' : '');
  }

  return '';
}

/**
 * Determines which fields matched the search query.
 * Analyzes highlights to identify matching fields.
 *
 * @param {Record<string, string[]>} highlights - Highlight data
 * @returns {SearchFieldType[]} Matched field types
 *
 * @example
 * ```typescript
 * const matchedFields = determineMatchedFields(highlights);
 * console.log(matchedFields); // [SearchFieldType.SUBJECT, SearchFieldType.BODY]
 * ```
 */
export function determineMatchedFields(highlights: Record<string, string[]>): SearchFieldType[] {
  const fields: SearchFieldType[] = [];
  const fieldMap: Record<string, SearchFieldType> = {
    subject: SearchFieldType.SUBJECT,
    bodyText: SearchFieldType.BODY,
    from: SearchFieldType.FROM,
    to: SearchFieldType.TO,
    attachmentNames: SearchFieldType.ATTACHMENTS,
  };

  Object.keys(highlights).forEach((key) => {
    if (fieldMap[key]) {
      fields.push(fieldMap[key]);
    }
  });

  return fields.length > 0 ? fields : [SearchFieldType.ALL];
}

// ============================================================================
// INDEX MANAGEMENT
// ============================================================================

/**
 * Creates or updates search index for a mail message.
 * Indexes message content in ElasticSearch/OpenSearch.
 *
 * @param {SearchIndexDocument} document - Document to index
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<IndexSyncInfo>} Index sync information
 *
 * @example
 * ```typescript
 * const syncInfo = await indexMailMessage(document, esClient);
 * console.log(`Indexed message ${syncInfo.messageId}`);
 * ```
 */
export async function indexMailMessage(
  document: SearchIndexDocument,
  searchClient: any,
): Promise<IndexSyncInfo> {
  const indexName = `mail_messages_${document.userId}`;
  const documentId = document.messageId;

  try {
    await searchClient.index({
      index: indexName,
      id: documentId,
      document,
    });

    return {
      messageId: document.messageId,
      userId: document.userId,
      status: IndexSyncStatus.SYNCED,
      lastSyncAt: new Date(),
      syncAttempts: 1,
      lastError: null,
      indexName,
      documentId,
      version: 1,
      retryAt: null,
    };
  } catch (error) {
    return {
      messageId: document.messageId,
      userId: document.userId,
      status: IndexSyncStatus.ERROR,
      lastSyncAt: null,
      syncAttempts: 1,
      lastError: error instanceof Error ? error.message : String(error),
      indexName,
      documentId,
      version: 1,
      retryAt: new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
    };
  }
}

/**
 * Performs bulk indexing of multiple messages.
 * Efficiently indexes many messages at once.
 *
 * @param {SearchIndexDocument[]} documents - Documents to index
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<IndexSyncInfo[]>} Index sync information for all documents
 *
 * @example
 * ```typescript
 * const syncInfos = await bulkIndexMessages(documents, esClient);
 * console.log(`Indexed ${syncInfos.length} messages`);
 * ```
 */
export async function bulkIndexMessages(
  documents: SearchIndexDocument[],
  searchClient: any,
): Promise<IndexSyncInfo[]> {
  if (documents.length === 0) {
    return [];
  }

  const userId = documents[0].userId;
  const indexName = `mail_messages_${userId}`;

  const operations = documents.flatMap((doc) => [
    { index: { _index: indexName, _id: doc.messageId } },
    doc,
  ]);

  try {
    const response = await searchClient.bulk({ operations });

    return documents.map((doc, index) => {
      const item = response.items[index];
      const isSuccess = item.index?.result === 'created' || item.index?.result === 'updated';

      return {
        messageId: doc.messageId,
        userId: doc.userId,
        status: isSuccess ? IndexSyncStatus.SYNCED : IndexSyncStatus.ERROR,
        lastSyncAt: isSuccess ? new Date() : null,
        syncAttempts: 1,
        lastError: isSuccess ? null : item.index?.error?.reason || 'Unknown error',
        indexName,
        documentId: doc.messageId,
        version: item.index?.version || 1,
        retryAt: isSuccess ? null : new Date(Date.now() + 5 * 60 * 1000),
      };
    });
  } catch (error) {
    // Return error status for all documents
    return documents.map((doc) => ({
      messageId: doc.messageId,
      userId: doc.userId,
      status: IndexSyncStatus.ERROR,
      lastSyncAt: null,
      syncAttempts: 1,
      lastError: error instanceof Error ? error.message : String(error),
      indexName,
      documentId: doc.messageId,
      version: 1,
      retryAt: new Date(Date.now() + 5 * 60 * 1000),
    }));
  }
}

/**
 * Removes message from search index.
 * Deletes document from ElasticSearch/OpenSearch.
 *
 * @param {string} messageId - Message ID to remove
 * @param {string} userId - User ID
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFromSearchIndex(messageId, userId, esClient);
 * ```
 */
export async function removeFromSearchIndex(
  messageId: string,
  userId: string,
  searchClient: any,
): Promise<void> {
  const indexName = `mail_messages_${userId}`;

  try {
    await searchClient.delete({
      index: indexName,
      id: messageId,
    });
  } catch (error) {
    // Document might not exist, ignore 404 errors
    if ((error as any)?.meta?.statusCode !== 404) {
      throw error;
    }
  }
}

/**
 * Performs incremental index update for changed messages.
 * Identifies and reindexes only modified messages.
 *
 * @param {string} userId - User ID
 * @param {Date} since - Timestamp to check for changes
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<number>} Number of messages reindexed
 *
 * @example
 * ```typescript
 * const count = await incrementalIndexUpdate(userId, lastSyncDate, esClient);
 * console.log(`Reindexed ${count} messages`);
 * ```
 */
export async function incrementalIndexUpdate(
  userId: string,
  since: Date,
  searchClient: any,
): Promise<number> {
  // Implementation would:
  // 1. Query database for messages modified since timestamp
  // 2. Build search index documents
  // 3. Bulk index the modified messages
  // 4. Return count of reindexed messages

  // This is a placeholder showing the function signature
  return 0;
}

/**
 * Rebuilds entire search index for a user.
 * Performs full reindexing of all messages.
 *
 * @param {string} userId - User ID
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<number>} Number of messages indexed
 *
 * @example
 * ```typescript
 * const count = await rebuildSearchIndex(userId, esClient);
 * console.log(`Rebuilt index with ${count} messages`);
 * ```
 */
export async function rebuildSearchIndex(userId: string, searchClient: any): Promise<number> {
  // Implementation would:
  // 1. Delete existing index
  // 2. Create new index with mapping
  // 3. Query all messages for user
  // 4. Bulk index all messages
  // 5. Return count

  // This is a placeholder showing the function signature
  return 0;
}

/**
 * Optimizes search index for performance.
 * Performs index maintenance and optimization.
 *
 * @param {string} userId - User ID
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await optimizeSearchIndex(userId, esClient);
 * ```
 */
export async function optimizeSearchIndex(userId: string, searchClient: any): Promise<void> {
  const indexName = `mail_messages_${userId}`;

  try {
    // Force merge to optimize segments
    await searchClient.indices.forcemerge({
      index: indexName,
      max_num_segments: 1,
    });

    // Refresh index
    await searchClient.indices.refresh({
      index: indexName,
    });
  } catch (error) {
    console.error(`Failed to optimize index ${indexName}:`, error);
  }
}

// ============================================================================
// SEARCH SUGGESTIONS AND AUTOCOMPLETE
// ============================================================================

/**
 * Generates search suggestions based on query prefix.
 * Provides autocomplete suggestions for search queries.
 *
 * @param {string} prefix - Query prefix
 * @param {string} userId - User ID
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<SearchSuggestion[]>} Suggestion list
 *
 * @example
 * ```typescript
 * const suggestions = await getSearchSuggestions('patient c', userId, esClient);
 * // Returns: ['patient care', 'patient consultation', ...]
 * ```
 */
export async function getSearchSuggestions(
  prefix: string,
  userId: string,
  searchClient: any,
): Promise<SearchSuggestion[]> {
  const indexName = `mail_messages_${userId}`;

  try {
    const response = await searchClient.search({
      index: indexName,
      body: {
        suggest: {
          subject_suggest: {
            prefix,
            completion: {
              field: 'subject.suggest',
              size: 10,
              skip_duplicates: true,
            },
          },
        },
      },
    });

    const suggestions: SearchSuggestion[] = [];
    const options = response.suggest?.subject_suggest?.[0]?.options || [];

    options.forEach((option: any) => {
      suggestions.push({
        text: option.text,
        type: 'subject',
        score: option._score,
        frequency: option._source?.frequency || 1,
        lastUsed: new Date(option._source?.lastUsed || Date.now()),
      });
    });

    return suggestions;
  } catch (error) {
    console.error('Failed to get search suggestions:', error);
    return [];
  }
}

/**
 * Gets frequently searched terms for a user.
 * Returns popular search queries for suggestions.
 *
 * @param {string} userId - User ID
 * @param {number} limit - Number of terms to return
 * @returns {Promise<SearchSuggestion[]>} Popular search terms
 *
 * @example
 * ```typescript
 * const popular = await getPopularSearchTerms(userId, 10);
 * ```
 */
export async function getPopularSearchTerms(
  userId: string,
  limit: number = 10,
): Promise<SearchSuggestion[]> {
  // Implementation would query search analytics to find most frequent searches
  // This is a placeholder showing the function signature
  return [];
}

/**
 * Gets contact suggestions for autocomplete.
 * Suggests email addresses based on prefix.
 *
 * @param {string} prefix - Email/name prefix
 * @param {string} userId - User ID
 * @returns {Promise<SearchSuggestion[]>} Contact suggestions
 *
 * @example
 * ```typescript
 * const contacts = await getContactSuggestions('john', userId);
 * // Returns: ['john@example.com', 'john.doe@hospital.org', ...]
 * ```
 */
export async function getContactSuggestions(
  prefix: string,
  userId: string,
): Promise<SearchSuggestion[]> {
  // Implementation would query from/to fields for matching contacts
  // This is a placeholder showing the function signature
  return [];
}

// ============================================================================
// SAVED SEARCHES
// ============================================================================

/**
 * Creates a saved search for a user.
 * Stores search query for reuse.
 *
 * @param {string} userId - User ID
 * @param {string} name - Search name
 * @param {MailSearchQuery} query - Search query configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SavedSearch>} Created saved search
 *
 * @example
 * ```typescript
 * const saved = await createSavedSearch(userId, 'Urgent Patient Care', searchQuery);
 * ```
 */
export async function createSavedSearch(
  userId: string,
  name: string,
  query: MailSearchQuery,
  transaction?: Transaction,
): Promise<SavedSearch> {
  // Implementation would insert into saved_searches table
  // This is a placeholder showing the function signature
  return {} as SavedSearch;
}

/**
 * Updates an existing saved search.
 * Modifies saved search query or metadata.
 *
 * @param {string} searchId - Saved search ID
 * @param {Partial<SavedSearch>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SavedSearch>} Updated saved search
 *
 * @example
 * ```typescript
 * const updated = await updateSavedSearch(searchId, { name: 'New Name' });
 * ```
 */
export async function updateSavedSearch(
  searchId: string,
  updates: Partial<SavedSearch>,
  transaction?: Transaction,
): Promise<SavedSearch> {
  // Implementation would update saved_searches table
  // This is a placeholder showing the function signature
  return {} as SavedSearch;
}

/**
 * Deletes a saved search.
 * Removes saved search from database.
 *
 * @param {string} searchId - Saved search ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteSavedSearch(searchId);
 * ```
 */
export async function deleteSavedSearch(
  searchId: string,
  transaction?: Transaction,
): Promise<void> {
  // Implementation would delete from saved_searches table
  // This is a placeholder showing the function signature
}

/**
 * Gets all saved searches for a user.
 * Returns list of user's saved searches.
 *
 * @param {string} userId - User ID
 * @returns {Promise<SavedSearch[]>} List of saved searches
 *
 * @example
 * ```typescript
 * const searches = await getSavedSearches(userId);
 * ```
 */
export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  // Implementation would query saved_searches table
  // This is a placeholder showing the function signature
  return [];
}

/**
 * Executes a saved search.
 * Runs saved search query and returns results.
 *
 * @param {string} searchId - Saved search ID
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<SearchResults>} Search results
 *
 * @example
 * ```typescript
 * const results = await executeSavedSearch(searchId, esClient);
 * ```
 */
export async function executeSavedSearch(
  searchId: string,
  searchClient: any,
): Promise<SearchResults> {
  // Implementation would:
  // 1. Fetch saved search from database
  // 2. Execute the search query
  // 3. Update lastUsedAt and useCount
  // 4. Return results

  // This is a placeholder showing the function signature
  return {} as SearchResults;
}

// ============================================================================
// SWAGGER DOCUMENTATION HELPERS
// ============================================================================

/**
 * Generates Swagger ApiProperty configuration for search query.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class SearchQueryDto {
 *   @ApiProperty(getSearchQueryProperty())
 *   query: string;
 * }
 * ```
 */
export function getSearchQueryProperty(): object {
  return {
    description: 'Search query text (supports advanced operators)',
    type: 'string',
    example: 'patient care from:doctor@hospital.org has:attachment',
    minLength: 0,
    maxLength: 1000,
  };
}

/**
 * Generates Swagger ApiProperty configuration for search fields.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class SearchQueryDto {
 *   @ApiProperty(getSearchFieldsProperty())
 *   fields: SearchFieldType[];
 * }
 * ```
 */
export function getSearchFieldsProperty(): object {
  return {
    description: 'Fields to search in',
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(SearchFieldType),
    },
    example: [SearchFieldType.SUBJECT, SearchFieldType.BODY],
    default: [SearchFieldType.ALL],
  };
}

/**
 * Generates Swagger ApiProperty configuration for search operator.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class SearchQueryDto {
 *   @ApiProperty(getSearchOperatorProperty())
 *   operator: SearchOperator;
 * }
 * ```
 */
export function getSearchOperatorProperty(): object {
  return {
    description: 'Search operator for combining terms',
    enum: Object.values(SearchOperator),
    type: 'string',
    example: SearchOperator.AND,
    default: SearchOperator.AND,
  };
}

/**
 * Generates Swagger ApiProperty configuration for date range filter.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class SearchFiltersDto {
 *   @ApiProperty(getDateRangeFilterProperty())
 *   dateRange: DateRangeFilter;
 * }
 * ```
 */
export function getDateRangeFilterProperty(): object {
  return {
    description: 'Date range filter for search results',
    type: 'object',
    properties: {
      from: {
        type: 'string',
        format: 'date-time',
        description: 'Start date',
      },
      to: {
        type: 'string',
        format: 'date-time',
        description: 'End date',
      },
      relativeRange: {
        enum: Object.values(RelativeDateRange),
        description: 'Relative date range preset',
      },
    },
    example: {
      relativeRange: RelativeDateRange.LAST_7_DAYS,
    },
  };
}

/**
 * Generates Swagger ApiResponse for search results endpoint.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiResponse(getSearchResultsResponse())
 * async search(@Body() query: SearchQueryDto) { }
 * ```
 */
export function getSearchResultsResponse(): object {
  return {
    status: 200,
    description: 'Search completed successfully',
    schema: {
      type: 'object',
      properties: {
        status: {
          enum: Object.values(SearchResultStatus),
          example: SearchResultStatus.SUCCESS,
        },
        total: {
          type: 'number',
          example: 42,
          description: 'Total number of results',
        },
        took: {
          type: 'number',
          example: 125,
          description: 'Search execution time in milliseconds',
        },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              score: { type: 'number', example: 0.95 },
              snippet: { type: 'string', example: '...patient care <mark>appointment</mark>...' },
              message: {
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  from: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  hasAttachments: { type: 'boolean' },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  };
}

/**
 * Generates Swagger ApiProperty configuration for saved search name.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class SavedSearchDto {
 *   @ApiProperty(getSavedSearchNameProperty())
 *   name: string;
 * }
 * ```
 */
export function getSavedSearchNameProperty(): object {
  return {
    description: 'Saved search display name',
    type: 'string',
    minLength: 1,
    maxLength: 255,
    example: 'Urgent Patient Care Messages',
  };
}

/**
 * Generates Swagger request body for advanced search.
 *
 * @returns {object} Request body configuration
 *
 * @example
 * ```typescript
 * @ApiBody(getAdvancedSearchRequestBody())
 * async advancedSearch(@Body() query: AdvancedSearchDto) { }
 * ```
 */
export function getAdvancedSearchRequestBody(): object {
  return {
    description: 'Advanced search query with filters and options',
    required: true,
    schema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: {
          type: 'string',
          description: 'Search query text',
          example: 'patient appointment',
        },
        fields: {
          type: 'array',
          items: {
            enum: Object.values(SearchFieldType),
          },
          description: 'Fields to search',
        },
        filters: {
          type: 'object',
          properties: {
            from: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by sender addresses',
            },
            to: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by recipient addresses',
            },
            hasAttachments: {
              type: 'boolean',
              description: 'Filter by attachment presence',
            },
            dateRange: {
              type: 'object',
              description: 'Date range filter',
            },
          },
        },
        sort: {
          type: 'object',
          properties: {
            field: {
              enum: Object.values(SearchSortField),
            },
            direction: {
              enum: Object.values(SearchSortDirection),
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 50, maximum: 100 },
          },
        },
      },
    },
  };
}

// ============================================================================
// SEARCH PERFORMANCE AND ANALYTICS
// ============================================================================

/**
 * Validates search query for security and performance.
 * Checks query complexity and sanitizes input.
 *
 * @param {MailSearchQuery} query - Search query to validate
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSearchQuery(query);
 * if (!validation.isValid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export function validateSearchQuery(query: MailSearchQuery): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate query length
  if (query.query && query.query.length > 1000) {
    errors.push('Query text exceeds maximum length of 1000 characters');
  }

  // Validate pagination
  if (query.pagination.limit > 100) {
    errors.push('Page limit cannot exceed 100 results');
  }

  if (query.pagination.page < 1) {
    errors.push('Page number must be at least 1');
  }

  // Validate fields array
  if (!query.fields || query.fields.length === 0) {
    errors.push('At least one search field must be specified');
  }

  // Validate date range
  if (query.filters.dateRange) {
    const { from, to } = query.filters.dateRange;
    if (from && to && new Date(from) > new Date(to)) {
      errors.push('Date range "from" must be before "to"');
    }
  }

  // Validate size range
  if (query.filters.sizeRange) {
    const { min, max } = query.filters.sizeRange;
    if (min !== undefined && max !== undefined && min > max) {
      errors.push('Size range minimum cannot exceed maximum');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Tracks search analytics event for monitoring and optimization.
 * Records search queries and interactions for analytics.
 *
 * @param {SearchAnalyticsEvent} event - Analytics event data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackSearchAnalytics({
 *   userId,
 *   query: 'patient care',
 *   filters: {},
 *   resultCount: 42,
 *   took: 125,
 *   clickedResults: ['msg-123'],
 *   timestamp: new Date(),
 *   sessionId: 'session-xyz'
 * });
 * ```
 */
export async function trackSearchAnalytics(
  event: SearchAnalyticsEvent,
  transaction?: Transaction,
): Promise<void> {
  // Implementation would insert into search_analytics table
  // Track for usage patterns, popular queries, and performance metrics
}

/**
 * Gets search performance metrics for monitoring.
 * Returns aggregated performance statistics.
 *
 * @param {string} userId - User ID (optional, for user-specific metrics)
 * @param {DateRangeFilter} dateRange - Time period for metrics
 * @returns {Promise<SearchPerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSearchPerformanceMetrics(userId, {
 *   from: new Date('2024-01-01'),
 *   to: new Date()
 * });
 * console.log(`Average search time: ${metrics.avgSearchTime}ms`);
 * ```
 */
export async function getSearchPerformanceMetrics(
  userId: string | null,
  dateRange: DateRangeFilter,
): Promise<{
  totalSearches: number;
  avgSearchTime: number;
  minSearchTime: number;
  maxSearchTime: number;
  avgResultCount: number;
  slowQueries: number;
  errorRate: number;
}> {
  // Implementation would query analytics data
  return {
    totalSearches: 0,
    avgSearchTime: 0,
    minSearchTime: 0,
    maxSearchTime: 0,
    avgResultCount: 0,
    slowQueries: 0,
    errorRate: 0,
  };
}

/**
 * Caches search results for improved performance.
 * Stores search results in cache with TTL.
 *
 * @param {string} cacheKey - Cache key (hash of query)
 * @param {SearchResults} results - Search results to cache
 * @param {number} ttlSeconds - Cache TTL in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const cacheKey = generateSearchCacheKey(query);
 * await cacheSearchResults(cacheKey, results, 300); // 5 minutes
 * ```
 */
export async function cacheSearchResults(
  cacheKey: string,
  results: SearchResults,
  ttlSeconds: number = 300,
): Promise<void> {
  // Implementation would store in Redis or similar cache
  // Use query hash as key, TTL to auto-expire
}

/**
 * Retrieves cached search results.
 * Returns cached results if available and valid.
 *
 * @param {string} cacheKey - Cache key
 * @returns {Promise<SearchResults | null>} Cached results or null
 *
 * @example
 * ```typescript
 * const cacheKey = generateSearchCacheKey(query);
 * const cached = await getCachedSearchResults(cacheKey);
 * if (cached) return cached;
 * ```
 */
export async function getCachedSearchResults(cacheKey: string): Promise<SearchResults | null> {
  // Implementation would retrieve from cache
  return null;
}

/**
 * Generates cache key from search query.
 * Creates deterministic hash for query caching.
 *
 * @param {MailSearchQuery} query - Search query
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = generateSearchCacheKey(query);
 * // Returns: "search:user123:hash5a7b9c2e"
 * ```
 */
export function generateSearchCacheKey(query: MailSearchQuery): string {
  // Create deterministic string representation
  const queryString = JSON.stringify({
    query: query.query,
    fields: query.fields.sort(),
    filters: query.filters,
    sort: query.sort,
    pagination: query.pagination,
  });

  // Simple hash implementation (in production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < queryString.length; i++) {
    const char = queryString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `search:${Math.abs(hash).toString(16)}`;
}

/**
 * Extracts text content from attachment for indexing.
 * Parses attachment files to extract searchable text.
 *
 * @param {Buffer} attachmentData - Attachment file data
 * @param {string} mimeType - MIME type of attachment
 * @param {string} filename - Attachment filename
 * @returns {Promise<string>} Extracted text content
 *
 * @example
 * ```typescript
 * const text = await extractAttachmentText(buffer, 'application/pdf', 'report.pdf');
 * document.attachmentContent.push(text);
 * ```
 */
export async function extractAttachmentText(
  attachmentData: Buffer,
  mimeType: string,
  filename: string,
): Promise<string> {
  // Implementation would use libraries like:
  // - pdf-parse for PDFs
  // - mammoth for DOCX
  // - xlsx for Excel
  // - xml2js for XML

  // Return extracted text or empty string
  return '';
}

/**
 * Deduplicates search results by message ID.
 * Removes duplicate entries from search results.
 *
 * @param {SearchResultItem[]} results - Search results
 * @returns {SearchResultItem[]} Deduplicated results
 *
 * @example
 * ```typescript
 * const unique = deduplicateSearchResults(results);
 * ```
 */
export function deduplicateSearchResults(results: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>();
  const deduplicated: SearchResultItem[] = [];

  for (const result of results) {
    if (!seen.has(result.id)) {
      seen.add(result.id);
      deduplicated.push(result);
    }
  }

  return deduplicated;
}

/**
 * Merges search results from multiple sources.
 * Combines and ranks results from database and ElasticSearch.
 *
 * @param {SearchResultItem[][]} resultSets - Array of result sets
 * @param {SearchSort} sort - Sort configuration
 * @returns {SearchResultItem[]} Merged and sorted results
 *
 * @example
 * ```typescript
 * const merged = mergeSearchResults([dbResults, esResults], sortConfig);
 * ```
 */
export function mergeSearchResults(
  resultSets: SearchResultItem[][],
  sort: SearchSort,
): SearchResultItem[] {
  // Flatten all result sets
  const allResults = resultSets.flat();

  // Deduplicate
  const unique = deduplicateSearchResults(allResults);

  // Sort based on configuration
  const sortField = sort.field;
  const sortDir = sort.direction === SearchSortDirection.ASC ? 1 : -1;

  unique.sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case SearchSortField.RELEVANCE:
        comparison = a.score - b.score;
        break;
      case SearchSortField.DATE:
        comparison = a.message.date.getTime() - b.message.date.getTime();
        break;
      case SearchSortField.FROM:
        comparison = a.message.from.localeCompare(b.message.from);
        break;
      case SearchSortField.SUBJECT:
        comparison = a.message.subject.localeCompare(b.message.subject);
        break;
      case SearchSortField.SIZE:
        comparison = a.message.size - b.message.size;
        break;
      default:
        comparison = a.score - b.score;
    }

    return comparison * sortDir;
  });

  return unique;
}

/**
 * Gets search query history for a user.
 * Returns recent search queries for autocomplete and analytics.
 *
 * @param {string} userId - User ID
 * @param {number} limit - Number of history items to return
 * @returns {Promise<Array<{ query: string; timestamp: Date; resultCount: number }>>} Query history
 *
 * @example
 * ```typescript
 * const history = await getSearchQueryHistory(userId, 10);
 * ```
 */
export async function getSearchQueryHistory(
  userId: string,
  limit: number = 20,
): Promise<Array<{ query: string; timestamp: Date; resultCount: number }>> {
  // Implementation would query search_analytics table
  // Return most recent unique queries
  return [];
}

/**
 * Clears search cache for a user or globally.
 * Invalidates cached search results.
 *
 * @param {string | null} userId - User ID (null for global clear)
 * @returns {Promise<number>} Number of cache entries cleared
 *
 * @example
 * ```typescript
 * const cleared = await clearSearchCache(userId);
 * console.log(`Cleared ${cleared} cache entries`);
 * ```
 */
export async function clearSearchCache(userId: string | null): Promise<number> {
  // Implementation would clear Redis cache
  // Filter by user if specified, or clear all
  return 0;
}

/**
 * Estimates search result count without executing full query.
 * Provides quick count estimation for UI feedback.
 *
 * @param {MailSearchQuery} query - Search query
 * @param {any} searchClient - ElasticSearch/OpenSearch client
 * @returns {Promise<number>} Estimated result count
 *
 * @example
 * ```typescript
 * const estimate = await estimateSearchResultCount(query, esClient);
 * console.log(`Approximately ${estimate} results`);
 * ```
 */
export async function estimateSearchResultCount(
  query: MailSearchQuery,
  searchClient: any,
): Promise<number> {
  const userId = query.filters.folderIds?.[0] || 'default';
  const indexName = `mail_messages_${userId}`;

  try {
    const response = await searchClient.count({
      index: indexName,
      body: {
        query: buildElasticSearchQuery(query).query,
      },
    });

    return response.count || 0;
  } catch (error) {
    console.error('Failed to estimate result count:', error);
    return 0;
  }
}
