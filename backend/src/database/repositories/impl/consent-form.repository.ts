/**
 * Consent Form Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { ConsentForm } from '../../models/consent-form.model';

export interface ConsentFormAttributes {
  id: string;
  type: string;
  title: string;
  description?: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConsentFormDTO {
  type: string;
  title: string;
  description?: string;
  content: string;
  version: string;
  isActive?: boolean;
  expiresAt?: Date;
  createdBy?: string;
}

export interface UpdateConsentFormDTO {
  type?: string;
  title?: string;
  description?: string;
  content?: string;
  version?: string;
  isActive?: boolean;
  expiresAt?: Date;
}

@Injectable()
export class ConsentFormRepository extends BaseRepository<any, ConsentFormAttributes, CreateConsentFormDTO> {
  constructor(
    @InjectModel(ConsentForm) model: typeof ConsentForm,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ConsentForm');
  }

  protected async validateCreate(data: CreateConsentFormDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateConsentFormDTO): Promise<void> {}

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
