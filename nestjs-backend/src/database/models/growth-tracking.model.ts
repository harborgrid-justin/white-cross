import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface GrowthTrackingAttributes {
  id: string;
  studentId: string;
  measurementDate: Date;
  height?: number;
  heightUnit?: string;
  weight?: number;
  weightUnit?: string;
  bmi?: number;
  percentileHeight?: number;
  percentileWeight?: number;
  percentileBmi?: number;
  notes?: string;
  measuredBy: string;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'growth_tracking',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['measurementDate'],
    },
  ],
})
export class GrowthTracking extends Model<GrowthTrackingAttributes> implements GrowthTrackingAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  measurementDate: Date;

  @Column(DataType.FLOAT)
  height?: number;

  @Default('inches')
  @Column(DataType.ENUM('inches', 'cm'))
  heightUnit?: string;

  @Column(DataType.FLOAT)
  weight?: number;

  @Default('lbs')
  @Column(DataType.ENUM('lbs', 'kg'))
  weightUnit?: string;

  @Column(DataType.FLOAT)
  bmi?: number;

  @Column(DataType.FLOAT)
  percentileHeight?: number;

  @Column(DataType.FLOAT)
  percentileWeight?: number;

  @Column(DataType.FLOAT)
  percentileBmi?: number;

  @Column(DataType.TEXT)
  notes?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  measuredBy: string;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
