/**
 * @fileoverview Contact GraphQL Queries
 *
 * GraphQL queries for contact data fetching
 * Based on backend GraphQL schema
 *
 * @module graphql/queries/contact
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  CONTACT_BASIC_FRAGMENT,
  CONTACT_DETAILED_FRAGMENT,
  EMERGENCY_CONTACT_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from '../fragments';

/**
 * Get contacts (from backend schema)
 */
export const GET_CONTACTS = gql`
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
        ...ContactBasic
      }
      pagination {
        ...PageInfo
      }
    }
  }
  ${CONTACT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Get contact by ID (from backend schema)
 */
export const GET_CONTACT = gql`
  query GetContact($id: ID!) {
    contact(id: $id) {
      ...ContactDetailed
    }
  }
  ${CONTACT_DETAILED_FRAGMENT}
`;

/**
 * Get contacts by relation (from backend schema)
 */
export const GET_CONTACTS_BY_RELATION = gql`
  query GetContactsByRelation($relationTo: ID!, $type: ContactType) {
    contactsByRelation(relationTo: $relationTo, type: $type) {
      ...ContactBasic
    }
  }
  ${CONTACT_BASIC_FRAGMENT}
`;

/**
 * Search contacts (from backend schema)
 */
export const SEARCH_CONTACTS = gql`
  query SearchContacts($query: String!, $limit: Int) {
    searchContacts(query: $query, limit: $limit) {
      ...ContactBasic
    }
  }
  ${CONTACT_BASIC_FRAGMENT}
`;

/**
 * Get contact statistics (from backend schema)
 */
export const GET_CONTACT_STATS = gql`
  query GetContactStats {
    contactStats {
      total
      byType
    }
  }
`;

/**
 * Get emergency contacts for student
 */
export const GET_STUDENT_EMERGENCY_CONTACTS = gql`
  query GetStudentEmergencyContacts($studentId: ID!) {
    studentEmergencyContacts(studentId: $studentId) {
      ...EmergencyContact
    }
  }
  ${EMERGENCY_CONTACT_FRAGMENT}
`;
