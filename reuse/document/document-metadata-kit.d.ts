/**
 * LOC: DOC-META-001
 * File: /reuse/document/document-metadata-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Document management services
 *   - File processing controllers
 *   - Metadata extraction services
 *   - Document indexing modules
 */
/**
 * File: /reuse/document/document-metadata-kit.ts
 * Locator: WC-UTL-DOCMETA-001
 * Purpose: Document Metadata Management Kit - Comprehensive metadata extraction, modification, and validation utilities
 *
 * Upstream: Independent utility module for document metadata operations
 * Downstream: ../backend/*, Document services, File processors, Search indexers, Archive managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, pdf-lib, exiftool-vendored
 * Exports: 38 utility functions for metadata extraction, XMP/Dublin Core handling, batch operations, templates, validation
 *
 * LLM Context: Production-ready document metadata utilities for White Cross healthcare platform.
 * Provides metadata extraction from PDFs/images/documents, XMP and Dublin Core standard support,
 * custom property management, batch metadata operations, metadata templates, validation, versioning,
 * and HIPAA-compliant metadata handling. Essential for document management, search, and compliance.
 */
import { Sequelize } from 'sequelize';
/**
 * Document metadata interface
 */
export interface DocumentMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    language?: string;
    pageCount?: number;
    fileSize?: number;
    format?: string;
    version?: string;
    encrypted?: boolean;
    rights?: string;
    description?: string;
}
/**
 * XMP metadata structure
 */
export interface XMPMetadata {
    'dc:title'?: string;
    'dc:creator'?: string[];
    'dc:subject'?: string[];
    'dc:description'?: string;
    'dc:publisher'?: string;
    'dc:contributor'?: string[];
    'dc:date'?: string;
    'dc:type'?: string;
    'dc:format'?: string;
    'dc:identifier'?: string;
    'dc:source'?: string;
    'dc:language'?: string;
    'dc:relation'?: string;
    'dc:coverage'?: string;
    'dc:rights'?: string;
    'xmp:CreateDate'?: string;
    'xmp:ModifyDate'?: string;
    'xmp:MetadataDate'?: string;
    'xmp:CreatorTool'?: string;
    'pdf:Producer'?: string;
    'pdf:Keywords'?: string;
    customProperties?: Record<string, any>;
}
/**
 * Dublin Core metadata
 */
export interface DublinCoreMetadata {
    title?: string;
    creator?: string[];
    subject?: string[];
    description?: string;
    publisher?: string;
    contributor?: string[];
    date?: string;
    type?: string;
    format?: string;
    identifier?: string;
    source?: string;
    language?: string;
    relation?: string;
    coverage?: string;
    rights?: string;
}
/**
 * Custom metadata properties
 */
export interface CustomMetadataProperty {
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
    namespace?: string;
    readonly?: boolean;
    indexed?: boolean;
    encrypted?: boolean;
}
/**
 * Metadata extraction options
 */
export interface MetadataExtractionOptions {
    includeXMP?: boolean;
    includeDublinCore?: boolean;
    includeCustom?: boolean;
    includeTechnical?: boolean;
    includePreview?: boolean;
    maxPreviewSize?: number;
    extractText?: boolean;
    maxTextLength?: number;
}
/**
 * Metadata modification request
 */
export interface MetadataModification {
    field: string;
    value: any;
    operation: 'set' | 'append' | 'remove' | 'clear';
    namespace?: string;
}
/**
 * Batch metadata operation
 */
export interface BatchMetadataOperation {
    documentIds: string[];
    modifications: MetadataModification[];
    validateBefore?: boolean;
    rollbackOnError?: boolean;
    returnResults?: boolean;
}
/**
 * Batch operation result
 */
export interface BatchOperationResult {
    totalDocuments: number;
    successful: number;
    failed: number;
    errors: Array<{
        documentId: string;
        error: string;
    }>;
    results?: Array<{
        documentId: string;
        metadata: DocumentMetadata;
    }>;
}
/**
 * Metadata template
 */
export interface MetadataTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    fields: MetadataTemplateField[];
    validation?: MetadataValidationRules;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Metadata template field
 */
export interface MetadataTemplateField {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'select' | 'multiselect';
    required?: boolean;
    defaultValue?: any;
    options?: string[];
    validation?: FieldValidationRules;
    placeholder?: string;
    helpText?: string;
    namespace?: string;
}
/**
 * Field validation rules
 */
export interface FieldValidationRules {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
}
/**
 * Metadata validation rules
 */
export interface MetadataValidationRules {
    requiredFields?: string[];
    fieldRules?: Record<string, FieldValidationRules>;
    customValidation?: (metadata: DocumentMetadata) => boolean | string;
}
/**
 * Metadata validation result
 */
export interface MetadataValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings?: ValidationWarning[];
}
/**
 * Validation error
 */
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: any;
}
/**
 * Validation warning
 */
export interface ValidationWarning {
    field: string;
    message: string;
    suggestion?: string;
}
/**
 * Metadata search criteria
 */
export interface MetadataSearchCriteria {
    query?: string;
    fields?: string[];
    filters?: Record<string, any>;
    dateRange?: {
        from?: Date;
        to?: Date;
    };
    author?: string;
    keywords?: string[];
    format?: string;
    customProperties?: Record<string, any>;
}
/**
 * Metadata comparison result
 */
export interface MetadataComparisonResult {
    identical: boolean;
    differences: MetadataDifference[];
    similarity?: number;
}
/**
 * Metadata difference
 */
export interface MetadataDifference {
    field: string;
    oldValue: any;
    newValue: any;
    type: 'added' | 'removed' | 'modified';
}
/**
 * Metadata export format
 */
export type MetadataExportFormat = 'json' | 'xml' | 'csv' | 'yaml' | 'rdf';
/**
 * Metadata import result
 */
export interface MetadataImportResult {
    imported: number;
    skipped: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
    metadata?: DocumentMetadata[];
}
/**
 * Document metadata model attributes
 */
export interface DocumentMetadataAttributes {
    id: string;
    documentId: string;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    language?: string;
    pageCount?: number;
    fileSize?: number;
    format?: string;
    version?: string;
    encrypted?: boolean;
    rights?: string;
    description?: string;
    xmpMetadata?: Record<string, any>;
    dublinCore?: Record<string, any>;
    customProperties?: Record<string, any>;
    technicalMetadata?: Record<string, any>;
    extractedText?: string;
    metadataHash?: string;
    lastExtractedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentMetadata model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentMetadataAttributes>>} DocumentMetadata model
 *
 * @example
 * ```typescript
 * const MetadataModel = createDocumentMetadataModel(sequelize);
 * const metadata = await MetadataModel.create({
 *   documentId: 'doc-123',
 *   title: 'Medical Report',
 *   author: 'Dr. Smith',
 *   keywords: ['radiology', 'mri', 'scan']
 * });
 * ```
 */
export declare const createDocumentMetadataModel: (sequelize: Sequelize) => any;
/**
 * Metadata template model attributes
 */
export interface MetadataTemplateAttributes {
    id: string;
    name: string;
    description?: string;
    category?: string;
    fields: any;
    validation?: any;
    isDefault: boolean;
    createdBy?: string;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates MetadataTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<MetadataTemplateAttributes>>} MetadataTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createMetadataTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Medical Report Template',
 *   fields: [
 *     { key: 'patientId', label: 'Patient ID', type: 'string', required: true },
 *     { key: 'reportType', label: 'Report Type', type: 'select', options: ['MRI', 'CT', 'X-Ray'] }
 *   ]
 * });
 * ```
 */
export declare const createMetadataTemplateModel: (sequelize: Sequelize) => any;
/**
 * 1. Extracts metadata from PDF document buffer.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {MetadataExtractionOptions} [options] - Extraction options
 * @returns {Promise<DocumentMetadata>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractPDFMetadata(pdfBuffer, {
 *   includeXMP: true,
 *   includeDublinCore: true,
 *   extractText: true
 * });
 * console.log('Title:', metadata.title);
 * ```
 */
export declare const extractPDFMetadata: (pdfBuffer: Buffer, options?: MetadataExtractionOptions) => Promise<DocumentMetadata>;
/**
 * 2. Extracts metadata from image file (JPEG, PNG, TIFF).
 *
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} format - Image format
 * @returns {Promise<DocumentMetadata>} Extracted metadata including EXIF
 *
 * @example
 * ```typescript
 * const metadata = await extractImageMetadata(jpegBuffer, 'jpeg');
 * console.log('Camera:', metadata.creator);
 * ```
 */
export declare const extractImageMetadata: (imageBuffer: Buffer, format: string) => Promise<DocumentMetadata>;
/**
 * 3. Extracts metadata from Microsoft Office documents.
 *
 * @param {Buffer} docBuffer - Document buffer
 * @param {string} format - Document format (docx, xlsx, pptx)
 * @returns {Promise<DocumentMetadata>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractOfficeMetadata(docxBuffer, 'docx');
 * console.log('Author:', metadata.author);
 * ```
 */
export declare const extractOfficeMetadata: (docBuffer: Buffer, format: string) => Promise<DocumentMetadata>;
/**
 * 4. Extracts metadata from generic file types.
 *
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - MIME type
 * @returns {Promise<DocumentMetadata>} Basic metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractGenericMetadata(buffer, 'application/zip');
 * ```
 */
export declare const extractGenericMetadata: (fileBuffer: Buffer, mimeType: string) => Promise<DocumentMetadata>;
/**
 * 5. Extracts all available metadata from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {string} format - Document format
 * @param {MetadataExtractionOptions} [options] - Extraction options
 * @returns {Promise<DocumentMetadata>} Comprehensive metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractAllMetadata(buffer, 'pdf', {
 *   includeXMP: true,
 *   includeDublinCore: true,
 *   includeCustom: true,
 *   extractText: true
 * });
 * ```
 */
export declare const extractAllMetadata: (documentBuffer: Buffer, format: string, options?: MetadataExtractionOptions) => Promise<DocumentMetadata>;
/**
 * 6. Extracts XMP metadata from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<XMPMetadata | null>} XMP metadata or null
 *
 * @example
 * ```typescript
 * const xmp = await extractXMPMetadata(pdfBuffer);
 * console.log('Creator:', xmp?.['dc:creator']);
 * ```
 */
export declare const extractXMPMetadata: (documentBuffer: Buffer) => Promise<XMPMetadata | null>;
/**
 * 7. Sets XMP metadata in document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {XMPMetadata} xmpData - XMP metadata to set
 * @returns {Promise<Buffer>} Updated document buffer
 *
 * @example
 * ```typescript
 * const updated = await setXMPMetadata(pdfBuffer, {
 *   'dc:title': 'Medical Report',
 *   'dc:creator': ['Dr. Smith'],
 *   'dc:subject': ['radiology', 'mri']
 * });
 * ```
 */
export declare const setXMPMetadata: (documentBuffer: Buffer, xmpData: XMPMetadata) => Promise<Buffer>;
/**
 * 8. Updates specific XMP properties.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {Partial<XMPMetadata>} updates - XMP properties to update
 * @returns {Promise<Buffer>} Updated document buffer
 *
 * @example
 * ```typescript
 * const updated = await updateXMPMetadata(pdfBuffer, {
 *   'xmp:ModifyDate': new Date().toISOString(),
 *   'dc:subject': ['updated', 'keywords']
 * });
 * ```
 */
export declare const updateXMPMetadata: (documentBuffer: Buffer, updates: Partial<XMPMetadata>) => Promise<Buffer>;
/**
 * 9. Removes XMP metadata from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Buffer>} Document buffer without XMP
 *
 * @example
 * ```typescript
 * const cleaned = await removeXMPMetadata(pdfBuffer);
 * ```
 */
export declare const removeXMPMetadata: (documentBuffer: Buffer) => Promise<Buffer>;
/**
 * 10. Validates XMP metadata structure.
 *
 * @param {XMPMetadata} xmpData - XMP metadata to validate
 * @returns {MetadataValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateXMPMetadata({
 *   'dc:title': 'Report',
 *   'dc:creator': ['Author']
 * });
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare const validateXMPMetadata: (xmpData: XMPMetadata) => MetadataValidationResult;
/**
 * 11. Extracts Dublin Core metadata from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<DublinCoreMetadata | null>} Dublin Core metadata
 *
 * @example
 * ```typescript
 * const dc = await extractDublinCoreMetadata(pdfBuffer);
 * console.log('Title:', dc?.title);
 * ```
 */
export declare const extractDublinCoreMetadata: (documentBuffer: Buffer) => Promise<DublinCoreMetadata | null>;
/**
 * 12. Converts XMP to Dublin Core format.
 *
 * @param {XMPMetadata} xmpData - XMP metadata
 * @returns {DublinCoreMetadata} Dublin Core metadata
 *
 * @example
 * ```typescript
 * const dc = convertXMPToDublinCore({
 *   'dc:title': 'Report',
 *   'dc:creator': ['Dr. Smith']
 * });
 * ```
 */
export declare const convertXMPToDublinCore: (xmpData: XMPMetadata) => DublinCoreMetadata;
/**
 * 13. Converts Dublin Core to XMP format.
 *
 * @param {DublinCoreMetadata} dcData - Dublin Core metadata
 * @returns {XMPMetadata} XMP metadata
 *
 * @example
 * ```typescript
 * const xmp = convertDublinCoreToXMP({
 *   title: 'Report',
 *   creator: ['Dr. Smith']
 * });
 * ```
 */
export declare const convertDublinCoreToXMP: (dcData: DublinCoreMetadata) => XMPMetadata;
/**
 * 14. Sets Dublin Core metadata in document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {DublinCoreMetadata} dcData - Dublin Core metadata
 * @returns {Promise<Buffer>} Updated document buffer
 *
 * @example
 * ```typescript
 * const updated = await setDublinCoreMetadata(pdfBuffer, {
 *   title: 'Medical Report',
 *   creator: ['Dr. Smith'],
 *   date: '2024-01-01'
 * });
 * ```
 */
export declare const setDublinCoreMetadata: (documentBuffer: Buffer, dcData: DublinCoreMetadata) => Promise<Buffer>;
/**
 * 15. Gets custom metadata property.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @param {string} key - Property key
 * @param {string} [namespace] - Optional namespace
 * @returns {any} Property value or undefined
 *
 * @example
 * ```typescript
 * const patientId = getCustomProperty(metadata, 'patientId', 'medical');
 * ```
 */
export declare const getCustomProperty: (metadata: Record<string, any>, key: string, namespace?: string) => any;
/**
 * 16. Sets custom metadata property.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @param {CustomMetadataProperty} property - Property to set
 * @returns {Record<string, any>} Updated metadata
 *
 * @example
 * ```typescript
 * const updated = setCustomProperty(metadata, {
 *   key: 'patientId',
 *   value: 'P12345',
 *   type: 'string',
 *   namespace: 'medical',
 *   indexed: true
 * });
 * ```
 */
export declare const setCustomProperty: (metadata: Record<string, any>, property: CustomMetadataProperty) => Record<string, any>;
/**
 * 17. Removes custom metadata property.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @param {string} key - Property key
 * @param {string} [namespace] - Optional namespace
 * @returns {Record<string, any>} Updated metadata
 *
 * @example
 * ```typescript
 * const updated = removeCustomProperty(metadata, 'tempField', 'temp');
 * ```
 */
export declare const removeCustomProperty: (metadata: Record<string, any>, key: string, namespace?: string) => Record<string, any>;
/**
 * 18. Lists all custom properties with their types.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @returns {CustomMetadataProperty[]} Array of custom properties
 *
 * @example
 * ```typescript
 * const properties = listCustomProperties(metadata);
 * properties.forEach(prop => {
 *   console.log(`${prop.key}: ${prop.value} (${prop.type})`);
 * });
 * ```
 */
export declare const listCustomProperties: (metadata: Record<string, any>) => CustomMetadataProperty[];
/**
 * 19. Performs batch metadata update on multiple documents.
 *
 * @param {BatchMetadataOperation} operation - Batch operation details
 * @returns {Promise<BatchOperationResult>} Batch operation result
 *
 * @example
 * ```typescript
 * const result = await batchUpdateMetadata({
 *   documentIds: ['doc1', 'doc2', 'doc3'],
 *   modifications: [
 *     { field: 'author', value: 'Dr. Smith', operation: 'set' },
 *     { field: 'keywords', value: 'urgent', operation: 'append' }
 *   ],
 *   rollbackOnError: true
 * });
 * console.log(`Updated ${result.successful} documents`);
 * ```
 */
export declare const batchUpdateMetadata: (operation: BatchMetadataOperation) => Promise<BatchOperationResult>;
/**
 * 20. Copies metadata from one document to multiple documents.
 *
 * @param {string} sourceDocumentId - Source document ID
 * @param {string[]} targetDocumentIds - Target document IDs
 * @param {string[]} [fields] - Specific fields to copy (all if not specified)
 * @returns {Promise<BatchOperationResult>} Copy operation result
 *
 * @example
 * ```typescript
 * const result = await copyMetadataToDocuments('source-doc', ['doc1', 'doc2'],
 *   ['author', 'keywords', 'rights']
 * );
 * ```
 */
export declare const copyMetadataToDocuments: (sourceDocumentId: string, targetDocumentIds: string[], fields?: string[]) => Promise<BatchOperationResult>;
/**
 * 21. Merges metadata from multiple sources.
 *
 * @param {DocumentMetadata[]} metadataSources - Array of metadata objects to merge
 * @param {Object} [options] - Merge options
 * @returns {DocumentMetadata} Merged metadata
 *
 * @example
 * ```typescript
 * const merged = mergeMetadata([metadata1, metadata2, metadata3], {
 *   priority: 'last',
 *   conflictResolution: 'merge'
 * });
 * ```
 */
export declare const mergeMetadata: (metadataSources: DocumentMetadata[], options?: {
    priority?: "first" | "last";
    conflictResolution?: "overwrite" | "merge" | "skip";
}) => DocumentMetadata;
/**
 * 22. Bulk imports metadata from external source.
 *
 * @param {any[]} data - Array of metadata records
 * @param {MetadataExportFormat} format - Import format
 * @returns {Promise<MetadataImportResult>} Import result
 *
 * @example
 * ```typescript
 * const result = await bulkImportMetadata(csvData, 'csv');
 * console.log(`Imported ${result.imported} records, skipped ${result.skipped}`);
 * ```
 */
export declare const bulkImportMetadata: (data: any[], format: MetadataExportFormat) => Promise<MetadataImportResult>;
/**
 * 23. Creates metadata template.
 *
 * @param {MetadataTemplate} template - Template definition
 * @returns {Promise<MetadataTemplate>} Created template with ID
 *
 * @example
 * ```typescript
 * const template = await createMetadataTemplate({
 *   name: 'Medical Report',
 *   category: 'Healthcare',
 *   fields: [
 *     { key: 'patientId', label: 'Patient ID', type: 'string', required: true },
 *     { key: 'reportDate', label: 'Report Date', type: 'date', required: true }
 *   ]
 * });
 * ```
 */
export declare const createMetadataTemplate: (template: Omit<MetadataTemplate, "id">) => Promise<MetadataTemplate>;
/**
 * 24. Applies template to document metadata.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {MetadataTemplate} template - Template to apply
 * @returns {DocumentMetadata} Metadata with template defaults applied
 *
 * @example
 * ```typescript
 * const populated = applyMetadataTemplate(metadata, medicalReportTemplate);
 * ```
 */
export declare const applyMetadataTemplate: (metadata: DocumentMetadata, template: MetadataTemplate) => DocumentMetadata;
/**
 * 25. Validates metadata against template.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {MetadataTemplate} template - Template with validation rules
 * @returns {MetadataValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAgainstTemplate(metadata, template);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateAgainstTemplate: (metadata: DocumentMetadata, template: MetadataTemplate) => MetadataValidationResult;
/**
 * 26. Gets template by ID or name.
 *
 * @param {string} identifier - Template ID or name
 * @returns {Promise<MetadataTemplate | null>} Template or null
 *
 * @example
 * ```typescript
 * const template = await getMetadataTemplate('medical-report');
 * ```
 */
export declare const getMetadataTemplate: (identifier: string) => Promise<MetadataTemplate | null>;
/**
 * 27. Lists available metadata templates.
 *
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<MetadataTemplate[]>} Array of templates
 *
 * @example
 * ```typescript
 * const templates = await listMetadataTemplates({ category: 'Healthcare' });
 * ```
 */
export declare const listMetadataTemplates: (filters?: {
    category?: string;
    isDefault?: boolean;
}) => Promise<MetadataTemplate[]>;
/**
 * 28. Validates complete document metadata.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {MetadataValidationRules} [rules] - Validation rules
 * @returns {MetadataValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMetadata(metadata, {
 *   requiredFields: ['title', 'author', 'creationDate'],
 *   fieldRules: {
 *     title: { minLength: 1, maxLength: 500 },
 *     pageCount: { min: 1 }
 *   }
 * });
 * ```
 */
export declare const validateMetadata: (metadata: DocumentMetadata, rules?: MetadataValidationRules) => MetadataValidationResult;
/**
 * 29. Validates metadata completeness.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {number} [threshold] - Completeness threshold (0-100)
 * @returns {Object} Completeness result
 *
 * @example
 * ```typescript
 * const result = validateMetadataCompleteness(metadata, 80);
 * console.log(`Completeness: ${result.percentage}%`);
 * ```
 */
export declare const validateMetadataCompleteness: (metadata: DocumentMetadata, threshold?: number) => {
    complete: boolean;
    percentage: number;
    missingFields: string[];
};
/**
 * 30. Sanitizes metadata by removing invalid or sensitive data.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {Object} [options] - Sanitization options
 * @returns {DocumentMetadata} Sanitized metadata
 *
 * @example
 * ```typescript
 * const clean = sanitizeMetadata(metadata, {
 *   removeEmpty: true,
 *   removeSensitive: true,
 *   maxStringLength: 500
 * });
 * ```
 */
export declare const sanitizeMetadata: (metadata: DocumentMetadata, options?: {
    removeEmpty?: boolean;
    removeSensitive?: boolean;
    maxStringLength?: number;
}) => DocumentMetadata;
/**
 * 31. Searches documents by metadata criteria.
 *
 * @param {MetadataSearchCriteria} criteria - Search criteria
 * @returns {Promise<DocumentMetadata[]>} Matching documents
 *
 * @example
 * ```typescript
 * const results = await searchByMetadata({
 *   query: 'radiology report',
 *   author: 'Dr. Smith',
 *   keywords: ['mri', 'scan'],
 *   dateRange: { from: new Date('2024-01-01') }
 * });
 * ```
 */
export declare const searchByMetadata: (criteria: MetadataSearchCriteria) => Promise<DocumentMetadata[]>;
/**
 * 32. Compares metadata between two documents.
 *
 * @param {DocumentMetadata} metadata1 - First document metadata
 * @param {DocumentMetadata} metadata2 - Second document metadata
 * @returns {MetadataComparisonResult} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareMetadata(doc1Metadata, doc2Metadata);
 * console.log('Identical:', comparison.identical);
 * console.log('Differences:', comparison.differences);
 * ```
 */
export declare const compareMetadata: (metadata1: DocumentMetadata, metadata2: DocumentMetadata) => MetadataComparisonResult;
/**
 * 33. Finds duplicate documents based on metadata.
 *
 * @param {DocumentMetadata[]} metadataList - Array of document metadata
 * @param {string[]} [compareFields] - Fields to compare for duplicates
 * @returns {Array<DocumentMetadata[]>} Groups of duplicate documents
 *
 * @example
 * ```typescript
 * const duplicates = findDuplicatesByMetadata(allMetadata, ['title', 'author', 'creationDate']);
 * console.log(`Found ${duplicates.length} duplicate groups`);
 * ```
 */
export declare const findDuplicatesByMetadata: (metadataList: DocumentMetadata[], compareFields?: string[]) => Array<DocumentMetadata[]>;
/**
 * 34. Exports metadata to specified format.
 *
 * @param {DocumentMetadata | DocumentMetadata[]} metadata - Metadata to export
 * @param {MetadataExportFormat} format - Export format
 * @returns {string} Serialized metadata
 *
 * @example
 * ```typescript
 * const json = exportMetadata(metadata, 'json');
 * const xml = exportMetadata(metadata, 'xml');
 * const csv = exportMetadata([meta1, meta2], 'csv');
 * ```
 */
export declare const exportMetadata: (metadata: DocumentMetadata | DocumentMetadata[], format: MetadataExportFormat) => string;
/**
 * 35. Calculates metadata hash for change detection.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @returns {string} SHA-256 hash of metadata
 *
 * @example
 * ```typescript
 * const hash = calculateMetadataHash(metadata);
 * // Store hash to detect future changes
 * ```
 */
export declare const calculateMetadataHash: (metadata: DocumentMetadata) => string;
/**
 * 36. Creates metadata snapshot for versioning.
 *
 * @param {DocumentMetadata} metadata - Current metadata
 * @param {string} [comment] - Version comment
 * @returns {Object} Metadata snapshot with version info
 *
 * @example
 * ```typescript
 * const snapshot = createMetadataSnapshot(metadata, 'Updated author information');
 * ```
 */
export declare const createMetadataSnapshot: (metadata: DocumentMetadata, comment?: string) => {
    version: number;
    timestamp: Date;
    hash: string;
    metadata: DocumentMetadata;
    comment?: string;
};
/**
 * 37. Generates metadata summary for display.
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {number} [maxLength] - Maximum summary length
 * @returns {string} Human-readable metadata summary
 *
 * @example
 * ```typescript
 * const summary = generateMetadataSummary(metadata, 200);
 * console.log(summary);
 * // "Medical Report by Dr. Smith, created 2024-01-01, 15 pages, PDF format"
 * ```
 */
export declare const generateMetadataSummary: (metadata: DocumentMetadata, maxLength?: number) => string;
/**
 * 38. Enriches metadata with additional information.
 *
 * @param {DocumentMetadata} metadata - Base metadata
 * @param {Object} enrichmentData - Additional data to enrich with
 * @returns {Promise<DocumentMetadata>} Enriched metadata
 *
 * @example
 * ```typescript
 * const enriched = await enrichMetadata(metadata, {
 *   department: 'Radiology',
 *   location: 'Main Hospital',
 *   classification: 'Confidential'
 * });
 * ```
 */
export declare const enrichMetadata: (metadata: DocumentMetadata, enrichmentData: Record<string, any>) => Promise<DocumentMetadata>;
/**
 * Creates mock document metadata for testing.
 *
 * @param {Partial<DocumentMetadata>} [overrides] - Property overrides
 * @returns {DocumentMetadata} Mock metadata
 *
 * @example
 * ```typescript
 * const mockMetadata = createMockMetadata({
 *   title: 'Test Document',
 *   author: 'Test Author'
 * });
 * ```
 */
export declare const createMockMetadata: (overrides?: Partial<DocumentMetadata>) => DocumentMetadata;
/**
 * Creates mock XMP metadata for testing.
 *
 * @param {Partial<XMPMetadata>} [overrides] - Property overrides
 * @returns {XMPMetadata} Mock XMP metadata
 */
export declare const createMockXMPMetadata: (overrides?: Partial<XMPMetadata>) => XMPMetadata;
/**
 * Creates mock metadata template for testing.
 *
 * @param {Partial<MetadataTemplate>} [overrides] - Property overrides
 * @returns {MetadataTemplate} Mock template
 */
export declare const createMockMetadataTemplate: (overrides?: Partial<MetadataTemplate>) => MetadataTemplate;
declare const _default: {
    extractPDFMetadata: (pdfBuffer: Buffer, options?: MetadataExtractionOptions) => Promise<DocumentMetadata>;
    extractImageMetadata: (imageBuffer: Buffer, format: string) => Promise<DocumentMetadata>;
    extractOfficeMetadata: (docBuffer: Buffer, format: string) => Promise<DocumentMetadata>;
    extractGenericMetadata: (fileBuffer: Buffer, mimeType: string) => Promise<DocumentMetadata>;
    extractAllMetadata: (documentBuffer: Buffer, format: string, options?: MetadataExtractionOptions) => Promise<DocumentMetadata>;
    extractXMPMetadata: (documentBuffer: Buffer) => Promise<XMPMetadata | null>;
    setXMPMetadata: (documentBuffer: Buffer, xmpData: XMPMetadata) => Promise<Buffer>;
    updateXMPMetadata: (documentBuffer: Buffer, updates: Partial<XMPMetadata>) => Promise<Buffer>;
    removeXMPMetadata: (documentBuffer: Buffer) => Promise<Buffer>;
    validateXMPMetadata: (xmpData: XMPMetadata) => MetadataValidationResult;
    extractDublinCoreMetadata: (documentBuffer: Buffer) => Promise<DublinCoreMetadata | null>;
    convertXMPToDublinCore: (xmpData: XMPMetadata) => DublinCoreMetadata;
    convertDublinCoreToXMP: (dcData: DublinCoreMetadata) => XMPMetadata;
    setDublinCoreMetadata: (documentBuffer: Buffer, dcData: DublinCoreMetadata) => Promise<Buffer>;
    getCustomProperty: (metadata: Record<string, any>, key: string, namespace?: string) => any;
    setCustomProperty: (metadata: Record<string, any>, property: CustomMetadataProperty) => Record<string, any>;
    removeCustomProperty: (metadata: Record<string, any>, key: string, namespace?: string) => Record<string, any>;
    listCustomProperties: (metadata: Record<string, any>) => CustomMetadataProperty[];
    batchUpdateMetadata: (operation: BatchMetadataOperation) => Promise<BatchOperationResult>;
    copyMetadataToDocuments: (sourceDocumentId: string, targetDocumentIds: string[], fields?: string[]) => Promise<BatchOperationResult>;
    mergeMetadata: (metadataSources: DocumentMetadata[], options?: {
        priority?: "first" | "last";
        conflictResolution?: "overwrite" | "merge" | "skip";
    }) => DocumentMetadata;
    bulkImportMetadata: (data: any[], format: MetadataExportFormat) => Promise<MetadataImportResult>;
    createMetadataTemplate: (template: Omit<MetadataTemplate, "id">) => Promise<MetadataTemplate>;
    applyMetadataTemplate: (metadata: DocumentMetadata, template: MetadataTemplate) => DocumentMetadata;
    validateAgainstTemplate: (metadata: DocumentMetadata, template: MetadataTemplate) => MetadataValidationResult;
    getMetadataTemplate: (identifier: string) => Promise<MetadataTemplate | null>;
    listMetadataTemplates: (filters?: {
        category?: string;
        isDefault?: boolean;
    }) => Promise<MetadataTemplate[]>;
    validateMetadata: (metadata: DocumentMetadata, rules?: MetadataValidationRules) => MetadataValidationResult;
    validateMetadataCompleteness: (metadata: DocumentMetadata, threshold?: number) => {
        complete: boolean;
        percentage: number;
        missingFields: string[];
    };
    sanitizeMetadata: (metadata: DocumentMetadata, options?: {
        removeEmpty?: boolean;
        removeSensitive?: boolean;
        maxStringLength?: number;
    }) => DocumentMetadata;
    searchByMetadata: (criteria: MetadataSearchCriteria) => Promise<DocumentMetadata[]>;
    compareMetadata: (metadata1: DocumentMetadata, metadata2: DocumentMetadata) => MetadataComparisonResult;
    findDuplicatesByMetadata: (metadataList: DocumentMetadata[], compareFields?: string[]) => Array<DocumentMetadata[]>;
    exportMetadata: (metadata: DocumentMetadata | DocumentMetadata[], format: MetadataExportFormat) => string;
    calculateMetadataHash: (metadata: DocumentMetadata) => string;
    createMetadataSnapshot: (metadata: DocumentMetadata, comment?: string) => {
        version: number;
        timestamp: Date;
        hash: string;
        metadata: DocumentMetadata;
        comment?: string;
    };
    generateMetadataSummary: (metadata: DocumentMetadata, maxLength?: number) => string;
    enrichMetadata: (metadata: DocumentMetadata, enrichmentData: Record<string, any>) => Promise<DocumentMetadata>;
    createMockMetadata: (overrides?: Partial<DocumentMetadata>) => DocumentMetadata;
    createMockXMPMetadata: (overrides?: Partial<XMPMetadata>) => XMPMetadata;
    createMockMetadataTemplate: (overrides?: Partial<MetadataTemplate>) => MetadataTemplate;
    createDocumentMetadataModel: (sequelize: Sequelize) => any;
    createMetadataTemplateModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-metadata-kit.d.ts.map