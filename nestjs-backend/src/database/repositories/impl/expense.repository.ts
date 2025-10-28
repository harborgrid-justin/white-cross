/**
 * Expense Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface ExpenseAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseDTO {
  id?: string;
}

export interface UpdateExpenseDTO {
  id?: string;
}

@Injectable()
export class ExpenseRepository extends BaseRepository<any, ExpenseAttributes, CreateExpenseDTO> {
  constructor(
    @InjectModel('Expense') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Expense');
  }

  protected async validateCreate(data: CreateExpenseDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateExpenseDTO): Promise<void> {}

  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
      await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
