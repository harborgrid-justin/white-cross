import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '@/common/base';
import { PurchaseOrder, PurchaseOrderStatus } from '../../database/models/purchase-order.model';
import { PurchaseOrderItem } from '../../database/models/purchase-order-item.model';
import { Vendor } from '../../database/models/vendor.model';
import { InventoryItem } from '../../database/models/inventory-item.model';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';

@Injectable()
export class InventoryPurchaseOrderService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(PurchaseOrder)
    private readonly purchaseOrderModel: typeof PurchaseOrder,
    @InjectModel(PurchaseOrderItem)
    private readonly purchaseOrderItemModel: typeof PurchaseOrderItem,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(InventoryItem)
    private readonly inventoryItemModel: typeof InventoryItem,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create purchase order with comprehensive validation
   */
  async createPurchaseOrder(
    data: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // Verify vendor exists and is active
      const vendor = await this.vendorModel.findByPk(data.vendorId, {
        transaction,
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if (!vendor.isActive) {
        throw new BadRequestException(
          'Cannot create purchase order for inactive vendor',
        );
      }

      // Validate order number uniqueness
      const existingOrder = await this.purchaseOrderModel.findOne({
        where: { orderNumber: data.orderNumber },
        transaction,
      });

      if (existingOrder) {
        throw new BadRequestException(
          `Purchase order with number ${data.orderNumber} already exists`,
        );
      }

      // Validate items array
      if (!data.items || data.items.length === 0) {
        throw new BadRequestException(
          'Purchase order must contain at least one item',
        );
      }

      // Calculate totals and validate items
      let subtotal = 0;
      const orderItems: any[] = [];
      const itemIds = new Set<string>();

      for (const item of data.items) {
        // Check for duplicate items in the order
        if (itemIds.has(item.inventoryItemId)) {
          throw new BadRequestException(
            'Purchase order cannot contain duplicate items',
          );
        }
        itemIds.add(item.inventoryItemId);

        const inventoryItem = await this.inventoryItemModel.findByPk(
          item.inventoryItemId,
          { transaction },
        );

        if (!inventoryItem) {
          throw new NotFoundException(
            `Inventory item not found: ${item.inventoryItemId}`,
          );
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
      const purchaseOrder = await this.purchaseOrderModel.create(
        {
          orderNumber: data.orderNumber,
          vendorId: data.vendorId,
          orderDate: new Date(data.orderDate),
          expectedDate: data.expectedDate
            ? new Date(data.expectedDate)
            : undefined,
          notes: data.notes,
          subtotal,
          tax: 0,
          shipping: 0,
          total: subtotal,
          status: PurchaseOrderStatus.PENDING,
        } as any,
        { transaction },
      );

      // Create purchase order items
      for (const item of orderItems) {
        await this.purchaseOrderItemModel.create(
          {
            ...item,
            purchaseOrderId: purchaseOrder.id,
          },
          { transaction },
        );
      }

      // Reload with associations BEFORE commit (while still in transaction)
      const completeOrder = await this.purchaseOrderModel.findByPk(
        purchaseOrder.id,
        {
          include: [
            { model: Vendor, as: 'vendor' },
            {
              model: PurchaseOrderItem,
              as: 'items',
              include: [{ model: InventoryItem, as: 'inventoryItem' }],
            },
          ],
          transaction,
        },
      );

      if (!completeOrder) {
        throw new Error('Failed to reload purchase order after creation');
      }

      await transaction.commit();

      this.logger.log(
        `Purchase order created: ${completeOrder.orderNumber} (${orderItems.length} items, $${subtotal.toFixed(2)})`,
      );

      return completeOrder;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error creating purchase order:', error);
      // Generic error to avoid exposing internal details
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to create purchase order. Please try again.');
    }
  }

  /**
   * Get purchase orders with filtering
   */
  async getPurchaseOrders(
    status?: PurchaseOrderStatus,
    vendorId?: string,
  ): Promise<PurchaseOrder[]> {
    try {
      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (vendorId) {
        where.vendorId = vendorId;
      }

      const purchaseOrders = await this.purchaseOrderModel.findAll({
        where,
        include: [
          { model: Vendor, as: 'vendor' },
          { model: PurchaseOrderItem, as: 'items' },
        ],
        order: [['orderDate', 'DESC']],
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
      const purchaseOrder = await this.purchaseOrderModel.findByPk(id, {
        include: [
          { model: Vendor, as: 'vendor' },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [{ model: InventoryItem, as: 'inventoryItem' }],
          },
        ],
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

  async updatePurchaseOrderStatus(
    id: string,
    status: PurchaseOrderStatus,
    receivedDate?: Date,
  ): Promise<PurchaseOrder> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const purchaseOrder = await this.purchaseOrderModel.findByPk(id, {
        include: [{ model: PurchaseOrderItem, as: 'items' }],
        transaction,
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }

      // Validate status transition
      const validTransitions: Record<
        PurchaseOrderStatus,
        PurchaseOrderStatus[]
      > = {
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
      if (
        [
          PurchaseOrderStatus.RECEIVED,
          PurchaseOrderStatus.PARTIALLY_RECEIVED,
        ].includes(status)
      ) {
        purchaseOrder.receivedDate = receivedDate || new Date();
      }

      const updatedOrder = await purchaseOrder.save({ transaction });
      await transaction.commit();

      this.logger.log(
        `Purchase order ${purchaseOrder.orderNumber} status updated: ${currentStatus} -> ${status}`,
      );

      return updatedOrder;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error updating purchase order status:', error);
      // Generic error to avoid exposing internal details
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(
        'Failed to update purchase order status. Please try again.',
      );
    }
  }
}
