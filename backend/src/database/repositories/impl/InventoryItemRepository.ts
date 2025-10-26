/**
 * InventoryItemRepository Implementation
 * Repository for InventoryItem data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { InventoryItem } from '../../models/inventory/InventoryItem';
import {
  IInventoryItemRepository,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO
} from '../interfaces/IInventoryItemRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class InventoryItemRepository
  extends BaseRepository<InventoryItem, any, any>
  implements IInventoryItemRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(InventoryItem, auditLogger, cacheManager, 'InventoryItem');
  }
  /**
   * Invalidate InventoryItem-related caches
   */
  protected async invalidateCaches(entity: InventoryItem): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:inventoryitem:*`);
    } catch (error) {
      logger.warn('Error invalidating InventoryItem caches:', error);
    }
  }

  /**
   * Sanitize InventoryItem data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}