/**
 * LOC: 6F1A9C4E27
 * WC-SVC-HLT-VIT | vitals.module.ts - Vital Signs and Growth Tracking Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Vital signs tracking and growth chart data management
 * Exports: VitalsModule class for vital signs and growth measurements
 * HIPAA: Contains PHI - vital signs, height, weight, BMI data
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Vital retrieval → Growth tracking → BMI calculation → Data analysis
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import { VitalSigns, GrowthDataPoint } from './types';

/**
 * Vitals Module
 * Manages vital signs tracking and growth chart data for students
 */
export class VitalsModule {
  /**
   * Get growth chart data for a student
   */
  static async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
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
  static async getRecentVitals(studentId: string, limit: number = 10): Promise<any[]> {
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
   * Get comprehensive health summary for a student
   * Combines vital signs, allergies, vaccinations, and record counts
   */
  static async getHealthSummary(studentId: string): Promise<any> {
    try {
      // Import other modules dynamically to avoid circular dependencies
      const { AllergyModule } = await import('./allergy.module');
      const { HealthRecordModule } = await import('./healthRecord.module');
      const { sequelize } = await import('../../database/models');

      const [student, allergies, recentRecords, vaccinations] = await Promise.all([
        Student.findByPk(studentId, {
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth', 'gender']
        }),
        AllergyModule.getStudentAllergies(studentId),
        this.getRecentVitals(studentId, 5),
        HealthRecordModule.getVaccinationRecords(studentId)
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
}
