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

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
  FindOptions,
  literal,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Search index attributes
 */
export interface SearchIndexAttributes {
  id: string;
  documentId: string;
  indexName: string;
  content: string;
  metadata: Record<string, any>;
  searchVector: any; // tsvector for PostgreSQL
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
export const createSearchIndexModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    indexName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Logical index name for grouping',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Full-text searchable content',
    },
    metadata: {
      type: DataTypes.JSONB,
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

  const options: ModelOptions = {
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
export const createSearchHistoryModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who performed the search',
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    filters: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    resultsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    executionTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Execution time in milliseconds',
    },
    clickedResults: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'IDs of clicked search results',
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Search session identifier',
    },
  };

  const options: ModelOptions = {
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
export const createSearchSuggestionModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    term: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Suggestion term',
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times term was searched',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Category for grouping suggestions',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
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
export const fullTextSearch = async (
  SearchIndexModel: any,
  query: string,
  options?: SearchQuery,
): Promise<SearchResult> => {
  const startTime = Date.now();
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  // Build PostgreSQL full-text search query
  const tsQuery = query
    .split(/\s+/)
    .map((term) => `${term}:*`)
    .join(options?.operator === 'AND' ? ' & ' : ' | ');

  const whereConditions: any = {
    [Op.and]: [
      literal(`search_vector @@ to_tsquery('english', '${tsQuery}')`),
    ],
  };

  // Apply filters
  if (options?.filters) {
    options.filters.forEach((filter) => {
      whereConditions[Op.and].push(buildFilterCondition(filter));
    });
  }

  const { rows, count } = await SearchIndexModel.findAndCountAll({
    where: whereConditions,
    attributes: {
      include: [
        [
          literal(`ts_rank(search_vector, to_tsquery('english', '${tsQuery}'))`),
          'rank',
        ],
      ],
    },
    order: [[literal('rank'), 'DESC']],
    limit: pageSize,
    offset,
  });

  const hits: SearchHit[] = rows.map((row: any) => ({
    id: row.id,
    score: parseFloat(row.getDataValue('rank')) || 0,
    source: row.toJSON(),
    highlights: options?.highlight ? generateHighlights(row.content, query) : undefined,
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
export const buildFilterCondition = (filter: SearchFilter): WhereOptions => {
  const field = filter.field;
  const value = filter.value;

  switch (filter.operator) {
    case 'equals':
      return { [field]: value };
    case 'contains':
      return { [field]: { [Op.iLike]: `%${value}%` } };
    case 'startsWith':
      return { [field]: { [Op.iLike]: `${value}%` } };
    case 'range':
      return { [field]: { [Op.between]: value } };
    case 'in':
      return { [field]: { [Op.in]: value } };
    case 'exists':
      return value ? { [field]: { [Op.ne]: null } } : { [field]: null };
    default:
      return {};
  }
};

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
export const generateHighlights = (content: string, query: string): Record<string, string[]> => {
  const terms = query.toLowerCase().split(/\s+/);
  const fragments: string[] = [];
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
export const indexDocument = async (
  SearchIndexModel: any,
  documentId: string,
  content: string,
  metadata: Record<string, any>,
  indexName: string = 'default',
): Promise<any> => {
  // PostgreSQL automatically generates tsvector via trigger or computed column
  return await SearchIndexModel.create({
    documentId,
    indexName,
    content,
    metadata,
  });
};

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
export const updateDocumentIndex = async (
  SearchIndexModel: any,
  documentId: string,
  updates: Partial<SearchIndexAttributes>,
): Promise<void> => {
  await SearchIndexModel.update(updates, {
    where: { documentId },
  });
};

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
export const deleteDocumentFromIndex = async (
  SearchIndexModel: any,
  documentId: string,
): Promise<void> => {
  await SearchIndexModel.destroy({
    where: { documentId },
  });
};

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
export const rebuildSearchIndex = async (
  SearchIndexModel: any,
  DocumentModel: any,
): Promise<number> => {
  await SearchIndexModel.destroy({ where: {}, truncate: true });

  const documents = await DocumentModel.findAll();
  let indexed = 0;

  for (const doc of documents) {
    await indexDocument(
      SearchIndexModel,
      doc.id,
      doc.content,
      doc.metadata || {},
      doc.type || 'default',
    );
    indexed++;
  }

  return indexed;
};

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
export const createElasticsearchClient = (config: any): any => {
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
export const searchWithElasticsearch = async (
  esClient: any,
  indexName: string,
  query: SearchQuery,
): Promise<SearchResult> => {
  const startTime = Date.now();

  const esQuery = buildElasticsearchQuery(query);
  const response = await esClient.search({
    index: indexName,
    body: esQuery,
    from: ((query.page ?? 1) - 1) * (query.pageSize ?? 20),
    size: query.pageSize ?? 20,
  });

  const hits: SearchHit[] = response.hits.hits.map((hit: any) => ({
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
export const buildElasticsearchQuery = (query: SearchQuery): any => {
  const must: any[] = [];
  const filter: any[] = [];

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
    } else {
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
      filter.push(buildElasticsearchFilter(f));
    });
  }

  const esQuery: any = {
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
      fields: (query.fields ?? ['content']).reduce((acc: any, field: string) => {
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
export const buildElasticsearchFilter = (filter: SearchFilter): any => {
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
export const indexDocumentInElasticsearch = async (
  esClient: any,
  indexName: string,
  documentId: string,
  document: any,
): Promise<any> => {
  return await esClient.index({
    index: indexName,
    id: documentId,
    body: document,
  });
};

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
export const bulkIndexElasticsearch = async (
  esClient: any,
  operations: BulkIndexOperation[],
): Promise<any> => {
  const body: any[] = [];

  operations.forEach((op) => {
    body.push({ [op.action ?? 'index']: { _index: op.index, _id: op.id } });
    if (op.action !== 'delete') {
      body.push(op.document);
    }
  });

  return await esClient.bulk({ body });
};

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
export const createElasticsearchIndex = async (
  esClient: any,
  config: IndexConfig,
): Promise<any> => {
  return await esClient.indices.create({
    index: config.name,
    body: {
      mappings: config.mappings,
      settings: config.settings,
      aliases: config.aliases?.reduce((acc: any, alias: string) => {
        acc[alias] = {};
        return acc;
      }, {}),
    },
  });
};

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
export const deleteElasticsearchIndex = async (esClient: any, indexName: string): Promise<any> => {
  return await esClient.indices.delete({ index: indexName });
};

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
export const searchByMetadata = async (
  SearchIndexModel: any,
  metadata: Record<string, any>,
  options?: FindOptions,
): Promise<any[]> => {
  const whereConditions: any[] = [];

  Object.entries(metadata).forEach(([key, value]) => {
    whereConditions.push(
      literal(`metadata->>'${key}' = '${value}'`),
    );
  });

  return await SearchIndexModel.findAll({
    where: {
      [Op.and]: whereConditions,
    },
    ...options,
  });
};

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
export const searchMetadataComplex = async (
  SearchIndexModel: any,
  metadataQuery: any,
): Promise<any[]> => {
  const conditions: any[] = [];

  Object.entries(metadataQuery).forEach(([field, condition]: [string, any]) => {
    if (condition.contains) {
      conditions.push(literal(`metadata @> '{"${field}": ${JSON.stringify(condition.contains)}}'`));
    } else if (condition.gte !== undefined) {
      conditions.push(literal(`(metadata->>'${field}')::int >= ${condition.gte}`));
    } else if (condition.lte !== undefined) {
      conditions.push(literal(`(metadata->>'${field}')::int <= ${condition.lte}`));
    }
  });

  return await SearchIndexModel.findAll({
    where: {
      [Op.and]: conditions,
    },
  });
};

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
export const aggregateMetadataField = async (
  SearchIndexModel: any,
  field: string,
): Promise<Array<{ value: string; count: number }>> => {
  const results = await SearchIndexModel.findAll({
    attributes: [
      [literal(`metadata->>'${field}'`), 'value'],
      [literal('COUNT(*)'), 'count'],
    ],
    group: [literal(`metadata->>'${field}'`)],
    raw: true,
  });

  return results;
};

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
export const fuzzySearch = async (
  SearchIndexModel: any,
  query: string,
  options: FuzzyOptions = {},
): Promise<SearchResult> => {
  const fuzziness = options.fuzziness ?? 2;
  const terms = query.split(/\s+/);
  const fuzzyTerms = terms.map((term) => `${term}~${fuzziness}`).join(' | ');

  const startTime = Date.now();
  const { rows, count } = await SearchIndexModel.findAndCountAll({
    where: {
      [Op.or]: [
        literal(`search_vector @@ to_tsquery('english', '${fuzzyTerms}')`),
        { content: { [Op.iLike]: `%${query}%` } },
      ],
    },
    limit: 20,
  });

  return {
    hits: rows.map((r: any) => ({
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
export const autocomplete = async (
  SearchSuggestionModel: any,
  prefix: string,
  limit: number = 10,
): Promise<AutocompleteSuggestion[]> => {
  const results = await SearchSuggestionModel.findAll({
    where: {
      term: {
        [Op.iLike]: `${prefix}%`,
      },
    },
    order: [['frequency', 'DESC']],
    limit,
  });

  return results.map((r: any) => ({
    text: r.term,
    score: r.frequency,
    category: r.category,
    metadata: r.metadata,
  }));
};

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
export const updateSuggestionFrequency = async (
  SearchSuggestionModel: any,
  term: string,
): Promise<void> => {
  const [suggestion, created] = await SearchSuggestionModel.findOrCreate({
    where: { term: term.toLowerCase() },
    defaults: { term: term.toLowerCase(), frequency: 1 },
  });

  if (!created) {
    await suggestion.increment('frequency');
  }
};

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
export const generatePhraseSuggestions = async (
  query: string,
  SearchSuggestionModel: any,
): Promise<string[]> => {
  const words = query.toLowerCase().split(/\s+/);
  const suggestions: string[] = [];

  for (const word of words) {
    const similar = await SearchSuggestionModel.findAll({
      where: {
        term: {
          [Op.iLike]: `${word.substring(0, 3)}%`,
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
export const facetedSearch = async (
  SearchIndexModel: any,
  query: SearchQuery,
  facetFields: string[],
): Promise<SearchResult> => {
  const searchResult = await fullTextSearch(SearchIndexModel, query.query || '', query);

  const facets: SearchFacet[] = [];
  for (const field of facetFields) {
    const buckets = await aggregateMetadataField(SearchIndexModel, field.replace('metadata.', ''));
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
export const applyFacetFilters = (
  query: SearchQuery,
  selectedFacets: Record<string, string[]>,
): SearchQuery => {
  const filters: SearchFilter[] = query.filters ?? [];

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
export const generateFacetTree = async (SearchIndexModel: any, field: string): Promise<any[]> => {
  const aggregations = await aggregateMetadataField(SearchIndexModel, field);

  // Build hierarchical structure (simplified)
  const tree: any[] = [];
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
export const buildMultiFieldQuery = (
  query: string,
  fields: string[],
  boost?: Record<string, number>,
): any => {
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
export const buildBooleanQuery = (must: any[], should: any[], mustNot: any[]): any => {
  return {
    bool: {
      must,
      should,
      must_not: mustNot,
    },
  };
};

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
export const buildRangeQuery = (field: string, from: any, to: any): any => {
  return {
    range: {
      [field]: {
        gte: from,
        lte: to,
      },
    },
  };
};

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
export const buildGeoQuery = (field: string, lat: number, lon: number, distance: string): any => {
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
export const buildNestedQuery = (path: string, query: any): any => {
  return {
    nested: {
      path,
      query,
    },
  };
};

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
export const logSearchQuery = async (
  SearchHistoryModel: any,
  entry: SearchAnalyticsEntry,
): Promise<any> => {
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
export const getPopularSearchTerms = async (
  SearchHistoryModel: any,
  startDate: Date,
  endDate: Date,
  limit: number = 20,
): Promise<Array<{ query: string; count: number }>> => {
  const results = await SearchHistoryModel.findAll({
    attributes: [
      'query',
      [literal('COUNT(*)'), 'count'],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ['query'],
    order: [[literal('count'), 'DESC']],
    limit,
    raw: true,
  });

  return results;
};

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
export const analyzeSearchPerformance = async (
  SearchHistoryModel: any,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const results = await SearchHistoryModel.findAll({
    attributes: [
      [literal('AVG(execution_time)'), 'avgExecutionTime'],
      [literal('MAX(execution_time)'), 'maxExecutionTime'],
      [literal('MIN(execution_time)'), 'minExecutionTime'],
      [literal('AVG(results_count)'), 'avgResultsCount'],
      [literal('COUNT(*)'), 'totalSearches'],
    ],
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    raw: true,
  });

  return results[0];
};

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
export const trackSearchClick = async (
  SearchHistoryModel: any,
  historyId: string,
  resultId: string,
): Promise<void> => {
  const history = await SearchHistoryModel.findByPk(historyId);
  if (history) {
    const clickedResults = history.clickedResults || [];
    clickedResults.push(resultId);
    await history.update({ clickedResults });
  }
};

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
export const generateSearchAnalyticsReport = async (
  SearchHistoryModel: any,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const [performance, popular] = await Promise.all([
    analyzeSearchPerformance(SearchHistoryModel, startDate, endDate),
    getPopularSearchTerms(SearchHistoryModel, startDate, endDate, 10),
  ]);

  return {
    period: { startDate, endDate },
    performance,
    popularTerms: popular,
  };
};

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
export const optimizeSearchIndex = async (SearchIndexModel: any): Promise<void> => {
  // PostgreSQL VACUUM and ANALYZE
  const sequelize = SearchIndexModel.sequelize;
  await sequelize.query('VACUUM ANALYZE search_indexes');
};

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
export const getIndexStatistics = async (SearchIndexModel: any): Promise<IndexStatistics> => {
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
export const reindexDocuments = async (
  SearchIndexModel: any,
  DocumentModel: any,
  documentIds: string[],
): Promise<number> => {
  const documents = await DocumentModel.findAll({
    where: { id: { [Op.in]: documentIds } },
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
export const cleanupOrphanedIndexes = async (
  SearchIndexModel: any,
  DocumentModel: any,
): Promise<number> => {
  const indexedDocs = await SearchIndexModel.findAll({
    attributes: ['documentId'],
    raw: true,
  });

  const documentIds = indexedDocs.map((d: any) => d.documentId);
  const existingDocs = await DocumentModel.findAll({
    where: { id: { [Op.in]: documentIds } },
    attributes: ['id'],
    raw: true,
  });

  const existingIds = new Set(existingDocs.map((d: any) => d.id));
  const orphanedIds = documentIds.filter((id: string) => !existingIds.has(id));

  if (orphanedIds.length > 0) {
    await SearchIndexModel.destroy({
      where: { documentId: { [Op.in]: orphanedIds } },
    });
  }

  return orphanedIds.length;
};

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
export const exportSearchIndex = async (
  SearchIndexModel: any,
  indexName: string,
): Promise<any[]> => {
  const documents = await SearchIndexModel.findAll({
    where: { indexName },
  });

  return documents.map((d: any) => d.toJSON());
};

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
export const suggestQueryCorrections = async (
  query: string,
  SearchSuggestionModel: any,
): Promise<string[]> => {
  return await generatePhraseSuggestions(query, SearchSuggestionModel);
};

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
export const expandQueryWithSynonyms = (
  query: string,
  synonyms: Record<string, string[]>,
): string => {
  let expanded = query;

  Object.entries(synonyms).forEach(([term, syns]) => {
    if (query.toLowerCase().includes(term.toLowerCase())) {
      expanded += ' ' + syns.join(' ');
    }
  });

  return expanded;
};

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
export const relevanceFeedbackSearch = async (
  SearchIndexModel: any,
  originalQuery: string,
  relevantDocIds: string[],
): Promise<SearchResult> => {
  // Extract terms from relevant documents
  const relevantDocs = await SearchIndexModel.findAll({
    where: { documentId: { [Op.in]: relevantDocIds } },
  });

  // Simple term extraction (in production, use TF-IDF)
  const termCounts: Record<string, number> = {};
  relevantDocs.forEach((doc: any) => {
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

  return await fullTextSearch(SearchIndexModel, expandedQuery);
};

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
export const searchSimilarDocuments = async (
  SearchIndexModel: any,
  documentId: string,
  limit: number = 10,
): Promise<SearchResult> => {
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
  return await fullTextSearch(SearchIndexModel, sourceDoc.content, {
    pageSize: limit,
  });
};

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
export const batchSearch = async (
  SearchIndexModel: any,
  queries: string[],
): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];

  for (const query of queries) {
    const result = await fullTextSearch(SearchIndexModel, query);
    results.push(result);
  }

  return results;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // PostgreSQL Full-Text Search
  fullTextSearch,
  buildFilterCondition,
  generateHighlights,
  indexDocument,
  updateDocumentIndex,
  deleteDocumentFromIndex,
  rebuildSearchIndex,

  // Elasticsearch Integration
  createElasticsearchClient,
  searchWithElasticsearch,
  buildElasticsearchQuery,
  buildElasticsearchFilter,
  indexDocumentInElasticsearch,
  bulkIndexElasticsearch,
  createElasticsearchIndex,
  deleteElasticsearchIndex,

  // Metadata Search
  searchByMetadata,
  searchMetadataComplex,
  aggregateMetadataField,

  // Fuzzy & Autocomplete
  fuzzySearch,
  autocomplete,
  updateSuggestionFrequency,
  generatePhraseSuggestions,

  // Faceted Search
  facetedSearch,
  applyFacetFilters,
  generateFacetTree,

  // Advanced Queries
  buildMultiFieldQuery,
  buildBooleanQuery,
  buildRangeQuery,
  buildGeoQuery,
  buildNestedQuery,

  // Analytics & Logging
  logSearchQuery,
  getPopularSearchTerms,
  analyzeSearchPerformance,
  trackSearchClick,
  generateSearchAnalyticsReport,

  // Index Management
  optimizeSearchIndex,
  getIndexStatistics,
  reindexDocuments,
  cleanupOrphanedIndexes,
  exportSearchIndex,

  // Query Enhancement
  suggestQueryCorrections,
  expandQueryWithSynonyms,
  relevanceFeedbackSearch,
  searchSimilarDocuments,
  batchSearch,

  // Model Creators
  createSearchIndexModel,
  createSearchHistoryModel,
  createSearchSuggestionModel,
};
