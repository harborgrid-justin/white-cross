import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { InventoryItem } from '../database/models/inventory-item.model';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectModel(InventoryItem)
    private readonly inventoryItemModel: typeof InventoryItem,
  ) {}

  /**
   * Create new inventory item
   */
  async createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    try {
      // Check if item with same name already exists
      const existingItem = await this.inventoryItemModel.findOne({
        where: {
          name: data.name,
          isActive: true,
        },
      });

      if (existingItem) {
        throw new ConflictException('Inventory item with this name already exists');
      }

      const savedItem = await this.inventoryItemModel.create({
        ...data,
        isActive: true,
      });

      this.logger.log(`Inventory item created: ${savedItem.name} (${savedItem.category})`);
      return savedItem;
    } catch (error) {
      this.logger.error('Error creating inventory item:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, data: UpdateInventoryItemDto): Promise<InventoryItem> {
    try {
      const existingItem = await this.inventoryItemModel.findByPk(id);

      if (!existingItem) {
        throw new NotFoundException('Inventory item not found');
      }

      const updatedItem = await existingItem.update(data);

      this.logger.log(`Inventory item updated: ${updatedItem.name}`);
      return updatedItem;
    } catch (error) {
      this.logger.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Get single inventory item by ID
   */
  async getInventoryItem(id: string): Promise<InventoryItem> {
    try {
      const item = await this.inventoryItemModel.findByPk(id, {
        include: ['transactions', 'maintenanceLogs'],
      });

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      return item;
    } catch (error) {
      this.logger.error('Error getting inventory item:', error);
      throw error;
    }
  }

  /**
   * Get all inventory items with optional filtering
   */
  async getAllInventoryItems(filters?: {
    category?: string;
    supplier?: string;
    location?: string;
    isActive?: boolean;
  }): Promise<InventoryItem[]> {
    try {
      const where: any = {};

      if (filters?.category) {
        where.category = filters.category;
      }
      if (filters?.supplier) {
        where.supplier = filters.supplier;
      }
      if (filters?.location) {
        where.location = filters.location;
      }
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const items = await this.inventoryItemModel.findAll({
        where,
        order: [['name', 'ASC']],
      });

      return items;
    } catch (error) {
      this.logger.error('Error getting inventory items:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  async deleteInventoryItem(id: string): Promise<InventoryItem> {
    try {
      const item = await this.inventoryItemModel.findByPk(id);

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      // Soft delete by setting isActive to false
      item.isActive = false;
      const deletedItem = await item.save();

      this.logger.log(`Inventory item deleted: ${deletedItem.name}`);
      return deletedItem;
    } catch (error) {
      this.logger.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  /**
   * Search inventory items
   */
  async searchInventoryItems(query: string, limit: number = 20): Promise<InventoryItem[]> {
    try {
      const items = await this.inventoryItemModel.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { category: { [Op.iLike]: `%${query}%` } },
            { sku: { [Op.iLike]: `%${query}%` } },
            { supplier: { [Op.iLike]: `%${query}%` } },
          ],
        },
        limit,
        order: [['name', 'ASC']],
      });

      return items;
    } catch (error) {
      this.logger.error('Error searching inventory items:', error);
      throw error;
    }
  }

  /**
   * Get inventory items count
   */
  async getInventoryItemsCount(isActive?: boolean): Promise<number> {
    try {
      const where: any = {};

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      return await this.inventoryItemModel.count({ where });
    } catch (error) {
      this.logger.error('Error getting inventory items count:', error);
      throw error;
    }
  }
}
