import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'maintenance_logs',
  timestamps: true,
  underscored: false,
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
    {
      fields: ['createdAt'],
      name: 'idx_maintenance_log_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_maintenance_log_updated_at',
    },
  ],
})
export class MaintenanceLog
  extends Model<MaintenanceLogAttributes>
  implements MaintenanceLogAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./inventory-item.model').InventoryItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryItemId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MaintenanceType)],
    },
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

  @Column(DataType.STRING(255))
  vendor?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  // Relationships
  @BelongsTo(() => require('./inventory-item.model').InventoryItem)
  declare inventoryItem?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MaintenanceLog) {
    await createModelAuditHook('MaintenanceLog', instance);
  }
}
