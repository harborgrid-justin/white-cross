/**
 * LOC: API_VER_PROD_001
 * File: /reuse/api-versioning-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - express
 *
 * DOWNSTREAM (imported by):
 *   - API controllers requiring versioning
 *   - Version migration services
 *   - API gateway/routing
 *   - Deprecation management services
 *   - Analytics services
 */

/**
 * File: /reuse/api-versioning-kit.prod.ts
 * Locator: WC-API-VER-PROD-001
 * Purpose: Production-Grade API Versioning & Deprecation Kit - Enterprise API lifecycle management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Express
 * Downstream: ../backend/api/*, Controllers, Routers, Gateway, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: 48 production-ready versioning functions covering URI/header/content versioning, deprecation, migration
 *
 * LLM Context: Production-grade API versioning and lifecycle management utilities for White Cross healthcare platform.
 * Provides comprehensive API versioning strategies (URI-based /v1/v2, header-based, content negotiation), deprecation
 * management with sunset headers and warning notifications, backward compatibility layer transformations, breaking
 * change detection and documentation, version migration guides and automation, version analytics and adoption tracking,
 * multi-version routing with NestJS decorators, version-aware Swagger/OpenAPI documentation, semantic versioning
 * support, version access control and policies, request/response transformation between versions, and automated
 * deprecation scheduling with notifications. Includes Sequelize models for version metadata, deprecation schedules,
 * migration guides, and usage analytics. Supports HIPAA-compliant versioning for healthcare APIs.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  createParamDecorator,
  SetMetadata,
  NestInterceptor,
  CallHandler,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  applyDecorators,
  UseInterceptors,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiBearerAuth,
  ApiProperty,
  ApiExtraModels,
  getSchemaPath,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { z } from 'zod';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * API versioning strategy types
 */
export enum VersionStrategy {
  URI = 'uri', // /v1/resource, /v2/resource
  HEADER = 'header', // X-API-Version: 1
  ACCEPT_HEADER = 'accept_header', // Accept: application/vnd.api+json;version=1
  QUERY_PARAM = 'query_param', // /resource?version=1
  CUSTOM = 'custom', // Custom implementation
}

/**
 * API version lifecycle status
 */
export enum VersionStatus {
  DEVELOPMENT = 'development', // In development, not public
  BETA = 'beta', // Public beta testing
  ACTIVE = 'active', // Current stable version
  DEPRECATED = 'deprecated', // Deprecated but still functional
  SUNSET = 'sunset', // Sunset announced, limited support
  RETIRED = 'retired', // No longer available
}

/**
 * Deprecation warning levels
 */
export enum DeprecationLevel {
  INFO = 'info', // Informational notice
  WARNING = 'warning', // Approaching deprecation
  CRITICAL = 'critical', // Imminent sunset
  RETIRED = 'retired', // Version retired
}

/**
 * Breaking change types
 */
export enum BreakingChangeType {
  FIELD_REMOVED = 'field_removed',
  FIELD_RENAMED = 'field_renamed',
  TYPE_CHANGED = 'type_changed',
  ENDPOINT_REMOVED = 'endpoint_removed',
  ENDPOINT_MOVED = 'endpoint_moved',
  AUTH_CHANGED = 'auth_changed',
  BEHAVIOR_CHANGED = 'behavior_changed',
  VALIDATION_CHANGED = 'validation_changed',
}

/**
 * Version comparison result
 */
export enum VersionComparison {
  GREATER = 1,
  EQUAL = 0,
  LESS = -1,
  INCOMPATIBLE = -2,
}

/**
 * API version metadata
 */
export interface APIVersion {
  version: string; // Semantic version (1.0.0) or simple (v1)
  status: VersionStatus;
  releaseDate: Date;
  deprecationDate?: Date;
  sunsetDate?: Date;
  retirementDate?: Date;
  description?: string;
  changelog?: string[];
  breakingChanges?: BreakingChange[];
  migrationGuide?: string;
  documentation?: string;
  supportEmail?: string;
}

/**
 * Deprecation policy configuration
 */
export interface DeprecationPolicy {
  version: string;
  deprecationDate: Date;
  sunsetDate: Date;
  retirementDate: Date;
  reason: string;
  replacementVersion?: string;
  migrationPath?: string;
  notificationSchedule: Date[]; // When to send notifications
  warningLevel: DeprecationLevel;
  autoRetire: boolean;
}

/**
 * Breaking change documentation
 */
export interface BreakingChange {
  type: BreakingChangeType;
  field?: string;
  endpoint?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
  migrationSteps: string[];
  automatedMigration: boolean;
  affectedClients?: string[];
}

/**
 * Version migration guide
 */
export interface MigrationGuide {
  fromVersion: string;
  toVersion: string;
  breakingChanges: BreakingChange[];
  steps: string[];
  codeExamples?: Record<string, { before: string; after: string }>;
  estimatedEffort?: string;
  automationAvailable: boolean;
  testingChecklist: string[];
}

/**
 * Backward compatibility configuration
 */
export interface BackwardCompatibilityConfig {
  sourceVersion: string;
  targetVersion: string;
  transformRequest?: boolean;
  transformResponse?: boolean;
  fieldMappings?: Record<string, string>;
  defaultValues?: Record<string, any>;
  customTransformers?: Record<string, (value: any) => any>;
  strict: boolean; // Fail on unmapped fields
}

/**
 * Version metadata for requests
 */
export interface VersionMetadata {
  requestedVersion: string;
  resolvedVersion: string;
  strategy: VersionStrategy;
  isDeprecated: boolean;
  deprecationWarning?: string;
  sunsetDate?: Date;
  replacementVersion?: string;
  migrationGuide?: string;
}

/**
 * Version usage analytics
 */
export interface VersionAnalytics {
  version: string;
  totalRequests: number;
  uniqueClients: number;
  errorRate: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  topEndpoints: Array<{ path: string; count: number }>;
  clientDistribution: Record<string, number>;
  periodStart: Date;
  periodEnd: Date;
}

/**
 * Version route configuration
 */
export interface VersionRouteConfig {
  version: string;
  path: string;
  handler: any;
  method: string;
  deprecated?: boolean;
  sunsetDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Sunset header information
 */
export interface SunsetHeader {
  date: Date;
  link?: string; // Link to migration guide
  alternateVersion?: string;
}

/**
 * Version negotiation result
 */
export interface VersionNegotiation {
  selectedVersion: string;
  strategy: VersionStrategy;
  acceptable: boolean;
  fallbackVersion?: string;
  warnings: string[];
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Semantic version regex pattern
 */
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Simple version regex (v1, v2, etc.)
 */
const SIMPLE_VERSION_PATTERN = /^v\d+$/;

/**
 * API version validation schema
 */
export const APIVersionSchema = z.object({
  version: z.string().refine(
    (v) => SEMVER_PATTERN.test(v) || SIMPLE_VERSION_PATTERN.test(v),
    { message: 'Version must be semantic (1.0.0) or simple (v1) format' }
  ),
  status: z.nativeEnum(VersionStatus),
  releaseDate: z.coerce.date(),
  deprecationDate: z.coerce.date().optional(),
  sunsetDate: z.coerce.date().optional(),
  retirementDate: z.coerce.date().optional(),
  description: z.string().optional(),
  changelog: z.array(z.string()).optional(),
  migrationGuide: z.string().optional(),
  documentation: z.string().url().optional(),
  supportEmail: z.string().email().optional(),
}).refine(
  (data) => {
    if (data.deprecationDate && data.sunsetDate) {
      return data.deprecationDate < data.sunsetDate;
    }
    return true;
  },
  { message: 'Deprecation date must be before sunset date' }
).refine(
  (data) => {
    if (data.sunsetDate && data.retirementDate) {
      return data.sunsetDate < data.retirementDate;
    }
    return true;
  },
  { message: 'Sunset date must be before retirement date' }
);

/**
 * Deprecation policy validation schema
 */
export const DeprecationPolicySchema = z.object({
  version: z.string(),
  deprecationDate: z.coerce.date(),
  sunsetDate: z.coerce.date(),
  retirementDate: z.coerce.date(),
  reason: z.string().min(10),
  replacementVersion: z.string().optional(),
  migrationPath: z.string().optional(),
  notificationSchedule: z.array(z.coerce.date()),
  warningLevel: z.nativeEnum(DeprecationLevel),
  autoRetire: z.boolean().default(false),
}).refine(
  (data) => data.deprecationDate < data.sunsetDate && data.sunsetDate < data.retirementDate,
  { message: 'Dates must be in order: deprecation < sunset < retirement' }
);

/**
 * Breaking change validation schema
 */
export const BreakingChangeSchema = z.object({
  type: z.nativeEnum(BreakingChangeType),
  field: z.string().optional(),
  endpoint: z.string().optional(),
  oldValue: z.any().optional(),
  newValue: z.any().optional(),
  description: z.string().min(10),
  migrationSteps: z.array(z.string()).min(1),
  automatedMigration: z.boolean().default(false),
  affectedClients: z.array(z.string()).optional(),
});

/**
 * Migration guide validation schema
 */
export const MigrationGuideSchema = z.object({
  fromVersion: z.string(),
  toVersion: z.string(),
  breakingChanges: z.array(BreakingChangeSchema),
  steps: z.array(z.string()).min(1),
  codeExamples: z.record(z.object({
    before: z.string(),
    after: z.string(),
  })).optional(),
  estimatedEffort: z.string().optional(),
  automationAvailable: z.boolean().default(false),
  testingChecklist: z.array(z.string()),
});

/**
 * Backward compatibility config validation schema
 */
export const BackwardCompatibilityConfigSchema = z.object({
  sourceVersion: z.string(),
  targetVersion: z.string(),
  transformRequest: z.boolean().default(false),
  transformResponse: z.boolean().default(false),
  fieldMappings: z.record(z.string()).optional(),
  defaultValues: z.record(z.any()).optional(),
  strict: z.boolean().default(false),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * API Version Model - Tracks all API versions and their lifecycle
 */
@Table({
  tableName: 'api_versions',
  timestamps: true,
  indexes: [
    { fields: ['version'], unique: true },
    { fields: ['status'] },
    { fields: ['deprecation_date'] },
    { fields: ['sunset_date'] },
    { fields: ['retirement_date'] },
  ],
})
export class APIVersionModel extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Version identifier (e.g., v1, 1.0.0)',
  })
  version: string;

  @Column({
    type: DataType.ENUM(...Object.values(VersionStatus)),
    allowNull: false,
    defaultValue: VersionStatus.DEVELOPMENT,
    comment: 'Current lifecycle status of the version',
  })
  status: VersionStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Date when version was released',
  })
  releaseDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deprecation_date',
    comment: 'Date when version was deprecated',
  })
  deprecationDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'sunset_date',
    comment: 'Date when version enters sunset period',
  })
  sunsetDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'retirement_date',
    comment: 'Date when version will be retired',
  })
  retirementDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Version description and features',
  })
  description: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Array of changelog entries',
  })
  changelog: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Breaking changes in this version',
  })
  breakingChanges: BreakingChange[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'migration_guide',
    comment: 'Migration guide URL or text',
  })
  migrationGuide: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Documentation URL',
  })
  documentation: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'support_email',
    comment: 'Support contact email',
  })
  supportEmail: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
    comment: 'Whether version is currently active',
  })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * API Endpoint Version Model - Tracks endpoint-specific versioning
 */
@Table({
  tableName: 'api_endpoint_versions',
  timestamps: true,
  indexes: [
    { fields: ['endpoint', 'version'], unique: true },
    { fields: ['version'] },
    { fields: ['method'] },
    { fields: ['is_deprecated'] },
  ],
})
export class APIEndpointVersionModel extends Model {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Endpoint path (e.g., /users/:id)',
  })
  endpoint: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'API version',
  })
  version: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    comment: 'HTTP method (GET, POST, etc.)',
  })
  method: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Request schema definition',
  })
  requestSchema: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Response schema definition',
  })
  responseSchema: any;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_deprecated',
    comment: 'Whether endpoint is deprecated',
  })
  isDeprecated: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deprecated_since',
    comment: 'When endpoint was deprecated',
  })
  deprecatedSince: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'replacement_endpoint',
    comment: 'Replacement endpoint if deprecated',
  })
  replacementEndpoint: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Endpoint-specific metadata',
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Deprecation Schedule Model - Manages deprecation timeline and notifications
 */
@Table({
  tableName: 'deprecation_schedules',
  timestamps: true,
  indexes: [
    { fields: ['version'] },
    { fields: ['sunset_date'] },
    { fields: ['retirement_date'] },
    { fields: ['warning_level'] },
  ],
})
export class DeprecationScheduleModel extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Deprecated version',
  })
  version: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'deprecation_date',
    comment: 'When deprecation was announced',
  })
  deprecationDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'sunset_date',
    comment: 'When version enters sunset',
  })
  sunsetDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'retirement_date',
    comment: 'When version will be retired',
  })
  retirementDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Reason for deprecation',
  })
  reason: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'replacement_version',
    comment: 'Version to migrate to',
  })
  replacementVersion: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'migration_path',
    comment: 'Migration instructions URL or text',
  })
  migrationPath: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'notification_schedule',
    comment: 'Dates to send notifications',
  })
  notificationSchedule: Date[];

  @Column({
    type: DataType.ENUM(...Object.values(DeprecationLevel)),
    allowNull: false,
    defaultValue: DeprecationLevel.INFO,
    field: 'warning_level',
    comment: 'Current warning level',
  })
  warningLevel: DeprecationLevel;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'auto_retire',
    comment: 'Whether to auto-retire on retirement date',
  })
  autoRetire: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'notifications_sent',
    comment: 'Log of sent notifications',
  })
  notificationsSent: Array<{ date: Date; recipients: number }>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Version Migration Model - Stores migration guides and change documentation
 */
@Table({
  tableName: 'version_migrations',
  timestamps: true,
  indexes: [
    { fields: ['from_version', 'to_version'], unique: true },
    { fields: ['from_version'] },
    { fields: ['to_version'] },
  ],
})
export class VersionMigrationModel extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'from_version',
    comment: 'Source version',
  })
  fromVersion: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'to_version',
    comment: 'Target version',
  })
  toVersion: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'breaking_changes',
    comment: 'List of breaking changes',
  })
  breakingChanges: BreakingChange[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: 'Step-by-step migration instructions',
  })
  steps: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'code_examples',
    comment: 'Before/after code examples',
  })
  codeExamples: Record<string, { before: string; after: string }>;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'estimated_effort',
    comment: 'Estimated migration effort',
  })
  estimatedEffort: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'automation_available',
    comment: 'Whether automated migration is available',
  })
  automationAvailable: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'testing_checklist',
    comment: 'Testing checklist items',
  })
  testingChecklist: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'successful_migrations',
    comment: 'Count of successful migrations',
  })
  successfulMigrations: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'failed_migrations',
    comment: 'Count of failed migrations',
  })
  failedMigrations: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Version Analytics Model - Tracks version usage and adoption metrics
 */
@Table({
  tableName: 'version_analytics',
  timestamps: true,
  indexes: [
    { fields: ['version', 'period_start', 'period_end'] },
    { fields: ['version'] },
    { fields: ['period_start'] },
  ],
})
export class VersionAnalyticsModel extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'API version',
  })
  version: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'period_start',
    comment: 'Analytics period start',
  })
  periodStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'period_end',
    comment: 'Analytics period end',
  })
  periodEnd: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'total_requests',
    comment: 'Total request count',
  })
  totalRequests: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'unique_clients',
    comment: 'Unique client count',
  })
  uniqueClients: number;

  @Column({
    type: DataType.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
    field: 'error_rate',
    comment: 'Error rate (0-1)',
  })
  errorRate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'avg_response_time',
    comment: 'Average response time (ms)',
  })
  avgResponseTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'p95_response_time',
    comment: '95th percentile response time (ms)',
  })
  p95ResponseTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'p99_response_time',
    comment: '99th percentile response time (ms)',
  })
  p99ResponseTime: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'top_endpoints',
    comment: 'Most used endpoints',
  })
  topEndpoints: Array<{ path: string; count: number }>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'client_distribution',
    comment: 'Distribution by client',
  })
  clientDistribution: Record<string, number>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Additional metadata',
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - URI VERSIONING
// ============================================================================

/**
 * Parse version from URI path
 *
 * @param uri - Request URI
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromUri('/v1/users') // 'v1'
 * parseVersionFromUri('/api/v2/posts') // 'v2'
 * parseVersionFromUri('/users') // null
 */
export function parseVersionFromUri(uri: string): string | null {
  const match = uri.match(/\/v(\d+)(?:\/|$)/i);
  return match ? `v${match[1]}` : null;
}

/**
 * Validate version URI format
 *
 * @param uri - URI to validate
 * @param allowedVersions - List of allowed versions
 * @returns Validation result
 *
 * @example
 * validateVersionUri('/v1/users', ['v1', 'v2']) // { valid: true, version: 'v1' }
 * validateVersionUri('/v3/users', ['v1', 'v2']) // { valid: false, error: 'Version not allowed' }
 */
export function validateVersionUri(
  uri: string,
  allowedVersions: string[]
): { valid: boolean; version?: string; error?: string } {
  const version = parseVersionFromUri(uri);

  if (!version) {
    return { valid: false, error: 'No version found in URI' };
  }

  if (!allowedVersions.includes(version)) {
    return { valid: false, error: `Version ${version} is not allowed` };
  }

  return { valid: true, version };
}

/**
 * Extract version prefix from path
 *
 * @param path - Request path
 * @returns Path without version prefix
 *
 * @example
 * extractVersionPrefix('/v1/users') // '/users'
 * extractVersionPrefix('/api/v2/posts') // '/api/posts'
 */
export function extractVersionPrefix(path: string): string {
  return path.replace(/\/v\d+(?=\/|$)/i, '');
}

/**
 * Create versioned path
 *
 * @param path - Base path
 * @param version - Version to add
 * @param prefix - Optional prefix (default: '')
 * @returns Versioned path
 *
 * @example
 * createVersionedPath('/users', 'v1') // '/v1/users'
 * createVersionedPath('/posts', 'v2', '/api') // '/api/v2/posts'
 */
export function createVersionedPath(
  path: string,
  version: string,
  prefix: string = ''
): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
  const versionPath = version.startsWith('v') ? version : `v${version}`;

  if (prefix) {
    return `${normalizedPrefix}/${versionPath}${normalizedPath}`;
  }
  return `/${versionPath}${normalizedPath}`;
}

/**
 * Normalize version URI format
 *
 * @param uri - URI to normalize
 * @returns Normalized URI
 *
 * @example
 * normalizeVersionUri('/V1/users') // '/v1/users'
 * normalizeVersionUri('/api/V2/posts/') // '/api/v2/posts'
 */
export function normalizeVersionUri(uri: string): string {
  return uri
    .replace(/\/V(\d+)/gi, '/v$1')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

/**
 * Check if version format is valid
 *
 * @param version - Version string to validate
 * @returns True if valid
 *
 * @example
 * isValidVersionFormat('v1') // true
 * isValidVersionFormat('1.0.0') // true
 * isValidVersionFormat('invalid') // false
 */
export function isValidVersionFormat(version: string): boolean {
  return SEMVER_PATTERN.test(version) || SIMPLE_VERSION_PATTERN.test(version);
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - HEADER VERSIONING
// ============================================================================

/**
 * Parse version from request header
 *
 * @param headers - Request headers
 * @param headerName - Header name (default: 'X-API-Version')
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromHeader({ 'x-api-version': 'v1' }) // 'v1'
 * parseVersionFromHeader({ 'accept': 'application/json' }) // null
 */
export function parseVersionFromHeader(
  headers: Record<string, string | string[]>,
  headerName: string = 'X-API-Version'
): string | null {
  const headerValue = headers[headerName.toLowerCase()];
  if (!headerValue) return null;

  const version = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  return version.trim() || null;
}

/**
 * Create version header
 *
 * @param version - Version string
 * @param headerName - Header name (default: 'X-API-Version')
 * @returns Header object
 *
 * @example
 * createVersionHeader('v1') // { 'X-API-Version': 'v1' }
 */
export function createVersionHeader(
  version: string,
  headerName: string = 'X-API-Version'
): Record<string, string> {
  return { [headerName]: version };
}

/**
 * Negotiate version from request headers
 *
 * @param headers - Request headers
 * @param availableVersions - List of available versions
 * @param defaultVersion - Default version if not specified
 * @returns Negotiation result
 *
 * @example
 * negotiateVersion(headers, ['v1', 'v2'], 'v2')
 */
export function negotiateVersion(
  headers: Record<string, string | string[]>,
  availableVersions: string[],
  defaultVersion: string
): VersionNegotiation {
  const warnings: string[] = [];
  let selectedVersion: string | null = null;

  // Try X-API-Version header
  selectedVersion = parseVersionFromHeader(headers, 'X-API-Version');

  // Try Accept header with version
  if (!selectedVersion) {
    const acceptVersion = parseVersionFromAcceptHeader(headers.accept as string);
    if (acceptVersion) {
      selectedVersion = acceptVersion;
    }
  }

  // Use default if not specified
  if (!selectedVersion) {
    selectedVersion = defaultVersion;
    warnings.push('No version specified, using default');
  }

  // Check if version is available
  const acceptable = availableVersions.includes(selectedVersion);
  if (!acceptable) {
    warnings.push(`Version ${selectedVersion} not available`);
    return {
      selectedVersion,
      strategy: VersionStrategy.HEADER,
      acceptable: false,
      fallbackVersion: defaultVersion,
      warnings,
    };
  }

  return {
    selectedVersion,
    strategy: VersionStrategy.HEADER,
    acceptable: true,
    warnings,
  };
}

/**
 * Validate version header format
 *
 * @param headers - Request headers
 * @param headerName - Header name
 * @returns Validation result
 *
 * @example
 * validateVersionHeader({ 'x-api-version': 'v1' }) // { valid: true, version: 'v1' }
 */
export function validateVersionHeader(
  headers: Record<string, string | string[]>,
  headerName: string = 'X-API-Version'
): { valid: boolean; version?: string; error?: string } {
  const version = parseVersionFromHeader(headers, headerName);

  if (!version) {
    return { valid: false, error: 'Version header not found' };
  }

  if (!isValidVersionFormat(version)) {
    return { valid: false, error: 'Invalid version format' };
  }

  return { valid: true, version };
}

/**
 * Extract custom version header
 *
 * @param headers - Request headers
 * @param customHeaderName - Custom header name
 * @returns Version or null
 *
 * @example
 * extractCustomHeader(headers, 'X-MyApp-Version') // 'v1'
 */
export function extractCustomHeader(
  headers: Record<string, string | string[]>,
  customHeaderName: string
): string | null {
  return parseVersionFromHeader(headers, customHeaderName);
}

/**
 * Create Accept header with version
 *
 * @param mediaType - Media type (e.g., 'application/json')
 * @param version - Version string
 * @param vendor - Optional vendor prefix
 * @returns Accept header value
 *
 * @example
 * createAcceptVersionHeader('application/json', 'v1', 'myapp')
 * // 'application/vnd.myapp+json;version=v1'
 */
export function createAcceptVersionHeader(
  mediaType: string,
  version: string,
  vendor?: string
): string {
  if (vendor) {
    const baseType = mediaType.split('/')[1] || 'json';
    return `application/vnd.${vendor}+${baseType};version=${version}`;
  }
  return `${mediaType};version=${version}`;
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - CONTENT NEGOTIATION
// ============================================================================

/**
 * Parse version from Accept header
 *
 * @param acceptHeader - Accept header value
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromAcceptHeader('application/vnd.api+json;version=v1') // 'v1'
 * parseVersionFromAcceptHeader('application/json') // null
 */
export function parseVersionFromAcceptHeader(acceptHeader: string): string | null {
  if (!acceptHeader) return null;

  // Match version parameter
  const versionMatch = acceptHeader.match(/version=([^\s;,]+)/i);
  if (versionMatch) {
    return versionMatch[1];
  }

  // Match vendor version (application/vnd.api.v1+json)
  const vendorMatch = acceptHeader.match(/vnd\.[^.+]+\.v(\d+)/i);
  if (vendorMatch) {
    return `v${vendorMatch[1]}`;
  }

  return null;
}

/**
 * Select version based on content type negotiation
 *
 * @param acceptHeader - Accept header value
 * @param availableVersions - Available versions
 * @param defaultVersion - Default version
 * @returns Selected version
 *
 * @example
 * selectVersionByContent(acceptHeader, ['v1', 'v2'], 'v2') // 'v1'
 */
export function selectVersionByContent(
  acceptHeader: string,
  availableVersions: string[],
  defaultVersion: string
): string {
  const requestedVersion = parseVersionFromAcceptHeader(acceptHeader);

  if (!requestedVersion) {
    return defaultVersion;
  }

  if (availableVersions.includes(requestedVersion)) {
    return requestedVersion;
  }

  return defaultVersion;
}

/**
 * Create Content-Type header with version
 *
 * @param mediaType - Media type
 * @param version - Version
 * @param vendor - Optional vendor
 * @returns Content-Type header value
 *
 * @example
 * createContentTypeVersion('application/json', 'v1') // 'application/json;version=v1'
 */
export function createContentTypeVersion(
  mediaType: string,
  version: string,
  vendor?: string
): string {
  if (vendor) {
    const baseType = mediaType.split('/')[1] || 'json';
    return `application/vnd.${vendor}+${baseType};version=${version}`;
  }
  return `${mediaType};version=${version}`;
}

/**
 * Match media type with version
 *
 * @param acceptHeader - Accept header
 * @param mediaType - Media type to match
 * @param version - Version to match
 * @returns True if matches
 *
 * @example
 * matchMediaType('application/json;version=v1', 'application/json', 'v1') // true
 */
export function matchMediaType(
  acceptHeader: string,
  mediaType: string,
  version: string
): boolean {
  const parsedVersion = parseVersionFromAcceptHeader(acceptHeader);
  const hasMediaType = acceptHeader.includes(mediaType);
  return hasMediaType && parsedVersion === version;
}

/**
 * Prioritize versions from Accept header
 *
 * @param acceptHeader - Accept header with quality values
 * @param availableVersions - Available versions
 * @returns Sorted versions by priority
 *
 * @example
 * prioritizeVersions('application/json;version=v1;q=0.9, application/json;version=v2;q=1.0', ['v1', 'v2'])
 * // ['v2', 'v1']
 */
export function prioritizeVersions(
  acceptHeader: string,
  availableVersions: string[]
): string[] {
  const mediaTypes = acceptHeader.split(',').map((type) => type.trim());

  const scored = mediaTypes
    .map((type) => {
      const version = parseVersionFromAcceptHeader(type);
      const qMatch = type.match(/q=([\d.]+)/);
      const quality = qMatch ? parseFloat(qMatch[1]) : 1.0;

      return { version, quality };
    })
    .filter((item) => item.version && availableVersions.includes(item.version))
    .sort((a, b) => b.quality - a.quality);

  return scored.map((item) => item.version!);
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - DEPRECATION MANAGEMENT
// ============================================================================

/**
 * Create deprecation warning message
 *
 * @param version - Deprecated version
 * @param sunsetDate - Sunset date
 * @param replacementVersion - Replacement version
 * @returns Warning message
 *
 * @example
 * createDeprecationWarning('v1', new Date('2025-12-31'), 'v2')
 * // 'Version v1 is deprecated and will be sunset on 2025-12-31. Please migrate to v2.'
 */
export function createDeprecationWarning(
  version: string,
  sunsetDate: Date,
  replacementVersion?: string
): string {
  const dateStr = sunsetDate.toISOString().split('T')[0];
  let message = `Version ${version} is deprecated and will be sunset on ${dateStr}.`;

  if (replacementVersion) {
    message += ` Please migrate to ${replacementVersion}.`;
  }

  return message;
}

/**
 * Check deprecation status of version
 *
 * @param version - Version to check
 * @param versionMetadata - Version metadata
 * @returns Deprecation status
 *
 * @example
 * checkDeprecationStatus('v1', versionData)
 * // { deprecated: true, level: 'warning', daysRemaining: 30 }
 */
export function checkDeprecationStatus(
  version: string,
  versionMetadata: APIVersion
): {
  deprecated: boolean;
  level: DeprecationLevel;
  daysRemaining?: number;
  sunsetDate?: Date;
} {
  if (versionMetadata.status === VersionStatus.RETIRED) {
    return {
      deprecated: true,
      level: DeprecationLevel.RETIRED,
      daysRemaining: 0,
    };
  }

  if (!versionMetadata.deprecationDate) {
    return {
      deprecated: false,
      level: DeprecationLevel.INFO,
    };
  }

  const now = new Date();
  const sunsetDate = versionMetadata.sunsetDate;

  if (!sunsetDate) {
    return {
      deprecated: true,
      level: DeprecationLevel.WARNING,
    };
  }

  const daysRemaining = Math.ceil(
    (sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let level: DeprecationLevel;
  if (daysRemaining <= 0) {
    level = DeprecationLevel.RETIRED;
  } else if (daysRemaining <= 30) {
    level = DeprecationLevel.CRITICAL;
  } else if (daysRemaining <= 90) {
    level = DeprecationLevel.WARNING;
  } else {
    level = DeprecationLevel.INFO;
  }

  return {
    deprecated: true,
    level,
    daysRemaining,
    sunsetDate,
  };
}

/**
 * Calculate sunset date based on deprecation date and policy
 *
 * @param deprecationDate - Date of deprecation
 * @param gracePeriodDays - Grace period in days
 * @returns Sunset date
 *
 * @example
 * calculateSunsetDate(new Date('2025-01-01'), 90) // 2025-04-01
 */
export function calculateSunsetDate(
  deprecationDate: Date,
  gracePeriodDays: number
): Date {
  const sunsetDate = new Date(deprecationDate);
  sunsetDate.setDate(sunsetDate.getDate() + gracePeriodDays);
  return sunsetDate;
}

/**
 * Generate Sunset HTTP header
 *
 * @param sunsetDate - Sunset date
 * @param migrationGuideUrl - Optional migration guide URL
 * @returns Sunset header value
 *
 * @example
 * generateSunsetHeader(new Date('2025-12-31'), 'https://api.example.com/migration')
 * // 'Sat, 31 Dec 2025 00:00:00 GMT'
 */
export function generateSunsetHeader(
  sunsetDate: Date,
  migrationGuideUrl?: string
): string {
  return sunsetDate.toUTCString();
}

/**
 * Schedule deprecation with notification timeline
 *
 * @param policy - Deprecation policy
 * @returns Notification dates
 *
 * @example
 * scheduleDeprecation(policy)
 * // [Date, Date, Date] - notification dates
 */
export function scheduleDeprecation(policy: DeprecationPolicy): Date[] {
  const notifications: Date[] = [];
  const now = new Date();
  const { deprecationDate, sunsetDate } = policy;

  // Immediate notification
  if (deprecationDate <= now) {
    notifications.push(now);
  }

  // Calculate notification intervals
  const totalDays = Math.ceil(
    (sunsetDate.getTime() - deprecationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Notify at 75%, 50%, 25%, and 10% of grace period
  const percentages = [0.75, 0.5, 0.25, 0.1];

  percentages.forEach((pct) => {
    const notifyDate = new Date(deprecationDate);
    notifyDate.setDate(notifyDate.getDate() + Math.floor(totalDays * (1 - pct)));

    if (notifyDate > now && notifyDate < sunsetDate) {
      notifications.push(notifyDate);
    }
  });

  // Final warning 7 days before sunset
  const finalWarning = new Date(sunsetDate);
  finalWarning.setDate(finalWarning.getDate() - 7);
  if (finalWarning > now) {
    notifications.push(finalWarning);
  }

  return notifications.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Create deprecation notification message
 *
 * @param version - Deprecated version
 * @param policy - Deprecation policy
 * @param daysRemaining - Days until sunset
 * @returns Notification message
 *
 * @example
 * notifyDeprecation('v1', policy, 30)
 */
export function notifyDeprecation(
  version: string,
  policy: DeprecationPolicy,
  daysRemaining: number
): string {
  let urgency = 'Notice';
  if (daysRemaining <= 7) urgency = 'URGENT';
  else if (daysRemaining <= 30) urgency = 'Warning';

  let message = `[${urgency}] API Version ${version} Deprecation\n\n`;
  message += `Version ${version} will be sunset in ${daysRemaining} days on ${policy.sunsetDate.toISOString().split('T')[0]}.\n\n`;
  message += `Reason: ${policy.reason}\n\n`;

  if (policy.replacementVersion) {
    message += `Please migrate to version ${policy.replacementVersion}.\n`;
  }

  if (policy.migrationPath) {
    message += `Migration guide: ${policy.migrationPath}\n`;
  }

  return message;
}

/**
 * Check if version is deprecated
 *
 * @param version - Version to check
 * @param versionMetadata - Version metadata
 * @returns True if deprecated
 *
 * @example
 * isVersionDeprecated('v1', versionData) // true
 */
export function isVersionDeprecated(
  version: string,
  versionMetadata: APIVersion
): boolean {
  return (
    versionMetadata.status === VersionStatus.DEPRECATED ||
    versionMetadata.status === VersionStatus.SUNSET ||
    versionMetadata.status === VersionStatus.RETIRED
  );
}

/**
 * Get remaining lifetime of version
 *
 * @param versionMetadata - Version metadata
 * @returns Days remaining or -1 if no sunset date
 *
 * @example
 * getRemainingLifetime(versionData) // 45
 */
export function getRemainingLifetime(versionMetadata: APIVersion): number {
  if (!versionMetadata.sunsetDate) {
    return -1;
  }

  const now = new Date();
  const daysRemaining = Math.ceil(
    (versionMetadata.sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, daysRemaining);
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - MIGRATION HELPERS
// ============================================================================

/**
 * Generate migration guide
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param breakingChanges - List of breaking changes
 * @returns Migration guide
 *
 * @example
 * generateMigrationGuide('v1', 'v2', changes)
 */
export function generateMigrationGuide(
  fromVersion: string,
  toVersion: string,
  breakingChanges: BreakingChange[]
): MigrationGuide {
  const steps: string[] = [];
  const codeExamples: Record<string, { before: string; after: string }> = {};

  // Generate steps from breaking changes
  breakingChanges.forEach((change, index) => {
    steps.push(`Step ${index + 1}: ${change.description}`);
    change.migrationSteps.forEach((step) => {
      steps.push(`  - ${step}`);
    });

    // Generate code examples for field changes
    if (change.type === BreakingChangeType.FIELD_RENAMED && change.field) {
      codeExamples[change.field] = {
        before: `{ "${change.field}": ${JSON.stringify(change.oldValue)} }`,
        after: `{ "${change.newValue}": ${JSON.stringify(change.oldValue)} }`,
      };
    }
  });

  // Testing checklist
  const testingChecklist = [
    'Update API client to target new version',
    'Update request/response models',
    'Run integration tests',
    'Verify error handling',
    'Test backward compatibility if using both versions',
    'Monitor error rates after deployment',
  ];

  return {
    fromVersion,
    toVersion,
    breakingChanges,
    steps,
    codeExamples,
    estimatedEffort: `${breakingChanges.length * 2} hours`,
    automationAvailable: breakingChanges.every((c) => c.automatedMigration),
    testingChecklist,
  };
}

/**
 * Detect breaking changes between versions
 *
 * @param oldSchema - Old API schema
 * @param newSchema - New API schema
 * @returns List of breaking changes
 *
 * @example
 * detectBreakingChanges(oldSchema, newSchema)
 */
export function detectBreakingChanges(
  oldSchema: any,
  newSchema: any
): BreakingChange[] {
  const changes: BreakingChange[] = [];

  // Detect removed fields
  if (oldSchema.properties && newSchema.properties) {
    Object.keys(oldSchema.properties).forEach((field) => {
      if (!newSchema.properties[field]) {
        changes.push({
          type: BreakingChangeType.FIELD_REMOVED,
          field,
          oldValue: oldSchema.properties[field],
          description: `Field "${field}" has been removed`,
          migrationSteps: [
            `Remove references to "${field}" field`,
            'Update client code to handle missing field',
          ],
          automatedMigration: false,
        });
      }
    });

    // Detect type changes
    Object.keys(oldSchema.properties).forEach((field) => {
      if (newSchema.properties[field]) {
        const oldType = oldSchema.properties[field].type;
        const newType = newSchema.properties[field].type;

        if (oldType !== newType) {
          changes.push({
            type: BreakingChangeType.TYPE_CHANGED,
            field,
            oldValue: oldType,
            newValue: newType,
            description: `Field "${field}" type changed from ${oldType} to ${newType}`,
            migrationSteps: [
              `Update "${field}" field type in client models`,
              'Add type conversion logic if needed',
            ],
            automatedMigration: false,
          });
        }
      }
    });
  }

  return changes;
}

/**
 * Create backward compatibility layer
 *
 * @param config - Compatibility configuration
 * @returns Transform functions
 *
 * @example
 * createCompatibilityLayer(config)
 */
export function createCompatibilityLayer(
  config: BackwardCompatibilityConfig
): {
  transformRequest: (data: any) => any;
  transformResponse: (data: any) => any;
} {
  const transformRequest = (data: any): any => {
    if (!config.transformRequest) return data;

    const transformed = { ...data };

    // Apply field mappings
    if (config.fieldMappings) {
      Object.entries(config.fieldMappings).forEach(([oldField, newField]) => {
        if (oldField in transformed) {
          transformed[newField] = transformed[oldField];
          delete transformed[oldField];
        }
      });
    }

    // Apply default values
    if (config.defaultValues) {
      Object.entries(config.defaultValues).forEach(([field, value]) => {
        if (!(field in transformed)) {
          transformed[field] = value;
        }
      });
    }

    // Apply custom transformers
    if (config.customTransformers) {
      Object.entries(config.customTransformers).forEach(([field, transformer]) => {
        if (field in transformed) {
          transformed[field] = transformer(transformed[field]);
        }
      });
    }

    return transformed;
  };

  const transformResponse = (data: any): any => {
    if (!config.transformResponse) return data;

    const transformed = { ...data };

    // Reverse field mappings
    if (config.fieldMappings) {
      Object.entries(config.fieldMappings).forEach(([oldField, newField]) => {
        if (newField in transformed) {
          transformed[oldField] = transformed[newField];
          delete transformed[newField];
        }
      });
    }

    return transformed;
  };

  return { transformRequest, transformResponse };
}

/**
 * Transform request to target version
 *
 * @param request - Request data
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param config - Compatibility config
 * @returns Transformed request
 *
 * @example
 * transformRequestToVersion(data, 'v1', 'v2', config)
 */
export function transformRequestToVersion(
  request: any,
  fromVersion: string,
  toVersion: string,
  config: BackwardCompatibilityConfig
): any {
  const { transformRequest } = createCompatibilityLayer(config);
  return transformRequest(request);
}

/**
 * Transform response from version
 *
 * @param response - Response data
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param config - Compatibility config
 * @returns Transformed response
 *
 * @example
 * transformResponseFromVersion(data, 'v2', 'v1', config)
 */
export function transformResponseFromVersion(
  response: any,
  fromVersion: string,
  toVersion: string,
  config: BackwardCompatibilityConfig
): any {
  const { transformResponse } = createCompatibilityLayer(config);
  return transformResponse(response);
}

/**
 * Validate backward compatibility
 *
 * @param oldVersion - Old version data
 * @param newVersion - New version data
 * @param config - Compatibility config
 * @returns Validation result
 *
 * @example
 * validateBackwardCompatibility(oldData, newData, config)
 */
export function validateBackwardCompatibility(
  oldVersion: any,
  newVersion: any,
  config: BackwardCompatibilityConfig
): { compatible: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if all old fields are mapped or have defaults
  const oldFields = Object.keys(oldVersion);
  const mappedFields = new Set(Object.keys(config.fieldMappings || {}));
  const defaultFields = new Set(Object.keys(config.defaultValues || {}));

  oldFields.forEach((field) => {
    if (!mappedFields.has(field) && !defaultFields.has(field) && !(field in newVersion)) {
      if (config.strict) {
        errors.push(`Field "${field}" is not mapped and has no default value`);
      }
    }
  });

  return {
    compatible: errors.length === 0,
    errors,
  };
}

/**
 * Generate changelog
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param changes - List of changes
 * @returns Formatted changelog
 *
 * @example
 * generateChangeLog('v1', 'v2', changes)
 */
export function generateChangeLog(
  fromVersion: string,
  toVersion: string,
  changes: BreakingChange[]
): string {
  let changelog = `# Changelog: ${fromVersion} → ${toVersion}\n\n`;

  const grouped = changes.reduce((acc, change) => {
    if (!acc[change.type]) {
      acc[change.type] = [];
    }
    acc[change.type].push(change);
    return acc;
  }, {} as Record<BreakingChangeType, BreakingChange[]>);

  Object.entries(grouped).forEach(([type, typeChanges]) => {
    changelog += `## ${type.replace(/_/g, ' ').toUpperCase()}\n\n`;
    typeChanges.forEach((change) => {
      changelog += `- ${change.description}\n`;
      if (change.field) {
        changelog += `  - Field: \`${change.field}\`\n`;
      }
      if (change.endpoint) {
        changelog += `  - Endpoint: \`${change.endpoint}\`\n`;
      }
    });
    changelog += '\n';
  });

  return changelog;
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - VERSION ANALYTICS
// ============================================================================

/**
 * Track version usage
 *
 * @param version - API version
 * @param clientId - Client identifier
 * @param endpoint - Endpoint path
 * @param responseTime - Response time in ms
 * @param statusCode - HTTP status code
 *
 * @example
 * trackVersionUsage('v1', 'client-123', '/users', 150, 200)
 */
export function trackVersionUsage(
  version: string,
  clientId: string,
  endpoint: string,
  responseTime: number,
  statusCode: number
): void {
  // In production, this would store to database or analytics service
  const event = {
    version,
    clientId,
    endpoint,
    responseTime,
    statusCode,
    timestamp: new Date(),
    isError: statusCode >= 400,
  };

  // Log or store event
  console.log('[Version Analytics]', event);
}

/**
 * Get version usage metrics
 *
 * @param version - API version
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Analytics data
 *
 * @example
 * await getVersionMetrics('v1', startDate, endDate)
 */
export async function getVersionMetrics(
  version: string,
  startDate: Date,
  endDate: Date
): Promise<VersionAnalytics> {
  // In production, query from analytics database
  const analytics = await VersionAnalyticsModel.findOne({
    where: {
      version,
      periodStart: startDate,
      periodEnd: endDate,
    },
  });

  if (!analytics) {
    return {
      version,
      totalRequests: 0,
      uniqueClients: 0,
      errorRate: 0,
      avgResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      topEndpoints: [],
      clientDistribution: {},
      periodStart: startDate,
      periodEnd: endDate,
    };
  }

  return {
    version: analytics.version,
    totalRequests: Number(analytics.totalRequests),
    uniqueClients: analytics.uniqueClients,
    errorRate: Number(analytics.errorRate),
    avgResponseTime: analytics.avgResponseTime,
    p95ResponseTime: analytics.p95ResponseTime,
    p99ResponseTime: analytics.p99ResponseTime,
    topEndpoints: analytics.topEndpoints || [],
    clientDistribution: analytics.clientDistribution || {},
    periodStart: analytics.periodStart,
    periodEnd: analytics.periodEnd,
  };
}

/**
 * Analyze version adoption rate
 *
 * @param versions - List of versions to analyze
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Adoption metrics
 *
 * @example
 * await analyzeVersionAdoption(['v1', 'v2'], startDate, endDate)
 */
export async function analyzeVersionAdoption(
  versions: string[],
  startDate: Date,
  endDate: Date
): Promise<Record<string, { percentage: number; requests: number; trend: string }>> {
  const results: Record<string, { percentage: number; requests: number; trend: string }> = {};

  let totalRequests = 0;
  const versionRequests: Record<string, number> = {};

  for (const version of versions) {
    const metrics = await getVersionMetrics(version, startDate, endDate);
    versionRequests[version] = metrics.totalRequests;
    totalRequests += metrics.totalRequests;
  }

  for (const version of versions) {
    const requests = versionRequests[version];
    const percentage = totalRequests > 0 ? (requests / totalRequests) * 100 : 0;

    // Simple trend calculation (would be more sophisticated in production)
    let trend = 'stable';
    if (percentage > 50) trend = 'growing';
    if (percentage < 10) trend = 'declining';

    results[version] = {
      percentage: Math.round(percentage * 100) / 100,
      requests,
      trend,
    };
  }

  return results;
}

/**
 * Calculate migration rate
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Migration percentage
 *
 * @example
 * await calculateMigrationRate('v1', 'v2', startDate, endDate)
 */
export async function calculateMigrationRate(
  fromVersion: string,
  toVersion: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const fromMetrics = await getVersionMetrics(fromVersion, startDate, endDate);
  const toMetrics = await getVersionMetrics(toVersion, startDate, endDate);

  const totalRequests = fromMetrics.totalRequests + toMetrics.totalRequests;

  if (totalRequests === 0) return 0;

  return (toMetrics.totalRequests / totalRequests) * 100;
}

/**
 * Get version distribution
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Version distribution
 *
 * @example
 * await getVersionDistribution(startDate, endDate)
 */
export async function getVersionDistribution(
  startDate: Date,
  endDate: Date
): Promise<Array<{ version: string; requests: number; percentage: number }>> {
  const allVersions = await APIVersionModel.findAll({
    where: { isActive: true },
  });

  const distribution: Array<{ version: string; requests: number; percentage: number }> = [];
  let totalRequests = 0;

  for (const versionModel of allVersions) {
    const metrics = await getVersionMetrics(versionModel.version, startDate, endDate);
    distribution.push({
      version: versionModel.version,
      requests: metrics.totalRequests,
      percentage: 0, // Will calculate after total is known
    });
    totalRequests += metrics.totalRequests;
  }

  // Calculate percentages
  distribution.forEach((item) => {
    item.percentage = totalRequests > 0 ? (item.requests / totalRequests) * 100 : 0;
  });

  return distribution.sort((a, b) => b.requests - a.requests);
}

/**
 * Generate version analytics report
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Formatted report
 *
 * @example
 * await generateVersionReport(startDate, endDate)
 */
export async function generateVersionReport(
  startDate: Date,
  endDate: Date
): Promise<string> {
  const distribution = await getVersionDistribution(startDate, endDate);

  let report = `# API Version Analytics Report\n\n`;
  report += `Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n\n`;

  report += `## Version Distribution\n\n`;
  distribution.forEach((item) => {
    report += `- ${item.version}: ${item.requests.toLocaleString()} requests (${item.percentage.toFixed(2)}%)\n`;
  });

  report += `\n## Recommendations\n\n`;

  // Add recommendations based on distribution
  const deprecatedVersions = distribution.filter((item) => item.percentage < 5);
  if (deprecatedVersions.length > 0) {
    report += `Consider retiring versions with low usage:\n`;
    deprecatedVersions.forEach((item) => {
      report += `- ${item.version} (${item.percentage.toFixed(2)}% usage)\n`;
    });
  }

  return report;
}

// ============================================================================
// CORE VERSIONING FUNCTIONS - VERSION ROUTING
// ============================================================================

/**
 * Route request to appropriate version handler
 *
 * @param version - Requested version
 * @param routes - Available version routes
 * @returns Route handler or null
 *
 * @example
 * routeToVersion('v1', routes)
 */
export function routeToVersion(
  version: string,
  routes: VersionRouteConfig[]
): VersionRouteConfig | null {
  return routes.find((route) => route.version === version) || null;
}

/**
 * Create version-aware middleware
 *
 * @param defaultVersion - Default version
 * @param strategy - Versioning strategy
 * @returns Express middleware
 *
 * @example
 * app.use(createVersionMiddleware('v2', VersionStrategy.HEADER))
 */
export function createVersionMiddleware(
  defaultVersion: string,
  strategy: VersionStrategy = VersionStrategy.URI
): (req: Request, res: Response, next: () => void) => void {
  return (req: Request, res: Response, next: () => void) => {
    let version: string | null = null;

    switch (strategy) {
      case VersionStrategy.URI:
        version = parseVersionFromUri(req.path);
        break;
      case VersionStrategy.HEADER:
      case VersionStrategy.ACCEPT_HEADER:
        version = parseVersionFromHeader(req.headers);
        break;
      case VersionStrategy.QUERY_PARAM:
        version = (req.query.version as string) || null;
        break;
    }

    // Attach version to request
    (req as any).apiVersion = version || defaultVersion;

    // Add version header to response
    res.setHeader('X-API-Version', (req as any).apiVersion);

    next();
  };
}

/**
 * Register versioned route
 *
 * @param config - Route configuration
 * @returns Route config
 *
 * @example
 * registerVersionedRoute({ version: 'v1', path: '/users', handler, method: 'GET' })
 */
export function registerVersionedRoute(
  config: VersionRouteConfig
): VersionRouteConfig {
  // In production, this would register with router
  return config;
}

/**
 * Get version handler for request
 *
 * @param version - Requested version
 * @param path - Request path
 * @param method - HTTP method
 * @param routes - Available routes
 * @returns Handler or null
 *
 * @example
 * getVersionHandler('v1', '/users', 'GET', routes)
 */
export function getVersionHandler(
  version: string,
  path: string,
  method: string,
  routes: VersionRouteConfig[]
): any | null {
  const route = routes.find(
    (r) => r.version === version && r.path === path && r.method === method
  );
  return route ? route.handler : null;
}

/**
 * Resolve version conflicts
 *
 * @param requestedVersion - Client requested version
 * @param availableVersions - Available versions
 * @param strategy - Resolution strategy
 * @returns Resolved version
 *
 * @example
 * resolveVersionConflict('v3', ['v1', 'v2'], 'latest')
 */
export function resolveVersionConflict(
  requestedVersion: string,
  availableVersions: string[],
  strategy: 'latest' | 'closest' | 'fail' = 'latest'
): string | null {
  if (availableVersions.includes(requestedVersion)) {
    return requestedVersion;
  }

  switch (strategy) {
    case 'latest':
      return availableVersions[availableVersions.length - 1];
    case 'closest':
      // Simple numeric comparison for v1, v2, etc.
      const requested = parseInt(requestedVersion.replace('v', ''));
      const available = availableVersions
        .map((v) => parseInt(v.replace('v', '')))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const closest = available.reduce((prev, curr) =>
        Math.abs(curr - requested) < Math.abs(prev - requested) ? curr : prev
      );
      return `v${closest}`;
    case 'fail':
    default:
      return null;
  }
}

/**
 * Create version-specific router
 *
 * @param version - Version identifier
 * @param routes - Routes for this version
 * @returns Router configuration
 *
 * @example
 * createVersionRouter('v1', routes)
 */
export function createVersionRouter(
  version: string,
  routes: VersionRouteConfig[]
): { version: string; routes: VersionRouteConfig[] } {
  return { version, routes };
}

/**
 * Validate version access
 *
 * @param version - Requested version
 * @param clientId - Client identifier
 * @param versionMetadata - Version metadata
 * @returns Access result
 *
 * @example
 * validateVersionAccess('v1', 'client-123', versionData)
 */
export function validateVersionAccess(
  version: string,
  clientId: string,
  versionMetadata: APIVersion
): { allowed: boolean; reason?: string } {
  // Check if version is retired
  if (versionMetadata.status === VersionStatus.RETIRED) {
    return {
      allowed: false,
      reason: 'Version has been retired',
    };
  }

  // Check if version is in development
  if (versionMetadata.status === VersionStatus.DEVELOPMENT) {
    // In production, you'd check if client has beta access
    return {
      allowed: false,
      reason: 'Version is in development',
    };
  }

  return { allowed: true };
}

/**
 * Apply version policy
 *
 * @param version - Version
 * @param policy - Version policy
 * @param request - Request object
 * @returns Policy result
 *
 * @example
 * applyVersionPolicy('v1', policy, req)
 */
export function applyVersionPolicy(
  version: string,
  policy: { minVersion?: string; maxVersion?: string; allowBeta?: boolean },
  request: any
): { allowed: boolean; reason?: string } {
  // Check minimum version
  if (policy.minVersion && compareVersions(version, policy.minVersion) < 0) {
    return {
      allowed: false,
      reason: `Minimum version ${policy.minVersion} required`,
    };
  }

  // Check maximum version
  if (policy.maxVersion && compareVersions(version, policy.maxVersion) > 0) {
    return {
      allowed: false,
      reason: `Maximum version ${policy.maxVersion} exceeded`,
    };
  }

  return { allowed: true };
}

/**
 * Compare two version strings
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result (1, 0, -1)
 *
 * @example
 * compareVersions('v2', 'v1') // 1
 * compareVersions('v1', 'v1') // 0
 * compareVersions('v1', 'v2') // -1
 */
export function compareVersions(version1: string, version2: string): VersionComparison {
  // Simple version comparison (v1, v2, etc.)
  const v1 = parseInt(version1.replace('v', ''));
  const v2 = parseInt(version2.replace('v', ''));

  if (isNaN(v1) || isNaN(v2)) {
    return VersionComparison.INCOMPATIBLE;
  }

  if (v1 > v2) return VersionComparison.GREATER;
  if (v1 < v2) return VersionComparison.LESS;
  return VersionComparison.EQUAL;
}

// ============================================================================
// NESTJS DECORATORS
// ============================================================================

/**
 * Metadata key for API version
 */
export const API_VERSION_KEY = 'api_version';

/**
 * Metadata key for deprecated endpoints
 */
export const DEPRECATED_KEY = 'deprecated';

/**
 * Metadata key for sunset date
 */
export const SUNSET_DATE_KEY = 'sunset_date';

/**
 * @ApiVersion decorator - Specify API version for endpoint
 *
 * @param version - API version
 *
 * @example
 * @ApiVersion('v1')
 * @Get('/users')
 * getUsers() {}
 */
export const ApiVersion = (version: string) => {
  return applyDecorators(
    SetMetadata(API_VERSION_KEY, version),
    ApiHeader({
      name: 'X-API-Version',
      description: 'API Version',
      required: false,
      schema: { default: version },
    })
  );
};

/**
 * @DeprecatedEndpoint decorator - Mark endpoint as deprecated
 *
 * @param sunsetDate - When endpoint will be removed
 * @param replacementEndpoint - Replacement endpoint
 * @param message - Deprecation message
 *
 * @example
 * @DeprecatedEndpoint(new Date('2025-12-31'), '/v2/users', 'Use v2 instead')
 * @Get('/users')
 * getUsers() {}
 */
export const DeprecatedEndpoint = (
  sunsetDate: Date,
  replacementEndpoint?: string,
  message?: string
) => {
  return applyDecorators(
    SetMetadata(DEPRECATED_KEY, true),
    SetMetadata(SUNSET_DATE_KEY, sunsetDate),
    ApiResponse({
      status: 299,
      description: 'Deprecated - ' + (message || `Sunset on ${sunsetDate.toISOString().split('T')[0]}`),
      headers: {
        'Sunset': {
          description: 'Date when endpoint will be retired',
          schema: { type: 'string', example: sunsetDate.toUTCString() },
        },
        'Deprecation': {
          description: 'Deprecation date',
          schema: { type: 'string', example: new Date().toUTCString() },
        },
        ...(replacementEndpoint && {
          'Link': {
            description: 'Link to replacement endpoint',
            schema: { type: 'string', example: `<${replacementEndpoint}>; rel="successor-version"` },
          },
        }),
      },
    })
  );
};

/**
 * @SunsetDate decorator - Set sunset date for version
 *
 * @param date - Sunset date
 *
 * @example
 * @SunsetDate(new Date('2025-12-31'))
 * @Get('/users')
 * getUsers() {}
 */
export const SunsetDate = (date: Date) => {
  return SetMetadata(SUNSET_DATE_KEY, date);
};

/**
 * @RequiresVersion decorator - Require specific version range
 *
 * @param minVersion - Minimum version
 * @param maxVersion - Maximum version
 *
 * @example
 * @RequiresVersion('v1', 'v2')
 * @Get('/users')
 * getUsers() {}
 */
export const RequiresVersion = (minVersion?: string, maxVersion?: string) => {
  return SetMetadata('version_requirements', { minVersion, maxVersion });
};

/**
 * @CurrentVersion parameter decorator - Inject current API version
 *
 * @example
 * getUsers(@CurrentVersion() version: string) {}
 */
export const CurrentVersion = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (request as any).apiVersion || 'v1';
  }
);

// ============================================================================
// NESTJS GUARDS
// ============================================================================

/**
 * Version Guard - Validate API version access
 */
@Injectable()
export class VersionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get version from request
    const version = (request as any).apiVersion;
    if (!version) {
      throw new BadRequestException('API version not specified');
    }

    // Get version metadata from database
    const versionModel = await APIVersionModel.findOne({
      where: { version },
    });

    if (!versionModel) {
      throw new BadRequestException(`API version ${version} not found`);
    }

    // Check if version is accessible
    const clientId = (request as any).user?.id || 'anonymous';
    const versionData: APIVersion = {
      version: versionModel.version,
      status: versionModel.status,
      releaseDate: versionModel.releaseDate,
      deprecationDate: versionModel.deprecationDate,
      sunsetDate: versionModel.sunsetDate,
      retirementDate: versionModel.retirementDate,
    };

    const accessResult = validateVersionAccess(version, clientId, versionData);

    if (!accessResult.allowed) {
      throw new ForbiddenException(accessResult.reason);
    }

    // Add deprecation headers if needed
    if (isVersionDeprecated(version, versionData)) {
      const deprecationStatus = checkDeprecationStatus(version, versionData);

      response.setHeader('Deprecation', 'true');

      if (versionData.sunsetDate) {
        response.setHeader('Sunset', generateSunsetHeader(versionData.sunsetDate));
      }

      const warning = createDeprecationWarning(
        version,
        versionData.sunsetDate || new Date(),
        versionModel.replacementVersion
      );
      response.setHeader('Warning', `299 - "${warning}"`);
    }

    return true;
  }
}

/**
 * Deprecation Interceptor - Add deprecation warnings to responses
 */
@Injectable()
export class DeprecationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    const isDeprecated = this.reflector.get<boolean>(
      DEPRECATED_KEY,
      context.getHandler()
    );

    const sunsetDate = this.reflector.get<Date>(
      SUNSET_DATE_KEY,
      context.getHandler()
    );

    if (isDeprecated && sunsetDate) {
      response.setHeader('Deprecation', 'true');
      response.setHeader('Sunset', generateSunsetHeader(sunsetDate));

      const version = (request as any).apiVersion || 'unknown';
      const warning = createDeprecationWarning(version, sunsetDate);
      response.setHeader('Warning', `299 - "${warning}"`);
    }

    return next.handle().pipe(
      tap(() => {
        // Track usage
        const version = (request as any).apiVersion;
        if (version) {
          trackVersionUsage(
            version,
            (request as any).user?.id || 'anonymous',
            request.path,
            Date.now() - (request as any).startTime,
            response.statusCode
          );
        }
      })
    );
  }
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Version Management Service
 */
@Injectable()
export class VersionService {
  /**
   * Get all active API versions
   */
  async getActiveVersions(): Promise<APIVersion[]> {
    const versions = await APIVersionModel.findAll({
      where: { isActive: true },
      order: [['releaseDate', 'DESC']],
    });

    return versions.map((v) => ({
      version: v.version,
      status: v.status,
      releaseDate: v.releaseDate,
      deprecationDate: v.deprecationDate,
      sunsetDate: v.sunsetDate,
      retirementDate: v.retirementDate,
      description: v.description,
      changelog: v.changelog,
      breakingChanges: v.breakingChanges,
      migrationGuide: v.migrationGuide,
      documentation: v.documentation,
      supportEmail: v.supportEmail,
    }));
  }

  /**
   * Create new API version
   */
  async createVersion(versionData: APIVersion): Promise<APIVersion> {
    const validated = APIVersionSchema.parse(versionData);

    const version = await APIVersionModel.create({
      version: validated.version,
      status: validated.status,
      releaseDate: validated.releaseDate,
      deprecationDate: validated.deprecationDate,
      sunsetDate: validated.sunsetDate,
      retirementDate: validated.retirementDate,
      description: validated.description,
      changelog: validated.changelog,
      breakingChanges: versionData.breakingChanges,
      migrationGuide: validated.migrationGuide,
      documentation: validated.documentation,
      supportEmail: validated.supportEmail,
      isActive: true,
    });

    return validated;
  }

  /**
   * Deprecate version
   */
  async deprecateVersion(
    version: string,
    policy: DeprecationPolicy
  ): Promise<void> {
    const validated = DeprecationPolicySchema.parse(policy);

    // Update version status
    await APIVersionModel.update(
      {
        status: VersionStatus.DEPRECATED,
        deprecationDate: validated.deprecationDate,
        sunsetDate: validated.sunsetDate,
        retirementDate: validated.retirementDate,
      },
      { where: { version } }
    );

    // Create deprecation schedule
    await DeprecationScheduleModel.create({
      version: validated.version,
      deprecationDate: validated.deprecationDate,
      sunsetDate: validated.sunsetDate,
      retirementDate: validated.retirementDate,
      reason: validated.reason,
      replacementVersion: validated.replacementVersion,
      migrationPath: validated.migrationPath,
      notificationSchedule: validated.notificationSchedule,
      warningLevel: validated.warningLevel,
      autoRetire: validated.autoRetire,
      notificationsSent: [],
    });
  }

  /**
   * Get migration guide
   */
  async getMigrationGuide(
    fromVersion: string,
    toVersion: string
  ): Promise<MigrationGuide | null> {
    const migration = await VersionMigrationModel.findOne({
      where: { fromVersion, toVersion },
    });

    if (!migration) return null;

    return {
      fromVersion: migration.fromVersion,
      toVersion: migration.toVersion,
      breakingChanges: migration.breakingChanges,
      steps: migration.steps,
      codeExamples: migration.codeExamples,
      estimatedEffort: migration.estimatedEffort,
      automationAvailable: migration.automationAvailable,
      testingChecklist: migration.testingChecklist,
    };
  }

  /**
   * Get version analytics
   */
  async getAnalytics(
    version: string,
    startDate: Date,
    endDate: Date
  ): Promise<VersionAnalytics> {
    return getVersionMetrics(version, startDate, endDate);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Version Management Controller
 */
@ApiTags('API Versions')
@Controller('api/versions')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  /**
   * Get all API versions
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all API versions',
    description: 'Returns list of all active API versions with their metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'List of API versions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          version: { type: 'string', example: 'v1' },
          status: { type: 'string', enum: Object.values(VersionStatus) },
          releaseDate: { type: 'string', format: 'date-time' },
          deprecationDate: { type: 'string', format: 'date-time', nullable: true },
          sunsetDate: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  })
  async getVersions(): Promise<APIVersion[]> {
    return this.versionService.getActiveVersions();
  }

  /**
   * Create new API version
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new API version',
    description: 'Creates a new API version with metadata',
  })
  @ApiResponse({ status: 201, description: 'Version created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid version data' })
  async createVersion(@Body() versionData: APIVersion): Promise<APIVersion> {
    return this.versionService.createVersion(versionData);
  }

  /**
   * Deprecate API version
   */
  @Post(':version/deprecate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deprecate API version',
    description: 'Marks an API version as deprecated and schedules sunset',
  })
  @ApiParam({ name: 'version', description: 'Version to deprecate' })
  @ApiResponse({ status: 200, description: 'Version deprecated successfully' })
  async deprecateVersion(
    @Param('version') version: string,
    @Body() policy: DeprecationPolicy
  ): Promise<{ message: string }> {
    await this.versionService.deprecateVersion(version, policy);
    return { message: `Version ${version} has been deprecated` };
  }

  /**
   * Get migration guide
   */
  @Get('migration/:fromVersion/:toVersion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get migration guide',
    description: 'Returns migration guide from one version to another',
  })
  @ApiParam({ name: 'fromVersion', description: 'Source version' })
  @ApiParam({ name: 'toVersion', description: 'Target version' })
  @ApiResponse({ status: 200, description: 'Migration guide' })
  @ApiResponse({ status: 404, description: 'Migration guide not found' })
  async getMigrationGuide(
    @Param('fromVersion') fromVersion: string,
    @Param('toVersion') toVersion: string
  ): Promise<MigrationGuide> {
    const guide = await this.versionService.getMigrationGuide(fromVersion, toVersion);
    if (!guide) {
      throw new BadRequestException('Migration guide not found');
    }
    return guide;
  }

  /**
   * Get version analytics
   */
  @Get(':version/analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get version analytics',
    description: 'Returns usage analytics for specific API version',
  })
  @ApiParam({ name: 'version', description: 'API version' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Version analytics' })
  async getAnalytics(
    @Param('version') version: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date
  ): Promise<VersionAnalytics> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    return this.versionService.getAnalytics(version, start, end);
  }

  /**
   * Get version distribution
   */
  @Get('analytics/distribution')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get version distribution',
    description: 'Returns distribution of requests across all versions',
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Version distribution' })
  async getDistribution(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date
  ): Promise<Array<{ version: string; requests: number; percentage: number }>> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    return getVersionDistribution(start, end);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Models
  APIVersionModel,
  APIEndpointVersionModel,
  DeprecationScheduleModel,
  VersionMigrationModel,
  VersionAnalyticsModel,
  // Service
  VersionService,
  // Controller
  VersionController,
  // Guards
  VersionGuard,
  // Interceptors
  DeprecationInterceptor,
};
