/**
 * LOC: DATAIMEX1234567
 * File: /reuse/data-import-export-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - csv-parse (CSV parsing)
 *   - csv-stringify (CSV generation)
 *   - xlsx (Excel file handling)
 *   - xml2js (XML parsing and building)
 *   - fast-xml-parser (Fast XML processing)
 *   - ajv (JSON schema validation)
 *   - papaparse (CSV parsing alternative)
 *   - json-2-csv (JSON to CSV conversion)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS import/export controllers
 *   - Data migration services
 *   - ETL pipeline services
 *   - Report generation services
 *   - Bulk data processors
 */
/**
 * File: /reuse/data-import-export-kit.prod.ts
 * Locator: WC-UTL-DATAIMEX-001
 * Purpose: Comprehensive Data Import/Export Kit - Complete toolkit for CSV, Excel, JSON, XML data operations
 *
 * Upstream: Independent utility module for data import/export, transformation, and validation operations
 * Downstream: ../backend/*, Import services, Export services, ETL pipelines, Report generators, Data migration tools
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/platform-express, csv-parse, csv-stringify,
 *               xlsx, xml2js, fast-xml-parser, ajv, zod, sequelize, multer, stream
 * Exports: 47 utility functions for CSV parsing/generation, Excel read/write, JSON/XML transformation,
 *          data mapping and validation, batch import/export, streaming operations, progress tracking,
 *          error recovery, template generation, column mapping, data normalization
 *
 * LLM Context: Enterprise-grade data import/export utilities for White Cross healthcare platform.
 * Provides comprehensive CSV parsing with delimiter detection, Excel file reading and writing with
 * multiple sheet support, JSON/XML bidirectional transformation, schema-based data validation,
 * intelligent column mapping with fuzzy matching, batch import with transaction support, streaming
 * exports for large datasets, real-time progress tracking, automatic error recovery with rollback,
 * template generation for import files, data normalization and cleansing, format conversion pipelines,
 * HIPAA-compliant data handling with encryption, audit logging, and data lineage tracking.
 * Includes Sequelize models for import jobs, export tasks, data mappings, and transformation rules.
 */
import { StreamableFile } from '@nestjs/common';
import { Model, Sequelize, ModelStatic } from 'sequelize';
import { Readable } from 'stream';
import { Response } from 'express';
/**
 * Supported file formats for import/export operations.
 */
export type DataFormat = 'csv' | 'xlsx' | 'json' | 'xml' | 'tsv' | 'parquet';
/**
 * Import job status enumeration.
 */
export type ImportJobStatus = 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'partial';
/**
 * Export task status enumeration.
 */
export type ExportTaskStatus = 'pending' | 'generating' | 'ready' | 'expired' | 'failed';
/**
 * Data mapping strategy types.
 */
export type MappingStrategy = 'exact' | 'fuzzy' | 'transform' | 'computed' | 'lookup';
/**
 * Error handling strategy for import operations.
 */
export type ErrorStrategy = 'abort' | 'skip' | 'quarantine' | 'fix' | 'prompt';
/**
 * CSV parsing options configuration.
 */
export interface CSVParseOptions {
    delimiter?: string;
    quote?: string;
    escape?: string;
    encoding?: BufferEncoding;
    skipEmptyLines?: boolean;
    skipHeader?: boolean;
    trimFields?: boolean;
    maxRows?: number;
    comment?: string;
    relaxColumnCount?: boolean;
    castNumbers?: boolean;
    castDates?: boolean;
    columns?: string[] | boolean;
    fromLine?: number;
    toLine?: number;
    detectDelimiter?: boolean;
}
/**
 * CSV generation options configuration.
 */
export interface CSVGenerateOptions {
    delimiter?: string;
    quote?: string;
    escape?: string;
    header?: boolean;
    columns?: string[] | Array<{
        key: string;
        header: string;
    }>;
    recordDelimiter?: string;
    quoteAll?: boolean;
    encoding?: BufferEncoding;
    bom?: boolean;
}
/**
 * Excel file read options.
 */
export interface ExcelReadOptions {
    sheetName?: string;
    sheetIndex?: number;
    range?: string;
    header?: boolean;
    raw?: boolean;
    defval?: any;
    dateNF?: string;
    cellDates?: boolean;
    cellFormula?: boolean;
    cellHTML?: boolean;
    cellStyles?: boolean;
    skipHidden?: boolean;
    blankRows?: boolean;
}
/**
 * Excel file write options.
 */
export interface ExcelWriteOptions {
    sheetName?: string;
    header?: boolean;
    skipHeader?: boolean;
    columns?: Array<{
        header: string;
        key: string;
        width?: number;
    }>;
    dateFormat?: string;
    numberFormat?: string;
    compression?: boolean;
    password?: string;
    bookType?: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv';
    cellStyles?: boolean;
    autoFilter?: boolean;
    freezePane?: {
        row: number;
        col: number;
    };
}
/**
 * JSON transformation options.
 */
export interface JSONTransformOptions {
    pretty?: boolean;
    indent?: number;
    sortKeys?: boolean;
    replacer?: (key: string, value: any) => any;
    space?: string | number;
    removeNull?: boolean;
    removeFalsy?: boolean;
    flattenArrays?: boolean;
    unflattenArrays?: boolean;
    dateFormat?: 'iso' | 'timestamp' | 'string';
}
/**
 * XML parsing and generation options.
 */
export interface XMLOptions {
    rootName?: string;
    declaration?: boolean;
    encoding?: string;
    indent?: string;
    attributePrefix?: string;
    textNodeName?: string;
    ignoreAttributes?: boolean;
    ignoreNamespace?: boolean;
    parseTagValue?: boolean;
    parseAttributeValue?: boolean;
    trimValues?: boolean;
    cdataTagName?: string;
    commentPropName?: string;
    processEntities?: boolean;
    stopNodes?: string[];
    arrayMode?: boolean | RegExp;
}
/**
 * Column mapping configuration for data transformation.
 */
export interface ColumnMapping {
    source: string;
    target: string;
    strategy: MappingStrategy;
    transformer?: (value: any, row: any) => any;
    validator?: (value: any) => boolean;
    defaultValue?: any;
    required?: boolean;
    unique?: boolean;
    lookupTable?: Map<any, any> | Record<string, any>;
    fuzzyThreshold?: number;
    computeFrom?: string[];
}
/**
 * Data validation rule configuration.
 */
export interface ValidationRule {
    field: string;
    type?: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'uuid';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any, row: any) => boolean | string;
    message?: string;
}
/**
 * Import configuration for batch operations.
 */
export interface ImportConfig {
    format: DataFormat;
    mapping?: ColumnMapping[];
    validation?: ValidationRule[];
    batchSize?: number;
    skipRows?: number;
    maxRows?: number;
    errorStrategy?: ErrorStrategy;
    useTransaction?: boolean;
    onProgress?: (progress: ImportProgress) => void;
    onError?: (error: ImportError) => void;
    dryRun?: boolean;
    deduplicate?: boolean;
    deduplicateBy?: string[];
    upsert?: boolean;
    upsertKeys?: string[];
    parallelism?: number;
}
/**
 * Export configuration for data extraction.
 */
export interface ExportConfig {
    format: DataFormat;
    columns?: string[] | ColumnMapping[];
    filters?: Record<string, any>;
    sort?: Array<{
        field: string;
        order: 'asc' | 'desc';
    }>;
    limit?: number;
    offset?: number;
    streaming?: boolean;
    chunkSize?: number;
    compression?: boolean;
    encryption?: {
        enabled: boolean;
        algorithm?: string;
        password?: string;
    };
    includeMetadata?: boolean;
    onProgress?: (progress: ExportProgress) => void;
}
/**
 * Import progress tracking information.
 */
export interface ImportProgress {
    jobId: string;
    status: ImportJobStatus;
    totalRows: number;
    processedRows: number;
    validRows: number;
    invalidRows: number;
    skippedRows: number;
    errorRows: number;
    percentComplete: number;
    startTime: Date;
    currentTime: Date;
    estimatedTimeRemaining?: number;
    throughput?: number;
    errors?: ImportError[];
}
/**
 * Export progress tracking information.
 */
export interface ExportProgress {
    taskId: string;
    status: ExportTaskStatus;
    totalRows: number;
    exportedRows: number;
    percentComplete: number;
    startTime: Date;
    currentTime: Date;
    estimatedTimeRemaining?: number;
    fileSize?: number;
    throughput?: number;
}
/**
 * Import error details.
 */
export interface ImportError {
    row: number;
    field?: string;
    value?: any;
    message: string;
    code?: string;
    severity: 'error' | 'warning' | 'info';
    recoverable: boolean;
    suggestion?: string;
}
/**
 * Data mapping result with statistics.
 */
export interface MappingResult {
    mapped: Record<string, any>;
    unmapped: string[];
    warnings: string[];
    confidence: number;
    suggestions?: Array<{
        source: string;
        target: string;
        score: number;
    }>;
}
/**
 * Template generation options.
 */
export interface TemplateOptions {
    format: DataFormat;
    fields: Array<{
        name: string;
        type: string;
        required?: boolean;
        example?: any;
        description?: string;
    }>;
    includeExamples?: boolean;
    exampleRows?: number;
    includeInstructions?: boolean;
    customHeaders?: Record<string, string>;
}
/**
 * Data normalization options.
 */
export interface NormalizationOptions {
    trimStrings?: boolean;
    lowercaseStrings?: boolean;
    uppercaseStrings?: boolean;
    removeExtraSpaces?: boolean;
    normalizeLineEndings?: boolean;
    normalizeEncoding?: BufferEncoding;
    parseNumbers?: boolean;
    parseDates?: boolean;
    dateFormat?: string;
    removeNulls?: boolean;
    removeEmpty?: boolean;
    stripHtml?: boolean;
    decodeHtmlEntities?: boolean;
    normalizePhoneNumbers?: boolean;
    normalizeEmails?: boolean;
    customNormalizers?: Record<string, (value: any) => any>;
}
/**
 * Batch import result with detailed statistics.
 */
export interface BatchImportResult {
    jobId: string;
    status: ImportJobStatus;
    totalRows: number;
    successRows: number;
    failedRows: number;
    skippedRows: number;
    duration: number;
    throughput: number;
    errors: ImportError[];
    warnings: string[];
    importedIds?: string[];
    summary?: Record<string, any>;
}
/**
 * Batch export result with file information.
 */
export interface BatchExportResult {
    taskId: string;
    status: ExportTaskStatus;
    totalRows: number;
    exportedRows: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    format: DataFormat;
    duration: number;
    downloadUrl?: string;
    expiresAt?: Date;
}
/**
 * Delimiter detection result.
 */
export interface DelimiterDetectionResult {
    delimiter: string;
    confidence: number;
    rowCount: number;
    columnCount: number;
    alternatives?: Array<{
        delimiter: string;
        confidence: number;
    }>;
}
/**
 * Schema inference result for automatic mapping.
 */
export interface SchemaInferenceResult {
    fields: Array<{
        name: string;
        type: string;
        nullable: boolean;
        unique?: boolean;
        example?: any;
        distribution?: Record<string, number>;
    }>;
    rowCount: number;
    columnCount: number;
    sampleData?: any[];
    suggestions?: string[];
}
/**
 * Zod schema for CSV parsing options validation.
 */
export declare const CSVParseOptionsSchema: any;
/**
 * Zod schema for CSV generation options validation.
 */
export declare const CSVGenerateOptionsSchema: any;
/**
 * Zod schema for Excel read options validation.
 */
export declare const ExcelReadOptionsSchema: any;
/**
 * Zod schema for Excel write options validation.
 */
export declare const ExcelWriteOptionsSchema: any;
/**
 * Zod schema for import configuration validation.
 */
export declare const ImportConfigSchema: any;
/**
 * Zod schema for export configuration validation.
 */
export declare const ExportConfigSchema: any;
/**
 * Zod schema for column mapping validation.
 */
export declare const ColumnMappingSchema: any;
/**
 * Sequelize model definition for Import Job tracking.
 * Tracks all data import operations with comprehensive metadata and progress.
 *
 * @example
 * ```typescript
 * const job = await ImportJobModel.create({
 *   fileName: 'patients_import.csv',
 *   format: 'csv',
 *   status: 'pending',
 *   totalRows: 0,
 *   createdBy: 'user-123',
 * });
 * ```
 */
export declare const defineImportJobModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Sequelize model definition for Export Task tracking.
 * Tracks all data export operations with file generation and download management.
 *
 * @example
 * ```typescript
 * const task = await ExportTaskModel.create({
 *   name: 'Patient Report Export',
 *   format: 'xlsx',
 *   status: 'pending',
 *   createdBy: 'user-123',
 * });
 * ```
 */
export declare const defineExportTaskModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Sequelize model definition for Data Mapping configurations.
 * Stores reusable column mapping configurations for data transformations.
 *
 * @example
 * ```typescript
 * const mapping = await DataMappingModel.create({
 *   name: 'Patient CSV Mapping',
 *   sourceFormat: 'csv',
 *   targetEntity: 'Patient',
 *   mappings: [...],
 *   createdBy: 'user-123',
 * });
 * ```
 */
export declare const defineDataMappingModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Sequelize model definition for Import Error Log.
 * Stores detailed error information for failed import rows.
 *
 * @example
 * ```typescript
 * const error = await ImportErrorModel.create({
 *   importJobId: 'job-123',
 *   rowNumber: 42,
 *   errorCode: 'VALIDATION_ERROR',
 *   message: 'Invalid email format',
 * });
 * ```
 */
export declare const defineImportErrorModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Define associations between import/export models.
 *
 * @example
 * ```typescript
 * defineImportExportAssociations(sequelize, {
 *   ImportJob: ImportJobModel,
 *   ExportTask: ExportTaskModel,
 *   DataMapping: DataMappingModel,
 *   ImportError: ImportErrorModel,
 * });
 * ```
 */
export declare const defineImportExportAssociations: (sequelize: Sequelize, models: {
    ImportJob: ModelStatic<Model>;
    ExportTask: ModelStatic<Model>;
    DataMapping: ModelStatic<Model>;
    ImportError: ModelStatic<Model>;
}) => void;
/**
 * Automatically detect the delimiter used in a CSV file.
 * Analyzes the first few lines to determine the most likely delimiter.
 *
 * @param filePath - Path to the CSV file
 * @param sampleSize - Number of lines to sample for detection (default: 10)
 * @returns Delimiter detection result with confidence score
 *
 * @example
 * ```typescript
 * const result = await detectCSVDelimiter('/path/to/file.csv');
 * console.log(`Detected delimiter: ${result.delimiter} (${result.confidence * 100}% confidence)`);
 * ```
 */
export declare function detectCSVDelimiter(filePath: string, sampleSize?: number): Promise<DelimiterDetectionResult>;
/**
 * Parse CSV file with comprehensive options and validation.
 * Supports delimiter detection, type casting, and custom transformations.
 *
 * @param filePath - Path to the CSV file
 * @param options - CSV parsing options
 * @returns Parsed CSV data as array of objects
 *
 * @example
 * ```typescript
 * const data = await parseCSVFile('/path/to/patients.csv', {
 *   delimiter: ',',
 *   castNumbers: true,
 *   castDates: true,
 *   trimFields: true,
 * });
 * console.log(`Parsed ${data.length} rows`);
 * ```
 */
export declare function parseCSVFile(filePath: string, options?: CSVParseOptions): Promise<any[]>;
/**
 * Generate CSV file from data array with comprehensive formatting options.
 *
 * @param data - Array of objects to export
 * @param filePath - Output file path
 * @param options - CSV generation options
 * @returns Promise resolving when file is written
 *
 * @example
 * ```typescript
 * await generateCSVFile(patients, '/path/to/export.csv', {
 *   columns: ['id', 'name', 'email', 'createdAt'],
 *   header: true,
 *   delimiter: ',',
 * });
 * ```
 */
export declare function generateCSVFile(data: any[], filePath: string, options?: CSVGenerateOptions): Promise<void>;
/**
 * Create a streaming CSV parser for processing large files.
 * Memory-efficient for files that don't fit in RAM.
 *
 * @param filePath - Path to CSV file
 * @param options - CSV parsing options
 * @returns Readable stream of parsed objects
 *
 * @example
 * ```typescript
 * const stream = createCSVParserStream('/path/to/large.csv');
 * for await (const row of stream) {
 *   await processRow(row);
 * }
 * ```
 */
export declare function createCSVParserStream(filePath: string, options?: CSVParseOptions): Readable;
/**
 * Read Excel file with support for multiple sheets and advanced options.
 * Can read specific sheets, ranges, and apply formatting.
 *
 * @param filePath - Path to Excel file
 * @param options - Excel read options
 * @returns Parsed Excel data
 *
 * @example
 * ```typescript
 * const data = await readExcelFile('/path/to/workbook.xlsx', {
 *   sheetName: 'Patients',
 *   header: true,
 *   cellDates: true,
 * });
 * ```
 */
export declare function readExcelFile(filePath: string, options?: ExcelReadOptions): Promise<any[]>;
/**
 * Write data to Excel file with multiple sheet support and formatting.
 *
 * @param data - Data to write (object for multiple sheets, array for single sheet)
 * @param filePath - Output file path
 * @param options - Excel write options
 * @returns Promise resolving when file is written
 *
 * @example
 * ```typescript
 * await writeExcelFile(
 *   { Patients: patients, Appointments: appointments },
 *   '/path/to/export.xlsx',
 *   { compression: true, autoFilter: true }
 * );
 * ```
 */
export declare function writeExcelFile(data: any[] | Record<string, any[]>, filePath: string, options?: ExcelWriteOptions): Promise<void>;
/**
 * Get metadata about an Excel file (sheets, row counts, column names).
 *
 * @param filePath - Path to Excel file
 * @returns Excel file metadata
 *
 * @example
 * ```typescript
 * const metadata = await getExcelMetadata('/path/to/workbook.xlsx');
 * console.log(`Sheets: ${metadata.sheets.join(', ')}`);
 * ```
 */
export declare function getExcelMetadata(filePath: string): Promise<{
    sheets: string[];
    sheetInfo: Array<{
        name: string;
        rowCount: number;
        columnCount: number;
        columns: string[];
    }>;
}>;
/**
 * Transform JSON data with advanced options (flattening, sorting, filtering).
 *
 * @param data - JSON data to transform
 * @param options - Transformation options
 * @returns Transformed JSON data
 *
 * @example
 * ```typescript
 * const transformed = transformJSON(data, {
 *   pretty: true,
 *   sortKeys: true,
 *   removeNull: true,
 *   dateFormat: 'iso',
 * });
 * ```
 */
export declare function transformJSON(data: any, options?: JSONTransformOptions): any;
/**
 * Convert JSON to CSV format.
 *
 * @param data - JSON array to convert
 * @param options - CSV generation options
 * @returns CSV string
 *
 * @example
 * ```typescript
 * const csv = jsonToCSV(patients, { header: true, delimiter: ',' });
 * ```
 */
export declare function jsonToCSV(data: any[], options?: CSVGenerateOptions): string;
/**
 * Convert CSV to JSON format.
 *
 * @param csv - CSV string to parse
 * @param options - CSV parsing options
 * @returns JSON array
 *
 * @example
 * ```typescript
 * const json = csvToJSON(csvString, { delimiter: ',', trimFields: true });
 * ```
 */
export declare function csvToJSON(csv: string, options?: CSVParseOptions): any[];
/**
 * Convert JSON to XML format.
 *
 * @param data - JSON data to convert
 * @param options - XML generation options
 * @returns XML string
 *
 * @example
 * ```typescript
 * const xml = jsonToXML({ patients: patientsArray }, { rootName: 'data', indent: '  ' });
 * ```
 */
export declare function jsonToXML(data: any, options?: XMLOptions): string;
/**
 * Convert XML to JSON format.
 *
 * @param xml - XML string to parse
 * @param options - XML parsing options
 * @returns JSON data
 *
 * @example
 * ```typescript
 * const json = xmlToJSON(xmlString, { ignoreAttributes: false, parseTagValue: true });
 * ```
 */
export declare function xmlToJSON(xml: string, options?: XMLOptions): any;
/**
 * Apply column mappings to transform source data to target schema.
 *
 * @param data - Source data array
 * @param mappings - Column mapping configurations
 * @returns Mapped data with transformation results
 *
 * @example
 * ```typescript
 * const result = await applyColumnMappings(sourceData, [
 *   { source: 'first_name', target: 'firstName', strategy: 'exact' },
 *   { source: 'DOB', target: 'dateOfBirth', strategy: 'transform', transformer: parseDate },
 * ]);
 * ```
 */
export declare function applyColumnMappings(data: any[], mappings: ColumnMapping[]): Promise<{
    data: any[];
    warnings: string[];
}>;
/**
 * Validate data against validation rules.
 *
 * @param data - Data array to validate
 * @param rules - Validation rules
 * @returns Validation result with errors
 *
 * @example
 * ```typescript
 * const result = validateData(patients, [
 *   { field: 'email', type: 'email', required: true },
 *   { field: 'age', type: 'number', min: 0, max: 150 },
 * ]);
 * ```
 */
export declare function validateData(data: any[], rules: ValidationRule[]): {
    isValid: boolean;
    errors: ImportError[];
};
/**
 * Automatically infer schema from sample data.
 * Analyzes data types, nullability, uniqueness, and distributions.
 *
 * @param data - Sample data array
 * @param sampleSize - Number of rows to analyze (default: all)
 * @returns Inferred schema information
 *
 * @example
 * ```typescript
 * const schema = inferSchema(sampleData);
 * console.log(`Detected ${schema.fields.length} fields`);
 * ```
 */
export declare function inferSchema(data: any[], sampleSize?: number): SchemaInferenceResult;
/**
 * Generate fuzzy column mapping suggestions.
 * Uses string similarity to suggest mappings between source and target columns.
 *
 * @param sourceColumns - Source column names
 * @param targetColumns - Target column names
 * @param threshold - Similarity threshold (0-1, default: 0.7)
 * @returns Mapping suggestions with confidence scores
 *
 * @example
 * ```typescript
 * const suggestions = generateMappingSuggestions(
 *   ['first_name', 'last_name', 'DOB'],
 *   ['firstName', 'lastName', 'dateOfBirth'],
 *   0.7
 * );
 * ```
 */
export declare function generateMappingSuggestions(sourceColumns: string[], targetColumns: string[], threshold?: number): Array<{
    source: string;
    target: string;
    score: number;
}>;
/**
 * Perform batch import with transaction support, validation, and progress tracking.
 *
 * @param data - Data array to import
 * @param config - Import configuration
 * @param targetModel - Sequelize model to import into
 * @param sequelize - Sequelize instance for transactions
 * @returns Import result with statistics
 *
 * @example
 * ```typescript
 * const result = await batchImport(patients, {
 *   format: 'csv',
 *   batchSize: 1000,
 *   errorStrategy: 'skip',
 *   useTransaction: true,
 * }, PatientModel, sequelize);
 * ```
 */
export declare function batchImport(data: any[], config: ImportConfig, targetModel: ModelStatic<Model>, sequelize: Sequelize): Promise<BatchImportResult>;
/**
 * Perform batch export with streaming support and progress tracking.
 *
 * @param query - Sequelize query options
 * @param config - Export configuration
 * @param outputPath - Output file path
 * @param sourceModel - Sequelize model to export from
 * @returns Export result with file information
 *
 * @example
 * ```typescript
 * const result = await batchExport(
 *   { where: { active: true }, order: [['createdAt', 'DESC']] },
 *   { format: 'xlsx', streaming: true, chunkSize: 1000 },
 *   '/exports/patients.xlsx',
 *   PatientModel
 * );
 * ```
 */
export declare function batchExport(query: any, config: ExportConfig, outputPath: string, sourceModel: ModelStatic<Model>): Promise<BatchExportResult>;
/**
 * Generate import template file with example data and instructions.
 *
 * @param options - Template generation options
 * @param outputPath - Output file path
 * @returns Promise resolving when template is generated
 *
 * @example
 * ```typescript
 * await generateImportTemplate({
 *   format: 'xlsx',
 *   fields: [
 *     { name: 'firstName', type: 'string', required: true, example: 'John' },
 *     { name: 'lastName', type: 'string', required: true, example: 'Doe' },
 *     { name: 'email', type: 'email', required: true, example: 'john@example.com' },
 *   ],
 *   includeExamples: true,
 *   exampleRows: 3,
 * }, '/templates/patient_import.xlsx');
 * ```
 */
export declare function generateImportTemplate(options: TemplateOptions, outputPath: string): Promise<void>;
/**
 * Normalize data with various cleansing and standardization options.
 *
 * @param data - Data array to normalize
 * @param options - Normalization options
 * @returns Normalized data
 *
 * @example
 * ```typescript
 * const normalized = normalizeData(rawData, {
 *   trimStrings: true,
 *   removeExtraSpaces: true,
 *   parseNumbers: true,
 *   parseDates: true,
 *   normalizePhoneNumbers: true,
 *   normalizeEmails: true,
 * });
 * ```
 */
export declare function normalizeData(data: any[], options?: NormalizationOptions): any[];
/**
 * NestJS service for data import/export operations.
 * Provides high-level methods for importing and exporting data.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PatientService {
 *   constructor(private readonly importExportService: DataImportExportService) {}
 *
 *   async importPatients(file: Express.Multer.File) {
 *     return this.importExportService.importData(
 *       file.path,
 *       { format: 'csv', batchSize: 500 },
 *       this.patientModel,
 *       this.sequelize
 *     );
 *   }
 * }
 * ```
 */
export declare class DataImportExportService {
    private readonly sequelize;
    private readonly importJobModel;
    private readonly exportTaskModel;
    private readonly dataMappingModel;
    private readonly importErrorModel;
    private readonly logger;
    constructor(sequelize: Sequelize, importJobModel: ModelStatic<Model>, exportTaskModel: ModelStatic<Model>, dataMappingModel: ModelStatic<Model>, importErrorModel: ModelStatic<Model>);
    /**
     * Import data from file with validation and progress tracking.
     */
    importData(filePath: string, config: ImportConfig, targetModel: ModelStatic<Model>, userId?: string): Promise<BatchImportResult>;
    /**
     * Export data to file with streaming support.
     */
    exportData(query: any, config: ExportConfig, sourceModel: ModelStatic<Model>, userId?: string): Promise<BatchExportResult>;
}
/**
 * API request DTO for import operations.
 */
declare class ImportRequestDto {
    format: DataFormat;
    mappingId?: string;
    batchSize?: number;
    errorStrategy?: ErrorStrategy;
}
/**
 * API request DTO for export operations.
 */
declare class ExportRequestDto {
    format: DataFormat;
    filters?: Record<string, any>;
    columns?: string[];
    limit?: number;
}
/**
 * NestJS controller for data import/export endpoints.
 * Provides REST API for file upload, import/export operations, and progress tracking.
 *
 * @example
 * ```typescript
 * POST /api/import/patients - Upload and import patient data
 * GET /api/export/patients - Export patient data
 * GET /api/import/jobs/:id - Get import job status
 * GET /api/export/tasks/:id/download - Download exported file
 * ```
 */
export declare class DataImportExportController {
    private readonly importExportService;
    private readonly logger;
    constructor(importExportService: DataImportExportService);
    /**
     * Upload and import data file.
     */
    importFile(file: Express.Multer.File, dto: ImportRequestDto): Promise<BatchImportResult>;
    /**
     * Export data to file.
     */
    exportData(dto: ExportRequestDto): Promise<BatchExportResult>;
    /**
     * Get import job status.
     */
    getImportJobStatus(id: string): Promise<any>;
    /**
     * Download exported file.
     */
    downloadExport(id: string, res: Response): Promise<void>;
    /**
     * Generate import template.
     */
    generateTemplate(dto: TemplateOptions): Promise<StreamableFile>;
}
export { DataFormat, ImportJobStatus, ExportTaskStatus, MappingStrategy, ErrorStrategy, CSVParseOptions, CSVGenerateOptions, ExcelReadOptions, ExcelWriteOptions, JSONTransformOptions, XMLOptions, ColumnMapping, ValidationRule, ImportConfig, ExportConfig, ImportProgress, ExportProgress, ImportError, MappingResult, TemplateOptions, NormalizationOptions, BatchImportResult, BatchExportResult, DelimiterDetectionResult, SchemaInferenceResult, defineImportJobModel, defineExportTaskModel, defineDataMappingModel, defineImportErrorModel, defineImportExportAssociations, detectCSVDelimiter, parseCSVFile, generateCSVFile, createCSVParserStream, readExcelFile, writeExcelFile, getExcelMetadata, transformJSON, jsonToCSV, csvToJSON, jsonToXML, xmlToJSON, applyColumnMappings, validateData, inferSchema, generateMappingSuggestions, batchImport, batchExport, generateImportTemplate, normalizeData, DataImportExportService, DataImportExportController, ImportRequestDto, ExportRequestDto, };
//# sourceMappingURL=data-import-export-kit.prod.d.ts.map