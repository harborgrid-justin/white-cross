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
exports.OfflineSyncService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const enums_1 = require("../enums");
const offline_sync_entity_registry_service_1 = require("./offline-sync-entity-registry.service");
const offline_sync_watermark_service_1 = require("./offline-sync-watermark.service");
const offline_sync_queue_service_1 = require("./offline-sync-queue.service");
const offline_sync_conflict_service_1 = require("./offline-sync-conflict.service");
const base_1 = require("../../../common/base");
let OfflineSyncService = class OfflineSyncService extends base_1.BaseService {
    queueModel;
    conflictModel;
    entityRegistry;
    watermarkService;
    queueService;
    conflictService;
    constructor(queueModel, conflictModel, entityRegistry, watermarkService, queueService, conflictService) {
        super("OfflineSyncService");
        this.queueModel = queueModel;
        this.conflictModel = conflictModel;
        this.entityRegistry = entityRegistry;
        this.watermarkService = watermarkService;
        this.queueService = queueService;
        this.conflictService = conflictService;
        this.logInfo('OfflineSyncService initialized');
    }
    registerEntityService(entityType, service) {
        this.entityRegistry.registerEntityService(entityType, service);
    }
    async queueAction(userId, dto) {
        return this.queueService.queueAction(userId, dto);
    }
    async getStatistics(userId, deviceId) {
        return this.queueService.getStatistics(userId, deviceId);
    }
    async listConflicts(userId, deviceId) {
        return this.queueService.listConflicts(userId, deviceId);
    }
    async resolveConflict(userId, conflictId, dto) {
        const resolved = await this.conflictService.resolveConflict(userId, conflictId, dto);
        await this.queueService.updateConflictResolution(resolved.queueItemId, dto.resolution);
        return resolved;
    }
    async getSyncWatermark(deviceId, entityType) {
        return this.watermarkService.getSyncWatermark(deviceId, entityType);
    }
    async updateSyncWatermark(deviceId, entityType, timestamp) {
        return this.watermarkService.updateSyncWatermark(deviceId, entityType, timestamp);
    }
    async getChangedEntities(deviceId, entityType) {
        return this.watermarkService.getChangedEntities(deviceId, entityType);
    }
    async syncPendingActions(userId, deviceId, options) {
        try {
            const batchSize = options?.batchSize || 50;
            const retryFailed = options?.retryFailed || false;
            const pendingItems = await this.queueService.getPendingItems(userId, deviceId, batchSize, retryFailed);
            const result = {
                synced: 0,
                failed: 0,
                conflicts: 0,
                errors: [],
            };
            for (const item of pendingItems) {
                try {
                    await this.queueService.updateAttempts(item.id, item.attempts + 1);
                    const conflictData = await this.conflictService.detectConflict(item);
                    if (conflictData) {
                        await this.queueService.markConflictDetected(item.id);
                        const savedConflict = await this.conflictService.createConflict(conflictData);
                        result.conflicts++;
                        if (options?.conflictStrategy &&
                            options.conflictStrategy !== enums_1.ConflictResolution.MANUAL) {
                            const resolution = options.conflictStrategy === enums_1.ConflictResolution.NEWEST_WINS
                                ? enums_1.ConflictResolution.CLIENT_WINS
                                : options.conflictStrategy;
                            await this.resolveConflict(userId, savedConflict.id, {
                                resolution,
                            });
                            await this.applySyncAction(item);
                            await this.queueService.markAsSynced(item.id);
                            result.synced++;
                        }
                    }
                    else {
                        await this.applySyncAction(item);
                        await this.queueService.markAsSynced(item.id);
                        result.synced++;
                    }
                }
                catch (error) {
                    await this.queueService.updateAttempts(item.id, item.attempts + 1, String(error));
                    result.failed++;
                    result.errors.push(`Item ${item.id}: ${error}`);
                    this.logError('Error syncing item', error);
                }
            }
            this.logInfo(`Sync completed for device ${deviceId}: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`);
            return result;
        }
        catch (error) {
            this.logError('Error syncing pending actions', error);
            throw error;
        }
    }
    async applySyncAction(item) {
        const entityService = this.entityRegistry.getEntityService(item.entityType);
        try {
            this.logInfo(`Applying sync action: ${item.actionType} on ${item.entityType} (${item.entityId})`);
            const isValid = await entityService.validateData(item.data);
            if (!isValid) {
                throw new Error('Data validation failed');
            }
            switch (item.actionType) {
                case enums_1.SyncActionType.CREATE:
                    await entityService.create(item.data, item.userId);
                    this.logInfo(`Created ${item.entityType}:${item.entityId}`);
                    break;
                case enums_1.SyncActionType.UPDATE:
                    await entityService.update(item.entityId, item.data, item.userId);
                    this.logInfo(`Updated ${item.entityType}:${item.entityId}`);
                    break;
                case enums_1.SyncActionType.DELETE:
                    await entityService.delete(item.entityId, item.userId);
                    this.logInfo(`Deleted ${item.entityType}:${item.entityId}`);
                    break;
                case enums_1.SyncActionType.READ:
                    await entityService.findById(item.entityId);
                    this.logInfo(`Validated ${item.entityType}:${item.entityId}`);
                    break;
                default:
                    throw new Error(`Unknown sync action type: ${item.actionType}`);
            }
        }
        catch (error) {
            this.logError(`Failed to apply sync action for ${item.entityType}:${item.entityId}`, error);
            throw error;
        }
    }
    async batchSync(userId, deviceId, items, options) {
        const transaction = await this.queueModel.sequelize.transaction();
        const result = {
            synced: 0,
            failed: 0,
            conflicts: 0,
            errors: [],
        };
        try {
            for (const item of items) {
                try {
                    const conflictData = await this.conflictService.detectConflict(item);
                    if (conflictData) {
                        await this.queueModel.update({ conflictDetected: true }, { where: { id: item.id }, transaction });
                        const savedConflict = await this.conflictModel.create(conflictData, { transaction });
                        result.conflicts++;
                        if (options?.conflictStrategy &&
                            options.conflictStrategy !== enums_1.ConflictResolution.MANUAL) {
                            const resolution = options.conflictStrategy === enums_1.ConflictResolution.NEWEST_WINS
                                ? enums_1.ConflictResolution.CLIENT_WINS
                                : options.conflictStrategy;
                            await this.conflictService.resolveConflict(userId, savedConflict.id, { resolution });
                            await this.applySyncAction(item);
                            await this.queueModel.update({ synced: true, syncedAt: new Date() }, { where: { id: item.id }, transaction });
                            result.synced++;
                        }
                    }
                    else {
                        await this.applySyncAction(item);
                        await this.queueModel.update({ synced: true, syncedAt: new Date() }, { where: { id: item.id }, transaction });
                        result.synced++;
                    }
                }
                catch (error) {
                    result.failed++;
                    result.errors.push(`Item ${item.id}: ${error}`);
                    this.logError('Error in batch sync item', error);
                    await transaction.rollback();
                    throw error;
                }
            }
            await transaction.commit();
            this.logInfo(`Batch sync completed: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`);
            return result;
        }
        catch (error) {
            this.logError('Batch sync failed, transaction rolled back', error);
            throw error;
        }
    }
};
exports.OfflineSyncService = OfflineSyncService;
exports.OfflineSyncService = OfflineSyncService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SyncQueueItem)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.SyncConflict)),
    __metadata("design:paramtypes", [Object, Object, offline_sync_entity_registry_service_1.OfflineSyncEntityRegistryService,
        offline_sync_watermark_service_1.OfflineSyncWatermarkService,
        offline_sync_queue_service_1.OfflineSyncQueueService,
        offline_sync_conflict_service_1.OfflineSyncConflictService])
], OfflineSyncService);
//# sourceMappingURL=offline-sync.service.js.map