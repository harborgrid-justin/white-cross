/**
 * LOC: AUD1234567
 * File: /reuse/auditing-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - HIPAA compliance modules
 *   - Entity change tracking
 *   - Sequelize audit hooks
 */

/**
 * File: /reuse/auditing-utils.ts
 * Locator: WC-UTL-AUD-001
 * Purpose: Comprehensive Auditing Utilities - HIPAA-compliant audit logging and change tracking
 *
 * Upstream: Independent utility module for audit operations
 * Downstream: ../backend/*, audit services, compliance modules, entity trackers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize compatible
 * Exports: 40 utility functions for audit logging, change tracking, compliance, and reporting
 *
 * LLM Context: Comprehensive auditing utilities for White Cross healthcare platform.
 * Provides HIPAA-compliant audit logging, entity change tracking, user action logging,
 * sensitive data redaction, audit trail querying, and compliance reporting. Essential
 * for healthcare applications requiring complete audit trails and regulatory compliance.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  SHARE = 'SHARE',
  PRINT = 'PRINT',
  ACCESS = 'ACCESS',
  MODIFY = 'MODIFY',
}

export enum AuditCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION',
  PHI_ACCESS = 'PHI_ACCESS',
  SECURITY = 'SECURITY',
  COMPLIANCE = 'COMPLIANCE',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}

export enum ComplianceStandard {
  HIPAA = 'HIPAA',
  SOC2 = 'SOC2',
  GDPR = 'GDPR',
  PCI_DSS = 'PCI_DSS',
  ISO27001 = 'ISO27001',
}

export interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  action: AuditAction;
  category: AuditCategory;
  entityType: string;
  entityId?: string;
  userId: string;
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  metadata?: Record<string, any>;
  complianceStandards?: ComplianceStandard[];
  success: boolean;
  errorMessage?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AuditQueryOptions {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  category?: AuditCategory;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuditRetentionPolicy {
  retentionDays: number;
  complianceStandard: ComplianceStandard;
  archiveEnabled: boolean;
  archiveLocation?: string;
}

export interface ChangeTracking {
  field: string;
  oldValue: any;
  newValue: any;
  changedAt: Date;
  changedBy: string;
}

export interface SensitiveFieldConfig {
  fieldName: string;
  redactionStrategy: 'MASK' | 'HASH' | 'REMOVE' | 'ENCRYPT';
  maskChar?: string;
  visibleChars?: number;
}

// ============================================================================
// AUDIT LOG CREATION
// ============================================================================

/**
 * Creates a standardized audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} Complete audit log entry
 *
 * @example
 * ```typescript
 * const auditLog = createAuditLog({
 *   action: AuditAction.UPDATE,
 *   category: AuditCategory.PHI_ACCESS,
 *   entityType: 'Patient',
 *   entityId: '12345',
 *   userId: 'user123',
 *   success: true
 * });
 * ```
 */
export const createAuditLog = (entry: Partial<AuditLogEntry>): AuditLogEntry => {
  return {
    timestamp: new Date(),
    success: true,
    severity: 'MEDIUM',
    ...entry,
  } as AuditLogEntry;
};

/**
 * Creates an audit log for entity creation.
 *
 * @param {string} entityType - Type of entity created
 * @param {string} entityId - ID of created entity
 * @param {string} userId - User who created the entity
 * @param {Record<string, any>} data - Entity data
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createCreateAuditLog('Patient', '12345', 'user123', {
 *   name: 'John Doe',
 *   dateOfBirth: '1980-01-01'
 * });
 * ```
 */
export const createCreateAuditLog = (
  entityType: string,
  entityId: string,
  userId: string,
  data: Record<string, any>,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.CREATE,
    category: AuditCategory.DATA_MODIFICATION,
    entityType,
    entityId,
    userId,
    changesAfter: data,
  });
};

/**
 * Creates an audit log for entity update with change tracking.
 *
 * @param {string} entityType - Type of entity updated
 * @param {string} entityId - ID of updated entity
 * @param {string} userId - User who updated the entity
 * @param {Record<string, any>} before - Data before update
 * @param {Record<string, any>} after - Data after update
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createUpdateAuditLog('Patient', '12345', 'user123',
 *   { status: 'active', lastVisit: '2024-01-01' },
 *   { status: 'inactive', lastVisit: '2024-01-15' }
 * );
 * ```
 */
export const createUpdateAuditLog = (
  entityType: string,
  entityId: string,
  userId: string,
  before: Record<string, any>,
  after: Record<string, any>,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.UPDATE,
    category: AuditCategory.DATA_MODIFICATION,
    entityType,
    entityId,
    userId,
    changesBefore: before,
    changesAfter: after,
  });
};

/**
 * Creates an audit log for entity deletion.
 *
 * @param {string} entityType - Type of entity deleted
 * @param {string} entityId - ID of deleted entity
 * @param {string} userId - User who deleted the entity
 * @param {Record<string, any>} data - Deleted entity data
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createDeleteAuditLog('Patient', '12345', 'user123', {
 *   name: 'John Doe',
 *   dateOfBirth: '1980-01-01'
 * });
 * ```
 */
export const createDeleteAuditLog = (
  entityType: string,
  entityId: string,
  userId: string,
  data: Record<string, any>,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.DELETE,
    category: AuditCategory.DATA_MODIFICATION,
    entityType,
    entityId,
    userId,
    changesBefore: data,
  });
};

/**
 * Creates an audit log for PHI (Protected Health Information) access.
 *
 * @param {string} entityType - Type of PHI entity accessed
 * @param {string} entityId - ID of PHI entity
 * @param {string} userId - User who accessed the PHI
 * @param {string} [ipAddress] - IP address of the user
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createPhiAccessLog('Patient', '12345', 'doctor123', '192.168.1.1');
 * ```
 */
export const createPhiAccessLog = (
  entityType: string,
  entityId: string,
  userId: string,
  ipAddress?: string,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.ACCESS,
    category: AuditCategory.PHI_ACCESS,
    entityType,
    entityId,
    userId,
    ipAddress,
    complianceStandards: [ComplianceStandard.HIPAA],
    severity: 'HIGH',
  });
};

// ============================================================================
// CHANGE TRACKING
// ============================================================================

/**
 * Compares two objects and extracts changed fields.
 *
 * @param {Record<string, any>} oldData - Original data
 * @param {Record<string, any>} newData - Updated data
 * @returns {ChangeTracking[]} Array of changed fields
 *
 * @example
 * ```typescript
 * const changes = extractChangedFields(
 *   { name: 'John', age: 30, status: 'active' },
 *   { name: 'John', age: 31, status: 'inactive' }
 * );
 * // Result: [{ field: 'age', oldValue: 30, newValue: 31 }, ...]
 * ```
 */
export const extractChangedFields = (
  oldData: Record<string, any>,
  newData: Record<string, any>,
): Omit<ChangeTracking, 'changedAt' | 'changedBy'>[] => {
  const changes: Omit<ChangeTracking, 'changedAt' | 'changedBy'>[] = [];
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

  allKeys.forEach((key) => {
    const oldValue = oldData[key];
    const newValue = newData[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({
        field: key,
        oldValue,
        newValue,
      });
    }
  });

  return changes;
};

/**
 * Creates a detailed change tracking record.
 *
 * @param {Record<string, any>} oldData - Original data
 * @param {Record<string, any>} newData - Updated data
 * @param {string} userId - User who made the change
 * @returns {ChangeTracking[]} Array of change tracking records
 *
 * @example
 * ```typescript
 * const tracking = createChangeTracking(
 *   { status: 'pending' },
 *   { status: 'approved' },
 *   'user123'
 * );
 * ```
 */
export const createChangeTracking = (
  oldData: Record<string, any>,
  newData: Record<string, any>,
  userId: string,
): ChangeTracking[] => {
  const changes = extractChangedFields(oldData, newData);
  return changes.map((change) => ({
    ...change,
    changedAt: new Date(),
    changedBy: userId,
  }));
};

/**
 * Formats change tracking for human-readable display.
 *
 * @param {ChangeTracking[]} changes - Array of change tracking records
 * @returns {string[]} Array of formatted change descriptions
 *
 * @example
 * ```typescript
 * const formatted = formatChangeTracking([
 *   { field: 'status', oldValue: 'pending', newValue: 'approved', ... }
 * ]);
 * // Result: ['status: "pending" → "approved"']
 * ```
 */
export const formatChangeTracking = (changes: ChangeTracking[]): string[] => {
  return changes.map((change) => {
    const oldVal = JSON.stringify(change.oldValue);
    const newVal = JSON.stringify(change.newValue);
    return `${change.field}: ${oldVal} → ${newVal}`;
  });
};

/**
 * Calculates change summary statistics.
 *
 * @param {ChangeTracking[]} changes - Array of change tracking records
 * @returns {object} Change summary
 *
 * @example
 * ```typescript
 * const summary = getChangeSummary(changeRecords);
 * // Result: { totalChanges: 5, fieldsChanged: ['name', 'email', 'status'], ... }
 * ```
 */
export const getChangeSummary = (changes: ChangeTracking[]) => {
  return {
    totalChanges: changes.length,
    fieldsChanged: changes.map((c) => c.field),
    uniqueChangedBy: [...new Set(changes.map((c) => c.changedBy))],
    firstChange: changes.length > 0 ? changes[0].changedAt : null,
    lastChange: changes.length > 0 ? changes[changes.length - 1].changedAt : null,
  };
};

// ============================================================================
// USER ACTION LOGGING
// ============================================================================

/**
 * Creates an audit log for user login.
 *
 * @param {string} userId - User ID
 * @param {string} ipAddress - IP address
 * @param {string} [userAgent] - User agent string
 * @param {boolean} success - Login success status
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createLoginAuditLog('user123', '192.168.1.1', 'Mozilla/5.0...', true);
 * ```
 */
export const createLoginAuditLog = (
  userId: string,
  ipAddress: string,
  userAgent?: string,
  success: boolean = true,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.LOGIN,
    category: AuditCategory.AUTHENTICATION,
    entityType: 'User',
    entityId: userId,
    userId,
    ipAddress,
    userAgent,
    success,
    severity: success ? 'LOW' : 'HIGH',
  });
};

/**
 * Creates an audit log for user logout.
 *
 * @param {string} userId - User ID
 * @param {string} [sessionDuration] - Session duration in seconds
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createLogoutAuditLog('user123', '3600');
 * ```
 */
export const createLogoutAuditLog = (
  userId: string,
  sessionDuration?: string,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.LOGOUT,
    category: AuditCategory.AUTHENTICATION,
    entityType: 'User',
    entityId: userId,
    userId,
    metadata: sessionDuration ? { sessionDuration } : undefined,
  });
};

/**
 * Creates an audit log for data export.
 *
 * @param {string} entityType - Type of data exported
 * @param {string} userId - User who exported the data
 * @param {number} recordCount - Number of records exported
 * @param {string} format - Export format (CSV, PDF, etc.)
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createExportAuditLog('Patient', 'user123', 150, 'CSV');
 * ```
 */
export const createExportAuditLog = (
  entityType: string,
  userId: string,
  recordCount: number,
  format: string,
): AuditLogEntry => {
  return createAuditLog({
    action: AuditAction.EXPORT,
    category: AuditCategory.DATA_ACCESS,
    entityType,
    userId,
    metadata: { recordCount, format },
    complianceStandards: [ComplianceStandard.HIPAA, ComplianceStandard.GDPR],
    severity: 'HIGH',
  });
};

/**
 * Creates an audit log for failed action attempts.
 *
 * @param {AuditAction} action - Action that failed
 * @param {string} entityType - Type of entity
 * @param {string} userId - User who attempted the action
 * @param {string} errorMessage - Error message
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createFailedActionLog(
 *   AuditAction.UPDATE,
 *   'Patient',
 *   'user123',
 *   'Insufficient permissions'
 * );
 * ```
 */
export const createFailedActionLog = (
  action: AuditAction,
  entityType: string,
  userId: string,
  errorMessage: string,
): AuditLogEntry => {
  return createAuditLog({
    action,
    category: AuditCategory.SECURITY,
    entityType,
    userId,
    success: false,
    errorMessage,
    severity: 'HIGH',
  });
};

// ============================================================================
// COMPLIANCE LOGGING
// ============================================================================

/**
 * Creates a HIPAA-compliant audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} HIPAA-compliant audit log entry
 *
 * @example
 * ```typescript
 * const log = createHipaaAuditLog({
 *   action: AuditAction.ACCESS,
 *   entityType: 'Patient',
 *   entityId: '12345',
 *   userId: 'doctor123'
 * });
 * ```
 */
export const createHipaaAuditLog = (
  entry: Partial<AuditLogEntry>,
): AuditLogEntry => {
  return createAuditLog({
    ...entry,
    complianceStandards: [
      ComplianceStandard.HIPAA,
      ...(entry.complianceStandards || []),
    ],
    category: entry.category || AuditCategory.PHI_ACCESS,
  });
};

/**
 * Creates a SOC2-compliant audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} SOC2-compliant audit log entry
 *
 * @example
 * ```typescript
 * const log = createSoc2AuditLog({
 *   action: AuditAction.MODIFY,
 *   entityType: 'SystemConfiguration',
 *   userId: 'admin123'
 * });
 * ```
 */
export const createSoc2AuditLog = (entry: Partial<AuditLogEntry>): AuditLogEntry => {
  return createAuditLog({
    ...entry,
    complianceStandards: [
      ComplianceStandard.SOC2,
      ...(entry.complianceStandards || []),
    ],
    category: entry.category || AuditCategory.SYSTEM_CONFIGURATION,
  });
};

/**
 * Validates audit log entry for compliance standards.
 *
 * @param {AuditLogEntry} entry - Audit log entry to validate
 * @param {ComplianceStandard} standard - Compliance standard to validate against
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateComplianceAuditLog(auditLog, ComplianceStandard.HIPAA);
 * // Result: { isValid: true, missingFields: [], warnings: [] }
 * ```
 */
export const validateComplianceAuditLog = (
  entry: AuditLogEntry,
  standard: ComplianceStandard,
): { isValid: boolean; missingFields: string[]; warnings: string[] } => {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Common required fields
  if (!entry.timestamp) missingFields.push('timestamp');
  if (!entry.userId) missingFields.push('userId');
  if (!entry.action) missingFields.push('action');
  if (!entry.entityType) missingFields.push('entityType');

  // Standard-specific validation
  if (standard === ComplianceStandard.HIPAA) {
    if (!entry.ipAddress) warnings.push('IP address recommended for HIPAA compliance');
    if (entry.category !== AuditCategory.PHI_ACCESS && !entry.category) {
      warnings.push('Category should be specified for HIPAA logs');
    }
  }

  if (standard === ComplianceStandard.SOC2) {
    if (!entry.requestId) warnings.push('Request ID recommended for SOC2 compliance');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
  };
};

// ============================================================================
// SENSITIVE DATA REDACTION
// ============================================================================

/**
 * Redacts sensitive data from audit log entry.
 *
 * @param {AuditLogEntry} entry - Audit log entry
 * @param {SensitiveFieldConfig[]} sensitiveFields - Configuration for sensitive fields
 * @returns {AuditLogEntry} Redacted audit log entry
 *
 * @example
 * ```typescript
 * const redacted = redactSensitiveData(auditLog, [
 *   { fieldName: 'ssn', redactionStrategy: 'MASK', maskChar: '*', visibleChars: 4 },
 *   { fieldName: 'password', redactionStrategy: 'REMOVE' }
 * ]);
 * ```
 */
export const redactSensitiveData = (
  entry: AuditLogEntry,
  sensitiveFields: SensitiveFieldConfig[],
): AuditLogEntry => {
  const redactedEntry = { ...entry };

  const redactObject = (obj: Record<string, any>) => {
    const redacted = { ...obj };
    sensitiveFields.forEach((config) => {
      if (redacted[config.fieldName] !== undefined) {
        redacted[config.fieldName] = applyRedactionStrategy(
          redacted[config.fieldName],
          config,
        );
      }
    });
    return redacted;
  };

  if (redactedEntry.changesBefore) {
    redactedEntry.changesBefore = redactObject(redactedEntry.changesBefore);
  }

  if (redactedEntry.changesAfter) {
    redactedEntry.changesAfter = redactObject(redactedEntry.changesAfter);
  }

  if (redactedEntry.metadata) {
    redactedEntry.metadata = redactObject(redactedEntry.metadata);
  }

  return redactedEntry;
};

/**
 * Applies redaction strategy to a field value.
 *
 * @param {any} value - Field value to redact
 * @param {SensitiveFieldConfig} config - Redaction configuration
 * @returns {any} Redacted value
 *
 * @example
 * ```typescript
 * const masked = applyRedactionStrategy('123-45-6789', {
 *   fieldName: 'ssn',
 *   redactionStrategy: 'MASK',
 *   maskChar: '*',
 *   visibleChars: 4
 * });
 * // Result: '*****6789'
 * ```
 */
export const applyRedactionStrategy = (
  value: any,
  config: SensitiveFieldConfig,
): any => {
  if (value === null || value === undefined) return value;

  const strValue = String(value);

  switch (config.redactionStrategy) {
    case 'MASK':
      const maskChar = config.maskChar || '*';
      const visibleChars = config.visibleChars || 0;
      if (strValue.length <= visibleChars) return maskChar.repeat(strValue.length);
      return (
        maskChar.repeat(strValue.length - visibleChars) +
        strValue.slice(-visibleChars)
      );

    case 'HASH':
      // Simple hash representation (in production, use crypto library)
      return `[HASHED:${strValue.length}]`;

    case 'REMOVE':
      return '[REDACTED]';

    case 'ENCRYPT':
      return '[ENCRYPTED]';

    default:
      return value;
  }
};

/**
 * Masks email addresses for audit logs.
 *
 * @param {string} email - Email address to mask
 * @returns {string} Masked email address
 *
 * @example
 * ```typescript
 * const masked = maskEmail('john.doe@example.com');
 * // Result: 'j***e@example.com'
 * ```
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal =
    local.length > 2
      ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
      : local;
  return `${maskedLocal}@${domain}`;
};

/**
 * Masks phone numbers for audit logs.
 *
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone number
 *
 * @example
 * ```typescript
 * const masked = maskPhoneNumber('(555) 123-4567');
 * // Result: '(***) ***-4567'
 * ```
 */
export const maskPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const lastFour = digits.slice(-4);
  return phone.replace(/\d/g, (digit, index) => {
    const digitPosition = phone.slice(0, index + 1).replace(/\D/g, '').length;
    return digitPosition <= digits.length - 4 ? '*' : digit;
  });
};

// ============================================================================
// AUDIT TRAIL QUERYING
// ============================================================================

/**
 * Builds query filter for audit log search.
 *
 * @param {AuditQueryOptions} options - Query options
 * @returns {Record<string, any>} Query filter object
 *
 * @example
 * ```typescript
 * const filter = buildAuditQueryFilter({
 *   userId: 'user123',
 *   action: AuditAction.UPDATE,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export const buildAuditQueryFilter = (
  options: AuditQueryOptions,
): Record<string, any> => {
  const filter: Record<string, any> = {};

  if (options.userId) filter.userId = options.userId;
  if (options.entityType) filter.entityType = options.entityType;
  if (options.entityId) filter.entityId = options.entityId;
  if (options.action) filter.action = options.action;
  if (options.category) filter.category = options.category;

  if (options.startDate || options.endDate) {
    filter.timestamp = {};
    if (options.startDate) filter.timestamp.$gte = options.startDate;
    if (options.endDate) filter.timestamp.$lte = options.endDate;
  }

  return filter;
};

/**
 * Sorts audit logs by specified field and order.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {string} sortBy - Field to sort by
 * @param {'ASC' | 'DESC'} sortOrder - Sort order
 * @returns {AuditLogEntry[]} Sorted audit logs
 *
 * @example
 * ```typescript
 * const sorted = sortAuditLogs(auditLogs, 'timestamp', 'DESC');
 * ```
 */
export const sortAuditLogs = (
  logs: AuditLogEntry[],
  sortBy: string = 'timestamp',
  sortOrder: 'ASC' | 'DESC' = 'DESC',
): AuditLogEntry[] => {
  return [...logs].sort((a, b) => {
    const aVal = a[sortBy as keyof AuditLogEntry];
    const bVal = b[sortBy as keyof AuditLogEntry];

    if (aVal === bVal) return 0;
    const comparison = aVal > bVal ? 1 : -1;
    return sortOrder === 'ASC' ? comparison : -comparison;
  });
};

/**
 * Paginates audit log results.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {number} limit - Number of records per page
 * @param {number} offset - Number of records to skip
 * @returns {object} Paginated results
 *
 * @example
 * ```typescript
 * const page = paginateAuditLogs(auditLogs, 20, 40);
 * // Returns records 41-60
 * ```
 */
export const paginateAuditLogs = (
  logs: AuditLogEntry[],
  limit: number = 50,
  offset: number = 0,
): { data: AuditLogEntry[]; total: number; limit: number; offset: number } => {
  return {
    data: logs.slice(offset, offset + limit),
    total: logs.length,
    limit,
    offset,
  };
};

/**
 * Filters audit logs by date range.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {AuditLogEntry[]} Filtered audit logs
 *
 * @example
 * ```typescript
 * const filtered = filterAuditLogsByDateRange(
 *   auditLogs,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export const filterAuditLogsByDateRange = (
  logs: AuditLogEntry[],
  startDate: Date,
  endDate: Date,
): AuditLogEntry[] => {
  return logs.filter((log) => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= startDate && timestamp <= endDate;
  });
};

// ============================================================================
// AUDIT LOG RETENTION
// ============================================================================

/**
 * Creates an audit retention policy.
 *
 * @param {Partial<AuditRetentionPolicy>} policy - Retention policy configuration
 * @returns {AuditRetentionPolicy} Complete retention policy
 *
 * @example
 * ```typescript
 * const policy = createRetentionPolicy({
 *   retentionDays: 2555, // 7 years for HIPAA
 *   complianceStandard: ComplianceStandard.HIPAA,
 *   archiveEnabled: true,
 *   archiveLocation: 's3://audit-archives'
 * });
 * ```
 */
export const createRetentionPolicy = (
  policy: Partial<AuditRetentionPolicy>,
): AuditRetentionPolicy => {
  return {
    retentionDays: 2555, // 7 years default (HIPAA requirement)
    complianceStandard: ComplianceStandard.HIPAA,
    archiveEnabled: false,
    ...policy,
  };
};

/**
 * Checks if audit log should be archived based on retention policy.
 *
 * @param {AuditLogEntry} log - Audit log entry
 * @param {AuditRetentionPolicy} policy - Retention policy
 * @returns {boolean} True if log should be archived
 *
 * @example
 * ```typescript
 * const shouldArchive = shouldArchiveAuditLog(auditLog, retentionPolicy);
 * ```
 */
export const shouldArchiveAuditLog = (
  log: AuditLogEntry,
  policy: AuditRetentionPolicy,
): boolean => {
  const logAge = Date.now() - new Date(log.timestamp).getTime();
  const retentionMs = policy.retentionDays * 24 * 60 * 60 * 1000;
  return policy.archiveEnabled && logAge > retentionMs;
};

/**
 * Gets retention requirements for compliance standard.
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @returns {number} Required retention days
 *
 * @example
 * ```typescript
 * const days = getRetentionRequirement(ComplianceStandard.HIPAA);
 * // Result: 2555 (7 years)
 * ```
 */
export const getRetentionRequirement = (standard: ComplianceStandard): number => {
  const requirements: Record<ComplianceStandard, number> = {
    [ComplianceStandard.HIPAA]: 2555, // 7 years
    [ComplianceStandard.SOC2]: 2555, // 7 years
    [ComplianceStandard.GDPR]: 2190, // 6 years
    [ComplianceStandard.PCI_DSS]: 365, // 1 year
    [ComplianceStandard.ISO27001]: 2190, // 6 years
  };
  return requirements[standard] || 2555;
};

// ============================================================================
// AUDIT REPORTING
// ============================================================================

/**
 * Generates audit summary report.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @returns {object} Audit summary report
 *
 * @example
 * ```typescript
 * const report = generateAuditSummary(auditLogs);
 * // Result: { totalLogs: 1500, uniqueUsers: 45, actionBreakdown: {...}, ... }
 * ```
 */
export const generateAuditSummary = (logs: AuditLogEntry[]) => {
  const actionBreakdown: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};
  const uniqueUsers = new Set<string>();
  const uniqueEntities = new Set<string>();
  let successCount = 0;
  let failureCount = 0;

  logs.forEach((log) => {
    actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
    categoryBreakdown[log.category] = (categoryBreakdown[log.category] || 0) + 1;
    uniqueUsers.add(log.userId);
    if (log.entityId) uniqueEntities.add(log.entityId);
    if (log.success) successCount++;
    else failureCount++;
  });

  return {
    totalLogs: logs.length,
    uniqueUsers: uniqueUsers.size,
    uniqueEntities: uniqueEntities.size,
    successCount,
    failureCount,
    successRate: logs.length > 0 ? (successCount / logs.length) * 100 : 0,
    actionBreakdown,
    categoryBreakdown,
    dateRange: {
      earliest: logs.length > 0 ? logs[0].timestamp : null,
      latest: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
    },
  };
};

/**
 * Generates user activity report.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {string} userId - User ID to generate report for
 * @returns {object} User activity report
 *
 * @example
 * ```typescript
 * const report = generateUserActivityReport(auditLogs, 'user123');
 * ```
 */
export const generateUserActivityReport = (
  logs: AuditLogEntry[],
  userId: string,
) => {
  const userLogs = logs.filter((log) => log.userId === userId);
  const actions = userLogs.map((log) => log.action);
  const categories = userLogs.map((log) => log.category);

  return {
    userId,
    totalActions: userLogs.length,
    uniqueActions: new Set(actions).size,
    actionFrequency: actions.reduce(
      (acc, action) => {
        acc[action] = (acc[action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    categoryFrequency: categories.reduce(
      (acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    firstActivity: userLogs.length > 0 ? userLogs[0].timestamp : null,
    lastActivity:
      userLogs.length > 0 ? userLogs[userLogs.length - 1].timestamp : null,
  };
};

/**
 * Exports audit logs to CSV format.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @returns {string} CSV formatted audit logs
 *
 * @example
 * ```typescript
 * const csv = exportAuditLogsToCSV(auditLogs);
 * // Save to file or send as download
 * ```
 */
export const exportAuditLogsToCSV = (logs: AuditLogEntry[]): string => {
  const headers = [
    'Timestamp',
    'Action',
    'Category',
    'Entity Type',
    'Entity ID',
    'User ID',
    'Success',
    'IP Address',
  ];

  const rows = logs.map((log) => [
    log.timestamp.toISOString(),
    log.action,
    log.category,
    log.entityType,
    log.entityId || '',
    log.userId,
    log.success.toString(),
    log.ipAddress || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

export default {
  // Audit log creation
  createAuditLog,
  createCreateAuditLog,
  createUpdateAuditLog,
  createDeleteAuditLog,
  createPhiAccessLog,

  // Change tracking
  extractChangedFields,
  createChangeTracking,
  formatChangeTracking,
  getChangeSummary,

  // User action logging
  createLoginAuditLog,
  createLogoutAuditLog,
  createExportAuditLog,
  createFailedActionLog,

  // Compliance logging
  createHipaaAuditLog,
  createSoc2AuditLog,
  validateComplianceAuditLog,

  // Sensitive data redaction
  redactSensitiveData,
  applyRedactionStrategy,
  maskEmail,
  maskPhoneNumber,

  // Audit trail querying
  buildAuditQueryFilter,
  sortAuditLogs,
  paginateAuditLogs,
  filterAuditLogsByDateRange,

  // Audit log retention
  createRetentionPolicy,
  shouldArchiveAuditLog,
  getRetentionRequirement,

  // Audit reporting
  generateAuditSummary,
  generateUserActivityReport,
  exportAuditLogsToCSV,
};
