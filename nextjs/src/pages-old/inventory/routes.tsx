import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { InventoryItems, InventoryAlerts, InventoryTransactions, InventoryVendors } from './components';

export const inventoryRoutes: RouteObject[] = [
  {
    path: 'inventory',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InventoryItems />
          </ProtectedRoute>
        ),
      },
      {
        path: 'items',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InventoryItems />
          </ProtectedRoute>
        ),
      },
      {
        path: 'alerts',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InventoryAlerts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InventoryTransactions />
          </ProtectedRoute>
        ),
      },
      {
        path: 'vendors',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <InventoryVendors />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
