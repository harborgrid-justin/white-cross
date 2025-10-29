/**
 * @fileoverview Medication GraphQL Fragments
 *
 * Reusable GraphQL fragments for medication queries
 *
 * @module graphql/fragments/medication
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Basic medication fields
 */
export const MEDICATION_BASIC_FRAGMENT = gql`
  fragment MedicationBasic on Medication {
    id
    medicationName
    dosage
    frequency
    route
    isActive
  }
`;

/**
 * Detailed medication fields
 */
export const MEDICATION_DETAILED_FRAGMENT = gql`
  fragment MedicationDetailed on Medication {
    id
    studentId
    medicationName
    genericName
    dosage
    unit
    frequency
    route
    prescribedBy
    prescriptionDate
    startDate
    endDate
    reason
    specialInstructions
    isActive
    isControlled
    requiresRefrigeration
    createdAt
    updatedAt
  }
`;

/**
 * Medication with administration history
 */
export const MEDICATION_WITH_HISTORY_FRAGMENT = gql`
  fragment MedicationWithHistory on Medication {
    ...MedicationDetailed
    administrationHistory {
      id
      administeredAt
      administeredBy
      dosageGiven
      notes
      status
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Medication with inventory
 */
export const MEDICATION_WITH_INVENTORY_FRAGMENT = gql`
  fragment MedicationWithInventory on Medication {
    ...MedicationDetailed
    inventory {
      id
      quantityOnHand
      quantityUsed
      expirationDate
      lotNumber
      lastRestocked
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Medication administration record
 */
export const MEDICATION_ADMINISTRATION_FRAGMENT = gql`
  fragment MedicationAdministration on MedicationAdministrationRecord {
    id
    medicationId
    studentId
    administeredAt
    administeredBy
    dosageGiven
    unit
    route
    notes
    status
    witnessedBy
    refusedReason
    sideEffects
    createdAt
  }
`;
