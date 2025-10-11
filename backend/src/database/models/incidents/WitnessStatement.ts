import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { WitnessType } from '../../types/enums';

/**
 * WitnessStatement Model
 * Manages witness statements and testimonies for incident reports including verification status.
 */

interface WitnessStatementAttributes {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface WitnessStatementCreationAttributes
  extends Optional<
    WitnessStatementAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'witnessContact' | 'verified' | 'verifiedBy' | 'verifiedAt'
  > {}

export class WitnessStatement
  extends Model<WitnessStatementAttributes, WitnessStatementCreationAttributes>
  implements WitnessStatementAttributes
{
  public id!: string;
  public incidentReportId!: string;
  public witnessName!: string;
  public witnessType!: WitnessType;
  public witnessContact?: string;
  public statement!: string;
  public verified!: boolean;
  public verifiedBy?: string;
  public verifiedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WitnessStatement.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    incidentReportId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    witnessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    witnessType: {
      type: DataTypes.ENUM(...Object.values(WitnessType)),
      allowNull: false,
    },
    witnessContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who verified the statement',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'witness_statements',
    timestamps: true,
    indexes: [
      { fields: ['incidentReportId'] },
      { fields: ['witnessType'] },
      { fields: ['verified'] },
    ],
  }
);
