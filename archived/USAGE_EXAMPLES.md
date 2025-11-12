# Sidebar Components Usage Examples

This document provides practical usage examples for the refactored document sidebar components.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Individual Components](#individual-components)
3. [Custom Compositions](#custom-compositions)
4. [With Event Handlers](#with-event-handlers)
5. [API Integration](#api-integration)
6. [Testing Examples](#testing-examples)
7. [Advanced Patterns](#advanced-patterns)

---

## Basic Usage

### Default Sidebar (Easiest)

```tsx
import { DocumentsSidebar } from './_components/sidebar';

export default function DocumentsPage() {
  return (
    <div className="flex">
      <main className="flex-1">
        {/* Main content */}
      </main>
      <aside className="w-80">
        <DocumentsSidebar />
      </aside>
    </div>
  );
}
```

### With Custom Styling

```tsx
import { DocumentsSidebar } from './_components/sidebar';

<DocumentsSidebar className="w-96 bg-gray-50 p-4 rounded-lg shadow-lg" />
```

---

## Individual Components

### Using Just Quick Stats

```tsx
import { QuickStatsCard, useSidebarData } from './_components/sidebar';

export function DashboardHeader() {
  const { quickStats } = useSidebarData();

  return (
    <div className="grid grid-cols-4 gap-4">
      <QuickStatsCard stats={quickStats} />
    </div>
  );
}
```

### Using Only Alerts

```tsx
import { DocumentAlertsCard, useSidebarData } from './_components/sidebar';

export function AlertsPanel() {
  const { documentAlerts } = useSidebarData();

  const handleViewAllAlerts = () => {
    router.push('/documents/alerts');
  };

  return (
    <DocumentAlertsCard
      alerts={documentAlerts}
      onViewAllAlerts={handleViewAllAlerts}
    />
  );
}
```

### Recent Documents with Limit

```tsx
import { RecentDocumentsCard, useSidebarData } from './_components/sidebar';

export function RecentDocumentsWidget() {
  const { recentDocuments } = useSidebarData();

  return (
    <RecentDocumentsCard
      documents={recentDocuments}
      maxDisplay={5}  // Show only 5 most recent
      className="shadow-md"
    />
  );
}
```

---

## Custom Compositions

### Minimal Sidebar (Alerts + Actions Only)

```tsx
import {
  DocumentAlertsCard,
  QuickActionsCard,
  useSidebarData
} from './_components/sidebar';

export function MinimalDocumentSidebar() {
  const { documentAlerts } = useSidebarData();

  return (
    <div className="space-y-4">
      <DocumentAlertsCard alerts={documentAlerts} />
      <QuickActionsCard
        onUploadDocument={() => console.log('Upload')}
      />
    </div>
  );
}
```

### Dashboard Overview (Stats + Recent Activity)

```tsx
import {
  QuickStatsCard,
  RecentActivityCard,
  useSidebarData
} from './_components/sidebar';

export function DocumentsDashboard() {
  const { quickStats, recentActivity } = useSidebarData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickStatsCard stats={quickStats} />
      <RecentActivityCard
        activities={recentActivity}
        onViewActivityLog={() => router.push('/documents/activity')}
      />
    </div>
  );
}
```

### Two-Column Layout

```tsx
import {
  QuickStatsCard,
  DocumentAlertsCard,
  RecentDocumentsCard,
  RecentActivityCard,
  useSidebarData
} from './_components/sidebar';

export function DocumentsOverview() {
  const { quickStats, documentAlerts, recentDocuments, recentActivity } = useSidebarData();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left column */}
      <div className="space-y-4">
        <QuickStatsCard stats={quickStats} />
        <DocumentAlertsCard alerts={documentAlerts} />
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <RecentDocumentsCard documents={recentDocuments} />
        <RecentActivityCard activities={recentActivity} />
      </div>
    </div>
  );
}
```

---

## With Event Handlers

### Full Event Handler Integration

```tsx
import { DocumentsSidebar } from './_components/sidebar';
import { useDocumentActions } from '@/hooks/useDocumentActions';
import { useRouter } from 'next/navigation';

export function DocumentsPage() {
  const router = useRouter();
  const {
    uploadDocument,
    filterDocuments,
    createTemplate,
    bulkExport,
    archiveOldDocuments,
    reviewPermissions,
    scheduleCleanup
  } = useDocumentActions();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchDocuments();
    setIsRefreshing(false);
  };

  return (
    <DocumentsSidebar
      onUploadDocument={() => router.push('/documents/upload')}
      onFilter={() => router.push('/documents?filter=true')}
      onViewAllAlerts={() => router.push('/documents/alerts')}
      onViewActivityLog={() => router.push('/documents/activity')}
      onRefreshDocuments={handleRefresh}
      onCreateTemplate={createTemplate}
      onBulkExport={bulkExport}
      onArchiveDocuments={archiveOldDocuments}
      onReviewPermissions={reviewPermissions}
      onScheduleCleanup={scheduleCleanup}
    />
  );
}
```

### With Modal Integration

```tsx
import { DocumentsSidebar } from './_components/sidebar';
import { UploadModal } from '@/components/modals/UploadModal';
import { FilterModal } from '@/components/modals/FilterModal';

export function DocumentsPageWithModals() {
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [filterModalOpen, setFilterModalOpen] = React.useState(false);

  return (
    <>
      <DocumentsSidebar
        onUploadDocument={() => setUploadModalOpen(true)}
        onFilter={() => setFilterModalOpen(true)}
      />

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />
    </>
  );
}
```

---

## API Integration

### Replace Mock Data with Real API

```tsx
// hooks/useSidebarDataAPI.ts
import React from 'react';
import { SidebarData } from '../sidebar/sidebar.types';
import { fetchRecentDocuments, fetchRecentActivity, fetchDocumentAlerts } from '@/api/documents';

export const useSidebarDataAPI = (): SidebarData & { isLoading: boolean; error: Error | null } => {
  const [data, setData] = React.useState<SidebarData>({
    recentDocuments: [],
    recentActivity: [],
    documentAlerts: [],
    quickStats: { recentUploads: 0, pendingReview: 0, encryptedDocs: 0, starredDocs: 0 }
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [documents, activity, alerts] = await Promise.all([
          fetchRecentDocuments(),
          fetchRecentActivity(),
          fetchDocumentAlerts()
        ]);

        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const stats = {
          recentUploads: documents.filter(doc => new Date(doc.uploadedAt) >= dayAgo).length,
          pendingReview: documents.filter(doc => doc.status === 'pending_review').length,
          encryptedDocs: documents.filter(doc => doc.isEncrypted).length,
          starredDocs: documents.filter(doc => doc.isStarred).length
        };

        setData({
          recentDocuments: documents,
          recentActivity: activity,
          documentAlerts: alerts,
          quickStats: stats
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sidebar data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...data, isLoading, error };
};
```

### Using API Data in Sidebar

```tsx
import { useSidebarDataAPI } from '@/hooks/useSidebarDataAPI';
import { QuickStatsCard, RecentDocumentsCard } from './_components/sidebar';

export function ApiDocumentsSidebar() {
  const { quickStats, recentDocuments, isLoading, error } = useSidebarDataAPI();

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="space-y-4">
      <QuickStatsCard stats={quickStats} />
      <RecentDocumentsCard documents={recentDocuments} />
    </div>
  );
}
```

### With React Query

```tsx
// hooks/useSidebarDataQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSidebarData } from '@/api/documents';

export const useSidebarDataQuery = () => {
  return useQuery({
    queryKey: ['sidebarData'],
    queryFn: fetchSidebarData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Usage
import { useSidebarDataQuery } from '@/hooks/useSidebarDataQuery';
import { DocumentsSidebar } from './_components/sidebar';

export function QueryDocumentsSidebar() {
  const { data, isLoading, error, refetch } = useSidebarDataQuery();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <DocumentsSidebar
      {...data}
      onRefreshDocuments={() => refetch()}
    />
  );
}
```

---

## Testing Examples

### Unit Test: QuickStatsCard

```tsx
// __tests__/QuickStatsCard.test.tsx
import { render, screen } from '@testing-library/react';
import { QuickStatsCard } from '../QuickStatsCard';

describe('QuickStatsCard', () => {
  const mockStats = {
    recentUploads: 5,
    pendingReview: 2,
    encryptedDocs: 10,
    starredDocs: 3
  };

  it('renders all statistics correctly', () => {
    render(<QuickStatsCard stats={mockStats} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays correct labels', () => {
    render(<QuickStatsCard stats={mockStats} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Encrypted')).toBeInTheDocument();
    expect(screen.getByText('Starred')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <QuickStatsCard stats={mockStats} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### Unit Test: useSidebarFormatters Hook

```tsx
// __tests__/useSidebarFormatters.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useSidebarFormatters } from '../useSidebarFormatters';

describe('useSidebarFormatters', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      const { result } = renderHook(() => useSidebarFormatters());
      expect(result.current.formatFileSize(0)).toBe('0 Bytes');
      expect(result.current.formatFileSize(1024)).toBe('1 KB');
      expect(result.current.formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(result.current.formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats recent times correctly', () => {
      const { result } = renderHook(() => useSidebarFormatters());
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

      expect(result.current.formatRelativeTime(twoHoursAgo)).toBe('2h ago');
    });
  });

  describe('getSeverityColor', () => {
    it('returns correct color classes', () => {
      const { result } = renderHook(() => useSidebarFormatters());
      expect(result.current.getSeverityColor('low')).toBe('bg-gray-100 text-gray-800');
      expect(result.current.getSeverityColor('urgent')).toBe('bg-red-100 text-red-800');
    });
  });
});
```

### Integration Test: DocumentsSidebar

```tsx
// __tests__/DocumentsSidebar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentsSidebar } from '../DocumentsSidebar';

describe('DocumentsSidebar', () => {
  it('renders all section headings', () => {
    render(<DocumentsSidebar />);

    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Document Alerts')).toBeInTheDocument();
    expect(screen.getByText('Recent Documents')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('calls event handlers when buttons are clicked', () => {
    const handleUpload = jest.fn();
    const handleFilter = jest.fn();

    render(
      <DocumentsSidebar
        onUploadDocument={handleUpload}
        onFilter={handleFilter}
      />
    );

    fireEvent.click(screen.getAllByText(/Upload/i)[0]);
    expect(handleUpload).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Filter/i));
    expect(handleFilter).toHaveBeenCalledTimes(1);
  });

  it('displays documents from useSidebarData', () => {
    render(<DocumentsSidebar />);

    // Check for mock document titles
    expect(screen.getByText('Annual Medical Record')).toBeInTheDocument();
    expect(screen.getByText('COVID-19 Vaccination Record')).toBeInTheDocument();
  });
});
```

---

## Advanced Patterns

### Conditional Rendering Based on User Role

```tsx
import { DocumentsSidebar } from './_components/sidebar';
import { useUser } from '@/hooks/useUser';

export function RoleBasedDocumentsSidebar() {
  const { user } = useUser();

  // Only admins can schedule cleanup
  const handleScheduleCleanup = user?.role === 'admin'
    ? () => console.log('Schedule cleanup')
    : undefined;

  return (
    <DocumentsSidebar
      onScheduleCleanup={handleScheduleCleanup}
      onReviewPermissions={
        user?.role === 'admin' ? () => console.log('Review permissions') : undefined
      }
    />
  );
}
```

### With Animation (Framer Motion)

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentsSidebar } from './_components/sidebar';

export function AnimatedDocumentsSidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-80"
        >
          <DocumentsSidebar />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
```

### Virtualized Recent Documents (Large Lists)

```tsx
import { useVirtual } from 'react-virtual';
import { RecentDocumentsCard } from './_components/sidebar';

export function VirtualizedRecentDocuments() {
  const { recentDocuments } = useSidebarData();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: recentDocuments.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {/* Render document card */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Sidebar with Error Boundary

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { DocumentsSidebar } from './_components/sidebar';

function SidebarErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h3 className="text-red-800 font-semibold">Sidebar Error</h3>
      <p className="text-red-600 text-sm">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}

export function SafeDocumentsSidebar() {
  return (
    <ErrorBoundary FallbackComponent={SidebarErrorFallback}>
      <DocumentsSidebar />
    </ErrorBoundary>
  );
}
```

### Custom Hook for Sidebar State Management

```tsx
// hooks/useSidebarState.ts
import React from 'react';

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);
  const refresh = () => setRefreshKey(prev => prev + 1);

  return {
    isCollapsed,
    activeSection,
    refreshKey,
    toggleCollapse,
    setActiveSection,
    refresh
  };
};

// Usage
export function StatefulDocumentsSidebar() {
  const { isCollapsed, toggleCollapse, refresh } = useSidebarState();

  return (
    <div className={`transition-all ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <button onClick={toggleCollapse}>Toggle</button>
      <DocumentsSidebar onRefreshDocuments={refresh} />
    </div>
  );
}
```

---

## Best Practices

### Do's ✅

1. **Use named imports** for better tree-shaking
2. **Pass event handlers** for interactive elements
3. **Handle loading and error states** when fetching data
4. **Test components in isolation** with proper mocks
5. **Use TypeScript types** provided by the components
6. **Apply custom styling** via className prop
7. **Compose components** for custom layouts

### Don'ts ❌

1. **Don't modify component internals** - use props instead
2. **Don't bypass the useSidebarData hook** - extend it if needed
3. **Don't ignore TypeScript errors** - fix type mismatches
4. **Don't render all documents** - use maxDisplay prop for large lists
5. **Don't forget accessibility** - maintain semantic HTML
6. **Don't skip error boundaries** - wrap components for safety

---

## Support

For more examples or questions about these components:
- Check the main [README.md](./README.md)
- Review [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)
- See the component source code for implementation details

---

**Last Updated**: 2025-11-04
**Version**: 1.0.0
