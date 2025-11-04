/**
 * Student Composite Hook - Type Definitions
 *
 * @module hooks/domains/students/useStudents.types
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type {
  Student,
  CreateStudentData,
  UpdateStudentData
} from '@/types/student.types';
import type { StudentListFilters } from './config';

/**
 * Student operations interface
 */
export interface StudentOperations {
  // List operations
  students: {
    data: Student[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };

  // Individual student operations
  getStudent: (id: string, options?: { includeHealth?: boolean; includeRelations?: boolean }) => {
    data: Student | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  };

  // CRUD operations
  createStudent: (data: CreateStudentData) => Promise<Student>;
  updateStudent: (id: string, data: UpdateStudentData) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;

  // Bulk operations
  bulkUpdate: (updates: Array<{ id: string; data: UpdateStudentData }>) => Promise<Student[]>;
  bulkDelete: (ids: string[]) => Promise<void>;

  // Utility operations
  searchStudents: (query: string) => Promise<Student[]>;
  prefetchStudent: (id: string) => Promise<void>;
  invalidateStudentCache: (id?: string) => Promise<void>;

  // Relationship operations
  loadStudentRelations: (id: string, relations: string[]) => Promise<Student>;

  // State management
  isAnyLoading: boolean;
  hasErrors: boolean;
  clearErrors: () => void;
}

/**
 * Student management options
 */
export interface UseStudentsOptions {
  // List options
  defaultFilters?: StudentListFilters;
  enableInfiniteScroll?: boolean;

  // Caching options
  enableBackgroundRefetch?: boolean;
  prefetchRelated?: boolean;

  // Performance options
  enableOptimisticUpdates?: boolean;
  debounceSearch?: number;

  // Compliance options
  enableAuditLogging?: boolean;
}
