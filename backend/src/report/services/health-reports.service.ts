import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { col, fn, literal, Op, QueryTypes, Sequelize } from 'sequelize';
import { HealthRecord } from '../../database/models/health-record.model';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { Allergy } from '../../database/models/allergy.model';
import { HealthTrendsReport } from '../interfaces/report-types.interface';
import { HealthTrendsDto } from '../dto/health-trends.dto';
import { AllergySeverity, HealthRecordType } from '../../common/enums';

import { BaseService } from '../../common/base';
/**
 * Health Reports Service
 * Handles health trend analysis, chronic condition tracking, and allergy reporting
 */
@Injectable()
export class HealthReportsService extends BaseService {
  constructor(
    @InjectModel(HealthRecord)
    private healthRecordModel: typeof HealthRecord,
    @InjectModel(ChronicCondition)
    private chronicConditionModel: typeof ChronicCondition,
    @InjectModel(Allergy)
    private allergyModel: typeof Allergy,
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  /**
   * Get comprehensive health trends with grouping and monthly analysis
   */
  async getHealthTrends(dto: HealthTrendsDto): Promise<HealthTrendsReport> {
    try {
      const { startDate, endDate, recordType } = dto;
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate && endDate) {
          whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
          whereClause.createdAt = { [Op.gte]: startDate };
        } else if (endDate) {
          whereClause.createdAt = { [Op.lte]: endDate };
        }
      }

      if (recordType) {
        whereClause.type = recordType;
      }

      // Get health records summary grouped by type
      const healthRecordsRaw = await this.healthRecordModel.findAll({
        where: whereClause,
        attributes: ['type', [fn('COUNT', col('id')), 'count']],
        group: ['type'],
        raw: true,
      });

      const healthRecords = healthRecordsRaw.map((record: any) => ({
        type: record.type as HealthRecordType,
        count: parseInt(record.count, 10),
      }));

      // Get chronic conditions trends (top 10)
      const chronicConditionsRaw = await this.chronicConditionModel.findAll({
        attributes: ['condition', [fn('COUNT', col('id')), 'count']],
        group: ['condition'],
        order: [[literal('count'), 'DESC']],
        limit: 10,
        raw: true,
      });

      const chronicConditions = chronicConditionsRaw.map((record: any) => ({
        condition: record.condition,
        count: parseInt(record.count, 10),
      }));

      // Get allergies summary (top 10)
      const allergiesRaw = await this.allergyModel.findAll({
        attributes: ['allergen', 'severity', [fn('COUNT', col('id')), 'count']],
        group: ['allergen', 'severity'],
        order: [[literal('count'), 'DESC']],
        limit: 10,
        raw: true,
      });

      const allergies = allergiesRaw.map((record: any) => ({
        allergen: record.allergen,
        severity: record.severity as AllergySeverity,
        count: parseInt(record.count, 10),
      }));

      // Get monthly health record trends using raw SQL for date truncation
      const defaultStartDate =
        startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 12 months ago
      const defaultEndDate = endDate || new Date();

      const monthlyTrendsRaw = await this.sequelize.query(
        `SELECT
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*)::integer as count
        FROM health_records
        WHERE "createdAt" >= $1
          AND "createdAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          bind: [defaultStartDate, defaultEndDate],
          type: QueryTypes.SELECT,
        },
      );

      const monthlyTrends = monthlyTrendsRaw.map((record: any) => ({
        month: new Date(record.month),
        type: record.type as HealthRecordType,
        count: parseInt(String(record.count), 10),
      }));

      this.logInfo(
        `Health trends report generated: ${healthRecords.length} record types, ${chronicConditions.length} conditions, ${allergies.length} allergens`,
      );

      return {
        healthRecords,
        chronicConditions,
        allergies,
        monthlyTrends,
      };
    } catch (error) {
      this.logError('Error getting health trends:', error);
      throw error;
    }
  }
}
