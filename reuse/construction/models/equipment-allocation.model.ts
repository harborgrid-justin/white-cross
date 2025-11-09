
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
import { ConstructionEquipment } from './construction-equipment.model';

@Table({
  tableName: 'equipment_allocations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['equipmentId'] },
    { fields: ['projectId'] },
    { fields: ['startDate'] },
    { fields: ['endDate'] },
    { fields: ['allocationStatus'] },
  ],
})
export class EquipmentAllocation extends Model {
  @ApiProperty({
    description: 'Unique allocation identifier',
    example: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
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
    description: 'Project ID',
    example: 'PROJ-2024-045',
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  projectId: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Downtown Office Complex',
  })
  @Column({ type: DataType.STRING(200) })
  projectName?: string;

  @ApiProperty({
    description: 'Project location',
    example: '123 Main St, Downtown',
  })
  @Column({ type: DataType.STRING(200) })
  projectLocation?: string;

  @ApiProperty({
    description: 'Allocation start date',
    example: '2024-11-15T08:00:00Z',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate: Date;

  @ApiProperty({
    description: 'Allocation end date',
    example: '2024-12-15T17:00:00Z',
  })
  @Column({ type: DataType.DATE })
  @Index
  endDate?: Date;

  @ApiProperty({
    description: 'Actual return date',
    example: '2024-12-14T16:30:00Z',
  })
  @Column({ type: DataType.DATE })
  actualReturnDate?: Date;

  @ApiProperty({
    description: 'Assigned operator ID',
    example: 'OP-123',
  })
  @Column({ type: DataType.STRING(50) })
  assignedOperatorId?: string;

  @ApiProperty({
    description: 'Assigned operator name',
    example: 'Mike Johnson',
  })
  @Column({ type: DataType.STRING(100) })
  assignedOperatorName?: string;

  @ApiProperty({
    description: 'Allocation status',
    example: 'active',
  })
  @Column({
    type: DataType.ENUM('pending', 'active', 'completed', 'cancelled'),
    defaultValue: 'pending',
  })
  @Index
  allocationStatus: string;

  @ApiProperty({
    description: 'Daily rate charged',
    example: 750,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  dailyRate?: number;

  @ApiProperty({
    description: 'Total estimated cost',
    example: 22500,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedCost?: number;

  @ApiProperty({
    description: 'Total actual cost',
    example: 21750,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  actualCost?: number;

  @ApiProperty({
    description: 'Operating hours at allocation start',
    example: 1200,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  startingOperatingHours?: number;

  @ApiProperty({
    description: 'Operating hours at allocation end',
    example: 1450,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  endingOperatingHours?: number;

  @ApiProperty({
    description: 'Fuel consumed (gallons)',
    example: 345.5,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  fuelConsumed?: number;

  @ApiProperty({
    description: 'Purpose of allocation',
    example: 'Foundation excavation',
  })
  @Column({ type: DataType.TEXT })
  purpose?: string;

  @ApiProperty({
    description: 'Allocation notes',
    example: 'Requires daily cleaning due to muddy conditions',
  })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({
    description: 'Requested by user ID',
    example: 'USR-456',
  })
  @Column({ type: DataType.STRING(50) })
  requestedBy?: string;

  @ApiProperty({
    description: 'Approved by user ID',
    example: 'MGR-789',
  })
  @Column({ type: DataType.STRING(50) })
  approvedBy?: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;
}
