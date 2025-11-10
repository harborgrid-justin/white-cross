/**
 * LOC: DECORATOR-AUDIT-001
 * File: /reuse/server/health/composites/shared/decorators/audit-log.decorator.ts
 * Purpose: Audit logging decorator for automatic event logging
 *
 * @description
 * Decorator that automatically logs method execution to audit trail.
 * Captures inputs, outputs, errors, and execution context.
 */

import { SetMetadata } from '@nestjs/common';
import { AuditEventType, AuditSeverity } from '../services/audit-logging.service';

/**
 * Metadata key for audit logging
 */
export const AUDIT_LOG_KEY = 'audit_log';

/**
 * Audit log configuration
 */
export interface AuditLogConfig {
  eventType: AuditEventType;
  severity?: AuditSeverity;
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  includeHeaders?: boolean;
  resourceType?: string;
  description?: string;
}

/**
 * Decorator to automatically log method execution
 *
 * @example
 * ```typescript
 * @Controller('medications')
 * export class MedicationsController {
 *   @Post()
 *   @AuditLog({
 *     eventType: AuditEventType.MEDICATION_PRESCRIBED,
 *     severity: AuditSeverity.HIGH,
 *     includeRequestBody: true,
 *     resourceType: 'prescription'
 *   })
 *   async prescribeMedication(@Body() dto: PrescriptionDto) {
 *     // Automatically logged
 *   }
 * }
 * ```
 */
export const AuditLog = (config: AuditLogConfig) =>
  SetMetadata(AUDIT_LOG_KEY, config);

/**
 * Shorthand decorator for PHI access audit
 */
export const AuditPhiAccess = (description?: string) =>
  AuditLog({
    eventType: AuditEventType.PHI_VIEW,
    severity: AuditSeverity.MEDIUM,
    includeRequestBody: false,
    includeResponseBody: false,
    resourceType: 'phi',
    description,
  });

/**
 * Shorthand decorator for medication audit
 */
export const AuditMedication = (action: 'prescribed' | 'administered' | 'discontinued') =>
  AuditLog({
    eventType:
      action === 'prescribed'
        ? AuditEventType.MEDICATION_PRESCRIBED
        : action === 'administered'
        ? AuditEventType.MEDICATION_ADMINISTERED
        : AuditEventType.MEDICATION_DISCONTINUED,
    severity: AuditSeverity.HIGH,
    includeRequestBody: true,
    resourceType: 'medication',
  });

/**
 * Shorthand decorator for security event audit
 */
export const AuditSecurityEvent = (description: string, severity = AuditSeverity.HIGH) =>
  AuditLog({
    eventType: AuditEventType.SECURITY_VIOLATION,
    severity,
    includeRequestBody: true,
    includeResponseBody: false,
    description,
  });
