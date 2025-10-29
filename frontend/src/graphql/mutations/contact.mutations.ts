/**
 * @fileoverview Contact GraphQL Mutations
 *
 * GraphQL mutations for contact CRUD operations
 * Based on backend GraphQL schema
 *
 * @module graphql/mutations/contact
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import { CONTACT_DETAILED_FRAGMENT, DELETE_RESPONSE_FRAGMENT } from '../fragments';

/**
 * Create contact (from backend schema)
 */
export const CREATE_CONTACT = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      ...ContactDetailed
    }
  }
  ${CONTACT_DETAILED_FRAGMENT}
`;

/**
 * Update contact (from backend schema)
 */
export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: ContactUpdateInput!) {
    updateContact(id: $id, input: $input) {
      ...ContactDetailed
    }
  }
  ${CONTACT_DETAILED_FRAGMENT}
`;

/**
 * Delete contact (from backend schema)
 */
export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Deactivate contact (from backend schema)
 */
export const DEACTIVATE_CONTACT = gql`
  mutation DeactivateContact($id: ID!) {
    deactivateContact(id: $id) {
      ...ContactDetailed
    }
  }
  ${CONTACT_DETAILED_FRAGMENT}
`;

/**
 * Reactivate contact (from backend schema)
 */
export const REACTIVATE_CONTACT = gql`
  mutation ReactivateContact($id: ID!) {
    reactivateContact(id: $id) {
      ...ContactDetailed
    }
  }
  ${CONTACT_DETAILED_FRAGMENT}
`;
