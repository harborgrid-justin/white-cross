/**
 * LOC: 57656BE06C
 * WC-GEN-033 | BackupLog.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-033 | BackupLog.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { BackupType, BackupStatus } from '../../types/enums';

/**
 * BackupLog Model
 * Tracks all database backup operations
 * Critical for disaster recovery and compliance
 */

interface BackupLogAttributes {
  id: string;
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  fileSize?: number;
  location?: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  triggeredBy?: string;
  createdAt: Date;
}

interface BackupLogCreationAttributes
  extends Optional<
    BackupLogAttributes,
    'id' | 'fileName' | 'fileSize' | 'location' | 'completedAt' | 'error' | 'triggeredBy' | 'createdAt'
  > {}

export class BackupLog extends Model<BackupLogAttributes, BackupLogCreationAttributes> implements BackupLogAttributes {
  public id!: string;
  public type!: BackupType;
  public status!: BackupStatus;
  public fileName?: string;
  public fileSize?: number;
  public location?: string;
  public startedAt!: Date;
  public completedAt?: Date;
  public error?: string;
  public triggeredBy?: string;
  public readonly createdAt!: Date;
}

BackupLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(BackupType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BackupStatus)),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    triggeredBy: {
      type: DataTypes.STRING,
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
    tableName: 'backup_logs',
    timestamps: false,
    indexes: [
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['startedAt'] },
      { fields: ['triggeredBy'] },
    ],
  }
);
