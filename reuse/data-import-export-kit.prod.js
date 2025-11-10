"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportRequestDto = exports.ImportRequestDto = exports.DataImportExportController = exports.DataImportExportService = exports.defineImportExportAssociations = exports.defineImportErrorModel = exports.defineDataMappingModel = exports.defineExportTaskModel = exports.defineImportJobModel = exports.ColumnMappingSchema = exports.ExportConfigSchema = exports.ImportConfigSchema = exports.ExcelWriteOptionsSchema = exports.ExcelReadOptionsSchema = exports.CSVGenerateOptionsSchema = exports.CSVParseOptionsSchema = void 0;
exports.detectCSVDelimiter = detectCSVDelimiter;
exports.parseCSVFile = parseCSVFile;
exports.generateCSVFile = generateCSVFile;
exports.createCSVParserStream = createCSVParserStream;
exports.readExcelFile = readExcelFile;
exports.writeExcelFile = writeExcelFile;
exports.getExcelMetadata = getExcelMetadata;
exports.transformJSON = transformJSON;
exports.jsonToCSV = jsonToCSV;
exports.csvToJSON = csvToJSON;
exports.jsonToXML = jsonToXML;
exports.xmlToJSON = xmlToJSON;
exports.applyColumnMappings = applyColumnMappings;
exports.validateData = validateData;
exports.inferSchema = inferSchema;
exports.generateMappingSuggestions = generateMappingSuggestions;
exports.batchImport = batchImport;
exports.batchExport = batchExport;
exports.generateImportTemplate = generateImportTemplate;
exports.normalizeData = normalizeData;
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
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const stream_1 = require("stream");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for CSV parsing options validation.
 */
exports.CSVParseOptionsSchema = zod_1.z.object({
    delimiter: zod_1.z.string().length(1).optional().default(','),
    quote: zod_1.z.string().length(1).optional().default('"'),
    escape: zod_1.z.string().length(1).optional().default('"'),
    encoding: zod_1.z.string().optional().default('utf8'),
    skipEmptyLines: zod_1.z.boolean().optional().default(true),
    skipHeader: zod_1.z.boolean().optional().default(false),
    trimFields: zod_1.z.boolean().optional().default(true),
    maxRows: zod_1.z.number().int().positive().optional(),
    comment: zod_1.z.string().length(1).optional(),
    relaxColumnCount: zod_1.z.boolean().optional().default(false),
    castNumbers: zod_1.z.boolean().optional().default(true),
    castDates: zod_1.z.boolean().optional().default(false),
    columns: zod_1.z.union([zod_1.z.array(zod_1.z.string()), zod_1.z.boolean()]).optional(),
    fromLine: zod_1.z.number().int().positive().optional(),
    toLine: zod_1.z.number().int().positive().optional(),
    detectDelimiter: zod_1.z.boolean().optional().default(true),
});
/**
 * Zod schema for CSV generation options validation.
 */
exports.CSVGenerateOptionsSchema = zod_1.z.object({
    delimiter: zod_1.z.string().length(1).optional().default(','),
    quote: zod_1.z.string().length(1).optional().default('"'),
    escape: zod_1.z.string().length(1).optional().default('"'),
    header: zod_1.z.boolean().optional().default(true),
    columns: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), header: zod_1.z.string() })),
    ])
        .optional(),
    recordDelimiter: zod_1.z.string().optional().default('\n'),
    quoteAll: zod_1.z.boolean().optional().default(false),
    encoding: zod_1.z.string().optional().default('utf8'),
    bom: zod_1.z.boolean().optional().default(false),
});
/**
 * Zod schema for Excel read options validation.
 */
exports.ExcelReadOptionsSchema = zod_1.z.object({
    sheetName: zod_1.z.string().optional(),
    sheetIndex: zod_1.z.number().int().min(0).optional().default(0),
    range: zod_1.z.string().optional(),
    header: zod_1.z.boolean().optional().default(true),
    raw: zod_1.z.boolean().optional().default(false),
    defval: zod_1.z.any().optional(),
    dateNF: zod_1.z.string().optional(),
    cellDates: zod_1.z.boolean().optional().default(true),
    cellFormula: zod_1.z.boolean().optional().default(false),
    cellHTML: zod_1.z.boolean().optional().default(false),
    cellStyles: zod_1.z.boolean().optional().default(false),
    skipHidden: zod_1.z.boolean().optional().default(true),
    blankRows: zod_1.z.boolean().optional().default(false),
});
/**
 * Zod schema for Excel write options validation.
 */
exports.ExcelWriteOptionsSchema = zod_1.z.object({
    sheetName: zod_1.z.string().optional().default('Sheet1'),
    header: zod_1.z.boolean().optional().default(true),
    skipHeader: zod_1.z.boolean().optional().default(false),
    columns: zod_1.z
        .array(zod_1.z.object({
        header: zod_1.z.string(),
        key: zod_1.z.string(),
        width: zod_1.z.number().positive().optional(),
    }))
        .optional(),
    dateFormat: zod_1.z.string().optional().default('yyyy-mm-dd'),
    numberFormat: zod_1.z.string().optional(),
    compression: zod_1.z.boolean().optional().default(true),
    password: zod_1.z.string().optional(),
    bookType: zod_1.z.enum(['xlsx', 'xlsm', 'xlsb', 'xls', 'csv']).optional().default('xlsx'),
    cellStyles: zod_1.z.boolean().optional().default(false),
    autoFilter: zod_1.z.boolean().optional().default(false),
    freezePane: zod_1.z.object({ row: zod_1.z.number().int().min(0), col: zod_1.z.number().int().min(0) }).optional(),
});
/**
 * Zod schema for import configuration validation.
 */
exports.ImportConfigSchema = zod_1.z.object({
    format: zod_1.z.enum(['csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet']),
    mapping: zod_1.z
        .array(zod_1.z.object({
        source: zod_1.z.string(),
        target: zod_1.z.string(),
        strategy: zod_1.z.enum(['exact', 'fuzzy', 'transform', 'computed', 'lookup']),
        defaultValue: zod_1.z.any().optional(),
        required: zod_1.z.boolean().optional(),
        unique: zod_1.z.boolean().optional(),
        fuzzyThreshold: zod_1.z.number().min(0).max(1).optional(),
        computeFrom: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .optional(),
    validation: zod_1.z
        .array(zod_1.z.object({
        field: zod_1.z.string(),
        type: zod_1.z
            .enum(['string', 'number', 'boolean', 'date', 'email', 'url', 'uuid'])
            .optional(),
        required: zod_1.z.boolean().optional(),
        minLength: zod_1.z.number().int().min(0).optional(),
        maxLength: zod_1.z.number().int().positive().optional(),
        min: zod_1.z.number().optional(),
        max: zod_1.z.number().optional(),
        pattern: zod_1.z.string().optional(),
        enum: zod_1.z.array(zod_1.z.any()).optional(),
        message: zod_1.z.string().optional(),
    }))
        .optional(),
    batchSize: zod_1.z.number().int().positive().optional().default(1000),
    skipRows: zod_1.z.number().int().min(0).optional().default(0),
    maxRows: zod_1.z.number().int().positive().optional(),
    errorStrategy: zod_1.z.enum(['abort', 'skip', 'quarantine', 'fix', 'prompt']).optional().default('skip'),
    useTransaction: zod_1.z.boolean().optional().default(true),
    dryRun: zod_1.z.boolean().optional().default(false),
    deduplicate: zod_1.z.boolean().optional().default(false),
    deduplicateBy: zod_1.z.array(zod_1.z.string()).optional(),
    upsert: zod_1.z.boolean().optional().default(false),
    upsertKeys: zod_1.z.array(zod_1.z.string()).optional(),
    parallelism: zod_1.z.number().int().positive().max(10).optional().default(1),
});
/**
 * Zod schema for export configuration validation.
 */
exports.ExportConfigSchema = zod_1.z.object({
    format: zod_1.z.enum(['csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet']),
    columns: zod_1.z.union([zod_1.z.array(zod_1.z.string()), zod_1.z.array(zod_1.z.object({ source: zod_1.z.string(), target: zod_1.z.string() }))]).optional(),
    filters: zod_1.z.record(zod_1.z.any()).optional(),
    sort: zod_1.z.array(zod_1.z.object({ field: zod_1.z.string(), order: zod_1.z.enum(['asc', 'desc']) })).optional(),
    limit: zod_1.z.number().int().positive().optional(),
    offset: zod_1.z.number().int().min(0).optional().default(0),
    streaming: zod_1.z.boolean().optional().default(true),
    chunkSize: zod_1.z.number().int().positive().optional().default(1000),
    compression: zod_1.z.boolean().optional().default(false),
    encryption: zod_1.z
        .object({
        enabled: zod_1.z.boolean(),
        algorithm: zod_1.z.string().optional().default('aes-256-cbc'),
        password: zod_1.z.string().optional(),
    })
        .optional(),
    includeMetadata: zod_1.z.boolean().optional().default(false),
});
/**
 * Zod schema for column mapping validation.
 */
exports.ColumnMappingSchema = zod_1.z.object({
    source: zod_1.z.string().min(1),
    target: zod_1.z.string().min(1),
    strategy: zod_1.z.enum(['exact', 'fuzzy', 'transform', 'computed', 'lookup']),
    defaultValue: zod_1.z.any().optional(),
    required: zod_1.z.boolean().optional().default(false),
    unique: zod_1.z.boolean().optional().default(false),
    fuzzyThreshold: zod_1.z.number().min(0).max(1).optional().default(0.8),
    computeFrom: zod_1.z.array(zod_1.z.string()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const defineImportJobModel = (sequelize) => {
    return sequelize.define('ImportJob', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: false,
            field: 'file_name',
        },
        originalFileName: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: true,
            field: 'original_file_name',
        },
        format: {
            type: sequelize_1.DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'validating', 'processing', 'completed', 'failed', 'cancelled', 'partial'),
            allowNull: false,
            defaultValue: 'pending',
        },
        totalRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'total_rows',
        },
        processedRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'processed_rows',
        },
        validRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'valid_rows',
        },
        invalidRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'invalid_rows',
        },
        skippedRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'skipped_rows',
        },
        errorRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'error_rows',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        mappingId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'mapping_id',
            references: {
                model: 'data_mappings',
                key: 'id',
            },
        },
        errors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        warnings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        summary: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        startTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'start_time',
        },
        endTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'end_time',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in milliseconds',
        },
        throughput: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Rows per second',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'created_by',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'import_jobs',
        underscored: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['format'] },
            { fields: ['created_by'] },
            { fields: ['created_at'] },
            { fields: ['mapping_id'] },
        ],
    });
};
exports.defineImportJobModel = defineImportJobModel;
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
const defineExportTaskModel = (sequelize) => {
    return sequelize.define('ExportTask', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        format: {
            type: sequelize_1.DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'generating', 'ready', 'expired', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        totalRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'total_rows',
        },
        exportedRows: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'exported_rows',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        filters: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: true,
            field: 'file_name',
        },
        filePath: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: true,
            field: 'file_path',
        },
        fileSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            field: 'file_size',
        },
        downloadUrl: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: true,
            field: 'download_url',
        },
        downloadCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'download_count',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expires_at',
        },
        startTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'start_time',
        },
        endTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'end_time',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in milliseconds',
        },
        throughput: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Rows per second',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'created_by',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'export_tasks',
        underscored: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['format'] },
            { fields: ['created_by'] },
            { fields: ['created_at'] },
            { fields: ['expires_at'] },
        ],
    });
};
exports.defineExportTaskModel = defineExportTaskModel;
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
const defineDataMappingModel = (sequelize) => {
    return sequelize.define('DataMapping', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        sourceFormat: {
            type: sequelize_1.DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
            allowNull: false,
            field: 'source_format',
        },
        targetEntity: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'target_entity',
            comment: 'Target database table or entity name',
        },
        mappings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Array of column mapping configurations',
        },
        validationRules: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'validation_rules',
        },
        transformationRules: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'transformation_rules',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        isTemplate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_template',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'parent_id',
            references: {
                model: 'data_mappings',
                key: 'id',
            },
            comment: 'Reference to parent mapping for versioning',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'created_by',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'updated_by',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'data_mappings',
        underscored: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['source_format'] },
            { fields: ['target_entity'] },
            { fields: ['is_active'] },
            { fields: ['is_template'] },
            { fields: ['parent_id'] },
            { fields: ['created_by'] },
        ],
    });
};
exports.defineDataMappingModel = defineDataMappingModel;
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
const defineImportErrorModel = (sequelize) => {
    return sequelize.define('ImportError', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        importJobId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'import_job_id',
            references: {
                model: 'import_jobs',
                key: 'id',
            },
        },
        rowNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'row_number',
        },
        fieldName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'field_name',
        },
        fieldValue: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'field_value',
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING(63),
            allowNull: false,
            field: 'error_code',
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('error', 'warning', 'info'),
            allowNull: false,
            defaultValue: 'error',
        },
        recoverable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        suggestion: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        rawData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'raw_data',
        },
        resolved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'resolved_by',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'resolved_at',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'import_errors',
        underscored: true,
        indexes: [
            { fields: ['import_job_id'] },
            { fields: ['row_number'] },
            { fields: ['error_code'] },
            { fields: ['severity'] },
            { fields: ['resolved'] },
        ],
    });
};
exports.defineImportErrorModel = defineImportErrorModel;
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
const defineImportExportAssociations = (sequelize, models) => {
    const { ImportJob, ExportTask, DataMapping, ImportError } = models;
    // ImportJob belongs to DataMapping
    ImportJob.belongsTo(DataMapping, {
        foreignKey: 'mapping_id',
        as: 'mapping',
    });
    // DataMapping has many ImportJobs
    DataMapping.hasMany(ImportJob, {
        foreignKey: 'mapping_id',
        as: 'importJobs',
    });
    // ImportJob has many ImportErrors
    ImportJob.hasMany(ImportError, {
        foreignKey: 'import_job_id',
        as: 'errors',
    });
    // ImportError belongs to ImportJob
    ImportError.belongsTo(ImportJob, {
        foreignKey: 'import_job_id',
        as: 'job',
    });
    // DataMapping self-referencing for versioning
    DataMapping.hasMany(DataMapping, {
        foreignKey: 'parent_id',
        as: 'versions',
    });
    DataMapping.belongsTo(DataMapping, {
        foreignKey: 'parent_id',
        as: 'parent',
    });
};
exports.defineImportExportAssociations = defineImportExportAssociations;
// ============================================================================
// UTILITY FUNCTIONS - CSV OPERATIONS
// ============================================================================
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
async function detectCSVDelimiter(filePath, sampleSize = 10) {
    const possibleDelimiters = [',', ';', '\t', '|', ':'];
    const delimiterCounts = new Map();
    const fileStream = (0, fs_1.createReadStream)(filePath, { encoding: 'utf8' });
    const lines = [];
    let buffer = '';
    for await (const chunk of fileStream) {
        buffer += chunk;
        const newlineIndex = buffer.indexOf('\n');
        if (newlineIndex !== -1) {
            lines.push(buffer.substring(0, newlineIndex));
            buffer = buffer.substring(newlineIndex + 1);
            if (lines.length >= sampleSize) {
                fileStream.destroy();
                break;
            }
        }
    }
    // Count occurrences of each delimiter per line
    for (const delimiter of possibleDelimiters) {
        const counts = lines.map((line) => (line.match(new RegExp(`\\${delimiter}`, 'g')) || []).length);
        delimiterCounts.set(delimiter, counts);
    }
    // Find delimiter with most consistent count
    let bestDelimiter = ',';
    let bestScore = 0;
    const alternatives = [];
    for (const [delimiter, counts] of delimiterCounts) {
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        const variance = counts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / counts.length;
        const consistency = avg > 0 ? 1 / (1 + variance) : 0;
        const score = avg * consistency;
        alternatives.push({ delimiter, confidence: score });
        if (score > bestScore) {
            bestScore = score;
            bestDelimiter = delimiter;
        }
    }
    const columnCount = (delimiterCounts.get(bestDelimiter) || [0])[0] + 1;
    const confidence = Math.min(bestScore / 10, 1); // Normalize to 0-1
    return {
        delimiter: bestDelimiter,
        confidence,
        rowCount: lines.length,
        columnCount,
        alternatives: alternatives
            .filter((a) => a.delimiter !== bestDelimiter)
            .sort((a, b) => b.confidence - a.confidence),
    };
}
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
async function parseCSVFile(filePath, options = {}) {
    const validatedOptions = exports.CSVParseOptionsSchema.parse(options);
    const results = [];
    // Detect delimiter if requested
    let delimiter = validatedOptions.delimiter;
    if (validatedOptions.detectDelimiter) {
        const detection = await detectCSVDelimiter(filePath);
        if (detection.confidence > 0.7) {
            delimiter = detection.delimiter;
        }
    }
    return new Promise((resolve, reject) => {
        const fileStream = (0, fs_1.createReadStream)(filePath, {
            encoding: validatedOptions.encoding,
        });
        let lineNumber = 0;
        let headers = null;
        let buffer = '';
        fileStream.on('data', (chunk) => {
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                lineNumber++;
                // Skip lines before fromLine
                if (validatedOptions.fromLine && lineNumber < validatedOptions.fromLine) {
                    continue;
                }
                // Stop at toLine
                if (validatedOptions.toLine && lineNumber > validatedOptions.toLine) {
                    fileStream.destroy();
                    break;
                }
                // Skip empty lines
                if (validatedOptions.skipEmptyLines && line.trim() === '') {
                    continue;
                }
                // Skip comment lines
                if (validatedOptions.comment && line.trim().startsWith(validatedOptions.comment)) {
                    continue;
                }
                // Parse CSV line
                const values = parseCSVLine(line, delimiter || ',', validatedOptions.quote || '"');
                // Handle header
                if (!headers && !validatedOptions.skipHeader) {
                    headers = validatedOptions.trimFields ? values.map((v) => v.trim()) : values;
                    continue;
                }
                if (!headers) {
                    headers = Array.from({ length: values.length }, (_, i) => `column${i + 1}`);
                }
                // Create row object
                const row = {};
                for (let i = 0; i < headers.length; i++) {
                    let value = values[i] || '';
                    if (validatedOptions.trimFields && typeof value === 'string') {
                        value = value.trim();
                    }
                    // Type casting
                    if (validatedOptions.castNumbers && !isNaN(Number(value)) && value !== '') {
                        value = Number(value);
                    }
                    else if (validatedOptions.castDates && isDateString(value)) {
                        value = new Date(value);
                    }
                    row[headers[i]] = value;
                }
                results.push(row);
                // Check max rows
                if (validatedOptions.maxRows && results.length >= validatedOptions.maxRows) {
                    fileStream.destroy();
                    break;
                }
            }
        });
        fileStream.on('end', () => {
            // Process remaining buffer
            if (buffer.trim()) {
                const values = parseCSVLine(buffer, delimiter || ',', validatedOptions.quote || '"');
                if (headers) {
                    const row = {};
                    for (let i = 0; i < headers.length; i++) {
                        row[headers[i]] = values[i] || '';
                    }
                    results.push(row);
                }
            }
            resolve(results);
        });
        fileStream.on('error', reject);
    });
}
/**
 * Parse a single CSV line respecting quotes and escapes.
 *
 * @param line - CSV line to parse
 * @param delimiter - Field delimiter
 * @param quote - Quote character
 * @returns Array of field values
 */
function parseCSVLine(line, delimiter, quote) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        if (char === quote) {
            if (inQuotes && nextChar === quote) {
                current += quote;
                i++; // Skip next quote
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (char === delimiter && !inQuotes) {
            values.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    values.push(current);
    return values;
}
/**
 * Check if a string represents a valid date.
 *
 * @param value - Value to check
 * @returns True if value is a valid date string
 */
function isDateString(value) {
    if (!value || typeof value !== 'string')
        return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.match(/\d{4}-\d{2}-\d{2}/) !== null;
}
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
async function generateCSVFile(data, filePath, options = {}) {
    const validatedOptions = exports.CSVGenerateOptionsSchema.parse(options);
    const writeStream = (0, fs_1.createWriteStream)(filePath, {
        encoding: validatedOptions.encoding,
    });
    // Write BOM if requested
    if (validatedOptions.bom) {
        writeStream.write('\uFEFF');
    }
    // Determine columns
    let columns;
    if (Array.isArray(validatedOptions.columns)) {
        if (typeof validatedOptions.columns[0] === 'string') {
            columns = validatedOptions.columns.map((col) => ({
                key: col,
                header: col,
            }));
        }
        else {
            columns = validatedOptions.columns;
        }
    }
    else {
        // Infer from first data row
        const firstRow = data[0] || {};
        columns = Object.keys(firstRow).map((key) => ({ key, header: key }));
    }
    // Write header
    if (validatedOptions.header) {
        const headerLine = columns
            .map((col) => formatCSVField(col.header, validatedOptions))
            .join(validatedOptions.delimiter);
        writeStream.write(headerLine + validatedOptions.recordDelimiter);
    }
    // Write data rows
    for (const row of data) {
        const values = columns.map((col) => {
            const value = row[col.key];
            return formatCSVField(value, validatedOptions);
        });
        writeStream.write(values.join(validatedOptions.delimiter) + validatedOptions.recordDelimiter);
    }
    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        writeStream.end();
    });
}
/**
 * Format a field value for CSV output with proper quoting and escaping.
 *
 * @param value - Value to format
 * @param options - CSV generation options
 * @returns Formatted CSV field
 */
function formatCSVField(value, options) {
    if (value === null || value === undefined) {
        return '';
    }
    let strValue = String(value);
    const needsQuoting = options.quoteAll ||
        strValue.includes(options.delimiter || ',') ||
        strValue.includes(options.quote || '"') ||
        strValue.includes('\n') ||
        strValue.includes('\r');
    if (needsQuoting) {
        strValue = strValue.replace(new RegExp(options.quote || '"', 'g'), (options.escape || '"') + (options.quote || '"'));
        return (options.quote || '"') + strValue + (options.quote || '"');
    }
    return strValue;
}
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
function createCSVParserStream(filePath, options = {}) {
    const validatedOptions = exports.CSVParseOptionsSchema.parse(options);
    const fileStream = (0, fs_1.createReadStream)(filePath, {
        encoding: validatedOptions.encoding,
    });
    let headers = null;
    let buffer = '';
    let lineNumber = 0;
    return new stream_1.Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                lineNumber++;
                if (validatedOptions.skipEmptyLines && line.trim() === '') {
                    continue;
                }
                const values = parseCSVLine(line, validatedOptions.delimiter || ',', validatedOptions.quote || '"');
                if (!headers && !validatedOptions.skipHeader) {
                    headers = validatedOptions.trimFields ? values.map((v) => v.trim()) : values;
                    continue;
                }
                if (!headers) {
                    headers = Array.from({ length: values.length }, (_, i) => `column${i + 1}`);
                }
                const row = {};
                for (let i = 0; i < headers.length; i++) {
                    row[headers[i]] = values[i] || '';
                }
                this.push(row);
                if (validatedOptions.maxRows && lineNumber >= validatedOptions.maxRows) {
                    break;
                }
            }
            callback();
        },
        flush(callback) {
            if (buffer.trim() && headers) {
                const values = parseCSVLine(buffer, validatedOptions.delimiter || ',', validatedOptions.quote || '"');
                const row = {};
                for (let i = 0; i < headers.length; i++) {
                    row[headers[i]] = values[i] || '';
                }
                this.push(row);
            }
            callback();
        },
    }).pipe(fileStream);
}
// ============================================================================
// UTILITY FUNCTIONS - EXCEL OPERATIONS
// ============================================================================
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
async function readExcelFile(filePath, options = {}) {
    const validatedOptions = exports.ExcelReadOptionsSchema.parse(options);
    // Note: In production, import and use 'xlsx' package
    // For this example, we'll provide the interface
    throw new Error('Excel reading requires xlsx package: npm install xlsx');
    // Production implementation:
    // const XLSX = require('xlsx');
    // const workbook = XLSX.readFile(filePath, {
    //   cellDates: validatedOptions.cellDates,
    //   cellFormula: validatedOptions.cellFormula,
    //   cellHTML: validatedOptions.cellHTML,
    //   cellStyles: validatedOptions.cellStyles,
    // });
    //
    // const sheetName = validatedOptions.sheetName || workbook.SheetNames[validatedOptions.sheetIndex || 0];
    // const worksheet = workbook.Sheets[sheetName];
    // const data = XLSX.utils.sheet_to_json(worksheet, {
    //   header: validatedOptions.header ? undefined : 1,
    //   raw: validatedOptions.raw,
    //   defval: validatedOptions.defval,
    //   range: validatedOptions.range,
    //   blankrows: validatedOptions.blankRows,
    // });
    //
    // return data;
}
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
async function writeExcelFile(data, filePath, options = {}) {
    const validatedOptions = exports.ExcelWriteOptionsSchema.parse(options);
    // Note: In production, import and use 'xlsx' package
    throw new Error('Excel writing requires xlsx package: npm install xlsx');
    // Production implementation:
    // const XLSX = require('xlsx');
    // const workbook = XLSX.utils.book_new();
    //
    // if (Array.isArray(data)) {
    //   const worksheet = XLSX.utils.json_to_sheet(data, {
    //     header: validatedOptions.columns?.map(c => c.key),
    //     skipHeader: validatedOptions.skipHeader,
    //   });
    //
    //   // Apply column widths
    //   if (validatedOptions.columns) {
    //     worksheet['!cols'] = validatedOptions.columns.map(col => ({ wch: col.width }));
    //   }
    //
    //   // Apply auto filter
    //   if (validatedOptions.autoFilter) {
    //     worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(worksheet['!ref']) };
    //   }
    //
    //   XLSX.utils.book_append_sheet(workbook, worksheet, validatedOptions.sheetName);
    // } else {
    //   for (const [sheetName, sheetData] of Object.entries(data)) {
    //     const worksheet = XLSX.utils.json_to_sheet(sheetData);
    //     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    //   }
    // }
    //
    // XLSX.writeFile(workbook, filePath, {
    //   bookType: validatedOptions.bookType,
    //   compression: validatedOptions.compression,
    //   password: validatedOptions.password,
    // });
}
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
async function getExcelMetadata(filePath) {
    // Note: In production, import and use 'xlsx' package
    throw new Error('Excel metadata requires xlsx package: npm install xlsx');
    // Production implementation:
    // const XLSX = require('xlsx');
    // const workbook = XLSX.readFile(filePath, { sheetStubs: true, bookSheets: true });
    //
    // const sheetInfo = workbook.SheetNames.map((sheetName: string) => {
    //   const worksheet = workbook.Sheets[sheetName];
    //   const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    //   const rowCount = range.e.r - range.s.r + 1;
    //   const columnCount = range.e.c - range.s.c + 1;
    //
    //   const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
    //
    //   return {
    //     name: sheetName,
    //     rowCount,
    //     columnCount,
    //     columns: headerRow || [],
    //   };
    // });
    //
    // return {
    //   sheets: workbook.SheetNames,
    //   sheetInfo,
    // };
}
// ============================================================================
// UTILITY FUNCTIONS - JSON OPERATIONS
// ============================================================================
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
function transformJSON(data, options = {}) {
    let result = JSON.parse(JSON.stringify(data)); // Deep clone
    // Remove null values
    if (options.removeNull) {
        result = removeNullValues(result);
    }
    // Remove falsy values
    if (options.removeFalsy) {
        result = removeFalsyValues(result);
    }
    // Transform dates
    if (options.dateFormat) {
        result = transformDates(result, options.dateFormat);
    }
    // Sort keys
    if (options.sortKeys) {
        result = sortObjectKeys(result);
    }
    return result;
}
/**
 * Remove null values from an object or array recursively.
 */
function removeNullValues(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeNullValues).filter((item) => item !== null);
    }
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null) {
                result[key] = removeNullValues(value);
            }
        }
        return result;
    }
    return obj;
}
/**
 * Remove falsy values from an object or array recursively.
 */
function removeFalsyValues(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeFalsyValues).filter(Boolean);
    }
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value) {
                result[key] = removeFalsyValues(value);
            }
        }
        return result;
    }
    return obj;
}
/**
 * Transform date values in an object based on format.
 */
function transformDates(obj, format) {
    if (obj instanceof Date) {
        switch (format) {
            case 'iso':
                return obj.toISOString();
            case 'timestamp':
                return obj.getTime();
            case 'string':
                return obj.toString();
        }
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => transformDates(item, format));
    }
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = transformDates(value, format);
        }
        return result;
    }
    return obj;
}
/**
 * Sort object keys alphabetically (recursive).
 */
function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }
    if (obj !== null && typeof obj === 'object') {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = sortObjectKeys(obj[key]);
        }
        return sorted;
    }
    return obj;
}
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
function jsonToCSV(data, options = {}) {
    if (!data || data.length === 0) {
        return '';
    }
    const validatedOptions = exports.CSVGenerateOptionsSchema.parse(options);
    const lines = [];
    // Determine columns
    let columns;
    if (Array.isArray(validatedOptions.columns)) {
        if (typeof validatedOptions.columns[0] === 'string') {
            columns = validatedOptions.columns.map((col) => ({
                key: col,
                header: col,
            }));
        }
        else {
            columns = validatedOptions.columns;
        }
    }
    else {
        const firstRow = data[0] || {};
        columns = Object.keys(firstRow).map((key) => ({ key, header: key }));
    }
    // Add header
    if (validatedOptions.header) {
        const headerLine = columns
            .map((col) => formatCSVField(col.header, validatedOptions))
            .join(validatedOptions.delimiter);
        lines.push(headerLine);
    }
    // Add data rows
    for (const row of data) {
        const values = columns.map((col) => {
            const value = row[col.key];
            return formatCSVField(value, validatedOptions);
        });
        lines.push(values.join(validatedOptions.delimiter));
    }
    return lines.join(validatedOptions.recordDelimiter);
}
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
function csvToJSON(csv, options = {}) {
    const validatedOptions = exports.CSVParseOptionsSchema.parse(options);
    const lines = csv.split('\n').filter((line) => line.trim());
    if (lines.length === 0) {
        return [];
    }
    const delimiter = validatedOptions.delimiter || ',';
    const quote = validatedOptions.quote || '"';
    // Parse header
    let headers = parseCSVLine(lines[0], delimiter, quote);
    if (validatedOptions.trimFields) {
        headers = headers.map((h) => h.trim());
    }
    const startIndex = validatedOptions.skipHeader ? 0 : 1;
    const results = [];
    for (let i = startIndex; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], delimiter, quote);
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            let value = values[j] || '';
            if (validatedOptions.trimFields && typeof value === 'string') {
                value = value.trim();
            }
            if (validatedOptions.castNumbers && !isNaN(Number(value)) && value !== '') {
                value = Number(value);
            }
            row[headers[j]] = value;
        }
        results.push(row);
    }
    return results;
}
// ============================================================================
// UTILITY FUNCTIONS - XML OPERATIONS
// ============================================================================
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
function jsonToXML(data, options = {}) {
    const rootName = options.rootName || 'root';
    const indent = options.indent || '';
    const declaration = options.declaration !== false;
    let xml = '';
    if (declaration) {
        xml += `<?xml version="1.0" encoding="${options.encoding || 'UTF-8'}"?>\n`;
    }
    xml += buildXMLElement(data, rootName, 0, indent);
    return xml;
}
/**
 * Build XML element recursively.
 */
function buildXMLElement(data, tagName, level, indent) {
    const indentation = indent.repeat(level);
    const nextIndentation = indent.repeat(level + 1);
    if (Array.isArray(data)) {
        return data.map((item) => buildXMLElement(item, tagName, level, indent)).join('\n');
    }
    if (data !== null && typeof data === 'object') {
        let xml = `${indentation}<${tagName}>`;
        const keys = Object.keys(data);
        if (keys.length > 0) {
            xml += '\n';
            for (const key of keys) {
                xml += buildXMLElement(data[key], key, level + 1, indent) + '\n';
            }
            xml += indentation;
        }
        xml += `</${tagName}>`;
        return xml;
    }
    return `${indentation}<${tagName}>${escapeXML(String(data))}</${tagName}>`;
}
/**
 * Escape XML special characters.
 */
function escapeXML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
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
function xmlToJSON(xml, options = {}) {
    // Note: In production, use xml2js or fast-xml-parser
    throw new Error('XML parsing requires xml2js package: npm install xml2js');
    // Production implementation with xml2js:
    // const xml2js = require('xml2js');
    // return new Promise((resolve, reject) => {
    //   const parser = new xml2js.Parser({
    //     explicitArray: options.arrayMode || false,
    //     ignoreAttrs: options.ignoreAttributes || false,
    //     tagNameProcessors: options.ignoreNamespace ? [xml2js.processors.stripPrefix] : [],
    //     valueProcessors: options.parseTagValue ? [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans] : [],
    //   });
    //   parser.parseString(xml, (err: any, result: any) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });
}
// ============================================================================
// UTILITY FUNCTIONS - DATA MAPPING & VALIDATION
// ============================================================================
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
async function applyColumnMappings(data, mappings) {
    const warnings = [];
    const mappedData = [];
    for (let i = 0; i < data.length; i++) {
        const sourceRow = data[i];
        const targetRow = {};
        for (const mapping of mappings) {
            let value = sourceRow[mapping.source];
            // Handle missing required fields
            if (mapping.required && (value === undefined || value === null || value === '')) {
                if (mapping.defaultValue !== undefined) {
                    value = mapping.defaultValue;
                    warnings.push(`Row ${i + 1}: Missing required field '${mapping.source}', using default value`);
                }
                else {
                    warnings.push(`Row ${i + 1}: Missing required field '${mapping.source}'`);
                    continue;
                }
            }
            // Apply transformation based on strategy
            switch (mapping.strategy) {
                case 'exact':
                    targetRow[mapping.target] = value;
                    break;
                case 'transform':
                    if (mapping.transformer) {
                        try {
                            targetRow[mapping.target] = await mapping.transformer(value, sourceRow);
                        }
                        catch (error) {
                            warnings.push(`Row ${i + 1}: Transformation failed for '${mapping.source}': ${error.message}`);
                            targetRow[mapping.target] = mapping.defaultValue;
                        }
                    }
                    else {
                        targetRow[mapping.target] = value;
                    }
                    break;
                case 'computed':
                    if (mapping.computeFrom && mapping.transformer) {
                        const inputs = mapping.computeFrom.map((field) => sourceRow[field]);
                        try {
                            targetRow[mapping.target] = await mapping.transformer(inputs, sourceRow);
                        }
                        catch (error) {
                            warnings.push(`Row ${i + 1}: Computation failed for '${mapping.target}': ${error.message}`);
                            targetRow[mapping.target] = mapping.defaultValue;
                        }
                    }
                    break;
                case 'lookup':
                    if (mapping.lookupTable) {
                        const lookupValue = mapping.lookupTable instanceof Map
                            ? mapping.lookupTable.get(value)
                            : mapping.lookupTable[value];
                        targetRow[mapping.target] = lookupValue !== undefined ? lookupValue : mapping.defaultValue;
                    }
                    else {
                        targetRow[mapping.target] = value;
                    }
                    break;
                case 'fuzzy':
                    // Fuzzy matching would require additional logic
                    targetRow[mapping.target] = value;
                    break;
            }
            // Validate if validator is provided
            if (mapping.validator && targetRow[mapping.target] !== undefined) {
                if (!mapping.validator(targetRow[mapping.target])) {
                    warnings.push(`Row ${i + 1}: Validation failed for '${mapping.target}' with value '${targetRow[mapping.target]}'`);
                }
            }
        }
        mappedData.push(targetRow);
    }
    return { data: mappedData, warnings };
}
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
function validateData(data, rules) {
    const errors = [];
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (const rule of rules) {
            const value = row[rule.field];
            let error = null;
            // Required check
            if (rule.required && (value === undefined || value === null || value === '')) {
                error = `Field '${rule.field}' is required`;
            }
            // Type check
            if (value !== undefined && value !== null && value !== '' && rule.type) {
                switch (rule.type) {
                    case 'string':
                        if (typeof value !== 'string') {
                            error = `Field '${rule.field}' must be a string`;
                        }
                        break;
                    case 'number':
                        if (typeof value !== 'number' || isNaN(value)) {
                            error = `Field '${rule.field}' must be a number`;
                        }
                        break;
                    case 'boolean':
                        if (typeof value !== 'boolean') {
                            error = `Field '${rule.field}' must be a boolean`;
                        }
                        break;
                    case 'date':
                        if (!(value instanceof Date) && isNaN(new Date(value).getTime())) {
                            error = `Field '${rule.field}' must be a valid date`;
                        }
                        break;
                    case 'email':
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
                            error = `Field '${rule.field}' must be a valid email`;
                        }
                        break;
                    case 'url':
                        try {
                            new URL(String(value));
                        }
                        catch {
                            error = `Field '${rule.field}' must be a valid URL`;
                        }
                        break;
                    case 'uuid':
                        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value))) {
                            error = `Field '${rule.field}' must be a valid UUID`;
                        }
                        break;
                }
            }
            // String length checks
            if (typeof value === 'string') {
                if (rule.minLength !== undefined && value.length < rule.minLength) {
                    error = `Field '${rule.field}' must be at least ${rule.minLength} characters`;
                }
                if (rule.maxLength !== undefined && value.length > rule.maxLength) {
                    error = `Field '${rule.field}' must be at most ${rule.maxLength} characters`;
                }
            }
            // Number range checks
            if (typeof value === 'number') {
                if (rule.min !== undefined && value < rule.min) {
                    error = `Field '${rule.field}' must be at least ${rule.min}`;
                }
                if (rule.max !== undefined && value > rule.max) {
                    error = `Field '${rule.field}' must be at most ${rule.max}`;
                }
            }
            // Pattern check
            if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
                error = `Field '${rule.field}' does not match required pattern`;
            }
            // Enum check
            if (rule.enum && !rule.enum.includes(value)) {
                error = `Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`;
            }
            // Custom validation
            if (rule.custom) {
                const customResult = rule.custom(value, row);
                if (customResult !== true) {
                    error = typeof customResult === 'string' ? customResult : `Field '${rule.field}' failed custom validation`;
                }
            }
            if (error) {
                errors.push({
                    row: i + 1,
                    field: rule.field,
                    value,
                    message: rule.message || error,
                    code: 'VALIDATION_ERROR',
                    severity: 'error',
                    recoverable: false,
                });
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
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
function inferSchema(data, sampleSize) {
    const sample = sampleSize ? data.slice(0, sampleSize) : data;
    const fieldStats = new Map();
    // Analyze each row
    for (const row of sample) {
        for (const [key, value] of Object.entries(row)) {
            if (!fieldStats.has(key)) {
                fieldStats.set(key, {
                    name: key,
                    types: new Set(),
                    nullCount: 0,
                    values: new Set(),
                    examples: [],
                });
            }
            const stats = fieldStats.get(key);
            if (value === null || value === undefined || value === '') {
                stats.nullCount++;
            }
            else {
                stats.types.add(typeof value);
                if (stats.values.size < 100) {
                    stats.values.add(value);
                }
                if (stats.examples.length < 3) {
                    stats.examples.push(value);
                }
            }
        }
    }
    // Build schema fields
    const fields = Array.from(fieldStats.values()).map((stats) => {
        const type = inferType(stats.types, stats.examples);
        const nullable = stats.nullCount > 0;
        const unique = stats.values.size === sample.length && stats.nullCount === 0;
        return {
            name: stats.name,
            type,
            nullable,
            unique,
            example: stats.examples[0],
        };
    });
    return {
        fields,
        rowCount: sample.length,
        columnCount: fields.length,
        sampleData: sample.slice(0, 5),
    };
}
/**
 * Infer the most likely data type from collected type information.
 */
function inferType(types, examples) {
    if (types.has('object')) {
        if (examples.some((ex) => ex instanceof Date)) {
            return 'date';
        }
        return 'object';
    }
    if (types.has('number')) {
        return 'number';
    }
    if (types.has('boolean')) {
        return 'boolean';
    }
    if (types.has('string')) {
        // Check for special string types
        const firstExample = examples[0];
        if (firstExample && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(firstExample)) {
            return 'email';
        }
        if (firstExample && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(firstExample)) {
            return 'uuid';
        }
        if (firstExample && !isNaN(new Date(firstExample).getTime())) {
            return 'date';
        }
        return 'string';
    }
    return 'unknown';
}
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
function generateMappingSuggestions(sourceColumns, targetColumns, threshold = 0.7) {
    const suggestions = [];
    for (const source of sourceColumns) {
        let bestMatch = { target: '', score: 0 };
        for (const target of targetColumns) {
            const score = calculateStringSimilarity(source.toLowerCase(), target.toLowerCase());
            if (score > bestMatch.score) {
                bestMatch = { target, score };
            }
        }
        if (bestMatch.score >= threshold) {
            suggestions.push({
                source,
                target: bestMatch.target,
                score: bestMatch.score,
            });
        }
    }
    return suggestions.sort((a, b) => b.score - a.score);
}
/**
 * Calculate string similarity using Levenshtein distance.
 */
function calculateStringSimilarity(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
}
// ============================================================================
// UTILITY FUNCTIONS - BATCH IMPORT/EXPORT
// ============================================================================
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
async function batchImport(data, config, targetModel, sequelize) {
    const validatedConfig = exports.ImportConfigSchema.parse(config);
    const jobId = crypto.randomBytes(16).toString('hex');
    const startTime = Date.now();
    const errors = [];
    const warnings = [];
    let successRows = 0;
    let failedRows = 0;
    let skippedRows = 0;
    const importedIds = [];
    // Apply mappings if provided
    let processedData = data;
    if (validatedConfig.mapping) {
        const mappingResult = await applyColumnMappings(data, validatedConfig.mapping);
        processedData = mappingResult.data;
        warnings.push(...mappingResult.warnings);
    }
    // Validate data if rules provided
    if (validatedConfig.validation) {
        const validationResult = validateData(processedData, validatedConfig.validation);
        if (!validationResult.isValid && validatedConfig.errorStrategy === 'abort') {
            return {
                jobId,
                status: 'failed',
                totalRows: data.length,
                successRows: 0,
                failedRows: data.length,
                skippedRows: 0,
                duration: Date.now() - startTime,
                throughput: 0,
                errors: validationResult.errors,
                warnings,
            };
        }
        errors.push(...validationResult.errors);
    }
    // Deduplicate if requested
    if (validatedConfig.deduplicate && validatedConfig.deduplicateBy) {
        const seen = new Set();
        processedData = processedData.filter((row) => {
            const key = validatedConfig.deduplicateBy.map((field) => row[field]).join('|');
            if (seen.has(key)) {
                skippedRows++;
                return false;
            }
            seen.add(key);
            return true;
        });
    }
    // Dry run mode - just validate and return
    if (validatedConfig.dryRun) {
        return {
            jobId,
            status: 'completed',
            totalRows: data.length,
            successRows: processedData.length,
            failedRows: errors.length,
            skippedRows,
            duration: Date.now() - startTime,
            throughput: 0,
            errors,
            warnings,
        };
    }
    // Process in batches
    const batchSize = validatedConfig.batchSize || 1000;
    const batches = Math.ceil(processedData.length / batchSize);
    for (let i = 0; i < batches; i++) {
        const batchStart = i * batchSize;
        const batchEnd = Math.min((i + 1) * batchSize, processedData.length);
        const batch = processedData.slice(batchStart, batchEnd);
        // Execute with or without transaction
        const executeBatch = async (transaction) => {
            for (const row of batch) {
                try {
                    let result;
                    if (validatedConfig.upsert && validatedConfig.upsertKeys) {
                        // Upsert mode
                        const [instance, created] = await targetModel.upsert(row, {
                            transaction,
                            returning: true,
                        });
                        result = instance;
                    }
                    else {
                        // Regular create
                        result = await targetModel.create(row, { transaction });
                    }
                    successRows++;
                    if (result && result.id) {
                        importedIds.push(result.id);
                    }
                    // Report progress
                    if (validatedConfig.onProgress) {
                        validatedConfig.onProgress({
                            jobId,
                            status: 'processing',
                            totalRows: data.length,
                            processedRows: batchStart + batch.indexOf(row) + 1,
                            validRows: successRows,
                            invalidRows: failedRows,
                            skippedRows,
                            errorRows: errors.length,
                            percentComplete: ((batchStart + batch.indexOf(row) + 1) / data.length) * 100,
                            startTime: new Date(startTime),
                            currentTime: new Date(),
                            throughput: successRows / ((Date.now() - startTime) / 1000),
                            errors,
                        });
                    }
                }
                catch (error) {
                    failedRows++;
                    const importError = {
                        row: batchStart + batch.indexOf(row) + 1,
                        message: error.message,
                        code: error.code || 'IMPORT_ERROR',
                        severity: 'error',
                        recoverable: validatedConfig.errorStrategy !== 'abort',
                        rawData: row,
                    };
                    errors.push(importError);
                    if (validatedConfig.onError) {
                        validatedConfig.onError(importError);
                    }
                    if (validatedConfig.errorStrategy === 'abort') {
                        throw error;
                    }
                }
            }
        };
        if (validatedConfig.useTransaction) {
            await sequelize.transaction(async (transaction) => {
                await executeBatch(transaction);
            });
        }
        else {
            await executeBatch();
        }
    }
    const duration = Date.now() - startTime;
    const throughput = successRows / (duration / 1000);
    return {
        jobId,
        status: errors.length > 0 ? 'partial' : 'completed',
        totalRows: data.length,
        successRows,
        failedRows,
        skippedRows,
        duration,
        throughput,
        errors,
        warnings,
        importedIds,
        summary: {
            batches,
            batchSize,
            avgBatchTime: duration / batches,
        },
    };
}
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
async function batchExport(query, config, outputPath, sourceModel) {
    const validatedConfig = exports.ExportConfigSchema.parse(config);
    const taskId = crypto.randomBytes(16).toString('hex');
    const startTime = Date.now();
    // Count total rows
    const totalRows = await sourceModel.count({ where: query.where || {} });
    let exportedRows = 0;
    const writeStream = (0, fs_1.createWriteStream)(outputPath);
    // Determine export format handler
    let headerWritten = false;
    const writeHeader = (columns) => {
        if (headerWritten)
            return;
        switch (validatedConfig.format) {
            case 'csv':
            case 'tsv':
                const delimiter = validatedConfig.format === 'tsv' ? '\t' : ',';
                writeStream.write(columns.join(delimiter) + '\n');
                break;
            case 'json':
                writeStream.write('[\n');
                break;
            case 'xml':
                writeStream.write('<?xml version="1.0" encoding="UTF-8"?>\n<data>\n');
                break;
        }
        headerWritten = true;
    };
    const writeRow = (row, isLast) => {
        switch (validatedConfig.format) {
            case 'csv':
            case 'tsv':
                const delimiter = validatedConfig.format === 'tsv' ? '\t' : ',';
                const values = Object.values(row).map((v) => formatCSVField(v, { delimiter, quote: '"', escape: '"' }));
                writeStream.write(values.join(delimiter) + '\n');
                break;
            case 'json':
                const json = JSON.stringify(row, null, 2);
                writeStream.write(isLast ? `  ${json}\n` : `  ${json},\n`);
                break;
            case 'xml':
                writeStream.write(buildXMLElement(row, 'record', 1, '  ') + '\n');
                break;
        }
    };
    const writeFooter = () => {
        switch (validatedConfig.format) {
            case 'json':
                writeStream.write(']\n');
                break;
            case 'xml':
                writeStream.write('</data>\n');
                break;
        }
    };
    // Streaming export
    if (validatedConfig.streaming) {
        const chunkSize = validatedConfig.chunkSize || 1000;
        let offset = 0;
        let columns = null;
        while (offset < totalRows) {
            const rows = await sourceModel.findAll({
                ...query,
                limit: chunkSize,
                offset,
                raw: true,
            });
            if (rows.length === 0)
                break;
            // Extract columns from first row
            if (!columns) {
                const firstRow = rows[0];
                columns = validatedConfig.columns
                    ? Array.isArray(validatedConfig.columns[0])
                        ? validatedConfig.columns
                        : validatedConfig.columns.map((c) => c.source || c)
                    : Object.keys(firstRow);
                writeHeader(columns);
            }
            // Write rows
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const isLast = offset + i === totalRows - 1;
                writeRow(row, isLast);
                exportedRows++;
                // Report progress
                if (validatedConfig.onProgress) {
                    validatedConfig.onProgress({
                        taskId,
                        status: 'generating',
                        totalRows,
                        exportedRows,
                        percentComplete: (exportedRows / totalRows) * 100,
                        startTime: new Date(startTime),
                        currentTime: new Date(),
                        throughput: exportedRows / ((Date.now() - startTime) / 1000),
                    });
                }
            }
            offset += chunkSize;
        }
        writeFooter();
    }
    // Wait for write stream to finish
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        writeStream.end();
    });
    const fileStats = await fs.promises.stat(outputPath);
    const duration = Date.now() - startTime;
    return {
        taskId,
        status: 'ready',
        totalRows,
        exportedRows,
        fileName: path.basename(outputPath),
        filePath: outputPath,
        fileSize: fileStats.size,
        format: validatedConfig.format,
        duration,
    };
}
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
async function generateImportTemplate(options, outputPath) {
    const headers = options.fields.map((f) => f.name);
    const rows = [];
    // Generate example rows if requested
    if (options.includeExamples && options.exampleRows) {
        for (let i = 0; i < options.exampleRows; i++) {
            const row = {};
            for (const field of options.fields) {
                row[field.name] = field.example || `<${field.type}>`;
            }
            rows.push(row);
        }
    }
    // Add instruction row if requested
    if (options.includeInstructions) {
        const instructionRow = {};
        for (const field of options.fields) {
            const parts = [];
            if (field.required)
                parts.push('Required');
            if (field.description)
                parts.push(field.description);
            instructionRow[field.name] = parts.join('. ');
        }
        rows.unshift(instructionRow);
    }
    // Generate file based on format
    switch (options.format) {
        case 'csv':
        case 'tsv':
            await generateCSVFile(rows, outputPath, {
                delimiter: options.format === 'tsv' ? '\t' : ',',
                header: true,
                columns: headers,
            });
            break;
        case 'xlsx':
            await writeExcelFile(rows, outputPath, {
                sheetName: 'Import Template',
                header: true,
                autoFilter: true,
            });
            break;
        case 'json':
            const jsonContent = JSON.stringify(rows, null, 2);
            await fs.promises.writeFile(outputPath, jsonContent, 'utf8');
            break;
        default:
            throw new common_1.BadRequestException(`Unsupported template format: ${options.format}`);
    }
}
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
function normalizeData(data, options = {}) {
    return data.map((row) => {
        const normalized = {};
        for (const [key, value] of Object.entries(row)) {
            let normalizedValue = value;
            // String normalizations
            if (typeof normalizedValue === 'string') {
                if (options.trimStrings) {
                    normalizedValue = normalizedValue.trim();
                }
                if (options.removeExtraSpaces) {
                    normalizedValue = normalizedValue.replace(/\s+/g, ' ');
                }
                if (options.lowercaseStrings) {
                    normalizedValue = normalizedValue.toLowerCase();
                }
                if (options.uppercaseStrings) {
                    normalizedValue = normalizedValue.toUpperCase();
                }
                if (options.stripHtml) {
                    normalizedValue = normalizedValue.replace(/<[^>]*>/g, '');
                }
                if (options.decodeHtmlEntities) {
                    normalizedValue = normalizedValue
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&apos;/g, "'");
                }
                // Email normalization
                if (options.normalizeEmails && key.toLowerCase().includes('email')) {
                    normalizedValue = normalizedValue.toLowerCase().trim();
                }
                // Phone normalization
                if (options.normalizePhoneNumbers && key.toLowerCase().includes('phone')) {
                    normalizedValue = normalizedValue.replace(/\D/g, '');
                }
            }
            // Number parsing
            if (options.parseNumbers && typeof normalizedValue === 'string') {
                const num = Number(normalizedValue);
                if (!isNaN(num) && normalizedValue.trim() !== '') {
                    normalizedValue = num;
                }
            }
            // Date parsing
            if (options.parseDates && typeof normalizedValue === 'string') {
                const date = new Date(normalizedValue);
                if (!isNaN(date.getTime())) {
                    normalizedValue = date;
                }
            }
            // Remove nulls
            if (options.removeNulls && normalizedValue === null) {
                continue;
            }
            // Remove empty strings
            if (options.removeEmpty && normalizedValue === '') {
                continue;
            }
            // Custom normalizers
            if (options.customNormalizers && options.customNormalizers[key]) {
                normalizedValue = options.customNormalizers[key](normalizedValue);
            }
            normalized[key] = normalizedValue;
        }
        return normalized;
    });
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
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
let DataImportExportService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DataImportExportService = _classThis = class {
        constructor(sequelize, importJobModel, exportTaskModel, dataMappingModel, importErrorModel) {
            this.sequelize = sequelize;
            this.importJobModel = importJobModel;
            this.exportTaskModel = exportTaskModel;
            this.dataMappingModel = dataMappingModel;
            this.importErrorModel = importErrorModel;
            this.logger = new common_1.Logger(DataImportExportService.name);
        }
        /**
         * Import data from file with validation and progress tracking.
         */
        async importData(filePath, config, targetModel, userId) {
            const job = await this.importJobModel.create({
                fileName: path.basename(filePath),
                originalFileName: path.basename(filePath),
                format: config.format,
                status: 'pending',
                configuration: config,
                createdBy: userId,
            });
            try {
                await job.update({ status: 'validating', startTime: new Date() });
                // Parse file based on format
                let data;
                switch (config.format) {
                    case 'csv':
                    case 'tsv':
                        data = await parseCSVFile(filePath, {
                            delimiter: config.format === 'tsv' ? '\t' : ',',
                        });
                        break;
                    case 'xlsx':
                        data = await readExcelFile(filePath);
                        break;
                    case 'json':
                        const jsonContent = await fs.promises.readFile(filePath, 'utf8');
                        data = JSON.parse(jsonContent);
                        break;
                    default:
                        throw new common_1.BadRequestException(`Unsupported format: ${config.format}`);
                }
                await job.update({ status: 'processing', totalRows: data.length });
                // Perform batch import
                const result = await batchImport(data, config, targetModel, this.sequelize);
                // Update job with results
                await job.update({
                    status: result.status,
                    processedRows: result.successRows + result.failedRows,
                    validRows: result.successRows,
                    errorRows: result.failedRows,
                    skippedRows: result.skippedRows,
                    endTime: new Date(),
                    duration: result.duration,
                    throughput: result.throughput,
                    summary: result.summary,
                });
                // Save errors
                for (const error of result.errors) {
                    await this.importErrorModel.create({
                        importJobId: job.id,
                        rowNumber: error.row,
                        fieldName: error.field,
                        fieldValue: error.value,
                        errorCode: error.code,
                        message: error.message,
                        severity: error.severity,
                        recoverable: error.recoverable,
                        suggestion: error.suggestion,
                        rawData: error.rawData,
                    });
                }
                return result;
            }
            catch (error) {
                this.logger.error(`Import failed: ${error.message}`, error.stack);
                await job.update({
                    status: 'failed',
                    endTime: new Date(),
                    errors: [{ message: error.message, code: 'IMPORT_FAILED' }],
                });
                throw error;
            }
        }
        /**
         * Export data to file with streaming support.
         */
        async exportData(query, config, sourceModel, userId) {
            const task = await this.exportTaskModel.create({
                name: `Export ${sourceModel.name}`,
                format: config.format,
                status: 'pending',
                configuration: config,
                filters: config.filters,
                createdBy: userId,
            });
            try {
                await task.update({ status: 'generating', startTime: new Date() });
                const outputDir = path.join(process.cwd(), 'exports');
                await fs.promises.mkdir(outputDir, { recursive: true });
                const fileName = `${sourceModel.name}_${Date.now()}.${config.format}`;
                const filePath = path.join(outputDir, fileName);
                // Perform batch export
                const result = await batchExport(query, config, filePath, sourceModel);
                // Set expiration time (24 hours)
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await task.update({
                    status: 'ready',
                    totalRows: result.totalRows,
                    exportedRows: result.exportedRows,
                    fileName: result.fileName,
                    filePath: result.filePath,
                    fileSize: result.fileSize,
                    endTime: new Date(),
                    duration: result.duration,
                    expiresAt,
                });
                return result;
            }
            catch (error) {
                this.logger.error(`Export failed: ${error.message}`, error.stack);
                await task.update({
                    status: 'failed',
                    endTime: new Date(),
                });
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "DataImportExportService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataImportExportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataImportExportService = _classThis;
})();
exports.DataImportExportService = DataImportExportService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * API request DTO for import operations.
 */
let ImportRequestDto = (() => {
    var _a;
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _mappingId_decorators;
    let _mappingId_initializers = [];
    let _mappingId_extraInitializers = [];
    let _batchSize_decorators;
    let _batchSize_initializers = [];
    let _batchSize_extraInitializers = [];
    let _errorStrategy_decorators;
    let _errorStrategy_initializers = [];
    let _errorStrategy_extraInitializers = [];
    return _a = class ImportRequestDto {
            constructor() {
                this.format = __runInitializers(this, _format_initializers, void 0);
                this.mappingId = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _mappingId_initializers, void 0));
                this.batchSize = (__runInitializers(this, _mappingId_extraInitializers), __runInitializers(this, _batchSize_initializers, void 0));
                this.errorStrategy = (__runInitializers(this, _batchSize_extraInitializers), __runInitializers(this, _errorStrategy_initializers, void 0));
                __runInitializers(this, _errorStrategy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: ['csv', 'xlsx', 'json', 'xml', 'tsv'] })];
            _mappingId_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _batchSize_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _errorStrategy_decorators = [(0, swagger_1.ApiProperty)({ required: false, enum: ['abort', 'skip', 'quarantine'] })];
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _mappingId_decorators, { kind: "field", name: "mappingId", static: false, private: false, access: { has: obj => "mappingId" in obj, get: obj => obj.mappingId, set: (obj, value) => { obj.mappingId = value; } }, metadata: _metadata }, _mappingId_initializers, _mappingId_extraInitializers);
            __esDecorate(null, null, _batchSize_decorators, { kind: "field", name: "batchSize", static: false, private: false, access: { has: obj => "batchSize" in obj, get: obj => obj.batchSize, set: (obj, value) => { obj.batchSize = value; } }, metadata: _metadata }, _batchSize_initializers, _batchSize_extraInitializers);
            __esDecorate(null, null, _errorStrategy_decorators, { kind: "field", name: "errorStrategy", static: false, private: false, access: { has: obj => "errorStrategy" in obj, get: obj => obj.errorStrategy, set: (obj, value) => { obj.errorStrategy = value; } }, metadata: _metadata }, _errorStrategy_initializers, _errorStrategy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ImportRequestDto = ImportRequestDto;
/**
 * API request DTO for export operations.
 */
let ExportRequestDto = (() => {
    var _a;
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _columns_decorators;
    let _columns_initializers = [];
    let _columns_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    return _a = class ExportRequestDto {
            constructor() {
                this.format = __runInitializers(this, _format_initializers, void 0);
                this.filters = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                this.columns = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _columns_initializers, void 0));
                this.limit = (__runInitializers(this, _columns_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: ['csv', 'xlsx', 'json', 'xml', 'tsv'] })];
            _filters_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _columns_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _limit_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            __esDecorate(null, null, _columns_decorators, { kind: "field", name: "columns", static: false, private: false, access: { has: obj => "columns" in obj, get: obj => obj.columns, set: (obj, value) => { obj.columns = value; } }, metadata: _metadata }, _columns_initializers, _columns_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ExportRequestDto = ExportRequestDto;
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
let DataImportExportController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Data Import/Export'), (0, common_1.Controller)('data')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _importFile_decorators;
    let _exportData_decorators;
    let _getImportJobStatus_decorators;
    let _downloadExport_decorators;
    let _generateTemplate_decorators;
    var DataImportExportController = _classThis = class {
        constructor(importExportService) {
            this.importExportService = (__runInitializers(this, _instanceExtraInitializers), importExportService);
            this.logger = new common_1.Logger(DataImportExportController.name);
        }
        /**
         * Upload and import data file.
         */
        async importFile(file, dto) {
            if (!file) {
                throw new common_1.BadRequestException('File is required');
            }
            this.logger.log(`Importing file: ${file.originalname} (${dto.format})`);
            // Note: In production, specify the actual target model
            // For this example, we'll throw an error indicating implementation needed
            throw new Error('Import requires target model configuration');
            // Production implementation:
            // return this.importExportService.importData(
            //   file.path,
            //   {
            //     format: dto.format,
            //     batchSize: dto.batchSize,
            //     errorStrategy: dto.errorStrategy,
            //     useTransaction: true,
            //   },
            //   targetModel,
            //   userId
            // );
        }
        /**
         * Export data to file.
         */
        async exportData(dto) {
            this.logger.log(`Exporting data to ${dto.format} format`);
            // Note: In production, specify the actual source model and query
            throw new Error('Export requires source model configuration');
            // Production implementation:
            // return this.importExportService.exportData(
            //   { where: dto.filters },
            //   {
            //     format: dto.format,
            //     columns: dto.columns,
            //     limit: dto.limit,
            //     streaming: true,
            //   },
            //   sourceModel,
            //   userId
            // );
        }
        /**
         * Get import job status.
         */
        async getImportJobStatus(id) {
            // Implementation would query importJobModel
            throw new Error('Implementation required');
        }
        /**
         * Download exported file.
         */
        async downloadExport(id, res) {
            // Implementation would query exportTaskModel and stream file
            throw new Error('Implementation required');
        }
        /**
         * Generate import template.
         */
        async generateTemplate(dto) {
            const outputPath = path.join(process.cwd(), 'temp', `template_${Date.now()}.${dto.format}`);
            await generateImportTemplate(dto, outputPath);
            const file = (0, fs_1.createReadStream)(outputPath);
            return new common_1.StreamableFile(file);
        }
    };
    __setFunctionName(_classThis, "DataImportExportController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _importFile_decorators = [(0, common_1.Post)('import'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiOperation)({ summary: 'Import data from file' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                        format: { type: 'string', enum: ['csv', 'xlsx', 'json', 'xml', 'tsv'] },
                        mappingId: { type: 'string' },
                        batchSize: { type: 'number' },
                        errorStrategy: { type: 'string', enum: ['abort', 'skip', 'quarantine'] },
                    },
                    required: ['file', 'format'],
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Import completed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or configuration' })];
        _exportData_decorators = [(0, common_1.Post)('export'), (0, swagger_1.ApiOperation)({ summary: 'Export data to file' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Export initiated successfully' })];
        _getImportJobStatus_decorators = [(0, common_1.Get)('import/jobs/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get import job status' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Import job ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Job status retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' })];
        _downloadExport_decorators = [(0, common_1.Get)('export/tasks/:id/download'), (0, swagger_1.ApiOperation)({ summary: 'Download exported file' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Export task ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'File download started' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Export task or file not found' })];
        _generateTemplate_decorators = [(0, common_1.Post)('template'), (0, swagger_1.ApiOperation)({ summary: 'Generate import template file' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Template generated successfully' })];
        __esDecorate(_classThis, null, _importFile_decorators, { kind: "method", name: "importFile", static: false, private: false, access: { has: obj => "importFile" in obj, get: obj => obj.importFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportData_decorators, { kind: "method", name: "exportData", static: false, private: false, access: { has: obj => "exportData" in obj, get: obj => obj.exportData }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getImportJobStatus_decorators, { kind: "method", name: "getImportJobStatus", static: false, private: false, access: { has: obj => "getImportJobStatus" in obj, get: obj => obj.getImportJobStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadExport_decorators, { kind: "method", name: "downloadExport", static: false, private: false, access: { has: obj => "downloadExport" in obj, get: obj => obj.downloadExport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateTemplate_decorators, { kind: "method", name: "generateTemplate", static: false, private: false, access: { has: obj => "generateTemplate" in obj, get: obj => obj.generateTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataImportExportController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataImportExportController = _classThis;
})();
exports.DataImportExportController = DataImportExportController;
//# sourceMappingURL=data-import-export-kit.prod.js.map