import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// External models
import {
  Allergy,
  Appointment,
  AuditLog,
  ChronicCondition,
  DatabaseModule,
  HealthRecord,
  IncidentReport,
  MedicationLog,
  Student,
  StudentMedication,
} from '@/database';

// Models
import { ReportExecution, ReportSchedule, ReportTemplate } from '@/report/models';

// Services
import {
  AttendanceReportsService,
  ComplianceReportsService,
  DashboardService,
  HealthReportsService,
  IncidentReportsService,
  MedicationReportsService,
  ReportExportService,
  ReportGenerationService,
} from '@/report/services';

// Controllers
import { ReportsController } from '@/report/controllers';

/**
 * Report Module
 * Comprehensive reporting system with multiple output formats and scheduling
 */
@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([
      // Report models
      ReportTemplate,
      ReportSchedule,
      ReportExecution,
      // External models
      HealthRecord,
      ChronicCondition,
      Allergy,
      MedicationLog,
      StudentMedication,
      IncidentReport,
      Student,
      Appointment,
      AuditLog,
    ]),
  ],
  providers: [
    ReportGenerationService,
    HealthReportsService,
    MedicationReportsService,
    IncidentReportsService,
    AttendanceReportsService,
    ComplianceReportsService,
    DashboardService,
    ReportExportService,
  ],
  controllers: [ReportsController],
  exports: [ReportGenerationService, ReportExportService, DashboardService],
})
export class ReportModule {}
