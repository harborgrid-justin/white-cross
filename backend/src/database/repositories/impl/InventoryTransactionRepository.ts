/**
 * InventoryTransactionRepository Implementation
 * Auto-generated repository for InventoryTransaction data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { InventoryTransaction } from '../../models/inventory/InventoryTransaction';
import {
  IInventoryTransactionRepository,
  CreateInventoryTransactionDTO,
  UpdateInventoryTransactionDTO
} from '../interfaces/IInventoryTransactionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom InventoryTransaction-specific methods can be added here
   */
}
