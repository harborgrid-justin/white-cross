import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InventoryTransaction } from './inventory-transaction.entity';
import { MaintenanceLog } from './maintenance-log.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplier: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'unit_cost' })
  unitCost: number;

  @Column({ type: 'integer', name: 'reorder_level' })
  reorderLevel: number;

  @Column({ type: 'integer', name: 'reorder_quantity' })
  reorderQuantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => InventoryTransaction, (transaction) => transaction.inventoryItem)
  transactions: InventoryTransaction[];

  @OneToMany(() => MaintenanceLog, (log) => log.inventoryItem)
  maintenanceLogs: MaintenanceLog[];

  @OneToMany(() => PurchaseOrderItem, (item) => item.inventoryItem)
  purchaseOrderItems: PurchaseOrderItem[];
}
