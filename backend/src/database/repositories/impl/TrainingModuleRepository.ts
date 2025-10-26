/**
 * TrainingModuleRepository Implementation
 * Repository for TrainingModule data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { TrainingModule } from '../../models/administration/TrainingModule';
import {
  ITrainingModuleRepository,
  CreateTrainingModuleDTO,
  UpdateTrainingModuleDTO
} from '../interfaces/ITrainingModuleRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class TrainingModuleRepository
  extends BaseRepository<TrainingModule, any, any>
  implements ITrainingModuleRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(TrainingModule, auditLogger, cacheManager, 'TrainingModule');
  }
  /**
   * Invalidate TrainingModule-related caches
   */
  protected async invalidateCaches(entity: TrainingModule): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:trainingmodule:*`);
    } catch (error) {
      logger.warn('Error invalidating TrainingModule caches:', error);
    }
  }

  /**
   * Sanitize TrainingModule data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}