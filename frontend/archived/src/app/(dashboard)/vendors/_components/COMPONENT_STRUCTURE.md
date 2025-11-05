# Vendor Component Structure Diagram

## Component Hierarchy

```
VendorsContent (Main Container - 183 lines)
│
├── Custom Hooks
│   ├── useVendorData() - Fetches vendors and analytics
│   └── useVendorFilters() - Manages filter state and logic
│
├── VendorsHeader (70 lines)
│   └── Action Buttons
│       ├── Performance Analytics Button
│       ├── Export Data Button
│       └── Add Vendor Button
│
├── VendorStatsCards (124 lines)
│   ├── Total Vendors Card
│   ├── Total Spend Card
│   ├── Compliance Rate Card
│   └── Average Delivery Card
│
├── VendorFilters (123 lines)
│   ├── Search Input (name/number)
│   ├── Status Filter Dropdown
│   ├── Rating Filter Dropdown
│   └── Category Filter Dropdown
│
└── VendorsList (57 lines)
    ├── VendorCard × N (242 lines each)
    │   ├── Vendor Header
    │   │   ├── Name & Status Badge
    │   │   └── Rating Badge & Stars
    │   ├── Contact Information
    │   │   ├── Phone
    │   │   ├── Email
    │   │   └── Address
    │   ├── Performance Metrics
    │   │   ├── On-Time Delivery %
    │   │   ├── Total Orders
    │   │   └── Total Spend
    │   ├── Categories (tags)
    │   ├── Compliance Indicators
    │   │   ├── W-9 Badge
    │   │   ├── Insurance Badge
    │   │   ├── Contract Badge
    │   │   └── Certifications Count
    │   └── Action Buttons
    │       ├── View Details
    │       └── Create PO
    │
    └── VendorsEmptyState (64 lines)
        ├── Icon
        ├── Message
        └── Add Vendor Button (conditional)
```

## Data Flow

```
Server Actions ──────────────────────┐
  └── getVendors()                   │
  └── getVendorAnalytics()           │
                                     │
                                     ▼
                          useVendorData Hook
                                     │
                                     ├── vendors[]
                                     ├── analytics
                                     ├── stats
                                     ├── loading
                                     └── error
                                     │
                                     ▼
Mock Data ───────────────► useVendorFilters Hook
                                     │
                                     ├── filteredVendors[]
                                     ├── filters state
                                     └── filter setters
                                     │
                                     ▼
                           VendorsContent (Main)
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
  VendorsHeader              VendorStatsCards              VendorFilters
        │                            │                            │
        │                            │                            │
        └────────────────────────────┴────────────────────────────┘
                                     │
                                     ▼
                                VendorsList
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
                   VendorCard × N         VendorsEmptyState
```

## File Dependencies

```
VendorsContent.tsx
├── imports VendorsHeader.tsx
├── imports VendorStatsCards.tsx
├── imports VendorFilters.tsx
├── imports VendorsList.tsx
├── imports useVendorData.ts
│   ├── imports vendors.types.ts
│   ├── imports vendors.utils.ts
│   ├── imports vendors.mock.ts
│   └── imports @/lib/actions/vendors.actions
├── imports useVendorFilters.ts
│   └── imports vendors.types.ts
└── imports vendors.utils.ts

VendorsList.tsx
├── imports VendorCard.tsx
│   ├── imports vendors.types.ts
│   └── imports vendors.utils.ts
└── imports VendorsEmptyState.tsx

vendors.utils.ts
└── imports vendors.types.ts

vendors.mock.ts
└── imports vendors.types.ts
```

## Type System

```
vendors.types.ts
├── VendorContact
├── VendorAddress
├── VendorCertification
├── VendorPerformance
├── VendorStatus (enum)
├── VendorRating (enum)
├── Vendor (main interface)
├── VendorStats
└── VendorFilterState

Used by:
├── All components
├── All hooks
├── Utils
└── Mock data
```

## Utility Functions

```
vendors.utils.ts
├── formatCurrency(amount: number): string
├── getRatingBadge(rating: VendorRating): string
├── getStatusBadge(status: VendorStatus): string
├── calculateVendorStats(vendors: Vendor[]): VendorStats
├── extractUniqueCategories(vendors: Vendor[]): string[]
└── formatDate(dateString: string): string

Used by:
├── VendorStatsCards (formatCurrency, calculateVendorStats)
├── VendorCard (formatCurrency, getRatingBadge, getStatusBadge, formatDate)
├── VendorsContent (extractUniqueCategories)
└── useVendorData (calculateVendorStats)
```

## Component Communication

```
Parent → Child Props Flow:

VendorsContent
├── → VendorsHeader: (no props, self-contained)
├── → VendorStatsCards: stats
├── → VendorFilters: searchQuery, statusFilter, ratingFilter, categoryFilter,
│                     categories[], onSearchChange, onStatusChange,
│                     onRatingChange, onCategoryChange
├── → VendorsList: vendors[], hasActiveFilters
    └── → VendorCard: vendor
        └── Uses router for navigation (no parent callbacks)
```

## State Management

```
Local State (useState):
├── useVendorData Hook
│   ├── vendors (from server)
│   ├── analytics (from server)
│   ├── loading (boolean)
│   └── error (string | null)
│
└── useVendorFilters Hook
    ├── searchQuery (string)
    ├── statusFilter (VendorStatus | 'ALL')
    ├── ratingFilter (VendorRating | 'ALL')
    └── categoryFilter (string)

Derived State (useMemo):
├── VendorsContent
│   ├── serverFilters (from searchParams)
│   ├── allCategories (extracted from vendors)
│   └── hasActiveFilters (computed from filter state)
│
├── useVendorData Hook
│   └── stats (calculated from analytics or mock data)
│
└── useVendorFilters Hook
    └── filteredVendors (memoized filtering)
```

## Performance Optimizations

```
Memoization Strategy:
├── VendorsContent
│   ├── useMemo(serverFilters) - Rebuild only when searchParams change
│   └── useMemo(allCategories) - Extract categories once
│
├── useVendorData
│   └── stats calculation - Computed once per analytics update
│
└── useVendorFilters
    └── useMemo(filteredVendors) - Re-filter only when data or filters change

Component Splitting Benefits:
├── VendorCard re-renders only when individual vendor data changes
├── VendorFilters re-renders only when filter state changes
├── VendorStatsCards re-renders only when stats change
└── VendorsList re-renders only when vendor array changes
```

## Testing Isolation

```
Unit Testing:
├── vendors.utils.ts ✓ Pure functions, easy to test
├── vendors.types.ts ✓ Type checking via TypeScript
├── vendors.mock.ts ✓ Data structure validation
│
Component Testing:
├── VendorCard ✓ Isolated, receives vendor prop
├── VendorStatsCards ✓ Isolated, receives stats prop
├── VendorFilters ✓ Isolated, controlled inputs
├── VendorsEmptyState ✓ Isolated, simple conditional
├── VendorsList ✓ Isolated, maps data to cards
└── VendorsHeader ✓ Isolated, self-contained
│
Hook Testing:
├── useVendorData ✓ Can use renderHook
└── useVendorFilters ✓ Can use renderHook
│
Integration Testing:
└── VendorsContent ✓ Composes all parts, tests data flow
```

## Code Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lines in main file | 1,013 | 183 | 82% reduction |
| Number of files | 1 | 11 | Better organization |
| Avg lines per file | 1,013 | 139 | 86% smaller |
| Functions in main | ~15 | 3 | 80% reduction |
| Cyclomatic complexity | High | Low | More maintainable |
| Testability | Low | High | Isolated units |
| Reusability | Low | High | Composable parts |

## React Best Practices Checklist

- [x] Functional components with hooks
- [x] Custom hooks for reusable logic
- [x] Component composition over large files
- [x] Props destructuring
- [x] TypeScript for type safety
- [x] Memoization for performance
- [x] Semantic HTML
- [x] Accessibility (ARIA labels)
- [x] Single Responsibility Principle
- [x] DRY (Don't Repeat Yourself)
- [x] Separation of Concerns
- [x] Loading and error states
- [x] Empty states
- [x] Responsive design
- [x] Proper event handling
- [x] Clean code documentation

---

**Status**: Production-ready, fully refactored architecture
