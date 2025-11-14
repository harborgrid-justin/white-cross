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
exports.OfflineSyncConflictService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const enums_1 = require("../enums");
const offline_sync_entity_registry_service_1 = require("./offline-sync-entity-registry.service");
const base_1 = require("../../../common/base");
let OfflineSyncConflictService = class OfflineSyncConflictService extends base_1.BaseService {
    conflictModel;
    entityRegistry;
    constructor(conflictModel, entityRegistry) {
        super("OfflineSyncConflictService");
        this.conflictModel = conflictModel;
        this.entityRegistry = entityRegistry;
        this.logInfo('OfflineSyncConflictService initialized');
    }
    async detectConflict(item) {
        try {
            if (item.actionType === enums_1.SyncActionType.CREATE) {
                return null;
            }
            if (item.actionType === enums_1.SyncActionType.READ) {
                return null;
            }
            const entityService = this.entityRegistry.getEntityService(item.entityType);
            const serverEntity = await entityService.findById(item.entityId);
            if (!serverEntity) {
                if (item.actionType === enums_1.SyncActionType.UPDATE) {
                    return this.createConflictData(item, null, {
                        id: item.entityId,
                        version: 0,
                        updatedAt: new Date(),
                        updatedBy: 'system',
                    });
                }
                return null;
            }
            const serverVersion = await entityService.getVersion(item.entityId);
            if (!serverVersion) {
                return this.detectTimestampConflict(item, serverEntity);
            }
            if (serverVersion.updatedAt > item.timestamp) {
                return this.createConflictData(item, serverEntity, serverVersion);
            }
            const clientData = item.data;
            const clientVersion = clientData.version;
            if (clientVersion !== undefined &&
                typeof clientVersion === 'number' &&
                clientVersion < serverVersion.version) {
                return this.createConflictData(item, serverEntity, serverVersion);
            }
            if (serverVersion.checksum) {
                const clientChecksum = this.calculateChecksum(clientData);
                const serverChecksum = serverVersion.checksum;
                if (clientChecksum !== serverChecksum) {
                    const timeDiff = Math.abs(serverVersion.updatedAt.getTime() - item.timestamp.getTime());
                    if (timeDiff < 5000) {
                        return this.createConflictData(item, serverEntity, serverVersion);
                    }
                }
            }
            return null;
        }
        catch (error) {
            this.logError(`Error detecting conflict for item ${item.id}`, error);
            return null;
        }
    }
    detectTimestampConflict(item, serverEntity) {
        const serverUpdatedAt = serverEntity.updatedAt || serverEntity.updated_at;
        if (!serverUpdatedAt) {
            return null;
        }
        const serverDate = new Date(serverUpdatedAt);
        const clientDate = new Date(item.timestamp);
        if (serverDate > clientDate) {
            return this.createConflictData(item, serverEntity, {
                id: item.entityId,
                version: serverEntity.version || 0,
                updatedAt: serverDate,
                updatedBy: serverEntity.updatedBy || 'unknown',
            });
        }
        return null;
    }
    createConflictData(item, serverEntity, serverVersion) {
        const clientVersion = {
            data: item.data,
            timestamp: item.timestamp,
            userId: item.userId,
        };
        const serverVersionData = {
            data: serverEntity || { _deleted: true },
            timestamp: serverVersion.updatedAt,
            userId: serverVersion.updatedBy,
        };
        const conflictData = {
            queueItemId: item.id,
            entityType: item.entityType,
            entityId: item.entityId,
            clientVersion,
            serverVersion: serverVersionData,
            status: enums_1.SyncStatus.PENDING,
        };
        this.logWarning(`Conflict detected for ${item.entityType}:${item.entityId} - ` +
            `Client: ${item.timestamp.toISOString()}, Server: ${serverVersion.updatedAt.toISOString()}`);
        return conflictData;
    }
    async resolveConflict(userId, conflictId, dto) {
        const conflict = await this.conflictModel.findOne({
            where: { id: conflictId },
        });
        if (!conflict) {
            throw new common_1.NotFoundException('Conflict not found');
        }
        conflict.resolution = dto.resolution;
        conflict.resolvedAt = new Date();
        conflict.resolvedBy = userId;
        conflict.status = enums_1.SyncStatus.RESOLVED;
        switch (dto.resolution) {
            case enums_1.ConflictResolution.CLIENT_WINS:
                conflict.mergedData = conflict.clientVersion.data;
                break;
            case enums_1.ConflictResolution.SERVER_WINS:
                conflict.mergedData = conflict.serverVersion.data;
                break;
            case enums_1.ConflictResolution.MERGE:
                conflict.mergedData =
                    dto.mergedData ||
                        this.mergeData(conflict.clientVersion.data, conflict.serverVersion.data);
                break;
            case enums_1.ConflictResolution.MANUAL:
                if (!dto.mergedData) {
                    throw new Error('Manual resolution requires mergedData');
                }
                conflict.mergedData = dto.mergedData;
                break;
            default:
                throw new Error(`Unknown conflict resolution: ${dto.resolution}`);
        }
        const resolved = await conflict.save();
        this.logInfo(`Conflict resolved: ${conflictId} using ${dto.resolution}`);
        return resolved;
    }
    calculateChecksum(data) {
        const str = JSON.stringify(data, Object.keys(data).sort());
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    mergeData(clientData, serverData) {
        const merged = { ...serverData };
        for (const key in clientData) {
            const clientValue = clientData[key];
            const serverValue = serverData[key];
            if (serverValue === null || serverValue === undefined) {
                merged[key] = clientValue;
            }
            else if (key.includes('Date') || key.includes('At')) {
                const clientDate = new Date(clientValue);
                const serverDate = new Date(serverValue);
                if (clientDate > serverDate) {
                    merged[key] = clientValue;
                }
            }
            else if (Array.isArray(clientValue) && Array.isArray(serverValue)) {
                merged[key] = [...new Set([...serverValue, ...clientValue])];
            }
        }
        return merged;
    }
    async createConflict(conflictData) {
        return this.conflictModel.create(conflictData);
    }
    async getConflictById(conflictId) {
        return this.conflictModel.findOne({ where: { id: conflictId } });
    }
};
exports.OfflineSyncConflictService = OfflineSyncConflictService;
exports.OfflineSyncConflictService = OfflineSyncConflictService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SyncConflict)),
    __metadata("design:paramtypes", [Object, offline_sync_entity_registry_service_1.OfflineSyncEntityRegistryService])
], OfflineSyncConflictService);
//# sourceMappingURL=offline-sync-conflict.service.js.map