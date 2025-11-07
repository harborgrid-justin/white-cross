/**
 * Device Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface DeviceAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeviceDTO {
  id?: string;
}

export interface UpdateDeviceDTO {
  id?: string;
}

@Injectable()
export class DeviceRepository extends BaseRepository<
  any,
  DeviceAttributes,
  CreateDeviceDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Device');
  }

  protected async validateCreate(data: CreateDeviceDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateDeviceDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, entityData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:${this.entityName.toLowerCase()}:*`,
      );
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
