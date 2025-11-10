"use strict";
/**
 * @fileoverview Feature Flags Management
 * @module core/config/feature-flags
 *
 * Feature flag management utilities for controlled feature rollouts,
 * A/B testing, and gradual deployments.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeatureFlagService = createFeatureFlagService;
exports.createFeatureFlagMiddleware = createFeatureFlagMiddleware;
exports.createPersistentFeatureFlagService = createPersistentFeatureFlagService;
exports.createMemoryFeatureFlagStorage = createMemoryFeatureFlagStorage;
exports.evaluateFeatureFlag = evaluateFeatureFlag;
exports.withFeatureFlag = withFeatureFlag;
exports.exportFeatureFlags = exportFeatureFlags;
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
function createFeatureFlagService(flags = {}) {
    const flagStore = new Map(Object.entries(flags));
    return {
        isEnabled(flag, context = {}) {
            const config = flagStore.get(flag);
            if (!config) {
                return false;
            }
            // Check if flag is globally enabled
            if (!config.enabled) {
                return false;
            }
            // Check environment restriction
            if (config.environments && context.environment) {
                if (!config.environments.includes(context.environment)) {
                    return false;
                }
            }
            // Check date range
            const now = new Date();
            if (config.startDate && now < config.startDate) {
                return false;
            }
            if (config.endDate && now > config.endDate) {
                return false;
            }
            // Check user ID whitelist
            if (config.userIds && context.userId) {
                if (config.userIds.includes(context.userId)) {
                    return true;
                }
            }
            // Check segment access
            if (config.segments && context.segments) {
                const hasSegment = context.segments.some((segment) => config.segments.includes(segment));
                if (hasSegment) {
                    return true;
                }
            }
            // Check rollout percentage
            if (config.rollout !== undefined) {
                if (context.userId) {
                    // Use consistent hashing for user-based rollout
                    const hash = hashUserId(context.userId);
                    const percentage = hash % 100;
                    return percentage < config.rollout;
                }
                else {
                    // Random rollout if no user ID
                    return Math.random() * 100 < config.rollout;
                }
            }
            // Default to enabled if no restrictions apply
            return config.userIds || config.segments ? false : true;
        },
        getVariant(flag, context = {}) {
            const config = flagStore.get(flag);
            if (!config || !this.isEnabled(flag, context)) {
                return null;
            }
            return config.variant || null;
        },
        getEnabledFlags(context = {}) {
            const enabled = [];
            for (const [flag] of flagStore) {
                if (this.isEnabled(flag, context)) {
                    enabled.push(flag);
                }
            }
            return enabled;
        },
        register(flag, config) {
            flagStore.set(flag, config);
        },
        update(flag, config) {
            const existing = flagStore.get(flag);
            if (!existing) {
                throw new Error(`Feature flag ${flag} not found`);
            }
            flagStore.set(flag, { ...existing, ...config });
        },
        remove(flag) {
            flagStore.delete(flag);
        },
    };
}
/**
 * Hashes user ID for consistent rollout
 *
 * @param userId - User ID to hash
 * @returns Hash value (0-99)
 */
function hashUserId(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash % 100);
}
/**
 * Creates a feature flag middleware for Express
 *
 * @param service - Feature flag service
 * @param contextExtractor - Function to extract context from request
 * @returns Express middleware
 */
function createFeatureFlagMiddleware(service, contextExtractor) {
    return (req, res, next) => {
        const context = contextExtractor ? contextExtractor(req) : {};
        req.featureFlags = {
            isEnabled: (flag) => service.isEnabled(flag, context),
            getVariant: (flag) => service.getVariant(flag, context),
            getEnabledFlags: () => service.getEnabledFlags(context),
        };
        next();
    };
}
/**
 * Creates a persistent feature flag service
 *
 * @param storage - Feature flag storage
 * @returns Feature flag service instance
 */
async function createPersistentFeatureFlagService(storage) {
    const flags = await storage.load();
    const service = createFeatureFlagService(flags);
    // Wrap methods to persist changes
    const originalRegister = service.register.bind(service);
    const originalUpdate = service.update.bind(service);
    const originalRemove = service.remove.bind(service);
    service.register = (flag, config) => {
        originalRegister(flag, config);
        void persistFlags(service, storage);
    };
    service.update = (flag, config) => {
        originalUpdate(flag, config);
        void persistFlags(service, storage);
    };
    service.remove = (flag) => {
        originalRemove(flag);
        void persistFlags(service, storage);
    };
    return service;
}
/**
 * Persists feature flags to storage
 */
async function persistFlags(service, storage) {
    // This is a simplified implementation
    // In a real scenario, you would need to serialize the flags from the service
    // For now, this is a placeholder
    console.log('Persisting feature flags...');
}
/**
 * Creates a memory-based feature flag storage
 *
 * @returns Feature flag storage instance
 */
function createMemoryFeatureFlagStorage() {
    let flags = {};
    return {
        async load() {
            return { ...flags };
        },
        async save(newFlags) {
            flags = { ...newFlags };
        },
    };
}
/**
 * Evaluates a feature flag with detailed result
 *
 * @param service - Feature flag service
 * @param flag - Flag name
 * @param context - Evaluation context
 * @returns Detailed evaluation result
 */
function evaluateFeatureFlag(service, flag, context = {}) {
    const enabled = service.isEnabled(flag, context);
    const variant = service.getVariant(flag, context);
    let reason = 'Flag not found';
    if (enabled) {
        reason = 'Flag is enabled';
        if (variant) {
            reason += ` with variant: ${variant}`;
        }
    }
    else {
        reason = 'Flag is disabled or conditions not met';
    }
    return {
        flag,
        enabled,
        variant: variant || undefined,
        reason,
    };
}
/**
 * Creates a feature flag decorator for class methods
 *
 * @param service - Feature flag service
 * @param flag - Flag name
 * @param fallback - Fallback function if flag is disabled
 * @returns Method decorator
 */
function withFeatureFlag(service, flag, fallback) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const context = {
                // Extract context from 'this' if available
                userId: this.userId,
                segments: this.segments,
                environment: process.env.NODE_ENV,
            };
            if (service.isEnabled(flag, context)) {
                return originalMethod.apply(this, args);
            }
            else if (fallback) {
                return fallback.apply(this, args);
            }
            else {
                throw new Error(`Feature ${flag} is not enabled`);
            }
        };
        return descriptor;
    };
}
/**
 * Exports feature flags for analysis
 *
 * @param service - Feature flag service
 * @param context - Evaluation context
 * @returns Array of flag evaluations
 */
function exportFeatureFlags(service, context = {}) {
    const enabledFlags = service.getEnabledFlags(context);
    return enabledFlags.map((flag) => evaluateFeatureFlag(service, flag, context));
}
//# sourceMappingURL=feature-flags.js.map