/**
 * @fileoverview HIPAA-Compliant Audit Logging System - PHI Classification
 *
 * This module provides Protected Health Information (PHI) classification for
 * audit resources, ensuring proper handling of sensitive healthcare data
 * under HIPAA regulations.
 *
 * @module AuditConfig/PHI
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The PHI classification system manages:
 * - **Resource PHI Mapping**: Comprehensive mapping of resources to PHI status
 * - **HIPAA Compliance**: Automatic PHI detection and classification
 * - **Security Handling**: Enhanced security measures for PHI resources
 * - **Access Control**: Specialized access policies for PHI data
 *
 * PHI Classification:
 * - **true**: Resource contains or may contain PHI data
 * - **false**: Resource does not typically contain PHI data
 * - **Context-dependent**: Documents and reports may contain PHI based on content
 *
 * HIPAA PHI Definition:
 * PHI includes any individually identifiable health information held or transmitted
 * by a covered entity or business associate, including:
 * - Health records, allergies, conditions, medications
 * - Student health information and emergency contacts
 * - Growth measurements, vital signs, screening results
 * - Medical history, treatment records, and care plans
 *
 * @example PHI Classification Check
 * ```typescript
 * import { isResourcePHI, AuditResourceType } from './config.phi';
 *
 * const isHealthRecordPHI = isResourcePHI(AuditResourceType.HEALTH_RECORD);
 * console.log(isHealthRecordPHI); // true
 * ```
 *
 * @example Conditional Security Handling
 * ```typescript
 * import { isResourcePHI } from './config.phi';
 *
 * function handleResourceAccess(resourceType: AuditResourceType) {
 *   if (isResourcePHI(resourceType)) {
 *     // Enhanced security measures
 *     await validateHIPAACompliance();
 *     await logDetailedAuditTrail();
 *   }
 * }
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires HIPAA Compliance Review
 *
 * @see {@link AuditResourceType} for resource type definitions
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

import { AuditResourceType } from './types';

/**
 * @constant {Record<AuditResourceType, boolean>} RESOURCE_PHI_MAP
 * @description Mapping of resource types to their PHI (Protected Health Information)
 * classification status. This mapping enables automatic PHI detection and ensures
 * appropriate handling of sensitive healthcare data under HIPAA regulations.
 *
 * **PHI Classification Logic:**
 * - **true**: Resource contains or may contain PHI data
 * - **false**: Resource does not typically contain PHI data
 * - **Context-dependent**: Documents and reports may contain PHI based on content
 *
 * **HIPAA PHI Definition:**
 * PHI includes any individually identifiable health information held or transmitted
 * by a covered entity or business associate, including:
 * - Health records, allergies, conditions, medications
 * - Student health information and emergency contacts
 * - Growth measurements, vital signs, screening results
 * - Medical history, treatment records, and care plans
 *
 * **System Impact:**
 * - Automatic isPHI flag setting during audit event creation
 * - Enhanced security measures for PHI resources
 * - Specialized audit trails for compliance reporting
 * - Access control and authorization enforcement
 *
 * @example PHI Classification Check
 * ```typescript
 * import { RESOURCE_PHI_MAP, AuditResourceType } from './config.phi';
 *
 * const isHealthRecordPHI = RESOURCE_PHI_MAP[AuditResourceType.HEALTH_RECORD];
 * console.log(isHealthRecordPHI); // true
 *
 * const isInventoryPHI = RESOURCE_PHI_MAP[AuditResourceType.INVENTORY];
 * console.log(isInventoryPHI); // false
 * ```
 *
 * @example Finding All PHI Resources
 * ```typescript
 * import { RESOURCE_PHI_MAP } from './config.phi';
 *
 * const phiResources = Object.entries(RESOURCE_PHI_MAP)
 *   .filter(([_, isPHI]) => isPHI)
 *   .map(([resourceType, _]) => resourceType);
 *
 * console.log('PHI resource types:', phiResources);
 * ```
 *
 * @since 1.0.0
 * @readonly
 * @see {@link isResourcePHI} for helper function
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */
export const RESOURCE_PHI_MAP: Record<AuditResourceType, boolean> = {
  [AuditResourceType.HEALTH_RECORD]: true,
  [AuditResourceType.ALLERGY]: true,
  [AuditResourceType.CHRONIC_CONDITION]: true,
  [AuditResourceType.VACCINATION]: true,
  [AuditResourceType.SCREENING]: true,
  [AuditResourceType.GROWTH_MEASUREMENT]: true,
  [AuditResourceType.VITAL_SIGNS]: true,
  [AuditResourceType.MEDICATION]: true,
  [AuditResourceType.STUDENT_MEDICATION]: true,
  [AuditResourceType.MEDICATION_LOG]: true,
  [AuditResourceType.ADVERSE_REACTION]: true,
  [AuditResourceType.STUDENT]: true,
  [AuditResourceType.EMERGENCY_CONTACT]: true,
  [AuditResourceType.DOCUMENT]: false, // Depends on content
  [AuditResourceType.REPORT]: false, // Depends on content
  [AuditResourceType.EXPORT]: true, // Exports likely contain PHI
  [AuditResourceType.INVENTORY]: false,
};

/**
 * @function isResourcePHI
 * @description Determines if a resource type contains Protected Health Information (PHI)
 * according to HIPAA regulations. This classification affects security handling,
 * audit requirements, and access control policies.
 *
 * **PHI Determination Logic:**
 * - Uses RESOURCE_PHI_MAP for predefined classifications
 * - Defaults to false for unknown resource types (conservative approach)
 * - Supports context-dependent resources (documents, reports)
 *
 * **HIPAA Compliance Impact:**
 * - PHI resources require enhanced audit trails
 * - Additional security measures and access controls
 * - Specialized reporting and retention policies
 * - Breach notification requirements
 *
 * @param {AuditResourceType} resourceType - The resource type to evaluate
 * @returns {boolean} True if the resource type contains PHI, false otherwise
 *
 * @example PHI Classification
 * ```typescript
 * import { isResourcePHI, AuditResourceType } from './config.phi';
 *
 * const isHealthRecordPHI = isResourcePHI(AuditResourceType.HEALTH_RECORD);
 * console.log(isHealthRecordPHI); // true
 *
 * const isInventoryPHI = isResourcePHI(AuditResourceType.INVENTORY);
 * console.log(isInventoryPHI); // false
 * ```
 *
 * @example Conditional Security Handling
 * ```typescript
 * function handleResourceAccess(resourceType: AuditResourceType) {
 *   if (isResourcePHI(resourceType)) {
 *     // Enhanced security measures
 *     await validateHIPAACompliance();
 *     await logDetailedAuditTrail();
 *   } else {
 *     // Standard access logging
 *     await logBasicAccess();
 *   }
 * }
 * ```
 *
 * @example Automatic PHI Flagging
 * ```typescript
 * function createAuditEvent(params: AuditLogParams) {
 *   return {
 *     ...params,
 *     isPHI: params.isPHI ?? isResourcePHI(params.resourceType),
 *     // ... other fields
 *   };
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link RESOURCE_PHI_MAP} for complete resource classification
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */
export function isResourcePHI(resourceType: AuditResourceType): boolean {
  return RESOURCE_PHI_MAP[resourceType] || false;
}
