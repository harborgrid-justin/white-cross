import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { Vendor } from '../entities/vendor.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
  private readonly logger = new Logger(PurchaseOrderService.name);

  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create purchase order with comprehensive validation
   */
  async createPurchaseOrder(data: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify vendor exists and is active
      const vendor = await this.vendorRepository.findOne({ where: { id: data.vendorId } });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if (!vendor.isActive) {
        throw new BadRequestException('Cannot create purchase order for inactive vendor');
      }

      // Validate order number uniqueness
      const existingOrder = await this.purchaseOrderRepository.findOne({
        where: { orderNumber: data.orderNumber },
      });

      if (existingOrder) {
        throw new BadRequestException(
          `Purchase order with number ${data.orderNumber} already exists`,
        );
      }

      // Validate items array
      if (!data.items || data.items.length === 0) {
        throw new BadRequestException('Purchase order must contain at least one item');
      }

      // Calculate totals and validate items
      let subtotal = 0;
      const orderItems: any[] = [];
      const itemIds = new Set<string>();

      for (const item of data.items) {
        // Check for duplicate items in the order
        if (itemIds.has(item.inventoryItemId)) {
          throw new BadRequestException('Purchase order cannot contain duplicate items');
        }
        itemIds.add(item.inventoryItemId);

        const inventoryItem = await this.inventoryItemRepository.findOne({
          where: { id: item.inventoryItemId },
        });

        if (!inventoryItem) {
          throw new NotFoundException(`Inventory item not found: ${item.inventoryItemId}`);
        }

        if (!inventoryItem.isActive) {
          throw new BadRequestException(
            `Cannot order inactive inventory item: ${inventoryItem.name}`,
          );
        }

        const itemTotal = item.unitCost * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: itemTotal,
        });
      }

      // Create purchase order
      const purchaseOrder = this.purchaseOrderRepository.create({
        orderNumber: data.orderNumber,
        vendorId: data.vendorId,
        orderDate: new Date(data.orderDate),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        notes: data.notes,
        subtotal,
        tax: 0,
        shipping: 0,
        total: subtotal,
        status: PurchaseOrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(purchaseOrder) as PurchaseOrder;

      // Create purchase order items
      for (const item of orderItems) {
        const orderItem = this.purchaseOrderItemRepository.create({
          ...item,
          purchaseOrderId: savedOrder.id,
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();

      // Reload with associations
      const completeOrder = await this.purchaseOrderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['vendor', 'items', 'items.inventoryItem'],
      });

      if (!completeOrder) {
        throw new Error('Failed to reload purchase order after creation');
      }

      this.logger.log(
        `Purchase order created: ${completeOrder.orderNumber} (${orderItems.length} items, $${subtotal.toFixed(2)})`,
      );

      return completeOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating purchase order:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get purchase orders with filtering
   */
  async getPurchaseOrders(status?: PurchaseOrderStatus, vendorId?: string): Promise<PurchaseOrder[]> {
    try {
      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (vendorId) {
        where.vendorId = vendorId;
      }

      const purchaseOrders = await this.purchaseOrderRepository.find({
        where,
        relations: ['vendor', 'items'],
        order: { orderDate: 'DESC' },
      });

      return purchaseOrders;
    } catch (error) {
      this.logger.error('Error getting purchase orders:', error);
      throw error;
    }
  }

  /**
   * Get purchase order by ID
   */
  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: ['vendor', 'items', 'items.inventoryItem'],
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      return purchaseOrder;
    } catch (error) {
      this.logger.error('Error getting purchase order by ID:', error);
      throw error;
    }
  }

  /**
   * Update purchase order status with workflow validation
   */
  async updatePurchaseOrderStatus(
    id: string,
    status: PurchaseOrderStatus,
    receivedDate?: Date,
  ): Promise<PurchaseOrder> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: ['items'],
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      // Validate status transition
      const validTransitions: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
        [PurchaseOrderStatus.PENDING]: [
          PurchaseOrderStatus.APPROVED,
          PurchaseOrderStatus.CANCELLED,
        ],
        [PurchaseOrderStatus.APPROVED]: [
          PurchaseOrderStatus.ORDERED,
          PurchaseOrderStatus.CANCELLED,
        ],
        [PurchaseOrderStatus.ORDERED]: [
          PurchaseOrderStatus.PARTIALLY_RECEIVED,
          PurchaseOrderStatus.RECEIVED,
          PurchaseOrderStatus.CANCELLED,
        ],
        [PurchaseOrderStatus.PARTIALLY_RECEIVED]: [
          PurchaseOrderStatus.RECEIVED,
          PurchaseOrderStatus.CANCELLED,
        ],
        [PurchaseOrderStatus.RECEIVED]: [],
        [PurchaseOrderStatus.CANCELLED]: [],
      };

      const currentStatus = purchaseOrder.status;
      if (!validTransitions[currentStatus].includes(status)) {
        throw new BadRequestException(
          `Invalid status transition from ${currentStatus} to ${status}`,
        );
      }

      // Update status
      purchaseOrder.status = status;
      if ([PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.PARTIALLY_RECEIVED].includes(status)) {
        purchaseOrder.receivedDate = receivedDate || new Date();
      }

      const updatedOrder = await queryRunner.manager.save(purchaseOrder);
      await queryRunner.commitTransaction();

      this.logger.log(
        `Purchase order ${purchaseOrder.orderNumber} status updated: ${currentStatus} -> ${status}`,
      );

      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error updating purchase order status:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
