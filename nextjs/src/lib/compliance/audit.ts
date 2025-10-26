import crypto from 'crypto';
import type {
  AuditLog,
  AuditActionTypeEnum,
  AuditSeverityEnum,
  ResourceTypeEnum,
} from '@/schemas/compliance/compliance.schemas';

/**
 * Audit Logging Utility
 * Provides cryptographically-secure audit logging with tamper detection
 */

interface AuditLogContext {
  userId: string;
  userName: string;
  userRole: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
}

interface AuditLogEntry {
  action: AuditActionTypeEnum;
  severity?: AuditSeverityEnum;
  resourceType?: ResourceTypeEnum;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  status?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
  phiAccessed?: boolean;
  complianceFlags?: string[];
}

/**
 * Generate cryptographic hash for audit log entry
 * Uses SHA-256 to create tamper-proof verification hash
 */
export function generateAuditHash(
  entry: Partial<AuditLog>,
  previousHash?: string
): string {
  const dataToHash = {
    timestamp: entry.timestamp,
    action: entry.action,
    userId: entry.userId,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    details: entry.details,
    changes: entry.changes,
    previousHash: previousHash || '',
  };

  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(dataToHash))
    .digest('hex');

  return hash;
}

/**
 * Verify audit log integrity by checking hash chain
 */
export function verifyAuditChain(
  currentLog: AuditLog,
  previousLog?: AuditLog
): boolean {
  // Verify current log hash
  const expectedHash = generateAuditHash(currentLog, previousLog?.verificationHash);
  if (currentLog.verificationHash !== expectedHash) {
    return false;
  }

  // Verify chain integrity
  if (previousLog && currentLog.previousHash !== previousLog.verificationHash) {
    return false;
  }

  return true;
}

/**
 * Create audit log entry with automatic hash generation
 */
export function createAuditLogEntry(
  context: AuditLogContext,
  entry: AuditLogEntry,
  previousHash?: string
): Omit<AuditLog, 'id'> {
  const timestamp = new Date().toISOString();

  const auditLog: Omit<AuditLog, 'id'> = {
    timestamp,
    action: entry.action,
    severity: entry.severity || inferSeverity(entry.action),
    userId: context.userId,
    userName: context.userName,
    userRole: context.userRole,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    resourceName: entry.resourceName,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    sessionId: context.sessionId,
    details: sanitizeDetails(entry.details),
    changes: sanitizeChanges(entry.changes),
    status: entry.status || 'SUCCESS',
    errorMessage: entry.errorMessage,
    phiAccessed: entry.phiAccessed || isPHIAction(entry.action),
    complianceFlags: entry.complianceFlags || [],
    verificationHash: '',
    previousHash,
  };

  // Generate hash after all fields are set
  auditLog.verificationHash = generateAuditHash(auditLog, previousHash);

  return auditLog;
}

/**
 * Infer severity level based on action type
 */
function inferSeverity(action: AuditActionTypeEnum): AuditSeverityEnum {
  const criticalActions: AuditActionTypeEnum[] = [
    'DATA_BREACH',
    'UNAUTHORIZED_ACCESS',
    'EMERGENCY_OVERRIDE',
    'BREAK_GLASS',
    'PHI_BULK_ACCESS',
  ];

  const securityActions: AuditActionTypeEnum[] = [
    'LOGIN_FAILED',
    'SESSION_EXPIRED',
    'PERMISSION_CHANGE',
    'ROLE_CHANGE',
    'SECURITY_ALERT',
  ];

  const warningActions: AuditActionTypeEnum[] = [
    'PHI_EXPORT',
    'PHI_PRINT',
    'PHI_DELETE',
    'RECORD_DELETE',
    'EMERGENCY_ACCESS',
  ];

  if (criticalActions.includes(action)) return 'CRITICAL';
  if (securityActions.includes(action)) return 'SECURITY';
  if (warningActions.includes(action)) return 'WARNING';
  return 'INFO';
}

/**
 * Determine if action involves PHI access
 */
function isPHIAction(action: AuditActionTypeEnum): boolean {
  const phiActions: AuditActionTypeEnum[] = [
    'PHI_VIEW',
    'PHI_CREATE',
    'PHI_UPDATE',
    'PHI_DELETE',
    'PHI_EXPORT',
    'PHI_PRINT',
    'PHI_SEARCH',
    'PHI_BULK_ACCESS',
  ];

  return phiActions.includes(action);
}

/**
 * Sanitize details to remove sensitive information from logs
 */
function sanitizeDetails(details?: Record<string, any>): Record<string, any> | undefined {
  if (!details) return undefined;

  const sanitized = { ...details };
  const sensitiveFields = ['password', 'ssn', 'creditCard', 'token', 'secret', 'apiKey'];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Sanitize changes object to prevent logging sensitive data
 */
function sanitizeChanges(changes?: {
  before?: Record<string, any>;
  after?: Record<string, any>;
}): typeof changes {
  if (!changes) return undefined;

  return {
    before: sanitizeDetails(changes.before),
    after: sanitizeDetails(changes.after),
  };
}

/**
 * Detect PHI in data fields
 */
export function detectPHI(data: Record<string, any>): boolean {
  const phiFields = [
    'ssn',
    'dateOfBirth',
    'medicalRecordNumber',
    'diagnosis',
    'medication',
    'allergy',
    'condition',
    'prescription',
    'treatment',
    'labResult',
    'immunization',
    'insurance',
  ];

  for (const field of phiFields) {
    if (field in data) {
      return true;
    }
  }

  return false;
}

/**
 * Generate compliance flags based on audit context
 */
export function generateComplianceFlags(
  action: AuditActionTypeEnum,
  context: AuditLogContext,
  details?: Record<string, any>
): string[] {
  const flags: string[] = [];

  // Check for after-hours access
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    flags.push('AFTER_HOURS_ACCESS');
  }

  // Check for bulk operations
  if (details?.recordCount && details.recordCount > 50) {
    flags.push('BULK_OPERATION');
  }

  // Check for emergency access
  if (action === 'EMERGENCY_ACCESS' || action === 'BREAK_GLASS') {
    flags.push('EMERGENCY_ACCESS_USED');
  }

  // Check for failed actions
  if (details?.status === 'FAILURE') {
    flags.push('FAILED_ACTION');
  }

  // Check for export actions
  if (action === 'PHI_EXPORT' || action === 'DOCUMENT_DOWNLOAD') {
    flags.push('DATA_EXPORT');
  }

  return flags;
}

/**
 * Export audit logs with encryption
 */
export async function exportAuditLogs(
  logs: AuditLog[],
  format: 'JSON' | 'CSV' | 'PDF',
  encrypt = true,
  password?: string
): Promise<{ data: string | Buffer; encrypted: boolean }> {
  let data: string | Buffer;

  switch (format) {
    case 'JSON':
      data = JSON.stringify(logs, null, 2);
      break;
    case 'CSV':
      data = convertToCSV(logs);
      break;
    case 'PDF':
      // In production, use a PDF library like pdfkit or puppeteer
      data = `PDF export not implemented in this example`;
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  if (encrypt && password) {
    data = encryptData(data, password);
    return { data, encrypted: true };
  }

  return { data, encrypted: false };
}

/**
 * Convert audit logs to CSV format
 */
function convertToCSV(logs: AuditLog[]): string {
  const headers = [
    'Timestamp',
    'Action',
    'Severity',
    'User',
    'Role',
    'Resource Type',
    'Resource ID',
    'IP Address',
    'Status',
    'PHI Accessed',
    'Verification Hash',
  ];

  const rows = logs.map((log) => [
    log.timestamp,
    log.action,
    log.severity,
    log.userName,
    log.userRole,
    log.resourceType || '',
    log.resourceId || '',
    log.ipAddress,
    log.status,
    log.phiAccessed ? 'Yes' : 'No',
    log.verificationHash.substring(0, 16) + '...',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Encrypt data using AES-256-GCM
 */
function encryptData(data: string | Buffer, password: string): Buffer {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(
    typeof data === 'string' ? data : data.toString(),
    'utf8',
    'hex'
  );
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Combine IV, encrypted data, and auth tag
  return Buffer.concat([
    iv,
    Buffer.from(encrypted, 'hex'),
    authTag,
  ]);
}

/**
 * Audit log retention checker
 */
export function shouldRetainLog(log: AuditLog, retentionYears = 6): boolean {
  const logDate = new Date(log.timestamp);
  const now = new Date();
  const yearsDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

  // HIPAA requires 6 years minimum retention
  if (yearsDiff < retentionYears) {
    return true;
  }

  // Extended retention for critical events
  if (log.severity === 'CRITICAL' || log.severity === 'SECURITY') {
    return yearsDiff < retentionYears + 1; // Extra year for critical logs
  }

  return false;
}

/**
 * Batch audit log creation for high-volume operations
 */
export function createBatchAuditLogs(
  context: AuditLogContext,
  entries: AuditLogEntry[],
  previousHash?: string
): Omit<AuditLog, 'id'>[] {
  const logs: Omit<AuditLog, 'id'>[] = [];
  let currentHash = previousHash;

  for (const entry of entries) {
    const log = createAuditLogEntry(context, entry, currentHash);
    logs.push(log);
    currentHash = log.verificationHash;
  }

  return logs;
}

/**
 * Validate audit log completeness
 */
export function validateAuditLog(log: Partial<AuditLog>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!log.timestamp) errors.push('Missing timestamp');
  if (!log.action) errors.push('Missing action');
  if (!log.userId) errors.push('Missing userId');
  if (!log.userName) errors.push('Missing userName');
  if (!log.ipAddress) errors.push('Missing ipAddress');
  if (!log.verificationHash) errors.push('Missing verificationHash');

  return {
    valid: errors.length === 0,
    errors,
  };
}
