/**
 * @fileoverview Compliance Audit Actions - Next.js v16 App Router
 *
 * Server actions for audit log management including creation,
 * retrieval, export, and integrity verification.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  AuditLog,
  AuditLogFilter,
  AuditLogExport,
} from '@/schemas/compliance/compliance.schemas';
import { createAuditLogEntry, exportAuditLogs, verifyAuditChain } from '@/lib/compliance/audit';

import type {
  ActionResult,
  AuditLogContext,
  CreateAuditLogInput,
  PaginatedResult
} from './compliance.types';
import {
  COMPLIANCE_ENDPOINTS,
} from '@/constants/api/admin';
import {
  serverPost,
  serverGet,
} from '@/lib/api/server';
import {
  getLatestAuditLog,
  logHIPAAAuditEntry,
  logToSecondaryStore,
  detectAndLogViolations,
  getCurrentUserId,
} from './compliance.cache';

// ============================================================================
// Audit Log Actions
// ============================================================================

/**
 * Create Audit Log Entry
 * Cache: 1 minute for created audit logs
 */
export async function createAuditLogAction(
  context: AuditLogContext,
  input: CreateAuditLogInput
): Promise<ActionResult<AuditLog>> {
  try {
    // Log HIPAA compliance audit entry
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'AUDIT_LOG_CREATE',
      resourceType: input.resourceType || 'SYSTEM',
      resourceId: input.resourceId || crypto.randomUUID(),
      details: {
        action: input.action,
        severity: input.severity,
        phiAccessed: input.phiAccessed || false,
        complianceFlags: input.complianceFlags || []
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    // Get the most recent audit log to chain hashes
    const previousLog = await getLatestAuditLog();
    const previousHash = previousLog?.verificationHash;

    // Create audit log entry with automatic hash generation
    const auditLogEntry = createAuditLogEntry(context, input, previousHash);

    // Use serverPost from nextjs-client
    const createdLog = await serverPost<AuditLog>(
      COMPLIANCE_ENDPOINTS.AUDIT_LOGS,
      auditLogEntry,
      {
        cache: 'no-store',
        next: {
          revalidate: 60,
          tags: ['audit-logs']
        }
      }
    );

    // Revalidate caches
    revalidateTag('audit-logs', 'default');
    revalidateTag('compliance-metrics', 'default');
    revalidatePath('/compliance/audits');

    // Fire-and-forget secondary logging (never fails the operation)
    await logToSecondaryStore(auditLogEntry).catch(() => {});

    // Check for compliance violations
    await detectAndLogViolations(auditLogEntry).catch(() => {});

    return {
      success: true,
      data: createdLog,
      message: 'Audit log created successfully',
    };
  } catch (error) {
    console.error('Create audit log error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create audit log',
    };
  }
}

/**
 * Get Audit Logs with hash chain verification
 * Cache: 2 minutes for audit log queries
 */
export async function getAuditLogsAction(
  filters: Partial<AuditLogFilter>
): Promise<ActionResult<PaginatedResult<AuditLog> & { chainStatus: { valid: boolean; firstInvalidIndex?: number } }>> {
  try {
    // Convert filters to query params - handle arrays properly
    const params: Record<string, string | number | boolean> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert arrays to comma-separated strings
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else {
          params[key] = value as string | number | boolean;
        }
      }
    });

    // Use serverGet from nextjs-client
    const result = await serverGet<PaginatedResult<AuditLog>>(
      COMPLIANCE_ENDPOINTS.AUDIT_LOGS,
      params,
      {
        cache: 'force-cache',
        next: {
          revalidate: 120,
          tags: ['audit-logs']
        }
      }
    );

    // Verify audit chain integrity
    const chainResult = verifyAuditChain(result.data);
    const chainStatus = typeof chainResult === 'object' ? chainResult : { valid: chainResult, firstInvalidIndex: undefined };

    // Log PHI access if accessing audit logs containing PHI
    const containsPHI = result.data.some((log: AuditLog) => log.phiAccessed);
    if (containsPHI) {
      await logHIPAAAuditEntry({
        userId: await getCurrentUserId(),
        action: 'PHI_ACCESS',
        resourceType: 'AUDIT_LOG',
        details: {
          action: 'view_audit_logs_with_phi',
          logCount: result.data.length,
          containsPHI: true
        }
      });
    }

    return {
      success: true,
      data: {
        ...result,
        chainStatus,
      },
    };
  } catch (error) {
    console.error('Get audit logs error:', error);
    return {
      success: false,
      error: 'Failed to retrieve audit logs',
    };
  }
}

/**
 * Export Audit Logs with encryption
 * Cache: No cache for exports (always fresh)
 */
export async function exportAuditLogsAction(
  exportConfig: AuditLogExport
): Promise<ActionResult<{ data: string | Buffer; encrypted: boolean; filename: string }>> {
  try {
    // Log PHI export attempt
    await logHIPAAAuditEntry({
      userId: await getCurrentUserId(),
      action: 'PHI_EXPORT',
      resourceType: 'AUDIT_LOG',
      details: {
        format: exportConfig.format,
        encrypted: exportConfig.encryptOutput || false,
        filters: exportConfig.filters
      }
    });

    // Get filtered audit logs
    const logsResult = await getAuditLogsAction(exportConfig.filters);
    if (!logsResult.success || !logsResult.data) {
      throw new Error('Failed to retrieve logs for export');
    }

    // Export with encryption
    const exportData = await exportAuditLogs(
      logsResult.data.data,
      exportConfig.format,
      exportConfig.encryptOutput,
      exportConfig.password
    );

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit-logs-${timestamp}.${exportConfig.format.toLowerCase()}${exportData.encrypted ? '.enc' : ''}`;

    // Revalidate export tracking
    revalidateTag('audit-exports', 'compliance');

    return {
      success: true,
      data: {
        ...exportData,
        filename,
      },
      message: 'Audit logs exported successfully',
    };
  } catch (error) {
    console.error('Export audit logs error:', error);
    return {
      success: false,
      error: 'Failed to export audit logs',
    };
  }
}

/**
 * Verify Audit Chain Integrity
 * Cache: 5 minutes for integrity verification
 */
export async function verifyAuditIntegrityAction(
  startDate?: string,
  endDate?: string
): Promise<ActionResult<{ valid: boolean; totalLogs: number; verifiedLogs: number; firstInvalidIndex?: number }>> {
  try {
    const logsResult = await getAuditLogsAction({
      startDate,
      endDate,
      sortBy: 'timestamp',
      sortOrder: 'asc',
    });

    if (!logsResult.success || !logsResult.data) {
      throw new Error('Failed to retrieve logs for verification');
    }

    const { valid, firstInvalidIndex } = verifyAuditChain(logsResult.data.data);

    // Log verification action
    await logHIPAAAuditEntry({
      userId: await getCurrentUserId(),
      action: valid ? 'SECURITY_VERIFICATION' : 'SECURITY_ALERT',
      resourceType: 'SYSTEM',
      details: {
        verificationResult: valid,
        logsVerified: logsResult.data.data.length,
        firstInvalidIndex,
        integrityStatus: valid ? 'INTACT' : 'COMPROMISED'
      }
    });

    return {
      success: true,
      data: {
        valid,
        totalLogs: logsResult.data.pagination.total,
        verifiedLogs: logsResult.data.data.length,
        firstInvalidIndex,
      },
      message: valid ? 'Audit chain verified successfully' : 'Audit chain integrity compromised',
    };
  } catch (error) {
    console.error('Verify audit integrity error:', error);
    return {
      success: false,
      error: 'Failed to verify audit chain integrity',
    };
  }
}