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
import { Sequelize } from 'sequelize';
/**
 * Field data types for extraction
 */
export type FieldDataType = 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone' | 'address' | 'currency' | 'percentage' | 'medicalCode' | 'drugName' | 'dosage';
/**
 * Extraction method types
 */
export type ExtractionMethod = 'nlp' | 'regex' | 'keyword' | 'position' | 'table' | 'contextual' | 'ml' | 'hybrid';
/**
 * Entity types for linking
 */
export type EntityType = 'person' | 'organization' | 'location' | 'date' | 'medication' | 'condition' | 'procedure' | 'labTest' | 'diagnosis';
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
export declare const createExtractionTemplateModel: (sequelize: Sequelize) => any;
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
export declare const createExtractedFieldModel: (sequelize: Sequelize) => any;
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
export declare const createExtractionRuleModel: (sequelize: Sequelize) => any;
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
export declare const extractNamedEntities: (text: string, options?: NLPExtractionOptions) => Promise<EntityRecognitionResult[]>;
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
export declare const extractDatesFromText: (text: string, timezone?: string) => Promise<Array<{
    date: Date;
    text: string;
    confidence: number;
}>>;
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
export declare const extractMedicalTerminology: (text: string, codeSystems?: string[]) => Promise<Array<{
    term: string;
    code?: string;
    system?: string;
    confidence: number;
}>>;
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
export declare const extractMedicationInfo: (text: string) => Promise<Array<{
    drug: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    confidence: number;
}>>;
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
export declare const extractKeyValuePairs: (text: string, separators?: string[]) => Promise<Map<string, string>>;
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
export declare const extractContactInformation: (text: string) => Promise<{
    emails: string[];
    phones: string[];
    addresses: string[];
}>;
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
export declare const extractMeasurements: (text: string, units?: string[]) => Promise<Array<{
    value: number;
    unit: string;
    text: string;
    confidence: number;
}>>;
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
export declare const matchPatterns: (text: string, patterns: Array<{
    pattern: RegExp;
    name: string;
    priority: number;
}>, options?: PatternMatchingOptions) => Promise<Array<{
    match: string;
    pattern: string;
    groups?: string[];
    position: {
        start: number;
        end: number;
    };
}>>;
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
export declare const extractWithCaptureGroups: (text: string, pattern: RegExp) => Promise<Record<string, string>[]>;
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
export declare const fuzzyPatternMatch: (text: string, pattern: string, maxDistance?: number) => Promise<Array<{
    match: string;
    distance: number;
    similarity: number;
    position: number;
}>>;
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
export declare const extractTableData: (text: string, columnSeparator?: string) => Promise<Array<Record<string, string>>>;
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
export declare const validateDataFormat: (value: string, dataType: FieldDataType) => Promise<{
    valid: boolean;
    format?: string;
    suggestion?: string;
}>;
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
export declare const extractPatternContext: (text: string, pattern: RegExp, contextLength?: number) => Promise<Array<{
    match: string;
    before: string;
    after: string;
    fullContext: string;
}>>;
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
export declare const buildCompositePattern: (subPatterns: string[], operator?: string) => RegExp;
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
export declare const mapFieldsToSchema: (sourceData: Record<string, any>, mappings: FieldMappingConfig[]) => Promise<Record<string, any>>;
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
export declare const resolveFieldAlias: (fieldName: string, aliasMap: Map<string, string[]>) => string;
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
export declare const mergeExtractionResults: (results: ExtractedFieldResult[][], strategy?: string) => Promise<ExtractedFieldResult[]>;
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
export declare const createDynamicFieldMapping: (documentData: Record<string, any>, targetFields: string[]) => Promise<FieldMappingConfig[]>;
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
export declare const transformFieldValue: (value: any, transformationType: string, options?: Record<string, any>) => Promise<any>;
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
export declare const validateFieldMapping: (mappings: FieldMappingConfig[], requiredFields: string[]) => Promise<{
    valid: boolean;
    missing: string[];
    conflicts: string[];
}>;
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
export declare const applyConditionalMapping: (sourceData: Record<string, any>, conditionalMappings: Array<{
    condition: (data: Record<string, any>) => boolean;
    mappings: FieldMappingConfig[];
}>) => Promise<Record<string, any>>;
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
export declare const normalizeDateValue: (date: string | Date, format?: string) => Promise<string>;
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
export declare const normalizePhoneNumber: (phone: string, defaultCountryCode?: string) => Promise<string>;
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
export declare const normalizeAddress: (address: string | Record<string, string>) => Promise<{
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}>;
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
export declare const normalizeName: (name: string, format?: string) => Promise<{
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName: string;
}>;
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
export declare const normalizeCurrency: (value: string | number, currencyCode?: string) => Promise<{
    amount: number;
    currency: string;
    formatted: string;
}>;
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
export declare const normalizeMedicalCode: (code: string, codeSystem: string) => Promise<{
    code: string;
    system: string;
    display?: string;
}>;
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
export declare const linkEntityToMasterData: (entity: EntityRecognitionResult, masterData: Array<{
    id: string;
    name: string;
    type: EntityType;
    aliases?: string[];
}>) => Promise<{
    entityId: string;
    confidence: number;
    matches: Array<{
        id: string;
        score: number;
    }>;
}>;
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
export declare const resolveEntityAcrossDocuments: (entityText: string, documentIds: string[]) => Promise<Array<{
    documentId: string;
    fieldName: string;
    value: string;
    similarity: number;
}>>;
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
export declare const disambiguateEntity: (entity: EntityRecognitionResult, candidates: Array<{
    id: string;
    name: string;
    context: string;
}>, documentContext: string) => Promise<{
    selectedId: string;
    confidence: number;
    reason: string;
}>;
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
export declare const createEntityRelationshipGraph: (fields: ExtractedFieldResult[]) => Promise<{
    nodes: Array<{
        id: string;
        type: string;
        label: string;
    }>;
    edges: Array<{
        from: string;
        to: string;
        type: string;
    }>;
}>;
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
export declare const validateEntityLink: (entityId: string, linkedEntityId: string, validationRules: Array<{
    from: string;
    to: string;
    rule: string;
}>) => Promise<{
    valid: boolean;
    violations: string[];
}>;
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
export declare const enrichEntityWithExternalData: (entity: EntityRecognitionResult, dataSources: string[]) => Promise<Record<string, any>>;
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
export declare const calculateCompositeConfidence: (factors: ConfidenceScoringFactors) => number;
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
export declare const classifyConfidenceLevel: (confidenceScore: number, thresholds?: Record<ConfidenceLevel, {
    min: number;
    max: number;
}>) => ConfidenceLevel;
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
export declare const adjustConfidenceByValidation: (baseConfidence: number, validationResult: ValidationResult) => number;
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
export declare const calculatePatternMatchConfidence: (extractedValue: string, pattern: RegExp, context?: string) => number;
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
export declare const calculatePositionScore: (position: {
    page?: number;
    line?: number;
    start?: number;
    end?: number;
}, expectations: {
    expectedPage?: number;
    expectedSection?: string;
    expectedPosition?: "header" | "body" | "footer";
}) => number;
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
export declare const generateConfidenceExplanation: (field: ExtractedFieldResult, factors?: ConfidenceScoringFactors) => string;
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
export declare const validateExtractedField: (field: ExtractedFieldResult, rules: ValidationRule[]) => Promise<ValidationResult>;
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
export declare const checkRequiredFields: (fields: ExtractedFieldResult[], requiredFields: string[]) => Promise<{
    complete: boolean;
    missing: string[];
}>;
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
export declare const validateExtractionConsistency: (fields: ExtractedFieldResult[], consistencyRules: Array<{
    fields: string[];
    rule: string;
}>) => Promise<{
    consistent: boolean;
    violations: Array<{
        rule: string;
        message: string;
    }>;
}>;
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
export declare const detectDuplicateExtractions: (fields: ExtractedFieldResult[], similarityThreshold?: number) => Promise<Array<{
    field1: string;
    field2: string;
    similarity: number;
}>>;
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
export declare const validateTemplateMatch: (text: string, template: ExtractionTemplateConfig) => Promise<TemplateMatchingResult>;
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
export declare const generateExtractionQualityReport: (extractionResult: DocumentExtractionResult) => Promise<{
    overallQuality: number;
    fieldQuality: Record<string, number>;
    recommendations: string[];
}>;
declare const _default: {
    createExtractionTemplateModel: (sequelize: Sequelize) => any;
    createExtractedFieldModel: (sequelize: Sequelize) => any;
    createExtractionRuleModel: (sequelize: Sequelize) => any;
    extractNamedEntities: (text: string, options?: NLPExtractionOptions) => Promise<EntityRecognitionResult[]>;
    extractDatesFromText: (text: string, timezone?: string) => Promise<Array<{
        date: Date;
        text: string;
        confidence: number;
    }>>;
    extractMedicalTerminology: (text: string, codeSystems?: string[]) => Promise<Array<{
        term: string;
        code?: string;
        system?: string;
        confidence: number;
    }>>;
    extractMedicationInfo: (text: string) => Promise<Array<{
        drug: string;
        dosage?: string;
        frequency?: string;
        route?: string;
        confidence: number;
    }>>;
    extractKeyValuePairs: (text: string, separators?: string[]) => Promise<Map<string, string>>;
    extractContactInformation: (text: string) => Promise<{
        emails: string[];
        phones: string[];
        addresses: string[];
    }>;
    extractMeasurements: (text: string, units?: string[]) => Promise<Array<{
        value: number;
        unit: string;
        text: string;
        confidence: number;
    }>>;
    matchPatterns: (text: string, patterns: Array<{
        pattern: RegExp;
        name: string;
        priority: number;
    }>, options?: PatternMatchingOptions) => Promise<Array<{
        match: string;
        pattern: string;
        groups?: string[];
        position: {
            start: number;
            end: number;
        };
    }>>;
    extractWithCaptureGroups: (text: string, pattern: RegExp) => Promise<Record<string, string>[]>;
    fuzzyPatternMatch: (text: string, pattern: string, maxDistance?: number) => Promise<Array<{
        match: string;
        distance: number;
        similarity: number;
        position: number;
    }>>;
    extractTableData: (text: string, columnSeparator?: string) => Promise<Array<Record<string, string>>>;
    validateDataFormat: (value: string, dataType: FieldDataType) => Promise<{
        valid: boolean;
        format?: string;
        suggestion?: string;
    }>;
    extractPatternContext: (text: string, pattern: RegExp, contextLength?: number) => Promise<Array<{
        match: string;
        before: string;
        after: string;
        fullContext: string;
    }>>;
    buildCompositePattern: (subPatterns: string[], operator?: string) => RegExp;
    mapFieldsToSchema: (sourceData: Record<string, any>, mappings: FieldMappingConfig[]) => Promise<Record<string, any>>;
    resolveFieldAlias: (fieldName: string, aliasMap: Map<string, string[]>) => string;
    mergeExtractionResults: (results: ExtractedFieldResult[][], strategy?: string) => Promise<ExtractedFieldResult[]>;
    createDynamicFieldMapping: (documentData: Record<string, any>, targetFields: string[]) => Promise<FieldMappingConfig[]>;
    transformFieldValue: (value: any, transformationType: string, options?: Record<string, any>) => Promise<any>;
    validateFieldMapping: (mappings: FieldMappingConfig[], requiredFields: string[]) => Promise<{
        valid: boolean;
        missing: string[];
        conflicts: string[];
    }>;
    applyConditionalMapping: (sourceData: Record<string, any>, conditionalMappings: Array<{
        condition: (data: Record<string, any>) => boolean;
        mappings: FieldMappingConfig[];
    }>) => Promise<Record<string, any>>;
    normalizeDateValue: (date: string | Date, format?: string) => Promise<string>;
    normalizePhoneNumber: (phone: string, defaultCountryCode?: string) => Promise<string>;
    normalizeAddress: (address: string | Record<string, string>) => Promise<{
        street: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    }>;
    normalizeName: (name: string, format?: string) => Promise<{
        firstName: string;
        lastName: string;
        middleName?: string;
        fullName: string;
    }>;
    normalizeCurrency: (value: string | number, currencyCode?: string) => Promise<{
        amount: number;
        currency: string;
        formatted: string;
    }>;
    normalizeMedicalCode: (code: string, codeSystem: string) => Promise<{
        code: string;
        system: string;
        display?: string;
    }>;
    linkEntityToMasterData: (entity: EntityRecognitionResult, masterData: Array<{
        id: string;
        name: string;
        type: EntityType;
        aliases?: string[];
    }>) => Promise<{
        entityId: string;
        confidence: number;
        matches: Array<{
            id: string;
            score: number;
        }>;
    }>;
    resolveEntityAcrossDocuments: (entityText: string, documentIds: string[]) => Promise<Array<{
        documentId: string;
        fieldName: string;
        value: string;
        similarity: number;
    }>>;
    disambiguateEntity: (entity: EntityRecognitionResult, candidates: Array<{
        id: string;
        name: string;
        context: string;
    }>, documentContext: string) => Promise<{
        selectedId: string;
        confidence: number;
        reason: string;
    }>;
    createEntityRelationshipGraph: (fields: ExtractedFieldResult[]) => Promise<{
        nodes: Array<{
            id: string;
            type: string;
            label: string;
        }>;
        edges: Array<{
            from: string;
            to: string;
            type: string;
        }>;
    }>;
    validateEntityLink: (entityId: string, linkedEntityId: string, validationRules: Array<{
        from: string;
        to: string;
        rule: string;
    }>) => Promise<{
        valid: boolean;
        violations: string[];
    }>;
    enrichEntityWithExternalData: (entity: EntityRecognitionResult, dataSources: string[]) => Promise<Record<string, any>>;
    calculateCompositeConfidence: (factors: ConfidenceScoringFactors) => number;
    classifyConfidenceLevel: (confidenceScore: number, thresholds?: Record<ConfidenceLevel, {
        min: number;
        max: number;
    }>) => ConfidenceLevel;
    adjustConfidenceByValidation: (baseConfidence: number, validationResult: ValidationResult) => number;
    calculatePatternMatchConfidence: (extractedValue: string, pattern: RegExp, context?: string) => number;
    calculatePositionScore: (position: {
        page?: number;
        line?: number;
        start?: number;
        end?: number;
    }, expectations: {
        expectedPage?: number;
        expectedSection?: string;
        expectedPosition?: "header" | "body" | "footer";
    }) => number;
    generateConfidenceExplanation: (field: ExtractedFieldResult, factors?: ConfidenceScoringFactors) => string;
    validateExtractedField: (field: ExtractedFieldResult, rules: ValidationRule[]) => Promise<ValidationResult>;
    checkRequiredFields: (fields: ExtractedFieldResult[], requiredFields: string[]) => Promise<{
        complete: boolean;
        missing: string[];
    }>;
    validateExtractionConsistency: (fields: ExtractedFieldResult[], consistencyRules: Array<{
        fields: string[];
        rule: string;
    }>) => Promise<{
        consistent: boolean;
        violations: Array<{
            rule: string;
            message: string;
        }>;
    }>;
    detectDuplicateExtractions: (fields: ExtractedFieldResult[], similarityThreshold?: number) => Promise<Array<{
        field1: string;
        field2: string;
        similarity: number;
    }>>;
    validateTemplateMatch: (text: string, template: ExtractionTemplateConfig) => Promise<TemplateMatchingResult>;
    generateExtractionQualityReport: (extractionResult: DocumentExtractionResult) => Promise<{
        overallQuality: number;
        fieldQuality: Record<string, number>;
        recommendations: string[];
    }>;
};
export default _default;
//# sourceMappingURL=document-data-extraction-kit.d.ts.map