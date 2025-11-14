"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const services_1 = require("./services");
const impl_1 = require("../database/repositories/impl");
const compliance_data_collector_service_1 = require("./services/compliance-data-collector.service");
const compliance_metrics_calculator_service_1 = require("./services/compliance-metrics-calculator.service");
const compliance_report_builder_service_1 = require("./services/compliance-report-builder.service");
const compliance_report_exporter_service_1 = require("./services/compliance-report-exporter.service");
const compliance_report_persistence_service_1 = require("./services/compliance-report-persistence.service");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                ttl: 300,
                max: 100,
                isGlobal: false,
            }),
            database_1.DatabaseModule,
            sequelize_1.SequelizeModule.forFeature([
                database_1.HealthMetricSnapshot,
                database_1.AnalyticsReport,
                database_1.Student,
                database_1.HealthRecord,
                database_1.Appointment,
                database_1.MedicationLog,
                database_1.IncidentReport,
            ]),
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [
            analytics_service_1.AnalyticsService,
            services_1.AnalyticsDashboardService,
            services_1.AnalyticsReportService,
            services_1.AnalyticsHealthService,
            services_1.AnalyticsIncidentOrchestratorService,
            services_1.AnalyticsMedicationOrchestratorService,
            services_1.AnalyticsAppointmentOrchestratorService,
            services_1.HealthTrendAnalyticsService,
            services_1.ComplianceReportGeneratorService,
            compliance_data_collector_service_1.ComplianceDataCollectorService,
            compliance_metrics_calculator_service_1.ComplianceMetricsCalculatorService,
            compliance_report_builder_service_1.ComplianceReportBuilderService,
            compliance_report_exporter_service_1.ComplianceReportExporterService,
            compliance_report_persistence_service_1.ComplianceReportPersistenceService,
            services_1.DateRangeService,
            services_1.TrendCalculationService,
            services_1.ConditionAnalyticsService,
            services_1.HealthMetricsAnalyzerService,
            services_1.IncidentAnalyticsService,
            services_1.PredictiveInsightsService,
            database_1.AppointmentRepository,
            impl_1.HealthRecordRepository,
            impl_1.MedicationLogRepository,
            impl_1.IncidentReportRepository,
        ],
        exports: [
            analytics_service_1.AnalyticsService,
            services_1.AnalyticsDashboardService,
            services_1.AnalyticsReportService,
            services_1.AnalyticsHealthService,
            services_1.AnalyticsIncidentOrchestratorService,
            services_1.AnalyticsMedicationOrchestratorService,
            services_1.AnalyticsAppointmentOrchestratorService,
            services_1.HealthTrendAnalyticsService,
            services_1.ComplianceReportGeneratorService,
            services_1.DateRangeService,
            services_1.TrendCalculationService,
            services_1.ConditionAnalyticsService,
            services_1.HealthMetricsAnalyzerService,
            services_1.IncidentAnalyticsService,
            services_1.PredictiveInsightsService,
            database_1.AppointmentRepository,
            impl_1.HealthRecordRepository,
            impl_1.MedicationLogRepository,
            impl_1.IncidentReportRepository,
        ],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map