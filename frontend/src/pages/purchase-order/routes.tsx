/**
 * Purchase Order Routes
 * 
 * Comprehensive route configuration for purchase order management functionality.
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  PurchaseOrderDashboard,
  PurchaseOrderList,
  PurchaseOrderDetails,
  PurchaseOrderForm,
  PurchaseOrderEditor,
  CreateOrderWizard,
  PurchaseOrderStatistics,
  OrderAnalytics,
  PendingOrders,
  OrdersRequiringAction,
  ReorderItems,
  OrderHistory,
  VendorOrderHistory,
  PurchaseOrderSearch,
  ReceiveItemsDialog,
  OrderDocuments,
  PrintOrder,
  ExportOrder,
  OrderTemplates,
  DataImport,
  DataExport,
  SpendingAnalysis,
  VendorPerformance,
  OrderTrends,
  ReorderSuggestions,
  StockLevels,
} from './components';

/**
 * Purchase Order Routes Component
 * Defines all routes for the purchase order management module
 */
export const PurchaseOrderRoutes = () => (
  <>
    {/* Default redirect to dashboard */}
    <Route
      path="/purchase-orders"
      element={<Navigate to="/purchase-orders/dashboard" replace />}
    />

    {/* ==================== DASHBOARD ==================== */}
    <Route
      path="/purchase-orders/dashboard"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <PurchaseOrderDashboard />
        </ProtectedRoute>
      }
    />

    {/* ==================== ORDER LIST ==================== */}
    <Route
      path="/purchase-orders/list"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <PurchaseOrderList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/all"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <PurchaseOrderList />
        </ProtectedRoute>
      }
    />

    {/* ==================== CREATE ORDER ==================== */}
    <Route
      path="/purchase-orders/create"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <CreateOrderWizard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/new"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <PurchaseOrderForm />
        </ProtectedRoute>
      }
    />

    {/* ==================== ORDER DETAILS ==================== */}
    <Route
      path="/purchase-orders/:id"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <PurchaseOrderDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/:id/details"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <PurchaseOrderDetails />
        </ProtectedRoute>
      }
    />

    {/* ==================== EDIT ORDER ==================== */}
    <Route
      path="/purchase-orders/:id/edit"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <PurchaseOrderEditor />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/edit/:id"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <PurchaseOrderEditor />
        </ProtectedRoute>
      }
    />

    {/* ==================== RECEIVING ==================== */}
    <Route
      path="/purchase-orders/:id/receive"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <ReceiveItemsDialog />
        </ProtectedRoute>
      }
    />

    {/* ==================== DOCUMENTS ==================== */}
    <Route
      path="/purchase-orders/:id/documents"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrderDocuments />
        </ProtectedRoute>
      }
    />

    {/* ==================== PRINT & EXPORT ==================== */}
    <Route
      path="/purchase-orders/:id/print"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <PrintOrder />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/:id/export"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <ExportOrder />
        </ProtectedRoute>
      }
    />

    {/* ==================== SEARCH ==================== */}
    <Route
      path="/purchase-orders/search"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <PurchaseOrderSearch />
        </ProtectedRoute>
      }
    />

    {/* ==================== FILTERED VIEWS ==================== */}
    <Route
      path="/purchase-orders/pending"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <PendingOrders />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/requiring-action"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrdersRequiringAction />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/action-required"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrdersRequiringAction />
        </ProtectedRoute>
      }
    />

    {/* ==================== REORDERING ==================== */}
    <Route
      path="/purchase-orders/reorder"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <ReorderItems />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/reorder-suggestions"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <ReorderSuggestions />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/stock-levels"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE']}>
          <StockLevels />
        </ProtectedRoute>
      }
    />

    {/* ==================== ANALYTICS & REPORTS ==================== */}
    <Route
      path="/purchase-orders/statistics"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <PurchaseOrderStatistics />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/analytics"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrderAnalytics />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/spending-analysis"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <SpendingAnalysis />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/vendor-performance"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <VendorPerformance />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/trends"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrderTrends />
        </ProtectedRoute>
      }
    />

    {/* ==================== HISTORY ==================== */}
    <Route
      path="/purchase-orders/history"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <OrderHistory />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/vendor-history/:vendorId"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <VendorOrderHistory />
        </ProtectedRoute>
      }
    />

    {/* ==================== TEMPLATES ==================== */}
    <Route
      path="/purchase-orders/templates"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <OrderTemplates />
        </ProtectedRoute>
      }
    />

    {/* ==================== IMPORT/EXPORT ==================== */}
    <Route
      path="/purchase-orders/import"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
          <DataImport />
        </ProtectedRoute>
      }
    />

    <Route
      path="/purchase-orders/export-data"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
          <DataExport />
        </ProtectedRoute>
      }
    />
  </>
);

export default PurchaseOrderRoutes;
