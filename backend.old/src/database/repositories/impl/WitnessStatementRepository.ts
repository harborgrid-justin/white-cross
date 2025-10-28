/**
 * WitnessStatementRepository Implementation
 * Repository for WitnessStatement data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { WitnessStatement } from '../../models/incidents/WitnessStatement';
import {
  IWitnessStatementRepository,
  CreateWitnessStatementDTO,
  UpdateWitnessStatementDTO
} from '../interfaces/IWitnessStatementRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class WitnessStatementRepository
  extends BaseRepository<WitnessStatement, any, any>
  implements IWitnessStatementRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(WitnessStatement, auditLogger, cacheManager, 'WitnessStatement');
  }
  /**
   * Invalidate WitnessStatement-related caches
   */
  protected async invalidateCaches(entity: WitnessStatement): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:witnessstatement:*`);
    } catch (error) {
      logger.warn('Error invalidating WitnessStatement caches:', error);
    }
  }

  /**
   * Sanitize WitnessStatement data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}