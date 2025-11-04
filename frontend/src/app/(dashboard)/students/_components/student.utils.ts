/**
 * @fileoverview Student Utility Functions
 * @module app/(dashboard)/students/_components/student.utils
 * @category Students - Utilities
 *
 * This module provides utility functions for student data processing:
 * - Age calculation from date of birth
 * - Badge styling based on status and grade
 * - Health alert detection
 *
 * @example
 * ```tsx
 * import { calculateAge, hasHealthAlerts } from './student.utils';
 *
 * const age = calculateAge(student.dateOfBirth);
 * const hasAlerts = hasHealthAlerts(student);
 * ```
 */

import type { Student } from '@/types/student.types';

/**
 * Calculate age from date of birth
 * @param dateOfBirth - ISO date string of birth date
 * @returns Age in years
 *
 * @example
 * calculateAge('2010-05-15') // Returns current age (e.g., 14)
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Get badge variant based on student active status
 * @param isActive - Whether the student is active
 * @returns Badge variant string for UI library
 */
export const getStatusBadgeVariant = (isActive: boolean): 'default' | 'secondary' => {
  return isActive ? 'default' : 'secondary';
};

/**
 * Get grade badge color classes
 * Uses Tailwind CSS classes for consistent styling
 *
 * @param grade - Student grade level (e.g., '9th', '10th', '11th', '12th')
 * @returns Tailwind CSS classes for badge styling
 */
export const getGradeBadgeColor = (grade: string): string => {
  switch (grade) {
    case '9th': return 'bg-blue-100 text-blue-800 border-blue-200';
    case '10th': return 'bg-green-100 text-green-800 border-green-200';
    case '11th': return 'bg-purple-100 text-purple-800 border-purple-200';
    case '12th': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Check if student has health alerts
 *
 * PHI CONSIDERATION: This function checks for presence of health data
 * but does not expose the actual health information
 *
 * @param student - Student object with potential health data
 * @returns True if student has allergies, medications, or chronic conditions
 *
 * @example
 * hasHealthAlerts(student) // Returns true if any health alerts exist
 */
export const hasHealthAlerts = (student: Student): boolean => {
  return (
    (student.allergies && student.allergies.length > 0) ||
    (student.medications && student.medications.length > 0) ||
    (student.chronicConditions && student.chronicConditions.length > 0)
  );
};

/**
 * Get student initials for avatar display
 * @param firstName - Student's first name
 * @param lastName - Student's last name
 * @returns Two-letter initials (e.g., "JD")
 */
export const getStudentInitials = (firstName: string, lastName: string): string => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

/**
 * Format student full name
 * @param firstName - Student's first name
 * @param lastName - Student's last name
 * @returns Formatted full name
 */
export const formatStudentName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/**
 * Get emergency contact display info
 * Safely extracts primary contact information with fallbacks
 *
 * @param student - Student object with emergency contacts
 * @returns Object with phone and email, or 'N/A' if not available
 */
export const getEmergencyContactInfo = (student: Student): { phone: string; email: string } => {
  if (!student.emergencyContacts || student.emergencyContacts.length === 0) {
    return { phone: 'N/A', email: 'N/A' };
  }

  const primaryContact = student.emergencyContacts[0];
  return {
    phone: primaryContact.phoneNumber || 'N/A',
    email: primaryContact.email || 'N/A'
  };
};
