/**
 * @fileoverview Type definitions for useRefresh hook
 * @module hooks/utilities/useRefresh/types
 */

/**
 * Configuration options for useRefresh hook
 */
export interface UseRefreshOptions {
  /**
   * Auto-refresh interval in milliseconds
   * Set to 0 or undefined to disable auto-refresh
   * @default undefined
   */
  interval?: number;

  /**
   * Only refresh when tab/window is visible
   * Pauses refresh when user navigates away
   * @default true
   */
  refreshWhenVisible?: boolean;

  /**
   * Callback function called after successful refresh
   */
  onRefreshSuccess?: () => void;

  /**
   * Callback function called if refresh fails
   */
  onRefreshError?: (error: Error) => void;

  /**
   * Enable debug logging for refresh operations
   * @default false
   */
  debug?: boolean;
}

/**
 * Return type for useRefresh hook
 */
export interface UseRefreshReturn {
  /**
   * Manually trigger a data refresh
   * Returns a promise that resolves when refresh completes
   */
  refresh: () => Promise<void>;

  /**
   * Whether a refresh is currently in progress
   */
  isRefreshing: boolean;

  /**
   * Timestamp of last successful refresh
   */
  lastRefreshed: Date | null;

  /**
   * Number of refresh operations performed
   */
  refreshCount: number;

  /**
   * Pause automatic refreshes (if interval is set)
   */
  pause: () => void;

  /**
   * Resume automatic refreshes (if interval is set)
   */
  resume: () => void;

  /**
   * Whether automatic refresh is currently paused
   */
  isPaused: boolean;
}
