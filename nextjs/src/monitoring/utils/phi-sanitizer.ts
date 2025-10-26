/**
 * PHI Sanitization Utility
 *
 * HIPAA-compliant data sanitization for logs, errors, and monitoring data.
 * Removes or masks Protected Health Information (PHI) before sending to
 * external monitoring services.
 */

// PHI patterns to detect and sanitize
const PHI_PATTERNS = {
  // Social Security Numbers
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,

  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

  // Phone numbers (various formats)
  phone: /\b(\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g,

  // Medical Record Numbers (MRN) - typically 6-10 digits
  mrn: /\b(MRN|mrn|medical_record_number)[:=]\s*[\w-]+\b/gi,

  // Date of Birth patterns
  dob: /\b(dob|date_of_birth|birth_date)[:=]\s*[\d/-]+\b/gi,

  // Names in common formats (First Last, Last, First)
  names: /\b(first_name|last_name|full_name|patient_name|student_name)[:=]\s*['"]?[\w\s]+['"]?/gi,

  // Addresses
  address: /\b(address|street|city|state|zip|postal)[:=]\s*['"]?[\w\s,.-]+['"]?/gi,

  // Insurance numbers
  insurance: /\b(insurance_number|policy_number|member_id)[:=]\s*[\w-]+\b/gi,

  // Diagnosis codes (ICD-10)
  icd10: /\b[A-TV-Z]\d{2}\.?\d{0,4}\b/g,

  // Prescription numbers
  prescription: /\b(rx|prescription)[:=#]?\s*[\w-]+\b/gi,
};

// Fields that commonly contain PHI
const PHI_FIELDS = [
  'ssn',
  'social_security_number',
  'email',
  'phone',
  'phone_number',
  'mobile',
  'firstName',
  'first_name',
  'lastName',
  'last_name',
  'fullName',
  'full_name',
  'name',
  'studentName',
  'patient_name',
  'dob',
  'date_of_birth',
  'birth_date',
  'birthDate',
  'address',
  'street',
  'city',
  'state',
  'zip',
  'postal_code',
  'medical_record_number',
  'mrn',
  'insurance_number',
  'policy_number',
  'diagnosis',
  'medication',
  'prescription',
  'allergies',
  'medical_history',
  'treatment',
  'healthRecord',
  'immunization',
];

export interface SanitizationOptions {
  maskCharacter?: string;
  preserveLength?: boolean;
  allowedFields?: string[];
  strictMode?: boolean;
}

/**
 * Sanitizes a string by removing or masking PHI patterns
 */
export function sanitizeString(
  input: string,
  options: SanitizationOptions = {}
): string {
  const { maskCharacter = '*', preserveLength = true } = options;

  let sanitized = input;

  // Replace each PHI pattern with masked value
  Object.entries(PHI_PATTERNS).forEach(([type, pattern]) => {
    sanitized = sanitized.replace(pattern, (match) => {
      if (preserveLength) {
        return maskCharacter.repeat(match.length);
      }
      return `[${type.toUpperCase()}_REDACTED]`;
    });
  });

  return sanitized;
}

/**
 * Recursively sanitizes an object by removing or masking PHI fields
 */
export function sanitizeObject<T = any>(
  obj: any,
  options: SanitizationOptions = {}
): T {
  const {
    maskCharacter = '*',
    preserveLength = false,
    allowedFields = [],
    strictMode = true,
  } = options;

  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitives
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return sanitizeString(obj, options) as T;
    }
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options)) as T;
  }

  // Handle dates
  if (obj instanceof Date) {
    return strictMode ? '[DATE_REDACTED]' as T : obj;
  }

  // Handle objects
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();

    // Check if field is in allowed list
    if (allowedFields.includes(key)) {
      sanitized[key] = value;
      continue;
    }

    // Check if field name indicates PHI
    const isPHIField = PHI_FIELDS.some(
      (field) => keyLower === field.toLowerCase() || keyLower.includes(field.toLowerCase())
    );

    if (isPHIField) {
      // Mask PHI fields
      if (typeof value === 'string') {
        sanitized[key] = preserveLength
          ? maskCharacter.repeat(value.length)
          : '[REDACTED]';
      } else if (typeof value === 'number') {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = '[REDACTED]';
      }
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value, options);
    } else if (typeof value === 'string') {
      // Sanitize string values for PHI patterns
      sanitized[key] = sanitizeString(value, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Sanitizes error objects before sending to monitoring services
 */
export function sanitizeError(error: Error, options: SanitizationOptions = {}): Error {
  const sanitizedError = new Error(sanitizeString(error.message, options));
  sanitizedError.name = error.name;
  sanitizedError.stack = error.stack
    ? sanitizeString(error.stack, options)
    : undefined;

  // Sanitize any additional properties
  const additionalProps = sanitizeObject(
    { ...error },
    { ...options, strictMode: true }
  );

  Object.assign(sanitizedError, additionalProps);

  return sanitizedError;
}

/**
 * Sanitizes user context data before attaching to monitoring
 */
export function sanitizeUserContext(user: any): any {
  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
    district_id: user.district_id,
    school_id: user.school_id,
    // All other user fields are considered PHI and excluded
  };
}

/**
 * Sanitizes breadcrumbs (user action trails) before sending
 */
export function sanitizeBreadcrumb(breadcrumb: any): any {
  const sanitized = { ...breadcrumb };

  // Sanitize URL parameters and data
  if (sanitized.data) {
    sanitized.data = sanitizeObject(sanitized.data, { strictMode: true });
  }

  // Sanitize message
  if (sanitized.message) {
    sanitized.message = sanitizeString(sanitized.message);
  }

  return sanitized;
}

/**
 * Validates that data has been properly sanitized
 */
export function validateSanitization(data: any): {
  isClean: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const dataStr = JSON.stringify(data);

  // Check for common PHI patterns
  Object.entries(PHI_PATTERNS).forEach(([type, pattern]) => {
    const matches = dataStr.match(pattern);
    if (matches && matches.length > 0) {
      violations.push(`Potential ${type} found: ${matches.length} occurrence(s)`);
    }
  });

  return {
    isClean: violations.length === 0,
    violations,
  };
}

/**
 * Creates a sanitized snapshot of current state for debugging
 */
export function createSanitizedSnapshot(state: any): any {
  return sanitizeObject(state, {
    strictMode: true,
    preserveLength: false,
    allowedFields: ['id', 'role', 'status', 'type', 'category', 'timestamp'],
  });
}

/**
 * Sanitizes HTTP request data
 */
export function sanitizeRequest(request: {
  url: string;
  method: string;
  headers?: any;
  body?: any;
  params?: any;
  query?: any;
}): any {
  return {
    url: sanitizeString(request.url),
    method: request.method,
    headers: sanitizeObject(request.headers || {}, { strictMode: true }),
    body: sanitizeObject(request.body || {}, { strictMode: true }),
    params: sanitizeObject(request.params || {}, { strictMode: true }),
    query: sanitizeObject(request.query || {}, { strictMode: true }),
  };
}

/**
 * Sanitizes HTTP response data
 */
export function sanitizeResponse(response: {
  status: number;
  statusText?: string;
  headers?: any;
  data?: any;
}): any {
  return {
    status: response.status,
    statusText: response.statusText,
    headers: sanitizeObject(response.headers || {}, { strictMode: true }),
    data: sanitizeObject(response.data || {}, { strictMode: true }),
  };
}
