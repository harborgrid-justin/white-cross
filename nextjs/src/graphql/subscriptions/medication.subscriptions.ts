/**
 * @fileoverview Medication GraphQL Subscriptions
 *
 * GraphQL subscriptions for real-time medication updates
 *
 * @module graphql/subscriptions/medication
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Subscribe to medication reminders
 */
export const MEDICATION_REMINDER_SUBSCRIPTION = gql`
  subscription OnMedicationReminder($nurseId: ID!) {
    medicationReminderTriggered(nurseId: $nurseId) {
      id
      medicationId
      medication {
        id
        medicationName
        dosage
        route
      }
      studentId
      student {
        id
        fullName
        grade
      }
      scheduledTime
      status
    }
  }
`;

/**
 * Subscribe to medication administration updates
 */
export const MEDICATION_ADMINISTRATION_SUBSCRIPTION = gql`
  subscription OnMedicationAdministration($studentId: ID) {
    medicationAdministered(studentId: $studentId) {
      id
      medicationId
      medicationName
      studentId
      studentName
      administeredAt
      administeredBy
      status
    }
  }
`;

/**
 * Subscribe to medication inventory alerts
 */
export const MEDICATION_INVENTORY_ALERT_SUBSCRIPTION = gql`
  subscription OnMedicationInventoryAlert {
    medicationInventoryAlert {
      id
      medicationId
      medicationName
      alertType
      currentQuantity
      minimumQuantity
      expirationDate
      message
    }
  }
`;
