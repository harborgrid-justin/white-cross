/**
 * @fileoverview Medication GraphQL Mutations
 *
 * GraphQL mutations for medication CRUD and administration operations
 *
 * @module graphql/mutations/medication
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  MEDICATION_DETAILED_FRAGMENT,
  MEDICATION_ADMINISTRATION_FRAGMENT,
  DELETE_RESPONSE_FRAGMENT,
} from '../fragments';

/**
 * Create medication
 */
export const CREATE_MEDICATION = gql`
  mutation CreateMedication($input: MedicationInput!) {
    createMedication(input: $input) {
      ...MedicationDetailed
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Update medication
 */
export const UPDATE_MEDICATION = gql`
  mutation UpdateMedication($id: ID!, $input: MedicationUpdateInput!) {
    updateMedication(id: $id, input: $input) {
      ...MedicationDetailed
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Delete medication
 */
export const DELETE_MEDICATION = gql`
  mutation DeleteMedication($id: ID!) {
    deleteMedication(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Discontinue medication
 */
export const DISCONTINUE_MEDICATION = gql`
  mutation DiscontinueMedication($id: ID!, $reason: String) {
    discontinueMedication(id: $id, reason: $reason) {
      ...MedicationDetailed
    }
  }
  ${MEDICATION_DETAILED_FRAGMENT}
`;

/**
 * Administer medication
 */
export const ADMINISTER_MEDICATION = gql`
  mutation AdministerMedication($input: MedicationAdministrationInput!) {
    administerMedication(input: $input) {
      ...MedicationAdministration
    }
  }
  ${MEDICATION_ADMINISTRATION_FRAGMENT}
`;

/**
 * Record medication refusal
 */
export const RECORD_MEDICATION_REFUSAL = gql`
  mutation RecordMedicationRefusal($input: MedicationRefusalInput!) {
    recordMedicationRefusal(input: $input) {
      ...MedicationAdministration
    }
  }
  ${MEDICATION_ADMINISTRATION_FRAGMENT}
`;

/**
 * Update medication inventory
 */
export const UPDATE_MEDICATION_INVENTORY = gql`
  mutation UpdateMedicationInventory($medicationId: ID!, $input: InventoryUpdateInput!) {
    updateMedicationInventory(medicationId: $medicationId, input: $input) {
      id
      quantityOnHand
      lastRestocked
      expirationDate
    }
  }
`;

/**
 * Schedule medication reminder
 */
export const SCHEDULE_MEDICATION_REMINDER = gql`
  mutation ScheduleMedicationReminder($input: MedicationReminderInput!) {
    scheduleMedicationReminder(input: $input) {
      id
      medicationId
      scheduledTime
      isActive
    }
  }
`;
