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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;

export enum WitnessType {
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  VISITOR = 'VISITOR',
  OTHER = 'OTHER',
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
      fields: ['incident_report_id', 'verified'],
    },
  ],
})
export class WitnessStatement extends Model<WitnessStatementAttributes> implements WitnessStatementAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'incident_report_id',
  })
  @Index
  incidentReportId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'witness_name',
  })
  witnessName: string;

  @Column({
    type: DataType.ENUM(...(Object.values(WitnessType) as string[])),
    allowNull: false,
    field: 'witness_type',
  })
  witnessType: WitnessType;

  @AllowNull
  @Column({
    type: DataType.STRING(255),
    field: 'witness_contact',
  })
  witnessContact?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  statement: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  verified: boolean;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'verified_by',
  })
  verifiedBy?: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'verified_at',
  })
  verifiedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @BelongsTo(() => require('./incident-report.model').IncidentReport, { foreignKey: 'incidentReportId', as: 'incidentReport' })
  declare incidentReport?: any;
}
