import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  /**
   * Create new inventory item
   */
  async createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    try {
      // Check if item with same name already exists
      const existingItem = await this.inventoryItemRepository.findOne({
        where: {
          name: data.name,
          isActive: true,
        },
      });

      if (existingItem) {
        throw new ConflictException('Inventory item with this name already exists');
      }

      const item = this.inventoryItemRepository.create(data);
      const savedItem = await this.inventoryItemRepository.save(item);

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
      const existingItem = await this.inventoryItemRepository.findOne({ where: { id } });

      if (!existingItem) {
        throw new NotFoundException('Inventory item not found');
      }

      Object.assign(existingItem, data);
      const updatedItem = await this.inventoryItemRepository.save(existingItem);

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
      const item = await this.inventoryItemRepository.findOne({
        where: { id },
        relations: ['transactions', 'maintenanceLogs'],
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

      const items = await this.inventoryItemRepository.find({
        where,
        order: { name: 'ASC' },
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
      const item = await this.inventoryItemRepository.findOne({ where: { id } });

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      // Soft delete by setting isActive to false
      item.isActive = false;
      const deletedItem = await this.inventoryItemRepository.save(item);

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
      const items = await this.inventoryItemRepository.find({
        where: [
          { name: Like(`%${query}%`), isActive: true },
          { description: Like(`%${query}%`), isActive: true },
          { category: Like(`%${query}%`), isActive: true },
          { sku: Like(`%${query}%`), isActive: true },
          { supplier: Like(`%${query}%`), isActive: true },
        ],
        take: limit,
        order: { name: 'ASC' },
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

      return await this.inventoryItemRepository.count({ where });
    } catch (error) {
      this.logger.error('Error getting inventory items count:', error);
      throw error;
    }
  }
}
