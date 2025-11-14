/**
 * @fileoverview Appointment and incident entity cache invalidation rules
 * @module services/cache/invalidation-rules/other-rules
 * @category Services - Cache Invalidation
 *
 * Provides granular invalidation rules for appointment and incident
 * entity operations. These rules ensure proper cache updates for
 * scheduling and incident tracking data.
 *
 * Key Features:
 * - Appointment invalidation rules (create)
 * - Incident invalidation rules (create)
 * - Optimized refetch strategies for time-sensitive data
 *
 * @example
 * ```typescript
 * const appointmentRules = createAppointmentRules();
 * const incidentRules = createIncidentRules();
 * ```
 */

import type {
  InvalidationRule,
  InvalidationTarget,
  InvalidationOperation
} from '../types';
import { QueryKeyFactory } from '../QueryKeyFactory';

/**
 * Create Appointment Invalidation Rules
 *
 * @returns Array of invalidation rules for appointment operations
 *
 * @description
 * Generates invalidation rules for appointment operations:
 * - CREATE: Invalidates upcoming appointments list
 */
export function createAppointmentRules(): InvalidationRule[] {
  const rules: InvalidationRule[] = [
    // CREATE APPOINTMENT
    {
      operationPattern: /^create$/i,
      entityType: 'appointments',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate upcoming appointments
        targets.push({
          queryKey: QueryKeyFactory.toString(
            QueryKeyFactory.create({
              entity: 'appointments',
              operation: 'list',
              filters: { status: 'upcoming' }
            })
          ),
          refetch: true
        });

        return targets;
      }
    }
  ];

  return rules;
}

/**
 * Create Incident Invalidation Rules
 *
 * @returns Array of invalidation rules for incident operations
 *
 * @description
 * Generates invalidation rules for incident operations:
 * - CREATE: Invalidates all incident lists, recent incidents, and stats
 */
export function createIncidentRules(): InvalidationRule[] {
  const rules: InvalidationRule[] = [
    // CREATE INCIDENT
    {
      operationPattern: /^create$/i,
      entityType: 'incidents',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate incident lists
        targets.push({
          queryKey: /^\["incidents","list"/,
          refetch: true
        });

        // Invalidate recent incidents
        targets.push({
          queryKey: QueryKeyFactory.toString(
            QueryKeyFactory.create({
              entity: 'incidents',
              operation: 'list',
              filters: { recent: true }
            })
          ),
          refetch: true
        });

        // Invalidate incident stats
        targets.push({
          queryKey: /^\["incidents","stats"\]/,
          refetch: true
        });

        return targets;
      }
    }
  ];

  return rules;
}
