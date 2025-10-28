/**
 * FollowUpActionRepository Implementation
 * Repository for FollowUpAction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { FollowUpAction } from '../../models/incidents/FollowUpAction';
import {
  IFollowUpActionRepository,
  CreateFollowUpActionDTO,
  UpdateFollowUpActionDTO
} from '../interfaces/IFollowUpActionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class FollowUpActionRepository
  extends BaseRepository<FollowUpAction, any, any>
  implements IFollowUpActionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(FollowUpAction, auditLogger, cacheManager, 'FollowUpAction');
  }

  protected async invalidateCaches(entity: FollowUpAction): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:followupaction:incident:${data.incidentReportId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating follow-up action caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
