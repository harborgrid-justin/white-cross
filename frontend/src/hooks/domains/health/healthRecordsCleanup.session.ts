/**
 * WF-COMP-342 | healthRecordsCleanup.session.ts - Session monitoring for HIPAA compliance
 * Purpose: Session timeout monitoring and user activity tracking
 * Related: healthRecordsCleanup.ts, healthRecordsCleanup.types.ts
 * Exports: SessionMonitor class
 * Last Updated: 2025-11-04 | File Type: .ts
 */

import {
  SESSION_TIMEOUT_MS,
  INACTIVITY_WARNING_MS,
  type SessionMonitorOptions,
} from './healthRecordsCleanup.types';

// ============================================================================
// Session Monitor Class
// ============================================================================

export class SessionMonitor {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private options: Required<SessionMonitorOptions>;
  private activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

  constructor(options: SessionMonitorOptions = {}) {
    this.options = {
      timeoutMs: options.timeoutMs || SESSION_TIMEOUT_MS,
      warningMs: options.warningMs || INACTIVITY_WARNING_MS,
      onWarning: options.onWarning || (() => {}),
      onTimeout: options.onTimeout || (() => {}),
      onActivity: options.onActivity || (() => {}),
    };
  }

  /**
   * Start monitoring user activity
   */
  start(): void {
    this.resetTimers();
    this.attachActivityListeners();
    console.log('[Session Monitor] Started monitoring user activity');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.clearTimers();
    this.detachActivityListeners();
    console.log('[Session Monitor] Stopped monitoring user activity');
  }

  /**
   * Reset activity timers
   */
  private resetTimers(): void {
    this.clearTimers();

    // Set warning timer
    this.warningId = setTimeout(() => {
      const remainingTime = this.options.timeoutMs - this.options.warningMs;
      this.options.onWarning(remainingTime);
      console.log(`[Session Monitor] Inactivity warning: ${remainingTime}ms until timeout`);
    }, this.options.warningMs);

    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.options.onTimeout();
      console.log('[Session Monitor] Session timeout due to inactivity');
    }, this.options.timeoutMs);

    this.lastActivity = Date.now();
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Handle user activity
   */
  private handleActivity = (): void => {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;

    // Only reset if more than 1 second has passed (debounce)
    if (timeSinceLastActivity > 1000) {
      this.resetTimers();
      this.options.onActivity();
    }
  };

  /**
   * Attach activity event listeners
   */
  private attachActivityListeners(): void {
    this.activityEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Detach activity event listeners
   */
  private detachActivityListeners(): void {
    this.activityEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Get time until timeout
   */
  getTimeUntilTimeout(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.options.timeoutMs - elapsed);
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.getTimeUntilTimeout() > 0;
  }
}
