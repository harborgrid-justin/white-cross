/**
 * Policy Document Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { PolicyDocument } from '../../models/policy-document.model';

export interface PolicyDocumentAttributes {
  id: string;
  title: string;
  description?: string;
  content: string;
  version: string;
  category: string;
  isActive: boolean;
  isRequired: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  requiresAcknowledgment: boolean;
  acknowledgmentText?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePolicyDocumentDTO {
  title: string;
  description?: string;
  content: string;
  version: string;
  category: string;
  isActive?: boolean;
  isRequired?: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  requiresAcknowledgment?: boolean;
  acknowledgmentText?: string;
  createdBy?: string;
}

export interface UpdatePolicyDocumentDTO {
  title?: string;
  description?: string;
  content?: string;
  version?: string;
  category?: string;
  isActive?: boolean;
  isRequired?: boolean;
  effectiveDate?: Date;
  expirationDate?: Date;
  requiresAcknowledgment?: boolean;
  acknowledgmentText?: string;
}

@Injectable()
export class PolicyDocumentRepository extends BaseRepository<any, PolicyDocumentAttributes, CreatePolicyDocumentDTO> {
  constructor(
    @InjectModel(PolicyDocument) model: typeof PolicyDocument,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'PolicyDocument');
  }

  protected async validateCreate(data: CreatePolicyDocumentDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdatePolicyDocumentDTO): Promise<void> {}

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
