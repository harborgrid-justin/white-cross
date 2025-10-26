/**
 * HIPAA Form Audit Hook
 *
 * Provides audit logging for forms containing PHI (Protected Health Information).
 * Automatically logs form access, submissions, and PHI field interactions.
 */

import { useEffect, useRef, useCallback } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

/**
 * Audit event types
 */
export enum AuditEventType {
  FORM_ACCESSED = 'form_accessed',
  FORM_SUBMITTED = 'form_submitted',
  PHI_FIELD_VIEWED = 'phi_field_viewed',
  PHI_FIELD_EDITED = 'phi_field_edited',
  FORM_CANCELLED = 'form_cancelled',
  FORM_ERROR = 'form_error'
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  eventType: AuditEventType;
  formName: string;
  userId: string;
  timestamp: string;
  phiFields?: string[];
  fieldName?: string;
  action?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Configuration for form audit logging
 */
export interface FormAuditConfig {
  /** Name of the form for audit logs */
  formName: string;

  /** List of PHI field names in the form */
  phiFields: readonly string[];

  /** Enable audit logging (default: true) */
  enabled?: boolean;

  /** Custom audit log function (default: sends to backend) */
  onAuditLog?: (entry: AuditLogEntry) => void | Promise<void>;

  /** User ID (automatically retrieved if not provided) */
  userId?: string;
}

/**
 * Default audit log function
 * Sends audit logs to the backend API
 */
const defaultAuditLog = async (entry: AuditLogEntry): Promise<void> => {
  try {
    // Send audit log to backend
    await fetch('/api/v1/audit/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.error('[HIPAA Audit] Failed to log audit entry:', error);
    // In production, you might want to queue failed logs for retry
  }
};

/**
 * Get current user ID from auth state
 */
const getCurrentUserId = (): string => {
  try {
    const authState = localStorage.getItem('auth');
    if (authState) {
      const parsed = JSON.parse(authState);
      return parsed.user?.id || 'unknown';
    }
  } catch (error) {
    console.error('[HIPAA Audit] Failed to get user ID:', error);
  }
  return 'unknown';
};

/**
 * useFormAudit Hook
 *
 * Automatically logs HIPAA-compliant audit events for forms containing PHI.
 *
 * @example
 * ```typescript
 * const { form, logSubmission, logCancel } = useFormAudit({
 *   formName: 'student-medical-form',
 *   phiFields: STUDENT_PHI_FIELDS,
 *   form: useForm<StudentFormData>()
 * });
 *
 * // In submit handler
 * const onSubmit = async (data) => {
 *   await logSubmission(data);
 *   // ... submit logic
 * };
 * ```
 */
export function useFormAudit<TFieldValues extends FieldValues = FieldValues>(
  config: FormAuditConfig & { form: UseFormReturn<TFieldValues> }
) {
  const { formName, phiFields, enabled = true, onAuditLog, userId: configUserId, form } = config;

  const hasLoggedAccess = useRef(false);
  const watchedFields = useRef<Set<string>>(new Set());

  const auditLog = onAuditLog || defaultAuditLog;
  const userId = configUserId || getCurrentUserId();

  /**
   * Create audit log entry
   */
  const createAuditEntry = useCallback(
    (
      eventType: AuditEventType,
      additionalData?: Partial<AuditLogEntry>
    ): AuditLogEntry => {
      return {
        eventType,
        formName,
        userId,
        timestamp: new Date().toISOString(),
        ipAddress: undefined, // Filled by backend
        userAgent: navigator.userAgent,
        ...additionalData
      };
    },
    [formName, userId]
  );

  /**
   * Log form access on mount
   */
  useEffect(() => {
    if (!enabled || hasLoggedAccess.current) return;

    hasLoggedAccess.current = true;

    const entry = createAuditEntry(AuditEventType.FORM_ACCESSED, {
      phiFields: [...phiFields],
      metadata: {
        formState: 'initial'
      }
    });

    auditLog(entry);

    // Log when component unmounts without submission
    return () => {
      if (!form.formState.isSubmitted) {
        const cancelEntry = createAuditEntry(AuditEventType.FORM_CANCELLED, {
          metadata: {
            isDirty: form.formState.isDirty,
            dirtyFields: Object.keys(form.formState.dirtyFields)
          }
        });
        auditLog(cancelEntry);
      }
    };
  }, [enabled, createAuditEntry, auditLog, phiFields, form]);

  /**
   * Watch PHI fields for edits
   */
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((value, { name, type }) => {
      if (!name || !phiFields.includes(name as string)) return;

      // Log first interaction with each PHI field
      if (!watchedFields.current.has(name)) {
        watchedFields.current.add(name);

        const entry = createAuditEntry(AuditEventType.PHI_FIELD_VIEWED, {
          fieldName: name,
          action: 'viewed'
        });

        auditLog(entry);
      }

      // Log edits to PHI fields
      if (type === 'change') {
        const entry = createAuditEntry(AuditEventType.PHI_FIELD_EDITED, {
          fieldName: name,
          action: 'edited',
          metadata: {
            hasValue: !!value[name]
          }
        });

        auditLog(entry);
      }
    });

    return () => subscription.unsubscribe();
  }, [enabled, form, phiFields, createAuditEntry, auditLog]);

  /**
   * Log form submission
   */
  const logSubmission = useCallback(
    async (data: TFieldValues) => {
      if (!enabled) return;

      const editedPhiFields = phiFields.filter(
        (field) => form.formState.dirtyFields[field as keyof typeof form.formState.dirtyFields]
      );

      const entry = createAuditEntry(AuditEventType.FORM_SUBMITTED, {
        phiFields: editedPhiFields,
        metadata: {
          totalFields: Object.keys(data).length,
          phiFieldsEdited: editedPhiFields.length,
          isValid: form.formState.isValid
        }
      });

      await auditLog(entry);
    },
    [enabled, phiFields, form.formState, createAuditEntry, auditLog]
  );

  /**
   * Log form cancellation
   */
  const logCancel = useCallback(async () => {
    if (!enabled) return;

    const entry = createAuditEntry(AuditEventType.FORM_CANCELLED, {
      metadata: {
        isDirty: form.formState.isDirty,
        dirtyFields: Object.keys(form.formState.dirtyFields)
      }
    });

    await auditLog(entry);
  }, [enabled, form.formState, createAuditEntry, auditLog]);

  /**
   * Log form error
   */
  const logError = useCallback(
    async (error: Error | string) => {
      if (!enabled) return;

      const entry = createAuditEntry(AuditEventType.FORM_ERROR, {
        metadata: {
          error: typeof error === 'string' ? error : error.message,
          errorType: typeof error === 'string' ? 'validation' : error.name
        }
      });

      await auditLog(entry);
    },
    [enabled, createAuditEntry, auditLog]
  );

  return {
    form,
    logSubmission,
    logCancel,
    logError
  };
}

/**
 * Helper to check if a field is PHI
 */
export function isPhiField(fieldName: string, phiFields: readonly string[]): boolean {
  return phiFields.includes(fieldName);
}

/**
 * Helper to get PHI fields from form data
 */
export function extractPhiFields<T extends Record<string, any>>(
  data: T,
  phiFields: readonly string[]
): Partial<T> {
  const phiData: Partial<T> = {};

  phiFields.forEach((field) => {
    if (field in data) {
      phiData[field as keyof T] = data[field];
    }
  });

  return phiData;
}

/**
 * Helper to mask PHI data for logging
 */
export function maskPhiData<T extends Record<string, any>>(
  data: T,
  phiFields: readonly string[]
): T {
  const masked = { ...data };

  phiFields.forEach((field) => {
    if (field in masked) {
      masked[field] = '[PHI-REDACTED]';
    }
  });

  return masked;
}
