/**
 * PurchaseOrderRepository Implementation
 * Repository for PurchaseOrder data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PurchaseOrder } from '../../models/inventory/PurchaseOrder';
import {
  IPurchaseOrderRepository,
  CreatePurchaseOrderDTO,
  UpdatePurchaseOrderDTO
} from '../interfaces/IPurchaseOrderRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PurchaseOrderRepository
  extends BaseRepository<PurchaseOrder, any, any>
  implements IPurchaseOrderRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PurchaseOrder, auditLogger, cacheManager, 'PurchaseOrder');
  }
  /**
   * Invalidate PurchaseOrder-related caches
   */
  protected async invalidateCaches(entity: PurchaseOrder): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:purchaseorder:*`);
    } catch (error) {
      logger.warn('Error invalidating PurchaseOrder caches:', error);
    }
  }

  /**
   * Sanitize PurchaseOrder data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}