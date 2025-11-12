/**
 * @fileoverview Health-related entity cache invalidation rules
 * @module services/cache/invalidation-rules/health-rules
 * @category Services - Cache Invalidation
 *
 * Provides granular invalidation rules for health record and medication
 * entity operations. These rules ensure proper cache updates for
 * healthcare-critical data while maintaining data consistency.
 *
 * Key Features:
 * - Health record invalidation rules (create, update)
 * - Medication invalidation rules (create, update status)
 * - Student health summary coordination
 * - Optimized refetch strategies for medical data
 *
 * @example
 * ```typescript
 * const healthRules = createHealthRecordRules();
 * const medRules = createMedicationRules();
 * ```
 */

import type {
  InvalidationRule,
  InvalidationTarget,
  InvalidationOperation
} from '../types';
import { QueryKeyFactory } from '../QueryKeyFactory';

/**
 * Create Health Record Invalidation Rules
 *
 * @returns Array of invalidation rules for health record operations
 *
 * @description
 * Generates invalidation rules for health record operations:
 * - CREATE: Invalidates student's health record list and student detail
 * - UPDATE: Invalidates specific record and student's health record list
 */
export function createHealthRecordRules(): InvalidationRule[] {
  const rules: InvalidationRule[] = [
    // CREATE HEALTH RECORD
    {
      operationPattern: /^create$/i,
      entityType: 'health-records',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate lists for this student
        const studentId = op.newValues?.studentId;
        if (studentId) {
          targets.push({
            queryKey: QueryKeyFactory.toString(
              QueryKeyFactory.create({
                entity: 'health-records',
                operation: 'list',
                filters: { studentId }
              })
            ),
            refetch: true
          });

          // Invalidate student's health summary
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              studentId
            ]),
            refetch: true
          });
        }

        return targets;
      }
    },

    // UPDATE HEALTH RECORD
    {
      operationPattern: /^update$/i,
      entityType: 'health-records',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate the specific record
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'health-records',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Invalidate student's health records list
        const studentId = op.newValues?.studentId ?? op.previousValues?.studentId;
        if (studentId) {
          targets.push({
            queryKey: QueryKeyFactory.toString(
              QueryKeyFactory.create({
                entity: 'health-records',
                operation: 'list',
                filters: { studentId }
              })
            ),
            refetch: true
          });
        }

        return targets;
      }
    }
  ];

  return rules;
}

/**
 * Create Medication Invalidation Rules
 *
 * @returns Array of invalidation rules for medication operations
 *
 * @description
 * Generates invalidation rules for medication operations:
 * - CREATE: Invalidates all medication lists and active medications
 * - UPDATE_STATUS: Invalidates specific medication and active list if status changed
 */
export function createMedicationRules(): InvalidationRule[] {
  const rules: InvalidationRule[] = [
    // CREATE MEDICATION
    {
      operationPattern: /^create$/i,
      entityType: 'medications',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate all medication lists
        targets.push({
          queryKey: /^\["medications","list"/,
          refetch: true
        });

        // Invalidate active medications
        targets.push({
          queryKey: QueryKeyFactory.toString(
            QueryKeyFactory.create({
              entity: 'medications',
              operation: 'list',
              filters: { status: 'active' }
            })
          ),
          refetch: true
        });

        return targets;
      }
    },

    // UPDATE MEDICATION STATUS
    {
      operationPattern: /^update.*status$/i,
      entityType: 'medications',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate the specific medication
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'medications',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Only invalidate active list if status changed to/from active
        const statusChanged = op.changedFields?.includes('status') ?? false;
        if (statusChanged) {
          targets.push({
            queryKey: QueryKeyFactory.toString(
              QueryKeyFactory.create({
                entity: 'medications',
                operation: 'list',
                filters: { status: 'active' }
              })
            ),
            refetch: true
          });
        }

        return targets;
      }
    }
  ];

  return rules;
}
