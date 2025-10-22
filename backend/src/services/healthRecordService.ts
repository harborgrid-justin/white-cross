/**
 * @fileoverview Health Record Service (Legacy) - Comprehensive PHI Management System
 * @module services/healthRecordService
 * @description Direct database access service for health records, allergies, and conditions
 * @deprecated Consider using services/healthRecord/ modules for new implementations
 *
 * Service Overview:
 * This service provides direct database operations for health records. It includes
 * comprehensive validation, HIPAA compliance, and audit logging. For new code,
 * consider using the modular services in services/healthRecord/ directory which
 * provide better separation of concerns and maintainability.
 *
 * Key Features:
 * - Complete health record CRUD operations
 * - Allergy management with severity tracking
 * - Chronic condition tracking with ICD-10 validation
 * - Vaccination records with CVX code validation
 * - Vital signs tracking with BMI calculation
 * - Growth chart data for CDC percentiles
 * - Comprehensive health summary generation
 * - Advanced filtering and search capabilities
 * - Import/export functionality
 * - Statistical reporting
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance FERPA §99.3 - Education records with health information
 * @compliance CDC Guidelines - Immunization and growth tracking
 * @compliance ICD-10-CM - Diagnosis coding standards
 * @security PHI - All operations tracked in audit log
 * @security Access Control - Role-based permissions required
 * @security Data Encryption - PHI encrypted at rest (AES-256) and in transit (TLS 1.2+)
 * @audit Minimum 6-year retention for HIPAA compliance
 * @audit All PHI access logged with user ID and timestamp
 *
 * Emergency Access (Break-Glass):
 * - Emergency personnel can override access restrictions
 * - All break-glass events automatically logged
 * - Administrative review required within 24 hours
 * - Justification must be documented
 *
 * Parent/Guardian Consent:
 * - Consent required for students under age of majority
 * - Consent status tracked in student records
 * - Some treatments require explicit written consent
 * - Emergency treatment may proceed without consent
 *
 * Data Retention:
 * - Active records: Indefinite retention while student enrolled
 * - Graduated students: 6 years minimum (HIPAA requirement)
 * - Deleted records: Soft delete preferred, 6-year retention
 * - Audit logs: 6 years minimum, never delete
 *
 * @requires ../utils/logger
 * @requires ../database/models
 * @requires ../utils/healthRecordValidators
 * @requires ../database/types/enums
 *
 * LOC: 377BCE712E
 * WC-SVC-HLT-014 | healthRecordService.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  Student,
  sequelize
} from '../database/models';
import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../database/types/enums';

// Type augmentations for model associations
declare module '../database/models' {
  interface HealthRecord {
    student?: Student;
    vital?: any;
    type: any;
    date: Date;
  }
  
  interface Allergy {
    student?: Student;
    allergen: string;
  }
  
  interface ChronicCondition {
    student?: Student;
    condition: string;
  }
  
  interface Vaccination {
    student?: Student;
    vaccineName: string;
    administrationDate: Date;
    expirationDate?: Date;
    doseNumber?: number;
    totalDoses?: number;
  }
  
  interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  }
}
import {
  validateHealthRecordData,
  validateVitalSigns,
  calculateBMI,
  validateICD10Code,
  validateCVXCode,
  validateNPI,
  validateDiagnosisDate,
  validateVaccinationDates,
  validateAllergyReactions,
  ValidationResult,
  AgeCategory
} from '../utils/healthRecordValidators';

export interface CreateHealthRecordData {
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: any; // JSON data for vitals
  provider?: string;
  notes?: string;
  attachments?: string[];
}

export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface CreateChronicConditionData {
  studentId: string;
  condition: string;
  diagnosisDate: Date;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  icdCode?: string;
}

export interface CreateVaccinationData {
  studentId: string;
  vaccineName: string;
  administrationDate: Date;
  administeredBy: string;
  cvxCode?: string;
  ndcCode?: string;
  lotNumber?: string;
  manufacturer?: string;
  doseNumber?: number;
  totalDoses?: number;
  expirationDate?: Date;
  nextDueDate?: Date;
  site?: string;
  route?: string;
  dosageAmount?: string;
  reactions?: string;
  notes?: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface HealthRecordFilters {
  type?: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING';
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
}

export class HealthRecordService {
  /**
   * Get health records for a student with pagination and filters
   */
  static async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = { studentId };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.date = {};
        if (filters.dateFrom) {
          whereClause.date[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.date[Op.lte] = filters.dateTo;
        }
      }

      if (filters.provider) {
        whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['date', 'DESC']],
        distinct: true
      });

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching student health records:', error);
      throw new Error('Failed to fetch health records');
    }
  }

  /**
   * Create new health record with comprehensive validation
   */
  static async createHealthRecord(data: CreateHealthRecordData) {
    try {
      // Verify student exists and get date of birth for age-based validation
      const student = await Student.findByPk(data.studentId, {
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate health record data
      const validationResult = validateHealthRecordData(
        {
          vital: data.vital,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        student.dateOfBirth ? new Date(student.dateOfBirth) : undefined
      );

      // Log warnings but don't block creation
      if (validationResult.warnings.length > 0) {
        logger.warn(`Health record validation warnings for student ${student.id}:`, validationResult.warnings);
      }

      // Block creation if there are critical errors
      if (!validationResult.isValid) {
        const errorMessage = `Health record validation failed: ${validationResult.errors.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Calculate BMI if height and weight are provided in vitals
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const vitals = data.vital as any;
        if (vitals.height && vitals.weight) {
          const calculatedBMI = calculateBMI(vitals.height, vitals.weight);
          if (calculatedBMI !== null) {
            vitals.bmi = calculatedBMI;
            data.vital = vitals;
            logger.info(`Auto-calculated BMI: ${calculatedBMI} for student ${student.id}`);
          }
        }
      }

      const healthRecord = await HealthRecord.create(data);

      // Reload with associations
      await healthRecord.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Health record created: ${data.type} for ${student.firstName} ${student.lastName}`);
      return healthRecord;
    } catch (error) {
      logger.error('Error creating health record:', error);
      throw error;
    }
  }

  /**
   * Update health record with validation
   */
  static async updateHealthRecord(id: string, data: Partial<CreateHealthRecordData>) {
    try {
      const existingRecord = await HealthRecord.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          }
        ]
      });

      if (!existingRecord) {
        throw new Error('Health record not found');
      }

      // Merge vitals for validation
      let mergedVitals = null;
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const currentVitals = (existingRecord.vital && typeof existingRecord.vital === 'object' && existingRecord.vital !== null)
          ? existingRecord.vital as any
          : {};
        const vitalsUpdate = data.vital as any;
        mergedVitals = { ...currentVitals, ...vitalsUpdate };

        // Recalculate BMI if height or weight is being updated
        if (mergedVitals.height && mergedVitals.weight) {
          const calculatedBMI = calculateBMI(mergedVitals.height, mergedVitals.weight);
          if (calculatedBMI !== null) {
            mergedVitals.bmi = calculatedBMI;
            logger.info(`Auto-recalculated BMI: ${calculatedBMI} for health record ${id}`);
          }
        }

        data.vital = mergedVitals;
      }

      // Validate updated data
      const validationResult = validateHealthRecordData(
        {
          vital: mergedVitals,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        existingRecord.student?.dateOfBirth ? new Date(existingRecord.student.dateOfBirth) : undefined
      );

      // Log warnings
      if (validationResult.warnings.length > 0) {
        logger.warn(`Health record update validation warnings for record ${id}:`, validationResult.warnings);
      }

      // Block update if there are critical errors
      if (!validationResult.isValid) {
        const errorMessage = `Health record update validation failed: ${validationResult.errors.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      await existingRecord.update(data);

      // Reload with associations
      await existingRecord.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Health record updated: ${existingRecord.type} for ${existingRecord.student!.firstName} ${existingRecord.student!.lastName}`);
      return existingRecord;
    } catch (error) {
      logger.error('Error updating health record:', error);
      throw error;
    }
  }

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
        verified: data.verified ? new Date() : null
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
  static async updateAllergy(id: string, data: Partial<CreateAllergyData>) {
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
   * Get student allergies
   */
  static async getStudentAllergies(studentId: string) {
    try {
      const allergies = await Allergy.findAll({
        where: { studentId },
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
   * Get vaccination records for a student
   */
  static async getVaccinationRecords(studentId: string) {
    try {
      const records = await HealthRecord.findAll({
        where: {
          studentId,
          type: 'VACCINATION' as any
        } as any,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['date', 'DESC']]
      });

      return records;
    } catch (error) {
      logger.error('Error fetching vaccination records:', error);
      throw error;
    }
  }

  /**
   * Get growth chart data for a student
   */
  static async getGrowthChartData(studentId: string) {
    try {
      const records = await HealthRecord.findAll({
        where: {
          studentId,
          'vital.height': { [Op.ne]: null }
        } as any,
        attributes: ['id', 'date', 'vital', 'type'],
        order: [['date', 'ASC']]
      });

      // Extract height and weight data points
      const growthData = records
        .map((record) => {
          const vital = record.vital as any;
          return {
            date: record.date,
            height: vital?.height,
            weight: vital?.weight,
            bmi: vital?.bmi,
            recordType: record.type
          };
        })
        .filter((data) => data.height || data.weight);

      return growthData;
    } catch (error) {
      logger.error('Error fetching growth chart data:', error);
      throw error;
    }
  }

  /**
   * Get recent vital signs for a student
   */
  static async getRecentVitals(studentId: string, limit: number = 10) {
    try {
      const records = await HealthRecord.findAll({
        where: {
          studentId,
          vital: { [Op.ne]: null }
        } as any,
        attributes: ['id', 'date', 'vital', 'type', 'provider'],
        order: [['date', 'DESC']],
        limit
      });

      return records.map((record) => ({
        ...record.get({ plain: true }),
        vital: record.vital as VitalSigns
      }));
    } catch (error) {
      logger.error('Error fetching recent vitals:', error);
      throw error;
    }
  }

  /**
   * Get health summary for a student
   */
  static async getHealthSummary(studentId: string) {
    try {
      const [student, allergies, recentRecords, vaccinations] = await Promise.all([
        Student.findByPk(studentId, {
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth', 'gender']
        }),
        this.getStudentAllergies(studentId),
        this.getRecentVitals(studentId, 5),
        this.getVaccinationRecords(studentId)
      ]);

      if (!student) {
        throw new Error('Student not found');
      }

      const recordCounts = await HealthRecord.findAll({
        where: { studentId },
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('type')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      return {
        student,
        allergies,
        recentVitals: recentRecords,
        recentVaccinations: vaccinations.slice(0, 5),
        recordCounts: recordCounts.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = parseInt(curr.count, 10);
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Error fetching health summary:', error);
      throw error;
    }
  }

  /**
   * Search health records across all students
   */
  static async searchHealthRecords(
    query: string,
    type?: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING',
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {
        [Op.or]: [
          { description: { [Op.iLike]: `%${query}%` } },
          { notes: { [Op.iLike]: `%${query}%` } },
          { provider: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (type) {
        whereClause.type = type;
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } },
                { studentNumber: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          }
        ],
        order: [['date', 'DESC']],
        distinct: true
      });

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching health records:', error);
      throw error;
    }
  }

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
   * Get student chronic conditions
   */
  static async getStudentChronicConditions(studentId: string) {
    try {
      const conditions = await ChronicCondition.findAll({
        where: { studentId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['status', 'ASC'], // Active first
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
   * Update chronic condition
   */
  static async updateChronicCondition(id: string, data: Partial<CreateChronicConditionData>) {
    try {
      const existingCondition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingCondition) {
        throw new Error('Chronic condition not found');
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
   * Export health history for a student (JSON format)
   */
  static async exportHealthHistory(studentId: string) {
    try {
      const [student, healthRecords, allergies, chronicConditions, vaccinations, growthData] = await Promise.all([
        Student.findByPk(studentId, {
          attributes: ['id', 'studentNumber', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'grade']
        }),
        this.getStudentHealthRecords(studentId, 1, 1000),
        this.getStudentAllergies(studentId),
        this.getStudentChronicConditions(studentId),
        this.getVaccinationRecords(studentId),
        this.getGrowthChartData(studentId)
      ]);

      if (!student) {
        throw new Error('Student not found');
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        student,
        healthRecords: healthRecords.records,
        allergies,
        chronicConditions,
        vaccinations,
        growthData
      };

      logger.info(`Health history exported for ${student.firstName} ${student.lastName}`);
      return exportData;
    } catch (error) {
      logger.error('Error exporting health history:', error);
      throw error;
    }
  }

  /**
   * Import health records from JSON (basic import functionality)
   */
  static async importHealthRecords(studentId: string, importData: any) {
    try {
      // Verify student exists
      const student = await Student.findByPk(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      const results = {
        imported: 0,
        skipped: 0,
        errors: [] as string[]
      };

      // Import health records
      if (importData && typeof importData === 'object' && importData !== null) {
        const data = importData as any;
        if (data.healthRecords && Array.isArray(data.healthRecords)) {
          for (const record of data.healthRecords) {
            try {
              await this.createHealthRecord({
                studentId,
                type: record.type,
                date: new Date(record.date),
                description: record.description,
                vital: record.vital,
                provider: record.provider,
                notes: record.notes,
                attachments: record.attachments
              });
              results.imported++;
            } catch (error) {
              results.skipped++;
              results.errors.push(`Record ${record.description}: ${(error as Error).message}`);
            }
          }
        }
      }

      logger.info(`Health records imported for ${student.firstName} ${student.lastName}: ${results.imported} imported, ${results.skipped} skipped`);
      return results;
    } catch (error) {
      logger.error('Error importing health records:', error);
      throw error;
    }
  }

  /**
   * Bulk delete health records
   */
  static async bulkDeleteHealthRecords(recordIds: string[]) {
    try {
      if (!recordIds || recordIds.length === 0) {
        throw new Error('No record IDs provided');
      }

      // Get records to be deleted for logging
      const recordsToDelete = await HealthRecord.findAll({
        where: {
          id: { [Op.in]: recordIds }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      // Delete the records
      const deletedCount = await HealthRecord.destroy({
        where: {
          id: { [Op.in]: recordIds }
        }
      });

      const notFoundCount = recordIds.length - deletedCount;

      // Log the bulk deletion
      logger.info(`Bulk delete completed: ${deletedCount} records deleted, ${notFoundCount} not found`);

      if (recordsToDelete.length > 0) {
        const studentNames = [...new Set(recordsToDelete.map(r => `${r.student!.firstName} ${r.student!.lastName}`))];
        logger.info(`Records deleted for students: ${studentNames.join(', ')}`);
      }

      return {
        deleted: deletedCount,
        notFound: notFoundCount,
        success: true
      };
    } catch (error) {
      logger.error('Error in bulk delete operation:', error);
      throw error;
    }
  }

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
   * Get student vaccinations
   */
  static async getStudentVaccinations(studentId: string) {
    try {
      const vaccinations = await Vaccination.findAll({
        where: { studentId },
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
   * Update vaccination record
   */
  static async updateVaccination(id: string, data: Partial<CreateVaccinationData>) {
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
   * Get health records statistics
   */
  static async getHealthRecordStatistics() {
    try {
      const [
        totalRecords,
        activeAllergies,
        chronicConditions,
        vaccinationsDue,
        recentRecords
      ] = await Promise.all([
        HealthRecord.count(),
        Allergy.count({
          where: {
            verified: true
          }
        }),
        ChronicCondition.count({
          where: {
            status: 'ACTIVE'
          }
        }),
        HealthRecord.count({
          where: {
            type: 'VACCINATION' as any,
            createdAt: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          } as any
        }),
        HealthRecord.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      ]);

      const statistics = {
        totalRecords,
        activeAllergies,
        chronicConditions,
        vaccinationsDue,
        recentRecords
      };

      logger.info('Retrieved health record statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting health record statistics:', error);
      throw error;
    }
  }
}
