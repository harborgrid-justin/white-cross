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
import { Sequelize, ModelAttributes, ModelOptions, WhereOptions, Transaction } from 'sequelize';
/**
 * Search field types for targeted searching
 */
export declare enum SearchFieldType {
    ALL = "all",
    SUBJECT = "subject",
    BODY = "body",
    FROM = "from",
    TO = "to",
    CC = "cc",
    BCC = "bcc",
    ATTACHMENTS = "attachments",
    HEADERS = "headers",
    FOLDER = "folder"
}
/**
 * Search operators for advanced queries
 */
export declare enum SearchOperator {
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    NEAR = "NEAR",
    PHRASE = "PHRASE",
    WILDCARD = "WILDCARD",
    FUZZY = "FUZZY",
    RANGE = "RANGE"
}
/**
 * Search sort options
 */
export declare enum SearchSortField {
    RELEVANCE = "relevance",
    DATE = "date",
    FROM = "from",
    TO = "to",
    SUBJECT = "subject",
    SIZE = "size",
    HAS_ATTACHMENTS = "hasAttachments",
    IMPORTANCE = "importance"
}
/**
 * Search sort direction
 */
export declare enum SearchSortDirection {
    ASC = "asc",
    DESC = "desc"
}
/**
 * Index sync status
 */
export declare enum IndexSyncStatus {
    PENDING = "pending",
    INDEXING = "indexing",
    SYNCED = "synced",
    ERROR = "error",
    DELETED = "deleted",
    REINDEXING = "reindexing"
}
/**
 * Search result status
 */
export declare enum SearchResultStatus {
    SUCCESS = "success",
    PARTIAL = "partial",
    ERROR = "error",
    TIMEOUT = "timeout"
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
export declare enum RelativeDateRange {
    TODAY = "today",
    YESTERDAY = "yesterday",
    LAST_7_DAYS = "last_7_days",
    LAST_30_DAYS = "last_30_days",
    LAST_3_MONTHS = "last_3_months",
    LAST_6_MONTHS = "last_6_months",
    LAST_YEAR = "last_year",
    THIS_WEEK = "this_week",
    THIS_MONTH = "this_month",
    THIS_YEAR = "this_year"
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
export declare enum SizeRangePreset {
    TINY = "tiny",// < 10KB
    SMALL = "small",// 10KB - 100KB
    MEDIUM = "medium",// 100KB - 1MB
    LARGE = "large",// 1MB - 10MB
    HUGE = "huge"
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
export declare enum SearchAggregationType {
    TERMS = "terms",
    DATE_HISTOGRAM = "date_histogram",
    RANGE = "range",
    STATS = "stats"
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
    ranges?: Array<{
        from?: number;
        to?: number;
        key: string;
    }>;
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
    buckets?: Array<{
        key: string;
        count: number;
        from?: number;
        to?: number;
    }>;
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
export declare function getSavedSearchAttributes(): ModelAttributes;
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
export declare function getSavedSearchModelOptions(sequelize: Sequelize): Partial<ModelOptions>;
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
export declare function getSearchIndexSyncAttributes(): ModelAttributes;
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
export declare function getSearchIndexSyncModelOptions(sequelize: Sequelize): Partial<ModelOptions>;
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
export declare function buildSequelizeSearchWhere(searchQuery: MailSearchQuery): WhereOptions;
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
export declare function buildSequelizeSearchOrder(sort: SearchSort): Array<[string, string]>;
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
export declare function buildPostgresFullTextSearch(query: string, fields: SearchFieldType[]): WhereOptions;
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
export declare function parseAdvancedSearchQuery(queryString: string): MailSearchQuery;
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
export declare function parseDateRange(rangeString: string): DateRangeFilter;
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
export declare function resolveRelativeDateRange(relativeRange: RelativeDateRange): DateRangeFilter;
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
export declare function resolveSizeRangePreset(preset: SizeRangePreset): SizeRangeFilter;
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
export declare function getElasticSearchIndexMapping(): object;
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
export declare function buildElasticSearchQuery(searchQuery: MailSearchQuery): object;
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
export declare function buildElasticSearchAggregation(aggregation: SearchAggregation): object;
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
export declare function transformElasticSearchResponse(esResponse: any, searchQuery: MailSearchQuery): SearchResults;
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
export declare function extractSnippet(highlights: Record<string, string[]>, bodyText: string): string;
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
export declare function determineMatchedFields(highlights: Record<string, string[]>): SearchFieldType[];
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
export declare function indexMailMessage(document: SearchIndexDocument, searchClient: any): Promise<IndexSyncInfo>;
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
export declare function bulkIndexMessages(documents: SearchIndexDocument[], searchClient: any): Promise<IndexSyncInfo[]>;
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
export declare function removeFromSearchIndex(messageId: string, userId: string, searchClient: any): Promise<void>;
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
export declare function incrementalIndexUpdate(userId: string, since: Date, searchClient: any): Promise<number>;
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
export declare function rebuildSearchIndex(userId: string, searchClient: any): Promise<number>;
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
export declare function optimizeSearchIndex(userId: string, searchClient: any): Promise<void>;
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
export declare function getSearchSuggestions(prefix: string, userId: string, searchClient: any): Promise<SearchSuggestion[]>;
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
export declare function getPopularSearchTerms(userId: string, limit?: number): Promise<SearchSuggestion[]>;
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
export declare function getContactSuggestions(prefix: string, userId: string): Promise<SearchSuggestion[]>;
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
export declare function createSavedSearch(userId: string, name: string, query: MailSearchQuery, transaction?: Transaction): Promise<SavedSearch>;
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
export declare function updateSavedSearch(searchId: string, updates: Partial<SavedSearch>, transaction?: Transaction): Promise<SavedSearch>;
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
export declare function deleteSavedSearch(searchId: string, transaction?: Transaction): Promise<void>;
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
export declare function getSavedSearches(userId: string): Promise<SavedSearch[]>;
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
export declare function executeSavedSearch(searchId: string, searchClient: any): Promise<SearchResults>;
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
export declare function getSearchQueryProperty(): object;
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
export declare function getSearchFieldsProperty(): object;
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
export declare function getSearchOperatorProperty(): object;
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
export declare function getDateRangeFilterProperty(): object;
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
export declare function getSearchResultsResponse(): object;
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
export declare function getSavedSearchNameProperty(): object;
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
export declare function getAdvancedSearchRequestBody(): object;
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
export declare function validateSearchQuery(query: MailSearchQuery): {
    isValid: boolean;
    errors: string[];
};
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
export declare function trackSearchAnalytics(event: SearchAnalyticsEvent, transaction?: Transaction): Promise<void>;
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
export declare function getSearchPerformanceMetrics(userId: string | null, dateRange: DateRangeFilter): Promise<{
    totalSearches: number;
    avgSearchTime: number;
    minSearchTime: number;
    maxSearchTime: number;
    avgResultCount: number;
    slowQueries: number;
    errorRate: number;
}>;
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
export declare function cacheSearchResults(cacheKey: string, results: SearchResults, ttlSeconds?: number): Promise<void>;
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
export declare function getCachedSearchResults(cacheKey: string): Promise<SearchResults | null>;
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
export declare function generateSearchCacheKey(query: MailSearchQuery): string;
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
export declare function extractAttachmentText(attachmentData: Buffer, mimeType: string, filename: string): Promise<string>;
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
export declare function deduplicateSearchResults(results: SearchResultItem[]): SearchResultItem[];
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
export declare function mergeSearchResults(resultSets: SearchResultItem[][], sort: SearchSort): SearchResultItem[];
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
export declare function getSearchQueryHistory(userId: string, limit?: number): Promise<Array<{
    query: string;
    timestamp: Date;
    resultCount: number;
}>>;
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
export declare function clearSearchCache(userId: string | null): Promise<number>;
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
export declare function estimateSearchResultCount(query: MailSearchQuery, searchClient: any): Promise<number>;
//# sourceMappingURL=mail-search-indexing-kit.d.ts.map