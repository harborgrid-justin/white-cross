/**
 * WC-GEN-040 | TrainingCompletion.ts - General utility functions and operations
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

/**
 * TrainingCompletion Model
 * Tracks user completion of training modules
 * Maintains certification records and expiration dates
 */

interface TrainingCompletionAttributes {
  id: string;
  userId: string;
  moduleId: string;
  score?: number;
  completedAt: Date;
  expiresAt?: Date;
  certificateUrl?: string;
  notes?: string;
  createdAt: Date;
}

interface TrainingCompletionCreationAttributes
  extends Optional<
    TrainingCompletionAttributes,
    'id' | 'score' | 'completedAt' | 'expiresAt' | 'certificateUrl' | 'notes' | 'createdAt'
  > {}

export class TrainingCompletion
  extends Model<TrainingCompletionAttributes, TrainingCompletionCreationAttributes>
  implements TrainingCompletionAttributes
{
  public id!: string;
  public userId!: string;
  public moduleId!: string;
  public score?: number;
  public completedAt!: Date;
  public expiresAt?: Date;
  public certificateUrl?: string;
  public notes?: string;
  public readonly createdAt!: Date;
}

TrainingCompletion.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moduleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'training_completions',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['userId', 'moduleId'] },
      { fields: ['userId'] },
      { fields: ['moduleId'] },
      { fields: ['completedAt'] },
      { fields: ['expiresAt'] },
    ],
  }
);
