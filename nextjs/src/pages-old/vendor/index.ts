// Vendor Page Exports
export * from './store';
export * from './components';
export { default as vendorRoutes } from './routes';

// Page Metadata
export const VENDOR_PAGE_METADATA = {
  title: 'Vendor Management',
  description: 'Comprehensive vendor and supplier management system',
  category: 'Procurement',
  roles: ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'],
  features: [
    'Vendor Information Management',
    'Performance Metrics & Analytics',
    'Rating & Review System',
    'Vendor Comparison Tools',
    'Search & Discovery',
    'Order History Tracking',
    'Payment Terms Management',
    'Compliance Monitoring',
    'Import/Export Capabilities',
    'Bulk Operations',
    'Contact Management',
    'Document Tracking'
  ],
  apiIntegration: 'vendorApi'
};

// Service Adapter Integration Status
export const VENDOR_SERVICE_STATUS = {
  integrated: true,
  apiMethods: [
    'getVendors',
    'getVendorById',
    'createVendor',
    'updateVendor',
    'deleteVendor',
    'reactivateVendor',
    'searchVendors',
    'compareVendors',
    'getVendorsByPaymentTerms',
    'getTopVendors',
    'getVendorStatistics',
    'getVendorMetrics',
    'updateVendorRating',
    'bulkUpdateRatings',
    'permanentlyDeleteVendor'
  ],
  storeSlice: 'vendorSlice',
  components: 82,
  routes: 12
};
