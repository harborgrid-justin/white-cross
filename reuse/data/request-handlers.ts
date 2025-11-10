/**
 * NestJS Request Handlers - Enterprise-Ready Request Processing Utilities
 *
 * Production-grade request handlers for NestJS controllers supporting:
 * - Generic CRUD operations
 * - Bulk and batch operations
 * - File upload/download with streaming
 * - Multipart form data handling
 * - Pagination, sorting, and filtering
 * - Search functionality
 * - Data export (CSV, Excel, JSON)
 * - Data import with validation
 * - Webhook handling
 * - Server-Sent Events (SSE)
 * - Long-polling
 *
 * @module request-handlers
 */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, Subject, interval } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { pipeline } from 'stream/promises';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';
import * as path from 'path';
import * as crypto from 'crypto';
import { Readable } from 'stream';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Generic entity interface
 */
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * CRUD service interface
 */
export interface CrudService<T extends BaseEntity> {
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(filter?: any): Promise<number>;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Sorting options
 */
export interface SortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

/**
 * Filter options
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * Find options combining pagination, sorting, and filtering
 */
export interface FindOptions {
  pagination?: PaginationOptions;
  sort?: SortOptions[];
  filter?: FilterOptions;
  search?: string;
  relations?: string[];
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult<T = any> {
  successful: T[];
  failed: Array<{
    index: number;
    data: any;
    error: string;
  }>;
  summary: {
    total: number;
    successCount: number;
    failureCount: number;
  };
}

/**
 * File upload result
 */
export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  hash?: string;
}

/**
 * Chunk upload metadata
 */
export interface ChunkMetadata {
  uploadId: string;
  filename: string;
  chunkIndex: number;
  totalChunks: number;
  chunkSize: number;
  totalSize: number;
  hash?: string;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'xml';
  fields?: string[];
  filename?: string;
  includeHeaders?: boolean;
}

/**
 * Import result
 */
export interface ImportResult<T> {
  imported: T[];
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
  summary: {
    totalRows: number;
    importedCount: number;
    errorCount: number;
  };
}

/**
 * Webhook payload
 */
export interface WebhookPayload {
  event: string;
  timestamp: Date;
  data: any;
  signature?: string;
}

/**
 * SSE message
 */
export interface SSEMessage {
  id?: string;
  event?: string;
  data: any;
  retry?: number;
}

/**
 * Long polling options
 */
export interface LongPollingOptions {
  timeout: number;
  interval: number;
}

// ============================================================================
// 1. Generic CRUD Endpoint Handlers
// ============================================================================

/**
 * Generic handler for GET all resources with pagination
 */
export async function handleFindAll<T extends BaseEntity>(
  service: CrudService<T>,
  options: FindOptions,
): Promise<PaginatedResult<T>> {
  const { pagination = { page: 1, limit: 10 }, sort, filter } = options;

  const [data, total] = await Promise.all([
    service.findAll(options),
    service.count(filter),
  ]);

  const totalPages = Math.ceil(total / pagination.limit);

  return {
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1,
    },
  };
}

/**
 * Generic handler for GET single resource by ID
 */
export async function handleFindOne<T extends BaseEntity>(
  service: CrudService<T>,
  id: string,
): Promise<T> {
  const entity = await service.findOne(id);

  if (!entity) {
    throw new NotFoundException(`Resource with ID ${id} not found`);
  }

  return entity;
}

/**
 * Generic handler for POST (create) resource with comprehensive error handling.
 *
 * @param service - CRUD service instance implementing CrudService interface
 * @param data - Partial entity data for creation
 * @returns Promise resolving to created entity
 * @throws BadRequestException if creation fails
 *
 * @example
 * ```typescript
 * const newUser = await handleCreate(usersService, { name: 'John', email: 'john@example.com' });
 * ```
 */
export async function handleCreate<T extends BaseEntity>(
  service: CrudService<T>,
  data: Partial<T>,
): Promise<T> {
  try {
    return await service.create(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new BadRequestException(`Failed to create resource: ${errorMessage}`);
  }
}

/**
 * Generic handler for PUT/PATCH (update) resource with existence check.
 *
 * @param service - CRUD service instance implementing CrudService interface
 * @param id - Entity identifier
 * @param data - Partial entity data for update
 * @returns Promise resolving to updated entity
 * @throws NotFoundException if resource doesn't exist
 * @throws BadRequestException if update fails
 *
 * @example
 * ```typescript
 * const updatedUser = await handleUpdate(usersService, '123', { name: 'Jane' });
 * ```
 */
export async function handleUpdate<T extends BaseEntity>(
  service: CrudService<T>,
  id: string,
  data: Partial<T>,
): Promise<T> {
  // Check if exists
  await handleFindOne(service, id);

  try {
    return await service.update(id, data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new BadRequestException(`Failed to update resource: ${errorMessage}`);
  }
}

/**
 * Generic handler for DELETE resource with existence check.
 *
 * @param service - CRUD service instance implementing CrudService interface
 * @param id - Entity identifier
 * @returns Promise resolving when deletion completes
 * @throws NotFoundException if resource doesn't exist
 * @throws InternalServerErrorException if deletion fails
 *
 * @example
 * ```typescript
 * await handleDelete(usersService, '123');
 * ```
 */
export async function handleDelete<T extends BaseEntity>(
  service: CrudService<T>,
  id: string,
): Promise<void> {
  // Check if exists
  await handleFindOne(service, id);

  try {
    await service.delete(id);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new InternalServerErrorException(`Failed to delete resource: ${errorMessage}`);
  }
}

/**
 * Generic handler for soft delete
 */
export async function handleSoftDelete<T extends BaseEntity>(
  service: CrudService<T>,
  id: string,
): Promise<T> {
  const entity = await handleFindOne(service, id);

  return await service.update(id, {
    deletedAt: new Date(),
  } as Partial<T>);
}

// ============================================================================
// 2. Bulk Operation Handlers
// ============================================================================

/**
 * Handles bulk create operations with individual error tracking.
 * Processes all items and returns both successful and failed results.
 *
 * @param service - CRUD service instance implementing CrudService interface
 * @param items - Array of partial entity data for bulk creation
 * @returns Promise resolving to bulk operation result with success/failure details
 *
 * @example
 * ```typescript
 * const result = await handleBulkCreate(usersService, [
 *   { name: 'User1', email: 'user1@example.com' },
 *   { name: 'User2', email: 'user2@example.com' }
 * ]);
 * console.log(`Created: ${result.summary.successCount}, Failed: ${result.summary.failureCount}`);
 * ```
 */
export async function handleBulkCreate<T extends BaseEntity>(
  service: CrudService<T>,
  items: Partial<T>[],
): Promise<BulkOperationResult<T>> {
  const result: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    summary: {
      total: items.length,
      successCount: 0,
      failureCount: 0,
    },
  };

  for (let i = 0; i < items.length; i++) {
    try {
      const created = await service.create(items[i]);
      result.successful.push(created);
      result.summary.successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      result.failed.push({
        index: i,
        data: items[i],
        error: errorMessage,
      });
      result.summary.failureCount++;
    }
  }

  return result;
}

/**
 * Handles bulk update operations
 */
export async function handleBulkUpdate<T extends BaseEntity>(
  service: CrudService<T>,
  updates: Array<{ id: string; data: Partial<T> }>,
): Promise<BulkOperationResult<T>> {
  const result: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    summary: {
      total: updates.length,
      successCount: 0,
      failureCount: 0,
    },
  };

  for (let i = 0; i < updates.length; i++) {
    try {
      const updated = await service.update(updates[i].id, updates[i].data);
      result.successful.push(updated);
      result.summary.successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      result.failed.push({
        index: i,
        data: updates[i],
        error: errorMessage,
      });
      result.summary.failureCount++;
    }
  }

  return result;
}

/**
 * Handles bulk delete operations
 */
export async function handleBulkDelete<T extends BaseEntity>(
  service: CrudService<T>,
  ids: string[],
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    successful: ids,
    failed: [],
    summary: {
      total: ids.length,
      successCount: 0,
      failureCount: 0,
    },
  };

  for (let i = 0; i < ids.length; i++) {
    try {
      await service.delete(ids[i]);
      result.summary.successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      result.failed.push({
        index: i,
        data: { id: ids[i] },
        error: errorMessage,
      });
      result.summary.failureCount++;
    }
  }

  return result;
}

// ============================================================================
// 3. Batch Request Processors
// ============================================================================

/**
 * Processes batch requests in parallel with concurrency control
 */
export async function handleBatchRequests<T, R>(
  requests: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = 5,
): Promise<BulkOperationResult<R>> {
  const result: BulkOperationResult<R> = {
    successful: [],
    failed: [],
    summary: {
      total: requests.length,
      successCount: 0,
      failureCount: 0,
    },
  };

  const chunks: T[][] = [];
  for (let i = 0; i < requests.length; i += concurrency) {
    chunks.push(requests.slice(i, i + concurrency));
  }

  let index = 0;
  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map((item) => processor(item)),
    );

    results.forEach((promiseResult, chunkIndex) => {
      const currentIndex = index + chunkIndex;
      if (promiseResult.status === 'fulfilled') {
        result.successful.push(promiseResult.value);
        result.summary.successCount++;
      } else {
        const errorMessage = promiseResult.reason instanceof Error
          ? promiseResult.reason.message
          : 'Unknown error occurred';
        result.failed.push({
          index: currentIndex,
          data: chunk[chunkIndex],
          error: errorMessage,
        });
        result.summary.failureCount++;
      }
    });

    index += chunk.length;
  }

  return result;
}

/**
 * Processes requests sequentially with retry logic
 */
export async function handleSequentialBatch<T, R>(
  requests: T[],
  processor: (item: T) => Promise<R>,
  maxRetries: number = 3,
): Promise<BulkOperationResult<R>> {
  const result: BulkOperationResult<R> = {
    successful: [],
    failed: [],
    summary: {
      total: requests.length,
      successCount: 0,
      failureCount: 0,
    },
  };

  for (let i = 0; i < requests.length; i++) {
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        const response = await processor(requests[i]);
        result.successful.push(response);
        result.summary.successCount++;
        success = true;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          result.failed.push({
            index: i,
            data: requests[i],
            error: `Failed after ${maxRetries} retries: ${errorMessage}`,
          });
          result.summary.failureCount++;
        } else {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
      }
    }
  }

  return result;
}

// ============================================================================
// 4. File Upload Handlers with Streaming
// ============================================================================

/**
 * Handles single file upload with validation
 */
export async function handleFileUpload(
  file: Express.Multer.File,
  uploadDir: string = './uploads',
  allowedMimeTypes?: string[],
  maxSize?: number,
): Promise<FileUploadResult> {
  if (!file) {
    throw new BadRequestException('No file provided');
  }

  // Validate MIME type
  if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException(
      `File type ${file.mimetype} not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
    );
  }

  // Validate size
  if (maxSize && file.size > maxSize) {
    throw new BadRequestException(
      `File size ${file.size} exceeds maximum allowed size ${maxSize}`,
    );
  }

  // Generate unique filename
  const fileExt = path.extname(file.originalname);
  const filename = `${crypto.randomUUID()}${fileExt}`;
  const filePath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Calculate file hash
  const hash = crypto.createHash('sha256');
  const fileStream = createReadStream(file.path);
  fileStream.on('data', (chunk) => hash.update(chunk));

  return new Promise((resolve, reject) => {
    fileStream.on('end', async () => {
      try {
        // Move file to final location
        await fs.rename(file.path, filePath);

        resolve({
          filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: filePath,
          hash: hash.digest('hex'),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        reject(new InternalServerErrorException(`Failed to save file: ${errorMessage}`));
      }
    });

    fileStream.on('error', (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      reject(new InternalServerErrorException(`Failed to read file: ${errorMessage}`));
    });
  });
}

/**
 * Handles multiple file uploads
 */
export async function handleMultipleFileUploads(
  files: Express.Multer.File[],
  uploadDir: string = './uploads',
  allowedMimeTypes?: string[],
  maxSize?: number,
): Promise<FileUploadResult[]> {
  if (!files || files.length === 0) {
    throw new BadRequestException('No files provided');
  }

  const results: FileUploadResult[] = [];

  for (const file of files) {
    const result = await handleFileUpload(file, uploadDir, allowedMimeTypes, maxSize);
    results.push(result);
  }

  return results;
}

/**
 * Handles chunked file upload for large files
 */
export async function handleChunkedUpload(
  chunk: Buffer,
  metadata: ChunkMetadata,
  uploadDir: string = './uploads/chunks',
): Promise<{ uploadId: string; completed: boolean; progress: number }> {
  await fs.mkdir(uploadDir, { recursive: true });

  const chunkPath = path.join(uploadDir, `${metadata.uploadId}_${metadata.chunkIndex}`);
  await fs.writeFile(chunkPath, chunk);

  // Check if all chunks are uploaded
  const expectedChunks = metadata.totalChunks;
  const uploadedChunks = await fs.readdir(uploadDir);
  const relevantChunks = uploadedChunks.filter((file) =>
    file.startsWith(metadata.uploadId),
  );

  const completed = relevantChunks.length === expectedChunks;
  const progress = (relevantChunks.length / expectedChunks) * 100;

  return {
    uploadId: metadata.uploadId,
    completed,
    progress,
  };
}

/**
 * Finalizes chunked upload by merging chunks
 */
export async function finalizeChunkedUpload(
  uploadId: string,
  filename: string,
  totalChunks: number,
  chunkDir: string = './uploads/chunks',
  finalDir: string = './uploads',
): Promise<FileUploadResult> {
  await fs.mkdir(finalDir, { recursive: true });

  const finalPath = path.join(finalDir, filename);
  const writeStream = createWriteStream(finalPath);
  const hash = crypto.createHash('sha256');

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, `${uploadId}_${i}`);
    const chunkData = await fs.readFile(chunkPath);
    hash.update(chunkData);
    writeStream.write(chunkData);
    await fs.unlink(chunkPath); // Clean up chunk
  }

  writeStream.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', async () => {
      const stats = await fs.stat(finalPath);
      resolve({
        filename,
        originalName: filename,
        mimeType: 'application/octet-stream',
        size: stats.size,
        path: finalPath,
        hash: hash.digest('hex'),
      });
    });

    writeStream.on('error', (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      reject(new InternalServerErrorException(`Failed to finalize upload: ${errorMessage}`));
    });
  });
}

/**
 * Handles file download with streaming
 */
export async function handleFileDownload(
  filePath: string,
  res: Response,
  filename?: string,
  inline: boolean = false,
): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    throw new NotFoundException('File not found');
  }

  const stats = await fs.stat(filePath);
  const fileStream = createReadStream(filePath);

  const disposition = inline ? 'inline' : 'attachment';
  const downloadFilename = filename || path.basename(filePath);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Content-Disposition', `${disposition}; filename="${downloadFilename}"`);

  fileStream.pipe(res);
}

// ============================================================================
// 5. Multipart Form Handlers
// ============================================================================

/**
 * Processes multipart form data with files and fields
 */
export async function handleMultipartForm<T>(
  files: Express.Multer.File[],
  fields: Record<string, any>,
  validator?: (data: T) => Promise<boolean>,
): Promise<{ files: FileUploadResult[]; data: T }> {
  // Process files
  const uploadedFiles = await handleMultipleFileUploads(files);

  // Parse and validate fields
  const parsedData = fields as T;

  if (validator) {
    const isValid = await validator(parsedData);
    if (!isValid) {
      throw new BadRequestException('Form validation failed');
    }
  }

  return {
    files: uploadedFiles,
    data: parsedData,
  };
}

// ============================================================================
// 6. Pagination Middleware
// ============================================================================

/**
 * Extracts and validates pagination parameters from request
 */
export function extractPaginationOptions(
  query: any,
  defaultLimit: number = 10,
  maxLimit: number = 100,
): PaginationOptions {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit as string, 10) || defaultLimit),
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

// ============================================================================
// 7. Sorting Middleware
// ============================================================================

/**
 * Extracts and validates sorting parameters from request
 */
export function extractSortOptions(
  query: any,
  allowedFields: string[] = [],
): SortOptions[] {
  const sortParam = query.sort as string;

  if (!sortParam) {
    return [];
  }

  const sortOptions: SortOptions[] = [];
  const sortPairs = sortParam.split(',');

  for (const pair of sortPairs) {
    const [field, order] = pair.split(':');

    if (allowedFields.length > 0 && !allowedFields.includes(field)) {
      throw new BadRequestException(`Sorting by field '${field}' is not allowed`);
    }

    const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sortOptions.push({
      field,
      order: sortOrder,
    });
  }

  return sortOptions;
}

// ============================================================================
// 8. Filtering Middleware
// ============================================================================

/**
 * Extracts and parses filter parameters from request
 */
export function extractFilterOptions(
  query: any,
  allowedFields: string[] = [],
): FilterOptions {
  const filters: FilterOptions = {};

  // Reserved query params that are not filters
  const reservedParams = ['page', 'limit', 'sort', 'search', 'offset'];

  for (const [key, value] of Object.entries(query)) {
    if (reservedParams.includes(key)) {
      continue;
    }

    if (allowedFields.length > 0 && !allowedFields.includes(key)) {
      continue;
    }

    // Parse filter operators (e.g., field[gte]=10, field[like]=%test%)
    if (key.includes('[')) {
      const match = key.match(/^(\w+)\[(\w+)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!filters[field]) {
          filters[field] = {};
        }
        filters[field][operator] = value;
      }
    } else {
      filters[key] = value;
    }
  }

  return filters;
}

/**
 * Applies filters to query builder or dataset
 */
export function applyFilters<T>(
  data: T[],
  filters: FilterOptions,
): T[] {
  return data.filter((item) => {
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'object' && value !== null) {
        // Handle operators
        for (const [operator, operatorValue] of Object.entries(value)) {
          const itemValue = (item as any)[key];

          switch (operator) {
            case 'eq':
              if (itemValue !== operatorValue) return false;
              break;
            case 'ne':
              if (itemValue === operatorValue) return false;
              break;
            case 'gt':
              if (!(itemValue > operatorValue)) return false;
              break;
            case 'gte':
              if (!(itemValue >= operatorValue)) return false;
              break;
            case 'lt':
              if (!(itemValue < operatorValue)) return false;
              break;
            case 'lte':
              if (!(itemValue <= operatorValue)) return false;
              break;
            case 'like':
              if (!String(itemValue).includes(String(operatorValue).replace(/%/g, ''))) {
                return false;
              }
              break;
            case 'in':
              if (!Array.isArray(operatorValue) || !operatorValue.includes(itemValue)) {
                return false;
              }
              break;
          }
        }
      } else {
        // Simple equality
        if ((item as any)[key] !== value) return false;
      }
    }
    return true;
  });
}

// ============================================================================
// 9. Search Handlers
// ============================================================================

/**
 * Performs full-text search across multiple fields
 */
export function handleSearch<T>(
  data: T[],
  searchQuery: string,
  searchFields: string[],
): T[] {
  if (!searchQuery) {
    return data;
  }

  const query = searchQuery.toLowerCase();

  return data.filter((item) => {
    return searchFields.some((field) => {
      const value = (item as any)[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
}

/**
 * Advanced search with field-specific queries
 */
export function handleAdvancedSearch<T>(
  data: T[],
  searchParams: Record<string, string>,
): T[] {
  return data.filter((item) => {
    return Object.entries(searchParams).every(([field, query]) => {
      const value = (item as any)[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(query.toLowerCase());
    });
  });
}

// ============================================================================
// 10. Export Handlers (CSV, Excel, JSON)
// ============================================================================

/**
 * Exports data to CSV format
 */
export async function handleCSVExport<T>(
  data: T[],
  res: Response,
  options: ExportOptions = { format: 'csv' },
): Promise<void> {
  const filename = options.filename || `export-${Date.now()}.csv`;

  const stringifier = csvStringify({
    header: options.includeHeaders !== false,
    columns: options.fields,
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  stringifier.pipe(res);

  for (const row of data) {
    stringifier.write(row);
  }

  stringifier.end();
}

/**
 * Exports data to JSON format
 */
export async function handleJSONExport<T>(
  data: T[],
  res: Response,
  options: ExportOptions = { format: 'json' },
): Promise<void> {
  const filename = options.filename || `export-${Date.now()}.json`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const exportData = options.fields
    ? data.map((item) => {
        const filtered: any = {};
        options.fields!.forEach((field) => {
          filtered[field] = (item as any)[field];
        });
        return filtered;
      })
    : data;

  res.send(JSON.stringify(exportData, null, 2));
}

/**
 * Exports data with streaming for large datasets
 */
export async function handleStreamedExport<T>(
  dataStream: Readable,
  res: Response,
  format: 'csv' | 'json' = 'json',
  filename?: string,
): Promise<void> {
  const exportFilename = filename || `export-${Date.now()}.${format}`;

  if (format === 'csv') {
    const stringifier = csvStringify({ header: true });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
    dataStream.pipe(stringifier).pipe(res);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
    dataStream.pipe(res);
  }
}

// ============================================================================
// 11. Import Handlers with Validation
// ============================================================================

/**
 * Imports data from CSV file with validation
 */
export async function handleCSVImport<T>(
  filePath: string,
  validator: (row: any) => Promise<T>,
): Promise<ImportResult<T>> {
  const result: ImportResult<T> = {
    imported: [],
    errors: [],
    summary: {
      totalRows: 0,
      importedCount: 0,
      errorCount: 0,
    },
  };

  const parser = csvParse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const fileStream = createReadStream(filePath);
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(parser)
      .on('data', async (row) => {
        rowNumber++;
        result.summary.totalRows++;

        try {
          const validatedRow = await validator(row);
          result.imported.push(validatedRow);
          result.summary.importedCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          result.errors.push({
            row: rowNumber,
            data: row,
            error: errorMessage,
          });
          result.summary.errorCount++;
        }
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        reject(new InternalServerErrorException(`Failed to parse CSV: ${errorMessage}`));
      });
  });
}

/**
 * Imports data from JSON file with validation
 */
export async function handleJSONImport<T>(
  filePath: string,
  validator: (item: any) => Promise<T>,
): Promise<ImportResult<T>> {
  const result: ImportResult<T> = {
    imported: [],
    errors: [],
    summary: {
      totalRows: 0,
      importedCount: 0,
      errorCount: 0,
    },
  };

  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  if (!Array.isArray(data)) {
    throw new BadRequestException('JSON file must contain an array');
  }

  result.summary.totalRows = data.length;

  for (let i = 0; i < data.length; i++) {
    try {
      const validatedItem = await validator(data[i]);
      result.imported.push(validatedItem);
      result.summary.importedCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      result.errors.push({
        row: i + 1,
        data: data[i],
        error: errorMessage,
      });
      result.summary.errorCount++;
    }
  }

  return result;
}

// ============================================================================
// 12. Webhook Handlers
// ============================================================================

/**
 * Validates webhook signature
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: string = 'sha256',
): boolean {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature),
  );
}

/**
 * Handles incoming webhook with signature validation
 */
export async function handleWebhook(
  req: Request,
  secret: string,
  processor: (payload: WebhookPayload) => Promise<void>,
): Promise<{ success: boolean; message: string }> {
  const signature = req.headers['x-webhook-signature'] as string;

  if (!signature) {
    throw new BadRequestException('Missing webhook signature');
  }

  const payload = JSON.stringify(req.body);

  if (!validateWebhookSignature(payload, signature, secret)) {
    throw new BadRequestException('Invalid webhook signature');
  }

  const webhookPayload: WebhookPayload = {
    event: req.body.event,
    timestamp: new Date(req.body.timestamp || Date.now()),
    data: req.body.data,
    signature,
  };

  try {
    await processor(webhookPayload);
    return { success: true, message: 'Webhook processed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new InternalServerErrorException(`Webhook processing failed: ${errorMessage}`);
  }
}

/**
 * Sends webhook to external endpoint
 */
export async function sendWebhook(
  url: string,
  payload: WebhookPayload,
  secret: string,
): Promise<{ success: boolean; statusCode: number }> {
  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadString);
  const signature = hmac.digest('hex');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: payloadString,
    });

    return {
      success: response.ok,
      statusCode: response.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new InternalServerErrorException(`Failed to send webhook: ${errorMessage}`);
  }
}

// ============================================================================
// 13. Server-Sent Events (SSE) Handlers
// ============================================================================

/**
 * Creates SSE connection and sends messages
 */
export function handleSSE(
  res: Response,
  messageStream: Observable<SSEMessage>,
): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  const subscription = messageStream.subscribe({
    next: (message) => {
      const sseMessage = formatSSEMessage(message);
      res.write(sseMessage);
    },
    error: (error) => {
      console.error('SSE error:', error);
      res.end();
    },
    complete: () => {
      res.end();
    },
  });

  // Clean up on client disconnect
  res.on('close', () => {
    subscription.unsubscribe();
  });
}

/**
 * Formats message for SSE transmission
 */
export function formatSSEMessage(message: SSEMessage): string {
  let formatted = '';

  if (message.id) {
    formatted += `id: ${message.id}\n`;
  }

  if (message.event) {
    formatted += `event: ${message.event}\n`;
  }

  if (message.retry) {
    formatted += `retry: ${message.retry}\n`;
  }

  const data = typeof message.data === 'string'
    ? message.data
    : JSON.stringify(message.data);

  formatted += `data: ${data}\n\n`;

  return formatted;
}

/**
 * Creates a simple interval-based SSE stream
 */
export function createIntervalSSEStream<T>(
  dataProvider: () => Promise<T>,
  intervalMs: number = 1000,
): Observable<SSEMessage> {
  return new Observable((subscriber) => {
    const intervalId = setInterval(async () => {
      try {
        const data = await dataProvider();
        subscriber.next({
          event: 'message',
          data,
        });
      } catch (error) {
        subscriber.error(error);
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  });
}

// ============================================================================
// 14. Long-Polling Handlers
// ============================================================================

/**
 * Handles long-polling request with timeout
 */
export async function handleLongPolling<T>(
  dataProvider: () => Promise<T | null>,
  options: LongPollingOptions = { timeout: 30000, interval: 1000 },
): Promise<T | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < options.timeout) {
    const data = await dataProvider();

    if (data !== null) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, options.interval));
  }

  return null;
}

/**
 * Long-polling with condition check
 */
export async function handleConditionalLongPolling<T>(
  dataProvider: () => Promise<T>,
  condition: (data: T) => boolean,
  options: LongPollingOptions = { timeout: 30000, interval: 1000 },
): Promise<T | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < options.timeout) {
    const data = await dataProvider();

    if (condition(data)) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, options.interval));
  }

  return null;
}

/**
 * Long-polling for state changes
 */
export async function handleStateChangeLongPolling<T>(
  currentState: T,
  stateProvider: () => Promise<T>,
  options: LongPollingOptions = { timeout: 30000, interval: 1000 },
): Promise<T | null> {
  return handleConditionalLongPolling(
    stateProvider,
    (newState) => JSON.stringify(newState) !== JSON.stringify(currentState),
    options,
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates unique upload ID for chunked uploads
 */
export function generateUploadId(): string {
  return crypto.randomUUID();
}

/**
 * Calculates file hash for integrity verification
 */
export async function calculateFileHash(filePath: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  const stream = createReadStream(filePath);

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Validates file extension
 */
export function validateFileExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Sanitizes filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Creates a standardized API response envelope
 */
export function createResponseEnvelope<T>(
  data: T,
  statusCode: number = HttpStatus.OK,
  message: string = 'Success',
): {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
} {
  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
