# Inventory Module

## Overview
Comprehensive inventory management module for school health supplies, medications, and equipment tracking. Provides real-time stock monitoring, automated reorder recommendations, purchase order management, and multi-level alert system.

## Features

### Core Inventory Management
- Full CRUD operations for inventory items
- Category-based organization (medications, supplies, equipment)
- SKU and supplier tracking
- Location-based inventory management
- Soft delete support
- Search and filtering capabilities

### Stock Management
- Real-time stock level tracking (transaction-based ledger system)
- Stock adjustments with full audit trail
- Stock history with pagination
- Low stock and out-of-stock detection
- Running balance calculations
- User attribution for all stock changes

### Alert System
- **Multi-level severity**: CRITICAL, HIGH, MEDIUM, LOW
- **Alert types**:
  - Low stock alerts (stock <= reorder level)
  - Out of stock alerts (stock = 0)
  - Expiration monitoring (30-day warning period)
  - Maintenance due notifications
- Priority-based sorting
- Alert filtering by type and severity
- Alert summary with recommendations

### Purchase Order Management
- Complete purchase order lifecycle
- Vendor management integration
- Multi-item purchase orders
- Order validation and approval workflow
- Status transitions: PENDING → APPROVED → ORDERED → RECEIVED
- Vendor verification and status checks
- Order history and statistics

### Reorder Automation
- Automated inventory analysis
- Reorder recommendations with priority levels
- Days-until-stockout calculations
- Recommended order quantity calculations
- Configurable lead times

## API Endpoints

### Inventory Operations
```
POST   /inventory                    Create inventory item
GET    /inventory                    Get all inventory items (with filters)
GET    /inventory/:id                Get single item
PATCH  /inventory/:id                Update item
DELETE /inventory/:id                Soft delete item
GET    /inventory/search?q=...       Search items
GET    /inventory/count              Get item count
```

### Stock Management
```
GET    /inventory/:id/stock                Get current stock level
POST   /inventory/:id/stock/adjust         Adjust stock with audit trail
GET    /inventory/:id/stock/history        Get stock history (paginated)
GET    /inventory/stock/low                Get low stock items
GET    /inventory/stock/out                Get out of stock items
```

### Alerts
```
GET    /inventory/alerts/all               Get all alerts (sorted by severity)
GET    /inventory/alerts/critical          Get critical alerts only
GET    /inventory/alerts/summary           Get alert summary with recommendations
GET    /inventory/alerts/type/:type        Get alerts by type
GET    /inventory/alerts/severity/:sev     Get alerts by severity
GET    /inventory/:id/alerts               Get alerts for specific item
```

### Purchase Orders
```
POST   /inventory/purchase-orders          Create purchase order
GET    /inventory/purchase-orders          Get all orders (with filters)
GET    /inventory/purchase-orders/:id      Get single order
PATCH  /inventory/purchase-orders/:id/status  Update order status
```

### Reorder Automation
```
POST   /inventory/reorder/analyze          Analyze and generate recommendations
```

### Transactions
```
POST   /inventory/transactions             Create inventory transaction
GET    /inventory/:id/transactions         Get transactions for item
```

## Entities

### InventoryItem
Core inventory item entity with:
- Basic info (name, category, description, SKU)
- Supplier information
- Reorder settings (reorder level, reorder quantity)
- Location tracking
- Unit cost tracking
- Active status flag

### InventoryTransaction
Transaction ledger for stock tracking:
- Transaction types (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, RETURN, DISPOSAL)
- Quantity (positive = add, negative = remove)
- Batch numbers and expiration dates
- User attribution
- Full audit trail

### PurchaseOrder
Purchase order management:
- Order number and dates
- Vendor relationship
- Multiple line items
- Financial totals (subtotal, tax, shipping, total)
- Status workflow
- Approval tracking

### Vendor
Supplier/vendor information:
- Contact details
- Payment terms
- Tax ID
- Rating system
- Active status

### MaintenanceLog
Equipment maintenance tracking:
- Maintenance type (CALIBRATION, REPAIR, INSPECTION, etc.)
- Cost tracking
- Next maintenance date scheduling
- Vendor information

## DTOs

### Create DTOs
- `CreateInventoryItemDto` - Validated inventory item creation
- `CreateInventoryTransactionDto` - Transaction creation with type validation
- `CreatePurchaseOrderDto` - Multi-item order with validation
- `StockAdjustmentDto` - Stock adjustments with required reason

### Response DTOs
- `InventoryAlertDto` - Alert structure with severity
- `AlertSummaryDto` - Comprehensive alert summary with recommendations

## Business Rules

### Stock Management
- Stock calculated as SUM(quantity) from inventory_transactions
- Positive quantities increase stock, negative quantities decrease stock
- All adjustments require reason code for audit compliance
- Stock history maintains running totals

### Alerts
- **Out of stock**: currentStock = 0 → CRITICAL severity
- **Low stock**: currentStock <= reorderLevel → HIGH severity
- **Expired items**: expirationDate <= now → CRITICAL severity
- **Near expiry**:
  - <= 7 days → HIGH severity
  - 8-30 days → MEDIUM severity
- **Maintenance overdue**: nextMaintenanceDate <= now → HIGH severity
- **Maintenance due**: <= 7 days → MEDIUM severity

### Purchase Orders
- Orders start in PENDING status
- Valid transitions:
  - PENDING → APPROVED | CANCELLED
  - APPROVED → ORDERED | CANCELLED
  - ORDERED → PARTIALLY_RECEIVED | RECEIVED | CANCELLED
  - PARTIALLY_RECEIVED → RECEIVED | CANCELLED
- Cannot order from inactive vendors
- Duplicate items in same order not allowed
- Order number must be unique

### Reorder Automation
- **CRITICAL priority**: currentStock = 0
- **HIGH priority**: currentStock < reorderLevel / 2
- **MEDIUM priority**: currentStock <= reorderLevel
- Default lead time: 7 days
- Recommended order quantity: max(reorderQuantity, reorderLevel * 2 - currentStock)

## Integration Points

### Medication Module
- Inventory items can be linked to medications
- Supports medication-specific tracking (controlled substances, refrigeration)
- Prescription requirements tracking

### Supplies Module
- General medical supplies tracking
- Bulk item management
- Non-medication inventory

### Location Module
- Multi-location inventory tracking
- Location-based stock queries
- Transfer tracking between locations

### User Module
- User attribution for all transactions
- Performed by tracking for audit trails
- Role-based access control integration

## Migration from Legacy Backend

This module migrates functionality from 16 original service files:
- `alertsService.ts` → `alerts.service.ts`
- `stockService.ts` → `stock-management.service.ts`
- `stockReorderAutomation.ts` → `reorder-automation.service.ts`
- `purchaseOrderService.ts` → `purchase-order.service.ts`
- `inventoryRepository.ts` → `inventory.service.ts`
- `transactionService.ts` → `transaction.service.ts`
- Plus: itemOperations, stockOperations, vendorService, maintenanceService, etc.

All business logic has been preserved and enhanced with:
- TypeORM decorators
- Class-validator validation
- NestJS dependency injection
- Swagger/OpenAPI documentation
- Improved error handling

## Dependencies

### Required NestJS Packages
- `@nestjs/common`
- `@nestjs/typeorm`
- `@nestjs/swagger`
- `@nestjs/config`

### Database
- `typeorm`
- `pg` (PostgreSQL driver)

### Validation
- `class-validator`
- `class-transformer`

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=white_cross
```

## Future Enhancements

1. **Automated reordering**: Automatic purchase order generation
2. **Email notifications**: Alert-based email notifications
3. **Barcode scanning**: Mobile barcode scanning for stock management
4. **Batch expiration tracking**: Enhanced batch and lot number management
5. **Inventory forecasting**: ML-based demand forecasting
6. **Multi-warehouse support**: Advanced multi-location management
7. **Vendor performance analytics**: Vendor rating and performance tracking
8. **Integration with external procurement systems**: EDI, vendor APIs
9. **Mobile inventory app**: iOS/Android app for stock management
10. **Inventory valuation reports**: FIFO, LIFO, weighted average cost

## Testing

Run tests with:
```bash
npm test
npm run test:e2e
npm run test:cov
```

## API Documentation

Access Swagger documentation at:
```
http://localhost:3000/api
```

Filter by tags:
- `inventory` - Core inventory operations
- `stock` - Stock management
- `alerts` - Alert system
- `purchase-orders` - Purchase order management
- `reorder` - Reorder automation
