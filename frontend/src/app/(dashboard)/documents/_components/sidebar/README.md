# Document Sidebar Components

This directory contains the refactored document sidebar components, breaking down the original 589-line monolithic `DocumentsSidebar.tsx` into focused, maintainable React components.

## Architecture Overview

The sidebar has been refactored following React component best practices:

- **Separation of Concerns**: Each sidebar section is now an independent component
- **Custom Hooks**: Reusable logic extracted into specialized hooks
- **Type Safety**: Full TypeScript integration with shared type definitions
- **Composability**: Main sidebar acts as a layout wrapper composing sub-components
- **Performance**: Memoization and optimized re-renders through focused components

## File Structure

```
sidebar/
├── index.ts                      # Centralized exports (27 lines)
├── sidebar.types.ts              # Type definitions (55 lines)
├── useSidebarData.ts             # Data fetching hook (206 lines)
├── useSidebarFormatters.ts       # Formatting utilities hook (106 lines)
├── DocumentsSidebar.tsx          # Main layout wrapper (91 lines)
├── QuickStatsCard.tsx            # Statistics overview (51 lines)
├── DocumentAlertsCard.tsx        # Alert notifications (74 lines)
├── RecentDocumentsCard.tsx       # Recent documents list (146 lines)
├── RecentActivityCard.tsx        # Activity feed (116 lines)
└── QuickActionsCard.tsx          # Quick action buttons (112 lines)
```

**Total: 984 lines** (vs. original 589 lines with better organization)

## Component Breakdown

### Core Components

#### 1. **DocumentsSidebar** (91 lines)
Main layout wrapper that composes all sidebar sections.

**Props:**
```typescript
interface DocumentsSidebarProps {
  className?: string;
  onUploadDocument?: () => void;
  onFilter?: () => void;
  onViewAllAlerts?: () => void;
  onViewActivityLog?: () => void;
  onRefreshDocuments?: () => void;
  onCreateTemplate?: () => void;
  onBulkExport?: () => void;
  onArchiveDocuments?: () => void;
  onReviewPermissions?: () => void;
  onScheduleCleanup?: () => void;
}
```

**Usage:**
```tsx
import { DocumentsSidebar } from './_components/sidebar';

<DocumentsSidebar
  onUploadDocument={() => console.log('Upload clicked')}
  onFilter={() => console.log('Filter clicked')}
  onViewAllAlerts={() => console.log('View alerts')}
/>
```

#### 2. **QuickStatsCard** (51 lines)
Displays four quick statistics in a 2x2 grid:
- Recent uploads (today)
- Pending reviews
- Encrypted documents
- Starred documents

**Props:**
```typescript
interface QuickStatsCardProps {
  stats: QuickStats;
  className?: string;
}
```

#### 3. **DocumentAlertsCard** (74 lines)
Shows document alerts with severity badges and counts.

**Props:**
```typescript
interface DocumentAlertsCardProps {
  alerts: DocumentAlert[];
  onViewAllAlerts?: () => void;
  className?: string;
}
```

**Features:**
- Severity color coding (low, medium, high, urgent)
- Scrollable list (max-height: 16rem)
- Relative timestamps
- Document counts

#### 4. **RecentDocumentsCard** (146 lines)
Displays recently uploaded/modified documents with metadata.

**Props:**
```typescript
interface RecentDocumentsCardProps {
  documents: RecentDocument[];
  maxDisplay?: number; // Default: 8
  onRefresh?: () => void;
  onUpload?: () => void;
  onFilter?: () => void;
  className?: string;
}
```

**Features:**
- Document type icons
- Status badges
- Star and lock indicators
- File size display
- Relative timestamps
- Scrollable list

#### 5. **RecentActivityCard** (116 lines)
Shows activity feed for document actions.

**Props:**
```typescript
interface RecentActivityCardProps {
  activities: DocumentActivity[];
  onViewActivityLog?: () => void;
  className?: string;
}
```

**Features:**
- Activity type icons with color coding
- Student name display
- Action descriptions
- User attribution
- Relative timestamps

#### 6. **QuickActionsCard** (112 lines)
Provides quick access buttons for common document operations.

**Props:**
```typescript
interface QuickActionsCardProps {
  onUploadDocument?: () => void;
  onCreateTemplate?: () => void;
  onBulkExport?: () => void;
  onArchiveDocuments?: () => void;
  onReviewPermissions?: () => void;
  onScheduleCleanup?: () => void;
  className?: string;
}
```

**Actions:**
- Upload Document
- Create Template
- Bulk Export
- Archive Old Documents
- Review Permissions
- Schedule Cleanup

### Custom Hooks

#### 1. **useSidebarData** (206 lines)
Manages sidebar data fetching and mock data generation.

**Returns:**
```typescript
interface SidebarData {
  recentDocuments: RecentDocument[];
  recentActivity: DocumentActivity[];
  documentAlerts: DocumentAlert[];
  quickStats: QuickStats;
}
```

**Usage:**
```tsx
const { recentDocuments, recentActivity, documentAlerts, quickStats } = useSidebarData();
```

**Current Implementation:**
- Uses React.useMemo for mock data generation
- Calculates statistics from document data
- Ready to be replaced with real API calls

#### 2. **useSidebarFormatters** (106 lines)
Provides utility functions for formatting sidebar data.

**Returns:**
```typescript
interface SidebarFormatters {
  formatRelativeTime: (timestamp: string) => string;
  formatFileSize: (bytes: number) => string;
  getSeverityColor: (severity: string) => string;
  getActivityIcon: (type: string) => React.ComponentType;
  getDocumentTypeIcon: (type: DocumentType) => React.ComponentType;
}
```

**Usage:**
```tsx
const { formatRelativeTime, formatFileSize, getDocumentTypeIcon } = useSidebarFormatters();

const timeAgo = formatRelativeTime(document.uploadedAt); // "2h ago"
const size = formatFileSize(document.fileSize); // "2.5 MB"
const Icon = getDocumentTypeIcon('medical_record'); // Shield icon
```

### Type Definitions

#### **sidebar.types.ts** (55 lines)
Centralized type definitions for sidebar components.

**Exported Types:**
- `RecentDocument` - Document metadata for recent list
- `DocumentActivity` - Activity feed item
- `DocumentAlert` - Alert notification
- `QuickStats` - Statistics summary
- `SidebarData` - Combined data structure

## Migration Guide

### Before (Old Import)
```tsx
import DocumentsSidebar from './_components/DocumentsSidebar';

<DocumentsSidebar className="w-80" />
```

### After (New Import - Recommended)
```tsx
import { DocumentsSidebar } from './_components/sidebar';

<DocumentsSidebar className="w-80" />
```

The old import path still works for backward compatibility but is deprecated.

## Integration with Real Data

To replace mock data with real API calls:

### 1. Update useSidebarData Hook

```tsx
// Replace useMemo mock data with API calls
export const useSidebarData = (): SidebarData => {
  const [data, setData] = React.useState<SidebarData>({
    recentDocuments: [],
    recentActivity: [],
    documentAlerts: [],
    quickStats: { recentUploads: 0, pendingReview: 0, encryptedDocs: 0, starredDocs: 0 }
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const [documents, activity, alerts] = await Promise.all([
        fetchRecentDocuments(),
        fetchRecentActivity(),
        fetchDocumentAlerts()
      ]);

      const stats = calculateQuickStats(documents);

      setData({ recentDocuments: documents, recentActivity: activity, documentAlerts: alerts, quickStats: stats });
    };

    fetchData();
  }, []);

  return data;
};
```

### 2. Add Props for External Data

If you prefer passing data as props:

```tsx
interface DocumentsSidebarProps {
  // ... existing props
  recentDocuments?: RecentDocument[];
  recentActivity?: DocumentActivity[];
  documentAlerts?: DocumentAlert[];
}

export const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  recentDocuments: externalDocuments,
  recentActivity: externalActivity,
  documentAlerts: externalAlerts,
  // ... other props
}) => {
  const internalData = useSidebarData();

  const recentDocuments = externalDocuments ?? internalData.recentDocuments;
  const recentActivity = externalActivity ?? internalData.recentActivity;
  const documentAlerts = externalAlerts ?? internalData.documentAlerts;
  // ...
};
```

## Component Customization

### Styling

All components accept a `className` prop for custom styling:

```tsx
<QuickStatsCard stats={stats} className="shadow-lg rounded-xl" />
```

### Event Handlers

Components expose callback props for user interactions:

```tsx
<RecentDocumentsCard
  documents={docs}
  onRefresh={() => refetchDocuments()}
  onUpload={() => openUploadModal()}
  onFilter={() => openFilterPanel()}
/>
```

### Display Limits

Adjust how many items are displayed:

```tsx
<RecentDocumentsCard
  documents={allDocuments}
  maxDisplay={5} // Show only 5 most recent
/>
```

## Performance Considerations

### Memoization
- All formatters in `useSidebarFormatters` use `React.useCallback`
- Data in `useSidebarData` uses `React.useMemo`
- Icon lookups are memoized functions

### Scrollable Lists
- Fixed max-height containers with `overflow-y-auto`
- Prevents layout shifts when data changes
- Maintains sidebar height consistency

### Conditional Rendering
- Icons loaded on-demand via getter functions
- Only displayed documents are rendered (maxDisplay prop)
- Student names render conditionally

## Testing Recommendations

### Unit Tests
```tsx
// Test individual components
describe('QuickStatsCard', () => {
  it('displays correct statistics', () => {
    const stats = { recentUploads: 5, pendingReview: 2, encryptedDocs: 10, starredDocs: 3 };
    render(<QuickStatsCard stats={stats} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### Integration Tests
```tsx
// Test sidebar composition
describe('DocumentsSidebar', () => {
  it('renders all sections', () => {
    render(<DocumentsSidebar />);
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Document Alerts')).toBeInTheDocument();
    expect(screen.getByText('Recent Documents')).toBeInTheDocument();
  });
});
```

### Hook Tests
```tsx
// Test custom hooks
import { renderHook } from '@testing-library/react-hooks';

describe('useSidebarFormatters', () => {
  it('formats file size correctly', () => {
    const { result } = renderHook(() => useSidebarFormatters());
    expect(result.current.formatFileSize(2048)).toBe('2 KB');
  });
});
```

## Accessibility

All components follow accessibility best practices:
- Semantic HTML structure
- Proper heading hierarchy
- Icon descriptions via titles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly text

## Future Enhancements

Potential improvements for future iterations:

1. **Virtualized Lists**: For large datasets, implement virtual scrolling
2. **Real-time Updates**: WebSocket integration for live data
3. **Animations**: Framer Motion for smooth transitions
4. **Drag & Drop**: Direct file upload via drag-and-drop
5. **Filters**: Advanced filtering UI for documents
6. **Search**: Inline search within sidebar sections
7. **Collapsible Sections**: Accordion-style expandable cards
8. **Customizable Layout**: User preferences for section order
9. **Export**: Download reports from sidebar data
10. **Notifications**: Toast notifications for alerts

## Support

For questions or issues with these components, contact the frontend team or create an issue in the project repository.

---

**Last Updated**: 2025-11-04
**Refactored From**: Original 589-line DocumentsSidebar.tsx
**Component Count**: 6 cards + 2 hooks + 1 wrapper
**Total Lines**: 984 lines (well-organized and maintainable)
