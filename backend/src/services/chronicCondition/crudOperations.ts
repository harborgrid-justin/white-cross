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
 * Chronic Condition CRUD Operations Module
 *
 * Core Create, Read, Update, Delete operations for chronic conditions.
 *
 * @module services/chronicCondition/crudOperations
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
 * Creates a new chronic condition record with validation
 *
 * @param data - Chronic condition data
 * @param transaction - Optional transaction
 * @returns Created chronic condition with associations
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
 * Retrieves a chronic condition by ID
 *
 * @param id - Chronic condition ID
 * @param transaction - Optional transaction
 * @returns Chronic condition or null
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
 * Retrieves all chronic conditions for a specific student
 *
 * @param studentId - Student ID
 * @param includeInactive - Include inactive conditions
 * @param transaction - Optional transaction
 * @returns Array of chronic conditions
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
 * Updates a chronic condition record
 *
 * @param id - Chronic condition ID
 * @param data - Update data
 * @param transaction - Optional transaction
 * @returns Updated chronic condition
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
 * Soft deletes (deactivates) a chronic condition
 *
 * @param id - Chronic condition ID
 * @param transaction - Optional transaction
 * @returns Success status
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
 * Hard deletes a chronic condition (use with caution)
 *
 * @param id - Chronic condition ID
 * @param transaction - Optional transaction
 * @returns Success status
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
