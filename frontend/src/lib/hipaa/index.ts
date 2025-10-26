/**
 * HIPAA Compliance Utilities Exports
 */

export {
  useFormAudit,
  AuditEventType,
  isPhiField,
  extractPhiFields,
  maskPhiData
} from './useFormAudit';

export type {
  AuditLogEntry,
  FormAuditConfig
} from './useFormAudit';
