
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CloseoutStatus, InspectionResult, PaymentStatus } from '../types/closeout.types';

export class UpdateConstructionCloseoutDto {
  @ApiPropertyOptional({ enum: CloseoutStatus })
  @IsOptional()
  @IsEnum(CloseoutStatus)
  status?: CloseoutStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  substantialCompletionDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalCompletionDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  certificateOfOccupancyDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  finalInspectionScheduled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalInspectionDate?: Date;

  @ApiPropertyOptional({ enum: InspectionResult })
  @IsOptional()
  @IsEnum(InspectionResult)
  finalInspectionResult?: InspectionResult;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ownerTrainingRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ownerTrainingCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ownerTrainingDate?: Date;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  finalPaymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalPaymentDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  lessonsLearnedCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
