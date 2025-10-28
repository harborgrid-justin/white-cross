import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BudgetCategory } from './budget-category.entity';

/**
 * Budget Transaction Entity
 *
 * Represents individual spending transactions against budget categories.
 *
 * Business Rules:
 * - Each transaction must belong to an active budget category
 * - Amount is always positive (represents spending)
 * - Transactions can reference external entities (POs, Invoices)
 * - Transaction date defaults to creation time
 * - Updating/deleting transactions automatically adjusts category spent amount
 */
@Entity('budget_transactions')
export class BudgetTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp', name: 'transaction_date' })
  transactionDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'reference_id' })
  referenceId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'reference_type' })
  referenceType: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => BudgetCategory, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: BudgetCategory;
}
