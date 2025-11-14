import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface PhiDisclosureAuditAttributes {
  id?: string;
  disclosureId: string;
  action: string;
  changes?: any;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
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
  tableName: 'phi_disclosure_audits',
  timestamps: false,
  indexes: [
    {
      fields: ['disclosureId'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_phi_disclosure_audit_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_phi_disclosure_audit_updated_at',
    },
  ],
})
export class PhiDisclosureAudit
  extends Model<PhiDisclosureAuditAttributes>
  implements PhiDisclosureAuditAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./phi-disclosure.model').PhiDisclosure)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  disclosureId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  action: string;

  @AllowNull
  @Column(DataType.JSONB)
  changes?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  performedBy: string;

  @AllowNull
  @Column(DataType.STRING(45))
  ipAddress?: string;

  @AllowNull
  @Column(DataType.TEXT)
  userAgent?: string;

  @BelongsTo(() => require('./phi-disclosure.model').PhiDisclosure)
  declare disclosure: any;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: PhiDisclosureAudit) {
    await createModelAuditHook('PhiDisclosureAudit', instance);
  }
}

// Default export for Sequelize-TypeScript
export default PhiDisclosureAudit;
