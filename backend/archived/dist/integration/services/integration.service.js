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
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const integration_config_service_1 = require("./integration-config.service");
const integration_test_service_1 = require("./integration-test.service");
const integration_sync_service_1 = require("./integration-sync.service");
const integration_log_service_1 = require("./integration-log.service");
const integration_statistics_service_1 = require("./integration-statistics.service");
const base_1 = require("../../common/base");
let IntegrationService = class IntegrationService extends base_1.BaseService {
    configService;
    testService;
    syncService;
    logService;
    statisticsService;
    constructor(configService, testService, syncService, logService, statisticsService) {
        super("IntegrationService");
        this.configService = configService;
        this.testService = testService;
        this.syncService = syncService;
        this.logService = logService;
        this.statisticsService = statisticsService;
    }
    getAllIntegrations(type) {
        return this.configService.findAll(type);
    }
    getIntegrationById(id, includeSensitive = false) {
        return this.configService.findById(id, includeSensitive);
    }
    createIntegration(data) {
        return this.configService.create(data);
    }
    updateIntegration(id, data) {
        return this.configService.update(id, data);
    }
    deleteIntegration(id) {
        return this.configService.delete(id);
    }
    testConnection(id) {
        return this.testService.testConnection(id);
    }
    syncIntegration(id) {
        return this.syncService.sync(id);
    }
    getIntegrationLogs(integrationId, type, page, limit) {
        return this.logService.findAll(integrationId, type, page, limit);
    }
    getIntegrationStatistics() {
        return this.statisticsService.getStatistics();
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [integration_config_service_1.IntegrationConfigService,
        integration_test_service_1.IntegrationTestService,
        integration_sync_service_1.IntegrationSyncService,
        integration_log_service_1.IntegrationLogService,
        integration_statistics_service_1.IntegrationStatisticsService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map