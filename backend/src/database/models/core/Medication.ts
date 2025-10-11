import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface MedicationAttributes {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MedicationCreationAttributes
  extends Optional<MedicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isControlled' | 'genericName' | 'manufacturer' | 'ndc'> {}

export class Medication extends Model<MedicationAttributes, MedicationCreationAttributes> implements MedicationAttributes {
  public id!: string;
  public name!: string;
  public genericName?: string;
  public dosageForm!: string;
  public strength!: string;
  public manufacturer?: string;
  public ndc?: string;
  public isControlled!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Medication.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genericName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dosageForm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    strength: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ndc: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isControlled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medications',
    timestamps: true,
    indexes: [{ fields: ['name'] }, { fields: ['ndc'] }, { fields: ['isControlled'] }],
  }
);
