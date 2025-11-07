import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new budget transaction
 */
export class CreateBudgetTransactionDto {
  @ApiProperty({
    description: 'UUID of the budget category this transaction belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Transaction amount in dollars (must be positive)',
    example: 125.5,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Description of what this transaction is for',
    example: 'Purchase of 50 boxes of bandages from MedSupply Inc.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'External reference ID (e.g., invoice number, PO number)',
    example: 'INV-2025-001234',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  referenceId?: string;

  @ApiPropertyOptional({
    description:
      'Type of reference (e.g., invoice, purchase_order, reimbursement)',
    example: 'invoice',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceType?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about this transaction',
    example: 'Emergency purchase approved by Director Smith',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
