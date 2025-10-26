/**
 * @fileoverview User GraphQL Queries
 *
 * GraphQL queries for user data fetching
 *
 * @module graphql/queries/user
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  USER_BASIC_FRAGMENT,
  USER_DETAILED_FRAGMENT,
  USER_WITH_ROLE_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get current authenticated user
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Get users
 */
export const GET_USERS = gql`
  query GetUsers(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDirection: String
    $filters: UserFilterInput
  ) {
    users(
      page: $page
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      filters: $filters
    ) {
      users {
        ...UserBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${USER_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get user by ID
 */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserDetailed
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;

/**
 * Get user with role
 */
export const GET_USER_WITH_ROLE = gql`
  query GetUserWithRole($id: ID!) {
    user(id: $id) {
      ...UserWithRole
    }
  }
  ${USER_WITH_ROLE_FRAGMENT}
`;

/**
 * Get nurses
 */
export const GET_NURSES = gql`
  query GetNurses($isActive: Boolean) {
    nurses(isActive: $isActive) {
      ...UserBasic
    }
  }
  ${USER_BASIC_FRAGMENT}
`;
