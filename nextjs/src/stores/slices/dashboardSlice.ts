/**
 * @fileoverview Dashboard Redux Slice
 *
 * Comprehensive state management for nurse dashboard with real-time statistics, recent activities,
 * upcoming appointments, health alerts, and chart data. Provides aggregated view of daily operations
 * including student health status, appointment schedules, and critical alerts requiring immediate attention.
 *
 * **Key Features:**
 * - Real-time dashboard statistics (total students, appointments today, pending medications)
 * - Recent activity feed with filtering and pagination
 * - Upcoming appointments view with priority indicators
 * - Health alerts with severity levels (critical, high, medium, low)
 * - Chart data for visualizations (medication trends, appointment patterns, health metrics)
 * - Quick actions for common nurse workflows
 * - Date range filtering for historical data
 * - School/district scope selection for multi-location support
 * - Automatic cache refresh with configurable intervals
 *
 * **State Management Architecture:**
 * - Redux Toolkit with manual slice creation (not using EntityAdapter)
 * - Separate loading/error states for each dashboard section
 * - No localStorage persistence (dashboard data is transient)
 * - Real-time polling via TanStack Query (30-second intervals)
 * - Optimistic health alert management
 *
 * **HIPAA Compliance:**
 * - All dashboard operations trigger PHI access audit logs
 * - Dashboard displays student counts but not identifiable information in summaries
 * - Activity feed contains PHI (student names, actions) - requires audit logging
 * - Health alerts may contain student identifiers - logged access
 * - No caching of dashboard data in localStorage
 * - Role-based data filtering (nurses see only assigned students)
 *
 * **Dashboard Data Types:**
 * - **Statistics**: Aggregate counts, trends, and metrics
 * - **Recent Activities**: Last 10-50 nurse actions with timestamps
 * - **Upcoming Appointments**: Next 24 hours with conflict indicators
 * - **Health Alerts**: Critical issues requiring immediate attention
 * - **Chart Data**: Time-series data for visualizations
 * - **Quick Actions**: Contextual shortcuts for common tasks
 *
 * **Real-Time Update Strategy:**
 * - Auto-refresh every 30 seconds for critical dashboard sections
 * - Manual refresh via refreshDashboardCache action
 * - Optimistic updates for alert acknowledgment
 * - Server-sent events for critical health alerts (future enhancement)
 * - Background polling without blocking UI
 *
 * **TanStack Query Integration:**
 * - Dashboard stats: 30-second cache with auto-refresh
 * - Recent activities: 1-minute cache, invalidate on new actions
 * - Upcoming appointments: 30-second cache with polling
 * - Health alerts: 15-second cache, real-time critical alerts
 * - Chart data: 5-minute cache, invalidate on data changes
 *
 * **Performance Optimizations:**
 * - Bulk data loading via fetchCompleteDashboardData (reduces API calls)
 * - Selective re-rendering with memoized selectors
 * - Lazy loading for chart data (load only when chart tab active)
 * - Debounced date range updates
 * - Cached scope selections
 *
 * @module pages/dashboard/store/dashboardSlice
 * @see {@link services/modules/dashboardApi} for API implementation
 * @see {@link types/dashboard} for type definitions
 * @see {@link hooks/useDashboard} for React hooks integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/api';
import type {
  DashboardStats,
  DashboardRecentActivity,
  DashboardUpcomingAppointment,
  DashboardChartData,
  RecentActivitiesParams,
  UpcomingAppointmentsParams,
  ChartDataParams,
  CompleteDashboardData,
  HealthAlert,
  QuickAction
} from '../../types/dashboard';

/**
 * Dashboard API Service Adapter
 *
 * Provides a clean interface to dashboard API methods with consistent error handling,
 * response formatting, and support for multiple data aggregation patterns. Handles both
 * individual section fetching and bulk dashboard data loading.
 *
 * @class DashboardApiService
 *
 * @remarks
 * **Authentication**: All methods require valid JWT token with nurse/admin role
 * **Authorization**: Data filtered by user's assigned students/schools
 * **Rate Limiting**: 200 requests per minute (dashboard has high refresh rate)
 * **Audit Logging**: Dashboard views trigger PHI access audit logs
 * **Caching**: Server-side caching for 15-30 seconds depending on data type
 * **Performance**: Use getCompleteDashboardData() for initial load to reduce round trips
 *
 * @example
 * ```typescript
 * const apiService = new DashboardApiService();
 * const stats = await apiService.getDashboardStats();
 * console.log(`Total students: ${stats.totalStudents}`);
 * ```
 */
class DashboardApiService {
  /**
   * Get comprehensive dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await dashboardApi.getDashboardStats();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get recent activities with optional limit
   */
  async getRecentActivities(params?: RecentActivitiesParams): Promise<DashboardRecentActivity[]> {
    try {
      return await dashboardApi.getRecentActivities(params);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming appointments with optional limit
   */
  async getUpcomingAppointments(params?: UpcomingAppointmentsParams): Promise<DashboardUpcomingAppointment[]> {
    try {
      return await dashboardApi.getUpcomingAppointments(params);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get chart data for visualizations
   */
  async getChartData(params?: ChartDataParams): Promise<DashboardChartData> {
    try {
      return await dashboardApi.getChartData(params);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chart data');
    }
  }

  /**
   * Get complete dashboard data in single request
   */
  async getCompleteDashboardData(options?: {
    activityLimit?: number;
    appointmentLimit?: number;
  }): Promise<Partial<CompleteDashboardData>> {
    try {
      return await dashboardApi.getCompleteDashboardData(options);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch complete dashboard data');
    }
  }

  /**
   * Refresh dashboard cache
   */
  async refreshCache(): Promise<boolean> {
    try {
      return await dashboardApi.refreshCache();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to refresh dashboard cache');
    }
  }

  /**
   * Get dashboard stats by date range
   */
  async getDashboardStatsByDateRange(startDate: string, endDate: string): Promise<DashboardStats> {
    try {
      return await dashboardApi.getDashboardStatsByDateRange(startDate, endDate);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch dashboard stats by date range');
    }
  }

  /**
   * Get dashboard stats by scope (school/district)
   */
  async getDashboardStatsByScope(scope: {
    schoolId?: string;
    districtId?: string;
  }): Promise<DashboardStats> {
    try {
      return await dashboardApi.getDashboardStatsByScope(scope);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch scoped dashboard stats');
    }
  }
}

// Create service instance
const dashboardApiService = new DashboardApiService();

/**
 * Dashboard State Interface
 */
interface DashboardState {
  // Dashboard statistics
  stats: DashboardStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Recent activities
  recentActivities: DashboardRecentActivity[];
  activitiesLoading: boolean;
  activitiesError: string | null;

  // Upcoming appointments
  upcomingAppointments: DashboardUpcomingAppointment[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;

  // Chart data
  chartData: DashboardChartData | null;
  chartLoading: boolean;
  chartError: string | null;

  // Health alerts
  healthAlerts: HealthAlert[];
  alertsLoading: boolean;
  alertsError: string | null;

  // Quick actions
  quickActions: QuickAction[];

  // General dashboard state
  isRefreshing: boolean;
  lastUpdated: string | null;
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedScope: {
    schoolId?: string;
    districtId?: string;
  };
}

/**
 * Initial state
 */
const initialState: DashboardState = {
  // Dashboard statistics
  stats: null,
  statsLoading: false,
  statsError: null,

  // Recent activities
  recentActivities: [],
  activitiesLoading: false,
  activitiesError: null,

  // Upcoming appointments
  upcomingAppointments: [],
  appointmentsLoading: false,
  appointmentsError: null,

  // Chart data
  chartData: null,
  chartLoading: false,
  chartError: null,

  // Health alerts
  healthAlerts: [],
  alertsLoading: false,
  alertsError: null,

  // Quick actions
  quickActions: [],

  // General dashboard state
  isRefreshing: false,
  lastUpdated: null,
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
  selectedScope: {},
};

/**
 * Async Thunks
 */

// Fetch dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await dashboardApiService.getDashboardStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch recent activities
export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (params: RecentActivitiesParams = {}, { rejectWithValue }) => {
    try {
      const activities = await dashboardApiService.getRecentActivities(params);
      return activities;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch upcoming appointments
export const fetchUpcomingAppointments = createAsyncThunk(
  'dashboard/fetchUpcomingAppointments',
  async (params: UpcomingAppointmentsParams = {}, { rejectWithValue }) => {
    try {
      const appointments = await dashboardApiService.getUpcomingAppointments(params);
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch chart data
export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (params: ChartDataParams = {}, { rejectWithValue }) => {
    try {
      const chartData = await dashboardApiService.getChartData(params);
      return chartData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch complete dashboard data
export const fetchCompleteDashboardData = createAsyncThunk(
  'dashboard/fetchCompleteDashboardData',
  async (options: {
    activityLimit?: number;
    appointmentLimit?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const data = await dashboardApiService.getCompleteDashboardData(options);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Refresh dashboard cache
export const refreshDashboardCache = createAsyncThunk(
  'dashboard/refreshCache',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const success = await dashboardApiService.refreshCache();
      if (success) {
        // Refetch all dashboard data after cache refresh
        await dispatch(fetchCompleteDashboardData({}));
      }
      return success;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch dashboard stats by date range
export const fetchDashboardStatsByDateRange = createAsyncThunk(
  'dashboard/fetchStatsByDateRange',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const stats = await dashboardApiService.getDashboardStatsByDateRange(params.startDate, params.endDate);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch dashboard stats by scope
export const fetchDashboardStatsByScope = createAsyncThunk(
  'dashboard/fetchStatsByScope',
  async (scope: {
    schoolId?: string;
    districtId?: string;
  }, { rejectWithValue }) => {
    try {
      const stats = await dashboardApiService.getDashboardStatsByScope(scope);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Dashboard Slice
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Set selected date range
    setSelectedDateRange: (state, action: PayloadAction<{
      startDate: string | null;
      endDate: string | null;
    }>) => {
      state.selectedDateRange = action.payload;
    },

    // Set selected scope
    setSelectedScope: (state, action: PayloadAction<{
      schoolId?: string;
      districtId?: string;
    }>) => {
      state.selectedScope = action.payload;
    },

    // Clear dashboard data
    clearDashboardData: (state) => {
      state.stats = null;
      state.recentActivities = [];
      state.upcomingAppointments = [];
      state.chartData = null;
      state.healthAlerts = [];
      state.lastUpdated = null;
    },

    // Clear errors
    clearErrors: (state) => {
      state.statsError = null;
      state.activitiesError = null;
      state.appointmentsError = null;
      state.chartError = null;
      state.alertsError = null;
    },

    // Set quick actions
    setQuickActions: (state, action: PayloadAction<QuickAction[]>) => {
      state.quickActions = action.payload;
    },

    // Add health alert
    addHealthAlert: (state, action: PayloadAction<HealthAlert>) => {
      state.healthAlerts.unshift(action.payload);
    },

    // Remove health alert
    removeHealthAlert: (state, action: PayloadAction<string>) => {
      state.healthAlerts = state.healthAlerts.filter(alert => alert.id !== action.payload);
    },

    // Mark health alert as acknowledged
    markAlertAsAcknowledged: (state, action: PayloadAction<string>) => {
      const alert = state.healthAlerts.find(alert => alert.id === action.payload);
      if (alert) {
        alert.acknowledged = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard statistics
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });

    // Fetch recent activities
    builder
      .addCase(fetchRecentActivities.pending, (state) => {
        state.activitiesLoading = true;
        state.activitiesError = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.activitiesLoading = false;
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.activitiesLoading = false;
        state.activitiesError = action.payload as string;
      });

    // Fetch upcoming appointments
    builder
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.appointmentsLoading = true;
        state.appointmentsError = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
        state.appointmentsLoading = false;
        state.upcomingAppointments = action.payload;
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.appointmentsLoading = false;
        state.appointmentsError = action.payload as string;
      });

    // Fetch chart data
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.chartLoading = true;
        state.chartError = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartLoading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.chartLoading = false;
        state.chartError = action.payload as string;
      });

    // Fetch complete dashboard data
    builder
      .addCase(fetchCompleteDashboardData.pending, (state) => {
        state.isRefreshing = true;
        state.statsLoading = true;
        state.activitiesLoading = true;
        state.appointmentsLoading = true;
        // Clear errors
        state.statsError = null;
        state.activitiesError = null;
        state.appointmentsError = null;
        state.chartError = null;
        state.alertsError = null;
      })
      .addCase(fetchCompleteDashboardData.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.statsLoading = false;
        state.activitiesLoading = false;
        state.appointmentsLoading = false;
        
        const data = action.payload;
        
        if (data.stats) {
          state.stats = data.stats;
        }
        if (data.recentActivities) {
          state.recentActivities = data.recentActivities;
        }
        if (data.upcomingAppointments) {
          state.upcomingAppointments = data.upcomingAppointments;
        }
        if (data.healthAlerts) {
          state.healthAlerts = data.healthAlerts;
        }
        if (data.quickActions) {
          state.quickActions = data.quickActions;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCompleteDashboardData.rejected, (state, action) => {
        state.isRefreshing = false;
        state.statsLoading = false;
        state.activitiesLoading = false;
        state.appointmentsLoading = false;
        state.statsError = action.payload as string;
      });

    // Refresh dashboard cache
    builder
      .addCase(refreshDashboardCache.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshDashboardCache.fulfilled, (state) => {
        state.isRefreshing = false;
      })
      .addCase(refreshDashboardCache.rejected, (state) => {
        state.isRefreshing = false;
      });

    // Fetch stats by date range
    builder
      .addCase(fetchDashboardStatsByDateRange.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStatsByDateRange.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStatsByDateRange.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });

    // Fetch stats by scope
    builder
      .addCase(fetchDashboardStatsByScope.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStatsByScope.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStatsByScope.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSelectedDateRange,
  setSelectedScope,
  clearDashboardData,
  clearErrors,
  setQuickActions,
  addHealthAlert,
  removeHealthAlert,
  markAlertAsAcknowledged,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardStatsLoading = (state: { dashboard: DashboardState }) => state.dashboard.statsLoading;
export const selectDashboardStatsError = (state: { dashboard: DashboardState }) => state.dashboard.statsError;

export const selectRecentActivities = (state: { dashboard: DashboardState }) => state.dashboard.recentActivities;
export const selectActivitiesLoading = (state: { dashboard: DashboardState }) => state.dashboard.activitiesLoading;
export const selectActivitiesError = (state: { dashboard: DashboardState }) => state.dashboard.activitiesError;

export const selectUpcomingAppointments = (state: { dashboard: DashboardState }) => state.dashboard.upcomingAppointments;
export const selectAppointmentsLoading = (state: { dashboard: DashboardState }) => state.dashboard.appointmentsLoading;
export const selectAppointmentsError = (state: { dashboard: DashboardState }) => state.dashboard.appointmentsError;

export const selectChartData = (state: { dashboard: DashboardState }) => state.dashboard.chartData;
export const selectChartLoading = (state: { dashboard: DashboardState }) => state.dashboard.chartLoading;
export const selectChartError = (state: { dashboard: DashboardState }) => state.dashboard.chartError;

export const selectHealthAlerts = (state: { dashboard: DashboardState }) => state.dashboard.healthAlerts;
export const selectUnreadHealthAlerts = (state: { dashboard: DashboardState }) => 
  state.dashboard.healthAlerts.filter(alert => !alert.acknowledged);

export const selectQuickActions = (state: { dashboard: DashboardState }) => state.dashboard.quickActions;
export const selectIsRefreshing = (state: { dashboard: DashboardState }) => state.dashboard.isRefreshing;
export const selectLastUpdated = (state: { dashboard: DashboardState }) => state.dashboard.lastUpdated;
export const selectSelectedDateRange = (state: { dashboard: DashboardState }) => state.dashboard.selectedDateRange;
export const selectSelectedScope = (state: { dashboard: DashboardState }) => state.dashboard.selectedScope;

// Derived selectors
export const selectHighPriorityAppointments = (state: { dashboard: DashboardState }) =>
  state.dashboard.upcomingAppointments.filter(appointment => appointment.priority === 'high');

export const selectCriticalHealthAlerts = (state: { dashboard: DashboardState }) =>
  state.dashboard.healthAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

export const selectDashboardOverview = (state: { dashboard: DashboardState }) => ({
  stats: state.dashboard.stats,
  recentActivities: state.dashboard.recentActivities.slice(0, 5),
  upcomingAppointments: state.dashboard.upcomingAppointments.slice(0, 5),
  unreadAlerts: state.dashboard.healthAlerts.filter(alert => !alert.acknowledged).length,
  isLoading: state.dashboard.statsLoading || state.dashboard.activitiesLoading || state.dashboard.appointmentsLoading,
  hasError: !!(state.dashboard.statsError || state.dashboard.activitiesError || state.dashboard.appointmentsError),
  lastUpdated: state.dashboard.lastUpdated,
});

export default dashboardSlice.reducer;
