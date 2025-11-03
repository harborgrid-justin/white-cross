import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationService } from './services/notification.service';
import { OfflineSyncService } from './services/offline-sync.service';
import { NotificationController } from './controllers/notification.controller';
import { DeviceController } from './controllers/device.controller';
import { SyncController } from './controllers/sync.controller';
import { DeviceToken } from '../database/models/device-token.model';
import { PushNotification } from '../database/models/push-notification.model';
import { SyncQueueItem } from '../database/models/sync-queue-item.model';
import { SyncConflict } from '../database/models/sync-conflict.model';
import { AuthModule } from '../auth/auth.module';

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
      SyncConflict
    ])
  ],
  providers: [NotificationService, OfflineSyncService],
  controllers: [NotificationController, DeviceController, SyncController],
  exports: [NotificationService, OfflineSyncService]
})
export class MobileModule {}
