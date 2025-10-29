/**
 * Consent Signature Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { ConsentSignature } from '../../models/consent-signature.model';

export interface ConsentSignatureAttributes {
  id: string;
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: any;
  ipAddress?: string;
  signedAt: Date;
  withdrawnAt?: Date;
  withdrawnBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConsentSignatureDTO {
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: any;
  ipAddress?: string;
  signedAt?: Date;
  withdrawnAt?: Date;
  withdrawnBy?: string;
}

export interface UpdateConsentSignatureDTO {
  consentFormId?: string;
  studentId?: string;
  signedBy?: string;
  relationship?: string;
  signatureData?: any;
  ipAddress?: string;
  signedAt?: Date;
  withdrawnAt?: Date;
  withdrawnBy?: string;
}

@Injectable()
export class ConsentSignatureRepository extends BaseRepository<any, ConsentSignatureAttributes, CreateConsentSignatureDTO> {
  constructor(
    @InjectModel(ConsentSignature) model: typeof ConsentSignature,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ConsentSignature');
  }

  protected async validateCreate(data: CreateConsentSignatureDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateConsentSignatureDTO): Promise<void> {}

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
