/**
 * @fileoverview Activity Tracking Module
 * @module services/security/tokenManager/activityTracker
 * @category Security - Token Management
 */

import { SECURITY_CONFIG } from '../../../constants/config';
import { TokenStorage } from './storage';
import { TokenValidator } from './validation';

/**
 * Session activity tracking and automatic cleanup
 * 
 * Manages session timeout monitoring, automatic token expiration cleanup,
 * and activity-based session extension for HIPAA-compliant session management.
 */
export class ActivityTracker {
  private static instance: ActivityTracker | null = null;
  private cleanupInterval: number | null = null;
  private readonly CLEANUP_INTERVAL_MS = 60 * 1000; // 60 seconds

  private constructor() {
    this.initializeCleanup();
  }

  /**
   * Get singleton instance of ActivityTracker
   * 
   * @returns Singleton instance of ActivityTracker
   */
  static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker();
    }
    return ActivityTracker.instance;
  }

  /**
   * Initialize automatic cleanup interval for expired token detection
   * 
   * Establishes a recurring check every 60 seconds to validate token status
   * and automatically clear expired tokens. Also registers window unload
   * handler to cleanup resources on browser close.
   * 
   * Security Benefits:
   * - Automatic removal of expired tokens prevents unauthorized access
   * - Prevents memory leaks from orphaned tokens
   * - Ensures timely session termination on inactivity
   * 
   * HIPAA Compliance:
   * - Enforces automatic session timeout requirements
   * - Prevents access after session expiration
   * - Implements defense-in-depth for PHI protection
   */
  private initializeCleanup(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check for expired tokens every minute
    this.cleanupInterval = window.setInterval(() => {
      this.performCleanupCheck();
    }, this.CLEANUP_INTERVAL_MS);

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Additional cleanup events for better session management
    window.addEventListener('pagehide', () => {
      this.cleanup();
    });

    // Track user activity events
    this.initializeActivityMonitoring();
  }

  /**
   * Initialize user activity monitoring
   * 
   * Sets up event listeners to detect user activity and update session
   * timestamps. This extends the inactivity timeout window when users
   * are actively using the application.
   */
  private initializeActivityMonitoring(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle activity updates to prevent excessive storage writes
    let lastActivityUpdate = 0;
    const ACTIVITY_UPDATE_THROTTLE = 30 * 1000; // 30 seconds

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate >= ACTIVITY_UPDATE_THROTTLE) {
        this.updateActivity();
        lastActivityUpdate = now;
      }
    };

    // Add event listeners
    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, handleActivity, { passive: true });
    });

    // Also monitor API requests as activity
    this.initializeApiActivityMonitoring();
  }

  /**
   * Initialize API request activity monitoring
   * 
   * Monitors fetch requests and XMLHttpRequests to track API activity
   * as user activity for session extension.
   */
  private initializeApiActivityMonitoring(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      this.updateActivity();
      return originalFetch.apply(window, args);
    };

    // Monitor XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      ActivityTracker.getInstance().updateActivity();
      return originalOpen.call(this, method, url, async ?? true, username, password);
    };
  }

  /**
   * Perform automatic cleanup check
   * 
   * Called by the cleanup interval to check for expired tokens and
   * perform automatic cleanup when necessary.
   */
  private performCleanupCheck(): void {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      
      if (!metadata) {
        // No tokens to check
        return;
      }

      const validationResult = TokenValidator.validateToken(metadata);
      
      if (!validationResult.isValid) {
        console.info(`[ActivityTracker] Automatic cleanup triggered: ${validationResult.reason}`);
        TokenStorage.clearAllTokens();
        
        // Emit custom event for application to handle session expiration
        this.emitSessionExpiredEvent(validationResult.reason || 'unknown');
      }
    } catch (error) {
      console.error('[ActivityTracker] Error during cleanup check:', error);
    }
  }

  /**
   * Emit session expired event for application handling
   * 
   * @param reason - Reason for session expiration
   */
  private emitSessionExpiredEvent(reason: string): void {
    if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') {
      return;
    }

    try {
      const event = new CustomEvent('tokenSessionExpired', {
        detail: { reason },
      });
      
      window.dispatchEvent(event);
    } catch (error) {
      console.warn('[ActivityTracker] Failed to emit session expired event:', error);
    }
  }

  /**
   * Update last activity timestamp
   * 
   * Updates the lastActivity field in token metadata to current time.
   * Called automatically on user activity events and can be called
   * manually to extend session timeout.
   */
  updateActivity(): void {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      if (!metadata) {
        return;
      }

      // Only update if token is still valid
      if (!TokenValidator.isTokenValid(metadata)) {
        return;
      }

      const updatedMetadata = TokenValidator.updateActivity(metadata);
      TokenStorage.updateTokenMetadata(updatedMetadata);
    } catch (error) {
      console.error('[ActivityTracker] Failed to update activity:', error);
    }
  }

  /**
   * Get current activity status
   * 
   * @returns Object with current activity timing information
   */
  getActivityStatus(): {
    isActive: boolean;
    timeSinceActivity: number;
    timeUntilInactivityTimeout: number;
    timeUntilExpiration: number;
    warningLevel: 'none' | 'approaching' | 'critical';
  } {
    const metadata = TokenStorage.getTokenMetadata();
    
    if (!metadata) {
      return {
        isActive: false,
        timeSinceActivity: 0,
        timeUntilInactivityTimeout: 0,
        timeUntilExpiration: 0,
        warningLevel: 'none',
      };
    }

    const timeSinceActivity = TokenValidator.getTimeSinceActivity(metadata);
    const timeUntilExpiration = TokenValidator.getTimeUntilExpiration(metadata);
    const timeUntilInactivityTimeout = SECURITY_CONFIG.INACTIVITY_TIMEOUT - timeSinceActivity;

    // Determine warning level
    let warningLevel: 'none' | 'approaching' | 'critical' = 'none';
    
    if (timeUntilInactivityTimeout <= 5 * 60 * 1000) { // 5 minutes
      warningLevel = 'critical';
    } else if (timeUntilInactivityTimeout <= 15 * 60 * 1000) { // 15 minutes
      warningLevel = 'approaching';
    }

    return {
      isActive: TokenValidator.isTokenValid(metadata),
      timeSinceActivity,
      timeUntilInactivityTimeout: Math.max(0, timeUntilInactivityTimeout),
      timeUntilExpiration,
      warningLevel,
    };
  }

  /**
   * Check if session warning should be displayed
   * 
   * @param warningThresholdMs - Warning threshold in milliseconds (default: 15 minutes)
   * @returns True if warning should be displayed
   */
  shouldShowSessionWarning(warningThresholdMs: number = 15 * 60 * 1000): boolean {
    const metadata = TokenStorage.getTokenMetadata();
    
    if (!metadata || !TokenValidator.isTokenValid(metadata)) {
      return false;
    }

    return TokenValidator.isApproachingInactivityTimeout(metadata, warningThresholdMs);
  }

  /**
   * Force refresh session activity
   * 
   * Manually updates activity timestamp to extend session.
   * Useful for "keep session alive" functionality.
   */
  refreshSession(): boolean {
    try {
      const metadata = TokenStorage.getTokenMetadata();
      
      if (!metadata || !TokenValidator.isTokenValid(metadata)) {
        return false;
      }

      this.updateActivity();
      console.info('[ActivityTracker] Session refreshed manually');
      return true;
    } catch (error) {
      console.error('[ActivityTracker] Failed to refresh session:', error);
      return false;
    }
  }

  /**
   * Start session timeout warning notifications
   * 
   * @param warningCallback - Callback function called when warnings should be shown
   * @param checkIntervalMs - How often to check (default: 30 seconds)
   * @returns Cleanup function to stop notifications
   */
  startSessionWarnings(
    warningCallback: (status: ReturnType<ActivityTracker['getActivityStatus']>) => void,
    checkIntervalMs: number = 30 * 1000
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const interval = window.setInterval(() => {
      const status = this.getActivityStatus();
      
      if (status.isActive && status.warningLevel !== 'none') {
        warningCallback(status);
      }
    }, checkIntervalMs);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }

  /**
   * Cleanup resources
   * 
   * Stops automatic cleanup interval and releases resources.
   * Called automatically on window unload.
   */
  cleanup(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Reset and reinitialize activity tracker
   * 
   * Useful for testing or when recreating the tracker instance.
   */
  reset(): void {
    this.cleanup();
    ActivityTracker.instance = null;
  }
}

/**
 * Singleton instance of ActivityTracker
 * Use this throughout the application for activity tracking
 * 
 * @example
 * ```typescript
 * import { activityTracker } from '@/services/security/tokenManager/activityTracker';
 * 
 * // Get activity status
 * const status = activityTracker.getActivityStatus();
 * 
 * // Manually refresh session
 * activityTracker.refreshSession();
 * 
 * // Set up session warnings
 * const stopWarnings = activityTracker.startSessionWarnings((status) => {
 *   if (status.warningLevel === 'critical') {
 *     showSessionExpirationDialog();
 *   }
 * });
 * ```
 */
export const activityTracker = ActivityTracker.getInstance();
