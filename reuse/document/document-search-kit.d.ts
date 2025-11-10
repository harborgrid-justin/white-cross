/**
 * LOC: DOC-SEARCH-001
 * File: /reuse/document/document-search-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @elastic/elasticsearch (v8.x)
 *   - pg-search (PostgreSQL full-text)
 *   - lunr (v2.x - client-side search)
 *   - natural (NLP library)
 *
 * DOWNSTREAM (imported by):
 *   - Document search controllers
 *   - Medical records search services
 *   - Document discovery modules
 *   - Analytics and reporting services
 */
/**
 * File: /reuse/document/document-search-kit.ts
 * Locator: WC-UTL-DOCSEARCH-001
 * Purpose: Document Search & Indexing Kit - Comprehensive full-text search and indexing utilities
 *
 * Upstream: sequelize, Elasticsearch client, PostgreSQL full-text, Lunr, natural NLP
 * Downstream: Search APIs, document discovery, medical records search, reporting, analytics
 * Dependencies: Sequelize 6.x, Elasticsearch 8.x, TypeScript 5.x, Node 18+, PostgreSQL 14+
 * Exports: 45 utility functions for full-text search, indexing, query building, faceted search, analytics
 *
 * LLM Context: Production-grade document search utilities for White Cross healthcare platform.
 * Provides full-text search across documents, Elasticsearch integration for advanced queries,
 * PostgreSQL full-text search fallback, fuzzy matching, autocomplete, search highlighting,
 * faceted navigation, relevance ranking, search analytics, and HIPAA-compliant search logging.
 * Essential for medical record discovery and document retrieval in healthcare applications.
 */
import { Sequelize, WhereOptions, FindOptions } from 'sequelize';
/**
 * Search query configuration
 */
export interface SearchQuery {
    query: string;
    fields?: string[];
    filters?: SearchFilter[];
    facets?: string[];
    sort?: SortOption[];
    page?: number;
    pageSize?: number;
    highlight?: boolean;
    fuzzy?: boolean;
    boost?: Record<string, number>;
    operator?: 'AND' | 'OR';
}
/**
 * Search filter
 */
export interface SearchFilter {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'range' | 'in' | 'exists';
    value: any;
    boost?: number;
}
/**
 * Sort option
 */
export interface SortOption {
    field: string;
    order: 'asc' | 'desc';
    mode?: 'min' | 'max' | 'sum' | 'avg' | 'median';
}
/**
 * Search result
 */
export interface SearchResult<T = any> {
    hits: SearchHit<T>[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    facets?: SearchFacet[];
    aggregations?: SearchAggregation[];
    took: number;
    maxScore?: number;
}
/**
 * Search hit (individual result)
 */
export interface SearchHit<T = any> {
    id: string;
    score: number;
    source: T;
    highlights?: Record<string, string[]>;
    explanation?: SearchExplanation;
    sort?: any[];
}
/**
 * Search facet
 */
export interface SearchFacet {
    field: string;
    buckets: FacetBucket[];
    missing?: number;
}
/**
 * Facet bucket
 */
export interface FacetBucket {
    key: string;
    count: number;
    selected?: boolean;
}
/**
 * Search aggregation
 */
export interface SearchAggregation {
    name: string;
    type: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'terms' | 'date_histogram';
    value?: number;
    buckets?: AggregationBucket[];
}
/**
 * Aggregation bucket
 */
export interface AggregationBucket {
    key: string | number;
    count: number;
    value?: number;
}
/**
 * Search explanation (scoring details)
 */
export interface SearchExplanation {
    value: number;
    description: string;
    details?: SearchExplanation[];
}
/**
 * Document index configuration
 */
export interface IndexConfig {
    name: string;
    mappings: IndexMapping;
    settings?: IndexSettings;
    aliases?: string[];
}
/**
 * Index mapping
 */
export interface IndexMapping {
    properties: Record<string, FieldMapping>;
    dynamic?: boolean | 'strict';
}
/**
 * Field mapping
 */
export interface FieldMapping {
    type: 'text' | 'keyword' | 'date' | 'integer' | 'long' | 'float' | 'boolean' | 'object' | 'nested';
    analyzer?: string;
    searchAnalyzer?: string;
    boost?: number;
    index?: boolean;
    store?: boolean;
    fields?: Record<string, FieldMapping>;
}
/**
 * Index settings
 */
export interface IndexSettings {
    numberOfShards?: number;
    numberOfReplicas?: number;
    refreshInterval?: string;
    maxResultWindow?: number;
    analysis?: AnalysisSettings;
}
/**
 * Analysis settings (tokenizers, filters)
 */
export interface AnalysisSettings {
    analyzer?: Record<string, any>;
    tokenizer?: Record<string, any>;
    filter?: Record<string, any>;
}
/**
 * Autocomplete suggestion
 */
export interface AutocompleteSuggestion {
    text: string;
    score: number;
    highlight?: string;
    category?: string;
    metadata?: Record<string, any>;
}
/**
 * Search analytics entry
 */
export interface SearchAnalyticsEntry {
    id: string;
    userId?: string;
    query: string;
    filters: SearchFilter[];
    resultsCount: number;
    clickedResults: string[];
    executionTime: number;
    timestamp: Date;
    sessionId?: string;
    metadata?: Record<string, any>;
}
/**
 * Fuzzy search options
 */
export interface FuzzyOptions {
    fuzziness?: number | 'AUTO';
    prefixLength?: number;
    maxExpansions?: number;
    transpositions?: boolean;
}
/**
 * Highlighting options
 */
export interface HighlightOptions {
    fields: string[];
    preTag?: string;
    postTag?: string;
    fragmentSize?: number;
    numberOfFragments?: number;
    requireFieldMatch?: boolean;
}
/**
 * Bulk index operation
 */
export interface BulkIndexOperation {
    index: string;
    id?: string;
    document: any;
    action?: 'index' | 'create' | 'update' | 'delete';
}
/**
 * Index statistics
 */
export interface IndexStatistics {
    name: string;
    documentCount: number;
    sizeInBytes: number;
    lastUpdated: Date;
    health: 'green' | 'yellow' | 'red';
    shards: {
        total: number;
        successful: number;
        failed: number;
    };
}
/**
 * Search index attributes
 */
export interface SearchIndexAttributes {
    id: string;
    documentId: string;
    indexName: string;
    content: string;
    metadata: Record<string, any>;
    searchVector: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Search history attributes
 */
export interface SearchHistoryAttributes {
    id: string;
    userId?: string;
    query: string;
    filters: any;
    resultsCount: number;
    executionTime: number;
    clickedResults: string[];
    sessionId?: string;
    createdAt: Date;
}
/**
 * Search suggestion attributes
 */
export interface SearchSuggestionAttributes {
    id: string;
    term: string;
    frequency: number;
    category?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates SearchIndex model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SearchIndexAttributes>>} SearchIndex model
 *
 * @example
 * ```typescript
 * const SearchIndexModel = createSearchIndexModel(sequelize);
 * await SearchIndexModel.create({
 *   documentId: 'doc-123',
 *   indexName: 'medical_records',
 *   content: 'Patient diagnosis and treatment plan',
 *   metadata: { department: 'cardiology' }
 * });
 * ```
 */
export declare const createSearchIndexModel: (sequelize: Sequelize) => any;
/**
 * Creates SearchHistory model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SearchHistoryAttributes>>} SearchHistory model
 *
 * @example
 * ```typescript
 * const HistoryModel = createSearchHistoryModel(sequelize);
 * await HistoryModel.create({
 *   userId: 'user-123',
 *   query: 'diabetes treatment',
 *   resultsCount: 45,
 *   executionTime: 120
 * });
 * ```
 */
export declare const createSearchHistoryModel: (sequelize: Sequelize) => any;
/**
 * Creates SearchSuggestion model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SearchSuggestionAttributes>>} SearchSuggestion model
 *
 * @example
 * ```typescript
 * const SuggestionModel = createSearchSuggestionModel(sequelize);
 * await SuggestionModel.create({
 *   term: 'hypertension',
 *   frequency: 150,
 *   category: 'diagnosis'
 * });
 * ```
 */
export declare const createSearchSuggestionModel: (sequelize: Sequelize) => any;
/**
 * 1. Performs full-text search using PostgreSQL.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} query - Search query
 * @param {SearchQuery} [options] - Search options
 * @returns {Promise<SearchResult>} Search results
 *
 * @example
 * ```typescript
 * const results = await fullTextSearch(SearchIndexModel, 'diabetes treatment', {
 *   filters: [{ field: 'metadata.department', operator: 'equals', value: 'endocrinology' }],
 *   page: 1,
 *   pageSize: 20
 * });
 * ```
 */
export declare const fullTextSearch: (SearchIndexModel: any, query: string, options?: SearchQuery) => Promise<SearchResult>;
/**
 * 2. Builds filter condition from SearchFilter.
 *
 * @param {SearchFilter} filter - Filter to build
 * @returns {WhereOptions} Sequelize where condition
 *
 * @example
 * ```typescript
 * const condition = buildFilterCondition({
 *   field: 'metadata.status',
 *   operator: 'equals',
 *   value: 'active'
 * });
 * ```
 */
export declare const buildFilterCondition: (filter: SearchFilter) => WhereOptions;
/**
 * 3. Generates search highlights.
 *
 * @param {string} content - Content to highlight
 * @param {string} query - Search query
 * @returns {Record<string, string[]>} Highlighted fragments
 *
 * @example
 * ```typescript
 * const highlights = generateHighlights(documentContent, 'diabetes treatment');
 * ```
 */
export declare const generateHighlights: (content: string, query: string) => Record<string, string[]>;
/**
 * 4. Indexes document for full-text search.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} documentId - Document ID
 * @param {string} content - Document content
 * @param {Record<string, any>} metadata - Document metadata
 * @param {string} indexName - Index name
 * @returns {Promise<any>} Created index record
 *
 * @example
 * ```typescript
 * await indexDocument(SearchIndexModel, 'doc-123', content, metadata, 'medical_records');
 * ```
 */
export declare const indexDocument: (SearchIndexModel: any, documentId: string, content: string, metadata: Record<string, any>, indexName?: string) => Promise<any>;
/**
 * 5. Updates document index.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} documentId - Document ID
 * @param {Partial<SearchIndexAttributes>} updates - Updates to apply
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDocumentIndex(SearchIndexModel, 'doc-123', {
 *   content: updatedContent,
 *   metadata: updatedMetadata
 * });
 * ```
 */
export declare const updateDocumentIndex: (SearchIndexModel: any, documentId: string, updates: Partial<SearchIndexAttributes>) => Promise<void>;
/**
 * 6. Deletes document from index.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteDocumentFromIndex(SearchIndexModel, 'doc-123');
 * ```
 */
export declare const deleteDocumentFromIndex: (SearchIndexModel: any, documentId: string) => Promise<void>;
/**
 * 7. Rebuilds search index for all documents.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {any} DocumentModel - Document model
 * @returns {Promise<number>} Number of documents indexed
 *
 * @example
 * ```typescript
 * const indexed = await rebuildSearchIndex(SearchIndexModel, DocumentModel);
 * console.log(`Indexed ${indexed} documents`);
 * ```
 */
export declare const rebuildSearchIndex: (SearchIndexModel: any, DocumentModel: any) => Promise<number>;
/**
 * 8. Creates Elasticsearch client.
 *
 * @param {any} config - Elasticsearch configuration
 * @returns {any} Elasticsearch client
 *
 * @example
 * ```typescript
 * const esClient = createElasticsearchClient({
 *   node: 'http://localhost:9200',
 *   auth: { username: 'elastic', password: 'password' }
 * });
 * ```
 */
export declare const createElasticsearchClient: (config: any) => any;
/**
 * 9. Searches documents using Elasticsearch.
 *
 * @param {any} esClient - Elasticsearch client
 * @param {string} indexName - Index name
 * @param {SearchQuery} query - Search query
 * @returns {Promise<SearchResult>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchWithElasticsearch(client, 'medical_records', {
 *   query: 'diabetes',
 *   filters: [{ field: 'department', operator: 'equals', value: 'endocrinology' }],
 *   fuzzy: true
 * });
 * ```
 */
export declare const searchWithElasticsearch: (esClient: any, indexName: string, query: SearchQuery) => Promise<SearchResult>;
/**
 * 10. Builds Elasticsearch query DSL.
 *
 * @param {SearchQuery} query - Search query options
 * @returns {any} Elasticsearch query object
 *
 * @example
 * ```typescript
 * const esQuery = buildElasticsearchQuery({
 *   query: 'diabetes',
 *   fuzzy: true,
 *   fields: ['title', 'content']
 * });
 * ```
 */
export declare const buildElasticsearchQuery: (query: SearchQuery) => any;
/**
 * 11. Builds Elasticsearch filter from SearchFilter.
 *
 * @param {SearchFilter} filter - Filter to build
 * @returns {any} Elasticsearch filter object
 *
 * @example
 * ```typescript
 * const esFilter = buildElasticsearchFilter({
 *   field: 'status',
 *   operator: 'equals',
 *   value: 'active'
 * });
 * ```
 */
export declare const buildElasticsearchFilter: (filter: SearchFilter) => any;
/**
 * 12. Indexes document in Elasticsearch.
 *
 * @param {any} esClient - Elasticsearch client
 * @param {string} indexName - Index name
 * @param {string} documentId - Document ID
 * @param {any} document - Document to index
 * @returns {Promise<any>} Index response
 *
 * @example
 * ```typescript
 * await indexDocumentInElasticsearch(client, 'medical_records', 'doc-123', {
 *   title: 'Patient Record',
 *   content: 'Medical history...'
 * });
 * ```
 */
export declare const indexDocumentInElasticsearch: (esClient: any, indexName: string, documentId: string, document: any) => Promise<any>;
/**
 * 13. Bulk indexes documents in Elasticsearch.
 *
 * @param {any} esClient - Elasticsearch client
 * @param {BulkIndexOperation[]} operations - Bulk operations
 * @returns {Promise<any>} Bulk response
 *
 * @example
 * ```typescript
 * await bulkIndexElasticsearch(client, [
 *   { index: 'docs', id: '1', document: doc1, action: 'index' },
 *   { index: 'docs', id: '2', document: doc2, action: 'index' }
 * ]);
 * ```
 */
export declare const bulkIndexElasticsearch: (esClient: any, operations: BulkIndexOperation[]) => Promise<any>;
/**
 * 14. Creates Elasticsearch index.
 *
 * @param {any} esClient - Elasticsearch client
 * @param {IndexConfig} config - Index configuration
 * @returns {Promise<any>} Create response
 *
 * @example
 * ```typescript
 * await createElasticsearchIndex(client, {
 *   name: 'medical_records',
 *   mappings: {
 *     properties: {
 *       title: { type: 'text' },
 *       content: { type: 'text', analyzer: 'standard' }
 *     }
 *   }
 * });
 * ```
 */
export declare const createElasticsearchIndex: (esClient: any, config: IndexConfig) => Promise<any>;
/**
 * 15. Deletes Elasticsearch index.
 *
 * @param {any} esClient - Elasticsearch client
 * @param {string} indexName - Index name
 * @returns {Promise<any>} Delete response
 *
 * @example
 * ```typescript
 * await deleteElasticsearchIndex(client, 'old_index');
 * ```
 */
export declare const deleteElasticsearchIndex: (esClient: any, indexName: string) => Promise<any>;
/**
 * 16. Searches documents by metadata.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {Record<string, any>} metadata - Metadata filters
 * @param {FindOptions} [options] - Query options
 * @returns {Promise<any[]>} Matching documents
 *
 * @example
 * ```typescript
 * const docs = await searchByMetadata(SearchIndexModel, {
 *   department: 'cardiology',
 *   status: 'active'
 * });
 * ```
 */
export declare const searchByMetadata: (SearchIndexModel: any, metadata: Record<string, any>, options?: FindOptions) => Promise<any[]>;
/**
 * 17. Searches with complex metadata queries.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {any} metadataQuery - JSONB query object
 * @returns {Promise<any[]>} Matching documents
 *
 * @example
 * ```typescript
 * const docs = await searchMetadataComplex(SearchIndexModel, {
 *   tags: { contains: ['urgent', 'review'] },
 *   priority: { gte: 5 }
 * });
 * ```
 */
export declare const searchMetadataComplex: (SearchIndexModel: any, metadataQuery: any) => Promise<any[]>;
/**
 * 18. Aggregates metadata fields.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} field - Metadata field to aggregate
 * @returns {Promise<Array<{ value: string; count: number }>>} Aggregation results
 *
 * @example
 * ```typescript
 * const deptCounts = await aggregateMetadataField(SearchIndexModel, 'department');
 * ```
 */
export declare const aggregateMetadataField: (SearchIndexModel: any, field: string) => Promise<Array<{
    value: string;
    count: number;
}>>;
/**
 * 19. Performs fuzzy search.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} query - Search query
 * @param {FuzzyOptions} options - Fuzzy options
 * @returns {Promise<SearchResult>} Fuzzy search results
 *
 * @example
 * ```typescript
 * const results = await fuzzySearch(SearchIndexModel, 'diabetis', {
 *   fuzziness: 2,
 *   maxExpansions: 50
 * });
 * ```
 */
export declare const fuzzySearch: (SearchIndexModel: any, query: string, options?: FuzzyOptions) => Promise<SearchResult>;
/**
 * 20. Generates autocomplete suggestions.
 *
 * @param {any} SearchSuggestionModel - SearchSuggestion model
 * @param {string} prefix - Query prefix
 * @param {number} limit - Max suggestions
 * @returns {Promise<AutocompleteSuggestion[]>} Suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await autocomplete(SuggestionModel, 'diab', 10);
 * ```
 */
export declare const autocomplete: (SearchSuggestionModel: any, prefix: string, limit?: number) => Promise<AutocompleteSuggestion[]>;
/**
 * 21. Updates suggestion frequency.
 *
 * @param {any} SearchSuggestionModel - SearchSuggestion model
 * @param {string} term - Search term
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSuggestionFrequency(SuggestionModel, 'diabetes');
 * ```
 */
export declare const updateSuggestionFrequency: (SearchSuggestionModel: any, term: string) => Promise<void>;
/**
 * 22. Generates phrase suggestions (did you mean).
 *
 * @param {string} query - Original query
 * @param {any} SearchSuggestionModel - SearchSuggestion model
 * @returns {Promise<string[]>} Suggested phrases
 *
 * @example
 * ```typescript
 * const suggestions = await generatePhraseSuggestions('diabetis treatment', SuggestionModel);
 * // Returns: ['diabetes treatment']
 * ```
 */
export declare const generatePhraseSuggestions: (query: string, SearchSuggestionModel: any) => Promise<string[]>;
/**
 * 23. Performs faceted search with aggregations.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {SearchQuery} query - Search query
 * @param {string[]} facetFields - Fields to facet on
 * @returns {Promise<SearchResult>} Results with facets
 *
 * @example
 * ```typescript
 * const results = await facetedSearch(SearchIndexModel, {
 *   query: 'treatment',
 * }, ['metadata.department', 'metadata.status']);
 * ```
 */
export declare const facetedSearch: (SearchIndexModel: any, query: SearchQuery, facetFields: string[]) => Promise<SearchResult>;
/**
 * 24. Applies facet filters to search.
 *
 * @param {SearchQuery} query - Base query
 * @param {Record<string, string[]>} selectedFacets - Selected facet values
 * @returns {SearchQuery} Query with facet filters
 *
 * @example
 * ```typescript
 * const filtered = applyFacetFilters(baseQuery, {
 *   'metadata.department': ['cardiology', 'neurology']
 * });
 * ```
 */
export declare const applyFacetFilters: (query: SearchQuery, selectedFacets: Record<string, string[]>) => SearchQuery;
/**
 * 25. Generates facet tree (hierarchical facets).
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} field - Hierarchical field
 * @returns {Promise<any[]>} Facet tree
 *
 * @example
 * ```typescript
 * const tree = await generateFacetTree(SearchIndexModel, 'metadata.category');
 * ```
 */
export declare const generateFacetTree: (SearchIndexModel: any, field: string) => Promise<any[]>;
/**
 * 26. Builds multi-field query.
 *
 * @param {string} query - Search query
 * @param {string[]} fields - Fields to search
 * @param {Record<string, number>} boost - Field boost values
 * @returns {any} Multi-field query object
 *
 * @example
 * ```typescript
 * const query = buildMultiFieldQuery('diabetes', ['title', 'content'], {
 *   title: 2.0,
 *   content: 1.0
 * });
 * ```
 */
export declare const buildMultiFieldQuery: (query: string, fields: string[], boost?: Record<string, number>) => any;
/**
 * 27. Builds boolean query with multiple conditions.
 *
 * @param {any[]} must - Must conditions
 * @param {any[]} should - Should conditions
 * @param {any[]} mustNot - Must not conditions
 * @returns {any} Boolean query object
 *
 * @example
 * ```typescript
 * const query = buildBooleanQuery(
 *   [{ match: { content: 'diabetes' } }],
 *   [{ match: { tags: 'urgent' } }],
 *   [{ term: { status: 'archived' } }]
 * );
 * ```
 */
export declare const buildBooleanQuery: (must: any[], should: any[], mustNot: any[]) => any;
/**
 * 28. Builds range query.
 *
 * @param {string} field - Field name
 * @param {any} from - Range start
 * @param {any} to - Range end
 * @returns {any} Range query object
 *
 * @example
 * ```typescript
 * const query = buildRangeQuery('createdAt', '2024-01-01', '2024-12-31');
 * ```
 */
export declare const buildRangeQuery: (field: string, from: any, to: any) => any;
/**
 * 29. Builds geospatial query.
 *
 * @param {string} field - Location field
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} distance - Distance (e.g., '10km')
 * @returns {any} Geo distance query
 *
 * @example
 * ```typescript
 * const query = buildGeoQuery('location', 40.7128, -74.0060, '5km');
 * ```
 */
export declare const buildGeoQuery: (field: string, lat: number, lon: number, distance: string) => any;
/**
 * 30. Builds nested query for complex structures.
 *
 * @param {string} path - Nested path
 * @param {any} query - Query for nested documents
 * @returns {any} Nested query object
 *
 * @example
 * ```typescript
 * const query = buildNestedQuery('comments', {
 *   match: { 'comments.text': 'excellent' }
 * });
 * ```
 */
export declare const buildNestedQuery: (path: string, query: any) => any;
/**
 * 31. Logs search query for analytics.
 *
 * @param {any} SearchHistoryModel - SearchHistory model
 * @param {SearchAnalyticsEntry} entry - Analytics entry
 * @returns {Promise<any>} Created history record
 *
 * @example
 * ```typescript
 * await logSearchQuery(HistoryModel, {
 *   userId: 'user-123',
 *   query: 'diabetes treatment',
 *   resultsCount: 45,
 *   executionTime: 120,
 *   clickedResults: [],
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const logSearchQuery: (SearchHistoryModel: any, entry: SearchAnalyticsEntry) => Promise<any>;
/**
 * 32. Retrieves popular search terms.
 *
 * @param {any} SearchHistoryModel - SearchHistory model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} limit - Max terms
 * @returns {Promise<Array<{ query: string; count: number }>>} Popular queries
 *
 * @example
 * ```typescript
 * const popular = await getPopularSearchTerms(HistoryModel, startDate, endDate, 20);
 * ```
 */
export declare const getPopularSearchTerms: (SearchHistoryModel: any, startDate: Date, endDate: Date, limit?: number) => Promise<Array<{
    query: string;
    count: number;
}>>;
/**
 * 33. Analyzes search performance.
 *
 * @param {any} SearchHistoryModel - SearchHistory model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Performance statistics
 *
 * @example
 * ```typescript
 * const stats = await analyzeSearchPerformance(HistoryModel, startDate, endDate);
 * ```
 */
export declare const analyzeSearchPerformance: (SearchHistoryModel: any, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 34. Tracks search result clicks.
 *
 * @param {any} SearchHistoryModel - SearchHistory model
 * @param {string} historyId - Search history ID
 * @param {string} resultId - Clicked result ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackSearchClick(HistoryModel, 'history-123', 'doc-456');
 * ```
 */
export declare const trackSearchClick: (SearchHistoryModel: any, historyId: string, resultId: string) => Promise<void>;
/**
 * 35. Generates search analytics report.
 *
 * @param {any} SearchHistoryModel - SearchHistory model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateSearchAnalyticsReport(HistoryModel, startDate, endDate);
 * ```
 */
export declare const generateSearchAnalyticsReport: (SearchHistoryModel: any, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 36. Optimizes search index.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await optimizeSearchIndex(SearchIndexModel);
 * ```
 */
export declare const optimizeSearchIndex: (SearchIndexModel: any) => Promise<void>;
/**
 * 37. Retrieves index statistics.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @returns {Promise<IndexStatistics>} Index statistics
 *
 * @example
 * ```typescript
 * const stats = await getIndexStatistics(SearchIndexModel);
 * ```
 */
export declare const getIndexStatistics: (SearchIndexModel: any) => Promise<IndexStatistics>;
/**
 * 38. Reindexes specific documents.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {any} DocumentModel - Document model
 * @param {string[]} documentIds - Document IDs to reindex
 * @returns {Promise<number>} Number reindexed
 *
 * @example
 * ```typescript
 * await reindexDocuments(SearchIndexModel, DocumentModel, ['doc-1', 'doc-2']);
 * ```
 */
export declare const reindexDocuments: (SearchIndexModel: any, DocumentModel: any, documentIds: string[]) => Promise<number>;
/**
 * 39. Cleans up orphaned index entries.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {any} DocumentModel - Document model
 * @returns {Promise<number>} Number cleaned up
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupOrphanedIndexes(SearchIndexModel, DocumentModel);
 * ```
 */
export declare const cleanupOrphanedIndexes: (SearchIndexModel: any, DocumentModel: any) => Promise<number>;
/**
 * 40. Exports search index to JSON.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} indexName - Index name
 * @returns {Promise<any[]>} Exported documents
 *
 * @example
 * ```typescript
 * const exported = await exportSearchIndex(SearchIndexModel, 'medical_records');
 * ```
 */
export declare const exportSearchIndex: (SearchIndexModel: any, indexName: string) => Promise<any[]>;
/**
 * 41. Suggests query corrections.
 *
 * @param {string} query - Original query
 * @param {any} SearchSuggestionModel - SearchSuggestion model
 * @returns {Promise<string[]>} Suggested corrections
 *
 * @example
 * ```typescript
 * const corrections = await suggestQueryCorrections('diabetis', SuggestionModel);
 * ```
 */
export declare const suggestQueryCorrections: (query: string, SearchSuggestionModel: any) => Promise<string[]>;
/**
 * 42. Expands query with synonyms.
 *
 * @param {string} query - Original query
 * @param {Record<string, string[]>} synonyms - Synonym dictionary
 * @returns {string} Expanded query
 *
 * @example
 * ```typescript
 * const expanded = expandQueryWithSynonyms('heart attack', {
 *   'heart attack': ['myocardial infarction', 'MI']
 * });
 * ```
 */
export declare const expandQueryWithSynonyms: (query: string, synonyms: Record<string, string[]>) => string;
/**
 * 43. Performs relevance feedback search.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} originalQuery - Original query
 * @param {string[]} relevantDocIds - Relevant document IDs
 * @returns {Promise<SearchResult>} Refined search results
 *
 * @example
 * ```typescript
 * const refined = await relevanceFeedbackSearch(
 *   SearchIndexModel,
 *   'diabetes',
 *   ['doc-1', 'doc-3', 'doc-5']
 * );
 * ```
 */
export declare const relevanceFeedbackSearch: (SearchIndexModel: any, originalQuery: string, relevantDocIds: string[]) => Promise<SearchResult>;
/**
 * 44. Searches similar documents.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string} documentId - Reference document ID
 * @param {number} limit - Max similar documents
 * @returns {Promise<SearchResult>} Similar documents
 *
 * @example
 * ```typescript
 * const similar = await searchSimilarDocuments(SearchIndexModel, 'doc-123', 10);
 * ```
 */
export declare const searchSimilarDocuments: (SearchIndexModel: any, documentId: string, limit?: number) => Promise<SearchResult>;
/**
 * 45. Performs batch search across multiple queries.
 *
 * @param {any} SearchIndexModel - SearchIndex model
 * @param {string[]} queries - Array of queries
 * @returns {Promise<SearchResult[]>} Results for each query
 *
 * @example
 * ```typescript
 * const batchResults = await batchSearch(SearchIndexModel, [
 *   'diabetes',
 *   'hypertension',
 *   'asthma'
 * ]);
 * ```
 */
export declare const batchSearch: (SearchIndexModel: any, queries: string[]) => Promise<SearchResult[]>;
declare const _default: {
    fullTextSearch: (SearchIndexModel: any, query: string, options?: SearchQuery) => Promise<SearchResult>;
    buildFilterCondition: (filter: SearchFilter) => WhereOptions;
    generateHighlights: (content: string, query: string) => Record<string, string[]>;
    indexDocument: (SearchIndexModel: any, documentId: string, content: string, metadata: Record<string, any>, indexName?: string) => Promise<any>;
    updateDocumentIndex: (SearchIndexModel: any, documentId: string, updates: Partial<SearchIndexAttributes>) => Promise<void>;
    deleteDocumentFromIndex: (SearchIndexModel: any, documentId: string) => Promise<void>;
    rebuildSearchIndex: (SearchIndexModel: any, DocumentModel: any) => Promise<number>;
    createElasticsearchClient: (config: any) => any;
    searchWithElasticsearch: (esClient: any, indexName: string, query: SearchQuery) => Promise<SearchResult>;
    buildElasticsearchQuery: (query: SearchQuery) => any;
    buildElasticsearchFilter: (filter: SearchFilter) => any;
    indexDocumentInElasticsearch: (esClient: any, indexName: string, documentId: string, document: any) => Promise<any>;
    bulkIndexElasticsearch: (esClient: any, operations: BulkIndexOperation[]) => Promise<any>;
    createElasticsearchIndex: (esClient: any, config: IndexConfig) => Promise<any>;
    deleteElasticsearchIndex: (esClient: any, indexName: string) => Promise<any>;
    searchByMetadata: (SearchIndexModel: any, metadata: Record<string, any>, options?: FindOptions) => Promise<any[]>;
    searchMetadataComplex: (SearchIndexModel: any, metadataQuery: any) => Promise<any[]>;
    aggregateMetadataField: (SearchIndexModel: any, field: string) => Promise<Array<{
        value: string;
        count: number;
    }>>;
    fuzzySearch: (SearchIndexModel: any, query: string, options?: FuzzyOptions) => Promise<SearchResult>;
    autocomplete: (SearchSuggestionModel: any, prefix: string, limit?: number) => Promise<AutocompleteSuggestion[]>;
    updateSuggestionFrequency: (SearchSuggestionModel: any, term: string) => Promise<void>;
    generatePhraseSuggestions: (query: string, SearchSuggestionModel: any) => Promise<string[]>;
    facetedSearch: (SearchIndexModel: any, query: SearchQuery, facetFields: string[]) => Promise<SearchResult>;
    applyFacetFilters: (query: SearchQuery, selectedFacets: Record<string, string[]>) => SearchQuery;
    generateFacetTree: (SearchIndexModel: any, field: string) => Promise<any[]>;
    buildMultiFieldQuery: (query: string, fields: string[], boost?: Record<string, number>) => any;
    buildBooleanQuery: (must: any[], should: any[], mustNot: any[]) => any;
    buildRangeQuery: (field: string, from: any, to: any) => any;
    buildGeoQuery: (field: string, lat: number, lon: number, distance: string) => any;
    buildNestedQuery: (path: string, query: any) => any;
    logSearchQuery: (SearchHistoryModel: any, entry: SearchAnalyticsEntry) => Promise<any>;
    getPopularSearchTerms: (SearchHistoryModel: any, startDate: Date, endDate: Date, limit?: number) => Promise<Array<{
        query: string;
        count: number;
    }>>;
    analyzeSearchPerformance: (SearchHistoryModel: any, startDate: Date, endDate: Date) => Promise<any>;
    trackSearchClick: (SearchHistoryModel: any, historyId: string, resultId: string) => Promise<void>;
    generateSearchAnalyticsReport: (SearchHistoryModel: any, startDate: Date, endDate: Date) => Promise<any>;
    optimizeSearchIndex: (SearchIndexModel: any) => Promise<void>;
    getIndexStatistics: (SearchIndexModel: any) => Promise<IndexStatistics>;
    reindexDocuments: (SearchIndexModel: any, DocumentModel: any, documentIds: string[]) => Promise<number>;
    cleanupOrphanedIndexes: (SearchIndexModel: any, DocumentModel: any) => Promise<number>;
    exportSearchIndex: (SearchIndexModel: any, indexName: string) => Promise<any[]>;
    suggestQueryCorrections: (query: string, SearchSuggestionModel: any) => Promise<string[]>;
    expandQueryWithSynonyms: (query: string, synonyms: Record<string, string[]>) => string;
    relevanceFeedbackSearch: (SearchIndexModel: any, originalQuery: string, relevantDocIds: string[]) => Promise<SearchResult>;
    searchSimilarDocuments: (SearchIndexModel: any, documentId: string, limit?: number) => Promise<SearchResult>;
    batchSearch: (SearchIndexModel: any, queries: string[]) => Promise<SearchResult[]>;
    createSearchIndexModel: (sequelize: Sequelize) => any;
    createSearchHistoryModel: (sequelize: Sequelize) => any;
    createSearchSuggestionModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-search-kit.d.ts.map