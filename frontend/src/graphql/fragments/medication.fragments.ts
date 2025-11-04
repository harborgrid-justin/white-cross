/**
 * GraphQL Fragments for Medication Entity
 *
 * Item 192: GraphQL fragments for medication management
 */

import { gql } from '@apollo/client';

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
