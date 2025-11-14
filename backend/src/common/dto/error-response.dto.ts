import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Base Error Response DTO
 * Standard error response format for all API errors
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: false,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'ISO 8601 timestamp of when the error occurred',
    example: '2025-11-14T10:30:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiProperty({
    description: 'HTTP method that was used',
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  })
  method: string;

  @ApiProperty({
    description: 'Request path that generated the error',
    example: '/api/v1/students',
    type: String,
  })
  path: string;

  @ApiProperty({
    description: 'Error type/name',
    example: 'Bad Request',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Human-readable error message or array of messages',
    example: 'Validation failed',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
  })
  message: string | string[];

  @ApiPropertyOptional({
    description: 'Machine-readable error code for client-side error handling',
    example: 'VALID_001',
    type: String,
  })
  errorCode?: string;

  @ApiPropertyOptional({
    description: 'Unique request identifier for tracking and debugging',
    example: 'req_1234567890abcdef',
    type: String,
  })
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Additional error details',
    example: { field: 'email', constraint: 'isEmail' },
    type: Object,
  })
  details?: any;

  @ApiPropertyOptional({
    description: 'Stack trace (only in development)',
    example: 'Error: Validation failed\n    at ...',
    type: String,
  })
  stack?: string;
}

/**
 * Validation Error Detail
 * Detailed information about a specific validation failure
 */
export class ValidationErrorDetailDto {
  @ApiProperty({
    description: 'Field name that failed validation',
    example: 'email',
    type: String,
  })
  field: string;

  @ApiProperty({
    description: 'Validation error message',
    example: 'Email must be a valid email address',
    type: String,
  })
  message: string;

  @ApiPropertyOptional({
    description: 'The value that failed validation',
    example: 'invalid-email',
  })
  value?: any;

  @ApiPropertyOptional({
    description: 'Validation constraint that was violated',
    example: 'isEmail',
    type: String,
  })
  constraint?: string;
}

/**
 * Validation Error Response DTO
 * Error response for validation failures (400 Bad Request)
 */
export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code (400 for validation errors)',
    example: 400,
    type: Number,
  })
  statusCode: 400;

  @ApiProperty({
    description: 'Error type',
    example: 'Validation Error',
    type: String,
  })
  error: 'Validation Error';

  @ApiProperty({
    description: 'Error code for validation failures',
    example: 'VALID_001',
    enum: ['VALID_001', 'VALID_002', 'VALID_003'],
  })
  errorCode: string;

  @ApiProperty({
    description: 'Array of detailed validation errors',
    type: [ValidationErrorDetailDto],
    isArray: true,
  })
  errors: ValidationErrorDetailDto[];
}

/**
 * Business Error Response DTO
 * Error response for business logic violations
 */
export class BusinessErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code (400 or 409 for business logic errors)',
    example: 409,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Business Logic Error',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Machine-readable error code',
    example: 'BUSINESS_002',
    enum: [
      'BUSINESS_001', // Not found
      'BUSINESS_002', // Already exists / unique constraint
      'BUSINESS_003', // Invalid state transition
      'BUSINESS_004', // Dependency exists
      'BUSINESS_005', // Dependency missing
      'BUSINESS_006', // Quota exceeded
      'BUSINESS_007', // Concurrent modification
    ],
  })
  errorCode: string;

  @ApiPropertyOptional({
    description: 'Business rule that was violated',
    example: 'unique_email',
    type: String,
  })
  rule?: string;

  @ApiPropertyOptional({
    description: 'Additional context about the business error',
    example: { conflictingField: 'email', existingValue: 'user@example.com' },
    type: Object,
  })
  context?: Record<string, any>;
}

/**
 * Healthcare Error Response DTO
 * Error response for healthcare-specific violations (clinical safety, medication errors, etc.)
 */
export class HealthcareErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code (400 or 422 for healthcare errors)',
    example: 422,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Healthcare Error',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Machine-readable error code for healthcare errors',
    example: 'HEALTHCARE_001',
    enum: [
      'HEALTHCARE_001', // Drug interaction
      'HEALTHCARE_002', // Allergy conflict
      'HEALTHCARE_003', // Consent required
      'HEALTHCARE_004', // Consent expired
      'HEALTHCARE_005', // Dosage out of range
      'HEALTHCARE_006', // Contraindication
      'HEALTHCARE_007', // Age restriction
      'HEALTHCARE_008', // Vaccination overdue
      'HEALTHCARE_009', // Vaccination too soon
      'HEALTHCARE_010', // Appointment conflict
      'HEALTHCARE_011', // Vital signs out of range
    ],
  })
  errorCode: string;

  @ApiProperty({
    description: 'Healthcare domain where the error occurred',
    example: 'medication',
    enum: [
      'clinical',
      'medication',
      'allergy',
      'vaccination',
      'appointment',
      'consent',
      'incident',
      'vital-signs',
    ],
  })
  domain: string;

  @ApiProperty({
    description: 'Safety level of the healthcare error',
    example: 'critical',
    enum: ['critical', 'warning', 'info'],
  })
  safetyLevel: 'critical' | 'warning' | 'info';

  @ApiPropertyOptional({
    description: 'Additional context specific to the healthcare error',
    example: {
      medication1: 'Aspirin',
      medication2: 'Warfarin',
      interactionSeverity: 'major',
    },
    type: Object,
  })
  context?: Record<string, any>;
}

/**
 * Security Error Response DTO
 * Error response for authentication and authorization failures
 */
export class SecurityErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code (401 or 403 for security errors)',
    example: 401,
    enum: [401, 403],
  })
  statusCode: 401 | 403;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
    enum: ['Unauthorized', 'Forbidden'],
  })
  error: string;

  @ApiProperty({
    description: 'Machine-readable error code for security errors',
    example: 'AUTH_001',
    enum: [
      'AUTH_001', // Invalid credentials
      'AUTH_002', // Token expired
      'AUTH_003', // Token invalid
      'AUTH_004', // Token missing
      'AUTH_005', // Account locked
      'AUTH_006', // MFA required
      'AUTH_007', // MFA invalid
      'AUTHZ_001', // Insufficient permissions
      'AUTHZ_002', // Resource forbidden
      'AUTHZ_003', // Action not allowed
    ],
  })
  errorCode: string;

  @ApiPropertyOptional({
    description: 'WWW-Authenticate header value for 401 responses',
    example: 'Bearer realm="White Cross API", error="invalid_token"',
    type: String,
  })
  wwwAuthenticate?: string;

  @ApiPropertyOptional({
    description: 'Required permissions for the requested action',
    example: ['students:write', 'health-records:read'],
    type: [String],
    isArray: true,
  })
  requiredPermissions?: string[];
}

/**
 * System Error Response DTO
 * Error response for internal server errors and system failures
 */
export class SystemErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code (500, 503, or other 5xx for system errors)',
    example: 500,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Internal Server Error',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Machine-readable error code for system errors',
    example: 'SYSTEM_001',
    enum: [
      'SYSTEM_001', // Unexpected error
      'SYSTEM_002', // Database connection error
      'SYSTEM_003', // Database query error
      'SYSTEM_004', // External service error
      'SYSTEM_005', // Configuration error
      'SYSTEM_006', // Timeout
    ],
  })
  errorCode: string;

  @ApiPropertyOptional({
    description: 'Tracking ID for error investigation',
    example: 'err_1234567890abcdef',
    type: String,
  })
  trackingId?: string;

  @ApiPropertyOptional({
    description: 'Retry-After header value in seconds',
    example: 60,
    type: Number,
  })
  retryAfter?: number;
}

/**
 * Database Error Response DTO
 * Error response for database-specific errors (Sequelize)
 */
export class DatabaseErrorResponseDto extends BusinessErrorResponseDto {
  @ApiProperty({
    description: 'Database error code',
    example: 'BUSINESS_002',
    enum: [
      'BUSINESS_002', // Unique constraint violation (409)
      'VALID_003', // Foreign key violation (400)
      'VALID_002', // Database validation error (422)
      'SYSTEM_003', // Query error (500)
      'SYSTEM_002', // Connection error (503)
    ],
  })
  errorCode: string;

  @ApiPropertyOptional({
    description: 'Database table involved in the error',
    example: 'students',
    type: String,
  })
  table?: string;

  @ApiPropertyOptional({
    description: 'Database field involved in the error',
    example: 'email',
    type: String,
  })
  field?: string;

  @ApiPropertyOptional({
    description: 'Constraint name that was violated',
    example: 'students_email_key',
    type: String,
  })
  constraint?: string;
}
