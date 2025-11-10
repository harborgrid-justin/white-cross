import { IsBoolean, IsDate, IsNumber, IsObject, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransitionCriteriaDto {
  @ApiPropertyOptional({
    description: 'Minimum attendance percentage required for promotion',
    minimum: 0,
    maximum: 100,
    default: 90,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumAttendance?: number;

  @ApiPropertyOptional({
    description: 'Minimum GPA required for promotion',
    minimum: 0,
    maximum: 4,
    default: 2.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  minimumGPA?: number;

  @ApiPropertyOptional({
    description: 'Required credits by grade level',
  })
  @IsOptional()
  @IsObject()
  requiredCredits?: Record<string, number>;
}

export class BulkTransitionDto {
  @ApiProperty({
    description: 'Date when grade transitions take effect',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  effectiveDate: Date;

  @ApiPropertyOptional({
    description: 'Whether to perform actual transitions or just simulation',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @ApiPropertyOptional({
    description: 'Promotion criteria',
    type: TransitionCriteriaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransitionCriteriaDto)
  criteria?: TransitionCriteriaDto;
}
