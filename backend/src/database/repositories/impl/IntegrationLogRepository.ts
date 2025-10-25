/**
 * IntegrationLogRepository Implementation
 * Auto-generated repository for IntegrationLog data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IntegrationLog } from '../../models/integration/IntegrationLog';
import {
  IIntegrationLogRepository,
  CreateIntegrationLogDTO,
  UpdateIntegrationLogDTO
} from '../interfaces/IIntegrationLogRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IntegrationLogRepository
  extends BaseRepository<IntegrationLog, any, any>
  implements IIntegrationLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IntegrationLog, auditLogger, cacheManager, 'IntegrationLog');
  }

  /**
   * Custom IntegrationLog-specific methods can be added here
   */
}
