# Incidents Layout & Utility Components - Usage Guide

This guide demonstrates how to use the 6 production-grade layout and utility components for the incidents module.

## Components Overview

### 1. IncidentsLayout
Main layout wrapper with optional header and sidebar support.

### 2. IncidentsSidebar
Sidebar with quick filters, saved searches, recent incidents, and statistics.

### 3. IncidentsHeader
Page header with title, actions, search bar, and breadcrumbs.

### 4. IncidentBreadcrumbs
Breadcrumb navigation for hierarchical page structure.

### 5. EmptyState
Empty state placeholder with multiple variants and action buttons.

### 6. LoadingSpinner
Loading state component with spinner and optional overlay mode.

---

## Complete Page Example

```tsx
import React, { useState } from 'react';
import {
  IncidentsLayout,
  IncidentsSidebar,
  IncidentsHeader,
  IncidentBreadcrumbs,
  EmptyState,
  LoadingSpinner
} from '@/pages/incidents/components';
import { Button } from '@/components/ui/buttons/Button';
import { Plus, Download } from 'lucide-react';

const IncidentsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for sidebar
  const sidebarData = {
    savedSearches: [
      { id: '1', name: 'My Incidents', count: 5 },
      { id: '2', name: 'Unassigned', count: 12 },
      { id: '3', name: 'Critical Priority', count: 3 }
    ],
    recentIncidents: [
      {
        id: '1',
        title: 'Student slip and fall in cafeteria',
        severity: 'high' as const,
        timestamp: '2025-10-25T10:00:00Z'
      },
      {
        id: '2',
        title: 'Minor allergic reaction during lunch',
        severity: 'medium' as const,
        timestamp: '2025-10-25T09:30:00Z'
      },
      {
        id: '3',
        title: 'Playground equipment malfunction',
        severity: 'critical' as const,
        timestamp: '2025-10-25T08:45:00Z'
      }
    ],
    statistics: {
      total: 150,
      critical: 5,
      high: 20,
      medium: 75,
      low: 50,
      open: 80,
      closed: 70
    }
  };

  const handleQuickFilter = (filter: string) => {
    console.log('Quick filter clicked:', filter);
    // Apply filter logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleCreateIncident = () => {
    // Open create incident modal
    console.log('Create incident clicked');
  };

  const handleExport = () => {
    // Export incidents logic
    console.log('Export clicked');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    // Clear all filters
  };

  return (
    <IncidentsLayout
      showSidebar={true}
      header={
        <IncidentsHeader
          title="Incident Reports"
          description="View and manage all incident reports across your organization"
          showSearch={true}
          showBreadcrumbs={true}
          searchPlaceholder="Search incidents by student, type, or keywords..."
          onSearch={handleSearch}
          actions={
            <>
              <Button variant="secondary" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="primary" onClick={handleCreateIncident}>
                <Plus className="h-4 w-4 mr-2" />
                Create Incident
              </Button>
            </>
          }
        />
      }
      sidebar={
        <IncidentsSidebar
          onQuickFilterClick={handleQuickFilter}
          savedSearches={sidebarData.savedSearches}
          recentIncidents={sidebarData.recentIncidents}
          statistics={sidebarData.statistics}
        />
      }
    >
      {loading ? (
        <LoadingSpinner
          size="lg"
          message="Loading incident reports..."
        />
      ) : incidents.length === 0 ? (
        <EmptyState
          variant="no-results"
          title="No incidents found"
          description="Try adjusting your search or filter criteria to find incidents"
          primaryAction={{
            label: 'Clear Filters',
            onClick: handleClearFilters,
            icon: Plus
          }}
          secondaryAction={{
            label: 'Create New Incident',
            onClick: handleCreateIncident,
            icon: Plus,
            variant: 'outline'
          }}
        />
      ) : (
        <div>
          {/* Your incident list components here */}
          <p>Incident list goes here</p>
        </div>
      )}
    </IncidentsLayout>
  );
};

export default IncidentsPage;
```

---

## Individual Component Examples

### IncidentsLayout

```tsx
// Full layout with sidebar
<IncidentsLayout
  showSidebar={true}
  header={<IncidentsHeader title="Incidents" />}
  sidebar={<IncidentsSidebar />}
>
  <YourContent />
</IncidentsLayout>

// Simple layout without sidebar
<IncidentsLayout
  header={<IncidentsHeader title="Incident Details" />}
>
  <IncidentDetails />
</IncidentsLayout>

// Custom styling
<IncidentsLayout
  className="custom-layout"
  contentClassName="p-8"
  showSidebar={false}
>
  <YourContent />
</IncidentsLayout>
```

### IncidentsSidebar

```tsx
// Full sidebar with all features
<IncidentsSidebar
  onQuickFilterClick={(filter) => handleFilter(filter)}
  savedSearches={[
    { id: '1', name: 'My Incidents', count: 5 },
    { id: '2', name: 'Unassigned', count: 12 }
  ]}
  recentIncidents={[
    {
      id: '1',
      title: 'Student injury',
      severity: 'high',
      timestamp: '2025-10-25T10:00:00Z'
    }
  ]}
  statistics={{
    total: 150,
    critical: 5,
    high: 20,
    medium: 75,
    low: 50,
    open: 80,
    closed: 70
  }}
/>

// Minimal sidebar (only quick filters)
<IncidentsSidebar
  onQuickFilterClick={(filter) => handleFilter(filter)}
/>
```

### IncidentsHeader

```tsx
// Full header with all features
<IncidentsHeader
  title="Incident Reports"
  description="Manage all incidents"
  showSearch={true}
  showBreadcrumbs={true}
  searchPlaceholder="Search..."
  onSearch={(query) => handleSearch(query)}
  actions={
    <>
      <Button variant="secondary">Export</Button>
      <Button variant="primary">Create</Button>
    </>
  }
/>

// Simple header
<IncidentsHeader
  title="Incident Details"
  showBreadcrumbs={true}
/>

// Header with search only
<IncidentsHeader
  title="Search Incidents"
  showSearch={true}
  onSearch={(query) => handleSearch(query)}
/>
```

### IncidentBreadcrumbs

```tsx
// Default breadcrumbs (Home > Incidents)
<IncidentBreadcrumbs />

// Custom breadcrumbs
<IncidentBreadcrumbs
  items={[
    { label: 'Home', path: '/' },
    { label: 'Incidents', path: '/incidents' },
    { label: 'Incident #123', path: '/incidents/123', isActive: true }
  ]}
/>

// With truncation
<IncidentBreadcrumbs
  items={longBreadcrumbList}
  maxItems={3}
/>
```

### EmptyState

```tsx
// No data variant
<EmptyState
  variant="no-data"
  title="No incidents found"
  description="Get started by creating your first incident report"
/>

// No results with actions
<EmptyState
  variant="no-results"
  title="No incidents found"
  description="Try adjusting your search criteria"
  primaryAction={{
    label: 'Clear Filters',
    onClick: () => clearFilters(),
    icon: Filter
  }}
  secondaryAction={{
    label: 'Create New',
    onClick: () => openModal(),
    icon: Plus,
    variant: 'outline'
  }}
/>

// No permissions
<EmptyState
  variant="no-permissions"
  title="Access Denied"
  description="You don't have permission to view incidents"
  size="lg"
/>

// Error state
<EmptyState
  variant="error"
  title="Failed to load incidents"
  description="An error occurred while loading incident data"
  primaryAction={{
    label: 'Retry',
    onClick: () => retry()
  }}
/>

// Filtered results
<EmptyState
  variant="filtered"
  title="No incidents match your filters"
  description="Try adjusting or clearing your filters"
  primaryAction={{
    label: 'Clear All Filters',
    onClick: () => clearAll()
  }}
/>
```

### LoadingSpinner

```tsx
// Inline spinner with message
<LoadingSpinner
  size="md"
  message="Loading incidents..."
/>

// Small inline spinner
<LoadingSpinner size="sm" />

// Large spinner
<LoadingSpinner
  size="lg"
  message="Processing..."
/>

// Full-screen overlay
<LoadingSpinner
  size="xl"
  message="Loading incident details..."
  overlay={true}
/>

// Custom styling
<LoadingSpinner
  size="md"
  message="Please wait..."
  className="my-8"
/>
```

---

## Common Patterns

### Loading State Pattern

```tsx
const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  return (
    <IncidentsLayout>
      {loading ? (
        <LoadingSpinner size="lg" message="Loading..." />
      ) : data.length === 0 ? (
        <EmptyState variant="no-data" title="No data" />
      ) : (
        <DataList data={data} />
      )}
    </IncidentsLayout>
  );
};
```

### Error Handling Pattern

```tsx
const MyComponent = () => {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Something went wrong"
        description={error}
        primaryAction={{
          label: 'Retry',
          onClick: () => retry()
        }}
      />
    );
  }

  return <YourContent />;
};
```

### Search and Filter Pattern

```tsx
const MyComponent = () => {
  const [filtered, setFiltered] = useState([]);
  const [hasFilters, setHasFilters] = useState(false);

  return (
    <>
      {filtered.length === 0 && hasFilters ? (
        <EmptyState
          variant="filtered"
          title="No results"
          description="Try different filters"
          primaryAction={{
            label: 'Clear Filters',
            onClick: () => clearFilters()
          }}
        />
      ) : (
        <ResultsList data={filtered} />
      )}
    </>
  );
};
```

---

## Component Composition

### Detail Page Example

```tsx
const IncidentDetailPage = ({ id }: { id: string }) => {
  return (
    <IncidentsLayout
      header={
        <IncidentsHeader
          title={`Incident #${id}`}
          actions={
            <>
              <Button variant="secondary">Edit</Button>
              <Button variant="secondary">Print</Button>
              <Button variant="danger">Delete</Button>
            </>
          }
        />
      }
    >
      <IncidentDetails id={id} />
    </IncidentsLayout>
  );
};
```

### List Page with Sidebar

```tsx
const IncidentsListPage = () => {
  return (
    <IncidentsLayout
      showSidebar={true}
      header={
        <IncidentsHeader
          title="All Incidents"
          showSearch={true}
          onSearch={handleSearch}
        />
      }
      sidebar={
        <IncidentsSidebar
          statistics={stats}
          recentIncidents={recent}
        />
      }
    >
      <IncidentsList />
    </IncidentsLayout>
  );
};
```

---

## Accessibility Features

All components include:
- Proper ARIA labels
- Semantic HTML
- Keyboard navigation support
- Screen reader support
- Focus management

## Dark Mode Support

All components fully support dark mode using Tailwind's dark mode utilities.

## Responsive Design

All components are fully responsive:
- Mobile: Stacked layouts, full-width sidebar
- Tablet: Transitional layouts
- Desktop: Side-by-side layouts, fixed sidebar width

---

## TypeScript Support

All components are fully typed with comprehensive TypeScript interfaces:

```typescript
import type {
  IncidentsLayoutProps,
  IncidentsSidebarProps,
  IncidentsHeaderProps,
  IncidentBreadcrumbsProps,
  BreadcrumbItem,
  EmptyStateProps,
  EmptyStateAction,
  LoadingSpinnerProps,
  SavedSearch,
  RecentIncident,
  IncidentStats
} from '@/pages/incidents/components';
```
