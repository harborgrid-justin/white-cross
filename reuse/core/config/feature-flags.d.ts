/**
 * @fileoverview Feature Flags Management
 * @module core/config/feature-flags
 *
 * Feature flag management utilities for controlled feature rollouts,
 * A/B testing, and gradual deployments.
 */
/**
 * Feature flag configuration
 */
export interface FeatureFlagConfig {
    /** Flag is enabled */
    enabled: boolean;
    /** Rollout percentage (0-100) */
    rollout?: number;
    /** User segments that have access */
    segments?: string[];
    /** User IDs that have access */
    userIds?: string[];
    /** Environment restriction */
    environments?: string[];
    /** Start date */
    startDate?: Date;
    /** End date */
    endDate?: Date;
    /** Flag description */
    description?: string;
    /** Variant for A/B testing */
    variant?: string;
}
/**
 * Feature flag evaluation context
 */
export interface FeatureFlagContext {
    /** User ID */
    userId?: string;
    /** User segments */
    segments?: string[];
    /** Current environment */
    environment?: string;
    /** Additional custom properties */
    [key: string]: any;
}
/**
 * Feature flag service interface
 */
export interface FeatureFlagService {
    /** Checks if a flag is enabled */
    isEnabled(flag: string, context?: FeatureFlagContext): boolean;
    /** Gets flag variant */
    getVariant(flag: string, context?: FeatureFlagContext): string | null;
    /** Gets all enabled flags */
    getEnabledFlags(context?: FeatureFlagContext): string[];
    /** Registers a new flag */
    register(flag: string, config: FeatureFlagConfig): void;
    /** Updates a flag configuration */
    update(flag: string, config: Partial<FeatureFlagConfig>): void;
    /** Removes a flag */
    remove(flag: string): void;
}
/**
 * Creates a feature flag service
 *
 * @param flags - Initial feature flags configuration
 * @returns Feature flag service instance
 *
 * @example
 * ```typescript
 * const flags = createFeatureFlagService({
 *   newUI: { enabled: true, rollout: 50 },
 *   betaFeatures: { enabled: true, segments: ['beta-testers'] }
 * });
 *
 * if (flags.isEnabled('newUI', { userId: user.id })) {
 *   // Show new UI
 * }
 * ```
 */
export declare function createFeatureFlagService(flags?: Record<string, FeatureFlagConfig>): FeatureFlagService;
/**
 * Creates a feature flag middleware for Express
 *
 * @param service - Feature flag service
 * @param contextExtractor - Function to extract context from request
 * @returns Express middleware
 */
export declare function createFeatureFlagMiddleware(service: FeatureFlagService, contextExtractor?: (req: any) => FeatureFlagContext): any;
/**
 * Feature flag storage interface
 */
export interface FeatureFlagStorage {
    /** Loads all flags */
    load(): Promise<Record<string, FeatureFlagConfig>>;
    /** Saves all flags */
    save(flags: Record<string, FeatureFlagConfig>): Promise<void>;
}
/**
 * Creates a persistent feature flag service
 *
 * @param storage - Feature flag storage
 * @returns Feature flag service instance
 */
export declare function createPersistentFeatureFlagService(storage: FeatureFlagStorage): Promise<FeatureFlagService>;
/**
 * Creates a memory-based feature flag storage
 *
 * @returns Feature flag storage instance
 */
export declare function createMemoryFeatureFlagStorage(): FeatureFlagStorage;
/**
 * Feature flag evaluation result
 */
export interface FeatureFlagEvaluation {
    /** Flag name */
    flag: string;
    /** Enabled status */
    enabled: boolean;
    /** Variant */
    variant?: string;
    /** Reason for the result */
    reason: string;
}
/**
 * Evaluates a feature flag with detailed result
 *
 * @param service - Feature flag service
 * @param flag - Flag name
 * @param context - Evaluation context
 * @returns Detailed evaluation result
 */
export declare function evaluateFeatureFlag(service: FeatureFlagService, flag: string, context?: FeatureFlagContext): FeatureFlagEvaluation;
/**
 * Creates a feature flag decorator for class methods
 *
 * @param service - Feature flag service
 * @param flag - Flag name
 * @param fallback - Fallback function if flag is disabled
 * @returns Method decorator
 */
export declare function withFeatureFlag(service: FeatureFlagService, flag: string, fallback?: (...args: any[]) => any): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Exports feature flags for analysis
 *
 * @param service - Feature flag service
 * @param context - Evaluation context
 * @returns Array of flag evaluations
 */
export declare function exportFeatureFlags(service: FeatureFlagService, context?: FeatureFlagContext): FeatureFlagEvaluation[];
//# sourceMappingURL=feature-flags.d.ts.map