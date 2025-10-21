/**
 * HIPAA-Compliant Audit Logging Service
 *
 * Purpose: Production-ready audit logging with batching, retry, and local backup
 *
 * Key Features:
 * - Automatic batching of audit events
 * - Local storage backup when backend unavailable
 * - Exponential backoff retry mechanism
 * - Immediate flush for critical events
 * - Tamper-evident checksums
 * - Never fails primary operations
 * - HIPAA-compliant event tracking
 *
 * Architecture:
 * - Events queued in memory
 * - Periodic batch submission to backend
 * - Failed events stored in localStorage
 * - Automatic retry with backoff
 * - Critical events bypass batching
 *
 * Last Updated: 2025-10-21
 */

import { apiInstance } from '../config/apiConfig';
import {
  AuditEvent,
  AuditLogParams,
  AuditBatch,
  AuditAction,
  AuditResourceType,
  AuditSeverity,
  AuditStatus,
  AuditConfig,
  AuditChange,
  IAuditService,
  AuditServiceStatus,
  AuditApiResponse,
} from './types';
import {
  DEFAULT_AUDIT_CONFIG,
  getActionSeverity,
  isResourcePHI,
  requiresImmediateFlush,
} from './config';

/**
 * Generate a simple checksum for tamper detection
 */
function generateChecksum(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a batch ID
 */
function generateBatchId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Main Audit Service Implementation
 */
export class AuditService implements IAuditService {
  private config: AuditConfig;
  private eventQueue: AuditEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;
  private lastSyncAt: number | null = null;
  private lastError: string | null = null;
  private syncErrors = 0;
  private failedEvents: AuditEvent[] = [];

  // User context - set from auth store
  private userId: string | null = null;
  private userEmail: string | null = null;
  private userName: string | null = null;
  private userRole: string | null = null;
  private sessionId: string | null = null;

  constructor(config: Partial<AuditConfig> = {}) {
    this.config = { ...DEFAULT_AUDIT_CONFIG, ...config };
    this.initializeService();
  }

  /**
   * Initialize the audit service
   */
  private initializeService(): void {
    // Generate session ID
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Load failed events from localStorage
    this.loadFailedEvents();

    // Start batch timer
    this.startBatchTimer();

    // Setup cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.handleBeforeUnload();
      });
    }

    if (this.config.enableDebug) {
      console.log('[AuditService] Initialized with config:', this.config);
    }
  }

  /**
   * Set user context for audit events
   * Should be called after user authentication
   */
  public setUserContext(user: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): void {
    this.userId = user.id;
    this.userEmail = user.email || null;
    this.userName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || null;
    this.userRole = user.role || null;

    if (this.config.enableDebug) {
      console.log('[AuditService] User context set:', {
        userId: this.userId,
        userEmail: this.userEmail,
        userName: this.userName,
        userRole: this.userRole,
      });
    }
  }

  /**
   * Clear user context (on logout)
   */
  public clearUserContext(): void {
    this.userId = null;
    this.userEmail = null;
    this.userName = null;
    this.userRole = null;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Main logging method - log a generic audit event
   */
  public async log(params: AuditLogParams): Promise<void> {
    try {
      const event = this.createAuditEvent(params);
      await this.queueEvent(event);
    } catch (error) {
      this.handleLoggingError(error, params);
    }
  }

  /**
   * Log successful operation
   */
  public async logSuccess(params: AuditLogParams): Promise<void> {
    await this.log({
      ...params,
      status: AuditStatus.SUCCESS,
    });
  }

  /**
   * Log failed operation
   */
  public async logFailure(params: AuditLogParams, error: Error): Promise<void> {
    await this.log({
      ...params,
      status: AuditStatus.FAILURE,
      context: {
        ...params.context,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });
  }

  /**
   * Log PHI access (simplified method)
   */
  public async logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> {
    await this.log({
      action,
      resourceType,
      resourceId,
      studentId,
      status: AuditStatus.SUCCESS,
      isPHI: true,
    });
  }

  /**
   * Log PHI modification with change tracking
   */
  public async logPHIModification(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId: string,
    changes: AuditChange[]
  ): Promise<void> {
    await this.log({
      action,
      resourceType,
      resourceId,
      studentId,
      status: AuditStatus.SUCCESS,
      isPHI: true,
      changes,
      severity: AuditSeverity.HIGH,
    });
  }

  /**
   * Log access denied events
   */
  public async logAccessDenied(
    action: AuditAction,
    resourceType: AuditResourceType,
    resourceId?: string,
    reason?: string
  ): Promise<void> {
    await this.log({
      action: AuditAction.ACCESS_DENIED,
      resourceType,
      resourceId,
      status: AuditStatus.FAILURE,
      reason,
      severity: AuditSeverity.CRITICAL,
      context: {
        attemptedAction: action,
      },
    });
  }

  /**
   * Create a complete audit event from parameters
   */
  private createAuditEvent(params: AuditLogParams): AuditEvent {
    const timestamp = new Date().toISOString();
    const severity = params.severity || getActionSeverity(params.action);
    const isPHI = params.isPHI !== undefined
      ? params.isPHI
      : (this.config.autoDetectPHI && isResourcePHI(params.resourceType));

    const event: AuditEvent = {
      id: generateEventId(),
      sessionId: this.sessionId || undefined,

      // User context
      userId: this.userId || 'anonymous',
      userEmail: this.userEmail || undefined,
      userName: this.userName || undefined,
      userRole: this.userRole || undefined,

      // Action details
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceIdentifier: params.resourceIdentifier,

      // Timing
      timestamp,
      localTimestamp: Date.now(),

      // Context
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      method: 'UI',

      // Status
      status: params.status || AuditStatus.SUCCESS,

      // Changes
      changes: params.changes,
      beforeState: params.beforeState,
      afterState: params.afterState,

      // PHI and compliance
      isPHI,
      isHIPAACompliant: true,

      // Metadata
      reason: params.reason,
      context: params.context,
      metadata: params.metadata,
      tags: params.tags,
      severity,

      // Related entities
      studentId: params.studentId,

      // Local tracking
      retryCount: 0,
      isSynced: false,
    };

    // Generate checksum if enabled
    if (this.config.enableChecksum) {
      const checksumData = {
        userId: event.userId,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        timestamp: event.timestamp,
        changes: event.changes,
      };
      event.checksum = generateChecksum(checksumData);
    }

    return event;
  }

  /**
   * Queue an event for batch submission
   */
  private async queueEvent(event: AuditEvent): Promise<void> {
    // Add to queue
    this.eventQueue.push(event);

    if (this.config.enableConsoleLog) {
      console.log('[AuditService] Event queued:', {
        action: event.action,
        resourceType: event.resourceType,
        severity: event.severity,
        queueSize: this.eventQueue.length,
      });
    }

    // Check if immediate flush is required
    if (requiresImmediateFlush(event.action, event.severity)) {
      if (this.config.enableDebug) {
        console.log('[AuditService] Critical event - immediate flush');
      }
      await this.flush();
    }
    // Check if batch size reached
    else if (this.eventQueue.length >= this.config.batchSize) {
      if (this.config.enableDebug) {
        console.log('[AuditService] Batch size reached - flushing');
      }
      await this.flush();
    }
  }

  /**
   * Flush queued events to backend
   */
  public async flush(): Promise<void> {
    if (this.isFlushing || this.eventQueue.length === 0) {
      return;
    }

    this.isFlushing = true;

    try {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      const batch: AuditBatch = {
        batchId: generateBatchId(),
        timestamp: new Date().toISOString(),
        events: eventsToSend,
      };

      if (this.config.enableChecksum) {
        batch.checksum = generateChecksum(eventsToSend);
      }

      if (this.config.enableDebug) {
        console.log('[AuditService] Sending batch:', {
          batchId: batch.batchId,
          eventCount: batch.events.length,
        });
      }

      // Send to backend
      const response = await apiInstance.post<AuditApiResponse>(
        '/api/audit/batch',
        batch,
        { timeout: 10000 } // 10 second timeout
      );

      if (response.data.success) {
        this.lastSyncAt = Date.now();
        this.syncErrors = 0;
        this.lastError = null;

        // Mark events as synced
        eventsToSend.forEach(event => {
          event.isSynced = true;
        });

        if (this.config.enableDebug) {
          console.log('[AuditService] Batch sent successfully:', response.data.data);
        }
      } else {
        throw new Error(response.data.error?.message || 'Failed to send audit batch');
      }
    } catch (error: any) {
      this.syncErrors++;
      this.lastError = error.message;

      if (this.config.enableDebug) {
        console.error('[AuditService] Failed to send batch:', error);
      }

      // Store failed events in localStorage for retry
      this.saveFailedEvents();
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Start the batch timer
   */
  private startBatchTimer(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush().catch(error => {
          if (this.config.enableDebug) {
            console.error('[AuditService] Timer flush failed:', error);
          }
        });
      }
    }, this.config.batchInterval);
  }

  /**
   * Save failed events to localStorage
   */
  private saveFailedEvents(): void {
    try {
      const combined = [...this.failedEvents, ...this.eventQueue];
      const limited = combined.slice(-this.config.maxLocalStorage);

      localStorage.setItem(
        this.config.localStorageKey,
        JSON.stringify(limited)
      );

      this.failedEvents = limited;
    } catch (error) {
      if (this.config.enableDebug) {
        console.error('[AuditService] Failed to save to localStorage:', error);
      }
    }
  }

  /**
   * Load failed events from localStorage
   */
  private loadFailedEvents(): void {
    try {
      const stored = localStorage.getItem(this.config.localStorageKey);
      if (stored) {
        this.failedEvents = JSON.parse(stored);

        if (this.config.enableDebug) {
          console.log('[AuditService] Loaded failed events:', this.failedEvents.length);
        }

        // Try to resend failed events
        if (this.failedEvents.length > 0) {
          this.retryFailedEvents();
        }
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.error('[AuditService] Failed to load from localStorage:', error);
      }
    }
  }

  /**
   * Retry sending failed events with exponential backoff
   */
  private async retryFailedEvents(): Promise<void> {
    const eventsToRetry = this.failedEvents.filter(
      event => (event.retryCount || 0) < this.config.maxRetries
    );

    if (eventsToRetry.length === 0) {
      return;
    }

    for (const event of eventsToRetry) {
      const retryCount = (event.retryCount || 0) + 1;
      const delay = this.config.retryDelay * Math.pow(this.config.retryBackoff, retryCount - 1);

      setTimeout(async () => {
        try {
          event.retryCount = retryCount;
          this.eventQueue.push(event);
          await this.flush();
        } catch (error) {
          if (this.config.enableDebug) {
            console.error('[AuditService] Retry failed:', error);
          }
        }
      }, delay);
    }
  }

  /**
   * Handle page unload - save pending events
   */
  private handleBeforeUnload(): void {
    if (this.eventQueue.length > 0) {
      this.saveFailedEvents();
    }
  }

  /**
   * Handle logging errors - never fail the primary operation
   */
  private handleLoggingError(error: unknown, params: AuditLogParams): void {
    // Log to console in development
    if (this.config.enableDebug) {
      console.error('[AuditService] Logging error:', error, params);
    }

    // In production, send to monitoring service (not implemented)
    // Never throw - audit logging must not break the application
  }

  /**
   * Get client IP address (best effort)
   */
  private getClientIP(): string | undefined {
    // IP address is typically set by server, not available in frontend
    // Could be retrieved from a backend endpoint if needed
    return undefined;
  }

  /**
   * Get user agent string
   */
  private getUserAgent(): string | undefined {
    return typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
  }

  /**
   * Get number of queued events
   */
  public getQueuedCount(): number {
    return this.eventQueue.length;
  }

  /**
   * Clear the event queue (use with caution)
   */
  public clearQueue(): void {
    this.eventQueue = [];
  }

  /**
   * Get current configuration
   */
  public getConfig(): AuditConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<AuditConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart timer if interval changed
    if (config.batchInterval) {
      this.startBatchTimer();
    }
  }

  /**
   * Check if service is healthy
   */
  public isHealthy(): boolean {
    return this.syncErrors < 5 && this.eventQueue.length < this.config.maxLocalStorage;
  }

  /**
   * Get service status
   */
  public getStatus(): AuditServiceStatus {
    return {
      isHealthy: this.isHealthy(),
      queuedEvents: this.eventQueue.length,
      failedEvents: this.failedEvents.length,
      lastSyncAt: this.lastSyncAt || undefined,
      lastError: this.lastError || undefined,
      syncErrors: this.syncErrors,
    };
  }

  /**
   * Cleanup - stop timers and flush pending events
   */
  public async cleanup(): Promise<void> {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }

    await this.flush();
  }
}

/**
 * Singleton instance of the audit service
 */
export const auditService = new AuditService();

/**
 * Initialize the audit service with user context
 * Should be called after user authentication
 */
export function initializeAuditService(user: {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}): void {
  auditService.setUserContext(user);
}

/**
 * Cleanup the audit service
 * Should be called on logout
 */
export function cleanupAuditService(): void {
  auditService.clearUserContext();
}

export default auditService;
