/**
 * @fileoverview Appointment GraphQL Subscriptions
 *
 * GraphQL subscriptions for real-time appointment updates
 *
 * @module graphql/subscriptions/appointment
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Subscribe to appointment updates
 */
export const APPOINTMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnAppointmentUpdated($nurseId: ID) {
    appointmentUpdated(nurseId: $nurseId) {
      id
      studentId
      studentName
      appointmentType
      scheduledDate
      scheduledTime
      status
      updateType
      updatedBy
    }
  }
`;

/**
 * Subscribe to appointment reminders
 */
export const APPOINTMENT_REMINDER_SUBSCRIPTION = gql`
  subscription OnAppointmentReminder($nurseId: ID!) {
    appointmentReminderTriggered(nurseId: $nurseId) {
      id
      appointmentId
      appointment {
        id
        studentName
        appointmentType
        scheduledDate
        scheduledTime
      }
      reminderTime
    }
  }
`;

/**
 * Subscribe to new appointments
 */
export const APPOINTMENT_CREATED_SUBSCRIPTION = gql`
  subscription OnAppointmentCreated($nurseId: ID) {
    appointmentCreated(nurseId: $nurseId) {
      id
      studentId
      studentName
      appointmentType
      scheduledDate
      scheduledTime
      reason
      createdBy
    }
  }
`;
