/**
 * @fileoverview Student GraphQL Fragments
 *
 * Reusable GraphQL fragments for student queries
 * Supports basic, detailed, and nested data fetching
 *
 * @module graphql/fragments/student
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Basic student fields
 * Use for lists and minimal data requirements
 */
export const STUDENT_BASIC_FRAGMENT = gql`
  fragment StudentBasic on Student {
    id
    studentNumber
    firstName
    lastName
    fullName
    grade
    isActive
  }
`;

/**
 * Detailed student fields
 * Use for student detail pages
 */
export const STUDENT_DETAILED_FRAGMENT = gql`
  fragment StudentDetailed on Student {
    id
    studentNumber
    firstName
    lastName
    fullName
    dateOfBirth
    grade
    gender
    photo
    medicalRecordNum
    isActive
    enrollmentDate
    nurseId
    createdAt
    updatedAt
  }
`;

/**
 * Student with emergency contacts
 * Use when emergency contact information is needed
 */
export const STUDENT_WITH_CONTACTS_FRAGMENT = gql`
  fragment StudentWithContacts on Student {
    ...StudentDetailed
    emergencyContacts {
      id
      fullName
      email
      phone
      relationshipType
      isPrimary
      canPickup
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Student with health summary
 * Use for health overview pages
 */
export const STUDENT_WITH_HEALTH_FRAGMENT = gql`
  fragment StudentWithHealth on Student {
    ...StudentDetailed
    allergies {
      id
      allergen
      reaction
      severity
      diagnosedDate
    }
    chronicConditions {
      id
      condition
      diagnosedDate
      status
    }
    currentMedications {
      id
      medicationName
      dosage
      frequency
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Complete student data
 * Use for comprehensive views requiring all data
 */
export const STUDENT_COMPLETE_FRAGMENT = gql`
  fragment StudentComplete on Student {
    ...StudentDetailed
    emergencyContacts {
      id
      fullName
      email
      phone
      relationshipType
      isPrimary
      canPickup
    }
    allergies {
      id
      allergen
      reaction
      severity
      diagnosedDate
    }
    chronicConditions {
      id
      condition
      diagnosedDate
      status
    }
    immunizations {
      id
      vaccineName
      dateAdministered
      nextDueDate
    }
    currentMedications {
      id
      medicationName
      dosage
      frequency
      startDate
      endDate
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;
