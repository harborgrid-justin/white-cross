/**
 * LOC: SVER1234567
 * File: /reuse/san/swagger-oracle-versioning-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API gateway implementations
 *   - Version routing middleware
 *   - API documentation generators
 *   - Client SDK generators
 */
/**
 * File: /reuse/san/swagger-oracle-versioning-advanced-kit.ts
 * Locator: WC-UTL-SVER-001
 * Purpose: Advanced API Versioning Management - Multi-version support, deprecation strategies, migration utilities
 *
 * Upstream: Independent utility module for API versioning and lifecycle management
 * Downstream: ../backend/*, API controllers, middleware, gateway services, documentation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI 3.x, Oracle API Platform
 * Exports: 42 utility functions for API version management, deprecation, migration, routing, documentation
 *
 * LLM Context: Comprehensive API versioning utilities for managing multi-version APIs in enterprise Oracle environments.
 * Provides version lifecycle management, deprecation strategies, client negotiation, backward compatibility checking,
 * version-specific routing, sunset scheduling, and migration utilities. Essential for maintaining long-lived APIs
 * with multiple concurrent versions in healthcare and HIPAA-compliant systems.
 */
interface ApiVersion {
    version: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    status: 'alpha' | 'beta' | 'stable' | 'deprecated' | 'sunset';
    releaseDate: Date;
    deprecationDate?: Date;
    sunsetDate?: Date;
    supportEndDate?: Date;
}
interface VersionMetadata {
    version: string;
    endpoint: string;
    status: 'active' | 'deprecated' | 'sunset';
    deprecationNotice?: string;
    migrationGuide?: string;
    breakingChanges?: string[];
    changelog?: ChangelogEntry[];
}
interface ChangelogEntry {
    version: string;
    date: Date;
    type: 'feature' | 'fix' | 'breaking' | 'deprecation' | 'security';
    description: string;
    issueId?: string;
}
interface VersionNegotiation {
    requestedVersion?: string;
    acceptHeader?: string;
    resolvedVersion: string;
    strategy: 'path' | 'header' | 'query' | 'default';
}
interface DeprecationPolicy {
    warningPeriodDays: number;
    deprecationPeriodDays: number;
    sunsetPeriodDays: number;
    notificationChannels: string[];
    gracePeriodDays: number;
}
interface MigrationPath {
    fromVersion: string;
    toVersion: string;
    breakingChanges: BreakingChange[];
    migrationSteps: MigrationStep[];
    estimatedEffort: 'low' | 'medium' | 'high';
    automatable: boolean;
}
interface BreakingChange {
    type: 'removed' | 'renamed' | 'typeChanged' | 'behaviorChanged';
    resource: string;
    field?: string;
    oldValue?: any;
    newValue?: any;
    description: string;
    workaround?: string;
}
interface MigrationStep {
    order: number;
    description: string;
    automated: boolean;
    script?: string;
    validation?: string;
}
interface VersionRoute {
    version: string;
    path: string;
    handler: string;
    method: string;
    deprecated: boolean;
    alternativeVersion?: string;
}
interface BackwardCompatibility {
    compatible: boolean;
    issues: CompatibilityIssue[];
    recommendations: string[];
}
interface CompatibilityIssue {
    severity: 'error' | 'warning' | 'info';
    type: string;
    message: string;
    affectedEndpoints: string[];
    suggestedFix?: string;
}
interface VersionDocumentation {
    version: string;
    title: string;
    description: string;
    baseUrl: string;
    contact?: ContactInfo;
    license?: LicenseInfo;
    servers: ServerInfo[];
    paths: Record<string, any>;
    components: Record<string, any>;
}
interface ContactInfo {
    name: string;
    email: string;
    url?: string;
}
interface LicenseInfo {
    name: string;
    url: string;
}
interface ServerInfo {
    url: string;
    description: string;
    variables?: Record<string, any>;
}
interface ClientVersionRequirements {
    minimumVersion: string;
    recommendedVersion: string;
    maximumVersion?: string;
    supportedVersions: string[];
}
/**
 * Parses a semantic version string into components.
 *
 * @param {string} versionString - Version string (e.g., "v2.1.3", "2.1.3")
 * @returns {ApiVersion} Parsed version object
 *
 * @example
 * ```typescript
 * const version = parseVersionString('v2.1.3');
 * // Result: { version: 'v2.1.3', majorVersion: 2, minorVersion: 1, patchVersion: 3, ... }
 * ```
 */
export declare const parseVersionString: (versionString: string) => Partial<ApiVersion>;
/**
 * Compares two version strings using semantic versioning rules.
 *
 * @param {string} version1 - First version string
 * @param {string} version2 - Second version string
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 *
 * @example
 * ```typescript
 * compareVersions('v2.1.0', 'v2.0.5'); // 1
 * compareVersions('v1.5.0', 'v2.0.0'); // -1
 * compareVersions('v3.0.0', 'v3.0.0'); // 0
 * ```
 */
export declare const compareVersions: (version1: string, version2: string) => number;
/**
 * Determines if version satisfies a version range requirement.
 *
 * @param {string} version - Version to check
 * @param {string} range - Version range (e.g., ">=2.0.0", "^2.1.0", "~2.1.0")
 * @returns {boolean} True if version satisfies range
 *
 * @example
 * ```typescript
 * satisfiesVersionRange('v2.1.5', '>=2.0.0'); // true
 * satisfiesVersionRange('v1.9.0', '>=2.0.0'); // false
 * satisfiesVersionRange('v2.1.5', '^2.1.0'); // true
 * ```
 */
export declare const satisfiesVersionRange: (version: string, range: string) => boolean;
/**
 * Gets the latest version from an array of version strings.
 *
 * @param {string[]} versions - Array of version strings
 * @returns {string} Latest version
 *
 * @example
 * ```typescript
 * const latest = getLatestVersion(['v1.0.0', 'v2.1.0', 'v2.0.5', 'v1.9.0']);
 * // Result: 'v2.1.0'
 * ```
 */
export declare const getLatestVersion: (versions: string[]) => string;
/**
 * Increments a version string by major, minor, or patch level.
 *
 * @param {string} version - Current version string
 * @param {('major' | 'minor' | 'patch')} level - Increment level
 * @returns {string} New version string
 *
 * @example
 * ```typescript
 * incrementVersion('v2.1.3', 'major'); // 'v3.0.0'
 * incrementVersion('v2.1.3', 'minor'); // 'v2.2.0'
 * incrementVersion('v2.1.3', 'patch'); // 'v2.1.4'
 * ```
 */
export declare const incrementVersion: (version: string, level: "major" | "minor" | "patch") => string;
/**
 * Negotiates API version from request using multiple strategies.
 *
 * @param {string} [pathVersion] - Version from URL path
 * @param {string} [headerVersion] - Version from Accept header
 * @param {string} [queryVersion] - Version from query parameter
 * @param {string} defaultVersion - Default version to use
 * @returns {VersionNegotiation} Negotiation result
 *
 * @example
 * ```typescript
 * const negotiation = negotiateVersion('v2', undefined, undefined, 'v3');
 * // Result: { resolvedVersion: 'v2', strategy: 'path' }
 * ```
 */
export declare const negotiateVersion: (pathVersion?: string, headerVersion?: string, queryVersion?: string, defaultVersion?: string) => VersionNegotiation;
/**
 * Extracts version from various request sources.
 *
 * @param {string} url - Request URL
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {string | null} Extracted version or null
 *
 * @example
 * ```typescript
 * extractVersionFromRequest('/api/v2/users', { 'accept': 'application/json' });
 * // Result: 'v2'
 *
 * extractVersionFromRequest('/api/users', { 'accept': 'application/vnd.api.v3+json' });
 * // Result: 'v3'
 * ```
 */
export declare const extractVersionFromRequest: (url: string, headers?: Record<string, string>) => string | null;
/**
 * Builds versioned route path.
 *
 * @param {string} basePath - Base path without version
 * @param {string} version - API version
 * @param {('prefix' | 'subdomain' | 'header')} strategy - Versioning strategy
 * @returns {string} Versioned route path
 *
 * @example
 * ```typescript
 * buildVersionedRoute('/api/users', 'v2', 'prefix');
 * // Result: '/api/v2/users'
 *
 * buildVersionedRoute('/api/users', 'v2', 'subdomain');
 * // Result: 'v2.api.example.com/api/users'
 * ```
 */
export declare const buildVersionedRoute: (basePath: string, version: string, strategy?: "prefix" | "subdomain" | "header") => string;
/**
 * Creates version routing map for API gateway.
 *
 * @param {VersionRoute[]} routes - Array of version routes
 * @returns {Record<string, VersionRoute[]>} Version-grouped routes
 *
 * @example
 * ```typescript
 * const routeMap = createVersionRoutingMap([
 *   { version: 'v1', path: '/users', handler: 'getUsersV1', method: 'GET', deprecated: false },
 *   { version: 'v2', path: '/users', handler: 'getUsersV2', method: 'GET', deprecated: false }
 * ]);
 * // Result: { 'v1': [...], 'v2': [...] }
 * ```
 */
export declare const createVersionRoutingMap: (routes: VersionRoute[]) => Record<string, VersionRoute[]>;
/**
 * Resolves the appropriate handler for a versioned request.
 *
 * @param {string} version - Requested version
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Record<string, VersionRoute[]>} routeMap - Version routing map
 * @returns {VersionRoute | null} Matched route or null
 *
 * @example
 * ```typescript
 * const route = resolveVersionedHandler('v2', '/users', 'GET', routeMap);
 * // Result: { version: 'v2', path: '/users', handler: 'getUsersV2', ... }
 * ```
 */
export declare const resolveVersionedHandler: (version: string, path: string, method: string, routeMap: Record<string, VersionRoute[]>) => VersionRoute | null;
/**
 * Creates a deprecation policy with standard timelines.
 *
 * @param {Partial<DeprecationPolicy>} [overrides] - Policy overrides
 * @returns {DeprecationPolicy} Complete deprecation policy
 *
 * @example
 * ```typescript
 * const policy = createDeprecationPolicy({ warningPeriodDays: 60 });
 * // Result: { warningPeriodDays: 60, deprecationPeriodDays: 180, ... }
 * ```
 */
export declare const createDeprecationPolicy: (overrides?: Partial<DeprecationPolicy>) => DeprecationPolicy;
/**
 * Calculates deprecation timeline dates for a version.
 *
 * @param {Date} releaseDate - Version release date
 * @param {DeprecationPolicy} policy - Deprecation policy
 * @returns {Pick<ApiVersion, 'deprecationDate' | 'sunsetDate' | 'supportEndDate'>} Timeline dates
 *
 * @example
 * ```typescript
 * const timeline = calculateDeprecationTimeline(new Date('2024-01-01'), policy);
 * // Result: { deprecationDate: Date, sunsetDate: Date, supportEndDate: Date }
 * ```
 */
export declare const calculateDeprecationTimeline: (releaseDate: Date, policy: DeprecationPolicy) => Pick<ApiVersion, "deprecationDate" | "sunsetDate" | "supportEndDate">;
/**
 * Determines current status of a version based on timeline.
 *
 * @param {ApiVersion} version - API version with timeline
 * @param {Date} [currentDate] - Current date (defaults to now)
 * @returns {ApiVersion['status']} Current version status
 *
 * @example
 * ```typescript
 * const status = getVersionStatus(versionObject);
 * // Result: 'stable' | 'deprecated' | 'sunset'
 * ```
 */
export declare const getVersionStatus: (version: ApiVersion, currentDate?: Date) => ApiVersion["status"];
/**
 * Generates deprecation warning header value.
 *
 * @param {ApiVersion} version - Deprecated API version
 * @param {string} [alternativeVersion] - Alternative version to use
 * @returns {string} Deprecation header value
 *
 * @example
 * ```typescript
 * const header = generateDeprecationHeader(versionV1, 'v2');
 * // Result: 'version=v1; sunset="2024-12-31"; alternative="v2"'
 * ```
 */
export declare const generateDeprecationHeader: (version: ApiVersion, alternativeVersion?: string) => string;
/**
 * Creates deprecation notice for API documentation.
 *
 * @param {ApiVersion} version - Deprecated version
 * @param {string} migrationGuideUrl - URL to migration guide
 * @returns {string} Formatted deprecation notice
 *
 * @example
 * ```typescript
 * const notice = createDeprecationNotice(versionV1, 'https://docs.api.com/migrate-v2');
 * // Result: "⚠️ This API version is deprecated..."
 * ```
 */
export declare const createDeprecationNotice: (version: ApiVersion, migrationGuideUrl: string) => string;
/**
 * Checks if a version is within its sunset grace period.
 *
 * @param {ApiVersion} version - API version
 * @param {Date} [currentDate] - Current date (defaults to now)
 * @returns {boolean} True if in grace period
 *
 * @example
 * ```typescript
 * const inGracePeriod = isInSunsetGracePeriod(versionObject);
 * // Result: true | false
 * ```
 */
export declare const isInSunsetGracePeriod: (version: ApiVersion, currentDate?: Date) => boolean;
/**
 * Analyzes backward compatibility between two API versions.
 *
 * @param {any} oldSchema - Old version OpenAPI schema
 * @param {any} newSchema - New version OpenAPI schema
 * @returns {BackwardCompatibility} Compatibility analysis
 *
 * @example
 * ```typescript
 * const compat = analyzeBackwardCompatibility(schemaV1, schemaV2);
 * // Result: { compatible: false, issues: [...], recommendations: [...] }
 * ```
 */
export declare const analyzeBackwardCompatibility: (oldSchema: any, newSchema: any) => BackwardCompatibility;
/**
 * Validates that a new version maintains required fields.
 *
 * @param {Record<string, any>} oldFields - Old version required fields
 * @param {Record<string, any>} newFields - New version required fields
 * @returns {CompatibilityIssue[]} Field compatibility issues
 *
 * @example
 * ```typescript
 * const issues = validateRequiredFields({ name: 'string' }, { id: 'string' });
 * // Result: [{ severity: 'error', type: 'required_field_removed', ... }]
 * ```
 */
export declare const validateRequiredFields: (oldFields: Record<string, any>, newFields: Record<string, any>) => CompatibilityIssue[];
/**
 * Detects breaking changes between API versions.
 *
 * @param {any} oldVersion - Old version specification
 * @param {any} newVersion - New version specification
 * @returns {BreakingChange[]} List of breaking changes
 *
 * @example
 * ```typescript
 * const changes = detectBreakingChanges(specV1, specV2);
 * // Result: [{ type: 'removed', resource: '/users', description: '...' }]
 * ```
 */
export declare const detectBreakingChanges: (oldVersion: any, newVersion: any) => BreakingChange[];
/**
 * Creates a migration path between two versions.
 *
 * @param {string} fromVersion - Source version
 * @param {string} toVersion - Target version
 * @param {BreakingChange[]} breakingChanges - Breaking changes list
 * @returns {MigrationPath} Migration path specification
 *
 * @example
 * ```typescript
 * const migration = createMigrationPath('v1', 'v2', breakingChanges);
 * // Result: { fromVersion: 'v1', toVersion: 'v2', breakingChanges: [...], ... }
 * ```
 */
export declare const createMigrationPath: (fromVersion: string, toVersion: string, breakingChanges: BreakingChange[]) => MigrationPath;
/**
 * Generates migration guide documentation.
 *
 * @param {MigrationPath} migration - Migration path specification
 * @returns {string} Formatted migration guide
 *
 * @example
 * ```typescript
 * const guide = generateMigrationGuide(migrationPath);
 * // Result: "# Migration Guide: v1 to v2\n\n## Breaking Changes..."
 * ```
 */
export declare const generateMigrationGuide: (migration: MigrationPath) => string;
/**
 * Creates version-specific adapter for request transformation.
 *
 * @param {string} sourceVersion - Source API version
 * @param {string} targetVersion - Target API version
 * @param {Record<string, any>} fieldMappings - Field name mappings
 * @returns {(data: any) => any} Transformation adapter function
 *
 * @example
 * ```typescript
 * const adapter = createVersionAdapter('v1', 'v2', { userName: 'username' });
 * const transformed = adapter({ userName: 'john' });
 * // Result: { username: 'john' }
 * ```
 */
export declare const createVersionAdapter: (sourceVersion: string, targetVersion: string, fieldMappings: Record<string, any>) => ((data: any) => any);
/**
 * Generates version-specific OpenAPI documentation.
 *
 * @param {string} version - API version
 * @param {any} baseSpec - Base OpenAPI specification
 * @param {Partial<VersionDocumentation>} versionOverrides - Version-specific overrides
 * @returns {VersionDocumentation} Complete version documentation
 *
 * @example
 * ```typescript
 * const docs = generateVersionDocumentation('v2', baseSpec, { title: 'API v2' });
 * // Result: { version: 'v2', title: 'API v2', ... }
 * ```
 */
export declare const generateVersionDocumentation: (version: string, baseSpec: any, versionOverrides?: Partial<VersionDocumentation>) => VersionDocumentation;
/**
 * Adds version badge to documentation.
 *
 * @param {ApiVersion} version - API version
 * @returns {string} Markdown badge
 *
 * @example
 * ```typescript
 * const badge = addVersionBadge({ version: 'v2', status: 'stable', ... });
 * // Result: "![v2](https://img.shields.io/badge/version-v2-green)"
 * ```
 */
export declare const addVersionBadge: (version: ApiVersion) => string;
/**
 * Creates changelog entry for version release.
 *
 * @param {string} version - Version string
 * @param {ChangelogEntry[]} entries - Changelog entries
 * @returns {string} Formatted changelog
 *
 * @example
 * ```typescript
 * const changelog = createVersionChangelog('v2.0.0', entries);
 * // Result: "## v2.0.0 - 2024-01-15\n\n### Features\n- Added new endpoint..."
 * ```
 */
export declare const createVersionChangelog: (version: string, entries: ChangelogEntry[]) => string;
/**
 * Validates client version against API requirements.
 *
 * @param {string} clientVersion - Client SDK version
 * @param {ClientVersionRequirements} requirements - Version requirements
 * @returns {boolean} True if client version is supported
 *
 * @example
 * ```typescript
 * const isValid = validateClientVersion('v2.1.0', requirements);
 * // Result: true | false
 * ```
 */
export declare const validateClientVersion: (clientVersion: string, requirements: ClientVersionRequirements) => boolean;
/**
 * Generates client version compatibility matrix.
 *
 * @param {string[]} apiVersions - Available API versions
 * @param {string[]} clientVersions - Client SDK versions
 * @returns {Record<string, string[]>} Compatibility matrix
 *
 * @example
 * ```typescript
 * const matrix = generateCompatibilityMatrix(['v1', 'v2'], ['1.0.0', '2.0.0']);
 * // Result: { 'v1': ['1.0.0'], 'v2': ['2.0.0'] }
 * ```
 */
export declare const generateCompatibilityMatrix: (apiVersions: string[], clientVersions: string[]) => Record<string, string[]>;
/**
 * Creates version negotiation response for unsupported client.
 *
 * @param {string} requestedVersion - Client requested version
 * @param {string[]} supportedVersions - Supported API versions
 * @returns {object} Negotiation response
 *
 * @example
 * ```typescript
 * const response = createVersionNegotiationResponse('v5', ['v1', 'v2', 'v3']);
 * // Result: { error: '...', supportedVersions: [...], recommendedVersion: 'v3' }
 * ```
 */
export declare const createVersionNegotiationResponse: (requestedVersion: string, supportedVersions: string[]) => object;
/**
 * Creates sunset schedule for a version.
 *
 * @param {ApiVersion} version - API version
 * @param {Date} sunsetDate - Sunset date
 * @returns {object} Sunset schedule with milestones
 *
 * @example
 * ```typescript
 * const schedule = createSunsetSchedule(versionV1, new Date('2024-12-31'));
 * // Result: { sunsetDate, warningPhases: [...], finalCutoff }
 * ```
 */
export declare const createSunsetSchedule: (version: ApiVersion, sunsetDate: Date) => object;
/**
 * Generates sunset notification message for clients.
 *
 * @param {ApiVersion} version - Version being sunset
 * @param {number} daysRemaining - Days until sunset
 * @param {string} alternativeVersion - Alternative version to use
 * @returns {string} Sunset notification message
 *
 * @example
 * ```typescript
 * const message = generateSunsetNotification(versionV1, 30, 'v3');
 * ```
 */
export declare const generateSunsetNotification: (version: ApiVersion, daysRemaining: number, alternativeVersion: string) => string;
/**
 * Checks if sunset date is approaching and returns warning level.
 *
 * @param {Date} sunsetDate - Sunset date
 * @returns {('none' | 'info' | 'warning' | 'critical' | 'sunset')} Warning level
 *
 * @example
 * ```typescript
 * const level = getSunsetWarningLevel(new Date('2024-12-31'));
 * // Result: 'warning' | 'critical' | 'sunset'
 * ```
 */
export declare const getSunsetWarningLevel: (sunsetDate: Date) => "none" | "info" | "warning" | "critical" | "sunset";
/**
 * Creates version metadata object.
 *
 * @param {string} version - Version string
 * @param {string} endpoint - Version endpoint
 * @param {Partial<VersionMetadata>} [overrides] - Metadata overrides
 * @returns {VersionMetadata} Version metadata
 *
 * @example
 * ```typescript
 * const metadata = createVersionMetadata('v2', '/api/v2', { status: 'stable' });
 * ```
 */
export declare const createVersionMetadata: (version: string, endpoint: string, overrides?: Partial<VersionMetadata>) => VersionMetadata;
/**
 * Updates version metadata with new changelog entry.
 *
 * @param {VersionMetadata} metadata - Current metadata
 * @param {ChangelogEntry} entry - New changelog entry
 * @returns {VersionMetadata} Updated metadata
 *
 * @example
 * ```typescript
 * const updated = addChangelogEntry(metadata, {
 *   version: 'v2.1.0',
 *   date: new Date(),
 *   type: 'feature',
 *   description: 'Added new endpoint'
 * });
 * ```
 */
export declare const addChangelogEntry: (metadata: VersionMetadata, entry: ChangelogEntry) => VersionMetadata;
/**
 * Extracts major version number from version string.
 *
 * @param {string} version - Version string
 * @returns {number} Major version number
 *
 * @example
 * ```typescript
 * const major = extractMajorVersion('v2.1.3'); // 2
 * ```
 */
export declare const extractMajorVersion: (version: string) => number;
/**
 * Checks if two versions are compatible (same major version).
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {boolean} True if compatible
 *
 * @example
 * ```typescript
 * areVersionsCompatible('v2.1.0', 'v2.3.0'); // true
 * areVersionsCompatible('v2.1.0', 'v3.0.0'); // false
 * ```
 */
export declare const areVersionsCompatible: (version1: string, version2: string) => boolean;
/**
 * Creates complete version lifecycle configuration.
 *
 * @param {string} version - Version string
 * @param {Date} releaseDate - Release date
 * @param {DeprecationPolicy} policy - Deprecation policy
 * @returns {ApiVersion} Complete API version object
 *
 * @example
 * ```typescript
 * const versionObject = createVersionLifecycle('v2', new Date(), deprecationPolicy);
 * ```
 */
export declare const createVersionLifecycle: (version: string, releaseDate: Date, policy: DeprecationPolicy) => ApiVersion;
/**
 * Transitions version to next lifecycle status.
 *
 * @param {ApiVersion} version - Current version
 * @param {ApiVersion['status']} newStatus - New status
 * @returns {ApiVersion} Updated version
 *
 * @example
 * ```typescript
 * const deprecated = transitionVersionStatus(versionV2, 'deprecated');
 * ```
 */
export declare const transitionVersionStatus: (version: ApiVersion, newStatus: ApiVersion["status"]) => ApiVersion;
/**
 * Gets all supported versions filtered by status.
 *
 * @param {ApiVersion[]} versions - Array of API versions
 * @param {ApiVersion['status'][]} [statuses] - Statuses to filter by
 * @returns {ApiVersion[]} Filtered versions
 *
 * @example
 * ```typescript
 * const activeVersions = getSupportedVersions(allVersions, ['stable', 'beta']);
 * ```
 */
export declare const getSupportedVersions: (versions: ApiVersion[], statuses?: ApiVersion["status"][]) => ApiVersion[];
/**
 * Finds recommended version for migration.
 *
 * @param {string} currentVersion - Current version
 * @param {ApiVersion[]} availableVersions - Available versions
 * @returns {string} Recommended version
 *
 * @example
 * ```typescript
 * const recommended = getRecommendedMigrationVersion('v1', allVersions);
 * // Result: 'v3' (latest stable)
 * ```
 */
export declare const getRecommendedMigrationVersion: (currentVersion: string, availableVersions: ApiVersion[]) => string;
/**
 * Validates version naming convention.
 *
 * @param {string} version - Version string to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * isValidVersionFormat('v2.1.0'); // true
 * isValidVersionFormat('2.1'); // false
 * isValidVersionFormat('ver2'); // false
 * ```
 */
export declare const isValidVersionFormat: (version: string) => boolean;
/**
 * Calculates version distance between two versions.
 *
 * @param {string} fromVersion - Source version
 * @param {string} toVersion - Target version
 * @returns {number} Number of major/minor/patch increments
 *
 * @example
 * ```typescript
 * const distance = calculateVersionDistance('v1.0.0', 'v2.1.3');
 * // Result: 4 (1 major + 1 minor + 3 patch)
 * ```
 */
export declare const calculateVersionDistance: (fromVersion: string, toVersion: string) => number;
/**
 * Validates version change for HIPAA compliance impact.
 *
 * @param {BreakingChange[]} changes - Breaking changes
 * @returns {object} HIPAA compliance check result
 *
 * @example
 * ```typescript
 * const compliance = validateHIPAACompliance(breakingChanges);
 * // Result: { compliant: true, warnings: [], requiredActions: [] }
 * ```
 */
export declare const validateHIPAACompliance: (changes: BreakingChange[]) => object;
declare const _default: {
    parseVersionString: (versionString: string) => Partial<ApiVersion>;
    compareVersions: (version1: string, version2: string) => number;
    satisfiesVersionRange: (version: string, range: string) => boolean;
    getLatestVersion: (versions: string[]) => string;
    incrementVersion: (version: string, level: "major" | "minor" | "patch") => string;
    negotiateVersion: (pathVersion?: string, headerVersion?: string, queryVersion?: string, defaultVersion?: string) => VersionNegotiation;
    extractVersionFromRequest: (url: string, headers?: Record<string, string>) => string | null;
    buildVersionedRoute: (basePath: string, version: string, strategy?: "prefix" | "subdomain" | "header") => string;
    createVersionRoutingMap: (routes: VersionRoute[]) => Record<string, VersionRoute[]>;
    resolveVersionedHandler: (version: string, path: string, method: string, routeMap: Record<string, VersionRoute[]>) => VersionRoute | null;
    createDeprecationPolicy: (overrides?: Partial<DeprecationPolicy>) => DeprecationPolicy;
    calculateDeprecationTimeline: (releaseDate: Date, policy: DeprecationPolicy) => Pick<ApiVersion, "deprecationDate" | "sunsetDate" | "supportEndDate">;
    getVersionStatus: (version: ApiVersion, currentDate?: Date) => ApiVersion["status"];
    generateDeprecationHeader: (version: ApiVersion, alternativeVersion?: string) => string;
    createDeprecationNotice: (version: ApiVersion, migrationGuideUrl: string) => string;
    isInSunsetGracePeriod: (version: ApiVersion, currentDate?: Date) => boolean;
    analyzeBackwardCompatibility: (oldSchema: any, newSchema: any) => BackwardCompatibility;
    validateRequiredFields: (oldFields: Record<string, any>, newFields: Record<string, any>) => CompatibilityIssue[];
    detectBreakingChanges: (oldVersion: any, newVersion: any) => BreakingChange[];
    createMigrationPath: (fromVersion: string, toVersion: string, breakingChanges: BreakingChange[]) => MigrationPath;
    generateMigrationGuide: (migration: MigrationPath) => string;
    createVersionAdapter: (sourceVersion: string, targetVersion: string, fieldMappings: Record<string, any>) => ((data: any) => any);
    generateVersionDocumentation: (version: string, baseSpec: any, versionOverrides?: Partial<VersionDocumentation>) => VersionDocumentation;
    addVersionBadge: (version: ApiVersion) => string;
    createVersionChangelog: (version: string, entries: ChangelogEntry[]) => string;
    validateClientVersion: (clientVersion: string, requirements: ClientVersionRequirements) => boolean;
    generateCompatibilityMatrix: (apiVersions: string[], clientVersions: string[]) => Record<string, string[]>;
    createVersionNegotiationResponse: (requestedVersion: string, supportedVersions: string[]) => object;
    createSunsetSchedule: (version: ApiVersion, sunsetDate: Date) => object;
    generateSunsetNotification: (version: ApiVersion, daysRemaining: number, alternativeVersion: string) => string;
    getSunsetWarningLevel: (sunsetDate: Date) => "none" | "info" | "warning" | "critical" | "sunset";
    createVersionMetadata: (version: string, endpoint: string, overrides?: Partial<VersionMetadata>) => VersionMetadata;
    addChangelogEntry: (metadata: VersionMetadata, entry: ChangelogEntry) => VersionMetadata;
    extractMajorVersion: (version: string) => number;
    areVersionsCompatible: (version1: string, version2: string) => boolean;
    createVersionLifecycle: (version: string, releaseDate: Date, policy: DeprecationPolicy) => ApiVersion;
    transitionVersionStatus: (version: ApiVersion, newStatus: ApiVersion["status"]) => ApiVersion;
    getSupportedVersions: (versions: ApiVersion[], statuses?: ApiVersion["status"][]) => ApiVersion[];
    getRecommendedMigrationVersion: (currentVersion: string, availableVersions: ApiVersion[]) => string;
    isValidVersionFormat: (version: string) => boolean;
    calculateVersionDistance: (fromVersion: string, toVersion: string) => number;
    validateHIPAACompliance: (changes: BreakingChange[]) => object;
};
export default _default;
//# sourceMappingURL=swagger-oracle-versioning-advanced-kit.d.ts.map