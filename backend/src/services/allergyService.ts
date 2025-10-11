/**
 * Allergy Service - Sequelize Implementation
 *
 * Enterprise-grade service for managing student allergies with full PHI compliance.
 * Provides comprehensive allergy tracking, severity management, and verification workflows.
 *
 * @module services/allergyService
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import { handleSequelizeError } from '../utils/sequelizeErrorHandler';
import {
  Allergy as AllergyModel,
  Student,
  HealthRecord,
  sequelize
} from '../database/models';
import { AllergySeverity } from '../database/types/enums';
/**
 * Allergy severity levels (aligned with medical standards)
 * Use the centralized enum/type from the database layer to avoid type mismatches.
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Interface for creating a new allergy record
 */
export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  allergenType?: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
  healthRecordId?: string;
}

/**
 * Interface for updating an allergy record
 */
export interface UpdateAllergyData extends Partial<CreateAllergyData> {
  isActive?: boolean;
}

/**
 * Interface for allergy search filters
 */
export interface AllergyFilters {
  studentId?: string;
  severity?: AllergySeverity;
  allergenType?: string;
  verified?: boolean;
  isActive?: boolean;
  searchTerm?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * AllergyService
 *
 * Provides enterprise-grade allergy management with:
 * - HIPAA-compliant audit logging
 * - Transaction support for data integrity
 * - Comprehensive validation
 * - Healthcare-specific business logic
 */
export class AllergyService {
  /**
   * Creates a new allergy record with validation and PHI audit logging
   *
   * @param data - Allergy data
   * @param transaction - Optional transaction for atomic operations
   * @returns Created allergy record with associations
   */
  static async createAllergy(
    data: CreateAllergyData,
    transaction?: Transaction
  ): Promise<AllergyModel> {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId, { transaction });
      if (!student) {
        throw new Error('Student not found');
      }

      // Check for duplicate allergies
      const existingAllergy = await AllergyModel.findOne({
        where: {
          studentId: data.studentId,
          allergen: data.allergen,
          isActive: true
        },
        transaction
      });

      if (existingAllergy) {
        throw new Error(`Student already has an active allergy record for ${data.allergen}`);
      }

      // Create allergy record
      const allergy = await AllergyModel.create(
        {
          ...data,
          verifiedAt: data.verified ? (data.verifiedAt || new Date()) : undefined
        },
        { transaction }
      );

      // Reload with associations
      await allergy.reload({
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
        transaction
      });

      // PHI Audit Log
      logger.info('PHI Access - Allergy Created', {
        action: 'CREATE',
        entity: 'Allergy',
        entityId: allergy.id,
        studentId: data.studentId,
        allergen: data.allergen,
        severity: data.severity,
        verifiedBy: data.verifiedBy,
        timestamp: new Date().toISOString()
      });

      logger.info(`Allergy created: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`);
      return allergy;
    } catch (error) {
      logger.error('Error creating allergy:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Retrieves an allergy record by ID with PHI audit logging
   *
   * @param id - Allergy ID
   * @param transaction - Optional transaction
   * @returns Allergy record or null
   */
  static async getAllergyById(
    id: string,
    transaction?: Transaction
  ): Promise<AllergyModel | null> {
    try {
      const allergy = await AllergyModel.findByPk(id, {
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

      if (allergy) {
        // PHI Audit Log
        logger.info('PHI Access - Allergy Retrieved', {
          action: 'READ',
          entity: 'Allergy',
          entityId: id,
          studentId: allergy.studentId,
          timestamp: new Date().toISOString()
        });
      }

      return allergy;
    } catch (error) {
      logger.error('Error retrieving allergy:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Retrieves all allergies for a specific student
   *
   * @param studentId - Student ID
   * @param includeInactive - Include inactive allergies
   * @param transaction - Optional transaction
   * @returns Array of allergy records
   */
  static async getStudentAllergies(
    studentId: string,
    includeInactive: boolean = false,
    transaction?: Transaction
  ): Promise<AllergyModel[]> {
    try {
      const whereClause: any = { studentId };
      if (!includeInactive) {
        whereClause.isActive = true;
      }

      const allergies = await AllergyModel.findAll({
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
          ['severity', 'DESC'], // Critical allergies first
          ['verified', 'DESC'],  // Verified allergies first
          ['createdAt', 'DESC']
        ],
        transaction
      });

      // PHI Audit Log
      if (allergies.length > 0) {
        logger.info('PHI Access - Student Allergies Retrieved', {
          action: 'READ',
          entity: 'Allergy',
          studentId,
          count: allergies.length,
          includeInactive,
          timestamp: new Date().toISOString()
        });
      }

      return allergies;
    } catch (error) {
      logger.error('Error retrieving student allergies:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Searches allergies across all students with filtering and pagination
   *
   * @param filters - Search filters
   * @param pagination - Pagination options
   * @param transaction - Optional transaction
   * @returns Paginated allergy results
   */
  static async searchAllergies(
    filters: AllergyFilters = {},
    pagination: PaginationOptions = {},
    transaction?: Transaction
  ): Promise<{ allergies: AllergyModel[]; total: number; page: number; pages: number }> {
    try {
      const { page = 1, limit = 20 } = pagination;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {};

      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.allergenType) {
        whereClause.allergenType = filters.allergenType;
      }

      if (filters.verified !== undefined) {
        whereClause.verified = filters.verified;
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { allergen: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { reaction: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { treatment: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { notes: { [Op.iLike]: `%${filters.searchTerm}%` } }
        ];
      }

      const { rows: allergies, count: total } = await AllergyModel.findAndCountAll({
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
          ['severity', 'DESC'],
          ['createdAt', 'DESC']
        ],
        distinct: true,
        transaction
      });

      // PHI Audit Log
      logger.info('PHI Access - Allergies Searched', {
        action: 'READ',
        entity: 'Allergy',
        filters,
        resultCount: allergies.length,
        timestamp: new Date().toISOString()
      });

      return {
        allergies,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error searching allergies:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Updates an allergy record with validation and PHI audit logging
   *
   * @param id - Allergy ID
   * @param data - Update data
   * @param transaction - Optional transaction
   * @returns Updated allergy record
   */
  static async updateAllergy(
    id: string,
    data: UpdateAllergyData,
    transaction?: Transaction
  ): Promise<AllergyModel> {
    try {
      const allergy = await AllergyModel.findByPk(id, {
        include: [{ model: Student, as: 'student' }],
        transaction
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      // If verification status is being changed, update timestamp
      const updateData: any = { ...data };
      if (data.verified && !allergy.verified) {
        updateData.verifiedAt = new Date();
      }

      // Store old values for audit
      const oldValues = {
        allergen: allergy.allergen,
        severity: allergy.severity,
        verified: allergy.verified
      };

      await allergy.update(updateData, { transaction });

      // Reload with associations
      await allergy.reload({
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
      logger.info('PHI Access - Allergy Updated', {
        action: 'UPDATE',
        entity: 'Allergy',
        entityId: id,
        studentId: allergy.studentId,
        changes: {
          old: oldValues,
          new: {
            allergen: allergy.allergen,
            severity: allergy.severity,
            verified: allergy.verified
          }
        },
        updatedBy: data.verifiedBy,
        timestamp: new Date().toISOString()
      });

      logger.info(`Allergy updated: ${allergy.allergen} for ${allergy.student!.firstName} ${allergy.student!.lastName}`);
      return allergy;
    } catch (error) {
      logger.error('Error updating allergy:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Soft deletes (deactivates) an allergy record
   *
   * @param id - Allergy ID
   * @param transaction - Optional transaction
   * @returns Success status
   */
  static async deactivateAllergy(
    id: string,
    transaction?: Transaction
  ): Promise<{ success: boolean }> {
    try {
      const allergy = await AllergyModel.findByPk(id, {
        include: [{ model: Student, as: 'student' }],
        transaction
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      await allergy.update({ isActive: false }, { transaction });

      // PHI Audit Log
      logger.info('PHI Access - Allergy Deactivated', {
        action: 'UPDATE',
        entity: 'Allergy',
        entityId: id,
        studentId: allergy.studentId,
        allergen: allergy.allergen,
        timestamp: new Date().toISOString()
      });

      logger.info(`Allergy deactivated: ${allergy.allergen} for ${allergy.student!.firstName} ${allergy.student!.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deactivating allergy:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Hard deletes an allergy record (use with caution - PHI compliance)
   *
   * @param id - Allergy ID
   * @param transaction - Optional transaction
   * @returns Success status
  static async deleteAllergy(
    id: string,
    transaction?: Transaction
  ): Promise<{ success: boolean }> {
    try {
      const allergy = await AllergyModel.findByPk(id, {
        include: [{ model: Student, as: 'student' }],
        transaction
      });
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      // Store data for audit before deletion
      const auditData = {
        allergen: allergy.allergen,
        severity: allergy.severity,
        studentId: allergy.studentId,
        studentName: allergy.student ? `${allergy.student.firstName} ${allergy.student.lastName}` : 'Unknown'
      };

      await allergy.destroy({ transaction });

      // PHI Audit Log
      logger.info('PHI Access - Allergy Deleted', {
        action: 'DELETE',
        entity: 'Allergy',
        entityId: id,
        ...auditData,
        timestamp: new Date().toISOString()
      });

      logger.warn(`Allergy permanently deleted: ${auditData.allergen} for ${auditData.studentName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting allergy:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Verifies an allergy record (healthcare professional confirmation)
   *
   * @param id - Allergy ID
   * @param verifiedBy - User ID of verifying healthcare professional
   * @param transaction - Optional transaction
   * @returns Updated allergy record
   */
  static async verifyAllergy(
    id: string,
    verifiedBy: string,
    transaction?: Transaction
  ): Promise<AllergyModel> {
    try {
      return await this.updateAllergy(
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
   * Gets critical allergies (SEVERE or LIFE_THREATENING) for a student
   *
   * @param studentId - Student ID
   * @param transaction - Optional transaction
   * @returns Array of critical allergy records
   */
  static async getCriticalAllergies(
    studentId: string,
    transaction?: Transaction
  ): Promise<AllergyModel[]> {
    try {
      const allergies = await AllergyModel.findAll({
        where: {
          studentId,
          severity: {
            [Op.in]: ['SEVERE', 'LIFE_THREATENING']
          },
          isActive: true
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['severity', 'DESC']],
        transaction
      });

      // PHI Audit Log
      if (allergies.length > 0) {
        logger.info('PHI Access - Critical Allergies Retrieved', {
          action: 'READ',
          entity: 'Allergy',
          studentId,
          count: allergies.length,
          severities: allergies.map(a => a.severity),
          timestamp: new Date().toISOString()
        });
      }

      return allergies;
    } catch (error) {
      logger.error('Error retrieving critical allergies:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Gets allergy statistics for reporting and analytics
   *
   * @param filters - Optional filters
   * @returns Allergy statistics
   */
  static async getAllergyStatistics(filters: AllergyFilters = {}): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    verified: number;
    unverified: number;
    critical: number;
  }> {
    try {
      const whereClause: any = { isActive: true };
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      const [total, bySeverity, byType, verified, critical] = await Promise.all([
        AllergyModel.count({ where: whereClause }),
        AllergyModel.findAll({
          where: whereClause,
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        }),
        AllergyModel.findAll({
          where: whereClause,
          attributes: [
            'allergenType',
            [sequelize.fn('COUNT', sequelize.col('allergenType')), 'count']
          ],
          group: ['allergenType'],
          raw: true
        }),
        AllergyModel.count({ where: { ...whereClause, verified: true } }),
        AllergyModel.count({
          where: {
            ...whereClause,
            severity: { [Op.in]: ['SEVERE', 'LIFE_THREATENING'] }
          }
        })
      ]);

      const statistics = {
        total,
        bySeverity: (bySeverity as any[]).reduce((acc, item) => {
          acc[item.severity] = parseInt(item.count, 10);
          return acc;
        }, {} as Record<string, number>),
        byType: (byType as any[]).reduce((acc, item) => {
          if (item.allergenType) {
            acc[item.allergenType] = parseInt(item.count, 10);
          }
          return acc;
        }, {} as Record<string, number>),
        verified,
        unverified: total - verified,
        critical
      };

      logger.info('Allergy statistics retrieved', { statistics });
      return statistics;
    } catch (error) {
      logger.error('Error retrieving allergy statistics:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Bulk creates allergies (useful for data migration or imports)
   *
   * @param allergiesData - Array of allergy data
   * @param transaction - Optional transaction
   * @returns Array of created allergy records
   */
  static async bulkCreateAllergies(
    allergiesData: CreateAllergyData[],
    transaction?: Transaction
  ): Promise<AllergyModel[]> {
    try {
      // Validate all student IDs exist
      const studentIds = [...new Set(allergiesData.map(a => a.studentId))];
      const students = await Student.findAll({
        where: { id: { [Op.in]: studentIds } },
        attributes: ['id'],
        transaction
      });

      if (students.length !== studentIds.length) {
        throw new Error('One or more student IDs are invalid');
      }

      const allergies = await AllergyModel.bulkCreate(allergiesData as any[], {
        transaction,
        validate: true
      });

      // PHI Audit Log
      logger.info('PHI Access - Allergies Bulk Created', {
        action: 'CREATE',
        entity: 'Allergy',
        count: allergies.length,
        studentIds,
        timestamp: new Date().toISOString()
      });

      logger.info(`Bulk created ${allergies.length} allergy records`);
      return allergies;
    } catch (error) {
      logger.error('Error bulk creating allergies:', error);
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

export default AllergyService;
