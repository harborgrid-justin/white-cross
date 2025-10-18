/**
 * WC-GEN-054 | Medication.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

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
  createdAt: Date;
  updatedAt: Date;
}

interface MedicationCreationAttributes
  extends Optional<MedicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isControlled' | 'genericName' | 'manufacturer' | 'ndc' | 'deaSchedule' | 'requiresWitness'> {}

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
      { fields: ['deaSchedule'] }
    ],
  }
);
