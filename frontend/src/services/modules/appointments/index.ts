/**
 * @fileoverview Appointments API - Main module index
 * @module services/modules/appointments
 * @category Services
 *
 * Unified appointments API composed from modular feature implementations.
 * Provides complete appointment management, scheduling, and analytics functionality.
 */

import type { ApiClient } from '@/services/core/ApiClient'

// Import feature modules
import {
  IAppointmentsCoreApi,
  AppointmentsCoreApiImpl
} from './appointmentsApi.core'
import {
  IAppointmentsAvailabilityApi,
  AppointmentsAvailabilityApiImpl
} from './appointmentsApi.availability'
import {
  IAppointmentsWaitlistApi,
  AppointmentsWaitlistApiImpl
} from './appointmentsApi.waitlist'
import {
  IAppointmentsAnalyticsApi,
  AppointmentsAnalyticsApiImpl
} from './appointmentsApi.analytics'

/**
 * Complete Appointments API Interface
 * Combines all appointment management features
 */
export interface IAppointmentsApi extends
  IAppointmentsCoreApi,
  IAppointmentsAvailabilityApi,
  IAppointmentsWaitlistApi,
  IAppointmentsAnalyticsApi {}

/**
 * Appointments API Implementation
 *
 * Composed implementation combining all appointment management features:
 * - Core CRUD operations (create, read, update, delete)
 * - Availability and scheduling management
 * - Waitlist and reminder operations
 * - Analytics and reporting
 *
 * **Modular Architecture**:
 * - Each feature module is independently maintainable
 * - All modules under 400 lines for optimal maintainability
 * - Clear separation of concerns by domain
 *
 * **Usage**:
 * ```typescript
 * import { appointmentsApi } from '@/services/modules/appointments';
 *
 * // Use any feature from any module
 * const { appointment } = await appointmentsApi.create({...});
 * const { slots } = await appointmentsApi.getAvailability('nurse-456');
 * const { entry } = await appointmentsApi.addToWaitlist({...});
 * const { trends } = await appointmentsApi.getTrends('2025-01-01', '2025-01-31');
 * ```
 */
export class AppointmentsApiImpl implements IAppointmentsApi {
  private readonly core: AppointmentsCoreApiImpl
  private readonly availability: AppointmentsAvailabilityApiImpl
  private readonly waitlist: AppointmentsWaitlistApiImpl
  private readonly analytics: AppointmentsAnalyticsApiImpl

  constructor(client: ApiClient) {
    this.core = new AppointmentsCoreApiImpl(client)
    this.availability = new AppointmentsAvailabilityApiImpl(client)
    this.waitlist = new AppointmentsWaitlistApiImpl(client)
    this.analytics = new AppointmentsAnalyticsApiImpl(client)
  }

  // ==================== Core Operations ====================
  getAll = this.core.getAll.bind(this.core)
  getById = this.core.getById.bind(this.core)
  create = this.core.create.bind(this.core)
  update = this.core.update.bind(this.core)
  cancel = this.core.cancel.bind(this.core)
  markNoShow = this.core.markNoShow.bind(this.core)
  complete = this.core.complete.bind(this.core)
  start = this.core.start.bind(this.core)
  reschedule = this.core.reschedule.bind(this.core)

  // ==================== Availability Operations ====================
  getAvailability = this.availability.getAvailability.bind(this.availability)
  getUpcoming = this.availability.getUpcoming.bind(this.availability)
  getStatistics = this.availability.getStatistics.bind(this.availability)
  createRecurring = this.availability.createRecurring.bind(this.availability)
  setAvailability = this.availability.setAvailability.bind(this.availability)
  getNurseAvailability = this.availability.getNurseAvailability.bind(this.availability)
  updateAvailability = this.availability.updateAvailability.bind(this.availability)
  deleteAvailability = this.availability.deleteAvailability.bind(this.availability)
  exportCalendar = this.availability.exportCalendar.bind(this.availability)

  // ==================== Waitlist Operations ====================
  addToWaitlist = this.waitlist.addToWaitlist.bind(this.waitlist)
  getWaitlist = this.waitlist.getWaitlist.bind(this.waitlist)
  removeFromWaitlist = this.waitlist.removeFromWaitlist.bind(this.waitlist)
  addToWaitlistFull = this.waitlist.addToWaitlistFull.bind(this.waitlist)
  updateWaitlistPriority = this.waitlist.updateWaitlistPriority.bind(this.waitlist)
  getWaitlistPosition = this.waitlist.getWaitlistPosition.bind(this.waitlist)
  notifyWaitlistEntry = this.waitlist.notifyWaitlistEntry.bind(this.waitlist)
  processPendingReminders = this.waitlist.processPendingReminders.bind(this.waitlist)
  getAppointmentReminders = this.waitlist.getAppointmentReminders.bind(this.waitlist)
  scheduleReminder = this.waitlist.scheduleReminder.bind(this.waitlist)
  cancelReminder = this.waitlist.cancelReminder.bind(this.waitlist)
  checkConflicts = this.waitlist.checkConflicts.bind(this.waitlist)

  // ==================== Analytics Operations ====================
  cancelMultiple = this.analytics.cancelMultiple.bind(this.analytics)
  getForStudents = this.analytics.getForStudents.bind(this.analytics)
  getByDateRange = this.analytics.getByDateRange.bind(this.analytics)
  search = this.analytics.search.bind(this.analytics)
  getTrends = this.analytics.getTrends.bind(this.analytics)
  getNoShowStats = this.analytics.getNoShowStats.bind(this.analytics)
  getUtilizationStats = this.analytics.getUtilizationStats.bind(this.analytics)
}

/**
 * Factory function to create Appointments API instance
 *
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AppointmentsApiImpl instance with all features
 *
 * @example
 * ```typescript
 * import { apiClient } from '@/services/core/ApiClient';
 * import { createAppointmentsApi } from '@/services/modules/appointments';
 *
 * const appointmentsApi = createAppointmentsApi(apiClient);
 * ```
 */
export function createAppointmentsApi(client: ApiClient): AppointmentsApiImpl {
  return new AppointmentsApiImpl(client)
}

// Export feature module interfaces for granular access if needed
export type {
  IAppointmentsCoreApi,
  IAppointmentsAvailabilityApi,
  IAppointmentsWaitlistApi,
  IAppointmentsAnalyticsApi
}

// Export implementation classes for testing or advanced use cases
export {
  AppointmentsCoreApiImpl,
  AppointmentsAvailabilityApiImpl,
  AppointmentsWaitlistApiImpl,
  AppointmentsAnalyticsApiImpl
}

// Export combined interface
export type { IAppointmentsApi }
export { AppointmentsApiImpl }

// Create and export singleton instance
import { apiClient } from '@/services/core/ApiClient'
export const appointmentsApi = createAppointmentsApi(apiClient)
