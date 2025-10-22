// Dashboard components exports
// These components provide the complete dashboard interface functionality

import DashboardOverview from './DashboardOverview';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import RecentActivities from './RecentActivities';
import ActivityItem from './ActivityItem';
import ActivityFeed from './ActivityFeed';
import UpcomingAppointments from './UpcomingAppointments';
import AppointmentCard from './AppointmentCard';
import AppointmentsList from './AppointmentsList';
import HealthAlerts from './HealthAlerts';
import QuickActions from './QuickActions';
import QuickActionButton from './QuickActionButton';
import StatsWidget from './StatsWidget';

export const DashboardComponents = {
  // Main dashboard components
  DashboardOverview,
  DashboardStats,
  DashboardCharts,
  
  // Activity feed components
  RecentActivities,
  ActivityItem,
  ActivityFeed,
  
  // Appointments components
  UpcomingAppointments,
  AppointmentCard,
  AppointmentsList,
  
  // Health alerts components
  HealthAlerts,
  AlertCard: null, // To be implemented
  AlertsList: null, // To be implemented
  AlertModal: null, // To be implemented
  
  // Quick actions components
  QuickActions,
  QuickActionButton,
  ActionGrid: null, // To be implemented
  
  // Chart components
  StatisticsChart: null, // To be implemented
  TrendChart: null, // To be implemented
  PieChart: null, // To be implemented
  LineChart: null, // To be implemented
  BarChart: null, // To be implemented
  
  // Widget components
  StatsWidget,
  ChartWidget: null, // To be implemented
  ListWidget: null, // To be implemented
  
  // Filter and control components
  DateRangePicker: null, // To be implemented
  ScopeSelector: null, // To be implemented
  RefreshButton: null, // To be implemented
  DashboardFilters: null, // To be implemented
}

// Named exports for individual components
export {
  DashboardOverview,
  DashboardStats,
  DashboardCharts,
  RecentActivities,
  ActivityItem,
  ActivityFeed,
  UpcomingAppointments,
  AppointmentCard,
  AppointmentsList,
  HealthAlerts,
  QuickActions,
  QuickActionButton,
  StatsWidget,
};

// Export types
export type { Activity } from './RecentActivities';
export type { Appointment } from './UpcomingAppointments';
export type { HealthAlert } from './HealthAlerts';

export default DashboardComponents
