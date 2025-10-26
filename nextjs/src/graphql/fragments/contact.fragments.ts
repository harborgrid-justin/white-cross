/**
 * @fileoverview Contact GraphQL Fragments
 *
 * Reusable GraphQL fragments for contact queries
 *
 * @module graphql/fragments/contact
 * @since 1.0.0
 */

import { gql } from '@apollo/client';

/**
 * Basic contact fields
 */
export const CONTACT_BASIC_FRAGMENT = gql`
  fragment ContactBasic on Contact {
    id
    firstName
    lastName
    fullName
    email
    phone
    type
    isActive
  }
`;

/**
 * Detailed contact fields
 */
export const CONTACT_DETAILED_FRAGMENT = gql`
  fragment ContactDetailed on Contact {
    id
    firstName
    lastName
    fullName
    displayName
    email
    phone
    type
    organization
    title
    address
    city
    state
    zip
    relationTo
    relationshipType
    customFields
    isActive
    notes
    createdBy
    updatedBy
    createdAt
    updatedAt
  }
`;

/**
 * Emergency contact fields
 */
export const EMERGENCY_CONTACT_FRAGMENT = gql`
  fragment EmergencyContact on EmergencyContact {
    id
    studentId
    fullName
    email
    phone
    alternatePhone
    relationshipType
    isPrimary
    canPickup
    authorizedForMedicalDecisions
    notes
    isActive
    createdAt
    updatedAt
  }
`;
