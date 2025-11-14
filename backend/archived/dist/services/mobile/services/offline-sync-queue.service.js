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
exports.OfflineSyncQueueService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const enums_1 = require("../enums");
const base_1 = require("../../../common/base");
let OfflineSyncQueueService = class OfflineSyncQueueService extends base_1.BaseService {
    queueModel;
    conflictModel;
    MAX_SYNC_ATTEMPTS = 3;
    constructor(queueModel, conflictModel) {
        super("OfflineSyncQueueService");
        this.queueModel = queueModel;
        this.conflictModel = conflictModel;
        this.logInfo('OfflineSyncQueueService initialized');
    }
    async queueAction(userId, dto) {
        try {
            const queueItem = await this.queueModel.create({
                deviceId: dto.deviceId,
                userId,
                actionType: dto.actionType,
                entityType: dto.entityType,
                entityId: dto.entityId,
                data: dto.data,
                timestamp: new Date(),
                synced: false,
                attempts: 0,
                maxAttempts: 3,
                conflictDetected: false,
                priority: dto.priority || enums_1.SyncPriority.NORMAL,
                requiresOnline: true,
            });
            this.logInfo(`Sync action queued: ${queueItem.id} - ${dto.actionType} ${dto.entityType}`);
            return queueItem;
        }
        catch (error) {
            this.logError('Error queueing sync action', error);
            throw error;
        }
    }
    async getStatistics(userId, deviceId) {
        const entityIds = await this.getEntityIds(deviceId, userId);
        const queuedItems = await this.queueModel.count({
            where: { deviceId, userId },
        });
        const pendingItems = await this.queueModel.count({
            where: { deviceId, userId, synced: false },
        });
        const syncedItems = await this.queueModel.count({
            where: { deviceId, userId, synced: true },
        });
        const failedItems = await this.queueModel.count({
            where: {
                deviceId,
                userId,
                synced: false,
                attempts: { [sequelize_2.Op.gte]: this.MAX_SYNC_ATTEMPTS },
            },
        });
        const conflictsDetected = await this.conflictModel.count({
            where: { entityId: { [sequelize_2.Op.in]: entityIds } },
        });
        const conflictsResolved = await this.conflictModel.count({
            where: {
                entityId: { [sequelize_2.Op.in]: entityIds },
                status: enums_1.SyncStatus.RESOLVED,
            },
        });
        const conflictsPending = await this.conflictModel.count({
            where: {
                entityId: { [sequelize_2.Op.in]: entityIds },
                status: enums_1.SyncStatus.PENDING,
            },
        });
        const lastSyncedItem = await this.queueModel.findOne({
            where: { deviceId, userId, synced: true },
            order: [['syncedAt', 'DESC']],
        });
        return {
            deviceId,
            lastSyncAt: lastSyncedItem?.syncedAt,
            queuedItems,
            pendingItems,
            syncedItems,
            failedItems,
            conflictsDetected,
            conflictsResolved,
            conflictsPending,
        };
    }
    async listConflicts(userId, deviceId) {
        const entityIds = await this.getEntityIds(deviceId, userId);
        return this.conflictModel.findAll({
            where: {
                entityId: { [sequelize_2.Op.in]: entityIds },
                status: enums_1.SyncStatus.PENDING,
            },
            order: [['createdAt', 'DESC']],
        });
    }
    async getPendingItems(userId, deviceId, batchSize = 50, retryFailed = false) {
        const whereCondition = {
            deviceId,
            userId,
            synced: false,
        };
        if (retryFailed) {
            whereCondition.attempts = { [sequelize_2.Op.lt]: this.MAX_SYNC_ATTEMPTS };
        }
        return this.queueModel.findAll({
            where: whereCondition,
            order: [
                ['priority', 'ASC'],
                ['timestamp', 'ASC'],
            ],
            limit: batchSize,
        });
    }
    async markAsSynced(itemId, syncedAt = new Date()) {
        await this.queueModel.update({ synced: true, syncedAt }, { where: { id: itemId } });
        this.logInfo(`Queue item ${itemId} marked as synced`);
    }
    async updateAttempts(itemId, attempts, error) {
        const updateData = { attempts };
        if (error) {
            updateData.lastError = error;
        }
        await this.queueModel.update(updateData, { where: { id: itemId } });
    }
    async markConflictDetected(itemId) {
        await this.queueModel.update({ conflictDetected: true }, { where: { id: itemId } });
    }
    async updateConflictResolution(itemId, resolution) {
        await this.queueModel.update({ conflictResolution: resolution }, { where: { id: itemId } });
    }
    async getEntityIds(deviceId, userId) {
        const items = await this.queueModel.findAll({
            where: { deviceId, userId },
            attributes: ['entityId'],
        });
        return items.map((item) => item.entityId);
    }
};
exports.OfflineSyncQueueService = OfflineSyncQueueService;
exports.OfflineSyncQueueService = OfflineSyncQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SyncQueueItem)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.SyncConflict)),
    __metadata("design:paramtypes", [Object, Object])
], OfflineSyncQueueService);
//# sourceMappingURL=offline-sync-queue.service.js.map