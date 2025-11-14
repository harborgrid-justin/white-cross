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
exports.SyncController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const offline_sync_service_1 = require("../services/offline-sync.service");
const dto_1 = require("../dto");
const base_1 = require("../../../common/base");
let SyncController = class SyncController extends base_1.BaseController {
    offlineSyncService;
    constructor(offlineSyncService) {
        super();
        this.offlineSyncService = offlineSyncService;
    }
    async queueAction(userId, dto) {
        return this.offlineSyncService.queueAction(userId, dto);
    }
    async processPending(userId, deviceId, options) {
        return this.offlineSyncService.syncPendingActions(userId, deviceId, options);
    }
    async getStatistics(userId, deviceId) {
        return this.offlineSyncService.getStatistics(userId, deviceId);
    }
    async listConflicts(userId, deviceId) {
        return this.offlineSyncService.listConflicts(userId, deviceId);
    }
    async resolveConflict(userId, conflictId, dto) {
        return this.offlineSyncService.resolveConflict(userId, conflictId, dto);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('queue'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue a sync action for offline processing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sync action queued successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/sync-queue-item.model").SyncQueueItem }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.QueueSyncActionDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "queueAction", null);
__decorate([
    (0, common_1.Post)('process'),
    (0, swagger_1.ApiOperation)({ summary: 'Process pending sync actions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sync processing completed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('deviceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.SyncOptionsDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "processPending", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sync statistics for a device' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('conflicts'),
    (0, swagger_1.ApiOperation)({ summary: 'List pending conflicts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conflicts retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/sync-conflict.model").SyncConflict] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "listConflicts", null);
__decorate([
    (0, common_1.Post)('conflicts/:id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a sync conflict' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conflict resolved successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/sync-conflict.model").SyncConflict }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.ResolveConflictDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "resolveConflict", null);
exports.SyncController = SyncController = __decorate([
    (0, swagger_1.ApiTags)('mobile-sync'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mobile/sync'),
    __metadata("design:paramtypes", [offline_sync_service_1.OfflineSyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map