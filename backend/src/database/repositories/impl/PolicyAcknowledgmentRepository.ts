/**
 * PolicyAcknowledgmentRepository Implementation
 * Repository for PolicyAcknowledgment data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PolicyAcknowledgment } from '../../models/compliance/PolicyAcknowledgment';
import {
  IPolicyAcknowledgmentRepository,
  CreatePolicyAcknowledgmentDTO,
  UpdatePolicyAcknowledgmentDTO
} from '../interfaces/IPolicyAcknowledgmentRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PolicyAcknowledgmentRepository
  extends BaseRepository<PolicyAcknowledgment, any, any>
  implements IPolicyAcknowledgmentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PolicyAcknowledgment, auditLogger, cacheManager, 'PolicyAcknowledgment');
  }
  /**
   * Invalidate PolicyAcknowledgment-related caches
   */
  protected async invalidateCaches(entity: PolicyAcknowledgment): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:policyacknowledgment:*`);
    } catch (error) {
      logger.warn('Error invalidating PolicyAcknowledgment caches:', error);
    }
  }

  /**
   * Sanitize PolicyAcknowledgment data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}