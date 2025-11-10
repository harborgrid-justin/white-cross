"use strict";
/**
 * @fileoverview API Versioning Utilities
 * @module core/api/versioning
 *
 * API versioning strategies including URL path versioning, header-based
 * versioning, and content negotiation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractApiVersion = extractApiVersion;
exports.createVersionRouter = createVersionRouter;
exports.createDeprecationMiddleware = createDeprecationMiddleware;
exports.isValidVersion = isValidVersion;
exports.compareVersions = compareVersions;
exports.getLatestVersion = getLatestVersion;
exports.createVersionNegotiator = createVersionNegotiator;
exports.createVersionRegistry = createVersionRegistry;
/**
 * Extracts API version from request based on strategy
 *
 * @param req - Express request object
 * @param strategy - Version extraction strategy
 * @param options - Additional options
 * @returns Extracted version string or null
 *
 * @example
 * ```typescript
 * const version = extractApiVersion(req, 'url');
 * // From URL: /api/v1/users -> 'v1'
 * ```
 */
function extractApiVersion(req, strategy = 'url', options = {}) {
    const { headerName = 'API-Version', queryParam = 'version' } = options;
    switch (strategy) {
        case 'url': {
            // Extract from URL path: /api/v1/users -> v1
            const match = req.path.match(/\/v(\d+(?:\.\d+)?)/);
            return match ? `v${match[1]}` : null;
        }
        case 'header': {
            // Extract from custom header
            const header = req.headers[headerName.toLowerCase()];
            return typeof header === 'string' ? header : null;
        }
        case 'accept': {
            // Extract from Accept header: application/vnd.api.v1+json
            const accept = req.headers.accept || '';
            const match = accept.match(/vnd\.api\.v(\d+(?:\.\d+)?)/);
            return match ? `v${match[1]}` : null;
        }
        case 'query': {
            // Extract from query parameter
            const version = req.query[queryParam];
            return typeof version === 'string' ? version : null;
        }
        default:
            return null;
    }
}
/**
 * Creates version routing middleware
 *
 * @param versions - Map of versions to handlers
 * @param options - Versioning options
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * const router = createVersionRouter({
 *   v1: handleV1Request,
 *   v2: handleV2Request
 * }, { strategy: 'url', defaultVersion: 'v2' });
 * ```
 */
function createVersionRouter(versions, options = {}) {
    const { strategy = 'url', defaultVersion, strict = false, headerName, queryParam, } = options;
    return (req, res, next) => {
        let version = extractApiVersion(req, strategy, { headerName, queryParam });
        // Use default version if none found
        if (!version && defaultVersion) {
            version = defaultVersion;
        }
        // Handle missing version
        if (!version) {
            if (strict) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'API version not specified',
                });
            }
            return next();
        }
        // Find and execute version handler
        const handler = versions[version];
        if (!handler) {
            return res.status(404).json({
                error: 'Not Found',
                message: `API version ${version} not found`,
                availableVersions: Object.keys(versions),
            });
        }
        // If handler is a router, pass control to it
        if (typeof handler === 'function') {
            return handler(req, res, next);
        }
        // If handler is an object (router), use it
        next();
    };
}
/**
 * Creates deprecation warning middleware
 *
 * @param config - Version configuration
 * @returns Express middleware function
 */
function createDeprecationMiddleware(config) {
    return (req, res, next) => {
        if (config.deprecated) {
            // Add deprecation headers
            res.setHeader('X-API-Deprecated', 'true');
            res.setHeader('X-API-Version', config.version);
            if (config.deprecationMessage) {
                res.setHeader('X-API-Deprecation-Message', config.deprecationMessage);
            }
            if (config.sunsetDate) {
                res.setHeader('Sunset', config.sunsetDate.toUTCString());
            }
            // Log deprecation warning
            console.warn(`[API Deprecation] Version ${config.version} accessed`, {
                path: req.path,
                method: req.method,
                sunsetDate: config.sunsetDate?.toISOString(),
            });
        }
        next();
    };
}
/**
 * Validates API version format
 *
 * @param version - Version string to validate
 * @returns True if version format is valid
 *
 * @example
 * ```typescript
 * isValidVersion('v1'); // true
 * isValidVersion('v1.2'); // true
 * isValidVersion('invalid'); // false
 * ```
 */
function isValidVersion(version) {
    return /^v\d+(\.\d+)*$/.test(version);
}
/**
 * Compares two API versions
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 *
 * @example
 * ```typescript
 * compareVersions('v1', 'v2'); // -1
 * compareVersions('v2.1', 'v2.0'); // 1
 * ```
 */
function compareVersions(version1, version2) {
    const v1Parts = version1.replace('v', '').split('.').map(Number);
    const v2Parts = version2.replace('v', '').split('.').map(Number);
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part < v2Part)
            return -1;
        if (v1Part > v2Part)
            return 1;
    }
    return 0;
}
/**
 * Gets the latest version from a list of versions
 *
 * @param versions - Array of version strings
 * @returns Latest version string
 *
 * @example
 * ```typescript
 * getLatestVersion(['v1', 'v2', 'v1.5']); // 'v2'
 * ```
 */
function getLatestVersion(versions) {
    if (versions.length === 0)
        return null;
    return versions.reduce((latest, current) => {
        return compareVersions(current, latest) > 0 ? current : latest;
    });
}
/**
 * Creates version negotiation middleware
 *
 * @param availableVersions - List of available versions
 * @param options - Versioning options
 * @returns Express middleware function
 */
function createVersionNegotiator(availableVersions, options = {}) {
    return (req, res, next) => {
        const requestedVersion = extractApiVersion(req, options.strategy || 'url', {
            headerName: options.headerName,
            queryParam: options.queryParam,
        });
        // Add version metadata to response
        res.setHeader('X-API-Available-Versions', availableVersions.join(', '));
        res.setHeader('X-API-Latest-Version', getLatestVersion(availableVersions) || '');
        if (requestedVersion) {
            res.setHeader('X-API-Version', requestedVersion);
        }
        next();
    };
}
/**
 * Creates a version registry for managing API versions
 *
 * @returns Version registry object
 */
function createVersionRegistry() {
    const versions = new Map();
    return {
        /**
         * Registers a new API version
         */
        register(metadata) {
            if (!isValidVersion(metadata.version)) {
                throw new Error(`Invalid version format: ${metadata.version}`);
            }
            versions.set(metadata.version, metadata);
        },
        /**
         * Gets metadata for a specific version
         */
        get(version) {
            return versions.get(version);
        },
        /**
         * Gets all registered versions
         */
        getAll() {
            return Array.from(versions.values()).sort((a, b) => compareVersions(a.version, b.version));
        },
        /**
         * Checks if a version is deprecated
         */
        isDeprecated(version) {
            return versions.get(version)?.deprecated ?? false;
        },
        /**
         * Gets all deprecated versions
         */
        getDeprecated() {
            return this.getAll().filter((v) => v.deprecated);
        },
        /**
         * Gets the latest version
         */
        getLatest() {
            const allVersions = this.getAll();
            return allVersions[allVersions.length - 1];
        },
    };
}
//# sourceMappingURL=versioning.js.map