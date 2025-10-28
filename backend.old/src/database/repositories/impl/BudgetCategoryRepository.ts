/**
 * BudgetCategoryRepository Implementation
 * Repository for BudgetCategory data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { BudgetCategory } from '../../models/inventory/BudgetCategory';
import {
  IBudgetCategoryRepository,
  CreateBudgetCategoryDTO,
  UpdateBudgetCategoryDTO
} from '../interfaces/IBudgetCategoryRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class BudgetCategoryRepository
  extends BaseRepository<BudgetCategory, any, any>
  implements IBudgetCategoryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(BudgetCategory, auditLogger, cacheManager, 'BudgetCategory');
  }

  protected async invalidateCaches(entity: BudgetCategory): Promise<void> {
    try {
      await this.cacheManager.deletePattern(`white-cross:budgetcategory:*`);
    } catch (error) {
      logger.warn('Error invalidating budget category caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
