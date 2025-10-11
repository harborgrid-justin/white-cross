/**
 * Chronic Condition Service - Sequelize Implementation
 *
 * Enterprise-grade service for managing student chronic health conditions.
 * Implements comprehensive care plan tracking, medication management, and PHI compliance.
 *
 * @module services/chronicConditionService
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import { handleSequelizeError } from '../utils/sequelizeErrorHandler';
import {
  ChronicCondition,
  Student,
  HealthRecord,
  sequelize
} from '../database/models';

/**
 * Chronic condition status types
 */
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING';

/**
 * Interface for creating a chronic condition record
 */
export interface CreateChronicConditionData {
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: Date;
  diagnosedBy?: string;
  status: ConditionStatus;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  accommodations?: string[];
  emergencyProtocol?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  requiresIEP?: boolean;
  requires504?: boolean;
}

/**
 * Interface for updating a chronic condition
 */
export interface UpdateChronicConditionData extends Partial<CreateChronicConditionData> {
  isActive?: boolean;
}

/**
 * Interface for chronic condition filters
 */
export interface ChronicConditionFilters {
  studentId?: string;
  status?: ConditionStatus;
  requiresIEP?: boolean;
  requires504?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  reviewDueSoon?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * ChronicConditionService
 *
 * Provides enterprise-grade chronic condition management with:
 * - HIPAA-compliant PHI handling
 * - Care plan tracking
 * - Review date management
 * - Educational accommodation tracking (IEP/504)
 */
export class ChronicConditionService {
  /**
   * Creates a new chronic condition record with validation
   *
   * @param data - Chronic condition data
   * @param transaction - Optional transaction
   * @returns Created chronic condition with associations
   */
  static async createChronicCondition(
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
  static async getChronicConditionById(
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
  static async getStudentChronicConditions(
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
   * Searches chronic conditions with filtering and pagination
   *
   * @param filters - Search filters
   * @param pagination - Pagination options
   * @param transaction - Optional transaction
   * @returns Paginated chronic condition results
   */
  static async searchChronicConditions(
    filters: ChronicConditionFilters = {},
    pagination: PaginationOptions = {},
    transaction?: Transaction
  ): Promise<{ conditions: ChronicCondition[]; total: number; page: number; pages: number }> {
    try {
      const { page = 1, limit = 20 } = pagination;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {};

      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.requiresIEP !== undefined) {
        whereClause.requiresIEP = filters.requiresIEP;
      }

      if (filters.requires504 !== undefined) {
        whereClause.requires504 = filters.requires504;
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      if (filters.reviewDueSoon) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        whereClause.nextReviewDate = {
          [Op.lte]: thirtyDaysFromNow,
          [Op.gte]: new Date()
        };
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { condition: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { icdCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { notes: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { carePlan: { [Op.iLike]: `%${filters.searchTerm}%` } }
        ];
      }

      const { rows: conditions, count: total } = await ChronicCondition.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        offset,
        limit,
        order: [
          ['status', 'ASC'],
          ['nextReviewDate', 'ASC'],
          ['diagnosedDate', 'DESC']
        ],
        distinct: true,
        transaction
      });

      // PHI Audit Log
      logger.info('PHI Access - Chronic Conditions Searched', {
        action: 'READ',
        entity: 'ChronicCondition',
        filters,
        resultCount: conditions.length,
        timestamp: new Date().toISOString()
      });

      return {
        conditions,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error searching chronic conditions:', error);
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
  static async updateChronicCondition(
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

      logger.info(`Chronic condition updated: ${condition.condition} for ${condition.student!.firstName} ${condition.student!.lastName}`);
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
  static async deactivateChronicCondition(
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

      await condition.update({ isActive: false, status: 'RESOLVED' as any }, { transaction });

      // PHI Audit Log
      logger.info('PHI Access - Chronic Condition Deactivated', {
        action: 'UPDATE',
        entity: 'ChronicCondition',
        entityId: id,
        studentId: condition.studentId,
        condition: condition.condition,
        timestamp: new Date().toISOString()
      });

      logger.info(`Chronic condition deactivated: ${condition.condition} for ${condition.student!.firstName} ${condition.student!.lastName}`);
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
  static async deleteChronicCondition(
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
        studentName: condition.student ? `${condition.student.firstName} ${condition.student.lastName}` : 'Unknown'
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

  /**
   * Updates care plan for a chronic condition
   *
   * @param id - Chronic condition ID
   * @param carePlan - New care plan text
   * @param transaction - Optional transaction
   * @returns Updated chronic condition
   */
  static async updateCarePlan(
    id: string,
    carePlan: string,
    transaction?: Transaction
  ): Promise<ChronicCondition> {
    try {
      return await this.updateChronicCondition(
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
   * Gets conditions requiring review soon (within 30 days)
   *
   * @param daysAhead - Number of days to look ahead (default 30)
   * @param transaction - Optional transaction
   * @returns Array of conditions needing review
   */
  static async getConditionsRequiringReview(
    daysAhead: number = 30,
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const conditions = await ChronicCondition.findAll({
        where: {
          isActive: true,
          nextReviewDate: {
            [Op.lte]: futureDate,
            [Op.gte]: new Date()
          }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [['nextReviewDate', 'ASC']],
        transaction
      });

      logger.info(`Found ${conditions.length} conditions requiring review within ${daysAhead} days`);
      return conditions;
    } catch (error) {
      logger.error('Error retrieving conditions requiring review:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Gets conditions requiring IEP or 504 accommodations
   *
   * @param type - 'IEP' or '504' or 'BOTH'
   * @param transaction - Optional transaction
   * @returns Array of conditions
   */
  static async getConditionsRequiringAccommodations(
    type: 'IEP' | '504' | 'BOTH' = 'BOTH',
    transaction?: Transaction
  ): Promise<ChronicCondition[]> {
    try {
      const whereClause: any = { isActive: true };

      if (type === 'IEP') {
        whereClause.requiresIEP = true;
      } else if (type === '504') {
        whereClause.requires504 = true;
      } else {
        whereClause[Op.or] = [
          { requiresIEP: true },
          { requires504: true }
        ];
      }

      const conditions = await ChronicCondition.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [
          [{ model: Student, as: 'student' }, 'lastName', 'ASC'],
          ['condition', 'ASC']
        ],
        transaction
      });

      logger.info(`Found ${conditions.length} conditions requiring ${type} accommodations`);
      return conditions;
    } catch (error) {
      logger.error('Error retrieving conditions requiring accommodations:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Gets chronic condition statistics
   *
   * @param filters - Optional filters
   * @returns Statistics object
   */
  static async getChronicConditionStatistics(filters: ChronicConditionFilters = {}): Promise<{
    total: number;
    byStatus: Record<string, number>;
    requiresIEP: number;
    requires504: number;
    reviewDueSoon: number;
    activeConditions: number;
  }> {
    try {
      const baseWhere: any = { isActive: true };
      if (filters.studentId) {
        baseWhere.studentId = filters.studentId;
      }

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const [total, byStatus, requiresIEP, requires504, reviewDueSoon, activeConditions] = await Promise.all([
        ChronicCondition.count({ where: baseWhere }),
        ChronicCondition.findAll({
          where: baseWhere,
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        ChronicCondition.count({ where: { ...baseWhere, requiresIEP: true } }),
        ChronicCondition.count({ where: { ...baseWhere, requires504: true } }),
        ChronicCondition.count({
          where: {
            ...baseWhere,
            nextReviewDate: {
              [Op.lte]: thirtyDaysFromNow,
              [Op.gte]: new Date()
            }
          }
        }),
        ChronicCondition.count({ where: { ...baseWhere, status: 'ACTIVE' } })
      ]);

      const statistics = {
        total,
        byStatus: (byStatus as any[]).reduce((acc, item) => {
          acc[item.status] = parseInt(item.count, 10);
          return acc;
        }, {} as Record<string, number>),
        requiresIEP,
        requires504,
        reviewDueSoon,
        activeConditions
      };

      logger.info('Chronic condition statistics retrieved', { statistics });
      return statistics;
    } catch (error) {
      logger.error('Error retrieving chronic condition statistics:', error);
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
  static async bulkCreateChronicConditions(
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
  static async withTransaction<T>(
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
}

export default ChronicConditionService;
