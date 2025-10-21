/**
 * White Cross Healthcare Platform - Feature Flags System
 *
 * Centralized feature flag management for gradual rollouts, A/B testing,
 * and environment-specific features.
 */

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environments?: ('development' | 'staging' | 'production')[];
  rolloutPercentage?: number;
  enabledForUsers?: string[];
  enabledForRoles?: string[];
  dependsOn?: string[];
  deprecatedAt?: string;
  removedAt?: string;
}

export interface FeatureFlagConfig {
  [key: string]: FeatureFlag;
}

/**
 * Feature Flags Configuration
 *
 * Add new features here with appropriate settings.
 * Use environment variables to override defaults in different environments.
 */
export const featureFlags: FeatureFlagConfig = {
  // Core Features
  enableApiDocs: {
    key: 'enableApiDocs',
    name: 'API Documentation',
    description: 'Enable Swagger/OpenAPI documentation endpoints',
    enabled: import.meta.env.VITE_ENABLE_API_DOCS === 'true' || import.meta.env.DEV,
    environments: ['development', 'staging'],
  },

  enableDebugMode: {
    key: 'enableDebugMode',
    name: 'Debug Mode',
    description: 'Enable debug tools and verbose logging',
    enabled: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true' || import.meta.env.DEV,
    environments: ['development'],
  },

  enableMockData: {
    key: 'enableMockData',
    name: 'Mock Data',
    description: 'Use mock data for testing instead of real API calls',
    enabled: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    environments: ['development'],
  },

  // Healthcare Features
  enableAdvancedHealthRecords: {
    key: 'enableAdvancedHealthRecords',
    name: 'Advanced Health Records',
    description: 'Enable advanced health records features including AI-powered insights',
    enabled: import.meta.env.VITE_ENABLE_ADVANCED_HEALTH_RECORDS === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },

  enableTelehealthIntegration: {
    key: 'enableTelehealthIntegration',
    name: 'Telehealth Integration',
    description: 'Enable telehealth appointment scheduling and video consultations',
    enabled: import.meta.env.VITE_ENABLE_TELEHEALTH === 'true',
    rolloutPercentage: 50,
    environments: ['staging', 'production'],
  },

  enableMedicationReminders: {
    key: 'enableMedicationReminders',
    name: 'Medication Reminders',
    description: 'Enable automated medication reminder notifications',
    enabled: import.meta.env.VITE_ENABLE_MEDICATION_REMINDERS === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },

  enableHealthAnalytics: {
    key: 'enableHealthAnalytics',
    name: 'Health Analytics Dashboard',
    description: 'Enable advanced analytics and reporting for health data',
    enabled: import.meta.env.VITE_ENABLE_HEALTH_ANALYTICS === 'true',
    rolloutPercentage: 75,
    environments: ['staging', 'production'],
    enabledForRoles: ['nurse', 'administrator', 'district_admin'],
  },

  // Communication Features
  enableEmergencyNotifications: {
    key: 'enableEmergencyNotifications',
    name: 'Emergency Notifications',
    description: 'Enable emergency notification system with SMS/Email',
    enabled: import.meta.env.VITE_ENABLE_EMERGENCY_NOTIFICATIONS === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },

  enableBulkCommunication: {
    key: 'enableBulkCommunication',
    name: 'Bulk Communication',
    description: 'Enable bulk SMS and email communication features',
    enabled: import.meta.env.VITE_ENABLE_BULK_COMMUNICATION === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
    enabledForRoles: ['nurse', 'administrator', 'district_admin'],
  },

  // Compliance Features
  enableAuditLogging: {
    key: 'enableAuditLogging',
    name: 'Audit Logging',
    description: 'Enable comprehensive audit logging for HIPAA compliance',
    enabled: true,
    environments: ['development', 'staging', 'production'],
  },

  enableAccessControlUI: {
    key: 'enableAccessControlUI',
    name: 'Access Control UI',
    description: 'Enable UI for role-based access control management',
    enabled: import.meta.env.VITE_ENABLE_ACCESS_CONTROL_UI === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
    enabledForRoles: ['administrator', 'district_admin'],
  },

  // Integration Features
  enableThirdPartyIntegrations: {
    key: 'enableThirdPartyIntegrations',
    name: 'Third-Party Integrations',
    description: 'Enable integrations with external healthcare systems',
    enabled: import.meta.env.VITE_ENABLE_INTEGRATIONS === 'true',
    rolloutPercentage: 50,
    environments: ['staging', 'production'],
  },

  enableFHIRExport: {
    key: 'enableFHIRExport',
    name: 'FHIR Export',
    description: 'Enable FHIR-compliant data export functionality',
    enabled: import.meta.env.VITE_ENABLE_FHIR_EXPORT === 'true',
    rolloutPercentage: 25,
    environments: ['staging'],
  },

  // Performance Features
  enableOfflineMode: {
    key: 'enableOfflineMode',
    name: 'Offline Mode',
    description: 'Enable offline capability with data synchronization',
    enabled: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
    rolloutPercentage: 10,
    environments: ['staging'],
  },

  enableProgressiveWebApp: {
    key: 'enableProgressiveWebApp',
    name: 'Progressive Web App',
    description: 'Enable PWA features including install prompts',
    enabled: import.meta.env.VITE_ENABLE_PWA === 'true',
    rolloutPercentage: 100,
    environments: ['staging', 'production'],
  },

  // Experimental Features
  enableAIAssistant: {
    key: 'enableAIAssistant',
    name: 'AI Assistant',
    description: 'Enable AI-powered virtual assistant for nurses',
    enabled: import.meta.env.VITE_ENABLE_AI_ASSISTANT === 'true',
    rolloutPercentage: 5,
    environments: ['staging'],
    enabledForUsers: [], // Will be populated with beta tester IDs
  },

  enablePredictiveAnalytics: {
    key: 'enablePredictiveAnalytics',
    name: 'Predictive Analytics',
    description: 'Enable ML-powered predictive health analytics',
    enabled: import.meta.env.VITE_ENABLE_PREDICTIVE_ANALYTICS === 'true',
    rolloutPercentage: 0,
    environments: ['staging'],
  },
};

/**
 * Feature Flag Evaluation
 */
class FeatureFlagService {
  private flags: FeatureFlagConfig;
  private environment: string;
  private userId?: string;
  private userRoles?: string[];

  constructor() {
    this.flags = featureFlags;
    this.environment = import.meta.env.VITE_ENV || 'development';
  }

  /**
   * Set current user context for feature flag evaluation
   */
  setUserContext(userId: string, roles: string[]) {
    this.userId = userId;
    this.userRoles = roles;
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(flagKey: string): boolean {
    const flag = this.flags[flagKey];

    if (!flag) {
      console.warn(`Feature flag "${flagKey}" not found`);
      return false;
    }

    // Check if flag is globally enabled
    if (!flag.enabled) {
      return false;
    }

    // Check environment restrictions
    if (flag.environments && !flag.environments.includes(this.environment as any)) {
      return false;
    }

    // Check dependencies
    if (flag.dependsOn) {
      for (const dependency of flag.dependsOn) {
        if (!this.isEnabled(dependency)) {
          return false;
        }
      }
    }

    // Check deprecation
    if (flag.deprecatedAt) {
      const deprecatedDate = new Date(flag.deprecatedAt);
      if (new Date() > deprecatedDate) {
        console.warn(`Feature flag "${flagKey}" is deprecated as of ${flag.deprecatedAt}`);
      }
    }

    // Check if feature should be removed
    if (flag.removedAt) {
      const removedDate = new Date(flag.removedAt);
      if (new Date() > removedDate) {
        console.error(`Feature flag "${flagKey}" should have been removed on ${flag.removedAt}`);
        return false;
      }
    }

    // Check user-specific enablement
    if (flag.enabledForUsers && this.userId) {
      return flag.enabledForUsers.includes(this.userId);
    }

    // Check role-based enablement
    if (flag.enabledForRoles && this.userRoles) {
      const hasRequiredRole = flag.enabledForRoles.some(role =>
        this.userRoles?.includes(role)
      );
      if (!hasRequiredRole) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      // Use user ID for consistent rollout if available
      if (this.userId) {
        const hash = this.hashString(this.userId + flagKey);
        return (hash % 100) < flag.rolloutPercentage;
      }
      // Random rollout if no user ID
      return Math.random() * 100 < flag.rolloutPercentage;
    }

    return true;
  }

  /**
   * Get all enabled feature flags
   */
  getEnabledFlags(): string[] {
    return Object.keys(this.flags).filter(key => this.isEnabled(key));
  }

  /**
   * Get feature flag details
   */
  getFlag(flagKey: string): FeatureFlag | undefined {
    return this.flags[flagKey];
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlagConfig {
    return this.flags;
  }

  /**
   * Simple string hash function for consistent user-based rollouts
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Override a feature flag (useful for testing)
   */
  override(flagKey: string, enabled: boolean) {
    if (this.flags[flagKey]) {
      this.flags[flagKey] = {
        ...this.flags[flagKey],
        enabled,
      };
    }
  }

  /**
   * Reset all overrides
   */
  resetOverrides() {
    this.flags = { ...featureFlags };
  }
}

// Export singleton instance
export const featureFlagService = new FeatureFlagService();

/**
 * React hook for feature flags
 */
export function useFeatureFlag(flagKey: string): boolean {
  return featureFlagService.isEnabled(flagKey);
}

/**
 * HOC for feature flag gating
 */
export function withFeatureFlag<P extends object>(
  flagKey: string,
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const isEnabled = useFeatureFlag(flagKey);

    if (isEnabled) {
      return <Component {...props} />;
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return null;
  };
}

export default featureFlagService;
