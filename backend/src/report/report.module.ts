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
import { ReportExecution } from './models/report-execution.model';
import { ReportSchedule } from './models/report-schedule.model';
import { ReportTemplate } from './models/report-template.model';

// Services
import { AttendanceReportsService } from './services/attendance-reports.service';
import { ComplianceReportsService } from './services/compliance-reports.service';
import { DashboardService } from './services/dashboard.service';
import { HealthReportsService } from './services/health-reports.service';
import { IncidentReportsService } from './services/incident-reports.service';
import { MedicationReportsService } from './services/medication-reports.service';
import { ReportExportService } from './services/report-export.service';
import { ReportGenerationService } from './services/report-generation.service';

// Controllers
import { ReportsController } from './controllers/reports.controller';

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
