import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { TreatmentStatus } from '../../clinical/enums/treatment-status.enum';

export interface TreatmentPlanAttributes {
  id?: string;
  studentId: string;
  diagnosis: string;
  planDetails: any;
  startDate: Date;
  endDate?: Date;
  status: TreatmentStatus;
  prescribedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'treatment_plans',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class TreatmentPlan extends Model<TreatmentPlanAttributes> implements TreatmentPlanAttributes {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  diagnosis: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  planDetails: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column(DataType.DATE)
  endDate?: Date;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(TreatmentStatus)]
    },
    allowNull: false,
  })
  status: TreatmentStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  prescribedBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
