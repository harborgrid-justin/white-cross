import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * NurseAvailability Model
 * Manages nurse scheduling and availability for appointments including recurring and one-time schedules.
 */

interface NurseAvailabilityAttributes {
  id: string;
  nurseId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: Date;
  isAvailable: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NurseAvailabilityCreationAttributes
  extends Optional<
    NurseAvailabilityAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isRecurring' | 'specificDate' | 'isAvailable' | 'reason'
  > {}

export class NurseAvailability
  extends Model<NurseAvailabilityAttributes, NurseAvailabilityCreationAttributes>
  implements NurseAvailabilityAttributes
{
  public id!: string;
  public nurseId!: string;
  public dayOfWeek!: number;
  public startTime!: string;
  public endTime!: string;
  public isRecurring!: boolean;
  public specificDate?: Date;
  public isAvailable!: boolean;
  public reason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NurseAvailability.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Format: HH:MM',
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Format: HH:MM',
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    specificDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'For non-recurring availability',
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reason for unavailability',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'nurse_availability',
    timestamps: true,
    indexes: [
      { fields: ['nurseId', 'dayOfWeek'] },
      { fields: ['nurseId', 'specificDate'] },
      { fields: ['isAvailable'] },
    ],
  }
);
