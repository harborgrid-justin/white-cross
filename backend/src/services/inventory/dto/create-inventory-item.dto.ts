import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'Item name', example: 'Ibuprofen 200mg' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'Item category', example: 'MEDICATION' })
  @IsString()
  @MaxLength(100)
  category!: string;

  @ApiPropertyOptional({ description: 'Item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'SKU/Product code', example: 'IBU-200' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Supplier name',
    example: 'MedSupply Inc.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  supplier?: string;

  @ApiPropertyOptional({ description: 'Unit cost', example: 5.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCost?: number;

  @ApiProperty({ description: 'Reorder level (trigger point)', example: 50 })
  @IsInt()
  @Min(0)
  reorderLevel!: number;

  @ApiProperty({
    description: 'Reorder quantity (amount to order)',
    example: 200,
  })
  @IsInt()
  @Min(1)
  reorderQuantity!: number;

  @ApiPropertyOptional({
    description: 'Storage location',
    example: 'Nurse Office - Cabinet A',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
