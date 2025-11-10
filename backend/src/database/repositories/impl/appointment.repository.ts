/**
 * Appointment Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { Appointment } from '../../models/appointment.model';

export interface AppointmentAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentDTO {
  id: string;
}

export interface UpdateAppointmentDTO {
  id?: string;
}

@Injectable()
export class AppointmentRepository extends BaseRepository<
  any,
  AppointmentAttributes,
  CreateAppointmentDTO
> {
  constructor(
    @InjectModel(Appointment) model: typeof Appointment,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Appointment');
  }

  protected async validateCreate(data: CreateAppointmentDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAppointmentDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Appointment): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<AppointmentAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
