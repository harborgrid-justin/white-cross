// Purchase Order Page Exports
export * from './store';
export * from './components';
export { default as purchaseOrderRoutes } from './routes';

// Page Metadata
export const PURCHASE_ORDER_PAGE_METADATA = {
  title: 'Purchase Order Management',
  description: 'Comprehensive purchase order processing and workflow management',
  category: 'Procurement',
  roles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'],
  features: [
    'Purchase Order Creation & Management',
    'Approval Workflow System',
    'Receiving & Fulfillment Tracking',
    'Vendor Integration',
    'Order Status Management',
    'Reorder Management',
    'Statistics & Analytics',
    'Document Generation & Export',
    'Email Notifications',
    'Bulk Operations',
    'Order Templates',
    'Audit Trail & History',
    'Cost Tracking & Analysis',
    'Integration with Inventory System'
  ],
  apiIntegration: 'purchaseOrderApi'
};

// Service Adapter Integration Status
export const PURCHASE_ORDER_SERVICE_STATUS = {
  integrated: true,
  apiMethods: [
    'getPurchaseOrders',
    'getPurchaseOrderById',
    'createPurchaseOrder',
    'updatePurchaseOrder',
    'deletePurchaseOrder',
    'approvePurchaseOrder',
    'cancelPurchaseOrder',
    'receiveItems',
    'getPendingOrders',
    'getOrdersByStatus',
    'getRecentOrders',
    'getOrdersRequiringReceiving',
    'getPurchaseOrderStatistics',
    'getVendorPurchaseHistory',
    'getItemsNeedingReorder',
    'exportPurchaseOrder',
    'printPurchaseOrder',
    'sendOrderToVendor',
    'duplicatePurchaseOrder',
    'addOrderNote',
    'getOrderFulfillmentStatus'
  ],
  storeSlice: 'purchaseOrderSlice',
  components: 96,
  routes: 13
};
