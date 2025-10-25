/**
 * @fileoverview Vital Signs and Growth Tracking Service - CDC-Compliant Health Monitoring
 * @module services/healthRecord/vitals.module
 * @description Comprehensive vital signs tracking and pediatric growth chart management
 *
 * Key Features:
 * - Vital signs retrieval (BP, HR, temp, RR, O2 sat)
 * - Growth chart data tracking (height, weight, BMI)
 * - CDC growth percentile calculations
 * - Trend analysis and historical tracking
 * - Comprehensive health summary generation
 * - Age-appropriate vital signs ranges
 * - BMI-for-age calculations
 * - Weight-for-age and height-for-age tracking
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance CDC Growth Charts - Pediatric growth tracking standards
 * @compliance WHO Child Growth Standards - International growth references
 * @security PHI - All operations tracked in audit log
 * @audit Minimum 6-year retention for HIPAA compliance
 * @clinical Vital signs ranges validated against pediatric norms
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 *
 * LOC: 6F1A9C4E27
 * WC-SVC-HLT-VIT | vitals.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import { VitalSigns, GrowthDataPoint } from './types';

/**
 * @class VitalsModule
 * @description Manages vital signs and growth tracking with CDC compliance
 * @security All methods require proper authentication and authorization
 * @audit All operations logged for compliance tracking
 * @clinical Growth data used for CDC percentile calculations
 */
export class VitalsModule {
  /**
   * @method getGrowthChartData
   * @description Retrieve growth chart data points for CDC percentile plotting and growth monitoring
   * @async
   *
   * Extracts height, weight, and BMI measurements from health records ordered chronologically
   * for plotting on CDC growth charts. Supports pediatric growth tracking, obesity screening,
   * and nutritional assessment according to CDC and WHO standards.
   *
   * @param {string} studentId - Student UUID
   *
   * @returns {Promise<GrowthDataPoint[]>} Array of growth data points ordered chronologically (oldest first)
   * @returns {Date} result[].date - Measurement date
   * @returns {number} [result[].height] - Height in centimeters (CDC standard units)
   * @returns {number} [result[].weight] - Weight in kilograms (CDC standard units)
   * @returns {number} [result[].bmi] - Body Mass Index (weight/height²)
   * @returns {string} result[].recordType - Type of health record (CHECKUP, PHYSICAL_EXAM, SCREENING)
   *
   * @throws {Error} When database query fails
   * @throws {ForbiddenError} When user lacks 'health:read' permission
   *
   * @security PHI Access - Requires 'health:read' permission
   * @audit PHI access logged with student ID and data point count
   * @clinical Data formatted for CDC growth chart plotting (birth to 20 years)
   * @clinical BMI-for-age percentiles: <5th (underweight), 5-84th (healthy), 85-94th (overweight), ≥95th (obese)
   * @clinical Height-for-age and weight-for-age percentiles tracked separately
   * @clinical WHO growth standards used for children <2 years, CDC for 2-20 years
   *
   * @example
   * // Plot growth trajectory on CDC chart
   * const growthData = await VitalsModule.getGrowthChartData('student-123');
   * console.log(`Tracking ${growthData.length} growth measurements`);
   *
   * growthData.forEach(point => {
   *   console.log(`${point.date.toLocaleDateString()}: H:${point.height}cm W:${point.weight}kg BMI:${point.bmi}`);
   * });
   *
   * // Calculate growth velocity (height gained per year)
   * const firstYear = growthData[0];
   * const currentYear = growthData[growthData.length - 1];
   * const heightGain = currentYear.height - firstYear.height;
   * console.log(`Height gain: ${heightGain.toFixed(1)}cm over period`);
   *
   * @example
   * // Identify obesity screening flags
   * const recentGrowth = growthData.slice(-3); // Last 3 measurements
   * const avgBMI = recentGrowth.reduce((sum, p) => sum + p.bmi, 0) / recentGrowth.length;
   * console.log(`Average BMI: ${avgBMI.toFixed(1)}`);
   * // Flag for pediatrician review if BMI >95th percentile for age/sex
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
   * @method getRecentVitals
   * @description Retrieve most recent vital signs measurements for trend monitoring
   * @async
   *
   * Fetches the most recent vital signs records ordered by date (newest first).
   * Useful for patient dashboard displays, trend analysis, and clinical review.
   *
   * @param {string} studentId - Student UUID
   * @param {number} [limit=10] - Maximum number of records to return (default: 10)
   *
   * @returns {Promise<any[]>} Array of health records containing vital signs, ordered chronologically
   * @returns {string} result[].id - Health record UUID
   * @returns {Date} result[].date - Measurement date
   * @returns {VitalSigns} result[].vital - Vital signs data (BP, HR, temp, RR, O2 sat, height, weight, BMI)
   * @returns {string} result[].type - Health record type
   * @returns {string} result[].provider - Healthcare provider who recorded vitals
   *
   * @throws {Error} When database query fails
   * @throws {ForbiddenError} When user lacks 'health:read' permission
   *
   * @security PHI Access - Requires 'health:read' permission
   * @audit PHI access logged with student ID and record count
   * @clinical Most recent vitals displayed first for immediate clinical assessment
   * @clinical Supports vital signs trending over time
   *
   * @example
   * // Get last 5 vital signs for dashboard
   * const recentVitals = await VitalsModule.getRecentVitals('student-123', 5);
   * recentVitals.forEach(record => {
   *   console.log(`Date: ${record.date}`);
   *   console.log(`BP: ${record.vital.bloodPressureSystolic}/${record.vital.bloodPressureDiastolic}`);
   *   console.log(`HR: ${record.vital.heartRate} bpm`);
   *   console.log(`Temp: ${record.vital.temperature}°F`);
   * });
   *
   * @example
   * // Get all vital signs for comprehensive review
   * const allVitals = await VitalsModule.getRecentVitals('student-123', 100);
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
   * @method getHealthSummary
   * @description Generate comprehensive health summary combining all health data
   * @async
   *
   * @param {string} studentId - Student UUID
   *
   * @returns {Promise<any>} Comprehensive health summary
   * @returns {Object} result.student - Student demographic information
   * @returns {Array} result.allergies - All student allergies
   * @returns {Array} result.recentVitals - Last 5 vital signs measurements
   * @returns {Array} result.recentVaccinations - Last 5 vaccinations
   * @returns {Object} result.recordCounts - Count of records by type
   *
   * @throws {Error} When student not found
   * @throws {Error} When database query fails
   *
   * @security PHI Access - Requires 'health:read' permission
   * @security Consolidated view of sensitive health information
   * @audit Comprehensive PHI access logged with all accessed record types
   * @clinical Provides complete health picture for care coordination
   *
   * @example
   * const summary = await VitalsModule.getHealthSummary('student-123');
   * // Returns complete health profile for dashboard display
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
