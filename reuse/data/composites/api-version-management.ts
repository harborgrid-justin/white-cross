/**
 * API Version Management
 *
 * Enterprise-ready TypeScript utilities for API versioning, version negotiation,
 * deprecation management, and migration strategies. Supports multiple versioning
 * approaches (URI, header, query parameter) with backward compatibility.
 *
 * @module api-version-management
 * @version 1.0.0
 */

import { INestApplication, Type, VersioningType } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

/**
 * Type definitions for version management
 */

export interface VersionConfig {
  /** Current API version */
  current: string;
  /** Array of supported versions */
  supported: string[];
  /** Array of deprecated versions */
  deprecated: string[];
  /** Default version when none specified */
  default: string;
  /** Version format (e.g., 'v1', '1.0', 'v1.2.3') */
  format: 'simple' | 'semantic' | 'dated';
}

export interface VersionStrategy {
  /** Versioning type */
  type: 'uri' | 'header' | 'media-type' | 'custom' | 'query';
  /** Header name for header-based versioning */
  header?: string;
  /** Query parameter name for query-based versioning */
  key?: string;
  /** Version prefix for URI versioning */
  prefix?: string;
}

export interface DeprecationPolicy {
  /** Version to deprecate */
  version: string;
  /** Deprecation date */
  deprecatedAt: Date;
  /** Sunset date (removal date) */
  sunsetDate?: Date;
  /** Alternative version to use */
  alternativeVersion?: string;
  /** Deprecation reason */
  reason: string;
  /** Migration guide URL */
  migrationGuide?: string;
}

export interface VersionMetadata {
  /** Version identifier */
  version: string;
  /** Release date */
  releasedAt: Date;
  /** Version status */
  status: 'current' | 'supported' | 'deprecated' | 'sunset';
  /** Breaking changes flag */
  hasBreakingChanges: boolean;
  /** Version description */
  description?: string;
  /** Changelog URL */
  changelogUrl?: string;
}

export interface MigrationPath {
  /** Source version */
  from: string;
  /** Target version */
  to: string;
  /** Breaking changes */
  breakingChanges: string[];
  /** Migration steps */
  steps: string[];
  /** Automated migration available */
  automatable: boolean;
  /** Estimated migration time */
  estimatedTime?: string;
}

// ============================================================================
// VERSION STRATEGY CONFIGURATION (5 functions)
// ============================================================================

/**
 * Configures URI-based versioning (e.g., /v1/users, /v2/users).
 *
 * @param app - NestJS application instance
 * @param options - URI versioning options
 * @returns Configured application
 *
 * @example
 * ```typescript
 * // Simple URI versioning
 * const app = await NestFactory.create(AppModule);
 * configureUriVersioning(app, {
 *   defaultVersion: '1',
 *   prefix: 'v'
 * });
 *
 * // Semantic versioning
 * configureUriVersioning(app, {
 *   defaultVersion: '1.0',
 *   prefix: 'v',
 *   versions: ['1.0', '1.1', '2.0']
 * });
 * ```
 */
export function configureUriVersioning(
  app: INestApplication,
  options: {
    defaultVersion: string | string[];
    prefix?: string;
    versions?: string[];
  }
): INestApplication {
  const { defaultVersion, prefix = 'v' } = options;

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
    prefix,
  });

  return app;
}

/**
 * Configures header-based versioning (e.g., X-API-Version: 1).
 *
 * @param app - NestJS application instance
 * @param options - Header versioning options
 * @returns Configured application
 *
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule);
 * configureHeaderVersioning(app, {
 *   header: 'X-API-Version',
 *   defaultVersion: '1'
 * });
 * ```
 */
export function configureHeaderVersioning(
  app: INestApplication,
  options: {
    header?: string;
    defaultVersion: string | string[];
  }
): INestApplication {
  const { header = 'X-API-Version', defaultVersion } = options;

  app.enableVersioning({
    type: VersioningType.HEADER,
    header,
    defaultVersion,
  });

  return app;
}

/**
 * Configures media type versioning (e.g., Accept: application/vnd.api+json;version=1).
 *
 * @param app - NestJS application instance
 * @param options - Media type versioning options
 * @returns Configured application
 *
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule);
 * configureMediaTypeVersioning(app, {
 *   key: 'v',
 *   defaultVersion: '1'
 * });
 * ```
 */
export function configureMediaTypeVersioning(
  app: INestApplication,
  options: {
    key?: string;
    defaultVersion: string | string[];
  }
): INestApplication {
  const { key = 'v', defaultVersion } = options;

  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key,
    defaultVersion,
  });

  return app;
}

/**
 * Configures custom versioning strategy with extractor function.
 *
 * @param app - NestJS application instance
 * @param extractor - Custom version extraction function
 * @param defaultVersion - Default version
 * @returns Configured application
 *
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule);
 * configureCustomVersioning(
 *   app,
 *   (request) => request.headers['x-custom-version'] || request.query.version,
 *   '1'
 * );
 * ```
 */
export function configureCustomVersioning(
  app: INestApplication,
  extractor: (request: any) => string | string[],
  defaultVersion: string | string[]
): INestApplication {
  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor,
    defaultVersion,
  });

  return app;
}

/**
 * Builds comprehensive version configuration object.
 *
 * @param current - Current version
 * @param supported - Supported versions
 * @param options - Additional configuration options
 * @returns Version configuration object
 *
 * @example
 * ```typescript
 * const config = buildVersionConfig('2.0', ['1.0', '1.5', '2.0'], {
 *   deprecated: ['1.0'],
 *   default: '2.0',
 *   format: 'semantic'
 * });
 * ```
 */
export function buildVersionConfig(
  current: string,
  supported: string[],
  options: {
    deprecated?: string[];
    default?: string;
    format?: 'simple' | 'semantic' | 'dated';
  } = {}
): VersionConfig {
  const {
    deprecated = [],
    default: defaultVersion = current,
    format = 'simple',
  } = options;

  return {
    current,
    supported,
    deprecated,
    default: defaultVersion,
    format,
  };
}

// ============================================================================
// VERSION NEGOTIATION (6 functions)
// ============================================================================

/**
 * Parses version string from various formats.
 *
 * @param versionString - Version string to parse
 * @returns Parsed version components
 *
 * @example
 * ```typescript
 * const v1 = parseVersionString('v1.2.3');
 * // Returns: { major: 1, minor: 2, patch: 3, prefix: 'v', full: 'v1.2.3' }
 *
 * const v2 = parseVersionString('2.0');
 * // Returns: { major: 2, minor: 0, patch: 0, prefix: '', full: '2.0' }
 * ```
 */
export function parseVersionString(versionString: string): {
  major: number;
  minor: number;
  patch: number;
  prefix: string;
  full: string;
} {
  const versionRegex = /^([vV])?(\d+)(?:\.(\d+))?(?:\.(\d+))?$/;
  const match = versionString.match(versionRegex);

  if (!match) {
    throw new Error(`Invalid version format: ${versionString}`);
  }

  const [, prefix = '', major, minor = '0', patch = '0'] = match;

  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    prefix,
    full: versionString,
  };
}

/**
 * Compares two version strings.
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 *
 * @example
 * ```typescript
 * compareVersions('1.0', '2.0'); // -1
 * compareVersions('2.0', '2.0'); // 0
 * compareVersions('2.1', '2.0'); // 1
 * ```
 */
export function compareVersions(version1: string, version2: string): number {
  const v1 = parseVersionString(version1);
  const v2 = parseVersionString(version2);

  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  return v1.patch - v2.patch;
}

/**
 * Finds the best matching version from available versions.
 *
 * @param requestedVersion - Requested version
 * @param availableVersions - Available versions
 * @param strategy - Matching strategy
 * @returns Best matching version
 *
 * @example
 * ```typescript
 * const best = findBestMatchingVersion('1.5', ['1.0', '1.2', '2.0'], 'nearest');
 * // Returns: '1.2'
 *
 * const exact = findBestMatchingVersion('2.0', ['1.0', '2.0', '3.0'], 'exact');
 * // Returns: '2.0'
 * ```
 */
export function findBestMatchingVersion(
  requestedVersion: string,
  availableVersions: string[],
  strategy: 'exact' | 'nearest' | 'major' | 'minor' = 'nearest'
): string | null {
  const requested = parseVersionString(requestedVersion);

  if (strategy === 'exact') {
    return availableVersions.find(v => compareVersions(v, requestedVersion) === 0) || null;
  }

  const sorted = [...availableVersions].sort(compareVersions);

  if (strategy === 'major') {
    return sorted.reverse().find(v => {
      const parsed = parseVersionString(v);
      return parsed.major === requested.major && compareVersions(v, requestedVersion) <= 0;
    }) || null;
  }

  if (strategy === 'minor') {
    return sorted.reverse().find(v => {
      const parsed = parseVersionString(v);
      return parsed.major === requested.major &&
             parsed.minor === requested.minor &&
             compareVersions(v, requestedVersion) <= 0;
    }) || null;
  }

  // Nearest strategy
  let nearest: string | null = null;
  let minDiff = Infinity;

  for (const version of sorted) {
    const cmp = compareVersions(version, requestedVersion);
    if (cmp <= 0) {
      const diff = Math.abs(cmp);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = version;
      }
    }
  }

  return nearest;
}

/**
 * Validates if a version is supported.
 *
 * @param version - Version to validate
 * @param config - Version configuration
 * @returns Validation result with message
 *
 * @example
 * ```typescript
 * const config = buildVersionConfig('2.0', ['1.0', '2.0']);
 * const result = validateVersion('1.5', config);
 * // Returns: { valid: false, message: 'Version 1.5 is not supported', suggestion: '2.0' }
 * ```
 */
export function validateVersion(
  version: string,
  config: VersionConfig
): {
  valid: boolean;
  message: string;
  suggestion?: string;
  isDeprecated?: boolean;
} {
  if (config.supported.includes(version)) {
    const isDeprecated = config.deprecated.includes(version);
    return {
      valid: true,
      message: isDeprecated ? `Version ${version} is deprecated` : `Version ${version} is valid`,
      isDeprecated,
    };
  }

  const suggestion = findBestMatchingVersion(version, config.supported, 'nearest');

  return {
    valid: false,
    message: `Version ${version} is not supported`,
    suggestion: suggestion || config.current,
  };
}

/**
 * Extracts version from request headers.
 *
 * @param headers - Request headers object
 * @param config - Version configuration
 * @returns Extracted version or default
 *
 * @example
 * ```typescript
 * const version = extractVersionFromHeaders(
 *   { 'x-api-version': '2.0' },
 *   { header: 'x-api-version', default: '1.0' }
 * );
 * // Returns: '2.0'
 * ```
 */
export function extractVersionFromHeaders(
  headers: Record<string, string | string[]>,
  config: {
    header?: string;
    default: string;
  }
): string {
  const { header = 'x-api-version', default: defaultVersion } = config;

  const headerValue = headers[header.toLowerCase()];

  if (Array.isArray(headerValue)) {
    return headerValue[0] || defaultVersion;
  }

  return headerValue || defaultVersion;
}

/**
 * Builds version negotiation response headers.
 *
 * @param actualVersion - Actual version being served
 * @param config - Version configuration
 * @returns Response headers object
 *
 * @example
 * ```typescript
 * const headers = buildVersionResponseHeaders('2.0', {
 *   current: '2.0',
 *   deprecated: ['1.0'],
 *   supported: ['1.0', '2.0']
 * });
 * // Returns: { 'X-API-Version': '2.0', 'X-API-Version-Current': '2.0', ... }
 * ```
 */
export function buildVersionResponseHeaders(
  actualVersion: string,
  config: VersionConfig
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-API-Version': actualVersion,
    'X-API-Version-Current': config.current,
    'X-API-Versions-Supported': config.supported.join(', '),
  };

  if (config.deprecated.includes(actualVersion)) {
    headers['X-API-Version-Deprecated'] = 'true';
    headers['Deprecation'] = 'true';
    headers['Sunset'] = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString(); // 180 days
  }

  if (config.deprecated.length > 0) {
    headers['X-API-Versions-Deprecated'] = config.deprecated.join(', ');
  }

  return headers;
}

// ============================================================================
// VERSION DEPRECATION (5 functions)
// ============================================================================

/**
 * Creates a deprecation policy for a version.
 *
 * @param version - Version to deprecate
 * @param options - Deprecation policy options
 * @returns Deprecation policy object
 *
 * @example
 * ```typescript
 * const policy = createDeprecationPolicy('1.0', {
 *   reason: 'Security vulnerabilities fixed in v2.0',
 *   alternativeVersion: '2.0',
 *   sunsetDate: new Date('2025-12-31'),
 *   migrationGuide: 'https://docs.example.com/migration/v1-to-v2'
 * });
 * ```
 */
export function createDeprecationPolicy(
  version: string,
  options: {
    reason: string;
    alternativeVersion?: string;
    sunsetDate?: Date;
    migrationGuide?: string;
    deprecatedAt?: Date;
  }
): DeprecationPolicy {
  const {
    reason,
    alternativeVersion,
    sunsetDate,
    migrationGuide,
    deprecatedAt = new Date(),
  } = options;

  return {
    version,
    deprecatedAt,
    sunsetDate,
    alternativeVersion,
    reason,
    migrationGuide,
  };
}

/**
 * Calculates deprecation timeline for a version.
 *
 * @param deprecationDate - Date when version was deprecated
 * @param sunsetPeriodDays - Number of days until sunset
 * @returns Deprecation timeline
 *
 * @example
 * ```typescript
 * const timeline = calculateDeprecationTimeline(new Date('2024-01-01'), 180);
 * // Returns: { deprecatedAt, sunsetDate, daysRemaining, percentComplete }
 * ```
 */
export function calculateDeprecationTimeline(
  deprecationDate: Date,
  sunsetPeriodDays: number
): {
  deprecatedAt: Date;
  sunsetDate: Date;
  daysRemaining: number;
  percentComplete: number;
  status: 'active' | 'deprecated' | 'sunset';
} {
  const now = new Date();
  const sunsetDate = new Date(deprecationDate.getTime() + sunsetPeriodDays * 24 * 60 * 60 * 1000);
  const totalDays = sunsetPeriodDays;
  const elapsed = Math.floor((now.getTime() - deprecationDate.getTime()) / (24 * 60 * 60 * 1000));
  const daysRemaining = Math.max(0, totalDays - elapsed);
  const percentComplete = Math.min(100, (elapsed / totalDays) * 100);

  let status: 'active' | 'deprecated' | 'sunset';
  if (now < deprecationDate) {
    status = 'active';
  } else if (now < sunsetDate) {
    status = 'deprecated';
  } else {
    status = 'sunset';
  }

  return {
    deprecatedAt: deprecationDate,
    sunsetDate,
    daysRemaining,
    percentComplete,
    status,
  };
}

/**
 * Generates deprecation warning message.
 *
 * @param policy - Deprecation policy
 * @returns Deprecation warning message
 *
 * @example
 * ```typescript
 * const warning = generateDeprecationWarning({
 *   version: '1.0',
 *   reason: 'Security vulnerabilities',
 *   alternativeVersion: '2.0',
 *   sunsetDate: new Date('2025-12-31')
 * });
 * ```
 */
export function generateDeprecationWarning(policy: DeprecationPolicy): string {
  let message = `API version ${policy.version} is deprecated. ${policy.reason}.`;

  if (policy.alternativeVersion) {
    message += ` Please migrate to version ${policy.alternativeVersion}.`;
  }

  if (policy.sunsetDate) {
    const daysUntilSunset = Math.ceil(
      (policy.sunsetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
    if (daysUntilSunset > 0) {
      message += ` This version will be removed in ${daysUntilSunset} days (${policy.sunsetDate.toISOString().split('T')[0]}).`;
    } else {
      message += ` This version should have been removed on ${policy.sunsetDate.toISOString().split('T')[0]}.`;
    }
  }

  if (policy.migrationGuide) {
    message += ` Migration guide: ${policy.migrationGuide}`;
  }

  return message;
}

/**
 * Checks if a version is deprecated.
 *
 * @param version - Version to check
 * @param deprecationPolicies - Array of deprecation policies
 * @returns Deprecation check result
 *
 * @example
 * ```typescript
 * const result = isVersionDeprecated('1.0', policies);
 * // Returns: { deprecated: true, policy: {...}, warning: '...' }
 * ```
 */
export function isVersionDeprecated(
  version: string,
  deprecationPolicies: DeprecationPolicy[]
): {
  deprecated: boolean;
  policy?: DeprecationPolicy;
  warning?: string;
  daysUntilSunset?: number;
} {
  const policy = deprecationPolicies.find(p => p.version === version);

  if (!policy) {
    return { deprecated: false };
  }

  const warning = generateDeprecationWarning(policy);
  let daysUntilSunset: number | undefined;

  if (policy.sunsetDate) {
    daysUntilSunset = Math.ceil(
      (policy.sunsetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
  }

  return {
    deprecated: true,
    policy,
    warning,
    daysUntilSunset,
  };
}

/**
 * Builds sunset response headers for deprecated versions.
 *
 * @param policy - Deprecation policy
 * @returns Sunset headers object
 *
 * @example
 * ```typescript
 * const headers = buildSunsetHeaders(policy);
 * // Returns: { 'Deprecation': 'true', 'Sunset': '...', 'Link': '...' }
 * ```
 */
export function buildSunsetHeaders(policy: DeprecationPolicy): Record<string, string> {
  const headers: Record<string, string> = {
    'Deprecation': 'true',
  };

  if (policy.sunsetDate) {
    headers['Sunset'] = policy.sunsetDate.toUTCString();
  }

  if (policy.alternativeVersion) {
    headers['X-API-Deprecated-Replacement'] = policy.alternativeVersion;
  }

  if (policy.migrationGuide) {
    headers['Link'] = `<${policy.migrationGuide}>; rel="deprecation"; type="text/html"`;
  }

  return headers;
}

// ============================================================================
// MIGRATION UTILITIES (6 functions)
// ============================================================================

/**
 * Creates a migration path between versions.
 *
 * @param from - Source version
 * @param to - Target version
 * @param changes - Breaking changes and steps
 * @returns Migration path object
 *
 * @example
 * ```typescript
 * const migration = createMigrationPath('1.0', '2.0', {
 *   breakingChanges: [
 *     'User.name split into firstName and lastName',
 *     'Authentication now requires OAuth2'
 *   ],
 *   steps: [
 *     'Update user model structure',
 *     'Implement OAuth2 client',
 *     'Update all API calls'
 *   ],
 *   automatable: false,
 *   estimatedTime: '4-8 hours'
 * });
 * ```
 */
export function createMigrationPath(
  from: string,
  to: string,
  changes: {
    breakingChanges: string[];
    steps: string[];
    automatable?: boolean;
    estimatedTime?: string;
  }
): MigrationPath {
  const { breakingChanges, steps, automatable = false, estimatedTime } = changes;

  return {
    from,
    to,
    breakingChanges,
    steps,
    automatable,
    estimatedTime,
  };
}

/**
 * Finds migration path between two versions.
 *
 * @param from - Source version
 * @param to - Target version
 * @param availablePaths - Available migration paths
 * @returns Migration path or null if not found
 *
 * @example
 * ```typescript
 * const path = findMigrationPath('1.0', '2.0', migrationPaths);
 * ```
 */
export function findMigrationPath(
  from: string,
  to: string,
  availablePaths: MigrationPath[]
): MigrationPath | null {
  return availablePaths.find(path => path.from === from && path.to === to) || null;
}

/**
 * Generates migration documentation.
 *
 * @param path - Migration path
 * @returns Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateMigrationDocs(migrationPath);
 * ```
 */
export function generateMigrationDocs(path: MigrationPath): string {
  let docs = `# Migration Guide: ${path.from} → ${path.to}\n\n`;

  if (path.estimatedTime) {
    docs += `**Estimated Time:** ${path.estimatedTime}\n\n`;
  }

  docs += `**Automated Migration:** ${path.automatable ? 'Yes' : 'No'}\n\n`;

  docs += `## Breaking Changes\n\n`;
  path.breakingChanges.forEach((change, i) => {
    docs += `${i + 1}. ${change}\n`;
  });

  docs += `\n## Migration Steps\n\n`;
  path.steps.forEach((step, i) => {
    docs += `${i + 1}. ${step}\n`;
  });

  return docs;
}

/**
 * Validates migration compatibility.
 *
 * @param from - Source version
 * @param to - Target version
 * @param config - Version configuration
 * @returns Compatibility validation result
 *
 * @example
 * ```typescript
 * const result = validateMigrationCompatibility('1.0', '3.0', config);
 * ```
 */
export function validateMigrationCompatibility(
  from: string,
  to: string,
  config: VersionConfig
): {
  compatible: boolean;
  message: string;
  warnings: string[];
  requiresIntermediate: boolean;
  suggestedPath?: string[];
} {
  const fromParsed = parseVersionString(from);
  const toParsed = parseVersionString(to);

  const warnings: string[] = [];
  const majorDiff = Math.abs(toParsed.major - fromParsed.major);

  if (!config.supported.includes(from)) {
    return {
      compatible: false,
      message: `Source version ${from} is not supported`,
      warnings: [],
      requiresIntermediate: false,
    };
  }

  if (!config.supported.includes(to)) {
    return {
      compatible: false,
      message: `Target version ${to} is not supported`,
      warnings: [],
      requiresIntermediate: false,
    };
  }

  if (compareVersions(from, to) === 0) {
    return {
      compatible: true,
      message: 'Source and target versions are the same',
      warnings: [],
      requiresIntermediate: false,
    };
  }

  if (compareVersions(from, to) > 0) {
    warnings.push('Downgrading may cause data loss or compatibility issues');
  }

  const requiresIntermediate = majorDiff > 1;
  if (requiresIntermediate) {
    warnings.push(`Large version jump detected. Consider migrating incrementally: ${from} → ${fromParsed.major + 1}.0 → ${to}`);
  }

  if (config.deprecated.includes(to)) {
    warnings.push(`Target version ${to} is deprecated`);
  }

  return {
    compatible: true,
    message: 'Migration is possible',
    warnings,
    requiresIntermediate,
    suggestedPath: requiresIntermediate
      ? [`${fromParsed.major + 1}.0`, to]
      : [to],
  };
}

/**
 * Calculates migration complexity score.
 *
 * @param path - Migration path
 * @returns Complexity score and details
 *
 * @example
 * ```typescript
 * const complexity = calculateMigrationComplexity(migrationPath);
 * // Returns: { score: 8.5, level: 'high', factors: [...] }
 * ```
 */
export function calculateMigrationComplexity(path: MigrationPath): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{ factor: string; weight: number; description: string }>;
} {
  const factors: Array<{ factor: string; weight: number; description: string }> = [];
  let score = 0;

  // Breaking changes impact
  const breakingChangesWeight = path.breakingChanges.length * 1.5;
  if (path.breakingChanges.length > 0) {
    factors.push({
      factor: 'Breaking Changes',
      weight: breakingChangesWeight,
      description: `${path.breakingChanges.length} breaking changes`,
    });
    score += breakingChangesWeight;
  }

  // Steps complexity
  const stepsWeight = path.steps.length * 0.5;
  factors.push({
    factor: 'Migration Steps',
    weight: stepsWeight,
    description: `${path.steps.length} migration steps`,
  });
  score += stepsWeight;

  // Automation availability
  if (!path.automatable) {
    factors.push({
      factor: 'Manual Migration',
      weight: 3,
      description: 'No automated migration available',
    });
    score += 3;
  }

  // Version distance
  const fromParsed = parseVersionString(path.from);
  const toParsed = parseVersionString(path.to);
  const majorDiff = Math.abs(toParsed.major - fromParsed.major);
  const versionDistanceWeight = majorDiff * 2;
  if (majorDiff > 0) {
    factors.push({
      factor: 'Version Distance',
      weight: versionDistanceWeight,
      description: `${majorDiff} major version(s) apart`,
    });
    score += versionDistanceWeight;
  }

  let level: 'low' | 'medium' | 'high' | 'critical';
  if (score <= 3) level = 'low';
  else if (score <= 7) level = 'medium';
  else if (score <= 12) level = 'high';
  else level = 'critical';

  return {
    score: Math.round(score * 10) / 10,
    level,
    factors,
  };
}

/**
 * Generates automated migration script (conceptual).
 *
 * @param path - Migration path
 * @param format - Script format
 * @returns Migration script content
 *
 * @example
 * ```typescript
 * const script = generateMigrationScript(path, 'bash');
 * ```
 */
export function generateMigrationScript(
  path: MigrationPath,
  format: 'bash' | 'javascript' | 'typescript' = 'bash'
): string {
  if (!path.automatable) {
    return `# Migration from ${path.from} to ${path.to} requires manual intervention\n# See migration guide for details`;
  }

  let script = '';

  if (format === 'bash') {
    script += `#!/bin/bash\n`;
    script += `# Automated migration from ${path.from} to ${path.to}\n\n`;
    script += `echo "Starting migration..."\n\n`;
    path.steps.forEach((step, i) => {
      script += `echo "Step ${i + 1}: ${step}"\n`;
      script += `# TODO: Implement ${step}\n\n`;
    });
    script += `echo "Migration complete!"\n`;
  } else if (format === 'javascript' || format === 'typescript') {
    const ext = format === 'typescript' ? ': void' : '';
    script += `// Automated migration from ${path.from} to ${path.to}\n\n`;
    script += `async function migrate()${ext} {\n`;
    script += `  console.log('Starting migration...');\n\n`;
    path.steps.forEach((step, i) => {
      script += `  // Step ${i + 1}: ${step}\n`;
      script += `  await migrateStep${i + 1}();\n\n`;
    });
    script += `  console.log('Migration complete!');\n`;
    script += `}\n`;
  }

  return script;
}

// ============================================================================
// VERSION DOCUMENTATION (5 functions)
// ============================================================================

/**
 * Creates version metadata object.
 *
 * @param version - Version identifier
 * @param options - Version metadata options
 * @returns Version metadata object
 *
 * @example
 * ```typescript
 * const metadata = createVersionMetadata('2.0', {
 *   releasedAt: new Date('2024-01-01'),
 *   status: 'current',
 *   hasBreakingChanges: true,
 *   description: 'Major update with new authentication system'
 * });
 * ```
 */
export function createVersionMetadata(
  version: string,
  options: {
    releasedAt: Date;
    status: 'current' | 'supported' | 'deprecated' | 'sunset';
    hasBreakingChanges: boolean;
    description?: string;
    changelogUrl?: string;
  }
): VersionMetadata {
  const { releasedAt, status, hasBreakingChanges, description, changelogUrl } = options;

  return {
    version,
    releasedAt,
    status,
    hasBreakingChanges,
    description,
    changelogUrl,
  };
}

/**
 * Generates API version documentation.
 *
 * @param versions - Array of version metadata
 * @returns Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateVersionDocs(versionMetadataArray);
 * ```
 */
export function generateVersionDocs(versions: VersionMetadata[]): string {
  let docs = `# API Version Documentation\n\n`;

  const current = versions.find(v => v.status === 'current');
  if (current) {
    docs += `**Current Version:** ${current.version}\n\n`;
  }

  docs += `## Version History\n\n`;

  const sorted = [...versions].sort((a, b) => compareVersions(b.version, a.version));

  sorted.forEach(v => {
    docs += `### Version ${v.version}\n\n`;
    docs += `- **Status:** ${v.status}\n`;
    docs += `- **Released:** ${v.releasedAt.toISOString().split('T')[0]}\n`;
    docs += `- **Breaking Changes:** ${v.hasBreakingChanges ? 'Yes' : 'No'}\n`;

    if (v.description) {
      docs += `- **Description:** ${v.description}\n`;
    }

    if (v.changelogUrl) {
      docs += `- **Changelog:** [View Details](${v.changelogUrl})\n`;
    }

    docs += `\n`;
  });

  return docs;
}

/**
 * Builds version comparison matrix.
 *
 * @param versions - Versions to compare
 * @param features - Features to compare across versions
 * @returns Comparison matrix
 *
 * @example
 * ```typescript
 * const matrix = buildVersionComparisonMatrix(
 *   ['1.0', '2.0', '3.0'],
 *   ['Authentication', 'Rate Limiting', 'Webhooks']
 * );
 * ```
 */
export function buildVersionComparisonMatrix(
  versions: string[],
  features: string[]
): {
  versions: string[];
  features: string[];
  matrix: Record<string, Record<string, boolean>>;
} {
  const matrix: Record<string, Record<string, boolean>> = {};

  versions.forEach(version => {
    matrix[version] = {};
    features.forEach(feature => {
      // In real implementation, this would check actual feature availability
      matrix[version][feature] = true;
    });
  });

  return {
    versions,
    features,
    matrix,
  };
}

/**
 * Generates changelog from version metadata.
 *
 * @param versions - Array of version metadata
 * @param format - Changelog format
 * @returns Changelog content
 *
 * @example
 * ```typescript
 * const changelog = generateChangelog(versions, 'markdown');
 * ```
 */
export function generateChangelog(
  versions: VersionMetadata[],
  format: 'markdown' | 'html' | 'json' = 'markdown'
): string {
  if (format === 'json') {
    return JSON.stringify(versions, null, 2);
  }

  const sorted = [...versions].sort((a, b) => compareVersions(b.version, a.version));

  if (format === 'markdown') {
    let changelog = `# Changelog\n\n`;

    sorted.forEach(v => {
      changelog += `## [${v.version}] - ${v.releasedAt.toISOString().split('T')[0]}\n\n`;

      if (v.hasBreakingChanges) {
        changelog += `### ⚠️ BREAKING CHANGES\n\n`;
      }

      if (v.description) {
        changelog += `${v.description}\n\n`;
      }

      changelog += `---\n\n`;
    });

    return changelog;
  }

  // HTML format
  let html = `<div class="changelog">\n`;
  html += `<h1>Changelog</h1>\n`;

  sorted.forEach(v => {
    html += `<div class="version">\n`;
    html += `  <h2>${v.version} <span class="date">${v.releasedAt.toISOString().split('T')[0]}</span></h2>\n`;

    if (v.hasBreakingChanges) {
      html += `  <div class="breaking-changes">⚠️ BREAKING CHANGES</div>\n`;
    }

    if (v.description) {
      html += `  <p>${v.description}</p>\n`;
    }

    html += `</div>\n`;
  });

  html += `</div>\n`;

  return html;
}

/**
 * Exports version documentation to OpenAPI document.
 *
 * @param document - OpenAPI document
 * @param metadata - Version metadata
 * @returns Updated OpenAPI document
 *
 * @example
 * ```typescript
 * const updatedDoc = exportVersionToOpenApi(document, versionMetadata);
 * ```
 */
export function exportVersionToOpenApi(
  document: OpenAPIObject,
  metadata: VersionMetadata
): OpenAPIObject {
  const updated = { ...document };

  if (!updated.info) {
    updated.info = { title: '', description: '', version: '' };
  }

  updated.info.version = metadata.version;

  // Add version metadata as vendor extensions
  (updated as any)['x-api-version-metadata'] = {
    version: metadata.version,
    releasedAt: metadata.releasedAt.toISOString(),
    status: metadata.status,
    hasBreakingChanges: metadata.hasBreakingChanges,
    description: metadata.description,
    changelogUrl: metadata.changelogUrl,
  };

  return updated;
}

// ============================================================================
// BACKWARD COMPATIBILITY (5 functions)
// ============================================================================

/**
 * Checks backward compatibility between versions.
 *
 * @param oldVersion - Old version
 * @param newVersion - New version
 * @param breakingChanges - Array of breaking changes
 * @returns Compatibility check result
 *
 * @example
 * ```typescript
 * const compat = checkBackwardCompatibility('1.0', '1.5', []);
 * // Returns: { compatible: true, level: 'full', warnings: [] }
 * ```
 */
export function checkBackwardCompatibility(
  oldVersion: string,
  newVersion: string,
  breakingChanges: string[]
): {
  compatible: boolean;
  level: 'full' | 'partial' | 'none';
  warnings: string[];
  breakingChanges: string[];
} {
  const oldParsed = parseVersionString(oldVersion);
  const newParsed = parseVersionString(newVersion);

  const warnings: string[] = [];

  // Major version change typically means breaking changes
  if (newParsed.major > oldParsed.major) {
    if (breakingChanges.length === 0) {
      warnings.push('Major version change without documented breaking changes');
    }

    return {
      compatible: false,
      level: 'none',
      warnings,
      breakingChanges,
    };
  }

  // Minor version changes should be backward compatible
  if (newParsed.minor > oldParsed.minor) {
    if (breakingChanges.length > 0) {
      warnings.push('Minor version has breaking changes (should be avoided)');
      return {
        compatible: false,
        level: 'partial',
        warnings,
        breakingChanges,
      };
    }

    return {
      compatible: true,
      level: 'full',
      warnings: [],
      breakingChanges: [],
    };
  }

  // Patch version changes must be fully backward compatible
  return {
    compatible: breakingChanges.length === 0,
    level: breakingChanges.length === 0 ? 'full' : 'none',
    warnings: breakingChanges.length > 0 ? ['Patch version should not have breaking changes'] : [],
    breakingChanges,
  };
}

/**
 * Creates backward compatibility adapter.
 *
 * @param oldVersion - Old version
 * @param newVersion - New version
 * @param transformations - Data transformations
 * @returns Compatibility adapter function
 *
 * @example
 * ```typescript
 * const adapter = createCompatibilityAdapter('1.0', '2.0', {
 *   'User.name': (data) => ({ firstName: data.split(' ')[0], lastName: data.split(' ')[1] })
 * });
 * ```
 */
export function createCompatibilityAdapter(
  oldVersion: string,
  newVersion: string,
  transformations: Record<string, (data: any) => any>
): (data: any) => any {
  return (data: any) => {
    let transformed = { ...data };

    Object.entries(transformations).forEach(([path, transform]) => {
      const keys = path.split('.');
      let current = transformed;

      // Navigate to the property
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      if (current[lastKey] !== undefined) {
        const result = transform(current[lastKey]);
        if (typeof result === 'object' && !Array.isArray(result)) {
          Object.assign(current, result);
          delete current[lastKey];
        } else {
          current[lastKey] = result;
        }
      }
    });

    return transformed;
  };
}

/**
 * Validates data against version schema.
 *
 * @param data - Data to validate
 * @param version - Target version
 * @param schemas - Version schemas
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateAgainstVersionSchema(userData, '2.0', versionSchemas);
 * ```
 */
export function validateAgainstVersionSchema(
  data: any,
  version: string,
  schemas: Record<string, any>
): {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: string[];
} {
  const schema = schemas[version];

  if (!schema) {
    return {
      valid: false,
      errors: [{ field: '_version', message: `No schema found for version ${version}` }],
      warnings: [],
    };
  }

  // Basic validation (in production, use a proper validator like Joi or Ajv)
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: string[] = [];

  // This is a simplified example
  if (schema.required) {
    schema.required.forEach((field: string) => {
      if (!(field in data)) {
        errors.push({ field, message: `Required field '${field}' is missing` });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates compatibility report.
 *
 * @param oldVersion - Old version
 * @param newVersion - New version
 * @param analysis - Compatibility analysis
 * @returns Compatibility report
 *
 * @example
 * ```typescript
 * const report = generateCompatibilityReport('1.0', '2.0', analysisData);
 * ```
 */
export function generateCompatibilityReport(
  oldVersion: string,
  newVersion: string,
  analysis: {
    breakingChanges: string[];
    deprecations: string[];
    additions: string[];
    removals: string[];
  }
): string {
  let report = `# Compatibility Report: ${oldVersion} → ${newVersion}\n\n`;

  report += `## Summary\n\n`;
  report += `- Breaking Changes: ${analysis.breakingChanges.length}\n`;
  report += `- Deprecations: ${analysis.deprecations.length}\n`;
  report += `- New Features: ${analysis.additions.length}\n`;
  report += `- Removed Features: ${analysis.removals.length}\n\n`;

  if (analysis.breakingChanges.length > 0) {
    report += `## ⚠️ Breaking Changes\n\n`;
    analysis.breakingChanges.forEach((change, i) => {
      report += `${i + 1}. ${change}\n`;
    });
    report += `\n`;
  }

  if (analysis.deprecations.length > 0) {
    report += `## ⏰ Deprecations\n\n`;
    analysis.deprecations.forEach((dep, i) => {
      report += `${i + 1}. ${dep}\n`;
    });
    report += `\n`;
  }

  if (analysis.additions.length > 0) {
    report += `## ✨ New Features\n\n`;
    analysis.additions.forEach((add, i) => {
      report += `${i + 1}. ${add}\n`;
    });
    report += `\n`;
  }

  if (analysis.removals.length > 0) {
    report += `## 🗑️ Removed Features\n\n`;
    analysis.removals.forEach((rem, i) => {
      report += `${i + 1}. ${rem}\n`;
    });
    report += `\n`;
  }

  return report;
}

/**
 * Creates version fallback chain.
 *
 * @param requestedVersion - Requested version
 * @param availableVersions - Available versions
 * @returns Fallback chain
 *
 * @example
 * ```typescript
 * const chain = createVersionFallbackChain('2.5', ['1.0', '2.0', '2.1', '3.0']);
 * // Returns: ['2.1', '2.0', '1.0'] - tries newer compatible versions first
 * ```
 */
export function createVersionFallbackChain(
  requestedVersion: string,
  availableVersions: string[]
): string[] {
  const requested = parseVersionString(requestedVersion);
  const sorted = [...availableVersions]
    .map(v => ({ version: v, parsed: parseVersionString(v) }))
    .filter(v => v.parsed.major <= requested.major)
    .sort((a, b) => compareVersions(b.version, a.version));

  return sorted.map(v => v.version);
}

// ============================================================================
// VERSION TESTING (5 functions)
// ============================================================================

/**
 * Creates version compatibility test suite.
 *
 * @param versions - Versions to test
 * @param testCases - Test cases
 * @returns Test suite configuration
 *
 * @example
 * ```typescript
 * const suite = createVersionTestSuite(['1.0', '2.0'], testCases);
 * ```
 */
export function createVersionTestSuite(
  versions: string[],
  testCases: Array<{
    name: string;
    input: any;
    expectedOutput: any;
    description?: string;
  }>
): {
  versions: string[];
  testCases: any[];
  totalTests: number;
} {
  return {
    versions,
    testCases,
    totalTests: versions.length * testCases.length,
  };
}

/**
 * Validates version-specific endpoint behavior.
 *
 * @param version - Version to test
 * @param endpoint - Endpoint path
 * @param expectedBehavior - Expected behavior definition
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateVersionEndpoint('2.0', '/users', {
 *   method: 'GET',
 *   requiresAuth: true,
 *   responseSchema: UserSchema
 * });
 * ```
 */
export function validateVersionEndpoint(
  version: string,
  endpoint: string,
  expectedBehavior: {
    method: string;
    requiresAuth: boolean;
    responseSchema?: any;
    deprecated?: boolean;
  }
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Validation logic would go here
  // This is a placeholder for demonstration

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generates version compatibility matrix test.
 *
 * @param versions - Versions to test
 * @param features - Features to verify
 * @returns Test matrix
 *
 * @example
 * ```typescript
 * const matrix = generateCompatibilityTest(['1.0', '2.0'], ['auth', 'pagination']);
 * ```
 */
export function generateCompatibilityTest(
  versions: string[],
  features: string[]
): Record<string, Record<string, { tested: boolean; passed: boolean; notes?: string }>> {
  const matrix: Record<string, Record<string, { tested: boolean; passed: boolean; notes?: string }>> = {};

  versions.forEach(version => {
    matrix[version] = {};
    features.forEach(feature => {
      matrix[version][feature] = {
        tested: false,
        passed: false,
      };
    });
  });

  return matrix;
}

/**
 * Runs version regression tests.
 *
 * @param oldVersion - Previous version
 * @param newVersion - New version
 * @param testSuite - Test suite to run
 * @returns Test results
 *
 * @example
 * ```typescript
 * const results = runVersionRegressionTests('1.0', '2.0', testSuite);
 * ```
 */
export function runVersionRegressionTests(
  oldVersion: string,
  newVersion: string,
  testSuite: any[]
): {
  passed: number;
  failed: number;
  regressions: Array<{ test: string; issue: string }>;
} {
  const results = {
    passed: 0,
    failed: 0,
    regressions: [] as Array<{ test: string; issue: string }>,
  };

  // Test execution would happen here
  // This is a placeholder for demonstration

  return results;
}

/**
 * Generates version test report.
 *
 * @param testResults - Test results data
 * @returns Test report markdown
 *
 * @example
 * ```typescript
 * const report = generateVersionTestReport(results);
 * ```
 */
export function generateVersionTestReport(testResults: {
  version: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  details: Array<{ test: string; status: 'passed' | 'failed' | 'skipped'; message?: string }>;
}): string {
  let report = `# Version ${testResults.version} Test Report\n\n`;

  report += `## Summary\n\n`;
  report += `- Total Tests: ${testResults.totalTests}\n`;
  report += `- Passed: ${testResults.passed} (${Math.round((testResults.passed / testResults.totalTests) * 100)}%)\n`;
  report += `- Failed: ${testResults.failed}\n`;
  report += `- Skipped: ${testResults.skipped}\n`;
  report += `- Duration: ${testResults.duration}ms\n\n`;

  if (testResults.failed > 0) {
    report += `## ❌ Failed Tests\n\n`;
    testResults.details
      .filter(d => d.status === 'failed')
      .forEach((detail, i) => {
        report += `${i + 1}. **${detail.test}**\n`;
        if (detail.message) {
          report += `   - ${detail.message}\n`;
        }
      });
    report += `\n`;
  }

  return report;
}

// ============================================================================
// VERSION ANALYTICS (3 functions)
// ============================================================================

/**
 * Tracks version usage statistics.
 *
 * @param version - Version identifier
 * @param requestCount - Number of requests
 * @param timestamp - Timestamp of measurement
 * @returns Usage statistics object
 *
 * @example
 * ```typescript
 * const stats = trackVersionUsage('2.0', 1500, new Date());
 * ```
 */
export function trackVersionUsage(
  version: string,
  requestCount: number,
  timestamp: Date = new Date()
): {
  version: string;
  requestCount: number;
  timestamp: Date;
} {
  return {
    version,
    requestCount,
    timestamp,
  };
}

/**
 * Analyzes version adoption rate.
 *
 * @param versionStats - Version usage statistics
 * @returns Adoption analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeVersionAdoption([
 *   { version: '1.0', requestCount: 1000, timestamp: new Date() },
 *   { version: '2.0', requestCount: 5000, timestamp: new Date() }
 * ]);
 * ```
 */
export function analyzeVersionAdoption(
  versionStats: Array<{ version: string; requestCount: number; timestamp: Date }>
): {
  totalRequests: number;
  versions: Array<{
    version: string;
    requests: number;
    percentage: number;
    trend: 'growing' | 'stable' | 'declining';
  }>;
} {
  const totalRequests = versionStats.reduce((sum, stat) => sum + stat.requestCount, 0);

  const versions = versionStats.map(stat => ({
    version: stat.version,
    requests: stat.requestCount,
    percentage: Math.round((stat.requestCount / totalRequests) * 100 * 10) / 10,
    trend: 'stable' as 'growing' | 'stable' | 'declining', // Simplified
  }));

  return {
    totalRequests,
    versions,
  };
}

/**
 * Generates version usage report.
 *
 * @param analysis - Version adoption analysis
 * @returns Usage report markdown
 *
 * @example
 * ```typescript
 * const report = generateVersionUsageReport(adoptionAnalysis);
 * ```
 */
export function generateVersionUsageReport(analysis: {
  totalRequests: number;
  versions: Array<{ version: string; requests: number; percentage: number; trend: string }>;
}): string {
  let report = `# API Version Usage Report\n\n`;

  report += `## Overview\n\n`;
  report += `**Total Requests:** ${analysis.totalRequests.toLocaleString()}\n\n`;

  report += `## Version Distribution\n\n`;
  report += `| Version | Requests | Percentage | Trend |\n`;
  report += `|---------|----------|------------|-------|\n`;

  analysis.versions
    .sort((a, b) => b.requests - a.requests)
    .forEach(v => {
      const trendEmoji = v.trend === 'growing' ? '📈' : v.trend === 'declining' ? '📉' : '➡️';
      report += `| ${v.version} | ${v.requests.toLocaleString()} | ${v.percentage}% | ${trendEmoji} ${v.trend} |\n`;
    });

  report += `\n`;

  return report;
}
