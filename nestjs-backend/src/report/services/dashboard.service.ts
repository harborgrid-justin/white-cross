import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { StudentMedication } from '../../medication/entities/student-medication.entity';
import { IncidentReport } from '../../incident-report/entities/incident-report.entity';
import { Allergy } from '../../allergy/entities/allergy.entity';
import { ChronicCondition } from '../../chronic-condition/entities/chronic-condition.entity';
import { DashboardMetrics } from '../interfaces/report-types.interface';

/**
 * Dashboard Service
 * Provides real-time dashboard metrics and operational statistics
 */
@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(StudentMedication)
    private studentMedicationRepository: Repository<StudentMedication>,
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
    @InjectRepository(ChronicCondition)
    private chronicConditionRepository: Repository<ChronicCondition>,
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
        this.studentRepository.count({ where: { isActive: true } }),
        this.appointmentRepository.count({
          where: {
            scheduledAt: Between(today, tomorrow),
            status: 'SCHEDULED' as any,
          },
        }),
        this.studentMedicationRepository.count({ where: { isActive: true } }),
        this.incidentReportRepository.count({
          where: {
            createdAt: Between(sevenDaysAgo, new Date()),
          },
        }),
        this.allergyRepository.count({ where: { verified: true } }),
        this.chronicConditionRepository.count({ where: { status: 'ACTIVE' } }),
      ]);

      this.logger.log('Dashboard metrics retrieved successfully');

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
      this.logger.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
}
