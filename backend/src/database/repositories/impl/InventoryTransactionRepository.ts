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
}
