/**
 * PurchaseOrderItemRepository Implementation
 * Repository for PurchaseOrderItem data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PurchaseOrderItem } from '../../models/inventory/PurchaseOrderItem';
import {
  IPurchaseOrderItemRepository,
  CreatePurchaseOrderItemDTO,
  UpdatePurchaseOrderItemDTO
} from '../interfaces/IPurchaseOrderItemRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PurchaseOrderItemRepository
  extends BaseRepository<PurchaseOrderItem, any, any>
  implements IPurchaseOrderItemRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PurchaseOrderItem, auditLogger, cacheManager, 'PurchaseOrderItem');
  }
  /**
   * Invalidate PurchaseOrderItem-related caches
   */
  protected async invalidateCaches(entity: PurchaseOrderItem): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:purchaseorderitem:*`);
    } catch (error) {
      logger.warn('Error invalidating PurchaseOrderItem caches:', error);
    }
  }

  /**
   * Sanitize PurchaseOrderItem data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}