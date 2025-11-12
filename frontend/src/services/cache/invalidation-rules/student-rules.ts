/**
 * @fileoverview Student entity cache invalidation rules
 * @module services/cache/invalidation-rules/student-rules
 * @category Services - Cache Invalidation
 *
 * Provides granular invalidation rules for student entity operations.
 * Each rule defines which cache queries should be invalidated based on
 * specific student operations (create, update, delete).
 *
 * Key Features:
 * - Operation-specific invalidation (create, update personal info, grade, school, status, delete)
 * - Field-aware invalidation (only invalidate relevant queries)
 * - Relationship tracking (student → lists → stats)
 * - Optimized refetch strategies
 *
 * @example
 * ```typescript
 * const rules = createStudentRules();
 * // Returns array of InvalidationRule objects for student operations
 * ```
 */

import type {
  InvalidationRule,
  InvalidationTarget,
  InvalidationOperation
} from '../types';
import { QueryKeyFactory } from '../QueryKeyFactory';

/**
 * Create Student Invalidation Rules
 *
 * @returns Array of invalidation rules for student operations
 *
 * @description
 * Generates comprehensive invalidation rules for all student operations:
 * - CREATE: Invalidates all lists and stats
 * - UPDATE_PERSONAL_INFO: Surgical updates for specific student and affected lists
 * - UPDATE_GRADE: Updates student, old/new grade lists, and stats
 * - UPDATE_SCHOOL: Updates student and old/new school lists
 * - UPDATE_STATUS: Updates student, active/archived lists, and stats
 * - DELETE: Invalidates all lists and specific student detail
 */
export function createStudentRules(): InvalidationRule[] {
  const rules: InvalidationRule[] = [
    // CREATE STUDENT
    {
      operationPattern: /^create$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate all student lists (new student affects all lists)
        targets.push({
          queryKey: /^\["students","list"/,
          refetch: true
        });

        // Invalidate statistics
        targets.push({
          queryKey: /^\["students","stats"\]/,
          refetch: true
        });

        return targets;
      }
    },

    // UPDATE PERSONAL INFO
    {
      operationPattern: /^update.*personal.*info$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Always invalidate the specific student detail
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Only invalidate lists if name changed (affects sorting/display)
        const nameChanged =
          op.changedFields?.some((field) =>
            ['firstName', 'lastName', 'preferredName'].includes(field)
          ) ?? false;

        if (nameChanged) {
          targets.push({
            queryKey: /^\["students","list"/,
            refetch: true
          });
        }

        return targets;
      }
    },

    // UPDATE GRADE
    {
      operationPattern: /^update.*grade$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate the specific student
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Invalidate old grade list
        const oldGrade = op.previousValues?.grade;
        if (oldGrade) {
          const oldGradeKey = QueryKeyFactory.create({
            entity: 'students',
            operation: 'list',
            filters: { grade: oldGrade }
          });
          targets.push({
            queryKey: QueryKeyFactory.toString(oldGradeKey),
            refetch: true
          });
        }

        // Invalidate new grade list
        const newGrade = op.newValues?.grade;
        if (newGrade) {
          const newGradeKey = QueryKeyFactory.create({
            entity: 'students',
            operation: 'list',
            filters: { grade: newGrade }
          });
          targets.push({
            queryKey: QueryKeyFactory.toString(newGradeKey),
            refetch: true
          });
        }

        // Invalidate stats (grade distribution changed)
        targets.push({
          queryKey: /^\["students","stats"\]/,
          refetch: true
        });

        return targets;
      }
    },

    // UPDATE SCHOOL
    {
      operationPattern: /^update.*school$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate the specific student
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Invalidate old school list
        const oldSchool = op.previousValues?.schoolId;
        if (oldSchool) {
          const oldSchoolKey = QueryKeyFactory.create({
            entity: 'students',
            operation: 'list',
            filters: { schoolId: oldSchool }
          });
          targets.push({
            queryKey: QueryKeyFactory.toString(oldSchoolKey),
            refetch: true
          });
        }

        // Invalidate new school list
        const newSchool = op.newValues?.schoolId;
        if (newSchool) {
          const newSchoolKey = QueryKeyFactory.create({
            entity: 'students',
            operation: 'list',
            filters: { schoolId: newSchool }
          });
          targets.push({
            queryKey: QueryKeyFactory.toString(newSchoolKey),
            refetch: true
          });
        }

        return targets;
      }
    },

    // UPDATE STATUS (active/archived)
    {
      operationPattern: /^update.*status$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate the specific student
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              op.entityId
            ]),
            refetch: true
          });
        }

        // Invalidate active students list
        targets.push({
          queryKey: QueryKeyFactory.toString(
            QueryKeyFactory.create({
              entity: 'students',
              operation: 'list',
              filters: { status: 'active' }
            })
          ),
          refetch: true
        });

        // Invalidate archived students list
        targets.push({
          queryKey: QueryKeyFactory.toString(
            QueryKeyFactory.create({
              entity: 'students',
              operation: 'list',
              filters: { status: 'archived' }
            })
          ),
          refetch: true
        });

        // Invalidate stats
        targets.push({
          queryKey: /^\["students","stats"\]/,
          refetch: true
        });

        return targets;
      }
    },

    // DELETE STUDENT
    {
      operationPattern: /^delete$/i,
      entityType: 'students',
      getInvalidationTargets: (op: InvalidationOperation): InvalidationTarget[] => {
        const targets: InvalidationTarget[] = [];

        // Invalidate all student lists (student removed from all lists)
        targets.push({
          queryKey: /^\["students","list"/,
          refetch: true
        });

        // Invalidate the specific student detail
        if (op.entityId) {
          targets.push({
            queryKey: QueryKeyFactory.toString([
              'students',
              'detail',
              op.entityId
            ]),
            refetch: false // Don't refetch deleted item
          });
        }

        // Invalidate statistics
        targets.push({
          queryKey: /^\["students","stats"\]/,
          refetch: true
        });

        return targets;
      }
    }
  ];

  return rules;
}
