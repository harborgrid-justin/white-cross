/**
 * Query Key Factory
 *
 * Standardized query key generation across all modules with:
 * - Hierarchical key structure
 * - Normalized filters for consistent cache hits
 * - Type-safe key creation
 */

import type { QueryKey, NormalizedQueryKey } from './types';

/**
 * Query Key Factory Class
 *
 * Provides consistent, normalized query key generation
 * for optimal cache hit rates.
 */
export class QueryKeyFactory {
  /**
   * Create a standardized query key
   *
   * @param config - Query key configuration
   * @returns Normalized query key array
   */
  static create(config: QueryKey): unknown[] {
    const { entity, operation, id, filters, context } = config;

    // Base key structure: [entity, operation]
    const baseKey: unknown[] = [entity, operation];

    // Add ID if present
    if (id !== undefined && id !== null) {
      baseKey.push(id);
    }

    // Add normalized filters if present
    if (filters && Object.keys(filters).length > 0) {
      baseKey.push(this.normalizeFilters(filters));
    }

    // Add context if present
    if (context && Object.keys(context).length > 0) {
      baseKey.push(context);
    }

    return baseKey;
  }

  /**
   * Normalize Filters for Consistent Cache Hits
   *
   * Ensures filter objects with same values produce same keys:
   * - Sorted keys
   * - Null/undefined handling
   * - Type normalization
   *
   * @param filters - Raw filter object
   * @returns Normalized filter object
   */
  private static normalizeFilters(
    filters: Record<string, unknown>
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    // Sort keys for consistency
    const sortedKeys = Object.keys(filters).sort();

    for (const key of sortedKeys) {
      const value = filters[key];

      // Skip undefined and null (treat as equivalent)
      if (value === undefined || value === null) {
        continue;
      }

      // Normalize empty strings to undefined (skip)
      if (value === '') {
        continue;
      }

      // Normalize arrays
      if (Array.isArray(value)) {
        // Skip empty arrays
        if (value.length === 0) {
          continue;
        }
        // Sort arrays for consistency
        normalized[key] = [...value].sort();
        continue;
      }

      // Normalize objects recursively
      if (typeof value === 'object' && value !== null) {
        const normalizedObj = this.normalizeFilters(
          value as Record<string, unknown>
        );
        // Only include if has keys after normalization
        if (Object.keys(normalizedObj).length > 0) {
          normalized[key] = normalizedObj;
        }
        continue;
      }

      // Include primitive values as-is
      normalized[key] = value;
    }

    return normalized;
  }

  /**
   * Convert Query Key to String
   *
   * Useful for logging, debugging, and storage keys
   *
   * @param queryKey - Query key array
   * @returns String representation
   */
  static toString(queryKey: unknown[]): NormalizedQueryKey {
    return JSON.stringify(queryKey);
  }

  /**
   * Parse String to Query Key
   *
   * @param key - String representation
   * @returns Query key array
   */
  static fromString(key: NormalizedQueryKey): unknown[] {
    try {
      return JSON.parse(key);
    } catch {
      return [];
    }
  }

  /**
   * Extract Entity from Query Key
   *
   * @param queryKey - Query key array
   * @returns Entity type
   */
  static getEntity(queryKey: unknown[]): string {
    return queryKey[0] as string;
  }

  /**
   * Extract Operation from Query Key
   *
   * @param queryKey - Query key array
   * @returns Operation type
   */
  static getOperation(queryKey: unknown[]): string {
    return queryKey[1] as string;
  }

  /**
   * Extract ID from Query Key
   *
   * @param queryKey - Query key array
   * @returns ID if present
   */
  static getId(queryKey: unknown[]): string | number | undefined {
    if (queryKey.length < 3) return undefined;
    const thirdElement = queryKey[2];
    if (typeof thirdElement === 'string' || typeof thirdElement === 'number') {
      return thirdElement;
    }
    return undefined;
  }

  /**
   * Check if Query Keys Match Pattern
   *
   * @param queryKey - Query key to test
   * @param pattern - Pattern to match against
   * @returns Whether key matches pattern
   */
  static matches(queryKey: unknown[], pattern: Partial<QueryKey>): boolean {
    const entity = this.getEntity(queryKey);
    const operation = this.getOperation(queryKey);
    const id = this.getId(queryKey);

    if (pattern.entity && entity !== pattern.entity) {
      return false;
    }

    if (pattern.operation && operation !== pattern.operation) {
      return false;
    }

    if (pattern.id !== undefined && id !== pattern.id) {
      return false;
    }

    return true;
  }
}

/**
 * Student Query Keys
 */
export const studentKeys = {
  all: () => QueryKeyFactory.create({ entity: 'students', operation: 'all' }),

  lists: () => QueryKeyFactory.create({ entity: 'students', operation: 'list' }),

  list: (filters?: Record<string, unknown>) =>
    QueryKeyFactory.create({
      entity: 'students',
      operation: 'list',
      filters
    }),

  details: () =>
    QueryKeyFactory.create({ entity: 'students', operation: 'detail' }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'students',
      operation: 'detail',
      id
    }),

  stats: () => QueryKeyFactory.create({ entity: 'students', operation: 'stats' }),

  search: (query: string) =>
    QueryKeyFactory.create({
      entity: 'students',
      operation: 'search',
      filters: { query }
    })
};

/**
 * Health Record Query Keys
 */
export const healthRecordKeys = {
  all: () =>
    QueryKeyFactory.create({ entity: 'health-records', operation: 'all' }),

  forStudent: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'health-records',
      operation: 'list',
      filters: { studentId }
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'health-records',
      operation: 'detail',
      id
    }),

  allergies: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'health-records',
      operation: 'allergies',
      filters: { studentId }
    }),

  medications: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'health-records',
      operation: 'medications',
      filters: { studentId }
    }),

  vaccinations: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'health-records',
      operation: 'vaccinations',
      filters: { studentId }
    })
};

/**
 * Medication Query Keys
 */
export const medicationKeys = {
  all: () => QueryKeyFactory.create({ entity: 'medications', operation: 'all' }),

  lists: () =>
    QueryKeyFactory.create({ entity: 'medications', operation: 'list' }),

  list: (filters?: Record<string, unknown>) =>
    QueryKeyFactory.create({
      entity: 'medications',
      operation: 'list',
      filters
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'medications',
      operation: 'detail',
      id
    }),

  active: () =>
    QueryKeyFactory.create({
      entity: 'medications',
      operation: 'list',
      filters: { status: 'active' }
    }),

  forStudent: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'medications',
      operation: 'list',
      filters: { studentId }
    })
};

/**
 * Appointment Query Keys
 */
export const appointmentKeys = {
  all: () =>
    QueryKeyFactory.create({ entity: 'appointments', operation: 'all' }),

  lists: () =>
    QueryKeyFactory.create({ entity: 'appointments', operation: 'list' }),

  list: (filters?: Record<string, unknown>) =>
    QueryKeyFactory.create({
      entity: 'appointments',
      operation: 'list',
      filters
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'appointments',
      operation: 'detail',
      id
    }),

  upcoming: () =>
    QueryKeyFactory.create({
      entity: 'appointments',
      operation: 'list',
      filters: { status: 'upcoming' }
    }),

  forStudent: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'appointments',
      operation: 'list',
      filters: { studentId }
    })
};

/**
 * Incident Query Keys
 */
export const incidentKeys = {
  all: () => QueryKeyFactory.create({ entity: 'incidents', operation: 'all' }),

  lists: () => QueryKeyFactory.create({ entity: 'incidents', operation: 'list' }),

  list: (filters?: Record<string, unknown>) =>
    QueryKeyFactory.create({
      entity: 'incidents',
      operation: 'list',
      filters
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'incidents',
      operation: 'detail',
      id
    }),

  stats: () => QueryKeyFactory.create({ entity: 'incidents', operation: 'stats' }),

  recent: () =>
    QueryKeyFactory.create({
      entity: 'incidents',
      operation: 'list',
      filters: { recent: true }
    })
};

/**
 * Emergency Contact Query Keys
 */
export const emergencyContactKeys = {
  all: () =>
    QueryKeyFactory.create({ entity: 'emergency-contacts', operation: 'all' }),

  forStudent: (studentId: string | number) =>
    QueryKeyFactory.create({
      entity: 'emergency-contacts',
      operation: 'list',
      filters: { studentId }
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'emergency-contacts',
      operation: 'detail',
      id
    })
};

/**
 * Reference Data Query Keys
 */
export const referenceKeys = {
  schools: () => QueryKeyFactory.create({ entity: 'schools', operation: 'list' }),

  school: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'schools',
      operation: 'detail',
      id
    }),

  grades: () => QueryKeyFactory.create({ entity: 'grades', operation: 'list' }),

  districts: () =>
    QueryKeyFactory.create({ entity: 'districts', operation: 'list' }),

  lookupTable: (tableName: string) =>
    QueryKeyFactory.create({
      entity: 'lookup-tables',
      operation: 'list',
      filters: { table: tableName }
    })
};

/**
 * User Query Keys
 */
export const userKeys = {
  current: () =>
    QueryKeyFactory.create({ entity: 'user', operation: 'current' }),

  preferences: () =>
    QueryKeyFactory.create({
      entity: 'user-preferences',
      operation: 'detail'
    }),

  permissions: () =>
    QueryKeyFactory.create({
      entity: 'user-permissions',
      operation: 'list'
    })
};

/**
 * Export All Query Key Factories
 */
export const queryKeys = {
  students: studentKeys,
  healthRecords: healthRecordKeys,
  medications: medicationKeys,
  appointments: appointmentKeys,
  incidents: incidentKeys,
  emergencyContacts: emergencyContactKeys,
  reference: referenceKeys,
  user: userKeys
};
