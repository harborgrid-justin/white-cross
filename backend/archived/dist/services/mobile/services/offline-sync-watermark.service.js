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
exports.OfflineSyncWatermarkService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let OfflineSyncWatermarkService = class OfflineSyncWatermarkService extends base_1.BaseService {
    queueModel;
    syncWatermarks = new Map();
    constructor(queueModel) {
        super("OfflineSyncWatermarkService");
        this.queueModel = queueModel;
        this.logInfo('OfflineSyncWatermarkService initialized');
    }
    async getSyncWatermark(deviceId, entityType) {
        const key = `${deviceId}:${entityType}`;
        let watermark = this.syncWatermarks.get(key);
        if (!watermark) {
            const lastSync = await this.queueModel.findOne({
                where: { deviceId, entityType, synced: true },
                order: [['syncedAt', 'DESC']],
            });
            watermark = {
                deviceId,
                entityType,
                lastSyncTimestamp: lastSync?.syncedAt || new Date(0),
                lastEntityVersion: 0,
            };
            this.syncWatermarks.set(key, watermark);
        }
        return watermark;
    }
    async updateSyncWatermark(deviceId, entityType, timestamp) {
        const key = `${deviceId}:${entityType}`;
        const watermark = await this.getSyncWatermark(deviceId, entityType);
        watermark.lastSyncTimestamp = timestamp;
        this.syncWatermarks.set(key, watermark);
        this.logInfo(`Updated sync watermark for ${deviceId}:${entityType} to ${timestamp.toISOString()}`);
    }
    async getChangedEntities(deviceId, entityType) {
        const watermark = await this.getSyncWatermark(deviceId, entityType);
        const items = await this.queueModel.findAll({
            where: {
                entityType,
                synced: true,
            },
            attributes: ['entityId', 'syncedAt'],
            order: [['syncedAt', 'DESC']],
        });
        const changedEntityIds = items
            .filter((item) => item.syncedAt > watermark.lastSyncTimestamp)
            .map((item) => item.entityId);
        return [...new Set(changedEntityIds)];
    }
    clearWatermark(deviceId, entityType) {
        if (entityType) {
            const key = `${deviceId}:${entityType}`;
            this.syncWatermarks.delete(key);
            this.logInfo(`Cleared watermark for ${key}`);
        }
        else {
            const keysToDelete = [];
            this.syncWatermarks.forEach((_, key) => {
                if (key.startsWith(`${deviceId}:`)) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach((key) => this.syncWatermarks.delete(key));
            this.logInfo(`Cleared all watermarks for device ${deviceId}`);
        }
    }
    clearAllWatermarks() {
        this.syncWatermarks.clear();
        this.logInfo('All watermarks cleared from cache');
    }
};
exports.OfflineSyncWatermarkService = OfflineSyncWatermarkService;
exports.OfflineSyncWatermarkService = OfflineSyncWatermarkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SyncQueueItem)),
    __metadata("design:paramtypes", [Object])
], OfflineSyncWatermarkService);
//# sourceMappingURL=offline-sync-watermark.service.js.map