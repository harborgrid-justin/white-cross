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
      validate: {
        notNull: {
          msg: 'Consent form ID is required'
        },
        notEmpty: {
          msg: 'Consent form ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'Consent form ID must be a valid UUID'
        }
      }
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Student ID for whom consent is given',
      validate: {
        notNull: {
          msg: 'Student ID is required for consent signature'
        },
        notEmpty: {
          msg: 'Student ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'Student ID must be a valid UUID'
        }
      }
    },
    signedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of parent/guardian who signed',
      validate: {
        notNull: {
          msg: 'Signatory name is required for legal validity'
        },
        notEmpty: {
          msg: 'Signatory name cannot be empty'
        },
        len: {
          args: [2, 200],
          msg: 'Signatory name must be between 2 and 200 characters'
        }
      }
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Relationship to student (parent, guardian, etc.)',
      validate: {
        notNull: {
          msg: 'Relationship to student is required for legal validity'
        },
        notEmpty: {
          msg: 'Relationship cannot be empty'
        },
        isIn: {
          args: [['Mother', 'Father', 'Parent', 'Legal Guardian', 'Foster Parent', 'Grandparent', 'Stepparent', 'Other Authorized Adult']],
          msg: 'Relationship must be a valid authorized relationship type'
        }
      }
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Digital signature data',
      validate: {
        isValidSignature(value: string | null) {
          if (value && value.length > 0 && value.length < 10) {
            throw new Error('Digital signature data appears incomplete');
          }
          if (value && value.length > 100000) {
            throw new Error('Digital signature data is too large (max 100KB)');
          }
        }
      }
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the consent was signed',
      validate: {
        notNull: {
          msg: 'Signature timestamp is required for legal validity'
        },
        isDate: {
          msg: 'Signature timestamp must be a valid date'
        },
        notInFuture(value: Date) {
          if (value && value > new Date()) {
            throw new Error('Signature timestamp cannot be in the future');
          }
        }
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address from which consent was signed',
      validate: {
        isValidIP(value: string | null) {
          if (value) {
            const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
            if (!ipv4Pattern.test(value) && !ipv6Pattern.test(value)) {
              throw new Error('IP address must be in valid IPv4 or IPv6 format');
            }
          }
        }
      }
    },
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When consent was withdrawn',
      validate: {
        isDate: {
          msg: 'Withdrawal timestamp must be a valid date'
        },
        isAfterSigning(value: Date | null) {
          if (value && this.signedAt && value < this.signedAt) {
            throw new Error('Withdrawal timestamp cannot be before signature timestamp');
          }
        },
        notInFuture(value: Date | null) {
          if (value && value > new Date()) {
            throw new Error('Withdrawal timestamp cannot be in the future');
          }
        }
      }
    },
    withdrawnBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Who withdrew the consent',
      validate: {
        len: {
          args: [0, 200],
          msg: 'Withdrawn by name cannot exceed 200 characters'
        },
        requiresWithdrawnAt(value: string | null) {
          if (value && !this.withdrawnAt) {
            throw new Error('Withdrawal timestamp is required when withdrawn by is specified');
          }
        }
      }
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
