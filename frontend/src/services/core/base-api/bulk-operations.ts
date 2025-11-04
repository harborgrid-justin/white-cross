/**
 * WF-BULK-264 | bulk-operations.ts - BaseApiService Bulk Operations
 *
 * @module services/core/base-api/bulk-operations
 * @description
 * Bulk operation implementations for efficient multi-entity operations.
 * Provides atomic bulk create, update, and delete functionality.
 *
 * @purpose
 * - Enable bulk creation of multiple entities in single request
 * - Support bulk updates with ID-data pairs
 * - Provide bulk deletion for multiple entities
 * - Ensure atomic operations (all succeed or all fail)
 *
 * @upstream ./types, ./utils, ../ApiClient
 * @dependencies BaseEntity, ApiClient, extractData
 * @downstream BaseApiService
 * @exports BulkOperationsMixin class
 *
 * @keyFeatures
 * - Atomic transaction-based bulk operations
 * - Type-safe bulk create/update/delete
 * - Efficient single-request processing
 * - Array-based entity management
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Operations Module
 * @architecture Core bulk operations layer for service architecture
 */

import type { ApiClient } from '../ApiClient';
import type { BaseEntity } from './types';
import { extractData } from './utils';

// ==========================================
// BULK OPERATIONS MIXIN
// ==========================================

/**
 * Bulk operations mixin providing multi-entity operations
 *
 * @description
 * Implements efficient bulk operations for creating, updating, and deleting
 * multiple entities in single API calls. All operations are atomic.
 *
 * @typeParam TEntity - The entity type (must extend BaseEntity)
 * @typeParam TCreateDto - The data transfer object for creating entities
 * @typeParam TUpdateDto - The data transfer object for updating entities
 */
export class BulkOperationsMixin<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> {
  constructor(
    protected client: ApiClient,
    protected baseEndpoint: string
  ) {}

  // ==========================================
  // BULK CREATE
  // ==========================================

  /**
   * Create multiple entities in a single request
   *
   * @param {TCreateDto[]} data - Array of entity data to create
   * @returns {Promise<TEntity[]>} Array of created entities with server-assigned fields
   * @throws {Error} When array is empty or validation fails
   *
   * @description
   * Efficiently creates multiple entities in one API call. This is significantly
   * faster than creating entities one at a time for bulk imports or migrations.
   *
   * The server processes all creates in a transaction, so either all succeed
   * or all fail (atomic operation).
   *
   * @example
   * ```typescript
   * const newStudents = await bulkOps.bulkCreate([
   *   { name: 'Alice Johnson', grade: 5 },
   *   { name: 'Bob Smith', grade: 6 },
   *   { name: 'Charlie Brown', grade: 5 }
   * ]);
   *
   * console.log(`Created ${newStudents.length} students`);
   * ```
   */
  public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]> {
    const response = await this.client.post<TEntity[]>(
      `${this.baseEndpoint}/bulk`,
      { items: data }
    );
    return extractData(response);
  }

  // ==========================================
  // BULK UPDATE
  // ==========================================

  /**
   * Update multiple entities in a single request
   *
   * @param {Array<{ id: string; data: TUpdateDto }>} updates - Array of entity updates with IDs and data
   * @returns {Promise<TEntity[]>} Array of updated entities
   * @throws {Error} When any ID is invalid or validation fails
   *
   * @description
   * Efficiently updates multiple entities in one API call. Each update requires
   * the entity ID and the data to update.
   *
   * Like bulkCreate, this operation is atomic - either all updates succeed or all fail.
   *
   * @example
   * ```typescript
   * const updatedStudents = await bulkOps.bulkUpdate([
   *   { id: '123', data: { grade: 6 } },
   *   { id: '456', data: { grade: 7 } },
   *   { id: '789', data: { grade: 6 } }
   * ]);
   *
   * console.log(`Updated ${updatedStudents.length} students`);
   * ```
   */
  public async bulkUpdate(
    updates: Array<{ id: string; data: TUpdateDto }>
  ): Promise<TEntity[]> {
    const response = await this.client.put<TEntity[]>(
      `${this.baseEndpoint}/bulk`,
      { updates }
    );
    return extractData(response);
  }

  // ==========================================
  // BULK DELETE
  // ==========================================

  /**
   * Delete multiple entities in a single request
   *
   * @param {string[]} ids - Array of entity IDs to delete
   * @returns {Promise<void>} Resolves when all entities are deleted
   * @throws {Error} When any ID is invalid or deletion fails
   *
   * @description
   * Efficiently deletes multiple entities in one API call. This operation is
   * atomic - either all deletions succeed or all fail.
   *
   * Use with caution as this operation is permanent and cannot be undone.
   *
   * @example
   * ```typescript
   * await bulkOps.bulkDelete(['123', '456', '789']);
   * console.log('Successfully deleted 3 students');
   * ```
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    await this.client.post(`${this.baseEndpoint}/bulk-delete`, { ids });
  }
}
