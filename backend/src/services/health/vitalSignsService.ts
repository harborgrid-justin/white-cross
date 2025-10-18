/**
 * WC-GEN-259 | vitalSignsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import { VitalSigns, GrowthDataPoint } from './types';
import { validateVitalSigns, calculateBMI } from '../../utils/healthRecordValidators';

/**
 * Vital Signs Service - Manages vital signs data and growth tracking
 */
export class VitalSignsService {
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
        attributes: ['id', 'recordDate', 'vital', 'recordType', 'provider'],
        order: [['recordDate', 'DESC']],
        limit
      });

      return records.map((record) => ({
        ...record.get({ plain: true }),
        date: record.recordDate,
        type: record.recordType,
        vital: record.vital as VitalSigns
      }));
    } catch (error) {
      logger.error('Error fetching recent vitals:', error);
      throw error;
    }
  }

  /**
   * Get growth chart data for a student
   */
  static async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
    try {
      const records = await HealthRecord.findAll({
        where: {
          studentId,
          vital: { [Op.ne]: null }
        } as any,
        attributes: ['id', 'recordDate', 'vital', 'recordType'],
        order: [['recordDate', 'ASC']]
      });

      // Extract height and weight data points
      const growthData = records
        .map((record): GrowthDataPoint => {
          const vital = record.vital as any;
          return {
            date: record.recordDate,
            height: vital?.height,
            weight: vital?.weight,
            bmi: vital?.bmi,
            recordType: record.recordType
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
   * Add vital signs to an existing health record
   */
  static async addVitalSigns(recordId: string, vitals: VitalSigns) {
    try {
      const healthRecord = await HealthRecord.findByPk(recordId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
          }
        ]
      });

      if (!healthRecord) {
        throw new Error('Health record not found');
      }

      // Validate vital signs
      const validationResult = validateVitalSigns(
        vitals,
        healthRecord.student?.dateOfBirth ? new Date(healthRecord.student.dateOfBirth) : undefined
      );

      if (validationResult.warnings.length > 0) {
        logger.warn(`Vital signs validation warnings for record ${recordId}:`, validationResult.warnings);
      }

      if (!validationResult.isValid) {
        throw new Error(`Vital signs validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Calculate BMI if height and weight are provided
      const processedVitals = { ...vitals };
      if (vitals.height && vitals.weight) {
        const calculatedBMI = calculateBMI(vitals.height, vitals.weight);
        if (calculatedBMI !== null) {
          processedVitals.bmi = calculatedBMI;
          logger.info(`Auto-calculated BMI: ${calculatedBMI} for record ${recordId}`);
        }
      }

      // Merge with existing vitals if any
      const existingVitals = (healthRecord.vital && typeof healthRecord.vital === 'object') 
        ? healthRecord.vital as VitalSigns 
        : {};
      
      const mergedVitals = { ...existingVitals, ...processedVitals };

      await healthRecord.update({ vital: mergedVitals });

      logger.info(`Vital signs added to record ${recordId} for ${healthRecord.student!.firstName} ${healthRecord.student!.lastName}`);
      return healthRecord;
    } catch (error) {
      logger.error('Error adding vital signs:', error);
      throw error;
    }
  }

  /**
   * Update vital signs in an existing health record
   */
  static async updateVitalSigns(recordId: string, vitals: Partial<VitalSigns>) {
    try {
      const healthRecord = await HealthRecord.findByPk(recordId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
          }
        ]
      });

      if (!healthRecord) {
        throw new Error('Health record not found');
      }

      // Get existing vitals
      const existingVitals = (healthRecord.vital && typeof healthRecord.vital === 'object') 
        ? healthRecord.vital as VitalSigns 
        : {};

      // Merge updates with existing vitals
      const updatedVitals = { ...existingVitals, ...vitals };

      // Validate merged vitals
      const validationResult = validateVitalSigns(
        updatedVitals,
        healthRecord.student?.dateOfBirth ? new Date(healthRecord.student.dateOfBirth) : undefined
      );

      if (validationResult.warnings.length > 0) {
        logger.warn(`Vital signs update validation warnings for record ${recordId}:`, validationResult.warnings);
      }

      if (!validationResult.isValid) {
        throw new Error(`Vital signs validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Recalculate BMI if height or weight changed
      if (updatedVitals.height && updatedVitals.weight) {
        const calculatedBMI = calculateBMI(updatedVitals.height, updatedVitals.weight);
        if (calculatedBMI !== null) {
          updatedVitals.bmi = calculatedBMI;
          logger.info(`Auto-recalculated BMI: ${calculatedBMI} for record ${recordId}`);
        }
      }

      await healthRecord.update({ vital: updatedVitals });

      logger.info(`Vital signs updated for record ${recordId} for ${healthRecord.student!.firstName} ${healthRecord.student!.lastName}`);
      return healthRecord;
    } catch (error) {
      logger.error('Error updating vital signs:', error);
      throw error;
    }
  }

  /**
   * Get vital signs trends for a student over time
   */
  static async getVitalSignsTrends(
    studentId: string, 
    vitalType: keyof VitalSigns,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const whereClause: any = {
        studentId,
        [`vital.${vitalType}`]: { [Op.ne]: null }
      };

      if (startDate || endDate) {
        whereClause.recordDate = {};
        if (startDate) {
          whereClause.recordDate[Op.gte] = startDate;
        }
        if (endDate) {
          whereClause.recordDate[Op.lte] = endDate;
        }
      }

      const records = await HealthRecord.findAll({
        where: whereClause,
        attributes: ['id', 'recordDate', 'vital', 'recordType', 'provider'],
        order: [['recordDate', 'ASC']]
      });

      const trends = records.map(record => {
        const vital = record.vital as VitalSigns;
        return {
          date: record.recordDate,
          value: vital[vitalType],
          recordType: record.recordType,
          provider: record.provider,
          recordId: record.id
        };
      }).filter(trend => trend.value !== null && trend.value !== undefined);

      return trends;
    } catch (error) {
      logger.error(`Error fetching ${vitalType} trends:`, error);
      throw error;
    }
  }

  /**
   * Get BMI percentile data for a student (requires age calculation)
   */
  static async getBMIPercentileData(studentId: string) {
    try {
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender']
      });

      if (!student || !student.dateOfBirth) {
        throw new Error('Student not found or missing date of birth');
      }

      const bmiRecords = await this.getVitalSignsTrends(studentId, 'bmi');

      // Calculate age at each BMI measurement
      const bmiWithAge = bmiRecords.map(record => {
        const ageAtMeasurement = this.calculateAgeAtDate(
          new Date(student.dateOfBirth),
          new Date(record.date)
        );

        return {
          ...record,
          ageInMonths: ageAtMeasurement.months,
          ageInYears: ageAtMeasurement.years
        };
      });

      return {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          gender: student.gender
        },
        bmiData: bmiWithAge
      };
    } catch (error) {
      logger.error('Error fetching BMI percentile data:', error);
      throw error;
    }
  }

  /**
   * Get vital signs statistics for a student
   */
  static async getVitalSignsStatistics(studentId: string) {
    try {
      const vitalsRecords = await this.getRecentVitals(studentId, 100); // Get more records for better statistics

      if (vitalsRecords.length === 0) {
        return {
          totalRecords: 0,
          dateRange: null,
          statistics: {}
        };
      }

      const vitalTypes: (keyof VitalSigns)[] = [
        'temperature',
        'bloodPressureSystolic',
        'bloodPressureDiastolic',
        'heartRate',
        'respiratoryRate',
        'oxygenSaturation',
        'height',
        'weight',
        'bmi'
      ];

      const statistics: Record<string, any> = {};

      vitalTypes.forEach(vitalType => {
        const values = vitalsRecords
          .map(record => record.vital[vitalType])
          .filter(value => value !== null && value !== undefined && !isNaN(value));

        if (values.length > 0) {
          statistics[vitalType] = {
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            average: values.reduce((sum, val) => sum + val, 0) / values.length,
            latest: vitalsRecords[0].vital[vitalType] // First record is most recent
          };
        }
      });

      return {
        totalRecords: vitalsRecords.length,
        dateRange: {
          from: vitalsRecords[vitalsRecords.length - 1].date,
          to: vitalsRecords[0].date
        },
        statistics
      };
    } catch (error) {
      logger.error('Error calculating vital signs statistics:', error);
      throw error;
    }
  }

  /**
   * Identify abnormal vital signs based on age-appropriate ranges
   */
  static async getAbnormalVitals(studentId: string, limit: number = 20) {
    try {
      const student = await Student.findByPk(studentId, {
        attributes: ['dateOfBirth', 'firstName', 'lastName']
      });

      if (!student || !student.dateOfBirth) {
        throw new Error('Student not found or missing date of birth');
      }

      const recentVitals = await this.getRecentVitals(studentId, limit);
      const abnormalVitals = [];

      for (const record of recentVitals) {
        const vital = record.vital;
        const ageAtMeasurement = this.calculateAgeAtDate(
          new Date(student.dateOfBirth),
          new Date(record.date)
        );

        const abnormalities = this.checkVitalSignsForAbnormalities(vital, ageAtMeasurement.years);

        if (abnormalities.length > 0) {
          abnormalVitals.push({
            ...record,
            abnormalities,
            ageAtMeasurement: ageAtMeasurement.years
          });
        }
      }

      return abnormalVitals;
    } catch (error) {
      logger.error('Error identifying abnormal vitals:', error);
      throw error;
    }
  }

  /**
   * Helper method to calculate age at a specific date
   */
  private static calculateAgeAtDate(birthDate: Date, measurementDate: Date) {
    const ageInMs = measurementDate.getTime() - birthDate.getTime();
    const ageInYears = ageInMs / (365.25 * 24 * 60 * 60 * 1000);
    const ageInMonths = ageInYears * 12;

    return {
      years: Math.floor(ageInYears),
      months: Math.floor(ageInMonths)
    };
  }

  /**
   * Helper method to check for abnormal vital signs based on age
   */
  private static checkVitalSignsForAbnormalities(vitals: VitalSigns, ageInYears: number) {
    const abnormalities: string[] = [];

    // Age-appropriate vital sign ranges (simplified - in real implementation, 
    // you would use more comprehensive pediatric reference ranges)
    const ranges = this.getAgeAppropriateVitalRanges(ageInYears);

    if (vitals.temperature !== undefined) {
      if (vitals.temperature < ranges.temperature.min || vitals.temperature > ranges.temperature.max) {
        abnormalities.push(`Temperature: ${vitals.temperature}°F (normal: ${ranges.temperature.min}-${ranges.temperature.max}°F)`);
      }
    }

    if (vitals.heartRate !== undefined) {
      if (vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max) {
        abnormalities.push(`Heart Rate: ${vitals.heartRate} bpm (normal: ${ranges.heartRate.min}-${ranges.heartRate.max} bpm)`);
      }
    }

    if (vitals.bloodPressureSystolic !== undefined && vitals.bloodPressureDiastolic !== undefined) {
      if (vitals.bloodPressureSystolic > ranges.bloodPressure.systolic.max || 
          vitals.bloodPressureDiastolic > ranges.bloodPressure.diastolic.max) {
        abnormalities.push(`Blood Pressure: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg (elevated)`);
      }
    }

    if (vitals.respiratoryRate !== undefined) {
      if (vitals.respiratoryRate < ranges.respiratoryRate.min || vitals.respiratoryRate > ranges.respiratoryRate.max) {
        abnormalities.push(`Respiratory Rate: ${vitals.respiratoryRate} rpm (normal: ${ranges.respiratoryRate.min}-${ranges.respiratoryRate.max} rpm)`);
      }
    }

    if (vitals.oxygenSaturation !== undefined) {
      if (vitals.oxygenSaturation < ranges.oxygenSaturation.min) {
        abnormalities.push(`Oxygen Saturation: ${vitals.oxygenSaturation}% (low, normal: >${ranges.oxygenSaturation.min}%)`);
      }
    }

    return abnormalities;
  }

  /**
   * Helper method to get age-appropriate vital sign ranges
   */
  private static getAgeAppropriateVitalRanges(ageInYears: number) {
    // Simplified ranges - in production, use comprehensive pediatric reference data
    if (ageInYears < 1) {
      return {
        temperature: { min: 97.0, max: 100.4 },
        heartRate: { min: 100, max: 160 },
        respiratoryRate: { min: 30, max: 60 },
        bloodPressure: { systolic: { max: 87 }, diastolic: { max: 55 } },
        oxygenSaturation: { min: 95 }
      };
    } else if (ageInYears < 3) {
      return {
        temperature: { min: 97.0, max: 100.4 },
        heartRate: { min: 90, max: 150 },
        respiratoryRate: { min: 24, max: 40 },
        bloodPressure: { systolic: { max: 95 }, diastolic: { max: 62 } },
        oxygenSaturation: { min: 95 }
      };
    } else if (ageInYears < 6) {
      return {
        temperature: { min: 97.0, max: 100.4 },
        heartRate: { min: 80, max: 140 },
        respiratoryRate: { min: 22, max: 35 },
        bloodPressure: { systolic: { max: 101 }, diastolic: { max: 65 } },
        oxygenSaturation: { min: 95 }
      };
    } else if (ageInYears < 12) {
      return {
        temperature: { min: 97.0, max: 100.4 },
        heartRate: { min: 70, max: 120 },
        respiratoryRate: { min: 18, max: 30 },
        bloodPressure: { systolic: { max: 108 }, diastolic: { max: 71 } },
        oxygenSaturation: { min: 95 }
      };
    } else {
      // Adolescent/Adult ranges
      return {
        temperature: { min: 97.0, max: 100.4 },
        heartRate: { min: 60, max: 100 },
        respiratoryRate: { min: 12, max: 20 },
        bloodPressure: { systolic: { max: 120 }, diastolic: { max: 80 } },
        oxygenSaturation: { min: 95 }
      };
    }
  }
}
