/**
 * @fileoverview Audit Logging Module - Main Export Index
 * 
 * This module serves as the primary entry point for the HIPAA-compliant audit logging
 * system. It provides a clean, well-organized API for integrating audit logging into
 * healthcare applications with comprehensive type safety and developer experience.
 *
 * @module AuditIndex
 * @version 1.0.0
 * @since 2025-10-21
 * 
 * @description
 * The audit logging system provides:
 * 
 * **Core Components:**
 * - **AuditService**: Main service class for direct instantiation
 * - **auditService**: Pre-configured singleton instance for immediate use
 * - **useAudit**: React hook for component-level audit logging (when available)
 * - **Type Definitions**: Complete TypeScript interfaces and enums
 * - **Configuration**: Default settings and helper functions
 * 
 * **Integration Patterns:**
 * - **Service Layer**: Direct service usage for business logic
 * - **React Components**: Hook-based integration for UI components
 * - **Utility Functions**: Helper functions for common operations
 * - **Configuration**: Customizable settings for different environments
 * 
 * **Export Categories:**
 * - **Services**: Main audit service implementations
 * - **Hooks**: React integration hooks (when available)
 * - **Types**: Complete type definitions and interfaces
 * - **Enums**: Action types, resource types, severity levels
 * - **Configuration**: Default settings and utility functions
 * 
 * @example Basic Service Usage
 * ```typescript
 * import { auditService, AuditAction, AuditResourceType } from '@/services/audit';
 * 
 * // Initialize with user context
 * auditService.setUserContext({
 *   id: 'user123',
 *   email: 'nurse@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: 'School Nurse'
 * });
 * 
 * // Log basic operation
 * await auditService.log({
 *   action: AuditAction.CREATE_MEDICATION,
 *   resourceType: AuditResourceType.MEDICATION,
 *   resourceId: medication.id,
 *   studentId: student.id
 * });
 * ```
 * 
 * @example React Component Usage (when hook available)
 * ```typescript
 * import { useAudit, AuditAction, AuditResourceType } from '@/services/audit';
 * 
 * function HealthRecordComponent({ studentId, recordId }) {
 *   const audit = useAudit();
 * 
 *   const handleViewRecord = async () => {
 *     // Log PHI access
 *     await audit.logPHIAccess(
 *       AuditAction.VIEW_HEALTH_RECORD,
 *       studentId,
 *       AuditResourceType.HEALTH_RECORD,
 *       recordId
 *     );
 * 
 *     // Perform actual operation
 *     await loadHealthRecord(recordId);
 *   };
 * 
 *   return <button onClick={handleViewRecord}>View Record</button>;
 * }
 * ```
 * 
 * @example Advanced Usage with Change Tracking
 * ```typescript
 * import { auditService, AuditAction, AuditResourceType, AuditSeverity } from '@/services/audit';
 * 
 * async function updateStudentAllergy(studentId: string, allergyId: string, updates: any) {
 *   const oldAllergy = await getAllergy(allergyId);
 *   
 *   try {
 *     const newAllergy = await updateAllergy(allergyId, updates);
 *     
 *     // Log successful update with change tracking
 *     await auditService.log({
 *       action: AuditAction.UPDATE_ALLERGY,
 *       resourceType: AuditResourceType.ALLERGY,
 *       resourceId: allergyId,
 *       studentId,
 *       changes: [{
 *         field: 'severity',
 *         oldValue: oldAllergy.severity,
 *         newValue: newAllergy.severity,
 *         type: 'UPDATE'
 *       }],
 *       severity: AuditSeverity.HIGH,
 *       reason: 'Updated based on recent reaction'
 *     });
 *     
 *     return newAllergy;
 *   } catch (error) {
 *     // Log failed operation
 *     await auditService.logFailure({
 *       action: AuditAction.UPDATE_ALLERGY,
 *       resourceType: AuditResourceType.ALLERGY,
 *       resourceId: allergyId,
 *       studentId
 *     }, error);
 *     
 *     throw error;
 *   }
 * }
 * ```
 * 
 * @example Custom Service Configuration
 * ```typescript
 * import { AuditService, DEFAULT_AUDIT_CONFIG } from '@/services/audit';
 * 
 * // Create custom service instance
 * const customAuditService = new AuditService({
 *   ...DEFAULT_AUDIT_CONFIG,
 *   batchSize: 25,          // Larger batches
 *   batchInterval: 3000,    // More frequent flushes
 *   enableDebug: true       // Enhanced logging
 * });
 * ```
 * 
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 * 
 * @requires TypeScript 4.5+
 * @requires Modern Browser with localStorage support
 * @requires HIPAA Compliance Review for Production Use
 * 
 * @see {@link AuditService} for service implementation details
 * @see {@link IAuditService} for interface specification
 * @see {@link AuditConfig} for configuration options
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

// Main Service
export { AuditService, auditService, initializeAuditService, cleanupAuditService } from './AuditService';

// React Hook (Note: useAudit hook not yet implemented)
// export { useAudit } from './useAudit';
// export type { UseAuditResult } from './useAudit';

// Types and Interfaces
export type {
  AuditEvent,
  AuditLogParams,
  AuditBatch,
  AuditChange,
  AuditEventFilter,
  AuditStatistics,
  AuditConfig,
  IAuditService,
  AuditServiceStatus,
  AuditApiResponse,
  AuditQueryResponse,
} from './types';

// Enums
export {
  AuditAction,
  AuditResourceType,
  AuditSeverity,
  AuditStatus,
} from './types';

// Configuration
export {
  DEFAULT_AUDIT_CONFIG,
  ACTION_SEVERITY_MAP,
  RESOURCE_PHI_MAP,
  isCriticalAction,
  isCriticalSeverity,
  getActionSeverity,
  isResourcePHI,
  requiresImmediateFlush,
} from './config';

// Default export
export { auditService as default } from './AuditService';
