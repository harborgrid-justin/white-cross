/**
 * PerformanceMetricRepository Implementation
 * Repository for PerformanceMetric data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PerformanceMetric } from '../../models/administration/PerformanceMetric';
import {
  IPerformanceMetricRepository,
  CreatePerformanceMetricDTO,
  UpdatePerformanceMetricDTO
} from '../interfaces/IPerformanceMetricRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PerformanceMetricRepository
  extends BaseRepository<PerformanceMetric, any, any>
  implements IPerformanceMetricRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PerformanceMetric, auditLogger, cacheManager, 'PerformanceMetric');
  }
}
