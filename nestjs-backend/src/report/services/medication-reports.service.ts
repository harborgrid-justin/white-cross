import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between, IsNull, Not } from 'typeorm';
import { MedicationLog, StudentMedication } from '../../medication/entities';
import { MedicationUsageReport } from '../interfaces/report-types.interface';
import { MedicationUsageDto } from '../dto/medication-usage.dto';

/**
 * Medication Reports Service
 * Handles medication usage analysis, compliance tracking, and adverse reaction monitoring
 */
@Injectable()
export class MedicationReportsService {
  private readonly logger = new Logger(MedicationReportsService.name);

  constructor(
    @InjectRepository(MedicationLog)
    private medicationLogRepository: Repository<MedicationLog>,
    @InjectRepository(StudentMedication)
    private studentMedicationRepository: Repository<StudentMedication>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Generate comprehensive medication usage and compliance report
   */
  async getMedicationUsageReport(
    dto: MedicationUsageDto,
  ): Promise<MedicationUsageReport> {
    try {
      const { startDate, endDate, medicationId } = dto;
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.administeredAt = {};
        if (startDate) whereClause.administeredAt = Between(startDate, endDate || new Date());
      }

      // Get medication administration logs with full details
      const queryBuilder = this.medicationLogRepository
        .createQueryBuilder('ml')
        .leftJoinAndSelect('ml.studentMedication', 'sm')
        .leftJoinAndSelect('sm.medication', 'm')
        .leftJoinAndSelect('sm.student', 's')
        .leftJoinAndSelect('ml.nurse', 'n')
        .orderBy('ml.administeredAt', 'DESC')
        .take(100);

      if (whereClause.administeredAt) {
        queryBuilder.andWhere('ml.administeredAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate || new Date(),
        });
      }

      if (medicationId) {
        queryBuilder.andWhere('sm.medicationId = :medicationId', { medicationId });
      }

      const administrationLogs = await queryBuilder.getMany();

      // Get compliance statistics
      const totalScheduled = await this.studentMedicationRepository.count({
        where: { isActive: true },
      });

      const totalLogs = await this.medicationLogRepository.count({
        where: whereClause,
      });

      // Get most administered medications with medication names
      const topMedicationsRaw = await this.dataSource.query(
        `SELECT
          m.id as "medicationId",
          m.name as "medicationName",
          COUNT(ml.id)::integer as count
        FROM medication_logs ml
        INNER JOIN student_medications sm ON ml."studentMedicationId" = sm.id
        INNER JOIN medications m ON sm."medicationId" = m.id
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `ml."timeGiven" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `ml."timeGiven" <= $2` : endDate ? `ml."timeGiven" <= $1` : ''}
        GROUP BY m.id, m.name
        ORDER BY count DESC
        LIMIT 10`,
        startDate && endDate ? [startDate, endDate] : startDate ? [startDate] : endDate ? [endDate] : [],
      );

      const topMedications = topMedicationsRaw.map((record: any) => ({
        medicationName: record.medicationName,
        count: parseInt(String(record.count), 10),
      }));

      // Get medication logs with side effects (adverse reactions)
      const adverseReactionsWhere: any = {
        sideEffects: Not(IsNull()),
        ...whereClause,
      };

      const adverseReactions = await this.medicationLogRepository.find({
        where: adverseReactionsWhere,
        relations: ['studentMedication', 'studentMedication.medication', 'studentMedication.student', 'nurse'],
        order: { administeredAt: 'DESC' },
      });

      this.logger.log(
        `Medication usage report generated: ${administrationLogs.length} logs, ${adverseReactions.length} adverse reactions, compliance: ${totalLogs}/${totalScheduled}`,
      );

      return {
        administrationLogs,
        totalScheduled,
        totalLogs,
        topMedications,
        adverseReactions,
      };
    } catch (error) {
      this.logger.error('Error getting medication usage report:', error);
      throw error;
    }
  }
}
