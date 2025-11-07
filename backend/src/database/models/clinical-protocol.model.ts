import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ProtocolStatus } from '../../clinical/enums/protocol-status.enum';

export interface ClinicalProtocolAttributes {
  id: string;
  name: string;
  code: string;
  version: string;
  category: string;
  description: string;
  indications: string[];
  contraindications?: string[];
  steps: Array<{
    order: number;
    title: string;
    description: string;
    required: boolean;
  }>;
  decisionPoints?: Array<{
    step: number;
    condition: string;
    ifTrue: string;
    ifFalse: string;
  }>;
  requiredEquipment?: string[];
  medications?: string[];
  status: ProtocolStatus;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: Date;
  effectiveDate?: Date;
  reviewDate?: Date;
  references?: string[];
  tags?: string[];
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
  tableName: 'clinical_protocols',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['code'],
      unique: true,
    },
    {
      fields: ['createdAt'],
      name: 'idx_clinical_protocol_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_clinical_protocol_updated_at',
    },
  ],
})
export class ClinicalProtocol
  extends Model<ClinicalProtocolAttributes>
  implements ClinicalProtocolAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index({ unique: true })
  code: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare version: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  category: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  indications: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  contraindications?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  steps: Array<{
    order: number;
    title: string;
    description: string;
    required: boolean;
  }>;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  decisionPoints?: Array<{
    step: number;
    condition: string;
    ifTrue: string;
    ifFalse: string;
  }>;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  requiredEquipment?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  medications?: string[];

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ProtocolStatus)],
    },
    allowNull: false,
    defaultValue: ProtocolStatus.DRAFT,
  })
  @Index
  status: ProtocolStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy: string;

  @AllowNull
  @Column({
    type: DataType.UUID,
  })
  approvedBy?: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  approvedDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  effectiveDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  reviewDate?: Date;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  references?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  tags?: string[];

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  /**
   * Check if protocol is active and can be used
   */
  isActive(): boolean {
    if (this.status !== ProtocolStatus.ACTIVE) return false;
    if (this.effectiveDate && new Date() < this.effectiveDate) return false;
    return true;
  }

  /**
   * Check if protocol needs review
   */
  needsReview(): boolean {
    if (!this.reviewDate) return false;
    return new Date() >= this.reviewDate;
  }

  /**
   * Get total number of steps
   */
  getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Get required steps only
   */
  getRequiredSteps(): typeof this.steps {
    return this.steps.filter((step) => step.required);
  }

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ClinicalProtocol) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] ClinicalProtocol ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
