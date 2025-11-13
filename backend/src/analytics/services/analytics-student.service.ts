import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment, HealthRecord, MedicationLog } from '@/database';
import { Op } from 'sequelize';
import { GetStudentHealthMetricsQueryDto } from '../dto/health-metrics.dto';

import { BaseService } from '@/common/base';
/**
 * Analytics Student Service
 *
 * Handles student-specific health metrics and analytics:
 * - Individual student health trend tracking
 * - Medication adherence calculation
 * - Vital signs monitoring
 * - Health visit history and categorization
 * - Appointment tracking and completion rates
 *
 * This service provides HIPAA-compliant student-level health analytics
 * for clinical decision support and parent/guardian reporting.
 */
@Injectable()
export class AnalyticsStudentService extends BaseService {
  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(MedicationLog)
    private readonly medicationLogModel: typeof MedicationLog,
  ) {}

  /**
   * Get comprehensive health metrics for a specific student
   *
   * Integrates data from multiple sources:
   * - Health records (vital signs, diagnoses, procedures)
   * - Medication logs (adherence, administration history)
   * - Appointments (completion rates, upcoming visits)
   *
   * Calculates derived metrics:
   * - Medication adherence rates
   * - Health visit patterns by type
   * - Vital signs trends over time
   * - Appointment completion statistics
   *
   * @param studentId - Student identifier
   * @param query - Query parameters including date range and filters
   * @returns Comprehensive student health metrics and trends
   */
  async getStudentHealthMetrics(
    studentId: string,
    query: GetStudentHealthMetricsQueryDto,
  ) {
    try {
      const startDate =
        query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate || new Date();

      // Query health records for the student
      const healthRecords = await this.healthRecordModel.findAll({
        where: {
          studentId,
          recordDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['recordDate', 'DESC']],
        limit: 100,
      });

      // Query medication logs
      const medicationLogs = await this.medicationLogModel.findAll({
        where: {
          studentId,
          administeredAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['administeredAt', 'DESC']],
        limit: 100,
      });

      // Query appointments
      const appointments = await this.appointmentModel.findAll({
        where: {
          studentId,
          scheduledAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['scheduledAt', 'DESC']],
        limit: 50,
      });

      // Calculate medication adherence
      const adherenceMetrics = this.calculateMedicationAdherence(medicationLogs);

      // Extract vital signs from health records
      const vitalSignsRecords = this.extractVitalSigns(healthRecords);

      // Group health visits by type
      const healthVisitsByType = this.groupHealthVisitsByType(healthRecords);

      // Calculate appointment metrics
      const appointmentMetrics = this.calculateAppointmentMetrics(appointments);

      const trends = {
        vitalSigns: vitalSignsRecords,
        healthVisits: healthRecords.map((record) => ({
          id: record.id,
          type: record.recordType,
          title: record.title,
          date: record.recordDate,
          provider: record.provider,
        })),
        healthVisitsByType,
        medicationAdherence: adherenceMetrics,
        appointments: appointmentMetrics,
      };

      this.logInfo(
        `Student health metrics retrieved: ${studentId} (${healthRecords.length} health records, ${medicationLogs.length} medication logs, ${appointments.length} appointments)`,
      );

      return {
        studentId,
        trends,
        period: { startDate, endDate },
        includesHistoricalData: query.includeHistory !== false,
      };
    } catch (error) {
      this.logError('Error getting student health metrics', error);
      throw error;
    }
  }

  /**
   * Calculate medication adherence metrics
   *
   * @param medicationLogs - Array of medication log entries
   * @returns Adherence metrics including rate, scheduled, administered, and missed doses
   */
  private calculateMedicationAdherence(medicationLogs: any[]) {
    const scheduledMedications = medicationLogs.length;
    const administeredMedications = medicationLogs.filter(
      (log: any) => log.status === 'ADMINISTERED',
    ).length;
    const adherenceRate =
      scheduledMedications > 0
        ? Math.round((administeredMedications / scheduledMedications) * 100)
        : 100;

    return {
      rate: adherenceRate,
      scheduled: scheduledMedications,
      administered: administeredMedications,
      missedDoses: scheduledMedications - administeredMedications,
    };
  }

  /**
   * Extract vital signs data from health records
   *
   * @param healthRecords - Array of health record entries
   * @returns Formatted vital signs records with dates
   */
  private extractVitalSigns(healthRecords: any[]) {
    return healthRecords
      .filter(
        (record) =>
          record.recordType === 'VITAL_SIGNS_CHECK' &&
          record.metadata?.vitalSigns,
      )
      .map((record) => ({
        date: record.recordDate,
        ...(record.metadata?.vitalSigns || {}),
      }));
  }

  /**
   * Group health visits by record type
   *
   * @param healthRecords - Array of health record entries
   * @returns Object with visit counts by type
   */
  private groupHealthVisitsByType(healthRecords: any[]) {
    return healthRecords.reduce((acc: any, record) => {
      const type = record.recordType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calculate appointment metrics
   *
   * @param appointments - Array of appointment entries
   * @returns Appointment statistics including total, completed, upcoming, and cancelled
   */
  private calculateAppointmentMetrics(appointments: any[]) {
    return {
      total: appointments.length,
      completed: appointments.filter((apt: any) => apt.status === 'COMPLETED')
        .length,
      upcoming: appointments.filter((apt: any) => apt.status === 'SCHEDULED')
        .length,
      cancelled: appointments.filter((apt: any) => apt.status === 'CANCELLED')
        .length,
    };
  }
}
