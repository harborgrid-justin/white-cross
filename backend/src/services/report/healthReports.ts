/**
 * LOC: 1EB0403DEA
 * WC-GEN-293 | healthReports.ts - Health trends and analytics
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (services/report/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/report/index.ts)
 */

/**
 * WC-GEN-293 | healthReports.ts - Health trends and analytics
 * Purpose: Generate health trend analysis reports including chronic conditions, allergies, and temporal patterns
 * Upstream: ../utils/logger, ../database/models, ./types | Dependencies: sequelize
 * Downstream: Report service index | Called by: ReportService
 * Related: Health records, chronic conditions, allergies
 * Exports: HealthReportsModule | Key Services: Health trend analysis
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Query execution → Data aggregation → Report generation
 * LLM Context: HIPAA-compliant health trend reporting for school nurse platform
 */

import { Op, fn, col, literal, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  sequelize,
  HealthRecord,
  Allergy,
  ChronicCondition
} from '../../database/models';
import {
  HealthRecordType,
  AllergySeverity
} from '../../database/types/enums';
import { HealthTrendsReport } from './types';

/**
 * Health Reports Module
 * Handles health trend analysis, chronic condition tracking, and allergy reporting
 */
export class HealthReportsModule {
  /**
   * Get comprehensive health trends with grouping and monthly analysis
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Aggregated health trend data
   * @throws Error if database query fails
   */
  static async getHealthTrends(startDate?: Date, endDate?: Date): Promise<HealthTrendsReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = startDate;
        if (endDate) whereClause.createdAt[Op.lte] = endDate;
      }

      // Get health records summary grouped by type
      const healthRecordsRaw = await HealthRecord.findAll({
        where: whereClause,
        attributes: [
          'type',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const healthRecords = healthRecordsRaw.map((record: any) => ({
        type: record.type as HealthRecordType,
        count: parseInt(record.count, 10)
      }));

      // Get chronic conditions trends (top 10)
      const chronicConditionsRaw = await ChronicCondition.findAll({
        attributes: [
          'condition',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['condition'],
        order: [[literal('count'), 'DESC']],
        limit: 10,
        raw: true
      });

      const chronicConditions = chronicConditionsRaw.map((record: any) => ({
        condition: record.condition,
        count: parseInt(record.count, 10)
      }));

      // Get allergies summary (top 10)
      const allergiesRaw = await Allergy.findAll({
        attributes: [
          'allergen',
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['allergen', 'severity'],
        order: [[literal('"count"'), 'DESC']],
        limit: 10,
        raw: true
      });

      const allergies = allergiesRaw.map((record: any) => ({
        allergen: record.allergen,
        severity: record.severity as AllergySeverity,
        count: parseInt(record.count, 10)
      }));

      // Get monthly health record trends using raw SQL for date truncation
      const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 12 months ago
      const defaultEndDate = endDate || new Date();

      const monthlyTrendsRaw = await sequelize.query<{
        month: Date;
        type: HealthRecordType;
        count: number;
      }>(
        `SELECT
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*)::integer as count
        FROM health_records
        WHERE "createdAt" >= :startDate
          AND "createdAt" <= :endDate
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          replacements: {
            startDate: defaultStartDate,
            endDate: defaultEndDate
          },
          type: QueryTypes.SELECT
        }
      );

      const monthlyTrends = monthlyTrendsRaw.map(record => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10)
      }));

      logger.info(`Health trends report generated: ${healthRecords.length} record types, ${chronicConditions.length} conditions, ${allergies.length} allergens`);

      return {
        healthRecords,
        chronicConditions,
        allergies,
        monthlyTrends
      };
    } catch (error) {
      logger.error('Error getting health trends:', error);
      throw error;
    }
  }
}
