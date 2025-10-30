import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;

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
      fields: ['disclosureId']
  },
  ]
  })
export class PhiDisclosureAudit extends Model<PhiDisclosureAuditAttributes> implements PhiDisclosureAuditAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./phi-disclosure.model').PhiDisclosure)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  disclosureId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  action: string;

  @AllowNull
  @Column(DataType.JSONB)
  changes?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false
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
}
