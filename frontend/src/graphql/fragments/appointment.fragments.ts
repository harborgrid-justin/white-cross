/**
 * @fileoverview Appointment GraphQL Fragments
 *
 * Reusable GraphQL fragments for appointment queries
 *
 * @module graphql/fragments/appointment
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * GraphQL fragment for basic appointment information.
 *
 * @remarks
 * Minimal appointment data suitable for list views and overviews.
 * Includes core fields: ID, student, type, schedule, and status.
 *
 * Use this fragment when full appointment details are not needed.
 *
 * @example
 * ```graphql
 * query GetAppointments {
 *   appointments {
 *     appointments {
 *       ...AppointmentBasic
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link APPOINTMENT_DETAILED_FRAGMENT} for full appointment data
 * @see {@link appointment.queries} for appointment queries
 */
export const APPOINTMENT_BASIC_FRAGMENT = gql`
  fragment AppointmentBasic on Appointment {
    id
    studentId
    appointmentType
    scheduledDate
    scheduledTime
    status
    isActive
  }
`;

/**
 * GraphQL fragment for detailed appointment information.
 *
 * @remarks
 * Comprehensive appointment data including scheduling, notifications, and tracking.
 *
 * Fields included:
 * - Basic info (type, schedule, status)
 * - Details (reason, notes, location, duration)
 * - Tracking (check-in/out times, reminders, parent notifications)
 * - Recurring appointment configuration
 * - Audit fields (created/updated timestamps)
 *
 * Use this fragment for single appointment views and detail pages.
 *
 * @example
 * ```graphql
 * query GetAppointment($id: ID!) {
 *   appointment(id: $id) {
 *     ...AppointmentDetailed
 *   }
 * }
 * ```
 *
 * @see {@link APPOINTMENT_BASIC_FRAGMENT} for minimal data
 * @see {@link APPOINTMENT_WITH_STUDENT_FRAGMENT} to include student info
 */
export const APPOINTMENT_DETAILED_FRAGMENT = gql`
  fragment AppointmentDetailed on Appointment {
    id
    studentId
    appointmentType
    scheduledDate
    scheduledTime
    duration
    status
    reason
    notes
    nurseId
    location
    isRecurring
    recurringPattern
    parentNotified
    parentNotificationDate
    reminderSent
    reminderSentDate
    checkInTime
    checkOutTime
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * GraphQL fragment for appointment with embedded student information.
 *
 * @remarks
 * Combines detailed appointment data with essential student fields.
 * Eliminates need for separate student query in appointment views.
 *
 * Student fields included:
 * - id, studentNumber (identification)
 * - fullName, grade (display)
 * - photo (UI avatar)
 *
 * Ideal for appointment dashboards and calendar views.
 *
 * @example
 * ```graphql
 * query GetTodaysAppointments {
 *   todaysAppointments {
 *     ...AppointmentWithStudent
 *   }
 * }
 * ```
 *
 * @see {@link APPOINTMENT_DETAILED_FRAGMENT} for base appointment fields
 * @see {@link appointment.queries.GET_TODAYS_APPOINTMENTS}
 */
export const APPOINTMENT_WITH_STUDENT_FRAGMENT = gql`
  fragment AppointmentWithStudent on Appointment {
    ...AppointmentDetailed
    student {
      id
      studentNumber
      fullName
      grade
      photo
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * GraphQL fragment for appointment with outcome/result information.
 *
 * @remarks
 * Includes detailed appointment data plus outcome after completion.
 *
 * Outcome fields:
 * - diagnosis: Medical findings
 * - treatment: Treatment provided
 * - followUpRequired: Whether follow-up is needed
 * - followUpDate: Scheduled follow-up date
 * - prescriptionIssued: Whether prescription was provided
 * - notes: Additional outcome notes
 *
 * Use for completed appointments and health record reviews.
 *
 * @example
 * ```graphql
 * query GetCompletedAppointment($id: ID!) {
 *   appointment(id: $id) {
 *     ...AppointmentWithOutcome
 *   }
 * }
 * ```
 *
 * @see {@link APPOINTMENT_DETAILED_FRAGMENT} for base appointment fields
 * @see {@link appointment.mutations.COMPLETE_APPOINTMENT}
 */
export const APPOINTMENT_WITH_OUTCOME_FRAGMENT = gql`
  fragment AppointmentWithOutcome on Appointment {
    ...AppointmentDetailed
    outcome {
      id
      diagnosis
      treatment
      followUpRequired
      followUpDate
      prescriptionIssued
      notes
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;
