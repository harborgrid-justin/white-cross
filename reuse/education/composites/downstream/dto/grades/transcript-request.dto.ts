/**
 * Transcript Request DTOs for managing transcript requests
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsEmail,
} from 'class-validator';

export enum TranscriptType {
  OFFICIAL = 'official',
  UNOFFICIAL = 'unofficial',
  PARTIAL = 'partial',
  DEGREE_AUDIT = 'degree_audit',
}

export enum TranscriptRequestStatus {
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  READY = 'ready',
  SENT = 'sent',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export enum TranscriptDelivery {
  ELECTRONIC = 'electronic',
  MAIL = 'mail',
  PICKUP = 'pickup',
  SECURE_LINK = 'secure_link',
}

export class TranscriptRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student email',
    example: 'john.doe@university.edu',
  })
  @IsEmail()
  studentEmail: string;

  @ApiProperty({
    description: 'Transcript type',
    enum: TranscriptType,
  })
  @IsEnum(TranscriptType)
  transcriptType: TranscriptType;

  @ApiProperty({
    description: 'Number of copies',
    example: 3,
    minimum: 1,
    maximum: 50,
  })
  @IsNumber()
  @Min(1)
  @Max(50)
  numberOfCopies: number;

  @ApiProperty({
    description: 'Delivery method',
    enum: TranscriptDelivery,
  })
  @IsEnum(TranscriptDelivery)
  deliveryMethod: TranscriptDelivery;

  @ApiPropertyOptional({
    description: 'Recipient name',
    example: 'Dr. Jane Smith',
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Recipient organization',
    example: 'Graduate School, State University',
  })
  @IsOptional()
  @IsString()
  recipientOrganization?: string;

  @ApiPropertyOptional({
    description: 'Recipient address',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  recipientAddress?: string;

  @ApiPropertyOptional({
    description: 'Include degree audit',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  includeDegreeAudit?: boolean;

  @ApiPropertyOptional({
    description: 'Include academic standing',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeAcademicStanding?: boolean;

  @ApiPropertyOptional({
    description: 'Expedited processing',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  expedited?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class TranscriptRequestResponseDto {
  @ApiProperty({
    description: 'Transcript request identifier',
    example: 'TR-2024001',
  })
  requestId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Student email',
    example: 'john.doe@university.edu',
  })
  studentEmail: string;

  @ApiProperty({
    description: 'Transcript type',
    enum: TranscriptType,
  })
  transcriptType: TranscriptType;

  @ApiProperty({
    description: 'Request status',
    enum: TranscriptRequestStatus,
  })
  status: TranscriptRequestStatus;

  @ApiProperty({
    description: 'Number of copies requested',
    example: 3,
    minimum: 1,
  })
  numberOfCopies: number;

  @ApiProperty({
    description: 'Delivery method',
    enum: TranscriptDelivery,
  })
  deliveryMethod: TranscriptDelivery;

  @ApiPropertyOptional({
    description: 'Recipient information',
    type: 'object',
  })
  @IsOptional()
  recipient?: {
    name?: string;
    organization?: string;
    address?: string;
  };

  @ApiProperty({
    description: 'Request creation date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  requestedDate: Date;

  @ApiPropertyOptional({
    description: 'Processing started date',
    example: '2025-11-10T14:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  processingDate?: Date;

  @ApiPropertyOptional({
    description: 'Ready/sent date',
    example: '2025-11-11T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  completionDate?: Date;

  @ApiProperty({
    description: 'Request fee',
    example: 5.00,
    minimum: 0,
  })
  fee: number;

  @ApiProperty({
    description: 'Fee paid',
    example: true,
  })
  feePaid: boolean;

  @ApiPropertyOptional({
    description: 'Transcript reference number',
    example: 'TREF-123456789',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Download link (for electronic delivery)',
    example: 'https://transcripts.university.edu/download/TREF-123456789',
  })
  @IsOptional()
  downloadLink?: string;

  @ApiPropertyOptional({
    description: 'Download link expiration',
    example: '2025-12-11T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  linkExpiration?: Date;
}

export class BulkTranscriptRequestDto {
  @ApiProperty({
    description: 'Transcript requests',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptRequestDto)
  requests: TranscriptRequestDto[];

  @ApiPropertyOptional({
    description: 'Batch processing ID',
    example: 'BATCH-2024001',
  })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class TranscriptQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Request status filter',
    enum: TranscriptRequestStatus,
  })
  @IsOptional()
  @IsEnum(TranscriptRequestStatus)
  status?: TranscriptRequestStatus;

  @ApiPropertyOptional({
    description: 'Transcript type filter',
    enum: TranscriptType,
  })
  @IsOptional()
  @IsEnum(TranscriptType)
  transcriptType?: TranscriptType;

  @ApiPropertyOptional({
    description: 'Delivery method filter',
    enum: TranscriptDelivery,
  })
  @IsOptional()
  @IsEnum(TranscriptDelivery)
  deliveryMethod?: TranscriptDelivery;

  @ApiPropertyOptional({
    description: 'Fee paid filter',
  })
  @IsOptional()
  @IsBoolean()
  feePaid?: boolean;

  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class StudentTranscriptContentDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Student ID number',
    example: '202401234',
  })
  studentNumber: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '2000-05-15T00:00:00Z',
  })
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Degree awarded',
    example: 'Bachelor of Science',
  })
  degreeAwarded: string;

  @ApiProperty({
    description: 'Major/Concentration',
    example: 'Computer Science',
  })
  major: string;

  @ApiProperty({
    description: 'Overall GPA',
    example: 3.75,
    minimum: 0,
    maximum: 4,
  })
  overallGPA: number;

  @ApiProperty({
    description: 'Major GPA',
    example: 3.85,
    minimum: 0,
    maximum: 4,
  })
  majorGPA: number;

  @ApiProperty({
    description: 'Graduation date',
    example: '2024-05-10T00:00:00Z',
  })
  @Type(() => Date)
  graduationDate: Date;

  @ApiProperty({
    description: 'Academic records',
    type: 'array',
  })
  records: Array<{
    term: string;
    courses: Array<{
      courseId: string;
      courseTitle: string;
      credits: number;
      grade: string;
      gradePoints: number;
    }>;
    termGPA: number;
    creditsEarned: number;
  }>;

  @ApiProperty({
    description: 'Academic standing',
    example: 'Good Academic Standing',
  })
  academicStanding: string;

  @ApiProperty({
    description: 'Total credits earned',
    example: 120,
    minimum: 0,
  })
  totalCreditsEarned: number;

  @ApiProperty({
    description: 'Transcript generated date',
    example: '2025-11-11T10:00:00Z',
  })
  @Type(() => Date)
  generatedDate: Date;
}

export class TranscriptRequestHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Transcript request history',
    type: 'array',
  })
  history: Array<{
    requestId: string;
    transcriptType: TranscriptType;
    numberOfCopies: number;
    status: TranscriptRequestStatus;
    requestedDate: Date;
    completionDate?: Date;
    fee: number;
  }>;

  @ApiProperty({
    description: 'Total requests',
    example: 5,
    minimum: 0,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Pending requests',
    example: 1,
    minimum: 0,
  })
  pendingRequests: number;

  @ApiProperty({
    description: 'Completed requests',
    example: 4,
    minimum: 0,
  })
  completedRequests: number;

  @ApiProperty({
    description: 'Total fees paid',
    example: 20.00,
    minimum: 0,
  })
  totalFeesPaid: number;
}

export class TranscriptStatisticsDto {
  @ApiProperty({
    description: 'Total requests',
    example: 1250,
    minimum: 0,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Requests by status',
    type: 'object',
  })
  byStatus: Record<TranscriptRequestStatus, number>;

  @ApiProperty({
    description: 'Requests by type',
    type: 'object',
  })
  byType: Record<TranscriptType, number>;

  @ApiProperty({
    description: 'Requests by delivery method',
    type: 'object',
  })
  byDelivery: Record<TranscriptDelivery, number>;

  @ApiProperty({
    description: 'Average processing time (hours)',
    example: 24.5,
    minimum: 0,
  })
  averageProcessingTime: number;

  @ApiProperty({
    description: 'Total revenue from fees',
    example: 6250.00,
    minimum: 0,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Unpaid fees amount',
    example: 75.00,
    minimum: 0,
  })
  unpaidFees: number;
}
