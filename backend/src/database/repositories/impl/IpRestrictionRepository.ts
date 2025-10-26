/**
 * IpRestrictionRepository Implementation
 * Repository for IpRestriction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IpRestriction } from '../../models/security/IpRestriction';
import {
  IIpRestrictionRepository,
  CreateIpRestrictionDTO,
  UpdateIpRestrictionDTO
} from '../interfaces/IIpRestrictionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IpRestrictionRepository
  extends BaseRepository<IpRestriction, any, any>
  implements IIpRestrictionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IpRestriction, auditLogger, cacheManager, 'IpRestriction');
  }
  /**
   * Invalidate IpRestriction-related caches
   */
  protected async invalidateCaches(entity: IpRestriction): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:iprestriction:*`);
    } catch (error) {
      logger.warn('Error invalidating IpRestriction caches:', error);
    }
  }

  /**
   * Sanitize IpRestriction data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}