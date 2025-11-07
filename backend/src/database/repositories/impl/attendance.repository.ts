/**
 * Attendance Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface AttendanceAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAttendanceDTO {
  id?: string;
}

export interface UpdateAttendanceDTO {
  id?: string;
}

@Injectable()
export class AttendanceRepository extends BaseRepository<
  any,
  AttendanceAttributes,
  CreateAttendanceDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Attendance');
  }

  protected async validateCreate(data: CreateAttendanceDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAttendanceDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Attendance): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<AttendanceAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
