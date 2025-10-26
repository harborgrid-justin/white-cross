/**
 * ConfigurationHistoryRepository Implementation
 * Repository for ConfigurationHistory data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ConfigurationHistory } from '../../models/administration/ConfigurationHistory';
import {
  IConfigurationHistoryRepository,
  CreateConfigurationHistoryDTO,
  UpdateConfigurationHistoryDTO
} from '../interfaces/IConfigurationHistoryRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ConfigurationHistoryRepository
  extends BaseRepository<ConfigurationHistory, any, any>
  implements IConfigurationHistoryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ConfigurationHistory, auditLogger, cacheManager, 'ConfigurationHistory');
  }

  protected async invalidateCaches(entity: ConfigurationHistory): Promise<void> {
    try {
      await this.cacheManager.deletePattern(`white-cross:configurationhistory:*`);
    } catch (error) {
      logger.warn('Error invalidating configuration history caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
