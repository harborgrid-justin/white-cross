/**
 * HATEOAS Interceptor
 *
 * NestJS interceptor that automatically adds HATEOAS (Hypermedia As The Engine Of
 * Application State) links to all API responses. Supports single resources, collections,
 * and paginated responses.
 *
 * Features:
 * - Automatic link generation based on route and resource
 * - Permission-based link filtering
 * - Support for single resources and collections
 * - Pagination link generation
 * - Configurable link inclusion
 * - Smart resource detection
 *
 * @module interceptors/hateoas
 * @version 1.0.0
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import {
  HATEOASLink,
  generateResourceLinks,
  generatePaginationLinks,
  wrapWithHATEOAS,
  wrapPaginatedResponse,
  getBaseUrl,
  extractResourceInfo,
  ResourceLinkOptions,
} from '../utils/hateoas.utils';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * HATEOAS interceptor configuration
 */
export interface HATEOASInterceptorConfig {
  /** Enable/disable HATEOAS links globally */
  enabled?: boolean;
  /** Include update links */
  includeUpdate?: boolean;
  /** Include patch links */
  includePatch?: boolean;
  /** Include delete links */
  includeDelete?: boolean;
  /** Include collection links */
  includeCollection?: boolean;
  /** Resource-specific configurations */
  resourceConfigs?: Record<string, ResourceLinkOptions>;
}

/**
 * Response structure detection
 */
interface ResponseStructure {
  /** Is this a single resource response? */
  isSingleResource: boolean;
  /** Is this a collection response? */
  isCollection: boolean;
  /** Is this a paginated response? */
  isPaginated: boolean;
  /** Resource type (if detectable) */
  resourceType?: string;
  /** Resource ID (if single resource) */
  resourceId?: string;
  /** Pagination metadata (if paginated) */
  paginationMeta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// ============================================================================
// HATEOAS Interceptor Implementation
// ============================================================================

/**
 * Interceptor that automatically adds HATEOAS links to API responses
 *
 * @example
 * ```typescript
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new HATEOASInterceptor({
 *   enabled: true,
 *   includeUpdate: true,
 *   includeDelete: true,
 *   resourceConfigs: {
 *     threats: {
 *       additionalLinks: [
 *         { rel: 'analyze', href: '/threats/:id/analyze', method: 'POST' }
 *       ]
 *     }
 *   }
 * }));
 * ```
 *
 * @example
 * ```typescript
 * // Apply to specific controller
 * @UseInterceptors(HATEOASInterceptor)
 * @Controller('threats')
 * export class ThreatsController { ... }
 * ```
 */
@Injectable()
export class HATEOASInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HATEOASInterceptor.name);
  private readonly config: Required<HATEOASInterceptorConfig>;

  constructor(config: HATEOASInterceptorConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      includeUpdate: config.includeUpdate ?? true,
      includePatch: config.includePatch ?? true,
      includeDelete: config.includeDelete ?? true,
      includeCollection: config.includeCollection ?? true,
      resourceConfigs: config.resourceConfigs ?? {},
    };
  }

  /**
   * Intercept method that adds HATEOAS links to responses
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.config.enabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const baseUrl = getBaseUrl(request);

    return next.handle().pipe(
      map((data) => {
        // Skip if data is null/undefined or already has _links
        if (!data || data._links) {
          return data;
        }

        // Detect response structure
        const structure = this.detectResponseStructure(data, request);

        // Generate appropriate links based on structure
        if (structure.isPaginated) {
          return this.addPaginationLinks(data, structure, baseUrl, request);
        } else if (structure.isCollection) {
          return this.addCollectionLinks(data, structure, baseUrl, request);
        } else if (structure.isSingleResource) {
          return this.addResourceLinks(data, structure, baseUrl, request);
        }

        // Return data unchanged if structure not recognized
        return data;
      }),
    );
  }

  /**
   * Detect response structure and resource information
   */
  private detectResponseStructure(data: any, request: Request): ResponseStructure {
    const structure: ResponseStructure = {
      isSingleResource: false,
      isCollection: false,
      isPaginated: false,
    };

    // Check if it's a paginated response
    if (this.isPaginatedResponse(data)) {
      structure.isPaginated = true;
      structure.isCollection = true;
      structure.paginationMeta = {
        page: data.page || data.meta?.page || 1,
        limit: data.limit || data.meta?.limit || 10,
        total: data.total || data.meta?.total || 0,
      };
    }
    // Check if it's a collection (array of items)
    else if (Array.isArray(data)) {
      structure.isCollection = true;
    }
    // Check if it's a single resource
    else if (typeof data === 'object' && data !== null) {
      structure.isSingleResource = true;

      // Try to extract resource ID
      if (data.id) {
        structure.resourceId = String(data.id);
      }
    }

    // Extract resource type from request path
    const resourceInfo = extractResourceInfo(request.path);
    if (resourceInfo.resourceType) {
      structure.resourceType = resourceInfo.resourceType;
    }

    // If we didn't get resource ID from data, try from path
    if (!structure.resourceId && resourceInfo.resourceId) {
      structure.resourceId = resourceInfo.resourceId;
    }

    return structure;
  }

  /**
   * Check if response is paginated
   */
  private isPaginatedResponse(data: any): boolean {
    // Common pagination response patterns
    return (
      (data.items && Array.isArray(data.items) && (data.total !== undefined || data.page !== undefined)) ||
      (data.data && Array.isArray(data.data) && (data.total !== undefined || data.page !== undefined)) ||
      (data.results && Array.isArray(data.results) && (data.total !== undefined || data.page !== undefined)) ||
      (data.meta && (data.meta.total !== undefined || data.meta.page !== undefined))
    );
  }

  /**
   * Add HATEOAS links to single resource
   */
  private addResourceLinks(
    data: any,
    structure: ResponseStructure,
    baseUrl: string,
    request: Request,
  ): any {
    if (!structure.resourceType || !structure.resourceId) {
      this.logger.debug('Cannot generate resource links: missing resourceType or resourceId');
      return data;
    }

    // Get resource-specific configuration
    const resourceConfig = this.config.resourceConfigs[structure.resourceType] || {};

    // Merge global and resource-specific configs
    const linkOptions: ResourceLinkOptions = {
      includeUpdate: resourceConfig.includeUpdate ?? this.config.includeUpdate,
      includePatch: resourceConfig.includePatch ?? this.config.includePatch,
      includeDelete: resourceConfig.includeDelete ?? this.config.includeDelete,
      includeCollection: resourceConfig.includeCollection ?? this.config.includeCollection,
      additionalLinks: resourceConfig.additionalLinks || [],
      permissions: this.getUserPermissions(request),
    };

    // Generate links
    const links = generateResourceLinks(
      structure.resourceType,
      structure.resourceId,
      baseUrl,
      linkOptions,
    );

    // Replace placeholders in additional links
    if (linkOptions.additionalLinks) {
      linkOptions.additionalLinks.forEach((link) => {
        link.href = link.href.replace(':id', structure.resourceId!);
      });
    }

    return wrapWithHATEOAS(data, links);
  }

  /**
   * Add HATEOAS links to collection
   */
  private addCollectionLinks(
    data: any,
    structure: ResponseStructure,
    baseUrl: string,
    request: Request,
  ): any {
    if (!structure.resourceType) {
      this.logger.debug('Cannot generate collection links: missing resourceType');
      return data;
    }

    const links: HATEOASLink[] = [
      {
        rel: 'self',
        href: `${baseUrl}/${structure.resourceType}`,
        method: 'GET',
        type: 'application/json',
      },
    ];

    // Add create link if permitted
    if (this.hasPermission(request, `${structure.resourceType}:create`)) {
      links.push({
        rel: 'create',
        href: `${baseUrl}/${structure.resourceType}`,
        method: 'POST',
        type: 'application/json',
        title: `Create new ${structure.resourceType}`,
      });
    }

    return wrapWithHATEOAS(data, links);
  }

  /**
   * Add pagination links to paginated response
   */
  private addPaginationLinks(
    data: any,
    structure: ResponseStructure,
    baseUrl: string,
    request: Request,
  ): any {
    if (!structure.paginationMeta || !structure.resourceType) {
      this.logger.debug('Cannot generate pagination links: missing paginationMeta or resourceType');
      return data;
    }

    // Extract query parameters for pagination links
    const queryParams: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(request.query)) {
      if (key !== 'page' && key !== 'limit') {
        queryParams[key] = String(value);
      }
    }

    // Determine the data array (could be in different locations)
    let dataArray: any[] = [];
    if (Array.isArray(data.items)) {
      dataArray = data.items;
    } else if (Array.isArray(data.data)) {
      dataArray = data.data;
    } else if (Array.isArray(data.results)) {
      dataArray = data.results;
    }

    // Generate paginated response with HATEOAS links
    return wrapPaginatedResponse(dataArray, {
      page: structure.paginationMeta.page,
      limit: structure.paginationMeta.limit,
      total: structure.paginationMeta.total,
      baseUrl: `${baseUrl}/${structure.resourceType}`,
      queryParams,
    });
  }

  /**
   * Get user permissions from request
   */
  private getUserPermissions(request: Request): string[] | undefined {
    // Extract from authenticated user (if available)
    const user = (request as any).user;
    if (user && Array.isArray(user.permissions)) {
      return user.permissions;
    }

    // Could also check roles and map to permissions
    if (user && Array.isArray(user.roles)) {
      return this.mapRolesToPermissions(user.roles);
    }

    return undefined;
  }

  /**
   * Map roles to permissions (simplified)
   */
  private mapRolesToPermissions(roles: string[]): string[] {
    const permissions: string[] = [];

    for (const role of roles) {
      if (role === 'admin' || role === 'ADMIN') {
        permissions.push('*:*'); // Admin has all permissions
      } else if (role === 'analyst' || role === 'ANALYST') {
        permissions.push('threats:read', 'threats:write');
      } else if (role === 'viewer' || role === 'VIEWER') {
        permissions.push('*:read');
      }
    }

    return permissions;
  }

  /**
   * Check if user has specific permission
   */
  private hasPermission(request: Request, requiredPermission: string): boolean {
    const permissions = this.getUserPermissions(request);

    if (!permissions || permissions.length === 0) {
      return true; // No permission filtering
    }

    return permissions.some((perm) => {
      if (perm === requiredPermission) return true;
      if (perm.endsWith(':*')) {
        const prefix = perm.slice(0, -1);
        return requiredPermission.startsWith(prefix);
      }
      if (perm === '*:*') return true; // Wildcard all
      return false;
    });
  }
}

/**
 * Decorator to disable HATEOAS for specific routes
 *
 * @example
 * ```typescript
 * @Controller('health')
 * export class HealthController {
 *   @Get()
 *   @SkipHATEOAS()
 *   check() {
 *     return { status: 'ok' };
 *   }
 * }
 * ```
 */
export const SKIP_HATEOAS_KEY = 'skip_hateoas';

export function SkipHATEOAS(): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(SKIP_HATEOAS_KEY, true, descriptor.value);
    return descriptor;
  };
}
