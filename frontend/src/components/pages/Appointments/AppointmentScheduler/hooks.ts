/**
 * AppointmentScheduler Custom Hooks
 *
 * Reusable hooks for managing scheduling state and side effects.
 */

import { useState, useCallback } from 'react';
import type { TimeSlot, Patient, Provider } from './types';

/**
 * Hook for managing time slot loading and state
 *
 * @param onLoadTimeSlots - Optional async function to load time slots
 * @returns Time slot state and loading function
 */
export const useTimeSlots = (
  onLoadTimeSlots?: (date: Date, providerId: string) => Promise<TimeSlot[]>
) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTimeSlots = useCallback(
    async (date: Date, providerId: string) => {
      if (!onLoadTimeSlots) {
        setAvailableTimeSlots([]);
        return;
      }

      setLoading(true);
      try {
        const slots = await onLoadTimeSlots(date, providerId);
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error('Failed to load time slots:', error);
        setAvailableTimeSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [onLoadTimeSlots]
  );

  return {
    availableTimeSlots,
    loading,
    loadTimeSlots
  };
};

/**
 * Generic hook for search functionality with results management
 *
 * @returns Search state and handlers
 */
export const useSearch = <T,>(
  onSearch?: (query: string) => Promise<T[]>
) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (query.length >= 2 && onSearch) {
        try {
          const results = await onSearch(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    },
    [onSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    showResults,
    setSearchQuery,
    setShowResults,
    handleSearch,
    clearSearch
  };
};

/**
 * Hook for managing scheduler form state
 *
 * @param initialValues - Initial form values
 * @returns Form state and handlers
 */
export const useSchedulerForm = (initialValues?: {
  appointmentType?: string;
  appointmentPriority?: string;
  duration?: number;
  isVirtual?: boolean;
}) => {
  const [appointmentType, setAppointmentType] = useState<string>(
    initialValues?.appointmentType || 'consultation'
  );
  const [appointmentPriority, setAppointmentPriority] = useState<string>(
    initialValues?.appointmentPriority || 'normal'
  );
  const [duration, setDuration] = useState<number>(
    initialValues?.duration || 30
  );
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isVirtual, setIsVirtual] = useState<boolean>(
    initialValues?.isVirtual || false
  );
  const [preparationInstructions, setPreparationInstructions] = useState<string[]>(['']);

  const resetForm = useCallback(() => {
    setAppointmentType(initialValues?.appointmentType || 'consultation');
    setAppointmentPriority(initialValues?.appointmentPriority || 'normal');
    setDuration(initialValues?.duration || 30);
    setReason('');
    setNotes('');
    setIsVirtual(initialValues?.isVirtual || false);
    setPreparationInstructions(['']);
  }, [initialValues]);

  return {
    appointmentType,
    appointmentPriority,
    duration,
    reason,
    notes,
    isVirtual,
    preparationInstructions,
    setAppointmentType,
    setAppointmentPriority,
    setDuration,
    setReason,
    setNotes,
    setIsVirtual,
    setPreparationInstructions,
    resetForm
  };
};
