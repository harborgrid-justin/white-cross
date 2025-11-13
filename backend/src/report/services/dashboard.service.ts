import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '../../database/models/student.model';
import { Appointment } from '../../database/models/appointment.model';
import { StudentMedication } from '../../database/models/student-medication.model';
import { IncidentReport } from '../../database/models/incident-report.model';
import { Allergy } from '../../database/models/allergy.model';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { ConditionStatus } from '../../chronic-condition/enums';
import { DashboardMetrics } from '../interfaces/report-types.interface';

import { BaseService } from '../../common/base';
/**
 * Dashboard Service
 * Provides real-time dashboard metrics and operational statistics
 */
@Injectable()
export class DashboardService extends BaseService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(Appointment)
    private appointmentModel: typeof Appointment,
    @InjectModel(StudentMedication)
    private studentMedicationModel: typeof StudentMedication,
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    @InjectModel(Allergy)
    private allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private chronicConditionModel: typeof ChronicCondition,
  ) {}

  /**
   * Get real-time dashboard metrics
   */
  async getRealTimeDashboard(): Promise<DashboardMetrics> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [
        activeStudents,
        todaysAppointments,
        pendingMedications,
        recentIncidents,
        activeAllergies,
        chronicConditions,
      ] = await Promise.all([
        this.studentModel.count({ where: { isActive: true } }),
        this.appointmentModel.count({
          where: {
            scheduledAt: { [Op.between]: [today, tomorrow] },
            status: 'SCHEDULED',
          },
        }),
        this.studentMedicationModel.count({ where: { isActive: true } }),
        this.incidentReportModel.count({
          where: {
            createdAt: { [Op.between]: [sevenDaysAgo, new Date()] },
          } as any,
        }),
        this.allergyModel.count({ where: { verified: true } }),
        this.chronicConditionModel.count({
          where: { status: ConditionStatus.ACTIVE },
        }),
      ]);

      this.logInfo('Dashboard metrics retrieved successfully');

      return {
        activeStudents,
        todaysAppointments,
        pendingMedications,
        recentIncidents,
        lowStockItems: 0, // Placeholder - inventory integration needed
        activeAllergies,
        chronicConditions,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logError('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
}
