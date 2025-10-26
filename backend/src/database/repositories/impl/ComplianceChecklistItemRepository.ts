/**
 * ComplianceChecklistItemRepository Implementation
 * Repository for ComplianceChecklistItem data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ComplianceChecklistItem } from '../../models/compliance/ComplianceChecklistItem';
import {
  IComplianceChecklistItemRepository,
  CreateComplianceChecklistItemDTO,
  UpdateComplianceChecklistItemDTO
} from '../interfaces/IComplianceChecklistItemRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ComplianceChecklistItemRepository
  extends BaseRepository<ComplianceChecklistItem, any, any>
  implements IComplianceChecklistItemRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ComplianceChecklistItem, auditLogger, cacheManager, 'ComplianceChecklistItem');
  }

  protected async invalidateCaches(entity: ComplianceChecklistItem): Promise<void> {
    try {
      await this.cacheManager.deletePattern(`white-cross:compliancechecklistitem:*`);
    } catch (error) {
      logger.warn('Error invalidating compliance checklist item caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
