/**
 * Healthcare Platform Schemas - Main Barrel Export
 *
 * @module schemas
 * @description
 * Provides organized access to all Zod validation schemas across the healthcare platform.
 * Schemas are organized by domain for clarity and maintainability.
 *
 * ## Architecture
 *
 * Schemas are organized into the following categories:
 * - **Core Domains**: User management, roles, health records, allergies
 * - **Clinical Operations**: Appointments, vital signs, immunizations, health records
 * - **Administrative**: Admin tools, settings, system configuration
 * - **Inventory Management**: Stock tracking, transactions, alerts, valuations
 * - **Analytics & Reporting**: Metrics, dashboards, exports, scheduled reports
 * - **Compliance & Incidents**: Policy management, incident tracking, follow-ups
 * - **Documents**: Document management, templates, versioning, signatures
 *
 * ## Usage Guidelines
 *
 * ### Recommended: Direct Imports
 * For optimal tree-shaking and build performance, import directly from specific schema files:
 *
 * @example
 * ```typescript
 * // Direct import - better tree-shaking
 * import { createUserSchema, type CreateUserInput } from '@/schemas/user.create.schemas';
 * import { appointmentSchema } from '@/schemas/appointment.schemas';
 * ```
 *
 * ### Alternative: Barrel Imports
 * For convenience during rapid development, you can use barrel imports:
 *
 * @example
 * ```typescript
 * // Barrel import - convenient but larger bundle
 * import {
 *   createUserSchema,
 *   appointmentSchema,
 *   incidentSchema
 * } from '@/schemas';
 * ```
 *
 * ### Domain-Specific Imports
 * Import from subdirectory barrels for domain-focused code:
 *
 * @example
 * ```typescript
 * // Analytics domain
 * import {
 *   analyticsQuerySchema,
 *   dashboardConfigSchema
 * } from '@/schemas/analytics';
 *
 * // Incidents domain
 * import {
 *   createIncidentSchema,
 *   followUpSchema
 * } from '@/schemas/incidents';
 * ```
 *
 * ### Namespace Imports (Recommended for Avoiding Conflicts)
 * Use namespace imports to avoid naming conflicts and improve code clarity:
 *
 * @example
 * ```typescript
 * // Namespace import - explicit and conflict-free
 * import * as UserSchemas from '@/schemas/user.schemas';
 * import * as RoleSchemas from '@/schemas/role.schemas';
 *
 * const user = UserSchemas.createUserSchema.parse(data);
 * const role = RoleSchemas.createRoleSchema.parse(roleData);
 * ```
 *
 * ## Performance Considerations
 *
 * - **Tree-shaking**: Direct imports allow bundlers to eliminate unused schemas
 * - **Code splitting**: Domain-specific imports support better code splitting
 * - **Bundle size**: Barrel imports may increase initial bundle size
 * - **Development**: Barrel imports improve DX during rapid iteration
 *
 * ## Export Conflict Resolution
 *
 * Some schema files have overlapping exports (e.g., permission schemas appear in both
 * user.schemas and role.schemas). To avoid TypeScript conflicts in this barrel file:
 *
 * - **Conflicting files are commented out** in the wildcard exports section
 * - **Namespace exports are provided** at the end of the file for explicit access
 * - **Direct imports** from specific files always work without conflicts
 *
 * Conflicting exports:
 * - `role.schemas` conflicts with `user.schemas` (Permission types)
 * - `settings.schemas` conflicts with `admin.schemas` (Settings types)
 * - `inventory.schemas` conflicts with `stock.schemas` and `transaction.schemas` (Alert and Count types)
 * - `analytics.schemas` conflicts with `user.schemas` and `appointment.schemas` (SortOrder, ExportFormat)
 * - `reports.schemas` conflicts with `appointment.schemas` (ReportFormat, ReportType)
 * - `incidents` directory barrel conflicts with `appointment.schemas` and `user.schemas` (NotificationMethod, SortOrder)
 *
 * @see Use namespace exports (end of file) or direct imports to access these schemas
 *
 * ## Type Safety
 *
 * All schemas export corresponding TypeScript types via `z.infer<>`:
 *
 * @example
 * ```typescript
 * import { createUserSchema, type CreateUserInput } from '@/schemas';
 *
 * // Type-safe validation
 * const validateUser = (data: unknown): CreateUserInput => {
 *   return createUserSchema.parse(data);
 * };
 * ```
 *
 * @see {@link https://zod.dev Zod Documentation}
 */

// ============================================================================
// CORE DOMAINS
// ============================================================================

/**
 * User Management Schemas
 * @description User authentication, profiles, creation, querying, and role management
 * @note user.schemas.ts re-exports all user-related sub-schemas including permission schemas
 */
export * from './user.schemas';

/**
 * Role and Permission Schemas
 * @description Role-based access control and permission management
 * @note NOT exported via wildcard to avoid conflicts with user.schemas
 * @note Use: import * as RoleSchemas from '@/schemas/role.schemas';
 * @note Or: import { createRoleSchema } from '@/schemas/role.schemas';
 * @see RoleSchemas namespace export at end of file
 */
// export * from './role.schemas'; // Conflicts with user.schemas - use namespace or direct import

/**
 * Allergy Management Schemas
 * @description Patient allergy records and reactions
 */
export * from './allergy.schemas';

/**
 * Health Record Schemas
 * @description Electronic health records and medical history
 */
export * from './health-record.schemas';

/**
 * Immunization Schemas
 * @description Vaccination records and immunization tracking
 */
export * from './immunization.schemas';

/**
 * Vital Signs Schemas
 * @description Patient vital signs measurements and monitoring
 */
export * from './vital-signs.schemas';

// ============================================================================
// CLINICAL OPERATIONS
// ============================================================================

/**
 * Appointment Management Schemas
 * @description Complete appointment lifecycle including scheduling, reminders, and waitlists
 * @note appointment.schemas.ts re-exports all appointment-related sub-schemas
 */
export * from './appointment.schemas';

// ============================================================================
// ADMINISTRATIVE
// ============================================================================

/**
 * Admin Management Schemas
 * @description Administrative tools, API keys, webhooks, operations, security, and system management
 * @note admin.schemas.ts re-exports all admin-related sub-schemas including system settings
 */
export * from './admin.schemas';

/**
 * Settings Management Schemas
 * @description System, school, profile, communication, integration, and operational settings
 * @note NOT exported via wildcard to avoid conflicts with admin.schemas
 * @note Use: import * as SettingsSchemas from '@/schemas/settings.schemas';
 * @note Or: import { emailSettingsSchema } from '@/schemas/settings.schemas';
 * @see SettingsSchemas namespace export at end of file
 */
// export * from './settings.schemas'; // Conflicts with admin.schemas - use namespace or direct import

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

/**
 * Stock Management Schemas
 * @description Inventory tracking, alerts, thresholds, analytics, recommendations, and valuations
 * @note stock.schemas.ts re-exports all stock-related sub-schemas including alert schemas
 */
export * from './stock.schemas';

/**
 * Transaction Schemas
 * @description Stock transactions, transfers, counts, operations, and reporting
 * @note transaction.schemas.ts re-exports all transaction-related sub-schemas including physical count
 */
export * from './transaction.schemas';

/**
 * Inventory Schemas (Legacy)
 * @description General inventory management
 * @deprecated Use stock.schemas and transaction.schemas for new code
 * @note NOT exported via wildcard to avoid conflicts with stock/transaction schemas
 * @note Use: import * as InventorySchemas from '@/schemas/inventory.schemas';
 * @see InventorySchemas namespace export at end of file
 */
// export * from './inventory.schemas'; // Conflicts with stock/transaction - use namespace or direct import

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Analytics Domain Schemas
 * @description Metrics collection, dashboard configuration, query building, and data export
 * @note NOT exported via wildcard to avoid conflicts with user.schemas and appointment.schemas
 * @note Conflicts: SortOrder (with user.schemas), ExportFormat (with user.schemas)
 * @note Use: import * as AnalyticsSchemas from '@/schemas/analytics/analytics.schemas';
 * @note Or: import { analyticsQuerySchema } from '@/schemas/analytics/analytics.schemas';
 * @see {@link ./analytics} Analytics subdirectory for detailed schemas
 * @see AnalyticsSchemas namespace export at end of file
 */
// export * from './analytics/analytics.schemas'; // Conflicts with user/appointment - use namespace or direct import

/**
 * Reports Domain Schemas
 * @description Report generation, scheduling, execution, filtering, and configuration
 * @note NOT exported via wildcard to avoid conflicts with appointment.schemas
 * @note Conflicts: ReportFormat, ReportType (with appointment.schemas)
 * @note Use: import * as ReportsSchemas from '@/schemas/reports/reports.schemas';
 * @note Or: import { reportConfigSchema } from '@/schemas/reports/reports.schemas';
 * @see {@link ./reports} Reports subdirectory for detailed schemas
 * @see ReportsSchemas namespace export at end of file
 */
// export * from './reports/reports.schemas'; // Conflicts with appointment - use namespace or direct import

// ============================================================================
// COMPLIANCE & INCIDENTS
// ============================================================================

/**
 * Compliance Domain Schemas
 * @description HIPAA compliance, audit logs, violations, metrics, and policy management
 * @note compliance.schemas.ts re-exports all compliance-related sub-schemas
 * @see {@link ./compliance} Compliance subdirectory for detailed schemas
 */
export * from './compliance/compliance.schemas';

/**
 * Policy Management Schemas
 * @description Policy templates, acknowledgments, and enforcement
 */
export * from './compliance/policy.schemas';

/**
 * Incidents Domain Schemas
 * @description Incident reporting, tracking, follow-ups, and witness management
 * @note NOT exported via wildcard to avoid conflicts with appointment.schemas and user.schemas
 * @note Conflicts: NotificationMethod (with appointment.schemas), SortOrder (with user.schemas)
 * @note This would re-export the complete incidents barrel which includes:
 *       - incident.schemas.ts: Core incidents (types, CRUD, filters, validation)
 *       - follow-up.schemas.ts: Follow-up actions, tracking, completion
 *       - witness.schemas.ts: Witness management and statements
 * @note Use: import * as IncidentsSchemas from '@/schemas/incidents';
 * @note Or: import { createIncidentSchema } from '@/schemas/incidents/incident.schemas';
 * @see {@link ./incidents} Incidents subdirectory for detailed schemas
 * @see IncidentsSchemas, IncidentSchemas, FollowUpSchemas namespace exports at end of file
 */
// export * from './incidents'; // Conflicts with appointment/user - use namespace or direct import

// ============================================================================
// DOCUMENTS
// ============================================================================

/**
 * Document Management Schemas
 * @description Document creation, versioning, templates, sharing, and signatures
 */
export * from './documentSchemas';
export * from './documents';

// ============================================================================
// NAMESPACE EXPORTS FOR CLARITY
// ============================================================================

/**
 * Namespace-style exports for improved organization and conflict prevention
 *
 * Use namespace imports when you want to group related schemas and avoid naming conflicts.
 * This approach provides better code organization and makes the source of each schema explicit.
 *
 * These namespace exports are especially important for schemas that have conflicting exports
 * (role.schemas, settings.schemas, inventory.schemas) which are commented out above.
 *
 * @example
 * ```typescript
 * // Namespace import - clear organization, no conflicts
 * import * as UserSchemas from '@/schemas/user.schemas';
 * import * as RoleSchemas from '@/schemas/role.schemas';
 * import * as AppointmentSchemas from '@/schemas/appointment.schemas';
 *
 * // Usage with explicit namespace
 * const user = UserSchemas.createUserSchema.parse(data);
 * const role = RoleSchemas.createRoleSchema.parse(roleData);
 * const appointment = AppointmentSchemas.appointmentSchema.parse(apptData);
 * ```
 *
 * @example
 * ```typescript
 * // Import from main barrel for convenience during prototyping
 * import * as Schemas from '@/schemas';
 *
 * // Access via double namespace
 * const user = Schemas.UserSchemas.createUserSchema.parse(data);
 * const role = Schemas.RoleSchemas.createRoleSchema.parse(roleData);
 * ```
 *
 * @example
 * ```typescript
 * // Accessing conflicting schemas via namespace
 * import * as Schemas from '@/schemas';
 *
 * // Permission schemas from user domain
 * const userPermission = Schemas.UserSchemas.permissionSchema.parse(data);
 *
 * // Role management from role domain
 * const role = Schemas.RoleSchemas.createRoleSchema.parse(roleData);
 * ```
 */

// Core domain namespace exports
export * as UserSchemas from './user.schemas';
export * as RoleSchemas from './role.schemas';
export * as AllergySchemas from './allergy.schemas';
export * as HealthRecordSchemas from './health-record.schemas';
export * as ImmunizationSchemas from './immunization.schemas';
export * as VitalSignsSchemas from './vital-signs.schemas';

// Clinical operations namespace exports
export * as AppointmentSchemas from './appointment.schemas';

// Administrative namespace exports
export * as AdminSchemas from './admin.schemas';
export * as SettingsSchemas from './settings.schemas';

// Inventory management namespace exports
export * as StockSchemas from './stock.schemas';
export * as TransactionSchemas from './transaction.schemas';
export * as InventorySchemas from './inventory.schemas';

// Analytics and reporting namespace exports
export * as AnalyticsSchemas from './analytics/analytics.schemas';
export * as ReportsSchemas from './reports/reports.schemas';

// Compliance and incidents namespace exports
export * as ComplianceSchemas from './compliance/compliance.schemas';
export * as PolicySchemas from './compliance/policy.schemas';
export * as IncidentsSchemas from './incidents'; // Complete incidents barrel (incidents, follow-ups, witnesses)
// Legacy namespace exports (for backward compatibility)
export * as IncidentSchemas from './incidents/incident.schemas';
export * as FollowUpSchemas from './incidents/follow-up.schemas';
export * as WitnessSchemas from './incidents/witness.schemas';

// Document management namespace exports
export * as DocumentSchemas from './documentSchemas';
