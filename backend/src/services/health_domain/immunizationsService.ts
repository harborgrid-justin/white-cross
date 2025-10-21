/**
 * LOC: 39D12C6A2C
 * WC-GEN-255 | immunizationsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecordService.ts (services/health/healthRecordService.ts)
 *   - importExportService.ts (services/health/importExportService.ts)
 */

/**
 * WC-GEN-255 | immunizationsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: ../../utils/logger, ../../database/models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import { Vaccination, Student } from '../../database/models';
import { 
  CreateVaccinationData, 
  UpdateVaccinationData, 
  VaccinationFilters 
} from './types';
import {
  validateCVXCode,
  validateVaccinationDates
} from '../../utils/healthRecordValidators';

/**
 * Immunizations Service - Manages student vaccination records
 */
export class ImmunizationsService {
  /**
   * Add vaccination record with comprehensive validation
   */
  static async addVaccination(data: CreateVaccinationData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate vaccine name
      if (!data.vaccineName || data.vaccineName.trim().length === 0) {
        throw new Error('Vaccine name is required');
      }

      // Validate CVX code if provided
      if (data.cvxCode) {
        const cvxValidation = validateCVXCode(data.cvxCode);
        if (!cvxValidation.isValid) {
          throw new Error(`Invalid CVX code: ${cvxValidation.errors.join(', ')}`);
        }
        if (cvxValidation.warnings.length > 0) {
          logger.warn(`CVX code validation warnings for ${data.vaccineName}:`, cvxValidation.warnings);
        }
      }

      // Validate vaccination dates
      const dateValidation = validateVaccinationDates(
        new Date(data.administrationDate),
        data.expirationDate ? new Date(data.expirationDate) : undefined
      );

      if (!dateValidation.isValid) {
        throw new Error(`Invalid vaccination dates: ${dateValidation.errors.join(', ')}`);
      }

      if (dateValidation.warnings.length > 0) {
        logger.warn(`Vaccination date warnings for ${data.vaccineName}:`, dateValidation.warnings);
      }

      // Validate dose numbers if provided
      if (data.doseNumber && data.totalDoses) {
        if (data.doseNumber > data.totalDoses) {
          throw new Error(`Dose number (${data.doseNumber}) cannot exceed total doses (${data.totalDoses})`);
        }
        if (data.doseNumber < 1) {
          throw new Error('Dose number must be at least 1');
        }
      }

      // Check if expiration date has passed
      if (data.expirationDate && new Date(data.expirationDate) < new Date()) {
        logger.warn(`WARNING: Expired vaccine administered - ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for student ${student.id}`);
      }

      const vaccination = await Vaccination.create({
        ...data,
        seriesComplete: data.doseNumber === data.totalDoses,
        exemptionStatus: false,
        vfcEligibility: false,
        visProvided: false,
        consentObtained: false
      });

      // Reload with associations
      await vaccination.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Vaccination added: ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for ${student.firstName} ${student.lastName}`);
      return vaccination;
    } catch (error) {
      logger.error('Error adding vaccination:', error);
      throw error;
    }
  }

  /**
   * Update vaccination record
   */
  static async updateVaccination(id: string, data: UpdateVaccinationData) {
    try {
      const existingVaccination = await Vaccination.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingVaccination) {
        throw new Error('Vaccination not found');
      }

      // Validate CVX code if being updated
      if (data.cvxCode) {
        const cvxValidation = validateCVXCode(data.cvxCode);
        if (!cvxValidation.isValid) {
          throw new Error(`Invalid CVX code: ${cvxValidation.errors.join(', ')}`);
        }
      }

      // Validate dates if being updated
      const adminDate = data.administrationDate ? new Date(data.administrationDate) : new Date(existingVaccination.administrationDate);
      const expDate = data.expirationDate ? new Date(data.expirationDate) : (existingVaccination.expirationDate ? new Date(existingVaccination.expirationDate) : undefined);

      if (data.administrationDate || data.expirationDate) {
        const dateValidation = validateVaccinationDates(adminDate, expDate);
        if (!dateValidation.isValid) {
          throw new Error(`Invalid vaccination dates: ${dateValidation.errors.join(', ')}`);
        }
      }

      // Update series complete status if dose numbers change
      const updateData: any = { ...data };
      if (data.doseNumber && data.totalDoses) {
        updateData.seriesComplete = data.doseNumber === data.totalDoses;
      } else if (data.doseNumber && existingVaccination.totalDoses) {
        updateData.seriesComplete = data.doseNumber === existingVaccination.totalDoses;
      } else if (data.totalDoses && existingVaccination.doseNumber) {
        updateData.seriesComplete = existingVaccination.doseNumber === data.totalDoses;
      }

      await existingVaccination.update(updateData);

      // Reload with associations
      await existingVaccination.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Vaccination updated: ${existingVaccination.vaccineName} for ${existingVaccination.student!.firstName} ${existingVaccination.student!.lastName}`);
      return existingVaccination;
    } catch (error) {
      logger.error('Error updating vaccination:', error);
      throw error;
    }
  }

  /**
   * Get student vaccinations with optional filtering
   */
  static async getStudentVaccinations(studentId: string, filters: VaccinationFilters = {}) {
    try {
      const whereClause: any = { studentId };

      if (filters.vaccineName) {
        whereClause.vaccineName = { [require('sequelize').Op.iLike]: `%${filters.vaccineName}%` };
      }

      if (filters.cvxCode) {
        whereClause.cvxCode = filters.cvxCode;
      }

      if (filters.seriesComplete !== undefined) {
        whereClause.seriesComplete = filters.seriesComplete;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.administrationDate = {};
        if (filters.dateFrom) {
          whereClause.administrationDate[require('sequelize').Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.administrationDate[require('sequelize').Op.lte] = filters.dateTo;
        }
      }

      const vaccinations = await Vaccination.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['administrationDate', 'DESC'],
          ['vaccineName', 'ASC']
        ]
      });

      return vaccinations;
    } catch (error) {
      logger.error('Error fetching student vaccinations:', error);
      throw error;
    }
  }

  /**
   * Get vaccination by ID
   */
  static async getVaccinationById(id: string) {
    try {
      const vaccination = await Vaccination.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          }
        ]
      });

      if (!vaccination) {
        throw new Error('Vaccination not found');
      }

      return vaccination;
    } catch (error) {
      logger.error('Error fetching vaccination by ID:', error);
      throw error;
    }
  }

  /**
   * Delete vaccination record
   */
  static async deleteVaccination(id: string) {
    try {
      const vaccination = await Vaccination.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!vaccination) {
        throw new Error('Vaccination not found');
      }

      await vaccination.destroy();

      logger.info(`Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student!.firstName} ${vaccination.student!.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting vaccination:', error);
      throw error;
    }
  }

  /**
   * Get vaccination compliance report for a student
   */
  static async getVaccinationCompliance(studentId: string) {
    try {
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'grade']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      const vaccinations = await this.getStudentVaccinations(studentId);

      // Group vaccinations by vaccine type
      const vaccinationsByType = vaccinations.reduce((acc, vaccination) => {
        const vaccineName = vaccination.vaccineName.toLowerCase();
        if (!acc[vaccineName]) {
          acc[vaccineName] = [];
        }
        acc[vaccineName].push(vaccination);
        return acc;
      }, {} as Record<string, any[]>);

      // Define required vaccines by age/grade (simplified - in production use CDC schedule)
      const requiredVaccines = this.getRequiredVaccinesByAge(student.dateOfBirth, student.grade);

      const complianceReport = {
        student,
        totalVaccinations: vaccinations.length,
        compliant: true,
        missingVaccines: [] as string[],
        incompleteVaccines: [] as string[],
        upcomingVaccines: [] as string[],
        vaccinationsByType
      };

      // Check compliance for each required vaccine
      for (const requiredVaccine of requiredVaccines) {
        const studentVaccines = vaccinationsByType[requiredVaccine.name.toLowerCase()] || [];
        
        if (studentVaccines.length === 0) {
          complianceReport.missingVaccines.push(requiredVaccine.name);
          complianceReport.compliant = false;
        } else {
          const completedDoses = studentVaccines.filter(v => v.seriesComplete).length;
          if (completedDoses < requiredVaccine.requiredDoses) {
            complianceReport.incompleteVaccines.push(
              `${requiredVaccine.name} (${completedDoses}/${requiredVaccine.requiredDoses} doses)`
            );
            complianceReport.compliant = false;
          }
        }
      }

      return complianceReport;
    } catch (error) {
      logger.error('Error generating vaccination compliance report:', error);
      throw error;
    }
  }

  /**
   * Get vaccination statistics
   */
  static async getVaccinationStatistics() {
    try {
      const [
        totalVaccinations,
        completedSeries,
        recentVaccinations,
        vaccineCounts
      ] = await Promise.all([
        // Total vaccinations count
        Vaccination.count(),

        // Completed series count
        Vaccination.count({
          where: { seriesComplete: true }
        }),

        // Recent vaccinations (last 30 days)
        Vaccination.count({
          where: {
            administrationDate: {
              [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Most common vaccines
        Vaccination.findAll({
          attributes: [
            'vaccineName',
            [require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('vaccineName')), 'count']
          ],
          group: ['vaccineName'],
          order: [[require('../../database/models').sequelize.fn('COUNT', require('../../database/models').sequelize.col('vaccineName')), 'DESC']],
          limit: 10,
          raw: true
        })
      ]);

      return {
        totalVaccinations,
        completedSeries,
        incompleteSeries: totalVaccinations - completedSeries,
        recentVaccinations,
        vaccineBreakdown: vaccineCounts.map((item: any) => ({
          vaccine: item.vaccineName,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting vaccination statistics:', error);
      throw error;
    }
  }

  /**
   * Get overdue vaccinations for all students
   */
  static async getOverdueVaccinations() {
    try {
      const students = await Student.findAll({
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'grade'],
        include: [
          {
            model: Vaccination,
            as: 'vaccinations',
            required: false
          }
        ]
      });

      const overdueReports = [];

      for (const student of students) {
        const compliance = await this.getVaccinationCompliance(student.id);
        
        if (!compliance.compliant) {
          overdueReports.push({
            student: {
              id: student.id,
              firstName: student.firstName,
              lastName: student.lastName,
              grade: student.grade
            },
            missingVaccines: compliance.missingVaccines,
            incompleteVaccines: compliance.incompleteVaccines
          });
        }
      }

      return overdueReports;
    } catch (error) {
      logger.error('Error getting overdue vaccinations:', error);
      throw error;
    }
  }

  /**
   * Search vaccinations across all students
   */
  static async searchVaccinations(query: string, limit: number = 50) {
    try {
      const vaccinations = await Vaccination.findAll({
        where: {
          [require('sequelize').Op.or]: [
            { vaccineName: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { cvxCode: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { manufacturer: { [require('sequelize').Op.iLike]: `%${query}%` } },
            { lotNumber: { [require('sequelize').Op.iLike]: `%${query}%` } }
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
          ['administrationDate', 'DESC'],
          ['vaccineName', 'ASC']
        ],
        limit
      });

      return vaccinations;
    } catch (error) {
      logger.error('Error searching vaccinations:', error);
      throw error;
    }
  }

  /**
   * Get upcoming vaccination reminders
   */
  static async getUpcomingVaccinationReminders(daysAhead: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

      const upcomingVaccinations = await Vaccination.findAll({
        where: {
          nextDueDate: {
            [require('sequelize').Op.between]: [new Date(), cutoffDate]
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
          ['nextDueDate', 'ASC'],
          ['student', 'lastName', 'ASC']
        ]
      });

      return upcomingVaccinations.map(vaccination => ({
        ...vaccination.get({ plain: true }),
        daysUntilDue: Math.ceil((new Date(vaccination.nextDueDate!).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
      }));
    } catch (error) {
      logger.error('Error getting upcoming vaccination reminders:', error);
      throw error;
    }
  }

  /**
   * Helper method to get required vaccines by age/grade
   */
  private static getRequiredVaccinesByAge(dateOfBirth?: Date, grade?: string) {
    // Simplified vaccine requirements - in production use CDC immunization schedule
    const requiredVaccines = [
      { name: 'DTaP', requiredDoses: 5 },
      { name: 'Polio', requiredDoses: 4 },
      { name: 'MMR', requiredDoses: 2 },
      { name: 'Varicella', requiredDoses: 2 },
      { name: 'Hepatitis B', requiredDoses: 3 },
      { name: 'Hib', requiredDoses: 4 },
      { name: 'PCV', requiredDoses: 4 }
    ];

    // Add grade-specific requirements
    if (grade && ['6', '7', '8', '9', '10', '11', '12'].includes(grade)) {
      requiredVaccines.push(
        { name: 'Tdap', requiredDoses: 1 },
        { name: 'Meningococcal', requiredDoses: 1 }
      );
    }

    return requiredVaccines;
  }

  /**
   * Generate vaccination certificate for a student
   */
  static async generateVaccinationCertificate(studentId: string) {
    try {
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth', 'grade']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      const vaccinations = await this.getStudentVaccinations(studentId);
      const compliance = await this.getVaccinationCompliance(studentId);

      const certificate = {
        student,
        generatedDate: new Date(),
        vaccinations: vaccinations.map(v => ({
          vaccineName: v.vaccineName,
          administrationDate: v.administrationDate,
          administeredBy: v.administeredBy,
          cvxCode: v.cvxCode,
          doseNumber: v.doseNumber,
          totalDoses: v.totalDoses,
          seriesComplete: v.seriesComplete
        })),
        compliance: {
          isCompliant: compliance.compliant,
          missingVaccines: compliance.missingVaccines,
          incompleteVaccines: compliance.incompleteVaccines
        }
      };

      logger.info(`Vaccination certificate generated for ${student.firstName} ${student.lastName}`);
      return certificate;
    } catch (error) {
      logger.error('Error generating vaccination certificate:', error);
      throw error;
    }
  }
}
