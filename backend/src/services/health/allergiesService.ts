/**
 * LOC: A09D9252BD
 * WC-GEN-250 | allergiesService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - healthRecordValidators.ts (utils/healthRecordValidators.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecordService.ts (services/health/healthRecordService.ts)
 *   - importExportService.ts (services/health/importExportService.ts)
 */

/**
 * WC-GEN-250 | allergiesService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import { Allergy, Student } from '../../database/models';
import { AllergySeverity } from '../../database/types/enums';
import { 
  CreateAllergyData, 
  UpdateAllergyData, 
  AllergyFilters 
} from './types';
import { validateAllergyReactions } from '../../utils/healthRecordValidators';

/**
 * Allergies Service - Manages student allergy information
 */
export class AllergiesService {
  /**
   * Add allergy to student with validation
   */
  static async addAllergy(data: CreateAllergyData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate allergen is not empty
      if (!data.allergen || data.allergen.trim().length === 0) {
        throw new Error('Allergen name is required');
      }

      // Validate severity is provided
      if (!data.severity) {
        throw new Error('Allergy severity is required');
      }

      // Validate reaction format if provided
      if (data.reaction) {
        const reactionValidation = validateAllergyReactions(data.reaction);
        if (reactionValidation.warnings.length > 0) {
          logger.warn(`Allergy reaction validation warnings:`, reactionValidation.warnings);
        }
      }

      // Check if allergy already exists for this student
      const existingAllergy = await Allergy.findOne({
        where: {
          studentId: data.studentId,
          allergen: data.allergen
        }
      });

      if (existingAllergy) {
        throw new Error(`Allergy to ${data.allergen} already exists for this student`);
      }

      // Log critical severity allergies
      if (data.severity === AllergySeverity.LIFE_THREATENING || data.severity === AllergySeverity.SEVERE) {
        logger.warn(`CRITICAL ALLERGY ADDED: ${data.allergen} (${data.severity}) for student ${student.id} - ${student.firstName} ${student.lastName}`);
      }

      const allergy = await Allergy.create({
        ...data,
        verifiedAt: data.verified ? new Date() : null
      } as any);

      // Reload with associations
      await allergy.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Allergy added: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`);
      return allergy;
    } catch (error) {
      logger.error('Error adding allergy:', error);
      throw error;
    }
  }

  /**
   * Update allergy information
   */
  static async updateAllergy(id: string, data: UpdateAllergyData) {
    try {
      const existingAllergy = await Allergy.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingAllergy) {
        throw new Error('Allergy not found');
      }

      // Update verification timestamp if being verified
      const updateData: any = { ...data };
      if (data.verified && !existingAllergy.verified) {
        updateData.verifiedAt = new Date();
      }

      await existingAllergy.update(updateData);

      // Reload with associations
      await existingAllergy.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Allergy updated: ${existingAllergy.allergen} for ${existingAllergy.student!.firstName} ${existingAllergy.student!.lastName}`);
      return existingAllergy;
    } catch (error) {
      logger.error('Error updating allergy:', error);
      throw error;
    }
  }

  /**
   * Get student allergies with optional filtering
   */
  static async getStudentAllergies(studentId: string, filters: AllergyFilters = {}) {
    try {
      const whereClause: any = { studentId };

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.verified !== undefined) {
        whereClause.verified = filters.verified;
      }

      if (filters.allergen) {
        whereClause.allergen = { [require('sequelize').Op.iLike]: `%${filters.allergen}%` };
      }

      const allergies = await Allergy.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['severity', 'DESC'], // Most severe first
          ['allergen', 'ASC']
        ]
      });

      return allergies;
    } catch (error) {
      logger.error('Error fetching student allergies:', error);
      throw error;
    }
  }

  /**
   * Get allergy by ID
   */
  static async getAllergyById(id: string) {
    try {
      const allergy = await Allergy.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          }
        ]
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      return allergy;
    } catch (error) {
      logger.error('Error fetching allergy by ID:', error);
      throw error;
    }
  }

  /**
   * Delete allergy
   */
  static async deleteAllergy(id: string) {
    try {
      const allergy = await Allergy.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      await allergy.destroy();

      logger.info(`Allergy deleted: ${allergy.allergen} for ${allergy.student!.firstName} ${allergy.student!.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting allergy:', error);
      throw error;
    }
  }

  /**
   * Get critical allergies across all students (for emergency awareness)
   */
  static async getCriticalAllergies() {
    try {
      const criticalAllergies = await Allergy.findAll({
        where: {
          severity: [AllergySeverity.LIFE_THREATENING, AllergySeverity.SEVERE]
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [
          ['severity', 'DESC'],
          ['student', 'lastName', 'ASC'],
          ['student', 'firstName', 'ASC']
        ]
      });

      return criticalAllergies;
    } catch (error) {
      logger.error('Error fetching critical allergies:', error);
      throw error;
    }
  }

  /**
   * Get unverified allergies that need medical verification
   */
  static async getUnverifiedAllergies() {
    try {
      const unverifiedAllergies = await Allergy.findAll({
        where: {
          verified: false
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['createdAt', 'ASC'], // Oldest first for priority
          ['severity', 'DESC']
        ]
      });

      return unverifiedAllergies;
    } catch (error) {
      logger.error('Error fetching unverified allergies:', error);
      throw error;
    }
  }

  /**
   * Get allergy statistics
   */
  static async getAllergyStatistics() {
    try {
      const [
        totalAllergies,
        verifiedAllergies,
        criticalAllergies,
        allergenCounts
      ] = await Promise.all([
        // Total allergies count
        Allergy.count(),

        // Verified allergies count
        Allergy.count({
          where: { verified: true }
        }),

        // Critical allergies count
        Allergy.count({
          where: {
            severity: [AllergySeverity.LIFE_THREATENING, AllergySeverity.SEVERE]
          }
        }),

        // Most common allergens
        Allergy.findAll({
          attributes: [
            'allergen',
            [require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('allergen')), 'count']
          ],
          group: ['allergen'],
          order: [[require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('allergen')), 'DESC']],
          limit: 10,
          raw: true
        })
      ]);

      return {
        totalAllergies,
        verifiedAllergies,
        unverifiedAllergies: totalAllergies - verifiedAllergies,
        criticalAllergies,
        allergenBreakdown: allergenCounts.map((item: any) => ({
          allergen: item.allergen,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting allergy statistics:', error);
      throw error;
    }
  }

  /**
   * Search allergies by allergen name across all students
   */
  static async searchAllergies(query: string, limit: number = 50) {
    try {
      const allergies = await Allergy.findAll({
        where: {
          allergen: { [require('sequelize').Op.iLike]: `%${query}%` }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [
          ['severity', 'DESC'],
          ['allergen', 'ASC']
        ],
        limit
      });

      return allergies;
    } catch (error) {
      logger.error('Error searching allergies:', error);
      throw error;
    }
  }

  /**
   * Verify allergy with medical professional
   */
  static async verifyAllergy(id: string, verifiedBy: string, notes?: string) {
    try {
      const allergy = await Allergy.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      await allergy.update({
        verified: true,
        verifiedBy,
        verifiedAt: new Date(),
        notes: notes || allergy.notes
      });

      // Reload with associations
      await allergy.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Allergy verified: ${allergy.allergen} for ${allergy.student!.firstName} ${allergy.student!.lastName} by ${verifiedBy}`);
      return allergy;
    } catch (error) {
      logger.error('Error verifying allergy:', error);
      throw error;
    }
  }

  /**
   * Get allergies by severity level
   */
  static async getAllergiesBySeverity(severity: AllergySeverity) {
    try {
      const allergies = await Allergy.findAll({
        where: { severity },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [
          ['student', 'lastName', 'ASC'],
          ['student', 'firstName', 'ASC'],
          ['allergen', 'ASC']
        ]
      });

      return allergies;
    } catch (error) {
      logger.error(`Error fetching allergies by severity ${severity}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update allergy verification status
   */
  static async bulkVerifyAllergies(allergyIds: string[], verifiedBy: string) {
    try {
      if (!allergyIds || allergyIds.length === 0) {
        throw new Error('No allergy IDs provided');
      }

      // Get allergies to be verified for logging
      const allergiesToVerify = await Allergy.findAll({
        where: {
          id: { [require('sequelize').Op.in]: allergyIds }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      // Update the allergies
      const [updatedCount] = await Allergy.update(
        {
          verified: true,
          verifiedBy,
          verifiedAt: new Date()
        },
        {
          where: {
            id: { [require('sequelize').Op.in]: allergyIds }
          }
        }
      );

      const notFoundCount = allergyIds.length - updatedCount;

      // Log the bulk verification
      logger.info(`Bulk verification completed: ${updatedCount} allergies verified, ${notFoundCount} not found by ${verifiedBy}`);

      if (allergiesToVerify.length > 0) {
        const studentNames = [...new Set(allergiesToVerify.map(a => `${a.student!.firstName} ${a.student!.lastName}`))];
        logger.info(`Allergies verified for students: ${studentNames.join(', ')}`);
      }

      return {
        verified: updatedCount,
        notFound: notFoundCount,
        success: true
      };
    } catch (error) {
      logger.error('Error in bulk allergy verification:', error);
      throw error;
    }
  }

  /**
   * Get students with food allergies (for cafeteria planning)
   */
  static async getFoodAllergies() {
    try {
      const foodAllergens = [
        'peanuts', 'tree nuts', 'milk', 'eggs', 'wheat', 'soy', 
        'fish', 'shellfish', 'sesame', 'dairy', 'gluten'
      ];

      const foodAllergies = await Allergy.findAll({
        where: {
          allergen: { 
            [require('sequelize').Op.or]: foodAllergens.map(allergen => ({
              [require('sequelize').Op.iLike]: `%${allergen}%`
            }))
          }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [
          ['severity', 'DESC'],
          ['student', 'grade', 'ASC'],
          ['student', 'lastName', 'ASC']
        ]
      });

      return foodAllergies;
    } catch (error) {
      logger.error('Error fetching food allergies:', error);
      throw error;
    }
  }
}
