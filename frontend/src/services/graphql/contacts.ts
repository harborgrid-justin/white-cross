/**
 * WF-GRAPHQL-CONTACTS-001 | contacts.ts - GraphQL Contacts Queries and Mutations
 * Purpose: Define GraphQL operations for contact management
 *
 * Features:
 * - Contact CRUD operations
 * - Contact search and filtering
 * - Contact statistics
 * - Type-safe operations
 *
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { gql } from '@apollo/client';

// ==========================================
// FRAGMENTS
// ==========================================

/**
 * Contact fragment - common fields
 */
export const CONTACT_FRAGMENT = gql`
  fragment ContactFields on Contact {
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
 * Pagination fragment
 */
export const PAGINATION_FRAGMENT = gql`
  fragment PaginationFields on PageInfo {
    page
    limit
    total
    totalPages
  }
`;

// ==========================================
// QUERIES
// ==========================================

/**
 * Get paginated contacts list
 */
export const GET_CONTACTS = gql`
  ${CONTACT_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query GetContacts(
    $page: Int
    $limit: Int
    $orderBy: String
    $orderDirection: String
    $filters: ContactFilterInput
  ) {
    contacts(
      page: $page
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
      filters: $filters
    ) {
      contacts {
        ...ContactFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
`;

/**
 * Get single contact by ID
 */
export const GET_CONTACT = gql`
  ${CONTACT_FRAGMENT}
  query GetContact($id: ID!) {
    contact(id: $id) {
      ...ContactFields
    }
  }
`;

/**
 * Get contacts by relation (e.g., all contacts related to a student)
 */
export const GET_CONTACTS_BY_RELATION = gql`
  ${CONTACT_FRAGMENT}
  query GetContactsByRelation($relationTo: ID!, $type: ContactType) {
    contactsByRelation(relationTo: $relationTo, type: $type) {
      ...ContactFields
    }
  }
`;

/**
 * Search contacts
 */
export const SEARCH_CONTACTS = gql`
  ${CONTACT_FRAGMENT}
  query SearchContacts($query: String!, $limit: Int) {
    searchContacts(query: $query, limit: $limit) {
      ...ContactFields
    }
  }
`;

/**
 * Get contact statistics
 */
export const GET_CONTACT_STATS = gql`
  query GetContactStats {
    contactStats {
      total
      byType
    }
  }
`;

// ==========================================
// MUTATIONS
// ==========================================

/**
 * Create new contact
 */
export const CREATE_CONTACT = gql`
  ${CONTACT_FRAGMENT}
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      ...ContactFields
    }
  }
`;

/**
 * Update existing contact
 */
export const UPDATE_CONTACT = gql`
  ${CONTACT_FRAGMENT}
  mutation UpdateContact($id: ID!, $input: ContactUpdateInput!) {
    updateContact(id: $id, input: $input) {
      ...ContactFields
    }
  }
`;

/**
 * Delete contact
 */
export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      success
      message
    }
  }
`;

/**
 * Deactivate contact
 */
export const DEACTIVATE_CONTACT = gql`
  ${CONTACT_FRAGMENT}
  mutation DeactivateContact($id: ID!) {
    deactivateContact(id: $id) {
      ...ContactFields
    }
  }
`;

/**
 * Reactivate contact
 */
export const REACTIVATE_CONTACT = gql`
  ${CONTACT_FRAGMENT}
  mutation ReactivateContact($id: ID!) {
    reactivateContact(id: $id) {
      ...ContactFields
    }
  }
`;

// ==========================================
// TYPES
// ==========================================

/**
 * Contact type enum
 */
export enum ContactType {
  GUARDIAN = 'guardian',
  STAFF = 'staff',
  VENDOR = 'vendor',
  PROVIDER = 'provider',
  OTHER = 'other',
}

/**
 * Contact interface
 */
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  email?: string;
  phone?: string;
  type: ContactType;
  organization?: string;
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  relationTo?: string;
  relationshipType?: string;
  customFields?: Record<string, any>;
  isActive: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact input for creation
 */
export interface ContactInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  type: ContactType;
  organization?: string;
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  relationTo?: string;
  relationshipType?: string;
  customFields?: Record<string, any>;
  isActive?: boolean;
  notes?: string;
}

/**
 * Contact update input
 */
export interface ContactUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  type?: ContactType;
  organization?: string;
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  relationTo?: string;
  relationshipType?: string;
  customFields?: Record<string, any>;
  isActive?: boolean;
  notes?: string;
}

/**
 * Contact filter input
 */
export interface ContactFilterInput {
  type?: ContactType;
  types?: ContactType[];
  isActive?: boolean;
  relationTo?: string;
  search?: string;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Contact list response
 */
export interface ContactListResponse {
  contacts: Contact[];
  pagination: PaginationInfo;
}

/**
 * Contact stats
 */
export interface ContactStats {
  total: number;
  byType: Record<string, number>;
}

/**
 * Delete response
 */
export interface DeleteResponse {
  success: boolean;
  message: string;
}
