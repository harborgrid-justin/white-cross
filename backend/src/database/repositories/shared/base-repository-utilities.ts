/**
 * @fileoverview Base Repository Utilities
 * @module database/repositories/shared
 * @description Common utilities and patterns shared between repository implementations
 *
 * @deprecated This file uses TypeORM and is deprecated. Use Sequelize BaseRepository instead.
 * Located at: /database/repositories/base/base.repository.ts
 * This file is not currently imported anywhere and will be removed in a future update.
 */

import { Logger } from '@nestjs/common';
// TypeORM imports removed - this utility file is deprecated
// import { DataSource, Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';

/**
 * Common repository utilities
 * @deprecated Use Sequelize BaseRepository instead
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
   * @deprecated TypeORM specific - use Sequelize patterns
   */
  static initializeRepository<T>(
    dataSource: any, // was: DataSource
    entityClass: new () => T,
    repositoryName: string,
  ): { repository: any; logger: Logger } {  // was: Repository<T>
    throw new Error('Deprecated: Use Sequelize repository initialization instead');
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
   * @deprecated TypeORM specific - use Sequelize query patterns
   */
  static createQueryBuilderWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    alias: string,
    logger: Logger,
    operation: string,
  ): any {  // was: SelectQueryBuilder<T>
    throw new Error('Deprecated: Use Sequelize query builder patterns instead');
  }

  /**
   * Common transaction execution pattern
   * @deprecated TypeORM specific - use Sequelize transaction patterns
   */
  static async executeInTransaction<T>(
    dataSource: any, // was: DataSource
    operation: (queryRunner: any) => Promise<T>, // was: QueryRunner
    logger: Logger,
    operationName: string,
  ): Promise<T> {
    throw new Error('Deprecated: Use Sequelize transaction management instead');
  }

  /**
   * Common find operation with error handling
   * @deprecated TypeORM specific - use Sequelize repository methods
   */
  static async findWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    findOptions?: any,
  ): Promise<T[]> {
    throw new Error('Deprecated: Use Sequelize repository find methods instead');
  }

  /**
   * Common findOne operation with error handling
   * @deprecated TypeORM specific - use Sequelize repository methods
   */
  static async findOneWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    findOptions: any,
  ): Promise<T | null> {
    throw new Error('Deprecated: Use Sequelize repository findOne methods instead');
  }

  /**
   * Common save operation with error handling
   * @deprecated TypeORM specific - use Sequelize repository methods
   */
  static async saveWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    entity: T,
    entityId?: string | number,
  ): Promise<T> {
    throw new Error('Deprecated: Use Sequelize repository save methods instead');
  }

  /**
   * Common delete operation with error handling
   * @deprecated TypeORM specific - use Sequelize repository methods
   */
  static async deleteWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    criteria: any,
  ): Promise<void> {
    throw new Error('Deprecated: Use Sequelize repository delete methods instead');
  }

  /**
   * Common count operation with error handling
   * @deprecated TypeORM specific - use Sequelize repository methods
   */
  static async countWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    countOptions?: any,
  ): Promise<number> {
    throw new Error('Deprecated: Use Sequelize repository count methods instead');
  }

  /**
   * Common pagination helper
   * @deprecated TypeORM specific - use Sequelize pagination patterns
   */
  static applyPagination<T>(
    queryBuilder: any, // was: SelectQueryBuilder<T>
    page: number = 1,
    limit: number = 10,
  ): any {
    throw new Error('Deprecated: Use Sequelize pagination (limit/offset) instead');
  }

  /**
   * Common sorting helper
   * @deprecated TypeORM specific - use Sequelize order patterns
   */
  static applySorting<T>(
    queryBuilder: any, // was: SelectQueryBuilder<T>
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): any {
    throw new Error('Deprecated: Use Sequelize order clause instead');
  }

  /**
   * Common search helper for text fields
   * @deprecated TypeORM specific - use Sequelize Op.iLike patterns
   */
  static applyTextSearch<T>(
    queryBuilder: any, // was: SelectQueryBuilder<T>
    searchTerm: string,
    searchFields: string[],
    alias: string,
  ): any {
    throw new Error('Deprecated: Use Sequelize Op.iLike or Op.like instead');
  }

  /**
   * Common date range filter helper
   * @deprecated TypeORM specific - use Sequelize Op.between or Op.gte/lte
   */
  static applyDateRangeFilter<T>(
    queryBuilder: any, // was: SelectQueryBuilder<T>
    dateField: string,
    startDate?: Date,
    endDate?: Date,
  ): any {
    throw new Error('Deprecated: Use Sequelize Op.between, Op.gte, Op.lte instead');
  }

  /**
   * Common exists check helper
   * @deprecated TypeORM specific - use Sequelize count methods
   */
  static async checkExistsWithErrorHandling<T>(
    repository: any, // was: Repository<T>
    logger: Logger,
    entityName: string,
    criteria: any,
  ): Promise<boolean> {
    throw new Error('Deprecated: Use Sequelize repository count methods instead');
  }
}
