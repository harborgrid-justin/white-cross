/**
 * @fileoverview Allergy Database Model
 * @module database/models/healthcare/Allergy
 * @description Sequelize model for managing student allergy information including allergens,
 * severity levels, emergency protocols, and epinephrine auto-injector tracking.
 *
 * Key Features:
 * - Multiple allergy types (food, medication, environmental, insect, latex)
 * - Severity classification (mild, moderate, severe, life-threatening)
 * - Emergency protocol documentation
 * - EpiPen requirement and location tracking
 * - EpiPen expiration monitoring
 * - Medical verification workflow
 * - Active/inactive status management
 * - Full audit trail for compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @compliance CDC Allergy Guidelines - Anaphylaxis emergency response protocols
 * @audit All access and modifications logged for liability protection
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: E1F92CDDD8
 * WC-GEN-060
 *
 * UPSTREAM: sequelize.ts, enums.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, AllergyRepository.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AllergyType, AllergySeverity } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface AllergyAttributes
 * @description TypeScript interface defining all Allergy model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {string} allergen - Name of allergen (e.g., "Peanuts", "Penicillin"), required
 * @property {AllergyType} allergyType - Category of allergy, defaults to OTHER
 * @property {AllergySeverity} severity - Severity level (mild, moderate, severe, life-threatening), required
 * @property {string} [symptoms] - Known symptoms and reactions (nullable)
 * @property {any} [reactions] - Structured reaction data (JSONB), nullable
 * @property {string} [treatment] - Standard treatment protocol (nullable)
 * @property {string} [emergencyProtocol] - Emergency response procedures (nullable)
 * @property {Date} [onsetDate] - Date when allergy first appeared (nullable)
 * @property {Date} [diagnosedDate] - Date of medical diagnosis (nullable)
 * @property {string} [diagnosedBy] - Healthcare provider who diagnosed (nullable)
 * @property {boolean} verified - Whether allergy has been medically verified, defaults to false
 * @property {string} [verifiedBy] - User ID who verified the allergy (nullable)
 * @property {Date} [verificationDate] - Date of verification (nullable)
 * @property {boolean} active - Whether allergy is currently active, defaults to true
 * @property {string} [notes] - Additional notes or comments (nullable)
 * @property {boolean} epiPenRequired - Whether student needs EpiPen access, defaults to false
 * @property {string} [epiPenLocation] - Where EpiPen is stored (e.g., "Nurse's office", "Student's locker"), nullable
 * @property {Date} [epiPenExpiration] - EpiPen expiration date for monitoring, nullable
 * @property {string} [healthRecordId] - Optional link to related health record (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - Critical for emergency response, all fields protected
 * @safety Life-threatening allergies require immediate staff notification
 */
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

/**
 * @interface AllergyCreationAttributes
 * @description Attributes required when creating a new Allergy instance.
 * Extends AllergyAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class Allergy
 * @extends Model
 * @description Student allergy tracking model with emergency protocol management and EpiPen monitoring.
 *
 * @tablename allergies
 *
 * Key Features:
 * - Comprehensive allergy type classification
 * - Severity-based emergency protocol mapping
 * - EpiPen requirement, location, and expiration tracking
 * - Medical verification workflow for liability protection
 * - Active/inactive status for resolved allergies
 * - Structured reaction data storage (JSONB)
 * - Audit trail for all changes
 * - Indexed for efficient querying by student, type, severity, and EpiPen expiration
 *
 * Allergy Types (from AllergyType enum):
 * - FOOD: Food allergies (peanuts, tree nuts, shellfish, dairy, eggs, etc.)
 * - MEDICATION: Drug allergies (penicillin, aspirin, etc.)
 * - ENVIRONMENTAL: Environmental triggers (pollen, dust, mold, pet dander)
 * - INSECT: Insect sting allergies (bee, wasp, fire ant)
 * - LATEX: Latex allergies
 * - OTHER: Other allergen types
 *
 * Severity Levels (from AllergySeverity enum):
 * - MILD: Minor reactions (mild rash, itching)
 * - MODERATE: Moderate reactions requiring monitoring
 * - SEVERE: Serious reactions requiring immediate intervention
 * - LIFE_THREATENING: Anaphylaxis risk - requires EpiPen and emergency protocols
 *
 * @security Contains critical PHI for emergency response
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @safety Life-threatening allergies must trigger staff alerts and emergency action plans
 *
 * @example
 * // Create a severe peanut allergy with EpiPen requirement
 * const allergy = await Allergy.create({
 *   studentId: 'student-uuid',
 *   allergen: 'Peanuts',
 *   allergyType: AllergyType.FOOD,
 *   severity: AllergySeverity.LIFE_THREATENING,
 *   symptoms: 'Anaphylaxis, difficulty breathing, hives, throat swelling',
 *   emergencyProtocol: '1. Administer EpiPen immediately\n2. Call 911\n3. Notify parents\n4. Monitor until EMS arrives',
 *   diagnosedDate: new Date('2023-03-15'),
 *   diagnosedBy: 'Dr. Sarah Johnson',
 *   verified: true,
 *   active: true,
 *   epiPenRequired: true,
 *   epiPenLocation: 'Nurse office drawer 2 and student backpack',
 *   epiPenExpiration: new Date('2025-12-31')
 * });
 *
 * @example
 * // Query students with expired EpiPens
 * const expiredEpiPens = await Allergy.findAll({
 *   where: {
 *     epiPenRequired: true,
 *     active: true,
 *     epiPenExpiration: { [Op.lt]: new Date() }
 *   },
 *   order: [['epiPenExpiration', 'ASC']]
 * });
 *
 * @example
 * // Find all life-threatening allergies for emergency staff briefing
 * const criticalAllergies = await Allergy.findAll({
 *   where: {
 *     severity: AllergySeverity.LIFE_THREATENING,
 *     active: true
 *   },
 *   include: ['student'],
 *   order: [['allergen', 'ASC']]
 * });
 */
export class Allergy extends Model<AllergyAttributes, AllergyCreationAttributes> implements AllergyAttributes {
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
