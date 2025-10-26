/**
 * ScreeningRepository Implementation
 * Repository for Screening data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Screening } from '../../models/healthcare/Screening';
import {
  IScreeningRepository,
  CreateScreeningDTO,
  UpdateScreeningDTO
} from '../interfaces/IScreeningRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ScreeningRepository
  extends BaseRepository<Screening, any, any>
  implements IScreeningRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Screening, auditLogger, cacheManager, 'Screening');
  }
  /**
   * Invalidate Screening-related caches
   */
  protected async invalidateCaches(entity: Screening): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:screening:*`);
    } catch (error) {
      logger.warn('Error invalidating Screening caches:', error);
    }
  }

  /**
   * Sanitize Screening data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}