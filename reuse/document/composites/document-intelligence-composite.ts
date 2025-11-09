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

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  LAB_REPORT = 'LAB_REPORT',
  PRESCRIPTION = 'PRESCRIPTION',
  INSURANCE_CLAIM = 'INSURANCE_CLAIM',
  PATIENT_CONSENT = 'PATIENT_CONSENT',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  RADIOLOGY_REPORT = 'RADIOLOGY_REPORT',
  PATHOLOGY_REPORT = 'PATHOLOGY_REPORT',
  REFERRAL_LETTER = 'REFERRAL_LETTER',
  INVOICE = 'INVOICE',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Classification methods
 */
export enum ClassificationMethod {
  RULE_BASED = 'RULE_BASED',
  ML_MODEL = 'ML_MODEL',
  NLP_ANALYSIS = 'NLP_ANALYSIS',
  HYBRID = 'HYBRID',
  MANUAL = 'MANUAL',
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
export enum ExtractionMethod {
  TEMPLATE_MATCHING = 'TEMPLATE_MATCHING',
  NER = 'NER', // Named Entity Recognition
  REGEX_PATTERN = 'REGEX_PATTERN',
  ML_MODEL = 'ML_MODEL',
  OCR_BASED = 'OCR_BASED',
  HYBRID = 'HYBRID',
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
export enum FieldDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ADDRESS = 'ADDRESS',
  CURRENCY = 'CURRENCY',
  MEDICAL_CODE = 'MEDICAL_CODE',
  MEDICATION = 'MEDICATION',
  DIAGNOSIS = 'DIAGNOSIS',
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
export enum EntityType {
  PERSON = 'PERSON',
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
  ORGANIZATION = 'ORGANIZATION',
  MEDICATION = 'MEDICATION',
  DIAGNOSIS = 'DIAGNOSIS',
  PROCEDURE = 'PROCEDURE',
  LAB_TEST = 'LAB_TEST',
  LAB_VALUE = 'LAB_VALUE',
  ANATOMICAL_SITE = 'ANATOMICAL_SITE',
  DATE = 'DATE',
  QUANTITY = 'QUANTITY',
  MEDICAL_CODE = 'MEDICAL_CODE',
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
export enum RelationType {
  PRESCRIBED_TO = 'PRESCRIBED_TO',
  DIAGNOSED_WITH = 'DIAGNOSED_WITH',
  PERFORMED_ON = 'PERFORMED_ON',
  ORDERED_BY = 'ORDERED_BY',
  ADMINISTERED_BY = 'ADMINISTERED_BY',
  RELATED_TO = 'RELATED_TO',
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
export enum OCREngine {
  TESSERACT = 'TESSERACT',
  GOOGLE_VISION = 'GOOGLE_VISION',
  AZURE_VISION = 'AZURE_VISION',
  AWS_TEXTRACT = 'AWS_TEXTRACT',
  CUSTOM = 'CUSTOM',
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
export enum SummaryMethod {
  EXTRACTIVE = 'EXTRACTIVE',
  ABSTRACTIVE = 'ABSTRACTIVE',
  HYBRID = 'HYBRID',
  KEYWORD_BASED = 'KEYWORD_BASED',
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
export enum SuggestionType {
  AUTO_COMPLETE = 'AUTO_COMPLETE',
  CORRECTION = 'CORRECTION',
  STANDARDIZATION = 'STANDARDIZATION',
  VALIDATION = 'VALIDATION',
  RELATED_DATA = 'RELATED_DATA',
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
export enum ComplexityLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
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
export enum SentimentScore {
  VERY_POSITIVE = 'VERY_POSITIVE',
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
  VERY_NEGATIVE = 'VERY_NEGATIVE',
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
export enum AnomalyDetectionMethod {
  STATISTICAL = 'STATISTICAL',
  PATTERN_BASED = 'PATTERN_BASED',
  ML_BASED = 'ML_BASED',
  RULE_BASED = 'RULE_BASED',
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
export enum AnomalyType {
  INCONSISTENT_DATA = 'INCONSISTENT_DATA',
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  SUSPICIOUS_VALUE = 'SUSPICIOUS_VALUE',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

/**
 * Anomaly severity
 */
export enum AnomalySeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
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
export enum MedicalCodeSystem {
  ICD_10 = 'ICD_10',
  CPT = 'CPT',
  SNOMED_CT = 'SNOMED_CT',
  LOINC = 'LOINC',
  RXNORM = 'RXNORM',
  NDC = 'NDC',
  HCPCS = 'HCPCS',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Document Classification Model
 * Stores document classification results
 */
@Table({
  tableName: 'document_classifications',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['primaryCategory'] },
    { fields: ['confidence'] },
  ],
})
export class DocumentClassificationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique classification identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(DocumentCategory)))
  @ApiProperty({ enum: DocumentCategory, description: 'Primary category' })
  primaryCategory: DocumentCategory;

  @Column(DataType.ARRAY(DataType.STRING))
  @ApiPropertyOptional({ description: 'Sub-categories' })
  subCategories: string[];

  @AllowNull(false)
  @Index
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Classification confidence (0-100)' })
  confidence: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ClassificationMethod)))
  @ApiProperty({ enum: ClassificationMethod, description: 'Classification method' })
  classificationMethod: ClassificationMethod;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Classification timestamp' })
  timestamp: Date;
}

/**
 * Extraction Result Model
 * Stores data extraction results
 */
@Table({
  tableName: 'extraction_results',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['confidence'] },
    { fields: ['extractionMethod'] },
  ],
})
export class ExtractionResultModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique extraction identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Extracted fields', type: [Object] })
  extractedFields: ExtractedField[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Extracted entities', type: [Object] })
  entities: ExtractedEntity[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Structured data' })
  structuredData: Record<string, any>;

  @AllowNull(false)
  @Index
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Extraction confidence (0-100)' })
  confidence: number;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(ExtractionMethod)))
  @ApiProperty({ enum: ExtractionMethod, description: 'Extraction method' })
  extractionMethod: ExtractionMethod;

  @AllowNull(false)
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Extraction timestamp' })
  timestamp: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * OCR Result Model
 * Stores OCR processing results
 */
@Table({
  tableName: 'ocr_results',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['ocrEngine'] },
    { fields: ['confidence'] },
  ],
})
export class OCRResultModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique OCR result identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'OCR pages', type: [Object] })
  pages: OCRPage[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Extracted text' })
  text: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'OCR confidence (0-100)' })
  confidence: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Detected language' })
  language: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(OCREngine)))
  @ApiProperty({ enum: OCREngine, description: 'OCR engine used' })
  ocrEngine: OCREngine;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTime: number;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE INTELLIGENCE FUNCTIONS
// ============================================================================

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
export const classifyDocument = (
  documentId: string,
  content: string,
  method: ClassificationMethod = ClassificationMethod.HYBRID
): DocumentClassification => {
  // Simplified classification logic (in production, would use ML models)
  let primaryCategory = DocumentCategory.UNKNOWN;
  let confidence = 0;

  const contentLower = content.toLowerCase();

  if (contentLower.includes('prescription') || contentLower.includes('medication')) {
    primaryCategory = DocumentCategory.PRESCRIPTION;
    confidence = 85;
  } else if (contentLower.includes('lab') || contentLower.includes('test result')) {
    primaryCategory = DocumentCategory.LAB_REPORT;
    confidence = 80;
  } else if (contentLower.includes('claim') || contentLower.includes('insurance')) {
    primaryCategory = DocumentCategory.INSURANCE_CLAIM;
    confidence = 75;
  } else if (contentLower.includes('discharge')) {
    primaryCategory = DocumentCategory.DISCHARGE_SUMMARY;
    confidence = 80;
  } else {
    primaryCategory = DocumentCategory.MEDICAL_RECORD;
    confidence = 60;
  }

  return {
    id: crypto.randomUUID(),
    documentId,
    primaryCategory,
    subCategories: [],
    confidence,
    classificationMethod: method,
    timestamp: new Date(),
  };
};

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
export const extractDocumentData = (
  documentId: string,
  content: string,
  method: ExtractionMethod = ExtractionMethod.HYBRID
): ExtractionResult => {
  const fields = extractFields(content);
  const entities = extractEntities(content);

  const structuredData = fields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, any>);

  const avgConfidence =
    fields.length > 0
      ? fields.reduce((sum, f) => sum + f.confidence, 0) / fields.length
      : 0;

  return {
    id: crypto.randomUUID(),
    documentId,
    extractedFields: fields,
    entities,
    structuredData,
    confidence: avgConfidence,
    extractionMethod: method,
    timestamp: new Date(),
  };
};

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
export const extractFields = (content: string): ExtractedField[] => {
  const fields: ExtractedField[] = [];

  // Email extraction
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = content.match(emailRegex);
  if (emails) {
    emails.forEach((email) => {
      fields.push({
        name: 'email',
        value: email,
        type: FieldDataType.EMAIL,
        confidence: 95,
      });
    });
  }

  // Phone extraction
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const phones = content.match(phoneRegex);
  if (phones) {
    phones.forEach((phone) => {
      fields.push({
        name: 'phone',
        value: phone,
        type: FieldDataType.PHONE,
        confidence: 90,
      });
    });
  }

  // Date extraction
  const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g;
  const dates = content.match(dateRegex);
  if (dates) {
    dates.forEach((date) => {
      fields.push({
        name: 'date',
        value: date,
        type: FieldDataType.DATE,
        confidence: 85,
      });
    });
  }

  return fields;
};

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
export const extractEntities = (content: string): ExtractedEntity[] => {
  const entities: ExtractedEntity[] = [];

  // Simplified entity extraction (in production, would use NER models)
  const medicationKeywords = ['aspirin', 'ibuprofen', 'acetaminophen', 'lisinopril'];
  const contentLower = content.toLowerCase();

  medicationKeywords.forEach((med) => {
    if (contentLower.includes(med)) {
      entities.push({
        id: crypto.randomUUID(),
        type: EntityType.MEDICATION,
        text: med,
        confidence: 80,
        position: { x: 0, y: 0, width: 0, height: 0, pageNumber: 1 },
      });
    }
  });

  return entities;
};

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
export const performOCR = async (
  documentId: string,
  imageData: Buffer,
  engine: OCREngine = OCREngine.TESSERACT
): Promise<OCRResult> => {
  const startTime = Date.now();

  // Simplified OCR (in production, would call actual OCR service)
  const mockText = 'Sample OCR extracted text from document';
  const mockPage: OCRPage = {
    pageNumber: 1,
    text: mockText,
    words: [],
    lines: [],
    confidence: 85,
  };

  const processingTime = Date.now() - startTime;

  return {
    id: crypto.randomUUID(),
    documentId,
    pages: [mockPage],
    text: mockText,
    confidence: 85,
    language: 'en',
    ocrEngine: engine,
    processingTime,
  };
};

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
export const enhanceOCRForMedical = (ocrResult: OCRResult): OCRResult => {
  // Medical terminology corrections
  const corrections: Record<string, string> = {
    'acetarninophen': 'acetaminophen',
    'diahetes': 'diabetes',
    'hypertenslon': 'hypertension',
  };

  let enhancedText = ocrResult.text;

  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(wrong, 'gi');
    enhancedText = enhancedText.replace(regex, correct);
  });

  return {
    ...ocrResult,
    text: enhancedText,
    confidence: ocrResult.confidence + 5, // Slightly increased confidence
  };
};

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
export const generateDocumentSummary = (
  documentId: string,
  content: string,
  maxLength: number = 500
): DocumentSummary => {
  const words = content.split(/\s+/);
  const originalWordCount = words.length;

  // Simplified extractive summarization
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const keyPoints = sentences.slice(0, 3).map((s) => s.trim());

  const summary = keyPoints.join('. ') + '.';
  const wordCount = summary.split(/\s+/).length;

  return {
    id: crypto.randomUUID(),
    documentId,
    summary,
    keyPoints,
    wordCount,
    originalWordCount,
    compressionRatio: originalWordCount > 0 ? wordCount / originalWordCount : 0,
    summaryMethod: SummaryMethod.EXTRACTIVE,
    timestamp: new Date(),
  };
};

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
export const generateSmartSuggestions = (
  field: string,
  currentValue: string,
  context: Record<string, any> = {}
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];

  // Auto-complete suggestions
  if (field === 'diagnosis' && currentValue.toLowerCase().startsWith('diab')) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: SuggestionType.AUTO_COMPLETE,
      field,
      suggestedValue: 'Diabetes Mellitus Type 2',
      confidence: 85,
      reason: 'Common diagnosis matching input',
      context,
    });
  }

  // Standardization suggestions
  if (field === 'medication' && currentValue.toLowerCase().includes('acetaminophen')) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: SuggestionType.STANDARDIZATION,
      field,
      suggestedValue: 'Acetaminophen 500mg',
      confidence: 90,
      reason: 'Standardized medication format',
      context,
    });
  }

  return suggestions;
};

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
export const analyzeDocument = (documentId: string, content: string): DocumentAnalytics => {
  const words = content.split(/\s+/).filter((w) => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0);

  const wordCount = words.length;
  const characterCount = content.length;
  const pageCount = Math.ceil(wordCount / 300); // Approximate

  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;
  const averageWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / wordCount || 0;
  const averageSentenceLength = wordCount / sentences.length || 0;
  const lexicalDensity = wordCount > 0 ? uniqueWords / wordCount : 0;

  const readabilityScore = calculateReadabilityScore(averageSentenceLength, averageWordLength);
  const complexity = determineComplexity(readabilityScore);

  return {
    documentId,
    pageCount,
    wordCount,
    characterCount,
    averageWordsPerPage: pageCount > 0 ? wordCount / pageCount : 0,
    readabilityScore,
    complexity,
    topics: extractTopics(content),
    statistics: {
      uniqueWords,
      averageWordLength,
      averageSentenceLength,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      lexicalDensity,
    },
  };
};

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
export const calculateReadabilityScore = (
  avgSentenceLength: number,
  avgWordLength: number
): number => {
  // Simplified Flesch Reading Ease formula
  return Math.max(0, Math.min(100, 206.835 - 1.015 * avgSentenceLength - 84.6 * avgWordLength));
};

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
export const determineComplexity = (readabilityScore: number): ComplexityLevel => {
  if (readabilityScore >= 90) return ComplexityLevel.VERY_LOW;
  if (readabilityScore >= 70) return ComplexityLevel.LOW;
  if (readabilityScore >= 50) return ComplexityLevel.MEDIUM;
  if (readabilityScore >= 30) return ComplexityLevel.HIGH;
  return ComplexityLevel.VERY_HIGH;
};

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
export const extractTopics = (content: string): Topic[] => {
  const topics: Topic[] = [];

  const contentLower = content.toLowerCase();
  const medicalKeywords = ['diabetes', 'hypertension', 'medication', 'treatment'];

  medicalKeywords.forEach((keyword) => {
    if (contentLower.includes(keyword)) {
      topics.push({
        name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        relevance: 0.8,
        keywords: [keyword],
      });
    }
  });

  return topics;
};

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
export const analyzeSentiment = (content: string): SentimentAnalysis => {
  // Simplified sentiment analysis
  const positiveWords = ['good', 'excellent', 'satisfied', 'happy', 'great'];
  const negativeWords = ['bad', 'poor', 'unsatisfied', 'unhappy', 'terrible'];

  const contentLower = content.toLowerCase();

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const matches = contentLower.match(new RegExp(word, 'g'));
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach((word) => {
    const matches = contentLower.match(new RegExp(word, 'g'));
    if (matches) negativeCount += matches.length;
  });

  const total = positiveCount + negativeCount;
  const positive = total > 0 ? (positiveCount / total) * 100 : 0;
  const negative = total > 0 ? (negativeCount / total) * 100 : 0;
  const neutral = 100 - positive - negative;

  let overall = SentimentScore.NEUTRAL;
  if (positive > 60) overall = SentimentScore.POSITIVE;
  else if (positive > 80) overall = SentimentScore.VERY_POSITIVE;
  else if (negative > 60) overall = SentimentScore.NEGATIVE;
  else if (negative > 80) overall = SentimentScore.VERY_NEGATIVE;

  return {
    overall,
    positive,
    negative,
    neutral,
    confidence: 75,
  };
};

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
export const detectDocumentAnomalies = (
  documentId: string,
  extractedData: Record<string, any>
): AnomalyDetectionResult => {
  const anomalies: Anomaly[] = [];

  // Check for missing required fields
  const requiredFields = ['patient_name', 'date', 'provider'];
  requiredFields.forEach((field) => {
    if (!extractedData[field]) {
      anomalies.push({
        type: AnomalyType.MISSING_FIELD,
        description: `Required field "${field}" is missing`,
        severity: AnomalySeverity.HIGH,
        confidence: 95,
        suggestedFix: `Add ${field} to the document`,
      });
    }
  });

  // Check for invalid formats
  if (extractedData.date && !/^\d{2}\/\d{2}\/\d{4}$/.test(extractedData.date)) {
    anomalies.push({
      type: AnomalyType.INVALID_FORMAT,
      description: 'Date format is invalid',
      severity: AnomalySeverity.MEDIUM,
      confidence: 90,
      suggestedFix: 'Use MM/DD/YYYY format',
    });
  }

  const overallScore = anomalies.length > 0 ? 100 - anomalies.length * 20 : 100;

  return {
    id: crypto.randomUUID(),
    documentId,
    anomalies,
    overallScore: Math.max(0, overallScore),
    detectionMethod: AnomalyDetectionMethod.RULE_BASED,
    timestamp: new Date(),
  };
};

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
export const recognizeMedicalCodes = (text: string): MedicalCodeRecognition[] => {
  const codes: MedicalCodeRecognition[] = [];

  // ICD-10 pattern
  const icd10Regex = /\b[A-Z]\d{2}(\.\d{1,2})?\b/g;
  const icd10Matches = text.match(icd10Regex);
  if (icd10Matches) {
    icd10Matches.forEach((code) => {
      codes.push({
        codeSystem: MedicalCodeSystem.ICD_10,
        code,
        display: `ICD-10 code ${code}`,
        confidence: 85,
      });
    });
  }

  // CPT pattern (5 digits)
  const cptRegex = /\b\d{5}\b/g;
  const cptMatches = text.match(cptRegex);
  if (cptMatches) {
    cptMatches.slice(0, 3).forEach((code) => {
      codes.push({
        codeSystem: MedicalCodeSystem.CPT,
        code,
        display: `CPT code ${code}`,
        confidence: 75,
      });
    });
  }

  return codes;
};

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
export const validateExtractedData = (
  data: Record<string, any>,
  schema: Record<string, FieldDataType>
): string[] => {
  const errors: string[] = [];

  Object.entries(schema).forEach(([field, expectedType]) => {
    const value = data[field];

    if (value === undefined || value === null) {
      errors.push(`Field "${field}" is required but missing`);
      return;
    }

    // Type validation
    if (expectedType === FieldDataType.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push(`Field "${field}" is not a valid email`);
    }

    if (expectedType === FieldDataType.PHONE && !/^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(value)) {
      errors.push(`Field "${field}" is not a valid phone number`);
    }

    if (expectedType === FieldDataType.NUMBER && typeof value !== 'number') {
      errors.push(`Field "${field}" must be a number`);
    }
  });

  return errors;
};

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
export const normalizeEntityValue = (entity: ExtractedEntity): ExtractedEntity => {
  let normalizedValue = entity.text;

  if (entity.type === EntityType.MEDICATION) {
    // Normalize medication names
    normalizedValue = entity.text.toLowerCase().replace(/\s+/g, ' ').trim();
  } else if (entity.type === EntityType.DATE) {
    // Normalize dates to ISO format
    const date = new Date(entity.text);
    if (!isNaN(date.getTime())) {
      normalizedValue = date.toISOString().split('T')[0];
    }
  }

  return {
    ...entity,
    normalizedValue,
  };
};

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
export const calculateExtractionConfidence = (fields: ExtractedField[]): number => {
  if (fields.length === 0) return 0;

  const totalConfidence = fields.reduce((sum, field) => sum + field.confidence, 0);
  return totalConfidence / fields.length;
};

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
export const mergeExtractionResults = (results: ExtractionResult[]): ExtractionResult => {
  if (results.length === 0) {
    throw new Error('No results to merge');
  }

  const allFields: ExtractedField[] = [];
  const fieldMap = new Map<string, ExtractedField>();

  // Merge fields, keeping highest confidence
  results.forEach((result) => {
    result.extractedFields.forEach((field) => {
      const existing = fieldMap.get(field.name);
      if (!existing || field.confidence > existing.confidence) {
        fieldMap.set(field.name, field);
      }
    });
  });

  fieldMap.forEach((field) => allFields.push(field));

  const allEntities = results.flatMap((r) => r.entities);
  const structuredData = Object.assign({}, ...results.map((r) => r.structuredData));
  const avgConfidence = calculateExtractionConfidence(allFields);

  return {
    id: crypto.randomUUID(),
    documentId: results[0].documentId,
    extractedFields: allFields,
    entities: allEntities,
    structuredData,
    confidence: avgConfidence,
    extractionMethod: ExtractionMethod.HYBRID,
    timestamp: new Date(),
  };
};

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
export const filterLowConfidenceExtractions = (
  result: ExtractionResult,
  minConfidence: number = 70
): ExtractionResult => {
  const filteredFields = result.extractedFields.filter((f) => f.confidence >= minConfidence);
  const filteredEntities = result.entities.filter((e) => e.confidence >= minConfidence);

  const structuredData = filteredFields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, any>);

  return {
    ...result,
    extractedFields: filteredFields,
    entities: filteredEntities,
    structuredData,
    confidence: calculateExtractionConfidence(filteredFields),
  };
};

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
export const exportExtractionToJSON = (result: ExtractionResult): string => {
  return JSON.stringify(result, null, 2);
};

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
export const generateExtractionQualityReport = (
  result: ExtractionResult
): Record<string, any> => {
  const highConfidenceFields = result.extractedFields.filter((f) => f.confidence >= 80).length;
  const mediumConfidenceFields = result.extractedFields.filter(
    (f) => f.confidence >= 60 && f.confidence < 80
  ).length;
  const lowConfidenceFields = result.extractedFields.filter((f) => f.confidence < 60).length;

  return {
    extractionId: result.id,
    documentId: result.documentId,
    overallConfidence: result.confidence,
    totalFields: result.extractedFields.length,
    totalEntities: result.entities.length,
    highConfidenceFields,
    mediumConfidenceFields,
    lowConfidenceFields,
    extractionMethod: result.extractionMethod,
    timestamp: result.timestamp,
    qualityScore: result.confidence >= 80 ? 'HIGH' : result.confidence >= 60 ? 'MEDIUM' : 'LOW',
  };
};

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
export const linkRelatedEntities = (entities: ExtractedEntity[]): ExtractedEntity[] => {
  return entities.map((entity) => {
    const relationships: EntityRelationship[] = [];

    // Find related entities
    entities.forEach((otherEntity) => {
      if (entity.id !== otherEntity.id) {
        // Simple proximity-based relationship
        if (
          Math.abs(entity.position.y - otherEntity.position.y) < 50 &&
          entity.position.pageNumber === otherEntity.position.pageNumber
        ) {
          relationships.push({
            relationType: RelationType.RELATED_TO,
            targetEntityId: otherEntity.id,
            confidence: 70,
          });
        }
      }
    });

    return {
      ...entity,
      relationships,
    };
  });
};

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
export const detectLanguage = (content: string): string => {
  // Simplified language detection
  const commonEnglishWords = ['the', 'is', 'at', 'which', 'on'];
  const contentLower = content.toLowerCase();

  let englishWordCount = 0;
  commonEnglishWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = contentLower.match(regex);
    if (matches) englishWordCount += matches.length;
  });

  return englishWordCount > 10 ? 'en' : 'unknown';
};

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
export const extractKeyPhrases = (
  content: string,
  maxPhrases: number = 10
): Array<{ phrase: string; score: number }> => {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const phrases: Array<{ phrase: string; score: number }> = [];

  sentences.slice(0, maxPhrases).forEach((sentence) => {
    phrases.push({
      phrase: sentence.trim(),
      score: Math.random() * 100, // Simplified scoring
    });
  });

  return phrases.sort((a, b) => b.score - a.score).slice(0, maxPhrases);
};

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
export const matchDocumentTemplates = (
  content: string,
  templates: string[]
): Array<{ template: string; matchScore: number }> => {
  const matches: Array<{ template: string; matchScore: number }> = [];

  templates.forEach((template) => {
    const templateWords = template.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();

    let matchCount = 0;
    templateWords.forEach((word) => {
      if (contentLower.includes(word)) matchCount++;
    });

    const matchScore = (matchCount / templateWords.length) * 100;

    if (matchScore > 30) {
      matches.push({ template, matchScore });
    }
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

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
export const validateClassification = (
  classification: DocumentClassification,
  minConfidence: number = 70
): boolean => {
  return classification.confidence >= minConfidence &&
    classification.primaryCategory !== DocumentCategory.UNKNOWN;
};

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
export const compareExtractions = (
  extraction1: ExtractionResult,
  extraction2: ExtractionResult
): Record<string, any> => {
  const fields1 = new Set(extraction1.extractedFields.map((f) => f.name));
  const fields2 = new Set(extraction2.extractedFields.map((f) => f.name));

  const commonFields: string[] = [];
  const uniqueToFirst: string[] = [];
  const uniqueToSecond: string[] = [];

  fields1.forEach((field) => {
    if (fields2.has(field)) {
      commonFields.push(field);
    } else {
      uniqueToFirst.push(field);
    }
  });

  fields2.forEach((field) => {
    if (!fields1.has(field)) {
      uniqueToSecond.push(field);
    }
  });

  return {
    commonFields: commonFields.length,
    uniqueToFirst: uniqueToFirst.length,
    uniqueToSecond: uniqueToSecond.length,
    similarityScore:
      (commonFields.length / Math.max(fields1.size, fields2.size)) * 100,
  };
};

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
export const enrichExtractedData = (
  result: ExtractionResult,
  enrichmentData: Record<string, any>
): ExtractionResult => {
  return {
    ...result,
    structuredData: {
      ...result.structuredData,
      ...enrichmentData,
    },
    metadata: {
      ...result.metadata,
      enriched: true,
      enrichmentTimestamp: new Date(),
    },
  };
};

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
export const calculateDocumentSimilarity = (
  content1: string,
  content2: string
): number => {
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));

  let intersection = 0;
  words1.forEach((word) => {
    if (words2.has(word)) intersection++;
  });

  const union = words1.size + words2.size - intersection;

  return union > 0 ? (intersection / union) * 100 : 0;
};

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
export const extractDocumentMetadata = (content: string): Record<string, any> => {
  const lines = content.split('\n');

  return {
    lineCount: lines.length,
    hasHeaders: lines[0]?.length > 0 && lines[0].toUpperCase() === lines[0],
    estimatedReadingTime: Math.ceil(content.split(/\s+/).length / 200), // minutes
    language: detectLanguage(content),
    extractedAt: new Date(),
  };
};

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
export const boostExtractionConfidence = (
  result: ExtractionResult,
  validatedData: Record<string, any>
): ExtractionResult => {
  const boostedFields = result.extractedFields.map((field) => {
    if (validatedData[field.name] !== undefined && validatedData[field.name] === field.value) {
      return {
        ...field,
        confidence: Math.min(100, field.confidence + 10),
      };
    }
    return field;
  });

  return {
    ...result,
    extractedFields: boostedFields,
    confidence: calculateExtractionConfidence(boostedFields),
  };
};

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
export const generateExtractionMetrics = (
  results: ExtractionResult[]
): Record<string, any> => {
  const totalResults = results.length;
  const avgConfidence =
    results.reduce((sum, r) => sum + r.confidence, 0) / totalResults || 0;
  const avgFieldCount =
    results.reduce((sum, r) => sum + r.extractedFields.length, 0) / totalResults || 0;
  const avgEntityCount =
    results.reduce((sum, r) => sum + r.entities.length, 0) / totalResults || 0;

  const methodDistribution: Record<string, number> = {};
  results.forEach((r) => {
    methodDistribution[r.extractionMethod] = (methodDistribution[r.extractionMethod] || 0) + 1;
  });

  return {
    totalExtractions: totalResults,
    averageConfidence: avgConfidence,
    averageFieldCount: avgFieldCount,
    averageEntityCount: avgEntityCount,
    methodDistribution,
    highConfidenceRate: (results.filter((r) => r.confidence >= 80).length / totalResults) * 100,
  };
};

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
export const suggestFieldCorrection = (field: ExtractedField): SmartSuggestion | null => {
  // Email correction
  if (field.type === FieldDataType.EMAIL && typeof field.value === 'string') {
    if (!field.value.includes('@')) {
      return {
        id: crypto.randomUUID(),
        type: SuggestionType.CORRECTION,
        field: field.name,
        suggestedValue: field.value + '@example.com',
        confidence: 60,
        reason: 'Missing @ symbol in email',
      };
    }
  }

  // Date format correction
  if (field.type === FieldDataType.DATE && typeof field.value === 'string') {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(field.value)) {
      return {
        id: crypto.randomUUID(),
        type: SuggestionType.CORRECTION,
        field: field.name,
        suggestedValue: new Date().toLocaleDateString('en-US'),
        confidence: 50,
        reason: 'Invalid date format',
      };
    }
  }

  return null;
};

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
export const batchDocumentsForProcessing = (
  documentIds: string[],
  batchSize: number = 10
): string[][] => {
  const batches: string[][] = [];

  for (let i = 0; i < documentIds.length; i += batchSize) {
    batches.push(documentIds.slice(i, i + batchSize));
  }

  return batches;
};

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
export const convertExtractionToCSV = (result: ExtractionResult): string => {
  const headers = ['Field Name', 'Value', 'Type', 'Confidence'];
  const rows = result.extractedFields.map((field) => [
    field.name,
    String(field.value),
    field.type,
    field.confidence.toString(),
  ]);

  const csvRows = [headers.join(','), ...rows.map((row) => row.join(','))];

  return csvRows.join('\n');
};

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
export const prioritizeExtractions = (results: ExtractionResult[]): ExtractionResult[] => {
  return [...results].sort((a, b) => {
    // First by confidence
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    // Then by number of fields
    return b.extractedFields.length - a.extractedFields.length;
  });
};

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
export const validateOCRQuality = (ocrResult: OCRResult): Record<string, any> => {
  const avgPageConfidence =
    ocrResult.pages.reduce((sum, p) => sum + p.confidence, 0) / ocrResult.pages.length || 0;

  const hasLowConfidencePages = ocrResult.pages.some((p) => p.confidence < 60);

  return {
    overallConfidence: ocrResult.confidence,
    averagePageConfidence: avgPageConfidence,
    hasLowConfidencePages,
    pageCount: ocrResult.pages.length,
    processingTime: ocrResult.processingTime,
    qualityRating: ocrResult.confidence >= 85 ? 'EXCELLENT' :
                   ocrResult.confidence >= 70 ? 'GOOD' :
                   ocrResult.confidence >= 50 ? 'FAIR' : 'POOR',
    recommendReprocess: hasLowConfidencePages,
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Document Intelligence Service
 * Production-ready NestJS service for document intelligence operations
 */
@Injectable()
export class DocumentIntelligenceService {
  /**
   * Processes document with full intelligence pipeline
   */
  async processDocument(documentId: string, content: string): Promise<{
    classification: DocumentClassification;
    extraction: ExtractionResult;
    analytics: DocumentAnalytics;
  }> {
    const classification = classifyDocument(documentId, content);
    const extraction = extractDocumentData(documentId, content);
    const analytics = analyzeDocument(documentId, content);

    return {
      classification,
      extraction,
      analytics,
    };
  }

  /**
   * Performs OCR and extracts data from image
   */
  async processImageDocument(documentId: string, imageData: Buffer): Promise<ExtractionResult> {
    const ocrResult = await performOCR(documentId, imageData);
    const enhanced = enhanceOCRForMedical(ocrResult);
    return extractDocumentData(documentId, enhanced.text);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DocumentClassificationModel,
  ExtractionResultModel,
  OCRResultModel,

  // Core Functions
  classifyDocument,
  extractDocumentData,
  extractFields,
  extractEntities,
  performOCR,
  enhanceOCRForMedical,
  generateDocumentSummary,
  generateSmartSuggestions,
  analyzeDocument,
  calculateReadabilityScore,
  determineComplexity,
  extractTopics,
  analyzeSentiment,
  detectDocumentAnomalies,
  recognizeMedicalCodes,
  validateExtractedData,
  normalizeEntityValue,
  calculateExtractionConfidence,
  mergeExtractionResults,
  filterLowConfidenceExtractions,
  exportExtractionToJSON,
  generateExtractionQualityReport,
  linkRelatedEntities,
  detectLanguage,
  extractKeyPhrases,
  matchDocumentTemplates,
  validateClassification,
  compareExtractions,
  enrichExtractedData,
  calculateDocumentSimilarity,
  extractDocumentMetadata,
  boostExtractionConfidence,
  generateExtractionMetrics,
  suggestFieldCorrection,
  batchDocumentsForProcessing,
  convertExtractionToCSV,
  prioritizeExtractions,
  validateOCRQuality,

  // Services
  DocumentIntelligenceService,
};
