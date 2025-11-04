# Export Component Architecture

## Component Hierarchy

```
ExportContent (Main Orchestrator - 192 lines)
├── Header
│   ├── Title & Description
│   └── Action Buttons (Settings, New Export)
│
└── Tabs
    ├── Tab 1: Create Export
    │   ├── ExportFormatSelector (202 lines)
    │   │   ├── Data Type Select
    │   │   ├── Format Select (CSV, Excel, PDF, JSON)
    │   │   ├── Date Range Picker
    │   │   ├── Export Name Input
    │   │   ├── HIPAA Warning
    │   │   └── Submit Button
    │   │
    │   └── ExportFieldMapping (151 lines)
    │       ├── Data Summary
    │       │   ├── Estimated Records
    │       │   ├── File Size
    │       │   └── Processing Time
    │       ├── Field Selection
    │       │   ├── Select All Checkbox
    │       │   └── Individual Field Checkboxes
    │       └── Security Notice
    │
    ├── Tab 2: Export Jobs
    │   └── ExportJobList (274 lines)
    │       ├── Search & Filter Controls
    │       ├── Job Cards
    │       │   ├── Job Metadata
    │       │   ├── Status Badge
    │       │   ├── HIPAA Indicator
    │       │   └── Action Buttons
    │       └── Load More Button
    │
    ├── Tab 3: Templates
    │   └── ExportTemplateGrid (179 lines)
    │       ├── Create Template Button
    │       └── Template Cards (Grid Layout)
    │           ├── Type Icon
    │           ├── Template Info
    │           ├── Usage Statistics
    │           └── Preview/Use Buttons
    │
    └── Tab 4: History
        └── ExportHistory (139 lines)
            ├── HIPAA Compliance Banner
            ├── Audit Entries
            │   ├── Action Description
            │   ├── Timestamp
            │   └── User & IP Info
            └── View Full Log Button
```

## State Management

```
useExportOperations Hook (336 lines)
├── Export Configuration State
│   ├── type: 'health-records' | 'medications' | ...
│   ├── format: 'csv' | 'xlsx' | 'pdf' | 'json'
│   ├── dateRange: { start, end }
│   └── name: string
│
├── Field Selection State
│   └── fields: ExportField[]
│       └── { id, label, selected }
│
├── Preview Data (Computed)
│   ├── estimatedRecords
│   ├── estimatedSize
│   ├── processingTime
│   └── recordType
│
└── Operations
    ├── updateExportConfig()
    ├── toggleField()
    ├── toggleAllFields()
    ├── createExport()
    └── downloadExport()
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    ExportContent                        │
│                  (Main Component)                       │
└────────────────┬───────────────────────────────────────┘
                 │
                 │ uses
                 ▼
┌─────────────────────────────────────────────────────────┐
│              useExportOperations()                      │
│                  (Custom Hook)                          │
│  • Manages export config state                          │
│  • Handles field selection                              │
│  • Calculates preview data                              │
│  • Performs export operations                           │
└────────────────┬───────────────────────────────────────┘
                 │
                 │ provides state & callbacks
                 │
        ┌────────┼────────┬─────────┬─────────┐
        │        │        │         │         │
        ▼        ▼        ▼         ▼         ▼
    ┌───────┐ ┌────┐ ┌────────┐ ┌────────┐ ┌─────────┐
    │Format │ │Field│ │JobList │ │Template│ │History  │
    │Select │ │Map  │ │        │ │Grid    │ │         │
    └───────┘ └────┘ └────────┘ └────────┘ └─────────┘
```

## Component Communication

### Parent → Child (Props)
```typescript
ExportContent
  ├─→ ExportFormatSelector
  │   └─→ { config, onConfigChange, onSubmit, isSubmitting }
  │
  ├─→ ExportFieldMapping
  │   └─→ { fields, previewData, onFieldToggle, onToggleAll }
  │
  ├─→ ExportJobList
  │   └─→ { jobs, onDownload, onView, hasMore }
  │
  ├─→ ExportTemplateGrid
  │   └─→ { templates, onPreview, onUse, onCreateNew }
  │
  └─→ ExportHistory
      └─→ { entries, onViewFullLog, isHipaaCompliant }
```

### Child → Parent (Callbacks)
```typescript
User Actions
  ├─→ Format Change → updateExportConfig()
  ├─→ Field Toggle → toggleField()
  ├─→ Submit Export → createExport()
  ├─→ Download Job → downloadExport()
  └─→ View Details → handleView*()
```

## Component Responsibilities

### ExportContent (Orchestrator)
- **Role**: Coordinator
- **Responsibilities**:
  - Tab navigation
  - Component composition
  - Event handler delegation
  - Data provisioning (from API/state)
- **Does NOT**: Handle business logic or complex state

### ExportFormatSelector (Configuration)
- **Role**: Data input
- **Responsibilities**:
  - Collect export parameters
  - Validate form inputs
  - Display HIPAA warnings
  - Submit export request
- **Does NOT**: Manage export execution or data fetching

### ExportFieldMapping (Preview)
- **Role**: Data visualization & selection
- **Responsibilities**:
  - Display preview statistics
  - Manage field selection
  - Show security notices
- **Does NOT**: Calculate preview data or validate selections

### ExportJobList (Queue Management)
- **Role**: Status display
- **Responsibilities**:
  - Display job queue
  - Filter and search jobs
  - Provide download actions
  - Show job metadata
- **Does NOT**: Execute exports or manage job lifecycle

### ExportTemplateGrid (Templates)
- **Role**: Template library
- **Responsibilities**:
  - Display available templates
  - Show usage statistics
  - Enable template preview/use
- **Does NOT**: Create or modify templates (delegates to parent)

### ExportHistory (Audit)
- **Role**: Compliance tracking
- **Responsibilities**:
  - Display audit trail
  - Show user actions
  - Track IP and timestamps
- **Does NOT**: Modify or delete audit entries

### useExportOperations (Business Logic)
- **Role**: State & logic manager
- **Responsibilities**:
  - Manage export configuration
  - Handle field selection logic
  - Calculate preview data
  - Execute export operations
  - Provide mock data (temporary)
- **Does NOT**: Render UI or handle DOM events

## File Organization

```
export/
└── _components/
    ├── index.ts                        # Barrel exports
    ├── REFACTORING_SUMMARY.md          # This summary
    ├── COMPONENT_ARCHITECTURE.md       # Architecture docs
    │
    ├── ExportContent.tsx               # Original (578 lines)
    ├── ExportContent.refactored.tsx    # Refactored (192 lines)
    │
    ├── ExportFormatSelector.tsx        # Config form (202 lines)
    ├── ExportFieldMapping.tsx          # Field selection (151 lines)
    ├── ExportJobList.tsx               # Job queue (274 lines)
    ├── ExportTemplateGrid.tsx          # Templates (179 lines)
    ├── ExportHistory.tsx               # Audit trail (139 lines)
    │
    └── useExportOperations.ts          # Business logic (336 lines)
```

## Import Strategy

### Barrel Export (Recommended)
```typescript
// Single import for everything
import {
  ExportContent,
  ExportFormatSelector,
  ExportFieldMapping,
  useExportOperations,
  type ExportConfig,
  type ExportField
} from '@/app/(dashboard)/export/_components';
```

### Individual Imports
```typescript
// Import specific components
import ExportContent from '@/app/(dashboard)/export/_components/ExportContent.refactored';
import { useExportOperations } from '@/app/(dashboard)/export/_components/useExportOperations';
```

## Testing Strategy

### Unit Tests
```typescript
// Test individual components in isolation
describe('ExportFormatSelector', () => {
  it('should call onConfigChange when format changes');
  it('should disable submit when name is empty');
  it('should display HIPAA warning');
});

describe('useExportOperations', () => {
  it('should update config correctly');
  it('should calculate preview data');
  it('should toggle fields');
});
```

### Integration Tests
```typescript
// Test component interactions
describe('ExportContent', () => {
  it('should update preview when config changes');
  it('should create export with selected fields');
  it('should navigate between tabs');
});
```

## Performance Optimization

### Current Optimizations
- ✅ `useMemo` for filtered job list
- ✅ `useMemo` for preview calculations
- ✅ `useCallback` for stable event handlers
- ✅ Separate files for code splitting

### Future Optimizations
- 🔄 Add `React.memo` for pure components
- 🔄 Implement virtual scrolling for large lists
- 🔄 Lazy load tab contents
- 🔄 Debounce search input
- 🔄 Optimize re-renders with context

## Accessibility Features

### Keyboard Navigation
- ✅ All interactive elements keyboard accessible
- ✅ Proper tab order
- ✅ Focus indicators

### Screen Readers
- ✅ ARIA labels on all controls
- ✅ Semantic HTML structure
- ✅ Status updates announced
- ✅ Form labels properly associated

### Visual
- ✅ Color contrast compliance
- ✅ Icon alternatives provided
- ✅ Clear visual hierarchy

## Migration Checklist

- [x] Create ExportFormatSelector component
- [x] Create ExportFieldMapping component
- [x] Create ExportJobList component
- [x] Create ExportTemplateGrid component
- [x] Create ExportHistory component
- [x] Create useExportOperations hook
- [x] Create refactored ExportContent orchestrator
- [x] Create barrel export (index.ts)
- [x] Document architecture
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Connect to real API endpoints
- [ ] Update parent page imports
- [ ] Replace original ExportContent.tsx
- [ ] Delete original file
- [ ] Update Storybook stories (if applicable)

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Lines per file** | 578 | 139-274 |
| **Testability** | Difficult | Easy |
| **Reusability** | None | High |
| **Maintainability** | Low | High |
| **Type Safety** | Partial | Complete |
| **Accessibility** | Basic | Comprehensive |
| **Documentation** | Minimal | Extensive |
| **Performance** | Good | Optimized |

---

**Architecture designed by**: React Component Architect
**Last updated**: 2025-11-04
