import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  DashboardOverview,
  DashboardStats,
  DashboardCharts,
  RecentActivities,
  UpcomingAppointments,
  HealthAlerts
} from './components';

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
            <RecentActivities />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <UpcomingAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'alerts',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <HealthAlerts />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
