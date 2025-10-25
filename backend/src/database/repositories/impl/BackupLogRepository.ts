/**
 * BackupLogRepository Implementation
 * Auto-generated repository for BackupLog data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { BackupLog } from '../../models/administration/BackupLog';
import {
  IBackupLogRepository,
  CreateBackupLogDTO,
  UpdateBackupLogDTO
} from '../interfaces/IBackupLogRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class BackupLogRepository
  extends BaseRepository<BackupLog, any, any>
  implements IBackupLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(BackupLog, auditLogger, cacheManager, 'BackupLog');
  }

  /**
   * Custom BackupLog-specific methods can be added here
   */
}
