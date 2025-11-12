import { useState, useMemo, useCallback } from 'react';
import type { Appointment } from '../AppointmentCard';
import type {
  AppointmentReminder,
  ReminderTemplate,
  ReminderType,
  ReminderStatus
} from './types';

/**
 * Custom hook for filtering reminders based on search query and filter criteria
 *
 * @param {AppointmentReminder[]} reminders - Array of reminders to filter
 * @returns {object} Filter state and methods
 *
 * @example
 * const { filteredReminders, searchQuery, setSearchQuery, selectedType, setSelectedType } = useReminderFiltering(reminders);
 */
export const useReminderFiltering = (reminders: AppointmentReminder[]) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ReminderType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReminderStatus | 'all'>('all');

  const filteredReminders = useMemo(() => {
    return reminders.filter(reminder => {
      const matchesSearch = searchQuery === '' ||
        reminder.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.recipient.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || reminder.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || reminder.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reminders, searchQuery, selectedType, selectedStatus]);

  return {
    filteredReminders,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus
  };
};

/**
 * Custom hook for managing message preview functionality
 *
 * @returns {object} Preview state and methods
 *
 * @example
 * const { showPreview, previewMessage, handlePreviewMessage, closePreview } = useMessagePreview();
 */
export const useMessagePreview = () => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewMessage, setPreviewMessage] = useState<string>('');

  /**
   * Renders a template message with appointment data substituted
   *
   * @param {ReminderTemplate} template - Template to preview
   * @param {Appointment} [appointment] - Appointment data for variable substitution
   */
  const handlePreviewMessage = useCallback((
    template: ReminderTemplate | { message: string },
    appointment?: Appointment
  ) => {
    // Simple template variable replacement
    let message = template.message;

    if (appointment) {
      message = message
        .replace(/\{patientName\}/g, appointment.patient?.name ?? 'Patient')
        .replace(/\{appointmentDate\}/g, new Date(appointment.dateTime).toLocaleDateString())
        .replace(/\{appointmentTime\}/g, new Date(appointment.dateTime).toLocaleTimeString())
        .replace(/\{providerName\}/g, appointment.provider?.name ?? 'Provider')
        .replace(/\{location\}/g, appointment.location?.isVirtual ? 'Virtual' : (appointment.location?.room ?? 'TBD'));
    }

    setPreviewMessage(message);
    setShowPreview(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  return {
    showPreview,
    previewMessage,
    handlePreviewMessage,
    closePreview
  };
};
