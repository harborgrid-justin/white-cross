/**
 * GrowthMeasurementRepository Implementation
 * Repository for GrowthMeasurement data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { GrowthMeasurement } from '../../models/healthcare/GrowthMeasurement';
import {
  IGrowthMeasurementRepository,
  CreateGrowthMeasurementDTO,
  UpdateGrowthMeasurementDTO
} from '../interfaces/IGrowthMeasurementRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class GrowthMeasurementRepository
  extends BaseRepository<GrowthMeasurement, any, any>
  implements IGrowthMeasurementRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(GrowthMeasurement, auditLogger, cacheManager, 'GrowthMeasurement');
  }
}
