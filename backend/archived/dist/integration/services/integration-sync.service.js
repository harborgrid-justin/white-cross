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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSyncService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const integration_config_service_1 = require("./integration-config.service");
const integration_log_service_1 = require("./integration-log.service");
const base_1 = require("../../common/base");
let IntegrationSyncService = class IntegrationSyncService extends base_1.BaseService {
    configModel;
    configService;
    logService;
    constructor(configModel, configService, logService) {
        super("IntegrationSyncService");
        this.configModel = configModel;
        this.configService = configService;
        this.logService = logService;
    }
    async sync(id) {
        const startTime = Date.now();
        try {
            const integration = await this.configService.findById(id, true);
            if (!integration.isActive) {
                throw new Error('Integration is not active');
            }
            await this.configModel.update({ status: models_1.IntegrationStatus.SYNCING }, { where: { id } });
            const syncResult = await this.performSync();
            const duration = Date.now() - startTime;
            await this.configModel.update({
                status: syncResult.success
                    ? models_1.IntegrationStatus.ACTIVE
                    : models_1.IntegrationStatus.ERROR,
                lastSyncAt: new Date(),
                lastSyncStatus: syncResult.success ? 'success' : 'failed',
            }, { where: { id } });
            await this.logService.create({
                integrationId: id,
                integrationType: integration.type,
                action: 'sync',
                status: syncResult.success ? 'success' : 'failed',
                recordsProcessed: syncResult.recordsProcessed,
                recordsSucceeded: syncResult.recordsSucceeded,
                recordsFailed: syncResult.recordsFailed,
                duration,
                errorMessage: syncResult.errors?.join('; '),
                details: syncResult.errors?.map((error, index) => ({
                    code: 'SYNC_ERROR',
                    message: error,
                    field: `record_${index}`,
                })),
            });
            this.logInfo(`Sync ${syncResult.success ? 'completed' : 'failed'} for ${integration.name}`);
            return {
                ...syncResult,
                duration,
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            await this.configModel.update({
                status: models_1.IntegrationStatus.ERROR,
                lastSyncAt: new Date(),
                lastSyncStatus: 'failed',
            }, { where: { id } });
            this.logError('Error syncing integration', error);
            return {
                success: false,
                recordsProcessed: 0,
                recordsSucceeded: 0,
                recordsFailed: 0,
                duration,
                errors: [error.message],
            };
        }
    }
    async performSync() {
        const startTime = Date.now();
        const errors = [];
        try {
            await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1500));
            const recordsProcessed = 10 + Math.floor(Math.random() * 40);
            let recordsSucceeded = recordsProcessed;
            let recordsFailed = 0;
            if (Math.random() < 0.15) {
                recordsFailed = Math.floor(Math.random() * 3) + 1;
                recordsSucceeded = recordsProcessed - recordsFailed;
                const errorTypes = [
                    'Validation error - missing required field',
                    'Conflict detected - record already exists with different data',
                    'Data format error - invalid date format',
                    'Foreign key constraint - referenced record not found',
                    'Duplicate key error - record already exists',
                ];
                for (let i = 0; i < Math.min(recordsFailed, 3); i++) {
                    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
                    errors.push(`Record ${i + 1}: ${errorType}`);
                }
                if (recordsFailed > 3) {
                    errors.push(`... and ${recordsFailed - 3} more errors`);
                }
            }
            const duration = Date.now() - startTime;
            this.logInfo(`Sync completed: ${recordsSucceeded}/${recordsProcessed} records succeeded in ${duration}ms`);
            return {
                success: recordsFailed === 0,
                recordsProcessed,
                recordsSucceeded,
                recordsFailed,
                duration,
                errors: errors.length > 0 ? errors : undefined,
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logError('Sync operation failed', error);
            return {
                success: false,
                recordsProcessed: 0,
                recordsSucceeded: 0,
                recordsFailed: 0,
                duration,
                errors: [error.message],
            };
        }
    }
    async resolveConflict(localData, remoteData, strategy = 'remote') {
        switch (strategy) {
            case 'local':
                return localData;
            case 'remote':
                return remoteData;
            case 'merge':
                const localTimestamp = localData.updatedAt || new Date(0);
                const remoteTimestamp = remoteData.updatedAt || new Date(0);
                if (remoteTimestamp > localTimestamp) {
                    return { ...localData, ...remoteData };
                }
                return { ...remoteData, ...localData };
            default:
                return remoteData;
        }
    }
};
exports.IntegrationSyncService = IntegrationSyncService;
exports.IntegrationSyncService = IntegrationSyncService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IntegrationConfig)),
    __metadata("design:paramtypes", [Object, integration_config_service_1.IntegrationConfigService,
        integration_log_service_1.IntegrationLogService])
], IntegrationSyncService);
//# sourceMappingURL=integration-sync.service.js.map