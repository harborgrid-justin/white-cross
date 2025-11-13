import { UseGuards, ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Args, Context, ID, Parent, Query, Mutation, ResolveField } from '@nestjs/graphql';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '@/services/auth';
import { UserRole } from '@/database';
import type { GraphQLContext } from '../types/context.interface';

/**
 * GraphQL Resolver Utilities
 * 
 * Provides standardized patterns for GraphQL resolvers to reduce code duplication
 * and ensure consistency across resolver implementations.
 */

/**
 * Standard GraphQL context interface
 */
export interface StandardGraphQLContext {
  req?: {
    user?: {
      userId: string;
      id: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  loaders?: {
    [key: string]: {
      load: (id: string) => Promise<any>;
      loadMany: (ids: string[]) => Promise<any[]>;
    };
  };
  [key: string]: unknown;
}

/**
 * Standard pagination input interface
 */
export interface PaginationInput {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Standard pagination result interface
 */
export interface PaginationResult<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Standard list response interface
 */
export interface StandardListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * HIPAA audit logging utility
 */
export class HIPAAAuditLogger {
  /**
   * Log PHI access for query operations
   */
  static logPhiAccess(
    operation: string,
    context: StandardGraphQLContext,
    details: Record<string, any> = {}
  ): void {
    const userId = context.req?.user?.userId || context.req?.user?.id;
    
    console.log(`PHI ACCESS: ${operation}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  /**
   * Log PHI modification for mutation operations
   */
  static logPhiModification(
    operation: string,
    context: StandardGraphQLContext,
    details: Record<string, any> = {}
  ): void {
    const userId = context.req?.user?.userId || context.req?.user?.id;
    
    console.log(`PHI MODIFICATION: ${operation}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  /**
   * Log PHI deletion for restricted operations
   */
  static logPhiDeletion(
    operation: string,
    context: StandardGraphQLContext,
    details: Record<string, any> = {}
  ): void {
    const userId = context.req?.user?.userId || context.req?.user?.id;
    
    console.warn(`PHI MODIFICATION: ${operation}`, {
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }
}

/**
 * Common role combinations for healthcare access control
 */
export const CommonRoles = {
  PHI_ACCESS: [
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  ],
  STUDENT_ACCESS: [
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  ],
  ADMIN_ONLY: [UserRole.ADMIN],
  HEALTHCARE_STAFF: [
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  ],
};

/**
 * Standard decorator factory functions for common GraphQL patterns
 */
export class ResolverDecorators {
  /**
   * Standard query with authentication and role-based access for PHI
   */
  static PhiQuery(returnType: any, name: string, options: any = {}) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      Query(() => returnType, { name, ...options })(target, propertyName, descriptor);
      UseGuards(GqlAuthGuard, GqlRolesGuard)(target, propertyName, descriptor);
      Roles(...CommonRoles.PHI_ACCESS)(target, propertyName, descriptor);
    };
  }

  /**
   * Standard query with authentication and role-based access for students
   */
  static StudentQuery(returnType: any, name: string, options: any = {}) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      Query(() => returnType, { name, ...options })(target, propertyName, descriptor);
      UseGuards(GqlAuthGuard, GqlRolesGuard)(target, propertyName, descriptor);
      Roles(...CommonRoles.STUDENT_ACCESS)(target, propertyName, descriptor);
    };
  }

  /**
   * Standard mutation with authentication and role-based access for PHI
   */
  static PhiMutation(returnType: any, options: any = {}) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      Mutation(() => returnType, options)(target, propertyName, descriptor);
      UseGuards(GqlAuthGuard, GqlRolesGuard)(target, propertyName, descriptor);
      Roles(...CommonRoles.PHI_ACCESS)(target, propertyName, descriptor);
    };
  }

  /**
   * Admin-only mutation
   */
  static AdminMutation(returnType: any, options: any = {}) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      Mutation(() => returnType, options)(target, propertyName, descriptor);
      UseGuards(GqlAuthGuard, GqlRolesGuard)(target, propertyName, descriptor);
      Roles(...CommonRoles.ADMIN_ONLY)(target, propertyName, descriptor);
    };
  }
}

/**
 * Standard argument decorators for common patterns
 */
export class StandardArgs {
  /**
   * Standard pagination arguments
   */
  static Pagination() {
    return {
      page: Args('page', { type: () => Number, defaultValue: 1 }),
      limit: Args('limit', { type: () => Number, defaultValue: 20 }),
      orderBy: Args('orderBy', { type: () => String, defaultValue: 'createdAt' }),
      orderDirection: Args('orderDirection', { type: () => String, defaultValue: 'DESC' }),
    };
  }

  /**
   * Standard ID argument
   */
  static Id() {
    return Args('id', { type: () => ID });
  }

  /**
   * Standard filters argument
   */
  static Filters(filterType: any) {
    return Args('filters', { type: () => filterType, nullable: true });
  }
}

/**
 * Pagination utility functions
 */
export class PaginationUtils {
  /**
   * Transform service response to standard GraphQL list response
   */
  static transformToListResponse<T>(
    serviceResult: PaginationResult<T>,
    page: number,
    limit: number
  ): StandardListResponse<T> {
    const data = serviceResult.data || [];
    const meta = serviceResult.meta || {};

    return {
      data,
      pagination: {
        page: meta.page || page,
        limit: meta.limit || limit,
        total: meta.total || 0,
        totalPages: meta.pages || Math.ceil((meta.total || 0) / limit),
      },
    };
  }

  /**
   * Build service filters from GraphQL arguments
   */
  static buildServiceFilters(
    pagination: PaginationInput,
    filters?: Record<string, any>
  ): Record<string, any> {
    const serviceFilters: Record<string, any> = {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      orderBy: pagination.orderBy || 'createdAt',
      orderDirection: pagination.orderDirection || 'DESC',
    };

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          serviceFilters[key] = value;
        }
      });
    }

    return serviceFilters;
  }
}

/**
 * DataLoader utility functions
 */
export class DataLoaderUtils {
  /**
   * Safe DataLoader execution with error handling
   */
  static async safeLoad<T>(
    context: StandardGraphQLContext,
    loaderName: string,
    id: string,
    fallback: T | null = null
  ): Promise<T | null> {
    try {
      const loader = context.loaders?.[loaderName];
      if (!loader) {
        console.warn(`DataLoader '${loaderName}' not found in context`);
        return fallback;
      }
      
      return await loader.load(id);
    } catch (error) {
      console.error(`Error loading data with ${loaderName} for ID ${id}:`, error);
      return fallback;
    }
  }

  /**
   * Safe DataLoader batch execution with error handling
   */
  static async safeLoadMany<T>(
    context: StandardGraphQLContext,
    loaderName: string,
    ids: string[],
    fallback: T[] = []
  ): Promise<T[]> {
    try {
      const loader = context.loaders?.[loaderName];
      if (!loader) {
        console.warn(`DataLoader '${loaderName}' not found in context`);
        return fallback;
      }
      
      return await loader.loadMany(ids);
    } catch (error) {
      console.error(`Error loading batch data with ${loaderName} for IDs ${ids.join(', ')}:`, error);
      return fallback;
    }
  }
}

/**
 * Standard field resolver patterns
 */
export class FieldResolverPatterns {
  /**
   * Standard single entity field resolver using DataLoader
   */
  static createSingleEntityResolver<T>(
    loaderName: string,
    idField: string = 'id',
    fallback: T | null = null
  ) {
    return async function (
      parent: any,
      context: StandardGraphQLContext
    ): Promise<T | null> {
      const id = parent[idField];
      if (!id) return fallback;
      
      return DataLoaderUtils.safeLoad(context, loaderName, id, fallback);
    };
  }

  /**
   * Standard array field resolver using DataLoader
   */
  static createArrayEntityResolver<T>(
    loaderName: string,
    idField: string = 'id',
    fallback: T[] = []
  ) {
    return async function (
      parent: any,
      context: StandardGraphQLContext
    ): Promise<T[]> {
      const id = parent[idField];
      if (!id) return fallback;
      
      const result = await DataLoaderUtils.safeLoad(context, loaderName, id, fallback);
      return Array.isArray(result) ? result : fallback;
    };
  }

  /**
   * Count field resolver that uses array resolver result
   */
  static createCountResolver<T>(arrayResolverFn: (parent: any, context: StandardGraphQLContext) => Promise<T[]>) {
    return async function (
      parent: any,
      context: StandardGraphQLContext
    ): Promise<number> {
      const result = await arrayResolverFn(parent, context);
      return result.length;
    };
  }
}

/**
 * Standard entity mapping utilities
 */
export class EntityMappers {
  /**
   * Generic entity to DTO mapper with null safety
   */
  static mapToDto<TSource, TTarget>(
    source: TSource,
    mapping: Partial<Record<keyof TTarget, keyof TSource | ((source: TSource) => any)>>
  ): TTarget {
    const result = {} as TTarget;
    
    Object.entries(mapping).forEach(([targetKey, sourceKeyOrFn]) => {
      if (typeof sourceKeyOrFn === 'function') {
        (result as any)[targetKey] = sourceKeyOrFn(source);
      } else {
        (result as any)[targetKey] = (source as any)[sourceKeyOrFn];
      }
    });
    
    return result;
  }

  /**
   * Standard health record mapper
   */
  static mapHealthRecordToDto(record: any): any {
    return {
      id: record.id,
      studentId: record.studentId,
      recordType: record.recordType,
      title: record.title,
      description: record.description,
      recordDate: record.recordDate,
      provider: record.provider || undefined,
      providerNpi: record.providerNpi || undefined,
      facility: record.facility || undefined,
      facilityNpi: record.facilityNpi || undefined,
      diagnosis: record.diagnosis || undefined,
      diagnosisCode: record.diagnosisCode || undefined,
      treatment: record.treatment || undefined,
      followUpRequired: record.followUpRequired,
      followUpDate: record.followUpDate || undefined,
      followUpCompleted: record.followUpCompleted,
      attachments: record.attachments || [],
      metadata: record.metadata || undefined,
      isConfidential: record.isConfidential,
      notes: record.notes || undefined,
      createdBy: record.createdBy || undefined,
      updatedBy: record.updatedBy || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Standard student mapper
   */
  static mapStudentToDto(student: any): any {
    return {
      ...student,
      fullName: `${student.firstName} ${student.lastName}`,
      photo: student.photo || undefined,
      medicalRecordNum: student.medicalRecordNum || undefined,
      nurseId: student.nurseId || undefined,
    };
  }

  /**
   * Standard contact mapper
   */
  static mapContactToDto(contact: any): any {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
      type: contact.type,
      relationTo: contact.relationTo ?? undefined,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}

/**
 * Standard resolver base classes
 */
export abstract class BaseResolver<TEntity, TService> {
  constructor(protected readonly service: TService) {}

  /**
   * Standard find all implementation
   */
  protected async findAll(
    pagination: PaginationInput,
    filters?: Record<string, any>
  ): Promise<StandardListResponse<TEntity>> {
    const serviceFilters = PaginationUtils.buildServiceFilters(pagination, filters);
    const result = await (this.service as any).findAll(serviceFilters);
    return PaginationUtils.transformToListResponse(result, pagination.page || 1, pagination.limit || 20);
  }

  /**
   * Standard find one implementation
   */
  protected async findOne(id: string): Promise<TEntity | null> {
    return await (this.service as any).findOne(id);
  }

  /**
   * Standard create implementation with audit logging
   */
  protected async create(
    input: any,
    context: StandardGraphQLContext,
    entityName: string
  ): Promise<TEntity> {
    const userId = context.req?.user?.userId || context.req?.user?.id;
    
    HIPAAAuditLogger.logPhiModification(`${entityName} created`, context, {
      entityType: entityName.toLowerCase(),
    });

    return await (this.service as any).create({
      ...input,
      createdBy: userId,
    });
  }

  /**
   * Standard update implementation with audit logging
   */
  protected async update(
    id: string,
    input: any,
    context: StandardGraphQLContext,
    entityName: string
  ): Promise<TEntity> {
    const userId = context.req?.user?.userId || context.req?.user?.id;
    
    HIPAAAuditLogger.logPhiModification(`${entityName} updated`, context, {
      entityId: id,
      entityType: entityName.toLowerCase(),
    });

    return await (this.service as any).update(id, {
      ...input,
      updatedBy: userId,
    });
  }

  /**
   * Standard delete implementation with audit logging
   */
  protected async remove(
    id: string,
    context: StandardGraphQLContext,
    entityName: string
  ): Promise<{ success: boolean; message: string }> {
    HIPAAAuditLogger.logPhiDeletion(`${entityName} deleted`, context, {
      entityId: id,
      entityType: entityName.toLowerCase(),
    });

    await (this.service as any).remove(id);

    return {
      success: true,
      message: `${entityName} deleted successfully`,
    };
  }
}

/**
 * Export all utilities for easy import
 */
export {
  StandardGraphQLContext,
  PaginationInput,
  PaginationResult,
  StandardListResponse,
  HIPAAAuditLogger,
  CommonRoles,
  ResolverDecorators,
  StandardArgs,
  PaginationUtils,
  DataLoaderUtils,
  FieldResolverPatterns,
  EntityMappers,
  BaseResolver,
};
