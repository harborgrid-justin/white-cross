/**
 * @fileoverview Witness Statement Database Model
 * @module database/models/incidents/WitnessStatement
 * @description Sequelize model for managing witness statements and testimonies for incident reports.
 * Provides structured collection, verification, and retention of witness accounts for legal compliance.
 *
 * Key Features:
 * - Witness identification and contact information
 * - Witness type classification (student, staff, parent, other)
 * - Detailed statement documentation
 * - Verification workflow with timestamps
 * - Integration with incident reports
 *
 * Business Rules:
 * - Statements must be 20-3000 characters for proper documentation
 * - Staff witnesses should be identified first (within 1 hour of incident)
 * - Student witness statements should be collected within same school day
 * - Parent/external witness statements collected as soon as practical
 * - All statements require verification by authorized staff
 * - Verified statements cannot be modified (new version required)
 *
 * Legal Requirements:
 * - Witness statements are critical legal evidence
 * - Must be contemporaneous (collected as close to incident as possible)
 * - Required for serious incidents and insurance claims
 * - Used in legal proceedings and compliance investigations
 * - Student witness statements may require parental consent depending on state law
 *
 * @compliance FERPA - Student witness statements are educational records
 * @compliance State regulations - Required for serious incident documentation
 *
 * @legal Retention requirement: 7 years (tied to parent incident report)
 * @legal Admissible as evidence in legal proceedings
 * @legal Must maintain chain of custody and verification
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 71E533763B
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { WitnessType } from '../../types/enums';

/**
 * @interface WitnessStatementAttributes
 * @description Defines the complete structure of a witness statement record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} incidentReportId - Reference to parent incident report
 * @legal Links testimony to specific incident for legal proceedings
 *
 * @property {string} witnessName - Full name of the witness (2-100 characters)
 * @business Required for identification and potential follow-up
 * @legal Critical for legal proceedings and verification
 *
 * @property {WitnessType} witnessType - Type/role of the witness
 * @enum {WitnessType} ['STUDENT', 'STAFF', 'PARENT', 'OTHER']
 * @business STUDENT: Fellow students who observed the incident
 * @business STAFF: School employees (teachers, nurses, administrators)
 * @business PARENT: Parents or guardians present during incident
 * @business OTHER: External witnesses (visitors, contractors, emergency responders)
 * @legal Type affects legal weight and required consent procedures
 *
 * @property {string} [witnessContact] - Contact information (phone or email)
 * @business Optional but recommended for follow-up questions
 * @legal May be required for legal proceedings
 *
 * @property {string} statement - The witness's account of the incident (20-3000 characters)
 * @business Must be detailed enough to be useful for investigation
 * @legal Should be in witness's own words when possible
 * @legal Statement length requirements ensure adequate detail for legal purposes
 *
 * @property {boolean} verified - Whether statement has been verified
 * @business Default: false, must be verified by authorized staff
 * @business Verification confirms identity and reviews statement for completeness
 * @legal Verified statements carry more legal weight
 *
 * @property {string} [verifiedBy] - User ID of staff who verified the statement
 * @business Required when verified = true
 * @compliance Provides accountability and audit trail
 * @legal Establishes chain of custody for legal purposes
 *
 * @property {Date} [verifiedAt] - Timestamp when statement was verified
 * @business Auto-set when verified changes to true
 * @legal Establishes timeline for legal proceedings
 *
 * @property {Date} createdAt - Record creation timestamp
 * @legal Establishes when statement was collected (proximity to incident)
 * @property {Date} updatedAt - Record last update timestamp
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

/**
 * @interface WitnessStatementCreationAttributes
 * @description Defines optional fields when creating a new witness statement
 * @extends WitnessStatementAttributes
 */
interface WitnessStatementCreationAttributes
  extends Optional<
    WitnessStatementAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'witnessContact' | 'verified' | 'verifiedBy' | 'verifiedAt'
  > {}

/**
 * @class WitnessStatement
 * @extends Model
 * @description Sequelize model class for witness statements
 *
 * Workflow Summary:
 * 1. Incident occurs → Witnesses identified
 * 2. Statements collected as soon as practical after incident
 * 3. Statement entered into system (verified = false by default)
 * 4. Authorized staff reviews statement for completeness
 * 5. Staff verifies statement (verified = true, auto-timestamps applied)
 * 6. Verified statement becomes part of official incident record
 * 7. Retained for 7 years with incident report
 *
 * Collection Timelines:
 * - STAFF witnesses: Within 1 hour of incident (while details fresh)
 * - STUDENT witnesses: Within same school day (before going home)
 * - PARENT witnesses: Within 24 hours if present
 * - OTHER witnesses: As soon as practical (may require follow-up)
 *
 * Legal Considerations:
 * - Statements should be contemporaneous (close to incident time)
 * - Student statements may require parental consent (check state law)
 * - Statements are admissible in legal proceedings
 * - Chain of custody maintained through verification process
 * - Cannot modify verified statements (create new version if needed)
 *
 * Associations:
 * - belongsTo: IncidentReport (parent incident)
 * - belongsTo: User (verifiedBy - verifying staff member)
 *
 * Hooks:
 * - beforeUpdate: Auto-timestamp verifiedAt when verified = true
 *
 * @example
 * // Create a witness statement
 * const statement = await WitnessStatement.create({
 *   incidentReportId: 'incident-uuid',
 *   witnessName: 'John Smith',
 *   witnessType: WitnessType.STAFF,
 *   witnessContact: 'jsmith@school.edu',
 *   statement: 'I was supervising the playground when I saw the student...'
 * });
 *
 * @example
 * // Verify a statement
 * await statement.update({
 *   verified: true,
 *   verifiedBy: 'admin-uuid'
 * });
 * // verifiedAt is automatically set
 */
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
