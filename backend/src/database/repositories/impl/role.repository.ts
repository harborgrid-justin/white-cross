/**
 * Role Repository Implementation
 * Injectable NestJS repository for role management with permission hierarchy
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  level: number;
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleDTO {
  name: string;
  description?: string;
  level: number;
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  level?: number;
  isActive?: boolean;
}

@Injectable()
export class RoleRepository extends BaseRepository<
  any,
  RoleAttributes,
  CreateRoleDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Role');
  }

  async findByName(name: string): Promise<RoleAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        name,
        'by-name',
      );
      const cached = await this.cacheManager.get<RoleAttributes>(cacheKey);

      if (cached) {
        this.logger.debug(`Cache hit for role name: ${name}`);
        return cached;
      }

      const role = await this.model.findOne({ where: { name } });
      if (!role) return null;

      const entity = this.mapToEntity(role);
      await this.cacheManager.set(cacheKey, entity, 3600);
      return entity;
    } catch (error) {
      this.logger.error('Error finding role by name:', error);
      throw new RepositoryError(
        'Failed to find role by name',
        'FIND_BY_NAME_ERROR',
        500,
        { name, error: (error as Error).message },
      );
    }
  }

  async findByLevel(level: number): Promise<RoleAttributes[]> {
    try {
      const roles = await this.model.findAll({
        where: { level, isActive: true },
        order: [['name', 'ASC']],
      });
      return roles.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding roles by level:', error);
      throw new RepositoryError(
        'Failed to find roles by level',
        'FIND_BY_LEVEL_ERROR',
        500,
        { level, error: (error as Error).message },
      );
    }
  }

  async findSystemRoles(): Promise<RoleAttributes[]> {
    try {
      const roles = await this.model.findAll({
        where: { isSystemRole: true, isActive: true },
        order: [
          ['level', 'ASC'],
          ['name', 'ASC'],
        ],
      });
      return roles.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding system roles:', error);
      throw new RepositoryError(
        'Failed to find system roles',
        'FIND_SYSTEM_ROLES_ERROR',
        500,
        { error: (error as Error).message },
      );
    }
  }

  async findActiveRoles(): Promise<RoleAttributes[]> {
    try {
      const cacheKey = `${this.entityName}:active:all`;
      const cached = await this.cacheManager.get<RoleAttributes[]>(cacheKey);

      if (cached) {
        this.logger.debug('Cache hit for active roles');
        return cached;
      }

      const roles = await this.model.findAll({
        where: { isActive: true },
        order: [
          ['level', 'ASC'],
          ['name', 'ASC'],
        ],
      });

      const entities = roles.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 3600);
      return entities;
    } catch (error) {
      this.logger.error('Error finding active roles:', error);
      throw new RepositoryError(
        'Failed to find active roles',
        'FIND_ACTIVE_ROLES_ERROR',
        500,
        { error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateRoleDTO): Promise<void> {
    const existing = await this.model.findOne({ where: { name: data.name } });
    if (existing) {
      throw new RepositoryError(
        'Role name already exists',
        'DUPLICATE_ROLE_NAME',
        409,
        { name: data.name },
      );
    }
  }

  protected async validateUpdate(
    id: string,
    data: UpdateRoleDTO,
  ): Promise<void> {
    if (data.name) {
      const existing = await this.model.findOne({
        where: { name: data.name, id: { [Op.ne]: id } },
      });
      if (existing) {
        throw new RepositoryError(
          'Role name already exists',
          'DUPLICATE_ROLE_NAME',
          409,
          { name: data.name },
        );
      }
    }

    const role = await this.model.findByPk(id);
    if (role && role.isSystemRole) {
      throw new RepositoryError(
        'Cannot modify system role',
        'SYSTEM_ROLE_IMMUTABLE',
        403,
        { id },
      );
    }
  }

  protected async invalidateCaches(role: any): Promise<void> {
    try {
      const roleData = role.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, roleData.id),
      );

      if (roleData.name) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            roleData.name,
            'by-name',
          ),
        );
      }

      await this.cacheManager.delete(`${this.entityName}:active:all`);
      await this.cacheManager.deletePattern(`white-cross:role:*`);
    } catch (error) {
      this.logger.warn('Error invalidating role caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
