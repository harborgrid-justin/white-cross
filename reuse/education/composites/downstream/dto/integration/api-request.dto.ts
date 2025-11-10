/**
 * API Request DTOs for integration domain
 * Manages API requests and responses for external integrations
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  IsUrl,
  Min,
} from 'class-validator';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum RequestStatus {
  PENDING = 'pending',
  IN_FLIGHT = 'in_flight',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  CANCELLED = 'cancelled',
}

export enum ContentType {
  APPLICATION_JSON = 'application/json',
  APPLICATION_XML = 'application/xml',
  APPLICATION_FORM = 'application/x-www-form-urlencoded',
  MULTIPART_FORM = 'multipart/form-data',
  TEXT_PLAIN = 'text/plain',
  TEXT_XML = 'text/xml',
}

/**
 * API request DTO
 */
export class ApiRequestDto {
  @ApiProperty({
    description: 'Request ID',
    example: 'API-REQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Target API endpoint URL',
    example: 'https://api.external-system.com/v2/students',
  })
  @IsUrl()
  endpoint: string;

  @ApiProperty({
    description: 'HTTP method',
    enum: HttpMethod,
    example: HttpMethod.GET,
  })
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @ApiPropertyOptional({
    description: 'Request headers',
    type: 'object',
    example: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token_here',
    },
  })
  @IsOptional()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Request body',
    type: 'object',
  })
  @IsOptional()
  body?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Query parameters',
    type: 'object',
    example: { semester: 'Fall2025', limit: 100 },
  })
  @IsOptional()
  queryParameters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Content type of request',
    enum: ContentType,
    example: ContentType.APPLICATION_JSON,
  })
  @IsOptional()
  @IsEnum(ContentType)
  contentType?: ContentType;

  @ApiPropertyOptional({
    description: 'Request timeout (seconds)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  timeoutSeconds?: number;

  @ApiProperty({
    description: 'Request status',
    enum: RequestStatus,
    example: RequestStatus.COMPLETED,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty({
    description: 'Request submitted timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  submittedAt: Date;

  @ApiPropertyOptional({
    description: 'Request completed timestamp',
    example: '2025-11-10T12:00:02Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiPropertyOptional({
    description: 'Request correlation ID for tracking',
    example: 'CORR-ID-ABC123',
  })
  @IsOptional()
  @IsString()
  correlationId?: string;

  @ApiPropertyOptional({
    description: 'Retry count',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  retryCount?: number;

  @ApiPropertyOptional({
    description: 'Request is sensitive/contains PII',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isSensitive?: boolean;
}

/**
 * API response DTO
 */
export class ApiResponseDto {
  @ApiProperty({
    description: 'Response ID',
    example: 'API-RESP-2025001',
  })
  @IsString()
  @IsNotEmpty()
  responseId: string;

  @ApiProperty({
    description: 'Request ID this response corresponds to',
    example: 'API-REQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  @IsNumber()
  @Min(100)
  statusCode: number;

  @ApiPropertyOptional({
    description: 'Status message',
    example: 'OK',
  })
  @IsOptional()
  @IsString()
  statusMessage?: string;

  @ApiPropertyOptional({
    description: 'Response headers',
    type: 'object',
    example: {
      'Content-Type': 'application/json',
      'X-Total-Count': '2450',
    },
  })
  @IsOptional()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Response body',
    type: 'object',
  })
  @IsOptional()
  body?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Response size in bytes',
    example: 1048576,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bodySizeBytes?: number;

  @ApiProperty({
    description: 'Response received timestamp',
    example: '2025-11-10T12:00:02Z',
  })
  @IsDate()
  @Type(() => Date)
  receivedAt: Date;

  @ApiPropertyOptional({
    description: 'Response processing time (ms)',
    example: 2340,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  processingTimeMs?: number;

  @ApiPropertyOptional({
    description: 'Error message if response is error',
    example: 'Invalid authentication credentials',
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({
    description: 'Error code from API',
    example: 'AUTH_INVALID',
  })
  @IsOptional()
  @IsString()
  errorCode?: string;

  @ApiPropertyOptional({
    description: 'Response contains sensitive data',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  containsSensitiveData?: boolean;

  @ApiPropertyOptional({
    description: 'Response parsed successfully',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  parseSuccessful?: boolean;
}

/**
 * API request/response transaction DTO
 */
export class ApiTransactionDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'TXN-2025001',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'System ID this transaction is for',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  systemId: string;

  @ApiProperty({
    description: 'API request',
    type: ApiRequestDto,
  })
  @ValidateNested()
  @Type(() => ApiRequestDto)
  request: ApiRequestDto;

  @ApiPropertyOptional({
    description: 'API response',
    type: ApiResponseDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ApiResponseDto)
  response?: ApiResponseDto;

  @ApiProperty({
    description: 'Transaction status',
    enum: ['success', 'failure', 'partial', 'pending'],
    example: 'success',
  })
  @IsEnum(['success', 'failure', 'partial', 'pending'])
  transactionStatus: string;

  @ApiPropertyOptional({
    description: 'Total transaction duration (seconds)',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({
    description: 'Transaction audit trail',
    type: [String],
    example: ['Request submitted', 'Awaiting response', 'Response received', 'Transaction completed'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  auditTrail?: string[];

  @ApiPropertyOptional({
    description: 'Data entities affected',
    type: [String],
    example: ['STU-2025001', 'STU-2025002'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedEntities?: string[];

  @ApiPropertyOptional({
    description: 'Transaction rollback required',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  rollbackRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Rollback completed timestamp',
    example: '2025-11-10T12:01:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  rollbackCompletedAt?: Date;
}

/**
 * API rate limit info DTO
 */
export class ApiRateLimitInfoDto {
  @ApiProperty({
    description: 'System ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  systemId: string;

  @ApiProperty({
    description: 'Requests allowed per time window',
    example: 1000,
  })
  @IsNumber()
  @Min(1)
  requestsAllowed: number;

  @ApiProperty({
    description: 'Time window in seconds',
    example: 3600,
  })
  @IsNumber()
  @Min(1)
  timeWindowSeconds: number;

  @ApiProperty({
    description: 'Requests made in current window',
    example: 752,
  })
  @IsNumber()
  @Min(0)
  requestsMade: number;

  @ApiProperty({
    description: 'Requests remaining in window',
    example: 248,
  })
  @IsNumber()
  @Min(0)
  requestsRemaining: number;

  @ApiProperty({
    description: 'Current rate limit status',
    enum: ['available', 'warning', 'throttled', 'exceeded'],
    example: 'available',
  })
  @IsEnum(['available', 'warning', 'throttled', 'exceeded'])
  status: string;

  @ApiPropertyOptional({
    description: 'Reset timestamp',
    example: '2025-11-10T13:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  windowResetAt?: Date;

  @ApiPropertyOptional({
    description: 'Percentage of limit used',
    example: 75.2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  percentageUsed?: number;

  @ApiPropertyOptional({
    description: 'Information URL for rate limit policy',
    example: 'https://api.external-system.com/docs/rate-limits',
  })
  @IsOptional()
  @IsUrl()
  policyUrl?: string;
}

/**
 * API webhook DTO
 */
export class ApiWebhookDto {
  @ApiProperty({
    description: 'Webhook ID',
    example: 'WEBHOOK-2025001',
  })
  @IsString()
  @IsNotEmpty()
  webhookId: string;

  @ApiProperty({
    description: 'Event type triggering webhook',
    example: 'student.enrollment.created',
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({
    description: 'Target URL for webhook',
    example: 'https://institution.edu/webhooks/enrollments',
  })
  @IsUrl()
  targetUrl: string;

  @ApiPropertyOptional({
    description: 'Webhook headers',
    type: 'object',
  })
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({
    description: 'Webhook is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Retry on failure',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  retryOnFailure?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum retry attempts',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxRetries?: number;

  @ApiPropertyOptional({
    description: 'Last triggered timestamp',
    example: '2025-11-10T12:05:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastTriggeredAt?: Date;

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-09-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;

  @ApiPropertyOptional({
    description: 'Webhook description',
    example: 'Notifies external system of new enrollment events',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
