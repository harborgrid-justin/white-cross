/**
 * LOC: SRCH1234567
 * File: /reuse/search-filter-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Elasticsearch client library
 *   - Sequelize ORM (search models)
 *   - Natural language processing libraries
 *   - Text analysis utilities
 *
 * DOWNSTREAM (imported by):
 *   - Search service implementations
 *   - API search endpoints
 *   - Auto-complete services
 *   - Search analytics dashboards
 */
/**
 * File: /reuse/search-filter-kit.ts
 * Locator: WC-UTL-SRCH-007
 * Purpose: Search & Filter Kit - Comprehensive search and filtering utility functions
 *
 * Upstream: Elasticsearch 8.x, Sequelize ORM, PostgreSQL full-text search, NLP libraries
 * Downstream: ../backend/*, ../services/search/*, API search endpoints, autocomplete services
 * Dependencies: TypeScript 5.x, Node 18+, Elasticsearch 8.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ utility functions for full-text search, fuzzy search, search indexing, query builders,
 *          faceted search, auto-complete, highlighting, relevance scoring, multi-field search,
 *          pagination, Elasticsearch integration, ranking, analytics, and spell checking
 *
 * LLM Context: Comprehensive search and filtering utilities for White Cross healthcare system.
 * Provides advanced full-text search, fuzzy matching, Elasticsearch integration, search indexing,
 * faceted navigation, auto-complete suggestions, search highlighting, relevance scoring algorithms,
 * multi-field searching, advanced filtering, cursor-based pagination, search result ranking,
 * search analytics tracking, typo tolerance, and spell checking. Essential for healthcare data
 * discovery with HIPAA-compliant search logging and patient data protection.
 */
import { Sequelize, Model, ModelStatic, FindOptions, Transaction } from 'sequelize';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
interface SearchOptions {
    query: string;
    fields?: string[];
    fuzzy?: boolean;
    fuzziness?: number;
    boost?: Record<string, number>;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
    highlight?: boolean;
    highlightTags?: {
        pre: string;
        post: string;
    };
    minScore?: number;
    sort?: Array<{
        field: string;
        order: 'asc' | 'desc';
    }>;
}
interface FacetConfig {
    field: string;
    label: string;
    type: 'term' | 'range' | 'date_range' | 'histogram';
    size?: number;
    ranges?: Array<{
        from?: number;
        to?: number;
        label: string;
    }>;
    interval?: number;
}
interface SearchResult<T = any> {
    hits: SearchHit<T>[];
    total: number;
    facets?: Record<string, FacetResult[]>;
    suggestions?: string[];
    took: number;
    maxScore?: number;
}
interface SearchHit<T = any> {
    id: string;
    score: number;
    data: T;
    highlights?: Record<string, string[]>;
    explanation?: any;
}
interface FacetResult {
    value: string | number;
    count: number;
    label?: string;
    selected?: boolean;
}
interface AutoCompleteOptions {
    prefix: string;
    field: string;
    size?: number;
    context?: Record<string, any>;
    fuzzy?: boolean;
}
interface SearchIndexConfig {
    indexName: string;
    mappings: Record<string, any>;
    settings?: Record<string, any>;
    aliases?: string[];
}
interface SearchAnalytics {
    query: string;
    resultCount: number;
    clickedResults?: string[];
    userId?: string;
    sessionId?: string;
    timestamp: Date;
    filters?: Record<string, any>;
    responseTime?: number;
}
interface RankingConfig {
    algorithm: 'bm25' | 'tfidf' | 'custom';
    weights?: Record<string, number>;
    boosts?: Record<string, number>;
    decayFunctions?: Array<{
        field: string;
        origin: string | number;
        scale: string | number;
        decay: number;
    }>;
}
interface SpellCheckResult {
    original: string;
    suggestions: Array<{
        text: string;
        score: number;
        frequency?: number;
    }>;
    corrected?: string;
}
interface FilterBuilder {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'between' | 'contains' | 'startsWith' | 'endsWith';
    value: any;
}
/**
 * Defines the SearchQuery model for tracking search history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} SearchQuery model
 *
 * @example
 * ```typescript
 * const SearchQuery = defineSearchQueryModel(sequelize);
 * await SearchQuery.create({
 *   query: 'patient records',
 *   userId: '123',
 *   resultCount: 45
 * });
 * ```
 */
export declare const defineSearchQueryModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Defines the SearchIndex model for managing search indexes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} SearchIndex model
 *
 * @example
 * ```typescript
 * const SearchIndex = defineSearchIndexModel(sequelize);
 * await SearchIndex.create({
 *   indexName: 'patients_v1',
 *   documentCount: 10000,
 *   status: 'active'
 * });
 * ```
 */
export declare const defineSearchIndexModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Defines the SearchHistory model for user search history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} SearchHistory model
 *
 * @example
 * ```typescript
 * const SearchHistory = defineSearchHistoryModel(sequelize);
 * await SearchHistory.create({
 *   userId: '123',
 *   query: 'medical records',
 *   frequency: 5
 * });
 * ```
 */
export declare const defineSearchHistoryModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Builds a PostgreSQL full-text search query using tsvector and tsquery.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Search options
 * @returns {FindOptions<T>} Sequelize query options
 *
 * @example
 * ```typescript
 * const results = await buildFullTextSearch(Patient, {
 *   query: 'diabetes insulin',
 *   fields: ['medicalHistory', 'conditions'],
 *   language: 'english',
 *   limit: 20
 * });
 * ```
 */
export declare const buildFullTextSearch: <T extends Model>(model: ModelStatic<T>, options: {
    query: string;
    fields: string[];
    language?: string;
    limit?: number;
    offset?: number;
    minRank?: number;
}) => FindOptions<T>;
/**
 * Performs a simple full-text search across multiple fields.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} searchTerm - Search term
 * @param {string[]} fields - Fields to search in
 * @param {object} options - Additional options
 * @returns {Promise<T[]>} Search results
 *
 * @example
 * ```typescript
 * const patients = await simpleFullTextSearch(
 *   Patient,
 *   'john diabetes',
 *   ['firstName', 'lastName', 'conditions'],
 *   { limit: 10 }
 * );
 * ```
 */
export declare const simpleFullTextSearch: <T extends Model>(model: ModelStatic<T>, searchTerm: string, fields: string[], options?: {
    limit?: number;
    offset?: number;
    caseSensitive?: boolean;
}) => Promise<T[]>;
/**
 * Creates a weighted full-text search across fields with different importance.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Weighted search options
 * @returns {FindOptions<T>} Sequelize query options
 *
 * @example
 * ```typescript
 * const results = await buildWeightedSearch(Patient, {
 *   query: 'cardiac',
 *   fieldWeights: { conditions: 1.0, symptoms: 0.7, notes: 0.5 },
 *   limit: 20
 * });
 * ```
 */
export declare const buildWeightedSearch: <T extends Model>(model: ModelStatic<T>, options: {
    query: string;
    fieldWeights: Record<string, number>;
    language?: string;
    limit?: number;
}) => FindOptions<T>;
/**
 * Performs fuzzy search using PostgreSQL's pg_trgm extension (trigram similarity).
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Fuzzy search options
 * @returns {Promise<T[]>} Fuzzy search results
 *
 * @example
 * ```typescript
 * const results = await fuzzySearch(Patient, {
 *   term: 'jhon doe',
 *   fields: ['firstName', 'lastName'],
 *   threshold: 0.3,
 *   limit: 10
 * });
 * ```
 */
export declare const fuzzySearch: <T extends Model>(model: ModelStatic<T>, options: {
    term: string;
    fields: string[];
    threshold?: number;
    limit?: number;
    offset?: number;
}) => Promise<T[]>;
/**
 * Calculates Levenshtein distance between two strings.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Levenshtein distance
 *
 * @example
 * ```typescript
 * const distance = levenshteinDistance('kitten', 'sitting'); // Returns 3
 * ```
 */
export declare const levenshteinDistance: (str1: string, str2: string) => number;
/**
 * Performs fuzzy matching with Levenshtein distance.
 *
 * @template T
 * @param {T[]} items - Items to search
 * @param {string} query - Search query
 * @param {function} extractor - Function to extract searchable text from items
 * @param {number} maxDistance - Maximum Levenshtein distance
 * @returns {Array} Matched items with scores
 *
 * @example
 * ```typescript
 * const results = fuzzyMatch(
 *   patients,
 *   'jhon',
 *   (p) => p.firstName,
 *   2
 * );
 * ```
 */
export declare const fuzzyMatch: <T>(items: T[], query: string, extractor: (item: T) => string, maxDistance?: number) => Array<{
    item: T;
    distance: number;
    score: number;
}>;
/**
 * Performs phonetic matching using Soundex or Metaphone algorithms.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {object} options - Phonetic search options
 * @returns {Promise<T[]>} Phonetically matched results
 *
 * @example
 * ```typescript
 * const results = await phoneticSearch(Patient, {
 *   term: 'smith',
 *   field: 'lastName',
 *   algorithm: 'soundex'
 * });
 * ```
 */
export declare const phoneticSearch: <T extends Model>(model: ModelStatic<T>, options: {
    term: string;
    field: string;
    algorithm?: "soundex" | "metaphone";
    limit?: number;
}) => Promise<T[]>;
/**
 * Creates an Elasticsearch index with specified mappings and settings.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {SearchIndexConfig} config - Index configuration
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await createSearchIndex(esClient, {
 *   indexName: 'patients_v1',
 *   mappings: {
 *     properties: {
 *       firstName: { type: 'text' },
 *       lastName: { type: 'text' }
 *     }
 *   }
 * });
 * ```
 */
export declare const createSearchIndex: (client: ElasticsearchClient, config: SearchIndexConfig) => Promise<boolean>;
/**
 * Bulk indexes documents into Elasticsearch.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Bulk indexing options
 * @returns {Promise<object>} Bulk indexing result
 *
 * @example
 * ```typescript
 * await bulkIndexDocuments(esClient, {
 *   indexName: 'patients',
 *   documents: patients.map(p => ({ id: p.id, ...p })),
 *   batchSize: 500
 * });
 * ```
 */
export declare const bulkIndexDocuments: (client: ElasticsearchClient, options: {
    indexName: string;
    documents: Array<{
        id: string;
        [key: string]: any;
    }>;
    batchSize?: number;
    refresh?: boolean;
}) => Promise<{
    indexed: number;
    errors: any[];
}>;
/**
 * Reindexes all documents from one index to another.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Reindex options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await reindexDocuments(esClient, {
 *   sourceIndex: 'patients_v1',
 *   destIndex: 'patients_v2',
 *   waitForCompletion: true
 * });
 * ```
 */
export declare const reindexDocuments: (client: ElasticsearchClient, options: {
    sourceIndex: string;
    destIndex: string;
    query?: any;
    waitForCompletion?: boolean;
}) => Promise<boolean>;
/**
 * Updates index mappings dynamically.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {string} indexName - Index name
 * @param {object} mappings - New mappings
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateIndexMappings(esClient, 'patients', {
 *   properties: {
 *     email: { type: 'keyword' }
 *   }
 * });
 * ```
 */
export declare const updateIndexMappings: (client: ElasticsearchClient, indexName: string, mappings: Record<string, any>) => Promise<boolean>;
/**
 * Builds an Elasticsearch query from search options.
 *
 * @param {SearchOptions} options - Search options
 * @returns {object} Elasticsearch query DSL
 *
 * @example
 * ```typescript
 * const query = buildElasticsearchQuery({
 *   query: 'diabetes',
 *   fields: ['conditions', 'symptoms'],
 *   fuzzy: true,
 *   filters: { status: 'active' }
 * });
 * ```
 */
export declare const buildElasticsearchQuery: (options: SearchOptions) => any;
/**
 * Builds a complex multi-match query with boosting.
 *
 * @param {object} options - Query options
 * @returns {object} Elasticsearch query
 *
 * @example
 * ```typescript
 * const query = buildBoostedQuery({
 *   query: 'cardiac',
 *   fieldBoosts: { conditions: 3, symptoms: 2, notes: 1 },
 *   fuzzy: true
 * });
 * ```
 */
export declare const buildBoostedQuery: (options: {
    query: string;
    fieldBoosts: Record<string, number>;
    fuzzy?: boolean;
    operator?: "and" | "or";
}) => any;
/**
 * Builds a compound query with multiple conditions.
 *
 * @param {object} options - Compound query options
 * @returns {object} Elasticsearch compound query
 *
 * @example
 * ```typescript
 * const query = buildCompoundQuery({
 *   must: [{ match: { status: 'active' } }],
 *   should: [{ match: { priority: 'high' } }],
 *   mustNot: [{ match: { deleted: true } }],
 *   minimumShouldMatch: 1
 * });
 * ```
 */
export declare const buildCompoundQuery: (options: {
    must?: any[];
    should?: any[];
    mustNot?: any[];
    filter?: any[];
    minimumShouldMatch?: number;
}) => any;
/**
 * Builds faceted search aggregations for Elasticsearch.
 *
 * @param {FacetConfig[]} facets - Facet configurations
 * @returns {object} Elasticsearch aggregations
 *
 * @example
 * ```typescript
 * const aggs = buildFacetAggregations([
 *   { field: 'department', label: 'Department', type: 'term', size: 10 },
 *   { field: 'age', label: 'Age Range', type: 'range', ranges: [
 *     { to: 18, label: 'Child' },
 *     { from: 18, to: 65, label: 'Adult' },
 *     { from: 65, label: 'Senior' }
 *   ]}
 * ]);
 * ```
 */
export declare const buildFacetAggregations: (facets: FacetConfig[]) => any;
/**
 * Parses Elasticsearch aggregation results into facet results.
 *
 * @param {any} aggregations - Elasticsearch aggregation results
 * @param {FacetConfig[]} configs - Facet configurations
 * @returns {Record<string, FacetResult[]>} Parsed facet results
 *
 * @example
 * ```typescript
 * const facets = parseFacetResults(
 *   esResponse.aggregations,
 *   facetConfigs
 * );
 * ```
 */
export declare const parseFacetResults: (aggregations: any, configs: FacetConfig[]) => Record<string, FacetResult[]>;
/**
 * Applies facet filters to an Elasticsearch query.
 *
 * @param {any} query - Base query
 * @param {Record<string, any>} facetFilters - Selected facet filters
 * @returns {any} Query with facet filters applied
 *
 * @example
 * ```typescript
 * const filteredQuery = applyFacetFilters(baseQuery, {
 *   department: ['cardiology', 'neurology'],
 *   status: 'active'
 * });
 * ```
 */
export declare const applyFacetFilters: (query: any, facetFilters: Record<string, any>) => any;
/**
 * Builds an auto-complete query using edge n-grams.
 *
 * @param {AutoCompleteOptions} options - Auto-complete options
 * @returns {object} Elasticsearch auto-complete query
 *
 * @example
 * ```typescript
 * const query = buildAutoCompleteQuery({
 *   prefix: 'diab',
 *   field: 'conditions',
 *   size: 5
 * });
 * ```
 */
export declare const buildAutoCompleteQuery: (options: AutoCompleteOptions) => any;
/**
 * Generates search suggestions using completion suggester.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Suggestion options
 * @returns {Promise<string[]>} Suggestion results
 *
 * @example
 * ```typescript
 * const suggestions = await generateSuggestions(esClient, {
 *   indexName: 'patients',
 *   field: 'conditions',
 *   prefix: 'diab',
 *   size: 5
 * });
 * ```
 */
export declare const generateSuggestions: (client: ElasticsearchClient, options: {
    indexName: string;
    field: string;
    prefix: string;
    size?: number;
    fuzzy?: boolean;
}) => Promise<string[]>;
/**
 * Generates "Did you mean?" suggestions using term suggester.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Suggestion options
 * @returns {Promise<string[]>} Correction suggestions
 *
 * @example
 * ```typescript
 * const corrections = await generateDidYouMean(esClient, {
 *   indexName: 'patients',
 *   field: 'conditions',
 *   text: 'diabetis',
 *   size: 3
 * });
 * ```
 */
export declare const generateDidYouMean: (client: ElasticsearchClient, options: {
    indexName: string;
    field: string;
    text: string;
    size?: number;
}) => Promise<string[]>;
/**
 * Builds a phrase suggester query for multi-word corrections.
 *
 * @param {string} text - Text to correct
 * @param {object} options - Phrase suggester options
 * @returns {object} Elasticsearch phrase suggester query
 *
 * @example
 * ```typescript
 * const suggester = buildPhraseSuggester('diabetis melitus', {
 *   field: 'conditions',
 *   size: 3,
 *   confidence: 1.0
 * });
 * ```
 */
export declare const buildPhraseSuggester: (text: string, options: {
    field: string;
    size?: number;
    confidence?: number;
    gramSize?: number;
}) => any;
/**
 * Builds highlighting configuration for search results.
 *
 * @param {object} options - Highlighting options
 * @returns {object} Elasticsearch highlighting configuration
 *
 * @example
 * ```typescript
 * const highlight = buildHighlightConfig({
 *   fields: ['title', 'description'],
 *   preTags: ['<mark>'],
 *   postTags: ['</mark>'],
 *   fragmentSize: 150
 * });
 * ```
 */
export declare const buildHighlightConfig: (options: {
    fields: string[];
    preTags?: string[];
    postTags?: string[];
    fragmentSize?: number;
    numberOfFragments?: number;
}) => any;
/**
 * Extracts and formats highlighted snippets from search results.
 *
 * @param {any} hit - Elasticsearch hit result
 * @returns {Record<string, string[]>} Formatted highlights
 *
 * @example
 * ```typescript
 * const highlights = extractHighlights(esHit);
 * // Returns: { title: ['Result with <em>keyword</em>'], ... }
 * ```
 */
export declare const extractHighlights: (hit: any) => Record<string, string[]>;
/**
 * Applies custom highlighting to text based on search terms.
 *
 * @param {string} text - Text to highlight
 * @param {string[]} terms - Terms to highlight
 * @param {object} tags - HTML tags for highlighting
 * @returns {string} Highlighted text
 *
 * @example
 * ```typescript
 * const highlighted = highlightText(
 *   'Patient has diabetes',
 *   ['diabetes'],
 *   { pre: '<mark>', post: '</mark>' }
 * );
 * ```
 */
export declare const highlightText: (text: string, terms: string[], tags?: {
    pre: string;
    post: string;
}) => string;
/**
 * Builds a custom scoring function with field boosting.
 *
 * @param {object} options - Scoring options
 * @returns {object} Elasticsearch function score query
 *
 * @example
 * ```typescript
 * const query = buildCustomScoring({
 *   query: baseQuery,
 *   fieldBoosts: { title: 3, description: 2 },
 *   decayFunction: {
 *     field: 'createdAt',
 *     origin: 'now',
 *     scale: '30d',
 *     decay: 0.5
 *   }
 * });
 * ```
 */
export declare const buildCustomScoring: (options: {
    query: any;
    fieldBoosts?: Record<string, number>;
    decayFunction?: {
        field: string;
        origin: string | number;
        scale: string | number;
        decay: number;
    };
    scriptScore?: string;
}) => any;
/**
 * Calculates BM25 relevance score manually.
 *
 * @param {object} params - BM25 parameters
 * @returns {number} BM25 score
 *
 * @example
 * ```typescript
 * const score = calculateBM25Score({
 *   termFreq: 3,
 *   docFreq: 10,
 *   docLength: 100,
 *   avgDocLength: 80,
 *   totalDocs: 1000,
 *   k1: 1.2,
 *   b: 0.75
 * });
 * ```
 */
export declare const calculateBM25Score: (params: {
    termFreq: number;
    docFreq: number;
    docLength: number;
    avgDocLength: number;
    totalDocs: number;
    k1?: number;
    b?: number;
}) => number;
/**
 * Applies time-based decay to search scores.
 *
 * @param {number} score - Base relevance score
 * @param {Date} documentDate - Document date
 * @param {object} options - Decay options
 * @returns {number} Decayed score
 *
 * @example
 * ```typescript
 * const decayedScore = applyTimeDecay(8.5, documentDate, {
 *   scale: 30, // 30 days
 *   decay: 0.5,
 *   offset: 7 // 7 day grace period
 * });
 * ```
 */
export declare const applyTimeDecay: (score: number, documentDate: Date, options: {
    scale: number;
    decay: number;
    offset?: number;
}) => number;
/**
 * Performs multi-field search with independent field scoring.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Multi-field search options
 * @returns {Promise<SearchResult>} Search results
 *
 * @example
 * ```typescript
 * const results = await multiFieldSearch(esClient, {
 *   indexName: 'patients',
 *   query: 'diabetes',
 *   fields: [
 *     { name: 'conditions', boost: 3 },
 *     { name: 'symptoms', boost: 2 },
 *     { name: 'notes', boost: 1 }
 *   ]
 * });
 * ```
 */
export declare const multiFieldSearch: (client: ElasticsearchClient, options: {
    indexName: string;
    query: string;
    fields: Array<{
        name: string;
        boost?: number;
        analyzer?: string;
    }>;
    filters?: Record<string, any>;
    limit?: number;
}) => Promise<SearchResult>;
/**
 * Builds a cross-fields multi-match query.
 *
 * @param {object} options - Cross-field query options
 * @returns {object} Elasticsearch cross-fields query
 *
 * @example
 * ```typescript
 * const query = buildCrossFieldsQuery({
 *   query: 'john smith',
 *   fields: ['firstName', 'lastName'],
 *   operator: 'and'
 * });
 * ```
 */
export declare const buildCrossFieldsQuery: (options: {
    query: string;
    fields: string[];
    operator?: "and" | "or";
    tieBreaker?: number;
}) => any;
/**
 * Builds advanced filters from filter builder array.
 *
 * @param {FilterBuilder[]} filters - Filter definitions
 * @returns {any} Elasticsearch filter query
 *
 * @example
 * ```typescript
 * const filters = buildAdvancedFilters([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'in', value: ['active', 'pending'] },
 *   { field: 'name', operator: 'contains', value: 'john' }
 * ]);
 * ```
 */
export declare const buildAdvancedFilters: (filters: FilterBuilder[]) => any;
/**
 * Applies date range filters to a query.
 *
 * @param {any} query - Base query
 * @param {object} dateRange - Date range configuration
 * @returns {any} Query with date filters
 *
 * @example
 * ```typescript
 * const filtered = applyDateRangeFilter(query, {
 *   field: 'createdAt',
 *   from: '2024-01-01',
 *   to: '2024-12-31',
 *   format: 'yyyy-MM-dd'
 * });
 * ```
 */
export declare const applyDateRangeFilter: (query: any, dateRange: {
    field: string;
    from?: string | Date;
    to?: string | Date;
    format?: string;
}) => any;
/**
 * Builds cursor-based pagination for large result sets.
 *
 * @param {object} options - Pagination options
 * @returns {object} Elasticsearch search_after query
 *
 * @example
 * ```typescript
 * const query = buildCursorPagination({
 *   size: 20,
 *   searchAfter: [1234567890, 'abc123'],
 *   sort: [{ createdAt: 'desc' }, { _id: 'asc' }]
 * });
 * ```
 */
export declare const buildCursorPagination: (options: {
    size: number;
    searchAfter?: any[];
    sort: Array<Record<string, "asc" | "desc">>;
}) => any;
/**
 * Extracts cursor value from the last search result.
 *
 * @param {any[]} hits - Elasticsearch hits
 * @returns {any[] | null} Cursor value for next page
 *
 * @example
 * ```typescript
 * const cursor = extractCursor(results.hits);
 * // Use cursor in next request
 * ```
 */
export declare const extractCursor: (hits: any[]) => any[] | null;
/**
 * Builds scroll-based pagination for export/batch processing.
 *
 * @param {ElasticsearchClient} client - Elasticsearch client
 * @param {object} options - Scroll options
 * @returns {Promise<AsyncIterableIterator<any>>} Async iterator of results
 *
 * @example
 * ```typescript
 * for await (const batch of scrollSearch(esClient, {
 *   indexName: 'patients',
 *   query: { match_all: {} },
 *   scrollTime: '5m',
 *   batchSize: 1000
 * })) {
 *   // Process batch
 * }
 * ```
 */
export declare const scrollSearch: (client: ElasticsearchClient, options: {
    indexName: string;
    query: any;
    scrollTime?: string;
    batchSize?: number;
}) => AsyncIterableIterator<any[]>;
/**
 * Re-ranks search results using a custom algorithm.
 *
 * @template T
 * @param {SearchHit<T>[]} hits - Original search hits
 * @param {RankingConfig} config - Ranking configuration
 * @returns {SearchHit<T>[]} Re-ranked results
 *
 * @example
 * ```typescript
 * const ranked = rerankResults(searchHits, {
 *   algorithm: 'custom',
 *   weights: { relevance: 0.7, recency: 0.3 },
 *   boosts: { isPriority: 2.0 }
 * });
 * ```
 */
export declare const rerankResults: <T>(hits: SearchHit<T>[], config: RankingConfig) => SearchHit<T>[];
/**
 * Applies personalization to search results based on user profile.
 *
 * @template T
 * @param {SearchHit<T>[]} hits - Search hits
 * @param {object} userProfile - User profile for personalization
 * @returns {SearchHit<T>[]} Personalized results
 *
 * @example
 * ```typescript
 * const personalized = personalizeResults(searchHits, {
 *   preferences: { department: 'cardiology' },
 *   history: ['item1', 'item2'],
 *   boostFactor: 1.5
 * });
 * ```
 */
export declare const personalizeResults: <T>(hits: SearchHit<T>[], userProfile: {
    preferences?: Record<string, any>;
    history?: string[];
    boostFactor?: number;
}) => SearchHit<T>[];
/**
 * Tracks search query analytics.
 *
 * @param {ModelStatic<Model>} SearchQueryModel - SearchQuery model
 * @param {SearchAnalytics} analytics - Analytics data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created analytics record
 *
 * @example
 * ```typescript
 * await trackSearchAnalytics(SearchQuery, {
 *   query: 'diabetes',
 *   resultCount: 45,
 *   userId: '123',
 *   sessionId: 'abc',
 *   timestamp: new Date(),
 *   responseTime: 150
 * });
 * ```
 */
export declare const trackSearchAnalytics: (SearchQueryModel: ModelStatic<Model>, analytics: SearchAnalytics, transaction?: Transaction) => Promise<Model>;
/**
 * Gets popular search queries.
 *
 * @param {ModelStatic<Model>} SearchQueryModel - SearchQuery model
 * @param {object} options - Query options
 * @returns {Promise<any[]>} Popular queries
 *
 * @example
 * ```typescript
 * const popular = await getPopularSearches(SearchQuery, {
 *   limit: 10,
 *   timeRange: 7, // days
 *   minCount: 5
 * });
 * ```
 */
export declare const getPopularSearches: (SearchQueryModel: ModelStatic<Model>, options?: {
    limit?: number;
    timeRange?: number;
    minCount?: number;
}) => Promise<any[]>;
/**
 * Calculates search click-through rate (CTR).
 *
 * @param {ModelStatic<Model>} SearchQueryModel - SearchQuery model
 * @param {object} options - CTR calculation options
 * @returns {Promise<number>} Click-through rate (0-1)
 *
 * @example
 * ```typescript
 * const ctr = await calculateSearchCTR(SearchQuery, {
 *   userId: '123',
 *   timeRange: 7
 * });
 * ```
 */
export declare const calculateSearchCTR: (SearchQueryModel: ModelStatic<Model>, options?: {
    userId?: string;
    timeRange?: number;
}) => Promise<number>;
/**
 * Performs spell checking on search query.
 *
 * @param {string} query - Search query
 * @param {string[]} dictionary - Dictionary of valid terms
 * @param {number} maxDistance - Maximum edit distance
 * @returns {SpellCheckResult} Spell check result
 *
 * @example
 * ```typescript
 * const result = spellCheck('diabetis', medicalTerms, 2);
 * // Returns: { original: 'diabetis', suggestions: [{ text: 'diabetes', score: 0.9 }] }
 * ```
 */
export declare const spellCheck: (query: string, dictionary: string[], maxDistance?: number) => SpellCheckResult;
/**
 * Builds a typo-tolerant search query using fuzzy matching.
 *
 * @param {string} query - Search query
 * @param {object} options - Typo tolerance options
 * @returns {object} Elasticsearch fuzzy query
 *
 * @example
 * ```typescript
 * const query = buildTypoTolerantQuery('diabetis', {
 *   fields: ['conditions', 'diagnosis'],
 *   fuzziness: 'AUTO',
 *   prefixLength: 2
 * });
 * ```
 */
export declare const buildTypoTolerantQuery: (query: string, options: {
    fields: string[];
    fuzziness?: "AUTO" | number;
    prefixLength?: number;
    maxExpansions?: number;
}) => any;
/**
 * Generates query corrections using n-gram analysis.
 *
 * @param {string} query - Search query
 * @param {string[]} corpus - Corpus of valid queries
 * @param {number} ngramSize - N-gram size
 * @returns {string[]} Query corrections
 *
 * @example
 * ```typescript
 * const corrections = generateQueryCorrections(
 *   'diabetis melitus',
 *   previousQueries,
 *   2
 * );
 * ```
 */
export declare const generateQueryCorrections: (query: string, corpus: string[], ngramSize?: number) => string[];
/**
 * Generates n-grams from text.
 *
 * @param {string} text - Input text
 * @param {number} n - N-gram size
 * @returns {string[]} Array of n-grams
 *
 * @example
 * ```typescript
 * const ngrams = generateNgrams('diabetes', 2);
 * // Returns: ['di', 'ia', 'ab', 'be', 'et', 'te', 'es']
 * ```
 */
export declare const generateNgrams: (text: string, n: number) => string[];
/**
 * Normalizes search query for consistent matching.
 *
 * @param {string} query - Search query
 * @param {object} options - Normalization options
 * @returns {string} Normalized query
 *
 * @example
 * ```typescript
 * const normalized = normalizeSearchQuery('  DiAbEtEs   Type-2 ', {
 *   lowercase: true,
 *   removeSpecialChars: true,
 *   removeDuplicateSpaces: true
 * });
 * // Returns: 'diabetes type 2'
 * ```
 */
export declare const normalizeSearchQuery: (query: string, options?: {
    lowercase?: boolean;
    removeSpecialChars?: boolean;
    removeDuplicateSpaces?: boolean;
    stemming?: boolean;
}) => string;
export {};
//# sourceMappingURL=search-filter-kit.d.ts.map