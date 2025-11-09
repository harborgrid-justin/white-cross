/**
 * LOC: DATAIMPORT8765
 * File: /reuse/engineer/data-import-export-kit.ts
 *
 * UPSTREAM (imports from):
 *   - csv-parse (CSV parsing)
 *   - csv-stringify (CSV generation)
 *   - xlsx (Excel file handling)
 *   - xml2js (XML parsing and building)
 *   - fast-xml-parser (Fast XML processing)
 *   - ajv (JSON schema validation)
 *   - papaparse (CSV parsing alternative)
 *   - archiver (ZIP archive creation)
 *   - unzipper (ZIP extraction)
 *
 * DOWNSTREAM (imported by):
 *   - Data migration services
 *   - ETL pipeline services
 *   - Report generation services
 *   - Bulk data processors
 *   - Backup and restore services
 */
import { Sequelize, ModelStatic, Transaction, QueryInterface } from 'sequelize';
import { Response } from 'express';
/**
 * File format types
 */
export declare enum FileFormat {
    CSV = "csv",
    EXCEL = "xlsx",
    JSON = "json",
    XML = "xml",
    TSV = "tsv"
}
/**
 * Import status
 */
export declare enum ImportStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    ROLLED_BACK = "rolled_back"
}
/**
 * Export status
 */
export declare enum ExportStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
/**
 * Data validation severity
 */
export declare enum ValidationSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
/**
 * CSV parsing options
 */
export interface CSVParseOptions {
    delimiter?: string;
    quote?: string;
    escape?: string;
    headers?: boolean;
    skipEmptyLines?: boolean;
    encoding?: BufferEncoding;
    maxRows?: number;
}
/**
 * CSV generation options
 */
export interface CSVGenerateOptions {
    delimiter?: string;
    quote?: string;
    escape?: string;
    headers?: string[];
    encoding?: BufferEncoding;
}
/**
 * Excel parsing options
 */
export interface ExcelParseOptions {
    sheetName?: string;
    sheetIndex?: number;
    headers?: boolean;
    range?: string;
    dateFormat?: string;
}
/**
 * Excel generation options
 */
export interface ExcelGenerateOptions {
    sheetName?: string;
    headers?: string[];
    columnWidths?: number[];
    autoFilter?: boolean;
    freezePane?: {
        row: number;
        col: number;
    };
}
/**
 * JSON transformation options
 */
export interface JSONTransformOptions {
    schema?: any;
    validate?: boolean;
    removeNull?: boolean;
    flattenArrays?: boolean;
    dateFormat?: 'iso' | 'timestamp' | 'custom';
}
/**
 * XML parsing options
 */
export interface XMLParseOptions {
    explicitArray?: boolean;
    mergeAttrs?: boolean;
    normalizeTags?: boolean;
    trim?: boolean;
    preserveChildrenOrder?: boolean;
}
/**
 * XML generation options
 */
export interface XMLGenerateOptions {
    rootName?: string;
    declaration?: boolean;
    pretty?: boolean;
    indent?: string;
    attributePrefix?: string;
}
/**
 * Bulk import options
 */
export interface BulkImportOptions {
    batchSize?: number;
    validateBeforeInsert?: boolean;
    skipErrors?: boolean;
    updateOnDuplicate?: string[];
    transaction?: Transaction;
    progressCallback?: (progress: ImportProgress) => void;
}
/**
 * Import progress
 */
export interface ImportProgress {
    totalRows: number;
    processedRows: number;
    successfulRows: number;
    failedRows: number;
    errors: ValidationError[];
    percentage: number;
    estimatedTimeRemaining?: number;
}
/**
 * Validation error
 */
export interface ValidationError {
    row?: number;
    column?: string;
    value?: any;
    message: string;
    severity: ValidationSeverity;
    code?: string;
}
/**
 * Export options
 */
export interface ExportOptions {
    format: FileFormat;
    columns?: string[];
    filters?: Record<string, any>;
    limit?: number;
    offset?: number;
    streaming?: boolean;
    compression?: boolean;
    encryption?: boolean;
}
/**
 * Data mapping rule
 */
export interface DataMapping {
    sourceField: string;
    targetField: string;
    transform?: (value: any) => any;
    validate?: (value: any) => boolean;
    required?: boolean;
    defaultValue?: any;
}
/**
 * Schema migration definition
 */
export interface SchemaMigration {
    version: string;
    name: string;
    up: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>;
    down: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>;
}
/**
 * Backup configuration
 */
export interface BackupConfig {
    tables?: string[];
    excludeTables?: string[];
    compression?: boolean;
    encryption?: boolean;
    incremental?: boolean;
    basePath?: string;
}
/**
 * Restore configuration
 */
export interface RestoreConfig {
    backupPath: string;
    tables?: string[];
    skipValidation?: boolean;
    dropExisting?: boolean;
}
/**
 * Data archival options
 */
export interface ArchivalOptions {
    tableName: string;
    archiveTableName?: string;
    dateColumn: string;
    cutoffDate: Date;
    deleteAfterArchive?: boolean;
    compression?: boolean;
}
export declare const CSVParseOptionsSchema: any;
export declare const BulkImportOptionsSchema: any;
export declare const ExportOptionsSchema: any;
/**
 * Import Job model for tracking import operations
 */
export declare function createImportJobModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Export Task model for tracking export operations
 */
export declare function createExportTaskModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Data Mapping model for field mappings
 */
export declare function createDataMappingModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Migration Version model for schema migrations
 */
export declare function createMigrationVersionModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Parse CSV file to array of objects
 */
export declare function parseCSVFile(filePath: string, options?: CSVParseOptions): Promise<any[]>;
/**
 * Generate CSV from array of objects
 */
export declare function generateCSVFile(data: any[], filePath: string, options?: CSVGenerateOptions): Promise<void>;
/**
 * Auto-detect CSV delimiter
 */
export declare function detectCSVDelimiter(sample: string): string;
/**
 * Validate CSV structure
 */
export declare function validateCSVStructure(data: any[]): ValidationError[];
/**
 * Parse Excel file using xlsx library
 *
 * @param filePath - Path to Excel file
 * @param options - Excel parsing options
 * @returns Array of parsed row objects
 * @throws Error if file doesn't exist or parsing fails
 *
 * @example
 * ```typescript
 * const data = await parseExcelFile('./data.xlsx', {
 *   sheetName: 'Sheet1',
 *   headers: true,
 *   range: 'A1:D100'
 * });
 * ```
 */
export declare function parseExcelFile(filePath: string, options?: ExcelParseOptions): Promise<any[]>;
/**
 * Generate Excel file using xlsx library
 *
 * @param data - Array of objects to export
 * @param filePath - Output file path
 * @param options - Excel generation options
 *
 * @example
 * ```typescript
 * await generateExcelFile(users, './users.xlsx', {
 *   sheetName: 'Users',
 *   headers: ['ID', 'Name', 'Email'],
 *   columnWidths: [10, 30, 40],
 *   autoFilter: true
 * });
 * ```
 */
export declare function generateExcelFile(data: any[], filePath: string, options?: ExcelGenerateOptions): Promise<void>;
/**
 * Parse Excel file with multiple sheets
 *
 * @param filePath - Path to Excel file
 * @returns Map of sheet names to parsed data arrays
 * @throws Error if file doesn't exist or parsing fails
 *
 * @example
 * ```typescript
 * const sheets = await parseExcelMultiSheet('./workbook.xlsx');
 * for (const [sheetName, data] of sheets) {
 *   console.log(`Sheet ${sheetName} has ${data.length} rows`);
 * }
 * ```
 */
export declare function parseExcelMultiSheet(filePath: string): Promise<Map<string, any[]>>;
/**
 * Generate Excel file with multiple sheets
 *
 * @param sheets - Map of sheet names to data arrays
 * @param filePath - Output file path
 *
 * @example
 * ```typescript
 * const sheets = new Map([
 *   ['Users', usersData],
 *   ['Products', productsData],
 *   ['Orders', ordersData]
 * ]);
 * await generateExcelMultiSheet(sheets, './report.xlsx');
 * ```
 */
export declare function generateExcelMultiSheet(sheets: Map<string, any[]>, filePath: string): Promise<void>;
/**
 * Parse JSON file
 */
export declare function parseJSONFile(filePath: string): Promise<any>;
/**
 * Generate JSON file
 */
export declare function generateJSONFile(data: any, filePath: string, pretty?: boolean): Promise<void>;
/**
 * Transform JSON data
 */
export declare function transformJSONData(data: any, options?: JSONTransformOptions): any;
/**
 * Validate JSON schema
 */
export declare function validateJSONSchema(data: any, schema: any): ValidationError[];
/**
 * Parse XML file (mock implementation - requires xml2js)
 */
export declare function parseXMLFile(filePath: string, options?: XMLParseOptions): Promise<any>;
/**
 * Generate XML file (mock implementation)
 */
export declare function generateXMLFile(data: any, filePath: string, options?: XMLGenerateOptions): Promise<void>;
/**
 * Convert XML to JSON
 */
export declare function xmlToJSON(xml: string): Promise<any>;
/**
 * Convert JSON to XML
 */
export declare function jsonToXML(data: any, options?: XMLGenerateOptions): string;
/**
 * Bulk import data with batching
 */
export declare function bulkImportData(model: ModelStatic<any>, data: any[], options?: BulkImportOptions): Promise<ImportProgress>;
/**
 * Streaming export for large datasets
 */
export declare function streamingExport(model: ModelStatic<any>, options: ExportOptions, response: Response): Promise<void>;
/**
 * Export data to file
 */
export declare function exportDataToFile(model: ModelStatic<any>, filePath: string, options: ExportOptions): Promise<number>;
/**
 * Validate data against mapping rules
 */
export declare function validateDataMapping(data: any, mappings: DataMapping[]): ValidationError[];
/**
 * Sanitize data
 */
export declare function sanitizeData(data: any): any;
/**
 * Transform data using mapping rules
 */
export declare function transformDataWithMapping(data: any, mappings: DataMapping[]): any;
/**
 * Apply schema migration
 */
export declare function applyMigration(sequelize: Sequelize, migration: SchemaMigration, versionModel: ModelStatic<any>): Promise<void>;
/**
 * Revert schema migration
 */
export declare function revertMigration(sequelize: Sequelize, migration: SchemaMigration, versionModel: ModelStatic<any>): Promise<void>;
/**
 * Get pending migrations
 */
export declare function getPendingMigrations(versionModel: ModelStatic<any>, allMigrations: SchemaMigration[]): Promise<SchemaMigration[]>;
/**
 * Archive old data
 */
export declare function archiveOldData(sequelize: Sequelize, options: ArchivalOptions): Promise<number>;
/**
 * Create database backup
 */
export declare function createDatabaseBackup(sequelize: Sequelize, config: BackupConfig): Promise<string>;
/**
 * Restore database from backup
 */
export declare function restoreDatabaseBackup(sequelize: Sequelize, config: RestoreConfig): Promise<void>;
/**
 * Get file size
 */
export declare function getFileSize(filePath: string): Promise<number>;
/**
 * Delete file
 */
export declare function deleteFile(filePath: string): Promise<void>;
/**
 * Check if file exists
 */
export declare function fileExists(filePath: string): Promise<boolean>;
/**
 * Data Import/Export Kit Service
 */
export declare class DataImportExportKitService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Get all exported functions
     */
    getAllFunctions(): {
        parseCSVFile: typeof parseCSVFile;
        generateCSVFile: typeof generateCSVFile;
        detectCSVDelimiter: typeof detectCSVDelimiter;
        validateCSVStructure: typeof validateCSVStructure;
        parseExcelFile: typeof parseExcelFile;
        generateExcelFile: typeof generateExcelFile;
        parseExcelMultiSheet: typeof parseExcelMultiSheet;
        generateExcelMultiSheet: typeof generateExcelMultiSheet;
        parseJSONFile: typeof parseJSONFile;
        generateJSONFile: typeof generateJSONFile;
        transformJSONData: typeof transformJSONData;
        validateJSONSchema: typeof validateJSONSchema;
        parseXMLFile: typeof parseXMLFile;
        generateXMLFile: typeof generateXMLFile;
        xmlToJSON: typeof xmlToJSON;
        jsonToXML: typeof jsonToXML;
        bulkImportData: typeof bulkImportData;
        streamingExport: typeof streamingExport;
        exportDataToFile: typeof exportDataToFile;
        validateDataMapping: typeof validateDataMapping;
        sanitizeData: typeof sanitizeData;
        transformDataWithMapping: typeof transformDataWithMapping;
        applyMigration: typeof applyMigration;
        revertMigration: typeof revertMigration;
        getPendingMigrations: typeof getPendingMigrations;
        archiveOldData: typeof archiveOldData;
        createDatabaseBackup: typeof createDatabaseBackup;
        restoreDatabaseBackup: typeof restoreDatabaseBackup;
        getFileSize: typeof getFileSize;
        deleteFile: typeof deleteFile;
        fileExists: typeof fileExists;
        createImportJobModel: typeof createImportJobModel;
        createExportTaskModel: typeof createExportTaskModel;
        createDataMappingModel: typeof createDataMappingModel;
        createMigrationVersionModel: typeof createMigrationVersionModel;
    };
}
export default DataImportExportKitService;
//# sourceMappingURL=data-import-export-kit.d.ts.map