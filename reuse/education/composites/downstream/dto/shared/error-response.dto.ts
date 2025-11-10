/**
 * Shared error response DTOs for downstream composites
 * Used for consistent error handling across all services
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Validation error detail
 */
export class ValidationErrorDetailDto {
  @ApiProperty({
    description: 'Field that failed validation',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Validation error message',
    example: 'Must be a valid email address',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Value that failed validation',
    example: 'invalid-email',
  })
  value?: any;

  @ApiPropertyOptional({
    description: 'Validation constraint that failed',
    example: 'isEmail',
  })
  constraint?: string;
}

/**
 * Standard error response DTO
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Detailed error description',
    example: 'The provided data did not pass validation checks',
  })
  error?: string;

  @ApiPropertyOptional({
    description: 'Request timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Request path',
    example: '/api/v1/advising/sessions',
  })
  path?: string;

  @ApiPropertyOptional({
    description: 'Unique error tracking ID',
    example: 'ERR-1234567890',
  })
  errorId?: string;
}

/**
 * Validation error response DTO
 */
export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Array of validation errors',
    type: [ValidationErrorDetailDto],
  })
  validationErrors: ValidationErrorDetailDto[];
}

/**
 * Not found error response DTO
 */
export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Resource type that was not found',
    example: 'AdvisingSession',
  })
  resourceType: string;

  @ApiProperty({
    description: 'Resource identifier',
    example: 'SESSION-12345',
  })
  resourceId: string;
}

/**
 * Conflict error response DTO
 */
export class ConflictErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Conflicting resource details',
    example: 'A session already exists for this time slot',
  })
  conflict: string;

  @ApiPropertyOptional({
    description: 'Existing resource identifier',
    example: 'SESSION-67890',
  })
  existingResourceId?: string;
}

/**
 * Forbidden error response DTO
 */
export class ForbiddenErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Required permission',
    example: 'ADVISING_SESSION_CREATE',
  })
  requiredPermission: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: 'student',
  })
  userRole?: string;
}
