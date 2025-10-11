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
      validate: {
        notEmpty: {
          msg: 'Training module title cannot be empty'
        },
        len: {
          args: [3, 200],
          msg: 'Training module title must be between 3 and 200 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Description cannot exceed 2000 characters'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Training module content cannot be empty'
        },
        len: {
          args: [10, 50000],
          msg: 'Content must be between 10 and 50,000 characters'
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Duration must be at least 1 minute'
        },
        max: {
          args: [600],
          msg: 'Duration cannot exceed 600 minutes (10 hours)'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(...Object.values(TrainingCategory)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Training category is required'
        }
      }
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
      validate: {
        min: {
          args: [0],
          msg: 'Order cannot be negative'
        },
        max: {
          args: [10000],
          msg: 'Order cannot exceed 10,000'
        }
      }
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        // Validate attachment URLs
        validateAttachments(value: string[]) {
          if (value && value.length > 20) {
            throw new Error('Cannot have more than 20 attachments');
          }
          if (value && value.some(url => url.length > 500)) {
            throw new Error('Attachment URL cannot exceed 500 characters');
          }
        }
      }
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
