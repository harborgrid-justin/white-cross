/**
 * @fileoverview Main Audit Service Implementation
 * 
 * The core AuditService class that orchestrates all audit functionality including
 * event creation, user context management, and API integration.
 * 
 * @module AuditService/Core
 * @version 1.0.0
 * @since 2025-11-11
 */

import {
  AuditEvent,
  AuditLogParams,
  AuditAction,
  AuditResourceType,
  AuditSeverity,
  AuditStatus,
  AuditConfig,
  AuditChange,
  IAuditService,
  AuditServiceStatus,
} from '../types';
import {
  DEFAULT_AUDIT_CONFIG,
  getActionSeverity,
  isResourcePHI,
} from '../config';
import { generateEventId, generateSessionId, getClientIP, getUserAgent } from './utils';
import { StorageManager } from './storage-manager';
import { EventManager } from './event-manager';

/**
 * Main Audit Service Implementation
 */
export class AuditService implements IAuditService {
  private config: AuditConfig;
  private storageManager: StorageManager;
  private eventManager: EventManager;

  // User context - set from auth store
  private userId: string | null = null;
  private userEmail: string | null = null;
  private userName: string | null = null;
  private userRole: string | null = null;
  private sessionId: string | null = null;

  constructor(config: Partial<AuditConfig> = {}) {
    this.config = { ...DEFAULT_AUDIT_CONFIG, ...config };
    this.storageManager = new StorageManager(this.config);
    this.eventManager = new EventManager(this.config, this.storageManager);
    this.initializeService();
  }

  /**
   * Initialize the audit service
   */
  private initializeService(): void {
    // Generate session ID
    this.sessionId = generateSessionId();

    // Setup cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.handleBeforeUnload();
      });
    }

    // Try to retry failed events
    this.retryFailedEvents();

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
    this.sessionId = generateSessionId();
  }

  /**
   * Main logging method - log a generic audit event
   */
  public async log(params: AuditLogParams): Promise<void> {
    try {
      const event = this.createAuditEvent(params);
      await this.eventManager.queueEvent(event);
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
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
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

    return event;
  }

  /**
   * Flush queued events to backend
   */
  public async flush(): Promise<void> {
    await this.eventManager.flush();
  }

  /**
   * Retry failed events
   */
  private async retryFailedEvents(): Promise<void> {
    await this.eventManager.retryFailedEvents();
  }

  /**
   * Handle page unload - save pending events
   */
  private handleBeforeUnload(): void {
    this.eventManager.handleBeforeUnload();
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
   * Get number of queued events
   */
  public getQueuedCount(): number {
    return this.eventManager.getQueuedCount();
  }

  /**
   * Clear the event queue (use with caution)
   */
  public clearQueue(): void {
    this.eventManager.clearQueue();
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
    this.eventManager.updateConfig(this.config);
  }

  /**
   * Check if service is healthy
   */
  public isHealthy(): boolean {
    const syncStatus = this.eventManager.getSyncStatus();
    const storageHealth = this.storageManager.checkStorageHealth();
    
    return this.eventManager.isHealthy() && 
           storageHealth.available && 
           storageHealth.hasSpace &&
           syncStatus.syncErrors < 5;
  }

  /**
   * Get service status
   */
  public getStatus(): AuditServiceStatus {
    const syncStatus = this.eventManager.getSyncStatus();
    const storageHealth = this.storageManager.checkStorageHealth();
    
    return {
      isHealthy: this.isHealthy(),
      queuedEvents: syncStatus.queuedEvents,
      failedEvents: storageHealth.eventCount,
      lastSyncAt: syncStatus.lastSyncAt || undefined,
      lastError: syncStatus.lastError || undefined,
      syncErrors: syncStatus.syncErrors,
    };
  }

  /**
   * Cleanup - stop timers and flush pending events
   */
  public async cleanup(): Promise<void> {
    await this.eventManager.cleanup();
    this.storageManager.cleanupOldEvents();
  }
}
