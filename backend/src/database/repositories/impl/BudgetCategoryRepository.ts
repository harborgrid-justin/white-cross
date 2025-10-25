/**
 * BudgetCategoryRepository Implementation
 * Repository for BudgetCategory data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { BudgetCategory } from '../../models/budget/BudgetCategory';
import {
  IBudgetCategoryRepository,
  CreateBudgetCategoryDTO,
  UpdateBudgetCategoryDTO
} from '../interfaces/IBudgetCategoryRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class BudgetCategoryRepository
  extends BaseRepository<BudgetCategory, any, any>
  implements IBudgetCategoryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(BudgetCategory, auditLogger, cacheManager, 'BudgetCategory');
  }
}
