/**
 * Appointment Slot Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface AppointmentslotAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentslotDTO {
  id: string;
}

export interface UpdateAppointmentslotDTO {
  id?: string;
}

@Injectable()
export class AppointmentslotRepository extends BaseRepository<any, AppointmentslotAttributes, CreateAppointmentslotDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Appointmentslot');
  }

  protected async validateCreate(data: CreateAppointmentslotDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateAppointmentslotDTO): Promise<void> {}

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


