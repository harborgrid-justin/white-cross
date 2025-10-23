/**
 * LOC: GQL-SCHEMA-001
 * WC-GQL-SCHEMA-001 | GraphQL Schema Definition
 * 
 * Purpose: Main GraphQL schema combining all type definitions
 * Inspired by: TwentyHQ GraphQL API Layer
 * Features: Type-safe API, flexible queries, HIPAA-compliant
 * 
 * UPSTREAM (imports from):
 *   - Contact schema
 *   - Student schema
 * 
 * DOWNSTREAM (imported by):
 *   - Apollo Server setup
 */

export const typeDefs = `#graphql
  # Base types
  scalar DateTime
  scalar JSON

  # Pagination
  type PageInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  # Contact Type Enum
  enum ContactType {
    guardian
    staff
    vendor
    provider
    other
  }

  # Contact Type
  type Contact {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    displayName: String!
    email: String
    phone: String
    type: ContactType!
    organization: String
    title: String
    address: String
    city: String
    state: String
    zip: String
    relationTo: ID
    relationshipType: String
    customFields: JSON
    isActive: Boolean!
    notes: String
    createdBy: ID
    updatedBy: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Contact List Response
  type ContactListResponse {
    contacts: [Contact!]!
    pagination: PageInfo!
  }

  # Contact Input
  input ContactInput {
    firstName: String!
    lastName: String!
    email: String
    phone: String
    type: ContactType!
    organization: String
    title: String
    address: String
    city: String
    state: String
    zip: String
    relationTo: ID
    relationshipType: String
    customFields: JSON
    isActive: Boolean
    notes: String
  }

  # Contact Update Input
  input ContactUpdateInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    type: ContactType
    organization: String
    title: String
    address: String
    city: String
    state: String
    zip: String
    relationTo: ID
    relationshipType: String
    customFields: JSON
    isActive: Boolean
    notes: String
  }

  # Contact Filter Input
  input ContactFilterInput {
    type: ContactType
    types: [ContactType!]
    isActive: Boolean
    relationTo: ID
    search: String
  }

  # Contact Stats
  type ContactStats {
    total: Int!
    byType: JSON!
  }

  # Gender Enum (for students)
  enum Gender {
    MALE
    FEMALE
    OTHER
    PREFER_NOT_TO_SAY
  }

  # Student Type (simplified for GraphQL)
  type Student {
    id: ID!
    studentNumber: String!
    firstName: String!
    lastName: String!
    fullName: String!
    dateOfBirth: DateTime!
    grade: String!
    gender: Gender!
    photo: String
    medicalRecordNum: String
    isActive: Boolean!
    enrollmentDate: DateTime!
    nurseId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Student List Response
  type StudentListResponse {
    students: [Student!]!
    pagination: PageInfo!
  }

  # Student Filter Input
  input StudentFilterInput {
    isActive: Boolean
    grade: String
    nurseId: ID
    search: String
  }

  # Queries
  type Query {
    # Contact Queries
    contacts(
      page: Int = 1
      limit: Int = 20
      orderBy: String = "lastName"
      orderDirection: String = "ASC"
      filters: ContactFilterInput
    ): ContactListResponse!
    
    contact(id: ID!): Contact
    
    contactsByRelation(relationTo: ID!, type: ContactType): [Contact!]!
    
    searchContacts(query: String!, limit: Int = 10): [Contact!]!
    
    contactStats: ContactStats!

    # Student Queries
    students(
      page: Int = 1
      limit: Int = 20
      orderBy: String = "lastName"
      orderDirection: String = "ASC"
      filters: StudentFilterInput
    ): StudentListResponse!
    
    student(id: ID!): Student
  }

  # Mutations
  type Mutation {
    # Contact Mutations
    createContact(input: ContactInput!): Contact!
    
    updateContact(id: ID!, input: ContactUpdateInput!): Contact!
    
    deleteContact(id: ID!): DeleteResponse!
    
    deactivateContact(id: ID!): Contact!
    
    reactivateContact(id: ID!): Contact!
  }

  # Delete Response
  type DeleteResponse {
    success: Boolean!
    message: String!
  }
`;

export default typeDefs;
