import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

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
      const skip = (page - 1) * limit;
      
      const whereClause: any = { studentId };
      
      if (filters.type) {
        whereClause.type = filters.type;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        whereClause.date = {};
        if (filters.dateFrom) {
          whereClause.date.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.date.lte = filters.dateTo;
        }
      }
      
      if (filters.provider) {
        whereClause.provider = { contains: filters.provider, mode: 'insensitive' };
      }

      const [records, total] = await Promise.all([
        prisma.healthRecord.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true
              }
            }
          },
          orderBy: { date: 'desc' }
        }),
        prisma.healthRecord.count({ where: whereClause })
      ]);

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
      const student = await prisma.student.findUnique({
        where: { id: data.studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Calculate BMI if height and weight are provided in vitals
      if (data.vital && data.vital.height && data.vital.weight) {
        const heightInMeters = data.vital.height / 100; // Convert cm to meters
        const bmi = data.vital.weight / (heightInMeters * heightInMeters);
        data.vital.bmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place
      }

      const healthRecord = await prisma.healthRecord.create({
        data,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
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
      const existingRecord = await prisma.healthRecord.findUnique({
        where: { id },
        include: {
          student: true
        }
      });

      if (!existingRecord) {
        throw new Error('Health record not found');
      }

      // Recalculate BMI if height or weight is being updated
      if (data.vital) {
        const currentVitals = existingRecord.vital as any || {};
        const updatedVitals = { ...currentVitals, ...data.vital };
        
        if (updatedVitals.height && updatedVitals.weight) {
          const heightInMeters = updatedVitals.height / 100;
          const bmi = updatedVitals.weight / (heightInMeters * heightInMeters);
          updatedVitals.bmi = Math.round(bmi * 10) / 10;
        }
        
        data.vital = updatedVitals;
      }

      const healthRecord = await prisma.healthRecord.update({
        where: { id },
        data,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
      });

      logger.info(`Health record updated: ${healthRecord.type} for ${existingRecord.student.firstName} ${existingRecord.student.lastName}`);
      return healthRecord;
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
      const student = await prisma.student.findUnique({
        where: { id: data.studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Check if allergy already exists for this student
      const existingAllergy = await prisma.allergy.findFirst({
        where: {
          studentId: data.studentId,
          allergen: data.allergen
        }
      });

      if (existingAllergy) {
        throw new Error('Allergy already exists for this student');
      }

      const allergy = await prisma.allergy.create({
        data: {
          ...data,
          verifiedAt: data.verified ? new Date() : null
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
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
      const existingAllergy = await prisma.allergy.findUnique({
        where: { id },
        include: { student: true }
      });

      if (!existingAllergy) {
        throw new Error('Allergy not found');
      }

      // Update verification timestamp if being verified
      const updateData: any = { ...data };
      if (data.verified && !existingAllergy.verified) {
        updateData.verifiedAt = new Date();
      }

      const allergy = await prisma.allergy.update({
        where: { id },
        data: updateData,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
      });

      logger.info(`Allergy updated: ${allergy.allergen} for ${existingAllergy.student.firstName} ${existingAllergy.student.lastName}`);
      return allergy;
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
      const allergies = await prisma.allergy.findMany({
        where: { studentId },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        },
        orderBy: [
          { severity: 'desc' }, // Most severe first
          { allergen: 'asc' }
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
      const allergy = await prisma.allergy.findUnique({
        where: { id },
        include: { student: true }
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      await prisma.allergy.delete({
        where: { id }
      });

      logger.info(`Allergy deleted: ${allergy.allergen} for ${allergy.student.firstName} ${allergy.student.lastName}`);
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
      const records = await prisma.healthRecord.findMany({
        where: {
          studentId,
          type: 'VACCINATION'
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        },
        orderBy: { date: 'desc' }
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
      const records = await prisma.healthRecord.findMany({
        where: {
          studentId,
          vital: {
            path: ['height'],
            not: null
          }
        },
        select: {
          id: true,
          date: true,
          vital: true,
          type: true
        },
        orderBy: { date: 'asc' }
      });

      // Extract height and weight data points
      const growthData = records
        .map((record: any) => {
          const vital = record.vital as any;
          return {
            date: record.date,
            height: vital?.height,
            weight: vital?.weight,
            bmi: vital?.bmi,
            recordType: record.type
          };
        })
        .filter((data: any) => data.height || data.weight);

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
      const records = await prisma.healthRecord.findMany({
        where: {
          studentId,
          vital: {
            not: null
          }
        },
        select: {
          id: true,
          date: true,
          vital: true,
          type: true,
          provider: true
        },
        orderBy: { date: 'desc' },
        take: limit
      });

      return records.map((record: any) => ({
        ...record,
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
        prisma.student.findUnique({
          where: { id: studentId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentNumber: true,
            dateOfBirth: true,
            gender: true
          }
        }),
        this.getStudentAllergies(studentId),
        this.getRecentVitals(studentId, 5),
        this.getVaccinationRecords(studentId)
      ]);

      if (!student) {
        throw new Error('Student not found');
      }

      const recordCounts = await prisma.healthRecord.groupBy({
        by: ['type'],
        where: { studentId },
        _count: { type: true }
      });

      return {
        student,
        allergies,
        recentVitals: recentRecords,
        recentVaccinations: vaccinations.slice(0, 5),
        recordCounts: recordCounts.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = curr._count.type;
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
      const skip = (page - 1) * limit;
      
      const whereClause: any = {
        OR: [
          { description: { contains: query, mode: 'insensitive' } },
          { notes: { contains: query, mode: 'insensitive' } },
          { provider: { contains: query, mode: 'insensitive' } },
          {
            student: {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { studentNumber: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        ]
      };

      if (type) {
        whereClause.type = type;
      }

      const [records, total] = await Promise.all([
        prisma.healthRecord.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true,
                grade: true
              }
            }
          },
          orderBy: { date: 'desc' }
        }),
        prisma.healthRecord.count({ where: whereClause })
      ]);

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
}