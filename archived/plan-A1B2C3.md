# Analytics API Refactoring Plan - A1B2C3

## Current Status
- **File**: `analyticsApi.ts`
- **Lines of Code**: 1,023 LOC
- **Threshold**: 300 LOC
- **Action Required**: YES - Refactor into domain-specific modules

## Refactoring Strategy

### Domain Breakdown

1. **Health Analytics** (`healthAnalytics.ts`) - ~150 LOC
   - `getHealthMetrics()`
   - `getHealthTrends()`
   - `getStudentHealthMetrics()`
   - `getSchoolHealthMetrics()`

2. **Incident Analytics** (`incidentAnalytics.ts`) - ~80 LOC
   - `getIncidentTrends()`
   - `getIncidentsByLocation()`

3. **Medication Analytics** (`medicationAnalytics.ts`) - ~100 LOC
   - `getMedicationUsage()`
   - `getMedicationAdherence()`

4. **Appointment Analytics** (`appointmentAnalytics.ts`) - ~100 LOC
   - `getAppointmentTrends()`
   - `getNoShowRate()`

5. **Dashboard Analytics** (`dashboardAnalytics.ts`) - ~150 LOC
   - `getNurseDashboard()`
   - `getAdminDashboard()`
   - `getSchoolDashboard()`

6. **Reports Analytics** (`reportsAnalytics.ts`) - ~250 LOC
   - `createCustomReport()`
   - `getReports()`
   - `getReport()`
   - `deleteReport()`
   - `scheduleReport()`
   - `updateReportSchedule()`
   - `deleteReportSchedule()`
   - `getReportSchedules()`

7. **Advanced Analytics** (`advancedAnalytics.ts`) - ~150 LOC
   - `subscribeToRealTimeUpdates()`
   - `exportReportData()`
   - `transformToChartData()`
   - `drillDown()`
   - `getForecast()`
   - `getSummary()`

8. **Cache Utilities** (`cacheUtils.ts`) - ~80 LOC
   - Cache management logic
   - Cache keys and TTL constants

### Module Structure

```
services/modules/analytics/
├── cacheUtils.ts           # Shared cache management
├── healthAnalytics.ts      # Health metrics and trends
├── incidentAnalytics.ts    # Incident analytics
├── medicationAnalytics.ts  # Medication analytics
├── appointmentAnalytics.ts # Appointment analytics
├── dashboardAnalytics.ts   # Dashboard data
├── reportsAnalytics.ts     # Custom reports
├── advancedAnalytics.ts    # Advanced features
└── index.ts                # Main aggregator and exports
```

### Import/Export Strategy

1. Each module exports its own class/functions
2. Shared types imported from `../types`
3. Shared cache utilities imported from `./cacheUtils`
4. Main `index.ts` aggregates all modules into unified API
5. No circular dependencies - unidirectional flow

## Implementation Timeline

- Phase 1: Create directory structure and cache utilities
- Phase 2: Extract health, incident, medication, appointment modules
- Phase 3: Extract dashboard and reports modules
- Phase 4: Extract advanced analytics
- Phase 5: Create main aggregator and update exports
- Phase 6: Verify imports/exports and test

## Success Criteria

- ✓ All modules < 300 LOC
- ✓ No circular dependencies
- ✓ All imports/exports properly updated
- ✓ Original functionality preserved
- ✓ Type safety maintained
