import { IsNotEmpty, IsString, IsNumber, IsUUID, IsOptional, Min, MaxLength } from 'class-validator';

/**
 * DTO for creating a new budget transaction
 */
export class CreateBudgetTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  referenceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
