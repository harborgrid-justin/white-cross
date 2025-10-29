/**
 * @fileoverview Medication GraphQL Queries
 *
 * GraphQL queries for medication data fetching
 *
 * @module graphql/queries/medication
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  MEDICATION_BASIC_FRAGMENT,
  MEDICATION_DETAILED_FRAGMENT,
  MEDICATION_WITH_HISTORY_FRAGMENT,
  MEDICATION_WITH_INVENTORY_FRAGMENT,
  MEDICATION_ADMINISTRATION_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get paginated list of medications
 */
export const GET_MEDICATIONS = gql`
  query GetMedications(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDirection: String
    $filters: MedicationFilterInput
  ) {
    medications(
      page: $page
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      filters: $filters
    ) {
      medications {
        ...MedicationBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${MEDICATION_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get medication by ID
 */
export const GET_MEDICATION = gql`
  query GetMedication($id: ID!) {
    medication(id: $id) {
      ...MedicationDetailed
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Get medication with history
 */
export const GET_MEDICATION_WITH_HISTORY = gql`
  query GetMedicationWithHistory($id: ID!) {
    medication(id: $id) {
      ...MedicationWithHistory
    }
  }
  ${MEDICATION_WITH_HISTORY_FRAGMENT}
`;

/**
 * Get medications by student
 */
export const GET_STUDENT_MEDICATIONS = gql`
  query GetStudentMedications($studentId: ID!, $isActive: Boolean) {
    studentMedications(studentId: $studentId, isActive: $isActive) {
      ...MedicationDetailed
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Get due medications
 */
export const GET_DUE_MEDICATIONS = gql`
  query GetDueMedications($date: DateTime, $studentId: ID) {
    dueMedications(date: $date, studentId: $studentId) {
      id
      medicationName
      dosage
      scheduledTime
      student {
        id
        fullName
        grade
      }
      status
    }
  }
`;

/**
 * Get medication administration records
 */
export const GET_MEDICATION_ADMINISTRATIONS = gql`
  query GetMedicationAdministrations(
    $page: Int
    $limit: Int
    $filters: AdministrationFilterInput
  ) {
    medicationAdministrations(
      page: $page
      limit: $limit
      filters: $filters
    ) {
      administrations {
        ...MedicationAdministration
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${MEDICATION_ADMINISTRATION_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get medication inventory
 */
export const GET_MEDICATION_INVENTORY = gql`
  query GetMedicationInventory($medicationId: ID) {
    medicationInventory(medicationId: $medicationId) {
      ...MedicationWithInventory
    }
  }
  ${MEDICATION_WITH_INVENTORY_FRAGMENT}
`;

/**
 * Get medication statistics
 */
export const GET_MEDICATION_STATS = gql`
  query GetMedicationStats($startDate: DateTime, $endDate: DateTime) {
    medicationStats(startDate: $startDate, endDate: $endDate) {
      totalMedications
      activeMedications
      administeredToday
      missedDoses
      upcomingDoses
      lowInventory
    }
  }
`;
