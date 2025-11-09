"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSwaggerDecorators = exports.generateDocumentApiSwagger = exports.createAnalysisController = exports.createDocumentUploadController = exports.setupModelAssociations = exports.createRiskIndicatorModel = exports.createLegalEntityModel = exports.createDocumentClauseModel = exports.createLegalDocumentModel = exports.trackDocumentVersions = exports.compareDocuments = exports.flagHighRiskTerms = exports.detectComplianceFlags = exports.generateMitigationSuggestions = exports.calculateOverallRisk = exports.assessDocumentRisks = exports.extractDocumentInsights = exports.generateKeyPoints = exports.generateExecutiveSummary = exports.generateDocumentSummary = exports.extractFinancialTerms = exports.extractDates = exports.extractParties = exports.normalizeEntity = exports.performNER = exports.findRelatedClauses = exports.analyzeClauseComplexity = exports.extractKeyTermsFromClause = exports.determineClauseImportance = exports.extractClauses = exports.classifyDocumentsBulk = exports.detectLanguage = exports.extractTags = exports.extractCategories = exports.classifyDocument = exports.ClauseCategory = exports.LegalEntityType = exports.RiskLevel = exports.DocumentType = void 0;
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
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Document type classifications for legal documents
 */
var DocumentType;
(function (DocumentType) {
    DocumentType["CONTRACT"] = "contract";
    DocumentType["AGREEMENT"] = "agreement";
    DocumentType["POLICY"] = "policy";
    DocumentType["TERMS_OF_SERVICE"] = "terms_of_service";
    DocumentType["PRIVACY_POLICY"] = "privacy_policy";
    DocumentType["NDA"] = "nda";
    DocumentType["LICENSE"] = "license";
    DocumentType["COMPLIANCE_DOC"] = "compliance_doc";
    DocumentType["REGULATION"] = "regulation";
    DocumentType["MEMO"] = "memo";
    DocumentType["LETTER"] = "letter";
    DocumentType["CONSENT_FORM"] = "consent_form";
    DocumentType["WAIVER"] = "waiver";
    DocumentType["AMENDMENT"] = "amendment";
    DocumentType["ADDENDUM"] = "addendum";
    DocumentType["UNKNOWN"] = "unknown";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
/**
 * Risk severity levels for document analysis
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["CRITICAL"] = "critical";
    RiskLevel["HIGH"] = "high";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["LOW"] = "low";
    RiskLevel["NONE"] = "none";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
/**
 * Legal entity types for Named Entity Recognition
 */
var LegalEntityType;
(function (LegalEntityType) {
    LegalEntityType["PARTY"] = "party";
    LegalEntityType["ORGANIZATION"] = "organization";
    LegalEntityType["PERSON"] = "person";
    LegalEntityType["DATE"] = "date";
    LegalEntityType["MONEY"] = "money";
    LegalEntityType["LOCATION"] = "location";
    LegalEntityType["LAW_REFERENCE"] = "law_reference";
    LegalEntityType["REGULATION_REFERENCE"] = "regulation_reference";
    LegalEntityType["CASE_CITATION"] = "case_citation";
    LegalEntityType["CONTRACT_CLAUSE"] = "contract_clause";
    LegalEntityType["JURISDICTION"] = "jurisdiction";
    LegalEntityType["SIGNATURE"] = "signature";
})(LegalEntityType || (exports.LegalEntityType = LegalEntityType = {}));
/**
 * Clause categories for legal documents
 */
var ClauseCategory;
(function (ClauseCategory) {
    ClauseCategory["PAYMENT_TERMS"] = "payment_terms";
    ClauseCategory["TERMINATION"] = "termination";
    ClauseCategory["LIABILITY"] = "liability";
    ClauseCategory["INDEMNIFICATION"] = "indemnification";
    ClauseCategory["CONFIDENTIALITY"] = "confidentiality";
    ClauseCategory["NON_COMPETE"] = "non_compete";
    ClauseCategory["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    ClauseCategory["DISPUTE_RESOLUTION"] = "dispute_resolution";
    ClauseCategory["GOVERNING_LAW"] = "governing_law";
    ClauseCategory["FORCE_MAJEURE"] = "force_majeure";
    ClauseCategory["WARRANTIES"] = "warranties";
    ClauseCategory["REPRESENTATIONS"] = "representations";
    ClauseCategory["ASSIGNMENT"] = "assignment";
    ClauseCategory["AMENDMENTS"] = "amendments";
    ClauseCategory["NOTICES"] = "notices";
    ClauseCategory["SEVERABILITY"] = "severability";
    ClauseCategory["ENTIRE_AGREEMENT"] = "entire_agreement";
    ClauseCategory["RENEWAL"] = "renewal";
    ClauseCategory["DATA_PROTECTION"] = "data_protection";
    ClauseCategory["COMPLIANCE"] = "compliance";
})(ClauseCategory || (exports.ClauseCategory = ClauseCategory = {}));
// ============================================================================
// DOCUMENT CLASSIFICATION & CATEGORIZATION
// ============================================================================
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
const classifyDocument = async (documentId, content, config) => {
    const patterns = {
        [DocumentType.CONTRACT]: [
            /\bagreement\b/i,
            /\bcontracts?\b/i,
            /\bparties\b/i,
            /\bwhereas\b/i,
            /\bconsideration\b/i,
        ],
        [DocumentType.NDA]: [/\bnon-disclosure\b/i, /\bconfidential/i, /\bproprietary\b/i],
        [DocumentType.PRIVACY_POLICY]: [
            /\bprivacy policy\b/i,
            /\bpersonal data\b/i,
            /\bdata protection\b/i,
            /\bGDPR\b/i,
        ],
        [DocumentType.TERMS_OF_SERVICE]: [/\bterms of service\b/i, /\bterms and conditions\b/i],
        [DocumentType.CONSENT_FORM]: [/\binformed consent\b/i, /\bconsent to\b/i, /\bvoluntary\b/i],
    };
    const scores = {};
    for (const [type, typePatterns] of Object.entries(patterns)) {
        let score = 0;
        for (const pattern of typePatterns) {
            if (pattern.test(content)) {
                score += 1;
            }
        }
        scores[type] = score / typePatterns.length;
    }
    const sortedTypes = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const primaryType = sortedTypes[0]?.[0] || DocumentType.UNKNOWN;
    const confidence = sortedTypes[0]?.[1] || 0;
    const categories = (0, exports.extractCategories)(content);
    const tags = (0, exports.extractTags)(content);
    return {
        documentId,
        primaryType,
        secondaryTypes: sortedTypes
            .slice(1, 3)
            .filter(([, score]) => score > 0.3)
            .map(([type]) => type),
        confidence,
        categories,
        tags,
        metadata: {
            wordCount: content.split(/\s+/).length,
            hasSignatureBlock: /\b(signature|signed|executed)\b/i.test(content),
            hasDateReferences: /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(content),
        },
    };
};
exports.classifyDocument = classifyDocument;
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
const extractCategories = (content) => {
    const categoryPatterns = {
        healthcare: [/\bhealth\b/i, /\bmedical\b/i, /\bpatient\b/i, /\bHIPAA\b/i],
        financial: [/\bpayment\b/i, /\bfinancial\b/i, /\binvoice\b/i, /\bfee\b/i],
        compliance: [/\bcompliance\b/i, /\bregulat/i, /\bstandards?\b/i],
        employment: [/\bemployment\b/i, /\bemployee\b/i, /\bsalary\b/i],
        intellectual_property: [/\bIP\b/, /\bpatent\b/i, /\btrademark\b/i, /\bcopyright\b/i],
    };
    const categories = [];
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
        if (patterns.some((pattern) => pattern.test(content))) {
            categories.push(category);
        }
    }
    return categories;
};
exports.extractCategories = extractCategories;
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
const extractTags = (content) => {
    const tags = [];
    if (/\burgent\b/i.test(content))
        tags.push('urgent');
    if (/\bconfidential\b/i.test(content))
        tags.push('confidential');
    if (/\breview\b/i.test(content))
        tags.push('review-required');
    if (/\$[\d,]+/g.test(content))
        tags.push('financial');
    if (/\bHIPAA\b|\bGDPR\b|\bSOX\b/i.test(content))
        tags.push('compliance');
    return tags;
};
exports.extractTags = extractTags;
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
const detectLanguage = (content) => {
    // Simple language detection based on common patterns
    const languagePatterns = {
        en: /\b(the|and|for|that|with|this|from|have|been)\b/gi,
        es: /\b(el|la|de|que|en|los|las|del|por)\b/gi,
        fr: /\b(le|la|de|et|un|une|pour|dans|les)\b/gi,
    };
    const scores = {};
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
        const matches = content.match(pattern);
        scores[lang] = matches ? matches.length : 0;
    }
    const sortedLangs = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const totalMatches = Object.values(scores).reduce((sum, count) => sum + count, 0);
    return {
        language: sortedLangs[0]?.[0] || 'en',
        confidence: totalMatches > 0 ? sortedLangs[0][1] / totalMatches : 0.5,
    };
};
exports.detectLanguage = detectLanguage;
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
const classifyDocumentsBulk = async (documents, config) => {
    const batchSize = 10;
    const results = [];
    for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((doc) => (0, exports.classifyDocument)(doc.id, doc.content, config)));
        results.push(...batchResults);
    }
    return results;
};
exports.classifyDocumentsBulk = classifyDocumentsBulk;
// ============================================================================
// KEY CLAUSE EXTRACTION & ANALYSIS
// ============================================================================
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
const extractClauses = async (documentId, content, categories) => {
    const clausePatterns = {
        [ClauseCategory.PAYMENT_TERMS]: [
            /payment\s+terms?/i,
            /compensation/i,
            /invoice/i,
            /fee\s+schedule/i,
        ],
        [ClauseCategory.TERMINATION]: [
            /termination/i,
            /cancellation/i,
            /end\s+of\s+agreement/i,
        ],
        [ClauseCategory.LIABILITY]: [/liability/i, /liable\s+for/i, /damages/i],
        [ClauseCategory.INDEMNIFICATION]: [/indemnif/i, /hold\s+harmless/i],
        [ClauseCategory.CONFIDENTIALITY]: [/confidential/i, /proprietary/i, /non-disclosure/i],
        [ClauseCategory.NON_COMPETE]: [/non-compete/i, /non-competition/i, /restrictive\s+covenant/i],
        [ClauseCategory.INTELLECTUAL_PROPERTY]: [
            /intellectual\s+property/i,
            /copyright/i,
            /patent/i,
            /trademark/i,
        ],
        [ClauseCategory.DISPUTE_RESOLUTION]: [
            /dispute\s+resolution/i,
            /arbitration/i,
            /mediation/i,
        ],
        [ClauseCategory.GOVERNING_LAW]: [/governing\s+law/i, /jurisdiction/i],
        [ClauseCategory.FORCE_MAJEURE]: [/force\s+majeure/i, /act\s+of\s+god/i],
        [ClauseCategory.WARRANTIES]: [/warrant/i, /guarantee/i],
        [ClauseCategory.REPRESENTATIONS]: [/represent/i, /certif/i],
        [ClauseCategory.ASSIGNMENT]: [/assignment/i, /transfer/i],
        [ClauseCategory.AMENDMENTS]: [/amendment/i, /modification/i, /change/i],
        [ClauseCategory.NOTICES]: [/notice/i, /notification/i],
        [ClauseCategory.SEVERABILITY]: [/severability/i, /severance/i],
        [ClauseCategory.ENTIRE_AGREEMENT]: [/entire\s+agreement/i, /integration/i],
        [ClauseCategory.RENEWAL]: [/renewal/i, /extension/i, /auto-renew/i],
        [ClauseCategory.DATA_PROTECTION]: [/data\s+protection/i, /GDPR/i, /privacy/i],
        [ClauseCategory.COMPLIANCE]: [/compliance/i, /comply\s+with/i, /regulatory/i],
    };
    const targetCategories = categories || Object.keys(clausePatterns);
    const extractedClauses = [];
    // Split content into paragraphs
    const paragraphs = content.split(/\n\n+/);
    targetCategories.forEach((category) => {
        const patterns = clausePatterns[category];
        paragraphs.forEach((paragraph, index) => {
            patterns.forEach((pattern) => {
                if (pattern.test(paragraph)) {
                    const position = content.indexOf(paragraph);
                    extractedClauses.push({
                        id: `${documentId}-clause-${extractedClauses.length}`,
                        documentId,
                        category,
                        text: paragraph.trim(),
                        position: {
                            start: position,
                            end: position + paragraph.length,
                        },
                        confidence: 0.85,
                        importance: (0, exports.determineClauseImportance)(category),
                        keyTerms: (0, exports.extractKeyTermsFromClause)(paragraph),
                    });
                }
            });
        });
    });
    return extractedClauses;
};
exports.extractClauses = extractClauses;
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
const determineClauseImportance = (category) => {
    const criticalCategories = [
        ClauseCategory.PAYMENT_TERMS,
        ClauseCategory.LIABILITY,
        ClauseCategory.INDEMNIFICATION,
        ClauseCategory.TERMINATION,
    ];
    const highCategories = [
        ClauseCategory.CONFIDENTIALITY,
        ClauseCategory.INTELLECTUAL_PROPERTY,
        ClauseCategory.NON_COMPETE,
        ClauseCategory.DISPUTE_RESOLUTION,
    ];
    if (criticalCategories.includes(category))
        return 'critical';
    if (highCategories.includes(category))
        return 'high';
    if ([
        ClauseCategory.GOVERNING_LAW,
        ClauseCategory.WARRANTIES,
        ClauseCategory.DATA_PROTECTION,
    ].includes(category))
        return 'medium';
    return 'low';
};
exports.determineClauseImportance = determineClauseImportance;
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
const extractKeyTermsFromClause = (clauseText) => {
    const keyTermPatterns = [
        /\b\d+\s+days?\b/gi, // Time periods
        /\$[\d,]+(?:\.\d{2})?/g, // Money amounts
        /\b\d+%\b/g, // Percentages
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
    ];
    const terms = new Set();
    keyTermPatterns.forEach((pattern) => {
        const matches = clauseText.match(pattern);
        if (matches) {
            matches.forEach((match) => terms.add(match.trim()));
        }
    });
    return Array.from(terms);
};
exports.extractKeyTermsFromClause = extractKeyTermsFromClause;
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
const analyzeClauseComplexity = (clause) => {
    const sentences = clause.text.split(/[.!?]+/);
    const words = clause.text.split(/\s+/);
    const avgSentenceLength = words.length / sentences.length;
    // Simple complexity score based on sentence length and word length
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const complexity = Math.min((avgSentenceLength / 20 + avgWordLength / 6) / 2, 1);
    const suggestions = [];
    if (avgSentenceLength > 25)
        suggestions.push('Simplify sentence structure');
    if (avgWordLength > 6)
        suggestions.push('Use simpler vocabulary');
    if (clause.text.length > 500)
        suggestions.push('Consider breaking into multiple clauses');
    return {
        complexity,
        readability: 1 - complexity,
        suggestions,
    };
};
exports.analyzeClauseComplexity = analyzeClauseComplexity;
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
const findRelatedClauses = (clause, allClauses) => {
    const relatedIds = [];
    const sourceTerms = new Set(clause.keyTerms.map((t) => t.toLowerCase()));
    allClauses.forEach((otherClause) => {
        if (otherClause.id === clause.id)
            return;
        const otherTerms = new Set(otherClause.keyTerms.map((t) => t.toLowerCase()));
        const intersection = new Set([...sourceTerms].filter((term) => otherTerms.has(term)));
        const similarity = intersection.size / Math.max(sourceTerms.size, otherTerms.size);
        if (similarity > 0.3) {
            relatedIds.push(otherClause.id);
        }
    });
    return relatedIds;
};
exports.findRelatedClauses = findRelatedClauses;
// ============================================================================
// LEGAL ENTITY RECOGNITION (NER)
// ============================================================================
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
const performNER = async (documentId, content, entityTypes) => {
    const entities = [];
    const entityPatterns = {
        [LegalEntityType.PARTY]: [
            /\b(?:Party|Parties|Contractor|Client|Vendor|Supplier)\b/gi,
        ],
        [LegalEntityType.ORGANIZATION]: [/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Ltd|Corp)\b/g],
        [LegalEntityType.PERSON]: [/\b(?:Mr|Mrs|Ms|Dr)\.\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g],
        [LegalEntityType.DATE]: [
            /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
            /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
        ],
        [LegalEntityType.MONEY]: [/\$[\d,]+(?:\.\d{2})?/g, /\b\d+(?:,\d{3})*(?:\.\d{2})?\s+(?:USD|EUR|GBP)\b/g],
        [LegalEntityType.LOCATION]: [/\b[A-Z][a-z]+,\s+[A-Z]{2}\b/g],
        [LegalEntityType.LAW_REFERENCE]: [/\b\d+\s+U\.S\.C\.\s+§\s*\d+/g, /\bPublic\s+Law\s+\d+-\d+\b/gi],
        [LegalEntityType.REGULATION_REFERENCE]: [/\bCFR\s+\d+/g, /\b[A-Z]+\s+Regulation\b/gi],
        [LegalEntityType.CASE_CITATION]: [/\b\d+\s+F\.\s*\d+d\s+\d+/g],
        [LegalEntityType.CONTRACT_CLAUSE]: [/\bSection\s+\d+(?:\.\d+)*/gi, /\bArticle\s+[IVX]+/gi],
        [LegalEntityType.JURISDICTION]: [/\bState\s+of\s+[A-Z][a-z]+/g, /\bU\.S\.\s+District\s+Court/gi],
        [LegalEntityType.SIGNATURE]: [/\bSigned:\s*/gi, /\bExecuted\s+by:/gi],
    };
    const targetTypes = entityTypes || Object.keys(entityPatterns);
    targetTypes.forEach((type) => {
        const patterns = entityPatterns[type];
        patterns.forEach((pattern) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                entities.push({
                    id: `${documentId}-entity-${entities.length}`,
                    documentId,
                    type,
                    text: match[0],
                    normalizedValue: (0, exports.normalizeEntity)(match[0], type),
                    position: {
                        start: match.index,
                        end: match.index + match[0].length,
                    },
                    confidence: 0.85,
                    metadata: {},
                });
            }
        });
    });
    return entities;
};
exports.performNER = performNER;
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
const normalizeEntity = (value, type) => {
    switch (type) {
        case LegalEntityType.MONEY:
            return value.replace(/[$,]/g, '');
        case LegalEntityType.DATE:
            return new Date(value).toISOString().split('T')[0];
        case LegalEntityType.ORGANIZATION:
        case LegalEntityType.PERSON:
            return value.trim();
        default:
            return value.trim();
    }
};
exports.normalizeEntity = normalizeEntity;
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
const extractParties = (content) => {
    const partyPatterns = [
        /(?:between|by and between)\s+([^,\n]+)\s+(?:and|&)\s+([^,\n]+)/gi,
        /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Ltd|Corp))\b/g,
    ];
    const parties = new Set();
    partyPatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            if (match[1])
                parties.add(match[1].trim());
            if (match[2])
                parties.add(match[2].trim());
        }
    });
    return Array.from(parties);
};
exports.extractParties = extractParties;
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
const extractDates = (content) => {
    const dates = {};
    const effectiveDateMatch = content.match(/effective\s+(?:date|as\s+of)\s*:?\s*([^\n,]+)/i);
    if (effectiveDateMatch) {
        dates.effectiveDate = new Date(effectiveDateMatch[1]);
    }
    const expirationMatch = content.match(/expir(?:ation|es|y)\s+(?:date|on)\s*:?\s*([^\n,]+)/i);
    if (expirationMatch) {
        dates.expirationDate = new Date(expirationMatch[1]);
    }
    const signedMatch = content.match(/(?:signed|executed)\s+on\s*:?\s*([^\n,]+)/i);
    if (signedMatch) {
        dates.signedDate = new Date(signedMatch[1]);
    }
    return dates;
};
exports.extractDates = extractDates;
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
const extractFinancialTerms = (content) => {
    const moneyPattern = /\$?([\d,]+(?:\.\d{2})?)\s*(USD|EUR|GBP)?/g;
    const amounts = [];
    let currency = 'USD';
    let match;
    while ((match = moneyPattern.exec(content)) !== null) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        amounts.push(amount);
        if (match[2])
            currency = match[2];
    }
    const totalValue = amounts.length > 0 ? Math.max(...amounts) : undefined;
    const scheduleMatch = content.match(/payment\s+schedule\s*:?\s*([^\n.]+)/i);
    const paymentSchedule = scheduleMatch ? scheduleMatch[1].trim() : undefined;
    return { amounts, currency, totalValue, paymentSchedule };
};
exports.extractFinancialTerms = extractFinancialTerms;
// ============================================================================
// DOCUMENT SUMMARIZATION & INSIGHTS
// ============================================================================
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
const generateDocumentSummary = async (documentId, content, clauses, entities) => {
    const parties = (0, exports.extractParties)(content);
    const dates = (0, exports.extractDates)(content);
    const financialTerms = (0, exports.extractFinancialTerms)(content);
    const criticalClauses = clauses.filter((c) => c.importance === 'critical' || c.importance === 'high');
    const riskIndicators = await (0, exports.assessDocumentRisks)(documentId, content, clauses);
    const keyPoints = (0, exports.generateKeyPoints)(content, clauses, entities);
    const executiveSummary = (0, exports.generateExecutiveSummary)(content, parties, financialTerms, criticalClauses);
    return {
        documentId,
        executiveSummary,
        keyPoints,
        parties,
        effectiveDate: dates.effectiveDate,
        expirationDate: dates.expirationDate,
        financialTerms: {
            totalValue: financialTerms.totalValue,
            currency: financialTerms.currency,
            paymentSchedule: financialTerms.paymentSchedule,
        },
        criticalClauses,
        riskAssessment: {
            overallRisk: (0, exports.calculateOverallRisk)(riskIndicators),
            riskIndicators,
            mitigationSuggestions: (0, exports.generateMitigationSuggestions)(riskIndicators),
        },
        complianceFlags: (0, exports.detectComplianceFlags)(content),
    };
};
exports.generateDocumentSummary = generateDocumentSummary;
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
const generateExecutiveSummary = (content, parties, financialTerms, criticalClauses) => {
    const summary = [];
    if (parties.length > 0) {
        summary.push(`This agreement is between ${parties.slice(0, 2).join(' and ')}${parties.length > 2 ? ` and ${parties.length - 2} other ${parties.length - 2 === 1 ? 'party' : 'parties'}` : ''}.`);
    }
    if (financialTerms.totalValue) {
        summary.push(`The total contract value is ${financialTerms.currency} ${financialTerms.totalValue.toLocaleString()}.`);
    }
    if (criticalClauses.length > 0) {
        const clauseCategories = criticalClauses.map((c) => c.category).slice(0, 3);
        summary.push(`Key provisions include ${clauseCategories.join(', ').replace(/_/g, ' ')}.`);
    }
    return summary.join(' ');
};
exports.generateExecutiveSummary = generateExecutiveSummary;
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
const generateKeyPoints = (content, clauses, entities) => {
    const points = [];
    const paymentClause = clauses.find((c) => c.category === ClauseCategory.PAYMENT_TERMS);
    if (paymentClause) {
        points.push(`Payment terms are defined in the agreement`);
    }
    const terminationClause = clauses.find((c) => c.category === ClauseCategory.TERMINATION);
    if (terminationClause) {
        points.push(`Termination conditions are specified`);
    }
    const confidentialityClause = clauses.find((c) => c.category === ClauseCategory.CONFIDENTIALITY);
    if (confidentialityClause) {
        points.push(`Confidentiality obligations are in place`);
    }
    const dates = (0, exports.extractDates)(content);
    if (dates.expirationDate) {
        points.push(`Agreement expires on ${dates.expirationDate.toLocaleDateString()}`);
    }
    return points;
};
exports.generateKeyPoints = generateKeyPoints;
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
const extractDocumentInsights = (summary) => {
    return {
        complexity: summary.criticalClauses.length > 10
            ? 'high'
            : summary.criticalClauses.length > 5
                ? 'medium'
                : 'low',
        riskProfile: summary.riskAssessment.overallRisk,
        complianceStatus: summary.complianceFlags && summary.complianceFlags.length > 0
            ? 'requires-review'
            : 'compliant',
        financialSignificance: summary.financialTerms?.totalValue
            ? summary.financialTerms.totalValue > 100000
                ? 'high'
                : 'medium'
            : 'low',
        timeConstraints: summary.expirationDate && summary.expirationDate < new Date()
            ? 'expired'
            : 'active',
    };
};
exports.extractDocumentInsights = extractDocumentInsights;
// ============================================================================
// RISK ASSESSMENT & FLAGGING
// ============================================================================
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
const assessDocumentRisks = async (documentId, content, clauses) => {
    const risks = [];
    // Check for missing critical clauses
    const requiredCategories = [
        ClauseCategory.LIABILITY,
        ClauseCategory.TERMINATION,
        ClauseCategory.GOVERNING_LAW,
    ];
    const presentCategories = new Set(clauses.map((c) => c.category));
    requiredCategories.forEach((category) => {
        if (!presentCategories.has(category)) {
            risks.push({
                id: `${documentId}-risk-${risks.length}`,
                documentId,
                riskLevel: RiskLevel.HIGH,
                category: 'missing_clause',
                description: `Missing ${category.replace(/_/g, ' ')} clause`,
                location: { start: 0, end: 0 },
                recommendation: `Add ${category.replace(/_/g, ' ')} clause to document`,
            });
        }
    });
    // Check for ambiguous language
    const ambiguousPatterns = [
        /\b(?:may|might|could|possibly|perhaps)\b/gi,
        /\b(?:reasonable|appropriate|sufficient)\b/gi,
    ];
    ambiguousPatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            risks.push({
                id: `${documentId}-risk-${risks.length}`,
                documentId,
                riskLevel: RiskLevel.MEDIUM,
                category: 'ambiguous_language',
                description: `Ambiguous term: "${match[0]}"`,
                location: { start: match.index, end: match.index + match[0].length },
                recommendation: 'Replace with specific, definitive language',
            });
        }
    });
    // Check for unlimited liability
    if (/unlimited\s+liability/i.test(content)) {
        const match = content.match(/unlimited\s+liability/i);
        if (match) {
            risks.push({
                id: `${documentId}-risk-${risks.length}`,
                documentId,
                riskLevel: RiskLevel.CRITICAL,
                category: 'liability',
                description: 'Unlimited liability clause detected',
                location: {
                    start: match.index,
                    end: match.index + match[0].length,
                },
                recommendation: 'Negotiate liability cap',
            });
        }
    }
    // Check for auto-renewal without notice period
    if (/auto-renew/i.test(content) && !/notice\s+period/i.test(content)) {
        risks.push({
            id: `${documentId}-risk-${risks.length}`,
            documentId,
            riskLevel: RiskLevel.HIGH,
            category: 'renewal',
            description: 'Auto-renewal without clear notice period',
            location: { start: 0, end: 0 },
            recommendation: 'Ensure adequate notice period for non-renewal',
        });
    }
    return risks;
};
exports.assessDocumentRisks = assessDocumentRisks;
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
const calculateOverallRisk = (risks) => {
    if (risks.some((r) => r.riskLevel === RiskLevel.CRITICAL))
        return RiskLevel.CRITICAL;
    if (risks.filter((r) => r.riskLevel === RiskLevel.HIGH).length >= 3)
        return RiskLevel.HIGH;
    if (risks.some((r) => r.riskLevel === RiskLevel.HIGH))
        return RiskLevel.HIGH;
    if (risks.some((r) => r.riskLevel === RiskLevel.MEDIUM))
        return RiskLevel.MEDIUM;
    if (risks.length > 0)
        return RiskLevel.LOW;
    return RiskLevel.NONE;
};
exports.calculateOverallRisk = calculateOverallRisk;
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
const generateMitigationSuggestions = (risks) => {
    const suggestions = new Set();
    risks.forEach((risk) => {
        if (risk.recommendation) {
            suggestions.add(risk.recommendation);
        }
        switch (risk.category) {
            case 'missing_clause':
                suggestions.add('Review and add all standard contract clauses');
                break;
            case 'ambiguous_language':
                suggestions.add('Replace vague terms with specific, measurable criteria');
                break;
            case 'liability':
                suggestions.add('Consult legal counsel regarding liability provisions');
                break;
            case 'compliance':
                suggestions.add('Ensure compliance with relevant regulations');
                break;
        }
    });
    return Array.from(suggestions);
};
exports.generateMitigationSuggestions = generateMitigationSuggestions;
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
const detectComplianceFlags = (content) => {
    const flags = [];
    const compliancePatterns = {
        HIPAA: /\bHIPAA\b/i,
        GDPR: /\bGDPR\b|\bGeneral Data Protection Regulation\b/i,
        SOX: /\bSarbanes-Oxley\b|\bSOX\b/i,
        PCI_DSS: /\bPCI DSS\b|\bPayment Card Industry\b/i,
        FDA: /\bFDA\b|\bFood and Drug Administration\b/i,
        OSHA: /\bOSHA\b|\bOccupational Safety\b/i,
    };
    Object.entries(compliancePatterns).forEach(([flag, pattern]) => {
        if (pattern.test(content)) {
            flags.push(flag);
        }
    });
    return flags;
};
exports.detectComplianceFlags = detectComplianceFlags;
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
const flagHighRiskTerms = (clauses) => {
    const flagged = [];
    const riskTerms = {
        'unlimited liability': 'Unlimited financial exposure',
        'perpetual license': 'Indefinite commitment',
        'non-refundable': 'No recourse for cancellation',
        'sole discretion': 'Unilateral decision-making',
        'automatically renew': 'Risk of unintended renewal',
        'no warranties': 'Lack of quality guarantees',
    };
    clauses.forEach((clause) => {
        Object.entries(riskTerms).forEach(([term, reason]) => {
            if (new RegExp(term, 'i').test(clause.text)) {
                flagged.push({ clause, reason });
            }
        });
    });
    return flagged;
};
exports.flagHighRiskTerms = flagHighRiskTerms;
// ============================================================================
// DOCUMENT COMPARISON & ANALYSIS
// ============================================================================
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
const compareDocuments = async (documentId1, content1, documentId2, content2) => {
    // Simple similarity calculation using word overlap
    const words1 = new Set(content1.toLowerCase().split(/\s+/));
    const words2 = new Set(content2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter((word) => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    const similarity = intersection.size / union.size;
    const differences = [];
    const paragraphs1 = content1.split(/\n\n+/);
    const paragraphs2 = content2.split(/\n\n+/);
    // Simple paragraph-level comparison
    const maxLength = Math.max(paragraphs1.length, paragraphs2.length);
    for (let i = 0; i < maxLength; i++) {
        const p1 = paragraphs1[i];
        const p2 = paragraphs2[i];
        if (!p1 && p2) {
            differences.push({
                section: `Paragraph ${i + 1}`,
                type: 'added',
                content2: p2,
            });
        }
        else if (p1 && !p2) {
            differences.push({
                section: `Paragraph ${i + 1}`,
                type: 'removed',
                content1: p1,
            });
        }
        else if (p1 !== p2) {
            differences.push({
                section: `Paragraph ${i + 1}`,
                type: 'modified',
                content1: p1,
                content2: p2,
            });
        }
    }
    return {
        documentId1,
        documentId2,
        similarity,
        differences,
        clauseChanges: [],
        recommendations: [
            'Review all modified sections',
            'Verify changes align with negotiated terms',
        ],
    };
};
exports.compareDocuments = compareDocuments;
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
const trackDocumentVersions = async (documentIds, contents) => {
    const comparisons = [];
    for (let i = 0; i < documentIds.length - 1; i++) {
        const comparison = await (0, exports.compareDocuments)(documentIds[i], contents[i], documentIds[i + 1], contents[i + 1]);
        comparisons.push(comparison);
    }
    return comparisons;
};
exports.trackDocumentVersions = trackDocumentVersions;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createLegalDocumentModel = (sequelize, DataTypes) => {
    return sequelize.define('LegalDocument', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        documentType: {
            type: DataTypes.ENUM(...Object.values(DocumentType)),
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING(10),
            defaultValue: 'en',
        },
        pageCount: {
            type: DataTypes.INTEGER,
        },
        wordCount: {
            type: DataTypes.INTEGER,
        },
        version: {
            type: DataTypes.STRING,
        },
        tags: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        category: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
            defaultValue: 'pending',
        },
        processingErrors: {
            type: DataTypes.JSON,
        },
        uploadedBy: {
            type: DataTypes.UUID,
        },
        content: {
            type: DataTypes.TEXT,
        },
        metadata: {
            type: DataTypes.JSON,
        },
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'legal_documents',
    });
};
exports.createLegalDocumentModel = createLegalDocumentModel;
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
const createDocumentClauseModel = (sequelize, DataTypes) => {
    return sequelize.define('DocumentClause', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'legal_documents',
                key: 'id',
            },
        },
        category: {
            type: DataTypes.ENUM(...Object.values(ClauseCategory)),
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        position: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        confidence: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
        importance: {
            type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
        },
        keyTerms: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        relatedClauses: {
            type: DataTypes.JSON,
        },
        riskIndicators: {
            type: DataTypes.JSON,
        },
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'document_clauses',
    });
};
exports.createDocumentClauseModel = createDocumentClauseModel;
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
const createLegalEntityModel = (sequelize, DataTypes) => {
    return sequelize.define('LegalEntity', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'legal_documents',
                key: 'id',
            },
        },
        type: {
            type: DataTypes.ENUM(...Object.values(LegalEntityType)),
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        normalizedValue: {
            type: DataTypes.STRING,
        },
        position: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        confidence: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
        metadata: {
            type: DataTypes.JSON,
        },
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'legal_entities',
    });
};
exports.createLegalEntityModel = createLegalEntityModel;
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
const createRiskIndicatorModel = (sequelize, DataTypes) => {
    return sequelize.define('RiskIndicator', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'legal_documents',
                key: 'id',
            },
        },
        clauseId: {
            type: DataTypes.UUID,
            references: {
                model: 'document_clauses',
                key: 'id',
            },
        },
        riskLevel: {
            type: DataTypes.ENUM(...Object.values(RiskLevel)),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        location: {
            type: DataTypes.JSON,
        },
        recommendation: {
            type: DataTypes.TEXT,
        },
        affectedParties: {
            type: DataTypes.JSON,
        },
        financialImpact: {
            type: DataTypes.DECIMAL(10, 2),
        },
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'risk_indicators',
    });
};
exports.createRiskIndicatorModel = createRiskIndicatorModel;
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
const setupModelAssociations = (LegalDocument, DocumentClause, LegalEntity, RiskIndicator) => {
    LegalDocument.hasMany(DocumentClause, {
        foreignKey: 'documentId',
        as: 'clauses',
    });
    LegalDocument.hasMany(LegalEntity, {
        foreignKey: 'documentId',
        as: 'entities',
    });
    LegalDocument.hasMany(RiskIndicator, {
        foreignKey: 'documentId',
        as: 'risks',
    });
    DocumentClause.belongsTo(LegalDocument, {
        foreignKey: 'documentId',
        as: 'document',
    });
    DocumentClause.hasMany(RiskIndicator, {
        foreignKey: 'clauseId',
        as: 'risks',
    });
    LegalEntity.belongsTo(LegalDocument, {
        foreignKey: 'documentId',
        as: 'document',
    });
    RiskIndicator.belongsTo(LegalDocument, {
        foreignKey: 'documentId',
        as: 'document',
    });
    RiskIndicator.belongsTo(DocumentClause, {
        foreignKey: 'clauseId',
        as: 'clause',
    });
};
exports.setupModelAssociations = setupModelAssociations;
// ============================================================================
// NESTJS CONTROLLERS & API
// ============================================================================
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
const createDocumentUploadController = (documentService) => {
    return class {
        async uploadDocument(file, metadata) {
            const document = await documentService.create({
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                uploadedAt: new Date(),
                ...metadata,
            });
            return {
                success: true,
                documentId: document.id,
                message: 'Document uploaded successfully',
            };
        }
        async uploadMultipleDocuments(files, metadata) {
            const results = await Promise.all(files.map((file) => this.uploadDocument(file, metadata)));
            return {
                success: true,
                documents: results,
                count: results.length,
            };
        }
    };
};
exports.createDocumentUploadController = createDocumentUploadController;
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
const createAnalysisController = (analysisService) => {
    return class {
        async analyzeDocument(documentId, config) {
            const result = await analysisService.analyze(documentId, config);
            return {
                success: true,
                documentId,
                summary: result,
            };
        }
        async extractClauses(documentId, categories) {
            const clauses = await analysisService.extractClauses(documentId, categories);
            return {
                success: true,
                documentId,
                clauses,
                count: clauses.length,
            };
        }
        async assessRisks(documentId) {
            const risks = await analysisService.assessRisks(documentId);
            return {
                success: true,
                documentId,
                risks,
                overallRisk: (0, exports.calculateOverallRisk)(risks),
            };
        }
        async compareDocuments(documentId1, documentId2) {
            const comparison = await analysisService.compare(documentId1, documentId2);
            return {
                success: true,
                comparison,
            };
        }
    };
};
exports.createAnalysisController = createAnalysisController;
// ============================================================================
// SWAGGER DOCUMENTATION HELPERS
// ============================================================================
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
const generateDocumentApiSwagger = () => {
    return {
        openapi: '3.0.0',
        info: {
            title: 'Legal Document Analysis API',
            version: '1.0.0',
            description: 'API for legal document processing, analysis, and risk assessment',
        },
        paths: {
            '/legal/documents/upload': {
                post: {
                    summary: 'Upload a legal document',
                    tags: ['Documents'],
                    requestBody: {
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                        },
                                        documentType: {
                                            type: 'string',
                                            enum: Object.values(DocumentType),
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Document uploaded successfully',
                        },
                    },
                },
            },
            '/legal/documents/{documentId}/analyze': {
                post: {
                    summary: 'Analyze a legal document',
                    tags: ['Analysis'],
                    parameters: [
                        {
                            name: 'documentId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Analysis completed successfully',
                        },
                    },
                },
            },
        },
    };
};
exports.generateDocumentApiSwagger = generateDocumentApiSwagger;
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
const createSwaggerDecorators = (endpoint, method) => {
    return {
        summary: `${method} ${endpoint}`,
        tags: [endpoint.split('/')[1]],
        responses: {
            200: { description: 'Success' },
            400: { description: 'Bad Request' },
            500: { description: 'Internal Server Error' },
        },
    };
};
exports.createSwaggerDecorators = createSwaggerDecorators;
//# sourceMappingURL=legal-document-analysis-kit.js.map