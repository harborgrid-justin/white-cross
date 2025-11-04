/**
 * GraphQL Fragments for Student Entity
 *
 * Reusable fragments reduce duplication and ensure consistency
 * across queries and mutations.
 *
 * Item 192: GraphQL fragments used for reusability
 */

import { gql } from '@apollo/client';

/**
 * Basic student information fragment
 * Use for lists and minimal data requirements
 */
export const STUDENT_BASIC_FRAGMENT = gql`
  fragment StudentBasic on Student {
    id
    studentId
    firstName
    lastName
    dateOfBirth
    grade
    status
    createdAt
    updatedAt
  }
`;

/**
 * Student with contact information
 * Use when displaying student profiles
 */
export const STUDENT_WITH_CONTACTS_FRAGMENT = gql`
  ${STUDENT_BASIC_FRAGMENT}
  fragment StudentWithContacts on Student {
    ...StudentBasic
    emergencyContacts {
      id
      firstName
      lastName
      relationship
      phoneNumber
      isPrimary
    }
    parentGuardians {
      id
      firstName
      lastName
      email
      phoneNumber
      relationship
    }
  }
`;

/**
 * Student with medical information
 * Use for health records and medical management
 */
export const STUDENT_WITH_MEDICAL_FRAGMENT = gql`
  ${STUDENT_BASIC_FRAGMENT}
  fragment StudentWithMedical on Student {
    ...StudentBasic
    allergies {
      id
      allergen
      severity
      reaction
      notes
    }
    medications {
      id
      medicationName
      dosage
      frequency
      prescribedBy
      startDate
      endDate
      active
    }
    medicalConditions {
      id
      condition
      diagnosedDate
      severity
      notes
    }
  }
`;

/**
 * Full student fragment with all relations
 * Use sparingly - only when all data is needed
 */
export const STUDENT_FULL_FRAGMENT = gql`
  ${STUDENT_WITH_CONTACTS_FRAGMENT}
  ${STUDENT_WITH_MEDICAL_FRAGMENT}
  fragment StudentFull on Student {
    ...StudentWithContacts
    ...StudentWithMedical
    school {
      id
      name
      district {
        id
        name
      }
    }
    immunizations {
      id
      vaccineName
      dateAdministered
      nextDueDate
      compliant
    }
    incidents {
      id
      incidentType
      dateOccurred
      severity
      resolved
    }
  }
`;
