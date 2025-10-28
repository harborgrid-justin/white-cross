/**
 * MedicationLogRepository Implementation
 * Repository for MedicationLog data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MedicationLog } from '../../models/medications/MedicationLog';
import {
  IMedicationLogRepository,
  CreateMedicationLogDTO,
  UpdateMedicationLogDTO
} from '../interfaces/IMedicationLogRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MedicationLogRepository
  extends BaseRepository<MedicationLog, any, any>
  implements IMedicationLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MedicationLog, auditLogger, cacheManager, 'MedicationLog');
  }
  /**
   * Invalidate MedicationLog-related caches
   */
  protected async invalidateCaches(entity: MedicationLog): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:medicationlog:*`);
    } catch (error) {
      logger.warn('Error invalidating MedicationLog caches:', error);
    }
  }

  /**
   * Sanitize MedicationLog data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}