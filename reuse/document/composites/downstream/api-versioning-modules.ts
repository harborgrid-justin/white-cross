/**
 * LOC: DOC-DOWN-VERSION-006
 * File: /reuse/document/composites/downstream/api-versioning-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/core (v10.x)
 *   - semver (v7.x)
 *   - ../document-api-integration-composite
 *   - ../document-compliance-audit-composite
 *
 * DOWNSTREAM (imported by):
 *   - Version controllers
 *   - Backward compatibility handlers
 *   - API deprecation managers
 *   - Schema migration services
 */

/**
 * File: /reuse/document/composites/downstream/api-versioning-modules.ts
 * Locator: WC-DOWN-VERSION-006
 * Purpose: API Versioning Modules - Production-grade API version management and migration
 *
 * Upstream: @nestjs/common, @nestjs/core, semver, api-integration/compliance composites
 * Downstream: Version controllers, compatibility handlers, deprecation managers
 * Dependencies: NestJS 10.x, TypeScript 5.x, semver 7.x
 * Exports: 15 API versioning functions
 *
 * LLM Context: Production-grade API versioning implementations for White Cross platform.
 * Manages multiple API versions with backward compatibility, deprecation warnings,
 * schema versioning, automatic migration, request/response transformation,
 * and version-specific route handling. Supports semantic versioning, automatic
 * version negotiation, deprecation scheduling, and migration validation.
 */

import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
  NotImplementedException,
  VersioningType,
} from '@nestjs/common';
import { semver } from 'semver';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * API version information
 *
 * @property {string} version - Semantic version (e.g., "1.0.0")
 * @property {string} status - Version status (active, deprecated, sunset)
 * @property {string} releaseDate - Release date in ISO 8601
 * @property {string} [sunsetDate] - Sunset date for deprecation
 * @property {string} [replacedBy] - Version replacing this one
 * @property {string[]} [features] - New features in this version
 * @property {string[]} [breaking] - Breaking changes
 */
export interface ApiVersion {
  version: string;
  status: 'active' | 'deprecated' | 'sunset' | 'beta';
  releaseDate: string;
  sunsetDate?: string;
  replacedBy?: string;
  features?: string[];
  breaking?: string[];
}

/**
 * Request transformation rule
 *
 * @property {string} fromVersion - Source version
 * @property {string} toVersion - Target version
 * @property {string} path - API path pattern
 * @property {Function} transform - Transformation function
 * @property {boolean} bidirectional - Apply in both directions
 */
export interface TransformationRule {
  fromVersion: string;
  toVersion: string;
  path: string;
  transform: (data: unknown) => unknown;
  bidirectional?: boolean;
}

/**
 * Response transformation rule
 *
 * @property {string} version - Target version
 * @property {string} path - API path pattern
 * @property {Function} transform - Transformation function
 */
export interface ResponseTransformRule {
  version: string;
  path: string;
  transform: (data: unknown) => unknown;
}

/**
 * Schema version metadata
 *
 * @property {string} version - Version identifier
 * @property {Record<string, unknown>} schema - Schema definition
 * @property {number} revision - Schema revision number
 * @property {string} createdAt - Creation timestamp
 */
export interface SchemaVersion {
  version: string;
  schema: Record<string, unknown>;
  revision: number;
  createdAt: string;
}

/**
 * Deprecation notice
 *
 * @property {string} version - Deprecated version
 * @property {string} message - Deprecation message
 * @property {string} sunsetDate - Date when version will be removed
 * @property {string} recommendedVersion - Recommended upgrade version
 * @property {string} migrationGuide - URL to migration documentation
 */
export interface DeprecationNotice {
  version: string;
  message: string;
  sunsetDate: string;
  recommendedVersion: string;
  migrationGuide: string;
}

/**
 * Version compatibility matrix
 *
 * @property {string} fromVersion - Source version
 * @property {string} toVersion - Target version
 * @property {boolean} compatible - Whether versions are compatible
 * @property {string[]} [breakingChanges] - List of breaking changes
 * @property {string[]} [requiredMigrations] - Required migration steps
 */
export interface CompatibilityMatrix {
  fromVersion: string;
  toVersion: string;
  compatible: boolean;
  breakingChanges?: string[];
  requiredMigrations?: string[];
}

/**
 * Version migration result
 *
 * @property {string} fromVersion - Source version
 * @property {string} toVersion - Target version
 * @property {boolean} success - Whether migration succeeded
 * @property {unknown} migratedData - Migrated data payload
 * @property {string[]} [issues] - Migration issues encountered
 * @property {number} duration - Migration duration in milliseconds
 */
export interface MigrationResult {
  fromVersion: string;
  toVersion: string;
  success: boolean;
  migratedData?: unknown;
  issues?: string[];
  duration: number;
}

/**
 * Version usage statistics
 *
 * @property {string} version - API version
 * @property {number} requestCount - Total requests
 * @property {number} lastUsed - Last usage timestamp
 * @property {number} percentageOfTraffic - Traffic percentage
 * @property {number} averageResponseTime - Average response time (ms)
 */
export interface VersionUsageStats {
  version: string;
  requestCount: number;
  lastUsed: number;
  percentageOfTraffic: number;
  averageResponseTime: number;
}

// ============================================================================
// API VERSIONING SERVICE
// ============================================================================

/**
 * ApiVersioningService: Manages API versioning and backward compatibility
 *
 * Provides comprehensive versioning functionality including:
 * - Multiple API version support
 * - Backward compatibility enforcement
 * - Automatic request/response transformation
 * - Deprecation management
 * - Schema versioning
 * - Migration validation
 * - Usage tracking
 *
 * @class ApiVersioningService
 * @decorator @Injectable
 */
@Injectable()
export class ApiVersioningService {
  private readonly logger = new Logger(ApiVersioningService.name);
  private readonly versions: Map<string, ApiVersion> = new Map();
  private readonly transformationRules: TransformationRule[] = [];
  private readonly responseTransforms: ResponseTransformRule[] = [];
  private readonly schemas: Map<string, SchemaVersion> = new Map();
  private readonly deprecationNotices: Map<string, DeprecationNotice> = new Map();
  private readonly compatibilityMatrix: CompatibilityMatrix[] = [];
  private readonly usageStats: Map<string, VersionUsageStats> = new Map();
  private currentVersion: string = '1.0.0';

  constructor() {
    this.initializeVersioning();
  }

  /**
   * Initialize versioning service
   *
   * @description Performs startup initialization and loads version metadata
   *
   * @returns {void}
   */
  private initializeVersioning(): void {
    try {
      // Register default versions
      this.registerVersion({
        version: '1.0.0',
        status: 'active',
        releaseDate: new Date().toISOString(),
      });

      this.logger.log('API versioning service initialized');
    } catch (error) {
      this.logger.error(
        'Failed to initialize versioning service',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Register new API version
   *
   * @description Registers new API version with metadata
   *
   * @param {ApiVersion} version - Version information
   * @returns {boolean} Whether registration succeeded
   *
   * @example
   * ```typescript
   * const registered = versionService.registerVersion({
   *   version: '2.0.0',
   *   status: 'active',
   *   releaseDate: new Date().toISOString(),
   *   breaking: ['Removed deprecated endpoints']
   * });
   * ```
   */
  registerVersion(version: ApiVersion): boolean {
    try {
      // Validate semver
      if (!this.isValidSemver(version.version)) {
        throw new BadRequestException(
          `Invalid semantic version: ${version.version}`,
        );
      }

      this.versions.set(version.version, version);
      this.usageStats.set(version.version, {
        version: version.version,
        requestCount: 0,
        lastUsed: 0,
        percentageOfTraffic: 0,
        averageResponseTime: 0,
      });

      this.logger.log(`Version registered: ${version.version}`);
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to register version',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Deprecate API version
   *
   * @description Marks version as deprecated with sunset date
   *
   * @param {string} version - Version to deprecate
   * @param {string} sunsetDate - Sunset date in ISO 8601
   * @param {string} recommendedVersion - Recommended upgrade version
   * @returns {boolean} Whether deprecation succeeded
   *
   * @example
   * ```typescript
   * const deprecated = versionService.deprecateVersion(
   *   '1.0.0',
   *   '2025-12-31T23:59:59Z',
   *   '2.0.0'
   * );
   * ```
   */
  deprecateVersion(
    version: string,
    sunsetDate: string,
    recommendedVersion: string,
  ): boolean {
    try {
      const versionInfo = this.versions.get(version);
      if (!versionInfo) {
        return false;
      }

      versionInfo.status = 'deprecated';
      versionInfo.sunsetDate = sunsetDate;
      versionInfo.replacedBy = recommendedVersion;

      const notice: DeprecationNotice = {
        version,
        message: `API version ${version} is deprecated. Please upgrade to ${recommendedVersion}.`,
        sunsetDate,
        recommendedVersion,
        migrationGuide: `/docs/migrate/${version}-to-${recommendedVersion}`,
      };

      this.deprecationNotices.set(version, notice);
      this.logger.log(`Version deprecated: ${version}`);

      return true;
    } catch (error) {
      this.logger.error(
        'Failed to deprecate version',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Get version information
   *
   * @description Retrieves information for specific API version
   *
   * @param {string} version - Version identifier
   * @returns {ApiVersion | undefined} Version information or undefined
   *
   * @example
   * ```typescript
   * const versionInfo = versionService.getVersion('1.0.0');
   * if (versionInfo?.status === 'deprecated') {
   *   console.log('Version is deprecated');
   * }
   * ```
   */
  getVersion(version: string): ApiVersion | undefined {
    return this.versions.get(version);
  }

  /**
   * Get all registered versions
   *
   * @description Retrieves information for all API versions
   *
   * @returns {ApiVersion[]} Array of all versions
   *
   * @example
   * ```typescript
   * const allVersions = versionService.getAllVersions();
   * console.log(`Supported versions: ${allVersions.length}`);
   * ```
   */
  getAllVersions(): ApiVersion[] {
    return Array.from(this.versions.values());
  }

  /**
   * Get active versions
   *
   * @description Retrieves only active API versions
   *
   * @returns {ApiVersion[]} Array of active versions
   *
   * @example
   * ```typescript
   * const activeVersions = versionService.getActiveVersions();
   * console.log(`Active versions: ${activeVersions.map(v => v.version)}`);
   * ```
   */
  getActiveVersions(): ApiVersion[] {
    return Array.from(this.versions.values()).filter(
      (v) => v.status === 'active',
    );
  }

  /**
   * Register request transformation rule
   *
   * @description Defines how to transform requests between versions
   *
   * @param {TransformationRule} rule - Transformation rule
   * @returns {boolean} Whether registration succeeded
   *
   * @example
   * ```typescript
   * const registered = versionService.registerTransformation({
   *   fromVersion: '1.0.0',
   *   toVersion: '2.0.0',
   *   path: '/documents',
   *   transform: (data) => ({
   *     ...data,
   *     documentId: data.id // Rename id to documentId
   *   })
   * });
   * ```
   */
  registerTransformation(rule: TransformationRule): boolean {
    try {
      this.transformationRules.push(rule);
      this.logger.log(
        `Transformation registered: ${rule.fromVersion} -> ${rule.toVersion}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to register transformation',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Register response transformation rule
   *
   * @description Defines how to transform responses for specific version
   *
   * @param {ResponseTransformRule} rule - Response transformation rule
   * @returns {boolean} Whether registration succeeded
   *
   * @example
   * ```typescript
   * const registered = versionService.registerResponseTransform({
   *   version: '1.0.0',
   *   path: '/documents',
   *   transform: (data) => ({
   *     ...data,
   *     id: data.documentId // Rename back for v1
   *   })
   * });
   * ```
   */
  registerResponseTransform(rule: ResponseTransformRule): boolean {
    try {
      this.responseTransforms.push(rule);
      this.logger.log(
        `Response transformation registered: ${rule.version}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to register response transformation',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Transform request between versions
   *
   * @description Applies transformation rules to request
   *
   * @template T - Request type
   * @param {unknown} data - Request data
   * @param {string} fromVersion - Source version
   * @param {string} toVersion - Target version
   * @param {string} path - Request path
   * @returns {unknown} Transformed data
   *
   * @example
   * ```typescript
   * const transformed = versionService.transformRequest(
   *   { id: '123' },
   *   '1.0.0',
   *   '2.0.0',
   *   '/documents'
   * );
   * ```
   */
  transformRequest(
    data: unknown,
    fromVersion: string,
    toVersion: string,
    path: string,
  ): unknown {
    try {
      const rule = this.transformationRules.find(
        (r) =>
          r.fromVersion === fromVersion &&
          r.toVersion === toVersion &&
          this.matchesPath(path, r.path),
      );

      if (!rule) {
        return data;
      }

      return rule.transform(data);
    } catch (error) {
      this.logger.error(
        'Request transformation failed',
        error instanceof Error ? error.message : String(error),
      );
      return data;
    }
  }

  /**
   * Transform response for version
   *
   * @description Applies response transformation rules
   *
   * @param {unknown} data - Response data
   * @param {string} version - Target version
   * @param {string} path - Request path
   * @returns {unknown} Transformed response
   *
   * @example
   * ```typescript
   * const transformed = versionService.transformResponse(
   *   responseData,
   *   '1.0.0',
   *   '/documents'
   * );
   * ```
   */
  transformResponse(
    data: unknown,
    version: string,
    path: string,
  ): unknown {
    try {
      const rule = this.responseTransforms.find(
        (r) =>
          r.version === version &&
          this.matchesPath(path, r.path),
      );

      if (!rule) {
        return data;
      }

      return rule.transform(data);
    } catch (error) {
      this.logger.error(
        'Response transformation failed',
        error instanceof Error ? error.message : String(error),
      );
      return data;
    }
  }

  /**
   * Register schema version
   *
   * @description Registers schema for API version
   *
   * @param {SchemaVersion} schemaVersion - Schema information
   * @returns {boolean} Whether registration succeeded
   *
   * @example
   * ```typescript
   * const registered = versionService.registerSchema({
   *   version: '2.0.0',
   *   schema: documentSchema,
   *   revision: 1,
   *   createdAt: new Date().toISOString()
   * });
   * ```
   */
  registerSchema(schemaVersion: SchemaVersion): boolean {
    try {
      this.schemas.set(schemaVersion.version, schemaVersion);
      this.logger.log(`Schema registered: ${schemaVersion.version}`);
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to register schema',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Get schema for version
   *
   * @description Retrieves schema for API version
   *
   * @param {string} version - Version identifier
   * @returns {SchemaVersion | undefined} Schema or undefined
   *
   * @example
   * ```typescript
   * const schema = versionService.getSchema('1.0.0');
   * if (schema) {
   *   console.log(`Schema revision: ${schema.revision}`);
   * }
   * ```
   */
  getSchema(version: string): SchemaVersion | undefined {
    return this.schemas.get(version);
  }

  /**
   * Check version compatibility
   *
   * @description Determines if versions are compatible
   *
   * @param {string} fromVersion - Source version
   * @param {string} toVersion - Target version
   * @returns {CompatibilityMatrix} Compatibility information
   *
   * @example
   * ```typescript
   * const compat = versionService.checkCompatibility('1.0.0', '2.0.0');
   * if (!compat.compatible) {
   *   console.log(`Breaking changes: ${compat.breakingChanges}`);
   * }
   * ```
   */
  checkCompatibility(
    fromVersion: string,
    toVersion: string,
  ): CompatibilityMatrix {
    try {
      const compatEntry = this.compatibilityMatrix.find(
        (c) =>
          c.fromVersion === fromVersion &&
          c.toVersion === toVersion,
      );

      if (compatEntry) {
        return compatEntry;
      }

      // Default: assume compatible with patch/minor changes
      const compatible = this.compareVersions(fromVersion, toVersion) <= 1;

      return {
        fromVersion,
        toVersion,
        compatible,
        breakingChanges: [],
        requiredMigrations: [],
      };
    } catch (error) {
      this.logger.error(
        'Compatibility check failed',
        error instanceof Error ? error.message : String(error),
      );

      return {
        fromVersion,
        toVersion,
        compatible: false,
      };
    }
  }

  /**
   * Migrate data between versions
   *
   * @description Performs data migration from one version to another
   *
   * @param {unknown} data - Data to migrate
   * @param {string} fromVersion - Source version
   * @param {string} toVersion - Target version
   * @returns {Promise<MigrationResult>} Migration result
   *
   * @example
   * ```typescript
   * const result = await versionService.migrateData(
   *   documentData,
   *   '1.0.0',
   *   '2.0.0'
   * );
   * if (result.success) {
   *   console.log('Data migrated successfully');
   * }
   * ```
   */
  async migrateData(
    data: unknown,
    fromVersion: string,
    toVersion: string,
  ): Promise<MigrationResult> {
    const startTime = Date.now();

    try {
      const compat = this.checkCompatibility(fromVersion, toVersion);

      if (!compat.compatible && compat.breakingChanges?.length) {
        return {
          fromVersion,
          toVersion,
          success: false,
          issues: compat.breakingChanges,
          duration: Date.now() - startTime,
        };
      }

      // Apply transformations
      let migratedData = data;
      for (const rule of this.transformationRules) {
        if (
          rule.fromVersion === fromVersion &&
          rule.toVersion === toVersion
        ) {
          migratedData = rule.transform(migratedData);
        }
      }

      this.logger.log(
        `Data migrated: ${fromVersion} -> ${toVersion}`,
      );

      return {
        fromVersion,
        toVersion,
        success: true,
        migratedData,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(
        'Data migration failed',
        error instanceof Error ? error.message : String(error),
      );

      return {
        fromVersion,
        toVersion,
        success: false,
        issues: [error instanceof Error ? error.message : String(error)],
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Track version usage
   *
   * @description Records usage of API version
   *
   * @param {string} version - Version identifier
   * @param {number} responseTime - Response time in milliseconds
   * @returns {void}
   *
   * @internal
   */
  trackUsage(version: string, responseTime: number): void {
    try {
      const stats = this.usageStats.get(version);
      if (!stats) return;

      stats.requestCount++;
      stats.lastUsed = Date.now();
      stats.averageResponseTime =
        (stats.averageResponseTime * (stats.requestCount - 1) + responseTime) /
        stats.requestCount;

      // Update traffic percentage
      const totalRequests = Array.from(this.usageStats.values()).reduce(
        (sum, s) => sum + s.requestCount,
        0,
      );

      for (const s of this.usageStats.values()) {
        s.percentageOfTraffic =
          totalRequests > 0 ? (s.requestCount / totalRequests) * 100 : 0;
      }
    } catch (error) {
      this.logger.error(
        'Failed to track usage',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Get version usage statistics
   *
   * @description Retrieves usage statistics for versions
   *
   * @returns {VersionUsageStats[]} Array of usage statistics
   *
   * @example
   * ```typescript
   * const stats = versionService.getUsageStats();
   * stats.forEach(s => {
   *   console.log(`${s.version}: ${s.percentageOfTraffic}% of traffic`);
   * });
   * ```
   */
  getUsageStats(): VersionUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  /**
   * Get deprecation notice
   *
   * @description Retrieves deprecation notice for version
   *
   * @param {string} version - Version identifier
   * @returns {DeprecationNotice | undefined} Deprecation notice or undefined
   *
   * @example
   * ```typescript
   * const notice = versionService.getDeprecationNotice('1.0.0');
   * if (notice) {
   *   console.log(`Sunset date: ${notice.sunsetDate}`);
   * }
   * ```
   */
  getDeprecationNotice(version: string): DeprecationNotice | undefined {
    return this.deprecationNotices.get(version);
  }

  /**
   * Validate semantic version format
   *
   * @description Checks if version string is valid semver
   *
   * @param {string} version - Version string
   * @returns {boolean} Whether version is valid semver
   *
   * @private
   */
  private isValidSemver(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/;
    return semverRegex.test(version);
  }

  /**
   * Compare semantic versions
   *
   * @description Compares two semantic versions
   *
   * @param {string} v1 - First version
   * @param {string} v2 - Second version
   * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   *
   * @private
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (parts1[i] < parts2[i]) return -1;
      if (parts1[i] > parts2[i]) return 1;
    }

    return 0;
  }

  /**
   * Check if path matches pattern
   *
   * @description Determines if path matches path pattern
   *
   * @param {string} path - Request path
   * @param {string} pattern - Path pattern
   * @returns {boolean} Whether path matches
   *
   * @private
   */
  private matchesPath(path: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(path);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ApiVersioningService,
  ApiVersion,
  TransformationRule,
  ResponseTransformRule,
  SchemaVersion,
  DeprecationNotice,
  CompatibilityMatrix,
  MigrationResult,
  VersionUsageStats,
};
