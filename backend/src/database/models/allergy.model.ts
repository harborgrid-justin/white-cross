import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
  Scopes,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export enum AllergyType {
  FOOD = 'FOOD',
  MEDICATION = 'MEDICATION',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER',
}

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

export interface AllergyAttributes {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  symptoms?: string;
  reactions?: any;
  treatment?: string;
  emergencyProtocol?: string;
  onsetDate?: Date;
  diagnosedDate?: Date;
  diagnosedBy?: string;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  active: boolean;
  notes?: string;
  epiPenRequired: boolean;
  epiPenLocation?: string;
  epiPenExpiration?: Date;
  healthRecordId?: string;
  createdBy?: string;
  updatedBy?: string;
}

@Scopes(() => ({
  active: {
    where: {
      active: true,
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
  byStudent: (studentId: string) => ({
    where: { studentId, active: true },
    order: [
      ['severity', 'DESC'],
      ['allergen', 'ASC'],
    ],
  }),
  byType: (allergyType: AllergyType) => ({
    where: { allergyType, active: true },
    order: [['severity', 'DESC']],
  }),
  bySeverity: (severity: AllergySeverity) => ({
    where: { severity, active: true },
    order: [['allergen', 'ASC']],
  }),
  severe: {
    where: {
      severity: {
        [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
      },
      active: true,
    },
    order: [
      ['severity', 'DESC'],
      ['allergen', 'ASC'],
    ],
  },
  requiresEpiPen: {
    where: {
      epiPenRequired: true,
      active: true,
    },
    order: [['epiPenExpiration', 'ASC']],
  },
  expiredEpiPen: {
    where: {
      epiPenRequired: true,
      epiPenExpiration: {
        [Op.lt]: new Date(),
      },
      active: true,
    },
    order: [['epiPenExpiration', 'ASC']],
  },
  unverified: {
    where: {
      verified: false,
      active: true,
    },
    order: [
      ['severity', 'DESC'],
      ['createdAt', 'ASC'],
    ],
  },
}))
@Table({
  tableName: 'allergies',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'active'],
    },
    {
      fields: ['allergyType', 'severity'],
    },
    {
      fields: ['epiPenExpiration'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_allergy_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_allergy_updated_at',
    },
    // Performance index for timeline queries
    {
      fields: ['diagnosedDate'],
      name: 'idx_allergy_diagnosed_date',
    },
  ],
})
export class Allergy
  extends Model<AllergyAttributes>
  implements AllergyAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  studentId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  allergen: string;

  @Default(AllergyType.OTHER)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AllergyType)],
    },
    allowNull: false,
  })
  allergyType: AllergyType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AllergySeverity)],
    },
    allowNull: false,
  })
  severity: AllergySeverity;

  @Column(DataType.TEXT)
  symptoms?: string;

  @Column(DataType.JSONB)
  reactions?: any;

  @Column(DataType.TEXT)
  treatment?: string;

  @Column({
    type: DataType.TEXT,
  })
  emergencyProtocol?: string;

  @Column({
    type: DataType.DATE,
  })
  onsetDate?: Date;

  @Index({ name: 'idx_allergy_diagnosed_date' })
  @Column({
    type: DataType.DATE,
  })
  diagnosedDate?: Date;

  @Column({
    type: DataType.STRING(255),
  })
  diagnosedBy?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean;

  @Column({
    type: DataType.UUID,
  })
  verifiedBy?: string;

  @Column({
    type: DataType.DATE,
  })
  verificationDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  epiPenRequired: boolean;

  @Column({
    type: DataType.STRING(255),
  })
  epiPenLocation?: string;

  @Column({
    type: DataType.DATE,
  })
  epiPenExpiration?: Date;

  @Column({
    type: DataType.UUID,
  })
  healthRecordId?: string;

  @Column({
    type: DataType.UUID,
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID,
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  @BelongsTo(() => require('./student.model').Student)
  declare student?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Allergy, options: any) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const { logModelPHIAccess } = await import(
        '../services/model-audit-helper.service.js'
      );
      const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
      await logModelPHIAccess(
        'Allergy',
        instance.id,
        action,
        changedFields,
        options?.transaction,
      );
    }
  }

  @BeforeUpdate
  static async validateVerification(instance: Allergy) {
    if (instance.changed('verified') && instance.verified) {
      if (!instance.verifiedBy) {
        throw new Error(
          'verifiedBy is required when marking allergy as verified',
        );
      }
      instance.verificationDate = new Date();
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateEpiPen(instance: Allergy) {
    if (instance.epiPenRequired && !instance.epiPenLocation) {
      throw new Error('epiPenLocation is required when EpiPen is required');
    }
    if (instance.epiPenExpiration && instance.epiPenExpiration < new Date()) {
      console.warn(`[WARNING] EpiPen for allergy ${instance.id} has expired`);
    }
  }

  // Instance methods
  isEpiPenExpired(): boolean {
    if (!this.epiPenRequired || !this.epiPenExpiration) {
      return false;
    }
    return this.epiPenExpiration < new Date();
  }

  getDaysUntilEpiPenExpiration(): number | null {
    if (!this.epiPenRequired || !this.epiPenExpiration) {
      return null;
    }
    const diff = this.epiPenExpiration.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
