import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Student,
  sequelize
} from '../database/models';

export interface CreateHealthRecordData {
  studentId: string;
  type: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING';
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
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface CreateChronicConditionData {
  studentId: string;
  condition: string;
  diagnosedDate: Date;
  status?: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
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
   * Create new health record
   */
  static async createHealthRecord(data: CreateHealthRecordData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Calculate BMI if height and weight are provided in vitals
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const vitals = data.vital as any;
        if (vitals.height && vitals.weight) {
          const heightInMeters = vitals.height / 100; // Convert cm to meters
          const bmi = vitals.weight / (heightInMeters * heightInMeters);
          vitals.bmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place
          data.vital = vitals;
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
   * Update health record
   */
  static async updateHealthRecord(id: string, data: Partial<CreateHealthRecordData>) {
    try {
      const existingRecord = await HealthRecord.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student'
          }
        ]
      });

      if (!existingRecord) {
        throw new Error('Health record not found');
      }

      // Recalculate BMI if height or weight is being updated
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const currentVitals = (existingRecord.vital && typeof existingRecord.vital === 'object' && existingRecord.vital !== null)
          ? existingRecord.vital as any
          : {};
        const vitalsUpdate = data.vital as any;
        const updatedVitals = { ...currentVitals, ...vitalsUpdate };

        if (updatedVitals.height && updatedVitals.weight) {
          const heightInMeters = updatedVitals.height / 100;
          const bmi = updatedVitals.weight / (heightInMeters * heightInMeters);
          updatedVitals.bmi = Math.round(bmi * 10) / 10;
        }

        data.vital = updatedVitals;
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
   * Add allergy to student
   */
  static async addAllergy(data: CreateAllergyData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Check if allergy already exists for this student
      const existingAllergy = await Allergy.findOne({
        where: {
          studentId: data.studentId,
          allergen: data.allergen
        }
      });

      if (existingAllergy) {
        throw new Error('Allergy already exists for this student');
      }

      const allergy = await Allergy.create({
        ...data,
        verifiedAt: data.verified ? new Date() : null
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
          type: 'VACCINATION'
        },
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
        },
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
        },
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
   * Add chronic condition to student
   */
  static async addChronicCondition(data: CreateChronicConditionData) {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      const chronicCondition = await ChronicCondition.create({
        ...data,
        status: data.status || 'ACTIVE',
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

      logger.info(`Chronic condition added: ${data.condition} for ${student.firstName} ${student.lastName}`);
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
            type: 'VACCINATION',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          }
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
