/**
 * IncidentReportRepository Implementation
 * Repository for IncidentReport data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IncidentReport } from '../../models/incidents/IncidentReport';
import {
  IIncidentReportRepository,
  CreateIncidentReportDTO,
  UpdateIncidentReportDTO
} from '../interfaces/IIncidentReportRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IncidentReportRepository
  extends BaseRepository<IncidentReport, any, any>
  implements IIncidentReportRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IncidentReport, auditLogger, cacheManager, 'IncidentReport');
  }

  protected async invalidateCaches(entity: IncidentReport): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:incidentreport:student:${data.studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating incident report caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
