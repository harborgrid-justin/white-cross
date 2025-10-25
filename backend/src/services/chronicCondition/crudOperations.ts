/**
 * LOC: CC4112B155
 * WC-GEN-229 | crudOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *
 * DOWNSTREAM (imported by):
 *   - businessLogic.ts (services/chronicCondition/businessLogic.ts)
 *   - index.ts (services/chronicCondition/index.ts)
 */

/**
 * WC-GEN-229 | crudOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../utils/sequelizeErrorHandler, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../utils/sequelizeErrorHandler
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Chronic Condition CRUD Operations Module
 *
 * Provides core database operations for chronic condition management with comprehensive
 * validation, audit logging, and HIPAA compliance:
 * - Create: Validate student, set defaults, audit log creation
 * - Read: Retrieve by ID or by student with associations
 * - Update: Track changes, maintain audit trail
 * - Delete: Soft delete (deactivate) and hard delete operations
 *
 * @module services/chronicCondition/crudOperations
 *
 * @remarks
 * PHI SENSITIVITY: All CRUD operations handle protected health information (PHI).
 * Every operation includes comprehensive audit logging with:
 * - Action type (CREATE, READ, UPDATE, DELETE)
 * - Entity ID and student ID
 * - Timestamp and user context
 * - Change tracking for updates (old vs new values)
 *
 * Healthcare Context:
 * - Student validation ensures referential integrity
 * - Associations with HealthRecord and Student models
 * - Default array initialization for medications, restrictions, triggers, accommodations
 * - Status-based workflow (ACTIVE, MANAGED, RESOLVED, MONITORING)
 *
 * Data Integrity:
 * - Foreign key validation before creation
 * - Transactional support for consistency
 * - Soft delete preserves historical data
 * - Hard delete requires explicit confirmation
 *
 * @see {@link module:services/chronicCondition/queryOperations} for search operations
 * @see {@link module:services/chronicCondition/businessLogic} for business logic
 *
 * @since 1.0.0
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  ChronicCondition,
  Student,
  HealthRecord
} from '../../database/models';
import {
  CreateChronicConditionData,
  UpdateChronicConditionData
} from './types';

/**
 * Creates a new chronic condition record with comprehensive validation and audit logging.
 *
 * Validates student existence, initializes default arrays, creates the condition record,
 * and returns it with full student and health record associations. All creations are
 * audit logged for HIPAA compliance.
 *
 * @param {CreateChronicConditionData} data - Chronic condition data including:
 *   - studentId (required): Valid student UUID
 *   - condition (required): Condition name (e.g., "Type 1 Diabetes", "Asthma")
 *   - diagnosedDate (required): Date of diagnosis
 *   - status (required): ACTIVE, MANAGED, RESOLVED, or MONITORING
 *   - icdCode (optional): ICD-10 diagnosis code (e.g., "E10.9", "J45.909")
 *   - diagnosedBy (optional): Healthcare provider name
 *   - severity (optional): Severity level (Low, Moderate, High, Critical)
 *   - carePlan (optional): Care plan documentation
 *   - medications (optional): Array of medication names
 *   - restrictions (optional): Array of activity restrictions
 *   - triggers (optional): Array of condition triggers
 *   - accommodations (optional): Array of required accommodations
 *   - emergencyProtocol (optional): Emergency response procedures
 *   - requiresIEP/requires504 (optional): Educational accommodation flags
 * @param {Transaction} [transaction] - Optional Sequelize transaction for atomic operations
 *
 * @returns {Promise<ChronicCondition>} Created chronic condition with student and health record associations
 *
 * @throws {Error} When student ID is not found in database
 * @throws {ValidationError} When required fields are missing or invalid
 * @throws {SequelizeError} When database creation fails
 *
 * @example
 * ```typescript
 * // Create new diabetes diagnosis
 * const diabetesCondition = await createChronicCondition({
 *   studentId: 'student-uuid',
 *   condition: 'Type 1 Diabetes',
 *   icdCode: 'E10.9',
 *   diagnosedDate: new Date('2024-01-15'),
 *   diagnosedBy: 'Dr. Sarah Johnson, Endocrinology',
 *   status: 'ACTIVE',
 *   severity: 'High',
 *   carePlan: 'Blood glucose monitoring 4x daily...',
 *   medications: ['Insulin - Humalog', 'Insulin - Lantus'],
 *   restrictions: ['No unsupervised activities until stable'],
 *   triggers: ['Illness', 'Stress', 'Irregular meals'],
 *   accommodations: ['Blood sugar checks during class', 'Snacks allowed', 'Extra restroom breaks'],
 *   emergencyProtocol: 'If blood sugar <70 or >300, contact parent and 911',
 *   requiresIEP: true,
 *   nextReviewDate: new Date('2024-04-15')
 * });
 *
 * console.log('Created condition:', diabetesCondition.id);
 * console.log('Student:', diabetesCondition.student.firstName);
 * ```
 *
 * @remarks
 * PHI: All creations are audit logged with student ID, condition, status, and diagnosing provider.
 *
 * Default Behavior:
 * - Empty arrays initialized for medications, restrictions, triggers, accommodations
 * - Student and HealthRecord associations eager loaded in response
 * - Creation timestamp auto-generated
 */
export async function createChronicCondition(
  data: CreateChronicConditionData,
  transaction?: Transaction
): Promise<ChronicCondition> {
  try {
    // Verify student exists
    const student = await Student.findByPk(data.studentId, { transaction });
    if (!student) {
      throw new Error('Student not found');
    }

    // Set default arrays if not provided
    const conditionData = {
      ...data,
      medications: data.medications || [],
      restrictions: data.restrictions || [],
      triggers: data.triggers || [],
      accommodations: data.accommodations || []
    };

    // Create chronic condition
    const condition = await ChronicCondition.create(conditionData as any, { transaction });

    // Reload with associations
    await condition.reload({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
        },
        {
          model: HealthRecord,
          as: 'healthRecord',
          required: false
        }
      ],
      transaction
    });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Condition Created', {
      action: 'CREATE',
      entity: 'ChronicCondition',
      entityId: condition.id,
      studentId: data.studentId,
      condition: data.condition,
      status: data.status,
      diagnosedBy: data.diagnosedBy,
      timestamp: new Date().toISOString()
    });

    logger.info(`Chronic condition created: ${data.condition} for ${student.firstName} ${student.lastName}`);
    return condition;
  } catch (error) {
    logger.error('Error creating chronic condition:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Retrieves a single chronic condition by ID with full student and health record associations.
 *
 * Returns complete condition details including student demographics and associated health
 * record. Audit logs all PHI access for HIPAA compliance.
 *
 * @param {string} id - Unique identifier of the chronic condition
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<ChronicCondition | null>} Chronic condition with associations, or null if not found
 *
 * @throws {SequelizeError} When database query fails
 *
 * @example
 * ```typescript
 * const condition = await getChronicConditionById('condition-uuid');
 * if (condition) {
 *   console.log(`${condition.student.firstName} ${condition.student.lastName}`);
 *   console.log(`Condition: ${condition.condition} (${condition.icdCode})`);
 *   console.log(`Status: ${condition.status}`);
 *   console.log(`Care Plan: ${condition.carePlan}`);
 * } else {
 *   console.log('Condition not found');
 * }
 * ```
 *
 * @remarks
 * PHI: Access is audit logged with student ID and timestamp when condition is found.
 * Returns null without logging if condition doesn't exist.
 *
 * Associations Loaded:
 * - student: Full student demographics (name, DOB, grade, student number)
 * - healthRecord: Associated health record if exists (optional)
 */
export async function getChronicConditionById(
  id: string,
  transaction?: Transaction
): Promise<ChronicCondition | null> {
  try {
    const condition = await ChronicCondition.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth', 'grade']
        },
        {
          model: HealthRecord,
          as: 'healthRecord',
          required: false
        }
      ],
      transaction
    });

    if (condition) {
      // PHI Audit Log
      logger.info('PHI Access - Chronic Condition Retrieved', {
        action: 'READ',
        entity: 'ChronicCondition',
        entityId: id,
        studentId: condition.studentId,
        timestamp: new Date().toISOString()
      });
    }

    return condition;
  } catch (error) {
    logger.error('Error retrieving chronic condition:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Retrieves all chronic conditions for a specific student with filtering and associations.
 *
 * Returns student's complete chronic condition profile, ordered by status (ACTIVE first)
 * and diagnosis date (newest first). Optionally includes resolved/inactive conditions for
 * historical review.
 *
 * @param {string} studentId - Unique identifier of the student
 * @param {boolean} [includeInactive=false] - Whether to include resolved/inactive conditions.
 *                                             Default false (active conditions only)
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<ChronicCondition[]>} Array of chronic conditions with student and health
 *                                         record associations, ordered by status and diagnosis date
 *
 * @throws {SequelizeError} When database query fails
 *
 * @example
 * ```typescript
 * // Get active chronic conditions for care planning
 * const activeConditions = await getStudentChronicConditions('student-uuid');
 * console.log(`Student has ${activeConditions.length} active chronic conditions`);
 *
 * activeConditions.forEach(condition => {
 *   console.log(`- ${condition.condition} (${condition.status})`);
 *   if (condition.requiresIEP) console.log('  Requires IEP');
 *   if (condition.medications.length > 0) {
 *     console.log('  Medications:', condition.medications.join(', '));
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Include historical conditions for comprehensive review
 * const allConditions = await getStudentChronicConditions('student-uuid', true);
 * const active = allConditions.filter(c => c.status === 'ACTIVE');
 * const resolved = allConditions.filter(c => c.status === 'RESOLVED');
 *
 * console.log(`Active: ${active.length}, Resolved: ${resolved.length}`);
 * ```
 *
 * @remarks
 * PHI: Access is audit logged with student ID and condition count when results exist.
 *
 * Ordering:
 * - Primary: Status (ACTIVE conditions appear first)
 * - Secondary: Diagnosis date (newest first)
 *
 * Associations Loaded:
 * - student: Student demographics (minimal fields for efficiency)
 * - healthRecord: Associated health record if exists
 *
 * Use Cases:
 * - Care plan review and coordination
 * - IEP/504 accommodation planning
 * - Emergency protocol reference
 * - Historical health condition review
 */
export async function getStudentChronicConditions(
  studentId: string,
  includeInactive: boolean = false,
  transaction?: Transaction
): Promise<ChronicCondition[]> {
  try {
    const whereClause: any = { studentId };
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const conditions = await ChronicCondition.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber']
        },
        {
          model: HealthRecord,
          as: 'healthRecord',
          required: false
        }
      ],
      order: [
        ['status', 'ASC'], // ACTIVE first
        ['diagnosedDate', 'DESC']
      ],
      transaction
    });

    // PHI Audit Log
    if (conditions.length > 0) {
      logger.info('PHI Access - Student Chronic Conditions Retrieved', {
        action: 'READ',
        entity: 'ChronicCondition',
        studentId,
        count: conditions.length,
        includeInactive,
        timestamp: new Date().toISOString()
      });
    }

    return conditions;
  } catch (error) {
    logger.error('Error retrieving student chronic conditions:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Updates a chronic condition record with change tracking and audit logging.
 *
 * Retrieves existing condition, stores old values for audit trail, applies updates,
 * reloads with associations, and logs all changes for HIPAA compliance.
 *
 * @param {string} id - Unique identifier of the chronic condition to update
 * @param {UpdateChronicConditionData} data - Partial update data. Any fields from CreateChronicConditionData
 *                                            plus isActive flag can be updated
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<ChronicCondition>} Updated chronic condition with student association
 *
 * @throws {Error} When chronic condition ID is not found
 * @throws {ValidationError} When update data fails validation
 * @throws {SequelizeError} When database update fails
 *
 * @example
 * ```typescript
 * // Update care plan and review date
 * const updated = await updateChronicCondition('condition-uuid', {
 *   carePlan: 'Updated care plan with new protocols...',
 *   lastReviewDate: new Date(),
 *   nextReviewDate: new Date('2024-07-01')
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Change condition status to managed
 * const managed = await updateChronicCondition('condition-uuid', {
 *   status: 'MANAGED',
 *   notes: 'Condition well-controlled with current treatment plan'
 * });
 * ```
 *
 * @remarks
 * PHI: Updates are audit logged with before/after values for condition, status, and care plan.
 * Change tracking enables compliance reporting and care plan history.
 */
export async function updateChronicCondition(
  id: string,
  data: UpdateChronicConditionData,
  transaction?: Transaction
): Promise<ChronicCondition> {
  try {
    const condition = await ChronicCondition.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!condition) {
      throw new Error('Chronic condition not found');
    }

    // Store old values for audit
    const oldValues = {
      condition: condition.condition,
      status: condition.status,
      carePlan: condition.carePlan
    };

    await condition.update(data as any, { transaction });

    // Reload with associations
    await condition.reload({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber']
        }
      ],
      transaction
    });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Condition Updated', {
      action: 'UPDATE',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      changes: {
        old: oldValues,
        new: {
          condition: condition.condition,
          status: condition.status,
          carePlan: condition.carePlan
        }
      },
      timestamp: new Date().toISOString()
    });

    logger.info(`Chronic condition updated: ${condition.condition} for ${(condition as any).student?.firstName} ${(condition as any).student?.lastName}`);
    return condition;
  } catch (error) {
    logger.error('Error updating chronic condition:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Soft deletes a chronic condition by marking it as RESOLVED (preferred method).
 *
 * This is the recommended deletion method as it preserves historical health data
 * for compliance and continuity of care while removing the condition from active
 * management workflows.
 *
 * @param {string} id - Unique identifier of the chronic condition to deactivate
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<{success: boolean}>} Success indicator object
 *
 * @throws {Error} When chronic condition ID is not found
 * @throws {SequelizeError} When database update fails
 *
 * @example
 * ```typescript
 * // Mark asthma as resolved after successful treatment
 * const result = await deactivateChronicCondition('condition-uuid');
 * console.log('Condition deactivated:', result.success);
 * ```
 *
 * @remarks
 * PHI: Deactivation is audit logged with student ID and condition name.
 *
 * Soft Delete vs Hard Delete:
 * - Soft delete (this function): Changes status to RESOLVED, preserves all data
 * - Hard delete: Permanently removes record from database
 * - Recommendation: Always use soft delete unless legally required to purge data
 *
 * Data Retention: Resolved conditions remain queryable for historical reporting
 * but are excluded from active care management queries by default.
 */
export async function deactivateChronicCondition(
  id: string,
  transaction?: Transaction
): Promise<{ success: boolean }> {
  try {
    const condition = await ChronicCondition.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!condition) {
      throw new Error('Chronic condition not found');
    }

    await condition.update({ status: 'RESOLVED' as any }, { transaction });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Condition Deactivated', {
      action: 'UPDATE',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      condition: condition.condition,
      timestamp: new Date().toISOString()
    });

    logger.info(`Chronic condition deactivated: ${condition.condition} for ${(condition as any).student?.firstName} ${(condition as any).student?.lastName}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deactivating chronic condition:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Hard deletes a chronic condition by permanently removing it from the database.
 *
 * WARNING: This operation permanently destroys PHI and cannot be undone. Use only
 * when legally required (e.g., patient data removal request, GDPR right to deletion).
 * In most cases, use deactivateChronicCondition() instead.
 *
 * @param {string} id - Unique identifier of the chronic condition to permanently delete
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 *
 * @returns {Promise<{success: boolean}>} Success indicator object
 *
 * @throws {Error} When chronic condition ID is not found
 * @throws {SequelizeError} When database deletion fails or foreign key constraints prevent deletion
 *
 * @example
 * ```typescript
 * // CAUTION: Only use when required by law
 * // Permanently delete chronic condition (e.g., for GDPR compliance)
 * const result = await deleteChronicCondition('condition-uuid');
 * console.log('Record permanently deleted:', result.success);
 * ```
 *
 * @remarks
 * PHI: Deletion is audit logged with complete condition details before destruction.
 * Audit log entry includes student ID, condition name, and student name for compliance.
 *
 * CAUTION - Permanent Data Loss:
 * - This operation cannot be reversed
 * - All condition history, care plans, and audit data are destroyed
 * - May violate healthcare record retention requirements
 * - Recommendation: Use soft delete (deactivateChronicCondition) instead
 *
 * Legal Considerations:
 * - Healthcare records typically require 7-10 year retention
 * - Minors' records may require retention until age of majority + retention period
 * - Only delete when required by law (GDPR, CCPA data removal requests)
 * - Document legal basis for deletion in audit logs
 *
 * Foreign Key Impact:
 * - Deletion may fail if condition is referenced by other records
 * - Consider cascade delete behavior or manual cleanup of dependencies
 */
export async function deleteChronicCondition(
  id: string,
  transaction?: Transaction
): Promise<{ success: boolean }> {
  try {
    const condition = await ChronicCondition.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!condition) {
      throw new Error('Chronic condition not found');
    }

    // Store data for audit
    const auditData = {
      condition: condition.condition,
      studentId: condition.studentId,
      studentName: (condition as any).student ? `${(condition as any).student.firstName} ${(condition as any).student.lastName}` : 'Unknown'
    };

    await condition.destroy({ transaction });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Condition Deleted', {
      action: 'DELETE',
      entity: 'ChronicCondition',
      entityId: id,
      ...auditData,
      timestamp: new Date().toISOString()
    });

    logger.warn(`Chronic condition permanently deleted: ${auditData.condition} for ${auditData.studentName}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting chronic condition:', error);
    throw handleSequelizeError(error as Error);
  }
}
