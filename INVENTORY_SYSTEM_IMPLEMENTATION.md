# Inventory System Implementation Guide

## Overview

This document describes the complete implementation of the White Cross Inventory Management System, replacing all mock data with real database integration and full API functionality.

## Architecture

### Database Layer (Prisma)

The inventory system uses the following Prisma models:

1. **InventoryItem** - Core inventory items with tracking fields
2. **InventoryTransaction** - Audit trail for all stock movements (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL)
3. **MaintenanceLog** - Equipment maintenance tracking
4. **Vendor** - Supplier information
5. **PurchaseOrder** - Purchase order management
6. **BudgetCategory** - Budget allocation and tracking

### Backend Services

#### InventoryService (`backend/src/services/inventoryService.ts`)

Complete service implementation with the following methods:

**Core CRUD Operations:**
- `getInventoryItems(page, limit, filters)` - Paginated item listing with advanced filtering
- `getInventoryItem(id)` - Get single item with transactions and maintenance history
- `createInventoryItem(data)` - Create new inventory item
- `updateInventoryItem(id, data)` - Update existing item
- `deleteInventoryItem(id)` - Soft delete (sets isActive=false)

**Stock Management:**
- `getCurrentStock(inventoryItemId)` - Calculate current stock from transactions
- `adjustStock(id, quantity, reason, performedBy)` - Stock adjustment with audit trail
- `getStockHistory(inventoryItemId, page, limit)` - Full transaction history with running totals

**Alerts & Analytics:**
- `getInventoryAlerts()` - Real-time alerts for:
  - Out of stock items (CRITICAL)
  - Low stock items (HIGH)
  - Expired items (CRITICAL)
  - Items expiring within 30 days (MEDIUM/HIGH)
  - Maintenance due/overdue (MEDIUM/HIGH)

- `getInventoryStats()` - Comprehensive statistics:
  - Overview metrics (total items, value, alerts)
  - Category breakdown with quantities and values
  - Recent activity (last 10 transactions)
  - Top 10 most used items (30-day period)

**Maintenance & Purchasing:**
- `createMaintenanceLog(data)` - Log maintenance activities
- `getMaintenanceSchedule(startDate, endDate)` - View upcoming maintenance
- `generatePurchaseOrder(items)` - Create purchase orders

**Analytics:**
- `getInventoryValuation()` - Calculate total inventory value by category
- `getUsageAnalytics(startDate, endDate)` - Usage patterns and trends
- `getSupplierPerformance()` - Supplier metrics and spending
- `searchInventoryItems(query, limit)` - Full-text search across multiple fields

### Backend Routes (`backend/src/routes/inventory.ts`)

Complete REST API with Joi validation:

**Inventory Items:**
- `GET /api/inventory` - List items with pagination/filtering
- `GET /api/inventory/:id` - Get single item details
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Soft delete item
- `GET /api/inventory/search/:query` - Search items

**Stock Management:**
- `GET /api/inventory/:id/stock` - Get current stock level
- `POST /api/inventory/:id/adjust` - Adjust stock with reason
- `GET /api/inventory/:id/history` - Get stock transaction history
- `POST /api/inventory/transactions` - Create transaction (PURCHASE/USAGE/etc.)

**Alerts & Statistics:**
- `GET /api/inventory/alerts` - Get all active alerts
- `GET /api/inventory/stats` - Get comprehensive statistics

**Maintenance:**
- `POST /api/inventory/maintenance` - Log maintenance activity
- `GET /api/inventory/maintenance/schedule` - View maintenance schedule

**Analytics:**
- `GET /api/inventory/valuation` - Get inventory valuation
- `GET /api/inventory/analytics/usage` - Usage analytics
- `GET /api/inventory/analytics/suppliers` - Supplier performance
- `POST /api/inventory/purchase-order` - Generate purchase order

### Frontend API Layer (`frontend/src/services/api.ts`)

Updated `inventoryApi` object with real API calls:

```typescript
export const inventoryApi = {
  getAll(params?: InventoryFilters): Promise<ApiResponse>
  getById(id: string): Promise<ApiResponse>
  create(item: any): Promise<ApiResponse>
  update(id: string, item: any): Promise<ApiResponse>
  delete(id: string): Promise<ApiResponse>
  getAlerts(): Promise<ApiResponse>
  getStats(): Promise<ApiResponse>
  getCurrentStock(id: string): Promise<ApiResponse>
  adjustStock(id: string, quantity: number, reason: string): Promise<ApiResponse>
  getStockHistory(id: string, page?: number, limit?: number): Promise<ApiResponse>
  createTransaction(transaction: TransactionData): Promise<ApiResponse>
  createMaintenanceLog(maintenance: MaintenanceData): Promise<ApiResponse>
  getMaintenanceSchedule(startDate?: string, endDate?: string): Promise<ApiResponse>
  generatePurchaseOrder(items: PurchaseOrderItem[]): Promise<ApiResponse>
  getValuation(): Promise<ApiResponse>
  getUsageAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse>
  getSupplierPerformance(): Promise<ApiResponse>
  search(query: string, limit?: number): Promise<ApiResponse>
}
```

### Frontend Hooks (`frontend/src/hooks/useInventory.ts`)

Custom React hooks for inventory data management:

**`useInventory(filters?: InventoryFilters)`**
- Manages inventory items list with filtering
- Provides CRUD operations: createItem, updateItem, deleteItem
- Handles loading states and error management
- Auto-refreshes on data changes

**`useInventoryItem(id: string | null)`**
- Fetches single inventory item details
- Includes transactions and maintenance history
- Updates when ID changes

**`useInventoryAlerts()`**
- Fetches real-time inventory alerts
- Auto-categorizes by severity
- Silent error handling (non-critical)

**`useInventoryStats()`**
- Loads comprehensive inventory statistics
- Provides overview, category breakdown, activity, and trends
- Cached for performance

**`useStockHistory(itemId: string | null, page: number, limit: number)`**
- Paginated stock transaction history
- Shows running totals after each transaction
- Includes performer details

**`useStockAdjustment()`**
- Handles stock adjustments
- Provides loading state
- Shows success/error notifications

### Frontend UI (`frontend/src/pages/Inventory.tsx`)

Updated to use real API calls:

```typescript
const loadData = useCallback(async () => {
  switch (activeTab) {
    case 'items': {
      const [itemsData, alertsData] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getAlerts()  // Now calls real backend
      ])
      setInventoryItems(itemsData.data?.items || [])
      setAlerts(alertsData.data?.alerts || [])  // Real alerts data
      break
    }
    // ... other tabs
  }
}, [activeTab])
```

## Key Features

### 1. Real-time Alerts System

The alert system monitors inventory in real-time and categorizes issues by severity:

**Critical Alerts:**
- Items completely out of stock
- Expired items that need disposal
- Overdue maintenance

**High Alerts:**
- Low stock items (at or below reorder level)
- Items expiring within 7 days

**Medium Alerts:**
- Items expiring within 30 days
- Maintenance due within 7 days

### 2. Audit Trail & Stock History

Every stock change is recorded with:
- Transaction type (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL)
- Quantity changed
- User who performed the action
- Timestamp
- Running stock total
- Optional: reason, batch number, expiration date

### 3. Advanced Query Optimization

Uses PostgreSQL-specific features for performance:
- Aggregated subqueries for stock calculations
- LEFT JOINs for optional relationships
- Indexed queries for fast filtering
- Batch operations where possible

### 4. Healthcare Compliance

All operations include:
- User authentication via JWT
- Audit logging for PHI access
- Input validation with Joi schemas
- Error handling with informative messages
- HIPAA-compliant data handling

## Database Queries

### Current Stock Calculation

```sql
SELECT
  SUM(quantity) as currentStock
FROM inventory_transactions
WHERE inventoryItemId = ?
```

### Low Stock Items

```sql
SELECT i.*,
  COALESCE(stock.totalQuantity, 0) as currentStock
FROM inventory_items i
LEFT JOIN (
  SELECT inventoryItemId, SUM(quantity) as totalQuantity
  FROM inventory_transactions
  GROUP BY inventoryItemId
) stock ON i.id = stock.inventoryItemId
WHERE COALESCE(stock.totalQuantity, 0) <= i.reorderLevel
AND i.isActive = true
```

### Inventory Valuation

```sql
SELECT
  i.category,
  COUNT(i.id) as itemCount,
  COALESCE(SUM(stock.totalQuantity * i.unitCost), 0) as totalValue
FROM inventory_items i
LEFT JOIN (
  SELECT inventoryItemId, SUM(quantity) as totalQuantity
  FROM inventory_transactions
  GROUP BY inventoryItemId
) stock ON i.id = stock.inventoryItemId
WHERE i.isActive = true
GROUP BY i.category
ORDER BY totalValue DESC
```

## Usage Examples

### Backend - Adjust Stock

```typescript
import { InventoryService } from '../services/inventoryService';

// Adjust stock with audit trail
const result = await InventoryService.adjustStock(
  'item-id-123',
  10,  // quantity (positive = increase, negative = decrease)
  'Physical count adjustment',
  'user-id-456'
);

console.log(result);
// {
//   transaction: { ... },
//   previousStock: 45,
//   newStock: 55,
//   adjustment: 10
// }
```

### Frontend - Using Hooks

```typescript
import { useInventory, useInventoryAlerts, useStockAdjustment } from '../hooks/useInventory';

function InventoryComponent() {
  const { items, loading, createItem, updateItem } = useInventory({
    category: 'Medical Supplies',
    lowStock: true
  });

  const { alerts } = useInventoryAlerts();
  const { adjustStock, loading: adjusting } = useStockAdjustment();

  const handleAdjust = async () => {
    await adjustStock('item-123', 5, 'Restocking');
  };

  return (
    <div>
      {alerts.length > 0 && (
        <AlertsBanner alerts={alerts} />
      )}
      <InventoryTable items={items} loading={loading} />
    </div>
  );
}
```

### Frontend - Direct API Call

```typescript
import { inventoryApi } from '../services/api';

// Create new item
const newItem = await inventoryApi.create({
  name: 'Digital Thermometer',
  category: 'Medical Equipment',
  reorderLevel: 5,
  reorderQuantity: 20,
  unitCost: 25.99
});

// Get alerts
const alertsResponse = await inventoryApi.getAlerts();
const alerts = alertsResponse.data?.alerts || [];

// Search items
const searchResults = await inventoryApi.search('bandage', 10);
```

## Performance Considerations

1. **Pagination**: All list endpoints support pagination to handle large datasets
2. **Indexes**: Database indexes on frequently queried fields (category, supplier, isActive)
3. **Aggregation**: Stock calculations use subqueries to avoid N+1 problems
4. **Caching**: Frontend can implement React Query for automatic caching
5. **Lazy Loading**: Transaction history loaded on-demand with pagination

## Security Features

1. **Authentication**: All endpoints require JWT authentication
2. **Authorization**: Role-based access control (RBAC) ready
3. **Validation**: Joi schemas validate all inputs
4. **Audit Trail**: Every stock change tracked with user ID
5. **Soft Deletes**: Items marked inactive rather than deleted
6. **SQL Injection**: Prisma ORM prevents SQL injection
7. **XSS Protection**: Input sanitization on frontend and backend

## Testing Recommendations

### Backend Tests

```typescript
describe('InventoryService', () => {
  it('should calculate current stock correctly', async () => {
    // Test stock calculations
  });

  it('should generate low stock alerts', async () => {
    // Test alert generation
  });

  it('should create audit trail on stock adjustment', async () => {
    // Test audit logging
  });
});
```

### Frontend Tests

```typescript
describe('useInventory hook', () => {
  it('should fetch inventory items', async () => {
    // Test data fetching
  });

  it('should handle errors gracefully', async () => {
    // Test error handling
  });
});
```

## Migration Path

If migrating from mock data:

1. **Database**: Ensure Prisma migrations are applied
2. **Seed Data**: Populate with test inventory items
3. **Frontend**: Replace mock API calls with real endpoints
4. **Testing**: Test each endpoint individually
5. **Monitoring**: Watch for performance issues

## Future Enhancements

1. **Barcode Scanning**: Add barcode/QR code support for quick item lookup
2. **Automated Reordering**: Trigger purchase orders when stock hits reorder level
3. **Email Notifications**: Alert nurses when items are low/expired
4. **Batch Operations**: Bulk import/export of inventory data
5. **Mobile App**: Mobile inventory management for on-the-go nurses
6. **Predictive Analytics**: ML-based demand forecasting
7. **Integration**: Connect with pharmacy systems for medication inventory

## Troubleshooting

### Common Issues

**Issue**: "Inventory item not found"
- **Solution**: Verify item ID exists and isActive=true

**Issue**: Stock calculation incorrect
- **Solution**: Check transaction types - USAGE/DISPOSAL should have negative quantities

**Issue**: Alerts not showing
- **Solution**: Verify reorderLevel is set and check transaction data

**Issue**: Performance slow with many items
- **Solution**: Add pagination, check database indexes

## Support

For questions or issues:
1. Check the API documentation in this file
2. Review the Prisma schema for data structure
3. Check backend logs for error details
4. Use TypeScript type hints for API parameters

---

**Implementation Date**: 2025-10-10
**Version**: 1.0
**Status**: Complete - Ready for Production
