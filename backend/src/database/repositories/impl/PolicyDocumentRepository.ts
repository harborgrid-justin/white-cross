/**
 * PolicyDocumentRepository Implementation
 * Repository for PolicyDocument data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PolicyDocument } from '../../models/compliance/PolicyDocument';
import {
  IPolicyDocumentRepository,
  CreatePolicyDocumentDTO,
  UpdatePolicyDocumentDTO
} from '../interfaces/IPolicyDocumentRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PolicyDocumentRepository
  extends BaseRepository<PolicyDocument, any, any>
  implements IPolicyDocumentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PolicyDocument, auditLogger, cacheManager, 'PolicyDocument');
  }
  /**
   * Invalidate PolicyDocument-related caches
   */
  protected async invalidateCaches(entity: PolicyDocument): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:policydocument:*`);
    } catch (error) {
      logger.warn('Error invalidating PolicyDocument caches:', error);
    }
  }

  /**
   * Sanitize PolicyDocument data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}