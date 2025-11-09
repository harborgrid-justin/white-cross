"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHIPAACompliance = exports.calculateVersionDistance = exports.isValidVersionFormat = exports.getRecommendedMigrationVersion = exports.getSupportedVersions = exports.transitionVersionStatus = exports.createVersionLifecycle = exports.areVersionsCompatible = exports.extractMajorVersion = exports.addChangelogEntry = exports.createVersionMetadata = exports.getSunsetWarningLevel = exports.generateSunsetNotification = exports.createSunsetSchedule = exports.createVersionNegotiationResponse = exports.generateCompatibilityMatrix = exports.validateClientVersion = exports.createVersionChangelog = exports.addVersionBadge = exports.generateVersionDocumentation = exports.createVersionAdapter = exports.generateMigrationGuide = exports.createMigrationPath = exports.detectBreakingChanges = exports.validateRequiredFields = exports.analyzeBackwardCompatibility = exports.isInSunsetGracePeriod = exports.createDeprecationNotice = exports.generateDeprecationHeader = exports.getVersionStatus = exports.calculateDeprecationTimeline = exports.createDeprecationPolicy = exports.resolveVersionedHandler = exports.createVersionRoutingMap = exports.buildVersionedRoute = exports.extractVersionFromRequest = exports.negotiateVersion = exports.incrementVersion = exports.getLatestVersion = exports.satisfiesVersionRange = exports.compareVersions = exports.parseVersionString = void 0;
// ============================================================================
// VERSION PARSING AND COMPARISON
// ============================================================================
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
const parseVersionString = (versionString) => {
    const cleaned = versionString.replace(/^v/, '');
    const parts = cleaned.split('.').map(p => parseInt(p, 10));
    return {
        version: versionString,
        majorVersion: parts[0] || 0,
        minorVersion: parts[1] || 0,
        patchVersion: parts[2] || 0,
    };
};
exports.parseVersionString = parseVersionString;
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
const compareVersions = (version1, version2) => {
    const v1 = (0, exports.parseVersionString)(version1);
    const v2 = (0, exports.parseVersionString)(version2);
    if (v1.majorVersion !== v2.majorVersion) {
        return (v1.majorVersion || 0) > (v2.majorVersion || 0) ? 1 : -1;
    }
    if (v1.minorVersion !== v2.minorVersion) {
        return (v1.minorVersion || 0) > (v2.minorVersion || 0) ? 1 : -1;
    }
    if (v1.patchVersion !== v2.patchVersion) {
        return (v1.patchVersion || 0) > (v2.patchVersion || 0) ? 1 : -1;
    }
    return 0;
};
exports.compareVersions = compareVersions;
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
const satisfiesVersionRange = (version, range) => {
    const versionParsed = (0, exports.parseVersionString)(version);
    if (range.startsWith('>=')) {
        const minVersion = range.substring(2);
        return (0, exports.compareVersions)(version, minVersion) >= 0;
    }
    else if (range.startsWith('>')) {
        const minVersion = range.substring(1);
        return (0, exports.compareVersions)(version, minVersion) > 0;
    }
    else if (range.startsWith('<=')) {
        const maxVersion = range.substring(2);
        return (0, exports.compareVersions)(version, maxVersion) <= 0;
    }
    else if (range.startsWith('<')) {
        const maxVersion = range.substring(1);
        return (0, exports.compareVersions)(version, maxVersion) < 0;
    }
    else if (range.startsWith('^')) {
        const baseVersion = (0, exports.parseVersionString)(range.substring(1));
        return versionParsed.majorVersion === baseVersion.majorVersion &&
            (0, exports.compareVersions)(version, range.substring(1)) >= 0;
    }
    else if (range.startsWith('~')) {
        const baseVersion = (0, exports.parseVersionString)(range.substring(1));
        return versionParsed.majorVersion === baseVersion.majorVersion &&
            versionParsed.minorVersion === baseVersion.minorVersion &&
            (0, exports.compareVersions)(version, range.substring(1)) >= 0;
    }
    return version === range;
};
exports.satisfiesVersionRange = satisfiesVersionRange;
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
const getLatestVersion = (versions) => {
    if (versions.length === 0)
        throw new Error('No versions provided');
    return versions.reduce((latest, current) => {
        return (0, exports.compareVersions)(current, latest) > 0 ? current : latest;
    });
};
exports.getLatestVersion = getLatestVersion;
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
const incrementVersion = (version, level) => {
    const parsed = (0, exports.parseVersionString)(version);
    const hasPrefix = version.startsWith('v');
    let major = parsed.majorVersion || 0;
    let minor = parsed.minorVersion || 0;
    let patch = parsed.patchVersion || 0;
    if (level === 'major') {
        major++;
        minor = 0;
        patch = 0;
    }
    else if (level === 'minor') {
        minor++;
        patch = 0;
    }
    else {
        patch++;
    }
    return `${hasPrefix ? 'v' : ''}${major}.${minor}.${patch}`;
};
exports.incrementVersion = incrementVersion;
// ============================================================================
// VERSION NEGOTIATION AND ROUTING
// ============================================================================
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
const negotiateVersion = (pathVersion, headerVersion, queryVersion, defaultVersion = 'v1') => {
    if (pathVersion) {
        return {
            requestedVersion: pathVersion,
            resolvedVersion: pathVersion,
            strategy: 'path',
        };
    }
    if (headerVersion) {
        return {
            requestedVersion: headerVersion,
            acceptHeader: headerVersion,
            resolvedVersion: headerVersion,
            strategy: 'header',
        };
    }
    if (queryVersion) {
        return {
            requestedVersion: queryVersion,
            resolvedVersion: queryVersion,
            strategy: 'query',
        };
    }
    return {
        resolvedVersion: defaultVersion,
        strategy: 'default',
    };
};
exports.negotiateVersion = negotiateVersion;
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
const extractVersionFromRequest = (url, headers) => {
    // Try URL path
    const pathMatch = url.match(/\/v(\d+)(?:\.(\d+)(?:\.(\d+))?)?/);
    if (pathMatch) {
        return `v${pathMatch[1]}${pathMatch[2] ? '.' + pathMatch[2] : ''}${pathMatch[3] ? '.' + pathMatch[3] : ''}`;
    }
    // Try Accept header
    if (headers?.['accept']) {
        const headerMatch = headers['accept'].match(/\.v(\d+)(?:\.(\d+)(?:\.(\d+))?)?\+/);
        if (headerMatch) {
            return `v${headerMatch[1]}${headerMatch[2] ? '.' + headerMatch[2] : ''}${headerMatch[3] ? '.' + headerMatch[3] : ''}`;
        }
    }
    // Try custom version header
    if (headers?.['api-version']) {
        return headers['api-version'].startsWith('v') ? headers['api-version'] : `v${headers['api-version']}`;
    }
    return null;
};
exports.extractVersionFromRequest = extractVersionFromRequest;
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
const buildVersionedRoute = (basePath, version, strategy = 'prefix') => {
    if (strategy === 'prefix') {
        const parts = basePath.split('/').filter(p => p);
        const apiIndex = parts.findIndex(p => p === 'api');
        if (apiIndex !== -1) {
            parts.splice(apiIndex + 1, 0, version);
        }
        else {
            parts.unshift(version);
        }
        return '/' + parts.join('/');
    }
    if (strategy === 'subdomain') {
        return `${version}.api.example.com${basePath}`;
    }
    // For header strategy, return original path
    return basePath;
};
exports.buildVersionedRoute = buildVersionedRoute;
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
const createVersionRoutingMap = (routes) => {
    return routes.reduce((acc, route) => {
        if (!acc[route.version]) {
            acc[route.version] = [];
        }
        acc[route.version].push(route);
        return acc;
    }, {});
};
exports.createVersionRoutingMap = createVersionRoutingMap;
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
const resolveVersionedHandler = (version, path, method, routeMap) => {
    const versionRoutes = routeMap[version];
    if (!versionRoutes)
        return null;
    return versionRoutes.find(route => route.path === path && route.method.toLowerCase() === method.toLowerCase()) || null;
};
exports.resolveVersionedHandler = resolveVersionedHandler;
// ============================================================================
// DEPRECATION MANAGEMENT
// ============================================================================
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
const createDeprecationPolicy = (overrides) => {
    return {
        warningPeriodDays: 30,
        deprecationPeriodDays: 180,
        sunsetPeriodDays: 90,
        notificationChannels: ['email', 'api-header', 'documentation'],
        gracePeriodDays: 30,
        ...overrides,
    };
};
exports.createDeprecationPolicy = createDeprecationPolicy;
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
const calculateDeprecationTimeline = (releaseDate, policy) => {
    const deprecationDate = new Date(releaseDate);
    deprecationDate.setDate(deprecationDate.getDate() + policy.warningPeriodDays + policy.deprecationPeriodDays);
    const sunsetDate = new Date(deprecationDate);
    sunsetDate.setDate(sunsetDate.getDate() + policy.sunsetPeriodDays);
    const supportEndDate = new Date(sunsetDate);
    supportEndDate.setDate(supportEndDate.getDate() + policy.gracePeriodDays);
    return { deprecationDate, sunsetDate, supportEndDate };
};
exports.calculateDeprecationTimeline = calculateDeprecationTimeline;
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
const getVersionStatus = (version, currentDate = new Date()) => {
    if (version.sunsetDate && currentDate >= version.sunsetDate) {
        return 'sunset';
    }
    if (version.deprecationDate && currentDate >= version.deprecationDate) {
        return 'deprecated';
    }
    return version.status || 'stable';
};
exports.getVersionStatus = getVersionStatus;
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
const generateDeprecationHeader = (version, alternativeVersion) => {
    const parts = [`version=${version.version}`];
    if (version.sunsetDate) {
        parts.push(`sunset="${version.sunsetDate.toISOString().split('T')[0]}"`);
    }
    if (alternativeVersion) {
        parts.push(`alternative="${alternativeVersion}"`);
    }
    return parts.join('; ');
};
exports.generateDeprecationHeader = generateDeprecationHeader;
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
const createDeprecationNotice = (version, migrationGuideUrl) => {
    const sunsetDateStr = version.sunsetDate
        ? version.sunsetDate.toISOString().split('T')[0]
        : 'TBD';
    return `⚠️ This API version (${version.version}) is deprecated and will be sunset on ${sunsetDateStr}. ` +
        `Please migrate to the latest version. See migration guide: ${migrationGuideUrl}`;
};
exports.createDeprecationNotice = createDeprecationNotice;
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
const isInSunsetGracePeriod = (version, currentDate = new Date()) => {
    if (!version.sunsetDate || !version.supportEndDate)
        return false;
    return currentDate >= version.sunsetDate && currentDate < version.supportEndDate;
};
exports.isInSunsetGracePeriod = isInSunsetGracePeriod;
// ============================================================================
// BACKWARD COMPATIBILITY CHECKING
// ============================================================================
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
const analyzeBackwardCompatibility = (oldSchema, newSchema) => {
    const issues = [];
    // Check for removed endpoints
    const oldPaths = Object.keys(oldSchema.paths || {});
    const newPaths = Object.keys(newSchema.paths || {});
    oldPaths.forEach(path => {
        if (!newPaths.includes(path)) {
            issues.push({
                severity: 'error',
                type: 'endpoint_removed',
                message: `Endpoint ${path} was removed`,
                affectedEndpoints: [path],
                suggestedFix: 'Keep the endpoint with a deprecation warning',
            });
        }
    });
    // Check for changed response schemas
    oldPaths.forEach(path => {
        if (newPaths.includes(path)) {
            const oldMethods = Object.keys(oldSchema.paths[path] || {});
            const newMethods = Object.keys(newSchema.paths[path] || {});
            oldMethods.forEach(method => {
                if (!newMethods.includes(method)) {
                    issues.push({
                        severity: 'error',
                        type: 'method_removed',
                        message: `Method ${method} on ${path} was removed`,
                        affectedEndpoints: [`${method.toUpperCase()} ${path}`],
                    });
                }
            });
        }
    });
    const compatible = !issues.some(issue => issue.severity === 'error');
    const recommendations = issues.length > 0
        ? ['Consider creating a new major version for breaking changes',
            'Maintain deprecated endpoints with clear migration paths',
            'Provide adapter layers for schema changes']
        : ['No breaking changes detected - safe to deploy'];
    return { compatible, issues, recommendations };
};
exports.analyzeBackwardCompatibility = analyzeBackwardCompatibility;
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
const validateRequiredFields = (oldFields, newFields) => {
    const issues = [];
    Object.keys(oldFields).forEach(field => {
        if (!newFields[field]) {
            issues.push({
                severity: 'error',
                type: 'required_field_removed',
                message: `Required field '${field}' was removed`,
                affectedEndpoints: [],
                suggestedFix: `Make '${field}' optional with default value or keep it required`,
            });
        }
        else if (oldFields[field] !== newFields[field]) {
            issues.push({
                severity: 'warning',
                type: 'field_type_changed',
                message: `Field '${field}' type changed from ${oldFields[field]} to ${newFields[field]}`,
                affectedEndpoints: [],
                suggestedFix: 'Ensure type conversion is handled or revert change',
            });
        }
    });
    return issues;
};
exports.validateRequiredFields = validateRequiredFields;
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
const detectBreakingChanges = (oldVersion, newVersion) => {
    const changes = [];
    // Detect removed endpoints
    Object.keys(oldVersion.paths || {}).forEach(path => {
        if (!newVersion.paths?.[path]) {
            changes.push({
                type: 'removed',
                resource: path,
                description: `Endpoint ${path} was completely removed`,
                workaround: 'Use alternative endpoint or upgrade to new API pattern',
            });
        }
    });
    // Detect renamed fields (heuristic)
    Object.keys(oldVersion.components?.schemas || {}).forEach(schemaName => {
        const oldSchema = oldVersion.components.schemas[schemaName];
        const newSchema = newVersion.components?.schemas?.[schemaName];
        if (newSchema) {
            Object.keys(oldSchema.properties || {}).forEach(prop => {
                if (!newSchema.properties?.[prop]) {
                    changes.push({
                        type: 'renamed',
                        resource: schemaName,
                        field: prop,
                        description: `Field '${prop}' in ${schemaName} may have been renamed or removed`,
                        workaround: 'Check documentation for field mapping',
                    });
                }
            });
        }
    });
    return changes;
};
exports.detectBreakingChanges = detectBreakingChanges;
// ============================================================================
// MIGRATION UTILITIES
// ============================================================================
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
const createMigrationPath = (fromVersion, toVersion, breakingChanges) => {
    const migrationSteps = [];
    let stepOrder = 1;
    // Generate migration steps from breaking changes
    breakingChanges.forEach(change => {
        if (change.type === 'removed') {
            migrationSteps.push({
                order: stepOrder++,
                description: `Remove references to ${change.resource}`,
                automated: false,
            });
        }
        else if (change.type === 'renamed' && change.field) {
            migrationSteps.push({
                order: stepOrder++,
                description: `Update field references from '${change.field}' to new name`,
                automated: true,
                script: `sed -i 's/${change.field}/${change.newValue}/g' client.ts`,
            });
        }
    });
    const estimatedEffort = breakingChanges.length === 0 ? 'low' :
        breakingChanges.length <= 5 ? 'medium' : 'high';
    const automatable = migrationSteps.every(step => step.automated);
    return {
        fromVersion,
        toVersion,
        breakingChanges,
        migrationSteps,
        estimatedEffort,
        automatable,
    };
};
exports.createMigrationPath = createMigrationPath;
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
const generateMigrationGuide = (migration) => {
    let guide = `# Migration Guide: ${migration.fromVersion} to ${migration.toVersion}\n\n`;
    guide += `**Estimated Effort:** ${migration.estimatedEffort.toUpperCase()}\n`;
    guide += `**Automatable:** ${migration.automatable ? 'Yes' : 'No'}\n\n`;
    guide += `## Breaking Changes\n\n`;
    migration.breakingChanges.forEach((change, idx) => {
        guide += `${idx + 1}. **${change.type.toUpperCase()}**: ${change.resource}\n`;
        guide += `   - ${change.description}\n`;
        if (change.workaround) {
            guide += `   - **Workaround:** ${change.workaround}\n`;
        }
        guide += '\n';
    });
    guide += `## Migration Steps\n\n`;
    migration.migrationSteps.forEach(step => {
        guide += `${step.order}. ${step.description}\n`;
        if (step.automated) {
            guide += `   - ✅ Automated\n`;
            if (step.script) {
                guide += `   - Script: \`${step.script}\`\n`;
            }
        }
        else {
            guide += `   - ⚠️ Manual intervention required\n`;
        }
        guide += '\n';
    });
    return guide;
};
exports.generateMigrationGuide = generateMigrationGuide;
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
const createVersionAdapter = (sourceVersion, targetVersion, fieldMappings) => {
    return (data) => {
        const transformed = { ...data };
        Object.keys(fieldMappings).forEach(oldField => {
            if (transformed[oldField] !== undefined) {
                const newField = fieldMappings[oldField];
                transformed[newField] = transformed[oldField];
                delete transformed[oldField];
            }
        });
        return transformed;
    };
};
exports.createVersionAdapter = createVersionAdapter;
// ============================================================================
// VERSION-SPECIFIC DOCUMENTATION
// ============================================================================
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
const generateVersionDocumentation = (version, baseSpec, versionOverrides) => {
    return {
        version,
        title: `API ${version}`,
        description: baseSpec.info?.description || '',
        baseUrl: `/api/${version}`,
        servers: [
            {
                url: `/api/${version}`,
                description: `${version} API Server`,
            },
        ],
        paths: baseSpec.paths || {},
        components: baseSpec.components || {},
        ...versionOverrides,
    };
};
exports.generateVersionDocumentation = generateVersionDocumentation;
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
const addVersionBadge = (version) => {
    const statusColors = {
        alpha: 'red',
        beta: 'yellow',
        stable: 'green',
        deprecated: 'orange',
        sunset: 'lightgrey',
    };
    const color = statusColors[version.status] || 'blue';
    return `![${version.version}](https://img.shields.io/badge/version-${version.version}-${color})`;
};
exports.addVersionBadge = addVersionBadge;
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
const createVersionChangelog = (version, entries) => {
    if (entries.length === 0)
        return '';
    const latestDate = entries[0].date.toISOString().split('T')[0];
    let changelog = `## ${version} - ${latestDate}\n\n`;
    const groupedEntries = entries.reduce((acc, entry) => {
        if (!acc[entry.type])
            acc[entry.type] = [];
        acc[entry.type].push(entry);
        return acc;
    }, {});
    const sections = ['breaking', 'feature', 'fix', 'deprecation', 'security'];
    const sectionTitles = {
        breaking: 'Breaking Changes',
        feature: 'Features',
        fix: 'Bug Fixes',
        deprecation: 'Deprecations',
        security: 'Security',
    };
    sections.forEach(type => {
        if (groupedEntries[type]) {
            changelog += `### ${sectionTitles[type]}\n\n`;
            groupedEntries[type].forEach(entry => {
                changelog += `- ${entry.description}`;
                if (entry.issueId) {
                    changelog += ` (#${entry.issueId})`;
                }
                changelog += '\n';
            });
            changelog += '\n';
        }
    });
    return changelog;
};
exports.createVersionChangelog = createVersionChangelog;
// ============================================================================
// CLIENT VERSION MANAGEMENT
// ============================================================================
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
const validateClientVersion = (clientVersion, requirements) => {
    if (!requirements.supportedVersions.includes(clientVersion)) {
        return false;
    }
    if ((0, exports.compareVersions)(clientVersion, requirements.minimumVersion) < 0) {
        return false;
    }
    if (requirements.maximumVersion && (0, exports.compareVersions)(clientVersion, requirements.maximumVersion) > 0) {
        return false;
    }
    return true;
};
exports.validateClientVersion = validateClientVersion;
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
const generateCompatibilityMatrix = (apiVersions, clientVersions) => {
    const matrix = {};
    apiVersions.forEach(apiVersion => {
        const apiMajor = (0, exports.parseVersionString)(apiVersion).majorVersion;
        matrix[apiVersion] = clientVersions.filter(clientVersion => {
            const clientMajor = (0, exports.parseVersionString)(clientVersion).majorVersion;
            return clientMajor === apiMajor;
        });
    });
    return matrix;
};
exports.generateCompatibilityMatrix = generateCompatibilityMatrix;
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
const createVersionNegotiationResponse = (requestedVersion, supportedVersions) => {
    const latest = (0, exports.getLatestVersion)(supportedVersions);
    return {
        error: `API version ${requestedVersion} is not supported`,
        supportedVersions,
        recommendedVersion: latest,
        upgradeInstructions: `Please upgrade to ${latest} or use one of the supported versions`,
    };
};
exports.createVersionNegotiationResponse = createVersionNegotiationResponse;
// ============================================================================
// VERSION SUNSET SCHEDULING
// ============================================================================
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
const createSunsetSchedule = (version, sunsetDate) => {
    const now = new Date();
    const daysUntilSunset = Math.floor((sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const warningPhases = [
        { days: 90, phase: '90-day warning', notificationSent: daysUntilSunset <= 90 },
        { days: 60, phase: '60-day warning', notificationSent: daysUntilSunset <= 60 },
        { days: 30, phase: '30-day warning', notificationSent: daysUntilSunset <= 30 },
        { days: 14, phase: '14-day warning', notificationSent: daysUntilSunset <= 14 },
        { days: 7, phase: '7-day final warning', notificationSent: daysUntilSunset <= 7 },
    ];
    return {
        version: version.version,
        sunsetDate,
        daysRemaining: Math.max(0, daysUntilSunset),
        warningPhases,
        finalCutoff: sunsetDate,
        status: daysUntilSunset <= 0 ? 'sunset' : 'active',
    };
};
exports.createSunsetSchedule = createSunsetSchedule;
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
const generateSunsetNotification = (version, daysRemaining, alternativeVersion) => {
    if (daysRemaining <= 0) {
        return `API version ${version.version} has been sunset. Please use ${alternativeVersion}.`;
    }
    return `⚠️ SUNSET NOTICE: API version ${version.version} will be sunset in ${daysRemaining} days. ` +
        `Please migrate to ${alternativeVersion} before ${version.sunsetDate?.toISOString().split('T')[0]}.`;
};
exports.generateSunsetNotification = generateSunsetNotification;
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
const getSunsetWarningLevel = (sunsetDate) => {
    const now = new Date();
    const daysRemaining = Math.floor((sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining < 0)
        return 'sunset';
    if (daysRemaining <= 7)
        return 'critical';
    if (daysRemaining <= 30)
        return 'warning';
    if (daysRemaining <= 90)
        return 'info';
    return 'none';
};
exports.getSunsetWarningLevel = getSunsetWarningLevel;
// ============================================================================
// VERSION METADATA MANAGEMENT
// ============================================================================
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
const createVersionMetadata = (version, endpoint, overrides) => {
    return {
        version,
        endpoint,
        status: 'active',
        breakingChanges: [],
        changelog: [],
        ...overrides,
    };
};
exports.createVersionMetadata = createVersionMetadata;
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
const addChangelogEntry = (metadata, entry) => {
    return {
        ...metadata,
        changelog: [...(metadata.changelog || []), entry],
    };
};
exports.addChangelogEntry = addChangelogEntry;
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
const extractMajorVersion = (version) => {
    const parsed = (0, exports.parseVersionString)(version);
    return parsed.majorVersion || 0;
};
exports.extractMajorVersion = extractMajorVersion;
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
const areVersionsCompatible = (version1, version2) => {
    return (0, exports.extractMajorVersion)(version1) === (0, exports.extractMajorVersion)(version2);
};
exports.areVersionsCompatible = areVersionsCompatible;
// ============================================================================
// API VERSION LIFECYCLE
// ============================================================================
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
const createVersionLifecycle = (version, releaseDate, policy) => {
    const parsed = (0, exports.parseVersionString)(version);
    const timeline = (0, exports.calculateDeprecationTimeline)(releaseDate, policy);
    return {
        version,
        majorVersion: parsed.majorVersion || 0,
        minorVersion: parsed.minorVersion || 0,
        patchVersion: parsed.patchVersion || 0,
        status: 'stable',
        releaseDate,
        ...timeline,
    };
};
exports.createVersionLifecycle = createVersionLifecycle;
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
const transitionVersionStatus = (version, newStatus) => {
    const validTransitions = {
        alpha: ['beta', 'deprecated'],
        beta: ['stable', 'deprecated'],
        stable: ['deprecated'],
        deprecated: ['sunset'],
        sunset: [],
    };
    if (!validTransitions[version.status].includes(newStatus)) {
        throw new Error(`Invalid status transition from ${version.status} to ${newStatus}`);
    }
    return {
        ...version,
        status: newStatus,
    };
};
exports.transitionVersionStatus = transitionVersionStatus;
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
const getSupportedVersions = (versions, statuses) => {
    const activeStatuses = statuses || ['alpha', 'beta', 'stable', 'deprecated'];
    return versions.filter(v => activeStatuses.includes(v.status));
};
exports.getSupportedVersions = getSupportedVersions;
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
const getRecommendedMigrationVersion = (currentVersion, availableVersions) => {
    const stableVersions = availableVersions.filter(v => v.status === 'stable');
    if (stableVersions.length === 0) {
        throw new Error('No stable versions available');
    }
    const sortedVersions = stableVersions.sort((a, b) => (0, exports.compareVersions)(b.version, a.version));
    return sortedVersions[0].version;
};
exports.getRecommendedMigrationVersion = getRecommendedMigrationVersion;
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
const isValidVersionFormat = (version) => {
    const pattern = /^v?\d+\.\d+\.\d+$/;
    return pattern.test(version);
};
exports.isValidVersionFormat = isValidVersionFormat;
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
const calculateVersionDistance = (fromVersion, toVersion) => {
    const from = (0, exports.parseVersionString)(fromVersion);
    const to = (0, exports.parseVersionString)(toVersion);
    const majorDiff = Math.abs((to.majorVersion || 0) - (from.majorVersion || 0));
    const minorDiff = Math.abs((to.minorVersion || 0) - (from.minorVersion || 0));
    const patchDiff = Math.abs((to.patchVersion || 0) - (from.patchVersion || 0));
    return majorDiff * 100 + minorDiff * 10 + patchDiff;
};
exports.calculateVersionDistance = calculateVersionDistance;
// ============================================================================
// HIPAA COMPLIANCE CONSIDERATIONS
// ============================================================================
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
const validateHIPAACompliance = (changes) => {
    const warnings = [];
    const requiredActions = [];
    changes.forEach(change => {
        if (change.resource.includes('patient') || change.resource.includes('phi')) {
            warnings.push(`Change to ${change.resource} may affect PHI access patterns`);
            requiredActions.push('Conduct privacy impact assessment');
            requiredActions.push('Update audit logging for version-specific PHI access');
        }
        if (change.type === 'removed' && change.resource.includes('audit')) {
            warnings.push('Removal of audit endpoints affects compliance tracking');
            requiredActions.push('Ensure alternative audit mechanisms are in place');
        }
    });
    return {
        compliant: warnings.length === 0,
        warnings,
        requiredActions: [...new Set(requiredActions)],
    };
};
exports.validateHIPAACompliance = validateHIPAACompliance;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Version parsing and comparison
    parseVersionString: exports.parseVersionString,
    compareVersions: exports.compareVersions,
    satisfiesVersionRange: exports.satisfiesVersionRange,
    getLatestVersion: exports.getLatestVersion,
    incrementVersion: exports.incrementVersion,
    // Version negotiation and routing
    negotiateVersion: exports.negotiateVersion,
    extractVersionFromRequest: exports.extractVersionFromRequest,
    buildVersionedRoute: exports.buildVersionedRoute,
    createVersionRoutingMap: exports.createVersionRoutingMap,
    resolveVersionedHandler: exports.resolveVersionedHandler,
    // Deprecation management
    createDeprecationPolicy: exports.createDeprecationPolicy,
    calculateDeprecationTimeline: exports.calculateDeprecationTimeline,
    getVersionStatus: exports.getVersionStatus,
    generateDeprecationHeader: exports.generateDeprecationHeader,
    createDeprecationNotice: exports.createDeprecationNotice,
    isInSunsetGracePeriod: exports.isInSunsetGracePeriod,
    // Backward compatibility
    analyzeBackwardCompatibility: exports.analyzeBackwardCompatibility,
    validateRequiredFields: exports.validateRequiredFields,
    detectBreakingChanges: exports.detectBreakingChanges,
    // Migration utilities
    createMigrationPath: exports.createMigrationPath,
    generateMigrationGuide: exports.generateMigrationGuide,
    createVersionAdapter: exports.createVersionAdapter,
    // Version-specific documentation
    generateVersionDocumentation: exports.generateVersionDocumentation,
    addVersionBadge: exports.addVersionBadge,
    createVersionChangelog: exports.createVersionChangelog,
    // Client version management
    validateClientVersion: exports.validateClientVersion,
    generateCompatibilityMatrix: exports.generateCompatibilityMatrix,
    createVersionNegotiationResponse: exports.createVersionNegotiationResponse,
    // Version sunset scheduling
    createSunsetSchedule: exports.createSunsetSchedule,
    generateSunsetNotification: exports.generateSunsetNotification,
    getSunsetWarningLevel: exports.getSunsetWarningLevel,
    // Version metadata management
    createVersionMetadata: exports.createVersionMetadata,
    addChangelogEntry: exports.addChangelogEntry,
    extractMajorVersion: exports.extractMajorVersion,
    areVersionsCompatible: exports.areVersionsCompatible,
    // API version lifecycle
    createVersionLifecycle: exports.createVersionLifecycle,
    transitionVersionStatus: exports.transitionVersionStatus,
    getSupportedVersions: exports.getSupportedVersions,
    getRecommendedMigrationVersion: exports.getRecommendedMigrationVersion,
    isValidVersionFormat: exports.isValidVersionFormat,
    calculateVersionDistance: exports.calculateVersionDistance,
    // HIPAA compliance
    validateHIPAACompliance: exports.validateHIPAACompliance,
};
//# sourceMappingURL=swagger-oracle-versioning-advanced-kit.js.map