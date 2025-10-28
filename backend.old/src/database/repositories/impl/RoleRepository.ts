/**
 * RoleRepository Implementation
 * Repository for Role data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Role } from '../../models/security/Role';
import {
  IRoleRepository,
  CreateRoleDTO,
  UpdateRoleDTO
} from '../interfaces/IRoleRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class RoleRepository
  extends BaseRepository<Role, any, any>
  implements IRoleRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Role, auditLogger, cacheManager, 'Role');
  }
  /**
   * Invalidate Role-related caches
   */
  protected async invalidateCaches(entity: Role): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:role:*`);
    } catch (error) {
      logger.warn('Error invalidating Role caches:', error);
    }
  }

  /**
   * Sanitize Role data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}