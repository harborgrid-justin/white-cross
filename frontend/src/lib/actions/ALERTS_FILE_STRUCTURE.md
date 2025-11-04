# Alerts Module File Structure

## Visual Directory Structure

```
/workspaces/white-cross/frontend/src/lib/actions/
├── alerts.actions.ts           (94 lines)  - Main entry point
├── alerts.types.ts             (46 lines)  - TypeScript types
├── alerts.crud.ts             (116 lines)  - CRUD operations
├── alerts.acknowledgment.ts    (88 lines)  - Acknowledgment operations
├── alerts.recommendations.ts   (81 lines)  - Recommendations
├── alerts.analytics.ts         (95 lines)  - Analytics operations
├── alerts.reports.ts          (109 lines)  - Report generation
├── alerts.cache.ts             (60 lines)  - Cache management
└── alerts.utils.ts            (104 lines)  - Utility functions
```

## File Size Distribution

```
0     25     50     75    100   125 lines
├─────┼──────┼──────┼──────┼─────┼
│ alerts.types.ts (46)
│■■■■■■■■■■■
│
│ alerts.cache.ts (60)
│■■■■■■■■■■■■■■
│
│ alerts.recommendations.ts (81)
│■■■■■■■■■■■■■■■■■■■
│
│ alerts.acknowledgment.ts (88)
│■■■■■■■■■■■■■■■■■■■■
│
│ alerts.actions.ts (94)
│■■■■■■■■■■■■■■■■■■■■■■
│
│ alerts.analytics.ts (95)
│■■■■■■■■■■■■■■■■■■■■■■
│
│ alerts.utils.ts (104)
│■■■■■■■■■■■■■■■■■■■■■■■■
│
│ alerts.reports.ts (109)
│■■■■■■■■■■■■■■■■■■■■■■■■■
│
│ alerts.crud.ts (116)
│■■■■■■■■■■■■■■■■■■■■■■■■■■■
└─────────────────────────────
```

## Module Responsibility Matrix

| Module | Read Operations | Write Operations | Caching | Utilities | Types |
|--------|----------------|------------------|---------|-----------|-------|
| alerts.types.ts | - | - | - | - | ✓ |
| alerts.crud.ts | ✓ | - | - | - | - |
| alerts.acknowledgment.ts | - | ✓ | ✓ | - | - |
| alerts.recommendations.ts | ✓ | - | - | - | - |
| alerts.analytics.ts | ✓ | - | - | - | - |
| alerts.reports.ts | ✓ | ✓ | - | - | - |
| alerts.cache.ts | - | - | ✓ | - | - |
| alerts.utils.ts | - | - | - | ✓ | - |
| alerts.actions.ts | Re-exports | Re-exports | Re-exports | Re-exports | Re-exports |

## Import Relationships

```
alerts.types.ts (no dependencies)
     ↑
     │ import types
     │
     ├─── alerts.crud.ts
     ├─── alerts.acknowledgment.ts
     ├─── alerts.recommendations.ts
     ├─── alerts.analytics.ts
     └─── alerts.reports.ts

alerts.cache.ts (no dependencies)
alerts.utils.ts (no dependencies)

alerts.actions.ts
     ↑
     │ re-exports from
     │
     ├─── alerts.types.ts
     ├─── alerts.crud.ts
     ├─── alerts.acknowledgment.ts
     ├─── alerts.recommendations.ts
     ├─── alerts.analytics.ts
     ├─── alerts.reports.ts
     ├─── alerts.cache.ts
     └─── alerts.utils.ts
```

## Function Distribution

### alerts.crud.ts (3 functions)
- `getLowStockAlerts()` - Retrieve low stock alerts
- `getExpirationAlerts()` - Retrieve expiration alerts
- `getInventoryDashboardStats()` - Get dashboard statistics

### alerts.acknowledgment.ts (2 functions)
- `acknowledgeAlert()` - Acknowledge an alert
- `dismissAlert()` - Dismiss an alert

### alerts.recommendations.ts (2 functions)
- `getReorderRecommendations()` - Get reorder suggestions
- `getTransferRecommendations()` - Get transfer suggestions

### alerts.analytics.ts (2 functions)
- `getStockUsageAnalytics()` - Get usage analytics
- `getInventoryValuation()` - Get inventory valuation

### alerts.reports.ts (2 functions)
- `generateStockLevelReport()` - Generate stock reports
- `exportReportToCSV()` - Export to CSV

### alerts.cache.ts (6 functions)
- `revalidateAlertCaches()` - Revalidate all caches
- `revalidateLowStockCaches()` - Revalidate low stock caches
- `revalidateExpirationCaches()` - Revalidate expiration caches
- `revalidateDashboardCaches()` - Revalidate dashboard caches
- `revalidateAnalyticsCaches()` - Revalidate analytics caches
- `revalidateReportCaches()` - Revalidate report caches

### alerts.utils.ts (8 functions)
- `filterToParams()` - Convert filters to params
- `isValidLocationId()` - Validate location ID
- `isValidAlertId()` - Validate alert ID
- `formatDaysAhead()` - Format days until expiration
- `getExpirationSeverity()` - Calculate expiration severity
- `getStockLevelSeverity()` - Calculate stock severity
- `formatStockPercentage()` - Format stock percentage
- `calculateReorderQuantity()` - Calculate reorder quantity

## Type Definitions

### alerts.types.ts (11 type exports)
- `ActionResult<T>` - Generic action result interface
- `LowStockAlert` - Low stock alert schema
- `ExpirationAlert` - Expiration alert schema
- `BulkReorderRecommendations` - Reorder recommendations schema
- `StockTransferRecommendation` - Transfer recommendation schema
- `StockLevelReport` - Stock level report schema
- `InventoryDashboardStats` - Dashboard statistics schema
- `StockUsageAnalytics` - Usage analytics schema
- `UsageAnalyticsFilter` - Analytics filter schema
- `TotalStockValuation` - Valuation schema
- `ReportType` - Report type union

## Usage Example

```typescript
// All imports continue to work from the main entry point
import {
  getLowStockAlerts,
  getExpirationAlerts,
  acknowledgeAlert,
  dismissAlert,
  type ActionResult,
  type LowStockAlert,
} from '@/lib/actions/alerts.actions';

// Or import from specific modules if needed
import { getLowStockAlerts } from '@/lib/actions/alerts.crud';
import { revalidateAlertCaches } from '@/lib/actions/alerts.cache';
import { formatDaysAhead } from '@/lib/actions/alerts.utils';
```

## Testing Recommendations

### Unit Tests
- alerts.utils.ts - 100% pure functions, easy to test
- alerts.types.ts - Type definitions, use tsd for type testing

### Integration Tests
- alerts.crud.ts - Mock apiClient
- alerts.acknowledgment.ts - Mock apiClient + cache
- alerts.recommendations.ts - Mock apiClient
- alerts.analytics.ts - Mock apiClient
- alerts.reports.ts - Mock apiClient + fetch

### E2E Tests
- alerts.actions.ts - Test full workflows through main entry point

## Performance Characteristics

| Module | API Calls | Cache Writes | Computation |
|--------|-----------|--------------|-------------|
| alerts.crud.ts | 3 | 0 | Low |
| alerts.acknowledgment.ts | 2 | 6 | Low |
| alerts.recommendations.ts | 2 | 0 | Low |
| alerts.analytics.ts | 2 | 0 | Medium |
| alerts.reports.ts | 2 | 0 | Low |
| alerts.cache.ts | 0 | 12 | None |
| alerts.utils.ts | 0 | 0 | Low |

## Migration Notes

### Before (Single File)
```typescript
// All 462 lines in one file
import { getLowStockAlerts } from '@/lib/actions/alerts.actions';
```

### After (Modular Structure)
```typescript
// Same import continues to work
import { getLowStockAlerts } from '@/lib/actions/alerts.actions';

// Or use specific modules
import { getLowStockAlerts } from '@/lib/actions/alerts.crud';
```

**Result:** Zero breaking changes, fully backward compatible.
