/**
 * MaintenanceLogRepository Implementation
 * Repository for MaintenanceLog data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MaintenanceLog } from '../../models/inventory/MaintenanceLog';
import {
  IMaintenanceLogRepository,
  CreateMaintenanceLogDTO,
  UpdateMaintenanceLogDTO
} from '../interfaces/IMaintenanceLogRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MaintenanceLogRepository
  extends BaseRepository<MaintenanceLog, any, any>
  implements IMaintenanceLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MaintenanceLog, auditLogger, cacheManager, 'MaintenanceLog');
  }
  /**
   * Invalidate MaintenanceLog-related caches
   */
  protected async invalidateCaches(entity: MaintenanceLog): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:maintenancelog:*`);
    } catch (error) {
      logger.warn('Error invalidating MaintenanceLog caches:', error);
    }
  }

  /**
   * Sanitize MaintenanceLog data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}