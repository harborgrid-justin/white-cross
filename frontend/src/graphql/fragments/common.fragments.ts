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
 * GraphQL fragment for pagination metadata.
 *
 * @remarks
 * Used in all paginated queries to provide consistent pagination information.
 * Fields include current page, items per page, total items, and total pages.
 *
 * @example
 * ```graphql
 * query GetStudents {
 *   students {
 *     students { ... }
 *     pagination {
 *       ...PageInfo
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link PageInfo} TypeScript interface
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
 * GraphQL fragment for audit trail information.
 *
 * @remarks
 * Tracks record creation and modification metadata for compliance and auditing.
 * Includes timestamps and user IDs for both creation and last update events.
 *
 * Used in entities that require audit trails for HIPAA compliance.
 *
 * @example
 * ```graphql
 * query GetHealthRecord {
 *   healthRecord(id: "123") {
 *     ...AuditInfo
 *   }
 * }
 * ```
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
 * GraphQL fragment for delete operation responses.
 *
 * @remarks
 * Standard response structure for all delete mutations.
 * Returns success status and human-readable message.
 *
 * @example
 * ```graphql
 * mutation DeleteStudent {
 *   deleteStudent(id: "123") {
 *     ...DeleteResponse
 *   }
 * }
 * ```
 *
 * @see {@link DeleteResponse} TypeScript interface
 */
export const DELETE_RESPONSE_FRAGMENT = gql`
  fragment DeleteResponse on DeleteResponse {
    success
    message
  }
`;

/**
 * GraphQL fragment for error information.
 *
 * @remarks
 * Used to capture structured error details from GraphQL operations.
 * Includes error message, code (e.g., 'VALIDATION_ERROR'), and optional field name.
 *
 * Helpful for displaying field-specific validation errors in forms.
 *
 * @example
 * ```graphql
 * mutation CreateStudent {
 *   createStudent(input: $input) {
 *     ... on Error {
 *       ...Error
 *     }
 *   }
 * }
 * ```
 */
export const ERROR_FRAGMENT = gql`
  fragment Error on Error {
    message
    code
    field
  }
`;

/**
 * GraphQL fragment for physical address information.
 *
 * @remarks
 * Reusable address structure for contacts, students, and facilities.
 * Includes all components of a mailing address.
 *
 * @example
 * ```graphql
 * query GetContact {
 *   contact(id: "123") {
 *     address {
 *       ...Address
 *     }
 *   }
 * }
 * ```
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
 * GraphQL fragment for notification data.
 *
 * @remarks
 * Used for real-time notifications about appointments, medications, and health records.
 * Includes priority level, read status, and optional action URL for navigation.
 *
 * Priority levels: 'low', 'normal', 'high', 'urgent'
 * Types: 'appointment', 'medication', 'health_record', 'system'
 *
 * @example
 * ```graphql
 * subscription OnNotification {
 *   notificationCreated {
 *     ...Notification
 *   }
 * }
 * ```
 *
 * @see {@link notification.subscriptions} for real-time notification subscriptions
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
