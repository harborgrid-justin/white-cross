/**
 * IntegrationConfigRepository Implementation
 * Repository for IntegrationConfig data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IntegrationConfig } from '../../models/integration/IntegrationConfig';
import {
  IIntegrationConfigRepository,
  CreateIntegrationConfigDTO,
  UpdateIntegrationConfigDTO
} from '../interfaces/IIntegrationConfigRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IntegrationConfigRepository
  extends BaseRepository<IntegrationConfig, any, any>
  implements IIntegrationConfigRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IntegrationConfig, auditLogger, cacheManager, 'IntegrationConfig');
  }
  /**
   * Invalidate IntegrationConfig-related caches
   */
  protected async invalidateCaches(entity: IntegrationConfig): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:integrationconfig:*`);
    } catch (error) {
      logger.warn('Error invalidating IntegrationConfig caches:', error);
    }
  }

  /**
   * Sanitize IntegrationConfig data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}