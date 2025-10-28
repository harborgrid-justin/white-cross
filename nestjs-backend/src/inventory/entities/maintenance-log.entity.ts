import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

export enum MaintenanceType {
  CALIBRATION = 'CALIBRATION',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  CLEANING = 'CLEANING',
  REPLACEMENT = 'REPLACEMENT',
  UPGRADE = 'UPGRADE',
}

@Entity('maintenance_logs')
export class MaintenanceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'inventory_item_id' })
  inventoryItemId: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid', name: 'performed_by_id' })
  performedById: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'timestamp', nullable: true, name: 'next_maintenance_date' })
  nextMaintenanceDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vendor: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => InventoryItem, (item) => item.maintenanceLogs)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;
}
