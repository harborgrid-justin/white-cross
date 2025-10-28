import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

export enum InventoryTransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  DISPOSAL = 'DISPOSAL',
}

@Entity('inventory_transactions')
export class InventoryTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'inventory_item_id' })
  inventoryItemId: string;

  @Column({
    type: 'enum',
    enum: InventoryTransactionType,
  })
  type: InventoryTransactionType;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'unit_cost' })
  unitCost: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'batch_number' })
  batchNumber: string;

  @Column({ type: 'timestamp', nullable: true, name: 'expiration_date' })
  expirationDate: Date;

  @Column({ type: 'uuid', name: 'performed_by_id' })
  performedById: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => InventoryItem, (item) => item.transactions)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;
}
