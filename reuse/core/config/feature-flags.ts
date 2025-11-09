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
export function createFeatureFlagService(
  flags: Record<string, FeatureFlagConfig> = {}
): FeatureFlagService {
  const flagStore = new Map<string, FeatureFlagConfig>(Object.entries(flags));

  return {
    isEnabled(flag: string, context: FeatureFlagContext = {}): boolean {
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
        const hasSegment = context.segments.some((segment) =>
          config.segments!.includes(segment)
        );
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
        } else {
          // Random rollout if no user ID
          return Math.random() * 100 < config.rollout;
        }
      }

      // Default to enabled if no restrictions apply
      return config.userIds || config.segments ? false : true;
    },

    getVariant(flag: string, context: FeatureFlagContext = {}): string | null {
      const config = flagStore.get(flag);
      if (!config || !this.isEnabled(flag, context)) {
        return null;
      }

      return config.variant || null;
    },

    getEnabledFlags(context: FeatureFlagContext = {}): string[] {
      const enabled: string[] = [];

      for (const [flag] of flagStore) {
        if (this.isEnabled(flag, context)) {
          enabled.push(flag);
        }
      }

      return enabled;
    },

    register(flag: string, config: FeatureFlagConfig): void {
      flagStore.set(flag, config);
    },

    update(flag: string, config: Partial<FeatureFlagConfig>): void {
      const existing = flagStore.get(flag);
      if (!existing) {
        throw new Error(`Feature flag ${flag} not found`);
      }

      flagStore.set(flag, { ...existing, ...config });
    },

    remove(flag: string): void {
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
function hashUserId(userId: string): number {
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
export function createFeatureFlagMiddleware(
  service: FeatureFlagService,
  contextExtractor?: (req: any) => FeatureFlagContext
): any {
  return (req: any, res: any, next: any) => {
    const context = contextExtractor ? contextExtractor(req) : {};

    req.featureFlags = {
      isEnabled: (flag: string) => service.isEnabled(flag, context),
      getVariant: (flag: string) => service.getVariant(flag, context),
      getEnabledFlags: () => service.getEnabledFlags(context),
    };

    next();
  };
}

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
export async function createPersistentFeatureFlagService(
  storage: FeatureFlagStorage
): Promise<FeatureFlagService> {
  const flags = await storage.load();
  const service = createFeatureFlagService(flags);

  // Wrap methods to persist changes
  const originalRegister = service.register.bind(service);
  const originalUpdate = service.update.bind(service);
  const originalRemove = service.remove.bind(service);

  service.register = (flag: string, config: FeatureFlagConfig) => {
    originalRegister(flag, config);
    void persistFlags(service, storage);
  };

  service.update = (flag: string, config: Partial<FeatureFlagConfig>) => {
    originalUpdate(flag, config);
    void persistFlags(service, storage);
  };

  service.remove = (flag: string) => {
    originalRemove(flag);
    void persistFlags(service, storage);
  };

  return service;
}

/**
 * Persists feature flags to storage
 */
async function persistFlags(
  service: FeatureFlagService,
  storage: FeatureFlagStorage
): Promise<void> {
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
export function createMemoryFeatureFlagStorage(): FeatureFlagStorage {
  let flags: Record<string, FeatureFlagConfig> = {};

  return {
    async load(): Promise<Record<string, FeatureFlagConfig>> {
      return { ...flags };
    },

    async save(newFlags: Record<string, FeatureFlagConfig>): Promise<void> {
      flags = { ...newFlags };
    },
  };
}

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
export function evaluateFeatureFlag(
  service: FeatureFlagService,
  flag: string,
  context: FeatureFlagContext = {}
): FeatureFlagEvaluation {
  const enabled = service.isEnabled(flag, context);
  const variant = service.getVariant(flag, context);

  let reason = 'Flag not found';

  if (enabled) {
    reason = 'Flag is enabled';
    if (variant) {
      reason += ` with variant: ${variant}`;
    }
  } else {
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
export function withFeatureFlag(
  service: FeatureFlagService,
  flag: string,
  fallback?: (...args: any[]) => any
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const context: FeatureFlagContext = {
        // Extract context from 'this' if available
        userId: (this as any).userId,
        segments: (this as any).segments,
        environment: process.env.NODE_ENV,
      };

      if (service.isEnabled(flag, context)) {
        return originalMethod.apply(this, args);
      } else if (fallback) {
        return fallback.apply(this, args);
      } else {
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
export function exportFeatureFlags(
  service: FeatureFlagService,
  context: FeatureFlagContext = {}
): FeatureFlagEvaluation[] {
  const enabledFlags = service.getEnabledFlags(context);

  return enabledFlags.map((flag) => evaluateFeatureFlag(service, flag, context));
}
