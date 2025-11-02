/**
 * Domain Types Index
 *
 * Central export point for all business domain-specific types.
 * These types represent the core business entities and processes of the healthcare platform.
 *
 * @module types/domain
 */

// ============================================================================
// STUDENT DOMAIN - Student management and profiles
// ============================================================================
export * from './student.types';

// ============================================================================
// APPOINTMENTS DOMAIN - Appointment scheduling and management
// ============================================================================
export * from './appointments';

// ============================================================================
// MEDICATIONS DOMAIN - Medication administration and tracking
// ============================================================================
export * from './medications';
export * from './medication.types';

// ============================================================================
// HEALTH RECORDS DOMAIN - Student health records and medical history
// ============================================================================
export * from './healthRecords';

// ============================================================================
// INCIDENTS DOMAIN - Incident reporting and tracking
// ============================================================================
export * from './incidents';

// ============================================================================
// DOCUMENTS DOMAIN - Document management
// ============================================================================
export * from './documents';

// ============================================================================
// COMMUNICATIONS DOMAIN - Messaging and notifications
// ============================================================================
export * from './communication';

// ============================================================================
// ADMINISTRATION DOMAIN - School and district administration
// ============================================================================
export * from './administration';
export * from './admin';

// ============================================================================
// ACCESS CONTROL DOMAIN - Permissions and roles
// ============================================================================
export * from './accessControl';

// ============================================================================
// ANALYTICS DOMAIN - Reports and analytics
// ============================================================================
export * from './analytics';
export * from './reports';

// ============================================================================
// COMPLIANCE DOMAIN - HIPAA and regulatory compliance
// ============================================================================
export * from './compliance';

// ============================================================================
// INVENTORY DOMAIN - Medical supplies and inventory
// ============================================================================
export * from './inventory';
export * from './purchaseOrders';

// ============================================================================
// INTEGRATIONS DOMAIN - External system integrations
// ============================================================================
export * from './integrations';

// ============================================================================
// BUDGET DOMAIN - Budget and financial tracking
// ============================================================================
export * from './budget';

// ============================================================================
// DASHBOARD DOMAIN - Dashboard and overview screens
// ============================================================================
export * from './dashboard';

// ============================================================================
// VENDORS DOMAIN - Vendor management
// ============================================================================
export * from './vendors';
