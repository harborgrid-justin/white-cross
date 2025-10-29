/**
 * @fileoverview Student GraphQL Queries
 *
 * GraphQL queries for student data fetching
 *
 * @module graphql/queries/student
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  STUDENT_BASIC_FRAGMENT,
  STUDENT_DETAILED_FRAGMENT,
  STUDENT_WITH_CONTACTS_FRAGMENT,
  STUDENT_WITH_HEALTH_FRAGMENT,
  STUDENT_COMPLETE_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get paginated list of students
 */
export const GET_STUDENTS = gql`
  query GetStudents(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDirection: String
    $filters: StudentFilterInput
  ) {
    students(
      page: $page
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      filters: $filters
    ) {
      students {
        ...StudentBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${STUDENT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get detailed student by ID
 */
export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Get student with emergency contacts
 */
export const GET_STUDENT_WITH_CONTACTS = gql`
  query GetStudentWithContacts($id: ID!) {
    student(id: $id) {
      ...StudentWithContacts
    }
  }
  ${STUDENT_WITH_CONTACTS_FRAGMENT}
`;

/**
 * Get student with health information
 */
export const GET_STUDENT_WITH_HEALTH = gql`
  query GetStudentWithHealth($id: ID!) {
    student(id: $id) {
      ...StudentWithHealth
    }
  }
  ${STUDENT_WITH_HEALTH_FRAGMENT}
`;

/**
 * Get complete student data
 */
export const GET_STUDENT_COMPLETE = gql`
  query GetStudentComplete($id: ID!) {
    student(id: $id) {
      ...StudentComplete
    }
  }
  ${STUDENT_COMPLETE_FRAGMENT}
`;

/**
 * Search students
 */
export const SEARCH_STUDENTS = gql`
  query SearchStudents($query: String!, $limit: Int) {
    searchStudents(query: $query, limit: $limit) {
      ...StudentBasic
    }
  }
  ${STUDENT_BASIC_FRAGMENT}
`;

/**
 * Get students by grade
 */
export const GET_STUDENTS_BY_GRADE = gql`
  query GetStudentsByGrade($grade: String!, $page: Int, $limit: Int) {
    students(
      page: $page
      limit: $limit
      filters: { grade: $grade, isActive: true }
    ) {
      students {
        ...StudentBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${STUDENT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get students by nurse
 */
export const GET_STUDENTS_BY_NURSE = gql`
  query GetStudentsByNurse($nurseId: ID!, $page: Int, $limit: Int) {
    students(
      page: $page
      limit: $limit
      filters: { nurseId: $nurseId, isActive: true }
    ) {
      students {
        ...StudentBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${STUDENT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get active students count
 */
export const GET_STUDENT_STATS = gql`
  query GetStudentStats {
    studentStats {
      total
      active
      inactive
      byGrade
      byNurse
    }
  }
`;
