# Inventory API Quick Reference

## Backend API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Inventory Items

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/inventory` | List all items with filtering | Query params: `page`, `limit`, `category`, `supplier`, `location`, `lowStock`, `isActive` | `{ items: [], pagination: {} }` |
| GET | `/api/inventory/:id` | Get single item | - | `{ item: {} }` |
| POST | `/api/inventory` | Create new item | `{ name, category, reorderLevel, reorderQuantity, unitCost?, ... }` | `{ item: {} }` |
| PUT | `/api/inventory/:id` | Update item | `{ name?, category?, reorderLevel?, ... }` | `{ item: {} }` |
| DELETE | `/api/inventory/:id` | Soft delete item | - | `{ item: {} }` |
| GET | `/api/inventory/search/:query` | Search items | Query param: `limit` | `{ items: [] }` |

### Stock Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/inventory/:id/stock` | Get current stock | - | `{ currentStock: number }` |
| POST | `/api/inventory/:id/adjust` | Adjust stock | `{ quantity: number, reason: string }` | `{ transaction, previousStock, newStock, adjustment }` |
| GET | `/api/inventory/:id/history` | Get stock history | Query params: `page`, `limit` | `{ history: [], pagination: {} }` |
| POST | `/api/inventory/transactions` | Create transaction | `{ inventoryItemId, type, quantity, unitCost?, expirationDate?, ... }` | `{ transaction: {} }` |

### Alerts & Statistics

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/inventory/alerts` | Get all alerts | `{ alerts: [{ id, type, severity, message, itemId, itemName, daysUntilAction? }] }` |
| GET | `/api/inventory/stats` | Get statistics | `{ overview: {}, categoryBreakdown: [], recentActivity: [], topUsedItems: [] }` |

### Maintenance

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/inventory/maintenance` | Log maintenance | `{ inventoryItemId, type, description, cost?, nextMaintenanceDate?, ... }` | `{ maintenanceLog: {} }` |
| GET | `/api/inventory/maintenance/schedule` | View schedule | Query params: `startDate`, `endDate` | `{ schedule: [] }` |

### Analytics

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/inventory/valuation` | Get inventory value | `{ valuation: [{ category, itemCount, totalValue, totalQuantity }] }` |
| GET | `/api/inventory/analytics/usage` | Usage analytics | `{ analytics: [{ name, category, transactionCount, totalUsage, averageUsage }] }` |
| GET | `/api/inventory/analytics/suppliers` | Supplier performance | `{ performance: [{ supplier, itemCount, averageUnitCost, totalPurchased, totalSpent }] }` |

### Purchase Orders

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/inventory/purchase-order` | Generate PO | `{ items: [{ inventoryItemId, quantity }] }` | `{ purchaseOrder: { orderNumber, orderDate, items, totalCost, status } }` |

## Frontend API Client

### Import

```typescript
import { inventoryApi } from '@/services/api';
```

### Methods

```typescript
// List items
const response = await inventoryApi.getAll({
  page: 1,
  limit: 20,
  category: 'Medical Supplies',
  lowStock: true
});

// Get single item
const item = await inventoryApi.getById('item-id-123');

// Create item
const newItem = await inventoryApi.create({
  name: 'Digital Thermometer',
  category: 'Medical Equipment',
  reorderLevel: 5,
  reorderQuantity: 20,
  unitCost: 25.99
});

// Update item
const updated = await inventoryApi.update('item-id-123', {
  reorderLevel: 10
});

// Delete item (soft delete)
await inventoryApi.delete('item-id-123');

// Get alerts
const alerts = await inventoryApi.getAlerts();

// Get statistics
const stats = await inventoryApi.getStats();

// Get current stock
const stock = await inventoryApi.getCurrentStock('item-id-123');

// Adjust stock
const adjustment = await inventoryApi.adjustStock(
  'item-id-123',
  5,  // quantity
  'Physical count adjustment'
);

// Get stock history
const history = await inventoryApi.getStockHistory('item-id-123', 1, 50);

// Create transaction
await inventoryApi.createTransaction({
  inventoryItemId: 'item-id-123',
  type: 'PURCHASE',
  quantity: 100,
  unitCost: 15.99,
  batchNumber: 'BATCH-2025-001',
  expirationDate: '2026-12-31'
});

// Search
const results = await inventoryApi.search('bandage', 10);
```

## React Hooks

### Import

```typescript
import {
  useInventory,
  useInventoryItem,
  useInventoryAlerts,
  useInventoryStats,
  useStockHistory,
  useStockAdjustment
} from '@/hooks/useInventory';
```

### Usage Examples

```typescript
// List inventory items
function InventoryList() {
  const { items, loading, pagination, createItem, updateItem, deleteItem } = useInventory({
    category: 'Medical Supplies',
    lowStock: true
  });

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Single item details
function ItemDetails({ itemId }) {
  const { item, loading, refresh } = useInventoryItem(itemId);

  return <ItemDetailsView item={item} onUpdate={refresh} />;
}

// Alerts dashboard
function AlertsDashboard() {
  const { alerts, loading, refresh } = useInventoryAlerts();

  return (
    <div>
      {alerts.map(alert => (
        <Alert key={alert.id} severity={alert.severity}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}

// Statistics widget
function StatsWidget() {
  const { stats, loading } = useInventoryStats();

  return (
    <div>
      <Stat label="Total Items" value={stats?.overview?.totalItems} />
      <Stat label="Total Value" value={`$${stats?.overview?.totalValue}`} />
      <Stat label="Low Stock" value={stats?.overview?.lowStockItems} />
    </div>
  );
}

// Stock history modal
function StockHistoryModal({ itemId }) {
  const { history, pagination, loading } = useStockHistory(itemId, 1, 50);

  return (
    <Table>
      {history.map(txn => (
        <Row key={txn.id}>
          <Cell>{txn.type}</Cell>
          <Cell>{txn.quantity}</Cell>
          <Cell>{txn.stockAfterTransaction}</Cell>
          <Cell>{new Date(txn.createdAt).toLocaleDateString()}</Cell>
        </Row>
      ))}
    </Table>
  );
}

// Stock adjustment form
function AdjustStockForm({ itemId, onSuccess }) {
  const { adjustStock, loading } = useStockAdjustment();

  const handleSubmit = async (quantity: number, reason: string) => {
    await adjustStock(itemId, quantity, reason);
    onSuccess();
  };

  return <Form onSubmit={handleSubmit} loading={loading} />;
}
```

## Data Types

### InventoryItem

```typescript
{
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: Decimal;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  currentStock?: number; // Calculated field
}
```

### InventoryTransaction

```typescript
{
  id: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
  quantity: number;
  unitCost?: Decimal;
  reason?: string;
  batchNumber?: string;
  expirationDate?: DateTime;
  notes?: string;
  inventoryItemId: string;
  performedById: string;
  createdAt: DateTime;
  stockAfterTransaction?: number; // Calculated field
}
```

### InventoryAlert

```typescript
{
  id: string;
  type: 'LOW_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'MAINTENANCE_DUE' | 'OUT_OF_STOCK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  itemId: string;
  itemName: string;
  daysUntilAction?: number;
}
```

### InventoryStats

```typescript
{
  overview: {
    totalItems: number;
    activeItems: number;
    inactiveItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    criticalAlerts: number;
    highAlerts: number;
    mediumAlerts: number;
  };
  categoryBreakdown: Array<{
    category: string;
    itemCount: number;
    totalQuantity: number;
    totalValue: number;
  }>;
  recentActivity: InventoryTransaction[];
  topUsedItems: Array<{
    id: string;
    name: string;
    category: string;
    usageCount: number;
    totalUsed: number;
  }>;
}
```

## Common Patterns

### Create Item with Initial Stock

```typescript
// 1. Create the item
const newItem = await inventoryApi.create({
  name: 'Bandages',
  category: 'Medical Supplies',
  reorderLevel: 50,
  reorderQuantity: 200,
  unitCost: 0.50
});

// 2. Add initial stock
await inventoryApi.createTransaction({
  inventoryItemId: newItem.data.item.id,
  type: 'PURCHASE',
  quantity: 500,
  unitCost: 0.50,
  batchNumber: 'INIT-2025-001'
});
```

### Handle Low Stock Alert

```typescript
const { alerts } = useInventoryAlerts();

const lowStockAlerts = alerts.filter(a =>
  a.type === 'LOW_STOCK' || a.type === 'OUT_OF_STOCK'
);

for (const alert of lowStockAlerts) {
  // Get item details
  const item = await inventoryApi.getById(alert.itemId);

  // Generate purchase order for reorder quantity
  await inventoryApi.generatePurchaseOrder([{
    inventoryItemId: alert.itemId,
    quantity: item.data.item.reorderQuantity
  }]);
}
```

### Track Usage

```typescript
// Record medication administration
await inventoryApi.createTransaction({
  inventoryItemId: 'aspirin-id',
  type: 'USAGE',
  quantity: 2, // Will be stored as -2
  reason: 'Administered to Student John Doe',
  notes: 'Dosage: 2 tablets, 325mg each'
});
```

### Inventory Audit

```typescript
// Get current system stock
const stockResponse = await inventoryApi.getCurrentStock('item-id');
const systemStock = stockResponse.data.currentStock;

// Compare with physical count
const physicalCount = 95;
const discrepancy = physicalCount - systemStock;

if (discrepancy !== 0) {
  // Adjust stock to match physical count
  await inventoryApi.adjustStock(
    'item-id',
    discrepancy,
    `Annual inventory audit - Physical count: ${physicalCount}, System: ${systemStock}`
  );
}
```

## Error Handling

All API calls return a consistent response format:

```typescript
{
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
  }
}
```

**Example:**

```typescript
try {
  const response = await inventoryApi.create(itemData);

  if (response.success) {
    toast.success('Item created successfully');
  } else {
    toast.error(response.error?.message || 'Failed to create item');
  }
} catch (error) {
  console.error('Unexpected error:', error);
  toast.error('An unexpected error occurred');
}
```

## Performance Tips

1. **Use Pagination**: Always specify `page` and `limit` for large datasets
2. **Filter Early**: Use API filters instead of client-side filtering
3. **Cache Results**: Use React Query or SWR for automatic caching
4. **Batch Operations**: Combine related API calls with Promise.all()
5. **Debounce Search**: Debounce search inputs to reduce API calls

---

**Last Updated**: 2025-10-10
