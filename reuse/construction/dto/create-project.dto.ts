
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsUUID,
  Min,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectPriority, DeliveryMethod } from '../types/project.types';

export class CreateConstructionProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Hospital Wing Renovation' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  projectName: string;

  @ApiProperty({ description: 'Project description', example: 'Renovation of the west wing, 3rd floor.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ProjectPriority, example: ProjectPriority.HIGH })
  @IsEnum(ProjectPriority)
  priority: ProjectPriority;

  @ApiProperty({ enum: DeliveryMethod, example: DeliveryMethod.DESIGN_BUILD })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({ description: 'Project manager ID (UUID)', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  projectManagerId: string;

  @ApiProperty({ description: 'Total project budget', example: 5000000 })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiProperty({ description: 'Baseline end date', example: '2026-12-31' })
  @Type(() => Date)
  @IsDate()
  baselineEndDate: Date;

  @ApiProperty({ description: 'District code', required: false, example: 'NWD' })
  @IsOptional()
  @IsString()
  districtCode?: string;
}
