import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { BudgetCategory } from './budget-category.model';

/**
 * Budget Transaction Model
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
@Table({
  tableName: 'budget_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BudgetTransaction extends Model<BudgetTransaction> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => BudgetCategory)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'category_id',
  })
  categoryId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'transaction_date',
  })
  transactionDate: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reference_id',
  })
  referenceId: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'reference_type',
  })
  referenceType: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string | null;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => BudgetCategory, 'category_id')
  category: BudgetCategory;
}