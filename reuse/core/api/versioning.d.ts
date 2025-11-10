/**
 * @fileoverview API Versioning Utilities
 * @module core/api/versioning
 *
 * API versioning strategies including URL path versioning, header-based
 * versioning, and content negotiation.
 */
import type { Request, RequestHandler } from 'express';
/**
 * API version configuration
 */
export interface VersionConfig {
    /** Version number */
    version: string;
    /** Version handler */
    handler: RequestHandler | any;
    /** Deprecated flag */
    deprecated?: boolean;
    /** Deprecation message */
    deprecationMessage?: string;
    /** Sunset date (when version will be removed) */
    sunsetDate?: Date;
}
/**
 * Version extraction strategy
 */
export type VersionStrategy = 'url' | 'header' | 'accept' | 'query';
/**
 * Versioning middleware options
 */
export interface VersioningOptions {
    /** Version extraction strategy */
    strategy?: VersionStrategy;
    /** Header name for header-based versioning */
    headerName?: string;
    /** Query parameter name for query-based versioning */
    queryParam?: string;
    /** Default version if none specified */
    defaultVersion?: string;
    /** Strict mode (fail if version not found) */
    strict?: boolean;
}
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
export declare function extractApiVersion(req: Request, strategy?: VersionStrategy, options?: Pick<VersioningOptions, 'headerName' | 'queryParam'>): string | null;
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
export declare function createVersionRouter(versions: Record<string, RequestHandler | any>, options?: VersioningOptions): RequestHandler;
/**
 * Creates deprecation warning middleware
 *
 * @param config - Version configuration
 * @returns Express middleware function
 */
export declare function createDeprecationMiddleware(config: VersionConfig): RequestHandler;
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
export declare function isValidVersion(version: string): boolean;
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
export declare function compareVersions(version1: string, version2: string): number;
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
export declare function getLatestVersion(versions: string[]): string | null;
/**
 * Creates version negotiation middleware
 *
 * @param availableVersions - List of available versions
 * @param options - Versioning options
 * @returns Express middleware function
 */
export declare function createVersionNegotiator(availableVersions: string[], options?: VersioningOptions): RequestHandler;
/**
 * Version metadata type
 */
export interface VersionMetadata {
    version: string;
    deprecated: boolean;
    sunsetDate?: Date;
    released: Date;
    changes?: string[];
}
/**
 * Creates a version registry for managing API versions
 *
 * @returns Version registry object
 */
export declare function createVersionRegistry(): {
    /**
     * Registers a new API version
     */
    register(metadata: VersionMetadata): void;
    /**
     * Gets metadata for a specific version
     */
    get(version: string): VersionMetadata | undefined;
    /**
     * Gets all registered versions
     */
    getAll(): VersionMetadata[];
    /**
     * Checks if a version is deprecated
     */
    isDeprecated(version: string): boolean;
    /**
     * Gets all deprecated versions
     */
    getDeprecated(): VersionMetadata[];
    /**
     * Gets the latest version
     */
    getLatest(): VersionMetadata | undefined;
};
//# sourceMappingURL=versioning.d.ts.map