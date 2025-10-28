import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { HealthRecord } from '../../health-record/entities/health-record.entity';
import { ChronicCondition } from '../../chronic-condition/entities/chronic-condition.entity';
import { Allergy } from '../../allergy/entities/allergy.entity';
import { HealthTrendsReport } from '../interfaces/report-types.interface';
import { HealthTrendsDto } from '../dto/health-trends.dto';
import { HealthRecordType, AllergySeverity } from '../../common/enums';

/**
 * Health Reports Service
 * Handles health trend analysis, chronic condition tracking, and allergy reporting
 */
@Injectable()
export class HealthReportsService {
  private readonly logger = new Logger(HealthReportsService.name);

  constructor(
    @InjectRepository(HealthRecord)
    private healthRecordRepository: Repository<HealthRecord>,
    @InjectRepository(ChronicCondition)
    private chronicConditionRepository: Repository<ChronicCondition>,
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
    @InjectDataSource()
    private dataSource: DataSource,
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
        if (startDate) whereClause.createdAt = Between(startDate, endDate || new Date());
      }

      if (recordType) {
        whereClause.type = recordType;
      }

      // Get health records summary grouped by type
      const healthRecordsRaw = await this.healthRecordRepository
        .createQueryBuilder('hr')
        .select('hr.type', 'type')
        .addSelect('COUNT(hr.id)', 'count')
        .where(whereClause)
        .groupBy('hr.type')
        .getRawMany();

      const healthRecords = healthRecordsRaw.map((record: any) => ({
        type: record.type as HealthRecordType,
        count: parseInt(record.count, 10),
      }));

      // Get chronic conditions trends (top 10)
      const chronicConditionsRaw = await this.chronicConditionRepository
        .createQueryBuilder('cc')
        .select('cc.condition', 'condition')
        .addSelect('COUNT(cc.id)', 'count')
        .groupBy('cc.condition')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      const chronicConditions = chronicConditionsRaw.map((record: any) => ({
        condition: record.condition,
        count: parseInt(record.count, 10),
      }));

      // Get allergies summary (top 10)
      const allergiesRaw = await this.allergyRepository
        .createQueryBuilder('a')
        .select('a.allergen', 'allergen')
        .addSelect('a.severity', 'severity')
        .addSelect('COUNT(a.id)', 'count')
        .groupBy('a.allergen')
        .addGroupBy('a.severity')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      const allergies = allergiesRaw.map((record: any) => ({
        allergen: record.allergen,
        severity: record.severity as AllergySeverity,
        count: parseInt(record.count, 10),
      }));

      // Get monthly health record trends using raw SQL for date truncation
      const defaultStartDate =
        startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 12 months ago
      const defaultEndDate = endDate || new Date();

      const monthlyTrendsRaw = await this.dataSource.query(
        `SELECT
          DATE_TRUNC('month', "createdAt") as month,
          type,
          COUNT(*)::integer as count
        FROM health_records
        WHERE "createdAt" >= $1
          AND "createdAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`,
        [defaultStartDate, defaultEndDate],
      );

      const monthlyTrends = monthlyTrendsRaw.map((record: any) => ({
        month: new Date(record.month),
        type: record.type as HealthRecordType,
        count: parseInt(String(record.count), 10),
      }));

      this.logger.log(
        `Health trends report generated: ${healthRecords.length} record types, ${chronicConditions.length} conditions, ${allergies.length} allergens`,
      );

      return {
        healthRecords,
        chronicConditions,
        allergies,
        monthlyTrends,
      };
    } catch (error) {
      this.logger.error('Error getting health trends:', error);
      throw error;
    }
  }
}
