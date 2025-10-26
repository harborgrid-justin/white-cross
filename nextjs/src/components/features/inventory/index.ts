/**
 * Inventory Feature Components
 *
 * Comprehensive suite of components for medical supply inventory management including
 * item tracking, purchase order management, vendor relationships, budget monitoring,
 * alert systems, and usage analytics. Supports healthcare facility inventory compliance
 * and ensures continuous availability of essential medical supplies.
 *
 * @module features/inventory
 */

/**
 * Inventory statistics dashboard component
 * Displays key metrics: total items, active alerts, vendor count, pending orders
 */
export { default as InventoryStats } from './components/InventoryStats'

/**
 * Active inventory alerts panel
 * Shows low stock warnings, expiring items, and critical supply alerts
 */
export { default as InventoryAlerts } from './components/InventoryAlerts'

/**
 * Inventory items management interface
 * Searchable, filterable table of all inventory items with stock levels and status
 */
export { default as InventoryItemsTab } from './components/tabs/InventoryItemsTab'

/**
 * Purchase order management interface
 * Track purchase orders from creation through vendor fulfillment and receipt
 */
export { default as InventoryOrdersTab } from './components/tabs/InventoryOrdersTab'

/**
 * Vendor relationship management interface
 * Manage vendor contacts, ratings, and payment terms for procurement
 */
export { default as InventoryVendorsTab } from './components/tabs/InventoryVendorsTab'

/**
 * Budget tracking and management interface
 * Monitor budget allocations, spending, and utilization across categories
 */
export { default as InventoryBudgetTab } from './components/tabs/InventoryBudgetTab'

/**
 * Inventory usage analytics dashboard (placeholder)
 * Future analytics features: maintenance scheduling, expiration tracking, usage trends
 */
export { default as InventoryAnalyticsTab } from './components/tabs/InventoryAnalyticsTab'