"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EnterpriseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseModule = void 0;
const common_1 = require("@nestjs/common");
const enterprise_cache_service_1 = require("./services/enterprise-cache.service");
const enterprise_metrics_service_1 = require("./services/enterprise-metrics.service");
let EnterpriseModule = EnterpriseModule_1 = class EnterpriseModule {
    static forModule(options) {
        const providers = [];
        const exports = [];
        if (options.enableCache !== false) {
            providers.push({
                provide: enterprise_cache_service_1.EnterpriseCacheService,
                useFactory: () => new enterprise_cache_service_1.EnterpriseCacheService(options.moduleName),
            });
            exports.push(enterprise_cache_service_1.EnterpriseCacheService);
        }
        if (options.enableMetrics !== false) {
            providers.push({
                provide: enterprise_metrics_service_1.EnterpriseMetricsService,
                useFactory: () => new enterprise_metrics_service_1.EnterpriseMetricsService(options.moduleName),
            });
            exports.push(enterprise_metrics_service_1.EnterpriseMetricsService);
        }
        return {
            module: EnterpriseModule_1,
            providers,
            exports,
            global: false,
        };
    }
};
exports.EnterpriseModule = EnterpriseModule;
exports.EnterpriseModule = EnterpriseModule = EnterpriseModule_1 = __decorate([
    (0, common_1.Module)({})
], EnterpriseModule);
//# sourceMappingURL=enterprise.module.js.map