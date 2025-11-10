/**
 * LOC: DEIX1234567
 * File: /reuse/data-export-import-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - csv-parser, csv-writer (CSV processing)
 *   - exceljs (Excel processing)
 *   - xml2js (XML processing)
 *   - pdfkit (PDF generation)
 *   - archiver (compression)
 *   - stream (Node.js streaming)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers for export/import endpoints
 *   - Service layer for data operations
 *   - Background job processors
 *   - Report generation services
 */
/**
 * File: /reuse/data-export-import-kit.ts
 * Locator: WC-UTL-DEIX-001
 * Purpose: Data Export/Import Kit - Comprehensive utilities for data export, import, and transformation
 *
 * Upstream: Sequelize ORM, csv-parser, exceljs, xml2js, pdfkit, archiver, Node.js streams
 * Downstream: ../backend/*, ../services/*, API endpoints, background jobs, report services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, exceljs 4.x, csv-parser 3.x
 * Exports: 45 utility functions for CSV, Excel, JSON, XML, PDF export/import with streaming, validation, and job management
 *
 * LLM Context: Comprehensive data export/import utilities for White Cross healthcare system.
 * Provides CSV/Excel/JSON/XML/PDF export with streaming for large datasets, import with validation
 * and error handling, bulk operations with batching, data transformation, job scheduling, compression,
 * and template-based exports. Essential for data migration, reporting, and system integration.
 */
import { ModelStatic, Sequelize, FindOptions, Transaction } from 'sequelize';
import { Readable, Transform, Writable } from 'stream';
/**
 * Export format types
 */
export type ExportFormat = 'csv' | 'excel' | 'json' | 'xml' | 'pdf';
/**
 * Import format types
 */
export type ImportFormat = 'csv' | 'excel' | 'json' | 'xml';
/**
 * Job status types
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
/**
 * CSV export options
 */
export interface CsvExportOptions {
    delimiter?: string;
    quote?: string;
    escape?: string;
    headers?: string[];
    includeHeader?: boolean;
    encoding?: BufferEncoding;
    bom?: boolean;
}
/**
 * Excel export options
 */
export interface ExcelExportOptions {
    sheetName?: string;
    columns?: ExcelColumnDefinition[];
    includeHeader?: boolean;
    autoFilter?: boolean;
    freezeHeader?: boolean;
    styling?: ExcelStyling;
}
/**
 * Excel column definition
 */
export interface ExcelColumnDefinition {
    key: string;
    header: string;
    width?: number;
    style?: any;
}
/**
 * Excel styling options
 */
export interface ExcelStyling {
    headerFont?: {
        bold?: boolean;
        size?: number;
        color?: string;
    };
    headerFill?: {
        type: string;
        pattern: string;
        fgColor: string;
    };
    alternateRows?: boolean;
}
/**
 * JSON export options
 */
export interface JsonExportOptions {
    pretty?: boolean;
    indent?: number;
    streaming?: boolean;
    rootKey?: string;
    includeMetadata?: boolean;
}
/**
 * XML export options
 */
export interface XmlExportOptions {
    rootElement?: string;
    recordElement?: string;
    declaration?: boolean;
    pretty?: boolean;
    indent?: string;
}
/**
 * PDF export options
 */
export interface PdfExportOptions {
    title?: string;
    author?: string;
    orientation?: 'portrait' | 'landscape';
    pageSize?: string;
    margins?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    header?: PdfHeaderFooter;
    footer?: PdfHeaderFooter;
    styling?: PdfStyling;
}
/**
 * PDF header/footer configuration
 */
export interface PdfHeaderFooter {
    content: string | ((pageNumber: number, pageCount: number) => string);
    height?: number;
    font?: {
        size: number;
        color?: string;
    };
}
/**
 * PDF styling options
 */
export interface PdfStyling {
    titleFont?: {
        size: number;
        color?: string;
    };
    headerFont?: {
        size: number;
        color?: string;
    };
    bodyFont?: {
        size: number;
        color?: string;
    };
    tableHeader?: {
        fillColor?: string;
        textColor?: string;
    };
    alternateRows?: boolean;
}
/**
 * Export job configuration
 */
export interface ExportJobConfig {
    format: ExportFormat;
    model: ModelStatic<any>;
    query?: FindOptions;
    filePath: string;
    options?: any;
    compress?: boolean;
    chunkSize?: number;
    transform?: (record: any) => any;
    userId?: number;
    metadata?: Record<string, any>;
}
/**
 * Import job configuration
 */
export interface ImportJobConfig {
    format: ImportFormat;
    model: ModelStatic<any>;
    filePath: string;
    options?: any;
    validate?: (record: any) => Promise<boolean | string>;
    transform?: (record: any) => any;
    batchSize?: number;
    skipErrors?: boolean;
    userId?: number;
    metadata?: Record<string, any>;
}
/**
 * Export job result
 */
export interface ExportJobResult {
    jobId: string;
    status: JobStatus;
    recordCount: number;
    filePath: string;
    fileSize: number;
    duration: number;
    errors?: ExportError[];
}
/**
 * Import job result
 */
export interface ImportJobResult {
    jobId: string;
    status: JobStatus;
    recordsProcessed: number;
    recordsImported: number;
    recordsFailed: number;
    duration: number;
    errors?: ImportError[];
}
/**
 * Export error details
 */
export interface ExportError {
    recordIndex: number;
    record?: any;
    error: string;
    timestamp: Date;
}
/**
 * Import error details
 */
export interface ImportError {
    row: number;
    record?: any;
    error: string;
    validationErrors?: string[];
    timestamp: Date;
}
/**
 * Data mapping configuration
 */
export interface DataMapping {
    sourceField: string;
    targetField: string;
    transform?: (value: any) => any;
    defaultValue?: any;
    required?: boolean;
}
/**
 * Streaming export options
 */
export interface StreamingExportOptions {
    highWaterMark?: number;
    encoding?: BufferEncoding;
    objectMode?: boolean;
}
/**
 * Compression options
 */
export interface CompressionOptions {
    format?: 'zip' | 'gzip';
    level?: number;
    comment?: string;
}
/**
 * Template export configuration
 */
export interface TemplateExportConfig {
    templatePath: string;
    data: any;
    outputPath: string;
    format: ExportFormat;
    variables?: Record<string, any>;
}
/**
 * Pagination options for exports
 */
export interface ExportPaginationOptions {
    page: number;
    limit: number;
    totalRecords?: number;
}
/**
 * Export Jobs model definition
 */
export declare const defineExportJobsModel: (sequelize: Sequelize) => any;
/**
 * Import Jobs model definition
 */
export declare const defineImportJobsModel: (sequelize: Sequelize) => any;
/**
 * Data Mappings model definition
 */
export declare const defineDataMappingsModel: (sequelize: Sequelize) => any;
/**
 * Exports data to CSV format with streaming support for large datasets.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @returns {Promise<ExportJobResult>} Export job result with file information
 *
 * @example
 * ```typescript
 * const result = await exportToCsv({
 *   format: 'csv',
 *   model: Patient,
 *   query: { where: { status: 'active' } },
 *   filePath: '/exports/patients.csv',
 *   options: { includeHeader: true, delimiter: ',' },
 *   chunkSize: 1000,
 * });
 * console.log(`Exported ${result.recordCount} records to ${result.filePath}`);
 * ```
 */
export declare const exportToCsv: (config: ExportJobConfig) => Promise<ExportJobResult>;
/**
 * Creates a streaming CSV export that processes data in chunks.
 *
 * @param {ModelStatic<any>} model - Sequelize model to export
 * @param {FindOptions} query - Query options for filtering data
 * @param {CsvExportOptions} options - CSV formatting options
 * @returns {Readable} Readable stream of CSV data
 *
 * @example
 * ```typescript
 * const stream = createCsvExportStream(Patient,
 *   { where: { createdAt: { [Op.gte]: lastMonth } } },
 *   { delimiter: ',' }
 * );
 * stream.pipe(res); // Pipe to HTTP response
 * ```
 */
export declare const createCsvExportStream: (model: ModelStatic<any>, query: FindOptions, options?: CsvExportOptions) => Readable;
/**
 * Parses CSV headers from a file.
 *
 * @param {string} filePath - Path to CSV file
 * @param {CsvExportOptions} options - CSV parsing options
 * @returns {Promise<string[]>} Array of header names
 *
 * @example
 * ```typescript
 * const headers = await parseCsvHeaders('/uploads/data.csv');
 * console.log('CSV columns:', headers);
 * ```
 */
export declare const parseCsvHeaders: (filePath: string, options?: CsvExportOptions) => Promise<string[]>;
/**
 * Imports data from CSV file with validation and error handling.
 *
 * @param {ImportJobConfig} config - Import configuration
 * @returns {Promise<ImportJobResult>} Import job result with statistics
 *
 * @example
 * ```typescript
 * const result = await importFromCsv({
 *   format: 'csv',
 *   model: Patient,
 *   filePath: '/uploads/patients.csv',
 *   validate: async (record) => {
 *     return record.email && record.firstName;
 *   },
 *   batchSize: 500,
 *   skipErrors: true,
 * });
 * console.log(`Imported ${result.recordsImported}/${result.recordsProcessed} records`);
 * ```
 */
export declare const importFromCsv: (config: ImportJobConfig) => Promise<ImportJobResult>;
/**
 * Validates CSV file structure and data quality.
 *
 * @param {string} filePath - Path to CSV file
 * @param {Object} schema - Expected schema definition
 * @param {CsvExportOptions} options - CSV parsing options
 * @returns {Promise<{valid: boolean, errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCsvFile('/uploads/data.csv', {
 *   requiredColumns: ['email', 'firstName', 'lastName'],
 *   columnTypes: { email: 'email', age: 'number' },
 * });
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateCsvFile: (filePath: string, schema: {
    requiredColumns?: string[];
    columnTypes?: Record<string, string>;
}, options?: CsvExportOptions) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Exports data to Excel (XLSX) format with styling and formatting.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @returns {Promise<ExportJobResult>} Export job result
 *
 * @example
 * ```typescript
 * const result = await exportToExcel({
 *   format: 'excel',
 *   model: Patient,
 *   filePath: '/exports/patients.xlsx',
 *   options: {
 *     sheetName: 'Patients',
 *     columns: [
 *       { key: 'id', header: 'ID', width: 10 },
 *       { key: 'firstName', header: 'First Name', width: 20 },
 *       { key: 'lastName', header: 'Last Name', width: 20 },
 *     ],
 *     freezeHeader: true,
 *     autoFilter: true,
 *   },
 * });
 * ```
 */
export declare const exportToExcel: (config: ExportJobConfig) => Promise<ExportJobResult>;
/**
 * Creates multi-sheet Excel workbook from multiple datasets.
 *
 * @param {Array<{name: string, model: ModelStatic<any>, query?: FindOptions}>} sheets - Sheet configurations
 * @param {string} filePath - Output file path
 * @param {ExcelExportOptions} options - Global Excel options
 * @returns {Promise<ExportJobResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await createMultiSheetExcel([
 *   { name: 'Patients', model: Patient, query: { where: { status: 'active' } } },
 *   { name: 'Appointments', model: Appointment, query: { where: { date: today } } },
 * ], '/exports/report.xlsx');
 * ```
 */
export declare const createMultiSheetExcel: (sheets: Array<{
    name: string;
    model: ModelStatic<any>;
    query?: FindOptions;
    options?: ExcelExportOptions;
}>, filePath: string, globalOptions?: ExcelExportOptions) => Promise<ExportJobResult>;
/**
 * Parses Excel file and extracts data from specified sheet.
 *
 * @param {string} filePath - Path to Excel file
 * @param {string} sheetName - Name of sheet to parse (default: first sheet)
 * @returns {Promise<any[]>} Array of parsed records
 *
 * @example
 * ```typescript
 * const records = await parseExcelFile('/uploads/data.xlsx', 'Patients');
 * console.log(`Parsed ${records.length} records from Excel`);
 * ```
 */
export declare const parseExcelFile: (filePath: string, sheetName?: string) => Promise<any[]>;
/**
 * Exports data to JSON format with pagination support.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @returns {Promise<ExportJobResult>} Export job result
 *
 * @example
 * ```typescript
 * const result = await exportToJson({
 *   format: 'json',
 *   model: Patient,
 *   query: { where: { status: 'active' } },
 *   filePath: '/exports/patients.json',
 *   options: { pretty: true, indent: 2, rootKey: 'patients' },
 * });
 * ```
 */
export declare const exportToJson: (config: ExportJobConfig) => Promise<ExportJobResult>;
/**
 * Creates streaming JSON export for large datasets.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {FindOptions} query - Query options
 * @param {JsonExportOptions} options - JSON export options
 * @returns {Readable} Readable stream of JSON data
 *
 * @example
 * ```typescript
 * const stream = createJsonExportStream(Patient,
 *   { where: { status: 'active' } },
 *   { pretty: true }
 * );
 * stream.pipe(res);
 * ```
 */
export declare const createJsonExportStream: (model: ModelStatic<any>, query: FindOptions, options?: JsonExportOptions) => Readable;
/**
 * Exports paginated JSON data with metadata.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {FindOptions} query - Query options
 * @param {ExportPaginationOptions} pagination - Pagination configuration
 * @param {string} filePath - Output file path
 * @returns {Promise<ExportJobResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportPaginatedJson(
 *   Patient,
 *   { where: { status: 'active' } },
 *   { page: 1, limit: 100 },
 *   '/exports/patients-page1.json'
 * );
 * ```
 */
export declare const exportPaginatedJson: (model: ModelStatic<any>, query: FindOptions, pagination: ExportPaginationOptions, filePath: string) => Promise<ExportJobResult>;
/**
 * Exports data to XML format.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @returns {Promise<ExportJobResult>} Export job result
 *
 * @example
 * ```typescript
 * const result = await exportToXml({
 *   format: 'xml',
 *   model: Patient,
 *   filePath: '/exports/patients.xml',
 *   options: {
 *     rootElement: 'patients',
 *     recordElement: 'patient',
 *     pretty: true,
 *   },
 * });
 * ```
 */
export declare const exportToXml: (config: ExportJobConfig) => Promise<ExportJobResult>;
/**
 * Parses XML file and converts to JSON objects.
 *
 * @param {string} filePath - Path to XML file
 * @param {XmlExportOptions} options - XML parsing options
 * @returns {Promise<any[]>} Array of parsed records
 *
 * @example
 * ```typescript
 * const records = await parseXmlFile('/uploads/data.xml', {
 *   recordElement: 'patient',
 * });
 * ```
 */
export declare const parseXmlFile: (filePath: string, options?: XmlExportOptions) => Promise<any[]>;
/**
 * Generates PDF report from data with custom styling.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @returns {Promise<ExportJobResult>} Export job result
 *
 * @example
 * ```typescript
 * const result = await generatePdfReport({
 *   format: 'pdf',
 *   model: Patient,
 *   filePath: '/exports/patients-report.pdf',
 *   options: {
 *     title: 'Patient Report',
 *     orientation: 'landscape',
 *     pageSize: 'A4',
 *   },
 * });
 * ```
 */
export declare const generatePdfReport: (config: ExportJobConfig) => Promise<ExportJobResult>;
/**
 * Creates PDF with custom template and layout.
 *
 * @param {TemplateExportConfig} config - Template configuration
 * @returns {Promise<string>} Path to generated PDF
 *
 * @example
 * ```typescript
 * const pdfPath = await createTemplatedPdf({
 *   templatePath: '/templates/invoice.html',
 *   data: invoiceData,
 *   outputPath: '/exports/invoice-123.pdf',
 *   format: 'pdf',
 *   variables: { companyName: 'White Cross' },
 * });
 * ```
 */
export declare const createTemplatedPdf: (config: TemplateExportConfig) => Promise<string>;
/**
 * Performs bulk data import with batching and transaction support.
 *
 * @param {ModelStatic<any>} model - Target Sequelize model
 * @param {any[]} records - Records to import
 * @param {Object} options - Import options
 * @returns {Promise<ImportJobResult>} Import result with statistics
 *
 * @example
 * ```typescript
 * const result = await bulkImportWithBatching(Patient, patientRecords, {
 *   batchSize: 500,
 *   validate: true,
 *   useTransaction: true,
 * });
 * console.log(`Imported ${result.recordsImported} records in ${result.duration}ms`);
 * ```
 */
export declare const bulkImportWithBatching: (model: ModelStatic<any>, records: any[], options?: {
    batchSize?: number;
    validate?: boolean;
    useTransaction?: boolean;
    updateOnDuplicate?: string[];
}) => Promise<ImportJobResult>;
/**
 * Imports data with automatic rollback on error.
 *
 * @param {ImportJobConfig} config - Import configuration
 * @param {Transaction} transaction - Optional external transaction
 * @returns {Promise<ImportJobResult>} Import result
 *
 * @example
 * ```typescript
 * const result = await importWithRollback({
 *   format: 'json',
 *   model: Patient,
 *   filePath: '/uploads/patients.json',
 *   batchSize: 100,
 * });
 * // All records rolled back if any batch fails
 * ```
 */
export declare const importWithRollback: (config: ImportJobConfig, transaction?: Transaction) => Promise<ImportJobResult>;
/**
 * Applies data mapping configuration to transform records.
 *
 * @param {any} record - Source record
 * @param {DataMapping[]} mappings - Field mapping configuration
 * @returns {any} Transformed record
 *
 * @example
 * ```typescript
 * const transformed = applyDataMapping(sourceRecord, [
 *   { sourceField: 'first_name', targetField: 'firstName' },
 *   { sourceField: 'email', targetField: 'emailAddress', transform: (v) => v.toLowerCase() },
 * ]);
 * ```
 */
export declare const applyDataMapping: (record: any, mappings: DataMapping[]) => any;
/**
 * Transforms data during export/import with custom rules.
 *
 * @param {any[]} records - Records to transform
 * @param {Function} transformer - Transformation function
 * @param {Object} options - Transformation options
 * @returns {Promise<any[]>} Transformed records
 *
 * @example
 * ```typescript
 * const transformed = await transformData(records, (record) => ({
 *   ...record,
 *   fullName: `${record.firstName} ${record.lastName}`,
 *   age: calculateAge(record.birthDate),
 * }));
 * ```
 */
export declare const transformData: (records: any[], transformer: (record: any) => any | Promise<any>, options?: {
    parallel?: boolean;
    batchSize?: number;
}) => Promise<any[]>;
/**
 * Normalizes data format for consistent import.
 *
 * @param {any} record - Record to normalize
 * @param {Object} schema - Normalization schema
 * @returns {any} Normalized record
 *
 * @example
 * ```typescript
 * const normalized = normalizeDataFormat(record, {
 *   dateFields: ['birthDate', 'createdAt'],
 *   numberFields: ['age', 'score'],
 *   booleanFields: ['active', 'verified'],
 * });
 * ```
 */
export declare const normalizeDataFormat: (record: any, schema: {
    dateFields?: string[];
    numberFields?: string[];
    booleanFields?: string[];
    stringFields?: string[];
}) => any;
/**
 * Creates a streaming data pipeline for large exports.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {FindOptions} query - Query options
 * @param {Transform} transformStream - Transform stream for data processing
 * @param {Writable} outputStream - Output stream
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const transform = new Transform({
 *   transform(chunk, encoding, callback) {
 *     this.push(JSON.stringify(chunk) + '\n');
 *     callback();
 *   }
 * });
 * await createStreamingPipeline(Patient, query, transform, outputStream);
 * ```
 */
export declare const createStreamingPipeline: (model: ModelStatic<any>, query: FindOptions, transformStream: Transform, outputStream: Writable) => Promise<void>;
/**
 * Streams large file imports in chunks to manage memory.
 *
 * @param {string} filePath - Path to file to stream
 * @param {Function} processor - Function to process each chunk
 * @param {Object} options - Streaming options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await streamLargeFileImport('/uploads/large-file.json', async (chunk) => {
 *   await Patient.bulkCreate(chunk);
 * }, { chunkSize: 1000 });
 * ```
 */
export declare const streamLargeFileImport: (filePath: string, processor: (chunk: any[]) => Promise<void>, options?: {
    chunkSize?: number;
    encoding?: BufferEncoding;
}) => Promise<void>;
/**
 * Compresses exported file using zip or gzip.
 *
 * @param {string} filePath - Path to file to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<string>} Path to compressed file
 *
 * @example
 * ```typescript
 * const compressedPath = await compressExportFile(
 *   '/exports/patients.csv',
 *   { format: 'zip', level: 9 }
 * );
 * ```
 */
export declare const compressExportFile: (filePath: string, options?: CompressionOptions) => Promise<string>;
/**
 * Decompresses imported file before processing.
 *
 * @param {string} filePath - Path to compressed file
 * @param {string} outputPath - Path for decompressed file
 * @returns {Promise<string>} Path to decompressed file
 *
 * @example
 * ```typescript
 * const decompressedPath = await decompressImportFile(
 *   '/uploads/patients.csv.zip',
 *   '/temp/patients.csv'
 * );
 * ```
 */
export declare const decompressImportFile: (filePath: string, outputPath: string) => Promise<string>;
/**
 * Schedules export job for execution.
 *
 * @param {ExportJobConfig} config - Export configuration
 * @param {Date | string} scheduledTime - When to execute the job
 * @returns {Promise<{jobId: string, scheduledAt: Date}>} Scheduled job info
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleExportJob({
 *   format: 'csv',
 *   model: Patient,
 *   filePath: '/exports/daily-report.csv',
 * }, '2024-01-15T02:00:00Z');
 * ```
 */
export declare const scheduleExportJob: (config: ExportJobConfig, scheduledTime: Date | string) => Promise<{
    jobId: string;
    scheduledAt: Date;
}>;
/**
 * Retrieves export job status and progress.
 *
 * @param {string} jobId - Export job ID
 * @returns {Promise<{status: JobStatus, progress: number, result?: ExportJobResult}>} Job status
 *
 * @example
 * ```typescript
 * const status = await getExportJobStatus('job-123');
 * console.log(`Job ${status.status}, ${status.progress}% complete`);
 * ```
 */
export declare const getExportJobStatus: (jobId: string) => Promise<{
    status: JobStatus;
    progress: number;
    result?: ExportJobResult;
}>;
/**
 * Cancels a running export/import job.
 *
 * @param {string} jobId - Job ID to cancel
 * @returns {Promise<boolean>} True if cancelled successfully
 *
 * @example
 * ```typescript
 * const cancelled = await cancelJob('job-123');
 * if (cancelled) {
 *   console.log('Job cancelled successfully');
 * }
 * ```
 */
export declare const cancelJob: (jobId: string) => Promise<boolean>;
/**
 * Creates export using predefined template.
 *
 * @param {string} templateName - Name of template to use
 * @param {any} data - Data to populate template
 * @param {string} outputPath - Output file path
 * @returns {Promise<ExportJobResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportWithTemplate('patient-report', {
 *   patients: patientList,
 *   reportDate: new Date(),
 * }, '/exports/report.pdf');
 * ```
 */
export declare const exportWithTemplate: (templateName: string, data: any, outputPath: string) => Promise<ExportJobResult>;
/**
 * Registers a new export template.
 *
 * @param {string} name - Template name
 * @param {string} templateContent - Template content
 * @param {ExportFormat} format - Output format
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerExportTemplate('monthly-report', templateHtml, 'pdf');
 * ```
 */
export declare const registerExportTemplate: (name: string, templateContent: string, format: ExportFormat) => Promise<void>;
/**
 * Validates import data against schema before processing.
 *
 * @param {any[]} records - Records to validate
 * @param {Object} schema - Validation schema
 * @returns {Promise<{valid: any[], invalid: ImportError[]}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateImportData(records, {
 *   required: ['email', 'firstName'],
 *   types: { email: 'email', age: 'number' },
 * });
 * ```
 */
export declare const validateImportData: (records: any[], schema: {
    required?: string[];
    types?: Record<string, string>;
    custom?: (record: any) => boolean | string;
}) => Promise<{
    valid: any[];
    invalid: ImportError[];
}>;
/**
 * Logs export/import errors to database and file.
 *
 * @param {string} jobId - Job ID
 * @param {ExportError[] | ImportError[]} errors - Errors to log
 * @param {string} logFilePath - Path to error log file
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logExportImportErrors('job-123', errors, '/logs/export-errors.log');
 * ```
 */
export declare const logExportImportErrors: (jobId: string, errors: ExportError[] | ImportError[], logFilePath: string) => Promise<void>;
declare const _default: {
    defineExportJobsModel: (sequelize: Sequelize) => any;
    defineImportJobsModel: (sequelize: Sequelize) => any;
    defineDataMappingsModel: (sequelize: Sequelize) => any;
    exportToCsv: (config: ExportJobConfig) => Promise<ExportJobResult>;
    createCsvExportStream: (model: ModelStatic<any>, query: FindOptions, options?: CsvExportOptions) => Readable;
    parseCsvHeaders: (filePath: string, options?: CsvExportOptions) => Promise<string[]>;
    importFromCsv: (config: ImportJobConfig) => Promise<ImportJobResult>;
    validateCsvFile: (filePath: string, schema: {
        requiredColumns?: string[];
        columnTypes?: Record<string, string>;
    }, options?: CsvExportOptions) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    exportToExcel: (config: ExportJobConfig) => Promise<ExportJobResult>;
    createMultiSheetExcel: (sheets: Array<{
        name: string;
        model: ModelStatic<any>;
        query?: FindOptions;
        options?: ExcelExportOptions;
    }>, filePath: string, globalOptions?: ExcelExportOptions) => Promise<ExportJobResult>;
    parseExcelFile: (filePath: string, sheetName?: string) => Promise<any[]>;
    exportToJson: (config: ExportJobConfig) => Promise<ExportJobResult>;
    createJsonExportStream: (model: ModelStatic<any>, query: FindOptions, options?: JsonExportOptions) => Readable;
    exportPaginatedJson: (model: ModelStatic<any>, query: FindOptions, pagination: ExportPaginationOptions, filePath: string) => Promise<ExportJobResult>;
    exportToXml: (config: ExportJobConfig) => Promise<ExportJobResult>;
    parseXmlFile: (filePath: string, options?: XmlExportOptions) => Promise<any[]>;
    generatePdfReport: (config: ExportJobConfig) => Promise<ExportJobResult>;
    createTemplatedPdf: (config: TemplateExportConfig) => Promise<string>;
    bulkImportWithBatching: (model: ModelStatic<any>, records: any[], options?: {
        batchSize?: number;
        validate?: boolean;
        useTransaction?: boolean;
        updateOnDuplicate?: string[];
    }) => Promise<ImportJobResult>;
    importWithRollback: (config: ImportJobConfig, transaction?: Transaction) => Promise<ImportJobResult>;
    applyDataMapping: (record: any, mappings: DataMapping[]) => any;
    transformData: (records: any[], transformer: (record: any) => any | Promise<any>, options?: {
        parallel?: boolean;
        batchSize?: number;
    }) => Promise<any[]>;
    normalizeDataFormat: (record: any, schema: {
        dateFields?: string[];
        numberFields?: string[];
        booleanFields?: string[];
        stringFields?: string[];
    }) => any;
    createStreamingPipeline: (model: ModelStatic<any>, query: FindOptions, transformStream: Transform, outputStream: Writable) => Promise<void>;
    streamLargeFileImport: (filePath: string, processor: (chunk: any[]) => Promise<void>, options?: {
        chunkSize?: number;
        encoding?: BufferEncoding;
    }) => Promise<void>;
    compressExportFile: (filePath: string, options?: CompressionOptions) => Promise<string>;
    decompressImportFile: (filePath: string, outputPath: string) => Promise<string>;
    scheduleExportJob: (config: ExportJobConfig, scheduledTime: Date | string) => Promise<{
        jobId: string;
        scheduledAt: Date;
    }>;
    getExportJobStatus: (jobId: string) => Promise<{
        status: JobStatus;
        progress: number;
        result?: ExportJobResult;
    }>;
    cancelJob: (jobId: string) => Promise<boolean>;
    exportWithTemplate: (templateName: string, data: any, outputPath: string) => Promise<ExportJobResult>;
    registerExportTemplate: (name: string, templateContent: string, format: ExportFormat) => Promise<void>;
    validateImportData: (records: any[], schema: {
        required?: string[];
        types?: Record<string, string>;
        custom?: (record: any) => boolean | string;
    }) => Promise<{
        valid: any[];
        invalid: ImportError[];
    }>;
    logExportImportErrors: (jobId: string, errors: ExportError[] | ImportError[], logFilePath: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=data-export-import-kit.d.ts.map