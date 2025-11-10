
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceType } from '../types/equipment.types';
import { ConstructionEquipment } from './construction-equipment.model';

@Table({
  tableName: 'equipment_maintenance_records',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['equipmentId'] },
    { fields: ['maintenanceType'] },
    { fields: ['scheduledDate'] },
    { fields: ['completionDate'] },
  ],
})
export class EquipmentMaintenanceRecord extends Model {
  @ApiProperty({
    description: 'Unique maintenance record identifier',
    example: '8e1d7a3c-4f2b-4e9a-b1c5-d8f3e6a9c2b4',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({
    description: 'Equipment ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ForeignKey(() => ConstructionEquipment)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  equipmentId: string;

  @BelongsTo(() => ConstructionEquipment)
  equipment?: ConstructionEquipment;

  @ApiProperty({
    description: 'Maintenance type',
    enum: MaintenanceType,
    example: MaintenanceType.PREVENTIVE,
  })
  @Column({
    type: DataType.ENUM(...Object.values(MaintenanceType)),
    allowNull: false,
  })
  @Index
  maintenanceType: MaintenanceType;

  @ApiProperty({
    description: 'Service description',
    example: 'Oil change and filter replacement',
  })
  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @ApiProperty({
    description: 'Scheduled date',
    example: '2024-12-15T09:00:00Z',
  })
  @Column({ type: DataType.DATE })
  @Index
  scheduledDate?: Date;

  @ApiProperty({
    description: 'Completion date',
    example: '2024-12-15T14:30:00Z',
  })
  @Column({ type: DataType.DATE })
  @Index
  completionDate?: Date;

  @ApiProperty({
    description: 'Technician/mechanic name',
    example: 'John Smith',
  })
  @Column({ type: DataType.STRING(100) })
  technicianName?: string;

  @ApiProperty({
    description: 'Service provider/vendor',
    example: 'ABC Equipment Services',
  })
  @Column({ type: DataType.STRING(200) })
  serviceProvider?: string;

  @ApiProperty({
    description: 'Total cost of maintenance',
    example: 450.75,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  totalCost?: number;

  @ApiProperty({
    description: 'Labor cost',
    example: 200,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  laborCost?: number;

  @ApiProperty({
    description: 'Parts cost',
    example: 250.75,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  partsCost?: number;

  @ApiProperty({
    description: 'Parts replaced',
    example: ['Oil filter', 'Engine oil (15W-40)', 'Air filter'],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  partsReplaced?: string[];

  @ApiProperty({
    description: 'Operating hours at service',
    example: 1250,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  operatingHoursAtService?: number;

  @ApiProperty({
    description: 'Downtime in hours',
    example: 5.5,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  downtimeHours?: number;

  @ApiProperty({
    description: 'Work order number',
    example: 'WO-2024-1234',
  })
  @Column({ type: DataType.STRING(50) })
  workOrderNumber?: string;

  @ApiProperty({
    description: 'Findings and recommendations',
    example: 'Hydraulic hoses show minor wear, recommend replacement within 6 months',
  })
  @Column({ type: DataType.TEXT })
  findings?: string;

  @ApiProperty({
    description: 'Follow-up required',
    example: true,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  followUpRequired: boolean;

  @ApiProperty({
    description: 'Next service due date',
    example: '2025-03-15T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  nextServiceDue?: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;
}
