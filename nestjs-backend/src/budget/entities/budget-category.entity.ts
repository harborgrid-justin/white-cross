import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BudgetTransaction } from './budget-transaction.entity';

/**
 * Budget Category Entity
 *
 * Represents a budget category for fiscal year tracking.
 * Fiscal year runs from July 1 to June 30.
 *
 * Business Rules:
 * - Each category has an allocated amount for a fiscal year
 * - Spent amount is automatically updated when transactions are created
 * - Soft delete via isActive flag preserves historical data
 * - Over-budget spending is allowed but generates warnings
 */
@Entity('budget_categories')
export class BudgetCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', name: 'fiscal_year' })
  fiscalYear: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'allocated_amount'
  })
  allocatedAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'spent_amount'
  })
  spentAmount: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => BudgetTransaction, (transaction) => transaction.category)
  transactions: BudgetTransaction[];

  // Virtual properties for calculations
  get remainingAmount(): number {
    return Number(this.allocatedAmount) - Number(this.spentAmount);
  }

  get utilizationPercentage(): number {
    const allocated = Number(this.allocatedAmount);
    const spent = Number(this.spentAmount);
    return allocated > 0 ? Math.round((spent / allocated) * 10000) / 100 : 0;
  }

  get isOverBudget(): boolean {
    return Number(this.spentAmount) > Number(this.allocatedAmount);
  }
}
