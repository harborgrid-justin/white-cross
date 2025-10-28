/**
 * VitalSignsRepository Implementation
 * Repository for VitalSigns data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { VitalSigns } from '../../models/healthcare/VitalSigns';
import {
  IVitalSignsRepository,
  CreateVitalSignsDTO,
  UpdateVitalSignsDTO
} from '../interfaces/IVitalSignsRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class VitalSignsRepository
  extends BaseRepository<VitalSigns, any, any>
  implements IVitalSignsRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(VitalSigns, auditLogger, cacheManager, 'VitalSigns');
  }
  /**
   * Invalidate VitalSigns-related caches
   */
  protected async invalidateCaches(entity: VitalSigns): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:vitalsigns:*`);
    } catch (error) {
      logger.warn('Error invalidating VitalSigns caches:', error);
    }
  }

  /**
   * Sanitize VitalSigns data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}