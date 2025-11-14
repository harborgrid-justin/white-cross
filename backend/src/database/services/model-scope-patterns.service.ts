/**
 * Enterprise Sequelize Model Scope Patterns
 *
 * Advanced scope configurations for default scopes, dynamic scopes, scope
 * composition, query optimization, and complex filtering patterns for
 * healthcare data access control and multi-tenancy support.
 *
 * @module reuse/data/composites/model-scope-patterns
 * @version 1.0.0
 * @requires sequelize v6
 */

import {
  Model,
  ModelStatic,
  Op,
  Sequelize,
  FindOptions,
  WhereOptions,
  IncludeOptions,
  Order,
  Attributes,
  GroupOption,
} from 'sequelize';

/**
 * Type definitions for scope patterns
 */
export interface ScopeDefinition {
  where?: WhereOptions;
  include?: IncludeOptions | IncludeOptions[];
  attributes?: string[] | { include?: string[]; exclude?: string[] };
  order?: Order;
  limit?: number;
  offset?: number;
  group?: GroupOption;
  having?: WhereOptions;
  subQuery?: boolean;
  distinct?: boolean;
}

export interface DynamicScopeFunction {
  (...args: any[]): ScopeDefinition;
}

export interface ScopeCompositionRule {
  scopes: string[];
  mergeStrategy: 'merge' | 'override' | 'intersect';
  priority?: number;
}

export interface TenantScopeConfig {
  tenantIdField: string;
  tenantResolver: () => string | number | null;
  excludeModels?: string[];
}

export interface AccessControlScope {
  userIdField?: string;
  roleField?: string;
  permissionField?: string;
  customFilter?: (user: any) => WhereOptions;
}

// ============================================================================
// Default Scopes
// ============================================================================

/**
 * Creates active records default scope
 *
 * Filters out soft-deleted and inactive records by default, ensuring
 * that queries only return active data unless explicitly unscoped.
 *
 * @param options - Active scope configuration
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * User.addScope('defaultScope', createActiveRecordsScope({
 *   deletedAtField: 'deletedAt',
 *   statusField: 'status',
 *   activeValue: 'active'
 * }), { override: true });
 * ```
 */
export function createActiveRecordsScope(
  options: {
    deletedAtField?: string;
    statusField?: string;
    activeValue?: any;
  } = {}
): ScopeDefinition {
  const where: WhereOptions = {};

  if (options.deletedAtField) {
    where[options.deletedAtField] = null;
  }

  if (options.statusField && options.activeValue !== undefined) {
    where[options.statusField] = options.activeValue;
  }

  return {
    where: Object.keys(where).length > 0 ? where : undefined,
  };
}

/**
 * Creates published content default scope
 *
 * Shows only published and publicly visible content by default,
 * useful for CMS and content management systems.
 *
 * @param options - Published scope configuration
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Article.addScope('defaultScope', createPublishedContentScope({
 *   publishedField: 'publishedAt',
 *   statusField: 'status',
 *   visibilityField: 'visibility'
 * }), { override: true });
 * ```
 */
export function createPublishedContentScope(
  options: {
    publishedField?: string;
    statusField?: string;
    statusValue?: string;
    visibilityField?: string;
    visibilityValue?: string;
  } = {}
): ScopeDefinition {
  const where: WhereOptions = {};

  if (options.publishedField) {
    where[options.publishedField] = { [Op.lte]: new Date() };
  }

  if (options.statusField) {
    where[options.statusField] = options.statusValue || 'published';
  }

  if (options.visibilityField) {
    where[options.visibilityField] = options.visibilityValue || 'public';
  }

  return { where };
}

/**
 * Creates tenant isolation default scope
 *
 * Automatically filters records by tenant ID for multi-tenant SaaS
 * applications, ensuring data isolation between organizations.
 *
 * @param tenantIdField - Tenant identifier field name
 * @param tenantResolver - Function to get current tenant ID
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Patient.addScope('defaultScope', createTenantIsolationScope(
 *   'tenantId',
 *   () => getCurrentTenantId()
 * ), { override: true });
 * ```
 */
export function createTenantIsolationScope(
  tenantIdField: string,
  tenantResolver: () => string | number | null
): ScopeDefinition {
  return {
    where: {
      [tenantIdField]: tenantResolver(),
    },
  };
}

/**
 * Creates privacy-compliant default scope
 *
 * Excludes sensitive fields from default queries for HIPAA/GDPR
 * compliance, requiring explicit inclusion of protected data.
 *
 * @param sensitiveFields - Array of field names to exclude
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Patient.addScope('defaultScope', createPrivacyCompliantScope([
 *   'ssn', 'medicalHistory', 'creditCard'
 * ]), { override: true });
 * ```
 */
export function createPrivacyCompliantScope(
  sensitiveFields: string[]
): ScopeDefinition {
  return {
    attributes: {
      exclude: sensitiveFields,
    },
  };
}

// ============================================================================
// Named Scopes - Status & State
// ============================================================================

/**
 * Creates status filter scope
 *
 * Filters records by status field with support for multiple statuses
 * and status transition workflows.
 *
 * @param statusField - Status field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Order.addScope('byStatus', createStatusFilterScope('status'));
 * // Usage: Order.scope({ method: ['byStatus', 'pending'] }).findAll();
 * ```
 */
export function createStatusFilterScope(
  statusField: string = 'status'
): DynamicScopeFunction {
  return (status: string | string[]) => {
    const statuses = Array.isArray(status) ? status : [status];

    return {
      where: {
        [statusField]: statuses.length === 1 ? statuses[0] : { [Op.in]: statuses },
      },
    };
  };
}

/**
 * Creates archived records scope
 *
 * Filters for archived or soft-deleted records, useful for accessing
 * historical data and implementing undelete functionality.
 *
 * @param archivedField - Archived timestamp field
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Document.addScope('archived', createArchivedScope('archivedAt'));
 * ```
 */
export function createArchivedScope(
  archivedField: string = 'deletedAt'
): ScopeDefinition {
  return {
    where: {
      [archivedField]: { [Op.ne]: null },
    },
  };
}

/**
 * Creates draft records scope
 *
 * Filters for draft or unpublished content, supporting content
 * workflow management and editorial processes.
 *
 * @param statusField - Status field name
 * @param draftValue - Value representing draft status
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Article.addScope('draft', createDraftScope('status', 'draft'));
 * ```
 */
export function createDraftScope(
  statusField: string = 'status',
  draftValue: any = 'draft'
): ScopeDefinition {
  return {
    where: {
      [statusField]: draftValue,
    },
  };
}

// ============================================================================
// Named Scopes - Time-based
// ============================================================================

/**
 * Creates recent records scope
 *
 * Filters for records created within a specified time window,
 * useful for activity feeds and recent changes views.
 *
 * @param days - Number of days to look back
 * @param timeField - Timestamp field name
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Order.addScope('recent', createRecentScope(7, 'createdAt'));
 * ```
 */
export function createRecentScope(
  days: number = 7,
  timeField: string = 'createdAt'
): ScopeDefinition {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return {
    where: {
      [timeField]: { [Op.gte]: cutoffDate },
    },
    order: [[timeField, 'DESC']],
  };
}

/**
 * Creates date range scope
 *
 * Filters records within a date range with inclusive/exclusive options,
 * essential for reporting and analytics.
 *
 * @param dateField - Date field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Appointment.addScope('dateRange', createDateRangeScope('appointmentDate'));
 * // Usage: Appointment.scope({ method: ['dateRange', startDate, endDate] }).findAll();
 * ```
 */
export function createDateRangeScope(
  dateField: string
): DynamicScopeFunction {
  return (startDate: Date, endDate: Date, inclusive: boolean = true) => {
    const operators = inclusive ? { [Op.gte]: startDate, [Op.lte]: endDate } : { [Op.gt]: startDate, [Op.lt]: endDate };

    return {
      where: {
        [dateField]: operators,
      },
    };
  };
}

/**
 * Creates today's records scope
 *
 * Filters for records created or modified today, useful for daily
 * activity tracking and real-time dashboards.
 *
 * @param dateField - Date field name
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Transaction.addScope('today', createTodayScope('transactionDate'));
 * ```
 */
export function createTodayScope(
  dateField: string = 'createdAt'
): ScopeDefinition {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    where: {
      [dateField]: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    },
  };
}

/**
 * Creates expired records scope
 *
 * Filters for records past their expiration date, useful for
 * cleanup operations and expiration notifications.
 *
 * @param expirationField - Expiration date field
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Subscription.addScope('expired', createExpiredScope('expiresAt'));
 * ```
 */
export function createExpiredScope(
  expirationField: string = 'expiresAt'
): ScopeDefinition {
  return {
    where: {
      [expirationField]: { [Op.lt]: new Date() },
    },
  };
}

/**
 * Creates upcoming records scope
 *
 * Filters for future records within a time window, useful for
 * appointment reminders and scheduled task management.
 *
 * @param dateField - Date field name
 * @param days - Days ahead to look
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Appointment.addScope('upcoming', createUpcomingScope('scheduledAt', 7));
 * ```
 */
export function createUpcomingScope(
  dateField: string,
  days: number = 7
): ScopeDefinition {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return {
    where: {
      [dateField]: {
        [Op.gte]: now,
        [Op.lte]: future,
      },
    },
    order: [[dateField, 'ASC']],
  };
}

// ============================================================================
// Named Scopes - Search & Filter
// ============================================================================

/**
 * Creates full-text search scope
 *
 * Performs full-text search across multiple fields with ranking
 * support for PostgreSQL and MySQL full-text search.
 *
 * @param searchFields - Fields to search
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Product.addScope('search', createSearchScope(['name', 'description', 'sku']));
 * ```
 */
export function createSearchScope(
  searchFields: string[]
): DynamicScopeFunction {
  return (query: string) => {
    const conditions = searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${query}%` },
    }));

    return {
      where: {
        [Op.or]: conditions,
      },
    };
  };
}

/**
 * Creates tag filter scope
 *
 * Filters records by tags with support for AND/OR logic and
 * PostgreSQL array operations.
 *
 * @param tagField - Tag field name (array or relation)
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Article.addScope('byTags', createTagFilterScope('tags'));
 * // Usage: Article.scope({ method: ['byTags', ['tech', 'news']] }).findAll();
 * ```
 */
export function createTagFilterScope(
  tagField: string = 'tags'
): DynamicScopeFunction {
  return (tags: string[], matchAll: boolean = false) => {
    if (matchAll) {
      return {
        where: {
          [tagField]: { [Op.contains]: tags },
        },
      };
    }

    return {
      where: {
        [tagField]: { [Op.overlap]: tags },
      },
    };
  };
}

/**
 * Creates category filter scope
 *
 * Filters records by category with hierarchical support and
 * subcategory inclusion options.
 *
 * @param categoryField - Category field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Product.addScope('byCategory', createCategoryFilterScope('categoryId'));
 * ```
 */
export function createCategoryFilterScope(
  categoryField: string = 'categoryId'
): DynamicScopeFunction {
  return (categoryId: string | number | Array<string | number>) => {
    const ids = Array.isArray(categoryId) ? categoryId : [categoryId];

    return {
      where: {
        [categoryField]: ids.length === 1 ? ids[0] : { [Op.in]: ids },
      },
    };
  };
}

/**
 * Creates price range scope
 *
 * Filters records by price range with currency conversion support
 * for e-commerce and financial applications.
 *
 * @param priceField - Price field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Product.addScope('priceRange', createPriceRangeScope('price'));
 * ```
 */
export function createPriceRangeScope(
  priceField: string = 'price'
): DynamicScopeFunction {
  return (minPrice?: number, maxPrice?: number) => {
    const where: WhereOptions = {};

    if (minPrice !== undefined) {
      where[priceField] = { [Op.gte]: minPrice };
    }

    if (maxPrice !== undefined) {
      where[priceField] = {
        ...where[priceField],
        [Op.lte]: maxPrice,
      };
    }

    return { where };
  };
}

// ============================================================================
// Named Scopes - Relationships & Associations
// ============================================================================

/**
 * Creates scope with eager loaded associations
 *
 * Loads specified associations with customizable nested includes
 * for optimized query performance and N+1 prevention.
 *
 * @param associations - Association names or include options
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * User.addScope('withRelations', createWithAssociationsScope([
 *   'profile',
 *   { association: 'posts', include: ['comments'] }
 * ]));
 * ```
 */
export function createWithAssociationsScope(
  associations: Array<string | IncludeOptions>
): DynamicScopeFunction {
  return (...additionalAssociations: string[]) => {
    const allAssociations = [...associations];

    for (const assoc of additionalAssociations) {
      allAssociations.push(assoc);
    }

    return {
      include: allAssociations.map((assoc) =>
        typeof assoc === 'string' ? { association: assoc } : assoc
      ),
    };
  };
}

/**
 * Creates scope filtering by related record existence
 *
 * Filters records based on presence or absence of related records,
 * useful for orphan detection and relationship validation.
 *
 * @param association - Association name
 * @param exists - True to filter for existence, false for absence
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * User.addScope('withOrders', createHasAssociationScope('orders', true));
 * User.addScope('withoutOrders', createHasAssociationScope('orders', false));
 * ```
 */
export function createHasAssociationScope(
  association: string,
  exists: boolean = true
): ScopeDefinition {
  return {
    include: [
      {
        association,
        required: exists,
        attributes: [],
      },
    ],
    subQuery: false,
  };
}

/**
 * Creates scope filtering by association count
 *
 * Filters records based on count of related records, useful for
 * popularity metrics and relationship statistics.
 *
 * @param association - Association name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Product.addScope('popularProducts', createAssociationCountScope('reviews'));
 * // Usage: Product.scope({ method: ['popularProducts', 10, 'gte'] }).findAll();
 * ```
 */
export function createAssociationCountScope(
  association: string
): DynamicScopeFunction {
  return (count: number, operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' = 'gte') => {
    const opMap = {
      eq: Op.eq,
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
    };

    return {
      include: [
        {
          association,
          attributes: [],
        },
      ],
      having: Sequelize.literal(`COUNT("${association}"."id") ${operator === 'eq' ? '=' : operator === 'gt' ? '>' : operator === 'gte' ? '>=' : operator === 'lt' ? '<' : '<='} ${count}`),
      group: ['id'],
      subQuery: false,
    };
  };
}

// ============================================================================
// Named Scopes - Ordering & Pagination
// ============================================================================

/**
 * Creates sorted scope with customizable ordering
 *
 * Applies sorting with support for multiple fields and directions,
 * with nulls first/last handling.
 *
 * @param defaultField - Default sort field
 * @param defaultDirection - Default sort direction
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Product.addScope('sorted', createSortedScope('createdAt', 'DESC'));
 * ```
 */
export function createSortedScope(
  defaultField: string = 'createdAt',
  defaultDirection: 'ASC' | 'DESC' = 'DESC'
): DynamicScopeFunction {
  return (field?: string, direction?: 'ASC' | 'DESC') => {
    return {
      order: [[field || defaultField, direction || defaultDirection]],
    };
  };
}

/**
 * Creates paginated scope
 *
 * Implements offset-based pagination with configurable page size
 * and efficient counting for large datasets.
 *
 * @param defaultPageSize - Default records per page
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * User.addScope('paginated', createPaginatedScope(20));
 * // Usage: User.scope({ method: ['paginated', 2, 20] }).findAll();
 * ```
 */
export function createPaginatedScope(
  defaultPageSize: number = 10
): DynamicScopeFunction {
  return (page: number = 1, pageSize?: number) => {
    const limit = pageSize || defaultPageSize;
    const offset = (page - 1) * limit;

    return {
      limit,
      offset,
    };
  };
}

/**
 * Creates popular/trending scope based on metrics
 *
 * Orders records by popularity metrics like views, likes, or
 * engagement scores for trending content features.
 *
 * @param metricField - Popularity metric field
 * @param timeField - Optional time field for time-decay
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Article.addScope('popular', createPopularScope('viewCount', 'publishedAt'));
 * ```
 */
export function createPopularScope(
  metricField: string,
  timeField?: string
): DynamicScopeFunction {
  return (days?: number) => {
    const where: WhereOptions = {};

    if (timeField && days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      where[timeField] = { [Op.gte]: cutoff };
    }

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      order: [[metricField, 'DESC']],
    };
  };
}

// ============================================================================
// Named Scopes - User & Access Control
// ============================================================================

/**
 * Creates user-owned records scope
 *
 * Filters records owned by specific user for user-specific data
 * views and access control implementation.
 *
 * @param userIdField - User ID field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Document.addScope('ownedBy', createOwnedByUserScope('userId'));
 * ```
 */
export function createOwnedByUserScope(
  userIdField: string = 'userId'
): DynamicScopeFunction {
  return (userId: string | number) => {
    return {
      where: {
        [userIdField]: userId,
      },
    };
  };
}

/**
 * Creates role-based access scope
 *
 * Filters records based on user role with hierarchical role
 * support for RBAC (Role-Based Access Control).
 *
 * @param roleField - Role field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * User.addScope('byRole', createRoleBasedScope('role'));
 * ```
 */
export function createRoleBasedScope(
  roleField: string = 'role'
): DynamicScopeFunction {
  return (role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role];

    return {
      where: {
        [roleField]: roles.length === 1 ? roles[0] : { [Op.in]: roles },
      },
    };
  };
}

/**
 * Creates permission-based access scope
 *
 * Filters records based on user permissions with complex permission
 * logic for fine-grained access control.
 *
 * @param permissionField - Permission field name
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Resource.addScope('accessible', createPermissionBasedScope('permissions'));
 * ```
 */
export function createPermissionBasedScope(
  permissionField: string = 'permissions'
): DynamicScopeFunction {
  return (requiredPermissions: string | string[], matchAll: boolean = false) => {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    if (matchAll) {
      return {
        where: {
          [permissionField]: { [Op.contains]: permissions },
        },
      };
    }

    return {
      where: {
        [permissionField]: { [Op.overlap]: permissions },
      },
    };
  };
}

/**
 * Creates shared with user scope
 *
 * Filters records shared with specific user through sharing
 * mechanisms for collaborative features.
 *
 * @param shareTableAssociation - Association to sharing table
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * Document.addScope('sharedWith', createSharedWithUserScope('shares'));
 * ```
 */
export function createSharedWithUserScope(
  shareTableAssociation: string
): DynamicScopeFunction {
  return (userId: string | number) => {
    return {
      include: [
        {
          association: shareTableAssociation,
          where: {
            userId,
          },
          required: true,
        },
      ],
    };
  };
}

// ============================================================================
// Scope Composition
// ============================================================================

/**
 * Merges multiple scopes into a single composite scope
 *
 * Combines scope definitions with intelligent merging of where
 * clauses, includes, and ordering for complex queries.
 *
 * @param scopes - Array of scope definitions to merge
 * @param strategy - Merge strategy
 * @returns Merged scope definition
 *
 * @example
 * ```typescript
 * const compositeScope = mergeScopes([
 *   createActiveRecordsScope(),
 *   createRecentScope(7),
 *   createPopularScope('viewCount')
 * ], 'merge');
 * ```
 */
export function mergeScopes(
  scopes: ScopeDefinition[],
  strategy: 'merge' | 'override' = 'merge'
): ScopeDefinition {
  const merged: ScopeDefinition = {
    where: {},
    include: [],
    attributes: undefined,
    order: [],
  };

  for (const scope of scopes) {
    // Merge where clauses
    if (scope.where) {
      if (strategy === 'merge') {
        merged.where = { ...merged.where, ...scope.where };
      } else {
        merged.where = scope.where;
      }
    }

    // Merge includes
    if (scope.include) {
      const includes = Array.isArray(scope.include) ? scope.include : [scope.include];
      (merged.include as IncludeOptions[]).push(...includes);
    }

    // Merge attributes
    if (scope.attributes) {
      merged.attributes = scope.attributes;
    }

    // Merge order
    if (scope.order) {
      const orders = Array.isArray(scope.order[0]) ? scope.order : [scope.order];
      (merged.order as any[]).push(...orders);
    }

    // Copy other properties
    if (scope.limit !== undefined) merged.limit = scope.limit;
    if (scope.offset !== undefined) merged.offset = scope.offset;
    if (scope.group !== undefined) merged.group = scope.group;
    if (scope.having !== undefined) merged.having = scope.having;
    if (scope.subQuery !== undefined) merged.subQuery = scope.subQuery;
    if (scope.distinct !== undefined) merged.distinct = scope.distinct;
  }

  return merged;
}

/**
 * Creates conditional scope that applies different scopes based on conditions
 *
 * Dynamically selects and applies scopes based on runtime conditions
 * for flexible query construction.
 *
 * @param conditions - Condition-scope mapping
 * @param defaultScope - Default scope if no conditions match
 * @returns Dynamic scope function
 *
 * @example
 * ```typescript
 * const conditionalScope = createConditionalScope({
 *   'userRole === "admin"': createActiveRecordsScope(),
 *   'userRole === "user"': createOwnedByUserScope('userId')
 * });
 * ```
 */
export function createConditionalScope(
  conditions: Record<string, ScopeDefinition>,
  defaultScope?: ScopeDefinition
): DynamicScopeFunction {
  return (context: any) => {
    for (const [condition, scope] of Object.entries(conditions)) {
      try {
        const conditionFn = new Function('context', `with (context) { return ${condition}; }`);
        if (conditionFn(context)) {
          return scope;
        }
      } catch (error) {
        continue;
      }
    }

    return defaultScope || {};
  };
}

/**
 * Creates scope builder for dynamic query construction
 *
 * Provides fluent API for building complex scopes programmatically
 * with chainable methods for each clause type.
 *
 * @returns Scope builder instance
 *
 * @example
 * ```typescript
 * const scope = createScopeBuilder()
 *   .where({ status: 'active' })
 *   .include('profile')
 *   .orderBy('createdAt', 'DESC')
 *   .limit(10)
 *   .build();
 * ```
 */
export function createScopeBuilder(): ScopeBuilder {
  return new ScopeBuilder();
}

class ScopeBuilder {
  private scope: ScopeDefinition = {};

  where(conditions: WhereOptions): this {
    this.scope.where = { ...this.scope.where, ...conditions };
    return this;
  }

  include(association: string | IncludeOptions): this {
    if (!this.scope.include) {
      this.scope.include = [];
    }

    const includes = Array.isArray(this.scope.include) ? this.scope.include : [this.scope.include];
    includes.push(typeof association === 'string' ? { association } : association);
    this.scope.include = includes;
    return this;
  }

  attributes(attrs: string[] | { include?: string[]; exclude?: string[] }): this {
    this.scope.attributes = attrs;
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    if (!this.scope.order) {
      this.scope.order = [];
    }

    const order = Array.isArray(this.scope.order) ? this.scope.order : [this.scope.order];
    order.push([field, direction]);
    this.scope.order = order as Order;
    return this;
  }

  limit(limit: number): this {
    this.scope.limit = limit;
    return this;
  }

  offset(offset: number): this {
    this.scope.offset = offset;
    return this;
  }

  group(fields: string | string[]): this {
    this.scope.group = fields;
    return this;
  }

  having(conditions: WhereOptions): this {
    this.scope.having = conditions;
    return this;
  }

  build(): ScopeDefinition {
    return this.scope;
  }
}

// ============================================================================
// Query Optimization
// ============================================================================

/**
 * Creates optimized scope for large datasets
 *
 * Applies query optimizations like subQuery control, index hints,
 * and result streaming for performance-critical queries.
 *
 * @param options - Optimization options
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Order.addScope('optimized', createOptimizedScope({
 *   useSubQuery: false,
 *   selectOnlyIds: false,
 *   addIndexHints: ['status_idx', 'created_at_idx']
 * }));
 * ```
 */
export function createOptimizedScope(
  options: {
    useSubQuery?: boolean;
    selectOnlyIds?: boolean;
    addIndexHints?: string[];
    distinct?: boolean;
  } = {}
): ScopeDefinition {
  const scope: ScopeDefinition = {
    subQuery: options.useSubQuery,
    distinct: options.distinct,
  };

  if (options.selectOnlyIds) {
    scope.attributes = ['id'];
  }

  return scope;
}

/**
 * Creates separate query scope for hasMany associations
 *
 * Forces separate queries for hasMany associations to avoid
 * cartesian products in joins, improving performance.
 *
 * @param associations - Associations to load separately
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * User.addScope('withSeparateRelations', createSeparateQueryScope(['posts', 'comments']));
 * ```
 */
export function createSeparateQueryScope(
  associations: string[]
): ScopeDefinition {
  return {
    include: associations.map((assoc) => ({
      association: assoc,
      separate: true,
    })),
  };
}

/**
 * Creates count-optimized scope
 *
 * Optimizes queries for counting with minimal data fetching,
 * improving performance for pagination and statistics.
 *
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * Product.addScope('countOnly', createCountOptimizedScope());
 * ```
 */
export function createCountOptimizedScope(): ScopeDefinition {
  return {
    attributes: ['id'],
    include: undefined,
    subQuery: false,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Applies multiple scopes to a model query
 *
 * Convenience function to apply multiple named scopes at once
 * with method syntax support.
 *
 * @param model - Model to apply scopes to
 * @param scopes - Array of scope names or scope method definitions
 * @returns Scoped model
 *
 * @example
 * ```typescript
 * const users = await applyScopes(User, [
 *   'active',
 *   { method: ['byStatus', 'premium'] },
 *   'recent'
 * ]).findAll();
 * ```
 */
export function applyScopes(
  model: ModelStatic<any>,
  scopes: Array<string | { method: [string, ...any[]] }>
): ModelStatic<any> {
  return model.scope(scopes as any);
}

/**
 * Creates scope from find options
 *
 * Converts standard Sequelize find options into a reusable scope
 * definition for query template creation.
 *
 * @param findOptions - Find options to convert
 * @returns Scope definition
 *
 * @example
 * ```typescript
 * const scope = createScopeFromFindOptions({
 *   where: { status: 'active' },
 *   include: ['profile'],
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export function createScopeFromFindOptions(
  findOptions: FindOptions
): ScopeDefinition {
  return {
    where: findOptions.where,
    include: findOptions.include as any,
    attributes: findOptions.attributes as any,
    order: findOptions.order,
    limit: findOptions.limit,
    offset: findOptions.offset,
    group: findOptions.group,
    having: findOptions.having,
    subQuery: findOptions.subQuery,
  };
}

/**
 * Validates scope definition for common issues
 *
 * Checks scope configuration for potential problems like missing
 * includes, conflicting options, and performance anti-patterns.
 *
 * @param scope - Scope definition to validate
 * @returns Validation result with warnings
 *
 * @example
 * ```typescript
 * const validation = validateScope(myScope);
 * if (validation.warnings.length > 0) {
 *   console.warn('Scope issues:', validation.warnings);
 * }
 * ```
 */
export function validateScope(
  scope: ScopeDefinition
): {
  valid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for potential cartesian product
  if (scope.include && Array.isArray(scope.include)) {
    const hasManyCount = scope.include.filter(
      (inc: any) => !inc.separate && !inc.required
    ).length;

    if (hasManyCount > 1) {
      warnings.push('Multiple includes without separate:true may cause cartesian product');
      suggestions.push('Consider adding separate:true to hasMany associations');
    }
  }

  // Check for missing subQuery control with includes
  if (scope.include && scope.limit && scope.subQuery === undefined) {
    warnings.push('Using limit with include without explicit subQuery setting');
    suggestions.push('Set subQuery:false to avoid incorrect limit behavior');
  }

  // Check for overly broad attribute selection
  if (!scope.attributes || (Array.isArray(scope.attributes) && scope.attributes.length === 0)) {
    suggestions.push('Consider specifying attributes to reduce data transfer');
  }

  return {
    valid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Exports scope definitions for documentation or testing
 *
 * Serializes scope configuration into JSON format for export,
 * documentation generation, or configuration management.
 *
 * @param model - Model to export scopes from
 * @returns Scope definitions map
 *
 * @example
 * ```typescript
 * const scopes = exportScopeDefinitions(User);
 * fs.writeFileSync('user-scopes.json', JSON.stringify(scopes, null, 2));
 * ```
 */
export function exportScopeDefinitions(
  model: ModelStatic<any>
): Record<string, any> {
  const scopes: Record<string, any> = {};
  const modelOptions = (model as any).options;

  if (modelOptions.scopes) {
    for (const [name, scopeDef] of Object.entries(modelOptions.scopes)) {
      scopes[name] = scopeDef;
    }
  }

  return scopes;
}
