/**
 * @fileoverview Students Components Barrel Export
 * @module app/(dashboard)/students/_components
 * @category Students - Components
 *
 * Central export file for all student-related components and utilities.
 * Provides convenient imports for consumers of student components.
 *
 * @example
 * ```tsx
 * import {
 *   StudentsContent,
 *   StudentCard,
 *   StudentTableRow,
 *   useStudentData
 * } from '@/app/(dashboard)/students/_components';
 * ```
 */

// Main Components
export { StudentsContent } from './StudentsContent';
export { StudentStatsCard } from './StudentStatsCard';
export { StudentTableRow } from './StudentTableRow';
export { StudentCard } from './StudentCard';
export { BulkActionBar } from './BulkActionBar';
export { StudentsEmptyState } from './StudentsEmptyState';

// Custom Hooks
export { useStudentData } from './useStudentData';
export type {
  StudentSearchParams,
  StudentStats,
  UseStudentDataReturn
} from './useStudentData';

// Utility Functions
export {
  calculateAge,
  getStatusBadgeVariant,
  getGradeBadgeColor,
  hasHealthAlerts,
  getStudentInitials,
  formatStudentName,
  getEmergencyContactInfo
} from './student.utils';

// Component Props Types
export type { StudentStatsCardProps } from './StudentStatsCard';
export type { StudentTableRowProps } from './StudentTableRow';
export type { StudentCardProps } from './StudentCard';
export type { BulkActionBarProps } from './BulkActionBar';
