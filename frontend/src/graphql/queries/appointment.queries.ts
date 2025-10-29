/**
 * @fileoverview Appointment GraphQL Queries
 *
 * GraphQL queries for appointment data fetching
 *
 * @module graphql/queries/appointment
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  APPOINTMENT_BASIC_FRAGMENT,
  APPOINTMENT_DETAILED_FRAGMENT,
  APPOINTMENT_WITH_STUDENT_FRAGMENT,
  APPOINTMENT_WITH_OUTCOME_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get appointments
 */
export const GET_APPOINTMENTS = gql`
  query GetAppointments(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDirection: String
    $filters: AppointmentFilterInput
  ) {
    appointments(
      page: $page
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      filters: $filters
    ) {
      appointments {
        ...AppointmentBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${APPOINTMENT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get appointment by ID
 */
export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      ...AppointmentDetailed
    }
  }
  ${APPOINTMENT_DETAILED_FRAGMENT}
`;

/**
 * Get appointment with student
 */
export const GET_APPOINTMENT_WITH_STUDENT = gql`
  query GetAppointmentWithStudent($id: ID!) {
    appointment(id: $id) {
      ...AppointmentWithStudent
    }
  }
  ${APPOINTMENT_WITH_STUDENT_FRAGMENT}
`;

/**
 * Get today's appointments
 */
export const GET_TODAYS_APPOINTMENTS = gql`
  query GetTodaysAppointments($nurseId: ID) {
    todaysAppointments(nurseId: $nurseId) {
      ...AppointmentWithStudent
    }
  }
  ${APPOINTMENT_WITH_STUDENT_FRAGMENT}
`;

/**
 * Get upcoming appointments
 */
export const GET_UPCOMING_APPOINTMENTS = gql`
  query GetUpcomingAppointments($studentId: ID, $nurseId: ID, $limit: Int) {
    upcomingAppointments(studentId: $studentId, nurseId: $nurseId, limit: $limit) {
      ...AppointmentWithStudent
    }
  }
  ${APPOINTMENT_WITH_STUDENT_FRAGMENT}
`;

/**
 * Get appointment schedule
 */
export const GET_APPOINTMENT_SCHEDULE = gql`
  query GetAppointmentSchedule($startDate: DateTime!, $endDate: DateTime!, $nurseId: ID) {
    appointmentSchedule(startDate: $startDate, endDate: $endDate, nurseId: $nurseId) {
      date
      appointments {
        ...AppointmentWithStudent
      }
    }
  }
  ${APPOINTMENT_WITH_STUDENT_FRAGMENT}
`;

/**
 * Get appointment statistics
 */
export const GET_APPOINTMENT_STATS = gql`
  query GetAppointmentStats($startDate: DateTime, $endDate: DateTime) {
    appointmentStats(startDate: $startDate, endDate: $endDate) {
      total
      scheduled
      completed
      cancelled
      noShow
      byType
    }
  }
`;
