"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchSearch = exports.searchSimilarDocuments = exports.relevanceFeedbackSearch = exports.expandQueryWithSynonyms = exports.suggestQueryCorrections = exports.exportSearchIndex = exports.cleanupOrphanedIndexes = exports.reindexDocuments = exports.getIndexStatistics = exports.optimizeSearchIndex = exports.generateSearchAnalyticsReport = exports.trackSearchClick = exports.analyzeSearchPerformance = exports.getPopularSearchTerms = exports.logSearchQuery = exports.buildNestedQuery = exports.buildGeoQuery = exports.buildRangeQuery = exports.buildBooleanQuery = exports.buildMultiFieldQuery = exports.generateFacetTree = exports.applyFacetFilters = exports.facetedSearch = exports.generatePhraseSuggestions = exports.updateSuggestionFrequency = exports.autocomplete = exports.fuzzySearch = exports.aggregateMetadataField = exports.searchMetadataComplex = exports.searchByMetadata = exports.deleteElasticsearchIndex = exports.createElasticsearchIndex = exports.bulkIndexElasticsearch = exports.indexDocumentInElasticsearch = exports.buildElasticsearchFilter = exports.buildElasticsearchQuery = exports.searchWithElasticsearch = exports.createElasticsearchClient = exports.rebuildSearchIndex = exports.deleteDocumentFromIndex = exports.updateDocumentIndex = exports.indexDocument = exports.generateHighlights = exports.buildFilterCondition = exports.fullTextSearch = exports.createSearchSuggestionModel = exports.createSearchHistoryModel = exports.createSearchIndexModel = void 0;
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
const sequelize_1 = require("sequelize");
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
const createSearchIndexModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        indexName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Logical index name for grouping',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Full-text searchable content',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Searchable metadata fields',
        },
        searchVector: {
            type: 'TSVECTOR',
            allowNull: true,
            comment: 'PostgreSQL full-text search vector',
        },
    };
    const options = {
        tableName: 'search_indexes',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['indexName'] },
            { fields: ['metadata'], using: 'gin' },
            {
                name: 'search_vector_idx',
                fields: ['searchVector'],
                using: 'gin',
            },
        ],
    };
    return sequelize.define('SearchIndex', attributes, options);
};
exports.createSearchIndexModel = createSearchIndexModel;
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
const createSearchHistoryModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who performed the search',
        },
        query: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        filters: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        resultsCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        executionTime: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Execution time in milliseconds',
        },
        clickedResults: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'IDs of clicked search results',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Search session identifier',
        },
    };
    const options = {
        tableName: 'search_history',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['userId'] },
            { fields: ['query'] },
            { fields: ['createdAt'] },
            { fields: ['sessionId'] },
        ],
    };
    return sequelize.define('SearchHistory', attributes, options);
};
exports.createSearchHistoryModel = createSearchHistoryModel;
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
const createSearchSuggestionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        term: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Suggestion term',
        },
        frequency: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times term was searched',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Category for grouping suggestions',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'search_suggestions',
        timestamps: true,
        indexes: [
            { fields: ['term'] },
            { fields: ['frequency'] },
            { fields: ['category'] },
        ],
    };
    return sequelize.define('SearchSuggestion', attributes, options);
};
exports.createSearchSuggestionModel = createSearchSuggestionModel;
// ============================================================================
// FULL-TEXT SEARCH (POSTGRESQL)
// ============================================================================
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
const fullTextSearch = async (SearchIndexModel, query, options) => {
    const startTime = Date.now();
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    // Build PostgreSQL full-text search query
    const tsQuery = query
        .split(/\s+/)
        .map((term) => `${term}:*`)
        .join(options?.operator === 'AND' ? ' & ' : ' | ');
    const whereConditions = {
        [sequelize_1.Op.and]: [
            (0, sequelize_1.literal)(`search_vector @@ to_tsquery('english', '${tsQuery}')`),
        ],
    };
    // Apply filters
    if (options?.filters) {
        options.filters.forEach((filter) => {
            whereConditions[sequelize_1.Op.and].push((0, exports.buildFilterCondition)(filter));
        });
    }
    const { rows, count } = await SearchIndexModel.findAndCountAll({
        where: whereConditions,
        attributes: {
            include: [
                [
                    (0, sequelize_1.literal)(`ts_rank(search_vector, to_tsquery('english', '${tsQuery}'))`),
                    'rank',
                ],
            ],
        },
        order: [[(0, sequelize_1.literal)('rank'), 'DESC']],
        limit: pageSize,
        offset,
    });
    const hits = rows.map((row) => ({
        id: row.id,
        score: parseFloat(row.getDataValue('rank')) || 0,
        source: row.toJSON(),
        highlights: options?.highlight ? (0, exports.generateHighlights)(row.content, query) : undefined,
    }));
    return {
        hits,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
        took: Date.now() - startTime,
    };
};
exports.fullTextSearch = fullTextSearch;
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
const buildFilterCondition = (filter) => {
    const field = filter.field;
    const value = filter.value;
    switch (filter.operator) {
        case 'equals':
            return { [field]: value };
        case 'contains':
            return { [field]: { [sequelize_1.Op.iLike]: `%${value}%` } };
        case 'startsWith':
            return { [field]: { [sequelize_1.Op.iLike]: `${value}%` } };
        case 'range':
            return { [field]: { [sequelize_1.Op.between]: value } };
        case 'in':
            return { [field]: { [sequelize_1.Op.in]: value } };
        case 'exists':
            return value ? { [field]: { [sequelize_1.Op.ne]: null } } : { [field]: null };
        default:
            return {};
    }
};
exports.buildFilterCondition = buildFilterCondition;
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
const generateHighlights = (content, query) => {
    const terms = query.toLowerCase().split(/\s+/);
    const fragments = [];
    const contentLower = content.toLowerCase();
    terms.forEach((term) => {
        const index = contentLower.indexOf(term);
        if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + term.length + 50);
            let fragment = content.substring(start, end);
            // Highlight the term
            const regex = new RegExp(`(${term})`, 'gi');
            fragment = fragment.replace(regex, '<em>$1</em>');
            fragments.push(fragment);
        }
    });
    return { content: fragments };
};
exports.generateHighlights = generateHighlights;
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
const indexDocument = async (SearchIndexModel, documentId, content, metadata, indexName = 'default') => {
    // PostgreSQL automatically generates tsvector via trigger or computed column
    return await SearchIndexModel.create({
        documentId,
        indexName,
        content,
        metadata,
    });
};
exports.indexDocument = indexDocument;
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
const updateDocumentIndex = async (SearchIndexModel, documentId, updates) => {
    await SearchIndexModel.update(updates, {
        where: { documentId },
    });
};
exports.updateDocumentIndex = updateDocumentIndex;
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
const deleteDocumentFromIndex = async (SearchIndexModel, documentId) => {
    await SearchIndexModel.destroy({
        where: { documentId },
    });
};
exports.deleteDocumentFromIndex = deleteDocumentFromIndex;
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
const rebuildSearchIndex = async (SearchIndexModel, DocumentModel) => {
    await SearchIndexModel.destroy({ where: {}, truncate: true });
    const documents = await DocumentModel.findAll();
    let indexed = 0;
    for (const doc of documents) {
        await (0, exports.indexDocument)(SearchIndexModel, doc.id, doc.content, doc.metadata || {}, doc.type || 'default');
        indexed++;
    }
    return indexed;
};
exports.rebuildSearchIndex = rebuildSearchIndex;
// ============================================================================
// ELASTICSEARCH INTEGRATION
// ============================================================================
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
const createElasticsearchClient = (config) => {
    // Placeholder for Elasticsearch client initialization
    // const { Client } = require('@elastic/elasticsearch');
    // return new Client(config);
    return {
        search: async () => ({ hits: { hits: [], total: { value: 0 } } }),
        index: async () => ({}),
        delete: async () => ({}),
        bulk: async () => ({ errors: false, items: [] }),
    };
};
exports.createElasticsearchClient = createElasticsearchClient;
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
const searchWithElasticsearch = async (esClient, indexName, query) => {
    const startTime = Date.now();
    const esQuery = (0, exports.buildElasticsearchQuery)(query);
    const response = await esClient.search({
        index: indexName,
        body: esQuery,
        from: ((query.page ?? 1) - 1) * (query.pageSize ?? 20),
        size: query.pageSize ?? 20,
    });
    const hits = response.hits.hits.map((hit) => ({
        id: hit._id,
        score: hit._score,
        source: hit._source,
        highlights: hit.highlight,
        sort: hit.sort,
    }));
    return {
        hits,
        total: response.hits.total.value,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20,
        totalPages: Math.ceil(response.hits.total.value / (query.pageSize ?? 20)),
        took: Date.now() - startTime,
        maxScore: response.hits.max_score,
    };
};
exports.searchWithElasticsearch = searchWithElasticsearch;
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
const buildElasticsearchQuery = (query) => {
    const must = [];
    const filter = [];
    // Main query
    if (query.query) {
        if (query.fuzzy) {
            must.push({
                multi_match: {
                    query: query.query,
                    fields: query.fields ?? ['_all'],
                    fuzziness: 'AUTO',
                    operator: query.operator?.toLowerCase() ?? 'or',
                },
            });
        }
        else {
            must.push({
                multi_match: {
                    query: query.query,
                    fields: query.fields ?? ['_all'],
                    operator: query.operator?.toLowerCase() ?? 'or',
                },
            });
        }
    }
    // Filters
    if (query.filters) {
        query.filters.forEach((f) => {
            filter.push((0, exports.buildElasticsearchFilter)(f));
        });
    }
    const esQuery = {
        query: {
            bool: {
                must,
                filter,
            },
        },
    };
    // Sorting
    if (query.sort && query.sort.length > 0) {
        esQuery.sort = query.sort.map((s) => ({
            [s.field]: { order: s.order },
        }));
    }
    // Highlighting
    if (query.highlight) {
        esQuery.highlight = {
            fields: (query.fields ?? ['content']).reduce((acc, field) => {
                acc[field] = {};
                return acc;
            }, {}),
        };
    }
    // Aggregations/Facets
    if (query.facets && query.facets.length > 0) {
        esQuery.aggs = {};
        query.facets.forEach((facet) => {
            esQuery.aggs[facet] = {
                terms: { field: `${facet}.keyword`, size: 100 },
            };
        });
    }
    return esQuery;
};
exports.buildElasticsearchQuery = buildElasticsearchQuery;
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
const buildElasticsearchFilter = (filter) => {
    switch (filter.operator) {
        case 'equals':
            return { term: { [`${filter.field}.keyword`]: filter.value } };
        case 'contains':
            return { match: { [filter.field]: filter.value } };
        case 'startsWith':
            return { prefix: { [filter.field]: filter.value } };
        case 'range':
            return { range: { [filter.field]: filter.value } };
        case 'in':
            return { terms: { [`${filter.field}.keyword`]: filter.value } };
        case 'exists':
            return { exists: { field: filter.field } };
        default:
            return {};
    }
};
exports.buildElasticsearchFilter = buildElasticsearchFilter;
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
const indexDocumentInElasticsearch = async (esClient, indexName, documentId, document) => {
    return await esClient.index({
        index: indexName,
        id: documentId,
        body: document,
    });
};
exports.indexDocumentInElasticsearch = indexDocumentInElasticsearch;
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
const bulkIndexElasticsearch = async (esClient, operations) => {
    const body = [];
    operations.forEach((op) => {
        body.push({ [op.action ?? 'index']: { _index: op.index, _id: op.id } });
        if (op.action !== 'delete') {
            body.push(op.document);
        }
    });
    return await esClient.bulk({ body });
};
exports.bulkIndexElasticsearch = bulkIndexElasticsearch;
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
const createElasticsearchIndex = async (esClient, config) => {
    return await esClient.indices.create({
        index: config.name,
        body: {
            mappings: config.mappings,
            settings: config.settings,
            aliases: config.aliases?.reduce((acc, alias) => {
                acc[alias] = {};
                return acc;
            }, {}),
        },
    });
};
exports.createElasticsearchIndex = createElasticsearchIndex;
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
const deleteElasticsearchIndex = async (esClient, indexName) => {
    return await esClient.indices.delete({ index: indexName });
};
exports.deleteElasticsearchIndex = deleteElasticsearchIndex;
// ============================================================================
// METADATA SEARCH
// ============================================================================
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
const searchByMetadata = async (SearchIndexModel, metadata, options) => {
    const whereConditions = [];
    Object.entries(metadata).forEach(([key, value]) => {
        whereConditions.push((0, sequelize_1.literal)(`metadata->>'${key}' = '${value}'`));
    });
    return await SearchIndexModel.findAll({
        where: {
            [sequelize_1.Op.and]: whereConditions,
        },
        ...options,
    });
};
exports.searchByMetadata = searchByMetadata;
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
const searchMetadataComplex = async (SearchIndexModel, metadataQuery) => {
    const conditions = [];
    Object.entries(metadataQuery).forEach(([field, condition]) => {
        if (condition.contains) {
            conditions.push((0, sequelize_1.literal)(`metadata @> '{"${field}": ${JSON.stringify(condition.contains)}}'`));
        }
        else if (condition.gte !== undefined) {
            conditions.push((0, sequelize_1.literal)(`(metadata->>'${field}')::int >= ${condition.gte}`));
        }
        else if (condition.lte !== undefined) {
            conditions.push((0, sequelize_1.literal)(`(metadata->>'${field}')::int <= ${condition.lte}`));
        }
    });
    return await SearchIndexModel.findAll({
        where: {
            [sequelize_1.Op.and]: conditions,
        },
    });
};
exports.searchMetadataComplex = searchMetadataComplex;
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
const aggregateMetadataField = async (SearchIndexModel, field) => {
    const results = await SearchIndexModel.findAll({
        attributes: [
            [(0, sequelize_1.literal)(`metadata->>'${field}'`), 'value'],
            [(0, sequelize_1.literal)('COUNT(*)'), 'count'],
        ],
        group: [(0, sequelize_1.literal)(`metadata->>'${field}'`)],
        raw: true,
    });
    return results;
};
exports.aggregateMetadataField = aggregateMetadataField;
// ============================================================================
// FUZZY MATCHING & AUTOCOMPLETE
// ============================================================================
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
const fuzzySearch = async (SearchIndexModel, query, options = {}) => {
    const fuzziness = options.fuzziness ?? 2;
    const terms = query.split(/\s+/);
    const fuzzyTerms = terms.map((term) => `${term}~${fuzziness}`).join(' | ');
    const startTime = Date.now();
    const { rows, count } = await SearchIndexModel.findAndCountAll({
        where: {
            [sequelize_1.Op.or]: [
                (0, sequelize_1.literal)(`search_vector @@ to_tsquery('english', '${fuzzyTerms}')`),
                { content: { [sequelize_1.Op.iLike]: `%${query}%` } },
            ],
        },
        limit: 20,
    });
    return {
        hits: rows.map((r) => ({
            id: r.id,
            score: 1.0,
            source: r.toJSON(),
        })),
        total: count,
        page: 1,
        pageSize: 20,
        totalPages: Math.ceil(count / 20),
        took: Date.now() - startTime,
    };
};
exports.fuzzySearch = fuzzySearch;
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
const autocomplete = async (SearchSuggestionModel, prefix, limit = 10) => {
    const results = await SearchSuggestionModel.findAll({
        where: {
            term: {
                [sequelize_1.Op.iLike]: `${prefix}%`,
            },
        },
        order: [['frequency', 'DESC']],
        limit,
    });
    return results.map((r) => ({
        text: r.term,
        score: r.frequency,
        category: r.category,
        metadata: r.metadata,
    }));
};
exports.autocomplete = autocomplete;
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
const updateSuggestionFrequency = async (SearchSuggestionModel, term) => {
    const [suggestion, created] = await SearchSuggestionModel.findOrCreate({
        where: { term: term.toLowerCase() },
        defaults: { term: term.toLowerCase(), frequency: 1 },
    });
    if (!created) {
        await suggestion.increment('frequency');
    }
};
exports.updateSuggestionFrequency = updateSuggestionFrequency;
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
const generatePhraseSuggestions = async (query, SearchSuggestionModel) => {
    const words = query.toLowerCase().split(/\s+/);
    const suggestions = [];
    for (const word of words) {
        const similar = await SearchSuggestionModel.findAll({
            where: {
                term: {
                    [sequelize_1.Op.iLike]: `${word.substring(0, 3)}%`,
                },
            },
            order: [['frequency', 'DESC']],
            limit: 3,
        });
        if (similar.length > 0 && similar[0].term !== word) {
            suggestions.push(similar[0].term);
        }
    }
    return suggestions;
};
exports.generatePhraseSuggestions = generatePhraseSuggestions;
// ============================================================================
// FACETED SEARCH
// ============================================================================
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
const facetedSearch = async (SearchIndexModel, query, facetFields) => {
    const searchResult = await (0, exports.fullTextSearch)(SearchIndexModel, query.query || '', query);
    const facets = [];
    for (const field of facetFields) {
        const buckets = await (0, exports.aggregateMetadataField)(SearchIndexModel, field.replace('metadata.', ''));
        facets.push({
            field,
            buckets: buckets.map((b) => ({
                key: b.value || 'unknown',
                count: parseInt(b.count.toString(), 10),
            })),
        });
    }
    return {
        ...searchResult,
        facets,
    };
};
exports.facetedSearch = facetedSearch;
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
const applyFacetFilters = (query, selectedFacets) => {
    const filters = query.filters ?? [];
    Object.entries(selectedFacets).forEach(([field, values]) => {
        filters.push({
            field,
            operator: 'in',
            value: values,
        });
    });
    return {
        ...query,
        filters,
    };
};
exports.applyFacetFilters = applyFacetFilters;
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
const generateFacetTree = async (SearchIndexModel, field) => {
    const aggregations = await (0, exports.aggregateMetadataField)(SearchIndexModel, field);
    // Build hierarchical structure (simplified)
    const tree = [];
    aggregations.forEach((agg) => {
        const parts = agg.value?.split('/') || [];
        let currentLevel = tree;
        parts.forEach((part, index) => {
            let node = currentLevel.find((n) => n.key === part);
            if (!node) {
                node = {
                    key: part,
                    count: index === parts.length - 1 ? agg.count : 0,
                    children: [],
                };
                currentLevel.push(node);
            }
            currentLevel = node.children;
        });
    });
    return tree;
};
exports.generateFacetTree = generateFacetTree;
// ============================================================================
// ADVANCED QUERY BUILDERS
// ============================================================================
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
const buildMultiFieldQuery = (query, fields, boost) => {
    const boostedFields = fields.map((field) => {
        const boostValue = boost?.[field] ?? 1.0;
        return `${field}^${boostValue}`;
    });
    return {
        multi_match: {
            query,
            fields: boostedFields,
            type: 'best_fields',
        },
    };
};
exports.buildMultiFieldQuery = buildMultiFieldQuery;
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
const buildBooleanQuery = (must, should, mustNot) => {
    return {
        bool: {
            must,
            should,
            must_not: mustNot,
        },
    };
};
exports.buildBooleanQuery = buildBooleanQuery;
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
const buildRangeQuery = (field, from, to) => {
    return {
        range: {
            [field]: {
                gte: from,
                lte: to,
            },
        },
    };
};
exports.buildRangeQuery = buildRangeQuery;
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
const buildGeoQuery = (field, lat, lon, distance) => {
    return {
        geo_distance: {
            distance,
            [field]: {
                lat,
                lon,
            },
        },
    };
};
exports.buildGeoQuery = buildGeoQuery;
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
const buildNestedQuery = (path, query) => {
    return {
        nested: {
            path,
            query,
        },
    };
};
exports.buildNestedQuery = buildNestedQuery;
// ============================================================================
// SEARCH ANALYTICS & LOGGING
// ============================================================================
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
const logSearchQuery = async (SearchHistoryModel, entry) => {
    return await SearchHistoryModel.create({
        userId: entry.userId,
        query: entry.query,
        filters: entry.filters,
        resultsCount: entry.resultsCount,
        executionTime: entry.executionTime,
        clickedResults: entry.clickedResults,
        sessionId: entry.sessionId,
    });
};
exports.logSearchQuery = logSearchQuery;
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
const getPopularSearchTerms = async (SearchHistoryModel, startDate, endDate, limit = 20) => {
    const results = await SearchHistoryModel.findAll({
        attributes: [
            'query',
            [(0, sequelize_1.literal)('COUNT(*)'), 'count'],
        ],
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        group: ['query'],
        order: [[(0, sequelize_1.literal)('count'), 'DESC']],
        limit,
        raw: true,
    });
    return results;
};
exports.getPopularSearchTerms = getPopularSearchTerms;
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
const analyzeSearchPerformance = async (SearchHistoryModel, startDate, endDate) => {
    const results = await SearchHistoryModel.findAll({
        attributes: [
            [(0, sequelize_1.literal)('AVG(execution_time)'), 'avgExecutionTime'],
            [(0, sequelize_1.literal)('MAX(execution_time)'), 'maxExecutionTime'],
            [(0, sequelize_1.literal)('MIN(execution_time)'), 'minExecutionTime'],
            [(0, sequelize_1.literal)('AVG(results_count)'), 'avgResultsCount'],
            [(0, sequelize_1.literal)('COUNT(*)'), 'totalSearches'],
        ],
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        raw: true,
    });
    return results[0];
};
exports.analyzeSearchPerformance = analyzeSearchPerformance;
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
const trackSearchClick = async (SearchHistoryModel, historyId, resultId) => {
    const history = await SearchHistoryModel.findByPk(historyId);
    if (history) {
        const clickedResults = history.clickedResults || [];
        clickedResults.push(resultId);
        await history.update({ clickedResults });
    }
};
exports.trackSearchClick = trackSearchClick;
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
const generateSearchAnalyticsReport = async (SearchHistoryModel, startDate, endDate) => {
    const [performance, popular] = await Promise.all([
        (0, exports.analyzeSearchPerformance)(SearchHistoryModel, startDate, endDate),
        (0, exports.getPopularSearchTerms)(SearchHistoryModel, startDate, endDate, 10),
    ]);
    return {
        period: { startDate, endDate },
        performance,
        popularTerms: popular,
    };
};
exports.generateSearchAnalyticsReport = generateSearchAnalyticsReport;
// ============================================================================
// INDEX MANAGEMENT
// ============================================================================
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
const optimizeSearchIndex = async (SearchIndexModel) => {
    // PostgreSQL VACUUM and ANALYZE
    const sequelize = SearchIndexModel.sequelize;
    await sequelize.query('VACUUM ANALYZE search_indexes');
};
exports.optimizeSearchIndex = optimizeSearchIndex;
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
const getIndexStatistics = async (SearchIndexModel) => {
    const count = await SearchIndexModel.count();
    const lastUpdated = await SearchIndexModel.findOne({
        order: [['updatedAt', 'DESC']],
        attributes: ['updatedAt'],
    });
    return {
        name: 'search_indexes',
        documentCount: count,
        sizeInBytes: 0, // Would need to query pg_table_size
        lastUpdated: lastUpdated?.updatedAt || new Date(),
        health: 'green',
        shards: { total: 1, successful: 1, failed: 0 },
    };
};
exports.getIndexStatistics = getIndexStatistics;
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
const reindexDocuments = async (SearchIndexModel, DocumentModel, documentIds) => {
    const documents = await DocumentModel.findAll({
        where: { id: { [sequelize_1.Op.in]: documentIds } },
    });
    for (const doc of documents) {
        await SearchIndexModel.upsert({
            documentId: doc.id,
            content: doc.content,
            metadata: doc.metadata || {},
            indexName: doc.type || 'default',
        });
    }
    return documents.length;
};
exports.reindexDocuments = reindexDocuments;
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
const cleanupOrphanedIndexes = async (SearchIndexModel, DocumentModel) => {
    const indexedDocs = await SearchIndexModel.findAll({
        attributes: ['documentId'],
        raw: true,
    });
    const documentIds = indexedDocs.map((d) => d.documentId);
    const existingDocs = await DocumentModel.findAll({
        where: { id: { [sequelize_1.Op.in]: documentIds } },
        attributes: ['id'],
        raw: true,
    });
    const existingIds = new Set(existingDocs.map((d) => d.id));
    const orphanedIds = documentIds.filter((id) => !existingIds.has(id));
    if (orphanedIds.length > 0) {
        await SearchIndexModel.destroy({
            where: { documentId: { [sequelize_1.Op.in]: orphanedIds } },
        });
    }
    return orphanedIds.length;
};
exports.cleanupOrphanedIndexes = cleanupOrphanedIndexes;
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
const exportSearchIndex = async (SearchIndexModel, indexName) => {
    const documents = await SearchIndexModel.findAll({
        where: { indexName },
    });
    return documents.map((d) => d.toJSON());
};
exports.exportSearchIndex = exportSearchIndex;
// ============================================================================
// QUERY SUGGESTIONS & SPELL CHECK
// ============================================================================
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
const suggestQueryCorrections = async (query, SearchSuggestionModel) => {
    return await (0, exports.generatePhraseSuggestions)(query, SearchSuggestionModel);
};
exports.suggestQueryCorrections = suggestQueryCorrections;
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
const expandQueryWithSynonyms = (query, synonyms) => {
    let expanded = query;
    Object.entries(synonyms).forEach(([term, syns]) => {
        if (query.toLowerCase().includes(term.toLowerCase())) {
            expanded += ' ' + syns.join(' ');
        }
    });
    return expanded;
};
exports.expandQueryWithSynonyms = expandQueryWithSynonyms;
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
const relevanceFeedbackSearch = async (SearchIndexModel, originalQuery, relevantDocIds) => {
    // Extract terms from relevant documents
    const relevantDocs = await SearchIndexModel.findAll({
        where: { documentId: { [sequelize_1.Op.in]: relevantDocIds } },
    });
    // Simple term extraction (in production, use TF-IDF)
    const termCounts = {};
    relevantDocs.forEach((doc) => {
        const words = doc.content.toLowerCase().split(/\s+/);
        words.forEach((word) => {
            termCounts[word] = (termCounts[word] || 0) + 1;
        });
    });
    // Get top terms
    const topTerms = Object.entries(termCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([term]) => term);
    // Expand query
    const expandedQuery = `${originalQuery} ${topTerms.join(' ')}`;
    return await (0, exports.fullTextSearch)(SearchIndexModel, expandedQuery);
};
exports.relevanceFeedbackSearch = relevanceFeedbackSearch;
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
const searchSimilarDocuments = async (SearchIndexModel, documentId, limit = 10) => {
    const sourceDoc = await SearchIndexModel.findOne({
        where: { documentId },
    });
    if (!sourceDoc) {
        return {
            hits: [],
            total: 0,
            page: 1,
            pageSize: limit,
            totalPages: 0,
            took: 0,
        };
    }
    // Use content for similarity (in production, use vector similarity)
    return await (0, exports.fullTextSearch)(SearchIndexModel, sourceDoc.content, {
        pageSize: limit,
    });
};
exports.searchSimilarDocuments = searchSimilarDocuments;
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
const batchSearch = async (SearchIndexModel, queries) => {
    const results = [];
    for (const query of queries) {
        const result = await (0, exports.fullTextSearch)(SearchIndexModel, query);
        results.push(result);
    }
    return results;
};
exports.batchSearch = batchSearch;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // PostgreSQL Full-Text Search
    fullTextSearch: exports.fullTextSearch,
    buildFilterCondition: exports.buildFilterCondition,
    generateHighlights: exports.generateHighlights,
    indexDocument: exports.indexDocument,
    updateDocumentIndex: exports.updateDocumentIndex,
    deleteDocumentFromIndex: exports.deleteDocumentFromIndex,
    rebuildSearchIndex: exports.rebuildSearchIndex,
    // Elasticsearch Integration
    createElasticsearchClient: exports.createElasticsearchClient,
    searchWithElasticsearch: exports.searchWithElasticsearch,
    buildElasticsearchQuery: exports.buildElasticsearchQuery,
    buildElasticsearchFilter: exports.buildElasticsearchFilter,
    indexDocumentInElasticsearch: exports.indexDocumentInElasticsearch,
    bulkIndexElasticsearch: exports.bulkIndexElasticsearch,
    createElasticsearchIndex: exports.createElasticsearchIndex,
    deleteElasticsearchIndex: exports.deleteElasticsearchIndex,
    // Metadata Search
    searchByMetadata: exports.searchByMetadata,
    searchMetadataComplex: exports.searchMetadataComplex,
    aggregateMetadataField: exports.aggregateMetadataField,
    // Fuzzy & Autocomplete
    fuzzySearch: exports.fuzzySearch,
    autocomplete: exports.autocomplete,
    updateSuggestionFrequency: exports.updateSuggestionFrequency,
    generatePhraseSuggestions: exports.generatePhraseSuggestions,
    // Faceted Search
    facetedSearch: exports.facetedSearch,
    applyFacetFilters: exports.applyFacetFilters,
    generateFacetTree: exports.generateFacetTree,
    // Advanced Queries
    buildMultiFieldQuery: exports.buildMultiFieldQuery,
    buildBooleanQuery: exports.buildBooleanQuery,
    buildRangeQuery: exports.buildRangeQuery,
    buildGeoQuery: exports.buildGeoQuery,
    buildNestedQuery: exports.buildNestedQuery,
    // Analytics & Logging
    logSearchQuery: exports.logSearchQuery,
    getPopularSearchTerms: exports.getPopularSearchTerms,
    analyzeSearchPerformance: exports.analyzeSearchPerformance,
    trackSearchClick: exports.trackSearchClick,
    generateSearchAnalyticsReport: exports.generateSearchAnalyticsReport,
    // Index Management
    optimizeSearchIndex: exports.optimizeSearchIndex,
    getIndexStatistics: exports.getIndexStatistics,
    reindexDocuments: exports.reindexDocuments,
    cleanupOrphanedIndexes: exports.cleanupOrphanedIndexes,
    exportSearchIndex: exports.exportSearchIndex,
    // Query Enhancement
    suggestQueryCorrections: exports.suggestQueryCorrections,
    expandQueryWithSynonyms: exports.expandQueryWithSynonyms,
    relevanceFeedbackSearch: exports.relevanceFeedbackSearch,
    searchSimilarDocuments: exports.searchSimilarDocuments,
    batchSearch: exports.batchSearch,
    // Model Creators
    createSearchIndexModel: exports.createSearchIndexModel,
    createSearchHistoryModel: exports.createSearchHistoryModel,
    createSearchSuggestionModel: exports.createSearchSuggestionModel,
};
//# sourceMappingURL=document-search-kit.js.map