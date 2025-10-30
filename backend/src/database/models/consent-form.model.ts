import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum ConsentType {
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  PHOTO_RELEASE = 'PHOTO_RELEASE',
  FIELD_TRIP = 'FIELD_TRIP',
  EMERGENCY_TREATMENT = 'EMERGENCY_TREATMENT',
  DATA_SHARING = 'DATA_SHARING',
  RESEARCH = 'RESEARCH'
  }

export interface ConsentFormAttributes {
  id?: string;
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'consent_forms',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
  },
    {
      fields: ['isActive']
  },
    {
      fields: ['expiresAt']
  },
  ]
  })
export class ConsentForm extends Model<ConsentFormAttributes> implements ConsentFormAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ConsentType) as string[])),
    allowNull: false
  })
  type: ConsentType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  content: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: '1.0'
  })
  declare version: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @AllowNull
  @Column(DataType.DATE)
  expiresAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}