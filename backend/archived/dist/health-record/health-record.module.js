"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cache_manager_1 = require("@nestjs/cache-manager");
const health_record_service_1 = require("./health-record.service");
const controllers_1 = require("./controllers");
const health_record_crud_service_1 = require("./services/health-record-crud.service");
const health_record_allergy_service_1 = require("./services/health-record-allergy.service");
const health_record_chronic_condition_service_1 = require("./services/health-record-chronic-condition.service");
const health_record_vaccination_service_1 = require("./services/health-record-vaccination.service");
const health_record_vitals_service_1 = require("./services/health-record-vitals.service");
const health_record_summary_service_1 = require("./services/health-record-summary.service");
const health_record_batch_service_1 = require("./services/health-record-batch.service");
const phi_access_logger_service_1 = require("./services/phi-access-logger.service");
const health_record_metrics_service_1 = require("./services/health-record-metrics.service");
const cache_strategy_service_1 = require("./services/cache-strategy.service");
const cache_strategy_orchestrator_service_1 = require("./services/cache/cache-strategy-orchestrator.service");
const cache_optimization_service_1 = require("./services/cache/cache-optimization.service");
const l1_cache_service_1 = require("./services/cache/l1-cache.service");
const l2_cache_service_1 = require("./services/cache/l2-cache.service");
const l3_cache_service_1 = require("./services/cache/l3-cache.service");
const cache_access_pattern_tracker_service_1 = require("./services/cache/cache-access-pattern-tracker.service");
const query_performance_analyzer_service_1 = require("./services/query-performance-analyzer.service");
const intelligent_cache_invalidation_service_1 = require("./services/intelligent-cache-invalidation.service");
const resource_optimization_service_1 = require("./services/resource-optimization.service");
const resource_metrics_collector_service_1 = require("./services/resource-metrics-collector.service");
const resource_monitor_service_1 = require("./services/resource-monitor.service");
const resource_optimization_engine_service_1 = require("./services/resource-optimization-engine.service");
const resource_reporter_service_1 = require("./services/resource-reporter.service");
const health_record_audit_interceptor_1 = require("./interceptors/health-record-audit.interceptor");
const health_record_cache_interceptor_1 = require("./interceptors/health-record-cache.interceptor");
const health_record_rate_limit_guard_1 = require("./guards/health-record-rate-limit.guard");
const vaccination_module_1 = require("./vaccination/vaccination.module");
const vitals_module_1 = require("./vitals/vitals.module");
const search_module_1 = require("./search/search.module");
const statistics_module_1 = require("./statistics/statistics.module");
const import_export_module_1 = require("./import-export/import-export.module");
const chronic_condition_module_1 = require("../services/chronic-condition/chronic-condition.module");
const validation_module_1 = require("./validation/validation.module");
const allergy_module_1 = require("../services/allergy/allergy.module");
const medication_module_1 = require("../services/medication/medication.module");
const screening_module_1 = require("./screening/screening.module");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const models_3 = require("../database/models");
const models_4 = require("../database/models");
const models_5 = require("../database/models");
const models_6 = require("../database/models");
const models_7 = require("../database/models");
let HealthRecordModule = class HealthRecordModule {
};
exports.HealthRecordModule = HealthRecordModule;
exports.HealthRecordModule = HealthRecordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                ttl: 300,
                max: 200,
                isGlobal: false,
            }),
            sequelize_1.SequelizeModule.forFeature([
                models_1.HealthRecord,
                models_2.Allergy,
                models_3.Student,
                models_4.ChronicCondition,
                models_5.Vaccination,
                models_6.Medication,
                models_7.CacheEntry,
            ]),
            vaccination_module_1.VaccinationModule,
            vitals_module_1.VitalsModule,
            search_module_1.SearchModule,
            statistics_module_1.StatisticsModule,
            import_export_module_1.ImportExportModule,
            chronic_condition_module_1.ChronicConditionModule,
            validation_module_1.ValidationModule,
            allergy_module_1.AllergyModule,
            medication_module_1.MedicationModule,
            screening_module_1.ScreeningModule,
        ],
        providers: [
            health_record_service_1.HealthRecordService,
            health_record_crud_service_1.HealthRecordCrudService,
            health_record_allergy_service_1.HealthRecordAllergyService,
            health_record_chronic_condition_service_1.HealthRecordChronicConditionService,
            health_record_vaccination_service_1.HealthRecordVaccinationService,
            health_record_vitals_service_1.HealthRecordVitalsService,
            health_record_summary_service_1.HealthRecordSummaryService,
            health_record_batch_service_1.HealthRecordBatchService,
            phi_access_logger_service_1.PHIAccessLogger,
            health_record_metrics_service_1.HealthRecordMetricsService,
            cache_strategy_service_1.CacheStrategyService,
            cache_strategy_orchestrator_service_1.CacheStrategyOrchestratorService,
            cache_optimization_service_1.CacheOptimizationService,
            l1_cache_service_1.L1CacheService,
            l2_cache_service_1.L2CacheService,
            l3_cache_service_1.L3CacheService,
            cache_access_pattern_tracker_service_1.CacheAccessPatternTrackerService,
            query_performance_analyzer_service_1.QueryPerformanceAnalyzer,
            intelligent_cache_invalidation_service_1.IntelligentCacheInvalidationService,
            resource_optimization_service_1.ResourceOptimizationService,
            resource_metrics_collector_service_1.ResourceMetricsCollector,
            resource_monitor_service_1.ResourceMonitor,
            resource_optimization_engine_service_1.ResourceOptimizationEngine,
            resource_reporter_service_1.ResourceReporter,
            health_record_audit_interceptor_1.HealthRecordAuditInterceptor,
            health_record_cache_interceptor_1.HealthRecordCacheInterceptor,
            health_record_rate_limit_guard_1.HealthRecordRateLimitGuard,
        ],
        controllers: [controllers_1.HealthRecordCrudController, controllers_1.HealthRecordComplianceController],
        exports: [
            health_record_service_1.HealthRecordService,
            phi_access_logger_service_1.PHIAccessLogger,
            health_record_metrics_service_1.HealthRecordMetricsService,
            health_record_audit_interceptor_1.HealthRecordAuditInterceptor,
            health_record_cache_interceptor_1.HealthRecordCacheInterceptor,
            health_record_rate_limit_guard_1.HealthRecordRateLimitGuard,
            allergy_module_1.AllergyModule,
            cache_strategy_service_1.CacheStrategyService,
            query_performance_analyzer_service_1.QueryPerformanceAnalyzer,
            intelligent_cache_invalidation_service_1.IntelligentCacheInvalidationService,
            resource_optimization_service_1.ResourceOptimizationService,
        ],
    })
], HealthRecordModule);
//# sourceMappingURL=health-record.module.js.map