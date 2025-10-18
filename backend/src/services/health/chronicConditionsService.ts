/**
 * WC-GEN-252 | chronicConditionsService.ts - General utility functions and operations
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
import { ChronicCondition, Student } from '../../database/models';
import { ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { 
  CreateChronicConditionData, 
  UpdateChronicConditionData, 
  ChronicConditionFilters 
} from './types';
import {
  validateICD10Code,
  validateDiagnosisDate
} from '../../utils/healthRecordValidators';

/**
 * Chronic Conditions Service - Manages student chronic health conditions
 */
export class ChronicConditionsService {
  /**
   * Add chronic condition to student with validation
   */
  static async addChronicCondition(data: CreateChronicConditionData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate condition name
      if (!data.condition || data.condition.trim().length === 0) {
        throw new Error('Condition name is required');
      }

      // Validate ICD-10 code if provided
      if (data.icdCode) {
        const icdValidation = validateICD10Code(data.icdCode);
        if (!icdValidation.isValid) {
          throw new Error(`Invalid ICD-10 code: ${icdValidation.errors.join(', ')}`);
        }
        if (icdValidation.warnings.length > 0) {
          logger.warn(`ICD-10 code validation warnings for ${data.condition}:`, icdValidation.warnings);
        }
      }

      // Validate diagnosis date
      if (data.diagnosisDate) {
        const dateValidation = validateDiagnosisDate(new Date(data.diagnosisDate));
        if (!dateValidation.isValid) {
          throw new Error(`Invalid diagnosis date: ${dateValidation.errors.join(', ')}`);
        }
        if (dateValidation.warnings.length > 0) {
          logger.warn(`Diagnosis date validation warnings:`, dateValidation.warnings);
        }
      }

      // Validate severity is provided
      if (!data.severity) {
        logger.warn(`No severity specified for chronic condition ${data.condition}, defaulting to MODERATE`);
      }

      // Log critical conditions
      if (data.severity === ConditionSeverity.CRITICAL || data.severity === ConditionSeverity.SEVERE) {
        logger.warn(`CRITICAL/SEVERE CONDITION ADDED: ${data.condition} (${data.severity}) for student ${student.id} - ${student.firstName} ${student.lastName}`);
      }

      const chronicCondition = await ChronicCondition.create({
        ...data,
        status: data.status || ConditionStatus.ACTIVE,
        medications: data.medications || [],
        restrictions: data.restrictions || [],
        triggers: data.triggers || []
      });

      // Reload with associations
      await chronicCondition.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Chronic condition added: ${data.condition} (ICD: ${data.icdCode || 'N/A'}) for ${student.firstName} ${student.lastName}`);
      return chronicCondition;
    } catch (error) {
      logger.error('Error adding chronic condition:', error);
      throw error;
    }
  }

  /**
   * Update chronic condition
   */
  static async updateChronicCondition(id: string, data: UpdateChronicConditionData) {
    try {
      const existingCondition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingCondition) {
        throw new Error('Chronic condition not found');
      }

      // Validate ICD-10 code if being updated
      if (data.icdCode) {
        const icdValidation = validateICD10Code(data.icdCode);
        if (!icdValidation.isValid) {
          throw new Error(`Invalid ICD-10 code: ${icdValidation.errors.join(', ')}`);
        }
      }

      // Validate diagnosis date if being updated
      if (data.diagnosisDate) {
        const dateValidation = validateDiagnosisDate(new Date(data.diagnosisDate));
        if (!dateValidation.isValid) {
          throw new Error(`Invalid diagnosis date: ${dateValidation.errors.join(', ')}`);
        }
      }

      await existingCondition.update(data);

      // Reload with associations
      await existingCondition.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Chronic condition updated: ${existingCondition.condition} for ${existingCondition.student!.firstName} ${existingCondition.student!.lastName}`);
      return existingCondition;
    } catch (error) {
      logger.error('Error updating chronic condition:', error);
      throw error;
    }
  }

  /**
   * Get student chronic conditions with optional filtering
   */
  static async getStudentChronicConditions(studentId: string, filters: ChronicConditionFilters = {}) {
    try {
      const whereClause: any = { studentId };

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.condition) {
        whereClause.condition = { [require('sequelize').Op.iLike]: `%${filters.condition}%` };
      }

      const conditions = await ChronicCondition.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['status', 'ASC'], // Active first
          ['severity', 'DESC'], // Most severe first
          ['condition', 'ASC']
        ]
      });

      return conditions;
    } catch (error) {
      logger.error('Error fetching student chronic conditions:', error);
      throw error;
    }
  }

  /**
   * Get chronic condition by ID
   */
  static async getChronicConditionById(id: string) {
    try {
      const chronicCondition = await ChronicCondition.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          }
        ]
      });

      if (!chronicCondition) {
        throw new Error('Chronic condition not found');
      }

      return chronicCondition;
    } catch (error) {
      logger.error('Error fetching chronic condition by ID:', error);
      throw error;
    }
  }

  /**
   * Delete chronic condition
   */
  static async deleteChronicCondition(id: string) {
    try {
      const condition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!condition) {
        throw new Error('Chronic condition not found');
      }

      await condition.destroy();

      logger.info(`Chronic condition deleted: ${condition.condition} for ${condition.student!.firstName} ${condition.student!.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting chronic condition:', error);
      throw error;
    }
  }

  /**
   * Get critical chronic conditions across all students
   */
  static async getCriticalChronicConditions() {
    try {
      const criticalConditions = await ChronicCondition.findAll({
        where: {
          status: ConditionStatus.ACTIVE,
          severity: [ConditionSeverity.CRITICAL, ConditionSeverity.SEVERE]
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

      return criticalConditions;
    } catch (error) {
      logger.error('Error fetching critical chronic conditions:', error);
      throw error;
    }
  }

  /**
   * Get chronic conditions by status
   */
  static async getChronicConditionsByStatus(status: ConditionStatus) {
    try {
      const conditions = await ChronicCondition.findAll({
        where: { status },
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

      return conditions;
    } catch (error) {
      logger.error(`Error fetching chronic conditions by status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Get chronic conditions requiring review
   */
  static async getConditionsRequiringReview() {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const conditionsNeedingReview = await ChronicCondition.findAll({
        where: {
          status: ConditionStatus.ACTIVE,
          [require('sequelize').Op.or]: [
            { lastReviewDate: null },
            { lastReviewDate: { [require('sequelize').Op.lt]: oneYearAgo } },
            { nextReviewDate: { [require('sequelize').Op.lte]: new Date() } }
          ]
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['severity', 'DESC'],
          ['lastReviewDate', 'ASC'] // Oldest reviews first
        ]
      });

      return conditionsNeedingReview;
    } catch (error) {
      logger.error('Error fetching conditions requiring review:', error);
      throw error;
    }
  }

  /**
   * Search chronic conditions across all students
   */
  static async searchChronicConditions(query: string, limit: number = 50) {
    try {
      const conditions = await ChronicCondition.findAll({
        where: {
          [require('sequelize').Op.or]: [
            { condition: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { icdCode: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { diagnosedBy: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { notes: { [require('sequelize').Op.iLike]: `%${query}%` } }
          ]
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
          ['condition', 'ASC']
        ],
        limit
      });

      return conditions;
    } catch (error) {
      logger.error('Error searching chronic conditions:', error);
      throw error;
    }
  }

  /**
   * Get chronic conditions statistics
   */
  static async getChronicConditionsStatistics() {
    try {
      const [
        totalConditions,
        activeConditions,
        criticalConditions,
        conditionCounts,
        conditionsNeedingReview
      ] = await Promise.all([
        // Total conditions count
        ChronicCondition.count(),

        // Active conditions count
        ChronicCondition.count({
          where: { status: ConditionStatus.ACTIVE }
        }),

        // Critical conditions count
        ChronicCondition.count({
          where: {
            status: ConditionStatus.ACTIVE,
            severity: [ConditionSeverity.CRITICAL, ConditionSeverity.SEVERE]
          }
        }),

        // Most common conditions
        ChronicCondition.findAll({
          attributes: [
            'condition',
            [require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('condition')), 'count']
          ],
          where: { status: ConditionStatus.ACTIVE },
          group: ['condition'],
          order: [[require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('condition')), 'DESC']],
          limit: 10,
          raw: true
        }),

        // Conditions needing review count
        this.getConditionsRequiringReview().then(conditions => conditions.length)
      ]);

      return {
        totalConditions,
        activeConditions,
        inactiveConditions: totalConditions - activeConditions,
        criticalConditions,
        conditionsNeedingReview,
        conditionBreakdown: conditionCounts.map((item: any) => ({
          condition: item.condition,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting chronic conditions statistics:', error);
      throw error;
    }
  }

  /**
   * Update condition review information
   */
  static async updateConditionReview(
    id: string, 
    reviewedBy: string, 
    reviewNotes?: string,
    nextReviewDate?: Date
  ) {
    try {
      const condition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!condition) {
        throw new Error('Chronic condition not found');
      }

      const updateData: any = {
        lastReviewDate: new Date(),
        reviewedBy,
        notes: reviewNotes || condition.notes
      };

      if (nextReviewDate) {
        updateData.nextReviewDate = nextReviewDate;
      } else {
        // Default to 1 year from now
        const defaultNextReview = new Date();
        defaultNextReview.setFullYear(defaultNextReview.getFullYear() + 1);
        updateData.nextReviewDate = defaultNextReview;
      }

      await condition.update(updateData);

      // Reload with associations
      await condition.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Chronic condition reviewed: ${condition.condition} for ${condition.student!.firstName} ${condition.student!.lastName} by ${reviewedBy}`);
      return condition;
    } catch (error) {
      logger.error('Error updating condition review:', error);
      throw error;
    }
  }

  /**
   * Get care plan for a student's chronic conditions
   */
  static async getStudentCarePlan(studentId: string) {
    try {
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      const activeConditions = await this.getStudentChronicConditions(studentId, {
        status: ConditionStatus.ACTIVE
      });

      const carePlan = {
        student,
        generatedDate: new Date(),
        conditions: activeConditions.map(condition => ({
          condition: condition.condition,
          severity: condition.severity,
          icdCode: condition.icdCode,
          medications: condition.medications || [],
          restrictions: condition.restrictions || [],
          triggers: condition.triggers || [],
          carePlan: condition.carePlan,
          emergencyActions: this.getEmergencyActionsForCondition(condition.condition)
        })),
        overallRiskLevel: this.calculateOverallRisk(activeConditions),
        emergencyContacts: [], // Would be filled from student record
        accommodations: this.generateAccommodations(activeConditions)
      };

      return carePlan;
    } catch (error) {
      logger.error('Error generating student care plan:', error);
      throw error;
    }
  }

  /**
   * Bulk update condition status
   */
  static async bulkUpdateConditionStatus(conditionIds: string[], status: ConditionStatus, updatedBy: string) {
    try {
      if (!conditionIds || conditionIds.length === 0) {
        throw new Error('No condition IDs provided');
      }

      // Get conditions to be updated for logging
      const conditionsToUpdate = await ChronicCondition.findAll({
        where: {
          id: { [require('sequelize').Op.in]: conditionIds }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      // Update the conditions
      const [updatedCount] = await ChronicCondition.update(
        {
          status,
          lastReviewDate: new Date(),
          reviewedBy: updatedBy
        },
        {
          where: {
            id: { [require('sequelize').Op.in]: conditionIds }
          }
        }
      );

      const notFoundCount = conditionIds.length - updatedCount;

      // Log the bulk update
      logger.info(`Bulk status update completed: ${updatedCount} conditions updated to ${status}, ${notFoundCount} not found by ${updatedBy}`);

      if (conditionsToUpdate.length > 0) {
        const studentNames = [...new Set(conditionsToUpdate.map(c => `${c.student!.firstName} ${c.student!.lastName}`))];
        logger.info(`Conditions updated for students: ${studentNames.join(', ')}`);
      }

      return {
        updated: updatedCount,
        notFound: notFoundCount,
        success: true
      };
    } catch (error) {
      logger.error('Error in bulk condition status update:', error);
      throw error;
    }
  }

  /**
   * Helper method to get emergency actions for a condition
   */
  private static getEmergencyActionsForCondition(condition: string): string[] {
    const conditionLower = condition.toLowerCase();
    
    // Simplified emergency actions - in production use medical protocols
    if (conditionLower.includes('asthma')) {
      return [
        'Administer rescue inhaler if available',
        'Have student sit upright and breathe slowly',
        'Call 911 if breathing difficulty persists',
        'Contact parent/guardian immediately'
      ];
    } else if (conditionLower.includes('diabetes')) {
      return [
        'Check blood sugar if possible',
        'Administer glucose if hypoglycemic and conscious',
        'Call 911 if unconscious or severe symptoms',
        'Contact parent/guardian and school nurse'
      ];
    } else if (conditionLower.includes('epilepsy') || conditionLower.includes('seizure')) {
      return [
        'Move objects away from student',
        'Turn student to side if safe to do so',
        'Do not restrain or put anything in mouth',
        'Call 911 if seizure lasts over 5 minutes',
        'Contact parent/guardian after seizure ends'
      ];
    } else if (conditionLower.includes('allergy') || conditionLower.includes('anaphylaxis')) {
      return [
        'Administer epinephrine auto-injector if available',
        'Call 911 immediately',
        'Keep student lying flat with legs elevated',
        'Monitor breathing and consciousness',
        'Contact parent/guardian'
      ];
    }

    return [
      'Contact school nurse immediately',
      'Monitor student closely',
      'Call 911 if condition worsens',
      'Contact parent/guardian'
    ];
  }

  /**
   * Helper method to calculate overall risk level
   */
  private static calculateOverallRisk(conditions: any[]): string {
    if (conditions.some(c => c.severity === ConditionSeverity.CRITICAL)) {
      return 'CRITICAL';
    } else if (conditions.some(c => c.severity === ConditionSeverity.SEVERE)) {
      return 'HIGH';
    } else if (conditions.some(c => c.severity === ConditionSeverity.MODERATE)) {
      return 'MODERATE';
    } else {
      return 'LOW';
    }
  }

  /**
   * Helper method to generate accommodations
   */
  private static generateAccommodations(conditions: any[]): string[] {
    const accommodations = new Set<string>();

    conditions.forEach(condition => {
      const conditionLower = condition.condition.toLowerCase();
      
      if (conditionLower.includes('asthma')) {
        accommodations.add('Access to inhaler at all times');
        accommodations.add('Avoid exposure to triggers (dust, strong scents)');
        accommodations.add('Modified physical activity as needed');
      }
      
      if (conditionLower.includes('diabetes')) {
        accommodations.add('Frequent snack breaks as needed');
        accommodations.add('Access to blood glucose monitoring');
        accommodations.add('Restroom access without permission');
      }

      if (conditionLower.includes('adhd') || conditionLower.includes('attention')) {
        accommodations.add('Extended time for tests');
        accommodations.add('Preferential seating (front of class)');
        accommodations.add('Frequent breaks during long activities');
      }

      // Add restrictions as accommodations
      if (condition.restrictions && condition.restrictions.length > 0) {
        condition.restrictions.forEach((restriction: string) => {
          accommodations.add(`Restriction: ${restriction}`);
        });
      }
    });

    return Array.from(accommodations);
  }
}
