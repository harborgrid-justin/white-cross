import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface HealthScreeningAttributes {
  id?: string;
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  results: any;
  passed: boolean;
  notes?: string;
  conductedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'health_screenings',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['screeningType'],
    },
    {
      fields: ['screeningDate'],
    },
  ],
})
export class HealthScreening extends Model<HealthScreeningAttributes> implements HealthScreeningAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  screeningType: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  screeningDate: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  results: any;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  passed: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  conductedBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
