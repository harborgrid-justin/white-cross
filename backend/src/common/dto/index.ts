/**
 * Common DTOs Index
 * Centralized exports for reusable DTO classes
 */

// Error Response DTOs
export {
  ErrorResponseDto,
  ValidationErrorDetailDto,
  ValidationErrorResponseDto,
  BusinessErrorResponseDto,
  HealthcareErrorResponseDto,
  SecurityErrorResponseDto,
  SystemErrorResponseDto,
  DatabaseErrorResponseDto,
} from './error-response.dto';

// Pagination DTOs
export {
  PaginationMetaDto,
  PaginatedResponseDto,
  PaginationQueryDto,
} from './paginated-response.dto';
