import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { PhiDisclosure } from './phi-disclosure.model';

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

@Table({
  tableName: 'phi_disclosure_audits',
  timestamps: false,
  indexes: [
    {
      fields: ['disclosure_id'],
    },
  ],
})
export class PhiDisclosureAudit extends Model<PhiDisclosureAuditAttributes> implements PhiDisclosureAuditAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => PhiDisclosure)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'disclosure_id',
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
    field: 'performed_by',
  })
  performedBy: string;

  @AllowNull
  @Column(DataType.STRING(45))
  ipAddress?: string;

  @AllowNull
  @Column(DataType.TEXT)
  userAgent?: string;

  @BelongsTo(() => PhiDisclosure)
  disclosure: PhiDisclosure;

  @Column(DataType.DATE)
  declare createdAt?: Date;
}
