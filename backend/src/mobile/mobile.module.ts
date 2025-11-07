import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationService } from '@/mobile/services';
import { OfflineSyncService } from '@/mobile/services';
import { NotificationController } from '@/mobile/controllers';
import { DeviceController } from '@/mobile/controllers';
import { SyncController } from '@/mobile/controllers';
import { DeviceToken } from '@/database';
import { PushNotification } from '@/database';
import { SyncQueueItem } from '@/database';
import { SyncConflict } from '@/database';
import { AuthModule } from '@/auth';

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
  providers: [NotificationService, OfflineSyncService],
  controllers: [NotificationController, DeviceController, SyncController],
  exports: [NotificationService, OfflineSyncService],
})
export class MobileModule {}
