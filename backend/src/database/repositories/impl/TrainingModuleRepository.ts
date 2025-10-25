/**
 * TrainingModuleRepository Implementation
 * Auto-generated repository for TrainingModule data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { TrainingModule } from '../../models/administration/TrainingModule';
import {
  ITrainingModuleRepository,
  CreateTrainingModuleDTO,
  UpdateTrainingModuleDTO
} from '../interfaces/ITrainingModuleRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom TrainingModule-specific methods can be added here
   */
}
