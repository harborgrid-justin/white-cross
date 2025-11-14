/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Type Definitions Index
 *
 * This module serves as a central re-export point for all audit system type definitions,
 * maintaining backward compatibility while organizing types into logical modules.
 *
 * @module AuditTypes
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * This barrel file exports all audit types from their respective modules:
 * - **Action Types**: Enums for actions, resources, severity, and status
 * - **Event Types**: Core audit event and change tracking interfaces
 * - **Query Types**: Batch operations, filters, and statistics
 * - **Service Types**: Configuration, service contract, and health monitoring
 * - **API Types**: Backend communication request/response structures
 *
 * **Usage:**
 * Import any audit type from this index for convenience:
 *
 * @example Single Type Import
 * ```typescript
 * import { AuditAction } from '@/services/audit/types';
 * ```
 *
 * @example Multiple Type Imports
 * ```typescript
 * import {
 *   AuditAction,
 *   AuditResourceType,
 *   AuditEvent,
 *   AuditLogParams,
 *   IAuditService
 * } from '@/services/audit/types';
 * ```
 *
 * @example Type-Only Imports
 * ```typescript
 * import type {
 *   AuditEvent,
 *   AuditConfig,
 *   AuditStatistics
 * } from '@/services/audit/types';
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires TypeScript 4.5+
 * @requires HIPAA Compliance Review
 */

// ==========================================
// ACTION TYPES
// ==========================================
// Enums for audit actions, resources, severity, and status

export { AuditAction, AuditResourceType, AuditSeverity, AuditStatus } from '../action-types';

// ==========================================
// EVENT TYPES
// ==========================================
// Core audit event interfaces and change tracking

export type { AuditEvent, AuditChange, AuditLogParams } from '../audit-events';

// ==========================================
// QUERY AND BATCH TYPES
// ==========================================
// Batch operations, filtering, and statistics

export type { AuditBatch, AuditEventFilter, AuditStatistics } from '../audit-queries';

// ==========================================
// SERVICE TYPES
// ==========================================
// Service configuration, contract, and health monitoring

export type { AuditConfig } from '../audit-config';
export type { IAuditService, AuditServiceStatus } from '../audit-service-interface';

// ==========================================
// API TYPES
// ==========================================
// Backend communication structures

export type { AuditApiResponse, AuditQueryResponse } from '../api-types';
