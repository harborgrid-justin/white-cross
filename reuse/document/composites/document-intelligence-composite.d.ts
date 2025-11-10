/**
 * LOC: DOCINTEL001
 * File: /reuse/document/composites/document-intelligence-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-intelligence-kit
 *   - ../document-data-extraction-kit
 *   - ../document-ocr-kit
 *   - ../document-advanced-ocr-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - AI extraction services
 *   - Document classification modules
 *   - OCR processing engines
 *   - Smart suggestion systems
 *   - Document analytics dashboards
 *   - Healthcare intelligence systems
 */
/**
 * File: /reuse/document/composites/document-intelligence-composite.ts
 * Locator: WC-DOC-INTELLIGENCE-001
 * Purpose: Comprehensive Document Intelligence Toolkit - Production-ready AI extraction and analysis
 *
 * Upstream: Composed from document-intelligence-kit, document-data-extraction-kit, document-ocr-kit, document-advanced-ocr-kit, document-analytics-kit
 * Downstream: ../backend/*, AI services, Classification engines, OCR processing, Smart suggestions, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for AI extraction, classification, OCR, analysis, smart suggestions, document understanding
 *
 * LLM Context: Enterprise-grade document intelligence toolkit for White Cross healthcare platform.
 * Provides comprehensive AI-powered document capabilities including intelligent data extraction from
 * unstructured documents, automated document classification, OCR with medical terminology recognition,
 * entity extraction for medical entities, sentiment analysis for patient feedback, smart field suggestions,
 * document summarization, anomaly detection, and HIPAA-compliant analytics. Composes functions from
 * multiple document kits to provide unified intelligence operations for medical records processing,
 * insurance claim extraction, prescription interpretation, and clinical documentation understanding.
 */
import { Model } from 'sequelize-typescript';
/**
 * Document classification result
 */
export interface DocumentClassification {
    id: string;
    documentId: string;
    primaryCategory: DocumentCategory;
    subCategories: string[];
    confidence: number;
    classificationMethod: ClassificationMethod;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * Document categories for healthcare
 */
export declare enum DocumentCategory {
    MEDICAL_RECORD = "MEDICAL_RECORD",
    LAB_REPORT = "LAB_REPORT",
    PRESCRIPTION = "PRESCRIPTION",
    INSURANCE_CLAIM = "INSURANCE_CLAIM",
    PATIENT_CONSENT = "PATIENT_CONSENT",
    DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",
    RADIOLOGY_REPORT = "RADIOLOGY_REPORT",
    PATHOLOGY_REPORT = "PATHOLOGY_REPORT",
    REFERRAL_LETTER = "REFERRAL_LETTER",
    INVOICE = "INVOICE",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    UNKNOWN = "UNKNOWN"
}
/**
 * Classification methods
 */
export declare enum ClassificationMethod {
    RULE_BASED = "RULE_BASED",
    ML_MODEL = "ML_MODEL",
    NLP_ANALYSIS = "NLP_ANALYSIS",
    HYBRID = "HYBRID",
    MANUAL = "MANUAL"
}
/**
 * Data extraction result
 */
export interface ExtractionResult {
    id: string;
    documentId: string;
    extractedFields: ExtractedField[];
    entities: ExtractedEntity[];
    structuredData: Record<string, any>;
    confidence: number;
    extractionMethod: ExtractionMethod;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Extraction methods
 */
export declare enum ExtractionMethod {
    TEMPLATE_MATCHING = "TEMPLATE_MATCHING",
    NER = "NER",// Named Entity Recognition
    REGEX_PATTERN = "REGEX_PATTERN",
    ML_MODEL = "ML_MODEL",
    OCR_BASED = "OCR_BASED",
    HYBRID = "HYBRID"
}
/**
 * Extracted field
 */
export interface ExtractedField {
    name: string;
    value: any;
    type: FieldDataType;
    confidence: number;
    boundingBox?: BoundingBox;
    pageNumber?: number;
    metadata?: Record<string, any>;
}
/**
 * Field data types
 */
export declare enum FieldDataType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    DATE = "DATE",
    BOOLEAN = "BOOLEAN",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    ADDRESS = "ADDRESS",
    CURRENCY = "CURRENCY",
    MEDICAL_CODE = "MEDICAL_CODE",
    MEDICATION = "MEDICATION",
    DIAGNOSIS = "DIAGNOSIS"
}
/**
 * Bounding box for field location
 */
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    pageNumber: number;
}
/**
 * Extracted entity
 */
export interface ExtractedEntity {
    id: string;
    type: EntityType;
    text: string;
    normalizedValue?: string;
    confidence: number;
    position: BoundingBox;
    attributes?: Record<string, any>;
    relationships?: EntityRelationship[];
}
/**
 * Entity types for healthcare
 */
export declare enum EntityType {
    PERSON = "PERSON",
    PATIENT = "PATIENT",
    PROVIDER = "PROVIDER",
    ORGANIZATION = "ORGANIZATION",
    MEDICATION = "MEDICATION",
    DIAGNOSIS = "DIAGNOSIS",
    PROCEDURE = "PROCEDURE",
    LAB_TEST = "LAB_TEST",
    LAB_VALUE = "LAB_VALUE",
    ANATOMICAL_SITE = "ANATOMICAL_SITE",
    DATE = "DATE",
    QUANTITY = "QUANTITY",
    MEDICAL_CODE = "MEDICAL_CODE"
}
/**
 * Entity relationship
 */
export interface EntityRelationship {
    relationType: RelationType;
    targetEntityId: string;
    confidence: number;
}
/**
 * Relationship types
 */
export declare enum RelationType {
    PRESCRIBED_TO = "PRESCRIBED_TO",
    DIAGNOSED_WITH = "DIAGNOSED_WITH",
    PERFORMED_ON = "PERFORMED_ON",
    ORDERED_BY = "ORDERED_BY",
    ADMINISTERED_BY = "ADMINISTERED_BY",
    RELATED_TO = "RELATED_TO"
}
/**
 * OCR result
 */
export interface OCRResult {
    id: string;
    documentId: string;
    pages: OCRPage[];
    text: string;
    confidence: number;
    language: string;
    ocrEngine: OCREngine;
    processingTime: number;
    metadata?: Record<string, any>;
}
/**
 * OCR engines
 */
export declare enum OCREngine {
    TESSERACT = "TESSERACT",
    GOOGLE_VISION = "GOOGLE_VISION",
    AZURE_VISION = "AZURE_VISION",
    AWS_TEXTRACT = "AWS_TEXTRACT",
    CUSTOM = "CUSTOM"
}
/**
 * OCR page result
 */
export interface OCRPage {
    pageNumber: number;
    text: string;
    words: OCRWord[];
    lines: OCRLine[];
    confidence: number;
}
/**
 * OCR word
 */
export interface OCRWord {
    text: string;
    confidence: number;
    boundingBox: BoundingBox;
}
/**
 * OCR line
 */
export interface OCRLine {
    text: string;
    confidence: number;
    words: OCRWord[];
    boundingBox: BoundingBox;
}
/**
 * Document summary
 */
export interface DocumentSummary {
    id: string;
    documentId: string;
    summary: string;
    keyPoints: string[];
    wordCount: number;
    originalWordCount: number;
    compressionRatio: number;
    summaryMethod: SummaryMethod;
    timestamp: Date;
}
/**
 * Summary methods
 */
export declare enum SummaryMethod {
    EXTRACTIVE = "EXTRACTIVE",
    ABSTRACTIVE = "ABSTRACTIVE",
    HYBRID = "HYBRID",
    KEYWORD_BASED = "KEYWORD_BASED"
}
/**
 * Smart suggestion
 */
export interface SmartSuggestion {
    id: string;
    type: SuggestionType;
    field: string;
    suggestedValue: any;
    confidence: number;
    reason: string;
    context?: Record<string, any>;
}
/**
 * Suggestion types
 */
export declare enum SuggestionType {
    AUTO_COMPLETE = "AUTO_COMPLETE",
    CORRECTION = "CORRECTION",
    STANDARDIZATION = "STANDARDIZATION",
    VALIDATION = "VALIDATION",
    RELATED_DATA = "RELATED_DATA"
}
/**
 * Document analytics
 */
export interface DocumentAnalytics {
    documentId: string;
    pageCount: number;
    wordCount: number;
    characterCount: number;
    averageWordsPerPage: number;
    readabilityScore: number;
    complexity: ComplexityLevel;
    topics: Topic[];
    sentiment?: SentimentAnalysis;
    statistics: DocumentStatistics;
}
/**
 * Complexity levels
 */
export declare enum ComplexityLevel {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH"
}
/**
 * Topic identification
 */
export interface Topic {
    name: string;
    relevance: number;
    keywords: string[];
}
/**
 * Sentiment analysis result
 */
export interface SentimentAnalysis {
    overall: SentimentScore;
    positive: number;
    negative: number;
    neutral: number;
    confidence: number;
}
/**
 * Sentiment scores
 */
export declare enum SentimentScore {
    VERY_POSITIVE = "VERY_POSITIVE",
    POSITIVE = "POSITIVE",
    NEUTRAL = "NEUTRAL",
    NEGATIVE = "NEGATIVE",
    VERY_NEGATIVE = "VERY_NEGATIVE"
}
/**
 * Document statistics
 */
export interface DocumentStatistics {
    uniqueWords: number;
    averageWordLength: number;
    averageSentenceLength: number;
    paragraphCount: number;
    sentenceCount: number;
    lexicalDensity: number;
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    id: string;
    documentId: string;
    anomalies: Anomaly[];
    overallScore: number;
    detectionMethod: AnomalyDetectionMethod;
    timestamp: Date;
}
/**
 * Anomaly detection methods
 */
export declare enum AnomalyDetectionMethod {
    STATISTICAL = "STATISTICAL",
    PATTERN_BASED = "PATTERN_BASED",
    ML_BASED = "ML_BASED",
    RULE_BASED = "RULE_BASED"
}
/**
 * Detected anomaly
 */
export interface Anomaly {
    type: AnomalyType;
    description: string;
    severity: AnomalySeverity;
    confidence: number;
    location?: BoundingBox;
    suggestedFix?: string;
}
/**
 * Anomaly types
 */
export declare enum AnomalyType {
    INCONSISTENT_DATA = "INCONSISTENT_DATA",
    MISSING_FIELD = "MISSING_FIELD",
    INVALID_FORMAT = "INVALID_FORMAT",
    SUSPICIOUS_VALUE = "SUSPICIOUS_VALUE",
    DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
    OUT_OF_RANGE = "OUT_OF_RANGE"
}
/**
 * Anomaly severity
 */
export declare enum AnomalySeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Medical code recognition
 */
export interface MedicalCodeRecognition {
    codeSystem: MedicalCodeSystem;
    code: string;
    display: string;
    confidence: number;
    context?: string;
}
/**
 * Medical code systems
 */
export declare enum MedicalCodeSystem {
    ICD_10 = "ICD_10",
    CPT = "CPT",
    SNOMED_CT = "SNOMED_CT",
    LOINC = "LOINC",
    RXNORM = "RXNORM",
    NDC = "NDC",
    HCPCS = "HCPCS"
}
/**
 * Document Classification Model
 * Stores document classification results
 */
export declare class DocumentClassificationModel extends Model {
    id: string;
    documentId: string;
    primaryCategory: DocumentCategory;
    subCategories: string[];
    confidence: number;
    classificationMethod: ClassificationMethod;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * Extraction Result Model
 * Stores data extraction results
 */
export declare class ExtractionResultModel extends Model {
    id: string;
    documentId: string;
    extractedFields: ExtractedField[];
    entities: ExtractedEntity[];
    structuredData: Record<string, any>;
    confidence: number;
    extractionMethod: ExtractionMethod;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * OCR Result Model
 * Stores OCR processing results
 */
export declare class OCRResultModel extends Model {
    id: string;
    documentId: string;
    pages: OCRPage[];
    text: string;
    confidence: number;
    language: string;
    ocrEngine: OCREngine;
    processingTime: number;
    metadata?: Record<string, any>;
}
/**
 * Classifies a document into categories.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document content
 * @param {ClassificationMethod} method - Classification method
 * @returns {DocumentClassification} Classification result
 *
 * @example
 * ```typescript
 * const classification = classifyDocument('doc123', content, ClassificationMethod.ML_MODEL);
 * ```
 */
export declare const classifyDocument: (documentId: string, content: string, method?: ClassificationMethod) => DocumentClassification;
/**
 * Extracts data from document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document content
 * @param {ExtractionMethod} method - Extraction method
 * @returns {ExtractionResult} Extraction result
 *
 * @example
 * ```typescript
 * const result = extractDocumentData('doc123', content, ExtractionMethod.NER);
 * ```
 */
export declare const extractDocumentData: (documentId: string, content: string, method?: ExtractionMethod) => ExtractionResult;
/**
 * Extracts fields from content using pattern matching.
 *
 * @param {string} content - Content to extract from
 * @returns {ExtractedField[]} Extracted fields
 *
 * @example
 * ```typescript
 * const fields = extractFields(documentContent);
 * ```
 */
export declare const extractFields: (content: string) => ExtractedField[];
/**
 * Extracts entities from content.
 *
 * @param {string} content - Content to extract from
 * @returns {ExtractedEntity[]} Extracted entities
 *
 * @example
 * ```typescript
 * const entities = extractEntities(documentContent);
 * ```
 */
export declare const extractEntities: (content: string) => ExtractedEntity[];
/**
 * Performs OCR on document image.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} imageData - Image data
 * @param {OCREngine} engine - OCR engine to use
 * @returns {Promise<OCRResult>} OCR result
 *
 * @example
 * ```typescript
 * const result = await performOCR('doc123', imageBuffer, OCREngine.TESSERACT);
 * ```
 */
export declare const performOCR: (documentId: string, imageData: Buffer, engine?: OCREngine) => Promise<OCRResult>;
/**
 * Enhances OCR accuracy for medical terminology.
 *
 * @param {OCRResult} ocrResult - Raw OCR result
 * @returns {OCRResult} Enhanced OCR result
 *
 * @example
 * ```typescript
 * const enhanced = enhanceOCRForMedical(rawOcrResult);
 * ```
 */
export declare const enhanceOCRForMedical: (ocrResult: OCRResult) => OCRResult;
/**
 * Generates document summary.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document content
 * @param {number} maxLength - Maximum summary length
 * @returns {DocumentSummary} Document summary
 *
 * @example
 * ```typescript
 * const summary = generateDocumentSummary('doc123', content, 500);
 * ```
 */
export declare const generateDocumentSummary: (documentId: string, content: string, maxLength?: number) => DocumentSummary;
/**
 * Generates smart suggestions for field values.
 *
 * @param {string} field - Field name
 * @param {string} currentValue - Current field value
 * @param {Record<string, any>} context - Context data
 * @returns {SmartSuggestion[]} Smart suggestions
 *
 * @example
 * ```typescript
 * const suggestions = generateSmartSuggestions('diagnosis', 'diab', {patientAge: 45});
 * ```
 */
export declare const generateSmartSuggestions: (field: string, currentValue: string, context?: Record<string, any>) => SmartSuggestion[];
/**
 * Analyzes document for key metrics.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Document content
 * @returns {DocumentAnalytics} Analytics result
 *
 * @example
 * ```typescript
 * const analytics = analyzeDocument('doc123', content);
 * ```
 */
export declare const analyzeDocument: (documentId: string, content: string) => DocumentAnalytics;
/**
 * Calculates readability score.
 *
 * @param {number} avgSentenceLength - Average sentence length
 * @param {number} avgWordLength - Average word length
 * @returns {number} Readability score
 *
 * @example
 * ```typescript
 * const score = calculateReadabilityScore(15, 5);
 * ```
 */
export declare const calculateReadabilityScore: (avgSentenceLength: number, avgWordLength: number) => number;
/**
 * Determines complexity level from readability score.
 *
 * @param {number} readabilityScore - Readability score
 * @returns {ComplexityLevel} Complexity level
 *
 * @example
 * ```typescript
 * const level = determineComplexity(65);
 * ```
 */
export declare const determineComplexity: (readabilityScore: number) => ComplexityLevel;
/**
 * Extracts topics from document content.
 *
 * @param {string} content - Document content
 * @returns {Topic[]} Extracted topics
 *
 * @example
 * ```typescript
 * const topics = extractTopics(content);
 * ```
 */
export declare const extractTopics: (content: string) => Topic[];
/**
 * Performs sentiment analysis on document.
 *
 * @param {string} content - Document content
 * @returns {SentimentAnalysis} Sentiment analysis result
 *
 * @example
 * ```typescript
 * const sentiment = analyzeSentiment(patientFeedback);
 * ```
 */
export declare const analyzeSentiment: (content: string) => SentimentAnalysis;
/**
 * Detects anomalies in document data.
 *
 * @param {string} documentId - Document identifier
 * @param {Record<string, any>} extractedData - Extracted data
 * @returns {AnomalyDetectionResult} Anomaly detection result
 *
 * @example
 * ```typescript
 * const anomalies = detectDocumentAnomalies('doc123', extractedData);
 * ```
 */
export declare const detectDocumentAnomalies: (documentId: string, extractedData: Record<string, any>) => AnomalyDetectionResult;
/**
 * Recognizes medical codes in text.
 *
 * @param {string} text - Text to analyze
 * @returns {MedicalCodeRecognition[]} Recognized medical codes
 *
 * @example
 * ```typescript
 * const codes = recognizeMedicalCodes(documentText);
 * ```
 */
export declare const recognizeMedicalCodes: (text: string) => MedicalCodeRecognition[];
/**
 * Validates extracted data against schema.
 *
 * @param {Record<string, any>} data - Extracted data
 * @param {Record<string, FieldDataType>} schema - Data schema
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateExtractedData(data, schema);
 * ```
 */
export declare const validateExtractedData: (data: Record<string, any>, schema: Record<string, FieldDataType>) => string[];
/**
 * Normalizes extracted entity values.
 *
 * @param {ExtractedEntity} entity - Entity to normalize
 * @returns {ExtractedEntity} Normalized entity
 *
 * @example
 * ```typescript
 * const normalized = normalizeEntityValue(entity);
 * ```
 */
export declare const normalizeEntityValue: (entity: ExtractedEntity) => ExtractedEntity;
/**
 * Calculates extraction confidence score.
 *
 * @param {ExtractedField[]} fields - Extracted fields
 * @returns {number} Overall confidence score
 *
 * @example
 * ```typescript
 * const confidence = calculateExtractionConfidence(fields);
 * ```
 */
export declare const calculateExtractionConfidence: (fields: ExtractedField[]) => number;
/**
 * Merges extraction results from multiple methods.
 *
 * @param {ExtractionResult[]} results - Multiple extraction results
 * @returns {ExtractionResult} Merged result
 *
 * @example
 * ```typescript
 * const merged = mergeExtractionResults([result1, result2]);
 * ```
 */
export declare const mergeExtractionResults: (results: ExtractionResult[]) => ExtractionResult;
/**
 * Filters low-confidence extractions.
 *
 * @param {ExtractionResult} result - Extraction result
 * @param {number} minConfidence - Minimum confidence threshold
 * @returns {ExtractionResult} Filtered result
 *
 * @example
 * ```typescript
 * const filtered = filterLowConfidenceExtractions(result, 70);
 * ```
 */
export declare const filterLowConfidenceExtractions: (result: ExtractionResult, minConfidence?: number) => ExtractionResult;
/**
 * Exports extraction results to JSON.
 *
 * @param {ExtractionResult} result - Extraction result
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportExtractionToJSON(result);
 * ```
 */
export declare const exportExtractionToJSON: (result: ExtractionResult) => string;
/**
 * Generates extraction quality report.
 *
 * @param {ExtractionResult} result - Extraction result
 * @returns {Record<string, any>} Quality report
 *
 * @example
 * ```typescript
 * const report = generateExtractionQualityReport(result);
 * ```
 */
export declare const generateExtractionQualityReport: (result: ExtractionResult) => Record<string, any>;
/**
 * Links entities with relationships.
 *
 * @param {ExtractedEntity[]} entities - Entities to link
 * @returns {ExtractedEntity[]} Entities with relationships
 *
 * @example
 * ```typescript
 * const linked = linkRelatedEntities(entities);
 * ```
 */
export declare const linkRelatedEntities: (entities: ExtractedEntity[]) => ExtractedEntity[];
/**
 * Detects document language.
 *
 * @param {string} content - Document content
 * @returns {string} Detected language code
 *
 * @example
 * ```typescript
 * const lang = detectLanguage(content);
 * ```
 */
export declare const detectLanguage: (content: string) => string;
/**
 * Extracts key phrases from document.
 *
 * @param {string} content - Document content
 * @param {number} maxPhrases - Maximum phrases to extract
 * @returns {Array<{phrase: string, score: number}>} Key phrases
 *
 * @example
 * ```typescript
 * const phrases = extractKeyPhrases(content, 10);
 * ```
 */
export declare const extractKeyPhrases: (content: string, maxPhrases?: number) => Array<{
    phrase: string;
    score: number;
}>;
/**
 * Matches document against templates.
 *
 * @param {string} content - Document content
 * @param {string[]} templates - Template patterns
 * @returns {Array<{template: string, matchScore: number}>} Template matches
 *
 * @example
 * ```typescript
 * const matches = matchDocumentTemplates(content, templates);
 * ```
 */
export declare const matchDocumentTemplates: (content: string, templates: string[]) => Array<{
    template: string;
    matchScore: number;
}>;
/**
 * Validates classification result.
 *
 * @param {DocumentClassification} classification - Classification to validate
 * @param {number} minConfidence - Minimum confidence threshold
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateClassification(classification, 70);
 * ```
 */
export declare const validateClassification: (classification: DocumentClassification, minConfidence?: number) => boolean;
/**
 * Compares two document extractions.
 *
 * @param {ExtractionResult} extraction1 - First extraction
 * @param {ExtractionResult} extraction2 - Second extraction
 * @returns {Record<string, any>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareExtractions(ext1, ext2);
 * ```
 */
export declare const compareExtractions: (extraction1: ExtractionResult, extraction2: ExtractionResult) => Record<string, any>;
/**
 * Enriches extracted data with additional context.
 *
 * @param {ExtractionResult} result - Extraction result
 * @param {Record<string, any>} enrichmentData - Additional data
 * @returns {ExtractionResult} Enriched result
 *
 * @example
 * ```typescript
 * const enriched = enrichExtractedData(result, additionalData);
 * ```
 */
export declare const enrichExtractedData: (result: ExtractionResult, enrichmentData: Record<string, any>) => ExtractionResult;
/**
 * Calculates document similarity score.
 *
 * @param {string} content1 - First document content
 * @param {string} content2 - Second document content
 * @returns {number} Similarity score (0-100)
 *
 * @example
 * ```typescript
 * const similarity = calculateDocumentSimilarity(doc1, doc2);
 * ```
 */
export declare const calculateDocumentSimilarity: (content1: string, content2: string) => number;
/**
 * Extracts metadata from document.
 *
 * @param {string} content - Document content
 * @returns {Record<string, any>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractDocumentMetadata(content);
 * ```
 */
export declare const extractDocumentMetadata: (content: string) => Record<string, any>;
/**
 * Boosts extraction confidence based on validation.
 *
 * @param {ExtractionResult} result - Extraction result
 * @param {Record<string, any>} validatedData - Validated data
 * @returns {ExtractionResult} Boosted result
 *
 * @example
 * ```typescript
 * const boosted = boostExtractionConfidence(result, validatedData);
 * ```
 */
export declare const boostExtractionConfidence: (result: ExtractionResult, validatedData: Record<string, any>) => ExtractionResult;
/**
 * Generates extraction performance metrics.
 *
 * @param {ExtractionResult[]} results - Multiple extraction results
 * @returns {Record<string, any>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = generateExtractionMetrics(results);
 * ```
 */
export declare const generateExtractionMetrics: (results: ExtractionResult[]) => Record<string, any>;
/**
 * Suggests field corrections based on patterns.
 *
 * @param {ExtractedField} field - Field to check
 * @returns {SmartSuggestion | null} Suggested correction
 *
 * @example
 * ```typescript
 * const suggestion = suggestFieldCorrection(field);
 * ```
 */
export declare const suggestFieldCorrection: (field: ExtractedField) => SmartSuggestion | null;
/**
 * Batches documents for processing.
 *
 * @param {string[]} documentIds - Document IDs
 * @param {number} batchSize - Batch size
 * @returns {string[][]} Batched document IDs
 *
 * @example
 * ```typescript
 * const batches = batchDocumentsForProcessing(docIds, 10);
 * ```
 */
export declare const batchDocumentsForProcessing: (documentIds: string[], batchSize?: number) => string[][];
/**
 * Converts extraction result to CSV format.
 *
 * @param {ExtractionResult} result - Extraction result
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const csv = convertExtractionToCSV(result);
 * ```
 */
export declare const convertExtractionToCSV: (result: ExtractionResult) => string;
/**
 * Prioritizes extractions by confidence and importance.
 *
 * @param {ExtractionResult[]} results - Extraction results
 * @returns {ExtractionResult[]} Prioritized results
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeExtractions(results);
 * ```
 */
export declare const prioritizeExtractions: (results: ExtractionResult[]) => ExtractionResult[];
/**
 * Validates OCR quality.
 *
 * @param {OCRResult} ocrResult - OCR result to validate
 * @returns {Record<string, any>} Quality validation result
 *
 * @example
 * ```typescript
 * const quality = validateOCRQuality(ocrResult);
 * ```
 */
export declare const validateOCRQuality: (ocrResult: OCRResult) => Record<string, any>;
/**
 * Document Intelligence Service
 * Production-ready NestJS service for document intelligence operations
 */
export declare class DocumentIntelligenceService {
    /**
     * Processes document with full intelligence pipeline
     */
    processDocument(documentId: string, content: string): Promise<{
        classification: DocumentClassification;
        extraction: ExtractionResult;
        analytics: DocumentAnalytics;
    }>;
    /**
     * Performs OCR and extracts data from image
     */
    processImageDocument(documentId: string, imageData: Buffer): Promise<ExtractionResult>;
}
declare const _default: {
    DocumentClassificationModel: typeof DocumentClassificationModel;
    ExtractionResultModel: typeof ExtractionResultModel;
    OCRResultModel: typeof OCRResultModel;
    classifyDocument: (documentId: string, content: string, method?: ClassificationMethod) => DocumentClassification;
    extractDocumentData: (documentId: string, content: string, method?: ExtractionMethod) => ExtractionResult;
    extractFields: (content: string) => ExtractedField[];
    extractEntities: (content: string) => ExtractedEntity[];
    performOCR: (documentId: string, imageData: Buffer, engine?: OCREngine) => Promise<OCRResult>;
    enhanceOCRForMedical: (ocrResult: OCRResult) => OCRResult;
    generateDocumentSummary: (documentId: string, content: string, maxLength?: number) => DocumentSummary;
    generateSmartSuggestions: (field: string, currentValue: string, context?: Record<string, any>) => SmartSuggestion[];
    analyzeDocument: (documentId: string, content: string) => DocumentAnalytics;
    calculateReadabilityScore: (avgSentenceLength: number, avgWordLength: number) => number;
    determineComplexity: (readabilityScore: number) => ComplexityLevel;
    extractTopics: (content: string) => Topic[];
    analyzeSentiment: (content: string) => SentimentAnalysis;
    detectDocumentAnomalies: (documentId: string, extractedData: Record<string, any>) => AnomalyDetectionResult;
    recognizeMedicalCodes: (text: string) => MedicalCodeRecognition[];
    validateExtractedData: (data: Record<string, any>, schema: Record<string, FieldDataType>) => string[];
    normalizeEntityValue: (entity: ExtractedEntity) => ExtractedEntity;
    calculateExtractionConfidence: (fields: ExtractedField[]) => number;
    mergeExtractionResults: (results: ExtractionResult[]) => ExtractionResult;
    filterLowConfidenceExtractions: (result: ExtractionResult, minConfidence?: number) => ExtractionResult;
    exportExtractionToJSON: (result: ExtractionResult) => string;
    generateExtractionQualityReport: (result: ExtractionResult) => Record<string, any>;
    linkRelatedEntities: (entities: ExtractedEntity[]) => ExtractedEntity[];
    detectLanguage: (content: string) => string;
    extractKeyPhrases: (content: string, maxPhrases?: number) => Array<{
        phrase: string;
        score: number;
    }>;
    matchDocumentTemplates: (content: string, templates: string[]) => Array<{
        template: string;
        matchScore: number;
    }>;
    validateClassification: (classification: DocumentClassification, minConfidence?: number) => boolean;
    compareExtractions: (extraction1: ExtractionResult, extraction2: ExtractionResult) => Record<string, any>;
    enrichExtractedData: (result: ExtractionResult, enrichmentData: Record<string, any>) => ExtractionResult;
    calculateDocumentSimilarity: (content1: string, content2: string) => number;
    extractDocumentMetadata: (content: string) => Record<string, any>;
    boostExtractionConfidence: (result: ExtractionResult, validatedData: Record<string, any>) => ExtractionResult;
    generateExtractionMetrics: (results: ExtractionResult[]) => Record<string, any>;
    suggestFieldCorrection: (field: ExtractedField) => SmartSuggestion | null;
    batchDocumentsForProcessing: (documentIds: string[], batchSize?: number) => string[][];
    convertExtractionToCSV: (result: ExtractionResult) => string;
    prioritizeExtractions: (results: ExtractionResult[]) => ExtractionResult[];
    validateOCRQuality: (ocrResult: OCRResult) => Record<string, any>;
    DocumentIntelligenceService: typeof DocumentIntelligenceService;
};
export default _default;
//# sourceMappingURL=document-intelligence-composite.d.ts.map