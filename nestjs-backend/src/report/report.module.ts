import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ReportTemplate } from './entities/report-template.entity';
import { ReportSchedule } from './entities/report-schedule.entity';
import { ReportExecution } from './entities/report-execution.entity';

// External entities
import { HealthRecord } from '../health-record/entities/health-record.entity';
import { ChronicCondition } from '../chronic-condition/entities/chronic-condition.entity';
import { Allergy } from '../allergy/entities/allergy.entity';
import { MedicationLog } from '../medication/entities/medication-log.entity';
import { StudentMedication } from '../medication/entities/student-medication.entity';
import { IncidentReport } from '../incident-report/entities/incident-report.entity';
import { Student } from '../student/entities/student.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';

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
    TypeOrmModule.forFeature([
      // Report entities
      ReportTemplate,
      ReportSchedule,
      ReportExecution,
      // External entities
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
  exports: [
    ReportGenerationService,
    ReportExportService,
    DashboardService,
  ],
})
export class ReportModule {}
