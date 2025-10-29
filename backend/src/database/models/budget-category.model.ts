import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { BudgetTransaction } from './budget-transaction.model';

/**
 * Budget Category Model
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
@Table({
  tableName: 'budget_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BudgetCategory extends Model<BudgetCategory> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'fiscal_year',
  })
  fiscalYear: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'allocated_amount',
  })
  allocatedAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'spent_amount',
  })
  spentAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  // Relationships
  @HasMany(() => BudgetTransaction, 'category_id')
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