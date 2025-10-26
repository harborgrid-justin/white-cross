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
 * Basic appointment fields
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
 * Detailed appointment fields
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
 * Appointment with student info
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
 * Appointment with outcome
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
