/**
 * ComplianceReportRepository Implementation
 * Repository for ComplianceReport data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ComplianceReport } from '../../models/compliance/ComplianceReport';
import {
  IComplianceReportRepository,
  CreateComplianceReportDTO,
  UpdateComplianceReportDTO
} from '../interfaces/IComplianceReportRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ComplianceReportRepository
  extends BaseRepository<ComplianceReport, any, any>
  implements IComplianceReportRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ComplianceReport, auditLogger, cacheManager, 'ComplianceReport');
  }

  protected async invalidateCaches(entity: ComplianceReport): Promise<void> {
    try {
      await this.cacheManager.deletePattern(`white-cross:compliancereport:*`);
    } catch (error) {
      logger.warn('Error invalidating compliance report caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
