import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { UserRole } from '../../types/common';

// Purchase Order Management Components (placeholders)
const PurchaseOrderDashboard = React.lazy(() => import('./components/PurchaseOrderDashboard'));
const PurchaseOrderList = React.lazy(() => import('./components/PurchaseOrderList'));
const PurchaseOrderDetails = React.lazy(() => import('./components/PurchaseOrderDetails'));
const CreateOrderWizard = React.lazy(() => import('./components/CreateOrderWizard'));
const PurchaseOrderEditor = React.lazy(() => import('./components/PurchaseOrderEditor'));
const PurchaseOrderStatistics = React.lazy(() => import('./components/PurchaseOrderStatistics'));
const OrderAnalytics = React.lazy(() => import('./components/OrderAnalytics'));
const PendingOrders = React.lazy(() => import('./components/PendingOrders'));
const OrdersRequiringAction = React.lazy(() => import('./components/OrdersRequiringAction'));
const ReorderItems = React.lazy(() => import('./components/ReorderItems'));
const OrderHistory = React.lazy(() => import('./components/OrderHistory'));
const VendorOrderHistory = React.lazy(() => import('./components/VendorOrderHistory'));

const purchaseOrderRoutes = [
  {
    path: '/purchase-orders',
    element: <Navigate to="/purchase-orders/dashboard" replace />,
  },
  {
    path: '/purchase-orders/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <PurchaseOrderDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/list',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'] as UserRole[]}>
        <PurchaseOrderList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/create',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <CreateOrderWizard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/edit/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <PurchaseOrderEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/details/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'] as UserRole[]}>
        <PurchaseOrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/pending',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <PendingOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/requiring-action',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <OrdersRequiringAction />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/reorder',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ReorderItems />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/statistics',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <PurchaseOrderStatistics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/analytics',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <OrderAnalytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/history',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <OrderHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchase-orders/vendor-history/:vendorId',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorOrderHistory />
      </ProtectedRoute>
    ),
  },
];

export default purchaseOrderRoutes;
