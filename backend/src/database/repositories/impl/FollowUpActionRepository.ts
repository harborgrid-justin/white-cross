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
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class FollowUpActionRepository
  extends BaseRepository<FollowUpAction, any, any>
  implements IFollowUpActionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(FollowUpAction, auditLogger, cacheManager, 'FollowUpAction');
  }
}
