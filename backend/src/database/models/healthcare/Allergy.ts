import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AllergyType, AllergySeverity } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';
import { AllergySeverity } from '@/services/allergyService';
import { Student } from '../core/Student';
import { HealthRecord } from './HealthRecord';
import { Student } from '../core/Student';
import { HealthRecord } from './HealthRecord';
import { Student } from '../core/Student';

interface AllergyAttributes {
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
  createdAt: Date;
  updatedAt: Date;
}

interface AllergyCreationAttributes
  extends Optional<
    AllergyAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'allergyType'
    | 'verified'
    | 'active'
    | 'epiPenRequired'
    | 'symptoms'
    | 'reactions'
    | 'treatment'
    | 'emergencyProtocol'
    | 'onsetDate'
    | 'diagnosedDate'
    | 'diagnosedBy'
    | 'verifiedBy'
    | 'verificationDate'
    | 'notes'
    | 'epiPenLocation'
    | 'epiPenExpiration'
    | 'healthRecordId'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class Allergy extends Model<AllergyAttributes, AllergyCreationAttributes> implements AllergyAttributes {
  static create(arg0: { verifiedAt: Date | undefined; studentId: string; allergen: string; allergenType?: string; severity: AllergySeverity; reaction?: string; treatment?: string; verified: boolean; verifiedBy?: string; notes?: string; healthRecordId?: string; }, arg1: { transaction: any; }) {
    throw new Error('Method not implemented.');
  }
  static findByPk(id: string, arg1: { include: ({ model: Student; as: string; attributes: string[]; } | { model: HealthRecord; as: string; required: boolean; })[]; transaction: any; }) {
    throw new Error('Method not implemented.');
  }
  static findAll(arg0: { where: any; include: ({ model: Student; as: string; attributes: string[]; } | { model: HealthRecord; as: string; required: boolean; })[]; order: string[][]; transaction: any; }) {
    throw new Error('Method not implemented.');
  }
  static findAndCountAll(arg0: { where: any; include: { model: Student; as: string; attributes: string[]; }[]; offset: number; limit: number; order: string[][]; distinct: boolean; transaction: any; }): { rows: any; count: any; } | PromiseLike<{ rows: any; count: any; }> {
    throw new Error('Method not implemented.');
  }
  static count(arg0: { where: any; }): any {
    throw new Error('Method not implemented.');
  }
  static bulkCreate(arg0: any[], arg1: { transaction: any; validate: boolean; }) {
    throw new Error('Method not implemented.');
  }
  public id!: string;
  public studentId!: string;
  public allergen!: string;
  public allergyType!: AllergyType;
  public severity!: AllergySeverity;
  public symptoms?: string;
  public reactions?: any;
  public treatment?: string;
  public emergencyProtocol?: string;
  public onsetDate?: Date;
  public diagnosedDate?: Date;
  public diagnosedBy?: string;
  public verified!: boolean;
  public verifiedBy?: string;
  public verificationDate?: Date;
  public active!: boolean;
  public notes?: string;
  public epiPenRequired!: boolean;
  public epiPenLocation?: string;
  public epiPenExpiration?: Date;
  public healthRecordId?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Allergy.init(
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
    allergen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allergyType: {
      type: DataTypes.ENUM(...Object.values(AllergyType)),
      allowNull: false,
      defaultValue: AllergyType.OTHER,
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(AllergySeverity)),
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reactions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyProtocol: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    onsetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    epiPenRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    epiPenLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    epiPenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'allergies',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'active'] },
      { fields: ['allergyType', 'severity'] },
      { fields: ['epiPenExpiration'] },
    ],
  }
);

AuditableModel.setupAuditHooks(Allergy, 'Allergy');
