/**
 * AppointmentReminders - Backward Compatibility Export
 *
 * This file maintains backward compatibility by re-exporting from the new
 * modular structure. All new code should import from the AppointmentReminders
 * directory directly.
 *
 * @deprecated Import from './AppointmentReminders' directory instead
 */

export { default } from './AppointmentReminders';
export type {
  ReminderType,
  ReminderTiming,
  ReminderStatus,
  ReminderTemplate,
  AppointmentReminder,
  ReminderStats,
  ReminderDefaultSettings,
  AppointmentRemindersProps,
  ReminderTabType
} from './AppointmentReminders/types';
