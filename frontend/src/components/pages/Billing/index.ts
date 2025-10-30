/**
 * Billing Module Components
 * 
 * Comprehensive billing and invoicing system with the following components:
 * - BillingCard: Invoice display card with payment tracking
 * - BillingHeader: Financial metrics dashboard and controls
 * - BillingList: Invoice list with multiple view modes and bulk operations
 * - BillingDetail: Detailed invoice view with tabbed interface
 * - BillingPayment: Payment management and processing
 * - BillingReports: Comprehensive reporting and analytics
 * - BillingSettings: Configuration and settings management
 * - BillingInvoiceBuilder: Invoice creation and editing
 * - BillingAnalytics: Revenue insights and performance metrics
 * - BillingNotifications: Notification management system
 */

// Core components
export { default as BillingCard } from './BillingCard';
export { default as BillingHeader } from './BillingHeader';
export { default as BillingList } from './BillingList';
export { default as BillingDetail } from './BillingDetail';
export { default as BillingPayment } from './BillingPayment';
export { default as BillingReports } from './BillingReports';
export { default as BillingSettings } from './BillingSettings';
export { default as BillingInvoiceBuilder } from './BillingInvoiceBuilder';
export { default as BillingAnalytics } from './BillingAnalytics';
export { default as BillingNotifications } from './BillingNotifications';

// Export types and interfaces
export type {
  InvoiceStatus,
  PaymentMethod,
  InvoicePriority,
  ServiceCategory,
  InvoiceLineItem,
  PaymentRecord,
  BillingInvoice,
} from './BillingCard';

export type {
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationChannel,
  BillingNotification,
  NotificationTemplate,
} from './BillingNotifications';

/**
 * Billing module feature overview:
 * 
 * 1. Invoice Management
 *    - Create, edit, and manage invoices
 *    - Line item management with tax calculations
 *    - Multiple payment tracking
 *    - Status management (draft, sent, paid, overdue, etc.)
 * 
 * 2. Payment Processing
 *    - Multiple payment methods support
 *    - Payment history and analytics
 *    - Automated payment processing
 *    - Refund and adjustment handling
 * 
 * 3. Financial Analytics
 *    - Revenue tracking and trends
 *    - Collection performance metrics
 *    - Payment method analytics
 *    - Top patient revenue analysis
 * 
 * 4. Reporting System
 *    - Comprehensive financial reports
 *    - Aging reports for outstanding balances
 *    - Tax reporting and compliance
 *    - Customizable report generation
 * 
 * 5. Notification Management
 *    - Automated payment reminders
 *    - Invoice delivery notifications
 *    - Multi-channel communication (email, SMS, in-app)
 *    - Template-based notifications
 * 
 * 6. Settings & Configuration
 *    - Company and billing information
 *    - Payment gateway configuration
 *    - Tax settings and compliance
 *    - Email and notification preferences
 * 
 * All components follow HIPAA compliance requirements and healthcare industry
 * best practices for patient billing and financial data management.
 */
