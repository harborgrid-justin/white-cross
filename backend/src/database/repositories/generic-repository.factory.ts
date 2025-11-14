/**
 * Generic Repository Factory
 * Eliminates boilerplate duplication in repository implementations
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base/base.repository';
import type { IAuditLogger  } from "../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../backend/src/database/interfaces";

export interface RepositoryAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDTO {
  id?: string;
}

export interface UpdateDTO {
  id?: string;
}

/**
 * Generic repository factory function
 * Creates a repository class with common boilerplate eliminated
 */
export function createGenericRepository<
  TModel extends any,
  TAttributes extends RepositoryAttributes,
  TCreateDTO extends CreateDTO,
  TUpdateDTO extends UpdateDTO = Partial<TCreateDTO>
>(
  entityName: string,
  modelToken?: string,
  customSanitizeForAudit?: (data: Partial<TAttributes>) => Record<string, unknown>
) {
  @Injectable()
  class GenericRepository extends BaseRepository<TModel, TAttributes, TCreateDTO> {
    constructor(
      @InjectModel(modelToken || ('' as any)) model: TModel,
      @Inject('IAuditLogger') auditLogger: IAuditLogger,
      @Inject('ICacheManager') cacheManager: ICacheManager,
    ) {
      super(model, auditLogger, cacheManager, entityName);
    }

    protected async validateCreate(data: TCreateDTO): Promise<void> {
      // Default validation - can be overridden
    }

    protected async validateUpdate(id: string, data: TUpdateDTO): Promise<void> {
      // Default validation - can be overridden
    }

    protected async invalidateCaches(entity: TModel): Promise<void> {
      try {
        const entityData = entity.get ? entity.get() : entity;
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

    protected sanitizeForAudit(data: Partial<TAttributes>): Record<string, unknown> {
      if (customSanitizeForAudit) {
        return customSanitizeForAudit(data);
      }
      return sanitizeSensitiveData({ ...data });
    }
  }

  return GenericRepository;
}

/**
 * Factory for simple repositories with no custom logic
 */
export function createSimpleRepository<
  TModel extends any,
  TAttributes extends RepositoryAttributes,
  TCreateDTO extends CreateDTO,
  TUpdateDTO extends UpdateDTO = Partial<TCreateDTO>
>(
  entityName: string,
  modelToken?: string
) {
  return createGenericRepository<TModel, TAttributes, TCreateDTO, TUpdateDTO>(
    entityName,
    modelToken
  );
}