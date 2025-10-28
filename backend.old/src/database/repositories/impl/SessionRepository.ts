/**
 * SessionRepository Implementation
 * Repository for Session data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Session } from '../../models/security/Session';
import {
  ISessionRepository,
  CreateSessionDTO,
  UpdateSessionDTO
} from '../interfaces/ISessionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SessionRepository
  extends BaseRepository<Session, any, any>
  implements ISessionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Session, auditLogger, cacheManager, 'Session');
  }
  /**
   * Invalidate Session-related caches
   */
  protected async invalidateCaches(entity: Session): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:session:*`);
    } catch (error) {
      logger.warn('Error invalidating Session caches:', error);
    }
  }

  /**
   * Sanitize Session data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}