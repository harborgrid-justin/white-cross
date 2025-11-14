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
const core_1 = require("@nestjs/core");
const audit_middleware_1 = require("./audit.middleware");
const tracing_middleware_1 = require("./tracing.middleware");
const metrics_middleware_1 = require("./metrics.middleware");
const performance_middleware_1 = require("./performance.middleware");
const performance_interceptor_1 = require("./performance.interceptor");
let MonitoringModule = class MonitoringModule {
    configure(consumer) {
        consumer.apply(tracing_middleware_1.TracingMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        consumer.apply(metrics_middleware_1.MetricsMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        consumer.apply(performance_middleware_1.PerformanceMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        consumer.apply(audit_middleware_1.AuditMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        providers: [
            audit_middleware_1.AuditMiddleware,
            tracing_middleware_1.TracingMiddleware,
            metrics_middleware_1.MetricsMiddleware,
            performance_middleware_1.PerformanceMiddleware,
            performance_interceptor_1.PerformanceInterceptor,
            {
                provide: core_1.APP_INTERCEPTOR,
                useExisting: performance_interceptor_1.PerformanceInterceptor,
            },
        ],
        exports: [audit_middleware_1.AuditMiddleware, tracing_middleware_1.TracingMiddleware, metrics_middleware_1.MetricsMiddleware, performance_middleware_1.PerformanceMiddleware],
    })
], MonitoringModule);
//# sourceMappingURL=monitoring.module.js.map