/**
 * IntegrationConfigRepository Implementation
 * Auto-generated repository for IntegrationConfig data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IntegrationConfig } from '../../models/integration/IntegrationConfig';
import {
  IIntegrationConfigRepository,
  CreateIntegrationConfigDTO,
  UpdateIntegrationConfigDTO
} from '../interfaces/IIntegrationConfigRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IntegrationConfigRepository
  extends BaseRepository<IntegrationConfig, any, any>
  implements IIntegrationConfigRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IntegrationConfig, auditLogger, cacheManager, 'IntegrationConfig');
  }

  /**
   * Custom IntegrationConfig-specific methods can be added here
   */
}
