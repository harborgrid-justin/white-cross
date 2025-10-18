/**
 * WC-GEN-228 | businessLogic.ts - General utility functions and operations
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
 * Chronic Condition Business Logic Module
 *
 * Care plan management, bulk operations, and transaction handling.
 *
 * @module services/chronicCondition/businessLogic
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  ChronicCondition,
  Student,
  sequelize
} from '../../database/models';
import { CreateChronicConditionData } from './types';
import { updateChronicCondition } from './crudOperations';

/**
 * Updates care plan for a chronic condition
 *
 * @param id - Chronic condition ID
 * @param carePlan - New care plan text
 * @param transaction - Optional transaction
 * @returns Updated chronic condition
 */
export async function updateCarePlan(
  id: string,
  carePlan: string,
  transaction?: Transaction
): Promise<ChronicCondition> {
  try {
    return await updateChronicCondition(
      id,
      { carePlan, lastReviewDate: new Date() },
      transaction
    );
  } catch (error) {
    logger.error('Error updating care plan:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Bulk creates chronic conditions
 *
 * @param conditionsData - Array of condition data
 * @param transaction - Optional transaction
 * @returns Array of created conditions
 */
export async function bulkCreateChronicConditions(
  conditionsData: CreateChronicConditionData[],
  transaction?: Transaction
): Promise<ChronicCondition[]> {
  try {
    // Validate all student IDs
    const studentIds = [...new Set(conditionsData.map(c => c.studentId))];
    const students = await Student.findAll({
      where: { id: { [Op.in]: studentIds } },
      attributes: ['id'],
      transaction
    });

    if (students.length !== studentIds.length) {
      throw new Error('One or more student IDs are invalid');
    }

    const conditions = await ChronicCondition.bulkCreate(conditionsData as any[], {
      transaction,
      validate: true
    });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Conditions Bulk Created', {
      action: 'CREATE',
      entity: 'ChronicCondition',
      count: conditions.length,
      studentIds,
      timestamp: new Date().toISOString()
    });

    logger.info(`Bulk created ${conditions.length} chronic condition records`);
    return conditions;
  } catch (error) {
    logger.error('Error bulk creating chronic conditions:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Executes a callback within a transaction
 *
 * @param callback - Callback function
 * @returns Result of callback
 */
export async function withTransaction<T>(
  callback: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    logger.error('Transaction rolled back:', error);
    throw error;
  }
}
