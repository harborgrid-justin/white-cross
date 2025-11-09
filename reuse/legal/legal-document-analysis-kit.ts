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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Document type classifications for legal documents
 */
export enum DocumentType {
  CONTRACT = 'contract',
  AGREEMENT = 'agreement',
  POLICY = 'policy',
  TERMS_OF_SERVICE = 'terms_of_service',
  PRIVACY_POLICY = 'privacy_policy',
  NDA = 'nda',
  LICENSE = 'license',
  COMPLIANCE_DOC = 'compliance_doc',
  REGULATION = 'regulation',
  MEMO = 'memo',
  LETTER = 'letter',
  CONSENT_FORM = 'consent_form',
  WAIVER = 'waiver',
  AMENDMENT = 'amendment',
  ADDENDUM = 'addendum',
  UNKNOWN = 'unknown',
}

/**
 * Risk severity levels for document analysis
 */
export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}

/**
 * Legal entity types for Named Entity Recognition
 */
export enum LegalEntityType {
  PARTY = 'party',
  ORGANIZATION = 'organization',
  PERSON = 'person',
  DATE = 'date',
  MONEY = 'money',
  LOCATION = 'location',
  LAW_REFERENCE = 'law_reference',
  REGULATION_REFERENCE = 'regulation_reference',
  CASE_CITATION = 'case_citation',
  CONTRACT_CLAUSE = 'contract_clause',
  JURISDICTION = 'jurisdiction',
  SIGNATURE = 'signature',
}

/**
 * Clause categories for legal documents
 */
export enum ClauseCategory {
  PAYMENT_TERMS = 'payment_terms',
  TERMINATION = 'termination',
  LIABILITY = 'liability',
  INDEMNIFICATION = 'indemnification',
  CONFIDENTIALITY = 'confidentiality',
  NON_COMPETE = 'non_compete',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  GOVERNING_LAW = 'governing_law',
  FORCE_MAJEURE = 'force_majeure',
  WARRANTIES = 'warranties',
  REPRESENTATIONS = 'representations',
  ASSIGNMENT = 'assignment',
  AMENDMENTS = 'amendments',
  NOTICES = 'notices',
  SEVERABILITY = 'severability',
  ENTIRE_AGREEMENT = 'entire_agreement',
  RENEWAL = 'renewal',
  DATA_PROTECTION = 'data_protection',
  COMPLIANCE = 'compliance',
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
  errors?: Array<{ documentId: string; error: string }>;
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
export const classifyDocument = async (
  documentId: string,
  content: string,
  config?: Partial<AnalysisConfig>,
): Promise<ClassificationResult> => {
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

  const scores: Record<DocumentType, number> = {} as any;

  for (const [type, typePatterns] of Object.entries(patterns)) {
    let score = 0;
    for (const pattern of typePatterns) {
      if (pattern.test(content)) {
        score += 1;
      }
    }
    scores[type as DocumentType] = score / typePatterns.length;
  }

  const sortedTypes = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const primaryType = (sortedTypes[0]?.[0] as DocumentType) || DocumentType.UNKNOWN;
  const confidence = sortedTypes[0]?.[1] || 0;

  const categories = extractCategories(content);
  const tags = extractTags(content);

  return {
    documentId,
    primaryType,
    secondaryTypes: sortedTypes
      .slice(1, 3)
      .filter(([, score]) => score > 0.3)
      .map(([type]) => type as DocumentType),
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
export const extractCategories = (content: string): string[] => {
  const categoryPatterns: Record<string, RegExp[]> = {
    healthcare: [/\bhealth\b/i, /\bmedical\b/i, /\bpatient\b/i, /\bHIPAA\b/i],
    financial: [/\bpayment\b/i, /\bfinancial\b/i, /\binvoice\b/i, /\bfee\b/i],
    compliance: [/\bcompliance\b/i, /\bregulat/i, /\bstandards?\b/i],
    employment: [/\bemployment\b/i, /\bemployee\b/i, /\bsalary\b/i],
    intellectual_property: [/\bIP\b/, /\bpatent\b/i, /\btrademark\b/i, /\bcopyright\b/i],
  };

  const categories: string[] = [];

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((pattern) => pattern.test(content))) {
      categories.push(category);
    }
  }

  return categories;
};

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
export const extractTags = (content: string): string[] => {
  const tags: string[] = [];

  if (/\burgent\b/i.test(content)) tags.push('urgent');
  if (/\bconfidential\b/i.test(content)) tags.push('confidential');
  if (/\breview\b/i.test(content)) tags.push('review-required');
  if (/\$[\d,]+/g.test(content)) tags.push('financial');
  if (/\bHIPAA\b|\bGDPR\b|\bSOX\b/i.test(content)) tags.push('compliance');

  return tags;
};

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
export const detectLanguage = (
  content: string,
): { language: string; confidence: number } => {
  // Simple language detection based on common patterns
  const languagePatterns = {
    en: /\b(the|and|for|that|with|this|from|have|been)\b/gi,
    es: /\b(el|la|de|que|en|los|las|del|por)\b/gi,
    fr: /\b(le|la|de|et|un|une|pour|dans|les)\b/gi,
  };

  const scores: Record<string, number> = {};

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
export const classifyDocumentsBulk = async (
  documents: Array<{ id: string; content: string }>,
  config?: Partial<AnalysisConfig>,
): Promise<ClassificationResult[]> => {
  const batchSize = 10;
  const results: ClassificationResult[] = [];

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((doc) => classifyDocument(doc.id, doc.content, config)),
    );
    results.push(...batchResults);
  }

  return results;
};

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
export const extractClauses = async (
  documentId: string,
  content: string,
  categories?: ClauseCategory[],
): Promise<ExtractedClause[]> => {
  const clausePatterns: Record<ClauseCategory, RegExp[]> = {
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

  const targetCategories = categories || (Object.keys(clausePatterns) as ClauseCategory[]);
  const extractedClauses: ExtractedClause[] = [];

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
            importance: determineClauseImportance(category),
            keyTerms: extractKeyTermsFromClause(paragraph),
          });
        }
      });
    });
  });

  return extractedClauses;
};

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
export const determineClauseImportance = (
  category: ClauseCategory,
): 'critical' | 'high' | 'medium' | 'low' => {
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

  if (criticalCategories.includes(category)) return 'critical';
  if (highCategories.includes(category)) return 'high';
  if (
    [
      ClauseCategory.GOVERNING_LAW,
      ClauseCategory.WARRANTIES,
      ClauseCategory.DATA_PROTECTION,
    ].includes(category)
  )
    return 'medium';

  return 'low';
};

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
export const extractKeyTermsFromClause = (clauseText: string): string[] => {
  const keyTermPatterns = [
    /\b\d+\s+days?\b/gi, // Time periods
    /\$[\d,]+(?:\.\d{2})?/g, // Money amounts
    /\b\d+%\b/g, // Percentages
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
  ];

  const terms = new Set<string>();

  keyTermPatterns.forEach((pattern) => {
    const matches = clauseText.match(pattern);
    if (matches) {
      matches.forEach((match) => terms.add(match.trim()));
    }
  });

  return Array.from(terms);
};

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
export const analyzeClauseComplexity = (
  clause: ExtractedClause,
): { complexity: number; readability: number; suggestions: string[] } => {
  const sentences = clause.text.split(/[.!?]+/);
  const words = clause.text.split(/\s+/);
  const avgSentenceLength = words.length / sentences.length;

  // Simple complexity score based on sentence length and word length
  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const complexity = Math.min(
    (avgSentenceLength / 20 + avgWordLength / 6) / 2,
    1,
  );

  const suggestions: string[] = [];
  if (avgSentenceLength > 25) suggestions.push('Simplify sentence structure');
  if (avgWordLength > 6) suggestions.push('Use simpler vocabulary');
  if (clause.text.length > 500) suggestions.push('Consider breaking into multiple clauses');

  return {
    complexity,
    readability: 1 - complexity,
    suggestions,
  };
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
export const findRelatedClauses = (
  clause: ExtractedClause,
  allClauses: ExtractedClause[],
): string[] => {
  const relatedIds: string[] = [];
  const sourceTerms = new Set(clause.keyTerms.map((t) => t.toLowerCase()));

  allClauses.forEach((otherClause) => {
    if (otherClause.id === clause.id) return;

    const otherTerms = new Set(otherClause.keyTerms.map((t) => t.toLowerCase()));
    const intersection = new Set(
      [...sourceTerms].filter((term) => otherTerms.has(term)),
    );

    const similarity = intersection.size / Math.max(sourceTerms.size, otherTerms.size);

    if (similarity > 0.3) {
      relatedIds.push(otherClause.id);
    }
  });

  return relatedIds;
};

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
export const performNER = async (
  documentId: string,
  content: string,
  entityTypes?: LegalEntityType[],
): Promise<LegalEntity[]> => {
  const entities: LegalEntity[] = [];

  const entityPatterns: Record<LegalEntityType, RegExp[]> = {
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

  const targetTypes = entityTypes || (Object.keys(entityPatterns) as LegalEntityType[]);

  targetTypes.forEach((type) => {
    const patterns = entityPatterns[type];
    patterns.forEach((pattern) => {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        entities.push({
          id: `${documentId}-entity-${entities.length}`,
          documentId,
          type,
          text: match[0],
          normalizedValue: normalizeEntity(match[0], type),
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
export const normalizeEntity = (value: string, type: LegalEntityType): string => {
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
export const extractParties = (content: string): string[] => {
  const partyPatterns = [
    /(?:between|by and between)\s+([^,\n]+)\s+(?:and|&)\s+([^,\n]+)/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Ltd|Corp))\b/g,
  ];

  const parties = new Set<string>();

  partyPatterns.forEach((pattern) => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) parties.add(match[1].trim());
      if (match[2]) parties.add(match[2].trim());
    }
  });

  return Array.from(parties);
};

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
export const extractDates = (content: string): Record<string, Date> => {
  const dates: Record<string, Date> = {};

  const effectiveDateMatch = content.match(
    /effective\s+(?:date|as\s+of)\s*:?\s*([^\n,]+)/i,
  );
  if (effectiveDateMatch) {
    dates.effectiveDate = new Date(effectiveDateMatch[1]);
  }

  const expirationMatch = content.match(
    /expir(?:ation|es|y)\s+(?:date|on)\s*:?\s*([^\n,]+)/i,
  );
  if (expirationMatch) {
    dates.expirationDate = new Date(expirationMatch[1]);
  }

  const signedMatch = content.match(/(?:signed|executed)\s+on\s*:?\s*([^\n,]+)/i);
  if (signedMatch) {
    dates.signedDate = new Date(signedMatch[1]);
  }

  return dates;
};

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
export const extractFinancialTerms = (
  content: string,
): {
  amounts: number[];
  currency: string;
  totalValue?: number;
  paymentSchedule?: string;
} => {
  const moneyPattern = /\$?([\d,]+(?:\.\d{2})?)\s*(USD|EUR|GBP)?/g;
  const amounts: number[] = [];
  let currency = 'USD';

  let match: RegExpExecArray | null;
  while ((match = moneyPattern.exec(content)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    amounts.push(amount);
    if (match[2]) currency = match[2];
  }

  const totalValue = amounts.length > 0 ? Math.max(...amounts) : undefined;

  const scheduleMatch = content.match(
    /payment\s+schedule\s*:?\s*([^\n.]+)/i,
  );
  const paymentSchedule = scheduleMatch ? scheduleMatch[1].trim() : undefined;

  return { amounts, currency, totalValue, paymentSchedule };
};

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
export const generateDocumentSummary = async (
  documentId: string,
  content: string,
  clauses: ExtractedClause[],
  entities: LegalEntity[],
): Promise<DocumentSummary> => {
  const parties = extractParties(content);
  const dates = extractDates(content);
  const financialTerms = extractFinancialTerms(content);

  const criticalClauses = clauses.filter(
    (c) => c.importance === 'critical' || c.importance === 'high',
  );

  const riskIndicators = await assessDocumentRisks(documentId, content, clauses);

  const keyPoints = generateKeyPoints(content, clauses, entities);

  const executiveSummary = generateExecutiveSummary(
    content,
    parties,
    financialTerms,
    criticalClauses,
  );

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
      overallRisk: calculateOverallRisk(riskIndicators),
      riskIndicators,
      mitigationSuggestions: generateMitigationSuggestions(riskIndicators),
    },
    complianceFlags: detectComplianceFlags(content),
  };
};

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
export const generateExecutiveSummary = (
  content: string,
  parties: string[],
  financialTerms: any,
  criticalClauses: ExtractedClause[],
): string => {
  const summary: string[] = [];

  if (parties.length > 0) {
    summary.push(
      `This agreement is between ${parties.slice(0, 2).join(' and ')}${parties.length > 2 ? ` and ${parties.length - 2} other ${parties.length - 2 === 1 ? 'party' : 'parties'}` : ''}.`,
    );
  }

  if (financialTerms.totalValue) {
    summary.push(
      `The total contract value is ${financialTerms.currency} ${financialTerms.totalValue.toLocaleString()}.`,
    );
  }

  if (criticalClauses.length > 0) {
    const clauseCategories = criticalClauses.map((c) => c.category).slice(0, 3);
    summary.push(
      `Key provisions include ${clauseCategories.join(', ').replace(/_/g, ' ')}.`,
    );
  }

  return summary.join(' ');
};

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
export const generateKeyPoints = (
  content: string,
  clauses: ExtractedClause[],
  entities: LegalEntity[],
): string[] => {
  const points: string[] = [];

  const paymentClause = clauses.find((c) => c.category === ClauseCategory.PAYMENT_TERMS);
  if (paymentClause) {
    points.push(`Payment terms are defined in the agreement`);
  }

  const terminationClause = clauses.find((c) => c.category === ClauseCategory.TERMINATION);
  if (terminationClause) {
    points.push(`Termination conditions are specified`);
  }

  const confidentialityClause = clauses.find(
    (c) => c.category === ClauseCategory.CONFIDENTIALITY,
  );
  if (confidentialityClause) {
    points.push(`Confidentiality obligations are in place`);
  }

  const dates = extractDates(content);
  if (dates.expirationDate) {
    points.push(`Agreement expires on ${dates.expirationDate.toLocaleDateString()}`);
  }

  return points;
};

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
export const extractDocumentInsights = (
  summary: DocumentSummary,
): Record<string, any> => {
  return {
    complexity:
      summary.criticalClauses.length > 10
        ? 'high'
        : summary.criticalClauses.length > 5
          ? 'medium'
          : 'low',
    riskProfile: summary.riskAssessment.overallRisk,
    complianceStatus:
      summary.complianceFlags && summary.complianceFlags.length > 0
        ? 'requires-review'
        : 'compliant',
    financialSignificance: summary.financialTerms?.totalValue
      ? summary.financialTerms.totalValue > 100000
        ? 'high'
        : 'medium'
      : 'low',
    timeConstraints:
      summary.expirationDate && summary.expirationDate < new Date()
        ? 'expired'
        : 'active',
  };
};

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
export const assessDocumentRisks = async (
  documentId: string,
  content: string,
  clauses: ExtractedClause[],
): Promise<RiskIndicator[]> => {
  const risks: RiskIndicator[] = [];

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
    let match: RegExpExecArray | null;
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
          start: match.index!,
          end: match.index! + match[0].length,
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
export const calculateOverallRisk = (risks: RiskIndicator[]): RiskLevel => {
  if (risks.some((r) => r.riskLevel === RiskLevel.CRITICAL)) return RiskLevel.CRITICAL;
  if (risks.filter((r) => r.riskLevel === RiskLevel.HIGH).length >= 3)
    return RiskLevel.HIGH;
  if (risks.some((r) => r.riskLevel === RiskLevel.HIGH)) return RiskLevel.HIGH;
  if (risks.some((r) => r.riskLevel === RiskLevel.MEDIUM)) return RiskLevel.MEDIUM;
  if (risks.length > 0) return RiskLevel.LOW;
  return RiskLevel.NONE;
};

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
export const generateMitigationSuggestions = (risks: RiskIndicator[]): string[] => {
  const suggestions = new Set<string>();

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
export const detectComplianceFlags = (content: string): string[] => {
  const flags: string[] = [];

  const compliancePatterns: Record<string, RegExp> = {
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
export const flagHighRiskTerms = (
  clauses: ExtractedClause[],
): Array<{ clause: ExtractedClause; reason: string }> => {
  const flagged: Array<{ clause: ExtractedClause; reason: string }> = [];

  const riskTerms: Record<string, string> = {
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
export const compareDocuments = async (
  documentId1: string,
  content1: string,
  documentId2: string,
  content2: string,
): Promise<DocumentComparisonResult> => {
  // Simple similarity calculation using word overlap
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  const similarity = intersection.size / union.size;

  const differences: DocumentComparisonResult['differences'] = [];
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
    } else if (p1 && !p2) {
      differences.push({
        section: `Paragraph ${i + 1}`,
        type: 'removed',
        content1: p1,
      });
    } else if (p1 !== p2) {
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
export const trackDocumentVersions = async (
  documentIds: string[],
  contents: string[],
): Promise<Array<DocumentComparisonResult>> => {
  const comparisons: DocumentComparisonResult[] = [];

  for (let i = 0; i < documentIds.length - 1; i++) {
    const comparison = await compareDocuments(
      documentIds[i],
      contents[i],
      documentIds[i + 1],
      contents[i + 1],
    );
    comparisons.push(comparison);
  }

  return comparisons;
};

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
export const createLegalDocumentModel = (sequelize: any, DataTypes: any) => {
  return sequelize.define(
    'LegalDocument',
    {
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
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'legal_documents',
    },
  );
};

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
export const createDocumentClauseModel = (sequelize: any, DataTypes: any) => {
  return sequelize.define(
    'DocumentClause',
    {
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
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'document_clauses',
    },
  );
};

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
export const createLegalEntityModel = (sequelize: any, DataTypes: any) => {
  return sequelize.define(
    'LegalEntity',
    {
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
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'legal_entities',
    },
  );
};

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
export const createRiskIndicatorModel = (sequelize: any, DataTypes: any) => {
  return sequelize.define(
    'RiskIndicator',
    {
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
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'risk_indicators',
    },
  );
};

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
export const setupModelAssociations = (
  LegalDocument: any,
  DocumentClause: any,
  LegalEntity: any,
  RiskIndicator: any,
): void => {
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
export const createDocumentUploadController = (documentService: any) => {
  return class {
    async uploadDocument(file: any, metadata: Partial<DocumentMetadata>) {
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

    async uploadMultipleDocuments(files: any[], metadata: Partial<DocumentMetadata>) {
      const results = await Promise.all(
        files.map((file) =>
          this.uploadDocument(file, metadata),
        ),
      );

      return {
        success: true,
        documents: results,
        count: results.length,
      };
    }
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
export const createAnalysisController = (analysisService: any) => {
  return class {
    async analyzeDocument(documentId: string, config?: AnalysisConfig) {
      const result = await analysisService.analyze(documentId, config);
      return {
        success: true,
        documentId,
        summary: result,
      };
    }

    async extractClauses(documentId: string, categories?: ClauseCategory[]) {
      const clauses = await analysisService.extractClauses(documentId, categories);
      return {
        success: true,
        documentId,
        clauses,
        count: clauses.length,
      };
    }

    async assessRisks(documentId: string) {
      const risks = await analysisService.assessRisks(documentId);
      return {
        success: true,
        documentId,
        risks,
        overallRisk: calculateOverallRisk(risks),
      };
    }

    async compareDocuments(documentId1: string, documentId2: string) {
      const comparison = await analysisService.compare(documentId1, documentId2);
      return {
        success: true,
        comparison,
      };
    }
  };
};

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
export const generateDocumentApiSwagger = (): any => {
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
export const createSwaggerDecorators = (endpoint: string, method: string): any => {
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
