/**
 * @fileoverview Student GraphQL Mutations
 *
 * GraphQL mutations for student CRUD operations
 *
 * @module graphql/mutations/student
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import { STUDENT_DETAILED_FRAGMENT, DELETE_RESPONSE_FRAGMENT } from '../fragments';

/**
 * Create student
 */
export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentInput!) {
    createStudent(input: $input) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Update student
 */
export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $input: StudentUpdateInput!) {
    updateStudent(id: $id, input: $input) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Delete student
 */
export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Deactivate student
 */
export const DEACTIVATE_STUDENT = gql`
  mutation DeactivateStudent($id: ID!) {
    deactivateStudent(id: $id) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Reactivate student
 */
export const REACTIVATE_STUDENT = gql`
  mutation ReactivateStudent($id: ID!) {
    reactivateStudent(id: $id) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;

/**
 * Update student photo
 */
export const UPDATE_STUDENT_PHOTO = gql`
  mutation UpdateStudentPhoto($id: ID!, $photo: String!) {
    updateStudentPhoto(id: $id, photo: $photo) {
      id
      photo
    }
  }
`;

/**
 * Assign nurse to student
 */
export const ASSIGN_NURSE_TO_STUDENT = gql`
  mutation AssignNurseToStudent($studentId: ID!, $nurseId: ID!) {
    assignNurseToStudent(studentId: $studentId, nurseId: $nurseId) {
      ...StudentDetailed
    }
  }
  ${STUDENT_DETAILED_FRAGMENT}
`;
