/**
 * MedicationLogRepository Implementation
 * Repository for MedicationLog data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MedicationLog } from '../../models/medication/MedicationLog';
import {
  IMedicationLogRepository,
  CreateMedicationLogDTO,
  UpdateMedicationLogDTO
} from '../interfaces/IMedicationLogRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MedicationLogRepository
  extends BaseRepository<MedicationLog, any, any>
  implements IMedicationLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MedicationLog, auditLogger, cacheManager, 'MedicationLog');
  }
}
