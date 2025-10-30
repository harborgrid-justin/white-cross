import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum AllergyType {
  FOOD = 'FOOD',
  MEDICATION = 'MEDICATION',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER'
  }

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
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

@Table({
  tableName: 'allergies',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'active']
  },
    {
      fields: ['allergyType', 'severity']
  },
    {
      fields: ['epiPenExpiration']
  },
  ]
  })
export class Allergy extends Model<AllergyAttributes> implements AllergyAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  studentId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  allergen: string;

  @Default(AllergyType.OTHER)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AllergyType)]
    },
    allowNull: false
  })
  allergyType: AllergyType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AllergySeverity)]
    },
    allowNull: false
  })
  severity: AllergySeverity;

  @Column(DataType.TEXT)
  symptoms?: string;

  @Column(DataType.JSONB)
  reactions?: any;

  @Column(DataType.TEXT)
  treatment?: string;

  @Column({
    type: DataType.TEXT
  })
  emergencyProtocol?: string;

  @Column({
    type: DataType.DATE
  })
  onsetDate?: Date;

  @Column({
    type: DataType.DATE
  })
  diagnosedDate?: Date;

  @Column({
    type: DataType.STRING(255)
  })
  diagnosedBy?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean;

  @Column({
    type: DataType.UUID
  })
  verifiedBy?: string;

  @Column({
    type: DataType.DATE
  })
  verificationDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  epiPenRequired: boolean;

  @Column({
    type: DataType.STRING(255)
  })
  epiPenLocation?: string;

  @Column({
    type: DataType.DATE
  })
  epiPenExpiration?: Date;

  @Column({
    type: DataType.UUID
  })
  healthRecordId?: string;

  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE
  })
  declare updatedAt: Date;

  @BelongsTo(() => require('./student.model').Student)
  declare student?: any;
}
