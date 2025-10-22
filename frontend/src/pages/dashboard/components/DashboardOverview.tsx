/**
 * WF-DASH-001 | DashboardOverview.tsx - Main Dashboard Overview Component
 * Purpose: Central dashboard component that orchestrates all dashboard widgets and layouts
 * Upstream: Dashboard store, user preferences | Dependencies: React, dashboard components
 * Downstream: Dashboard widgets and sections | Called by: Dashboard page
 * Related: DashboardStats, DashboardCharts, RecentActivities
 * Exports: DashboardOverview component | Key Features: Responsive layout, widget management
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User access → Dashboard load → Widget rendering → Data visualization
 * LLM Context: Main dashboard component for White Cross healthcare platform
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity,
  Settings,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';

// Components
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivities } from './RecentActivities';
import { UpcomingAppointments } from './UpcomingAppointments';
import { HealthAlerts } from './HealthAlerts';
import { QuickActions } from './QuickActions';
import { DashboardFilters } from './DashboardFilters';

// UI Components
import { Button } from '../../../components/ui/buttons/Button';

// Types
import { AppDispatch, RootState } from '../../../store';

// ============================================================================
// INTERFACES
// ============================================================================

interface DashboardOverviewProps {
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  className = ''
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Redux state
  const { user } = useSelector((state: RootState) => state.auth);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Load initial dashboard data
    loadDashboardData();
  }, [dispatch]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // Dispatch actions to load dashboard data
      // await dispatch(fetchDashboardStats()).unwrap();
      // await dispatch(fetchRecentActivities()).unwrap();
      // await dispatch(fetchUpcomingAppointments()).unwrap();
      // await dispatch(fetchHealthAlerts()).unwrap();
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    // Implement dashboard export functionality
    console.log('Exporting dashboard data...');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-blue-600" />
                Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {user?.name || 'User'}. Here's your healthcare overview.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExport}
              >
                Export
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                onClick={handleRefresh}
                loading={isRefreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <DashboardFilters onFiltersChange={(filters) => console.log('Filters:', filters)} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions - Top Row */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Charts and Analytics */}
            <div className="xl:col-span-8 space-y-6">
              {/* Charts Section */}
              <DashboardCharts />
              
              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-gray-600" />
                      Recent Activities
                    </h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <RecentActivities />
                </div>
              </div>
            </div>

            {/* Right Column - Appointments and Alerts */}
            <div className="xl:col-span-4 space-y-6">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      Upcoming Appointments
                    </h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <UpcomingAppointments />
                </div>
              </div>

              {/* Health Alerts */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      Health Alerts
                    </h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <HealthAlerts />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
