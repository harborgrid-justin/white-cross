/**
 * UserRoleAssignmentRepository Implementation
 * Repository for UserRoleAssignment data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { UserRoleAssignment } from '../../models/security/UserRoleAssignment';
import {
  IUserRoleAssignmentRepository,
  CreateUserRoleAssignmentDTO,
  UpdateUserRoleAssignmentDTO
} from '../interfaces/IUserRoleAssignmentRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class UserRoleAssignmentRepository
  extends BaseRepository<UserRoleAssignment, any, any>
  implements IUserRoleAssignmentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(UserRoleAssignment, auditLogger, cacheManager, 'UserRoleAssignment');
  }
  /**
   * Invalidate UserRoleAssignment-related caches
   */
  protected async invalidateCaches(entity: UserRoleAssignment): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:userroleassignment:*`);
    } catch (error) {
      logger.warn('Error invalidating UserRoleAssignment caches:', error);
    }
  }

  /**
   * Sanitize UserRoleAssignment data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}