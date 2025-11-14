"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const monitoring_service_1 = require("./monitoring.service");
const health_controller_1 = require("./health.controller");
const monitoring_controller_1 = require("./monitoring.controller");
const health_check_service_1 = require("./health-check.service");
const metrics_collection_service_1 = require("./metrics-collection.service");
const alert_management_service_1 = require("./alert-management.service");
const performance_tracking_service_1 = require("./performance-tracking.service");
const log_aggregation_service_1 = require("./log-aggregation.service");
let MonitoringModule = class MonitoringModule {
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            sequelize_1.SequelizeModule.forFeature([]),
        ],
        controllers: [health_controller_1.HealthController, monitoring_controller_1.MonitoringController],
        providers: [
            monitoring_service_1.MonitoringService,
            health_check_service_1.HealthCheckService,
            metrics_collection_service_1.MetricsCollectionService,
            alert_management_service_1.AlertManagementService,
            performance_tracking_service_1.PerformanceTrackingService,
            log_aggregation_service_1.LogAggregationService,
        ],
        exports: [
            monitoring_service_1.MonitoringService,
            health_check_service_1.HealthCheckService,
            metrics_collection_service_1.MetricsCollectionService,
            alert_management_service_1.AlertManagementService,
            performance_tracking_service_1.PerformanceTrackingService,
            log_aggregation_service_1.LogAggregationService,
        ],
    })
], MonitoringModule);
//# sourceMappingURL=monitoring.module.js.map