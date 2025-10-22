/**
 * Script to generate all purchase order component files
 * Run with: node scripts/generate-purchase-order-components.js
 */

const fs = require('fs');
const path = require('path');

const components = [
  'PurchaseOrderTable', 'PurchaseOrderGrid', 'PurchaseOrderDetails', 'PurchaseOrderForm',
  'PurchaseOrderEditor', 'PurchaseOrderViewer', 'PurchaseOrderSummary', 'CreateOrderWizard',
  'OrderItemsSelector', 'OrderItemForm', 'OrderItemsList', 'VendorSelector',
  'OrderTotalsCalculator', 'OrderPreview', 'OrderWorkflow', 'StatusBadge',
  'StatusTimeline', 'ApprovalDialog', 'CancellationDialog', 'OrderActions',
  'BulkActions', 'ReceiveItemsDialog', 'ReceivingForm', 'FulfillmentStatus',
  'FulfillmentProgress', 'ReceivingHistory', 'ItemReceivingCard', 'PurchaseOrderSearch',
  'PurchaseOrderFilters', 'AdvancedFilters', 'StatusFilter', 'DateRangeFilter',
  'VendorFilter', 'PurchaseOrderStatistics', 'OrderAnalytics', 'SpendingAnalysis',
  'VendorPerformance', 'OrderTrends', 'ReportGenerator', 'ReorderItems',
  'ReorderSuggestions', 'StockLevels', 'InventoryAlerts', 'ReorderDialog',
  'OrderDocuments', 'DocumentViewer', 'PrintOrder', 'ExportOrder',
  'SendToVendor', 'EmailDialog', 'OrderHistory', 'VendorOrderHistory',
  'RecentOrders', 'OrderTimeline', 'ChangeLog', 'AuditTrail',
  'PurchaseOrderDashboard', 'OrderOverview', 'PendingOrders', 'OrdersRequiringAction',
  'QuickStats', 'MetricsCards', 'OrderNotes', 'NotesEditor',
  'CommentsList', 'AddNoteDialog', 'OrderValidation', 'ValidationResults',
  'ErrorSummary', 'WarningsList', 'PricingDetails', 'CostBreakdown',
  'TaxCalculation', 'ShippingCosts', 'DiscountManager', 'OrderTemplates',
  'TemplateSelector', 'DuplicateOrder', 'SaveAsTemplate', 'DataImport',
  'DataExport', 'ImportDialog', 'ExportDialog', 'BulkUpload',
  'PurchaseOrderLayout', 'OrderSidebar', 'OrderHeader', 'OrderTabs',
  'OrderBreadcrumbs', 'NavigationMenu', 'LoadingSpinner', 'ErrorBoundary',
  'EmptyState', 'ConfirmationDialog', 'ProgressIndicator', 'StatusIndicator'
];

const componentDir = path.join(__dirname, '../frontend/src/pages/purchase-order/components');

// Ensure directory exists
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

components.forEach(componentName => {
  const filePath = path.join(componentDir, `${componentName}.tsx`);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${componentName}.tsx (already exists)`);
    return;
  }

  const content = `/**
 * ${componentName} Component
 * 
 * ${componentName.replace(/([A-Z])/g, ' $1').trim()} component for purchase order management.
 */

import React from 'react';

interface ${componentName}Props {
  /** Component props */
  [key: string]: any;
}

/**
 * ${componentName} component
 */
const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)}">
      <h3>${componentName.replace(/([A-Z])/g, ' $1').trim()}</h3>
      {/* Component implementation */}
    </div>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${componentName}.tsx`);
});

console.log(`\nGenerated ${components.length} component files successfully!`);
