/**
 * @fileoverview User GraphQL Mutations
 *
 * GraphQL mutations for user CRUD operations
 *
 * @module graphql/mutations/user
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import { USER_DETAILED_FRAGMENT, DELETE_RESPONSE_FRAGMENT } from '../fragments';

/**
 * Create user
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Update user
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Delete user
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Deactivate user
 */
export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Reactivate user
 */
export const REACTIVATE_USER = gql`
  mutation ReactivateUser($id: ID!) {
    reactivateUser(id: $id) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Update user password
 */
export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($id: ID!, $currentPassword: String!, $newPassword: String!) {
    updateUserPassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

/**
 * Assign role to user
 */
export const ASSIGN_USER_ROLE = gql`
  mutation AssignUserRole($userId: ID!, $roleId: ID!) {
    assignUserRole(userId: $userId, roleId: $roleId) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;
