/**
 * TrainingModule Model
 *
 * Sequelize model for training modules for staff education and compliance
 */

import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';

/**
 * Training categories
 */
export enum TrainingCategory {
  HIPAA_COMPLIANCE = 'HIPAA_COMPLIANCE',
  MEDICATION_MANAGEMENT = 'MEDICATION_MANAGEMENT',
  EMERGENCY_PROCEDURES = 'EMERGENCY_PROCEDURES',
  SYSTEM_TRAINING = 'SYSTEM_TRAINING',
  SAFETY_PROTOCOLS = 'SAFETY_PROTOCOLS',
  DATA_SECURITY = 'DATA_SECURITY',
}

/**
 * TrainingModule attributes interface
 */
export interface TrainingModuleAttributes {
  id?: string;
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
  completionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * TrainingModule creation attributes interface
 */
export interface CreateTrainingModuleAttributes {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
  completionCount?: number;
}

/**
 * TrainingModule Model
 *
 * Represents training modules for staff education and compliance
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'training_modules',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['category'] },
    { fields: ['isRequired'] },
    { fields: ['order'] },
    {
      fields: ['createdAt'],
      name: 'idx_training_module_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_training_module_updated_at',
    },
  ],
})
export class TrainingModule extends Model<
  TrainingModuleAttributes,
  CreateTrainingModuleAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Title of the training module',
  })
  title: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Description of the training module',
  })
  description?: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Content/body of the training module',
  })
  content: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Estimated duration in minutes',
  })
  duration?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(TrainingCategory)],
    },
    allowNull: false,
    comment: 'Category of the training module',
  })
  @Index
  category: TrainingCategory;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether completion of this module is required',
  })
  @Index
  isRequired?: boolean;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order of the training module',
  })
  @Index
  order?: number;

  @AllowNull(true)
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: true,
    comment: 'Array of attachment file paths',
  })
  attachments?: string[];

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of times this module has been completed',
  })
  completionCount?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the training module was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the training module was last updated',
  })
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: TrainingModule) {
    await createModelAuditHook('TrainingModule', instance);
  }
}

// Default export for Sequelize-TypeScript
export default TrainingModule;
