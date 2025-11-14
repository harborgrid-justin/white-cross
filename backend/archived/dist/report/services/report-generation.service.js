"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerationService = void 0;
const common_1 = require("@nestjs/common");
const report_constants_1 = require("../constants/report.constants");
const health_reports_service_1 = require("./health-reports.service");
const medication_reports_service_1 = require("./medication-reports.service");
const incident_reports_service_1 = require("./incident-reports.service");
const attendance_reports_service_1 = require("./attendance-reports.service");
const compliance_reports_service_1 = require("./compliance-reports.service");
const dashboard_service_1 = require("./dashboard.service");
const base_1 = require("../../common/base");
let ReportGenerationService = class ReportGenerationService extends base_1.BaseService {
    healthReportsService;
    medicationReportsService;
    incidentReportsService;
    attendanceReportsService;
    complianceReportsService;
    dashboardService;
    constructor(healthReportsService, medicationReportsService, incidentReportsService, attendanceReportsService, complianceReportsService, dashboardService) {
        super("ReportGenerationService");
        this.healthReportsService = healthReportsService;
        this.medicationReportsService = medicationReportsService;
        this.incidentReportsService = incidentReportsService;
        this.attendanceReportsService = attendanceReportsService;
        this.complianceReportsService = complianceReportsService;
        this.dashboardService = dashboardService;
    }
    async generateReport(reportType, parameters) {
        const startTime = Date.now();
        try {
            let data;
            switch (reportType) {
                case report_constants_1.ReportType.HEALTH_TRENDS:
                    data = await this.healthReportsService.getHealthTrends(parameters);
                    break;
                case report_constants_1.ReportType.MEDICATION_USAGE:
                    data = await this.medicationReportsService.getMedicationUsageReport(parameters);
                    break;
                case report_constants_1.ReportType.INCIDENT_STATISTICS:
                    data = await this.incidentReportsService.getIncidentStatistics(parameters);
                    break;
                case report_constants_1.ReportType.ATTENDANCE_CORRELATION:
                    data = await this.attendanceReportsService.getAttendanceCorrelation(parameters);
                    break;
                case report_constants_1.ReportType.COMPLIANCE:
                    data = await this.complianceReportsService.getComplianceReport(parameters);
                    break;
                case report_constants_1.ReportType.DASHBOARD:
                    data = await this.dashboardService.getRealTimeDashboard();
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported report type: ${reportType}`);
            }
            const executionTime = Date.now() - startTime;
            const recordCount = this.getRecordCount(data);
            this.logInfo(`Report generated: ${reportType}, records: ${recordCount}, time: ${executionTime}ms`);
            return {
                data,
                metadata: {
                    generatedAt: new Date(),
                    reportType,
                    recordCount,
                    parameters,
                    executionTime,
                },
            };
        }
        catch (error) {
            this.logError(`Error generating ${reportType} report:`, error);
            throw error;
        }
    }
    getRecordCount(data) {
        if (Array.isArray(data)) {
            return data.length;
        }
        else if (typeof data === 'object' && data !== null) {
            const arrayProps = Object.keys(data).filter((key) => Array.isArray(data[key]));
            if (arrayProps.length > 0) {
                const firstArrayKey = arrayProps[0];
                const arrayData = data[firstArrayKey];
                return Array.isArray(arrayData) ? arrayData.length : 1;
            }
            return 1;
        }
        return 0;
    }
};
exports.ReportGenerationService = ReportGenerationService;
exports.ReportGenerationService = ReportGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_reports_service_1.HealthReportsService,
        medication_reports_service_1.MedicationReportsService,
        incident_reports_service_1.IncidentReportsService,
        attendance_reports_service_1.AttendanceReportsService,
        compliance_reports_service_1.ComplianceReportsService,
        dashboard_service_1.DashboardService])
], ReportGenerationService);
//# sourceMappingURL=report-generation.service.js.map