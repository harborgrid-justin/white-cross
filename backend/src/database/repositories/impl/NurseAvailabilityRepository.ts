/**
 * NurseAvailabilityRepository Implementation
 * Repository for NurseAvailability data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { NurseAvailability } from '../../models/healthcare/NurseAvailability';
import {
  INurseAvailabilityRepository,
  CreateNurseAvailabilityDTO,
  UpdateNurseAvailabilityDTO
} from '../interfaces/INurseAvailabilityRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class NurseAvailabilityRepository
  extends BaseRepository<NurseAvailability, any, any>
  implements INurseAvailabilityRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(NurseAvailability, auditLogger, cacheManager, 'NurseAvailability');
  }
  /**
   * Invalidate NurseAvailability-related caches
   */
  protected async invalidateCaches(entity: NurseAvailability): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:nurseavailability:*`);
    } catch (error) {
      logger.warn('Error invalidating NurseAvailability caches:', error);
    }
  }

  /**
   * Sanitize NurseAvailability data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}