/**
 * Audit Service Implementation
 * Injectable NestJS service implementing IAuditLogger interface
 * HIPAA and FERPA compliant audit logging for all PHI access and modifications
 *
 * This service acts as a facade, delegating to specialized audit services:
 * - AuditLoggingService: Core logging operations
 * - AuditQueryService: Querying and filtering
 * - AuditStatisticsService: Statistical analysis
 * - AuditComplianceService: Compliance reporting
 * - AuditExportService: Export functionality
 * - AuditRetentionService: Retention policy management
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IAuditLogger } from '../interfaces/audit/audit-logger.interface';
import { ExecutionContext } from '../types';
import { AuditAction } from '../types/database.enums';
import { AuditLog, AuditSeverity, ComplianceType } from '../models/audit-log.model';

// Import specialized audit services
import { AuditLoggingService } from './audit-logging.service';
import { AuditQueryService, AuditLogFilters, AuditLogQueryOptions } from './audit-query.service';
import { AuditStatisticsService, AuditStatistics } from './audit-statistics.service';
import { AuditComplianceService, ComplianceReport } from './audit-compliance.service';
import { AuditExportService } from './audit-export.service';
import { AuditRetentionService, RetentionPolicyResult } from './audit-retention.service';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
// Re-export interfaces for backward compatibility
export type { AuditLogFilters, AuditLogQueryOptions, AuditStatistics, ComplianceReport };

/**
 * Audit Service
 *
 * Provides comprehensive audit logging with:
 * - HIPAA/FERPA compliant logging
 * - PHI access tracking
 * - Advanced querying and filtering
 * - Retention policy management
 * - Compliance reporting
 * - Export functionality
 *
 * This service delegates to specialized services for separation of concerns
 */
@Injectable()
export class AuditService implements IAuditLogger {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
    private readonly auditLogging: AuditLoggingService,
    private readonly auditQuery: AuditQueryService,
    private readonly auditStatistics: AuditStatisticsService,
    private readonly auditCompliance: AuditComplianceService,
    private readonly auditExport: AuditExportService,
    private readonly auditRetention: AuditRetentionService,
  ) {
    this.logInfo('Audit service initialized with database support');
  }

  // ============================================================================
  // CORE AUDIT LOGGING METHODS (IAuditLogger Interface)
  // Delegated to AuditLoggingService
  // ============================================================================

  /**
   * Log entity creation
   */
  async logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logCreate(entityType, entityId, context, data, transaction);
  }

  /**
   * Log entity read/access
   * Only logs PHI entity access for performance
   */
  async logRead(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logRead(entityType, entityId, context, transaction);
  }

  /**
   * Log entity update with before/after values
   */
  async logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: unknown; after: unknown }>,
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logUpdate(entityType, entityId, context, changes, transaction);
  }

  /**
   * Log entity deletion
   */
  async logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logDelete(entityType, entityId, context, data, transaction);
  }

  /**
   * Log bulk operations
   */
  async logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logBulkOperation(operation, entityType, context, metadata, transaction);
  }

  /**
   * Log export operations
   */
  async logExport(
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    return this.auditLogging.logExport(entityType, context, metadata);
  }

  /**
   * Log transaction operations
   */
  async logTransaction(
    operation: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    return this.auditLogging.logTransaction(operation, context, metadata);
  }

  /**
   * Log cache access operations
   */
  async logCacheAccess(
    operation: string,
    cacheKey: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    return this.auditLogging.logCacheAccess(operation, cacheKey, metadata);
  }

  // ============================================================================
  // ADDITIONAL AUDIT LOGGING METHODS
  // Delegated to AuditLoggingService
  // ============================================================================

  /**
   * Log authentication events (login, logout, password change)
   */
  async logAuthEvent(
    action:
      | 'LOGIN'
      | 'LOGOUT'
      | 'PASSWORD_CHANGE'
      | 'MFA_ENABLED'
      | 'MFA_DISABLED',
    userId: string,
    context: ExecutionContext,
    success: boolean = true,
    errorMessage?: string,
  ): Promise<void> {
    return this.auditLogging.logAuthEvent(action, userId, context, success, errorMessage);
  }

  /**
   * Log authorization events (permission checks, role changes)
   */
  async logAuthzEvent(
    action: string,
    userId: string,
    resource: string,
    context: ExecutionContext,
    granted: boolean,
    reason?: string,
  ): Promise<void> {
    return this.auditLogging.logAuthzEvent(action, userId, resource, context, granted, reason);
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    eventType: string,
    description: string,
    context: ExecutionContext,
    severity: AuditSeverity = AuditSeverity.HIGH,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    return this.auditLogging.logSecurityEvent(eventType, description, context, severity, metadata);
  }

  /**
   * Log PHI access for HIPAA compliance
   * Used by model hooks to track PHI field modifications
   */
  async logPHIAccess(
    options: {
      entityType: string;
      entityId: string;
      action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE';
      changedFields?: string[];
      userId?: string;
      userName?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, unknown>;
    },
    transaction?: any,
  ): Promise<void> {
    return this.auditLogging.logPHIAccess(options, transaction);
  }

  /**
   * Log failed operation
   */
  async logFailure(
    action: AuditAction,
    entityType: string,
    entityId: string | null,
    context: ExecutionContext,
    errorMessage: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    return this.auditLogging.logFailure(action, entityType, entityId, context, errorMessage, metadata);
  }

  // ============================================================================
  // QUERYING AND FILTERING
  // Delegated to AuditQueryService
  // ============================================================================

  /**
   * Query audit logs with filters and pagination
   */
  async queryAuditLogs(
    filters: AuditLogFilters = {},
    options: AuditLogQueryOptions = {},
  ): Promise<{ logs: AuditLog[]; total: number; page: number; pages: number }> {
    return this.auditQuery.queryAuditLogs(filters, options);
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    return this.auditQuery.getEntityAuditHistory(entityType, entityId, options);
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditHistory(
    userId: string,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    return this.auditQuery.getUserAuditHistory(userId, options);
  }

  /**
   * Get PHI access logs (for HIPAA compliance)
   */
  async getPHIAccessLogs(
    startDate: Date,
    endDate: Date,
    options: AuditLogQueryOptions = {},
  ): Promise<AuditLog[]> {
    return this.auditQuery.getPHIAccessLogs(startDate, endDate, options);
  }

  // ============================================================================
  // STATISTICS AND ANALYTICS
  // Delegated to AuditStatisticsService
  // ============================================================================

  /**
   * Get audit statistics for a date range
   */
  async getAuditStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditStatistics> {
    return this.auditStatistics.getAuditStatistics(startDate, endDate);
  }

  // ============================================================================
  // COMPLIANCE REPORTING
  // Delegated to AuditComplianceService
  // ============================================================================

  /**
   * Generate compliance report (HIPAA, FERPA, etc.)
   */
  async generateComplianceReport(
    complianceType: ComplianceType,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    return this.auditCompliance.generateComplianceReport(complianceType, startDate, endDate);
  }

  /**
   * Get HIPAA compliance report
   */
  async getHIPAAReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    return this.auditCompliance.getHIPAAReport(startDate, endDate);
  }

  /**
   * Get FERPA compliance report
   */
  async getFERPAReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    return this.auditCompliance.getFERPAReport(startDate, endDate);
  }

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // Delegated to AuditExportService
  // ============================================================================

  /**
   * Export audit logs to CSV format
   */
  async exportToCSV(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    return this.auditExport.exportToCSV(filters, includeFullDetails);
  }

  /**
   * Export audit logs to JSON format
   */
  async exportToJSON(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    return this.auditExport.exportToJSON(filters, includeFullDetails);
  }

  // ============================================================================
  // RETENTION POLICY MANAGEMENT
  // Delegated to AuditRetentionService
  // ============================================================================

  /**
   * Execute retention policy (delete old audit logs based on compliance requirements)
   */
  async executeRetentionPolicy(dryRun: boolean = true): Promise<RetentionPolicyResult> {
    return this.auditRetention.executeRetentionPolicy(dryRun);
  }
}
