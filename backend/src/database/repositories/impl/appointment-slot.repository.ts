/**
 * Appointment Slot Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

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
export class AppointmentslotRepository extends BaseRepository<
  any,
  AppointmentslotAttributes,
  CreateAppointmentslotDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Appointmentslot');
  }

  protected async validateCreate(
    data: CreateAppointmentslotDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAppointmentslotDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: AppointmentSlot): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<AppointmentSlotAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
