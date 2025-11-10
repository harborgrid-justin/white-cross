/**
 * LOC: DOCASMGEN001
 * File: /reuse/document/composites/document-assembly-generation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - handlebars
 *   - mustache
 *   - crypto (Node.js built-in)
 *   - pdf-lib
 *   - docx
 *   - ../document-assembly-kit
 *   - ../document-templates-kit
 *   - ../document-data-extraction-kit
 *   - ../document-pdf-advanced-kit
 *   - ../document-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Document generation services
 *   - Template management modules
 *   - Report generation engines
 *   - Healthcare document automation
 *   - Contract assembly systems
 *   - Medical report generators
 */
/**
 * File: /reuse/document/composites/document-assembly-generation-composite.ts
 * Locator: WC-ASSEMBLY-GENERATION-COMPOSITE-001
 * Purpose: Comprehensive Document Assembly & Generation Composite - Production-ready template assembly, merge fields, dynamic generation
 *
 * Upstream: Composed from document-assembly-kit, document-templates-kit, document-data-extraction-kit, document-pdf-advanced-kit, document-automation-kit
 * Downstream: ../backend/*, Document generators, Template services, Report engines, Automation handlers, Assembly systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, handlebars 4.x, pdf-lib 1.17.x, docx 8.x
 * Exports: 50 utility functions for template assembly, merge fields, conditional content, dynamic tables, formulas, versioning, automation
 *
 * LLM Context: Enterprise-grade document assembly and generation composite for White Cross healthcare platform.
 * Provides comprehensive document generation capabilities including advanced template management exceeding Adobe
 * Acrobat capabilities: dynamic merge fields with data binding, conditional content rendering based on business
 * rules, dynamic table generation from datasets, formula calculations (medical scoring, financial, statistical),
 * template versioning with diff tracking, multi-format support (PDF, DOCX, HTML, Markdown), nested template
 * composition, real-time field validation, expression evaluation, data transformation pipelines, batch generation,
 * audit trails, and HIPAA-compliant document assembly. Essential for automated generation of medical reports,
 * patient forms, insurance claims, consent documents, regulatory filings, lab reports, discharge summaries, and
 * prescriptions. Composes functions from assembly, templates, data-extraction, PDF-advanced, and automation kits
 * to provide unified document generation operations for healthcare document workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * Template format types
 */
export declare enum TemplateFormat {
    PDF = "PDF",
    DOCX = "DOCX",
    HTML = "HTML",
    MARKDOWN = "MARKDOWN",
    XML = "XML",
    JSON = "JSON",
    PLAIN_TEXT = "PLAIN_TEXT"
}
/**
 * Merge field data types
 */
export declare enum MergeFieldType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME",
    CURRENCY = "CURRENCY",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    URL = "URL",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
    IMAGE = "IMAGE",
    SIGNATURE = "SIGNATURE"
}
/**
 * Conditional operator types
 */
export declare enum ConditionalOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    IS_EMPTY = "IS_EMPTY",
    IS_NOT_EMPTY = "IS_NOT_EMPTY",
    MATCHES = "MATCHES",
    IN = "IN",
    NOT_IN = "NOT_IN"
}
/**
 * Formula function types
 */
export declare enum FormulaFunction {
    SUM = "SUM",
    AVG = "AVG",
    COUNT = "COUNT",
    MIN = "MIN",
    MAX = "MAX",
    IF = "IF",
    CONCAT = "CONCAT",
    DATE_DIFF = "DATE_DIFF",
    FORMAT = "FORMAT",
    ROUND = "ROUND",
    CUSTOM = "CUSTOM"
}
/**
 * Generation status
 */
export declare enum GenerationStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
/**
 * Merge field definition
 */
export interface MergeField {
    id: string;
    name: string;
    type: MergeFieldType;
    label: string;
    defaultValue?: any;
    required: boolean;
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        message?: string;
    };
    metadata?: Record<string, any>;
}
/**
 * Conditional content rule
 */
export interface ConditionalRule {
    field: string;
    operator: ConditionalOperator;
    value: any;
    content: string;
    elseContent?: string;
}
/**
 * Formula calculation
 */
export interface FormulaCalculation {
    id: string;
    expression: string;
    function: FormulaFunction;
    variables: Record<string, string>;
    format?: string;
    precision?: number;
}
/**
 * Template configuration
 */
export interface TemplateConfig {
    id: string;
    name: string;
    description?: string;
    format: TemplateFormat;
    content: string;
    mergeFields: MergeField[];
    conditionalRules: ConditionalRule[];
    formulas: FormulaCalculation[];
    version: number;
    isPublished: boolean;
    metadata?: Record<string, any>;
}
/**
 * Document generation request
 */
export interface GenerationRequest {
    id: string;
    templateId: string;
    data: Record<string, any>;
    format: TemplateFormat;
    options?: GenerationOptions;
    requestedBy: string;
    status: GenerationStatus;
}
/**
 * Generation options
 */
export interface GenerationOptions {
    includeMetadata?: boolean;
    watermark?: string;
    passwordProtect?: string;
    permissions?: string[];
    compress?: boolean;
    embedFonts?: boolean;
    quality?: 'low' | 'medium' | 'high';
}
/**
 * Generated document
 */
export interface GeneratedDocument {
    id: string;
    requestId: string;
    templateId: string;
    format: TemplateFormat;
    content: Buffer;
    size: number;
    pageCount?: number;
    generatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Dynamic table configuration
 */
export interface DynamicTable {
    id: string;
    columns: TableColumn[];
    dataSource: string;
    formatting?: TableFormatting;
}
/**
 * Table column definition
 */
export interface TableColumn {
    field: string;
    header: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    format?: string;
}
/**
 * Table formatting options
 */
export interface TableFormatting {
    headerBackgroundColor?: string;
    alternateRowColors?: boolean;
    borderStyle?: 'solid' | 'dashed' | 'none';
    fontSize?: number;
}
/**
 * Template version history
 */
export interface TemplateVersion {
    id: string;
    templateId: string;
    version: number;
    content: string;
    changedBy: string;
    changedAt: Date;
    changeDescription?: string;
    diff?: string;
}
/**
 * Batch generation request
 */
export interface BatchGenerationRequest {
    id: string;
    templateId: string;
    dataSet: Array<Record<string, any>>;
    format: TemplateFormat;
    totalItems: number;
    processedItems: number;
    status: GenerationStatus;
}
/**
 * Template Model
 * Stores template configurations
 */
export declare class TemplateModel extends Model {
    id: string;
    name: string;
    description?: string;
    format: TemplateFormat;
    content: string;
    mergeFields: MergeField[];
    conditionalRules: ConditionalRule[];
    formulas: FormulaCalculation[];
    version: number;
    isPublished: boolean;
    metadata?: Record<string, any>;
}
/**
 * Generation Request Model
 * Stores document generation requests
 */
export declare class GenerationRequestModel extends Model {
    id: string;
    templateId: string;
    data: Record<string, any>;
    format: TemplateFormat;
    options?: GenerationOptions;
    requestedBy: string;
    status: GenerationStatus;
    errorMessage?: string;
}
/**
 * Generated Document Model
 * Stores generated document metadata
 */
export declare class GeneratedDocumentModel extends Model {
    id: string;
    requestId: string;
    templateId: string;
    format: TemplateFormat;
    storagePath: string;
    size: number;
    pageCount?: number;
    generatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Creates document template with merge fields and conditional logic.
 * Supports complex template structures with nested content.
 *
 * @param {string} name - Template name
 * @param {TemplateFormat} format - Template format
 * @param {string} content - Template content with placeholders
 * @param {MergeField[]} mergeFields - Merge field definitions
 * @returns {Promise<TemplateConfig>} Created template
 *
 * @example
 * REST API: POST /api/v1/templates
 * Request:
 * {
 *   "name": "Patient Discharge Summary",
 *   "format": "PDF",
 *   "content": "Patient: {{patientName}}\nDOB: {{dateOfBirth}}",
 *   "mergeFields": [{
 *     "name": "patientName",
 *     "type": "STRING",
 *     "required": true
 *   }]
 * }
 * Response: 201 Created
 * {
 *   "id": "tpl_uuid",
 *   "name": "Patient Discharge Summary",
 *   "version": 1
 * }
 */
export declare const createDocumentTemplate: (name: string, format: TemplateFormat, content: string, mergeFields: MergeField[]) => Promise<TemplateConfig>;
/**
 * Adds merge field to template.
 *
 * @param {string} templateId - Template identifier
 * @param {MergeField} field - Merge field definition
 * @returns {Promise<void>}
 */
export declare const addMergeField: (templateId: string, field: MergeField) => Promise<void>;
/**
 * Removes merge field from template.
 *
 * @param {string} templateId - Template identifier
 * @param {string} fieldId - Field identifier
 * @returns {Promise<void>}
 */
export declare const removeMergeField: (templateId: string, fieldId: string) => Promise<void>;
/**
 * Adds conditional content rule to template.
 *
 * @param {string} templateId - Template identifier
 * @param {ConditionalRule} rule - Conditional rule
 * @returns {Promise<void>}
 */
export declare const addConditionalRule: (templateId: string, rule: ConditionalRule) => Promise<void>;
/**
 * Evaluates conditional rule against data.
 *
 * @param {ConditionalRule} rule - Conditional rule
 * @param {Record<string, any>} data - Merge data
 * @returns {boolean} Whether condition is met
 */
export declare const evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
/**
 * Merges data into template.
 *
 * @param {TemplateConfig} template - Template configuration
 * @param {Record<string, any>} data - Merge data
 * @returns {string} Merged content
 */
export declare const mergeTemplateData: (template: TemplateConfig, data: Record<string, any>) => string;
/**
 * Generates document from template.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} data - Merge data
 * @param {string} requestedBy - Requester user ID
 * @param {GenerationOptions} options - Generation options
 * @returns {Promise<GeneratedDocument>} Generated document
 */
export declare const generateDocument: (templateId: string, data: Record<string, any>, requestedBy: string, options?: GenerationOptions) => Promise<GeneratedDocument>;
/**
 * Validates merge field data.
 *
 * @param {MergeField} field - Merge field definition
 * @param {any} value - Field value
 * @returns {string | null} Validation error message or null
 */
export declare const validateMergeFieldData: (field: MergeField, value: any) => string | null;
/**
 * Validates all merge data against template.
 *
 * @param {TemplateConfig} template - Template configuration
 * @param {Record<string, any>} data - Merge data
 * @returns {string[]} Validation errors
 */
export declare const validateTemplateData: (template: TemplateConfig, data: Record<string, any>) => string[];
/**
 * Calculates formula expression.
 *
 * @param {FormulaCalculation} formula - Formula configuration
 * @param {Record<string, any>} data - Data for variables
 * @returns {any} Calculated result
 */
export declare const calculateFormula: (formula: FormulaCalculation, data: Record<string, any>) => any;
/**
 * Generates dynamic table from data.
 *
 * @param {DynamicTable} table - Table configuration
 * @param {Record<string, any>} data - Data containing array for table
 * @returns {string} HTML table markup
 */
export declare const generateDynamicTable: (table: DynamicTable, data: Record<string, any>) => string;
/**
 * Versions template with change tracking.
 *
 * @param {string} templateId - Template identifier
 * @param {string} changedBy - User making changes
 * @param {string} changeDescription - Change description
 * @returns {Promise<TemplateVersion>} Version record
 */
export declare const versionTemplate: (templateId: string, changedBy: string, changeDescription?: string) => Promise<TemplateVersion>;
/**
 * Retrieves template version history.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<TemplateVersion[]>} Version history
 */
export declare const getTemplateVersionHistory: (templateId: string) => Promise<TemplateVersion[]>;
/**
 * Reverts template to previous version.
 *
 * @param {string} templateId - Template identifier
 * @param {number} version - Version to revert to
 * @returns {Promise<void>}
 */
export declare const revertTemplateVersion: (templateId: string, version: number) => Promise<void>;
/**
 * Compares two template versions.
 *
 * @param {string} templateId - Template identifier
 * @param {number} version1 - First version
 * @param {number} version2 - Second version
 * @returns {Promise<string>} Diff output
 */
export declare const compareTemplateVersions: (templateId: string, version1: number, version2: number) => Promise<string>;
/**
 * Publishes template for use.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<void>}
 */
export declare const publishTemplate: (templateId: string) => Promise<void>;
/**
 * Unpublishes template.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<void>}
 */
export declare const unpublishTemplate: (templateId: string) => Promise<void>;
/**
 * Clones template with new name.
 *
 * @param {string} templateId - Template identifier
 * @param {string} newName - New template name
 * @returns {Promise<TemplateConfig>} Cloned template
 */
export declare const cloneTemplate: (templateId: string, newName: string) => Promise<TemplateConfig>;
/**
 * Archives old template.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<void>}
 */
export declare const archiveTemplate: (templateId: string) => Promise<void>;
/**
 * Generates batch documents from data set.
 *
 * @param {string} templateId - Template identifier
 * @param {Array<Record<string, any>>} dataSet - Array of merge data
 * @param {string} requestedBy - Requester user ID
 * @returns {Promise<BatchGenerationRequest>} Batch request
 */
export declare const generateBatchDocuments: (templateId: string, dataSet: Array<Record<string, any>>, requestedBy: string) => Promise<BatchGenerationRequest>;
/**
 * Retrieves batch generation status.
 *
 * @param {string} batchId - Batch request identifier
 * @returns {Promise<BatchGenerationRequest>} Batch status
 */
export declare const getBatchGenerationStatus: (batchId: string) => Promise<BatchGenerationRequest>;
/**
 * Cancels batch generation.
 *
 * @param {string} batchId - Batch request identifier
 * @returns {Promise<void>}
 */
export declare const cancelBatchGeneration: (batchId: string) => Promise<void>;
/**
 * Converts document format.
 *
 * @param {Buffer} content - Document content
 * @param {TemplateFormat} fromFormat - Source format
 * @param {TemplateFormat} toFormat - Target format
 * @returns {Promise<Buffer>} Converted content
 */
export declare const convertDocumentFormat: (content: Buffer, fromFormat: TemplateFormat, toFormat: TemplateFormat) => Promise<Buffer>;
/**
 * Applies watermark to document.
 *
 * @param {Buffer} content - Document content
 * @param {string} watermarkText - Watermark text
 * @returns {Promise<Buffer>} Watermarked content
 */
export declare const applyWatermark: (content: Buffer, watermarkText: string) => Promise<Buffer>;
/**
 * Protects document with password.
 *
 * @param {Buffer} content - Document content
 * @param {string} password - Protection password
 * @returns {Promise<Buffer>} Protected content
 */
export declare const protectDocument: (content: Buffer, password: string) => Promise<Buffer>;
/**
 * Compresses document for smaller size.
 *
 * @param {Buffer} content - Document content
 * @param {string} quality - Compression quality
 * @returns {Promise<Buffer>} Compressed content
 */
export declare const compressDocument: (content: Buffer, quality: "low" | "medium" | "high") => Promise<Buffer>;
/**
 * Generates document preview image.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} sampleData - Sample data for preview
 * @returns {Promise<Buffer>} Preview image
 */
export declare const generateDocumentPreview: (templateId: string, sampleData: Record<string, any>) => Promise<Buffer>;
/**
 * Validates template syntax.
 *
 * @param {string} content - Template content
 * @returns {string[]} Validation errors
 */
export declare const validateTemplateSyntax: (content: string) => string[];
/**
 * Extracts merge fields from template content.
 *
 * @param {string} content - Template content
 * @returns {string[]} Field names
 */
export declare const extractMergeFields: (content: string) => string[];
/**
 * Applies template formatting rules.
 *
 * @param {string} content - Content to format
 * @param {Record<string, any>} formatting - Formatting rules
 * @returns {string} Formatted content
 */
export declare const applyTemplateFormatting: (content: string, formatting: Record<string, any>) => string;
/**
 * Generates template from existing document.
 *
 * @param {Buffer} document - Source document
 * @param {TemplateFormat} format - Document format
 * @returns {Promise<TemplateConfig>} Extracted template
 */
export declare const extractTemplateFromDocument: (document: Buffer, format: TemplateFormat) => Promise<TemplateConfig>;
/**
 * Merges multiple templates into one.
 *
 * @param {string[]} templateIds - Template identifiers
 * @param {string} name - New template name
 * @returns {Promise<TemplateConfig>} Merged template
 */
export declare const mergeTemplates: (templateIds: string[], name: string) => Promise<TemplateConfig>;
/**
 * Generates template usage analytics.
 *
 * @param {string} templateId - Template identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Usage analytics
 */
export declare const getTemplateUsageAnalytics: (templateId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Schedules recurring document generation.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} data - Merge data
 * @param {string} schedule - Cron schedule
 * @returns {Promise<string>} Scheduled job ID
 */
export declare const scheduleDocumentGeneration: (templateId: string, data: Record<string, any>, schedule: string) => Promise<string>;
/**
 * Cancels scheduled generation.
 *
 * @param {string} jobId - Scheduled job identifier
 * @returns {Promise<void>}
 */
export declare const cancelScheduledGeneration: (jobId: string) => Promise<void>;
/**
 * Exports template to file.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<Buffer>} Exported template file
 */
export declare const exportTemplate: (templateId: string) => Promise<Buffer>;
/**
 * Imports template from file.
 *
 * @param {Buffer} templateFile - Template file content
 * @returns {Promise<TemplateConfig>} Imported template
 */
export declare const importTemplate: (templateFile: Buffer) => Promise<TemplateConfig>;
/**
 * Generates sample data for template testing.
 *
 * @param {TemplateConfig} template - Template configuration
 * @returns {Record<string, any>} Sample data
 */
export declare const generateSampleData: (template: TemplateConfig) => Record<string, any>;
/**
 * Optimizes template for performance.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<void>}
 */
export declare const optimizeTemplate: (templateId: string) => Promise<void>;
/**
 * Retrieves generation request status.
 *
 * @param {string} requestId - Request identifier
 * @returns {Promise<GenerationRequest>} Request status
 */
export declare const getGenerationStatus: (requestId: string) => Promise<GenerationRequest>;
/**
 * Downloads generated document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Buffer>} Document content
 */
export declare const downloadGeneratedDocument: (documentId: string) => Promise<Buffer>;
/**
 * Deletes generated document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<void>}
 */
export declare const deleteGeneratedDocument: (documentId: string) => Promise<void>;
/**
 * Retrieves template by ID.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<TemplateConfig>} Template configuration
 */
export declare const getTemplateById: (templateId: string) => Promise<TemplateConfig>;
/**
 * Searches templates by criteria.
 *
 * @param {Record<string, any>} criteria - Search criteria
 * @returns {Promise<TemplateConfig[]>} Matching templates
 */
export declare const searchTemplates: (criteria: Record<string, any>) => Promise<TemplateConfig[]>;
/**
 * Generates document generation report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Generation report
 */
export declare const generateGenerationReport: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Validates document against template schema.
 *
 * @param {Buffer} document - Document content
 * @param {string} templateId - Template identifier
 * @returns {Promise<boolean>} Whether document is valid
 */
export declare const validateDocumentAgainstTemplate: (document: Buffer, templateId: string) => Promise<boolean>;
/**
 * Document Assembly Service
 * Production-ready NestJS service for document assembly and generation
 */
export declare class DocumentAssemblyService {
    /**
     * Creates template
     */
    createTemplate(name: string, format: TemplateFormat, content: string, mergeFields: MergeField[]): Promise<TemplateConfig>;
    /**
     * Generates document
     */
    generate(templateId: string, data: Record<string, any>, requestedBy: string): Promise<GeneratedDocument>;
}
declare const _default: {
    TemplateModel: typeof TemplateModel;
    GenerationRequestModel: typeof GenerationRequestModel;
    GeneratedDocumentModel: typeof GeneratedDocumentModel;
    createDocumentTemplate: (name: string, format: TemplateFormat, content: string, mergeFields: MergeField[]) => Promise<TemplateConfig>;
    addMergeField: (templateId: string, field: MergeField) => Promise<void>;
    removeMergeField: (templateId: string, fieldId: string) => Promise<void>;
    addConditionalRule: (templateId: string, rule: ConditionalRule) => Promise<void>;
    evaluateConditionalRule: (rule: ConditionalRule, data: Record<string, any>) => boolean;
    mergeTemplateData: (template: TemplateConfig, data: Record<string, any>) => string;
    generateDocument: (templateId: string, data: Record<string, any>, requestedBy: string, options?: GenerationOptions) => Promise<GeneratedDocument>;
    validateMergeFieldData: (field: MergeField, value: any) => string | null;
    validateTemplateData: (template: TemplateConfig, data: Record<string, any>) => string[];
    calculateFormula: (formula: FormulaCalculation, data: Record<string, any>) => any;
    generateDynamicTable: (table: DynamicTable, data: Record<string, any>) => string;
    versionTemplate: (templateId: string, changedBy: string, changeDescription?: string) => Promise<TemplateVersion>;
    getTemplateVersionHistory: (templateId: string) => Promise<TemplateVersion[]>;
    revertTemplateVersion: (templateId: string, version: number) => Promise<void>;
    compareTemplateVersions: (templateId: string, version1: number, version2: number) => Promise<string>;
    publishTemplate: (templateId: string) => Promise<void>;
    unpublishTemplate: (templateId: string) => Promise<void>;
    cloneTemplate: (templateId: string, newName: string) => Promise<TemplateConfig>;
    archiveTemplate: (templateId: string) => Promise<void>;
    generateBatchDocuments: (templateId: string, dataSet: Array<Record<string, any>>, requestedBy: string) => Promise<BatchGenerationRequest>;
    getBatchGenerationStatus: (batchId: string) => Promise<BatchGenerationRequest>;
    cancelBatchGeneration: (batchId: string) => Promise<void>;
    convertDocumentFormat: (content: Buffer, fromFormat: TemplateFormat, toFormat: TemplateFormat) => Promise<Buffer>;
    applyWatermark: (content: Buffer, watermarkText: string) => Promise<Buffer>;
    protectDocument: (content: Buffer, password: string) => Promise<Buffer>;
    compressDocument: (content: Buffer, quality: "low" | "medium" | "high") => Promise<Buffer>;
    generateDocumentPreview: (templateId: string, sampleData: Record<string, any>) => Promise<Buffer>;
    validateTemplateSyntax: (content: string) => string[];
    extractMergeFields: (content: string) => string[];
    applyTemplateFormatting: (content: string, formatting: Record<string, any>) => string;
    extractTemplateFromDocument: (document: Buffer, format: TemplateFormat) => Promise<TemplateConfig>;
    mergeTemplates: (templateIds: string[], name: string) => Promise<TemplateConfig>;
    getTemplateUsageAnalytics: (templateId: string, startDate: Date, endDate: Date) => Promise<any>;
    scheduleDocumentGeneration: (templateId: string, data: Record<string, any>, schedule: string) => Promise<string>;
    cancelScheduledGeneration: (jobId: string) => Promise<void>;
    exportTemplate: (templateId: string) => Promise<Buffer>;
    importTemplate: (templateFile: Buffer) => Promise<TemplateConfig>;
    generateSampleData: (template: TemplateConfig) => Record<string, any>;
    optimizeTemplate: (templateId: string) => Promise<void>;
    getGenerationStatus: (requestId: string) => Promise<GenerationRequest>;
    downloadGeneratedDocument: (documentId: string) => Promise<Buffer>;
    deleteGeneratedDocument: (documentId: string) => Promise<void>;
    getTemplateById: (templateId: string) => Promise<TemplateConfig>;
    searchTemplates: (criteria: Record<string, any>) => Promise<TemplateConfig[]>;
    generateGenerationReport: (startDate: Date, endDate: Date) => Promise<any>;
    validateDocumentAgainstTemplate: (document: Buffer, templateId: string) => Promise<boolean>;
    DocumentAssemblyService: typeof DocumentAssemblyService;
};
export default _default;
//# sourceMappingURL=document-assembly-generation-composite.d.ts.map