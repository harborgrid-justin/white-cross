import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseOrderItemDto {
  @ApiProperty({ description: 'Inventory item UUID' })
  @IsUUID()
  inventoryItemId!: string;

  @ApiProperty({ description: 'Order quantity', example: 100 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Unit cost', example: 5.99 })
  @IsNumber()
  @Min(0)
  unitCost!: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ description: 'Unique order number', example: 'PO-2024-001' })
  @IsString()
  @MaxLength(100)
  orderNumber!: string;

  @ApiProperty({ description: 'Vendor UUID' })
  @IsUUID()
  vendorId!: string;

  @ApiProperty({
    description: 'Order date (ISO 8601)',
    example: '2024-10-28T00:00:00Z',
  })
  @IsDateString()
  orderDate!: string;

  @ApiPropertyOptional({
    description: 'Expected delivery date (ISO 8601)',
    example: '2024-11-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  expectedDate?: string;

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Order line items',
    type: [PurchaseOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items!: PurchaseOrderItemDto[];
}
