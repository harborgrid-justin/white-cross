/**
 * BudgetTransactionRepository Implementation
 * Repository for BudgetTransaction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { BudgetTransaction } from '../../models/inventory/BudgetTransaction';
import {
  IBudgetTransactionRepository,
  CreateBudgetTransactionDTO,
  UpdateBudgetTransactionDTO
} from '../interfaces/IBudgetTransactionRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class BudgetTransactionRepository
  extends BaseRepository<BudgetTransaction, any, any>
  implements IBudgetTransactionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(BudgetTransaction, auditLogger, cacheManager, 'BudgetTransaction');
  }

  protected async invalidateCaches(entity: BudgetTransaction): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:budgettransaction:category:${data.categoryId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating budget transaction caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
