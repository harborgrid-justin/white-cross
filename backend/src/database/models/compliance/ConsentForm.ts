import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConsentType } from '../../types/enums';

/**
 * ConsentForm Model
 *
 * HIPAA Compliance: Manages consent form templates for various healthcare activities.
 * Required for legal authorization before medical treatment, medication administration,
 * or data sharing under HIPAA regulations.
 *
 * Key Features:
 * - Version-controlled consent form templates
 * - Multiple consent types (medical, medication, emergency, data sharing)
 * - Active/inactive status and expiration tracking
 * - Complete form content and terms storage
 */
interface ConsentFormAttributes {
  id: string;
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsentFormCreationAttributes
  extends Optional<ConsentFormAttributes, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isActive' | 'expiresAt'> {}

export class ConsentForm extends Model<ConsentFormAttributes, ConsentFormCreationAttributes> implements ConsentFormAttributes {
  public id!: string;
  public type!: ConsentType;
  public title!: string;
  public description!: string;
  public content!: string;
  public version!: string;
  public isActive!: boolean;
  public expiresAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConsentForm.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ConsentType)),
      allowNull: false,
      comment: 'Type of consent form',
      validate: {
        notNull: {
          msg: 'Consent type is required'
        },
        notEmpty: {
          msg: 'Consent type cannot be empty'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Form title',
      validate: {
        notNull: {
          msg: 'Consent form title is required'
        },
        notEmpty: {
          msg: 'Consent form title cannot be empty'
        },
        len: {
          args: [3, 200],
          msg: 'Consent form title must be between 3 and 200 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Form description',
      validate: {
        notNull: {
          msg: 'Consent form description is required'
        },
        notEmpty: {
          msg: 'Consent form description cannot be empty'
        },
        len: {
          args: [10, 5000],
          msg: 'Consent form description must be between 10 and 5000 characters'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Complete form content and terms',
      validate: {
        notNull: {
          msg: 'Consent form content is required for legal validity'
        },
        notEmpty: {
          msg: 'Consent form content cannot be empty'
        },
        len: {
          args: [50, 50000],
          msg: 'Consent form content must be between 50 and 50000 characters'
        }
      }
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
      comment: 'Form version number',
      validate: {
        notNull: {
          msg: 'Version number is required for compliance tracking'
        },
        notEmpty: {
          msg: 'Version number cannot be empty'
        },
        is: {
          args: /^[0-9]+\.[0-9]+(\.[0-9]+)?$/,
          msg: 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the form is currently active',
      validate: {
        notNull: {
          msg: 'Active status is required'
        }
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the form expires',
      validate: {
        isDate: {
          msg: 'Expiration date must be a valid date',
          args: true,
        },
        isAfterCreation(value: Date | null) {
          if (value && this.createdAt && value < this.createdAt) {
            throw new Error('Expiration date cannot be before creation date');
          }
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'consent_forms',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['isActive'] },
      { fields: ['expiresAt'] },
    ],
  }
);
