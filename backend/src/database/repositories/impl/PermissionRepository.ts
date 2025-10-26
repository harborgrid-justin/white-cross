/**
 * PermissionRepository Implementation
 * Repository for Permission data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Permission } from '../../models/security/Permission';
import {
  IPermissionRepository,
  CreatePermissionDTO,
  UpdatePermissionDTO
} from '../interfaces/IPermissionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PermissionRepository
  extends BaseRepository<Permission, any, any>
  implements IPermissionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Permission, auditLogger, cacheManager, 'Permission');
  }
  /**
   * Invalidate Permission-related caches
   */
  protected async invalidateCaches(entity: Permission): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:permission:*`);
    } catch (error) {
      logger.warn('Error invalidating Permission caches:', error);
    }
  }

  /**
   * Sanitize Permission data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}