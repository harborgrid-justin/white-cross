import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { HealthRecordType } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

interface HealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: HealthRecordType;
  title: string;
  description: string;
  recordDate: Date;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  attachments: string[];
  metadata?: any;
  isConfidential: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HealthRecordCreationAttributes
  extends Optional<
    HealthRecordAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'followUpRequired'
    | 'followUpCompleted'
    | 'isConfidential'
    | 'attachments'
    | 'provider'
    | 'providerNpi'
    | 'facility'
    | 'facilityNpi'
    | 'diagnosis'
    | 'diagnosisCode'
    | 'treatment'
    | 'followUpDate'
    | 'metadata'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class HealthRecord extends Model<HealthRecordAttributes, HealthRecordCreationAttributes> implements HealthRecordAttributes {
  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
  get() {
    throw new Error('Method not implemented.');
  }
  public id!: string;
  public studentId!: string;
  public recordType!: HealthRecordType;
  public title!: string;
  public description!: string;
  public recordDate!: Date;
  public provider?: string;
  public providerNpi?: string;
  public facility?: string;
  public facilityNpi?: string;
  public diagnosis?: string;
  public diagnosisCode?: string;
  public treatment?: string;
  public followUpRequired!: boolean;
  public followUpDate?: Date;
  public followUpCompleted!: boolean;
  public attachments!: string[];
  public metadata?: any;
  public isConfidential!: boolean;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HealthRecord.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordType: {
      type: DataTypes.ENUM(...Object.values(HealthRecordType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recordDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facilityNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diagnosisCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'health_records',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'recordDate'] },
      { fields: ['recordType', 'recordDate'] },
      { fields: ['createdBy'] },
      { fields: ['followUpRequired', 'followUpDate'] },
    ],
  }
);

AuditableModel.setupAuditHooks(HealthRecord, 'HealthRecord');
