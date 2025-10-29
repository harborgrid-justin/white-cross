/**
 * @fileoverview Common GraphQL Fragments
 *
 * Reusable GraphQL fragments for common data structures
 *
 * @module graphql/fragments/common
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Pagination info fragment
 */
export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfo on PageInfo {
    page
    limit
    total
    totalPages
  }
`;

/**
 * Audit info fragment
 */
export const AUDIT_INFO_FRAGMENT = gql`
  fragment AuditInfo on AuditInfo {
    createdAt
    createdBy
    updatedAt
    updatedBy
  }
`;

/**
 * Delete response fragment
 */
export const DELETE_RESPONSE_FRAGMENT = gql`
  fragment DeleteResponse on DeleteResponse {
    success
    message
  }
`;

/**
 * Error fragment
 */
export const ERROR_FRAGMENT = gql`
  fragment Error on Error {
    message
    code
    field
  }
`;

/**
 * Address fragment
 */
export const ADDRESS_FRAGMENT = gql`
  fragment Address on Address {
    street
    city
    state
    zip
    country
  }
`;

/**
 * Notification fragment
 */
export const NOTIFICATION_FRAGMENT = gql`
  fragment Notification on Notification {
    id
    userId
    type
    title
    message
    priority
    isRead
    readAt
    actionUrl
    metadata
    createdAt
  }
`;
