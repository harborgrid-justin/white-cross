/**
 * @deprecated All services in this directory are deprecated and will be removed on 2026-06-30.
 * Please migrate to server actions in @/lib/actions instead.
 *
 * See migration guides:
 * - README.md - Complete migration guide
 * - DEPRECATED.md - Service-specific migrations
 * - ORGANIZATION_REPORT.md - Directory structure analysis
 * - CLEANUP_RECOMMENDATIONS.md - Cleanup action plan
 *
 * Migration timeline:
 * - Now: Use server actions for new features
 * - Q1 2026: Migrate existing usage
 * - 2026-06-30: All services removed
 */

// ============================================================================
// ADMINISTRATION SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/admin instead
 * Migration: See DEPRECATED.md#administrationapi
 */
export { AdministrationService } from './AdministrationService';

/**
 * @deprecated Use @/lib/actions/admin instead
 * Migration: See DEPRECATED.md#administrationapi
 */
export * from './administrationApi';

/**
 * @deprecated Not yet migrated - Continue using until replacement available
 * Timeline: TBD (security critical)
 */
export * from './accessControlApi';

// ============================================================================
// ANALYTICS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/analytics.actions instead
 * Migration: See DEPRECATED.md#reportsapi
 */
export * from './analyticsApi';

// ============================================================================
// APPOINTMENTS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/appointments.actions instead
 * Migration: See DEPRECATED.md#appointmentsapi
 */
export * from './appointmentsApi';

// ============================================================================
// AUDIT SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/admin.audit-logs instead
 * Migration: See DEPRECATED.md#auditapi
 */
export * from './auditApi';

// ============================================================================
// AUTH SERVICES
// ============================================================================

/**
 * @deprecated Use NextAuth (next-auth library) instead
 * Migration: See DEPRECATED.md#authapi
 */
export * from './authApi';

// ============================================================================
// COMMUNICATION SERVICES
// ============================================================================

/**
 * @deprecated Migration path TBD
 */
export * from './broadcastsApi';

/**
 * @deprecated Migration path TBD
 */
export * from './communicationApi';

/**
 * @deprecated Migration path TBD
 */
export * from './communicationsApi';

/**
 * @deprecated Migration path TBD
 */
export * from './messagesApi';

// ============================================================================
// COMPLIANCE SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/compliance.actions instead
 * Migration: See DEPRECATED.md#complianceapi
 */
export * from './complianceApi';

// ============================================================================
// CONTACTS SERVICES
// ============================================================================

/**
 * @deprecated Migration planned for Q1 2026
 * Continue using until contacts.actions.ts is available
 */
export * from './contactsApi';

/**
 * @deprecated Migration path TBD
 */
export * from './emergencyContactsApi';

// ============================================================================
// DASHBOARD SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/dashboard.actions instead
 * Migration: See DEPRECATED.md#dashboardapi
 */
export * from './dashboardApi';

// ============================================================================
// DOCUMENTS SERVICES
// ============================================================================

/**
 * @deprecated Migration path TBD
 */
export * from './documentsApi';

// ============================================================================
// FINANCIAL SERVICES
// ============================================================================

/**
 * @deprecated Migration path TBD
 */
export * from './budgetApi';

/**
 * @deprecated Migration path TBD
 */
export * from './purchaseOrderApi';

// ============================================================================
// HEALTH RECORDS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/health-records.actions instead
 * Migration: See DEPRECATED.md#healthrecordsapi
 */
export * from './healthRecordsApi';

// ============================================================================
// INCIDENTS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/incidents.actions instead
 * Migration: See DEPRECATED.md#incidentsapi
 */
export * from './incidentsApi';

/**
 * @deprecated Migration path TBD
 */
export * from './incidentReportsApi';

// ============================================================================
// INTEGRATION SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/admin.integrations instead
 * Migration: See DEPRECATED.md#integrationapi
 */
export * from './integrationApi';

// ============================================================================
// INVENTORY SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/inventory.actions instead
 * Migration: See DEPRECATED.md#inventoryapi
 */
export * from './inventoryApi';

// ============================================================================
// MEDICATIONS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/medications.actions instead
 * Migration: See DEPRECATED.md#medicationsapi
 */
export * from './medicationsApi';

// ============================================================================
// MFA SERVICES
// ============================================================================

/**
 * @deprecated May be replaced by NextAuth MFA
 * Migration path TBD
 */
export * from './mfaApi';

// ============================================================================
// REPORTS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/reports.actions and @/lib/actions/analytics.actions instead
 * Migration: See DEPRECATED.md#reportsapi
 * Note: Split into two modules
 */
export * from './reportsApi';

// ============================================================================
// STUDENTS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/students.actions instead
 * Migration: See DEPRECATED.md#studentsapi
 */
export * from './studentsApi';

/**
 * @deprecated Likely merges into @/lib/actions/students.actions
 * Migration path TBD
 */
export * from './studentManagementApi';

// ============================================================================
// SYSTEM SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/admin.monitoring and @/lib/actions/admin.settings instead
 * Migration: See DEPRECATED.md#systemapi
 * Note: Split into two modules
 */
export * from './systemApi';

// ============================================================================
// USERS SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/admin.users instead
 * Migration: See DEPRECATED.md#usersapi
 */
export * from './usersApi';

// ============================================================================
// VENDOR SERVICES
// ============================================================================

/**
 * @deprecated Use @/lib/actions/vendors.actions instead
 * Migration: See DEPRECATED.md#vendorapi
 */
export * from './vendorApi';

// ============================================================================
// SHARED UTILITIES
// ============================================================================

/**
 * Shared types - May remain or be moved to @/lib/types
 */
export * from './types';

/**
 * Shared validation - May remain or be moved to @/lib/validation
 */
export * from './validation';

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Helper function to log deprecation warnings in development
 */
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️  DEPRECATION WARNING: You are importing from @/services/modules\n' +
      '   All services in this directory will be removed on 2026-06-30.\n' +
      '   Please migrate to @/lib/actions instead.\n' +
      '   See: /src/services/modules/DEPRECATED.md for migration guide'
  );
}
