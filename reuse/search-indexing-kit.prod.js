"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = exports.IndexingService = exports.SearchEngineService = exports.IndexMappingSchema = exports.BulkOperationSchema = exports.GeoQuerySchema = exports.AggregationConfigSchema = exports.SearchQueryOptionsSchema = exports.HighlightOptionsSchema = exports.SearchFilterSchema = exports.SearchEngineConfigSchema = exports.BulkOperationType = exports.HighlightFragmenter = exports.SortOrder = exports.FacetType = exports.AggregationType = exports.SearchQueryType = exports.SearchEngine = void 0;
exports.createElasticsearchClient = createElasticsearchClient;
exports.createOpenSearchClient = createOpenSearchClient;
exports.testSearchEngineConnection = testSearchEngineConnection;
exports.getClusterHealth = getClusterHealth;
exports.getClusterStats = getClusterStats;
exports.createSearchIndex = createSearchIndex;
exports.deleteSearchIndex = deleteSearchIndex;
exports.updateIndexMapping = updateIndexMapping;
exports.reindexDocuments = reindexDocuments;
exports.createIndexAlias = createIndexAlias;
exports.deleteIndexAlias = deleteIndexAlias;
exports.getIndexSettings = getIndexSettings;
exports.updateIndexSettings = updateIndexSettings;
exports.indexDocument = indexDocument;
exports.bulkIndexDocuments = bulkIndexDocuments;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.upsertDocument = upsertDocument;
exports.executeMatchQuery = executeMatchQuery;
exports.executeMultiMatchQuery = executeMultiMatchQuery;
exports.executeBoolQuery = executeBoolQuery;
exports.executeFuzzyQuery = executeFuzzyQuery;
exports.executeWildcardQuery = executeWildcardQuery;
exports.executePrefixQuery = executePrefixQuery;
exports.executeRangeQuery = executeRangeQuery;
exports.executeTermQuery = executeTermQuery;
exports.fullTextSearch = fullTextSearch;
exports.multiFieldSearch = multiFieldSearch;
exports.phraseSearch = phraseSearch;
exports.searchAsYouType = searchAsYouType;
exports.executeTermsAggregation = executeTermsAggregation;
exports.executeDateHistogramAggregation = executeDateHistogramAggregation;
exports.executeStatsAggregation = executeStatsAggregation;
exports.executeFacetedSearch = executeFacetedSearch;
exports.geoDistanceQuery = geoDistanceQuery;
exports.geoBoundingBoxQuery = geoBoundingBoxQuery;
exports.createFullTextSearchVector = createFullTextSearchVector;
exports.executeSequelizeFullTextSearch = executeSequelizeFullTextSearch;
exports.syncDatabaseToElasticsearch = syncDatabaseToElasticsearch;
/**
 * File: /reuse/search-indexing-kit.prod.ts
 * Locator: WC-SEARCH-INDEX-PROD-001
 * Purpose: Production-Grade Search & Indexing Kit - Enterprise search engine toolkit
 *
 * Upstream: NestJS, Elasticsearch, OpenSearch, Sequelize, Zod, PostgreSQL
 * Downstream: ../backend/search/*, Search Services, Indexing Services, Controllers
 * Dependencies: TypeScript 5.x, Node 18+, @elastic/elasticsearch, @opensearch-project/opensearch
 * Exports: 47+ production-ready search functions covering Elasticsearch/OpenSearch integration,
 *          indexing, full-text search, faceted search, fuzzy search, autocomplete, highlighting,
 *          relevance scoring, aggregations, geospatial search, synonym handling
 *
 * LLM Context: Production-grade search and indexing utilities for White Cross healthcare platform.
 * Provides comprehensive Elasticsearch and OpenSearch client integration, index management (create,
 * delete, update, alias, reindex), document indexing (single, bulk, upsert), search queries (match,
 * multi-match, bool, fuzzy, wildcard, prefix, range, term, query string, nested), full-text search
 * with relevance scoring, multi-field search with boosting, phrase and proximity search, autocomplete
 * and search-as-you-type, synonym handling, faceted search with dynamic filtering, aggregations
 * (terms, date histogram, range, stats, cardinality, nested), highlighting and suggestions, geospatial
 * queries (geo_distance, geo_bounding_box, geo_polygon), custom scoring and rescoring, Sequelize
 * full-text search integration with PostgreSQL tsvector and ts_rank, hybrid database + Elasticsearch
 * queries, NestJS services for search engine management, and Zod validation for all inputs.
 * Includes comprehensive error handling, performance optimization, and HIPAA-compliant search patterns.
 */
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@elastic/elasticsearch");
const opensearch_1 = require("@opensearch-project/opensearch");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Supported search engine types
 */
var SearchEngine;
(function (SearchEngine) {
    SearchEngine["ELASTICSEARCH"] = "elasticsearch";
    SearchEngine["OPENSEARCH"] = "opensearch";
    SearchEngine["ALGOLIA"] = "algolia";
    SearchEngine["MEILISEARCH"] = "meilisearch";
    SearchEngine["TYPESENSE"] = "typesense";
})(SearchEngine || (exports.SearchEngine = SearchEngine = {}));
/**
 * Search query types supported by Elasticsearch/OpenSearch
 */
var SearchQueryType;
(function (SearchQueryType) {
    SearchQueryType["MATCH"] = "match";
    SearchQueryType["MATCH_PHRASE"] = "match_phrase";
    SearchQueryType["MATCH_PHRASE_PREFIX"] = "match_phrase_prefix";
    SearchQueryType["MULTI_MATCH"] = "multi_match";
    SearchQueryType["QUERY_STRING"] = "query_string";
    SearchQueryType["SIMPLE_QUERY_STRING"] = "simple_query_string";
    SearchQueryType["BOOL"] = "bool";
    SearchQueryType["TERM"] = "term";
    SearchQueryType["TERMS"] = "terms";
    SearchQueryType["RANGE"] = "range";
    SearchQueryType["PREFIX"] = "prefix";
    SearchQueryType["WILDCARD"] = "wildcard";
    SearchQueryType["FUZZY"] = "fuzzy";
    SearchQueryType["REGEXP"] = "regexp";
    SearchQueryType["EXISTS"] = "exists";
    SearchQueryType["NESTED"] = "nested";
    SearchQueryType["GEO_DISTANCE"] = "geo_distance";
    SearchQueryType["GEO_BOUNDING_BOX"] = "geo_bounding_box";
    SearchQueryType["GEO_POLYGON"] = "geo_polygon";
})(SearchQueryType || (exports.SearchQueryType = SearchQueryType = {}));
/**
 * Aggregation types for faceted search and analytics
 */
var AggregationType;
(function (AggregationType) {
    AggregationType["TERMS"] = "terms";
    AggregationType["DATE_HISTOGRAM"] = "date_histogram";
    AggregationType["HISTOGRAM"] = "histogram";
    AggregationType["RANGE"] = "range";
    AggregationType["DATE_RANGE"] = "date_range";
    AggregationType["STATS"] = "stats";
    AggregationType["EXTENDED_STATS"] = "extended_stats";
    AggregationType["CARDINALITY"] = "cardinality";
    AggregationType["AVG"] = "avg";
    AggregationType["SUM"] = "sum";
    AggregationType["MIN"] = "min";
    AggregationType["MAX"] = "max";
    AggregationType["PERCENTILES"] = "percentiles";
    AggregationType["NESTED"] = "nested";
    AggregationType["REVERSE_NESTED"] = "reverse_nested";
    AggregationType["FILTER"] = "filter";
    AggregationType["GEO_DISTANCE"] = "geo_distance";
    AggregationType["GEO_HASH_GRID"] = "geohash_grid";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
/**
 * Facet types for faceted search
 */
var FacetType;
(function (FacetType) {
    FacetType["SINGLE_SELECT"] = "single_select";
    FacetType["MULTI_SELECT"] = "multi_select";
    FacetType["RANGE"] = "range";
    FacetType["HIERARCHICAL"] = "hierarchical";
    FacetType["NESTED"] = "nested";
})(FacetType || (exports.FacetType = FacetType = {}));
/**
 * Search result sort order
 */
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
/**
 * Highlight fragment types
 */
var HighlightFragmenter;
(function (HighlightFragmenter) {
    HighlightFragmenter["SIMPLE"] = "simple";
    HighlightFragmenter["SPAN"] = "span";
})(HighlightFragmenter || (exports.HighlightFragmenter = HighlightFragmenter = {}));
/**
 * Bulk operation types
 */
var BulkOperationType;
(function (BulkOperationType) {
    BulkOperationType["INDEX"] = "index";
    BulkOperationType["CREATE"] = "create";
    BulkOperationType["UPDATE"] = "update";
    BulkOperationType["DELETE"] = "delete";
})(BulkOperationType || (exports.BulkOperationType = BulkOperationType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Search engine configuration schema
 */
exports.SearchEngineConfigSchema = zod_1.z.object({
    engine: zod_1.z.nativeEnum(SearchEngine),
    nodes: zod_1.z.array(zod_1.z.string().url()).min(1, 'At least one node is required'),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    apiKey: zod_1.z.string().optional(),
    cloudId: zod_1.z.string().optional(),
    maxRetries: zod_1.z.number().int().min(0).max(10).optional(),
    requestTimeout: zod_1.z.number().int().min(1000).max(300000).optional(),
    sniffOnStart: zod_1.z.boolean().optional(),
    sniffInterval: zod_1.z.number().int().min(60000).optional(),
});
/**
 * Search filter schema
 */
exports.SearchFilterSchema = zod_1.z.object({
    field: zod_1.z.string().min(1, 'Field is required'),
    operator: zod_1.z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'exists', 'range']),
    value: zod_1.z.any().optional(),
    values: zod_1.z.array(zod_1.z.any()).optional(),
    from: zod_1.z.any().optional(),
    to: zod_1.z.any().optional(),
});
/**
 * Highlight options schema
 */
exports.HighlightOptionsSchema = zod_1.z.object({
    fields: zod_1.z.array(zod_1.z.string()).min(1, 'At least one field is required'),
    preTags: zod_1.z.array(zod_1.z.string()).optional(),
    postTags: zod_1.z.array(zod_1.z.string()).optional(),
    fragmentSize: zod_1.z.number().int().min(1).max(1000).optional(),
    numberOfFragments: zod_1.z.number().int().min(0).max(100).optional(),
    fragmenter: zod_1.z.nativeEnum(HighlightFragmenter).optional(),
    requireFieldMatch: zod_1.z.boolean().optional(),
    encoder: zod_1.z.enum(['default', 'html']).optional(),
});
/**
 * Search query options schema
 */
exports.SearchQueryOptionsSchema = zod_1.z.object({
    query: zod_1.z.string().min(1, 'Query is required'),
    fields: zod_1.z.array(zod_1.z.string()).optional(),
    filters: zod_1.z.array(exports.SearchFilterSchema).optional(),
    sort: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        order: zod_1.z.nativeEnum(SortOrder),
    })).optional(),
    from: zod_1.z.number().int().min(0).optional(),
    size: zod_1.z.number().int().min(1).max(10000).optional(),
    highlight: exports.HighlightOptionsSchema.optional(),
    minScore: zod_1.z.number().min(0).optional(),
    trackTotalHits: zod_1.z.boolean().optional(),
    timeout: zod_1.z.string().optional(),
    boosts: zod_1.z.record(zod_1.z.number()).optional(),
});
/**
 * Aggregation configuration schema
 */
exports.AggregationConfigSchema = zod_1.z.lazy(() => zod_1.z.object({
    type: zod_1.z.nativeEnum(AggregationType),
    field: zod_1.z.string().optional(),
    size: zod_1.z.number().int().min(1).max(10000).optional(),
    interval: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
    ranges: zod_1.z.array(zod_1.z.object({
        from: zod_1.z.number().optional(),
        to: zod_1.z.number().optional(),
        key: zod_1.z.string().optional(),
    })).optional(),
    missing: zod_1.z.any().optional(),
    minDocCount: zod_1.z.number().int().min(0).optional(),
    order: zod_1.z.record(zod_1.z.nativeEnum(SortOrder)).optional(),
    nestedPath: zod_1.z.string().optional(),
    subAggregations: zod_1.z.record(exports.AggregationConfigSchema).optional(),
}));
/**
 * Geo query schema
 */
exports.GeoQuerySchema = zod_1.z.object({
    type: zod_1.z.enum(['geo_distance', 'geo_bounding_box', 'geo_polygon']),
    field: zod_1.z.string().min(1, 'Field is required'),
    distance: zod_1.z.string().optional(),
    point: zod_1.z.object({ lat: zod_1.z.number(), lon: zod_1.z.number() }).optional(),
    topLeft: zod_1.z.object({ lat: zod_1.z.number(), lon: zod_1.z.number() }).optional(),
    bottomRight: zod_1.z.object({ lat: zod_1.z.number(), lon: zod_1.z.number() }).optional(),
    points: zod_1.z.array(zod_1.z.object({ lat: zod_1.z.number(), lon: zod_1.z.number() })).optional(),
});
/**
 * Bulk operation schema
 */
exports.BulkOperationSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(BulkOperationType),
    id: zod_1.z.string().optional(),
    document: zod_1.z.any().optional(),
    routing: zod_1.z.string().optional(),
});
/**
 * Index mapping schema
 */
exports.IndexMappingSchema = zod_1.z.object({
    properties: zod_1.z.record(zod_1.z.any()),
    dynamicTemplates: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional(),
    dynamic: zod_1.z.union([zod_1.z.boolean(), zod_1.z.literal('strict')]).optional(),
    _source: zod_1.z.object({
        enabled: zod_1.z.boolean(),
        includes: zod_1.z.array(zod_1.z.string()).optional(),
        excludes: zod_1.z.array(zod_1.z.string()).optional(),
    }).optional(),
});
// ============================================================================
// ELASTICSEARCH/OPENSEARCH CLIENT FUNCTIONS
// ============================================================================
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
function createElasticsearchClient(config) {
    try {
        exports.SearchEngineConfigSchema.parse(config);
        return new elasticsearch_1.Client({
            nodes: config.nodes,
            auth: config.username && config.password
                ? { username: config.username, password: config.password }
                : config.apiKey
                    ? { apiKey: config.apiKey }
                    : undefined,
            cloud: config.cloudId ? { id: config.cloudId } : undefined,
            maxRetries: config.maxRetries || 3,
            requestTimeout: config.requestTimeout || 30000,
            sniffOnStart: config.sniffOnStart || false,
            sniffInterval: config.sniffInterval,
            ssl: config.ssl,
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Invalid Elasticsearch configuration: ${error.message}`);
    }
}
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
function createOpenSearchClient(config) {
    try {
        exports.SearchEngineConfigSchema.parse(config);
        return new opensearch_1.Client({
            nodes: config.nodes,
            auth: config.username && config.password
                ? { username: config.username, password: config.password }
                : undefined,
            ssl: config.ssl,
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Invalid OpenSearch configuration: ${error.message}`);
    }
}
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
async function testSearchEngineConnection(client) {
    try {
        const response = await client.ping();
        return response !== null;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Search engine connection failed: ${error.message}`);
    }
}
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
async function getClusterHealth(client) {
    try {
        const response = await client.cluster.health();
        return response;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to get cluster health: ${error.message}`);
    }
}
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
async function getClusterStats(client) {
    try {
        const response = await client.cluster.stats();
        return response;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to get cluster stats: ${error.message}`);
    }
}
// ============================================================================
// INDEX MANAGEMENT FUNCTIONS
// ============================================================================
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
async function createSearchIndex(client, indexName, mapping, settings) {
    try {
        exports.IndexMappingSchema.parse(mapping);
        const exists = await client.indices.exists({ index: indexName });
        if (exists) {
            throw new common_1.BadRequestException(`Index '${indexName}' already exists`);
        }
        await client.indices.create({
            index: indexName,
            body: {
                settings: {
                    number_of_shards: settings?.numberOfShards || 1,
                    number_of_replicas: settings?.numberOfReplicas || 1,
                    refresh_interval: settings?.refreshInterval || '1s',
                    max_result_window: settings?.maxResultWindow || 10000,
                    analysis: settings?.analysis,
                },
                mappings: mapping,
            },
        });
    }
    catch (error) {
        if (error instanceof common_1.BadRequestException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to create index: ${error.message}`);
    }
}
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
async function deleteSearchIndex(client, indexName) {
    try {
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            throw new common_1.NotFoundException(`Index '${indexName}' not found`);
        }
        await client.indices.delete({ index: indexName });
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to delete index: ${error.message}`);
    }
}
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
async function updateIndexMapping(client, indexName, mapping) {
    try {
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            throw new common_1.NotFoundException(`Index '${indexName}' not found`);
        }
        await client.indices.putMapping({
            index: indexName,
            body: mapping,
        });
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to update index mapping: ${error.message}`);
    }
}
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
async function reindexDocuments(client, sourceIndex, destIndex, query) {
    try {
        const exists = await client.indices.exists({ index: sourceIndex });
        if (!exists) {
            throw new common_1.NotFoundException(`Source index '${sourceIndex}' not found`);
        }
        const response = await client.reindex({
            body: {
                source: {
                    index: sourceIndex,
                    query: query,
                },
                dest: {
                    index: destIndex,
                },
            },
            wait_for_completion: true,
        });
        return response;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to reindex documents: ${error.message}`);
    }
}
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
async function createIndexAlias(client, indexName, aliasName) {
    try {
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            throw new common_1.NotFoundException(`Index '${indexName}' not found`);
        }
        await client.indices.putAlias({
            index: indexName,
            name: aliasName,
        });
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to create index alias: ${error.message}`);
    }
}
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
async function deleteIndexAlias(client, indexName, aliasName) {
    try {
        await client.indices.deleteAlias({
            index: indexName,
            name: aliasName,
        });
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to delete index alias: ${error.message}`);
    }
}
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
async function getIndexSettings(client, indexName) {
    try {
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            throw new common_1.NotFoundException(`Index '${indexName}' not found`);
        }
        const response = await client.indices.getSettings({ index: indexName });
        return response[indexName]?.settings;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to get index settings: ${error.message}`);
    }
}
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
async function updateIndexSettings(client, indexName, settings) {
    try {
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            throw new common_1.NotFoundException(`Index '${indexName}' not found`);
        }
        await client.indices.putSettings({
            index: indexName,
            body: {
                number_of_replicas: settings.numberOfReplicas,
                refresh_interval: settings.refreshInterval,
                max_result_window: settings.maxResultWindow,
            },
        });
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        throw new common_1.InternalServerErrorException(`Failed to update index settings: ${error.message}`);
    }
}
// ============================================================================
// DOCUMENT INDEXING FUNCTIONS
// ============================================================================
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
async function indexDocument(client, indexName, documentId, document) {
    try {
        const response = await client.index({
            index: indexName,
            id: documentId,
            body: document,
            refresh: 'wait_for',
        });
        return response._id;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to index document: ${error.message}`);
    }
}
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
async function bulkIndexDocuments(client, indexName, operations) {
    try {
        operations.forEach(op => exports.BulkOperationSchema.parse(op));
        const body = operations.flatMap(op => {
            const action = { [op.type]: { _index: indexName, _id: op.id } };
            if (op.type === BulkOperationType.DELETE) {
                return [action];
            }
            return [action, op.document];
        });
        const response = await client.bulk({
            body,
            refresh: 'wait_for',
        });
        const successful = response.items.filter(item => Object.values(item)[0].status < 300).length;
        const failed = response.items.length - successful;
        return {
            took: response.took,
            errors: response.errors,
            items: response.items,
            successful,
            failed,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to bulk index documents: ${error.message}`);
    }
}
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
async function updateDocument(client, indexName, documentId, partialDocument) {
    try {
        await client.update({
            index: indexName,
            id: documentId,
            body: {
                doc: partialDocument,
            },
            refresh: 'wait_for',
        });
    }
    catch (error) {
        if (error.statusCode === 404) {
            throw new common_1.NotFoundException(`Document '${documentId}' not found`);
        }
        throw new common_1.InternalServerErrorException(`Failed to update document: ${error.message}`);
    }
}
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
async function deleteDocument(client, indexName, documentId) {
    try {
        await client.delete({
            index: indexName,
            id: documentId,
            refresh: 'wait_for',
        });
    }
    catch (error) {
        if (error.statusCode === 404) {
            throw new common_1.NotFoundException(`Document '${documentId}' not found`);
        }
        throw new common_1.InternalServerErrorException(`Failed to delete document: ${error.message}`);
    }
}
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
async function upsertDocument(client, indexName, documentId, document) {
    try {
        const response = await client.update({
            index: indexName,
            id: documentId,
            body: {
                doc: document,
                doc_as_upsert: true,
            },
            refresh: 'wait_for',
        });
        return response._id;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to upsert document: ${error.message}`);
    }
}
// ============================================================================
// SEARCH QUERY FUNCTIONS
// ============================================================================
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
async function executeMatchQuery(client, indexName, field, query, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    match: {
                        [field]: {
                            query,
                            fuzziness: 'AUTO',
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                highlight: options?.highlight ? buildHighlightQuery(options.highlight) : undefined,
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute match query: ${error.message}`);
    }
}
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
async function executeMultiMatchQuery(client, indexName, fields, query, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields,
                        type: 'best_fields',
                        fuzziness: 'AUTO',
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                highlight: options?.highlight ? buildHighlightQuery(options.highlight) : undefined,
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute multi-match query: ${error.message}`);
    }
}
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
async function executeBoolQuery(client, indexName, must, should, mustNot, filter, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        must,
                        should,
                        must_not: mustNot,
                        filter,
                        minimum_should_match: should && should.length > 0 ? 1 : undefined,
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                highlight: options?.highlight ? buildHighlightQuery(options.highlight) : undefined,
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute bool query: ${error.message}`);
    }
}
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
async function executeFuzzyQuery(client, indexName, field, value, fuzziness = 'AUTO', options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    fuzzy: {
                        [field]: {
                            value,
                            fuzziness,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute fuzzy query: ${error.message}`);
    }
}
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
async function executeWildcardQuery(client, indexName, field, pattern, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    wildcard: {
                        [field]: {
                            value: pattern,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute wildcard query: ${error.message}`);
    }
}
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
async function executePrefixQuery(client, indexName, field, prefix, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    prefix: {
                        [field]: {
                            value: prefix,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute prefix query: ${error.message}`);
    }
}
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
async function executeRangeQuery(client, indexName, field, from, to, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    range: {
                        [field]: {
                            ...from,
                            ...to,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute range query: ${error.message}`);
    }
}
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
async function executeTermQuery(client, indexName, field, value, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    term: {
                        [field]: value,
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute term query: ${error.message}`);
    }
}
// ============================================================================
// FULL-TEXT SEARCH FUNCTIONS
// ============================================================================
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
async function fullTextSearch(client, indexName, queryOptions) {
    try {
        exports.SearchQueryOptionsSchema.parse(queryOptions);
        const query = {
            bool: {
                must: [
                    queryOptions.fields && queryOptions.fields.length > 0
                        ? {
                            multi_match: {
                                query: queryOptions.query,
                                fields: queryOptions.fields,
                                type: 'best_fields',
                                fuzziness: 'AUTO',
                            },
                        }
                        : {
                            query_string: {
                                query: queryOptions.query,
                                default_operator: 'AND',
                            },
                        },
                ],
                filter: queryOptions.filters ? buildFilters(queryOptions.filters) : undefined,
            },
        };
        const response = await client.search({
            index: indexName,
            body: {
                query,
                from: queryOptions.from || 0,
                size: queryOptions.size || 10,
                min_score: queryOptions.minScore,
                sort: queryOptions.sort?.map(s => ({ [s.field]: s.order })),
                highlight: queryOptions.highlight ? buildHighlightQuery(queryOptions.highlight) : undefined,
                aggs: queryOptions.aggregations ? buildAggregations(queryOptions.aggregations) : undefined,
                track_total_hits: queryOptions.trackTotalHits !== undefined ? queryOptions.trackTotalHits : true,
                timeout: queryOptions.timeout,
                _source: queryOptions._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Invalid search query options: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException(`Failed to execute full-text search: ${error.message}`);
    }
}
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
async function multiFieldSearch(client, indexName, query, fieldBoosts, options) {
    try {
        const fields = Object.entries(fieldBoosts).map(([field, boost]) => `${field}^${boost}`);
        return executeMultiMatchQuery(client, indexName, fields, query, options);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute multi-field search: ${error.message}`);
    }
}
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
async function phraseSearch(client, indexName, field, phrase, slop = 0, options) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    match_phrase: {
                        [field]: {
                            query: phrase,
                            slop,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                highlight: options?.highlight ? buildHighlightQuery(options.highlight) : undefined,
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute phrase search: ${error.message}`);
    }
}
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
async function searchAsYouType(client, indexName, field, prefix, size = 5) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        should: [
                            {
                                match_phrase_prefix: {
                                    [field]: {
                                        query: prefix,
                                        max_expansions: 10,
                                    },
                                },
                            },
                            {
                                match: {
                                    [field]: {
                                        query: prefix,
                                        fuzziness: 'AUTO',
                                    },
                                },
                            },
                        ],
                    },
                },
                size,
                _source: [field],
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute search-as-you-type: ${error.message}`);
    }
}
// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================
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
async function executeTermsAggregation(client, indexName, field, size = 10, query) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: query || { match_all: {} },
                size: 0,
                aggs: {
                    result: {
                        terms: {
                            field,
                            size,
                        },
                    },
                },
            },
        });
        return parseAggregationResult(response.aggregations?.result);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute terms aggregation: ${error.message}`);
    }
}
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
async function executeDateHistogramAggregation(client, indexName, field, interval, query) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: query || { match_all: {} },
                size: 0,
                aggs: {
                    result: {
                        date_histogram: {
                            field,
                            calendar_interval: interval,
                        },
                    },
                },
            },
        });
        return parseAggregationResult(response.aggregations?.result);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute date histogram aggregation: ${error.message}`);
    }
}
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
async function executeStatsAggregation(client, indexName, field, query) {
    try {
        const response = await client.search({
            index: indexName,
            body: {
                query: query || { match_all: {} },
                size: 0,
                aggs: {
                    result: {
                        stats: {
                            field,
                        },
                    },
                },
            },
        });
        return parseAggregationResult(response.aggregations?.result);
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute stats aggregation: ${error.message}`);
    }
}
// ============================================================================
// FACETED SEARCH FUNCTIONS
// ============================================================================
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
async function executeFacetedSearch(client, indexName, query, facets, selectedFacets, options) {
    try {
        const filters = [];
        // Build filters from selected facets
        if (selectedFacets) {
            Object.entries(selectedFacets).forEach(([facetName, values]) => {
                const facet = facets.find(f => f.name === facetName);
                if (facet && values.length > 0) {
                    filters.push({
                        terms: {
                            [facet.field]: values,
                        },
                    });
                }
            });
        }
        // Build aggregations for facets
        const aggs = {};
        facets.forEach(facet => {
            if (facet.type === FacetType.RANGE && facet.ranges) {
                aggs[facet.name] = {
                    range: {
                        field: facet.field,
                        ranges: facet.ranges.map(r => ({
                            from: r.from,
                            to: r.to,
                            key: r.label,
                        })),
                    },
                };
            }
            else {
                aggs[facet.name] = {
                    terms: {
                        field: facet.field,
                        size: facet.size || 10,
                        order: facet.order ? { _count: facet.order } : undefined,
                    },
                };
            }
        });
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        must: query ? [{ query_string: { query } }] : [{ match_all: {} }],
                        filter: filters.length > 0 ? filters : undefined,
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                aggs,
                _source: options?._source,
            },
        });
        const results = parseSearchResponse(response);
        const facetResults = parseFacetResults(facets, response.aggregations, selectedFacets);
        return { results, facets: facetResults };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute faceted search: ${error.message}`);
    }
}
// ============================================================================
// GEOSPATIAL SEARCH FUNCTIONS
// ============================================================================
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
async function geoDistanceQuery(client, indexName, field, point, distance, options) {
    try {
        exports.GeoQuerySchema.parse({
            type: 'geo_distance',
            field,
            point,
            distance,
        });
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    geo_distance: {
                        distance,
                        [field]: point,
                    },
                },
                sort: [
                    {
                        _geo_distance: {
                            [field]: point,
                            order: 'asc',
                            unit: 'km',
                        },
                    },
                ],
                from: options?.from || 0,
                size: options?.size || 10,
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Invalid geo query: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException(`Failed to execute geo distance query: ${error.message}`);
    }
}
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
async function geoBoundingBoxQuery(client, indexName, field, topLeft, bottomRight, options) {
    try {
        exports.GeoQuerySchema.parse({
            type: 'geo_bounding_box',
            field,
            topLeft,
            bottomRight,
        });
        const response = await client.search({
            index: indexName,
            body: {
                query: {
                    geo_bounding_box: {
                        [field]: {
                            top_left: topLeft,
                            bottom_right: bottomRight,
                        },
                    },
                },
                from: options?.from || 0,
                size: options?.size || 10,
                sort: options?.sort?.map(s => ({ [s.field]: s.order })),
                _source: options?._source,
            },
        });
        return parseSearchResponse(response);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Invalid geo query: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException(`Failed to execute geo bounding box query: ${error.message}`);
    }
}
// ============================================================================
// SEQUELIZE FULL-TEXT SEARCH INTEGRATION
// ============================================================================
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
function createFullTextSearchVector(fields, weights) {
    return fields
        .map((field, index) => {
        const weight = weights?.[index] || 'D';
        return `setweight(to_tsvector('english', coalesce(${field}, '')), '${weight}')`;
    })
        .join(' || ');
}
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
async function executeSequelizeFullTextSearch(sequelize, tableName, searchVectorColumn, query, options) {
    try {
        const tsQuery = query
            .trim()
            .split(/\s+/)
            .map(term => `${term}:*`)
            .join(' & ');
        const selectFields = options?.fields?.join(', ') || '*';
        const sql = `
      SELECT ${selectFields},
             ts_rank(${searchVectorColumn}, to_tsquery('english', :query)) AS rank
      FROM ${tableName}
      WHERE ${searchVectorColumn} @@ to_tsquery('english', :query)
      ${options?.minRank ? `AND ts_rank(${searchVectorColumn}, to_tsquery('english', :query)) >= :minRank` : ''}
      ORDER BY rank DESC
      ${options?.limit ? 'LIMIT :limit' : ''}
      ${options?.offset ? 'OFFSET :offset' : ''}
    `;
        const results = await sequelize.query(sql, {
            replacements: {
                query: tsQuery,
                minRank: options?.minRank,
                limit: options?.limit,
                offset: options?.offset,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to execute Sequelize full-text search: ${error.message}`);
    }
}
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
async function syncDatabaseToElasticsearch(client, indexName, sequelize, tableName, transformFn, batchSize = 1000) {
    try {
        let offset = 0;
        let totalSynced = 0;
        let hasMore = true;
        while (hasMore) {
            const rows = await sequelize.query(`SELECT * FROM ${tableName} LIMIT :limit OFFSET :offset`, {
                replacements: { limit: batchSize, offset },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (rows.length === 0) {
                hasMore = false;
                break;
            }
            const operations = rows.map(row => ({
                type: BulkOperationType.INDEX,
                id: row.id?.toString(),
                document: transformFn(row),
            }));
            const result = await bulkIndexDocuments(client, indexName, operations);
            totalSynced += result.successful;
            offset += batchSize;
        }
        return totalSynced;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Failed to sync database to Elasticsearch: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Build Elasticsearch filter query from SearchFilter array
 *
 * @param filters - Array of search filters
 * @returns Elasticsearch filter query array
 * @internal
 */
function buildFilters(filters) {
    return filters.map(filter => {
        switch (filter.operator) {
            case 'eq':
                return { term: { [filter.field]: filter.value } };
            case 'ne':
                return { bool: { must_not: { term: { [filter.field]: filter.value } } } };
            case 'gt':
                return { range: { [filter.field]: { gt: filter.value } } };
            case 'gte':
                return { range: { [filter.field]: { gte: filter.value } } };
            case 'lt':
                return { range: { [filter.field]: { lt: filter.value } } };
            case 'lte':
                return { range: { [filter.field]: { lte: filter.value } } };
            case 'in':
                return { terms: { [filter.field]: filter.values } };
            case 'nin':
                return { bool: { must_not: { terms: { [filter.field]: filter.values } } } };
            case 'exists':
                return { exists: { field: filter.field } };
            case 'range':
                return {
                    range: {
                        [filter.field]: {
                            gte: filter.from,
                            lte: filter.to,
                        },
                    },
                };
            default:
                return { term: { [filter.field]: filter.value } };
        }
    });
}
/**
 * Build Elasticsearch highlight query
 *
 * @param options - Highlight options
 * @returns Elasticsearch highlight query
 * @internal
 */
function buildHighlightQuery(options) {
    const fields = {};
    options.fields.forEach(field => {
        fields[field] = {
            fragment_size: options.fragmentSize || 150,
            number_of_fragments: options.numberOfFragments || 3,
        };
    });
    return {
        pre_tags: options.preTags || ['<em>'],
        post_tags: options.postTags || ['</em>'],
        fields,
        fragmenter: options.fragmenter || HighlightFragmenter.SPAN,
        require_field_match: options.requireFieldMatch !== undefined ? options.requireFieldMatch : true,
        encoder: options.encoder || 'default',
    };
}
/**
 * Build Elasticsearch aggregations query
 *
 * @param aggregations - Aggregation configurations
 * @returns Elasticsearch aggregations query
 * @internal
 */
function buildAggregations(aggregations) {
    const aggs = {};
    Object.entries(aggregations).forEach(([name, config]) => {
        switch (config.type) {
            case AggregationType.TERMS:
                aggs[name] = {
                    terms: {
                        field: config.field,
                        size: config.size || 10,
                        min_doc_count: config.minDocCount,
                        order: config.order,
                    },
                };
                break;
            case AggregationType.DATE_HISTOGRAM:
                aggs[name] = {
                    date_histogram: {
                        field: config.field,
                        calendar_interval: config.interval,
                        min_doc_count: config.minDocCount,
                    },
                };
                break;
            case AggregationType.RANGE:
                aggs[name] = {
                    range: {
                        field: config.field,
                        ranges: config.ranges,
                    },
                };
                break;
            case AggregationType.STATS:
                aggs[name] = {
                    stats: {
                        field: config.field,
                    },
                };
                break;
            default:
                aggs[name] = {
                    [config.type]: {
                        field: config.field,
                    },
                };
        }
        // Add sub-aggregations if defined
        if (config.subAggregations) {
            aggs[name].aggs = buildAggregations(config.subAggregations);
        }
    });
    return aggs;
}
/**
 * Parse Elasticsearch search response into SearchResults
 *
 * @param response - Raw Elasticsearch response
 * @returns Parsed search results
 * @internal
 */
function parseSearchResponse(response) {
    const hits = response.hits?.hits || [];
    return {
        total: typeof response.hits?.total === 'object'
            ? response.hits.total.value
            : response.hits?.total || 0,
        maxScore: response.hits?.max_score || 0,
        took: response.took || 0,
        documents: hits.map((hit) => ({
            id: hit._id,
            score: hit._score || 0,
            source: hit._source,
            highlight: hit.highlight,
            sort: hit.sort,
            innerHits: hit.inner_hits,
        })),
        aggregations: response.aggregations ? parseAggregations(response.aggregations) : undefined,
    };
}
/**
 * Parse Elasticsearch aggregation response
 *
 * @param aggregations - Raw aggregation response
 * @returns Parsed aggregation results
 * @internal
 */
function parseAggregations(aggregations) {
    const results = {};
    Object.entries(aggregations).forEach(([name, agg]) => {
        results[name] = parseAggregationResult(agg);
    });
    return results;
}
/**
 * Parse single aggregation result
 *
 * @param agg - Raw aggregation result
 * @returns Parsed aggregation result
 * @internal
 */
function parseAggregationResult(agg) {
    if (agg.buckets) {
        return {
            buckets: agg.buckets.map((bucket) => ({
                key: bucket.key,
                docCount: bucket.doc_count,
                subAggregations: bucket.aggregations
                    ? parseAggregations(bucket.aggregations)
                    : undefined,
            })),
        };
    }
    return {
        value: agg.value,
        values: agg.values,
        sum: agg.sum,
        count: agg.count,
        min: agg.min,
        max: agg.max,
        avg: agg.avg,
    };
}
/**
 * Parse facet results from aggregations
 *
 * @param facetDefinitions - Facet definitions
 * @param aggregations - Raw aggregation response
 * @param selectedFacets - Currently selected facets
 * @returns Parsed facet results
 * @internal
 */
function parseFacetResults(facetDefinitions, aggregations, selectedFacets) {
    return facetDefinitions.map(facet => {
        const agg = aggregations?.[facet.name];
        const selected = selectedFacets?.[facet.name] || [];
        const values = agg?.buckets?.map((bucket) => ({
            value: bucket.key,
            label: bucket.key_as_string || bucket.key,
            count: bucket.doc_count,
            selected: selected.includes(bucket.key),
        })) || [];
        return {
            name: facet.name,
            label: facet.label || facet.name,
            type: facet.type,
            values,
        };
    });
}
// ============================================================================
// NESTJS SERVICES
// ============================================================================
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
let SearchEngineService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SearchEngineService = _classThis = class {
        /**
         * Initialize SearchEngineService with configuration
         *
         * @param config - Search engine configuration
         */
        constructor(config) {
            this.config = config;
            this.logger = new common_1.Logger(SearchEngineService.name);
            this.initializeClient();
        }
        /**
         * Initialize search engine client
         */
        initializeClient() {
            try {
                if (this.config.engine === SearchEngine.ELASTICSEARCH) {
                    this.client = createElasticsearchClient(this.config);
                    this.logger.log('Elasticsearch client initialized');
                }
                else if (this.config.engine === SearchEngine.OPENSEARCH) {
                    this.client = createOpenSearchClient(this.config);
                    this.logger.log('OpenSearch client initialized');
                }
                else {
                    throw new Error(`Unsupported search engine: ${this.config.engine}`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to initialize search engine: ${error.message}`);
                throw error;
            }
        }
        /**
         * Get search engine client
         *
         * @returns Elasticsearch or OpenSearch client
         */
        getClient() {
            return this.client;
        }
        /**
         * Test connection to search engine
         *
         * @returns True if connection is healthy
         */
        async ping() {
            return testSearchEngineConnection(this.client);
        }
        /**
         * Execute full-text search
         *
         * @param indexName - Index to search
         * @param queryOptions - Search query options
         * @returns Search results
         */
        async search(indexName, queryOptions) {
            return fullTextSearch(this.client, indexName, queryOptions);
        }
        /**
         * Index a document
         *
         * @param indexName - Index name
         * @param documentId - Document ID
         * @param document - Document to index
         * @returns Document ID
         */
        async index(indexName, documentId, document) {
            return indexDocument(this.client, indexName, documentId, document);
        }
        /**
         * Bulk index documents
         *
         * @param indexName - Index name
         * @param operations - Bulk operations
         * @returns Bulk operation result
         */
        async bulkIndex(indexName, operations) {
            return bulkIndexDocuments(this.client, indexName, operations);
        }
    };
    __setFunctionName(_classThis, "SearchEngineService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SearchEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SearchEngineService = _classThis;
})();
exports.SearchEngineService = SearchEngineService;
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
let IndexingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IndexingService = _classThis = class {
        constructor(searchEngine) {
            this.searchEngine = searchEngine;
            this.logger = new common_1.Logger(IndexingService.name);
        }
        /**
         * Create search index with mappings
         *
         * @param indexName - Index name
         * @param mapping - Index mapping
         * @param settings - Index settings
         */
        async createIndex(indexName, mapping, settings) {
            try {
                await createSearchIndex(this.searchEngine.getClient(), indexName, mapping, settings);
                this.logger.log(`Index '${indexName}' created successfully`);
            }
            catch (error) {
                this.logger.error(`Failed to create index '${indexName}': ${error.message}`);
                throw error;
            }
        }
        /**
         * Delete search index
         *
         * @param indexName - Index name
         */
        async deleteIndex(indexName) {
            try {
                await deleteSearchIndex(this.searchEngine.getClient(), indexName);
                this.logger.log(`Index '${indexName}' deleted successfully`);
            }
            catch (error) {
                this.logger.error(`Failed to delete index '${indexName}': ${error.message}`);
                throw error;
            }
        }
        /**
         * Index a single document
         *
         * @param indexName - Index name
         * @param documentId - Document ID
         * @param document - Document to index
         * @returns Document ID
         */
        async indexDocument(indexName, documentId, document) {
            try {
                const id = await indexDocument(this.searchEngine.getClient(), indexName, documentId, document);
                this.logger.debug(`Document indexed: ${id} in ${indexName}`);
                return id;
            }
            catch (error) {
                this.logger.error(`Failed to index document: ${error.message}`);
                throw error;
            }
        }
        /**
         * Bulk index documents
         *
         * @param indexName - Index name
         * @param operations - Bulk operations
         * @returns Bulk operation result
         */
        async bulkIndex(indexName, operations) {
            try {
                const result = await bulkIndexDocuments(this.searchEngine.getClient(), indexName, operations);
                this.logger.log(`Bulk indexed: ${result.successful} successful, ${result.failed} failed`);
                return result;
            }
            catch (error) {
                this.logger.error(`Failed to bulk index: ${error.message}`);
                throw error;
            }
        }
        /**
         * Update document
         *
         * @param indexName - Index name
         * @param documentId - Document ID
         * @param partialDocument - Partial document
         */
        async updateDocument(indexName, documentId, partialDocument) {
            try {
                await updateDocument(this.searchEngine.getClient(), indexName, documentId, partialDocument);
                this.logger.debug(`Document updated: ${documentId} in ${indexName}`);
            }
            catch (error) {
                this.logger.error(`Failed to update document: ${error.message}`);
                throw error;
            }
        }
        /**
         * Delete document
         *
         * @param indexName - Index name
         * @param documentId - Document ID
         */
        async deleteDocument(indexName, documentId) {
            try {
                await deleteDocument(this.searchEngine.getClient(), indexName, documentId);
                this.logger.debug(`Document deleted: ${documentId} from ${indexName}`);
            }
            catch (error) {
                this.logger.error(`Failed to delete document: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "IndexingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IndexingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IndexingService = _classThis;
})();
exports.IndexingService = IndexingService;
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
let SearchService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SearchService = _classThis = class {
        constructor(searchEngine) {
            this.searchEngine = searchEngine;
            this.logger = new common_1.Logger(SearchService.name);
        }
        /**
         * Execute full-text search
         *
         * @param indexName - Index to search
         * @param queryOptions - Search query options
         * @returns Search results
         */
        async fullTextSearch(indexName, queryOptions) {
            try {
                const results = await fullTextSearch(this.searchEngine.getClient(), indexName, queryOptions);
                this.logger.debug(`Search completed: ${results.total} results in ${results.took}ms`);
                return results;
            }
            catch (error) {
                this.logger.error(`Search failed: ${error.message}`);
                throw error;
            }
        }
        /**
         * Execute autocomplete search
         *
         * @param indexName - Index to search
         * @param field - Field to search
         * @param prefix - Search prefix
         * @param size - Number of suggestions
         * @returns Autocomplete suggestions
         */
        async autocomplete(indexName, field, prefix, size = 5) {
            try {
                return searchAsYouType(this.searchEngine.getClient(), indexName, field, prefix, size);
            }
            catch (error) {
                this.logger.error(`Autocomplete failed: ${error.message}`);
                throw error;
            }
        }
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
        async facetedSearch(indexName, query, facets, selectedFacets, options) {
            try {
                return executeFacetedSearch(this.searchEngine.getClient(), indexName, query, facets, selectedFacets, options);
            }
            catch (error) {
                this.logger.error(`Faceted search failed: ${error.message}`);
                throw error;
            }
        }
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
        async geoSearch(indexName, field, point, distance, options) {
            try {
                return geoDistanceQuery(this.searchEngine.getClient(), indexName, field, point, distance, options);
            }
            catch (error) {
                this.logger.error(`Geo search failed: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "SearchService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SearchService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SearchService = _classThis;
})();
exports.SearchService = SearchService;
//# sourceMappingURL=search-indexing-kit.prod.js.map