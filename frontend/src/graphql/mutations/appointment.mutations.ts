/**
 * @fileoverview Appointment GraphQL Mutations
 *
 * GraphQL mutations for appointment CRUD operations
 *
 * @module graphql/mutations/appointment
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import { APPOINTMENT_DETAILED_FRAGMENT, DELETE_RESPONSE_FRAGMENT } from '../fragments';

/**
 * Create appointment
 */
export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: AppointmentInput!) {
    createAppointment(input: $input) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Update appointment
 */
export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: ID!, $input: AppointmentUpdateInput!) {
    updateAppointment(id: $id, input: $input) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Cancel appointment
 */
export const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($id: ID!, $reason: String) {
    cancelAppointment(id: $id, reason: $reason) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Delete appointment
 */
export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Check in appointment
 */
export const CHECK_IN_APPOINTMENT = gql`
  mutation CheckInAppointment($id: ID!) {
    checkInAppointment(id: $id) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Check out appointment
 */
export const CHECK_OUT_APPOINTMENT = gql`
  mutation CheckOutAppointment($id: ID!) {
    checkOutAppointment(id: $id) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Complete appointment
 */
export const COMPLETE_APPOINTMENT = gql`
  mutation CompleteAppointment($id: ID!, $outcome: AppointmentOutcomeInput!) {
    completeAppointment(id: $id, outcome: $outcome) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Reschedule appointment
 */
export const RESCHEDULE_APPOINTMENT = gql`
  mutation RescheduleAppointment($id: ID!, $newDate: DateTime!, $newTime: String!) {
    rescheduleAppointment(id: $id, newDate: $newDate, newTime: $newTime) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;
