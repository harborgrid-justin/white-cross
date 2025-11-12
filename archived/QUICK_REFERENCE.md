# Reports Components - Quick Reference Guide

## Component Import Guide

```typescript
// Main coordinator
import { ReportsContent } from './_components/ReportsContent';

// Individual components
import { ReportsSummary } from './_components/ReportsSummary';
import { ReportTemplates } from './_components/ReportTemplates';
import { ReportHistory } from './_components/ReportHistory';
import { ReportActions } from './_components/ReportActions';

// Custom hook
import { useReportsList } from './_components/hooks/useReportsList';

// Types
import type {
  Report,
  ReportTemplate,
  ReportsSummary,
  ReportsSearchParams
} from './_components/types';

// Utilities
import {
  formatDate,
  formatNumber,
  getCategoryBadgeVariant,
  getStatusBadgeVariant
} from './_components/utils';
```

## Usage Examples

### Basic Usage (Main Component)

```typescript
// In your page component
export default function ReportsPage({
  searchParams
}: {
  searchParams: ReportsSearchParams;
}) {
  return <ReportsContent searchParams={searchParams} />;
}
```

### Using Individual Components

```typescript
import { useState } from 'react';
import {
  ReportsSummary,
  ReportTemplates,
  ReportHistory,
  ReportActions
} from './_components';

function CustomReportsView() {
  const [selected, setSelected] = useState(new Set());

  return (
    <div className="space-y-6">
      <ReportsSummary
        summary={{
          totalReports: 156,
          completedToday: 12,
          scheduledReports: 8,
          failedReports: 2,
          totalDownloads: 1247,
          avgProcessingTime: 4.2
        }}
      />

      <ReportHistory
        reports={reports}
        selectedReports={selected}
        onToggleSelection={(id) => {
          const newSet = new Set(selected);
          newSet.has(id) ? newSet.delete(id) : newSet.add(id);
          setSelected(newSet);
        }}
      />
    </div>
  );
}
```

### Using the Custom Hook

```typescript
import { useReportsList } from './_components/hooks/useReportsList';

function ReportsWithHook({ searchParams }) {
  const { summary, reports, templates, loading, error, refetch } =
    useReportsList(searchParams);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Total Reports: {summary?.totalReports}</h1>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>{report.title}</li>
        ))}
      </ul>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Using Utility Functions

```typescript
import { formatDate, formatNumber, getCategoryBadgeVariant } from './utils';

function ReportCard({ report }) {
  return (
    <div>
      <h3>{report.title}</h3>
      <Badge variant={getCategoryBadgeVariant(report.category)}>
        {report.category}
      </Badge>
      <p>Created: {formatDate(report.createdAt)}</p>
      <p>Downloads: {formatNumber(report.downloadCount)}</p>
    </div>
  );
}
```

## Component Props Reference

### ReportsContent

```typescript
interface ReportsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}
```

### ReportsSummary

```typescript
interface ReportsSummaryProps {
  summary: {
    totalReports: number;
    completedToday: number;
    scheduledReports: number;
    failedReports: number;
    totalDownloads: number;
    avgProcessingTime: number;
  };
  loading?: boolean;
}
```

### ReportTemplates

```typescript
interface ReportTemplatesProps {
  templates: ReportTemplate[];
  loading?: boolean;
  onTemplateSelect?: (templateId: string) => void;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  parameters: number;
  lastUsed?: string;
  useCount: number;
}
```

### ReportHistory

```typescript
interface ReportHistoryProps {
  reports: Report[];
  loading?: boolean;
  selectedReports: Set<string>;
  onToggleSelection: (reportId: string) => void;
  onRefresh?: () => void;
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: 'HEALTH' | 'COMPLIANCE' | 'OPERATIONAL' | 'FINANCIAL' | 'CUSTOM';
  type: 'SCHEDULED' | 'ON_DEMAND' | 'AUTOMATED';
  status: 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'FAILED' | 'DRAFT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
  department: string;
  size?: string;
  downloadCount: number;
  schedule?: string;
  nextRun?: string;
  recipients?: string[];
  tags: string[];
}
```

### ReportActions

```typescript
interface ReportActionsProps {
  selectedCount: number;
  onBulkDownload?: () => void;
  onBulkEmail?: () => void;
  onBulkDelete?: () => void;
}
```

## Utility Functions Reference

### Badge Variants

```typescript
// Get badge variant for report category
getCategoryBadgeVariant(category: ReportCategory): BadgeVariant;
// Returns: 'danger' | 'success' | 'info' | 'secondary' | 'warning' | 'default'

// Get badge variant for report status
getStatusBadgeVariant(status: ReportStatus): BadgeVariant;
// Returns: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'default'

// Get badge variant for report priority
getPriorityBadgeVariant(priority: ReportPriority): BadgeVariant;
// Returns: 'danger' | 'warning' | 'info' | 'secondary' | 'default'
```

### Formatting Functions

```typescript
// Format date to localized string
formatDate(dateString: string): string;
// Example: "Jan 15, 09:30 AM"

// Format number with thousand separators
formatNumber(num: number): string;
// Example: 1247 -> "1,247"

// Format file size from bytes
formatFileSize(bytes: number): string;
// Example: 2400000 -> "2.29 MB"

// Format duration in seconds
formatDuration(seconds: number): string;
// Example: 252 -> "4m"

// Get relative time string
getRelativeTime(dateString: string): string;
// Example: "2 hours ago"

// Pluralize word based on count
pluralize(count: number, singular: string, plural?: string): string;
// Example: pluralize(3, 'report') -> "reports"

// Truncate text to max length
truncateText(text: string, maxLength: number): string;
// Example: truncateText("Long text...", 20) -> "Long text..."
```

### Data Manipulation Functions

```typescript
// Sort reports by field
sortReports<T>(
  reports: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc'
): T[];

// Filter reports by search term
filterReportsBySearch<T>(reports: T[], searchTerm: string): T[];

// Group reports by field
groupReportsBy<T>(reports: T[], groupBy: keyof T): Record<string, T[]>;
```

## Custom Hook Reference

### useReportsList

```typescript
const {
  summary,      // ReportsSummary | null
  reports,      // Report[]
  templates,    // ReportTemplate[]
  loading,      // boolean
  error,        // Error | null
  refetch       // () => void
} = useReportsList(searchParams);
```

**Features**:
- Fetches reports, summary, and templates
- Applies search parameters (search, category, status, sort)
- Automatic filtering and sorting
- Error handling
- Loading states
- Manual refetch support

## Integration with Existing Hooks

### Report Export Hook

```typescript
import { useReportExport } from '@/hooks/domains/reports';

const { exportReport, isExporting, progress } = useReportExport();

// Export a report
await exportReport('report-id', {
  format: 'pdf',
  includeCharts: true,
  orientation: 'landscape'
});
```

### Report Scheduler Hook

```typescript
import { useReportScheduler } from '@/hooks/domains/reports';

const { scheduleReport } = useReportScheduler();

// Schedule a report
await scheduleReport({
  templateId: 'template-id',
  frequency: 'weekly',
  recipients: ['admin@school.edu']
});
```

## Common Patterns

### Bulk Selection Management

```typescript
const [selected, setSelected] = useState<Set<string>>(new Set());

const toggleSelection = (id: string) => {
  setSelected((prev) => {
    const newSet = new Set(prev);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    return newSet;
  });
};

const selectAll = (ids: string[]) => {
  setSelected(new Set(ids));
};

const clearSelection = () => {
  setSelected(new Set());
};
```

### Error Handling

```typescript
const { summary, reports, error } = useReportsList(searchParams);

if (error) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">Unable to load reports</p>
      <Button onClick={refetch}>Try Again</Button>
    </div>
  );
}
```

### Loading States

```typescript
const { loading } = useReportsList(searchParams);

if (loading) {
  return (
    <div className="space-y-6">
      <ReportsSummary summary={null} loading={true} />
      <ReportHistory reports={[]} loading={true} />
    </div>
  );
}
```

### Custom Filtering

```typescript
import { filterReportsBySearch, sortReports } from './utils';

const filteredReports = useMemo(() => {
  let filtered = filterReportsBySearch(reports, searchTerm);
  filtered = sortReports(filtered, 'createdAt', 'desc');
  return filtered;
}, [reports, searchTerm]);
```

## Styling Guidelines

### Tailwind Classes Used

- **Layout**: `space-y-6`, `grid`, `md:grid-cols-2`, `lg:grid-cols-4`
- **Spacing**: `p-6`, `px-6`, `py-4`, `gap-4`, `gap-2`
- **Typography**: `text-2xl`, `font-bold`, `text-gray-900`, `text-sm`
- **Colors**: `bg-blue-100`, `text-blue-600`, `border-gray-200`
- **Effects**: `hover:shadow-sm`, `transition-all`, `rounded-lg`

### Custom Styling

```typescript
// Add custom classes to components
<ReportsSummary
  summary={summary}
  className="custom-summary-styles"
/>

// Override card styles
<Card className="shadow-lg border-2">
  {/* content */}
</Card>
```

## Testing Examples

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { ReportsSummary } from './ReportsSummary';

test('renders summary statistics', () => {
  const summary = {
    totalReports: 156,
    completedToday: 12,
    scheduledReports: 8,
    failedReports: 2,
    totalDownloads: 1247,
    avgProcessingTime: 4.2
  };

  render(<ReportsSummary summary={summary} />);

  expect(screen.getByText('156')).toBeInTheDocument();
  expect(screen.getByText('Total Reports')).toBeInTheDocument();
});
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useReportsList } from './hooks/useReportsList';

test('fetches reports data', async () => {
  const { result } = renderHook(() => useReportsList({}));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.reports).toHaveLength(6);
  expect(result.current.summary).toBeDefined();
});
```

## Troubleshooting

### Common Issues

**Issue**: Components not rendering
- Check import paths are correct
- Verify props are passed correctly
- Check for TypeScript errors

**Issue**: Hook not fetching data
- Verify searchParams are passed
- Check console for API errors
- Ensure mock data is present

**Issue**: Styling not applied
- Verify Tailwind classes are valid
- Check for CSS conflicts
- Ensure Card/Button components are imported

**Issue**: Type errors
- Import types from `./types`
- Verify interface matches props
- Check for missing required props

## Performance Tips

1. **Memoize expensive calculations**
```typescript
const filteredReports = useMemo(
  () => filterReportsBySearch(reports, search),
  [reports, search]
);
```

2. **Use callback for event handlers**
```typescript
const handleClick = useCallback((id: string) => {
  // handler logic
}, [dependencies]);
```

3. **Lazy load components**
```typescript
const ReportViewer = lazy(() => import('./ReportViewer'));
```

4. **Virtualize large lists**
```typescript
import { FixedSizeList } from 'react-window';
```

## Next Steps

1. Replace mock data with real API calls in `useReportsList`
2. Add error boundaries around components
3. Implement React Suspense for loading states
4. Create unit tests for all components
5. Add Storybook stories for visual testing
6. Integrate with existing hooks (export, scheduler)
7. Add advanced filtering component
8. Create report viewer component
