/**
 * @fileoverview Medication GraphQL Fragments
 *
 * Reusable GraphQL fragments for medication management with progressive detail levels.
 *
 * Fragment hierarchy:
 * - MEDICATION_BASIC_FRAGMENT: Core medication info
 * - MEDICATION_WITH_PRESCRIBER_FRAGMENT: + Prescriber and instructions
 * - MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT: + Administration history
 * - MEDICATION_FULL_FRAGMENT: All fields including student info
 *
 * @module graphql/fragments/medication
 * @since 1.0.0
 *
 * @remarks
 * Item 192: GraphQL fragments for medication management
 */

import { gql } from '@apollo/client';

/**
 * GraphQL fragment for basic medication information.
 *
 * @remarks
 * Core medication data for lists and overviews.
 * Includes drug name, dosing, schedule, and active status.
 *
 * Use when:
 * - Displaying medication lists
 * - Quick medication lookups
 * - Minimal data requirements
 *
 * @example
 * ```graphql
 * query GetMedications {
 *   medications {
 *     medications {
 *       ...MedicationBasic
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link MEDICATION_WITH_PRESCRIBER_FRAGMENT} to include prescriber info
 * @see {@link MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT} for administration history
 */
export const MEDICATION_BASIC_FRAGMENT = gql`
  fragment MedicationBasic on Medication {
    id
    medicationName
    dosage
    unit
    frequency
    route
    active
    startDate
    endDate
    createdAt
    updatedAt
  }
`;

/**
 * GraphQL fragment for medication with prescriber information.
 *
 * @remarks
 * Extends basic medication data with prescription details.
 *
 * Additional fields:
 * - prescribedBy: Prescribing physician name
 * - prescriptionDate: Date prescription was written
 * - instructions: Administration instructions
 * - sideEffects: Known side effects to monitor
 * - contraindications: Warnings and contraindications
 *
 * Use when:
 * - Reviewing prescription details
 * - Verifying medication orders
 * - Training staff on medication administration
 *
 * @example
 * ```graphql
 * query GetMedicationDetails($id: ID!) {
 *   medication(id: $id) {
 *     ...MedicationWithPrescriber
 *   }
 * }
 * ```
 *
 * @see {@link MEDICATION_BASIC_FRAGMENT} for base medication fields
 */
export const MEDICATION_WITH_PRESCRIBER_FRAGMENT = gql`
  ${MEDICATION_BASIC_FRAGMENT}
  fragment MedicationWithPrescriber on Medication {
    ...MedicationBasic
    prescribedBy
    prescriptionDate
    instructions
    sideEffects
    contraindications
  }
`;

/**
 * GraphQL fragment for medication with administration history.
 *
 * @remarks
 * Extends basic medication data with administration records and scheduling.
 *
 * Administration tracking:
 * - administrations[]: History of all administrations with timestamp, nurse, dosage, and student response
 * - nextScheduledAdministration: When medication is next due
 *
 * Use when:
 * - Tracking medication compliance
 * - Reviewing administration history
 * - Scheduling next dose
 * - Monitoring student responses
 *
 * @example
 * ```graphql
 * query GetMedicationSchedule($id: ID!) {
 *   medication(id: $id) {
 *     ...MedicationWithAdministrations
 *   }
 * }
 * ```
 *
 * @see {@link MEDICATION_BASIC_FRAGMENT} for base medication fields
 * @see {@link medication.mutations} for recording administrations
 */
export const MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT = gql`
  ${MEDICATION_BASIC_FRAGMENT}
  fragment MedicationWithAdministrations on Medication {
    ...MedicationBasic
    administrations {
      id
      administeredAt
      administeredBy
      dosageGiven
      notes
      studentResponse
    }
    nextScheduledAdministration
  }
`;

/**
 * GraphQL fragment for complete medication information.
 *
 * @remarks
 * Comprehensive medication data combining prescriber info, administration history,
 * and associated student information.
 *
 * Includes all fields from:
 * - MEDICATION_WITH_PRESCRIBER_FRAGMENT (prescription details)
 * - MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT (administration history)
 * - Plus: Basic student identification (id, name, studentId)
 *
 * Use when:
 * - Displaying complete medication records
 * - Administrative reviews
 * - Medication audits
 *
 * **Note**: Large payload - use judiciously
 *
 * @example
 * ```graphql
 * query GetFullMedicationRecord($id: ID!) {
 *   medication(id: $id) {
 *     ...MedicationFull
 *   }
 * }
 * ```
 *
 * @see {@link MEDICATION_BASIC_FRAGMENT} for minimal data
 * @see {@link MEDICATION_WITH_PRESCRIBER_FRAGMENT} for prescription info
 * @see {@link MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT} for administration history
 */
export const MEDICATION_FULL_FRAGMENT = gql`
  ${MEDICATION_WITH_PRESCRIBER_FRAGMENT}
  ${MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT}
  fragment MedicationFull on Medication {
    ...MedicationWithPrescriber
    ...MedicationWithAdministrations
    student {
      id
      firstName
      lastName
      studentId
    }
  }
`;
