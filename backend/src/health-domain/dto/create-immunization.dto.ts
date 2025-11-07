import {
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VaccineType } from '../../health-record/interfaces/vaccination.interface';

export class CreateImmunizationDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: VaccineType })
  @IsEnum(VaccineType)
  vaccineType: VaccineType;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  administrationDate: Date;

  @ApiProperty()
  @IsString()
  administeredBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cvxCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ndcCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  doseNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalDoses?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextDueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  site?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  route?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dosageAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reactions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
