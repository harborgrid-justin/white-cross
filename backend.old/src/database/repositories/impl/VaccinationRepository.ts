/**
 * VaccinationRepository Implementation
 * Repository for Vaccination data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Vaccination } from '../../models/healthcare/Vaccination';
import {
  IVaccinationRepository,
  CreateVaccinationDTO,
  UpdateVaccinationDTO
} from '../interfaces/IVaccinationRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class VaccinationRepository
  extends BaseRepository<Vaccination, any, any>
  implements IVaccinationRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Vaccination, auditLogger, cacheManager, 'Vaccination');
  }
  /**
   * Invalidate Vaccination-related caches
   */
  protected async invalidateCaches(entity: Vaccination): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:vaccination:*`);
    } catch (error) {
      logger.warn('Error invalidating Vaccination caches:', error);
    }
  }

  /**
   * Sanitize Vaccination data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}