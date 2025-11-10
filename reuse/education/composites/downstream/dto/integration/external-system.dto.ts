/**
 * External System DTOs for integration domain
 * Manages configurations and connections to external systems
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

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  TESTING = 'testing',
}

export enum AuthenticationMethod {
  BASIC = 'basic',
  OAUTH2 = 'oauth2',
  API_KEY = 'api_key',
  JWT = 'jwt',
  CERTIFICATE = 'certificate',
  SAML = 'saml',
}

export enum IntegrationProtocol {
  REST = 'rest',
  SOAP = 'soap',
  SFTP = 'sftp',
  FTP = 'ftp',
  FILE_DROP = 'file_drop',
  WEBHOOK = 'webhook',
  DIRECT_DB = 'direct_db',
}

/**
 * External system configuration DTO
 */
export class ExternalSystemConfigDto {
  @ApiProperty({
    description: 'System configuration ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'External system name',
    example: 'Banner ERP System',
  })
  @IsString()
  @IsNotEmpty()
  systemName: string;

  @ApiPropertyOptional({
    description: 'System description',
    example: 'Enterprise Resource Planning system for financial and HR',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'System vendor',
    example: 'Ellucian',
  })
  @IsString()
  @IsNotEmpty()
  vendor: string;

  @ApiProperty({
    description: 'Integration protocol',
    enum: IntegrationProtocol,
    example: IntegrationProtocol.REST,
  })
  @IsEnum(IntegrationProtocol)
  protocol: IntegrationProtocol;

  @ApiProperty({
    description: 'Authentication method',
    enum: AuthenticationMethod,
    example: AuthenticationMethod.API_KEY,
  })
  @IsEnum(AuthenticationMethod)
  authenticationMethod: AuthenticationMethod;

  @ApiPropertyOptional({
    description: 'System base URL/endpoint',
    example: 'https://banner.institution.edu/api',
  })
  @IsOptional()
  @IsUrl()
  endpoint?: string;

  @ApiPropertyOptional({
    description: 'API version',
    example: 'v2',
  })
  @IsOptional()
  @IsString()
  apiVersion?: string;

  @ApiPropertyOptional({
    description: 'Connection timeout (seconds)',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  connectionTimeout?: number;

  @ApiPropertyOptional({
    description: 'Read timeout (seconds)',
    example: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readTimeout?: number;

  @ApiPropertyOptional({
    description: 'Retry attempts on failure',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  retryAttempts?: number;

  @ApiProperty({
    description: 'Integration status',
    enum: IntegrationStatus,
    example: IntegrationStatus.ACTIVE,
  })
  @IsEnum(IntegrationStatus)
  status: IntegrationStatus;

  @ApiPropertyOptional({
    description: 'System is enabled for use',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'System version',
    example: '9.4',
  })
  @IsOptional()
  @IsString()
  systemVersion?: string;

  @ApiPropertyOptional({
    description: 'Last connection test timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastTestedAt?: Date;

  @ApiPropertyOptional({
    description: 'Last successful sync timestamp',
    example: '2025-11-10T11:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastSyncAt?: Date;

  @ApiPropertyOptional({
    description: 'Contact person for system',
    example: 'John IT Manager',
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({
    description: 'Support email or ticket system',
    example: 'support@vendor.com',
  })
  @IsOptional()
  @IsString()
  supportContact?: string;

  @ApiPropertyOptional({
    description: 'Additional configuration parameters',
    type: 'object',
  })
  @IsOptional()
  additionalConfig?: Record<string, any>;
}

/**
 * Integration credentials DTO
 */
export class IntegrationCredentialsDto {
  @ApiProperty({
    description: 'Credential ID',
    example: 'CRED-2025001',
  })
  @IsString()
  @IsNotEmpty()
  credentialId: string;

  @ApiProperty({
    description: 'System configuration ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Username or client ID',
    example: 'api_user_123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    description: 'Password (encrypted)',
    example: 'encrypted_password_hash',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'API Key (encrypted)',
    example: 'encrypted_api_key_hash',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiPropertyOptional({
    description: 'OAuth2 client secret (encrypted)',
    example: 'encrypted_secret_hash',
  })
  @IsOptional()
  @IsString()
  clientSecret?: string;

  @ApiPropertyOptional({
    description: 'JWT signing key (encrypted)',
    example: 'encrypted_key_hash',
  })
  @IsOptional()
  @IsString()
  jwtSecret?: string;

  @ApiPropertyOptional({
    description: 'Certificate path or content (encrypted)',
    example: 'encrypted_cert_content',
  })
  @IsOptional()
  @IsString()
  certificateContent?: string;

  @ApiProperty({
    description: 'Credentials last rotated date',
    example: '2025-09-10',
  })
  @IsDate()
  @Type(() => Date)
  lastRotatedDate: Date;

  @ApiProperty({
    description: 'Credentials are active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Credentials expiration date',
    example: '2026-09-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({
    description: 'Encrypted flag (not returned in response)',
    example: true,
  })
  @IsBoolean()
  isEncrypted: boolean;
}

/**
 * System health check result DTO
 */
export class SystemHealthCheckResultDto {
  @ApiProperty({
    description: 'Health check ID',
    example: 'HEALTH-CHECK-2025001',
  })
  @IsString()
  @IsNotEmpty()
  healthCheckId: string;

  @ApiProperty({
    description: 'System configuration ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Health status',
    enum: ['healthy', 'degraded', 'unhealthy', 'unknown'],
    example: 'healthy',
  })
  @IsEnum(['healthy', 'degraded', 'unhealthy', 'unknown'])
  status: string;

  @ApiPropertyOptional({
    description: 'Response time (ms)',
    example: 245,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  responseTime?: number;

  @ApiPropertyOptional({
    description: 'Service availability percentage',
    example: 99.8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availabilityPercentage?: number;

  @ApiPropertyOptional({
    description: 'Last error message',
    example: 'Connection timeout',
  })
  @IsOptional()
  @IsString()
  lastErrorMessage?: string;

  @ApiPropertyOptional({
    description: 'Number of failed attempts',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  failedAttempts?: number;

  @ApiPropertyOptional({
    description: 'Check timestamp',
    example: '2025-11-10T12:05:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  checkedAt?: Date;

  @ApiPropertyOptional({
    description: 'Database connectivity status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  databaseConnected?: boolean;

  @ApiPropertyOptional({
    description: 'Authentication status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  authenticationValid?: boolean;

  @ApiPropertyOptional({
    description: 'Data sync status',
    example: 'in_sync',
  })
  @IsOptional()
  @IsString()
  dataSyncStatus?: string;

  @ApiPropertyOptional({
    description: 'Health check details/diagnostics',
    type: 'object',
  })
  @IsOptional()
  diagnostics?: Record<string, any>;
}

/**
 * Integration mapping configuration DTO
 */
export class IntegrationMappingDto {
  @ApiProperty({
    description: 'Mapping ID',
    example: 'MAPPING-2025001',
  })
  @IsString()
  @IsNotEmpty()
  mappingId: string;

  @ApiProperty({
    description: 'Source field name',
    example: 'banner_student_id',
  })
  @IsString()
  @IsNotEmpty()
  sourceField: string;

  @ApiProperty({
    description: 'Target field name',
    example: 'student_id',
  })
  @IsString()
  @IsNotEmpty()
  targetField: string;

  @ApiPropertyOptional({
    description: 'Data transformation rule',
    example: 'SUBSTRING(source, 1, 8)',
  })
  @IsOptional()
  @IsString()
  transformationRule?: string;

  @ApiPropertyOptional({
    description: 'Data type conversion',
    enum: ['string', 'number', 'date', 'boolean', 'custom'],
    example: 'string',
  })
  @IsOptional()
  @IsEnum(['string', 'number', 'date', 'boolean', 'custom'])
  dataTypeConversion?: string;

  @ApiPropertyOptional({
    description: 'Default value if source is null',
    example: 'N/A',
  })
  @IsOptional()
  defaultValue?: any;

  @ApiProperty({
    description: 'Mapping is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Mapping notes',
    example: 'Maps external system ID to internal student ID',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * System endpoint test DTO
 */
export class SystemEndpointTestDto {
  @ApiProperty({
    description: 'Test ID',
    example: 'TEST-2025001',
  })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({
    description: 'System configuration ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Test endpoint path',
    example: '/api/v2/students',
  })
  @IsString()
  @IsNotEmpty()
  endpointPath: string;

  @ApiProperty({
    description: 'HTTP method used',
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    example: 'GET',
  })
  @IsEnum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
  httpMethod: string;

  @ApiProperty({
    description: 'Test status code',
    example: 200,
  })
  @IsNumber()
  @Min(100)
  statusCode: number;

  @ApiPropertyOptional({
    description: 'Response time (ms)',
    example: 342,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  responseTime?: number;

  @ApiProperty({
    description: 'Test result',
    enum: ['success', 'failure', 'timeout', 'error'],
    example: 'success',
  })
  @IsEnum(['success', 'failure', 'timeout', 'error'])
  result: string;

  @ApiPropertyOptional({
    description: 'Response body or error message',
    example: 'Success: Retrieved 150 records',
  })
  @IsOptional()
  @IsString()
  responseMessage?: string;

  @ApiProperty({
    description: 'Test execution timestamp',
    example: '2025-11-10T12:10:00Z',
  })
  @IsDate()
  @Type(() => Date)
  testedAt: Date;
}
