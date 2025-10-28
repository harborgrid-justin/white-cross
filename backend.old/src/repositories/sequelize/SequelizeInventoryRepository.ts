/**
 * Sequelize Inventory Repository Implementation
 * @description Concrete implementation of IInventoryRepository using Sequelize ORM
 */

import { Op, fn, col, literal } from 'sequelize';
import {
  IInventoryRepository,
  MedicationInventory as InventoryEntity,
  InventoryFilters,
  InventoryAlert,
  InventoryStatistics,
  CreateInventoryData,
  UpdateInventoryData
} from '../interfaces/IInventoryRepository';
import { RepositoryOptions } from '../interfaces/IRepository';
import { MedicationInventory, Medication } from '../../database/models';

export class SequelizeInventoryRepository implements IInventoryRepository {
  async findById(id: string, options?: RepositoryOptions): Promise<InventoryEntity | null> {
    const inventory = await MedicationInventory.findByPk(id, {
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return inventory ? this.toEntity(inventory) : null;
  }

  async findAll(filters?: InventoryFilters, options?: RepositoryOptions): Promise<InventoryEntity[]> {
    const where = this.buildWhereClause(filters);
    const items = await MedicationInventory.findAll({
      where,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['expirationDate', 'ASC']],
      transaction: options?.transaction
    });
    return items.map(i => this.toEntity(i));
  }

  async findOne(filters: any, options?: RepositoryOptions): Promise<InventoryEntity | null> {
    const inventory = await MedicationInventory.findOne({
      where: filters,
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return inventory ? this.toEntity(inventory) : null;
  }

  async create(data: CreateInventoryData, options?: RepositoryOptions): Promise<InventoryEntity> {
    const inventory = await MedicationInventory.create(data as any, {
      transaction: options?.transaction
    });
    return this.toEntity(inventory);
  }

  async update(id: string, data: UpdateInventoryData, options?: RepositoryOptions): Promise<InventoryEntity> {
    const inventory = await MedicationInventory.findByPk(id, { transaction: options?.transaction });
    if (!inventory) {
      throw new Error(`Inventory item with id ${id} not found`);
    }
    await inventory.update(data as any, { transaction: options?.transaction });
    return this.toEntity(inventory);
  }

  async delete(id: string, options?: RepositoryOptions): Promise<void> {
    const inventory = await MedicationInventory.findByPk(id, { transaction: options?.transaction });
    if (!inventory) {
      throw new Error(`Inventory item with id ${id} not found`);
    }
    await inventory.update({ quantity: 0 } as any, { transaction: options?.transaction });
  }

  async count(filters?: InventoryFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return await MedicationInventory.count({ where });
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: InventoryFilters,
    options?: RepositoryOptions
  ): Promise<{ rows: InventoryEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const { rows, count } = await MedicationInventory.findAndCountAll({
      where,
      limit,
      offset,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['expirationDate', 'ASC']],
      transaction: options?.transaction
    });
    return { rows: rows.map(i => this.toEntity(i)), count };
  }

  async findByMedication(medicationId: string): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: { medicationId },
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findLowStock(threshold: number = 1.0): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: {
        [Op.and]: [
          literal(`quantity <= (reorderLevel * ${threshold})`)
        ]
      },
      include: [{ model: Medication, as: 'medication' }],
      order: [['quantity', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findExpiring(days: number): Promise<InventoryEntity[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const items = await MedicationInventory.findAll({
      where: {
        expirationDate: {
          [Op.lte]: expirationDate,
          [Op.gte]: new Date()
        },
        quantity: { [Op.gt]: 0 }
      },
      include: [{ model: Medication, as: 'medication' }],
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findByBatchNumber(batchNumber: string): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: { batchNumber },
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findByLotNumber(lotNumber: string): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: { batchNumber: lotNumber },
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findByLocation(location: string): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: { supplier: location },
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findByVendor(vendorId: string): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: { supplier: vendorId },
      order: [['expirationDate', 'DESC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async getTotalQuantityByMedication(medicationId: string): Promise<number> {
    const result = await MedicationInventory.findOne({
      attributes: [[fn('SUM', col('quantity')), 'total']],
      where: { medicationId },
      raw: true
    });
    return result ? parseInt((result as any).total) || 0 : 0;
  }

  async getInventoryAlerts(expiringDays: number = 30): Promise<InventoryAlert[]> {
    const alerts: InventoryAlert[] = [];

    // Low stock alerts
    const lowStock = await this.findLowStock();
    for (const item of lowStock) {
      const plain = item as any;
      const quantityBelow = plain.reorderLevel - plain.quantity;
      alerts.push({
        type: 'LOW_STOCK',
        severity: quantityBelow > plain.reorderLevel * 0.5 ? 'CRITICAL' : quantityBelow > plain.reorderLevel * 0.25 ? 'HIGH' : 'MEDIUM',
        inventory: item,
        medication: plain.medication,
        message: `Low stock: ${plain.quantity} ${plain.unit} remaining (reorder level: ${plain.reorderLevel})`,
        quantityBelow
      });
    }

    // Expiring alerts
    const expiring = await this.findExpiring(expiringDays);
    for (const item of expiring) {
      const plain = item as any;
      const daysUntil = Math.floor((new Date(plain.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      alerts.push({
        type: 'EXPIRING_SOON',
        severity: daysUntil <= 7 ? 'CRITICAL' : daysUntil <= 14 ? 'HIGH' : daysUntil <= 21 ? 'MEDIUM' : 'LOW',
        inventory: item,
        medication: plain.medication,
        message: `Expiring in ${daysUntil} days`,
        daysUntilExpiration: daysUntil
      });
    }

    // Expired alerts
    const expired = await this.findExpired();
    for (const item of expired) {
      const plain = item as any;
      alerts.push({
        type: 'EXPIRED',
        severity: 'CRITICAL',
        inventory: item,
        medication: plain.medication,
        message: `Expired on ${new Date(plain.expirationDate).toLocaleDateString()}`,
        daysUntilExpiration: 0
      });
    }

    return alerts;
  }

  async batchNumberExists(batchNumber: string, excludeId?: string): Promise<boolean> {
    const where: any = { batchNumber };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await MedicationInventory.count({ where });
    return count > 0;
  }

  async updateQuantity(id: string, quantityChange: number): Promise<InventoryEntity> {
    const inventory = await MedicationInventory.findByPk(id);
    if (!inventory) {
      throw new Error(`Inventory item with id ${id} not found`);
    }
    const currentQuantity = inventory.get('quantity') as number;
    const newQuantity = currentQuantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error(`Insufficient quantity. Current: ${currentQuantity}, Requested change: ${quantityChange}`);
    }
    await inventory.update({ quantity: newQuantity } as any);
    return this.toEntity(inventory);
  }

  async getInventoryValue(medicationId?: string): Promise<number> {
    const where: any = {};
    if (medicationId) {
      where.medicationId = medicationId;
    }

    const result = await MedicationInventory.findOne({
      attributes: [[fn('SUM', literal('quantity * "costPerUnit"')), 'total']],
      where,
      raw: true
    });

    return result ? parseFloat((result as any).total) || 0 : 0;
  }

  async getInventoryStatistics(): Promise<InventoryStatistics> {
    const totalItems = await MedicationInventory.count();
    const totalValue = await this.getInventoryValue();

    const lowStock = await this.findLowStock();
    const expiring = await this.findExpiring(30);
    const expired = await this.findExpired();

    const totalQuantityResult = await MedicationInventory.findOne({
      attributes: [[fn('SUM', col('quantity')), 'total']],
      raw: true
    });

    const uniqueMedicationsResult = await MedicationInventory.findOne({
      attributes: [[fn('COUNT', fn('DISTINCT', col('medicationId'))), 'count']],
      raw: true
    });

    return {
      totalItems,
      totalValue,
      lowStockCount: lowStock.length,
      expiringCount: expiring.length,
      expiredCount: expired.length,
      totalQuantity: totalQuantityResult ? parseInt((totalQuantityResult as any).total) || 0 : 0,
      uniqueMedications: uniqueMedicationsResult ? parseInt((uniqueMedicationsResult as any).count) || 0 : 0
    };
  }

  async findExpired(): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: {
        expirationDate: { [Op.lt]: new Date() },
        quantity: { [Op.gt]: 0 }
      },
      include: [{ model: Medication, as: 'medication' }],
      order: [['expirationDate', 'ASC']]
    });
    return items.map(i => this.toEntity(i));
  }

  async findReceivedBetween(startDate: Date, endDate: Date): Promise<InventoryEntity[]> {
    const items = await MedicationInventory.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      order: [['createdAt', 'DESC']]
    });
    return items.map(i => this.toEntity(i));
  }

  private buildWhereClause(filters?: InventoryFilters): any {
    const where: any = {};
    if (!filters) return where;

    if (filters.medicationId) where.medicationId = filters.medicationId;
    if (filters.location) where.supplier = filters.location;
    if (filters.vendorId) where.supplier = filters.vendorId;
    if (filters.lowStock) {
      where[Op.and] = [literal('quantity <= reorderLevel')];
    }
    if (filters.expiringSoon) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + filters.expiringSoon);
      where.expirationDate = { [Op.lte]: expirationDate, [Op.gte]: new Date() };
    }

    return where;
  }

  private toEntity(model: any): InventoryEntity {
    const plain = model.get({ plain: true });
    return {
      id: plain.id,
      medicationId: plain.medicationId,
      quantity: plain.quantity,
      unit: plain.unit,
      batchNumber: plain.batchNumber,
      lotNumber: plain.batchNumber,
      expirationDate: plain.expirationDate,
      receivedDate: plain.createdAt,
      location: plain.supplier,
      reorderLevel: plain.reorderLevel,
      reorderQuantity: plain.reorderLevel,
      vendorId: plain.supplier,
      cost: plain.costPerUnit,
      notes: '',
      isActive: true,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}
