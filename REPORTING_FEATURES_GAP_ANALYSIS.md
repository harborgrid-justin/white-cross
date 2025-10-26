# School Nurse SaaS - Reporting Features Gap Analysis
## Frontend Implementation Status

**Analysis Date**: 2025-10-26  
**Analysis Scope**: Very Thorough (All reporting-related components, services, types, and hooks examined)  
**Repository**: /home/user/white-cross/frontend  

---

## EXECUTIVE SUMMARY

### Overall Implementation Status
- **Feature 35 (Reporting Tools)**: 25% IMPLEMENTED
- **Feature 36 (On-Demand Health Reports)**: 20% IMPLEMENTED  
- **Feature 37 (Trend Analysis)**: 15% IMPLEMENTED

### Key Findings
1. **Comprehensive Type Definitions**: Extensive TypeScript types defined for all reporting domains
2. **API Service Layer**: Complete ReportsApi interface defined with 30+ endpoints
3. **Visualization Foundation**: Recharts library available with 5 chart component types
4. **Significant Implementation Gap**: Most components are stubs or placeholder UIs
5. **Critical Missing**: Query builder, PDF export library, outbreak detection, comparative analysis

---

## FEATURE 35: REPORTING TOOLS

### 35.1 Query Builder

**Status**: NOT IMPLEMENTED

**Evidence**:
- `/home/user/white-cross/frontend/src/pages/reports/components/FilterBuilder.tsx` - Stub (31 LOC)
- `/home/user/white-cross/frontend/src/pages/reports/components/AdvancedFilters.tsx` - Stub (31 LOC)
- `/home/user/white-cross/frontend/src/pages/reports/components/CustomReportBuilder.tsx` - Minimal stub (61 LOC, only placeholder text)

**What Exists**:
- Type definitions: `CustomReportFilters` interface with advanced filtering options
- API endpoints defined: `generateCustomReport()`, `getReportTemplates()`

**What's Missing**:
- Drag-and-drop field selector
- Visual query builder UI
- Filter condition builders (AND/OR logic)
- Aggregation function selection (COUNT, SUM, AVG, etc.)
- Grouping configuration interface
- Sort/order specification
- Real-time preview of query results
- Query validation and execution

**Priority**: CRITICAL - Core functionality for custom reporting

---

### 35.2 Visualization Charts

**Status**: PARTIALLY IMPLEMENTED (40% Complete)

**Evidence**:
- Chart Components Implemented:
  - `/home/user/white-cross/frontend/src/components/ui/charts/LineChart.tsx` - Full implementation (80+ LOC)
  - `/home/user/white-cross/frontend/src/components/ui/charts/BarChart.tsx` - Full implementation (80+ LOC)
  - `/home/user/white-cross/frontend/src/components/ui/charts/AreaChart.tsx` - Full implementation
  - `/home/user/white-cross/frontend/src/components/ui/charts/PieChart.tsx` - Full implementation
  - `/home/user/white-cross/frontend/src/components/ui/charts/DonutChart.tsx` - Full implementation
  
- Real Implementation Example:
  - `/home/user/white-cross/frontend/src/pages/incidents/components/TrendAnalysis.tsx` - Production-grade trend visualization using Recharts

**What Exists**:
- 5 reusable chart types with Recharts library (v3.3.0 in package.json)
- Responsive design, custom tooltips, legend support
- Dark mode support
- Multi-series data support
- Chart type enumeration: LINE, BAR, PIE, AREA, SCATTER, DONUT, HORIZONTAL_BAR, STACKED_BAR, RADAR

**What's Missing**:
- Chart type selector UI in reports interface
- Dashboard widget configuration for charts
- Drill-down/click-through capabilities
- Export chart as image (PNG, SVG)
- Interactive chart annotations
- Custom color palette selection
- Real-time chart updates from WebSocket data

**Priority**: HIGH - Foundation exists, needs integration

---

### 35.3 Scheduled Reports

**Status**: PARTIALLY IMPLEMENTED (35% Complete)

**Evidence**:
- UI Implementation:
  - `/home/user/white-cross/frontend/src/pages/reports/ScheduledReports.tsx` - Full UI (430+ LOC) with schedule table, statistics cards
  
- Redux State:
  - `/home/user/white-cross/frontend/src/pages/reports/store/reportsSlice.ts` - Redux slice for report management
  - Selector: `selectScheduledReports()` available

- API Endpoints Defined:
  - `getScheduledReports()` - Fetch all schedules
  - `scheduleReport()` - Create new schedule
  - `updateScheduleStatus()` - Toggle active/paused

**What Exists**:
- Schedule table with frequency display (DAILY, WEEKLY, MONTHLY)
- Status indicators (ACTIVE, PAUSED, ERROR)
- Schedule statistics cards (Total, Active, Paused, Next Due)
- Mock data showing 3 sample schedules
- Recipients list display
- Last/Next run timestamps
- Action buttons: Pause/Resume, Edit, Delete

**What's Missing**:
- Schedule form/modal for creating new schedules
- Cron expression builder or time picker UI
- Recipient email validation and management
- Schedule edit functionality (modal not implemented)
- Schedule deletion with confirmation
- Email notification configuration
- Schedule execution history
- Error handling and retry logic for failed schedules
- Timezone selection
- Template selection during scheduling

**Priority**: HIGH - UI 80% complete, needs backend integration and form dialogs

---

### 35.4 Export Formats

**Status**: PARTIALLY IMPLEMENTED (30% Complete)

**Evidence**:
- Format Support in UI:
  - `/home/user/white-cross/frontend/src/pages/reports/ReportsGenerate.tsx` - Format selection (PDF, CSV, XLSX) available
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportDialog.tsx` - Export dialog (62 LOC)
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportOptions.tsx` - Export options component

- Export Components:
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportFormats.tsx` - Stub
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportHistory.tsx` - Stub
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportDialog.tsx` - Dialog UI

- Print Functionality:
  - `/home/user/white-cross/frontend/src/pages/incidents/components/PrintIncidentReport.tsx` - Print-optimized layout (150+ LOC)

**What Exists**:
- Format selection UI: PDF, CSV, XLSX, JSON
- Print button functionality using browser `window.print()`
- Print CSS media queries for incident reports
- Mock export job creation
- Export file download simulation

**What's Missing**:
- **Critical**: No PDF generation library installed (jsPDF, html2pdf, pptx not in package.json)
- CSV export implementation with proper escaping
- Excel export with formatting and formulas
- JSON export with proper structure
- Chart-to-image export (SVG/PNG)
- Batch export multiple reports
- Export file naming conventions
- File size/progress indication
- Export job queue management
- Export history/audit trail
- Template-based export formatting
- HIPAA-compliant report footers/headers

**Priority**: CRITICAL - No actual PDF export capability exists

---

### 35.5 Share Reports

**Status**: NOT IMPLEMENTED

**Evidence**:
- `/home/user/white-cross/frontend/src/pages/reports/components/ReportSharing.tsx` - Stub (30 LOC, placeholder only)
- `/home/user/white-cross/frontend/src/pages/reports/components/SharedReports.tsx` - Stub (31 LOC)
- `/home/user/white-cross/frontend/src/pages/reports/components/SharingPermissions.tsx` - Stub (31 LOC)

**What Exists**:
- Types defined:
  - `ReportShareRequest` interface with recipients, message, expiryDays, allowDownload, requireAuthentication
  - `shareReport()` API endpoint defined in reportsApi

**What's Missing**:
- Complete sharing UI/form
- Recipient email input with validation
- Permission management (view only, download, delete)
- Share link generation with unique tokens
- Expiration date selection
- Anonymous/public link sharing
- Shared report list display
- Revoke share functionality
- Access log for shared reports
- Notification emails to recipients
- Password protection option
- Watermarking for shared PDFs

**Priority**: HIGH - Important for collaboration

---

## FEATURE 36: ON-DEMAND HEALTH REPORTS

### 36.1 Individual Summary

**Status**: PARTIALLY IMPLEMENTED (25% Complete)

**Evidence**:
- Type Definitions:
  - `/home/user/white-cross/frontend/src/types/reports.ts` - Comprehensive report types (1000+ LOC)
  - `HealthTrendsReport` interface with health record counts, chronic conditions, allergies
  - `DashboardMetrics` for real-time summary data

- Components:
  - `/home/user/white-cross/frontend/src/components/features/health-records/components/tabs/AnalyticsTab.tsx` - UI with statistics cards
  - `/home/user/white-cross/frontend/src/pages/health/components/HealthMetrics.tsx` - Stub

- API Methods:
  - `getHealthTrends()` - Full endpoint defined
  - `getDashboard()` - Real-time metrics endpoint

**What Exists**:
- Type system for health report data
- Statistics cards showing Total Students, Health Visits, Active Allergies, Compliance Rate
- API service layer with health trends endpoint
- Mock health metrics display in AnalyticsTab

**What's Missing**:
- Actual report generation UI/button
- Student health summary report template
- Formatting for professional presentation
- Print-ready layout
- School/district header and branding
- Data completeness indicators
- Data freshness timestamps
- Summary statistics (total visits, medications, incidents)
- Risk stratification
- Recommendations section
- Report date range selection
- Filter by grade/school selection in UI

**Priority**: HIGH - Core reporting feature

---

### 36.2 Comparative Analysis

**Status**: NOT IMPLEMENTED

**Evidence**:
- No components found for comparative reporting
- Comments in code indicate placeholder: "Would need historical comparison"
- Location: `/home/user/white-cross/frontend/src/hooks/domains/dashboard/queries/useStatisticsQueries.ts`

**What Exists**:
- Type definitions for date ranges and filtering
- API endpoints designed to support parameters
- Dashboard data structure includes period information

**What's Missing**:
- Completely missing UI and logic
- Year-over-year comparison views
- Month-over-month comparison
- School/grade level comparison
- Cohort analysis
- Before/after intervention analysis
- Period selector UI
- Comparison chart display (side-by-side, overlaid)
- Statistical significance indicators
- Delta/change calculations
- Variance analysis
- Benchmarking against state/national standards

**Priority**: MEDIUM - Advanced feature for trend analysis

---

### 36.3 Print/PDF Export

**Status**: PARTIALLY IMPLEMENTED (20% Complete)

**Evidence**:
- Print Implementation:
  - `/home/user/white-cross/frontend/src/pages/incidents/components/PrintIncidentReport.tsx` - Print-optimized layout (200+ LOC)
  - Uses browser `window.print()` with print CSS media queries

- Export Components Exist (stubs):
  - `/home/user/white-cross/frontend/src/pages/reports/components/ExportDialog.tsx`
  - ExportOptions, ExportFormats components

**What Exists**:
- Print CSS for incident reports with proper page breaks
- School branding section in print template
- Proper formatting for paper output
- Incident number and metadata display
- Witness and follow-up sections in print layout

**What's Missing**:
- **Critical**: No PDF generation library installed
- Health report print templates
- Medication report print templates
- Screening report print templates
- PDF generation from React components (needs jsPDF or html2pdf)
- Page size configuration (A4, Letter, Legal)
- Margin/orientation settings
- Multi-page report handling
- Header/footer with page numbers
- Table of contents generation
- Report branding/logo insertion
- Encryption/password protection
- Signature blocks for authorized personnel
- Barcode/QR code generation
- Watermarks for confidentiality

**Priority**: CRITICAL - PDF generation not implemented

---

### 36.4 Custom Metrics

**Status**: PARTIALLY IMPLEMENTED (20% Complete)

**Evidence**:
- Type System:
  - `/home/user/white-cross/frontend/src/types/reports.ts` - `CustomReportFilters`, `AggregationType` enums
  - Aggregation types: COUNT, SUM, AVG, MIN, MAX, MEDIAN, PERCENTILE

- Components:
  - `/home/user/white-cross/frontend/src/pages/reports/components/CustomReportBuilder.tsx` - Stub (61 LOC)
  - `/home/user/white-cross/frontend/src/pages/reports/components/CustomReports.tsx` - Stub (57 LOC)

- API Endpoints:
  - `generateCustomReport()` defined with CustomReportRequest parameter

**What Exists**:
- Type definitions for custom metrics and aggregations
- Aggregation function enums
- API endpoint structure for custom reports
- Filter support in type system

**What's Missing**:
- UI for metric selection
- Aggregation function selector
- Custom field mapping
- Metric naming and labeling
- Unit specification
- Threshold configuration
- Conditional metrics
- Formula builder (e.g., A/B ratio)
- Time-based calculations (rates, trends)
- Cohort-specific metrics
- Comparison metrics
- Distribution metrics
- Percentile calculations UI
- Metric validation and constraints

**Priority**: MEDIUM - Foundation exists, needs UI implementation

---

### 36.5 Change History

**Status**: NOT IMPLEMENTED

**Evidence**:
- Type defined: `ReportHistory` interface in `/home/user/white-cross/frontend/src/types/reports.ts`
- No UI components found for viewing change history
- No components for version tracking

**What Exists**:
- `ReportHistory` type definition with:
  - reportType, title, filters, format, fileUrl
  - fileSize, generatedBy, viewCount, downloadCount
  - lastAccessedAt timestamp

- API endpoint structure: `getReportHistory()` defined

**What's Missing**:
- Change history UI/viewer
- Version comparison view
- Audit trail of who accessed reports
- Modification timestamps and authors
- Rollback/restore previous version
- Diff view between versions
- Change annotations
- Historical data archive
- Data lineage tracking
- Sensitivity to changes in underlying data
- Report parameter change tracking

**Priority**: LOW - Advanced feature for compliance

---

## FEATURE 37: TREND ANALYSIS

### 37.1 Longitudinal Graphs

**Status**: NOT IMPLEMENTED (Framework exists)

**Evidence**:
- Partial Implementation:
  - `/home/user/white-cross/frontend/src/pages/incidents/components/TrendAnalysis.tsx` - Incident-specific trend line chart (180+ LOC)
  - Uses Recharts LineChart with severity breakdown

- Missing Health-Specific:
  - No longitudinal graphs for health metrics
  - No chronic condition trajectory visualization
  - No medication effectiveness over time

**What Exists**:
- TrendAnalysis component with:
  - Multi-series line chart (total, low, medium, high, critical)
  - Date range selection (default 30 days)
  - Custom tooltip formatting
  - TanStack Query integration
  - Responsive design

- Chart types available for longitudinal data:
  - LineChart, AreaChart with multiple series support

**What's Missing**:
- Health record longitudinal tracking UI
- Medication adherence trends
- Weight/BMI trajectory over school year
- Vaccination schedule tracking timeline
- Visit frequency trends
- Seasonal pattern visualization
- Cumulative metrics
- Forecasting/trend projection
- Anomaly detection on trends
- Confidence intervals
- Risk score trends
- Student-cohort comparison trends

**Priority**: MEDIUM - Framework exists, needs domain-specific implementations

---

### 37.2 Outbreak Spikes

**Status**: NOT IMPLEMENTED

**Evidence**:
- No search results for "outbreak", "epidemic", "spike", "surge"
- No alert components for health events
- Comments indicate not implemented: No outbreak-related files found

**What Exists**:
- Alert system framework: `SystemAlert` type with severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- Dashboard support for alerts
- Incident trend API endpoint

**What's Missing**:
- Completely missing implementation
- Outbreak detection algorithm/logic
- Spike threshold configuration
- Multi-metric outbreak rules (e.g., 5+ similar symptoms in 24 hours)
- Geographical clustering analysis
- Temporal pattern recognition
- Alert generation and notification
- Outbreak severity scoring
- Affected students list
- Incident correlation
- Contagion period estimation
- Recommended actions/guidelines
- Quarantine/isolation tracking
- Public health authority reporting

**Priority**: CRITICAL - Important for school safety and health compliance

---

### 37.3 Visit Patterns

**Status**: PARTIALLY IMPLEMENTED (30% Complete)

**Evidence**:
- Data Structure:
  - `/home/user/white-cross/frontend/src/types/reports.ts` - `StudentVisitCount` type defined
  - `AttendanceCorrelationReport` with health visits data
  - API endpoint: `getAttendanceCorrelation()` defined

- Components:
  - `/home/user/white-cross/frontend/src/components/features/health-records/components/tabs/VitalsTab.tsx` - Vitals history (200+ LOC)
  - Shows recent vitals list, latest vitals card, vital entry form

**What Exists**:
- VitalsTab with:
  - Vitals history table (temperature, BP, heart rate, etc.)
  - Latest vitals display
  - Normal range indicators (red/green status)
  - Quick vital entry form
  - Abnormal value alerts

- Type system for visit tracking
- API endpoints for visit correlation

**What's Missing**:
- Visit pattern visualization (heatmap, calendar view)
- Time-of-day pattern analysis
- Day-of-week patterns
- Seasonal/temporal patterns
- Frequency analysis by visit type
- Peak visit time identification
- Recurring visit patterns
- Student cohort patterns
- Appointment no-show patterns
- Follow-up visit tracking
- Appointment slot optimization recommendations
- Visit duration analysis
- Nurse utilization patterns
- Resource capacity planning views

**Priority**: MEDIUM - Data exists, needs visualization

---

### 37.4 Screening Pass Rates

**Status**: NOT IMPLEMENTED

**Evidence**:
- Components:
  - `/home/user/white-cross/frontend/src/pages/health/components/ScreeningResults.tsx` - Stub (31 LOC)
  - `/home/user/white-cross/frontend/src/pages/health/components/ScreeningList.tsx` - Stub
  - `/home/user/white-cross/frontend/src/pages/health/components/HearingScreening.tsx` - Stub
  - `/home/user/white-cross/frontend/src/pages/health/components/VisionScreening.tsx` - Stub

- No screening report components found
- No screening pass rate calculation
- No screening compliance reporting

**What Exists**:
- Screening types UI (HearingScreening, VisionScreening)
- ScreeningForm component structure
- API service: `/home/user/white-cross/frontend/src/services/modules/health/screeningsApi.ts`
- E2E test: `/home/user/white-cross/frontend/tests/e2e/immunizations/06-compliance-reporting.spec.ts`

**What's Missing**:
- Completely missing reporting/analysis
- Screening pass/fail rate calculation
- Screening compliance by school
- Vision screening pass rates (20/20 equivalent)
- Hearing screening pass rates (dB thresholds)
- Dental screening findings
- Immunization compliance rates
- Physical exam pass rates
- Scoliosis screening results
- Referral tracking
- Follow-up completion rates
- Screening date due reminders
- Grade/age-based screening requirements
- State mandate compliance verification
- Screening technician performance metrics
- Remediation tracking

**Priority**: CRITICAL - Required for school health compliance

---

### 37.5 Medication Trends

**Status**: PARTIALLY IMPLEMENTED (35% Complete)

**Evidence**:
- Components:
  - `/home/user/white-cross/frontend/src/pages/medications/components/AdherenceChart.tsx` - Stub (31 LOC)
  - `/home/user/white-cross/frontend/src/pages/medications/components/MedicationMetricsChart.tsx` - Exists
  - `/home/user/white-cross/frontend/src/pages/medications/components/ComplianceReport.tsx` - Component exists

- Types:
  - `MedicationUsageReport` with medication logs, compliance rates
  - `MedicationUsageData` with trends array
  - `TopMedication` with usage counts

- API Endpoints:
  - `getMedicationUsage()` - Full endpoint
  - `getMedicationCompliance()` - Endpoint for specific medications
  - `getMedicationEffectiveness()` - Effectiveness analysis

**What Exists**:
- Type system for medication trends
- API endpoints defined for usage/compliance
- Medication metrics card component structure
- Compliance Report component

**What's Missing**:
- Adherence trend visualization (AdherenceChart is stub)
- Medication usage over time graph
- Compliance rate trending
- Medication effectiveness trending
- Dosage pattern analysis
- Refill frequency patterns
- Side effect trend tracking
- Drug-drug interaction alerts
- Controlled substance tracking trends
- Cost/medication trends
- Student cohort medication patterns
- Prescription refill compliance
- Medication error trend analysis
- Adverse event tracking trends
- Compliance by medication type
- Seasonal medication usage patterns
- Nurse administration pattern analysis

**Priority**: HIGH - Important for medication safety and compliance

---

## SUMMARY TABLE

| Feature | Sub-Feature | Status | Completion | Priority |
|---------|-------------|--------|------------|----------|
| 35 - Reporting Tools | Query Builder | NOT IMPLEMENTED | 0% | CRITICAL |
| 35 - Reporting Tools | Visualization Charts | PARTIALLY | 40% | HIGH |
| 35 - Reporting Tools | Scheduled Reports | PARTIALLY | 35% | HIGH |
| 35 - Reporting Tools | Export Formats | PARTIALLY | 30% | CRITICAL |
| 35 - Reporting Tools | Share Reports | NOT IMPLEMENTED | 0% | HIGH |
| **Feature 35 Total** | | | **25%** | |
| 36 - Health Reports | Individual Summary | PARTIALLY | 25% | HIGH |
| 36 - Health Reports | Comparative Analysis | NOT IMPLEMENTED | 0% | MEDIUM |
| 36 - Health Reports | Print/PDF Export | PARTIALLY | 20% | CRITICAL |
| 36 - Health Reports | Custom Metrics | PARTIALLY | 20% | MEDIUM |
| 36 - Health Reports | Change History | NOT IMPLEMENTED | 0% | LOW |
| **Feature 36 Total** | | | **20%** | |
| 37 - Trend Analysis | Longitudinal Graphs | NOT IMPLEMENTED | 0%* | MEDIUM |
| 37 - Trend Analysis | Outbreak Spikes | NOT IMPLEMENTED | 0% | CRITICAL |
| 37 - Trend Analysis | Visit Patterns | PARTIALLY | 30% | MEDIUM |
| 37 - Trend Analysis | Screening Pass Rates | NOT IMPLEMENTED | 0% | CRITICAL |
| 37 - Trend Analysis | Medication Trends | PARTIALLY | 35% | HIGH |
| **Feature 37 Total** | | | **15%** | |

*Framework exists for incidents, needs health domain implementations

---

## IMPLEMENTATION PRIORITIES

### CRITICAL (Do First)
1. **Query Builder** - Essential for Feature 35, currently 0% implemented
2. **PDF Export Library** - Install jsPDF/html2pdf and implement PDF generation
3. **Outbreak Detection** - Health/safety critical feature
4. **Screening Pass Rates Reporting** - School compliance requirement
5. **Report Sharing** - Core collaboration feature

### HIGH (Do Next)
1. Complete Scheduled Reports form (80% UI exists, needs edit/create modals)
2. Implement Individual Health Summary reports
3. Complete Medication Trends visualization
4. Implement Visit Pattern analysis and visualization
5. Implement Comparative Analysis reports

### MEDIUM (Nice to Have)
1. Advanced filtering and custom metrics UI
2. Longitudinal graphs for health metrics (framework exists for incidents)
3. Change history/version tracking
4. Outbreak trend analysis and reporting

### LOW (Future)
1. Change history visualization and rollback
2. Advanced anomaly detection
3. Predictive trend forecasting

---

## TECHNICAL DEBT & BLOCKERS

### Missing Dependencies
- No PDF generation library (jsPDF, html2pdf, pptx)
- Recharts available but not fully integrated

### Architecture Issues
- Many components are stubs rather than removed/incomplete
- Redux/TanStack Query infrastructure exists but underutilized
- No actual backend integration points for report generation

### Frontend-Specific Issues
- Print functionality relies on browser printing, not server-side PDF
- No file download management
- Export job queue not implemented
- No progress indication for long-running reports

---

## RECOMMENDATIONS

### Phase 1: Stabilize Core Functionality (2-3 weeks)
1. Install PDF export library (jsPDF recommended)
2. Implement PDF generation for all report types
3. Complete Report Sharing feature
4. Implement Query Builder MVP with basic field selection

### Phase 2: Implement Health-Specific Reporting (3-4 weeks)
1. Individual Health Summary reports
2. Screening Pass Rates reporting
3. Outbreak Detection system
4. Comparative Analysis reports

### Phase 3: Complete Trend Analysis (2-3 weeks)
1. Longitudinal graphs for all health metrics
2. Medication trends visualization
3. Visit pattern analysis
4. Advanced filtering and custom metrics

### Phase 4: Polish & Optimization (1-2 weeks)
1. Report caching and performance
2. UI/UX refinement
3. Error handling and edge cases
4. Documentation and training

---

## FILE REFERENCE GUIDE

### Key Implementation Files

**Types & Interfaces**:
- `/home/user/white-cross/frontend/src/types/reports.ts` (1000+ LOC) - Comprehensive type definitions

**Report Components**:
- `/home/user/white-cross/frontend/src/pages/reports/ReportsGenerate.tsx` - Main report generation
- `/home/user/white-cross/frontend/src/pages/reports/ScheduledReports.tsx` - Schedule management
- `/home/user/white-cross/frontend/src/pages/reports/components/` - 60+ component stubs

**Services**:
- `/home/user/white-cross/frontend/src/services/modules/reportsApi.ts` (400+ LOC) - Complete API service

**Chart Components**:
- `/home/user/white-cross/frontend/src/components/ui/charts/` - 5 chart types (Line, Bar, Pie, Area, Donut)

**Health Components**:
- `/home/user/white-cross/frontend/src/components/features/health-records/components/tabs/` - 9 health tabs

**Redux State**:
- `/home/user/white-cross/frontend/src/stores/slices/reportsSlice.ts` - Report state management
- `/home/user/white-cross/frontend/src/pages/reports/store/reportsSlice.ts` - Page-specific reports state

**Hooks**:
- `/home/user/white-cross/frontend/src/hooks/domains/reports/queries/useReportsQueries.ts` - Report query hooks
- `/home/user/white-cross/frontend/src/hooks/domains/reports/mutations/useReportsMutations.ts` - Report mutations

