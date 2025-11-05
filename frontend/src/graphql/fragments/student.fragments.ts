/**
 * @fileoverview Student GraphQL Fragments
 *
 * Reusable GraphQL fragments for student queries with varying levels of detail.
 * Fragments reduce duplication and ensure consistency across queries and mutations.
 *
 * Fragment hierarchy:
 * - STUDENT_BASIC_FRAGMENT: Core fields only
 * - STUDENT_WITH_CONTACTS_FRAGMENT: + Emergency contacts
 * - STUDENT_WITH_MEDICAL_FRAGMENT: + Medical data
 * - STUDENT_FULL_FRAGMENT: All available fields
 *
 * @module graphql/fragments/student
 * @since 1.0.0
 *
 * @remarks
 * Item 192: GraphQL fragments used for reusability
 */

import { gql } from '@apollo/client';

/**
 * GraphQL fragment for basic student information.
 *
 * @remarks
 * Minimal student data for list views and quick lookups.
 * Includes identification, demographics, and status.
 *
 * Use when:
 * - Displaying student lists or search results
 * - Minimal data requirements
 * - Performance is critical (reduces payload size)
 *
 * @example
 * ```graphql
 * query GetStudents {
 *   students {
 *     students {
 *       ...StudentBasic
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link STUDENT_WITH_CONTACTS_FRAGMENT} to include contact information
 * @see {@link STUDENT_WITH_MEDICAL_FRAGMENT} to include medical data
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
 * GraphQL fragment for student with contact information.
 *
 * @remarks
 * Extends basic student data with emergency contacts and parent/guardian information.
 *
 * Contact types included:
 * - emergencyContacts: For emergency situations (includes isPrimary flag)
 * - parentGuardians: For general communication and consent
 *
 * Use when:
 * - Displaying student profile pages
 * - Emergency situations requiring contact info
 * - Parent/guardian communication features
 *
 * @example
 * ```graphql
 * query GetStudentProfile($id: ID!) {
 *   student(id: $id) {
 *     ...StudentWithContacts
 *   }
 * }
 * ```
 *
 * @see {@link STUDENT_BASIC_FRAGMENT} for base student fields
 * @see {@link contact.fragments} for detailed contact fragments
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
 * GraphQL fragment for student with medical information.
 *
 * @remarks
 * Extends basic student data with comprehensive medical records.
 *
 * Medical data included:
 * - allergies: Known allergens, severity, reactions
 * - medications: Current medications with dosing and schedule
 * - medicalConditions: Diagnosed conditions and severity
 *
 * Use when:
 * - Managing health records
 * - Medication administration
 * - Nurse/health office interactions
 * - Emergency medical situations
 *
 * @example
 * ```graphql
 * query GetStudentMedical($id: ID!) {
 *   student(id: $id) {
 *     ...StudentWithMedical
 *   }
 * }
 * ```
 *
 * @see {@link STUDENT_BASIC_FRAGMENT} for base student fields
 * @see {@link medication.fragments} for detailed medication fragments
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
 * GraphQL fragment for complete student information with all relationships.
 *
 * @remarks
 * Comprehensive student data including contacts, medical records, school info,
 * immunizations, and incident history.
 *
 * **Use sparingly** - large payload size. Only fetch when truly needed.
 *
 * Additional fields beyond STUDENT_WITH_CONTACTS and STUDENT_WITH_MEDICAL:
 * - school: School and district information
 * - immunizations: Vaccination records and compliance status
 * - incidents: Health incident history
 *
 * Appropriate for:
 * - Complete student profile exports
 * - Administrative reviews requiring all data
 * - Transfer or enrollment processes
 *
 * Avoid for:
 * - List views
 * - Frequent queries
 * - Real-time updates
 *
 * @example
 * ```graphql
 * query GetCompleteStudentRecord($id: ID!) {
 *   student(id: $id) {
 *     ...StudentFull
 *   }
 * }
 * ```
 *
 * @see {@link STUDENT_BASIC_FRAGMENT} for minimal data
 * @see {@link STUDENT_WITH_CONTACTS_FRAGMENT} for contact info
 * @see {@link STUDENT_WITH_MEDICAL_FRAGMENT} for medical data
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
