/**
 * Dashboard Page - Redux Integration Example
 * 
 * This is an example demonstrating how to properly connect a page
 * component to Redux store using typed hooks.
 * 
 * @fileoverview Redux-connected dashboard page component
 * @module pages/dashboard/DashboardReduxExample
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Activity,
  TrendingUp,
} from 'lucide-react';
// Import typed Redux hooks from the store
import { useAppDispatch, useAppSelector } from '../../stores';
// Import dashboard actions and selectors
import {
  fetchDashboardStats,
  fetchRecentActivities,
  fetchUpcomingAppointments,
} from './store/dashboardSlice';

/**
 * Quick Action Item Interface
 */
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

/**
 * Dashboard Page Component - Redux Connected
 * 
 * Features:
 * - Connected to Redux store with typed hooks
 * - Fetches data using async thunks
 * - Uses selectors for derived state
 * - Handles loading and error states from Redux
 * 
 * @example
 * ```tsx
 * // Use in routing
 * <Route path="/dashboard" element={<DashboardRedux />} />
 * ```
 */
const DashboardRedux: React.FC = () => {
  // ============================================================
  // REDUX INTEGRATION
  // ============================================================
  
  // Get dispatch function with correct typing
  const dispatch = useAppDispatch();
  
  // Select state from Redux store using typed selector
  const stats = useAppSelector((state) => state.dashboard.stats);
  const recentActivities = useAppSelector((state) => state.dashboard.recentActivities);
  const upcomingAppointments = useAppSelector((state) => state.dashboard.upcomingAppointments);
  
  // Select loading states
  const statsLoading = useAppSelector((state) => state.dashboard.statsLoading);
  const activitiesLoading = useAppSelector((state) => state.dashboard.activitiesLoading);
  const appointmentsLoading = useAppSelector((state) => state.dashboard.appointmentsLoading);
  
  // Select error states
  const statsError = useAppSelector((state) => state.dashboard.statsError);
  const activitiesError = useAppSelector((state) => state.dashboard.activitiesError);
  const appointmentsError = useAppSelector((state) => state.dashboard.appointmentsError);
  
  // Combine loading states
  const isLoading = statsLoading || activitiesLoading || appointmentsLoading;
  
  // Combine error states
  const hasError = statsError || activitiesError || appointmentsError;

  // ============================================================
  // DATA FETCHING
  // ============================================================
  
  // Fetch data on component mount
  useEffect(() => {
    // Dispatch async thunks to fetch data
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivities({ limit: 5 }));
    dispatch(fetchUpcomingAppointments({ limit: 5 }));
  }, [dispatch]);

  // ============================================================
  // QUICK ACTIONS CONFIGURATION
  // ============================================================
  
  const quickActions: QuickAction[] = [
    {
      id: 'students',
      title: 'Manage Students',
      description: 'View and manage student records',
      icon: Users,
      href: '/students',
      color: 'bg-blue-500',
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-green-500',
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Access student health information',
      icon: FileText,
      href: '/health-records',
      color: 'bg-purple-500',
    },
    {
      id: 'incidents',
      title: 'Incident Reports',
      description: 'Report and track incidents',
      icon: AlertTriangle,
      href: '/incident-reports',
      color: 'bg-red-500',
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Manage medication administration',
      icon: Activity,
      href: '/medications',
      color: 'bg-orange-500',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track medical supplies',
      icon: TrendingUp,
      href: '/inventory',
      color: 'bg-indigo-500',
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  // Show error state
  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">
            {statsError || activitiesError || appointmentsError}
          </p>
          <button
            onClick={() => {
              dispatch(fetchDashboardStats());
              dispatch(fetchRecentActivities({ limit: 5 }));
              dispatch(fetchUpcomingAppointments({ limit: 5 }));
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalStudents || 0}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Active Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeAppointments || 0}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Pending Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Incidents</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingIncidents || 0}
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        {/* Health Records Today */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Records Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.healthRecordsToday || 0}
              </p>
            </div>
            <FileText className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        {/* Medications Administered */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medications Given</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.medicationsAdministered || 0}
              </p>
            </div>
            <Activity className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Contacts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.emergencyContacts || 0}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                to={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className={`p-3 rounded-lg ${action.color} bg-opacity-10 mr-4`}>
                  <Icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                <Calendar className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{appointment.studentName}</p>
                  <p className="text-xs text-gray-600">{appointment.type}</p>
                  <p className="text-xs text-gray-400 mt-1">{appointment.scheduledTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRedux;

/**
 * REDUX INTEGRATION NOTES:
 * 
 * 1. TYPED HOOKS
 *    - Always use useAppDispatch and useAppSelector from @/stores
 *    - These provide full TypeScript type safety
 * 
 * 2. ASYNC THUNKS
 *    - Dispatch async thunks in useEffect for data fetching
 *    - Handle loading and error states from Redux
 * 
 * 3. SELECTORS
 *    - Use inline selectors or create reusable ones in the slice
 *    - Prefer memoized selectors for derived/computed state
 * 
 * 4. STATE MANAGEMENT
 *    - Let Redux handle data state
 *    - Use local state only for UI-only concerns (modals, form drafts, etc.)
 * 
 * 5. ERROR HANDLING
 *    - Check error states from Redux
 *    - Provide retry mechanisms
 *    - Show user-friendly error messages
 * 
 * 6. LOADING STATES
 *    - Always handle loading states
 *    - Show spinners or skeletons during loading
 *    - Consider partial loading for better UX
 * 
 * 7. BEST PRACTICES
 *    - Clean up subscriptions if needed
 *    - Avoid over-fetching data
 *    - Use pagination where appropriate
 *    - Cache data in Redux to avoid unnecessary API calls
 */
