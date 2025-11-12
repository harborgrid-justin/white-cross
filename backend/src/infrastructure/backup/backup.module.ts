/**
 * Backup Module
 *
 * Provides backup and restore services for enterprise data protection
 */

import { Module } from '@nestjs/common';
import { BackupRestoreService } from './backup-restore.service';

@Module({
  providers: [BackupRestoreService],
  exports: [BackupRestoreService],
})
export class BackupModule {}
