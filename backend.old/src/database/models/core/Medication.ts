/**
 * @fileoverview Medication Database Model
 * @module models/core/Medication
 * @description Sequelize model for medication formulary including controlled substance tracking.
 * Supports DEA schedule classification, NDC codes, and witness requirements for administration.
 * @requires sequelize - ORM library for database operations
 *
 * LOC: 80CA916D7C
 * WC-GEN-054 | Medication.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - MedicationInventory.ts, StudentMedication.ts, MedicationRepository.ts
 *
 * Related Models: StudentMedication, MedicationInventory, MedicationLog
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface MedicationAttributes
 * @description TypeScript interface defining all Medication model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} name - Medication brand/trade name, required
 * @property {string} [genericName] - Generic/chemical name (nullable)
 * @property {string} dosageForm - Form (tablet, capsule, liquid, injection, etc.), required
 * @property {string} strength - Dosage strength (e.g., "500mg", "10mg/5mL"), required
 * @property {string} [manufacturer] - Pharmaceutical manufacturer name (nullable)
 * @property {string} [ndc] - National Drug Code, unique 11-digit identifier (nullable)
 * @property {boolean} isControlled - Whether medication is a controlled substance, defaults to false
 * @property {'I'|'II'|'III'|'IV'|'V'} [deaSchedule] - DEA Schedule classification (nullable)
 * @property {boolean} requiresWitness - Whether administration requires witness, defaults to false (typically Schedule I-II)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
interface MedicationAttributes {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';
  requiresWitness: boolean;
  isActive: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface MedicationCreationAttributes
 * @description Attributes required when creating a new Medication instance.
 * Extends MedicationAttributes with optional fields that have defaults or are auto-generated.
 */
interface MedicationCreationAttributes
  extends Optional<MedicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isControlled' | 'isActive' | 'deletedAt' | 'deletedBy' | 'genericName' | 'manufacturer' | 'ndc' | 'deaSchedule' | 'requiresWitness'> {}

/**
 * @class Medication
 * @extends Model
 * @description Medication formulary model for managing medication catalog and controlled substances.
 * Tracks DEA schedules, NDC codes, and witness requirements for compliance.
 *
 * @tablename medications
 *
 * Key Features:
 * - DEA Schedule I-V classification for controlled substances
 * - NDC (National Drug Code) unique identifier
 * - Witness requirement flag for high-risk medications
 * - Dosage form and strength tracking
 * - Generic name mapping
 * - Indexed by name, NDC, isControlled, and deaSchedule
 *
 * DEA Schedules:
 * - Schedule I: High abuse potential, no accepted medical use
 * - Schedule II: High abuse potential (e.g., morphine, oxycodone) - requires witness
 * - Schedule III: Moderate abuse potential (e.g., Tylenol with codeine)
 * - Schedule IV: Low abuse potential (e.g., Xanax, Valium)
 * - Schedule V: Lowest abuse potential (e.g., cough preparations)
 *
 * @example
 * // Create a controlled substance medication
 * const medication = await Medication.create({
 *   name: 'Adderall XR',
 *   genericName: 'Amphetamine/Dextroamphetamine',
 *   dosageForm: 'Capsule',
 *   strength: '20mg',
 *   ndc: '54092-0386-01',
 *   isControlled: true,
 *   deaSchedule: 'II',
 *   requiresWitness: true
 * });
 *
 * @example
 * // Find all controlled substances
 * const controlledMeds = await Medication.findAll({
 *   where: { isControlled: true },
 *   order: [['deaSchedule', 'ASC'], ['name', 'ASC']]
 * });
 */
export class Medication extends Model<MedicationAttributes, MedicationCreationAttributes> implements MedicationAttributes {
  public id!: string;
  public name!: string;
  public genericName?: string;
  public dosageForm!: string;
  public strength!: string;
  public manufacturer?: string;
  public ndc?: string;
  public isControlled!: boolean;
  public deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';
  public requiresWitness!: boolean;
  public isActive!: boolean;
  public deletedAt?: Date;
  public deletedBy?: string;
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
    deaSchedule: {
      type: DataTypes.STRING(3),
      allowNull: true,
      validate: {
        isIn: [['I', 'II', 'III', 'IV', 'V']]
      },
      comment: 'DEA Schedule classification for controlled substances (I-V)',
    },
    requiresWitness: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether medication administration requires a witness (typically Schedule I-II)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Soft delete flag - whether medication is currently active',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp - when medication was deactivated',
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'User who deactivated this medication (for audit trail)',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medications',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['ndc'] },
      { fields: ['isControlled'] },
      { fields: ['deaSchedule'] },
      { fields: ['isActive'] },
      { fields: ['deletedAt'] },
      { fields: ['deletedBy'] }
    ],
  }
);
