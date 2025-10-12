/**
 * Allergy Special Operations Module
 *
 * Handles specialized allergy operations (verification, transactions, etc.)
 *
 * @module services/allergy/specialOperations
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, sequelize } from '../../database/models';
import { updateAllergy } from './crudOperations';

/**
 * Verifies an allergy record (healthcare professional confirmation)
 *
 * @param id - Allergy ID
 * @param verifiedBy - User ID of verifying healthcare professional
 * @param transaction - Optional transaction
 * @returns Updated allergy record
 */
export async function verifyAllergy(
  id: string,
  verifiedBy: string,
  transaction?: Transaction
): Promise<AllergyModel> {
  try {
    return await updateAllergy(
      id,
      {
        verified: true,
        verifiedBy,
        verifiedAt: new Date()
      },
      transaction
    );
  } catch (error) {
    logger.error('Error verifying allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Executes a callback within a transaction
 * Useful for complex operations requiring atomicity
 *
 * @param callback - Callback function to execute
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
