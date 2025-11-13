/**
 * @fileoverview Base Repository Utilities
 * @module database/repositories/shared
 * @description Common utilities and patterns shared between repository implementations
 */

import { Logger } from '@nestjs/common';
import { DataSource, Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';

/**
 * Common repository utilities
 */
export class BaseRepositoryUtilities {
  /**
   * Creates a standardized logger instance for repositories
   */
  static createRepositoryLogger(repositoryName: string): Logger {
    return new Logger(repositoryName);
  }

  /**
   * Common initialization pattern for repositories
   */
  static initializeRepository<T>(
    dataSource: DataSource,
    entityClass: new () => T,
    repositoryName: string,
  ): { repository: Repository<T>; logger: Logger } {
    const repository = dataSource.getRepository(entityClass);
    const logger = this.createRepositoryLogger(repositoryName);
    
    logger.log(`${repositoryName} initialized successfully`);
    
    return { repository, logger };
  }

  /**
   * Common error handling for repository operations
   */
  static handleRepositoryError(
    logger: Logger,
    operation: string,
    error: unknown,
    entityId?: string | number,
  ): never {
    const entityInfo = entityId ? ` (ID: ${entityId})` : '';
    const errorMessage = `Failed to ${operation}${entityInfo}: ${(error as Error).message}`;
    
    logger.error(errorMessage, error);
    throw new Error(errorMessage);
  }

  /**
   * Common success logging for repository operations
   */
  static logRepositorySuccess(
    logger: Logger,
    operation: string,
    entityName: string,
    entityId?: string | number,
    additionalInfo?: Record<string, any>,
  ): void {
    const entityInfo = entityId ? ` (ID: ${entityId})` : '';
    const additional = additionalInfo 
      ? ` - ${Object.entries(additionalInfo).map(([k, v]) => `${k}: ${v}`).join(', ')}`
      : '';
    
    logger.log(`Successfully ${operation} ${entityName}${entityInfo}${additional}`);
  }

  /**
   * Common query builder setup with error handling
   */
  static createQueryBuilderWithErrorHandling<T>(
    repository: Repository<T>,
    alias: string,
    logger: Logger,
    operation: string,
  ): SelectQueryBuilder<T> {
    try {
      const queryBuilder = repository.createQueryBuilder(alias);
      logger.debug(`Created query builder for ${operation} with alias '${alias}'`);
      return queryBuilder;
    } catch (error) {
      this.handleRepositoryError(logger, `create query builder for ${operation}`, error);
    }
  }

  /**
   * Common transaction execution pattern
   */
  static async executeInTransaction<T>(
    dataSource: DataSource,
    operation: (queryRunner: QueryRunner) => Promise<T>,
    logger: Logger,
    operationName: string,
  ): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      logger.debug(`Starting transaction for ${operationName}`);
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      logger.debug(`Successfully committed transaction for ${operationName}`);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error(`Transaction rolled back for ${operationName}:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Common find operation with error handling
   */
  static async findWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    findOptions?: any,
  ): Promise<T[]> {
    try {
      logger.debug(`Finding ${entityName} entities`, findOptions);
      const entities = await repository.find(findOptions);
      logger.debug(`Found ${entities.length} ${entityName} entities`);
      return entities;
    } catch (error) {
      this.handleRepositoryError(logger, `find ${entityName} entities`, error);
    }
  }

  /**
   * Common findOne operation with error handling
   */
  static async findOneWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    findOptions: any,
  ): Promise<T | null> {
    try {
      logger.debug(`Finding one ${entityName} entity`, findOptions);
      const entity = await repository.findOne(findOptions);
      if (entity) {
        logger.debug(`Found ${entityName} entity`);
      } else {
        logger.debug(`No ${entityName} entity found`);
      }
      return entity;
    } catch (error) {
      this.handleRepositoryError(logger, `find one ${entityName} entity`, error);
    }
  }

  /**
   * Common save operation with error handling
   */
  static async saveWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    entity: T,
    entityId?: string | number,
  ): Promise<T> {
    try {
      const operation = entityId ? 'update' : 'create';
      logger.debug(`Saving ${entityName} entity (${operation})`);
      const savedEntity = await repository.save(entity);
      this.logRepositorySuccess(logger, operation, entityName, entityId);
      return savedEntity;
    } catch (error) {
      const operation = entityId ? 'update' : 'create';
      this.handleRepositoryError(logger, `${operation} ${entityName}`, error, entityId);
    }
  }

  /**
   * Common delete operation with error handling
   */
  static async deleteWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    criteria: any,
  ): Promise<void> {
    try {
      logger.debug(`Deleting ${entityName} entity`, criteria);
      const result = await repository.delete(criteria);
      if (result.affected && result.affected > 0) {
        this.logRepositorySuccess(logger, 'delete', entityName, undefined, { affected: result.affected });
      } else {
        logger.warn(`No ${entityName} entities were deleted`);
      }
    } catch (error) {
      this.handleRepositoryError(logger, `delete ${entityName}`, error);
    }
  }

  /**
   * Common count operation with error handling
   */
  static async countWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    countOptions?: any,
  ): Promise<number> {
    try {
      logger.debug(`Counting ${entityName} entities`, countOptions);
      const count = await repository.count(countOptions);
      logger.debug(`Found ${count} ${entityName} entities`);
      return count;
    } catch (error) {
      this.handleRepositoryError(logger, `count ${entityName} entities`, error);
    }
  }

  /**
   * Common pagination helper
   */
  static applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 10,
  ): SelectQueryBuilder<T> {
    const skip = (page - 1) * limit;
    return queryBuilder.skip(skip).take(limit);
  }

  /**
   * Common sorting helper
   */
  static applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): SelectQueryBuilder<T> {
    if (sortField) {
      return queryBuilder.orderBy(sortField, sortOrder);
    }
    return queryBuilder;
  }

  /**
   * Common search helper for text fields
   */
  static applyTextSearch<T>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string,
    searchFields: string[],
    alias: string,
  ): SelectQueryBuilder<T> {
    if (!searchTerm || searchFields.length === 0) {
      return queryBuilder;
    }

    const conditions = searchFields.map((field, index) => 
      `${alias}.${field} ILIKE :searchTerm${index}`
    ).join(' OR ');

    const parameters = searchFields.reduce((params, _, index) => {
      params[`searchTerm${index}`] = `%${searchTerm}%`;
      return params;
    }, {} as Record<string, string>);

    return queryBuilder.andWhere(`(${conditions})`, parameters);
  }

  /**
   * Common date range filter helper
   */
  static applyDateRangeFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    dateField: string,
    startDate?: Date,
    endDate?: Date,
  ): SelectQueryBuilder<T> {
    if (startDate) {
      queryBuilder.andWhere(`${dateField} >= :startDate`, { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere(`${dateField} <= :endDate`, { endDate });
    }
    return queryBuilder;
  }

  /**
   * Common exists check helper
   */
  static async checkExistsWithErrorHandling<T>(
    repository: Repository<T>,
    logger: Logger,
    entityName: string,
    criteria: any,
  ): Promise<boolean> {
    try {
      logger.debug(`Checking if ${entityName} exists`, criteria);
      const count = await repository.count({ where: criteria });
      const exists = count > 0;
      logger.debug(`${entityName} ${exists ? 'exists' : 'does not exist'}`);
      return exists;
    } catch (error) {
      this.handleRepositoryError(logger, `check if ${entityName} exists`, error);
    }
  }
}
