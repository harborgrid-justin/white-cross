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
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class InventoryItemRepository
  extends BaseRepository<InventoryItem, any, any>
  implements IInventoryItemRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(InventoryItem, auditLogger, cacheManager, 'InventoryItem');
  }
}
