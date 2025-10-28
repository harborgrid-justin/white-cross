/**
 * @fileoverview ConsentForm Database Model
 * @module database/models/compliance/ConsentForm
 * @description Sequelize model for managing consent form templates in healthcare systems.
 * Provides version-controlled templates for obtaining legal authorization before medical
 * treatment, medication administration, or PHI disclosure under HIPAA regulations.
 *
 * Key Features:
 * - Version-controlled consent form templates with semantic versioning
 * - Multiple consent types (medical, medication, emergency, data sharing, research)
 * - Active/inactive status for template lifecycle management
 * - Expiration tracking for time-limited consent forms
 * - Complete legal content and terms storage
 * - Links to ConsentSignature for actual parent/guardian signatures
 *
 * @security Ensures legally-valid consent templates
 * @security Version control for legal traceability
 * @compliance HIPAA - Required for PHI disclosure authorization
 * @compliance State laws - Medical treatment authorization
 * @compliance Used with ConsentSignature for complete consent tracking
 *
 * @requires sequelize - ORM for database operations
 * @requires ConsentType - Enum defining consent form types
 *
 * LOC: 78F434BF7A
 * WC-GEN-049 | ConsentForm.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - ConsentSignature.ts - Links consent forms to signatures
 *   - Compliance services - Consent management
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConsentType } from '../../types/enums';

/**
 * @interface ConsentFormAttributes
 * @description TypeScript interface defining all ConsentForm model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {ConsentType} type - Type of consent (medical, medication, emergency, etc.)
 * @property {string} title - Form title (3-200 chars)
 * @property {string} description - Form description and purpose (10-5000 chars)
 * @property {string} content - Complete legal form content (50-50000 chars)
 * @property {string} version - Semantic version number (X.Y or X.Y.Z format)
 * @property {boolean} isActive - Whether form is currently active for use
 * @property {Date} [expiresAt] - Optional expiration date for time-limited forms
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
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

/**
 * @interface ConsentFormCreationAttributes
 * @description Attributes required when creating a new ConsentForm instance.
 * Extends ConsentFormAttributes with optional fields that have defaults or are auto-generated.
 */
interface ConsentFormCreationAttributes
  extends Optional<ConsentFormAttributes, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isActive' | 'expiresAt'> {}

/**
 * @class ConsentForm
 * @extends Model
 * @description ConsentForm model for managing legally-binding consent form templates.
 * Templates are signed by parents/guardians via ConsentSignature model to provide
 * legal authorization for medical activities and PHI disclosure.
 *
 * @tablename consent_forms
 *
 * Consent Types:
 * - MEDICAL_TREATMENT: Authorization for general medical treatment
 * - MEDICATION_ADMINISTRATION: Permission to administer medications
 * - EMERGENCY_CARE: Authorization for emergency medical services
 * - DATA_SHARING: Permission to share PHI with third parties
 * - FIELD_TRIP: Medical authorization for field trips
 * - RESEARCH: Participation in research studies
 *
 * Version Control:
 * - Semantic versioning (1.0, 2.1.3) tracks template changes
 * - New version created when content changes significantly
 * - Previous versions retained for historical consent validity
 * - Active flag indicates current template to use for new signatures
 *
 * Legal Requirements:
 * - Content must include complete terms and conditions
 * - Must specify what is being consented to
 * - Must include signature section
 * - Must comply with state and federal regulations
 * - Version tracking for legal traceability
 *
 * @example
 * // Create a medication consent form template
 * await ConsentForm.create({
 *   type: ConsentType.MEDICATION_ADMINISTRATION,
 *   title: 'Medication Administration Consent',
 *   description: 'Authorization for school nurses to administer prescribed medications',
 *   content: 'I hereby authorize... [complete legal text]',
 *   version: '1.0',
 *   isActive: true
 * });
 *
 * @example
 * // Create new version when updating form content
 * await ConsentForm.create({
 *   type: ConsentType.MEDICATION_ADMINISTRATION,
 *   title: 'Medication Administration Consent',
 *   description: 'Updated authorization with new state requirements',
 *   content: 'I hereby authorize... [updated legal text]',
 *   version: '2.0',
 *   isActive: true
 * });
 *
 * @example
 * // Query active consent forms
 * const activeForms = await ConsentForm.findAll({
 *   where: {
 *     isActive: true,
 *     expiresAt: { [Op.or]: [null, { [Op.gt]: new Date() }] }
 *   }
 * });
 *
 * @security Version control ensures legal traceability
 * @compliance HIPAA required for PHI disclosure
 */
export class ConsentForm extends Model<ConsentFormAttributes, ConsentFormCreationAttributes> implements ConsentFormAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for consent form template
   */
  public id!: string;

  /**
   * @property {ConsentType} type - Consent form type
   * @compliance Determines legal requirements and scope
   */
  public type!: ConsentType;

  /**
   * @property {string} title - Form title
   * @validation 3-200 characters
   */
  public title!: string;

  /**
   * @property {string} description - Form description
   * @validation 10-5000 characters
   * @compliance Explains purpose and scope of consent
   */
  public description!: string;

  /**
   * @property {string} content - Complete form content
   * @validation 50-50000 characters
   * @compliance Must include complete legal terms and conditions
   */
  public content!: string;

  /**
   * @property {string} version - Version number
   * @default '1.0'
   * @validation Format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)
   * @security Version tracking for legal traceability
   */
  public version!: string;

  /**
   * @property {boolean} isActive - Active status
   * @default true
   * @security Only active templates used for new signatures
   */
  public isActive!: boolean;

  /**
   * @property {Date} expiresAt - Expiration date
   * @validation Must be after creation date
   * @compliance For time-limited consent forms
   */
  public expiresAt?: Date;

  /**
   * @property {Date} createdAt - Creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly
   */
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
