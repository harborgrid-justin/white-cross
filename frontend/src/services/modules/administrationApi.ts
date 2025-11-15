/**
 * @fileoverview AdministrationApi Legacy Compatibility Layer
 *
 * @deprecated This service API is deprecated. Use server actions from @/lib/actions/admin instead.
 *
 * MIGRATION GUIDE:
 * =================
 *
 * OLD (Service API - Deprecated):
 * ```typescript
 * import { administrationApi } from '@/services/modules/administrationApi';
 * const districts = await administrationApi.getDistricts();
 * const users = await administrationApi.getUsers();
 * const health = await administrationApi.getSystemHealth();
 * ```
 *
 * NEW (Server Actions - Recommended):
 * ```typescript
 * import {
 *   getAdminDistricts,
 *   getAdminUsers,
 *   getSystemHealth
 * } from '@/lib/actions/admin';
 *
 * const districts = await getAdminDistricts();
 * const users = await getAdminUsers();
 * const health = await getSystemHealth();
 * ```
 *
 * BENEFITS OF SERVER ACTIONS:
 * - Type-safe with proper TypeScript inference
 * - Built-in Next.js cache integration
 * - Automatic revalidation support
 * - HIPAA-compliant audit logging
 * - Better error handling
 * - No need to manage ApiClient instances
 *
 * MAPPING TABLE:
 * Service API Method              -> Server Action
 * ---------------------------------------------------------
 * getSettings()                   -> getSystemConfiguration()
 * updateSettings()                -> updateSystemConfiguration()
 * getUsers()                      -> getAdminUsers()
 * createUser()                    -> createAdminUserAction()
 * updateUser()                    -> updateAdminUserAction()
 * deleteUser()                    -> deleteAdminUserAction()
 * getDistricts()                  -> getAdminDistricts()
 * getDistrictById()               -> getAdminDistrictById()
 * getSchools()                    -> getAdminSchools()
 * getSchoolById()                 -> getAdminSchoolById()
 * getSystemHealth()               -> getSystemHealth()
 * getAuditLogs()                  -> getAuditLogs()
 * getMetrics()                    -> getPerformanceMetrics()
 *
 * This file provides backward compatibility for the legacy administrationApi import.
 * The actual implementation has been refactored into a modular structure
 * located in the ./administrationApi/ directory for better maintainability.
 *
 * @see @/lib/actions/admin for new server actions
 * @deprecated Import from './administrationApi' instead for new code, or better yet use server actions
 */

// Re-export everything from the modular administrationApi implementation
export * from './administrationApi/index';

// Default export for backward compatibility
export { default } from './administrationApi/index';
