/**
 * RolePermissionRepository Implementation
 * Repository for RolePermission data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { RolePermission } from '../../models/security/RolePermission';
import {
  IRolePermissionRepository,
  CreateRolePermissionDTO,
  UpdateRolePermissionDTO
} from '../interfaces/IRolePermissionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class RolePermissionRepository
  extends BaseRepository<RolePermission, any, any>
  implements IRolePermissionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(RolePermission, auditLogger, cacheManager, 'RolePermission');
  }
  /**
   * Invalidate RolePermission-related caches
   */
  protected async invalidateCaches(entity: RolePermission): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:rolepermission:*`);
    } catch (error) {
      logger.warn('Error invalidating RolePermission caches:', error);
    }
  }

  /**
   * Sanitize RolePermission data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}