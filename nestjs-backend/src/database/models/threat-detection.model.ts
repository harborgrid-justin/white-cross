import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface ThreatDetectionAttributes {
  id: string;
  threatType: string;
  severity: string;
  source: string;
  details: any;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'threat_detections',
  timestamps: true,
  indexes: [
    {
      fields: ['threatType'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['isResolved'],
    },
  ],
})
export class ThreatDetection extends Model<ThreatDetectionAttributes> implements ThreatDetectionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  threatType: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  severity: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  source: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  details: any;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isResolved: boolean;

  @Column(DataType.DATE)
  resolvedAt?: Date;

  @Column(DataType.UUID)
  resolvedBy?: string;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
