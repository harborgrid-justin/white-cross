import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetTransactionDto } from './create-budget-transaction.dto';

/**
 * DTO for updating an existing budget transaction
 * All fields are optional
 */
export class UpdateBudgetTransactionDto extends PartialType(
  CreateBudgetTransactionDto,
) {}
