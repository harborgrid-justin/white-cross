/**
 * IntegrationConfigRepository Implementation
 * Repository for IntegrationConfig data access with CRUD operations
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
}
