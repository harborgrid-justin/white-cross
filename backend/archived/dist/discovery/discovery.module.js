"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryExampleModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const discovery_example_service_1 = require("./discovery-example.service");
const discovery_controller_1 = require("./discovery.controller");
const admin_discovery_guard_1 = require("./guards/admin-discovery.guard");
const discovery_rate_limit_guard_1 = require("./guards/discovery-rate-limit.guard");
const discovery_exception_filter_1 = require("./filters/discovery-exception.filter");
const discovery_metrics_service_1 = require("./services/discovery-metrics.service");
const discovery_cache_service_1 = require("./services/discovery-cache.service");
const discovery_logging_interceptor_1 = require("./interceptors/discovery-logging.interceptor");
const discovery_cache_interceptor_1 = require("./interceptors/discovery-cache.interceptor");
const discovery_metrics_interceptor_1 = require("./interceptors/discovery-metrics.interceptor");
const example_services_1 = require("./examples/example-services");
let DiscoveryExampleModule = class DiscoveryExampleModule {
};
exports.DiscoveryExampleModule = DiscoveryExampleModule;
exports.DiscoveryExampleModule = DiscoveryExampleModule = __decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        controllers: [discovery_controller_1.DiscoveryController],
        providers: [
            discovery_example_service_1.DiscoveryExampleService,
            discovery_metrics_service_1.DiscoveryMetricsService,
            discovery_cache_service_1.DiscoveryCacheService,
            admin_discovery_guard_1.AdminDiscoveryGuard,
            discovery_rate_limit_guard_1.DiscoveryRateLimitGuard,
            discovery_exception_filter_1.DiscoveryExceptionFilter,
            discovery_logging_interceptor_1.DiscoveryLoggingInterceptor,
            discovery_cache_interceptor_1.DiscoveryCacheInterceptor,
            discovery_metrics_interceptor_1.DiscoveryMetricsInterceptor,
            example_services_1.ExperimentalHealthService,
            example_services_1.AiDiagnosisService,
            example_services_1.UserAnalyticsService,
            example_services_1.ReportCacheService,
            example_services_1.ExternalApiService,
            example_services_1.RegularService,
            example_services_1.StudentHealthService,
        ],
        exports: [
            discovery_example_service_1.DiscoveryExampleService,
            discovery_metrics_service_1.DiscoveryMetricsService,
            discovery_cache_service_1.DiscoveryCacheService,
            admin_discovery_guard_1.AdminDiscoveryGuard,
            discovery_rate_limit_guard_1.DiscoveryRateLimitGuard,
            discovery_exception_filter_1.DiscoveryExceptionFilter,
            discovery_logging_interceptor_1.DiscoveryLoggingInterceptor,
            discovery_cache_interceptor_1.DiscoveryCacheInterceptor,
            discovery_metrics_interceptor_1.DiscoveryMetricsInterceptor,
            example_services_1.ExperimentalHealthService,
            example_services_1.AiDiagnosisService,
            example_services_1.UserAnalyticsService,
            example_services_1.ReportCacheService,
            example_services_1.ExternalApiService,
            example_services_1.RegularService,
            example_services_1.StudentHealthService,
        ],
    })
], DiscoveryExampleModule);
//# sourceMappingURL=discovery.module.js.map