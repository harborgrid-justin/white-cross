/**
 * @fileoverview Inventory Management Query Composites for Sequelize + NestJS
 * @module reuse/clinic/composites/inventory-management-queries-composites
 * @description Production-ready inventory operations with medication tracking,
 * supply management, expiration monitoring, usage analytics, and automated ordering.
 * Composed from existing health and data utilities for comprehensive pharmacy management.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  OrderItem,
  literal,
  fn,
  col,
} from 'sequelize';

/**
 * Inventory item configuration
 */
export interface InventoryItemConfig {
  itemId: string;
  itemName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitCost: number;
}

/**
 * Expiration tracking result
 */
export interface ExpirationTrackingResult {
  itemId: string;
  itemName: string;
  lotNumber: string;
  expirationDate: Date;
  quantity: number;
  daysUntilExpiration: number;
  urgencyLevel: 'critical' | 'warning' | 'normal';
}

/**
 * Usage analytics metrics
 */
export interface UsageAnalyticsMetrics {
  itemId: string;
  totalUsage: number;
  avgDailyUsage: number;
  peakUsageDay: string;
  projectedDepletion: Date;
  wastageRate: number;
}

/**
 * Track medication inventory levels
 *
 * @param model - Inventory model
 * @param location - Storage location
 * @param transaction - Optional transaction
 * @returns Inventory items
 *
 * @example
 * ```typescript
 * const inventory = await trackMedicationInventory(Inventory, 'PHARM-01');
 * console.log(`${inventory.length} items in stock`);
 * ```
 */
export async function trackMedicationInventory<M extends Model>(
  model: ModelCtor<M>,
  location?: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('InventoryQueries::trackMedicationInventory');

  try {
    const where: WhereOptions<any> = {
      itemType: 'medication',
    };

    if (location) {
      where.storageLocation = location;
    }

    const items = await model.findAll({
      where,
      order: [['itemName', 'ASC']],
      transaction,
    });

    logger.log(`Tracked ${items.length} medication items`);

    return items;
  } catch (error) {
    logger.error('Failed to track medication inventory', error);
    throw new InternalServerErrorException('Failed to track medication inventory');
  }
}

/**
 * Find items below reorder level
 *
 * @param model - Inventory model
 * @param category - Item category (optional)
 * @param transaction - Optional transaction
 * @returns Items needing reorder
 *
 * @example
 * ```typescript
 * const needsReorder = await findItemsBelowReorderLevel(Inventory, 'medications');
 * ```
 */
export async function findItemsBelowReorderLevel<M extends Model>(
  model: ModelCtor<M>,
  category?: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('InventoryQueries::findItemsBelowReorderLevel');

  try {
    const where: WhereOptions<any> = {
      [Op.and]: [
        literal('"current_stock" <= "reorder_level"'),
      ],
    };

    if (category) {
      where.category = category;
    }

    const items = await model.findAll({
      where,
      order: [
        [literal('("reorder_level" - "current_stock")'), 'DESC'],
      ],
      transaction,
    });

    logger.log(`Found ${items.length} items below reorder level`);

    return items;
  } catch (error) {
    logger.error('Failed to find items below reorder level', error);
    throw new InternalServerErrorException('Failed to find items below reorder level');
  }
}

/**
 * Track expiring medications
 *
 * @param sequelize - Sequelize instance
 * @param daysAhead - Days to look ahead
 * @param transaction - Optional transaction
 * @returns Expiring items
 *
 * @example
 * ```typescript
 * const expiring = await trackExpiringMedications(sequelize, 90);
 * console.log(`${expiring.length} items expiring in 90 days`);
 * ```
 */
export async function trackExpiringMedications(
  sequelize: Sequelize,
  daysAhead: number = 90,
  transaction?: Transaction
): Promise<ExpirationTrackingResult[]> {
  const logger = new Logger('InventoryQueries::trackExpiringMedications');

  try {
    const query = `
      SELECT
        i.id AS item_id,
        i.item_name,
        i.lot_number,
        i.expiration_date,
        i.quantity,
        EXTRACT(DAY FROM (i.expiration_date - NOW())) AS days_until_expiration,
        CASE
          WHEN i.expiration_date <= NOW() THEN 'expired'
          WHEN i.expiration_date <= NOW() + INTERVAL '30 days' THEN 'critical'
          WHEN i.expiration_date <= NOW() + INTERVAL '${daysAhead} days' THEN 'warning'
          ELSE 'normal'
        END AS urgency_level
      FROM inventory i
      WHERE i.item_type = 'medication'
        AND i.expiration_date IS NOT NULL
        AND i.expiration_date <= NOW() + INTERVAL '${daysAhead} days'
        AND i.quantity > 0
      ORDER BY i.expiration_date ASC
    `;

    const results = await sequelize.query<ExpirationTrackingResult>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} items expiring within ${daysAhead} days`);

    return results;
  } catch (error) {
    logger.error('Failed to track expiring medications', error);
    throw new InternalServerErrorException('Failed to track expiring medications');
  }
}

/**
 * Calculate usage analytics
 *
 * @param sequelize - Sequelize instance
 * @param itemId - Item ID
 * @param daysBack - Days to analyze
 * @param transaction - Optional transaction
 * @returns Usage analytics
 *
 * @example
 * ```typescript
 * const analytics = await calculateUsageAnalytics(sequelize, 'ITEM123', 30);
 * ```
 */
export async function calculateUsageAnalytics(
  sequelize: Sequelize,
  itemId: string,
  daysBack: number = 30,
  transaction?: Transaction
): Promise<UsageAnalyticsMetrics> {
  const logger = new Logger('InventoryQueries::calculateUsageAnalytics');

  try {
    const query = `
      WITH usage_data AS (
        SELECT
          transaction_date,
          SUM(quantity) AS daily_usage
        FROM inventory_transactions
        WHERE item_id = :itemId
          AND transaction_type = 'usage'
          AND transaction_date >= NOW() - INTERVAL '${daysBack} days'
        GROUP BY transaction_date
      ),
      wastage_data AS (
        SELECT
          SUM(quantity) AS total_wastage
        FROM inventory_transactions
        WHERE item_id = :itemId
          AND transaction_type = 'wastage'
          AND transaction_date >= NOW() - INTERVAL '${daysBack} days'
      )
      SELECT
        :itemId AS item_id,
        SUM(ud.daily_usage) AS total_usage,
        AVG(ud.daily_usage) AS avg_daily_usage,
        (SELECT transaction_date FROM usage_data ORDER BY daily_usage DESC LIMIT 1) AS peak_usage_day,
        (SELECT total_wastage FROM wastage_data) AS total_wastage,
        (SELECT current_stock FROM inventory WHERE id = :itemId) AS current_stock
      FROM usage_data ud
    `;

    const [result] = await sequelize.query(query, {
      replacements: { itemId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    // Calculate projected depletion
    const avgDailyUsage = parseFloat(data.avg_daily_usage || 0);
    const currentStock = parseInt(data.current_stock || 0);
    const daysToDepletion = avgDailyUsage > 0 ? currentStock / avgDailyUsage : 999;
    const projectedDepletion = new Date();
    projectedDepletion.setDate(projectedDepletion.getDate() + daysToDepletion);

    // Calculate wastage rate
    const totalUsage = parseInt(data.total_usage || 0);
    const totalWastage = parseInt(data.total_wastage || 0);
    const wastageRate = totalUsage > 0 ? (totalWastage / (totalUsage + totalWastage)) * 100 : 0;

    logger.log(`Usage analytics: avg ${avgDailyUsage.toFixed(1)} units/day`);

    return {
      itemId,
      totalUsage,
      avgDailyUsage,
      peakUsageDay: data.peak_usage_day,
      projectedDepletion,
      wastageRate,
    };
  } catch (error) {
    logger.error('Failed to calculate usage analytics', error);
    throw new InternalServerErrorException('Failed to calculate usage analytics');
  }
}

/**
 * Generate automated reorder list
 *
 * @param sequelize - Sequelize instance
 * @param urgentOnly - Only include urgent items
 * @param transaction - Optional transaction
 * @returns Reorder list
 *
 * @example
 * ```typescript
 * const reorderList = await generateAutomatedReorderList(sequelize, true);
 * ```
 */
export async function generateAutomatedReorderList(
  sequelize: Sequelize,
  urgentOnly: boolean = false,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::generateAutomatedReorderList');

  try {
    let urgentFilter = '';
    if (urgentOnly) {
      urgentFilter = `AND i.current_stock < (i.reorder_level * 0.5)`;
    }

    const query = `
      SELECT
        i.id,
        i.item_name,
        i.category,
        i.current_stock,
        i.reorder_level,
        i.reorder_quantity,
        i.unit_cost,
        (i.reorder_level - i.current_stock) AS shortage,
        (i.reorder_quantity * i.unit_cost) AS estimated_cost,
        i.preferred_supplier,
        CASE
          WHEN i.current_stock <= 0 THEN 'out_of_stock'
          WHEN i.current_stock < (i.reorder_level * 0.5) THEN 'critical'
          WHEN i.current_stock < i.reorder_level THEN 'low'
          ELSE 'normal'
        END AS urgency_level
      FROM inventory i
      WHERE i.current_stock <= i.reorder_level
        ${urgentFilter}
      ORDER BY
        CASE
          WHEN i.current_stock <= 0 THEN 1
          WHEN i.current_stock < (i.reorder_level * 0.5) THEN 2
          ELSE 3
        END,
        (i.reorder_level - i.current_stock) DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Generated reorder list with ${results.length} items`);

    return results;
  } catch (error) {
    logger.error('Failed to generate reorder list', error);
    throw new InternalServerErrorException('Failed to generate reorder list');
  }
}

/**
 * Track medication lot numbers
 *
 * @param model - Inventory model
 * @param medicationId - Medication ID
 * @param transaction - Optional transaction
 * @returns Lot numbers and quantities
 *
 * @example
 * ```typescript
 * const lots = await trackMedicationLotNumbers(Inventory, 'MED123');
 * ```
 */
export async function trackMedicationLotNumbers<M extends Model>(
  model: ModelCtor<M>,
  medicationId: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('InventoryQueries::trackMedicationLotNumbers');

  try {
    const lots = await model.findAll({
      where: {
        itemId: medicationId,
        quantity: { [Op.gt]: 0 },
      } as any,
      order: [['expirationDate', 'ASC']],
      transaction,
    });

    logger.log(`Found ${lots.length} lot numbers for medication ${medicationId}`);

    return lots;
  } catch (error) {
    logger.error('Failed to track lot numbers', error);
    throw new InternalServerErrorException('Failed to track lot numbers');
  }
}

/**
 * Calculate inventory turnover rate
 *
 * @param sequelize - Sequelize instance
 * @param itemId - Item ID
 * @param months - Months to analyze
 * @param transaction - Optional transaction
 * @returns Turnover metrics
 *
 * @example
 * ```typescript
 * const turnover = await calculateInventoryTurnover(sequelize, 'ITEM123', 6);
 * ```
 */
export async function calculateInventoryTurnover(
  sequelize: Sequelize,
  itemId: string,
  months: number = 6,
  transaction?: Transaction
): Promise<{
  turnoverRate: number;
  avgInventoryValue: number;
  costOfGoodsSold: number;
  daysInInventory: number;
}> {
  const logger = new Logger('InventoryQueries::calculateInventoryTurnover');

  try {
    const query = `
      WITH inventory_values AS (
        SELECT
          AVG(current_stock * unit_cost) AS avg_inventory_value
        FROM inventory_snapshots
        WHERE item_id = :itemId
          AND snapshot_date >= NOW() - INTERVAL '${months} months'
      ),
      usage_cost AS (
        SELECT
          SUM(it.quantity * i.unit_cost) AS cogs
        FROM inventory_transactions it
        JOIN inventory i ON it.item_id = i.id
        WHERE it.item_id = :itemId
          AND it.transaction_type = 'usage'
          AND it.transaction_date >= NOW() - INTERVAL '${months} months'
      )
      SELECT
        iv.avg_inventory_value,
        uc.cogs AS cost_of_goods_sold,
        CASE
          WHEN iv.avg_inventory_value > 0 THEN uc.cogs / iv.avg_inventory_value
          ELSE 0
        END AS turnover_rate,
        CASE
          WHEN uc.cogs > 0 THEN (iv.avg_inventory_value / uc.cogs) * (${months} * 30)
          ELSE 0
        END AS days_in_inventory
      FROM inventory_values iv, usage_cost uc
    `;

    const [result] = await sequelize.query(query, {
      replacements: { itemId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Turnover rate: ${data.turnover_rate.toFixed(2)}x`);

    return {
      turnoverRate: parseFloat(data.turnover_rate),
      avgInventoryValue: parseFloat(data.avg_inventory_value),
      costOfGoodsSold: parseFloat(data.cost_of_goods_sold),
      daysInInventory: parseFloat(data.days_in_inventory),
    };
  } catch (error) {
    logger.error('Failed to calculate inventory turnover', error);
    throw new InternalServerErrorException('Failed to calculate inventory turnover');
  }
}

/**
 * Batch update stock levels
 *
 * @param model - Inventory model
 * @param updates - Array of {itemId, quantity} updates
 * @param transaction - Transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * const updated = await batchUpdateStockLevels(
 *   Inventory,
 *   [{itemId: 'I1', quantity: 100}, {itemId: 'I2', quantity: 50}],
 *   transaction
 * );
 * ```
 */
export async function batchUpdateStockLevels<M extends Model>(
  model: ModelCtor<M>,
  updates: Array<{ itemId: string; quantity: number }>,
  transaction: Transaction
): Promise<number> {
  const logger = new Logger('InventoryQueries::batchUpdateStockLevels');

  try {
    let totalUpdated = 0;

    for (const update of updates) {
      const [affectedCount] = await model.update(
        { currentStock: update.quantity, updatedAt: new Date() } as any,
        {
          where: { id: update.itemId } as any,
          transaction,
        }
      );

      totalUpdated += affectedCount;
    }

    logger.log(`Batch updated ${totalUpdated} inventory items`);

    return totalUpdated;
  } catch (error) {
    logger.error('Batch update stock levels failed', error);
    throw new InternalServerErrorException('Batch update stock levels failed');
  }
}

/**
 * Find overstocked items
 *
 * @param sequelize - Sequelize instance
 * @param threshold - Overstock threshold multiplier
 * @param transaction - Optional transaction
 * @returns Overstocked items
 *
 * @example
 * ```typescript
 * const overstocked = await findOverstockedItems(sequelize, 2.0);
 * ```
 */
export async function findOverstockedItems(
  sequelize: Sequelize,
  threshold: number = 2.0,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::findOverstockedItems');

  try {
    const query = `
      WITH usage_rates AS (
        SELECT
          item_id,
          AVG(quantity) AS avg_daily_usage
        FROM inventory_transactions
        WHERE transaction_type = 'usage'
          AND transaction_date >= NOW() - INTERVAL '30 days'
        GROUP BY item_id
      )
      SELECT
        i.id,
        i.item_name,
        i.category,
        i.current_stock,
        ur.avg_daily_usage,
        (i.current_stock / NULLIF(ur.avg_daily_usage, 0)) AS days_of_supply,
        (i.current_stock * i.unit_cost) AS inventory_value
      FROM inventory i
      LEFT JOIN usage_rates ur ON i.id = ur.item_id
      WHERE i.current_stock > (i.reorder_level * :threshold)
        OR (ur.avg_daily_usage > 0 AND (i.current_stock / ur.avg_daily_usage) > 90)
      ORDER BY inventory_value DESC
    `;

    const results = await sequelize.query(query, {
      replacements: { threshold },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} overstocked items`);

    return results;
  } catch (error) {
    logger.error('Failed to find overstocked items', error);
    throw new InternalServerErrorException('Failed to find overstocked items');
  }
}

/**
 * Calculate inventory value by category
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Value by category
 *
 * @example
 * ```typescript
 * const valueByCategory = await calculateInventoryValueByCategory(sequelize);
 * ```
 */
export async function calculateInventoryValueByCategory(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::calculateInventoryValueByCategory');

  try {
    const query = `
      SELECT
        category,
        COUNT(*) AS item_count,
        SUM(current_stock) AS total_units,
        SUM(current_stock * unit_cost) AS total_value,
        AVG(unit_cost) AS avg_unit_cost
      FROM inventory
      WHERE current_stock > 0
      GROUP BY category
      ORDER BY total_value DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Calculated inventory value for ${results.length} categories`);

    return results;
  } catch (error) {
    logger.error('Failed to calculate inventory value by category', error);
    throw new InternalServerErrorException('Failed to calculate inventory value by category');
  }
}

/**
 * Track controlled substance inventory
 *
 * @param model - Inventory model
 * @param deaSchedule - DEA schedule to filter
 * @param transaction - Optional transaction
 * @returns Controlled substances
 *
 * @example
 * ```typescript
 * const controlled = await trackControlledSubstanceInventory(Inventory, 'II');
 * ```
 */
export async function trackControlledSubstanceInventory<M extends Model>(
  model: ModelCtor<M>,
  deaSchedule?: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('InventoryQueries::trackControlledSubstanceInventory');

  try {
    const where: WhereOptions<any> = {
      isControlledSubstance: true,
    };

    if (deaSchedule) {
      where.deaSchedule = deaSchedule;
    }

    const items = await model.findAll({
      where,
      order: [['deaSchedule', 'ASC'], ['itemName', 'ASC']],
      transaction,
    });

    logger.log(`Tracked ${items.length} controlled substances`);

    return items;
  } catch (error) {
    logger.error('Failed to track controlled substance inventory', error);
    throw new InternalServerErrorException('Failed to track controlled substance inventory');
  }
}

/**
 * Generate inventory audit report
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Audit report
 *
 * @example
 * ```typescript
 * const audit = await generateInventoryAuditReport(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function generateInventoryAuditReport(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalItems: number;
  totalValue: number;
  discrepancies: any[];
  movements: any[];
}> {
  const logger = new Logger('InventoryQueries::generateInventoryAuditReport');

  try {
    // Total items and value
    const [totals] = await sequelize.query(
      `SELECT COUNT(*) AS total_items, SUM(current_stock * unit_cost) AS total_value FROM inventory`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    // Discrepancies
    const discrepancies = await sequelize.query(
      `
      SELECT
        i.id,
        i.item_name,
        i.current_stock AS system_stock,
        ia.counted_quantity AS physical_count,
        (ia.counted_quantity - i.current_stock) AS variance
      FROM inventory i
      JOIN inventory_audits ia ON i.id = ia.item_id
      WHERE ia.audit_date BETWEEN :startDate AND :endDate
        AND ia.counted_quantity != i.current_stock
      ORDER BY ABS(ia.counted_quantity - i.current_stock) DESC
    `,
      {
        replacements: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    // Recent movements
    const movements = await sequelize.query(
      `
      SELECT
        it.transaction_date,
        i.item_name,
        it.transaction_type,
        it.quantity,
        it.performed_by
      FROM inventory_transactions it
      JOIN inventory i ON it.item_id = i.id
      WHERE it.transaction_date BETWEEN :startDate AND :endDate
      ORDER BY it.transaction_date DESC
      LIMIT 100
    `,
      {
        replacements: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const data = totals as any;

    logger.log(`Audit report: ${data.total_items} items, $${data.total_value.toFixed(2)} value`);

    return {
      totalItems: parseInt(data.total_items),
      totalValue: parseFloat(data.total_value),
      discrepancies,
      movements,
    };
  } catch (error) {
    logger.error('Failed to generate audit report', error);
    throw new InternalServerErrorException('Failed to generate audit report');
  }
}

/**
 * Find items with no recent usage
 *
 * @param sequelize - Sequelize instance
 * @param daysInactive - Days without usage
 * @param transaction - Optional transaction
 * @returns Inactive items
 *
 * @example
 * ```typescript
 * const inactive = await findItemsWithNoRecentUsage(sequelize, 180);
 * ```
 */
export async function findItemsWithNoRecentUsage(
  sequelize: Sequelize,
  daysInactive: number = 90,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::findItemsWithNoRecentUsage');

  try {
    const query = `
      SELECT
        i.id,
        i.item_name,
        i.category,
        i.current_stock,
        (i.current_stock * i.unit_cost) AS inventory_value,
        MAX(it.transaction_date) AS last_usage_date,
        EXTRACT(DAY FROM NOW() - MAX(it.transaction_date)) AS days_since_last_use
      FROM inventory i
      LEFT JOIN inventory_transactions it ON i.id = it.item_id AND it.transaction_type = 'usage'
      WHERE i.current_stock > 0
      GROUP BY i.id, i.item_name, i.category, i.current_stock, i.unit_cost
      HAVING MAX(it.transaction_date) IS NULL
        OR MAX(it.transaction_date) < NOW() - INTERVAL '${daysInactive} days'
      ORDER BY inventory_value DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} items with no recent usage`);

    return results;
  } catch (error) {
    logger.error('Failed to find items with no recent usage', error);
    throw new InternalServerErrorException('Failed to find items with no recent usage');
  }
}

/**
 * Calculate supply chain lead times
 *
 * @param sequelize - Sequelize instance
 * @param supplierId - Supplier ID (optional)
 * @param transaction - Optional transaction
 * @returns Lead time metrics
 *
 * @example
 * ```typescript
 * const leadTimes = await calculateSupplyChainLeadTimes(sequelize, 'SUP123');
 * ```
 */
export async function calculateSupplyChainLeadTimes(
  sequelize: Sequelize,
  supplierId?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::calculateSupplyChainLeadTimes');

  try {
    let supplierFilter = '';
    if (supplierId) {
      supplierFilter = `AND po.supplier_id = :supplierId`;
    }

    const query = `
      SELECT
        s.id AS supplier_id,
        s.name AS supplier_name,
        COUNT(po.id) AS order_count,
        AVG(EXTRACT(DAY FROM po.received_date - po.order_date)) AS avg_lead_time_days,
        MIN(EXTRACT(DAY FROM po.received_date - po.order_date)) AS min_lead_time_days,
        MAX(EXTRACT(DAY FROM po.received_date - po.order_date)) AS max_lead_time_days,
        STDDEV(EXTRACT(DAY FROM po.received_date - po.order_date)) AS lead_time_stddev
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.received_date IS NOT NULL
        AND po.order_date IS NOT NULL
        ${supplierFilter}
      GROUP BY s.id, s.name
      ORDER BY avg_lead_time_days
    `;

    const results = await sequelize.query(query, {
      replacements: { supplierId },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Calculated lead times for ${results.length} suppliers`);

    return results;
  } catch (error) {
    logger.error('Failed to calculate lead times', error);
    throw new InternalServerErrorException('Failed to calculate lead times');
  }
}

/**
 * Track medication recalls
 *
 * @param sequelize - Sequelize instance
 * @param active - Only active recalls
 * @param transaction - Optional transaction
 * @returns Recall information
 *
 * @example
 * ```typescript
 * const recalls = await trackMedicationRecalls(sequelize, true);
 * ```
 */
export async function trackMedicationRecalls(
  sequelize: Sequelize,
  active: boolean = true,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::trackMedicationRecalls');

  try {
    let activeFilter = '';
    if (active) {
      activeFilter = `AND r.status = 'active'`;
    }

    const query = `
      SELECT
        r.*,
        i.id AS inventory_item_id,
        i.item_name,
        i.lot_number,
        i.current_stock AS affected_quantity
      FROM recalls r
      JOIN inventory i ON (r.ndc_code = i.ndc_code OR r.lot_number = i.lot_number)
      WHERE i.current_stock > 0
        ${activeFilter}
      ORDER BY r.recall_date DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} items affected by recalls`);

    return results;
  } catch (error) {
    logger.error('Failed to track medication recalls', error);
    throw new InternalServerErrorException('Failed to track medication recalls');
  }
}

/**
 * Generate ordering recommendations
 *
 * @param sequelize - Sequelize instance
 * @param daysToProject - Days to project usage
 * @param transaction - Optional transaction
 * @returns Ordering recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateOrderingRecommendations(sequelize, 60);
 * ```
 */
export async function generateOrderingRecommendations(
  sequelize: Sequelize,
  daysToProject: number = 60,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::generateOrderingRecommendations');

  try {
    const query = `
      WITH usage_rates AS (
        SELECT
          item_id,
          AVG(quantity) AS avg_daily_usage,
          STDDEV(quantity) AS usage_stddev
        FROM inventory_transactions
        WHERE transaction_type = 'usage'
          AND transaction_date >= NOW() - INTERVAL '30 days'
        GROUP BY item_id
      ),
      lead_times AS (
        SELECT
          item_id,
          AVG(EXTRACT(DAY FROM received_date - order_date)) AS avg_lead_time
        FROM purchase_order_items poi
        JOIN purchase_orders po ON poi.purchase_order_id = po.id
        WHERE po.received_date IS NOT NULL
        GROUP BY item_id
      )
      SELECT
        i.id,
        i.item_name,
        i.current_stock,
        ur.avg_daily_usage,
        lt.avg_lead_time,
        (ur.avg_daily_usage * ${daysToProject}) AS projected_usage,
        (i.current_stock - (ur.avg_daily_usage * ${daysToProject})) AS projected_stock,
        CASE
          WHEN (i.current_stock - (ur.avg_daily_usage * (${daysToProject} + COALESCE(lt.avg_lead_time, 7)))) <= 0
          THEN CEIL((ur.avg_daily_usage * (${daysToProject} + COALESCE(lt.avg_lead_time, 7))) - i.current_stock)
          ELSE 0
        END AS recommended_order_quantity,
        CASE
          WHEN (i.current_stock / NULLIF(ur.avg_daily_usage, 0)) <= COALESCE(lt.avg_lead_time, 7)
          THEN 'urgent'
          WHEN (i.current_stock / NULLIF(ur.avg_daily_usage, 0)) <= (COALESCE(lt.avg_lead_time, 7) * 2)
          THEN 'soon'
          ELSE 'future'
        END AS urgency
      FROM inventory i
      LEFT JOIN usage_rates ur ON i.id = ur.item_id
      LEFT JOIN lead_times lt ON i.id = lt.item_id
      WHERE ur.avg_daily_usage > 0
      HAVING recommended_order_quantity > 0
      ORDER BY urgency, (i.current_stock / NULLIF(ur.avg_daily_usage, 0))
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Generated ${results.length} ordering recommendations`);

    return results;
  } catch (error) {
    logger.error('Failed to generate ordering recommendations', error);
    throw new InternalServerErrorException('Failed to generate ordering recommendations');
  }
}

/**
 * Calculate ABC analysis for inventory classification
 *
 * @param sequelize - Sequelize instance
 * @param months - Months to analyze
 * @param transaction - Optional transaction
 * @returns ABC classification
 *
 * @example
 * ```typescript
 * const abc = await calculateABCAnalysis(sequelize, 12);
 * ```
 */
export async function calculateABCAnalysis(
  sequelize: Sequelize,
  months: number = 12,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::calculateABCAnalysis');

  try {
    const query = `
      WITH item_values AS (
        SELECT
          i.id,
          i.item_name,
          SUM(it.quantity * i.unit_cost) AS total_value,
          SUM(it.quantity) AS total_usage
        FROM inventory i
        JOIN inventory_transactions it ON i.id = it.item_id
        WHERE it.transaction_type = 'usage'
          AND it.transaction_date >= NOW() - INTERVAL '${months} months'
        GROUP BY i.id, i.item_name
      ),
      ranked_items AS (
        SELECT
          *,
          SUM(total_value) OVER () AS grand_total,
          SUM(total_value) OVER (ORDER BY total_value DESC) AS cumulative_value,
          (SUM(total_value) OVER (ORDER BY total_value DESC) / SUM(total_value) OVER ()) * 100 AS cumulative_percentage
        FROM item_values
      )
      SELECT
        id,
        item_name,
        total_value,
        total_usage,
        cumulative_percentage,
        CASE
          WHEN cumulative_percentage <= 80 THEN 'A'
          WHEN cumulative_percentage <= 95 THEN 'B'
          ELSE 'C'
        END AS abc_category
      FROM ranked_items
      ORDER BY total_value DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`ABC analysis: ${results.length} items classified`);

    return results;
  } catch (error) {
    logger.error('Failed to calculate ABC analysis', error);
    throw new InternalServerErrorException('Failed to calculate ABC analysis');
  }
}

/**
 * Track inventory by storage location
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Location-based inventory
 *
 * @example
 * ```typescript
 * const byLocation = await trackInventoryByLocation(sequelize);
 * ```
 */
export async function trackInventoryByLocation(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::trackInventoryByLocation');

  try {
    const query = `
      SELECT
        storage_location,
        COUNT(*) AS item_count,
        SUM(current_stock) AS total_units,
        SUM(current_stock * unit_cost) AS total_value,
        COUNT(CASE WHEN current_stock <= reorder_level THEN 1 END) AS low_stock_items
      FROM inventory
      WHERE current_stock > 0
      GROUP BY storage_location
      ORDER BY total_value DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Tracked inventory across ${results.length} locations`);

    return results;
  } catch (error) {
    logger.error('Failed to track inventory by location', error);
    throw new InternalServerErrorException('Failed to track inventory by location');
  }
}

/**
 * Calculate inventory shrinkage
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Shrinkage analysis
 *
 * @example
 * ```typescript
 * const shrinkage = await calculateInventoryShrinkage(
 *   sequelize,
 *   { start: lastQuarter, end: today }
 * );
 * ```
 */
export async function calculateInventoryShrinkage(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalShrinkage: number;
  shrinkageValue: number;
  shrinkageRate: number;
  byReason: Record<string, number>;
}> {
  const logger = new Logger('InventoryQueries::calculateInventoryShrinkage');

  try {
    const query = `
      SELECT
        SUM(quantity) AS total_shrinkage,
        SUM(quantity * i.unit_cost) AS shrinkage_value
      FROM inventory_transactions it
      JOIN inventory i ON it.item_id = i.id
      WHERE it.transaction_type IN ('wastage', 'loss', 'theft', 'damage')
        AND it.transaction_date BETWEEN :startDate AND :endDate
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    // By reason
    const reasonQuery = `
      SELECT
        transaction_type AS reason,
        SUM(quantity) AS quantity
      FROM inventory_transactions
      WHERE transaction_type IN ('wastage', 'loss', 'theft', 'damage')
        AND transaction_date BETWEEN :startDate AND :endDate
      GROUP BY reason
    `;

    const byReasonResults = await sequelize.query(reasonQuery, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    // Calculate shrinkage rate
    const [totalValue] = await sequelize.query(
      `SELECT SUM(current_stock * unit_cost) AS total FROM inventory`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const totalInventoryValue = parseFloat((totalValue as any).total || 0);
    const shrinkageRate = totalInventoryValue > 0
      ? (parseFloat(data.shrinkage_value) / totalInventoryValue) * 100
      : 0;

    const byReason = byReasonResults.reduce((acc: any, row: any) => {
      acc[row.reason] = parseInt(row.quantity);
      return acc;
    }, {});

    logger.log(`Shrinkage: ${data.total_shrinkage} units, $${data.shrinkage_value.toFixed(2)} value`);

    return {
      totalShrinkage: parseInt(data.total_shrinkage || 0),
      shrinkageValue: parseFloat(data.shrinkage_value || 0),
      shrinkageRate,
      byReason,
    };
  } catch (error) {
    logger.error('Failed to calculate inventory shrinkage', error);
    throw new InternalServerErrorException('Failed to calculate inventory shrinkage');
  }
}

/**
 * Get inventory transaction history
 *
 * @param sequelize - Sequelize instance
 * @param itemId - Item ID
 * @param limit - Maximum transactions
 * @param transaction - Optional transaction
 * @returns Transaction history
 *
 * @example
 * ```typescript
 * const history = await getInventoryTransactionHistory(sequelize, 'ITEM123', 100);
 * ```
 */
export async function getInventoryTransactionHistory(
  sequelize: Sequelize,
  itemId: string,
  limit: number = 100,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('InventoryQueries::getInventoryTransactionHistory');

  try {
    const query = `
      SELECT
        it.*,
        i.item_name,
        u.first_name || ' ' || u.last_name AS performed_by_name
      FROM inventory_transactions it
      JOIN inventory i ON it.item_id = i.id
      LEFT JOIN users u ON it.performed_by = u.id
      WHERE it.item_id = :itemId
      ORDER BY it.transaction_date DESC
      LIMIT :limit
    `;

    const results = await sequelize.query(query, {
      replacements: { itemId, limit },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved ${results.length} transaction history records`);

    return results;
  } catch (error) {
    logger.error('Failed to get transaction history', error);
    throw new InternalServerErrorException('Failed to get transaction history');
  }
}

/**
 * Validate inventory consistency
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateInventoryConsistency(sequelize);
 * ```
 */
export async function validateInventoryConsistency(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const logger = new Logger('InventoryQueries::validateInventoryConsistency');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check for negative stock
    const [negativeStock] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM inventory WHERE current_stock < 0`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if ((negativeStock as any).count > 0) {
      errors.push(`${(negativeStock as any).count} items with negative stock`);
    }

    // Check for missing expiration dates on medications
    const [missingExpiration] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM inventory WHERE item_type = 'medication' AND expiration_date IS NULL AND current_stock > 0`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if ((missingExpiration as any).count > 0) {
      warnings.push(`${(missingExpiration as any).count} medications missing expiration dates`);
    }

    // Check for orphaned transactions
    const [orphanedTransactions] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM inventory_transactions WHERE item_id NOT IN (SELECT id FROM inventory)`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if ((orphanedTransactions as any).count > 0) {
      errors.push(`${(orphanedTransactions as any).count} orphaned transactions`);
    }

    const isValid = errors.length === 0;

    logger.log(`Inventory validation: ${isValid ? 'valid' : 'issues found'}`);

    return { isValid, errors, warnings };
  } catch (error) {
    logger.error('Failed to validate inventory consistency', error);
    throw new InternalServerErrorException('Failed to validate inventory consistency');
  }
}

/**
 * Export all inventory management query functions
 */
export const InventoryManagementQueriesComposites = {
  trackMedicationInventory,
  findItemsBelowReorderLevel,
  trackExpiringMedications,
  calculateUsageAnalytics,
  generateAutomatedReorderList,
  trackMedicationLotNumbers,
  calculateInventoryTurnover,
  batchUpdateStockLevels,
  findOverstockedItems,
  calculateInventoryValueByCategory,
  trackControlledSubstanceInventory,
  generateInventoryAuditReport,
  findItemsWithNoRecentUsage,
  calculateSupplyChainLeadTimes,
  trackMedicationRecalls,
  generateOrderingRecommendations,
  calculateABCAnalysis,
  trackInventoryByLocation,
  calculateInventoryShrinkage,
  getInventoryTransactionHistory,
  validateInventoryConsistency,
};
