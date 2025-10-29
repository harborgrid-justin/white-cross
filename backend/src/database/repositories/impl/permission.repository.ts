/**
 * Permission Repository Implementation
 * Injectable NestJS repository for permission management with role assignment
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface PermissionAttributes {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  isSystemPermission: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePermissionDTO {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionDTO {
  name?: string;
  description?: string;
}

@Injectable()
export class PermissionRepository
  extends BaseRepository<any, PermissionAttributes, CreatePermissionDTO>
{
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Permission');
  }

  async findByName(name: string): Promise<PermissionAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(this.entityName, name, 'by-name');
      const cached = await this.cacheManager.get<PermissionAttributes>(cacheKey);

      if (cached) {
        this.logger.debug(`Cache hit for permission name: ${name}`);
        return cached;
      }

      const permission = await this.model.findOne({ where: { name } });
      if (!permission) return null;

      const entity = this.mapToEntity(permission);
      await this.cacheManager.set(cacheKey, entity, 3600);
      return entity;
    } catch (error) {
      this.logger.error('Error finding permission by name:', error);
      throw new RepositoryError(
        'Failed to find permission by name',
        'FIND_BY_NAME_ERROR',
        500,
        { name, error: (error as Error).message }
      );
    }
  }

  async findByResource(resource: string): Promise<PermissionAttributes[]> {
    try {
      const permissions = await this.model.findAll({
        where: { resource },
        order: [['action', 'ASC']]
      });
      return permissions.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding permissions by resource:', error);
      throw new RepositoryError(
        'Failed to find permissions by resource',
        'FIND_BY_RESOURCE_ERROR',
        500,
        { resource, error: (error as Error).message }
      );
    }
  }

  async findByResourceAndAction(resource: string, action: string): Promise<PermissionAttributes | null> {
    try {
      const permission = await this.model.findOne({
        where: { resource, action }
      });
      return permission ? this.mapToEntity(permission) : null;
    } catch (error) {
      this.logger.error('Error finding permission by resource and action:', error);
      throw new RepositoryError(
        'Failed to find permission by resource and action',
        'FIND_BY_RESOURCE_ACTION_ERROR',
        500,
        { resource, action, error: (error as Error).message }
      );
    }
  }

  async findSystemPermissions(): Promise<PermissionAttributes[]> {
    try {
      const permissions = await this.model.findAll({
        where: { isSystemPermission: true },
        order: [['resource', 'ASC'], ['action', 'ASC']]
      });
      return permissions.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding system permissions:', error);
      throw new RepositoryError(
        'Failed to find system permissions',
        'FIND_SYSTEM_PERMISSIONS_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  async bulkAssignToRole(
    permissionIds: string[],
    roleId: string,
    context: ExecutionContext
  ): Promise<void> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      await this.auditLogger.logBulkOperation(
        'BULK_ASSIGN_PERMISSIONS',
        this.entityName,
        context,
        { permissionIds, roleId, count: permissionIds.length }
      );

      await transaction.commit();

      this.logger.log(`Bulk assigned ${permissionIds.length} permissions to role ${roleId}`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error('Error bulk assigning permissions:', error);
      throw new RepositoryError(
        'Failed to bulk assign permissions to role',
        'BULK_ASSIGN_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreatePermissionDTO): Promise<void> {
    const existing = await this.model.findOne({
      where: { resource: data.resource, action: data.action }
    });

    if (existing) {
      throw new RepositoryError(
        'Permission already exists for this resource and action',
        'DUPLICATE_PERMISSION',
        409,
        { resource: data.resource, action: data.action }
      );
    }
  }

  protected async validateUpdate(id: string, data: UpdatePermissionDTO): Promise<void> {
    const permission = await this.model.findByPk(id);
    if (permission && permission.isSystemPermission) {
      throw new RepositoryError(
        'Cannot modify system permission',
        'SYSTEM_PERMISSION_IMMUTABLE',
        403,
        { id }
      );
    }
  }

  protected async invalidateCaches(permission: any): Promise<void> {
    try {
      const permissionData = permission.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, permissionData.id)
      );

      if (permissionData.name) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(this.entityName, permissionData.name, 'by-name')
        );
      }

      await this.cacheManager.deletePattern(`white-cross:permission:*`);
    } catch (error) {
      this.logger.warn('Error invalidating permission caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}


