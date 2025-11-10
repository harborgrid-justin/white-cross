/**
 * Award Package DTOs for financial aid award packages
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
} from 'class-validator';

export enum AwardType {
  GRANT = 'grant',
  SCHOLARSHIP = 'scholarship',
  LOAN = 'loan',
  WORK_STUDY = 'work_study',
  TUITION_WAIVER = 'tuition_waiver',
}

export enum AwardStatus {
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  DISBURSED = 'disbursed',
  CANCELLED = 'cancelled',
}

export class AwardDto {
  @ApiProperty({
    description: 'Award identifier',
    example: 'AWD-2024001',
  })
  awardId: string;

  @ApiProperty({
    description: 'Award type',
    enum: AwardType,
  })
  awardType: AwardType;

  @ApiProperty({
    description: 'Award name',
    example: 'Merit Scholarship',
  })
  awardName: string;

  @ApiProperty({
    description: 'Award amount',
    example: 5000.00,
    minimum: 0,
  })
  amount: number;

  @ApiProperty({
    description: 'Award status',
    enum: AwardStatus,
  })
  status: AwardStatus;

  @ApiPropertyOptional({
    description: 'Award description',
    maxLength: 500,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Award conditions',
    type: [String],
  })
  @IsOptional()
  conditions?: string[];

  @ApiPropertyOptional({
    description: 'Offer expiration date',
    example: '2025-12-31T23:59:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  expirationDate?: Date;
}

export class AwardPackageRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Financial aid year',
    example: '2025-2026',
  })
  @IsString()
  @IsNotEmpty()
  aidYear: string;

  @ApiPropertyOptional({
    description: 'Generate package automatically',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  autoGenerate?: boolean;
}

export class AwardPackageResponseDto {
  @ApiProperty({
    description: 'Award package identifier',
    example: 'PKG-2024001',
  })
  packageId: string;

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
    description: 'Financial aid year',
    example: '2025-2026',
  })
  aidYear: string;

  @ApiProperty({
    description: 'Package creation date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  createdDate: Date;

  @ApiProperty({
    description: 'Cost of attendance',
    example: 50000.00,
    minimum: 0,
  })
  costOfAttendance: number;

  @ApiProperty({
    description: 'Expected family contribution',
    example: 5000.00,
    minimum: 0,
  })
  expectedFamilyContribution: number;

  @ApiProperty({
    description: 'Financial need',
    example: 45000.00,
    minimum: 0,
  })
  financialNeed: number;

  @ApiProperty({
    description: 'Awards included in package',
    type: 'array',
    isArray: true,
  })
  awards: AwardDto[];

  @ApiProperty({
    description: 'Total grants amount',
    example: 15000.00,
    minimum: 0,
  })
  totalGrants: number;

  @ApiProperty({
    description: 'Total scholarships amount',
    example: 10000.00,
    minimum: 0,
  })
  totalScholarships: number;

  @ApiProperty({
    description: 'Total loans amount',
    example: 12000.00,
    minimum: 0,
  })
  totalLoans: number;

  @ApiProperty({
    description: 'Total work study amount',
    example: 2500.00,
    minimum: 0,
  })
  totalWorkStudy: number;

  @ApiProperty({
    description: 'Total package amount',
    example: 39500.00,
    minimum: 0,
  })
  totalPackage: number;

  @ApiProperty({
    description: 'Gap amount (unmet need)',
    example: 5500.00,
    minimum: 0,
  })
  gapAmount: number;

  @ApiPropertyOptional({
    description: 'Package acceptance deadline',
    example: '2025-12-31T23:59:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  acceptanceDeadline?: Date;
}

export class AwardPackageUpdateDto {
  @ApiPropertyOptional({
    description: 'Awards to add or modify',
    type: 'array',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardModificationDto)
  awards?: AwardModificationDto[];

  @ApiPropertyOptional({
    description: 'Update notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AwardModificationDto {
  @ApiProperty({
    description: 'Award identifier',
    example: 'AWD-2024001',
  })
  @IsString()
  @IsNotEmpty()
  awardId: string;

  @ApiProperty({
    description: 'Action to perform',
    enum: ['add', 'modify', 'remove'],
  })
  @IsEnum(['add', 'modify', 'remove'])
  action: 'add' | 'modify' | 'remove';

  @ApiPropertyOptional({
    description: 'New amount',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'New status',
    enum: AwardStatus,
  })
  @IsOptional()
  @IsEnum(AwardStatus)
  status?: AwardStatus;
}

export class AwardPackageAcceptanceDto {
  @ApiProperty({
    description: 'Award package identifier',
    example: 'PKG-2024001',
  })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Acceptance action',
    enum: ['accept', 'decline'],
  })
  @IsEnum(['accept', 'decline'])
  action: 'accept' | 'decline';

  @ApiPropertyOptional({
    description: 'Awards to accept/decline individually',
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  awardDecisions?: Array<{
    awardId: string;
    action: 'accept' | 'decline';
  }>;

  @ApiPropertyOptional({
    description: 'Reason for declining',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AwardPackageQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Aid year filter',
  })
  @IsOptional()
  @IsString()
  aidYear?: string;

  @ApiPropertyOptional({
    description: 'Award type filter',
    enum: AwardType,
  })
  @IsOptional()
  @IsEnum(AwardType)
  awardType?: AwardType;

  @ApiPropertyOptional({
    description: 'Status filter',
    enum: AwardStatus,
  })
  @IsOptional()
  @IsEnum(AwardStatus)
  status?: AwardStatus;

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

export class AwardPackageComparisonDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Current aid year package',
    type: () => AwardPackageResponseDto,
  })
  currentPackage: AwardPackageResponseDto;

  @ApiPropertyOptional({
    description: 'Previous year package',
    type: () => AwardPackageResponseDto,
  })
  @IsOptional()
  previousPackage?: AwardPackageResponseDto;

  @ApiProperty({
    description: 'Year over year comparison',
    type: 'object',
  })
  comparison: {
    totalPackageChange: number;
    totalPackageChangePercent: number;
    grantsChange: number;
    loansChange: number;
    scholarshipsChange: number;
  };
}

export class AwardPackageStatisticsDto {
  @ApiProperty({
    description: 'Aid year',
    example: '2025-2026',
  })
  aidYear: string;

  @ApiProperty({
    description: 'Total students with packages',
    example: 5000,
    minimum: 0,
  })
  totalStudents: number;

  @ApiProperty({
    description: 'Average total package',
    example: 35000.00,
    minimum: 0,
  })
  averagePackage: number;

  @ApiProperty({
    description: 'Average grants per student',
    example: 12000.00,
    minimum: 0,
  })
  averageGrants: number;

  @ApiProperty({
    description: 'Total funds distributed',
    example: 175000000.00,
    minimum: 0,
  })
  totalFundsDistributed: number;

  @ApiProperty({
    description: 'Average unmet need',
    example: 5500.00,
    minimum: 0,
  })
  averageUnmetNeed: number;
}
