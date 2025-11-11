/**
 * @fileoverview Healthcare-specific Redux Slice Factory with HIPAA Compliance
 * @module stores/sliceFactory/healthcare
 * @category Healthcare
 */

import { PayloadAction } from '@reduxjs/toolkit';
import type { WritableDraft } from '@reduxjs/toolkit';
import type { HealthcareEntity, AuditRecord } from '../types/entityTypes';
import type {
  EntityApiService,
  SliceFactoryOptions,
  SliceFactoryResult,
  DataClassification,
  AuditRecordPayload,
  DataClassificationPayload,
  EnhancedEntityState,
} from './types';
import { createEntitySlice } from './core';

/**
 * Healthcare-specific slice factory with HIPAA compliance features.
 *
 * Extends the standard entity slice factory with healthcare-specific functionality
 * including audit trail management and data classification tracking. Use this for
 * entities that contain Protected Health Information (PHI) or require HIPAA compliance.
 *
 * Additional Features Beyond Standard Slice:
 * - **Audit Trail Management**: addAuditRecord action for tracking PHI access
 * - **Data Classification**: updateDataClassification action for sensitivity updates
 * - **Compliance Fields**: Automatic handling of createdBy, modifiedBy, auditTrail
 * - **PHI Protection**: Inherits all entity management with compliance awareness
 *
 * @template T - Entity type extending HealthcareEntity (includes audit fields)
 * @template TCreate - Shape of data for entity creation
 * @template TUpdate - Shape of data for entity updates
 *
 * @param {string} name - Slice name (e.g., 'healthRecords', 'medications')
 * @param {EntityApiService<T, TCreate, TUpdate>} apiService - API service implementing EntityApiService
 * @param {SliceFactoryOptions<T>} [options={}] - Configuration options
 *
 * @returns {SliceFactoryResult<T, TCreate, TUpdate>} Complete slice with HIPAA compliance actions
 *
 * @example
 * ```typescript
 * interface HealthRecord extends HealthcareEntity {
 *   studentId: string;
 *   diagnosis: string;
 *   treatment: string;
 *   notes: string;
 * }
 *
 * const healthRecordsApiService: EntityApiService<HealthRecord> = {
 *   getAll: async (params) => {
 *     const response = await api.get('/health-records', { params });
 *     // API automatically logs PHI access
 *     return { data: response.data, total: response.total };
 *   },
 *   // ... other CRUD operations with audit logging
 * };
 *
 * const {
 *   slice,
 *   thunks,
 *   actions,
 *   reducer
 * } = createHealthcareEntitySlice('healthRecords', healthRecordsApiService);
 *
 * // Export for use in store
 * export { reducer as healthRecordsReducer, thunks as healthRecordsThunks };
 * ```
 *
 * @example
 * ```typescript
 * // Adding audit records programmatically
 * import { actions } from './healthRecordsSlice';
 *
 * // After viewing a health record
 * dispatch(actions.addAuditRecord({
 *   entityId: recordId,
 *   auditRecord: {
 *     timestamp: new Date().toISOString(),
 *     userId: currentUser.id,
 *     action: 'VIEW',
 *     ipAddress: userIpAddress,
 *     context: 'Viewed from student detail page',
 *   },
 * }));
 *
 * // Updating data classification
 * dispatch(actions.updateDataClassification({
 *   entityId: recordId,
 *   classification: 'PHI', // PHI, CONFIDENTIAL, INTERNAL, PUBLIC
 * }));
 * ```
 *
 * @remarks
 * **HIPAA Compliance Requirements**:
 * - All API operations must log PHI access to audit trail
 * - Audit records include timestamp, user, action, IP address
 * - Data classification must be set appropriately (PHI for patient data)
 * - No PHI should be persisted to browser storage
 * - Access logs must be maintained for 6 years minimum
 *
 * **Additional Actions Beyond Standard Slice**:
 * - `addAuditRecord`: Add audit trail entry to entity
 * - `updateDataClassification`: Update sensitivity classification
 *
 * **Healthcare Entity Fields**:
 * ```typescript
 * {
 *   id: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   createdBy: string;           // User who created
 *   modifiedBy: string;          // User who last modified
 *   auditTrail: AuditRecord[];   // Complete access history
 *   dataClassification: 'PHI' | 'CONFIDENTIAL' | 'INTERNAL' | 'PUBLIC';
 * }
 * ```
 *
 * **Audit Record Structure**:
 * ```typescript
 * {
 *   timestamp: string;
 *   userId: string;
 *   action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'PRINT';
 *   ipAddress?: string;
 *   context?: string;
 * }
 * ```
 *
 * @see {@link createEntitySlice} for standard entity slice factory
 * @see {@link HealthcareEntity} for healthcare entity interface
 * @see {@link AuditRecord} for audit record structure
 */
export function createHealthcareEntitySlice<
  T extends HealthcareEntity,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
>(
  name: string,
  apiService: EntityApiService<T, TCreate, TUpdate>,
  options: SliceFactoryOptions<T> = {}
): SliceFactoryResult<T, TCreate, TUpdate> {
  
  // Add healthcare-specific options
  const healthcareOptions: SliceFactoryOptions<T> = {
    ...options,
    extraReducers: {
      ...options.extraReducers,

      // Audit trail management
      addAuditRecord: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as AuditRecordPayload;
        const { entityId, auditRecord } = payload;
        const entity = state.entities[entityId];
        if (entity && 'auditTrail' in entity) {
          const healthcareEntity = entity as HealthcareEntity;
          if (healthcareEntity.auditTrail) {
            healthcareEntity.auditTrail = [...healthcareEntity.auditTrail, auditRecord];
          } else {
            healthcareEntity.auditTrail = [auditRecord];
          }
          // Update the modifiedBy field when adding audit records
          healthcareEntity.modifiedBy = auditRecord.userId;
          healthcareEntity.updatedAt = new Date().toISOString();
        }
      },

      // Data classification updates
      updateDataClassification: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as DataClassificationPayload;
        const { entityId, classification } = payload;
        const entity = state.entities[entityId];
        if (entity && 'dataClassification' in entity) {
          const healthcareEntity = entity as HealthcareEntity;
          const previousClassification = healthcareEntity.dataClassification;
          healthcareEntity.dataClassification = classification;
          healthcareEntity.updatedAt = new Date().toISOString();

          // Add audit record for classification change
          const auditRecord: AuditRecord = {
            timestamp: new Date().toISOString(),
            userId: 'system', // This should be replaced with actual user ID
            action: 'UPDATE',
            context: `Data classification changed from ${previousClassification} to ${classification}`,
          };

          if (healthcareEntity.auditTrail) {
            healthcareEntity.auditTrail = [...healthcareEntity.auditTrail, auditRecord];
          } else {
            healthcareEntity.auditTrail = [auditRecord];
          }
        }
      },

      // Bulk audit record addition for compliance
      addBulkAuditRecords: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as { records: Array<{ entityId: string; auditRecord: AuditRecord }> };
        const { records } = payload;
        records.forEach(({ entityId, auditRecord }) => {
          const entity = state.entities[entityId];
          if (entity && 'auditTrail' in entity) {
            const healthcareEntity = entity as HealthcareEntity;
            if (healthcareEntity.auditTrail) {
              healthcareEntity.auditTrail = [...healthcareEntity.auditTrail, auditRecord];
            } else {
              healthcareEntity.auditTrail = [auditRecord];
            }
          }
        });
      },

      // Mark entities as accessed for compliance tracking
      markAsAccessed: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as { entityIds: string[]; userId: string; accessType: string };
        const { entityIds, userId, accessType } = payload;
        const timestamp = new Date().toISOString();

        entityIds.forEach(entityId => {
          const entity = state.entities[entityId];
          if (entity && 'auditTrail' in entity) {
            const healthcareEntity = entity as HealthcareEntity;
            const auditRecord: AuditRecord = {
              timestamp,
              userId,
              action: 'VIEW',
              context: `Accessed via ${accessType}`,
            };

            if (healthcareEntity.auditTrail) {
              healthcareEntity.auditTrail = [...healthcareEntity.auditTrail, auditRecord];
            } else {
              healthcareEntity.auditTrail = [auditRecord];
            }
          }
        });
      },

      // Update compliance metadata
      updateComplianceMetadata: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as { entityId: string; metadata: Partial<HealthcareEntity> };
        const { entityId, metadata } = payload;
        const entity = state.entities[entityId];
        if (entity) {
          Object.assign(entity, {
            ...metadata,
            updatedAt: new Date().toISOString(),
          });
        }
      },

      // Sanitize PHI for non-authorized users (placeholder - actual implementation would depend on user permissions)
      sanitizePHI: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => {
        const payload = action.payload as { entityIds: string[]; userRole: string };
        const { entityIds, userRole } = payload;
        
        // Only sanitize if user doesn't have PHI access (this is a simplified example)
        if (userRole !== 'HEALTHCARE_PROVIDER' && userRole !== 'ADMIN') {
          entityIds.forEach(entityId => {
            const entity = state.entities[entityId];
            if (entity && 'dataClassification' in entity) {
              const healthcareEntity = entity as HealthcareEntity;
              if (healthcareEntity.dataClassification === 'PHI') {
                // Sanitize sensitive fields (implementation would vary by entity type)
                Object.keys(healthcareEntity).forEach(key => {
                  if (key.includes('ssn') || key.includes('Social') || key.includes('dob')) {
                    (healthcareEntity as unknown as Record<string, unknown>)[key] = '[REDACTED]';
                  }
                });
              }
            }
          });
        }
      },
    },
  };

  return createEntitySlice(name, apiService, healthcareOptions);
}

/**
 * Create audit record with current timestamp and user context
 */
export function createAuditRecord(
  userId: string,
  action: AuditRecord['action'],
  context?: string,
  ipAddress?: string
): AuditRecord {
  return {
    timestamp: new Date().toISOString(),
    userId,
    action,
    context,
    ipAddress,
  };
}

/**
 * Validate data classification for healthcare entities
 */
export function validateDataClassification(classification: string): classification is DataClassification {
  return ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI'].includes(classification);
}

/**
 * Check if entity contains PHI based on classification
 */
export function containsPHI(entity: HealthcareEntity): boolean {
  return entity.dataClassification === 'PHI';
}

/**
 * Generate compliance report data for audit trail
 */
export function generateComplianceReport(entities: HealthcareEntity[]): {
  totalEntities: number;
  phiEntities: number;
  entitiesWithAuditTrail: number;
  recentAccess: Array<{ entityId: string; lastAccessed: string; userId: string }>;
} {
  const phiEntities = entities.filter(containsPHI);
  const entitiesWithAuditTrail = entities.filter(entity => entity.auditTrail && entity.auditTrail.length > 0);
  
  const recentAccess = entities
    .filter(entity => entity.auditTrail && entity.auditTrail.length > 0)
    .map(entity => {
      const lastAuditRecord = entity.auditTrail![entity.auditTrail!.length - 1];
      if (!lastAuditRecord) {
        return null;
      }
      return {
        entityId: entity.id,
        lastAccessed: lastAuditRecord.timestamp,
        userId: lastAuditRecord.userId,
      };
    })
    .filter((access): access is { entityId: string; lastAccessed: string; userId: string } => access !== null)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 10); // Most recent 10 accesses

  return {
    totalEntities: entities.length,
    phiEntities: phiEntities.length,
    entitiesWithAuditTrail: entitiesWithAuditTrail.length,
    recentAccess,
  };
}

export default createHealthcareEntitySlice;
