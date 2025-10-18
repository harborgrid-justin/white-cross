/**
 * WF-COMP-245 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Students Page Type Definitions
 *
 * Page-specific types for the students module
 */

import type { Student, StudentFormData, ValidationErrors } from '@/types/student.types';

/**
 * Student filter form state interface
 */
export interface StudentFiltersForm {
  searchTerm: string;
  gradeFilter: string;
  genderFilter: string;
  statusFilter: string;
  showArchived: boolean;
}

/**
 * Sort columns available for students table
 */
export type StudentSortColumn = 'lastName' | 'firstName' | 'grade' | 'studentNumber' | 'dateOfBirth';

/**
 * Emergency contact data for forms
 */
export interface EmergencyContactData {
  firstName: string;
  phoneNumber: string;
}

/**
 * Notification state for user feedback
 */
export interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

/**
 * Re-export commonly used types
 */
export type { Student, StudentFormData, ValidationErrors };
