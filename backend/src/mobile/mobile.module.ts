import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './services/notification.service';
import { OfflineSyncService } from './services/offline-sync.service';
import { NotificationController } from './controllers/notification.controller';
import { DeviceController } from './controllers/device.controller';
import { SyncController } from './controllers/sync.controller';
import { DeviceToken, PushNotification, SyncQueueItem, SyncConflict } from './entities';

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
    TypeOrmModule.forFeature([
      DeviceToken,
      PushNotification,
      SyncQueueItem,
      SyncConflict
    ])
  ],
  providers: [NotificationService, OfflineSyncService],
  controllers: [NotificationController, DeviceController, SyncController],
  exports: [NotificationService, OfflineSyncService]
})
export class MobileModule {}
