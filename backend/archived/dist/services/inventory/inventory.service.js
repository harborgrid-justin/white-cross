"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let InventoryService = class InventoryService extends base_1.BaseService {
    inventoryItemModel;
    constructor(inventoryItemModel) {
        super("InventoryService");
        this.inventoryItemModel = inventoryItemModel;
    }
    async createInventoryItem(data) {
        try {
            const existingItem = await this.inventoryItemModel.findOne({
                where: {
                    name: data.name,
                    isActive: true,
                },
            });
            if (existingItem) {
                throw new common_1.ConflictException('Inventory item with this name already exists');
            }
            const savedItem = await this.inventoryItemModel.create({
                ...data,
                isActive: true,
            });
            this.logInfo(`Inventory item created: ${savedItem.name} (${savedItem.category})`);
            return savedItem;
        }
        catch (error) {
            this.logError('Error creating inventory item:', error);
            throw error;
        }
    }
    async updateInventoryItem(id, data) {
        try {
            const existingItem = await this.inventoryItemModel.findByPk(id);
            if (!existingItem) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
            const updatedItem = await existingItem.update(data);
            this.logInfo(`Inventory item updated: ${updatedItem.name}`);
            return updatedItem;
        }
        catch (error) {
            this.logError('Error updating inventory item:', error);
            throw error;
        }
    }
    async getInventoryItem(id) {
        try {
            const item = await this.inventoryItemModel.findByPk(id, {
                include: ['transactions', 'maintenanceLogs'],
            });
            if (!item) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
            return item;
        }
        catch (error) {
            this.logError('Error getting inventory item:', error);
            throw error;
        }
    }
    async getAllInventoryItems(filters) {
        try {
            const where = {};
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
        }
        catch (error) {
            this.logError('Error getting inventory items:', error);
            throw error;
        }
    }
    async deleteInventoryItem(id) {
        try {
            const item = await this.inventoryItemModel.findByPk(id);
            if (!item) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
            item.isActive = false;
            const deletedItem = await item.save();
            this.logInfo(`Inventory item deleted: ${deletedItem.name}`);
            return deletedItem;
        }
        catch (error) {
            this.logError('Error deleting inventory item:', error);
            throw error;
        }
    }
    async searchInventoryItems(query, limit = 20) {
        try {
            if (!query || query.trim().length === 0) {
                return [];
            }
            const sanitizedQuery = query
                .trim()
                .replace(/[&|!():*]/g, ' ')
                .split(/\s+/)
                .filter((term) => term.length > 0)
                .map((term) => `${term}:*`)
                .join(' & ');
            if (!sanitizedQuery) {
                return [];
            }
            const items = await this.inventoryItemModel.sequelize.query(`
        SELECT
          "id",
          "name",
          "category",
          "description",
          "sku",
          "supplier",
          "unitCost",
          "reorderLevel",
          "reorderQuantity",
          "location",
          "notes",
          "isActive",
          "createdAt",
          "updatedAt",
          ts_rank(search_vector, to_tsquery('english', :query)) as rank
        FROM inventory_items
        WHERE
          "isActive" = true
          AND search_vector @@ to_tsquery('english', :query)
        ORDER BY rank DESC, "name" ASC
        LIMIT :limit
        `, {
                replacements: { query: sanitizedQuery, limit },
                type: 'SELECT',
                model: this.inventoryItemModel,
                mapToModel: true,
            });
            this.logInfo(`Full-text search returned ${items.length} results for query: "${query}"`);
            return items;
        }
        catch (error) {
            this.logError('Error searching inventory items:', error);
            this.logWarning('Falling back to ILIKE search - consider running full-text search migration');
            return this.fallbackILikeSearch(query, limit);
        }
    }
    async fallbackILikeSearch(query, limit) {
        return this.inventoryItemModel.findAll({
            where: {
                isActive: true,
                [sequelize_2.Op.or]: [
                    { name: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    { description: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    { category: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    { sku: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    { supplier: { [sequelize_2.Op.iLike]: `%${query}%` } },
                ],
            },
            limit,
            order: [['name', 'ASC']],
        });
    }
    async getInventoryItemsCount(isActive) {
        try {
            const where = {};
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            return await this.inventoryItemModel.count({ where });
        }
        catch (error) {
            this.logError('Error getting inventory items count:', error);
            throw error;
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.InventoryItem)),
    __metadata("design:paramtypes", [Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map