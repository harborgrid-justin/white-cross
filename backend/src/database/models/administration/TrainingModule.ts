import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { TrainingCategory } from '../../types/enums';

/**
 * TrainingModule Model
 * Manages training content for staff including HIPAA compliance,
 * medication management, and emergency procedures
 */

interface TrainingModuleAttributes {
  id: string;
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired: boolean;
  order: number;
  attachments: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TrainingModuleCreationAttributes
  extends Optional<
    TrainingModuleAttributes,
    'id' | 'description' | 'duration' | 'isRequired' | 'order' | 'attachments' | 'isActive' | 'createdAt' | 'updatedAt'
  > {}

export class TrainingModule
  extends Model<TrainingModuleAttributes, TrainingModuleCreationAttributes>
  implements TrainingModuleAttributes
{
  public id!: string;
  public title!: string;
  public description?: string;
  public content!: string;
  public duration?: number;
  public category!: TrainingCategory;
  public isRequired!: boolean;
  public order!: number;
  public attachments!: string[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TrainingModule.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(TrainingCategory)),
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'training_modules',
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['isRequired'] },
      { fields: ['isActive'] },
      { fields: ['order'] },
    ],
  }
);
