import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionType } from '../entities/inventory-transaction.entity';

export class CreateInventoryTransactionDto {
  @ApiProperty({ description: 'Inventory item UUID' })
  @IsUUID()
  inventoryItemId!: string;

  @ApiProperty({
    enum: InventoryTransactionType,
    description: 'Transaction type',
  })
  @IsEnum(InventoryTransactionType)
  type!: InventoryTransactionType;

  @ApiProperty({
    description: 'Quantity (positive for additions, negative for removals)',
    example: 100,
  })
  @IsInt()
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Unit cost at time of transaction',
    example: 5.99,
  })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiPropertyOptional({
    description: 'Reason for transaction',
    example: 'Annual restock',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @ApiPropertyOptional({
    description: 'Batch number',
    example: 'BATCH-2024-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  batchNumber?: string;

  @ApiPropertyOptional({
    description: 'Expiration date (ISO 8601)',
    example: '2025-12-31T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiProperty({ description: 'User UUID who performed the transaction' })
  @IsUUID()
  performedById!: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
