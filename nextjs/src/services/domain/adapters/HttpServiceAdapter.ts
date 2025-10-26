/**
 * @fileoverview HTTP Service Adapter for Service Contracts
 * @module services/domain/adapters/HttpServiceAdapter
 * @category Domain Services
 * 
 * Implements service contracts using HTTP/REST protocol.
 * Provides adapter pattern to decouple business logic from transport layer.
 * 
 * Key Features:
 * - Maps service contracts to HTTP endpoints
 * - Handles request/response transformation
 * - Integrates with resilience patterns
 * - HIPAA-compliant error handling
 * 
 * @example
 * ```typescript
 * const adapter = new HttpServiceAdapter(apiClient);
 * 
 * // Use adapter with service contract
 * const studentService: IStudentService = new StudentServiceAdapter(adapter);
 * const student = await studentService.enrollStudent(enrollment);
 * ```
 */

import { ResilientApiClient } from '../../core/ResilientApiClient';
import { IDataService, QueryCriteria } from '../contracts/ServiceContracts';
import { HealthcareOperationType } from '../../resilience/types';

/**
 * HTTP Service Adapter
 * Adapts HTTP/REST calls to service contract interface
 */
export class HttpServiceAdapter implements IDataService {
  private client: ResilientApiClient;

  constructor(client: ResilientApiClient) {
    this.client = client;
  }

  /**
   * Fetch data by query
   */
  async fetch<T>(query: QueryCriteria): Promise<T> {
    const params = this.buildQueryParams(query);
    const response = await this.client.get<T>(
      query.filters?.endpoint as string || '/api/query',
      HealthcareOperationType.STUDENT_LOOKUP,
      { params }
    );
    return response.data;
  }

  /**
   * Save entity
   */
  async save<T>(entity: T): Promise<T> {
    const response = await this.client.post<T>(
      this.getEndpoint(entity),
      entity,
      this.getOperationType(entity)
    );
    return response.data;
  }

  /**
   * Update entity
   */
  async update<T>(id: string, updates: Partial<T>): Promise<T> {
    const response = await this.client.put<T>(
      `${this.getEndpoint(updates)}/${id}`,
      updates,
      this.getOperationType(updates)
    );
    return response.data;
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    await this.client.delete(
      `/api/entity/${id}`,
      HealthcareOperationType.DELETE_RECORD
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get<{ status: string }>(
        '/api/health',
        HealthcareOperationType.HEALTH_CHECK
      );
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Build query parameters from criteria
   */
  private buildQueryParams(query: QueryCriteria): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    if (query.filters) {
      Object.assign(params, query.filters);
    }

    if (query.pagination) {
      params.page = query.pagination.page;
      params.pageSize = query.pagination.pageSize;
    }

    if (query.sorting) {
      params.sortBy = query.sorting.map(s => s.field).join(',');
      params.sortOrder = query.sorting.map(s => s.direction).join(',');
    }

    return params;
  }

  /**
   * Get endpoint for entity
   */
  private getEndpoint(entity: unknown): string {
    // Extract endpoint from entity metadata or use default
    if (entity && typeof entity === 'object' && '__endpoint' in entity) {
      return (entity as { __endpoint: string }).__endpoint;
    }
    return '/api/entity';
  }

  /**
   * Get operation type for entity
   */
  private getOperationType(entity: unknown): HealthcareOperationType {
    // Extract operation type from entity metadata or use default
    if (entity && typeof entity === 'object' && '__operationType' in entity) {
      return (entity as { __operationType: HealthcareOperationType }).__operationType;
    }
    return HealthcareOperationType.CREATE_RECORD;
  }
}

/**
 * Create HTTP service adapter
 */
export function createHttpServiceAdapter(client: ResilientApiClient): HttpServiceAdapter {
  return new HttpServiceAdapter(client);
}
