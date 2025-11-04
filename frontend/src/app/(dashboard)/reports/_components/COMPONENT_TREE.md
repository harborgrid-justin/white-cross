# Reports Component Architecture

## Component Tree

```
ReportsContent (194 lines)
├── Header Section
│   ├── Title & Description
│   └── Action Buttons (Filter, Search, New Report)
│
├── ReportsSummary (137 lines)
│   ├── Total Reports Card
│   ├── Completed Today Card
│   ├── Scheduled Card
│   └── Downloads Card
│
├── Grid Layout (2 columns)
│   ├── ReportActions (156 lines)
│   │   ├── Quick Actions Card
│   │   │   ├── Create Report Button
│   │   │   ├── Schedule Report Button
│   │   │   ├── Bulk Export Button
│   │   │   └── Report Settings Button
│   │   └── Bulk Actions Card (conditional)
│   │       ├── Bulk Download Button
│   │       ├── Email Reports Button
│   │       └── Delete Selected Button
│   │
│   └── ReportTemplates (186 lines)
│       ├── Template Card 1
│       ├── Template Card 2
│       ├── Template Card 3
│       └── View All Link
│
└── ReportHistory (267 lines)
    ├── Header (Count & Controls)
    ├── Report Item 1
    │   ├── Checkbox
    │   ├── Metadata (Title, Badges, Description)
    │   ├── Details (User, Dept, Date, Size, Tags)
    │   └── Action Buttons (View, Download, Share, etc.)
    ├── Report Item 2
    ├── Report Item 3
    └── ...
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ReportsContent                         │
│                     (Main Coordinator)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ├─ useState: selectedReports
                        │
                        ├─ useReportsList Hook ──┐
                        │                         │
                        ▼                         ▼
            ┌─────────────────────┐   ┌──────────────────────┐
            │  Data Layer (Hook)  │   │  Utility Functions   │
            ├─────────────────────┤   ├──────────────────────┤
            │ - Fetch Reports     │   │ - Badge Variants     │
            │ - Fetch Summary     │   │ - Date Formatting    │
            │ - Fetch Templates   │   │ - Number Formatting  │
            │ - Apply Filters     │   │ - Sorting/Filtering  │
            │ - Handle Errors     │   │ - Text Utils         │
            └─────────┬───────────┘   └──────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             ▼
┌────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐
│  Summary   │ │ Templates  │ │ History  │ │ Actions  │
│ Component  │ │ Component  │ │Component │ │Component │
└────────────┘ └────────────┘ └──────────┘ └──────────┘
```

## Component Responsibilities

### ReportsContent (Main)
**Lines**: 194
**Responsibility**: Orchestration and state management
- Manages bulk selection state
- Coordinates sub-components
- Handles user actions
- Error handling
- Layout structure

### ReportsSummary
**Lines**: 137
**Responsibility**: Statistics visualization
- Display summary metrics
- Format numbers
- Render icon cards
- Loading states

### ReportTemplates
**Lines**: 186
**Responsibility**: Template selection
- Display popular templates
- Handle template clicks
- Show usage statistics
- Navigate to template builder

### ReportHistory
**Lines**: 267
**Responsibility**: Reports list management
- Render report items
- Bulk selection UI
- Status-based actions
- Metadata display
- Refresh functionality

### ReportActions
**Lines**: 156
**Responsibility**: Action management
- Quick action buttons
- Bulk operations
- Conditional rendering
- Action coordination

## Shared Resources

### types.ts (163 lines)
- Report interface
- ReportTemplate interface
- ReportsSummary interface
- Props interfaces
- Type enums (Category, Status, Priority)

### utils.ts (198 lines)
- getCategoryBadgeVariant()
- getStatusBadgeVariant()
- getPriorityBadgeVariant()
- formatDate()
- formatNumber()
- formatFileSize()
- formatDuration()
- getRelativeTime()
- pluralize()
- truncateText()
- sortReports()
- filterReportsBySearch()
- groupReportsBy()

### hooks/useReportsList.ts (232 lines)
- fetchReportsList()
- fetchSummary()
- fetchTemplates()
- applyFilters()
- applySorting()
- Error handling
- Loading states

## Props Flow

```typescript
// ReportsContent receives search params
interface ReportsContentProps {
  searchParams: ReportsSearchParams;
}

// Passes summary data to ReportsSummary
interface ReportsSummaryProps {
  summary: ReportsSummary;
  loading?: boolean;
}

// Passes templates and callback to ReportTemplates
interface ReportTemplatesProps {
  templates: ReportTemplate[];
  loading?: boolean;
  onTemplateSelect?: (templateId: string) => void;
}

// Passes reports, selection state, and handlers to ReportHistory
interface ReportHistoryProps {
  reports: Report[];
  loading?: boolean;
  selectedReports: Set<string>;
  onToggleSelection: (reportId: string) => void;
  onRefresh?: () => void;
}

// Passes selection count and handlers to ReportActions
interface ReportActionsProps {
  selectedCount: number;
  onBulkDownload?: () => void;
  onBulkEmail?: () => void;
  onBulkDelete?: () => void;
}
```

## State Management

```typescript
// Main component state
const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());

// Hook state (internal)
const [summary, setSummary] = useState<ReportsSummary | null>(null);
const [reports, setReports] = useState<Report[]>([]);
const [templates, setTemplates] = useState<ReportTemplate[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
```

## Event Handlers

```typescript
// Selection management
toggleReportSelection(reportId: string) => void

// Bulk operations
handleBulkDownload() => void
handleBulkEmail() => void
handleBulkDelete() => void

// Template interaction
handleTemplateSelect(templateId: string) => void

// Data refresh
handleRefresh() => void
```

## File Organization

```
reports/_components/
│
├── Core Types & Config
│   ├── types.ts                    (163 lines)
│   └── utils.ts                    (198 lines)
│
├── Data Layer
│   └── hooks/
│       └── useReportsList.ts       (232 lines)
│
├── UI Components
│   ├── ReportsSummary.tsx          (137 lines)
│   ├── ReportTemplates.tsx         (186 lines)
│   ├── ReportHistory.tsx           (267 lines)
│   └── ReportActions.tsx           (156 lines)
│
├── Main Component
│   ├── ReportsContent.tsx          (194 lines - refactored)
│   └── ReportsContent.backup.tsx   (706 lines - original)
│
└── Documentation
    ├── REFACTORING_SUMMARY.md
    └── COMPONENT_TREE.md (this file)
```

## Performance Optimizations

### Current Optimizations
1. **useCallback** for event handlers to prevent unnecessary re-renders
2. **Component isolation** - each sub-component can re-render independently
3. **Conditional rendering** - bulk actions only shown when needed
4. **Loading states** - skeleton loaders for better UX

### Future Optimizations
1. **React.memo** - memoize sub-components
2. **useMemo** - memoize filtered/sorted data
3. **Virtual scrolling** - for large report lists
4. **Code splitting** - lazy load components
5. **Data pagination** - load reports in batches

## Testing Strategy

### Unit Tests
- Test each component in isolation
- Mock props and verify rendering
- Test utility functions independently
- Test hook with mock data

### Integration Tests
- Test component coordination
- Test state management flow
- Test user interactions across components
- Test error handling

### E2E Tests
- Test complete user workflows
- Test bulk operations
- Test filtering and sorting
- Test navigation

## Accessibility Features

1. **ARIA Labels**: All interactive elements have descriptive labels
2. **Semantic HTML**: Proper use of headings, buttons, and landmarks
3. **Keyboard Navigation**: All actions accessible via keyboard
4. **Screen Reader Support**: Meaningful text for assistive technologies
5. **Focus Management**: Clear focus indicators

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features (transpiled by Next.js)
- CSS Grid and Flexbox support required
- Responsive design for mobile, tablet, desktop

## Next Steps

1. **API Integration**: Replace mock data with real API calls
2. **Error Boundaries**: Add component-level error boundaries
3. **Loading Optimization**: Implement React Suspense
4. **Advanced Filtering**: Add filter component
5. **Report Viewer**: Create dedicated viewer component
6. **Export Enhancement**: Integrate useReportExport hook
7. **Scheduling**: Integrate useReportScheduler hook
