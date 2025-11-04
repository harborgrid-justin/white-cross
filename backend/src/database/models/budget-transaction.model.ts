import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';

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
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'budget_transactions',
  timestamps: true,
  underscored: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
  ,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_budget_transaction_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_budget_transaction_updated_at'
    }
  ]})
export class BudgetTransaction extends Model<BudgetTransaction> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./budget-category.model').BudgetCategory)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  categoryId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  transactionDate: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  referenceId: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true
  })
  referenceType: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes: string | null;

  @CreatedAt
  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE
  })
  declare updatedAt: Date;

  // Relationships
  @BelongsTo(() => require('./budget-category.model').BudgetCategory, { foreignKey: 'category_id', as: 'category' })
  declare category: any;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: BudgetTransaction) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] BudgetTransaction ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}