import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface SupplierAttributes {
  id?: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'suppliers',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_supplier_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_supplier_updated_at',
    },
  ],
})
export class Supplier
  extends Model<SupplierAttributes>
  implements SupplierAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING(255))
  contactName?: string;

  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(50))
  phone?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Supplier) {
    await createModelAuditHook('Supplier', instance);
  }
}

// Default export for Sequelize-TypeScript
export default Supplier;
