import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'budget_categories',
  timestamps: true,
  underscored: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_budget_category_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_budget_category_updated_at',
    },
  ],
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
  })
  fiscalYear: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  allocatedAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  spentAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  // Relationships
  @HasMany(
    () => require('./budget-transaction.model').BudgetTransaction,
    'category_id',
  )
  declare transactions: any[];

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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: BudgetCategory) {
    await createModelAuditHook('BudgetCategory', instance);
  }
}

// Default export for Sequelize-TypeScript
export default BudgetCategory;
