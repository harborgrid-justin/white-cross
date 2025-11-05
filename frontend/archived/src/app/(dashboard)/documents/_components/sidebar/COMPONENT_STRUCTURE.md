# Sidebar Component Structure

## Visual Component Hierarchy

```
DocumentsSidebar (91 lines)
├── Uses: useSidebarData hook
│   └── Returns: { recentDocuments, recentActivity, documentAlerts, quickStats }
│
├── QuickStatsCard (51 lines)
│   ├── Props: { stats: QuickStats }
│   └── Displays: 4 stat boxes (Today, Pending, Encrypted, Starred)
│
├── DocumentAlertsCard (74 lines)
│   ├── Props: { alerts: DocumentAlert[], onViewAllAlerts }
│   ├── Uses: useSidebarFormatters (formatRelativeTime, getSeverityColor)
│   └── Displays: Alert list with severity badges
│
├── RecentDocumentsCard (146 lines)
│   ├── Props: { documents: RecentDocument[], onRefresh, onUpload, onFilter, maxDisplay }
│   ├── Uses: useSidebarFormatters (formatRelativeTime, formatFileSize, getDocumentTypeIcon)
│   └── Displays: Document list with metadata
│
├── RecentActivityCard (116 lines)
│   ├── Props: { activities: DocumentActivity[], onViewActivityLog }
│   ├── Uses: useSidebarFormatters (formatRelativeTime, getActivityIcon)
│   └── Displays: Activity feed with colored icons
│
└── QuickActionsCard (112 lines)
    ├── Props: { action callbacks for 6 operations }
    └── Displays: 6 action buttons
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DocumentsSidebar                           │
│                     (Main Wrapper - 91 lines)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Uses
                             ▼
                  ┌──────────────────────┐
                  │  useSidebarData      │
                  │  (Hook - 206 lines)  │
                  └──────────┬───────────┘
                             │ Returns
                             ▼
        ┌────────────────────────────────────────────┐
        │  {                                         │
        │    recentDocuments: RecentDocument[]       │
        │    recentActivity: DocumentActivity[]      │
        │    documentAlerts: DocumentAlert[]         │
        │    quickStats: QuickStats                  │
        │  }                                         │
        └────────────────────────────────────────────┘
                             │
                             │ Distributes to
                             ▼
    ┌────────────────────────────────────────────────────┐
    │                                                    │
    ▼                    ▼                    ▼         ▼
┌────────┐        ┌────────┐        ┌────────┐   ┌────────┐
│ Quick  │        │Document│        │Recent  │   │Recent  │
│ Stats  │        │Alerts  │        │Docs    │   │Activity│
│ Card   │        │Card    │        │Card    │   │Card    │
└────────┘        └────────┘        └────────┘   └────────┘
                                                       │
                                                       ▼
                                              ┌────────────┐
                                              │ Quick      │
                                              │ Actions    │
                                              │ Card       │
                                              └────────────┘
```

## Formatter Hook Usage

```
useSidebarFormatters (106 lines)
│
├── formatRelativeTime(timestamp)
│   ├── Used by: DocumentAlertsCard
│   ├── Used by: RecentDocumentsCard
│   └── Used by: RecentActivityCard
│
├── formatFileSize(bytes)
│   └── Used by: RecentDocumentsCard
│
├── getSeverityColor(severity)
│   └── Used by: DocumentAlertsCard
│
├── getActivityIcon(type)
│   └── Used by: RecentActivityCard
│
└── getDocumentTypeIcon(type)
    └── Used by: RecentDocumentsCard
```

## Type Dependencies

```
sidebar.types.ts (55 lines)
│
├── RecentDocument
│   └── Used by: useSidebarData, RecentDocumentsCard
│
├── DocumentActivity
│   └── Used by: useSidebarData, RecentActivityCard
│
├── DocumentAlert
│   └── Used by: useSidebarData, DocumentAlertsCard
│
├── QuickStats
│   └── Used by: useSidebarData, QuickStatsCard
│
└── SidebarData
    └── Used by: useSidebarData (return type)
```

## File Size Breakdown

```
Component Files:
┌──────────────────────────┬───────┐
│ QuickStatsCard           │  51 ▓ │
│ DocumentAlertsCard       │  74 ▓▓│
│ DocumentsSidebar         │  91 ▓▓│
│ QuickActionsCard         │ 112 ▓▓│
│ RecentActivityCard       │ 116 ▓▓│
│ RecentDocumentsCard      │ 146 ▓▓▓│
└──────────────────────────┴───────┘

Hook Files:
┌──────────────────────────┬───────┐
│ useSidebarFormatters     │ 106 ▓▓│
│ useSidebarData           │ 206 ▓▓▓▓│
└──────────────────────────┴───────┘

Type Files:
┌──────────────────────────┬───────┐
│ sidebar.types.ts         │  55 ▓ │
└──────────────────────────┴───────┘

Export Files:
┌──────────────────────────┬───────┐
│ index.ts                 │  27   │
└──────────────────────────┴───────┘

Total: 984 lines across 10 files
```

## Component Complexity Analysis

```
Low Complexity (< 100 lines):
  ✓ index.ts (27 lines)
  ✓ QuickStatsCard (51 lines)
  ✓ sidebar.types.ts (55 lines)
  ✓ DocumentAlertsCard (74 lines)
  ✓ DocumentsSidebar (91 lines)

Medium Complexity (100-150 lines):
  ✓ useSidebarFormatters (106 lines)
  ✓ QuickActionsCard (112 lines)
  ✓ RecentActivityCard (116 lines)
  ✓ RecentDocumentsCard (146 lines)

High Complexity (150-250 lines):
  ✓ useSidebarData (206 lines)
    Note: Mostly mock data, will be replaced by API calls

All files are maintainable and focused on single responsibilities.
```

## Import/Export Flow

```
index.ts (Barrel Exports)
│
├── export { DocumentsSidebar }
│   from './DocumentsSidebar'
│
├── export { QuickStatsCard }
│   from './QuickStatsCard'
│
├── export { DocumentAlertsCard }
│   from './DocumentAlertsCard'
│
├── export { RecentDocumentsCard }
│   from './RecentDocumentsCard'
│
├── export { RecentActivityCard }
│   from './RecentActivityCard'
│
├── export { QuickActionsCard }
│   from './QuickActionsCard'
│
├── export { useSidebarData }
│   from './useSidebarData'
│
├── export { useSidebarFormatters }
│   from './useSidebarFormatters'
│
└── export type { ... }
    from './sidebar.types'
```

## Consumer Usage Pattern

```tsx
// Option 1: Import main wrapper (recommended)
import { DocumentsSidebar } from './_components/sidebar';

<DocumentsSidebar
  onUploadDocument={handleUpload}
  onFilter={handleFilter}
  onRefreshDocuments={refetch}
/>

// Option 2: Import individual cards (advanced)
import {
  QuickStatsCard,
  RecentDocumentsCard,
  useSidebarData
} from './_components/sidebar';

const { recentDocuments, quickStats } = useSidebarData();

<div>
  <QuickStatsCard stats={quickStats} />
  <RecentDocumentsCard
    documents={recentDocuments}
    onUpload={handleUpload}
  />
</div>

// Option 3: Custom composition
import {
  DocumentAlertsCard,
  RecentActivityCard,
  QuickActionsCard
} from './_components/sidebar';

// Create custom sidebar with only alerts and actions
<aside>
  <DocumentAlertsCard alerts={alerts} />
  <QuickActionsCard onUploadDocument={handleUpload} />
</aside>
```

## Testing Structure

```
sidebar/
├── __tests__/
│   ├── QuickStatsCard.test.tsx
│   ├── DocumentAlertsCard.test.tsx
│   ├── RecentDocumentsCard.test.tsx
│   ├── RecentActivityCard.test.tsx
│   ├── QuickActionsCard.test.tsx
│   ├── DocumentsSidebar.test.tsx (integration)
│   ├── useSidebarData.test.ts
│   └── useSidebarFormatters.test.ts
```

## Recommended File Organization

```
Current Structure:
✓ sidebar/
  ✓ index.ts                    (exports)
  ✓ sidebar.types.ts            (types)
  ✓ useSidebarData.ts           (data hook)
  ✓ useSidebarFormatters.ts     (formatters hook)
  ✓ DocumentsSidebar.tsx        (main wrapper)
  ✓ QuickStatsCard.tsx
  ✓ DocumentAlertsCard.tsx
  ✓ RecentDocumentsCard.tsx
  ✓ RecentActivityCard.tsx
  ✓ QuickActionsCard.tsx
  ✓ README.md
  ✓ COMPONENT_STRUCTURE.md

Future Additions:
  □ __tests__/                  (test files)
  □ __stories__/                (Storybook stories)
  □ __mocks__/                  (mock data)
```

## Advantages of This Structure

### Separation of Concerns
- **Types**: Centralized in one file
- **Data Logic**: Isolated in useSidebarData hook
- **Formatting Logic**: Isolated in useSidebarFormatters hook
- **UI Components**: Each card is independent
- **Composition**: Main wrapper orchestrates everything

### Testability
- Each component can be tested in isolation
- Hooks can be tested independently
- Mock data easily injectable via props
- Integration tests possible at wrapper level

### Reusability
- Cards can be used individually
- Hooks can be used in other components
- Types can be imported elsewhere
- Easy to create custom compositions

### Maintainability
- Small, focused files (50-200 lines)
- Clear dependencies
- Single responsibility per file
- Easy to locate and modify code

### Performance
- Components are memoization-ready
- Hooks use React optimization patterns
- Tree-shaking friendly exports
- Lazy loading possible per card

### Developer Experience
- Clear file naming
- Logical organization
- Comprehensive documentation
- Easy to navigate and understand

---

**Created**: 2025-11-04
**Component Count**: 6 cards + 2 hooks + 1 wrapper + 1 types file
**Total Files**: 10 (+ README + this doc)
**Lines per File**: 27-206 (average: 98)
