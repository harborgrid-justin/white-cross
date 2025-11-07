import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for filling a prescription at pharmacy
 */
export class FillPrescriptionDto {
  @ApiProperty({ description: 'Pharmacy name', example: 'CVS Pharmacy #1234' })
  @IsString()
  pharmacyName: string;

  @ApiProperty({
    description: 'Quantity actually filled',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantityFilled: number;

  @ApiProperty({
    description: 'Date prescription was filled',
    example: '2025-10-28T10:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  filledDate: Date;

  @ApiPropertyOptional({
    description: 'Refill number (0 for initial fill)',
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  refillNumber?: number = 0;

  @ApiPropertyOptional({ description: 'Additional notes about the fill' })
  @IsString()
  @IsOptional()
  notes?: string;
}
