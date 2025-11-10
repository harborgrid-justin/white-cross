/**
 * LOC: LEGALRSCH1234567
 * File: /reuse/legal/legal-research-discovery-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../file-storage-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend legal services
 *   - E-discovery controllers
 *   - Legal research endpoints
 */
/**
 * File: /reuse/legal/legal-research-discovery-kit.ts
 * Locator: WC-LEGAL-DISC-001
 * Purpose: Comprehensive Legal Research & E-Discovery System - Enterprise-grade legal document management
 *
 * Upstream: Error handling, validation, file storage utilities
 * Downstream: ../backend/*, Legal research controllers, e-discovery services, document review platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Elasticsearch 8.x
 * Exports: 38+ utility functions for legal search, document discovery, privilege logging, production sets, redaction
 *
 * LLM Context: Enterprise legal research and e-discovery system for litigation support, regulatory compliance,
 * and legal document management. Provides advanced Boolean search, document classification, privilege review,
 * redaction management, production set creation, legal hold tracking, chain of custody, metadata extraction,
 * citation analysis, case law research, deduplication, threading, and analytics with optimized search performance.
 */
import { Sequelize } from 'sequelize';
/**
 * Boolean search operator types for advanced legal queries
 */
export type BooleanOperator = 'AND' | 'OR' | 'NOT' | 'NEAR' | 'WITHIN';
/**
 * Document classification types
 */
export type DocumentClassification = 'PRIVILEGED' | 'CONFIDENTIAL' | 'RESPONSIVE' | 'NON_RESPONSIVE' | 'HOT' | 'RELEVANT' | 'IRRELEVANT';
/**
 * Privilege types for attorney-client protection
 */
export type PrivilegeType = 'ATTORNEY_CLIENT' | 'WORK_PRODUCT' | 'JOINT_DEFENSE' | 'SETTLEMENT_NEGOTIATION' | 'TRADE_SECRET';
/**
 * Advanced legal search query structure with Boolean operators
 */
export interface LegalSearchQuery {
    queryId: string;
    queryName: string;
    searchTerms: SearchTerm[];
    booleanExpression: string;
    dateRange?: {
        startDate: Date;
        endDate: Date;
    };
    custodians?: string[];
    documentTypes?: string[];
    metadata?: Record<string, any>;
    fuzzySearch?: boolean;
    proximityDistance?: number;
}
/**
 * Individual search term with operators
 */
export interface SearchTerm {
    term: string;
    field?: string;
    operator: BooleanOperator;
    weight?: number;
    wildcard?: boolean;
    caseSensitive?: boolean;
}
/**
 * Legal search result with relevance scoring
 */
export interface LegalSearchResult {
    documentId: string;
    relevanceScore: number;
    highlights: Array<{
        field: string;
        snippet: string;
        position: number;
    }>;
    metadata: DocumentMetadata;
    classification?: DocumentClassification;
    privilegeStatus?: PrivilegeStatus;
}
/**
 * Document metadata for legal discovery
 */
export interface DocumentMetadata {
    documentId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    hash: string;
    createdDate: Date;
    modifiedDate: Date;
    author: string;
    custodian: string;
    subject?: string;
    recipients?: string[];
    attachments?: string[];
    extractedText?: string;
    language?: string;
    confidentialityLevel?: string;
}
/**
 * Privilege status and logging
 */
export interface PrivilegeStatus {
    isPrivileged: boolean;
    privilegeType?: PrivilegeType;
    privilegeDate: Date;
    reviewedBy: string;
    privilegeReason: string;
    withheld: boolean;
    logEntry?: PrivilegeLogEntry;
}
/**
 * Privilege log entry for court production
 */
export interface PrivilegeLogEntry {
    logId: string;
    documentId: string;
    batesNumber?: string;
    documentDate: Date;
    author: string;
    recipients: string[];
    subject: string;
    privilegeType: PrivilegeType;
    privilegeBasis: string;
    descriptionOfDocument: string;
    withholdingParty: string;
    loggedDate: Date;
}
/**
 * Document redaction definition
 */
export interface RedactionDefinition {
    redactionId: string;
    documentId: string;
    pageNumber: number;
    coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    redactionType: 'PRIVILEGE' | 'PII' | 'CONFIDENTIAL' | 'TRADE_SECRET';
    reason: string;
    redactedBy: string;
    redactedDate: Date;
    approved: boolean;
}
/**
 * Production set for document delivery
 */
export interface ProductionSet {
    productionId: string;
    productionName: string;
    caseNumber: string;
    requestingParty: string;
    producingParty: string;
    productionDate: Date;
    documentCount: number;
    batesRange: {
        start: string;
        end: string;
    };
    format: 'NATIVE' | 'TIFF' | 'PDF' | 'MIXED';
    loadFileIncluded: boolean;
    metadata: Record<string, any>;
    status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'DELIVERED';
}
/**
 * Discovery filter criteria
 */
export interface DiscoveryFilter {
    dateRange?: {
        startDate: Date;
        endDate: Date;
    };
    custodians?: string[];
    documentTypes?: string[];
    classifications?: DocumentClassification[];
    keywords?: string[];
    hasAttachments?: boolean;
    fileSize?: {
        min: number;
        max: number;
    };
    privilegeStatus?: 'PRIVILEGED' | 'NOT_PRIVILEGED' | 'PENDING_REVIEW';
}
/**
 * Search optimization metrics
 */
export interface SearchOptimizationMetrics {
    queryId: string;
    executionTimeMs: number;
    documentsScanned: number;
    resultsReturned: number;
    cacheHit: boolean;
    indexUsed: string[];
    optimizationSuggestions: string[];
}
/**
 * Document threading information for email chains
 */
export interface DocumentThread {
    threadId: string;
    parentDocumentId?: string;
    childDocumentIds: string[];
    threadDepth: number;
    participants: string[];
    subject: string;
    dateRange: {
        earliest: Date;
        latest: Date;
    };
}
/**
 * Legal hold notice tracking
 */
export interface LegalHoldNotice {
    holdId: string;
    caseNumber: string;
    caseName: string;
    issueDate: Date;
    expirationDate?: Date;
    custodians: string[];
    scope: string;
    status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
    acknowledgments: Array<{
        custodian: string;
        acknowledgedDate?: Date;
        acknowledged: boolean;
    }>;
}
/**
 * Chain of custody tracking
 */
export interface ChainOfCustody {
    documentId: string;
    custodyChain: Array<{
        transferId: string;
        fromParty: string;
        toParty: string;
        transferDate: Date;
        transferMethod: string;
        hash: string;
        notes?: string;
    }>;
    verified: boolean;
}
/**
 * Sequelize model for Legal Research Queries with full-text search support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalResearchQuery model
 *
 * @example
 * ```typescript
 * const LegalResearchQuery = createLegalResearchQueryModel(sequelize);
 * const query = await LegalResearchQuery.create({
 *   queryName: 'Contract Dispute Search',
 *   booleanExpression: '(contract AND breach) OR (warranty AND violation)',
 *   caseNumber: 'CV-2025-001234'
 * });
 * ```
 */
export declare const createLegalResearchQueryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        queryId: string;
        queryName: string;
        caseNumber: string | null;
        matterNumber: string | null;
        booleanExpression: string;
        searchTerms: Record<string, any>;
        filters: Record<string, any>;
        resultCount: number;
        executionTimeMs: number;
        createdBy: string;
        lastExecuted: Date | null;
        savedQuery: boolean;
        shared: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Discovery Sets with document tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DiscoverySet model
 *
 * @example
 * ```typescript
 * const DiscoverySet = createDiscoverySetModel(sequelize);
 * const set = await DiscoverySet.create({
 *   setName: 'Responsive Documents - RFP 001',
 *   caseNumber: 'CV-2025-001234',
 *   documentCount: 1547,
 *   status: 'UNDER_REVIEW'
 * });
 * ```
 */
export declare const createDiscoverySetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        setId: string;
        setName: string;
        caseNumber: string;
        matterNumber: string | null;
        setType: string;
        documentCount: number;
        documentIds: string[];
        batesRange: Record<string, any> | null;
        productionDate: Date | null;
        requestingParty: string | null;
        producingParty: string;
        status: string;
        privilegedCount: number;
        redactedCount: number;
        withheldCount: number;
        createdBy: string;
        reviewedBy: string | null;
        approvedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Privilege Log with court-ready formatting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PrivilegeLog model
 *
 * @example
 * ```typescript
 * const PrivilegeLog = createPrivilegeLogModel(sequelize);
 * const entry = await PrivilegeLog.create({
 *   caseNumber: 'CV-2025-001234',
 *   documentDate: new Date('2024-03-15'),
 *   author: 'John Smith, Esq.',
 *   privilegeType: 'ATTORNEY_CLIENT',
 *   privilegeBasis: 'Communication seeking legal advice'
 * });
 * ```
 */
export declare const createPrivilegeLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        logId: string;
        caseNumber: string;
        documentId: string;
        batesNumber: string | null;
        documentDate: Date;
        author: string;
        recipients: string[];
        ccRecipients: string[];
        subject: string;
        documentType: string;
        privilegeType: string;
        privilegeBasis: string;
        descriptionOfDocument: string;
        withholdingParty: string;
        confidentialityDesignation: string | null;
        reviewedBy: string;
        approvedBy: string | null;
        loggedDate: Date;
        lastModified: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Executes advanced Boolean search with proximity and wildcard support.
 *
 * @param {LegalSearchQuery} query - Search query with Boolean operators
 * @param {object} [options] - Search options (limit, offset, sort)
 * @returns {Promise<LegalSearchResult[]>} Search results with relevance scoring
 *
 * @example
 * ```typescript
 * const results = await executeAdvancedBooleanSearch({
 *   queryName: 'Contract Breach Analysis',
 *   searchTerms: [
 *     { term: 'breach', operator: 'AND', field: 'content' },
 *     { term: 'contract', operator: 'AND', field: 'content' },
 *     { term: 'warranty', operator: 'OR', field: 'content' }
 *   ],
 *   booleanExpression: '(breach AND contract) OR warranty',
 *   dateRange: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') }
 * });
 * ```
 */
export declare const executeAdvancedBooleanSearch: (query: LegalSearchQuery, options?: {
    limit?: number;
    offset?: number;
    sort?: string;
}) => Promise<LegalSearchResult[]>;
/**
 * Builds complex Boolean expression from natural language query.
 *
 * @param {string} naturalLanguageQuery - Natural language search query
 * @returns {Promise<{ booleanExpression: string; searchTerms: SearchTerm[] }>} Parsed Boolean query
 *
 * @example
 * ```typescript
 * const parsed = await buildBooleanExpression(
 *   'Find emails from John Smith about contracts sent in 2024'
 * );
 * // Returns: { booleanExpression: '(from:john AND contract) AND date:[2024-01-01 TO 2024-12-31]', ... }
 * ```
 */
export declare const buildBooleanExpression: (naturalLanguageQuery: string) => Promise<{
    booleanExpression: string;
    searchTerms: SearchTerm[];
}>;
/**
 * Performs proximity search for terms within specified distance.
 *
 * @param {string[]} terms - Search terms
 * @param {number} proximityDistance - Maximum word distance between terms
 * @param {object} [filters] - Additional filters
 * @returns {Promise<LegalSearchResult[]>} Documents with terms in proximity
 *
 * @example
 * ```typescript
 * const results = await executeProximitySearch(
 *   ['breach', 'contract'],
 *   10, // within 10 words
 *   { documentTypes: ['email', 'memo'] }
 * );
 * ```
 */
export declare const executeProximitySearch: (terms: string[], proximityDistance: number, filters?: DiscoveryFilter) => Promise<LegalSearchResult[]>;
/**
 * Executes fuzzy search with similarity matching for misspellings.
 *
 * @param {string} searchTerm - Search term
 * @param {number} [fuzziness=2] - Edit distance for fuzzy matching (0-2)
 * @param {object} [options] - Search options
 * @returns {Promise<LegalSearchResult[]>} Fuzzy search results
 *
 * @example
 * ```typescript
 * const results = await executeFuzzySearch('contrackt', 2);
 * // Matches: contract, contracts, contracted, etc.
 * ```
 */
export declare const executeFuzzySearch: (searchTerm: string, fuzziness?: number, options?: {
    field?: string;
    minScore?: number;
}) => Promise<LegalSearchResult[]>;
/**
 * Searches using wildcard patterns for partial matching.
 *
 * @param {string} wildcardPattern - Pattern with * or ? wildcards
 * @param {object} [options] - Search options
 * @returns {Promise<LegalSearchResult[]>} Wildcard search results
 *
 * @example
 * ```typescript
 * const results = await executeWildcardSearch('cont*', { field: 'subject' });
 * // Matches: contract, contracts, continue, contractor, etc.
 * ```
 */
export declare const executeWildcardSearch: (wildcardPattern: string, options?: {
    field?: string;
    limit?: number;
}) => Promise<LegalSearchResult[]>;
/**
 * Optimizes search query for best performance.
 *
 * @param {LegalSearchQuery} query - Search query to optimize
 * @returns {Promise<{ optimizedQuery: LegalSearchQuery; metrics: SearchOptimizationMetrics }>} Optimized query
 *
 * @example
 * ```typescript
 * const { optimizedQuery, metrics } = await optimizeSearchQuery(query);
 * console.log(`Optimization suggestions: ${metrics.optimizationSuggestions}`);
 * ```
 */
export declare const optimizeSearchQuery: (query: LegalSearchQuery) => Promise<{
    optimizedQuery: LegalSearchQuery;
    metrics: SearchOptimizationMetrics;
}>;
/**
 * Caches frequently used search queries for performance.
 *
 * @param {string} queryId - Query identifier
 * @param {LegalSearchResult[]} results - Search results to cache
 * @param {number} [ttlSeconds=3600] - Cache TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await cacheSearchResults('QRY-12345', results, 7200);
 * ```
 */
export declare const cacheSearchResults: (queryId: string, results: LegalSearchResult[], ttlSeconds?: number) => Promise<boolean>;
/**
 * Retrieves cached search results if available.
 *
 * @param {string} queryId - Query identifier
 * @returns {Promise<LegalSearchResult[] | null>} Cached results or null
 *
 * @example
 * ```typescript
 * const cached = await getCachedSearchResults('QRY-12345');
 * if (cached) {
 *   return cached; // Use cached results
 * }
 * ```
 */
export declare const getCachedSearchResults: (queryId: string) => Promise<LegalSearchResult[] | null>;
/**
 * Discovers documents matching specified criteria.
 *
 * @param {DiscoveryFilter} filters - Discovery filter criteria
 * @param {object} [options] - Search options
 * @returns {Promise<DocumentMetadata[]>} Discovered documents
 *
 * @example
 * ```typescript
 * const documents = await discoverDocuments({
 *   dateRange: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
 *   custodians: ['john.smith@company.com'],
 *   documentTypes: ['email', 'pdf'],
 *   classifications: ['RESPONSIVE']
 * });
 * ```
 */
export declare const discoverDocuments: (filters: DiscoveryFilter, options?: {
    limit?: number;
    offset?: number;
}) => Promise<DocumentMetadata[]>;
/**
 * Filters documents by custodian (document owner).
 *
 * @param {string[]} custodians - List of custodian email addresses
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<DocumentMetadata[]>} Documents from specified custodians
 *
 * @example
 * ```typescript
 * const docs = await filterByCustodian(
 *   ['john.smith@company.com', 'jane.doe@company.com'],
 *   new Date('2024-01-01')
 * );
 * ```
 */
export declare const filterByCustodian: (custodians: string[], startDate?: Date, endDate?: Date) => Promise<DocumentMetadata[]>;
/**
 * Filters documents by date range.
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {object} [additionalFilters] - Additional filter criteria
 * @returns {Promise<DocumentMetadata[]>} Documents within date range
 *
 * @example
 * ```typescript
 * const docs = await filterByDateRange(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   { documentTypes: ['email'] }
 * );
 * ```
 */
export declare const filterByDateRange: (startDate: Date, endDate: Date, additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
/**
 * Filters documents by file type.
 *
 * @param {string[]} fileTypes - List of file types (email, pdf, docx, xlsx, etc)
 * @param {object} [additionalFilters] - Additional filter criteria
 * @returns {Promise<DocumentMetadata[]>} Documents of specified types
 *
 * @example
 * ```typescript
 * const emails = await filterByFileType(['email', 'msg', 'eml']);
 * ```
 */
export declare const filterByFileType: (fileTypes: string[], additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
/**
 * Filters documents by classification status.
 *
 * @param {DocumentClassification[]} classifications - Classification statuses
 * @param {object} [additionalFilters] - Additional filter criteria
 * @returns {Promise<DocumentMetadata[]>} Classified documents
 *
 * @example
 * ```typescript
 * const responsive = await filterByClassification(['RESPONSIVE', 'HOT']);
 * ```
 */
export declare const filterByClassification: (classifications: DocumentClassification[], additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
/**
 * De-duplicates document collection using hash comparison.
 *
 * @param {string[]} documentIds - Document IDs to deduplicate
 * @param {object} [options] - Deduplication options
 * @returns {Promise<{ uniqueDocuments: string[]; duplicates: Array<{ documentId: string; duplicateOf: string }> }>} Deduplication results
 *
 * @example
 * ```typescript
 * const { uniqueDocuments, duplicates } = await deduplicateDocuments(documentIds, {
 *   method: 'MD5_HASH'
 * });
 * console.log(`Found ${duplicates.length} duplicates`);
 * ```
 */
export declare const deduplicateDocuments: (documentIds: string[], options?: {
    method?: "MD5_HASH" | "SHA256_HASH" | "CONTENT_SIMILARITY";
}) => Promise<{
    uniqueDocuments: string[];
    duplicates: Array<{
        documentId: string;
        duplicateOf: string;
    }>;
}>;
/**
 * Threads email conversations into discussion chains.
 *
 * @param {string[]} emailDocumentIds - Email document IDs to thread
 * @returns {Promise<DocumentThread[]>} Email threads
 *
 * @example
 * ```typescript
 * const threads = await threadEmailConversations(emailIds);
 * threads.forEach(thread => {
 *   console.log(`Thread: ${thread.subject}, Depth: ${thread.threadDepth}`);
 * });
 * ```
 */
export declare const threadEmailConversations: (emailDocumentIds: string[]) => Promise<DocumentThread[]>;
/**
 * Extracts metadata from documents for indexing.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentMetadata>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractDocumentMetadata('DOC-12345');
 * console.log(`Author: ${metadata.author}, Date: ${metadata.createdDate}`);
 * ```
 */
export declare const extractDocumentMetadata: (documentId: string) => Promise<DocumentMetadata>;
/**
 * Creates privilege log entry for withheld document.
 *
 * @param {Omit<PrivilegeLogEntry, 'logId' | 'loggedDate'>} entry - Privilege log entry data
 * @returns {Promise<PrivilegeLogEntry>} Created privilege log entry
 *
 * @example
 * ```typescript
 * const logEntry = await createPrivilegeLogEntry({
 *   documentId: 'DOC-12345',
 *   documentDate: new Date('2024-03-15'),
 *   author: 'John Smith, Esq.',
 *   recipients: ['Jane Doe'],
 *   subject: 'RE: Legal Strategy Discussion',
 *   privilegeType: 'ATTORNEY_CLIENT',
 *   privilegeBasis: 'Communication seeking legal advice regarding pending litigation',
 *   descriptionOfDocument: 'Email from outside counsel to in-house counsel',
 *   withholdingParty: 'ABC Corporation'
 * });
 * ```
 */
export declare const createPrivilegeLogEntry: (entry: Omit<PrivilegeLogEntry, "logId" | "loggedDate">) => Promise<PrivilegeLogEntry>;
/**
 * Reviews document for privilege status.
 *
 * @param {string} documentId - Document to review
 * @param {string} reviewerId - Reviewing attorney
 * @returns {Promise<PrivilegeStatus>} Privilege determination
 *
 * @example
 * ```typescript
 * const status = await reviewDocumentPrivilege('DOC-12345', 'attorney.jones');
 * if (status.isPrivileged) {
 *   console.log(`Privilege type: ${status.privilegeType}`);
 * }
 * ```
 */
export declare const reviewDocumentPrivilege: (documentId: string, reviewerId: string) => Promise<PrivilegeStatus>;
/**
 * Generates court-ready privilege log in standard format.
 *
 * @param {string} caseNumber - Case number
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<PrivilegeLogEntry[]>} Privilege log entries
 *
 * @example
 * ```typescript
 * const privilegeLog = await generatePrivilegeLog('CV-2025-001234');
 * // Export to Excel or PDF for court filing
 * ```
 */
export declare const generatePrivilegeLog: (caseNumber: string, startDate?: Date, endDate?: Date) => Promise<PrivilegeLogEntry[]>;
/**
 * Validates privilege log for completeness and accuracy.
 *
 * @param {PrivilegeLogEntry[]} logEntries - Log entries to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validatePrivilegeLog(logEntries);
 * if (!validation.valid) {
 *   console.error('Privilege log errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePrivilegeLog: (logEntries: PrivilegeLogEntry[]) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Creates redaction definition for document.
 *
 * @param {Omit<RedactionDefinition, 'redactionId' | 'redactedDate'>} redaction - Redaction data
 * @returns {Promise<RedactionDefinition>} Created redaction
 *
 * @example
 * ```typescript
 * const redaction = await createRedaction({
 *   documentId: 'DOC-12345',
 *   pageNumber: 3,
 *   coordinates: { x: 100, y: 200, width: 300, height: 50 },
 *   redactionType: 'PII',
 *   reason: 'Social Security Number',
 *   redactedBy: 'reviewer.smith',
 *   approved: false
 * });
 * ```
 */
export declare const createRedaction: (redaction: Omit<RedactionDefinition, "redactionId" | "redactedDate">) => Promise<RedactionDefinition>;
/**
 * Applies redactions to document and generates redacted copy.
 *
 * @param {string} documentId - Document to redact
 * @param {RedactionDefinition[]} redactions - Redactions to apply
 * @returns {Promise<{ redactedDocumentId: string; redactionCount: number }>} Redacted document info
 *
 * @example
 * ```typescript
 * const result = await applyRedactions('DOC-12345', redactionDefinitions);
 * console.log(`Created redacted document: ${result.redactedDocumentId}`);
 * ```
 */
export declare const applyRedactions: (documentId: string, redactions: RedactionDefinition[]) => Promise<{
    redactedDocumentId: string;
    redactionCount: number;
}>;
/**
 * Detects PII (Personally Identifiable Information) for redaction.
 *
 * @param {string} documentId - Document to scan
 * @returns {Promise<RedactionDefinition[]>} Suggested PII redactions
 *
 * @example
 * ```typescript
 * const piiRedactions = await detectPII('DOC-12345');
 * // Review and approve suggested redactions
 * ```
 */
export declare const detectPII: (documentId: string) => Promise<RedactionDefinition[]>;
/**
 * Exports privilege log to specified format (Excel, PDF, CSV).
 *
 * @param {PrivilegeLogEntry[]} logEntries - Privilege log entries
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported privilege log
 *
 * @example
 * ```typescript
 * const excelBuffer = await exportPrivilegeLog(logEntries, 'EXCEL');
 * await fs.writeFile('privilege_log.xlsx', excelBuffer);
 * ```
 */
export declare const exportPrivilegeLog: (logEntries: PrivilegeLogEntry[], format: "EXCEL" | "PDF" | "CSV") => Promise<Buffer>;
/**
 * Creates production set for document delivery.
 *
 * @param {Omit<ProductionSet, 'productionId'>} setData - Production set data
 * @returns {Promise<ProductionSet>} Created production set
 *
 * @example
 * ```typescript
 * const productionSet = await createProductionSet({
 *   productionName: 'Initial Production - RFP 001',
 *   caseNumber: 'CV-2025-001234',
 *   requestingParty: 'Plaintiff XYZ Corp',
 *   producingParty: 'Defendant ABC Inc',
 *   productionDate: new Date('2025-03-15'),
 *   documentCount: 1547,
 *   batesRange: { start: 'ABC-00001', end: 'ABC-01547' },
 *   format: 'PDF',
 *   loadFileIncluded: true,
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createProductionSet: (setData: Omit<ProductionSet, "productionId">) => Promise<ProductionSet>;
/**
 * Adds documents to production set.
 *
 * @param {string} productionId - Production set ID
 * @param {string[]} documentIds - Document IDs to add
 * @returns {Promise<{ productionId: string; documentCount: number }>} Updated production set info
 *
 * @example
 * ```typescript
 * const result = await addDocumentsToProductionSet('PROD-12345', documentIds);
 * console.log(`Production set now contains ${result.documentCount} documents`);
 * ```
 */
export declare const addDocumentsToProductionSet: (productionId: string, documentIds: string[]) => Promise<{
    productionId: string;
    documentCount: number;
}>;
/**
 * Removes documents from production set.
 *
 * @param {string} productionId - Production set ID
 * @param {string[]} documentIds - Document IDs to remove
 * @returns {Promise<{ productionId: string; remainingCount: number }>} Updated production set info
 *
 * @example
 * ```typescript
 * const result = await removeDocumentsFromProductionSet('PROD-12345', ['DOC-999']);
 * ```
 */
export declare const removeDocumentsFromProductionSet: (productionId: string, documentIds: string[]) => Promise<{
    productionId: string;
    remainingCount: number;
}>;
/**
 * Assigns Bates numbers to production documents.
 *
 * @param {string} productionId - Production set ID
 * @param {string} batesPrefix - Bates number prefix
 * @param {number} startNumber - Starting number
 * @returns {Promise<{ productionId: string; batesRange: { start: string; end: string } }>} Bates numbering result
 *
 * @example
 * ```typescript
 * const result = await assignBatesNumbers('PROD-12345', 'ABC', 1);
 * // Assigns ABC-00001, ABC-00002, etc.
 * ```
 */
export declare const assignBatesNumbers: (productionId: string, batesPrefix: string, startNumber: number) => Promise<{
    productionId: string;
    batesRange: {
        start: string;
        end: string;
    };
}>;
/**
 * Generates load file for e-discovery platform import.
 *
 * @param {string} productionId - Production set ID
 * @param {string} format - Load file format (DAT, CSV, Opticon, etc)
 * @returns {Promise<Buffer>} Generated load file
 *
 * @example
 * ```typescript
 * const loadFile = await generateLoadFile('PROD-12345', 'DAT');
 * await fs.writeFile('production.dat', loadFile);
 * ```
 */
export declare const generateLoadFile: (productionId: string, format: string) => Promise<Buffer>;
/**
 * Validates production set for completeness and quality.
 *
 * @param {string} productionId - Production set ID
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[]; statistics: Record<string, any> }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateProductionSet('PROD-12345');
 * if (!validation.valid) {
 *   console.error('Production errors:', validation.errors);
 * }
 * ```
 */
export declare const validateProductionSet: (productionId: string) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    statistics: Record<string, any>;
}>;
/**
 * Tracks chain of custody for production documents.
 *
 * @param {string} documentId - Document ID
 * @param {string} fromParty - Transferring party
 * @param {string} toParty - Receiving party
 * @param {string} transferMethod - Transfer method (email, USB, FTP, etc)
 * @returns {Promise<ChainOfCustody>} Updated chain of custody
 *
 * @example
 * ```typescript
 * const custody = await trackChainOfCustody(
 *   'DOC-12345',
 *   'ABC Corp Legal',
 *   'Outside Counsel',
 *   'Secure FTP'
 * );
 * ```
 */
export declare const trackChainOfCustody: (documentId: string, fromParty: string, toParty: string, transferMethod: string) => Promise<ChainOfCustody>;
/**
 * Exports production set in specified format.
 *
 * @param {string} productionId - Production set ID
 * @param {string} format - Export format
 * @param {object} [options] - Export options
 * @returns {Promise<{ files: string[]; totalSize: number }>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportProductionSet('PROD-12345', 'NATIVE', {
 *   includeLoadFile: true,
 *   includeImages: false
 * });
 * ```
 */
export declare const exportProductionSet: (productionId: string, format: string, options?: {
    includeLoadFile?: boolean;
    includeImages?: boolean;
}) => Promise<{
    files: string[];
    totalSize: number;
}>;
/**
 * Creates legal hold notice for document preservation.
 *
 * @param {Omit<LegalHoldNotice, 'holdId'>} holdData - Legal hold data
 * @returns {Promise<LegalHoldNotice>} Created legal hold notice
 *
 * @example
 * ```typescript
 * const hold = await createLegalHoldNotice({
 *   caseNumber: 'CV-2025-001234',
 *   caseName: 'ABC Corp v. XYZ Inc',
 *   issueDate: new Date(),
 *   custodians: ['john.smith@company.com', 'jane.doe@company.com'],
 *   scope: 'All documents related to Project Phoenix from 2023-2025',
 *   status: 'ACTIVE',
 *   acknowledgments: []
 * });
 * ```
 */
export declare const createLegalHoldNotice: (holdData: Omit<LegalHoldNotice, "holdId">) => Promise<LegalHoldNotice>;
/**
 * Tracks custodian acknowledgment of legal hold.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string} custodian - Custodian email
 * @param {Date} acknowledgmentDate - Date of acknowledgment
 * @returns {Promise<{ holdId: string; custodian: string; acknowledged: boolean }>} Acknowledgment record
 *
 * @example
 * ```typescript
 * const ack = await trackLegalHoldAcknowledgment(
 *   'HOLD-12345',
 *   'john.smith@company.com',
 *   new Date()
 * );
 * ```
 */
export declare const trackLegalHoldAcknowledgment: (holdId: string, custodian: string, acknowledgmentDate: Date) => Promise<{
    holdId: string;
    custodian: string;
    acknowledged: boolean;
}>;
/**
 * Releases legal hold when litigation concludes.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string} releaseReason - Reason for release
 * @returns {Promise<{ holdId: string; status: string; releasedDate: Date }>} Release record
 *
 * @example
 * ```typescript
 * const release = await releaseLegalHold('HOLD-12345', 'Case settled');
 * ```
 */
export declare const releaseLegalHold: (holdId: string, releaseReason: string) => Promise<{
    holdId: string;
    status: string;
    releasedDate: Date;
}>;
/**
 * Generates legal hold compliance report.
 *
 * @param {string} holdId - Legal hold ID
 * @returns {Promise<{ holdId: string; totalCustodians: number; acknowledged: number; pending: number; documents: number }>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateLegalHoldComplianceReport('HOLD-12345');
 * console.log(`${report.acknowledged}/${report.totalCustodians} custodians acknowledged`);
 * ```
 */
export declare const generateLegalHoldComplianceReport: (holdId: string) => Promise<{
    holdId: string;
    totalCustodians: number;
    acknowledged: number;
    pending: number;
    documents: number;
}>;
/**
 * Analyzes search performance and provides optimization recommendations.
 *
 * @param {string} queryId - Query to analyze
 * @returns {Promise<SearchOptimizationMetrics>} Performance analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSearchPerformance('QRY-12345');
 * console.log(`Execution time: ${analysis.executionTimeMs}ms`);
 * console.log(`Suggestions: ${analysis.optimizationSuggestions.join(', ')}`);
 * ```
 */
export declare const analyzeSearchPerformance: (queryId: string) => Promise<SearchOptimizationMetrics>;
/**
 * Generates comprehensive discovery analytics and statistics.
 *
 * @param {string} caseNumber - Case number
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @returns {Promise<Record<string, any>>} Discovery analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateDiscoveryAnalytics('CV-2025-001234');
 * console.log(`Total documents: ${analytics.totalDocuments}`);
 * console.log(`Responsive rate: ${analytics.responsiveRate}%`);
 * ```
 */
export declare const generateDiscoveryAnalytics: (caseNumber: string, startDate?: Date, endDate?: Date) => Promise<Record<string, any>>;
/**
 * Example NestJS controller for Legal Research endpoints with Swagger documentation.
 * This would typically be in a separate controller file.
 */
export declare class LegalResearchController {
    /**
     * Execute advanced Boolean search
     */
    executeSearch(query: LegalSearchQuery): Promise<LegalSearchResult[]>;
    /**
     * Discover documents with filters
     */
    discover(filters: DiscoveryFilter): Promise<DocumentMetadata[]>;
    /**
     * Create privilege log entry
     */
    createPrivilegeEntry(entry: Omit<PrivilegeLogEntry, 'logId' | 'loggedDate'>): Promise<PrivilegeLogEntry>;
    /**
     * Create production set
     */
    createProduction(setData: Omit<ProductionSet, 'productionId'>): Promise<ProductionSet>;
    /**
     * Get discovery analytics
     */
    getAnalytics(caseNumber: string): Promise<Record<string, any>>;
    /**
     * Optimize search query
     */
    optimizeQuery(query: LegalSearchQuery): Promise<{
        optimizedQuery: LegalSearchQuery;
        metrics: SearchOptimizationMetrics;
    }>;
}
/**
 * Default export with all utilities organized by category.
 */
declare const _default: {
    createLegalResearchQueryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            queryId: string;
            queryName: string;
            caseNumber: string | null;
            matterNumber: string | null;
            booleanExpression: string;
            searchTerms: Record<string, any>;
            filters: Record<string, any>;
            resultCount: number;
            executionTimeMs: number;
            createdBy: string;
            lastExecuted: Date | null;
            savedQuery: boolean;
            shared: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDiscoverySetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            setId: string;
            setName: string;
            caseNumber: string;
            matterNumber: string | null;
            setType: string;
            documentCount: number;
            documentIds: string[];
            batesRange: Record<string, any> | null;
            productionDate: Date | null;
            requestingParty: string | null;
            producingParty: string;
            status: string;
            privilegedCount: number;
            redactedCount: number;
            withheldCount: number;
            createdBy: string;
            reviewedBy: string | null;
            approvedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPrivilegeLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            logId: string;
            caseNumber: string;
            documentId: string;
            batesNumber: string | null;
            documentDate: Date;
            author: string;
            recipients: string[];
            ccRecipients: string[];
            subject: string;
            documentType: string;
            privilegeType: string;
            privilegeBasis: string;
            descriptionOfDocument: string;
            withholdingParty: string;
            confidentialityDesignation: string | null;
            reviewedBy: string;
            approvedBy: string | null;
            loggedDate: Date;
            lastModified: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    executeAdvancedBooleanSearch: (query: LegalSearchQuery, options?: {
        limit?: number;
        offset?: number;
        sort?: string;
    }) => Promise<LegalSearchResult[]>;
    buildBooleanExpression: (naturalLanguageQuery: string) => Promise<{
        booleanExpression: string;
        searchTerms: SearchTerm[];
    }>;
    executeProximitySearch: (terms: string[], proximityDistance: number, filters?: DiscoveryFilter) => Promise<LegalSearchResult[]>;
    executeFuzzySearch: (searchTerm: string, fuzziness?: number, options?: {
        field?: string;
        minScore?: number;
    }) => Promise<LegalSearchResult[]>;
    executeWildcardSearch: (wildcardPattern: string, options?: {
        field?: string;
        limit?: number;
    }) => Promise<LegalSearchResult[]>;
    optimizeSearchQuery: (query: LegalSearchQuery) => Promise<{
        optimizedQuery: LegalSearchQuery;
        metrics: SearchOptimizationMetrics;
    }>;
    cacheSearchResults: (queryId: string, results: LegalSearchResult[], ttlSeconds?: number) => Promise<boolean>;
    getCachedSearchResults: (queryId: string) => Promise<LegalSearchResult[] | null>;
    discoverDocuments: (filters: DiscoveryFilter, options?: {
        limit?: number;
        offset?: number;
    }) => Promise<DocumentMetadata[]>;
    filterByCustodian: (custodians: string[], startDate?: Date, endDate?: Date) => Promise<DocumentMetadata[]>;
    filterByDateRange: (startDate: Date, endDate: Date, additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
    filterByFileType: (fileTypes: string[], additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
    filterByClassification: (classifications: DocumentClassification[], additionalFilters?: Partial<DiscoveryFilter>) => Promise<DocumentMetadata[]>;
    deduplicateDocuments: (documentIds: string[], options?: {
        method?: "MD5_HASH" | "SHA256_HASH" | "CONTENT_SIMILARITY";
    }) => Promise<{
        uniqueDocuments: string[];
        duplicates: Array<{
            documentId: string;
            duplicateOf: string;
        }>;
    }>;
    threadEmailConversations: (emailDocumentIds: string[]) => Promise<DocumentThread[]>;
    extractDocumentMetadata: (documentId: string) => Promise<DocumentMetadata>;
    createPrivilegeLogEntry: (entry: Omit<PrivilegeLogEntry, "logId" | "loggedDate">) => Promise<PrivilegeLogEntry>;
    reviewDocumentPrivilege: (documentId: string, reviewerId: string) => Promise<PrivilegeStatus>;
    generatePrivilegeLog: (caseNumber: string, startDate?: Date, endDate?: Date) => Promise<PrivilegeLogEntry[]>;
    validatePrivilegeLog: (logEntries: PrivilegeLogEntry[]) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    createRedaction: (redaction: Omit<RedactionDefinition, "redactionId" | "redactedDate">) => Promise<RedactionDefinition>;
    applyRedactions: (documentId: string, redactions: RedactionDefinition[]) => Promise<{
        redactedDocumentId: string;
        redactionCount: number;
    }>;
    detectPII: (documentId: string) => Promise<RedactionDefinition[]>;
    exportPrivilegeLog: (logEntries: PrivilegeLogEntry[], format: "EXCEL" | "PDF" | "CSV") => Promise<Buffer>;
    createProductionSet: (setData: Omit<ProductionSet, "productionId">) => Promise<ProductionSet>;
    addDocumentsToProductionSet: (productionId: string, documentIds: string[]) => Promise<{
        productionId: string;
        documentCount: number;
    }>;
    removeDocumentsFromProductionSet: (productionId: string, documentIds: string[]) => Promise<{
        productionId: string;
        remainingCount: number;
    }>;
    assignBatesNumbers: (productionId: string, batesPrefix: string, startNumber: number) => Promise<{
        productionId: string;
        batesRange: {
            start: string;
            end: string;
        };
    }>;
    generateLoadFile: (productionId: string, format: string) => Promise<Buffer>;
    validateProductionSet: (productionId: string) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
        statistics: Record<string, any>;
    }>;
    trackChainOfCustody: (documentId: string, fromParty: string, toParty: string, transferMethod: string) => Promise<ChainOfCustody>;
    exportProductionSet: (productionId: string, format: string, options?: {
        includeLoadFile?: boolean;
        includeImages?: boolean;
    }) => Promise<{
        files: string[];
        totalSize: number;
    }>;
    createLegalHoldNotice: (holdData: Omit<LegalHoldNotice, "holdId">) => Promise<LegalHoldNotice>;
    trackLegalHoldAcknowledgment: (holdId: string, custodian: string, acknowledgmentDate: Date) => Promise<{
        holdId: string;
        custodian: string;
        acknowledged: boolean;
    }>;
    releaseLegalHold: (holdId: string, releaseReason: string) => Promise<{
        holdId: string;
        status: string;
        releasedDate: Date;
    }>;
    generateLegalHoldComplianceReport: (holdId: string) => Promise<{
        holdId: string;
        totalCustodians: number;
        acknowledged: number;
        pending: number;
        documents: number;
    }>;
    analyzeSearchPerformance: (queryId: string) => Promise<SearchOptimizationMetrics>;
    generateDiscoveryAnalytics: (caseNumber: string, startDate?: Date, endDate?: Date) => Promise<Record<string, any>>;
};
export default _default;
//# sourceMappingURL=legal-research-discovery-kit.d.ts.map