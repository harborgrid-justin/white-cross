"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const report_execution_model_1 = require("./models/report-execution.model");
const report_schedule_model_1 = require("./models/report-schedule.model");
const report_template_model_1 = require("./models/report-template.model");
const attendance_reports_service_1 = require("./services/attendance-reports.service");
const compliance_reports_service_1 = require("./services/compliance-reports.service");
const dashboard_service_1 = require("./services/dashboard.service");
const health_reports_service_1 = require("./services/health-reports.service");
const incident_reports_service_1 = require("./services/incident-reports.service");
const medication_reports_service_1 = require("./services/medication-reports.service");
const report_export_service_1 = require("./services/report-export.service");
const report_generation_service_1 = require("./services/report-generation.service");
const reports_controller_1 = require("./controllers/reports.controller");
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_1.DatabaseModule,
            sequelize_1.SequelizeModule.forFeature([
                report_template_model_1.ReportTemplate,
                report_schedule_model_1.ReportSchedule,
                report_execution_model_1.ReportExecution,
                database_1.HealthRecord,
                database_1.ChronicCondition,
                database_1.Allergy,
                database_1.MedicationLog,
                database_1.StudentMedication,
                database_1.IncidentReport,
                database_1.Student,
                database_1.Appointment,
                database_1.AuditLog,
            ]),
        ],
        providers: [
            report_generation_service_1.ReportGenerationService,
            health_reports_service_1.HealthReportsService,
            medication_reports_service_1.MedicationReportsService,
            incident_reports_service_1.IncidentReportsService,
            attendance_reports_service_1.AttendanceReportsService,
            compliance_reports_service_1.ComplianceReportsService,
            dashboard_service_1.DashboardService,
            report_export_service_1.ReportExportService,
        ],
        controllers: [reports_controller_1.ReportsController],
        exports: [report_generation_service_1.ReportGenerationService, report_export_service_1.ReportExportService, dashboard_service_1.DashboardService],
    })
], ReportModule);
//# sourceMappingURL=report.module.js.map