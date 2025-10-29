/**
 * @fileoverview Health Record GraphQL Mutations
 *
 * GraphQL mutations for health record CRUD operations
 *
 * @module graphql/mutations/healthRecord
 * @since 1.0.0
 */

import { gql } from '@apollo/client';
import {
  HEALTH_RECORD_DETAILED_FRAGMENT,
  VITAL_SIGNS_FRAGMENT,
  ALLERGY_FRAGMENT,
  IMMUNIZATION_FRAGMENT,
  SCREENING_FRAGMENT,
  CHRONIC_CONDITION_FRAGMENT,
  DELETE_RESPONSE_FRAGMENT,
} from '../fragments';

/**
 * Create health record
 */
export const CREATE_HEALTH_RECORD = gql`
  mutation CreateHealthRecord($input: HealthRecordInput!) {
    createHealthRecord(input: $input) {
      ...HealthRecordDetailed
    }
  }
  ${HEALTH_RECORD_DETAILED_FRAGMENT}
`;

/**
 * Update health record
 */
export const UPDATE_HEALTH_RECORD = gql`
  mutation UpdateHealthRecord($id: ID!, $input: HealthRecordUpdateInput!) {
    updateHealthRecord(id: $id, input: $input) {
      ...HealthRecordDetailed
    }
  }
  ${HEALTH_RECORD_DETAILED_FRAGMENT}
`;

/**
 * Delete health record
 */
export const DELETE_HEALTH_RECORD = gql`
  mutation DeleteHealthRecord($id: ID!) {
    deleteHealthRecord(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Record vital signs
 */
export const RECORD_VITAL_SIGNS = gql`
  mutation RecordVitalSigns($input: VitalSignsInput!) {
    recordVitalSigns(input: $input) {
      ...VitalSigns
    }
  }
  ${VITAL_SIGNS_FRAGMENT}
`;

/**
 * Add allergy
 */
export const ADD_ALLERGY = gql`
  mutation AddAllergy($input: AllergyInput!) {
    addAllergy(input: $input) {
      ...Allergy
    }
  }
  ${ALLERGY_FRAGMENT}
`;

/**
 * Update allergy
 */
export const UPDATE_ALLERGY = gql`
  mutation UpdateAllergy($id: ID!, $input: AllergyUpdateInput!) {
    updateAllergy(id: $id, input: $input) {
      ...Allergy
    }
  }
  ${ALLERGY_FRAGMENT}
`;

/**
 * Remove allergy
 */
export const REMOVE_ALLERGY = gql`
  mutation RemoveAllergy($id: ID!) {
    removeAllergy(id: $id) {
      ...DeleteResponse
    }
  }
  ${DELETE_RESPONSE_FRAGMENT}
`;

/**
 * Record immunization
 */
export const RECORD_IMMUNIZATION = gql`
  mutation RecordImmunization($input: ImmunizationInput!) {
    recordImmunization(input: $input) {
      ...Immunization
    }
  }
  ${IMMUNIZATION_FRAGMENT}
`;

/**
 * Record screening
 */
export const RECORD_SCREENING = gql`
  mutation RecordScreening($input: ScreeningInput!) {
    recordScreening(input: $input) {
      ...Screening
    }
  }
  ${SCREENING_FRAGMENT}
`;

/**
 * Add chronic condition
 */
export const ADD_CHRONIC_CONDITION = gql`
  mutation AddChronicCondition($input: ChronicConditionInput!) {
    addChronicCondition(input: $input) {
      ...ChronicCondition
    }
  }
  ${CHRONIC_CONDITION_FRAGMENT}
`;

/**
 * Update chronic condition
 */
export const UPDATE_CHRONIC_CONDITION = gql`
  mutation UpdateChronicCondition($id: ID!, $input: ChronicConditionUpdateInput!) {
    updateChronicCondition(id: $id, input: $input) {
      ...ChronicCondition
    }
  }
  ${CHRONIC_CONDITION_FRAGMENT}
`;

/**
 * Deactivate chronic condition
 */
export const DEACTIVATE_CHRONIC_CONDITION = gql`
  mutation DeactivateChronicCondition($id: ID!) {
    deactivateChronicCondition(id: $id) {
      ...ChronicCondition
    }
  }
  ${CHRONIC_CONDITION_FRAGMENT}
`;
