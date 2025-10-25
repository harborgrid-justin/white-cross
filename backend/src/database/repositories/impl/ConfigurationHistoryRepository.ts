/**
 * ConfigurationHistoryRepository Implementation
 * Auto-generated repository for ConfigurationHistory data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ConfigurationHistory } from '../../models/administration/ConfigurationHistory';
import {
  IConfigurationHistoryRepository,
  CreateConfigurationHistoryDTO,
  UpdateConfigurationHistoryDTO
} from '../interfaces/IConfigurationHistoryRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ConfigurationHistoryRepository
  extends BaseRepository<ConfigurationHistory, any, any>
  implements IConfigurationHistoryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ConfigurationHistory, auditLogger, cacheManager, 'ConfigurationHistory');
  }

  /**
   * Custom ConfigurationHistory-specific methods can be added here
   */
}
