"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSearchQuery = exports.generateNgrams = exports.generateQueryCorrections = exports.buildTypoTolerantQuery = exports.spellCheck = exports.calculateSearchCTR = exports.getPopularSearches = exports.trackSearchAnalytics = exports.personalizeResults = exports.rerankResults = exports.scrollSearch = exports.extractCursor = exports.buildCursorPagination = exports.applyDateRangeFilter = exports.buildAdvancedFilters = exports.buildCrossFieldsQuery = exports.multiFieldSearch = exports.applyTimeDecay = exports.calculateBM25Score = exports.buildCustomScoring = exports.highlightText = exports.extractHighlights = exports.buildHighlightConfig = exports.buildPhraseSuggester = exports.generateDidYouMean = exports.generateSuggestions = exports.buildAutoCompleteQuery = exports.applyFacetFilters = exports.parseFacetResults = exports.buildFacetAggregations = exports.buildCompoundQuery = exports.buildBoostedQuery = exports.buildElasticsearchQuery = exports.updateIndexMappings = exports.reindexDocuments = exports.bulkIndexDocuments = exports.createSearchIndex = exports.phoneticSearch = exports.fuzzyMatch = exports.levenshteinDistance = exports.fuzzySearch = exports.buildWeightedSearch = exports.simpleFullTextSearch = exports.buildFullTextSearch = exports.defineSearchHistoryModel = exports.defineSearchIndexModel = exports.defineSearchQueryModel = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const defineSearchQueryModel = (sequelize) => {
    return sequelize.define('SearchQuery', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        query: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'The search query text',
        },
        normalizedQuery: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Normalized/cleaned version of the query',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who performed the search',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Session identifier',
        },
        resultCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of results returned',
        },
        responseTime: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Response time in milliseconds',
        },
        filters: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Applied filters',
        },
        clickedResults: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'IDs of clicked results',
        },
        clickPosition: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Position of first clicked result',
        },
        successful: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether search was successful',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if unsuccessful',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'search_queries',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['sessionId'] },
            { fields: ['createdAt'] },
            { fields: ['query'], using: 'gin', operator: 'gin_trgm_ops' },
        ],
    });
};
exports.defineSearchQueryModel = defineSearchQueryModel;
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
const defineSearchIndexModel = (sequelize) => {
    return sequelize.define('SearchIndex', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        indexName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Name of the search index',
        },
        indexType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Type of index (elasticsearch, postgresql, etc.)',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of entity being indexed (patient, record, etc.)',
        },
        documentCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of documents in index',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('building', 'active', 'rebuilding', 'inactive', 'error'),
            allowNull: false,
            defaultValue: 'building',
            comment: 'Current status of the index',
        },
        lastIndexedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last time the index was updated',
        },
        mappings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Index mappings/schema',
        },
        settings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Index settings',
        },
        aliases: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'Index aliases',
        },
        errorLog: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error messages from indexing',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'search_indexes',
        timestamps: true,
        indexes: [
            { fields: ['indexName'], unique: true },
            { fields: ['entityType'] },
            { fields: ['status'] },
            { fields: ['lastIndexedAt'] },
        ],
    });
};
exports.defineSearchIndexModel = defineSearchIndexModel;
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
const defineSearchHistoryModel = (sequelize) => {
    return sequelize.define('SearchHistory', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who performed the search',
        },
        query: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Search query text',
        },
        normalizedQuery: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Normalized version of the query',
        },
        frequency: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Number of times this query was searched',
        },
        lastSearchedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last time this query was searched',
        },
        avgResultCount: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Average number of results',
        },
        avgResponseTime: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Average response time in ms',
        },
        clickThroughRate: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Percentage of searches with clicks',
        },
        bookmarked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether user bookmarked this search',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'search_history',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['userId', 'normalizedQuery'], unique: true },
            { fields: ['lastSearchedAt'] },
            { fields: ['frequency'] },
        ],
    });
};
exports.defineSearchHistoryModel = defineSearchHistoryModel;
// ============================================================================
// FULL-TEXT SEARCH HELPERS
// ============================================================================
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
const buildFullTextSearch = (model, options) => {
    const language = options.language || 'english';
    const tsvectorExpression = options.fields
        .map((field) => `to_tsvector('${language}', COALESCE("${field}", ''))`)
        .join(' || ');
    const rankExpression = (0, sequelize_1.literal)(`ts_rank(${tsvectorExpression}, to_tsquery('${language}', '${options.query.replace(/'/g, "''")}'))`);
    const query = {
        where: (0, sequelize_1.literal)(`${tsvectorExpression} @@ to_tsquery('${language}', '${options.query.replace(/'/g, "''")}')`),
        attributes: {
            include: [[rankExpression, 'searchRank']],
        },
        order: [[(0, sequelize_1.literal)('searchRank'), 'DESC']],
        limit: options.limit || 20,
        offset: options.offset || 0,
    };
    if (options.minRank) {
        query.having = (0, sequelize_1.literal)(`ts_rank(${tsvectorExpression}, to_tsquery('${language}', '${options.query}')) >= ${options.minRank}`);
    }
    return query;
};
exports.buildFullTextSearch = buildFullTextSearch;
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
const simpleFullTextSearch = async (model, searchTerm, fields, options = {}) => {
    const operator = options.caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const searchPattern = `%${searchTerm}%`;
    return model.findAll({
        where: {
            [sequelize_1.Op.or]: fields.map((field) => ({
                [field]: { [operator]: searchPattern },
            })),
        },
        limit: options.limit || 20,
        offset: options.offset || 0,
    });
};
exports.simpleFullTextSearch = simpleFullTextSearch;
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
const buildWeightedSearch = (model, options) => {
    const language = options.language || 'english';
    const weights = Object.entries(options.fieldWeights)
        .map(([field, weight]) => `setweight(to_tsvector('${language}', COALESCE("${field}", '')), '${weight > 0.8 ? 'A' : weight > 0.5 ? 'B' : 'C'}')`)
        .join(' || ');
    const rankExpression = (0, sequelize_1.literal)(`ts_rank(${weights}, to_tsquery('${language}', '${options.query.replace(/'/g, "''")}'))`);
    return {
        where: (0, sequelize_1.literal)(`${weights} @@ to_tsquery('${language}', '${options.query.replace(/'/g, "''")}')`),
        attributes: {
            include: [[rankExpression, 'weightedRank']],
        },
        order: [[(0, sequelize_1.literal)('weightedRank'), 'DESC']],
        limit: options.limit || 20,
    };
};
exports.buildWeightedSearch = buildWeightedSearch;
// ============================================================================
// FUZZY SEARCH IMPLEMENTATION
// ============================================================================
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
const fuzzySearch = async (model, options) => {
    const threshold = options.threshold || 0.3;
    const term = options.term.replace(/'/g, "''");
    const similarityExpressions = options.fields.map((field) => `similarity("${field}", '${term}')`);
    const maxSimilarity = `GREATEST(${similarityExpressions.join(', ')})`;
    return model.findAll({
        where: (0, sequelize_1.literal)(`${maxSimilarity} > ${threshold}`),
        attributes: {
            include: [[(0, sequelize_1.literal)(maxSimilarity), 'similarity']],
        },
        order: [[(0, sequelize_1.literal)('similarity'), 'DESC']],
        limit: options.limit || 20,
        offset: options.offset || 0,
    });
};
exports.fuzzySearch = fuzzySearch;
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
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
};
exports.levenshteinDistance = levenshteinDistance;
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
const fuzzyMatch = (items, query, extractor, maxDistance = 2) => {
    return items
        .map((item) => {
        const text = extractor(item);
        const distance = (0, exports.levenshteinDistance)(query.toLowerCase(), text.toLowerCase());
        const score = 1 - distance / Math.max(query.length, text.length);
        return { item, distance, score };
    })
        .filter((result) => result.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
};
exports.fuzzyMatch = fuzzyMatch;
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
const phoneticSearch = async (model, options) => {
    const algorithm = options.algorithm || 'soundex';
    const term = options.term.replace(/'/g, "''");
    return model.findAll({
        where: (0, sequelize_1.literal)(`${algorithm}("${options.field}") = ${algorithm}('${term}')`),
        limit: options.limit || 20,
    });
};
exports.phoneticSearch = phoneticSearch;
// ============================================================================
// SEARCH INDEXING UTILITIES
// ============================================================================
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
const createSearchIndex = async (client, config) => {
    try {
        const exists = await client.indices.exists({ index: config.indexName });
        if (exists) {
            await client.indices.delete({ index: config.indexName });
        }
        await client.indices.create({
            index: config.indexName,
            body: {
                mappings: config.mappings,
                settings: config.settings || {
                    number_of_shards: 1,
                    number_of_replicas: 1,
                    analysis: {
                        analyzer: {
                            default: {
                                type: 'standard',
                            },
                        },
                    },
                },
            },
        });
        if (config.aliases && config.aliases.length > 0) {
            for (const alias of config.aliases) {
                await client.indices.putAlias({
                    index: config.indexName,
                    name: alias,
                });
            }
        }
        return true;
    }
    catch (error) {
        console.error('Error creating search index:', error);
        return false;
    }
};
exports.createSearchIndex = createSearchIndex;
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
const bulkIndexDocuments = async (client, options) => {
    const batchSize = options.batchSize || 500;
    let indexed = 0;
    const errors = [];
    for (let i = 0; i < options.documents.length; i += batchSize) {
        const batch = options.documents.slice(i, i + batchSize);
        const body = batch.flatMap((doc) => [
            { index: { _index: options.indexName, _id: doc.id } },
            doc,
        ]);
        try {
            const result = await client.bulk({
                body,
                refresh: options.refresh,
            });
            if (result.errors) {
                result.items.forEach((item) => {
                    if (item.index?.error) {
                        errors.push(item.index.error);
                    }
                });
            }
            indexed += batch.length - errors.length;
        }
        catch (error) {
            errors.push(error);
        }
    }
    return { indexed, errors };
};
exports.bulkIndexDocuments = bulkIndexDocuments;
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
const reindexDocuments = async (client, options) => {
    try {
        await client.reindex({
            body: {
                source: {
                    index: options.sourceIndex,
                    query: options.query,
                },
                dest: {
                    index: options.destIndex,
                },
            },
            wait_for_completion: options.waitForCompletion !== false,
        });
        return true;
    }
    catch (error) {
        console.error('Error reindexing documents:', error);
        return false;
    }
};
exports.reindexDocuments = reindexDocuments;
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
const updateIndexMappings = async (client, indexName, mappings) => {
    try {
        await client.indices.putMapping({
            index: indexName,
            body: mappings,
        });
        return true;
    }
    catch (error) {
        console.error('Error updating index mappings:', error);
        return false;
    }
};
exports.updateIndexMappings = updateIndexMappings;
// ============================================================================
// SEARCH QUERY BUILDERS
// ============================================================================
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
const buildElasticsearchQuery = (options) => {
    const must = [];
    const filter = [];
    // Main search query
    if (options.query) {
        if (options.fuzzy) {
            must.push({
                multi_match: {
                    query: options.query,
                    fields: options.fields || ['_all'],
                    fuzziness: options.fuzziness || 'AUTO',
                    prefix_length: 1,
                },
            });
        }
        else {
            must.push({
                multi_match: {
                    query: options.query,
                    fields: options.fields || ['_all'],
                    type: 'best_fields',
                },
            });
        }
    }
    // Apply filters
    if (options.filters) {
        Object.entries(options.filters).forEach(([field, value]) => {
            if (Array.isArray(value)) {
                filter.push({ terms: { [field]: value } });
            }
            else if (typeof value === 'object' && value !== null) {
                if (value.gte !== undefined || value.lte !== undefined) {
                    filter.push({ range: { [field]: value } });
                }
            }
            else {
                filter.push({ term: { [field]: value } });
            }
        });
    }
    const query = {
        bool: {
            must: must.length > 0 ? must : undefined,
            filter: filter.length > 0 ? filter : undefined,
        },
    };
    // Remove undefined properties
    Object.keys(query.bool).forEach((key) => {
        if (query.bool[key] === undefined) {
            delete query.bool[key];
        }
    });
    return query;
};
exports.buildElasticsearchQuery = buildElasticsearchQuery;
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
const buildBoostedQuery = (options) => {
    const fields = Object.entries(options.fieldBoosts).map(([field, boost]) => `${field}^${boost}`);
    return {
        multi_match: {
            query: options.query,
            fields,
            type: 'best_fields',
            fuzziness: options.fuzzy ? 'AUTO' : undefined,
            operator: options.operator || 'or',
        },
    };
};
exports.buildBoostedQuery = buildBoostedQuery;
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
const buildCompoundQuery = (options) => {
    return {
        bool: {
            must: options.must,
            should: options.should,
            must_not: options.mustNot,
            filter: options.filter,
            minimum_should_match: options.minimumShouldMatch,
        },
    };
};
exports.buildCompoundQuery = buildCompoundQuery;
// ============================================================================
// FACETED SEARCH
// ============================================================================
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
const buildFacetAggregations = (facets) => {
    const aggregations = {};
    facets.forEach((facet) => {
        switch (facet.type) {
            case 'term':
                aggregations[facet.field] = {
                    terms: {
                        field: `${facet.field}.keyword`,
                        size: facet.size || 10,
                    },
                };
                break;
            case 'range':
                aggregations[facet.field] = {
                    range: {
                        field: facet.field,
                        ranges: facet.ranges,
                    },
                };
                break;
            case 'date_range':
                aggregations[facet.field] = {
                    date_range: {
                        field: facet.field,
                        ranges: facet.ranges,
                    },
                };
                break;
            case 'histogram':
                aggregations[facet.field] = {
                    histogram: {
                        field: facet.field,
                        interval: facet.interval || 10,
                    },
                };
                break;
        }
    });
    return aggregations;
};
exports.buildFacetAggregations = buildFacetAggregations;
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
const parseFacetResults = (aggregations, configs) => {
    const facets = {};
    configs.forEach((config) => {
        if (!aggregations[config.field])
            return;
        const buckets = aggregations[config.field].buckets;
        facets[config.field] = buckets.map((bucket) => ({
            value: bucket.key,
            count: bucket.doc_count,
            label: bucket.key_as_string || String(bucket.key),
        }));
    });
    return facets;
};
exports.parseFacetResults = parseFacetResults;
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
const applyFacetFilters = (query, facetFilters) => {
    const filters = query.bool?.filter || [];
    Object.entries(facetFilters).forEach(([field, value]) => {
        if (Array.isArray(value)) {
            filters.push({ terms: { [`${field}.keyword`]: value } });
        }
        else {
            filters.push({ term: { [`${field}.keyword`]: value } });
        }
    });
    return {
        ...query,
        bool: {
            ...query.bool,
            filter: filters,
        },
    };
};
exports.applyFacetFilters = applyFacetFilters;
// ============================================================================
// AUTO-COMPLETE AND SUGGESTIONS
// ============================================================================
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
const buildAutoCompleteQuery = (options) => {
    const query = {
        bool: {
            must: [
                {
                    match: {
                        [options.field]: {
                            query: options.prefix,
                            operator: 'and',
                        },
                    },
                },
            ],
        },
    };
    if (options.fuzzy) {
        query.bool.should = [
            {
                match: {
                    [`${options.field}.suggest`]: {
                        query: options.prefix,
                        fuzziness: 'AUTO',
                    },
                },
            },
        ];
    }
    if (options.context) {
        Object.entries(options.context).forEach(([field, value]) => {
            query.bool.filter = query.bool.filter || [];
            query.bool.filter.push({ term: { [field]: value } });
        });
    }
    return query;
};
exports.buildAutoCompleteQuery = buildAutoCompleteQuery;
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
const generateSuggestions = async (client, options) => {
    try {
        const result = await client.search({
            index: options.indexName,
            body: {
                suggest: {
                    suggestions: {
                        prefix: options.prefix,
                        completion: {
                            field: options.field,
                            size: options.size || 5,
                            fuzzy: options.fuzzy ? { fuzziness: 'AUTO' } : undefined,
                            skip_duplicates: true,
                        },
                    },
                },
            },
        });
        return result.suggest?.suggestions?.[0]?.options?.map((opt) => opt.text) || [];
    }
    catch (error) {
        console.error('Error generating suggestions:', error);
        return [];
    }
};
exports.generateSuggestions = generateSuggestions;
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
const generateDidYouMean = async (client, options) => {
    try {
        const result = await client.search({
            index: options.indexName,
            body: {
                suggest: {
                    didYouMean: {
                        text: options.text,
                        term: {
                            field: options.field,
                            size: options.size || 3,
                            suggest_mode: 'popular',
                            string_distance: 'levenshtein',
                        },
                    },
                },
            },
        });
        return result.suggest?.didYouMean?.[0]?.options?.map((opt) => opt.text) || [];
    }
    catch (error) {
        console.error('Error generating did you mean suggestions:', error);
        return [];
    }
};
exports.generateDidYouMean = generateDidYouMean;
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
const buildPhraseSuggester = (text, options) => {
    return {
        text,
        phrase: {
            field: options.field,
            size: options.size || 3,
            confidence: options.confidence || 1.0,
            gram_size: options.gramSize || 2,
            direct_generator: [
                {
                    field: options.field,
                    suggest_mode: 'always',
                    min_word_length: 3,
                },
            ],
        },
    };
};
exports.buildPhraseSuggester = buildPhraseSuggester;
// ============================================================================
// SEARCH HIGHLIGHTING
// ============================================================================
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
const buildHighlightConfig = (options) => {
    const fieldsConfig = {};
    options.fields.forEach((field) => {
        fieldsConfig[field] = {
            fragment_size: options.fragmentSize || 150,
            number_of_fragments: options.numberOfFragments || 3,
        };
    });
    return {
        pre_tags: options.preTags || ['<em>'],
        post_tags: options.postTags || ['</em>'],
        fields: fieldsConfig,
    };
};
exports.buildHighlightConfig = buildHighlightConfig;
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
const extractHighlights = (hit) => {
    if (!hit.highlight)
        return {};
    const highlights = {};
    Object.entries(hit.highlight).forEach(([field, snippets]) => {
        highlights[field] = snippets;
    });
    return highlights;
};
exports.extractHighlights = extractHighlights;
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
const highlightText = (text, terms, tags = { pre: '<em>', post: '</em>' }) => {
    let result = text;
    terms.forEach((term) => {
        const regex = new RegExp(`(${term})`, 'gi');
        result = result.replace(regex, `${tags.pre}$1${tags.post}`);
    });
    return result;
};
exports.highlightText = highlightText;
// ============================================================================
// SEARCH RELEVANCE SCORING
// ============================================================================
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
const buildCustomScoring = (options) => {
    const functions = [];
    // Add field boost functions
    if (options.fieldBoosts) {
        Object.entries(options.fieldBoosts).forEach(([field, weight]) => {
            functions.push({
                filter: { exists: { field } },
                weight,
            });
        });
    }
    // Add decay function
    if (options.decayFunction) {
        functions.push({
            gauss: {
                [options.decayFunction.field]: {
                    origin: options.decayFunction.origin,
                    scale: options.decayFunction.scale,
                    decay: options.decayFunction.decay,
                },
            },
        });
    }
    // Add script score
    if (options.scriptScore) {
        functions.push({
            script_score: {
                script: options.scriptScore,
            },
        });
    }
    return {
        function_score: {
            query: options.query,
            functions,
            score_mode: 'sum',
            boost_mode: 'multiply',
        },
    };
};
exports.buildCustomScoring = buildCustomScoring;
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
const calculateBM25Score = (params) => {
    const k1 = params.k1 || 1.2;
    const b = params.b || 0.75;
    const idf = Math.log(1 + (params.totalDocs - params.docFreq + 0.5) / (params.docFreq + 0.5));
    const normalization = 1 - b + b * (params.docLength / params.avgDocLength);
    const tf = (params.termFreq * (k1 + 1)) / (params.termFreq + k1 * normalization);
    return idf * tf;
};
exports.calculateBM25Score = calculateBM25Score;
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
const applyTimeDecay = (score, documentDate, options) => {
    const now = new Date();
    const ageInDays = (now.getTime() - documentDate.getTime()) / (1000 * 60 * 60 * 24);
    const offset = options.offset || 0;
    if (ageInDays <= offset) {
        return score;
    }
    const effectiveAge = ageInDays - offset;
    const decayFactor = Math.exp(-Math.log(1 / options.decay) * (effectiveAge / options.scale));
    return score * decayFactor;
};
exports.applyTimeDecay = applyTimeDecay;
// ============================================================================
// MULTI-FIELD SEARCH
// ============================================================================
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
const multiFieldSearch = async (client, options) => {
    const fields = options.fields.map((f) => f.boost ? `${f.name}^${f.boost}` : f.name);
    const query = {
        multi_match: {
            query: options.query,
            fields,
            type: 'best_fields',
            tie_breaker: 0.3,
        },
    };
    const esQuery = options.filters
        ? { bool: { must: query, filter: Object.entries(options.filters).map(([k, v]) => ({ term: { [k]: v } })) } }
        : query;
    const result = await client.search({
        index: options.indexName,
        body: {
            query: esQuery,
            size: options.limit || 20,
        },
    });
    return {
        hits: result.hits.hits.map((hit) => ({
            id: hit._id,
            score: hit._score,
            data: hit._source,
        })),
        total: typeof result.hits.total === 'object' ? result.hits.total.value : result.hits.total,
        took: result.took,
        maxScore: result.hits.max_score,
    };
};
exports.multiFieldSearch = multiFieldSearch;
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
const buildCrossFieldsQuery = (options) => {
    return {
        multi_match: {
            query: options.query,
            fields: options.fields,
            type: 'cross_fields',
            operator: options.operator || 'or',
            tie_breaker: options.tieBreaker || 0.3,
        },
    };
};
exports.buildCrossFieldsQuery = buildCrossFieldsQuery;
// ============================================================================
// SEARCH FILTERS
// ============================================================================
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
const buildAdvancedFilters = (filters) => {
    const esFilters = [];
    filters.forEach((filter) => {
        switch (filter.operator) {
            case 'eq':
                esFilters.push({ term: { [filter.field]: filter.value } });
                break;
            case 'ne':
                esFilters.push({ bool: { must_not: { term: { [filter.field]: filter.value } } } });
                break;
            case 'gt':
                esFilters.push({ range: { [filter.field]: { gt: filter.value } } });
                break;
            case 'gte':
                esFilters.push({ range: { [filter.field]: { gte: filter.value } } });
                break;
            case 'lt':
                esFilters.push({ range: { [filter.field]: { lt: filter.value } } });
                break;
            case 'lte':
                esFilters.push({ range: { [filter.field]: { lte: filter.value } } });
                break;
            case 'in':
                esFilters.push({ terms: { [filter.field]: filter.value } });
                break;
            case 'nin':
                esFilters.push({ bool: { must_not: { terms: { [filter.field]: filter.value } } } });
                break;
            case 'between':
                if (Array.isArray(filter.value) && filter.value.length === 2) {
                    esFilters.push({
                        range: {
                            [filter.field]: {
                                gte: filter.value[0],
                                lte: filter.value[1],
                            },
                        },
                    });
                }
                break;
            case 'contains':
                esFilters.push({ wildcard: { [filter.field]: `*${filter.value}*` } });
                break;
            case 'startsWith':
                esFilters.push({ prefix: { [filter.field]: filter.value } });
                break;
            case 'endsWith':
                esFilters.push({ wildcard: { [filter.field]: `*${filter.value}` } });
                break;
        }
    });
    return { bool: { filter: esFilters } };
};
exports.buildAdvancedFilters = buildAdvancedFilters;
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
const applyDateRangeFilter = (query, dateRange) => {
    const filter = query.bool?.filter || [];
    const rangeFilter = { range: { [dateRange.field]: {} } };
    if (dateRange.from) {
        rangeFilter.range[dateRange.field].gte = dateRange.from;
    }
    if (dateRange.to) {
        rangeFilter.range[dateRange.field].lte = dateRange.to;
    }
    if (dateRange.format) {
        rangeFilter.range[dateRange.field].format = dateRange.format;
    }
    filter.push(rangeFilter);
    return {
        ...query,
        bool: {
            ...query.bool,
            filter,
        },
    };
};
exports.applyDateRangeFilter = applyDateRangeFilter;
// ============================================================================
// SEARCH PAGINATION
// ============================================================================
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
const buildCursorPagination = (options) => {
    return {
        size: options.size,
        search_after: options.searchAfter,
        sort: options.sort,
    };
};
exports.buildCursorPagination = buildCursorPagination;
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
const extractCursor = (hits) => {
    if (!hits || hits.length === 0)
        return null;
    const lastHit = hits[hits.length - 1];
    return lastHit.sort || null;
};
exports.extractCursor = extractCursor;
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
const scrollSearch = async function* (client, options) {
    const scrollTime = options.scrollTime || '2m';
    const size = options.batchSize || 1000;
    let response = await client.search({
        index: options.indexName,
        scroll: scrollTime,
        body: {
            query: options.query,
            size,
        },
    });
    while (response.hits.hits.length > 0) {
        yield response.hits.hits;
        response = await client.scroll({
            scroll_id: response._scroll_id,
            scroll: scrollTime,
        });
    }
    if (response._scroll_id) {
        await client.clearScroll({ scroll_id: response._scroll_id });
    }
};
exports.scrollSearch = scrollSearch;
// ============================================================================
// SEARCH RESULT RANKING
// ============================================================================
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
const rerankResults = (hits, config) => {
    return hits
        .map((hit) => {
        let finalScore = hit.score;
        // Apply field boosts
        if (config.boosts) {
            Object.entries(config.boosts).forEach(([field, boost]) => {
                if (hit.data && hit.data[field]) {
                    finalScore *= boost;
                }
            });
        }
        // Apply decay functions
        if (config.decayFunctions) {
            config.decayFunctions.forEach((decay) => {
                if (hit.data && hit.data[decay.field]) {
                    const fieldValue = hit.data[decay.field];
                    const distance = Math.abs(Number(fieldValue) - Number(decay.origin));
                    const decayFactor = Math.exp(-Math.log(1 / decay.decay) * (distance / Number(decay.scale)));
                    finalScore *= decayFactor;
                }
            });
        }
        return { ...hit, score: finalScore };
    })
        .sort((a, b) => b.score - a.score);
};
exports.rerankResults = rerankResults;
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
const personalizeResults = (hits, userProfile) => {
    const boostFactor = userProfile.boostFactor || 1.5;
    return hits
        .map((hit) => {
        let score = hit.score;
        // Boost based on preferences
        if (userProfile.preferences && hit.data) {
            Object.entries(userProfile.preferences).forEach(([key, value]) => {
                if (hit.data[key] === value) {
                    score *= boostFactor;
                }
            });
        }
        // Boost based on history
        if (userProfile.history && userProfile.history.includes(hit.id)) {
            score *= boostFactor;
        }
        return { ...hit, score };
    })
        .sort((a, b) => b.score - a.score);
};
exports.personalizeResults = personalizeResults;
// ============================================================================
// SEARCH ANALYTICS
// ============================================================================
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
const trackSearchAnalytics = async (SearchQueryModel, analytics, transaction) => {
    return SearchQueryModel.create({
        query: analytics.query,
        normalizedQuery: analytics.query.toLowerCase().trim(),
        userId: analytics.userId,
        sessionId: analytics.sessionId,
        resultCount: analytics.resultCount,
        clickedResults: analytics.clickedResults,
        clickPosition: analytics.clickedResults ? 0 : null,
        responseTime: analytics.responseTime,
        filters: analytics.filters,
        successful: analytics.resultCount > 0,
        createdAt: analytics.timestamp,
    }, { transaction });
};
exports.trackSearchAnalytics = trackSearchAnalytics;
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
const getPopularSearches = async (SearchQueryModel, options = {}) => {
    const sequelize = SearchQueryModel.sequelize;
    const timeRangeDays = options.timeRange || 30;
    const cutoffDate = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000);
    return sequelize.query(`
    SELECT
      normalized_query as query,
      COUNT(*) as search_count,
      AVG(result_count) as avg_results,
      AVG(response_time) as avg_response_time
    FROM search_queries
    WHERE created_at >= :cutoffDate
      AND successful = true
    GROUP BY normalized_query
    HAVING COUNT(*) >= :minCount
    ORDER BY search_count DESC
    LIMIT :limit
  `, {
        replacements: {
            cutoffDate,
            minCount: options.minCount || 1,
            limit: options.limit || 10,
        },
        type: 'SELECT',
    });
};
exports.getPopularSearches = getPopularSearches;
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
const calculateSearchCTR = async (SearchQueryModel, options = {}) => {
    const timeRangeDays = options.timeRange || 30;
    const cutoffDate = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000);
    const where = {
        createdAt: { [sequelize_1.Op.gte]: cutoffDate },
        successful: true,
    };
    if (options.userId) {
        where.userId = options.userId;
    }
    const totalSearches = await SearchQueryModel.count({ where });
    const searchesWithClicks = await SearchQueryModel.count({
        where: {
            ...where,
            clickedResults: { [sequelize_1.Op.ne]: null },
        },
    });
    return totalSearches > 0 ? searchesWithClicks / totalSearches : 0;
};
exports.calculateSearchCTR = calculateSearchCTR;
// ============================================================================
// TYPO TOLERANCE AND SPELL CHECKING
// ============================================================================
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
const spellCheck = (query, dictionary, maxDistance = 2) => {
    const suggestions = [];
    dictionary.forEach((term) => {
        const distance = (0, exports.levenshteinDistance)(query.toLowerCase(), term.toLowerCase());
        if (distance <= maxDistance && distance > 0) {
            const score = 1 - distance / Math.max(query.length, term.length);
            suggestions.push({ text: term, score });
        }
    });
    suggestions.sort((a, b) => b.score - a.score);
    return {
        original: query,
        suggestions: suggestions.slice(0, 5),
        corrected: suggestions.length > 0 && suggestions[0].score > 0.8 ? suggestions[0].text : undefined,
    };
};
exports.spellCheck = spellCheck;
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
const buildTypoTolerantQuery = (query, options) => {
    return {
        multi_match: {
            query,
            fields: options.fields,
            fuzziness: options.fuzziness || 'AUTO',
            prefix_length: options.prefixLength || 2,
            max_expansions: options.maxExpansions || 50,
            type: 'best_fields',
        },
    };
};
exports.buildTypoTolerantQuery = buildTypoTolerantQuery;
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
const generateQueryCorrections = (query, corpus, ngramSize = 2) => {
    const queryNgrams = (0, exports.generateNgrams)(query, ngramSize);
    const candidates = corpus
        .map((term) => {
        const termNgrams = (0, exports.generateNgrams)(term, ngramSize);
        const commonNgrams = queryNgrams.filter((ng) => termNgrams.includes(ng));
        const similarity = commonNgrams.length / Math.max(queryNgrams.length, termNgrams.length);
        return { term, similarity };
    })
        .filter((c) => c.similarity > 0.5)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map((c) => c.term);
    return candidates;
};
exports.generateQueryCorrections = generateQueryCorrections;
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
const generateNgrams = (text, n) => {
    const ngrams = [];
    const normalized = text.toLowerCase();
    for (let i = 0; i <= normalized.length - n; i++) {
        ngrams.push(normalized.slice(i, i + n));
    }
    return ngrams;
};
exports.generateNgrams = generateNgrams;
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
const normalizeSearchQuery = (query, options = {}) => {
    let normalized = query;
    if (options.lowercase !== false) {
        normalized = normalized.toLowerCase();
    }
    if (options.removeSpecialChars !== false) {
        normalized = normalized.replace(/[^a-z0-9\s]/gi, ' ');
    }
    if (options.removeDuplicateSpaces !== false) {
        normalized = normalized.replace(/\s+/g, ' ').trim();
    }
    return normalized;
};
exports.normalizeSearchQuery = normalizeSearchQuery;
//# sourceMappingURL=search-filter-kit.js.map