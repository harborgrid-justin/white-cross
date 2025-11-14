"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const services_1 = require("./services");
const offline_sync_entity_registry_service_1 = require("./services/offline-sync-entity-registry.service");
const offline_sync_watermark_service_1 = require("./services/offline-sync-watermark.service");
const offline_sync_queue_service_1 = require("./services/offline-sync-queue.service");
const offline_sync_conflict_service_1 = require("./services/offline-sync-conflict.service");
const controllers_1 = require("./controllers");
const models_1 = require("../../database/models");
const auth_1 = require("../auth");
let MobileModule = class MobileModule {
};
exports.MobileModule = MobileModule;
exports.MobileModule = MobileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            sequelize_1.SequelizeModule.forFeature([
                models_1.DeviceToken,
                models_1.PushNotification,
                models_1.SyncQueueItem,
                models_1.SyncConflict,
            ]),
        ],
        providers: [
            services_1.NotificationService,
            services_1.NotificationPlatformService,
            services_1.NotificationTemplateService,
            services_1.NotificationDeliveryService,
            services_1.NotificationSchedulerService,
            services_1.NotificationAnalyticsService,
            services_1.DeviceTokenService,
            services_1.OfflineSyncService,
            offline_sync_entity_registry_service_1.OfflineSyncEntityRegistryService,
            offline_sync_watermark_service_1.OfflineSyncWatermarkService,
            offline_sync_queue_service_1.OfflineSyncQueueService,
            offline_sync_conflict_service_1.OfflineSyncConflictService,
        ],
        controllers: [controllers_1.NotificationController, controllers_1.DeviceController, controllers_1.SyncController],
        exports: [services_1.NotificationService, services_1.OfflineSyncService],
    })
], MobileModule);
//# sourceMappingURL=mobile.module.js.map