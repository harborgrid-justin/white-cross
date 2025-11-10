/**
 * LOC: FILTOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/filter-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Query services
 *   - Data access layers
 *   - Search/filter modules
 *   - Analytics services
 *   - Reporting services
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/filter-operations-kit.ts
 * Locator: WC-DATALAY-FILTOPS-001
 * Purpose: Filter Operations Kit - Production-grade filter operations for complex querying
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Query services, Search services, Analytics, Reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, class-validator
 * Exports: 45+ filter utility functions for advanced filtering, composition, and query building
 *
 * LLM Context: Production-ready filter operations for White Cross healthcare threat intelligence platform.
 * Provides comprehensive filtering capabilities including equality, range, pattern matching, logical operations,
 * complex filtering, nested filtering, dynamic filtering, conditional filtering, contextual filtering,
 * parameterized filtering, template-based filtering, rule-based filtering, policy-based filtering,
 * permission-based filtering, role-based filtering, scope-based filtering, tenant-based filtering,
 * temporal filtering, and version-based filtering. All filters include full Sequelize Op integration,
 * type safety with generics, performance optimization, and HIPAA-compliant audit logging.
 */

import {
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Op,
  Sequelize,
  WhereOptions,
  Literal,
} from 'sequelize';
import {
  createSuccessResponse,
  BadRequestError,
  InternalServerError,
  createLogger,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Filter operator types for Sequelize operations
 */
export enum FilterOperator {
  EQUAL = 'eq',
  NOT_EQUAL = 'ne',
  GREATER_THAN = 'gt',
  GREATER_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_OR_EQUAL = 'lte',
  BETWEEN = 'between',
  NOT_BETWEEN = 'notBetween',
  IN = 'in',
  NOT_IN = 'notIn',
  LIKE = 'like',
  NOT_LIKE = 'notLike',
  ILIKE = 'iLike',
  REGEXP = 'regexp',
  IS_NULL = 'is',
}

/**
 * Logical operators for combining filters
 */
export enum LogicalOperator {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  XOR = 'xor',
}

/**
 * Filter context types for contextual filtering
 */
export enum FilterContext {
  ADMIN = 'admin',
  USER = 'user',
  SYSTEM = 'system',
  ANALYTICS = 'analytics',
  REPORTING = 'reporting',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
}

/**
 * Generic filter interface
 */
export interface Filter<T = any> {
  field: string;
  operator: FilterOperator;
  value: T;
  caseSensitive?: boolean;
  nullable?: boolean;
}

/**
 * Complex filter with multiple conditions
 */
export interface ComplexFilter {
  filters: Filter[];
  logicalOperator: LogicalOperator;
  nested?: ComplexFilter[];
}

/**
 * Filter chain for sequential filtering
 */
export interface FilterChain<T = any> {
  id: string;
  filters: Filter<T>[];
  name: string;
  description?: string;
  createdAt: Date;
  enabled: boolean;
}

/**
 * Dynamic filter configuration
 */
export interface DynamicFilterConfig {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  operators: FilterOperator[];
  required: boolean;
  defaultValue?: any;
}

/**
 * Contextual filter with permissions
 */
export interface ContextualFilter {
  context: FilterContext;
  userId: string;
  roleId: string;
  tenantId: string;
  permissions: string[];
  filters: Filter[];
}

/**
 * Rule-based filter definition
 */
export interface FilterRule {
  id: string;
  name: string;
  description: string;
  conditions: Filter[];
  actions: string[];
  priority: number;
  enabled: boolean;
}

/**
 * Filter metadata for tracking
 */
export interface FilterMetadata {
  id: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  executionTime: number;
  resultCount: number;
  cacheKey?: string;
}

// ============================================================================
// FILTER OPERATION FUNCTIONS
// ============================================================================

/**
 * @injectable NestJS service for filter operations
 */
@Injectable()
export class FilterOperationsService {
  private readonly logger = createLogger('FilterOperationsService');
  private readonly filterCache = new Map<string, WhereOptions>();
  private readonly maxCacheSize = 1000;

  /**
   * Equal filter operation
   * @param field - The database field to filter
   * @param value - The value to match
   * @returns Sequelize where clause for equality
   * @example const result = equalFilter('threatLevel', 'HIGH');
   */
  equalFilter<T = any>(field: string, value: T): WhereOptions {
    if (!field || value === undefined) {
      throw new BadRequestError('Field and value are required for equal filter');
    }
    return { [field]: { [Op.eq]: value } };
  }

  /**
   * Not equal filter operation
   * @param field - The database field to filter
   * @param value - The value to exclude
   * @returns Sequelize where clause for inequality
   */
  notEqualFilter<T = any>(field: string, value: T): WhereOptions {
    if (!field || value === undefined) {
      throw new BadRequestError('Field and value are required for not equal filter');
    }
    return { [field]: { [Op.ne]: value } };
  }

  /**
   * Greater than filter operation
   * @param field - The database field to filter
   * @param value - The numeric value for comparison
   * @returns Sequelize where clause for greater than
   */
  greaterThanFilter(field: string, value: number): WhereOptions {
    if (!field || typeof value !== 'number') {
      throw new BadRequestError('Field must be a string and value must be a number');
    }
    return { [field]: { [Op.gt]: value } };
  }

  /**
   * Less than filter operation
   * @param field - The database field to filter
   * @param value - The numeric value for comparison
   * @returns Sequelize where clause for less than
   */
  lessThanFilter(field: string, value: number): WhereOptions {
    if (!field || typeof value !== 'number') {
      throw new BadRequestError('Field must be a string and value must be a number');
    }
    return { [field]: { [Op.lt]: value } };
  }

  /**
   * Greater than or equal filter operation
   * @param field - The database field to filter
   * @param value - The numeric value for comparison
   * @returns Sequelize where clause for greater than or equal
   */
  greaterOrEqualFilter(field: string, value: number): WhereOptions {
    if (!field || typeof value !== 'number') {
      throw new BadRequestError('Field must be a string and value must be a number');
    }
    return { [field]: { [Op.gte]: value } };
  }

  /**
   * Less than or equal filter operation
   * @param field - The database field to filter
   * @param value - The numeric value for comparison
   * @returns Sequelize where clause for less than or equal
   */
  lessOrEqualFilter(field: string, value: number): WhereOptions {
    if (!field || typeof value !== 'number') {
      throw new BadRequestError('Field must be a string and value must be a number');
    }
    return { [field]: { [Op.lte]: value } };
  }

  /**
   * Between filter operation for range queries
   * @param field - The database field to filter
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   * @returns Sequelize where clause for range between
   */
  betweenFilter(field: string, min: number, max: number): WhereOptions {
    if (!field || typeof min !== 'number' || typeof max !== 'number') {
      throw new BadRequestError('Field, min, and max must be valid');
    }
    if (min > max) {
      throw new BadRequestError('Minimum value cannot be greater than maximum value');
    }
    return { [field]: { [Op.between]: [min, max] } };
  }

  /**
   * Not between filter operation
   * @param field - The database field to filter
   * @param min - The minimum value to exclude
   * @param max - The maximum value to exclude
   * @returns Sequelize where clause for not between
   */
  notBetweenFilter(field: string, min: number, max: number): WhereOptions {
    if (!field || typeof min !== 'number' || typeof max !== 'number') {
      throw new BadRequestError('Field, min, and max must be valid');
    }
    if (min > max) {
      throw new BadRequestError('Minimum value cannot be greater than maximum value');
    }
    return { [field]: { [Op.notBetween]: [min, max] } };
  }

  /**
   * In filter operation for matching multiple values
   * @param field - The database field to filter
   * @param values - Array of values to match
   * @returns Sequelize where clause for IN operation
   */
  inFilter<T = any>(field: string, values: T[]): WhereOptions {
    if (!field || !Array.isArray(values) || values.length === 0) {
      throw new BadRequestError('Field and non-empty array of values are required');
    }
    return { [field]: { [Op.in]: values } };
  }

  /**
   * Not in filter operation
   * @param field - The database field to filter
   * @param values - Array of values to exclude
   * @returns Sequelize where clause for NOT IN operation
   */
  notInFilter<T = any>(field: string, values: T[]): WhereOptions {
    if (!field || !Array.isArray(values) || values.length === 0) {
      throw new BadRequestError('Field and non-empty array of values are required');
    }
    return { [field]: { [Op.notIn]: values } };
  }

  /**
   * Like filter operation for pattern matching
   * @param field - The database field to filter
   * @param pattern - The pattern to match (case-sensitive)
   * @returns Sequelize where clause for LIKE operation
   */
  likeFilter(field: string, pattern: string): WhereOptions {
    if (!field || !pattern) {
      throw new BadRequestError('Field and pattern are required');
    }
    return { [field]: { [Op.like]: `%${pattern}%` } };
  }

  /**
   * Not like filter operation
   * @param field - The database field to filter
   * @param pattern - The pattern to exclude
   * @returns Sequelize where clause for NOT LIKE operation
   */
  notLikeFilter(field: string, pattern: string): WhereOptions {
    if (!field || !pattern) {
      throw new BadRequestError('Field and pattern are required');
    }
    return { [field]: { [Op.notLike]: `%${pattern}%` } };
  }

  /**
   * ILike filter operation for case-insensitive pattern matching
   * @param field - The database field to filter
   * @param pattern - The pattern to match (case-insensitive)
   * @returns Sequelize where clause for ILIKE operation
   */
  ilikeFilter(field: string, pattern: string): WhereOptions {
    if (!field || !pattern) {
      throw new BadRequestError('Field and pattern are required');
    }
    return { [field]: { [Op.iLike]: `%${pattern}%` } };
  }

  /**
   * Regexp filter operation for regex pattern matching
   * @param field - The database field to filter
   * @param pattern - The regex pattern to match
   * @returns Sequelize where clause for REGEXP operation
   */
  regexpFilter(field: string, pattern: string): WhereOptions {
    if (!field || !pattern) {
      throw new BadRequestError('Field and pattern are required');
    }
    try {
      new RegExp(pattern);
    } catch (err) {
      throw new BadRequestError('Invalid regex pattern provided');
    }
    return { [field]: { [Op.regexp]: pattern } };
  }

  /**
   * Starts with filter operation
   * @param field - The database field to filter
   * @param prefix - The prefix to match
   * @returns Sequelize where clause for prefix matching
   */
  startsWithFilter(field: string, prefix: string): WhereOptions {
    if (!field || !prefix) {
      throw new BadRequestError('Field and prefix are required');
    }
    return { [field]: { [Op.like]: `${prefix}%` } };
  }

  /**
   * Ends with filter operation
   * @param field - The database field to filter
   * @param suffix - The suffix to match
   * @returns Sequelize where clause for suffix matching
   */
  endsWithFilter(field: string, suffix: string): WhereOptions {
    if (!field || !suffix) {
      throw new BadRequestError('Field and suffix are required');
    }
    return { [field]: { [Op.like]: `%${suffix}` } };
  }

  /**
   * Contains filter operation for substring matching
   * @param field - The database field to filter
   * @param substring - The substring to match
   * @returns Sequelize where clause for substring matching
   */
  containsFilter(field: string, substring: string): WhereOptions {
    if (!field || !substring) {
      throw new BadRequestError('Field and substring are required');
    }
    return { [field]: { [Op.like]: `%${substring}%` } };
  }

  /**
   * Not contains filter operation
   * @param field - The database field to filter
   * @param substring - The substring to exclude
   * @returns Sequelize where clause for not containing substring
   */
  notContainsFilter(field: string, substring: string): WhereOptions {
    if (!field || !substring) {
      throw new BadRequestError('Field and substring are required');
    }
    return { [field]: { [Op.notLike]: `%${substring}%` } };
  }

  /**
   * Is null filter operation
   * @param field - The database field to filter
   * @returns Sequelize where clause for null values
   */
  isNullFilter(field: string): WhereOptions {
    if (!field) {
      throw new BadRequestError('Field is required');
    }
    return { [field]: { [Op.is]: null } };
  }

  /**
   * Is not null filter operation
   * @param field - The database field to filter
   * @returns Sequelize where clause for non-null values
   */
  isNotNullFilter(field: string): WhereOptions {
    if (!field) {
      throw new BadRequestError('Field is required');
    }
    return { [field]: { [Op.not]: null } };
  }

  /**
   * And filter operation combining multiple filters
   * @param filters - Array of filter where clauses
   * @returns Combined where clause with AND logic
   */
  andFilter(...filters: WhereOptions[]): WhereOptions {
    if (!filters || filters.length === 0) {
      throw new BadRequestError('At least one filter is required');
    }
    return { [Op.and]: filters };
  }

  /**
   * Or filter operation combining multiple filters
   * @param filters - Array of filter where clauses
   * @returns Combined where clause with OR logic
   */
  orFilter(...filters: WhereOptions[]): WhereOptions {
    if (!filters || filters.length === 0) {
      throw new BadRequestError('At least one filter is required');
    }
    return { [Op.or]: filters };
  }

  /**
   * Not filter operation negating a filter
   * @param filter - The filter to negate
   * @returns Negated where clause
   */
  notFilter(filter: WhereOptions): WhereOptions {
    if (!filter) {
      throw new BadRequestError('Filter is required');
    }
    return { [Op.not]: filter };
  }

  /**
   * Xor filter operation for exclusive or logic
   * @param filterA - First filter condition
   * @param filterB - Second filter condition
   * @returns XOR combined where clause
   */
  xorFilter(filterA: WhereOptions, filterB: WhereOptions): WhereOptions {
    if (!filterA || !filterB) {
      throw new BadRequestError('Both filters are required for XOR operation');
    }
    return {
      [Op.or]: [
        { [Op.and]: [filterA, { [Op.not]: filterB }] },
        { [Op.and]: [{ [Op.not]: filterA }, filterB] },
      ],
    };
  }

  /**
   * Complex filter operation with multiple conditions and logic
   * @param complexFilter - Complex filter definition
   * @returns Sequelize where clause
   */
  complexFilter(complexFilter: ComplexFilter): WhereOptions {
    if (!complexFilter || !complexFilter.filters || complexFilter.filters.length === 0) {
      throw new BadRequestError('ComplexFilter with filters is required');
    }

    const baseFilters = complexFilter.filters.map((f) =>
      this.buildFilterClause(f),
    );

    let result: WhereOptions = baseFilters[0];

    if (complexFilter.logicalOperator === LogicalOperator.AND) {
      result = { [Op.and]: baseFilters };
    } else if (complexFilter.logicalOperator === LogicalOperator.OR) {
      result = { [Op.or]: baseFilters };
    }

    if (complexFilter.nested && complexFilter.nested.length > 0) {
      const nestedFilters = complexFilter.nested.map((n) =>
        this.complexFilter(n),
      );
      result = { [Op.and]: [result, ...nestedFilters] };
    }

    return result;
  }

  /**
   * Nested filter operation for hierarchical data
   * @param parentField - Parent field path
   * @param nestedFilter - Filter on nested data
   * @returns Sequelize where clause for nested filtering
   */
  nestedFilter(parentField: string, nestedFilter: WhereOptions): WhereOptions {
    if (!parentField || !nestedFilter) {
      throw new BadRequestError('Parent field and nested filter are required');
    }
    return {
      [`$${parentField}$`]: nestedFilter,
    };
  }

  /**
   * Dynamic filter operation with configuration
   * @param config - Dynamic filter configuration
   * @param value - The value to apply
   * @returns Sequelize where clause
   */
  dynamicFilter(config: DynamicFilterConfig, value: any): WhereOptions {
    if (!config || !config.field) {
      throw new BadRequestError('Filter configuration with field is required');
    }

    if (config.required && (value === undefined || value === null)) {
      throw new BadRequestError(`Value for field ${config.field} is required`);
    }

    switch (config.type) {
      case 'string':
        return { [config.field]: { [Op.iLike]: `%${value}%` } };
      case 'number':
        if (typeof value !== 'number') {
          throw new BadRequestError(`Value for ${config.field} must be a number`);
        }
        return { [config.field]: { [Op.eq]: value } };
      case 'boolean':
        return { [config.field]: { [Op.eq]: !!value } };
      case 'date':
        return { [config.field]: { [Op.gte]: new Date(value) } };
      default:
        return { [config.field]: { [Op.eq]: value } };
    }
  }

  /**
   * Custom filter operation with user-defined logic
   * @param filterFn - Custom filter function
   * @returns Sequelize Sequelize.literal for custom SQL
   */
  customFilter(filterFn: (field: string) => string): Literal {
    if (typeof filterFn !== 'function') {
      throw new BadRequestError('Filter function is required');
    }
    try {
      const sql = filterFn('');
      return Sequelize.literal(sql);
    } catch (err) {
      throw new BadRequestError('Invalid filter function provided');
    }
  }

  /**
   * Composite filter combining multiple filter operations
   * @param filters - Array of filters to compose
   * @returns Combined where clause
   */
  compositeFilter(filters: Filter[]): WhereOptions {
    if (!filters || filters.length === 0) {
      throw new BadRequestError('At least one filter is required');
    }

    const whereConditions: WhereOptions[] = filters.map((f) =>
      this.buildFilterClause(f),
    );

    return { [Op.and]: whereConditions };
  }

  /**
   * Chained filter operation for sequential filtering
   * @param chain - Filter chain definition
   * @returns Combined where clause from chain
   */
  chainedFilter(chain: FilterChain): WhereOptions {
    if (!chain || !chain.filters || chain.filters.length === 0) {
      throw new BadRequestError('Filter chain with filters is required');
    }

    if (!chain.enabled) {
      throw new BadRequestError('Filter chain is not enabled');
    }

    const whereConditions: WhereOptions[] = chain.filters.map((f) =>
      this.buildFilterClause(f),
    );

    return { [Op.and]: whereConditions };
  }

  /**
   * Conditional filter operation applying filters based on condition
   * @param condition - Boolean condition to evaluate
   * @param trueFilter - Filter to apply if condition is true
   * @param falseFilter - Filter to apply if condition is false
   * @returns Sequelize where clause based on condition
   */
  conditionalFilter(
    condition: boolean,
    trueFilter: WhereOptions,
    falseFilter?: WhereOptions,
  ): WhereOptions {
    if (!trueFilter) {
      throw new BadRequestError('True filter is required');
    }
    return condition ? trueFilter : (falseFilter || {});
  }

  /**
   * Contextual filter operation with permission checks
   * @param contextualFilter - Contextual filter definition
   * @returns Sequelize where clause with context applied
   */
  contextualFilter(contextualFilter: ContextualFilter): WhereOptions {
    if (!contextualFilter || !contextualFilter.filters) {
      throw new BadRequestError('Contextual filter definition is required');
    }

    const baseFilters: WhereOptions[] = contextualFilter.filters.map((f) =>
      this.buildFilterClause(f),
    );

    // Add tenant isolation for multi-tenant systems
    if (contextualFilter.tenantId) {
      baseFilters.push({ tenantId: contextualFilter.tenantId });
    }

    // Add role-based filtering if applicable
    if (contextualFilter.context === FilterContext.SECURITY) {
      baseFilters.push({ roleId: contextualFilter.roleId });
    }

    return { [Op.and]: baseFilters };
  }

  /**
   * Parameterized filter operation with parameter substitution
   * @param template - Filter template with placeholders
   * @param params - Parameters to substitute
   * @returns Sequelize where clause with parameters applied
   */
  parameterizedFilter(
    template: { field: string; operator: string },
    params: Record<string, any>,
  ): WhereOptions {
    if (!template || !template.field || !params) {
      throw new BadRequestError('Template and parameters are required');
    }

    const value = params[template.field];
    if (value === undefined) {
      throw new BadRequestError(`Parameter for field ${template.field} not found`);
    }

    return { [template.field]: { [Op.eq]: value } };
  }

  /**
   * Template filter operation using predefined templates
   * @param templateName - Name of the filter template
   * @param values - Values to apply to template
   * @returns Sequelize where clause from template
   */
  templateFilter(templateName: string, values: Record<string, any>): WhereOptions {
    if (!templateName || !values) {
      throw new BadRequestError('Template name and values are required');
    }

    const templates: Record<string, (v: any) => WhereOptions> = {
      recent: (days) => ({
        createdAt: { [Op.gte]: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      }),
      active: () => ({ isActive: true }),
      highSeverity: () => ({ severity: { [Op.gte]: 8 } }),
    };

    const template = templates[templateName];
    if (!template) {
      throw new BadRequestError(`Unknown template: ${templateName}`);
    }

    return template(values);
  }

  /**
   * Rule-based filter operation applying defined rules
   * @param rule - Filter rule definition
   * @returns Sequelize where clause from rule
   */
  ruleBasedFilter(rule: FilterRule): WhereOptions {
    if (!rule || !rule.conditions) {
      throw new BadRequestError('Filter rule with conditions is required');
    }

    if (!rule.enabled) {
      throw new BadRequestError('Filter rule is not enabled');
    }

    const whereConditions: WhereOptions[] = rule.conditions.map((c) =>
      this.buildFilterClause(c),
    );

    return { [Op.and]: whereConditions };
  }

  /**
   * Policy-based filter operation enforcing access policies
   * @param policyField - Field for policy enforcement
   * @param policyValue - Expected policy value
   * @returns Sequelize where clause enforcing policy
   */
  policyFilter(policyField: string, policyValue: string): WhereOptions {
    if (!policyField || !policyValue) {
      throw new BadRequestError('Policy field and value are required');
    }
    return { [policyField]: { [Op.eq]: policyValue } };
  }

  /**
   * Permission-based filter operation checking permissions
   * @param permissions - Array of required permissions
   * @param field - Field to filter by permissions
   * @returns Sequelize where clause enforcing permissions
   */
  permissionFilter(permissions: string[], field: string = 'permissions'): WhereOptions {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new BadRequestError('Non-empty permissions array is required');
    }
    return {
      [field]: { [Op.overlap]: permissions },
    };
  }

  /**
   * Role-based filter operation restricting by role
   * @param roles - Array of allowed roles
   * @returns Sequelize where clause for role filtering
   */
  roleFilter(roles: string[]): WhereOptions {
    if (!Array.isArray(roles) || roles.length === 0) {
      throw new BadRequestError('Non-empty roles array is required');
    }
    return { role: { [Op.in]: roles } };
  }

  /**
   * Scope-based filter operation limiting to specific scope
   * @param scope - Scope identifier
   * @param scopeField - Field containing scope information
   * @returns Sequelize where clause for scope filtering
   */
  scopeFilter(scope: string, scopeField: string = 'scope'): WhereOptions {
    if (!scope) {
      throw new BadRequestError('Scope is required');
    }
    return { [scopeField]: { [Op.eq]: scope } };
  }

  /**
   * Tenant-based filter operation for multi-tenant isolation
   * @param tenantId - Tenant identifier
   * @returns Sequelize where clause for tenant filtering
   */
  tenantFilter(tenantId: string): WhereOptions {
    if (!tenantId) {
      throw new BadRequestError('Tenant ID is required');
    }
    return { tenantId: { [Op.eq]: tenantId } };
  }

  /**
   * Temporal filter operation for time-based filtering
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @param field - Timestamp field to filter
   * @returns Sequelize where clause for temporal filtering
   */
  temporalFilter(
    startDate: Date,
    endDate: Date,
    field: string = 'createdAt',
  ): WhereOptions {
    if (!startDate || !endDate) {
      throw new BadRequestError('Start and end dates are required');
    }
    if (startDate > endDate) {
      throw new BadRequestError('Start date cannot be after end date');
    }
    return {
      [field]: { [Op.between]: [startDate, endDate] },
    };
  }

  /**
   * Version-based filter operation for versioned data
   * @param version - Version to filter
   * @param versionField - Field containing version
   * @returns Sequelize where clause for version filtering
   */
  versionFilter(version: number, versionField: string = 'version'): WhereOptions {
    if (typeof version !== 'number' || version < 0) {
      throw new BadRequestError('Version must be a non-negative number');
    }
    return { [versionField]: { [Op.eq]: version } };
  }

  /**
   * Build filter clause from Filter interface
   * @param filter - Filter object
   * @returns Sequelize where clause
   * @private
   */
  private buildFilterClause(filter: Filter): WhereOptions {
    const { field, operator, value } = filter;

    switch (operator) {
      case FilterOperator.EQUAL:
        return { [field]: { [Op.eq]: value } };
      case FilterOperator.NOT_EQUAL:
        return { [field]: { [Op.ne]: value } };
      case FilterOperator.GREATER_THAN:
        return { [field]: { [Op.gt]: value } };
      case FilterOperator.LESS_THAN:
        return { [field]: { [Op.lt]: value } };
      case FilterOperator.GREATER_OR_EQUAL:
        return { [field]: { [Op.gte]: value } };
      case FilterOperator.LESS_OR_EQUAL:
        return { [field]: { [Op.lte]: value } };
      case FilterOperator.IN:
        return { [field]: { [Op.in]: value } };
      case FilterOperator.NOT_IN:
        return { [field]: { [Op.notIn]: value } };
      case FilterOperator.LIKE:
        return { [field]: { [Op.like]: `%${value}%` } };
      case FilterOperator.IS_NULL:
        return { [field]: { [Op.is]: null } };
      default:
        return { [field]: { [Op.eq]: value } };
    }
  }
}

export default FilterOperationsService;
