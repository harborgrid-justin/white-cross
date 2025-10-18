/**
 * WC-GEN-073 | WitnessStatement.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
      validate: {
        notEmpty: {
          msg: 'Incident report ID is required'
        },
        isUUID: {
          args: 4,
          msg: 'Incident report ID must be a valid UUID'
        }
      }
    },
    witnessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Witness name is required'
        },
        len: {
          args: [2, 100],
          msg: 'Witness name must be between 2 and 100 characters'
        }
      }
    },
    witnessType: {
      type: DataTypes.ENUM(...Object.values(WitnessType)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Witness type is required'
        },
        isIn: {
          args: [Object.values(WitnessType)],
          msg: `Witness type must be one of: ${Object.values(WitnessType).join(', ')}`
        }
      }
    },
    witnessContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Witness statement is required'
        },
        len: {
          args: [20, 3000],
          msg: 'Witness statement must be between 20 and 3000 characters for proper documentation'
        }
      }
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
    validate: {
      // Model-level validation: Verified statements must have verifier
      verifiedMustHaveVerifier() {
        if (this.verified && !this.verifiedBy) {
          throw new Error('Verified statements must have a verifier (verifiedBy)');
        }
      }
    }
  }
);

// Add hooks for verification tracking
WitnessStatement.beforeUpdate((instance) => {
  // Auto-set verification timestamp when verified
  if (instance.verified && !instance.verifiedAt) {
    instance.verifiedAt = new Date();
  }
});
