import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes } from 'sequelize';
import { MedicationLog } from '../../database/models/medication-log.model';
import { StudentMedication } from '../../database/models/student-medication.model';
import { MedicationUsageReport } from '../interfaces/report-types.interface';
import { MedicationUsageDto } from '../dto/medication-usage.dto';

import { BaseService } from '../../../common/base';
/**
 * Medication Reports Service
 * Handles medication usage analysis, compliance tracking, and adverse reaction monitoring
 */
@Injectable()
export class MedicationReportsService extends BaseService {
  constructor(
    @InjectModel(MedicationLog)
    private medicationLogModel: typeof MedicationLog,
    @InjectModel(StudentMedication)
    private studentMedicationModel: typeof StudentMedication,
    private sequelize: Sequelize,
  ) {}

  /**
   * Generate comprehensive medication usage and compliance report
   */
  async getMedicationUsageReport(dto: MedicationUsageDto): Promise<MedicationUsageReport> {
    try {
      const { startDate, endDate, medicationId } = dto;
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.administeredAt = {};
        if (startDate && endDate) {
          whereClause.administeredAt = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
          whereClause.administeredAt = { [Op.gte]: startDate };
        } else if (endDate) {
          whereClause.administeredAt = { [Op.lte]: endDate };
        }
      }

      // Get medication administration logs with full details
      const administrationLogs = await this.medicationLogModel.findAll({
        include: [
          {
            model: this.studentMedicationModel,
            as: 'studentMedication',
            include: [
              {
                model: this.studentMedicationModel.associations.medication?.target,
                as: 'medication',
              },
              {
                model: this.studentMedicationModel.associations.student?.target,
                as: 'student',
              },
            ],
          },
          {
            model: this.medicationLogModel.associations.nurse?.target,
            as: 'nurse',
          },
        ],
        where: medicationId
          ? { ...whereClause, '$studentMedication.medicationId$': medicationId }
          : whereClause,
        order: [['administeredAt', 'DESC']],
        limit: 100,
      });

      // Get compliance statistics
      const totalScheduled = await this.studentMedicationModel.count({
        where: { isActive: true },
      });

      const totalLogs = await this.medicationLogModel.count({
        where: whereClause,
      });

      // Get most administered medications with medication names
      const topMedicationsRaw = await this.sequelize.query(
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
        {
          bind:
            startDate && endDate
              ? [startDate, endDate]
              : startDate
                ? [startDate]
                : endDate
                  ? [endDate]
                  : [],
          type: QueryTypes.SELECT,
        },
      );

      const topMedications = topMedicationsRaw.map((record: any) => ({
        medicationName: record.medicationName,
        count: parseInt(String(record.count), 10),
      }));

      // Get medication logs with side effects (adverse reactions)
      const adverseReactionsWhere: any = {
        sideEffects: { [Op.ne]: null },
        ...whereClause,
      };

      const adverseReactions = await this.medicationLogModel.findAll({
        where: adverseReactionsWhere,
        include: [
          {
            model: this.studentMedicationModel,
            as: 'studentMedication',
            include: [
              {
                model: this.studentMedicationModel.associations.medication?.target,
                as: 'medication',
              },
              {
                model: this.studentMedicationModel.associations.student?.target,
                as: 'student',
              },
            ],
          },
          {
            model: this.medicationLogModel.associations.nurse?.target,
            as: 'nurse',
          },
        ],
        order: [['administeredAt', 'DESC']],
      });

      this.logInfo(
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
      this.logError('Error getting medication usage report:', error);
      throw error;
    }
  }
}
