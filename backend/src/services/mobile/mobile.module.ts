import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  NotificationService,
  NotificationPlatformService,
  NotificationTemplateService,
  NotificationDeliveryService,
  NotificationSchedulerService,
  NotificationAnalyticsService,
  DeviceTokenService,
  OfflineSyncService,
} from './services';
import { OfflineSyncEntityRegistryService } from './services/offline-sync-entity-registry.service';
import { OfflineSyncWatermarkService } from './services/offline-sync-watermark.service';
import { OfflineSyncQueueService } from './services/offline-sync-queue.service';
import { OfflineSyncConflictService } from './services/offline-sync-conflict.service';
import { DeviceController, NotificationController, SyncController } from './controllers';
import { DeviceToken, PushNotification, SyncConflict, SyncQueueItem } from './entities';
import { AuthModule } from '../auth';

/**
 * Mobile Module
 * Handles mobile app support, push notifications, and offline synchronization
 *
 * Features:
 * - Device token management
 * - Push notifications (FCM, APNS, Web Push)
 * - Offline data synchronization
 * - Conflict resolution
 * - Notification analytics
 */
@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      DeviceToken,
      PushNotification,
      SyncQueueItem,
      SyncConflict,
    ]),
  ],
  providers: [
    // Main orchestration service
    NotificationService,
    // Specialized notification services
    NotificationPlatformService,
    NotificationTemplateService,
    NotificationDeliveryService,
    NotificationSchedulerService,
    NotificationAnalyticsService,
    DeviceTokenService,
    // Sync service and its dependencies
    OfflineSyncService,
    OfflineSyncEntityRegistryService,
    OfflineSyncWatermarkService,
    OfflineSyncQueueService,
    OfflineSyncConflictService,
  ],
  controllers: [NotificationController, DeviceController, SyncController],
  exports: [NotificationService, OfflineSyncService],
})
export class MobileModule {}
