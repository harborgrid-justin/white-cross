/**
 * Emergency Broadcast Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { EmergencyBroadcast } from '../../models/emergency-broadcast.model';

export interface EmergencyBroadcastAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmergencyBroadcastDTO {
  id?: string;
}

export interface UpdateEmergencyBroadcastDTO {
  id?: string;
}

@Injectable()
export class EmergencyBroadcastRepository extends BaseRepository<EmergencyBroadcast, EmergencyBroadcastAttributes, CreateEmergencyBroadcastDTO> {
  constructor(
    @InjectModel(EmergencyBroadcast) model: typeof EmergencyBroadcast,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'EmergencyBroadcast');
  }

  protected async validateCreate(data: CreateEmergencyBroadcastDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateEmergencyBroadcastDTO): Promise<void> {}

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


