import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../database/database.module';

// Models
import { ReportTemplate } from './models/report-template.model';
import { ReportSchedule } from './models/report-schedule.model';
import { ReportExecution } from './models/report-execution.model';

// External models
import { HealthRecord } from '../database/models/health-record.model';
import { ChronicCondition } from '../database/models/chronic-condition.model';
import { Allergy } from '../database/models/allergy.model';
import { MedicationLog } from '../database/models/medication-log.model';
import { StudentMedication } from '../database/models/student-medication.model';
import { IncidentReport } from '../database/models/incident-report.model';
import { Student } from '../database/models/student.model';
import { Appointment } from '../database/models/appointment.model';
import { AuditLog } from '../database/models/audit-log.model';

// Services
import { ReportGenerationService } from './services/report-generation.service';
import { HealthReportsService } from './services/health-reports.service';
import { MedicationReportsService } from './services/medication-reports.service';
import { IncidentReportsService } from './services/incident-reports.service';
import { AttendanceReportsService } from './services/attendance-reports.service';
import { ComplianceReportsService } from './services/compliance-reports.service';
import { DashboardService } from './services/dashboard.service';
import { ReportExportService } from './services/report-export.service';

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
