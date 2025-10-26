/**
 * HealthDashboard - Comprehensive Health Monitoring Dashboard
 *
 * Central command center for school health operations providing real-time visibility
 * into student health status, immunization compliance, scheduled screenings, critical
 * alerts, and health trends analysis.
 *
 * **Features:**
 * - Real-time health statistics overview (total students, immunization rates, pending screenings, critical alerts)
 * - Interactive health trends charts (visits, screenings, incidents over time)
 * - Immunization status visualization with compliance tracking
 * - Chronic condition distribution analysis
 * - Vaccination campaign progress monitoring
 * - Critical health alerts with action buttons
 * - Recent activity feed for health record changes
 * - Upcoming screening schedule overview
 * - Allergy and emergency contact status
 *
 * **Dashboard Widgets:**
 * - **Stats Widgets**: Key metrics with trend indicators
 * - **Chart Widgets**: Line, bar, pie, and donut charts for data visualization
 * - **Progress Widgets**: Vaccination campaign completion tracking
 * - **Alerts Widget**: Critical health alerts requiring immediate attention
 * - **Activity Feed**: Recent health record modifications
 * - **Quick Actions**: Common tasks accessible from dashboard
 *
 * **Data Sources:**
 * - Health records database (allergies, conditions, vaccinations, vital signs)
 * - Screening schedule system
 * - Immunization compliance tracking
 * - Incident reporting system
 * - Emergency contact database
 *
 * **Interactivity:**
 * - Time range selection for trend charts (7d, 30d, 90d, 1y)
 * - Export functionality for charts and reports
 * - Refresh buttons for real-time data updates
 * - Alert dismissal and action routing
 * - Widget collapsing for focused view
 *
 * @fileoverview Main dashboard for health records monitoring
 * @module pages/health/HealthDashboard
 * @version 2.0.0
 *
 * @component
 * @returns {React.FC} Health monitoring dashboard component
 *
 * @example
 * ```tsx
 * import HealthDashboard from './pages/health/HealthDashboard';
 *
 * function App() {
 *   return <HealthDashboard />;
 * }
 * ```
 *
 * @remarks
 * **HIPAA Compliance**: Dashboard displays aggregated health data that may be PHI.
 * Individual student identification is minimized. Access requires appropriate healthcare role.
 *
 * **Real-time Updates**: Consider implementing WebSocket or Server-Sent Events for
 * real-time dashboard updates of critical alerts and statistics.
 *
 * **Performance**: Dashboard loads multiple datasets. Implement data aggregation at
 * the API level and use React Query caching to optimize performance.
 *
 * **Mock Data**: Current implementation uses mock data for demonstration. Replace
 * mock* constants with actual API calls before production deployment.
 *
 * **Critical Alerts**: Life-threatening allergies, missing immunizations, and failed
 * screenings requiring referrals display as critical alerts with immediate action buttons.
 *
 * **Immunization Compliance**: Tracks vaccination status against state requirements.
 * Generates compliance percentage for school enrollment verification.
 *
 * **Growth Tracking**: BMI calculations follow CDC growth chart standards. Flags
 * abnormal growth patterns for nurse review and parent notification.
 *
 * **Screening Outcomes**: Failed screenings automatically generate follow-up tasks
 * and parent notification requirements.
 *
 * **Emergency Preparedness**: Dashboard highlights students with critical medical
 * conditions requiring emergency action plans and staff training.
 *
 * **Accessibility**: All charts and widgets include ARIA labels and keyboard navigation.
 * Color-blind friendly palettes used for data visualization.
 *
 * @see {@link DashboardGrid} for responsive grid layout
 * @see {@link ChartWidget} for chart components
 * @see {@link AlertsWidget} for critical alerts display
 * @since 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { Activity, Heart, Shield, AlertCircle, TrendingUp } from 'lucide-react';

// Chart Components
import {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  LineChartSeries,
  PieChartDataPoint
} from '../../components/ui/charts';

// Widget Components
import {
  DashboardGrid,
  DashboardCard,
  ChartWidget,
  ActivityFeedWidget,
  AlertsWidget,
  ProgressWidget,
  QuickActionsWidget,
  ActivityItem,
  Alert,
  ProgressItem,
  QuickAction,
  TimeRange
} from '../../components/features/dashboard';

// UI Components
import { StatsWidget } from '../dashboard/components/StatsWidget';

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockHealthStats = [
  {
    id: 'total-students',
    title: 'Total Students',
    value: '2,847',
    icon: <Activity className="w-6 h-6" />,
    color: 'blue' as const,
    trend: <span className="text-green-600">+12%</span>
  },
  {
    id: 'immunized',
    title: 'Fully Immunized',
    value: '2,654',
    icon: <Shield className="w-6 h-6" />,
    color: 'green' as const,
    trend: <span className="text-green-600">93.2%</span>
  },
  {
    id: 'pending-screenings',
    title: 'Pending Screenings',
    value: '156',
    icon: <Heart className="w-6 h-6" />,
    color: 'orange' as const,
    trend: <span className="text-orange-600">-8%</span>
  },
  {
    id: 'critical-alerts',
    title: 'Critical Alerts',
    value: '3',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'red' as const,
    trend: <span className="text-red-600">Immediate</span>
  }
];

const mockHealthTrendsData = [
  { month: 'Jan', visits: 245, screenings: 189, incidents: 12 },
  { month: 'Feb', visits: 278, screenings: 234, incidents: 18 },
  { month: 'Mar', visits: 312, screenings: 267, incidents: 15 },
  { month: 'Apr', visits: 290, screenings: 245, incidents: 10 },
  { month: 'May', visits: 334, screenings: 289, incidents: 14 },
  { month: 'Jun', visits: 298, screenings: 256, incidents: 9 }
];

const mockImmunizationData: PieChartDataPoint[] = [
  { name: 'Fully Immunized', value: 2654, color: '#10b981' },
  { name: 'Partially Immunized', value: 143, color: '#f59e0b' },
  { name: 'Not Immunized', value: 50, color: '#ef4444' }
];

const mockChronicConditionsData = [
  { condition: 'Asthma', count: 234 },
  { condition: 'Allergies', count: 456 },
  { condition: 'Diabetes', count: 67 },
  { condition: 'ADHD', count: 123 },
  { condition: 'Other', count: 89 }
];

const mockHealthAlerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Missing Immunization Records',
    message: '3 students require immediate immunization updates',
    timestamp: new Date(),
    dismissible: true,
    actionLabel: 'View Students',
    onAction: () => console.log('View students')
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Upcoming Flu Season',
    message: 'Schedule flu vaccination campaign for 856 students',
    timestamp: new Date(Date.now() - 3600000),
    dismissible: true,
    actionLabel: 'Schedule',
    onAction: () => console.log('Schedule campaign')
  },
  {
    id: '3',
    severity: 'info',
    title: 'Health Screening Due',
    message: '156 students need annual health screenings this month',
    timestamp: new Date(Date.now() - 7200000),
    dismissible: true
  }
];

const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'record',
    user: 'Nurse Johnson',
    action: 'updated health record for',
    description: 'Emily Davis - Vision screening completed',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    type: 'medication',
    user: 'Nurse Smith',
    action: 'administered medication to',
    description: 'Michael Chen - Asthma inhaler',
    timestamp: new Date(Date.now() - 900000)
  },
  {
    id: '3',
    type: 'appointment',
    user: 'Dr. Williams',
    action: 'completed appointment for',
    description: 'Sarah Johnson - Annual physical',
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: '4',
    type: 'incident',
    user: 'Nurse Anderson',
    action: 'reported incident for',
    description: 'James Brown - Minor playground injury',
    timestamp: new Date(Date.now() - 3600000)
  }
];

const mockImmunizationProgress: ProgressItem[] = [
  {
    id: '1',
    label: 'COVID-19 Vaccination',
    current: 2456,
    target: 2847,
    status: 'on-track',
    description: 'First dose completion',
    trend: 5.2
  },
  {
    id: '2',
    label: 'Flu Vaccination',
    current: 1823,
    target: 2847,
    status: 'at-risk',
    description: 'Annual flu shot',
    trend: -2.1
  },
  {
    id: '3',
    label: 'MMR Compliance',
    current: 2789,
    target: 2847,
    status: 'complete',
    description: 'Measles, Mumps, Rubella',
    trend: 1.5
  }
];

const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    label: 'New Health Record',
    icon: Activity,
    onClick: () => console.log('New record'),
    color: 'blue'
  },
  {
    id: '2',
    label: 'Schedule Screening',
    icon: Heart,
    onClick: () => console.log('Schedule screening'),
    color: 'green'
  },
  {
    id: '3',
    label: 'View Immunizations',
    icon: Shield,
    onClick: () => console.log('View immunizations'),
    color: 'purple',
    badge: 143
  },
  {
    id: '4',
    label: 'Critical Alerts',
    icon: AlertCircle,
    onClick: () => console.log('View alerts'),
    color: 'red',
    badge: 3
  }
];

// ============================================================================
// COMPONENT
// ============================================================================

const HealthDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [darkMode] = useState(false); // Get from theme context in real app

  // Chart series configurations
  const healthTrendsSeries: LineChartSeries[] = useMemo(() => [
    { dataKey: 'visits', name: 'Health Visits', color: '#3b82f6' },
    { dataKey: 'screenings', name: 'Screenings', color: '#10b981' },
    { dataKey: 'incidents', name: 'Incidents', color: '#ef4444' }
  ], []);

  const chronicConditionsSeries = useMemo(() => [
    { dataKey: 'count', name: 'Students', color: '#8b5cf6' }
  ], []);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Health Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive health monitoring and immunization tracking
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardGrid columns={4} gap="md">
        {mockHealthStats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </DashboardGrid>

      {/* Quick Actions */}
      <QuickActionsWidget
        title="Quick Actions"
        subtitle="Common health management tasks"
        actions={mockQuickActions}
        darkMode={darkMode}
        columns={4}
      />

      {/* Charts Row */}
      <DashboardGrid columns={2} gap="md">
        {/* Health Trends Chart */}
        <ChartWidget
          title="Health Trends"
          subtitle="Monthly health visits, screenings, and incidents"
          showTimeRange
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          showExport
          onExport={() => console.log('Export trends')}
          showRefresh
          onRefresh={() => console.log('Refresh trends')}
          darkMode={darkMode}
        >
          <LineChart
            data={mockHealthTrendsData}
            series={healthTrendsSeries}
            xAxisKey="month"
            height={300}
            darkMode={darkMode}
            showGrid
            showLegend
            curved
          />
        </ChartWidget>

        {/* Immunization Status */}
        <ChartWidget
          title="Immunization Status"
          subtitle="Student immunization compliance overview"
          showExport
          onExport={() => console.log('Export immunization')}
          darkMode={darkMode}
        >
          <PieChart
            data={mockImmunizationData}
            height={300}
            darkMode={darkMode}
            showLegend
            showLabels
            showPercentage
          />
        </ChartWidget>
      </DashboardGrid>

      {/* Progress and Alerts Row */}
      <DashboardGrid columns={2} gap="md">
        {/* Immunization Progress */}
        <ProgressWidget
          title="Vaccination Progress"
          subtitle="Track vaccination campaign completion"
          items={mockImmunizationProgress}
          darkMode={darkMode}
          showPercentage
          showTrend
        />

        {/* Health Alerts */}
        <AlertsWidget
          alerts={mockHealthAlerts}
          onDismiss={(id) => console.log('Dismiss', id)}
          darkMode={darkMode}
          maxItems={5}
          showViewAll
          onViewAll={() => console.log('View all alerts')}
        />
      </DashboardGrid>

      {/* Chronic Conditions and Activity Row */}
      <DashboardGrid columns={3} gap="md" className="grid-cols-1 lg:grid-cols-3">
        {/* Chronic Conditions Chart */}
        <div className="lg:col-span-2">
          <ChartWidget
            title="Chronic Conditions"
            subtitle="Students by chronic health condition"
            showExport
            onExport={() => console.log('Export conditions')}
            darkMode={darkMode}
          >
            <BarChart
              data={mockChronicConditionsData}
              series={chronicConditionsSeries}
              xAxisKey="condition"
              height={300}
              darkMode={darkMode}
              showGrid
              barSize={50}
            />
          </ChartWidget>
        </div>

        {/* Recent Activity */}
        <div>
          <ActivityFeedWidget
            activities={mockRecentActivity}
            darkMode={darkMode}
            maxItems={5}
            showViewAll
            onViewAll={() => console.log('View all activity')}
          />
        </div>
      </DashboardGrid>

      {/* Additional Cards */}
      <DashboardGrid columns={3} gap="md">
        <DashboardCard
          title="Upcoming Screenings"
          subtitle="Scheduled health screenings"
          darkMode={darkMode}
          refreshable
          onRefresh={() => console.log('Refresh screenings')}
          collapsible
        >
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              156 students scheduled for health screenings this month
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex justify-between text-sm">
                <span>Vision Screening</span>
                <span className="font-medium">67 students</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Hearing Test</span>
                <span className="font-medium">45 students</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Dental Checkup</span>
                <span className="font-medium">44 students</span>
              </li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Allergy Information"
          subtitle="Students with documented allergies"
          darkMode={darkMode}
          refreshable
          onRefresh={() => console.log('Refresh allergies')}
        >
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">456</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Students with allergies
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Food Allergies</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Environmental</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medication</span>
                <span className="font-medium">66</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Emergency Contacts"
          subtitle="Contact information status"
          darkMode={darkMode}
          refreshable
          onRefresh={() => console.log('Refresh contacts')}
        >
          <div className="p-6">
            <DonutChart
              data={[
                { name: 'Complete', value: 2698, color: '#10b981' },
                { name: 'Incomplete', value: 149, color: '#ef4444' }
              ]}
              height={200}
              darkMode={darkMode}
              centerLabel="Total"
              centerValue="2,847"
            />
          </div>
        </DashboardCard>
      </DashboardGrid>
    </div>
  );
};

export default HealthDashboard;
