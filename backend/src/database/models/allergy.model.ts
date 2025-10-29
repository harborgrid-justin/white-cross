import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';

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

@Table({
  tableName: 'allergies',
  timestamps: true,
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
  ],
})
export class Allergy extends Model<AllergyAttributes> implements AllergyAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  allergen: string;

  @Default(AllergyType.OTHER)
  @Column({
    type: DataType.ENUM(...Object.values(AllergyType)),
    allowNull: false,
  })
  allergyType: AllergyType;

  @Column({
    type: DataType.ENUM(...Object.values(AllergySeverity)),
    allowNull: false,
  })
  severity: AllergySeverity;

  @Column(DataType.TEXT)
  symptoms?: string;

  @Column(DataType.JSONB)
  reactions?: any;

  @Column(DataType.TEXT)
  treatment?: string;

  @Column(DataType.TEXT)
  emergencyProtocol?: string;

  @Column(DataType.DATE)
  onsetDate?: Date;

  @Column(DataType.DATE)
  diagnosedDate?: Date;

  @Column(DataType.STRING)
  diagnosedBy?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean;

  @Column(DataType.UUID)
  verifiedBy?: string;

  @Column(DataType.DATE)
  verificationDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  epiPenRequired: boolean;

  @Column(DataType.STRING)
  epiPenLocation?: string;

  @Column(DataType.DATE)
  epiPenExpiration?: Date;

  @Column(DataType.UUID)
  healthRecordId?: string;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  @BelongsTo(() => Student)
  student?: Student;
}
