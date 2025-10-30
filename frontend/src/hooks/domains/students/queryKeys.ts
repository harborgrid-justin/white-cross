/**
 * Student Query Key Factory
 * 
 * Centralized, type-safe query key management for student-related queries.
 * Provides hierarchical key structure for efficient cache management and invalidation.
 * 
 * @module hooks/students/queryKeys
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Type definitions for student filters
export interface StudentFilters {
  page?: number;
  limit?: number;
  grade?: string;
  schoolId?: string;
  nurseId?: string;
  isActive?: boolean;
  search?: string;
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
}

/**
 * Query key structure for students domain
 * Uses hierarchical approach for efficient cache invalidation
 */
export const studentQueryKeys = {
  /** Root key for all student queries */
  all: ['students'] as const,

  /** Base keys for different query types */
  base: {
    lists: () => [...studentQueryKeys.all, 'list'] as const,
    details: () => [...studentQueryKeys.all, 'detail'] as const,
    searches: () => [...studentQueryKeys.all, 'search'] as const,
    statistics: () => [...studentQueryKeys.all, 'statistics'] as const,
    relationships: () => [...studentQueryKeys.all, 'relationships'] as const,
    assignments: () => [...studentQueryKeys.all, 'assignments'] as const,
    exports: () => [...studentQueryKeys.all, 'exports'] as const,
    imports: () => [...studentQueryKeys.all, 'imports'] as const,
  },

  /** List query keys with various filters */
  lists: {
    all: () => studentQueryKeys.base.lists(),
    filtered: (filters: StudentFilters) => [...studentQueryKeys.base.lists(), 'filtered', filters] as const,
    paginated: (page: number, limit: number, filters?: StudentFilters) => 
      [...studentQueryKeys.base.lists(), 'paginated', { page, limit, ...filters }] as const,
    byGrade: (grade: string) => [...studentQueryKeys.base.lists(), 'byGrade', grade] as const,
    bySchool: (schoolId: string) => [...studentQueryKeys.base.lists(), 'bySchool', schoolId] as const,
    byNurse: (nurseId: string) => [...studentQueryKeys.base.lists(), 'byNurse', nurseId] as const,
    active: () => [...studentQueryKeys.base.lists(), 'active'] as const,
    inactive: () => [...studentQueryKeys.base.lists(), 'inactive'] as const,
    recent: (days: number = 30) => [...studentQueryKeys.base.lists(), 'recent', days] as const,
  },

  /** Detail query keys */
  details: {
    all: () => studentQueryKeys.base.details(),
    byId: (id: string) => [...studentQueryKeys.base.details(), id] as const,
    withHealthRecords: (id: string) => [...studentQueryKeys.base.details(), id, 'withHealthRecords'] as const,
    withMedications: (id: string) => [...studentQueryKeys.base.details(), id, 'withMedications'] as const,
    withIncidents: (id: string) => [...studentQueryKeys.base.details(), id, 'withIncidents'] as const,
    withAppointments: (id: string) => [...studentQueryKeys.base.details(), id, 'withAppointments'] as const,
    profile: (id: string) => [...studentQueryKeys.base.details(), id, 'profile'] as const,
  },

  /** Search query keys */
  searches: {
    all: () => studentQueryKeys.base.searches(),
    byQuery: (query: string) => [...studentQueryKeys.base.searches(), 'byQuery', query] as const,
    byName: (name: string) => [...studentQueryKeys.base.searches(), 'byName', name] as const,
    byStudentNumber: (number: string) => [...studentQueryKeys.base.searches(), 'byStudentNumber', number] as const,
    advanced: (filters: Record<string, any>) => [...studentQueryKeys.base.searches(), 'advanced', filters] as const,
    suggestions: (input: string) => [...studentQueryKeys.base.searches(), 'suggestions', input] as const,
  },

  /** Statistics query keys */
  statistics: {
    all: () => studentQueryKeys.base.statistics(),
    overview: () => [...studentQueryKeys.base.statistics(), 'overview'] as const,
    byGrade: () => [...studentQueryKeys.base.statistics(), 'byGrade'] as const,
    bySchool: () => [...studentQueryKeys.base.statistics(), 'bySchool'] as const,
    enrollment: (timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
      [...studentQueryKeys.base.statistics(), 'enrollment', timeframe] as const,
    demographics: () => [...studentQueryKeys.base.statistics(), 'demographics'] as const,
    healthMetrics: () => [...studentQueryKeys.base.statistics(), 'healthMetrics'] as const,
    trends: (metric: string, period: string) => 
      [...studentQueryKeys.base.statistics(), 'trends', metric, period] as const,
  },

  /** Relationship query keys */
  relationships: {
    all: () => studentQueryKeys.base.relationships(),
    emergencyContacts: (studentId: string) => 
      [...studentQueryKeys.base.relationships(), 'emergencyContacts', studentId] as const,
    guardians: (studentId: string) => 
      [...studentQueryKeys.base.relationships(), 'guardians', studentId] as const,
    siblings: (studentId: string) => 
      [...studentQueryKeys.base.relationships(), 'siblings', studentId] as const,
    medicalProviders: (studentId: string) => 
      [...studentQueryKeys.base.relationships(), 'medicalProviders', studentId] as const,
  },

  /** Assignment query keys */
  assignments: {
    all: () => studentQueryKeys.base.assignments(),
    assigned: () => [...studentQueryKeys.base.assignments(), 'assigned'] as const,
    unassigned: () => [...studentQueryKeys.base.assignments(), 'unassigned'] as const,
    byNurse: (nurseId: string) => [...studentQueryKeys.base.assignments(), 'byNurse', nurseId] as const,
    pending: () => [...studentQueryKeys.base.assignments(), 'pending'] as const,
    history: (studentId: string) => [...studentQueryKeys.base.assignments(), 'history', studentId] as const,
  },

  /** Export/Import query keys */
  exports: {
    all: () => studentQueryKeys.base.exports(),
    byFormat: (format: 'csv' | 'xlsx' | 'pdf') => [...studentQueryKeys.base.exports(), format] as const,
    withFilters: (filters: StudentFilters, format: string) => 
      [...studentQueryKeys.base.exports(), 'filtered', format, filters] as const,
    template: () => [...studentQueryKeys.base.exports(), 'template'] as const,
  },

  imports: {
    all: () => studentQueryKeys.base.imports(),
    validation: (jobId: string) => [...studentQueryKeys.base.imports(), 'validation', jobId] as const,
    progress: (jobId: string) => [...studentQueryKeys.base.imports(), 'progress', jobId] as const,
    history: () => [...studentQueryKeys.base.imports(), 'history'] as const,
  },
} as const;

/**
 * Utility functions for query key management
 */
export const queryKeyUtils = {
  /**
   * Check if a query key matches a specific pattern
   */
  matches: (queryKey: readonly unknown[], pattern: readonly unknown[]): boolean => {
    if (pattern.length > queryKey.length) return false;
    return pattern.every((key, index) => queryKey[index] === key);
  },

  /**
   * Get all keys that match a base pattern
   */
  getMatchingKeys: (queryCache: Map<string, any>, baseKey: readonly unknown[]) => {
    const matchingKeys: string[] = [];
    const baseKeyString = JSON.stringify(baseKey);
    
    for (const [key] of queryCache.entries()) {
      try {
        const parsedKey = JSON.parse(key);
        if (queryKeyUtils.matches(parsedKey, baseKey)) {
          matchingKeys.push(key);
        }
      } catch { 
        
      }
    }
    
    return matchingKeys;
  },

  /**
   * Create a cache key string from query key array
   */
  stringify: (queryKey: readonly unknown[]): string => {
    return JSON.stringify(queryKey);
  },

  /**
   * Parse a cache key string back to query key array
   */
  parse: (keyString: string): readonly unknown[] => {
    try {
      return JSON.parse(keyString);
    } catch {
      return [];
    }
  },

  /**
   * Get all related keys for a student ID
   */
  getStudentRelatedKeys: (studentId: string) => [
    studentQueryKeys.details.byId(studentId),
    studentQueryKeys.details.withHealthRecords(studentId),
    studentQueryKeys.details.withMedications(studentId),
    studentQueryKeys.details.withIncidents(studentId),
    studentQueryKeys.details.withAppointments(studentId),
    studentQueryKeys.details.profile(studentId),
    studentQueryKeys.relationships.emergencyContacts(studentId),
    studentQueryKeys.relationships.guardians(studentId),
    studentQueryKeys.relationships.siblings(studentId),
    studentQueryKeys.relationships.medicalProviders(studentId),
    studentQueryKeys.assignments.history(studentId),
  ],

  /**
   * Get keys that should be invalidated when a student is updated
   */
  getInvalidationKeys: (studentId?: string, changes?: Partial<Record<string, any>>) => {
    const keys: (readonly unknown[])[] = [
      studentQueryKeys.lists.all(),
      studentQueryKeys.statistics.all(),
      studentQueryKeys.assignments.all(),
    ];

    if (studentId) {
      keys.push(...queryKeyUtils.getStudentRelatedKeys(studentId));
    }

    // Add specific invalidations based on what changed
    if (changes) {
      if (changes.grade) {
        keys.push(studentQueryKeys.lists.byGrade(changes.grade));
        keys.push(studentQueryKeys.statistics.byGrade());
      }
      if (changes.schoolId) {
        keys.push(studentQueryKeys.lists.bySchool(changes.schoolId));
        keys.push(studentQueryKeys.statistics.bySchool());
      }
      if (changes.nurseId) {
        keys.push(studentQueryKeys.lists.byNurse(changes.nurseId));
        keys.push(studentQueryKeys.assignments.byNurse(changes.nurseId));
      }
      if (changes.isActive !== undefined) {
        keys.push(
          studentQueryKeys.lists.active(),
          studentQueryKeys.lists.inactive()
        );
      }
    }

    return keys;
  },
} as const;

/**
 * Type definitions for query keys
 */
export type StudentQueryKey = 
  | ReturnType<typeof studentQueryKeys.lists.all>
  | ReturnType<typeof studentQueryKeys.lists.filtered>
  | ReturnType<typeof studentQueryKeys.lists.paginated>
  | ReturnType<typeof studentQueryKeys.details.byId>
  | ReturnType<typeof studentQueryKeys.searches.byQuery>
  | ReturnType<typeof studentQueryKeys.statistics.overview>
  | ReturnType<typeof studentQueryKeys.relationships.emergencyContacts>
  | ReturnType<typeof studentQueryKeys.assignments.assigned>
  | ReturnType<typeof studentQueryKeys.exports.byFormat>
  | ReturnType<typeof studentQueryKeys.imports.validation>;

/**
 * Export everything for backwards compatibility
 */
export const studentKeys = studentQueryKeys;
export default studentQueryKeys;
