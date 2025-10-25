/**
 * TrainingCompletionRepository Implementation
 * Auto-generated repository for TrainingCompletion data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { TrainingCompletion } from '../../models/administration/TrainingCompletion';
import {
  ITrainingCompletionRepository,
  CreateTrainingCompletionDTO,
  UpdateTrainingCompletionDTO
} from '../interfaces/ITrainingCompletionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom TrainingCompletion-specific methods can be added here
   */
}
