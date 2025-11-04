/**
 * Type definitions and constants for student search and filter functionality
 *
 * @module hooks/students/searchAndFilter/types
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import type { StudentFilters } from '../queryKeys';
import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type
 */
export interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Search suggestion types
 */
export interface SearchSuggestion {
  type: 'student' | 'grade' | 'nurse' | 'recent';
  value: string;
  label: string;
  metadata?: {
    studentId?: string;
    grade?: string;
    count?: number;
  };
}

/**
 * Advanced filter options extending base StudentFilters
 */
export interface AdvancedFilters extends StudentFilters {
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
  ageMin?: number;
  ageMax?: number;
  hasAllergies?: boolean;
  hasMedications?: boolean;
  hasIncidents?: boolean;
  lastVisitFrom?: string;
  lastVisitTo?: string;
  tags?: string[];
  nurseIds?: string[];
  schools?: string[];
}

/**
 * Sort option configuration
 */
export interface SortOption {
  field: keyof Student | 'fullName' | 'lastVisit' | 'enrollmentDate';
  direction: 'asc' | 'desc';
  label: string;
}

/**
 * Available sort options for students
 */
export const SORT_OPTIONS: SortOption[] = [
  { field: 'lastName', direction: 'asc', label: 'Last Name (A-Z)' },
  { field: 'lastName', direction: 'desc', label: 'Last Name (Z-A)' },
  { field: 'firstName', direction: 'asc', label: 'First Name (A-Z)' },
  { field: 'firstName', direction: 'desc', label: 'First Name (Z-A)' },
  { field: 'grade', direction: 'asc', label: 'Grade (Low to High)' },
  { field: 'grade', direction: 'desc', label: 'Grade (High to Low)' },
  { field: 'enrollmentDate', direction: 'desc', label: 'Recently Enrolled' },
  { field: 'enrollmentDate', direction: 'asc', label: 'Longest Enrolled' },
  { field: 'studentNumber', direction: 'asc', label: 'Student Number' },
];

/**
 * Saved search interface
 */
export interface SavedSearch {
  id: string;
  name: string;
  filters: AdvancedFilters;
  sortBy?: SortOption;
  createdAt: string;
  lastUsed?: string;
  isDefault?: boolean;
}

/**
 * Search options configuration
 */
export interface SearchOptions {
  debounceMs?: number;
  enableSuggestions?: boolean;
  minQueryLength?: number;
  maxResults?: number;
  searchFields?: ('firstName' | 'lastName' | 'studentNumber' | 'medicalRecordNum')[];
}

/**
 * Filter options configuration
 */
export interface FilterOptions {
  autoApply?: boolean;
  debounceMs?: number;
}

/**
 * Combined search and filter options
 */
export interface SearchAndFilterOptions {
  initialQuery?: string;
  initialFilters?: Partial<AdvancedFilters>;
  initialSort?: SortOption;
  autoApply?: boolean;
  enableSuggestions?: boolean;
}
