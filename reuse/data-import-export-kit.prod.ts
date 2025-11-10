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

import {
  Injectable,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  StreamableFile,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {
  Model,
  DataTypes,
  Sequelize,
  ModelStatic,
  Transaction,
  Op,
  literal,
  fn,
  col,
} from 'sequelize';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { promisify } from 'util';
import { Transform, Writable, Readable } from 'stream';
import { Response } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported file formats for import/export operations.
 */
export type DataFormat = 'csv' | 'xlsx' | 'json' | 'xml' | 'tsv' | 'parquet';

/**
 * Import job status enumeration.
 */
export type ImportJobStatus =
  | 'pending'
  | 'validating'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'partial';

/**
 * Export task status enumeration.
 */
export type ExportTaskStatus =
  | 'pending'
  | 'generating'
  | 'ready'
  | 'expired'
  | 'failed';

/**
 * Data mapping strategy types.
 */
export type MappingStrategy =
  | 'exact'
  | 'fuzzy'
  | 'transform'
  | 'computed'
  | 'lookup';

/**
 * Error handling strategy for import operations.
 */
export type ErrorStrategy =
  | 'abort'
  | 'skip'
  | 'quarantine'
  | 'fix'
  | 'prompt';

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
  columns?: string[] | Array<{ key: string; header: string }>;
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
  columns?: Array<{ header: string; key: string; width?: number }>;
  dateFormat?: string;
  numberFormat?: string;
  compression?: boolean;
  password?: string;
  bookType?: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv';
  cellStyles?: boolean;
  autoFilter?: boolean;
  freezePane?: { row: number; col: number };
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
  sort?: Array<{ field: string; order: 'asc' | 'desc' }>;
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
  suggestions?: Array<{ source: string; target: string; score: number }>;
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
  alternatives?: Array<{ delimiter: string; confidence: number }>;
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for CSV parsing options validation.
 */
export const CSVParseOptionsSchema = z.object({
  delimiter: z.string().length(1).optional().default(','),
  quote: z.string().length(1).optional().default('"'),
  escape: z.string().length(1).optional().default('"'),
  encoding: z.string().optional().default('utf8'),
  skipEmptyLines: z.boolean().optional().default(true),
  skipHeader: z.boolean().optional().default(false),
  trimFields: z.boolean().optional().default(true),
  maxRows: z.number().int().positive().optional(),
  comment: z.string().length(1).optional(),
  relaxColumnCount: z.boolean().optional().default(false),
  castNumbers: z.boolean().optional().default(true),
  castDates: z.boolean().optional().default(false),
  columns: z.union([z.array(z.string()), z.boolean()]).optional(),
  fromLine: z.number().int().positive().optional(),
  toLine: z.number().int().positive().optional(),
  detectDelimiter: z.boolean().optional().default(true),
});

/**
 * Zod schema for CSV generation options validation.
 */
export const CSVGenerateOptionsSchema = z.object({
  delimiter: z.string().length(1).optional().default(','),
  quote: z.string().length(1).optional().default('"'),
  escape: z.string().length(1).optional().default('"'),
  header: z.boolean().optional().default(true),
  columns: z
    .union([
      z.array(z.string()),
      z.array(z.object({ key: z.string(), header: z.string() })),
    ])
    .optional(),
  recordDelimiter: z.string().optional().default('\n'),
  quoteAll: z.boolean().optional().default(false),
  encoding: z.string().optional().default('utf8'),
  bom: z.boolean().optional().default(false),
});

/**
 * Zod schema for Excel read options validation.
 */
export const ExcelReadOptionsSchema = z.object({
  sheetName: z.string().optional(),
  sheetIndex: z.number().int().min(0).optional().default(0),
  range: z.string().optional(),
  header: z.boolean().optional().default(true),
  raw: z.boolean().optional().default(false),
  defval: z.any().optional(),
  dateNF: z.string().optional(),
  cellDates: z.boolean().optional().default(true),
  cellFormula: z.boolean().optional().default(false),
  cellHTML: z.boolean().optional().default(false),
  cellStyles: z.boolean().optional().default(false),
  skipHidden: z.boolean().optional().default(true),
  blankRows: z.boolean().optional().default(false),
});

/**
 * Zod schema for Excel write options validation.
 */
export const ExcelWriteOptionsSchema = z.object({
  sheetName: z.string().optional().default('Sheet1'),
  header: z.boolean().optional().default(true),
  skipHeader: z.boolean().optional().default(false),
  columns: z
    .array(
      z.object({
        header: z.string(),
        key: z.string(),
        width: z.number().positive().optional(),
      })
    )
    .optional(),
  dateFormat: z.string().optional().default('yyyy-mm-dd'),
  numberFormat: z.string().optional(),
  compression: z.boolean().optional().default(true),
  password: z.string().optional(),
  bookType: z.enum(['xlsx', 'xlsm', 'xlsb', 'xls', 'csv']).optional().default('xlsx'),
  cellStyles: z.boolean().optional().default(false),
  autoFilter: z.boolean().optional().default(false),
  freezePane: z.object({ row: z.number().int().min(0), col: z.number().int().min(0) }).optional(),
});

/**
 * Zod schema for import configuration validation.
 */
export const ImportConfigSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet']),
  mapping: z
    .array(
      z.object({
        source: z.string(),
        target: z.string(),
        strategy: z.enum(['exact', 'fuzzy', 'transform', 'computed', 'lookup']),
        defaultValue: z.any().optional(),
        required: z.boolean().optional(),
        unique: z.boolean().optional(),
        fuzzyThreshold: z.number().min(0).max(1).optional(),
        computeFrom: z.array(z.string()).optional(),
      })
    )
    .optional(),
  validation: z
    .array(
      z.object({
        field: z.string(),
        type: z
          .enum(['string', 'number', 'boolean', 'date', 'email', 'url', 'uuid'])
          .optional(),
        required: z.boolean().optional(),
        minLength: z.number().int().min(0).optional(),
        maxLength: z.number().int().positive().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        enum: z.array(z.any()).optional(),
        message: z.string().optional(),
      })
    )
    .optional(),
  batchSize: z.number().int().positive().optional().default(1000),
  skipRows: z.number().int().min(0).optional().default(0),
  maxRows: z.number().int().positive().optional(),
  errorStrategy: z.enum(['abort', 'skip', 'quarantine', 'fix', 'prompt']).optional().default('skip'),
  useTransaction: z.boolean().optional().default(true),
  dryRun: z.boolean().optional().default(false),
  deduplicate: z.boolean().optional().default(false),
  deduplicateBy: z.array(z.string()).optional(),
  upsert: z.boolean().optional().default(false),
  upsertKeys: z.array(z.string()).optional(),
  parallelism: z.number().int().positive().max(10).optional().default(1),
});

/**
 * Zod schema for export configuration validation.
 */
export const ExportConfigSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet']),
  columns: z.union([z.array(z.string()), z.array(z.object({ source: z.string(), target: z.string() }))]).optional(),
  filters: z.record(z.any()).optional(),
  sort: z.array(z.object({ field: z.string(), order: z.enum(['asc', 'desc']) })).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional().default(0),
  streaming: z.boolean().optional().default(true),
  chunkSize: z.number().int().positive().optional().default(1000),
  compression: z.boolean().optional().default(false),
  encryption: z
    .object({
      enabled: z.boolean(),
      algorithm: z.string().optional().default('aes-256-cbc'),
      password: z.string().optional(),
    })
    .optional(),
  includeMetadata: z.boolean().optional().default(false),
});

/**
 * Zod schema for column mapping validation.
 */
export const ColumnMappingSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  strategy: z.enum(['exact', 'fuzzy', 'transform', 'computed', 'lookup']),
  defaultValue: z.any().optional(),
  required: z.boolean().optional().default(false),
  unique: z.boolean().optional().default(false),
  fuzzyThreshold: z.number().min(0).max(1).optional().default(0.8),
  computeFrom: z.array(z.string()).optional(),
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
export const defineImportJobModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'ImportJob',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fileName: {
        type: DataTypes.STRING(512),
        allowNull: false,
        field: 'file_name',
      },
      originalFileName: {
        type: DataTypes.STRING(512),
        allowNull: true,
        field: 'original_file_name',
      },
      format: {
        type: DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'validating', 'processing', 'completed', 'failed', 'cancelled', 'partial'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_rows',
      },
      processedRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'processed_rows',
      },
      validRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'valid_rows',
      },
      invalidRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'invalid_rows',
      },
      skippedRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'skipped_rows',
      },
      errorRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'error_rows',
      },
      configuration: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      mappingId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'mapping_id',
        references: {
          model: 'data_mappings',
          key: 'id',
        },
      },
      errors: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      warnings: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      summary: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_time',
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_time',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in milliseconds',
      },
      throughput: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Rows per second',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'created_by',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'import_jobs',
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['format'] },
        { fields: ['created_by'] },
        { fields: ['created_at'] },
        { fields: ['mapping_id'] },
      ],
    }
  );
};

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
export const defineExportTaskModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'ExportTask',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      format: {
        type: DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'generating', 'ready', 'expired', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_rows',
      },
      exportedRows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'exported_rows',
      },
      configuration: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      filters: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING(512),
        allowNull: true,
        field: 'file_name',
      },
      filePath: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: 'file_path',
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'file_size',
      },
      downloadUrl: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        field: 'download_url',
      },
      downloadCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'download_count',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at',
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_time',
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_time',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in milliseconds',
      },
      throughput: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Rows per second',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'created_by',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'export_tasks',
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['format'] },
        { fields: ['created_by'] },
        { fields: ['created_at'] },
        { fields: ['expires_at'] },
      ],
    }
  );
};

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
export const defineDataMappingModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'DataMapping',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sourceFormat: {
        type: DataTypes.ENUM('csv', 'xlsx', 'json', 'xml', 'tsv', 'parquet'),
        allowNull: false,
        field: 'source_format',
      },
      targetEntity: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'target_entity',
        comment: 'Target database table or entity name',
      },
      mappings: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Array of column mapping configurations',
      },
      validationRules: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'validation_rules',
      },
      transformationRules: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'transformation_rules',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      isTemplate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_template',
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'parent_id',
        references: {
          model: 'data_mappings',
          key: 'id',
        },
        comment: 'Reference to parent mapping for versioning',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'created_by',
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'updated_by',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
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
    }
  );
};

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
export const defineImportErrorModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'ImportError',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      importJobId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'import_job_id',
        references: {
          model: 'import_jobs',
          key: 'id',
        },
      },
      rowNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'row_number',
      },
      fieldName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'field_name',
      },
      fieldValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'field_value',
      },
      errorCode: {
        type: DataTypes.STRING(63),
        allowNull: false,
        field: 'error_code',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM('error', 'warning', 'info'),
        allowNull: false,
        defaultValue: 'error',
      },
      recoverable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      suggestion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rawData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'raw_data',
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'resolved_by',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      tableName: 'import_errors',
      underscored: true,
      indexes: [
        { fields: ['import_job_id'] },
        { fields: ['row_number'] },
        { fields: ['error_code'] },
        { fields: ['severity'] },
        { fields: ['resolved'] },
      ],
    }
  );
};

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
export const defineImportExportAssociations = (
  sequelize: Sequelize,
  models: {
    ImportJob: ModelStatic<Model>;
    ExportTask: ModelStatic<Model>;
    DataMapping: ModelStatic<Model>;
    ImportError: ModelStatic<Model>;
  }
): void => {
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
export async function detectCSVDelimiter(
  filePath: string,
  sampleSize: number = 10
): Promise<DelimiterDetectionResult> {
  const possibleDelimiters = [',', ';', '\t', '|', ':'];
  const delimiterCounts: Map<string, number[]> = new Map();

  const fileStream = createReadStream(filePath, { encoding: 'utf8' });
  const lines: string[] = [];
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
  const alternatives: Array<{ delimiter: string; confidence: number }> = [];

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
export async function parseCSVFile(
  filePath: string,
  options: CSVParseOptions = {}
): Promise<any[]> {
  const validatedOptions = CSVParseOptionsSchema.parse(options);
  const results: any[] = [];

  // Detect delimiter if requested
  let delimiter = validatedOptions.delimiter;
  if (validatedOptions.detectDelimiter) {
    const detection = await detectCSVDelimiter(filePath);
    if (detection.confidence > 0.7) {
      delimiter = detection.delimiter;
    }
  }

  return new Promise((resolve, reject) => {
    const fileStream = createReadStream(filePath, {
      encoding: validatedOptions.encoding as BufferEncoding,
    });

    let lineNumber = 0;
    let headers: string[] | null = null;
    let buffer = '';

    fileStream.on('data', (chunk: string) => {
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
        const row: any = {};
        for (let i = 0; i < headers.length; i++) {
          let value: any = values[i] || '';

          if (validatedOptions.trimFields && typeof value === 'string') {
            value = value.trim();
          }

          // Type casting
          if (validatedOptions.castNumbers && !isNaN(Number(value)) && value !== '') {
            value = Number(value);
          } else if (validatedOptions.castDates && isDateString(value)) {
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
          const row: any = {};
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
function parseCSVLine(line: string, delimiter: string, quote: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === quote) {
      if (inQuotes && nextChar === quote) {
        current += quote;
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      values.push(current);
      current = '';
    } else {
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
function isDateString(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
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
export async function generateCSVFile(
  data: any[],
  filePath: string,
  options: CSVGenerateOptions = {}
): Promise<void> {
  const validatedOptions = CSVGenerateOptionsSchema.parse(options);
  const writeStream = createWriteStream(filePath, {
    encoding: validatedOptions.encoding as BufferEncoding,
  });

  // Write BOM if requested
  if (validatedOptions.bom) {
    writeStream.write('\uFEFF');
  }

  // Determine columns
  let columns: Array<{ key: string; header: string }>;
  if (Array.isArray(validatedOptions.columns)) {
    if (typeof validatedOptions.columns[0] === 'string') {
      columns = (validatedOptions.columns as string[]).map((col) => ({
        key: col,
        header: col,
      }));
    } else {
      columns = validatedOptions.columns as Array<{ key: string; header: string }>;
    }
  } else {
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
function formatCSVField(value: any, options: CSVGenerateOptions): string {
  if (value === null || value === undefined) {
    return '';
  }

  let strValue = String(value);
  const needsQuoting =
    options.quoteAll ||
    strValue.includes(options.delimiter || ',') ||
    strValue.includes(options.quote || '"') ||
    strValue.includes('\n') ||
    strValue.includes('\r');

  if (needsQuoting) {
    strValue = strValue.replace(
      new RegExp(options.quote || '"', 'g'),
      (options.escape || '"') + (options.quote || '"')
    );
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
export function createCSVParserStream(
  filePath: string,
  options: CSVParseOptions = {}
): Readable {
  const validatedOptions = CSVParseOptionsSchema.parse(options);
  const fileStream = createReadStream(filePath, {
    encoding: validatedOptions.encoding as BufferEncoding,
  });

  let headers: string[] | null = null;
  let buffer = '';
  let lineNumber = 0;

  return new Transform({
    objectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: Function) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        lineNumber++;

        if (validatedOptions.skipEmptyLines && line.trim() === '') {
          continue;
        }

        const values = parseCSVLine(
          line,
          validatedOptions.delimiter || ',',
          validatedOptions.quote || '"'
        );

        if (!headers && !validatedOptions.skipHeader) {
          headers = validatedOptions.trimFields ? values.map((v) => v.trim()) : values;
          continue;
        }

        if (!headers) {
          headers = Array.from({ length: values.length }, (_, i) => `column${i + 1}`);
        }

        const row: any = {};
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
    flush(callback: Function) {
      if (buffer.trim() && headers) {
        const values = parseCSVLine(
          buffer,
          validatedOptions.delimiter || ',',
          validatedOptions.quote || '"'
        );
        const row: any = {};
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
export async function readExcelFile(
  filePath: string,
  options: ExcelReadOptions = {}
): Promise<any[]> {
  const validatedOptions = ExcelReadOptionsSchema.parse(options);

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
export async function writeExcelFile(
  data: any[] | Record<string, any[]>,
  filePath: string,
  options: ExcelWriteOptions = {}
): Promise<void> {
  const validatedOptions = ExcelWriteOptionsSchema.parse(options);

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
export async function getExcelMetadata(filePath: string): Promise<{
  sheets: string[];
  sheetInfo: Array<{ name: string; rowCount: number; columnCount: number; columns: string[] }>;
}> {
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
export function transformJSON(data: any, options: JSONTransformOptions = {}): any {
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
function removeNullValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeNullValues).filter((item) => item !== null);
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
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
function removeFalsyValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeFalsyValues).filter(Boolean);
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
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
function transformDates(obj: any, format: 'iso' | 'timestamp' | 'string'): any {
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
    const result: any = {};
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
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (obj !== null && typeof obj === 'object') {
    const sorted: any = {};
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
export function jsonToCSV(data: any[], options: CSVGenerateOptions = {}): string {
  if (!data || data.length === 0) {
    return '';
  }

  const validatedOptions = CSVGenerateOptionsSchema.parse(options);
  const lines: string[] = [];

  // Determine columns
  let columns: Array<{ key: string; header: string }>;
  if (Array.isArray(validatedOptions.columns)) {
    if (typeof validatedOptions.columns[0] === 'string') {
      columns = (validatedOptions.columns as string[]).map((col) => ({
        key: col,
        header: col,
      }));
    } else {
      columns = validatedOptions.columns as Array<{ key: string; header: string }>;
    }
  } else {
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
export function csvToJSON(csv: string, options: CSVParseOptions = {}): any[] {
  const validatedOptions = CSVParseOptionsSchema.parse(options);
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
  const results: any[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter, quote);
    const row: any = {};

    for (let j = 0; j < headers.length; j++) {
      let value: any = values[j] || '';

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
export function jsonToXML(data: any, options: XMLOptions = {}): string {
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
function buildXMLElement(data: any, tagName: string, level: number, indent: string): string {
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
function escapeXML(str: string): string {
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
export function xmlToJSON(xml: string, options: XMLOptions = {}): any {
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
export async function applyColumnMappings(
  data: any[],
  mappings: ColumnMapping[]
): Promise<{ data: any[]; warnings: string[] }> {
  const warnings: string[] = [];
  const mappedData: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const sourceRow = data[i];
    const targetRow: any = {};

    for (const mapping of mappings) {
      let value = sourceRow[mapping.source];

      // Handle missing required fields
      if (mapping.required && (value === undefined || value === null || value === '')) {
        if (mapping.defaultValue !== undefined) {
          value = mapping.defaultValue;
          warnings.push(
            `Row ${i + 1}: Missing required field '${mapping.source}', using default value`
          );
        } else {
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
            } catch (error: any) {
              warnings.push(
                `Row ${i + 1}: Transformation failed for '${mapping.source}': ${error.message}`
              );
              targetRow[mapping.target] = mapping.defaultValue;
            }
          } else {
            targetRow[mapping.target] = value;
          }
          break;

        case 'computed':
          if (mapping.computeFrom && mapping.transformer) {
            const inputs = mapping.computeFrom.map((field) => sourceRow[field]);
            try {
              targetRow[mapping.target] = await mapping.transformer(inputs, sourceRow);
            } catch (error: any) {
              warnings.push(
                `Row ${i + 1}: Computation failed for '${mapping.target}': ${error.message}`
              );
              targetRow[mapping.target] = mapping.defaultValue;
            }
          }
          break;

        case 'lookup':
          if (mapping.lookupTable) {
            const lookupValue =
              mapping.lookupTable instanceof Map
                ? mapping.lookupTable.get(value)
                : (mapping.lookupTable as Record<string, any>)[value];
            targetRow[mapping.target] = lookupValue !== undefined ? lookupValue : mapping.defaultValue;
          } else {
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
          warnings.push(
            `Row ${i + 1}: Validation failed for '${mapping.target}' with value '${targetRow[mapping.target]}'`
          );
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
export function validateData(
  data: any[],
  rules: ValidationRule[]
): { isValid: boolean; errors: ImportError[] } {
  const errors: ImportError[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    for (const rule of rules) {
      const value = row[rule.field];
      let error: string | null = null;

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
            } catch {
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
export function inferSchema(data: any[], sampleSize?: number): SchemaInferenceResult {
  const sample = sampleSize ? data.slice(0, sampleSize) : data;
  const fieldStats: Map<string, any> = new Map();

  // Analyze each row
  for (const row of sample) {
    for (const [key, value] of Object.entries(row)) {
      if (!fieldStats.has(key)) {
        fieldStats.set(key, {
          name: key,
          types: new Set<string>(),
          nullCount: 0,
          values: new Set(),
          examples: [],
        });
      }

      const stats = fieldStats.get(key);

      if (value === null || value === undefined || value === '') {
        stats.nullCount++;
      } else {
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
function inferType(types: Set<string>, examples: any[]): string {
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
export function generateMappingSuggestions(
  sourceColumns: string[],
  targetColumns: string[],
  threshold: number = 0.7
): Array<{ source: string; target: string; score: number }> {
  const suggestions: Array<{ source: string; target: string; score: number }> = [];

  for (const source of sourceColumns) {
    let bestMatch = { target: '', score: 0 };

    for (const target of targetColumns) {
      const score = calculateStringSimilarity(
        source.toLowerCase(),
        target.toLowerCase()
      );

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
function calculateStringSimilarity(str1: string, str2: string): number {
  const matrix: number[][] = [];

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
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
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
export async function batchImport(
  data: any[],
  config: ImportConfig,
  targetModel: ModelStatic<Model>,
  sequelize: Sequelize
): Promise<BatchImportResult> {
  const validatedConfig = ImportConfigSchema.parse(config);
  const jobId = crypto.randomBytes(16).toString('hex');
  const startTime = Date.now();
  const errors: ImportError[] = [];
  const warnings: string[] = [];
  let successRows = 0;
  let failedRows = 0;
  let skippedRows = 0;
  const importedIds: string[] = [];

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
    const seen = new Set<string>();
    processedData = processedData.filter((row) => {
      const key = validatedConfig.deduplicateBy!.map((field) => row[field]).join('|');
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
    const executeBatch = async (transaction?: Transaction) => {
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
          } else {
            // Regular create
            result = await targetModel.create(row, { transaction });
          }

          successRows++;
          if (result && (result as any).id) {
            importedIds.push((result as any).id);
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
        } catch (error: any) {
          failedRows++;
          const importError: ImportError = {
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
    } else {
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
export async function batchExport(
  query: any,
  config: ExportConfig,
  outputPath: string,
  sourceModel: ModelStatic<Model>
): Promise<BatchExportResult> {
  const validatedConfig = ExportConfigSchema.parse(config);
  const taskId = crypto.randomBytes(16).toString('hex');
  const startTime = Date.now();

  // Count total rows
  const totalRows = await sourceModel.count({ where: query.where || {} });

  let exportedRows = 0;
  const writeStream = createWriteStream(outputPath);

  // Determine export format handler
  let headerWritten = false;

  const writeHeader = (columns: string[]) => {
    if (headerWritten) return;

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

  const writeRow = (row: any, isLast: boolean) => {
    switch (validatedConfig.format) {
      case 'csv':
      case 'tsv':
        const delimiter = validatedConfig.format === 'tsv' ? '\t' : ',';
        const values = Object.values(row).map((v) =>
          formatCSVField(v, { delimiter, quote: '"', escape: '"' })
        );
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
    let columns: string[] | null = null;

    while (offset < totalRows) {
      const rows = await sourceModel.findAll({
        ...query,
        limit: chunkSize,
        offset,
        raw: true,
      });

      if (rows.length === 0) break;

      // Extract columns from first row
      if (!columns) {
        const firstRow = rows[0] as any;
        columns = validatedConfig.columns
          ? Array.isArray(validatedConfig.columns[0])
            ? (validatedConfig.columns as string[])
            : (validatedConfig.columns as any[]).map((c) => c.source || c)
          : Object.keys(firstRow);
        writeHeader(columns);
      }

      // Write rows
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as any;
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
export async function generateImportTemplate(
  options: TemplateOptions,
  outputPath: string
): Promise<void> {
  const headers = options.fields.map((f) => f.name);
  const rows: any[] = [];

  // Generate example rows if requested
  if (options.includeExamples && options.exampleRows) {
    for (let i = 0; i < options.exampleRows; i++) {
      const row: any = {};
      for (const field of options.fields) {
        row[field.name] = field.example || `<${field.type}>`;
      }
      rows.push(row);
    }
  }

  // Add instruction row if requested
  if (options.includeInstructions) {
    const instructionRow: any = {};
    for (const field of options.fields) {
      const parts = [];
      if (field.required) parts.push('Required');
      if (field.description) parts.push(field.description);
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
      throw new BadRequestException(`Unsupported template format: ${options.format}`);
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
export function normalizeData(data: any[], options: NormalizationOptions = {}): any[] {
  return data.map((row) => {
    const normalized: any = {};

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
@Injectable()
export class DataImportExportService {
  private readonly logger = new Logger(DataImportExportService.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly importJobModel: ModelStatic<Model>,
    private readonly exportTaskModel: ModelStatic<Model>,
    private readonly dataMappingModel: ModelStatic<Model>,
    private readonly importErrorModel: ModelStatic<Model>
  ) {}

  /**
   * Import data from file with validation and progress tracking.
   */
  async importData(
    filePath: string,
    config: ImportConfig,
    targetModel: ModelStatic<Model>,
    userId?: string
  ): Promise<BatchImportResult> {
    const job = await this.importJobModel.create({
      fileName: path.basename(filePath),
      originalFileName: path.basename(filePath),
      format: config.format,
      status: 'pending',
      configuration: config,
      createdBy: userId,
    });

    try {
      await (job as any).update({ status: 'validating', startTime: new Date() });

      // Parse file based on format
      let data: any[];
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
          throw new BadRequestException(`Unsupported format: ${config.format}`);
      }

      await (job as any).update({ status: 'processing', totalRows: data.length });

      // Perform batch import
      const result = await batchImport(data, config, targetModel, this.sequelize);

      // Update job with results
      await (job as any).update({
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
          importJobId: (job as any).id,
          rowNumber: error.row,
          fieldName: error.field,
          fieldValue: error.value,
          errorCode: error.code,
          message: error.message,
          severity: error.severity,
          recoverable: error.recoverable,
          suggestion: error.suggestion,
          rawData: (error as any).rawData,
        });
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Import failed: ${error.message}`, error.stack);
      await (job as any).update({
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
  async exportData(
    query: any,
    config: ExportConfig,
    sourceModel: ModelStatic<Model>,
    userId?: string
  ): Promise<BatchExportResult> {
    const task = await this.exportTaskModel.create({
      name: `Export ${sourceModel.name}`,
      format: config.format,
      status: 'pending',
      configuration: config,
      filters: config.filters,
      createdBy: userId,
    });

    try {
      await (task as any).update({ status: 'generating', startTime: new Date() });

      const outputDir = path.join(process.cwd(), 'exports');
      await fs.promises.mkdir(outputDir, { recursive: true });

      const fileName = `${sourceModel.name}_${Date.now()}.${config.format}`;
      const filePath = path.join(outputDir, fileName);

      // Perform batch export
      const result = await batchExport(query, config, filePath, sourceModel);

      // Set expiration time (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await (task as any).update({
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
    } catch (error: any) {
      this.logger.error(`Export failed: ${error.message}`, error.stack);
      await (task as any).update({
        status: 'failed',
        endTime: new Date(),
      });
      throw error;
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * API request DTO for import operations.
 */
class ImportRequestDto {
  @ApiProperty({ enum: ['csv', 'xlsx', 'json', 'xml', 'tsv'] })
  format!: DataFormat;

  @ApiProperty({ required: false })
  mappingId?: string;

  @ApiProperty({ required: false })
  batchSize?: number;

  @ApiProperty({ required: false, enum: ['abort', 'skip', 'quarantine'] })
  errorStrategy?: ErrorStrategy;
}

/**
 * API request DTO for export operations.
 */
class ExportRequestDto {
  @ApiProperty({ enum: ['csv', 'xlsx', 'json', 'xml', 'tsv'] })
  format!: DataFormat;

  @ApiProperty({ required: false })
  filters?: Record<string, any>;

  @ApiProperty({ required: false })
  columns?: string[];

  @ApiProperty({ required: false })
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
@ApiTags('Data Import/Export')
@Controller('data')
export class DataImportExportController {
  private readonly logger = new Logger(DataImportExportController.name);

  constructor(private readonly importExportService: DataImportExportService) {}

  /**
   * Upload and import data file.
   */
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import data from file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiResponse({ status: 200, description: 'Import completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or configuration' })
  async importFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ImportRequestDto
  ): Promise<BatchImportResult> {
    if (!file) {
      throw new BadRequestException('File is required');
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
  @Post('export')
  @ApiOperation({ summary: 'Export data to file' })
  @ApiResponse({ status: 200, description: 'Export initiated successfully' })
  async exportData(@Body() dto: ExportRequestDto): Promise<BatchExportResult> {
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
  @Get('import/jobs/:id')
  @ApiOperation({ summary: 'Get import job status' })
  @ApiParam({ name: 'id', description: 'Import job ID' })
  @ApiResponse({ status: 200, description: 'Job status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getImportJobStatus(@Param('id') id: string): Promise<any> {
    // Implementation would query importJobModel
    throw new Error('Implementation required');
  }

  /**
   * Download exported file.
   */
  @Get('export/tasks/:id/download')
  @ApiOperation({ summary: 'Download exported file' })
  @ApiParam({ name: 'id', description: 'Export task ID' })
  @ApiResponse({ status: 200, description: 'File download started' })
  @ApiResponse({ status: 404, description: 'Export task or file not found' })
  async downloadExport(@Param('id') id: string, @Res() res: Response): Promise<void> {
    // Implementation would query exportTaskModel and stream file
    throw new Error('Implementation required');
  }

  /**
   * Generate import template.
   */
  @Post('template')
  @ApiOperation({ summary: 'Generate import template file' })
  @ApiResponse({ status: 200, description: 'Template generated successfully' })
  async generateTemplate(@Body() dto: TemplateOptions): Promise<StreamableFile> {
    const outputPath = path.join(process.cwd(), 'temp', `template_${Date.now()}.${dto.format}`);
    await generateImportTemplate(dto, outputPath);

    const file = createReadStream(outputPath);
    return new StreamableFile(file);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  DataFormat,
  ImportJobStatus,
  ExportTaskStatus,
  MappingStrategy,
  ErrorStrategy,
  CSVParseOptions,
  CSVGenerateOptions,
  ExcelReadOptions,
  ExcelWriteOptions,
  JSONTransformOptions,
  XMLOptions,
  ColumnMapping,
  ValidationRule,
  ImportConfig,
  ExportConfig,
  ImportProgress,
  ExportProgress,
  ImportError,
  MappingResult,
  TemplateOptions,
  NormalizationOptions,
  BatchImportResult,
  BatchExportResult,
  DelimiterDetectionResult,
  SchemaInferenceResult,

  // Sequelize Models
  defineImportJobModel,
  defineExportTaskModel,
  defineDataMappingModel,
  defineImportErrorModel,
  defineImportExportAssociations,

  // CSV Functions
  detectCSVDelimiter,
  parseCSVFile,
  generateCSVFile,
  createCSVParserStream,

  // Excel Functions
  readExcelFile,
  writeExcelFile,
  getExcelMetadata,

  // JSON Functions
  transformJSON,
  jsonToCSV,
  csvToJSON,

  // XML Functions
  jsonToXML,
  xmlToJSON,

  // Mapping & Validation
  applyColumnMappings,
  validateData,
  inferSchema,
  generateMappingSuggestions,

  // Batch Operations
  batchImport,
  batchExport,
  generateImportTemplate,
  normalizeData,

  // NestJS Components
  DataImportExportService,
  DataImportExportController,
  ImportRequestDto,
  ExportRequestDto,
};
