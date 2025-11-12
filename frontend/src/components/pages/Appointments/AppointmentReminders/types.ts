import type { Appointment } from '../AppointmentCard';

/**
 * Reminder notification channel types
 */
export type ReminderType = 'email' | 'sms' | 'phone' | 'push';

/**
 * Reminder timing relative to appointment
 */
export type ReminderTiming = '15min' | '30min' | '1hour' | '2hours' | '4hours' | '1day' | '2days' | '1week';

/**
 * Reminder delivery status
 */
export type ReminderStatus = 'scheduled' | 'sent' | 'delivered' | 'failed' | 'cancelled';

/**
 * Reminder template configuration
 *
 * @interface ReminderTemplate
 * @property {string} id - Unique template identifier
 * @property {string} name - Human-readable template name
 * @property {ReminderType} type - Notification channel type
 * @property {string} [subject] - Email subject line (email only)
 * @property {string} message - Template message body with variable placeholders
 * @property {ReminderTiming} timing - When to send relative to appointment
 * @property {boolean} isDefault - Whether this is a default template
 * @property {boolean} isActive - Whether template is currently active
 * @property {Date} createdAt - Template creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 */
export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  subject?: string;
  message: string;
  timing: ReminderTiming;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Scheduled or sent reminder instance
 *
 * @interface AppointmentReminder
 * @property {string} id - Unique reminder identifier
 * @property {string} appointmentId - Associated appointment ID
 * @property {string} templateId - Template used for this reminder
 * @property {ReminderType} type - Notification channel type
 * @property {string} recipient - Recipient contact (email/phone/device ID)
 * @property {string} [subject] - Email subject (email only)
 * @property {string} message - Rendered message body
 * @property {Date} scheduledTime - When reminder is scheduled to send
 * @property {Date} [sentTime] - Actual send timestamp
 * @property {ReminderStatus} status - Current delivery status
 * @property {number} attempts - Number of delivery attempts
 * @property {string} [errorMessage] - Error details for failed reminders
 * @property {Date} createdAt - Reminder creation timestamp
 */
export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  templateId: string;
  type: ReminderType;
  recipient: string;
  subject?: string;
  message: string;
  scheduledTime: Date;
  sentTime?: Date;
  status: ReminderStatus;
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
}

/**
 * Reminder system statistics and metrics
 *
 * @interface ReminderStats
 * @property {number} total - Total reminders in system
 * @property {number} scheduled - Pending reminders
 * @property {number} sent - Sent but not confirmed delivered
 * @property {number} delivered - Successfully delivered
 * @property {number} failed - Failed deliveries
 * @property {number} deliveryRate - Percentage successfully delivered
 * @property {number} [openRate] - Email open rate (email only)
 * @property {number} [clickRate] - Link click rate (email only)
 */
export interface ReminderStats {
  total: number;
  scheduled: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  openRate?: number;
  clickRate?: number;
}

/**
 * Default reminder system settings
 *
 * @interface ReminderDefaultSettings
 * @property {boolean} enableAutoReminders - Auto-create reminders for new appointments
 * @property {ReminderTiming[]} defaultTiming - Default timing values for auto-reminders
 * @property {ReminderType[]} defaultTypes - Default notification channels
 */
export interface ReminderDefaultSettings {
  enableAutoReminders: boolean;
  defaultTiming: ReminderTiming[];
  defaultTypes: ReminderType[];
}

/**
 * Props for the AppointmentReminders component
 *
 * @interface AppointmentRemindersProps
 */
export interface AppointmentRemindersProps {
  /** Appointments to manage reminders for */
  appointments?: Appointment[];
  /** Existing reminder templates */
  templates?: ReminderTemplate[];
  /** Active reminders */
  reminders?: AppointmentReminder[];
  /** Reminder statistics */
  stats?: ReminderStats;
  /** Default reminder settings */
  defaultSettings?: ReminderDefaultSettings;
  /** Whether user can manage templates */
  canManageTemplates?: boolean;
  /** Whether user can send manual reminders */
  canSendManual?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Template create/update handler */
  onTemplateChange?: (template: Partial<ReminderTemplate>) => void;
  /** Template delete handler */
  onTemplateDelete?: (templateId: string) => void;
  /** Manual reminder send handler */
  onSendReminder?: (appointmentId: string, templateId: string, timing?: ReminderTiming) => void;
  /** Reminder cancel handler */
  onCancelReminder?: (reminderId: string) => void;
  /** Reminder retry handler */
  onRetryReminder?: (reminderId: string) => void;
  /** Settings update handler */
  onSettingsUpdate?: (settings: ReminderDefaultSettings) => void;
}

/**
 * Tab types for the AppointmentReminders interface
 */
export type ReminderTabType = 'overview' | 'templates' | 'reminders' | 'settings';
