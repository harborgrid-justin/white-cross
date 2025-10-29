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
;

export interface ConsentSignatureAttributes {
  id?: string;
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
  ipAddress?: string;
  signedAt: Date;
  withdrawnAt?: Date;
  withdrawnBy?: string;
  createdAt?: Date;
}

@Table({
  tableName: 'consent_signatures',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['consent_form_id', 'student_id'],
    },
    {
      fields: ['consent_form_id'],
    },
    {
      fields: ['student_id'],
    },
  ],
})
export class ConsentSignature extends Model<ConsentSignatureAttributes> implements ConsentSignatureAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./consent-form.model').ConsentForm)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'consent_form_id',
  })
  consentFormId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  studentId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'signed_by',
  })
  signedBy: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  relationship: string;

  @AllowNull
  @Column(DataType.TEXT)
  signatureData?: string;

  @AllowNull
  @Column(DataType.STRING(45))
  ipAddress?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
    field: 'signed_at',
  })
  signedAt: Date;

  @AllowNull
  @Column(DataType.DATE)
  withdrawnAt?: Date;

  @AllowNull
  @Column(DataType.STRING(255))
  withdrawnBy?: string;

  @BelongsTo(() => require('./consent-form.model').ConsentForm)
  declare consentForm: any;

  @Column(DataType.DATE)
  declare createdAt?: Date;
}