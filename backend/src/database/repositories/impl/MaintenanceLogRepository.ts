/**
 * MaintenanceLogRepository Implementation
 * Repository for MaintenanceLog data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MaintenanceLog } from '../../models/administration/MaintenanceLog';
import {
  IMaintenanceLogRepository,
  CreateMaintenanceLogDTO,
  UpdateMaintenanceLogDTO
} from '../interfaces/IMaintenanceLogRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MaintenanceLogRepository
  extends BaseRepository<MaintenanceLog, any, any>
  implements IMaintenanceLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MaintenanceLog, auditLogger, cacheManager, 'MaintenanceLog');
  }
}
