/**
 * SystemConfigurationRepository Implementation
 * Repository for SystemConfiguration data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { SystemConfiguration } from '../../models/administration/SystemConfiguration';
import {
  ISystemConfigurationRepository,
  CreateSystemConfigurationDTO,
  UpdateSystemConfigurationDTO
} from '../interfaces/ISystemConfigurationRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SystemConfigurationRepository
  extends BaseRepository<SystemConfiguration, any, any>
  implements ISystemConfigurationRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(SystemConfiguration, auditLogger, cacheManager, 'SystemConfiguration');
  }
  /**
   * Invalidate SystemConfiguration-related caches
   */
  protected async invalidateCaches(entity: SystemConfiguration): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:systemconfiguration:*`);
    } catch (error) {
      logger.warn('Error invalidating SystemConfiguration caches:', error);
    }
  }

  /**
   * Sanitize SystemConfiguration data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}