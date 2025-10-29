/**
 * @fileoverview Health Record GraphQL Fragments
 *
 * Reusable GraphQL fragments for health record queries
 *
 * @module graphql/fragments/healthRecord
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Basic health record fields
 */
export const HEALTH_RECORD_BASIC_FRAGMENT = gql`
  fragment HealthRecordBasic on HealthRecord {
    id
    studentId
    recordType
    recordDate
    recordedBy
    isActive
  }
`;

/**
 * Detailed health record fields
 */
export const HEALTH_RECORD_DETAILED_FRAGMENT = gql`
  fragment HealthRecordDetailed on HealthRecord {
    id
    studentId
    recordType
    recordDate
    recordedBy
    diagnosis
    symptoms
    treatment
    followUpRequired
    followUpDate
    notes
    attachments
    isConfidential
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Vital signs fragment
 */
export const VITAL_SIGNS_FRAGMENT = gql`
  fragment VitalSigns on VitalSignsRecord {
    id
    studentId
    recordDate
    temperature
    temperatureUnit
    bloodPressureSystolic
    bloodPressureDiastolic
    heartRate
    respiratoryRate
    oxygenSaturation
    height
    heightUnit
    weight
    weightUnit
    bmi
    recordedBy
    notes
    createdAt
  }
`;

/**
 * Allergy fragment
 */
export const ALLERGY_FRAGMENT = gql`
  fragment Allergy on AllergyRecord {
    id
    studentId
    allergen
    allergyType
    reaction
    severity
    diagnosedDate
    diagnosedBy
    onsetDate
    treatment
    notes
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Immunization fragment
 */
export const IMMUNIZATION_FRAGMENT = gql`
  fragment Immunization on ImmunizationRecord {
    id
    studentId
    vaccineName
    vaccineCode
    dateAdministered
    administeredBy
    dosage
    route
    site
    lotNumber
    manufacturer
    expirationDate
    nextDueDate
    notes
    createdAt
  }
`;

/**
 * Screening fragment
 */
export const SCREENING_FRAGMENT = gql`
  fragment Screening on ScreeningRecord {
    id
    studentId
    screeningType
    screeningDate
    conductedBy
    results
    passFail
    requiresFollowUp
    followUpNotes
    parentNotified
    createdAt
  }
`;

/**
 * Chronic condition fragment
 */
export const CHRONIC_CONDITION_FRAGMENT = gql`
  fragment ChronicCondition on ChronicConditionRecord {
    id
    studentId
    condition
    icdCode
    diagnosedDate
    diagnosedBy
    status
    severity
    treatmentPlan
    accommodations
    emergencyProtocol
    lastReviewDate
    nextReviewDate
    notes
    isActive
    createdAt
    updatedAt
  }
`;
