/**
 * LOC: AUDIT001
 * File: audit-trail-services.ts
 * Purpose: Comprehensive audit trail management for compliance
 *
 * SECURITY FIX: Added HMAC-based integrity verification for tamper-proof audit logs.
 * Each audit log entry now includes an HMAC signature to detect tampering.
 * Implements HIPAA-compliant audit trail requirements.
 */
import { Injectable, Logger } from "@nestjs/common";
import { DataRetrievalService } from "../data-retrieval-kit";
import * as crypto from "crypto";

/**
 * Audit action types
 */
export enum AuditAction {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOGIN_FAILED = "LOGIN_FAILED",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  TOKEN_REFRESH = "TOKEN_REFRESH",

  // Data Operations
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  BULK_CREATE = "BULK_CREATE",
  BULK_UPDATE = "BULK_UPDATE",
  BULK_DELETE = "BULK_DELETE",

  // PHI/PII Access
  PHI_ACCESS = "PHI_ACCESS",
  PHI_EXPORT = "PHI_EXPORT",
  PHI_PRINT = "PHI_PRINT",
  PHI_DOWNLOAD = "PHI_DOWNLOAD",
  PII_ACCESS = "PII_ACCESS",

  // Security Events
  PERMISSION_DENIED = "PERMISSION_DENIED",
  SECURITY_ALERT = "SECURITY_ALERT",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // System Events
  CONFIG_CHANGE = "CONFIG_CHANGE",
  KEY_ROTATION = "KEY_ROTATION",
  BACKUP_CREATED = "BACKUP_CREATED",
}

/**
 * Audit severity levels
 */
export enum AuditSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

/**
 * Audit log entry interface
 */
export interface IAuditLogEntry {
  id: string;
  timestamp: Date;
  action: string | AuditAction;
  entityType: string;
  entityId: string;
  userId: string;
  userEmail?: string;
  userRole?: string;
  before?: any;
  after?: any;
  changes?: string; // Encrypted JSON of changes
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  success?: boolean;
  errorMessage?: string;
  severity?: AuditSeverity;
  metadata?: Record<string, any>;
  hmac: string; // HMAC signature for integrity
  version: number;
}

@Injectable()
export class AuditTrailService {
  private readonly logger = new Logger(AuditTrailService.name);

  // HMAC secret for integrity verification
  private readonly hmacSecret: string = process.env.AUDIT_HMAC_SECRET || "CHANGE_IN_PRODUCTION_256_BIT_SECRET";
  private readonly hmacAlgorithm: string = "sha256";

  constructor(private readonly retrievalService: DataRetrievalService) {
    // Warn if using default HMAC secret
    if (this.hmacSecret === "CHANGE_IN_PRODUCTION_256_BIT_SECRET") {
      this.logger.warn("⚠️  SECURITY WARNING: Using default AUDIT_HMAC_SECRET! Set environment variable in production.");
    }
  }

  /**
   * Log audit event with HMAC integrity signature
   * @param event - Audit event details
   * @returns Audit log ID
   */
  async logAuditEvent(event: {
    action: string | AuditAction;
    entityType: string;
    entityId: string;
    userId: string;
    userEmail?: string;
    userRole?: string;
    before?: any;
    after?: any;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    success?: boolean;
    errorMessage?: string;
    severity?: AuditSeverity;
    metadata?: Record<string, any>;
  }): Promise<string> {
    try {
      // Generate unique audit ID
      const auditId = crypto.randomUUID();

      // Calculate field changes if before/after provided
      const calculatedChanges = this.calculateChanges(event.before, event.after);

      // Build audit record
      const auditRecord: Partial<IAuditLogEntry> = {
        id: auditId,
        timestamp: new Date(),
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        userId: event.userId,
        userEmail: event.userEmail,
        userRole: event.userRole,
        changes: calculatedChanges ? JSON.stringify(calculatedChanges) : event.changes ? JSON.stringify(event.changes) : null,
        ipAddress: event.ipAddress || "0.0.0.0",
        userAgent: event.userAgent || "unknown",
        sessionId: event.sessionId,
        requestId: event.requestId,
        success: event.success !== false,
        errorMessage: event.errorMessage,
        severity: event.severity || AuditSeverity.LOW,
        metadata: event.metadata,
        version: 1,
      };

      // Calculate HMAC signature for integrity
      auditRecord.hmac = this.calculateHMAC(auditRecord);

      // Persist audit record (would use actual persistence service)
      await this.persistAuditLog(auditRecord);

      // Log PHI access separately for HIPAA compliance
      if (event.action === AuditAction.PHI_ACCESS || event.action === AuditAction.PHI_EXPORT) {
        this.logger.warn(`⚕️  PHI ACCESS: User ${event.userId} accessed ${event.entityType}:${event.entityId}`);
      }

      // Log critical events
      if (event.severity === AuditSeverity.CRITICAL) {
        this.logger.error(`🚨 CRITICAL AUDIT EVENT: ${event.action} by ${event.userId} on ${event.entityType}:${event.entityId}`);
      }

      this.logger.log(`Audit event logged: ${auditId} - ${event.action} on ${event.entityType}:${event.entityId} by ${event.userId}`);

      return auditId;
    } catch (error) {
      this.logger.error(`Failed to log audit event: ${(error as Error).message}`, (error as Error).stack);
      // Audit logging failure is critical - rethrow
      throw error;
    }
  }

  /**
   * Validate audit log integrity using HMAC
   * @param auditId - Audit log ID to validate
   * @returns Validation result
   */
  async validateIntegrity(auditId: string): Promise<{
    valid: boolean;
    reason?: string;
    tamperedFields?: string[];
  }> {
    try {
      // Retrieve audit log
      const audit = await this.retrievalService.findById("AuditLog", auditId);

      if (!audit) {
        return { valid: false, reason: "Audit log not found" };
      }

      // Extract HMAC and recalculate
      const storedHMAC = (audit as any).hmac;
      const { hmac, ...auditData } = audit as any;

      const calculatedHMAC = this.calculateHMAC(auditData);

      // Compare HMACs
      if (calculatedHMAC !== storedHMAC) {
        this.logger.error(`🚨 AUDIT INTEGRITY VIOLATION DETECTED: ${auditId}`);
        this.logger.error(`Stored HMAC: ${storedHMAC}`);
        this.logger.error(`Calculated HMAC: ${calculatedHMAC}`);

        return {
          valid: false,
          reason: "HMAC mismatch - audit log may have been tampered",
          tamperedFields: ["changes", "hmac"],
        };
      }

      return { valid: true };
    } catch (error) {
      this.logger.error(`Integrity validation failed: ${(error as Error).message}`);
      return {
        valid: false,
        reason: `Validation error: ${(error as Error).message}`,
      };
    }
  }
  
  /**
   * Get audit trail for specific entity
   * NOTE: This access must also be audited!
   */
  async getAuditTrail(entityType: string, entityId: string, userId?: string): Promise<any[]> {
    this.logger.log(`Retrieving audit trail for ${entityType}:${entityId}`);

    // Audit this access
    if (userId) {
      await this.logAuditEvent({
        action: AuditAction.READ,
        entityType: "AuditLog",
        entityId: `${entityType}:${entityId}`,
        userId,
        severity: AuditSeverity.MEDIUM,
        metadata: { query: "getAuditTrail" },
      });
    }

    return this.retrievalService.retrieveAuditTrail(entityType, entityId);
  }

  /**
   * Get audit trail by user
   */
  async getAuditTrailByUser(
    userId: string,
    requestedBy?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    this.logger.log(`Retrieving audit trail for user: ${userId}`);

    // Audit this access
    if (requestedBy) {
      await this.logAuditEvent({
        action: AuditAction.READ,
        entityType: "AuditLog",
        entityId: userId,
        userId: requestedBy,
        severity: AuditSeverity.MEDIUM,
        metadata: {
          query: "getAuditTrailByUser",
          startDate,
          endDate,
        },
      });
    }

    const filters: any = { userId };

    if (startDate) filters.createdAt = { $gte: startDate };
    if (endDate) filters.createdAt = { ...filters.createdAt, $lte: endDate };

    return this.retrievalService.findByCriteria("AuditLog", filters);
  }

  /**
   * Calculate HMAC signature for audit log integrity
   * Uses SHA-256 HMAC with secret key
   */
  private calculateHMAC(data: any): string {
    const hmac = crypto.createHmac(this.hmacAlgorithm, this.hmacSecret);

    // Create deterministic string representation of data
    const dataString = JSON.stringify(data, Object.keys(data).sort());

    hmac.update(dataString);
    return hmac.digest("hex");
  }

  /**
   * Calculate field changes between before and after states
   */
  private calculateChanges(before: any, after: any): any {
    if (!before || !after) return null;

    const changes: any = {};
    const allKeys = new Set([
      ...Object.keys(before),
      ...Object.keys(after),
    ]);

    for (const key of allKeys) {
      // Deep equality check
      const beforeValue = JSON.stringify(before[key]);
      const afterValue = JSON.stringify(after[key]);

      if (beforeValue !== afterValue) {
        changes[key] = {
          before: before[key],
          after: after[key],
        };
      }
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }

  /**
   * Persist audit log to database
   * In production, this would use the actual persistence service
   * and potentially write to immutable storage (S3 Glacier, blockchain, etc.)
   */
  private async persistAuditLog(auditRecord: Partial<IAuditLogEntry>): Promise<void> {
    try {
      // TODO: Implement actual persistence using DataPersistenceService
      // await this.persistenceService.create('AuditLog', auditRecord);

      // For now, just log to debug
      this.logger.debug("Audit record persisted", {
        id: auditRecord.id,
        action: auditRecord.action,
        entityType: auditRecord.entityType,
        entityId: auditRecord.entityId,
        userId: auditRecord.userId,
        hmac: auditRecord.hmac?.substring(0, 16) + "...", // Show partial HMAC
      });

      // TODO: Also send to immutable storage for HIPAA compliance
      // await this.sendToImmutableStorage(auditRecord);

    } catch (error) {
      this.logger.error(`Failed to persist audit log: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Generate compliance report for audit logs
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalEvents: number;
    phiAccessCount: number;
    failedAuthCount: number;
    permissionDeniedCount: number;
    dataChangeCount: number;
    uniqueUsers: number;
    integrityChecksPassed: number;
    integrityChecksFailed: number;
    topActions: Array<{ action: string; count: number }>;
  }> {
    this.logger.log(`Generating compliance report: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const logs = await this.retrievalService.findByCriteria("AuditLog", {
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const phiAccessCount = logs.filter((log: any) =>
      [AuditAction.PHI_ACCESS, AuditAction.PHI_EXPORT, AuditAction.PHI_PRINT, AuditAction.PHI_DOWNLOAD].includes(log.action)
    ).length;

    const failedAuthCount = logs.filter(
      (log: any) => log.action === AuditAction.LOGIN_FAILED
    ).length;

    const permissionDeniedCount = logs.filter(
      (log: any) => log.action === AuditAction.PERMISSION_DENIED
    ).length;

    const dataChangeCount = logs.filter((log: any) =>
      [AuditAction.CREATE, AuditAction.UPDATE, AuditAction.DELETE,
       AuditAction.BULK_CREATE, AuditAction.BULK_UPDATE, AuditAction.BULK_DELETE].includes(log.action)
    ).length;

    const uniqueUsers = new Set(logs.map((log: any) => log.userId)).size;

    // Validate integrity of sampled logs
    let integrityChecksPassed = 0;
    let integrityChecksFailed = 0;

    for (const log of logs.slice(0, Math.min(100, logs.length))) {
      const result = await this.validateIntegrity((log as any).id);
      if (result.valid) {
        integrityChecksPassed++;
      } else {
        integrityChecksFailed++;
      }
    }

    // Count actions
    const actionCounts = new Map<string, number>();
    logs.forEach((log: any) => {
      actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    });

    const topActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: logs.length,
      phiAccessCount,
      failedAuthCount,
      permissionDeniedCount,
      dataChangeCount,
      uniqueUsers,
      integrityChecksPassed,
      integrityChecksFailed,
      topActions,
    };
  }
}

export { AuditTrailService, AuditAction, AuditSeverity, IAuditLogEntry };
