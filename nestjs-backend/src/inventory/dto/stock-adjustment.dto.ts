import { IsInt, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StockAdjustmentDto {
  @ApiProperty({ description: 'Adjustment quantity (positive = add, negative = remove)', example: -5 })
  @IsInt()
  quantity: number;

  @ApiProperty({ description: 'Reason for adjustment', example: 'Damaged during inspection' })
  @IsString()
  @MaxLength(255)
  reason: string;

  @ApiProperty({ description: 'User UUID performing the adjustment' })
  @IsUUID()
  performedById: string;
}
