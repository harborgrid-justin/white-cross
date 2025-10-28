/**
 * TrainingCompletionRepository Implementation
 * Repository for TrainingCompletion data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { TrainingCompletion } from '../../models/administration/TrainingCompletion';
import {
  ITrainingCompletionRepository,
  CreateTrainingCompletionDTO,
  UpdateTrainingCompletionDTO
} from '../interfaces/ITrainingCompletionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class TrainingCompletionRepository
  extends BaseRepository<TrainingCompletion, any, any>
  implements ITrainingCompletionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(TrainingCompletion, auditLogger, cacheManager, 'TrainingCompletion');
  }
  /**
   * Invalidate TrainingCompletion-related caches
   */
  protected async invalidateCaches(entity: TrainingCompletion): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:trainingcompletion:*`);
    } catch (error) {
      logger.warn('Error invalidating TrainingCompletion caches:', error);
    }
  }

  /**
   * Sanitize TrainingCompletion data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}