import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';

// Placeholder components - will be replaced with actual components
const DashboardOverview = () => <div>Dashboard Overview</div>
const DashboardStats = () => <div>Dashboard Statistics</div>
const DashboardCharts = () => <div>Dashboard Charts</div>
const DashboardActivities = () => <div>Dashboard Activities</div>
const DashboardAppointments = () => <div>Dashboard Appointments</div>
const DashboardAlerts = () => <div>Dashboard Health Alerts</div>

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <DashboardOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'stats',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <DashboardStats />
          </ProtectedRoute>
        ),
      },
      {
        path: 'charts',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <DashboardCharts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'activities',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <DashboardActivities />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <DashboardAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'alerts',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <DashboardAlerts />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
