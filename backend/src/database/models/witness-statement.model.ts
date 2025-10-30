import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;

export enum WitnessType {
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  VISITOR = 'VISITOR',
  OTHER = 'OTHER'
  }

export interface WitnessStatementAttributes {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  incidentReport?: any;
}

@Table({
  tableName: 'witness_statements',
  timestamps: true,
  indexes: [
    {
      fields: ['incidentReportId', 'verified']
  },
  ]
  })
export class WitnessStatement extends Model<WitnessStatementAttributes> implements WitnessStatementAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./incident-report.model').IncidentReport)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @Index
  incidentReportId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  witnessName: string;

  @Column({
    type: DataType.ENUM(...(Object.values(WitnessType) as string[])),
    allowNull: false
  })
  witnessType: WitnessType;

  @AllowNull
  @Column({
    type: DataType.STRING(255)
  })
  witnessContact?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  statement: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  @Index
  verified: boolean;

  @AllowNull
  @Column({
    type: DataType.UUID
  })
  verifiedBy?: string;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  verifiedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @BelongsTo(() => require('./incident-report.model').IncidentReport, { foreignKey: 'incidentReportId', as: 'incidentReport' })
  declare incidentReport?: any;
}
