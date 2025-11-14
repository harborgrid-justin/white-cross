"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const integration_service_1 = require("./services/integration.service");
const integration_config_service_1 = require("./services/integration-config.service");
const integration_test_service_1 = require("./services/integration-test.service");
const integration_sync_service_1 = require("./services/integration-sync.service");
const integration_encryption_service_1 = require("./services/integration-encryption.service");
const integration_validation_service_1 = require("./services/integration-validation.service");
const integration_log_service_1 = require("./services/integration-log.service");
const integration_statistics_service_1 = require("./services/integration-statistics.service");
const circuit_breaker_service_1 = require("./services/circuit-breaker.service");
const rate_limiter_service_1 = require("./services/rate-limiter.service");
const integration_controller_1 = require("./integration.controller");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([models_1.IntegrationConfig, models_2.IntegrationLog]),
            config_1.ConfigModule,
        ],
        providers: [
            integration_service_1.IntegrationService,
            integration_config_service_1.IntegrationConfigService,
            integration_test_service_1.IntegrationTestService,
            integration_sync_service_1.IntegrationSyncService,
            integration_encryption_service_1.IntegrationEncryptionService,
            integration_validation_service_1.IntegrationValidationService,
            integration_log_service_1.IntegrationLogService,
            integration_statistics_service_1.IntegrationStatisticsService,
            circuit_breaker_service_1.CircuitBreakerService,
            rate_limiter_service_1.RateLimiterService,
        ],
        controllers: [integration_controller_1.IntegrationController],
        exports: [integration_service_1.IntegrationService, circuit_breaker_service_1.CircuitBreakerService, rate_limiter_service_1.RateLimiterService],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map