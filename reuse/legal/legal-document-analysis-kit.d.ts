/**
 * LOC: LEGAL-DOC-001
 * File: /reuse/legal/legal-document-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Legal service modules
 *   - Document processing services
 *   - Contract management systems
 */
/**
 * File: /reuse/legal/legal-document-analysis-kit.ts
 * Locator: WC-UTL-LEGALDOC-001
 * Purpose: Legal Document Analysis - Comprehensive document processing, NER, clause extraction, and risk assessment
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, sequelize-typescript, natural (NLP)
 * Downstream: ../backend/legal/*, document processing modules, contract analysis services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, natural (NLP library)
 * Exports: 40 utility functions for legal document processing, clause extraction, NER, risk assessment, Sequelize models, NestJS controllers
 *
 * LLM Context: Comprehensive legal document analysis utilities for White Cross healthcare system.
 * Provides document classification, clause extraction, legal entity recognition, summarization,
 * risk assessment, Sequelize models for legal documents/clauses/entities, NestJS controllers
 * for document upload and analysis, and Swagger API documentation. Essential for legal compliance,
 * contract management, and document intelligence in healthcare applications.
 */
/**
 * Document type classifications for legal documents
 */
export declare enum DocumentType {
    CONTRACT = "contract",
    AGREEMENT = "agreement",
    POLICY = "policy",
    TERMS_OF_SERVICE = "terms_of_service",
    PRIVACY_POLICY = "privacy_policy",
    NDA = "nda",
    LICENSE = "license",
    COMPLIANCE_DOC = "compliance_doc",
    REGULATION = "regulation",
    MEMO = "memo",
    LETTER = "letter",
    CONSENT_FORM = "consent_form",
    WAIVER = "waiver",
    AMENDMENT = "amendment",
    ADDENDUM = "addendum",
    UNKNOWN = "unknown"
}
/**
 * Risk severity levels for document analysis
 */
export declare enum RiskLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NONE = "none"
}
/**
 * Legal entity types for Named Entity Recognition
 */
export declare enum LegalEntityType {
    PARTY = "party",
    ORGANIZATION = "organization",
    PERSON = "person",
    DATE = "date",
    MONEY = "money",
    LOCATION = "location",
    LAW_REFERENCE = "law_reference",
    REGULATION_REFERENCE = "regulation_reference",
    CASE_CITATION = "case_citation",
    CONTRACT_CLAUSE = "contract_clause",
    JURISDICTION = "jurisdiction",
    SIGNATURE = "signature"
}
/**
 * Clause categories for legal documents
 */
export declare enum ClauseCategory {
    PAYMENT_TERMS = "payment_terms",
    TERMINATION = "termination",
    LIABILITY = "liability",
    INDEMNIFICATION = "indemnification",
    CONFIDENTIALITY = "confidentiality",
    NON_COMPETE = "non_compete",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    DISPUTE_RESOLUTION = "dispute_resolution",
    GOVERNING_LAW = "governing_law",
    FORCE_MAJEURE = "force_majeure",
    WARRANTIES = "warranties",
    REPRESENTATIONS = "representations",
    ASSIGNMENT = "assignment",
    AMENDMENTS = "amendments",
    NOTICES = "notices",
    SEVERABILITY = "severability",
    ENTIRE_AGREEMENT = "entire_agreement",
    RENEWAL = "renewal",
    DATA_PROTECTION = "data_protection",
    COMPLIANCE = "compliance"
}
/**
 * Document metadata structure
 */
export interface DocumentMetadata {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
    uploadedBy?: string;
    documentType: DocumentType;
    language: string;
    pageCount?: number;
    wordCount?: number;
    version?: string;
    tags?: string[];
    category?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    processingErrors?: string[];
}
/**
 * Extracted clause structure
 */
export interface ExtractedClause {
    id: string;
    documentId: string;
    category: ClauseCategory;
    text: string;
    position: {
        start: number;
        end: number;
        page?: number;
    };
    confidence: number;
    importance: 'critical' | 'high' | 'medium' | 'low';
    keyTerms: string[];
    relatedClauses?: string[];
    riskIndicators?: RiskIndicator[];
}
/**
 * Legal entity extracted from document
 */
export interface LegalEntity {
    id: string;
    documentId: string;
    type: LegalEntityType;
    text: string;
    normalizedValue?: string;
    position: {
        start: number;
        end: number;
        page?: number;
    };
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Risk indicator in document
 */
export interface RiskIndicator {
    id: string;
    documentId: string;
    clauseId?: string;
    riskLevel: RiskLevel;
    category: string;
    description: string;
    location: {
        start: number;
        end: number;
        page?: number;
    };
    recommendation?: string;
    affectedParties?: string[];
    financialImpact?: number;
}
/**
 * Document summary structure
 */
export interface DocumentSummary {
    documentId: string;
    executiveSummary: string;
    keyPoints: string[];
    parties: string[];
    effectiveDate?: Date;
    expirationDate?: Date;
    financialTerms?: {
        totalValue?: number;
        currency?: string;
        paymentSchedule?: string;
    };
    criticalClauses: ExtractedClause[];
    riskAssessment: {
        overallRisk: RiskLevel;
        riskIndicators: RiskIndicator[];
        mitigationSuggestions: string[];
    };
    complianceFlags?: string[];
    relatedDocuments?: string[];
}
/**
 * Document classification result
 */
export interface ClassificationResult {
    documentId: string;
    primaryType: DocumentType;
    secondaryTypes?: DocumentType[];
    confidence: number;
    categories: string[];
    tags: string[];
    metadata: Record<string, any>;
}
/**
 * Analysis configuration options
 */
export interface AnalysisConfig {
    extractClauses?: boolean;
    performNER?: boolean;
    assessRisks?: boolean;
    generateSummary?: boolean;
    detectCompliance?: boolean;
    extractFinancialTerms?: boolean;
    identifyParties?: boolean;
    minConfidence?: number;
    language?: string;
}
/**
 * Bulk analysis job
 */
export interface BulkAnalysisJob {
    jobId: string;
    documentIds: string[];
    config: AnalysisConfig;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    results?: DocumentSummary[];
    errors?: Array<{
        documentId: string;
        error: string;
    }>;
}
/**
 * Comparison result between documents
 */
export interface DocumentComparisonResult {
    documentId1: string;
    documentId2: string;
    similarity: number;
    differences: Array<{
        section: string;
        type: 'added' | 'removed' | 'modified';
        content1?: string;
        content2?: string;
    }>;
    clauseChanges: Array<{
        category: ClauseCategory;
        change: 'added' | 'removed' | 'modified';
        impact: RiskLevel;
    }>;
    recommendations: string[];
}
/**
 * Classifies a legal document based on content analysis.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document text content
 * @param {Partial<AnalysisConfig>} [config] - Classification configuration
 * @returns {Promise<ClassificationResult>} Classification result
 *
 * @example
 * ```typescript
 * const result = await classifyDocument('doc-123', documentText, {
 *   minConfidence: 0.8
 * });
 * console.log(result.primaryType); // DocumentType.CONTRACT
 * ```
 */
export declare const classifyDocument: (documentId: string, content: string, config?: Partial<AnalysisConfig>) => Promise<ClassificationResult>;
/**
 * Categorizes document into multiple business categories.
 *
 * @param {string} content - Document text content
 * @returns {string[]} Array of category names
 *
 * @example
 * ```typescript
 * const categories = extractCategories(documentText);
 * // ['healthcare', 'compliance', 'financial']
 * ```
 */
export declare const extractCategories: (content: string) => string[];
/**
 * Extracts relevant tags from document content.
 *
 * @param {string} content - Document text content
 * @returns {string[]} Array of tags
 *
 * @example
 * ```typescript
 * const tags = extractTags(documentText);
 * // ['urgent', 'review-required', 'high-value']
 * ```
 */
export declare const extractTags: (content: string) => string[];
/**
 * Determines document language with confidence score.
 *
 * @param {string} content - Document text content
 * @returns {{ language: string; confidence: number }} Language detection result
 *
 * @example
 * ```typescript
 * const { language, confidence } = detectLanguage(documentText);
 * console.log(language); // 'en'
 * console.log(confidence); // 0.95
 * ```
 */
export declare const detectLanguage: (content: string) => {
    language: string;
    confidence: number;
};
/**
 * Classifies documents in bulk with batching support.
 *
 * @param {Array<{ id: string; content: string }>} documents - Array of documents
 * @param {Partial<AnalysisConfig>} [config] - Classification configuration
 * @returns {Promise<ClassificationResult[]>} Array of classification results
 *
 * @example
 * ```typescript
 * const results = await classifyDocumentsBulk([
 *   { id: 'doc1', content: text1 },
 *   { id: 'doc2', content: text2 }
 * ]);
 * ```
 */
export declare const classifyDocumentsBulk: (documents: Array<{
    id: string;
    content: string;
}>, config?: Partial<AnalysisConfig>) => Promise<ClassificationResult[]>;
/**
 * Extracts key clauses from legal document content.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document text content
 * @param {ClauseCategory[]} [categories] - Specific categories to extract
 * @returns {Promise<ExtractedClause[]>} Array of extracted clauses
 *
 * @example
 * ```typescript
 * const clauses = await extractClauses('doc-123', documentText, [
 *   ClauseCategory.PAYMENT_TERMS,
 *   ClauseCategory.TERMINATION
 * ]);
 * ```
 */
export declare const extractClauses: (documentId: string, content: string, categories?: ClauseCategory[]) => Promise<ExtractedClause[]>;
/**
 * Determines the importance level of a clause category.
 *
 * @param {ClauseCategory} category - Clause category
 * @returns {'critical' | 'high' | 'medium' | 'low'} Importance level
 *
 * @example
 * ```typescript
 * const importance = determineClauseImportance(ClauseCategory.PAYMENT_TERMS);
 * // 'critical'
 * ```
 */
export declare const determineClauseImportance: (category: ClauseCategory) => "critical" | "high" | "medium" | "low";
/**
 * Extracts key terms from clause text.
 *
 * @param {string} clauseText - Clause text content
 * @returns {string[]} Array of key terms
 *
 * @example
 * ```typescript
 * const terms = extractKeyTermsFromClause(clauseText);
 * // ['payment', 'net 30', 'invoice', 'late fee']
 * ```
 */
export declare const extractKeyTermsFromClause: (clauseText: string) => string[];
/**
 * Analyzes clause complexity and readability.
 *
 * @param {ExtractedClause} clause - Extracted clause
 * @returns {{ complexity: number; readability: number; suggestions: string[] }} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeClauseComplexity(clause);
 * console.log(analysis.complexity); // 0.75
 * console.log(analysis.suggestions); // ['Simplify sentence structure']
 * ```
 */
export declare const analyzeClauseComplexity: (clause: ExtractedClause) => {
    complexity: number;
    readability: number;
    suggestions: string[];
};
/**
 * Finds related clauses based on content similarity.
 *
 * @param {ExtractedClause} clause - Source clause
 * @param {ExtractedClause[]} allClauses - All clauses to search
 * @returns {string[]} Array of related clause IDs
 *
 * @example
 * ```typescript
 * const related = findRelatedClauses(clause, allClauses);
 * // ['doc-123-clause-5', 'doc-123-clause-12']
 * ```
 */
export declare const findRelatedClauses: (clause: ExtractedClause, allClauses: ExtractedClause[]) => string[];
/**
 * Performs Named Entity Recognition on legal document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document text content
 * @param {LegalEntityType[]} [entityTypes] - Specific entity types to extract
 * @returns {Promise<LegalEntity[]>} Array of recognized entities
 *
 * @example
 * ```typescript
 * const entities = await performNER('doc-123', documentText, [
 *   LegalEntityType.PARTY,
 *   LegalEntityType.DATE
 * ]);
 * ```
 */
export declare const performNER: (documentId: string, content: string, entityTypes?: LegalEntityType[]) => Promise<LegalEntity[]>;
/**
 * Normalizes entity value for consistency.
 *
 * @param {string} value - Raw entity value
 * @param {LegalEntityType} type - Entity type
 * @returns {string} Normalized value
 *
 * @example
 * ```typescript
 * const normalized = normalizeEntity('$1,000.00', LegalEntityType.MONEY);
 * // '1000.00'
 * ```
 */
export declare const normalizeEntity: (value: string, type: LegalEntityType) => string;
/**
 * Extracts all parties mentioned in the document.
 *
 * @param {string} content - Document text content
 * @returns {string[]} Array of party names
 *
 * @example
 * ```typescript
 * const parties = extractParties(documentText);
 * // ['Acme Corp', 'Johnson Medical LLC']
 * ```
 */
export declare const extractParties: (content: string) => string[];
/**
 * Extracts dates and categorizes them (effective, expiration, etc.).
 *
 * @param {string} content - Document text content
 * @returns {Record<string, Date>} Categorized dates
 *
 * @example
 * ```typescript
 * const dates = extractDates(documentText);
 * // { effectiveDate: Date, expirationDate: Date, signedDate: Date }
 * ```
 */
export declare const extractDates: (content: string) => Record<string, Date>;
/**
 * Extracts financial terms from document.
 *
 * @param {string} content - Document text content
 * @returns {{ amounts: number[]; currency: string; totalValue?: number; paymentSchedule?: string }} Financial terms
 *
 * @example
 * ```typescript
 * const terms = extractFinancialTerms(documentText);
 * // { amounts: [1000, 500], currency: 'USD', totalValue: 1500 }
 * ```
 */
export declare const extractFinancialTerms: (content: string) => {
    amounts: number[];
    currency: string;
    totalValue?: number;
    paymentSchedule?: string;
};
/**
 * Generates a comprehensive document summary.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document text content
 * @param {ExtractedClause[]} clauses - Extracted clauses
 * @param {LegalEntity[]} entities - Recognized entities
 * @returns {Promise<DocumentSummary>} Document summary
 *
 * @example
 * ```typescript
 * const summary = await generateDocumentSummary('doc-123', text, clauses, entities);
 * console.log(summary.executiveSummary);
 * console.log(summary.keyPoints);
 * ```
 */
export declare const generateDocumentSummary: (documentId: string, content: string, clauses: ExtractedClause[], entities: LegalEntity[]) => Promise<DocumentSummary>;
/**
 * Generates executive summary from document content.
 *
 * @param {string} content - Document text content
 * @param {string[]} parties - Document parties
 * @param {any} financialTerms - Financial terms
 * @param {ExtractedClause[]} criticalClauses - Critical clauses
 * @returns {string} Executive summary
 *
 * @example
 * ```typescript
 * const summary = generateExecutiveSummary(content, parties, terms, clauses);
 * ```
 */
export declare const generateExecutiveSummary: (content: string, parties: string[], financialTerms: any, criticalClauses: ExtractedClause[]) => string;
/**
 * Generates key points from document analysis.
 *
 * @param {string} content - Document text content
 * @param {ExtractedClause[]} clauses - Extracted clauses
 * @param {LegalEntity[]} entities - Recognized entities
 * @returns {string[]} Array of key points
 *
 * @example
 * ```typescript
 * const keyPoints = generateKeyPoints(content, clauses, entities);
 * ```
 */
export declare const generateKeyPoints: (content: string, clauses: ExtractedClause[], entities: LegalEntity[]) => string[];
/**
 * Extracts document insights and patterns.
 *
 * @param {DocumentSummary} summary - Document summary
 * @returns {Record<string, any>} Document insights
 *
 * @example
 * ```typescript
 * const insights = extractDocumentInsights(summary);
 * console.log(insights.complexity);
 * console.log(insights.riskProfile);
 * ```
 */
export declare const extractDocumentInsights: (summary: DocumentSummary) => Record<string, any>;
/**
 * Assesses risks in legal document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document text content
 * @param {ExtractedClause[]} clauses - Extracted clauses
 * @returns {Promise<RiskIndicator[]>} Array of risk indicators
 *
 * @example
 * ```typescript
 * const risks = await assessDocumentRisks('doc-123', content, clauses);
 * const criticalRisks = risks.filter(r => r.riskLevel === RiskLevel.CRITICAL);
 * ```
 */
export declare const assessDocumentRisks: (documentId: string, content: string, clauses: ExtractedClause[]) => Promise<RiskIndicator[]>;
/**
 * Calculates overall risk level from multiple risk indicators.
 *
 * @param {RiskIndicator[]} risks - Array of risk indicators
 * @returns {RiskLevel} Overall risk level
 *
 * @example
 * ```typescript
 * const overallRisk = calculateOverallRisk(riskIndicators);
 * // RiskLevel.HIGH
 * ```
 */
export declare const calculateOverallRisk: (risks: RiskIndicator[]) => RiskLevel;
/**
 * Generates mitigation suggestions for identified risks.
 *
 * @param {RiskIndicator[]} risks - Array of risk indicators
 * @returns {string[]} Mitigation suggestions
 *
 * @example
 * ```typescript
 * const suggestions = generateMitigationSuggestions(risks);
 * ```
 */
export declare const generateMitigationSuggestions: (risks: RiskIndicator[]) => string[];
/**
 * Detects compliance-related flags in document.
 *
 * @param {string} content - Document text content
 * @returns {string[]} Array of compliance flags
 *
 * @example
 * ```typescript
 * const flags = detectComplianceFlags(documentText);
 * // ['HIPAA', 'GDPR', 'SOX']
 * ```
 */
export declare const detectComplianceFlags: (content: string) => string[];
/**
 * Flags high-risk terms and conditions.
 *
 * @param {ExtractedClause[]} clauses - Extracted clauses
 * @returns {Array<{ clause: ExtractedClause; reason: string }>} Flagged clauses
 *
 * @example
 * ```typescript
 * const flagged = flagHighRiskTerms(clauses);
 * flagged.forEach(f => console.log(f.reason));
 * ```
 */
export declare const flagHighRiskTerms: (clauses: ExtractedClause[]) => Array<{
    clause: ExtractedClause;
    reason: string;
}>;
/**
 * Compares two documents and identifies differences.
 *
 * @param {string} documentId1 - First document ID
 * @param {string} content1 - First document content
 * @param {string} documentId2 - Second document ID
 * @param {string} content2 - Second document content
 * @returns {Promise<DocumentComparisonResult>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareDocuments('v1', content1, 'v2', content2);
 * console.log(comparison.similarity);
 * console.log(comparison.differences);
 * ```
 */
export declare const compareDocuments: (documentId1: string, content1: string, documentId2: string, content2: string) => Promise<DocumentComparisonResult>;
/**
 * Tracks document version changes.
 *
 * @param {string[]} documentIds - Array of document version IDs
 * @param {string[]} contents - Array of document contents
 * @returns {Promise<Array<DocumentComparisonResult>>} Version change history
 *
 * @example
 * ```typescript
 * const history = await trackDocumentVersions(docIds, contents);
 * ```
 */
export declare const trackDocumentVersions: (documentIds: string[], contents: string[]) => Promise<Array<DocumentComparisonResult>>;
/**
 * Creates Sequelize model for legal documents.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} LegalDocument model
 *
 * @example
 * ```typescript
 * const LegalDocument = createLegalDocumentModel(sequelize, DataTypes);
 * const doc = await LegalDocument.create({
 *   filename: 'contract.pdf',
 *   documentType: DocumentType.CONTRACT
 * });
 * ```
 */
export declare const createLegalDocumentModel: (sequelize: any, DataTypes: any) => any;
/**
 * Creates Sequelize model for document clauses.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} DocumentClause model
 *
 * @example
 * ```typescript
 * const DocumentClause = createDocumentClauseModel(sequelize, DataTypes);
 * const clause = await DocumentClause.create({
 *   documentId: 'doc-123',
 *   category: ClauseCategory.PAYMENT_TERMS,
 *   text: 'Payment is due within 30 days...'
 * });
 * ```
 */
export declare const createDocumentClauseModel: (sequelize: any, DataTypes: any) => any;
/**
 * Creates Sequelize model for legal entities.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} LegalEntity model
 *
 * @example
 * ```typescript
 * const LegalEntityModel = createLegalEntityModel(sequelize, DataTypes);
 * const entity = await LegalEntityModel.create({
 *   documentId: 'doc-123',
 *   type: LegalEntityType.PARTY,
 *   text: 'Acme Corporation'
 * });
 * ```
 */
export declare const createLegalEntityModel: (sequelize: any, DataTypes: any) => any;
/**
 * Creates Sequelize model for risk indicators.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} RiskIndicator model
 *
 * @example
 * ```typescript
 * const RiskIndicatorModel = createRiskIndicatorModel(sequelize, DataTypes);
 * ```
 */
export declare const createRiskIndicatorModel: (sequelize: any, DataTypes: any) => any;
/**
 * Sets up model associations for legal document system.
 *
 * @param {any} LegalDocument - LegalDocument model
 * @param {any} DocumentClause - DocumentClause model
 * @param {any} LegalEntity - LegalEntity model
 * @param {any} RiskIndicator - RiskIndicator model
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupModelAssociations(LegalDocument, DocumentClause, LegalEntity, RiskIndicator);
 * ```
 */
export declare const setupModelAssociations: (LegalDocument: any, DocumentClause: any, LegalEntity: any, RiskIndicator: any) => void;
/**
 * Creates NestJS controller for document upload.
 *
 * @param {any} documentService - Document service instance
 * @returns {any} Controller class
 *
 * @example
 * ```typescript
 * @Controller('legal/documents')
 * export class DocumentController extends createDocumentUploadController(documentService) {}
 * ```
 */
export declare const createDocumentUploadController: (documentService: any) => {
    new (): {
        uploadDocument(file: any, metadata: Partial<DocumentMetadata>): Promise<{
            success: boolean;
            documentId: any;
            message: string;
        }>;
        uploadMultipleDocuments(files: any[], metadata: Partial<DocumentMetadata>): Promise<{
            success: boolean;
            documents: {
                success: boolean;
                documentId: any;
                message: string;
            }[];
            count: number;
        }>;
    };
};
/**
 * Creates NestJS controller for document analysis.
 *
 * @param {any} analysisService - Analysis service instance
 * @returns {any} Controller class
 *
 * @example
 * ```typescript
 * @Controller('legal/analysis')
 * export class AnalysisController extends createAnalysisController(analysisService) {}
 * ```
 */
export declare const createAnalysisController: (analysisService: any) => {
    new (): {
        analyzeDocument(documentId: string, config?: AnalysisConfig): Promise<{
            success: boolean;
            documentId: string;
            summary: any;
        }>;
        extractClauses(documentId: string, categories?: ClauseCategory[]): Promise<{
            success: boolean;
            documentId: string;
            clauses: any;
            count: any;
        }>;
        assessRisks(documentId: string): Promise<{
            success: boolean;
            documentId: string;
            risks: any;
            overallRisk: RiskLevel;
        }>;
        compareDocuments(documentId1: string, documentId2: string): Promise<{
            success: boolean;
            comparison: any;
        }>;
    };
};
/**
 * Generates Swagger API documentation for document endpoints.
 *
 * @returns {any} Swagger documentation object
 *
 * @example
 * ```typescript
 * const swaggerDoc = generateDocumentApiSwagger();
 * ```
 */
export declare const generateDocumentApiSwagger: () => any;
/**
 * Creates Swagger decorators for NestJS endpoints.
 *
 * @param {string} endpoint - Endpoint path
 * @param {string} method - HTTP method
 * @returns {any} Swagger decorator configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(createSwaggerDecorators('/documents/upload', 'POST'))
 * async uploadDocument() {}
 * ```
 */
export declare const createSwaggerDecorators: (endpoint: string, method: string) => any;
//# sourceMappingURL=legal-document-analysis-kit.d.ts.map