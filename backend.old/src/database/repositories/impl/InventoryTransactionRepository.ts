/**
 * InventoryTransactionRepository Implementation
 * Repository for InventoryTransaction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { InventoryTransaction } from '../../models/inventory/InventoryTransaction';
import {
  IInventoryTransactionRepository,
  CreateInventoryTransactionDTO,
  UpdateInventoryTransactionDTO
} from '../interfaces/IInventoryTransactionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class InventoryTransactionRepository
  extends BaseRepository<InventoryTransaction, any, any>
  implements IInventoryTransactionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(InventoryTransaction, auditLogger, cacheManager, 'InventoryTransaction');
  }
  /**
   * Invalidate InventoryTransaction-related caches
   */
  protected async invalidateCaches(entity: InventoryTransaction): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:inventorytransaction:*`);
    } catch (error) {
      logger.warn('Error invalidating InventoryTransaction caches:', error);
    }
  }

  /**
   * Sanitize InventoryTransaction data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}