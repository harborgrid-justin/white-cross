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
import { CanActivate, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { Model } from 'sequelize-typescript';
/**
 * API versioning strategy types
 */
export declare enum VersionStrategy {
    URI = "uri",// /v1/resource, /v2/resource
    HEADER = "header",// X-API-Version: 1
    ACCEPT_HEADER = "accept_header",// Accept: application/vnd.api+json;version=1
    QUERY_PARAM = "query_param",// /resource?version=1
    CUSTOM = "custom"
}
/**
 * API version lifecycle status
 */
export declare enum VersionStatus {
    DEVELOPMENT = "development",// In development, not public
    BETA = "beta",// Public beta testing
    ACTIVE = "active",// Current stable version
    DEPRECATED = "deprecated",// Deprecated but still functional
    SUNSET = "sunset",// Sunset announced, limited support
    RETIRED = "retired"
}
/**
 * Deprecation warning levels
 */
export declare enum DeprecationLevel {
    INFO = "info",// Informational notice
    WARNING = "warning",// Approaching deprecation
    CRITICAL = "critical",// Imminent sunset
    RETIRED = "retired"
}
/**
 * Breaking change types
 */
export declare enum BreakingChangeType {
    FIELD_REMOVED = "field_removed",
    FIELD_RENAMED = "field_renamed",
    TYPE_CHANGED = "type_changed",
    ENDPOINT_REMOVED = "endpoint_removed",
    ENDPOINT_MOVED = "endpoint_moved",
    AUTH_CHANGED = "auth_changed",
    BEHAVIOR_CHANGED = "behavior_changed",
    VALIDATION_CHANGED = "validation_changed"
}
/**
 * Version comparison result
 */
export declare enum VersionComparison {
    GREATER = 1,
    EQUAL = 0,
    LESS = -1,
    INCOMPATIBLE = -2
}
/**
 * API version metadata
 */
export interface APIVersion {
    version: string;
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
    notificationSchedule: Date[];
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
    codeExamples?: Record<string, {
        before: string;
        after: string;
    }>;
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
    strict: boolean;
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
    topEndpoints: Array<{
        path: string;
        count: number;
    }>;
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
    link?: string;
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
/**
 * API version validation schema
 */
export declare const APIVersionSchema: any;
/**
 * Deprecation policy validation schema
 */
export declare const DeprecationPolicySchema: any;
/**
 * Breaking change validation schema
 */
export declare const BreakingChangeSchema: any;
/**
 * Migration guide validation schema
 */
export declare const MigrationGuideSchema: any;
/**
 * Backward compatibility config validation schema
 */
export declare const BackwardCompatibilityConfigSchema: any;
/**
 * API Version Model - Tracks all API versions and their lifecycle
 */
export declare class APIVersionModel extends Model {
    version: string;
    status: VersionStatus;
    releaseDate: Date;
    deprecationDate: Date;
    sunsetDate: Date;
    retirementDate: Date;
    description: string;
    changelog: string[];
    breakingChanges: BreakingChange[];
    migrationGuide: string;
    documentation: string;
    supportEmail: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * API Endpoint Version Model - Tracks endpoint-specific versioning
 */
export declare class APIEndpointVersionModel extends Model {
    endpoint: string;
    version: string;
    method: string;
    requestSchema: any;
    responseSchema: any;
    isDeprecated: boolean;
    deprecatedSince: Date;
    replacementEndpoint: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deprecation Schedule Model - Manages deprecation timeline and notifications
 */
export declare class DeprecationScheduleModel extends Model {
    version: string;
    deprecationDate: Date;
    sunsetDate: Date;
    retirementDate: Date;
    reason: string;
    replacementVersion: string;
    migrationPath: string;
    notificationSchedule: Date[];
    warningLevel: DeprecationLevel;
    autoRetire: boolean;
    notificationsSent: Array<{
        date: Date;
        recipients: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Version Migration Model - Stores migration guides and change documentation
 */
export declare class VersionMigrationModel extends Model {
    fromVersion: string;
    toVersion: string;
    breakingChanges: BreakingChange[];
    steps: string[];
    codeExamples: Record<string, {
        before: string;
        after: string;
    }>;
    estimatedEffort: string;
    automationAvailable: boolean;
    testingChecklist: string[];
    successfulMigrations: number;
    failedMigrations: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Version Analytics Model - Tracks version usage and adoption metrics
 */
export declare class VersionAnalyticsModel extends Model {
    version: string;
    periodStart: Date;
    periodEnd: Date;
    totalRequests: number;
    uniqueClients: number;
    errorRate: number;
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    topEndpoints: Array<{
        path: string;
        count: number;
    }>;
    clientDistribution: Record<string, number>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function parseVersionFromUri(uri: string): string | null;
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
export declare function validateVersionUri(uri: string, allowedVersions: string[]): {
    valid: boolean;
    version?: string;
    error?: string;
};
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
export declare function extractVersionPrefix(path: string): string;
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
export declare function createVersionedPath(path: string, version: string, prefix?: string): string;
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
export declare function normalizeVersionUri(uri: string): string;
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
export declare function isValidVersionFormat(version: string): boolean;
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
export declare function parseVersionFromHeader(headers: Record<string, string | string[]>, headerName?: string): string | null;
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
export declare function createVersionHeader(version: string, headerName?: string): Record<string, string>;
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
export declare function negotiateVersion(headers: Record<string, string | string[]>, availableVersions: string[], defaultVersion: string): VersionNegotiation;
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
export declare function validateVersionHeader(headers: Record<string, string | string[]>, headerName?: string): {
    valid: boolean;
    version?: string;
    error?: string;
};
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
export declare function extractCustomHeader(headers: Record<string, string | string[]>, customHeaderName: string): string | null;
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
export declare function createAcceptVersionHeader(mediaType: string, version: string, vendor?: string): string;
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
export declare function parseVersionFromAcceptHeader(acceptHeader: string): string | null;
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
export declare function selectVersionByContent(acceptHeader: string, availableVersions: string[], defaultVersion: string): string;
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
export declare function createContentTypeVersion(mediaType: string, version: string, vendor?: string): string;
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
export declare function matchMediaType(acceptHeader: string, mediaType: string, version: string): boolean;
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
export declare function prioritizeVersions(acceptHeader: string, availableVersions: string[]): string[];
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
export declare function createDeprecationWarning(version: string, sunsetDate: Date, replacementVersion?: string): string;
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
export declare function checkDeprecationStatus(version: string, versionMetadata: APIVersion): {
    deprecated: boolean;
    level: DeprecationLevel;
    daysRemaining?: number;
    sunsetDate?: Date;
};
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
export declare function calculateSunsetDate(deprecationDate: Date, gracePeriodDays: number): Date;
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
export declare function generateSunsetHeader(sunsetDate: Date, migrationGuideUrl?: string): string;
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
export declare function scheduleDeprecation(policy: DeprecationPolicy): Date[];
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
export declare function notifyDeprecation(version: string, policy: DeprecationPolicy, daysRemaining: number): string;
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
export declare function isVersionDeprecated(version: string, versionMetadata: APIVersion): boolean;
/**
 * Get remaining lifetime of version
 *
 * @param versionMetadata - Version metadata
 * @returns Days remaining or -1 if no sunset date
 *
 * @example
 * getRemainingLifetime(versionData) // 45
 */
export declare function getRemainingLifetime(versionMetadata: APIVersion): number;
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
export declare function generateMigrationGuide(fromVersion: string, toVersion: string, breakingChanges: BreakingChange[]): MigrationGuide;
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
export declare function detectBreakingChanges(oldSchema: any, newSchema: any): BreakingChange[];
/**
 * Create backward compatibility layer
 *
 * @param config - Compatibility configuration
 * @returns Transform functions
 *
 * @example
 * createCompatibilityLayer(config)
 */
export declare function createCompatibilityLayer(config: BackwardCompatibilityConfig): {
    transformRequest: (data: any) => any;
    transformResponse: (data: any) => any;
};
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
export declare function transformRequestToVersion(request: any, fromVersion: string, toVersion: string, config: BackwardCompatibilityConfig): any;
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
export declare function transformResponseFromVersion(response: any, fromVersion: string, toVersion: string, config: BackwardCompatibilityConfig): any;
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
export declare function validateBackwardCompatibility(oldVersion: any, newVersion: any, config: BackwardCompatibilityConfig): {
    compatible: boolean;
    errors: string[];
};
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
export declare function generateChangeLog(fromVersion: string, toVersion: string, changes: BreakingChange[]): string;
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
export declare function trackVersionUsage(version: string, clientId: string, endpoint: string, responseTime: number, statusCode: number): void;
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
export declare function getVersionMetrics(version: string, startDate: Date, endDate: Date): Promise<VersionAnalytics>;
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
export declare function analyzeVersionAdoption(versions: string[], startDate: Date, endDate: Date): Promise<Record<string, {
    percentage: number;
    requests: number;
    trend: string;
}>>;
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
export declare function calculateMigrationRate(fromVersion: string, toVersion: string, startDate: Date, endDate: Date): Promise<number>;
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
export declare function getVersionDistribution(startDate: Date, endDate: Date): Promise<Array<{
    version: string;
    requests: number;
    percentage: number;
}>>;
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
export declare function generateVersionReport(startDate: Date, endDate: Date): Promise<string>;
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
export declare function routeToVersion(version: string, routes: VersionRouteConfig[]): VersionRouteConfig | null;
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
export declare function createVersionMiddleware(defaultVersion: string, strategy?: VersionStrategy): (req: Request, res: Response, next: () => void) => void;
/**
 * Register versioned route
 *
 * @param config - Route configuration
 * @returns Route config
 *
 * @example
 * registerVersionedRoute({ version: 'v1', path: '/users', handler, method: 'GET' })
 */
export declare function registerVersionedRoute(config: VersionRouteConfig): VersionRouteConfig;
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
export declare function getVersionHandler(version: string, path: string, method: string, routes: VersionRouteConfig[]): any | null;
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
export declare function resolveVersionConflict(requestedVersion: string, availableVersions: string[], strategy?: 'latest' | 'closest' | 'fail'): string | null;
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
export declare function createVersionRouter(version: string, routes: VersionRouteConfig[]): {
    version: string;
    routes: VersionRouteConfig[];
};
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
export declare function validateVersionAccess(version: string, clientId: string, versionMetadata: APIVersion): {
    allowed: boolean;
    reason?: string;
};
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
export declare function applyVersionPolicy(version: string, policy: {
    minVersion?: string;
    maxVersion?: string;
    allowBeta?: boolean;
}, request: any): {
    allowed: boolean;
    reason?: string;
};
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
export declare function compareVersions(version1: string, version2: string): VersionComparison;
/**
 * Metadata key for API version
 */
export declare const API_VERSION_KEY = "api_version";
/**
 * Metadata key for deprecated endpoints
 */
export declare const DEPRECATED_KEY = "deprecated";
/**
 * Metadata key for sunset date
 */
export declare const SUNSET_DATE_KEY = "sunset_date";
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
export declare const ApiVersion: (version: string) => any;
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
export declare const DeprecatedEndpoint: (sunsetDate: Date, replacementEndpoint?: string, message?: string) => any;
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
export declare const SunsetDate: (date: Date) => any;
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
export declare const RequiresVersion: (minVersion?: string, maxVersion?: string) => any;
/**
 * @CurrentVersion parameter decorator - Inject current API version
 *
 * @example
 * getUsers(@CurrentVersion() version: string) {}
 */
export declare const CurrentVersion: any;
/**
 * Version Guard - Validate API version access
 */
export declare class VersionGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * Deprecation Interceptor - Add deprecation warnings to responses
 */
export declare class DeprecationInterceptor implements NestInterceptor {
    private reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * Version Management Service
 */
export declare class VersionService {
    /**
     * Get all active API versions
     */
    getActiveVersions(): Promise<APIVersion[]>;
    /**
     * Create new API version
     */
    createVersion(versionData: APIVersion): Promise<APIVersion>;
    /**
     * Deprecate version
     */
    deprecateVersion(version: string, policy: DeprecationPolicy): Promise<void>;
    /**
     * Get migration guide
     */
    getMigrationGuide(fromVersion: string, toVersion: string): Promise<MigrationGuide | null>;
    /**
     * Get version analytics
     */
    getAnalytics(version: string, startDate: Date, endDate: Date): Promise<VersionAnalytics>;
}
/**
 * Version Management Controller
 */
export declare class VersionController {
    private readonly versionService;
    constructor(versionService: VersionService);
    /**
     * Get all API versions
     */
    getVersions(): Promise<APIVersion[]>;
    /**
     * Create new API version
     */
    createVersion(versionData: APIVersion): Promise<APIVersion>;
    /**
     * Deprecate API version
     */
    deprecateVersion(version: string, policy: DeprecationPolicy): Promise<{
        message: string;
    }>;
    /**
     * Get migration guide
     */
    getMigrationGuide(fromVersion: string, toVersion: string): Promise<MigrationGuide>;
    /**
     * Get version analytics
     */
    getAnalytics(version: string, startDate?: Date, endDate?: Date): Promise<VersionAnalytics>;
    /**
     * Get version distribution
     */
    getDistribution(startDate?: Date, endDate?: Date): Promise<Array<{
        version: string;
        requests: number;
        percentage: number;
    }>>;
}
export { APIVersionModel, APIEndpointVersionModel, DeprecationScheduleModel, VersionMigrationModel, VersionAnalyticsModel, VersionService, VersionController, VersionGuard, DeprecationInterceptor, };
//# sourceMappingURL=api-versioning-kit.prod.d.ts.map