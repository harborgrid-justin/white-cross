/**
 * @fileoverview Health Record GraphQL Queries
 *
 * GraphQL queries for health record data fetching
 *
 * @module graphql/queries/healthRecord
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  HEALTH_RECORD_BASIC_FRAGMENT,
  HEALTH_RECORD_DETAILED_FRAGMENT,
  VITAL_SIGNS_FRAGMENT,
  ALLERGY_FRAGMENT,
  IMMUNIZATION_FRAGMENT,
  SCREENING_FRAGMENT,
  CHRONIC_CONDITION_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get health records
 */
export const GET_HEALTH_RECORDS = gql`
  query GetHealthRecords(
    $page: Int
    $limit: Int
    $filters: HealthRecordFilterInput
  ) {
    healthRecords(
      page: $page
      limit: $limit
      filters: $filters
    ) {
      records {
        ...HealthRecordBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${HEALTH_RECORD_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get health record by ID
 */
export const GET_HEALTH_RECORD = gql`
  query GetHealthRecord($id: ID!) {
    healthRecord(id: $id) {
      ...HealthRecordDetailed
    }
  }
  ${HEALTH_RECORD_DETAILED_FRAGMENT}
`;

/**
 * Get student health records
 */
export const GET_STUDENT_HEALTH_RECORDS = gql`
  query GetStudentHealthRecords($studentId: ID!, $recordType: String) {
    studentHealthRecords(studentId: $studentId, recordType: $recordType) {
      ...HealthRecordDetailed
    }
  }
  ${HEALTH_RECORD_DETAILED_FRAGMENT}
`;

/**
 * Get vital signs
 */
export const GET_VITAL_SIGNS = gql`
  query GetVitalSigns($studentId: ID!, $page: Int, $limit: Int) {
    vitalSigns(studentId: $studentId, page: $page, limit: $limit) {
      records {
        ...VitalSigns
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${VITAL_SIGNS_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get allergies
 */
export const GET_ALLERGIES = gql`
  query GetAllergies($studentId: ID!, $isActive: Boolean) {
    allergies(studentId: $studentId, isActive: $isActive) {
      ...Allergy
    }
  }
  ${ALLERGY_FRAGMENT}
`;

/**
 * Get immunizations
 */
export const GET_IMMUNIZATIONS = gql`
  query GetImmunizations($studentId: ID!) {
    immunizations(studentId: $studentId) {
      ...Immunization
    }
  }
  ${IMMUNIZATION_FRAGMENT}
`;

/**
 * Get screenings
 */
export const GET_SCREENINGS = gql`
  query GetScreenings($studentId: ID!, $screeningType: String) {
    screenings(studentId: $studentId, screeningType: $screeningType) {
      ...Screening
    }
  }
  ${SCREENING_FRAGMENT}
`;

/**
 * Get chronic conditions
 */
export const GET_CHRONIC_CONDITIONS = gql`
  query GetChronicConditions($studentId: ID!, $isActive: Boolean) {
    chronicConditions(studentId: $studentId, isActive: $isActive) {
      ...ChronicCondition
    }
  }
  ${CHRONIC_CONDITION_FRAGMENT}
`;

/**
 * Get student health summary
 */
export const GET_STUDENT_HEALTH_SUMMARY = gql`
  query GetStudentHealthSummary($studentId: ID!) {
    studentHealthSummary(studentId: $studentId) {
      student {
        id
        fullName
        dateOfBirth
        grade
      }
      activeAllergies {
        ...Allergy
      }
      activeConditions {
        ...ChronicCondition
      }
      currentMedications {
        id
        medicationName
        dosage
        frequency
      }
      recentVitals {
        ...VitalSigns
      }
      upcomingImmunizations {
        ...Immunization
      }
    }
  }
  ${ALLERGY_FRAGMENT}
  ${CHRONIC_CONDITION_FRAGMENT}
  ${VITAL_SIGNS_FRAGMENT}
  ${IMMUNIZATION_FRAGMENT}
`;
