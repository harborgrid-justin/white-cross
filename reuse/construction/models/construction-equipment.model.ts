
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { EquipmentCategory, EquipmentStatus, OwnershipType, ConditionRating } from '../types/equipment.types';
import { EquipmentMaintenanceRecord } from './equipment-maintenance-record.model';
import { EquipmentAllocation } from './equipment-allocation.model';

@Table({
  tableName: 'construction_equipment',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['equipmentNumber'], unique: true },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['ownershipType'] },
    { fields: ['currentLocation'] },
  ],
})
export class ConstructionEquipment extends Model {
  @ApiProperty({
    description: 'Unique equipment identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({
    description: 'Equipment number/tag',
    example: 'EXC-2024-001',
  })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  equipmentNumber: string;

  @ApiProperty({
    description: 'Equipment category',
    enum: EquipmentCategory,
    example: EquipmentCategory.EXCAVATOR,
  })
  @Column({
    type: DataType.ENUM(...Object.values(EquipmentCategory)),
    allowNull: false,
  })
  @Index
  category: EquipmentCategory;

  @ApiProperty({
    description: 'Equipment manufacturer',
    example: 'Caterpillar',
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  make: string;

  @ApiProperty({
    description: 'Equipment model',
    example: '320',
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  model: string;

  @ApiProperty({
    description: 'Manufacturing year',
    example: 2024,
  })
  @Column({ type: DataType.INTEGER })
  year?: number;

  @ApiProperty({
    description: 'Serial number',
    example: 'CAT320-2024-SN123456',
  })
  @Column({ type: DataType.STRING(100) })
  serialNumber?: string;

  @ApiProperty({
    description: 'VIN or identification number',
    example: '1HGBH41JXMN109186',
  })
  @Column({ type: DataType.STRING(100) })
  vin?: string;

  @ApiProperty({
    description: 'Equipment operational status',
    enum: EquipmentStatus,
    example: EquipmentStatus.AVAILABLE,
  })
  @Column({
    type: DataType.ENUM(...Object.values(EquipmentStatus)),
    defaultValue: EquipmentStatus.AVAILABLE,
  })
  @Index
  status: EquipmentStatus;

  @ApiProperty({
    description: 'Equipment condition rating',
    enum: ConditionRating,
    example: ConditionRating.EXCELLENT,
  })
  @Column({ type: DataType.ENUM(...Object.values(ConditionRating)) })
  conditionRating?: ConditionRating;

  @ApiProperty({
    description: 'Ownership type',
    enum: OwnershipType,
    example: OwnershipType.OWNED,
  })
  @Column({
    type: DataType.ENUM(...Object.values(OwnershipType)),
    allowNull: false,
  })
  @Index
  ownershipType: OwnershipType;

  @ApiProperty({
    description: 'Purchase or lease price',
    example: 350000,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  purchasePrice?: number;

  @ApiProperty({
    description: 'Current book value',
    example: 315000,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  currentValue?: number;

  @ApiProperty({
    description: 'Acquisition date',
    example: '2024-01-15T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  acquisitionDate?: Date;

  @ApiProperty({
    description: 'Current storage or project location',
    example: 'Warehouse-A, Bay 5',
  })
  @Column({ type: DataType.STRING(200) })
  @Index
  currentLocation?: string;

  @ApiProperty({
    description: 'GPS coordinates (latitude, longitude)',
    example: { lat: 40.7128, lng: -74.006 },
  })
  @Column({ type: DataType.JSONB })
  gpsCoordinates?: { lat: number; lng: number };

  @ApiProperty({
    description: 'Total operating hours',
    example: 1250.5,
  })
  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  operatingHours: number;

  @ApiProperty({
    description: 'Current odometer reading (for vehicles)',
    example: 45678,
  })
  @Column({ type: DataType.INTEGER })
  odometer?: number;

  @ApiProperty({
    description: 'Fuel capacity in gallons',
    example: 100,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  fuelCapacity?: number;

  @ApiProperty({
    description: 'Current fuel level percentage',
    example: 75,
  })
  @Column({ type: DataType.DECIMAL(5, 2) })
  fuelLevel?: number;

  @ApiProperty({
    description: 'Next scheduled maintenance date',
    example: '2024-12-15T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  nextMaintenanceDate?: Date;

  @ApiProperty({
    description: 'Last maintenance date',
    example: '2024-11-01T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  lastMaintenanceDate?: Date;

  @ApiProperty({
    description: 'Warranty expiration date',
    example: '2027-01-15T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  warrantyExpiration?: Date;

  @ApiProperty({
    description: 'Insurance expiration date',
    example: '2025-06-30T00:00:00Z',
  })
  @Column({ type: DataType.DATE })
  insuranceExpiration?: Date;

  @ApiProperty({
    description: 'Required certifications',
    example: ['OSHA-CRANE', 'DOT-INSPECTION'],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  certifications?: string[];

  @ApiProperty({
    description: 'Currently assigned operator ID',
    example: 'OP-123',
  })
  @Column({ type: DataType.STRING(50) })
  assignedOperatorId?: string;

  @ApiProperty({
    description: 'Currently assigned project ID',
    example: 'PROJ-2024-045',
  })
  @Column({ type: DataType.STRING(50) })
  assignedProjectId?: string;

  @ApiProperty({
    description: 'Daily rental rate',
    example: 750,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  dailyRentalRate?: number;

  @ApiProperty({
    description: 'Monthly rental rate',
    example: 18000,
  })
  @Column({ type: DataType.DECIMAL(10, 2) })
  monthlyRentalRate?: number;

  @ApiProperty({
    description: 'Equipment specifications (JSON)',
    example: {
      capacity: '20 tons',
      reach: '30 feet',
      bucketSize: '1.5 cubic yards',
    },
  })
  @Column({ type: DataType.JSONB })
  specifications?: Record<string, any>;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Requires specialized operator certification',
  })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({
    description: 'Whether equipment is active',
    example: true,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => EquipmentMaintenanceRecord)
  maintenanceRecords?: EquipmentMaintenanceRecord[];

  @HasMany(() => EquipmentAllocation)
  allocations?: EquipmentAllocation[];
}
