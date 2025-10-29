import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from './inventory-item.model';

export enum MaintenanceType {
  CALIBRATION = 'CALIBRATION',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  CLEANING = 'CLEANING',
  REPLACEMENT = 'REPLACEMENT',
  UPGRADE = 'UPGRADE',
}

export interface MaintenanceLogAttributes {
  id: string;
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  performedById: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  vendor?: string;
  notes?: string;
}

@Table({
  tableName: 'maintenance_logs',
  timestamps: true,
  indexes: [
    {
      fields: ['inventoryItemId'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['performedById'],
    },
    {
      fields: ['nextMaintenanceDate'],
    },
  ],
})
export class MaintenanceLog extends Model<MaintenanceLogAttributes> implements MaintenanceLogAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => InventoryItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryItemId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(MaintenanceType) as string[])),
    allowNull: false,
  })
  type: MaintenanceType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  performedById: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  cost?: number;

  @Column(DataType.DATE)
  nextMaintenanceDate?: Date;

  @Column(DataType.STRING)
  vendor?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  // Relationships
  @BelongsTo(() => InventoryItem)
  inventoryItem?: InventoryItem;
}