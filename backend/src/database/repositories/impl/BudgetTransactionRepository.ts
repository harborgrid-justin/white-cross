/**
 * BudgetTransactionRepository Implementation
 * Repository for BudgetTransaction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { BudgetTransaction } from '../../models/budget/BudgetTransaction';
import {
  IBudgetTransactionRepository,
  CreateBudgetTransactionDTO,
  UpdateBudgetTransactionDTO
} from '../interfaces/IBudgetTransactionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class BudgetTransactionRepository
  extends BaseRepository<BudgetTransaction, any, any>
  implements IBudgetTransactionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(BudgetTransaction, auditLogger, cacheManager, 'BudgetTransaction');
  }
}
