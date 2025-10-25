/**
 * IncidentReportRepository Implementation
 * Auto-generated repository for IncidentReport data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IncidentReport } from '../../models/incidents/IncidentReport';
import {
  IIncidentReportRepository,
  CreateIncidentReportDTO,
  UpdateIncidentReportDTO
} from '../interfaces/IIncidentReportRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IncidentReportRepository
  extends BaseRepository<IncidentReport, any, any>
  implements IIncidentReportRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IncidentReport, auditLogger, cacheManager, 'IncidentReport');
  }

  /**
   * Custom IncidentReport-specific methods can be added here
   */
}
