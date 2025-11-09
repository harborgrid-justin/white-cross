
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsUUID,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ChangeOrderType } from '../models/change-order.model';

export class CreateChangeOrderDto {
  @ApiProperty({ description: 'Project ID (UUID). Should match the URL parameter.' })
  @IsUUID()
  @IsOptional() // Will be populated from URL param in controller
  projectId: string;

  @ApiProperty({ description: 'Title of the change order', example: 'Add Emergency Generator' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Detailed description of the change', example: 'Install a 500kW backup generator as per revised electrical plan E-2.' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ChangeOrderType, example: ChangeOrderType.SCOPE })
  @IsEnum(ChangeOrderType)
  changeType: ChangeOrderType;

  @ApiProperty({ description: 'Cost impact of the change', example: 150000 })
  @IsNumber()
  costImpact: number;

  @ApiProperty({ description: 'Schedule impact in days', example: 14 })
  @IsNumber()
  scheduleImpact: number;
}
