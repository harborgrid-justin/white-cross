# Analytics Module - Quick Start Guide

## Navigation Routes

### Main Analytics Dashboard
```
/analytics
```
Overview of all analytics modules with quick stats and recent activity.

### Health Metrics
```
/analytics/health-metrics
```
Track vital signs: heart rate, blood pressure, temperature, weight, height, BMI.

### Medication Compliance
```
/analytics/medication-compliance
```
Monitor medication administration rates and identify compliance issues.

### Appointment Analytics
```
/analytics/appointment-analytics
```
Analyze appointment patterns, completion rates, and no-shows.

### Incident Trends
```
/analytics/incident-trends
```
Identify incident patterns by type and severity.

### Inventory Analytics
```
/analytics/inventory-analytics
```
Track medication inventory, low stock, and expiration dates.

### Custom Reports
```
/analytics/custom-reports           # List all reports
/analytics/custom-reports/new       # Create new report
/analytics/custom-reports/[id]      # View specific report
```

### Data Export
```
/analytics/export
```
Bulk export analytics data in CSV, Excel, PDF, or JSON format.

## Component Usage

### Import Components
```typescript
import {
  AnalyticsDashboard,
  HealthMetricsChart,
  MedicationComplianceChart,
  IncidentTrendChart,
  CustomReportBuilder,
  DataExporter,
} from '@/components/analytics';
```

### Use Chart Components
```typescript
// Health Metrics
<HealthMetricsChart
  data={healthData}
  metrics={['heartRate', 'bloodPressure']}
  chartType="line"
  title="Vital Signs Trends"
/>

// Medication Compliance
<MedicationComplianceChart
  data={{ administered: 842, missed: 48, pending: 23, total: 913 }}
  trendData={complianceTrend}
/>

// Incident Trends
<IncidentTrendChart
  data={incidentData}
  view="byType"
  chartType="area"
/>

// Data Exporter
<DataExporter
  data={exportData}
  filename="health-metrics"
  columns={[
    { key: 'date', header: 'Date' },
    { key: 'value', header: 'Value' }
  ]}
  pdfOptions={{
    title: 'Health Metrics Report',
    subtitle: 'January 2024'
  }}
/>
```

### Use Server Actions
```typescript
import {
  generateReport,
  getHealthMetrics,
  getMedicationCompliance,
  exportReport,
  createCustomReport,
} from '@/lib/actions/analytics.actions';

// Fetch health metrics
const result = await getHealthMetrics({
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  metricTypes: ['heartRate', 'bloodPressure'],
});

// Export report
const exportResult = await exportReport({
  reportId: 'uuid',
  format: 'pdf',
  includeMetadata: true,
});

// Create custom report
const createResult = await createCustomReport({
  name: 'Monthly Compliance Report',
  reportType: 'medication-compliance',
  filters: {
    dateRange: { start, end },
  },
  metrics: [
    { field: 'administered', aggregation: 'count', label: 'Administered' },
    { field: 'missed', aggregation: 'count', label: 'Missed' }
  ],
  chartType: 'bar',
  isPublic: false,
});
```

## Utility Functions

### Chart Utilities
```typescript
import {
  formatTimeSeriesData,
  calculatePiePercentages,
  calculateTrend,
  groupByTimePeriod,
  calculateMovingAverage,
} from '@/lib/analytics/charts';

// Format time series
const formatted = formatTimeSeriesData(data, 'day');

// Calculate trend
const trend = calculateTrend(current, previous);
// Returns: { current, previous, change, changePercent, trend: 'up' | 'down' | 'neutral' }

// Moving average
const withAverage = calculateMovingAverage(data, 7); // 7-day moving average
```

### Calculation Utilities
```typescript
import {
  calculateMedicationCompliance,
  aggregateHealthMetrics,
  analyzeIncidentTrends,
  calculateAppointmentMetrics,
  analyzeInventory,
  calculateMedian,
  calculateStandardDeviation,
} from '@/lib/analytics/calculations';

// Medication compliance
const compliance = calculateMedicationCompliance({
  administered: 842,
  missed: 48,
  total: 913,
});
// Returns: { complianceRate, status: 'excellent' | 'good' | 'fair' | 'poor', ... }

// Appointment metrics
const appointmentMetrics = calculateAppointmentMetrics(appointments);
// Returns: { total, completed, cancelled, noShow, completionRate, ... }

// Statistical functions
const median = calculateMedian([1, 2, 3, 4, 5]);
const stdDev = calculateStandardDeviation([1, 2, 3, 4, 5]);
```

### Export Utilities
```typescript
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportToJSON,
  prepareDataForExport,
} from '@/lib/analytics/export';

// Export to CSV
exportToCSV(data, 'report.csv', [
  { key: 'date', header: 'Date' },
  { key: 'value', header: 'Value' }
]);

// Export to PDF
exportToPDF({
  title: 'Health Metrics Report',
  subtitle: 'January 2024',
  columns: [
    { header: 'Date', dataKey: 'date' },
    { header: 'Value', dataKey: 'value' }
  ],
  data: reportData,
  footer: 'Confidential - White Cross Healthcare',
});

// Prepare data (sanitize, format)
const cleaned = prepareDataForExport(data, {
  excludeFields: ['id', 'internalCode'],
  formatDates: true,
  formatNumbers: true,
});
```

## Validation Schemas

### Use Schemas for Validation
```typescript
import {
  customReportConfigSchema,
  reportRequestSchema,
  exportRequestSchema,
  type CustomReportConfig,
  type ReportRequest,
} from '@/lib/validations/report.schemas';

// Validate custom report config
const validated = customReportConfigSchema.parse(reportData);

// Type-safe report request
const request: ReportRequest = {
  reportType: 'medication-compliance',
  filters: {
    dateRange: { start: new Date(), end: new Date() }
  },
  exportFormat: 'pdf',
  includeCharts: true,
};
```

## Chart Configuration

### Available Chart Colors
```typescript
import { CHART_COLORS, CHART_PALETTE } from '@/lib/analytics/charts';

// Single colors
CHART_COLORS.primary   // #3b82f6 (blue)
CHART_COLORS.success   // #10b981 (green)
CHART_COLORS.warning   // #f59e0b (orange)
CHART_COLORS.danger    // #ef4444 (red)

// Palette for multi-series
CHART_PALETTE // Array of 9 colors
```

### Chart Configuration Presets
```typescript
import {
  CHART_TOOLTIP_STYLE,
  DEFAULT_CHART_MARGIN,
  AXIS_CONFIG,
  GRID_CONFIG,
} from '@/lib/analytics/charts';
```

## Data Structures

### Health Metric
```typescript
interface HealthMetric {
  date: string;
  bloodPressure?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}
```

### Compliance Data
```typescript
interface ComplianceData {
  administered: number;
  missed: number;
  pending: number;
  total: number;
}
```

### Incident Data
```typescript
interface IncidentData {
  id: string;
  date: Date;
  type: string;
  severity: string;
  resolved: boolean;
}
```

## Best Practices

### 1. Error Handling
```typescript
const result = await getHealthMetrics({ ... });

if (!result.success) {
  toast.error(result.error || 'Failed to load metrics');
  return;
}

// Use result.data safely
const data = result.data;
```

### 2. Date Range Filtering
```typescript
const [dateRange, setDateRange] = useState({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});
```

### 3. Loading States
```typescript
const [isLoading, setIsLoading] = useState(true);

// In useEffect
setIsLoading(true);
try {
  // Fetch data
} finally {
  setIsLoading(false);
}
```

### 4. Export with Proper Options
```typescript
pdfOptions={{
  title: 'Report Title',
  subtitle: `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
  footer: 'Confidential - White Cross Healthcare',
}}
```

### 5. HIPAA Compliance
- Always include de-identification option
- Show compliance warnings on export
- Log all export operations
- Use secure transmission
- Implement access controls

## Common Patterns

### Fetch and Display Pattern
```typescript
useEffect(() => {
  loadData();
}, [dateRange]); // Re-fetch when date range changes

const loadData = async () => {
  setIsLoading(true);
  try {
    const result = await getHealthMetrics({ dateRange });
    if (result.success) {
      setData(result.data);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Export Pattern
```typescript
const [showExporter, setShowExporter] = useState(false);

// Toggle exporter
<button onClick={() => setShowExporter(!showExporter)}>
  Export
</button>

// Conditional render
{showExporter && (
  <DataExporter
    data={data}
    filename="report"
    pdfOptions={{ title: 'My Report' }}
  />
)}
```

### Chart Type Switcher Pattern
```typescript
const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

{(['line', 'bar', 'area'] as const).map((type) => (
  <button
    key={type}
    onClick={() => setChartType(type)}
    className={chartType === type ? 'active' : ''}
  >
    {type}
  </button>
))}

<MyChart chartType={chartType} data={data} />
```

## Troubleshooting

### Chart Not Rendering
- Ensure Recharts is installed: `npm install recharts`
- Check data format matches chart expectations
- Verify ResponsiveContainer has width/height

### Export Not Working
- Check jsPDF installation: `npm install jspdf`
- Verify data is not empty
- Check browser console for errors

### Type Errors
- Ensure all imports are from correct paths
- Verify Zod schemas are properly typed
- Check TypeScript version compatibility

## Additional Resources

- **Recharts Documentation**: https://recharts.org
- **jsPDF Documentation**: https://github.com/parallax/jsPDF
- **Zod Documentation**: https://zod.dev
- **HIPAA Compliance Guide**: Internal documentation

## Summary

This analytics module provides:
- ✅ 9 fully functional routes
- ✅ 6 reusable chart components
- ✅ 20+ server actions
- ✅ 4 export formats
- ✅ Custom report builder
- ✅ HIPAA-compliant exports
- ✅ Interactive dashboards
- ✅ Production-ready code

All components are type-safe, validated, and ready for production use.
