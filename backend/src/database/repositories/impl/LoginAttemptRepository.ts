/**
 * LoginAttemptRepository Implementation
 * Repository for LoginAttempt data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { LoginAttempt } from '../../models/security/LoginAttempt';
import {
  ILoginAttemptRepository,
  CreateLoginAttemptDTO,
  UpdateLoginAttemptDTO
} from '../interfaces/ILoginAttemptRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class LoginAttemptRepository
  extends BaseRepository<LoginAttempt, any, any>
  implements ILoginAttemptRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(LoginAttempt, auditLogger, cacheManager, 'LoginAttempt');
  }
  /**
   * Invalidate LoginAttempt-related caches
   */
  protected async invalidateCaches(entity: LoginAttempt): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:loginattempt:*`);
    } catch (error) {
      logger.warn('Error invalidating LoginAttempt caches:', error);
    }
  }

  /**
   * Sanitize LoginAttempt data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}