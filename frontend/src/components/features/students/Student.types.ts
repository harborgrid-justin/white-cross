/**
 * Student Types
 *
 * Shared type definitions for student-related components.
 * Extracted to prevent circular dependencies.
 */

/**
 * Student data type
 */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  school: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  hasAllergies: boolean;
  hasMedications: boolean;
  hasChronicConditions: boolean;
  guardianName?: string;
  guardianPhone?: string;
  email?: string;
  photoUrl?: string;
  enrollmentDate?: string;
  lastVisit?: string;
}
