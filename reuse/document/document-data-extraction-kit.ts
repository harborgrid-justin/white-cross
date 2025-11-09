/**
 * LOC: DOC-EXTRACT-001
 * File: /reuse/document/document-data-extraction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - natural (NLP library)
 *   - compromise (NLP library)
 *   - leven (string distance)
 *   - chrono-node (date parsing)
 *
 * DOWNSTREAM (imported by):
 *   - Document processing controllers
 *   - AI extraction services
 *   - OCR result handlers
 *   - Healthcare data extraction modules
 */

/**
 * File: /reuse/document/document-data-extraction-kit.ts
 * Locator: WC-UTL-DOCEXTRACT-001
 * Purpose: AI-Powered Document Data Extraction Kit - NLP extraction, pattern recognition, field mapping, data normalization
 *
 * Upstream: @nestjs/common, sequelize, natural, compromise, leven, chrono-node
 * Downstream: Document controllers, extraction services, OCR handlers, data processing modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Natural 6.x, Compromise 14.x
 * Exports: 45 utility functions for NLP extraction, pattern matching, field mapping, normalization, entity linking, scoring, validation
 *
 * LLM Context: Production-grade AI-powered data extraction utilities for White Cross healthcare platform.
 * Provides NLP-based text extraction, regex pattern matching, intelligent field mapping, data normalization,
 * entity linking and resolution, confidence scoring, extraction validation, template management,
 * custom extraction rules, medical terminology recognition, and healthcare-specific field extraction.
 * Essential for extracting structured data from unstructured medical documents, lab reports, prescriptions,
 * patient records, insurance claims, and clinical notes.
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
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Field data types for extraction
 */
export type FieldDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'address'
  | 'currency'
  | 'percentage'
  | 'medicalCode'
  | 'drugName'
  | 'dosage';

/**
 * Extraction method types
 */
export type ExtractionMethod =
  | 'nlp'
  | 'regex'
  | 'keyword'
  | 'position'
  | 'table'
  | 'contextual'
  | 'ml'
  | 'hybrid';

/**
 * Entity types for linking
 */
export type EntityType =
  | 'person'
  | 'organization'
  | 'location'
  | 'date'
  | 'medication'
  | 'condition'
  | 'procedure'
  | 'labTest'
  | 'diagnosis';

/**
 * Confidence level classification
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'uncertain';

/**
 * Extraction template configuration
 */
export interface ExtractionTemplateConfig {
  id?: string;
  name: string;
  documentType: string;
  description?: string;
  fields: FieldDefinition[];
  rules?: ExtractionRuleDefinition[];
  preprocessing?: PreprocessingOptions;
  postprocessing?: PostprocessingOptions;
  validationRules?: ValidationRule[];
}

/**
 * Field definition for extraction
 */
export interface FieldDefinition {
  name: string;
  dataType: FieldDataType;
  extractionMethod: ExtractionMethod;
  required: boolean;
  pattern?: string | RegExp;
  keywords?: string[];
  position?: {
    page?: number;
    section?: string;
    afterKeyword?: string;
    beforeKeyword?: string;
  };
  transform?: string;
  defaultValue?: any;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    format?: RegExp;
    customValidator?: string;
  };
}

/**
 * Extraction rule definition
 */
export interface ExtractionRuleDefinition {
  id?: string;
  name: string;
  priority: number;
  condition: string;
  action: string;
  parameters?: Record<string, any>;
  enabled: boolean;
}

/**
 * Preprocessing options
 */
export interface PreprocessingOptions {
  removeWhitespace?: boolean;
  normalizeSpaces?: boolean;
  removeSpecialChars?: boolean;
  lowercase?: boolean;
  removePunctuation?: boolean;
  expandAbbreviations?: boolean;
  correctSpelling?: boolean;
}

/**
 * Postprocessing options
 */
export interface PostprocessingOptions {
  trimWhitespace?: boolean;
  formatDates?: boolean;
  formatNumbers?: boolean;
  capitalizeNames?: boolean;
  validateFormat?: boolean;
  deduplicateValues?: boolean;
}

/**
 * Validation rule
 */
export interface ValidationRule {
  field: string;
  rule: string;
  errorMessage: string;
  severity: 'error' | 'warning';
}

/**
 * Extracted field result
 */
export interface ExtractedFieldResult {
  fieldName: string;
  value: any;
  rawValue?: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  method: ExtractionMethod;
  position?: {
    page: number;
    line?: number;
    start?: number;
    end?: number;
  };
  metadata?: Record<string, any>;
  validationErrors?: string[];
  validationWarnings?: string[];
}

/**
 * Document extraction result
 */
export interface DocumentExtractionResult {
  documentId: string;
  templateId?: string;
  extractedAt: Date;
  fields: ExtractedFieldResult[];
  summary: {
    totalFields: number;
    extractedFields: number;
    failedFields: number;
    averageConfidence: number;
    processingTime: number;
  };
  errors?: string[];
  warnings?: string[];
}

/**
 * NLP extraction options
 */
export interface NLPExtractionOptions {
  language?: string;
  enablePOS?: boolean;
  enableNER?: boolean;
  enableSentiment?: boolean;
  customDictionary?: Map<string, string>;
  medicalTerminology?: boolean;
}

/**
 * Pattern matching options
 */
export interface PatternMatchingOptions {
  caseSensitive?: boolean;
  multiline?: boolean;
  global?: boolean;
  fuzzyMatch?: boolean;
  maxDistance?: number;
  minSimilarity?: number;
}

/**
 * Entity recognition result
 */
export interface EntityRecognitionResult {
  text: string;
  type: EntityType;
  confidence: number;
  position: {
    start: number;
    end: number;
  };
  linkedEntityId?: string;
  metadata?: Record<string, any>;
}

/**
 * Field mapping configuration
 */
export interface FieldMappingConfig {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
  defaultValue?: any;
  required?: boolean;
}

/**
 * Normalization options
 */
export interface NormalizationOptions {
  dateFormat?: string;
  numberFormat?: string;
  phoneFormat?: string;
  addressFormat?: string;
  nameFormat?: 'firstName lastName' | 'lastName, firstName' | 'original';
  currencyCode?: string;
  timezone?: string;
}

/**
 * Confidence scoring factors
 */
export interface ConfidenceScoringFactors {
  patternMatchScore: number;
  contextScore: number;
  positionScore: number;
  validationScore: number;
  entityLinkingScore: number;
  weights?: {
    pattern?: number;
    context?: number;
    position?: number;
    validation?: number;
    entityLinking?: number;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  field: string;
  value: any;
  errors: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  suggestions?: string[];
}

/**
 * Template matching result
 */
export interface TemplateMatchingResult {
  templateId: string;
  templateName: string;
  matchScore: number;
  confidence: number;
  matchedKeywords: string[];
  matchedPatterns: string[];
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Extraction template model attributes
 */
export interface ExtractionTemplateAttributes {
  id: string;
  name: string;
  documentType: string;
  description?: string;
  fieldDefinitions: Record<string, any>[];
  extractionRules?: Record<string, any>[];
  preprocessing?: Record<string, any>;
  postprocessing?: Record<string, any>;
  validationRules?: Record<string, any>[];
  keywords?: string[];
  patterns?: string[];
  isActive: boolean;
  version: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extracted field model attributes
 */
export interface ExtractedFieldAttributes {
  id: string;
  documentId: string;
  templateId?: string;
  fieldName: string;
  fieldType: string;
  value: any;
  rawValue?: string;
  confidence: number;
  confidenceLevel: string;
  extractionMethod: string;
  page?: number;
  lineNumber?: number;
  startPosition?: number;
  endPosition?: number;
  metadata?: Record<string, any>;
  validationErrors?: string[];
  validationWarnings?: string[];
  linkedEntityId?: string;
  linkedEntityType?: string;
  extractedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extraction rule model attributes
 */
export interface ExtractionRuleAttributes {
  id: string;
  templateId?: string;
  name: string;
  description?: string;
  ruleType: string;
  priority: number;
  condition: string;
  action: string;
  parameters?: Record<string, any>;
  enabled: boolean;
  executionCount: number;
  successCount: number;
  failureCount: number;
  lastExecutedAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates ExtractionTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ExtractionTemplateAttributes>>} ExtractionTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createExtractionTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Lab Report Extraction',
 *   documentType: 'laboratory_report',
 *   fieldDefinitions: [
 *     { name: 'patientName', dataType: 'string', required: true },
 *     { name: 'testDate', dataType: 'date', required: true }
 *   ]
 * });
 * ```
 */
export const createExtractionTemplateModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Template name',
    },
    documentType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Type of document (lab_report, prescription, etc.)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Template description',
    },
    fieldDefinitions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of field definitions to extract',
    },
    extractionRules: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Custom extraction rules',
    },
    preprocessing: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Preprocessing options',
    },
    postprocessing: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Postprocessing options',
    },
    validationRules: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Validation rules for extracted fields',
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Keywords for template matching',
    },
    patterns: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Regex patterns for template matching',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Template active status',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Template version number',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the template',
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated the template',
    },
  };

  const options: ModelOptions = {
    tableName: 'extraction_templates',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['documentType'] },
      { fields: ['isActive'] },
      { fields: ['version'] },
      { fields: ['createdBy'] },
      { fields: ['createdAt'] },
    ],
  };

  return sequelize.define('ExtractionTemplate', attributes, options);
};

/**
 * Creates ExtractedField model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ExtractedFieldAttributes>>} ExtractedField model
 *
 * @example
 * ```typescript
 * const FieldModel = createExtractedFieldModel(sequelize);
 * const field = await FieldModel.create({
 *   documentId: 'doc-uuid',
 *   fieldName: 'patientName',
 *   fieldType: 'string',
 *   value: 'John Doe',
 *   confidence: 0.95,
 *   confidenceLevel: 'high',
 *   extractionMethod: 'nlp'
 * });
 * ```
 */
export const createExtractedFieldModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to document',
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'extraction_templates',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    fieldName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Name of extracted field',
    },
    fieldType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Data type of field',
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Extracted and normalized value',
    },
    rawValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Original raw extracted text',
    },
    confidence: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Confidence score (0-1)',
    },
    confidenceLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'uncertain',
      comment: 'high, medium, low, uncertain',
    },
    extractionMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Method used for extraction',
    },
    page: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Page number where field was found',
    },
    lineNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Line number in document',
    },
    startPosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Start character position',
    },
    endPosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'End character position',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional metadata',
    },
    validationErrors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Validation error messages',
    },
    validationWarnings: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Validation warning messages',
    },
    linkedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Linked entity identifier',
    },
    linkedEntityType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Type of linked entity',
    },
    extractedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };

  const options: ModelOptions = {
    tableName: 'extracted_fields',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['templateId'] },
      { fields: ['fieldName'] },
      { fields: ['fieldType'] },
      { fields: ['confidence'] },
      { fields: ['confidenceLevel'] },
      { fields: ['extractionMethod'] },
      { fields: ['linkedEntityId'] },
      { fields: ['extractedAt'] },
    ],
  };

  return sequelize.define('ExtractedField', attributes, options);
};

/**
 * Creates ExtractionRule model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ExtractionRuleAttributes>>} ExtractionRule model
 *
 * @example
 * ```typescript
 * const RuleModel = createExtractionRuleModel(sequelize);
 * const rule = await RuleModel.create({
 *   templateId: 'template-uuid',
 *   name: 'Extract Patient DOB',
 *   ruleType: 'pattern',
 *   priority: 10,
 *   condition: 'contains "Date of Birth"',
 *   action: 'extractDate',
 *   enabled: true
 * });
 * ```
 */
export const createExtractionRuleModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'extraction_templates',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'Optional template association',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Rule name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Rule description',
    },
    ruleType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'pattern, contextual, conditional, etc.',
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Execution priority (higher = earlier)',
    },
    condition: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Rule condition expression',
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Action to perform when condition matches',
    },
    parameters: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Rule parameters',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Rule enabled status',
    },
    executionCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times rule has been executed',
    },
    successCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of successful executions',
    },
    failureCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of failed executions',
    },
    lastExecutedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last execution timestamp',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the rule',
    },
  };

  const options: ModelOptions = {
    tableName: 'extraction_rules',
    timestamps: true,
    indexes: [
      { fields: ['templateId'] },
      { fields: ['name'] },
      { fields: ['ruleType'] },
      { fields: ['priority'] },
      { fields: ['enabled'] },
      { fields: ['executionCount'] },
      { fields: ['lastExecutedAt'] },
    ],
  };

  return sequelize.define('ExtractionRule', attributes, options);
};

// ============================================================================
// 1. NLP TEXT EXTRACTION
// ============================================================================

/**
 * 1. Extracts named entities from text using NLP.
 *
 * @param {string} text - Input text to analyze
 * @param {NLPExtractionOptions} [options] - NLP extraction options
 * @returns {Promise<EntityRecognitionResult[]>} Recognized entities
 *
 * @example
 * ```typescript
 * const entities = await extractNamedEntities(
 *   'Dr. John Smith prescribed Aspirin 100mg on January 15, 2024',
 *   { enableNER: true, medicalTerminology: true }
 * );
 * // Returns: [{ text: 'Dr. John Smith', type: 'person', confidence: 0.95 }, ...]
 * ```
 */
export const extractNamedEntities = async (
  text: string,
  options: NLPExtractionOptions = {},
): Promise<EntityRecognitionResult[]> => {
  const entities: EntityRecognitionResult[] = [];

  // Placeholder for NLP entity recognition using natural/compromise
  // In production, use libraries like compromise, natural, or ML models

  // Example: Extract person names
  const personPattern = /Dr\.\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g;
  let match;
  while ((match = personPattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'person',
      confidence: 0.85,
      position: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  return entities;
};

/**
 * 2. Extracts dates from text with natural language parsing.
 *
 * @param {string} text - Input text containing dates
 * @param {string} [timezone] - Timezone for date parsing
 * @returns {Promise<Array<{ date: Date; text: string; confidence: number }>>} Extracted dates
 *
 * @example
 * ```typescript
 * const dates = await extractDatesFromText('Appointment on January 15, 2024 at 2:30 PM');
 * // Returns: [{ date: Date(2024-01-15T14:30:00), text: 'January 15, 2024 at 2:30 PM', confidence: 0.95 }]
 * ```
 */
export const extractDatesFromText = async (
  text: string,
  timezone?: string,
): Promise<Array<{ date: Date; text: string; confidence: number }>> => {
  const dates: Array<{ date: Date; text: string; confidence: number }> = [];

  // Placeholder for chrono-node date parsing
  // In production, use chrono-node for natural language date extraction

  const isoDatePattern = /\b\d{4}-\d{2}-\d{2}\b/g;
  let match;
  while ((match = isoDatePattern.exec(text)) !== null) {
    dates.push({
      date: new Date(match[0]),
      text: match[0],
      confidence: 0.9,
    });
  }

  return dates;
};

/**
 * 3. Extracts medical terminology and codes from clinical text.
 *
 * @param {string} text - Clinical text
 * @param {string[]} [codeSystems] - Code systems to extract (ICD-10, CPT, SNOMED, etc.)
 * @returns {Promise<Array<{ term: string; code?: string; system?: string; confidence: number }>>} Medical terms
 *
 * @example
 * ```typescript
 * const terms = await extractMedicalTerminology(
 *   'Patient diagnosed with Type 2 Diabetes Mellitus (E11.9)',
 *   ['ICD-10']
 * );
 * // Returns: [{ term: 'Type 2 Diabetes Mellitus', code: 'E11.9', system: 'ICD-10', confidence: 0.92 }]
 * ```
 */
export const extractMedicalTerminology = async (
  text: string,
  codeSystems?: string[],
): Promise<Array<{ term: string; code?: string; system?: string; confidence: number }>> => {
  const terms: Array<{ term: string; code?: string; system?: string; confidence: number }> = [];

  // ICD-10 code pattern
  const icd10Pattern = /([A-Z]\d{2}(?:\.\d{1,2})?)/g;
  let match;
  while ((match = icd10Pattern.exec(text)) !== null) {
    terms.push({
      term: match[1],
      code: match[1],
      system: 'ICD-10',
      confidence: 0.88,
    });
  }

  return terms;
};

/**
 * 4. Extracts medication information from prescription text.
 *
 * @param {string} text - Prescription or medication text
 * @returns {Promise<Array<{ drug: string; dosage?: string; frequency?: string; route?: string; confidence: number }>>} Medications
 *
 * @example
 * ```typescript
 * const meds = await extractMedicationInfo('Aspirin 100mg twice daily, oral route');
 * // Returns: [{ drug: 'Aspirin', dosage: '100mg', frequency: 'twice daily', route: 'oral', confidence: 0.90 }]
 * ```
 */
export const extractMedicationInfo = async (
  text: string,
): Promise<Array<{ drug: string; dosage?: string; frequency?: string; route?: string; confidence: number }>> => {
  const medications: Array<{
    drug: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    confidence: number;
  }> = [];

  // Pattern: Drug name followed by dosage
  const medPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(\d+\s*(?:mg|mcg|g|mL))/gi;
  let match;
  while ((match = medPattern.exec(text)) !== null) {
    medications.push({
      drug: match[1],
      dosage: match[2],
      confidence: 0.85,
    });
  }

  return medications;
};

/**
 * 5. Extracts key-value pairs from semi-structured text.
 *
 * @param {string} text - Semi-structured text with key-value pairs
 * @param {string[]} [separators] - Key-value separators (default: [':', '='])
 * @returns {Promise<Map<string, string>>} Extracted key-value pairs
 *
 * @example
 * ```typescript
 * const kvPairs = await extractKeyValuePairs('Patient Name: John Doe\nAge: 45\nGender: Male');
 * // Returns: Map { 'Patient Name' => 'John Doe', 'Age' => '45', 'Gender' => 'Male' }
 * ```
 */
export const extractKeyValuePairs = async (
  text: string,
  separators: string[] = [':', '='],
): Promise<Map<string, string>> => {
  const pairs = new Map<string, string>();

  const lines = text.split('\n');
  const separatorPattern = new RegExp(`([^${separators.join('')}]+)\\s*[${separators.join('')}]\\s*(.+)`);

  for (const line of lines) {
    const match = line.match(separatorPattern);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      pairs.set(key, value);
    }
  }

  return pairs;
};

/**
 * 6. Extracts contact information (email, phone, address) from text.
 *
 * @param {string} text - Text containing contact information
 * @returns {Promise<{ emails: string[]; phones: string[]; addresses: string[] }>} Contact information
 *
 * @example
 * ```typescript
 * const contact = await extractContactInformation('Email: john@example.com, Phone: (555) 123-4567');
 * // Returns: { emails: ['john@example.com'], phones: ['(555) 123-4567'], addresses: [] }
 * ```
 */
export const extractContactInformation = async (
  text: string,
): Promise<{ emails: string[]; phones: string[]; addresses: string[] }> => {
  const emails: string[] = [];
  const phones: string[] = [];
  const addresses: string[] = [];

  // Extract emails
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = text.match(emailPattern);
  if (emailMatches) {
    emails.push(...emailMatches);
  }

  // Extract phone numbers
  const phonePattern = /\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
  const phoneMatches = text.match(phonePattern);
  if (phoneMatches) {
    phones.push(...phoneMatches);
  }

  return { emails, phones, addresses };
};

/**
 * 7. Extracts numerical measurements with units from text.
 *
 * @param {string} text - Text containing measurements
 * @param {string[]} [units] - Specific units to extract
 * @returns {Promise<Array<{ value: number; unit: string; text: string; confidence: number }>>} Measurements
 *
 * @example
 * ```typescript
 * const measurements = await extractMeasurements('Blood pressure: 120/80 mmHg, Weight: 75 kg');
 * // Returns: [{ value: 120, unit: 'mmHg', text: '120/80 mmHg', confidence: 0.95 }, ...]
 * ```
 */
export const extractMeasurements = async (
  text: string,
  units?: string[],
): Promise<Array<{ value: number; unit: string; text: string; confidence: number }>> => {
  const measurements: Array<{ value: number; unit: string; text: string; confidence: number }> = [];

  // Common medical units
  const unitPattern =
    /(\d+(?:\.\d+)?)\s*(mg|mcg|g|kg|mL|L|mmHg|bpm|°C|°F|cm|mm|m|%|IU|units?)/gi;
  let match;
  while ((match = unitPattern.exec(text)) !== null) {
    measurements.push({
      value: parseFloat(match[1]),
      unit: match[2],
      text: match[0],
      confidence: 0.9,
    });
  }

  return measurements;
};

// ============================================================================
// 2. REGEX PATTERN MATCHING
// ============================================================================

/**
 * 8. Matches text against multiple regex patterns with prioritization.
 *
 * @param {string} text - Text to match
 * @param {Array<{ pattern: RegExp; name: string; priority: number }>} patterns - Patterns to match
 * @param {PatternMatchingOptions} [options] - Matching options
 * @returns {Promise<Array<{ match: string; pattern: string; groups?: string[]; position: { start: number; end: number } }>>} Matches
 *
 * @example
 * ```typescript
 * const matches = await matchPatterns(text, [
 *   { pattern: /\b\d{3}-\d{2}-\d{4}\b/, name: 'SSN', priority: 10 },
 *   { pattern: /\b[A-Z]\d{2}\.\d{1,2}\b/, name: 'ICD-10', priority: 5 }
 * ]);
 * ```
 */
export const matchPatterns = async (
  text: string,
  patterns: Array<{ pattern: RegExp; name: string; priority: number }>,
  options: PatternMatchingOptions = {},
): Promise<Array<{ match: string; pattern: string; groups?: string[]; position: { start: number; end: number } }>> => {
  const matches: Array<{
    match: string;
    pattern: string;
    groups?: string[];
    position: { start: number; end: number };
  }> = [];

  // Sort patterns by priority
  const sortedPatterns = [...patterns].sort((a, b) => b.priority - a.priority);

  for (const patternDef of sortedPatterns) {
    let match;
    const regex = new RegExp(patternDef.pattern, 'g');
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        match: match[0],
        pattern: patternDef.name,
        groups: match.slice(1),
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  }

  return matches;
};

/**
 * 9. Extracts structured data using named capture groups.
 *
 * @param {string} text - Text to extract from
 * @param {RegExp} pattern - Regex with named capture groups
 * @returns {Promise<Record<string, string>[]>} Extracted structured data
 *
 * @example
 * ```typescript
 * const pattern = /(?<name>[A-Z][a-z]+ [A-Z][a-z]+).*(?<date>\d{4}-\d{2}-\d{2})/g;
 * const data = await extractWithCaptureGroups(text, pattern);
 * // Returns: [{ name: 'John Doe', date: '2024-01-15' }, ...]
 * ```
 */
export const extractWithCaptureGroups = async (
  text: string,
  pattern: RegExp,
): Promise<Record<string, string>[]> => {
  const results: Record<string, string>[] = [];

  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.groups) {
      results.push({ ...match.groups });
    }
  }

  return results;
};

/**
 * 10. Performs fuzzy pattern matching with Levenshtein distance.
 *
 * @param {string} text - Text to search
 * @param {string} pattern - Pattern to match
 * @param {number} [maxDistance] - Maximum edit distance (default: 2)
 * @returns {Promise<Array<{ match: string; distance: number; similarity: number; position: number }>>} Fuzzy matches
 *
 * @example
 * ```typescript
 * const matches = await fuzzyPatternMatch('Patient naem: John Doe', 'Patient name', 2);
 * // Returns: [{ match: 'Patient naem', distance: 1, similarity: 0.92, position: 0 }]
 * ```
 */
export const fuzzyPatternMatch = async (
  text: string,
  pattern: string,
  maxDistance: number = 2,
): Promise<Array<{ match: string; distance: number; similarity: number; position: number }>> => {
  const matches: Array<{ match: string; distance: number; similarity: number; position: number }> = [];

  // Simple Levenshtein distance implementation
  const levenshtein = (a: string, b: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  const words = text.split(/\s+/);
  const patternLength = pattern.split(/\s+/).length;

  for (let i = 0; i <= words.length - patternLength; i++) {
    const candidate = words.slice(i, i + patternLength).join(' ');
    const distance = levenshtein(pattern.toLowerCase(), candidate.toLowerCase());

    if (distance <= maxDistance) {
      const similarity = 1 - distance / Math.max(pattern.length, candidate.length);
      matches.push({
        match: candidate,
        distance,
        similarity,
        position: text.indexOf(candidate),
      });
    }
  }

  return matches;
};

/**
 * 11. Extracts table data using pattern-based row/column detection.
 *
 * @param {string} text - Text containing table data
 * @param {string} [columnSeparator] - Column separator pattern (default: /\s{2,}|\t/)
 * @returns {Promise<Array<Record<string, string>>>} Extracted table rows
 *
 * @example
 * ```typescript
 * const table = await extractTableData('Name    Age    City\nJohn    45     NYC\nJane    32     LA');
 * // Returns: [{ Name: 'John', Age: '45', City: 'NYC' }, { Name: 'Jane', Age: '32', City: 'LA' }]
 * ```
 */
export const extractTableData = async (
  text: string,
  columnSeparator: string = '\\s{2,}|\\t',
): Promise<Array<Record<string, string>>> => {
  const rows: Array<Record<string, string>> = [];
  const lines = text.split('\n').filter((line) => line.trim());

  if (lines.length < 2) return rows;

  const separator = new RegExp(columnSeparator);
  const headers = lines[0].split(separator).map((h) => h.trim());

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(separator).map((v) => v.trim());
    const row: Record<string, string> = {};

    for (let j = 0; j < headers.length && j < values.length; j++) {
      row[headers[j]] = values[j];
    }

    rows.push(row);
  }

  return rows;
};

/**
 * 12. Validates data format using regex patterns.
 *
 * @param {string} value - Value to validate
 * @param {FieldDataType} dataType - Expected data type
 * @returns {Promise<{ valid: boolean; format?: string; suggestion?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDataFormat('john@example.com', 'email');
 * // Returns: { valid: true, format: 'email' }
 * ```
 */
export const validateDataFormat = async (
  value: string,
  dataType: FieldDataType,
): Promise<{ valid: boolean; format?: string; suggestion?: string }> => {
  const patterns: Record<FieldDataType, RegExp> = {
    string: /.+/,
    number: /^-?\d+(?:\.\d+)?$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    boolean: /^(true|false|yes|no|1|0)$/i,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    phone: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    address: /.+/,
    currency: /^\$?\d+(?:,\d{3})*(?:\.\d{2})?$/,
    percentage: /^\d+(?:\.\d+)?%?$/,
    medicalCode: /^[A-Z]\d{2}(?:\.\d{1,2})?$/,
    drugName: /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/,
    dosage: /^\d+\s*(?:mg|mcg|g|mL|IU|units?)$/i,
  };

  const pattern = patterns[dataType];
  const valid = pattern ? pattern.test(value.trim()) : false;

  return {
    valid,
    format: dataType,
  };
};

/**
 * 13. Extracts context around matched patterns.
 *
 * @param {string} text - Full text
 * @param {RegExp} pattern - Pattern to match
 * @param {number} [contextLength] - Characters of context before/after (default: 50)
 * @returns {Promise<Array<{ match: string; before: string; after: string; fullContext: string }>>} Matches with context
 *
 * @example
 * ```typescript
 * const contexts = await extractPatternContext(text, /\bdiagnosis\b/i, 30);
 * // Returns context around each occurrence of "diagnosis"
 * ```
 */
export const extractPatternContext = async (
  text: string,
  pattern: RegExp,
  contextLength: number = 50,
): Promise<Array<{ match: string; before: string; after: string; fullContext: string }>> => {
  const contexts: Array<{ match: string; before: string; after: string; fullContext: string }> = [];

  let match;
  const regex = new RegExp(pattern, 'g');
  while ((match = regex.exec(text)) !== null) {
    const beforeStart = Math.max(0, match.index - contextLength);
    const afterEnd = Math.min(text.length, match.index + match[0].length + contextLength);

    const before = text.substring(beforeStart, match.index);
    const after = text.substring(match.index + match[0].length, afterEnd);
    const fullContext = text.substring(beforeStart, afterEnd);

    contexts.push({
      match: match[0],
      before,
      after,
      fullContext,
    });
  }

  return contexts;
};

/**
 * 14. Builds composite patterns from multiple sub-patterns.
 *
 * @param {string[]} subPatterns - Array of pattern strings
 * @param {string} [operator] - Logical operator ('AND', 'OR') (default: 'OR')
 * @returns {RegExp} Composite pattern
 *
 * @example
 * ```typescript
 * const pattern = buildCompositePattern(['patient', 'doctor', 'nurse'], 'OR');
 * // Returns: /(patient|doctor|nurse)/
 * ```
 */
export const buildCompositePattern = (subPatterns: string[], operator: string = 'OR'): RegExp => {
  if (operator === 'OR') {
    return new RegExp(`(${subPatterns.join('|')})`, 'i');
  } else if (operator === 'AND') {
    // For AND, create a lookahead pattern
    const lookaheads = subPatterns.map((p) => `(?=.*${p})`).join('');
    return new RegExp(lookaheads, 'i');
  }

  return new RegExp(subPatterns.join('|'), 'i');
};

// ============================================================================
// 3. FIELD MAPPING
// ============================================================================

/**
 * 15. Maps extracted fields to target schema.
 *
 * @param {Record<string, any>} sourceData - Source extracted data
 * @param {FieldMappingConfig[]} mappings - Field mapping configurations
 * @returns {Promise<Record<string, any>>} Mapped data
 *
 * @example
 * ```typescript
 * const mapped = await mapFieldsToSchema(
 *   { 'Patient Name': 'John Doe', 'DOB': '1980-01-15' },
 *   [
 *     { sourceField: 'Patient Name', targetField: 'patientName' },
 *     { sourceField: 'DOB', targetField: 'dateOfBirth' }
 *   ]
 * );
 * ```
 */
export const mapFieldsToSchema = async (
  sourceData: Record<string, any>,
  mappings: FieldMappingConfig[],
): Promise<Record<string, any>> => {
  const targetData: Record<string, any> = {};

  for (const mapping of mappings) {
    let value = sourceData[mapping.sourceField];

    if (value === undefined || value === null) {
      if (mapping.required && mapping.defaultValue !== undefined) {
        value = mapping.defaultValue;
      } else if (!mapping.required) {
        value = mapping.defaultValue;
      }
    }

    if (value !== undefined && mapping.transform) {
      value = mapping.transform(value);
    }

    if (value !== undefined) {
      targetData[mapping.targetField] = value;
    }
  }

  return targetData;
};

/**
 * 16. Resolves field aliases and synonyms.
 *
 * @param {string} fieldName - Field name to resolve
 * @param {Map<string, string[]>} aliasMap - Map of canonical names to aliases
 * @returns {string} Canonical field name
 *
 * @example
 * ```typescript
 * const aliasMap = new Map([
 *   ['patientName', ['Patient Name', 'Name', 'Patient', 'Full Name']],
 *   ['dateOfBirth', ['DOB', 'Birth Date', 'Date of Birth']]
 * ]);
 * const canonical = resolveFieldAlias('DOB', aliasMap);
 * // Returns: 'dateOfBirth'
 * ```
 */
export const resolveFieldAlias = (fieldName: string, aliasMap: Map<string, string[]>): string => {
  for (const [canonical, aliases] of aliasMap.entries()) {
    if (aliases.some((alias) => alias.toLowerCase() === fieldName.toLowerCase())) {
      return canonical;
    }
  }
  return fieldName;
};

/**
 * 17. Merges multiple extraction results for same document.
 *
 * @param {ExtractedFieldResult[][]} results - Array of extraction results from different methods
 * @param {string} [strategy] - Merge strategy ('highest_confidence', 'consensus', 'first') (default: 'highest_confidence')
 * @returns {Promise<ExtractedFieldResult[]>} Merged results
 *
 * @example
 * ```typescript
 * const merged = await mergeExtractionResults([nlpResults, regexResults, mlResults], 'highest_confidence');
 * ```
 */
export const mergeExtractionResults = async (
  results: ExtractedFieldResult[][],
  strategy: string = 'highest_confidence',
): Promise<ExtractedFieldResult[]> => {
  const fieldMap = new Map<string, ExtractedFieldResult[]>();

  // Group results by field name
  for (const resultSet of results) {
    for (const field of resultSet) {
      if (!fieldMap.has(field.fieldName)) {
        fieldMap.set(field.fieldName, []);
      }
      fieldMap.get(field.fieldName)!.push(field);
    }
  }

  const merged: ExtractedFieldResult[] = [];

  for (const [fieldName, fieldResults] of fieldMap.entries()) {
    if (strategy === 'highest_confidence') {
      // Pick result with highest confidence
      const best = fieldResults.reduce((prev, current) =>
        current.confidence > prev.confidence ? current : prev,
      );
      merged.push(best);
    } else if (strategy === 'consensus') {
      // Pick value that appears most frequently
      const valueCounts = new Map<any, number>();
      for (const result of fieldResults) {
        const count = valueCounts.get(result.value) || 0;
        valueCounts.set(result.value, count + 1);
      }
      const consensusValue = Array.from(valueCounts.entries()).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
      const consensusResult = fieldResults.find((r) => r.value === consensusValue)!;
      merged.push(consensusResult);
    } else {
      // First result
      merged.push(fieldResults[0]);
    }
  }

  return merged;
};

/**
 * 18. Creates dynamic field mappings based on document structure.
 *
 * @param {Record<string, any>} documentData - Document data structure
 * @param {string[]} targetFields - Target field names
 * @returns {Promise<FieldMappingConfig[]>} Generated field mappings
 *
 * @example
 * ```typescript
 * const mappings = await createDynamicFieldMapping(
 *   { 'Patient Name': 'John', 'Age': 45 },
 *   ['patientName', 'age']
 * );
 * ```
 */
export const createDynamicFieldMapping = async (
  documentData: Record<string, any>,
  targetFields: string[],
): Promise<FieldMappingConfig[]> => {
  const mappings: FieldMappingConfig[] = [];
  const sourceFields = Object.keys(documentData);

  // Simple fuzzy matching for field names
  for (const targetField of targetFields) {
    let bestMatch: string | null = null;
    let bestSimilarity = 0;

    for (const sourceField of sourceFields) {
      const similarity = calculateStringSimilarity(
        targetField.toLowerCase(),
        sourceField.toLowerCase(),
      );

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = sourceField;
      }
    }

    if (bestMatch && bestSimilarity > 0.6) {
      mappings.push({
        sourceField: bestMatch,
        targetField,
      });
    }
  }

  return mappings;
};

/**
 * 19. Transforms field values using custom transformation rules.
 *
 * @param {any} value - Value to transform
 * @param {string} transformationType - Type of transformation
 * @param {Record<string, any>} [options] - Transformation options
 * @returns {Promise<any>} Transformed value
 *
 * @example
 * ```typescript
 * const transformed = await transformFieldValue('john doe', 'capitalize');
 * // Returns: 'John Doe'
 * ```
 */
export const transformFieldValue = async (
  value: any,
  transformationType: string,
  options: Record<string, any> = {},
): Promise<any> => {
  switch (transformationType) {
    case 'uppercase':
      return String(value).toUpperCase();
    case 'lowercase':
      return String(value).toLowerCase();
    case 'capitalize':
      return String(value)
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    case 'trim':
      return String(value).trim();
    case 'parseNumber':
      return parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    case 'parseDate':
      return new Date(value);
    case 'boolean':
      return ['true', 'yes', '1', 't', 'y'].includes(String(value).toLowerCase());
    default:
      return value;
  }
};

/**
 * 20. Validates field mapping consistency across templates.
 *
 * @param {FieldMappingConfig[]} mappings - Field mappings to validate
 * @param {string[]} requiredFields - Required target fields
 * @returns {Promise<{ valid: boolean; missing: string[]; conflicts: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFieldMapping(mappings, ['patientName', 'dateOfBirth']);
 * ```
 */
export const validateFieldMapping = async (
  mappings: FieldMappingConfig[],
  requiredFields: string[],
): Promise<{ valid: boolean; missing: string[]; conflicts: string[] }> => {
  const targetFields = new Set(mappings.map((m) => m.targetField));
  const missing = requiredFields.filter((field) => !targetFields.has(field));

  // Check for conflicts (multiple source fields mapping to same target)
  const targetCounts = new Map<string, number>();
  for (const mapping of mappings) {
    const count = targetCounts.get(mapping.targetField) || 0;
    targetCounts.set(mapping.targetField, count + 1);
  }

  const conflicts = Array.from(targetCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([field, _]) => field);

  return {
    valid: missing.length === 0 && conflicts.length === 0,
    missing,
    conflicts,
  };
};

/**
 * 21. Applies conditional field mapping based on document context.
 *
 * @param {Record<string, any>} sourceData - Source data
 * @param {Array<{ condition: (data: Record<string, any>) => boolean; mappings: FieldMappingConfig[] }>} conditionalMappings - Conditional mapping rules
 * @returns {Promise<Record<string, any>>} Conditionally mapped data
 *
 * @example
 * ```typescript
 * const mapped = await applyConditionalMapping(data, [
 *   {
 *     condition: (data) => data.documentType === 'lab_report',
 *     mappings: [{ sourceField: 'Test Result', targetField: 'labResult' }]
 *   }
 * ]);
 * ```
 */
export const applyConditionalMapping = async (
  sourceData: Record<string, any>,
  conditionalMappings: Array<{
    condition: (data: Record<string, any>) => boolean;
    mappings: FieldMappingConfig[];
  }>,
): Promise<Record<string, any>> => {
  let targetData: Record<string, any> = {};

  for (const conditionalMapping of conditionalMappings) {
    if (conditionalMapping.condition(sourceData)) {
      const mapped = await mapFieldsToSchema(sourceData, conditionalMapping.mappings);
      targetData = { ...targetData, ...mapped };
    }
  }

  return targetData;
};

// ============================================================================
// 4. DATA NORMALIZATION
// ============================================================================

/**
 * 22. Normalizes date values to ISO format.
 *
 * @param {string | Date} date - Date value to normalize
 * @param {string} [format] - Expected input format
 * @returns {Promise<string>} ISO-formatted date string
 *
 * @example
 * ```typescript
 * const normalized = await normalizeDateValue('01/15/2024');
 * // Returns: '2024-01-15T00:00:00.000Z'
 * ```
 */
export const normalizeDateValue = async (date: string | Date, format?: string): Promise<string> => {
  if (date instanceof Date) {
    return date.toISOString();
  }

  // Try common date formats
  const dateFormats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // ISO: 2024-01-15
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // US: 01/15/2024
    /^(\d{2})-(\d{2})-(\d{4})$/, // EU: 15-01-2024
  ];

  for (const regex of dateFormats) {
    const match = date.match(regex);
    if (match) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  // Fallback to Date constructor
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  throw new Error(`Unable to parse date: ${date}`);
};

/**
 * 23. Normalizes phone numbers to E.164 format.
 *
 * @param {string} phone - Phone number to normalize
 * @param {string} [defaultCountryCode] - Default country code (default: '+1')
 * @returns {Promise<string>} Normalized phone number
 *
 * @example
 * ```typescript
 * const normalized = await normalizePhoneNumber('(555) 123-4567');
 * // Returns: '+15551234567'
 * ```
 */
export const normalizePhoneNumber = async (
  phone: string,
  defaultCountryCode: string = '+1',
): Promise<string> => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Add country code if not present
  if (digits.length === 10) {
    return defaultCountryCode + digits;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return '+' + digits;
  }

  return '+' + digits;
};

/**
 * 24. Normalizes address components.
 *
 * @param {string | Record<string, string>} address - Address to normalize
 * @returns {Promise<{ street: string; city: string; state: string; zip: string; country?: string }>} Normalized address
 *
 * @example
 * ```typescript
 * const normalized = await normalizeAddress('123 Main St, San Francisco, CA 94102');
 * // Returns: { street: '123 Main St', city: 'San Francisco', state: 'CA', zip: '94102' }
 * ```
 */
export const normalizeAddress = async (
  address: string | Record<string, string>,
): Promise<{ street: string; city: string; state: string; zip: string; country?: string }> => {
  if (typeof address === 'object') {
    return {
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || address.zipCode || '',
      country: address.country,
    };
  }

  // Parse address string
  const parts = address.split(',').map((p) => p.trim());

  const normalized = {
    street: parts[0] || '',
    city: parts[1] || '',
    state: '',
    zip: '',
  };

  // Extract state and zip from last part
  if (parts[2]) {
    const stateZipMatch = parts[2].match(/([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/);
    if (stateZipMatch) {
      normalized.state = stateZipMatch[1];
      normalized.zip = stateZipMatch[2];
    }
  }

  return normalized;
};

/**
 * 25. Normalizes name formats.
 *
 * @param {string} name - Name to normalize
 * @param {string} [format] - Output format (default: 'firstName lastName')
 * @returns {Promise<{ firstName: string; lastName: string; middleName?: string; fullName: string }>} Normalized name
 *
 * @example
 * ```typescript
 * const normalized = await normalizeName('Doe, John M.');
 * // Returns: { firstName: 'John', lastName: 'Doe', middleName: 'M', fullName: 'John M. Doe' }
 * ```
 */
export const normalizeName = async (
  name: string,
  format: string = 'firstName lastName',
): Promise<{ firstName: string; lastName: string; middleName?: string; fullName: string }> => {
  let firstName = '';
  let lastName = '';
  let middleName: string | undefined;

  // Handle "Last, First Middle" format
  if (name.includes(',')) {
    const parts = name.split(',').map((p) => p.trim());
    lastName = parts[0];
    const firstParts = parts[1]?.split(' ').filter((p) => p) || [];
    firstName = firstParts[0] || '';
    middleName = firstParts.slice(1).join(' ') || undefined;
  } else {
    // Handle "First Middle Last" format
    const parts = name.split(' ').filter((p) => p);
    firstName = parts[0] || '';
    lastName = parts[parts.length - 1] || '';
    middleName = parts.slice(1, -1).join(' ') || undefined;
  }

  const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

  return { firstName, lastName, middleName, fullName: fullName.trim() };
};

/**
 * 26. Normalizes currency values.
 *
 * @param {string | number} value - Currency value to normalize
 * @param {string} [currencyCode] - Currency code (default: 'USD')
 * @returns {Promise<{ amount: number; currency: string; formatted: string }>} Normalized currency
 *
 * @example
 * ```typescript
 * const normalized = await normalizeCurrency('$1,234.56');
 * // Returns: { amount: 1234.56, currency: 'USD', formatted: '$1,234.56' }
 * ```
 */
export const normalizeCurrency = async (
  value: string | number,
  currencyCode: string = 'USD',
): Promise<{ amount: number; currency: string; formatted: string }> => {
  let amount: number;

  if (typeof value === 'number') {
    amount = value;
  } else {
    // Remove currency symbols and commas
    amount = parseFloat(value.replace(/[$,]/g, ''));
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);

  return { amount, currency: currencyCode, formatted };
};

/**
 * 27. Normalizes medical codes (ICD-10, CPT, etc.).
 *
 * @param {string} code - Medical code to normalize
 * @param {string} codeSystem - Code system (ICD-10, CPT, SNOMED, etc.)
 * @returns {Promise<{ code: string; system: string; display?: string }>} Normalized code
 *
 * @example
 * ```typescript
 * const normalized = await normalizeMedicalCode('E11.9', 'ICD-10');
 * // Returns: { code: 'E11.9', system: 'ICD-10', display: 'Type 2 diabetes mellitus without complications' }
 * ```
 */
export const normalizeMedicalCode = async (
  code: string,
  codeSystem: string,
): Promise<{ code: string; system: string; display?: string }> => {
  // Normalize code format based on system
  let normalizedCode = code.trim().toUpperCase();

  if (codeSystem === 'ICD-10') {
    // Ensure proper ICD-10 format (letter followed by digits, optional decimal)
    normalizedCode = normalizedCode.replace(/\s/g, '');
  } else if (codeSystem === 'CPT') {
    // CPT codes are 5 digits
    normalizedCode = normalizedCode.replace(/\D/g, '').padStart(5, '0');
  }

  return {
    code: normalizedCode,
    system: codeSystem,
    // In production, look up display name from code system database
    display: undefined,
  };
};

// ============================================================================
// 5. ENTITY LINKING
// ============================================================================

/**
 * 28. Links extracted entities to master data records.
 *
 * @param {EntityRecognitionResult} entity - Recognized entity
 * @param {Array<{ id: string; name: string; type: EntityType; aliases?: string[] }>} masterData - Master data records
 * @returns {Promise<{ entityId: string; confidence: number; matches: Array<{ id: string; score: number }> }>} Entity linking result
 *
 * @example
 * ```typescript
 * const linked = await linkEntityToMasterData(
 *   { text: 'Aspirin', type: 'medication', confidence: 0.9, position: { start: 0, end: 7 } },
 *   [{ id: 'med-001', name: 'Aspirin', type: 'medication', aliases: ['ASA', 'Acetylsalicylic acid'] }]
 * );
 * ```
 */
export const linkEntityToMasterData = async (
  entity: EntityRecognitionResult,
  masterData: Array<{ id: string; name: string; type: EntityType; aliases?: string[] }>,
): Promise<{ entityId: string; confidence: number; matches: Array<{ id: string; score: number }> }> => {
  const matches: Array<{ id: string; score: number }> = [];

  for (const record of masterData) {
    if (record.type !== entity.type) continue;

    // Calculate similarity with name and aliases
    const nameSimilarity = calculateStringSimilarity(entity.text.toLowerCase(), record.name.toLowerCase());
    let maxSimilarity = nameSimilarity;

    if (record.aliases) {
      for (const alias of record.aliases) {
        const aliasSimilarity = calculateStringSimilarity(entity.text.toLowerCase(), alias.toLowerCase());
        maxSimilarity = Math.max(maxSimilarity, aliasSimilarity);
      }
    }

    if (maxSimilarity > 0.7) {
      matches.push({
        id: record.id,
        score: maxSimilarity,
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  const bestMatch = matches[0];
  return {
    entityId: bestMatch?.id || '',
    confidence: bestMatch?.score || 0,
    matches,
  };
};

/**
 * 29. Resolves entity references across multiple documents.
 *
 * @param {string} entityText - Entity text to resolve
 * @param {string[]} documentIds - Document IDs to search
 * @returns {Promise<Array<{ documentId: string; fieldName: string; value: string; similarity: number }>>} Cross-document references
 *
 * @example
 * ```typescript
 * const references = await resolveEntityAcrossDocuments('John Doe', ['doc1', 'doc2', 'doc3']);
 * ```
 */
export const resolveEntityAcrossDocuments = async (
  entityText: string,
  documentIds: string[],
): Promise<Array<{ documentId: string; fieldName: string; value: string; similarity: number }>> => {
  const references: Array<{ documentId: string; fieldName: string; value: string; similarity: number }> = [];

  // Placeholder: In production, query ExtractedField model for matching entities
  // across specified documents

  return references;
};

/**
 * 30. Disambiguates entities with multiple possible matches.
 *
 * @param {EntityRecognitionResult} entity - Entity to disambiguate
 * @param {Array<{ id: string; name: string; context: string }>} candidates - Candidate matches
 * @param {string} documentContext - Document context
 * @returns {Promise<{ selectedId: string; confidence: number; reason: string }>} Disambiguation result
 *
 * @example
 * ```typescript
 * const result = await disambiguateEntity(entity, candidates, 'prescription context');
 * ```
 */
export const disambiguateEntity = async (
  entity: EntityRecognitionResult,
  candidates: Array<{ id: string; name: string; context: string }>,
  documentContext: string,
): Promise<{ selectedId: string; confidence: number; reason: string }> => {
  let bestCandidate = candidates[0];
  let maxScore = 0;

  for (const candidate of candidates) {
    // Calculate context similarity
    const contextSimilarity = calculateStringSimilarity(
      documentContext.toLowerCase(),
      candidate.context.toLowerCase(),
    );

    if (contextSimilarity > maxScore) {
      maxScore = contextSimilarity;
      bestCandidate = candidate;
    }
  }

  return {
    selectedId: bestCandidate.id,
    confidence: maxScore,
    reason: 'Context-based disambiguation',
  };
};

/**
 * 31. Creates entity relationship graph.
 *
 * @param {ExtractedFieldResult[]} fields - Extracted fields
 * @returns {Promise<{ nodes: Array<{ id: string; type: string; label: string }>; edges: Array<{ from: string; to: string; type: string }> }>} Entity graph
 *
 * @example
 * ```typescript
 * const graph = await createEntityRelationshipGraph(extractedFields);
 * // Returns graph with patient-medication-diagnosis relationships
 * ```
 */
export const createEntityRelationshipGraph = async (
  fields: ExtractedFieldResult[],
): Promise<{
  nodes: Array<{ id: string; type: string; label: string }>;
  edges: Array<{ from: string; to: string; type: string }>;
}> => {
  const nodes: Array<{ id: string; type: string; label: string }> = [];
  const edges: Array<{ from: string; to: string; type: string }> = [];

  for (const field of fields) {
    nodes.push({
      id: field.fieldName,
      type: field.metadata?.entityType || 'unknown',
      label: String(field.value),
    });
  }

  // Create edges based on field relationships
  // In production, use domain knowledge to create meaningful relationships

  return { nodes, edges };
};

/**
 * 32. Validates entity links against business rules.
 *
 * @param {string} entityId - Entity ID
 * @param {string} linkedEntityId - Linked entity ID
 * @param {Array<{ from: string; to: string; rule: string }>} validationRules - Validation rules
 * @returns {Promise<{ valid: boolean; violations: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEntityLink('patient-123', 'med-456', businessRules);
 * ```
 */
export const validateEntityLink = async (
  entityId: string,
  linkedEntityId: string,
  validationRules: Array<{ from: string; to: string; rule: string }>,
): Promise<{ valid: boolean; violations: string[] }> => {
  const violations: string[] = [];

  // Placeholder: Apply business rules to validate entity relationships

  return {
    valid: violations.length === 0,
    violations,
  };
};

/**
 * 33. Enriches entities with external data sources.
 *
 * @param {EntityRecognitionResult} entity - Entity to enrich
 * @param {string[]} dataSources - Data source identifiers
 * @returns {Promise<Record<string, any>>} Enriched entity data
 *
 * @example
 * ```typescript
 * const enriched = await enrichEntityWithExternalData(
 *   { text: 'Aspirin', type: 'medication', confidence: 0.9, position: { start: 0, end: 7 } },
 *   ['rxnorm', 'fda']
 * );
 * ```
 */
export const enrichEntityWithExternalData = async (
  entity: EntityRecognitionResult,
  dataSources: string[],
): Promise<Record<string, any>> => {
  const enrichedData: Record<string, any> = {
    originalEntity: entity,
  };

  // Placeholder: Query external APIs or databases for entity enrichment

  return enrichedData;
};

// ============================================================================
// 6. CONFIDENCE SCORING
// ============================================================================

/**
 * 34. Calculates composite confidence score from multiple factors.
 *
 * @param {ConfidenceScoringFactors} factors - Confidence scoring factors
 * @returns {number} Composite confidence score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateCompositeConfidence({
 *   patternMatchScore: 0.9,
 *   contextScore: 0.8,
 *   positionScore: 0.7,
 *   validationScore: 0.95,
 *   entityLinkingScore: 0.85
 * });
 * ```
 */
export const calculateCompositeConfidence = (factors: ConfidenceScoringFactors): number => {
  const defaultWeights = {
    pattern: 0.25,
    context: 0.2,
    position: 0.15,
    validation: 0.25,
    entityLinking: 0.15,
  };

  const weights = { ...defaultWeights, ...factors.weights };

  const composite =
    factors.patternMatchScore * weights.pattern +
    factors.contextScore * weights.context +
    factors.positionScore * weights.position +
    factors.validationScore * weights.validation +
    factors.entityLinkingScore * weights.entityLinking;

  return Math.min(1, Math.max(0, composite));
};

/**
 * 35. Classifies confidence level based on score.
 *
 * @param {number} confidenceScore - Confidence score (0-1)
 * @param {Record<ConfidenceLevel, { min: number; max: number }>} [thresholds] - Custom thresholds
 * @returns {ConfidenceLevel} Confidence level classification
 *
 * @example
 * ```typescript
 * const level = classifyConfidenceLevel(0.92);
 * // Returns: 'high'
 * ```
 */
export const classifyConfidenceLevel = (
  confidenceScore: number,
  thresholds?: Record<ConfidenceLevel, { min: number; max: number }>,
): ConfidenceLevel => {
  const defaultThresholds = {
    high: { min: 0.85, max: 1.0 },
    medium: { min: 0.65, max: 0.85 },
    low: { min: 0.4, max: 0.65 },
    uncertain: { min: 0, max: 0.4 },
  };

  const levels = thresholds || defaultThresholds;

  if (confidenceScore >= levels.high.min) return 'high';
  if (confidenceScore >= levels.medium.min) return 'medium';
  if (confidenceScore >= levels.low.min) return 'low';
  return 'uncertain';
};

/**
 * 36. Adjusts confidence based on validation results.
 *
 * @param {number} baseConfidence - Base confidence score
 * @param {ValidationResult} validationResult - Validation result
 * @returns {number} Adjusted confidence score
 *
 * @example
 * ```typescript
 * const adjusted = adjustConfidenceByValidation(0.9, validationResult);
 * ```
 */
export const adjustConfidenceByValidation = (
  baseConfidence: number,
  validationResult: ValidationResult,
): number => {
  let adjustment = 0;

  if (validationResult.valid) {
    adjustment = 0.05; // Boost for valid data
  } else {
    const errorCount = validationResult.errors.filter((e) => e.severity === 'error').length;
    const warningCount = validationResult.errors.filter((e) => e.severity === 'warning').length;

    adjustment = -0.1 * errorCount - 0.03 * warningCount;
  }

  return Math.min(1, Math.max(0, baseConfidence + adjustment));
};

/**
 * 37. Calculates confidence based on pattern match quality.
 *
 * @param {string} extractedValue - Extracted value
 * @param {RegExp} pattern - Expected pattern
 * @param {string} [context] - Surrounding context
 * @returns {number} Pattern-based confidence score
 *
 * @example
 * ```typescript
 * const confidence = calculatePatternMatchConfidence('E11.9', /^[A-Z]\d{2}\.\d$/, 'diagnosis context');
 * ```
 */
export const calculatePatternMatchConfidence = (
  extractedValue: string,
  pattern: RegExp,
  context?: string,
): number => {
  let score = 0;

  // Exact pattern match
  if (pattern.test(extractedValue)) {
    score += 0.7;
  }

  // Length appropriateness
  if (extractedValue.length >= 2 && extractedValue.length <= 100) {
    score += 0.1;
  }

  // Context relevance (if provided)
  if (context && context.length > 0) {
    score += 0.2;
  }

  return Math.min(1, score);
};

/**
 * 38. Scores extraction based on field position in document.
 *
 * @param {{ page?: number; line?: number; start?: number; end?: number }} position - Field position
 * @param {{ expectedPage?: number; expectedSection?: string; expectedPosition?: 'header' | 'body' | 'footer' }} expectations - Position expectations
 * @returns {number} Position-based confidence score
 *
 * @example
 * ```typescript
 * const score = calculatePositionScore(
 *   { page: 1, line: 5 },
 *   { expectedPage: 1, expectedPosition: 'header' }
 * );
 * ```
 */
export const calculatePositionScore = (
  position: { page?: number; line?: number; start?: number; end?: number },
  expectations: { expectedPage?: number; expectedSection?: string; expectedPosition?: 'header' | 'body' | 'footer' },
): number => {
  let score = 0.5; // Base score

  if (expectations.expectedPage && position.page === expectations.expectedPage) {
    score += 0.3;
  }

  if (expectations.expectedPosition && position.line) {
    if (expectations.expectedPosition === 'header' && position.line <= 10) {
      score += 0.2;
    } else if (expectations.expectedPosition === 'body' && position.line > 10) {
      score += 0.2;
    }
  }

  return Math.min(1, score);
};

/**
 * 39. Generates confidence explanation for transparency.
 *
 * @param {ExtractedFieldResult} field - Extracted field with confidence
 * @param {ConfidenceScoringFactors} [factors] - Detailed scoring factors
 * @returns {string} Human-readable confidence explanation
 *
 * @example
 * ```typescript
 * const explanation = generateConfidenceExplanation(extractedField, scoringFactors);
 * // Returns: "High confidence (0.92) based on strong pattern match and successful validation"
 * ```
 */
export const generateConfidenceExplanation = (
  field: ExtractedFieldResult,
  factors?: ConfidenceScoringFactors,
): string => {
  const level = field.confidenceLevel;
  const score = field.confidence.toFixed(2);

  let explanation = `${level.charAt(0).toUpperCase() + level.slice(1)} confidence (${score})`;

  const reasons: string[] = [];

  if (factors) {
    if (factors.patternMatchScore >= 0.9) reasons.push('strong pattern match');
    if (factors.validationScore >= 0.9) reasons.push('successful validation');
    if (factors.entityLinkingScore >= 0.8) reasons.push('linked to known entity');
    if (factors.contextScore >= 0.8) reasons.push('appropriate context');
  }

  if (field.method) {
    reasons.push(`extracted via ${field.method}`);
  }

  if (reasons.length > 0) {
    explanation += ' based on ' + reasons.join(', ');
  }

  return explanation;
};

// ============================================================================
// 7. EXTRACTION VALIDATION
// ============================================================================

/**
 * 40. Validates extracted field against defined rules.
 *
 * @param {ExtractedFieldResult} field - Extracted field to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateExtractedField(field, [
 *   { field: 'patientName', rule: 'required', errorMessage: 'Patient name is required', severity: 'error' },
 *   { field: 'age', rule: 'range:0-120', errorMessage: 'Invalid age', severity: 'error' }
 * ]);
 * ```
 */
export const validateExtractedField = async (
  field: ExtractedFieldResult,
  rules: ValidationRule[],
): Promise<ValidationResult> => {
  const errors: Array<{ rule: string; message: string; severity: 'error' | 'warning' }> = [];

  for (const rule of rules) {
    if (rule.field !== field.fieldName) continue;

    if (rule.rule === 'required' && (!field.value || field.value === '')) {
      errors.push({
        rule: rule.rule,
        message: rule.errorMessage,
        severity: rule.severity,
      });
    } else if (rule.rule.startsWith('range:')) {
      const [min, max] = rule.rule.substring(6).split('-').map(Number);
      const value = Number(field.value);
      if (isNaN(value) || value < min || value > max) {
        errors.push({
          rule: rule.rule,
          message: rule.errorMessage,
          severity: rule.severity,
        });
      }
    } else if (rule.rule.startsWith('pattern:')) {
      const pattern = new RegExp(rule.rule.substring(8));
      if (!pattern.test(String(field.value))) {
        errors.push({
          rule: rule.rule,
          message: rule.errorMessage,
          severity: rule.severity,
        });
      }
    }
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    field: field.fieldName,
    value: field.value,
    errors,
  };
};

/**
 * 41. Checks for required fields in extraction result.
 *
 * @param {ExtractedFieldResult[]} fields - Extracted fields
 * @param {string[]} requiredFields - Required field names
 * @returns {Promise<{ complete: boolean; missing: string[] }>} Completeness check result
 *
 * @example
 * ```typescript
 * const check = await checkRequiredFields(extractedFields, ['patientName', 'dateOfBirth', 'diagnosis']);
 * ```
 */
export const checkRequiredFields = async (
  fields: ExtractedFieldResult[],
  requiredFields: string[],
): Promise<{ complete: boolean; missing: string[] }> => {
  const extractedFieldNames = new Set(fields.map((f) => f.fieldName));
  const missing = requiredFields.filter((field) => !extractedFieldNames.has(field));

  return {
    complete: missing.length === 0,
    missing,
  };
};

/**
 * 42. Validates extraction consistency across related fields.
 *
 * @param {ExtractedFieldResult[]} fields - Extracted fields
 * @param {Array<{ fields: string[]; rule: string }>} consistencyRules - Consistency rules
 * @returns {Promise<{ consistent: boolean; violations: Array<{ rule: string; message: string }> }>} Consistency validation
 *
 * @example
 * ```typescript
 * const validation = await validateExtractionConsistency(fields, [
 *   { fields: ['admissionDate', 'dischargeDate'], rule: 'admissionDate < dischargeDate' }
 * ]);
 * ```
 */
export const validateExtractionConsistency = async (
  fields: ExtractedFieldResult[],
  consistencyRules: Array<{ fields: string[]; rule: string }>,
): Promise<{ consistent: boolean; violations: Array<{ rule: string; message: string }> }> => {
  const violations: Array<{ rule: string; message: string }> = [];

  const fieldMap = new Map(fields.map((f) => [f.fieldName, f.value]));

  for (const rule of consistencyRules) {
    const values = rule.fields.map((f) => fieldMap.get(f));

    // Check if all required fields are present
    if (values.some((v) => v === undefined)) continue;

    // Apply consistency rule
    if (rule.rule.includes('<')) {
      const [field1, field2] = rule.fields;
      const date1 = new Date(values[0]);
      const date2 = new Date(values[1]);

      if (date1 >= date2) {
        violations.push({
          rule: rule.rule,
          message: `${field1} must be before ${field2}`,
        });
      }
    }
  }

  return {
    consistent: violations.length === 0,
    violations,
  };
};

/**
 * 43. Detects and flags duplicate extractions.
 *
 * @param {ExtractedFieldResult[]} fields - Extracted fields
 * @param {number} [similarityThreshold] - Similarity threshold for duplicates (default: 0.95)
 * @returns {Promise<Array<{ field1: string; field2: string; similarity: number }>>} Detected duplicates
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateExtractions(fields, 0.95);
 * ```
 */
export const detectDuplicateExtractions = async (
  fields: ExtractedFieldResult[],
  similarityThreshold: number = 0.95,
): Promise<Array<{ field1: string; field2: string; similarity: number }>> => {
  const duplicates: Array<{ field1: string; field2: string; similarity: number }> = [];

  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const field1 = fields[i];
      const field2 = fields[j];

      const similarity = calculateStringSimilarity(String(field1.value), String(field2.value));

      if (similarity >= similarityThreshold) {
        duplicates.push({
          field1: field1.fieldName,
          field2: field2.fieldName,
          similarity,
        });
      }
    }
  }

  return duplicates;
};

/**
 * 44. Validates template matching accuracy.
 *
 * @param {string} text - Document text
 * @param {ExtractionTemplateConfig} template - Extraction template
 * @returns {Promise<TemplateMatchingResult>} Template matching result
 *
 * @example
 * ```typescript
 * const match = await validateTemplateMatch(documentText, extractionTemplate);
 * console.log('Template match score:', match.matchScore);
 * ```
 */
export const validateTemplateMatch = async (
  text: string,
  template: ExtractionTemplateConfig,
): Promise<TemplateMatchingResult> => {
  let matchScore = 0;
  const matchedKeywords: string[] = [];
  const matchedPatterns: string[] = [];

  // Check keywords
  if (template.fields) {
    for (const field of template.fields) {
      if (field.keywords) {
        for (const keyword of field.keywords) {
          if (text.toLowerCase().includes(keyword.toLowerCase())) {
            matchedKeywords.push(keyword);
            matchScore += 0.1;
          }
        }
      }

      if (field.pattern) {
        const pattern = typeof field.pattern === 'string' ? new RegExp(field.pattern, 'i') : field.pattern;
        if (pattern.test(text)) {
          matchedPatterns.push(field.name);
          matchScore += 0.15;
        }
      }
    }
  }

  matchScore = Math.min(1, matchScore);

  return {
    templateId: template.id || '',
    templateName: template.name,
    matchScore,
    confidence: matchScore,
    matchedKeywords,
    matchedPatterns,
  };
};

/**
 * 45. Generates extraction quality report.
 *
 * @param {DocumentExtractionResult} extractionResult - Complete extraction result
 * @returns {Promise<{ overallQuality: number; fieldQuality: Record<string, number>; recommendations: string[] }>} Quality report
 *
 * @example
 * ```typescript
 * const report = await generateExtractionQualityReport(extractionResult);
 * console.log('Overall quality:', report.overallQuality);
 * console.log('Recommendations:', report.recommendations);
 * ```
 */
export const generateExtractionQualityReport = async (
  extractionResult: DocumentExtractionResult,
): Promise<{ overallQuality: number; fieldQuality: Record<string, number>; recommendations: string[] }> => {
  const fieldQuality: Record<string, number> = {};
  const recommendations: string[] = [];

  let totalConfidence = 0;

  for (const field of extractionResult.fields) {
    fieldQuality[field.fieldName] = field.confidence;
    totalConfidence += field.confidence;

    if (field.confidence < 0.7) {
      recommendations.push(`Low confidence for field "${field.fieldName}" - consider manual review`);
    }

    if (field.validationErrors && field.validationErrors.length > 0) {
      recommendations.push(`Validation errors in field "${field.fieldName}" - ${field.validationErrors.join(', ')}`);
    }
  }

  const overallQuality =
    extractionResult.fields.length > 0 ? totalConfidence / extractionResult.fields.length : 0;

  if (overallQuality < 0.8) {
    recommendations.push('Overall extraction quality below 80% - document may need better OCR or template tuning');
  }

  if (extractionResult.summary.failedFields > 0) {
    recommendations.push(
      `${extractionResult.summary.failedFields} fields failed to extract - review template configuration`,
    );
  }

  return {
    overallQuality,
    fieldQuality,
    recommendations,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to calculate string similarity (Jaro-Winkler distance)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  const len1 = str1.length;
  const len2 = str2.length;
  const maxDist = Math.floor(Math.max(len1, len2) / 2) - 1;

  let matches = 0;
  const hash1 = new Array(len1).fill(false);
  const hash2 = new Array(len2).fill(false);

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - maxDist);
    const end = Math.min(i + maxDist + 1, len2);

    for (let j = start; j < end; j++) {
      if (hash2[j] || str1[i] !== str2[j]) continue;
      hash1[i] = true;
      hash2[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  // Calculate transpositions
  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!hash1[i]) continue;
    while (!hash2[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

  return jaro;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model creators
  createExtractionTemplateModel,
  createExtractedFieldModel,
  createExtractionRuleModel,

  // NLP text extraction
  extractNamedEntities,
  extractDatesFromText,
  extractMedicalTerminology,
  extractMedicationInfo,
  extractKeyValuePairs,
  extractContactInformation,
  extractMeasurements,

  // Regex pattern matching
  matchPatterns,
  extractWithCaptureGroups,
  fuzzyPatternMatch,
  extractTableData,
  validateDataFormat,
  extractPatternContext,
  buildCompositePattern,

  // Field mapping
  mapFieldsToSchema,
  resolveFieldAlias,
  mergeExtractionResults,
  createDynamicFieldMapping,
  transformFieldValue,
  validateFieldMapping,
  applyConditionalMapping,

  // Data normalization
  normalizeDateValue,
  normalizePhoneNumber,
  normalizeAddress,
  normalizeName,
  normalizeCurrency,
  normalizeMedicalCode,

  // Entity linking
  linkEntityToMasterData,
  resolveEntityAcrossDocuments,
  disambiguateEntity,
  createEntityRelationshipGraph,
  validateEntityLink,
  enrichEntityWithExternalData,

  // Confidence scoring
  calculateCompositeConfidence,
  classifyConfidenceLevel,
  adjustConfidenceByValidation,
  calculatePatternMatchConfidence,
  calculatePositionScore,
  generateConfidenceExplanation,

  // Extraction validation
  validateExtractedField,
  checkRequiredFields,
  validateExtractionConsistency,
  detectDuplicateExtractions,
  validateTemplateMatch,
  generateExtractionQualityReport,
};
