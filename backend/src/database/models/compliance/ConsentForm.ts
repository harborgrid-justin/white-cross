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
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Form title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Form description',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Complete form content and terms',
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
      comment: 'Form version number',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the form is currently active',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the form expires',
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
