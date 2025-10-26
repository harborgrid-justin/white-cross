/**
 * @fileoverview User GraphQL Fragments
 *
 * Reusable GraphQL fragments for user queries
 *
 * @module graphql/fragments/user
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Basic user fields
 */
export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasic on User {
    id
    username
    email
    firstName
    lastName
    fullName
    isActive
  }
`;

/**
 * Detailed user fields
 */
export const USER_DETAILED_FRAGMENT = gql`
  fragment UserDetailed on User {
    id
    username
    email
    firstName
    lastName
    fullName
    phone
    npiNumber
    licenseNumber
    title
    department
    role
    permissions
    isActive
    lastLogin
    createdAt
    updatedAt
  }
`;

/**
 * User with role details
 */
export const USER_WITH_ROLE_FRAGMENT = gql`
  fragment UserWithRole on User {
    ...UserDetailed
    roleDetails {
      id
      name
      description
      permissions
      isSystemRole
    }
  }
  ${USER_DETAILED_FRAGMENT}
`;
