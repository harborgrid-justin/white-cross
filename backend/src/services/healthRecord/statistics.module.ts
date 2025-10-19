/**
 * LOC: 9C5A3E2D17
 * WC-SVC-HLT-STA | statistics.module.ts - Health Record Statistics and Analytics Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Analytics and statistical reporting for health records
 * Exports: StatisticsModule class with aggregation and reporting functions
 * HIPAA: Contains aggregated PHI data - ensure de-identification where required
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Data aggregation → Statistics calculation → Reporting
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Allergy, ChronicCondition } from '../../database/models';
import { HealthRecordStatistics } from './types';

/**
 * Statistics Module
 * Provides analytics and statistical reporting for health records
 */
export class StatisticsModule {
  /**
   * Get comprehensive health record statistics
   */
  static async getHealthRecordStatistics(): Promise<HealthRecordStatistics> {
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

      const statistics: HealthRecordStatistics = {
        totalRecords,
        activeAllergies,
        chronicConditions,
        vaccinationsDue,
        recentRecords
      };

      logger.info('Retrieved health record statistics', statistics);
      return statistics;
    } catch (error) {
      logger.error('Error getting health record statistics:', error);
      throw error;
    }
  }

  /**
   * Get record type distribution
   */
  static async getRecordTypeDistribution(): Promise<Record<string, number>> {
    try {
      const { sequelize } = await import('../../database/models');

      const distribution = await HealthRecord.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('type')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const result = distribution.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.type] = parseInt(curr.count, 10);
        return acc;
      }, {});

      logger.info('Retrieved record type distribution', result);
      return result;
    } catch (error) {
      logger.error('Error getting record type distribution:', error);
      throw error;
    }
  }

  /**
   * Get allergy severity distribution
   */
  static async getAllergySeverityDistribution(): Promise<Record<string, number>> {
    try {
      const { sequelize } = await import('../../database/models');

      const distribution = await Allergy.findAll({
        attributes: [
          'severity',
          [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
        ],
        group: ['severity'],
        raw: true
      });

      const result = distribution.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.severity] = parseInt(curr.count, 10);
        return acc;
      }, {});

      logger.info('Retrieved allergy severity distribution', result);
      return result;
    } catch (error) {
      logger.error('Error getting allergy severity distribution:', error);
      throw error;
    }
  }

  /**
   * Get chronic condition statistics
   */
  static async getChronicConditionStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    try {
      const { sequelize } = await import('../../database/models');

      const [total, statusDistribution, severityDistribution] = await Promise.all([
        ChronicCondition.count(),
        ChronicCondition.findAll({
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        ChronicCondition.findAll({
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        })
      ]);

      const byStatus = statusDistribution.reduce(
        (acc: Record<string, number>, curr: any) => {
          acc[curr.status] = parseInt(curr.count, 10);
          return acc;
        },
        {}
      );

      const bySeverity = severityDistribution.reduce(
        (acc: Record<string, number>, curr: any) => {
          acc[curr.severity] = parseInt(curr.count, 10);
          return acc;
        },
        {}
      );

      logger.info('Retrieved chronic condition statistics', { total, byStatus, bySeverity });
      return { total, byStatus, bySeverity };
    } catch (error) {
      logger.error('Error getting chronic condition statistics:', error);
      throw error;
    }
  }

  /**
   * Get health records trend over time
   */
  static async getHealthRecordsTrend(
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' = 'month'
  ): Promise<any[]> {
    try {
      const { sequelize } = await import('../../database/models');

      let dateFormat: string;
      switch (interval) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-W%V';
          break;
        case 'month':
        default:
          dateFormat = '%Y-%m';
          break;
      }

      const trend = await HealthRecord.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('date'), dateFormat), 'period'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), dateFormat)],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), dateFormat), 'ASC']],
        raw: true
      });

      logger.info(
        `Retrieved health records trend from ${startDate.toISOString()} to ${endDate.toISOString()}`
      );
      return trend;
    } catch (error) {
      logger.error('Error getting health records trend:', error);
      throw error;
    }
  }

  /**
   * Get top conditions by frequency
   */
  static async getTopConditionsByFrequency(limit: number = 10): Promise<any[]> {
    try {
      const { sequelize } = await import('../../database/models');

      const topConditions = await ChronicCondition.findAll({
        attributes: [
          'condition',
          [sequelize.fn('COUNT', sequelize.col('condition')), 'count']
        ],
        group: ['condition'],
        order: [[sequelize.fn('COUNT', sequelize.col('condition')), 'DESC']],
        limit,
        raw: true
      });

      logger.info(`Retrieved top ${limit} conditions by frequency`);
      return topConditions;
    } catch (error) {
      logger.error('Error getting top conditions by frequency:', error);
      throw error;
    }
  }

  /**
   * Get vaccination compliance statistics
   */
  static async getVaccinationComplianceStats(): Promise<{
    totalVaccinations: number;
    recentVaccinations: number;
    seriesComplete: number;
    seriesIncomplete: number;
  }> {
    try {
      const { Vaccination } = await import('../../database/models');

      const [
        totalVaccinations,
        recentVaccinations,
        seriesComplete,
        seriesIncomplete
      ] = await Promise.all([
        Vaccination.count(),
        Vaccination.count({
          where: {
            administrationDate: {
              [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          }
        }),
        Vaccination.count({
          where: {
            seriesComplete: true
          }
        }),
        Vaccination.count({
          where: {
            seriesComplete: false
          }
        })
      ]);

      logger.info('Retrieved vaccination compliance statistics');
      return {
        totalVaccinations,
        recentVaccinations,
        seriesComplete,
        seriesIncomplete
      };
    } catch (error) {
      logger.error('Error getting vaccination compliance statistics:', error);
      throw error;
    }
  }
}
