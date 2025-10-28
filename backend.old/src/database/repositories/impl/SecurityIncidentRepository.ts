/**
 * SecurityIncidentRepository Implementation
 * Repository for SecurityIncident data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { SecurityIncident } from '../../models/security/SecurityIncident';
import {
  ISecurityIncidentRepository,
  CreateSecurityIncidentDTO,
  UpdateSecurityIncidentDTO
} from '../interfaces/ISecurityIncidentRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SecurityIncidentRepository
  extends BaseRepository<SecurityIncident, any, any>
  implements ISecurityIncidentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(SecurityIncident, auditLogger, cacheManager, 'SecurityIncident');
  }
  /**
   * Invalidate SecurityIncident-related caches
   */
  protected async invalidateCaches(entity: SecurityIncident): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:securityincident:*`);
    } catch (error) {
      logger.warn('Error invalidating SecurityIncident caches:', error);
    }
  }

  /**
   * Sanitize SecurityIncident data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}