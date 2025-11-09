/**
 * LOC: SEARCH_INDEX_PROD_001
 * File: /reuse/search-indexing-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @elastic/elasticsearch
 *   - @opensearch-project/opensearch
 *   - sequelize-typescript
 *   - sequelize
 *   - zod
 *   - pg (PostgreSQL full-text search)
 *
 * DOWNSTREAM (imported by):
 *   - Search services
 *   - Indexing services
 *   - Search controllers
 *   - Content management systems
 *   - Product catalogs
 *   - Document search
 */
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { Sequelize } from 'sequelize';
import { z } from 'zod';
/**
 * Supported search engine types
 */
export declare enum SearchEngine {
    ELASTICSEARCH = "elasticsearch",
    OPENSEARCH = "opensearch",
    ALGOLIA = "algolia",
    MEILISEARCH = "meilisearch",
    TYPESENSE = "typesense"
}
/**
 * Search query types supported by Elasticsearch/OpenSearch
 */
export declare enum SearchQueryType {
    MATCH = "match",
    MATCH_PHRASE = "match_phrase",
    MATCH_PHRASE_PREFIX = "match_phrase_prefix",
    MULTI_MATCH = "multi_match",
    QUERY_STRING = "query_string",
    SIMPLE_QUERY_STRING = "simple_query_string",
    BOOL = "bool",
    TERM = "term",
    TERMS = "terms",
    RANGE = "range",
    PREFIX = "prefix",
    WILDCARD = "wildcard",
    FUZZY = "fuzzy",
    REGEXP = "regexp",
    EXISTS = "exists",
    NESTED = "nested",
    GEO_DISTANCE = "geo_distance",
    GEO_BOUNDING_BOX = "geo_bounding_box",
    GEO_POLYGON = "geo_polygon"
}
/**
 * Aggregation types for faceted search and analytics
 */
export declare enum AggregationType {
    TERMS = "terms",
    DATE_HISTOGRAM = "date_histogram",
    HISTOGRAM = "histogram",
    RANGE = "range",
    DATE_RANGE = "date_range",
    STATS = "stats",
    EXTENDED_STATS = "extended_stats",
    CARDINALITY = "cardinality",
    AVG = "avg",
    SUM = "sum",
    MIN = "min",
    MAX = "max",
    PERCENTILES = "percentiles",
    NESTED = "nested",
    REVERSE_NESTED = "reverse_nested",
    FILTER = "filter",
    GEO_DISTANCE = "geo_distance",
    GEO_HASH_GRID = "geohash_grid"
}
/**
 * Facet types for faceted search
 */
export declare enum FacetType {
    SINGLE_SELECT = "single_select",
    MULTI_SELECT = "multi_select",
    RANGE = "range",
    HIERARCHICAL = "hierarchical",
    NESTED = "nested"
}
/**
 * Search result sort order
 */
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
/**
 * Highlight fragment types
 */
export declare enum HighlightFragmenter {
    SIMPLE = "simple",
    SPAN = "span"
}
/**
 * Search engine client configuration
 */
export interface SearchEngineConfig {
    engine: SearchEngine;
    nodes: string[];
    username?: string;
    password?: string;
    apiKey?: string;
    cloudId?: string;
    maxRetries?: number;
    requestTimeout?: number;
    sniffOnStart?: boolean;
    sniffInterval?: number;
    ssl?: {
        rejectUnauthorized?: boolean;
        ca?: string;
        cert?: string;
        key?: string;
    };
}
/**
 * Index mapping field types
 */
export interface IndexFieldMapping {
    type: 'text' | 'keyword' | 'long' | 'integer' | 'short' | 'byte' | 'double' | 'float' | 'date' | 'boolean' | 'geo_point' | 'geo_shape' | 'nested' | 'object';
    analyzer?: string;
    searchAnalyzer?: string;
    fields?: Record<string, Partial<IndexFieldMapping>>;
    format?: string;
    index?: boolean;
    store?: boolean;
    enabled?: boolean;
    properties?: Record<string, IndexFieldMapping>;
}
/**
 * Index mapping configuration
 */
export interface IndexMapping {
    properties: Record<string, IndexFieldMapping>;
    dynamicTemplates?: Array<Record<string, any>>;
    dynamic?: boolean | 'strict';
    _source?: {
        enabled: boolean;
        includes?: string[];
        excludes?: string[];
    };
}
/**
 * Index settings configuration
 */
export interface IndexSettings {
    numberOfShards?: number;
    numberOfReplicas?: number;
    refreshInterval?: string;
    maxResultWindow?: number;
    analysis?: {
        analyzer?: Record<string, any>;
        tokenizer?: Record<string, any>;
        filter?: Record<string, any>;
        charFilter?: Record<string, any>;
    };
}
/**
 * Search query filter
 */
export interface SearchFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'exists' | 'range';
    value?: any;
    values?: any[];
    from?: any;
    to?: any;
}
/**
 * Search query options
 */
export interface SearchQueryOptions {
    query: string;
    fields?: string[];
    filters?: SearchFilter[];
    sort?: Array<{
        field: string;
        order: SortOrder;
    }>;
    from?: number;
    size?: number;
    highlight?: HighlightOptions;
    aggregations?: Record<string, AggregationConfig>;
    minScore?: number;
    trackTotalHits?: boolean;
    timeout?: string;
    _source?: boolean | string[];
    boosts?: Record<string, number>;
}
/**
 * Highlight options for search results
 */
export interface HighlightOptions {
    fields: string[];
    preTags?: string[];
    postTags?: string[];
    fragmentSize?: number;
    numberOfFragments?: number;
    fragmenter?: HighlightFragmenter;
    requireFieldMatch?: boolean;
    encoder?: 'default' | 'html';
}
/**
 * Aggregation configuration
 */
export interface AggregationConfig {
    type: AggregationType;
    field?: string;
    size?: number;
    interval?: string | number;
    ranges?: Array<{
        from?: number;
        to?: number;
        key?: string;
    }>;
    missing?: any;
    minDocCount?: number;
    order?: Record<string, SortOrder>;
    nestedPath?: string;
    subAggregations?: Record<string, AggregationConfig>;
}
/**
 * Search result document
 */
export interface SearchResultDocument<T = any> {
    id: string;
    score: number;
    source: T;
    highlight?: Record<string, string[]>;
    sort?: any[];
    innerHits?: Record<string, SearchResults<any>>;
}
/**
 * Aggregation bucket
 */
export interface AggregationBucket {
    key: string | number;
    docCount: number;
    subAggregations?: Record<string, AggregationResult>;
}
/**
 * Aggregation result
 */
export interface AggregationResult {
    buckets?: AggregationBucket[];
    value?: number;
    values?: Record<string, number>;
    sum?: number;
    count?: number;
    min?: number;
    max?: number;
    avg?: number;
}
/**
 * Search results container
 */
export interface SearchResults<T = any> {
    total: number;
    maxScore: number;
    took: number;
    documents: SearchResultDocument<T>[];
    aggregations?: Record<string, AggregationResult>;
    suggestions?: SearchSuggestion[];
}
/**
 * Search suggestion
 */
export interface SearchSuggestion {
    text: string;
    offset: number;
    length: number;
    options: Array<{
        text: string;
        score: number;
        freq?: number;
    }>;
}
/**
 * Facet definition
 */
export interface FacetDefinition {
    name: string;
    field: string;
    type: FacetType;
    label?: string;
    size?: number;
    order?: SortOrder;
    ranges?: Array<{
        from?: number;
        to?: number;
        label: string;
    }>;
    nestedPath?: string;
}
/**
 * Facet value
 */
export interface FacetValue {
    value: string | number;
    label?: string;
    count: number;
    selected?: boolean;
}
/**
 * Facet result
 */
export interface FacetResult {
    name: string;
    label: string;
    type: FacetType;
    values: FacetValue[];
}
/**
 * Geospatial query types
 */
export interface GeoQuery {
    type: 'geo_distance' | 'geo_bounding_box' | 'geo_polygon';
    field: string;
    distance?: string;
    point?: {
        lat: number;
        lon: number;
    };
    topLeft?: {
        lat: number;
        lon: number;
    };
    bottomRight?: {
        lat: number;
        lon: number;
    };
    points?: Array<{
        lat: number;
        lon: number;
    }>;
}
/**
 * Bulk operation types
 */
export declare enum BulkOperationType {
    INDEX = "index",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
/**
 * Bulk operation item
 */
export interface BulkOperation {
    type: BulkOperationType;
    id?: string;
    document?: any;
    routing?: string;
}
/**
 * Bulk operation result
 */
export interface BulkOperationResult {
    took: number;
    errors: boolean;
    items: Array<{
        index?: {
            _id: string;
            status: number;
            error?: any;
        };
        create?: {
            _id: string;
            status: number;
            error?: any;
        };
        update?: {
            _id: string;
            status: number;
            error?: any;
        };
        delete?: {
            _id: string;
            status: number;
            error?: any;
        };
    }>;
    successful: number;
    failed: number;
}
/**
 * Search engine configuration schema
 */
export declare const SearchEngineConfigSchema: any;
/**
 * Search filter schema
 */
export declare const SearchFilterSchema: any;
/**
 * Highlight options schema
 */
export declare const HighlightOptionsSchema: any;
/**
 * Search query options schema
 */
export declare const SearchQueryOptionsSchema: any;
/**
 * Aggregation configuration schema
 */
export declare const AggregationConfigSchema: z.ZodType<AggregationConfig>;
/**
 * Geo query schema
 */
export declare const GeoQuerySchema: any;
/**
 * Bulk operation schema
 */
export declare const BulkOperationSchema: any;
/**
 * Index mapping schema
 */
export declare const IndexMappingSchema: any;
/**
 * Create Elasticsearch client with configuration
 *
 * @param config - Search engine configuration
 * @returns Configured Elasticsearch client instance
 * @throws BadRequestException if configuration is invalid
 *
 * @example
 * ```typescript
 * const client = createElasticsearchClient({
 *   engine: SearchEngine.ELASTICSEARCH,
 *   nodes: ['https://localhost:9200'],
 *   username: 'elastic',
 *   password: 'changeme',
 * });
 * ```
 */
export declare function createElasticsearchClient(config: SearchEngineConfig): ElasticsearchClient;
/**
 * Create OpenSearch client with configuration
 *
 * @param config - Search engine configuration
 * @returns Configured OpenSearch client instance
 * @throws BadRequestException if configuration is invalid
 *
 * @example
 * ```typescript
 * const client = createOpenSearchClient({
 *   engine: SearchEngine.OPENSEARCH,
 *   nodes: ['https://localhost:9200'],
 *   username: 'admin',
 *   password: 'admin',
 * });
 * ```
 */
export declare function createOpenSearchClient(config: SearchEngineConfig): OpenSearchClient;
/**
 * Test search engine connection and health
 *
 * @param client - Elasticsearch or OpenSearch client
 * @returns Promise<boolean> - True if connection is healthy
 * @throws InternalServerErrorException if connection fails
 *
 * @example
 * ```typescript
 * const isHealthy = await testSearchEngineConnection(client);
 * if (isHealthy) {
 *   console.log('Search engine is healthy');
 * }
 * ```
 */
export declare function testSearchEngineConnection(client: ElasticsearchClient | OpenSearchClient): Promise<boolean>;
/**
 * Get cluster health status
 *
 * @param client - Elasticsearch or OpenSearch client
 * @returns Cluster health information
 * @throws InternalServerErrorException if request fails
 *
 * @example
 * ```typescript
 * const health = await getClusterHealth(client);
 * console.log('Cluster status:', health.status); // 'green', 'yellow', 'red'
 * console.log('Number of nodes:', health.number_of_nodes);
 * ```
 */
export declare function getClusterHealth(client: ElasticsearchClient | OpenSearchClient): Promise<any>;
/**
 * Get cluster statistics
 *
 * @param client - Elasticsearch or OpenSearch client
 * @returns Cluster statistics including indices, nodes, shards
 * @throws InternalServerErrorException if request fails
 *
 * @example
 * ```typescript
 * const stats = await getClusterStats(client);
 * console.log('Total indices:', stats.indices.count);
 * console.log('Total documents:', stats.indices.docs.count);
 * ```
 */
export declare function getClusterStats(client: ElasticsearchClient | OpenSearchClient): Promise<any>;
/**
 * Create search index with mappings and settings
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Name of the index to create
 * @param mapping - Index field mappings
 * @param settings - Index settings (shards, replicas, analysis)
 * @returns Promise<void>
 * @throws BadRequestException if index already exists
 * @throws InternalServerErrorException if creation fails
 *
 * @example
 * ```typescript
 * await createSearchIndex(client, 'patients', {
 *   properties: {
 *     name: { type: 'text', analyzer: 'standard' },
 *     email: { type: 'keyword' },
 *     age: { type: 'integer' },
 *     location: { type: 'geo_point' },
 *   },
 * }, {
 *   numberOfShards: 3,
 *   numberOfReplicas: 2,
 * });
 * ```
 */
export declare function createSearchIndex(client: ElasticsearchClient | OpenSearchClient, indexName: string, mapping: IndexMapping, settings?: IndexSettings): Promise<void>;
/**
 * Delete search index
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Name of the index to delete
 * @returns Promise<void>
 * @throws NotFoundException if index doesn't exist
 * @throws InternalServerErrorException if deletion fails
 *
 * @example
 * ```typescript
 * await deleteSearchIndex(client, 'old-patients-index');
 * ```
 */
export declare function deleteSearchIndex(client: ElasticsearchClient | OpenSearchClient, indexName: string): Promise<void>;
/**
 * Update index mapping (add new fields)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Name of the index to update
 * @param mapping - New or updated field mappings
 * @returns Promise<void>
 * @throws NotFoundException if index doesn't exist
 * @throws InternalServerErrorException if update fails
 *
 * @example
 * ```typescript
 * await updateIndexMapping(client, 'patients', {
 *   properties: {
 *     phoneNumber: { type: 'keyword' },
 *     emergencyContact: {
 *       type: 'object',
 *       properties: {
 *         name: { type: 'text' },
 *         phone: { type: 'keyword' },
 *       },
 *     },
 *   },
 * });
 * ```
 */
export declare function updateIndexMapping(client: ElasticsearchClient | OpenSearchClient, indexName: string, mapping: IndexMapping): Promise<void>;
/**
 * Reindex documents from source to destination index
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param sourceIndex - Source index name
 * @param destIndex - Destination index name
 * @param query - Optional query to filter documents
 * @returns Promise with task information
 * @throws NotFoundException if source index doesn't exist
 * @throws InternalServerErrorException if reindex fails
 *
 * @example
 * ```typescript
 * const result = await reindexDocuments(client, 'patients-v1', 'patients-v2', {
 *   match: { status: 'active' },
 * });
 * console.log('Reindexed:', result.total);
 * ```
 */
export declare function reindexDocuments(client: ElasticsearchClient | OpenSearchClient, sourceIndex: string, destIndex: string, query?: any): Promise<any>;
/**
 * Create index alias
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name to alias
 * @param aliasName - Alias name
 * @returns Promise<void>
 * @throws NotFoundException if index doesn't exist
 * @throws InternalServerErrorException if alias creation fails
 *
 * @example
 * ```typescript
 * await createIndexAlias(client, 'patients-2024-01', 'patients-current');
 * // Now you can search 'patients-current' which points to 'patients-2024-01'
 * ```
 */
export declare function createIndexAlias(client: ElasticsearchClient | OpenSearchClient, indexName: string, aliasName: string): Promise<void>;
/**
 * Delete index alias
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param aliasName - Alias name to delete
 * @returns Promise<void>
 * @throws InternalServerErrorException if deletion fails
 *
 * @example
 * ```typescript
 * await deleteIndexAlias(client, 'patients-2024-01', 'patients-current');
 * ```
 */
export declare function deleteIndexAlias(client: ElasticsearchClient | OpenSearchClient, indexName: string, aliasName: string): Promise<void>;
/**
 * Get index settings
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @returns Index settings object
 * @throws NotFoundException if index doesn't exist
 * @throws InternalServerErrorException if request fails
 *
 * @example
 * ```typescript
 * const settings = await getIndexSettings(client, 'patients');
 * console.log('Shards:', settings.number_of_shards);
 * console.log('Replicas:', settings.number_of_replicas);
 * ```
 */
export declare function getIndexSettings(client: ElasticsearchClient | OpenSearchClient, indexName: string): Promise<any>;
/**
 * Update index settings
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param settings - Settings to update
 * @returns Promise<void>
 * @throws NotFoundException if index doesn't exist
 * @throws InternalServerErrorException if update fails
 *
 * @example
 * ```typescript
 * await updateIndexSettings(client, 'patients', {
 *   numberOfReplicas: 3,
 *   refreshInterval: '30s',
 * });
 * ```
 */
export declare function updateIndexSettings(client: ElasticsearchClient | OpenSearchClient, indexName: string, settings: Partial<IndexSettings>): Promise<void>;
/**
 * Index a single document
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param documentId - Document ID (optional, will be auto-generated if not provided)
 * @param document - Document to index
 * @returns Promise with indexed document ID
 * @throws InternalServerErrorException if indexing fails
 *
 * @example
 * ```typescript
 * const id = await indexDocument(client, 'patients', 'patient-123', {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   age: 35,
 *   status: 'active',
 * });
 * console.log('Indexed with ID:', id);
 * ```
 */
export declare function indexDocument(client: ElasticsearchClient | OpenSearchClient, indexName: string, documentId: string | undefined, document: any): Promise<string>;
/**
 * Bulk index multiple documents
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param operations - Array of bulk operations
 * @returns Bulk operation result with success/failure counts
 * @throws InternalServerErrorException if bulk operation fails
 *
 * @example
 * ```typescript
 * const result = await bulkIndexDocuments(client, 'patients', [
 *   { type: BulkOperationType.INDEX, id: '1', document: { name: 'John' } },
 *   { type: BulkOperationType.INDEX, id: '2', document: { name: 'Jane' } },
 *   { type: BulkOperationType.DELETE, id: '3' },
 * ]);
 * console.log('Successful:', result.successful);
 * console.log('Failed:', result.failed);
 * ```
 */
export declare function bulkIndexDocuments(client: ElasticsearchClient | OpenSearchClient, indexName: string, operations: BulkOperation[]): Promise<BulkOperationResult>;
/**
 * Update an existing document
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param documentId - Document ID
 * @param partialDocument - Partial document with fields to update
 * @returns Promise<void>
 * @throws NotFoundException if document doesn't exist
 * @throws InternalServerErrorException if update fails
 *
 * @example
 * ```typescript
 * await updateDocument(client, 'patients', 'patient-123', {
 *   age: 36,
 *   lastUpdated: new Date(),
 * });
 * ```
 */
export declare function updateDocument(client: ElasticsearchClient | OpenSearchClient, indexName: string, documentId: string, partialDocument: any): Promise<void>;
/**
 * Delete a document by ID
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param documentId - Document ID to delete
 * @returns Promise<void>
 * @throws NotFoundException if document doesn't exist
 * @throws InternalServerErrorException if deletion fails
 *
 * @example
 * ```typescript
 * await deleteDocument(client, 'patients', 'patient-123');
 * ```
 */
export declare function deleteDocument(client: ElasticsearchClient | OpenSearchClient, indexName: string, documentId: string): Promise<void>;
/**
 * Upsert document (insert or update)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param documentId - Document ID
 * @param document - Document to upsert
 * @returns Promise with document ID
 * @throws InternalServerErrorException if upsert fails
 *
 * @example
 * ```typescript
 * await upsertDocument(client, 'patients', 'patient-123', {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   updatedAt: new Date(),
 * });
 * ```
 */
export declare function upsertDocument(client: ElasticsearchClient | OpenSearchClient, indexName: string, documentId: string, document: any): Promise<string>;
/**
 * Execute match query (full-text search on single field)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param query - Search query
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeMatchQuery(client, 'patients', 'name', 'john doe', {
 *   from: 0,
 *   size: 10,
 * });
 * console.log('Found:', results.total);
 * ```
 */
export declare function executeMatchQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, query: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute multi-match query (search across multiple fields)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param fields - Array of fields to search (can include boost with ^)
 * @param query - Search query
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeMultiMatchQuery(
 *   client,
 *   'patients',
 *   ['name^3', 'email^2', 'address'], // Boost name 3x, email 2x
 *   'john',
 *   { size: 20 }
 * );
 * ```
 */
export declare function executeMultiMatchQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, fields: string[], query: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute boolean query (combine multiple queries with must, should, must_not)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param must - Queries that must match
 * @param should - Queries that should match (boost score)
 * @param mustNot - Queries that must not match
 * @param filter - Filter queries (don't affect score)
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeBoolQuery(
 *   client,
 *   'patients',
 *   [{ match: { status: 'active' } }],
 *   [{ match: { name: 'john' } }, { match: { email: 'john' } }],
 *   [{ term: { deleted: true } }],
 *   [{ range: { age: { gte: 18 } } }]
 * );
 * ```
 */
export declare function executeBoolQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, must?: any[], should?: any[], mustNot?: any[], filter?: any[], options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute fuzzy query (find similar terms with edit distance)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param value - Search value
 * @param fuzziness - Maximum edit distance (0, 1, 2, or 'AUTO')
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find "john" even if user typed "jhon" or "jonh"
 * const results = await executeFuzzyQuery(
 *   client,
 *   'patients',
 *   'name',
 *   'jhon',
 *   'AUTO'
 * );
 * ```
 */
export declare function executeFuzzyQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, value: string, fuzziness?: number | 'AUTO', options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute wildcard query (pattern matching with * and ?)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param pattern - Wildcard pattern (* for any characters, ? for single character)
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find all emails ending with @example.com
 * const results = await executeWildcardQuery(
 *   client,
 *   'patients',
 *   'email.keyword',
 *   '*@example.com'
 * );
 * ```
 */
export declare function executeWildcardQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, pattern: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute prefix query (find terms starting with prefix)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param prefix - Prefix to match
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Autocomplete: find names starting with "joh"
 * const results = await executePrefixQuery(
 *   client,
 *   'patients',
 *   'name',
 *   'joh'
 * );
 * ```
 */
export declare function executePrefixQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, prefix: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute range query (find values in a range)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param from - Range start (inclusive with gte, exclusive with gt)
 * @param to - Range end (inclusive with lte, exclusive with lt)
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find patients aged 18-65
 * const results = await executeRangeQuery(
 *   client,
 *   'patients',
 *   'age',
 *   { gte: 18 },
 *   { lte: 65 }
 * );
 *
 * // Find records from last week
 * const recent = await executeRangeQuery(
 *   client,
 *   'appointments',
 *   'date',
 *   { gte: 'now-7d/d' },
 *   { lte: 'now/d' }
 * );
 * ```
 */
export declare function executeRangeQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, from?: {
    gt?: any;
    gte?: any;
}, to?: {
    lt?: any;
    lte?: any;
}, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute term query (exact term match on keyword fields)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search (should be keyword type)
 * @param value - Exact value to match
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeTermQuery(
 *   client,
 *   'patients',
 *   'status.keyword',
 *   'active'
 * );
 * ```
 */
export declare function executeTermQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, value: any, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Full-text search with relevance scoring and boosting
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param queryOptions - Search query options with filters, sorting, highlighting
 * @returns Search results with relevance scores
 * @throws BadRequestException if query options are invalid
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await fullTextSearch(client, 'patients', {
 *   query: 'john doe diabetes',
 *   fields: ['name^3', 'medicalHistory^2', 'notes'],
 *   filters: [
 *     { field: 'status', operator: 'eq', value: 'active' },
 *     { field: 'age', operator: 'range', from: 18, to: 65 },
 *   ],
 *   sort: [{ field: '_score', order: SortOrder.DESC }],
 *   from: 0,
 *   size: 20,
 *   highlight: {
 *     fields: ['name', 'medicalHistory', 'notes'],
 *     fragmentSize: 150,
 *   },
 * });
 * ```
 */
export declare function fullTextSearch<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, queryOptions: SearchQueryOptions): Promise<SearchResults<T>>;
/**
 * Multi-field search with custom field boosting
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param query - Search query
 * @param fieldBoosts - Object with field names as keys and boost values
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await multiFieldSearch(
 *   client,
 *   'patients',
 *   'john diabetes',
 *   {
 *     name: 5.0,           // Boost name matches 5x
 *     email: 3.0,          // Boost email matches 3x
 *     medicalHistory: 2.0, // Boost medical history 2x
 *     address: 1.0,        // Normal relevance
 *   },
 *   { size: 10 }
 * );
 * ```
 */
export declare function multiFieldSearch<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, query: string, fieldBoosts: Record<string, number>, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Phrase search (exact phrase matching)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search
 * @param phrase - Exact phrase to match
 * @param slop - Maximum distance between terms (0 for exact match)
 * @param options - Additional query options
 * @returns Search results
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find exact phrase "type 2 diabetes"
 * const exact = await phraseSearch(client, 'patients', 'diagnosis', 'type 2 diabetes', 0);
 *
 * // Find "type diabetes" allowing 1 word in between
 * const flexible = await phraseSearch(client, 'patients', 'diagnosis', 'type diabetes', 1);
 * ```
 */
export declare function phraseSearch<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, phrase: string, slop?: number, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Search-as-you-type / autocomplete search
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to search (should use completion or search_as_you_type analyzer)
 * @param prefix - Partial text typed by user
 * @param size - Maximum number of suggestions
 * @returns Search results with autocomplete suggestions
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // As user types "john d", suggest completions
 * const suggestions = await searchAsYouType(
 *   client,
 *   'patients',
 *   'name',
 *   'john d',
 *   5
 * );
 * // Returns: ["John Doe", "John Davis", "John Daniels", ...]
 * ```
 */
export declare function searchAsYouType<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, prefix: string, size?: number): Promise<SearchResults<T>>;
/**
 * Execute terms aggregation (group by field values)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Field to aggregate
 * @param size - Number of buckets to return
 * @param query - Optional query to filter documents
 * @returns Aggregation results with buckets
 * @throws InternalServerErrorException if aggregation fails
 *
 * @example
 * ```typescript
 * // Get top 10 most common diagnoses
 * const result = await executeTermsAggregation(
 *   client,
 *   'patients',
 *   'diagnosis.keyword',
 *   10
 * );
 * result.buckets.forEach(bucket => {
 *   console.log(`${bucket.key}: ${bucket.docCount} patients`);
 * });
 * ```
 */
export declare function executeTermsAggregation(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, size?: number, query?: any): Promise<AggregationResult>;
/**
 * Execute date histogram aggregation (group by date intervals)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Date field to aggregate
 * @param interval - Time interval (year, month, week, day, hour, minute)
 * @param query - Optional query to filter documents
 * @returns Aggregation results with date buckets
 * @throws InternalServerErrorException if aggregation fails
 *
 * @example
 * ```typescript
 * // Get patient registrations per month
 * const result = await executeDateHistogramAggregation(
 *   client,
 *   'patients',
 *   'registeredAt',
 *   'month'
 * );
 * result.buckets.forEach(bucket => {
 *   console.log(`${bucket.key}: ${bucket.docCount} registrations`);
 * });
 * ```
 */
export declare function executeDateHistogramAggregation(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, interval: string, query?: any): Promise<AggregationResult>;
/**
 * Execute stats aggregation (calculate statistics)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Numeric field to calculate stats
 * @param query - Optional query to filter documents
 * @returns Statistics (count, min, max, avg, sum)
 * @throws InternalServerErrorException if aggregation fails
 *
 * @example
 * ```typescript
 * const stats = await executeStatsAggregation(client, 'patients', 'age');
 * console.log('Average age:', stats.avg);
 * console.log('Min age:', stats.min);
 * console.log('Max age:', stats.max);
 * ```
 */
export declare function executeStatsAggregation(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, query?: any): Promise<AggregationResult>;
/**
 * Execute faceted search with dynamic facets
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param query - Search query
 * @param facets - Array of facet definitions
 * @param selectedFacets - Currently selected facet filters
 * @param options - Additional query options
 * @returns Search results with facet counts
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeFacetedSearch(
 *   client,
 *   'products',
 *   'laptop',
 *   [
 *     { name: 'brand', field: 'brand.keyword', type: FacetType.MULTI_SELECT, size: 10 },
 *     { name: 'price', field: 'price', type: FacetType.RANGE, ranges: [
 *       { to: 500, label: 'Under $500' },
 *       { from: 500, to: 1000, label: '$500-$1000' },
 *       { from: 1000, label: 'Over $1000' },
 *     ]},
 *   ],
 *   { brand: ['Dell', 'HP'] }
 * );
 * ```
 */
export declare function executeFacetedSearch<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, query: string, facets: FacetDefinition[], selectedFacets?: Record<string, any[]>, options?: Partial<SearchQueryOptions>): Promise<{
    results: SearchResults<T>;
    facets: FacetResult[];
}>;
/**
 * Execute geo distance query (search within radius)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Geo-point field
 * @param point - Center point (lat, lon)
 * @param distance - Radius distance (e.g., "10km", "5mi")
 * @param options - Additional query options
 * @returns Search results sorted by distance
 * @throws BadRequestException if geo query is invalid
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find hospitals within 10km of location
 * const nearby = await geoDistanceQuery(
 *   client,
 *   'hospitals',
 *   'location',
 *   { lat: 40.7128, lon: -74.0060 },
 *   '10km'
 * );
 * ```
 */
export declare function geoDistanceQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, point: {
    lat: number;
    lon: number;
}, distance: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Execute geo bounding box query (search within rectangle)
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param field - Geo-point field
 * @param topLeft - Top-left corner of bounding box
 * @param bottomRight - Bottom-right corner of bounding box
 * @param options - Additional query options
 * @returns Search results within bounding box
 * @throws BadRequestException if geo query is invalid
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * // Find locations in Manhattan
 * const results = await geoBoundingBoxQuery(
 *   client,
 *   'hospitals',
 *   'location',
 *   { lat: 40.8, lon: -74.02 },
 *   { lat: 40.7, lon: -73.95 }
 * );
 * ```
 */
export declare function geoBoundingBoxQuery<T = any>(client: ElasticsearchClient | OpenSearchClient, indexName: string, field: string, topLeft: {
    lat: number;
    lon: number;
}, bottomRight: {
    lat: number;
    lon: number;
}, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
/**
 * Create full-text search vector for PostgreSQL tsvector
 *
 * @param fields - Array of field values to include in search vector
 * @param weights - Optional weights for fields (A, B, C, D)
 * @returns Generated tsvector SQL expression
 *
 * @example
 * ```typescript
 * // In Sequelize model definition
 * const searchVector = createFullTextSearchVector(
 *   ['name', 'description', 'tags'],
 *   ['A', 'B', 'C']
 * );
 * // Generates: setweight(to_tsvector('english', coalesce(name, '')), 'A') || ...
 * ```
 */
export declare function createFullTextSearchVector(fields: string[], weights?: ('A' | 'B' | 'C' | 'D')[]): string;
/**
 * Execute full-text search using Sequelize and PostgreSQL
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name to search
 * @param searchVectorColumn - Column containing tsvector
 * @param query - Search query
 * @param options - Search options (limit, offset, minRank)
 * @returns Search results with relevance rank
 * @throws InternalServerErrorException if search fails
 *
 * @example
 * ```typescript
 * const results = await executeSequelizeFullTextSearch(
 *   sequelize,
 *   'patients',
 *   'search_vector',
 *   'diabetes treatment',
 *   { limit: 10, minRank: 0.1 }
 * );
 * results.forEach(row => {
 *   console.log(`${row.name} (rank: ${row.rank})`);
 * });
 * ```
 */
export declare function executeSequelizeFullTextSearch(sequelize: Sequelize, tableName: string, searchVectorColumn: string, query: string, options?: {
    limit?: number;
    offset?: number;
    minRank?: number;
    fields?: string[];
}): Promise<any[]>;
/**
 * Sync database records to Elasticsearch index
 *
 * @param client - Elasticsearch or OpenSearch client
 * @param indexName - Index name
 * @param sequelize - Sequelize instance
 * @param tableName - Table name to sync
 * @param transformFn - Function to transform DB row to search document
 * @param batchSize - Batch size for bulk indexing
 * @returns Number of documents synced
 * @throws InternalServerErrorException if sync fails
 *
 * @example
 * ```typescript
 * const count = await syncDatabaseToElasticsearch(
 *   elasticsearchClient,
 *   'patients',
 *   sequelize,
 *   'patients',
 *   (row) => ({
 *     id: row.id,
 *     name: row.name,
 *     email: row.email,
 *     age: row.age,
 *     location: { lat: row.latitude, lon: row.longitude },
 *   }),
 *   1000
 * );
 * console.log(`Synced ${count} patients`);
 * ```
 */
export declare function syncDatabaseToElasticsearch(client: ElasticsearchClient | OpenSearchClient, indexName: string, sequelize: Sequelize, tableName: string, transformFn: (row: any) => any, batchSize?: number): Promise<number>;
/**
 * Search Engine Service - Manages Elasticsearch/OpenSearch client and operations
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [SearchEngineService],
 *   exports: [SearchEngineService],
 * })
 * export class SearchModule {}
 *
 * // In controller or service
 * constructor(private searchEngine: SearchEngineService) {}
 *
 * async search() {
 *   const results = await this.searchEngine.search('patients', {
 *     query: 'john diabetes',
 *     fields: ['name', 'medicalHistory'],
 *   });
 * }
 * ```
 */
export declare class SearchEngineService {
    private readonly config;
    private readonly logger;
    private client;
    /**
     * Initialize SearchEngineService with configuration
     *
     * @param config - Search engine configuration
     */
    constructor(config: SearchEngineConfig);
    /**
     * Initialize search engine client
     */
    private initializeClient;
    /**
     * Get search engine client
     *
     * @returns Elasticsearch or OpenSearch client
     */
    getClient(): ElasticsearchClient | OpenSearchClient;
    /**
     * Test connection to search engine
     *
     * @returns True if connection is healthy
     */
    ping(): Promise<boolean>;
    /**
     * Execute full-text search
     *
     * @param indexName - Index to search
     * @param queryOptions - Search query options
     * @returns Search results
     */
    search<T = any>(indexName: string, queryOptions: SearchQueryOptions): Promise<SearchResults<T>>;
    /**
     * Index a document
     *
     * @param indexName - Index name
     * @param documentId - Document ID
     * @param document - Document to index
     * @returns Document ID
     */
    index(indexName: string, documentId: string | undefined, document: any): Promise<string>;
    /**
     * Bulk index documents
     *
     * @param indexName - Index name
     * @param operations - Bulk operations
     * @returns Bulk operation result
     */
    bulkIndex(indexName: string, operations: BulkOperation[]): Promise<BulkOperationResult>;
}
/**
 * Indexing Service - Manages document indexing and index lifecycle
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PatientService {
 *   constructor(private indexing: IndexingService) {}
 *
 *   async createPatient(data: CreatePatientDto) {
 *     const patient = await this.patientRepo.create(data);
 *
 *     // Index patient in Elasticsearch
 *     await this.indexing.indexDocument('patients', patient.id, {
 *       name: patient.name,
 *       email: patient.email,
 *       age: patient.age,
 *     });
 *
 *     return patient;
 *   }
 * }
 * ```
 */
export declare class IndexingService {
    private readonly searchEngine;
    private readonly logger;
    constructor(searchEngine: SearchEngineService);
    /**
     * Create search index with mappings
     *
     * @param indexName - Index name
     * @param mapping - Index mapping
     * @param settings - Index settings
     */
    createIndex(indexName: string, mapping: IndexMapping, settings?: IndexSettings): Promise<void>;
    /**
     * Delete search index
     *
     * @param indexName - Index name
     */
    deleteIndex(indexName: string): Promise<void>;
    /**
     * Index a single document
     *
     * @param indexName - Index name
     * @param documentId - Document ID
     * @param document - Document to index
     * @returns Document ID
     */
    indexDocument(indexName: string, documentId: string | undefined, document: any): Promise<string>;
    /**
     * Bulk index documents
     *
     * @param indexName - Index name
     * @param operations - Bulk operations
     * @returns Bulk operation result
     */
    bulkIndex(indexName: string, operations: BulkOperation[]): Promise<BulkOperationResult>;
    /**
     * Update document
     *
     * @param indexName - Index name
     * @param documentId - Document ID
     * @param partialDocument - Partial document
     */
    updateDocument(indexName: string, documentId: string, partialDocument: any): Promise<void>;
    /**
     * Delete document
     *
     * @param indexName - Index name
     * @param documentId - Document ID
     */
    deleteDocument(indexName: string, documentId: string): Promise<void>;
}
/**
 * Search Service - High-level search operations and queries
 *
 * @example
 * ```typescript
 * @Controller('search')
 * export class SearchController {
 *   constructor(private search: SearchService) {}
 *
 *   @Get('patients')
 *   async searchPatients(@Query() query: SearchQueryDto) {
 *     return this.search.fullTextSearch('patients', {
 *       query: query.q,
 *       fields: ['name^3', 'email^2', 'medicalHistory'],
 *       filters: query.filters,
 *       from: query.from,
 *       size: query.size,
 *     });
 *   }
 * }
 * ```
 */
export declare class SearchService {
    private readonly searchEngine;
    private readonly logger;
    constructor(searchEngine: SearchEngineService);
    /**
     * Execute full-text search
     *
     * @param indexName - Index to search
     * @param queryOptions - Search query options
     * @returns Search results
     */
    fullTextSearch<T = any>(indexName: string, queryOptions: SearchQueryOptions): Promise<SearchResults<T>>;
    /**
     * Execute autocomplete search
     *
     * @param indexName - Index to search
     * @param field - Field to search
     * @param prefix - Search prefix
     * @param size - Number of suggestions
     * @returns Autocomplete suggestions
     */
    autocomplete<T = any>(indexName: string, field: string, prefix: string, size?: number): Promise<SearchResults<T>>;
    /**
     * Execute faceted search
     *
     * @param indexName - Index to search
     * @param query - Search query
     * @param facets - Facet definitions
     * @param selectedFacets - Selected facets
     * @param options - Query options
     * @returns Search results with facets
     */
    facetedSearch<T = any>(indexName: string, query: string, facets: FacetDefinition[], selectedFacets?: Record<string, any[]>, options?: Partial<SearchQueryOptions>): Promise<{
        results: SearchResults<T>;
        facets: FacetResult[];
    }>;
    /**
     * Execute geospatial search
     *
     * @param indexName - Index to search
     * @param field - Geo-point field
     * @param point - Center point
     * @param distance - Search radius
     * @param options - Query options
     * @returns Nearby locations
     */
    geoSearch<T = any>(indexName: string, field: string, point: {
        lat: number;
        lon: number;
    }, distance: string, options?: Partial<SearchQueryOptions>): Promise<SearchResults<T>>;
}
//# sourceMappingURL=search-indexing-kit.prod.d.ts.map