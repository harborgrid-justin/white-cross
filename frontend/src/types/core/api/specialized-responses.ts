/**
 * @fileoverview Specialized API Response Type Definitions
 * @module types/core/api/specialized-responses
 * @category Types
 *
 * Domain-specific response types for specialized operations like
 * file uploads, data exports, and health checks.
 *
 * Key Features:
 * - `FileUploadResponse` for file upload operations
 * - `ExportDataResponse` for data export operations
 * - `HealthCheckResponse` for system health monitoring
 * - Detailed metadata for each specialized operation
 *
 * Design Principles:
 * - Domain-specific metadata relevant to each operation type
 * - Consistent with base ApiResponse structure
 * - Support for expiration times, file metadata, and system status
 * - Type-safe access to specialized response data
 *
 * @example
 * ```typescript
 * // File upload
 * const uploadResponse: FileUploadResponse = {
 *   success: true,
 *   data: {
 *     url: 'https://cdn.example.com/files/abc123.pdf',
 *     filename: 'medical-record.pdf',
 *     size: 1024000,
 *     mimeType: 'application/pdf'
 *   }
 * };
 *
 * // Health check
 * const healthResponse: HealthCheckResponse = {
 *   success: true,
 *   data: {
 *     status: 'healthy',
 *     version: '1.2.3',
 *     uptime: 3600
 *   }
 * };
 * ```
 */

import type { ApiResponse } from './base-responses';

// ==========================================
// SPECIALIZED RESPONSE TYPES
// ==========================================

/**
 * File Upload Response
 *
 * Response format for file upload operations.
 *
 * @example
 * ```typescript
 * const uploadResponse: FileUploadResponse = {
 *   success: true,
 *   data: {
 *     url: 'https://cdn.example.com/files/abc123.pdf',
 *     filename: 'medical-record.pdf',
 *     size: 1024000,
 *     mimeType: 'application/pdf'
 *   },
 *   message: 'File uploaded successfully'
 * };
 * ```
 */
export interface FileUploadResponse extends ApiResponse<FileUploadData> {}

/**
 * File Upload Data
 *
 * Detailed information about an uploaded file.
 *
 * @example
 * ```typescript
 * const fileData: FileUploadData = {
 *   url: 'https://cdn.example.com/files/abc123.pdf',
 *   filename: 'medical-record.pdf',
 *   size: 1024000,
 *   mimeType: 'application/pdf',
 *   key: 'uploads/abc123.pdf'
 * };
 * ```
 */
export interface FileUploadData {
  /** URL where the file can be accessed */
  url: string;

  /** Original filename */
  filename: string;

  /** File size in bytes */
  size: number;

  /** MIME type of the file */
  mimeType: string;

  /** Storage key or ID for the file */
  key?: string;
}

/**
 * Export Data Response
 *
 * Response format for data export operations.
 *
 * @example
 * ```typescript
 * const exportResponse: ExportDataResponse = {
 *   success: true,
 *   data: {
 *     url: 'https://api.example.com/exports/abc123.csv',
 *     format: 'csv',
 *     expiresAt: '2025-10-24T12:00:00Z',
 *     recordCount: 156
 *   },
 *   message: 'Export ready for download'
 * };
 * ```
 */
export interface ExportDataResponse extends ApiResponse<ExportDataInfo> {}

/**
 * Export Data Information
 *
 * Detailed information about an exported data file.
 *
 * @example
 * ```typescript
 * const exportInfo: ExportDataInfo = {
 *   url: 'https://api.example.com/exports/abc123.csv',
 *   format: 'csv',
 *   expiresAt: '2025-10-24T12:00:00Z',
 *   recordCount: 156,
 *   fileSize: 2048000
 * };
 * ```
 */
export interface ExportDataInfo {
  /** URL to download the export */
  url: string;

  /** Export format (csv, xlsx, pdf, etc.) */
  format: string;

  /** ISO timestamp when export expires */
  expiresAt: string;

  /** Number of records in export */
  recordCount: number;

  /** File size in bytes */
  fileSize?: number;
}

/**
 * Health Check Response
 *
 * Response format for health check and status endpoints.
 *
 * @example
 * ```typescript
 * const healthResponse: HealthCheckResponse = {
 *   success: true,
 *   data: {
 *     status: 'healthy',
 *     version: '1.2.3',
 *     uptime: 3600,
 *     dependencies: {
 *       database: 'healthy',
 *       cache: 'healthy',
 *       storage: 'degraded'
 *     }
 *   }
 * };
 * ```
 */
export interface HealthCheckResponse extends ApiResponse<HealthCheckData> {}

/**
 * Health Check Data
 *
 * Detailed system health information.
 *
 * @example
 * ```typescript
 * const healthData: HealthCheckData = {
 *   status: 'healthy',
 *   version: '1.2.3',
 *   uptime: 3600,
 *   dependencies: {
 *     database: 'healthy',
 *     cache: 'healthy',
 *     storage: 'degraded'
 *   },
 *   timestamp: '2025-11-12T17:15:00Z'
 * };
 * ```
 */
export interface HealthCheckData {
  /** Overall system status */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /** Application version */
  version: string;

  /** System uptime in seconds */
  uptime: number;

  /** Status of individual dependencies */
  dependencies?: Record<string, string>;

  /** ISO timestamp of the health check */
  timestamp?: string;
}
