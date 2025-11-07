import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '@/database';

// Models
import { ReportTemplate } from '@/report/models';
import { ReportSchedule } from '@/report/models';
import { ReportExecution } from '@/report/models';

// External models
import { HealthRecord } from '@/database';
import { ChronicCondition } from '@/database';
import { Allergy } from '@/database';
import { MedicationLog } from '@/database';
import { StudentMedication } from '@/database';
import { IncidentReport } from '@/database';
import { Student } from '@/database';
import { Appointment } from '@/database';
import { AuditLog } from '@/database';

// Services
import { ReportGenerationService } from '@/report/services';
import { HealthReportsService } from '@/report/services';
import { MedicationReportsService } from '@/report/services';
import { IncidentReportsService } from '@/report/services';
import { AttendanceReportsService } from '@/report/services';
import { ComplianceReportsService } from '@/report/services';
import { DashboardService } from '@/report/services';
import { ReportExportService } from '@/report/services';

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
