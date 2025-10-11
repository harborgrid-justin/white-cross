import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * ConsentSignature Model
 *
 * HIPAA Compliance: Records legally-binding consent signatures from parents/guardians.
 * Provides proof of authorization for medical activities and maintains withdrawal tracking.
 *
 * Key Features:
 * - Digital signature capture with audit trail
 * - Parent/guardian relationship tracking
 * - IP address logging for legal verification
 * - Consent withdrawal capability
 * - One signature per student per consent form
 */
interface ConsentSignatureAttributes {
  id: string;
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
  signedAt: Date;
  ipAddress?: string;
  withdrawnAt?: Date;
  withdrawnBy?: string;
}

interface ConsentSignatureCreationAttributes
  extends Optional<
    ConsentSignatureAttributes,
    'id' | 'signedAt' | 'signatureData' | 'ipAddress' | 'withdrawnAt' | 'withdrawnBy'
  > {}

export class ConsentSignature
  extends Model<ConsentSignatureAttributes, ConsentSignatureCreationAttributes>
  implements ConsentSignatureAttributes
{
  public id!: string;
  public consentFormId!: string;
  public studentId!: string;
  public signedBy!: string;
  public relationship!: string;
  public signatureData?: string;
  public signedAt!: Date;
  public ipAddress?: string;
  public withdrawnAt?: Date;
  public withdrawnBy?: string;
}

ConsentSignature.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    consentFormId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Associated consent form ID',
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Student ID for whom consent is given',
    },
    signedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of parent/guardian who signed',
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Relationship to student (parent, guardian, etc.)',
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Digital signature data',
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the consent was signed',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address from which consent was signed',
    },
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When consent was withdrawn',
    },
    withdrawnBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who withdrew the consent',
    },
  },
  {
    sequelize,
    tableName: 'consent_signatures',
    timestamps: false,
    indexes: [
      { fields: ['consentFormId', 'studentId'], unique: true },
      { fields: ['studentId'] },
      { fields: ['signedAt'] },
    ],
  }
);
