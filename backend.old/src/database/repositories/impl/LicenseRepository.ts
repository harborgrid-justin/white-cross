/**
 * LicenseRepository Implementation
 * Repository for License data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { License } from '../../models/administration/License';
import {
  ILicenseRepository,
  CreateLicenseDTO,
  UpdateLicenseDTO
} from '../interfaces/ILicenseRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class LicenseRepository
  extends BaseRepository<License, any, any>
  implements ILicenseRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(License, auditLogger, cacheManager, 'License');
  }
  /**
   * Invalidate License-related caches
   */
  protected async invalidateCaches(entity: License): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:license:*`);
    } catch (error) {
      logger.warn('Error invalidating License caches:', error);
    }
  }

  /**
   * Sanitize License data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}