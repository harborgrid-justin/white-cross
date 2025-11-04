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
  } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'consent_signatures',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['consentFormId', 'studentId']
  },
    {
      fields: ['consentFormId']
  },
    {
      fields: ['studentId']
  },,
    {
      fields: ['createdAt'],
      name: 'idx_consent_signature_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_consent_signature_updated_at'
    }
  ]
  })
export class ConsentSignature extends Model<ConsentSignatureAttributes> implements ConsentSignatureAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./consent-form.model').ConsentForm)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  consentFormId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  studentId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  signedBy: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
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
    defaultValue: new Date()
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


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ConsentSignature) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ConsentSignature ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}