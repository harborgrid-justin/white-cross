# Reports & Analytics Quick Start Guide

## Overview

This guide provides quick examples for using the new reports and analytics infrastructure.

## Table of Contents

1. [Using Report Hooks](#using-report-hooks)
2. [Creating Charts](#creating-charts)
3. [Building Custom Reports](#building-custom-reports)
4. [Scheduling Reports](#scheduling-reports)
5. [Exporting Reports](#exporting-reports)
6. [Analytics Queries](#analytics-queries)

---

## Using Report Hooks

### Fetching Report Data

```typescript
import { useReportData } from '@/hooks/domains/reports';

function MyReportPage() {
  const { data, isLoading, updateFilters, updateDateRange } = useReportData({
    definition: {
      id: 'health-report-1',
      name: 'Health Metrics',
      type: 'health',
      dataSource: {
        type: 'api',
        endpoint: '/api/reports/data',
        method: 'GET'
      },
      columns: [
        { field: 'date', label: 'Date', type: 'date' },
        { field: 'visits', label: 'Visits', type: 'number' }
      ]
    },
    parameters: {
      dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
    }
  });

  // Update date range
  const handleDateChange = () => {
    updateDateRange({ startDate: '2025-02-01', endDate: '2025-02-28' });
  };

  return (
    <div>
      {isLoading ? 'Loading...' : JSON.stringify(data)}
    </div>
  );
}
```

---

## Creating Charts

### Multi-Series Line Chart

```typescript
import { MultiSeriesLineChart } from '@/components/ui/charts';

function TrendsChart() {
  return (
    <MultiSeriesLineChart
      config={{
        title: 'Health Trends',
        xAxis: { field: 'date', label: 'Date' },
        yAxis: { label: 'Count' },
        series: [
          { name: 'Visits', field: 'visits', color: '#3B82F6' },
          { name: 'Incidents', field: 'incidents', color: '#EF4444' }
        ],
        legend: { show: true, position: 'bottom' }
      }}
      data={[
        { date: '2025-01-01', visits: 45, incidents: 3 },
        { date: '2025-01-02', visits: 52, incidents: 5 },
        // ... more data
      ]}
      showBrush={true}
      showGrid={true}
    />
  );
}
```

### Gauge Chart

```typescript
import { GaugeChart } from '@/components/ui/charts';

function HealthScoreGauge() {
  return (
    <GaugeChart
      value={87.5}
      min={0}
      max={100}
      title="System Health"
      unit="%"
      size={200}
      colorZones={[
        { min: 0, max: 50, color: '#EF4444', label: 'Critical' },
        { min: 50, max: 75, color: '#F59E0B', label: 'Warning' },
        { min: 75, max: 100, color: '#10B981', label: 'Healthy' }
      ]}
      showValue={true}
      showMinMax={true}
    />
  );
}
```

### Heat Map Chart

```typescript
import { HeatMapChart } from '@/components/ui/charts';

function VisitPatternHeatMap() {
  return (
    <HeatMapChart
      title="Visit Patterns by Day and Hour"
      data={[
        { x: 'Monday', y: '8AM', value: 12 },
        { x: 'Monday', y: '9AM', value: 23 },
        { x: 'Tuesday', y: '8AM', value: 18 },
        // ... more data
      ]}
      colorScheme="blue"
      showValues={true}
      cellSize={60}
      onCellClick={(data) => console.log('Clicked:', data)}
    />
  );
}
```

### Funnel Chart

```typescript
import { FunnelChart } from '@/components/ui/charts';

function ConversionFunnel() {
  return (
    <FunnelChart
      title="Medication Administration Funnel"
      data={[
        { name: 'Scheduled', value: 1000 },
        { name: 'Student Present', value: 950 },
        { name: 'Consented', value: 920 },
        { name: 'Administered', value: 895 }
      ]}
      showPercentages={true}
      showValues={true}
      height={400}
      onStageClick={(stage, index) => console.log(`Stage ${index}:`, stage)}
    />
  );
}
```

---

## Building Custom Reports

### Navigation to Report Builder

```typescript
import { useRouter } from 'next/navigation';

function ReportsList() {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/reports/custom')}>
      Create Custom Report
    </button>
  );
}
```

### Using the Builder

The custom report builder provides a 5-step wizard:

1. **Data Source**: Select from students, health, medications, incidents, or appointments
2. **Fields**: Choose which columns to include
3. **Filters**: Add filter conditions
4. **Charts**: Select visualization types
5. **Preview**: Review and save

---

## Scheduling Reports

### Creating a Schedule

```typescript
import { useReportSchedules } from '@/hooks/domains/reports';

function ScheduleReport() {
  const { createSchedule, isLoading } = useReportSchedules();

  const handleSchedule = async () => {
    await createSchedule({
      definitionId: 'health-trends-report',
      name: 'Weekly Health Report',
      description: 'Automated weekly health metrics',
      frequency: {
        type: 'weekly',
        interval: 1,
        dayOfWeek: 1, // Monday
        time: '09:00'
      },
      delivery: {
        method: 'email',
        recipients: ['admin@school.edu', 'nurse@school.edu'],
        subject: 'Weekly Health Trends Report',
        attachFormat: 'pdf'
      },
      parameters: {
        dateRange: { period: 'last-7-days' },
        includeCharts: true
      },
      startDate: '2025-01-01',
      enabled: true
    });
  };

  return (
    <button onClick={handleSchedule} disabled={isLoading}>
      Schedule Weekly Report
    </button>
  );
}
```

### Managing Schedules

```typescript
function ManageSchedules() {
  const { schedules, toggleSchedule, deleteSchedule, runScheduleNow } = useReportSchedules();

  return (
    <div>
      {schedules.map((schedule) => (
        <div key={schedule.id}>
          <h3>{schedule.name}</h3>
          <p>Next run: {schedule.nextRun}</p>
          <button onClick={() => toggleSchedule(schedule.id, !schedule.enabled)}>
            {schedule.enabled ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => runScheduleNow(schedule.id)}>
            Run Now
          </button>
          <button onClick={() => deleteSchedule(schedule.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Exporting Reports

### Basic Export

```typescript
import { useReportExport } from '@/hooks/domains/reports';

function ExportButton({ reportId }: { reportId: string }) {
  const { exportReport, isExporting, progress } = useReportExport();

  const handleExport = async () => {
    await exportReport(reportId, {
      format: 'pdf',
      includeCharts: true,
      pageSize: 'letter',
      orientation: 'landscape',
      fileName: 'health-report.pdf'
    });
  };

  return (
    <div>
      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? `Exporting... ${progress.progress}%` : 'Export to PDF'}
      </button>
      {progress.status === 'error' && (
        <p className="text-red-600">{progress.message}</p>
      )}
    </div>
  );
}
```

### Multi-Format Export

```typescript
function ExportOptions({ reportId }: { reportId: string }) {
  const { exportReport } = useReportExport();

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' }
  ];

  return (
    <div>
      {formats.map((format) => (
        <button
          key={format.value}
          onClick={() => exportReport(reportId, { format: format.value as any })}
        >
          Export as {format.label}
        </button>
      ))}
    </div>
  );
}
```

### Bulk Export

```typescript
import { useBulkReportExport } from '@/hooks/domains/reports';

function BulkExport() {
  const { exportReports, isExporting, currentIndex, total, overallProgress } = useBulkReportExport();

  const handleBulkExport = async () => {
    await exportReports([
      { reportId: 'report-1', options: { format: 'pdf' } },
      { reportId: 'report-2', options: { format: 'excel' } },
      { reportId: 'report-3', options: { format: 'csv' } }
    ]);
  };

  return (
    <div>
      <button onClick={handleBulkExport} disabled={isExporting}>
        Export All Reports
      </button>
      {isExporting && (
        <p>
          Exporting {currentIndex + 1} of {total} ({overallProgress.toFixed(0)}%)
        </p>
      )}
    </div>
  );
}
```

---

## Analytics Queries

### Basic Analytics

```typescript
import { useAnalytics } from '@/hooks/domains/reports';

function HealthAnalytics() {
  const { data, isLoading, updateDateRange, updateGroupBy } = useAnalytics({
    type: 'health',
    dateRange: { period: 'last-30-days' },
    groupBy: 'daily',
    includeComparison: true
  });

  return (
    <div>
      {data?.summary && (
        <div>
          <p>Total: {data.summary.total}</p>
          <p>Average: {data.summary.average}</p>
          <p>Trend: {data.summary.trend}</p>
          <p>Change: {data.summary.percentageChange}%</p>
        </div>
      )}

      <select onChange={(e) => updateGroupBy(e.target.value as any)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
  );
}
```

### Multiple Analytics

```typescript
import { useMultipleAnalytics } from '@/hooks/domains/reports';

function Dashboard() {
  const { results, isLoading, refetchAll } = useMultipleAnalytics([
    {
      type: 'health',
      dateRange: { period: 'last-30-days' },
      groupBy: 'daily'
    },
    {
      type: 'medications',
      dateRange: { period: 'last-30-days' },
      groupBy: 'daily'
    },
    {
      type: 'incidents',
      dateRange: { period: 'last-30-days' },
      groupBy: 'daily'
    }
  ]);

  const [healthData, medicationData, incidentData] = results;

  return (
    <div>
      <button onClick={refetchAll}>Refresh All</button>
      <div>Health: {healthData.data?.summary?.total}</div>
      <div>Medications: {medicationData.data?.summary?.total}</div>
      <div>Incidents: {incidentData.data?.summary?.total}</div>
    </div>
  );
}
```

### Real-Time Analytics

```typescript
import { useRealtimeAnalytics } from '@/hooks/domains/reports';

function LiveDashboard() {
  const { data } = useRealtimeAnalytics(
    {
      type: 'health',
      dateRange: { period: 'today' },
      groupBy: 'hourly'
    },
    10000 // Refresh every 10 seconds
  );

  return (
    <div>
      <p>Live Health Metrics (auto-refreshing)</p>
      <p>Current: {data?.data[data.data.length - 1]?.value || 0}</p>
    </div>
  );
}
```

---

## Type Safety Examples

### Using Zod Schemas

```typescript
import {
  ReportDefinitionSchema,
  ChartConfigSchema,
  ReportParametersSchema
} from '@/types/schemas/reports.schema';

// Validate report definition
const validDefinition = ReportDefinitionSchema.parse({
  id: 'my-report',
  name: 'My Report',
  type: 'health',
  dataSource: {
    type: 'api',
    endpoint: '/api/reports/data'
  }
});

// Validate chart config
const validChart = ChartConfigSchema.parse({
  type: 'line',
  series: [
    { name: 'Series 1', field: 'value1' }
  ]
});

// Runtime validation catches errors
try {
  const invalid = ReportDefinitionSchema.parse({
    id: 'test',
    // Missing required fields
  });
} catch (error) {
  console.error('Validation failed:', error);
}
```

### TypeScript Type Inference

```typescript
import type {
  ReportDefinition,
  ChartConfig,
  ExportOptions
} from '@/types/schemas/reports.schema';

// Full type safety with autocomplete
const definition: ReportDefinition = {
  id: 'report-1',
  name: 'Health Report',
  type: 'health', // Autocomplete suggests valid types
  dataSource: {
    type: 'api',
    endpoint: '/api/data'
  },
  columns: [
    {
      field: 'date',
      label: 'Date',
      type: 'date', // Autocomplete suggests valid column types
      sortable: true
    }
  ]
};
```

---

## Common Patterns

### Loading States

```typescript
function ReportPage() {
  const { data, isLoading, isError, error } = useReportData(/* ... */);

  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return <div>{/* Render report */}</div>;
}
```

### Error Handling

```typescript
function ReportWithErrorHandling() {
  const { exportReport, error } = useReportExport();

  const handleExport = async () => {
    try {
      await exportReport('report-id', { format: 'pdf' });
    } catch (err) {
      console.error('Export failed:', err);
      // Show user-friendly error message
    }
  };

  return (
    <div>
      <button onClick={handleExport}>Export</button>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

### Pagination

```typescript
function PaginatedReport() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data } = useReportData({
    // ...
    parameters: {
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  });

  return (
    <div>
      {/* Render data */}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
```

---

## Best Practices

1. **Always validate data**: Use Zod schemas for runtime validation
2. **Handle loading states**: Show appropriate UI during data fetching
3. **Error handling**: Catch and display errors gracefully
4. **PHI compliance**: Never cache PHI data (useReportData handles this automatically)
5. **Performance**: Use memoization for expensive calculations
6. **Accessibility**: Ensure charts have proper labels and descriptions

---

## Troubleshooting

### Report not loading
- Check network tab for API errors
- Verify report definition is valid
- Ensure backend API endpoint exists

### Export fails
- Check file size limits
- Verify export format is supported
- Ensure user has proper permissions

### Charts not rendering
- Verify data format matches chart expectations
- Check console for errors
- Ensure required props are provided

---

## Additional Resources

- **Full Documentation**: See `REPORTS_IMPLEMENTATION_SUMMARY.md`
- **Deliverables**: See `REPORTS_DELIVERABLES.md`
- **Type Definitions**: See `src/types/schemas/reports.schema.ts`
- **Hook Implementation**: See `src/hooks/domains/reports/`
- **Chart Components**: See `src/components/ui/charts/`
